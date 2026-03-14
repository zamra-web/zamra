import"./index.esm-kRT_WKqT.js";/* empty css              */import{r as A,s as H,t as q,v as P}from"./db-DIsZtkDY.js";import"./firebase-config-aHS-3htW.js";document.addEventListener("DOMContentLoaded",()=>{const w=document.getElementById("header");window.addEventListener("scroll",()=>{w.classList.toggle("shadow-sm",window.scrollY>30)});const u=document.getElementById("mobile-toggle"),E=document.getElementById("nav-menu");u&&u.addEventListener("click",()=>{E.classList.toggle("active");const e=u.querySelector("i");e.classList.toggle("bi-list"),e.classList.toggle("bi-x-lg")});const L={visas:"panel-visas",stamping:"panel-stamping",attestations:"panel-attestations",passport:"panel-passport"};document.querySelectorAll(".visa-tab-btn").forEach(e=>{e.addEventListener("click",()=>{var s,n;const i=e.dataset.tab;document.querySelectorAll(".visa-tab-btn").forEach(t=>t.classList.remove("active")),e.classList.add("active"),document.querySelectorAll(".visa-section-panel").forEach(t=>t.classList.remove("active")),(s=document.getElementById(L[i]))==null||s.classList.add("active"),(n=document.querySelector(".tab-bar-sticky"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})})});const c=document.getElementById("visa-modal"),h=document.getElementById("modal-close"),m=document.getElementById("modal-banner"),$=document.getElementById("modal-country"),T=document.getElementById("modal-type-label"),I=document.getElementById("modal-type"),k=document.getElementById("modal-time-label"),f=document.getElementById("modal-time-icon"),B=document.getElementById("modal-time"),S=document.getElementById("modal-rate"),C=document.getElementById("modal-enquire-btn"),g=e=>{if(!e&&e!==0)return"N/A";const i=parseFloat(e);return isNaN(i)?e:`₹${i.toLocaleString("en-IN")}`},x=(e,i)=>{let s="",n="Type",t="",o="Processing Time",l="",r=g(e.rate),a="";i==="visa"?(s=e.countryName||e.country||"Unknown",t=e.visaType||"Tourist",l=e.processingTime||"N/A",m.innerHTML=`
        <div class="absolute inset-0 bg-cover bg-center scale-105" style="background-image: url('${e.flagUrl||""}'); filter: brightness(0.65) blur(2px);"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/30 shadow-2xl overflow-hidden relative z-10 bg-white">
          <img src="${e.flagUrl||""}" alt="${s}" class="w-full h-full object-cover">
        </div>
      `,a=`Hello Zamra Travels, I am interested in a visa for:

🌍 Country: *${s}*
📄 Visa Type: *${t}*
⏱️ Processing: *${l}*
💵 Rate: *${r}*

Please provide more information.`):i==="stamping"?(s=e.country||"Unknown",t=e.description||"Visa Stamping",l=e.processingTime||"N/A",m.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-stamp"></i>
        </div>
      `,a=`Hello Zamra Travels, I need visa stamping for:

🌍 Country: *${s}*
📋 Service: *${t}*
⏱️ Processing: *${l}*
💵 Rate: *${r}*

Please provide more details.`):i==="attestation"?(s=e.country||"Unknown",t=e.certificate||"Attestation",o="Certificate",l=e.certificate||"N/A",m.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-[#073160] to-primary opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-patch-check"></i>
        </div>
      `,a=`Hello Zamra Travels, I need attestation for:

🌍 Country: *${s}*
📄 Certificate: *${t}*
💵 Rate: *${r}*

Please get in touch.`):i==="passport"&&(s=e.type||"Passport Service",n="Service Type",t="Passport Service",o="Details",l=e.description||"N/A",m.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#1e67c2] opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-journal-bookmark"></i>
        </div>
      `,a=`Hello Zamra Travels, I need:

📄 Service: *${s}*
📝 Details: *${l}*
💵 Rate: *${r}*

Please get in touch.`),$.textContent=s,T.textContent=n,I.textContent=t,k.textContent=o,i==="attestation"?(f.className="bi bi-file-earmark-text",document.querySelector(".modal-info-row:nth-child(2)").style.display="none"):(f.className="bi bi-hourglass-split",document.querySelector(".modal-info-row:nth-child(2)").style.display="",B.textContent=l),S.textContent=r,C.href=`https://wa.me/919846606739?text=${encodeURIComponent(a)}`,c.classList.add("active"),document.body.style.overflow="hidden"},p=()=>{c.classList.remove("active"),document.body.style.overflow=""};h&&h.addEventListener("click",p),c==null||c.addEventListener("click",e=>{e.target===c&&p()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&p()});const N=async()=>{const e=document.getElementById("visas-loading"),i=document.getElementById("visas-empty"),s=document.getElementById("visas-grid");try{const n=await A();if(e.style.display="none",!n||n.length===0){i.classList.remove("hidden");return}n.sort((t,o)=>(t.countryName||"").localeCompare(o.countryName||"")),s.innerHTML="",s.classList.remove("hidden"),n.forEach(t=>{const o=document.createElement("div");o.className="visa-card";const l=t.flagUrl?`<img src="${t.flagUrl}" alt="${t.countryName}" loading="lazy">`:'<div class="w-full h-full bg-gradient-to-br from-primary/60 to-blue-400/60"></div>';o.innerHTML=`
          <div class="visa-card-image">
            ${l}
            <div class="visa-card-image-overlay"></div>
            <h3>${t.countryName||""}</h3>
            <div class="visa-card-image-badge view-btn">
              <i class="bi bi-arrow-right"></i>
            </div>
          </div>
          <div class="visa-card-body">
            <div class="flex items-center justify-between mb-3">
              <span class="visa-type-chip">${t.visaType||"Tourist"}</span>
            </div>
            <div class="visa-meta-row mb-2">
              <i class="bi bi-clock"></i>
              <span>${t.processingTime||"N/A"}</span>
            </div>
            <div class="visa-rate-row">
              <div>
                <small class="visa-rate small">Starting from</small>
                <div class="visa-rate">${g(t.rate)}</div>
              </div>
              <button class="visa-enquire-btn view-btn">
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        `,o.querySelectorAll(".view-btn").forEach(r=>r.addEventListener("click",()=>x(t,"visa"))),s.appendChild(o)})}catch(n){console.error("Error fetching visas:",n),e.style.display="none",i.classList.remove("hidden"),i.innerHTML=`
        <div class="w-20 h-20 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl"><i class="bi bi-exclamation-triangle"></i></div>
        <h3 class="text-[18px] font-bold text-navy mb-2">Failed to Load</h3>
        <p class="text-text-muted">An error occurred. Please try again later.</p>
      `}},b=async(e,i,s,n)=>{const t=document.getElementById(`${i}-loading`),o=document.getElementById(`${i}-empty`),l=document.getElementById(`${i}-grid`);try{const r=await e();if(t.style.display="none",!r||r.length===0){o.classList.remove("hidden");return}r.sort((a,d)=>(a.country||a.type||"").localeCompare(d.country||d.type||"")),l.innerHTML="",l.classList.remove("hidden"),r.forEach(a=>{const d=a.cost!==void 0?a.cost:a.rate,v=document.createElement("div");v.className="service-card";let M=a.country||a.type||"Service",y="";s==="attestation"?y=`<p class="text-text-muted text-[13px] leading-snug mt-1 line-clamp-2">${a.certificate||""}</p>`:y=`<div class="visa-meta-row mt-1.5"><i class="bi bi-clock"></i><span>${a.processingTime||a.description||"N/A"}</span></div>`,v.innerHTML=`
          <div class="flex items-start gap-4 mb-4">
            <div class="service-icon-wrap"><i class="${n}"></i></div>
            <div class="flex-1 min-w-0">
              <h3 class="text-[17px] font-bold text-navy leading-snug">${M}</h3>
              ${y}
            </div>
          </div>
          <div class="service-rate-section">
            <div>
              <small class="service-rate small">Rate</small>
              <div class="service-rate">${g(d)}</div>
            </div>
            <button class="service-arrow-btn view-btn"><i class="bi bi-arrow-right"></i></button>
          </div>
        `,v.querySelector(".view-btn").addEventListener("click",()=>x({...a,rate:d},s)),l.appendChild(v)})}catch(r){console.error(`Error fetching ${s}:`,r),t.style.display="none",o.classList.remove("hidden"),o.innerHTML='<div class="text-red-500 flex items-center justify-center gap-2"><i class="bi bi-exclamation-triangle"></i> Failed to load. Please try again.</div>'}};N(),b(H,"visa-stamping","stamping","bi bi-stamp"),b(q,"attestations","attestation","bi bi-patch-check"),b(P,"passport-services","passport","bi bi-journal-bookmark")});
