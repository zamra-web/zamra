(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?t.classList.add("scrolled"):t.classList.remove("scrolled")});const e=document.getElementById("mobile-toggle"),n=document.getElementById("nav-menu");e&&e.addEventListener("click",()=>{n.classList.toggle("active");const i=e.querySelector("i");n.classList.contains("active")?i.classList.replace("bi-list","bi-x-lg"):i.classList.replace("bi-x-lg","bi-list")}),document.querySelectorAll(".nav-menu a").forEach(i=>{i.addEventListener("click",()=>{n.classList.contains("active")&&(n.classList.remove("active"),e.querySelector("i").classList.replace("bi-x-lg","bi-list"))})});const s=[{code:"JED",name:"JEDDAH"},{code:"RUH",name:"RIYADH"},{code:"DMM",name:"DAMAMM"},{code:"DOH",name:"DOHA"},{code:"MCT",name:"MUSCUT"},{code:"BAH",name:"BAHRAIN"},{code:"KWI",name:"KUWAIT"},{code:"DXB",name:"DUBAI"},{code:"SHJ",name:"SHARJA"},{code:"AUH",name:"ABUDHABI"},{code:"RKT",name:"Ras Al Khaimah"},{code:"AAN",name:"AL AIN"},{code:"FJR",name:"FUJAIRAH"}];[{id:"kozhikode",code:"CCJ",name:"KOZHIKKODE"},{id:"kochi",code:"COK",name:"KOCHI"},{id:"kannur",code:"CNN",name:"KANNUR"}].forEach(i=>{const x=document.getElementById(`grid-${i.id}`);x&&s.forEach(L=>{const B=`${i.code} ${L.code}`,H=`${i.name} → ${L.name}`,v=document.createElement("div");v.className="sector-card bg-white p-[16px_20px] rounded-[12px] border border-border shadow-sm cursor-pointer hover:shadow-md hover:border-primary hover:-translate-y-1 transition-all duration-300 flex items-center justify-between relative overflow-hidden group",v.setAttribute("data-sector",B),v.innerHTML=`<h4 class="text-[15px] font-extrabold text-text-main m-0 flex items-center gap-[12px] z-[2] relative">${i.name} <i class="bi bi-airplane text-primary text-[18px]"></i> ${L.name}</h4>`,v.addEventListener("click",()=>g(B,H)),x.appendChild(v)})});const a=document.getElementById("sector-modal"),l=document.getElementById("modal-close"),c=document.getElementById("modal-body"),d=document.getElementById("modal-route");function g(i,x){d.textContent=i.replace(" "," → "),a.classList.add("active"),document.body.style.overflow="hidden",c.innerHTML='<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>',setTimeout(()=>{c.innerHTML=`
                <div class="text-center mb-4">
                    <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${x}</h4>
                    <p class="text-text-muted text-sm">Prices are introductory and subject to availability.</p>
                </div>
                <table class="w-full border-collapse my-[20px] text-[14px] text-left rounded-[10px] overflow-hidden">
                    <thead>
                        <tr class="bg-[#f8fafc] text-text-muted font-bold border-b-2 border-[#e2e8f0]">
                            <th class="p-[14px_15px]">Airlines</th>
                            <th class="p-[14px_15px]">Departure</th>
                            <th class="p-[14px_15px]">Arrival</th>
                            <th class="p-[14px_15px]">Status</th>
                            <th class="p-[14px_15px]">Price Start At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary">
                            <td class="p-[14px_15px]"><strong>Air India Express</strong></td>
                            <td class="p-[14px_15px]">10:45 AM</td>
                            <td class="p-[14px_15px]">01:20 PM</td>
                            <td class="p-[14px_15px]"><span style="color: #16a34a;">Available</span></td>
                            <td class="p-[14px_15px]"><strong>₹12,450</strong></td>
                        </tr>
                        <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary">
                            <td class="p-[14px_15px]"><strong>Saudi Airlines</strong></td>
                            <td class="p-[14px_15px]">04:30 PM</td>
                            <td class="p-[14px_15px]">08:15 PM</td>
                            <td class="p-[14px_15px]"><span style="color: #16a34a;">Available</span></td>
                            <td class="p-[14px_15px]"><strong>₹14,200</strong></td>
                        </tr>
                        <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary">
                            <td class="p-[14px_15px]"><strong>Oman Air</strong></td>
                            <td class="p-[14px_15px]">11:00 PM</td>
                            <td class="p-[14px_15px]">03:45 AM</td>
                            <td class="p-[14px_15px]"><span style="color: #d97706;">Few Seats</span></td>
                            <td class="p-[14px_15px]"><strong>₹13,800</strong></td>
                        </tr>
                    </tbody>
                </table>
            `},800)}function u(){a.classList.remove("active"),document.body.style.overflow=""}l&&l.addEventListener("click",u),a&&a.addEventListener("click",i=>{i.target===a&&u()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&a.classList.contains("active")&&u()}),(()=>{document.querySelector(".partners-slider")})()});const O="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",T=[1,2,21,22,23,24,25,28,31,40,42,43,44];let m=null,p=JSON.parse(localStorage.getItem("zt_hist")||"[]"),w=p.reduce((t,e)=>t+(e.rows||0),0);function I(){document.getElementById("statSubs").textContent=p.length,document.getElementById("statEntries").textContent=w}function N(){const t=document.getElementById("chipGrid");!t||t.children.length>0||T.forEach(e=>{const n=document.createElement("div");n.className="rp-chip",n.textContent=e,n.style.cssText="height:48px;display:flex;align-items:center;justify-content:center;border:2px solid #b8cce4;border-radius:10px;font-size:15px;font-weight:700;color:#1e293b;cursor:pointer;background:#ffffff;user-select:none;box-shadow:0 1px 4px rgba(13,31,60,.10);transition:all .16s ease;",n.addEventListener("click",()=>_(e,n)),t.appendChild(n)})}document.addEventListener("DOMContentLoaded",()=>{N(),y(),I()});function _(t,e){m=t,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(n=>{n.classList.remove("on"),n.style.background="#ffffff",n.style.color="#1e293b",n.style.borderColor="#b8cce4",n.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",n.style.transform=""}),e&&(e.classList.add("on"),e.style.background="#1a73e8",e.style.color="#ffffff",e.style.borderColor="#1a73e8",e.style.boxShadow="0 4px 14px rgba(26,115,232,.3)",e.style.transform="translateY(-1px)"),M(),h()}document.getElementById("manualAgent").addEventListener("input",function(){const t=parseInt(this.value);m=t>0?t:null,document.querySelectorAll(".rp-chip").forEach(e=>{e.classList.remove("on"),e.style.background="#ffffff",e.style.color="#1e293b",e.style.borderColor="#b8cce4",e.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",e.style.transform=""}),M(),h()});function M(){const t=document.getElementById("agentPill");m?(t.textContent=`Agent ${m} selected ✓`,t.classList.remove("empty")):(t.textContent="No agent selected",t.classList.add("empty"))}const f=document.getElementById("rateData");let k;f.addEventListener("input",function(){const t=this.value.length;document.getElementById("charCount").textContent=t.toLocaleString()+" character"+(t!==1?"s":""),h(),clearTimeout(k),t>15?k=setTimeout(()=>$(this.value),500):E()});function h(){document.getElementById("submitBtn").disabled=!(m&&f.value.trim().length>10)}function S(t){const e=[],n={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},o=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let s=null,r="IX";for(const a of t.split(`
`)){const l=a.replace(/[*_~`]/g,"").trim();if(!l)continue;const c=l.match(/([A-Z]{3})\s+([A-Z]{3})/);if(c&&l.length<70&&!l.match(/\d{4,6}/)){s=c[1]+"-"+c[2];const d=l.match(o);d&&(r=d[1]);continue}if(s){const d=l.match(o);if(d&&!l.match(/\d{4,6}/)){r=d[1];continue}const g=l.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(g){const u=parseInt(g[3]);u>=1e3&&u<=99999&&e.push({sector:s,date:`2026-${n[g[2].toUpperCase()]}-${g[1].padStart(2,"0")}`,airline:d?d[1]:r,rate:u})}}}return e}function $(t){const e=S(t);if(!e.length){E();return}document.getElementById("prevBox").classList.add("on"),document.getElementById("prevCount").textContent=e.length+" entr"+(e.length===1?"y":"ies");const n=document.getElementById("prevBody");n.innerHTML=e.slice(0,60).map(o=>`
    <tr>
      <td class="td-s">${o.sector}</td>
      <td>${o.date}</td>
      <td class="td-a">${o.airline}</td>
      <td class="td-r">₹${o.rate.toLocaleString()}</td>
    </tr>
  `).join(""),e.length>60&&(n.innerHTML+=`<tr><td colspan="4" style="text-align:center;padding:10px;
      color:var(--z-text-soft);font-size:11px">+ ${e.length-60} more entries</td></tr>`)}function E(){document.getElementById("prevBox").classList.remove("on")}document.getElementById("resetBtn").addEventListener("click",()=>{f.value="",document.getElementById("charCount").textContent="0 characters",E(),h()});document.getElementById("submitBtn").addEventListener("click",async()=>{if(!m||!f.value.trim())return;const t=document.getElementById("submitBtn"),e=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="spin"></div> Processing...';const n=document.getElementById("progBar"),o=document.getElementById("progFill");n.classList.add("on");let s=0;const r=setInterval(()=>{s=Math.min(s+Math.random()*13,85),o.style.width=s+"%"},280),a=S(f.value),l={agent_id:m,raw_text:f.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"},c={id:Date.now(),agent:m,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:a.length,status:"pen"};p.unshift(c),p.length>15&&p.pop(),b(),y();try{const d=await fetch(O,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});if(clearInterval(r),o.style.width="100%",d.ok)c.status="ok",C(a.length);else throw new Error(`Server error ${d.status}`)}catch(d){clearInterval(r),o.style.width="100%",d.message.startsWith("Server error")?(c.status="err",b(),y(),A("error","Submission Failed",d.message)):(c.status="ok",C(a.length),A("warning","Webhook Not Connected","Data captured locally. Set the WEBHOOK constant to your n8n URL to go live."))}setTimeout(()=>{n.classList.remove("on"),o.style.width="0%",t.innerHTML=e,h()},900)});function C(t){b(),y(),w+=t,I(),A("success","Submitted Successfully",`Agent ${m} — ${t} entries queued for processing.`),setTimeout(()=>{f.value="",document.getElementById("charCount").textContent="0 characters",E(),h()},500)}const P={success:'<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'};function A(t,e,n){const o=document.createElement("div");o.className=`toast ${t}`,o.innerHTML=`
    <div class="ti">${P[t]}</div>
    <div class="tb">
      <div class="tt">${e}</div>
      <div class="tm">${n}</div>
    </div>
    <button class="tx" onclick="this.closest('.rp-toast').remove()">
      <svg viewBox="0 0 12 12" fill="none">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>`,document.getElementById("toastsEl").appendChild(o),setTimeout(()=>o.remove(),7e3)}function b(){localStorage.setItem("zt_hist",JSON.stringify(p))}function y(){const t=document.getElementById("historyWrap");if(!p.length){t.innerHTML=`
      <div class="h-empty">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        No submissions yet
      </div>`;return}t.innerHTML=p.map(e=>`
    <div class="h-item">
      <div class="h-ag">${e.agent}</div>
      <div class="h-meta">
        <div class="h-id">Agent ${e.agent}</div>
        <div class="h-t">${e.time}</div>
      </div>
      <div class="h-rows">
        <span class="h-n">${e.rows}</span>
        <span class="h-l">entries</span>
      </div>
      <div class="dot ${e.status}"></div>
    </div>
  `).join("")}document.getElementById("clearBtn").addEventListener("click",()=>{p.length&&(p=[],w=0,b(),y(),I())});
