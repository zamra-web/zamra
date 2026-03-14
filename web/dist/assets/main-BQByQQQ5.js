import"./index.esm-kRT_WKqT.js";/* empty css              */import{g as O,a as P,b as K}from"./db-vX1QkBnN.js";import"./firebase-config-aHS-3htW.js";document.addEventListener("DOMContentLoaded",()=>{const L=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?L.classList.add("scrolled"):L.classList.remove("scrolled")});const x=document.getElementById("mobile-toggle"),d=document.getElementById("nav-menu");x&&x.addEventListener("click",()=>{d.classList.toggle("active");const n=x.querySelector("i");d.classList.contains("active")?n.classList.replace("bi-list","bi-x-lg"):n.classList.replace("bi-x-lg","bi-list")}),document.querySelectorAll('a[href^="#"]').forEach(n=>{n.addEventListener("click",function(I){const f=this.getAttribute("href");if(d&&d.classList.contains("active")&&(d.classList.remove("active"),x&&x.querySelector("i").classList.replace("bi-x-lg","bi-list")),f&&f!=="#"){const r=document.querySelector(f);if(r){I.preventDefault();const l=r.getBoundingClientRect().top+window.pageYOffset-80;window.scrollTo({top:l,behavior:"smooth"}),window.history.pushState(null,"",f)}}})});const E=[{id:"kozhikode",code:"CCJ",name:"Kozhikode"},{id:"kochi",code:"COK",name:"Kochi"},{id:"kannur",code:"CNN",name:"Kannur"},{id:"trivandrum",code:"TRV",name:"Trivandrum"},{id:"mangalore",code:"IXE",name:"Mangalore"}],$=[{id:"jeddah",code:"JED",name:"Jeddah"},{id:"riyadh",code:"RUH",name:"Riyadh"},{id:"dammam",code:"DMM",name:"Dammam"},{id:"doha",code:"DOH",name:"Doha"},{id:"muscat",code:"MCT",name:"Muscat"},{id:"bahrain",code:"BAH",name:"Bahrain"},{id:"kuwait",code:"KWI",name:"Kuwait"},{id:"dubai",code:"DXB",name:"Dubai"},{id:"sharjah",code:"SHJ",name:"Sharjah"},{id:"abudhabi",code:"AUH",name:"Abu Dhabi"},{id:"rasalkhaimah",code:"RKT",name:"Ras Al Khaimah"},{id:"alain",code:"AAN",name:"Al Ain"},{id:"fujairah",code:"FJR",name:"Fujairah"}],T=document.getElementById("flight-grids-container");if(T){const n=(I,f,r)=>{const g=document.createElement("div");g.className="mb-[50px]",g.innerHTML=`
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> Flights From ${r}
        </h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6" id="grid-${r.replace(/\s+/g,"-").toLowerCase()}"></div>
      `,T.appendChild(g);const k=g.querySelector(`#grid-${r.replace(/\s+/g,"-").toLowerCase()}`);I.forEach(l=>{const w=document.createElement("div");w.className="sector-card bg-gradient-to-r from-primary to-[#1558c0] p-[18px_24px] rounded-[16px] shadow-[var(--shadow-premium-soft)] cursor-pointer hover:shadow-[0_8px_25px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center relative overflow-hidden group",w.innerHTML=`<h4 class="text-[17px] font-heading font-extrabold text-white m-0 flex items-center justify-between z-[2] relative w-full">${l.name} (${l.code}) <i class="bi bi-arrow-right-circle text-white/80 text-[22px]"></i></h4>`,w.addEventListener("click",()=>{typeof e=="function"&&e(l,f)}),k.appendChild(w)})};n(E,$,"India"),n($,E,"Middle East")}const c=document.getElementById("sector-modal"),B=document.getElementById("modal-close"),v=document.getElementById("modal-body"),m=document.getElementById("modal-route"),D=document.getElementById("modal-title");function e(n,I){D.textContent="Select Destination",m.textContent=`Flying from ${n.name}`,m.classList.remove("bg-primary-light","text-primary"),m.classList.add("bg-slate-100","text-slate-600"),c.classList.add("active"),document.body.style.overflow="hidden",v.innerHTML=`
      <div class="text-center mb-6">
        <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Routes</h4>
        <p class="text-text-muted text-sm">Select a destination to view flight options</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1" id="routes-grid">
      </div>
    `;const f=document.getElementById("routes-grid");I.forEach(r=>{const g=`${n.code} ${r.code}`,k=`${n.name} → ${r.name}`,l=document.createElement("button");l.className="bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all flex items-center justify-between group cursor-pointer w-full text-left",l.innerHTML=`
        <span class="font-bold text-navy text-[15px]">${n.name} to ${r.name}</span>
        <i class="bi bi-chevron-right text-text-muted group-hover:text-primary transition-colors"></i>
      `,l.onclick=()=>{b(g,k)},f.appendChild(l)})}function b(n,I){D.textContent="Flight Details",m.textContent=n.replace(" "," → "),m.classList.add("bg-primary-light","text-primary"),m.classList.remove("bg-slate-100","text-slate-600"),c.classList.add("active"),document.body.style.overflow="hidden",v.innerHTML='<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>';async function f(){try{const g=(await O()).find(h=>h.sectorCode===n),k=await K(),l={};k.forEach(h=>l[h.id]=h.name);let w="";if(g){const h=new Date;h.setHours(0,0,0,0);let A=await P({sectorId:g.id,startDate:h.toISOString()});A.sort((s,u)=>s.flightDate.getTime()===u.flightDate.getTime()?s.finalRate-u.finalRate:s.flightDate.getTime()-u.flightDate.getTime()),A.length===0?w='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>':w=A.map(s=>{const u=l[s.airlineId]||"Unknown Airline",G={day:"2-digit",month:"short",year:"numeric"},C=s.flightDate.toLocaleDateString("en-GB",G),H=s.flightTime&&s.flightTime.split("-")[0]?s.flightTime.split("-")[0].trim():"TBA",j=s.flightTime&&s.flightTime.includes("-")?s.flightTime.split("-")[1].trim():"TBA",F=`₹${s.finalRate.toLocaleString("en-IN")}`,U=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'd like to book this flight:

✈️ *${u}*
🗯️ Route: *${I}*
📅 Date: *${C}*
⏰ Dep: ${H} | Arr: ${j}
💵 Price: *${F}*

Please confirm availability!`)}`;return`
                          <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                              <td class="p-[12px_15px] whitespace-nowrap"><strong>${C}</strong></td>
                              <td class="p-[12px_15px] whitespace-nowrap"><strong>${u}</strong></td>
                              <td class="p-[12px_15px]">${H}</td>
                              <td class="p-[12px_15px]">${j}</td>
                              <td class="p-[12px_15px] text-right"><strong>${F}</strong></td>
                              <td class="p-[12px_10px] text-center">
                                <a href="${U}" target="_blank" class="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-[#1558c0] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap hover:shadow-[0_3px_10px_rgba(26,115,232,0.35)] hover:-translate-y-0.5 transition-all">
                                  <i class="bi bi-whatsapp"></i> Book Now
                                </a>
                              </td>
                          </tr>`}).join("")}else w='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>';v.innerHTML=`
                <div class="text-center mb-4">
                    <button class="mb-4 text-primary font-bold text-[14px] hover:underline flex items-center gap-2 justify-center mx-auto" id="back-to-routes">
                      <i class="bi bi-arrow-left"></i> Back to Destinations
                    </button>
                    <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${I}</h4>
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
            `;const N=document.getElementById("back-to-routes");N&&N.addEventListener("click",()=>{const h=n.split(" ")[0];let A=E.find(u=>u.code===h),s=$;A||(A=$.find(u=>u.code===h),s=E),A?e(A,s):p()})}catch(r){console.error("Error fetching fares:",r),v.innerHTML='<p class="text-center text-red-500 my-4">Error loading flights. Please try again later.</p>'}}f()}function p(){c.classList.remove("active"),document.body.style.overflow=""}B&&B.addEventListener("click",p),c&&c.addEventListener("click",n=>{n.target===c&&p()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&c.classList.contains("active")&&p()}),(()=>{document.querySelector(".partners-slider")})();const i=document.getElementById("live-search-btn");i&&i.addEventListener("click",()=>{typeof R=="function"&&R()});const t=document.getElementById("swap-locations"),a=document.getElementById("swap-locations-mobile"),o=document.getElementById("origin"),y=document.getElementById("destination"),_=()=>{if(o&&y){const n=o.value;o.value=y.value,y.value=n}};t&&t.addEventListener("click",_),a&&a.addEventListener("click",_)});async function R(){const L=document.getElementById("origin").value,x=document.getElementById("destination").value,d=document.getElementById("flightList"),S=document.getElementById("loading"),E=document.getElementById("resultsHeader"),$=document.getElementById("origName"),T=document.getElementById("locName");d.innerHTML="",S.style.display="block",E.style.display="none";try{const c=await O(),B=`${L} ${x}`,v=c.find(e=>e.sectorCode===B);let m=[];if(v){const e=new Date;e.setHours(0,0,0,0);let b=await P({sectorId:v.id,startDate:e.toISOString()});b.sort((i,t)=>i.flightDate.getTime()===t.flightDate.getTime()?i.finalRate-t.finalRate:i.flightDate.getTime()-t.flightDate.getTime());const p=await K(),M={};p.forEach(i=>M[i.id]=i.name),m=b.map(i=>{const t={day:"2-digit",month:"short",year:"numeric"},a=i.flightDate.toLocaleDateString("en-GB",t).replace(/,/g,""),o=i.flightTime&&i.flightTime.split("-")[0]?i.flightTime.split("-")[0].trim():"TBA",y=i.flightTime&&i.flightTime.includes("-")?i.flightTime.split("-")[1].trim():"TBA";return{airline:M[i.airlineId]||"Unknown Airline",origin:v.sectorFrom,originCode:L,destination:v.sectorTo,destinationCode:x,date:a,departure:o,arrival:y,price:"₹"+i.finalRate.toLocaleString("en-IN"),seats:i.seatsAvailable||0}})}if(S.style.display="none",E.style.display="block",$&&($.innerText=L),T&&(T.innerText=x),!m||m.length===0){d.innerHTML=`<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found from ${L} to ${x}. Try another destination.</div>`;return}let D="";m.forEach(e=>{let b="00",p="MTH";if(e.date){const y=e.date.split(" ");y.length>=2?(b=y[0],p=y[1]):(b=e.date,p="")}const i=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${e.airline}*
🛫 From: *${e.origin}*
🛬 To: *${e.destination}*
📅 Date: *${e.date}*
⏰ Dep: ${e.departure} | Arr: ${e.arrival}
💵 Price: *${e.price}*

Please confirm availability!`)}`;let t=(e.airline||"").toUpperCase().trim(),a="";const o={INDIGO:"/assets/img/flights/indigo.png","AIR INDIA EXPRESS":"/assets/img/flights/air-india-express.png","AIR ARABIA":"/assets/img/flights/air-arabia.png",FLYNAS:"/assets/img/flights/flynas.png","OMAN AIR":"/assets/img/flights/oman-air.png","SALAM AIR":"/assets/img/flights/salam-air.png","AIR INDIA":"/assets/img/flights/air-india.png",SAUDIA:"/assets/img/flights/saudia.png"};t.includes("EXPRESS")||t==="IX"?a=o["AIR INDIA EXPRESS"]:t.includes("INDIA")||t==="AI"?a=o["AIR INDIA"]:t.includes("SAUD")||t.includes("SOUD")||t==="SV"?a=o.SAUDIA:t.includes("INDIGO")||t==="6E"?a=o.INDIGO:t.includes("ARABIA")||t==="G9"?a=o["AIR ARABIA"]:t.includes("FLYNAS")||t==="XY"?a=o.FLYNAS:t.includes("OMAN")||t==="WY"?a=o["OMAN AIR"]:t.includes("SALAM")||t==="OV"?a=o["SALAM AIR"]:a=`https://flycreativekdr.com:8443/FlyCreativeNG/css2/img/Flight_Logo/${e.airline}.png`,D+=`
        <div class="bg-white rounded-[16px] p-4 lg:p-6 mb-4 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] relative">
          
          <!-- MOBILE VIEW (< lg) -->
          <div class="flex flex-col gap-4 lg:hidden">
            <!-- Mobile Top Section -->
            <div class="flex items-center justify-start gap-4 border-b border-border pb-4">
              <div class="w-[60px] h-[60px] shrink-0 bg-[#f8fafc] rounded-xl border border-border/50 flex items-center justify-center p-2">
                <img src="${a}" onerror="this.style.display='none'" class="max-h-full max-w-full object-contain">
              </div>
              <div>
                <div class="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-1">${e.airline}</div>
                <div class="text-[18px] font-heading font-bold text-navy flex items-baseline gap-1.5 leading-none">
                  ${b} <span class="text-primary text-[14px]">${p}</span>
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
                <div class="text-[10px] text-text-muted font-bold mt-1">37KG</div>
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
              <a href="${i}" target="_blank" class="w-full sm:w-auto bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[14px] px-6 py-3 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                Book Now
              </a>
            </div>
          </div>

          <!-- DESKTOP VIEW (>= lg) -->
          <div class="hidden lg:flex flex-row items-center justify-between gap-6">
            <!-- Left side: Date & Airline -->
            <div class="flex items-center gap-6 lg:gap-8 w-auto">
              <div class="text-center font-heading leading-tight shrink-0 flex flex-col items-center">
                <div class="text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${b}</div>
                <div class="text-[20px] font-medium text-navy capitalize">${p}</div>
              </div>
              
              <div class="w-[100px] shrink-0 text-center flex items-center justify-center">
                <img src="${a}" onerror="this.style.display='none'" class="max-h-[35px] max-w-full object-contain">
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
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">30 KG</div>
                  <div class="text-[14px] font-bold text-navy flex items-center">+ 7 KG</div>
                </div>
              </div>
              
            </div>

            <!-- Right side: Price & Action -->
            <div class="flex flex-col items-center justify-center lg:w-[180px] shrink-0">
              <div class="bg-[#f8fafc] rounded-xl p-4 w-full flex flex-col items-center border border-border/50">
                <span class="text-[32px] font-medium text-navy tracking-tight mb-3 leading-none flex items-center">
                  ${e.price}
                </span>
                <a href="${i}" target="_blank" class="w-full bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[15px] px-6 py-2.5 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                  Book Now
                </a>
              </div>
            </div>

          </div>

        </div>
      `}),d.innerHTML=D}catch(c){S.style.display="none",d&&(d.innerHTML='<div class="text-center text-red-500 p-10 font-bold border-2 border-dashed border-red-200 rounded-[24px] mt-6 bg-red-50">Error connection. Failed to fetch live flights. Please ensure the server is active.</div>'),console.error(c)}}window.searchFlights=R;
