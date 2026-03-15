import"./index.esm-DPDniVF0.js";import{i as C}from"./site-chrome-Dy5oun64.js";import{r as B,s as H,t as M,v as q}from"./db-Dzh3zJx8.js";import"./firebase-config-CsZGR70X.js";document.addEventListener("DOMContentLoaded",()=>{C({enableSmoothScroll:!1});const u=document.getElementById("header"),c=(e="")=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),w={visas:"panel-visas",stamping:"panel-stamping",attestations:"panel-attestations",passport:"panel-passport"};document.querySelectorAll(".visa-tab-btn").forEach(e=>{e.addEventListener("click",()=>{const i=e.dataset.tab;document.querySelectorAll(".visa-tab-btn").forEach(t=>t.classList.remove("active")),e.classList.add("active"),document.querySelectorAll(".visa-section-panel").forEach(t=>t.classList.remove("active"));const s=document.getElementById(w[i]);s==null||s.classList.add("active");const n=document.querySelector(".tab-bar-sticky");if(s){const t=(u==null?void 0:u.offsetHeight)||0,a=(n==null?void 0:n.offsetHeight)||0,o=t+a+8,r=s.getBoundingClientRect().top+window.scrollY-o;window.scrollTo({top:Math.max(0,r),behavior:"auto"})}})});const m=document.getElementById("visa-modal"),h=document.getElementById("modal-close"),p=document.getElementById("modal-banner"),E=document.getElementById("modal-country"),L=document.getElementById("modal-type-label"),$=document.getElementById("modal-type"),k=document.getElementById("modal-rate"),S=document.getElementById("modal-enquire-btn"),g=e=>{if(!e&&e!==0)return"N/A";const i=parseFloat(e);return isNaN(i)?e:`₹${i.toLocaleString("en-IN")}`},x=(e,i)=>{let s="",n="Type",t="",a=g(e.rate),o="",r="";i==="visa"?(s=e.countryName||e.country||"Unknown",t=e.visaType||"Tourist",r=c(e.flagUrl||""),p.innerHTML=`
        <div class="absolute inset-0 bg-cover bg-center scale-105" style="background-image: url('${r}'); filter: brightness(0.65) blur(2px);"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/30 shadow-2xl overflow-hidden relative z-10 bg-white">
          <img src="${r}" alt="${c(s)}" class="w-full h-full object-cover">
        </div>
      `,o=`Hello Zamra Travels, I am interested in a visa for:

🌍 Country: *${s}*
📄 Visa Type: *${t}*
💵 Rate: *${a}*

Please provide more information.`):i==="stamping"?(s=e.country||"Unknown",t=e.description||"Visa Stamping",p.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-file-earmark-check"></i>
        </div>
      `,o=`Hello Zamra Travels, I need visa stamping for:

🌍 Country: *${s}*
📋 Service: *${t}*
💵 Rate: *${a}*

Please provide more details.`):i==="attestation"?(s=e.country||"Unknown",n="Certificate",t=e.certificate||"Attestation",p.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-[#073160] to-primary opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-patch-check"></i>
        </div>
      `,o=`Hello Zamra Travels, I need attestation for:

🌍 Country: *${s}*
📄 Certificate: *${t}*
💵 Rate: *${a}*

Please get in touch.`):i==="passport"&&(s=e.type||"Passport Service",n="Service",t=e.description||"Passport Service",p.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#1e67c2] opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-journal-bookmark"></i>
        </div>
      `,o=`Hello Zamra Travels, I need:

📄 Service: *${s}*
💵 Rate: *${a}*

Please get in touch.`),E.textContent=s,L.textContent=n,$.textContent=t,k.textContent=a,S.href=`https://wa.me/919846606739?text=${encodeURIComponent(o)}`,m.classList.add("active"),document.body.style.overflow="hidden"},b=()=>{m.classList.remove("active"),document.body.style.overflow=""};h&&h.addEventListener("click",b),m==null||m.addEventListener("click",e=>{e.target===m&&b()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&b()});const I=async()=>{const e=document.getElementById("visas-loading"),i=document.getElementById("visas-empty"),s=document.getElementById("visas-grid");try{const n=await B();if(e.style.display="none",!n||n.length===0){i.classList.remove("hidden");return}n.sort((t,a)=>(t.countryName||"").localeCompare(a.countryName||"")),s.innerHTML="",s.classList.remove("hidden"),n.forEach(t=>{const a=document.createElement("div");a.className="visa-card";const o=c(t.countryName||""),r=c(t.visaType||"Tourist"),l=t.flagUrl?`<img src="${c(t.flagUrl)}" alt="${o}" loading="lazy">`:'<div class="w-full h-full bg-gradient-to-br from-primary/60 to-blue-400/60"></div>';a.innerHTML=`
          <div class="visa-card-image">
            ${l}
            <div class="visa-card-image-overlay"></div>
            <h3>${o}</h3>
          </div>
          <div class="visa-card-body">
            <div class="flex items-center justify-between mb-3">
              <span class="visa-type-chip">${r}</span>
            </div>
            <div class="visa-rate-row">
              <div>
                <small class="visa-rate small">Starting from</small>
                <div class="visa-rate">${c(g(t.rate))}</div>
              </div>
              <button class="visa-enquire-btn view-btn">
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        `,a.querySelectorAll(".view-btn").forEach(d=>d.addEventListener("click",()=>x(t,"visa"))),s.appendChild(a)})}catch(n){console.error("Error fetching visas:",n),e.style.display="none",i.classList.remove("hidden"),i.innerHTML=`
        <div class="w-20 h-20 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl"><i class="bi bi-exclamation-triangle"></i></div>
        <h3 class="text-[18px] font-bold text-navy mb-2">Failed to Load</h3>
        <p class="text-text-muted">An error occurred. Please try again later.</p>
      `}},y=async(e,i,s,n)=>{const t=document.getElementById(`${i}-loading`),a=document.getElementById(`${i}-empty`),o=document.getElementById(`${i}-grid`);try{const r=await e();if(t.style.display="none",!r||r.length===0){a.classList.remove("hidden");return}r.sort((l,d)=>(l.country||l.type||"").localeCompare(d.country||d.type||"")),o.innerHTML="",o.classList.remove("hidden"),r.forEach(l=>{const d=l.cost!==void 0?l.cost:l.rate,v=document.createElement("div");v.className="service-card";let T=l.country||l.type||"Service",f="";s==="attestation"?f=`<p class="text-text-muted text-[13px] leading-snug mt-1 line-clamp-2">${c(l.certificate||"")}</p>`:f=`<p class="text-text-muted text-[13px] leading-snug mt-1 line-clamp-2">${c(l.description||"")}</p>`,s==="stamping"&&v.classList.add("service-card--stamping"),v.innerHTML=`
          <div class="flex items-start gap-4 mb-4">
            <div class="service-icon-wrap"><i class="${n}"></i></div>
            <div class="flex-1 min-w-0">
              <h3 class="text-[17px] font-bold text-navy leading-snug">${c(T)}</h3>
              ${f}
            </div>
          </div>
          <div class="service-rate-section">
            <div>
              <small class="service-rate small">Rate</small>
              <div class="service-rate">${c(g(d))}</div>
            </div>
            <button class="service-arrow-btn view-btn"><i class="bi bi-arrow-right"></i></button>
          </div>
        `,v.querySelector(".view-btn").addEventListener("click",()=>x({...l,rate:d},s)),o.appendChild(v)})}catch(r){console.error(`Error fetching ${s}:`,r),t.style.display="none",a.classList.remove("hidden"),a.innerHTML='<div class="text-red-500 flex items-center justify-center gap-2"><i class="bi bi-exclamation-triangle"></i> Failed to load. Please try again.</div>'}};I(),y(H,"visa-stamping","stamping","bi bi-file-earmark-check"),y(M,"attestations","attestation","bi bi-patch-check"),y(q,"passport-services","passport","bi bi-journal-bookmark")});
