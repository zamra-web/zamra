import"./firebase-config-C3FJvAwC.js";/* empty css              */import{r as I,s as j,t as B,v as C}from"./db-VIz2p67e.js";document.addEventListener("DOMContentLoaded",()=>{const f=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?f.classList.add("scrolled"):f.classList.remove("scrolled")});const m=document.getElementById("mobile-toggle"),p=document.getElementById("nav-menu");m&&m.addEventListener("click",()=>{p.classList.toggle("active");const e=m.querySelector("i");p.classList.contains("active")?e.classList.replace("bi-list","bi-x-lg"):e.classList.replace("bi-x-lg","bi-list")}),document.querySelectorAll('a[href^="/index.html#"]').forEach(e=>{e.addEventListener("click",function(n){p&&p.classList.contains("active")&&(p.classList.remove("active"),m&&m.querySelector("i").classList.replace("bi-x-lg","bi-list"))})});const d=document.getElementById("visa-modal"),y=document.getElementById("modal-close"),u=document.getElementById("modal-banner"),L=document.getElementById("modal-country"),E=document.getElementById("modal-type"),$=document.getElementById("modal-time"),k=document.getElementById("modal-rate"),S=document.getElementById("modal-enquire-btn"),v=e=>{if(!e&&e!==0)return"N/A";const n=parseFloat(e);return isNaN(n)?e:`₹${n.toLocaleString("en-IN")}`},h=(e,n)=>{let i="",l="Type",t="",o="Processing Time",r="",a=v(e.rate),s="";n==="visa"?(i=e.country,t=e.visaType||"Tourist",r=e.processingTime||"N/A",u.innerHTML=`
        <div class="absolute inset-0 bg-cover bg-center blur-[2px] opacity-40 scale-105" style="background-image: url('${e.flagUrl||"/assets/img/placeholder.jpg"}')"></div>
        <div class="w-[80px] h-[80px] rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 bg-white flex items-center justify-center">
          <img src="${e.flagUrl||"/assets/img/placeholder.jpg"}" alt="${i}" class="w-full h-full object-cover">
        </div>
      `,s=`Hello Zamra Travels, I am interested in exploring visa details for:

🌍 Country: *${i}*
📄 Visa Type: *${t}*
💵 Rate: *${a}*

Please provide me with more information and the required documents.`):n==="stamping"?(i=e.country||"Unknown",t=e.description||"Visa Stamping",r=e.processingTime||e.processing_time||"N/A",u.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-80"></div>
        <div class="w-[80px] h-[80px] rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 bg-white flex items-center justify-center text-primary text-[36px]">
          <i class="bi bi-stamp"></i>
        </div>
      `,s=`Hello Zamra Travels, I am interested in Visa Stamping details for:

🌍 Country: *${i}*
⏱️ Processing Time: *${r}*
💵 Rate: *${a}*

Please provide me with more information.`):n==="attestation"?(i=e.country||"Unknown",t=e.certificate||"Attestation",o="Details",r=e.description||"N/A",u.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-80"></div>
        <div class="w-[80px] h-[80px] rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 bg-white flex items-center justify-center text-primary text-[36px]">
          <i class="bi bi-patch-check"></i>
        </div>
      `,s=`Hello Zamra Travels, I am interested in Certificate Attestation for:

🌍 Country: *${i}*
📄 Certificate: *${t}*
💵 Rate: *${a}*

Please provide me with more information.`):n==="passport"&&(i=e.type||"Unknown",t="Passport Service",r=e.description||e.processing_time||"N/A",u.innerHTML=`
        <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-80"></div>
        <div class="w-[80px] h-[80px] rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 bg-white flex items-center justify-center text-primary text-[36px]">
          <i class="bi bi-journal-bookmark"></i>
        </div>
      `,s=`Hello Zamra Travels, I am interested in Passport Services for:

📄 Type: *${i}*
⏱️ Details: *${r}*
💵 Rate: *${a}*

Please provide me with more information.`),L.textContent=i,document.querySelector("#modal-type").previousElementSibling.querySelector("span").textContent=l,E.textContent=t,document.querySelector("#modal-time").previousElementSibling.querySelector("span").textContent=o,n==="attestation"?document.querySelector("#modal-time").previousElementSibling.querySelector("i").className="bi bi-info-circle text-primary text-[18px]":document.querySelector("#modal-time").previousElementSibling.querySelector("i").className="bi bi-hourglass-split text-primary text-[18px]",$.textContent=r,k.textContent=a,S.href=`https://wa.me/919846606739?text=${encodeURIComponent(s)}`,d.classList.add("active"),document.body.style.overflow="hidden"},g=()=>{d.classList.remove("active"),document.body.style.overflow=""};y&&y.addEventListener("click",g),d&&d.addEventListener("click",e=>{e.target===d&&g()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&d.classList.contains("active")&&g()});const T=async()=>{const e=document.getElementById("visas-loading"),n=document.getElementById("visas-empty"),i=document.getElementById("visas-grid");try{const l=await I();e.style.display="none",l.length===0?n.classList.remove("hidden"):(i.innerHTML="",i.classList.remove("hidden"),l.sort((t,o)=>t.country.localeCompare(o.country)),l.forEach(t=>{const o=document.createElement("div");o.className="bg-white rounded-2xl border border-slate-100 shadow-[var(--shadow-premium-soft)] overflow-hidden hover:shadow-[0_12px_32px_rgba(13,31,60,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col group",o.innerHTML=`
            <div class="h-[140px] w-full relative overflow-hidden bg-slate-100 flex items-center justify-center p-6">
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[1]"></div>
              <img src="${t.flagUrl||"/assets/img/placeholder.jpg"}" alt="${t.country}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 absolute inset-0">
              <h3 class="text-white text-[22px] font-heading font-bold relative z-10 self-end w-full tracking-wide drop-shadow-md">${t.country}</h3>
            </div>
            <div class="p-6 flex-1 flex flex-col">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[13px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">${t.visaType||"Tourist"}</span>
                <span class="text-text-muted text-[13px] font-medium flex items-center gap-1.5"><i class="bi bi-clock"></i> ${t.processingTime||"N/A"}</span>
              </div>
              <div class="mt-auto pt-6 flex items-center justify-between border-t border-slate-100">
                <div>
                  <div class="text-[12px] text-text-muted font-medium mb-0.5">Starting from</div>
                  <div class="text-[18px] font-black text-navy leading-none tracking-tight">${v(t.rate)}</div>
                </div>
                <button class="w-[40px] h-[40px] rounded-full bg-primary/5 text-primary flex items-center justify-center transition-all hover:bg-primary hover:text-white view-details-btn">
                  <i class="bi bi-arrow-right text-[18px]"></i>
                </button>
              </div>
            </div>
          `,o.querySelector(".view-details-btn").addEventListener("click",()=>h(t,"visa")),i.appendChild(o)}))}catch(l){console.error("Error fetching visas:",l),e.style.display="none",n.classList.remove("hidden"),n.innerHTML=`
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h3 class="text-[20px] font-bold text-navy mb-2">Failed to load</h3>
        <p class="text-text-muted">An error occurred while loading visas. Please try again later.</p>
      `}},b=async(e,n,i,l)=>{const t=document.getElementById(`${n}-loading`),o=document.getElementById(`${n}-empty`),r=document.getElementById(`${n}-grid`);try{const a=await e();t.style.display="none",!a||a.length===0?o.classList.remove("hidden"):(r.innerHTML="",r.classList.remove("hidden"),a.sort((s,c)=>(s.type||"").localeCompare(c.type||"")),a.forEach(s=>{const c=document.createElement("div");c.className="bg-white rounded-2xl border border-slate-100 shadow-[var(--shadow-premium-soft)] p-6 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(13,31,60,0.08)] transition-all duration-300 flex flex-col group";let x="";i==="attestation"?x=`<span class="text-text-muted text-[13px] font-medium flex-1 line-clamp-2" title="${s.certificate||""}">${s.certificate||"N/A"}</span>`:x=`<span class="text-text-muted text-[13px] font-medium flex items-center gap-1.5"><i class="bi bi-clock"></i> ${s.processing_time||s.processingTime||"N/A"}</span>`;const w=s.cost!==void 0?s.cost:s.rate;c.innerHTML=`
            <div class="flex items-start gap-4 mb-4">
              <div class="w-[50px] h-[50px] rounded-xl bg-primary/5 text-primary flex items-center justify-center text-[24px] shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <i class="${l}"></i>
              </div>
              <div>
                <h3 class="text-[18px] font-bold text-navy leading-tight mb-2">${s.type||s.country}</h3>
                ${x}
              </div>
            </div>
            
            <div class="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
              <div>
                <div class="text-[12px] text-text-muted font-medium mb-0.5">Rate</div>
                <div class="text-[18px] font-black text-navy leading-none tracking-tight">${v(w)}</div>
              </div>
              <button class="w-[40px] h-[40px] rounded-full bg-primary/5 text-primary flex items-center justify-center transition-all hover:bg-primary hover:text-white view-details-btn shrink-0">
                <i class="bi bi-arrow-right text-[18px]"></i>
              </button>
            </div>
          `,c.querySelector(".view-details-btn").addEventListener("click",()=>h({...s,rate:w},i)),r.appendChild(c)}))}catch(a){console.error(`Error fetching ${i}:`,a),t.style.display="none",o.classList.remove("hidden"),o.innerHTML='<div class="text-red-500"><i class="bi bi-exclamation-triangle mr-2"></i> Failed to load data</div>'}};T(),b(j,"visa-stamping","stamping","bi bi-stamp"),b(B,"attestations","attestation","bi bi-patch-check"),b(C,"passport-services","passport","bi bi-journal-bookmark")});
