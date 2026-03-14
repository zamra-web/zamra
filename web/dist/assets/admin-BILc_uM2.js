import"./index.esm-kRT_WKqT.js";import{o as Ve,l as ze}from"./auth-1h7_DMa0.js";import{a as Ot,d as ie,u as Ee,c as Ie,e as We,f as Ge,h as Je,i as Ye,g as oe,j as Xe,k as Ke,l as Ze,m as Qe,b as re,n as ta,o as ea,p as aa,q as na,r as $e,s as sa,t as ia,v as oa,w as ra,x as da,y as la,z as ca,A as ma,B as ua,C as pa,D as ga,E as fa,F as ba,G as ha,H as ya,I as va,J as xa,K as wa,L as Ea,M as Ia,N as $a,O as Sa,P as Ba,Q as Ca}from"./db-DIsZtkDY.js";import"./firebase-config-aHS-3htW.js";async function Aa(t,e,a,s,i){const n=`Generating ${t} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",n),new Promise(async(d,r)=>{try{let gt=function(b,B,A,F,j){c.beginPath(),c.moveTo(b+j,B),c.lineTo(b+A-j,B),c.arcTo(b+A,B,b+A,B+j,j),c.lineTo(b+A,B+F-j),c.arcTo(b+A,B+F,b+A-j,B+F,j),c.lineTo(b+j,B+F),c.arcTo(b,B+F,b,B+F-j,j),c.lineTo(b,B+j),c.arcTo(b,B,b+j,B,j),c.closePath()},Rt=function(b){const B=b-it;if(B>vt){try{_.stop()}catch($){console.error("Error stopping recorder",$)}return}c.fillStyle="#f8fafc",c.fillRect(0,0,o,l);const A=t==="9x16"?400:300;if(c.fillStyle="#1e293b",c.fillRect(0,0,o,A),y.complete&&y.width>0){c.globalAlpha=.2;const $=Math.max(o/y.width,A/y.height),C=y.width*$,R=y.height*$,bt=(o-C)/2,tt=(A-R)/2;c.drawImage(y,bt,tt,C,R),c.globalAlpha=1}const F=c.createLinearGradient(0,0,0,A);F.addColorStop(0,"#1e293b"),F.addColorStop(1,"transparent"),c.fillStyle=F,c.globalAlpha=.8,c.fillRect(0,0,o,A),c.globalAlpha=1,c.textAlign="center",c.textBaseline="middle";const j=c.createLinearGradient(0,0,o,0);j.addColorStop(0,"#2563eb"),j.addColorStop(.5,"#60a5fa"),j.addColorStop(1,"#1558c0"),c.fillStyle=j,c.fillRect(0,0,o,16);const It=200,ot=40,ft=60;c.fillStyle="rgba(37, 99, 235, 0.4)",gt(o/2-It/2,ft,It,ot,20),c.fill(),c.strokeStyle="rgba(37, 99, 235, 0.6)",c.lineWidth=1,c.stroke(),c.fillStyle="#bfdbfe",c.font="bold 16px Arial, sans-serif",c.fillText("EXCLUSIVE DEALS",o/2,ft+ot/2),c.fillStyle="#ffffff",c.font="900 "+(t==="16x9"?"70px":"56px")+" Arial, sans-serif",c.fillText(g,o/2,ft+80),c.fillStyle="#dbeafe",c.font="700 24px Arial, sans-serif",c.fillText("SPECIAL FARES AVAILABLE NOW",o/2,ft+140);const rt=A+60,Y=90,P=t==="9x16"?40:t==="1x1"?80:160,K=o-P*2;c.fillStyle="#64748b",c.font="bold 18px Arial, sans-serif",c.textAlign="left",c.fillText("DATE",P+20,rt-20),c.textAlign="center",c.fillText("SECTOR",P+K*.25,rt-20),c.fillText("AIRLINE",P+K*.45,rt-20),c.fillText("TIME",P+K*.65,rt-20),c.textAlign="right",c.fillText("FARE",P+K-20,rt-20);for(let $=0;$<v.length;$++){const C=v[$],R=1e3+$*800;if(B<R)continue;const tt=Math.min(1,(B-R)/500),Gt=20*(1-tt),et=rt+$*Y+Gt;c.globalAlpha=tt,$%2===0&&(c.fillStyle="#ffffff",gt(P,et,K,Y-10,12),c.fill()),c.fillStyle="#0f172a",c.textBaseline="middle";const Jt=C.flightDate instanceof Date?C.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():C.flightDate;c.textAlign="left",c.font="900 26px Arial, sans-serif",c.fillText(Jt,P+20,et+Y/2-5),c.font="700 22px Arial, sans-serif",c.fillStyle="#2563eb",c.textAlign="center";const Yt=L[C.sectorId]||C.sectorId;c.fillText(Yt,P+K*.25,et+Y/2-5),c.fillStyle="#0f172a";const Xt=P+K*.45,St=x(C.airlineId),Nt=St?T[St.id]:null;if(Nt&&Nt.width>0){const ht=Math.min(100,Nt.width),be=40;c.drawImage(Nt,Xt-ht/2,et+Y/2-5-be/2,ht,be)}else{c.font="700 20px Arial, sans-serif",c.textAlign="center";const ht=(St==null?void 0:St.name)||C.airlineId||"—";c.fillText(ht,Xt,et+Y/2-5)}let Ht=C.flightTime||"—";if(Ht.includes("-")){const ht=Ht.split("-");Ht=`${ht[0].trim()} - ${ht[1].trim()}`}c.font="800 22px Arial, sans-serif",c.textAlign="center",c.fillText(Ht,P+K*.65,et+Y/2-5);const ue=`₹${(C.finalRate||0).toLocaleString()}`;c.font="900 26px Arial, sans-serif",c.textAlign="right";const _e=c.measureText(ue).width,pe=P+K-20,ge=_e+40,fe=50;c.fillStyle="#0f172a",gt(pe-ge,et+Y/2-5-fe/2,ge,fe,12),c.fill(),c.fillStyle="#ffffff",c.fillText(ue,pe-20,et+Y/2-5),c.globalAlpha=1}const $t=1e3+v.length*800+500;if(B>$t){const $=Math.min(1,(B-$t)/500);c.globalAlpha=$;const C=100,R=l-C+20*(1-$);c.fillStyle="#ffffff",c.fillRect(0,l-C,o,C),c.fillRect(0,R,o,C),c.fillStyle="#f1f5f9",c.fillRect(0,l-C,o,2),w.complete&&w.width>0&&c.drawImage(w,P,l-C/2-24,48,48),c.fillStyle="#1e293b",c.font="900 24px Arial, sans-serif",c.textAlign="left",c.textBaseline="middle",c.fillText("Zamra Travels",P+64,l-C/2),c.font="700 20px Arial, sans-serif",c.textAlign="right",c.fillText("zamratravels.com  |  +91 98466 06739",o-P,l-C/2),c.globalAlpha=1}requestAnimationFrame(Rt)},o,l;if(t==="1x1")o=1080,l=1080;else if(t==="9x16")o=1080,l=1920;else if(t==="16x9")o=1920,l=1080;else throw new Error("Invalid ratio selected");const m=document.createElement("canvas");m.width=o,m.height=l;const c=m.getContext("2d");c.imageSmoothingEnabled=!0;let g="MULTIPLE → SECTORS";if(a!=="all"){const b=s.find(F=>F.id===a),B=b?(b.sectorFrom||"DEP").toUpperCase():"DEP",A=b?(b.sectorTo||"ARR").toUpperCase():"ARR";g=`${B} → ${A}`}const p=new Map;e.forEach(b=>{const B=b.flightDate instanceof Date?b.flightDate.getTime():b.flightDate,A=`${b.sectorId}_${b.airlineId}_${B}_${b.flightTime}`;p.has(A)?b.finalRate<p.get(A).finalRate&&p.set(A,b):p.set(A,b)});const v=Array.from(p.values()).sort((b,B)=>{let A=b.flightDate,F=B.flightDate;return A instanceof Date&&(A=A.getTime()),F instanceof Date&&(F=F.getTime()),A-F}),E={};i.forEach(b=>{b.id&&(E[b.id.trim().toLowerCase()]=b),b.code&&(E[b.code.trim().toLowerCase()]=b),b.name&&(E[b.name.trim().toLowerCase()]=b)});const x=b=>b?E[String(b).trim().toLowerCase()]:null,L={};s.forEach(b=>{L[b.id]=b.sectorCode||b.id});async function h(b){if(!b)return null;try{const B=await fetch(b);if(!B.ok)return null;const A=await B.blob(),F=URL.createObjectURL(A);return new Promise((j,It)=>{const ot=new Image;ot.onload=()=>j(ot),ot.onerror=()=>j(null),ot.src=F})}catch{return null}}const y=new Image;await new Promise(b=>{y.onload=b,y.onerror=b,y.src="/assets/img/hero-bg.webp"});const w=new Image;await new Promise(b=>{w.onload=b,w.onerror=b,w.src="/assets/img/logo.webp"});const T={},H=[...new Set(v.map(b=>b.airlineId))].map(b=>x(b)).filter(b=>b&&b.logoUrl);await Promise.all(H.map(async b=>{const B=await h(b.logoUrl);B&&(T[b.id]=B)}));const J=m.captureStream(30);let q="video/mp4";MediaRecorder.isTypeSupported(q)||(q="video/webm; codecs=h264",MediaRecorder.isTypeSupported(q)||(q="video/webm"));const _=new MediaRecorder(J,{mimeType:q}),X=[];_.ondataavailable=b=>{b.data&&b.data.size>0&&X.push(b.data)},_.start(100);const vt=1e4+v.length*1500,it=performance.now();requestAnimationFrame(Rt),_.onstop=()=>{const b=new Blob(X,{type:q}),B=URL.createObjectURL(b),A=document.createElement("a");A.href=B,A.download=`zamra-video-${t}-${Date.now()}.mp4`,A.style.display="none",document.body.appendChild(A),A.click(),setTimeout(()=>{document.body.removeChild(A),URL.revokeObjectURL(B)},100),window.toast&&window.toast("success","Video Generated",`Your ${t} video has been downloaded!`),d()},_.onerror=b=>{console.error("Recorder Error:",b),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),r(b)}}catch(o){console.error(o),window.toast&&window.toast("error","Generation Failed",o.message),r(o)}})}let z=[],D=[],N=[],Ut=[],Zt=[],Qt=[],te=[],ee=[],ae=[],U=[],Z=[],W={},Q=new Set;function xt(t){return t==null?t:String(t).replace(/damamm/gi,e=>e===e.toUpperCase()?"DAMMAM":e===e.toLowerCase()?"dammam":"Dammam")}function Se(t={}){return{...t,sectorFrom:xt(t.sectorFrom||""),sectorTo:xt(t.sectorTo||""),sectorCode:xt(t.sectorCode||"")}}function de(t=[]){return t.map(e=>Se(e))}function S(t=""){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function M(t,e=0){const a=Number(t);return Number.isFinite(a)?a:e}const La=[5,7,10],Tt=[20,25,30,35,40];function wt(t=[],e=0){const a=Math.max(0,pt(e)),s=[...new Set(t.map(n=>Math.max(0,pt(n))))].filter(n=>n>0).sort((n,d)=>n-d);if(!s.length)return"";const i=s.includes(a)?a:s[0];return s.map(n=>`<option value="${n}" ${n===i?"selected":""}>${n} Kg</option>`).join("")}function pt(t){if(t==null||t==="")return 0;const e=parseFloat(String(t).replace(/[^\d.]/g,""));return Number.isFinite(e)?e:0}function he(t,e="—"){if(t==null||t==="")return e;const a=String(t).trim();return a?/^\d+(\.\d+)?(\s*kg)?$/i.test(a)?`${pt(a)} Kg`:a.toUpperCase():e}function kt(t){if(!t)return null;if(t instanceof Date)return Number.isNaN(t.getTime())?null:t;const e=new Date(t);return Number.isNaN(e.getTime())?null:e}function _t(t){const e=kt(t);if(!e)return"";const a=e.getTimezoneOffset();return new Date(e.getTime()-a*60*1e3).toISOString().split("T")[0]}function Be(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e}function Ta(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e.getTime()}function ka(t){if(!t)return null;const e=new Date(`${t}T23:59:59.999`);return Number.isNaN(e.getTime())?null:e.getTime()}let at={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},visas:{key:"countryName",asc:!0},visaStampings:{key:"country",asc:!0},attestations:{key:"country",asc:!0},passportServices:{key:"type",asc:!0},tours:{key:"title",asc:!0},hajjUmrah:{key:"title",asc:!0},reportFares:{key:"flightDate",asc:!0},databaseFares:{key:"flightDate",asc:!0}},Vt={agents:"",sectors:"",airlines:"",visas:"",visaStampings:"",attestations:"",passportServices:"",tours:"",hajjUmrah:""},I={agents:1,sectors:1,airlines:1,visas:1,visaStampings:1,attestations:1,passportServices:1,tours:1,hajjUmrah:1,reportFares:1,databaseFares:1},V={agents:10,sectors:25,airlines:10,visas:10,visaStampings:10,attestations:10,passportServices:10,tours:10,hajjUmrah:10,reportFares:10,databaseFares:25};const k={search:"",agentId:"all",sectorId:"all",airlineId:"all",status:"all",startDate:"",endDate:""};function dt(t,e){var d;let a=t;const s=(d=Vt[e])==null?void 0:d.toLowerCase();s&&e==="agents"?a=a.filter(r=>(r.name||"").toLowerCase().includes(s)||(r.email||"").toLowerCase().includes(s)||(r.contactPhone||"").toLowerCase().includes(s)||(r.id||"").toLowerCase().includes(s)):s&&e==="sectors"?a=a.filter(r=>(r.sectorFrom||"").toLowerCase().includes(s)||(r.sectorTo||"").toLowerCase().includes(s)||(r.sectorCode||"").toLowerCase().includes(s)):s&&e==="airlines"?a=a.filter(r=>(r.name||"").toLowerCase().includes(s)||(r.code||"").toLowerCase().includes(s)):s&&e==="visas"?a=a.filter(r=>(r.countryName||"").toLowerCase().includes(s)||(r.visaType||"").toLowerCase().includes(s)):s&&e==="visaStampings"?a=a.filter(r=>(r.country||"").toLowerCase().includes(s)||(r.description||"").toLowerCase().includes(s)):s&&e==="attestations"?a=a.filter(r=>(r.country||"").toLowerCase().includes(s)||(r.certificate||"").toLowerCase().includes(s)):s&&e==="passportServices"?a=a.filter(r=>(r.type||"").toLowerCase().includes(s)||(r.description||"").toLowerCase().includes(s)):s&&e==="tours"?a=a.filter(r=>(r.title||"").toLowerCase().includes(s)||(r.category||"").toLowerCase().includes(s)||(r.duration||"").toLowerCase().includes(s)):s&&e==="hajjUmrah"&&(a=a.filter(r=>(r.title||"").toLowerCase().includes(s)||(r.type||"").toLowerCase().includes(s)||(r.departureCity||"").toLowerCase().includes(s)||(r.airline||"").toLowerCase().includes(s)));const{key:i,asc:n}=at[e];return i&&(a=[...a].sort((r,o)=>{let l=r[i],m=o[i];if(l instanceof Date&&(l=l.getTime()),m instanceof Date&&(m=m.getTime()),i==="id"){const c=parseInt(l),g=parseInt(m);if(!isNaN(c)&&!isNaN(g))return n?c-g:g-c}return typeof l=="string"&&(l=l.toLowerCase()),typeof m=="string"&&(m=m.toLowerCase()),l<m?n?-1:1:l>m?n?1:-1:0})),a}function jt(t){document.querySelectorAll(`th[data-sort-tab="${t}"] i`).forEach(a=>{a.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const e=document.querySelector(`th[data-sort-tab="${t}"][data-sort-key="${at[t].key}"]`);if(e){const a=e.querySelector("i");a&&(a.className=`bi bi-arrow-${at[t].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",t=>{const e=t.target.closest("th[data-sort-tab]");if(!e)return;const a=e.dataset.sortTab,s=e.dataset.sortKey;at[a].key===s?at[a].asc=!at[a].asc:(at[a].key=s,at[a].asc=!0),a==="agents"?lt(!1):a==="sectors"?ct(!1):a==="airlines"?yt(!1):a==="visas"?st(!1):a==="tours"?zt(!1):a==="hajjUmrah"?Wt(!1):a==="reportFares"&&U.length?Dt(U):a==="databaseFares"&&O()});document.documentElement.style.visibility="hidden";Ve(async t=>{if(!t){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const e=document.getElementById("admin-user-name");e&&(e.textContent=t.email.split("@")[0]),await Da(),je(),await Ce()});document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("admin-logout-btn");t&&t.addEventListener("click",async()=>{(await ze()).success&&(window.location.href="/login.html")}),Fa(),Ma(),dn()});async function Da(){try{const[t,e,a,s]=await Promise.all([Ie(),oe(),re(),$e()]);z=t,D=de(e),N=a,Ut=s}catch(t){console.error("loadGlobalData error:",t)}}function Ma(){const t=document.querySelectorAll(".nav-link"),e=document.querySelectorAll(".tab-content"),a=document.getElementById("page-title");t.forEach(s=>{s.addEventListener("click",async i=>{var r;i.preventDefault(),t.forEach(o=>{o.classList.remove("active","text-primary"),o.classList.add("text-text-muted")}),s.classList.remove("text-text-muted"),s.classList.add("active","text-primary");const n=s.getAttribute("data-tab"),d=s.getAttribute("data-title");e.forEach(o=>o.classList.remove("active")),(r=document.getElementById(n))==null||r.classList.add("active"),a&&d&&(a.textContent=d),await Ce()})})}async function Ce(){const t=document.querySelector(".tab-content.active");if(!t)return;const e=t.id;e==="agents-tab"?await lt():e==="sectors-tab"?await ct():e==="flights-tab"?await yt():e==="dashboard-tab"?await ja():e==="reports-tab"?await _a():e==="database-tab"?await ce():e==="visas-tab"?await st():e==="tours-tab"?await zt():e==="hajjumrah-tab"?await Wt():e==="agent-sheets-tab"?(je(),Ft(),ut()):e==="eticket-tab"&&await fn()}function Fa(){const t=document.getElementById("admin-modal"),e=document.getElementById("modal-close-btn");e&&e.addEventListener("click",()=>t.close()),t==null||t.addEventListener("click",a=>{a.target===t&&t.close()})}function nt(t,e){const a=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=t,document.getElementById("modal-body").innerHTML=e,a.showModal()}async function ja(){var s,i,n,d,r;if(!document.getElementById("dashboard-tab"))return;const e=document.getElementById("poster-sector-sel");e&&e.options.length<=2&&D.forEach(o=>{const l=new Option(o.sectorCode,o.id);e.appendChild(l)});const a=document.getElementById("poster-generate-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",async()=>{const o=document.getElementById("poster-start-date"),l=document.getElementById("poster-end-date"),m=e==null?void 0:e.value,c=(o==null?void 0:o.value)||null,g=(l==null?void 0:l.value)||null;if(!m){f("warning","Validation Error","Please select a sector to generate the poster.");return}a.disabled=!0,a.textContent="Generating…";try{const p=await Ot({sectorId:m,startDate:c,endDate:g,includeHidden:!1});if(!p||!p.length){f("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await Ra(p,m)}catch(p){f("error","Generation Failed",p.message)}finally{a.disabled=!1,a.textContent="Generate Poster"}}),(s=document.getElementById("poster-download-jpg"))==null||s.addEventListener("click",()=>ye("jpeg")),(i=document.getElementById("poster-download-pdf"))==null||i.addEventListener("click",()=>ye("pdf")),(n=document.getElementById("poster-download-vid-1x1"))==null||n.addEventListener("click",()=>Kt("1x1")),(d=document.getElementById("poster-download-vid-9x16"))==null||d.addEventListener("click",()=>Kt("9x16")),(r=document.getElementById("poster-download-vid-16x9"))==null||r.addEventListener("click",()=>Kt("16x9")))}async function Kt(t){const e=document.getElementById("poster-sector-sel"),a=document.getElementById("poster-start-date"),s=document.getElementById("poster-end-date"),i=e==null?void 0:e.value,n=(a==null?void 0:a.value)||null,d=(s==null?void 0:s.value)||null;if(!i){f("warning","Validation Error","Please select a sector to generate the poster.");return}try{const r=await Ot({sectorId:i,startDate:n,endDate:d,includeHidden:!1});if(!r||!r.length){f("warning","No Fares","No live fares found for the selected sector and dates.");return}await Aa(t,r,i,D,N)}catch(r){console.error("Video generation failed",r)}}async function Ra(t,e){const a=document.getElementById("poster-preview-container"),s=document.getElementById("poster-fares-tbody"),i=document.getElementById("poster-sector-title");if(!a||!s||!i)return;if(e==="all")i.innerHTML='MULTIPLE <span style="color:#60a5fa;font-weight:900;">&#8594;</span> SECTORS';else{const u=D.find(x=>x.id===e),v=u?(u.sectorFrom||"DEP").toUpperCase():"DEP",E=u?(u.sectorTo||"ARR").toUpperCase():"ARR";i.innerHTML=`${v} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${E}`}const n=new Map;t.forEach(u=>{const v=u.flightDate instanceof Date?u.flightDate.getTime():u.flightDate,E=`${u.sectorId}_${u.airlineId}_${v}_${u.flightTime}`;n.has(E)?u.finalRate<n.get(E).finalRate&&n.set(E,u):n.set(E,u)});const r=Array.from(n.values()).sort((u,v)=>{let E=u.flightDate,x=v.flightDate;return E instanceof Date&&(E=E.getTime()),x instanceof Date&&(x=x.getTime()),E-x}),o={};N.forEach(u=>{u.id&&(o[u.id.trim().toLowerCase()]=u),u.code&&(o[u.code.trim().toLowerCase()]=u),u.name&&(o[u.name.trim().toLowerCase()]=u)});const l=u=>u?o[String(u).trim().toLowerCase()]:null;async function m(u){try{const v=await fetch(u);if(!v.ok)return null;const E=await v.blob();return URL.createObjectURL(E)}catch{return null}}const c=[...new Set(r.map(u=>u.airlineId))].map(u=>l(u)).filter(u=>u&&u.logoUrl),g={};await Promise.all(c.map(async u=>{const v=await m(u.logoUrl);v&&(g[u.id]=v)}));const p={};D.forEach(u=>p[u.id]=u.sectorCode),s.innerHTML=r.map((u,v)=>{const E=u.flightDate instanceof Date?u.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():u.flightDate,x=l(u.airlineId),L=v%2===0?"#ffffff":"#f8fafc",h=x?g[x.id]:null,y=h?`<img src="${h}" style="height:24px;max-width:80px;object-fit:contain;display:block;margin:0 auto;" alt="${(x==null?void 0:x.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:13px;white-space:nowrap;">${(x==null?void 0:x.name)||u.airlineId||"—"}</span>`,w=`<span style="font-weight:700;color:#2563eb;background-color:rgba(37,99,235,0.1);padding:4px 8px;border-radius:6px;font-size:12px;text-align:center;white-space:nowrap;">${p[u.sectorId]||u.sectorId}</span>`;let T='<span style="color:#94a3b8;font-size:13px;">—</span>';if(u.flightTime){const H=u.flightTime.split("-").map(J=>J.trim());H.length>=2?T=`<span style="font-weight:700;font-size:13px;color:#0f172a;white-space:nowrap;">${H[0]} - ${H[1]}</span>`:T=`<span style="font-weight:700;font-size:13px;color:#0f172a;white-space:nowrap;">${u.flightTime}</span>`}return`
      <tr style="background-color:${L};border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 8px;font-weight:700;color:#0f172a;font-size:13px;white-space:nowrap;">${E}</td>
        <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${w}</td>
        <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${y}</td>
        <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${T}</td>
        <td style="padding:10px 8px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;color:#0f172a;font-weight:900;font-size:15px;">
            &#8377;${(u.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),a.classList.remove("hidden"),a.classList.add("flex")}function Ae(t){if(!t||t.nodeType!==1)return;const e=window.getComputedStyle(t),a=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const s of a){const i=e.getPropertyValue(s);if(i&&!i.startsWith("rgb")&&!i.startsWith("#")&&i!=="transparent"&&i!=="initial")try{t.style[s]=i}catch{}}for(const s of t.children)Ae(s)}async function ye(t){const e=document.getElementById("poster-render-frame");if(!e)return;const a=document.getElementById("poster-download-jpg"),s=document.getElementById("poster-download-pdf");a&&(a.disabled=!0),s&&(s.disabled=!0);const i=e.style.transform;e.style.transform="none",f("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(e.querySelectorAll("img")).map(r=>r.complete?Promise.resolve():new Promise(o=>{r.onload=o,r.onerror=o})));const n=await html2canvas(e,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:r=>{const o=r.getElementById("poster-render-frame");o&&Ae(o)}});e.style.transform=i;const d=n.toDataURL("image/jpeg",.95);if(t==="jpeg"){const r=document.createElement("a");r.download=`zamra-poster-${Date.now()}.jpg`,r.href=d,r.click(),f("success","Downloaded!","JPEG poster saved successfully.")}else if(t==="pdf"){const r=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!r)throw new Error("jsPDF library not loaded.");const o=96/25.4,l=n.width/2/o,m=n.height/2/o,c=new r({orientation:l>m?"landscape":"portrait",unit:"mm",format:[l,m]});c.addImage(d,"JPEG",0,0,l,m),c.save(`zamra-poster-${Date.now()}.pdf`),f("success","Downloaded!","PDF poster saved successfully.")}}catch(n){console.error("Poster export error:",n),e.style.transform=i,f("error","Export Failed",n.message||"There was an error generating the export.")}finally{a&&(a.disabled=!1),s&&(s.disabled=!1)}}function Dt(t){const e=document.getElementById("report-fares-results");if(!e)return;if(!t||!t.length){e.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-inbox"></i>
        </div>
        <p class="admin-empty-state-title">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const a=Object.fromEntries(z.map(p=>[p.id,p.name])),s=Object.fromEntries(D.map(p=>[p.id,p.sectorCode])),i=Object.fromEntries(N.map(p=>[p.id,p.code])),{key:n,asc:d}=at.reportFares,r=[...t].sort((p,u)=>{let v=p[n],E=u[n];return v instanceof Date&&(v=v.getTime()),E instanceof Date&&(E=E.getTime()),typeof v=="string"&&(v=v.toLowerCase()),typeof E=="string"&&(E=E.toLowerCase()),v<E?d?-1:1:v>E?d?1:-1:0}),o=V.reportFares,l=Math.max(1,Math.ceil(t.length/o));I.reportFares>l&&(I.reportFares=l);const m=(I.reportFares-1)*o,c=r.slice(m,m+o),g=(p,u)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${p}">${u} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;e.innerHTML=`
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
          ${c.map((p,u)=>{const v=p.flightDate instanceof Date?p.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):p.flightDate||"—";return`<tr class="${u%2===1?"bg-slate-50/60":""} hover:bg-slate-100/80 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${v}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${p.flightTime||"—"}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${s[p.sectorId]||p.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${i[p.airlineId]||p.airlineId}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${a[p.agentId]||p.agentId}</td>
              <td class="whitespace-nowrap text-[13px] text-text-muted">₹${(p.specialRate||0).toLocaleString()}</td>
              <td class="whitespace-nowrap font-black text-navy text-[14px]">₹${(p.finalRate||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px] text-text-muted" id="comm-${p.id}">₹${(p.commission||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px]">${p.baggage?p.baggage+" kg":"—"}</td>
              <td class="whitespace-nowrap text-[12px]">${p.extraBaggage?p.extraBaggage+" kg":"—"}</td>
              <td class="whitespace-nowrap">
                <span class="admin-status-pill ${p.isHidden?"admin-status-hidden":"admin-status-live"}">
                  ${p.isHidden?"● Hidden":"● Live"}
                </span>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  <button onclick="window.__toggleFare('${p.id}', ${!p.isHidden})"
                    class="admin-action-btn ${p.isHidden?"admin-action-show":"admin-action-toggle"}">
                    <i class="bi ${p.isHidden?"bi-eye":"bi-eye-slash"}"></i>${p.isHidden?"Show":"Hide"}
                  </button>
                  <button onclick="window.__deleteFare('${p.id}')"
                    class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Del</button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,Et("reportFares",t.length,l,m,o),window.__deleteFare=async p=>{if(confirm("Delete this fare?"))try{await ie(p),U=U.filter(u=>u.id!==p),f("success","Deleted","Fare removed."),Dt(U)}catch(u){f("error","Error",u.message)}},window.__toggleFare=async(p,u)=>{try{await Ee(p,{isHidden:u}),U=U.map(v=>v.id===p?{...v,isHidden:u}:v),f("success","Updated",`Fare ${u?"hidden":"shown"}.`),Dt(U)}catch(v){f("error","Error",v.message)}},jt("reportFares")}async function lt(t=!0){t&&(z=await Ie(),I.agents=1);const e=document.querySelector("#agents-tab .admin-table tbody");if(!e)return;const a=document.getElementById("agents-search"),s=document.getElementById("agents-limit");a&&!a.dataset.wired&&(a.dataset.wired="1",s&&(s.dataset.wired="1"),a.addEventListener("input",m=>{Vt.agents=m.target.value,I.agents=1,lt(!1)}),s&&s.addEventListener("change",m=>{V.agents=parseInt(m.target.value),I.agents=1,lt(!1)}));const i=dt(z,"agents"),n=V.agents,d=Math.max(1,Math.ceil(i.length/n));I.agents>d&&(I.agents=d);const r=(I.agents-1)*n,o=i.slice(r,r+n);e.innerHTML=o.length?o.map(m=>Na(m)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',Et("agents",i.length,d,r,n),delete e.dataset.actionsWired,Ha();const l=document.getElementById("agents-add-btn");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>Le(null))),jt("agents")}function Na(t){const e=t.isActive!==!1?'<span class="admin-status-pill admin-status-active">Active</span>':'<span class="admin-status-pill admin-status-inactive">Hidden</span>',a=t.commission!==void 0?`₹${Number(t.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${t.id}">
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
  </tr>`}function Ha(){const t=document.querySelector("#agents-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const s=a.dataset.action,i=a.dataset.id,n=z.find(d=>d.id===i);if(s==="edit-agent"&&Le(n),s==="delete-agent"){if(!confirm(`Delete agent "${n==null?void 0:n.name}"? This does NOT delete their fares.`))return;try{await We(i),f("success","Deleted",`Agent "${n==null?void 0:n.name}" removed.`),await lt()}catch(d){f("error","Error",d.message)}}if(s==="toggle-agent"){const r=!(a.dataset.active==="true");a.disabled=!0,a.textContent="Working…";try{const o=await Ge(i,r);f("success",r?"Agent Shown":"Agent Hidden",o.message),await lt()}catch(o){f("error","Toggle Failed",o.message),await lt()}}}))}function Et(t,e,a,s,i){const n=document.getElementById(`${t}-pagination-footer`);if(!n)return;const d=Math.min(s+i,e),r=I[t];n.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${e?s+1:0} to ${d} of ${e} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${r<=1?"disabled":""}>Previous</button>
        ${Array.from({length:a},(o,l)=>l+1).map(o=>`<button data-pg-action="goto" data-pg="${o}" class="admin-pagination-btn ${o===r?"admin-pagination-btn-active":""}">${o}</button>`).join("")}
        <button data-pg-action="next" class="admin-pagination-btn" ${r>=a?"disabled":""}>Next</button>
      </div>
    </div>`,n.dataset.wired||(n.dataset.wired="1",n.addEventListener("click",o=>{const l=o.target.closest("[data-pg-action]");if(!l||l.disabled)return;const m=l.dataset.pgAction;m==="prev"?I[t]=Math.max(1,I[t]-1):m==="next"?I[t]++:m==="goto"&&(I[t]=parseInt(l.dataset.pg)),t==="agents"?lt(!1):t==="sectors"?ct(!1):t==="airlines"?yt(!1):t==="reportFares"?Dt(U):t==="databaseFares"&&O()}))}function Le(t){var a,s;const e=!!t;nt(e?"Edit Agent":"Add New Agent",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("agent-form"))==null||s.addEventListener("submit",async i=>{i.preventDefault();const n=new FormData(i.target),d=Object.fromEntries(n.entries()),r=i.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{e?(await Je(t.id,d),f("success","Updated",`Agent "${d.name}" updated.`)):(await Ye(d),f("success","Added",`Agent "${d.name}" added.`)),document.getElementById("admin-modal").close(),await lt()}catch(o){f("error","Save Failed",o.message),r.disabled=!1,r.textContent=e?"Save Changes":"Add Agent"}})}async function ct(t=!0){t&&(D=de(await oe()),I.sectors=1);const e=document.getElementById("sectors-search"),a=document.getElementById("sectors-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{Vt.sectors=m.target.value,I.sectors=1,ct(!1)}),a.addEventListener("change",m=>{V.sectors=parseInt(m.target.value),I.sectors=1,ct(!1)}));const s=document.querySelector("#sectors-tab .admin-table tbody");if(!s)return;const i=dt(D,"sectors"),n=V.sectors,d=Math.max(1,Math.ceil(i.length/n));I.sectors>d&&(I.sectors=d);const r=(I.sectors-1)*n,o=i.slice(r,r+n);s.innerHTML=o.length?o.map(m=>Pa(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',Et("sectors",i.length,d,r,n),Ua();const l=document.querySelector("#sectors-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>Te(null))),jt("sectors")}function Pa(t){const e=Se(t);return`<tr data-sector-id="${t.id}">
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
  </tr>`}function Ua(){const t=document.querySelector("#sectors-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=D.find(d=>d.id===i);if(s==="edit-sector"&&Te(n),s==="delete-sector"){if(!confirm(`Delete sector "${n==null?void 0:n.sectorCode}"?`))return;try{await Xe(i),f("success","Deleted",`Sector "${n==null?void 0:n.sectorCode}" removed.`),await ct()}catch(d){f("error","Error",d.message)}}if(s==="toggle-sector"){const r=!(a.dataset.hidden==="true");a.disabled=!0,a.textContent="Working…";try{const o=await Ke(i,r);f("success",`Sector Fares ${r?"Hidden":"Shown"}`,o.message),await ct()}catch(o){f("error","Toggle Failed",o.message),await ct()}}}))}function Te(t){var a,s;const e=!!t;nt(e?"Edit Sector":"Add New Sector",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("sector-form"))==null||s.addEventListener("submit",async i=>{i.preventDefault();const n=new FormData(i.target),d=Object.fromEntries(n.entries());d.sectorCode=xt(d.sectorCode.toUpperCase()),d.sectorFrom=xt(d.sectorFrom.toUpperCase()),d.sectorTo=xt(d.sectorTo.toUpperCase());const r=i.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{e?(await Ze(t.id,d),f("success","Updated","Sector updated.")):(await Qe(d),f("success","Added",`Sector "${d.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await ct()}catch(o){f("error","Save Failed",o.message),r.disabled=!1,r.textContent=e?"Save Changes":"Add Sector"}})}async function yt(t=!0){t&&(N=await re(),I.airlines=1);const e=document.getElementById("airlines-search"),a=document.getElementById("airlines-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{Vt.airlines=m.target.value,I.airlines=1,yt(!1)}),a.addEventListener("change",m=>{V.airlines=parseInt(m.target.value),I.airlines=1,yt(!1)}));const s=document.querySelector("#flights-tab .admin-table tbody");if(!s)return;const i=dt(N,"airlines"),n=V.airlines,d=Math.max(1,Math.ceil(i.length/n));I.airlines>d&&(I.airlines=d);const r=(I.airlines-1)*n,o=i.slice(r,r+n);s.innerHTML=o.length?o.map(m=>qa(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "Add Airline".</td></tr>',Et("airlines",i.length,d,r,n),Oa();const l=document.querySelector("#flights-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>ke(null))),jt("airlines")}function qa(t){const e=t.logoUrl?`<span class="admin-logo-wrap"><img src="${t.logoUrl}" alt="${S(t.name||"Airline")}"></span>`:`<span class="admin-logo-wrap"><span class="admin-logo-fallback">${S((t.code||"NA").slice(0,3))}</span></span>`;return`<tr data-airline-id="${t.id}">
    <td>${e}</td>
    <td class="font-semibold">${t.name}</td>
    <td><span class="font-mono font-bold text-primary">${t.code}</span></td>
    <td>
      <div class="flex gap-1 items-center">
        <button data-action="edit-airline" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-airline" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Oa(){const t=document.querySelector("#flights-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=N.find(d=>d.id===i);if(s==="edit-airline"&&ke(n),s==="delete-airline"){if(!confirm(`Delete airline "${n==null?void 0:n.name}" (${n==null?void 0:n.code})?`))return;try{await ta(i),f("success","Deleted",`Airline "${n==null?void 0:n.name}" removed.`),await yt()}catch(d){f("error","Error",d.message)}}}))}function ke(t){var a,s;const e=!!t;nt(e?"Edit Airline":"Add New Airline",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("airline-form"))==null||s.addEventListener("submit",async i=>{var l;i.preventDefault();const n=new FormData(i.target),d=((l=n.get("logoFile"))==null?void 0:l.size)>0?n.get("logoFile"):null,r={name:n.get("name"),code:n.get("code").toUpperCase()},o=i.target.querySelector("[type=submit]");o.disabled=!0,o.textContent="Saving…";try{e?(await ea(t.id,r,d),f("success","Updated","Airline updated.")):(await aa(r,d),f("success","Added",`Airline "${r.name}" added.`)),document.getElementById("admin-modal").close(),await yt()}catch(m){f("error","Save Failed",m.message),o.disabled=!1,o.textContent=e?"Save Changes":"Add Airline"}})}async function _a(){const t=document.getElementById("reports-tab");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=document.getElementById("reports-sector-sel");e&&e.options.length<=1&&D.forEach(d=>e.appendChild(new Option(d.sectorCode,d.id)));const a=document.getElementById("reports-agent-sel");a&&a.options.length<=1&&z.forEach(d=>a.appendChild(new Option(d.name,d.id)));const s=document.getElementById("generate-report-btn"),i=document.getElementById("reports-start-date"),n=document.getElementById("reports-end-date");s&&!s.dataset.wired&&(s.dataset.wired="1",s.addEventListener("click",async()=>{const d=(e==null?void 0:e.value)||"all",r=(a==null?void 0:a.value)||"all",o=(i==null?void 0:i.value)||null,l=(n==null?void 0:n.value)||null;if(d==="all"&&!o&&!l&&r==="all"){f("warning","No Filter Selected","Select at least a sector, an agent, or a date range.");return}s.disabled=!0,s.textContent="Generating…";try{const[m,c]=await Promise.all([na(o,l,d,r),Ot({sectorId:d,agentId:r,startDate:o,endDate:l,includeHidden:!0})]);U=c,Va(m,t),I.reportFares=1,Dt(U)}catch(m){f("error","Report Failed",m.message)}finally{s.disabled=!1,s.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Va(t,e){const{agentReport:a,sectorReport:s,totalFares:i}=t,n=document.getElementById("report-stats-row");if(n){n.classList.remove("hidden");const g=(U||[]).filter(h=>!h.isHidden).length,p=(U||[]).filter(h=>h.isHidden).length,u=new Set((U||[]).map(h=>h.agentId)).size,v=(U||[]).map(h=>h.finalRate||0).filter(h=>h>0),E=v.length?Math.round(v.reduce((h,y)=>h+y,0)/v.length):0,x=(h,y)=>{const w=document.getElementById(h);w&&(w.textContent=y.toLocaleString())};x("stat-total-fares",i),x("stat-live-fares",g),x("stat-hidden-fares",p),x("stat-agents-count",u);const L=document.getElementById("stat-avg-fare");L&&(L.textContent=E>0?`₹${E.toLocaleString()}`:"—")}const d=document.getElementById("report-total-fares");d&&(d.textContent=`${i} fare${i!==1?"s":""} matched your filter`);const r=document.getElementById("bar-chart-container");r&&a.length&&za(a.slice(0,8),r);const o=document.getElementById("donut-chart-svg"),l=document.getElementById("pie-legend");o&&s.length&&Wa(s.slice(0,8),o,l);const m=document.getElementById("report-leaderboards");m&&(m.classList.remove("hidden"),Ga(a,s));const c=document.getElementById("download-report-csv");if(c){const g=c.cloneNode(!0);c.parentNode.replaceChild(g,c),g.addEventListener("click",()=>Ja(U)),U&&U.length?g.classList.remove("opacity-50","pointer-events-none"):g.classList.add("opacity-50","pointer-events-none")}f("success","Report Ready",`${i} fare${i!==1?"s":""} aggregated.`)}function za(t,e){const a=e.clientWidth||480,s=260,i={top:32,right:16,bottom:48,left:48},n=a-i.left-i.right,d=s-i.top-i.bottom,r=Math.max(...t.map(h=>h.count),1),o=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],l=4,m=Math.ceil(r/l),c=Array.from({length:l+1},(h,y)=>y*m),g=c.map(h=>{const y=i.top+d-h/(c[c.length-1]||1)*d;return`<line x1="${i.left}" y1="${y.toFixed(1)}" x2="${a-i.right}" y2="${y.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${i.left-6}" y="${(y+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${h}</text>`}).join(""),p=Math.min(48,n/t.length*.6),u=n/t.length,v=t.map((h,y)=>{const w=Math.max(4,h.count/(c[c.length-1]||1)*d),T=i.left+y*u+u/2-p/2,H=i.top+d-w,[J,q]=o[y%o.length],_=`bg${y}`,X=h.avgRate?`avg ₹${Math.round(h.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${_}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${J}"/>
              <stop offset="100%" stop-color="${q}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${h.name}" data-count="${h.count}" data-avg="${X}" style="cursor:pointer;">
              <rect x="${T.toFixed(1)}" y="${H.toFixed(1)}" width="${p}" height="${w.toFixed(1)}"
                rx="6" fill="url(#${_})" opacity="0.92"
                style="transform-origin:${(T+p/2).toFixed(1)}px ${(i.top+d).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${y*.07}s both;"/>
              <text x="${(T+p/2).toFixed(1)}" y="${(H-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${q}">${h.count}</text>
              <text x="${(T+p/2).toFixed(1)}" y="${(i.top+d+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(h.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),E="bar-tooltip";e.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${E}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${s}" viewBox="0 0 ${a} ${s}" style="overflow:visible;">
      ${g}
      <line x1="${i.left}" y1="${i.top}" x2="${i.left}" y2="${i.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${i.left}" y1="${i.top+d}" x2="${a-i.right}" y2="${i.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${v}
    </svg>`;const x=e.querySelector("#bar-svg"),L=e.querySelector(`#${E}`);x&&L&&x.querySelectorAll(".bar-group").forEach(h=>{h.addEventListener("mousemove",y=>{const w=e.getBoundingClientRect();L.style.display="block",L.style.left=y.clientX-w.left+12+"px",L.style.top=y.clientY-w.top-40+"px";const T=h.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${h.dataset.avg}</span>`:"";L.innerHTML=`${h.dataset.name}<br><span style="color:#60a5fa;">${h.dataset.count} fares</span>${T}`}),h.addEventListener("mouseleave",()=>{L.style.display="none"})})}function Wa(t,e,a){const s=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],o=t.reduce((h,y)=>h+y.count,0),l=e.getElementById?e.getElementById("donut-segments"):e.querySelector("#donut-segments"),m=e.querySelector("#donut-center-count"),c=e.querySelector("#donut-center-label");if(!l)return;m&&(m.textContent=o),c&&(c.textContent="FARES");const g=(h,y,w,T)=>({x:h+w*Math.cos((T-90)*Math.PI/180),y:y+w*Math.sin((T-90)*Math.PI/180)});let p=0;const u=t.map((h,y)=>{const w=o>0?h.count/o*360:0,T=p+w,H=w>180?1:0,J=g(110,110,95,p),q=g(110,110,95,T),_=g(110,110,60,p),X=g(110,110,60,T),vt=[`M ${J.x.toFixed(2)} ${J.y.toFixed(2)}`,`A 95 95 0 ${H} 1 ${q.x.toFixed(2)} ${q.y.toFixed(2)}`,`L ${X.x.toFixed(2)} ${X.y.toFixed(2)}`,`A 60 60 0 ${H} 0 ${_.x.toFixed(2)} ${_.y.toFixed(2)}`,"Z"].join(" "),it=p+w/2;p=T;const gt=o>0?(h.count/o*100).toFixed(1):"0.0";return{pathD:vt,color:s[y%s.length],name:h.name,count:h.count,pct:gt,mid:it}}),v="http://www.w3.org/2000/svg";l.innerHTML="";const E=u.map((h,y)=>{const w=document.createElementNS(v,"path");return w.setAttribute("d",h.pathD),w.setAttribute("fill",h.color),w.setAttribute("stroke","white"),w.setAttribute("stroke-width","2"),w.style.cursor="pointer",w.style.transition="transform 0.2s, filter 0.2s",w.style.transformOrigin="110px 110px",w.setAttribute("data-index",y),l.appendChild(w),w}),x=h=>{E.forEach((y,w)=>{w===h?(y.style.transform="scale(1.04)",y.style.filter="brightness(1.1)",y.setAttribute("stroke-width","3")):(y.style.transform="scale(1)",y.style.filter="brightness(1)",y.setAttribute("stroke-width","2"))}),h>=0&&h<u.length?(m&&(m.textContent=u[h].count),c&&(c.textContent=u[h].name.split(" ")[0].toUpperCase().slice(0,7))):(m&&(m.textContent=o),c&&(c.textContent="FARES"))};if(E.forEach((h,y)=>{h.addEventListener("mouseover",()=>{x(y),L(y)}),h.addEventListener("mouseout",()=>{x(-1),L(-1)})}),a){a.innerHTML=u.map((y,w)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${w}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${y.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${y.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${y.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${y.pct}%</span>
      </div>`).join("");const h=y=>{a.querySelectorAll(".legend-row").forEach((w,T)=>{w.style.background=T===y?"#f1f5f9":""})};window._highlightLegendRows=h,a.querySelectorAll(".legend-row").forEach((y,w)=>{y.addEventListener("mouseover",()=>{x(w),h(w)}),y.addEventListener("mouseout",()=>{x(-1),h(-1)})})}function L(h){window._highlightLegendRows&&window._highlightLegendRows(h)}}function Ga(t,e){var n,d;const a=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],s=document.getElementById("leaderboard-agents");if(s&&t.length){const r=[...t].sort((l,m)=>m.count-l.count).slice(0,5),o=r[0].count||1;s.innerHTML=r.map((l,m)=>{const c=Math.max(6,Math.round(l.count/o*100));return`<div style="display:flex;align-items:center;gap:10px;">
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
      </div>`}).join("")}const i=document.getElementById("leaderboard-sectors");if(i&&e.length){const o=[...e.filter(c=>c.avgRate>0)].sort((c,g)=>c.avgRate-g.avgRate).slice(0,5),l=((n=o[0])==null?void 0:n.avgRate)||1,m=((d=o[o.length-1])==null?void 0:d.avgRate)||1;i.innerHTML=o.map((c,g)=>{const p=m>l?Math.max(6,Math.round((c.avgRate-l)/(m-l)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${g+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${c.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(c.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${p}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function Ja(t){if(!t||!t.length){f("warning","No Data","No fares to export. Apply filters and fetch first.");return}const e=Object.fromEntries(z.map(c=>[c.id,c.name])),a=Object.fromEntries(D.map(c=>[c.id,c.sectorCode])),s=Object.fromEntries(N.map(c=>[c.id,c.code||c.name])),i=c=>`"${String(c??"").replace(/"/g,'""')}"`,n=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],d=t.map(c=>{const g=c.flightDate instanceof Date?c.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):c.flightDate||"";return[i(g),i(c.flightTime||""),i(a[c.sectorId]||c.sectorId),i(s[c.airlineId]||c.airlineId),i(e[c.agentId]||c.agentId),i(c.specialRate||0),i(c.finalRate||0),i(c.commission||0),i(c.baggage||""),i(c.extraBaggage||""),i(c.isHidden?"Hidden":"Live")].join(",")}),r=[n.map(i).join(","),...d].join(`
`),o=new Blob(["\uFEFF"+r],{type:"text/csv;charset=utf-8;"}),l=URL.createObjectURL(o),m=document.createElement("a");m.href=l,m.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(m),m.click(),document.body.removeChild(m),URL.revokeObjectURL(l),f("success","CSV Downloaded",`${t.length} fares exported.`)}function De(){return Object.keys(W).length}function Ya(){return{agentNameById:Object.fromEntries(z.map(t=>[t.id,t.name||t.id])),sectorCodeById:Object.fromEntries(D.map(t=>[t.id,t.sectorCode||`${t.sectorFrom||""} ${t.sectorTo||""}`.trim()||t.id])),airlineLabelById:Object.fromEntries(N.map(t=>[t.id,t.code?`${t.code} - ${t.name||""}`.trim():t.name||t.id]))}}function Me(t,e=0){if(!t)return e;const a=z.find(i=>i.id===t),s=Number(a==null?void 0:a.commission);return Number.isFinite(s)?Math.max(0,s):e}function Xa(t,e){return t==="specialRate"||t==="finalRate"||t==="commission"||t==="extraBaggage"?e===""?"":M(e,0):t==="baggage"?e===""?"":pt(e):t==="isHidden"?e===!0||e==="hidden"||e==="true":t==="flightTime"?String(e||"").trim():t==="flightDate"?e||"":String(e||"")}function Ka(t,e){return t==="specialRate"||t==="finalRate"||t==="extraBaggage"?M(e,0):t==="commission"?e==null||e===""?"":Math.max(0,M(e,0)):t==="baggage"?pt(e):t==="isHidden"?e===!0:t==="flightTime"?String(e||"").trim():t==="flightDate"?_t(e):String(e||"")}function ne(t){return t?t.commission!==void 0&&t.commission!==null&&t.commission!==""?Math.max(0,M(t.commission,0)):Math.max(0,M(t.finalRate,0)-M(t.specialRate,0)):0}function Mt(t,e){return Math.max(0,M(t,0)+Math.max(0,M(e,0)))}function le(t){const e=W[t.id]||{},a={...t,...e},s=ne(t);return a.flightDate=e.flightDate!==void 0?Be(e.flightDate):kt(t.flightDate),a.specialRate=M(a.specialRate,0),a.commission=e.commission!==void 0?Math.max(0,M(e.commission,0)):s,a.finalRate=Mt(a.specialRate,a.commission),a.baggage=pt(a.baggage),a.extraBaggage=M(a.extraBaggage,0),a.isHidden=a.isHidden===!0||a.isHidden==="hidden"||a.isHidden==="true",a.flightTime=String(a.flightTime||"").trim(),a.agentId=a.agentId||"",a.sectorId=a.sectorId||"",a.airlineId=a.airlineId||"",a}function Bt(){const t=De(),e=Q.size,a=document.getElementById("database-unsaved-pill");a&&(a.textContent=`Unsaved: ${t}`);const s=document.getElementById("database-save-all-btn");s&&(s.disabled=t===0);const i=document.getElementById("database-delete-selected-btn");i&&(i.disabled=e===0);const n=document.getElementById("database-selected-count");n&&(n.textContent=String(e))}function Za(){const t=document.getElementById("database-agent-filter"),e=document.getElementById("database-sector-filter"),a=document.getElementById("database-airline-filter");if(t){const s=k.agentId;t.innerHTML='<option value="all">All Agents</option>'+z.map(i=>`<option value="${S(i.id)}">${S(i.id)} · ${S(i.name||"Unnamed")}</option>`).join(""),t.value=s}if(e){const s=k.sectorId;e.innerHTML='<option value="all">All Sectors</option>'+D.map(i=>`<option value="${S(i.id)}">${S(i.sectorCode||i.id)}</option>`).join(""),e.value=s}if(a){const s=k.airlineId;a.innerHTML='<option value="all">All Airlines</option>'+N.map(i=>`<option value="${S(i.id)}">${S(i.code||"—")} · ${S(i.name||"Unnamed")}</option>`).join(""),a.value=s}}function Qa(){const t=document.getElementById("database-table-wrap");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=i=>{const n=t.querySelector(`tr[data-fare-id="${i}"]`);if(!n)return;const d=!!W[i];n.classList.toggle("admin-database-row-dirty",d);const r=n.querySelector('[data-db-action="save"]'),o=n.querySelector('[data-db-action="reset"]');r&&(r.disabled=!d),o&&(o.disabled=!d)},a=i=>{if(!i)return;const n=i.querySelector('[data-db-field="specialRate"]'),d=i.querySelector('[data-db-field="commission"]'),r=i.querySelector('[data-db-field="finalRate"]');if(!n||!d||!r)return;const o=M(n.value,0),l=Math.max(0,M(d.value,0));r.value=String(Mt(o,l))},s=i=>{const n=i.target.closest("[data-db-field]");if(!n)return;const d=n.closest("tr[data-fare-id]");if(!d)return;const r=d.dataset.fareId,o=n.dataset.dbField,l=Z.find(v=>v.id===r);if(!l||!o)return;const m=n.value,c=Xa(o,m),g=o==="commission"?ne(l):Ka(o,l[o]),p=c!==g,u={...W[r]||{}};if(p?u[o]=c:delete u[o],o==="agentId"){const v=d.querySelector('[data-db-field="commission"]'),E=Me(c,0);v&&(v.value=String(E));const x=ne(l);E!==x?u.commission=E:delete u.commission,a(d)}Object.keys(u).length?W[r]=u:delete W[r],(o==="specialRate"||o==="commission")&&a(d),e(r),Bt()};t.addEventListener("input",s),t.addEventListener("change",i=>{s(i);const n=i.target.closest("#database-select-all");if(n){t.querySelectorAll("input[data-db-select]").forEach(r=>{r.checked=n.checked;const o=r.dataset.dbSelect;o&&(n.checked?Q.add(o):Q.delete(o))}),Bt();return}const d=i.target.closest("input[data-db-select]");if(d){const r=d.dataset.dbSelect;if(!r)return;d.checked?Q.add(r):Q.delete(r),Bt()}}),t.addEventListener("click",async i=>{const n=i.target.closest("[data-db-action]");if(!n)return;const d=n.dataset.dbAction,r=n.dataset.id;if(r){if(d==="save"){n.disabled=!0,await Fe(r)||(n.disabled=!1),O();return}if(d==="share"){const o=Z.find(w=>w.id===r)||W[r]||{},l=le(o)||o,m=D.find(w=>w.id===l.sectorId)||{},g=(N.find(w=>w.id===l.airlineId)||{}).name||l.airlineId||"Unknown Airline",p=m.sectorFrom||"TBA",u=m.sectorTo||"TBA",v={day:"2-digit",month:"short",year:"numeric"};let E="TBA";if(l.flightDate){const w=l.flightDate instanceof Date?l.flightDate:new Date(l.flightDate);isNaN(w)||(E=w.toLocaleDateString("en-GB",v).replace(/,/g,""))}const x=l.flightTime&&l.flightTime.split("-")[0]?l.flightTime.split("-")[0].trim():"TBA",L=l.flightTime&&l.flightTime.includes("-")?l.flightTime.split("-")[1].trim():"TBA",h="₹"+(Number(l.finalRate)||0).toLocaleString("en-IN"),y=`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${g.toUpperCase()}*
🛫 From: *${p}*
🛬 To: *${u}*
📅 Date: *${E}*
⏰ Dep: ${x} | Arr: ${L}
💵 Price: *${h}*

Please confirm availability!`;try{await navigator.clipboard.writeText(y),f("success","Copied!","Flight details copied to clipboard.")}catch(w){f("error","Copy failed",w.message)}return}if(d==="reset"){delete W[r],O();return}if(d==="delete"){if(!confirm("Delete this fare row? This cannot be undone."))return;n.disabled=!0;try{await ie(r),Z=Z.filter(o=>o.id!==r),delete W[r],Q.delete(r),f("success","Deleted","Fare row removed."),O()}catch(o){f("error","Delete Failed",o.message),n.disabled=!1}}}})}function tn(t){if(!t||t.dataset.controlsWired)return;t.dataset.controlsWired="1";const e=document.getElementById("database-search"),a=document.getElementById("database-agent-filter"),s=document.getElementById("database-sector-filter"),i=document.getElementById("database-airline-filter"),n=document.getElementById("database-status-filter"),d=document.getElementById("database-start-date"),r=document.getElementById("database-end-date"),o=document.getElementById("database-limit"),l=document.getElementById("database-clear-filters"),m=document.getElementById("database-refresh-btn"),c=document.getElementById("database-save-all-btn"),g=document.getElementById("database-delete-selected-btn"),p=document.getElementById("database-add-row-btn");e&&e.addEventListener("input",u=>{k.search=u.target.value||"",I.databaseFares=1,O()}),a&&a.addEventListener("change",u=>{k.agentId=u.target.value||"all",I.databaseFares=1,O()}),s&&s.addEventListener("change",u=>{k.sectorId=u.target.value||"all",I.databaseFares=1,O()}),i&&i.addEventListener("change",u=>{k.airlineId=u.target.value||"all",I.databaseFares=1,O()}),n&&n.addEventListener("change",u=>{k.status=u.target.value||"all",I.databaseFares=1,O()}),d&&d.addEventListener("change",u=>{k.startDate=u.target.value||"",I.databaseFares=1,O()}),r&&r.addEventListener("change",u=>{k.endDate=u.target.value||"",I.databaseFares=1,O()}),o&&(o.value=String(V.databaseFares),o.addEventListener("change",u=>{V.databaseFares=parseInt(u.target.value,10)||20,I.databaseFares=1,O()})),l&&l.addEventListener("click",()=>{k.search="",k.agentId="all",k.sectorId="all",k.airlineId="all",k.status="all",k.startDate="",k.endDate="",e&&(e.value=""),a&&(a.value="all"),s&&(s.value="all"),i&&(i.value="all"),n&&(n.value="all"),d&&(d.value=""),r&&(r.value=""),I.databaseFares=1,O()}),m&&m.addEventListener("click",async()=>{const u=m.innerHTML;m.disabled=!0,m.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing...',await ce(!0),m.disabled=!1,m.innerHTML=u}),c&&c.addEventListener("click",an),g&&g.addEventListener("click",nn),p&&p.addEventListener("click",sn)}async function ce(t=!0){const e=document.getElementById("database-tab");if(!e)return;if(tn(e),Qa(),Za(),t||!e.dataset.loaded)try{Z=await Ot({includeHidden:!0}),W={},Q=new Set,I.databaseFares=1,e.dataset.loaded="1"}catch(s){f("error","Load Failed",s.message),Z=[]}O()}function en(){const{agentNameById:t,sectorCodeById:e,airlineLabelById:a}=Ya(),s=k.search.trim().toLowerCase(),i=Ta(k.startDate),n=ka(k.endDate),d=Z.map(l=>le(l)).filter(l=>{var g,p;if(k.agentId!=="all"&&l.agentId!==k.agentId||k.sectorId!=="all"&&l.sectorId!==k.sectorId||k.airlineId!=="all"&&l.airlineId!==k.airlineId||k.status==="live"&&l.isHidden||k.status==="hidden"&&!l.isHidden)return!1;const m=((p=(g=kt(l.flightDate))==null?void 0:g.getTime)==null?void 0:p.call(g))||null;return i!==null&&(m===null||m<i)||n!==null&&(m===null||m>n)?!1:s?[l.id,_t(l.flightDate),l.flightTime,l.specialRate,l.finalRate,l.commission,l.baggage,l.extraBaggage,l.isHidden?"hidden":"live",l.agentId,l.sectorId,l.airlineId,t[l.agentId]||"",e[l.sectorId]||"",a[l.airlineId]||""].join(" ").toLowerCase().includes(s):!0}),{key:r,asc:o}=at.databaseFares;return d.sort((l,m)=>{const c=u=>{var v,E;return r==="agentId"?(t[u.agentId]||u.agentId||"").toLowerCase():r==="sectorId"?(e[u.sectorId]||u.sectorId||"").toLowerCase():r==="airlineId"?(a[u.airlineId]||u.airlineId||"").toLowerCase():r==="flightDate"?((E=(v=kt(u.flightDate))==null?void 0:v.getTime)==null?void 0:E.call(v))||0:r==="isHidden"?u.isHidden?1:0:u[r]};let g=c(l),p=c(m);return typeof g=="string"&&(g=g.toLowerCase()),typeof p=="string"&&(p=p.toLowerCase()),g<p?o?-1:1:g>p?o?1:-1:0})}function O(){const t=document.getElementById("database-table-wrap");if(!t)return;const e=en(),a=document.getElementById("database-total-count");a&&(a.textContent=e.length.toLocaleString());const s=V.databaseFares,i=Math.max(1,Math.ceil(e.length/s));I.databaseFares>i&&(I.databaseFares=i);const n=(I.databaseFares-1)*s,d=e.slice(n,n+s);if(!d.length){t.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-database"></i>
        </div>
        <p class="admin-empty-state-title">No fares matched your filter</p>
      </div>
    </div>`,Et("databaseFares",e.length,i,n,s),Bt();return}const r=(g,p)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="databaseFares" data-sort-key="${g}">
      ${p} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i>
    </th>`,o=g=>z.map(p=>`<option value="${S(p.id)}" ${p.id===g?"selected":""}>${S(p.id)} · ${S(p.name||"Unnamed")}</option>`).join(""),l=g=>D.map(p=>`<option value="${S(p.id)}" ${p.id===g?"selected":""}>${S(p.sectorCode||p.id)}</option>`).join(""),m=g=>N.map(p=>`<option value="${S(p.id)}" ${p.id===g?"selected":""}>${S(p.code||"—")} · ${S(p.name||"Unnamed")}</option>`).join(""),c=d.length>0&&d.every(g=>Q.has(g.id));t.innerHTML=`
    <table class="admin-database-table">
      <thead>
        <tr>
          <th class="w-[36px] text-center"><input id="database-select-all" type="checkbox" ${c?"checked":""}></th>
          <th class="w-[56px]">#</th>
          ${r("agentId","Agent")}
          ${r("sectorId","Sector Code")}
          ${r("flightDate","Date")}
          ${r("flightTime","Time")}
          ${r("airlineId","Flight Code")}
          ${r("baggage","Baggage")}
          ${r("extraBaggage","Extra Baggage")}
          ${r("specialRate","SP Rate")}
          ${r("commission","Commission")}
          ${r("finalRate","Rate")}
          ${r("isHidden","Status")}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${d.map((g,p)=>{const u=!!W[g.id],v=Q.has(g.id);return`
            <tr data-fare-id="${g.id}" class="${u?"admin-database-row-dirty":""}">
              <td class="text-center">
                <input type="checkbox" data-db-select="${g.id}" ${v?"checked":""}>
              </td>
              <td class="font-mono text-[11px] text-text-soft">${n+p+1}</td>
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
                <input type="date" data-db-field="flightDate" class="db-cell-input" value="${_t(g.flightDate)}">
              </td>
              <td>
                <input type="text" data-db-field="flightTime" class="db-cell-input min-w-[128px]" value="${S(g.flightTime||"")}" placeholder="04:05 - 11:10">
              </td>
              <td>
                <select data-db-field="airlineId" class="db-cell-select min-w-[170px]">
                  <option value="">No Airline</option>
                  ${m(g.airlineId)}
                </select>
              </td>
              <td>
                <select data-db-field="baggage" class="db-cell-select min-w-[110px]">
                  ${wt(Tt,pt(g.baggage))}
                </select>
              </td>
              <td>
                <select data-db-field="extraBaggage" class="db-cell-select min-w-[110px]">
                  ${wt(Tt,M(g.extraBaggage,0))}
                </select>
              </td>
              <td>
                <input type="number" data-db-field="specialRate" class="db-cell-input db-cell-num" value="${M(g.specialRate,0)}" min="0" step="1">
              </td>
              <td>
                <input type="number" data-db-field="commission" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${M(g.commission,0)}" min="0" step="1" readonly tabindex="-1">
              </td>
              <td>
                <input type="number" data-db-field="finalRate" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${M(g.finalRate,0)}" min="0" step="1" readonly tabindex="-1">
              </td>
              <td>
                <select data-db-field="isHidden" class="db-cell-select min-w-[94px]">
                  <option value="live" ${g.isHidden?"":"selected"}>Live</option>
                  <option value="hidden" ${g.isHidden?"selected":""}>Hidden</option>
                </select>
              </td>
              <td>
                <div class="flex gap-1">
                  <button data-db-action="save" data-id="${g.id}" class="admin-action-btn admin-action-edit" ${u?"":"disabled"}><i class="bi bi-check2-circle"></i>Save</button>
                  <button data-db-action="share" data-id="${g.id}" class="admin-action-btn admin-action-show"><i class="bi bi-box-arrow-up"></i>Share</button>
                  <button data-db-action="reset" data-id="${g.id}" class="admin-action-btn admin-action-toggle" ${u?"":"disabled"}><i class="bi bi-arrow-counterclockwise"></i>Reset</button>
                  <button data-db-action="delete" data-id="${g.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
                </div>
              </td>
            </tr>
          `}).join("")}
      </tbody>
    </table>
  `,Et("databaseFares",e.length,i,n,s),jt("databaseFares"),Bt()}async function Fe(t,{silent:e=!1}={}){const a=Z.find(m=>m.id===t);if(!a)return!1;if(!W[t])return!0;const i=le(a),n=kt(i.flightDate);if(!i.agentId)return e||f("warning","Missing Agent","Please select an agent before saving."),!1;if(!i.sectorId)return e||f("warning","Missing Sector","Please select a sector before saving."),!1;if(!n)return e||f("warning","Missing Date","Please set a valid flight date before saving."),!1;const d=M(i.specialRate,0),r=Math.max(0,M(i.commission,0)),o=Mt(d,r),l={agentId:i.agentId,sectorId:i.sectorId,airlineId:i.airlineId||"",flightDate:n,flightTime:i.flightTime||"",specialRate:d,finalRate:o,commission:r,baggage:pt(i.baggage),extraBaggage:M(i.extraBaggage,0),isHidden:i.isHidden===!0};try{return await Ee(t,l),Z=Z.map(m=>m.id===t?{...m,...l}:m),delete W[t],e||f("success","Saved","Fare row updated."),!0}catch(m){return e||f("error","Save Failed",m.message),!1}}async function an(){const t=Object.keys(W);if(!t.length)return;const e=document.getElementById("database-save-all-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Saving...');let s=0,i=0;for(const n of t)await Fe(n,{silent:!0})?s+=1:i+=1;O(),e&&(e.disabled=De()===0,e.innerHTML=a||"Save All"),i===0?f("success","Saved",`${s} row${s!==1?"s":""} updated.`):f("warning","Partial Save",`${s} saved, ${i} failed. Fix invalid rows and retry.`)}async function nn(){const t=Array.from(Q);if(!t.length||!confirm(`Delete ${t.length} selected fare row${t.length!==1?"s":""}? This cannot be undone.`))return;const e=document.getElementById("database-delete-selected-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Deleting...');const s=await Promise.allSettled(t.map(d=>ie(d))),i=[];let n=0;if(s.forEach((d,r)=>{d.status==="fulfilled"?i.push(t[r]):n+=1}),i.length){const d=new Set(i);Z=Z.filter(r=>!d.has(r.id)),i.forEach(r=>{delete W[r],Q.delete(r)})}O(),e&&(e.innerHTML=a||"Delete Selected"),n===0?f("success","Deleted",`${i.length} row${i.length!==1?"s":""} deleted.`):f("warning","Partial Delete",`${i.length} deleted, ${n} failed.`)}function sn(){const t=_t(new Date);nt("Add Fare Row",`
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
            ${z.map(o=>`<option value="${S(o.id)}">${S(o.id)} · ${S(o.name||"Unnamed")}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Sector *</label>
          <select id="db-add-sector" class="admin-control h-10" required>
            <option value="">Select Sector</option>
            ${D.map(o=>`<option value="${S(o.id)}">${S(o.sectorCode||o.id)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Airline</label>
          <select id="db-add-airline" class="admin-control h-10">
            <option value="">No Airline</option>
            ${N.map(o=>`<option value="${S(o.id)}">${S(o.code||"—")} · ${S(o.name||"Unnamed")}</option>`).join("")}
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
            ${wt(Tt,30)}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Extra Baggage (kg)</label>
          <select id="db-add-exbag" class="admin-control h-10">
            ${wt(Tt,20)}
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
  `);const e=document.getElementById("database-add-form");if(!e)return;const a=document.getElementById("db-add-sp"),s=document.getElementById("db-add-comm"),i=document.getElementById("db-add-rate"),n=document.getElementById("db-add-agent"),d=()=>{if(!i)return;const o=M(a==null?void 0:a.value,0),l=Math.max(0,M(s==null?void 0:s.value,0));i.value=String(Mt(o,l))},r=()=>{if(!s)return;const o=Me(n==null?void 0:n.value,0);s.value=String(o),d()};a==null||a.addEventListener("input",d),n==null||n.addEventListener("change",r),r(),d(),e.addEventListener("submit",async o=>{var c,g,p,u,v,E,x,L,h,y,w,T;o.preventDefault();const l=e.querySelector('button[type="submit"]'),m=(l==null?void 0:l.textContent)||"Add Fare";l&&(l.disabled=!0,l.textContent="Adding...");try{const H=((c=document.getElementById("db-add-date"))==null?void 0:c.value)||"",J=Be(H);if(!J)throw new Error("Please provide a valid flight date.");const q=M((g=document.getElementById("db-add-sp"))==null?void 0:g.value,0),_=Math.max(0,M((p=document.getElementById("db-add-comm"))==null?void 0:p.value,0)),X=Mt(q,_);await Ca({agentId:((u=document.getElementById("db-add-agent"))==null?void 0:u.value)||"",sectorId:((v=document.getElementById("db-add-sector"))==null?void 0:v.value)||"",airlineId:((E=document.getElementById("db-add-airline"))==null?void 0:E.value)||"",flightDate:J,flightTime:((L=(x=document.getElementById("db-add-time"))==null?void 0:x.value)==null?void 0:L.trim())||"",specialRate:q,finalRate:X,commission:_,baggage:pt((h=document.getElementById("db-add-bag"))==null?void 0:h.value),extraBaggage:M((y=document.getElementById("db-add-exbag"))==null?void 0:y.value,0),isHidden:(((w=document.getElementById("db-add-status"))==null?void 0:w.value)||"live")==="hidden"}),(T=document.getElementById("admin-modal"))==null||T.close(),await ce(!0),f("success","Added","New fare row added.")}catch(H){f("error","Add Failed",H.message),l&&(l.disabled=!1,l.textContent=m)}})}const on="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",rn={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},ve=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let G=null,mt=JSON.parse(localStorage.getItem("zt_hist")||"[]"),me=mt.reduce((t,e)=>t+(e.rows||0),0);function dn(){var e,a,s,i;const t=document.getElementById("rateData");t&&t.addEventListener("input",function(){const n=this.value.length,d=document.getElementById("charCount");d&&(d.textContent=n.toLocaleString()+" character"+(n!==1?"s":"")),ut(),clearTimeout(window._previewTimer),n>15?window._previewTimer=setTimeout(()=>cn(this.value),500):qt()}),(e=document.getElementById("resetBtn"))==null||e.addEventListener("click",()=>{t&&(t.value="");const n=document.getElementById("charCount");n&&(n.textContent="0 characters"),qt(),ut()}),(a=document.getElementById("clearBtn"))==null||a.addEventListener("click",()=>{mt=[],me=0,Pt(),Ct(),se()}),(s=document.getElementById("manualAgent"))==null||s.addEventListener("input",function(){const n=parseInt(this.value);G=n>0?String(n):null,document.querySelectorAll(".rp-chip").forEach(d=>d.classList.remove("on")),Ft(),ut()}),(i=document.getElementById("submitBtn"))==null||i.addEventListener("click",mn),se(),Ct()}function je(){const t=document.getElementById("chipGrid");if(!t)return;t.innerHTML="";const e=z.length?[...z].sort((a,s)=>{const i=parseInt(a.id),n=parseInt(s.id);return!isNaN(i)&&!isNaN(n)?i-n:a.id.localeCompare(s.id)}):[];if(!e.length){G=null,t.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>',Ft(),ut();return}G&&!e.some(a=>a.id===G)&&(G=null),e.forEach(a=>{const s=document.createElement("div");s.className="rp-chip",s.dataset.agentId=a.id,s.textContent=a.id,a.id===G&&s.classList.add("on"),s.addEventListener("click",()=>ln(a.id,a.name,s)),t.appendChild(s)}),Ft(),ut()}function ln(t,e,a){G=t,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(s=>{s.classList.remove("on")}),a&&a.classList.add("on"),Ft(),ut()}function Ft(){const t=document.getElementById("agentPill");if(t)if(G){const e=z.find(a=>a.id===G);t.textContent=`Agent ${(e==null?void 0:e.id)||G} selected ✓`,t.classList.remove("empty")}else t.textContent="Select an agent to continue",t.classList.add("empty")}function ut(){const t=document.getElementById("rateData"),e=document.getElementById("submitBtn");e&&(e.disabled=!(G&&t&&t.value.trim().length>10))}function Re(t){const e=[];let a=null,s="IX";for(const i of t.split(`
`)){const n=i.replace(/[*_~`]/g,"").trim();if(!n)continue;const d=n.match(/([A-Z]{3})\s+([A-Z]{3})/);if(d&&n.length<70&&!n.match(/\d{4,6}/)){a=d[1]+"-"+d[2];const r=n.match(ve);r&&(s=r[1]);continue}if(a){const r=n.match(ve);if(r&&!n.match(/\d{4,6}/)){s=r[1];continue}const o=n.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(o){const l=parseInt(o[3]);l>=1e3&&l<=99999&&e.push({sector:a,date:`2026-${rn[o[2].toUpperCase()]}-${o[1].padStart(2,"0")}`,airline:r?r[1]:s,rate:l})}}}return e}function cn(t){const e=Re(t);if(!e.length){qt();return}const a=document.getElementById("prevBox");a&&a.classList.add("on");const s=document.getElementById("prevCount");s&&(s.textContent=e.length+" entr"+(e.length===1?"y":"ies"));const i=document.getElementById("prevBody");i&&(i.innerHTML=e.slice(0,60).map(n=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${n.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${n.rate.toLocaleString()}</td></tr>`).join(""),e.length>60&&(i.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${e.length-60} more</td></tr>`))}function qt(){var t;(t=document.getElementById("prevBox"))==null||t.classList.remove("on")}async function mn(){const t=document.getElementById("rateData");if(!G||!(t!=null&&t.value.trim()))return;const e=document.getElementById("submitBtn"),a=e.innerHTML;e.disabled=!0,e.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI pipeline...';const s=document.getElementById("progBar"),i=document.getElementById("progFill");s&&s.classList.add("on");let n=0;const d=setInterval(()=>{n=Math.min(n+Math.random()*13,85),i&&(i.style.width=n+"%")},280),r=Re(t.value),o={id:Date.now(),agent:G,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:r.length,status:"pen"};mt.unshift(o),mt.length>15&&mt.pop(),Pt(),Ct();try{const l=await fetch(on,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:G,raw_text:t.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(d),i&&(i.style.width="100%"),l.ok)o.status="ok",me+=r.length,Pt(),Ct(),se(),f("success","Submitted","Rates sent to the AI parser. Firestore will update in a moment."),setTimeout(()=>{t.value="";const m=document.getElementById("charCount");m&&(m.textContent="0 characters"),qt(),ut()},500);else throw new Error("N8N webhook rejected payload")}catch(l){clearInterval(d),i&&(i.style.width="100%"),o.status="err",Pt(),Ct(),f("error","Submission Failed",l.message)}setTimeout(()=>{s&&s.classList.remove("on"),i&&(i.style.width="0%"),e.innerHTML=a,ut()},900)}function se(){const t=document.getElementById("statSubs");t&&(t.textContent=mt.length);const e=document.getElementById("statEntries");e&&(e.textContent=me)}function Pt(){localStorage.setItem("zt_hist",JSON.stringify(mt))}function Ct(){const t=document.getElementById("historyWrap");if(t){if(!mt.length){t.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}t.innerHTML=mt.map(e=>{var s;const a=((s=z.find(i=>i.id===e.agent))==null?void 0:s.name)||`Agent ${e.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${a.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${a}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${e.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${e.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${e.status==="ok"?"bg-green-500":e.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}const un=210/25.4*96,pn=297/25.4*96;function xe(){const t=document.getElementById("eticket-output-wrapper"),e=document.getElementById("eticket-print-area");if(!t||!e||t.classList.contains("hidden"))return;e.style.zoom="1",e.style.removeProperty("--eticket-print-scale");const a=Math.max(e.scrollWidth,e.offsetWidth),s=Math.max(e.scrollHeight,e.offsetHeight);if(!a||!s)return;const i=un/a,n=pn/s;let d=Math.min(1,i,n);d<1&&(d=Math.max(.7,d*.985)),e.style.zoom=String(d),e.style.setProperty("--eticket-print-scale",String(d))}function gn(){const t=document.getElementById("eticket-print-area");t&&(t.style.zoom="1",t.style.removeProperty("--eticket-print-scale"))}async function fn(){var r;const t=document.getElementById("eticket-tab");if(!t)return;const e=document.getElementById("eticket-form"),a=document.getElementById("et-add-passenger"),s=document.getElementById("et-passengers-container"),i=document.getElementById("et-airline"),n=document.getElementById("et-origin"),d=document.getElementById("et-destination");if(N.length===0&&(N=await re()),D.length===0&&(D=de(await oe())),!t.dataset.wired){if(t.dataset.wired="1",i&&N&&(i.innerHTML='<option value="">Select Airline</option>'+N.map(l=>`<option value="${l.name}">${l.name}</option>`).join("")),n&&D){const l=[...new Set(D.map(m=>m.sectorFrom).filter(Boolean))].sort();n.innerHTML='<option value="">Select Origin</option>'+l.map(m=>`<option value="${m}">${m}</option>`).join("")}if(d&&D){const l=[...new Set(D.map(m=>m.sectorTo).filter(Boolean))].sort();d.innerHTML='<option value="">Select Destination</option>'+l.map(m=>`<option value="${m}">${m}</option>`).join("")}const o=()=>{const l=Array.from(s.querySelectorAll(".et-pax-row"));l.forEach((m,c)=>{const g=m.querySelector(".et-passenger-index");g&&(g.textContent=`Passenger ${c+1}`);const p=m.querySelector(".et-remove-passenger");p&&(l.length<=1?(p.classList.add("opacity-40","pointer-events-none"),p.setAttribute("aria-disabled","true")):(p.classList.remove("opacity-40","pointer-events-none"),p.removeAttribute("aria-disabled")))})};a==null||a.addEventListener("click",()=>{const l=`
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
                ${wt(La,7)}
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Check-in Bag</label>
              <select name="paxCheckBag[]" class="admin-control h-10">
                ${wt(Tt,30)}
              </select>
            </div>
          </div>
        </div>
      `;s.insertAdjacentHTML("beforeend",l),o()}),s==null||s.addEventListener("click",l=>{var c;const m=l.target.closest(".et-remove-passenger");m&&((c=m.closest(".et-pax-row"))==null||c.remove(),o())}),s.children.length===0&&(a==null||a.click()),o(),e==null||e.addEventListener("submit",async l=>{l.preventDefault(),await bn(new FormData(e))}),(r=document.getElementById("et-print-btn"))==null||r.addEventListener("click",()=>{xe(),requestAnimationFrame(()=>window.print())}),window.addEventListener("beforeprint",xe),window.addEventListener("afterprint",gn),e==null||e.addEventListener("reset",()=>{setTimeout(()=>{var l;Array.from(s.children).forEach((m,c)=>{c>0&&m.remove()}),s.children.length===0&&(a==null||a.click()),o(),(l=document.getElementById("eticket-output-wrapper"))==null||l.classList.add("hidden")},10),f("info","Form Reset","The E-Ticket form has been cleared.")})}}async function bn(t){var P,K,$t;const e=(P=t.get("etPnr"))==null?void 0:P.toUpperCase(),a=(K=t.get("etAirline"))==null?void 0:K.toUpperCase(),s=($t=t.get("etFlightNo"))==null?void 0:$t.toUpperCase(),i=t.get("etDate"),n=t.get("etDepTime"),d=t.get("etArrTime"),r=t.get("etPhone"),o=($="")=>String($).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),l=$=>{const C=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec($||"");return C?Number(C[1])*60+Number(C[2]):null},m=($="")=>$.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",c=$=>{const C=($||"").trim();let R=C,bt="";const tt=C.match(/^(.*?)\s*\((.*?)\)$/);return tt&&(R=tt[1].trim(),bt=tt[2].trim()),{city:R,code:bt}},g=c(t.get("etOrigin")),p=c(t.get("etDest")),u=t.get("etOrigin")||"—",v=t.get("etDest")||"—";let E="—";if(i){const $=new Date(i);if(!isNaN($.getTime())){const C=["SUN","MON","TUE","WED","THU","FRI","SAT"],R=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];E=`${C[$.getDay()]}, ${String($.getDate()).padStart(2,"0")} ${R[$.getMonth()]} ${$.getFullYear()}`}}const x=$=>document.getElementById($);let L=g.code,h=p.code,y=null;if(typeof D<"u"){if(y=D.find($=>$.sectorFrom===u&&$.sectorTo===v),!y&&u){const $=D.find(C=>C.sectorFrom===u);$&&$.sectorCode&&(L=$.sectorCode.split(/[ -]+/)[0])}if(!y&&v){const $=D.find(C=>C.sectorTo===v);$&&$.sectorCode&&(h=$.sectorCode.split(/[ -]+/).pop())}}const w=(L||m(g.city)).toUpperCase(),T=(h||m(p.city)).toUpperCase(),H=`${w} - ${T}`,J=`${(g.city||u).toUpperCase()} to ${(p.city||v).toUpperCase()}`,q=(g.city||u).toUpperCase(),_=(p.city||v).toUpperCase(),X=l(n),vt=l(d);if(X!==null&&vt!==null){let $=vt-X;$<0&&($+=24*60);const C=Math.floor($/60),R=$%60;`${C}${String(R).padStart(2,"0")}`}x("t-pnr")&&(x("t-pnr").textContent=e||"—"),x("t-issued-by")&&(x("t-issued-by").textContent=a||"—"),x("t-customer-phone")&&(x("t-customer-phone").textContent=r||"—"),x("t-flight-code")&&(x("t-flight-code").textContent=s||"—"),x("t-travel-date")&&(x("t-travel-date").textContent=E||"—"),x("t-route-code")&&(x("t-route-code").textContent=H),x("t-route-long")&&(x("t-route-long").textContent=J);const it=new Date,gt=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],Rt=`${String(it.getDate()).padStart(2,"0")} ${gt[it.getMonth()]} ${it.getFullYear()} ${String(it.getHours()).padStart(2,"0")}:${String(it.getMinutes()).padStart(2,"0")}`;x("t-booked-on")&&(x("t-booked-on").textContent=Rt);const b=x("t-airline-logo"),B=x("t-issued-by-fallback");if(b){const $=typeof N<"u"?N.find(C=>C.name.toUpperCase()===a):null;$&&$.logoUrl?(b.src=$.logoUrl,b.classList.remove("hidden"),B&&B.classList.add("hidden")):(b.removeAttribute("src"),b.classList.add("hidden"),B&&(B.classList.remove("hidden"),B.textContent=(a||"No logo").toUpperCase()))}const A=t.getAll("paxTitle[]"),F=t.getAll("paxName[]"),j=t.getAll("paxType[]"),It=t.getAll("paxCheckBag[]"),ot=t.getAll("paxCarryBag[]");x("t-pax-count")&&(x("t-pax-count").textContent=String(F.length)),x("t-top-pax-count")&&(x("t-top-pax-count").textContent=String(F.length));const ft=document.getElementById("t-passengers-tbody");if(ft){const $=F.map((C,R)=>{const bt=o((A[R]||"MR").toUpperCase()),tt=o((F[R]||"").toUpperCase()),Gt=o((j[R]||"ADT").toUpperCase()),et=o(he(It[R])),Jt=o(he(ot[R])),Yt=y&&y.sectorCode?o(y.sectorCode.toUpperCase()):o(H);return`
        <tr class="${R%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${R+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${bt}. ${tt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Gt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Yt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${o(s||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${o(e||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Jt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${et}</td>
        </tr>
      `}).join("");ft.innerHTML=$||`
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
          <div class="font-semibold uppercase">${o(q)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${o(w)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${o(n||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${o(E||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${o(_)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${o(T)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${o(d||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${o(E||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const Y=document.getElementById("eticket-output-wrapper");Y&&(Y.classList.remove("hidden"),Y.scrollIntoView({behavior:"smooth"}))}const we={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function f(t,e,a){const s=document.getElementById("toastsEl");if(!s)return;const i=document.createElement("div"),n={success:"border-emerald-200 bg-emerald-50/95 text-emerald-900",error:"border-rose-200 bg-rose-50/95 text-rose-900",warning:"border-amber-200 bg-amber-50/95 text-amber-900",info:"border-blue-200 bg-blue-50/95 text-blue-900"};i.className=`flex items-start gap-3 p-4 border rounded-xl shadow-md w-80 pointer-events-auto backdrop-blur-sm ${n[t]||n.error}`,i.innerHTML=`<div class="mt-0.5">${we[t]||we.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${e}</div><div class="text-xs opacity-90 mt-1">${a}</div></div>
    <button class="opacity-50 hover:opacity-100 transition-opacity" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,s.appendChild(i),setTimeout(()=>i.isConnected&&i.remove(),7e3)}window.toast=f;document.addEventListener("DOMContentLoaded",()=>{});async function st(t=!0){if(t)try{const[n,d,r,o]=await Promise.all([$e(),sa(),ia(),oa()]);Ut=n,Zt=d,Qt=r,te=o,I.visas=1,I.visaStampings=1,I.attestations=1,I.passportServices=1}catch(n){f("error","Error loading Visas tab data",n.message)}const e=document.querySelector("#visas-tab #visas-table-body");if(e){const n=dt(Ut,"visas"),d=V.visas,r=Math.max(1,Math.ceil(n.length/d));I.visas>r&&(I.visas=r);const o=(I.visas-1)*d,l=n.slice(o,o+d);e.innerHTML=l.length?l.map(m=>yn(m)).join(""):'<tr><td colspan="6" class="text-center py-8 text-text-muted">No tourist visas yet. Click "Add Tourist Visa".</td></tr>',vn()}const a=document.querySelector("#visa-stamping-table-body");if(a){const n=dt(Zt,"visaStampings"),d=V.visaStampings,r=Math.max(1,Math.ceil(n.length/d));I.visaStampings>r&&(I.visaStampings=r);const o=(I.visaStampings-1)*d,l=n.slice(o,o+d);a.innerHTML=l.length?l.map(m=>xn(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No visa stampings yet. Click "Add Visa Stamping".</td></tr>',wn()}const s=document.querySelector("#attestations-table-body");if(s){const n=dt(Qt,"attestations"),d=V.attestations,r=Math.max(1,Math.ceil(n.length/d));I.attestations>r&&(I.attestations=r);const o=(I.attestations-1)*d,l=n.slice(o,o+d);s.innerHTML=l.length?l.map(m=>En(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No attestations yet. Click "Add Attestation".</td></tr>',In()}const i=document.querySelector("#passport-services-table-body");if(i){const n=dt(te,"passportServices"),d=V.passportServices,r=Math.max(1,Math.ceil(n.length/d));I.passportServices>r&&(I.passportServices=r);const o=(I.passportServices-1)*d,l=n.slice(o,o+d);i.innerHTML=l.length?l.map(m=>$n(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No passport services yet. Click "Add Passport Service".</td></tr>',Sn()}hn()}function hn(){const t=document.getElementById("visas-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>Ne(null)));const e=document.getElementById("visa-stamping-add-btn");e&&!e.dataset.wired&&(e.dataset.wired="1",e.addEventListener("click",()=>He(null)));const a=document.getElementById("attestation-add-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",()=>Pe(null)));const s=document.getElementById("passport-service-add-btn");s&&!s.dataset.wired&&(s.dataset.wired="1",s.addEventListener("click",()=>Ue(null)))}function yn(t){const e=t.flagUrl?`<span class="admin-logo-wrap"><img src="${t.flagUrl}" alt="${S(t.countryName||"Country")}"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-flag"></i></span></span>';return`<tr data-visa-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy">${S(t.countryName)}</td>
    <td class="text-text-muted text-[13px]">${S(t.visaType)}</td>
    <td class="text-text-muted text-[13px]">${S(t.processingTime)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.rate||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function vn(){const t=document.querySelector("#visas-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Ut.find(d=>d.id===i);if(s==="edit-visa"&&Ne(n),s==="delete-visa"){if(!confirm(`Delete visa for "${n==null?void 0:n.countryName}"?`))return;try{await ra(i),f("success","Deleted",`Visa for "${n==null?void 0:n.countryName}" removed.`),await st()}catch(d){f("error","Error",d.message)}}}))}function Ne(t){const e=document.getElementById("modal-visa-form");if(!e)return;nt(t?"Edit Visa":"Add New Visa",e.innerHTML);const a=document.getElementById("visa-form"),s=document.getElementById("visa-id"),i=document.getElementById("visa-country"),n=document.getElementById("visa-type"),d=document.getElementById("visa-rate"),r=document.getElementById("visa-processing");t&&(s.value=t.id,i.value=t.countryName||"",n.value=t.visaType||"",d.value=t.rate||0,r.value=t.processingTime||""),a.addEventListener("submit",async o=>{o.preventDefault();const l=a.querySelector('button[type="submit"]');l.disabled=!0,l.textContent="Saving...";try{const m=s.value,c={countryName:i.value.trim(),visaType:n.value.trim(),rate:Number(d.value),processingTime:r.value.trim()},p=document.getElementById("visa-flag").files[0];m?await da(m,c,p):await la(c,p),f("success","Saved!",`Visa for ${c.countryName} saved.`),document.getElementById("admin-modal").close(),await st()}catch(m){f("error","Error",m.message),l.disabled=!1,l.textContent="Save Visa"}})}function xn(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${S(t.country)}</td>
    <td class="text-text-muted text-[13px]">${S(t.description)}</td>
    <td class="text-text-muted text-[13px]">${S(t.processingTime)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function wn(){const t=document.getElementById("visa-stamping-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Zt.find(d=>d.id===i);if(s==="edit-visa-stamping"&&He(n),s==="delete-visa-stamping"){if(!confirm(`Delete visa stamping for "${n==null?void 0:n.country}"?`))return;try{await ca(i),f("success","Deleted",`Visa Stamping for "${n==null?void 0:n.country}" removed.`),await st(!0)}catch(d){f("error","Error",d.message)}}}))}function He(t){const e=document.getElementById("modal-visa-stamping-form");if(!e)return;nt(t?"Edit Visa Stamping":"Add Visa Stamping",e.innerHTML);const a=document.getElementById("visa-stamping-form"),s=document.getElementById("visa-stamping-id"),i=document.getElementById("visa-stamping-country"),n=document.getElementById("visa-stamping-desc"),d=document.getElementById("visa-stamping-time"),r=document.getElementById("visa-stamping-cost");t&&(s.value=t.id,i.value=t.country||"",n.value=t.description||"",d.value=t.processingTime||"",r.value=t.cost||0),a.addEventListener("submit",async o=>{o.preventDefault();const l=a.querySelector('button[type="submit"]');l.disabled=!0,l.textContent="Saving...";try{const m=s.value,c={country:i.value.trim(),description:n.value.trim(),processingTime:d.value.trim(),cost:Number(r.value)};m?await ma(m,c):await ua(c),f("success","Saved!",`Visa stamping for ${c.country} saved.`),document.getElementById("admin-modal").close(),await st(!0)}catch(m){f("error","Error",m.message),l.disabled=!1,l.textContent="Save"}})}function En(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${S(t.country)}</td>
    <td class="text-text-muted text-[13px]">${S(t.certificate)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-attestation" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-attestation" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function In(){const t=document.getElementById("attestations-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Qt.find(d=>d.id===i);if(s==="edit-attestation"&&Pe(n),s==="delete-attestation"){if(!confirm(`Delete attestation for "${n==null?void 0:n.country}"?`))return;try{await pa(i),f("success","Deleted",`Attestation for "${n==null?void 0:n.country}" removed.`),await st(!0)}catch(d){f("error","Error",d.message)}}}))}function Pe(t){const e=document.getElementById("modal-attestation-form");if(!e)return;nt(t?"Edit Attestation":"Add Attestation",e.innerHTML);const a=document.getElementById("attestation-form"),s=document.getElementById("attestation-id"),i=document.getElementById("attestation-country"),n=document.getElementById("attestation-cert"),d=document.getElementById("attestation-cost");t&&(s.value=t.id,i.value=t.country||"",n.value=t.certificate||"",d.value=t.cost||0),a.addEventListener("submit",async r=>{r.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=s.value,m={country:i.value.trim(),certificate:n.value.trim(),cost:Number(d.value)};l?await ga(l,m):await fa(m),f("success","Saved!",`Attestation for ${m.country} saved.`),document.getElementById("admin-modal").close(),await st(!0)}catch(l){f("error","Error",l.message),o.disabled=!1,o.textContent="Save"}})}function $n(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${S(t.type)}</td>
    <td class="text-text-muted text-[13px]">${S(t.description)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Sn(){const t=document.getElementById("passport-services-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=te.find(d=>d.id===i);if(s==="edit-passport-service"&&Ue(n),s==="delete-passport-service"){if(!confirm(`Delete passport service "${n==null?void 0:n.type}"?`))return;try{await ba(i),f("success","Deleted",`Passport service "${n==null?void 0:n.type}" removed.`),await st(!0)}catch(d){f("error","Error",d.message)}}}))}function Ue(t){const e=document.getElementById("modal-passport-service-form");if(!e)return;nt(t?"Edit Passport Service":"Add Passport Service",e.innerHTML);const a=document.getElementById("passport-service-form"),s=document.getElementById("passport-service-id"),i=document.getElementById("passport-service-type"),n=document.getElementById("passport-service-desc"),d=document.getElementById("passport-service-cost");t&&(s.value=t.id,i.value=t.type||"",n.value=t.description||"",d.value=t.cost||0),a.addEventListener("submit",async r=>{r.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=s.value,m={type:i.value.trim(),description:n.value.trim(),cost:Number(d.value)};l?await ha(l,m):await ya(m),f("success","Saved!",`Passport service ${m.type} saved.`),document.getElementById("admin-modal").close(),await st(!0)}catch(l){f("error","Error",l.message),o.disabled=!1,o.textContent="Save"}})}async function zt(t=!0){if(t)try{ee=await va({includeInactive:!0}),I.tours=1}catch(r){f("error","Error loading Tours",r.message)}const e=document.getElementById("tours-table-body");if(!e)return;const a=dt(ee,"tours"),s=V.tours,i=Math.max(1,Math.ceil(a.length/s));I.tours>i&&(I.tours=i);const n=(I.tours-1)*s,d=a.slice(n,n+s);e.innerHTML=d.length?d.map(r=>Cn(r)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No tour packages yet. Click "Add Tour Package".</td></tr>',An(),Bn()}function Bn(){const t=document.getElementById("tours-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>qe(null)))}function Cn(t){const e=t.coverImageUrl?`<span class="admin-logo-wrap"><img src="${t.coverImageUrl}" alt="${S(t.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>',a=!t.price||t.price===0?'<span class="text-text-muted text-[12px] italic">Call for Price</span>':`<span class="font-black text-[15px] text-navy">₹${Number(t.price).toLocaleString()}</span>`,s=t.isActive!==!1?'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>':'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>';return`<tr data-tour-id="${t.id}">
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
  </tr>`}function An(){const t=document.getElementById("tours-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=ee.find(d=>d.id===i);if(s==="edit-tour"&&qe(n),s==="delete-tour"){if(!confirm(`Delete tour package "${n==null?void 0:n.title}"?`))return;try{await xa(i),f("success","Deleted",`Tour "${n==null?void 0:n.title}" removed.`),await zt()}catch(d){f("error","Error",d.message)}}}))}function At(t=""){return t.split(`
`).map(e=>e.trim()).filter(Boolean)}function Lt(t=[]){return Array.isArray(t)?t.join(`
`):""}function qe(t){var u;const e=document.getElementById("modal-tour-form");if(!e)return;nt(t?"Edit Tour Package":"Add Tour Package",e.innerHTML);const a=document.getElementById("tour-form"),s=document.getElementById("tour-id"),i=document.getElementById("tour-title"),n=document.getElementById("tour-category"),d=document.getElementById("tour-duration"),r=document.getElementById("tour-price"),o=document.getElementById("tour-active"),l=document.getElementById("tour-description"),m=document.getElementById("tour-highlights"),c=document.getElementById("tour-itinerary"),g=document.getElementById("tour-inclusions"),p=document.getElementById("tour-exclusions");t&&(s.value=t.id,i.value=t.title||"",n.value=t.category||"International",d.value=t.duration||"",r.value=t.price||0,o.checked=t.isActive!==!1,l.value=t.description||"",m.value=Lt(t.highlights),c.value=(u=t.itinerary)!=null&&u.length?JSON.stringify(t.itinerary,null,2):"",g.value=Lt(t.inclusions),p.value=Lt(t.exclusions)),a.addEventListener("submit",async v=>{var x;v.preventDefault();const E=a.querySelector('button[type="submit"]');E.disabled=!0,E.textContent="Saving…";try{const L=s.value;let h=[];const y=c.value.trim();if(y)try{h=JSON.parse(y)}catch{f("error","Invalid JSON","Itinerary must be valid JSON. Check the format."),E.disabled=!1,E.textContent="Save Tour";return}const w={title:i.value.trim(),category:n.value,duration:d.value.trim(),price:Number(r.value)||0,isActive:o.checked,description:l.value.trim(),highlights:At(m.value),itinerary:h,inclusions:At(g.value),exclusions:At(p.value)},T=((x=document.getElementById("tour-image"))==null?void 0:x.files[0])||null;L?await wa(L,w,T):await Ea(w,T),f("success","Saved!",`Tour "${w.title}" saved.`),document.getElementById("admin-modal").close(),await zt()}catch(L){f("error","Error",L.message),E.disabled=!1,E.textContent="Save Tour"}})}async function Wt(t=!0){if(t)try{ae=await Ia({includeInactive:!0}),I.hajjUmrah=1}catch(r){f("error","Error loading Hajj & Umrah",r.message)}const e=document.getElementById("hajjumrah-table-body");if(!e)return;const a=dt(ae,"hajjUmrah"),s=V.hajjUmrah,i=Math.max(1,Math.ceil(a.length/s));I.hajjUmrah>i&&(I.hajjUmrah=i);const n=(I.hajjUmrah-1)*s,d=a.slice(n,n+s);e.innerHTML=d.length?d.map(r=>Tn(r)).join(""):'<tr><td colspan="10" class="text-center py-8 text-text-muted">No packages yet. Click "Add Package".</td></tr>',kn(),Ln()}function Ln(){const t=document.getElementById("hajjumrah-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>Oe(null)))}function Tn(t){const e=t.coverImageUrl?`<span class="admin-logo-wrap"><img src="${t.coverImageUrl}" alt="${S(t.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>',a=!t.price||t.price===0?'<span class="text-text-muted text-[12px] italic">Call for Price</span>':`<span class="font-black text-[15px] text-navy">₹${Number(t.price).toLocaleString()}</span>`,s=t.isActive!==!1?'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>':'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>',i=t.type==="Hajj"?'<span class="px-2 py-0.5 rounded bg-blue-50 text-primary text-[11px] font-semibold">Hajj</span>':'<span class="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[11px] font-semibold">Umrah</span>';return`<tr data-hajjumrah-id="${t.id}">
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
  </tr>`}function kn(){const t=document.getElementById("hajjumrah-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=ae.find(d=>d.id===i);if(s==="edit-hajjumrah"&&Oe(n),s==="delete-hajjumrah"){if(!confirm(`Delete package "${n==null?void 0:n.title}"?`))return;try{await $a(i),f("success","Deleted",`Package "${n==null?void 0:n.title}" removed.`),await Wt()}catch(d){f("error","Error",d.message)}}}))}function Oe(t){const e=document.getElementById("modal-hajjumrah-form");if(!e)return;nt(t?"Edit Package":"Add Package",e.innerHTML);const a=document.getElementById("hajjumrah-form"),s=document.getElementById("hajjumrah-id"),i=document.getElementById("hajjumrah-title"),n=document.getElementById("hajjumrah-type"),d=document.getElementById("hajjumrah-city"),r=document.getElementById("hajjumrah-airline"),o=document.getElementById("hajjumrah-date"),l=document.getElementById("hajjumrah-days"),m=document.getElementById("hajjumrah-nights"),c=document.getElementById("hajjumrah-price"),g=document.getElementById("hajjumrah-active"),p=document.getElementById("hajjumrah-description"),u=document.getElementById("hajjumrah-highlights"),v=document.getElementById("hajjumrah-inclusions");t&&(s.value=t.id,i.value=t.title||"",n.value=t.type||"Umrah",d.value=t.departureCity||"",r.value=t.airline||"",o.value=t.departureDate||"",l.value=t.days||15,m.value=t.nights||14,c.value=t.price||0,g.checked=t.isActive!==!1,p.value=t.description||"",u.value=Lt(t.highlights),v.value=Lt(t.inclusions)),a.addEventListener("submit",async E=>{var L;E.preventDefault();const x=a.querySelector('button[type="submit"]');x.disabled=!0,x.textContent="Saving…";try{const h=s.value,y={title:i.value.trim(),type:n.value,departureCity:d.value.trim(),airline:r.value.trim(),departureDate:o.value.trim(),days:Number(l.value)||1,nights:Number(m.value)||1,price:Number(c.value)||0,isActive:g.checked,description:p.value.trim(),highlights:At(u.value),inclusions:At(v.value)},w=((L=document.getElementById("hajjumrah-image"))==null?void 0:L.files[0])||null;h?await Sa(h,y,w):await Ba(y,w),f("success","Saved!",`Package "${y.title}" saved.`),document.getElementById("admin-modal").close(),await Wt()}catch(h){f("error","Error",h.message),x.disabled=!1,x.textContent="Save Package"}})}
