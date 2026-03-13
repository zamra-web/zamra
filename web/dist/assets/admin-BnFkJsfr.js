import"./firebase-config-zYKzaodH.js";import{o as Qe,l as et}from"./auth-C5kFZwmO.js";import{a as ke,d as tt,u as Ae,c as _e,e as nt,f as ot,h as at,i as st,j as it,g as Te,k as rt,l as lt,m as dt,n as ct,b as Le,o as mt,p as pt,q as gt,r as ut}from"./db-DN85Zd7Y.js";async function ft(e,t,n,a,s){const r=`Generating ${e} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",r),new Promise(async(d,m)=>{try{let ee=function(f,I,A,L,S){o.beginPath(),o.moveTo(f+S,I),o.lineTo(f+A-S,I),o.arcTo(f+A,I,f+A,I+S,S),o.lineTo(f+A,I+L-S),o.arcTo(f+A,I+L,f+A-S,I+L,S),o.lineTo(f+S,I+L),o.arcTo(f,I+L,f,I+L-S,S),o.lineTo(f,I+S),o.arcTo(f,I,f+S,I,S),o.closePath()},ne=function(f){var fe;const I=f-J;if(I>V){try{q.stop()}catch(H){console.error("Error stopping recorder",H)}return}o.fillStyle="#f8fafc",o.fillRect(0,0,i,c);const A=e==="9x16"?400:300;if(o.fillStyle="#1e293b",o.fillRect(0,0,i,A),$.complete&&$.width>0){o.globalAlpha=.2;const H=Math.max(i/$.width,A/$.height),R=$.width*H,C=$.height*H,D=(i-R)/2,M=(A-C)/2;o.drawImage($,D,M,R,C),o.globalAlpha=1}const L=o.createLinearGradient(0,0,0,A);L.addColorStop(0,"#1e293b"),L.addColorStop(1,"transparent"),o.fillStyle=L,o.globalAlpha=.8,o.fillRect(0,0,i,A),o.globalAlpha=1,o.textAlign="center",o.textBaseline="middle";const S=o.createLinearGradient(0,0,i,0);S.addColorStop(0,"#2563eb"),S.addColorStop(.5,"#60a5fa"),S.addColorStop(1,"#1558c0"),o.fillStyle=S,o.fillRect(0,0,i,16);const ue=200,_=40,re=60;o.fillStyle="rgba(37, 99, 235, 0.4)",ee(i/2-ue/2,re,ue,_,20),o.fill(),o.strokeStyle="rgba(37, 99, 235, 0.6)",o.lineWidth=1,o.stroke(),o.fillStyle="#bfdbfe",o.font="bold 16px Arial, sans-serif",o.fillText("EXCLUSIVE DEALS",i/2,re+_/2),o.fillStyle="#ffffff",o.font="900 "+(e==="16x9"?"70px":"56px")+" Arial, sans-serif",o.fillText(`${l} → ${b}`,i/2,re+80),o.fillStyle="#dbeafe",o.font="700 24px Arial, sans-serif",o.fillText("SPECIAL FARES AVAILABLE NOW",i/2,re+140);const oe=A+60,G=90,U=e==="9x16"?40:e==="1x1"?80:160,W=i-U*2;o.fillStyle="#64748b",o.font="bold 18px Arial, sans-serif",o.textAlign="left",o.fillText("DATE",U+20,oe-20),o.textAlign="center",o.fillText("AIRLINE",U+W*.35,oe-20),o.fillText("TIME",U+W*.65,oe-20),o.textAlign="right",o.fillText("FARE",U+W-20,oe-20);for(let H=0;H<y.length;H++){const R=y[H],C=1e3+H*800;if(I<C)continue;const M=Math.min(1,(I-C)/500),de=20*(1-M),j=oe+H*G+de;o.globalAlpha=M,H%2===0&&(o.fillStyle="#ffffff",ee(U,j,W,G-10,12),o.fill()),o.fillStyle="#0f172a",o.textBaseline="middle";const Ce=R.flightDate instanceof Date?R.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():R.flightDate;o.textAlign="left",o.font="900 26px Arial, sans-serif",o.fillText(Ce,U+20,j+G/2-5);const he=U+W*.35,ce=h[R.airlineId];if(ce&&ce.width>0){const ae=Math.min(100,ce.width),Ue=40;o.drawImage(ce,he-ae/2,j+G/2-5-Ue/2,ae,Ue)}else{o.font="700 20px Arial, sans-serif",o.textAlign="center";const ae=((fe=w[R.airlineId])==null?void 0:fe.name)||R.airlineId||"—";o.fillText(ae,he,j+G/2-5)}let me=R.flightTime||"—";if(me.includes("-")){const ae=me.split("-");me=`${ae[0].trim()} - ${ae[1].trim()}`}o.font="800 22px Arial, sans-serif",o.textAlign="center",o.fillText(me,U+W*.65,j+G/2-5);const Ie=`₹${(R.finalRate||0).toLocaleString()}`;o.font="900 26px Arial, sans-serif",o.textAlign="right";const Ze=o.measureText(Ie).width,Me=U+W-20,Ne=Ze+40,He=50;o.fillStyle="#0f172a",ee(Me-Ne,j+G/2-5-He/2,Ne,He,12),o.fill(),o.fillStyle="#ffffff",o.fillText(Ie,Me-20,j+G/2-5),o.globalAlpha=1}const le=1e3+y.length*800+500;if(I>le){const H=Math.min(1,(I-le)/500);o.globalAlpha=H;const R=100,C=c-R+20*(1-H);o.fillStyle="#ffffff",o.fillRect(0,c-R,i,R),o.fillRect(0,C,i,R),o.fillStyle="#f1f5f9",o.fillRect(0,c-R,i,2),g.complete&&g.width>0&&o.drawImage(g,U,c-R/2-24,48,48),o.fillStyle="#1e293b",o.font="900 24px Arial, sans-serif",o.textAlign="left",o.textBaseline="middle",o.fillText("Zamra Travels",U+64,c-R/2),o.font="700 20px Arial, sans-serif",o.textAlign="right",o.fillText("zamratravels.com  |  +91 98765 43210",i-U,c-R/2),o.globalAlpha=1}requestAnimationFrame(ne)},i,c;if(e==="1x1")i=1080,c=1080;else if(e==="9x16")i=1080,c=1920;else if(e==="16x9")i=1920,c=1080;else throw new Error("Invalid ratio selected");const p=document.createElement("canvas");p.width=i,p.height=c;const o=p.getContext("2d");o.imageSmoothingEnabled=!0;const x=a.find(f=>f.id===n),l=x?(x.sectorFrom||"DEP").toUpperCase():"DEP",b=x?(x.sectorTo||"ARR").toUpperCase():"ARR",y=[...t].sort((f,I)=>{let A=f.flightDate,L=I.flightDate;return A instanceof Date&&(A=A.getTime()),L instanceof Date&&(L=L.getTime()),A-L}).slice(0,10),w={};s.forEach(f=>{f.id&&(w[f.id]=f),f.code&&(w[f.code]=f),f.name&&(w[f.name]=f)});async function u(f){if(!f)return null;try{const I=await fetch(f);if(!I.ok)return null;const A=await I.blob(),L=URL.createObjectURL(A);return new Promise((S,ue)=>{const _=new Image;_.onload=()=>S(_),_.onerror=()=>S(null),_.src=L})}catch{return null}}const $=new Image;await new Promise(f=>{$.onload=f,$.onerror=f,$.src="/assets/img/hero-bg.webp"});const g=new Image;await new Promise(f=>{g.onload=f,g.onerror=f,g.src="/assets/img/logo.webp"});const h={},v=[...new Set(y.map(f=>f.airlineId))].map(f=>w[f]).filter(f=>f==null?void 0:f.logoUrl);await Promise.all(v.map(async f=>{const I=await u(f.logoUrl);I&&(h[f.id]=I)}));const k=p.captureStream(30);let N="video/mp4";MediaRecorder.isTypeSupported(N)||(N="video/webm; codecs=h264",MediaRecorder.isTypeSupported(N)||(N="video/webm"));const q=new MediaRecorder(k,{mimeType:N}),z=[];q.ondataavailable=f=>{f.data&&f.data.size>0&&z.push(f.data)},q.start(100);const V=1e4+y.length*1500,J=performance.now();requestAnimationFrame(ne),q.onstop=()=>{const f=new Blob(z,{type:N}),I=URL.createObjectURL(f),A=document.createElement("a");A.href=I,A.download=`zamra-video-${e}-${Date.now()}.mp4`,A.style.display="none",document.body.appendChild(A),A.click(),setTimeout(()=>{document.body.removeChild(A),URL.revokeObjectURL(I)},100),window.toast&&window.toast("success","Video Generated",`Your ${e} video has been downloaded!`),d()},q.onerror=f=>{console.error("Recorder Error:",f),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),m(f)}}catch(i){console.error(i),window.toast&&window.toast("error","Generation Failed",i.message),m(i)}})}let O=[],F=[],P=[],T=[];function pe(e){return e==null?e:String(e).replace(/damamm/gi,t=>t===t.toUpperCase()?"DAMMAM":t===t.toLowerCase()?"dammam":"Dammam")}function ze(e={}){return{...e,sectorFrom:pe(e.sectorFrom||""),sectorTo:pe(e.sectorTo||""),sectorCode:pe(e.sectorCode||"")}}function Re(e=[]){return e.map(t=>ze(t))}let K={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},reportFares:{key:"flightDate",asc:!0}},ve={sectors:"",airlines:""},se={agents:10,sectors:10,airlines:10,reportFares:20},B={agents:1,sectors:1,airlines:1,reportFares:1};function Fe(e,t){var d;let n=e;const a=(d=ve[t])==null?void 0:d.toLowerCase();a&&t==="agents"?n=n.filter(m=>(m.name||"").toLowerCase().includes(a)||(m.email||"").toLowerCase().includes(a)||(m.contactPhone||"").toLowerCase().includes(a)||(m.id||"").toLowerCase().includes(a)):a&&t==="sectors"?n=n.filter(m=>(m.sectorFrom||"").toLowerCase().includes(a)||(m.sectorTo||"").toLowerCase().includes(a)||(m.sectorCode||"").toLowerCase().includes(a)):a&&t==="airlines"&&(n=n.filter(m=>(m.name||"").toLowerCase().includes(a)||(m.code||"").toLowerCase().includes(a)));const{key:s,asc:r}=K[t];return s&&(n=[...n].sort((m,i)=>{let c=m[s],p=i[s];if(c instanceof Date&&(c=c.getTime()),p instanceof Date&&(p=p.getTime()),s==="id"){const o=parseInt(c),x=parseInt(p);if(!isNaN(o)&&!isNaN(x))return r?o-x:x-o}return typeof c=="string"&&(c=c.toLowerCase()),typeof p=="string"&&(p=p.toLowerCase()),c<p?r?-1:1:c>p?r?1:-1:0})),n}function we(e){document.querySelectorAll(`th[data-sort-tab="${e}"] i`).forEach(n=>{n.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const t=document.querySelector(`th[data-sort-tab="${e}"][data-sort-key="${K[e].key}"]`);if(t){const n=t.querySelector("i");n&&(n.className=`bi bi-arrow-${K[e].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",e=>{const t=e.target.closest("th[data-sort-tab]");if(!t)return;const n=t.dataset.sortTab,a=t.dataset.sortKey;K[n].key===a?K[n].asc=!K[n].asc:(K[n].key=a,K[n].asc=!0),n==="agents"?Y(!1):n==="sectors"?X(!1):n==="airlines"?ie(!1):n==="reportFares"&&T.length&&te(T)});document.documentElement.style.visibility="hidden";Qe(async e=>{if(!e){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const t=document.getElementById("admin-user-name");t&&(t.textContent=e.email.split("@")[0]),await bt(),Ut(),await Ge()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("admin-logout-btn");e&&e.addEventListener("click",async()=>{(await et()).success&&(window.location.href="/login.html")}),xt(),ht(),Ht()});async function bt(){try{const[e,t,n]=await Promise.all([_e(),Te(),Le()]);O=e,F=Re(t),P=n}catch(e){console.error("loadGlobalData error:",e)}}function ht(){const e=document.querySelectorAll(".nav-link"),t=document.querySelectorAll(".tab-content"),n=document.getElementById("page-title");e.forEach(a=>{a.addEventListener("click",async s=>{var m;s.preventDefault(),e.forEach(i=>{i.classList.remove("active","text-primary"),i.classList.add("text-text-muted")}),a.classList.remove("text-text-muted"),a.classList.add("active","text-primary");const r=a.getAttribute("data-tab"),d=a.getAttribute("data-title");t.forEach(i=>i.classList.remove("active")),(m=document.getElementById(r))==null||m.classList.add("active"),n&&d&&(n.textContent=d),await Ge()})})}async function Ge(){const e=document.querySelector(".tab-content.active");if(!e)return;const t=e.id;t==="agents-tab"?await Y():t==="sectors-tab"?await X():t==="flights-tab"?await ie():t==="dashboard-tab"?await yt():t==="reports-tab"?await kt():t==="eticket-tab"&&await Gt()}function xt(){const e=document.getElementById("admin-modal"),t=document.getElementById("modal-close-btn");t&&t.addEventListener("click",()=>e.close()),e==null||e.addEventListener("click",n=>{n.target===e&&e.close()})}function Ee(e,t){const n=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=e,document.getElementById("modal-body").innerHTML=t,n.showModal()}async function yt(){var a,s,r,d,m;if(!document.getElementById("dashboard-tab"))return;const t=document.getElementById("poster-sector-sel");t&&t.options.length<=1&&F.forEach(i=>{const c=new Option(i.sectorCode,i.id);t.appendChild(c)});const n=document.getElementById("poster-generate-btn");n&&!n.dataset.wired&&(n.dataset.wired="1",n.addEventListener("click",async()=>{const i=document.getElementById("poster-start-date"),c=document.getElementById("poster-end-date"),p=t==null?void 0:t.value,o=(i==null?void 0:i.value)||null,x=(c==null?void 0:c.value)||null;if(!p){E("warning","Validation Error","Please select a sector to generate the poster.");return}n.disabled=!0,n.textContent="Generating…";try{const l=await ke({sectorId:p,startDate:o,endDate:x,includeHidden:!1});if(!l||!l.length){E("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await vt(l,p)}catch(l){E("error","Generation Failed",l.message)}finally{n.disabled=!1,n.textContent="Generate Poster"}}),(a=document.getElementById("poster-download-jpg"))==null||a.addEventListener("click",()=>Pe("jpeg")),(s=document.getElementById("poster-download-pdf"))==null||s.addEventListener("click",()=>Pe("pdf")),(r=document.getElementById("poster-download-vid-1x1"))==null||r.addEventListener("click",()=>Se("1x1")),(d=document.getElementById("poster-download-vid-9x16"))==null||d.addEventListener("click",()=>Se("9x16")),(m=document.getElementById("poster-download-vid-16x9"))==null||m.addEventListener("click",()=>Se("16x9")))}async function Se(e){const t=document.getElementById("poster-sector-sel"),n=document.getElementById("poster-start-date"),a=document.getElementById("poster-end-date"),s=t==null?void 0:t.value,r=(n==null?void 0:n.value)||null,d=(a==null?void 0:a.value)||null;if(!s){E("warning","Validation Error","Please select a sector to generate the poster.");return}try{const m=await ke({sectorId:s,startDate:r,endDate:d,includeHidden:!1});if(!m||!m.length){E("warning","No Fares","No live fares found for the selected sector and dates.");return}await ft(e,m,s,F,P)}catch(m){console.error("Video generation failed",m)}}async function vt(e,t){const n=document.getElementById("poster-preview-container"),a=document.getElementById("poster-fares-tbody"),s=document.getElementById("poster-sector-title");if(!n||!a||!s)return;const r=F.find(l=>l.id===t),d=r?(r.sectorFrom||"DEP").toUpperCase():"DEP",m=r?(r.sectorTo||"ARR").toUpperCase():"ARR";s.innerHTML=`${d} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${m}`;const i=[...e].sort((l,b)=>{let y=l.flightDate,w=b.flightDate;return y instanceof Date&&(y=y.getTime()),w instanceof Date&&(w=w.getTime()),y-w}).slice(0,10),c={};P.forEach(l=>{l.id&&(c[l.id]=l),l.code&&(c[l.code]=l),l.name&&(c[l.name]=l)});async function p(l){try{const b=await fetch(l);if(!b.ok)return null;const y=await b.blob();return URL.createObjectURL(y)}catch{return null}}const o=[...new Set(i.map(l=>l.airlineId))].map(l=>c[l]).filter(l=>l==null?void 0:l.logoUrl),x={};await Promise.all(o.map(async l=>{const b=await p(l.logoUrl);b&&(x[l.id]=b)})),a.innerHTML=i.map((l,b)=>{const y=l.flightDate instanceof Date?l.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():l.flightDate,w=c[l.airlineId],u=b%2===0?"#ffffff":"#f8fafc",$=x[l.airlineId]||null,g=$?`<img src="${$}" style="height:40px;max-width:100px;object-fit:contain;display:block;margin:0 auto;" alt="${(w==null?void 0:w.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:15px;white-space:nowrap;">${(w==null?void 0:w.name)||l.airlineId||"—"}</span>`;let h='<span style="color:#94a3b8;font-size:14px;">—</span>';if(l.flightTime){const v=l.flightTime.split("-").map(k=>k.trim());v.length>=2?h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${v[0]} - ${v[1]}</span>`:h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${l.flightTime}</span>`}return`
      <tr style="background-color:${u};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 12px;font-weight:900;color:#0f172a;font-size:22px;white-space:nowrap;">${y}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${g}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${h}</td>
        <td style="padding:16px 12px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:8px 18px;border-radius:12px;font-weight:900;font-size:22px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            &#8377;${(l.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),n.classList.remove("hidden"),n.classList.add("flex")}function We(e){if(!e||e.nodeType!==1)return;const t=window.getComputedStyle(e),n=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const a of n){const s=t.getPropertyValue(a);if(s&&!s.startsWith("rgb")&&!s.startsWith("#")&&s!=="transparent"&&s!=="initial")try{e.style[a]=s}catch{}}for(const a of e.children)We(a)}async function Pe(e){const t=document.getElementById("poster-render-frame");if(!t)return;const n=document.getElementById("poster-download-jpg"),a=document.getElementById("poster-download-pdf");n&&(n.disabled=!0),a&&(a.disabled=!0);const s=t.style.transform;t.style.transform="none",E("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(t.querySelectorAll("img")).map(m=>m.complete?Promise.resolve():new Promise(i=>{m.onload=i,m.onerror=i})));const r=await html2canvas(t,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:m=>{const i=m.getElementById("poster-render-frame");i&&We(i)}});t.style.transform=s;const d=r.toDataURL("image/jpeg",.95);if(e==="jpeg"){const m=document.createElement("a");m.download=`zamra-poster-${Date.now()}.jpg`,m.href=d,m.click(),E("success","Downloaded!","JPEG poster saved successfully.")}else if(e==="pdf"){const m=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!m)throw new Error("jsPDF library not loaded.");const i=96/25.4,c=r.width/2/i,p=r.height/2/i,o=new m({orientation:c>p?"landscape":"portrait",unit:"mm",format:[c,p]});o.addImage(d,"JPEG",0,0,c,p),o.save(`zamra-poster-${Date.now()}.pdf`),E("success","Downloaded!","PDF poster saved successfully.")}}catch(r){console.error("Poster export error:",r),t.style.transform=s,E("error","Export Failed",r.message||"There was an error generating the export.")}finally{n&&(n.disabled=!1),a&&(a.disabled=!1)}}function te(e){const t=document.getElementById("report-fares-results");if(!t)return;if(!e||!e.length){t.innerHTML=`<div class="text-center text-text-muted py-14 px-4">
      <div class="inline-flex flex-col items-center gap-3 opacity-50">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <i class="bi bi-inbox text-3xl text-slate-400"></i>
        </div>
        <p class="font-semibold text-[14px]">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const n=Object.fromEntries(O.map(l=>[l.id,l.name])),a=Object.fromEntries(F.map(l=>[l.id,l.sectorCode])),s=Object.fromEntries(P.map(l=>[l.id,l.code])),{key:r,asc:d}=K.reportFares,m=[...e].sort((l,b)=>{let y=l[r],w=b[r];return y instanceof Date&&(y=y.getTime()),w instanceof Date&&(w=w.getTime()),typeof y=="string"&&(y=y.toLowerCase()),typeof w=="string"&&(w=w.toLowerCase()),y<w?d?-1:1:y>w?d?1:-1:0}),i=se.reportFares,c=Math.max(1,Math.ceil(e.length/i));B.reportFares>c&&(B.reportFares=c);const p=(B.reportFares-1)*i,o=m.slice(p,p+i),x=(l,b)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${l}">${b} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;t.innerHTML=`
    <div class="admin-table-container overflow-x-auto w-full rounded-none border-0 shadow-none">
      <table class="admin-table w-full text-sm">
        <thead><tr>
          ${x("flightDate","Date")}
          ${x("flightTime","Time")}
          ${x("sectorId","Sector")}
          ${x("airlineId","Airline")}
          ${x("agentId","Agent")}
          ${x("specialRate","SP Rate (₹)")}
          ${x("finalRate","Rate (₹)")}
          ${x("commission","Comm (₹)")}
          ${x("baggage","Bag")}
          ${x("extraBaggage","Ex.Bag")}
          ${x("isHidden","Status")}
          <th class="whitespace-nowrap">Actions</th>
        </tr></thead>
        <tbody>
          ${o.map((l,b)=>{const y=l.flightDate instanceof Date?l.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):l.flightDate||"—";return`<tr class="${b%2===1?"bg-slate-50/60":""} hover:bg-slate-100/80 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${y}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${l.flightTime||"—"}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${a[l.sectorId]||l.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${s[l.airlineId]||l.airlineId}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${n[l.agentId]||l.agentId}</td>
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
                <span class="admin-status-pill ${l.isHidden?"admin-status-hidden":"admin-status-live"}">
                  ${l.isHidden?"● Hidden":"● Live"}
                </span>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  <button onclick="window.__openEditFareModal('${l.id}')"
                    class="admin-action-btn admin-action-edit">Edit</button>
                  <button onclick="window.__toggleFare('${l.id}', ${!l.isHidden})"
                    class="admin-action-btn ${l.isHidden?"admin-action-show":"admin-action-toggle"}">
                    ${l.isHidden?"Show":"Hide"}
                  </button>
                  <button onclick="window.__deleteFare('${l.id}')"
                    class="admin-action-btn admin-action-delete">Del</button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,$e("reportFares",e.length,c,p,i),window.__deleteFare=async l=>{if(confirm("Delete this fare?"))try{await tt(l),T=T.filter(b=>b.id!==l),E("success","Deleted","Fare removed."),te(T)}catch(b){E("error","Error",b.message)}},window.__toggleFare=async(l,b)=>{try{await Ae(l,{isHidden:b}),T=T.map(y=>y.id===l?{...y,isHidden:b}:y),E("success","Updated",`Fare ${b?"hidden":"shown"}.`),te(T)}catch(y){E("error","Error",y.message)}},window.__updateFareRate=async(l,b,y)=>{const w=parseFloat(y)||0,u=T.find($=>$.id===l);if(!(!u||u[b]===w))try{const $={[b]:w};b==="specialRate"?($.commission=Math.max(0,u.finalRate-w),u.commission=$.commission):b==="finalRate"&&($.commission=Math.max(0,w-u.specialRate),u.commission=$.commission),await Ae(l,$),u[b]=w,E("success","Rate Updated","Fare successfully updated."),te(T)}catch($){E("error","Update Failed",$.message),te(T)}},we("reportFares"),window.__openEditFareModal=l=>{const b=T.find(u=>u.id===l);if(!b)return;let y="";if(b.flightDate instanceof Date){const u=b.flightDate.getTimezoneOffset();y=new Date(b.flightDate.getTime()-u*60*1e3).toISOString().split("T")[0]}else typeof b.flightDate=="string"&&(y=b.flightDate.split("T")[0]);const w=`
      <form id="edit-fare-form" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="admin-label text-[10px] mb-1">Date</label>
            <input type="date" id="ef-date" class="admin-control h-10" value="${y}" required>
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Time</label>
            <input type="text" id="ef-time" class="admin-control h-10" placeholder="e.g. 04:05 - 11:10" value="${b.flightTime||""}">
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="admin-label text-[10px] mb-1">Sector</label>
            <select id="ef-sector" class="admin-control h-10" required>
              ${F.map(u=>`<option value="${u.id}" ${u.id===b.sectorId?"selected":""}>${u.sectorCode}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Airline</label>
            <select id="ef-airline" class="admin-control h-10" required>
              <option value="">-- None --</option>
              ${P.map(u=>`<option value="${u.id}" ${u.id===b.airlineId?"selected":""}>${u.code}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Agent</label>
            <select id="ef-agent" class="admin-control h-10" required>
              <option value="">-- None --</option>
              ${O.map(u=>`<option value="${u.id}" ${u.id===b.agentId?"selected":""}>${u.name}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="admin-label text-[10px] mb-1">SP Rate (₹)</label>
            <input type="number" id="ef-sprate" class="admin-control h-10" value="${b.specialRate||0}" required>
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Final Rate (₹)</label>
            <input type="number" id="ef-finalrate" class="admin-control h-10" value="${b.finalRate||0}" required>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="admin-label text-[10px] mb-1">Baggage (kg)</label>
            <input type="number" id="ef-bag" class="admin-control h-10" value="${b.baggage||0}">
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Ex. Baggage (kg)</label>
            <input type="number" id="ef-exbag" class="admin-control h-10" value="${b.extraBaggage||0}">
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Status</label>
            <select id="ef-status" class="admin-control h-10">
              <option value="live" ${b.isHidden?"":"selected"}>Live</option>
              <option value="hidden" ${b.isHidden?"selected":""}>Hidden</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onclick="document.getElementById('admin-modal').close()" class="admin-btn admin-btn-ghost px-5">Cancel</button>
          <button type="submit" class="admin-btn admin-btn-primary px-5">Save Changes</button>
        </div>
      </form>
    `;Ee("Edit Fare",w),document.getElementById("edit-fare-form").onsubmit=async u=>{u.preventDefault();const $=u.target.querySelector('button[type="submit"]'),g=$.textContent;$.disabled=!0,$.textContent="Saving...";try{let h=document.getElementById("ef-date").value;const v={flightDate:h?new Date(h+"T00:00:00"):null,flightTime:document.getElementById("ef-time").value.trim(),sectorId:document.getElementById("ef-sector").value,airlineId:document.getElementById("ef-airline").value,agentId:document.getElementById("ef-agent").value,specialRate:parseFloat(document.getElementById("ef-sprate").value)||0,finalRate:parseFloat(document.getElementById("ef-finalrate").value)||0,baggage:parseFloat(document.getElementById("ef-bag").value)||0,extraBaggage:parseFloat(document.getElementById("ef-exbag").value)||0,isHidden:document.getElementById("ef-status").value==="hidden"};v.commission=Math.max(0,v.finalRate-v.specialRate),await Ae(l,v);const k=T.findIndex(N=>N.id===l);k!==-1&&(T[k]={...T[k],...v}),document.getElementById("admin-modal").close(),E("success","Updated","Fare updated successfully."),te(T)}catch(h){E("error","Error",h.message),$.disabled=!1,$.textContent=g}}}}async function Y(e=!0){e&&(O=await _e(),B.agents=1);const t=document.querySelector("#agents-tab .admin-table tbody");if(!t)return;const n=document.getElementById("agents-search"),a=document.getElementById("agents-limit");n&&!n.dataset.wired&&(n.dataset.wired="1",a&&(a.dataset.wired="1"),n.addEventListener("input",p=>{ve.agents=p.target.value,B.agents=1,Y(!1)}),a&&a.addEventListener("change",p=>{se.agents=parseInt(p.target.value),B.agents=1,Y(!1)}));const s=Fe(O,"agents"),r=se.agents,d=Math.max(1,Math.ceil(s.length/r));B.agents>d&&(B.agents=d);const m=(B.agents-1)*r,i=s.slice(m,m+r);t.innerHTML=i.length?i.map(p=>wt(p)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',$e("agents",s.length,d,m,r),delete t.dataset.actionsWired,Et(),$t(),Ct();const c=document.getElementById("agents-add-btn");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>Ve(null))),we("agents")}function wt(e){const t=e.isActive!==!1?'<span class="admin-status-pill admin-status-active">Active</span>':'<span class="admin-status-pill admin-status-inactive">Hidden</span>',n=e.commission!==void 0?`₹${Number(e.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id||"—"}</td>
    <td class="font-semibold">${e.name}</td>
    <td>${e.email||"—"}</td>
    <td>${e.contactPhone||"—"}</td>
    <td class="font-semibold text-navy">${n}</td>
    <td>${t}</td>
    <td class="flex gap-1 flex-wrap">
      <button data-action="edit-agent" data-id="${e.id}" class="admin-action-btn admin-action-edit">Edit</button>
      <button data-action="delete-agent" data-id="${e.id}" class="admin-action-btn admin-action-delete">Delete</button>
      <button data-action="toggle-agent" data-id="${e.id}" data-active="${e.isActive!==!1}"
        class="admin-action-btn ${e.isActive!==!1?"admin-action-toggle":"admin-action-show"}">
        ${e.isActive!==!1?"Hide Fares":"Show Fares"}</button>
    </td>
  </tr>`}function Et(){const e=document.querySelector("#agents-tab .admin-table tbody");!e||e.dataset.actionsWired||(e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const a=n.dataset.action,s=n.dataset.id,r=O.find(d=>d.id===s);if(a==="edit-agent"&&Ve(r),a==="delete-agent"){if(!confirm(`Delete agent "${r==null?void 0:r.name}"? This does NOT delete their fares.`))return;try{await nt(s),E("success","Deleted",`Agent "${r==null?void 0:r.name}" removed.`),await Y()}catch(d){E("error","Error",d.message)}}if(a==="toggle-agent"){const m=!(n.dataset.active==="true");n.disabled=!0,n.textContent="Working…";try{const i=await ot(s,m);E("success",m?"Agent Shown":"Agent Hidden",i.message),await Y()}catch(i){E("error","Toggle Failed",i.message),await Y()}}}))}function $e(e,t,n,a,s){const r=document.getElementById(`${e}-pagination-footer`);if(!r)return;const d=Math.min(a+s,t),m=B[e];r.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${t?a+1:0} to ${d} of ${t} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${m<=1?"disabled":""}>Previous</button>
        ${Array.from({length:n},(i,c)=>c+1).map(i=>`<button data-pg-action="goto" data-pg="${i}" class="admin-pagination-btn ${i===m?"admin-pagination-btn-active":""}">${i}</button>`).join("")}
        <button data-pg-action="next" class="admin-pagination-btn" ${m>=n?"disabled":""}>Next</button>
      </div>
    </div>`,r.dataset.wired||(r.dataset.wired="1",r.addEventListener("click",i=>{const c=i.target.closest("[data-pg-action]");if(!c||c.disabled)return;const p=c.dataset.pgAction;p==="prev"?B[e]=Math.max(1,B[e]-1):p==="next"?B[e]++:p==="goto"&&(B[e]=parseInt(c.dataset.pg)),e==="agents"?Y(!1):e==="sectors"?X(!1):e==="airlines"?ie(!1):e==="reportFares"&&te(T)}))}function Ve(e){var n,a;const t=!!e;Ee(t?"Edit Agent":"Add New Agent",`
    <form id="agent-form" class="flex flex-col gap-4">
      <div>
        <label class="admin-label text-[11px] mb-1">Agent ID *</label>
        <input name="id" required value="${(e==null?void 0:e.id)||""}" placeholder="e.g. AGENT1"
          ${t?'readonly class="admin-control cursor-not-allowed bg-slate-100 text-slate-500"':'class="admin-control"'}>
        ${t?'<p class="text-[11px] text-text-soft mt-1">Agent ID cannot be changed after creation.</p>':""}
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Name *</label>
        <input name="name" required value="${(e==null?void 0:e.name)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Email</label>
        <input name="email" type="email" value="${(e==null?void 0:e.email)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Phone</label>
        <input name="contactPhone" value="${(e==null?void 0:e.contactPhone)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Commission (₹) *</label>
        <input name="commission" type="number" min="0" required value="${(e==null?void 0:e.commission)!==void 0?e.commission:500}"
          class="admin-control"
          placeholder="e.g. 500">
        <p class="text-[11px] text-text-soft mt-1">This commission is auto-applied to all fares ingested for this agent.</p>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit"
          class="admin-btn admin-btn-primary flex-1 text-sm">
          ${t?"Save Changes":"Add Agent"}
        </button>
        <button type="button" id="modal-cancel"
          class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
      </div>
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(a=document.getElementById("agent-form"))==null||a.addEventListener("submit",async s=>{s.preventDefault();const r=new FormData(s.target),d=Object.fromEntries(r.entries()),m=s.target.querySelector("[type=submit]");m.disabled=!0,m.textContent="Saving…";try{t?(await at(e.id,d),E("success","Updated",`Agent "${d.name}" updated.`)):(await st(d),E("success","Added",`Agent "${d.name}" added.`)),document.getElementById("admin-modal").close(),await Y()}catch(i){E("error","Save Failed",i.message),m.disabled=!1,m.textContent=t?"Save Changes":"Add Agent"}})}function $t(){const e=document.getElementById("agents-bulk-delete-btn");!e||e.dataset.wired||(e.dataset.wired="1",e.addEventListener("click",async()=>{const t=document.getElementById("agents-bulk-agent-sel"),n=document.getElementById("agents-bulk-sector-sel"),a=document.getElementById("agents-bulk-start"),s=document.getElementById("agents-bulk-end"),r=(t==null?void 0:t.value)||null,d=(n==null?void 0:n.value)||null,m=(a==null?void 0:a.value)||null,i=(s==null?void 0:s.value)||null;if(!(r&&r!=="all"||d&&d!=="all"||m||i)){E("warning","No Filter","Select at least an agent, a sector, or a date range before deleting.");return}const p=[];if(r&&r!=="all"&&p.push(`Agent: ${t.options[t.selectedIndex].text}`),d&&d!=="all"&&p.push(`Sector: ${n.options[n.selectedIndex].text}`),m&&p.push(`from ${m}`),i&&p.push(`to ${i}`),!!confirm(`Delete ALL matching fares?
${p.join(" · ")}

This cannot be undone.`)){e.disabled=!0,e.textContent="Deleting…";try{const o=await it(r,m,i,d);E("success","Bulk Delete Complete",o.message)}catch(o){E("error","Bulk Delete Failed",o.message)}finally{e.disabled=!1,e.textContent="Bulk Delete"}}}))}function Ct(){const e=document.getElementById("agents-bulk-agent-sel");if(e){const n=e.value;e.innerHTML='<option value="">All Agents</option>',O.forEach(a=>e.appendChild(new Option(a.name,a.id))),n&&(e.value=n)}const t=document.getElementById("agents-bulk-sector-sel");if(t){const n=t.value;t.innerHTML='<option value="">All Sectors</option>',F.forEach(a=>t.appendChild(new Option(a.sectorCode,a.id))),n&&(t.value=n)}}async function X(e=!0){e&&(F=Re(await Te()),B.sectors=1);const t=document.getElementById("sectors-search"),n=document.getElementById("sectors-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",n.dataset.wired="1",t.addEventListener("input",p=>{ve.sectors=p.target.value,B.sectors=1,X(!1)}),n.addEventListener("change",p=>{se.sectors=parseInt(p.target.value),B.sectors=1,X(!1)}));const a=document.querySelector("#sectors-tab .admin-table tbody");if(!a)return;const s=Fe(F,"sectors"),r=se.sectors,d=Math.max(1,Math.ceil(s.length/r));B.sectors>d&&(B.sectors=d);const m=(B.sectors-1)*r,i=s.slice(m,m+r);a.innerHTML=i.length?i.map(p=>It(p)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',$e("sectors",s.length,d,m,r),At();const c=document.querySelector("#sectors-tab .flex.justify-between button");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>Je(null))),we("sectors")}function It(e){const t=ze(e);return`<tr data-sector-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id||"—"}</td>
    <td class="font-semibold">${t.sectorFrom}</td>
    <td class="font-semibold">${t.sectorTo}</td>
    <td><span class="font-mono font-bold text-primary">${t.sectorCode}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-sector" data-id="${e.id}" class="admin-action-btn admin-action-edit">Edit</button>
      <button data-action="delete-sector" data-id="${e.id}" class="admin-action-btn admin-action-delete">Delete</button>
      <button data-action="toggle-sector" data-id="${e.id}" data-hidden="${e.isHidden===!0}"
        class="admin-action-btn ${e.isHidden===!0?"admin-action-show":"admin-action-toggle"}">
        ${e.isHidden===!0?"Show Fares":"Hide Fares"}</button>
    </td>
  </tr>`}function At(){const e=document.querySelector("#sectors-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const{action:a,id:s}=n.dataset,r=F.find(d=>d.id===s);if(a==="edit-sector"&&Je(r),a==="delete-sector"){if(!confirm(`Delete sector "${r==null?void 0:r.sectorCode}"?`))return;try{await rt(s),E("success","Deleted",`Sector "${r==null?void 0:r.sectorCode}" removed.`),await X()}catch(d){E("error","Error",d.message)}}if(a==="toggle-sector"){const m=!(n.dataset.hidden==="true");n.disabled=!0,n.textContent="Working…";try{const i=await lt(s,m);E("success",`Sector Fares ${m?"Hidden":"Shown"}`,i.message),await X()}catch(i){E("error","Toggle Failed",i.message),await X()}}}))}function Je(e){var n,a;const t=!!e;Ee(t?"Edit Sector":"Add New Sector",`
    <form id="sector-form" class="flex flex-col gap-4">
      <div>
        <label class="admin-label text-[11px] mb-1">From City *</label>
        <input name="sectorFrom" required placeholder="e.g. Kozhikode" value="${(e==null?void 0:e.sectorFrom)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">To City *</label>
        <input name="sectorTo" required placeholder="e.g. Jeddah" value="${(e==null?void 0:e.sectorTo)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Sector Code *</label>
        <input name="sectorCode" required placeholder="e.g. CCJ JED" value="${(e==null?void 0:e.sectorCode)||""}"
          class="admin-control font-mono tracking-wide">
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="admin-btn admin-btn-primary flex-1 text-sm">
          ${t?"Save Changes":"Add Sector"}
        </button>
        <button type="button" id="modal-cancel" class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
      </div>
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(a=document.getElementById("sector-form"))==null||a.addEventListener("submit",async s=>{s.preventDefault();const r=new FormData(s.target),d=Object.fromEntries(r.entries());d.sectorCode=pe(d.sectorCode.toUpperCase()),d.sectorFrom=pe(d.sectorFrom.toUpperCase()),d.sectorTo=pe(d.sectorTo.toUpperCase());const m=s.target.querySelector("[type=submit]");m.disabled=!0,m.textContent="Saving…";try{t?(await dt(e.id,d),E("success","Updated","Sector updated.")):(await ct(d),E("success","Added",`Sector "${d.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await X()}catch(i){E("error","Save Failed",i.message),m.disabled=!1,m.textContent=t?"Save Changes":"Add Sector"}})}async function ie(e=!0){e&&(P=await Le(),B.airlines=1);const t=document.getElementById("airlines-search"),n=document.getElementById("airlines-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",n.dataset.wired="1",t.addEventListener("input",p=>{ve.airlines=p.target.value,B.airlines=1,ie(!1)}),n.addEventListener("change",p=>{se.airlines=parseInt(p.target.value),B.airlines=1,ie(!1)}));const a=document.querySelector("#flights-tab .admin-table tbody");if(!a)return;const s=Fe(P,"airlines"),r=se.airlines,d=Math.max(1,Math.ceil(s.length/r));B.airlines>d&&(B.airlines=d);const m=(B.airlines-1)*r,i=s.slice(m,m+r);a.innerHTML=i.length?i.map(p=>St(p)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "+ Add Flight".</td></tr>',$e("airlines",s.length,d,m,r),Bt();const c=document.querySelector("#flights-tab .flex.justify-between button");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>Ke(null))),we("airlines")}function St(e){const t=e.logoUrl?`<img src="${e.logoUrl}" class="h-7 w-7 object-contain rounded" alt="${e.name}">`:`<span class="w-7 h-7 bg-primary-light text-primary text-xs font-bold rounded flex items-center justify-center">${e.code}</span>`;return`<tr data-airline-id="${e.id}">
    <td>${t}</td>
    <td class="font-semibold">${e.name}</td>
    <td><span class="font-mono font-bold text-primary">${e.code}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-airline" data-id="${e.id}" class="admin-action-btn admin-action-edit">Edit</button>
      <button data-action="delete-airline" data-id="${e.id}" class="admin-action-btn admin-action-delete">Delete</button>
    </td>
  </tr>`}function Bt(){const e=document.querySelector("#flights-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const{action:a,id:s}=n.dataset,r=P.find(d=>d.id===s);if(a==="edit-airline"&&Ke(r),a==="delete-airline"){if(!confirm(`Delete airline "${r==null?void 0:r.name}" (${r==null?void 0:r.code})?`))return;try{await mt(s),E("success","Deleted",`Airline "${r==null?void 0:r.name}" removed.`),await ie()}catch(d){E("error","Error",d.message)}}}))}function Ke(e){var n,a;const t=!!e;Ee(t?"Edit Airline":"Add New Airline",`
    <form id="airline-form" class="flex flex-col gap-4">
      <div>
        <label class="admin-label text-[11px] mb-1">Airline Name *</label>
        <input name="name" required placeholder="e.g. Air India Express" value="${(e==null?void 0:e.name)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">IATA Code *</label>
        <input name="code" required maxlength="3" placeholder="e.g. IX" value="${(e==null?void 0:e.code)||""}"
          class="admin-control font-mono tracking-widest uppercase">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Logo (optional)</label>
        <input type="file" name="logoFile" accept="image/*"
          class="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary cursor-pointer">
        ${e!=null&&e.logoUrl?`<img src="${e.logoUrl}" class="mt-2 h-8 object-contain rounded" alt="current logo">`:""}
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="admin-btn admin-btn-primary flex-1 text-sm">
          ${t?"Save Changes":"Add Airline"}
        </button>
        <button type="button" id="modal-cancel" class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
      </div>
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(a=document.getElementById("airline-form"))==null||a.addEventListener("submit",async s=>{var c;s.preventDefault();const r=new FormData(s.target),d=((c=r.get("logoFile"))==null?void 0:c.size)>0?r.get("logoFile"):null,m={name:r.get("name"),code:r.get("code").toUpperCase()},i=s.target.querySelector("[type=submit]");i.disabled=!0,i.textContent="Saving…";try{t?(await pt(e.id,m,d),E("success","Updated","Airline updated.")):(await gt(m,d),E("success","Added",`Airline "${m.name}" added.`)),document.getElementById("admin-modal").close(),await ie()}catch(p){E("error","Save Failed",p.message),i.disabled=!1,i.textContent=t?"Save Changes":"Add Airline"}})}async function kt(){const e=document.getElementById("reports-tab");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=document.getElementById("reports-sector-sel");t&&t.options.length<=1&&F.forEach(d=>t.appendChild(new Option(d.sectorCode,d.id)));const n=document.getElementById("reports-agent-sel");n&&n.options.length<=1&&O.forEach(d=>n.appendChild(new Option(d.name,d.id)));const a=document.getElementById("generate-report-btn"),s=document.getElementById("reports-start-date"),r=document.getElementById("reports-end-date");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",async()=>{const d=(t==null?void 0:t.value)||"all",m=(n==null?void 0:n.value)||"all",i=(s==null?void 0:s.value)||null,c=(r==null?void 0:r.value)||null;if(d==="all"&&!i&&!c&&m==="all"){E("warning","No Filter Selected","Select at least a sector, an agent, or a date range.");return}a.disabled=!0,a.textContent="Generating…";try{const[p,o]=await Promise.all([ut(i,c,d,m),ke({sectorId:d,agentId:m,startDate:i,endDate:c,includeHidden:!0})]);T=o,Tt(p,e),B.reportFares=1,te(T)}catch(p){E("error","Report Failed",p.message)}finally{a.disabled=!1,a.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Tt(e,t){const{agentReport:n,sectorReport:a,totalFares:s}=e,r=document.getElementById("report-stats-row");if(r){r.classList.remove("hidden");const x=(T||[]).filter(g=>!g.isHidden).length,l=(T||[]).filter(g=>g.isHidden).length,b=new Set((T||[]).map(g=>g.agentId)).size,y=(T||[]).map(g=>g.finalRate||0).filter(g=>g>0),w=y.length?Math.round(y.reduce((g,h)=>g+h,0)/y.length):0,u=(g,h)=>{const v=document.getElementById(g);v&&(v.textContent=h.toLocaleString())};u("stat-total-fares",s),u("stat-live-fares",x),u("stat-hidden-fares",l),u("stat-agents-count",b);const $=document.getElementById("stat-avg-fare");$&&($.textContent=w>0?`₹${w.toLocaleString()}`:"—")}const d=document.getElementById("report-total-fares");d&&(d.textContent=`${s} fare${s!==1?"s":""} matched your filter`);const m=document.getElementById("bar-chart-container");m&&n.length&&Lt(n.slice(0,8),m);const i=document.getElementById("donut-chart-svg"),c=document.getElementById("pie-legend");i&&a.length&&Rt(a.slice(0,8),i,c);const p=document.getElementById("report-leaderboards");p&&(p.classList.remove("hidden"),Ft(n,a));const o=document.getElementById("download-report-csv");if(o){const x=o.cloneNode(!0);o.parentNode.replaceChild(x,o),x.addEventListener("click",()=>Dt(T)),T&&T.length?x.classList.remove("opacity-50","pointer-events-none"):x.classList.add("opacity-50","pointer-events-none")}E("success","Report Ready",`${s} fare${s!==1?"s":""} aggregated.`)}function Lt(e,t){const n=t.clientWidth||480,a=260,s={top:32,right:16,bottom:48,left:48},r=n-s.left-s.right,d=a-s.top-s.bottom,m=Math.max(...e.map(g=>g.count),1),i=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],c=4,p=Math.ceil(m/c),o=Array.from({length:c+1},(g,h)=>h*p),x=o.map(g=>{const h=s.top+d-g/(o[o.length-1]||1)*d;return`<line x1="${s.left}" y1="${h.toFixed(1)}" x2="${n-s.right}" y2="${h.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${s.left-6}" y="${(h+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${g}</text>`}).join(""),l=Math.min(48,r/e.length*.6),b=r/e.length,y=e.map((g,h)=>{const v=Math.max(4,g.count/(o[o.length-1]||1)*d),k=s.left+h*b+b/2-l/2,N=s.top+d-v,[q,z]=i[h%i.length],V=`bg${h}`,J=g.avgRate?`avg ₹${Math.round(g.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${V}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${q}"/>
              <stop offset="100%" stop-color="${z}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${g.name}" data-count="${g.count}" data-avg="${J}" style="cursor:pointer;">
              <rect x="${k.toFixed(1)}" y="${N.toFixed(1)}" width="${l}" height="${v.toFixed(1)}"
                rx="6" fill="url(#${V})" opacity="0.92"
                style="transform-origin:${(k+l/2).toFixed(1)}px ${(s.top+d).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${h*.07}s both;"/>
              <text x="${(k+l/2).toFixed(1)}" y="${(N-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${z}">${g.count}</text>
              <text x="${(k+l/2).toFixed(1)}" y="${(s.top+d+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(g.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),w="bar-tooltip";t.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${w}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${a}" viewBox="0 0 ${n} ${a}" style="overflow:visible;">
      ${x}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${s.left}" y1="${s.top+d}" x2="${n-s.right}" y2="${s.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${y}
    </svg>`;const u=t.querySelector("#bar-svg"),$=t.querySelector(`#${w}`);u&&$&&u.querySelectorAll(".bar-group").forEach(g=>{g.addEventListener("mousemove",h=>{const v=t.getBoundingClientRect();$.style.display="block",$.style.left=h.clientX-v.left+12+"px",$.style.top=h.clientY-v.top-40+"px";const k=g.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${g.dataset.avg}</span>`:"";$.innerHTML=`${g.dataset.name}<br><span style="color:#60a5fa;">${g.dataset.count} fares</span>${k}`}),g.addEventListener("mouseleave",()=>{$.style.display="none"})})}function Rt(e,t,n){const a=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],i=e.reduce((g,h)=>g+h.count,0),c=t.getElementById?t.getElementById("donut-segments"):t.querySelector("#donut-segments"),p=t.querySelector("#donut-center-count"),o=t.querySelector("#donut-center-label");if(!c)return;p&&(p.textContent=i),o&&(o.textContent="FARES");const x=(g,h,v,k)=>({x:g+v*Math.cos((k-90)*Math.PI/180),y:h+v*Math.sin((k-90)*Math.PI/180)});let l=0;const b=e.map((g,h)=>{const v=i>0?g.count/i*360:0,k=l+v,N=v>180?1:0,q=x(110,110,95,l),z=x(110,110,95,k),V=x(110,110,60,l),J=x(110,110,60,k),ee=[`M ${q.x.toFixed(2)} ${q.y.toFixed(2)}`,`A 95 95 0 ${N} 1 ${z.x.toFixed(2)} ${z.y.toFixed(2)}`,`L ${J.x.toFixed(2)} ${J.y.toFixed(2)}`,`A 60 60 0 ${N} 0 ${V.x.toFixed(2)} ${V.y.toFixed(2)}`,"Z"].join(" "),ne=l+v/2;l=k;const f=i>0?(g.count/i*100).toFixed(1):"0.0";return{pathD:ee,color:a[h%a.length],name:g.name,count:g.count,pct:f,mid:ne}}),y="http://www.w3.org/2000/svg";c.innerHTML="";const w=b.map((g,h)=>{const v=document.createElementNS(y,"path");return v.setAttribute("d",g.pathD),v.setAttribute("fill",g.color),v.setAttribute("stroke","white"),v.setAttribute("stroke-width","2"),v.style.cursor="pointer",v.style.transition="transform 0.2s, filter 0.2s",v.style.transformOrigin="110px 110px",v.setAttribute("data-index",h),c.appendChild(v),v}),u=g=>{w.forEach((h,v)=>{v===g?(h.style.transform="scale(1.04)",h.style.filter="brightness(1.1)",h.setAttribute("stroke-width","3")):(h.style.transform="scale(1)",h.style.filter="brightness(1)",h.setAttribute("stroke-width","2"))}),g>=0&&g<b.length?(p&&(p.textContent=b[g].count),o&&(o.textContent=b[g].name.split(" ")[0].toUpperCase().slice(0,7))):(p&&(p.textContent=i),o&&(o.textContent="FARES"))};if(w.forEach((g,h)=>{g.addEventListener("mouseover",()=>{u(h),$(h)}),g.addEventListener("mouseout",()=>{u(-1),$(-1)})}),n){n.innerHTML=b.map((h,v)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${v}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${h.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${h.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${h.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${h.pct}%</span>
      </div>`).join("");const g=h=>{n.querySelectorAll(".legend-row").forEach((v,k)=>{v.style.background=k===h?"#f1f5f9":""})};window._highlightLegendRows=g,n.querySelectorAll(".legend-row").forEach((h,v)=>{h.addEventListener("mouseover",()=>{u(v),g(v)}),h.addEventListener("mouseout",()=>{u(-1),g(-1)})})}function $(g){window._highlightLegendRows&&window._highlightLegendRows(g)}}function Ft(e,t){var r,d;const n=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],a=document.getElementById("leaderboard-agents");if(a&&e.length){const m=[...e].sort((c,p)=>p.count-c.count).slice(0,5),i=m[0].count||1;a.innerHTML=m.map((c,p)=>{const o=Math.max(6,Math.round(c.count/i*100));return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:16px;width:28px;text-align:center;flex-shrink:0;">${p===0?"🥇":p===1?"🥈":p===2?"🥉":`#${p+1}`}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${c.name}</span>
            <span style="color:${n[p]};margin-left:8px;">${c.count} fares</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${o}%;height:100%;background:${n[p]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}const s=document.getElementById("leaderboard-sectors");if(s&&t.length){const i=[...t.filter(o=>o.avgRate>0)].sort((o,x)=>o.avgRate-x.avgRate).slice(0,5),c=((r=i[0])==null?void 0:r.avgRate)||1,p=((d=i[i.length-1])==null?void 0:d.avgRate)||1;s.innerHTML=i.map((o,x)=>{const l=p>c?Math.max(6,Math.round((o.avgRate-c)/(p-c)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${x+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${o.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(o.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${l}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function Dt(e){if(!e||!e.length){E("warning","No Data","No fares to export. Apply filters and fetch first.");return}const t=Object.fromEntries(O.map(o=>[o.id,o.name])),n=Object.fromEntries(F.map(o=>[o.id,o.sectorCode])),a=Object.fromEntries(P.map(o=>[o.id,o.code||o.name])),s=o=>`"${String(o??"").replace(/"/g,'""')}"`,r=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],d=e.map(o=>{const x=o.flightDate instanceof Date?o.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):o.flightDate||"";return[s(x),s(o.flightTime||""),s(n[o.sectorId]||o.sectorId),s(a[o.airlineId]||o.airlineId),s(t[o.agentId]||o.agentId),s(o.specialRate||0),s(o.finalRate||0),s(o.commission||0),s(o.baggage||""),s(o.extraBaggage||""),s(o.isHidden?"Hidden":"Live")].join(",")}),m=[r.map(s).join(","),...d].join(`
`),i=new Blob(["\uFEFF"+m],{type:"text/csv;charset=utf-8;"}),c=URL.createObjectURL(i),p=document.createElement("a");p.href=c,p.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(p),p.click(),document.body.removeChild(p),URL.revokeObjectURL(c),E("success","CSV Downloaded",`${e.length} fares exported.`)}const Mt="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",Nt={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},je=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let Z=null,Q=JSON.parse(localStorage.getItem("zt_hist")||"[]"),De=Q.reduce((e,t)=>e+(t.rows||0),0);function Ht(){var t,n,a,s;const e=document.getElementById("rateData");e&&e.addEventListener("input",function(){const r=this.value.length,d=document.getElementById("charCount");d&&(d.textContent=r.toLocaleString()+" character"+(r!==1?"s":"")),ge(),clearTimeout(window._previewTimer),r>15?window._previewTimer=setTimeout(()=>jt(this.value),500):ye()}),(t=document.getElementById("resetBtn"))==null||t.addEventListener("click",()=>{e&&(e.value="");const r=document.getElementById("charCount");r&&(r.textContent="0 characters"),ye(),ge()}),(n=document.getElementById("clearBtn"))==null||n.addEventListener("click",()=>{Q=[],De=0,xe(),be(),Be()}),(a=document.getElementById("manualAgent"))==null||a.addEventListener("input",function(){const r=parseInt(this.value);Z=r>0?String(r):null,document.querySelectorAll(".rp-chip").forEach(d=>d.classList.remove("on")),Ye(),ge()}),(s=document.getElementById("submitBtn"))==null||s.addEventListener("click",Ot),Be(),be()}function Ut(){const e=document.getElementById("chipGrid");if(!e||e.children.length>0)return;const t=O.length?[...O].sort((n,a)=>{const s=parseInt(n.id),r=parseInt(a.id);return!isNaN(s)&&!isNaN(r)?s-r:n.id.localeCompare(a.id)}):[];if(!t.length){e.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>';return}t.forEach(n=>{const a=document.createElement("div");a.className="rp-chip",a.dataset.agentId=n.id,a.textContent=n.id,a.addEventListener("click",()=>Pt(n.id,n.name,a)),e.appendChild(a)})}function Pt(e,t,n){Z=e,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(a=>{a.classList.remove("on")}),n&&n.classList.add("on"),Ye(),ge()}function Ye(){const e=document.getElementById("agentPill");if(e)if(Z){const t=O.find(n=>n.id===Z);e.textContent=`Agent ${(t==null?void 0:t.id)||Z} selected ✓`,e.classList.remove("empty")}else e.textContent="No agent selected",e.classList.add("empty")}function ge(){const e=document.getElementById("rateData"),t=document.getElementById("submitBtn");t&&(t.disabled=!(Z&&e&&e.value.trim().length>10))}function Xe(e){const t=[];let n=null,a="IX";for(const s of e.split(`
`)){const r=s.replace(/[*_~`]/g,"").trim();if(!r)continue;const d=r.match(/([A-Z]{3})\s+([A-Z]{3})/);if(d&&r.length<70&&!r.match(/\d{4,6}/)){n=d[1]+"-"+d[2];const m=r.match(je);m&&(a=m[1]);continue}if(n){const m=r.match(je);if(m&&!r.match(/\d{4,6}/)){a=m[1];continue}const i=r.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(i){const c=parseInt(i[3]);c>=1e3&&c<=99999&&t.push({sector:n,date:`2026-${Nt[i[2].toUpperCase()]}-${i[1].padStart(2,"0")}`,airline:m?m[1]:a,rate:c})}}}return t}function jt(e){const t=Xe(e);if(!t.length){ye();return}const n=document.getElementById("prevBox");n&&n.classList.add("on");const a=document.getElementById("prevCount");a&&(a.textContent=t.length+" entr"+(t.length===1?"y":"ies"));const s=document.getElementById("prevBody");s&&(s.innerHTML=t.slice(0,60).map(r=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${r.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${r.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${r.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${r.rate.toLocaleString()}</td></tr>`).join(""),t.length>60&&(s.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${t.length-60} more</td></tr>`))}function ye(){var e;(e=document.getElementById("prevBox"))==null||e.classList.remove("on")}async function Ot(){const e=document.getElementById("rateData");if(!Z||!(e!=null&&e.value.trim()))return;const t=document.getElementById("submitBtn"),n=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI...';const a=document.getElementById("progBar"),s=document.getElementById("progFill");a&&a.classList.add("on");let r=0;const d=setInterval(()=>{r=Math.min(r+Math.random()*13,85),s&&(s.style.width=r+"%")},280),m=Xe(e.value),i={id:Date.now(),agent:Z,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:m.length,status:"pen"};Q.unshift(i),Q.length>15&&Q.pop(),xe(),be();try{const c=await fetch(Mt,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:Z,raw_text:e.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(d),s&&(s.style.width="100%"),c.ok)i.status="ok",De+=m.length,xe(),be(),Be(),E("success","Submitted","Rates dispatched to AI Agent. The database will reflect parsing results momentarily."),setTimeout(()=>{e.value="";const p=document.getElementById("charCount");p&&(p.textContent="0 characters"),ye(),ge()},500);else throw new Error("N8N webhook rejected payload")}catch(c){clearInterval(d),s&&(s.style.width="100%"),i.status="err",xe(),be(),E("error","Submission Failed",c.message)}setTimeout(()=>{a&&a.classList.remove("on"),s&&(s.style.width="0%"),t.innerHTML=n,ge()},900)}function Be(){const e=document.getElementById("statSubs");e&&(e.textContent=Q.length);const t=document.getElementById("statEntries");t&&(t.textContent=De)}function xe(){localStorage.setItem("zt_hist",JSON.stringify(Q))}function be(){const e=document.getElementById("historyWrap");if(e){if(!Q.length){e.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}e.innerHTML=Q.map(t=>{var a;const n=((a=O.find(s=>s.id===t.agent))==null?void 0:a.name)||`Agent ${t.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${n.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${n}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${t.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${t.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${t.status==="ok"?"bg-green-500":t.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}const qt=210/25.4*96,_t=297/25.4*96;function Oe(){const e=document.getElementById("eticket-output-wrapper"),t=document.getElementById("eticket-print-area");if(!e||!t||e.classList.contains("hidden"))return;t.style.zoom="1",t.style.removeProperty("--eticket-print-scale");const n=Math.max(t.scrollWidth,t.offsetWidth),a=Math.max(t.scrollHeight,t.offsetHeight);if(!n||!a)return;const s=qt/n,r=_t/a;let d=Math.min(1,s,r);d<1&&(d=Math.max(.7,d*.985)),t.style.zoom=String(d),t.style.setProperty("--eticket-print-scale",String(d))}function zt(){const e=document.getElementById("eticket-print-area");e&&(e.style.zoom="1",e.style.removeProperty("--eticket-print-scale"))}async function Gt(){var m;const e=document.getElementById("eticket-tab");if(!e)return;const t=document.getElementById("eticket-form"),n=document.getElementById("et-add-passenger"),a=document.getElementById("et-passengers-container"),s=document.getElementById("et-airline"),r=document.getElementById("et-origin"),d=document.getElementById("et-destination");if(P.length===0&&(P=await Le()),F.length===0&&(F=Re(await Te())),!e.dataset.wired){if(e.dataset.wired="1",s&&P&&(s.innerHTML='<option value="">Select Airline</option>'+P.map(c=>`<option value="${c.name}">${c.name}</option>`).join("")),r&&F){const c=[...new Set(F.map(p=>p.sectorFrom).filter(Boolean))].sort();r.innerHTML='<option value="">Select Origin</option>'+c.map(p=>`<option value="${p}">${p}</option>`).join("")}if(d&&F){const c=[...new Set(F.map(p=>p.sectorTo).filter(Boolean))].sort();d.innerHTML='<option value="">Select Destination</option>'+c.map(p=>`<option value="${p}">${p}</option>`).join("")}const i=()=>{const c=Array.from(a.querySelectorAll(".et-pax-row"));c.forEach((p,o)=>{const x=p.querySelector(".et-passenger-index");x&&(x.textContent=`Passenger ${o+1}`);const l=p.querySelector(".et-remove-passenger");l&&(c.length<=1?(l.classList.add("opacity-40","pointer-events-none"),l.setAttribute("aria-disabled","true")):(l.classList.remove("opacity-40","pointer-events-none"),l.removeAttribute("aria-disabled")))})};n==null||n.addEventListener("click",()=>{a.insertAdjacentHTML("beforeend",`
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
              <select name="paxTitle[]" class="admin-control h-10">
                <option value="MR">MR</option>
                <option value="MRS">MRS</option>
                <option value="MS">MS</option>
                <option value="MSTR">MSTR</option>
                <option value="MISS">MISS</option>
              </select>
            </div>

            <div class="md:col-span-4">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Passenger Name *</label>
              <input type="text" name="paxName[]" required placeholder="e.g. JOHN DOE" class="admin-control h-10 uppercase placeholder:normal-case">
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Category</label>
              <select name="paxType[]" class="admin-control h-10">
                <option value="ADT">Adult</option>
                <option value="CHD">Child</option>
                <option value="INF">Infant</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Cabin Bag</label>
              <select name="paxCarryBag[]" class="admin-control h-10">
                <option value="7 Kg" selected>7 Kg</option>
                <option value="10 Kg">10 Kg</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Check-in Bag</label>
              <select name="paxCheckBag[]" class="admin-control h-10">
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
      `),i()}),a==null||a.addEventListener("click",c=>{var o;const p=c.target.closest(".et-remove-passenger");p&&((o=p.closest(".et-pax-row"))==null||o.remove(),i())}),a.children.length===0&&(n==null||n.click()),i(),t==null||t.addEventListener("submit",async c=>{c.preventDefault(),await Wt(new FormData(t))}),(m=document.getElementById("et-print-btn"))==null||m.addEventListener("click",()=>{Oe(),requestAnimationFrame(()=>window.print())}),window.addEventListener("beforeprint",Oe),window.addEventListener("afterprint",zt),t==null||t.addEventListener("reset",()=>{setTimeout(()=>{var c;Array.from(a.children).forEach((p,o)=>{o>0&&p.remove()}),a.children.length===0&&(n==null||n.click()),i(),(c=document.getElementById("eticket-output-wrapper"))==null||c.classList.add("hidden")},10),E("info","Form Reset","The E-Ticket form has been cleared.")})}}async function Wt(e){var fe,H,R;const t=(fe=e.get("etPnr"))==null?void 0:fe.toUpperCase(),n=(H=e.get("etAirline"))==null?void 0:H.toUpperCase(),a=(R=e.get("etFlightNo"))==null?void 0:R.toUpperCase(),s=e.get("etDate"),r=e.get("etDepTime"),d=e.get("etArrTime"),m=e.get("etPhone"),i=(C="")=>String(C).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),c=C=>{const D=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec(C||"");return D?Number(D[1])*60+Number(D[2]):null},p=(C="")=>C.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",o=C=>{const D=(C||"").trim();let M=D,de="";const j=D.match(/^(.*?)\s*\((.*?)\)$/);return j&&(M=j[1].trim(),de=j[2].trim()),{city:M,code:de}},x=o(e.get("etOrigin")),l=o(e.get("etDest")),b=e.get("etOrigin")||"—",y=e.get("etDest")||"—";let w="—";if(s){const C=new Date(s);if(!isNaN(C.getTime())){const D=["SUN","MON","TUE","WED","THU","FRI","SAT"],M=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];w=`${D[C.getDay()]}, ${String(C.getDate()).padStart(2,"0")} ${M[C.getMonth()]} ${C.getFullYear()}`}}const u=C=>document.getElementById(C);let $=x.code,g=l.code,h=null;if(typeof F<"u"){if(h=F.find(C=>C.sectorFrom===b&&C.sectorTo===y),!h&&b){const C=F.find(D=>D.sectorFrom===b);C&&C.sectorCode&&($=C.sectorCode.split(/[ -]+/)[0])}if(!h&&y){const C=F.find(D=>D.sectorTo===y);C&&C.sectorCode&&(g=C.sectorCode.split(/[ -]+/).pop())}}const v=($||p(x.city)).toUpperCase(),k=(g||p(l.city)).toUpperCase(),N=`${v} - ${k}`,q=`${(x.city||b).toUpperCase()} to ${(l.city||y).toUpperCase()}`,z=(x.city||b).toUpperCase(),V=(l.city||y).toUpperCase(),J=c(r),ee=c(d);let ne="N/A";if(J!==null&&ee!==null){let C=ee-J;C<0&&(C+=24*60);const D=Math.floor(C/60),M=C%60;ne=`${D}h ${String(M).padStart(2,"0")}m`}u("t-pnr")&&(u("t-pnr").textContent=t||"—"),u("t-issued-by")&&(u("t-issued-by").textContent=n||"—"),u("t-customer-phone")&&(u("t-customer-phone").textContent=m||"—"),u("t-flight-code")&&(u("t-flight-code").textContent=a||"—"),u("t-travel-date")&&(u("t-travel-date").textContent=w||"—"),u("t-route-code")&&(u("t-route-code").textContent=N),u("t-route-long")&&(u("t-route-long").textContent=q),u("t-duration")&&(u("t-duration").textContent=ne);const f=new Date,I=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],A=`${String(f.getDate()).padStart(2,"0")} ${I[f.getMonth()]} ${f.getFullYear()} ${String(f.getHours()).padStart(2,"0")}:${String(f.getMinutes()).padStart(2,"0")}`;u("t-booked-on")&&(u("t-booked-on").textContent=A);const L=u("t-airline-logo"),S=u("t-issued-by-fallback");if(L){const C=typeof P<"u"?P.find(D=>D.name.toUpperCase()===n):null;C&&C.logoUrl?(L.src=C.logoUrl,L.classList.remove("hidden"),S&&S.classList.add("hidden")):(L.removeAttribute("src"),L.classList.add("hidden"),S&&(S.classList.remove("hidden"),S.textContent=(n||"No logo").toUpperCase()))}const ue=e.getAll("paxTitle[]"),_=e.getAll("paxName[]"),re=e.getAll("paxType[]"),oe=e.getAll("paxCheckBag[]"),G=e.getAll("paxCarryBag[]");u("t-pax-count")&&(u("t-pax-count").textContent=String(_.length));const U=document.getElementById("t-passengers-tbody");if(U){const C=_.map((D,M)=>{const de=i((ue[M]||"MR").toUpperCase()),j=i((_[M]||"").toUpperCase()),Ce=i((re[M]||"ADT").toUpperCase()),he=i((oe[M]||"—").toUpperCase()),ce=i((G[M]||"—").toUpperCase()),me=h&&h.sectorCode?i(h.sectorCode.toUpperCase()):i(N);return`
        <tr class="${M%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${M+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${de}. ${j}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Ce}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${me}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${i(a||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${i(t||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${ce}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${he}</td>
        </tr>
      `}).join("");U.innerHTML=C||`
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `}const W=document.getElementById("t-travel-tbody");W&&(W.innerHTML=`
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${i(a||"—")}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${i(z)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${i(v)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${i(r||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${i(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${i(V)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${i(k)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${i(d||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${i(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const le=document.getElementById("eticket-output-wrapper");le&&(le.classList.remove("hidden"),le.scrollIntoView({behavior:"smooth"}))}const qe={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function E(e,t,n){const a=document.getElementById("toastsEl");if(!a)return;const s=document.createElement("div"),r={success:"border-green-500 bg-green-50 text-green-800",error:"border-red-500 bg-red-50 text-red-800",warning:"border-yellow-500 bg-yellow-50 text-yellow-800",info:"border-primary bg-primary/10 text-[var(--color-primary-dark)]"};s.className=`flex items-start gap-3 p-4 border-l-4 rounded shadow-md w-80 pointer-events-auto ${r[e]||r.error}`,s.innerHTML=`<div class="mt-0.5">${qe[e]||qe.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${t}</div><div class="text-xs opacity-90 mt-1">${n}</div></div>
    <button class="opacity-50 hover:opacity-100" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,a.appendChild(s),setTimeout(()=>s.isConnected&&s.remove(),7e3)}window.toast=E;document.addEventListener("DOMContentLoaded",()=>{});
