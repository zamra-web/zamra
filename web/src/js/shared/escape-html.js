/**
 * escape-html.js — the one HTML escaper for the browser surfaces.
 *
 * Every builder that interpolates a value into markup it did not author should
 * go through this, so there is a single implementation to audit.
 *
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}
