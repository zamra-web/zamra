import"./index.esm-DPDniVF0.js";import{i as X}from"./site-chrome-DG-Gy5Bv.js";import{g as P,a as K,b as G}from"./db-Dzh3zJx8.js";import"./firebase-config-CsZGR70X.js";document.addEventListener("DOMContentLoaded",()=>{X({enableSmoothScroll:!0});const f=[{id:"kozhikode",code:"CCJ",name:"Kozhikode"},{id:"kochi",code:"COK",name:"Kochi"},{id:"kannur",code:"CNN",name:"Kannur"},{id:"trivandrum",code:"TRV",name:"Trivandrum"},{id:"mangalore",code:"IXE",name:"Mangalore"}],h=[{id:"jeddah",code:"JED",name:"Jeddah"},{id:"riyadh",code:"RUH",name:"Riyadh"},{id:"dammam",code:"DMM",name:"Dammam"},{id:"doha",code:"DOH",name:"Doha"},{id:"muscat",code:"MCT",name:"Muscat"},{id:"bahrain",code:"BAH",name:"Bahrain"},{id:"kuwait",code:"KWI",name:"Kuwait"},{id:"dubai",code:"DXB",name:"Dubai"},{id:"sharjah",code:"SHJ",name:"Sharjah"},{id:"abudhabi",code:"AUH",name:"Abu Dhabi"},{id:"rasalkhaimah",code:"RKT",name:"Ras Al Khaimah"},{id:"alain",code:"AAN",name:"Al Ain"},{id:"fujairah",code:"FJR",name:"Fujairah"}],w=document.getElementById("flight-grids-container");if(w){const t=(s,p,c)=>{const o=document.createElement("div");o.className="mb-[50px]",o.innerHTML=`
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> Flights From ${c}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="grid-${c.replace(/\s+/g,"-").toLowerCase()}"></div>
      `,w.appendChild(o);const y=o.querySelector(`#grid-${c.replace(/\s+/g,"-").toLowerCase()}`);s.forEach(r=>{const $=document.createElement("div");$.className="sector-card bg-gradient-to-r from-primary to-[#1558c0] p-[18px_24px] max-sm:px-4 max-sm:py-4 rounded-[16px] shadow-[var(--shadow-premium-soft)] cursor-pointer hover:shadow-[0_8px_25px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center relative overflow-hidden group",$.innerHTML=`<h4 class="text-[17px] font-heading font-extrabold text-white m-0 flex items-center justify-between z-[2] relative w-full">${r.name} (${r.code}) <i class="bi bi-arrow-right-circle text-white/80 text-[22px]"></i></h4>`,$.addEventListener("click",()=>{typeof B=="function"&&B(r,p)}),y.appendChild($)})};t(f,h,"India"),t(h,f,"Middle East")}const m=document.getElementById("sector-modal"),L=document.getElementById("modal-close"),A=document.getElementById("modal-body"),v=document.getElementById("modal-route"),D=document.getElementById("modal-title");function B(t,s){D.textContent="Select Destination",v.textContent=`Flying from ${t.name}`,v.classList.remove("bg-primary-light","text-primary"),v.classList.add("bg-slate-100","text-slate-600"),m.classList.add("active"),document.body.style.overflow="hidden",A.innerHTML=`
      <div class="text-center mb-6">
        <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Routes</h4>
        <p class="text-text-muted text-sm">Select a destination to view flight options</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1" id="routes-grid">
      </div>
    `;const p=document.getElementById("routes-grid");s.forEach(c=>{const o=`${t.code} ${c.code}`,y=`${t.name} → ${c.name}`,r=document.createElement("button");r.className="bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all flex items-center justify-between group cursor-pointer w-full text-left",r.innerHTML=`
        <span class="font-bold text-navy text-[15px]">${t.name} to ${c.name}</span>
        <i class="bi bi-chevron-right text-text-muted group-hover:text-primary transition-colors"></i>
      `,r.onclick=()=>{E(o,y)},p.appendChild(r)})}function E(t,s){D.textContent="Flight Details",v.textContent=t.replace(" "," → "),v.classList.add("bg-primary-light","text-primary"),v.classList.remove("bg-slate-100","text-slate-600"),m.classList.add("active"),document.body.style.overflow="hidden",A.innerHTML='<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>';async function p(){try{const o=(await P()).find(x=>x.sectorCode===t),y=await G(),r={};y.forEach(x=>r[x.id]=x.name);const $=window.matchMedia&&window.matchMedia("(max-width: 640px)").matches;let S="",_="",R=!1;if(o){const x=new Date;x.setHours(0,0,0,0);let g=await K({sectorId:o.id,startDate:x.toISOString()});const I=new Map;if(g.forEach(n=>{const a=n.flightDate instanceof Date?n.flightDate.getTime():n.flightDate,k=`${n.sectorId}_${n.airlineId}_${a}_${n.flightTime}`;I.has(k)?n.finalRate<I.get(k).finalRate&&I.set(k,n):I.set(k,n)}),g=Array.from(I.values()),g.sort((n,a)=>n.flightDate.getTime()===a.flightDate.getTime()?n.finalRate-a.finalRate:n.flightDate.getTime()-a.flightDate.getTime()),g.length>0){R=!0;const n=g.map(a=>{const k=r[a.airlineId]||"Unknown Airline",z={day:"2-digit",month:"short",year:"numeric"},F=a.flightDate.toLocaleDateString("en-GB",z),j=a.flightTime&&a.flightTime.split("-")[0]?a.flightTime.split("-")[0].trim():"TBA",H=a.flightTime&&a.flightTime.includes("-")?a.flightTime.split("-")[1].trim():"TBA",O=`₹${a.finalRate.toLocaleString("en-IN")}`,V=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'd like to book this flight:

✈️ *${k}*
🗯️ Route: *${s}*
📅 Date: *${F}*
⏰ Dep: ${j} | Arr: ${H}
💵 Price: *${O}*

Please confirm availability!`)}`;return{airlineName:k,dateStr:F,dep:j,arr:H,price:O,waLink:V}});S=n.map(a=>`
              <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                  <td class="p-[12px_15px] whitespace-nowrap"><strong>${a.dateStr}</strong></td>
                  <td class="p-[12px_15px] whitespace-nowrap"><strong>${a.airlineName}</strong></td>
                  <td class="p-[12px_15px]">${a.dep}</td>
                  <td class="p-[12px_15px]">${a.arr}</td>
                  <td class="p-[12px_15px] text-right"><strong>${a.price}</strong></td>
                  <td class="p-[12px_10px] text-center">
                    <a href="${a.waLink}" target="_blank" class="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-[#1558c0] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap hover:shadow-[0_3px_10px_rgba(26,115,232,0.35)] hover:-translate-y-0.5 transition-all">
                      <i class="bi bi-whatsapp"></i> Book Now
                    </a>
                  </td>
              </tr>
            `).join(""),_=n.map(a=>`
              <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-premium-soft)]">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-[10px] uppercase tracking-[0.16em] text-text-muted font-semibold">Date</div>
                    <div class="text-[15px] font-bold text-navy">${a.dateStr}</div>
                    <div class="text-[12px] font-semibold text-text-muted mt-1">${a.airlineName}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-[10px] uppercase tracking-[0.16em] text-text-muted font-semibold">Price</div>
                    <div class="text-[18px] font-black text-navy">${a.price}</div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3 mt-3">
                  <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <div class="text-[10px] uppercase tracking-[0.14em] text-text-muted font-semibold">Departure</div>
                    <div class="text-[13px] font-semibold text-navy">${a.dep}</div>
                  </div>
                  <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <div class="text-[10px] uppercase tracking-[0.14em] text-text-muted font-semibold">Arrival</div>
                    <div class="text-[13px] font-semibold text-navy">${a.arr}</div>
                  </div>
                </div>
                <a href="${a.waLink}" target="_blank" class="mt-4 inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-[#1558c0] text-white text-[13px] font-bold shadow-[0_4px_14px_rgba(26,115,232,0.25)]">
                  <i class="bi bi-whatsapp"></i> Book Now
                </a>
              </div>
            `).join("")}}else R=!1;const U=`
          <div class="rounded-2xl border border-dashed border-border bg-[#f8fafc] p-6 text-center text-text-muted font-semibold">
            No flights available currently.
          </div>
        `;A.innerHTML=`
          <div class="text-center mb-4">
              <button class="mb-4 text-primary font-bold text-[14px] hover:underline flex items-center gap-2 justify-center mx-auto" id="back-to-routes">
                <i class="bi bi-arrow-left"></i> Back to Destinations
              </button>
              <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${s}</h4>
              <p class="text-text-muted text-sm">Prices are introductory and subject to availability.</p>
          </div>
          ${R?$?`<div class="space-y-4">${_}</div>`:`<div class="overflow-x-auto w-full pb-2">
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
                          ${S}
                      </tbody>
                  </table>
                </div>`:U}
        `;const C=document.getElementById("back-to-routes");C&&C.addEventListener("click",()=>{const x=t.split(" ")[0];let g=f.find(n=>n.code===x),I=h;g||(g=h.find(n=>n.code===x),I=f),g?B(g,I):u()})}catch(c){console.error("Error fetching fares:",c),A.innerHTML='<p class="text-center text-red-500 my-4">Error loading flights. Please try again later.</p>'}}p()}function u(){m.classList.remove("active"),document.body.style.overflow=""}L&&L.addEventListener("click",u),m&&m.addEventListener("click",t=>{t.target===m&&u()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&m.classList.contains("active")&&u()}),(()=>{document.querySelector(".partners-slider")})();const i=document.getElementById("live-search-btn");i&&i.addEventListener("click",()=>{typeof N=="function"&&N()});const l=document.getElementById("swap-locations"),d=document.getElementById("swap-locations-mobile"),T=document.getElementById("origin"),b=document.getElementById("destination"),e=()=>{if(T&&b){const t=T.value;T.value=b.value,b.value=t}};l&&l.addEventListener("click",e),d&&d.addEventListener("click",e)});async function N(){const f=document.getElementById("origin").value,h=document.getElementById("destination").value,w=document.getElementById("flightList"),m=document.getElementById("loading"),L=document.getElementById("resultsHeader"),A=document.getElementById("origName"),v=document.getElementById("locName");w.innerHTML="",m.style.display="block",L.style.display="none";try{const D=await P(),B=`${f} ${h}`,E=D.find(i=>i.sectorCode===B);let u=[];if(E){const i=new Date;i.setHours(0,0,0,0);let l=await K({sectorId:E.id,startDate:i.toISOString()});const d=new Map;l.forEach(e=>{const t=e.flightDate instanceof Date?e.flightDate.getTime():e.flightDate,s=`${e.sectorId}_${e.airlineId}_${t}_${e.flightTime}`;d.has(s)?e.finalRate<d.get(s).finalRate&&d.set(s,e):d.set(s,e)}),l=Array.from(d.values()),l.sort((e,t)=>e.flightDate.getTime()===t.flightDate.getTime()?e.finalRate-t.finalRate:e.flightDate.getTime()-t.flightDate.getTime());const T=await G(),b={};T.forEach(e=>b[e.id]=e.name),u=l.map(e=>{const t={day:"2-digit",month:"short",year:"numeric"},s=e.flightDate.toLocaleDateString("en-GB",t).replace(/,/g,""),p=e.flightTime&&e.flightTime.split("-")[0]?e.flightTime.split("-")[0].trim():"TBA",c=e.flightTime&&e.flightTime.includes("-")?e.flightTime.split("-")[1].trim():"TBA",o=Number(e.baggage)||0,y=Number(e.extraBaggage)||0,r=o?`${o} KG`:"No Check-in",$=y?`+ ${y} KG`:"",S=o+y,_=S>0?`${S}KG`:"0KG";return{airline:b[e.airlineId]||"Unknown Airline",origin:E.sectorFrom,originCode:f,destination:E.sectorTo,destinationCode:h,date:s,departure:p,arrival:c,price:"₹"+e.finalRate.toLocaleString("en-IN"),seats:e.seatsAvailable||0,checkInBaggage:r,cabinBaggage:$,baggageLabel:_}})}if(m.style.display="none",L.style.display="block",A&&(A.innerText=f),v&&(v.innerText=h),!u||u.length===0){w.innerHTML=`<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found from ${f} to ${h}. Try another destination.</div>`;return}let M="";u.forEach(i=>{let l="00",d="MTH";if(i.date){const p=i.date.split(" ");p.length>=2?(l=p[0],d=p[1]):(l=i.date,d="")}const b=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${i.airline}*
🛫 From: *${i.origin}*
🛬 To: *${i.destination}*
📅 Date: *${i.date}*
⏰ Dep: ${i.departure} | Arr: ${i.arrival}
💵 Price: *${i.price}*

Please confirm availability!`)}`;let e=(i.airline||"").toUpperCase().trim(),t="";const s={INDIGO:"/assets/img/flights/indigo.png","AIR INDIA EXPRESS":"/assets/img/flights/air-india-express.png","AIR ARABIA":"/assets/img/flights/air-arabia.png",FLYNAS:"/assets/img/flights/flynas.png","OMAN AIR":"/assets/img/flights/oman-air.png","SALAM AIR":"/assets/img/flights/salam-air.png","AIR INDIA":"/assets/img/flights/air-india.png",SAUDIA:"/assets/img/flights/saudia.png"};e.includes("EXPRESS")||e==="IX"?t=s["AIR INDIA EXPRESS"]:e.includes("INDIA")||e==="AI"?t=s["AIR INDIA"]:e.includes("SAUD")||e.includes("SOUD")||e==="SV"?t=s.SAUDIA:e.includes("INDIGO")||e==="6E"?t=s.INDIGO:e.includes("ARABIA")||e==="G9"?t=s["AIR ARABIA"]:e.includes("FLYNAS")||e==="XY"?t=s.FLYNAS:e.includes("OMAN")||e==="WY"?t=s["OMAN AIR"]:e.includes("SALAM")||e==="OV"?t=s["SALAM AIR"]:t="",M+=`
        <div class="bg-white rounded-[18px] max-sm:rounded-[22px] p-4 lg:p-6 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] relative overflow-hidden">
          
          <!-- MOBILE VIEW (< lg) -->
          <div class="flex flex-col gap-4 lg:hidden">
            <div class="flex items-start justify-between gap-3 border-b border-border pb-3">
              <div class="flex items-center gap-3">
                <div class="w-[54px] h-[54px] shrink-0 bg-[#f8fafc] rounded-2xl border border-border/50 flex items-center justify-center p-2">
                  <img src="${t}" onerror="this.style.display='none'" class="max-h-full max-w-full object-contain">
                </div>
                <div>
                  <div class="text-[11px] font-bold text-text-muted uppercase tracking-[0.16em] mb-1">${i.airline}</div>
                  <div class="text-[17px] font-heading font-bold text-navy flex items-baseline gap-1.5 leading-none">
                    ${l} <span class="text-primary text-[13px]">${d}</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-[10px] uppercase tracking-[0.16em] text-text-muted font-semibold">Price</div>
                <div class="text-[20px] font-heading font-black text-navy leading-none">${i.price}</div>
              </div>
            </div>

            <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-1">
              <div class="text-left">
                <div class="text-[18px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${i.originCode}</div>
                <div class="text-[11px] font-semibold text-text-muted uppercase">Dep ${i.departure}</div>
              </div>
              
              <div class="flex flex-col items-center px-2">
                <div class="w-9 h-9 rounded-full bg-[#f8fafc] border border-border flex items-center justify-center">
                  <i class="bi bi-arrow-right text-primary text-[18px]"></i>
                </div>
                <div class="text-[10px] text-text-muted font-bold mt-1">${i.baggageLabel}</div>
              </div>

              <div class="text-right">
                <div class="text-[18px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${i.destinationCode}</div>
                <div class="text-[11px] font-semibold text-text-muted uppercase">Arr ${i.arrival}</div>
              </div>
            </div>

            <a href="${b}" target="_blank" class="w-full bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[14px] px-6 py-3 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
              Book Now
            </a>
          </div>

          <!-- DESKTOP VIEW (>= lg) -->
          <div class="hidden lg:flex flex-row items-center justify-between gap-6">
            <!-- Left side: Date & Airline -->
            <div class="flex items-center gap-6 lg:gap-8 w-auto">
              <div class="text-center font-heading leading-tight shrink-0 flex flex-col items-center">
                <div class="text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${l}</div>
                <div class="text-[20px] font-medium text-navy capitalize">${d}</div>
              </div>
              
              <div class="w-[100px] shrink-0 text-center flex items-center justify-center">
                <img src="${t}" onerror="this.style.display='none'" class="max-h-[35px] max-w-full object-contain">
              </div>
            </div>

            <!-- Middle side: Routes & Details -->
            <div class="flex flex-1 flex-row items-center gap-8 px-6 min-w-0">
              
              <!-- Route -->
              <div class="flex flex-1 min-w-0 items-center gap-6 lg:gap-8">
                <div class="text-left flex-1 min-w-0">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">From</div>
                  <div class="text-[20px] font-bold text-navy uppercase leading-tight tracking-tight break-words whitespace-normal">${i.origin}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${i.originCode}</div>
                </div>
                
                <div class="w-[46px] h-[46px] rounded-full bg-[#f8fafc] border border-border flex items-center justify-center shrink-0 shadow-sm relative">
                  <i class="bi bi-arrow-right text-primary text-[20px]"></i>
                </div>
                
                <div class="text-left flex-1 min-w-0">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">To</div>
                  <div class="text-[20px] font-bold text-navy uppercase leading-tight tracking-tight break-words whitespace-normal">${i.destination}</div>
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
      `}),w.innerHTML=M}catch(D){m.style.display="none",w&&(w.innerHTML='<div class="text-center text-red-500 p-10 font-bold border-2 border-dashed border-red-200 rounded-[24px] mt-6 bg-red-50">Error connection. Failed to fetch live flights. Please ensure the server is active.</div>'),console.error(D)}}window.searchFlights=N;
