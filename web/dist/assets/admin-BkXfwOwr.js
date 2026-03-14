import"./firebase-config-zYKzaodH.js";import{o as $t,l as Et}from"./auth-DpPgmvBs.js";import{a as He,d as ze,u as ot,c as rt,e as It,f as St,h as Ct,i as At,g as Ge,j as Bt,k as Lt,l as Tt,m as kt,b as We,n as Dt,o as Ft,p as Rt,q as Mt,r as Ht}from"./db-KU_q4EDz.js";async function Nt(e,t,n,s,a){const i=`Generating ${e} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",i),new Promise(async(l,r)=>{try{let ce=function(b,C,A,R,L){o.beginPath(),o.moveTo(b+L,C),o.lineTo(b+A-L,C),o.arcTo(b+A,C,b+A,C+L,L),o.lineTo(b+A,C+R-L),o.arcTo(b+A,C+R,b+A-L,C+R,L),o.lineTo(b+L,C+R),o.arcTo(b,C+R,b,C+R-L,L),o.lineTo(b,C+L),o.arcTo(b,C,b+L,C,L),o.closePath()},me=function(b){var Ie;const C=b-se;if(C>ae){try{z.stop()}catch(O){console.error("Error stopping recorder",O)}return}o.fillStyle="#f8fafc",o.fillRect(0,0,d,c);const A=e==="9x16"?400:300;if(o.fillStyle="#1e293b",o.fillRect(0,0,d,A),S.complete&&S.width>0){o.globalAlpha=.2;const O=Math.max(d/S.width,A/S.height),M=S.width*O,$=S.height*O,H=(d-M)/2,N=(A-$)/2;o.drawImage(S,H,N,M,$),o.globalAlpha=1}const R=o.createLinearGradient(0,0,0,A);R.addColorStop(0,"#1e293b"),R.addColorStop(1,"transparent"),o.fillStyle=R,o.globalAlpha=.8,o.fillRect(0,0,d,A),o.globalAlpha=1,o.textAlign="center",o.textBaseline="middle";const L=o.createLinearGradient(0,0,d,0);L.addColorStop(0,"#2563eb"),L.addColorStop(.5,"#60a5fa"),L.addColorStop(1,"#1558c0"),o.fillStyle=L,o.fillRect(0,0,d,16);const Ee=200,X=40,fe=60;o.fillStyle="rgba(37, 99, 235, 0.4)",ce(d/2-Ee/2,fe,Ee,X,20),o.fill(),o.strokeStyle="rgba(37, 99, 235, 0.6)",o.lineWidth=1,o.stroke(),o.fillStyle="#bfdbfe",o.font="bold 16px Arial, sans-serif",o.fillText("EXCLUSIVE DEALS",d/2,fe+X/2),o.fillStyle="#ffffff",o.font="900 "+(e==="16x9"?"70px":"56px")+" Arial, sans-serif",o.fillText(`${m} → ${g}`,d/2,fe+80),o.fillStyle="#dbeafe",o.font="700 24px Arial, sans-serif",o.fillText("SPECIAL FARES AVAILABLE NOW",d/2,fe+140);const ue=A+60,Q=90,_=e==="9x16"?40:e==="1x1"?80:160,ee=d-_*2;o.fillStyle="#64748b",o.font="bold 18px Arial, sans-serif",o.textAlign="left",o.fillText("DATE",_+20,ue-20),o.textAlign="center",o.fillText("AIRLINE",_+ee*.35,ue-20),o.fillText("TIME",_+ee*.65,ue-20),o.textAlign="right",o.fillText("FARE",_+ee-20,ue-20);for(let O=0;O<y.length;O++){const M=y[O],$=1e3+O*800;if(C<$)continue;const N=Math.min(1,(C-$)/500),he=20*(1-N),J=ue+O*Q+he;o.globalAlpha=N,O%2===0&&(o.fillStyle="#ffffff",ce(_,J,ee,Q-10,12),o.fill()),o.fillStyle="#0f172a",o.textBaseline="middle";const Ue=M.flightDate instanceof Date?M.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():M.flightDate;o.textAlign="left",o.font="900 26px Arial, sans-serif",o.fillText(Ue,_+20,J+Q/2-5);const Fe=_+ee*.35,ye=h[M.airlineId];if(ye&&ye.width>0){const pe=Math.min(100,ye.width),et=40;o.drawImage(ye,Fe-pe/2,J+Q/2-5-et/2,pe,et)}else{o.font="700 20px Arial, sans-serif",o.textAlign="center";const pe=((Ie=w[M.airlineId])==null?void 0:Ie.name)||M.airlineId||"—";o.fillText(pe,Fe,J+Q/2-5)}let xe=M.flightTime||"—";if(xe.includes("-")){const pe=xe.split("-");xe=`${pe[0].trim()} - ${pe[1].trim()}`}o.font="800 22px Arial, sans-serif",o.textAlign="center",o.fillText(xe,_+ee*.65,J+Q/2-5);const Oe=`₹${(M.finalRate||0).toLocaleString()}`;o.font="900 26px Arial, sans-serif",o.textAlign="right";const wt=o.measureText(Oe).width,Ke=_+ee-20,Ze=wt+40,Qe=50;o.fillStyle="#0f172a",ce(Ke-Ze,J+Q/2-5-Qe/2,Ze,Qe,12),o.fill(),o.fillStyle="#ffffff",o.fillText(Oe,Ke-20,J+Q/2-5),o.globalAlpha=1}const be=1e3+y.length*800+500;if(C>be){const O=Math.min(1,(C-be)/500);o.globalAlpha=O;const M=100,$=c-M+20*(1-O);o.fillStyle="#ffffff",o.fillRect(0,c-M,d,M),o.fillRect(0,$,d,M),o.fillStyle="#f1f5f9",o.fillRect(0,c-M,d,2),f.complete&&f.width>0&&o.drawImage(f,_,c-M/2-24,48,48),o.fillStyle="#1e293b",o.font="900 24px Arial, sans-serif",o.textAlign="left",o.textBaseline="middle",o.fillText("Zamra Travels",_+64,c-M/2),o.font="700 20px Arial, sans-serif",o.textAlign="right",o.fillText("zamratravels.com  |  +91 98765 43210",d-_,c-M/2),o.globalAlpha=1}requestAnimationFrame(me)},d,c;if(e==="1x1")d=1080,c=1080;else if(e==="9x16")d=1080,c=1920;else if(e==="16x9")d=1920,c=1080;else throw new Error("Invalid ratio selected");const u=document.createElement("canvas");u.width=d,u.height=c;const o=u.getContext("2d");o.imageSmoothingEnabled=!0;const p=s.find(b=>b.id===n),m=p?(p.sectorFrom||"DEP").toUpperCase():"DEP",g=p?(p.sectorTo||"ARR").toUpperCase():"ARR",y=[...t].sort((b,C)=>{let A=b.flightDate,R=C.flightDate;return A instanceof Date&&(A=A.getTime()),R instanceof Date&&(R=R.getTime()),A-R}).slice(0,10),w={};a.forEach(b=>{b.id&&(w[b.id]=b),b.code&&(w[b.code]=b),b.name&&(w[b.name]=b)});async function E(b){if(!b)return null;try{const C=await fetch(b);if(!C.ok)return null;const A=await C.blob(),R=URL.createObjectURL(A);return new Promise((L,Ee)=>{const X=new Image;X.onload=()=>L(X),X.onerror=()=>L(null),X.src=R})}catch{return null}}const S=new Image;await new Promise(b=>{S.onload=b,S.onerror=b,S.src="/assets/img/hero-bg.webp"});const f=new Image;await new Promise(b=>{f.onload=b,f.onerror=b,f.src="/assets/img/logo.webp"});const h={},v=[...new Set(y.map(b=>b.airlineId))].map(b=>w[b]).filter(b=>b==null?void 0:b.logoUrl);await Promise.all(v.map(async b=>{const C=await E(b.logoUrl);C&&(h[b.id]=C)}));const k=u.captureStream(30);let P="video/mp4";MediaRecorder.isTypeSupported(P)||(P="video/webm; codecs=h264",MediaRecorder.isTypeSupported(P)||(P="video/webm"));const z=new MediaRecorder(k,{mimeType:P}),Y=[];z.ondataavailable=b=>{b.data&&b.data.size>0&&Y.push(b.data)},z.start(100);const ae=1e4+y.length*1500,se=performance.now();requestAnimationFrame(me),z.onstop=()=>{const b=new Blob(Y,{type:P}),C=URL.createObjectURL(b),A=document.createElement("a");A.href=C,A.download=`zamra-video-${e}-${Date.now()}.mp4`,A.style.display="none",document.body.appendChild(A),A.click(),setTimeout(()=>{document.body.removeChild(A),URL.revokeObjectURL(C)},100),window.toast&&window.toast("success","Video Generated",`Your ${e} video has been downloaded!`),l()},z.onerror=b=>{console.error("Recorder Error:",b),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),r(b)}}catch(d){console.error(d),window.toast&&window.toast("error","Generation Failed",d.message),r(d)}})}let G=[],F=[],U=[],j=[],Z=[],W={},K=new Set;function ve(e){return e==null?e:String(e).replace(/damamm/gi,t=>t===t.toUpperCase()?"DAMMAM":t===t.toLowerCase()?"dammam":"Dammam")}function dt(e={}){return{...e,sectorFrom:ve(e.sectorFrom||""),sectorTo:ve(e.sectorTo||""),sectorCode:ve(e.sectorCode||"")}}function Ve(e=[]){return e.map(t=>dt(t))}function T(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function D(e,t=0){const n=Number(e);return Number.isFinite(n)?n:t}const Pt=[7,10],Ae=[15,20,25,30,35,40];function we(e=[],t=0){const n=Math.max(0,le(t)),s=[...new Set(e.map(a=>Math.max(0,le(a))))];return s.includes(n)||s.push(n),s.sort((a,i)=>a-i),s.map(a=>`<option value="${a}" ${a===n?"selected":""}>${a} Kg</option>`).join("")}function le(e){if(e==null||e==="")return 0;const t=parseFloat(String(e).replace(/[^\d.]/g,""));return Number.isFinite(t)?t:0}function tt(e,t="—"){if(e==null||e==="")return t;const n=String(e).trim();return n?/^\d+(\.\d+)?(\s*kg)?$/i.test(n)?`${le(n)} Kg`:n.toUpperCase():t}function Be(e){if(!e)return null;if(e instanceof Date)return Number.isNaN(e.getTime())?null:e;const t=new Date(e);return Number.isNaN(t.getTime())?null:t}function Ne(e){const t=Be(e);if(!t)return"";const n=t.getTimezoneOffset();return new Date(t.getTime()-n*60*1e3).toISOString().split("T")[0]}function lt(e){if(!e)return null;const t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?null:t}function jt(e){if(!e)return null;const t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?null:t.getTime()}function Ut(e){if(!e)return null;const t=new Date(`${e}T23:59:59.999`);return Number.isNaN(t.getTime())?null:t.getTime()}let te={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},reportFares:{key:"flightDate",asc:!0},databaseFares:{key:"flightDate",asc:!0}},Pe={agents:"",sectors:"",airlines:""},ne={agents:10,sectors:10,airlines:10,reportFares:20,databaseFares:20},I={agents:1,sectors:1,airlines:1,reportFares:1,databaseFares:1};const B={search:"",agentId:"all",sectorId:"all",airlineId:"all",status:"all",startDate:"",endDate:""};function Je(e,t){var l;let n=e;const s=(l=Pe[t])==null?void 0:l.toLowerCase();s&&t==="agents"?n=n.filter(r=>(r.name||"").toLowerCase().includes(s)||(r.email||"").toLowerCase().includes(s)||(r.contactPhone||"").toLowerCase().includes(s)||(r.id||"").toLowerCase().includes(s)):s&&t==="sectors"?n=n.filter(r=>(r.sectorFrom||"").toLowerCase().includes(s)||(r.sectorTo||"").toLowerCase().includes(s)||(r.sectorCode||"").toLowerCase().includes(s)):s&&t==="airlines"&&(n=n.filter(r=>(r.name||"").toLowerCase().includes(s)||(r.code||"").toLowerCase().includes(s)));const{key:a,asc:i}=te[t];return a&&(n=[...n].sort((r,d)=>{let c=r[a],u=d[a];if(c instanceof Date&&(c=c.getTime()),u instanceof Date&&(u=u.getTime()),a==="id"){const o=parseInt(c),p=parseInt(u);if(!isNaN(o)&&!isNaN(p))return i?o-p:p-o}return typeof c=="string"&&(c=c.toLowerCase()),typeof u=="string"&&(u=u.toLowerCase()),c<u?i?-1:1:c>u?i?1:-1:0})),n}function De(e){document.querySelectorAll(`th[data-sort-tab="${e}"] i`).forEach(n=>{n.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const t=document.querySelector(`th[data-sort-tab="${e}"][data-sort-key="${te[e].key}"]`);if(t){const n=t.querySelector("i");n&&(n.className=`bi bi-arrow-${te[e].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",e=>{const t=e.target.closest("th[data-sort-tab]");if(!t)return;const n=t.dataset.sortTab,s=t.dataset.sortKey;te[n].key===s?te[n].asc=!te[n].asc:(te[n].key=s,te[n].asc=!0),n==="agents"?ie(!1):n==="sectors"?oe(!1):n==="airlines"?ge(!1):n==="reportFares"&&j.length?Le(j):n==="databaseFares"&&q()});document.documentElement.style.visibility="hidden";$t(async e=>{if(!e){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const t=document.getElementById("admin-user-name");t&&(t.textContent=e.email.split("@")[0]),await Ot(),xt(),await ct()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("admin-logout-btn");e&&e.addEventListener("click",async()=>{(await Et()).success&&(window.location.href="/login.html")}),_t(),qt(),hn()});async function Ot(){try{const[e,t,n]=await Promise.all([rt(),Ge(),We()]);G=e,F=Ve(t),U=n}catch(e){console.error("loadGlobalData error:",e)}}function qt(){const e=document.querySelectorAll(".nav-link"),t=document.querySelectorAll(".tab-content"),n=document.getElementById("page-title");e.forEach(s=>{s.addEventListener("click",async a=>{var r;a.preventDefault(),e.forEach(d=>{d.classList.remove("active","text-primary"),d.classList.add("text-text-muted")}),s.classList.remove("text-text-muted"),s.classList.add("active","text-primary");const i=s.getAttribute("data-tab"),l=s.getAttribute("data-title");t.forEach(d=>d.classList.remove("active")),(r=document.getElementById(i))==null||r.classList.add("active"),n&&l&&(n.textContent=l),await ct()})})}async function ct(){const e=document.querySelector(".tab-content.active");if(!e)return;const t=e.id;t==="agents-tab"?await ie():t==="sectors-tab"?await oe():t==="flights-tab"?await ge():t==="dashboard-tab"?await zt():t==="reports-tab"?await Zt():t==="database-tab"?await Ye():t==="agent-sheets-tab"?(xt(),ke(),de()):t==="eticket-tab"&&await In()}function _t(){const e=document.getElementById("admin-modal"),t=document.getElementById("modal-close-btn");t&&t.addEventListener("click",()=>e.close()),e==null||e.addEventListener("click",n=>{n.target===e&&e.close()})}function je(e,t){const n=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=e,document.getElementById("modal-body").innerHTML=t,n.showModal()}async function zt(){var s,a,i,l,r;if(!document.getElementById("dashboard-tab"))return;const t=document.getElementById("poster-sector-sel");t&&t.options.length<=1&&F.forEach(d=>{const c=new Option(d.sectorCode,d.id);t.appendChild(c)});const n=document.getElementById("poster-generate-btn");n&&!n.dataset.wired&&(n.dataset.wired="1",n.addEventListener("click",async()=>{const d=document.getElementById("poster-start-date"),c=document.getElementById("poster-end-date"),u=t==null?void 0:t.value,o=(d==null?void 0:d.value)||null,p=(c==null?void 0:c.value)||null;if(!u){x("warning","Validation Error","Please select a sector to generate the poster.");return}n.disabled=!0,n.textContent="Generating…";try{const m=await He({sectorId:u,startDate:o,endDate:p,includeHidden:!1});if(!m||!m.length){x("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await Gt(m,u)}catch(m){x("error","Generation Failed",m.message)}finally{n.disabled=!1,n.textContent="Generate Poster"}}),(s=document.getElementById("poster-download-jpg"))==null||s.addEventListener("click",()=>nt("jpeg")),(a=document.getElementById("poster-download-pdf"))==null||a.addEventListener("click",()=>nt("pdf")),(i=document.getElementById("poster-download-vid-1x1"))==null||i.addEventListener("click",()=>qe("1x1")),(l=document.getElementById("poster-download-vid-9x16"))==null||l.addEventListener("click",()=>qe("9x16")),(r=document.getElementById("poster-download-vid-16x9"))==null||r.addEventListener("click",()=>qe("16x9")))}async function qe(e){const t=document.getElementById("poster-sector-sel"),n=document.getElementById("poster-start-date"),s=document.getElementById("poster-end-date"),a=t==null?void 0:t.value,i=(n==null?void 0:n.value)||null,l=(s==null?void 0:s.value)||null;if(!a){x("warning","Validation Error","Please select a sector to generate the poster.");return}try{const r=await He({sectorId:a,startDate:i,endDate:l,includeHidden:!1});if(!r||!r.length){x("warning","No Fares","No live fares found for the selected sector and dates.");return}await Nt(e,r,a,F,U)}catch(r){console.error("Video generation failed",r)}}async function Gt(e,t){const n=document.getElementById("poster-preview-container"),s=document.getElementById("poster-fares-tbody"),a=document.getElementById("poster-sector-title");if(!n||!s||!a)return;const i=F.find(m=>m.id===t),l=i?(i.sectorFrom||"DEP").toUpperCase():"DEP",r=i?(i.sectorTo||"ARR").toUpperCase():"ARR";a.innerHTML=`${l} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${r}`;const d=[...e].sort((m,g)=>{let y=m.flightDate,w=g.flightDate;return y instanceof Date&&(y=y.getTime()),w instanceof Date&&(w=w.getTime()),y-w}).slice(0,10),c={};U.forEach(m=>{m.id&&(c[m.id]=m),m.code&&(c[m.code]=m),m.name&&(c[m.name]=m)});async function u(m){try{const g=await fetch(m);if(!g.ok)return null;const y=await g.blob();return URL.createObjectURL(y)}catch{return null}}const o=[...new Set(d.map(m=>m.airlineId))].map(m=>c[m]).filter(m=>m==null?void 0:m.logoUrl),p={};await Promise.all(o.map(async m=>{const g=await u(m.logoUrl);g&&(p[m.id]=g)})),s.innerHTML=d.map((m,g)=>{const y=m.flightDate instanceof Date?m.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():m.flightDate,w=c[m.airlineId],E=g%2===0?"#ffffff":"#f8fafc",S=p[m.airlineId]||null,f=S?`<img src="${S}" style="height:40px;max-width:100px;object-fit:contain;display:block;margin:0 auto;" alt="${(w==null?void 0:w.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:15px;white-space:nowrap;">${(w==null?void 0:w.name)||m.airlineId||"—"}</span>`;let h='<span style="color:#94a3b8;font-size:14px;">—</span>';if(m.flightTime){const v=m.flightTime.split("-").map(k=>k.trim());v.length>=2?h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${v[0]} - ${v[1]}</span>`:h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${m.flightTime}</span>`}return`
      <tr style="background-color:${E};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 12px;font-weight:900;color:#0f172a;font-size:22px;white-space:nowrap;">${y}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${f}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${h}</td>
        <td style="padding:16px 12px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:8px 18px;border-radius:12px;font-weight:900;font-size:22px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            &#8377;${(m.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),n.classList.remove("hidden"),n.classList.add("flex")}function mt(e){if(!e||e.nodeType!==1)return;const t=window.getComputedStyle(e),n=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const s of n){const a=t.getPropertyValue(s);if(a&&!a.startsWith("rgb")&&!a.startsWith("#")&&a!=="transparent"&&a!=="initial")try{e.style[s]=a}catch{}}for(const s of e.children)mt(s)}async function nt(e){const t=document.getElementById("poster-render-frame");if(!t)return;const n=document.getElementById("poster-download-jpg"),s=document.getElementById("poster-download-pdf");n&&(n.disabled=!0),s&&(s.disabled=!0);const a=t.style.transform;t.style.transform="none",x("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(t.querySelectorAll("img")).map(r=>r.complete?Promise.resolve():new Promise(d=>{r.onload=d,r.onerror=d})));const i=await html2canvas(t,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:r=>{const d=r.getElementById("poster-render-frame");d&&mt(d)}});t.style.transform=a;const l=i.toDataURL("image/jpeg",.95);if(e==="jpeg"){const r=document.createElement("a");r.download=`zamra-poster-${Date.now()}.jpg`,r.href=l,r.click(),x("success","Downloaded!","JPEG poster saved successfully.")}else if(e==="pdf"){const r=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!r)throw new Error("jsPDF library not loaded.");const d=96/25.4,c=i.width/2/d,u=i.height/2/d,o=new r({orientation:c>u?"landscape":"portrait",unit:"mm",format:[c,u]});o.addImage(l,"JPEG",0,0,c,u),o.save(`zamra-poster-${Date.now()}.pdf`),x("success","Downloaded!","PDF poster saved successfully.")}}catch(i){console.error("Poster export error:",i),t.style.transform=a,x("error","Export Failed",i.message||"There was an error generating the export.")}finally{n&&(n.disabled=!1),s&&(s.disabled=!1)}}function Le(e){const t=document.getElementById("report-fares-results");if(!t)return;if(!e||!e.length){t.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-inbox"></i>
        </div>
        <p class="admin-empty-state-title">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const n=Object.fromEntries(G.map(m=>[m.id,m.name])),s=Object.fromEntries(F.map(m=>[m.id,m.sectorCode])),a=Object.fromEntries(U.map(m=>[m.id,m.code])),{key:i,asc:l}=te.reportFares,r=[...e].sort((m,g)=>{let y=m[i],w=g[i];return y instanceof Date&&(y=y.getTime()),w instanceof Date&&(w=w.getTime()),typeof y=="string"&&(y=y.toLowerCase()),typeof w=="string"&&(w=w.toLowerCase()),y<w?l?-1:1:y>w?l?1:-1:0}),d=ne.reportFares,c=Math.max(1,Math.ceil(e.length/d));I.reportFares>c&&(I.reportFares=c);const u=(I.reportFares-1)*d,o=r.slice(u,u+d),p=(m,g)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${m}">${g} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;t.innerHTML=`
    <div class="admin-table-container overflow-x-auto w-full rounded-none border-0 shadow-none">
      <table class="admin-table w-full text-sm">
        <thead><tr>
          ${p("flightDate","Date")}
          ${p("flightTime","Time")}
          ${p("sectorId","Sector")}
          ${p("airlineId","Airline")}
          ${p("agentId","Agent")}
          ${p("specialRate","SP Rate (₹)")}
          ${p("finalRate","Rate (₹)")}
          ${p("commission","Comm (₹)")}
          ${p("baggage","Bag")}
          ${p("extraBaggage","Ex.Bag")}
          ${p("isHidden","Status")}
          <th class="whitespace-nowrap">Actions</th>
        </tr></thead>
        <tbody>
          ${o.map((m,g)=>{const y=m.flightDate instanceof Date?m.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):m.flightDate||"—";return`<tr class="${g%2===1?"bg-slate-50/60":""} hover:bg-slate-100/80 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${y}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${m.flightTime||"—"}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${s[m.sectorId]||m.sectorId}</span>
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
                    <i class="bi ${m.isHidden?"bi-eye":"bi-eye-slash"}"></i>${m.isHidden?"Show":"Hide"}
                  </button>
                  <button onclick="window.__deleteFare('${m.id}')"
                    class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Del</button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,$e("reportFares",e.length,c,u,d),window.__deleteFare=async m=>{if(confirm("Delete this fare?"))try{await ze(m),j=j.filter(g=>g.id!==m),x("success","Deleted","Fare removed."),Le(j)}catch(g){x("error","Error",g.message)}},window.__toggleFare=async(m,g)=>{try{await ot(m,{isHidden:g}),j=j.map(y=>y.id===m?{...y,isHidden:g}:y),x("success","Updated",`Fare ${g?"hidden":"shown"}.`),Le(j)}catch(y){x("error","Error",y.message)}},De("reportFares")}async function ie(e=!0){e&&(G=await rt(),I.agents=1);const t=document.querySelector("#agents-tab .admin-table tbody");if(!t)return;const n=document.getElementById("agents-search"),s=document.getElementById("agents-limit");n&&!n.dataset.wired&&(n.dataset.wired="1",s&&(s.dataset.wired="1"),n.addEventListener("input",u=>{Pe.agents=u.target.value,I.agents=1,ie(!1)}),s&&s.addEventListener("change",u=>{ne.agents=parseInt(u.target.value),I.agents=1,ie(!1)}));const a=Je(G,"agents"),i=ne.agents,l=Math.max(1,Math.ceil(a.length/i));I.agents>l&&(I.agents=l);const r=(I.agents-1)*i,d=a.slice(r,r+i);t.innerHTML=d.length?d.map(u=>Wt(u)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',$e("agents",a.length,l,r,i),delete t.dataset.actionsWired,Vt();const c=document.getElementById("agents-add-btn");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>ut(null))),De("agents")}function Wt(e){const t=e.isActive!==!1?'<span class="admin-status-pill admin-status-active">Active</span>':'<span class="admin-status-pill admin-status-inactive">Hidden</span>',n=e.commission!==void 0?`₹${Number(e.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id||"—"}</td>
    <td class="font-semibold">${e.name}</td>
    <td>${e.email||"—"}</td>
    <td>${e.contactPhone||"—"}</td>
    <td class="font-semibold text-navy">${n}</td>
    <td>${t}</td>
    <td class="flex gap-1 flex-wrap">
      <button data-action="edit-agent" data-id="${e.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
      <button data-action="delete-agent" data-id="${e.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      <button data-action="toggle-agent" data-id="${e.id}" data-active="${e.isActive!==!1}"
        class="admin-action-btn ${e.isActive!==!1?"admin-action-toggle":"admin-action-show"}">
        <i class="bi ${e.isActive!==!1?"bi-eye-slash":"bi-eye"}"></i>${e.isActive!==!1?"Hide Fares":"Show Fares"}</button>
    </td>
  </tr>`}function Vt(){const e=document.querySelector("#agents-tab .admin-table tbody");!e||e.dataset.actionsWired||(e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const s=n.dataset.action,a=n.dataset.id,i=G.find(l=>l.id===a);if(s==="edit-agent"&&ut(i),s==="delete-agent"){if(!confirm(`Delete agent "${i==null?void 0:i.name}"? This does NOT delete their fares.`))return;try{await It(a),x("success","Deleted",`Agent "${i==null?void 0:i.name}" removed.`),await ie()}catch(l){x("error","Error",l.message)}}if(s==="toggle-agent"){const r=!(n.dataset.active==="true");n.disabled=!0,n.textContent="Working…";try{const d=await St(a,r);x("success",r?"Agent Shown":"Agent Hidden",d.message),await ie()}catch(d){x("error","Toggle Failed",d.message),await ie()}}}))}function $e(e,t,n,s,a){const i=document.getElementById(`${e}-pagination-footer`);if(!i)return;const l=Math.min(s+a,t),r=I[e];i.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${t?s+1:0} to ${l} of ${t} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${r<=1?"disabled":""}>Previous</button>
        ${Array.from({length:n},(d,c)=>c+1).map(d=>`<button data-pg-action="goto" data-pg="${d}" class="admin-pagination-btn ${d===r?"admin-pagination-btn-active":""}">${d}</button>`).join("")}
        <button data-pg-action="next" class="admin-pagination-btn" ${r>=n?"disabled":""}>Next</button>
      </div>
    </div>`,i.dataset.wired||(i.dataset.wired="1",i.addEventListener("click",d=>{const c=d.target.closest("[data-pg-action]");if(!c||c.disabled)return;const u=c.dataset.pgAction;u==="prev"?I[e]=Math.max(1,I[e]-1):u==="next"?I[e]++:u==="goto"&&(I[e]=parseInt(c.dataset.pg)),e==="agents"?ie(!1):e==="sectors"?oe(!1):e==="airlines"?ge(!1):e==="reportFares"?Le(j):e==="databaseFares"&&q()}))}function ut(e){var n,s;const t=!!e;je(t?"Edit Agent":"Add New Agent",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("agent-form"))==null||s.addEventListener("submit",async a=>{a.preventDefault();const i=new FormData(a.target),l=Object.fromEntries(i.entries()),r=a.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{t?(await Ct(e.id,l),x("success","Updated",`Agent "${l.name}" updated.`)):(await At(l),x("success","Added",`Agent "${l.name}" added.`)),document.getElementById("admin-modal").close(),await ie()}catch(d){x("error","Save Failed",d.message),r.disabled=!1,r.textContent=t?"Save Changes":"Add Agent"}})}async function oe(e=!0){e&&(F=Ve(await Ge()),I.sectors=1);const t=document.getElementById("sectors-search"),n=document.getElementById("sectors-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",n.dataset.wired="1",t.addEventListener("input",u=>{Pe.sectors=u.target.value,I.sectors=1,oe(!1)}),n.addEventListener("change",u=>{ne.sectors=parseInt(u.target.value),I.sectors=1,oe(!1)}));const s=document.querySelector("#sectors-tab .admin-table tbody");if(!s)return;const a=Je(F,"sectors"),i=ne.sectors,l=Math.max(1,Math.ceil(a.length/i));I.sectors>l&&(I.sectors=l);const r=(I.sectors-1)*i,d=a.slice(r,r+i);s.innerHTML=d.length?d.map(u=>Jt(u)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',$e("sectors",a.length,l,r,i),Yt();const c=document.querySelector("#sectors-tab .flex.justify-between button");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>pt(null))),De("sectors")}function Jt(e){const t=dt(e);return`<tr data-sector-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id||"—"}</td>
    <td class="font-semibold">${t.sectorFrom}</td>
    <td class="font-semibold">${t.sectorTo}</td>
    <td><span class="font-mono font-bold text-primary">${t.sectorCode}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-sector" data-id="${e.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
      <button data-action="delete-sector" data-id="${e.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      <button data-action="toggle-sector" data-id="${e.id}" data-hidden="${e.isHidden===!0}"
        class="admin-action-btn ${e.isHidden===!0?"admin-action-show":"admin-action-toggle"}">
        <i class="bi ${e.isHidden===!0?"bi-eye":"bi-eye-slash"}"></i>${e.isHidden===!0?"Show Fares":"Hide Fares"}</button>
    </td>
  </tr>`}function Yt(){const e=document.querySelector("#sectors-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const{action:s,id:a}=n.dataset,i=F.find(l=>l.id===a);if(s==="edit-sector"&&pt(i),s==="delete-sector"){if(!confirm(`Delete sector "${i==null?void 0:i.sectorCode}"?`))return;try{await Bt(a),x("success","Deleted",`Sector "${i==null?void 0:i.sectorCode}" removed.`),await oe()}catch(l){x("error","Error",l.message)}}if(s==="toggle-sector"){const r=!(n.dataset.hidden==="true");n.disabled=!0,n.textContent="Working…";try{const d=await Lt(a,r);x("success",`Sector Fares ${r?"Hidden":"Shown"}`,d.message),await oe()}catch(d){x("error","Toggle Failed",d.message),await oe()}}}))}function pt(e){var n,s;const t=!!e;je(t?"Edit Sector":"Add New Sector",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("sector-form"))==null||s.addEventListener("submit",async a=>{a.preventDefault();const i=new FormData(a.target),l=Object.fromEntries(i.entries());l.sectorCode=ve(l.sectorCode.toUpperCase()),l.sectorFrom=ve(l.sectorFrom.toUpperCase()),l.sectorTo=ve(l.sectorTo.toUpperCase());const r=a.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{t?(await Tt(e.id,l),x("success","Updated","Sector updated.")):(await kt(l),x("success","Added",`Sector "${l.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await oe()}catch(d){x("error","Save Failed",d.message),r.disabled=!1,r.textContent=t?"Save Changes":"Add Sector"}})}async function ge(e=!0){e&&(U=await We(),I.airlines=1);const t=document.getElementById("airlines-search"),n=document.getElementById("airlines-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",n.dataset.wired="1",t.addEventListener("input",u=>{Pe.airlines=u.target.value,I.airlines=1,ge(!1)}),n.addEventListener("change",u=>{ne.airlines=parseInt(u.target.value),I.airlines=1,ge(!1)}));const s=document.querySelector("#flights-tab .admin-table tbody");if(!s)return;const a=Je(U,"airlines"),i=ne.airlines,l=Math.max(1,Math.ceil(a.length/i));I.airlines>l&&(I.airlines=l);const r=(I.airlines-1)*i,d=a.slice(r,r+i);s.innerHTML=d.length?d.map(u=>Xt(u)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "Add Airline".</td></tr>',$e("airlines",a.length,l,r,i),Kt();const c=document.querySelector("#flights-tab .flex.justify-between button");c&&!c.dataset.wired&&(c.dataset.wired="1",c.addEventListener("click",()=>gt(null))),De("airlines")}function Xt(e){const t=e.logoUrl?`<span class="admin-logo-wrap"><img src="${e.logoUrl}" alt="${T(e.name||"Airline")}"></span>`:`<span class="admin-logo-wrap"><span class="admin-logo-fallback">${T((e.code||"NA").slice(0,3))}</span></span>`;return`<tr data-airline-id="${e.id}">
    <td>${t}</td>
    <td class="font-semibold">${e.name}</td>
    <td><span class="font-mono font-bold text-primary">${e.code}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-airline" data-id="${e.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
      <button data-action="delete-airline" data-id="${e.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
    </td>
  </tr>`}function Kt(){const e=document.querySelector("#flights-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const{action:s,id:a}=n.dataset,i=U.find(l=>l.id===a);if(s==="edit-airline"&&gt(i),s==="delete-airline"){if(!confirm(`Delete airline "${i==null?void 0:i.name}" (${i==null?void 0:i.code})?`))return;try{await Dt(a),x("success","Deleted",`Airline "${i==null?void 0:i.name}" removed.`),await ge()}catch(l){x("error","Error",l.message)}}}))}function gt(e){var n,s;const t=!!e;je(t?"Edit Airline":"Add New Airline",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("airline-form"))==null||s.addEventListener("submit",async a=>{var c;a.preventDefault();const i=new FormData(a.target),l=((c=i.get("logoFile"))==null?void 0:c.size)>0?i.get("logoFile"):null,r={name:i.get("name"),code:i.get("code").toUpperCase()},d=a.target.querySelector("[type=submit]");d.disabled=!0,d.textContent="Saving…";try{t?(await Ft(e.id,r,l),x("success","Updated","Airline updated.")):(await Rt(r,l),x("success","Added",`Airline "${r.name}" added.`)),document.getElementById("admin-modal").close(),await ge()}catch(u){x("error","Save Failed",u.message),d.disabled=!1,d.textContent=t?"Save Changes":"Add Airline"}})}async function Zt(){const e=document.getElementById("reports-tab");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=document.getElementById("reports-sector-sel");t&&t.options.length<=1&&F.forEach(l=>t.appendChild(new Option(l.sectorCode,l.id)));const n=document.getElementById("reports-agent-sel");n&&n.options.length<=1&&G.forEach(l=>n.appendChild(new Option(l.name,l.id)));const s=document.getElementById("generate-report-btn"),a=document.getElementById("reports-start-date"),i=document.getElementById("reports-end-date");s&&!s.dataset.wired&&(s.dataset.wired="1",s.addEventListener("click",async()=>{const l=(t==null?void 0:t.value)||"all",r=(n==null?void 0:n.value)||"all",d=(a==null?void 0:a.value)||null,c=(i==null?void 0:i.value)||null;if(l==="all"&&!d&&!c&&r==="all"){x("warning","No Filter Selected","Select at least a sector, an agent, or a date range.");return}s.disabled=!0,s.textContent="Generating…";try{const[u,o]=await Promise.all([Mt(d,c,l,r),He({sectorId:l,agentId:r,startDate:d,endDate:c,includeHidden:!0})]);j=o,Qt(u,e),I.reportFares=1,Le(j)}catch(u){x("error","Report Failed",u.message)}finally{s.disabled=!1,s.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Qt(e,t){const{agentReport:n,sectorReport:s,totalFares:a}=e,i=document.getElementById("report-stats-row");if(i){i.classList.remove("hidden");const p=(j||[]).filter(f=>!f.isHidden).length,m=(j||[]).filter(f=>f.isHidden).length,g=new Set((j||[]).map(f=>f.agentId)).size,y=(j||[]).map(f=>f.finalRate||0).filter(f=>f>0),w=y.length?Math.round(y.reduce((f,h)=>f+h,0)/y.length):0,E=(f,h)=>{const v=document.getElementById(f);v&&(v.textContent=h.toLocaleString())};E("stat-total-fares",a),E("stat-live-fares",p),E("stat-hidden-fares",m),E("stat-agents-count",g);const S=document.getElementById("stat-avg-fare");S&&(S.textContent=w>0?`₹${w.toLocaleString()}`:"—")}const l=document.getElementById("report-total-fares");l&&(l.textContent=`${a} fare${a!==1?"s":""} matched your filter`);const r=document.getElementById("bar-chart-container");r&&n.length&&en(n.slice(0,8),r);const d=document.getElementById("donut-chart-svg"),c=document.getElementById("pie-legend");d&&s.length&&tn(s.slice(0,8),d,c);const u=document.getElementById("report-leaderboards");u&&(u.classList.remove("hidden"),nn(n,s));const o=document.getElementById("download-report-csv");if(o){const p=o.cloneNode(!0);o.parentNode.replaceChild(p,o),p.addEventListener("click",()=>an(j)),j&&j.length?p.classList.remove("opacity-50","pointer-events-none"):p.classList.add("opacity-50","pointer-events-none")}x("success","Report Ready",`${a} fare${a!==1?"s":""} aggregated.`)}function en(e,t){const n=t.clientWidth||480,s=260,a={top:32,right:16,bottom:48,left:48},i=n-a.left-a.right,l=s-a.top-a.bottom,r=Math.max(...e.map(f=>f.count),1),d=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],c=4,u=Math.ceil(r/c),o=Array.from({length:c+1},(f,h)=>h*u),p=o.map(f=>{const h=a.top+l-f/(o[o.length-1]||1)*l;return`<line x1="${a.left}" y1="${h.toFixed(1)}" x2="${n-a.right}" y2="${h.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${a.left-6}" y="${(h+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${f}</text>`}).join(""),m=Math.min(48,i/e.length*.6),g=i/e.length,y=e.map((f,h)=>{const v=Math.max(4,f.count/(o[o.length-1]||1)*l),k=a.left+h*g+g/2-m/2,P=a.top+l-v,[z,Y]=d[h%d.length],ae=`bg${h}`,se=f.avgRate?`avg ₹${Math.round(f.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${ae}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${z}"/>
              <stop offset="100%" stop-color="${Y}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${f.name}" data-count="${f.count}" data-avg="${se}" style="cursor:pointer;">
              <rect x="${k.toFixed(1)}" y="${P.toFixed(1)}" width="${m}" height="${v.toFixed(1)}"
                rx="6" fill="url(#${ae})" opacity="0.92"
                style="transform-origin:${(k+m/2).toFixed(1)}px ${(a.top+l).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${h*.07}s both;"/>
              <text x="${(k+m/2).toFixed(1)}" y="${(P-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${Y}">${f.count}</text>
              <text x="${(k+m/2).toFixed(1)}" y="${(a.top+l+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(f.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),w="bar-tooltip";t.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${w}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${s}" viewBox="0 0 ${n} ${s}" style="overflow:visible;">
      ${p}
      <line x1="${a.left}" y1="${a.top}" x2="${a.left}" y2="${a.top+l}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${a.left}" y1="${a.top+l}" x2="${n-a.right}" y2="${a.top+l}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${y}
    </svg>`;const E=t.querySelector("#bar-svg"),S=t.querySelector(`#${w}`);E&&S&&E.querySelectorAll(".bar-group").forEach(f=>{f.addEventListener("mousemove",h=>{const v=t.getBoundingClientRect();S.style.display="block",S.style.left=h.clientX-v.left+12+"px",S.style.top=h.clientY-v.top-40+"px";const k=f.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${f.dataset.avg}</span>`:"";S.innerHTML=`${f.dataset.name}<br><span style="color:#60a5fa;">${f.dataset.count} fares</span>${k}`}),f.addEventListener("mouseleave",()=>{S.style.display="none"})})}function tn(e,t,n){const s=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],d=e.reduce((f,h)=>f+h.count,0),c=t.getElementById?t.getElementById("donut-segments"):t.querySelector("#donut-segments"),u=t.querySelector("#donut-center-count"),o=t.querySelector("#donut-center-label");if(!c)return;u&&(u.textContent=d),o&&(o.textContent="FARES");const p=(f,h,v,k)=>({x:f+v*Math.cos((k-90)*Math.PI/180),y:h+v*Math.sin((k-90)*Math.PI/180)});let m=0;const g=e.map((f,h)=>{const v=d>0?f.count/d*360:0,k=m+v,P=v>180?1:0,z=p(110,110,95,m),Y=p(110,110,95,k),ae=p(110,110,60,m),se=p(110,110,60,k),ce=[`M ${z.x.toFixed(2)} ${z.y.toFixed(2)}`,`A 95 95 0 ${P} 1 ${Y.x.toFixed(2)} ${Y.y.toFixed(2)}`,`L ${se.x.toFixed(2)} ${se.y.toFixed(2)}`,`A 60 60 0 ${P} 0 ${ae.x.toFixed(2)} ${ae.y.toFixed(2)}`,"Z"].join(" "),me=m+v/2;m=k;const b=d>0?(f.count/d*100).toFixed(1):"0.0";return{pathD:ce,color:s[h%s.length],name:f.name,count:f.count,pct:b,mid:me}}),y="http://www.w3.org/2000/svg";c.innerHTML="";const w=g.map((f,h)=>{const v=document.createElementNS(y,"path");return v.setAttribute("d",f.pathD),v.setAttribute("fill",f.color),v.setAttribute("stroke","white"),v.setAttribute("stroke-width","2"),v.style.cursor="pointer",v.style.transition="transform 0.2s, filter 0.2s",v.style.transformOrigin="110px 110px",v.setAttribute("data-index",h),c.appendChild(v),v}),E=f=>{w.forEach((h,v)=>{v===f?(h.style.transform="scale(1.04)",h.style.filter="brightness(1.1)",h.setAttribute("stroke-width","3")):(h.style.transform="scale(1)",h.style.filter="brightness(1)",h.setAttribute("stroke-width","2"))}),f>=0&&f<g.length?(u&&(u.textContent=g[f].count),o&&(o.textContent=g[f].name.split(" ")[0].toUpperCase().slice(0,7))):(u&&(u.textContent=d),o&&(o.textContent="FARES"))};if(w.forEach((f,h)=>{f.addEventListener("mouseover",()=>{E(h),S(h)}),f.addEventListener("mouseout",()=>{E(-1),S(-1)})}),n){n.innerHTML=g.map((h,v)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${v}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${h.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${h.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${h.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${h.pct}%</span>
      </div>`).join("");const f=h=>{n.querySelectorAll(".legend-row").forEach((v,k)=>{v.style.background=k===h?"#f1f5f9":""})};window._highlightLegendRows=f,n.querySelectorAll(".legend-row").forEach((h,v)=>{h.addEventListener("mouseover",()=>{E(v),f(v)}),h.addEventListener("mouseout",()=>{E(-1),f(-1)})})}function S(f){window._highlightLegendRows&&window._highlightLegendRows(f)}}function nn(e,t){var i,l;const n=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],s=document.getElementById("leaderboard-agents");if(s&&e.length){const r=[...e].sort((c,u)=>u.count-c.count).slice(0,5),d=r[0].count||1;s.innerHTML=r.map((c,u)=>{const o=Math.max(6,Math.round(c.count/d*100));return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="width:28px;text-align:center;flex-shrink:0;">${u===0?'<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:#fff7ed;color:#b45309;border:1px solid #fed7aa;"><i class="bi bi-trophy-fill" style="font-size:12px;"></i></span>':`<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:#f8fafc;color:#64748b;border:1px solid #e2e8f0;font-size:11px;font-weight:800;">#${u+1}</span>`}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${c.name}</span>
            <span style="color:${n[u]};margin-left:8px;">${c.count} fares</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${o}%;height:100%;background:${n[u]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}const a=document.getElementById("leaderboard-sectors");if(a&&t.length){const d=[...t.filter(o=>o.avgRate>0)].sort((o,p)=>o.avgRate-p.avgRate).slice(0,5),c=((i=d[0])==null?void 0:i.avgRate)||1,u=((l=d[d.length-1])==null?void 0:l.avgRate)||1;a.innerHTML=d.map((o,p)=>{const m=u>c?Math.max(6,Math.round((o.avgRate-c)/(u-c)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${p+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${o.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(o.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${m}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function an(e){if(!e||!e.length){x("warning","No Data","No fares to export. Apply filters and fetch first.");return}const t=Object.fromEntries(G.map(o=>[o.id,o.name])),n=Object.fromEntries(F.map(o=>[o.id,o.sectorCode])),s=Object.fromEntries(U.map(o=>[o.id,o.code||o.name])),a=o=>`"${String(o??"").replace(/"/g,'""')}"`,i=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],l=e.map(o=>{const p=o.flightDate instanceof Date?o.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):o.flightDate||"";return[a(p),a(o.flightTime||""),a(n[o.sectorId]||o.sectorId),a(s[o.airlineId]||o.airlineId),a(t[o.agentId]||o.agentId),a(o.specialRate||0),a(o.finalRate||0),a(o.commission||0),a(o.baggage||""),a(o.extraBaggage||""),a(o.isHidden?"Hidden":"Live")].join(",")}),r=[i.map(a).join(","),...l].join(`
`),d=new Blob(["\uFEFF"+r],{type:"text/csv;charset=utf-8;"}),c=URL.createObjectURL(d),u=document.createElement("a");u.href=c,u.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(u),u.click(),document.body.removeChild(u),URL.revokeObjectURL(c),x("success","CSV Downloaded",`${e.length} fares exported.`)}function ft(){return Object.keys(W).length}function sn(){return{agentNameById:Object.fromEntries(G.map(e=>[e.id,e.name||e.id])),sectorCodeById:Object.fromEntries(F.map(e=>[e.id,e.sectorCode||`${e.sectorFrom||""} ${e.sectorTo||""}`.trim()||e.id])),airlineLabelById:Object.fromEntries(U.map(e=>[e.id,e.code?`${e.code} - ${e.name||""}`.trim():e.name||e.id]))}}function on(e,t){return e==="specialRate"||e==="finalRate"||e==="commission"||e==="extraBaggage"?t===""?"":D(t,0):e==="baggage"?t===""?"":le(t):e==="isHidden"?t===!0||t==="hidden"||t==="true":e==="flightTime"?String(t||"").trim():e==="flightDate"?t||"":String(t||"")}function rn(e,t){return e==="specialRate"||e==="finalRate"||e==="extraBaggage"?D(t,0):e==="commission"?t==null||t===""?"":Math.max(0,D(t,0)):e==="baggage"?le(t):e==="isHidden"?t===!0:e==="flightTime"?String(t||"").trim():e==="flightDate"?Ne(t):String(t||"")}function bt(e){return e?e.commission!==void 0&&e.commission!==null&&e.commission!==""?Math.max(0,D(e.commission,0)):Math.max(0,D(e.finalRate,0)-D(e.specialRate,0)):0}function Te(e,t){return Math.max(0,D(e,0)+Math.max(0,D(t,0)))}function ht(e){const t=W[e.id]||{},n={...e,...t},s=bt(e);return n.flightDate=t.flightDate!==void 0?lt(t.flightDate):Be(e.flightDate),n.specialRate=D(n.specialRate,0),n.commission=t.commission!==void 0?Math.max(0,D(t.commission,0)):s,n.finalRate=Te(n.specialRate,n.commission),n.baggage=le(n.baggage),n.extraBaggage=D(n.extraBaggage,0),n.isHidden=n.isHidden===!0||n.isHidden==="hidden"||n.isHidden==="true",n.flightTime=String(n.flightTime||"").trim(),n.agentId=n.agentId||"",n.sectorId=n.sectorId||"",n.airlineId=n.airlineId||"",n}function Se(){const e=ft(),t=K.size,n=document.getElementById("database-unsaved-pill");n&&(n.textContent=`Unsaved: ${e}`);const s=document.getElementById("database-save-all-btn");s&&(s.disabled=e===0);const a=document.getElementById("database-delete-selected-btn");a&&(a.disabled=t===0);const i=document.getElementById("database-selected-count");i&&(i.textContent=String(t))}function dn(){const e=document.getElementById("database-agent-filter"),t=document.getElementById("database-sector-filter"),n=document.getElementById("database-airline-filter");if(e){const s=B.agentId;e.innerHTML='<option value="all">All Agents</option>'+G.map(a=>`<option value="${T(a.id)}">${T(a.id)} · ${T(a.name||"Unnamed")}</option>`).join(""),e.value=s}if(t){const s=B.sectorId;t.innerHTML='<option value="all">All Sectors</option>'+F.map(a=>`<option value="${T(a.id)}">${T(a.sectorCode||a.id)}</option>`).join(""),t.value=s}if(n){const s=B.airlineId;n.innerHTML='<option value="all">All Airlines</option>'+U.map(a=>`<option value="${T(a.id)}">${T(a.code||"—")} · ${T(a.name||"Unnamed")}</option>`).join(""),n.value=s}}function ln(){const e=document.getElementById("database-table-wrap");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=a=>{const i=e.querySelector(`tr[data-fare-id="${a}"]`);if(!i)return;const l=!!W[a];i.classList.toggle("admin-database-row-dirty",l);const r=i.querySelector('[data-db-action="save"]'),d=i.querySelector('[data-db-action="reset"]');r&&(r.disabled=!l),d&&(d.disabled=!l)},n=a=>{if(!a)return;const i=a.querySelector('[data-db-field="specialRate"]'),l=a.querySelector('[data-db-field="commission"]'),r=a.querySelector('[data-db-field="finalRate"]');if(!i||!l||!r)return;const d=D(i.value,0),c=Math.max(0,D(l.value,0));r.value=String(Te(d,c))},s=a=>{const i=a.target.closest("[data-db-field]");if(!i)return;const l=i.closest("tr[data-fare-id]");if(!l)return;const r=l.dataset.fareId,d=i.dataset.dbField,c=Z.find(y=>y.id===r);if(!c||!d)return;const u=i.value,o=on(d,u),p=d==="commission"?bt(c):rn(d,c[d]),m=o!==p,g={...W[r]||{}};m?g[d]=o:delete g[d],Object.keys(g).length?W[r]=g:delete W[r],(d==="specialRate"||d==="commission")&&n(l),t(r),Se()};e.addEventListener("input",s),e.addEventListener("change",a=>{s(a);const i=a.target.closest("#database-select-all");if(i){e.querySelectorAll("input[data-db-select]").forEach(r=>{r.checked=i.checked;const d=r.dataset.dbSelect;d&&(i.checked?K.add(d):K.delete(d))}),Se();return}const l=a.target.closest("input[data-db-select]");if(l){const r=l.dataset.dbSelect;if(!r)return;l.checked?K.add(r):K.delete(r),Se()}}),e.addEventListener("click",async a=>{const i=a.target.closest("[data-db-action]");if(!i)return;const l=i.dataset.dbAction,r=i.dataset.id;if(r){if(l==="save"){i.disabled=!0,await yt(r)||(i.disabled=!1),q();return}if(l==="reset"){delete W[r],q();return}if(l==="delete"){if(!confirm("Delete this fare row? This cannot be undone."))return;i.disabled=!0;try{await ze(r),Z=Z.filter(d=>d.id!==r),delete W[r],K.delete(r),x("success","Deleted","Fare row removed."),q()}catch(d){x("error","Delete Failed",d.message),i.disabled=!1}}}})}function cn(e){if(!e||e.dataset.controlsWired)return;e.dataset.controlsWired="1";const t=document.getElementById("database-search"),n=document.getElementById("database-agent-filter"),s=document.getElementById("database-sector-filter"),a=document.getElementById("database-airline-filter"),i=document.getElementById("database-status-filter"),l=document.getElementById("database-start-date"),r=document.getElementById("database-end-date"),d=document.getElementById("database-limit"),c=document.getElementById("database-clear-filters"),u=document.getElementById("database-refresh-btn"),o=document.getElementById("database-save-all-btn"),p=document.getElementById("database-delete-selected-btn"),m=document.getElementById("database-add-row-btn");t&&t.addEventListener("input",g=>{B.search=g.target.value||"",I.databaseFares=1,q()}),n&&n.addEventListener("change",g=>{B.agentId=g.target.value||"all",I.databaseFares=1,q()}),s&&s.addEventListener("change",g=>{B.sectorId=g.target.value||"all",I.databaseFares=1,q()}),a&&a.addEventListener("change",g=>{B.airlineId=g.target.value||"all",I.databaseFares=1,q()}),i&&i.addEventListener("change",g=>{B.status=g.target.value||"all",I.databaseFares=1,q()}),l&&l.addEventListener("change",g=>{B.startDate=g.target.value||"",I.databaseFares=1,q()}),r&&r.addEventListener("change",g=>{B.endDate=g.target.value||"",I.databaseFares=1,q()}),d&&(d.value=String(ne.databaseFares),d.addEventListener("change",g=>{ne.databaseFares=parseInt(g.target.value,10)||20,I.databaseFares=1,q()})),c&&c.addEventListener("click",()=>{B.search="",B.agentId="all",B.sectorId="all",B.airlineId="all",B.status="all",B.startDate="",B.endDate="",t&&(t.value=""),n&&(n.value="all"),s&&(s.value="all"),a&&(a.value="all"),i&&(i.value="all"),l&&(l.value=""),r&&(r.value=""),I.databaseFares=1,q()}),u&&u.addEventListener("click",async()=>{const g=u.innerHTML;u.disabled=!0,u.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing...',await Ye(!0),u.disabled=!1,u.innerHTML=g}),o&&o.addEventListener("click",un),p&&p.addEventListener("click",pn),m&&m.addEventListener("click",gn)}async function Ye(e=!0){const t=document.getElementById("database-tab");if(!t)return;if(cn(t),ln(),dn(),e||!t.dataset.loaded)try{Z=await He({includeHidden:!0}),W={},K=new Set,I.databaseFares=1,t.dataset.loaded="1"}catch(s){x("error","Load Failed",s.message),Z=[]}q()}function mn(){const{agentNameById:e,sectorCodeById:t,airlineLabelById:n}=sn(),s=B.search.trim().toLowerCase(),a=jt(B.startDate),i=Ut(B.endDate),l=Z.map(c=>ht(c)).filter(c=>{var p,m;if(B.agentId!=="all"&&c.agentId!==B.agentId||B.sectorId!=="all"&&c.sectorId!==B.sectorId||B.airlineId!=="all"&&c.airlineId!==B.airlineId||B.status==="live"&&c.isHidden||B.status==="hidden"&&!c.isHidden)return!1;const u=((m=(p=Be(c.flightDate))==null?void 0:p.getTime)==null?void 0:m.call(p))||null;return a!==null&&(u===null||u<a)||i!==null&&(u===null||u>i)?!1:s?[c.id,Ne(c.flightDate),c.flightTime,c.specialRate,c.finalRate,c.commission,c.baggage,c.extraBaggage,c.isHidden?"hidden":"live",c.agentId,c.sectorId,c.airlineId,e[c.agentId]||"",t[c.sectorId]||"",n[c.airlineId]||""].join(" ").toLowerCase().includes(s):!0}),{key:r,asc:d}=te.databaseFares;return l.sort((c,u)=>{const o=g=>{var y,w;return r==="agentId"?(e[g.agentId]||g.agentId||"").toLowerCase():r==="sectorId"?(t[g.sectorId]||g.sectorId||"").toLowerCase():r==="airlineId"?(n[g.airlineId]||g.airlineId||"").toLowerCase():r==="flightDate"?((w=(y=Be(g.flightDate))==null?void 0:y.getTime)==null?void 0:w.call(y))||0:r==="isHidden"?g.isHidden?1:0:g[r]};let p=o(c),m=o(u);return typeof p=="string"&&(p=p.toLowerCase()),typeof m=="string"&&(m=m.toLowerCase()),p<m?d?-1:1:p>m?d?1:-1:0})}function q(){const e=document.getElementById("database-table-wrap");if(!e)return;const t=mn(),n=document.getElementById("database-total-count");n&&(n.textContent=t.length.toLocaleString());const s=ne.databaseFares,a=Math.max(1,Math.ceil(t.length/s));I.databaseFares>a&&(I.databaseFares=a);const i=(I.databaseFares-1)*s,l=t.slice(i,i+s);if(!l.length){e.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-database"></i>
        </div>
        <p class="admin-empty-state-title">No fares matched your filter</p>
      </div>
    </div>`,$e("databaseFares",t.length,a,i,s),Se();return}const r=(p,m)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="databaseFares" data-sort-key="${p}">
      ${m} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i>
    </th>`,d=p=>G.map(m=>`<option value="${T(m.id)}" ${m.id===p?"selected":""}>${T(m.id)} · ${T(m.name||"Unnamed")}</option>`).join(""),c=p=>F.map(m=>`<option value="${T(m.id)}" ${m.id===p?"selected":""}>${T(m.sectorCode||m.id)}</option>`).join(""),u=p=>U.map(m=>`<option value="${T(m.id)}" ${m.id===p?"selected":""}>${T(m.code||"—")} · ${T(m.name||"Unnamed")}</option>`).join(""),o=l.length>0&&l.every(p=>K.has(p.id));e.innerHTML=`
    <table class="admin-database-table">
      <thead>
        <tr>
          <th class="w-[36px] text-center"><input id="database-select-all" type="checkbox" ${o?"checked":""}></th>
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
        ${l.map((p,m)=>{const g=!!W[p.id],y=K.has(p.id);return`
            <tr data-fare-id="${p.id}" class="${g?"admin-database-row-dirty":""}">
              <td class="text-center">
                <input type="checkbox" data-db-select="${p.id}" ${y?"checked":""}>
              </td>
              <td class="font-mono text-[11px] text-text-soft">${i+m+1}</td>
              <td>
                <input type="date" data-db-field="flightDate" class="db-cell-input" value="${Ne(p.flightDate)}">
              </td>
              <td>
                <input type="text" data-db-field="flightTime" class="db-cell-input min-w-[128px]" value="${T(p.flightTime||"")}" placeholder="04:05 - 11:10">
              </td>
              <td>
                <select data-db-field="agentId" class="db-cell-select min-w-[180px]">
                  <option value="">Select Agent</option>
                  ${d(p.agentId)}
                </select>
              </td>
              <td>
                <select data-db-field="sectorId" class="db-cell-select min-w-[140px]">
                  <option value="">Select Sector</option>
                  ${c(p.sectorId)}
                </select>
              </td>
              <td>
                <select data-db-field="airlineId" class="db-cell-select min-w-[170px]">
                  <option value="">No Airline</option>
                  ${u(p.airlineId)}
                </select>
              </td>
              <td>
                <input type="number" data-db-field="specialRate" class="db-cell-input db-cell-num" value="${D(p.specialRate,0)}" min="0" step="1">
              </td>
              <td>
                <input type="number" data-db-field="finalRate" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${D(p.finalRate,0)}" min="0" step="1" readonly tabindex="-1">
              </td>
              <td>
                <input type="number" data-db-field="commission" class="db-cell-input db-cell-num" value="${D(p.commission,0)}" min="0" step="1">
              </td>
              <td>
                <select data-db-field="baggage" class="db-cell-select min-w-[110px]">
                  ${we(Ae,le(p.baggage))}
                </select>
              </td>
              <td>
                <select data-db-field="extraBaggage" class="db-cell-select min-w-[110px]">
                  ${we(Ae,D(p.extraBaggage,0))}
                </select>
              </td>
              <td>
                <select data-db-field="isHidden" class="db-cell-select min-w-[94px]">
                  <option value="live" ${p.isHidden?"":"selected"}>Live</option>
                  <option value="hidden" ${p.isHidden?"selected":""}>Hidden</option>
                </select>
              </td>
              <td>
                <div class="flex gap-1">
                  <button data-db-action="save" data-id="${p.id}" class="admin-action-btn admin-action-edit" ${g?"":"disabled"}><i class="bi bi-check2-circle"></i>Save</button>
                  <button data-db-action="reset" data-id="${p.id}" class="admin-action-btn admin-action-toggle" ${g?"":"disabled"}><i class="bi bi-arrow-counterclockwise"></i>Reset</button>
                  <button data-db-action="delete" data-id="${p.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
                </div>
              </td>
            </tr>
          `}).join("")}
      </tbody>
    </table>
  `,$e("databaseFares",t.length,a,i,s),De("databaseFares"),Se()}async function yt(e,{silent:t=!1}={}){const n=Z.find(u=>u.id===e);if(!n)return!1;if(!W[e])return!0;const a=ht(n),i=Be(a.flightDate);if(!a.agentId)return t||x("warning","Missing Agent","Please select an agent before saving."),!1;if(!a.sectorId)return t||x("warning","Missing Sector","Please select a sector before saving."),!1;if(!i)return t||x("warning","Missing Date","Please set a valid flight date before saving."),!1;const l=D(a.specialRate,0),r=Math.max(0,D(a.commission,0)),d=Te(l,r),c={agentId:a.agentId,sectorId:a.sectorId,airlineId:a.airlineId||"",flightDate:i,flightTime:a.flightTime||"",specialRate:l,finalRate:d,commission:r,baggage:le(a.baggage),extraBaggage:D(a.extraBaggage,0),isHidden:a.isHidden===!0};try{return await ot(e,c),Z=Z.map(u=>u.id===e?{...u,...c}:u),delete W[e],t||x("success","Saved","Fare row updated."),!0}catch(u){return t||x("error","Save Failed",u.message),!1}}async function un(){const e=Object.keys(W);if(!e.length)return;const t=document.getElementById("database-save-all-btn"),n=t==null?void 0:t.innerHTML;t&&(t.disabled=!0,t.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Saving...');let s=0,a=0;for(const i of e)await yt(i,{silent:!0})?s+=1:a+=1;q(),t&&(t.disabled=ft()===0,t.innerHTML=n||"Save All"),a===0?x("success","Saved",`${s} row${s!==1?"s":""} updated.`):x("warning","Partial Save",`${s} saved, ${a} failed. Fix invalid rows and retry.`)}async function pn(){const e=Array.from(K);if(!e.length||!confirm(`Delete ${e.length} selected fare row${e.length!==1?"s":""}? This cannot be undone.`))return;const t=document.getElementById("database-delete-selected-btn"),n=t==null?void 0:t.innerHTML;t&&(t.disabled=!0,t.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Deleting...');const s=await Promise.allSettled(e.map(l=>ze(l))),a=[];let i=0;if(s.forEach((l,r)=>{l.status==="fulfilled"?a.push(e[r]):i+=1}),a.length){const l=new Set(a);Z=Z.filter(r=>!l.has(r.id)),a.forEach(r=>{delete W[r],K.delete(r)})}q(),t&&(t.innerHTML=n||"Delete Selected"),i===0?x("success","Deleted",`${a.length} row${a.length!==1?"s":""} deleted.`):x("warning","Partial Delete",`${a.length} deleted, ${i} failed.`)}function gn(){const e=Ne(new Date);je("Add Fare Row",`
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
            ${G.map(l=>`<option value="${T(l.id)}">${T(l.id)} · ${T(l.name||"Unnamed")}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Sector *</label>
          <select id="db-add-sector" class="admin-control h-10" required>
            <option value="">Select Sector</option>
            ${F.map(l=>`<option value="${T(l.id)}">${T(l.sectorCode||l.id)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Airline</label>
          <select id="db-add-airline" class="admin-control h-10">
            <option value="">No Airline</option>
            ${U.map(l=>`<option value="${T(l.id)}">${T(l.code||"—")} · ${T(l.name||"Unnamed")}</option>`).join("")}
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
          <select id="db-add-bag" class="admin-control h-10">
            ${we(Ae,30)}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Extra Baggage (kg)</label>
          <select id="db-add-exbag" class="admin-control h-10">
            ${we(Ae,0)}
          </select>
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
  `);const t=document.getElementById("database-add-form");if(!t)return;const n=document.getElementById("db-add-sp"),s=document.getElementById("db-add-comm"),a=document.getElementById("db-add-rate"),i=()=>{if(!a)return;const l=D(n==null?void 0:n.value,0),r=Math.max(0,D(s==null?void 0:s.value,0));a.value=String(Te(l,r))};n==null||n.addEventListener("input",i),s==null||s.addEventListener("input",i),i(),t.addEventListener("submit",async l=>{var c,u,o,p,m,g,y,w,E,S,f,h;l.preventDefault();const r=t.querySelector('button[type="submit"]'),d=(r==null?void 0:r.textContent)||"Add Fare";r&&(r.disabled=!0,r.textContent="Adding...");try{const v=((c=document.getElementById("db-add-date"))==null?void 0:c.value)||"",k=lt(v);if(!k)throw new Error("Please provide a valid flight date.");const P=D((u=document.getElementById("db-add-sp"))==null?void 0:u.value,0),z=Math.max(0,D((o=document.getElementById("db-add-comm"))==null?void 0:o.value,0)),Y=Te(P,z);await Ht({agentId:((p=document.getElementById("db-add-agent"))==null?void 0:p.value)||"",sectorId:((m=document.getElementById("db-add-sector"))==null?void 0:m.value)||"",airlineId:((g=document.getElementById("db-add-airline"))==null?void 0:g.value)||"",flightDate:k,flightTime:((w=(y=document.getElementById("db-add-time"))==null?void 0:y.value)==null?void 0:w.trim())||"",specialRate:P,finalRate:Y,commission:z,baggage:le((E=document.getElementById("db-add-bag"))==null?void 0:E.value),extraBaggage:D((S=document.getElementById("db-add-exbag"))==null?void 0:S.value,0),isHidden:(((f=document.getElementById("db-add-status"))==null?void 0:f.value)||"live")==="hidden"}),(h=document.getElementById("admin-modal"))==null||h.close(),await Ye(!0),x("success","Added","New fare row added.")}catch(v){x("error","Add Failed",v.message),r&&(r.disabled=!1,r.textContent=d)}})}const fn="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",bn={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},at=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let V=null,re=JSON.parse(localStorage.getItem("zt_hist")||"[]"),Xe=re.reduce((e,t)=>e+(t.rows||0),0);function hn(){var t,n,s,a;const e=document.getElementById("rateData");e&&e.addEventListener("input",function(){const i=this.value.length,l=document.getElementById("charCount");l&&(l.textContent=i.toLocaleString()+" character"+(i!==1?"s":"")),de(),clearTimeout(window._previewTimer),i>15?window._previewTimer=setTimeout(()=>xn(this.value),500):Me()}),(t=document.getElementById("resetBtn"))==null||t.addEventListener("click",()=>{e&&(e.value="");const i=document.getElementById("charCount");i&&(i.textContent="0 characters"),Me(),de()}),(n=document.getElementById("clearBtn"))==null||n.addEventListener("click",()=>{re=[],Xe=0,Re(),Ce(),_e()}),(s=document.getElementById("manualAgent"))==null||s.addEventListener("input",function(){const i=parseInt(this.value);V=i>0?String(i):null,document.querySelectorAll(".rp-chip").forEach(l=>l.classList.remove("on")),ke(),de()}),(a=document.getElementById("submitBtn"))==null||a.addEventListener("click",vn),_e(),Ce()}function xt(){const e=document.getElementById("chipGrid");if(!e)return;e.innerHTML="";const t=G.length?[...G].sort((n,s)=>{const a=parseInt(n.id),i=parseInt(s.id);return!isNaN(a)&&!isNaN(i)?a-i:n.id.localeCompare(s.id)}):[];if(!t.length){V=null,e.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>',ke(),de();return}V&&!t.some(n=>n.id===V)&&(V=null),t.forEach(n=>{const s=document.createElement("div");s.className="rp-chip",s.dataset.agentId=n.id,s.textContent=n.id,n.id===V&&s.classList.add("on"),s.addEventListener("click",()=>yn(n.id,n.name,s)),e.appendChild(s)}),ke(),de()}function yn(e,t,n){V=e,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(s=>{s.classList.remove("on")}),n&&n.classList.add("on"),ke(),de()}function ke(){const e=document.getElementById("agentPill");if(e)if(V){const t=G.find(n=>n.id===V);e.textContent=`Agent ${(t==null?void 0:t.id)||V} selected ✓`,e.classList.remove("empty")}else e.textContent="No agent selected",e.classList.add("empty")}function de(){const e=document.getElementById("rateData"),t=document.getElementById("submitBtn");t&&(t.disabled=!(V&&e&&e.value.trim().length>10))}function vt(e){const t=[];let n=null,s="IX";for(const a of e.split(`
`)){const i=a.replace(/[*_~`]/g,"").trim();if(!i)continue;const l=i.match(/([A-Z]{3})\s+([A-Z]{3})/);if(l&&i.length<70&&!i.match(/\d{4,6}/)){n=l[1]+"-"+l[2];const r=i.match(at);r&&(s=r[1]);continue}if(n){const r=i.match(at);if(r&&!i.match(/\d{4,6}/)){s=r[1];continue}const d=i.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(d){const c=parseInt(d[3]);c>=1e3&&c<=99999&&t.push({sector:n,date:`2026-${bn[d[2].toUpperCase()]}-${d[1].padStart(2,"0")}`,airline:r?r[1]:s,rate:c})}}}return t}function xn(e){const t=vt(e);if(!t.length){Me();return}const n=document.getElementById("prevBox");n&&n.classList.add("on");const s=document.getElementById("prevCount");s&&(s.textContent=t.length+" entr"+(t.length===1?"y":"ies"));const a=document.getElementById("prevBody");a&&(a.innerHTML=t.slice(0,60).map(i=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${i.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${i.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${i.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${i.rate.toLocaleString()}</td></tr>`).join(""),t.length>60&&(a.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${t.length-60} more</td></tr>`))}function Me(){var e;(e=document.getElementById("prevBox"))==null||e.classList.remove("on")}async function vn(){const e=document.getElementById("rateData");if(!V||!(e!=null&&e.value.trim()))return;const t=document.getElementById("submitBtn"),n=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI...';const s=document.getElementById("progBar"),a=document.getElementById("progFill");s&&s.classList.add("on");let i=0;const l=setInterval(()=>{i=Math.min(i+Math.random()*13,85),a&&(a.style.width=i+"%")},280),r=vt(e.value),d={id:Date.now(),agent:V,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:r.length,status:"pen"};re.unshift(d),re.length>15&&re.pop(),Re(),Ce();try{const c=await fetch(fn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:V,raw_text:e.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(l),a&&(a.style.width="100%"),c.ok)d.status="ok",Xe+=r.length,Re(),Ce(),_e(),x("success","Submitted","Rates dispatched to AI Agent. The database will reflect parsing results momentarily."),setTimeout(()=>{e.value="";const u=document.getElementById("charCount");u&&(u.textContent="0 characters"),Me(),de()},500);else throw new Error("N8N webhook rejected payload")}catch(c){clearInterval(l),a&&(a.style.width="100%"),d.status="err",Re(),Ce(),x("error","Submission Failed",c.message)}setTimeout(()=>{s&&s.classList.remove("on"),a&&(a.style.width="0%"),t.innerHTML=n,de()},900)}function _e(){const e=document.getElementById("statSubs");e&&(e.textContent=re.length);const t=document.getElementById("statEntries");t&&(t.textContent=Xe)}function Re(){localStorage.setItem("zt_hist",JSON.stringify(re))}function Ce(){const e=document.getElementById("historyWrap");if(e){if(!re.length){e.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}e.innerHTML=re.map(t=>{var s;const n=((s=G.find(a=>a.id===t.agent))==null?void 0:s.name)||`Agent ${t.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${n.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${n}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${t.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${t.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${t.status==="ok"?"bg-green-500":t.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}const wn=210/25.4*96,$n=297/25.4*96;function st(){const e=document.getElementById("eticket-output-wrapper"),t=document.getElementById("eticket-print-area");if(!e||!t||e.classList.contains("hidden"))return;t.style.zoom="1",t.style.removeProperty("--eticket-print-scale");const n=Math.max(t.scrollWidth,t.offsetWidth),s=Math.max(t.scrollHeight,t.offsetHeight);if(!n||!s)return;const a=wn/n,i=$n/s;let l=Math.min(1,a,i);l<1&&(l=Math.max(.7,l*.985)),t.style.zoom=String(l),t.style.setProperty("--eticket-print-scale",String(l))}function En(){const e=document.getElementById("eticket-print-area");e&&(e.style.zoom="1",e.style.removeProperty("--eticket-print-scale"))}async function In(){var r;const e=document.getElementById("eticket-tab");if(!e)return;const t=document.getElementById("eticket-form"),n=document.getElementById("et-add-passenger"),s=document.getElementById("et-passengers-container"),a=document.getElementById("et-airline"),i=document.getElementById("et-origin"),l=document.getElementById("et-destination");if(U.length===0&&(U=await We()),F.length===0&&(F=Ve(await Ge())),!e.dataset.wired){if(e.dataset.wired="1",a&&U&&(a.innerHTML='<option value="">Select Airline</option>'+U.map(c=>`<option value="${c.name}">${c.name}</option>`).join("")),i&&F){const c=[...new Set(F.map(u=>u.sectorFrom).filter(Boolean))].sort();i.innerHTML='<option value="">Select Origin</option>'+c.map(u=>`<option value="${u}">${u}</option>`).join("")}if(l&&F){const c=[...new Set(F.map(u=>u.sectorTo).filter(Boolean))].sort();l.innerHTML='<option value="">Select Destination</option>'+c.map(u=>`<option value="${u}">${u}</option>`).join("")}const d=()=>{const c=Array.from(s.querySelectorAll(".et-pax-row"));c.forEach((u,o)=>{const p=u.querySelector(".et-passenger-index");p&&(p.textContent=`Passenger ${o+1}`);const m=u.querySelector(".et-remove-passenger");m&&(c.length<=1?(m.classList.add("opacity-40","pointer-events-none"),m.setAttribute("aria-disabled","true")):(m.classList.remove("opacity-40","pointer-events-none"),m.removeAttribute("aria-disabled")))})};n==null||n.addEventListener("click",()=>{const c=`
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
                ${we(Pt,7)}
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Check-in Bag</label>
              <select name="paxCheckBag[]" class="admin-control h-10">
                ${we(Ae,30)}
              </select>
            </div>
          </div>
        </div>
      `;s.insertAdjacentHTML("beforeend",c),d()}),s==null||s.addEventListener("click",c=>{var o;const u=c.target.closest(".et-remove-passenger");u&&((o=u.closest(".et-pax-row"))==null||o.remove(),d())}),s.children.length===0&&(n==null||n.click()),d(),t==null||t.addEventListener("submit",async c=>{c.preventDefault(),await Sn(new FormData(t))}),(r=document.getElementById("et-print-btn"))==null||r.addEventListener("click",()=>{st(),requestAnimationFrame(()=>window.print())}),window.addEventListener("beforeprint",st),window.addEventListener("afterprint",En),t==null||t.addEventListener("reset",()=>{setTimeout(()=>{var c;Array.from(s.children).forEach((u,o)=>{o>0&&u.remove()}),s.children.length===0&&(n==null||n.click()),d(),(c=document.getElementById("eticket-output-wrapper"))==null||c.classList.add("hidden")},10),x("info","Form Reset","The E-Ticket form has been cleared.")})}}async function Sn(e){var Ie,O,M;const t=(Ie=e.get("etPnr"))==null?void 0:Ie.toUpperCase(),n=(O=e.get("etAirline"))==null?void 0:O.toUpperCase(),s=(M=e.get("etFlightNo"))==null?void 0:M.toUpperCase(),a=e.get("etDate"),i=e.get("etDepTime"),l=e.get("etArrTime"),r=e.get("etPhone"),d=($="")=>String($).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),c=$=>{const H=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec($||"");return H?Number(H[1])*60+Number(H[2]):null},u=($="")=>$.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",o=$=>{const H=($||"").trim();let N=H,he="";const J=H.match(/^(.*?)\s*\((.*?)\)$/);return J&&(N=J[1].trim(),he=J[2].trim()),{city:N,code:he}},p=o(e.get("etOrigin")),m=o(e.get("etDest")),g=e.get("etOrigin")||"—",y=e.get("etDest")||"—";let w="—";if(a){const $=new Date(a);if(!isNaN($.getTime())){const H=["SUN","MON","TUE","WED","THU","FRI","SAT"],N=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];w=`${H[$.getDay()]}, ${String($.getDate()).padStart(2,"0")} ${N[$.getMonth()]} ${$.getFullYear()}`}}const E=$=>document.getElementById($);let S=p.code,f=m.code,h=null;if(typeof F<"u"){if(h=F.find($=>$.sectorFrom===g&&$.sectorTo===y),!h&&g){const $=F.find(H=>H.sectorFrom===g);$&&$.sectorCode&&(S=$.sectorCode.split(/[ -]+/)[0])}if(!h&&y){const $=F.find(H=>H.sectorTo===y);$&&$.sectorCode&&(f=$.sectorCode.split(/[ -]+/).pop())}}const v=(S||u(p.city)).toUpperCase(),k=(f||u(m.city)).toUpperCase(),P=`${v} - ${k}`,z=`${(p.city||g).toUpperCase()} to ${(m.city||y).toUpperCase()}`,Y=(p.city||g).toUpperCase(),ae=(m.city||y).toUpperCase(),se=c(i),ce=c(l);let me="N/A";if(se!==null&&ce!==null){let $=ce-se;$<0&&($+=24*60);const H=Math.floor($/60),N=$%60;me=`${H}h ${String(N).padStart(2,"0")}m`}E("t-pnr")&&(E("t-pnr").textContent=t||"—"),E("t-issued-by")&&(E("t-issued-by").textContent=n||"—"),E("t-customer-phone")&&(E("t-customer-phone").textContent=r||"—"),E("t-flight-code")&&(E("t-flight-code").textContent=s||"—"),E("t-travel-date")&&(E("t-travel-date").textContent=w||"—"),E("t-route-code")&&(E("t-route-code").textContent=P),E("t-route-long")&&(E("t-route-long").textContent=z),E("t-duration")&&(E("t-duration").textContent=me);const b=new Date,C=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],A=`${String(b.getDate()).padStart(2,"0")} ${C[b.getMonth()]} ${b.getFullYear()} ${String(b.getHours()).padStart(2,"0")}:${String(b.getMinutes()).padStart(2,"0")}`;E("t-booked-on")&&(E("t-booked-on").textContent=A);const R=E("t-airline-logo"),L=E("t-issued-by-fallback");if(R){const $=typeof U<"u"?U.find(H=>H.name.toUpperCase()===n):null;$&&$.logoUrl?(R.src=$.logoUrl,R.classList.remove("hidden"),L&&L.classList.add("hidden")):(R.removeAttribute("src"),R.classList.add("hidden"),L&&(L.classList.remove("hidden"),L.textContent=(n||"No logo").toUpperCase()))}const Ee=e.getAll("paxTitle[]"),X=e.getAll("paxName[]"),fe=e.getAll("paxType[]"),ue=e.getAll("paxCheckBag[]"),Q=e.getAll("paxCarryBag[]");E("t-pax-count")&&(E("t-pax-count").textContent=String(X.length));const _=document.getElementById("t-passengers-tbody");if(_){const $=X.map((H,N)=>{const he=d((Ee[N]||"MR").toUpperCase()),J=d((X[N]||"").toUpperCase()),Ue=d((fe[N]||"ADT").toUpperCase()),Fe=d(tt(ue[N])),ye=d(tt(Q[N])),xe=h&&h.sectorCode?d(h.sectorCode.toUpperCase()):d(P);return`
        <tr class="${N%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${N+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${he}. ${J}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Ue}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${xe}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${d(s||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${d(t||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${ye}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Fe}</td>
        </tr>
      `}).join("");_.innerHTML=$||`
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `}const ee=document.getElementById("t-travel-tbody");ee&&(ee.innerHTML=`
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${d(s||"—")}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${d(Y)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${d(v)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${d(i||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${d(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${d(ae)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${d(k)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${d(l||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${d(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const be=document.getElementById("eticket-output-wrapper");be&&(be.classList.remove("hidden"),be.scrollIntoView({behavior:"smooth"}))}const it={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function x(e,t,n){const s=document.getElementById("toastsEl");if(!s)return;const a=document.createElement("div"),i={success:"border-emerald-200 bg-emerald-50/95 text-emerald-900",error:"border-rose-200 bg-rose-50/95 text-rose-900",warning:"border-amber-200 bg-amber-50/95 text-amber-900",info:"border-blue-200 bg-blue-50/95 text-blue-900"};a.className=`flex items-start gap-3 p-4 border rounded-xl shadow-md w-80 pointer-events-auto backdrop-blur-sm ${i[e]||i.error}`,a.innerHTML=`<div class="mt-0.5">${it[e]||it.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${t}</div><div class="text-xs opacity-90 mt-1">${n}</div></div>
    <button class="opacity-50 hover:opacity-100 transition-opacity" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,s.appendChild(a),setTimeout(()=>a.isConnected&&a.remove(),7e3)}window.toast=x;document.addEventListener("DOMContentLoaded",()=>{});
