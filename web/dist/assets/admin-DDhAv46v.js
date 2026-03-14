import"./firebase-config-zYKzaodH.js";import{o as bt,l as ht}from"./auth-Lqacc0Nd.js";import{a as Re,d as Oe,u as ke,c as nt,e as xt,f as yt,h as vt,i as wt,j as $t,g as qe,k as Et,l as It,m as St,n as Bt,b as _e,o as Ct,p as At,q as Tt,r as Lt,s as kt}from"./db-DzAbaNrJ.js";async function Dt(e,t,n,o,a){const i=`Generating ${e} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",i),new Promise(async(d,l)=>{try{let le=function(x,B,C,R,T){s.beginPath(),s.moveTo(x+T,B),s.lineTo(x+C-T,B),s.arcTo(x+C,B,x+C,B+T,T),s.lineTo(x+C,B+R-T),s.arcTo(x+C,B+R,x+C-T,B+R,T),s.lineTo(x+T,B+R),s.arcTo(x,B+R,x,B+R-T,T),s.lineTo(x,B+T),s.arcTo(x,B,x+T,B,T),s.closePath()},ce=function(x){var Ie;const B=x-ae;if(B>ne){try{V.stop()}catch(O){console.error("Error stopping recorder",O)}return}s.fillStyle="#f8fafc",s.fillRect(0,0,r,m);const C=e==="9x16"?400:300;if(s.fillStyle="#1e293b",s.fillRect(0,0,r,C),E.complete&&E.width>0){s.globalAlpha=.2;const O=Math.max(r/E.width,C/E.height),M=E.width*O,I=E.height*O,H=(r-M)/2,j=(C-I)/2;s.drawImage(E,H,j,M,I),s.globalAlpha=1}const R=s.createLinearGradient(0,0,0,C);R.addColorStop(0,"#1e293b"),R.addColorStop(1,"transparent"),s.fillStyle=R,s.globalAlpha=.8,s.fillRect(0,0,r,C),s.globalAlpha=1,s.textAlign="center",s.textBaseline="middle";const T=s.createLinearGradient(0,0,r,0);T.addColorStop(0,"#2563eb"),T.addColorStop(.5,"#60a5fa"),T.addColorStop(1,"#1558c0"),s.fillStyle=T,s.fillRect(0,0,r,16);const Ee=200,J=40,ge=60;s.fillStyle="rgba(37, 99, 235, 0.4)",le(r/2-Ee/2,ge,Ee,J,20),s.fill(),s.strokeStyle="rgba(37, 99, 235, 0.6)",s.lineWidth=1,s.stroke(),s.fillStyle="#bfdbfe",s.font="bold 16px Arial, sans-serif",s.fillText("EXCLUSIVE DEALS",r/2,ge+J/2),s.fillStyle="#ffffff",s.font="900 "+(e==="16x9"?"70px":"56px")+" Arial, sans-serif",s.fillText(`${c} → ${p}`,r/2,ge+80),s.fillStyle="#dbeafe",s.font="700 24px Arial, sans-serif",s.fillText("SPECIAL FARES AVAILABLE NOW",r/2,ge+140);const me=C+60,Z=90,z=e==="9x16"?40:e==="1x1"?80:160,Q=r-z*2;s.fillStyle="#64748b",s.font="bold 18px Arial, sans-serif",s.textAlign="left",s.fillText("DATE",z+20,me-20),s.textAlign="center",s.fillText("AIRLINE",z+Q*.35,me-20),s.fillText("TIME",z+Q*.65,me-20),s.textAlign="right",s.fillText("FARE",z+Q-20,me-20);for(let O=0;O<y.length;O++){const M=y[O],I=1e3+O*800;if(B<I)continue;const j=Math.min(1,(B-I)/500),be=20*(1-j),W=me+O*Z+be;s.globalAlpha=j,O%2===0&&(s.fillStyle="#ffffff",le(z,W,Q,Z-10,12),s.fill()),s.fillStyle="#0f172a",s.textBaseline="middle";const Ne=M.flightDate instanceof Date?M.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():M.flightDate;s.textAlign="left",s.font="900 26px Arial, sans-serif",s.fillText(Ne,z+20,W+Z/2-5);const Le=z+Q*.35,he=h[M.airlineId];if(he&&he.width>0){const ue=Math.min(100,he.width),Xe=40;s.drawImage(he,Le-ue/2,W+Z/2-5-Xe/2,ue,Xe)}else{s.font="700 20px Arial, sans-serif",s.textAlign="center";const ue=((Ie=w[M.airlineId])==null?void 0:Ie.name)||M.airlineId||"—";s.fillText(ue,Le,W+Z/2-5)}let xe=M.flightTime||"—";if(xe.includes("-")){const ue=xe.split("-");xe=`${ue[0].trim()} - ${ue[1].trim()}`}s.font="800 22px Arial, sans-serif",s.textAlign="center",s.fillText(xe,z+Q*.65,W+Z/2-5);const je=`₹${(M.finalRate||0).toLocaleString()}`;s.font="900 26px Arial, sans-serif",s.textAlign="right";const ft=s.measureText(je).width,Je=z+Q-20,Ke=ft+40,Ye=50;s.fillStyle="#0f172a",le(Je-Ke,W+Z/2-5-Ye/2,Ke,Ye,12),s.fill(),s.fillStyle="#ffffff",s.fillText(je,Je-20,W+Z/2-5),s.globalAlpha=1}const fe=1e3+y.length*800+500;if(B>fe){const O=Math.min(1,(B-fe)/500);s.globalAlpha=O;const M=100,I=m-M+20*(1-O);s.fillStyle="#ffffff",s.fillRect(0,m-M,r,M),s.fillRect(0,I,r,M),s.fillStyle="#f1f5f9",s.fillRect(0,m-M,r,2),f.complete&&f.width>0&&s.drawImage(f,z,m-M/2-24,48,48),s.fillStyle="#1e293b",s.font="900 24px Arial, sans-serif",s.textAlign="left",s.textBaseline="middle",s.fillText("Zamra Travels",z+64,m-M/2),s.font="700 20px Arial, sans-serif",s.textAlign="right",s.fillText("zamratravels.com  |  +91 98765 43210",r-z,m-M/2),s.globalAlpha=1}requestAnimationFrame(ce)},r,m;if(e==="1x1")r=1080,m=1080;else if(e==="9x16")r=1080,m=1920;else if(e==="16x9")r=1920,m=1080;else throw new Error("Invalid ratio selected");const u=document.createElement("canvas");u.width=r,u.height=m;const s=u.getContext("2d");s.imageSmoothingEnabled=!0;const g=o.find(x=>x.id===n),c=g?(g.sectorFrom||"DEP").toUpperCase():"DEP",p=g?(g.sectorTo||"ARR").toUpperCase():"ARR",y=[...t].sort((x,B)=>{let C=x.flightDate,R=B.flightDate;return C instanceof Date&&(C=C.getTime()),R instanceof Date&&(R=R.getTime()),C-R}).slice(0,10),w={};a.forEach(x=>{x.id&&(w[x.id]=x),x.code&&(w[x.code]=x),x.name&&(w[x.name]=x)});async function b(x){if(!x)return null;try{const B=await fetch(x);if(!B.ok)return null;const C=await B.blob(),R=URL.createObjectURL(C);return new Promise((T,Ee)=>{const J=new Image;J.onload=()=>T(J),J.onerror=()=>T(null),J.src=R})}catch{return null}}const E=new Image;await new Promise(x=>{E.onload=x,E.onerror=x,E.src="/assets/img/hero-bg.webp"});const f=new Image;await new Promise(x=>{f.onload=x,f.onerror=x,f.src="/assets/img/logo.webp"});const h={},$=[...new Set(y.map(x=>x.airlineId))].map(x=>w[x]).filter(x=>x==null?void 0:x.logoUrl);await Promise.all($.map(async x=>{const B=await b(x.logoUrl);B&&(h[x.id]=B)}));const L=u.captureStream(30);let P="video/mp4";MediaRecorder.isTypeSupported(P)||(P="video/webm; codecs=h264",MediaRecorder.isTypeSupported(P)||(P="video/webm"));const V=new MediaRecorder(L,{mimeType:P}),X=[];V.ondataavailable=x=>{x.data&&x.data.size>0&&X.push(x.data)},V.start(100);const ne=1e4+y.length*1500,ae=performance.now();requestAnimationFrame(ce),V.onstop=()=>{const x=new Blob(X,{type:P}),B=URL.createObjectURL(x),C=document.createElement("a");C.href=B,C.download=`zamra-video-${e}-${Date.now()}.mp4`,C.style.display="none",document.body.appendChild(C),C.click(),setTimeout(()=>{document.body.removeChild(C),URL.revokeObjectURL(B)},100),window.toast&&window.toast("success","Video Generated",`Your ${e} video has been downloaded!`),d()},V.onerror=x=>{console.error("Recorder Error:",x),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),l(x)}}catch(r){console.error(r),window.toast&&window.toast("error","Generation Failed",r.message),l(r)}})}let _=[],D=[],U=[],k=[],Y=[],G={},K=new Set;function ye(e){return e==null?e:String(e).replace(/damamm/gi,t=>t===t.toUpperCase()?"DAMMAM":t===t.toLowerCase()?"dammam":"Dammam")}function at(e={}){return{...e,sectorFrom:ye(e.sectorFrom||""),sectorTo:ye(e.sectorTo||""),sectorCode:ye(e.sectorCode||"")}}function ze(e=[]){return e.map(t=>at(t))}function F(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function N(e,t=0){const n=Number(e);return Number.isFinite(n)?n:t}function $e(e){if(e==null||e==="")return 0;const t=parseFloat(String(e).replace(/[^\d.]/g,""));return Number.isFinite(t)?t:0}function Ce(e){if(!e)return null;if(e instanceof Date)return Number.isNaN(e.getTime())?null:e;const t=new Date(e);return Number.isNaN(t.getTime())?null:t}function Me(e){const t=Ce(e);if(!t)return"";const n=t.getTimezoneOffset();return new Date(t.getTime()-n*60*1e3).toISOString().split("T")[0]}function ot(e){if(!e)return null;const t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?null:t}function Ft(e){if(!e)return null;const t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?null:t.getTime()}function Rt(e){if(!e)return null;const t=new Date(`${e}T23:59:59.999`);return Number.isNaN(t.getTime())?null:t.getTime()}let ee={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},reportFares:{key:"flightDate",asc:!0},databaseFares:{key:"flightDate",asc:!0}},He={agents:"",sectors:"",airlines:""},te={agents:10,sectors:10,airlines:10,reportFares:20,databaseFares:20},S={agents:1,sectors:1,airlines:1,reportFares:1,databaseFares:1};const A={search:"",agentId:"all",sectorId:"all",airlineId:"all",status:"all",startDate:"",endDate:""};function Ge(e,t){var d;let n=e;const o=(d=He[t])==null?void 0:d.toLowerCase();o&&t==="agents"?n=n.filter(l=>(l.name||"").toLowerCase().includes(o)||(l.email||"").toLowerCase().includes(o)||(l.contactPhone||"").toLowerCase().includes(o)||(l.id||"").toLowerCase().includes(o)):o&&t==="sectors"?n=n.filter(l=>(l.sectorFrom||"").toLowerCase().includes(o)||(l.sectorTo||"").toLowerCase().includes(o)||(l.sectorCode||"").toLowerCase().includes(o)):o&&t==="airlines"&&(n=n.filter(l=>(l.name||"").toLowerCase().includes(o)||(l.code||"").toLowerCase().includes(o)));const{key:a,asc:i}=ee[t];return a&&(n=[...n].sort((l,r)=>{let m=l[a],u=r[a];if(m instanceof Date&&(m=m.getTime()),u instanceof Date&&(u=u.getTime()),a==="id"){const s=parseInt(m),g=parseInt(u);if(!isNaN(s)&&!isNaN(g))return i?s-g:g-s}return typeof m=="string"&&(m=m.toLowerCase()),typeof u=="string"&&(u=u.toLowerCase()),m<u?i?-1:1:m>u?i?1:-1:0})),n}function Ae(e){document.querySelectorAll(`th[data-sort-tab="${e}"] i`).forEach(n=>{n.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const t=document.querySelector(`th[data-sort-tab="${e}"][data-sort-key="${ee[e].key}"]`);if(t){const n=t.querySelector("i");n&&(n.className=`bi bi-arrow-${ee[e].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",e=>{const t=e.target.closest("th[data-sort-tab]");if(!t)return;const n=t.dataset.sortTab,o=t.dataset.sortKey;ee[n].key===o?ee[n].asc=!ee[n].asc:(ee[n].key=o,ee[n].asc=!0),n==="agents"?oe(!1):n==="sectors"?ie(!1):n==="airlines"?pe(!1):n==="reportFares"&&k.length?de(k):n==="databaseFares"&&q()});document.documentElement.style.visibility="hidden";bt(async e=>{if(!e){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const t=document.getElementById("admin-user-name");t&&(t.textContent=e.email.split("@")[0]),await Mt(),gn(),await it()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("admin-logout-btn");e&&e.addEventListener("click",async()=>{(await ht()).success&&(window.location.href="/login.html")}),Nt(),Ht(),pn()});async function Mt(){try{const[e,t,n]=await Promise.all([nt(),qe(),_e()]);_=e,D=ze(t),U=n}catch(e){console.error("loadGlobalData error:",e)}}function Ht(){const e=document.querySelectorAll(".nav-link"),t=document.querySelectorAll(".tab-content"),n=document.getElementById("page-title");e.forEach(o=>{o.addEventListener("click",async a=>{var l;a.preventDefault(),e.forEach(r=>{r.classList.remove("active","text-primary"),r.classList.add("text-text-muted")}),o.classList.remove("text-text-muted"),o.classList.add("active","text-primary");const i=o.getAttribute("data-tab"),d=o.getAttribute("data-title");t.forEach(r=>r.classList.remove("active")),(l=document.getElementById(i))==null||l.classList.add("active"),n&&d&&(n.textContent=d),await it()})})}async function it(){const e=document.querySelector(".tab-content.active");if(!e)return;const t=e.id;t==="agents-tab"?await oe():t==="sectors-tab"?await ie():t==="flights-tab"?await pe():t==="dashboard-tab"?await jt():t==="reports-tab"?await Jt():t==="database-tab"?await We():t==="eticket-tab"&&await wn()}function Nt(){const e=document.getElementById("admin-modal"),t=document.getElementById("modal-close-btn");t&&t.addEventListener("click",()=>e.close()),e==null||e.addEventListener("click",n=>{n.target===e&&e.close()})}function Te(e,t){const n=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=e,document.getElementById("modal-body").innerHTML=t,n.showModal()}async function jt(){var o,a,i,d,l;if(!document.getElementById("dashboard-tab"))return;const t=document.getElementById("poster-sector-sel");t&&t.options.length<=1&&D.forEach(r=>{const m=new Option(r.sectorCode,r.id);t.appendChild(m)});const n=document.getElementById("poster-generate-btn");n&&!n.dataset.wired&&(n.dataset.wired="1",n.addEventListener("click",async()=>{const r=document.getElementById("poster-start-date"),m=document.getElementById("poster-end-date"),u=t==null?void 0:t.value,s=(r==null?void 0:r.value)||null,g=(m==null?void 0:m.value)||null;if(!u){v("warning","Validation Error","Please select a sector to generate the poster.");return}n.disabled=!0,n.textContent="Generating…";try{const c=await Re({sectorId:u,startDate:s,endDate:g,includeHidden:!1});if(!c||!c.length){v("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await Ut(c,u)}catch(c){v("error","Generation Failed",c.message)}finally{n.disabled=!1,n.textContent="Generate Poster"}}),(o=document.getElementById("poster-download-jpg"))==null||o.addEventListener("click",()=>Ze("jpeg")),(a=document.getElementById("poster-download-pdf"))==null||a.addEventListener("click",()=>Ze("pdf")),(i=document.getElementById("poster-download-vid-1x1"))==null||i.addEventListener("click",()=>Ue("1x1")),(d=document.getElementById("poster-download-vid-9x16"))==null||d.addEventListener("click",()=>Ue("9x16")),(l=document.getElementById("poster-download-vid-16x9"))==null||l.addEventListener("click",()=>Ue("16x9")))}async function Ue(e){const t=document.getElementById("poster-sector-sel"),n=document.getElementById("poster-start-date"),o=document.getElementById("poster-end-date"),a=t==null?void 0:t.value,i=(n==null?void 0:n.value)||null,d=(o==null?void 0:o.value)||null;if(!a){v("warning","Validation Error","Please select a sector to generate the poster.");return}try{const l=await Re({sectorId:a,startDate:i,endDate:d,includeHidden:!1});if(!l||!l.length){v("warning","No Fares","No live fares found for the selected sector and dates.");return}await Dt(e,l,a,D,U)}catch(l){console.error("Video generation failed",l)}}async function Ut(e,t){const n=document.getElementById("poster-preview-container"),o=document.getElementById("poster-fares-tbody"),a=document.getElementById("poster-sector-title");if(!n||!o||!a)return;const i=D.find(c=>c.id===t),d=i?(i.sectorFrom||"DEP").toUpperCase():"DEP",l=i?(i.sectorTo||"ARR").toUpperCase():"ARR";a.innerHTML=`${d} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${l}`;const r=[...e].sort((c,p)=>{let y=c.flightDate,w=p.flightDate;return y instanceof Date&&(y=y.getTime()),w instanceof Date&&(w=w.getTime()),y-w}).slice(0,10),m={};U.forEach(c=>{c.id&&(m[c.id]=c),c.code&&(m[c.code]=c),c.name&&(m[c.name]=c)});async function u(c){try{const p=await fetch(c);if(!p.ok)return null;const y=await p.blob();return URL.createObjectURL(y)}catch{return null}}const s=[...new Set(r.map(c=>c.airlineId))].map(c=>m[c]).filter(c=>c==null?void 0:c.logoUrl),g={};await Promise.all(s.map(async c=>{const p=await u(c.logoUrl);p&&(g[c.id]=p)})),o.innerHTML=r.map((c,p)=>{const y=c.flightDate instanceof Date?c.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():c.flightDate,w=m[c.airlineId],b=p%2===0?"#ffffff":"#f8fafc",E=g[c.airlineId]||null,f=E?`<img src="${E}" style="height:40px;max-width:100px;object-fit:contain;display:block;margin:0 auto;" alt="${(w==null?void 0:w.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:15px;white-space:nowrap;">${(w==null?void 0:w.name)||c.airlineId||"—"}</span>`;let h='<span style="color:#94a3b8;font-size:14px;">—</span>';if(c.flightTime){const $=c.flightTime.split("-").map(L=>L.trim());$.length>=2?h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${$[0]} - ${$[1]}</span>`:h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${c.flightTime}</span>`}return`
      <tr style="background-color:${b};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 12px;font-weight:900;color:#0f172a;font-size:22px;white-space:nowrap;">${y}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${f}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${h}</td>
        <td style="padding:16px 12px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:8px 18px;border-radius:12px;font-weight:900;font-size:22px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            &#8377;${(c.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),n.classList.remove("hidden"),n.classList.add("flex")}function st(e){if(!e||e.nodeType!==1)return;const t=window.getComputedStyle(e),n=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const o of n){const a=t.getPropertyValue(o);if(a&&!a.startsWith("rgb")&&!a.startsWith("#")&&a!=="transparent"&&a!=="initial")try{e.style[o]=a}catch{}}for(const o of e.children)st(o)}async function Ze(e){const t=document.getElementById("poster-render-frame");if(!t)return;const n=document.getElementById("poster-download-jpg"),o=document.getElementById("poster-download-pdf");n&&(n.disabled=!0),o&&(o.disabled=!0);const a=t.style.transform;t.style.transform="none",v("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(t.querySelectorAll("img")).map(l=>l.complete?Promise.resolve():new Promise(r=>{l.onload=r,l.onerror=r})));const i=await html2canvas(t,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:l=>{const r=l.getElementById("poster-render-frame");r&&st(r)}});t.style.transform=a;const d=i.toDataURL("image/jpeg",.95);if(e==="jpeg"){const l=document.createElement("a");l.download=`zamra-poster-${Date.now()}.jpg`,l.href=d,l.click(),v("success","Downloaded!","JPEG poster saved successfully.")}else if(e==="pdf"){const l=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!l)throw new Error("jsPDF library not loaded.");const r=96/25.4,m=i.width/2/r,u=i.height/2/r,s=new l({orientation:m>u?"landscape":"portrait",unit:"mm",format:[m,u]});s.addImage(d,"JPEG",0,0,m,u),s.save(`zamra-poster-${Date.now()}.pdf`),v("success","Downloaded!","PDF poster saved successfully.")}}catch(i){console.error("Poster export error:",i),t.style.transform=a,v("error","Export Failed",i.message||"There was an error generating the export.")}finally{n&&(n.disabled=!1),o&&(o.disabled=!1)}}function de(e){const t=document.getElementById("report-fares-results");if(!t)return;if(!e||!e.length){t.innerHTML=`<div class="text-center text-text-muted py-14 px-4">
      <div class="inline-flex flex-col items-center gap-3 opacity-50">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <i class="bi bi-inbox text-3xl text-slate-400"></i>
        </div>
        <p class="font-semibold text-[14px]">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const n=Object.fromEntries(_.map(c=>[c.id,c.name])),o=Object.fromEntries(D.map(c=>[c.id,c.sectorCode])),a=Object.fromEntries(U.map(c=>[c.id,c.code])),{key:i,asc:d}=ee.reportFares,l=[...e].sort((c,p)=>{let y=c[i],w=p[i];return y instanceof Date&&(y=y.getTime()),w instanceof Date&&(w=w.getTime()),typeof y=="string"&&(y=y.toLowerCase()),typeof w=="string"&&(w=w.toLowerCase()),y<w?d?-1:1:y>w?d?1:-1:0}),r=te.reportFares,m=Math.max(1,Math.ceil(e.length/r));S.reportFares>m&&(S.reportFares=m);const u=(S.reportFares-1)*r,s=l.slice(u,u+r),g=(c,p)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${c}">${p} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;t.innerHTML=`
    <div class="admin-table-container overflow-x-auto w-full rounded-none border-0 shadow-none">
      <table class="admin-table w-full text-sm">
        <thead><tr>
          ${g("flightDate","Date")}
          ${g("flightTime","Time")}
          ${g("sectorId","Sector")}
          ${g("airlineId","Airline")}
          ${g("agentId","Agent")}
          ${g("specialRate","SP Rate (₹)")}
          ${g("finalRate","Rate (₹)")}
          ${g("commission","Comm (₹)")}
          ${g("baggage","Bag")}
          ${g("extraBaggage","Ex.Bag")}
          ${g("isHidden","Status")}
          <th class="whitespace-nowrap">Actions</th>
        </tr></thead>
        <tbody>
          ${s.map((c,p)=>{const y=c.flightDate instanceof Date?c.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):c.flightDate||"—";return`<tr class="${p%2===1?"bg-slate-50/60":""} hover:bg-slate-100/80 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${y}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${c.flightTime||"—"}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${o[c.sectorId]||c.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${a[c.airlineId]||c.airlineId}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${n[c.agentId]||c.agentId}</td>
              <td class="whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-text-muted text-[13px] mr-0.5">₹</span>
                  <input type="number" 
                    value="${c.specialRate||0}"
                    onblur="window.__updateFareRate('${c.id}', 'specialRate', this.value)"
                    class="bg-transparent border border-transparent hover:border-slate-200 focus:border-primary/50 focus:bg-white rounded px-1 text-[13px] text-text-muted outline-none w-20 transition-colors shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-navy font-black text-[14px] mr-0.5">₹</span>
                  <input type="number" 
                    value="${c.finalRate||0}"
                    onblur="window.__updateFareRate('${c.id}', 'finalRate', this.value)"
                    class="bg-transparent border border-transparent hover:border-slate-200 focus:border-primary/50 focus:bg-white rounded px-1 font-black text-navy text-[14px] outline-none w-20 transition-colors shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </td>
              <td class="whitespace-nowrap text-[12px] text-text-muted" id="comm-${c.id}">₹${(c.commission||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px]">${c.baggage?c.baggage+" kg":"—"}</td>
              <td class="whitespace-nowrap text-[12px]">${c.extraBaggage?c.extraBaggage+" kg":"—"}</td>
              <td class="whitespace-nowrap">
                <span class="admin-status-pill ${c.isHidden?"admin-status-hidden":"admin-status-live"}">
                  ${c.isHidden?"● Hidden":"● Live"}
                </span>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  <button onclick="window.__openEditFareModal('${c.id}')"
                    class="admin-action-btn admin-action-edit">Edit</button>
                  <button onclick="window.__toggleFare('${c.id}', ${!c.isHidden})"
                    class="admin-action-btn ${c.isHidden?"admin-action-show":"admin-action-toggle"}">
                    ${c.isHidden?"Show":"Hide"}
                  </button>
                  <button onclick="window.__deleteFare('${c.id}')"
                    class="admin-action-btn admin-action-delete">Del</button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,we("reportFares",e.length,m,u,r),window.__deleteFare=async c=>{if(confirm("Delete this fare?"))try{await Oe(c),k=k.filter(p=>p.id!==c),v("success","Deleted","Fare removed."),de(k)}catch(p){v("error","Error",p.message)}},window.__toggleFare=async(c,p)=>{try{await ke(c,{isHidden:p}),k=k.map(y=>y.id===c?{...y,isHidden:p}:y),v("success","Updated",`Fare ${p?"hidden":"shown"}.`),de(k)}catch(y){v("error","Error",y.message)}},window.__updateFareRate=async(c,p,y)=>{const w=parseFloat(y)||0,b=k.find(E=>E.id===c);if(!(!b||b[p]===w))try{const E={[p]:w};p==="specialRate"?(E.commission=Math.max(0,b.finalRate-w),b.commission=E.commission):p==="finalRate"&&(E.commission=Math.max(0,w-b.specialRate),b.commission=E.commission),await ke(c,E),b[p]=w,v("success","Rate Updated","Fare successfully updated."),de(k)}catch(E){v("error","Update Failed",E.message),de(k)}},Ae("reportFares"),window.__openEditFareModal=c=>{const p=k.find(b=>b.id===c);if(!p)return;let y="";if(p.flightDate instanceof Date){const b=p.flightDate.getTimezoneOffset();y=new Date(p.flightDate.getTime()-b*60*1e3).toISOString().split("T")[0]}else typeof p.flightDate=="string"&&(y=p.flightDate.split("T")[0]);const w=`
      <form id="edit-fare-form" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="admin-label text-[10px] mb-1">Date</label>
            <input type="date" id="ef-date" class="admin-control h-10" value="${y}" required>
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Time</label>
            <input type="text" id="ef-time" class="admin-control h-10" placeholder="e.g. 04:05 - 11:10" value="${p.flightTime||""}">
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="admin-label text-[10px] mb-1">Sector</label>
            <select id="ef-sector" class="admin-control h-10" required>
              ${D.map(b=>`<option value="${b.id}" ${b.id===p.sectorId?"selected":""}>${b.sectorCode}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Airline</label>
            <select id="ef-airline" class="admin-control h-10" required>
              <option value="">-- None --</option>
              ${U.map(b=>`<option value="${b.id}" ${b.id===p.airlineId?"selected":""}>${b.code}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Agent</label>
            <select id="ef-agent" class="admin-control h-10" required>
              <option value="">-- None --</option>
              ${_.map(b=>`<option value="${b.id}" ${b.id===p.agentId?"selected":""}>${b.name}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="admin-label text-[10px] mb-1">SP Rate (₹)</label>
            <input type="number" id="ef-sprate" class="admin-control h-10" value="${p.specialRate||0}" required>
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Final Rate (₹)</label>
            <input type="number" id="ef-finalrate" class="admin-control h-10" value="${p.finalRate||0}" required>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="admin-label text-[10px] mb-1">Baggage (kg)</label>
            <input type="number" id="ef-bag" class="admin-control h-10" value="${p.baggage||0}">
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Ex. Baggage (kg)</label>
            <input type="number" id="ef-exbag" class="admin-control h-10" value="${p.extraBaggage||0}">
          </div>
          <div>
            <label class="admin-label text-[10px] mb-1">Status</label>
            <select id="ef-status" class="admin-control h-10">
              <option value="live" ${p.isHidden?"":"selected"}>Live</option>
              <option value="hidden" ${p.isHidden?"selected":""}>Hidden</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onclick="document.getElementById('admin-modal').close()" class="admin-btn admin-btn-ghost px-5">Cancel</button>
          <button type="submit" class="admin-btn admin-btn-primary px-5">Save Changes</button>
        </div>
      </form>
    `;Te("Edit Fare",w),document.getElementById("edit-fare-form").onsubmit=async b=>{b.preventDefault();const E=b.target.querySelector('button[type="submit"]'),f=E.textContent;E.disabled=!0,E.textContent="Saving...";try{let h=document.getElementById("ef-date").value;const $={flightDate:h?new Date(h+"T00:00:00"):null,flightTime:document.getElementById("ef-time").value.trim(),sectorId:document.getElementById("ef-sector").value,airlineId:document.getElementById("ef-airline").value,agentId:document.getElementById("ef-agent").value,specialRate:parseFloat(document.getElementById("ef-sprate").value)||0,finalRate:parseFloat(document.getElementById("ef-finalrate").value)||0,baggage:parseFloat(document.getElementById("ef-bag").value)||0,extraBaggage:parseFloat(document.getElementById("ef-exbag").value)||0,isHidden:document.getElementById("ef-status").value==="hidden"};$.commission=Math.max(0,$.finalRate-$.specialRate),await ke(c,$);const L=k.findIndex(P=>P.id===c);L!==-1&&(k[L]={...k[L],...$}),document.getElementById("admin-modal").close(),v("success","Updated","Fare updated successfully."),de(k)}catch(h){v("error","Error",h.message),E.disabled=!1,E.textContent=f}}}}async function oe(e=!0){e&&(_=await nt(),S.agents=1);const t=document.querySelector("#agents-tab .admin-table tbody");if(!t)return;const n=document.getElementById("agents-search"),o=document.getElementById("agents-limit");n&&!n.dataset.wired&&(n.dataset.wired="1",o&&(o.dataset.wired="1"),n.addEventListener("input",u=>{He.agents=u.target.value,S.agents=1,oe(!1)}),o&&o.addEventListener("change",u=>{te.agents=parseInt(u.target.value),S.agents=1,oe(!1)}));const a=Ge(_,"agents"),i=te.agents,d=Math.max(1,Math.ceil(a.length/i));S.agents>d&&(S.agents=d);const l=(S.agents-1)*i,r=a.slice(l,l+i);t.innerHTML=r.length?r.map(u=>Pt(u)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',we("agents",a.length,d,l,i),delete t.dataset.actionsWired,Ot(),qt(),_t();const m=document.getElementById("agents-add-btn");m&&!m.dataset.wired&&(m.dataset.wired="1",m.addEventListener("click",()=>rt(null))),Ae("agents")}function Pt(e){const t=e.isActive!==!1?'<span class="admin-status-pill admin-status-active">Active</span>':'<span class="admin-status-pill admin-status-inactive">Hidden</span>',n=e.commission!==void 0?`₹${Number(e.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${e.id}">
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
  </tr>`}function Ot(){const e=document.querySelector("#agents-tab .admin-table tbody");!e||e.dataset.actionsWired||(e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const o=n.dataset.action,a=n.dataset.id,i=_.find(d=>d.id===a);if(o==="edit-agent"&&rt(i),o==="delete-agent"){if(!confirm(`Delete agent "${i==null?void 0:i.name}"? This does NOT delete their fares.`))return;try{await xt(a),v("success","Deleted",`Agent "${i==null?void 0:i.name}" removed.`),await oe()}catch(d){v("error","Error",d.message)}}if(o==="toggle-agent"){const l=!(n.dataset.active==="true");n.disabled=!0,n.textContent="Working…";try{const r=await yt(a,l);v("success",l?"Agent Shown":"Agent Hidden",r.message),await oe()}catch(r){v("error","Toggle Failed",r.message),await oe()}}}))}function we(e,t,n,o,a){const i=document.getElementById(`${e}-pagination-footer`);if(!i)return;const d=Math.min(o+a,t),l=S[e];i.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${t?o+1:0} to ${d} of ${t} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${l<=1?"disabled":""}>Previous</button>
        ${Array.from({length:n},(r,m)=>m+1).map(r=>`<button data-pg-action="goto" data-pg="${r}" class="admin-pagination-btn ${r===l?"admin-pagination-btn-active":""}">${r}</button>`).join("")}
        <button data-pg-action="next" class="admin-pagination-btn" ${l>=n?"disabled":""}>Next</button>
      </div>
    </div>`,i.dataset.wired||(i.dataset.wired="1",i.addEventListener("click",r=>{const m=r.target.closest("[data-pg-action]");if(!m||m.disabled)return;const u=m.dataset.pgAction;u==="prev"?S[e]=Math.max(1,S[e]-1):u==="next"?S[e]++:u==="goto"&&(S[e]=parseInt(m.dataset.pg)),e==="agents"?oe(!1):e==="sectors"?ie(!1):e==="airlines"?pe(!1):e==="reportFares"?de(k):e==="databaseFares"&&q()}))}function rt(e){var n,o;const t=!!e;Te(t?"Edit Agent":"Add New Agent",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(o=document.getElementById("agent-form"))==null||o.addEventListener("submit",async a=>{a.preventDefault();const i=new FormData(a.target),d=Object.fromEntries(i.entries()),l=a.target.querySelector("[type=submit]");l.disabled=!0,l.textContent="Saving…";try{t?(await vt(e.id,d),v("success","Updated",`Agent "${d.name}" updated.`)):(await wt(d),v("success","Added",`Agent "${d.name}" added.`)),document.getElementById("admin-modal").close(),await oe()}catch(r){v("error","Save Failed",r.message),l.disabled=!1,l.textContent=t?"Save Changes":"Add Agent"}})}function qt(){const e=document.getElementById("agents-bulk-delete-btn");!e||e.dataset.wired||(e.dataset.wired="1",e.addEventListener("click",async()=>{const t=document.getElementById("agents-bulk-agent-sel"),n=document.getElementById("agents-bulk-sector-sel"),o=document.getElementById("agents-bulk-start"),a=document.getElementById("agents-bulk-end"),i=(t==null?void 0:t.value)||null,d=(n==null?void 0:n.value)||null,l=(o==null?void 0:o.value)||null,r=(a==null?void 0:a.value)||null;if(!(i&&i!=="all"||d&&d!=="all"||l||r)){v("warning","No Filter","Select at least an agent, a sector, or a date range before deleting.");return}const u=[];if(i&&i!=="all"&&u.push(`Agent: ${t.options[t.selectedIndex].text}`),d&&d!=="all"&&u.push(`Sector: ${n.options[n.selectedIndex].text}`),l&&u.push(`from ${l}`),r&&u.push(`to ${r}`),!!confirm(`Delete ALL matching fares?
${u.join(" · ")}

This cannot be undone.`)){e.disabled=!0,e.textContent="Deleting…";try{const s=await $t(i,l,r,d);v("success","Bulk Delete Complete",s.message)}catch(s){v("error","Bulk Delete Failed",s.message)}finally{e.disabled=!1,e.textContent="Bulk Delete"}}}))}function _t(){const e=document.getElementById("agents-bulk-agent-sel");if(e){const n=e.value;e.innerHTML='<option value="">All Agents</option>',_.forEach(o=>e.appendChild(new Option(o.name,o.id))),n&&(e.value=n)}const t=document.getElementById("agents-bulk-sector-sel");if(t){const n=t.value;t.innerHTML='<option value="">All Sectors</option>',D.forEach(o=>t.appendChild(new Option(o.sectorCode,o.id))),n&&(t.value=n)}}async function ie(e=!0){e&&(D=ze(await qe()),S.sectors=1);const t=document.getElementById("sectors-search"),n=document.getElementById("sectors-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",n.dataset.wired="1",t.addEventListener("input",u=>{He.sectors=u.target.value,S.sectors=1,ie(!1)}),n.addEventListener("change",u=>{te.sectors=parseInt(u.target.value),S.sectors=1,ie(!1)}));const o=document.querySelector("#sectors-tab .admin-table tbody");if(!o)return;const a=Ge(D,"sectors"),i=te.sectors,d=Math.max(1,Math.ceil(a.length/i));S.sectors>d&&(S.sectors=d);const l=(S.sectors-1)*i,r=a.slice(l,l+i);o.innerHTML=r.length?r.map(u=>zt(u)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',we("sectors",a.length,d,l,i),Gt();const m=document.querySelector("#sectors-tab .flex.justify-between button");m&&!m.dataset.wired&&(m.dataset.wired="1",m.addEventListener("click",()=>lt(null))),Ae("sectors")}function zt(e){const t=at(e);return`<tr data-sector-id="${e.id}">
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
  </tr>`}function Gt(){const e=document.querySelector("#sectors-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const{action:o,id:a}=n.dataset,i=D.find(d=>d.id===a);if(o==="edit-sector"&&lt(i),o==="delete-sector"){if(!confirm(`Delete sector "${i==null?void 0:i.sectorCode}"?`))return;try{await Et(a),v("success","Deleted",`Sector "${i==null?void 0:i.sectorCode}" removed.`),await ie()}catch(d){v("error","Error",d.message)}}if(o==="toggle-sector"){const l=!(n.dataset.hidden==="true");n.disabled=!0,n.textContent="Working…";try{const r=await It(a,l);v("success",`Sector Fares ${l?"Hidden":"Shown"}`,r.message),await ie()}catch(r){v("error","Toggle Failed",r.message),await ie()}}}))}function lt(e){var n,o;const t=!!e;Te(t?"Edit Sector":"Add New Sector",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(o=document.getElementById("sector-form"))==null||o.addEventListener("submit",async a=>{a.preventDefault();const i=new FormData(a.target),d=Object.fromEntries(i.entries());d.sectorCode=ye(d.sectorCode.toUpperCase()),d.sectorFrom=ye(d.sectorFrom.toUpperCase()),d.sectorTo=ye(d.sectorTo.toUpperCase());const l=a.target.querySelector("[type=submit]");l.disabled=!0,l.textContent="Saving…";try{t?(await St(e.id,d),v("success","Updated","Sector updated.")):(await Bt(d),v("success","Added",`Sector "${d.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await ie()}catch(r){v("error","Save Failed",r.message),l.disabled=!1,l.textContent=t?"Save Changes":"Add Sector"}})}async function pe(e=!0){e&&(U=await _e(),S.airlines=1);const t=document.getElementById("airlines-search"),n=document.getElementById("airlines-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",n.dataset.wired="1",t.addEventListener("input",u=>{He.airlines=u.target.value,S.airlines=1,pe(!1)}),n.addEventListener("change",u=>{te.airlines=parseInt(u.target.value),S.airlines=1,pe(!1)}));const o=document.querySelector("#flights-tab .admin-table tbody");if(!o)return;const a=Ge(U,"airlines"),i=te.airlines,d=Math.max(1,Math.ceil(a.length/i));S.airlines>d&&(S.airlines=d);const l=(S.airlines-1)*i,r=a.slice(l,l+i);o.innerHTML=r.length?r.map(u=>Wt(u)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "+ Add Flight".</td></tr>',we("airlines",a.length,d,l,i),Vt();const m=document.querySelector("#flights-tab .flex.justify-between button");m&&!m.dataset.wired&&(m.dataset.wired="1",m.addEventListener("click",()=>dt(null))),Ae("airlines")}function Wt(e){const t=e.logoUrl?`<img src="${e.logoUrl}" class="h-7 w-7 object-contain rounded" alt="${e.name}">`:`<span class="w-7 h-7 bg-primary-light text-primary text-xs font-bold rounded flex items-center justify-center">${e.code}</span>`;return`<tr data-airline-id="${e.id}">
    <td>${t}</td>
    <td class="font-semibold">${e.name}</td>
    <td><span class="font-mono font-bold text-primary">${e.code}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-airline" data-id="${e.id}" class="admin-action-btn admin-action-edit">Edit</button>
      <button data-action="delete-airline" data-id="${e.id}" class="admin-action-btn admin-action-delete">Delete</button>
    </td>
  </tr>`}function Vt(){const e=document.querySelector("#flights-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const{action:o,id:a}=n.dataset,i=U.find(d=>d.id===a);if(o==="edit-airline"&&dt(i),o==="delete-airline"){if(!confirm(`Delete airline "${i==null?void 0:i.name}" (${i==null?void 0:i.code})?`))return;try{await Ct(a),v("success","Deleted",`Airline "${i==null?void 0:i.name}" removed.`),await pe()}catch(d){v("error","Error",d.message)}}}))}function dt(e){var n,o;const t=!!e;Te(t?"Edit Airline":"Add New Airline",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(o=document.getElementById("airline-form"))==null||o.addEventListener("submit",async a=>{var m;a.preventDefault();const i=new FormData(a.target),d=((m=i.get("logoFile"))==null?void 0:m.size)>0?i.get("logoFile"):null,l={name:i.get("name"),code:i.get("code").toUpperCase()},r=a.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{t?(await At(e.id,l,d),v("success","Updated","Airline updated.")):(await Tt(l,d),v("success","Added",`Airline "${l.name}" added.`)),document.getElementById("admin-modal").close(),await pe()}catch(u){v("error","Save Failed",u.message),r.disabled=!1,r.textContent=t?"Save Changes":"Add Airline"}})}async function Jt(){const e=document.getElementById("reports-tab");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=document.getElementById("reports-sector-sel");t&&t.options.length<=1&&D.forEach(d=>t.appendChild(new Option(d.sectorCode,d.id)));const n=document.getElementById("reports-agent-sel");n&&n.options.length<=1&&_.forEach(d=>n.appendChild(new Option(d.name,d.id)));const o=document.getElementById("generate-report-btn"),a=document.getElementById("reports-start-date"),i=document.getElementById("reports-end-date");o&&!o.dataset.wired&&(o.dataset.wired="1",o.addEventListener("click",async()=>{const d=(t==null?void 0:t.value)||"all",l=(n==null?void 0:n.value)||"all",r=(a==null?void 0:a.value)||null,m=(i==null?void 0:i.value)||null;if(d==="all"&&!r&&!m&&l==="all"){v("warning","No Filter Selected","Select at least a sector, an agent, or a date range.");return}o.disabled=!0,o.textContent="Generating…";try{const[u,s]=await Promise.all([Lt(r,m,d,l),Re({sectorId:d,agentId:l,startDate:r,endDate:m,includeHidden:!0})]);k=s,Kt(u,e),S.reportFares=1,de(k)}catch(u){v("error","Report Failed",u.message)}finally{o.disabled=!1,o.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Kt(e,t){const{agentReport:n,sectorReport:o,totalFares:a}=e,i=document.getElementById("report-stats-row");if(i){i.classList.remove("hidden");const g=(k||[]).filter(f=>!f.isHidden).length,c=(k||[]).filter(f=>f.isHidden).length,p=new Set((k||[]).map(f=>f.agentId)).size,y=(k||[]).map(f=>f.finalRate||0).filter(f=>f>0),w=y.length?Math.round(y.reduce((f,h)=>f+h,0)/y.length):0,b=(f,h)=>{const $=document.getElementById(f);$&&($.textContent=h.toLocaleString())};b("stat-total-fares",a),b("stat-live-fares",g),b("stat-hidden-fares",c),b("stat-agents-count",p);const E=document.getElementById("stat-avg-fare");E&&(E.textContent=w>0?`₹${w.toLocaleString()}`:"—")}const d=document.getElementById("report-total-fares");d&&(d.textContent=`${a} fare${a!==1?"s":""} matched your filter`);const l=document.getElementById("bar-chart-container");l&&n.length&&Yt(n.slice(0,8),l);const r=document.getElementById("donut-chart-svg"),m=document.getElementById("pie-legend");r&&o.length&&Xt(o.slice(0,8),r,m);const u=document.getElementById("report-leaderboards");u&&(u.classList.remove("hidden"),Zt(n,o));const s=document.getElementById("download-report-csv");if(s){const g=s.cloneNode(!0);s.parentNode.replaceChild(g,s),g.addEventListener("click",()=>Qt(k)),k&&k.length?g.classList.remove("opacity-50","pointer-events-none"):g.classList.add("opacity-50","pointer-events-none")}v("success","Report Ready",`${a} fare${a!==1?"s":""} aggregated.`)}function Yt(e,t){const n=t.clientWidth||480,o=260,a={top:32,right:16,bottom:48,left:48},i=n-a.left-a.right,d=o-a.top-a.bottom,l=Math.max(...e.map(f=>f.count),1),r=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],m=4,u=Math.ceil(l/m),s=Array.from({length:m+1},(f,h)=>h*u),g=s.map(f=>{const h=a.top+d-f/(s[s.length-1]||1)*d;return`<line x1="${a.left}" y1="${h.toFixed(1)}" x2="${n-a.right}" y2="${h.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${a.left-6}" y="${(h+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${f}</text>`}).join(""),c=Math.min(48,i/e.length*.6),p=i/e.length,y=e.map((f,h)=>{const $=Math.max(4,f.count/(s[s.length-1]||1)*d),L=a.left+h*p+p/2-c/2,P=a.top+d-$,[V,X]=r[h%r.length],ne=`bg${h}`,ae=f.avgRate?`avg ₹${Math.round(f.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${ne}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${V}"/>
              <stop offset="100%" stop-color="${X}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${f.name}" data-count="${f.count}" data-avg="${ae}" style="cursor:pointer;">
              <rect x="${L.toFixed(1)}" y="${P.toFixed(1)}" width="${c}" height="${$.toFixed(1)}"
                rx="6" fill="url(#${ne})" opacity="0.92"
                style="transform-origin:${(L+c/2).toFixed(1)}px ${(a.top+d).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${h*.07}s both;"/>
              <text x="${(L+c/2).toFixed(1)}" y="${(P-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${X}">${f.count}</text>
              <text x="${(L+c/2).toFixed(1)}" y="${(a.top+d+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(f.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),w="bar-tooltip";t.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${w}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${o}" viewBox="0 0 ${n} ${o}" style="overflow:visible;">
      ${g}
      <line x1="${a.left}" y1="${a.top}" x2="${a.left}" y2="${a.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${a.left}" y1="${a.top+d}" x2="${n-a.right}" y2="${a.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${y}
    </svg>`;const b=t.querySelector("#bar-svg"),E=t.querySelector(`#${w}`);b&&E&&b.querySelectorAll(".bar-group").forEach(f=>{f.addEventListener("mousemove",h=>{const $=t.getBoundingClientRect();E.style.display="block",E.style.left=h.clientX-$.left+12+"px",E.style.top=h.clientY-$.top-40+"px";const L=f.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${f.dataset.avg}</span>`:"";E.innerHTML=`${f.dataset.name}<br><span style="color:#60a5fa;">${f.dataset.count} fares</span>${L}`}),f.addEventListener("mouseleave",()=>{E.style.display="none"})})}function Xt(e,t,n){const o=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],r=e.reduce((f,h)=>f+h.count,0),m=t.getElementById?t.getElementById("donut-segments"):t.querySelector("#donut-segments"),u=t.querySelector("#donut-center-count"),s=t.querySelector("#donut-center-label");if(!m)return;u&&(u.textContent=r),s&&(s.textContent="FARES");const g=(f,h,$,L)=>({x:f+$*Math.cos((L-90)*Math.PI/180),y:h+$*Math.sin((L-90)*Math.PI/180)});let c=0;const p=e.map((f,h)=>{const $=r>0?f.count/r*360:0,L=c+$,P=$>180?1:0,V=g(110,110,95,c),X=g(110,110,95,L),ne=g(110,110,60,c),ae=g(110,110,60,L),le=[`M ${V.x.toFixed(2)} ${V.y.toFixed(2)}`,`A 95 95 0 ${P} 1 ${X.x.toFixed(2)} ${X.y.toFixed(2)}`,`L ${ae.x.toFixed(2)} ${ae.y.toFixed(2)}`,`A 60 60 0 ${P} 0 ${ne.x.toFixed(2)} ${ne.y.toFixed(2)}`,"Z"].join(" "),ce=c+$/2;c=L;const x=r>0?(f.count/r*100).toFixed(1):"0.0";return{pathD:le,color:o[h%o.length],name:f.name,count:f.count,pct:x,mid:ce}}),y="http://www.w3.org/2000/svg";m.innerHTML="";const w=p.map((f,h)=>{const $=document.createElementNS(y,"path");return $.setAttribute("d",f.pathD),$.setAttribute("fill",f.color),$.setAttribute("stroke","white"),$.setAttribute("stroke-width","2"),$.style.cursor="pointer",$.style.transition="transform 0.2s, filter 0.2s",$.style.transformOrigin="110px 110px",$.setAttribute("data-index",h),m.appendChild($),$}),b=f=>{w.forEach((h,$)=>{$===f?(h.style.transform="scale(1.04)",h.style.filter="brightness(1.1)",h.setAttribute("stroke-width","3")):(h.style.transform="scale(1)",h.style.filter="brightness(1)",h.setAttribute("stroke-width","2"))}),f>=0&&f<p.length?(u&&(u.textContent=p[f].count),s&&(s.textContent=p[f].name.split(" ")[0].toUpperCase().slice(0,7))):(u&&(u.textContent=r),s&&(s.textContent="FARES"))};if(w.forEach((f,h)=>{f.addEventListener("mouseover",()=>{b(h),E(h)}),f.addEventListener("mouseout",()=>{b(-1),E(-1)})}),n){n.innerHTML=p.map((h,$)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${$}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${h.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${h.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${h.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${h.pct}%</span>
      </div>`).join("");const f=h=>{n.querySelectorAll(".legend-row").forEach(($,L)=>{$.style.background=L===h?"#f1f5f9":""})};window._highlightLegendRows=f,n.querySelectorAll(".legend-row").forEach((h,$)=>{h.addEventListener("mouseover",()=>{b($),f($)}),h.addEventListener("mouseout",()=>{b(-1),f(-1)})})}function E(f){window._highlightLegendRows&&window._highlightLegendRows(f)}}function Zt(e,t){var i,d;const n=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],o=document.getElementById("leaderboard-agents");if(o&&e.length){const l=[...e].sort((m,u)=>u.count-m.count).slice(0,5),r=l[0].count||1;o.innerHTML=l.map((m,u)=>{const s=Math.max(6,Math.round(m.count/r*100));return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:16px;width:28px;text-align:center;flex-shrink:0;">${u===0?"🥇":u===1?"🥈":u===2?"🥉":`#${u+1}`}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${m.name}</span>
            <span style="color:${n[u]};margin-left:8px;">${m.count} fares</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${s}%;height:100%;background:${n[u]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}const a=document.getElementById("leaderboard-sectors");if(a&&t.length){const r=[...t.filter(s=>s.avgRate>0)].sort((s,g)=>s.avgRate-g.avgRate).slice(0,5),m=((i=r[0])==null?void 0:i.avgRate)||1,u=((d=r[r.length-1])==null?void 0:d.avgRate)||1;a.innerHTML=r.map((s,g)=>{const c=u>m?Math.max(6,Math.round((s.avgRate-m)/(u-m)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${g+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${s.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(s.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${c}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function Qt(e){if(!e||!e.length){v("warning","No Data","No fares to export. Apply filters and fetch first.");return}const t=Object.fromEntries(_.map(s=>[s.id,s.name])),n=Object.fromEntries(D.map(s=>[s.id,s.sectorCode])),o=Object.fromEntries(U.map(s=>[s.id,s.code||s.name])),a=s=>`"${String(s??"").replace(/"/g,'""')}"`,i=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],d=e.map(s=>{const g=s.flightDate instanceof Date?s.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):s.flightDate||"";return[a(g),a(s.flightTime||""),a(n[s.sectorId]||s.sectorId),a(o[s.airlineId]||s.airlineId),a(t[s.agentId]||s.agentId),a(s.specialRate||0),a(s.finalRate||0),a(s.commission||0),a(s.baggage||""),a(s.extraBaggage||""),a(s.isHidden?"Hidden":"Live")].join(",")}),l=[i.map(a).join(","),...d].join(`
`),r=new Blob(["\uFEFF"+l],{type:"text/csv;charset=utf-8;"}),m=URL.createObjectURL(r),u=document.createElement("a");u.href=m,u.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(u),u.click(),document.body.removeChild(u),URL.revokeObjectURL(m),v("success","CSV Downloaded",`${e.length} fares exported.`)}function ct(){return Object.keys(G).length}function en(){return{agentNameById:Object.fromEntries(_.map(e=>[e.id,e.name||e.id])),sectorCodeById:Object.fromEntries(D.map(e=>[e.id,e.sectorCode||`${e.sectorFrom||""} ${e.sectorTo||""}`.trim()||e.id])),airlineLabelById:Object.fromEntries(U.map(e=>[e.id,e.code?`${e.code} - ${e.name||""}`.trim():e.name||e.id]))}}function tn(e,t){return e==="specialRate"||e==="finalRate"||e==="extraBaggage"?t===""?"":N(t,0):e==="baggage"?t===""?"":$e(t):e==="isHidden"?t===!0||t==="hidden"||t==="true":e==="flightTime"?String(t||"").trim():e==="flightDate"?t||"":String(t||"")}function nn(e,t){return e==="specialRate"||e==="finalRate"||e==="extraBaggage"?N(t,0):e==="baggage"?$e(t):e==="isHidden"?t===!0:e==="flightTime"?String(t||"").trim():e==="flightDate"?Me(t):String(t||"")}function mt(e){const t=G[e.id]||{},n={...e,...t};return n.flightDate=t.flightDate!==void 0?ot(t.flightDate):Ce(e.flightDate),n.specialRate=N(n.specialRate,0),n.finalRate=N(n.finalRate,0),n.commission=Math.max(0,n.finalRate-n.specialRate),n.baggage=$e(n.baggage),n.extraBaggage=N(n.extraBaggage,0),n.isHidden=n.isHidden===!0||n.isHidden==="hidden"||n.isHidden==="true",n.flightTime=String(n.flightTime||"").trim(),n.agentId=n.agentId||"",n.sectorId=n.sectorId||"",n.airlineId=n.airlineId||"",n}function Se(){const e=ct(),t=K.size,n=document.getElementById("database-unsaved-pill");n&&(n.textContent=`Unsaved: ${e}`);const o=document.getElementById("database-save-all-btn");o&&(o.disabled=e===0);const a=document.getElementById("database-delete-selected-btn");a&&(a.disabled=t===0);const i=document.getElementById("database-selected-count");i&&(i.textContent=String(t))}function an(){const e=document.getElementById("database-agent-filter"),t=document.getElementById("database-sector-filter"),n=document.getElementById("database-airline-filter");if(e){const o=A.agentId;e.innerHTML='<option value="all">All Agents</option>'+_.map(a=>`<option value="${F(a.id)}">${F(a.id)} · ${F(a.name||"Unnamed")}</option>`).join(""),e.value=o}if(t){const o=A.sectorId;t.innerHTML='<option value="all">All Sectors</option>'+D.map(a=>`<option value="${F(a.id)}">${F(a.sectorCode||a.id)}</option>`).join(""),t.value=o}if(n){const o=A.airlineId;n.innerHTML='<option value="all">All Airlines</option>'+U.map(a=>`<option value="${F(a.id)}">${F(a.code||"—")} · ${F(a.name||"Unnamed")}</option>`).join(""),n.value=o}}function on(){const e=document.getElementById("database-table-wrap");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=a=>{const i=e.querySelector(`tr[data-fare-id="${a}"]`);if(!i)return;const d=!!G[a];i.classList.toggle("admin-database-row-dirty",d);const l=i.querySelector('[data-db-action="save"]'),r=i.querySelector('[data-db-action="reset"]');l&&(l.disabled=!d),r&&(r.disabled=!d)},n=a=>{if(!a)return;const i=a.querySelector('[data-db-field="specialRate"]'),d=a.querySelector('[data-db-field="finalRate"]'),l=a.querySelector("[data-db-commission]");if(!i||!d||!l)return;const r=N(i.value,0),m=N(d.value,0),u=Math.max(0,m-r);l.textContent=`₹${u.toLocaleString()}`},o=a=>{const i=a.target.closest("[data-db-field]");if(!i)return;const d=i.closest("tr[data-fare-id]");if(!d)return;const l=d.dataset.fareId,r=i.dataset.dbField,m=Y.find(y=>y.id===l);if(!m||!r)return;const u=i.value,s=tn(r,u),g=nn(r,m[r]),c=s!==g,p={...G[l]||{}};c?p[r]=s:delete p[r],Object.keys(p).length?G[l]=p:delete G[l],(r==="specialRate"||r==="finalRate")&&n(d),t(l),Se()};e.addEventListener("input",o),e.addEventListener("change",a=>{o(a);const i=a.target.closest("#database-select-all");if(i){e.querySelectorAll("input[data-db-select]").forEach(l=>{l.checked=i.checked;const r=l.dataset.dbSelect;r&&(i.checked?K.add(r):K.delete(r))}),Se();return}const d=a.target.closest("input[data-db-select]");if(d){const l=d.dataset.dbSelect;if(!l)return;d.checked?K.add(l):K.delete(l),Se()}}),e.addEventListener("click",async a=>{const i=a.target.closest("[data-db-action]");if(!i)return;const d=i.dataset.dbAction,l=i.dataset.id;if(l){if(d==="save"){i.disabled=!0,await ut(l)||(i.disabled=!1),q();return}if(d==="reset"){delete G[l],q();return}if(d==="delete"){if(!confirm("Delete this fare row? This cannot be undone."))return;i.disabled=!0;try{await Oe(l),Y=Y.filter(r=>r.id!==l),delete G[l],K.delete(l),v("success","Deleted","Fare row removed."),q()}catch(r){v("error","Delete Failed",r.message),i.disabled=!1}}}})}function sn(e){if(!e||e.dataset.controlsWired)return;e.dataset.controlsWired="1";const t=document.getElementById("database-search"),n=document.getElementById("database-agent-filter"),o=document.getElementById("database-sector-filter"),a=document.getElementById("database-airline-filter"),i=document.getElementById("database-status-filter"),d=document.getElementById("database-start-date"),l=document.getElementById("database-end-date"),r=document.getElementById("database-limit"),m=document.getElementById("database-clear-filters"),u=document.getElementById("database-refresh-btn"),s=document.getElementById("database-save-all-btn"),g=document.getElementById("database-delete-selected-btn"),c=document.getElementById("database-add-row-btn");t&&t.addEventListener("input",p=>{A.search=p.target.value||"",S.databaseFares=1,q()}),n&&n.addEventListener("change",p=>{A.agentId=p.target.value||"all",S.databaseFares=1,q()}),o&&o.addEventListener("change",p=>{A.sectorId=p.target.value||"all",S.databaseFares=1,q()}),a&&a.addEventListener("change",p=>{A.airlineId=p.target.value||"all",S.databaseFares=1,q()}),i&&i.addEventListener("change",p=>{A.status=p.target.value||"all",S.databaseFares=1,q()}),d&&d.addEventListener("change",p=>{A.startDate=p.target.value||"",S.databaseFares=1,q()}),l&&l.addEventListener("change",p=>{A.endDate=p.target.value||"",S.databaseFares=1,q()}),r&&(r.value=String(te.databaseFares),r.addEventListener("change",p=>{te.databaseFares=parseInt(p.target.value,10)||20,S.databaseFares=1,q()})),m&&m.addEventListener("click",()=>{A.search="",A.agentId="all",A.sectorId="all",A.airlineId="all",A.status="all",A.startDate="",A.endDate="",t&&(t.value=""),n&&(n.value="all"),o&&(o.value="all"),a&&(a.value="all"),i&&(i.value="all"),d&&(d.value=""),l&&(l.value=""),S.databaseFares=1,q()}),u&&u.addEventListener("click",async()=>{const p=u.innerHTML;u.disabled=!0,u.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing...',await We(!0),u.disabled=!1,u.innerHTML=p}),s&&s.addEventListener("click",ln),g&&g.addEventListener("click",dn),c&&c.addEventListener("click",cn)}async function We(e=!0){const t=document.getElementById("database-tab");if(!t)return;if(sn(t),on(),an(),e||!t.dataset.loaded)try{Y=await Re({includeHidden:!0}),G={},K=new Set,S.databaseFares=1,t.dataset.loaded="1"}catch(o){v("error","Load Failed",o.message),Y=[]}q()}function rn(){const{agentNameById:e,sectorCodeById:t,airlineLabelById:n}=en(),o=A.search.trim().toLowerCase(),a=Ft(A.startDate),i=Rt(A.endDate),d=Y.map(m=>mt(m)).filter(m=>{var g,c;if(A.agentId!=="all"&&m.agentId!==A.agentId||A.sectorId!=="all"&&m.sectorId!==A.sectorId||A.airlineId!=="all"&&m.airlineId!==A.airlineId||A.status==="live"&&m.isHidden||A.status==="hidden"&&!m.isHidden)return!1;const u=((c=(g=Ce(m.flightDate))==null?void 0:g.getTime)==null?void 0:c.call(g))||null;return a!==null&&(u===null||u<a)||i!==null&&(u===null||u>i)?!1:o?[m.id,Me(m.flightDate),m.flightTime,m.specialRate,m.finalRate,m.commission,m.baggage,m.extraBaggage,m.isHidden?"hidden":"live",m.agentId,m.sectorId,m.airlineId,e[m.agentId]||"",t[m.sectorId]||"",n[m.airlineId]||""].join(" ").toLowerCase().includes(o):!0}),{key:l,asc:r}=ee.databaseFares;return d.sort((m,u)=>{const s=p=>{var y,w;return l==="agentId"?(e[p.agentId]||p.agentId||"").toLowerCase():l==="sectorId"?(t[p.sectorId]||p.sectorId||"").toLowerCase():l==="airlineId"?(n[p.airlineId]||p.airlineId||"").toLowerCase():l==="flightDate"?((w=(y=Ce(p.flightDate))==null?void 0:y.getTime)==null?void 0:w.call(y))||0:l==="isHidden"?p.isHidden?1:0:p[l]};let g=s(m),c=s(u);return typeof g=="string"&&(g=g.toLowerCase()),typeof c=="string"&&(c=c.toLowerCase()),g<c?r?-1:1:g>c?r?1:-1:0})}function q(){const e=document.getElementById("database-table-wrap");if(!e)return;const t=rn(),n=document.getElementById("database-total-count");n&&(n.textContent=t.length.toLocaleString());const o=te.databaseFares,a=Math.max(1,Math.ceil(t.length/o));S.databaseFares>a&&(S.databaseFares=a);const i=(S.databaseFares-1)*o,d=t.slice(i,i+o);if(!d.length){e.innerHTML=`<div class="text-center text-text-muted py-16 px-4">
      <div class="inline-flex flex-col items-center gap-3 opacity-60">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <i class="bi bi-database text-3xl text-slate-400"></i>
        </div>
        <p class="font-semibold text-[14px]">No fares matched your filter</p>
      </div>
    </div>`,we("databaseFares",t.length,a,i,o),Se();return}const l=(g,c)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="databaseFares" data-sort-key="${g}">
      ${c} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i>
    </th>`,r=g=>_.map(c=>`<option value="${F(c.id)}" ${c.id===g?"selected":""}>${F(c.id)} · ${F(c.name||"Unnamed")}</option>`).join(""),m=g=>D.map(c=>`<option value="${F(c.id)}" ${c.id===g?"selected":""}>${F(c.sectorCode||c.id)}</option>`).join(""),u=g=>U.map(c=>`<option value="${F(c.id)}" ${c.id===g?"selected":""}>${F(c.code||"—")} · ${F(c.name||"Unnamed")}</option>`).join(""),s=d.length>0&&d.every(g=>K.has(g.id));e.innerHTML=`
    <table class="admin-database-table">
      <thead>
        <tr>
          <th class="w-[36px] text-center"><input id="database-select-all" type="checkbox" ${s?"checked":""}></th>
          <th class="w-[56px]">#</th>
          ${l("flightDate","Date")}
          ${l("flightTime","Time")}
          ${l("agentId","Agent")}
          ${l("sectorId","Sector")}
          ${l("airlineId","Airline")}
          ${l("specialRate","SP Rate")}
          ${l("finalRate","Rate")}
          ${l("commission","Comm")}
          ${l("baggage","Bag")}
          ${l("extraBaggage","Ex.Bag")}
          ${l("isHidden","Status")}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${d.map((g,c)=>{const p=!!G[g.id],y=K.has(g.id);return`
            <tr data-fare-id="${g.id}" class="${p?"admin-database-row-dirty":""}">
              <td class="text-center">
                <input type="checkbox" data-db-select="${g.id}" ${y?"checked":""}>
              </td>
              <td class="font-mono text-[11px] text-text-soft">${i+c+1}</td>
              <td>
                <input type="date" data-db-field="flightDate" class="db-cell-input" value="${Me(g.flightDate)}">
              </td>
              <td>
                <input type="text" data-db-field="flightTime" class="db-cell-input min-w-[128px]" value="${F(g.flightTime||"")}" placeholder="04:05 - 11:10">
              </td>
              <td>
                <select data-db-field="agentId" class="db-cell-select min-w-[180px]">
                  <option value="">Select Agent</option>
                  ${r(g.agentId)}
                </select>
              </td>
              <td>
                <select data-db-field="sectorId" class="db-cell-select min-w-[140px]">
                  <option value="">Select Sector</option>
                  ${m(g.sectorId)}
                </select>
              </td>
              <td>
                <select data-db-field="airlineId" class="db-cell-select min-w-[170px]">
                  <option value="">No Airline</option>
                  ${u(g.airlineId)}
                </select>
              </td>
              <td>
                <input type="number" data-db-field="specialRate" class="db-cell-input db-cell-num" value="${N(g.specialRate,0)}" min="0" step="1">
              </td>
              <td>
                <input type="number" data-db-field="finalRate" class="db-cell-input db-cell-num" value="${N(g.finalRate,0)}" min="0" step="1">
              </td>
              <td>
                <span data-db-commission class="db-cell-commission">₹${Math.max(0,N(g.finalRate,0)-N(g.specialRate,0)).toLocaleString()}</span>
              </td>
              <td>
                <input type="number" data-db-field="baggage" class="db-cell-input db-cell-num" value="${$e(g.baggage)}" min="0" step="1">
              </td>
              <td>
                <input type="number" data-db-field="extraBaggage" class="db-cell-input db-cell-num" value="${N(g.extraBaggage,0)}" min="0" step="1">
              </td>
              <td>
                <select data-db-field="isHidden" class="db-cell-select min-w-[94px]">
                  <option value="live" ${g.isHidden?"":"selected"}>Live</option>
                  <option value="hidden" ${g.isHidden?"selected":""}>Hidden</option>
                </select>
              </td>
              <td>
                <div class="flex gap-1">
                  <button data-db-action="save" data-id="${g.id}" class="admin-action-btn admin-action-edit" ${p?"":"disabled"}>Save</button>
                  <button data-db-action="reset" data-id="${g.id}" class="admin-action-btn admin-action-toggle" ${p?"":"disabled"}>Reset</button>
                  <button data-db-action="delete" data-id="${g.id}" class="admin-action-btn admin-action-delete">Delete</button>
                </div>
              </td>
            </tr>
          `}).join("")}
      </tbody>
    </table>
  `,we("databaseFares",t.length,a,i,o),Ae("databaseFares"),Se()}async function ut(e,{silent:t=!1}={}){const n=Y.find(l=>l.id===e);if(!n)return!1;if(!G[e])return!0;const a=mt(n),i=Ce(a.flightDate);if(!a.agentId)return t||v("warning","Missing Agent","Please select an agent before saving."),!1;if(!a.sectorId)return t||v("warning","Missing Sector","Please select a sector before saving."),!1;if(!i)return t||v("warning","Missing Date","Please set a valid flight date before saving."),!1;const d={agentId:a.agentId,sectorId:a.sectorId,airlineId:a.airlineId||"",flightDate:i,flightTime:a.flightTime||"",specialRate:N(a.specialRate,0),finalRate:N(a.finalRate,0),commission:Math.max(0,N(a.finalRate,0)-N(a.specialRate,0)),baggage:$e(a.baggage),extraBaggage:N(a.extraBaggage,0),isHidden:a.isHidden===!0};try{return await ke(e,d),Y=Y.map(l=>l.id===e?{...l,...d}:l),delete G[e],t||v("success","Saved","Fare row updated."),!0}catch(l){return t||v("error","Save Failed",l.message),!1}}async function ln(){const e=Object.keys(G);if(!e.length)return;const t=document.getElementById("database-save-all-btn"),n=t==null?void 0:t.innerHTML;t&&(t.disabled=!0,t.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Saving...');let o=0,a=0;for(const i of e)await ut(i,{silent:!0})?o+=1:a+=1;q(),t&&(t.disabled=ct()===0,t.innerHTML=n||"Save All"),a===0?v("success","Saved",`${o} row${o!==1?"s":""} updated.`):v("warning","Partial Save",`${o} saved, ${a} failed. Fix invalid rows and retry.`)}async function dn(){const e=Array.from(K);if(!e.length||!confirm(`Delete ${e.length} selected fare row${e.length!==1?"s":""}? This cannot be undone.`))return;const t=document.getElementById("database-delete-selected-btn"),n=t==null?void 0:t.innerHTML;t&&(t.disabled=!0,t.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Deleting...');const o=await Promise.allSettled(e.map(d=>Oe(d))),a=[];let i=0;if(o.forEach((d,l)=>{d.status==="fulfilled"?a.push(e[l]):i+=1}),a.length){const d=new Set(a);Y=Y.filter(l=>!d.has(l.id)),a.forEach(l=>{delete G[l],K.delete(l)})}q(),t&&(t.innerHTML=n||"Delete Selected"),i===0?v("success","Deleted",`${a.length} row${a.length!==1?"s":""} deleted.`):v("warning","Partial Delete",`${a.length} deleted, ${i} failed.`)}function cn(){const e=Me(new Date);Te("Add Fare Row",`
    <form id="database-add-form" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="admin-label text-[10px] mb-1">Date *</label>
          <input id="db-add-date" type="date" class="admin-control h-10" value="${e}" required>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Time</label>
          <input id="db-add-time" type="text" class="admin-control h-10" placeholder="e.g. 04:05 - 11:10">
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="admin-label text-[10px] mb-1">Agent *</label>
          <select id="db-add-agent" class="admin-control h-10" required>
            <option value="">Select Agent</option>
            ${_.map(n=>`<option value="${F(n.id)}">${F(n.id)} · ${F(n.name||"Unnamed")}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Sector *</label>
          <select id="db-add-sector" class="admin-control h-10" required>
            <option value="">Select Sector</option>
            ${D.map(n=>`<option value="${F(n.id)}">${F(n.sectorCode||n.id)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Airline</label>
          <select id="db-add-airline" class="admin-control h-10">
            <option value="">No Airline</option>
            ${U.map(n=>`<option value="${F(n.id)}">${F(n.code||"—")} · ${F(n.name||"Unnamed")}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="admin-label text-[10px] mb-1">SP Rate (₹)</label>
          <input id="db-add-sp" type="number" class="admin-control h-10" min="0" step="1" value="0">
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Final Rate (₹)</label>
          <input id="db-add-rate" type="number" class="admin-control h-10" min="0" step="1" value="0">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="admin-label text-[10px] mb-1">Baggage (kg)</label>
          <input id="db-add-bag" type="number" class="admin-control h-10" min="0" step="1" value="0">
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Extra Baggage (kg)</label>
          <input id="db-add-exbag" type="number" class="admin-control h-10" min="0" step="1" value="0">
        </div>
      </div>

      <div>
        <label class="admin-label text-[10px] mb-1">Status</label>
        <select id="db-add-status" class="admin-control h-10">
          <option value="live">Live</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button type="button" onclick="document.getElementById('admin-modal').close()" class="admin-btn admin-btn-ghost px-5">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary px-5">Add Fare</button>
      </div>
    </form>
  `);const t=document.getElementById("database-add-form");t&&t.addEventListener("submit",async n=>{var i,d,l,r,m,u,s,g,c,p,y,w;n.preventDefault();const o=t.querySelector('button[type="submit"]'),a=(o==null?void 0:o.textContent)||"Add Fare";o&&(o.disabled=!0,o.textContent="Adding...");try{const b=((i=document.getElementById("db-add-date"))==null?void 0:i.value)||"",E=ot(b);if(!E)throw new Error("Please provide a valid flight date.");const f=N((d=document.getElementById("db-add-sp"))==null?void 0:d.value,0),h=N((l=document.getElementById("db-add-rate"))==null?void 0:l.value,0);await kt({agentId:((r=document.getElementById("db-add-agent"))==null?void 0:r.value)||"",sectorId:((m=document.getElementById("db-add-sector"))==null?void 0:m.value)||"",airlineId:((u=document.getElementById("db-add-airline"))==null?void 0:u.value)||"",flightDate:E,flightTime:((g=(s=document.getElementById("db-add-time"))==null?void 0:s.value)==null?void 0:g.trim())||"",specialRate:f,finalRate:h,commission:Math.max(0,h-f),baggage:$e((c=document.getElementById("db-add-bag"))==null?void 0:c.value),extraBaggage:N((p=document.getElementById("db-add-exbag"))==null?void 0:p.value,0),isHidden:(((y=document.getElementById("db-add-status"))==null?void 0:y.value)||"live")==="hidden"}),(w=document.getElementById("admin-modal"))==null||w.close(),await We(!0),v("success","Added","New fare row added.")}catch(b){v("error","Add Failed",b.message),o&&(o.disabled=!1,o.textContent=a)}})}const mn="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",un={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},Qe=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let se=null,re=JSON.parse(localStorage.getItem("zt_hist")||"[]"),Ve=re.reduce((e,t)=>e+(t.rows||0),0);function pn(){var t,n,o,a;const e=document.getElementById("rateData");e&&e.addEventListener("input",function(){const i=this.value.length,d=document.getElementById("charCount");d&&(d.textContent=i.toLocaleString()+" character"+(i!==1?"s":"")),ve(),clearTimeout(window._previewTimer),i>15?window._previewTimer=setTimeout(()=>bn(this.value),500):Fe()}),(t=document.getElementById("resetBtn"))==null||t.addEventListener("click",()=>{e&&(e.value="");const i=document.getElementById("charCount");i&&(i.textContent="0 characters"),Fe(),ve()}),(n=document.getElementById("clearBtn"))==null||n.addEventListener("click",()=>{re=[],Ve=0,De(),Be(),Pe()}),(o=document.getElementById("manualAgent"))==null||o.addEventListener("input",function(){const i=parseInt(this.value);se=i>0?String(i):null,document.querySelectorAll(".rp-chip").forEach(d=>d.classList.remove("on")),pt(),ve()}),(a=document.getElementById("submitBtn"))==null||a.addEventListener("click",hn),Pe(),Be()}function gn(){const e=document.getElementById("chipGrid");if(!e||e.children.length>0)return;const t=_.length?[..._].sort((n,o)=>{const a=parseInt(n.id),i=parseInt(o.id);return!isNaN(a)&&!isNaN(i)?a-i:n.id.localeCompare(o.id)}):[];if(!t.length){e.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>';return}t.forEach(n=>{const o=document.createElement("div");o.className="rp-chip",o.dataset.agentId=n.id,o.textContent=n.id,o.addEventListener("click",()=>fn(n.id,n.name,o)),e.appendChild(o)})}function fn(e,t,n){se=e,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(o=>{o.classList.remove("on")}),n&&n.classList.add("on"),pt(),ve()}function pt(){const e=document.getElementById("agentPill");if(e)if(se){const t=_.find(n=>n.id===se);e.textContent=`Agent ${(t==null?void 0:t.id)||se} selected ✓`,e.classList.remove("empty")}else e.textContent="No agent selected",e.classList.add("empty")}function ve(){const e=document.getElementById("rateData"),t=document.getElementById("submitBtn");t&&(t.disabled=!(se&&e&&e.value.trim().length>10))}function gt(e){const t=[];let n=null,o="IX";for(const a of e.split(`
`)){const i=a.replace(/[*_~`]/g,"").trim();if(!i)continue;const d=i.match(/([A-Z]{3})\s+([A-Z]{3})/);if(d&&i.length<70&&!i.match(/\d{4,6}/)){n=d[1]+"-"+d[2];const l=i.match(Qe);l&&(o=l[1]);continue}if(n){const l=i.match(Qe);if(l&&!i.match(/\d{4,6}/)){o=l[1];continue}const r=i.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(r){const m=parseInt(r[3]);m>=1e3&&m<=99999&&t.push({sector:n,date:`2026-${un[r[2].toUpperCase()]}-${r[1].padStart(2,"0")}`,airline:l?l[1]:o,rate:m})}}}return t}function bn(e){const t=gt(e);if(!t.length){Fe();return}const n=document.getElementById("prevBox");n&&n.classList.add("on");const o=document.getElementById("prevCount");o&&(o.textContent=t.length+" entr"+(t.length===1?"y":"ies"));const a=document.getElementById("prevBody");a&&(a.innerHTML=t.slice(0,60).map(i=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${i.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${i.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${i.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${i.rate.toLocaleString()}</td></tr>`).join(""),t.length>60&&(a.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${t.length-60} more</td></tr>`))}function Fe(){var e;(e=document.getElementById("prevBox"))==null||e.classList.remove("on")}async function hn(){const e=document.getElementById("rateData");if(!se||!(e!=null&&e.value.trim()))return;const t=document.getElementById("submitBtn"),n=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI...';const o=document.getElementById("progBar"),a=document.getElementById("progFill");o&&o.classList.add("on");let i=0;const d=setInterval(()=>{i=Math.min(i+Math.random()*13,85),a&&(a.style.width=i+"%")},280),l=gt(e.value),r={id:Date.now(),agent:se,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:l.length,status:"pen"};re.unshift(r),re.length>15&&re.pop(),De(),Be();try{const m=await fetch(mn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:se,raw_text:e.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(d),a&&(a.style.width="100%"),m.ok)r.status="ok",Ve+=l.length,De(),Be(),Pe(),v("success","Submitted","Rates dispatched to AI Agent. The database will reflect parsing results momentarily."),setTimeout(()=>{e.value="";const u=document.getElementById("charCount");u&&(u.textContent="0 characters"),Fe(),ve()},500);else throw new Error("N8N webhook rejected payload")}catch(m){clearInterval(d),a&&(a.style.width="100%"),r.status="err",De(),Be(),v("error","Submission Failed",m.message)}setTimeout(()=>{o&&o.classList.remove("on"),a&&(a.style.width="0%"),t.innerHTML=n,ve()},900)}function Pe(){const e=document.getElementById("statSubs");e&&(e.textContent=re.length);const t=document.getElementById("statEntries");t&&(t.textContent=Ve)}function De(){localStorage.setItem("zt_hist",JSON.stringify(re))}function Be(){const e=document.getElementById("historyWrap");if(e){if(!re.length){e.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}e.innerHTML=re.map(t=>{var o;const n=((o=_.find(a=>a.id===t.agent))==null?void 0:o.name)||`Agent ${t.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${n.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${n}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${t.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${t.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${t.status==="ok"?"bg-green-500":t.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}const xn=210/25.4*96,yn=297/25.4*96;function et(){const e=document.getElementById("eticket-output-wrapper"),t=document.getElementById("eticket-print-area");if(!e||!t||e.classList.contains("hidden"))return;t.style.zoom="1",t.style.removeProperty("--eticket-print-scale");const n=Math.max(t.scrollWidth,t.offsetWidth),o=Math.max(t.scrollHeight,t.offsetHeight);if(!n||!o)return;const a=xn/n,i=yn/o;let d=Math.min(1,a,i);d<1&&(d=Math.max(.7,d*.985)),t.style.zoom=String(d),t.style.setProperty("--eticket-print-scale",String(d))}function vn(){const e=document.getElementById("eticket-print-area");e&&(e.style.zoom="1",e.style.removeProperty("--eticket-print-scale"))}async function wn(){var l;const e=document.getElementById("eticket-tab");if(!e)return;const t=document.getElementById("eticket-form"),n=document.getElementById("et-add-passenger"),o=document.getElementById("et-passengers-container"),a=document.getElementById("et-airline"),i=document.getElementById("et-origin"),d=document.getElementById("et-destination");if(U.length===0&&(U=await _e()),D.length===0&&(D=ze(await qe())),!e.dataset.wired){if(e.dataset.wired="1",a&&U&&(a.innerHTML='<option value="">Select Airline</option>'+U.map(m=>`<option value="${m.name}">${m.name}</option>`).join("")),i&&D){const m=[...new Set(D.map(u=>u.sectorFrom).filter(Boolean))].sort();i.innerHTML='<option value="">Select Origin</option>'+m.map(u=>`<option value="${u}">${u}</option>`).join("")}if(d&&D){const m=[...new Set(D.map(u=>u.sectorTo).filter(Boolean))].sort();d.innerHTML='<option value="">Select Destination</option>'+m.map(u=>`<option value="${u}">${u}</option>`).join("")}const r=()=>{const m=Array.from(o.querySelectorAll(".et-pax-row"));m.forEach((u,s)=>{const g=u.querySelector(".et-passenger-index");g&&(g.textContent=`Passenger ${s+1}`);const c=u.querySelector(".et-remove-passenger");c&&(m.length<=1?(c.classList.add("opacity-40","pointer-events-none"),c.setAttribute("aria-disabled","true")):(c.classList.remove("opacity-40","pointer-events-none"),c.removeAttribute("aria-disabled")))})};n==null||n.addEventListener("click",()=>{o.insertAdjacentHTML("beforeend",`
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
      `),r()}),o==null||o.addEventListener("click",m=>{var s;const u=m.target.closest(".et-remove-passenger");u&&((s=u.closest(".et-pax-row"))==null||s.remove(),r())}),o.children.length===0&&(n==null||n.click()),r(),t==null||t.addEventListener("submit",async m=>{m.preventDefault(),await $n(new FormData(t))}),(l=document.getElementById("et-print-btn"))==null||l.addEventListener("click",()=>{et(),requestAnimationFrame(()=>window.print())}),window.addEventListener("beforeprint",et),window.addEventListener("afterprint",vn),t==null||t.addEventListener("reset",()=>{setTimeout(()=>{var m;Array.from(o.children).forEach((u,s)=>{s>0&&u.remove()}),o.children.length===0&&(n==null||n.click()),r(),(m=document.getElementById("eticket-output-wrapper"))==null||m.classList.add("hidden")},10),v("info","Form Reset","The E-Ticket form has been cleared.")})}}async function $n(e){var Ie,O,M;const t=(Ie=e.get("etPnr"))==null?void 0:Ie.toUpperCase(),n=(O=e.get("etAirline"))==null?void 0:O.toUpperCase(),o=(M=e.get("etFlightNo"))==null?void 0:M.toUpperCase(),a=e.get("etDate"),i=e.get("etDepTime"),d=e.get("etArrTime"),l=e.get("etPhone"),r=(I="")=>String(I).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),m=I=>{const H=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec(I||"");return H?Number(H[1])*60+Number(H[2]):null},u=(I="")=>I.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",s=I=>{const H=(I||"").trim();let j=H,be="";const W=H.match(/^(.*?)\s*\((.*?)\)$/);return W&&(j=W[1].trim(),be=W[2].trim()),{city:j,code:be}},g=s(e.get("etOrigin")),c=s(e.get("etDest")),p=e.get("etOrigin")||"—",y=e.get("etDest")||"—";let w="—";if(a){const I=new Date(a);if(!isNaN(I.getTime())){const H=["SUN","MON","TUE","WED","THU","FRI","SAT"],j=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];w=`${H[I.getDay()]}, ${String(I.getDate()).padStart(2,"0")} ${j[I.getMonth()]} ${I.getFullYear()}`}}const b=I=>document.getElementById(I);let E=g.code,f=c.code,h=null;if(typeof D<"u"){if(h=D.find(I=>I.sectorFrom===p&&I.sectorTo===y),!h&&p){const I=D.find(H=>H.sectorFrom===p);I&&I.sectorCode&&(E=I.sectorCode.split(/[ -]+/)[0])}if(!h&&y){const I=D.find(H=>H.sectorTo===y);I&&I.sectorCode&&(f=I.sectorCode.split(/[ -]+/).pop())}}const $=(E||u(g.city)).toUpperCase(),L=(f||u(c.city)).toUpperCase(),P=`${$} - ${L}`,V=`${(g.city||p).toUpperCase()} to ${(c.city||y).toUpperCase()}`,X=(g.city||p).toUpperCase(),ne=(c.city||y).toUpperCase(),ae=m(i),le=m(d);let ce="N/A";if(ae!==null&&le!==null){let I=le-ae;I<0&&(I+=24*60);const H=Math.floor(I/60),j=I%60;ce=`${H}h ${String(j).padStart(2,"0")}m`}b("t-pnr")&&(b("t-pnr").textContent=t||"—"),b("t-issued-by")&&(b("t-issued-by").textContent=n||"—"),b("t-customer-phone")&&(b("t-customer-phone").textContent=l||"—"),b("t-flight-code")&&(b("t-flight-code").textContent=o||"—"),b("t-travel-date")&&(b("t-travel-date").textContent=w||"—"),b("t-route-code")&&(b("t-route-code").textContent=P),b("t-route-long")&&(b("t-route-long").textContent=V),b("t-duration")&&(b("t-duration").textContent=ce);const x=new Date,B=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],C=`${String(x.getDate()).padStart(2,"0")} ${B[x.getMonth()]} ${x.getFullYear()} ${String(x.getHours()).padStart(2,"0")}:${String(x.getMinutes()).padStart(2,"0")}`;b("t-booked-on")&&(b("t-booked-on").textContent=C);const R=b("t-airline-logo"),T=b("t-issued-by-fallback");if(R){const I=typeof U<"u"?U.find(H=>H.name.toUpperCase()===n):null;I&&I.logoUrl?(R.src=I.logoUrl,R.classList.remove("hidden"),T&&T.classList.add("hidden")):(R.removeAttribute("src"),R.classList.add("hidden"),T&&(T.classList.remove("hidden"),T.textContent=(n||"No logo").toUpperCase()))}const Ee=e.getAll("paxTitle[]"),J=e.getAll("paxName[]"),ge=e.getAll("paxType[]"),me=e.getAll("paxCheckBag[]"),Z=e.getAll("paxCarryBag[]");b("t-pax-count")&&(b("t-pax-count").textContent=String(J.length));const z=document.getElementById("t-passengers-tbody");if(z){const I=J.map((H,j)=>{const be=r((Ee[j]||"MR").toUpperCase()),W=r((J[j]||"").toUpperCase()),Ne=r((ge[j]||"ADT").toUpperCase()),Le=r((me[j]||"—").toUpperCase()),he=r((Z[j]||"—").toUpperCase()),xe=h&&h.sectorCode?r(h.sectorCode.toUpperCase()):r(P);return`
        <tr class="${j%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${j+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${be}. ${W}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Ne}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${xe}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${r(o||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${r(t||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${he}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Le}</td>
        </tr>
      `}).join("");z.innerHTML=I||`
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `}const Q=document.getElementById("t-travel-tbody");Q&&(Q.innerHTML=`
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${r(o||"—")}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${r(X)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${r($)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${r(i||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${r(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${r(ne)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${r(L)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${r(d||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${r(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const fe=document.getElementById("eticket-output-wrapper");fe&&(fe.classList.remove("hidden"),fe.scrollIntoView({behavior:"smooth"}))}const tt={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function v(e,t,n){const o=document.getElementById("toastsEl");if(!o)return;const a=document.createElement("div"),i={success:"border-green-500 bg-green-50 text-green-800",error:"border-red-500 bg-red-50 text-red-800",warning:"border-yellow-500 bg-yellow-50 text-yellow-800",info:"border-primary bg-primary/10 text-[var(--color-primary-dark)]"};a.className=`flex items-start gap-3 p-4 border-l-4 rounded shadow-md w-80 pointer-events-auto ${i[e]||i.error}`,a.innerHTML=`<div class="mt-0.5">${tt[e]||tt.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${t}</div><div class="text-xs opacity-90 mt-1">${n}</div></div>
    <button class="opacity-50 hover:opacity-100" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,o.appendChild(a),setTimeout(()=>a.isConnected&&a.remove(),7e3)}window.toast=v;document.addEventListener("DOMContentLoaded",()=>{});
