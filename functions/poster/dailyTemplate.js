/**
 * Generates the HTML for a daily auto-post poster.
 * Target dimensions: 1080x1350 (Instagram/Facebook 4:5 feed).
 * Simpler than the admin poster: single sector, single page, single theme.
 */

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(d) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();
}

function formatRate(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return "₹" + Math.round(num).toLocaleString("en-IN");
}

function formatBaggage(value) {
  if (value === null || value === undefined || value === "") return "";
  const raw = String(value).trim();
  if (!raw || /^[-–—]+$/.test(raw)) return "";
  const isNumericKg = /^\d+(\.\d+)?(\s*kg)?$/i.test(raw);
  if (isNumericKg) {
    const parsed = parseFloat(raw.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? `${parsed}Kg` : "";
  }
  return raw.replace(/\s*kg\b/ig, "Kg").replace(/\s+/g, " ").trim();
}

function formatPosterBaggage(baggage, extraBaggage) {
  const parts = [formatBaggage(baggage), formatBaggage(extraBaggage)].filter(Boolean);
  return parts.length ? parts.join(" + ") : "—";
}

function formatCaptionDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date).replace(/\//g, ".");
}

/**
 * @param {{ sector: object, fares: object[], airlineMap: object, logoMap: object }} ctx
 * @returns {string} full HTML document (1080x1350)
 */
function buildDailyPosterHtml({ sector, fares, airlineMap, logoMap }) {
  const from = escapeHtml((sector.sectorFrom || "DEP").toUpperCase());
  const to = escapeHtml((sector.sectorTo || "ARR").toUpperCase());
  const code = escapeHtml(sector.sectorCode || "");

  const rows = fares.map((f, i) => {
    const bg = i % 2 === 0 ? "#ffffff" : "#f8fafc";
    const airline = airlineMap[f.airlineId];
    const logoUri = logoMap[f.airlineId];
    const dateLabel = formatDate(f._date);

    const airlineCell = logoUri
      ? `<img src="${logoUri}" style="height:34px;max-width:120px;object-fit:contain;display:block;margin:0 auto;">`
      : `<span style="font-weight:700;color:#0f172a;text-align:center;font-size:16px;">${escapeHtml(airline?.name || f.airlineId || "—")}</span>`;

    let timeCell = "<span style=\"color:#94a3b8;\">—</span>";
    if (f.flightTime) {
      const parts = String(f.flightTime).split("-").map((s) => s.trim());
      timeCell = `<span style="font-weight:700;font-size:16px;color:#0f172a;white-space:nowrap;">${escapeHtml(parts.join(" - "))}</span>`;
    }

    const baggageLabel = formatPosterBaggage(f.baggage, f.extraBaggage);
    const baggageCell = baggageLabel === "—"
      ? `<span style="color:#94a3b8;">—</span>`
      : `<span style="display:inline-block;background:rgba(37,99,235,0.12);color:#2563eb;padding:6px 12px;border-radius:9999px;font-weight:800;font-size:15px;white-space:nowrap;">${escapeHtml(baggageLabel)}</span>`;

    return `
      <tr style="background-color:${bg};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 14px;font-weight:800;color:#0f172a;font-size:17px;white-space:nowrap;">${dateLabel}</td>
        <td style="padding:16px 14px;text-align:center;vertical-align:middle;">${airlineCell}</td>
        <td style="padding:16px 14px;text-align:center;vertical-align:middle;">${timeCell}</td>
        <td style="padding:16px 14px;text-align:center;vertical-align:middle;">${baggageCell}</td>
        <td style="padding:16px 14px;text-align:right;vertical-align:middle;">
          <span style="display:inline-block;color:#0f172a;font-weight:900;font-size:20px;white-space:nowrap;">${formatRate(f.finalRate)}</span>
        </td>
      </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&family=Inter:wght@400;500;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; background: #ffffff; width: 1080px; height: 1350px; }
  </style>
</head>
<body>
  <div style="width:1080px;height:1350px;background:#ffffff;display:flex;flex-direction:column;overflow:hidden;">
    <div style="height:18px;background:linear-gradient(to right,#2563eb,#60a5fa,#1558c0);"></div>

    <div style="position:relative;height:320px;background:#1e293b;display:flex;align-items:center;justify-content:center;overflow:hidden;">
      <div style="position:absolute;inset:0;background:linear-gradient(to top,#1e293b,rgba(30,41,59,0.3));"></div>
      <div style="position:relative;z-index:10;text-align:center;padding:0 60px;">
        <div style="display:inline-block;background:rgba(37,99,235,0.25);border:1px solid rgba(37,99,235,0.4);padding:10px 28px;border-radius:9999px;color:#bfdbfe;font-weight:700;letter-spacing:0.06em;font-size:15px;margin-bottom:20px;text-transform:uppercase;">Today's Best Deals</div>
        <h1 style="color:#ffffff;font-size:78px;line-height:1;font-weight:900;margin-bottom:14px;letter-spacing:-0.03em;font-family:'Outfit',sans-serif;">${from} <span style="color:#60a5fa;">→</span> ${to}</h1>
        <p style="color:#dbeafe;font-size:22px;font-weight:500;letter-spacing:0.02em;">Fresh fares updated daily</p>
      </div>
    </div>

    <div style="padding:50px 60px;background:#f8fafc;flex:1;">
      <div style="background:#ffffff;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,0.06);border:1px solid #f1f5f9;padding:36px;">
        <table style="width:100%;text-align:left;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:2px solid #f1f5f9;">
              <th style="padding:12px 14px;color:#64748b;font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;">Date</th>
              <th style="padding:12px 14px;color:#64748b;font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;text-align:center;">Airline</th>
              <th style="padding:12px 14px;color:#64748b;font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;text-align:center;">Time</th>
              <th style="padding:12px 14px;color:#64748b;font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;text-align:center;">Baggage</th>
              <th style="padding:12px 14px;color:#64748b;font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;text-align:right;">Fare</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>

    <div style="background:#ffffff;padding:30px 60px;border-top:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:18px;">
        <span style="color:#1e293b;font-weight:900;font-size:26px;letter-spacing:-0.02em;font-family:'Outfit',sans-serif;">Zamra Travels</span>
        ${code ? `<span style="background:rgba(37,99,235,0.12);color:#2563eb;padding:6px 14px;border-radius:8px;font-weight:800;font-size:15px;">${code}</span>` : ""}
      </div>
      <div style="display:flex;align-items:center;gap:28px;color:#1e293b;font-weight:700;font-size:18px;">
        <span>📞 +91 98466 06739</span>
        <span>🌐 zamratravels.com</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function buildCaption({ sector, fares, customTemplate }) {
  const from = (sector.sectorFrom || "").trim();
  const to = (sector.sectorTo || "").trim();
  const code = (sector.sectorCode || "").trim();
  const cheapest = fares.length ? formatRate(fares[0].finalRate) : "";
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  if (customTemplate) {
    return customTemplate
      .replace(/\{today\}/g, formatCaptionDate())
      .replace(/\{from\}/g, from)
      .replace(/\{to\}/g, to)
      .replace(/\{code\}/g, code)
      .replace(/\{cheapest\}/g, cheapest);
  }

  return [
    `TODAY (${formatCaptionDate()})`,
    fromUpper && toUpper ? `Special fares ${fromUpper} → ${toUpper}!` : "Special fares available now!",
    "Book now at zamratravels.com",
    "Contact : 9846606739",
  ].join("\n");
}

module.exports = { buildDailyPosterHtml, buildCaption };
