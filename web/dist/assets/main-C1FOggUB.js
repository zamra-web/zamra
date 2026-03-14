import"./index.esm-kRT_WKqT.js";/* empty css              */import{g as F,a as P,b as K}from"./db-DIsZtkDY.js";import"./firebase-config-aHS-3htW.js";document.addEventListener("DOMContentLoaded",()=>{const L=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?L.classList.add("scrolled"):L.classList.remove("scrolled")});const f=document.getElementById("mobile-toggle"),m=document.getElementById("nav-menu");f&&f.addEventListener("click",()=>{m.classList.toggle("active");const t=f.querySelector("i");m.classList.contains("active")?t.classList.replace("bi-list","bi-x-lg"):t.classList.replace("bi-x-lg","bi-list")}),document.querySelectorAll('a[href^="#"]').forEach(t=>{t.addEventListener("click",function(h){const d=this.getAttribute("href");if(m&&m.classList.contains("active")&&(m.classList.remove("active"),f&&f.querySelector("i").classList.replace("bi-x-lg","bi-list")),d&&d!=="#"){const s=document.querySelector(d);if(s){h.preventDefault();const l=s.getBoundingClientRect().top+window.pageYOffset-80;window.scrollTo({top:l,behavior:"smooth"}),window.history.pushState(null,"",d)}}})});const $=[{id:"kozhikode",code:"CCJ",name:"Kozhikode"},{id:"kochi",code:"COK",name:"Kochi"},{id:"kannur",code:"CNN",name:"Kannur"},{id:"trivandrum",code:"TRV",name:"Trivandrum"},{id:"mangalore",code:"IXE",name:"Mangalore"}],E=[{id:"jeddah",code:"JED",name:"Jeddah"},{id:"riyadh",code:"RUH",name:"Riyadh"},{id:"dammam",code:"DMM",name:"Dammam"},{id:"doha",code:"DOH",name:"Doha"},{id:"muscat",code:"MCT",name:"Muscat"},{id:"bahrain",code:"BAH",name:"Bahrain"},{id:"kuwait",code:"KWI",name:"Kuwait"},{id:"dubai",code:"DXB",name:"Dubai"},{id:"sharjah",code:"SHJ",name:"Sharjah"},{id:"abudhabi",code:"AUH",name:"Abu Dhabi"},{id:"rasalkhaimah",code:"RKT",name:"Ras Al Khaimah"},{id:"alain",code:"AAN",name:"Al Ain"},{id:"fujairah",code:"FJR",name:"Fujairah"}],T=document.getElementById("flight-grids-container");if(T){const t=(h,d,s)=>{const c=document.createElement("div");c.className="mb-[50px]",c.innerHTML=`
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> Flights From ${s}
        </h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6" id="grid-${s.replace(/\s+/g,"-").toLowerCase()}"></div>
      `,T.appendChild(c);const B=c.querySelector(`#grid-${s.replace(/\s+/g,"-").toLowerCase()}`);h.forEach(l=>{const I=document.createElement("div");I.className="sector-card bg-gradient-to-r from-primary to-[#1558c0] p-[18px_24px] rounded-[16px] shadow-[var(--shadow-premium-soft)] cursor-pointer hover:shadow-[0_8px_25px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center relative overflow-hidden group",I.innerHTML=`<h4 class="text-[17px] font-heading font-extrabold text-white m-0 flex items-center justify-between z-[2] relative w-full">${l.name} (${l.code}) <i class="bi bi-arrow-right-circle text-white/80 text-[22px]"></i></h4>`,I.addEventListener("click",()=>{typeof e=="function"&&e(l,d)}),B.appendChild(I)})};t($,E,"India"),t(E,$,"Middle East")}const g=document.getElementById("sector-modal"),M=document.getElementById("modal-close"),b=document.getElementById("modal-body"),p=document.getElementById("modal-route"),D=document.getElementById("modal-title");function e(t,h){D.textContent="Select Destination",p.textContent=`Flying from ${t.name}`,p.classList.remove("bg-primary-light","text-primary"),p.classList.add("bg-slate-100","text-slate-600"),g.classList.add("active"),document.body.style.overflow="hidden",b.innerHTML=`
      <div class="text-center mb-6">
        <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Routes</h4>
        <p class="text-text-muted text-sm">Select a destination to view flight options</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1" id="routes-grid">
      </div>
    `;const d=document.getElementById("routes-grid");h.forEach(s=>{const c=`${t.code} ${s.code}`,B=`${t.name} → ${s.name}`,l=document.createElement("button");l.className="bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all flex items-center justify-between group cursor-pointer w-full text-left",l.innerHTML=`
        <span class="font-bold text-navy text-[15px]">${t.name} to ${s.name}</span>
        <i class="bi bi-chevron-right text-text-muted group-hover:text-primary transition-colors"></i>
      `,l.onclick=()=>{y(c,B)},d.appendChild(l)})}function y(t,h){D.textContent="Flight Details",p.textContent=t.replace(" "," → "),p.classList.add("bg-primary-light","text-primary"),p.classList.remove("bg-slate-100","text-slate-600"),g.classList.add("active"),document.body.style.overflow="hidden",b.innerHTML='<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>';async function d(){try{const c=(await F()).find(u=>u.sectorCode===t),B=await K(),l={};B.forEach(u=>l[u.id]=u.name);let I="";if(c){const u=new Date;u.setHours(0,0,0,0);let A=await P({sectorId:c.id,startDate:u.toISOString()});A.sort((o,v)=>o.flightDate.getTime()===v.flightDate.getTime()?o.finalRate-v.finalRate:o.flightDate.getTime()-v.flightDate.getTime()),A.length===0?I='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>':I=A.map(o=>{const v=l[o.airlineId]||"Unknown Airline",G={day:"2-digit",month:"short",year:"numeric"},C=o.flightDate.toLocaleDateString("en-GB",G),H=o.flightTime&&o.flightTime.split("-")[0]?o.flightTime.split("-")[0].trim():"TBA",j=o.flightTime&&o.flightTime.includes("-")?o.flightTime.split("-")[1].trim():"TBA",O=`₹${o.finalRate.toLocaleString("en-IN")}`,U=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'd like to book this flight:

✈️ *${v}*
🗯️ Route: *${h}*
📅 Date: *${C}*
⏰ Dep: ${H} | Arr: ${j}
💵 Price: *${O}*

Please confirm availability!`)}`;return`
                          <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                              <td class="p-[12px_15px] whitespace-nowrap"><strong>${C}</strong></td>
                              <td class="p-[12px_15px] whitespace-nowrap"><strong>${v}</strong></td>
                              <td class="p-[12px_15px]">${H}</td>
                              <td class="p-[12px_15px]">${j}</td>
                              <td class="p-[12px_15px] text-right"><strong>${O}</strong></td>
                              <td class="p-[12px_10px] text-center">
                                <a href="${U}" target="_blank" class="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-[#1558c0] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap hover:shadow-[0_3px_10px_rgba(26,115,232,0.35)] hover:-translate-y-0.5 transition-all">
                                  <i class="bi bi-whatsapp"></i> Book Now
                                </a>
                              </td>
                          </tr>`}).join("")}else I='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>';b.innerHTML=`
                <div class="text-center mb-4">
                    <button class="mb-4 text-primary font-bold text-[14px] hover:underline flex items-center gap-2 justify-center mx-auto" id="back-to-routes">
                      <i class="bi bi-arrow-left"></i> Back to Destinations
                    </button>
                    <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${h}</h4>
                    <p class="text-text-muted text-sm">Prices are introductory and subject to availability.</p>
                </div>
                <div class="overflow-x-auto w-full pb-2">
                  <table class="w-full min-w-[680px] border-collapse my-[10px] text-[14px] text-left rounded-[10px] overflow-hidden">
                      <thead>
                          <tr class="bg-[#f8fafc] text-text-muted font-bold border-b-2 border-[#e2e8f0]">
                              <th class="p-[12px_15px]">Date</th>
                              <th class="p-[12px_15px]">Airlines</th>
                              <th class="p-[12px_15px]">Departure</th>
                              <th class="p-[12px_15px]">Arrival</th>
                              <th class="p-[12px_15px] text-right">Price</th>
                              <th class="p-[12px_15px]"></th>
                          </tr>
                      </thead>
                      <tbody>
                          ${I}
                      </tbody>
                  </table>
                </div>
            `;const _=document.getElementById("back-to-routes");_&&_.addEventListener("click",()=>{const u=t.split(" ")[0];let A=$.find(v=>v.code===u),o=E;A||(A=E.find(v=>v.code===u),o=$),A?e(A,o):x()})}catch(s){console.error("Error fetching fares:",s),b.innerHTML='<p class="text-center text-red-500 my-4">Error loading flights. Please try again later.</p>'}}d()}function x(){g.classList.remove("active"),document.body.style.overflow=""}M&&M.addEventListener("click",x),g&&g.addEventListener("click",t=>{t.target===g&&x()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&g.classList.contains("active")&&x()}),(()=>{document.querySelector(".partners-slider")})();const a=document.getElementById("live-search-btn");a&&a.addEventListener("click",()=>{typeof N=="function"&&N()});const i=document.getElementById("swap-locations"),n=document.getElementById("swap-locations-mobile"),r=document.getElementById("origin"),w=document.getElementById("destination"),k=()=>{if(r&&w){const t=r.value;r.value=w.value,w.value=t}};i&&i.addEventListener("click",k),n&&n.addEventListener("click",k)});async function N(){const L=document.getElementById("origin").value,f=document.getElementById("destination").value,m=document.getElementById("flightList"),S=document.getElementById("loading"),$=document.getElementById("resultsHeader"),E=document.getElementById("origName"),T=document.getElementById("locName");m.innerHTML="",S.style.display="block",$.style.display="none";try{const g=await F(),M=`${L} ${f}`,b=g.find(e=>e.sectorCode===M);let p=[];if(b){const e=new Date;e.setHours(0,0,0,0);let y=await P({sectorId:b.id,startDate:e.toISOString()});y.sort((a,i)=>a.flightDate.getTime()===i.flightDate.getTime()?a.finalRate-i.finalRate:a.flightDate.getTime()-i.flightDate.getTime());const x=await K(),R={};x.forEach(a=>R[a.id]=a.name),p=y.map(a=>{const i={day:"2-digit",month:"short",year:"numeric"},n=a.flightDate.toLocaleDateString("en-GB",i).replace(/,/g,""),r=a.flightTime&&a.flightTime.split("-")[0]?a.flightTime.split("-")[0].trim():"TBA",w=a.flightTime&&a.flightTime.includes("-")?a.flightTime.split("-")[1].trim():"TBA",k=Number(a.baggage)||0,t=Number(a.extraBaggage)||0,h=k?`${k} KG`:"No Check-in",d=t?`+ ${t} KG`:"",s=k+t,c=s>0?`${s}KG`:"0KG";return{airline:R[a.airlineId]||"Unknown Airline",origin:b.sectorFrom,originCode:L,destination:b.sectorTo,destinationCode:f,date:n,departure:r,arrival:w,price:"₹"+a.finalRate.toLocaleString("en-IN"),seats:a.seatsAvailable||0,checkInBaggage:h,cabinBaggage:d,baggageLabel:c}})}if(S.style.display="none",$.style.display="block",E&&(E.innerText=L),T&&(T.innerText=f),!p||p.length===0){m.innerHTML=`<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found from ${L} to ${f}. Try another destination.</div>`;return}let D="";p.forEach(e=>{let y="00",x="MTH";if(e.date){const w=e.date.split(" ");w.length>=2?(y=w[0],x=w[1]):(y=e.date,x="")}const a=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${e.airline}*
🛫 From: *${e.origin}*
🛬 To: *${e.destination}*
📅 Date: *${e.date}*
⏰ Dep: ${e.departure} | Arr: ${e.arrival}
💵 Price: *${e.price}*

Please confirm availability!`)}`;let i=(e.airline||"").toUpperCase().trim(),n="";const r={INDIGO:"/assets/img/flights/indigo.png","AIR INDIA EXPRESS":"/assets/img/flights/air-india-express.png","AIR ARABIA":"/assets/img/flights/air-arabia.png",FLYNAS:"/assets/img/flights/flynas.png","OMAN AIR":"/assets/img/flights/oman-air.png","SALAM AIR":"/assets/img/flights/salam-air.png","AIR INDIA":"/assets/img/flights/air-india.png",SAUDIA:"/assets/img/flights/saudia.png"};i.includes("EXPRESS")||i==="IX"?n=r["AIR INDIA EXPRESS"]:i.includes("INDIA")||i==="AI"?n=r["AIR INDIA"]:i.includes("SAUD")||i.includes("SOUD")||i==="SV"?n=r.SAUDIA:i.includes("INDIGO")||i==="6E"?n=r.INDIGO:i.includes("ARABIA")||i==="G9"?n=r["AIR ARABIA"]:i.includes("FLYNAS")||i==="XY"?n=r.FLYNAS:i.includes("OMAN")||i==="WY"?n=r["OMAN AIR"]:i.includes("SALAM")||i==="OV"?n=r["SALAM AIR"]:n="",D+=`
        <div class="bg-white rounded-[16px] p-4 lg:p-6 mb-4 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] relative">
          
          <!-- MOBILE VIEW (< lg) -->
          <div class="flex flex-col gap-4 lg:hidden">
            <!-- Mobile Top Section -->
            <div class="flex items-center justify-start gap-4 border-b border-border pb-4">
              <div class="w-[60px] h-[60px] shrink-0 bg-[#f8fafc] rounded-xl border border-border/50 flex items-center justify-center p-2">
                <img src="${n}" onerror="this.style.display='none'" class="max-h-full max-w-full object-contain">
              </div>
              <div>
                <div class="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-1">${e.airline}</div>
                <div class="text-[18px] font-heading font-bold text-navy flex items-baseline gap-1.5 leading-none">
                  ${y} <span class="text-primary text-[14px]">${x}</span>
                </div>
              </div>
            </div>

            <!-- Mobile Middle Section -->
            <div class="flex flex-row items-center justify-between gap-2 px-2">
              <div class="text-left flex-none">
                <div class="text-[20px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${e.originCode}</div>
                <div class="text-[12px] font-medium text-text-muted uppercase">Dep: ${e.departure}</div>
              </div>
              
              <!-- Mobile Connector -->
              <div class="flex flex-col items-center px-2">
                <i class="bi bi-arrow-right text-primary text-[24px]"></i>
                <div class="text-[10px] text-text-muted font-bold mt-1">${e.baggageLabel}</div>
              </div>

              <div class="text-right flex-none">
                <div class="text-[20px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${e.destinationCode}</div>
                <div class="text-[12px] font-medium text-text-muted uppercase">Arr: ${e.arrival}</div>
              </div>
            </div>

            <!-- Mobile Bottom Section -->
            <div class="flex sm:flex-row flex-col items-center justify-between w-full border-t border-border pt-4 gap-3 sm:gap-0">
              <div class="flex flex-col items-center sm:items-start w-full sm:w-auto">
                <span class="text-[24px] font-heading font-bold text-navy leading-none tracking-tight">${e.price}</span>
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
                <div class="text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${y}</div>
                <div class="text-[20px] font-medium text-navy capitalize">${x}</div>
              </div>
              
              <div class="w-[100px] shrink-0 text-center flex items-center justify-center">
                <img src="${n}" onerror="this.style.display='none'" class="max-h-[35px] max-w-full object-contain">
              </div>
            </div>

            <!-- Middle side: Routes & Details -->
            <div class="flex flex-1 flex-row items-center justify-between gap-8 px-6">
              
              <!-- Route -->
              <div class="flex items-center gap-6 lg:gap-8 mx-0">
                <div class="text-left w-[100px]">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">From</div>
                  <div class="text-[20px] font-bold text-navy uppercase leading-none tracking-tight break-words truncate w-[100px]">${e.origin}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${e.originCode}</div>
                </div>
                
                <div class="w-[46px] h-[46px] rounded-full bg-[#f8fafc] border border-border flex items-center justify-center shrink-0 shadow-sm relative">
                  <i class="bi bi-arrow-right text-primary text-[20px]"></i>
                </div>
                
                <div class="text-left w-[100px]">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">To</div>
                  <div class="text-[20px] font-bold text-navy uppercase leading-none tracking-tight break-words truncate w-[100px]">${e.destination}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${e.destinationCode}</div>
                </div>
              </div>

              <!-- Times & Info -->
              <div class="flex gap-10 lg:gap-14 text-sm mx-0">
                <div class="text-left">
                  <div class="text-[14px] font-bold text-navy mb-3">Flight time</div>
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">Dep- ${e.departure}</div>
                  <div class="text-[13px] text-text-muted font-medium flex items-center">Arr- ${e.arrival}</div>
                </div>
                <div class="text-left">
                  <div class="text-[14px] font-bold text-navy mb-3">Luggage</div>
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">${e.checkInBaggage}</div>
                  <div class="text-[14px] font-bold text-navy flex items-center">${e.cabinBaggage}</div>
                </div>
              </div>
              
            </div>

            <!-- Right side: Price & Action -->
            <div class="flex flex-col items-center justify-center lg:w-[180px] shrink-0">
              <div class="bg-[#f8fafc] rounded-xl p-4 w-full flex flex-col items-center border border-border/50">
                <span class="text-[32px] font-medium text-navy tracking-tight mb-3 leading-none flex items-center">
                  ${e.price}
                </span>
                <a href="${a}" target="_blank" class="w-full bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[15px] px-6 py-2.5 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                  Book Now
                </a>
              </div>
            </div>

          </div>

        </div>
      `}),m.innerHTML=D}catch(g){S.style.display="none",m&&(m.innerHTML='<div class="text-center text-red-500 p-10 font-bold border-2 border-dashed border-red-200 rounded-[24px] mt-6 bg-red-50">Error connection. Failed to fetch live flights. Please ensure the server is active.</div>'),console.error(g)}}window.searchFlights=N;
