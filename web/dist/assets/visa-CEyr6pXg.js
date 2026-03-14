import"./index.esm-kRT_WKqT.js";/* empty css              */import{r as C,s as M,t as H,v as N}from"./db-C0m7-YSF.js";import"./firebase-config-aHS-3htW.js";document.addEventListener("DOMContentLoaded",()=>{const x=document.getElementById("header");window.addEventListener("scroll",()=>{x.classList.toggle("shadow-sm",window.scrollY>30)});const u=document.getElementById("mobile-toggle"),w=document.getElementById("nav-menu");u&&u.addEventListener("click",()=>{w.classList.toggle("active");const e=u.querySelector("i");e.classList.toggle("bi-list"),e.classList.toggle("bi-x-lg")});const E={visas:"panel-visas",stamping:"panel-stamping",attestations:"panel-attestations",passport:"panel-passport"};document.querySelectorAll(".visa-tab-btn").forEach(e=>{e.addEventListener("click",()=>{var s,n;const a=e.dataset.tab;document.querySelectorAll(".visa-tab-btn").forEach(t=>t.classList.remove("active")),e.classList.add("active"),document.querySelectorAll(".visa-section-panel").forEach(t=>t.classList.remove("active")),(s=document.getElementById(E[a]))==null||s.classList.add("active"),(n=document.querySelector(".tab-bar-sticky"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})})});const c=document.getElementById("visa-modal"),h=document.getElementById("modal-close"),m=document.getElementById("modal-banner"),L=document.getElementById("modal-country"),$=document.getElementById("modal-type-label"),I=document.getElementById("modal-type"),k=document.getElementById("modal-rate"),T=document.getElementById("modal-enquire-btn"),p=e=>{if(!e&&e!==0)return"N/A";const a=parseFloat(e);return isNaN(a)?e:`₹${a.toLocaleString("en-IN")}`},f=(e,a)=>{let s="",n="Type",t="",i=p(e.rate),o="";a==="visa"?(s=e.countryName||e.country||"Unknown",t=e.visaType||"Tourist",m.innerHTML=`
        <div class="absolute inset-0 bg-cover bg-center scale-105" style="background-image: url('${e.flagUrl||""}'); filter: brightness(0.65) blur(2px);"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/30 shadow-2xl overflow-hidden relative z-10 bg-white">
          <img src="${e.flagUrl||""}" alt="${s}" class="w-full h-full object-cover">
        </div>
      `,o=`Hello Zamra Travels, I am interested in a visa for:

🌍 Country: *${s}*
📄 Visa Type: *${t}*
💵 Rate: *${i}*

Please provide more information.`):a==="stamping"?(s=e.country||"Unknown",t=e.description||"Visa Stamping",m.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-stamp"></i>
        </div>
      `,o=`Hello Zamra Travels, I need visa stamping for:

🌍 Country: *${s}*
📋 Service: *${t}*
💵 Rate: *${i}*

Please provide more details.`):a==="attestation"?(s=e.country||"Unknown",n="Certificate",t=e.certificate||"Attestation",m.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-[#073160] to-primary opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-patch-check"></i>
        </div>
      `,o=`Hello Zamra Travels, I need attestation for:

🌍 Country: *${s}*
📄 Certificate: *${t}*
💵 Rate: *${i}*

Please get in touch.`):a==="passport"&&(s=e.type||"Passport Service",n="Service",t=e.description||"Passport Service",m.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#1e67c2] opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-journal-bookmark"></i>
        </div>
      `,o=`Hello Zamra Travels, I need:

📄 Service: *${s}*
💵 Rate: *${i}*

Please get in touch.`),L.textContent=s,$.textContent=n,I.textContent=t,k.textContent=i,T.href=`https://wa.me/919846606739?text=${encodeURIComponent(o)}`,c.classList.add("active"),document.body.style.overflow="hidden"},g=()=>{c.classList.remove("active"),document.body.style.overflow=""};h&&h.addEventListener("click",g),c==null||c.addEventListener("click",e=>{e.target===c&&g()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&g()});const B=async()=>{const e=document.getElementById("visas-loading"),a=document.getElementById("visas-empty"),s=document.getElementById("visas-grid");try{const n=await C();if(e.style.display="none",!n||n.length===0){a.classList.remove("hidden");return}n.sort((t,i)=>(t.countryName||"").localeCompare(i.countryName||"")),s.innerHTML="",s.classList.remove("hidden"),n.forEach(t=>{const i=document.createElement("div");i.className="visa-card";const o=t.flagUrl?`<img src="${t.flagUrl}" alt="${t.countryName}" loading="lazy">`:'<div class="w-full h-full bg-gradient-to-br from-primary/60 to-blue-400/60"></div>';i.innerHTML=`
          <div class="visa-card-image">
            ${o}
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
            <div class="visa-rate-row">
              <div>
                <small class="visa-rate small">Starting from</small>
                <div class="visa-rate">${p(t.rate)}</div>
              </div>
              <button class="visa-enquire-btn view-btn">
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        `,i.querySelectorAll(".view-btn").forEach(r=>r.addEventListener("click",()=>f(t,"visa"))),s.appendChild(i)})}catch(n){console.error("Error fetching visas:",n),e.style.display="none",a.classList.remove("hidden"),a.innerHTML=`
        <div class="w-20 h-20 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl"><i class="bi bi-exclamation-triangle"></i></div>
        <h3 class="text-[18px] font-bold text-navy mb-2">Failed to Load</h3>
        <p class="text-text-muted">An error occurred. Please try again later.</p>
      `}},b=async(e,a,s,n)=>{const t=document.getElementById(`${a}-loading`),i=document.getElementById(`${a}-empty`),o=document.getElementById(`${a}-grid`);try{const r=await e();if(t.style.display="none",!r||r.length===0){i.classList.remove("hidden");return}r.sort((l,d)=>(l.country||l.type||"").localeCompare(d.country||d.type||"")),o.innerHTML="",o.classList.remove("hidden"),r.forEach(l=>{const d=l.cost!==void 0?l.cost:l.rate,v=document.createElement("div");v.className="service-card";let S=l.country||l.type||"Service",y="";s==="attestation"?y=`<p class="text-text-muted text-[13px] leading-snug mt-1 line-clamp-2">${l.certificate||""}</p>`:y=`<p class="text-text-muted text-[13px] leading-snug mt-1 line-clamp-2">${l.description||""}</p>`,v.innerHTML=`
          <div class="flex items-start gap-4 mb-4">
            <div class="service-icon-wrap"><i class="${n}"></i></div>
            <div class="flex-1 min-w-0">
              <h3 class="text-[17px] font-bold text-navy leading-snug">${S}</h3>
              ${y}
            </div>
          </div>
          <div class="service-rate-section">
            <div>
              <small class="service-rate small">Rate</small>
              <div class="service-rate">${p(d)}</div>
            </div>
            <button class="service-arrow-btn view-btn"><i class="bi bi-arrow-right"></i></button>
          </div>
        `,v.querySelector(".view-btn").addEventListener("click",()=>f({...l,rate:d},s)),o.appendChild(v)})}catch(r){console.error(`Error fetching ${s}:`,r),t.style.display="none",i.classList.remove("hidden"),i.innerHTML='<div class="text-red-500 flex items-center justify-center gap-2"><i class="bi bi-exclamation-triangle"></i> Failed to load. Please try again.</div>'}};B(),b(M,"visa-stamping","stamping","bi bi-stamp"),b(H,"attestations","attestation","bi bi-patch-check"),b(N,"passport-services","passport","bi bi-journal-bookmark")});
