import"./index.esm-DPDniVF0.js";import{i as K}from"./site-chrome-Dy5oun64.js";import{g as j,a as F,b as O}from"./db-Dzh3zJx8.js";import"./firebase-config-CsZGR70X.js";document.addEventListener("DOMContentLoaded",()=>{K({enableSmoothScroll:!0});const f=[{id:"kozhikode",code:"CCJ",name:"Kozhikode"},{id:"kochi",code:"COK",name:"Kochi"},{id:"kannur",code:"CNN",name:"Kannur"},{id:"trivandrum",code:"TRV",name:"Trivandrum"},{id:"mangalore",code:"IXE",name:"Mangalore"}],h=[{id:"jeddah",code:"JED",name:"Jeddah"},{id:"riyadh",code:"RUH",name:"Riyadh"},{id:"dammam",code:"DMM",name:"Dammam"},{id:"doha",code:"DOH",name:"Doha"},{id:"muscat",code:"MCT",name:"Muscat"},{id:"bahrain",code:"BAH",name:"Bahrain"},{id:"kuwait",code:"KWI",name:"Kuwait"},{id:"dubai",code:"DXB",name:"Dubai"},{id:"sharjah",code:"SHJ",name:"Sharjah"},{id:"abudhabi",code:"AUH",name:"Abu Dhabi"},{id:"rasalkhaimah",code:"RKT",name:"Ras Al Khaimah"},{id:"alain",code:"AAN",name:"Al Ain"},{id:"fujairah",code:"FJR",name:"Fujairah"}],w=document.getElementById("flight-grids-container");if(w){const t=(n,g,l)=>{const o=document.createElement("div");o.className="mb-[50px]",o.innerHTML=`
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> Flights From ${l}
        </h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6" id="grid-${l.replace(/\s+/g,"-").toLowerCase()}"></div>
      `,w.appendChild(o);const y=o.querySelector(`#grid-${l.replace(/\s+/g,"-").toLowerCase()}`);n.forEach(r=>{const m=document.createElement("div");m.className="sector-card bg-gradient-to-r from-primary to-[#1558c0] p-[18px_24px] rounded-[16px] shadow-[var(--shadow-premium-soft)] cursor-pointer hover:shadow-[0_8px_25px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center relative overflow-hidden group",m.innerHTML=`<h4 class="text-[17px] font-heading font-extrabold text-white m-0 flex items-center justify-between z-[2] relative w-full">${r.name} (${r.code}) <i class="bi bi-arrow-right-circle text-white/80 text-[22px]"></i></h4>`,m.addEventListener("click",()=>{typeof B=="function"&&B(r,g)}),y.appendChild(m)})};t(f,h,"India"),t(h,f,"Middle East")}const p=document.getElementById("sector-modal"),L=document.getElementById("modal-close"),A=document.getElementById("modal-body"),u=document.getElementById("modal-route"),D=document.getElementById("modal-title");function B(t,n){D.textContent="Select Destination",u.textContent=`Flying from ${t.name}`,u.classList.remove("bg-primary-light","text-primary"),u.classList.add("bg-slate-100","text-slate-600"),p.classList.add("active"),document.body.style.overflow="hidden",A.innerHTML=`
      <div class="text-center mb-6">
        <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Routes</h4>
        <p class="text-text-muted text-sm">Select a destination to view flight options</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1" id="routes-grid">
      </div>
    `;const g=document.getElementById("routes-grid");n.forEach(l=>{const o=`${t.code} ${l.code}`,y=`${t.name} → ${l.name}`,r=document.createElement("button");r.className="bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all flex items-center justify-between group cursor-pointer w-full text-left",r.innerHTML=`
        <span class="font-bold text-navy text-[15px]">${t.name} to ${l.name}</span>
        <i class="bi bi-chevron-right text-text-muted group-hover:text-primary transition-colors"></i>
      `,r.onclick=()=>{k(o,y)},g.appendChild(r)})}function k(t,n){D.textContent="Flight Details",u.textContent=t.replace(" "," → "),u.classList.add("bg-primary-light","text-primary"),u.classList.remove("bg-slate-100","text-slate-600"),p.classList.add("active"),document.body.style.overflow="hidden",A.innerHTML='<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>';async function g(){try{const o=(await j()).find(c=>c.sectorCode===t),y=await O(),r={};y.forEach(c=>r[c.id]=c.name);let m="";if(o){const c=new Date;c.setHours(0,0,0,0);let x=await F({sectorId:o.id,startDate:c.toISOString()});const I=new Map;x.forEach(a=>{const $=a.flightDate instanceof Date?a.flightDate.getTime():a.flightDate,T=`${a.sectorId}_${a.airlineId}_${$}_${a.flightTime}`;I.has(T)?a.finalRate<I.get(T).finalRate&&I.set(T,a):I.set(T,a)}),x=Array.from(I.values()),x.sort((a,$)=>a.flightDate.getTime()===$.flightDate.getTime()?a.finalRate-$.finalRate:a.flightDate.getTime()-$.flightDate.getTime()),x.length===0?m='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>':m=x.map(a=>{const $=r[a.airlineId]||"Unknown Airline",T={day:"2-digit",month:"short",year:"numeric"},R=a.flightDate.toLocaleDateString("en-GB",T),N=a.flightTime&&a.flightTime.split("-")[0]?a.flightTime.split("-")[0].trim():"TBA",C=a.flightTime&&a.flightTime.includes("-")?a.flightTime.split("-")[1].trim():"TBA",H=`₹${a.finalRate.toLocaleString("en-IN")}`,P=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'd like to book this flight:

✈️ *${$}*
🗯️ Route: *${n}*
📅 Date: *${R}*
⏰ Dep: ${N} | Arr: ${C}
💵 Price: *${H}*

Please confirm availability!`)}`;return`
                          <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                              <td class="p-[12px_15px] whitespace-nowrap"><strong>${R}</strong></td>
                              <td class="p-[12px_15px] whitespace-nowrap"><strong>${$}</strong></td>
                              <td class="p-[12px_15px]">${N}</td>
                              <td class="p-[12px_15px]">${C}</td>
                              <td class="p-[12px_15px] text-right"><strong>${H}</strong></td>
                              <td class="p-[12px_10px] text-center">
                                <a href="${P}" target="_blank" class="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-[#1558c0] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap hover:shadow-[0_3px_10px_rgba(26,115,232,0.35)] hover:-translate-y-0.5 transition-all">
                                  <i class="bi bi-whatsapp"></i> Book Now
                                </a>
                              </td>
                          </tr>`}).join("")}else m='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>';A.innerHTML=`
                <div class="text-center mb-4">
                    <button class="mb-4 text-primary font-bold text-[14px] hover:underline flex items-center gap-2 justify-center mx-auto" id="back-to-routes">
                      <i class="bi bi-arrow-left"></i> Back to Destinations
                    </button>
                    <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${n}</h4>
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
                          ${m}
                      </tbody>
                  </table>
                </div>
            `;const S=document.getElementById("back-to-routes");S&&S.addEventListener("click",()=>{const c=t.split(" ")[0];let x=f.find(a=>a.code===c),I=h;x||(x=h.find(a=>a.code===c),I=f),x?B(x,I):v()})}catch(l){console.error("Error fetching fares:",l),A.innerHTML='<p class="text-center text-red-500 my-4">Error loading flights. Please try again later.</p>'}}g()}function v(){p.classList.remove("active"),document.body.style.overflow=""}L&&L.addEventListener("click",v),p&&p.addEventListener("click",t=>{t.target===p&&v()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&p.classList.contains("active")&&v()}),(()=>{document.querySelector(".partners-slider")})();const i=document.getElementById("live-search-btn");i&&i.addEventListener("click",()=>{typeof _=="function"&&_()});const d=document.getElementById("swap-locations"),s=document.getElementById("swap-locations-mobile"),E=document.getElementById("origin"),b=document.getElementById("destination"),e=()=>{if(E&&b){const t=E.value;E.value=b.value,b.value=t}};d&&d.addEventListener("click",e),s&&s.addEventListener("click",e)});async function _(){const f=document.getElementById("origin").value,h=document.getElementById("destination").value,w=document.getElementById("flightList"),p=document.getElementById("loading"),L=document.getElementById("resultsHeader"),A=document.getElementById("origName"),u=document.getElementById("locName");w.innerHTML="",p.style.display="block",L.style.display="none";try{const D=await j(),B=`${f} ${h}`,k=D.find(i=>i.sectorCode===B);let v=[];if(k){const i=new Date;i.setHours(0,0,0,0);let d=await F({sectorId:k.id,startDate:i.toISOString()});const s=new Map;d.forEach(e=>{const t=e.flightDate instanceof Date?e.flightDate.getTime():e.flightDate,n=`${e.sectorId}_${e.airlineId}_${t}_${e.flightTime}`;s.has(n)?e.finalRate<s.get(n).finalRate&&s.set(n,e):s.set(n,e)}),d=Array.from(s.values()),d.sort((e,t)=>e.flightDate.getTime()===t.flightDate.getTime()?e.finalRate-t.finalRate:e.flightDate.getTime()-t.flightDate.getTime());const E=await O(),b={};E.forEach(e=>b[e.id]=e.name),v=d.map(e=>{const t={day:"2-digit",month:"short",year:"numeric"},n=e.flightDate.toLocaleDateString("en-GB",t).replace(/,/g,""),g=e.flightTime&&e.flightTime.split("-")[0]?e.flightTime.split("-")[0].trim():"TBA",l=e.flightTime&&e.flightTime.includes("-")?e.flightTime.split("-")[1].trim():"TBA",o=Number(e.baggage)||0,y=Number(e.extraBaggage)||0,r=o?`${o} KG`:"No Check-in",m=y?`+ ${y} KG`:"",S=o+y,c=S>0?`${S}KG`:"0KG";return{airline:b[e.airlineId]||"Unknown Airline",origin:k.sectorFrom,originCode:f,destination:k.sectorTo,destinationCode:h,date:n,departure:g,arrival:l,price:"₹"+e.finalRate.toLocaleString("en-IN"),seats:e.seatsAvailable||0,checkInBaggage:r,cabinBaggage:m,baggageLabel:c}})}if(p.style.display="none",L.style.display="block",A&&(A.innerText=f),u&&(u.innerText=h),!v||v.length===0){w.innerHTML=`<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found from ${f} to ${h}. Try another destination.</div>`;return}let M="";v.forEach(i=>{let d="00",s="MTH";if(i.date){const g=i.date.split(" ");g.length>=2?(d=g[0],s=g[1]):(d=i.date,s="")}const b=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${i.airline}*
🛫 From: *${i.origin}*
🛬 To: *${i.destination}*
📅 Date: *${i.date}*
⏰ Dep: ${i.departure} | Arr: ${i.arrival}
💵 Price: *${i.price}*

Please confirm availability!`)}`;let e=(i.airline||"").toUpperCase().trim(),t="";const n={INDIGO:"/assets/img/flights/indigo.png","AIR INDIA EXPRESS":"/assets/img/flights/air-india-express.png","AIR ARABIA":"/assets/img/flights/air-arabia.png",FLYNAS:"/assets/img/flights/flynas.png","OMAN AIR":"/assets/img/flights/oman-air.png","SALAM AIR":"/assets/img/flights/salam-air.png","AIR INDIA":"/assets/img/flights/air-india.png",SAUDIA:"/assets/img/flights/saudia.png"};e.includes("EXPRESS")||e==="IX"?t=n["AIR INDIA EXPRESS"]:e.includes("INDIA")||e==="AI"?t=n["AIR INDIA"]:e.includes("SAUD")||e.includes("SOUD")||e==="SV"?t=n.SAUDIA:e.includes("INDIGO")||e==="6E"?t=n.INDIGO:e.includes("ARABIA")||e==="G9"?t=n["AIR ARABIA"]:e.includes("FLYNAS")||e==="XY"?t=n.FLYNAS:e.includes("OMAN")||e==="WY"?t=n["OMAN AIR"]:e.includes("SALAM")||e==="OV"?t=n["SALAM AIR"]:t="",M+=`
        <div class="bg-white rounded-[16px] p-4 lg:p-6 mb-4 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] relative">
          
          <!-- MOBILE VIEW (< lg) -->
          <div class="flex flex-col gap-4 lg:hidden">
            <!-- Mobile Top Section -->
            <div class="flex items-center justify-start gap-4 border-b border-border pb-4">
              <div class="w-[60px] h-[60px] shrink-0 bg-[#f8fafc] rounded-xl border border-border/50 flex items-center justify-center p-2">
                <img src="${t}" onerror="this.style.display='none'" class="max-h-full max-w-full object-contain">
              </div>
              <div>
                <div class="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-1">${i.airline}</div>
                <div class="text-[18px] font-heading font-bold text-navy flex items-baseline gap-1.5 leading-none">
                  ${d} <span class="text-primary text-[14px]">${s}</span>
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
                <div class="text-[10px] text-text-muted font-bold mt-1">${i.baggageLabel}</div>
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
              </div>
              <a href="${b}" target="_blank" class="w-full sm:w-auto bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[14px] px-6 py-3 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                Book Now
              </a>
            </div>
          </div>

          <!-- DESKTOP VIEW (>= lg) -->
          <div class="hidden lg:flex flex-row items-center justify-between gap-6">
            <!-- Left side: Date & Airline -->
            <div class="flex items-center gap-6 lg:gap-8 w-auto">
              <div class="text-center font-heading leading-tight shrink-0 flex flex-col items-center">
                <div class="text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${d}</div>
                <div class="text-[20px] font-medium text-navy capitalize">${s}</div>
              </div>
              
              <div class="w-[100px] shrink-0 text-center flex items-center justify-center">
                <img src="${t}" onerror="this.style.display='none'" class="max-h-[35px] max-w-full object-contain">
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
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">${i.checkInBaggage}</div>
                  <div class="text-[14px] font-bold text-navy flex items-center">${i.cabinBaggage}</div>
                </div>
              </div>
              
            </div>

            <!-- Right side: Price & Action -->
            <div class="flex flex-col items-center justify-center lg:w-[180px] shrink-0">
              <div class="bg-[#f8fafc] rounded-xl p-4 w-full flex flex-col items-center border border-border/50">
                <span class="text-[32px] font-medium text-navy tracking-tight mb-3 leading-none flex items-center">
                  ${i.price}
                </span>
                <a href="${b}" target="_blank" class="w-full bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[15px] px-6 py-2.5 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                  Book Now
                </a>
              </div>
            </div>

          </div>

        </div>
      `}),w.innerHTML=M}catch(D){p.style.display="none",w&&(w.innerHTML='<div class="text-center text-red-500 p-10 font-bold border-2 border-dashed border-red-200 rounded-[24px] mt-6 bg-red-50">Error connection. Failed to fetch live flights. Please ensure the server is active.</div>'),console.error(D)}}window.searchFlights=_;
