import"./firebase-config-zYKzaodH.js";import{o as xt,l as yt}from"./auth-DrXkAved.js";import{a as Fe,d as Oe,u as nt,c as at,e as vt,f as wt,h as Et,i as $t,j as It,g as qe,k as St,l as Ct,m as Bt,n as At,b as _e,o as Lt,p as Tt,q as kt,r as Dt,s as Ft}from"./db-DzAbaNrJ.js";async function Rt(e,t,n,o,a){const s=`Generating ${e} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",s),new Promise(async(l,r)=>{try{let de=function(b,C,B,R,L){i.beginPath(),i.moveTo(b+L,C),i.lineTo(b+B-L,C),i.arcTo(b+B,C,b+B,C+L,L),i.lineTo(b+B,C+R-L),i.arcTo(b+B,C+R,b+B-L,C+R,L),i.lineTo(b+L,C+R),i.arcTo(b,C+R,b,C+R-L,L),i.lineTo(b,C+L),i.arcTo(b,C,b+L,C,L),i.closePath()},le=function(b){var $e;const C=b-ae;if(C>ne){try{G.stop()}catch(O){console.error("Error stopping recorder",O)}return}i.fillStyle="#f8fafc",i.fillRect(0,0,d,c);const B=e==="9x16"?400:300;if(i.fillStyle="#1e293b",i.fillRect(0,0,d,B),S.complete&&S.width>0){i.globalAlpha=.2;const O=Math.max(d/S.width,B/S.height),M=S.width*O,E=S.height*O,H=(d-M)/2,N=(B-E)/2;i.drawImage(S,H,N,M,E),i.globalAlpha=1}const R=i.createLinearGradient(0,0,0,B);R.addColorStop(0,"#1e293b"),R.addColorStop(1,"transparent"),i.fillStyle=R,i.globalAlpha=.8,i.fillRect(0,0,d,B),i.globalAlpha=1,i.textAlign="center",i.textBaseline="middle";const L=i.createLinearGradient(0,0,d,0);L.addColorStop(0,"#2563eb"),L.addColorStop(.5,"#60a5fa"),L.addColorStop(1,"#1558c0"),i.fillStyle=L,i.fillRect(0,0,d,16);const Ee=200,K=40,ge=60;i.fillStyle="rgba(37, 99, 235, 0.4)",de(d/2-Ee/2,ge,Ee,K,20),i.fill(),i.strokeStyle="rgba(37, 99, 235, 0.6)",i.lineWidth=1,i.stroke(),i.fillStyle="#bfdbfe",i.font="bold 16px Arial, sans-serif",i.fillText("EXCLUSIVE DEALS",d/2,ge+K/2),i.fillStyle="#ffffff",i.font="900 "+(e==="16x9"?"70px":"56px")+" Arial, sans-serif",i.fillText(`${m} → ${p}`,d/2,ge+80),i.fillStyle="#dbeafe",i.font="700 24px Arial, sans-serif",i.fillText("SPECIAL FARES AVAILABLE NOW",d/2,ge+140);const ce=B+60,Z=90,_=e==="9x16"?40:e==="1x1"?80:160,Q=d-_*2;i.fillStyle="#64748b",i.font="bold 18px Arial, sans-serif",i.textAlign="left",i.fillText("DATE",_+20,ce-20),i.textAlign="center",i.fillText("AIRLINE",_+Q*.35,ce-20),i.fillText("TIME",_+Q*.65,ce-20),i.textAlign="right",i.fillText("FARE",_+Q-20,ce-20);for(let O=0;O<y.length;O++){const M=y[O],E=1e3+O*800;if(C<E)continue;const N=Math.min(1,(C-E)/500),fe=20*(1-N),V=ce+O*Z+fe;i.globalAlpha=N,O%2===0&&(i.fillStyle="#ffffff",de(_,V,Q,Z-10,12),i.fill()),i.fillStyle="#0f172a",i.textBaseline="middle";const Ne=M.flightDate instanceof Date?M.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():M.flightDate;i.textAlign="left",i.font="900 26px Arial, sans-serif",i.fillText(Ne,_+20,V+Z/2-5);const Te=_+Q*.35,be=h[M.airlineId];if(be&&be.width>0){const me=Math.min(100,be.width),Xe=40;i.drawImage(be,Te-me/2,V+Z/2-5-Xe/2,me,Xe)}else{i.font="700 20px Arial, sans-serif",i.textAlign="center";const me=(($e=w[M.airlineId])==null?void 0:$e.name)||M.airlineId||"—";i.fillText(me,Te,V+Z/2-5)}let he=M.flightTime||"—";if(he.includes("-")){const me=he.split("-");he=`${me[0].trim()} - ${me[1].trim()}`}i.font="800 22px Arial, sans-serif",i.textAlign="center",i.fillText(he,_+Q*.65,V+Z/2-5);const je=`₹${(M.finalRate||0).toLocaleString()}`;i.font="900 26px Arial, sans-serif",i.textAlign="right";const ht=i.measureText(je).width,Je=_+Q-20,Ke=ht+40,Ye=50;i.fillStyle="#0f172a",de(Je-Ke,V+Z/2-5-Ye/2,Ke,Ye,12),i.fill(),i.fillStyle="#ffffff",i.fillText(je,Je-20,V+Z/2-5),i.globalAlpha=1}const pe=1e3+y.length*800+500;if(C>pe){const O=Math.min(1,(C-pe)/500);i.globalAlpha=O;const M=100,E=c-M+20*(1-O);i.fillStyle="#ffffff",i.fillRect(0,c-M,d,M),i.fillRect(0,E,d,M),i.fillStyle="#f1f5f9",i.fillRect(0,c-M,d,2),f.complete&&f.width>0&&i.drawImage(f,_,c-M/2-24,48,48),i.fillStyle="#1e293b",i.font="900 24px Arial, sans-serif",i.textAlign="left",i.textBaseline="middle",i.fillText("Zamra Travels",_+64,c-M/2),i.font="700 20px Arial, sans-serif",i.textAlign="right",i.fillText("zamratravels.com  |  +91 98765 43210",d-_,c-M/2),i.globalAlpha=1}requestAnimationFrame(le)},d,c;if(e==="1x1")d=1080,c=1080;else if(e==="9x16")d=1080,c=1920;else if(e==="16x9")d=1920,c=1080;else throw new Error("Invalid ratio selected");const u=document.createElement("canvas");u.width=d,u.height=c;const i=u.getContext("2d");i.imageSmoothingEnabled=!0;const g=o.find(b=>b.id===n),m=g?(g.sectorFrom||"DEP").toUpperCase():"DEP",p=g?(g.sectorTo||"ARR").toUpperCase():"ARR",y=[...t].sort((b,C)=>{let B=b.flightDate,R=C.flightDate;return B instanceof Date&&(B=B.getTime()),R instanceof Date&&(R=R.getTime()),B-R}).slice(0,10),w={};a.forEach(b=>{b.id&&(w[b.id]=b),b.code&&(w[b.code]=b),b.name&&(w[b.name]=b)});async function $(b){if(!b)return null;try{const C=await fetch(b);if(!C.ok)return null;const B=await C.blob(),R=URL.createObjectURL(B);return new Promise((L,Ee)=>{const K=new Image;K.onload=()=>L(K),K.onerror=()=>L(null),K.src=R})}catch{return null}}const S=new Image;await new Promise(b=>{S.onload=b,S.onerror=b,S.src="/assets/img/hero-bg.webp"});const f=new Image;await new Promise(b=>{f.onload=b,f.onerror=b,f.src="/assets/img/logo.webp"});const h={},v=[...new Set(y.map(b=>b.airlineId))].map(b=>w[b]).filter(b=>b==null?void 0:b.logoUrl);await Promise.all(v.map(async b=>{const C=await $(b.logoUrl);C&&(h[b.id]=C)}));const T=u.captureStream(30);let j="video/mp4";MediaRecorder.isTypeSupported(j)||(j="video/webm; codecs=h264",MediaRecorder.isTypeSupported(j)||(j="video/webm"));const G=new MediaRecorder(T,{mimeType:j}),J=[];G.ondataavailable=b=>{b.data&&b.data.size>0&&J.push(b.data)},G.start(100);const ne=1e4+y.length*1500,ae=performance.now();requestAnimationFrame(le),G.onstop=()=>{const b=new Blob(J,{type:j}),C=URL.createObjectURL(b),B=document.createElement("a");B.href=C,B.download=`zamra-video-${e}-${Date.now()}.mp4`,B.style.display="none",document.body.appendChild(B),B.click(),setTimeout(()=>{document.body.removeChild(B),URL.revokeObjectURL(C)},100),window.toast&&window.toast("success","Video Generated",`Your ${e} video has been downloaded!`),l()},G.onerror=b=>{console.error("Recorder Error:",b),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),r(b)}}catch(d){console.error(d),window.toast&&window.toast("error","Generation Failed",d.message),r(d)}})}let z=[],D=[],U=[],P=[],X=[],W={},Y=new Set;function xe(e){return e==null?e:String(e).replace(/damamm/gi,t=>t===t.toUpperCase()?"DAMMAM":t===t.toLowerCase()?"dammam":"Dammam")}function ot(e={}){return{...e,sectorFrom:xe(e.sectorFrom||""),sectorTo:xe(e.sectorTo||""),sectorCode:xe(e.sectorCode||"")}}function ze(e=[]){return e.map(t=>ot(t))}function k(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function F(e,t=0){const n=Number(e);return Number.isFinite(n)?n:t}function we(e){if(e==null||e==="")return 0;const t=parseFloat(String(e).replace(/[^\d.]/g,""));return Number.isFinite(t)?t:0}function Ce(e){if(!e)return null;if(e instanceof Date)return Number.isNaN(e.getTime())?null:e;const t=new Date(e);return Number.isNaN(t.getTime())?null:t}function Re(e){const t=Ce(e);if(!t)return"";const n=t.getTimezoneOffset();return new Date(t.getTime()-n*60*1e3).toISOString().split("T")[0]}function st(e){if(!e)return null;const t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?null:t}function Mt(e){if(!e)return null;const t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?null:t.getTime()}function Ht(e){if(!e)return null;const t=new Date(`${e}T23:59:59.999`);return Number.isNaN(t.getTime())?null:t.getTime()}let ee={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},reportFares:{key:"flightDate",asc:!0},databaseFares:{key:"flightDate",asc:!0}},Me={agents:"",sectors:"",airlines:""},te={agents:10,sectors:10,airlines:10,reportFares:20,databaseFares:20},I={agents:1,sectors:1,airlines:1,reportFares:1,databaseFares:1};const A={search:"",agentId:"all",sectorId:"all",airlineId:"all",status:"all",startDate:"",endDate:""};function Ge(e,t){var l;let n=e;const o=(l=Me[t])==null?void 0:l.toLowerCase();o&&t==="agents"?n=n.filter(r=>(r.name||"").toLowerCase().includes(o)||(r.email||"").toLowerCase().includes(o)||(r.contactPhone||"").toLowerCase().includes(o)||(r.id||"").toLowerCase().includes(o)):o&&t==="sectors"?n=n.filter(r=>(r.sectorFrom||"").toLowerCase().includes(o)||(r.sectorTo||"").toLowerCase().includes(o)||(r.sectorCode||"").toLowerCase().includes(o)):o&&t==="airlines"&&(n=n.filter(r=>(r.name||"").toLowerCase().includes(o)||(r.code||"").toLowerCase().includes(o)));const{key:a,asc:s}=ee[t];return a&&(n=[...n].sort((r,d)=>{let c=r[a],u=d[a];if(c instanceof Date&&(c=c.getTime()),u instanceof Date&&(u=u.getTime()),a==="id"){const i=parseInt(c),g=parseInt(u);if(!isNaN(i)&&!isNaN(g))return s?i-g:g-i}return typeof c=="string"&&(c=c.toLowerCase()),typeof u=="string"&&(u=u.toLowerCase()),c<u?s?-1:1:c>u?s?1:-1:0})),n}function Le(e){document.querySelectorAll(`th[data-sort-tab="${e}"] i`).forEach(n=>{n.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const t=document.querySelector(`th[data-sort-tab="${e}"][data-sort-key="${ee[e].key}"]`);if(t){const n=t.querySelector("i");n&&(n.className=`bi bi-arrow-${ee[e].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",e=>{const t=e.target.closest("th[data-sort-tab]");if(!t)return;const n=t.dataset.sortTab,o=t.dataset.sortKey;ee[n].key===o?ee[n].asc=!ee[n].asc:(ee[n].key=o,ee[n].asc=!0),n==="agents"?oe(!1):n==="sectors"?se(!1):n==="airlines"?ue(!1):n==="reportFares"&&P.length?Be(P):n==="databaseFares"&&q()});document.documentElement.style.visibility="hidden";xt(async e=>{if(!e){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const t=document.getElementById("admin-user-name");t&&(t.textContent=e.email.split("@")[0]),await Nt(),bn(),await it()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("admin-logout-btn");e&&e.addEventListener("click",async()=>{(await yt()).success&&(window.location.href="/login.html")}),Pt(),jt(),fn()});async function Nt(){try{const[e,t,n]=await Promise.all([at(),qe(),_e()]);z=e,D=ze(t),U=n}catch(e){console.error("loadGlobalData error:",e)}}function jt(){const e=document.querySelectorAll(".nav-link"),t=document.querySelectorAll(".tab-content"),n=document.getElementById("page-title");e.forEach(o=>{o.addEventListener("click",async a=>{var r;a.preventDefault(),e.forEach(d=>{d.classList.remove("active","text-primary"),d.classList.add("text-text-muted")}),o.classList.remove("text-text-muted"),o.classList.add("active","text-primary");const s=o.getAttribute("data-tab"),l=o.getAttribute("data-title");t.forEach(d=>d.classList.remove("active")),(r=document.getElementById(s))==null||r.classList.add("active"),n&&l&&(n.textContent=l),await it()})})}async function it(){const e=document.querySelector(".tab-content.active");if(!e)return;const t=e.id;t==="agents-tab"?await oe():t==="sectors-tab"?await se():t==="flights-tab"?await ue():t==="dashboard-tab"?await Ut():t==="reports-tab"?await Yt():t==="database-tab"?await We():t==="eticket-tab"&&await $n()}function Pt(){const e=document.getElementById("admin-modal"),t=document.getElementById("modal-close-btn");t&&t.addEventListener("click",()=>e.close()),e==null||e.addEventListener("click",n=>{n.target===e&&e.close()})}function He(e,t){const n=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=e,document.getElementById("modal-body").innerHTML=t,n.showModal()}async function Ut(){var o,a,s,l,r;if(!document.getElementById("dashboard-tab"))return;const t=document.getElementById("poster-sector-sel");t&&t.options.length<=1&&D.forEach(d=>{const c=new Option(d.sectorCode,d.id);t.appendChild(c)});const n=document.getElementById("poster-generate-btn");n&&!n.dataset.wired&&(n.dataset.wired="1",n.addEventListener("click",async()=>{const d=document.getElementById("poster-start-date"),c=document.getElementById("poster-end-date"),u=t==null?void 0:t.value,i=(d==null?void 0:d.value)||null,g=(c==null?void 0:c.value)||null;if(!u){x("warning","Validation Error","Please select a sector to generate the poster.");return}n.disabled=!0,n.textContent="Generating…";try{const m=await Fe({sectorId:u,startDate:i,endDate:g,includeHidden:!1});if(!m||!m.length){x("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await Ot(m,u)}catch(m){x("error","Generation Failed",m.message)}finally{n.disabled=!1,n.textContent="Generate Poster"}}),(o=document.getElementById("poster-download-jpg"))==null||o.addEventListener("click",()=>Ze("jpeg")),(a=document.getElementById("poster-download-pdf"))==null||a.addEventListener("click",()=>Ze("pdf")),(s=document.getElementById("poster-download-vid-1x1"))==null||s.addEventListener("click",()=>Pe("1x1")),(l=document.getElementById("poster-download-vid-9x16"))==null||l.addEventListener("click",()=>Pe("9x16")),(r=document.getElementById("poster-download-vid-16x9"))==null||r.addEventListener("click",()=>Pe("16x9")))}async function Pe(e){const t=document.getElementById("poster-sector-sel"),n=document.getElementById("poster-start-date"),o=document.getElementById("poster-end-date"),a=t==null?void 0:t.value,s=(n==null?void 0:n.value)||null,l=(o==null?void 0:o.value)||null;if(!a){x("warning","Validation Error","Please select a sector to generate the poster.");return}try{const r=await Fe({sectorId:a,startDate:s,endDate:l,includeHidden:!1});if(!r||!r.length){x("warning","No Fares","No live fares found for the selected sector and dates.");return}await Rt(e,r,a,D,U)}catch(r){console.error("Video generation failed",r)}}async function Ot(e,t){const n=document.getElementById("poster-preview-container"),o=document.getElementById("poster-fares-tbody"),a=document.getElementById("poster-sector-title");if(!n||!o||!a)return;const s=D.find(m=>m.id===t),l=s?(s.sectorFrom||"DEP").toUpperCase():"DEP",r=s?(s.sectorTo||"ARR").toUpperCase():"ARR";a.innerHTML=`${l} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${r}`;const d=[...e].sort((m,p)=>{let y=m.flightDate,w=p.flightDate;return y instanceof Date&&(y=y.getTime()),w instanceof Date&&(w=w.getTime()),y-w}).slice(0,10),c={};U.forEach(m=>{m.id&&(c[m.id]=m),m.code&&(c[m.code]=m),m.name&&(c[m.name]=m)});async function u(m){try{const p=await fetch(m);if(!p.ok)return null;const y=await p.blob();return URL.createObjectURL(y)}catch{return null}}const i=[...new Set(d.map(m=>m.airlineId))].map(m=>c[m]).filter(m=>m==null?void 0:m.logoUrl),g={};await Promise.all(i.map(async m=>{const p=await u(m.logoUrl);p&&(g[m.id]=p)})),o.innerHTML=d.map((m,p)=>{const y=m.flightDate instanceof Date?m.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():m.flightDate,w=c[m.airlineId],$=p%2===0?"#ffffff":"#f8fafc",S=g[m.airlineId]||null,f=S?`<img src="${S}" style="height:40px;max-width:100px;object-fit:contain;display:block;margin:0 auto;" alt="${(w==null?void 0:w.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:15px;white-space:nowrap;">${(w==null?void 0:w.name)||m.airlineId||"—"}</span>`;let h='<span style="color:#94a3b8;font-size:14px;">—</span>';if(m.flightTime){const v=m.flightTime.split("-").map(T=>T.trim());v.length>=2?h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${v[0]} - ${v[1]}</span>`:h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${m.flightTime}</span>`}return`
      <tr style="background-color:${$};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 12px;font-weight:900;color:#0f172a;font-size:22px;white-space:nowrap;">${y}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${f}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${h}</td>
        <td style="padding:16px 12px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:8px 18px;border-radius:12px;font-weight:900;font-size:22px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            &#8377;${(m.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),n.classList.remove("hidden"),n.classList.add("flex")}function rt(e){if(!e||e.nodeType!==1)return;const t=window.getComputedStyle(e),n=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const o of n){const a=t.getPropertyValue(o);if(a&&!a.startsWith("rgb")&&!a.startsWith("#")&&a!=="transparent"&&a!=="initial")try{e.style[o]=a}catch{}}for(const o of e.children)rt(o)}async function Ze(e){const t=document.getElementById("poster-render-frame");if(!t)return;const n=document.getElementById("poster-download-jpg"),o=document.getElementById("poster-download-pdf");n&&(n.disabled=!0),o&&(o.disabled=!0);const a=t.style.transform;t.style.transform="none",x("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(t.querySelectorAll("img")).map(r=>r.complete?Promise.resolve():new Promise(d=>{r.onload=d,r.onerror=d})));const s=await html2canvas(t,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:r=>{const d=r.getElementById("poster-render-frame");d&&rt(d)}});t.style.transform=a;const l=s.toDataURL("image/jpeg",.95);if(e==="jpeg"){const r=document.createElement("a");r.download=`zamra-poster-${Date.now()}.jpg`,r.href=l,r.click(),x("success","Downloaded!","JPEG poster saved successfully.")}else if(e==="pdf"){const r=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!r)throw new Error("jsPDF library not loaded.");const d=96/25.4,c=s.width/2/d,u=s.height/2/d,i=new r({orientation:c>u?"landscape":"portrait",unit:"mm",format:[c,u]});i.addImage(l,"JPEG",0,0,c,u),i.save(`zamra-poster-${Date.now()}.pdf`),x("success","Downloaded!","PDF poster saved successfully.")}}catch(s){console.error("Poster export error:",s),t.style.transform=a,x("error","Export Failed",s.message||"There was an error generating the export.")}finally{n&&(n.disabled=!1),o&&(o.disabled=!1)}}function Be(e){const t=document.getElementById("report-fares-results");if(!t)return;if(!e||!e.length){t.innerHTML=`<div class="text-center text-text-muted py-14 px-4">
      <div class="inline-flex flex-col items-center gap-3 opacity-50">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <i class="bi bi-inbox text-3xl text-slate-400"></i>
        </div>
        <p class="font-semibold text-[14px]">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const n=Object.fromEntries(z.map(m=>[m.id,m.name])),o=Object.fromEntries(D.map(m=>[m.id,m.sectorCode])),a=Object.fromEntries(U.map(m=>[m.id,m.code])),{key:s,asc:l}=ee.reportFares,r=[...e].sort((m,p)=>{let y=m[s],w=p[s];return y instanceof Date&&(y=y.getTime()),w instanceof Date&&(w=w.getTime()),typeof y=="string"&&(y=y.toLowerCase()),typeof w=="string"&&(w=w.toLowerCase()),y<w?l?-1:1:y>w?l?1:-1:0}),d=te.reportFares,c=Math.max(1,Math.ceil(e.length/d));I.reportFares>c&&(I.reportFares=c);const u=(I.reportFares-1)*d,i=r.slice(u,u+d),g=(m,p)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${m}">${p} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;t.innerHTML=`
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
          ${i.map((m,p)=>{const y=m.flightDate instanceof Date?m.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):m.flightDate||"—";return`<tr class="${p%2===1?"bg-slate-50/60":""} hover:bg-slate-100/80 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${y}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${m.flightTime||"—"}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${o[m.sectorId]||m.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${a[m.airlineId]||m.airlineId}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${n[m.agentId]||m.agentId}</td>
              <td class="whitespace-nowrap text-[13px] text-text-muted">₹${(m.specialRate||0).toLocaleString()}</td>
              <td class="whitespace-nowrap font-black text-navy text-[14px]">₹${(m.finalRate||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px] text-text-muted" id="comm-${m.id}">₹${(m.commission||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px]">${m.baggage?m.baggage+" kg":"—"}</td>
              <td class="whitespace-nowrap text-[12px]">${m.extraBaggage?m.extraBaggage+" kg":"—"}</td>
              <td class="whitespace-nowrap">
                <span class="admin-status-pill ${m.isHidden?"admin-status-hidden":"admin-status-live"}">
                  ${m.isHidden?"● Hidden":"● Live"}
                </span>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  <button onclick="window.__toggleFare('${m.id}', ${!m.isHidden})"
                    class="admin-action-btn ${m.isHidden?"admin-action-show":"admin-action-toggle"}">
                    ${m.isHidden?"Show":"Hide"}
                  </button>
                  <button onclick="window.__deleteFare('${m.id}')"
                    class="admin-action-btn admin-action-delete">Del</button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,ve("reportFares",e.length,c,u,d),window.__deleteFare=async m=>{if(confirm("Delete this fare?"))try{await Oe(m),P=P.filter(p=>p.id!==m),x("success","Deleted","Fare removed."),Be(P)}catch(p){x("error","Error",p.message)}},window.__toggleFare=async(m,p)=>{try{await nt(m,{isHidden:p}),P=P.map(y=>y.id===m?{...y,isHidden:p}:y),x("success","Updated",`Fare ${p?"hidden":"shown"}.`),Be(P)}catch(y){x("error","Error",y.message)}},Le("reportFares")}async function oe(e=!0){e&&(z=await at(),I.agents=1);const t=document.querySelector("#agents-tab .admin-table tbody");if(!t)return;const n=document.getElementById("agents-search"),o=document.getElementById("agents-limit");n&&!n.dataset.wired&&(n.dataset.wired="1",o&&(o.dataset.wired="1"),n.addEventListener("input",u=>{Me.agents=u.target.value,I.agents=1,oe(!1)}),o&&o.addEventListener("change",u=>{te.agents=parseInt(u.target.value),I.agents=1,oe(!1)}));const a=Ge(z,"agents"),s=te.agents,l=Math.max(1,Math.ceil(a.length/s));I.agents>l&&(I.agents=l);const r=(I.agents-1)*s,d=a.slice(r,r+s);t.innerHTML=d.length?d.map(u=>qt(u)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',ve("agents",a.length,l,r,s),delete t.dataset.actionsWired,_t(),zt(),Gt();const c=document.getElementById("agents-add-btn");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>dt(null))),Le("agents")}function qt(e){const t=e.isActive!==!1?'<span class="admin-status-pill admin-status-active">Active</span>':'<span class="admin-status-pill admin-status-inactive">Hidden</span>',n=e.commission!==void 0?`₹${Number(e.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${e.id}">
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
  </tr>`}function _t(){const e=document.querySelector("#agents-tab .admin-table tbody");!e||e.dataset.actionsWired||(e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const o=n.dataset.action,a=n.dataset.id,s=z.find(l=>l.id===a);if(o==="edit-agent"&&dt(s),o==="delete-agent"){if(!confirm(`Delete agent "${s==null?void 0:s.name}"? This does NOT delete their fares.`))return;try{await vt(a),x("success","Deleted",`Agent "${s==null?void 0:s.name}" removed.`),await oe()}catch(l){x("error","Error",l.message)}}if(o==="toggle-agent"){const r=!(n.dataset.active==="true");n.disabled=!0,n.textContent="Working…";try{const d=await wt(a,r);x("success",r?"Agent Shown":"Agent Hidden",d.message),await oe()}catch(d){x("error","Toggle Failed",d.message),await oe()}}}))}function ve(e,t,n,o,a){const s=document.getElementById(`${e}-pagination-footer`);if(!s)return;const l=Math.min(o+a,t),r=I[e];s.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${t?o+1:0} to ${l} of ${t} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${r<=1?"disabled":""}>Previous</button>
        ${Array.from({length:n},(d,c)=>c+1).map(d=>`<button data-pg-action="goto" data-pg="${d}" class="admin-pagination-btn ${d===r?"admin-pagination-btn-active":""}">${d}</button>`).join("")}
        <button data-pg-action="next" class="admin-pagination-btn" ${r>=n?"disabled":""}>Next</button>
      </div>
    </div>`,s.dataset.wired||(s.dataset.wired="1",s.addEventListener("click",d=>{const c=d.target.closest("[data-pg-action]");if(!c||c.disabled)return;const u=c.dataset.pgAction;u==="prev"?I[e]=Math.max(1,I[e]-1):u==="next"?I[e]++:u==="goto"&&(I[e]=parseInt(c.dataset.pg)),e==="agents"?oe(!1):e==="sectors"?se(!1):e==="airlines"?ue(!1):e==="reportFares"?Be(P):e==="databaseFares"&&q()}))}function dt(e){var n,o;const t=!!e;He(t?"Edit Agent":"Add New Agent",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(o=document.getElementById("agent-form"))==null||o.addEventListener("submit",async a=>{a.preventDefault();const s=new FormData(a.target),l=Object.fromEntries(s.entries()),r=a.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{t?(await Et(e.id,l),x("success","Updated",`Agent "${l.name}" updated.`)):(await $t(l),x("success","Added",`Agent "${l.name}" added.`)),document.getElementById("admin-modal").close(),await oe()}catch(d){x("error","Save Failed",d.message),r.disabled=!1,r.textContent=t?"Save Changes":"Add Agent"}})}function zt(){const e=document.getElementById("agents-bulk-delete-btn");!e||e.dataset.wired||(e.dataset.wired="1",e.addEventListener("click",async()=>{const t=document.getElementById("agents-bulk-agent-sel"),n=document.getElementById("agents-bulk-sector-sel"),o=document.getElementById("agents-bulk-start"),a=document.getElementById("agents-bulk-end"),s=(t==null?void 0:t.value)||null,l=(n==null?void 0:n.value)||null,r=(o==null?void 0:o.value)||null,d=(a==null?void 0:a.value)||null;if(!(s&&s!=="all"||l&&l!=="all"||r||d)){x("warning","No Filter","Select at least an agent, a sector, or a date range before deleting.");return}const u=[];if(s&&s!=="all"&&u.push(`Agent: ${t.options[t.selectedIndex].text}`),l&&l!=="all"&&u.push(`Sector: ${n.options[n.selectedIndex].text}`),r&&u.push(`from ${r}`),d&&u.push(`to ${d}`),!!confirm(`Delete ALL matching fares?
${u.join(" · ")}

This cannot be undone.`)){e.disabled=!0,e.textContent="Deleting…";try{const i=await It(s,r,d,l);x("success","Bulk Delete Complete",i.message)}catch(i){x("error","Bulk Delete Failed",i.message)}finally{e.disabled=!1,e.textContent="Bulk Delete"}}}))}function Gt(){const e=document.getElementById("agents-bulk-agent-sel");if(e){const n=e.value;e.innerHTML='<option value="">All Agents</option>',z.forEach(o=>e.appendChild(new Option(o.name,o.id))),n&&(e.value=n)}const t=document.getElementById("agents-bulk-sector-sel");if(t){const n=t.value;t.innerHTML='<option value="">All Sectors</option>',D.forEach(o=>t.appendChild(new Option(o.sectorCode,o.id))),n&&(t.value=n)}}async function se(e=!0){e&&(D=ze(await qe()),I.sectors=1);const t=document.getElementById("sectors-search"),n=document.getElementById("sectors-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",n.dataset.wired="1",t.addEventListener("input",u=>{Me.sectors=u.target.value,I.sectors=1,se(!1)}),n.addEventListener("change",u=>{te.sectors=parseInt(u.target.value),I.sectors=1,se(!1)}));const o=document.querySelector("#sectors-tab .admin-table tbody");if(!o)return;const a=Ge(D,"sectors"),s=te.sectors,l=Math.max(1,Math.ceil(a.length/s));I.sectors>l&&(I.sectors=l);const r=(I.sectors-1)*s,d=a.slice(r,r+s);o.innerHTML=d.length?d.map(u=>Wt(u)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',ve("sectors",a.length,l,r,s),Vt();const c=document.querySelector("#sectors-tab .flex.justify-between button");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>lt(null))),Le("sectors")}function Wt(e){const t=ot(e);return`<tr data-sector-id="${e.id}">
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
  </tr>`}function Vt(){const e=document.querySelector("#sectors-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const{action:o,id:a}=n.dataset,s=D.find(l=>l.id===a);if(o==="edit-sector"&&lt(s),o==="delete-sector"){if(!confirm(`Delete sector "${s==null?void 0:s.sectorCode}"?`))return;try{await St(a),x("success","Deleted",`Sector "${s==null?void 0:s.sectorCode}" removed.`),await se()}catch(l){x("error","Error",l.message)}}if(o==="toggle-sector"){const r=!(n.dataset.hidden==="true");n.disabled=!0,n.textContent="Working…";try{const d=await Ct(a,r);x("success",`Sector Fares ${r?"Hidden":"Shown"}`,d.message),await se()}catch(d){x("error","Toggle Failed",d.message),await se()}}}))}function lt(e){var n,o;const t=!!e;He(t?"Edit Sector":"Add New Sector",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(o=document.getElementById("sector-form"))==null||o.addEventListener("submit",async a=>{a.preventDefault();const s=new FormData(a.target),l=Object.fromEntries(s.entries());l.sectorCode=xe(l.sectorCode.toUpperCase()),l.sectorFrom=xe(l.sectorFrom.toUpperCase()),l.sectorTo=xe(l.sectorTo.toUpperCase());const r=a.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{t?(await Bt(e.id,l),x("success","Updated","Sector updated.")):(await At(l),x("success","Added",`Sector "${l.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await se()}catch(d){x("error","Save Failed",d.message),r.disabled=!1,r.textContent=t?"Save Changes":"Add Sector"}})}async function ue(e=!0){e&&(U=await _e(),I.airlines=1);const t=document.getElementById("airlines-search"),n=document.getElementById("airlines-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",n.dataset.wired="1",t.addEventListener("input",u=>{Me.airlines=u.target.value,I.airlines=1,ue(!1)}),n.addEventListener("change",u=>{te.airlines=parseInt(u.target.value),I.airlines=1,ue(!1)}));const o=document.querySelector("#flights-tab .admin-table tbody");if(!o)return;const a=Ge(U,"airlines"),s=te.airlines,l=Math.max(1,Math.ceil(a.length/s));I.airlines>l&&(I.airlines=l);const r=(I.airlines-1)*s,d=a.slice(r,r+s);o.innerHTML=d.length?d.map(u=>Jt(u)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "+ Add Flight".</td></tr>',ve("airlines",a.length,l,r,s),Kt();const c=document.querySelector("#flights-tab .flex.justify-between button");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>ct(null))),Le("airlines")}function Jt(e){const t=e.logoUrl?`<img src="${e.logoUrl}" class="h-7 w-7 object-contain rounded" alt="${e.name}">`:`<span class="w-7 h-7 bg-primary-light text-primary text-xs font-bold rounded flex items-center justify-center">${e.code}</span>`;return`<tr data-airline-id="${e.id}">
    <td>${t}</td>
    <td class="font-semibold">${e.name}</td>
    <td><span class="font-mono font-bold text-primary">${e.code}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-airline" data-id="${e.id}" class="admin-action-btn admin-action-edit">Edit</button>
      <button data-action="delete-airline" data-id="${e.id}" class="admin-action-btn admin-action-delete">Delete</button>
    </td>
  </tr>`}function Kt(){const e=document.querySelector("#flights-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const{action:o,id:a}=n.dataset,s=U.find(l=>l.id===a);if(o==="edit-airline"&&ct(s),o==="delete-airline"){if(!confirm(`Delete airline "${s==null?void 0:s.name}" (${s==null?void 0:s.code})?`))return;try{await Lt(a),x("success","Deleted",`Airline "${s==null?void 0:s.name}" removed.`),await ue()}catch(l){x("error","Error",l.message)}}}))}function ct(e){var n,o;const t=!!e;He(t?"Edit Airline":"Add New Airline",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(o=document.getElementById("airline-form"))==null||o.addEventListener("submit",async a=>{var c;a.preventDefault();const s=new FormData(a.target),l=((c=s.get("logoFile"))==null?void 0:c.size)>0?s.get("logoFile"):null,r={name:s.get("name"),code:s.get("code").toUpperCase()},d=a.target.querySelector("[type=submit]");d.disabled=!0,d.textContent="Saving…";try{t?(await Tt(e.id,r,l),x("success","Updated","Airline updated.")):(await kt(r,l),x("success","Added",`Airline "${r.name}" added.`)),document.getElementById("admin-modal").close(),await ue()}catch(u){x("error","Save Failed",u.message),d.disabled=!1,d.textContent=t?"Save Changes":"Add Airline"}})}async function Yt(){const e=document.getElementById("reports-tab");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=document.getElementById("reports-sector-sel");t&&t.options.length<=1&&D.forEach(l=>t.appendChild(new Option(l.sectorCode,l.id)));const n=document.getElementById("reports-agent-sel");n&&n.options.length<=1&&z.forEach(l=>n.appendChild(new Option(l.name,l.id)));const o=document.getElementById("generate-report-btn"),a=document.getElementById("reports-start-date"),s=document.getElementById("reports-end-date");o&&!o.dataset.wired&&(o.dataset.wired="1",o.addEventListener("click",async()=>{const l=(t==null?void 0:t.value)||"all",r=(n==null?void 0:n.value)||"all",d=(a==null?void 0:a.value)||null,c=(s==null?void 0:s.value)||null;if(l==="all"&&!d&&!c&&r==="all"){x("warning","No Filter Selected","Select at least a sector, an agent, or a date range.");return}o.disabled=!0,o.textContent="Generating…";try{const[u,i]=await Promise.all([Dt(d,c,l,r),Fe({sectorId:l,agentId:r,startDate:d,endDate:c,includeHidden:!0})]);P=i,Xt(u,e),I.reportFares=1,Be(P)}catch(u){x("error","Report Failed",u.message)}finally{o.disabled=!1,o.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Xt(e,t){const{agentReport:n,sectorReport:o,totalFares:a}=e,s=document.getElementById("report-stats-row");if(s){s.classList.remove("hidden");const g=(P||[]).filter(f=>!f.isHidden).length,m=(P||[]).filter(f=>f.isHidden).length,p=new Set((P||[]).map(f=>f.agentId)).size,y=(P||[]).map(f=>f.finalRate||0).filter(f=>f>0),w=y.length?Math.round(y.reduce((f,h)=>f+h,0)/y.length):0,$=(f,h)=>{const v=document.getElementById(f);v&&(v.textContent=h.toLocaleString())};$("stat-total-fares",a),$("stat-live-fares",g),$("stat-hidden-fares",m),$("stat-agents-count",p);const S=document.getElementById("stat-avg-fare");S&&(S.textContent=w>0?`₹${w.toLocaleString()}`:"—")}const l=document.getElementById("report-total-fares");l&&(l.textContent=`${a} fare${a!==1?"s":""} matched your filter`);const r=document.getElementById("bar-chart-container");r&&n.length&&Zt(n.slice(0,8),r);const d=document.getElementById("donut-chart-svg"),c=document.getElementById("pie-legend");d&&o.length&&Qt(o.slice(0,8),d,c);const u=document.getElementById("report-leaderboards");u&&(u.classList.remove("hidden"),en(n,o));const i=document.getElementById("download-report-csv");if(i){const g=i.cloneNode(!0);i.parentNode.replaceChild(g,i),g.addEventListener("click",()=>tn(P)),P&&P.length?g.classList.remove("opacity-50","pointer-events-none"):g.classList.add("opacity-50","pointer-events-none")}x("success","Report Ready",`${a} fare${a!==1?"s":""} aggregated.`)}function Zt(e,t){const n=t.clientWidth||480,o=260,a={top:32,right:16,bottom:48,left:48},s=n-a.left-a.right,l=o-a.top-a.bottom,r=Math.max(...e.map(f=>f.count),1),d=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],c=4,u=Math.ceil(r/c),i=Array.from({length:c+1},(f,h)=>h*u),g=i.map(f=>{const h=a.top+l-f/(i[i.length-1]||1)*l;return`<line x1="${a.left}" y1="${h.toFixed(1)}" x2="${n-a.right}" y2="${h.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${a.left-6}" y="${(h+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${f}</text>`}).join(""),m=Math.min(48,s/e.length*.6),p=s/e.length,y=e.map((f,h)=>{const v=Math.max(4,f.count/(i[i.length-1]||1)*l),T=a.left+h*p+p/2-m/2,j=a.top+l-v,[G,J]=d[h%d.length],ne=`bg${h}`,ae=f.avgRate?`avg ₹${Math.round(f.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${ne}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${G}"/>
              <stop offset="100%" stop-color="${J}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${f.name}" data-count="${f.count}" data-avg="${ae}" style="cursor:pointer;">
              <rect x="${T.toFixed(1)}" y="${j.toFixed(1)}" width="${m}" height="${v.toFixed(1)}"
                rx="6" fill="url(#${ne})" opacity="0.92"
                style="transform-origin:${(T+m/2).toFixed(1)}px ${(a.top+l).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${h*.07}s both;"/>
              <text x="${(T+m/2).toFixed(1)}" y="${(j-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${J}">${f.count}</text>
              <text x="${(T+m/2).toFixed(1)}" y="${(a.top+l+16).toFixed(1)}" text-anchor="middle"
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
      <line x1="${a.left}" y1="${a.top}" x2="${a.left}" y2="${a.top+l}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${a.left}" y1="${a.top+l}" x2="${n-a.right}" y2="${a.top+l}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${y}
    </svg>`;const $=t.querySelector("#bar-svg"),S=t.querySelector(`#${w}`);$&&S&&$.querySelectorAll(".bar-group").forEach(f=>{f.addEventListener("mousemove",h=>{const v=t.getBoundingClientRect();S.style.display="block",S.style.left=h.clientX-v.left+12+"px",S.style.top=h.clientY-v.top-40+"px";const T=f.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${f.dataset.avg}</span>`:"";S.innerHTML=`${f.dataset.name}<br><span style="color:#60a5fa;">${f.dataset.count} fares</span>${T}`}),f.addEventListener("mouseleave",()=>{S.style.display="none"})})}function Qt(e,t,n){const o=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],d=e.reduce((f,h)=>f+h.count,0),c=t.getElementById?t.getElementById("donut-segments"):t.querySelector("#donut-segments"),u=t.querySelector("#donut-center-count"),i=t.querySelector("#donut-center-label");if(!c)return;u&&(u.textContent=d),i&&(i.textContent="FARES");const g=(f,h,v,T)=>({x:f+v*Math.cos((T-90)*Math.PI/180),y:h+v*Math.sin((T-90)*Math.PI/180)});let m=0;const p=e.map((f,h)=>{const v=d>0?f.count/d*360:0,T=m+v,j=v>180?1:0,G=g(110,110,95,m),J=g(110,110,95,T),ne=g(110,110,60,m),ae=g(110,110,60,T),de=[`M ${G.x.toFixed(2)} ${G.y.toFixed(2)}`,`A 95 95 0 ${j} 1 ${J.x.toFixed(2)} ${J.y.toFixed(2)}`,`L ${ae.x.toFixed(2)} ${ae.y.toFixed(2)}`,`A 60 60 0 ${j} 0 ${ne.x.toFixed(2)} ${ne.y.toFixed(2)}`,"Z"].join(" "),le=m+v/2;m=T;const b=d>0?(f.count/d*100).toFixed(1):"0.0";return{pathD:de,color:o[h%o.length],name:f.name,count:f.count,pct:b,mid:le}}),y="http://www.w3.org/2000/svg";c.innerHTML="";const w=p.map((f,h)=>{const v=document.createElementNS(y,"path");return v.setAttribute("d",f.pathD),v.setAttribute("fill",f.color),v.setAttribute("stroke","white"),v.setAttribute("stroke-width","2"),v.style.cursor="pointer",v.style.transition="transform 0.2s, filter 0.2s",v.style.transformOrigin="110px 110px",v.setAttribute("data-index",h),c.appendChild(v),v}),$=f=>{w.forEach((h,v)=>{v===f?(h.style.transform="scale(1.04)",h.style.filter="brightness(1.1)",h.setAttribute("stroke-width","3")):(h.style.transform="scale(1)",h.style.filter="brightness(1)",h.setAttribute("stroke-width","2"))}),f>=0&&f<p.length?(u&&(u.textContent=p[f].count),i&&(i.textContent=p[f].name.split(" ")[0].toUpperCase().slice(0,7))):(u&&(u.textContent=d),i&&(i.textContent="FARES"))};if(w.forEach((f,h)=>{f.addEventListener("mouseover",()=>{$(h),S(h)}),f.addEventListener("mouseout",()=>{$(-1),S(-1)})}),n){n.innerHTML=p.map((h,v)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${v}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${h.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${h.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${h.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${h.pct}%</span>
      </div>`).join("");const f=h=>{n.querySelectorAll(".legend-row").forEach((v,T)=>{v.style.background=T===h?"#f1f5f9":""})};window._highlightLegendRows=f,n.querySelectorAll(".legend-row").forEach((h,v)=>{h.addEventListener("mouseover",()=>{$(v),f(v)}),h.addEventListener("mouseout",()=>{$(-1),f(-1)})})}function S(f){window._highlightLegendRows&&window._highlightLegendRows(f)}}function en(e,t){var s,l;const n=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],o=document.getElementById("leaderboard-agents");if(o&&e.length){const r=[...e].sort((c,u)=>u.count-c.count).slice(0,5),d=r[0].count||1;o.innerHTML=r.map((c,u)=>{const i=Math.max(6,Math.round(c.count/d*100));return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:16px;width:28px;text-align:center;flex-shrink:0;">${u===0?"🥇":u===1?"🥈":u===2?"🥉":`#${u+1}`}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${c.name}</span>
            <span style="color:${n[u]};margin-left:8px;">${c.count} fares</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${i}%;height:100%;background:${n[u]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}const a=document.getElementById("leaderboard-sectors");if(a&&t.length){const d=[...t.filter(i=>i.avgRate>0)].sort((i,g)=>i.avgRate-g.avgRate).slice(0,5),c=((s=d[0])==null?void 0:s.avgRate)||1,u=((l=d[d.length-1])==null?void 0:l.avgRate)||1;a.innerHTML=d.map((i,g)=>{const m=u>c?Math.max(6,Math.round((i.avgRate-c)/(u-c)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${g+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${i.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(i.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${m}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function tn(e){if(!e||!e.length){x("warning","No Data","No fares to export. Apply filters and fetch first.");return}const t=Object.fromEntries(z.map(i=>[i.id,i.name])),n=Object.fromEntries(D.map(i=>[i.id,i.sectorCode])),o=Object.fromEntries(U.map(i=>[i.id,i.code||i.name])),a=i=>`"${String(i??"").replace(/"/g,'""')}"`,s=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],l=e.map(i=>{const g=i.flightDate instanceof Date?i.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):i.flightDate||"";return[a(g),a(i.flightTime||""),a(n[i.sectorId]||i.sectorId),a(o[i.airlineId]||i.airlineId),a(t[i.agentId]||i.agentId),a(i.specialRate||0),a(i.finalRate||0),a(i.commission||0),a(i.baggage||""),a(i.extraBaggage||""),a(i.isHidden?"Hidden":"Live")].join(",")}),r=[s.map(a).join(","),...l].join(`
`),d=new Blob(["\uFEFF"+r],{type:"text/csv;charset=utf-8;"}),c=URL.createObjectURL(d),u=document.createElement("a");u.href=c,u.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(u),u.click(),document.body.removeChild(u),URL.revokeObjectURL(c),x("success","CSV Downloaded",`${e.length} fares exported.`)}function mt(){return Object.keys(W).length}function nn(){return{agentNameById:Object.fromEntries(z.map(e=>[e.id,e.name||e.id])),sectorCodeById:Object.fromEntries(D.map(e=>[e.id,e.sectorCode||`${e.sectorFrom||""} ${e.sectorTo||""}`.trim()||e.id])),airlineLabelById:Object.fromEntries(U.map(e=>[e.id,e.code?`${e.code} - ${e.name||""}`.trim():e.name||e.id]))}}function an(e,t){return e==="specialRate"||e==="finalRate"||e==="commission"||e==="extraBaggage"?t===""?"":F(t,0):e==="baggage"?t===""?"":we(t):e==="isHidden"?t===!0||t==="hidden"||t==="true":e==="flightTime"?String(t||"").trim():e==="flightDate"?t||"":String(t||"")}function on(e,t){return e==="specialRate"||e==="finalRate"||e==="extraBaggage"?F(t,0):e==="commission"?t==null||t===""?"":Math.max(0,F(t,0)):e==="baggage"?we(t):e==="isHidden"?t===!0:e==="flightTime"?String(t||"").trim():e==="flightDate"?Re(t):String(t||"")}function ut(e){return e?e.commission!==void 0&&e.commission!==null&&e.commission!==""?Math.max(0,F(e.commission,0)):Math.max(0,F(e.finalRate,0)-F(e.specialRate,0)):0}function Ae(e,t){return Math.max(0,F(e,0)+Math.max(0,F(t,0)))}function gt(e){const t=W[e.id]||{},n={...e,...t},o=ut(e);return n.flightDate=t.flightDate!==void 0?st(t.flightDate):Ce(e.flightDate),n.specialRate=F(n.specialRate,0),n.commission=t.commission!==void 0?Math.max(0,F(t.commission,0)):o,n.finalRate=Ae(n.specialRate,n.commission),n.baggage=we(n.baggage),n.extraBaggage=F(n.extraBaggage,0),n.isHidden=n.isHidden===!0||n.isHidden==="hidden"||n.isHidden==="true",n.flightTime=String(n.flightTime||"").trim(),n.agentId=n.agentId||"",n.sectorId=n.sectorId||"",n.airlineId=n.airlineId||"",n}function Ie(){const e=mt(),t=Y.size,n=document.getElementById("database-unsaved-pill");n&&(n.textContent=`Unsaved: ${e}`);const o=document.getElementById("database-save-all-btn");o&&(o.disabled=e===0);const a=document.getElementById("database-delete-selected-btn");a&&(a.disabled=t===0);const s=document.getElementById("database-selected-count");s&&(s.textContent=String(t))}function sn(){const e=document.getElementById("database-agent-filter"),t=document.getElementById("database-sector-filter"),n=document.getElementById("database-airline-filter");if(e){const o=A.agentId;e.innerHTML='<option value="all">All Agents</option>'+z.map(a=>`<option value="${k(a.id)}">${k(a.id)} · ${k(a.name||"Unnamed")}</option>`).join(""),e.value=o}if(t){const o=A.sectorId;t.innerHTML='<option value="all">All Sectors</option>'+D.map(a=>`<option value="${k(a.id)}">${k(a.sectorCode||a.id)}</option>`).join(""),t.value=o}if(n){const o=A.airlineId;n.innerHTML='<option value="all">All Airlines</option>'+U.map(a=>`<option value="${k(a.id)}">${k(a.code||"—")} · ${k(a.name||"Unnamed")}</option>`).join(""),n.value=o}}function rn(){const e=document.getElementById("database-table-wrap");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=a=>{const s=e.querySelector(`tr[data-fare-id="${a}"]`);if(!s)return;const l=!!W[a];s.classList.toggle("admin-database-row-dirty",l);const r=s.querySelector('[data-db-action="save"]'),d=s.querySelector('[data-db-action="reset"]');r&&(r.disabled=!l),d&&(d.disabled=!l)},n=a=>{if(!a)return;const s=a.querySelector('[data-db-field="specialRate"]'),l=a.querySelector('[data-db-field="commission"]'),r=a.querySelector('[data-db-field="finalRate"]');if(!s||!l||!r)return;const d=F(s.value,0),c=Math.max(0,F(l.value,0));r.value=String(Ae(d,c))},o=a=>{const s=a.target.closest("[data-db-field]");if(!s)return;const l=s.closest("tr[data-fare-id]");if(!l)return;const r=l.dataset.fareId,d=s.dataset.dbField,c=X.find(y=>y.id===r);if(!c||!d)return;const u=s.value,i=an(d,u),g=d==="commission"?ut(c):on(d,c[d]),m=i!==g,p={...W[r]||{}};m?p[d]=i:delete p[d],Object.keys(p).length?W[r]=p:delete W[r],(d==="specialRate"||d==="commission")&&n(l),t(r),Ie()};e.addEventListener("input",o),e.addEventListener("change",a=>{o(a);const s=a.target.closest("#database-select-all");if(s){e.querySelectorAll("input[data-db-select]").forEach(r=>{r.checked=s.checked;const d=r.dataset.dbSelect;d&&(s.checked?Y.add(d):Y.delete(d))}),Ie();return}const l=a.target.closest("input[data-db-select]");if(l){const r=l.dataset.dbSelect;if(!r)return;l.checked?Y.add(r):Y.delete(r),Ie()}}),e.addEventListener("click",async a=>{const s=a.target.closest("[data-db-action]");if(!s)return;const l=s.dataset.dbAction,r=s.dataset.id;if(r){if(l==="save"){s.disabled=!0,await pt(r)||(s.disabled=!1),q();return}if(l==="reset"){delete W[r],q();return}if(l==="delete"){if(!confirm("Delete this fare row? This cannot be undone."))return;s.disabled=!0;try{await Oe(r),X=X.filter(d=>d.id!==r),delete W[r],Y.delete(r),x("success","Deleted","Fare row removed."),q()}catch(d){x("error","Delete Failed",d.message),s.disabled=!1}}}})}function dn(e){if(!e||e.dataset.controlsWired)return;e.dataset.controlsWired="1";const t=document.getElementById("database-search"),n=document.getElementById("database-agent-filter"),o=document.getElementById("database-sector-filter"),a=document.getElementById("database-airline-filter"),s=document.getElementById("database-status-filter"),l=document.getElementById("database-start-date"),r=document.getElementById("database-end-date"),d=document.getElementById("database-limit"),c=document.getElementById("database-clear-filters"),u=document.getElementById("database-refresh-btn"),i=document.getElementById("database-save-all-btn"),g=document.getElementById("database-delete-selected-btn"),m=document.getElementById("database-add-row-btn");t&&t.addEventListener("input",p=>{A.search=p.target.value||"",I.databaseFares=1,q()}),n&&n.addEventListener("change",p=>{A.agentId=p.target.value||"all",I.databaseFares=1,q()}),o&&o.addEventListener("change",p=>{A.sectorId=p.target.value||"all",I.databaseFares=1,q()}),a&&a.addEventListener("change",p=>{A.airlineId=p.target.value||"all",I.databaseFares=1,q()}),s&&s.addEventListener("change",p=>{A.status=p.target.value||"all",I.databaseFares=1,q()}),l&&l.addEventListener("change",p=>{A.startDate=p.target.value||"",I.databaseFares=1,q()}),r&&r.addEventListener("change",p=>{A.endDate=p.target.value||"",I.databaseFares=1,q()}),d&&(d.value=String(te.databaseFares),d.addEventListener("change",p=>{te.databaseFares=parseInt(p.target.value,10)||20,I.databaseFares=1,q()})),c&&c.addEventListener("click",()=>{A.search="",A.agentId="all",A.sectorId="all",A.airlineId="all",A.status="all",A.startDate="",A.endDate="",t&&(t.value=""),n&&(n.value="all"),o&&(o.value="all"),a&&(a.value="all"),s&&(s.value="all"),l&&(l.value=""),r&&(r.value=""),I.databaseFares=1,q()}),u&&u.addEventListener("click",async()=>{const p=u.innerHTML;u.disabled=!0,u.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing...',await We(!0),u.disabled=!1,u.innerHTML=p}),i&&i.addEventListener("click",cn),g&&g.addEventListener("click",mn),m&&m.addEventListener("click",un)}async function We(e=!0){const t=document.getElementById("database-tab");if(!t)return;if(dn(t),rn(),sn(),e||!t.dataset.loaded)try{X=await Fe({includeHidden:!0}),W={},Y=new Set,I.databaseFares=1,t.dataset.loaded="1"}catch(o){x("error","Load Failed",o.message),X=[]}q()}function ln(){const{agentNameById:e,sectorCodeById:t,airlineLabelById:n}=nn(),o=A.search.trim().toLowerCase(),a=Mt(A.startDate),s=Ht(A.endDate),l=X.map(c=>gt(c)).filter(c=>{var g,m;if(A.agentId!=="all"&&c.agentId!==A.agentId||A.sectorId!=="all"&&c.sectorId!==A.sectorId||A.airlineId!=="all"&&c.airlineId!==A.airlineId||A.status==="live"&&c.isHidden||A.status==="hidden"&&!c.isHidden)return!1;const u=((m=(g=Ce(c.flightDate))==null?void 0:g.getTime)==null?void 0:m.call(g))||null;return a!==null&&(u===null||u<a)||s!==null&&(u===null||u>s)?!1:o?[c.id,Re(c.flightDate),c.flightTime,c.specialRate,c.finalRate,c.commission,c.baggage,c.extraBaggage,c.isHidden?"hidden":"live",c.agentId,c.sectorId,c.airlineId,e[c.agentId]||"",t[c.sectorId]||"",n[c.airlineId]||""].join(" ").toLowerCase().includes(o):!0}),{key:r,asc:d}=ee.databaseFares;return l.sort((c,u)=>{const i=p=>{var y,w;return r==="agentId"?(e[p.agentId]||p.agentId||"").toLowerCase():r==="sectorId"?(t[p.sectorId]||p.sectorId||"").toLowerCase():r==="airlineId"?(n[p.airlineId]||p.airlineId||"").toLowerCase():r==="flightDate"?((w=(y=Ce(p.flightDate))==null?void 0:y.getTime)==null?void 0:w.call(y))||0:r==="isHidden"?p.isHidden?1:0:p[r]};let g=i(c),m=i(u);return typeof g=="string"&&(g=g.toLowerCase()),typeof m=="string"&&(m=m.toLowerCase()),g<m?d?-1:1:g>m?d?1:-1:0})}function q(){const e=document.getElementById("database-table-wrap");if(!e)return;const t=ln(),n=document.getElementById("database-total-count");n&&(n.textContent=t.length.toLocaleString());const o=te.databaseFares,a=Math.max(1,Math.ceil(t.length/o));I.databaseFares>a&&(I.databaseFares=a);const s=(I.databaseFares-1)*o,l=t.slice(s,s+o);if(!l.length){e.innerHTML=`<div class="text-center text-text-muted py-16 px-4">
      <div class="inline-flex flex-col items-center gap-3 opacity-60">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <i class="bi bi-database text-3xl text-slate-400"></i>
        </div>
        <p class="font-semibold text-[14px]">No fares matched your filter</p>
      </div>
    </div>`,ve("databaseFares",t.length,a,s,o),Ie();return}const r=(g,m)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="databaseFares" data-sort-key="${g}">
      ${m} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i>
    </th>`,d=g=>z.map(m=>`<option value="${k(m.id)}" ${m.id===g?"selected":""}>${k(m.id)} · ${k(m.name||"Unnamed")}</option>`).join(""),c=g=>D.map(m=>`<option value="${k(m.id)}" ${m.id===g?"selected":""}>${k(m.sectorCode||m.id)}</option>`).join(""),u=g=>U.map(m=>`<option value="${k(m.id)}" ${m.id===g?"selected":""}>${k(m.code||"—")} · ${k(m.name||"Unnamed")}</option>`).join(""),i=l.length>0&&l.every(g=>Y.has(g.id));e.innerHTML=`
    <table class="admin-database-table">
      <thead>
        <tr>
          <th class="w-[36px] text-center"><input id="database-select-all" type="checkbox" ${i?"checked":""}></th>
          <th class="w-[56px]">#</th>
          ${r("flightDate","Date")}
          ${r("flightTime","Time")}
          ${r("agentId","Agent")}
          ${r("sectorId","Sector")}
          ${r("airlineId","Airline")}
          ${r("specialRate","SP Rate")}
          ${r("finalRate","Rate")}
          ${r("commission","Comm")}
          ${r("baggage","Bag")}
          ${r("extraBaggage","Ex.Bag")}
          ${r("isHidden","Status")}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${l.map((g,m)=>{const p=!!W[g.id],y=Y.has(g.id);return`
            <tr data-fare-id="${g.id}" class="${p?"admin-database-row-dirty":""}">
              <td class="text-center">
                <input type="checkbox" data-db-select="${g.id}" ${y?"checked":""}>
              </td>
              <td class="font-mono text-[11px] text-text-soft">${s+m+1}</td>
              <td>
                <input type="date" data-db-field="flightDate" class="db-cell-input" value="${Re(g.flightDate)}">
              </td>
              <td>
                <input type="text" data-db-field="flightTime" class="db-cell-input min-w-[128px]" value="${k(g.flightTime||"")}" placeholder="04:05 - 11:10">
              </td>
              <td>
                <select data-db-field="agentId" class="db-cell-select min-w-[180px]">
                  <option value="">Select Agent</option>
                  ${d(g.agentId)}
                </select>
              </td>
              <td>
                <select data-db-field="sectorId" class="db-cell-select min-w-[140px]">
                  <option value="">Select Sector</option>
                  ${c(g.sectorId)}
                </select>
              </td>
              <td>
                <select data-db-field="airlineId" class="db-cell-select min-w-[170px]">
                  <option value="">No Airline</option>
                  ${u(g.airlineId)}
                </select>
              </td>
              <td>
                <input type="number" data-db-field="specialRate" class="db-cell-input db-cell-num" value="${F(g.specialRate,0)}" min="0" step="1">
              </td>
              <td>
                <input type="number" data-db-field="finalRate" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${F(g.finalRate,0)}" min="0" step="1" readonly tabindex="-1">
              </td>
              <td>
                <input type="number" data-db-field="commission" class="db-cell-input db-cell-num" value="${F(g.commission,0)}" min="0" step="1">
              </td>
              <td>
                <input type="number" data-db-field="baggage" class="db-cell-input db-cell-num" value="${we(g.baggage)}" min="0" step="1">
              </td>
              <td>
                <input type="number" data-db-field="extraBaggage" class="db-cell-input db-cell-num" value="${F(g.extraBaggage,0)}" min="0" step="1">
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
  `,ve("databaseFares",t.length,a,s,o),Le("databaseFares"),Ie()}async function pt(e,{silent:t=!1}={}){const n=X.find(u=>u.id===e);if(!n)return!1;if(!W[e])return!0;const a=gt(n),s=Ce(a.flightDate);if(!a.agentId)return t||x("warning","Missing Agent","Please select an agent before saving."),!1;if(!a.sectorId)return t||x("warning","Missing Sector","Please select a sector before saving."),!1;if(!s)return t||x("warning","Missing Date","Please set a valid flight date before saving."),!1;const l=F(a.specialRate,0),r=Math.max(0,F(a.commission,0)),d=Ae(l,r),c={agentId:a.agentId,sectorId:a.sectorId,airlineId:a.airlineId||"",flightDate:s,flightTime:a.flightTime||"",specialRate:l,finalRate:d,commission:r,baggage:we(a.baggage),extraBaggage:F(a.extraBaggage,0),isHidden:a.isHidden===!0};try{return await nt(e,c),X=X.map(u=>u.id===e?{...u,...c}:u),delete W[e],t||x("success","Saved","Fare row updated."),!0}catch(u){return t||x("error","Save Failed",u.message),!1}}async function cn(){const e=Object.keys(W);if(!e.length)return;const t=document.getElementById("database-save-all-btn"),n=t==null?void 0:t.innerHTML;t&&(t.disabled=!0,t.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Saving...');let o=0,a=0;for(const s of e)await pt(s,{silent:!0})?o+=1:a+=1;q(),t&&(t.disabled=mt()===0,t.innerHTML=n||"Save All"),a===0?x("success","Saved",`${o} row${o!==1?"s":""} updated.`):x("warning","Partial Save",`${o} saved, ${a} failed. Fix invalid rows and retry.`)}async function mn(){const e=Array.from(Y);if(!e.length||!confirm(`Delete ${e.length} selected fare row${e.length!==1?"s":""}? This cannot be undone.`))return;const t=document.getElementById("database-delete-selected-btn"),n=t==null?void 0:t.innerHTML;t&&(t.disabled=!0,t.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Deleting...');const o=await Promise.allSettled(e.map(l=>Oe(l))),a=[];let s=0;if(o.forEach((l,r)=>{l.status==="fulfilled"?a.push(e[r]):s+=1}),a.length){const l=new Set(a);X=X.filter(r=>!l.has(r.id)),a.forEach(r=>{delete W[r],Y.delete(r)})}q(),t&&(t.innerHTML=n||"Delete Selected"),s===0?x("success","Deleted",`${a.length} row${a.length!==1?"s":""} deleted.`):x("warning","Partial Delete",`${a.length} deleted, ${s} failed.`)}function un(){const e=Re(new Date);He("Add Fare Row",`
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
            ${z.map(l=>`<option value="${k(l.id)}">${k(l.id)} · ${k(l.name||"Unnamed")}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Sector *</label>
          <select id="db-add-sector" class="admin-control h-10" required>
            <option value="">Select Sector</option>
            ${D.map(l=>`<option value="${k(l.id)}">${k(l.sectorCode||l.id)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Airline</label>
          <select id="db-add-airline" class="admin-control h-10">
            <option value="">No Airline</option>
            ${U.map(l=>`<option value="${k(l.id)}">${k(l.code||"—")} · ${k(l.name||"Unnamed")}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="admin-label text-[10px] mb-1">SP Rate (₹)</label>
          <input id="db-add-sp" type="number" class="admin-control h-10" min="0" step="1" value="0">
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Commission (₹)</label>
          <input id="db-add-comm" type="number" class="admin-control h-10" min="0" step="1" value="0">
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Final Rate (₹)</label>
          <input id="db-add-rate" type="number" class="admin-control h-10 bg-slate-50 text-slate-500" min="0" step="1" value="0" readonly tabindex="-1">
        </div>
      </div>
      <p class="text-[11px] text-text-soft -mt-2">Rate is auto-calculated as <strong>SP Rate + Commission</strong>.</p>

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
  `);const t=document.getElementById("database-add-form");if(!t)return;const n=document.getElementById("db-add-sp"),o=document.getElementById("db-add-comm"),a=document.getElementById("db-add-rate"),s=()=>{if(!a)return;const l=F(n==null?void 0:n.value,0),r=Math.max(0,F(o==null?void 0:o.value,0));a.value=String(Ae(l,r))};n==null||n.addEventListener("input",s),o==null||o.addEventListener("input",s),s(),t.addEventListener("submit",async l=>{var c,u,i,g,m,p,y,w,$,S,f,h;l.preventDefault();const r=t.querySelector('button[type="submit"]'),d=(r==null?void 0:r.textContent)||"Add Fare";r&&(r.disabled=!0,r.textContent="Adding...");try{const v=((c=document.getElementById("db-add-date"))==null?void 0:c.value)||"",T=st(v);if(!T)throw new Error("Please provide a valid flight date.");const j=F((u=document.getElementById("db-add-sp"))==null?void 0:u.value,0),G=Math.max(0,F((i=document.getElementById("db-add-comm"))==null?void 0:i.value,0)),J=Ae(j,G);await Ft({agentId:((g=document.getElementById("db-add-agent"))==null?void 0:g.value)||"",sectorId:((m=document.getElementById("db-add-sector"))==null?void 0:m.value)||"",airlineId:((p=document.getElementById("db-add-airline"))==null?void 0:p.value)||"",flightDate:T,flightTime:((w=(y=document.getElementById("db-add-time"))==null?void 0:y.value)==null?void 0:w.trim())||"",specialRate:j,finalRate:J,commission:G,baggage:we(($=document.getElementById("db-add-bag"))==null?void 0:$.value),extraBaggage:F((S=document.getElementById("db-add-exbag"))==null?void 0:S.value,0),isHidden:(((f=document.getElementById("db-add-status"))==null?void 0:f.value)||"live")==="hidden"}),(h=document.getElementById("admin-modal"))==null||h.close(),await We(!0),x("success","Added","New fare row added.")}catch(v){x("error","Add Failed",v.message),r&&(r.disabled=!1,r.textContent=d)}})}const gn="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",pn={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},Qe=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let ie=null,re=JSON.parse(localStorage.getItem("zt_hist")||"[]"),Ve=re.reduce((e,t)=>e+(t.rows||0),0);function fn(){var t,n,o,a;const e=document.getElementById("rateData");e&&e.addEventListener("input",function(){const s=this.value.length,l=document.getElementById("charCount");l&&(l.textContent=s.toLocaleString()+" character"+(s!==1?"s":"")),ye(),clearTimeout(window._previewTimer),s>15?window._previewTimer=setTimeout(()=>xn(this.value),500):De()}),(t=document.getElementById("resetBtn"))==null||t.addEventListener("click",()=>{e&&(e.value="");const s=document.getElementById("charCount");s&&(s.textContent="0 characters"),De(),ye()}),(n=document.getElementById("clearBtn"))==null||n.addEventListener("click",()=>{re=[],Ve=0,ke(),Se(),Ue()}),(o=document.getElementById("manualAgent"))==null||o.addEventListener("input",function(){const s=parseInt(this.value);ie=s>0?String(s):null,document.querySelectorAll(".rp-chip").forEach(l=>l.classList.remove("on")),ft(),ye()}),(a=document.getElementById("submitBtn"))==null||a.addEventListener("click",yn),Ue(),Se()}function bn(){const e=document.getElementById("chipGrid");if(!e||e.children.length>0)return;const t=z.length?[...z].sort((n,o)=>{const a=parseInt(n.id),s=parseInt(o.id);return!isNaN(a)&&!isNaN(s)?a-s:n.id.localeCompare(o.id)}):[];if(!t.length){e.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>';return}t.forEach(n=>{const o=document.createElement("div");o.className="rp-chip",o.dataset.agentId=n.id,o.textContent=n.id,o.addEventListener("click",()=>hn(n.id,n.name,o)),e.appendChild(o)})}function hn(e,t,n){ie=e,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(o=>{o.classList.remove("on")}),n&&n.classList.add("on"),ft(),ye()}function ft(){const e=document.getElementById("agentPill");if(e)if(ie){const t=z.find(n=>n.id===ie);e.textContent=`Agent ${(t==null?void 0:t.id)||ie} selected ✓`,e.classList.remove("empty")}else e.textContent="No agent selected",e.classList.add("empty")}function ye(){const e=document.getElementById("rateData"),t=document.getElementById("submitBtn");t&&(t.disabled=!(ie&&e&&e.value.trim().length>10))}function bt(e){const t=[];let n=null,o="IX";for(const a of e.split(`
`)){const s=a.replace(/[*_~`]/g,"").trim();if(!s)continue;const l=s.match(/([A-Z]{3})\s+([A-Z]{3})/);if(l&&s.length<70&&!s.match(/\d{4,6}/)){n=l[1]+"-"+l[2];const r=s.match(Qe);r&&(o=r[1]);continue}if(n){const r=s.match(Qe);if(r&&!s.match(/\d{4,6}/)){o=r[1];continue}const d=s.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(d){const c=parseInt(d[3]);c>=1e3&&c<=99999&&t.push({sector:n,date:`2026-${pn[d[2].toUpperCase()]}-${d[1].padStart(2,"0")}`,airline:r?r[1]:o,rate:c})}}}return t}function xn(e){const t=bt(e);if(!t.length){De();return}const n=document.getElementById("prevBox");n&&n.classList.add("on");const o=document.getElementById("prevCount");o&&(o.textContent=t.length+" entr"+(t.length===1?"y":"ies"));const a=document.getElementById("prevBody");a&&(a.innerHTML=t.slice(0,60).map(s=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${s.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${s.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${s.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${s.rate.toLocaleString()}</td></tr>`).join(""),t.length>60&&(a.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${t.length-60} more</td></tr>`))}function De(){var e;(e=document.getElementById("prevBox"))==null||e.classList.remove("on")}async function yn(){const e=document.getElementById("rateData");if(!ie||!(e!=null&&e.value.trim()))return;const t=document.getElementById("submitBtn"),n=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI...';const o=document.getElementById("progBar"),a=document.getElementById("progFill");o&&o.classList.add("on");let s=0;const l=setInterval(()=>{s=Math.min(s+Math.random()*13,85),a&&(a.style.width=s+"%")},280),r=bt(e.value),d={id:Date.now(),agent:ie,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:r.length,status:"pen"};re.unshift(d),re.length>15&&re.pop(),ke(),Se();try{const c=await fetch(gn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:ie,raw_text:e.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(l),a&&(a.style.width="100%"),c.ok)d.status="ok",Ve+=r.length,ke(),Se(),Ue(),x("success","Submitted","Rates dispatched to AI Agent. The database will reflect parsing results momentarily."),setTimeout(()=>{e.value="";const u=document.getElementById("charCount");u&&(u.textContent="0 characters"),De(),ye()},500);else throw new Error("N8N webhook rejected payload")}catch(c){clearInterval(l),a&&(a.style.width="100%"),d.status="err",ke(),Se(),x("error","Submission Failed",c.message)}setTimeout(()=>{o&&o.classList.remove("on"),a&&(a.style.width="0%"),t.innerHTML=n,ye()},900)}function Ue(){const e=document.getElementById("statSubs");e&&(e.textContent=re.length);const t=document.getElementById("statEntries");t&&(t.textContent=Ve)}function ke(){localStorage.setItem("zt_hist",JSON.stringify(re))}function Se(){const e=document.getElementById("historyWrap");if(e){if(!re.length){e.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}e.innerHTML=re.map(t=>{var o;const n=((o=z.find(a=>a.id===t.agent))==null?void 0:o.name)||`Agent ${t.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${n.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${n}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${t.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${t.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${t.status==="ok"?"bg-green-500":t.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}const vn=210/25.4*96,wn=297/25.4*96;function et(){const e=document.getElementById("eticket-output-wrapper"),t=document.getElementById("eticket-print-area");if(!e||!t||e.classList.contains("hidden"))return;t.style.zoom="1",t.style.removeProperty("--eticket-print-scale");const n=Math.max(t.scrollWidth,t.offsetWidth),o=Math.max(t.scrollHeight,t.offsetHeight);if(!n||!o)return;const a=vn/n,s=wn/o;let l=Math.min(1,a,s);l<1&&(l=Math.max(.7,l*.985)),t.style.zoom=String(l),t.style.setProperty("--eticket-print-scale",String(l))}function En(){const e=document.getElementById("eticket-print-area");e&&(e.style.zoom="1",e.style.removeProperty("--eticket-print-scale"))}async function $n(){var r;const e=document.getElementById("eticket-tab");if(!e)return;const t=document.getElementById("eticket-form"),n=document.getElementById("et-add-passenger"),o=document.getElementById("et-passengers-container"),a=document.getElementById("et-airline"),s=document.getElementById("et-origin"),l=document.getElementById("et-destination");if(U.length===0&&(U=await _e()),D.length===0&&(D=ze(await qe())),!e.dataset.wired){if(e.dataset.wired="1",a&&U&&(a.innerHTML='<option value="">Select Airline</option>'+U.map(c=>`<option value="${c.name}">${c.name}</option>`).join("")),s&&D){const c=[...new Set(D.map(u=>u.sectorFrom).filter(Boolean))].sort();s.innerHTML='<option value="">Select Origin</option>'+c.map(u=>`<option value="${u}">${u}</option>`).join("")}if(l&&D){const c=[...new Set(D.map(u=>u.sectorTo).filter(Boolean))].sort();l.innerHTML='<option value="">Select Destination</option>'+c.map(u=>`<option value="${u}">${u}</option>`).join("")}const d=()=>{const c=Array.from(o.querySelectorAll(".et-pax-row"));c.forEach((u,i)=>{const g=u.querySelector(".et-passenger-index");g&&(g.textContent=`Passenger ${i+1}`);const m=u.querySelector(".et-remove-passenger");m&&(c.length<=1?(m.classList.add("opacity-40","pointer-events-none"),m.setAttribute("aria-disabled","true")):(m.classList.remove("opacity-40","pointer-events-none"),m.removeAttribute("aria-disabled")))})};n==null||n.addEventListener("click",()=>{o.insertAdjacentHTML("beforeend",`
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
      `),d()}),o==null||o.addEventListener("click",c=>{var i;const u=c.target.closest(".et-remove-passenger");u&&((i=u.closest(".et-pax-row"))==null||i.remove(),d())}),o.children.length===0&&(n==null||n.click()),d(),t==null||t.addEventListener("submit",async c=>{c.preventDefault(),await In(new FormData(t))}),(r=document.getElementById("et-print-btn"))==null||r.addEventListener("click",()=>{et(),requestAnimationFrame(()=>window.print())}),window.addEventListener("beforeprint",et),window.addEventListener("afterprint",En),t==null||t.addEventListener("reset",()=>{setTimeout(()=>{var c;Array.from(o.children).forEach((u,i)=>{i>0&&u.remove()}),o.children.length===0&&(n==null||n.click()),d(),(c=document.getElementById("eticket-output-wrapper"))==null||c.classList.add("hidden")},10),x("info","Form Reset","The E-Ticket form has been cleared.")})}}async function In(e){var $e,O,M;const t=($e=e.get("etPnr"))==null?void 0:$e.toUpperCase(),n=(O=e.get("etAirline"))==null?void 0:O.toUpperCase(),o=(M=e.get("etFlightNo"))==null?void 0:M.toUpperCase(),a=e.get("etDate"),s=e.get("etDepTime"),l=e.get("etArrTime"),r=e.get("etPhone"),d=(E="")=>String(E).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),c=E=>{const H=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec(E||"");return H?Number(H[1])*60+Number(H[2]):null},u=(E="")=>E.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",i=E=>{const H=(E||"").trim();let N=H,fe="";const V=H.match(/^(.*?)\s*\((.*?)\)$/);return V&&(N=V[1].trim(),fe=V[2].trim()),{city:N,code:fe}},g=i(e.get("etOrigin")),m=i(e.get("etDest")),p=e.get("etOrigin")||"—",y=e.get("etDest")||"—";let w="—";if(a){const E=new Date(a);if(!isNaN(E.getTime())){const H=["SUN","MON","TUE","WED","THU","FRI","SAT"],N=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];w=`${H[E.getDay()]}, ${String(E.getDate()).padStart(2,"0")} ${N[E.getMonth()]} ${E.getFullYear()}`}}const $=E=>document.getElementById(E);let S=g.code,f=m.code,h=null;if(typeof D<"u"){if(h=D.find(E=>E.sectorFrom===p&&E.sectorTo===y),!h&&p){const E=D.find(H=>H.sectorFrom===p);E&&E.sectorCode&&(S=E.sectorCode.split(/[ -]+/)[0])}if(!h&&y){const E=D.find(H=>H.sectorTo===y);E&&E.sectorCode&&(f=E.sectorCode.split(/[ -]+/).pop())}}const v=(S||u(g.city)).toUpperCase(),T=(f||u(m.city)).toUpperCase(),j=`${v} - ${T}`,G=`${(g.city||p).toUpperCase()} to ${(m.city||y).toUpperCase()}`,J=(g.city||p).toUpperCase(),ne=(m.city||y).toUpperCase(),ae=c(s),de=c(l);let le="N/A";if(ae!==null&&de!==null){let E=de-ae;E<0&&(E+=24*60);const H=Math.floor(E/60),N=E%60;le=`${H}h ${String(N).padStart(2,"0")}m`}$("t-pnr")&&($("t-pnr").textContent=t||"—"),$("t-issued-by")&&($("t-issued-by").textContent=n||"—"),$("t-customer-phone")&&($("t-customer-phone").textContent=r||"—"),$("t-flight-code")&&($("t-flight-code").textContent=o||"—"),$("t-travel-date")&&($("t-travel-date").textContent=w||"—"),$("t-route-code")&&($("t-route-code").textContent=j),$("t-route-long")&&($("t-route-long").textContent=G),$("t-duration")&&($("t-duration").textContent=le);const b=new Date,C=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],B=`${String(b.getDate()).padStart(2,"0")} ${C[b.getMonth()]} ${b.getFullYear()} ${String(b.getHours()).padStart(2,"0")}:${String(b.getMinutes()).padStart(2,"0")}`;$("t-booked-on")&&($("t-booked-on").textContent=B);const R=$("t-airline-logo"),L=$("t-issued-by-fallback");if(R){const E=typeof U<"u"?U.find(H=>H.name.toUpperCase()===n):null;E&&E.logoUrl?(R.src=E.logoUrl,R.classList.remove("hidden"),L&&L.classList.add("hidden")):(R.removeAttribute("src"),R.classList.add("hidden"),L&&(L.classList.remove("hidden"),L.textContent=(n||"No logo").toUpperCase()))}const Ee=e.getAll("paxTitle[]"),K=e.getAll("paxName[]"),ge=e.getAll("paxType[]"),ce=e.getAll("paxCheckBag[]"),Z=e.getAll("paxCarryBag[]");$("t-pax-count")&&($("t-pax-count").textContent=String(K.length));const _=document.getElementById("t-passengers-tbody");if(_){const E=K.map((H,N)=>{const fe=d((Ee[N]||"MR").toUpperCase()),V=d((K[N]||"").toUpperCase()),Ne=d((ge[N]||"ADT").toUpperCase()),Te=d((ce[N]||"—").toUpperCase()),be=d((Z[N]||"—").toUpperCase()),he=h&&h.sectorCode?d(h.sectorCode.toUpperCase()):d(j);return`
        <tr class="${N%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${N+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${fe}. ${V}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Ne}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${he}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${d(o||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${d(t||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${be}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Te}</td>
        </tr>
      `}).join("");_.innerHTML=E||`
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `}const Q=document.getElementById("t-travel-tbody");Q&&(Q.innerHTML=`
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${d(o||"—")}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${d(J)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${d(v)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${d(s||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${d(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${d(ne)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${d(T)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${d(l||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${d(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const pe=document.getElementById("eticket-output-wrapper");pe&&(pe.classList.remove("hidden"),pe.scrollIntoView({behavior:"smooth"}))}const tt={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function x(e,t,n){const o=document.getElementById("toastsEl");if(!o)return;const a=document.createElement("div"),s={success:"border-green-500 bg-green-50 text-green-800",error:"border-red-500 bg-red-50 text-red-800",warning:"border-yellow-500 bg-yellow-50 text-yellow-800",info:"border-primary bg-primary/10 text-[var(--color-primary-dark)]"};a.className=`flex items-start gap-3 p-4 border-l-4 rounded shadow-md w-80 pointer-events-auto ${s[e]||s.error}`,a.innerHTML=`<div class="mt-0.5">${tt[e]||tt.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${t}</div><div class="text-xs opacity-90 mt-1">${n}</div></div>
    <button class="opacity-50 hover:opacity-100" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,o.appendChild(a),setTimeout(()=>a.isConnected&&a.remove(),7e3)}window.toast=x;document.addEventListener("DOMContentLoaded",()=>{});
