import"./index.esm-kRT_WKqT.js";import{o as Ge,l as Je}from"./auth-Dh4PYA5s.js";import{a as Vt,d as oe,u as Ie,c as Se,e as Ye,f as Xe,h as Ke,i as Ze,g as re,j as Qe,k as ta,l as ea,m as aa,b as de,n as na,o as sa,p as ia,q as oa,r as Be,s as ra,t as da,v as la,w as ca,x as ma,y as ua,z as pa,A as ga,B as fa,C as ba,D as ha,E as ya,F as va,G as xa,H as wa,I as Ea,J as $a,K as Ia,L as Sa,M as Ba,N as Ca,O as Aa,P as La,Q as Ta}from"./db-C0m7-YSF.js";import"./firebase-config-aHS-3htW.js";async function ka(t,e,a,s,i){const n=`Generating ${t} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",n),new Promise(async(r,d)=>{try{let ft=function(v,B,L,F,j){c.beginPath(),c.moveTo(v+j,B),c.lineTo(v+L-j,B),c.arcTo(v+L,B,v+L,B+j,j),c.lineTo(v+L,B+F-j),c.arcTo(v+L,B+F,v+L-j,B+F,j),c.lineTo(v+j,B+F),c.arcTo(v,B+F,v,B+F-j,j),c.lineTo(v,B+j),c.arcTo(v,B,v+j,B,j),c.closePath()},Ht=function(v){const B=v-it;if(B>xt){try{_.stop()}catch(S){console.error("Error stopping recorder",S)}return}c.fillStyle="#f8fafc",c.fillRect(0,0,o,l);const L=t==="9x16"?400:300;if(c.fillStyle="#1e293b",c.fillRect(0,0,o,L),w.complete&&w.width>0){c.globalAlpha=.2;const S=Math.max(o/w.width,L/w.height),C=w.width*S,R=w.height*S,ht=(o-C)/2,tt=(L-R)/2;c.drawImage(w,ht,tt,C,R),c.globalAlpha=1}const F=c.createLinearGradient(0,0,0,L);F.addColorStop(0,"#1e293b"),F.addColorStop(1,"transparent"),c.fillStyle=F,c.globalAlpha=.8,c.fillRect(0,0,o,L),c.globalAlpha=1,c.textAlign="center",c.textBaseline="middle";const j=c.createLinearGradient(0,0,o,0);j.addColorStop(0,"#2563eb"),j.addColorStop(.5,"#60a5fa"),j.addColorStop(1,"#1558c0"),c.fillStyle=j,c.fillRect(0,0,o,16);const It=200,ot=40,bt=60;c.fillStyle="rgba(37, 99, 235, 0.4)",ft(o/2-It/2,bt,It,ot,20),c.fill(),c.strokeStyle="rgba(37, 99, 235, 0.6)",c.lineWidth=1,c.stroke(),c.fillStyle="#bfdbfe",c.font="bold 16px Arial, sans-serif",c.fillText("EXCLUSIVE DEALS",o/2,bt+ot/2),c.fillStyle="#ffffff",c.font="900 "+(t==="16x9"?"70px":"56px")+" Arial, sans-serif",c.fillText(y,o/2,bt+80),c.fillStyle="#dbeafe",c.font="700 24px Arial, sans-serif",c.fillText("SPECIAL FARES AVAILABLE NOW",o/2,bt+140);const rt=L+60,Y=90,U=t==="9x16"?40:t==="1x1"?80:160,K=o-U*2;c.fillStyle="#64748b",c.font="bold 18px Arial, sans-serif",c.textAlign="left",c.fillText("DATE",U+20,rt-20),c.textAlign="center",c.fillText("SECTOR",U+K*.25,rt-20),c.fillText("AIRLINE",U+K*.45,rt-20),c.fillText("TIME",U+K*.65,rt-20),c.textAlign="right",c.fillText("FARE",U+K-20,rt-20);for(let S=0;S<p.length;S++){const C=p[S],R=1e3+S*800;if(B<R)continue;const tt=Math.min(1,(B-R)/500),Jt=20*(1-tt),et=rt+S*Y+Jt;c.globalAlpha=tt,S%2===0&&(c.fillStyle="#ffffff",ft(U,et,K,Y-10,12),c.fill()),c.fillStyle="#0f172a",c.textBaseline="middle";const Yt=C.flightDate instanceof Date?C.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():C.flightDate;c.textAlign="left",c.font="900 26px Arial, sans-serif",c.fillText(Yt,U+20,et+Y/2-5),c.font="700 22px Arial, sans-serif",c.fillStyle="#2563eb",c.textAlign="center";const Xt=A[C.sectorId]||C.sectorId;c.fillText(Xt,U+K*.25,et+Y/2-5),c.fillStyle="#0f172a";const Kt=U+K*.45,Bt=h(C.airlineId),Pt=Bt?T[Bt.id]:null;if(Pt&&Pt.width>0){const yt=Math.min(100,Pt.width),he=40;c.drawImage(Pt,Kt-yt/2,et+Y/2-5-he/2,yt,he)}else{c.font="700 20px Arial, sans-serif",c.textAlign="center";const yt=(Bt==null?void 0:Bt.name)||C.airlineId||"—";c.fillText(yt,Kt,et+Y/2-5)}let Ut=C.flightTime||"—";if(Ut.includes("-")){const yt=Ut.split("-");Ut=`${yt[0].trim()} - ${yt[1].trim()}`}c.font="800 22px Arial, sans-serif",c.textAlign="center",c.fillText(Ut,U+K*.65,et+Y/2-5);const pe=`₹${(C.finalRate||0).toLocaleString()}`;c.font="900 26px Arial, sans-serif",c.textAlign="right";const We=c.measureText(pe).width,ge=U+K-20,fe=We+40,be=50;c.fillStyle="#0f172a",ft(ge-fe,et+Y/2-5-be/2,fe,be,12),c.fill(),c.fillStyle="#ffffff",c.fillText(pe,ge-20,et+Y/2-5),c.globalAlpha=1}const St=1e3+p.length*800+500;if(B>St){const S=Math.min(1,(B-St)/500);c.globalAlpha=S;const C=100,R=l-C+20*(1-S);c.fillStyle="#ffffff",c.fillRect(0,l-C,o,C),c.fillRect(0,R,o,C),c.fillStyle="#f1f5f9",c.fillRect(0,l-C,o,2),E.complete&&E.width>0&&c.drawImage(E,U,l-C/2-24,48,48),c.fillStyle="#1e293b",c.font="900 24px Arial, sans-serif",c.textAlign="left",c.textBaseline="middle",c.fillText("Zamra Travels",U+64,l-C/2),c.font="700 20px Arial, sans-serif",c.textAlign="right",c.fillText("zamratravels.com  |  +91 98466 06739",o-U,l-C/2),c.globalAlpha=1}requestAnimationFrame(Ht)},o,l;if(t==="1x1")o=1080,l=1080;else if(t==="9x16")o=1080,l=1920;else if(t==="16x9")o=1920,l=1080;else throw new Error("Invalid ratio selected");const m=document.createElement("canvas");m.width=o,m.height=l;const c=m.getContext("2d");c.imageSmoothingEnabled=!0;let y="MULTIPLE → SECTORS";if(a!=="all"){const v=s.find(F=>F.id===a),B=v?(v.sectorFrom||"DEP").toUpperCase():"DEP",L=v?(v.sectorTo||"ARR").toUpperCase():"ARR";y=`${B} → ${L}`}const g=new Map;e.forEach(v=>{const B=v.flightDate instanceof Date?v.flightDate.getTime():v.flightDate,L=`${v.sectorId}_${v.airlineId}_${B}_${v.flightTime}`;g.has(L)?v.finalRate<g.get(L).finalRate&&g.set(L,v):g.set(L,v)});const p=Array.from(g.values()).sort((v,B)=>{let L=v.flightDate,F=B.flightDate;return L instanceof Date&&(L=L.getTime()),F instanceof Date&&(F=F.getTime()),L-F}),b={};i.forEach(v=>{v.id&&(b[v.id.trim().toLowerCase()]=v),v.code&&(b[v.code.trim().toLowerCase()]=v),v.name&&(b[v.name.trim().toLowerCase()]=v)});const h=v=>v?b[String(v).trim().toLowerCase()]:null,A={};s.forEach(v=>{A[v.id]=v.sectorCode||v.id});async function f(v){if(!v)return null;try{const B=await fetch(v);if(!B.ok)return null;const L=await B.blob(),F=URL.createObjectURL(L);return new Promise((j,It)=>{const ot=new Image;ot.onload=()=>j(ot),ot.onerror=()=>j(null),ot.src=F})}catch{return null}}const w=new Image;await new Promise(v=>{w.onload=v,w.onerror=v,w.src="/assets/img/hero-bg.webp"});const E=new Image;await new Promise(v=>{E.onload=v,E.onerror=v,E.src="/assets/img/logo.webp"});const T={},N=[...new Set(p.map(v=>v.airlineId))].map(v=>h(v)).filter(v=>v&&v.logoUrl);await Promise.all(N.map(async v=>{const B=await f(v.logoUrl);B&&(T[v.id]=B)}));const W=m.captureStream(30);let O="video/mp4";MediaRecorder.isTypeSupported(O)||(O="video/webm; codecs=h264",MediaRecorder.isTypeSupported(O)||(O="video/webm"));const _=new MediaRecorder(W,{mimeType:O}),X=[];_.ondataavailable=v=>{v.data&&v.data.size>0&&X.push(v.data)},_.start(100);const xt=1e4+p.length*1500,it=performance.now();requestAnimationFrame(Ht),_.onstop=()=>{const v=new Blob(X,{type:O}),B=URL.createObjectURL(v),L=document.createElement("a");L.href=B,L.download=`zamra-video-${t}-${Date.now()}.mp4`,L.style.display="none",document.body.appendChild(L),L.click(),setTimeout(()=>{document.body.removeChild(L),URL.revokeObjectURL(B)},100),window.toast&&window.toast("success","Video Generated",`Your ${t} video has been downloaded!`),r()},_.onerror=v=>{console.error("Recorder Error:",v),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),d(v)}}catch(o){console.error(o),window.toast&&window.toast("error","Generation Failed",o.message),d(o)}})}let z=[],D=[],P=[],Ot=[],Qt=[],te=[],ee=[],ae=[],ne=[],q=[],Z=[],G={},Q=new Set,dt=new Set;function wt(t){return t==null?t:String(t).replace(/damamm/gi,e=>e===e.toUpperCase()?"DAMMAM":e===e.toLowerCase()?"dammam":"Dammam")}function Ce(t={}){return{...t,sectorFrom:wt(t.sectorFrom||""),sectorTo:wt(t.sectorTo||""),sectorCode:wt(t.sectorCode||"")}}function le(t=[]){return t.map(e=>Ce(e))}function I(t=""){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function M(t,e=0){const a=Number(t);return Number.isFinite(a)?a:e}const Da=[5,7,10],kt=[20,25,30,35,40];function Et(t=[],e=0){const a=Math.max(0,gt(e)),s=[...new Set(t.map(n=>Math.max(0,gt(n))))].filter(n=>n>0).sort((n,r)=>n-r);if(!s.length)return"";const i=s.includes(a)?a:s[0];return s.map(n=>`<option value="${n}" ${n===i?"selected":""}>${n} Kg</option>`).join("")}function gt(t){if(t==null||t==="")return 0;const e=parseFloat(String(t).replace(/[^\d.]/g,""));return Number.isFinite(e)?e:0}function ye(t,e="—"){if(t==null||t==="")return e;const a=String(t).trim();return a?/^\d+(\.\d+)?(\s*kg)?$/i.test(a)?`${gt(a)} Kg`:a.toUpperCase():e}function Dt(t){if(!t)return null;if(t instanceof Date)return Number.isNaN(t.getTime())?null:t;const e=new Date(t);return Number.isNaN(e.getTime())?null:e}function Mt(t){const e=Dt(t);if(!e)return"";const a=e.getTimezoneOffset();return new Date(e.getTime()-a*60*1e3).toISOString().split("T")[0]}function Ae(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e}function Ma(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e.getTime()}function Fa(t){if(!t)return null;const e=new Date(`${t}T23:59:59.999`);return Number.isNaN(e.getTime())?null:e.getTime()}let at={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},visas:{key:"countryName",asc:!0},visaStampings:{key:"country",asc:!0},attestations:{key:"country",asc:!0},passportServices:{key:"type",asc:!0},tours:{key:"title",asc:!0},hajjUmrah:{key:"title",asc:!0},reportFares:{key:"flightDate",asc:!0},databaseFares:{key:"flightDate",asc:!0}},zt={agents:"",sectors:"",airlines:"",visas:"",visaStampings:"",attestations:"",passportServices:"",tours:"",hajjUmrah:""},$={agents:1,sectors:1,airlines:1,visas:1,visaStampings:1,attestations:1,passportServices:1,tours:1,hajjUmrah:1,reportFares:1,databaseFares:1},V={agents:10,sectors:25,airlines:10,visas:10,visaStampings:10,attestations:10,passportServices:10,tours:10,hajjUmrah:10,reportFares:10,databaseFares:25};const k={search:"",agentId:"all",sectorId:"all",airlineId:"all",status:"all",startDate:"",endDate:""};function lt(t,e){var r;let a=t;const s=(r=zt[e])==null?void 0:r.toLowerCase();s&&e==="agents"?a=a.filter(d=>(d.name||"").toLowerCase().includes(s)||(d.email||"").toLowerCase().includes(s)||(d.contactPhone||"").toLowerCase().includes(s)||(d.id||"").toLowerCase().includes(s)):s&&e==="sectors"?a=a.filter(d=>(d.sectorFrom||"").toLowerCase().includes(s)||(d.sectorTo||"").toLowerCase().includes(s)||(d.sectorCode||"").toLowerCase().includes(s)):s&&e==="airlines"?a=a.filter(d=>(d.name||"").toLowerCase().includes(s)||(d.code||"").toLowerCase().includes(s)):s&&e==="visas"?a=a.filter(d=>(d.countryName||"").toLowerCase().includes(s)||(d.visaType||"").toLowerCase().includes(s)):s&&e==="visaStampings"?a=a.filter(d=>(d.country||"").toLowerCase().includes(s)||(d.description||"").toLowerCase().includes(s)):s&&e==="attestations"?a=a.filter(d=>(d.country||"").toLowerCase().includes(s)||(d.certificate||"").toLowerCase().includes(s)):s&&e==="passportServices"?a=a.filter(d=>(d.type||"").toLowerCase().includes(s)||(d.description||"").toLowerCase().includes(s)):s&&e==="tours"?a=a.filter(d=>(d.title||"").toLowerCase().includes(s)||(d.category||"").toLowerCase().includes(s)||(d.duration||"").toLowerCase().includes(s)):s&&e==="hajjUmrah"&&(a=a.filter(d=>(d.title||"").toLowerCase().includes(s)||(d.type||"").toLowerCase().includes(s)||(d.departureCity||"").toLowerCase().includes(s)||(d.airline||"").toLowerCase().includes(s)));const{key:i,asc:n}=at[e];return i&&(a=[...a].sort((d,o)=>{let l=d[i],m=o[i];if(l instanceof Date&&(l=l.getTime()),m instanceof Date&&(m=m.getTime()),i==="id"){const c=parseInt(l),y=parseInt(m);if(!isNaN(c)&&!isNaN(y))return n?c-y:y-c}return typeof l=="string"&&(l=l.toLowerCase()),typeof m=="string"&&(m=m.toLowerCase()),l<m?n?-1:1:l>m?n?1:-1:0})),a}function Nt(t){document.querySelectorAll(`th[data-sort-tab="${t}"] i`).forEach(a=>{a.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const e=document.querySelector(`th[data-sort-tab="${t}"][data-sort-key="${at[t].key}"]`);if(e){const a=e.querySelector("i");a&&(a.className=`bi bi-arrow-${at[t].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",t=>{const e=t.target.closest("th[data-sort-tab]");if(!e)return;const a=e.dataset.sortTab,s=e.dataset.sortKey;at[a].key===s?at[a].asc=!at[a].asc:(at[a].key=s,at[a].asc=!0),a==="agents"?ct(!1):a==="sectors"?mt(!1):a==="airlines"?vt(!1):a==="visas"?st(!1):a==="tours"?Wt(!1):a==="hajjUmrah"?Gt(!1):a==="reportFares"&&q.length?Ft(q):a==="databaseFares"&&H()});document.documentElement.style.visibility="hidden";Ge(async t=>{if(!t){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const e=document.getElementById("admin-user-name");e&&(e.textContent=t.email.split("@")[0]),await ja(),He(),await Le()});document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("admin-logout-btn");t&&t.addEventListener("click",async()=>{(await Je()).success&&(window.location.href="/login.html")}),Na(),Ra(),cn()});async function ja(){try{const[t,e,a,s]=await Promise.all([Se(),re(),de(),Be()]);z=t,D=le(e),P=a,Ot=s}catch(t){console.error("loadGlobalData error:",t)}}function Ra(){const t=document.querySelectorAll(".nav-link"),e=document.querySelectorAll(".tab-content"),a=document.getElementById("page-title");t.forEach(s=>{s.addEventListener("click",async i=>{var d;i.preventDefault(),t.forEach(o=>{o.classList.remove("active","text-primary"),o.classList.add("text-text-muted")}),s.classList.remove("text-text-muted"),s.classList.add("active","text-primary");const n=s.getAttribute("data-tab"),r=s.getAttribute("data-title");e.forEach(o=>o.classList.remove("active")),(d=document.getElementById(n))==null||d.classList.add("active"),a&&r&&(a.textContent=r),await Le()})})}async function Le(){const t=document.querySelector(".tab-content.active");if(!t)return;const e=t.id;e==="agents-tab"?await ct():e==="sectors-tab"?await mt():e==="flights-tab"?await vt():e==="dashboard-tab"?await Ha():e==="reports-tab"?await Wa():e==="database-tab"?await me():e==="visas-tab"?await st():e==="tours-tab"?await Wt():e==="hajjumrah-tab"?await Gt():e==="agent-sheets-tab"?(He(),Rt(),pt()):e==="eticket-tab"&&await hn()}function Na(){const t=document.getElementById("admin-modal"),e=document.getElementById("modal-close-btn");e&&e.addEventListener("click",()=>t.close()),t==null||t.addEventListener("click",a=>{a.target===t&&t.close()})}function nt(t,e,a=!1){const s=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=t,s.classList.toggle("max-w-lg",!a),s.classList.toggle("max-w-2xl",a);const i=document.getElementById("modal-body");i.innerHTML=e,s.showModal()}async function Ha(){var s,i,n,r,d;if(!document.getElementById("dashboard-tab"))return;const e=document.getElementById("poster-sector-sel");e&&e.options.length<=2&&D.forEach(o=>{const l=new Option(o.sectorCode,o.id);e.appendChild(l)});const a=document.getElementById("poster-generate-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",async()=>{const o=document.getElementById("poster-start-date"),l=document.getElementById("poster-end-date"),m=e==null?void 0:e.value,c=(o==null?void 0:o.value)||null,y=(l==null?void 0:l.value)||null;if(!m){x("warning","Validation Error","Please select a sector to generate the poster.");return}a.disabled=!0,a.textContent="Generating…";try{const g=await Vt({sectorId:m,startDate:c,endDate:y,includeHidden:!1});if(!g||!g.length){x("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await Pa(g,m)}catch(g){x("error","Generation Failed",g.message)}finally{a.disabled=!1,a.textContent="Generate Poster"}}),(s=document.getElementById("poster-download-jpg"))==null||s.addEventListener("click",()=>ve("jpeg")),(i=document.getElementById("poster-download-pdf"))==null||i.addEventListener("click",()=>ve("pdf")),(n=document.getElementById("poster-download-vid-1x1"))==null||n.addEventListener("click",()=>Zt("1x1")),(r=document.getElementById("poster-download-vid-9x16"))==null||r.addEventListener("click",()=>Zt("9x16")),(d=document.getElementById("poster-download-vid-16x9"))==null||d.addEventListener("click",()=>Zt("16x9")))}async function Zt(t){const e=document.getElementById("poster-sector-sel"),a=document.getElementById("poster-start-date"),s=document.getElementById("poster-end-date"),i=e==null?void 0:e.value,n=(a==null?void 0:a.value)||null,r=(s==null?void 0:s.value)||null;if(!i){x("warning","Validation Error","Please select a sector to generate the poster.");return}try{const d=await Vt({sectorId:i,startDate:n,endDate:r,includeHidden:!1});if(!d||!d.length){x("warning","No Fares","No live fares found for the selected sector and dates.");return}await ka(t,d,i,D,P)}catch(d){console.error("Video generation failed",d)}}async function Pa(t,e){const a=document.getElementById("poster-preview-container"),s=document.getElementById("poster-fares-tbody"),i=document.getElementById("poster-sector-title");if(!a||!s||!i)return;if(e==="all")i.innerHTML='MULTIPLE <span style="color:#60a5fa;font-weight:900;">&#8594;</span> SECTORS';else{const u=D.find(h=>h.id===e),p=u?(u.sectorFrom||"DEP").toUpperCase():"DEP",b=u?(u.sectorTo||"ARR").toUpperCase():"ARR";i.innerHTML=`${p} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${b}`}const n=new Map;t.forEach(u=>{const p=u.flightDate instanceof Date?u.flightDate.getTime():u.flightDate,b=`${u.sectorId}_${u.airlineId}_${p}_${u.flightTime}`;n.has(b)?u.finalRate<n.get(b).finalRate&&n.set(b,u):n.set(b,u)});const d=Array.from(n.values()).sort((u,p)=>{let b=u.flightDate,h=p.flightDate;return b instanceof Date&&(b=b.getTime()),h instanceof Date&&(h=h.getTime()),b-h}),o={};P.forEach(u=>{u.id&&(o[u.id.trim().toLowerCase()]=u),u.code&&(o[u.code.trim().toLowerCase()]=u),u.name&&(o[u.name.trim().toLowerCase()]=u)});const l=u=>u?o[String(u).trim().toLowerCase()]:null;async function m(u){try{const p=await fetch(u);if(!p.ok)return null;const b=await p.blob();return URL.createObjectURL(b)}catch{return null}}const c=[...new Set(d.map(u=>u.airlineId))].map(u=>l(u)).filter(u=>u&&u.logoUrl),y={};await Promise.all(c.map(async u=>{const p=await m(u.logoUrl);p&&(y[u.id]=p)}));const g={};D.forEach(u=>g[u.id]=u.sectorCode),s.innerHTML=d.map((u,p)=>{const b=u.flightDate instanceof Date?u.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():u.flightDate,h=l(u.airlineId),A=p%2===0?"#ffffff":"#f8fafc",f=h?y[h.id]:null,w=f?`<img src="${f}" style="height:24px;max-width:80px;object-fit:contain;display:block;margin:0 auto;" alt="${(h==null?void 0:h.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:13px;white-space:nowrap;">${(h==null?void 0:h.name)||u.airlineId||"—"}</span>`,E=`<span style="font-weight:700;color:#2563eb;background-color:rgba(37,99,235,0.1);padding:4px 8px;border-radius:6px;font-size:12px;text-align:center;white-space:nowrap;">${g[u.sectorId]||u.sectorId}</span>`;let T='<span style="color:#94a3b8;font-size:13px;">—</span>';if(u.flightTime){const N=u.flightTime.split("-").map(W=>W.trim());N.length>=2?T=`<span style="font-weight:700;font-size:13px;color:#0f172a;white-space:nowrap;">${N[0]} - ${N[1]}</span>`:T=`<span style="font-weight:700;font-size:13px;color:#0f172a;white-space:nowrap;">${u.flightTime}</span>`}return`
      <tr style="background-color:${A};border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 8px;font-weight:700;color:#0f172a;font-size:13px;white-space:nowrap;">${b}</td>
        <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${E}</td>
        <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${w}</td>
        <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${T}</td>
        <td style="padding:10px 8px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;color:#0f172a;font-weight:900;font-size:15px;">
            &#8377;${(u.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),a.classList.remove("hidden"),a.classList.add("flex")}function Te(t){if(!t||t.nodeType!==1)return;const e=window.getComputedStyle(t),a=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const s of a){const i=e.getPropertyValue(s);if(i&&!i.startsWith("rgb")&&!i.startsWith("#")&&i!=="transparent"&&i!=="initial")try{t.style[s]=i}catch{}}for(const s of t.children)Te(s)}async function ve(t){const e=document.getElementById("poster-render-frame");if(!e)return;const a=document.getElementById("poster-download-jpg"),s=document.getElementById("poster-download-pdf");a&&(a.disabled=!0),s&&(s.disabled=!0);const i=e.style.transform;e.style.transform="none",x("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(e.querySelectorAll("img")).map(d=>d.complete?Promise.resolve():new Promise(o=>{d.onload=o,d.onerror=o})));const n=await html2canvas(e,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:d=>{const o=d.getElementById("poster-render-frame");o&&Te(o)}});e.style.transform=i;const r=n.toDataURL("image/jpeg",.95);if(t==="jpeg"){const d=document.createElement("a");d.download=`zamra-poster-${Date.now()}.jpg`,d.href=r,d.click(),x("success","Downloaded!","JPEG poster saved successfully.")}else if(t==="pdf"){const d=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!d)throw new Error("jsPDF library not loaded.");const o=96/25.4,l=n.width/2/o,m=n.height/2/o,c=new d({orientation:l>m?"landscape":"portrait",unit:"mm",format:[l,m]});c.addImage(r,"JPEG",0,0,l,m),c.save(`zamra-poster-${Date.now()}.pdf`),x("success","Downloaded!","PDF poster saved successfully.")}}catch(n){console.error("Poster export error:",n),e.style.transform=i,x("error","Export Failed",n.message||"There was an error generating the export.")}finally{a&&(a.disabled=!1),s&&(s.disabled=!1)}}function Ft(t){const e=document.getElementById("report-fares-results");if(!e)return;if(!t||!t.length){e.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-inbox"></i>
        </div>
        <p class="admin-empty-state-title">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const a=Object.fromEntries(z.map(g=>[g.id,g.name])),s=Object.fromEntries(D.map(g=>[g.id,g.sectorCode])),i=Object.fromEntries(P.map(g=>[g.id,g.code])),{key:n,asc:r}=at.reportFares,d=[...t].sort((g,u)=>{let p=g[n],b=u[n];return p instanceof Date&&(p=p.getTime()),b instanceof Date&&(b=b.getTime()),typeof p=="string"&&(p=p.toLowerCase()),typeof b=="string"&&(b=b.toLowerCase()),p<b?r?-1:1:p>b?r?1:-1:0}),o=V.reportFares,l=Math.max(1,Math.ceil(t.length/o));$.reportFares>l&&($.reportFares=l);const m=($.reportFares-1)*o,c=d.slice(m,m+o),y=(g,u)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${g}">${u} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;e.innerHTML=`
    <div class="admin-table-container overflow-x-auto w-full rounded-none border-0 shadow-none">
      <table class="admin-table w-full text-sm">
        <thead><tr>
          ${y("flightDate","Date")}
          ${y("flightTime","Time")}
          ${y("sectorId","Sector")}
          ${y("airlineId","Airline")}
          ${y("agentId","Agent")}
          ${y("specialRate","SP Rate (₹)")}
          ${y("finalRate","Rate (₹)")}
          ${y("commission","Comm (₹)")}
          ${y("baggage","Bag")}
          ${y("extraBaggage","Ex.Bag")}
          ${y("isHidden","Status")}
          <th class="whitespace-nowrap">Actions</th>
        </tr></thead>
        <tbody>
          ${c.map((g,u)=>{const p=g.flightDate instanceof Date?g.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):g.flightDate||"—";return`<tr class="${u%2===1?"bg-slate-50/60":""} hover:bg-slate-100/80 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${p}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${g.flightTime||"—"}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${s[g.sectorId]||g.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${i[g.airlineId]||g.airlineId}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${a[g.agentId]||g.agentId}</td>
              <td class="whitespace-nowrap text-[13px] text-text-muted">₹${(g.specialRate||0).toLocaleString()}</td>
              <td class="whitespace-nowrap font-black text-navy text-[14px]">₹${(g.finalRate||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px] text-text-muted" id="comm-${g.id}">₹${(g.commission||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px]">${g.baggage?g.baggage+" kg":"—"}</td>
              <td class="whitespace-nowrap text-[12px]">${g.extraBaggage?g.extraBaggage+" kg":"—"}</td>
              <td class="whitespace-nowrap">
                <span class="admin-status-pill ${g.isHidden?"admin-status-hidden":"admin-status-live"}">
                  ${g.isHidden?"● Hidden":"● Live"}
                </span>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  <button onclick="window.__toggleFare('${g.id}', ${!g.isHidden})"
                    class="admin-action-btn ${g.isHidden?"admin-action-show":"admin-action-toggle"}">
                    <i class="bi ${g.isHidden?"bi-eye":"bi-eye-slash"}"></i>${g.isHidden?"Show":"Hide"}
                  </button>
                  <button onclick="window.__deleteFare('${g.id}')"
                    class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Del</button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,$t("reportFares",t.length,l,m,o),window.__deleteFare=async g=>{if(confirm("Delete this fare?"))try{await oe(g),q=q.filter(u=>u.id!==g),x("success","Deleted","Fare removed."),Ft(q)}catch(u){x("error","Error",u.message)}},window.__toggleFare=async(g,u)=>{try{await Ie(g,{isHidden:u}),q=q.map(p=>p.id===g?{...p,isHidden:u}:p),x("success","Updated",`Fare ${u?"hidden":"shown"}.`),Ft(q)}catch(p){x("error","Error",p.message)}},Nt("reportFares")}async function ct(t=!0){t&&(z=await Se(),$.agents=1);const e=document.querySelector("#agents-tab .admin-table tbody");if(!e)return;const a=document.getElementById("agents-search"),s=document.getElementById("agents-limit");a&&!a.dataset.wired&&(a.dataset.wired="1",s&&(s.dataset.wired="1"),a.addEventListener("input",m=>{zt.agents=m.target.value,$.agents=1,ct(!1)}),s&&s.addEventListener("change",m=>{V.agents=parseInt(m.target.value),$.agents=1,ct(!1)}));const i=lt(z,"agents"),n=V.agents,r=Math.max(1,Math.ceil(i.length/n));$.agents>r&&($.agents=r);const d=($.agents-1)*n,o=i.slice(d,d+n);e.innerHTML=o.length?o.map(m=>Ua(m)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',$t("agents",i.length,r,d,n),delete e.dataset.actionsWired,qa();const l=document.getElementById("agents-add-btn");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>ke(null))),Nt("agents")}function Ua(t){const e=t.isActive!==!1?'<span class="admin-status-pill admin-status-active">Active</span>':'<span class="admin-status-pill admin-status-inactive">Hidden</span>',a=t.commission!==void 0?`₹${Number(t.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${t.id}">
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
  </tr>`}function qa(){const t=document.querySelector("#agents-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const s=a.dataset.action,i=a.dataset.id,n=z.find(r=>r.id===i);if(s==="edit-agent"&&ke(n),s==="delete-agent"){if(!confirm(`Delete agent "${n==null?void 0:n.name}"? This does NOT delete their fares.`))return;try{await Ye(i),x("success","Deleted",`Agent "${n==null?void 0:n.name}" removed.`),await ct()}catch(r){x("error","Error",r.message)}}if(s==="toggle-agent"){const d=!(a.dataset.active==="true");a.disabled=!0,a.textContent="Working…";try{const o=await Xe(i,d);x("success",d?"Agent Shown":"Agent Hidden",o.message),await ct()}catch(o){x("error","Toggle Failed",o.message),await ct()}}}))}function $t(t,e,a,s,i){const n=document.getElementById(`${t}-pagination-footer`);if(!n)return;const r=Math.min(s+i,e),d=$[t];n.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${e?s+1:0} to ${r} of ${e} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${d<=1?"disabled":""}>Previous</button>
        ${Array.from({length:a},(o,l)=>l+1).map(o=>`<button data-pg-action="goto" data-pg="${o}" class="admin-pagination-btn ${o===d?"admin-pagination-btn-active":""}">${o}</button>`).join("")}
        <button data-pg-action="next" class="admin-pagination-btn" ${d>=a?"disabled":""}>Next</button>
      </div>
    </div>`,n.dataset.wired||(n.dataset.wired="1",n.addEventListener("click",o=>{const l=o.target.closest("[data-pg-action]");if(!l||l.disabled)return;const m=l.dataset.pgAction;m==="prev"?$[t]=Math.max(1,$[t]-1):m==="next"?$[t]++:m==="goto"&&($[t]=parseInt(l.dataset.pg)),t==="agents"?ct(!1):t==="sectors"?mt(!1):t==="airlines"?vt(!1):t==="reportFares"?Ft(q):t==="databaseFares"&&H()}))}function ke(t){var a,s;const e=!!t;nt(e?"Edit Agent":"Add New Agent",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("agent-form"))==null||s.addEventListener("submit",async i=>{i.preventDefault();const n=new FormData(i.target),r=Object.fromEntries(n.entries()),d=i.target.querySelector("[type=submit]");d.disabled=!0,d.textContent="Saving…";try{e?(await Ke(t.id,r),x("success","Updated",`Agent "${r.name}" updated.`)):(await Ze(r),x("success","Added",`Agent "${r.name}" added.`)),document.getElementById("admin-modal").close(),await ct()}catch(o){x("error","Save Failed",o.message),d.disabled=!1,d.textContent=e?"Save Changes":"Add Agent"}})}async function mt(t=!0){t&&(D=le(await re()),$.sectors=1);const e=document.getElementById("sectors-search"),a=document.getElementById("sectors-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{zt.sectors=m.target.value,$.sectors=1,mt(!1)}),a.addEventListener("change",m=>{V.sectors=parseInt(m.target.value),$.sectors=1,mt(!1)}));const s=document.querySelector("#sectors-tab .admin-table tbody");if(!s)return;const i=lt(D,"sectors"),n=V.sectors,r=Math.max(1,Math.ceil(i.length/n));$.sectors>r&&($.sectors=r);const d=($.sectors-1)*n,o=i.slice(d,d+n);s.innerHTML=o.length?o.map(m=>Oa(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',$t("sectors",i.length,r,d,n),_a();const l=document.querySelector("#sectors-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>De(null))),Nt("sectors")}function Oa(t){const e=Ce(t);return`<tr data-sector-id="${t.id}">
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
  </tr>`}function _a(){const t=document.querySelector("#sectors-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=D.find(r=>r.id===i);if(s==="edit-sector"&&De(n),s==="delete-sector"){if(!confirm(`Delete sector "${n==null?void 0:n.sectorCode}"?`))return;try{await Qe(i),x("success","Deleted",`Sector "${n==null?void 0:n.sectorCode}" removed.`),await mt()}catch(r){x("error","Error",r.message)}}if(s==="toggle-sector"){const d=!(a.dataset.hidden==="true");a.disabled=!0,a.textContent="Working…";try{const o=await ta(i,d);x("success",`Sector Fares ${d?"Hidden":"Shown"}`,o.message),await mt()}catch(o){x("error","Toggle Failed",o.message),await mt()}}}))}function De(t){var a,s;const e=!!t;nt(e?"Edit Sector":"Add New Sector",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("sector-form"))==null||s.addEventListener("submit",async i=>{i.preventDefault();const n=new FormData(i.target),r=Object.fromEntries(n.entries());r.sectorCode=wt(r.sectorCode.toUpperCase()),r.sectorFrom=wt(r.sectorFrom.toUpperCase()),r.sectorTo=wt(r.sectorTo.toUpperCase());const d=i.target.querySelector("[type=submit]");d.disabled=!0,d.textContent="Saving…";try{e?(await ea(t.id,r),x("success","Updated","Sector updated.")):(await aa(r),x("success","Added",`Sector "${r.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await mt()}catch(o){x("error","Save Failed",o.message),d.disabled=!1,d.textContent=e?"Save Changes":"Add Sector"}})}async function vt(t=!0){t&&(P=await de(),$.airlines=1);const e=document.getElementById("airlines-search"),a=document.getElementById("airlines-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{zt.airlines=m.target.value,$.airlines=1,vt(!1)}),a.addEventListener("change",m=>{V.airlines=parseInt(m.target.value),$.airlines=1,vt(!1)}));const s=document.querySelector("#flights-tab .admin-table tbody");if(!s)return;const i=lt(P,"airlines"),n=V.airlines,r=Math.max(1,Math.ceil(i.length/n));$.airlines>r&&($.airlines=r);const d=($.airlines-1)*n,o=i.slice(d,d+n);s.innerHTML=o.length?o.map(m=>Va(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "Add Airline".</td></tr>',$t("airlines",i.length,r,d,n),za();const l=document.querySelector("#flights-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>Me(null))),Nt("airlines")}function Va(t){const e=t.logoUrl?`<span class="admin-logo-wrap"><img src="${t.logoUrl}" alt="${I(t.name||"Airline")}"></span>`:`<span class="admin-logo-wrap"><span class="admin-logo-fallback">${I((t.code||"NA").slice(0,3))}</span></span>`;return`<tr data-airline-id="${t.id}">
    <td>${e}</td>
    <td class="font-semibold">${t.name}</td>
    <td><span class="font-mono font-bold text-primary">${t.code}</span></td>
    <td>
      <div class="flex gap-1 items-center">
        <button data-action="edit-airline" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-airline" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function za(){const t=document.querySelector("#flights-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=P.find(r=>r.id===i);if(s==="edit-airline"&&Me(n),s==="delete-airline"){if(!confirm(`Delete airline "${n==null?void 0:n.name}" (${n==null?void 0:n.code})?`))return;try{await na(i),x("success","Deleted",`Airline "${n==null?void 0:n.name}" removed.`),await vt()}catch(r){x("error","Error",r.message)}}}))}function Me(t){var a,s;const e=!!t;nt(e?"Edit Airline":"Add New Airline",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("airline-form"))==null||s.addEventListener("submit",async i=>{var l;i.preventDefault();const n=new FormData(i.target),r=((l=n.get("logoFile"))==null?void 0:l.size)>0?n.get("logoFile"):null,d={name:n.get("name"),code:n.get("code").toUpperCase()},o=i.target.querySelector("[type=submit]");o.disabled=!0,o.textContent="Saving…";try{e?(await sa(t.id,d,r),x("success","Updated","Airline updated.")):(await ia(d,r),x("success","Added",`Airline "${d.name}" added.`)),document.getElementById("admin-modal").close(),await vt()}catch(m){x("error","Save Failed",m.message),o.disabled=!1,o.textContent=e?"Save Changes":"Add Airline"}})}async function Wa(){const t=document.getElementById("reports-tab");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=document.getElementById("reports-sector-sel");e&&e.options.length<=1&&D.forEach(r=>e.appendChild(new Option(r.sectorCode,r.id)));const a=document.getElementById("reports-agent-sel");a&&a.options.length<=1&&z.forEach(r=>a.appendChild(new Option(r.name,r.id)));const s=document.getElementById("generate-report-btn"),i=document.getElementById("reports-start-date"),n=document.getElementById("reports-end-date");s&&!s.dataset.wired&&(s.dataset.wired="1",s.addEventListener("click",async()=>{const r=(e==null?void 0:e.value)||"all",d=(a==null?void 0:a.value)||"all",o=(i==null?void 0:i.value)||null,l=(n==null?void 0:n.value)||null;s.disabled=!0,s.textContent="Generating…";try{const[m,c]=await Promise.all([oa(o,l,r,d),Vt({sectorId:r,agentId:d,startDate:o,endDate:l,includeHidden:!0})]);q=c,Ga(m,t),$.reportFares=1,Ft(q)}catch(m){x("error","Report Failed",m.message)}finally{s.disabled=!1,s.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Ga(t,e){const{agentReport:a,sectorReport:s,totalFares:i}=t,n=document.getElementById("report-stats-row");if(n){n.classList.remove("hidden");const y=(q||[]).filter(f=>!f.isHidden).length,g=(q||[]).filter(f=>f.isHidden).length,u=new Set((q||[]).map(f=>f.agentId)).size,p=(q||[]).map(f=>f.finalRate||0).filter(f=>f>0),b=p.length?Math.round(p.reduce((f,w)=>f+w,0)/p.length):0,h=(f,w)=>{const E=document.getElementById(f);E&&(E.textContent=w.toLocaleString())};h("stat-total-fares",i),h("stat-live-fares",y),h("stat-hidden-fares",g),h("stat-agents-count",u);const A=document.getElementById("stat-avg-fare");A&&(A.textContent=b>0?`₹${b.toLocaleString()}`:"—")}const r=document.getElementById("report-total-fares");r&&(r.textContent=`${i} fare${i!==1?"s":""} matched your filter`);const d=document.getElementById("bar-chart-container");d&&a.length&&Ja(a.slice(0,8),d);const o=document.getElementById("donut-chart-svg"),l=document.getElementById("pie-legend");o&&s.length&&Ya(s.slice(0,8),o,l);const m=document.getElementById("report-leaderboards");m&&(m.classList.remove("hidden"),Xa(a,s));const c=document.getElementById("download-report-csv");if(c){const y=c.cloneNode(!0);c.parentNode.replaceChild(y,c),y.addEventListener("click",()=>Ka(q)),q&&q.length?y.classList.remove("opacity-50","pointer-events-none"):y.classList.add("opacity-50","pointer-events-none")}x("success","Report Ready",`${i} fare${i!==1?"s":""} aggregated.`)}function Ja(t,e){const a=e.clientWidth||480,s=260,i={top:32,right:16,bottom:48,left:48},n=a-i.left-i.right,r=s-i.top-i.bottom,d=Math.max(...t.map(f=>f.count),1),o=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],l=4,m=Math.ceil(d/l),c=Array.from({length:l+1},(f,w)=>w*m),y=c.map(f=>{const w=i.top+r-f/(c[c.length-1]||1)*r;return`<line x1="${i.left}" y1="${w.toFixed(1)}" x2="${a-i.right}" y2="${w.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${i.left-6}" y="${(w+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${f}</text>`}).join(""),g=Math.min(48,n/t.length*.6),u=n/t.length,p=t.map((f,w)=>{const E=Math.max(4,f.count/(c[c.length-1]||1)*r),T=i.left+w*u+u/2-g/2,N=i.top+r-E,[W,O]=o[w%o.length],_=`bg${w}`,X=f.avgRate?`avg ₹${Math.round(f.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${_}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${W}"/>
              <stop offset="100%" stop-color="${O}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${f.name}" data-count="${f.count}" data-avg="${X}" style="cursor:pointer;">
              <rect x="${T.toFixed(1)}" y="${N.toFixed(1)}" width="${g}" height="${E.toFixed(1)}"
                rx="6" fill="url(#${_})" opacity="0.92"
                style="transform-origin:${(T+g/2).toFixed(1)}px ${(i.top+r).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${w*.07}s both;"/>
              <text x="${(T+g/2).toFixed(1)}" y="${(N-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${O}">${f.count}</text>
              <text x="${(T+g/2).toFixed(1)}" y="${(i.top+r+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(f.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),b="bar-tooltip";e.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${b}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${s}" viewBox="0 0 ${a} ${s}" style="overflow:visible;">
      ${y}
      <line x1="${i.left}" y1="${i.top}" x2="${i.left}" y2="${i.top+r}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${i.left}" y1="${i.top+r}" x2="${a-i.right}" y2="${i.top+r}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${p}
    </svg>`;const h=e.querySelector("#bar-svg"),A=e.querySelector(`#${b}`);h&&A&&h.querySelectorAll(".bar-group").forEach(f=>{f.addEventListener("mousemove",w=>{const E=e.getBoundingClientRect();A.style.display="block",A.style.left=w.clientX-E.left+12+"px",A.style.top=w.clientY-E.top-40+"px";const T=f.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${f.dataset.avg}</span>`:"";A.innerHTML=`${f.dataset.name}<br><span style="color:#60a5fa;">${f.dataset.count} fares</span>${T}`}),f.addEventListener("mouseleave",()=>{A.style.display="none"})})}function Ya(t,e,a){const s=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],o=t.reduce((f,w)=>f+w.count,0),l=e.getElementById?e.getElementById("donut-segments"):e.querySelector("#donut-segments"),m=e.querySelector("#donut-center-count"),c=e.querySelector("#donut-center-label");if(!l)return;m&&(m.textContent=o),c&&(c.textContent="FARES");const y=(f,w,E,T)=>({x:f+E*Math.cos((T-90)*Math.PI/180),y:w+E*Math.sin((T-90)*Math.PI/180)});let g=0;const u=t.map((f,w)=>{const E=o>0?f.count/o*360:0,T=g+E,N=E>180?1:0,W=y(110,110,95,g),O=y(110,110,95,T),_=y(110,110,60,g),X=y(110,110,60,T),xt=[`M ${W.x.toFixed(2)} ${W.y.toFixed(2)}`,`A 95 95 0 ${N} 1 ${O.x.toFixed(2)} ${O.y.toFixed(2)}`,`L ${X.x.toFixed(2)} ${X.y.toFixed(2)}`,`A 60 60 0 ${N} 0 ${_.x.toFixed(2)} ${_.y.toFixed(2)}`,"Z"].join(" "),it=g+E/2;g=T;const ft=o>0?(f.count/o*100).toFixed(1):"0.0";return{pathD:xt,color:s[w%s.length],name:f.name,count:f.count,pct:ft,mid:it}}),p="http://www.w3.org/2000/svg";l.innerHTML="";const b=u.map((f,w)=>{const E=document.createElementNS(p,"path");return E.setAttribute("d",f.pathD),E.setAttribute("fill",f.color),E.setAttribute("stroke","white"),E.setAttribute("stroke-width","2"),E.style.cursor="pointer",E.style.transition="transform 0.2s, filter 0.2s",E.style.transformOrigin="110px 110px",E.setAttribute("data-index",w),l.appendChild(E),E}),h=f=>{b.forEach((w,E)=>{E===f?(w.style.transform="scale(1.04)",w.style.filter="brightness(1.1)",w.setAttribute("stroke-width","3")):(w.style.transform="scale(1)",w.style.filter="brightness(1)",w.setAttribute("stroke-width","2"))}),f>=0&&f<u.length?(m&&(m.textContent=u[f].count),c&&(c.textContent=u[f].name.split(" ")[0].toUpperCase().slice(0,7))):(m&&(m.textContent=o),c&&(c.textContent="FARES"))};if(b.forEach((f,w)=>{f.addEventListener("mouseover",()=>{h(w),A(w)}),f.addEventListener("mouseout",()=>{h(-1),A(-1)})}),a){a.innerHTML=u.map((w,E)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${E}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${w.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${w.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${w.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${w.pct}%</span>
      </div>`).join("");const f=w=>{a.querySelectorAll(".legend-row").forEach((E,T)=>{E.style.background=T===w?"#f1f5f9":""})};window._highlightLegendRows=f,a.querySelectorAll(".legend-row").forEach((w,E)=>{w.addEventListener("mouseover",()=>{h(E),f(E)}),w.addEventListener("mouseout",()=>{h(-1),f(-1)})})}function A(f){window._highlightLegendRows&&window._highlightLegendRows(f)}}function Xa(t,e){var n,r;const a=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],s=document.getElementById("leaderboard-agents");if(s&&t.length){const d=[...t].sort((l,m)=>m.count-l.count).slice(0,5),o=d[0].count||1;s.innerHTML=d.map((l,m)=>{const c=Math.max(6,Math.round(l.count/o*100));return`<div style="display:flex;align-items:center;gap:10px;">
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
      </div>`}).join("")}const i=document.getElementById("leaderboard-sectors");if(i&&e.length){const o=[...e.filter(c=>c.avgRate>0)].sort((c,y)=>c.avgRate-y.avgRate).slice(0,5),l=((n=o[0])==null?void 0:n.avgRate)||1,m=((r=o[o.length-1])==null?void 0:r.avgRate)||1;i.innerHTML=o.map((c,y)=>{const g=m>l?Math.max(6,Math.round((c.avgRate-l)/(m-l)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${y+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${c.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(c.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${g}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function Ka(t){if(!t||!t.length){x("warning","No Data","No fares to export. Apply filters and fetch first.");return}const e=Object.fromEntries(z.map(c=>[c.id,c.name])),a=Object.fromEntries(D.map(c=>[c.id,c.sectorCode])),s=Object.fromEntries(P.map(c=>[c.id,c.code||c.name])),i=c=>`"${String(c??"").replace(/"/g,'""')}"`,n=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],r=t.map(c=>{const y=c.flightDate instanceof Date?c.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):c.flightDate||"";return[i(y),i(c.flightTime||""),i(a[c.sectorId]||c.sectorId),i(s[c.airlineId]||c.airlineId),i(e[c.agentId]||c.agentId),i(c.specialRate||0),i(c.finalRate||0),i(c.commission||0),i(c.baggage||""),i(c.extraBaggage||""),i(c.isHidden?"Hidden":"Live")].join(",")}),d=[n.map(i).join(","),...r].join(`
`),o=new Blob(["\uFEFF"+d],{type:"text/csv;charset=utf-8;"}),l=URL.createObjectURL(o),m=document.createElement("a");m.href=l,m.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(m),m.click(),document.body.removeChild(m),URL.revokeObjectURL(l),x("success","CSV Downloaded",`${t.length} fares exported.`)}function Fe(){return Object.keys(G).length}function je(){return{agentNameById:Object.fromEntries(z.map(t=>[t.id,t.name||t.id])),sectorCodeById:Object.fromEntries(D.map(t=>[t.id,t.sectorCode||`${t.sectorFrom||""} ${t.sectorTo||""}`.trim()||t.id])),airlineLabelById:Object.fromEntries(P.map(t=>[t.id,t.code?`${t.code} - ${t.name||""}`.trim():t.name||t.id]))}}function Re(t,e=0){if(!t)return e;const a=z.find(i=>i.id===t),s=Number(a==null?void 0:a.commission);return Number.isFinite(s)?Math.max(0,s):e}function Za(t,e){return t==="specialRate"||t==="finalRate"||t==="commission"||t==="extraBaggage"?e===""?"":M(e,0):t==="baggage"?e===""?"":gt(e):t==="isHidden"?e===!0||e==="hidden"||e==="true":t==="flightTime"?String(e||"").trim():t==="flightDate"?e||"":String(e||"")}function Qa(t,e){return t==="specialRate"||t==="finalRate"||t==="extraBaggage"?M(e,0):t==="commission"?e==null||e===""?"":Math.max(0,M(e,0)):t==="baggage"?gt(e):t==="isHidden"?e===!0:t==="flightTime"?String(e||"").trim():t==="flightDate"?Mt(e):String(e||"")}function se(t){return t?t.commission!==void 0&&t.commission!==null&&t.commission!==""?Math.max(0,M(t.commission,0)):Math.max(0,M(t.finalRate,0)-M(t.specialRate,0)):0}function jt(t,e){return Math.max(0,M(t,0)+Math.max(0,M(e,0)))}function ce(t){const e=G[t.id]||{},a={...t,...e},s=se(t);return a.flightDate=e.flightDate!==void 0?Ae(e.flightDate):Dt(t.flightDate),a.specialRate=M(a.specialRate,0),a.commission=e.commission!==void 0?Math.max(0,M(e.commission,0)):s,a.finalRate=jt(a.specialRate,a.commission),a.baggage=gt(a.baggage),a.extraBaggage=M(a.extraBaggage,0),a.isHidden=a.isHidden===!0||a.isHidden==="hidden"||a.isHidden==="true",a.flightTime=String(a.flightTime||"").trim(),a.agentId=a.agentId||"",a.sectorId=a.sectorId||"",a.airlineId=a.airlineId||"",a}function Ct(){const t=Fe(),e=Q.size,a=document.getElementById("database-unsaved-pill");a&&(a.textContent=`Unsaved: ${t}`);const s=document.getElementById("database-save-all-btn");s&&(s.disabled=t===0);const i=document.getElementById("database-delete-selected-btn");i&&(i.disabled=e===0);const n=document.getElementById("database-selected-count");n&&(n.textContent=String(e))}function tn(){const t=document.getElementById("database-agent-filter"),e=document.getElementById("database-sector-filter"),a=document.getElementById("database-airline-filter");if(t){const s=k.agentId;t.innerHTML='<option value="all">All Agents</option>'+z.map(i=>`<option value="${I(i.id)}">${I(i.id)} · ${I(i.name||"Unnamed")}</option>`).join(""),t.value=s}if(e){const s=k.sectorId;e.innerHTML='<option value="all">All Sectors</option>'+D.map(i=>`<option value="${I(i.id)}">${I(i.sectorCode||i.id)}</option>`).join(""),e.value=s}if(a){const s=k.airlineId;a.innerHTML='<option value="all">All Airlines</option>'+P.map(i=>`<option value="${I(i.id)}">${I(i.code||"—")} · ${I(i.name||"Unnamed")}</option>`).join(""),a.value=s}}function en(){const t=document.getElementById("database-table-wrap");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=i=>{const n=t.querySelector(`tr[data-fare-id="${i}"]`);if(!n)return;const r=!!G[i];n.classList.toggle("admin-database-row-dirty",r);const d=n.querySelector('[data-db-action="save"]'),o=n.querySelector('[data-db-action="reset"]');d&&(d.disabled=!r),o&&(o.disabled=!r)},a=i=>{if(!i)return;const n=i.querySelector('[data-db-field="specialRate"]'),r=i.querySelector('[data-db-field="commission"]'),d=i.querySelector('[data-db-field="finalRate"]');if(!n||!r||!d)return;const o=M(n.value,0),l=Math.max(0,M(r.value,0));d.value=String(jt(o,l))},s=i=>{const n=i.target.closest("[data-db-field]");if(!n)return;const r=n.closest("tr[data-fare-id]");if(!r)return;const d=r.dataset.fareId,o=n.dataset.dbField,l=Z.find(p=>p.id===d);if(!l||!o)return;const m=n.value,c=Za(o,m),y=o==="commission"?se(l):Qa(o,l[o]),g=c!==y,u={...G[d]||{}};if(g?u[o]=c:delete u[o],o==="agentId"){const p=r.querySelector('[data-db-field="commission"]'),b=Re(c,0);p&&(p.value=String(b));const h=se(l);b!==h?u.commission=b:delete u.commission,a(r)}Object.keys(u).length?G[d]=u:delete G[d],(o==="specialRate"||o==="commission")&&a(r),e(d),Ct()};t.addEventListener("input",s),t.addEventListener("change",i=>{s(i);const n=i.target.closest("#database-select-all");if(n){t.querySelectorAll("input[data-db-select]").forEach(d=>{d.checked=n.checked;const o=d.dataset.dbSelect;o&&(n.checked?Q.add(o):Q.delete(o))}),Ct();return}const r=i.target.closest("input[data-db-select]");if(r){const d=r.dataset.dbSelect;if(!d)return;r.checked?Q.add(d):Q.delete(d),Ct()}}),t.addEventListener("click",async i=>{const n=i.target.closest("[data-db-action]");if(!n)return;const r=n.dataset.dbAction,d=n.dataset.id;if(d){if(r==="edit"){dt.add(d),H();return}if(r==="cancel_edit"){dt.delete(d),H();return}if(r==="save"){n.disabled=!0,await Ne(d)?dt.delete(d):n.disabled=!1,H();return}if(r==="share"){const o=Z.find(E=>E.id===d)||G[d]||{},l=ce(o)||o,m=D.find(E=>E.id===l.sectorId)||{},y=(P.find(E=>E.id===l.airlineId)||{}).name||l.airlineId||"Unknown Airline",g=m.sectorFrom||"TBA",u=m.sectorTo||"TBA",p={day:"2-digit",month:"short",year:"numeric"};let b="TBA";if(l.flightDate){const E=l.flightDate instanceof Date?l.flightDate:new Date(l.flightDate);isNaN(E)||(b=E.toLocaleDateString("en-GB",p).replace(/,/g,""))}const h=l.flightTime&&l.flightTime.split("-")[0]?l.flightTime.split("-")[0].trim():"TBA",A=l.flightTime&&l.flightTime.includes("-")?l.flightTime.split("-")[1].trim():"TBA",f="₹"+(Number(l.finalRate)||0).toLocaleString("en-IN"),w=`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${y.toUpperCase()}*
🛫 From: *${g}*
🛬 To: *${u}*
📅 Date: *${b}*
⏰ Dep: ${h} | Arr: ${A}
💵 Price: *${f}*

Please confirm availability!`;try{await navigator.clipboard.writeText(w),x("success","Copied!","Flight details copied to clipboard.")}catch(E){x("error","Copy failed",E.message)}return}if(r==="reset"){delete G[d],dt.delete(d),H();return}if(r==="delete"){if(!confirm("Delete this fare row? This cannot be undone."))return;n.disabled=!0;try{await oe(d),Z=Z.filter(o=>o.id!==d),delete G[d],Q.delete(d),dt.delete(d),x("success","Deleted","Fare row removed."),H()}catch(o){x("error","Delete Failed",o.message),n.disabled=!1}}}})}function an(t){if(!t||t.dataset.controlsWired)return;t.dataset.controlsWired="1";const e=document.getElementById("database-search"),a=document.getElementById("database-agent-filter"),s=document.getElementById("database-sector-filter"),i=document.getElementById("database-airline-filter"),n=document.getElementById("database-status-filter"),r=document.getElementById("database-start-date"),d=document.getElementById("database-end-date"),o=document.getElementById("database-limit"),l=document.getElementById("database-clear-filters"),m=document.getElementById("database-refresh-btn"),c=document.getElementById("database-save-all-btn"),y=document.getElementById("database-delete-selected-btn"),g=document.getElementById("database-add-row-btn");e&&e.addEventListener("input",u=>{k.search=u.target.value||"",$.databaseFares=1,H()}),a&&a.addEventListener("change",u=>{k.agentId=u.target.value||"all",$.databaseFares=1,H()}),s&&s.addEventListener("change",u=>{k.sectorId=u.target.value||"all",$.databaseFares=1,H()}),i&&i.addEventListener("change",u=>{k.airlineId=u.target.value||"all",$.databaseFares=1,H()}),n&&n.addEventListener("change",u=>{k.status=u.target.value||"all",$.databaseFares=1,H()}),r&&r.addEventListener("change",u=>{k.startDate=u.target.value||"",$.databaseFares=1,H()}),d&&d.addEventListener("change",u=>{k.endDate=u.target.value||"",$.databaseFares=1,H()}),o&&(o.value=String(V.databaseFares),o.addEventListener("change",u=>{V.databaseFares=parseInt(u.target.value,10)||20,$.databaseFares=1,H()})),l&&l.addEventListener("click",()=>{k.search="",k.agentId="all",k.sectorId="all",k.airlineId="all",k.status="all",k.startDate="",k.endDate="",e&&(e.value=""),a&&(a.value="all"),s&&(s.value="all"),i&&(i.value="all"),n&&(n.value="all"),r&&(r.value=""),d&&(d.value=""),$.databaseFares=1,H()}),m&&m.addEventListener("click",async()=>{const u=m.innerHTML;m.disabled=!0,m.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing...',await me(!0),m.disabled=!1,m.innerHTML=u}),c&&c.addEventListener("click",sn),y&&y.addEventListener("click",on),g&&g.addEventListener("click",rn)}async function me(t=!0){const e=document.getElementById("database-tab");if(!e)return;if(an(e),en(),tn(),t||!e.dataset.loaded)try{Z=await Vt({includeHidden:!0}),G={},Q=new Set,dt=new Set,$.databaseFares=1,e.dataset.loaded="1"}catch(s){x("error","Load Failed",s.message),Z=[]}H()}function nn(){const{agentNameById:t,sectorCodeById:e,airlineLabelById:a}=je(),s=k.search.trim().toLowerCase(),i=Ma(k.startDate),n=Fa(k.endDate),r=Z.map(l=>ce(l)).filter(l=>{var y,g;if(k.agentId!=="all"&&l.agentId!==k.agentId||k.sectorId!=="all"&&l.sectorId!==k.sectorId||k.airlineId!=="all"&&l.airlineId!==k.airlineId||k.status==="live"&&l.isHidden||k.status==="hidden"&&!l.isHidden)return!1;const m=((g=(y=Dt(l.flightDate))==null?void 0:y.getTime)==null?void 0:g.call(y))||null;return i!==null&&(m===null||m<i)||n!==null&&(m===null||m>n)?!1:s?[l.id,Mt(l.flightDate),l.flightTime,l.specialRate,l.finalRate,l.commission,l.baggage,l.extraBaggage,l.isHidden?"hidden":"live",l.agentId,l.sectorId,l.airlineId,t[l.agentId]||"",e[l.sectorId]||"",a[l.airlineId]||""].join(" ").toLowerCase().includes(s):!0}),{key:d,asc:o}=at.databaseFares;return r.sort((l,m)=>{const c=u=>{var p,b;return d==="agentId"?(t[u.agentId]||u.agentId||"").toLowerCase():d==="sectorId"?(e[u.sectorId]||u.sectorId||"").toLowerCase():d==="airlineId"?(a[u.airlineId]||u.airlineId||"").toLowerCase():d==="flightDate"?((b=(p=Dt(u.flightDate))==null?void 0:p.getTime)==null?void 0:b.call(p))||0:d==="isHidden"?u.isHidden?1:0:u[d]};let y=c(l),g=c(m);return typeof y=="string"&&(y=y.toLowerCase()),typeof g=="string"&&(g=g.toLowerCase()),y<g?o?-1:1:y>g?o?1:-1:0})}function H(){const t=document.getElementById("database-table-wrap");if(!t)return;const e=nn(),{agentNameById:a,sectorCodeById:s,airlineLabelById:i}=je(),n=document.getElementById("database-total-count");n&&(n.textContent=e.length.toLocaleString());const r=V.databaseFares,d=Math.max(1,Math.ceil(e.length/r));$.databaseFares>d&&($.databaseFares=d);const o=($.databaseFares-1)*r,l=e.slice(o,o+r);if(!l.length){t.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-database"></i>
        </div>
        <p class="admin-empty-state-title">No fares matched your filter</p>
      </div>
    </div>`,$t("databaseFares",e.length,d,o,r),Ct();return}const m=(p,b)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="databaseFares" data-sort-key="${p}">
      ${b} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i>
    </th>`,c=p=>z.map(b=>`<option value="${I(b.id)}" ${b.id===p?"selected":""}>${I(b.id)} · ${I(b.name||"Unnamed")}</option>`).join(""),y=p=>D.map(b=>`<option value="${I(b.id)}" ${b.id===p?"selected":""}>${I(b.sectorCode||b.id)}</option>`).join(""),g=p=>P.map(b=>`<option value="${I(b.id)}" ${b.id===p?"selected":""}>${I(b.code||"—")} · ${I(b.name||"Unnamed")}</option>`).join(""),u=l.length>0&&l.every(p=>Q.has(p.id));t.innerHTML=`
    <table class="admin-database-table">
      <thead>
        <tr>
          <th class="w-[36px] text-center"><input id="database-select-all" type="checkbox" ${u?"checked":""}></th>
          <th class="w-[56px]">#</th>
          ${m("agentId","Agent")}
          ${m("sectorId","Sector Code")}
          ${m("flightDate","Date")}
          ${m("flightTime","Time")}
          ${m("airlineId","Flight Code")}
          ${m("baggage","Baggage")}
          ${m("extraBaggage","Extra Baggage")}
          ${m("specialRate","SP Rate")}
          ${m("commission","Commission")}
          ${m("finalRate","Rate")}
          ${m("isHidden","Status")}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${l.map((p,b)=>{const h=!!G[p.id],A=Q.has(p.id),f=dt.has(p.id)||h,w=a[p.agentId]||p.agentId,E=s[p.sectorId]||p.sectorId,T=i[p.airlineId]||p.airlineId,N=p.flightDate instanceof Date?p.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):p.flightDate?Mt(p.flightDate):"—",W=b%2===1?"bg-slate-50/60":"";return`
            <tr data-fare-id="${p.id}" class="${h?"admin-database-row-dirty":W} hover:bg-slate-100/80 transition-colors">
              <td class="text-center">
                <input type="checkbox" data-db-select="${p.id}" ${A?"checked":""}>
              </td>
              <td class="font-mono text-[11px] text-text-soft">${o+b+1}</td>
              <td class="whitespace-nowrap ${f?"":"text-[12px]"}">
                ${f?`
                <select data-db-field="agentId" class="db-cell-select min-w-[150px]">
                  <option value="">Select Agent</option>
                  ${c(p.agentId)}
                </select>
                `:`<span class="text-text-muted">${I(w)}</span>`}
              </td>
              <td class="whitespace-nowrap ${f?"":"text-[12px]"}">
                ${f?`
                <select data-db-field="sectorId" class="db-cell-select min-w-[120px]">
                  <option value="">Select Sector</option>
                  ${y(p.sectorId)}
                </select>
                `:`<span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${I(E)}</span>`}
              </td>
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">
                ${f?`
                <input type="date" data-db-field="flightDate" class="db-cell-input" value="${Mt(p.flightDate)}">
                `:I(N)}
              </td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">
                ${f?`
                <input type="text" data-db-field="flightTime" class="db-cell-input min-w-[110px]" value="${I(p.flightTime||"")}" placeholder="04:05 - 11:10">
                `:I(p.flightTime||"—")}
              </td>
              <td class="whitespace-nowrap ${f?"":"font-semibold text-[13px]"}">
                ${f?`
                <select data-db-field="airlineId" class="db-cell-select min-w-[150px]">
                  <option value="">No Airline</option>
                  ${g(p.airlineId)}
                </select>
                `:I(T)}
              </td>
              <td class="whitespace-nowrap text-[12px]">
                ${f?`
                <select data-db-field="baggage" class="db-cell-select min-w-[90px]">
                  ${Et(kt,gt(p.baggage))}
                </select>
                `:p.baggage?p.baggage+" kg":"—"}
              </td>
              <td class="whitespace-nowrap text-[12px]">
                ${f?`
                <select data-db-field="extraBaggage" class="db-cell-select min-w-[90px]">
                  ${Et(kt,M(p.extraBaggage,0))}
                </select>
                `:p.extraBaggage?p.extraBaggage+" kg":"—"}
              </td>
              <td class="whitespace-nowrap">
                ${f?`
                <input type="number" data-db-field="specialRate" class="db-cell-input db-cell-num" value="${M(p.specialRate,0)}" min="0" step="1">
                `:`<span class="text-[13px] text-text-muted">₹${(p.specialRate||0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${f?`
                <input type="number" data-db-field="commission" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${M(p.commission,0)}" min="0" step="1" readonly tabindex="-1">
                `:`<span class="text-[12px] text-text-muted" id="comm-${p.id}">₹${(p.commission||0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${f?`
                <input type="number" data-db-field="finalRate" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${M(p.finalRate,0)}" min="0" step="1" readonly tabindex="-1">
                `:`<span class="font-black text-navy text-[14px]">₹${(p.finalRate||0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${f?`
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
                  ${f?`
                  <button data-db-action="save" data-id="${p.id}" class="admin-action-btn admin-action-edit" ${h?"":"disabled"}><i class="bi bi-check2-circle"></i>Save</button>
                  <button data-db-action="${h?"reset":"cancel_edit"}" data-id="${p.id}" class="admin-action-btn admin-action-toggle"><i class="bi ${h?"bi-arrow-counterclockwise":"bi-x"}"></i>${h?"Reset":"Cancel"}</button>
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
  `,$t("databaseFares",e.length,d,o,r),Nt("databaseFares"),Ct()}async function Ne(t,{silent:e=!1}={}){const a=Z.find(m=>m.id===t);if(!a)return!1;if(!G[t])return!0;const i=ce(a),n=Dt(i.flightDate);if(!i.agentId)return e||x("warning","Missing Agent","Please select an agent before saving."),!1;if(!i.sectorId)return e||x("warning","Missing Sector","Please select a sector before saving."),!1;if(!n)return e||x("warning","Missing Date","Please set a valid flight date before saving."),!1;const r=M(i.specialRate,0),d=Math.max(0,M(i.commission,0)),o=jt(r,d),l={agentId:i.agentId,sectorId:i.sectorId,airlineId:i.airlineId||"",flightDate:n,flightTime:i.flightTime||"",specialRate:r,finalRate:o,commission:d,baggage:gt(i.baggage),extraBaggage:M(i.extraBaggage,0),isHidden:i.isHidden===!0};try{return await Ie(t,l),Z=Z.map(m=>m.id===t?{...m,...l}:m),delete G[t],dt.delete(t),e||x("success","Saved","Fare row updated."),!0}catch(m){return e||x("error","Save Failed",m.message),!1}}async function sn(){const t=Object.keys(G);if(!t.length)return;const e=document.getElementById("database-save-all-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Saving...');let s=0,i=0;for(const n of t)await Ne(n,{silent:!0})?s+=1:i+=1;H(),e&&(e.disabled=Fe()===0,e.innerHTML=a||"Save All"),i===0?x("success","Saved",`${s} row${s!==1?"s":""} updated.`):x("warning","Partial Save",`${s} saved, ${i} failed. Fix invalid rows and retry.`)}async function on(){const t=Array.from(Q);if(!t.length||!confirm(`Delete ${t.length} selected fare row${t.length!==1?"s":""}? This cannot be undone.`))return;const e=document.getElementById("database-delete-selected-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Deleting...');const s=await Promise.allSettled(t.map(r=>oe(r))),i=[];let n=0;if(s.forEach((r,d)=>{r.status==="fulfilled"?i.push(t[d]):n+=1}),i.length){const r=new Set(i);Z=Z.filter(d=>!r.has(d.id)),i.forEach(d=>{delete G[d],Q.delete(d),dt.delete(d)})}H(),e&&(e.innerHTML=a||"Delete Selected"),n===0?x("success","Deleted",`${i.length} row${i.length!==1?"s":""} deleted.`):x("warning","Partial Delete",`${i.length} deleted, ${n} failed.`)}function rn(){const t=Mt(new Date);nt("Add Fare Row",`
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
            ${z.map(o=>`<option value="${I(o.id)}">${I(o.id)} · ${I(o.name||"Unnamed")}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Sector *</label>
          <select id="db-add-sector" class="admin-control h-10" required>
            <option value="">Select Sector</option>
            ${D.map(o=>`<option value="${I(o.id)}">${I(o.sectorCode||o.id)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Airline</label>
          <select id="db-add-airline" class="admin-control h-10">
            <option value="">No Airline</option>
            ${P.map(o=>`<option value="${I(o.id)}">${I(o.code||"—")} · ${I(o.name||"Unnamed")}</option>`).join("")}
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
            ${Et(kt,30)}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Extra Baggage (kg)</label>
          <select id="db-add-exbag" class="admin-control h-10">
            ${Et(kt,20)}
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
  `);const e=document.getElementById("database-add-form");if(!e)return;const a=document.getElementById("db-add-sp"),s=document.getElementById("db-add-comm"),i=document.getElementById("db-add-rate"),n=document.getElementById("db-add-agent"),r=()=>{if(!i)return;const o=M(a==null?void 0:a.value,0),l=Math.max(0,M(s==null?void 0:s.value,0));i.value=String(jt(o,l))},d=()=>{if(!s)return;const o=Re(n==null?void 0:n.value,0);s.value=String(o),r()};a==null||a.addEventListener("input",r),n==null||n.addEventListener("change",d),d(),r(),e.addEventListener("submit",async o=>{var c,y,g,u,p,b,h,A,f,w,E,T;o.preventDefault();const l=e.querySelector('button[type="submit"]'),m=(l==null?void 0:l.textContent)||"Add Fare";l&&(l.disabled=!0,l.textContent="Adding...");try{const N=((c=document.getElementById("db-add-date"))==null?void 0:c.value)||"",W=Ae(N);if(!W)throw new Error("Please provide a valid flight date.");const O=M((y=document.getElementById("db-add-sp"))==null?void 0:y.value,0),_=Math.max(0,M((g=document.getElementById("db-add-comm"))==null?void 0:g.value,0)),X=jt(O,_);await Ta({agentId:((u=document.getElementById("db-add-agent"))==null?void 0:u.value)||"",sectorId:((p=document.getElementById("db-add-sector"))==null?void 0:p.value)||"",airlineId:((b=document.getElementById("db-add-airline"))==null?void 0:b.value)||"",flightDate:W,flightTime:((A=(h=document.getElementById("db-add-time"))==null?void 0:h.value)==null?void 0:A.trim())||"",specialRate:O,finalRate:X,commission:_,baggage:gt((f=document.getElementById("db-add-bag"))==null?void 0:f.value),extraBaggage:M((w=document.getElementById("db-add-exbag"))==null?void 0:w.value,0),isHidden:(((E=document.getElementById("db-add-status"))==null?void 0:E.value)||"live")==="hidden"}),(T=document.getElementById("admin-modal"))==null||T.close(),await me(!0),x("success","Added","New fare row added.")}catch(N){x("error","Add Failed",N.message),l&&(l.disabled=!1,l.textContent=m)}})}const dn="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",ln={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},xe=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let J=null,ut=JSON.parse(localStorage.getItem("zt_hist")||"[]"),ue=ut.reduce((t,e)=>t+(e.rows||0),0);function cn(){var e,a,s,i;const t=document.getElementById("rateData");t&&t.addEventListener("input",function(){const n=this.value.length,r=document.getElementById("charCount");r&&(r.textContent=n.toLocaleString()+" character"+(n!==1?"s":"")),pt(),clearTimeout(window._previewTimer),n>15?window._previewTimer=setTimeout(()=>un(this.value),500):_t()}),(e=document.getElementById("resetBtn"))==null||e.addEventListener("click",()=>{t&&(t.value="");const n=document.getElementById("charCount");n&&(n.textContent="0 characters"),_t(),pt()}),(a=document.getElementById("clearBtn"))==null||a.addEventListener("click",()=>{ut=[],ue=0,qt(),At(),ie()}),(s=document.getElementById("manualAgent"))==null||s.addEventListener("input",function(){const n=parseInt(this.value);J=n>0?String(n):null,document.querySelectorAll(".rp-chip").forEach(r=>r.classList.remove("on")),Rt(),pt()}),(i=document.getElementById("submitBtn"))==null||i.addEventListener("click",pn),ie(),At()}function He(){const t=document.getElementById("chipGrid");if(!t)return;t.innerHTML="";const e=z.length?[...z].sort((a,s)=>{const i=parseInt(a.id),n=parseInt(s.id);return!isNaN(i)&&!isNaN(n)?i-n:a.id.localeCompare(s.id)}):[];if(!e.length){J=null,t.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>',Rt(),pt();return}J&&!e.some(a=>a.id===J)&&(J=null),e.forEach(a=>{const s=document.createElement("div");s.className="rp-chip",s.dataset.agentId=a.id,s.textContent=a.id,a.id===J&&s.classList.add("on"),s.addEventListener("click",()=>mn(a.id,a.name,s)),t.appendChild(s)}),Rt(),pt()}function mn(t,e,a){J=t,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(s=>{s.classList.remove("on")}),a&&a.classList.add("on"),Rt(),pt()}function Rt(){const t=document.getElementById("agentPill");if(t)if(J){const e=z.find(a=>a.id===J);t.textContent=`Agent ${(e==null?void 0:e.id)||J} selected ✓`,t.classList.remove("empty")}else t.textContent="Select an agent to continue",t.classList.add("empty")}function pt(){const t=document.getElementById("rateData"),e=document.getElementById("submitBtn");e&&(e.disabled=!(J&&t&&t.value.trim().length>10))}function Pe(t){const e=[];let a=null,s="IX";for(const i of t.split(`
`)){const n=i.replace(/[*_~`]/g,"").trim();if(!n)continue;const r=n.match(/([A-Z]{3})\s+([A-Z]{3})/);if(r&&n.length<70&&!n.match(/\d{4,6}/)){a=r[1]+"-"+r[2];const d=n.match(xe);d&&(s=d[1]);continue}if(a){const d=n.match(xe);if(d&&!n.match(/\d{4,6}/)){s=d[1];continue}const o=n.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(o){const l=parseInt(o[3]);l>=1e3&&l<=99999&&e.push({sector:a,date:`2026-${ln[o[2].toUpperCase()]}-${o[1].padStart(2,"0")}`,airline:d?d[1]:s,rate:l})}}}return e}function un(t){const e=Pe(t);if(!e.length){_t();return}const a=document.getElementById("prevBox");a&&a.classList.add("on");const s=document.getElementById("prevCount");s&&(s.textContent=e.length+" entr"+(e.length===1?"y":"ies"));const i=document.getElementById("prevBody");i&&(i.innerHTML=e.slice(0,60).map(n=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${n.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${n.rate.toLocaleString()}</td></tr>`).join(""),e.length>60&&(i.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${e.length-60} more</td></tr>`))}function _t(){var t;(t=document.getElementById("prevBox"))==null||t.classList.remove("on")}async function pn(){const t=document.getElementById("rateData");if(!J||!(t!=null&&t.value.trim()))return;const e=document.getElementById("submitBtn"),a=e.innerHTML;e.disabled=!0,e.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI pipeline...';const s=document.getElementById("progBar"),i=document.getElementById("progFill");s&&s.classList.add("on");let n=0;const r=setInterval(()=>{n=Math.min(n+Math.random()*13,85),i&&(i.style.width=n+"%")},280),d=Pe(t.value),o={id:Date.now(),agent:J,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:d.length,status:"pen"};ut.unshift(o),ut.length>15&&ut.pop(),qt(),At();try{const l=await fetch(dn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:J,raw_text:t.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(r),i&&(i.style.width="100%"),l.ok)o.status="ok",ue+=d.length,qt(),At(),ie(),x("success","Submitted","Rates sent to the AI parser. Firestore will update in a moment."),setTimeout(()=>{t.value="";const m=document.getElementById("charCount");m&&(m.textContent="0 characters"),_t(),pt()},500);else throw new Error("N8N webhook rejected payload")}catch(l){clearInterval(r),i&&(i.style.width="100%"),o.status="err",qt(),At(),x("error","Submission Failed",l.message)}setTimeout(()=>{s&&s.classList.remove("on"),i&&(i.style.width="0%"),e.innerHTML=a,pt()},900)}function ie(){const t=document.getElementById("statSubs");t&&(t.textContent=ut.length);const e=document.getElementById("statEntries");e&&(e.textContent=ue)}function qt(){localStorage.setItem("zt_hist",JSON.stringify(ut))}function At(){const t=document.getElementById("historyWrap");if(t){if(!ut.length){t.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}t.innerHTML=ut.map(e=>{var s;const a=((s=z.find(i=>i.id===e.agent))==null?void 0:s.name)||`Agent ${e.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${a.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${a}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${e.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${e.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${e.status==="ok"?"bg-green-500":e.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}const gn=210/25.4*96,fn=297/25.4*96;function we(){const t=document.getElementById("eticket-output-wrapper"),e=document.getElementById("eticket-print-area");if(!t||!e||t.classList.contains("hidden"))return;e.style.zoom="1",e.style.removeProperty("--eticket-print-scale");const a=Math.max(e.scrollWidth,e.offsetWidth),s=Math.max(e.scrollHeight,e.offsetHeight);if(!a||!s)return;const i=gn/a,n=fn/s;let r=Math.min(1,i,n);r<1&&(r=Math.max(.7,r*.985)),e.style.zoom=String(r),e.style.setProperty("--eticket-print-scale",String(r))}function bn(){const t=document.getElementById("eticket-print-area");t&&(t.style.zoom="1",t.style.removeProperty("--eticket-print-scale"))}async function hn(){var d;const t=document.getElementById("eticket-tab");if(!t)return;const e=document.getElementById("eticket-form"),a=document.getElementById("et-add-passenger"),s=document.getElementById("et-passengers-container"),i=document.getElementById("et-airline"),n=document.getElementById("et-origin"),r=document.getElementById("et-destination");if(P.length===0&&(P=await de()),D.length===0&&(D=le(await re())),!t.dataset.wired){if(t.dataset.wired="1",i&&P&&(i.innerHTML='<option value="">Select Airline</option>'+P.map(l=>`<option value="${l.name}">${l.name}</option>`).join("")),n&&D){const l=[...new Set(D.map(m=>m.sectorFrom).filter(Boolean))].sort();n.innerHTML='<option value="">Select Origin</option>'+l.map(m=>`<option value="${m}">${m}</option>`).join("")}if(r&&D){const l=[...new Set(D.map(m=>m.sectorTo).filter(Boolean))].sort();r.innerHTML='<option value="">Select Destination</option>'+l.map(m=>`<option value="${m}">${m}</option>`).join("")}const o=()=>{const l=Array.from(s.querySelectorAll(".et-pax-row"));l.forEach((m,c)=>{const y=m.querySelector(".et-passenger-index");y&&(y.textContent=`Passenger ${c+1}`);const g=m.querySelector(".et-remove-passenger");g&&(l.length<=1?(g.classList.add("opacity-40","pointer-events-none"),g.setAttribute("aria-disabled","true")):(g.classList.remove("opacity-40","pointer-events-none"),g.removeAttribute("aria-disabled")))})};a==null||a.addEventListener("click",()=>{const l=`
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
                ${Et(Da,7)}
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Check-in Bag</label>
              <select name="paxCheckBag[]" class="admin-control h-10">
                ${Et(kt,30)}
              </select>
            </div>
          </div>
        </div>
      `;s.insertAdjacentHTML("beforeend",l),o()}),s==null||s.addEventListener("click",l=>{var c;const m=l.target.closest(".et-remove-passenger");m&&((c=m.closest(".et-pax-row"))==null||c.remove(),o())}),s.children.length===0&&(a==null||a.click()),o(),e==null||e.addEventListener("submit",async l=>{l.preventDefault(),await yn(new FormData(e))}),(d=document.getElementById("et-print-btn"))==null||d.addEventListener("click",()=>{we(),requestAnimationFrame(()=>window.print())}),window.addEventListener("beforeprint",we),window.addEventListener("afterprint",bn),e==null||e.addEventListener("reset",()=>{setTimeout(()=>{var l;Array.from(s.children).forEach((m,c)=>{c>0&&m.remove()}),s.children.length===0&&(a==null||a.click()),o(),(l=document.getElementById("eticket-output-wrapper"))==null||l.classList.add("hidden")},10),x("info","Form Reset","The E-Ticket form has been cleared.")})}}async function yn(t){var U,K,St;const e=(U=t.get("etPnr"))==null?void 0:U.toUpperCase(),a=(K=t.get("etAirline"))==null?void 0:K.toUpperCase(),s=(St=t.get("etFlightNo"))==null?void 0:St.toUpperCase(),i=t.get("etDate"),n=t.get("etDepTime"),r=t.get("etArrTime"),d=t.get("etPhone"),o=(S="")=>String(S).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),l=S=>{const C=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec(S||"");return C?Number(C[1])*60+Number(C[2]):null},m=(S="")=>S.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",c=S=>{const C=(S||"").trim();let R=C,ht="";const tt=C.match(/^(.*?)\s*\((.*?)\)$/);return tt&&(R=tt[1].trim(),ht=tt[2].trim()),{city:R,code:ht}},y=c(t.get("etOrigin")),g=c(t.get("etDest")),u=t.get("etOrigin")||"—",p=t.get("etDest")||"—";let b="—";if(i){const S=new Date(i);if(!isNaN(S.getTime())){const C=["SUN","MON","TUE","WED","THU","FRI","SAT"],R=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];b=`${C[S.getDay()]}, ${String(S.getDate()).padStart(2,"0")} ${R[S.getMonth()]} ${S.getFullYear()}`}}const h=S=>document.getElementById(S);let A=y.code,f=g.code,w=null;if(typeof D<"u"){if(w=D.find(S=>S.sectorFrom===u&&S.sectorTo===p),!w&&u){const S=D.find(C=>C.sectorFrom===u);S&&S.sectorCode&&(A=S.sectorCode.split(/[ -]+/)[0])}if(!w&&p){const S=D.find(C=>C.sectorTo===p);S&&S.sectorCode&&(f=S.sectorCode.split(/[ -]+/).pop())}}const E=(A||m(y.city)).toUpperCase(),T=(f||m(g.city)).toUpperCase(),N=`${E} - ${T}`,W=`${(y.city||u).toUpperCase()} to ${(g.city||p).toUpperCase()}`,O=(y.city||u).toUpperCase(),_=(g.city||p).toUpperCase(),X=l(n),xt=l(r);if(X!==null&&xt!==null){let S=xt-X;S<0&&(S+=24*60);const C=Math.floor(S/60),R=S%60;`${C}${String(R).padStart(2,"0")}`}h("t-pnr")&&(h("t-pnr").textContent=e||"—"),h("t-issued-by")&&(h("t-issued-by").textContent=a||"—"),h("t-customer-phone")&&(h("t-customer-phone").textContent=d||"—"),h("t-flight-code")&&(h("t-flight-code").textContent=s||"—"),h("t-travel-date")&&(h("t-travel-date").textContent=b||"—"),h("t-route-code")&&(h("t-route-code").textContent=N),h("t-route-long")&&(h("t-route-long").textContent=W);const it=new Date,ft=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],Ht=`${String(it.getDate()).padStart(2,"0")} ${ft[it.getMonth()]} ${it.getFullYear()} ${String(it.getHours()).padStart(2,"0")}:${String(it.getMinutes()).padStart(2,"0")}`;h("t-booked-on")&&(h("t-booked-on").textContent=Ht);const v=h("t-airline-logo"),B=h("t-issued-by-fallback");if(v){const S=typeof P<"u"?P.find(C=>C.name.toUpperCase()===a):null;S&&S.logoUrl?(v.src=S.logoUrl,v.classList.remove("hidden"),B&&B.classList.add("hidden")):(v.removeAttribute("src"),v.classList.add("hidden"),B&&(B.classList.remove("hidden"),B.textContent=(a||"No logo").toUpperCase()))}const L=t.getAll("paxTitle[]"),F=t.getAll("paxName[]"),j=t.getAll("paxType[]"),It=t.getAll("paxCheckBag[]"),ot=t.getAll("paxCarryBag[]");h("t-pax-count")&&(h("t-pax-count").textContent=String(F.length)),h("t-top-pax-count")&&(h("t-top-pax-count").textContent=String(F.length));const bt=document.getElementById("t-passengers-tbody");if(bt){const S=F.map((C,R)=>{const ht=o((L[R]||"MR").toUpperCase()),tt=o((F[R]||"").toUpperCase()),Jt=o((j[R]||"ADT").toUpperCase()),et=o(ye(It[R])),Yt=o(ye(ot[R])),Xt=w&&w.sectorCode?o(w.sectorCode.toUpperCase()):o(N);return`
        <tr class="${R%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${R+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${ht}. ${tt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Jt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Xt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${o(s||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${o(e||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Yt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${et}</td>
        </tr>
      `}).join("");bt.innerHTML=S||`
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `}const rt=document.getElementById("t-travel-tbody");rt&&(rt.innerHTML=`
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${o(s||"—")}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${o(O)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${o(E)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${o(n||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${o(b||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${o(_)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${o(T)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${o(r||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${o(b||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const Y=document.getElementById("eticket-output-wrapper");Y&&(Y.classList.remove("hidden"),Y.scrollIntoView({behavior:"smooth"}))}const Ee={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function x(t,e,a){const s=document.getElementById("toastsEl");if(!s)return;const i=document.createElement("div"),n={success:"border-emerald-200 bg-emerald-50/95 text-emerald-900",error:"border-rose-200 bg-rose-50/95 text-rose-900",warning:"border-amber-200 bg-amber-50/95 text-amber-900",info:"border-blue-200 bg-blue-50/95 text-blue-900"};i.className=`flex items-start gap-3 p-4 border rounded-xl shadow-md w-80 pointer-events-auto backdrop-blur-sm ${n[t]||n.error}`,i.innerHTML=`<div class="mt-0.5">${Ee[t]||Ee.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${e}</div><div class="text-xs opacity-90 mt-1">${a}</div></div>
    <button class="opacity-50 hover:opacity-100 transition-opacity" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,s.appendChild(i),setTimeout(()=>i.isConnected&&i.remove(),7e3)}window.toast=x;document.addEventListener("DOMContentLoaded",()=>{});async function st(t=!0){if(t)try{const[n,r,d,o]=await Promise.all([Be(),ra(),da(),la()]);Ot=n,Qt=r,te=d,ee=o,$.visas=1,$.visaStampings=1,$.attestations=1,$.passportServices=1}catch(n){x("error","Error loading Visas tab data",n.message)}const e=document.querySelector("#visas-tab #visas-table-body");if(e){const n=lt(Ot,"visas"),r=V.visas,d=Math.max(1,Math.ceil(n.length/r));$.visas>d&&($.visas=d);const o=($.visas-1)*r,l=n.slice(o,o+r);e.innerHTML=l.length?l.map(m=>xn(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No tourist visas yet. Click "Add Tourist Visa".</td></tr>',wn()}const a=document.querySelector("#visa-stamping-table-body");if(a){const n=lt(Qt,"visaStampings"),r=V.visaStampings,d=Math.max(1,Math.ceil(n.length/r));$.visaStampings>d&&($.visaStampings=d);const o=($.visaStampings-1)*r,l=n.slice(o,o+r);a.innerHTML=l.length?l.map(m=>En(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No visa stampings yet. Click "Add Visa Stamping".</td></tr>',$n()}const s=document.querySelector("#attestations-table-body");if(s){const n=lt(te,"attestations"),r=V.attestations,d=Math.max(1,Math.ceil(n.length/r));$.attestations>d&&($.attestations=d);const o=($.attestations-1)*r,l=n.slice(o,o+r);s.innerHTML=l.length?l.map(m=>In(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No attestations yet. Click "Add Attestation".</td></tr>',Sn()}const i=document.querySelector("#passport-services-table-body");if(i){const n=lt(ee,"passportServices"),r=V.passportServices,d=Math.max(1,Math.ceil(n.length/r));$.passportServices>d&&($.passportServices=d);const o=($.passportServices-1)*r,l=n.slice(o,o+r);i.innerHTML=l.length?l.map(m=>Bn(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No passport services yet. Click "Add Passport Service".</td></tr>',Cn()}vn()}function vn(){const t=document.getElementById("visas-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>Ue(null)));const e=document.getElementById("visa-stamping-add-btn");e&&!e.dataset.wired&&(e.dataset.wired="1",e.addEventListener("click",()=>qe(null)));const a=document.getElementById("attestation-add-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",()=>Oe(null)));const s=document.getElementById("passport-service-add-btn");s&&!s.dataset.wired&&(s.dataset.wired="1",s.addEventListener("click",()=>_e(null)))}function xn(t){const e=t.flagUrl?`<span class="admin-logo-wrap"><img src="${t.flagUrl}" alt="${I(t.countryName||"Country")}"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-flag"></i></span></span>';return`<tr data-visa-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy">${I(t.countryName)}</td>
    <td class="text-text-muted text-[13px]">${I(t.visaType)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.rate||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function wn(){const t=document.querySelector("#visas-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Ot.find(r=>r.id===i);if(s==="edit-visa"&&Ue(n),s==="delete-visa"){if(!confirm(`Delete visa for "${n==null?void 0:n.countryName}"?`))return;try{await ca(i),x("success","Deleted",`Visa for "${n==null?void 0:n.countryName}" removed.`),await st()}catch(r){x("error","Error",r.message)}}}))}function Ue(t){const e=document.getElementById("modal-visa-form");if(!e)return;nt(t?"Edit Visa":"Add New Visa",e.innerHTML);const a=document.getElementById("visa-form"),s=document.getElementById("visa-id"),i=document.getElementById("visa-country"),n=document.getElementById("visa-type"),r=document.getElementById("visa-rate");t&&(s.value=t.id,i.value=t.countryName||"",n.value=t.visaType||"",r.value=t.rate||0),a.addEventListener("submit",async d=>{d.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=s.value,m={countryName:i.value.trim(),visaType:n.value.trim(),rate:Number(r.value)},y=document.getElementById("visa-flag").files[0];l?await ma(l,m,y):await ua(m,y),x("success","Saved!",`Visa for ${m.countryName} saved.`),document.getElementById("admin-modal").close(),await st()}catch(l){x("error","Error",l.message),o.disabled=!1,o.textContent="Save Visa"}})}function En(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${I(t.country)}</td>
    <td class="text-text-muted text-[13px]">${I(t.description)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function $n(){const t=document.getElementById("visa-stamping-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Qt.find(r=>r.id===i);if(s==="edit-visa-stamping"&&qe(n),s==="delete-visa-stamping"){if(!confirm(`Delete visa stamping for "${n==null?void 0:n.country}"?`))return;try{await pa(i),x("success","Deleted",`Visa Stamping for "${n==null?void 0:n.country}" removed.`),await st(!0)}catch(r){x("error","Error",r.message)}}}))}function qe(t){const e=document.getElementById("modal-visa-stamping-form");if(!e)return;nt(t?"Edit Visa Stamping":"Add Visa Stamping",e.innerHTML);const a=document.getElementById("visa-stamping-form"),s=document.getElementById("visa-stamping-id"),i=document.getElementById("visa-stamping-country"),n=document.getElementById("visa-stamping-desc"),r=document.getElementById("visa-stamping-cost");t&&(s.value=t.id,i.value=t.country||"",n.value=t.description||"",r.value=t.cost||0),a.addEventListener("submit",async d=>{d.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=s.value,m={country:i.value.trim(),description:n.value.trim(),cost:Number(r.value)};l?await ga(l,m):await fa(m),x("success","Saved!",`Visa stamping for ${m.country} saved.`),document.getElementById("admin-modal").close(),await st(!0)}catch(l){x("error","Error",l.message),o.disabled=!1,o.textContent="Save"}})}function In(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${I(t.country)}</td>
    <td class="text-text-muted text-[13px]">${I(t.certificate)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-attestation" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-attestation" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Sn(){const t=document.getElementById("attestations-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=te.find(r=>r.id===i);if(s==="edit-attestation"&&Oe(n),s==="delete-attestation"){if(!confirm(`Delete attestation for "${n==null?void 0:n.country}"?`))return;try{await ba(i),x("success","Deleted",`Attestation for "${n==null?void 0:n.country}" removed.`),await st(!0)}catch(r){x("error","Error",r.message)}}}))}function Oe(t){const e=document.getElementById("modal-attestation-form");if(!e)return;nt(t?"Edit Attestation":"Add Attestation",e.innerHTML);const a=document.getElementById("attestation-form"),s=document.getElementById("attestation-id"),i=document.getElementById("attestation-country"),n=document.getElementById("attestation-cert"),r=document.getElementById("attestation-cost");t&&(s.value=t.id,i.value=t.country||"",n.value=t.certificate||"",r.value=t.cost||0),a.addEventListener("submit",async d=>{d.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=s.value,m={country:i.value.trim(),certificate:n.value.trim(),cost:Number(r.value)};l?await ha(l,m):await ya(m),x("success","Saved!",`Attestation for ${m.country} saved.`),document.getElementById("admin-modal").close(),await st(!0)}catch(l){x("error","Error",l.message),o.disabled=!1,o.textContent="Save"}})}function Bn(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${I(t.type)}</td>
    <td class="text-text-muted text-[13px]">${I(t.description)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Cn(){const t=document.getElementById("passport-services-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=ee.find(r=>r.id===i);if(s==="edit-passport-service"&&_e(n),s==="delete-passport-service"){if(!confirm(`Delete passport service "${n==null?void 0:n.type}"?`))return;try{await va(i),x("success","Deleted",`Passport service "${n==null?void 0:n.type}" removed.`),await st(!0)}catch(r){x("error","Error",r.message)}}}))}function _e(t){const e=document.getElementById("modal-passport-service-form");if(!e)return;nt(t?"Edit Passport Service":"Add Passport Service",e.innerHTML);const a=document.getElementById("passport-service-form"),s=document.getElementById("passport-service-id"),i=document.getElementById("passport-service-type"),n=document.getElementById("passport-service-desc"),r=document.getElementById("passport-service-cost");t&&(s.value=t.id,i.value=t.type||"",n.value=t.description||"",r.value=t.cost||0),a.addEventListener("submit",async d=>{d.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=s.value,m={type:i.value.trim(),description:n.value.trim(),cost:Number(r.value)};l?await xa(l,m):await wa(m),x("success","Saved!",`Passport service ${m.type} saved.`),document.getElementById("admin-modal").close(),await st(!0)}catch(l){x("error","Error",l.message),o.disabled=!1,o.textContent="Save"}})}async function Wt(t=!0){if(t)try{ae=await Ea({includeInactive:!0}),$.tours=1}catch(d){x("error","Error loading Tours",d.message)}const e=document.getElementById("tours-table-body");if(!e)return;const a=lt(ae,"tours"),s=V.tours,i=Math.max(1,Math.ceil(a.length/s));$.tours>i&&($.tours=i);const n=($.tours-1)*s,r=a.slice(n,n+s);e.innerHTML=r.length?r.map(d=>Ln(d)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No tour packages yet. Click "Add Tour Package".</td></tr>',Tn(),An()}function An(){const t=document.getElementById("tours-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>Ve(null)))}function Ln(t){const e=t.coverImageUrl?`<span class="admin-logo-wrap"><img src="${t.coverImageUrl}" alt="${I(t.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>',a=!t.price||t.price===0?'<span class="text-text-muted text-[12px] italic">Call for Price</span>':`<span class="font-black text-[15px] text-navy">₹${Number(t.price).toLocaleString()}</span>`,s=t.isActive!==!1?'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>':'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>';return`<tr data-tour-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy">${I(t.title)}</td>
    <td class="text-text-muted text-[13px]">${I(t.category)}</td>
    <td class="text-text-muted text-[13px]">${I(t.duration)}</td>
    <td>${a}</td>
    <td>${s}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-tour" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-tour" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Tn(){const t=document.getElementById("tours-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=ae.find(r=>r.id===i);if(s==="edit-tour"&&Ve(n),s==="delete-tour"){if(!confirm(`Delete tour package "${n==null?void 0:n.title}"?`))return;try{await $a(i),x("success","Deleted",`Tour "${n==null?void 0:n.title}" removed.`),await Wt()}catch(r){x("error","Error",r.message)}}}))}function Lt(t=""){return t.split(`
`).map(e=>e.trim()).filter(Boolean)}function Tt(t=[]){return Array.isArray(t)?t.join(`
`):""}function kn(t,e="",a=[]){const s=a.length?a.join(`
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
          <input type="text" class="tour-day-label admin-control h-9 text-sm" placeholder="e.g. Day 1 – Arrival" value="${I(e)}" required>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Activities <span class="font-normal normal-case">(one per line)</span></label>
          <textarea class="tour-day-activities admin-control text-sm" rows="3" placeholder="Airport pickup&#10;Hotel check-in&#10;Welcome dinner">${I(s)}</textarea>
        </div>
      </div>
    </div>`}function $e(t){const e=t.querySelectorAll(".tour-day-row");e.forEach((a,s)=>{const i=a.querySelector(".tour-day-number");i&&(i.textContent=`Day ${s+1}`),a.dataset.dayIndex=s;const n=a.querySelector(".tour-remove-day");n&&(e.length<=1?n.classList.add("opacity-40","pointer-events-none"):n.classList.remove("opacity-40","pointer-events-none"))})}function Dn(t){const e=t.querySelectorAll(".tour-day-row");return Array.from(e).map(a=>{var s,i;return{day:((s=a.querySelector(".tour-day-label"))==null?void 0:s.value.trim())||"",activities:(((i=a.querySelector(".tour-day-activities"))==null?void 0:i.value)||"").split(`
`).map(n=>n.trim()).filter(Boolean)}}).filter(a=>a.day)}function Ve(t){const e=document.getElementById("modal-tour-form");if(!e)return;nt(t?"Edit Tour Package":"Add Tour Package",e.innerHTML,!0);const a=document.getElementById("tour-form"),s=document.getElementById("tour-id"),i=document.getElementById("tour-title"),n=document.getElementById("tour-category"),r=document.getElementById("tour-duration"),d=document.getElementById("tour-price"),o=document.getElementById("tour-active"),l=document.getElementById("tour-description"),m=document.getElementById("tour-highlights"),c=document.getElementById("tour-inclusions"),y=document.getElementById("tour-exclusions"),g=document.getElementById("tour-itinerary-container"),u=document.getElementById("tour-add-day-btn"),p=(b="",h=[])=>{const A=g.querySelectorAll(".tour-day-row").length;g.insertAdjacentHTML("beforeend",kn(A,b,h)),$e(g)};u==null||u.addEventListener("click",()=>{var b;p(),(b=g.lastElementChild)==null||b.scrollIntoView({behavior:"smooth",block:"nearest"})}),g.addEventListener("click",b=>{var A;const h=b.target.closest(".tour-remove-day");h&&((A=h.closest(".tour-day-row"))==null||A.remove(),$e(g))}),t&&(s.value=t.id,i.value=t.title||"",n.value=t.category||"International",r.value=t.duration||"",d.value=t.price||0,o.checked=t.isActive!==!1,l.value=t.description||"",m.value=Tt(t.highlights),c.value=Tt(t.inclusions),y.value=Tt(t.exclusions),(Array.isArray(t.itinerary)?t.itinerary:[]).forEach(h=>p(h.day||"",h.activities||[]))),g.querySelectorAll(".tour-day-row").length===0&&p(),a.addEventListener("submit",async b=>{var A;b.preventDefault();const h=a.querySelector('button[type="submit"]');h.disabled=!0,h.textContent="Saving…";try{const f=s.value,w=Dn(g),E={title:i.value.trim(),category:n.value,duration:r.value.trim(),price:Number(d.value)||0,isActive:o.checked,description:l.value.trim(),highlights:Lt(m.value),itinerary:w,inclusions:Lt(c.value),exclusions:Lt(y.value)},T=((A=document.getElementById("tour-image"))==null?void 0:A.files[0])||null;f?await Ia(f,E,T):await Sa(E,T),x("success","Saved!",`Tour "${E.title}" saved.`),document.getElementById("admin-modal").close(),await Wt()}catch(f){x("error","Error",f.message),h.disabled=!1,h.textContent="Save Tour"}})}async function Gt(t=!0){if(t)try{ne=await Ba({includeInactive:!0}),$.hajjUmrah=1}catch(d){x("error","Error loading Hajj & Umrah",d.message)}const e=document.getElementById("hajjumrah-table-body");if(!e)return;const a=lt(ne,"hajjUmrah"),s=V.hajjUmrah,i=Math.max(1,Math.ceil(a.length/s));$.hajjUmrah>i&&($.hajjUmrah=i);const n=($.hajjUmrah-1)*s,r=a.slice(n,n+s);e.innerHTML=r.length?r.map(d=>Fn(d)).join(""):'<tr><td colspan="10" class="text-center py-8 text-text-muted">No packages yet. Click "Add Package".</td></tr>',jn(),Mn()}function Mn(){const t=document.getElementById("hajjumrah-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>ze(null)))}function Fn(t){const e=t.coverImageUrl?`<span class="admin-logo-wrap"><img src="${t.coverImageUrl}" alt="${I(t.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>',a=!t.price||t.price===0?'<span class="text-text-muted text-[12px] italic">Call for Price</span>':`<span class="font-black text-[15px] text-navy">₹${Number(t.price).toLocaleString()}</span>`,s=t.isActive!==!1?'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>':'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>',i=t.type==="Hajj"?'<span class="px-2 py-0.5 rounded bg-blue-50 text-primary text-[11px] font-semibold">Hajj</span>':'<span class="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[11px] font-semibold">Umrah</span>';return`<tr data-hajjumrah-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy truncate max-w-[150px]" title="${I(t.title)}">${I(t.title)}</td>
    <td>${i}</td>
    <td class="text-text-muted text-[13px]">${I(t.departureCity)}</td>
    <td class="text-text-muted text-[13px]">${I(t.airline)}</td>
    <td class="text-text-muted text-[13px]">${I(t.departureDate)}</td>
    <td class="text-navy font-medium text-[13px]">${t.days}D/${t.nights}N</td>
    <td>${a}</td>
    <td>${s}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-hajjumrah" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-hajjumrah" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function jn(){const t=document.getElementById("hajjumrah-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=ne.find(r=>r.id===i);if(s==="edit-hajjumrah"&&ze(n),s==="delete-hajjumrah"){if(!confirm(`Delete package "${n==null?void 0:n.title}"?`))return;try{await Ca(i),x("success","Deleted",`Package "${n==null?void 0:n.title}" removed.`),await Gt()}catch(r){x("error","Error",r.message)}}}))}function ze(t){const e=document.getElementById("modal-hajjumrah-form");if(!e)return;nt(t?"Edit Package":"Add Package",e.innerHTML);const a=document.getElementById("hajjumrah-form"),s=document.getElementById("hajjumrah-id"),i=document.getElementById("hajjumrah-title"),n=document.getElementById("hajjumrah-type"),r=document.getElementById("hajjumrah-city"),d=document.getElementById("hajjumrah-airline"),o=document.getElementById("hajjumrah-date"),l=document.getElementById("hajjumrah-days"),m=document.getElementById("hajjumrah-nights"),c=document.getElementById("hajjumrah-price"),y=document.getElementById("hajjumrah-active"),g=document.getElementById("hajjumrah-description"),u=document.getElementById("hajjumrah-highlights"),p=document.getElementById("hajjumrah-inclusions");t&&(s.value=t.id,i.value=t.title||"",n.value=t.type||"Umrah",r.value=t.departureCity||"",d.value=t.airline||"",o.value=t.departureDate||"",l.value=t.days||15,m.value=t.nights||14,c.value=t.price||0,y.checked=t.isActive!==!1,g.value=t.description||"",u.value=Tt(t.highlights),p.value=Tt(t.inclusions)),a.addEventListener("submit",async b=>{var A;b.preventDefault();const h=a.querySelector('button[type="submit"]');h.disabled=!0,h.textContent="Saving…";try{const f=s.value,w={title:i.value.trim(),type:n.value,departureCity:r.value.trim(),airline:d.value.trim(),departureDate:o.value.trim(),days:Number(l.value)||1,nights:Number(m.value)||1,price:Number(c.value)||0,isActive:y.checked,description:g.value.trim(),highlights:Lt(u.value),inclusions:Lt(p.value)},E=((A=document.getElementById("hajjumrah-image"))==null?void 0:A.files[0])||null;f?await Aa(f,w,E):await La(w,E),x("success","Saved!",`Package "${w.title}" saved.`),document.getElementById("admin-modal").close(),await Gt()}catch(f){x("error","Error",f.message),h.disabled=!1,h.textContent="Save Package"}})}
