const P = portalContent;
const $ = id => document.getElementById(id);
$("welcome-link").href = P.welcomeLink;
if (!P.welcomeLink.startsWith("#")) { $("welcome-link").target = "_blank"; $("welcome-link").rel = "noopener"; }
$("contact-link").href = P.contactLink;

const isSoon = i => i.soon || (!i.items && !i.info && (!i.url || i.url === "#"));
const SVG = {
  chart: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M7 3h13l6 6v20H7z"/><path d="M20 3v6h6"/><path d="M11 15h10M11 19h10M11 23h6" stroke-linecap="round"/></svg>',
  uni: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 12 16 5l13 7z"/><path d="M6 14v11M12 14v11M20 14v11M26 14v11M3 27h26" stroke-linecap="round"/></svg>',
  kut: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><circle cx="16" cy="16" r="4"/><path d="M16 3l2.2 3.4 4-.9.9 4 3.4 2.2-2 3.5 2 3.5-3.4 2.2-.9 4-4-.9L16 29l-2.2-3.4-4 .9-.9-4L5.5 20.3l2-3.5-2-3.5L8.9 11l.9-4 4 .9z"/></svg>',
  sites: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><rect x="3" y="5" width="26" height="18" rx="1"/><path d="M11 28h10M16 23v5M3 11h26"/></svg>',
  learn: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><circle cx="16" cy="16" r="12"/><path d="M13 11l8 5-8 5z"/></svg>',
  shield: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M10 2 3.5 4.5v5c0 4 2.7 6.7 6.5 8 3.8-1.3 6.5-4 6.5-8v-5z"/><path d="M10 7v4M10 13.4v.1"/></svg>'
};
const icon = i => (P.icons[i.kind]
  ? `<span class="card-icon brand"><img src="${P.icons[i.kind]}" alt="" width="40" height="40"></span>`
  : `<span class="card-icon">${SVG[i.kind] || ""}</span>`);
const soonBadge = '<span class="soon-badge">به‌زودی</span>';
const vpn = `<div class="vpn">${SVG.shield}<span>${P.vpnNote}</span></div>`;

function cardInner(i, soon) {
  return `<div class="card-top">${icon(i)}<span class="card-tag">${i.label}</span></div>
    <h3>${i.title}</h3><p>${i.desc}</p>
    ${i.vpn ? vpn : ""}
    <div class="card-foot">${soon ? soonBadge : '<span class="go">باز کردن <i>←</i></span>'}</div>`;
}
$("link-cards").innerHTML = P.links.map((i, n) => {
  const cls = "portal-card" + (i.wide ? " wide" : "");
  if (i.items || i.info) return `<button type="button" class="${cls}" data-chart="${n}">${cardInner(i, false)}</button>`;
  if (isSoon(i)) return `<div class="${cls} is-soon" aria-disabled="true">${cardInner(i, true)}</div>`;
  return `<a class="${cls}" href="${i.url}" target="_blank" rel="noopener">${cardInner(i, false)}</a>`;
}).join("");

$("resource-cards").innerHTML = P.resources.map(i => {
  const inner = `<span class="nut" aria-hidden="true"></span><span class="res-text"><b>${i.title}</b><small>${i.desc}</small></span>${isSoon(i) ? soonBadge : ""}`;
  return isSoon(i) ? `<div class="resource-item is-soon" aria-disabled="true">${inner}</div>`
    : `<a class="resource-item" href="${i.url}" target="_blank" rel="noopener">${inner}</a>`;
}).join("");

/* پنجره انتخاب چارت */
const modal = $("modal"), body = $("modal-body");
let lastFocus = null;
const infoHtml = f => (f.facts ? `<dl class="facts">${f.facts.map(x => `<div><dt>${x.k}</dt><dd>${x.v}</dd></div>`).join("")}</dl>` : "")
  + (f.bullets ? `<div class="phones"><h4>${f.bulletsTitle}</h4><ul class="plain">${f.bullets.map(b => `<li>${b}</li>`).join("")}</ul>${f.link ? `<a class="text-link" href="${f.link.url}" target="_blank" rel="noopener">${f.link.text} ←</a>` : ""}</div>` : "")
  + (f.sites ? f.sites.map(s => `<a class="chart-row site-row" href="${s.url}" target="_blank" rel="noopener"><span><b>${s.name}</b><small>${s.desc}</small><bdi class="site-url" dir="ltr">${s.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</bdi></span><span class="go">ورود <i>←</i></span></a>`).join("") : "")
  + (f.table ? `<div class="phones"><h4>${f.tableTitle}</h4><table class="labs"><tbody>${f.table.map(r => `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td></tr>`).join("")}</tbody></table><p class="lab-note">${f.tableNote}</p></div>` : "")
  + (f.people ? f.people.map(p => `<div class="chart-row"><span><b>${p.name}</b><small>${p.role}</small></span><span class="ext">${p.ext ? "داخلی: <bdi>" + p.ext + "</bdi>" : "داخلی: —"}</span></div>`).join("") : "")
  + (f.phones ? `<div class="phones"><h4>${f.phonesTitle}</h4><div class="phone-grid">${f.phones.map(n => `<a href="tel:${n}" dir="ltr">${n}</a>`).join("")}</div></div>` : "");
function openModal(i) {
  lastFocus = document.activeElement;
  $("modal-title").textContent = i.title;
  $("modal-kicker").textContent = i.items ? "CURRICULUM CHARTS / چارت‌ها" : (i.kind === "kut" ? "ABOUT / درباره رشته" : i.kind === "sites" ? "UNIVERSITY SYSTEMS / سامانه‌ها" : "UNIVERSITY INFO / اطلاعات");
  body.innerHTML = i.items ? i.items.map(c => c.file
    ? `<a class="chart-row" href="${c.file}" target="_blank" rel="noopener"><span><b>${c.title}</b><small>${c.desc}</small></span><span class="go">مشاهده <i>←</i></span></a>`
    : `<div class="chart-row is-soon"><span><b>${c.title}</b><small>${c.desc}</small></span>${soonBadge}</div>`).join("")
    : infoHtml(i.info);
  modal.hidden = false; document.body.classList.add("lock");
  $("modal-close").focus();
}
function closeModal() { modal.hidden = true; document.body.classList.remove("lock"); if (lastFocus) lastFocus.focus(); }
document.querySelectorAll("[data-chart]").forEach(b => b.addEventListener("click", () => openModal(P.links[b.dataset.chart])));
$("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
