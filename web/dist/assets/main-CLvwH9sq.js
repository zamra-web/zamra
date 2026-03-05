import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?t.classList.add("scrolled"):t.classList.remove("scrolled")});const e=document.getElementById("mobile-toggle"),s=document.getElementById("nav-menu");e&&e.addEventListener("click",()=>{s.classList.toggle("active");const o=e.querySelector("i");s.classList.contains("active")?o.classList.replace("bi-list","bi-x-lg"):o.classList.replace("bi-x-lg","bi-list")}),document.querySelectorAll(".nav-menu a").forEach(o=>{o.addEventListener("click",()=>{s.classList.contains("active")&&(s.classList.remove("active"),e.querySelector("i").classList.replace("bi-x-lg","bi-list"))})});const c=[{id:"kozhikode",code:"CCJ",name:"Kozhikode"},{id:"kochi",code:"COK",name:"Kochi"},{id:"kannur",code:"CNN",name:"Kannur"},{id:"trivandrum",code:"TRV",name:"Trivandrum"},{id:"mangalore",code:"IXE",name:"Mangalore"}],p=[{id:"jeddah",code:"JED",name:"Jeddah"},{id:"riyadh",code:"RUH",name:"Riyadh"},{id:"dammam",code:"DMM",name:"Dammam"},{id:"doha",code:"DOH",name:"Doha"},{id:"muscat",code:"MCT",name:"Muscat"},{id:"bahrain",code:"BAH",name:"Bahrain"},{id:"kuwait",code:"KWI",name:"Kuwait"},{id:"dubai",code:"DXB",name:"Dubai"},{id:"sharjah",code:"SHJ",name:"Sharjah"},{id:"abudhabi",code:"AUH",name:"Abu Dhabi"},{id:"rasalkhaimah",code:"RKT",name:"Ras Al Khaimah"},{id:"alain",code:"AAN",name:"Al Ain"},{id:"fujairah",code:"FJR",name:"Fujairah"}],u=document.getElementById("flight-grids-container");if(u){const o=(l,R)=>{const E=document.createElement("div");E.className="mb-[50px]",E.innerHTML=`
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> From ${l.name} (${l.code})
        </h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6" id="grid-${l.id}"></div>
      `,u.appendChild(E);const P=E.querySelector(`#grid-${l.id}`);R.forEach(S=>{const $=`${l.code} ${S.code}`,_=`${l.name} → ${S.name}`,w=document.createElement("div");w.className="sector-card bg-white p-[16px_20px] rounded-[12px] border border-border shadow-sm cursor-pointer hover:shadow-md hover:border-primary hover:-translate-y-1 transition-all duration-300 flex items-center justify-between relative overflow-hidden group",w.setAttribute("data-sector",$),w.innerHTML=`<h4 class="text-[15px] font-extrabold text-text-main m-0 flex items-center gap-[12px] z-[2] relative">${l.name} <i class="bi bi-airplane text-primary text-[18px]"></i> ${S.name}</h4>`,w.addEventListener("click",()=>{typeof h=="function"&&h($,_)}),P.appendChild(w)})};c.forEach(l=>{o(l,p)}),p.forEach(l=>{o(l,c)})}const a=document.getElementById("sector-modal"),n=document.getElementById("modal-close"),i=document.getElementById("modal-body"),f=document.getElementById("modal-route");function h(o,l){f.textContent=o.replace(" "," → "),a.classList.add("active"),document.body.style.overflow="hidden",i.innerHTML='<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>',setTimeout(()=>{i.innerHTML=`
                <div class="text-center mb-4">
                    <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${l}</h4>
                    <p class="text-text-muted text-sm">Prices are introductory and subject to availability.</p>
                </div>
                <table class="w-full border-collapse my-[20px] text-[14px] text-left rounded-[10px] overflow-hidden">
                    <thead>
                        <tr class="bg-[#f8fafc] text-text-muted font-bold border-b-2 border-[#e2e8f0]">
                            <th class="p-[14px_15px]">Airlines</th>
                            <th class="p-[14px_15px]">Departure</th>
                            <th class="p-[14px_15px]">Arrival</th>
                            <th class="p-[14px_15px]">Status</th>
                            <th class="p-[14px_15px]">Price Start At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary">
                            <td class="p-[14px_15px]"><strong>Air India Express</strong></td>
                            <td class="p-[14px_15px]">10:45 AM</td>
                            <td class="p-[14px_15px]">01:20 PM</td>
                            <td class="p-[14px_15px]"><span style="color: #16a34a;">Available</span></td>
                            <td class="p-[14px_15px]"><strong>₹12,450</strong></td>
                        </tr>
                        <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary">
                            <td class="p-[14px_15px]"><strong>Saudi Airlines</strong></td>
                            <td class="p-[14px_15px]">04:30 PM</td>
                            <td class="p-[14px_15px]">08:15 PM</td>
                            <td class="p-[14px_15px]"><span style="color: #16a34a;">Available</span></td>
                            <td class="p-[14px_15px]"><strong>₹14,200</strong></td>
                        </tr>
                        <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary">
                            <td class="p-[14px_15px]"><strong>Oman Air</strong></td>
                            <td class="p-[14px_15px]">11:00 PM</td>
                            <td class="p-[14px_15px]">03:45 AM</td>
                            <td class="p-[14px_15px]"><span style="color: #d97706;">Few Seats</span></td>
                            <td class="p-[14px_15px]"><strong>₹13,800</strong></td>
                        </tr>
                    </tbody>
                </table>
            `},800)}function y(){a.classList.remove("active"),document.body.style.overflow=""}n&&n.addEventListener("click",y),a&&a.addEventListener("click",o=>{o.target===a&&y()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&a.classList.contains("active")&&y()}),(()=>{document.querySelector(".partners-slider")})();const m=document.getElementById("live-search-btn");m&&m.addEventListener("click",()=>{typeof B=="function"&&B()})});const H="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",z=[1,2,21,22,23,24,25,28,31,40,42,43,44];let g=null,x=JSON.parse(localStorage.getItem("zt_hist")||"[]"),M=x.reduce((t,e)=>t+(e.rows||0),0);function C(){document.getElementById("statSubs").textContent=x.length,document.getElementById("statEntries").textContent=M}function j(){const t=document.getElementById("chipGrid");!t||t.children.length>0||z.forEach(e=>{const s=document.createElement("div");s.className="rp-chip",s.textContent=e,s.style.cssText="height:48px;display:flex;align-items:center;justify-content:center;border:2px solid #b8cce4;border-radius:10px;font-size:15px;font-weight:700;color:#1e293b;cursor:pointer;background:#ffffff;user-select:none;box-shadow:0 1px 4px rgba(13,31,60,.10);transition:all .16s ease;",s.addEventListener("click",()=>F(e,s)),t.appendChild(s)})}document.addEventListener("DOMContentLoaded",()=>{j(),A(),C()});function F(t,e){g=t,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(s=>{s.classList.remove("on"),s.style.background="#ffffff",s.style.color="#1e293b",s.style.borderColor="#b8cce4",s.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",s.style.transform=""}),e&&(e.classList.add("on"),e.style.background="#1a73e8",e.style.color="#ffffff",e.style.borderColor="#1a73e8",e.style.boxShadow="0 4px 14px rgba(26,115,232,.3)",e.style.transform="translateY(-1px)"),D(),b()}document.getElementById("manualAgent").addEventListener("input",function(){const t=parseInt(this.value);g=t>0?t:null,document.querySelectorAll(".rp-chip").forEach(e=>{e.classList.remove("on"),e.style.background="#ffffff",e.style.color="#1e293b",e.style.borderColor="#b8cce4",e.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",e.style.transform=""}),D(),b()});function D(){const t=document.getElementById("agentPill");g?(t.textContent=`Agent ${g} selected ✓`,t.classList.remove("empty")):(t.textContent="No agent selected",t.classList.add("empty"))}const v=document.getElementById("rateData");let N;v.addEventListener("input",function(){const t=this.value.length;document.getElementById("charCount").textContent=t.toLocaleString()+" character"+(t!==1?"s":""),b(),clearTimeout(N),t>15?N=setTimeout(()=>U(this.value),500):k()});function b(){document.getElementById("submitBtn").disabled=!(g&&v.value.trim().length>10)}function O(t){const e=[],s={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},r=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let c=null,p="IX";for(const u of t.split(`
`)){const a=u.replace(/[*_~`]/g,"").trim();if(!a)continue;const n=a.match(/([A-Z]{3})\s+([A-Z]{3})/);if(n&&a.length<70&&!a.match(/\d{4,6}/)){c=n[1]+"-"+n[2];const i=a.match(r);i&&(p=i[1]);continue}if(c){const i=a.match(r);if(i&&!a.match(/\d{4,6}/)){p=i[1];continue}const f=a.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(f){const h=parseInt(f[3]);h>=1e3&&h<=99999&&e.push({sector:c,date:`2026-${s[f[2].toUpperCase()]}-${f[1].padStart(2,"0")}`,airline:i?i[1]:p,rate:h})}}}return e}function U(t){const e=O(t);if(!e.length){k();return}document.getElementById("prevBox").classList.add("on"),document.getElementById("prevCount").textContent=e.length+" entr"+(e.length===1?"y":"ies");const s=document.getElementById("prevBody");s.innerHTML=e.slice(0,60).map(r=>`
    <tr>
      <td class="td-s">${r.sector}</td>
      <td>${r.date}</td>
      <td class="td-a">${r.airline}</td>
      <td class="td-r">₹${r.rate.toLocaleString()}</td>
    </tr>
  `).join(""),e.length>60&&(s.innerHTML+=`<tr><td colspan="4" style="text-align:center;padding:10px;
      color:var(--z-text-soft);font-size:11px">+ ${e.length-60} more entries</td></tr>`)}function k(){document.getElementById("prevBox").classList.remove("on")}document.getElementById("resetBtn").addEventListener("click",()=>{v.value="",document.getElementById("charCount").textContent="0 characters",k(),b()});document.getElementById("submitBtn").addEventListener("click",async()=>{if(!g||!v.value.trim())return;const t=document.getElementById("submitBtn"),e=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="spin"></div> Processing...';const s=document.getElementById("progBar"),r=document.getElementById("progFill");s.classList.add("on");let c=0;const p=setInterval(()=>{c=Math.min(c+Math.random()*13,85),r.style.width=c+"%"},280),u=O(v.value),a={agent_id:g,raw_text:v.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"},n={id:Date.now(),agent:g,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:u.length,status:"pen"};x.unshift(n),x.length>15&&x.pop(),L(),A();try{const i=await fetch(H,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(clearInterval(p),r.style.width="100%",i.ok)n.status="ok",T(u.length);else throw new Error(`Server error ${i.status}`)}catch(i){clearInterval(p),r.style.width="100%",i.message.startsWith("Server error")?(n.status="err",L(),A(),I("error","Submission Failed",i.message)):(n.status="ok",T(u.length),I("warning","Webhook Not Connected","Data captured locally. Set the WEBHOOK constant to your n8n URL to go live."))}setTimeout(()=>{s.classList.remove("on"),r.style.width="0%",t.innerHTML=e,b()},900)});function T(t){L(),A(),M+=t,C(),I("success","Submitted Successfully",`Agent ${g} — ${t} entries queued for processing.`),setTimeout(()=>{v.value="",document.getElementById("charCount").textContent="0 characters",k(),b()},500)}const G={success:'<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'};function I(t,e,s){const r=document.createElement("div");r.className=`toast ${t}`,r.innerHTML=`
    <div class="ti">${G[t]}</div>
    <div class="tb">
      <div class="tt">${e}</div>
      <div class="tm">${s}</div>
    </div>
    <button class="tx" onclick="this.closest('.rp-toast').remove()">
      <svg viewBox="0 0 12 12" fill="none">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>`,document.getElementById("toastsEl").appendChild(r),setTimeout(()=>r.remove(),7e3)}function L(){localStorage.setItem("zt_hist",JSON.stringify(x))}function A(){const t=document.getElementById("historyWrap");if(!x.length){t.innerHTML=`
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
  `).join("")}document.getElementById("clearBtn").addEventListener("click",()=>{x.length&&(x=[],M=0,L(),A(),C())});async function B(){const t=document.getElementById("destination").value,e=document.getElementById("flightList"),s=document.getElementById("loading"),r=document.getElementById("resultsHeader"),c=document.getElementById("locName");e.innerHTML="",s.style.display="block",r.style.display="none";try{const u=await(await fetch("https://n8n.srv1046139.hstgr.cloud/webhook/get-flights",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({destination:t})})).json();if(s.style.display="none",r.style.display="block",c&&(c.innerText=t),!u||u.length===0){e.innerHTML=`<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found for ${t}. Try another destination.</div>`;return}let a="";u.forEach(n=>{let i="00",f="MTH";if(n.date){const l=n.date.split(" ");l.length>=2?(i=l[0],f=l[1]):(i=n.date,f="")}const y=`https://wa.me/919846606739?text=${encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${n.airline}*
🛫 From: *${n.origin}*
🛬 To: *${n.destination}*
📅 Date: *${n.date}*
⏰ Dep: ${n.departure} | Arr: ${n.arrival}
💵 Price: *${n.price}*

Please confirm availability!`)}`;let d=(n.airline||"").toUpperCase().trim(),m="";const o={INDIGO:"https://zamratravels.com/storage/flights/aOmxqJ17OLg2jUGzvAG8mEkihGaJo0raHn6wmBYS.png","AIR INDIA EXPRESS":"https://zamratravels.com/storage/flights/GzhMpRifybCj24bixwVC57QvUfG0y013MqZWBKPI.png","AIR ARABIA":"https://zamratravels.com/storage/flights/9trVGL2m5llr8dGoc1dNkQthLPMKMjcRVyEa0aLG.png",FLYNAS:"https://zamratravels.com/storage/flights/5uKuXz2Ozld7DKhkObiswnAzAOvZZrFKPSqJN0TO.png","OMAN AIR":"https://zamratravels.com/storage/flights/UwvtahPomKIkhppwUwEy75yQvH67jCFkv2L8McNP.png","SALAM AIR":"https://zamratravels.com/storage/flights/MMG2OqdpwmAQ0Jq0PTz8DbKUSNo2hJXDLU4c3cqE.png","AIR INDIA":"https://zamratravels.com/storage/flights/WwVHAryL03uvrrxZ13kFYRUz73GPSEloClZhuUqL.png",SAUDIA:"https://zamratravels.com/storage/flights/q3RdRv65lOXLdUcBna8i9EwM9OgcF4IDbxL3xuff.png"};d.includes("EXPRESS")||d==="IX"?m=o["AIR INDIA EXPRESS"]:d.includes("INDIA")||d==="AI"?m=o["AIR INDIA"]:d.includes("SAUD")||d.includes("SOUD")||d==="SV"?m=o.SAUDIA:d.includes("INDIGO")||d==="6E"?m=o.INDIGO:d.includes("ARABIA")||d==="G9"?m=o["AIR ARABIA"]:d.includes("FLYNAS")||d==="XY"?m=o.FLYNAS:d.includes("OMAN")||d==="WY"?m=o["OMAN AIR"]:d.includes("SALAM")||d==="OV"?m=o["SALAM AIR"]:m=`https://flycreativekdr.com:8443/FlyCreativeNG/css2/img/Flight_Logo/${n.airline}.png`,a+=`
        <div class="bg-white rounded-[16px] p-4 md:p-6 mb-4 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <!-- Left side: Date & Airline -->
          <div class="flex items-center gap-6 md:gap-8 w-full lg:w-auto">
            <div class="text-center font-heading leading-tight shrink-0 flex flex-col items-center">
              <div class="text-[36px] md:text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${i}</div>
              <div class="text-[20px] font-medium text-navy capitalize">${f}</div>
            </div>
            
            <div class="w-[100px] shrink-0 text-center flex items-center justify-center">
              <img src="${m}" 
                   onerror="this.style.display='none'" 
                   class="max-h-[35px] max-w-full object-contain">
            </div>
          </div>

          <!-- Middle side: Routes & Details -->
          <div class="flex flex-1 w-full flex-col md:flex-row items-start md:items-center justify-between gap-8 lg:px-6">
            
            <!-- Route -->
            <div class="flex items-center gap-6 md:gap-8 mx-auto md:mx-0">
              <div class="text-left w-[100px]">
                <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">From</div>
                <div class="text-[22px] font-medium text-navy uppercase leading-none tracking-tight">${n.origin}</div>
                <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${n.origin.substring(0,3)}</div>
              </div>
              
              <div class="w-[46px] h-[46px] rounded-full bg-[#f8fafc] border border-border flex items-center justify-center shrink-0 shadow-sm relative">
                <i class="bi bi-arrow-right text-primary text-[20px]"></i>
              </div>
              
              <div class="text-left w-[100px]">
                <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">To</div>
                <div class="text-[22px] font-medium text-navy uppercase leading-none tracking-tight">${n.destination}</div>
                <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${n.destination.substring(0,3)}</div>
              </div>
            </div>

            <!-- Times & Info -->
            <div class="flex gap-10 md:gap-14 text-sm mx-auto md:mx-0 mt-4 md:mt-0">
              <div class="text-left">
                <div class="text-[14px] font-bold text-navy mb-3">Flight time</div>
                <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">Dep- ${n.departure}</div>
                <div class="text-[13px] text-text-muted font-medium flex items-center">Arr- ${n.arrival}</div>
              </div>
              <div class="text-left">
                <div class="text-[14px] font-bold text-navy mb-3">Luggage</div>
                <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">30 KG</div>
                <div class="text-[14px] font-bold text-navy flex items-center">+ 7 KG</div>
              </div>
            </div>
            
          </div>

          <!-- Right side: Price & Action -->
          <div class="flex flex-col items-center justify-center w-full lg:w-[180px] mt-4 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-border shrink-0">
            <div class="bg-[#f8fafc] rounded-xl p-4 w-full flex flex-col items-center border border-border/50">
              <span class="text-[28px] md:text-[32px] font-medium text-navy tracking-tight mb-3 leading-none flex items-center">
                ${n.price}
              </span>
              <a href="${y}" target="_blank" class="w-full text-center bg-[#2b2b2b] text-white font-medium text-[15px] px-6 py-2.5 rounded justify-center flex items-center hover:bg-black transition-colors">
                Book Now
              </a>
              <div class="text-[11px] text-green-600 font-bold mt-2.5 text-center uppercase tracking-wide flex items-center gap-1">
                <i class="bi bi-person-check-fill"></i> ${n.seats} Seats Available
              </div>
            </div>
          </div>

        </div>
      `}),e.innerHTML=a}catch(p){s.style.display="none",I("error","Connection Error","Failed to fetch live flights. Please ensure the server is active."),console.error(p)}}window.searchFlights=B;
