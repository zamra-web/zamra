import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?t.classList.add("scrolled"):t.classList.remove("scrolled")});const e=document.getElementById("mobile-toggle"),n=document.getElementById("nav-menu");e&&e.addEventListener("click",()=>{n.classList.toggle("active");const o=e.querySelector("i");n.classList.contains("active")?o.classList.replace("bi-list","bi-x-lg"):o.classList.replace("bi-x-lg","bi-list")}),document.querySelectorAll(".nav-menu a").forEach(o=>{o.addEventListener("click",()=>{n.classList.contains("active")&&(n.classList.remove("active"),e.querySelector("i").classList.replace("bi-x-lg","bi-list"))})});const c=[{id:"kozhikode",code:"CCJ",name:"Kozhikode"},{id:"kochi",code:"COK",name:"Kochi"},{id:"kannur",code:"CNN",name:"Kannur"},{id:"trivandrum",code:"TRV",name:"Trivandrum"},{id:"mangalore",code:"IXE",name:"Mangalore"}],m=[{id:"jeddah",code:"JED",name:"Jeddah"},{id:"riyadh",code:"RUH",name:"Riyadh"},{id:"dammam",code:"DMM",name:"Dammam"},{id:"doha",code:"DOH",name:"Doha"},{id:"muscat",code:"MCT",name:"Muscat"},{id:"bahrain",code:"BAH",name:"Bahrain"},{id:"kuwait",code:"KWI",name:"Kuwait"},{id:"dubai",code:"DXB",name:"Dubai"},{id:"sharjah",code:"SHJ",name:"Sharjah"},{id:"abudhabi",code:"AUH",name:"Abu Dhabi"},{id:"rasalkhaimah",code:"RKT",name:"Ras Al Khaimah"},{id:"alain",code:"AAN",name:"Al Ain"},{id:"fujairah",code:"FJR",name:"Fujairah"}],f=document.getElementById("flight-grids-container");if(f){const o=(l,O)=>{const A=document.createElement("div");A.className="mb-[50px]",A.innerHTML=`
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> From ${l.name} (${l.code})
        </h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6" id="grid-${l.id}"></div>
      `,f.appendChild(A);const R=A.querySelector(`#grid-${l.id}`);O.forEach(S=>{const $=`${l.code} ${S.code}`;`${l.name}${S.name}`;const w=document.createElement("div");w.className="sector-card bg-white p-[16px_20px] rounded-[12px] border border-border shadow-sm cursor-pointer hover:shadow-md hover:border-primary hover:-translate-y-1 transition-all duration-300 flex items-center justify-between relative overflow-hidden group",w.setAttribute("data-sector",$),w.innerHTML=`<h4 class="text-[15px] font-extrabold text-text-main m-0 flex items-center gap-[12px] z-[2] relative">${l.name} <i class="bi bi-airplane text-primary text-[18px]"></i> ${S.name}</h4>`,w.addEventListener("click",()=>{typeof h=="function"&&h($)}),R.appendChild(w)})};c.forEach(l=>{o(l,m)}),m.forEach(l=>{o(l,c)})}const r=document.getElementById("sector-modal"),s=document.getElementById("modal-close"),a=document.getElementById("modal-body"),u=document.getElementById("modal-route");function h(o,l){u.textContent=o.replace(" "," → "),r.classList.add("active"),document.body.style.overflow="hidden",a.innerHTML='<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>',setTimeout(()=>{a.innerHTML=`
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
            `},800)}function y(){r.classList.remove("active"),document.body.style.overflow=""}s&&s.addEventListener("click",y),r&&r.addEventListener("click",o=>{o.target===r&&y()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&r.classList.contains("active")&&y()}),(()=>{document.querySelector(".partners-slider")})();const p=document.getElementById("live-search-btn");p&&p.addEventListener("click",()=>{typeof B=="function"&&B()})});const H="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",P=[1,2,21,22,23,24,25,28,31,40,42,43,44];let g=null,x=JSON.parse(localStorage.getItem("zt_hist")||"[]"),M=x.reduce((t,e)=>t+(e.rows||0),0);function C(){document.getElementById("statSubs").textContent=x.length,document.getElementById("statEntries").textContent=M}function j(){const t=document.getElementById("chipGrid");!t||t.children.length>0||P.forEach(e=>{const n=document.createElement("div");n.className="rp-chip",n.textContent=e,n.style.cssText="height:48px;display:flex;align-items:center;justify-content:center;border:2px solid #b8cce4;border-radius:10px;font-size:15px;font-weight:700;color:#1e293b;cursor:pointer;background:#ffffff;user-select:none;box-shadow:0 1px 4px rgba(13,31,60,.10);transition:all .16s ease;",n.addEventListener("click",()=>F(e,n)),t.appendChild(n)})}document.addEventListener("DOMContentLoaded",()=>{j(),E(),C()});function F(t,e){g=t,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(n=>{n.classList.remove("on"),n.style.background="#ffffff",n.style.color="#1e293b",n.style.borderColor="#b8cce4",n.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",n.style.transform=""}),e&&(e.classList.add("on"),e.style.background="#1a73e8",e.style.color="#ffffff",e.style.borderColor="#1a73e8",e.style.boxShadow="0 4px 14px rgba(26,115,232,.3)",e.style.transform="translateY(-1px)"),D(),b()}document.getElementById("manualAgent").addEventListener("input",function(){const t=parseInt(this.value);g=t>0?t:null,document.querySelectorAll(".rp-chip").forEach(e=>{e.classList.remove("on"),e.style.background="#ffffff",e.style.color="#1e293b",e.style.borderColor="#b8cce4",e.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",e.style.transform=""}),D(),b()});function D(){const t=document.getElementById("agentPill");g?(t.textContent=`Agent ${g} selected ✓`,t.classList.remove("empty")):(t.textContent="No agent selected",t.classList.add("empty"))}const v=document.getElementById("rateData");let N;v.addEventListener("input",function(){const t=this.value.length;document.getElementById("charCount").textContent=t.toLocaleString()+" character"+(t!==1?"s":""),b(),clearTimeout(N),t>15?N=setTimeout(()=>J(this.value),500):k()});function b(){document.getElementById("submitBtn").disabled=!(g&&v.value.trim().length>10)}function _(t){const e=[],n={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},i=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let c=null,m="IX";for(const f of t.split(`
`)){const r=f.replace(/[*_~`]/g,"").trim();if(!r)continue;const s=r.match(/([A-Z]{3})\s+([A-Z]{3})/);if(s&&r.length<70&&!r.match(/\d{4,6}/)){c=s[1]+"-"+s[2];const a=r.match(i);a&&(m=a[1]);continue}if(c){const a=r.match(i);if(a&&!r.match(/\d{4,6}/)){m=a[1];continue}const u=r.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(u){const h=parseInt(u[3]);h>=1e3&&h<=99999&&e.push({sector:c,date:`2026-${n[u[2].toUpperCase()]}-${u[1].padStart(2,"0")}`,airline:a?a[1]:m,rate:h})}}}return e}function J(t){const e=_(t);if(!e.length){k();return}document.getElementById("prevBox").classList.add("on"),document.getElementById("prevCount").textContent=e.length+" entr"+(e.length===1?"y":"ies");const n=document.getElementById("prevBody");n.innerHTML=e.slice(0,60).map(i=>`
    <tr>
      <td class="td-s">${i.sector}</td>
      <td>${i.date}</td>
      <td class="td-a">${i.airline}</td>
      <td class="td-r">₹${i.rate.toLocaleString()}</td>
    </tr>
  `).join(""),e.length>60&&(n.innerHTML+=`<tr><td colspan="4" style="text-align:center;padding:10px;
      color:var(--z-text-soft);font-size:11px">+ ${e.length-60} more entries</td></tr>`)}function k(){document.getElementById("prevBox").classList.remove("on")}document.getElementById("resetBtn").addEventListener("click",()=>{v.value="",document.getElementById("charCount").textContent="0 characters",k(),b()});document.getElementById("submitBtn").addEventListener("click",async()=>{if(!g||!v.value.trim())return;const t=document.getElementById("submitBtn"),e=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="spin"></div> Processing...';const n=document.getElementById("progBar"),i=document.getElementById("progFill");n.classList.add("on");let c=0;const m=setInterval(()=>{c=Math.min(c+Math.random()*13,85),i.style.width=c+"%"},280),f=_(v.value),r={agent_id:g,raw_text:v.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"},s={id:Date.now(),agent:g,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:f.length,status:"pen"};x.unshift(s),x.length>15&&x.pop(),L(),E();try{const a=await fetch(H,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(clearInterval(m),i.style.width="100%",a.ok)s.status="ok",T(f.length);else throw new Error(`Server error ${a.status}`)}catch(a){clearInterval(m),i.style.width="100%",a.message.startsWith("Server error")?(s.status="err",L(),E(),I("error","Submission Failed",a.message)):(s.status="ok",T(f.length),I("warning","Webhook Not Connected","Data captured locally. Set the WEBHOOK constant to your n8n URL to go live."))}setTimeout(()=>{n.classList.remove("on"),i.style.width="0%",t.innerHTML=e,b()},900)});function T(t){L(),E(),M+=t,C(),I("success","Submitted Successfully",`Agent ${g} — ${t} entries queued for processing.`),setTimeout(()=>{v.value="",document.getElementById("charCount").textContent="0 characters",k(),b()},500)}const U={success:'<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'};function I(t,e,n){const i=document.createElement("div");i.className=`toast ${t}`,i.innerHTML=`
    <div class="ti">${U[t]}</div>
    <div class="tb">
      <div class="tt">${e}</div>
      <div class="tm">${n}</div>
    </div>
    <button class="tx" onclick="this.closest('.rp-toast').remove()">
      <svg viewBox="0 0 12 12" fill="none">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>`,document.getElementById("toastsEl").appendChild(i),setTimeout(()=>i.remove(),7e3)}function L(){localStorage.setItem("zt_hist",JSON.stringify(x))}function E(){const t=document.getElementById("historyWrap");if(!x.length){t.innerHTML=`
      <div class="h-empty">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        No submissions yet
      </div>`;return}t.innerHTML=x.map(e=>`
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
  `).join("")}document.getElementById("clearBtn").addEventListener("click",()=>{x.length&&(x=[],M=0,L(),E(),C())});async function B(){const t=document.getElementById("destination").value,e=document.getElementById("flightList"),n=document.getElementById("loading"),i=document.getElementById("resultsHeader"),c=document.getElementById("locName");e.innerHTML="",n.style.display="block",i.style.display="none";try{const f=await(await fetch("https://n8n.srv1046139.hstgr.cloud/webhook/get-flights",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({destination:t})})).json();if(n.style.display="none",i.style.display="block",c&&(c.innerText=t),!f||f.length===0){e.innerHTML=`<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found for ${t}. Try another destination.</div>`;return}let r="";f.forEach(s=>{let a="00",u="MTH";if(s.date){const l=s.date.split(" ");l.length>=2?(a=l[0],u=l[1]):(a=s.date,u="")}const y=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${s.airline}*
🛫 From: *${s.origin}*
🛬 To: *${s.destination}*
📅 Date: *${s.date}*
⏰ Dep: ${s.departure} | Arr: ${s.arrival}
💵 Price: *${s.price}*

Please confirm availability!`)}`;let d=(s.airline||"").toUpperCase().trim(),p="";const o={INDIGO:"/assets/img/flights/indigo.png","AIR INDIA EXPRESS":"/assets/img/flights/air-india-express.png","AIR ARABIA":"/assets/img/flights/air-arabia.png",FLYNAS:"/assets/img/flights/flynas.png","OMAN AIR":"/assets/img/flights/oman-air.png","SALAM AIR":"/assets/img/flights/salam-air.png","AIR INDIA":"/assets/img/flights/air-india.png",SAUDIA:"/assets/img/flights/saudia.png"};d.includes("EXPRESS")||d==="IX"?p=o["AIR INDIA EXPRESS"]:d.includes("INDIA")||d==="AI"?p=o["AIR INDIA"]:d.includes("SAUD")||d.includes("SOUD")||d==="SV"?p=o.SAUDIA:d.includes("INDIGO")||d==="6E"?p=o.INDIGO:d.includes("ARABIA")||d==="G9"?p=o["AIR ARABIA"]:d.includes("FLYNAS")||d==="XY"?p=o.FLYNAS:d.includes("OMAN")||d==="WY"?p=o["OMAN AIR"]:d.includes("SALAM")||d==="OV"?p=o["SALAM AIR"]:p=`https://flycreativekdr.com:8443/FlyCreativeNG/css2/img/Flight_Logo/${s.airline}.png`,r+=`
        <div class="bg-white rounded-[16px] p-4 md:p-6 mb-4 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative">
          
          <!-- Top Section (Mobile) / Left Section (Desktop) -->
          <div class="flex items-center justify-between w-full md:w-auto md:justify-start gap-4 border-b md:border-b-0 border-border pb-4 md:pb-0">
            <div class="flex items-center gap-4">
              <!-- Logo Box -->
              <div class="w-[60px] h-[60px] md:w-[70px] md:h-[70px] shrink-0 bg-[#f8fafc] rounded-xl border border-border/50 flex items-center justify-center p-2">
                <img src="${p}" onerror="this.style.display='none'" class="max-h-full max-w-full object-contain">
              </div>
              <!-- Airline & Date -->
              <div>
                <div class="text-[12px] md:text-[13px] font-bold text-text-muted uppercase tracking-wider mb-1">${s.airline}</div>
                <div class="text-[18px] md:text-[22px] font-heading font-bold text-navy flex items-baseline gap-1.5 leading-none">
                  ${a} <span class="text-primary text-[14px] md:text-[16px]">${u}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Middle Section: Route & Timing -->
          <div class="flex flex-1 w-full flex-row items-center justify-between lg:justify-center gap-2 md:gap-8 px-2 md:px-6 my-2 md:my-0">
            
            <!-- Origin -->
            <div class="text-left md:text-right flex-1 md:flex-none">
              <div class="text-[20px] md:text-[28px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${s.origin}</div>
              <div class="text-[12px] font-medium text-text-muted uppercase">Dep: ${s.departure}</div>
            </div>
            
            <!-- Connector/Duration -->
            <div class="flex flex-col items-center flex-1 max-w-[140px] px-2 md:px-4 hidden sm:flex">
              <div class="text-[11px] font-bold text-text-muted mb-1.5 bg-[#f8fafc] px-3 py-0.5 rounded-full border border-border">30KG + 7KG</div>
              <div class="w-full relative flex items-center justify-center gap-2">
                <div class="h-[2px] w-full bg-border flex-1 rounded-full"></div>
                <i class="bi bi-airplane text-primary text-[16px] md:text-[20px]"></i>
                <div class="h-[2px] w-full bg-border flex-1 rounded-full"></div>
              </div>
              <div class="text-[11px] font-medium text-text-muted mt-1.5">Direct</div>
            </div>
            
            <!-- Mobile Connector (Only visible on small screens) -->
            <div class="flex sm:hidden flex-col items-center px-2">
              <i class="bi bi-arrow-right text-primary text-[24px]"></i>
              <div class="text-[10px] text-text-muted font-bold mt-1">37KG</div>
            </div>

            <!-- Destination -->
            <div class="text-right flex-1 md:flex-none">
              <div class="text-[20px] md:text-[28px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${s.destination}</div>
              <div class="text-[12px] font-medium text-text-muted uppercase">Arr: ${s.arrival}</div>
            </div>
          </div>

          <!-- Bottom Section (Mobile) / Right Section (Desktop) -->
          <div class="flex sm:flex-row flex-col items-center justify-between md:flex-col md:items-end w-full md:w-auto md:min-w-[180px] border-t md:border-none border-border pt-4 md:pt-0 gap-3 md:gap-0">
            
            <!-- Price and Seats -->
            <div class="flex flex-col items-center sm:items-start md:items-end w-full sm:w-auto">
              <div class="flex items-baseline gap-1">
                <span class="text-[24px] md:text-[32px] font-heading font-bold text-navy leading-none tracking-tight">${s.price}</span>
              </div>
              <div class="text-[11px] md:text-[12px] text-green-600 font-bold mt-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <i class="bi bi-person-check-fill text-[14px]"></i> ${s.seats} Seats Left
              </div>
            </div>
            
            <!-- Booking Button -->
            <a href="${y}" target="_blank" class="w-full sm:w-auto bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[14px] md:text-[15px] px-6 md:px-8 py-3 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center md:mt-4 whitespace-nowrap">
              Book Now
            </a>
          </div>

        </div>
      `}),e.innerHTML=r}catch(m){n.style.display="none",I("error","Connection Error","Failed to fetch live flights. Please ensure the server is active."),console.error(m)}}window.searchFlights=B;
