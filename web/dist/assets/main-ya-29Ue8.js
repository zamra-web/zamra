import"./firebase-config-zYKzaodH.js";import{g as X,a as q,b as W}from"./db-BxSq6g0-.js";document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?e.classList.add("scrolled"):e.classList.remove("scrolled")});const t=document.getElementById("mobile-toggle"),n=document.getElementById("nav-menu");t&&t.addEventListener("click",()=>{n.classList.toggle("active");const d=t.querySelector("i");n.classList.contains("active")?d.classList.replace("bi-list","bi-x-lg"):d.classList.replace("bi-x-lg","bi-list")}),document.querySelectorAll('a[href^="#"]').forEach(d=>{d.addEventListener("click",function(M){const w=this.getAttribute("href");if(n&&n.classList.contains("active")&&(n.classList.remove("active"),t&&t.querySelector("i").classList.replace("bi-x-lg","bi-list")),w&&w!=="#"){const h=document.querySelector(w);if(h){M.preventDefault();const v=h.getBoundingClientRect().top+window.pageYOffset-80;window.scrollTo({top:v,behavior:"smooth"}),window.history.pushState(null,"",w)}}})});const g=[{id:"kozhikode",code:"CCJ",name:"Kozhikode"},{id:"kochi",code:"COK",name:"Kochi"},{id:"kannur",code:"CNN",name:"Kannur"},{id:"trivandrum",code:"TRV",name:"Trivandrum"},{id:"mangalore",code:"IXE",name:"Mangalore"}],f=[{id:"jeddah",code:"JED",name:"Jeddah"},{id:"riyadh",code:"RUH",name:"Riyadh"},{id:"dammam",code:"DMM",name:"Dammam"},{id:"doha",code:"DOH",name:"Doha"},{id:"muscat",code:"MCT",name:"Muscat"},{id:"bahrain",code:"BAH",name:"Bahrain"},{id:"kuwait",code:"KWI",name:"Kuwait"},{id:"dubai",code:"DXB",name:"Dubai"},{id:"sharjah",code:"SHJ",name:"Sharjah"},{id:"abudhabi",code:"AUH",name:"Abu Dhabi"},{id:"rasalkhaimah",code:"RKT",name:"Ras Al Khaimah"},{id:"alain",code:"AAN",name:"Al Ain"},{id:"fujairah",code:"FJR",name:"Fujairah"}],b=document.getElementById("flight-grids-container");if(b){const d=(M,w,h)=>{const E=document.createElement("div");E.className="mb-[50px]",E.innerHTML=`
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> Flights From ${h}
        </h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6" id="grid-${h.replace(/\s+/g,"-").toLowerCase()}"></div>
      `,b.appendChild(E);const N=E.querySelector(`#grid-${h.replace(/\s+/g,"-").toLowerCase()}`);M.forEach(v=>{const S=document.createElement("div");S.className="sector-card bg-gradient-to-r from-primary to-[#1558c0] p-[18px_24px] rounded-[16px] shadow-[var(--shadow-premium-soft)] cursor-pointer hover:shadow-[0_8px_25px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center relative overflow-hidden group",S.innerHTML=`<h4 class="text-[17px] font-heading font-extrabold text-white m-0 flex items-center justify-between z-[2] relative w-full">${v.name} (${v.code}) <i class="bi bi-arrow-right-circle text-white/80 text-[22px]"></i></h4>`,S.addEventListener("click",()=>{typeof i=="function"&&i(v,w)}),N.appendChild(S)})};d(g,f,"India"),d(f,g,"Middle East")}const l=document.getElementById("sector-modal"),x=document.getElementById("modal-close"),o=document.getElementById("modal-body"),c=document.getElementById("modal-route"),k=document.getElementById("modal-title");function i(d,M){k.textContent="Select Destination",c.textContent=`Flying from ${d.name}`,c.classList.remove("bg-primary-light","text-primary"),c.classList.add("bg-slate-100","text-slate-600"),l.classList.add("active"),document.body.style.overflow="hidden",o.innerHTML=`
      <div class="text-center mb-6">
        <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Routes</h4>
        <p class="text-text-muted text-sm">Select a destination to view flight options</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1" id="routes-grid">
      </div>
    `;const w=document.getElementById("routes-grid");M.forEach(h=>{const E=`${d.code} ${h.code}`,N=`${d.name} → ${h.name}`,v=document.createElement("button");v.className="bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all flex items-center justify-between group cursor-pointer w-full text-left",v.innerHTML=`
        <span class="font-bold text-navy text-[15px]">${h.name}</span>
        <i class="bi bi-chevron-right text-text-muted group-hover:text-primary transition-colors"></i>
      `,v.onclick=()=>{A(E,N)},w.appendChild(v)})}function A(d,M){k.textContent="Flight Details",c.textContent=d.replace(" "," → "),c.classList.add("bg-primary-light","text-primary"),c.classList.remove("bg-slate-100","text-slate-600"),l.classList.add("active"),document.body.style.overflow="hidden",o.innerHTML='<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>';async function w(){try{const E=(await X()).find(I=>I.sectorCode===d),N=await W(),v={};N.forEach(I=>v[I.id]=I.name);let S="";if(E){const I=new Date;I.setHours(0,0,0,0);let C=await q({sectorId:E.id,startDate:I.toISOString()});C.sort((p,T)=>p.flightDate.getTime()===T.flightDate.getTime()?p.finalRate-T.finalRate:p.flightDate.getTime()-T.flightDate.getTime()),C.length===0?S='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>':S=C.map(p=>{const T=v[p.airlineId]||"Unknown Airline",Q={day:"2-digit",month:"short",year:"numeric"},tt=p.flightDate.toLocaleDateString("en-GB",Q),et=p.flightTime&&p.flightTime.split("-")[0]?p.flightTime.split("-")[0].trim():"TBA",it=p.flightTime&&p.flightTime.includes("-")?p.flightTime.split("-")[1].trim():"TBA";return`
                          <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                              <td class="p-[14px_15px] whitespace-nowrap"><strong>${tt}</strong></td>
                              <td class="p-[14px_15px] whitespace-nowrap"><strong>${T}</strong></td>
                              <td class="p-[14px_15px]">${et}</td>
                              <td class="p-[14px_15px]">${it}</td>
                              <td class="p-[14px_15px] text-right"><strong>₹${p.finalRate.toLocaleString("en-IN")}</strong></td>
                          </tr>`}).join("")}else S='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>';o.innerHTML=`
                <div class="text-center mb-4">
                    <button class="mb-4 text-primary font-bold text-[14px] hover:underline flex items-center gap-2 justify-center mx-auto" id="back-to-routes">
                      <i class="bi bi-arrow-left"></i> Back to Destinations
                    </button>
                    <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${M}</h4>
                    <p class="text-text-muted text-sm">Prices are introductory and subject to availability.</p>
                </div>
                <div class="overflow-x-auto w-full pb-2">
                  <table class="w-full min-w-[500px] border-collapse my-[10px] text-[14px] text-left rounded-[10px] overflow-hidden">
                      <thead>
                          <tr class="bg-[#f8fafc] text-text-muted font-bold border-b-2 border-[#e2e8f0]">
                              <th class="p-[14px_15px]">Date</th>
                              <th class="p-[14px_15px]">Airlines</th>
                              <th class="p-[14px_15px]">Departure</th>
                              <th class="p-[14px_15px]">Arrival</th>
                              <th class="p-[14px_15px] text-right">Price</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${S}
                      </tbody>
                  </table>
                </div>
            `;const J=document.getElementById("back-to-routes");J&&J.addEventListener("click",()=>{const I=d.split(" ")[0];let C=g.find(T=>T.code===I),p=f;C||(C=f.find(T=>T.code===I),p=g),C?i(C,p):y()})}catch(h){console.error("Error fetching fares:",h),o.innerHTML='<p class="text-center text-red-500 my-4">Error loading flights. Please try again later.</p>'}}w()}function y(){l.classList.remove("active"),document.body.style.overflow=""}x&&x.addEventListener("click",y),l&&l.addEventListener("click",d=>{d.target===l&&y()}),document.addEventListener("keydown",d=>{d.key==="Escape"&&l.classList.contains("active")&&y()}),(()=>{document.querySelector(".partners-slider")})();const a=document.getElementById("live-search-btn");a&&a.addEventListener("click",()=>{typeof F=="function"&&F()});const s=document.getElementById("swap-locations"),m=document.getElementById("swap-locations-mobile"),u=document.getElementById("origin"),B=document.getElementById("destination"),z=()=>{if(u&&B){const d=u.value;u.value=B.value,B.value=d}};s&&s.addEventListener("click",z),m&&m.addEventListener("click",z)});const nt="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",st=[1,2,21,22,23,24,25,28,31,40,42,43,44];let $=null,L=JSON.parse(localStorage.getItem("zt_hist")||"[]"),G=L.reduce((e,t)=>e+(t.rows||0),0);function U(){document.getElementById("statSubs").textContent=L.length,document.getElementById("statEntries").textContent=G}function ot(){const e=document.getElementById("chipGrid");!e||e.children.length>0||st.forEach(t=>{const n=document.createElement("div");n.className="rp-chip",n.textContent=t,n.style.cssText="height:48px;display:flex;align-items:center;justify-content:center;border:2px solid #b8cce4;border-radius:10px;font-size:15px;font-weight:700;color:#1e293b;cursor:pointer;background:#ffffff;user-select:none;box-shadow:0 1px 4px rgba(13,31,60,.10);transition:all .16s ease;",n.addEventListener("click",()=>at(t,n)),e.appendChild(n)})}document.addEventListener("DOMContentLoaded",()=>{ot(),O(),U()});function at(e,t){$=e,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(n=>{n.classList.remove("on"),n.style.background="#ffffff",n.style.color="#1e293b",n.style.borderColor="#b8cce4",n.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",n.style.transform=""}),t&&(t.classList.add("on"),t.style.background="#1a73e8",t.style.color="#ffffff",t.style.borderColor="#1a73e8",t.style.boxShadow="0 4px 14px rgba(26,115,232,.3)",t.style.transform="translateY(-1px)"),V(),R()}document.getElementById("manualAgent").addEventListener("input",function(){const e=parseInt(this.value);$=e>0?e:null,document.querySelectorAll(".rp-chip").forEach(t=>{t.classList.remove("on"),t.style.background="#ffffff",t.style.color="#1e293b",t.style.borderColor="#b8cce4",t.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",t.style.transform=""}),V(),R()});function V(){const e=document.getElementById("agentPill");$?(e.textContent=`Agent ${$} selected ✓`,e.classList.remove("empty")):(e.textContent="No agent selected",e.classList.add("empty"))}const D=document.getElementById("rateData");let K;D.addEventListener("input",function(){const e=this.value.length;document.getElementById("charCount").textContent=e.toLocaleString()+" character"+(e!==1?"s":""),R(),clearTimeout(K),e>15?K=setTimeout(()=>rt(this.value),500):j()});function R(){document.getElementById("submitBtn").disabled=!($&&D.value.trim().length>10)}function Z(e){const t=[],n={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},r=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let g=null,f="IX";for(const b of e.split(`
`)){const l=b.replace(/[*_~`]/g,"").trim();if(!l)continue;const x=l.match(/([A-Z]{3})\s+([A-Z]{3})/);if(x&&l.length<70&&!l.match(/\d{4,6}/)){g=x[1]+"-"+x[2];const o=l.match(r);o&&(f=o[1]);continue}if(g){const o=l.match(r);if(o&&!l.match(/\d{4,6}/)){f=o[1];continue}const c=l.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(c){const k=parseInt(c[3]);k>=1e3&&k<=99999&&t.push({sector:g,date:`2026-${n[c[2].toUpperCase()]}-${c[1].padStart(2,"0")}`,airline:o?o[1]:f,rate:k})}}}return t}function rt(e){const t=Z(e);if(!t.length){j();return}document.getElementById("prevBox").classList.add("on"),document.getElementById("prevCount").textContent=t.length+" entr"+(t.length===1?"y":"ies");const n=document.getElementById("prevBody");n.innerHTML=t.slice(0,60).map(r=>`
    <tr>
      <td class="td-s">${r.sector}</td>
      <td>${r.date}</td>
      <td class="td-a">${r.airline}</td>
      <td class="td-r">₹${r.rate.toLocaleString()}</td>
    </tr>
  `).join(""),t.length>60&&(n.innerHTML+=`<tr><td colspan="4" style="text-align:center;padding:10px;
      color:var(--z-text-soft);font-size:11px">+ ${t.length-60} more entries</td></tr>`)}function j(){document.getElementById("prevBox").classList.remove("on")}document.getElementById("resetBtn").addEventListener("click",()=>{D.value="",document.getElementById("charCount").textContent="0 characters",j(),R()});document.getElementById("submitBtn").addEventListener("click",async()=>{if(!$||!D.value.trim())return;const e=document.getElementById("submitBtn"),t=e.innerHTML;e.disabled=!0,e.innerHTML='<div class="spin"></div> Processing...';const n=document.getElementById("progBar"),r=document.getElementById("progFill");n.classList.add("on");let g=0;const f=setInterval(()=>{g=Math.min(g+Math.random()*13,85),r.style.width=g+"%"},280),b=Z(D.value),l={agent_id:$,raw_text:D.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"},x={id:Date.now(),agent:$,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:b.length,status:"pen"};L.unshift(x),L.length>15&&L.pop(),P(),O();try{const o=await fetch(nt,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});if(clearInterval(f),r.style.width="100%",o.ok)x.status="ok",Y(b.length);else throw new Error(`Server error ${o.status}`)}catch(o){clearInterval(f),r.style.width="100%",o.message.startsWith("Server error")?(x.status="err",P(),O(),H("error","Submission Failed",o.message)):(x.status="ok",Y(b.length),H("warning","Webhook Not Connected","Data captured locally. Set the WEBHOOK constant to your n8n URL to go live."))}setTimeout(()=>{n.classList.remove("on"),r.style.width="0%",e.innerHTML=t,R()},900)});function Y(e){P(),O(),G+=e,U(),H("success","Submitted Successfully",`Agent ${$} — ${e} entries queued for processing.`),setTimeout(()=>{D.value="",document.getElementById("charCount").textContent="0 characters",j(),R()},500)}const lt={success:'<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'};function H(e,t,n){const r=document.createElement("div");r.className=`toast ${e}`,r.innerHTML=`
    <div class="ti">${lt[e]}</div>
    <div class="tb">
      <div class="tt">${t}</div>
      <div class="tm">${n}</div>
    </div>
    <button class="tx" onclick="this.closest('.rp-toast').remove()">
      <svg viewBox="0 0 12 12" fill="none">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>`,document.getElementById("toastsEl").appendChild(r),setTimeout(()=>r.remove(),7e3)}function P(){localStorage.setItem("zt_hist",JSON.stringify(L))}function O(){const e=document.getElementById("historyWrap");if(!L.length){e.innerHTML=`
      <div class="h-empty">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        No submissions yet
      </div>`;return}e.innerHTML=L.map(t=>`
    <div class="h-item">
      <div class="h-ag">${t.agent}</div>
      <div class="h-meta">
        <div class="h-id">Agent ${t.agent}</div>
        <div class="h-t">${t.time}</div>
      </div>
      <div class="h-rows">
        <span class="h-n">${t.rows}</span>
        <span class="h-l">entries</span>
      </div>
      <div class="dot ${t.status}"></div>
    </div>
  `).join("")}document.getElementById("clearBtn").addEventListener("click",()=>{L.length&&(L=[],G=0,P(),O(),U())});async function F(){const e=document.getElementById("origin").value,t=document.getElementById("destination").value,n=document.getElementById("flightList"),r=document.getElementById("loading"),g=document.getElementById("resultsHeader"),f=document.getElementById("origName"),b=document.getElementById("locName");n.innerHTML="",r.style.display="block",g.style.display="none";try{const l=await X(),x=`${e} ${t}`,o=l.find(i=>i.sectorCode===x);let c=[];if(o){const i=new Date;i.setHours(0,0,0,0);let A=await q({sectorId:o.id,startDate:i.toISOString()});A.sort((a,s)=>a.flightDate.getTime()===s.flightDate.getTime()?a.finalRate-s.finalRate:a.flightDate.getTime()-s.flightDate.getTime());const y=await W(),_={};y.forEach(a=>_[a.id]=a.name),c=A.map(a=>{const s={day:"2-digit",month:"short",year:"numeric"},m=a.flightDate.toLocaleDateString("en-GB",s).replace(/,/g,""),u=a.flightTime&&a.flightTime.split("-")[0]?a.flightTime.split("-")[0].trim():"TBA",B=a.flightTime&&a.flightTime.includes("-")?a.flightTime.split("-")[1].trim():"TBA";return{airline:_[a.airlineId]||"Unknown Airline",origin:o.sectorFrom,originCode:e,destination:o.sectorTo,destinationCode:t,date:m,departure:u,arrival:B,price:"₹"+a.finalRate.toLocaleString("en-IN"),seats:a.seatsAvailable||0}})}if(r.style.display="none",g.style.display="block",f&&(f.innerText=e),b&&(b.innerText=t),!c||c.length===0){n.innerHTML=`<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found from ${e} to ${t}. Try another destination.</div>`;return}let k="";c.forEach(i=>{let A="00",y="MTH";if(i.date){const B=i.date.split(" ");B.length>=2?(A=B[0],y=B[1]):(A=i.date,y="")}const a=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${i.airline}*
🛫 From: *${i.origin}*
🛬 To: *${i.destination}*
📅 Date: *${i.date}*
⏰ Dep: ${i.departure} | Arr: ${i.arrival}
💵 Price: *${i.price}*

Please confirm availability!`)}`;let s=(i.airline||"").toUpperCase().trim(),m="";const u={INDIGO:"/assets/img/flights/indigo.png","AIR INDIA EXPRESS":"/assets/img/flights/air-india-express.png","AIR ARABIA":"/assets/img/flights/air-arabia.png",FLYNAS:"/assets/img/flights/flynas.png","OMAN AIR":"/assets/img/flights/oman-air.png","SALAM AIR":"/assets/img/flights/salam-air.png","AIR INDIA":"/assets/img/flights/air-india.png",SAUDIA:"/assets/img/flights/saudia.png"};s.includes("EXPRESS")||s==="IX"?m=u["AIR INDIA EXPRESS"]:s.includes("INDIA")||s==="AI"?m=u["AIR INDIA"]:s.includes("SAUD")||s.includes("SOUD")||s==="SV"?m=u.SAUDIA:s.includes("INDIGO")||s==="6E"?m=u.INDIGO:s.includes("ARABIA")||s==="G9"?m=u["AIR ARABIA"]:s.includes("FLYNAS")||s==="XY"?m=u.FLYNAS:s.includes("OMAN")||s==="WY"?m=u["OMAN AIR"]:s.includes("SALAM")||s==="OV"?m=u["SALAM AIR"]:m=`https://flycreativekdr.com:8443/FlyCreativeNG/css2/img/Flight_Logo/${i.airline}.png`,k+=`
        <div class="bg-white rounded-[16px] p-4 lg:p-6 mb-4 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] relative">
          
          <!-- MOBILE VIEW (< lg) -->
          <div class="flex flex-col gap-4 lg:hidden">
            <!-- Mobile Top Section -->
            <div class="flex items-center justify-start gap-4 border-b border-border pb-4">
              <div class="w-[60px] h-[60px] shrink-0 bg-[#f8fafc] rounded-xl border border-border/50 flex items-center justify-center p-2">
                <img src="${m}" onerror="this.style.display='none'" class="max-h-full max-w-full object-contain">
              </div>
              <div>
                <div class="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-1">${i.airline}</div>
                <div class="text-[18px] font-heading font-bold text-navy flex items-baseline gap-1.5 leading-none">
                  ${A} <span class="text-primary text-[14px]">${y}</span>
                </div>
              </div>
            </div>

            <!-- Mobile Middle Section -->
            <div class="flex flex-row items-center justify-between gap-2 px-2">
              <div class="text-left flex-none">
                <div class="text-[20px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${i.originCode}</div>
                <div class="text-[12px] font-medium text-text-muted uppercase">Dep: ${i.departure}</div>
              </div>
              
              <!-- Mobile Connector -->
              <div class="flex flex-col items-center px-2">
                <i class="bi bi-arrow-right text-primary text-[24px]"></i>
                <div class="text-[10px] text-text-muted font-bold mt-1">37KG</div>
              </div>

              <div class="text-right flex-none">
                <div class="text-[20px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${i.destinationCode}</div>
                <div class="text-[12px] font-medium text-text-muted uppercase">Arr: ${i.arrival}</div>
              </div>
            </div>

            <!-- Mobile Bottom Section -->
            <div class="flex sm:flex-row flex-col items-center justify-between w-full border-t border-border pt-4 gap-3 sm:gap-0">
              <div class="flex flex-col items-center sm:items-start w-full sm:w-auto">
                <span class="text-[24px] font-heading font-bold text-navy leading-none tracking-tight">${i.price}</span>
                <div class="text-[11px] text-green-600 font-bold mt-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <i class="bi bi-person-check-fill text-[14px]"></i> ${i.seats} Seats Left
                </div>
              </div>
              <a href="${a}" target="_blank" class="w-full sm:w-auto bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[14px] px-6 py-3 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                Book Now
              </a>
            </div>
          </div>

          <!-- DESKTOP VIEW (>= lg) -->
          <div class="hidden lg:flex flex-row items-center justify-between gap-6">
            <!-- Left side: Date & Airline -->
            <div class="flex items-center gap-6 lg:gap-8 w-auto">
              <div class="text-center font-heading leading-tight shrink-0 flex flex-col items-center">
                <div class="text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${A}</div>
                <div class="text-[20px] font-medium text-navy capitalize">${y}</div>
              </div>
              
              <div class="w-[100px] shrink-0 text-center flex items-center justify-center">
                <img src="${m}" onerror="this.style.display='none'" class="max-h-[35px] max-w-full object-contain">
              </div>
            </div>

            <!-- Middle side: Routes & Details -->
            <div class="flex flex-1 flex-row items-center justify-between gap-8 px-6">
              
              <!-- Route -->
              <div class="flex items-center gap-6 lg:gap-8 mx-0">
                <div class="text-left w-[100px]">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">From</div>
                  <div class="text-[20px] font-bold text-navy uppercase leading-none tracking-tight break-words truncate w-[100px]">${i.origin}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${i.originCode}</div>
                </div>
                
                <div class="w-[46px] h-[46px] rounded-full bg-[#f8fafc] border border-border flex items-center justify-center shrink-0 shadow-sm relative">
                  <i class="bi bi-arrow-right text-primary text-[20px]"></i>
                </div>
                
                <div class="text-left w-[100px]">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">To</div>
                  <div class="text-[20px] font-bold text-navy uppercase leading-none tracking-tight break-words truncate w-[100px]">${i.destination}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${i.destinationCode}</div>
                </div>
              </div>

              <!-- Times & Info -->
              <div class="flex gap-10 lg:gap-14 text-sm mx-0">
                <div class="text-left">
                  <div class="text-[14px] font-bold text-navy mb-3">Flight time</div>
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">Dep- ${i.departure}</div>
                  <div class="text-[13px] text-text-muted font-medium flex items-center">Arr- ${i.arrival}</div>
                </div>
                <div class="text-left">
                  <div class="text-[14px] font-bold text-navy mb-3">Luggage</div>
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">30 KG</div>
                  <div class="text-[14px] font-bold text-navy flex items-center">+ 7 KG</div>
                </div>
              </div>
              
            </div>

            <!-- Right side: Price & Action -->
            <div class="flex flex-col items-center justify-center lg:w-[180px] shrink-0">
              <div class="bg-[#f8fafc] rounded-xl p-4 w-full flex flex-col items-center border border-border/50">
                <span class="text-[32px] font-medium text-navy tracking-tight mb-3 leading-none flex items-center">
                  ${i.price}
                </span>
                <a href="${a}" target="_blank" class="w-full bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[15px] px-6 py-2.5 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                  Book Now
                </a>
                <div class="text-[11px] text-green-600 font-bold mt-2.5 text-center uppercase tracking-wide flex items-center gap-1">
                  <i class="bi bi-person-check-fill"></i> ${i.seats} Seats Left
                </div>
              </div>
            </div>

          </div>

        </div>
      `}),n.innerHTML=k}catch(l){r.style.display="none",H("error","Connection Error","Failed to fetch live flights. Please ensure the server is active."),console.error(l)}}window.searchFlights=F;
