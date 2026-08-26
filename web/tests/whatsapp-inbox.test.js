// Guards the WhatsApp tab's two pure helpers.
//
// renderMessageBody is the highest trust-boundary in the dashboard: unlike
// every other admin surface, its input is typed by strangers on the internet
// rather than by staff. Escaping has to happen before linkification, and the
// ordering is easy to reverse by accident while "improving" the regex.

import test from 'node:test';
import assert from 'node:assert/strict';

import { toChatId, describeStatus, renderMessageBody, normalizeAgentWhatsapp, normalizeAgentGroupId, normalizeSenderId, parseAddressList, describeBatchStatus, summarizeIntake } from '../src/js/admin/whatsapp.js';

test('toChatId accepts the shapes a human types', () => {
  assert.equal(toChatId('+91 98466 06731'), '919846606731@c.us');
  assert.equal(toChatId('9846606731'), '919846606731@c.us', 'a bare 10-digit number is Indian');
  assert.equal(toChatId('919846606731'), '919846606731@c.us');
  assert.equal(toChatId('919846606731@c.us'), '919846606731@c.us');
  assert.equal(toChatId('120363001234567890@g.us'), '120363001234567890@g.us');
});

test('toChatId returns null rather than guessing at junk', () => {
  for (const bad of ['', '   ', 'abc', '12@c.us', 'status@broadcast', '1/2@c.us', null, undefined]) {
    assert.equal(toChatId(bad), null, `${JSON.stringify(bad)} should not resolve`);
  }
});

test('describeStatus maps every session state to a tone', () => {
  assert.deepEqual(describeStatus('WORKING'), { label: 'Connected', tone: 'ok' });
  assert.equal(describeStatus('SCAN_QR_CODE').tone, 'warn');
  assert.equal(describeStatus('STOPPED').tone, 'bad');
  assert.equal(describeStatus('FAILED').tone, 'bad');
  assert.deepEqual(describeStatus('nonsense'), { label: 'Unknown', tone: 'warn' });
});

test('renderMessageBody escapes markup typed by a stranger', () => {
  const html = renderMessageBody('<img src=x onerror=alert(1)>');
  assert.match(html, /&lt;img/, 'the tag must be escaped');
  // The property that matters is that no angle bracket survives to open a tag.
  // `onerror=alert(1)` remaining as inert text is fine and expected.
  assert.ok(!html.includes('<'), 'a body with no URL must produce no markup at all');
  assert.equal(html, '&lt;img src=x onerror=alert(1)&gt;');
});

test('renderMessageBody escapes before it linkifies', () => {
  // The ordering bug: linkify first and the escaper then mangles the anchor it
  // just built, or worse, the tag rides through inside the URL match.
  const html = renderMessageBody('see https://zamratravels.com/deals <script>alert(1)</script>');
  assert.match(html, /<a href="https:\/\/zamratravels\.com\/deals"/, 'the URL should still linkify');
  assert.match(html, /&lt;script&gt;/, 'the script tag must be escaped');
  assert.ok(!html.includes('<script'), 'no live script tag may survive');
});

test('renderMessageBody leaves a plain body alone', () => {
  assert.equal(renderMessageBody('Fare for CCJ-DXB on 24th?'), 'Fare for CCJ-DXB on 24th?');
  assert.equal(renderMessageBody(''), '');
  assert.equal(renderMessageBody(null), '');
});

// ── normalizeAgentWhatsapp ──────────────────────────────────────────────────
// agents.whatsappChatId is the join key the Cloud Function matches inbound
// messages against, so this function and normalizeChatId in
// functions/whatsapp/normalize.js must agree byte for byte. Expectations are
// hardcoded in BOTH suites rather than derived, the same way the mirrored
// airline-baggage modules are pinned — a shared helper would let them drift
// together and still pass.

test('normalizeAgentWhatsapp matches the server chat id for every shape a human types', () => {
  assert.equal(normalizeAgentWhatsapp('+91 98466 06731'), '919846606731@c.us');
  assert.equal(normalizeAgentWhatsapp('9846606731'), '919846606731@c.us');
  assert.equal(normalizeAgentWhatsapp('919846606731'), '919846606731@c.us');
  assert.equal(normalizeAgentWhatsapp('919846606731@c.us'), '919846606731@c.us');
  assert.equal(normalizeAgentWhatsapp('  +91-98466-06731  '), '919846606731@c.us');
});

test('normalizeAgentWhatsapp refuses a group, because a supplier is never one', () => {
  // toChatId accepts group ids for the composer; linking one to an agent would
  // point rate intake at a group Zamra runs.
  assert.equal(toChatId('919846606731-1600000000@g.us'), '919846606731-1600000000@g.us');
  assert.equal(normalizeAgentWhatsapp('919846606731-1600000000@g.us'), null);
});

test('normalizeAgentWhatsapp returns null rather than guessing at junk', () => {
  assert.equal(normalizeAgentWhatsapp(''), null);
  assert.equal(normalizeAgentWhatsapp('   '), null);
  assert.equal(normalizeAgentWhatsapp('not a number'), null);
  assert.equal(normalizeAgentWhatsapp('12345'), null);
  assert.equal(normalizeAgentWhatsapp(null), null);
});

// ── rate intake panel helpers ───────────────────────────────────────────────

test('describeBatchStatus separates "failed" from "needs review"', () => {
  // Different actions: a failed batch saved nothing and can simply be resent,
  // while a stale one stopped mid-flight and its fares may already be live.
  assert.deepEqual(describeBatchStatus('done'), { label: 'Saved', tone: 'ok' });
  assert.deepEqual(describeBatchStatus('failed'), { label: 'Failed', tone: 'bad' });
  assert.deepEqual(describeBatchStatus('stale'), { label: 'Needs review', tone: 'bad' });
  assert.deepEqual(describeBatchStatus('claimed'), { label: 'Reading…', tone: 'warn' });
  assert.deepEqual(describeBatchStatus('nonsense'), { label: 'Unknown', tone: 'warn' });
  assert.deepEqual(describeBatchStatus(undefined), { label: 'Unknown', tone: 'warn' });
});

test('summarizeIntake reads a missing toggle as off, never as on', () => {
  // Automatic fare publishing must require an explicit opt-in, so an absent
  // field and an unset config both have to summarise as off.
  assert.equal(summarizeIntake({}, []).enabled, false);
  assert.equal(summarizeIntake(null, null).enabled, false);
  assert.equal(summarizeIntake({ rateIntakeEnabled: 'yes' }, []).enabled, false);
  assert.equal(summarizeIntake({ rateIntakeEnabled: true }, []).enabled, true);
});

test('summarizeIntake counts what the operator has to act on', () => {
  const summary = summarizeIntake(
    { rateIntakeEnabled: true, rateIntakeSavedTotal: 480 },
    [
      { status: 'done', saved: 12 },
      { status: 'done', saved: 7 },
      { status: 'claimed' },
      { status: 'stale' },
      { status: 'failed' },
      { status: 'empty', saved: 0 },
    ],
  );

  assert.equal(summary.running, 1);
  assert.equal(summary.needsReview, 2, 'stale and failed both need a human');
  assert.equal(summary.recentSaved, 19);
  assert.equal(summary.savedTotal, 480);
});

test('toChatId canonicalises the NOWEB form the server also accepts', () => {
  // Mirrors functions/whatsapp/normalize.js. Pinned in both suites rather than
  // shared, so the two cannot drift together and still pass.
  assert.equal(toChatId('919846606755@s.whatsapp.net'), '919846606755@c.us');
  assert.equal(normalizeAgentWhatsapp('919846606755@s.whatsapp.net'), '919846606755@c.us');
  // A LID is not a phone number, so it must never become an agent's link key.
  assert.equal(normalizeAgentWhatsapp('224876132614243@lid'), null);
});

// ── group intake addressing ─────────────────────────────────────────────────
//
// Three fields that look interchangeable and are not. Storing a number where a
// group belongs — or the reverse — produces a link that reads as configured in
// the form and matches nothing on the server, which is the worst failure shape
// available: silent.

test('normalizeAgentGroupId accepts only a group', () => {
  assert.equal(normalizeAgentGroupId('120363001234567890@g.us'), '120363001234567890@g.us');
  assert.equal(normalizeAgentGroupId('120363001234567890@G.US'), '120363001234567890@g.us');
  // A number typed into the group box would otherwise be coerced to @c.us and
  // stored as a "group" the server can never match.
  assert.equal(normalizeAgentGroupId('9846606731'), null);
  assert.equal(normalizeAgentGroupId('919846606731@c.us'), null);
  assert.equal(normalizeAgentGroupId(''), null);
});

test('normalizeSenderId accepts a LID, which normalizeAgentWhatsapp must not', () => {
  // A group sender is often addressed by an opaque LID, so for some suppliers
  // it is the only value that will ever match.
  assert.equal(normalizeSenderId('224876132614243@lid'), '224876132614243@lid');
  assert.equal(normalizeAgentWhatsapp('224876132614243@lid'), null, 'a supplier NUMBER is never a LID');
  assert.equal(normalizeSenderId('+91 98466 06731'), '919846606731@c.us');
  assert.equal(normalizeSenderId('120363001234567890@g.us'), null, 'a group is not a sender');
});

test('parseAddressList splits, normalises and de-duplicates', () => {
  const { ids, rejected } = parseAddressList(
    '120363001234567890@g.us\n 120363001234567890@G.US , 120363009999999999@g.us',
    normalizeAgentGroupId,
  );
  assert.deepEqual(ids, ['120363001234567890@g.us', '120363009999999999@g.us']);
  assert.deepEqual(rejected, []);
});

test('parseAddressList reports what it refused instead of dropping it', () => {
  // A silently discarded typo is a supplier whose sheets never arrive with
  // nothing anywhere explaining why.
  const { ids, rejected } = parseAddressList('120363001234567890@g.us  nonsense', normalizeAgentGroupId);
  assert.deepEqual(ids, ['120363001234567890@g.us']);
  assert.deepEqual(rejected, ['nonsense']);
});

test('parseAddressList treats an empty box as an empty list, not an error', () => {
  for (const empty of ['', '   ', '\n\n', null, undefined]) {
    assert.deepEqual(parseAddressList(empty, normalizeAgentGroupId), { ids: [], rejected: [] });
  }
});
