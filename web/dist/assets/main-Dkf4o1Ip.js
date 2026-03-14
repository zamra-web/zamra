import"./index.esm-kRT_WKqT.js";/* empty css              */import{g as P,a as U,b as K}from"./db-DIsZtkDY.js";import"./firebase-config-aHS-3htW.js";document.addEventListener("DOMContentLoaded",()=>{const L=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?L.classList.add("scrolled"):L.classList.remove("scrolled")});const u=document.getElementById("mobile-toggle"),p=document.getElementById("nav-menu");u&&u.addEventListener("click",()=>{p.classList.toggle("active");const i=u.querySelector("i");p.classList.contains("active")?i.classList.replace("bi-list","bi-x-lg"):i.classList.replace("bi-x-lg","bi-list")}),document.querySelectorAll('a[href^="#"]').forEach(i=>{i.addEventListener("click",function(d){const c=this.getAttribute("href");if(p&&p.classList.contains("active")&&(p.classList.remove("active"),u&&u.querySelector("i").classList.replace("bi-x-lg","bi-list")),c&&c!=="#"){const r=document.querySelector(c);if(r){d.preventDefault();const l=r.getBoundingClientRect().top+window.pageYOffset-80;window.scrollTo({top:l,behavior:"smooth"}),window.history.pushState(null,"",c)}}})});const E=[{id:"kozhikode",code:"CCJ",name:"Kozhikode"},{id:"kochi",code:"COK",name:"Kochi"},{id:"kannur",code:"CNN",name:"Kannur"},{id:"trivandrum",code:"TRV",name:"Trivandrum"},{id:"mangalore",code:"IXE",name:"Mangalore"}],k=[{id:"jeddah",code:"JED",name:"Jeddah"},{id:"riyadh",code:"RUH",name:"Riyadh"},{id:"dammam",code:"DMM",name:"Dammam"},{id:"doha",code:"DOH",name:"Doha"},{id:"muscat",code:"MCT",name:"Muscat"},{id:"bahrain",code:"BAH",name:"Bahrain"},{id:"kuwait",code:"KWI",name:"Kuwait"},{id:"dubai",code:"DXB",name:"Dubai"},{id:"sharjah",code:"SHJ",name:"Sharjah"},{id:"abudhabi",code:"AUH",name:"Abu Dhabi"},{id:"rasalkhaimah",code:"RKT",name:"Ras Al Khaimah"},{id:"alain",code:"AAN",name:"Al Ain"},{id:"fujairah",code:"FJR",name:"Fujairah"}],T=document.getElementById("flight-grids-container");if(T){const i=(d,c,r)=>{const g=document.createElement("div");g.className="mb-[50px]",g.innerHTML=`
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> Flights From ${r}
        </h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6" id="grid-${r.replace(/\s+/g,"-").toLowerCase()}"></div>
      `,T.appendChild(g);const $=g.querySelector(`#grid-${r.replace(/\s+/g,"-").toLowerCase()}`);d.forEach(l=>{const w=document.createElement("div");w.className="sector-card bg-gradient-to-r from-primary to-[#1558c0] p-[18px_24px] rounded-[16px] shadow-[var(--shadow-premium-soft)] cursor-pointer hover:shadow-[0_8px_25px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center relative overflow-hidden group",w.innerHTML=`<h4 class="text-[17px] font-heading font-extrabold text-white m-0 flex items-center justify-between z-[2] relative w-full">${l.name} (${l.code}) <i class="bi bi-arrow-right-circle text-white/80 text-[22px]"></i></h4>`,w.addEventListener("click",()=>{typeof t=="function"&&t(l,c)}),$.appendChild(w)})};i(E,k,"India"),i(k,E,"Middle East")}const x=document.getElementById("sector-modal"),M=document.getElementById("modal-close"),b=document.getElementById("modal-body"),f=document.getElementById("modal-route"),B=document.getElementById("modal-title");function t(i,d){B.textContent="Select Destination",f.textContent=`Flying from ${i.name}`,f.classList.remove("bg-primary-light","text-primary"),f.classList.add("bg-slate-100","text-slate-600"),x.classList.add("active"),document.body.style.overflow="hidden",b.innerHTML=`
      <div class="text-center mb-6">
        <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Routes</h4>
        <p class="text-text-muted text-sm">Select a destination to view flight options</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1" id="routes-grid">
      </div>
    `;const c=document.getElementById("routes-grid");d.forEach(r=>{const g=`${i.code} ${r.code}`,$=`${i.name} → ${r.name}`,l=document.createElement("button");l.className="bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all flex items-center justify-between group cursor-pointer w-full text-left",l.innerHTML=`
        <span class="font-bold text-navy text-[15px]">${i.name} to ${r.name}</span>
        <i class="bi bi-chevron-right text-text-muted group-hover:text-primary transition-colors"></i>
      `,l.onclick=()=>{h(g,$)},c.appendChild(l)})}function h(i,d){B.textContent="Flight Details",f.textContent=i.replace(" "," → "),f.classList.add("bg-primary-light","text-primary"),f.classList.remove("bg-slate-100","text-slate-600"),x.classList.add("active"),document.body.style.overflow="hidden",b.innerHTML='<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>';async function c(){try{const g=(await P()).find(A=>A.sectorCode===i),$=await K(),l={};$.forEach(A=>l[A.id]=A.name);let w="";if(g){new Date().setHours(0,0,0,0);const v=new Map;fares.forEach(a=>{const m=a.flightDate instanceof Date?a.flightDate.getTime():a.flightDate,D=`${a.sectorId}_${a.airlineId}_${m}_${a.flightTime}`;v.has(D)?a.finalRate<v.get(D).finalRate&&v.set(D,a):v.set(D,a)}),fares=Array.from(v.values()),fares.sort((a,m)=>a.flightDate.getTime()===m.flightDate.getTime()?a.finalRate-m.finalRate:a.flightDate.getTime()-m.flightDate.getTime()),fares.length===0?w='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>':w=fares.map(a=>{const m=l[a.airlineId]||"Unknown Airline",D={day:"2-digit",month:"short",year:"numeric"},H=a.flightDate.toLocaleDateString("en-GB",D),j=a.flightTime&&a.flightTime.split("-")[0]?a.flightTime.split("-")[0].trim():"TBA",F=a.flightTime&&a.flightTime.includes("-")?a.flightTime.split("-")[1].trim():"TBA",O=`₹${a.finalRate.toLocaleString("en-IN")}`,G=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'd like to book this flight:

✈️ *${m}*
🗯️ Route: *${d}*
📅 Date: *${H}*
⏰ Dep: ${j} | Arr: ${F}
💵 Price: *${O}*

Please confirm availability!`)}`;return`
                          <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                              <td class="p-[12px_15px] whitespace-nowrap"><strong>${H}</strong></td>
                              <td class="p-[12px_15px] whitespace-nowrap"><strong>${m}</strong></td>
                              <td class="p-[12px_15px]">${j}</td>
                              <td class="p-[12px_15px]">${F}</td>
                              <td class="p-[12px_15px] text-right"><strong>${O}</strong></td>
                              <td class="p-[12px_10px] text-center">
                                <a href="${G}" target="_blank" class="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-[#1558c0] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap hover:shadow-[0_3px_10px_rgba(26,115,232,0.35)] hover:-translate-y-0.5 transition-all">
                                  <i class="bi bi-whatsapp"></i> Book Now
                                </a>
                              </td>
                          </tr>`}).join("")}else w='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>';b.innerHTML=`
                <div class="text-center mb-4">
                    <button class="mb-4 text-primary font-bold text-[14px] hover:underline flex items-center gap-2 justify-center mx-auto" id="back-to-routes">
                      <i class="bi bi-arrow-left"></i> Back to Destinations
                    </button>
                    <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${d}</h4>
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
                          ${w}
                      </tbody>
                  </table>
                </div>
            `;const C=document.getElementById("back-to-routes");C&&C.addEventListener("click",()=>{const A=i.split(" ")[0];let v=E.find(m=>m.code===A),a=k;v||(v=k.find(m=>m.code===A),a=E),v?t(v,a):o()})}catch(r){console.error("Error fetching fares:",r),b.innerHTML='<p class="text-center text-red-500 my-4">Error loading flights. Please try again later.</p>'}}c()}function o(){x.classList.remove("active"),document.body.style.overflow=""}M&&M.addEventListener("click",o),x&&x.addEventListener("click",i=>{i.target===x&&o()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&x.classList.contains("active")&&o()}),(()=>{document.querySelector(".partners-slider")})();const I=document.getElementById("live-search-btn");I&&I.addEventListener("click",()=>{typeof N=="function"&&N()});const e=document.getElementById("swap-locations"),n=document.getElementById("swap-locations-mobile"),s=document.getElementById("origin"),y=document.getElementById("destination"),R=()=>{if(s&&y){const i=s.value;s.value=y.value,y.value=i}};e&&e.addEventListener("click",R),n&&n.addEventListener("click",R)});async function N(){const L=document.getElementById("origin").value,u=document.getElementById("destination").value,p=document.getElementById("flightList"),S=document.getElementById("loading"),E=document.getElementById("resultsHeader"),k=document.getElementById("origName"),T=document.getElementById("locName");p.innerHTML="",S.style.display="block",E.style.display="none";try{const x=await P(),M=`${L} ${u}`,b=x.find(t=>t.sectorCode===M);let f=[];if(b){const t=new Date;t.setHours(0,0,0,0);let h=await U({sectorId:b.id,startDate:t.toISOString()});const o=new Map;h.forEach(e=>{const n=e.flightDate instanceof Date?e.flightDate.getTime():e.flightDate,s=`${e.sectorId}_${e.airlineId}_${n}_${e.flightTime}`;o.has(s)?e.finalRate<o.get(s).finalRate&&o.set(s,e):o.set(s,e)}),h=Array.from(o.values()),h.sort((e,n)=>e.flightDate.getTime()===n.flightDate.getTime()?e.finalRate-n.finalRate:e.flightDate.getTime()-n.flightDate.getTime());const _=await K(),I={};_.forEach(e=>I[e.id]=e.name),f=h.map(e=>{const n={day:"2-digit",month:"short",year:"numeric"},s=e.flightDate.toLocaleDateString("en-GB",n).replace(/,/g,""),y=e.flightTime&&e.flightTime.split("-")[0]?e.flightTime.split("-")[0].trim():"TBA",R=e.flightTime&&e.flightTime.includes("-")?e.flightTime.split("-")[1].trim():"TBA",i=Number(e.baggage)||0,d=Number(e.extraBaggage)||0,c=i?`${i} KG`:"No Check-in",r=d?`+ ${d} KG`:"",g=i+d,$=g>0?`${g}KG`:"0KG";return{airline:I[e.airlineId]||"Unknown Airline",origin:b.sectorFrom,originCode:L,destination:b.sectorTo,destinationCode:u,date:s,departure:y,arrival:R,price:"₹"+e.finalRate.toLocaleString("en-IN"),seats:e.seatsAvailable||0,checkInBaggage:c,cabinBaggage:r,baggageLabel:$}})}if(S.style.display="none",E.style.display="block",k&&(k.innerText=L),T&&(T.innerText=u),!f||f.length===0){p.innerHTML=`<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found from ${L} to ${u}. Try another destination.</div>`;return}let B="";f.forEach(t=>{let h="00",o="MTH";if(t.date){const y=t.date.split(" ");y.length>=2?(h=y[0],o=y[1]):(h=t.date,o="")}const I=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${t.airline}*
🛫 From: *${t.origin}*
🛬 To: *${t.destination}*
📅 Date: *${t.date}*
⏰ Dep: ${t.departure} | Arr: ${t.arrival}
💵 Price: *${t.price}*

Please confirm availability!`)}`;let e=(t.airline||"").toUpperCase().trim(),n="";const s={INDIGO:"/assets/img/flights/indigo.png","AIR INDIA EXPRESS":"/assets/img/flights/air-india-express.png","AIR ARABIA":"/assets/img/flights/air-arabia.png",FLYNAS:"/assets/img/flights/flynas.png","OMAN AIR":"/assets/img/flights/oman-air.png","SALAM AIR":"/assets/img/flights/salam-air.png","AIR INDIA":"/assets/img/flights/air-india.png",SAUDIA:"/assets/img/flights/saudia.png"};e.includes("EXPRESS")||e==="IX"?n=s["AIR INDIA EXPRESS"]:e.includes("INDIA")||e==="AI"?n=s["AIR INDIA"]:e.includes("SAUD")||e.includes("SOUD")||e==="SV"?n=s.SAUDIA:e.includes("INDIGO")||e==="6E"?n=s.INDIGO:e.includes("ARABIA")||e==="G9"?n=s["AIR ARABIA"]:e.includes("FLYNAS")||e==="XY"?n=s.FLYNAS:e.includes("OMAN")||e==="WY"?n=s["OMAN AIR"]:e.includes("SALAM")||e==="OV"?n=s["SALAM AIR"]:n="",B+=`
        <div class="bg-white rounded-[16px] p-4 lg:p-6 mb-4 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] relative">
          
          <!-- MOBILE VIEW (< lg) -->
          <div class="flex flex-col gap-4 lg:hidden">
            <!-- Mobile Top Section -->
            <div class="flex items-center justify-start gap-4 border-b border-border pb-4">
              <div class="w-[60px] h-[60px] shrink-0 bg-[#f8fafc] rounded-xl border border-border/50 flex items-center justify-center p-2">
                <img src="${n}" onerror="this.style.display='none'" class="max-h-full max-w-full object-contain">
              </div>
              <div>
                <div class="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-1">${t.airline}</div>
                <div class="text-[18px] font-heading font-bold text-navy flex items-baseline gap-1.5 leading-none">
                  ${h} <span class="text-primary text-[14px]">${o}</span>
                </div>
              </div>
            </div>

            <!-- Mobile Middle Section -->
            <div class="flex flex-row items-center justify-between gap-2 px-2">
              <div class="text-left flex-none">
                <div class="text-[20px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${t.originCode}</div>
                <div class="text-[12px] font-medium text-text-muted uppercase">Dep: ${t.departure}</div>
              </div>
              
              <!-- Mobile Connector -->
              <div class="flex flex-col items-center px-2">
                <i class="bi bi-arrow-right text-primary text-[24px]"></i>
                <div class="text-[10px] text-text-muted font-bold mt-1">${t.baggageLabel}</div>
              </div>

              <div class="text-right flex-none">
                <div class="text-[20px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${t.destinationCode}</div>
                <div class="text-[12px] font-medium text-text-muted uppercase">Arr: ${t.arrival}</div>
              </div>
            </div>

            <!-- Mobile Bottom Section -->
            <div class="flex sm:flex-row flex-col items-center justify-between w-full border-t border-border pt-4 gap-3 sm:gap-0">
              <div class="flex flex-col items-center sm:items-start w-full sm:w-auto">
                <span class="text-[24px] font-heading font-bold text-navy leading-none tracking-tight">${t.price}</span>
              </div>
              <a href="${I}" target="_blank" class="w-full sm:w-auto bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[14px] px-6 py-3 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                Book Now
              </a>
            </div>
          </div>

          <!-- DESKTOP VIEW (>= lg) -->
          <div class="hidden lg:flex flex-row items-center justify-between gap-6">
            <!-- Left side: Date & Airline -->
            <div class="flex items-center gap-6 lg:gap-8 w-auto">
              <div class="text-center font-heading leading-tight shrink-0 flex flex-col items-center">
                <div class="text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${h}</div>
                <div class="text-[20px] font-medium text-navy capitalize">${o}</div>
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
                  <div class="text-[20px] font-bold text-navy uppercase leading-none tracking-tight break-words truncate w-[100px]">${t.origin}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${t.originCode}</div>
                </div>
                
                <div class="w-[46px] h-[46px] rounded-full bg-[#f8fafc] border border-border flex items-center justify-center shrink-0 shadow-sm relative">
                  <i class="bi bi-arrow-right text-primary text-[20px]"></i>
                </div>
                
                <div class="text-left w-[100px]">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">To</div>
                  <div class="text-[20px] font-bold text-navy uppercase leading-none tracking-tight break-words truncate w-[100px]">${t.destination}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${t.destinationCode}</div>
                </div>
              </div>

              <!-- Times & Info -->
              <div class="flex gap-10 lg:gap-14 text-sm mx-0">
                <div class="text-left">
                  <div class="text-[14px] font-bold text-navy mb-3">Flight time</div>
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">Dep- ${t.departure}</div>
                  <div class="text-[13px] text-text-muted font-medium flex items-center">Arr- ${t.arrival}</div>
                </div>
                <div class="text-left">
                  <div class="text-[14px] font-bold text-navy mb-3">Luggage</div>
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">${t.checkInBaggage}</div>
                  <div class="text-[14px] font-bold text-navy flex items-center">${t.cabinBaggage}</div>
                </div>
              </div>
              
            </div>

            <!-- Right side: Price & Action -->
            <div class="flex flex-col items-center justify-center lg:w-[180px] shrink-0">
              <div class="bg-[#f8fafc] rounded-xl p-4 w-full flex flex-col items-center border border-border/50">
                <span class="text-[32px] font-medium text-navy tracking-tight mb-3 leading-none flex items-center">
                  ${t.price}
                </span>
                <a href="${I}" target="_blank" class="w-full bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[15px] px-6 py-2.5 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                  Book Now
                </a>
              </div>
            </div>

          </div>

        </div>
      `}),p.innerHTML=B}catch(x){S.style.display="none",p&&(p.innerHTML='<div class="text-center text-red-500 p-10 font-bold border-2 border-dashed border-red-200 rounded-[24px] mt-6 bg-red-50">Error connection. Failed to fetch live flights. Please ensure the server is active.</div>'),console.error(x)}}window.searchFlights=N;
