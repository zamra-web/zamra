import"./firebase-config-zYKzaodH.js";import{o as ve,l as we}from"./auth-kyPpTIkn.js";import{a as ce,d as $e,u as Ee,c as ge,e as Ce,f as Ie,h as ke,i as Be,j as Se,g as oe,k as Le,l as Ae,m as Te,n as Fe,b as ne,o as Me,p as De,q as Re,r as Ne}from"./db-DN85Zd7Y.js";let L=[],B=[],S=[],C=[],T={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},reportFares:{key:"flightDate",asc:!0}},X={sectors:"",airlines:""},q={agents:10,sectors:10,airlines:10,reportFares:20},v={agents:1,sectors:1,airlines:1,reportFares:1};function re(e,t){var a;let o=e;const n=(a=X[t])==null?void 0:a.toLowerCase();n&&t==="agents"?o=o.filter(d=>(d.name||"").toLowerCase().includes(n)||(d.email||"").toLowerCase().includes(n)||(d.contactPhone||"").toLowerCase().includes(n)||(d.id||"").toLowerCase().includes(n)):n&&t==="sectors"?o=o.filter(d=>(d.sectorFrom||"").toLowerCase().includes(n)||(d.sectorTo||"").toLowerCase().includes(n)||(d.sectorCode||"").toLowerCase().includes(n)):n&&t==="airlines"&&(o=o.filter(d=>(d.name||"").toLowerCase().includes(n)||(d.code||"").toLowerCase().includes(n)));const{key:r,asc:s}=T[t];return r&&(o=[...o].sort((d,i)=>{let c=d[r],l=i[r];if(c instanceof Date&&(c=c.getTime()),l instanceof Date&&(l=l.getTime()),r==="id"){const p=parseInt(c),g=parseInt(l);if(!isNaN(p)&&!isNaN(g))return s?p-g:g-p}return typeof c=="string"&&(c=c.toLowerCase()),typeof l=="string"&&(l=l.toLowerCase()),c<l?s?-1:1:c>l?s?1:-1:0})),o}function Z(e){document.querySelectorAll(`th[data-sort-tab="${e}"] i`).forEach(o=>{o.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const t=document.querySelector(`th[data-sort-tab="${e}"][data-sort-key="${T[e].key}"]`);if(t){const o=t.querySelector("i");o&&(o.className=`bi bi-arrow-${T[e].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",e=>{const t=e.target.closest("th[data-sort-tab]");if(!t)return;const o=t.dataset.sortTab,n=t.dataset.sortKey;T[o].key===n?T[o].asc=!T[o].asc:(T[o].key=n,T[o].asc=!0),o==="agents"?F(!1):o==="sectors"?M(!1):o==="airlines"?_(!1):o==="reportFares"&&C.length&&K(C)});document.documentElement.style.visibility="hidden";ve(async e=>{if(!e){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const t=document.getElementById("admin-user-name");t&&(t.textContent=e.email.split("@")[0]),await He(),st(),await pe()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("admin-logout-btn");e&&e.addEventListener("click",async()=>{(await we()).success&&(window.location.href="/login.html")}),Oe(),je(),rt()});async function He(){try{[L,B,S]=await Promise.all([ge(),oe(),ne()])}catch(e){console.error("loadGlobalData error:",e)}}function je(){const e=document.querySelectorAll(".nav-link"),t=document.querySelectorAll(".tab-content"),o=document.getElementById("page-title");e.forEach(n=>{n.addEventListener("click",async r=>{var d;r.preventDefault(),e.forEach(i=>{i.classList.remove("active","text-primary"),i.classList.add("text-gray-500")}),n.classList.remove("text-gray-500"),n.classList.add("active","text-primary");const s=n.getAttribute("data-tab"),a=n.getAttribute("data-title");t.forEach(i=>i.classList.remove("active")),(d=document.getElementById(s))==null||d.classList.add("active"),o&&a&&(o.textContent=a),await pe()})})}async function pe(){const e=document.querySelector(".tab-content.active");if(!e)return;const t=e.id;t==="agents-tab"?await F():t==="sectors-tab"?await M():t==="flights-tab"?await _():t==="dashboard-tab"?await Ue():t==="reports-tab"?await Ve():t==="eticket-tab"&&await lt()}function Oe(){const e=document.getElementById("admin-modal"),t=document.getElementById("modal-close-btn");t&&t.addEventListener("click",()=>e.close()),e==null||e.addEventListener("click",o=>{o.target===e&&e.close()})}function se(e,t){const o=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=e,document.getElementById("modal-body").innerHTML=t,o.showModal()}async function Ue(){var n,r;if(!document.getElementById("dashboard-tab"))return;const t=document.getElementById("poster-sector-sel");t&&t.options.length<=1&&B.forEach(s=>{const a=new Option(`${s.sectorFrom} ✈ ${s.sectorTo} (${s.sectorCode})`,s.id);t.appendChild(a)});const o=document.getElementById("poster-generate-btn");o&&!o.dataset.wired&&(o.dataset.wired="1",o.addEventListener("click",async()=>{const s=document.getElementById("poster-start-date"),a=document.getElementById("poster-end-date"),d=t==null?void 0:t.value,i=(s==null?void 0:s.value)||null,c=(a==null?void 0:a.value)||null;if(!d){x("warning","Validation Error","Please select a sector to generate the poster.");return}o.disabled=!0,o.textContent="Generating…";try{const l=await ce({sectorId:d,startDate:i,endDate:c,includeHidden:!1});if(!l||!l.length){x("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await Pe(l,d)}catch(l){x("error","Generation Failed",l.message)}finally{o.disabled=!1,o.textContent="Generate Poster"}}),(n=document.getElementById("poster-download-jpg"))==null||n.addEventListener("click",()=>ie("jpeg")),(r=document.getElementById("poster-download-pdf"))==null||r.addEventListener("click",()=>ie("pdf")))}async function Pe(e,t){const o=document.getElementById("poster-preview-container"),n=document.getElementById("poster-fares-tbody"),r=document.getElementById("poster-sector-title");if(!o||!n||!r)return;const s=B.find(g=>g.id===t),a=s?s.sectorCode.split(" "):["",""];r.innerHTML=`${a[0]||"DEP"} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${a[1]||"ARR"}`;const d=[...e].sort((g,u)=>{let y=g.flightDate,b=u.flightDate;return y instanceof Date&&(y=y.getTime()),b instanceof Date&&(b=b.getTime()),y-b}).slice(0,10),i=Object.fromEntries(S.map(g=>[g.id,g]));async function c(g){try{const u=await fetch(g);if(!u.ok)return null;const y=await u.blob();return URL.createObjectURL(y)}catch{return null}}const l=[...new Set(d.map(g=>g.airlineId))].map(g=>i[g]).filter(g=>g==null?void 0:g.logoUrl),p={};await Promise.all(l.map(async g=>{const u=await c(g.logoUrl);u&&(p[g.id]=u)})),n.innerHTML=d.map((g,u)=>{const y=g.flightDate instanceof Date?g.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():g.flightDate,b=i[g.airlineId],$=u%2===0?"#ffffff":"#f8fafc",I=p[g.airlineId]||null,k=I?`<img src="${I}" style="height:40px;max-width:100px;object-fit:contain;display:block;margin:0 auto;" alt="${(b==null?void 0:b.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:15px;white-space:nowrap;">${(b==null?void 0:b.name)||g.airlineId||"—"}</span>`;let m='<span style="color:#94a3b8;font-size:14px;">—</span>';if(g.flightTime){const f=g.flightTime.split("-").map(h=>h.trim());f.length>=2?m=`
          <div style="display:flex;flex-direction:column;align-items:center;gap:2px;line-height:1.2;">
            <span style="font-weight:800;font-size:17px;color:#0f172a;">${f[0]}</span>
            <span style="font-size:11px;color:#94a3b8;font-weight:600;">&#8595;</span>
            <span style="font-weight:800;font-size:17px;color:#0c4a8a;">${f[1]}</span>
          </div>`:m=`<span style="font-weight:700;font-size:17px;color:#0f172a;">${g.flightTime}</span>`}return`
      <tr style="background-color:${$};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 12px;font-weight:900;color:#0f172a;font-size:22px;white-space:nowrap;">${y}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${k}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${m}</td>
        <td style="padding:16px 12px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:8px 18px;border-radius:12px;font-weight:900;font-size:22px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            &#8377;${(g.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),o.classList.remove("hidden"),o.classList.add("flex")}function ue(e){if(!e||e.nodeType!==1)return;const t=window.getComputedStyle(e),o=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const n of o){const r=t.getPropertyValue(n);if(r&&!r.startsWith("rgb")&&!r.startsWith("#")&&r!=="transparent"&&r!=="initial")try{e.style[n]=r}catch{}}for(const n of e.children)ue(n)}async function ie(e){const t=document.getElementById("poster-render-frame");if(!t)return;const o=document.getElementById("poster-download-jpg"),n=document.getElementById("poster-download-pdf");o&&(o.disabled=!0),n&&(n.disabled=!0);const r=t.style.transform;t.style.transform="none",x("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(t.querySelectorAll("img")).map(d=>d.complete?Promise.resolve():new Promise(i=>{d.onload=i,d.onerror=i})));const s=await html2canvas(t,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:d=>{const i=d.getElementById("poster-render-frame");i&&ue(i)}});t.style.transform=r;const a=s.toDataURL("image/jpeg",.95);if(e==="jpeg"){const d=document.createElement("a");d.download=`zamra-poster-${Date.now()}.jpg`,d.href=a,d.click(),x("success","Downloaded!","JPEG poster saved successfully.")}else if(e==="pdf"){const d=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!d)throw new Error("jsPDF library not loaded.");const i=96/25.4,c=s.width/2/i,l=s.height/2/i,p=new d({orientation:c>l?"landscape":"portrait",unit:"mm",format:[c,l]});p.addImage(a,"JPEG",0,0,c,l),p.save(`zamra-poster-${Date.now()}.pdf`),x("success","Downloaded!","PDF poster saved successfully.")}}catch(s){console.error("Poster export error:",s),t.style.transform=r,x("error","Export Failed",s.message||"There was an error generating the export.")}finally{o&&(o.disabled=!1),n&&(n.disabled=!1)}}function K(e){const t=document.getElementById("report-fares-results");if(!t)return;if(!e||!e.length){t.innerHTML=`<div class="text-center text-text-muted py-14 px-4">
      <div class="inline-flex flex-col items-center gap-3 opacity-50">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <i class="bi bi-inbox text-3xl text-slate-400"></i>
        </div>
        <p class="font-semibold text-[14px]">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const o=Object.fromEntries(L.map(u=>[u.id,u.name])),n=Object.fromEntries(B.map(u=>[u.id,u.sectorCode])),r=Object.fromEntries(S.map(u=>[u.id,u.code])),{key:s,asc:a}=T.reportFares,d=[...e].sort((u,y)=>{let b=u[s],$=y[s];return b instanceof Date&&(b=b.getTime()),$ instanceof Date&&($=$.getTime()),typeof b=="string"&&(b=b.toLowerCase()),typeof $=="string"&&($=$.toLowerCase()),b<$?a?-1:1:b>$?a?1:-1:0}),i=q.reportFares,c=Math.max(1,Math.ceil(e.length/i));v.reportFares>c&&(v.reportFares=c);const l=(v.reportFares-1)*i,p=d.slice(l,l+i),g=(u,y)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${u}">${y} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;t.innerHTML=`
    <div class="admin-table-container overflow-x-auto w-full rounded-none border-0 shadow-none">
      <table class="admin-table w-full text-sm">
        <thead><tr>
          ${g("flightDate","Date")}
          ${g("flightTime","Time")}
          ${g("sectorId","Sector")}
          ${g("airlineId","Airline")}
          ${g("agentId","Agent")}
          ${g("specialRate","SP Rate (₹)")}
          ${g("finalRate","Rate (₹)")}
          ${g("commission","Comm (₹)")}
          ${g("baggage","Bag")}
          ${g("extraBaggage","Ex.Bag")}
          ${g("isHidden","Status")}
          <th class="whitespace-nowrap">Actions</th>
        </tr></thead>
        <tbody>
          ${p.map((u,y)=>{const b=u.flightDate instanceof Date?u.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):u.flightDate||"—";return`<tr class="${y%2===1?"bg-slate-50/60":""} hover:bg-blue-50/40 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${b}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${u.flightTime||"—"}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${n[u.sectorId]||u.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${r[u.airlineId]||u.airlineId}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${o[u.agentId]||u.agentId}</td>
              <td class="whitespace-nowrap text-[13px] text-text-muted">₹${(u.specialRate||0).toLocaleString()}</td>
              <td class="whitespace-nowrap font-black text-navy text-[14px]">₹${(u.finalRate||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px] text-text-muted">₹${(u.commission||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px]">${u.baggage?u.baggage+" kg":"—"}</td>
              <td class="whitespace-nowrap text-[12px]">${u.extraBaggage?u.extraBaggage+" kg":"—"}</td>
              <td class="whitespace-nowrap">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${u.isHidden?"bg-red-100 text-red-600":"bg-green-100 text-green-700"}">
                  ${u.isHidden?"● Hidden":"● Live"}
                </span>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  <button onclick="window.__toggleFare('${u.id}', ${!u.isHidden})"
                    class="${u.isHidden?"bg-green-50 text-green-700 border-green-200 hover:bg-green-500":"bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-500"} border px-2.5 py-1 rounded-lg text-[11px] font-bold hover:text-white transition-colors">
                    ${u.isHidden?"Show":"Hide"}
                  </button>
                  <button onclick="window.__deleteFare('${u.id}')"
                    class="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-red-500 hover:text-white transition-colors">Del</button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,Q("reportFares",e.length,c,l,i),window.__deleteFare=async u=>{if(confirm("Delete this fare?"))try{await $e(u),C=C.filter(y=>y.id!==u),x("success","Deleted","Fare removed."),K(C)}catch(y){x("error","Error",y.message)}},window.__toggleFare=async(u,y)=>{try{await Ee(u,{isHidden:y}),C=C.map(b=>b.id===u?{...b,isHidden:y}:b),x("success","Updated",`Fare ${y?"hidden":"shown"}.`),K(C)}catch(b){x("error","Error",b.message)}},Z("reportFares")}async function F(e=!0){e&&(L=await ge(),v.agents=1);const t=document.querySelector("#agents-tab .admin-table tbody");if(!t)return;const o=document.getElementById("agents-search"),n=document.getElementById("agents-limit");o&&!o.dataset.wired&&(o.dataset.wired="1",n&&(n.dataset.wired="1"),o.addEventListener("input",l=>{X.agents=l.target.value,v.agents=1,F(!1)}),n&&n.addEventListener("change",l=>{q.agents=parseInt(l.target.value),v.agents=1,F(!1)}));const r=re(L,"agents"),s=q.agents,a=Math.max(1,Math.ceil(r.length/s));v.agents>a&&(v.agents=a);const d=(v.agents-1)*s,i=r.slice(d,d+s);t.innerHTML=i.length?i.map(l=>qe(l)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',Q("agents",r.length,a,d,s),delete t.dataset.actionsWired,_e(),ze(),Ge();const c=document.getElementById("agents-add-btn");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>me(null))),Z("agents")}function qe(e){const t=e.isActive!==!1?'<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700">Active</span>':'<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-600">Hidden</span>',o=e.commission!==void 0?`₹${Number(e.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id.slice(0,8)}…</td>
    <td class="font-semibold">${e.name}</td>
    <td>${e.email||"—"}</td>
    <td>${e.contactPhone||"—"}</td>
    <td class="font-semibold text-navy">${o}</td>
    <td>${t}</td>
    <td class="flex gap-1 flex-wrap">
      <button data-action="edit-agent" data-id="${e.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-agent" data-id="${e.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
      <button data-action="toggle-agent" data-id="${e.id}" data-active="${e.isActive!==!1}"
        class="px-3 py-1 rounded text-[12px] font-bold ${e.isActive!==!1?"bg-slate-400 text-white hover:bg-slate-500":"bg-green-500 text-white hover:bg-green-600"}">
        ${e.isActive!==!1?"Hide Fares":"Show Fares"}</button>
    </td>
  </tr>`}function _e(){const e=document.querySelector("#agents-tab .admin-table tbody");!e||e.dataset.actionsWired||(e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const o=t.target.closest("[data-action]");if(!o)return;const n=o.dataset.action,r=o.dataset.id,s=L.find(a=>a.id===r);if(n==="edit-agent"&&me(s),n==="delete-agent"){if(!confirm(`Delete agent "${s==null?void 0:s.name}"? This does NOT delete their fares.`))return;try{await Ce(r),x("success","Deleted",`Agent "${s==null?void 0:s.name}" removed.`),await F()}catch(a){x("error","Error",a.message)}}if(n==="toggle-agent"){const d=!(o.dataset.active==="true");o.disabled=!0,o.textContent="Working…";try{const i=await Ie(r,d);x("success",d?"Agent Shown":"Agent Hidden",i.message),await F()}catch(i){x("error","Toggle Failed",i.message),await F()}}}))}function Q(e,t,o,n,r){const s=document.getElementById(`${e}-pagination-footer`);if(!s)return;const a=Math.min(n+r,t),d=v[e];s.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${t?n+1:0} to ${a} of ${t} entries</span>
      <div class="flex items-center gap-1 ml-4 shadow-[var(--shadow-premium-soft)] rounded">
        <button data-pg-action="prev" class="px-3 py-1.5 border border-border rounded-l bg-white text-sm font-semibold hover:bg-slate-50 hover:text-navy disabled:opacity-40 premium-transition" ${d<=1?"disabled":""}>Previous</button>
        ${Array.from({length:o},(i,c)=>c+1).map(i=>`<button data-pg-action="goto" data-pg="${i}" class="px-3 py-1.5 border-y border-r border-border text-sm font-bold bg-white premium-transition ${i===d?"text-primary bg-primary-light shadow-inner border-primary/20 relative z-10":"text-text-mid hover:bg-slate-50 hover:text-navy"}">${i}</button>`).join("")}
        <button data-pg-action="next" class="px-3 py-1.5 border-y border-r border-border rounded-r bg-white text-sm font-semibold hover:bg-slate-50 hover:text-navy disabled:opacity-40 premium-transition" ${d>=o?"disabled":""}>Next</button>
      </div>
    </div>`,s.dataset.wired||(s.dataset.wired="1",s.addEventListener("click",i=>{const c=i.target.closest("[data-pg-action]");if(!c||c.disabled)return;const l=c.dataset.pgAction;l==="prev"?v[e]=Math.max(1,v[e]-1):l==="next"?v[e]++:l==="goto"&&(v[e]=parseInt(c.dataset.pg)),e==="agents"?F(!1):e==="sectors"?M(!1):e==="airlines"?_(!1):e==="reportFares"&&K(C)}))}function me(e){var o,n;const t=!!e;se(t?"Edit Agent":"Add New Agent",`
    <form id="agent-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Agent ID *</label>
        <input name="id" required value="${(e==null?void 0:e.id)||""}" placeholder="e.g. AGENT1"
          ${t?'readonly class="w-full bg-slate-100 border border-border rounded-lg h-11 px-3 text-sm focus:outline-none cursor-not-allowed text-slate-500"':'class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"'}>
        ${t?'<p class="text-[11px] text-text-soft mt-1">Agent ID cannot be changed after creation.</p>':""}
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Name *</label>
        <input name="name" required value="${(e==null?void 0:e.name)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Email</label>
        <input name="email" type="email" value="${(e==null?void 0:e.email)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Phone</label>
        <input name="contactPhone" value="${(e==null?void 0:e.contactPhone)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Commission (₹) *</label>
        <input name="commission" type="number" min="0" required value="${(e==null?void 0:e.commission)!==void 0?e.commission:500}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          placeholder="e.g. 500">
        <p class="text-[11px] text-text-soft mt-1">This commission is auto-applied to all fares ingested for this agent.</p>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit"
          class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 transition-all text-sm">
          ${t?"Save Changes":"Add Agent"}
        </button>
        <button type="button" id="modal-cancel"
          class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`),(o=document.getElementById("modal-cancel"))==null||o.addEventListener("click",()=>document.getElementById("admin-modal").close()),(n=document.getElementById("agent-form"))==null||n.addEventListener("submit",async r=>{r.preventDefault();const s=new FormData(r.target),a=Object.fromEntries(s.entries()),d=r.target.querySelector("[type=submit]");d.disabled=!0,d.textContent="Saving…";try{t?(await ke(e.id,a),x("success","Updated",`Agent "${a.name}" updated.`)):(await Be(a),x("success","Added",`Agent "${a.name}" added.`)),document.getElementById("admin-modal").close(),await F()}catch(i){x("error","Save Failed",i.message),d.disabled=!1,d.textContent=t?"Save Changes":"Add Agent"}})}function ze(){const e=document.getElementById("agents-bulk-delete-btn");!e||e.dataset.wired||(e.dataset.wired="1",e.addEventListener("click",async()=>{const t=document.getElementById("agents-bulk-agent-sel"),o=document.getElementById("agents-bulk-sector-sel"),n=document.getElementById("agents-bulk-start"),r=document.getElementById("agents-bulk-end"),s=(t==null?void 0:t.value)||null,a=(o==null?void 0:o.value)||null,d=(n==null?void 0:n.value)||null,i=(r==null?void 0:r.value)||null;if(!(s&&s!=="all"||a&&a!=="all"||d||i)){x("warning","No Filter","Select at least an agent, a sector, or a date range before deleting.");return}const l=[];if(s&&s!=="all"&&l.push(`Agent: ${t.options[t.selectedIndex].text}`),a&&a!=="all"&&l.push(`Sector: ${o.options[o.selectedIndex].text}`),d&&l.push(`from ${d}`),i&&l.push(`to ${i}`),!!confirm(`Delete ALL matching fares?
${l.join(" · ")}

This cannot be undone.`)){e.disabled=!0,e.textContent="Deleting…";try{const p=await Se(s,d,i,a);x("success","Bulk Delete Complete",p.message)}catch(p){x("error","Bulk Delete Failed",p.message)}finally{e.disabled=!1,e.textContent="Bulk Delete"}}}))}function Ge(){const e=document.getElementById("agents-bulk-agent-sel");if(e){const o=e.value;e.innerHTML='<option value="">All Agents</option>',L.forEach(n=>e.appendChild(new Option(n.name,n.id))),o&&(e.value=o)}const t=document.getElementById("agents-bulk-sector-sel");if(t){const o=t.value;t.innerHTML='<option value="">All Sectors</option>',B.forEach(n=>t.appendChild(new Option(n.sectorCode,n.id))),o&&(t.value=o)}}async function M(e=!0){e&&(B=await oe(),v.sectors=1);const t=document.getElementById("sectors-search"),o=document.getElementById("sectors-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",o.dataset.wired="1",t.addEventListener("input",l=>{X.sectors=l.target.value,v.sectors=1,M(!1)}),o.addEventListener("change",l=>{q.sectors=parseInt(l.target.value),v.sectors=1,M(!1)}));const n=document.querySelector("#sectors-tab .admin-table tbody");if(!n)return;const r=re(B,"sectors"),s=q.sectors,a=Math.max(1,Math.ceil(r.length/s));v.sectors>a&&(v.sectors=a);const d=(v.sectors-1)*s,i=r.slice(d,d+s);n.innerHTML=i.length?i.map(l=>Je(l)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',Q("sectors",r.length,a,d,s),Ke();const c=document.querySelector("#sectors-tab .flex.justify-between button");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>fe(null))),Z("sectors")}function Je(e){return`<tr data-sector-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id.slice(0,8)}…</td>
    <td class="font-semibold">${e.sectorFrom}</td>
    <td class="font-semibold">${e.sectorTo}</td>
    <td><span class="font-mono font-bold text-primary">${e.sectorCode}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-sector" data-id="${e.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-sector" data-id="${e.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
      <button data-action="toggle-sector" data-id="${e.id}" data-hidden="${e.isHidden===!0}"
        class="px-3 py-1 rounded text-[12px] font-bold ${e.isHidden===!0?"bg-green-500 text-white hover:bg-green-600":"bg-slate-400 text-white hover:bg-slate-500"}">
        ${e.isHidden===!0?"Show Fares":"Hide Fares"}</button>
    </td>
  </tr>`}function Ke(){const e=document.querySelector("#sectors-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const o=t.target.closest("[data-action]");if(!o)return;const{action:n,id:r}=o.dataset,s=B.find(a=>a.id===r);if(n==="edit-sector"&&fe(s),n==="delete-sector"){if(!confirm(`Delete sector "${s==null?void 0:s.sectorCode}"?`))return;try{await Le(r),x("success","Deleted",`Sector "${s==null?void 0:s.sectorCode}" removed.`),await M()}catch(a){x("error","Error",a.message)}}if(n==="toggle-sector"){const d=!(o.dataset.hidden==="true");o.disabled=!0,o.textContent="Working…";try{const i=await Ae(r,d);x("success",`Sector Fares ${d?"Hidden":"Shown"}`,i.message),await M()}catch(i){x("error","Toggle Failed",i.message),await M()}}}))}function fe(e){var o,n;const t=!!e;se(t?"Edit Sector":"Add New Sector",`
    <form id="sector-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">From City *</label>
        <input name="sectorFrom" required placeholder="e.g. Kozhikode" value="${(e==null?void 0:e.sectorFrom)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">To City *</label>
        <input name="sectorTo" required placeholder="e.g. Jeddah" value="${(e==null?void 0:e.sectorTo)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Sector Code *</label>
        <input name="sectorCode" required placeholder="e.g. CCJ JED" value="${(e==null?void 0:e.sectorCode)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono tracking-wide">
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 text-sm">
          ${t?"Save Changes":"Add Sector"}
        </button>
        <button type="button" id="modal-cancel" class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`),(o=document.getElementById("modal-cancel"))==null||o.addEventListener("click",()=>document.getElementById("admin-modal").close()),(n=document.getElementById("sector-form"))==null||n.addEventListener("submit",async r=>{r.preventDefault();const s=new FormData(r.target),a=Object.fromEntries(s.entries());a.sectorCode=a.sectorCode.toUpperCase(),a.sectorFrom=a.sectorFrom.toUpperCase(),a.sectorTo=a.sectorTo.toUpperCase();const d=r.target.querySelector("[type=submit]");d.disabled=!0,d.textContent="Saving…";try{t?(await Te(e.id,a),x("success","Updated","Sector updated.")):(await Fe(a),x("success","Added",`Sector "${a.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await M()}catch(i){x("error","Save Failed",i.message),d.disabled=!1,d.textContent=t?"Save Changes":"Add Sector"}})}async function _(e=!0){e&&(S=await ne(),v.airlines=1);const t=document.getElementById("airlines-search"),o=document.getElementById("airlines-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",o.dataset.wired="1",t.addEventListener("input",l=>{X.airlines=l.target.value,v.airlines=1,_(!1)}),o.addEventListener("change",l=>{q.airlines=parseInt(l.target.value),v.airlines=1,_(!1)}));const n=document.querySelector("#flights-tab .admin-table tbody");if(!n)return;const r=re(S,"airlines"),s=q.airlines,a=Math.max(1,Math.ceil(r.length/s));v.airlines>a&&(v.airlines=a);const d=(v.airlines-1)*s,i=r.slice(d,d+s);n.innerHTML=i.length?i.map(l=>We(l)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "+ Add Flight".</td></tr>',Q("airlines",r.length,a,d,s),Ye();const c=document.querySelector("#flights-tab .flex.justify-between button");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>be(null))),Z("airlines")}function We(e){const t=e.logoUrl?`<img src="${e.logoUrl}" class="h-7 w-7 object-contain rounded" alt="${e.name}">`:`<span class="w-7 h-7 bg-primary-light text-primary text-xs font-bold rounded flex items-center justify-center">${e.code}</span>`;return`<tr data-airline-id="${e.id}">
    <td>${t}</td>
    <td class="font-semibold">${e.name}</td>
    <td><span class="font-mono font-bold text-primary">${e.code}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-airline" data-id="${e.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-airline" data-id="${e.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
    </td>
  </tr>`}function Ye(){const e=document.querySelector("#flights-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const o=t.target.closest("[data-action]");if(!o)return;const{action:n,id:r}=o.dataset,s=S.find(a=>a.id===r);if(n==="edit-airline"&&be(s),n==="delete-airline"){if(!confirm(`Delete airline "${s==null?void 0:s.name}" (${s==null?void 0:s.code})?`))return;try{await Me(r),x("success","Deleted",`Airline "${s==null?void 0:s.name}" removed.`),await _()}catch(a){x("error","Error",a.message)}}}))}function be(e){var o,n;const t=!!e;se(t?"Edit Airline":"Add New Airline",`
    <form id="airline-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Airline Name *</label>
        <input name="name" required placeholder="e.g. Air India Express" value="${(e==null?void 0:e.name)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">IATA Code *</label>
        <input name="code" required maxlength="3" placeholder="e.g. IX" value="${(e==null?void 0:e.code)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono tracking-widest uppercase">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Logo (optional)</label>
        <input type="file" name="logoFile" accept="image/*"
          class="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary cursor-pointer">
        ${e!=null&&e.logoUrl?`<img src="${e.logoUrl}" class="mt-2 h-8 object-contain rounded" alt="current logo">`:""}
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 text-sm">
          ${t?"Save Changes":"Add Airline"}
        </button>
        <button type="button" id="modal-cancel" class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`),(o=document.getElementById("modal-cancel"))==null||o.addEventListener("click",()=>document.getElementById("admin-modal").close()),(n=document.getElementById("airline-form"))==null||n.addEventListener("submit",async r=>{var c;r.preventDefault();const s=new FormData(r.target),a=((c=s.get("logoFile"))==null?void 0:c.size)>0?s.get("logoFile"):null,d={name:s.get("name"),code:s.get("code").toUpperCase()},i=r.target.querySelector("[type=submit]");i.disabled=!0,i.textContent="Saving…";try{t?(await De(e.id,d,a),x("success","Updated","Airline updated.")):(await Re(d,a),x("success","Added",`Airline "${d.name}" added.`)),document.getElementById("admin-modal").close(),await _()}catch(l){x("error","Save Failed",l.message),i.disabled=!1,i.textContent=t?"Save Changes":"Add Airline"}})}async function Ve(){const e=document.getElementById("reports-tab");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=document.getElementById("reports-sector-sel");t&&t.options.length<=1&&B.forEach(a=>t.appendChild(new Option(a.sectorCode,a.id)));const o=document.getElementById("reports-agent-sel");o&&o.options.length<=1&&L.forEach(a=>o.appendChild(new Option(a.name,a.id)));const n=document.getElementById("generate-report-btn"),r=document.getElementById("reports-start-date"),s=document.getElementById("reports-end-date");n&&!n.dataset.wired&&(n.dataset.wired="1",n.addEventListener("click",async()=>{const a=(t==null?void 0:t.value)||"all",d=(o==null?void 0:o.value)||"all",i=(r==null?void 0:r.value)||null,c=(s==null?void 0:s.value)||null;if(a==="all"&&!i&&!c&&d==="all"){x("warning","No Filter Selected","Select at least a sector, an agent, or a date range.");return}n.disabled=!0,n.textContent="Generating…";try{const[l,p]=await Promise.all([Ne(i,c,a,d),ce({sectorId:a,agentId:d,startDate:i,endDate:c,includeHidden:!0})]);C=p,Xe(l,e),v.reportFares=1,K(C)}catch(l){x("error","Report Failed",l.message)}finally{n.disabled=!1,n.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Xe(e,t){const{agentReport:o,sectorReport:n,totalFares:r}=e,s=document.getElementById("report-stats-row");if(s){s.classList.remove("hidden");const g=(C||[]).filter(m=>!m.isHidden).length,u=(C||[]).filter(m=>m.isHidden).length,y=new Set((C||[]).map(m=>m.agentId)).size,b=(C||[]).map(m=>m.finalRate||0).filter(m=>m>0),$=b.length?Math.round(b.reduce((m,f)=>m+f,0)/b.length):0,I=(m,f)=>{const h=document.getElementById(m);h&&(h.textContent=f.toLocaleString())};I("stat-total-fares",r),I("stat-live-fares",g),I("stat-hidden-fares",u),I("stat-agents-count",y);const k=document.getElementById("stat-avg-fare");k&&(k.textContent=$>0?`₹${$.toLocaleString()}`:"—")}const a=document.getElementById("report-total-fares");a&&(a.textContent=`${r} fare${r!==1?"s":""} matched your filter`);const d=document.getElementById("bar-chart-container");d&&o.length&&Ze(o.slice(0,8),d);const i=document.getElementById("donut-chart-svg"),c=document.getElementById("pie-legend");i&&n.length&&Qe(n.slice(0,8),i,c);const l=document.getElementById("report-leaderboards");l&&(l.classList.remove("hidden"),et(o,n));const p=document.getElementById("download-report-csv");if(p){const g=p.cloneNode(!0);p.parentNode.replaceChild(g,p),g.addEventListener("click",()=>tt(C)),C&&C.length?g.classList.remove("opacity-50","pointer-events-none"):g.classList.add("opacity-50","pointer-events-none")}x("success","Report Ready",`${r} fare${r!==1?"s":""} aggregated.`)}function Ze(e,t){const o=t.clientWidth||480,n=260,r={top:32,right:16,bottom:48,left:48},s=o-r.left-r.right,a=n-r.top-r.bottom,d=Math.max(...e.map(m=>m.count),1),i=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],c=4,l=Math.ceil(d/c),p=Array.from({length:c+1},(m,f)=>f*l),g=p.map(m=>{const f=r.top+a-m/(p[p.length-1]||1)*a;return`<line x1="${r.left}" y1="${f.toFixed(1)}" x2="${o-r.right}" y2="${f.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${r.left-6}" y="${(f+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${m}</text>`}).join(""),u=Math.min(48,s/e.length*.6),y=s/e.length,b=e.map((m,f)=>{const h=Math.max(4,m.count/(p[p.length-1]||1)*a),E=r.left+f*y+y/2-u/2,N=r.top+a-h,[H,j]=i[f%i.length],O=`bg${f}`,P=m.avgRate?`avg ₹${Math.round(m.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${O}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${H}"/>
              <stop offset="100%" stop-color="${j}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${m.name}" data-count="${m.count}" data-avg="${P}" style="cursor:pointer;">
              <rect x="${E.toFixed(1)}" y="${N.toFixed(1)}" width="${u}" height="${h.toFixed(1)}"
                rx="6" fill="url(#${O})" opacity="0.92"
                style="transform-origin:${(E+u/2).toFixed(1)}px ${(r.top+a).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${f*.07}s both;"/>
              <text x="${(E+u/2).toFixed(1)}" y="${(N-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${j}">${m.count}</text>
              <text x="${(E+u/2).toFixed(1)}" y="${(r.top+a+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(m.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),$="bar-tooltip";t.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${$}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${n}" viewBox="0 0 ${o} ${n}" style="overflow:visible;">
      ${g}
      <line x1="${r.left}" y1="${r.top}" x2="${r.left}" y2="${r.top+a}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${r.left}" y1="${r.top+a}" x2="${o-r.right}" y2="${r.top+a}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${b}
    </svg>`;const I=t.querySelector("#bar-svg"),k=t.querySelector(`#${$}`);I&&k&&I.querySelectorAll(".bar-group").forEach(m=>{m.addEventListener("mousemove",f=>{const h=t.getBoundingClientRect();k.style.display="block",k.style.left=f.clientX-h.left+12+"px",k.style.top=f.clientY-h.top-40+"px";const E=m.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${m.dataset.avg}</span>`:"";k.innerHTML=`${m.dataset.name}<br><span style="color:#60a5fa;">${m.dataset.count} fares</span>${E}`}),m.addEventListener("mouseleave",()=>{k.style.display="none"})})}function Qe(e,t,o){const n=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],i=e.reduce((m,f)=>m+f.count,0),c=t.getElementById?t.getElementById("donut-segments"):t.querySelector("#donut-segments"),l=t.querySelector("#donut-center-count"),p=t.querySelector("#donut-center-label");if(!c)return;l&&(l.textContent=i),p&&(p.textContent="FARES");const g=(m,f,h,E)=>({x:m+h*Math.cos((E-90)*Math.PI/180),y:f+h*Math.sin((E-90)*Math.PI/180)});let u=0;const y=e.map((m,f)=>{const h=i>0?m.count/i*360:0,E=u+h,N=h>180?1:0,H=g(110,110,95,u),j=g(110,110,95,E),O=g(110,110,60,u),P=g(110,110,60,E),w=[`M ${H.x.toFixed(2)} ${H.y.toFixed(2)}`,`A 95 95 0 ${N} 1 ${j.x.toFixed(2)} ${j.y.toFixed(2)}`,`L ${P.x.toFixed(2)} ${P.y.toFixed(2)}`,`A 60 60 0 ${N} 0 ${O.x.toFixed(2)} ${O.y.toFixed(2)}`,"Z"].join(" "),A=u+h/2;u=E;const U=i>0?(m.count/i*100).toFixed(1):"0.0";return{pathD:w,color:n[f%n.length],name:m.name,count:m.count,pct:U,mid:A}}),b="http://www.w3.org/2000/svg";c.innerHTML="";const $=y.map((m,f)=>{const h=document.createElementNS(b,"path");return h.setAttribute("d",m.pathD),h.setAttribute("fill",m.color),h.setAttribute("stroke","white"),h.setAttribute("stroke-width","2"),h.style.cursor="pointer",h.style.transition="transform 0.2s, filter 0.2s",h.style.transformOrigin="110px 110px",h.setAttribute("data-index",f),c.appendChild(h),h}),I=m=>{$.forEach((f,h)=>{h===m?(f.style.transform="scale(1.04)",f.style.filter="brightness(1.1)",f.setAttribute("stroke-width","3")):(f.style.transform="scale(1)",f.style.filter="brightness(1)",f.setAttribute("stroke-width","2"))}),m>=0&&m<y.length?(l&&(l.textContent=y[m].count),p&&(p.textContent=y[m].name.split(" ")[0].toUpperCase().slice(0,7))):(l&&(l.textContent=i),p&&(p.textContent="FARES"))};if($.forEach((m,f)=>{m.addEventListener("mouseover",()=>{I(f),k(f)}),m.addEventListener("mouseout",()=>{I(-1),k(-1)})}),o){o.innerHTML=y.map((f,h)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${h}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${f.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${f.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${f.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${f.pct}%</span>
      </div>`).join("");const m=f=>{o.querySelectorAll(".legend-row").forEach((h,E)=>{h.style.background=E===f?"#f1f5f9":""})};window._highlightLegendRows=m,o.querySelectorAll(".legend-row").forEach((f,h)=>{f.addEventListener("mouseover",()=>{I(h),m(h)}),f.addEventListener("mouseout",()=>{I(-1),m(-1)})})}function k(m){window._highlightLegendRows&&window._highlightLegendRows(m)}}function et(e,t){var s,a;const o=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],n=document.getElementById("leaderboard-agents");if(n&&e.length){const d=[...e].sort((c,l)=>l.count-c.count).slice(0,5),i=d[0].count||1;n.innerHTML=d.map((c,l)=>{const p=Math.max(6,Math.round(c.count/i*100));return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:16px;width:28px;text-align:center;flex-shrink:0;">${l===0?"🥇":l===1?"🥈":l===2?"🥉":`#${l+1}`}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${c.name}</span>
            <span style="color:${o[l]};margin-left:8px;">${c.count} fares</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${p}%;height:100%;background:${o[l]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}const r=document.getElementById("leaderboard-sectors");if(r&&t.length){const i=[...t.filter(p=>p.avgRate>0)].sort((p,g)=>p.avgRate-g.avgRate).slice(0,5),c=((s=i[0])==null?void 0:s.avgRate)||1,l=((a=i[i.length-1])==null?void 0:a.avgRate)||1;r.innerHTML=i.map((p,g)=>{const u=l>c?Math.max(6,Math.round((p.avgRate-c)/(l-c)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${g+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${p.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(p.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${u}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function tt(e){if(!e||!e.length){x("warning","No Data","No fares to export. Apply filters and fetch first.");return}const t=Object.fromEntries(L.map(p=>[p.id,p.name])),o=Object.fromEntries(B.map(p=>[p.id,p.sectorCode])),n=Object.fromEntries(S.map(p=>[p.id,p.code||p.name])),r=p=>`"${String(p??"").replace(/"/g,'""')}"`,s=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],a=e.map(p=>{const g=p.flightDate instanceof Date?p.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):p.flightDate||"";return[r(g),r(p.flightTime||""),r(o[p.sectorId]||p.sectorId),r(n[p.airlineId]||p.airlineId),r(t[p.agentId]||p.agentId),r(p.specialRate||0),r(p.finalRate||0),r(p.commission||0),r(p.baggage||""),r(p.extraBaggage||""),r(p.isHidden?"Hidden":"Live")].join(",")}),d=[s.map(r).join(","),...a].join(`
`),i=new Blob(["\uFEFF"+d],{type:"text/csv;charset=utf-8;"}),c=URL.createObjectURL(i),l=document.createElement("a");l.href=c,l.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(c),x("success","CSV Downloaded",`${e.length} fares exported.`)}const ot="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",nt={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},de=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let D=null,R=JSON.parse(localStorage.getItem("zt_hist")||"[]"),ae=R.reduce((e,t)=>e+(t.rows||0),0);function rt(){var t,o,n,r;const e=document.getElementById("rateData");e&&e.addEventListener("input",function(){const s=this.value.length,a=document.getElementById("charCount");a&&(a.textContent=s.toLocaleString()+" character"+(s!==1?"s":"")),z(),clearTimeout(window._previewTimer),s>15?window._previewTimer=setTimeout(()=>it(this.value),500):V()}),(t=document.getElementById("resetBtn"))==null||t.addEventListener("click",()=>{e&&(e.value="");const s=document.getElementById("charCount");s&&(s.textContent="0 characters"),V(),z()}),(o=document.getElementById("clearBtn"))==null||o.addEventListener("click",()=>{R=[],ae=0,Y(),J(),te()}),(n=document.getElementById("manualAgent"))==null||n.addEventListener("input",function(){const s=parseInt(this.value);D=s>0?String(s):null,document.querySelectorAll(".rp-chip").forEach(a=>a.classList.remove("on")),xe(),z()}),(r=document.getElementById("submitBtn"))==null||r.addEventListener("click",dt),te(),J()}function st(){const e=document.getElementById("chipGrid");if(!e||e.children.length>0)return;const t=L.length?[...L].sort((o,n)=>{const r=parseInt(o.id),s=parseInt(n.id);return!isNaN(r)&&!isNaN(s)?r-s:o.id.localeCompare(n.id)}):[];if(!t.length){e.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>';return}t.forEach(o=>{const n=document.createElement("div");n.className="rp-chip",n.dataset.agentId=o.id,n.textContent=o.id,n.style.cssText="height:48px;padding:0 12px;display:flex;align-items:center;justify-content:center;border:2px solid #b8cce4;border-radius:10px;font-size:13px;font-weight:700;color:#1e293b;cursor:pointer;background:#ffffff;user-select:none;box-shadow:0 1px 4px rgba(13,31,60,.10);transition:all .16s ease;white-space:nowrap;",n.addEventListener("click",()=>at(o.id,o.name,n)),e.appendChild(n)})}function at(e,t,o){D=e,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(n=>{n.classList.remove("on"),n.style.background="#ffffff",n.style.color="#1e293b",n.style.borderColor="#b8cce4",n.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",n.style.transform=""}),o&&(o.classList.add("on"),o.style.background="#1a73e8",o.style.color="#ffffff",o.style.borderColor="#1a73e8",o.style.boxShadow="0 4px 14px rgba(26,115,232,.3)",o.style.transform="translateY(-1px)"),xe(),z()}function xe(){const e=document.getElementById("agentPill");if(e)if(D){const t=L.find(o=>o.id===D);e.textContent=`Agent ${(t==null?void 0:t.id)||D} selected ✓`,e.classList.remove("empty")}else e.textContent="No agent selected",e.classList.add("empty")}function z(){const e=document.getElementById("rateData"),t=document.getElementById("submitBtn");t&&(t.disabled=!(D&&e&&e.value.trim().length>10))}function he(e){const t=[];let o=null,n="IX";for(const r of e.split(`
`)){const s=r.replace(/[*_~`]/g,"").trim();if(!s)continue;const a=s.match(/([A-Z]{3})\s+([A-Z]{3})/);if(a&&s.length<70&&!s.match(/\d{4,6}/)){o=a[1]+"-"+a[2];const d=s.match(de);d&&(n=d[1]);continue}if(o){const d=s.match(de);if(d&&!s.match(/\d{4,6}/)){n=d[1];continue}const i=s.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(i){const c=parseInt(i[3]);c>=1e3&&c<=99999&&t.push({sector:o,date:`2026-${nt[i[2].toUpperCase()]}-${i[1].padStart(2,"0")}`,airline:d?d[1]:n,rate:c})}}}return t}function it(e){const t=he(e);if(!t.length){V();return}const o=document.getElementById("prevBox");o&&o.classList.add("on");const n=document.getElementById("prevCount");n&&(n.textContent=t.length+" entr"+(t.length===1?"y":"ies"));const r=document.getElementById("prevBody");r&&(r.innerHTML=t.slice(0,60).map(s=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${s.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${s.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${s.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${s.rate.toLocaleString()}</td></tr>`).join(""),t.length>60&&(r.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${t.length-60} more</td></tr>`))}function V(){var e;(e=document.getElementById("prevBox"))==null||e.classList.remove("on")}async function dt(){const e=document.getElementById("rateData");if(!D||!(e!=null&&e.value.trim()))return;const t=document.getElementById("submitBtn"),o=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI...';const n=document.getElementById("progBar"),r=document.getElementById("progFill");n&&n.classList.add("on");let s=0;const a=setInterval(()=>{s=Math.min(s+Math.random()*13,85),r&&(r.style.width=s+"%")},280),d=he(e.value),i={id:Date.now(),agent:D,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:d.length,status:"pen"};R.unshift(i),R.length>15&&R.pop(),Y(),J();try{const c=await fetch(ot,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:D,raw_text:e.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(a),r&&(r.style.width="100%"),c.ok)i.status="ok",ae+=d.length,Y(),J(),te(),x("success","Submitted","Rates dispatched to AI Agent. The database will reflect parsing results momentarily."),setTimeout(()=>{e.value="";const l=document.getElementById("charCount");l&&(l.textContent="0 characters"),V(),z()},500);else throw new Error("N8N webhook rejected payload")}catch(c){clearInterval(a),r&&(r.style.width="100%"),i.status="err",Y(),J(),x("error","Submission Failed",c.message)}setTimeout(()=>{n&&n.classList.remove("on"),r&&(r.style.width="0%"),t.innerHTML=o,z()},900)}function te(){const e=document.getElementById("statSubs");e&&(e.textContent=R.length);const t=document.getElementById("statEntries");t&&(t.textContent=ae)}function Y(){localStorage.setItem("zt_hist",JSON.stringify(R))}function J(){const e=document.getElementById("historyWrap");if(e){if(!R.length){e.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}e.innerHTML=R.map(t=>{var n;const o=((n=L.find(r=>r.id===t.agent))==null?void 0:n.name)||`Agent ${t.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${o.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${o}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${t.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${t.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${t.status==="ok"?"bg-green-500":t.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}async function lt(){var d;const e=document.getElementById("eticket-tab");if(!e)return;const t=document.getElementById("eticket-form"),o=document.getElementById("et-add-passenger"),n=document.getElementById("et-passengers-container"),r=document.getElementById("et-airline"),s=document.getElementById("et-origin"),a=document.getElementById("et-destination");if(S.length===0&&(S=await ne()),B.length===0&&(B=await oe()),!e.dataset.wired){if(e.dataset.wired="1",r&&S&&(r.innerHTML='<option value="">Select Airline</option>'+S.map(i=>`<option value="${i.name}">${i.name}</option>`).join("")),s&&B){const i=[...new Set(B.map(c=>c.sectorFrom).filter(Boolean))].sort();s.innerHTML='<option value="">Select Origin</option>'+i.map(c=>`<option value="${c}">${c}</option>`).join("")}if(a&&B){const i=[...new Set(B.map(c=>c.sectorTo).filter(Boolean))].sort();a.innerHTML='<option value="">Select Destination</option>'+i.map(c=>`<option value="${c}">${c}</option>`).join("")}o==null||o.addEventListener("click",()=>{n.children.length,n.insertAdjacentHTML("beforeend",`
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-border rounded-lg bg-white et-pax-row relative">
          <button type="button" class="absolute -top-3 -right-3 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors border border-red-200" onclick="this.closest('.et-pax-row').remove()" title="Remove passenger">×</button>
          
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-text-muted mb-1">Title</label>
            <select name="paxTitle[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
              <option value="MR">MR</option>
              <option value="MRS">MRS</option>
              <option value="MS">MS</option>
              <option value="MSTR">MSTR</option>
              <option value="MISS">MISS</option>
            </select>
          </div>

          <div class="md:col-span-3">
            <label class="block text-xs font-semibold text-text-muted mb-1">Passenger Name *</label>
            <input type="text" name="paxName[]" required placeholder="e.g. JOHN DOE" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none uppercase placeholder:normal-case">
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-text-muted mb-1">Category</label>
            <select name="paxType[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
              <option value="ADT">Adult</option>
              <option value="CHD">Child</option>
              <option value="INF">Infant</option>
            </select>
          </div>

          <div class="md:col-span-5 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-text-muted mb-1">Check-in Bag</label>
              <select name="paxCheckBag[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="15 Kilograms">15 Kilograms</option>
                <option value="20 Kilograms">20 Kilograms</option>
                <option value="25 Kilograms">25 Kilograms</option>
                <option value="30 Kilograms" selected>30 Kilograms</option>
                <option value="35 Kilograms">35 Kilograms</option>
                <option value="40 Kilograms">40 Kilograms</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-text-muted mb-1">Carry-on</label>
              <select name="paxCarryBag[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="7 Kilograms" selected>7 Kilograms</option>
                <option value="10 Kilograms">10 Kilograms</option>
              </select>
            </div>
          </div>
        </div>
      `)}),n.children.length===0&&(o==null||o.click()),t==null||t.addEventListener("submit",async i=>{i.preventDefault(),await ct(new FormData(t))}),(d=document.getElementById("et-print-btn"))==null||d.addEventListener("click",()=>{window.print()}),t==null||t.addEventListener("reset",()=>{setTimeout(()=>{var i;Array.from(n.children).forEach((c,l)=>{l>0&&c.remove()}),(i=document.getElementById("eticket-output-wrapper"))==null||i.classList.add("hidden")},10),x("info","Form Reset","The E-Ticket form has been cleared.")})}}async function ct(e){var j,O,P;const t=(j=e.get("etPnr"))==null?void 0:j.toUpperCase(),o=(O=e.get("etAirline"))==null?void 0:O.toUpperCase(),n=(P=e.get("etFlightNo"))==null?void 0:P.toUpperCase();let r=e.get("etDate");const s=e.get("etDepTime"),a=e.get("etArrTime"),d=e.get("etPhone"),i=w=>{let A=(w||"").trim(),U=A,W="";const G=A.match(/^(.*?)\\s*\\((.*?)\\)$/);return G&&(U=G[1].trim(),W=G[2].trim()),{city:U,code:W}},c=i(e.get("etOrigin")),l=i(e.get("etDest"));let p=r;if(r){const w=new Date(r);if(!isNaN(w.getTime())){const A=["SUN","MON","TUE","WED","THU","FRI","SAT"],U=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];p=`${A[w.getDay()]}, ${String(w.getDate()).padStart(2,"0")} ${U[w.getMonth()]} ${w.getFullYear()}`}}const g=w=>document.getElementById(w);g("t-pnr")&&(g("t-pnr").textContent=t||"—"),g("t-crs-pnr")&&(g("t-crs-pnr").textContent=t||"—"),g("t-booking-ref")&&(g("t-booking-ref").textContent=t||"—"),g("t-airline-tollfree")&&(g("t-airline-tollfree").textContent="");const u=e.get("etOrigin")||"—",y=e.get("etDest")||"—";g("t-issued-by")&&(g("t-issued-by").textContent=o||"—"),g("t-customer-phone")&&(g("t-customer-phone").textContent=d||"—");const b=new Date,$=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];if(g("t-booked-on")&&(g("t-booked-on").textContent=`${String(b.getDate()).padStart(2,"0")}-${$[b.getMonth()]}-${b.getFullYear()} ${String(b.getHours()).padStart(2,"0")}:${String(b.getMinutes()).padStart(2,"0")}`),g("t-airline-logo")){const w=typeof S<"u"?S.find(A=>A.name.toUpperCase()===o):null;w&&w.logoUrl&&g("t-airline-logo")?(g("t-airline-logo").src=w.logoUrl,g("t-airline-logo").classList.remove("hidden"),g("t-issued-by")&&(g("t-issued-by").classList.remove("mt-1"),g("t-issued-by").textContent=o)):(g("t-airline-logo").classList.add("hidden"),g("t-issued-by")&&(g("t-issued-by").classList.add("mt-1"),g("t-issued-by").textContent=o))}const I=e.getAll("paxTitle[]"),k=e.getAll("paxName[]"),m=e.getAll("paxType[]"),f=e.getAll("paxCheckBag[]"),h=e.getAll("paxCarryBag[]"),E=document.getElementById("t-passengers-tbody");E&&(E.innerHTML="");for(let w=0;w<k.length;w++){const A=(I[w]||"MR").toUpperCase(),U=(k[w]||"").toUpperCase();(m[w]||"ADT").toUpperCase();const W=(f[w]||"").toUpperCase(),G=(h[w]||"").toUpperCase(),ye=`${c.code||c.city||"—"} - ${l.code||l.city||"—"}`.toUpperCase(),ee=document.createElement("tr");ee.style.borderBottom="none",ee.innerHTML=`
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800">${A}. ${U}<br><span class="text-gray-500 text-[10px] uppercase"></span></td>
      <td class="border-b border-gray-200 p-2 align-top text-gray-800"></td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800">${ye}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800">${n||""}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-[#1e3a8a] text-center font-bold">${t||""}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800 text-center">${G}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800 px-2">${W}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800 px-2 border-r-0"></td>
      <td class="border-b border-gray-200 p-2 align-top text-gray-800"></td>
      <td class="border-b border-gray-200 p-2 align-top text-gray-800">Confirmed</td>
    `,E&&E.appendChild(ee)}const N=document.getElementById("t-travel-tbody");N&&(N.innerHTML=`
      <tr class="text-black">
        <td class="p-2 border-b border-gray-300 align-top">
          <div class="flex items-center gap-1 mb-1 text-[#00b2b2] text-[10px] font-bold">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="currentColor"/></svg> flynas
          </div>
          <div class="font-normal text-[11px]">${n||"—"}</div>
          <div class="font-bold text-[11px]">ECONOMY</div>
          <div class="text-[10px] text-gray-600 mt-0.5">Non-Refundable</div>
        </td>
        <td class="p-2 border-l border-b border-gray-300 align-top">
          <div class="font-bold uppercase">${u.toUpperCase()}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${s||"—"}</span> <span class="text-gray-600 ml-1 text-[11px]">${p||"—"}</span></div>
        </td>
        <td class="p-2 border-l border-b border-gray-300 align-top">
          <div class="font-bold uppercase">${y.toUpperCase()}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${a||"—"}</span> <span class="text-gray-600 ml-1 text-[11px]">${p||"—"}</span></div>
        </td>
        <td class="p-2 border-l border-b border-gray-300 align-top text-gray-500 text-[10px]">
          I
        </td>
        <td class="p-2 border-l border-b border-gray-300 align-top">
          Confirmed
        </td>
      </tr>
    `);const H=document.getElementById("eticket-output-wrapper");H&&(H.classList.remove("hidden"),H.scrollIntoView({behavior:"smooth"}))}const le={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'};function x(e,t,o){const n=document.getElementById("toastsEl");if(!n)return;const r=document.createElement("div"),s={success:"border-green-500 bg-green-50 text-green-800",error:"border-red-500 bg-red-50 text-red-800",warning:"border-yellow-500 bg-yellow-50 text-yellow-800"};r.className=`flex items-start gap-3 p-4 border-l-4 rounded shadow-md w-80 pointer-events-auto ${s[e]||s.error}`,r.innerHTML=`<div class="mt-0.5">${le[e]||le.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${t}</div><div class="text-xs opacity-90 mt-1">${o}</div></div>
    <button class="opacity-50 hover:opacity-100" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,n.appendChild(r),setTimeout(()=>r.isConnected&&r.remove(),7e3)}document.addEventListener("DOMContentLoaded",()=>{});
