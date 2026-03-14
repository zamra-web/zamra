import"./index.esm-kRT_WKqT.js";import{o as Ke,l as Ze}from"./auth-VX5YvVyg.js";import{a as Gt,d as ie,u as Ce,c as Be,e as Qe,f as ta,h as ea,i as aa,g as oe,j as na,k as sa,l as ia,m as oa,b as re,n as ra,o as da,p as la,q as ca,r as Ae,s as ma,t as ua,v as pa,w as ga,x as fa,y as ba,z as ha,A as ya,B as va,C as xa,D as wa,E as $a,F as Ea,G as Ia,H as Sa,I as Ca,J as Ba,K as Aa,L as La,M as Ta,N as ka,O as Da,P as Ma,Q as Fa}from"./db-C0m7-YSF.js";import"./firebase-config-aHS-3htW.js";async function ve(t,e,a,s,i){const n=`Generating ${t} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",n),new Promise(async(d,r)=>{try{let at=function(y,A,L,U,N){c.beginPath(),c.moveTo(y+N,A),c.lineTo(y+L-N,A),c.arcTo(y+L,A,y+L,A+N,N),c.lineTo(y+L,A+U-N),c.arcTo(y+L,A+U,y+L-N,A+U,N),c.lineTo(y+N,A+U),c.arcTo(y,A+U,y,A+U-N,N),c.lineTo(y,A+N),c.arcTo(y,A,y+N,A,N),c.closePath()},st=function(y){const A=y-$t;if(A>vt){try{Q.stop()}catch(D){console.error("Error stopping recorder",D)}return}c.fillStyle="#f8fafc",c.fillRect(0,0,o,l);const L=t==="9x16"?400:300;if(c.fillStyle="#1e293b",c.fillRect(0,0,o,L),C.complete&&C.width>0){c.globalAlpha=.2;const D=Math.max(o/C.width,L/C.height),j=C.width*D,Z=C.height*D,Pt=(o-j)/2,It=(L-Z)/2;c.drawImage(C,Pt,It,j,Z),c.globalAlpha=1}const U=c.createLinearGradient(0,0,0,L);U.addColorStop(0,"#1e293b"),U.addColorStop(1,"transparent"),c.fillStyle=U,c.globalAlpha=.8,c.fillRect(0,0,o,L),c.globalAlpha=1,c.textAlign="center",c.textBaseline="middle";const N=c.createLinearGradient(0,0,o,0);N.addColorStop(0,"#2563eb"),N.addColorStop(.5,"#60a5fa"),N.addColorStop(1,"#1558c0"),c.fillStyle=N,c.fillRect(0,0,o,16);const Et=200,it=40,yt=60;c.fillStyle="rgba(37, 99, 235, 0.4)",at(o/2-Et/2,yt,Et,it,20),c.fill(),c.strokeStyle="rgba(37, 99, 235, 0.6)",c.lineWidth=1,c.stroke(),c.fillStyle="#bfdbfe",c.font="bold 16px Arial, sans-serif",c.fillText("EXCLUSIVE DEALS",o/2,yt+it/2),c.fillStyle="#ffffff",c.font="900 "+(t==="16x9"?"70px":"56px")+" Arial, sans-serif",c.fillText(x,o/2,yt+80),c.fillStyle="#dbeafe",c.font="700 24px Arial, sans-serif",c.fillText("SPECIAL FARES AVAILABLE NOW",o/2,yt+140);const ct=L+60,tt=90,G=t==="9x16"?40:t==="1x1"?80:160,B=o-G*2;c.fillStyle="#64748b",c.font="bold 18px Arial, sans-serif",c.textAlign="left",c.fillText("DATE",G+20,ct-20),c.textAlign="center",c.fillText("SECTOR",G+B*.25,ct-20),c.fillText("AIRLINE",G+B*.45,ct-20),c.fillText("TIME",G+B*.65,ct-20),c.textAlign="right",c.fillText("FARE",G+B-20,ct-20);for(let D=0;D<E.length;D++){const j=E[D],Z=1e3+D*800;if(A<Z)continue;const It=Math.min(1,(A-Z)/500),Xt=20*(1-It),ot=ct+D*tt+Xt;c.globalAlpha=It,D%2===0&&(c.fillStyle="#ffffff",at(G,ot,B,tt-10,12),c.fill()),c.fillStyle="#0f172a",c.textBaseline="middle";const ue=j.flightDate instanceof Date?j.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():j.flightDate;c.textAlign="left",c.font="900 26px Arial, sans-serif",c.fillText(ue,G+20,ot+tt/2-5),c.font="700 22px Arial, sans-serif",c.fillStyle="#2563eb",c.textAlign="center";const Ye=g[j.sectorId]||j.sectorId;c.fillText(Ye,G+B*.25,ot+tt/2-5),c.fillStyle="#0f172a";const pe=G+B*.45,At=v(j.airlineId),Ut=At?P[At.id]:null;if(Ut&&Ut.width>0){const xt=Math.min(100,Ut.width),ye=40;c.drawImage(Ut,pe-xt/2,ot+tt/2-5-ye/2,xt,ye)}else{c.font="700 20px Arial, sans-serif",c.textAlign="center";const xt=(At==null?void 0:At.name)||j.airlineId||"—";c.fillText(xt,pe,ot+tt/2-5)}let qt=j.flightTime||"—";if(qt.includes("-")){const xt=qt.split("-");qt=`${xt[0].trim()} - ${xt[1].trim()}`}c.font="800 22px Arial, sans-serif",c.textAlign="center",c.fillText(qt,G+B*.65,ot+tt/2-5);const ge=`₹${(j.finalRate||0).toLocaleString()}`;c.font="900 26px Arial, sans-serif",c.textAlign="right";const Xe=c.measureText(ge).width,fe=G+B-20,be=Xe+40,he=50;c.fillStyle="#0f172a",at(fe-be,ot+tt/2-5-he/2,be,he,12),c.fill(),c.fillStyle="#ffffff",c.fillText(ge,fe-20,ot+tt/2-5),c.globalAlpha=1}const q=1e3+E.length*800+500;if(A>q){const D=Math.min(1,(A-q)/500);c.globalAlpha=D;const j=100,Z=l-j+20*(1-D);c.fillStyle="#ffffff",c.fillRect(0,l-j,o,j),c.fillRect(0,Z,o,j),c.fillStyle="#f1f5f9",c.fillRect(0,l-j,o,2),T.complete&&T.width>0&&c.drawImage(T,G,l-j/2-24,48,48),c.fillStyle="#1e293b",c.font="900 24px Arial, sans-serif",c.textAlign="left",c.textBaseline="middle",c.fillText("Zamra Travels",G+64,l-j/2),c.font="700 20px Arial, sans-serif",c.textAlign="right",c.fillText("zamratravels.com  |  +91 98466 06739",o-G,l-j/2),c.globalAlpha=1}requestAnimationFrame(st)},o,l;if(t==="1x1")o=1080,l=1080;else if(t==="9x16")o=1080,l=1920;else if(t==="16x9")o=1920,l=1080;else throw new Error("Invalid ratio selected");const m=document.createElement("canvas");m.width=o,m.height=l;const c=m.getContext("2d");c.imageSmoothingEnabled=!0;let x="MULTIPLE → SECTORS";if(a!=="all"){const y=s.find(U=>U.id===a),A=y?(y.sectorFrom||"DEP").toUpperCase():"DEP",L=y?(y.sectorTo||"ARR").toUpperCase():"ARR";x=`${A} → ${L}`}const u=new Map;e.forEach(y=>{const A=y.flightDate instanceof Date?y.flightDate.getTime():y.flightDate,L=`${y.sectorId}_${y.airlineId}_${A}_${y.flightTime}`;u.has(L)?y.finalRate<u.get(L).finalRate&&u.set(L,y):u.set(L,y)});const E=Array.from(u.values()).sort((y,A)=>{let L=y.flightDate,U=A.flightDate;return L instanceof Date&&(L=L.getTime()),U instanceof Date&&(U=U.getTime()),L-U}),p={};i.forEach(y=>{y.id&&(p[y.id.trim().toLowerCase()]=y),y.code&&(p[y.code.trim().toLowerCase()]=y),y.name&&(p[y.name.trim().toLowerCase()]=y)});const v=y=>y?p[String(y).trim().toLowerCase()]:null,g={};s.forEach(y=>{g[y.id]=y.sectorCode||y.id});const f=y=>String(y||"").trim().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"").toLowerCase();let b="all-sectors";if(a!=="all"){const y=s.find(L=>L.id===a),A=(y==null?void 0:y.sectorCode)||(y?`${y.sectorFrom||""}-${y.sectorTo||""}`:"")||g[a]||a;b=f(A)||f(a)||"sector"}async function w(y){if(!y)return null;try{const A=await fetch(y);if(!A.ok)return null;const L=await A.blob(),U=URL.createObjectURL(L);return new Promise((N,Et)=>{const it=new Image;it.onload=()=>N(it),it.onerror=()=>N(null),it.src=U})}catch{return null}}const C=new Image;await new Promise(y=>{C.onload=y,C.onerror=y,C.src="/assets/img/hero-bg.webp"});const T=new Image;await new Promise(y=>{T.onload=y,T.onerror=y,T.src="/assets/img/logo.webp"});const P={},_=[...new Set(E.map(y=>y.airlineId))].map(y=>v(y)).filter(y=>y&&y.logoUrl);await Promise.all(_.map(async y=>{const A=await w(y.logoUrl);A&&(P[y.id]=A)}));const k=m.captureStream(30);let H="video/mp4";MediaRecorder.isTypeSupported(H)||(H="video/webm; codecs=h264",MediaRecorder.isTypeSupported(H)||(H="video/webm"));const Q=new MediaRecorder(k,{mimeType:H}),V=[];Q.ondataavailable=y=>{y.data&&y.data.size>0&&V.push(y.data)},Q.start(100);const vt=1e4+E.length*1500,$t=performance.now();requestAnimationFrame(st),Q.onstop=()=>{const y=new Blob(V,{type:H}),A=URL.createObjectURL(y),L=document.createElement("a");L.href=A,L.download=`zamra-video-${t}-${b}-${Date.now()}.mp4`,L.style.display="none",document.body.appendChild(L),L.click(),setTimeout(()=>{document.body.removeChild(L),URL.revokeObjectURL(A)},100),window.toast&&window.toast("success","Video Generated",`Your ${t} video has been downloaded!`),d()},Q.onerror=y=>{console.error("Recorder Error:",y),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),r(y)}}catch(o){console.error(o),window.toast&&window.toast("error","Generation Failed",o.message),r(o)}})}let Y=[],M=[],O=[],_t=[],Zt=[],Qt=[],te=[],ee=[],ae=[],W=[],et=[],X={},nt=new Set,mt=new Set;function St(t){return t==null?t:String(t).replace(/damamm/gi,e=>e===e.toUpperCase()?"DAMMAM":e===e.toLowerCase()?"dammam":"Dammam")}function Le(t={}){return{...t,sectorFrom:St(t.sectorFrom||""),sectorTo:St(t.sectorTo||""),sectorCode:St(t.sectorCode||"")}}function de(t=[]){return t.map(e=>Le(e))}function S(t=""){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function R(t,e=0){const a=Number(t);return Number.isFinite(a)?a:e}const Te=[5,7,10],Vt=[20,25,30,35,40];function Ct(t=[],e=0){const a=Math.max(0,ht(e)),s=[...new Set(t.map(n=>Math.max(0,ht(n))))].filter(n=>n>0).sort((n,d)=>n-d);if(!s.length)return"";const i=s.includes(a)?a:s[0];return s.map(n=>`<option value="${n}" ${n===i?"selected":""}>${n} Kg</option>`).join("")}function ht(t){if(t==null||t==="")return 0;const e=parseFloat(String(t).replace(/[^\d.]/g,""));return Number.isFinite(e)?e:0}function xe(t,e="—"){if(t==null||t==="")return e;const a=String(t).trim();return a?/^\d+(\.\d+)?(\s*kg)?$/i.test(a)?`${ht(a)} Kg`:a.toUpperCase():e}function Mt(t){if(!t)return null;if(t instanceof Date)return Number.isNaN(t.getTime())?null:t;const e=new Date(t);return Number.isNaN(e.getTime())?null:e}function Ft(t){const e=Mt(t);if(!e)return"";const a=e.getTimezoneOffset();return new Date(e.getTime()-a*60*1e3).toISOString().split("T")[0]}function ke(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e}function ja(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e.getTime()}function Ra(t){if(!t)return null;const e=new Date(`${t}T23:59:59.999`);return Number.isNaN(e.getTime())?null:e.getTime()}let rt={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},visas:{key:"countryName",asc:!0},visaStampings:{key:"country",asc:!0},attestations:{key:"country",asc:!0},passportServices:{key:"type",asc:!0},tours:{key:"title",asc:!0},hajjUmrah:{key:"title",asc:!0},reportFares:{key:"flightDate",asc:!0},databaseFares:{key:"flightDate",asc:!0}},Wt={agents:"",sectors:"",airlines:"",visas:"",visaStampings:"",attestations:"",passportServices:"",tours:"",hajjUmrah:""},I={agents:1,sectors:1,airlines:1,visas:1,visaStampings:1,attestations:1,passportServices:1,tours:1,hajjUmrah:1,reportFares:1,databaseFares:1},J={agents:10,sectors:25,airlines:10,visas:10,visaStampings:10,attestations:10,passportServices:10,tours:10,hajjUmrah:10,reportFares:10,databaseFares:25};const F={search:"",agentId:"all",sectorId:"all",airlineId:"all",status:"all",startDate:"",endDate:""};function ut(t,e){var d;let a=t;const s=(d=Wt[e])==null?void 0:d.toLowerCase();s&&e==="agents"?a=a.filter(r=>(r.name||"").toLowerCase().includes(s)||(r.email||"").toLowerCase().includes(s)||(r.contactPhone||"").toLowerCase().includes(s)||(r.id||"").toLowerCase().includes(s)):s&&e==="sectors"?a=a.filter(r=>(r.sectorFrom||"").toLowerCase().includes(s)||(r.sectorTo||"").toLowerCase().includes(s)||(r.sectorCode||"").toLowerCase().includes(s)):s&&e==="airlines"?a=a.filter(r=>(r.name||"").toLowerCase().includes(s)||(r.code||"").toLowerCase().includes(s)):s&&e==="visas"?a=a.filter(r=>(r.countryName||"").toLowerCase().includes(s)||(r.visaType||"").toLowerCase().includes(s)):s&&e==="visaStampings"?a=a.filter(r=>(r.country||"").toLowerCase().includes(s)||(r.description||"").toLowerCase().includes(s)):s&&e==="attestations"?a=a.filter(r=>(r.country||"").toLowerCase().includes(s)||(r.certificate||"").toLowerCase().includes(s)):s&&e==="passportServices"?a=a.filter(r=>(r.type||"").toLowerCase().includes(s)||(r.description||"").toLowerCase().includes(s)):s&&e==="tours"?a=a.filter(r=>(r.title||"").toLowerCase().includes(s)||(r.category||"").toLowerCase().includes(s)||(r.duration||"").toLowerCase().includes(s)):s&&e==="hajjUmrah"&&(a=a.filter(r=>(r.title||"").toLowerCase().includes(s)||(r.type||"").toLowerCase().includes(s)||(r.departureCity||"").toLowerCase().includes(s)||(r.airline||"").toLowerCase().includes(s)));const{key:i,asc:n}=rt[e];return i&&(a=[...a].sort((r,o)=>{let l=r[i],m=o[i];if(l instanceof Date&&(l=l.getTime()),m instanceof Date&&(m=m.getTime()),i==="id"){const c=parseInt(l),x=parseInt(m);if(!isNaN(c)&&!isNaN(x))return n?c-x:x-c}return typeof l=="string"&&(l=l.toLowerCase()),typeof m=="string"&&(m=m.toLowerCase()),l<m?n?-1:1:l>m?n?1:-1:0})),a}function Ht(t){document.querySelectorAll(`th[data-sort-tab="${t}"] i`).forEach(a=>{a.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const e=document.querySelector(`th[data-sort-tab="${t}"][data-sort-key="${rt[t].key}"]`);if(e){const a=e.querySelector("i");a&&(a.className=`bi bi-arrow-${rt[t].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",t=>{const e=t.target.closest("th[data-sort-tab]");if(!e)return;const a=e.dataset.sortTab,s=e.dataset.sortKey;rt[a].key===s?rt[a].asc=!rt[a].asc:(rt[a].key=s,rt[a].asc=!0),a==="agents"?pt(!1):a==="sectors"?gt(!1):a==="airlines"?wt(!1):a==="visas"?lt(!1):a==="tours"?Jt(!1):a==="hajjUmrah"?Yt(!1):a==="reportFares"&&W.length?jt(W):a==="databaseFares"&&z()});document.documentElement.style.visibility="hidden";Ke(async t=>{if(!t){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const e=document.getElementById("admin-user-name");e&&(e.textContent=t.email.split("@")[0]),await Na(),qe(),await De()});document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("admin-logout-btn");t&&t.addEventListener("click",async()=>{(await Ze()).success&&(window.location.href="/login.html")}),Pa(),Ha(),un()});async function Na(){try{const[t,e,a,s]=await Promise.all([Be(),oe(),re(),Ae()]);Y=t,M=de(e),O=a,_t=s}catch(t){console.error("loadGlobalData error:",t)}}function Ha(){const t=document.querySelectorAll(".nav-link"),e=document.querySelectorAll(".tab-content"),a=document.getElementById("page-title");t.forEach(s=>{s.addEventListener("click",async i=>{var r;i.preventDefault(),t.forEach(o=>{o.classList.remove("active","text-primary"),o.classList.add("text-text-muted")}),s.classList.remove("text-text-muted"),s.classList.add("active","text-primary");const n=s.getAttribute("data-tab"),d=s.getAttribute("data-title");e.forEach(o=>o.classList.remove("active")),(r=document.getElementById(n))==null||r.classList.add("active"),a&&d&&(a.textContent=d),await De()})})}async function De(){const t=document.querySelector(".tab-content.active");if(!t)return;const e=t.id;e==="agents-tab"?await pt():e==="sectors-tab"?await gt():e==="flights-tab"?await wt():e==="dashboard-tab"?await Ua():e==="reports-tab"?await Ja():e==="database-tab"?await ce():e==="visas-tab"?await lt():e==="tours-tab"?await Jt():e==="hajjumrah-tab"?await Yt():e==="agent-sheets-tab"?(qe(),Nt(),bt()):e==="eticket-tab"&&await vn()}function Pa(){const t=document.getElementById("admin-modal"),e=document.getElementById("modal-close-btn");e&&e.addEventListener("click",()=>t.close()),t==null||t.addEventListener("click",a=>{a.target===t&&t.close()})}function dt(t,e,a=!1){const s=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=t,s.classList.toggle("max-w-lg",!a),s.classList.toggle("max-w-2xl",a);const i=document.getElementById("modal-body");i.innerHTML=e,s.showModal()}async function Ua(){var s,i,n,d,r;if(!document.getElementById("dashboard-tab"))return;const e=document.getElementById("poster-sector-sel");e&&e.options.length<=2&&M.forEach(o=>{const l=new Option(o.sectorCode,o.id);e.appendChild(l)});const a=document.getElementById("poster-generate-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",async()=>{const o=document.getElementById("poster-start-date"),l=document.getElementById("poster-end-date"),m=e==null?void 0:e.value,c=(o==null?void 0:o.value)||null,x=(l==null?void 0:l.value)||null;if(!m){$("warning","Validation Error","Please select a sector to generate the poster.");return}a.disabled=!0,a.textContent="Generating…";try{const u=await Gt({sectorId:m,startDate:c,endDate:x,includeHidden:!1});if(!u||!u.length){$("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await qa(u,m)}catch(u){$("error","Generation Failed",u.message)}finally{a.disabled=!1,a.textContent="Generate Poster"}}),(s=document.getElementById("poster-download-jpg"))==null||s.addEventListener("click",()=>we("jpeg")),(i=document.getElementById("poster-download-pdf"))==null||i.addEventListener("click",()=>we("pdf")),(n=document.getElementById("poster-download-vid-1x1"))==null||n.addEventListener("click",()=>Kt("1x1")),(d=document.getElementById("poster-download-vid-9x16"))==null||d.addEventListener("click",()=>Kt("9x16")),(r=document.getElementById("poster-download-vid-16x9"))==null||r.addEventListener("click",()=>Kt("16x9")))}async function Kt(t){const e=document.getElementById("poster-sector-sel"),a=document.getElementById("poster-start-date"),s=document.getElementById("poster-end-date"),i=e==null?void 0:e.value,n=(a==null?void 0:a.value)||null,d=(s==null?void 0:s.value)||null;if(!i){$("warning","Validation Error","Please select a sector to generate the poster.");return}try{const r=await Gt({sectorId:i,startDate:n,endDate:d,includeHidden:!1});if(!r||!r.length){$("warning","No Fares","No live fares found for the selected sector and dates.");return}if(i==="all"){const o=new Map;r.forEach(u=>{const h=u.sectorId||"unknown";o.has(h)||o.set(h,[]),o.get(h).push(u)});const l=new Map(M.map((u,h)=>[u.id,h])),m=Array.from(o.keys()).sort((u,h)=>{const E=l.get(u)??1e9,p=l.get(h)??1e9;return E!==p?E-p:String(u).localeCompare(String(h))});$("info","Video Generation",`Generating ${m.length} videos. This may take a while…`);let c=0,x=0;for(const u of m){const h=o.get(u)||[];if(h.length)try{await ve(t,h,u,M,O),c+=1}catch(E){x+=1,console.error("Video generation failed for sector",u,E)}}c&&$("success","Video Generation",`Downloaded ${c} videos successfully.`),x&&$("error","Video Generation",`${x} videos failed to generate. Check console for details.`);return}await ve(t,r,i,M,O)}catch(r){console.error("Video generation failed",r),$("error","Generation Failed",r.message||"Video generation failed.")}}async function qa(t,e){const a=document.getElementById("poster-preview-container"),s=document.getElementById("poster-render-stack"),i=document.querySelector('[data-poster-template="1"]')||document.getElementById("poster-render-frame");if(!a||!s||!i)return;s.querySelectorAll('[data-poster-clone="1"]').forEach(g=>g.remove());const n=new Map;t.forEach(g=>{const f=g.flightDate instanceof Date?g.flightDate.getTime():g.flightDate,b=`${g.sectorId}_${g.airlineId}_${f}_${g.flightTime}`;n.has(b)?g.finalRate<n.get(b).finalRate&&n.set(b,g):n.set(b,g)});const r=Array.from(n.values()).sort((g,f)=>{let b=g.flightDate,w=f.flightDate;return b instanceof Date&&(b=b.getTime()),w instanceof Date&&(w=w.getTime()),b-w}),o={};O.forEach(g=>{g.id&&(o[g.id.trim().toLowerCase()]=g),g.code&&(o[g.code.trim().toLowerCase()]=g),g.name&&(o[g.name.trim().toLowerCase()]=g)});const l=g=>g?o[String(g).trim().toLowerCase()]:null;async function m(g){try{const f=await fetch(g);if(!f.ok)return null;const b=await f.blob();return URL.createObjectURL(b)}catch{return null}}const c=[...new Set(r.map(g=>g.airlineId))].map(g=>l(g)).filter(g=>g&&g.logoUrl),x={};await Promise.all(c.map(async g=>{const f=await m(g.logoUrl);f&&(x[g.id]=f)}));const u={};M.forEach(g=>u[g.id]=g.sectorCode);const h=g=>String(g||"").trim().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"").toLowerCase(),E=(g,f,b)=>{const w=g.querySelector("[data-poster-title]")||g.querySelector("#poster-sector-title"),C=g.querySelector("[data-poster-tbody]")||g.querySelector("#poster-fares-tbody");if(!w||!C)return;const T=M.find(k=>k.id===b);let P=T?(T.sectorFrom||"DEP").toUpperCase():"DEP",_=T?(T.sectorTo||"ARR").toUpperCase():"ARR";if(!T){const k=u[b]||b,H=String(k).match(/^\s*([A-Za-z0-9]+)\s*[-→>]\s*([A-Za-z0-9]+)\s*$/);H?(P=H[1].toUpperCase(),_=H[2].toUpperCase()):(P=String(k).toUpperCase(),_="")}w.innerHTML=_?`${P} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${_}`:`${P}`,C.innerHTML=f.map((k,H)=>{const Q=k.flightDate instanceof Date?k.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():k.flightDate,V=l(k.airlineId),vt=H%2===0?"#ffffff":"#f8fafc",$t=V?x[V.id]:null,at=$t?`<img src="${$t}" style="height:24px;max-width:80px;object-fit:contain;display:block;margin:0 auto;" alt="${(V==null?void 0:V.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:13px;white-space:nowrap;">${(V==null?void 0:V.name)||k.airlineId||"—"}</span>`,st=`<span style="font-weight:700;color:#2563eb;background-color:rgba(37,99,235,0.1);padding:4px 8px;border-radius:6px;font-size:12px;text-align:center;white-space:nowrap;">${u[k.sectorId]||k.sectorId}</span>`;let y='<span style="color:#94a3b8;font-size:13px;">—</span>';if(k.flightTime){const A=k.flightTime.split("-").map(L=>L.trim());A.length>=2?y=`<span style="font-weight:700;font-size:13px;color:#0f172a;white-space:nowrap;">${A[0]} - ${A[1]}</span>`:y=`<span style="font-weight:700;font-size:13px;color:#0f172a;white-space:nowrap;">${k.flightTime}</span>`}return`
        <tr style="background-color:${vt};border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 8px;font-weight:700;color:#0f172a;font-size:13px;white-space:nowrap;">${Q}</td>
          <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${st}</td>
          <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${at}</td>
          <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${y}</td>
          <td style="padding:10px 8px;text-align:right;vertical-align:middle;">
            <div style="display:inline-block;color:#0f172a;font-weight:900;font-size:15px;">
              &#8377;${(k.finalRate||0).toLocaleString()}
            </div>
          </td>
        </tr>`}).join("")},p=new Map;r.forEach(g=>{const f=g.sectorId||"unknown";p.has(f)||p.set(f,[]),p.get(f).push(g)});let v=[];if(e==="all"){v=Array.from(p.keys());const g=new Map(M.map((f,b)=>[f.id,b]));v.sort((f,b)=>{const w=g.get(f)??1e9,C=g.get(b)??1e9;return w!==C?w-C:String(f).localeCompare(String(b))})}else v=[e];v.forEach((g,f)=>{const b=p.get(g)||[];if(!b.length)return;let w=i;if(f>0){w=i.cloneNode(!0),w.dataset.posterClone="1",w.removeAttribute("data-poster-template"),w.querySelectorAll("#poster-sector-title, #poster-fares-tbody").forEach(P=>P.removeAttribute("id"));const C=u[g]||g,T=h(C)||`sector-${f+1}`;w.id=`poster-render-frame-${T}-${f+1}`,s.appendChild(w)}else w.id="poster-render-frame";w.dataset.posterFrame="1",w.dataset.sectorId=g,w.dataset.sectorCode=u[g]||g,E(w,b,g)}),a.classList.remove("hidden"),a.classList.add("flex")}function Me(t){if(!t||t.nodeType!==1)return;const e=window.getComputedStyle(t),a=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const s of a){const i=e.getPropertyValue(s);if(i&&!i.startsWith("rgb")&&!i.startsWith("#")&&i!=="transparent"&&i!=="initial")try{t.style[s]=i}catch{}}for(const s of t.children)Me(s)}async function we(t){const e=document.getElementById("poster-render-stack"),a=e?Array.from(e.querySelectorAll('[data-poster-frame="1"]')):[];if(!a.length)return;const s=document.getElementById("poster-download-jpg"),i=document.getElementById("poster-download-pdf");s&&(s.disabled=!0),i&&(i.disabled=!0);const n=m=>String(m||"").trim().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"").toLowerCase(),d=Date.now(),r=a.length>1;$("info","Generating Export",r?`Rendering ${a.length} posters. Your browser may ask to allow multiple downloads…`:"Please wait while we render your poster…");let o=0,l=null;for(let m=0;m<a.length;m++){const c=a[m],x=c.style.transform;c.style.transform="none";try{await Promise.all(Array.from(c.querySelectorAll("img")).map(g=>g.complete?Promise.resolve():new Promise(f=>{g.onload=f,g.onerror=f})));const u=await html2canvas(c,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:g=>{const f=c.id?g.getElementById(c.id):null;f&&Me(f)}}),h=u.toDataURL("image/jpeg",.95),E=c.dataset.sectorCode||c.dataset.sectorId||`poster-${m+1}`,v=`zamra-poster-${n(E)||`poster-${m+1}`}-${d}`;if(t==="jpeg"){const g=document.createElement("a");g.download=`${v}.jpg`,g.href=h,g.click()}else if(t==="pdf"){const g=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!g)throw new Error("jsPDF library not loaded.");const f=96/25.4,b=u.width/2/f,w=u.height/2/f,C=new g({orientation:b>w?"landscape":"portrait",unit:"mm",format:[b,w]});C.addImage(h,"JPEG",0,0,b,w),C.save(`${v}.pdf`)}o+=1}catch(u){console.error("Poster export error:",u),l||(l=u)}finally{c.style.transform=x}}if(o){const m=r?`Downloaded ${o} ${t==="pdf"?"PDFs":"JPEGs"} successfully.`:`${t==="pdf"?"PDF":"JPEG"} poster saved successfully.`;$("success","Downloaded!",m)}l&&$("error","Export Failed",l.message||"There was an error generating the export."),s&&(s.disabled=!1),i&&(i.disabled=!1)}function jt(t){const e=document.getElementById("report-fares-results");if(!e)return;if(!t||!t.length){e.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-inbox"></i>
        </div>
        <p class="admin-empty-state-title">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const a=Object.fromEntries(Y.map(u=>[u.id,u.name])),s=Object.fromEntries(M.map(u=>[u.id,u.sectorCode])),i=Object.fromEntries(O.map(u=>[u.id,u.code])),{key:n,asc:d}=rt.reportFares,r=[...t].sort((u,h)=>{let E=u[n],p=h[n];return E instanceof Date&&(E=E.getTime()),p instanceof Date&&(p=p.getTime()),typeof E=="string"&&(E=E.toLowerCase()),typeof p=="string"&&(p=p.toLowerCase()),E<p?d?-1:1:E>p?d?1:-1:0}),o=J.reportFares,l=Math.max(1,Math.ceil(t.length/o));I.reportFares>l&&(I.reportFares=l);const m=(I.reportFares-1)*o,c=r.slice(m,m+o),x=(u,h)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${u}">${h} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;e.innerHTML=`
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
          ${c.map((u,h)=>{const E=u.flightDate instanceof Date?u.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):u.flightDate||"—";return`<tr class="${h%2===1?"bg-slate-50/60":""} hover:bg-slate-100/80 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${E}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${u.flightTime||"—"}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${s[u.sectorId]||u.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${i[u.airlineId]||u.airlineId}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${a[u.agentId]||u.agentId}</td>
              <td class="whitespace-nowrap text-[13px] text-text-muted">₹${(u.specialRate||0).toLocaleString()}</td>
              <td class="whitespace-nowrap font-black text-navy text-[14px]">₹${(u.finalRate||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px] text-text-muted" id="comm-${u.id}">₹${(u.commission||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px]">${u.baggage?u.baggage+" kg":"—"}</td>
              <td class="whitespace-nowrap text-[12px]">${u.extraBaggage?u.extraBaggage+" kg":"—"}</td>
              <td class="whitespace-nowrap">
                <span class="admin-status-pill ${u.isHidden?"admin-status-hidden":"admin-status-live"}">
                  ${u.isHidden?"● Hidden":"● Live"}
                </span>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  <button onclick="window.__toggleFare('${u.id}', ${!u.isHidden})"
                    class="admin-action-btn ${u.isHidden?"admin-action-show":"admin-action-toggle"}">
                    <i class="bi ${u.isHidden?"bi-eye":"bi-eye-slash"}"></i>${u.isHidden?"Show":"Hide"}
                  </button>
                  <button onclick="window.__deleteFare('${u.id}')"
                    class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Del</button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,Bt("reportFares",t.length,l,m,o),window.__deleteFare=async u=>{if(confirm("Delete this fare?"))try{await ie(u),W=W.filter(h=>h.id!==u),$("success","Deleted","Fare removed."),jt(W)}catch(h){$("error","Error",h.message)}},window.__toggleFare=async(u,h)=>{try{await Ce(u,{isHidden:h}),W=W.map(E=>E.id===u?{...E,isHidden:h}:E),$("success","Updated",`Fare ${h?"hidden":"shown"}.`),jt(W)}catch(E){$("error","Error",E.message)}},Ht("reportFares")}async function pt(t=!0){t&&(Y=await Be(),I.agents=1);const e=document.querySelector("#agents-tab .admin-table tbody");if(!e)return;const a=document.getElementById("agents-search"),s=document.getElementById("agents-limit");a&&!a.dataset.wired&&(a.dataset.wired="1",s&&(s.dataset.wired="1"),a.addEventListener("input",m=>{Wt.agents=m.target.value,I.agents=1,pt(!1)}),s&&s.addEventListener("change",m=>{J.agents=parseInt(m.target.value),I.agents=1,pt(!1)}));const i=ut(Y,"agents"),n=J.agents,d=Math.max(1,Math.ceil(i.length/n));I.agents>d&&(I.agents=d);const r=(I.agents-1)*n,o=i.slice(r,r+n);e.innerHTML=o.length?o.map(m=>Oa(m)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',Bt("agents",i.length,d,r,n),delete e.dataset.actionsWired,_a();const l=document.getElementById("agents-add-btn");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>Fe(null))),Ht("agents")}function Oa(t){const e=t.isActive!==!1?'<span class="admin-status-pill admin-status-active">Active</span>':'<span class="admin-status-pill admin-status-inactive">Hidden</span>',a=t.commission!==void 0?`₹${Number(t.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${t.id}">
    <td class="font-mono text-xs text-text-muted">${t.id||"—"}</td>
    <td class="font-semibold">${t.name}</td>
    <td>${t.email||"—"}</td>
    <td>${t.contactPhone||"—"}</td>
    <td class="font-semibold text-navy">${a}</td>
    <td>${e}</td>
    <td>
      <div class="flex gap-1 flex-wrap items-center">
        <button data-action="edit-agent" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-agent" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
        <button data-action="toggle-agent" data-id="${t.id}" data-active="${t.isActive!==!1}"
          class="admin-action-btn ${t.isActive!==!1?"admin-action-toggle":"admin-action-show"}">
          <i class="bi ${t.isActive!==!1?"bi-eye-slash":"bi-eye"}"></i>${t.isActive!==!1?"Hide Fares":"Show Fares"}</button>
      </div>
    </td>
  </tr>`}function _a(){const t=document.querySelector("#agents-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const s=a.dataset.action,i=a.dataset.id,n=Y.find(d=>d.id===i);if(s==="edit-agent"&&Fe(n),s==="delete-agent"){if(!confirm(`Delete agent "${n==null?void 0:n.name}"? This does NOT delete their fares.`))return;try{await Qe(i),$("success","Deleted",`Agent "${n==null?void 0:n.name}" removed.`),await pt()}catch(d){$("error","Error",d.message)}}if(s==="toggle-agent"){const r=!(a.dataset.active==="true");a.disabled=!0,a.textContent="Working…";try{const o=await ta(i,r);$("success",r?"Agent Shown":"Agent Hidden",o.message),await pt()}catch(o){$("error","Toggle Failed",o.message),await pt()}}}))}function Bt(t,e,a,s,i){const n=document.getElementById(`${t}-pagination-footer`);if(!n)return;const d=Math.min(s+i,e),r=I[t];n.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${e?s+1:0} to ${d} of ${e} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${r<=1?"disabled":""}>Previous</button>
        ${function(){return a<=7?Array.from({length:a},(o,l)=>l+1):r<=4?[1,2,3,4,5,"...",a]:r>=a-3?[1,"...",a-4,a-3,a-2,a-1,a]:[1,"...",r-1,r,r+1,"...",a]}().map(o=>o==="..."?'<span class="admin-pagination-btn" style="cursor:default;opacity:0.5;background:transparent;">...</span>':`<button data-pg-action="goto" data-pg="${o}" class="admin-pagination-btn ${o===r?"admin-pagination-btn-active":""}">${o}</button>`).join("")}
        <button data-pg-action="next" class="admin-pagination-btn" ${r>=a?"disabled":""}>Next</button>
      </div>
    </div>`,n.dataset.wired||(n.dataset.wired="1",n.addEventListener("click",o=>{const l=o.target.closest("[data-pg-action]");if(!l||l.disabled)return;const m=l.dataset.pgAction;m==="prev"?I[t]=Math.max(1,I[t]-1):m==="next"?I[t]++:m==="goto"&&(I[t]=parseInt(l.dataset.pg)),t==="agents"?pt(!1):t==="sectors"?gt(!1):t==="airlines"?wt(!1):t==="reportFares"?jt(W):t==="databaseFares"&&z()}))}function Fe(t){var a,s;const e=!!t;dt(e?"Edit Agent":"Add New Agent",`
    <form id="agent-form" class="flex flex-col gap-4">
      <div>
        <label class="admin-label text-[11px] mb-1">Agent ID *</label>
        <input name="id" required value="${(t==null?void 0:t.id)||""}" placeholder="e.g. AGENT1"
          ${e?'readonly class="admin-control cursor-not-allowed bg-slate-100 text-slate-500"':'class="admin-control"'}>
        ${e?'<p class="text-[11px] text-text-soft mt-1">Agent ID cannot be changed after creation.</p>':""}
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Name *</label>
        <input name="name" required value="${(t==null?void 0:t.name)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Email</label>
        <input name="email" type="email" value="${(t==null?void 0:t.email)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Phone</label>
        <input name="contactPhone" value="${(t==null?void 0:t.contactPhone)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Commission (₹) *</label>
        <input name="commission" type="number" min="0" required value="${(t==null?void 0:t.commission)!==void 0?t.commission:500}"
          class="admin-control"
          placeholder="e.g. 500">
        <p class="text-[11px] text-text-soft mt-1">This commission is auto-applied to all fares ingested for this agent.</p>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit"
          class="admin-btn admin-btn-primary flex-1 text-sm">
          ${e?"Save Changes":"Add Agent"}
        </button>
        <button type="button" id="modal-cancel"
          class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
      </div>
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("agent-form"))==null||s.addEventListener("submit",async i=>{i.preventDefault();const n=new FormData(i.target),d=Object.fromEntries(n.entries()),r=i.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{e?(await ea(t.id,d),$("success","Updated",`Agent "${d.name}" updated.`)):(await aa(d),$("success","Added",`Agent "${d.name}" added.`)),document.getElementById("admin-modal").close(),await pt()}catch(o){$("error","Save Failed",o.message),r.disabled=!1,r.textContent=e?"Save Changes":"Add Agent"}})}async function gt(t=!0){t&&(M=de(await oe()),I.sectors=1);const e=document.getElementById("sectors-search"),a=document.getElementById("sectors-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{Wt.sectors=m.target.value,I.sectors=1,gt(!1)}),a.addEventListener("change",m=>{J.sectors=parseInt(m.target.value),I.sectors=1,gt(!1)}));const s=document.querySelector("#sectors-tab .admin-table tbody");if(!s)return;const i=ut(M,"sectors"),n=J.sectors,d=Math.max(1,Math.ceil(i.length/n));I.sectors>d&&(I.sectors=d);const r=(I.sectors-1)*n,o=i.slice(r,r+n);s.innerHTML=o.length?o.map(m=>Va(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',Bt("sectors",i.length,d,r,n),za();const l=document.querySelector("#sectors-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>je(null))),Ht("sectors")}function Va(t){const e=Le(t);return`<tr data-sector-id="${t.id}">
    <td class="font-mono text-xs text-text-muted">${t.id||"—"}</td>
    <td class="font-semibold">${e.sectorFrom}</td>
    <td class="font-semibold">${e.sectorTo}</td>
    <td><span class="font-mono font-bold text-primary">${e.sectorCode}</span></td>
    <td>
      <div class="flex gap-1 items-center">
        <button data-action="edit-sector" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-sector" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
        <button data-action="toggle-sector" data-id="${t.id}" data-hidden="${t.isHidden===!0}"
          class="admin-action-btn ${t.isHidden===!0?"admin-action-show":"admin-action-toggle"}">
          <i class="bi ${t.isHidden===!0?"bi-eye":"bi-eye-slash"}"></i>${t.isHidden===!0?"Show Fares":"Hide Fares"}</button>
      </div>
    </td>
  </tr>`}function za(){const t=document.querySelector("#sectors-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=M.find(d=>d.id===i);if(s==="edit-sector"&&je(n),s==="delete-sector"){if(!confirm(`Delete sector "${n==null?void 0:n.sectorCode}"?`))return;try{await na(i),$("success","Deleted",`Sector "${n==null?void 0:n.sectorCode}" removed.`),await gt()}catch(d){$("error","Error",d.message)}}if(s==="toggle-sector"){const r=!(a.dataset.hidden==="true");a.disabled=!0,a.textContent="Working…";try{const o=await sa(i,r);$("success",`Sector Fares ${r?"Hidden":"Shown"}`,o.message),await gt()}catch(o){$("error","Toggle Failed",o.message),await gt()}}}))}function je(t){var a,s;const e=!!t;dt(e?"Edit Sector":"Add New Sector",`
    <form id="sector-form" class="flex flex-col gap-4">
      <div>
        <label class="admin-label text-[11px] mb-1">From City *</label>
        <input name="sectorFrom" required placeholder="e.g. Kozhikode" value="${(t==null?void 0:t.sectorFrom)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">To City *</label>
        <input name="sectorTo" required placeholder="e.g. Jeddah" value="${(t==null?void 0:t.sectorTo)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Sector Code *</label>
        <input name="sectorCode" required placeholder="e.g. CCJ JED" value="${(t==null?void 0:t.sectorCode)||""}"
          class="admin-control font-mono tracking-wide">
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="admin-btn admin-btn-primary flex-1 text-sm">
          ${e?"Save Changes":"Add Sector"}
        </button>
        <button type="button" id="modal-cancel" class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
      </div>
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("sector-form"))==null||s.addEventListener("submit",async i=>{i.preventDefault();const n=new FormData(i.target),d=Object.fromEntries(n.entries());d.sectorCode=St(d.sectorCode.toUpperCase()),d.sectorFrom=St(d.sectorFrom.toUpperCase()),d.sectorTo=St(d.sectorTo.toUpperCase());const r=i.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{e?(await ia(t.id,d),$("success","Updated","Sector updated.")):(await oa(d),$("success","Added",`Sector "${d.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await gt()}catch(o){$("error","Save Failed",o.message),r.disabled=!1,r.textContent=e?"Save Changes":"Add Sector"}})}async function wt(t=!0){t&&(O=await re(),I.airlines=1);const e=document.getElementById("airlines-search"),a=document.getElementById("airlines-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{Wt.airlines=m.target.value,I.airlines=1,wt(!1)}),a.addEventListener("change",m=>{J.airlines=parseInt(m.target.value),I.airlines=1,wt(!1)}));const s=document.querySelector("#flights-tab .admin-table tbody");if(!s)return;const i=ut(O,"airlines"),n=J.airlines,d=Math.max(1,Math.ceil(i.length/n));I.airlines>d&&(I.airlines=d);const r=(I.airlines-1)*n,o=i.slice(r,r+n);s.innerHTML=o.length?o.map(m=>Ga(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "Add Airline".</td></tr>',Bt("airlines",i.length,d,r,n),Wa();const l=document.querySelector("#flights-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>Re(null))),Ht("airlines")}function Ga(t){const e=t.logoUrl?`<span class="admin-logo-wrap"><img src="${t.logoUrl}" alt="${S(t.name||"Airline")}"></span>`:`<span class="admin-logo-wrap"><span class="admin-logo-fallback">${S((t.code||"NA").slice(0,3))}</span></span>`;return`<tr data-airline-id="${t.id}">
    <td>${e}</td>
    <td class="font-semibold">${t.name}</td>
    <td><span class="font-mono font-bold text-primary">${t.code}</span></td>
    <td>
      <div class="flex gap-1 items-center">
        <button data-action="edit-airline" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-airline" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Wa(){const t=document.querySelector("#flights-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=O.find(d=>d.id===i);if(s==="edit-airline"&&Re(n),s==="delete-airline"){if(!confirm(`Delete airline "${n==null?void 0:n.name}" (${n==null?void 0:n.code})?`))return;try{await ra(i),$("success","Deleted",`Airline "${n==null?void 0:n.name}" removed.`),await wt()}catch(d){$("error","Error",d.message)}}}))}function Re(t){var a,s;const e=!!t;dt(e?"Edit Airline":"Add New Airline",`
    <form id="airline-form" class="flex flex-col gap-4">
      <div>
        <label class="admin-label text-[11px] mb-1">Airline Name *</label>
        <input name="name" required placeholder="e.g. Air India Express" value="${(t==null?void 0:t.name)||""}"
          class="admin-control">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">IATA Code *</label>
        <input name="code" required maxlength="3" placeholder="e.g. IX" value="${(t==null?void 0:t.code)||""}"
          class="admin-control font-mono tracking-widest uppercase">
      </div>
      <div>
        <label class="admin-label text-[11px] mb-1">Logo (optional)</label>
        <input type="file" name="logoFile" accept="image/*"
          class="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary cursor-pointer">
        ${t!=null&&t.logoUrl?`<img src="${t.logoUrl}" class="mt-2 h-8 object-contain rounded" alt="current logo">`:""}
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="admin-btn admin-btn-primary flex-1 text-sm">
          ${e?"Save Changes":"Add Airline"}
        </button>
        <button type="button" id="modal-cancel" class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
      </div>
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("airline-form"))==null||s.addEventListener("submit",async i=>{var l;i.preventDefault();const n=new FormData(i.target),d=((l=n.get("logoFile"))==null?void 0:l.size)>0?n.get("logoFile"):null,r={name:n.get("name"),code:n.get("code").toUpperCase()},o=i.target.querySelector("[type=submit]");o.disabled=!0,o.textContent="Saving…";try{e?(await da(t.id,r,d),$("success","Updated","Airline updated.")):(await la(r,d),$("success","Added",`Airline "${r.name}" added.`)),document.getElementById("admin-modal").close(),await wt()}catch(m){$("error","Save Failed",m.message),o.disabled=!1,o.textContent=e?"Save Changes":"Add Airline"}})}async function Ja(){const t=document.getElementById("reports-tab");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=document.getElementById("reports-sector-sel");e&&e.options.length<=1&&M.forEach(d=>e.appendChild(new Option(d.sectorCode,d.id)));const a=document.getElementById("reports-agent-sel");a&&a.options.length<=1&&Y.forEach(d=>a.appendChild(new Option(d.name,d.id)));const s=document.getElementById("generate-report-btn"),i=document.getElementById("reports-start-date"),n=document.getElementById("reports-end-date");s&&!s.dataset.wired&&(s.dataset.wired="1",s.addEventListener("click",async()=>{const d=(e==null?void 0:e.value)||"all",r=(a==null?void 0:a.value)||"all",o=(i==null?void 0:i.value)||null,l=(n==null?void 0:n.value)||null;s.disabled=!0,s.textContent="Generating…";try{const[m,c]=await Promise.all([ca(o,l,d,r),Gt({sectorId:d,agentId:r,startDate:o,endDate:l,includeHidden:!0})]);W=c,Ya(m,t),I.reportFares=1,jt(W)}catch(m){$("error","Report Failed",m.message)}finally{s.disabled=!1,s.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Ya(t,e){const{agentReport:a,sectorReport:s,totalFares:i}=t,n=document.getElementById("report-stats-row");if(n){n.classList.remove("hidden");const x=(W||[]).filter(f=>!f.isHidden).length,u=(W||[]).filter(f=>f.isHidden).length,h=new Set((W||[]).map(f=>f.agentId)).size,E=(W||[]).map(f=>f.finalRate||0).filter(f=>f>0),p=E.length?Math.round(E.reduce((f,b)=>f+b,0)/E.length):0,v=(f,b)=>{const w=document.getElementById(f);w&&(w.textContent=b.toLocaleString())};v("stat-total-fares",i),v("stat-live-fares",x),v("stat-hidden-fares",u),v("stat-agents-count",h);const g=document.getElementById("stat-avg-fare");g&&(g.textContent=p>0?`₹${p.toLocaleString()}`:"—")}const d=document.getElementById("report-total-fares");d&&(d.textContent=`${i} fare${i!==1?"s":""} matched your filter`);const r=document.getElementById("bar-chart-container");r&&a.length&&Xa(a.slice(0,8),r);const o=document.getElementById("donut-chart-svg"),l=document.getElementById("pie-legend");o&&s.length&&Ka(s.slice(0,8),o,l);const m=document.getElementById("report-leaderboards");m&&(m.classList.remove("hidden"),Za(a,s));const c=document.getElementById("download-report-csv");if(c){const x=c.cloneNode(!0);c.parentNode.replaceChild(x,c),x.addEventListener("click",()=>Qa(W)),W&&W.length?x.classList.remove("opacity-50","pointer-events-none"):x.classList.add("opacity-50","pointer-events-none")}$("success","Report Ready",`${i} fare${i!==1?"s":""} aggregated.`)}function Xa(t,e){const a=e.clientWidth||480,s=260,i={top:32,right:16,bottom:48,left:48},n=a-i.left-i.right,d=s-i.top-i.bottom,r=Math.max(...t.map(f=>f.count),1),o=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],l=4,m=Math.ceil(r/l),c=Array.from({length:l+1},(f,b)=>b*m),x=c.map(f=>{const b=i.top+d-f/(c[c.length-1]||1)*d;return`<line x1="${i.left}" y1="${b.toFixed(1)}" x2="${a-i.right}" y2="${b.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${i.left-6}" y="${(b+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${f}</text>`}).join(""),u=Math.min(48,n/t.length*.6),h=n/t.length,E=t.map((f,b)=>{const w=Math.max(4,f.count/(c[c.length-1]||1)*d),C=i.left+b*h+h/2-u/2,T=i.top+d-w,[P,_]=o[b%o.length],k=`bg${b}`,H=f.avgRate?`avg ₹${Math.round(f.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${k}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${P}"/>
              <stop offset="100%" stop-color="${_}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${f.name}" data-count="${f.count}" data-avg="${H}" style="cursor:pointer;">
              <rect x="${C.toFixed(1)}" y="${T.toFixed(1)}" width="${u}" height="${w.toFixed(1)}"
                rx="6" fill="url(#${k})" opacity="0.92"
                style="transform-origin:${(C+u/2).toFixed(1)}px ${(i.top+d).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${b*.07}s both;"/>
              <text x="${(C+u/2).toFixed(1)}" y="${(T-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${_}">${f.count}</text>
              <text x="${(C+u/2).toFixed(1)}" y="${(i.top+d+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(f.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),p="bar-tooltip";e.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${p}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${s}" viewBox="0 0 ${a} ${s}" style="overflow:visible;">
      ${x}
      <line x1="${i.left}" y1="${i.top}" x2="${i.left}" y2="${i.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${i.left}" y1="${i.top+d}" x2="${a-i.right}" y2="${i.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${E}
    </svg>`;const v=e.querySelector("#bar-svg"),g=e.querySelector(`#${p}`);v&&g&&v.querySelectorAll(".bar-group").forEach(f=>{f.addEventListener("mousemove",b=>{const w=e.getBoundingClientRect();g.style.display="block",g.style.left=b.clientX-w.left+12+"px",g.style.top=b.clientY-w.top-40+"px";const C=f.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${f.dataset.avg}</span>`:"";g.innerHTML=`${f.dataset.name}<br><span style="color:#60a5fa;">${f.dataset.count} fares</span>${C}`}),f.addEventListener("mouseleave",()=>{g.style.display="none"})})}function Ka(t,e,a){const s=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],o=t.reduce((f,b)=>f+b.count,0),l=e.getElementById?e.getElementById("donut-segments"):e.querySelector("#donut-segments"),m=e.querySelector("#donut-center-count"),c=e.querySelector("#donut-center-label");if(!l)return;m&&(m.textContent=o),c&&(c.textContent="FARES");const x=(f,b,w,C)=>({x:f+w*Math.cos((C-90)*Math.PI/180),y:b+w*Math.sin((C-90)*Math.PI/180)});let u=0;const h=t.map((f,b)=>{const w=o>0?f.count/o*360:0,C=u+w,T=w>180?1:0,P=x(110,110,95,u),_=x(110,110,95,C),k=x(110,110,60,u),H=x(110,110,60,C),Q=[`M ${P.x.toFixed(2)} ${P.y.toFixed(2)}`,`A 95 95 0 ${T} 1 ${_.x.toFixed(2)} ${_.y.toFixed(2)}`,`L ${H.x.toFixed(2)} ${H.y.toFixed(2)}`,`A 60 60 0 ${T} 0 ${k.x.toFixed(2)} ${k.y.toFixed(2)}`,"Z"].join(" "),V=u+w/2;u=C;const vt=o>0?(f.count/o*100).toFixed(1):"0.0";return{pathD:Q,color:s[b%s.length],name:f.name,count:f.count,pct:vt,mid:V}}),E="http://www.w3.org/2000/svg";l.innerHTML="";const p=h.map((f,b)=>{const w=document.createElementNS(E,"path");return w.setAttribute("d",f.pathD),w.setAttribute("fill",f.color),w.setAttribute("stroke","white"),w.setAttribute("stroke-width","2"),w.style.cursor="pointer",w.style.transition="transform 0.2s, filter 0.2s",w.style.transformOrigin="110px 110px",w.setAttribute("data-index",b),l.appendChild(w),w}),v=f=>{p.forEach((b,w)=>{w===f?(b.style.transform="scale(1.04)",b.style.filter="brightness(1.1)",b.setAttribute("stroke-width","3")):(b.style.transform="scale(1)",b.style.filter="brightness(1)",b.setAttribute("stroke-width","2"))}),f>=0&&f<h.length?(m&&(m.textContent=h[f].count),c&&(c.textContent=h[f].name.split(" ")[0].toUpperCase().slice(0,7))):(m&&(m.textContent=o),c&&(c.textContent="FARES"))};if(p.forEach((f,b)=>{f.addEventListener("mouseover",()=>{v(b),g(b)}),f.addEventListener("mouseout",()=>{v(-1),g(-1)})}),a){a.innerHTML=h.map((b,w)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${w}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${b.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${b.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${b.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${b.pct}%</span>
      </div>`).join("");const f=b=>{a.querySelectorAll(".legend-row").forEach((w,C)=>{w.style.background=C===b?"#f1f5f9":""})};window._highlightLegendRows=f,a.querySelectorAll(".legend-row").forEach((b,w)=>{b.addEventListener("mouseover",()=>{v(w),f(w)}),b.addEventListener("mouseout",()=>{v(-1),f(-1)})})}function g(f){window._highlightLegendRows&&window._highlightLegendRows(f)}}function Za(t,e){var n,d;const a=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],s=document.getElementById("leaderboard-agents");if(s&&t.length){const r=[...t].sort((l,m)=>m.count-l.count).slice(0,5),o=r[0].count||1;s.innerHTML=r.map((l,m)=>{const c=Math.max(6,Math.round(l.count/o*100));return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="width:28px;text-align:center;flex-shrink:0;">${m===0?'<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:#fff7ed;color:#b45309;border:1px solid #fed7aa;"><i class="bi bi-trophy-fill" style="font-size:12px;"></i></span>':`<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:#f8fafc;color:#64748b;border:1px solid #e2e8f0;font-size:11px;font-weight:800;">#${m+1}</span>`}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${l.name}</span>
            <span style="color:${a[m]};margin-left:8px;">${l.count} fares</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${c}%;height:100%;background:${a[m]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}const i=document.getElementById("leaderboard-sectors");if(i&&e.length){const o=[...e.filter(c=>c.avgRate>0)].sort((c,x)=>c.avgRate-x.avgRate).slice(0,5),l=((n=o[0])==null?void 0:n.avgRate)||1,m=((d=o[o.length-1])==null?void 0:d.avgRate)||1;i.innerHTML=o.map((c,x)=>{const u=m>l?Math.max(6,Math.round((c.avgRate-l)/(m-l)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${x+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${c.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(c.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${u}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function Qa(t){if(!t||!t.length){$("warning","No Data","No fares to export. Apply filters and fetch first.");return}const e=Object.fromEntries(Y.map(c=>[c.id,c.name])),a=Object.fromEntries(M.map(c=>[c.id,c.sectorCode])),s=Object.fromEntries(O.map(c=>[c.id,c.code||c.name])),i=c=>`"${String(c??"").replace(/"/g,'""')}"`,n=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],d=t.map(c=>{const x=c.flightDate instanceof Date?c.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):c.flightDate||"";return[i(x),i(c.flightTime||""),i(a[c.sectorId]||c.sectorId),i(s[c.airlineId]||c.airlineId),i(e[c.agentId]||c.agentId),i(c.specialRate||0),i(c.finalRate||0),i(c.commission||0),i(c.baggage||""),i(c.extraBaggage||""),i(c.isHidden?"Hidden":"Live")].join(",")}),r=[n.map(i).join(","),...d].join(`
`),o=new Blob(["\uFEFF"+r],{type:"text/csv;charset=utf-8;"}),l=URL.createObjectURL(o),m=document.createElement("a");m.href=l,m.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(m),m.click(),document.body.removeChild(m),URL.revokeObjectURL(l),$("success","CSV Downloaded",`${t.length} fares exported.`)}function Ne(){return Object.keys(X).length}function He(){return{agentNameById:Object.fromEntries(Y.map(t=>[t.id,t.name||t.id])),sectorCodeById:Object.fromEntries(M.map(t=>[t.id,t.sectorCode||`${t.sectorFrom||""} ${t.sectorTo||""}`.trim()||t.id])),airlineLabelById:Object.fromEntries(O.map(t=>[t.id,t.code?`${t.code} - ${t.name||""}`.trim():t.name||t.id])),airlineCodeById:Object.fromEntries(O.map(t=>[t.id,t.code||t.name||t.id]))}}function Pe(t,e=0){if(!t)return e;const a=Y.find(i=>i.id===t),s=Number(a==null?void 0:a.commission);return Number.isFinite(s)?Math.max(0,s):e}function tn(t,e){return t==="specialRate"||t==="finalRate"||t==="commission"||t==="extraBaggage"?e===""?"":R(e,0):t==="baggage"?e===""?"":ht(e):t==="isHidden"?e===!0||e==="hidden"||e==="true":t==="flightTime"?String(e||"").trim():t==="flightDate"?e||"":String(e||"")}function en(t,e){return t==="specialRate"||t==="finalRate"||t==="extraBaggage"?R(e,0):t==="commission"?e==null||e===""?"":Math.max(0,R(e,0)):t==="baggage"?ht(e):t==="isHidden"?e===!0:t==="flightTime"?String(e||"").trim():t==="flightDate"?Ft(e):String(e||"")}function ne(t){return t?t.commission!==void 0&&t.commission!==null&&t.commission!==""?Math.max(0,R(t.commission,0)):Math.max(0,R(t.finalRate,0)-R(t.specialRate,0)):0}function Rt(t,e){return Math.max(0,R(t,0)+Math.max(0,R(e,0)))}function le(t){const e=X[t.id]||{},a={...t,...e},s=ne(t);return a.flightDate=e.flightDate!==void 0?ke(e.flightDate):Mt(t.flightDate),a.specialRate=R(a.specialRate,0),a.commission=e.commission!==void 0?Math.max(0,R(e.commission,0)):s,a.finalRate=Rt(a.specialRate,a.commission),a.baggage=ht(a.baggage),a.extraBaggage=R(a.extraBaggage,0),a.isHidden=a.isHidden===!0||a.isHidden==="hidden"||a.isHidden==="true",a.flightTime=String(a.flightTime||"").trim(),a.agentId=a.agentId||"",a.sectorId=a.sectorId||"",a.airlineId=a.airlineId||"",a}function Lt(){const t=Ne(),e=nt.size,a=document.getElementById("database-unsaved-pill");a&&(a.textContent=`Unsaved: ${t}`);const s=document.getElementById("database-save-all-btn");s&&(s.disabled=t===0);const i=document.getElementById("database-delete-selected-btn");i&&(i.disabled=e===0);const n=document.getElementById("database-selected-count");n&&(n.textContent=String(e))}function an(){const t=document.getElementById("database-agent-filter"),e=document.getElementById("database-sector-filter"),a=document.getElementById("database-airline-filter");if(t){const s=F.agentId;t.innerHTML='<option value="all">All Agents</option>'+Y.map(i=>`<option value="${S(i.id)}">${S(i.id)} · ${S(i.name||"Unnamed")}</option>`).join(""),t.value=s}if(e){const s=F.sectorId;e.innerHTML='<option value="all">All Sectors</option>'+M.map(i=>`<option value="${S(i.id)}">${S(i.sectorCode||i.id)}</option>`).join(""),e.value=s}if(a){const s=F.airlineId;a.innerHTML='<option value="all">All Airlines</option>'+O.map(i=>`<option value="${S(i.id)}">${S(i.code||"—")} · ${S(i.name||"Unnamed")}</option>`).join(""),a.value=s}}function nn(){const t=document.getElementById("database-table-wrap");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=i=>{const n=t.querySelector(`tr[data-fare-id="${i}"]`);if(!n)return;const d=!!X[i];n.classList.toggle("admin-database-row-dirty",d);const r=n.querySelector('[data-db-action="save"]'),o=n.querySelector('[data-db-action="reset"]');r&&(r.disabled=!d),o&&(o.disabled=!d)},a=i=>{if(!i)return;const n=i.querySelector('[data-db-field="specialRate"]'),d=i.querySelector('[data-db-field="commission"]'),r=i.querySelector('[data-db-field="finalRate"]');if(!n||!d||!r)return;const o=R(n.value,0),l=Math.max(0,R(d.value,0));r.value=String(Rt(o,l))},s=i=>{const n=i.target.closest("[data-db-field]");if(!n)return;const d=n.closest("tr[data-fare-id]");if(!d)return;const r=d.dataset.fareId,o=n.dataset.dbField,l=et.find(E=>E.id===r);if(!l||!o)return;const m=n.value,c=tn(o,m),x=o==="commission"?ne(l):en(o,l[o]),u=c!==x,h={...X[r]||{}};if(u?h[o]=c:delete h[o],o==="agentId"){const E=d.querySelector('[data-db-field="commission"]'),p=Pe(c,0);E&&(E.value=String(p));const v=ne(l);p!==v?h.commission=p:delete h.commission,a(d)}Object.keys(h).length?X[r]=h:delete X[r],(o==="specialRate"||o==="commission")&&a(d),e(r),Lt()};t.addEventListener("input",s),t.addEventListener("change",i=>{s(i);const n=i.target.closest("#database-select-all");if(n){t.querySelectorAll("input[data-db-select]").forEach(r=>{r.checked=n.checked;const o=r.dataset.dbSelect;o&&(n.checked?nt.add(o):nt.delete(o))}),Lt();return}const d=i.target.closest("input[data-db-select]");if(d){const r=d.dataset.dbSelect;if(!r)return;d.checked?nt.add(r):nt.delete(r),Lt()}}),t.addEventListener("click",async i=>{const n=i.target.closest("[data-db-action]");if(!n)return;const d=n.dataset.dbAction,r=n.dataset.id;if(r){if(d==="edit"){mt.add(r),z();return}if(d==="cancel_edit"){mt.delete(r),z();return}if(d==="save"){n.disabled=!0,await Ue(r)?mt.delete(r):n.disabled=!1,z();return}if(d==="share"){const o=et.find(w=>w.id===r)||X[r]||{},l=le(o)||o,m=M.find(w=>w.id===l.sectorId)||{},x=(O.find(w=>w.id===l.airlineId)||{}).name||l.airlineId||"Unknown Airline",u=m.sectorFrom||"TBA",h=m.sectorTo||"TBA",E={day:"2-digit",month:"short",year:"numeric"};let p="TBA";if(l.flightDate){const w=l.flightDate instanceof Date?l.flightDate:new Date(l.flightDate);isNaN(w)||(p=w.toLocaleDateString("en-GB",E).replace(/,/g,""))}const v=l.flightTime&&l.flightTime.split("-")[0]?l.flightTime.split("-")[0].trim():"TBA",g=l.flightTime&&l.flightTime.includes("-")?l.flightTime.split("-")[1].trim():"TBA",f="₹"+(Number(l.finalRate)||0).toLocaleString("en-IN"),b=`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${x.toUpperCase()}*
🛫 From: *${u}*
🛬 To: *${h}*
📅 Date: *${p}*
⏰ Dep: ${v} | Arr: ${g}
💵 Price: *${f}*

Please confirm availability!`;try{await navigator.clipboard.writeText(b),$("success","Copied!","Flight details copied to clipboard.")}catch(w){$("error","Copy failed",w.message)}return}if(d==="reset"){delete X[r],mt.delete(r),z();return}if(d==="delete"){if(!confirm("Delete this fare row? This cannot be undone."))return;n.disabled=!0;try{await ie(r),et=et.filter(o=>o.id!==r),delete X[r],nt.delete(r),mt.delete(r),$("success","Deleted","Fare row removed."),z()}catch(o){$("error","Delete Failed",o.message),n.disabled=!1}}}})}function sn(t){if(!t||t.dataset.controlsWired)return;t.dataset.controlsWired="1";const e=document.getElementById("database-search"),a=document.getElementById("database-agent-filter"),s=document.getElementById("database-sector-filter"),i=document.getElementById("database-airline-filter"),n=document.getElementById("database-status-filter"),d=document.getElementById("database-start-date"),r=document.getElementById("database-end-date"),o=document.getElementById("database-limit"),l=document.getElementById("database-clear-filters"),m=document.getElementById("database-refresh-btn"),c=document.getElementById("database-save-all-btn"),x=document.getElementById("database-delete-selected-btn"),u=document.getElementById("database-add-row-btn");e&&e.addEventListener("input",h=>{F.search=h.target.value||"",I.databaseFares=1,z()}),a&&a.addEventListener("change",h=>{F.agentId=h.target.value||"all",I.databaseFares=1,z()}),s&&s.addEventListener("change",h=>{F.sectorId=h.target.value||"all",I.databaseFares=1,z()}),i&&i.addEventListener("change",h=>{F.airlineId=h.target.value||"all",I.databaseFares=1,z()}),n&&n.addEventListener("change",h=>{F.status=h.target.value||"all",I.databaseFares=1,z()}),d&&d.addEventListener("change",h=>{F.startDate=h.target.value||"",I.databaseFares=1,z()}),r&&r.addEventListener("change",h=>{F.endDate=h.target.value||"",I.databaseFares=1,z()}),o&&(o.value=String(J.databaseFares),o.addEventListener("change",h=>{J.databaseFares=parseInt(h.target.value,10)||20,I.databaseFares=1,z()})),l&&l.addEventListener("click",()=>{F.search="",F.agentId="all",F.sectorId="all",F.airlineId="all",F.status="all",F.startDate="",F.endDate="",e&&(e.value=""),a&&(a.value="all"),s&&(s.value="all"),i&&(i.value="all"),n&&(n.value="all"),d&&(d.value=""),r&&(r.value=""),I.databaseFares=1,z()}),m&&m.addEventListener("click",async()=>{const h=m.innerHTML;m.disabled=!0,m.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing...',await ce(!0),m.disabled=!1,m.innerHTML=h}),c&&c.addEventListener("click",rn),x&&x.addEventListener("click",dn),u&&u.addEventListener("click",ln)}async function ce(t=!0){const e=document.getElementById("database-tab");if(!e)return;if(sn(e),nn(),an(),t||!e.dataset.loaded)try{et=await Gt({includeHidden:!0}),X={},nt=new Set,mt=new Set,I.databaseFares=1,e.dataset.loaded="1"}catch(s){$("error","Load Failed",s.message),et=[]}z()}function on(){const{agentNameById:t,sectorCodeById:e,airlineLabelById:a}=He(),s=F.search.trim().toLowerCase(),i=ja(F.startDate),n=Ra(F.endDate),d=et.map(l=>le(l)).filter(l=>{var x,u;if(F.agentId!=="all"&&l.agentId!==F.agentId||F.sectorId!=="all"&&l.sectorId!==F.sectorId||F.airlineId!=="all"&&l.airlineId!==F.airlineId||F.status==="live"&&l.isHidden||F.status==="hidden"&&!l.isHidden)return!1;const m=((u=(x=Mt(l.flightDate))==null?void 0:x.getTime)==null?void 0:u.call(x))||null;return i!==null&&(m===null||m<i)||n!==null&&(m===null||m>n)?!1:s?[l.id,Ft(l.flightDate),l.flightTime,l.specialRate,l.finalRate,l.commission,l.baggage,l.extraBaggage,l.isHidden?"hidden":"live",l.agentId,l.sectorId,l.airlineId,t[l.agentId]||"",e[l.sectorId]||"",a[l.airlineId]||""].join(" ").toLowerCase().includes(s):!0}),{key:r,asc:o}=rt.databaseFares;return d.sort((l,m)=>{const c=h=>{var E,p;return r==="agentId"?(t[h.agentId]||h.agentId||"").toLowerCase():r==="sectorId"?(e[h.sectorId]||h.sectorId||"").toLowerCase():r==="airlineId"?(a[h.airlineId]||h.airlineId||"").toLowerCase():r==="flightDate"?((p=(E=Mt(h.flightDate))==null?void 0:E.getTime)==null?void 0:p.call(E))||0:r==="isHidden"?h.isHidden?1:0:h[r]};let x=c(l),u=c(m);return typeof x=="string"&&(x=x.toLowerCase()),typeof u=="string"&&(u=u.toLowerCase()),x<u?o?-1:1:x>u?o?1:-1:0})}function z(){const t=document.getElementById("database-table-wrap");if(!t)return;const e=on(),{agentNameById:a,sectorCodeById:s,airlineLabelById:i,airlineCodeById:n}=He(),d=document.getElementById("database-total-count");d&&(d.textContent=e.length.toLocaleString());const r=J.databaseFares,o=Math.max(1,Math.ceil(e.length/r));I.databaseFares>o&&(I.databaseFares=o);const l=(I.databaseFares-1)*r,m=e.slice(l,l+r);if(!m.length){t.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-database"></i>
        </div>
        <p class="admin-empty-state-title">No fares matched your filter</p>
      </div>
    </div>`,Bt("databaseFares",e.length,o,l,r),Lt();return}const c=(p,v)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="databaseFares" data-sort-key="${p}">
      ${v} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i>
    </th>`,x=p=>Y.map(v=>`<option value="${S(v.id)}" ${v.id===p?"selected":""}>${S(v.id)} · ${S(v.name||"Unnamed")}</option>`).join(""),u=p=>M.map(v=>`<option value="${S(v.id)}" ${v.id===p?"selected":""}>${S(v.sectorCode||v.id)}</option>`).join(""),h=p=>O.map(v=>`<option value="${S(v.id)}" ${v.id===p?"selected":""}>${S(v.code||"—")} · ${S(v.name||"Unnamed")}</option>`).join(""),E=m.length>0&&m.every(p=>nt.has(p.id));t.innerHTML=`
    <table class="admin-database-table">
      <thead>
        <tr>
          <th class="w-[36px] text-center"><input id="database-select-all" type="checkbox" ${E?"checked":""}></th>
          <th class="w-[56px]">#</th>
          ${c("agentId","Agent")}
          ${c("sectorId","Sector Code")}
          ${c("flightDate","Date")}
          ${c("flightTime","Time")}
          ${c("airlineId","Flight Code")}
          ${c("baggage","Baggage")}
          ${c("extraBaggage","Extra Baggage")}
          ${c("specialRate","SP Rate")}
          ${c("commission","Commission")}
          ${c("finalRate","Rate")}
          ${c("isHidden","Status")}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${m.map((p,v)=>{const g=!!X[p.id],f=nt.has(p.id),b=mt.has(p.id)||g,w=a[p.agentId]||p.agentId,C=s[p.sectorId]||p.sectorId;i[p.airlineId]||p.airlineId;const T=n[p.airlineId]||p.airlineId,P=p.flightDate instanceof Date?p.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):p.flightDate?Ft(p.flightDate):"—",_=v%2===1?"bg-slate-50/60":"";return`
            <tr data-fare-id="${p.id}" class="${g?"admin-database-row-dirty":_} hover:bg-slate-100/80 transition-colors">
              <td class="text-center">
                <input type="checkbox" data-db-select="${p.id}" ${f?"checked":""}>
              </td>
              <td class="font-mono text-[11px] text-text-soft">${l+v+1}</td>
              <td class="whitespace-nowrap ${b?"":"text-[12px]"}">
                ${b?`
                <select data-db-field="agentId" class="db-cell-select min-w-[150px]">
                  <option value="">Select Agent</option>
                  ${x(p.agentId)}
                </select>
                `:`<span class="text-text-muted">${S(w)}</span>`}
              </td>
              <td class="whitespace-nowrap ${b?"":"text-[12px]"}">
                ${b?`
                <select data-db-field="sectorId" class="db-cell-select min-w-[120px]">
                  <option value="">Select Sector</option>
                  ${u(p.sectorId)}
                </select>
                `:`<span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${S(C)}</span>`}
              </td>
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">
                ${b?`
                <input type="date" data-db-field="flightDate" class="db-cell-input" value="${Ft(p.flightDate)}">
                `:S(P)}
              </td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">
                ${b?`
                <input type="text" data-db-field="flightTime" class="db-cell-input min-w-[110px]" value="${S(p.flightTime||"")}" placeholder="04:05 - 11:10">
                `:S(p.flightTime||"—")}
              </td>
              <td class="whitespace-nowrap ${b?"":"font-semibold text-[13px]"}">
                ${b?`
                <select data-db-field="airlineId" class="db-cell-select min-w-[150px]">
                  <option value="">No Airline</option>
                  ${h(p.airlineId)}
                </select>
                `:S(T)}
              </td>
              <td class="whitespace-nowrap text-[12px]">
                ${b?`
                <select data-db-field="baggage" class="db-cell-select min-w-[90px]">
                  ${Ct(Vt,ht(p.baggage))}
                </select>
                `:p.baggage?p.baggage+" kg":"—"}
              </td>
              <td class="whitespace-nowrap text-[12px]">
                ${b?`
                <select data-db-field="extraBaggage" class="db-cell-select min-w-[90px]">
                  ${Ct(Te,R(p.extraBaggage,0))}
                </select>
                `:p.extraBaggage?p.extraBaggage+" kg":"—"}
              </td>
              <td class="whitespace-nowrap">
                ${b?`
                <input type="number" data-db-field="specialRate" class="db-cell-input db-cell-num" value="${R(p.specialRate,0)}" min="0" step="1">
                `:`<span class="text-[13px] text-text-muted">₹${(p.specialRate||0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${b?`
                <input type="number" data-db-field="commission" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${R(p.commission,0)}" min="0" step="1" readonly tabindex="-1">
                `:`<span class="text-[12px] text-text-muted" id="comm-${p.id}">₹${(p.commission||0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${b?`
                <input type="number" data-db-field="finalRate" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${R(p.finalRate,0)}" min="0" step="1" readonly tabindex="-1">
                `:`<span class="font-black text-navy text-[14px]">₹${(p.finalRate||0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${b?`
                <select data-db-field="isHidden" class="db-cell-select min-w-[94px]">
                  <option value="live" ${p.isHidden?"":"selected"}>Live</option>
                  <option value="hidden" ${p.isHidden?"selected":""}>Hidden</option>
                </select>
                `:`
                <span class="admin-status-pill ${p.isHidden?"admin-status-hidden":"admin-status-live"}">
                  ${p.isHidden?"● Hidden":"● Live"}
                </span>
                `}
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  ${b?`
                  <button data-db-action="save" data-id="${p.id}" class="admin-action-btn admin-action-edit" ${g?"":"disabled"}><i class="bi bi-check2-circle"></i>Save</button>
                  <button data-db-action="${g?"reset":"cancel_edit"}" data-id="${p.id}" class="admin-action-btn admin-action-toggle"><i class="bi ${g?"bi-arrow-counterclockwise":"bi-x"}"></i>${g?"Reset":"Cancel"}</button>
                  `:`
                  <button data-db-action="edit" data-id="${p.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil"></i>Edit</button>
                  `}
                  <button data-db-action="share" data-id="${p.id}" class="admin-action-btn admin-action-show"><i class="bi bi-box-arrow-up"></i>Share</button>
                  <button data-db-action="delete" data-id="${p.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Del</button>
                </div>
              </td>
            </tr>
          `}).join("")}
      </tbody>
    </table>
  `,Bt("databaseFares",e.length,o,l,r),Ht("databaseFares"),Lt()}async function Ue(t,{silent:e=!1}={}){const a=et.find(m=>m.id===t);if(!a)return!1;if(!X[t])return!0;const i=le(a),n=Mt(i.flightDate);if(!i.agentId)return e||$("warning","Missing Agent","Please select an agent before saving."),!1;if(!i.sectorId)return e||$("warning","Missing Sector","Please select a sector before saving."),!1;if(!n)return e||$("warning","Missing Date","Please set a valid flight date before saving."),!1;const d=R(i.specialRate,0),r=Math.max(0,R(i.commission,0)),o=Rt(d,r),l={agentId:i.agentId,sectorId:i.sectorId,airlineId:i.airlineId||"",flightDate:n,flightTime:i.flightTime||"",specialRate:d,finalRate:o,commission:r,baggage:ht(i.baggage),extraBaggage:R(i.extraBaggage,0),isHidden:i.isHidden===!0};try{return await Ce(t,l),et=et.map(m=>m.id===t?{...m,...l}:m),delete X[t],mt.delete(t),e||$("success","Saved","Fare row updated."),!0}catch(m){return e||$("error","Save Failed",m.message),!1}}async function rn(){const t=Object.keys(X);if(!t.length)return;const e=document.getElementById("database-save-all-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Saving...');let s=0,i=0;for(const n of t)await Ue(n,{silent:!0})?s+=1:i+=1;z(),e&&(e.disabled=Ne()===0,e.innerHTML=a||"Save All"),i===0?$("success","Saved",`${s} row${s!==1?"s":""} updated.`):$("warning","Partial Save",`${s} saved, ${i} failed. Fix invalid rows and retry.`)}async function dn(){const t=Array.from(nt);if(!t.length||!confirm(`Delete ${t.length} selected fare row${t.length!==1?"s":""}? This cannot be undone.`))return;const e=document.getElementById("database-delete-selected-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Deleting...');const s=await Promise.allSettled(t.map(d=>ie(d))),i=[];let n=0;if(s.forEach((d,r)=>{d.status==="fulfilled"?i.push(t[r]):n+=1}),i.length){const d=new Set(i);et=et.filter(r=>!d.has(r.id)),i.forEach(r=>{delete X[r],nt.delete(r),mt.delete(r)})}z(),e&&(e.innerHTML=a||"Delete Selected"),n===0?$("success","Deleted",`${i.length} row${i.length!==1?"s":""} deleted.`):$("warning","Partial Delete",`${i.length} deleted, ${n} failed.`)}function ln(){const t=Ft(new Date);dt("Add Fare Row",`
    <form id="database-add-form" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="admin-label text-[10px] mb-1">Date *</label>
          <input id="db-add-date" type="date" class="admin-control h-10" value="${t}" required>
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
            ${Y.map(o=>`<option value="${S(o.id)}">${S(o.id)} · ${S(o.name||"Unnamed")}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Sector *</label>
          <select id="db-add-sector" class="admin-control h-10" required>
            <option value="">Select Sector</option>
            ${M.map(o=>`<option value="${S(o.id)}">${S(o.sectorCode||o.id)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Airline</label>
          <select id="db-add-airline" class="admin-control h-10">
            <option value="">No Airline</option>
            ${O.map(o=>`<option value="${S(o.id)}">${S(o.code||"—")} · ${S(o.name||"Unnamed")}</option>`).join("")}
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
            ${Ct(Vt,30)}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Extra Baggage (kg)</label>
          <select id="db-add-exbag" class="admin-control h-10">
            ${Ct(Vt,20)}
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
  `);const e=document.getElementById("database-add-form");if(!e)return;const a=document.getElementById("db-add-sp"),s=document.getElementById("db-add-comm"),i=document.getElementById("db-add-rate"),n=document.getElementById("db-add-agent"),d=()=>{if(!i)return;const o=R(a==null?void 0:a.value,0),l=Math.max(0,R(s==null?void 0:s.value,0));i.value=String(Rt(o,l))},r=()=>{if(!s)return;const o=Pe(n==null?void 0:n.value,0);s.value=String(o),d()};a==null||a.addEventListener("input",d),n==null||n.addEventListener("change",r),r(),d(),e.addEventListener("submit",async o=>{var c,x,u,h,E,p,v,g,f,b,w,C;o.preventDefault();const l=e.querySelector('button[type="submit"]'),m=(l==null?void 0:l.textContent)||"Add Fare";l&&(l.disabled=!0,l.textContent="Adding...");try{const T=((c=document.getElementById("db-add-date"))==null?void 0:c.value)||"",P=ke(T);if(!P)throw new Error("Please provide a valid flight date.");const _=R((x=document.getElementById("db-add-sp"))==null?void 0:x.value,0),k=Math.max(0,R((u=document.getElementById("db-add-comm"))==null?void 0:u.value,0)),H=Rt(_,k);await Fa({agentId:((h=document.getElementById("db-add-agent"))==null?void 0:h.value)||"",sectorId:((E=document.getElementById("db-add-sector"))==null?void 0:E.value)||"",airlineId:((p=document.getElementById("db-add-airline"))==null?void 0:p.value)||"",flightDate:P,flightTime:((g=(v=document.getElementById("db-add-time"))==null?void 0:v.value)==null?void 0:g.trim())||"",specialRate:_,finalRate:H,commission:k,baggage:ht((f=document.getElementById("db-add-bag"))==null?void 0:f.value),extraBaggage:R((b=document.getElementById("db-add-exbag"))==null?void 0:b.value,0),isHidden:(((w=document.getElementById("db-add-status"))==null?void 0:w.value)||"live")==="hidden"}),(C=document.getElementById("admin-modal"))==null||C.close(),await ce(!0),$("success","Added","New fare row added.")}catch(T){$("error","Add Failed",T.message),l&&(l.disabled=!1,l.textContent=m)}})}const cn="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",mn={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},$e=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let K=null,ft=JSON.parse(localStorage.getItem("zt_hist")||"[]"),me=ft.reduce((t,e)=>t+(e.rows||0),0);function un(){var e,a,s,i;const t=document.getElementById("rateData");t&&t.addEventListener("input",function(){const n=this.value.length,d=document.getElementById("charCount");d&&(d.textContent=n.toLocaleString()+" character"+(n!==1?"s":"")),bt(),clearTimeout(window._previewTimer),n>15?window._previewTimer=setTimeout(()=>gn(this.value),500):zt()}),(e=document.getElementById("resetBtn"))==null||e.addEventListener("click",()=>{t&&(t.value="");const n=document.getElementById("charCount");n&&(n.textContent="0 characters"),zt(),bt()}),(a=document.getElementById("clearBtn"))==null||a.addEventListener("click",()=>{ft=[],me=0,Ot(),Tt(),se()}),(s=document.getElementById("manualAgent"))==null||s.addEventListener("input",function(){const n=parseInt(this.value);K=n>0?String(n):null,document.querySelectorAll(".rp-chip").forEach(d=>d.classList.remove("on")),Nt(),bt()}),(i=document.getElementById("submitBtn"))==null||i.addEventListener("click",fn),se(),Tt()}function qe(){const t=document.getElementById("chipGrid");if(!t)return;t.innerHTML="";const e=Y.length?[...Y].sort((a,s)=>{const i=parseInt(a.id),n=parseInt(s.id);return!isNaN(i)&&!isNaN(n)?i-n:a.id.localeCompare(s.id)}):[];if(!e.length){K=null,t.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>',Nt(),bt();return}K&&!e.some(a=>a.id===K)&&(K=null),e.forEach(a=>{const s=document.createElement("div");s.className="rp-chip",s.dataset.agentId=a.id,s.textContent=a.id,a.id===K&&s.classList.add("on"),s.addEventListener("click",()=>pn(a.id,a.name,s)),t.appendChild(s)}),Nt(),bt()}function pn(t,e,a){K=t,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(s=>{s.classList.remove("on")}),a&&a.classList.add("on"),Nt(),bt()}function Nt(){const t=document.getElementById("agentPill");if(t)if(K){const e=Y.find(a=>a.id===K);t.textContent=`Agent ${(e==null?void 0:e.id)||K} selected ✓`,t.classList.remove("empty")}else t.textContent="Select an agent to continue",t.classList.add("empty")}function bt(){const t=document.getElementById("rateData"),e=document.getElementById("submitBtn");e&&(e.disabled=!(K&&t&&t.value.trim().length>10))}function Oe(t){const e=[];let a=null,s="IX";for(const i of t.split(`
`)){const n=i.replace(/[*_~`]/g,"").trim();if(!n)continue;const d=n.match(/([A-Z]{3})\s+([A-Z]{3})/);if(d&&n.length<70&&!n.match(/\d{4,6}/)){a=d[1]+"-"+d[2];const r=n.match($e);r&&(s=r[1]);continue}if(a){const r=n.match($e);if(r&&!n.match(/\d{4,6}/)){s=r[1];continue}const o=n.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(o){const l=parseInt(o[3]);l>=1e3&&l<=99999&&e.push({sector:a,date:`2026-${mn[o[2].toUpperCase()]}-${o[1].padStart(2,"0")}`,airline:r?r[1]:s,rate:l})}}}return e}function gn(t){const e=Oe(t);if(!e.length){zt();return}const a=document.getElementById("prevBox");a&&a.classList.add("on");const s=document.getElementById("prevCount");s&&(s.textContent=e.length+" entr"+(e.length===1?"y":"ies"));const i=document.getElementById("prevBody");i&&(i.innerHTML=e.slice(0,60).map(n=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${n.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${n.rate.toLocaleString()}</td></tr>`).join(""),e.length>60&&(i.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${e.length-60} more</td></tr>`))}function zt(){var t;(t=document.getElementById("prevBox"))==null||t.classList.remove("on")}async function fn(){const t=document.getElementById("rateData");if(!K||!(t!=null&&t.value.trim()))return;const e=document.getElementById("submitBtn"),a=e.innerHTML;e.disabled=!0,e.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI pipeline...';const s=document.getElementById("progBar"),i=document.getElementById("progFill");s&&s.classList.add("on");let n=0;const d=setInterval(()=>{n=Math.min(n+Math.random()*13,85),i&&(i.style.width=n+"%")},280),r=Oe(t.value),o={id:Date.now(),agent:K,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:r.length,status:"pen"};ft.unshift(o),ft.length>15&&ft.pop(),Ot(),Tt();try{const l=await fetch(cn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:K,raw_text:t.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(d),i&&(i.style.width="100%"),l.ok)o.status="ok",me+=r.length,Ot(),Tt(),se(),$("success","Submitted","Rates sent to the AI parser. Firestore will update in a moment."),setTimeout(()=>{t.value="";const m=document.getElementById("charCount");m&&(m.textContent="0 characters"),zt(),bt()},500);else throw new Error("N8N webhook rejected payload")}catch(l){clearInterval(d),i&&(i.style.width="100%"),o.status="err",Ot(),Tt(),$("error","Submission Failed",l.message)}setTimeout(()=>{s&&s.classList.remove("on"),i&&(i.style.width="0%"),e.innerHTML=a,bt()},900)}function se(){const t=document.getElementById("statSubs");t&&(t.textContent=ft.length);const e=document.getElementById("statEntries");e&&(e.textContent=me)}function Ot(){localStorage.setItem("zt_hist",JSON.stringify(ft))}function Tt(){const t=document.getElementById("historyWrap");if(t){if(!ft.length){t.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}t.innerHTML=ft.map(e=>{var s;const a=((s=Y.find(i=>i.id===e.agent))==null?void 0:s.name)||`Agent ${e.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${a.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${a}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${e.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${e.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${e.status==="ok"?"bg-green-500":e.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}const bn=210/25.4*96,hn=297/25.4*96;function Ee(){const t=document.getElementById("eticket-output-wrapper"),e=document.getElementById("eticket-print-area");if(!t||!e||t.classList.contains("hidden"))return;e.style.zoom="1",e.style.removeProperty("--eticket-print-scale");const a=Math.max(e.scrollWidth,e.offsetWidth),s=Math.max(e.scrollHeight,e.offsetHeight);if(!a||!s)return;const i=bn/a,n=hn/s;let d=Math.min(1,i,n);d<1&&(d=Math.max(.7,d*.985)),e.style.zoom=String(d),e.style.setProperty("--eticket-print-scale",String(d))}function yn(){const t=document.getElementById("eticket-print-area");t&&(t.style.zoom="1",t.style.removeProperty("--eticket-print-scale"))}async function vn(){var r;const t=document.getElementById("eticket-tab");if(!t)return;const e=document.getElementById("eticket-form"),a=document.getElementById("et-add-passenger"),s=document.getElementById("et-passengers-container"),i=document.getElementById("et-airline"),n=document.getElementById("et-origin"),d=document.getElementById("et-destination");if(O.length===0&&(O=await re()),M.length===0&&(M=de(await oe())),!t.dataset.wired){if(t.dataset.wired="1",i&&O&&(i.innerHTML='<option value="">Select Airline</option>'+O.map(l=>`<option value="${l.name}">${l.name}</option>`).join("")),n&&M){const l=[...new Set(M.map(m=>m.sectorFrom).filter(Boolean))].sort();n.innerHTML='<option value="">Select Origin</option>'+l.map(m=>`<option value="${m}">${m}</option>`).join("")}if(d&&M){const l=[...new Set(M.map(m=>m.sectorTo).filter(Boolean))].sort();d.innerHTML='<option value="">Select Destination</option>'+l.map(m=>`<option value="${m}">${m}</option>`).join("")}const o=()=>{const l=Array.from(s.querySelectorAll(".et-pax-row"));l.forEach((m,c)=>{const x=m.querySelector(".et-passenger-index");x&&(x.textContent=`Passenger ${c+1}`);const u=m.querySelector(".et-remove-passenger");u&&(l.length<=1?(u.classList.add("opacity-40","pointer-events-none"),u.setAttribute("aria-disabled","true")):(u.classList.remove("opacity-40","pointer-events-none"),u.removeAttribute("aria-disabled")))})};a==null||a.addEventListener("click",()=>{const l=`
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
                ${Ct(Te,7)}
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Check-in Bag</label>
              <select name="paxCheckBag[]" class="admin-control h-10">
                ${Ct(Vt,30)}
              </select>
            </div>
          </div>
        </div>
      `;s.insertAdjacentHTML("beforeend",l),o()}),s==null||s.addEventListener("click",l=>{var c;const m=l.target.closest(".et-remove-passenger");m&&((c=m.closest(".et-pax-row"))==null||c.remove(),o())}),s.children.length===0&&(a==null||a.click()),o(),e==null||e.addEventListener("submit",async l=>{l.preventDefault(),await xn(new FormData(e))}),(r=document.getElementById("et-print-btn"))==null||r.addEventListener("click",()=>{Ee(),requestAnimationFrame(()=>window.print())}),window.addEventListener("beforeprint",Ee),window.addEventListener("afterprint",yn),e==null||e.addEventListener("reset",()=>{setTimeout(()=>{var l;Array.from(s.children).forEach((m,c)=>{c>0&&m.remove()}),s.children.length===0&&(a==null||a.click()),o(),(l=document.getElementById("eticket-output-wrapper"))==null||l.classList.add("hidden")},10),$("info","Form Reset","The E-Ticket form has been cleared.")})}}async function xn(t){var ct,tt,G;const e=(ct=t.get("etPnr"))==null?void 0:ct.toUpperCase(),a=(tt=t.get("etAirline"))==null?void 0:tt.toUpperCase(),s=(G=t.get("etFlightNo"))==null?void 0:G.toUpperCase(),i=t.get("etDate"),n=t.get("etDepTime"),d=t.get("etArrTime"),r=t.get("etPhone"),o=(B="")=>String(B).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),l=B=>{const q=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec(B||"");return q?Number(q[1])*60+Number(q[2]):null},m=(B="")=>B.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",c=B=>{const q=(B||"").trim();let D=q,j="";const Z=q.match(/^(.*?)\s*\((.*?)\)$/);return Z&&(D=Z[1].trim(),j=Z[2].trim()),{city:D,code:j}},x=c(t.get("etOrigin")),u=c(t.get("etDest")),h=t.get("etOrigin")||"—",E=t.get("etDest")||"—";let p="—";if(i){const B=new Date(i);if(!isNaN(B.getTime())){const q=["SUN","MON","TUE","WED","THU","FRI","SAT"],D=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];p=`${q[B.getDay()]}, ${String(B.getDate()).padStart(2,"0")} ${D[B.getMonth()]} ${B.getFullYear()}`}}const v=B=>document.getElementById(B);let g=x.code,f=u.code,b=null;if(typeof M<"u"){if(b=M.find(B=>B.sectorFrom===h&&B.sectorTo===E),!b&&h){const B=M.find(q=>q.sectorFrom===h);B&&B.sectorCode&&(g=B.sectorCode.split(/[ -]+/)[0])}if(!b&&E){const B=M.find(q=>q.sectorTo===E);B&&B.sectorCode&&(f=B.sectorCode.split(/[ -]+/).pop())}}const w=(g||m(x.city)).toUpperCase(),C=(f||m(u.city)).toUpperCase(),T=`${w} - ${C}`,P=`${(x.city||h).toUpperCase()} to ${(u.city||E).toUpperCase()}`,_=(x.city||h).toUpperCase(),k=(u.city||E).toUpperCase(),H=l(n),Q=l(d);if(H!==null&&Q!==null){let B=Q-H;B<0&&(B+=24*60);const q=Math.floor(B/60),D=B%60;`${q}${String(D).padStart(2,"0")}`}v("t-pnr")&&(v("t-pnr").textContent=e||"—"),v("t-issued-by")&&(v("t-issued-by").textContent=a||"—"),v("t-customer-phone")&&(v("t-customer-phone").textContent=r||"—"),v("t-flight-code")&&(v("t-flight-code").textContent=s||"—"),v("t-travel-date")&&(v("t-travel-date").textContent=p||"—"),v("t-route-code")&&(v("t-route-code").textContent=T),v("t-route-long")&&(v("t-route-long").textContent=P);const V=new Date,vt=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],$t=`${String(V.getDate()).padStart(2,"0")} ${vt[V.getMonth()]} ${V.getFullYear()} ${String(V.getHours()).padStart(2,"0")}:${String(V.getMinutes()).padStart(2,"0")}`;v("t-booked-on")&&(v("t-booked-on").textContent=$t);const at=v("t-airline-logo"),st=v("t-issued-by-fallback");if(at){const B=typeof O<"u"?O.find(q=>q.name.toUpperCase()===a):null;B&&B.logoUrl?(at.src=B.logoUrl,at.classList.remove("hidden"),st&&st.classList.add("hidden")):(at.removeAttribute("src"),at.classList.add("hidden"),st&&(st.classList.remove("hidden"),st.textContent=(a||"No logo").toUpperCase()))}const y=t.getAll("paxTitle[]"),A=t.getAll("paxName[]"),L=t.getAll("paxType[]"),U=t.getAll("paxCheckBag[]"),N=t.getAll("paxCarryBag[]");v("t-pax-count")&&(v("t-pax-count").textContent=String(A.length)),v("t-top-pax-count")&&(v("t-top-pax-count").textContent=String(A.length));const Et=document.getElementById("t-passengers-tbody");if(Et){const B=A.map((q,D)=>{const j=o((y[D]||"MR").toUpperCase()),Z=o((A[D]||"").toUpperCase()),Pt=o((L[D]||"ADT").toUpperCase()),It=o(xe(U[D])),Xt=o(xe(N[D])),ot=b&&b.sectorCode?o(b.sectorCode.toUpperCase()):o(T);return`
        <tr class="${D%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${D+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${j}. ${Z}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Pt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${ot}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${o(s||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${o(e||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Xt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${It}</td>
        </tr>
      `}).join("");Et.innerHTML=B||`
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `}const it=document.getElementById("t-travel-tbody");it&&(it.innerHTML=`
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${o(s||"—")}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${o(_)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${o(w)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${o(n||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${o(p||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${o(k)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${o(C)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${o(d||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${o(p||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const yt=document.getElementById("eticket-output-wrapper");yt&&(yt.classList.remove("hidden"),yt.scrollIntoView({behavior:"smooth"}))}const Ie={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function $(t,e,a){const s=document.getElementById("toastsEl");if(!s)return;const i=document.createElement("div"),n={success:"border-emerald-200 bg-emerald-50/95 text-emerald-900",error:"border-rose-200 bg-rose-50/95 text-rose-900",warning:"border-amber-200 bg-amber-50/95 text-amber-900",info:"border-blue-200 bg-blue-50/95 text-blue-900"};i.className=`flex items-start gap-3 p-4 border rounded-xl shadow-md w-80 pointer-events-auto backdrop-blur-sm ${n[t]||n.error}`,i.innerHTML=`<div class="mt-0.5">${Ie[t]||Ie.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${e}</div><div class="text-xs opacity-90 mt-1">${a}</div></div>
    <button class="opacity-50 hover:opacity-100 transition-opacity" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,s.appendChild(i),setTimeout(()=>i.isConnected&&i.remove(),7e3)}window.toast=$;document.addEventListener("DOMContentLoaded",()=>{});async function lt(t=!0){if(t)try{const[n,d,r,o]=await Promise.all([Ae(),ma(),ua(),pa()]);_t=n,Zt=d,Qt=r,te=o,I.visas=1,I.visaStampings=1,I.attestations=1,I.passportServices=1}catch(n){$("error","Error loading Visas tab data",n.message)}const e=document.querySelector("#visas-tab #visas-table-body");if(e){const n=ut(_t,"visas"),d=J.visas,r=Math.max(1,Math.ceil(n.length/d));I.visas>r&&(I.visas=r);const o=(I.visas-1)*d,l=n.slice(o,o+d);e.innerHTML=l.length?l.map(m=>$n(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No tourist visas yet. Click "Add Tourist Visa".</td></tr>',En()}const a=document.querySelector("#visa-stamping-table-body");if(a){const n=ut(Zt,"visaStampings"),d=J.visaStampings,r=Math.max(1,Math.ceil(n.length/d));I.visaStampings>r&&(I.visaStampings=r);const o=(I.visaStampings-1)*d,l=n.slice(o,o+d);a.innerHTML=l.length?l.map(m=>In(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No visa stampings yet. Click "Add Visa Stamping".</td></tr>',Sn()}const s=document.querySelector("#attestations-table-body");if(s){const n=ut(Qt,"attestations"),d=J.attestations,r=Math.max(1,Math.ceil(n.length/d));I.attestations>r&&(I.attestations=r);const o=(I.attestations-1)*d,l=n.slice(o,o+d);s.innerHTML=l.length?l.map(m=>Cn(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No attestations yet. Click "Add Attestation".</td></tr>',Bn()}const i=document.querySelector("#passport-services-table-body");if(i){const n=ut(te,"passportServices"),d=J.passportServices,r=Math.max(1,Math.ceil(n.length/d));I.passportServices>r&&(I.passportServices=r);const o=(I.passportServices-1)*d,l=n.slice(o,o+d);i.innerHTML=l.length?l.map(m=>An(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No passport services yet. Click "Add Passport Service".</td></tr>',Ln()}wn()}function wn(){const t=document.getElementById("visas-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>_e(null)));const e=document.getElementById("visa-stamping-add-btn");e&&!e.dataset.wired&&(e.dataset.wired="1",e.addEventListener("click",()=>Ve(null)));const a=document.getElementById("attestation-add-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",()=>ze(null)));const s=document.getElementById("passport-service-add-btn");s&&!s.dataset.wired&&(s.dataset.wired="1",s.addEventListener("click",()=>Ge(null)))}function $n(t){const e=t.flagUrl?`<span class="admin-logo-wrap"><img src="${t.flagUrl}" alt="${S(t.countryName||"Country")}"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-flag"></i></span></span>';return`<tr data-visa-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy">${S(t.countryName)}</td>
    <td class="text-text-muted text-[13px]">${S(t.visaType)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.rate||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function En(){const t=document.querySelector("#visas-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=_t.find(d=>d.id===i);if(s==="edit-visa"&&_e(n),s==="delete-visa"){if(!confirm(`Delete visa for "${n==null?void 0:n.countryName}"?`))return;try{await ga(i),$("success","Deleted",`Visa for "${n==null?void 0:n.countryName}" removed.`),await lt()}catch(d){$("error","Error",d.message)}}}))}function _e(t){const e=document.getElementById("modal-visa-form");if(!e)return;dt(t?"Edit Visa":"Add New Visa",e.innerHTML);const a=document.getElementById("visa-form"),s=document.getElementById("visa-id"),i=document.getElementById("visa-country"),n=document.getElementById("visa-type"),d=document.getElementById("visa-rate");t&&(s.value=t.id,i.value=t.countryName||"",n.value=t.visaType||"",d.value=t.rate||0),a.addEventListener("submit",async r=>{r.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=s.value,m={countryName:i.value.trim(),visaType:n.value.trim(),rate:Number(d.value)},x=document.getElementById("visa-flag").files[0];l?await fa(l,m,x):await ba(m,x),$("success","Saved!",`Visa for ${m.countryName} saved.`),document.getElementById("admin-modal").close(),await lt()}catch(l){$("error","Error",l.message),o.disabled=!1,o.textContent="Save Visa"}})}function In(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${S(t.country)}</td>
    <td class="text-text-muted text-[13px]">${S(t.description)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Sn(){const t=document.getElementById("visa-stamping-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Zt.find(d=>d.id===i);if(s==="edit-visa-stamping"&&Ve(n),s==="delete-visa-stamping"){if(!confirm(`Delete visa stamping for "${n==null?void 0:n.country}"?`))return;try{await ha(i),$("success","Deleted",`Visa Stamping for "${n==null?void 0:n.country}" removed.`),await lt(!0)}catch(d){$("error","Error",d.message)}}}))}function Ve(t){const e=document.getElementById("modal-visa-stamping-form");if(!e)return;dt(t?"Edit Visa Stamping":"Add Visa Stamping",e.innerHTML);const a=document.getElementById("visa-stamping-form"),s=document.getElementById("visa-stamping-id"),i=document.getElementById("visa-stamping-country"),n=document.getElementById("visa-stamping-desc"),d=document.getElementById("visa-stamping-cost");t&&(s.value=t.id,i.value=t.country||"",n.value=t.description||"",d.value=t.cost||0),a.addEventListener("submit",async r=>{r.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=s.value,m={country:i.value.trim(),description:n.value.trim(),cost:Number(d.value)};l?await ya(l,m):await va(m),$("success","Saved!",`Visa stamping for ${m.country} saved.`),document.getElementById("admin-modal").close(),await lt(!0)}catch(l){$("error","Error",l.message),o.disabled=!1,o.textContent="Save"}})}function Cn(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${S(t.country)}</td>
    <td class="text-text-muted text-[13px]">${S(t.certificate)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-attestation" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-attestation" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Bn(){const t=document.getElementById("attestations-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Qt.find(d=>d.id===i);if(s==="edit-attestation"&&ze(n),s==="delete-attestation"){if(!confirm(`Delete attestation for "${n==null?void 0:n.country}"?`))return;try{await xa(i),$("success","Deleted",`Attestation for "${n==null?void 0:n.country}" removed.`),await lt(!0)}catch(d){$("error","Error",d.message)}}}))}function ze(t){const e=document.getElementById("modal-attestation-form");if(!e)return;dt(t?"Edit Attestation":"Add Attestation",e.innerHTML);const a=document.getElementById("attestation-form"),s=document.getElementById("attestation-id"),i=document.getElementById("attestation-country"),n=document.getElementById("attestation-cert"),d=document.getElementById("attestation-cost");t&&(s.value=t.id,i.value=t.country||"",n.value=t.certificate||"",d.value=t.cost||0),a.addEventListener("submit",async r=>{r.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=s.value,m={country:i.value.trim(),certificate:n.value.trim(),cost:Number(d.value)};l?await wa(l,m):await $a(m),$("success","Saved!",`Attestation for ${m.country} saved.`),document.getElementById("admin-modal").close(),await lt(!0)}catch(l){$("error","Error",l.message),o.disabled=!1,o.textContent="Save"}})}function An(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${S(t.type)}</td>
    <td class="text-text-muted text-[13px]">${S(t.description)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Ln(){const t=document.getElementById("passport-services-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=te.find(d=>d.id===i);if(s==="edit-passport-service"&&Ge(n),s==="delete-passport-service"){if(!confirm(`Delete passport service "${n==null?void 0:n.type}"?`))return;try{await Ea(i),$("success","Deleted",`Passport service "${n==null?void 0:n.type}" removed.`),await lt(!0)}catch(d){$("error","Error",d.message)}}}))}function Ge(t){const e=document.getElementById("modal-passport-service-form");if(!e)return;dt(t?"Edit Passport Service":"Add Passport Service",e.innerHTML);const a=document.getElementById("passport-service-form"),s=document.getElementById("passport-service-id"),i=document.getElementById("passport-service-type"),n=document.getElementById("passport-service-desc"),d=document.getElementById("passport-service-cost");t&&(s.value=t.id,i.value=t.type||"",n.value=t.description||"",d.value=t.cost||0),a.addEventListener("submit",async r=>{r.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=s.value,m={type:i.value.trim(),description:n.value.trim(),cost:Number(d.value)};l?await Ia(l,m):await Sa(m),$("success","Saved!",`Passport service ${m.type} saved.`),document.getElementById("admin-modal").close(),await lt(!0)}catch(l){$("error","Error",l.message),o.disabled=!1,o.textContent="Save"}})}async function Jt(t=!0){if(t)try{ee=await Ca({includeInactive:!0}),I.tours=1}catch(r){$("error","Error loading Tours",r.message)}const e=document.getElementById("tours-table-body");if(!e)return;const a=ut(ee,"tours"),s=J.tours,i=Math.max(1,Math.ceil(a.length/s));I.tours>i&&(I.tours=i);const n=(I.tours-1)*s,d=a.slice(n,n+s);e.innerHTML=d.length?d.map(r=>kn(r)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No tour packages yet. Click "Add Tour Package".</td></tr>',Dn(),Tn()}function Tn(){const t=document.getElementById("tours-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>We(null)))}function kn(t){const e=t.coverImageUrl?`<span class="admin-logo-wrap"><img src="${t.coverImageUrl}" alt="${S(t.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>',a=!t.price||t.price===0?'<span class="text-text-muted text-[12px] italic">Call for Price</span>':`<span class="font-black text-[15px] text-navy">₹${Number(t.price).toLocaleString()}</span>`,s=t.isActive!==!1?'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>':'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>';return`<tr data-tour-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy">${S(t.title)}</td>
    <td class="text-text-muted text-[13px]">${S(t.category)}</td>
    <td class="text-text-muted text-[13px]">${S(t.duration)}</td>
    <td>${a}</td>
    <td>${s}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-tour" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-tour" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Dn(){const t=document.getElementById("tours-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=ee.find(d=>d.id===i);if(s==="edit-tour"&&We(n),s==="delete-tour"){if(!confirm(`Delete tour package "${n==null?void 0:n.title}"?`))return;try{await Ba(i),$("success","Deleted",`Tour "${n==null?void 0:n.title}" removed.`),await Jt()}catch(d){$("error","Error",d.message)}}}))}function kt(t=""){return t.split(`
`).map(e=>e.trim()).filter(Boolean)}function Dt(t=[]){return Array.isArray(t)?t.join(`
`):""}function Mn(t,e="",a=[]){const s=a.length?a.join(`
`):"";return`
    <div class="tour-day-row relative rounded-xl border border-slate-200 bg-slate-50/70 p-4" data-day-index="${t}">
      <div class="flex items-center justify-between mb-3 pr-8">
        <span class="tour-day-number text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">Day ${t+1}</span>
      </div>
      <button type="button" class="tour-remove-day absolute top-3 right-3 w-7 h-7 rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center" title="Remove day">
        <i class="bi bi-x-lg text-[11px]"></i>
      </button>
      <div class="space-y-2.5">
        <div>
          <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Day Label / Title *</label>
          <input type="text" class="tour-day-label admin-control h-9 text-sm" placeholder="e.g. Day 1 – Arrival" value="${S(e)}" required>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Activities <span class="font-normal normal-case">(one per line)</span></label>
          <textarea class="tour-day-activities admin-control text-sm" rows="3" placeholder="Airport pickup&#10;Hotel check-in&#10;Welcome dinner">${S(s)}</textarea>
        </div>
      </div>
    </div>`}function Se(t){const e=t.querySelectorAll(".tour-day-row");e.forEach((a,s)=>{const i=a.querySelector(".tour-day-number");i&&(i.textContent=`Day ${s+1}`),a.dataset.dayIndex=s;const n=a.querySelector(".tour-remove-day");n&&(e.length<=1?n.classList.add("opacity-40","pointer-events-none"):n.classList.remove("opacity-40","pointer-events-none"))})}function Fn(t){const e=t.querySelectorAll(".tour-day-row");return Array.from(e).map(a=>{var s,i;return{day:((s=a.querySelector(".tour-day-label"))==null?void 0:s.value.trim())||"",activities:(((i=a.querySelector(".tour-day-activities"))==null?void 0:i.value)||"").split(`
`).map(n=>n.trim()).filter(Boolean)}}).filter(a=>a.day)}function We(t){const e=document.getElementById("modal-tour-form");if(!e)return;dt(t?"Edit Tour Package":"Add Tour Package",e.innerHTML,!0);const a=document.getElementById("tour-form"),s=document.getElementById("tour-id"),i=document.getElementById("tour-title"),n=document.getElementById("tour-category"),d=document.getElementById("tour-duration"),r=document.getElementById("tour-price"),o=document.getElementById("tour-active"),l=document.getElementById("tour-description"),m=document.getElementById("tour-highlights"),c=document.getElementById("tour-inclusions"),x=document.getElementById("tour-exclusions"),u=document.getElementById("tour-itinerary-container"),h=document.getElementById("tour-add-day-btn"),E=(p="",v=[])=>{const g=u.querySelectorAll(".tour-day-row").length;u.insertAdjacentHTML("beforeend",Mn(g,p,v)),Se(u)};h==null||h.addEventListener("click",()=>{var p;E(),(p=u.lastElementChild)==null||p.scrollIntoView({behavior:"smooth",block:"nearest"})}),u.addEventListener("click",p=>{var g;const v=p.target.closest(".tour-remove-day");v&&((g=v.closest(".tour-day-row"))==null||g.remove(),Se(u))}),t&&(s.value=t.id,i.value=t.title||"",n.value=t.category||"International",d.value=t.duration||"",r.value=t.price||0,o.checked=t.isActive!==!1,l.value=t.description||"",m.value=Dt(t.highlights),c.value=Dt(t.inclusions),x.value=Dt(t.exclusions),(Array.isArray(t.itinerary)?t.itinerary:[]).forEach(v=>E(v.day||"",v.activities||[]))),u.querySelectorAll(".tour-day-row").length===0&&E(),a.addEventListener("submit",async p=>{var g;p.preventDefault();const v=a.querySelector('button[type="submit"]');v.disabled=!0,v.textContent="Saving…";try{const f=s.value,b=Fn(u),w={title:i.value.trim(),category:n.value,duration:d.value.trim(),price:Number(r.value)||0,isActive:o.checked,description:l.value.trim(),highlights:kt(m.value),itinerary:b,inclusions:kt(c.value),exclusions:kt(x.value)},C=((g=document.getElementById("tour-image"))==null?void 0:g.files[0])||null;f?await Aa(f,w,C):await La(w,C),$("success","Saved!",`Tour "${w.title}" saved.`),document.getElementById("admin-modal").close(),await Jt()}catch(f){$("error","Error",f.message),v.disabled=!1,v.textContent="Save Tour"}})}async function Yt(t=!0){if(t)try{ae=await Ta({includeInactive:!0}),I.hajjUmrah=1}catch(r){$("error","Error loading Hajj & Umrah",r.message)}const e=document.getElementById("hajjumrah-table-body");if(!e)return;const a=ut(ae,"hajjUmrah"),s=J.hajjUmrah,i=Math.max(1,Math.ceil(a.length/s));I.hajjUmrah>i&&(I.hajjUmrah=i);const n=(I.hajjUmrah-1)*s,d=a.slice(n,n+s);e.innerHTML=d.length?d.map(r=>Rn(r)).join(""):'<tr><td colspan="10" class="text-center py-8 text-text-muted">No packages yet. Click "Add Package".</td></tr>',Nn(),jn()}function jn(){const t=document.getElementById("hajjumrah-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>Je(null)))}function Rn(t){const e=t.coverImageUrl?`<span class="admin-logo-wrap"><img src="${t.coverImageUrl}" alt="${S(t.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>',a=!t.price||t.price===0?'<span class="text-text-muted text-[12px] italic">Call for Price</span>':`<span class="font-black text-[15px] text-navy">₹${Number(t.price).toLocaleString()}</span>`,s=t.isActive!==!1?'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>':'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>',i=t.type==="Hajj"?'<span class="px-2 py-0.5 rounded bg-blue-50 text-primary text-[11px] font-semibold">Hajj</span>':'<span class="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[11px] font-semibold">Umrah</span>';return`<tr data-hajjumrah-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy truncate max-w-[150px]" title="${S(t.title)}">${S(t.title)}</td>
    <td>${i}</td>
    <td class="text-text-muted text-[13px]">${S(t.departureCity)}</td>
    <td class="text-text-muted text-[13px]">${S(t.airline)}</td>
    <td class="text-text-muted text-[13px]">${S(t.departureDate)}</td>
    <td class="text-navy font-medium text-[13px]">${t.days}D/${t.nights}N</td>
    <td>${a}</td>
    <td>${s}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-hajjumrah" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-hajjumrah" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Nn(){const t=document.getElementById("hajjumrah-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=ae.find(d=>d.id===i);if(s==="edit-hajjumrah"&&Je(n),s==="delete-hajjumrah"){if(!confirm(`Delete package "${n==null?void 0:n.title}"?`))return;try{await ka(i),$("success","Deleted",`Package "${n==null?void 0:n.title}" removed.`),await Yt()}catch(d){$("error","Error",d.message)}}}))}function Je(t){const e=document.getElementById("modal-hajjumrah-form");if(!e)return;dt(t?"Edit Package":"Add Package",e.innerHTML);const a=document.getElementById("hajjumrah-form"),s=document.getElementById("hajjumrah-id"),i=document.getElementById("hajjumrah-title"),n=document.getElementById("hajjumrah-type"),d=document.getElementById("hajjumrah-city"),r=document.getElementById("hajjumrah-airline"),o=document.getElementById("hajjumrah-date"),l=document.getElementById("hajjumrah-days"),m=document.getElementById("hajjumrah-nights"),c=document.getElementById("hajjumrah-price"),x=document.getElementById("hajjumrah-active"),u=document.getElementById("hajjumrah-description"),h=document.getElementById("hajjumrah-highlights"),E=document.getElementById("hajjumrah-inclusions");t&&(s.value=t.id,i.value=t.title||"",n.value=t.type||"Umrah",d.value=t.departureCity||"",r.value=t.airline||"",o.value=t.departureDate||"",l.value=t.days||15,m.value=t.nights||14,c.value=t.price||0,x.checked=t.isActive!==!1,u.value=t.description||"",h.value=Dt(t.highlights),E.value=Dt(t.inclusions)),a.addEventListener("submit",async p=>{var g;p.preventDefault();const v=a.querySelector('button[type="submit"]');v.disabled=!0,v.textContent="Saving…";try{const f=s.value,b={title:i.value.trim(),type:n.value,departureCity:d.value.trim(),airline:r.value.trim(),departureDate:o.value.trim(),days:Number(l.value)||1,nights:Number(m.value)||1,price:Number(c.value)||0,isActive:x.checked,description:u.value.trim(),highlights:kt(h.value),inclusions:kt(E.value)},w=((g=document.getElementById("hajjumrah-image"))==null?void 0:g.files[0])||null;f?await Da(f,b,w):await Ma(b,w),$("success","Saved!",`Package "${b.title}" saved.`),document.getElementById("admin-modal").close(),await Yt()}catch(f){$("error","Error",f.message),v.disabled=!1,v.textContent="Save Package"}})}
