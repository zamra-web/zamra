import"./firebase-config-zYKzaodH.js";import{o as Ze,l as Qe}from"./auth-Do_hfv59.js";import{a as Be,d as et,u as Ie,c as qe,e as tt,f as ot,h as nt,i as rt,j as st,g as Le,k as at,l as it,m as lt,n as dt,b as Te,o as ct,p as pt,q as ut,r as mt}from"./db-DN85Zd7Y.js";async function gt(e,t,o,r,s){const i=`Generating ${e} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",i),new Promise(async(c,p)=>{try{let ee=function(f,A,I,T,S){n.beginPath(),n.moveTo(f+S,A),n.lineTo(f+I-S,A),n.arcTo(f+I,A,f+I,A+S,S),n.lineTo(f+I,A+T-S),n.arcTo(f+I,A+T,f+I-S,A+T,S),n.lineTo(f+S,A+T),n.arcTo(f,A+T,f,A+T-S,S),n.lineTo(f,A+S),n.arcTo(f,A,f+S,A,S),n.closePath()},oe=function(f){var fe;const A=f-J;if(A>V){try{q.stop()}catch(H){console.error("Error stopping recorder",H)}return}n.fillStyle="#f8fafc",n.fillRect(0,0,a,d);const I=e==="9x16"?400:300;if(n.fillStyle="#1e293b",n.fillRect(0,0,a,I),$.complete&&$.width>0){n.globalAlpha=.2;const H=Math.max(a/$.width,I/$.height),R=$.width*H,C=$.height*H,D=(a-R)/2,M=(I-C)/2;n.drawImage($,D,M,R,C),n.globalAlpha=1}const T=n.createLinearGradient(0,0,0,I);T.addColorStop(0,"#1e293b"),T.addColorStop(1,"transparent"),n.fillStyle=T,n.globalAlpha=.8,n.fillRect(0,0,a,I),n.globalAlpha=1,n.textAlign="center",n.textBaseline="middle";const S=n.createLinearGradient(0,0,a,0);S.addColorStop(0,"#2563eb"),S.addColorStop(.5,"#60a5fa"),S.addColorStop(1,"#1558c0"),n.fillStyle=S,n.fillRect(0,0,a,16);const ge=200,_=40,ie=60;n.fillStyle="rgba(37, 99, 235, 0.4)",ee(a/2-ge/2,ie,ge,_,20),n.fill(),n.strokeStyle="rgba(37, 99, 235, 0.6)",n.lineWidth=1,n.stroke(),n.fillStyle="#bfdbfe",n.font="bold 16px Arial, sans-serif",n.fillText("EXCLUSIVE DEALS",a/2,ie+_/2),n.fillStyle="#ffffff",n.font="900 "+(e==="16x9"?"70px":"56px")+" Arial, sans-serif",n.fillText(`${l} → ${b}`,a/2,ie+80),n.fillStyle="#dbeafe",n.font="700 24px Arial, sans-serif",n.fillText("SPECIAL FARES AVAILABLE NOW",a/2,ie+140);const ne=I+60,G=90,U=e==="9x16"?40:e==="1x1"?80:160,W=a-U*2;n.fillStyle="#64748b",n.font="bold 18px Arial, sans-serif",n.textAlign="left",n.fillText("DATE",U+20,ne-20),n.textAlign="center",n.fillText("AIRLINE",U+W*.35,ne-20),n.fillText("TIME",U+W*.65,ne-20),n.textAlign="right",n.fillText("FARE",U+W-20,ne-20);for(let H=0;H<y.length;H++){const R=y[H],C=1e3+H*800;if(A<C)continue;const M=Math.min(1,(A-C)/500),de=20*(1-M),P=ne+H*G+de;n.globalAlpha=M,H%2===0&&(n.fillStyle="#ffffff",ee(U,P,W,G-10,12),n.fill()),n.fillStyle="#0f172a",n.textBaseline="middle";const Ce=R.flightDate instanceof Date?R.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():R.flightDate;n.textAlign="left",n.font="900 26px Arial, sans-serif",n.fillText(Ce,U+20,P+G/2-5);const xe=U+W*.35,ce=x[R.airlineId];if(ce&&ce.width>0){const re=Math.min(100,ce.width),Ue=40;n.drawImage(ce,xe-re/2,P+G/2-5-Ue/2,re,Ue)}else{n.font="700 20px Arial, sans-serif",n.textAlign="center";const re=((fe=w[R.airlineId])==null?void 0:fe.name)||R.airlineId||"—";n.fillText(re,xe,P+G/2-5)}let pe=R.flightTime||"—";if(pe.includes("-")){const re=pe.split("-");pe=`${re[0].trim()} - ${re[1].trim()}`}n.font="800 22px Arial, sans-serif",n.textAlign="center",n.fillText(pe,U+W*.65,P+G/2-5);const Ae=`₹${(R.finalRate||0).toLocaleString()}`;n.font="900 26px Arial, sans-serif",n.textAlign="right";const Xe=n.measureText(Ae).width,Me=U+W-20,Ne=Xe+40,He=50;n.fillStyle="#0f172a",ee(Me-Ne,P+G/2-5-He/2,Ne,He,12),n.fill(),n.fillStyle="#ffffff",n.fillText(Ae,Me-20,P+G/2-5),n.globalAlpha=1}const le=1e3+y.length*800+500;if(A>le){const H=Math.min(1,(A-le)/500);n.globalAlpha=H;const R=100,C=d-R+20*(1-H);n.fillStyle="#ffffff",n.fillRect(0,d-R,a,R),n.fillRect(0,C,a,R),n.fillStyle="#f1f5f9",n.fillRect(0,d-R,a,2),m.complete&&m.width>0&&n.drawImage(m,U,d-R/2-24,48,48),n.fillStyle="#1e293b",n.font="900 24px Arial, sans-serif",n.textAlign="left",n.textBaseline="middle",n.fillText("Zamra Travels",U+64,d-R/2),n.font="700 20px Arial, sans-serif",n.textAlign="right",n.fillText("zamratravels.com  |  +91 98765 43210",a-U,d-R/2),n.globalAlpha=1}requestAnimationFrame(oe)},a,d;if(e==="1x1")a=1080,d=1080;else if(e==="9x16")a=1080,d=1920;else if(e==="16x9")a=1920,d=1080;else throw new Error("Invalid ratio selected");const u=document.createElement("canvas");u.width=a,u.height=d;const n=u.getContext("2d");n.imageSmoothingEnabled=!0;const h=r.find(f=>f.id===o),l=h?(h.sectorFrom||"DEP").toUpperCase():"DEP",b=h?(h.sectorTo||"ARR").toUpperCase():"ARR",y=[...t].sort((f,A)=>{let I=f.flightDate,T=A.flightDate;return I instanceof Date&&(I=I.getTime()),T instanceof Date&&(T=T.getTime()),I-T}).slice(0,10),w={};s.forEach(f=>{f.id&&(w[f.id]=f),f.code&&(w[f.code]=f),f.name&&(w[f.name]=f)});async function g(f){if(!f)return null;try{const A=await fetch(f);if(!A.ok)return null;const I=await A.blob(),T=URL.createObjectURL(I);return new Promise((S,ge)=>{const _=new Image;_.onload=()=>S(_),_.onerror=()=>S(null),_.src=T})}catch{return null}}const $=new Image;await new Promise(f=>{$.onload=f,$.onerror=f,$.src="/assets/img/hero-bg.webp"});const m=new Image;await new Promise(f=>{m.onload=f,m.onerror=f,m.src="/assets/img/logo.webp"});const x={},v=[...new Set(y.map(f=>f.airlineId))].map(f=>w[f]).filter(f=>f==null?void 0:f.logoUrl);await Promise.all(v.map(async f=>{const A=await g(f.logoUrl);A&&(x[f.id]=A)}));const B=u.captureStream(30);let N="video/mp4";MediaRecorder.isTypeSupported(N)||(N="video/webm; codecs=h264",MediaRecorder.isTypeSupported(N)||(N="video/webm"));const q=new MediaRecorder(B,{mimeType:N}),z=[];q.ondataavailable=f=>{f.data&&f.data.size>0&&z.push(f.data)},q.start(100);const V=1e4+y.length*1500,J=performance.now();requestAnimationFrame(oe),q.onstop=()=>{const f=new Blob(z,{type:N}),A=URL.createObjectURL(f),I=document.createElement("a");I.href=A,I.download=`zamra-video-${e}-${Date.now()}.mp4`,I.style.display="none",document.body.appendChild(I),I.click(),setTimeout(()=>{document.body.removeChild(I),URL.revokeObjectURL(A)},100),window.toast&&window.toast("success","Video Generated",`Your ${e} video has been downloaded!`),c()},q.onerror=f=>{console.error("Recorder Error:",f),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),p(f)}}catch(a){console.error(a),window.toast&&window.toast("error","Generation Failed",a.message),p(a)}})}let O=[],F=[],j=[],L=[];function ue(e){return e==null?e:String(e).replace(/damamm/gi,t=>t===t.toUpperCase()?"DAMMAM":t===t.toLowerCase()?"dammam":"Dammam")}function _e(e={}){return{...e,sectorFrom:ue(e.sectorFrom||""),sectorTo:ue(e.sectorTo||""),sectorCode:ue(e.sectorCode||"")}}function Re(e=[]){return e.map(t=>_e(t))}let Y={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},reportFares:{key:"flightDate",asc:!0}},ve={sectors:"",airlines:""},se={agents:10,sectors:10,airlines:10,reportFares:20},k={agents:1,sectors:1,airlines:1,reportFares:1};function Fe(e,t){var c;let o=e;const r=(c=ve[t])==null?void 0:c.toLowerCase();r&&t==="agents"?o=o.filter(p=>(p.name||"").toLowerCase().includes(r)||(p.email||"").toLowerCase().includes(r)||(p.contactPhone||"").toLowerCase().includes(r)||(p.id||"").toLowerCase().includes(r)):r&&t==="sectors"?o=o.filter(p=>(p.sectorFrom||"").toLowerCase().includes(r)||(p.sectorTo||"").toLowerCase().includes(r)||(p.sectorCode||"").toLowerCase().includes(r)):r&&t==="airlines"&&(o=o.filter(p=>(p.name||"").toLowerCase().includes(r)||(p.code||"").toLowerCase().includes(r)));const{key:s,asc:i}=Y[t];return s&&(o=[...o].sort((p,a)=>{let d=p[s],u=a[s];if(d instanceof Date&&(d=d.getTime()),u instanceof Date&&(u=u.getTime()),s==="id"){const n=parseInt(d),h=parseInt(u);if(!isNaN(n)&&!isNaN(h))return i?n-h:h-n}return typeof d=="string"&&(d=d.toLowerCase()),typeof u=="string"&&(u=u.toLowerCase()),d<u?i?-1:1:d>u?i?1:-1:0})),o}function we(e){document.querySelectorAll(`th[data-sort-tab="${e}"] i`).forEach(o=>{o.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const t=document.querySelector(`th[data-sort-tab="${e}"][data-sort-key="${Y[e].key}"]`);if(t){const o=t.querySelector("i");o&&(o.className=`bi bi-arrow-${Y[e].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",e=>{const t=e.target.closest("th[data-sort-tab]");if(!t)return;const o=t.dataset.sortTab,r=t.dataset.sortKey;Y[o].key===r?Y[o].asc=!Y[o].asc:(Y[o].key=r,Y[o].asc=!0),o==="agents"?K(!1):o==="sectors"?X(!1):o==="airlines"?ae(!1):o==="reportFares"&&L.length&&te(L)});document.documentElement.style.visibility="hidden";Ze(async e=>{if(!e){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const t=document.getElementById("admin-user-name");t&&(t.textContent=e.email.split("@")[0]),await ft(),Ht(),await ze()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("admin-logout-btn");e&&e.addEventListener("click",async()=>{(await Qe()).success&&(window.location.href="/login.html")}),xt(),bt(),Nt()});async function ft(){try{const[e,t,o]=await Promise.all([qe(),Le(),Te()]);O=e,F=Re(t),j=o}catch(e){console.error("loadGlobalData error:",e)}}function bt(){const e=document.querySelectorAll(".nav-link"),t=document.querySelectorAll(".tab-content"),o=document.getElementById("page-title");e.forEach(r=>{r.addEventListener("click",async s=>{var p;s.preventDefault(),e.forEach(a=>{a.classList.remove("active","text-primary"),a.classList.add("text-gray-500")}),r.classList.remove("text-gray-500"),r.classList.add("active","text-primary");const i=r.getAttribute("data-tab"),c=r.getAttribute("data-title");t.forEach(a=>a.classList.remove("active")),(p=document.getElementById(i))==null||p.classList.add("active"),o&&c&&(o.textContent=c),await ze()})})}async function ze(){const e=document.querySelector(".tab-content.active");if(!e)return;const t=e.id;t==="agents-tab"?await K():t==="sectors-tab"?await X():t==="flights-tab"?await ae():t==="dashboard-tab"?await ht():t==="reports-tab"?await kt():t==="eticket-tab"&&await Ot()}function xt(){const e=document.getElementById("admin-modal"),t=document.getElementById("modal-close-btn");t&&t.addEventListener("click",()=>e.close()),e==null||e.addEventListener("click",o=>{o.target===e&&e.close()})}function Ee(e,t){const o=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=e,document.getElementById("modal-body").innerHTML=t,o.showModal()}async function ht(){var r,s,i,c,p;if(!document.getElementById("dashboard-tab"))return;const t=document.getElementById("poster-sector-sel");t&&t.options.length<=1&&F.forEach(a=>{const d=new Option(a.sectorCode,a.id);t.appendChild(d)});const o=document.getElementById("poster-generate-btn");o&&!o.dataset.wired&&(o.dataset.wired="1",o.addEventListener("click",async()=>{const a=document.getElementById("poster-start-date"),d=document.getElementById("poster-end-date"),u=t==null?void 0:t.value,n=(a==null?void 0:a.value)||null,h=(d==null?void 0:d.value)||null;if(!u){E("warning","Validation Error","Please select a sector to generate the poster.");return}o.disabled=!0,o.textContent="Generating…";try{const l=await Be({sectorId:u,startDate:n,endDate:h,includeHidden:!1});if(!l||!l.length){E("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await yt(l,u)}catch(l){E("error","Generation Failed",l.message)}finally{o.disabled=!1,o.textContent="Generate Poster"}}),(r=document.getElementById("poster-download-jpg"))==null||r.addEventListener("click",()=>je("jpeg")),(s=document.getElementById("poster-download-pdf"))==null||s.addEventListener("click",()=>je("pdf")),(i=document.getElementById("poster-download-vid-1x1"))==null||i.addEventListener("click",()=>Se("1x1")),(c=document.getElementById("poster-download-vid-9x16"))==null||c.addEventListener("click",()=>Se("9x16")),(p=document.getElementById("poster-download-vid-16x9"))==null||p.addEventListener("click",()=>Se("16x9")))}async function Se(e){const t=document.getElementById("poster-sector-sel"),o=document.getElementById("poster-start-date"),r=document.getElementById("poster-end-date"),s=t==null?void 0:t.value,i=(o==null?void 0:o.value)||null,c=(r==null?void 0:r.value)||null;if(!s){E("warning","Validation Error","Please select a sector to generate the poster.");return}try{const p=await Be({sectorId:s,startDate:i,endDate:c,includeHidden:!1});if(!p||!p.length){E("warning","No Fares","No live fares found for the selected sector and dates.");return}await gt(e,p,s,F,j)}catch(p){console.error("Video generation failed",p)}}async function yt(e,t){const o=document.getElementById("poster-preview-container"),r=document.getElementById("poster-fares-tbody"),s=document.getElementById("poster-sector-title");if(!o||!r||!s)return;const i=F.find(l=>l.id===t),c=i?(i.sectorFrom||"DEP").toUpperCase():"DEP",p=i?(i.sectorTo||"ARR").toUpperCase():"ARR";s.innerHTML=`${c} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${p}`;const a=[...e].sort((l,b)=>{let y=l.flightDate,w=b.flightDate;return y instanceof Date&&(y=y.getTime()),w instanceof Date&&(w=w.getTime()),y-w}).slice(0,10),d={};j.forEach(l=>{l.id&&(d[l.id]=l),l.code&&(d[l.code]=l),l.name&&(d[l.name]=l)});async function u(l){try{const b=await fetch(l);if(!b.ok)return null;const y=await b.blob();return URL.createObjectURL(y)}catch{return null}}const n=[...new Set(a.map(l=>l.airlineId))].map(l=>d[l]).filter(l=>l==null?void 0:l.logoUrl),h={};await Promise.all(n.map(async l=>{const b=await u(l.logoUrl);b&&(h[l.id]=b)})),r.innerHTML=a.map((l,b)=>{const y=l.flightDate instanceof Date?l.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():l.flightDate,w=d[l.airlineId],g=b%2===0?"#ffffff":"#f8fafc",$=h[l.airlineId]||null,m=$?`<img src="${$}" style="height:40px;max-width:100px;object-fit:contain;display:block;margin:0 auto;" alt="${(w==null?void 0:w.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:15px;white-space:nowrap;">${(w==null?void 0:w.name)||l.airlineId||"—"}</span>`;let x='<span style="color:#94a3b8;font-size:14px;">—</span>';if(l.flightTime){const v=l.flightTime.split("-").map(B=>B.trim());v.length>=2?x=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${v[0]} - ${v[1]}</span>`:x=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${l.flightTime}</span>`}return`
      <tr style="background-color:${g};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 12px;font-weight:900;color:#0f172a;font-size:22px;white-space:nowrap;">${y}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${m}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${x}</td>
        <td style="padding:16px 12px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:8px 18px;border-radius:12px;font-weight:900;font-size:22px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            &#8377;${(l.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),o.classList.remove("hidden"),o.classList.add("flex")}function Ge(e){if(!e||e.nodeType!==1)return;const t=window.getComputedStyle(e),o=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const r of o){const s=t.getPropertyValue(r);if(s&&!s.startsWith("rgb")&&!s.startsWith("#")&&s!=="transparent"&&s!=="initial")try{e.style[r]=s}catch{}}for(const r of e.children)Ge(r)}async function je(e){const t=document.getElementById("poster-render-frame");if(!t)return;const o=document.getElementById("poster-download-jpg"),r=document.getElementById("poster-download-pdf");o&&(o.disabled=!0),r&&(r.disabled=!0);const s=t.style.transform;t.style.transform="none",E("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(t.querySelectorAll("img")).map(p=>p.complete?Promise.resolve():new Promise(a=>{p.onload=a,p.onerror=a})));const i=await html2canvas(t,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:p=>{const a=p.getElementById("poster-render-frame");a&&Ge(a)}});t.style.transform=s;const c=i.toDataURL("image/jpeg",.95);if(e==="jpeg"){const p=document.createElement("a");p.download=`zamra-poster-${Date.now()}.jpg`,p.href=c,p.click(),E("success","Downloaded!","JPEG poster saved successfully.")}else if(e==="pdf"){const p=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!p)throw new Error("jsPDF library not loaded.");const a=96/25.4,d=i.width/2/a,u=i.height/2/a,n=new p({orientation:d>u?"landscape":"portrait",unit:"mm",format:[d,u]});n.addImage(c,"JPEG",0,0,d,u),n.save(`zamra-poster-${Date.now()}.pdf`),E("success","Downloaded!","PDF poster saved successfully.")}}catch(i){console.error("Poster export error:",i),t.style.transform=s,E("error","Export Failed",i.message||"There was an error generating the export.")}finally{o&&(o.disabled=!1),r&&(r.disabled=!1)}}function te(e){const t=document.getElementById("report-fares-results");if(!t)return;if(!e||!e.length){t.innerHTML=`<div class="text-center text-text-muted py-14 px-4">
      <div class="inline-flex flex-col items-center gap-3 opacity-50">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <i class="bi bi-inbox text-3xl text-slate-400"></i>
        </div>
        <p class="font-semibold text-[14px]">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const o=Object.fromEntries(O.map(l=>[l.id,l.name])),r=Object.fromEntries(F.map(l=>[l.id,l.sectorCode])),s=Object.fromEntries(j.map(l=>[l.id,l.code])),{key:i,asc:c}=Y.reportFares,p=[...e].sort((l,b)=>{let y=l[i],w=b[i];return y instanceof Date&&(y=y.getTime()),w instanceof Date&&(w=w.getTime()),typeof y=="string"&&(y=y.toLowerCase()),typeof w=="string"&&(w=w.toLowerCase()),y<w?c?-1:1:y>w?c?1:-1:0}),a=se.reportFares,d=Math.max(1,Math.ceil(e.length/a));k.reportFares>d&&(k.reportFares=d);const u=(k.reportFares-1)*a,n=p.slice(u,u+a),h=(l,b)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${l}">${b} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;t.innerHTML=`
    <div class="admin-table-container overflow-x-auto w-full rounded-none border-0 shadow-none">
      <table class="admin-table w-full text-sm">
        <thead><tr>
          ${h("flightDate","Date")}
          ${h("flightTime","Time")}
          ${h("sectorId","Sector")}
          ${h("airlineId","Airline")}
          ${h("agentId","Agent")}
          ${h("specialRate","SP Rate (₹)")}
          ${h("finalRate","Rate (₹)")}
          ${h("commission","Comm (₹)")}
          ${h("baggage","Bag")}
          ${h("extraBaggage","Ex.Bag")}
          ${h("isHidden","Status")}
          <th class="whitespace-nowrap">Actions</th>
        </tr></thead>
        <tbody>
          ${n.map((l,b)=>{const y=l.flightDate instanceof Date?l.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):l.flightDate||"—";return`<tr class="${b%2===1?"bg-slate-50/60":""} hover:bg-blue-50/40 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${y}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${l.flightTime||"—"}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${r[l.sectorId]||l.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${s[l.airlineId]||l.airlineId}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${o[l.agentId]||l.agentId}</td>
              <td class="whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-text-muted text-[13px] mr-0.5">₹</span>
                  <input type="number" 
                    value="${l.specialRate||0}"
                    onblur="window.__updateFareRate('${l.id}', 'specialRate', this.value)"
                    class="bg-transparent border border-transparent hover:border-slate-200 focus:border-primary/50 focus:bg-white rounded px-1 text-[13px] text-text-muted outline-none w-20 transition-colors shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-navy font-black text-[14px] mr-0.5">₹</span>
                  <input type="number" 
                    value="${l.finalRate||0}"
                    onblur="window.__updateFareRate('${l.id}', 'finalRate', this.value)"
                    class="bg-transparent border border-transparent hover:border-slate-200 focus:border-primary/50 focus:bg-white rounded px-1 font-black text-navy text-[14px] outline-none w-20 transition-colors shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </td>
              <td class="whitespace-nowrap text-[12px] text-text-muted" id="comm-${l.id}">₹${(l.commission||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px]">${l.baggage?l.baggage+" kg":"—"}</td>
              <td class="whitespace-nowrap text-[12px]">${l.extraBaggage?l.extraBaggage+" kg":"—"}</td>
              <td class="whitespace-nowrap">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${l.isHidden?"bg-red-100 text-red-600":"bg-green-100 text-green-700"}">
                  ${l.isHidden?"● Hidden":"● Live"}
                </span>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  <button onclick="window.__openEditFareModal('${l.id}')"
                    class="bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-blue-500 hover:text-white transition-colors">Edit</button>
                  <button onclick="window.__toggleFare('${l.id}', ${!l.isHidden})"
                    class="${l.isHidden?"bg-green-50 text-green-700 border-green-200 hover:bg-green-500":"bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-500"} border px-2.5 py-1 rounded-lg text-[11px] font-bold hover:text-white transition-colors">
                    ${l.isHidden?"Show":"Hide"}
                  </button>
                  <button onclick="window.__deleteFare('${l.id}')"
                    class="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-red-500 hover:text-white transition-colors">Del</button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,$e("reportFares",e.length,d,u,a),window.__deleteFare=async l=>{if(confirm("Delete this fare?"))try{await et(l),L=L.filter(b=>b.id!==l),E("success","Deleted","Fare removed."),te(L)}catch(b){E("error","Error",b.message)}},window.__toggleFare=async(l,b)=>{try{await Ie(l,{isHidden:b}),L=L.map(y=>y.id===l?{...y,isHidden:b}:y),E("success","Updated",`Fare ${b?"hidden":"shown"}.`),te(L)}catch(y){E("error","Error",y.message)}},window.__updateFareRate=async(l,b,y)=>{const w=parseFloat(y)||0,g=L.find($=>$.id===l);if(!(!g||g[b]===w))try{const $={[b]:w};b==="specialRate"?($.commission=Math.max(0,g.finalRate-w),g.commission=$.commission):b==="finalRate"&&($.commission=Math.max(0,w-g.specialRate),g.commission=$.commission),await Ie(l,$),g[b]=w,E("success","Rate Updated","Fare successfully updated."),te(L)}catch($){E("error","Update Failed",$.message),te(L)}},we("reportFares"),window.__openEditFareModal=l=>{const b=L.find(g=>g.id===l);if(!b)return;let y="";if(b.flightDate instanceof Date){const g=b.flightDate.getTimezoneOffset();y=new Date(b.flightDate.getTime()-g*60*1e3).toISOString().split("T")[0]}else typeof b.flightDate=="string"&&(y=b.flightDate.split("T")[0]);const w=`
      <form id="edit-fare-form" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Date</label>
            <input type="date" id="ef-date" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${y}" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Time</label>
            <input type="text" id="ef-time" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. 04:05 - 11:10" value="${b.flightTime||""}">
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Sector</label>
            <select id="ef-sector" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required>
              ${F.map(g=>`<option value="${g.id}" ${g.id===b.sectorId?"selected":""}>${g.sectorCode}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Airline</label>
            <select id="ef-airline" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required>
              <option value="">-- None --</option>
              ${j.map(g=>`<option value="${g.id}" ${g.id===b.airlineId?"selected":""}>${g.code}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Agent</label>
            <select id="ef-agent" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required>
              <option value="">-- None --</option>
              ${O.map(g=>`<option value="${g.id}" ${g.id===b.agentId?"selected":""}>${g.name}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">SP Rate (₹)</label>
            <input type="number" id="ef-sprate" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${b.specialRate||0}" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Final Rate (₹)</label>
            <input type="number" id="ef-finalrate" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${b.finalRate||0}" required>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Baggage (kg)</label>
            <input type="number" id="ef-bag" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${b.baggage||0}">
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Ex. Baggage (kg)</label>
            <input type="number" id="ef-exbag" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${b.extraBaggage||0}">
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Status</label>
            <select id="ef-status" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
              <option value="live" ${b.isHidden?"":"selected"}>Live</option>
              <option value="hidden" ${b.isHidden?"selected":""}>Hidden</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onclick="document.getElementById('admin-modal').close()" class="px-5 py-2.5 rounded-xl font-bold text-sm text-text-muted bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg shadow-primary/20">Save Changes</button>
        </div>
      </form>
    `;Ee("Edit Fare",w),document.getElementById("edit-fare-form").onsubmit=async g=>{g.preventDefault();const $=g.target.querySelector('button[type="submit"]'),m=$.textContent;$.disabled=!0,$.textContent="Saving...";try{let x=document.getElementById("ef-date").value;const v={flightDate:x?new Date(x+"T00:00:00"):null,flightTime:document.getElementById("ef-time").value.trim(),sectorId:document.getElementById("ef-sector").value,airlineId:document.getElementById("ef-airline").value,agentId:document.getElementById("ef-agent").value,specialRate:parseFloat(document.getElementById("ef-sprate").value)||0,finalRate:parseFloat(document.getElementById("ef-finalrate").value)||0,baggage:parseFloat(document.getElementById("ef-bag").value)||0,extraBaggage:parseFloat(document.getElementById("ef-exbag").value)||0,isHidden:document.getElementById("ef-status").value==="hidden"};v.commission=Math.max(0,v.finalRate-v.specialRate),await Ie(l,v);const B=L.findIndex(N=>N.id===l);B!==-1&&(L[B]={...L[B],...v}),document.getElementById("admin-modal").close(),E("success","Updated","Fare updated successfully."),te(L)}catch(x){E("error","Error",x.message),$.disabled=!1,$.textContent=m}}}}async function K(e=!0){e&&(O=await qe(),k.agents=1);const t=document.querySelector("#agents-tab .admin-table tbody");if(!t)return;const o=document.getElementById("agents-search"),r=document.getElementById("agents-limit");o&&!o.dataset.wired&&(o.dataset.wired="1",r&&(r.dataset.wired="1"),o.addEventListener("input",u=>{ve.agents=u.target.value,k.agents=1,K(!1)}),r&&r.addEventListener("change",u=>{se.agents=parseInt(u.target.value),k.agents=1,K(!1)}));const s=Fe(O,"agents"),i=se.agents,c=Math.max(1,Math.ceil(s.length/i));k.agents>c&&(k.agents=c);const p=(k.agents-1)*i,a=s.slice(p,p+i);t.innerHTML=a.length?a.map(u=>vt(u)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',$e("agents",s.length,c,p,i),delete t.dataset.actionsWired,wt(),Et(),$t();const d=document.getElementById("agents-add-btn");d&&!d.dataset.wired&&(d.dataset.wired="1",d.addEventListener("click",()=>We(null))),we("agents")}function vt(e){const t=e.isActive!==!1?'<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700">Active</span>':'<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-600">Hidden</span>',o=e.commission!==void 0?`₹${Number(e.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id||"—"}</td>
    <td class="font-semibold">${e.name}</td>
    <td>${e.email||"—"}</td>
    <td>${e.contactPhone||"—"}</td>
    <td class="font-semibold text-navy">${o}</td>
    <td>${t}</td>
    <td class="flex gap-1 flex-wrap">
      <button data-action="edit-agent" data-id="${e.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-agent" data-id="${e.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
      <button data-action="toggle-agent" data-id="${e.id}" data-active="${e.isActive!==!1}"
        class="px-3 py-1 rounded text-[12px] font-bold ${e.isActive!==!1?"bg-slate-400 text-white hover:bg-slate-500":"bg-green-500 text-white hover:bg-green-600"}">
        ${e.isActive!==!1?"Hide Fares":"Show Fares"}</button>
    </td>
  </tr>`}function wt(){const e=document.querySelector("#agents-tab .admin-table tbody");!e||e.dataset.actionsWired||(e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const o=t.target.closest("[data-action]");if(!o)return;const r=o.dataset.action,s=o.dataset.id,i=O.find(c=>c.id===s);if(r==="edit-agent"&&We(i),r==="delete-agent"){if(!confirm(`Delete agent "${i==null?void 0:i.name}"? This does NOT delete their fares.`))return;try{await tt(s),E("success","Deleted",`Agent "${i==null?void 0:i.name}" removed.`),await K()}catch(c){E("error","Error",c.message)}}if(r==="toggle-agent"){const p=!(o.dataset.active==="true");o.disabled=!0,o.textContent="Working…";try{const a=await ot(s,p);E("success",p?"Agent Shown":"Agent Hidden",a.message),await K()}catch(a){E("error","Toggle Failed",a.message),await K()}}}))}function $e(e,t,o,r,s){const i=document.getElementById(`${e}-pagination-footer`);if(!i)return;const c=Math.min(r+s,t),p=k[e];i.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${t?r+1:0} to ${c} of ${t} entries</span>
      <div class="flex items-center gap-1 ml-4 shadow-[var(--shadow-premium-soft)] rounded">
        <button data-pg-action="prev" class="px-3 py-1.5 border border-border rounded-l bg-white text-sm font-semibold hover:bg-slate-50 hover:text-navy disabled:opacity-40 premium-transition" ${p<=1?"disabled":""}>Previous</button>
        ${Array.from({length:o},(a,d)=>d+1).map(a=>`<button data-pg-action="goto" data-pg="${a}" class="px-3 py-1.5 border-y border-r border-border text-sm font-bold bg-white premium-transition ${a===p?"text-primary bg-primary-light shadow-inner border-primary/20 relative z-10":"text-text-mid hover:bg-slate-50 hover:text-navy"}">${a}</button>`).join("")}
        <button data-pg-action="next" class="px-3 py-1.5 border-y border-r border-border rounded-r bg-white text-sm font-semibold hover:bg-slate-50 hover:text-navy disabled:opacity-40 premium-transition" ${p>=o?"disabled":""}>Next</button>
      </div>
    </div>`,i.dataset.wired||(i.dataset.wired="1",i.addEventListener("click",a=>{const d=a.target.closest("[data-pg-action]");if(!d||d.disabled)return;const u=d.dataset.pgAction;u==="prev"?k[e]=Math.max(1,k[e]-1):u==="next"?k[e]++:u==="goto"&&(k[e]=parseInt(d.dataset.pg)),e==="agents"?K(!1):e==="sectors"?X(!1):e==="airlines"?ae(!1):e==="reportFares"&&te(L)}))}function We(e){var o,r;const t=!!e;Ee(t?"Edit Agent":"Add New Agent",`
    <form id="agent-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Agent ID *</label>
        <input name="id" required value="${(e==null?void 0:e.id)||""}" placeholder="e.g. AGENT1"
          ${t?'readonly class="w-full bg-slate-100 border border-border rounded-lg h-11 px-3 text-sm focus:outline-none cursor-not-allowed text-slate-500"':'class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"'}>
        ${t?'<p class="text-[11px] text-text-soft mt-1">Agent ID cannot be changed after creation.</p>':""}
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Name *</label>
        <input name="name" required value="${(e==null?void 0:e.name)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Email</label>
        <input name="email" type="email" value="${(e==null?void 0:e.email)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Phone</label>
        <input name="contactPhone" value="${(e==null?void 0:e.contactPhone)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Commission (₹) *</label>
        <input name="commission" type="number" min="0" required value="${(e==null?void 0:e.commission)!==void 0?e.commission:500}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          placeholder="e.g. 500">
        <p class="text-[11px] text-text-soft mt-1">This commission is auto-applied to all fares ingested for this agent.</p>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit"
          class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 transition-all text-sm">
          ${t?"Save Changes":"Add Agent"}
        </button>
        <button type="button" id="modal-cancel"
          class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`),(o=document.getElementById("modal-cancel"))==null||o.addEventListener("click",()=>document.getElementById("admin-modal").close()),(r=document.getElementById("agent-form"))==null||r.addEventListener("submit",async s=>{s.preventDefault();const i=new FormData(s.target),c=Object.fromEntries(i.entries()),p=s.target.querySelector("[type=submit]");p.disabled=!0,p.textContent="Saving…";try{t?(await nt(e.id,c),E("success","Updated",`Agent "${c.name}" updated.`)):(await rt(c),E("success","Added",`Agent "${c.name}" added.`)),document.getElementById("admin-modal").close(),await K()}catch(a){E("error","Save Failed",a.message),p.disabled=!1,p.textContent=t?"Save Changes":"Add Agent"}})}function Et(){const e=document.getElementById("agents-bulk-delete-btn");!e||e.dataset.wired||(e.dataset.wired="1",e.addEventListener("click",async()=>{const t=document.getElementById("agents-bulk-agent-sel"),o=document.getElementById("agents-bulk-sector-sel"),r=document.getElementById("agents-bulk-start"),s=document.getElementById("agents-bulk-end"),i=(t==null?void 0:t.value)||null,c=(o==null?void 0:o.value)||null,p=(r==null?void 0:r.value)||null,a=(s==null?void 0:s.value)||null;if(!(i&&i!=="all"||c&&c!=="all"||p||a)){E("warning","No Filter","Select at least an agent, a sector, or a date range before deleting.");return}const u=[];if(i&&i!=="all"&&u.push(`Agent: ${t.options[t.selectedIndex].text}`),c&&c!=="all"&&u.push(`Sector: ${o.options[o.selectedIndex].text}`),p&&u.push(`from ${p}`),a&&u.push(`to ${a}`),!!confirm(`Delete ALL matching fares?
${u.join(" · ")}

This cannot be undone.`)){e.disabled=!0,e.textContent="Deleting…";try{const n=await st(i,p,a,c);E("success","Bulk Delete Complete",n.message)}catch(n){E("error","Bulk Delete Failed",n.message)}finally{e.disabled=!1,e.textContent="Bulk Delete"}}}))}function $t(){const e=document.getElementById("agents-bulk-agent-sel");if(e){const o=e.value;e.innerHTML='<option value="">All Agents</option>',O.forEach(r=>e.appendChild(new Option(r.name,r.id))),o&&(e.value=o)}const t=document.getElementById("agents-bulk-sector-sel");if(t){const o=t.value;t.innerHTML='<option value="">All Sectors</option>',F.forEach(r=>t.appendChild(new Option(r.sectorCode,r.id))),o&&(t.value=o)}}async function X(e=!0){e&&(F=Re(await Le()),k.sectors=1);const t=document.getElementById("sectors-search"),o=document.getElementById("sectors-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",o.dataset.wired="1",t.addEventListener("input",u=>{ve.sectors=u.target.value,k.sectors=1,X(!1)}),o.addEventListener("change",u=>{se.sectors=parseInt(u.target.value),k.sectors=1,X(!1)}));const r=document.querySelector("#sectors-tab .admin-table tbody");if(!r)return;const s=Fe(F,"sectors"),i=se.sectors,c=Math.max(1,Math.ceil(s.length/i));k.sectors>c&&(k.sectors=c);const p=(k.sectors-1)*i,a=s.slice(p,p+i);r.innerHTML=a.length?a.map(u=>Ct(u)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',$e("sectors",s.length,c,p,i),At();const d=document.querySelector("#sectors-tab .flex.justify-between button");d&&!d.dataset.wired&&(d.dataset.wired="1",d.addEventListener("click",()=>Ve(null))),we("sectors")}function Ct(e){const t=_e(e);return`<tr data-sector-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id||"—"}</td>
    <td class="font-semibold">${t.sectorFrom}</td>
    <td class="font-semibold">${t.sectorTo}</td>
    <td><span class="font-mono font-bold text-primary">${t.sectorCode}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-sector" data-id="${e.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-sector" data-id="${e.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
      <button data-action="toggle-sector" data-id="${e.id}" data-hidden="${e.isHidden===!0}"
        class="px-3 py-1 rounded text-[12px] font-bold ${e.isHidden===!0?"bg-green-500 text-white hover:bg-green-600":"bg-slate-400 text-white hover:bg-slate-500"}">
        ${e.isHidden===!0?"Show Fares":"Hide Fares"}</button>
    </td>
  </tr>`}function At(){const e=document.querySelector("#sectors-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const o=t.target.closest("[data-action]");if(!o)return;const{action:r,id:s}=o.dataset,i=F.find(c=>c.id===s);if(r==="edit-sector"&&Ve(i),r==="delete-sector"){if(!confirm(`Delete sector "${i==null?void 0:i.sectorCode}"?`))return;try{await at(s),E("success","Deleted",`Sector "${i==null?void 0:i.sectorCode}" removed.`),await X()}catch(c){E("error","Error",c.message)}}if(r==="toggle-sector"){const p=!(o.dataset.hidden==="true");o.disabled=!0,o.textContent="Working…";try{const a=await it(s,p);E("success",`Sector Fares ${p?"Hidden":"Shown"}`,a.message),await X()}catch(a){E("error","Toggle Failed",a.message),await X()}}}))}function Ve(e){var o,r;const t=!!e;Ee(t?"Edit Sector":"Add New Sector",`
    <form id="sector-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">From City *</label>
        <input name="sectorFrom" required placeholder="e.g. Kozhikode" value="${(e==null?void 0:e.sectorFrom)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">To City *</label>
        <input name="sectorTo" required placeholder="e.g. Jeddah" value="${(e==null?void 0:e.sectorTo)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Sector Code *</label>
        <input name="sectorCode" required placeholder="e.g. CCJ JED" value="${(e==null?void 0:e.sectorCode)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono tracking-wide">
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 text-sm">
          ${t?"Save Changes":"Add Sector"}
        </button>
        <button type="button" id="modal-cancel" class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`),(o=document.getElementById("modal-cancel"))==null||o.addEventListener("click",()=>document.getElementById("admin-modal").close()),(r=document.getElementById("sector-form"))==null||r.addEventListener("submit",async s=>{s.preventDefault();const i=new FormData(s.target),c=Object.fromEntries(i.entries());c.sectorCode=ue(c.sectorCode.toUpperCase()),c.sectorFrom=ue(c.sectorFrom.toUpperCase()),c.sectorTo=ue(c.sectorTo.toUpperCase());const p=s.target.querySelector("[type=submit]");p.disabled=!0,p.textContent="Saving…";try{t?(await lt(e.id,c),E("success","Updated","Sector updated.")):(await dt(c),E("success","Added",`Sector "${c.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await X()}catch(a){E("error","Save Failed",a.message),p.disabled=!1,p.textContent=t?"Save Changes":"Add Sector"}})}async function ae(e=!0){e&&(j=await Te(),k.airlines=1);const t=document.getElementById("airlines-search"),o=document.getElementById("airlines-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",o.dataset.wired="1",t.addEventListener("input",u=>{ve.airlines=u.target.value,k.airlines=1,ae(!1)}),o.addEventListener("change",u=>{se.airlines=parseInt(u.target.value),k.airlines=1,ae(!1)}));const r=document.querySelector("#flights-tab .admin-table tbody");if(!r)return;const s=Fe(j,"airlines"),i=se.airlines,c=Math.max(1,Math.ceil(s.length/i));k.airlines>c&&(k.airlines=c);const p=(k.airlines-1)*i,a=s.slice(p,p+i);r.innerHTML=a.length?a.map(u=>It(u)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "+ Add Flight".</td></tr>',$e("airlines",s.length,c,p,i),St();const d=document.querySelector("#flights-tab .flex.justify-between button");d&&!d.dataset.wired&&(d.dataset.wired="1",d.addEventListener("click",()=>Je(null))),we("airlines")}function It(e){const t=e.logoUrl?`<img src="${e.logoUrl}" class="h-7 w-7 object-contain rounded" alt="${e.name}">`:`<span class="w-7 h-7 bg-primary-light text-primary text-xs font-bold rounded flex items-center justify-center">${e.code}</span>`;return`<tr data-airline-id="${e.id}">
    <td>${t}</td>
    <td class="font-semibold">${e.name}</td>
    <td><span class="font-mono font-bold text-primary">${e.code}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-airline" data-id="${e.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-airline" data-id="${e.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
    </td>
  </tr>`}function St(){const e=document.querySelector("#flights-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const o=t.target.closest("[data-action]");if(!o)return;const{action:r,id:s}=o.dataset,i=j.find(c=>c.id===s);if(r==="edit-airline"&&Je(i),r==="delete-airline"){if(!confirm(`Delete airline "${i==null?void 0:i.name}" (${i==null?void 0:i.code})?`))return;try{await ct(s),E("success","Deleted",`Airline "${i==null?void 0:i.name}" removed.`),await ae()}catch(c){E("error","Error",c.message)}}}))}function Je(e){var o,r;const t=!!e;Ee(t?"Edit Airline":"Add New Airline",`
    <form id="airline-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Airline Name *</label>
        <input name="name" required placeholder="e.g. Air India Express" value="${(e==null?void 0:e.name)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">IATA Code *</label>
        <input name="code" required maxlength="3" placeholder="e.g. IX" value="${(e==null?void 0:e.code)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono tracking-widest uppercase">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Logo (optional)</label>
        <input type="file" name="logoFile" accept="image/*"
          class="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary cursor-pointer">
        ${e!=null&&e.logoUrl?`<img src="${e.logoUrl}" class="mt-2 h-8 object-contain rounded" alt="current logo">`:""}
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 text-sm">
          ${t?"Save Changes":"Add Airline"}
        </button>
        <button type="button" id="modal-cancel" class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`),(o=document.getElementById("modal-cancel"))==null||o.addEventListener("click",()=>document.getElementById("admin-modal").close()),(r=document.getElementById("airline-form"))==null||r.addEventListener("submit",async s=>{var d;s.preventDefault();const i=new FormData(s.target),c=((d=i.get("logoFile"))==null?void 0:d.size)>0?i.get("logoFile"):null,p={name:i.get("name"),code:i.get("code").toUpperCase()},a=s.target.querySelector("[type=submit]");a.disabled=!0,a.textContent="Saving…";try{t?(await pt(e.id,p,c),E("success","Updated","Airline updated.")):(await ut(p,c),E("success","Added",`Airline "${p.name}" added.`)),document.getElementById("admin-modal").close(),await ae()}catch(u){E("error","Save Failed",u.message),a.disabled=!1,a.textContent=t?"Save Changes":"Add Airline"}})}async function kt(){const e=document.getElementById("reports-tab");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=document.getElementById("reports-sector-sel");t&&t.options.length<=1&&F.forEach(c=>t.appendChild(new Option(c.sectorCode,c.id)));const o=document.getElementById("reports-agent-sel");o&&o.options.length<=1&&O.forEach(c=>o.appendChild(new Option(c.name,c.id)));const r=document.getElementById("generate-report-btn"),s=document.getElementById("reports-start-date"),i=document.getElementById("reports-end-date");r&&!r.dataset.wired&&(r.dataset.wired="1",r.addEventListener("click",async()=>{const c=(t==null?void 0:t.value)||"all",p=(o==null?void 0:o.value)||"all",a=(s==null?void 0:s.value)||null,d=(i==null?void 0:i.value)||null;if(c==="all"&&!a&&!d&&p==="all"){E("warning","No Filter Selected","Select at least a sector, an agent, or a date range.");return}r.disabled=!0,r.textContent="Generating…";try{const[u,n]=await Promise.all([mt(a,d,c,p),Be({sectorId:c,agentId:p,startDate:a,endDate:d,includeHidden:!0})]);L=n,Bt(u,e),k.reportFares=1,te(L)}catch(u){E("error","Report Failed",u.message)}finally{r.disabled=!1,r.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Bt(e,t){const{agentReport:o,sectorReport:r,totalFares:s}=e,i=document.getElementById("report-stats-row");if(i){i.classList.remove("hidden");const h=(L||[]).filter(m=>!m.isHidden).length,l=(L||[]).filter(m=>m.isHidden).length,b=new Set((L||[]).map(m=>m.agentId)).size,y=(L||[]).map(m=>m.finalRate||0).filter(m=>m>0),w=y.length?Math.round(y.reduce((m,x)=>m+x,0)/y.length):0,g=(m,x)=>{const v=document.getElementById(m);v&&(v.textContent=x.toLocaleString())};g("stat-total-fares",s),g("stat-live-fares",h),g("stat-hidden-fares",l),g("stat-agents-count",b);const $=document.getElementById("stat-avg-fare");$&&($.textContent=w>0?`₹${w.toLocaleString()}`:"—")}const c=document.getElementById("report-total-fares");c&&(c.textContent=`${s} fare${s!==1?"s":""} matched your filter`);const p=document.getElementById("bar-chart-container");p&&o.length&&Lt(o.slice(0,8),p);const a=document.getElementById("donut-chart-svg"),d=document.getElementById("pie-legend");a&&r.length&&Tt(r.slice(0,8),a,d);const u=document.getElementById("report-leaderboards");u&&(u.classList.remove("hidden"),Rt(o,r));const n=document.getElementById("download-report-csv");if(n){const h=n.cloneNode(!0);n.parentNode.replaceChild(h,n),h.addEventListener("click",()=>Ft(L)),L&&L.length?h.classList.remove("opacity-50","pointer-events-none"):h.classList.add("opacity-50","pointer-events-none")}E("success","Report Ready",`${s} fare${s!==1?"s":""} aggregated.`)}function Lt(e,t){const o=t.clientWidth||480,r=260,s={top:32,right:16,bottom:48,left:48},i=o-s.left-s.right,c=r-s.top-s.bottom,p=Math.max(...e.map(m=>m.count),1),a=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],d=4,u=Math.ceil(p/d),n=Array.from({length:d+1},(m,x)=>x*u),h=n.map(m=>{const x=s.top+c-m/(n[n.length-1]||1)*c;return`<line x1="${s.left}" y1="${x.toFixed(1)}" x2="${o-s.right}" y2="${x.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${s.left-6}" y="${(x+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${m}</text>`}).join(""),l=Math.min(48,i/e.length*.6),b=i/e.length,y=e.map((m,x)=>{const v=Math.max(4,m.count/(n[n.length-1]||1)*c),B=s.left+x*b+b/2-l/2,N=s.top+c-v,[q,z]=a[x%a.length],V=`bg${x}`,J=m.avgRate?`avg ₹${Math.round(m.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${V}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${q}"/>
              <stop offset="100%" stop-color="${z}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${m.name}" data-count="${m.count}" data-avg="${J}" style="cursor:pointer;">
              <rect x="${B.toFixed(1)}" y="${N.toFixed(1)}" width="${l}" height="${v.toFixed(1)}"
                rx="6" fill="url(#${V})" opacity="0.92"
                style="transform-origin:${(B+l/2).toFixed(1)}px ${(s.top+c).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${x*.07}s both;"/>
              <text x="${(B+l/2).toFixed(1)}" y="${(N-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${z}">${m.count}</text>
              <text x="${(B+l/2).toFixed(1)}" y="${(s.top+c+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(m.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),w="bar-tooltip";t.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${w}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${r}" viewBox="0 0 ${o} ${r}" style="overflow:visible;">
      ${h}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+c}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${s.left}" y1="${s.top+c}" x2="${o-s.right}" y2="${s.top+c}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${y}
    </svg>`;const g=t.querySelector("#bar-svg"),$=t.querySelector(`#${w}`);g&&$&&g.querySelectorAll(".bar-group").forEach(m=>{m.addEventListener("mousemove",x=>{const v=t.getBoundingClientRect();$.style.display="block",$.style.left=x.clientX-v.left+12+"px",$.style.top=x.clientY-v.top-40+"px";const B=m.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${m.dataset.avg}</span>`:"";$.innerHTML=`${m.dataset.name}<br><span style="color:#60a5fa;">${m.dataset.count} fares</span>${B}`}),m.addEventListener("mouseleave",()=>{$.style.display="none"})})}function Tt(e,t,o){const r=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],a=e.reduce((m,x)=>m+x.count,0),d=t.getElementById?t.getElementById("donut-segments"):t.querySelector("#donut-segments"),u=t.querySelector("#donut-center-count"),n=t.querySelector("#donut-center-label");if(!d)return;u&&(u.textContent=a),n&&(n.textContent="FARES");const h=(m,x,v,B)=>({x:m+v*Math.cos((B-90)*Math.PI/180),y:x+v*Math.sin((B-90)*Math.PI/180)});let l=0;const b=e.map((m,x)=>{const v=a>0?m.count/a*360:0,B=l+v,N=v>180?1:0,q=h(110,110,95,l),z=h(110,110,95,B),V=h(110,110,60,l),J=h(110,110,60,B),ee=[`M ${q.x.toFixed(2)} ${q.y.toFixed(2)}`,`A 95 95 0 ${N} 1 ${z.x.toFixed(2)} ${z.y.toFixed(2)}`,`L ${J.x.toFixed(2)} ${J.y.toFixed(2)}`,`A 60 60 0 ${N} 0 ${V.x.toFixed(2)} ${V.y.toFixed(2)}`,"Z"].join(" "),oe=l+v/2;l=B;const f=a>0?(m.count/a*100).toFixed(1):"0.0";return{pathD:ee,color:r[x%r.length],name:m.name,count:m.count,pct:f,mid:oe}}),y="http://www.w3.org/2000/svg";d.innerHTML="";const w=b.map((m,x)=>{const v=document.createElementNS(y,"path");return v.setAttribute("d",m.pathD),v.setAttribute("fill",m.color),v.setAttribute("stroke","white"),v.setAttribute("stroke-width","2"),v.style.cursor="pointer",v.style.transition="transform 0.2s, filter 0.2s",v.style.transformOrigin="110px 110px",v.setAttribute("data-index",x),d.appendChild(v),v}),g=m=>{w.forEach((x,v)=>{v===m?(x.style.transform="scale(1.04)",x.style.filter="brightness(1.1)",x.setAttribute("stroke-width","3")):(x.style.transform="scale(1)",x.style.filter="brightness(1)",x.setAttribute("stroke-width","2"))}),m>=0&&m<b.length?(u&&(u.textContent=b[m].count),n&&(n.textContent=b[m].name.split(" ")[0].toUpperCase().slice(0,7))):(u&&(u.textContent=a),n&&(n.textContent="FARES"))};if(w.forEach((m,x)=>{m.addEventListener("mouseover",()=>{g(x),$(x)}),m.addEventListener("mouseout",()=>{g(-1),$(-1)})}),o){o.innerHTML=b.map((x,v)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${v}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${x.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${x.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${x.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${x.pct}%</span>
      </div>`).join("");const m=x=>{o.querySelectorAll(".legend-row").forEach((v,B)=>{v.style.background=B===x?"#f1f5f9":""})};window._highlightLegendRows=m,o.querySelectorAll(".legend-row").forEach((x,v)=>{x.addEventListener("mouseover",()=>{g(v),m(v)}),x.addEventListener("mouseout",()=>{g(-1),m(-1)})})}function $(m){window._highlightLegendRows&&window._highlightLegendRows(m)}}function Rt(e,t){var i,c;const o=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],r=document.getElementById("leaderboard-agents");if(r&&e.length){const p=[...e].sort((d,u)=>u.count-d.count).slice(0,5),a=p[0].count||1;r.innerHTML=p.map((d,u)=>{const n=Math.max(6,Math.round(d.count/a*100));return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:16px;width:28px;text-align:center;flex-shrink:0;">${u===0?"🥇":u===1?"🥈":u===2?"🥉":`#${u+1}`}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${d.name}</span>
            <span style="color:${o[u]};margin-left:8px;">${d.count} fares</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${n}%;height:100%;background:${o[u]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}const s=document.getElementById("leaderboard-sectors");if(s&&t.length){const a=[...t.filter(n=>n.avgRate>0)].sort((n,h)=>n.avgRate-h.avgRate).slice(0,5),d=((i=a[0])==null?void 0:i.avgRate)||1,u=((c=a[a.length-1])==null?void 0:c.avgRate)||1;s.innerHTML=a.map((n,h)=>{const l=u>d?Math.max(6,Math.round((n.avgRate-d)/(u-d)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${h+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${n.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(n.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${l}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function Ft(e){if(!e||!e.length){E("warning","No Data","No fares to export. Apply filters and fetch first.");return}const t=Object.fromEntries(O.map(n=>[n.id,n.name])),o=Object.fromEntries(F.map(n=>[n.id,n.sectorCode])),r=Object.fromEntries(j.map(n=>[n.id,n.code||n.name])),s=n=>`"${String(n??"").replace(/"/g,'""')}"`,i=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],c=e.map(n=>{const h=n.flightDate instanceof Date?n.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):n.flightDate||"";return[s(h),s(n.flightTime||""),s(o[n.sectorId]||n.sectorId),s(r[n.airlineId]||n.airlineId),s(t[n.agentId]||n.agentId),s(n.specialRate||0),s(n.finalRate||0),s(n.commission||0),s(n.baggage||""),s(n.extraBaggage||""),s(n.isHidden?"Hidden":"Live")].join(",")}),p=[i.map(s).join(","),...c].join(`
`),a=new Blob(["\uFEFF"+p],{type:"text/csv;charset=utf-8;"}),d=URL.createObjectURL(a),u=document.createElement("a");u.href=d,u.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(u),u.click(),document.body.removeChild(u),URL.revokeObjectURL(d),E("success","CSV Downloaded",`${e.length} fares exported.`)}const Dt="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",Mt={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},Pe=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let Z=null,Q=JSON.parse(localStorage.getItem("zt_hist")||"[]"),De=Q.reduce((e,t)=>e+(t.rows||0),0);function Nt(){var t,o,r,s;const e=document.getElementById("rateData");e&&e.addEventListener("input",function(){const i=this.value.length,c=document.getElementById("charCount");c&&(c.textContent=i.toLocaleString()+" character"+(i!==1?"s":"")),me(),clearTimeout(window._previewTimer),i>15?window._previewTimer=setTimeout(()=>jt(this.value),500):ye()}),(t=document.getElementById("resetBtn"))==null||t.addEventListener("click",()=>{e&&(e.value="");const i=document.getElementById("charCount");i&&(i.textContent="0 characters"),ye(),me()}),(o=document.getElementById("clearBtn"))==null||o.addEventListener("click",()=>{Q=[],De=0,he(),be(),ke()}),(r=document.getElementById("manualAgent"))==null||r.addEventListener("input",function(){const i=parseInt(this.value);Z=i>0?String(i):null,document.querySelectorAll(".rp-chip").forEach(c=>c.classList.remove("on")),Ye(),me()}),(s=document.getElementById("submitBtn"))==null||s.addEventListener("click",Pt),ke(),be()}function Ht(){const e=document.getElementById("chipGrid");if(!e||e.children.length>0)return;const t=O.length?[...O].sort((o,r)=>{const s=parseInt(o.id),i=parseInt(r.id);return!isNaN(s)&&!isNaN(i)?s-i:o.id.localeCompare(r.id)}):[];if(!t.length){e.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>';return}t.forEach(o=>{const r=document.createElement("div");r.className="rp-chip",r.dataset.agentId=o.id,r.textContent=o.id,r.style.cssText="height:48px;padding:0 12px;display:flex;align-items:center;justify-content:center;border:2px solid #b8cce4;border-radius:10px;font-size:13px;font-weight:700;color:#1e293b;cursor:pointer;background:#ffffff;user-select:none;box-shadow:0 1px 4px rgba(13,31,60,.10);transition:all .16s ease;white-space:nowrap;",r.addEventListener("click",()=>Ut(o.id,o.name,r)),e.appendChild(r)})}function Ut(e,t,o){Z=e,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(r=>{r.classList.remove("on"),r.style.background="#ffffff",r.style.color="#1e293b",r.style.borderColor="#b8cce4",r.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",r.style.transform=""}),o&&(o.classList.add("on"),o.style.background="#1a73e8",o.style.color="#ffffff",o.style.borderColor="#1a73e8",o.style.boxShadow="0 4px 14px rgba(26,115,232,.3)",o.style.transform="translateY(-1px)"),Ye(),me()}function Ye(){const e=document.getElementById("agentPill");if(e)if(Z){const t=O.find(o=>o.id===Z);e.textContent=`Agent ${(t==null?void 0:t.id)||Z} selected ✓`,e.classList.remove("empty")}else e.textContent="No agent selected",e.classList.add("empty")}function me(){const e=document.getElementById("rateData"),t=document.getElementById("submitBtn");t&&(t.disabled=!(Z&&e&&e.value.trim().length>10))}function Ke(e){const t=[];let o=null,r="IX";for(const s of e.split(`
`)){const i=s.replace(/[*_~`]/g,"").trim();if(!i)continue;const c=i.match(/([A-Z]{3})\s+([A-Z]{3})/);if(c&&i.length<70&&!i.match(/\d{4,6}/)){o=c[1]+"-"+c[2];const p=i.match(Pe);p&&(r=p[1]);continue}if(o){const p=i.match(Pe);if(p&&!i.match(/\d{4,6}/)){r=p[1];continue}const a=i.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(a){const d=parseInt(a[3]);d>=1e3&&d<=99999&&t.push({sector:o,date:`2026-${Mt[a[2].toUpperCase()]}-${a[1].padStart(2,"0")}`,airline:p?p[1]:r,rate:d})}}}return t}function jt(e){const t=Ke(e);if(!t.length){ye();return}const o=document.getElementById("prevBox");o&&o.classList.add("on");const r=document.getElementById("prevCount");r&&(r.textContent=t.length+" entr"+(t.length===1?"y":"ies"));const s=document.getElementById("prevBody");s&&(s.innerHTML=t.slice(0,60).map(i=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${i.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${i.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${i.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${i.rate.toLocaleString()}</td></tr>`).join(""),t.length>60&&(s.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${t.length-60} more</td></tr>`))}function ye(){var e;(e=document.getElementById("prevBox"))==null||e.classList.remove("on")}async function Pt(){const e=document.getElementById("rateData");if(!Z||!(e!=null&&e.value.trim()))return;const t=document.getElementById("submitBtn"),o=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI...';const r=document.getElementById("progBar"),s=document.getElementById("progFill");r&&r.classList.add("on");let i=0;const c=setInterval(()=>{i=Math.min(i+Math.random()*13,85),s&&(s.style.width=i+"%")},280),p=Ke(e.value),a={id:Date.now(),agent:Z,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:p.length,status:"pen"};Q.unshift(a),Q.length>15&&Q.pop(),he(),be();try{const d=await fetch(Dt,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:Z,raw_text:e.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(c),s&&(s.style.width="100%"),d.ok)a.status="ok",De+=p.length,he(),be(),ke(),E("success","Submitted","Rates dispatched to AI Agent. The database will reflect parsing results momentarily."),setTimeout(()=>{e.value="";const u=document.getElementById("charCount");u&&(u.textContent="0 characters"),ye(),me()},500);else throw new Error("N8N webhook rejected payload")}catch(d){clearInterval(c),s&&(s.style.width="100%"),a.status="err",he(),be(),E("error","Submission Failed",d.message)}setTimeout(()=>{r&&r.classList.remove("on"),s&&(s.style.width="0%"),t.innerHTML=o,me()},900)}function ke(){const e=document.getElementById("statSubs");e&&(e.textContent=Q.length);const t=document.getElementById("statEntries");t&&(t.textContent=De)}function he(){localStorage.setItem("zt_hist",JSON.stringify(Q))}function be(){const e=document.getElementById("historyWrap");if(e){if(!Q.length){e.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}e.innerHTML=Q.map(t=>{var r;const o=((r=O.find(s=>s.id===t.agent))==null?void 0:r.name)||`Agent ${t.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${o.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${o}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${t.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${t.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${t.status==="ok"?"bg-green-500":t.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}async function Ot(){var p;const e=document.getElementById("eticket-tab");if(!e)return;const t=document.getElementById("eticket-form"),o=document.getElementById("et-add-passenger"),r=document.getElementById("et-passengers-container"),s=document.getElementById("et-airline"),i=document.getElementById("et-origin"),c=document.getElementById("et-destination");if(j.length===0&&(j=await Te()),F.length===0&&(F=Re(await Le())),!e.dataset.wired){if(e.dataset.wired="1",s&&j&&(s.innerHTML='<option value="">Select Airline</option>'+j.map(d=>`<option value="${d.name}">${d.name}</option>`).join("")),i&&F){const d=[...new Set(F.map(u=>u.sectorFrom).filter(Boolean))].sort();i.innerHTML='<option value="">Select Origin</option>'+d.map(u=>`<option value="${u}">${u}</option>`).join("")}if(c&&F){const d=[...new Set(F.map(u=>u.sectorTo).filter(Boolean))].sort();c.innerHTML='<option value="">Select Destination</option>'+d.map(u=>`<option value="${u}">${u}</option>`).join("")}const a=()=>{const d=Array.from(r.querySelectorAll(".et-pax-row"));d.forEach((u,n)=>{const h=u.querySelector(".et-passenger-index");h&&(h.textContent=`Passenger ${n+1}`);const l=u.querySelector(".et-remove-passenger");l&&(d.length<=1?(l.classList.add("opacity-40","pointer-events-none"),l.setAttribute("aria-disabled","true")):(l.classList.remove("opacity-40","pointer-events-none"),l.removeAttribute("aria-disabled")))})};o==null||o.addEventListener("click",()=>{r.insertAdjacentHTML("beforeend",`
        <div class="et-pax-row relative rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:p-5">
          <div class="flex items-center justify-between mb-3 pr-8">
            <p class="et-passenger-index text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Passenger</p>
          </div>
          <button type="button" class="et-remove-passenger absolute top-3 right-3 w-7 h-7 rounded-full border border-red-200 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-colors" title="Remove passenger" aria-label="Remove passenger">
            <i class="bi bi-x-lg text-[11px]"></i>
          </button>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Title</label>
              <select name="paxTitle[]" class="w-full border border-slate-200 rounded-xl h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="MR">MR</option>
                <option value="MRS">MRS</option>
                <option value="MS">MS</option>
                <option value="MSTR">MSTR</option>
                <option value="MISS">MISS</option>
              </select>
            </div>

            <div class="md:col-span-4">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Passenger Name *</label>
              <input type="text" name="paxName[]" required placeholder="e.g. JOHN DOE" class="w-full border border-slate-200 rounded-xl h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none uppercase placeholder:normal-case bg-white">
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Category</label>
              <select name="paxType[]" class="w-full border border-slate-200 rounded-xl h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="ADT">Adult</option>
                <option value="CHD">Child</option>
                <option value="INF">Infant</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Cabin Bag</label>
              <select name="paxCarryBag[]" class="w-full border border-slate-200 rounded-xl h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="7 Kg" selected>7 Kg</option>
                <option value="10 Kg">10 Kg</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Check-in Bag</label>
              <select name="paxCheckBag[]" class="w-full border border-slate-200 rounded-xl h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="15 Kg">15 Kg</option>
                <option value="20 Kg">20 Kg</option>
                <option value="25 Kg">25 Kg</option>
                <option value="30 Kg" selected>30 Kg</option>
                <option value="35 Kg">35 Kg</option>
                <option value="40 Kg">40 Kg</option>
              </select>
            </div>
          </div>
        </div>
      `),a()}),r==null||r.addEventListener("click",d=>{var n;const u=d.target.closest(".et-remove-passenger");u&&((n=u.closest(".et-pax-row"))==null||n.remove(),a())}),r.children.length===0&&(o==null||o.click()),a(),t==null||t.addEventListener("submit",async d=>{d.preventDefault(),await qt(new FormData(t))}),(p=document.getElementById("et-print-btn"))==null||p.addEventListener("click",()=>{window.print()}),t==null||t.addEventListener("reset",()=>{setTimeout(()=>{var d;Array.from(r.children).forEach((u,n)=>{n>0&&u.remove()}),r.children.length===0&&(o==null||o.click()),a(),(d=document.getElementById("eticket-output-wrapper"))==null||d.classList.add("hidden")},10),E("info","Form Reset","The E-Ticket form has been cleared.")})}}async function qt(e){var fe,H,R;const t=(fe=e.get("etPnr"))==null?void 0:fe.toUpperCase(),o=(H=e.get("etAirline"))==null?void 0:H.toUpperCase(),r=(R=e.get("etFlightNo"))==null?void 0:R.toUpperCase(),s=e.get("etDate"),i=e.get("etDepTime"),c=e.get("etArrTime"),p=e.get("etPhone"),a=(C="")=>String(C).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),d=C=>{const D=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec(C||"");return D?Number(D[1])*60+Number(D[2]):null},u=(C="")=>C.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",n=C=>{const D=(C||"").trim();let M=D,de="";const P=D.match(/^(.*?)\s*\((.*?)\)$/);return P&&(M=P[1].trim(),de=P[2].trim()),{city:M,code:de}},h=n(e.get("etOrigin")),l=n(e.get("etDest")),b=e.get("etOrigin")||"—",y=e.get("etDest")||"—";let w="—";if(s){const C=new Date(s);if(!isNaN(C.getTime())){const D=["SUN","MON","TUE","WED","THU","FRI","SAT"],M=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];w=`${D[C.getDay()]}, ${String(C.getDate()).padStart(2,"0")} ${M[C.getMonth()]} ${C.getFullYear()}`}}const g=C=>document.getElementById(C);let $=h.code,m=l.code,x=null;if(typeof F<"u"){if(x=F.find(C=>C.sectorFrom===b&&C.sectorTo===y),!x&&b){const C=F.find(D=>D.sectorFrom===b);C&&C.sectorCode&&($=C.sectorCode.split(/[ -]+/)[0])}if(!x&&y){const C=F.find(D=>D.sectorTo===y);C&&C.sectorCode&&(m=C.sectorCode.split(/[ -]+/).pop())}}const v=($||u(h.city)).toUpperCase(),B=(m||u(l.city)).toUpperCase(),N=`${v} - ${B}`,q=`${(h.city||b).toUpperCase()} to ${(l.city||y).toUpperCase()}`,z=(h.city||b).toUpperCase(),V=(l.city||y).toUpperCase(),J=d(i),ee=d(c);let oe="N/A";if(J!==null&&ee!==null){let C=ee-J;C<0&&(C+=24*60);const D=Math.floor(C/60),M=C%60;oe=`${D}h ${String(M).padStart(2,"0")}m`}g("t-pnr")&&(g("t-pnr").textContent=t||"—"),g("t-issued-by")&&(g("t-issued-by").textContent=o||"—"),g("t-customer-phone")&&(g("t-customer-phone").textContent=p||"—"),g("t-flight-code")&&(g("t-flight-code").textContent=r||"—"),g("t-travel-date")&&(g("t-travel-date").textContent=w||"—"),g("t-route-code")&&(g("t-route-code").textContent=N),g("t-route-long")&&(g("t-route-long").textContent=q),g("t-duration")&&(g("t-duration").textContent=oe);const f=new Date,A=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],I=`${String(f.getDate()).padStart(2,"0")} ${A[f.getMonth()]} ${f.getFullYear()} ${String(f.getHours()).padStart(2,"0")}:${String(f.getMinutes()).padStart(2,"0")}`;g("t-booked-on")&&(g("t-booked-on").textContent=I);const T=g("t-airline-logo"),S=g("t-issued-by-fallback");if(T){const C=typeof j<"u"?j.find(D=>D.name.toUpperCase()===o):null;C&&C.logoUrl?(T.src=C.logoUrl,T.classList.remove("hidden"),S&&S.classList.add("hidden")):(T.removeAttribute("src"),T.classList.add("hidden"),S&&(S.classList.remove("hidden"),S.textContent=(o||"No logo").toUpperCase()))}const ge=e.getAll("paxTitle[]"),_=e.getAll("paxName[]"),ie=e.getAll("paxType[]"),ne=e.getAll("paxCheckBag[]"),G=e.getAll("paxCarryBag[]");g("t-pax-count")&&(g("t-pax-count").textContent=String(_.length));const U=document.getElementById("t-passengers-tbody");if(U){const C=_.map((D,M)=>{const de=a((ge[M]||"MR").toUpperCase()),P=a((_[M]||"").toUpperCase()),Ce=a((ie[M]||"ADT").toUpperCase()),xe=a((ne[M]||"—").toUpperCase()),ce=a((G[M]||"—").toUpperCase()),pe=x&&x.sectorCode?a(x.sectorCode.toUpperCase()):a(N);return`
        <tr class="${M%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${M+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${de}. ${P}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Ce}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${pe}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${a(r||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${a(t||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${ce}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${xe}</td>
        </tr>
      `}).join("");U.innerHTML=C||`
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `}const W=document.getElementById("t-travel-tbody");W&&(W.innerHTML=`
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${a(r||"—")}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${a(z)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${a(v)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${a(i||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${a(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${a(V)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${a(B)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${a(c||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${a(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const le=document.getElementById("eticket-output-wrapper");le&&(le.classList.remove("hidden"),le.scrollIntoView({behavior:"smooth"}))}const Oe={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function E(e,t,o){const r=document.getElementById("toastsEl");if(!r)return;const s=document.createElement("div"),i={success:"border-green-500 bg-green-50 text-green-800",error:"border-red-500 bg-red-50 text-red-800",warning:"border-yellow-500 bg-yellow-50 text-yellow-800",info:"border-primary bg-primary/10 text-[var(--color-primary-dark)]"};s.className=`flex items-start gap-3 p-4 border-l-4 rounded shadow-md w-80 pointer-events-auto ${i[e]||i.error}`,s.innerHTML=`<div class="mt-0.5">${Oe[e]||Oe.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${t}</div><div class="text-xs opacity-90 mt-1">${o}</div></div>
    <button class="opacity-50 hover:opacity-100" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,r.appendChild(s),setTimeout(()=>s.isConnected&&s.remove(),7e3)}window.toast=E;document.addEventListener("DOMContentLoaded",()=>{});
