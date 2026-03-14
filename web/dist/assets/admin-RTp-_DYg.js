import"./firebase-config-DOwAESyl.js";import{o as Et,l as It}from"./auth-DtGgaMUX.js";import{a as He,d as Ge,u as rt,c as dt,e as St,f as Ct,h as At,i as Bt,g as We,j as Lt,k as Tt,l as kt,m as Dt,b as Ve,n as Ft,o as Rt,p as Mt,q as Ht,r as Nt}from"./db-DZVTNuCV.js";async function Pt(e,t,n,i,a){const s=`Generating ${e} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",s),new Promise(async(c,d)=>{try{let ce=function(b,C,A,R,L){r.beginPath(),r.moveTo(b+L,C),r.lineTo(b+A-L,C),r.arcTo(b+A,C,b+A,C+L,L),r.lineTo(b+A,C+R-L),r.arcTo(b+A,C+R,b+A-L,C+R,L),r.lineTo(b+L,C+R),r.arcTo(b,C+R,b,C+R-L,L),r.lineTo(b,C+L),r.arcTo(b,C,b+L,C,L),r.closePath()},me=function(b){var Ie;const C=b-K;if(C>X){try{G.stop()}catch(O){console.error("Error stopping recorder",O)}return}r.fillStyle="#f8fafc",r.fillRect(0,0,o,l);const A=e==="9x16"?400:300;if(r.fillStyle="#1e293b",r.fillRect(0,0,o,A),S.complete&&S.width>0){r.globalAlpha=.2;const O=Math.max(o/S.width,A/S.height),M=S.width*O,$=S.height*O,H=(o-M)/2,P=(A-$)/2;r.drawImage(S,H,P,M,$),r.globalAlpha=1}const R=r.createLinearGradient(0,0,0,A);R.addColorStop(0,"#1e293b"),R.addColorStop(1,"transparent"),r.fillStyle=R,r.globalAlpha=.8,r.fillRect(0,0,o,A),r.globalAlpha=1,r.textAlign="center",r.textBaseline="middle";const L=r.createLinearGradient(0,0,o,0);L.addColorStop(0,"#2563eb"),L.addColorStop(.5,"#60a5fa"),L.addColorStop(1,"#1558c0"),r.fillStyle=L,r.fillRect(0,0,o,16);const Ee=200,Z=40,fe=60;r.fillStyle="rgba(37, 99, 235, 0.4)",ce(o/2-Ee/2,fe,Ee,Z,20),r.fill(),r.strokeStyle="rgba(37, 99, 235, 0.6)",r.lineWidth=1,r.stroke(),r.fillStyle="#bfdbfe",r.font="bold 16px Arial, sans-serif",r.fillText("EXCLUSIVE DEALS",o/2,fe+Z/2),r.fillStyle="#ffffff",r.font="900 "+(e==="16x9"?"70px":"56px")+" Arial, sans-serif",r.fillText(`${m} → ${p}`,o/2,fe+80),r.fillStyle="#dbeafe",r.font="700 24px Arial, sans-serif",r.fillText("SPECIAL FARES AVAILABLE NOW",o/2,fe+140);const ue=A+60,te=90,_=e==="9x16"?40:e==="1x1"?80:160,ne=o-_*2;r.fillStyle="#64748b",r.font="bold 18px Arial, sans-serif",r.textAlign="left",r.fillText("DATE",_+20,ue-20),r.textAlign="center",r.fillText("AIRLINE",_+ne*.35,ue-20),r.fillText("TIME",_+ne*.65,ue-20),r.textAlign="right",r.fillText("FARE",_+ne-20,ue-20);for(let O=0;O<y.length;O++){const M=y[O],$=1e3+O*800;if(C<$)continue;const P=Math.min(1,(C-$)/500),he=20*(1-P),Y=ue+O*te+he;r.globalAlpha=P,O%2===0&&(r.fillStyle="#ffffff",ce(_,Y,ne,te-10,12),r.fill()),r.fillStyle="#0f172a",r.textBaseline="middle";const Ue=M.flightDate instanceof Date?M.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():M.flightDate;r.textAlign="left",r.font="900 26px Arial, sans-serif",r.fillText(Ue,_+20,Y+te/2-5);const Fe=_+ne*.35,ye=h[M.airlineId];if(ye&&ye.width>0){const ge=Math.min(100,ye.width),tt=40;r.drawImage(ye,Fe-ge/2,Y+te/2-5-tt/2,ge,tt)}else{r.font="700 20px Arial, sans-serif",r.textAlign="center";const ge=((Ie=v[M.airlineId])==null?void 0:Ie.name)||M.airlineId||"—";r.fillText(ge,Fe,Y+te/2-5)}let xe=M.flightTime||"—";if(xe.includes("-")){const ge=xe.split("-");xe=`${ge[0].trim()} - ${ge[1].trim()}`}r.font="800 22px Arial, sans-serif",r.textAlign="center",r.fillText(xe,_+ne*.65,Y+te/2-5);const Oe=`₹${(M.finalRate||0).toLocaleString()}`;r.font="900 26px Arial, sans-serif",r.textAlign="right";const $t=r.measureText(Oe).width,Ze=_+ne-20,Qe=$t+40,et=50;r.fillStyle="#0f172a",ce(Ze-Qe,Y+te/2-5-et/2,Qe,et,12),r.fill(),r.fillStyle="#ffffff",r.fillText(Oe,Ze-20,Y+te/2-5),r.globalAlpha=1}const be=1e3+y.length*800+500;if(C>be){const O=Math.min(1,(C-be)/500);r.globalAlpha=O;const M=100,$=l-M+20*(1-O);r.fillStyle="#ffffff",r.fillRect(0,l-M,o,M),r.fillRect(0,$,o,M),r.fillStyle="#f1f5f9",r.fillRect(0,l-M,o,2),f.complete&&f.width>0&&r.drawImage(f,_,l-M/2-24,48,48),r.fillStyle="#1e293b",r.font="900 24px Arial, sans-serif",r.textAlign="left",r.textBaseline="middle",r.fillText("Zamra Travels",_+64,l-M/2),r.font="700 20px Arial, sans-serif",r.textAlign="right",r.fillText("zamratravels.com  |  +91 98765 43210",o-_,l-M/2),r.globalAlpha=1}requestAnimationFrame(me)},o,l;if(e==="1x1")o=1080,l=1080;else if(e==="9x16")o=1080,l=1920;else if(e==="16x9")o=1920,l=1080;else throw new Error("Invalid ratio selected");const u=document.createElement("canvas");u.width=o,u.height=l;const r=u.getContext("2d");r.imageSmoothingEnabled=!0;const g=i.find(b=>b.id===n),m=g?(g.sectorFrom||"DEP").toUpperCase():"DEP",p=g?(g.sectorTo||"ARR").toUpperCase():"ARR",y=[...t].sort((b,C)=>{let A=b.flightDate,R=C.flightDate;return A instanceof Date&&(A=A.getTime()),R instanceof Date&&(R=R.getTime()),A-R}).slice(0,10),v={};a.forEach(b=>{b.id&&(v[b.id]=b),b.code&&(v[b.code]=b),b.name&&(v[b.name]=b)});async function E(b){if(!b)return null;try{const C=await fetch(b);if(!C.ok)return null;const A=await C.blob(),R=URL.createObjectURL(A);return new Promise((L,Ee)=>{const Z=new Image;Z.onload=()=>L(Z),Z.onerror=()=>L(null),Z.src=R})}catch{return null}}const S=new Image;await new Promise(b=>{S.onload=b,S.onerror=b,S.src="/assets/img/hero-bg.webp"});const f=new Image;await new Promise(b=>{f.onload=b,f.onerror=b,f.src="/assets/img/logo.webp"});const h={},w=[...new Set(y.map(b=>b.airlineId))].map(b=>v[b]).filter(b=>b==null?void 0:b.logoUrl);await Promise.all(w.map(async b=>{const C=await E(b.logoUrl);C&&(h[b.id]=C)}));const k=u.captureStream(30);let N="video/mp4";MediaRecorder.isTypeSupported(N)||(N="video/webm; codecs=h264",MediaRecorder.isTypeSupported(N)||(N="video/webm"));const G=new MediaRecorder(k,{mimeType:N}),J=[];G.ondataavailable=b=>{b.data&&b.data.size>0&&J.push(b.data)},G.start(100);const X=1e4+y.length*1500,K=performance.now();requestAnimationFrame(me),G.onstop=()=>{const b=new Blob(J,{type:N}),C=URL.createObjectURL(b),A=document.createElement("a");A.href=C,A.download=`zamra-video-${e}-${Date.now()}.mp4`,A.style.display="none",document.body.appendChild(A),A.click(),setTimeout(()=>{document.body.removeChild(A),URL.revokeObjectURL(C)},100),window.toast&&window.toast("success","Video Generated",`Your ${e} video has been downloaded!`),c()},G.onerror=b=>{console.error("Recorder Error:",b),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),d(b)}}catch(o){console.error(o),window.toast&&window.toast("error","Generation Failed",o.message),d(o)}})}let z=[],F=[],U=[],j=[],ee=[],W={},Q=new Set;function ve(e){return e==null?e:String(e).replace(/damamm/gi,t=>t===t.toUpperCase()?"DAMMAM":t===t.toLowerCase()?"dammam":"Dammam")}function lt(e={}){return{...e,sectorFrom:ve(e.sectorFrom||""),sectorTo:ve(e.sectorTo||""),sectorCode:ve(e.sectorCode||"")}}function Je(e=[]){return e.map(t=>lt(t))}function T(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function D(e,t=0){const n=Number(e);return Number.isFinite(n)?n:t}const jt=[5,7,10],Ae=[20,25,30,35,40];function we(e=[],t=0){const n=Math.max(0,le(t)),i=[...new Set(e.map(s=>Math.max(0,le(s))))].filter(s=>s>0).sort((s,c)=>s-c);if(!i.length)return"";const a=i.includes(n)?n:i[0];return i.map(s=>`<option value="${s}" ${s===a?"selected":""}>${s} Kg</option>`).join("")}function le(e){if(e==null||e==="")return 0;const t=parseFloat(String(e).replace(/[^\d.]/g,""));return Number.isFinite(t)?t:0}function nt(e,t="—"){if(e==null||e==="")return t;const n=String(e).trim();return n?/^\d+(\.\d+)?(\s*kg)?$/i.test(n)?`${le(n)} Kg`:n.toUpperCase():t}function Be(e){if(!e)return null;if(e instanceof Date)return Number.isNaN(e.getTime())?null:e;const t=new Date(e);return Number.isNaN(t.getTime())?null:t}function Ne(e){const t=Be(e);if(!t)return"";const n=t.getTimezoneOffset();return new Date(t.getTime()-n*60*1e3).toISOString().split("T")[0]}function ct(e){if(!e)return null;const t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?null:t}function Ut(e){if(!e)return null;const t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?null:t.getTime()}function Ot(e){if(!e)return null;const t=new Date(`${e}T23:59:59.999`);return Number.isNaN(t.getTime())?null:t.getTime()}let ae={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},reportFares:{key:"flightDate",asc:!0},databaseFares:{key:"flightDate",asc:!0}},Pe={agents:"",sectors:"",airlines:""},se={agents:10,sectors:10,airlines:10,reportFares:20,databaseFares:20},I={agents:1,sectors:1,airlines:1,reportFares:1,databaseFares:1};const B={search:"",agentId:"all",sectorId:"all",airlineId:"all",status:"all",startDate:"",endDate:""};function Ye(e,t){var c;let n=e;const i=(c=Pe[t])==null?void 0:c.toLowerCase();i&&t==="agents"?n=n.filter(d=>(d.name||"").toLowerCase().includes(i)||(d.email||"").toLowerCase().includes(i)||(d.contactPhone||"").toLowerCase().includes(i)||(d.id||"").toLowerCase().includes(i)):i&&t==="sectors"?n=n.filter(d=>(d.sectorFrom||"").toLowerCase().includes(i)||(d.sectorTo||"").toLowerCase().includes(i)||(d.sectorCode||"").toLowerCase().includes(i)):i&&t==="airlines"&&(n=n.filter(d=>(d.name||"").toLowerCase().includes(i)||(d.code||"").toLowerCase().includes(i)));const{key:a,asc:s}=ae[t];return a&&(n=[...n].sort((d,o)=>{let l=d[a],u=o[a];if(l instanceof Date&&(l=l.getTime()),u instanceof Date&&(u=u.getTime()),a==="id"){const r=parseInt(l),g=parseInt(u);if(!isNaN(r)&&!isNaN(g))return s?r-g:g-r}return typeof l=="string"&&(l=l.toLowerCase()),typeof u=="string"&&(u=u.toLowerCase()),l<u?s?-1:1:l>u?s?1:-1:0})),n}function De(e){document.querySelectorAll(`th[data-sort-tab="${e}"] i`).forEach(n=>{n.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const t=document.querySelector(`th[data-sort-tab="${e}"][data-sort-key="${ae[e].key}"]`);if(t){const n=t.querySelector("i");n&&(n.className=`bi bi-arrow-${ae[e].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",e=>{const t=e.target.closest("th[data-sort-tab]");if(!t)return;const n=t.dataset.sortTab,i=t.dataset.sortKey;ae[n].key===i?ae[n].asc=!ae[n].asc:(ae[n].key=i,ae[n].asc=!0),n==="agents"?ie(!1):n==="sectors"?oe(!1):n==="airlines"?pe(!1):n==="reportFares"&&j.length?Le(j):n==="databaseFares"&&q()});document.documentElement.style.visibility="hidden";Et(async e=>{if(!e){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const t=document.getElementById("admin-user-name");t&&(t.textContent=e.email.split("@")[0]),await qt(),vt(),await mt()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("admin-logout-btn");e&&e.addEventListener("click",async()=>{(await It()).success&&(window.location.href="/login.html")}),zt(),_t(),yn()});async function qt(){try{const[e,t,n]=await Promise.all([dt(),We(),Ve()]);z=e,F=Je(t),U=n}catch(e){console.error("loadGlobalData error:",e)}}function _t(){const e=document.querySelectorAll(".nav-link"),t=document.querySelectorAll(".tab-content"),n=document.getElementById("page-title");e.forEach(i=>{i.addEventListener("click",async a=>{var d;a.preventDefault(),e.forEach(o=>{o.classList.remove("active","text-primary"),o.classList.add("text-text-muted")}),i.classList.remove("text-text-muted"),i.classList.add("active","text-primary");const s=i.getAttribute("data-tab"),c=i.getAttribute("data-title");t.forEach(o=>o.classList.remove("active")),(d=document.getElementById(s))==null||d.classList.add("active"),n&&c&&(n.textContent=c),await mt()})})}async function mt(){const e=document.querySelector(".tab-content.active");if(!e)return;const t=e.id;t==="agents-tab"?await ie():t==="sectors-tab"?await oe():t==="flights-tab"?await pe():t==="dashboard-tab"?await Gt():t==="reports-tab"?await Qt():t==="database-tab"?await Xe():t==="agent-sheets-tab"?(vt(),ke(),de()):t==="eticket-tab"&&await Sn()}function zt(){const e=document.getElementById("admin-modal"),t=document.getElementById("modal-close-btn");t&&t.addEventListener("click",()=>e.close()),e==null||e.addEventListener("click",n=>{n.target===e&&e.close()})}function je(e,t){const n=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=e,document.getElementById("modal-body").innerHTML=t,n.showModal()}async function Gt(){var i,a,s,c,d;if(!document.getElementById("dashboard-tab"))return;const t=document.getElementById("poster-sector-sel");t&&t.options.length<=1&&F.forEach(o=>{const l=new Option(o.sectorCode,o.id);t.appendChild(l)});const n=document.getElementById("poster-generate-btn");n&&!n.dataset.wired&&(n.dataset.wired="1",n.addEventListener("click",async()=>{const o=document.getElementById("poster-start-date"),l=document.getElementById("poster-end-date"),u=t==null?void 0:t.value,r=(o==null?void 0:o.value)||null,g=(l==null?void 0:l.value)||null;if(!u){x("warning","Validation Error","Please select a sector to generate the poster.");return}n.disabled=!0,n.textContent="Generating…";try{const m=await He({sectorId:u,startDate:r,endDate:g,includeHidden:!1});if(!m||!m.length){x("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await Wt(m,u)}catch(m){x("error","Generation Failed",m.message)}finally{n.disabled=!1,n.textContent="Generate Poster"}}),(i=document.getElementById("poster-download-jpg"))==null||i.addEventListener("click",()=>at("jpeg")),(a=document.getElementById("poster-download-pdf"))==null||a.addEventListener("click",()=>at("pdf")),(s=document.getElementById("poster-download-vid-1x1"))==null||s.addEventListener("click",()=>qe("1x1")),(c=document.getElementById("poster-download-vid-9x16"))==null||c.addEventListener("click",()=>qe("9x16")),(d=document.getElementById("poster-download-vid-16x9"))==null||d.addEventListener("click",()=>qe("16x9")))}async function qe(e){const t=document.getElementById("poster-sector-sel"),n=document.getElementById("poster-start-date"),i=document.getElementById("poster-end-date"),a=t==null?void 0:t.value,s=(n==null?void 0:n.value)||null,c=(i==null?void 0:i.value)||null;if(!a){x("warning","Validation Error","Please select a sector to generate the poster.");return}try{const d=await He({sectorId:a,startDate:s,endDate:c,includeHidden:!1});if(!d||!d.length){x("warning","No Fares","No live fares found for the selected sector and dates.");return}await Pt(e,d,a,F,U)}catch(d){console.error("Video generation failed",d)}}async function Wt(e,t){const n=document.getElementById("poster-preview-container"),i=document.getElementById("poster-fares-tbody"),a=document.getElementById("poster-sector-title");if(!n||!i||!a)return;const s=F.find(m=>m.id===t),c=s?(s.sectorFrom||"DEP").toUpperCase():"DEP",d=s?(s.sectorTo||"ARR").toUpperCase():"ARR";a.innerHTML=`${c} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${d}`;const o=[...e].sort((m,p)=>{let y=m.flightDate,v=p.flightDate;return y instanceof Date&&(y=y.getTime()),v instanceof Date&&(v=v.getTime()),y-v}).slice(0,10),l={};U.forEach(m=>{m.id&&(l[m.id]=m),m.code&&(l[m.code]=m),m.name&&(l[m.name]=m)});async function u(m){try{const p=await fetch(m);if(!p.ok)return null;const y=await p.blob();return URL.createObjectURL(y)}catch{return null}}const r=[...new Set(o.map(m=>m.airlineId))].map(m=>l[m]).filter(m=>m==null?void 0:m.logoUrl),g={};await Promise.all(r.map(async m=>{const p=await u(m.logoUrl);p&&(g[m.id]=p)})),i.innerHTML=o.map((m,p)=>{const y=m.flightDate instanceof Date?m.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():m.flightDate,v=l[m.airlineId],E=p%2===0?"#ffffff":"#f8fafc",S=g[m.airlineId]||null,f=S?`<img src="${S}" style="height:40px;max-width:100px;object-fit:contain;display:block;margin:0 auto;" alt="${(v==null?void 0:v.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:15px;white-space:nowrap;">${(v==null?void 0:v.name)||m.airlineId||"—"}</span>`;let h='<span style="color:#94a3b8;font-size:14px;">—</span>';if(m.flightTime){const w=m.flightTime.split("-").map(k=>k.trim());w.length>=2?h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${w[0]} - ${w[1]}</span>`:h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${m.flightTime}</span>`}return`
      <tr style="background-color:${E};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 12px;font-weight:900;color:#0f172a;font-size:22px;white-space:nowrap;">${y}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${f}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${h}</td>
        <td style="padding:16px 12px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:8px 18px;border-radius:12px;font-weight:900;font-size:22px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            &#8377;${(m.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),n.classList.remove("hidden"),n.classList.add("flex")}function ut(e){if(!e||e.nodeType!==1)return;const t=window.getComputedStyle(e),n=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const i of n){const a=t.getPropertyValue(i);if(a&&!a.startsWith("rgb")&&!a.startsWith("#")&&a!=="transparent"&&a!=="initial")try{e.style[i]=a}catch{}}for(const i of e.children)ut(i)}async function at(e){const t=document.getElementById("poster-render-frame");if(!t)return;const n=document.getElementById("poster-download-jpg"),i=document.getElementById("poster-download-pdf");n&&(n.disabled=!0),i&&(i.disabled=!0);const a=t.style.transform;t.style.transform="none",x("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(t.querySelectorAll("img")).map(d=>d.complete?Promise.resolve():new Promise(o=>{d.onload=o,d.onerror=o})));const s=await html2canvas(t,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:d=>{const o=d.getElementById("poster-render-frame");o&&ut(o)}});t.style.transform=a;const c=s.toDataURL("image/jpeg",.95);if(e==="jpeg"){const d=document.createElement("a");d.download=`zamra-poster-${Date.now()}.jpg`,d.href=c,d.click(),x("success","Downloaded!","JPEG poster saved successfully.")}else if(e==="pdf"){const d=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!d)throw new Error("jsPDF library not loaded.");const o=96/25.4,l=s.width/2/o,u=s.height/2/o,r=new d({orientation:l>u?"landscape":"portrait",unit:"mm",format:[l,u]});r.addImage(c,"JPEG",0,0,l,u),r.save(`zamra-poster-${Date.now()}.pdf`),x("success","Downloaded!","PDF poster saved successfully.")}}catch(s){console.error("Poster export error:",s),t.style.transform=a,x("error","Export Failed",s.message||"There was an error generating the export.")}finally{n&&(n.disabled=!1),i&&(i.disabled=!1)}}function Le(e){const t=document.getElementById("report-fares-results");if(!t)return;if(!e||!e.length){t.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-inbox"></i>
        </div>
        <p class="admin-empty-state-title">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const n=Object.fromEntries(z.map(m=>[m.id,m.name])),i=Object.fromEntries(F.map(m=>[m.id,m.sectorCode])),a=Object.fromEntries(U.map(m=>[m.id,m.code])),{key:s,asc:c}=ae.reportFares,d=[...e].sort((m,p)=>{let y=m[s],v=p[s];return y instanceof Date&&(y=y.getTime()),v instanceof Date&&(v=v.getTime()),typeof y=="string"&&(y=y.toLowerCase()),typeof v=="string"&&(v=v.toLowerCase()),y<v?c?-1:1:y>v?c?1:-1:0}),o=se.reportFares,l=Math.max(1,Math.ceil(e.length/o));I.reportFares>l&&(I.reportFares=l);const u=(I.reportFares-1)*o,r=d.slice(u,u+o),g=(m,p)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${m}">${p} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;t.innerHTML=`
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
          ${r.map((m,p)=>{const y=m.flightDate instanceof Date?m.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):m.flightDate||"—";return`<tr class="${p%2===1?"bg-slate-50/60":""} hover:bg-slate-100/80 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${y}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${m.flightTime||"—"}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${i[m.sectorId]||m.sectorId}</span>
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
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,$e("reportFares",e.length,l,u,o),window.__deleteFare=async m=>{if(confirm("Delete this fare?"))try{await Ge(m),j=j.filter(p=>p.id!==m),x("success","Deleted","Fare removed."),Le(j)}catch(p){x("error","Error",p.message)}},window.__toggleFare=async(m,p)=>{try{await rt(m,{isHidden:p}),j=j.map(y=>y.id===m?{...y,isHidden:p}:y),x("success","Updated",`Fare ${p?"hidden":"shown"}.`),Le(j)}catch(y){x("error","Error",y.message)}},De("reportFares")}async function ie(e=!0){e&&(z=await dt(),I.agents=1);const t=document.querySelector("#agents-tab .admin-table tbody");if(!t)return;const n=document.getElementById("agents-search"),i=document.getElementById("agents-limit");n&&!n.dataset.wired&&(n.dataset.wired="1",i&&(i.dataset.wired="1"),n.addEventListener("input",u=>{Pe.agents=u.target.value,I.agents=1,ie(!1)}),i&&i.addEventListener("change",u=>{se.agents=parseInt(u.target.value),I.agents=1,ie(!1)}));const a=Ye(z,"agents"),s=se.agents,c=Math.max(1,Math.ceil(a.length/s));I.agents>c&&(I.agents=c);const d=(I.agents-1)*s,o=a.slice(d,d+s);t.innerHTML=o.length?o.map(u=>Vt(u)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',$e("agents",a.length,c,d,s),delete t.dataset.actionsWired,Jt();const l=document.getElementById("agents-add-btn");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>gt(null))),De("agents")}function Vt(e){const t=e.isActive!==!1?'<span class="admin-status-pill admin-status-active">Active</span>':'<span class="admin-status-pill admin-status-inactive">Hidden</span>',n=e.commission!==void 0?`₹${Number(e.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id||"—"}</td>
    <td class="font-semibold">${e.name}</td>
    <td>${e.email||"—"}</td>
    <td>${e.contactPhone||"—"}</td>
    <td class="font-semibold text-navy">${n}</td>
    <td>${t}</td>
    <td>
      <div class="flex gap-1 flex-wrap items-center">
        <button data-action="edit-agent" data-id="${e.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-agent" data-id="${e.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
        <button data-action="toggle-agent" data-id="${e.id}" data-active="${e.isActive!==!1}"
          class="admin-action-btn ${e.isActive!==!1?"admin-action-toggle":"admin-action-show"}">
          <i class="bi ${e.isActive!==!1?"bi-eye-slash":"bi-eye"}"></i>${e.isActive!==!1?"Hide Fares":"Show Fares"}</button>
      </div>
    </td>
  </tr>`}function Jt(){const e=document.querySelector("#agents-tab .admin-table tbody");!e||e.dataset.actionsWired||(e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const i=n.dataset.action,a=n.dataset.id,s=z.find(c=>c.id===a);if(i==="edit-agent"&&gt(s),i==="delete-agent"){if(!confirm(`Delete agent "${s==null?void 0:s.name}"? This does NOT delete their fares.`))return;try{await St(a),x("success","Deleted",`Agent "${s==null?void 0:s.name}" removed.`),await ie()}catch(c){x("error","Error",c.message)}}if(i==="toggle-agent"){const d=!(n.dataset.active==="true");n.disabled=!0,n.textContent="Working…";try{const o=await Ct(a,d);x("success",d?"Agent Shown":"Agent Hidden",o.message),await ie()}catch(o){x("error","Toggle Failed",o.message),await ie()}}}))}function $e(e,t,n,i,a){const s=document.getElementById(`${e}-pagination-footer`);if(!s)return;const c=Math.min(i+a,t),d=I[e];s.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${t?i+1:0} to ${c} of ${t} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${d<=1?"disabled":""}>Previous</button>
        ${Array.from({length:n},(o,l)=>l+1).map(o=>`<button data-pg-action="goto" data-pg="${o}" class="admin-pagination-btn ${o===d?"admin-pagination-btn-active":""}">${o}</button>`).join("")}
        <button data-pg-action="next" class="admin-pagination-btn" ${d>=n?"disabled":""}>Next</button>
      </div>
    </div>`,s.dataset.wired||(s.dataset.wired="1",s.addEventListener("click",o=>{const l=o.target.closest("[data-pg-action]");if(!l||l.disabled)return;const u=l.dataset.pgAction;u==="prev"?I[e]=Math.max(1,I[e]-1):u==="next"?I[e]++:u==="goto"&&(I[e]=parseInt(l.dataset.pg)),e==="agents"?ie(!1):e==="sectors"?oe(!1):e==="airlines"?pe(!1):e==="reportFares"?Le(j):e==="databaseFares"&&q()}))}function gt(e){var n,i;const t=!!e;je(t?"Edit Agent":"Add New Agent",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(i=document.getElementById("agent-form"))==null||i.addEventListener("submit",async a=>{a.preventDefault();const s=new FormData(a.target),c=Object.fromEntries(s.entries()),d=a.target.querySelector("[type=submit]");d.disabled=!0,d.textContent="Saving…";try{t?(await At(e.id,c),x("success","Updated",`Agent "${c.name}" updated.`)):(await Bt(c),x("success","Added",`Agent "${c.name}" added.`)),document.getElementById("admin-modal").close(),await ie()}catch(o){x("error","Save Failed",o.message),d.disabled=!1,d.textContent=t?"Save Changes":"Add Agent"}})}async function oe(e=!0){e&&(F=Je(await We()),I.sectors=1);const t=document.getElementById("sectors-search"),n=document.getElementById("sectors-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",n.dataset.wired="1",t.addEventListener("input",u=>{Pe.sectors=u.target.value,I.sectors=1,oe(!1)}),n.addEventListener("change",u=>{se.sectors=parseInt(u.target.value),I.sectors=1,oe(!1)}));const i=document.querySelector("#sectors-tab .admin-table tbody");if(!i)return;const a=Ye(F,"sectors"),s=se.sectors,c=Math.max(1,Math.ceil(a.length/s));I.sectors>c&&(I.sectors=c);const d=(I.sectors-1)*s,o=a.slice(d,d+s);i.innerHTML=o.length?o.map(u=>Yt(u)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',$e("sectors",a.length,c,d,s),Xt();const l=document.querySelector("#sectors-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>pt(null))),De("sectors")}function Yt(e){const t=lt(e);return`<tr data-sector-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id||"—"}</td>
    <td class="font-semibold">${t.sectorFrom}</td>
    <td class="font-semibold">${t.sectorTo}</td>
    <td><span class="font-mono font-bold text-primary">${t.sectorCode}</span></td>
    <td>
      <div class="flex gap-1 items-center">
        <button data-action="edit-sector" data-id="${e.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-sector" data-id="${e.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
        <button data-action="toggle-sector" data-id="${e.id}" data-hidden="${e.isHidden===!0}"
          class="admin-action-btn ${e.isHidden===!0?"admin-action-show":"admin-action-toggle"}">
          <i class="bi ${e.isHidden===!0?"bi-eye":"bi-eye-slash"}"></i>${e.isHidden===!0?"Show Fares":"Hide Fares"}</button>
      </div>
    </td>
  </tr>`}function Xt(){const e=document.querySelector("#sectors-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const{action:i,id:a}=n.dataset,s=F.find(c=>c.id===a);if(i==="edit-sector"&&pt(s),i==="delete-sector"){if(!confirm(`Delete sector "${s==null?void 0:s.sectorCode}"?`))return;try{await Lt(a),x("success","Deleted",`Sector "${s==null?void 0:s.sectorCode}" removed.`),await oe()}catch(c){x("error","Error",c.message)}}if(i==="toggle-sector"){const d=!(n.dataset.hidden==="true");n.disabled=!0,n.textContent="Working…";try{const o=await Tt(a,d);x("success",`Sector Fares ${d?"Hidden":"Shown"}`,o.message),await oe()}catch(o){x("error","Toggle Failed",o.message),await oe()}}}))}function pt(e){var n,i;const t=!!e;je(t?"Edit Sector":"Add New Sector",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(i=document.getElementById("sector-form"))==null||i.addEventListener("submit",async a=>{a.preventDefault();const s=new FormData(a.target),c=Object.fromEntries(s.entries());c.sectorCode=ve(c.sectorCode.toUpperCase()),c.sectorFrom=ve(c.sectorFrom.toUpperCase()),c.sectorTo=ve(c.sectorTo.toUpperCase());const d=a.target.querySelector("[type=submit]");d.disabled=!0,d.textContent="Saving…";try{t?(await kt(e.id,c),x("success","Updated","Sector updated.")):(await Dt(c),x("success","Added",`Sector "${c.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await oe()}catch(o){x("error","Save Failed",o.message),d.disabled=!1,d.textContent=t?"Save Changes":"Add Sector"}})}async function pe(e=!0){e&&(U=await Ve(),I.airlines=1);const t=document.getElementById("airlines-search"),n=document.getElementById("airlines-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",n.dataset.wired="1",t.addEventListener("input",u=>{Pe.airlines=u.target.value,I.airlines=1,pe(!1)}),n.addEventListener("change",u=>{se.airlines=parseInt(u.target.value),I.airlines=1,pe(!1)}));const i=document.querySelector("#flights-tab .admin-table tbody");if(!i)return;const a=Ye(U,"airlines"),s=se.airlines,c=Math.max(1,Math.ceil(a.length/s));I.airlines>c&&(I.airlines=c);const d=(I.airlines-1)*s,o=a.slice(d,d+s);i.innerHTML=o.length?o.map(u=>Kt(u)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "Add Airline".</td></tr>',$e("airlines",a.length,c,d,s),Zt();const l=document.querySelector("#flights-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>ft(null))),De("airlines")}function Kt(e){const t=e.logoUrl?`<span class="admin-logo-wrap"><img src="${e.logoUrl}" alt="${T(e.name||"Airline")}"></span>`:`<span class="admin-logo-wrap"><span class="admin-logo-fallback">${T((e.code||"NA").slice(0,3))}</span></span>`;return`<tr data-airline-id="${e.id}">
    <td>${t}</td>
    <td class="font-semibold">${e.name}</td>
    <td><span class="font-mono font-bold text-primary">${e.code}</span></td>
    <td>
      <div class="flex gap-1 items-center">
        <button data-action="edit-airline" data-id="${e.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-airline" data-id="${e.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Zt(){const e=document.querySelector("#flights-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(!n)return;const{action:i,id:a}=n.dataset,s=U.find(c=>c.id===a);if(i==="edit-airline"&&ft(s),i==="delete-airline"){if(!confirm(`Delete airline "${s==null?void 0:s.name}" (${s==null?void 0:s.code})?`))return;try{await Ft(a),x("success","Deleted",`Airline "${s==null?void 0:s.name}" removed.`),await pe()}catch(c){x("error","Error",c.message)}}}))}function ft(e){var n,i;const t=!!e;je(t?"Edit Airline":"Add New Airline",`
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
    </form>`),(n=document.getElementById("modal-cancel"))==null||n.addEventListener("click",()=>document.getElementById("admin-modal").close()),(i=document.getElementById("airline-form"))==null||i.addEventListener("submit",async a=>{var l;a.preventDefault();const s=new FormData(a.target),c=((l=s.get("logoFile"))==null?void 0:l.size)>0?s.get("logoFile"):null,d={name:s.get("name"),code:s.get("code").toUpperCase()},o=a.target.querySelector("[type=submit]");o.disabled=!0,o.textContent="Saving…";try{t?(await Rt(e.id,d,c),x("success","Updated","Airline updated.")):(await Mt(d,c),x("success","Added",`Airline "${d.name}" added.`)),document.getElementById("admin-modal").close(),await pe()}catch(u){x("error","Save Failed",u.message),o.disabled=!1,o.textContent=t?"Save Changes":"Add Airline"}})}async function Qt(){const e=document.getElementById("reports-tab");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=document.getElementById("reports-sector-sel");t&&t.options.length<=1&&F.forEach(c=>t.appendChild(new Option(c.sectorCode,c.id)));const n=document.getElementById("reports-agent-sel");n&&n.options.length<=1&&z.forEach(c=>n.appendChild(new Option(c.name,c.id)));const i=document.getElementById("generate-report-btn"),a=document.getElementById("reports-start-date"),s=document.getElementById("reports-end-date");i&&!i.dataset.wired&&(i.dataset.wired="1",i.addEventListener("click",async()=>{const c=(t==null?void 0:t.value)||"all",d=(n==null?void 0:n.value)||"all",o=(a==null?void 0:a.value)||null,l=(s==null?void 0:s.value)||null;if(c==="all"&&!o&&!l&&d==="all"){x("warning","No Filter Selected","Select at least a sector, an agent, or a date range.");return}i.disabled=!0,i.textContent="Generating…";try{const[u,r]=await Promise.all([Ht(o,l,c,d),He({sectorId:c,agentId:d,startDate:o,endDate:l,includeHidden:!0})]);j=r,en(u,e),I.reportFares=1,Le(j)}catch(u){x("error","Report Failed",u.message)}finally{i.disabled=!1,i.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function en(e,t){const{agentReport:n,sectorReport:i,totalFares:a}=e,s=document.getElementById("report-stats-row");if(s){s.classList.remove("hidden");const g=(j||[]).filter(f=>!f.isHidden).length,m=(j||[]).filter(f=>f.isHidden).length,p=new Set((j||[]).map(f=>f.agentId)).size,y=(j||[]).map(f=>f.finalRate||0).filter(f=>f>0),v=y.length?Math.round(y.reduce((f,h)=>f+h,0)/y.length):0,E=(f,h)=>{const w=document.getElementById(f);w&&(w.textContent=h.toLocaleString())};E("stat-total-fares",a),E("stat-live-fares",g),E("stat-hidden-fares",m),E("stat-agents-count",p);const S=document.getElementById("stat-avg-fare");S&&(S.textContent=v>0?`₹${v.toLocaleString()}`:"—")}const c=document.getElementById("report-total-fares");c&&(c.textContent=`${a} fare${a!==1?"s":""} matched your filter`);const d=document.getElementById("bar-chart-container");d&&n.length&&tn(n.slice(0,8),d);const o=document.getElementById("donut-chart-svg"),l=document.getElementById("pie-legend");o&&i.length&&nn(i.slice(0,8),o,l);const u=document.getElementById("report-leaderboards");u&&(u.classList.remove("hidden"),an(n,i));const r=document.getElementById("download-report-csv");if(r){const g=r.cloneNode(!0);r.parentNode.replaceChild(g,r),g.addEventListener("click",()=>sn(j)),j&&j.length?g.classList.remove("opacity-50","pointer-events-none"):g.classList.add("opacity-50","pointer-events-none")}x("success","Report Ready",`${a} fare${a!==1?"s":""} aggregated.`)}function tn(e,t){const n=t.clientWidth||480,i=260,a={top:32,right:16,bottom:48,left:48},s=n-a.left-a.right,c=i-a.top-a.bottom,d=Math.max(...e.map(f=>f.count),1),o=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],l=4,u=Math.ceil(d/l),r=Array.from({length:l+1},(f,h)=>h*u),g=r.map(f=>{const h=a.top+c-f/(r[r.length-1]||1)*c;return`<line x1="${a.left}" y1="${h.toFixed(1)}" x2="${n-a.right}" y2="${h.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${a.left-6}" y="${(h+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${f}</text>`}).join(""),m=Math.min(48,s/e.length*.6),p=s/e.length,y=e.map((f,h)=>{const w=Math.max(4,f.count/(r[r.length-1]||1)*c),k=a.left+h*p+p/2-m/2,N=a.top+c-w,[G,J]=o[h%o.length],X=`bg${h}`,K=f.avgRate?`avg ₹${Math.round(f.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${X}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${G}"/>
              <stop offset="100%" stop-color="${J}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${f.name}" data-count="${f.count}" data-avg="${K}" style="cursor:pointer;">
              <rect x="${k.toFixed(1)}" y="${N.toFixed(1)}" width="${m}" height="${w.toFixed(1)}"
                rx="6" fill="url(#${X})" opacity="0.92"
                style="transform-origin:${(k+m/2).toFixed(1)}px ${(a.top+c).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${h*.07}s both;"/>
              <text x="${(k+m/2).toFixed(1)}" y="${(N-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${J}">${f.count}</text>
              <text x="${(k+m/2).toFixed(1)}" y="${(a.top+c+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(f.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),v="bar-tooltip";t.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${v}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${i}" viewBox="0 0 ${n} ${i}" style="overflow:visible;">
      ${g}
      <line x1="${a.left}" y1="${a.top}" x2="${a.left}" y2="${a.top+c}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${a.left}" y1="${a.top+c}" x2="${n-a.right}" y2="${a.top+c}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${y}
    </svg>`;const E=t.querySelector("#bar-svg"),S=t.querySelector(`#${v}`);E&&S&&E.querySelectorAll(".bar-group").forEach(f=>{f.addEventListener("mousemove",h=>{const w=t.getBoundingClientRect();S.style.display="block",S.style.left=h.clientX-w.left+12+"px",S.style.top=h.clientY-w.top-40+"px";const k=f.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${f.dataset.avg}</span>`:"";S.innerHTML=`${f.dataset.name}<br><span style="color:#60a5fa;">${f.dataset.count} fares</span>${k}`}),f.addEventListener("mouseleave",()=>{S.style.display="none"})})}function nn(e,t,n){const i=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],o=e.reduce((f,h)=>f+h.count,0),l=t.getElementById?t.getElementById("donut-segments"):t.querySelector("#donut-segments"),u=t.querySelector("#donut-center-count"),r=t.querySelector("#donut-center-label");if(!l)return;u&&(u.textContent=o),r&&(r.textContent="FARES");const g=(f,h,w,k)=>({x:f+w*Math.cos((k-90)*Math.PI/180),y:h+w*Math.sin((k-90)*Math.PI/180)});let m=0;const p=e.map((f,h)=>{const w=o>0?f.count/o*360:0,k=m+w,N=w>180?1:0,G=g(110,110,95,m),J=g(110,110,95,k),X=g(110,110,60,m),K=g(110,110,60,k),ce=[`M ${G.x.toFixed(2)} ${G.y.toFixed(2)}`,`A 95 95 0 ${N} 1 ${J.x.toFixed(2)} ${J.y.toFixed(2)}`,`L ${K.x.toFixed(2)} ${K.y.toFixed(2)}`,`A 60 60 0 ${N} 0 ${X.x.toFixed(2)} ${X.y.toFixed(2)}`,"Z"].join(" "),me=m+w/2;m=k;const b=o>0?(f.count/o*100).toFixed(1):"0.0";return{pathD:ce,color:i[h%i.length],name:f.name,count:f.count,pct:b,mid:me}}),y="http://www.w3.org/2000/svg";l.innerHTML="";const v=p.map((f,h)=>{const w=document.createElementNS(y,"path");return w.setAttribute("d",f.pathD),w.setAttribute("fill",f.color),w.setAttribute("stroke","white"),w.setAttribute("stroke-width","2"),w.style.cursor="pointer",w.style.transition="transform 0.2s, filter 0.2s",w.style.transformOrigin="110px 110px",w.setAttribute("data-index",h),l.appendChild(w),w}),E=f=>{v.forEach((h,w)=>{w===f?(h.style.transform="scale(1.04)",h.style.filter="brightness(1.1)",h.setAttribute("stroke-width","3")):(h.style.transform="scale(1)",h.style.filter="brightness(1)",h.setAttribute("stroke-width","2"))}),f>=0&&f<p.length?(u&&(u.textContent=p[f].count),r&&(r.textContent=p[f].name.split(" ")[0].toUpperCase().slice(0,7))):(u&&(u.textContent=o),r&&(r.textContent="FARES"))};if(v.forEach((f,h)=>{f.addEventListener("mouseover",()=>{E(h),S(h)}),f.addEventListener("mouseout",()=>{E(-1),S(-1)})}),n){n.innerHTML=p.map((h,w)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${w}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${h.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${h.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${h.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${h.pct}%</span>
      </div>`).join("");const f=h=>{n.querySelectorAll(".legend-row").forEach((w,k)=>{w.style.background=k===h?"#f1f5f9":""})};window._highlightLegendRows=f,n.querySelectorAll(".legend-row").forEach((h,w)=>{h.addEventListener("mouseover",()=>{E(w),f(w)}),h.addEventListener("mouseout",()=>{E(-1),f(-1)})})}function S(f){window._highlightLegendRows&&window._highlightLegendRows(f)}}function an(e,t){var s,c;const n=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],i=document.getElementById("leaderboard-agents");if(i&&e.length){const d=[...e].sort((l,u)=>u.count-l.count).slice(0,5),o=d[0].count||1;i.innerHTML=d.map((l,u)=>{const r=Math.max(6,Math.round(l.count/o*100));return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="width:28px;text-align:center;flex-shrink:0;">${u===0?'<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:#fff7ed;color:#b45309;border:1px solid #fed7aa;"><i class="bi bi-trophy-fill" style="font-size:12px;"></i></span>':`<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:#f8fafc;color:#64748b;border:1px solid #e2e8f0;font-size:11px;font-weight:800;">#${u+1}</span>`}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${l.name}</span>
            <span style="color:${n[u]};margin-left:8px;">${l.count} fares</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${r}%;height:100%;background:${n[u]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}const a=document.getElementById("leaderboard-sectors");if(a&&t.length){const o=[...t.filter(r=>r.avgRate>0)].sort((r,g)=>r.avgRate-g.avgRate).slice(0,5),l=((s=o[0])==null?void 0:s.avgRate)||1,u=((c=o[o.length-1])==null?void 0:c.avgRate)||1;a.innerHTML=o.map((r,g)=>{const m=u>l?Math.max(6,Math.round((r.avgRate-l)/(u-l)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${g+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${r.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(r.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${m}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function sn(e){if(!e||!e.length){x("warning","No Data","No fares to export. Apply filters and fetch first.");return}const t=Object.fromEntries(z.map(r=>[r.id,r.name])),n=Object.fromEntries(F.map(r=>[r.id,r.sectorCode])),i=Object.fromEntries(U.map(r=>[r.id,r.code||r.name])),a=r=>`"${String(r??"").replace(/"/g,'""')}"`,s=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],c=e.map(r=>{const g=r.flightDate instanceof Date?r.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):r.flightDate||"";return[a(g),a(r.flightTime||""),a(n[r.sectorId]||r.sectorId),a(i[r.airlineId]||r.airlineId),a(t[r.agentId]||r.agentId),a(r.specialRate||0),a(r.finalRate||0),a(r.commission||0),a(r.baggage||""),a(r.extraBaggage||""),a(r.isHidden?"Hidden":"Live")].join(",")}),d=[s.map(a).join(","),...c].join(`
`),o=new Blob(["\uFEFF"+d],{type:"text/csv;charset=utf-8;"}),l=URL.createObjectURL(o),u=document.createElement("a");u.href=l,u.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(u),u.click(),document.body.removeChild(u),URL.revokeObjectURL(l),x("success","CSV Downloaded",`${e.length} fares exported.`)}function bt(){return Object.keys(W).length}function on(){return{agentNameById:Object.fromEntries(z.map(e=>[e.id,e.name||e.id])),sectorCodeById:Object.fromEntries(F.map(e=>[e.id,e.sectorCode||`${e.sectorFrom||""} ${e.sectorTo||""}`.trim()||e.id])),airlineLabelById:Object.fromEntries(U.map(e=>[e.id,e.code?`${e.code} - ${e.name||""}`.trim():e.name||e.id]))}}function ht(e,t=0){if(!e)return t;const n=z.find(a=>a.id===e),i=Number(n==null?void 0:n.commission);return Number.isFinite(i)?Math.max(0,i):t}function rn(e,t){return e==="specialRate"||e==="finalRate"||e==="commission"||e==="extraBaggage"?t===""?"":D(t,0):e==="baggage"?t===""?"":le(t):e==="isHidden"?t===!0||t==="hidden"||t==="true":e==="flightTime"?String(t||"").trim():e==="flightDate"?t||"":String(t||"")}function dn(e,t){return e==="specialRate"||e==="finalRate"||e==="extraBaggage"?D(t,0):e==="commission"?t==null||t===""?"":Math.max(0,D(t,0)):e==="baggage"?le(t):e==="isHidden"?t===!0:e==="flightTime"?String(t||"").trim():e==="flightDate"?Ne(t):String(t||"")}function _e(e){return e?e.commission!==void 0&&e.commission!==null&&e.commission!==""?Math.max(0,D(e.commission,0)):Math.max(0,D(e.finalRate,0)-D(e.specialRate,0)):0}function Te(e,t){return Math.max(0,D(e,0)+Math.max(0,D(t,0)))}function yt(e){const t=W[e.id]||{},n={...e,...t},i=_e(e);return n.flightDate=t.flightDate!==void 0?ct(t.flightDate):Be(e.flightDate),n.specialRate=D(n.specialRate,0),n.commission=t.commission!==void 0?Math.max(0,D(t.commission,0)):i,n.finalRate=Te(n.specialRate,n.commission),n.baggage=le(n.baggage),n.extraBaggage=D(n.extraBaggage,0),n.isHidden=n.isHidden===!0||n.isHidden==="hidden"||n.isHidden==="true",n.flightTime=String(n.flightTime||"").trim(),n.agentId=n.agentId||"",n.sectorId=n.sectorId||"",n.airlineId=n.airlineId||"",n}function Se(){const e=bt(),t=Q.size,n=document.getElementById("database-unsaved-pill");n&&(n.textContent=`Unsaved: ${e}`);const i=document.getElementById("database-save-all-btn");i&&(i.disabled=e===0);const a=document.getElementById("database-delete-selected-btn");a&&(a.disabled=t===0);const s=document.getElementById("database-selected-count");s&&(s.textContent=String(t))}function ln(){const e=document.getElementById("database-agent-filter"),t=document.getElementById("database-sector-filter"),n=document.getElementById("database-airline-filter");if(e){const i=B.agentId;e.innerHTML='<option value="all">All Agents</option>'+z.map(a=>`<option value="${T(a.id)}">${T(a.id)} · ${T(a.name||"Unnamed")}</option>`).join(""),e.value=i}if(t){const i=B.sectorId;t.innerHTML='<option value="all">All Sectors</option>'+F.map(a=>`<option value="${T(a.id)}">${T(a.sectorCode||a.id)}</option>`).join(""),t.value=i}if(n){const i=B.airlineId;n.innerHTML='<option value="all">All Airlines</option>'+U.map(a=>`<option value="${T(a.id)}">${T(a.code||"—")} · ${T(a.name||"Unnamed")}</option>`).join(""),n.value=i}}function cn(){const e=document.getElementById("database-table-wrap");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=a=>{const s=e.querySelector(`tr[data-fare-id="${a}"]`);if(!s)return;const c=!!W[a];s.classList.toggle("admin-database-row-dirty",c);const d=s.querySelector('[data-db-action="save"]'),o=s.querySelector('[data-db-action="reset"]');d&&(d.disabled=!c),o&&(o.disabled=!c)},n=a=>{if(!a)return;const s=a.querySelector('[data-db-field="specialRate"]'),c=a.querySelector('[data-db-field="commission"]'),d=a.querySelector('[data-db-field="finalRate"]');if(!s||!c||!d)return;const o=D(s.value,0),l=Math.max(0,D(c.value,0));d.value=String(Te(o,l))},i=a=>{const s=a.target.closest("[data-db-field]");if(!s)return;const c=s.closest("tr[data-fare-id]");if(!c)return;const d=c.dataset.fareId,o=s.dataset.dbField,l=ee.find(y=>y.id===d);if(!l||!o)return;const u=s.value,r=rn(o,u),g=o==="commission"?_e(l):dn(o,l[o]),m=r!==g,p={...W[d]||{}};if(m?p[o]=r:delete p[o],o==="agentId"){const y=c.querySelector('[data-db-field="commission"]'),v=ht(r,0);y&&(y.value=String(v));const E=_e(l);v!==E?p.commission=v:delete p.commission,n(c)}Object.keys(p).length?W[d]=p:delete W[d],(o==="specialRate"||o==="commission")&&n(c),t(d),Se()};e.addEventListener("input",i),e.addEventListener("change",a=>{i(a);const s=a.target.closest("#database-select-all");if(s){e.querySelectorAll("input[data-db-select]").forEach(d=>{d.checked=s.checked;const o=d.dataset.dbSelect;o&&(s.checked?Q.add(o):Q.delete(o))}),Se();return}const c=a.target.closest("input[data-db-select]");if(c){const d=c.dataset.dbSelect;if(!d)return;c.checked?Q.add(d):Q.delete(d),Se()}}),e.addEventListener("click",async a=>{const s=a.target.closest("[data-db-action]");if(!s)return;const c=s.dataset.dbAction,d=s.dataset.id;if(d){if(c==="save"){s.disabled=!0,await xt(d)||(s.disabled=!1),q();return}if(c==="reset"){delete W[d],q();return}if(c==="delete"){if(!confirm("Delete this fare row? This cannot be undone."))return;s.disabled=!0;try{await Ge(d),ee=ee.filter(o=>o.id!==d),delete W[d],Q.delete(d),x("success","Deleted","Fare row removed."),q()}catch(o){x("error","Delete Failed",o.message),s.disabled=!1}}}})}function mn(e){if(!e||e.dataset.controlsWired)return;e.dataset.controlsWired="1";const t=document.getElementById("database-search"),n=document.getElementById("database-agent-filter"),i=document.getElementById("database-sector-filter"),a=document.getElementById("database-airline-filter"),s=document.getElementById("database-status-filter"),c=document.getElementById("database-start-date"),d=document.getElementById("database-end-date"),o=document.getElementById("database-limit"),l=document.getElementById("database-clear-filters"),u=document.getElementById("database-refresh-btn"),r=document.getElementById("database-save-all-btn"),g=document.getElementById("database-delete-selected-btn"),m=document.getElementById("database-add-row-btn");t&&t.addEventListener("input",p=>{B.search=p.target.value||"",I.databaseFares=1,q()}),n&&n.addEventListener("change",p=>{B.agentId=p.target.value||"all",I.databaseFares=1,q()}),i&&i.addEventListener("change",p=>{B.sectorId=p.target.value||"all",I.databaseFares=1,q()}),a&&a.addEventListener("change",p=>{B.airlineId=p.target.value||"all",I.databaseFares=1,q()}),s&&s.addEventListener("change",p=>{B.status=p.target.value||"all",I.databaseFares=1,q()}),c&&c.addEventListener("change",p=>{B.startDate=p.target.value||"",I.databaseFares=1,q()}),d&&d.addEventListener("change",p=>{B.endDate=p.target.value||"",I.databaseFares=1,q()}),o&&(o.value=String(se.databaseFares),o.addEventListener("change",p=>{se.databaseFares=parseInt(p.target.value,10)||20,I.databaseFares=1,q()})),l&&l.addEventListener("click",()=>{B.search="",B.agentId="all",B.sectorId="all",B.airlineId="all",B.status="all",B.startDate="",B.endDate="",t&&(t.value=""),n&&(n.value="all"),i&&(i.value="all"),a&&(a.value="all"),s&&(s.value="all"),c&&(c.value=""),d&&(d.value=""),I.databaseFares=1,q()}),u&&u.addEventListener("click",async()=>{const p=u.innerHTML;u.disabled=!0,u.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing...',await Xe(!0),u.disabled=!1,u.innerHTML=p}),r&&r.addEventListener("click",gn),g&&g.addEventListener("click",pn),m&&m.addEventListener("click",fn)}async function Xe(e=!0){const t=document.getElementById("database-tab");if(!t)return;if(mn(t),cn(),ln(),e||!t.dataset.loaded)try{ee=await He({includeHidden:!0}),W={},Q=new Set,I.databaseFares=1,t.dataset.loaded="1"}catch(i){x("error","Load Failed",i.message),ee=[]}q()}function un(){const{agentNameById:e,sectorCodeById:t,airlineLabelById:n}=on(),i=B.search.trim().toLowerCase(),a=Ut(B.startDate),s=Ot(B.endDate),c=ee.map(l=>yt(l)).filter(l=>{var g,m;if(B.agentId!=="all"&&l.agentId!==B.agentId||B.sectorId!=="all"&&l.sectorId!==B.sectorId||B.airlineId!=="all"&&l.airlineId!==B.airlineId||B.status==="live"&&l.isHidden||B.status==="hidden"&&!l.isHidden)return!1;const u=((m=(g=Be(l.flightDate))==null?void 0:g.getTime)==null?void 0:m.call(g))||null;return a!==null&&(u===null||u<a)||s!==null&&(u===null||u>s)?!1:i?[l.id,Ne(l.flightDate),l.flightTime,l.specialRate,l.finalRate,l.commission,l.baggage,l.extraBaggage,l.isHidden?"hidden":"live",l.agentId,l.sectorId,l.airlineId,e[l.agentId]||"",t[l.sectorId]||"",n[l.airlineId]||""].join(" ").toLowerCase().includes(i):!0}),{key:d,asc:o}=ae.databaseFares;return c.sort((l,u)=>{const r=p=>{var y,v;return d==="agentId"?(e[p.agentId]||p.agentId||"").toLowerCase():d==="sectorId"?(t[p.sectorId]||p.sectorId||"").toLowerCase():d==="airlineId"?(n[p.airlineId]||p.airlineId||"").toLowerCase():d==="flightDate"?((v=(y=Be(p.flightDate))==null?void 0:y.getTime)==null?void 0:v.call(y))||0:d==="isHidden"?p.isHidden?1:0:p[d]};let g=r(l),m=r(u);return typeof g=="string"&&(g=g.toLowerCase()),typeof m=="string"&&(m=m.toLowerCase()),g<m?o?-1:1:g>m?o?1:-1:0})}function q(){const e=document.getElementById("database-table-wrap");if(!e)return;const t=un(),n=document.getElementById("database-total-count");n&&(n.textContent=t.length.toLocaleString());const i=se.databaseFares,a=Math.max(1,Math.ceil(t.length/i));I.databaseFares>a&&(I.databaseFares=a);const s=(I.databaseFares-1)*i,c=t.slice(s,s+i);if(!c.length){e.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-database"></i>
        </div>
        <p class="admin-empty-state-title">No fares matched your filter</p>
      </div>
    </div>`,$e("databaseFares",t.length,a,s,i),Se();return}const d=(g,m)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="databaseFares" data-sort-key="${g}">
      ${m} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i>
    </th>`,o=g=>z.map(m=>`<option value="${T(m.id)}" ${m.id===g?"selected":""}>${T(m.id)} · ${T(m.name||"Unnamed")}</option>`).join(""),l=g=>F.map(m=>`<option value="${T(m.id)}" ${m.id===g?"selected":""}>${T(m.sectorCode||m.id)}</option>`).join(""),u=g=>U.map(m=>`<option value="${T(m.id)}" ${m.id===g?"selected":""}>${T(m.code||"—")} · ${T(m.name||"Unnamed")}</option>`).join(""),r=c.length>0&&c.every(g=>Q.has(g.id));e.innerHTML=`
    <table class="admin-database-table">
      <thead>
        <tr>
          <th class="w-[36px] text-center"><input id="database-select-all" type="checkbox" ${r?"checked":""}></th>
          <th class="w-[56px]">#</th>
          ${d("agentId","Agent")}
          ${d("sectorId","Sector Code")}
          ${d("flightDate","Date")}
          ${d("flightTime","Time")}
          ${d("airlineId","Flight Code")}
          ${d("baggage","Baggage")}
          ${d("extraBaggage","Extra Baggage")}
          ${d("specialRate","SP Rate")}
          ${d("commission","Commission")}
          ${d("finalRate","Rate")}
          ${d("isHidden","Status")}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${c.map((g,m)=>{const p=!!W[g.id],y=Q.has(g.id);return`
            <tr data-fare-id="${g.id}" class="${p?"admin-database-row-dirty":""}">
              <td class="text-center">
                <input type="checkbox" data-db-select="${g.id}" ${y?"checked":""}>
              </td>
              <td class="font-mono text-[11px] text-text-soft">${s+m+1}</td>
              <td>
                <select data-db-field="agentId" class="db-cell-select min-w-[180px]">
                  <option value="">Select Agent</option>
                  ${o(g.agentId)}
                </select>
              </td>
              <td>
                <select data-db-field="sectorId" class="db-cell-select min-w-[140px]">
                  <option value="">Select Sector</option>
                  ${l(g.sectorId)}
                </select>
              </td>
              <td>
                <input type="date" data-db-field="flightDate" class="db-cell-input" value="${Ne(g.flightDate)}">
              </td>
              <td>
                <input type="text" data-db-field="flightTime" class="db-cell-input min-w-[128px]" value="${T(g.flightTime||"")}" placeholder="04:05 - 11:10">
              </td>
              <td>
                <select data-db-field="airlineId" class="db-cell-select min-w-[170px]">
                  <option value="">No Airline</option>
                  ${u(g.airlineId)}
                </select>
              </td>
              <td>
                <select data-db-field="baggage" class="db-cell-select min-w-[110px]">
                  ${we(Ae,le(g.baggage))}
                </select>
              </td>
              <td>
                <select data-db-field="extraBaggage" class="db-cell-select min-w-[110px]">
                  ${we(Ae,D(g.extraBaggage,0))}
                </select>
              </td>
              <td>
                <input type="number" data-db-field="specialRate" class="db-cell-input db-cell-num" value="${D(g.specialRate,0)}" min="0" step="1">
              </td>
              <td>
                <input type="number" data-db-field="commission" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${D(g.commission,0)}" min="0" step="1" readonly tabindex="-1">
              </td>
              <td>
                <input type="number" data-db-field="finalRate" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${D(g.finalRate,0)}" min="0" step="1" readonly tabindex="-1">
              </td>
              <td>
                <select data-db-field="isHidden" class="db-cell-select min-w-[94px]">
                  <option value="live" ${g.isHidden?"":"selected"}>Live</option>
                  <option value="hidden" ${g.isHidden?"selected":""}>Hidden</option>
                </select>
              </td>
              <td>
                <div class="flex gap-1">
                  <button data-db-action="save" data-id="${g.id}" class="admin-action-btn admin-action-edit" ${p?"":"disabled"}><i class="bi bi-check2-circle"></i>Save</button>
                  <button data-db-action="reset" data-id="${g.id}" class="admin-action-btn admin-action-toggle" ${p?"":"disabled"}><i class="bi bi-arrow-counterclockwise"></i>Reset</button>
                  <button data-db-action="delete" data-id="${g.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
                </div>
              </td>
            </tr>
          `}).join("")}
      </tbody>
    </table>
  `,$e("databaseFares",t.length,a,s,i),De("databaseFares"),Se()}async function xt(e,{silent:t=!1}={}){const n=ee.find(u=>u.id===e);if(!n)return!1;if(!W[e])return!0;const a=yt(n),s=Be(a.flightDate);if(!a.agentId)return t||x("warning","Missing Agent","Please select an agent before saving."),!1;if(!a.sectorId)return t||x("warning","Missing Sector","Please select a sector before saving."),!1;if(!s)return t||x("warning","Missing Date","Please set a valid flight date before saving."),!1;const c=D(a.specialRate,0),d=Math.max(0,D(a.commission,0)),o=Te(c,d),l={agentId:a.agentId,sectorId:a.sectorId,airlineId:a.airlineId||"",flightDate:s,flightTime:a.flightTime||"",specialRate:c,finalRate:o,commission:d,baggage:le(a.baggage),extraBaggage:D(a.extraBaggage,0),isHidden:a.isHidden===!0};try{return await rt(e,l),ee=ee.map(u=>u.id===e?{...u,...l}:u),delete W[e],t||x("success","Saved","Fare row updated."),!0}catch(u){return t||x("error","Save Failed",u.message),!1}}async function gn(){const e=Object.keys(W);if(!e.length)return;const t=document.getElementById("database-save-all-btn"),n=t==null?void 0:t.innerHTML;t&&(t.disabled=!0,t.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Saving...');let i=0,a=0;for(const s of e)await xt(s,{silent:!0})?i+=1:a+=1;q(),t&&(t.disabled=bt()===0,t.innerHTML=n||"Save All"),a===0?x("success","Saved",`${i} row${i!==1?"s":""} updated.`):x("warning","Partial Save",`${i} saved, ${a} failed. Fix invalid rows and retry.`)}async function pn(){const e=Array.from(Q);if(!e.length||!confirm(`Delete ${e.length} selected fare row${e.length!==1?"s":""}? This cannot be undone.`))return;const t=document.getElementById("database-delete-selected-btn"),n=t==null?void 0:t.innerHTML;t&&(t.disabled=!0,t.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Deleting...');const i=await Promise.allSettled(e.map(c=>Ge(c))),a=[];let s=0;if(i.forEach((c,d)=>{c.status==="fulfilled"?a.push(e[d]):s+=1}),a.length){const c=new Set(a);ee=ee.filter(d=>!c.has(d.id)),a.forEach(d=>{delete W[d],Q.delete(d)})}q(),t&&(t.innerHTML=n||"Delete Selected"),s===0?x("success","Deleted",`${a.length} row${a.length!==1?"s":""} deleted.`):x("warning","Partial Delete",`${a.length} deleted, ${s} failed.`)}function fn(){const e=Ne(new Date);je("Add Fare Row",`
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
            ${z.map(o=>`<option value="${T(o.id)}">${T(o.id)} · ${T(o.name||"Unnamed")}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Sector *</label>
          <select id="db-add-sector" class="admin-control h-10" required>
            <option value="">Select Sector</option>
            ${F.map(o=>`<option value="${T(o.id)}">${T(o.sectorCode||o.id)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Airline</label>
          <select id="db-add-airline" class="admin-control h-10">
            <option value="">No Airline</option>
            ${U.map(o=>`<option value="${T(o.id)}">${T(o.code||"—")} · ${T(o.name||"Unnamed")}</option>`).join("")}
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
          <input id="db-add-comm" type="number" class="admin-control h-10 bg-slate-50 text-slate-500" min="0" step="1" value="0" readonly tabindex="-1">
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
            ${we(Ae,20)}
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
  `);const t=document.getElementById("database-add-form");if(!t)return;const n=document.getElementById("db-add-sp"),i=document.getElementById("db-add-comm"),a=document.getElementById("db-add-rate"),s=document.getElementById("db-add-agent"),c=()=>{if(!a)return;const o=D(n==null?void 0:n.value,0),l=Math.max(0,D(i==null?void 0:i.value,0));a.value=String(Te(o,l))},d=()=>{if(!i)return;const o=ht(s==null?void 0:s.value,0);i.value=String(o),c()};n==null||n.addEventListener("input",c),s==null||s.addEventListener("change",d),d(),c(),t.addEventListener("submit",async o=>{var r,g,m,p,y,v,E,S,f,h,w,k;o.preventDefault();const l=t.querySelector('button[type="submit"]'),u=(l==null?void 0:l.textContent)||"Add Fare";l&&(l.disabled=!0,l.textContent="Adding...");try{const N=((r=document.getElementById("db-add-date"))==null?void 0:r.value)||"",G=ct(N);if(!G)throw new Error("Please provide a valid flight date.");const J=D((g=document.getElementById("db-add-sp"))==null?void 0:g.value,0),X=Math.max(0,D((m=document.getElementById("db-add-comm"))==null?void 0:m.value,0)),K=Te(J,X);await Nt({agentId:((p=document.getElementById("db-add-agent"))==null?void 0:p.value)||"",sectorId:((y=document.getElementById("db-add-sector"))==null?void 0:y.value)||"",airlineId:((v=document.getElementById("db-add-airline"))==null?void 0:v.value)||"",flightDate:G,flightTime:((S=(E=document.getElementById("db-add-time"))==null?void 0:E.value)==null?void 0:S.trim())||"",specialRate:J,finalRate:K,commission:X,baggage:le((f=document.getElementById("db-add-bag"))==null?void 0:f.value),extraBaggage:D((h=document.getElementById("db-add-exbag"))==null?void 0:h.value,0),isHidden:(((w=document.getElementById("db-add-status"))==null?void 0:w.value)||"live")==="hidden"}),(k=document.getElementById("admin-modal"))==null||k.close(),await Xe(!0),x("success","Added","New fare row added.")}catch(N){x("error","Add Failed",N.message),l&&(l.disabled=!1,l.textContent=u)}})}const bn="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",hn={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},st=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let V=null,re=JSON.parse(localStorage.getItem("zt_hist")||"[]"),Ke=re.reduce((e,t)=>e+(t.rows||0),0);function yn(){var t,n,i,a;const e=document.getElementById("rateData");e&&e.addEventListener("input",function(){const s=this.value.length,c=document.getElementById("charCount");c&&(c.textContent=s.toLocaleString()+" character"+(s!==1?"s":"")),de(),clearTimeout(window._previewTimer),s>15?window._previewTimer=setTimeout(()=>vn(this.value),500):Me()}),(t=document.getElementById("resetBtn"))==null||t.addEventListener("click",()=>{e&&(e.value="");const s=document.getElementById("charCount");s&&(s.textContent="0 characters"),Me(),de()}),(n=document.getElementById("clearBtn"))==null||n.addEventListener("click",()=>{re=[],Ke=0,Re(),Ce(),ze()}),(i=document.getElementById("manualAgent"))==null||i.addEventListener("input",function(){const s=parseInt(this.value);V=s>0?String(s):null,document.querySelectorAll(".rp-chip").forEach(c=>c.classList.remove("on")),ke(),de()}),(a=document.getElementById("submitBtn"))==null||a.addEventListener("click",wn),ze(),Ce()}function vt(){const e=document.getElementById("chipGrid");if(!e)return;e.innerHTML="";const t=z.length?[...z].sort((n,i)=>{const a=parseInt(n.id),s=parseInt(i.id);return!isNaN(a)&&!isNaN(s)?a-s:n.id.localeCompare(i.id)}):[];if(!t.length){V=null,e.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>',ke(),de();return}V&&!t.some(n=>n.id===V)&&(V=null),t.forEach(n=>{const i=document.createElement("div");i.className="rp-chip",i.dataset.agentId=n.id,i.textContent=n.id,n.id===V&&i.classList.add("on"),i.addEventListener("click",()=>xn(n.id,n.name,i)),e.appendChild(i)}),ke(),de()}function xn(e,t,n){V=e,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(i=>{i.classList.remove("on")}),n&&n.classList.add("on"),ke(),de()}function ke(){const e=document.getElementById("agentPill");if(e)if(V){const t=z.find(n=>n.id===V);e.textContent=`Agent ${(t==null?void 0:t.id)||V} selected ✓`,e.classList.remove("empty")}else e.textContent="No agent selected",e.classList.add("empty")}function de(){const e=document.getElementById("rateData"),t=document.getElementById("submitBtn");t&&(t.disabled=!(V&&e&&e.value.trim().length>10))}function wt(e){const t=[];let n=null,i="IX";for(const a of e.split(`
`)){const s=a.replace(/[*_~`]/g,"").trim();if(!s)continue;const c=s.match(/([A-Z]{3})\s+([A-Z]{3})/);if(c&&s.length<70&&!s.match(/\d{4,6}/)){n=c[1]+"-"+c[2];const d=s.match(st);d&&(i=d[1]);continue}if(n){const d=s.match(st);if(d&&!s.match(/\d{4,6}/)){i=d[1];continue}const o=s.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(o){const l=parseInt(o[3]);l>=1e3&&l<=99999&&t.push({sector:n,date:`2026-${hn[o[2].toUpperCase()]}-${o[1].padStart(2,"0")}`,airline:d?d[1]:i,rate:l})}}}return t}function vn(e){const t=wt(e);if(!t.length){Me();return}const n=document.getElementById("prevBox");n&&n.classList.add("on");const i=document.getElementById("prevCount");i&&(i.textContent=t.length+" entr"+(t.length===1?"y":"ies"));const a=document.getElementById("prevBody");a&&(a.innerHTML=t.slice(0,60).map(s=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${s.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${s.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${s.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${s.rate.toLocaleString()}</td></tr>`).join(""),t.length>60&&(a.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${t.length-60} more</td></tr>`))}function Me(){var e;(e=document.getElementById("prevBox"))==null||e.classList.remove("on")}async function wn(){const e=document.getElementById("rateData");if(!V||!(e!=null&&e.value.trim()))return;const t=document.getElementById("submitBtn"),n=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI...';const i=document.getElementById("progBar"),a=document.getElementById("progFill");i&&i.classList.add("on");let s=0;const c=setInterval(()=>{s=Math.min(s+Math.random()*13,85),a&&(a.style.width=s+"%")},280),d=wt(e.value),o={id:Date.now(),agent:V,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:d.length,status:"pen"};re.unshift(o),re.length>15&&re.pop(),Re(),Ce();try{const l=await fetch(bn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:V,raw_text:e.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(c),a&&(a.style.width="100%"),l.ok)o.status="ok",Ke+=d.length,Re(),Ce(),ze(),x("success","Submitted","Rates dispatched to AI Agent. The database will reflect parsing results momentarily."),setTimeout(()=>{e.value="";const u=document.getElementById("charCount");u&&(u.textContent="0 characters"),Me(),de()},500);else throw new Error("N8N webhook rejected payload")}catch(l){clearInterval(c),a&&(a.style.width="100%"),o.status="err",Re(),Ce(),x("error","Submission Failed",l.message)}setTimeout(()=>{i&&i.classList.remove("on"),a&&(a.style.width="0%"),t.innerHTML=n,de()},900)}function ze(){const e=document.getElementById("statSubs");e&&(e.textContent=re.length);const t=document.getElementById("statEntries");t&&(t.textContent=Ke)}function Re(){localStorage.setItem("zt_hist",JSON.stringify(re))}function Ce(){const e=document.getElementById("historyWrap");if(e){if(!re.length){e.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}e.innerHTML=re.map(t=>{var i;const n=((i=z.find(a=>a.id===t.agent))==null?void 0:i.name)||`Agent ${t.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${n.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${n}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${t.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${t.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${t.status==="ok"?"bg-green-500":t.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}const $n=210/25.4*96,En=297/25.4*96;function it(){const e=document.getElementById("eticket-output-wrapper"),t=document.getElementById("eticket-print-area");if(!e||!t||e.classList.contains("hidden"))return;t.style.zoom="1",t.style.removeProperty("--eticket-print-scale");const n=Math.max(t.scrollWidth,t.offsetWidth),i=Math.max(t.scrollHeight,t.offsetHeight);if(!n||!i)return;const a=$n/n,s=En/i;let c=Math.min(1,a,s);c<1&&(c=Math.max(.7,c*.985)),t.style.zoom=String(c),t.style.setProperty("--eticket-print-scale",String(c))}function In(){const e=document.getElementById("eticket-print-area");e&&(e.style.zoom="1",e.style.removeProperty("--eticket-print-scale"))}async function Sn(){var d;const e=document.getElementById("eticket-tab");if(!e)return;const t=document.getElementById("eticket-form"),n=document.getElementById("et-add-passenger"),i=document.getElementById("et-passengers-container"),a=document.getElementById("et-airline"),s=document.getElementById("et-origin"),c=document.getElementById("et-destination");if(U.length===0&&(U=await Ve()),F.length===0&&(F=Je(await We())),!e.dataset.wired){if(e.dataset.wired="1",a&&U&&(a.innerHTML='<option value="">Select Airline</option>'+U.map(l=>`<option value="${l.name}">${l.name}</option>`).join("")),s&&F){const l=[...new Set(F.map(u=>u.sectorFrom).filter(Boolean))].sort();s.innerHTML='<option value="">Select Origin</option>'+l.map(u=>`<option value="${u}">${u}</option>`).join("")}if(c&&F){const l=[...new Set(F.map(u=>u.sectorTo).filter(Boolean))].sort();c.innerHTML='<option value="">Select Destination</option>'+l.map(u=>`<option value="${u}">${u}</option>`).join("")}const o=()=>{const l=Array.from(i.querySelectorAll(".et-pax-row"));l.forEach((u,r)=>{const g=u.querySelector(".et-passenger-index");g&&(g.textContent=`Passenger ${r+1}`);const m=u.querySelector(".et-remove-passenger");m&&(l.length<=1?(m.classList.add("opacity-40","pointer-events-none"),m.setAttribute("aria-disabled","true")):(m.classList.remove("opacity-40","pointer-events-none"),m.removeAttribute("aria-disabled")))})};n==null||n.addEventListener("click",()=>{const l=`
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
                ${we(jt,7)}
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
      `;i.insertAdjacentHTML("beforeend",l),o()}),i==null||i.addEventListener("click",l=>{var r;const u=l.target.closest(".et-remove-passenger");u&&((r=u.closest(".et-pax-row"))==null||r.remove(),o())}),i.children.length===0&&(n==null||n.click()),o(),t==null||t.addEventListener("submit",async l=>{l.preventDefault(),await Cn(new FormData(t))}),(d=document.getElementById("et-print-btn"))==null||d.addEventListener("click",()=>{it(),requestAnimationFrame(()=>window.print())}),window.addEventListener("beforeprint",it),window.addEventListener("afterprint",In),t==null||t.addEventListener("reset",()=>{setTimeout(()=>{var l;Array.from(i.children).forEach((u,r)=>{r>0&&u.remove()}),i.children.length===0&&(n==null||n.click()),o(),(l=document.getElementById("eticket-output-wrapper"))==null||l.classList.add("hidden")},10),x("info","Form Reset","The E-Ticket form has been cleared.")})}}async function Cn(e){var Ie,O,M;const t=(Ie=e.get("etPnr"))==null?void 0:Ie.toUpperCase(),n=(O=e.get("etAirline"))==null?void 0:O.toUpperCase(),i=(M=e.get("etFlightNo"))==null?void 0:M.toUpperCase(),a=e.get("etDate"),s=e.get("etDepTime"),c=e.get("etArrTime"),d=e.get("etPhone"),o=($="")=>String($).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),l=$=>{const H=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec($||"");return H?Number(H[1])*60+Number(H[2]):null},u=($="")=>$.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",r=$=>{const H=($||"").trim();let P=H,he="";const Y=H.match(/^(.*?)\s*\((.*?)\)$/);return Y&&(P=Y[1].trim(),he=Y[2].trim()),{city:P,code:he}},g=r(e.get("etOrigin")),m=r(e.get("etDest")),p=e.get("etOrigin")||"—",y=e.get("etDest")||"—";let v="—";if(a){const $=new Date(a);if(!isNaN($.getTime())){const H=["SUN","MON","TUE","WED","THU","FRI","SAT"],P=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];v=`${H[$.getDay()]}, ${String($.getDate()).padStart(2,"0")} ${P[$.getMonth()]} ${$.getFullYear()}`}}const E=$=>document.getElementById($);let S=g.code,f=m.code,h=null;if(typeof F<"u"){if(h=F.find($=>$.sectorFrom===p&&$.sectorTo===y),!h&&p){const $=F.find(H=>H.sectorFrom===p);$&&$.sectorCode&&(S=$.sectorCode.split(/[ -]+/)[0])}if(!h&&y){const $=F.find(H=>H.sectorTo===y);$&&$.sectorCode&&(f=$.sectorCode.split(/[ -]+/).pop())}}const w=(S||u(g.city)).toUpperCase(),k=(f||u(m.city)).toUpperCase(),N=`${w} - ${k}`,G=`${(g.city||p).toUpperCase()} to ${(m.city||y).toUpperCase()}`,J=(g.city||p).toUpperCase(),X=(m.city||y).toUpperCase(),K=l(s),ce=l(c);let me="N/A";if(K!==null&&ce!==null){let $=ce-K;$<0&&($+=24*60);const H=Math.floor($/60),P=$%60;me=`${H}h ${String(P).padStart(2,"0")}m`}E("t-pnr")&&(E("t-pnr").textContent=t||"—"),E("t-issued-by")&&(E("t-issued-by").textContent=n||"—"),E("t-customer-phone")&&(E("t-customer-phone").textContent=d||"—"),E("t-flight-code")&&(E("t-flight-code").textContent=i||"—"),E("t-travel-date")&&(E("t-travel-date").textContent=v||"—"),E("t-route-code")&&(E("t-route-code").textContent=N),E("t-route-long")&&(E("t-route-long").textContent=G),E("t-duration")&&(E("t-duration").textContent=me);const b=new Date,C=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],A=`${String(b.getDate()).padStart(2,"0")} ${C[b.getMonth()]} ${b.getFullYear()} ${String(b.getHours()).padStart(2,"0")}:${String(b.getMinutes()).padStart(2,"0")}`;E("t-booked-on")&&(E("t-booked-on").textContent=A);const R=E("t-airline-logo"),L=E("t-issued-by-fallback");if(R){const $=typeof U<"u"?U.find(H=>H.name.toUpperCase()===n):null;$&&$.logoUrl?(R.src=$.logoUrl,R.classList.remove("hidden"),L&&L.classList.add("hidden")):(R.removeAttribute("src"),R.classList.add("hidden"),L&&(L.classList.remove("hidden"),L.textContent=(n||"No logo").toUpperCase()))}const Ee=e.getAll("paxTitle[]"),Z=e.getAll("paxName[]"),fe=e.getAll("paxType[]"),ue=e.getAll("paxCheckBag[]"),te=e.getAll("paxCarryBag[]");E("t-pax-count")&&(E("t-pax-count").textContent=String(Z.length));const _=document.getElementById("t-passengers-tbody");if(_){const $=Z.map((H,P)=>{const he=o((Ee[P]||"MR").toUpperCase()),Y=o((Z[P]||"").toUpperCase()),Ue=o((fe[P]||"ADT").toUpperCase()),Fe=o(nt(ue[P])),ye=o(nt(te[P])),xe=h&&h.sectorCode?o(h.sectorCode.toUpperCase()):o(N);return`
        <tr class="${P%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${P+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${he}. ${Y}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Ue}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${xe}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${o(i||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${o(t||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${ye}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Fe}</td>
        </tr>
      `}).join("");_.innerHTML=$||`
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `}const ne=document.getElementById("t-travel-tbody");ne&&(ne.innerHTML=`
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${o(i||"—")}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${o(J)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${o(w)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${o(s||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${o(v||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${o(X)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${o(k)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${o(c||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${o(v||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const be=document.getElementById("eticket-output-wrapper");be&&(be.classList.remove("hidden"),be.scrollIntoView({behavior:"smooth"}))}const ot={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function x(e,t,n){const i=document.getElementById("toastsEl");if(!i)return;const a=document.createElement("div"),s={success:"border-emerald-200 bg-emerald-50/95 text-emerald-900",error:"border-rose-200 bg-rose-50/95 text-rose-900",warning:"border-amber-200 bg-amber-50/95 text-amber-900",info:"border-blue-200 bg-blue-50/95 text-blue-900"};a.className=`flex items-start gap-3 p-4 border rounded-xl shadow-md w-80 pointer-events-auto backdrop-blur-sm ${s[e]||s.error}`,a.innerHTML=`<div class="mt-0.5">${ot[e]||ot.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${t}</div><div class="text-xs opacity-90 mt-1">${n}</div></div>
    <button class="opacity-50 hover:opacity-100 transition-opacity" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,i.appendChild(a),setTimeout(()=>a.isConnected&&a.remove(),7e3)}window.toast=x;document.addEventListener("DOMContentLoaded",()=>{});
