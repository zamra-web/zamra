import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?t.classList.add("scrolled"):t.classList.remove("scrolled")});const e=document.getElementById("mobile-toggle"),n=document.getElementById("nav-menu");e&&e.addEventListener("click",()=>{n.classList.toggle("active");const i=e.querySelector("i");n.classList.contains("active")?i.classList.replace("bi-list","bi-x-lg"):i.classList.replace("bi-x-lg","bi-list")}),document.querySelectorAll(".nav-menu a").forEach(i=>{i.addEventListener("click",()=>{n.classList.contains("active")&&(n.classList.remove("active"),e.querySelector("i").classList.replace("bi-x-lg","bi-list"))})});const p=[{id:"kozhikode",code:"CCJ",name:"Kozhikode"},{id:"kochi",code:"COK",name:"Kochi"},{id:"kannur",code:"CNN",name:"Kannur"},{id:"trivandrum",code:"TRV",name:"Trivandrum"},{id:"mangalore",code:"IXE",name:"Mangalore"}],m=[{id:"jeddah",code:"JED",name:"Jeddah"},{id:"riyadh",code:"RUH",name:"Riyadh"},{id:"dammam",code:"DMM",name:"Dammam"},{id:"doha",code:"DOH",name:"Doha"},{id:"muscat",code:"MCT",name:"Muscat"},{id:"bahrain",code:"BAH",name:"Bahrain"},{id:"kuwait",code:"KWI",name:"Kuwait"},{id:"dubai",code:"DXB",name:"Dubai"},{id:"sharjah",code:"SHJ",name:"Sharjah"},{id:"abudhabi",code:"AUH",name:"Abu Dhabi"},{id:"rasalkhaimah",code:"RKT",name:"Ras Al Khaimah"},{id:"alain",code:"AAN",name:"Al Ain"},{id:"fujairah",code:"FJR",name:"Fujairah"}],x=document.getElementById("flight-grids-container");if(x){const i=(l,R)=>{const A=document.createElement("div");A.className="mb-[50px]",A.innerHTML=`
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> From ${l.name} (${l.code})
        </h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6" id="grid-${l.id}"></div>
      `,x.appendChild(A);const O=A.querySelector(`#grid-${l.id}`);R.forEach(S=>{const C=`${l.code} ${S.code}`;`${l.name}${S.name}`;const w=document.createElement("div");w.className="sector-card bg-white p-[16px_20px] rounded-[12px] border border-border shadow-sm cursor-pointer hover:shadow-md hover:border-primary hover:-translate-y-1 transition-all duration-300 flex items-center justify-between relative overflow-hidden group",w.setAttribute("data-sector",C),w.innerHTML=`<h4 class="text-[15px] font-extrabold text-text-main m-0 flex items-center gap-[12px] z-[2] relative">${l.name} <i class="bi bi-airplane text-primary text-[18px]"></i> ${S.name}</h4>`,w.addEventListener("click",()=>{typeof v=="function"&&v(C)}),O.appendChild(w)})};p.forEach(l=>{i(l,m)}),m.forEach(l=>{i(l,p)})}const r=document.getElementById("sector-modal"),s=document.getElementById("modal-close"),o=document.getElementById("modal-body"),f=document.getElementById("modal-route");function v(i,l){f.textContent=i.replace(" "," → "),r.classList.add("active"),document.body.style.overflow="hidden",o.innerHTML='<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>',setTimeout(()=>{o.innerHTML=`
                <div class="text-center mb-4">
                    <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for \${routeName}</h4>
                    <p class="text-text-muted text-sm">Prices are introductory and subject to availability.</p>
                </div>
                <div class="overflow-x-auto w-full pb-2">
                  <table class="w-full min-w-[500px] border-collapse my-[10px] text-[14px] text-left rounded-[10px] overflow-hidden">
                      <thead>
                          <tr class="bg-[#f8fafc] text-text-muted font-bold border-b-2 border-[#e2e8f0]">
                              <th class="p-[14px_15px]">Airlines</th>
                              <th class="p-[14px_15px]">Departure</th>
                              <th class="p-[14px_15px]">Arrival</th>
                              <th class="p-[14px_15px]">Status</th>
                              <th class="p-[14px_15px] text-right">Price Starts At</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                              <td class="p-[14px_15px] whitespace-nowrap"><strong>Air India Express</strong></td>
                              <td class="p-[14px_15px]">10:45 AM</td>
                              <td class="p-[14px_15px]">01:20 PM</td>
                              <td class="p-[14px_15px]"><span style="color: #16a34a; font-weight: 600;">Available</span></td>
                              <td class="p-[14px_15px] text-right"><strong>₹12,450</strong></td>
                          </tr>
                          <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                              <td class="p-[14px_15px] whitespace-nowrap"><strong>Saudi Airlines</strong></td>
                              <td class="p-[14px_15px]">04:30 PM</td>
                              <td class="p-[14px_15px]">08:15 PM</td>
                              <td class="p-[14px_15px]"><span style="color: #16a34a; font-weight: 600;">Available</span></td>
                              <td class="p-[14px_15px] text-right"><strong>₹14,200</strong></td>
                          </tr>
                          <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                              <td class="p-[14px_15px] whitespace-nowrap"><strong>Oman Air</strong></td>
                              <td class="p-[14px_15px]">11:00 PM</td>
                              <td class="p-[14px_15px]">03:45 AM</td>
                              <td class="p-[14px_15px]"><span style="color: #d97706; font-weight: 600;">Few Seats</span></td>
                              <td class="p-[14px_15px] text-right"><strong>₹13,800</strong></td>
                          </tr>
                      </tbody>
                  </table>
                </div>
            `},800)}function b(){r.classList.remove("active"),document.body.style.overflow=""}s&&s.addEventListener("click",b),r&&r.addEventListener("click",i=>{i.target===r&&b()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&r.classList.contains("active")&&b()}),(()=>{document.querySelector(".partners-slider")})();const c=document.getElementById("live-search-btn");c&&c.addEventListener("click",()=>{typeof B=="function"&&B()})});const P="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",H=[1,2,21,22,23,24,25,28,31,40,42,43,44];let u=null,g=JSON.parse(localStorage.getItem("zt_hist")||"[]"),$=g.reduce((t,e)=>t+(e.rows||0),0);function M(){document.getElementById("statSubs").textContent=g.length,document.getElementById("statEntries").textContent=$}function j(){const t=document.getElementById("chipGrid");!t||t.children.length>0||H.forEach(e=>{const n=document.createElement("div");n.className="rp-chip",n.textContent=e,n.style.cssText="height:48px;display:flex;align-items:center;justify-content:center;border:2px solid #b8cce4;border-radius:10px;font-size:15px;font-weight:700;color:#1e293b;cursor:pointer;background:#ffffff;user-select:none;box-shadow:0 1px 4px rgba(13,31,60,.10);transition:all .16s ease;",n.addEventListener("click",()=>F(e,n)),t.appendChild(n)})}document.addEventListener("DOMContentLoaded",()=>{j(),E(),M()});function F(t,e){u=t,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(n=>{n.classList.remove("on"),n.style.background="#ffffff",n.style.color="#1e293b",n.style.borderColor="#b8cce4",n.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",n.style.transform=""}),e&&(e.classList.add("on"),e.style.background="#1a73e8",e.style.color="#ffffff",e.style.borderColor="#1a73e8",e.style.boxShadow="0 4px 14px rgba(26,115,232,.3)",e.style.transform="translateY(-1px)"),_(),y()}document.getElementById("manualAgent").addEventListener("input",function(){const t=parseInt(this.value);u=t>0?t:null,document.querySelectorAll(".rp-chip").forEach(e=>{e.classList.remove("on"),e.style.background="#ffffff",e.style.color="#1e293b",e.style.borderColor="#b8cce4",e.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",e.style.transform=""}),_(),y()});function _(){const t=document.getElementById("agentPill");u?(t.textContent=`Agent ${u} selected ✓`,t.classList.remove("empty")):(t.textContent="No agent selected",t.classList.add("empty"))}const h=document.getElementById("rateData");let N;h.addEventListener("input",function(){const t=this.value.length;document.getElementById("charCount").textContent=t.toLocaleString()+" character"+(t!==1?"s":""),y(),clearTimeout(N),t>15?N=setTimeout(()=>J(this.value),500):L()});function y(){document.getElementById("submitBtn").disabled=!(u&&h.value.trim().length>10)}function D(t){const e=[],n={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},a=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let p=null,m="IX";for(const x of t.split(`
`)){const r=x.replace(/[*_~`]/g,"").trim();if(!r)continue;const s=r.match(/([A-Z]{3})\s+([A-Z]{3})/);if(s&&r.length<70&&!r.match(/\d{4,6}/)){p=s[1]+"-"+s[2];const o=r.match(a);o&&(m=o[1]);continue}if(p){const o=r.match(a);if(o&&!r.match(/\d{4,6}/)){m=o[1];continue}const f=r.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(f){const v=parseInt(f[3]);v>=1e3&&v<=99999&&e.push({sector:p,date:`2026-${n[f[2].toUpperCase()]}-${f[1].padStart(2,"0")}`,airline:o?o[1]:m,rate:v})}}}return e}function J(t){const e=D(t);if(!e.length){L();return}document.getElementById("prevBox").classList.add("on"),document.getElementById("prevCount").textContent=e.length+" entr"+(e.length===1?"y":"ies");const n=document.getElementById("prevBody");n.innerHTML=e.slice(0,60).map(a=>`
    <tr>
      <td class="td-s">${a.sector}</td>
      <td>${a.date}</td>
      <td class="td-a">${a.airline}</td>
      <td class="td-r">₹${a.rate.toLocaleString()}</td>
    </tr>
  `).join(""),e.length>60&&(n.innerHTML+=`<tr><td colspan="4" style="text-align:center;padding:10px;
      color:var(--z-text-soft);font-size:11px">+ ${e.length-60} more entries</td></tr>`)}function L(){document.getElementById("prevBox").classList.remove("on")}document.getElementById("resetBtn").addEventListener("click",()=>{h.value="",document.getElementById("charCount").textContent="0 characters",L(),y()});document.getElementById("submitBtn").addEventListener("click",async()=>{if(!u||!h.value.trim())return;const t=document.getElementById("submitBtn"),e=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="spin"></div> Processing...';const n=document.getElementById("progBar"),a=document.getElementById("progFill");n.classList.add("on");let p=0;const m=setInterval(()=>{p=Math.min(p+Math.random()*13,85),a.style.width=p+"%"},280),x=D(h.value),r={agent_id:u,raw_text:h.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"},s={id:Date.now(),agent:u,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:x.length,status:"pen"};g.unshift(s),g.length>15&&g.pop(),k(),E();try{const o=await fetch(P,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(clearInterval(m),a.style.width="100%",o.ok)s.status="ok",T(x.length);else throw new Error(`Server error ${o.status}`)}catch(o){clearInterval(m),a.style.width="100%",o.message.startsWith("Server error")?(s.status="err",k(),E(),I("error","Submission Failed",o.message)):(s.status="ok",T(x.length),I("warning","Webhook Not Connected","Data captured locally. Set the WEBHOOK constant to your n8n URL to go live."))}setTimeout(()=>{n.classList.remove("on"),a.style.width="0%",t.innerHTML=e,y()},900)});function T(t){k(),E(),$+=t,M(),I("success","Submitted Successfully",`Agent ${u} — ${t} entries queued for processing.`),setTimeout(()=>{h.value="",document.getElementById("charCount").textContent="0 characters",L(),y()},500)}const U={success:'<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'};function I(t,e,n){const a=document.createElement("div");a.className=`toast ${t}`,a.innerHTML=`
    <div class="ti">${U[t]}</div>
    <div class="tb">
      <div class="tt">${e}</div>
      <div class="tm">${n}</div>
    </div>
    <button class="tx" onclick="this.closest('.rp-toast').remove()">
      <svg viewBox="0 0 12 12" fill="none">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>`,document.getElementById("toastsEl").appendChild(a),setTimeout(()=>a.remove(),7e3)}function k(){localStorage.setItem("zt_hist",JSON.stringify(g))}function E(){const t=document.getElementById("historyWrap");if(!g.length){t.innerHTML=`
      <div class="h-empty">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        No submissions yet
      </div>`;return}t.innerHTML=g.map(e=>`
    <div class="h-item">
      <div class="h-ag">${e.agent}</div>
      <div class="h-meta">
        <div class="h-id">Agent ${e.agent}</div>
        <div class="h-t">${e.time}</div>
      </div>
      <div class="h-rows">
        <span class="h-n">${e.rows}</span>
        <span class="h-l">entries</span>
      </div>
      <div class="dot ${e.status}"></div>
    </div>
  `).join("")}document.getElementById("clearBtn").addEventListener("click",()=>{g.length&&(g=[],$=0,k(),E(),M())});async function B(){const t=document.getElementById("destination").value,e=document.getElementById("flightList"),n=document.getElementById("loading"),a=document.getElementById("resultsHeader"),p=document.getElementById("locName");e.innerHTML="",n.style.display="block",a.style.display="none";try{const x=await(await fetch("https://n8n.srv1046139.hstgr.cloud/webhook/get-flights",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({destination:t})})).json();if(n.style.display="none",a.style.display="block",p&&(p.innerText=t),!x||x.length===0){e.innerHTML=`<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found for ${t}. Try another destination.</div>`;return}let r="";x.forEach(s=>{let o="00",f="MTH";if(s.date){const l=s.date.split(" ");l.length>=2?(o=l[0],f=l[1]):(o=s.date,f="")}const b=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${s.airline}*
🛫 From: *${s.origin}*
🛬 To: *${s.destination}*
📅 Date: *${s.date}*
⏰ Dep: ${s.departure} | Arr: ${s.arrival}
💵 Price: *${s.price}*

Please confirm availability!`)}`;let d=(s.airline||"").toUpperCase().trim(),c="";const i={INDIGO:"/assets/img/flights/indigo.png","AIR INDIA EXPRESS":"/assets/img/flights/air-india-express.png","AIR ARABIA":"/assets/img/flights/air-arabia.png",FLYNAS:"/assets/img/flights/flynas.png","OMAN AIR":"/assets/img/flights/oman-air.png","SALAM AIR":"/assets/img/flights/salam-air.png","AIR INDIA":"/assets/img/flights/air-india.png",SAUDIA:"/assets/img/flights/saudia.png"};d.includes("EXPRESS")||d==="IX"?c=i["AIR INDIA EXPRESS"]:d.includes("INDIA")||d==="AI"?c=i["AIR INDIA"]:d.includes("SAUD")||d.includes("SOUD")||d==="SV"?c=i.SAUDIA:d.includes("INDIGO")||d==="6E"?c=i.INDIGO:d.includes("ARABIA")||d==="G9"?c=i["AIR ARABIA"]:d.includes("FLYNAS")||d==="XY"?c=i.FLYNAS:d.includes("OMAN")||d==="WY"?c=i["OMAN AIR"]:d.includes("SALAM")||d==="OV"?c=i["SALAM AIR"]:c=`https://flycreativekdr.com:8443/FlyCreativeNG/css2/img/Flight_Logo/${s.airline}.png`,r+=`
        <div class="bg-white rounded-[16px] p-4 lg:p-6 mb-4 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] relative">
          
          <!-- MOBILE VIEW (< lg) -->
          <div class="flex flex-col gap-4 lg:hidden">
            <!-- Mobile Top Section -->
            <div class="flex items-center justify-start gap-4 border-b border-border pb-4">
              <div class="w-[60px] h-[60px] shrink-0 bg-[#f8fafc] rounded-xl border border-border/50 flex items-center justify-center p-2">
                <img src="${c}" onerror="this.style.display='none'" class="max-h-full max-w-full object-contain">
              </div>
              <div>
                <div class="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-1">${s.airline}</div>
                <div class="text-[18px] font-heading font-bold text-navy flex items-baseline gap-1.5 leading-none">
                  ${o} <span class="text-primary text-[14px]">${f}</span>
                </div>
              </div>
            </div>

            <!-- Mobile Middle Section -->
            <div class="flex flex-row items-center justify-between gap-2 px-2">
              <div class="text-left flex-none">
                <div class="text-[20px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${s.origin}</div>
                <div class="text-[12px] font-medium text-text-muted uppercase">Dep: ${s.departure}</div>
              </div>
              
              <!-- Mobile Connector -->
              <div class="flex flex-col items-center px-2">
                <i class="bi bi-arrow-right text-primary text-[24px]"></i>
                <div class="text-[10px] text-text-muted font-bold mt-1">37KG</div>
              </div>

              <div class="text-right flex-none">
                <div class="text-[20px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${s.destination}</div>
                <div class="text-[12px] font-medium text-text-muted uppercase">Arr: ${s.arrival}</div>
              </div>
            </div>

            <!-- Mobile Bottom Section -->
            <div class="flex sm:flex-row flex-col items-center justify-between w-full border-t border-border pt-4 gap-3 sm:gap-0">
              <div class="flex flex-col items-center sm:items-start w-full sm:w-auto">
                <span class="text-[24px] font-heading font-bold text-navy leading-none tracking-tight">${s.price}</span>
                <div class="text-[11px] text-green-600 font-bold mt-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <i class="bi bi-person-check-fill text-[14px]"></i> ${s.seats} Seats Left
                </div>
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
                <div class="text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${o}</div>
                <div class="text-[20px] font-medium text-navy capitalize">${f}</div>
              </div>
              
              <div class="w-[100px] shrink-0 text-center flex items-center justify-center">
                <img src="${c}" onerror="this.style.display='none'" class="max-h-[35px] max-w-full object-contain">
              </div>
            </div>

            <!-- Middle side: Routes & Details -->
            <div class="flex flex-1 flex-row items-center justify-between gap-8 px-6">
              
              <!-- Route -->
              <div class="flex items-center gap-6 lg:gap-8 mx-0">
                <div class="text-left w-[100px]">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">From</div>
                  <div class="text-[22px] font-medium text-navy uppercase leading-none tracking-tight">${s.origin}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${s.origin.substring(0,3)}</div>
                </div>
                
                <div class="w-[46px] h-[46px] rounded-full bg-[#f8fafc] border border-border flex items-center justify-center shrink-0 shadow-sm relative">
                  <i class="bi bi-arrow-right text-primary text-[20px]"></i>
                </div>
                
                <div class="text-left w-[100px]">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">To</div>
                  <div class="text-[22px] font-medium text-navy uppercase leading-none tracking-tight">${s.destination}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${s.destination.substring(0,3)}</div>
                </div>
              </div>

              <!-- Times & Info -->
              <div class="flex gap-10 lg:gap-14 text-sm mx-0">
                <div class="text-left">
                  <div class="text-[14px] font-bold text-navy mb-3">Flight time</div>
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">Dep- ${s.departure}</div>
                  <div class="text-[13px] text-text-muted font-medium flex items-center">Arr- ${s.arrival}</div>
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
                  ${s.price}
                </span>
                <a href="${b}" target="_blank" class="w-full bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[15px] px-6 py-2.5 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                  Book Now
                </a>
                <div class="text-[11px] text-green-600 font-bold mt-2.5 text-center uppercase tracking-wide flex items-center gap-1">
                  <i class="bi bi-person-check-fill"></i> ${s.seats} Seats Left
                </div>
              </div>
            </div>

          </div>

        </div>
      `}),e.innerHTML=r}catch(m){n.style.display="none",I("error","Connection Error","Failed to fetch live flights. Please ensure the server is active."),console.error(m)}}window.searchFlights=B;
