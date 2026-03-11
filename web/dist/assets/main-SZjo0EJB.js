import"./firebase-config-zYKzaodH.js";import{g as _,a as j,b as F}from"./db-CCPO5ebM.js";document.addEventListener("DOMContentLoaded",()=>{const A=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?A.classList.add("scrolled"):A.classList.remove("scrolled")});const x=document.getElementById("mobile-toggle"),d=document.getElementById("nav-menu");x&&x.addEventListener("click",()=>{d.classList.toggle("active");const s=x.querySelector("i");d.classList.contains("active")?s.classList.replace("bi-list","bi-x-lg"):s.classList.replace("bi-x-lg","bi-list")}),document.querySelectorAll('a[href^="#"]').forEach(s=>{s.addEventListener("click",function(k){const f=this.getAttribute("href");if(d&&d.classList.contains("active")&&(d.classList.remove("active"),x&&x.querySelector("i").classList.replace("bi-x-lg","bi-list")),f&&f!=="#"){const r=document.querySelector(f);if(r){k.preventDefault();const l=r.getBoundingClientRect().top+window.pageYOffset-80;window.scrollTo({top:l,behavior:"smooth"}),window.history.pushState(null,"",f)}}})});const L=[{id:"kozhikode",code:"CCJ",name:"Kozhikode"},{id:"kochi",code:"COK",name:"Kochi"},{id:"kannur",code:"CNN",name:"Kannur"},{id:"trivandrum",code:"TRV",name:"Trivandrum"},{id:"mangalore",code:"IXE",name:"Mangalore"}],E=[{id:"jeddah",code:"JED",name:"Jeddah"},{id:"riyadh",code:"RUH",name:"Riyadh"},{id:"dammam",code:"DMM",name:"Dammam"},{id:"doha",code:"DOH",name:"Doha"},{id:"muscat",code:"MCT",name:"Muscat"},{id:"bahrain",code:"BAH",name:"Bahrain"},{id:"kuwait",code:"KWI",name:"Kuwait"},{id:"dubai",code:"DXB",name:"Dubai"},{id:"sharjah",code:"SHJ",name:"Sharjah"},{id:"abudhabi",code:"AUH",name:"Abu Dhabi"},{id:"rasalkhaimah",code:"RKT",name:"Ras Al Khaimah"},{id:"alain",code:"AAN",name:"Al Ain"},{id:"fujairah",code:"FJR",name:"Fujairah"}],T=document.getElementById("flight-grids-container");if(T){const s=(k,f,r)=>{const g=document.createElement("div");g.className="mb-[50px]",g.innerHTML=`
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> Flights From ${r}
        </h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6" id="grid-${r.replace(/\s+/g,"-").toLowerCase()}"></div>
      `,T.appendChild(g);const $=g.querySelector(`#grid-${r.replace(/\s+/g,"-").toLowerCase()}`);k.forEach(l=>{const y=document.createElement("div");y.className="sector-card bg-gradient-to-r from-primary to-[#1558c0] p-[18px_24px] rounded-[16px] shadow-[var(--shadow-premium-soft)] cursor-pointer hover:shadow-[0_8px_25px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center relative overflow-hidden group",y.innerHTML=`<h4 class="text-[17px] font-heading font-extrabold text-white m-0 flex items-center justify-between z-[2] relative w-full">${l.name} (${l.code}) <i class="bi bi-arrow-right-circle text-white/80 text-[22px]"></i></h4>`,y.addEventListener("click",()=>{typeof e=="function"&&e(l,f)}),$.appendChild(y)})};s(L,E,"India"),s(E,L,"Middle East")}const c=document.getElementById("sector-modal"),B=document.getElementById("modal-close"),u=document.getElementById("modal-body"),m=document.getElementById("modal-route"),D=document.getElementById("modal-title");function e(s,k){D.textContent="Select Destination",m.textContent=`Flying from ${s.name}`,m.classList.remove("bg-primary-light","text-primary"),m.classList.add("bg-slate-100","text-slate-600"),c.classList.add("active"),document.body.style.overflow="hidden",u.innerHTML=`
      <div class="text-center mb-6">
        <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Routes</h4>
        <p class="text-text-muted text-sm">Select a destination to view flight options</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1" id="routes-grid">
      </div>
    `;const f=document.getElementById("routes-grid");k.forEach(r=>{const g=`${s.code} ${r.code}`,$=`${s.name} → ${r.name}`,l=document.createElement("button");l.className="bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all flex items-center justify-between group cursor-pointer w-full text-left",l.innerHTML=`
        <span class="font-bold text-navy text-[15px]">${r.name}</span>
        <i class="bi bi-chevron-right text-text-muted group-hover:text-primary transition-colors"></i>
      `,l.onclick=()=>{v(g,$)},f.appendChild(l)})}function v(s,k){D.textContent="Flight Details",m.textContent=s.replace(" "," → "),m.classList.add("bg-primary-light","text-primary"),m.classList.remove("bg-slate-100","text-slate-600"),c.classList.add("active"),document.body.style.overflow="hidden",u.innerHTML='<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>';async function f(){try{const g=(await _()).find(h=>h.sectorCode===s),$=await F(),l={};$.forEach(h=>l[h.id]=h.name);let y="";if(g){const h=new Date;h.setHours(0,0,0,0);let I=await j({sectorId:g.id,startDate:h.toISOString()});I.sort((a,w)=>a.flightDate.getTime()===w.flightDate.getTime()?a.finalRate-w.finalRate:a.flightDate.getTime()-w.flightDate.getTime()),I.length===0?y='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>':y=I.map(a=>{const w=l[a.airlineId]||"Unknown Airline",H={day:"2-digit",month:"short",year:"numeric"},O=a.flightDate.toLocaleDateString("en-GB",H),P=a.flightTime&&a.flightTime.split("-")[0]?a.flightTime.split("-")[0].trim():"TBA",K=a.flightTime&&a.flightTime.includes("-")?a.flightTime.split("-")[1].trim():"TBA";return`
                          <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                              <td class="p-[14px_15px] whitespace-nowrap"><strong>${O}</strong></td>
                              <td class="p-[14px_15px] whitespace-nowrap"><strong>${w}</strong></td>
                              <td class="p-[14px_15px]">${P}</td>
                              <td class="p-[14px_15px]">${K}</td>
                              <td class="p-[14px_15px] text-right"><strong>₹${a.finalRate.toLocaleString("en-IN")}</strong></td>
                          </tr>`}).join("")}else y='<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>';u.innerHTML=`
                <div class="text-center mb-4">
                    <button class="mb-4 text-primary font-bold text-[14px] hover:underline flex items-center gap-2 justify-center mx-auto" id="back-to-routes">
                      <i class="bi bi-arrow-left"></i> Back to Destinations
                    </button>
                    <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${k}</h4>
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
                          ${y}
                      </tbody>
                  </table>
                </div>
            `;const C=document.getElementById("back-to-routes");C&&C.addEventListener("click",()=>{const h=s.split(" ")[0];let I=L.find(w=>w.code===h),a=E;I||(I=E.find(w=>w.code===h),a=L),I?e(I,a):p()})}catch(r){console.error("Error fetching fares:",r),u.innerHTML='<p class="text-center text-red-500 my-4">Error loading flights. Please try again later.</p>'}}f()}function p(){c.classList.remove("active"),document.body.style.overflow=""}B&&B.addEventListener("click",p),c&&c.addEventListener("click",s=>{s.target===c&&p()}),document.addEventListener("keydown",s=>{s.key==="Escape"&&c.classList.contains("active")&&p()}),(()=>{document.querySelector(".partners-slider")})();const i=document.getElementById("live-search-btn");i&&i.addEventListener("click",()=>{typeof R=="function"&&R()});const t=document.getElementById("swap-locations"),n=document.getElementById("swap-locations-mobile"),o=document.getElementById("origin"),b=document.getElementById("destination"),N=()=>{if(o&&b){const s=o.value;o.value=b.value,b.value=s}};t&&t.addEventListener("click",N),n&&n.addEventListener("click",N)});async function R(){const A=document.getElementById("origin").value,x=document.getElementById("destination").value,d=document.getElementById("flightList"),S=document.getElementById("loading"),L=document.getElementById("resultsHeader"),E=document.getElementById("origName"),T=document.getElementById("locName");d.innerHTML="",S.style.display="block",L.style.display="none";try{const c=await _(),B=`${A} ${x}`,u=c.find(e=>e.sectorCode===B);let m=[];if(u){const e=new Date;e.setHours(0,0,0,0);let v=await j({sectorId:u.id,startDate:e.toISOString()});v.sort((i,t)=>i.flightDate.getTime()===t.flightDate.getTime()?i.finalRate-t.finalRate:i.flightDate.getTime()-t.flightDate.getTime());const p=await F(),M={};p.forEach(i=>M[i.id]=i.name),m=v.map(i=>{const t={day:"2-digit",month:"short",year:"numeric"},n=i.flightDate.toLocaleDateString("en-GB",t).replace(/,/g,""),o=i.flightTime&&i.flightTime.split("-")[0]?i.flightTime.split("-")[0].trim():"TBA",b=i.flightTime&&i.flightTime.includes("-")?i.flightTime.split("-")[1].trim():"TBA";return{airline:M[i.airlineId]||"Unknown Airline",origin:u.sectorFrom,originCode:A,destination:u.sectorTo,destinationCode:x,date:n,departure:o,arrival:b,price:"₹"+i.finalRate.toLocaleString("en-IN"),seats:i.seatsAvailable||0}})}if(S.style.display="none",L.style.display="block",E&&(E.innerText=A),T&&(T.innerText=x),!m||m.length===0){d.innerHTML=`<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found from ${A} to ${x}. Try another destination.</div>`;return}let D="";m.forEach(e=>{let v="00",p="MTH";if(e.date){const b=e.date.split(" ");b.length>=2?(v=b[0],p=b[1]):(v=e.date,p="")}const i=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${e.airline}*
🛫 From: *${e.origin}*
🛬 To: *${e.destination}*
📅 Date: *${e.date}*
⏰ Dep: ${e.departure} | Arr: ${e.arrival}
💵 Price: *${e.price}*

Please confirm availability!`)}`;let t=(e.airline||"").toUpperCase().trim(),n="";const o={INDIGO:"/assets/img/flights/indigo.png","AIR INDIA EXPRESS":"/assets/img/flights/air-india-express.png","AIR ARABIA":"/assets/img/flights/air-arabia.png",FLYNAS:"/assets/img/flights/flynas.png","OMAN AIR":"/assets/img/flights/oman-air.png","SALAM AIR":"/assets/img/flights/salam-air.png","AIR INDIA":"/assets/img/flights/air-india.png",SAUDIA:"/assets/img/flights/saudia.png"};t.includes("EXPRESS")||t==="IX"?n=o["AIR INDIA EXPRESS"]:t.includes("INDIA")||t==="AI"?n=o["AIR INDIA"]:t.includes("SAUD")||t.includes("SOUD")||t==="SV"?n=o.SAUDIA:t.includes("INDIGO")||t==="6E"?n=o.INDIGO:t.includes("ARABIA")||t==="G9"?n=o["AIR ARABIA"]:t.includes("FLYNAS")||t==="XY"?n=o.FLYNAS:t.includes("OMAN")||t==="WY"?n=o["OMAN AIR"]:t.includes("SALAM")||t==="OV"?n=o["SALAM AIR"]:n=`https://flycreativekdr.com:8443/FlyCreativeNG/css2/img/Flight_Logo/${e.airline}.png`,D+=`
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
                  ${v} <span class="text-primary text-[14px]">${p}</span>
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
                <div class="text-[11px] text-green-600 font-bold mt-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <i class="bi bi-person-check-fill text-[14px]"></i> ${e.seats} Seats Left
                </div>
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
                <div class="text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${v}</div>
                <div class="text-[20px] font-medium text-navy capitalize">${p}</div>
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
                <div class="text-[11px] text-green-600 font-bold mt-2.5 text-center uppercase tracking-wide flex items-center gap-1">
                  <i class="bi bi-person-check-fill"></i> ${e.seats} Seats Left
                </div>
              </div>
            </div>

          </div>

        </div>
      `}),d.innerHTML=D}catch(c){S.style.display="none",d&&(d.innerHTML='<div class="text-center text-red-500 p-10 font-bold border-2 border-dashed border-red-200 rounded-[24px] mt-6 bg-red-50">Error connection. Failed to fetch live flights. Please ensure the server is active.</div>'),console.error(c)}}window.searchFlights=R;
