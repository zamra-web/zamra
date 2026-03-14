import"./index.esm-kRT_WKqT.js";import{o as qe,l as Oe}from"./auth-C-uPoXNt.js";import{a as Ot,d as ne,u as ye,c as ve,e as _e,f as Ve,h as ze,i as We,g as se,j as Ge,k as Je,l as Ye,m as Xe,b as ie,n as Ke,o as Ze,p as Qe,q as ta,r as xe,s as ea,t as aa,v as na,w as sa,x as ia,y as oa,z as ra,A as da,B as la,C as ca,D as ma,E as ua,F as pa,G as ga,H as fa,I as ba,J as ha,K as ya,L as va,M as xa}from"./db-vX1QkBnN.js";import"./firebase-config-aHS-3htW.js";async function wa(t,e,a,s,i){const n=`Generating ${t} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",n),new Promise(async(d,o)=>{try{let pt=function(y,C,A,j,k){c.beginPath(),c.moveTo(y+k,C),c.lineTo(y+A-k,C),c.arcTo(y+A,C,y+A,C+k,k),c.lineTo(y+A,C+j-k),c.arcTo(y+A,C+j,y+A-k,C+j,k),c.lineTo(y+k,C+j),c.arcTo(y,C+j,y,C+j-k,k),c.lineTo(y,C+k),c.arcTo(y,C,y+k,C,k),c.closePath()},gt=function(y){var Ct;const C=y-Z;if(C>K){try{W.stop()}catch(q){console.error("Error stopping recorder",q)}return}c.fillStyle="#f8fafc",c.fillRect(0,0,r,l);const A=t==="9x16"?400:300;if(c.fillStyle="#1e293b",c.fillRect(0,0,r,A),B.complete&&B.width>0){c.globalAlpha=.2;const q=Math.max(r/B.width,A/B.height),F=B.width*q,S=B.height*q,R=(r-F)/2,H=(A-S)/2;c.drawImage(B,R,H,F,S),c.globalAlpha=1}const j=c.createLinearGradient(0,0,0,A);j.addColorStop(0,"#1e293b"),j.addColorStop(1,"transparent"),c.fillStyle=j,c.globalAlpha=.8,c.fillRect(0,0,r,A),c.globalAlpha=1,c.textAlign="center",c.textBaseline="middle";const k=c.createLinearGradient(0,0,r,0);k.addColorStop(0,"#2563eb"),k.addColorStop(.5,"#60a5fa"),k.addColorStop(1,"#1558c0"),c.fillStyle=k,c.fillRect(0,0,r,16);const Bt=200,Q=40,yt=60;c.fillStyle="rgba(37, 99, 235, 0.4)",pt(r/2-Bt/2,yt,Bt,Q,20),c.fill(),c.strokeStyle="rgba(37, 99, 235, 0.6)",c.lineWidth=1,c.stroke(),c.fillStyle="#bfdbfe",c.font="bold 16px Arial, sans-serif",c.fillText("EXCLUSIVE DEALS",r/2,yt+Q/2),c.fillStyle="#ffffff",c.font="900 "+(t==="16x9"?"70px":"56px")+" Arial, sans-serif",c.fillText(`${u} → ${g}`,r/2,yt+80),c.fillStyle="#dbeafe",c.font="700 24px Arial, sans-serif",c.fillText("SPECIAL FARES AVAILABLE NOW",r/2,yt+140);const ft=A+60,at=90,_=t==="9x16"?40:t==="1x1"?80:160,nt=r-_*2;c.fillStyle="#64748b",c.font="bold 18px Arial, sans-serif",c.textAlign="left",c.fillText("DATE",_+20,ft-20),c.textAlign="center",c.fillText("AIRLINE",_+nt*.35,ft-20),c.fillText("TIME",_+nt*.65,ft-20),c.textAlign="right",c.fillText("FARE",_+nt-20,ft-20);for(let q=0;q<v.length;q++){const F=v[q],S=1e3+q*800;if(C<S)continue;const H=Math.min(1,(C-S)/500),xt=20*(1-H),X=ft+q*at+xt;c.globalAlpha=H,q%2===0&&(c.fillStyle="#ffffff",pt(_,X,nt,at-10,12),c.fill()),c.fillStyle="#0f172a",c.textBaseline="middle";const Gt=F.flightDate instanceof Date?F.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():F.flightDate;c.textAlign="left",c.font="900 26px Arial, sans-serif",c.fillText(Gt,_+20,X+at/2-5);const Ht=_+nt*.35,wt=h[F.airlineId];if(wt&&wt.width>0){const bt=Math.min(100,wt.width),ue=40;c.drawImage(wt,Ht-bt/2,X+at/2-5-ue/2,bt,ue)}else{c.font="700 20px Arial, sans-serif",c.textAlign="center";const bt=((Ct=w[F.airlineId])==null?void 0:Ct.name)||F.airlineId||"—";c.fillText(bt,Ht,X+at/2-5)}let Et=F.flightTime||"—";if(Et.includes("-")){const bt=Et.split("-");Et=`${bt[0].trim()} - ${bt[1].trim()}`}c.font="800 22px Arial, sans-serif",c.textAlign="center",c.fillText(Et,_+nt*.65,X+at/2-5);const Jt=`₹${(F.finalRate||0).toLocaleString()}`;c.font="900 26px Arial, sans-serif",c.textAlign="right";const Ue=c.measureText(Jt).width,le=_+nt-20,ce=Ue+40,me=50;c.fillStyle="#0f172a",pt(le-ce,X+at/2-5-me/2,ce,me,12),c.fill(),c.fillStyle="#ffffff",c.fillText(Jt,le-20,X+at/2-5),c.globalAlpha=1}const vt=1e3+v.length*800+500;if(C>vt){const q=Math.min(1,(C-vt)/500);c.globalAlpha=q;const F=100,S=l-F+20*(1-q);c.fillStyle="#ffffff",c.fillRect(0,l-F,r,F),c.fillRect(0,S,r,F),c.fillStyle="#f1f5f9",c.fillRect(0,l-F,r,2),f.complete&&f.width>0&&c.drawImage(f,_,l-F/2-24,48,48),c.fillStyle="#1e293b",c.font="900 24px Arial, sans-serif",c.textAlign="left",c.textBaseline="middle",c.fillText("Zamra Travels",_+64,l-F/2),c.font="700 20px Arial, sans-serif",c.textAlign="right",c.fillText("zamratravels.com  |  +91 98765 43210",r-_,l-F/2),c.globalAlpha=1}requestAnimationFrame(gt)},r,l;if(t==="1x1")r=1080,l=1080;else if(t==="9x16")r=1080,l=1920;else if(t==="16x9")r=1920,l=1080;else throw new Error("Invalid ratio selected");const m=document.createElement("canvas");m.width=r,m.height=l;const c=m.getContext("2d");c.imageSmoothingEnabled=!0;const p=s.find(y=>y.id===a),u=p?(p.sectorFrom||"DEP").toUpperCase():"DEP",g=p?(p.sectorTo||"ARR").toUpperCase():"ARR",v=[...e].sort((y,C)=>{let A=y.flightDate,j=C.flightDate;return A instanceof Date&&(A=A.getTime()),j instanceof Date&&(j=j.getTime()),A-j}).slice(0,10),w={};i.forEach(y=>{y.id&&(w[y.id]=y),y.code&&(w[y.code]=y),y.name&&(w[y.name]=y)});async function I(y){if(!y)return null;try{const C=await fetch(y);if(!C.ok)return null;const A=await C.blob(),j=URL.createObjectURL(A);return new Promise((k,Bt)=>{const Q=new Image;Q.onload=()=>k(Q),Q.onerror=()=>k(null),Q.src=j})}catch{return null}}const B=new Image;await new Promise(y=>{B.onload=y,B.onerror=y,B.src="/assets/img/hero-bg.webp"});const f=new Image;await new Promise(y=>{f.onload=y,f.onerror=y,f.src="/assets/img/logo.webp"});const h={},E=[...new Set(v.map(y=>y.airlineId))].map(y=>w[y]).filter(y=>y==null?void 0:y.logoUrl);await Promise.all(E.map(async y=>{const C=await I(y.logoUrl);C&&(h[y.id]=C)}));const L=m.captureStream(30);let N="video/mp4";MediaRecorder.isTypeSupported(N)||(N="video/webm; codecs=h264",MediaRecorder.isTypeSupported(N)||(N="video/webm"));const W=new MediaRecorder(L,{mimeType:N}),Y=[];W.ondataavailable=y=>{y.data&&y.data.size>0&&Y.push(y.data)},W.start(100);const K=1e4+v.length*1500,Z=performance.now();requestAnimationFrame(gt),W.onstop=()=>{const y=new Blob(Y,{type:N}),C=URL.createObjectURL(y),A=document.createElement("a");A.href=C,A.download=`zamra-video-${t}-${Date.now()}.mp4`,A.style.display="none",document.body.appendChild(A),A.click(),setTimeout(()=>{document.body.removeChild(A),URL.revokeObjectURL(C)},100),window.toast&&window.toast("success","Video Generated",`Your ${t} video has been downloaded!`),d()},W.onerror=y=>{console.error("Recorder Error:",y),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),o(y)}}catch(r){console.error(r),window.toast&&window.toast("error","Generation Failed",r.message),o(r)}})}let z=[],M=[],U=[],Ut=[],Xt=[],Kt=[],Zt=[],Qt=[],te=[],P=[],et=[],G={},tt=new Set;function It(t){return t==null?t:String(t).replace(/damamm/gi,e=>e===e.toUpperCase()?"DAMMAM":e===e.toLowerCase()?"dammam":"Dammam")}function we(t={}){return{...t,sectorFrom:It(t.sectorFrom||""),sectorTo:It(t.sectorTo||""),sectorCode:It(t.sectorCode||"")}}function oe(t=[]){return t.map(e=>we(e))}function $(t=""){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function D(t,e=0){const a=Number(t);return Number.isFinite(a)?a:e}const Ea=[5,7,10],Dt=[20,25,30,35,40];function $t(t=[],e=0){const a=Math.max(0,ut(e)),s=[...new Set(t.map(n=>Math.max(0,ut(n))))].filter(n=>n>0).sort((n,d)=>n-d);if(!s.length)return"";const i=s.includes(a)?a:s[0];return s.map(n=>`<option value="${n}" ${n===i?"selected":""}>${n} Kg</option>`).join("")}function ut(t){if(t==null||t==="")return 0;const e=parseFloat(String(t).replace(/[^\d.]/g,""));return Number.isFinite(e)?e:0}function pe(t,e="—"){if(t==null||t==="")return e;const a=String(t).trim();return a?/^\d+(\.\d+)?(\s*kg)?$/i.test(a)?`${ut(a)} Kg`:a.toUpperCase():e}function Mt(t){if(!t)return null;if(t instanceof Date)return Number.isNaN(t.getTime())?null:t;const e=new Date(t);return Number.isNaN(e.getTime())?null:e}function _t(t){const e=Mt(t);if(!e)return"";const a=e.getTimezoneOffset();return new Date(e.getTime()-a*60*1e3).toISOString().split("T")[0]}function Ee(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e}function Ia(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e.getTime()}function $a(t){if(!t)return null;const e=new Date(`${t}T23:59:59.999`);return Number.isNaN(e.getTime())?null:e.getTime()}let st={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},visas:{key:"countryName",asc:!0},visaStampings:{key:"country",asc:!0},attestations:{key:"country",asc:!0},passportServices:{key:"type",asc:!0},tours:{key:"title",asc:!0},hajjUmrah:{key:"title",asc:!0},reportFares:{key:"flightDate",asc:!0},databaseFares:{key:"flightDate",asc:!0}},Vt={agents:"",sectors:"",airlines:"",visas:"",visaStampings:"",attestations:"",passportServices:"",tours:"",hajjUmrah:""},x={agents:1,sectors:1,airlines:1,visas:1,visaStampings:1,attestations:1,passportServices:1,tours:1,hajjUmrah:1,reportFares:1,databaseFares:1},V={agents:10,sectors:25,airlines:10,visas:10,visaStampings:10,attestations:10,passportServices:10,tours:10,hajjUmrah:10,reportFares:10,databaseFares:25};const T={search:"",agentId:"all",sectorId:"all",airlineId:"all",status:"all",startDate:"",endDate:""};function rt(t,e){var d;let a=t;const s=(d=Vt[e])==null?void 0:d.toLowerCase();s&&e==="agents"?a=a.filter(o=>(o.name||"").toLowerCase().includes(s)||(o.email||"").toLowerCase().includes(s)||(o.contactPhone||"").toLowerCase().includes(s)||(o.id||"").toLowerCase().includes(s)):s&&e==="sectors"?a=a.filter(o=>(o.sectorFrom||"").toLowerCase().includes(s)||(o.sectorTo||"").toLowerCase().includes(s)||(o.sectorCode||"").toLowerCase().includes(s)):s&&e==="airlines"?a=a.filter(o=>(o.name||"").toLowerCase().includes(s)||(o.code||"").toLowerCase().includes(s)):s&&e==="visas"?a=a.filter(o=>(o.countryName||"").toLowerCase().includes(s)||(o.visaType||"").toLowerCase().includes(s)):s&&e==="visaStampings"?a=a.filter(o=>(o.country||"").toLowerCase().includes(s)||(o.description||"").toLowerCase().includes(s)):s&&e==="attestations"?a=a.filter(o=>(o.country||"").toLowerCase().includes(s)||(o.certificate||"").toLowerCase().includes(s)):s&&e==="passportServices"?a=a.filter(o=>(o.type||"").toLowerCase().includes(s)||(o.description||"").toLowerCase().includes(s)):s&&e==="tours"?a=a.filter(o=>(o.title||"").toLowerCase().includes(s)||(o.category||"").toLowerCase().includes(s)||(o.duration||"").toLowerCase().includes(s)):s&&e==="hajjUmrah"&&(a=a.filter(o=>(o.title||"").toLowerCase().includes(s)||(o.type||"").toLowerCase().includes(s)||(o.departureCity||"").toLowerCase().includes(s)||(o.airline||"").toLowerCase().includes(s)));const{key:i,asc:n}=st[e];return i&&(a=[...a].sort((o,r)=>{let l=o[i],m=r[i];if(l instanceof Date&&(l=l.getTime()),m instanceof Date&&(m=m.getTime()),i==="id"){const c=parseInt(l),p=parseInt(m);if(!isNaN(c)&&!isNaN(p))return n?c-p:p-c}return typeof l=="string"&&(l=l.toLowerCase()),typeof m=="string"&&(m=m.toLowerCase()),l<m?n?-1:1:l>m?n?1:-1:0})),a}function Nt(t){document.querySelectorAll(`th[data-sort-tab="${t}"] i`).forEach(a=>{a.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const e=document.querySelector(`th[data-sort-tab="${t}"][data-sort-key="${st[t].key}"]`);if(e){const a=e.querySelector("i");a&&(a.className=`bi bi-arrow-${st[t].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",t=>{const e=t.target.closest("th[data-sort-tab]");if(!e)return;const a=e.dataset.sortTab,s=e.dataset.sortKey;st[a].key===s?st[a].asc=!st[a].asc:(st[a].key=s,st[a].asc=!0),a==="agents"?dt(!1):a==="sectors"?lt(!1):a==="airlines"?ht(!1):a==="visas"?ot(!1):a==="tours"?zt(!1):a==="hajjUmrah"?Wt(!1):a==="reportFares"&&P.length?jt(P):a==="databaseFares"&&O()});document.documentElement.style.visibility="hidden";qe(async t=>{if(!t){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const e=document.getElementById("admin-user-name");e&&(e.textContent=t.email.split("@")[0]),await Sa(),De(),await Ie()});document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("admin-logout-btn");t&&t.addEventListener("click",async()=>{(await Oe()).success&&(window.location.href="/login.html")}),Ca(),Ba(),tn()});async function Sa(){try{const[t,e,a,s]=await Promise.all([ve(),se(),ie(),xe()]);z=t,M=oe(e),U=a,Ut=s}catch(t){console.error("loadGlobalData error:",t)}}function Ba(){const t=document.querySelectorAll(".nav-link"),e=document.querySelectorAll(".tab-content"),a=document.getElementById("page-title");t.forEach(s=>{s.addEventListener("click",async i=>{var o;i.preventDefault(),t.forEach(r=>{r.classList.remove("active","text-primary"),r.classList.add("text-text-muted")}),s.classList.remove("text-text-muted"),s.classList.add("active","text-primary");const n=s.getAttribute("data-tab"),d=s.getAttribute("data-title");e.forEach(r=>r.classList.remove("active")),(o=document.getElementById(n))==null||o.classList.add("active"),a&&d&&(a.textContent=d),await Ie()})})}async function Ie(){const t=document.querySelector(".tab-content.active");if(!t)return;const e=t.id;e==="agents-tab"?await dt():e==="sectors-tab"?await lt():e==="flights-tab"?await ht():e==="dashboard-tab"?await Aa():e==="reports-tab"?await Ra():e==="database-tab"?await re():e==="visas-tab"?await ot():e==="tours-tab"?await zt():e==="hajjumrah-tab"?await Wt():e==="agent-sheets-tab"?(De(),Rt(),mt()):e==="eticket-tab"&&await dn()}function Ca(){const t=document.getElementById("admin-modal"),e=document.getElementById("modal-close-btn");e&&e.addEventListener("click",()=>t.close()),t==null||t.addEventListener("click",a=>{a.target===t&&t.close()})}function it(t,e){const a=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=t,document.getElementById("modal-body").innerHTML=e,a.showModal()}async function Aa(){var s,i,n,d,o;if(!document.getElementById("dashboard-tab"))return;const e=document.getElementById("poster-sector-sel");e&&e.options.length<=1&&M.forEach(r=>{const l=new Option(r.sectorCode,r.id);e.appendChild(l)});const a=document.getElementById("poster-generate-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",async()=>{const r=document.getElementById("poster-start-date"),l=document.getElementById("poster-end-date"),m=e==null?void 0:e.value,c=(r==null?void 0:r.value)||null,p=(l==null?void 0:l.value)||null;if(!m){b("warning","Validation Error","Please select a sector to generate the poster.");return}a.disabled=!0,a.textContent="Generating…";try{const u=await Ot({sectorId:m,startDate:c,endDate:p,includeHidden:!1});if(!u||!u.length){b("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await La(u,m)}catch(u){b("error","Generation Failed",u.message)}finally{a.disabled=!1,a.textContent="Generate Poster"}}),(s=document.getElementById("poster-download-jpg"))==null||s.addEventListener("click",()=>ge("jpeg")),(i=document.getElementById("poster-download-pdf"))==null||i.addEventListener("click",()=>ge("pdf")),(n=document.getElementById("poster-download-vid-1x1"))==null||n.addEventListener("click",()=>Yt("1x1")),(d=document.getElementById("poster-download-vid-9x16"))==null||d.addEventListener("click",()=>Yt("9x16")),(o=document.getElementById("poster-download-vid-16x9"))==null||o.addEventListener("click",()=>Yt("16x9")))}async function Yt(t){const e=document.getElementById("poster-sector-sel"),a=document.getElementById("poster-start-date"),s=document.getElementById("poster-end-date"),i=e==null?void 0:e.value,n=(a==null?void 0:a.value)||null,d=(s==null?void 0:s.value)||null;if(!i){b("warning","Validation Error","Please select a sector to generate the poster.");return}try{const o=await Ot({sectorId:i,startDate:n,endDate:d,includeHidden:!1});if(!o||!o.length){b("warning","No Fares","No live fares found for the selected sector and dates.");return}await wa(t,o,i,M,U)}catch(o){console.error("Video generation failed",o)}}async function La(t,e){const a=document.getElementById("poster-preview-container"),s=document.getElementById("poster-fares-tbody"),i=document.getElementById("poster-sector-title");if(!a||!s||!i)return;const n=M.find(u=>u.id===e),d=n?(n.sectorFrom||"DEP").toUpperCase():"DEP",o=n?(n.sectorTo||"ARR").toUpperCase():"ARR";i.innerHTML=`${d} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${o}`;const r=[...t].sort((u,g)=>{let v=u.flightDate,w=g.flightDate;return v instanceof Date&&(v=v.getTime()),w instanceof Date&&(w=w.getTime()),v-w}).slice(0,10),l={};U.forEach(u=>{u.id&&(l[u.id]=u),u.code&&(l[u.code]=u),u.name&&(l[u.name]=u)});async function m(u){try{const g=await fetch(u);if(!g.ok)return null;const v=await g.blob();return URL.createObjectURL(v)}catch{return null}}const c=[...new Set(r.map(u=>u.airlineId))].map(u=>l[u]).filter(u=>u==null?void 0:u.logoUrl),p={};await Promise.all(c.map(async u=>{const g=await m(u.logoUrl);g&&(p[u.id]=g)})),s.innerHTML=r.map((u,g)=>{const v=u.flightDate instanceof Date?u.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():u.flightDate,w=l[u.airlineId],I=g%2===0?"#ffffff":"#f8fafc",B=p[u.airlineId]||null,f=B?`<img src="${B}" style="height:40px;max-width:100px;object-fit:contain;display:block;margin:0 auto;" alt="${(w==null?void 0:w.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:15px;white-space:nowrap;">${(w==null?void 0:w.name)||u.airlineId||"—"}</span>`;let h='<span style="color:#94a3b8;font-size:14px;">—</span>';if(u.flightTime){const E=u.flightTime.split("-").map(L=>L.trim());E.length>=2?h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${E[0]} - ${E[1]}</span>`:h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${u.flightTime}</span>`}return`
      <tr style="background-color:${I};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 12px;font-weight:900;color:#0f172a;font-size:22px;white-space:nowrap;">${v}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${f}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${h}</td>
        <td style="padding:16px 12px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:8px 18px;border-radius:12px;font-weight:900;font-size:22px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            &#8377;${(u.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),a.classList.remove("hidden"),a.classList.add("flex")}function $e(t){if(!t||t.nodeType!==1)return;const e=window.getComputedStyle(t),a=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const s of a){const i=e.getPropertyValue(s);if(i&&!i.startsWith("rgb")&&!i.startsWith("#")&&i!=="transparent"&&i!=="initial")try{t.style[s]=i}catch{}}for(const s of t.children)$e(s)}async function ge(t){const e=document.getElementById("poster-render-frame");if(!e)return;const a=document.getElementById("poster-download-jpg"),s=document.getElementById("poster-download-pdf");a&&(a.disabled=!0),s&&(s.disabled=!0);const i=e.style.transform;e.style.transform="none",b("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(e.querySelectorAll("img")).map(o=>o.complete?Promise.resolve():new Promise(r=>{o.onload=r,o.onerror=r})));const n=await html2canvas(e,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:o=>{const r=o.getElementById("poster-render-frame");r&&$e(r)}});e.style.transform=i;const d=n.toDataURL("image/jpeg",.95);if(t==="jpeg"){const o=document.createElement("a");o.download=`zamra-poster-${Date.now()}.jpg`,o.href=d,o.click(),b("success","Downloaded!","JPEG poster saved successfully.")}else if(t==="pdf"){const o=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!o)throw new Error("jsPDF library not loaded.");const r=96/25.4,l=n.width/2/r,m=n.height/2/r,c=new o({orientation:l>m?"landscape":"portrait",unit:"mm",format:[l,m]});c.addImage(d,"JPEG",0,0,l,m),c.save(`zamra-poster-${Date.now()}.pdf`),b("success","Downloaded!","PDF poster saved successfully.")}}catch(n){console.error("Poster export error:",n),e.style.transform=i,b("error","Export Failed",n.message||"There was an error generating the export.")}finally{a&&(a.disabled=!1),s&&(s.disabled=!1)}}function jt(t){const e=document.getElementById("report-fares-results");if(!e)return;if(!t||!t.length){e.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-inbox"></i>
        </div>
        <p class="admin-empty-state-title">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const a=Object.fromEntries(z.map(u=>[u.id,u.name])),s=Object.fromEntries(M.map(u=>[u.id,u.sectorCode])),i=Object.fromEntries(U.map(u=>[u.id,u.code])),{key:n,asc:d}=st.reportFares,o=[...t].sort((u,g)=>{let v=u[n],w=g[n];return v instanceof Date&&(v=v.getTime()),w instanceof Date&&(w=w.getTime()),typeof v=="string"&&(v=v.toLowerCase()),typeof w=="string"&&(w=w.toLowerCase()),v<w?d?-1:1:v>w?d?1:-1:0}),r=V.reportFares,l=Math.max(1,Math.ceil(t.length/r));x.reportFares>l&&(x.reportFares=l);const m=(x.reportFares-1)*r,c=o.slice(m,m+r),p=(u,g)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${u}">${g} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;e.innerHTML=`
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
          ${c.map((u,g)=>{const v=u.flightDate instanceof Date?u.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):u.flightDate||"—";return`<tr class="${g%2===1?"bg-slate-50/60":""} hover:bg-slate-100/80 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${v}</td>
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
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,St("reportFares",t.length,l,m,r),window.__deleteFare=async u=>{if(confirm("Delete this fare?"))try{await ne(u),P=P.filter(g=>g.id!==u),b("success","Deleted","Fare removed."),jt(P)}catch(g){b("error","Error",g.message)}},window.__toggleFare=async(u,g)=>{try{await ye(u,{isHidden:g}),P=P.map(v=>v.id===u?{...v,isHidden:g}:v),b("success","Updated",`Fare ${g?"hidden":"shown"}.`),jt(P)}catch(v){b("error","Error",v.message)}},Nt("reportFares")}async function dt(t=!0){t&&(z=await ve(),x.agents=1);const e=document.querySelector("#agents-tab .admin-table tbody");if(!e)return;const a=document.getElementById("agents-search"),s=document.getElementById("agents-limit");a&&!a.dataset.wired&&(a.dataset.wired="1",s&&(s.dataset.wired="1"),a.addEventListener("input",m=>{Vt.agents=m.target.value,x.agents=1,dt(!1)}),s&&s.addEventListener("change",m=>{V.agents=parseInt(m.target.value),x.agents=1,dt(!1)}));const i=rt(z,"agents"),n=V.agents,d=Math.max(1,Math.ceil(i.length/n));x.agents>d&&(x.agents=d);const o=(x.agents-1)*n,r=i.slice(o,o+n);e.innerHTML=r.length?r.map(m=>Ta(m)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',St("agents",i.length,d,o,n),delete e.dataset.actionsWired,ka();const l=document.getElementById("agents-add-btn");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>Se(null))),Nt("agents")}function Ta(t){const e=t.isActive!==!1?'<span class="admin-status-pill admin-status-active">Active</span>':'<span class="admin-status-pill admin-status-inactive">Hidden</span>',a=t.commission!==void 0?`₹${Number(t.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${t.id}">
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
  </tr>`}function ka(){const t=document.querySelector("#agents-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const s=a.dataset.action,i=a.dataset.id,n=z.find(d=>d.id===i);if(s==="edit-agent"&&Se(n),s==="delete-agent"){if(!confirm(`Delete agent "${n==null?void 0:n.name}"? This does NOT delete their fares.`))return;try{await _e(i),b("success","Deleted",`Agent "${n==null?void 0:n.name}" removed.`),await dt()}catch(d){b("error","Error",d.message)}}if(s==="toggle-agent"){const o=!(a.dataset.active==="true");a.disabled=!0,a.textContent="Working…";try{const r=await Ve(i,o);b("success",o?"Agent Shown":"Agent Hidden",r.message),await dt()}catch(r){b("error","Toggle Failed",r.message),await dt()}}}))}function St(t,e,a,s,i){const n=document.getElementById(`${t}-pagination-footer`);if(!n)return;const d=Math.min(s+i,e),o=x[t];n.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${e?s+1:0} to ${d} of ${e} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${o<=1?"disabled":""}>Previous</button>
        ${Array.from({length:a},(r,l)=>l+1).map(r=>`<button data-pg-action="goto" data-pg="${r}" class="admin-pagination-btn ${r===o?"admin-pagination-btn-active":""}">${r}</button>`).join("")}
        <button data-pg-action="next" class="admin-pagination-btn" ${o>=a?"disabled":""}>Next</button>
      </div>
    </div>`,n.dataset.wired||(n.dataset.wired="1",n.addEventListener("click",r=>{const l=r.target.closest("[data-pg-action]");if(!l||l.disabled)return;const m=l.dataset.pgAction;m==="prev"?x[t]=Math.max(1,x[t]-1):m==="next"?x[t]++:m==="goto"&&(x[t]=parseInt(l.dataset.pg)),t==="agents"?dt(!1):t==="sectors"?lt(!1):t==="airlines"?ht(!1):t==="reportFares"?jt(P):t==="databaseFares"&&O()}))}function Se(t){var a,s;const e=!!t;it(e?"Edit Agent":"Add New Agent",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("agent-form"))==null||s.addEventListener("submit",async i=>{i.preventDefault();const n=new FormData(i.target),d=Object.fromEntries(n.entries()),o=i.target.querySelector("[type=submit]");o.disabled=!0,o.textContent="Saving…";try{e?(await ze(t.id,d),b("success","Updated",`Agent "${d.name}" updated.`)):(await We(d),b("success","Added",`Agent "${d.name}" added.`)),document.getElementById("admin-modal").close(),await dt()}catch(r){b("error","Save Failed",r.message),o.disabled=!1,o.textContent=e?"Save Changes":"Add Agent"}})}async function lt(t=!0){t&&(M=oe(await se()),x.sectors=1);const e=document.getElementById("sectors-search"),a=document.getElementById("sectors-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{Vt.sectors=m.target.value,x.sectors=1,lt(!1)}),a.addEventListener("change",m=>{V.sectors=parseInt(m.target.value),x.sectors=1,lt(!1)}));const s=document.querySelector("#sectors-tab .admin-table tbody");if(!s)return;const i=rt(M,"sectors"),n=V.sectors,d=Math.max(1,Math.ceil(i.length/n));x.sectors>d&&(x.sectors=d);const o=(x.sectors-1)*n,r=i.slice(o,o+n);s.innerHTML=r.length?r.map(m=>Da(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',St("sectors",i.length,d,o,n),Ma();const l=document.querySelector("#sectors-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>Be(null))),Nt("sectors")}function Da(t){const e=we(t);return`<tr data-sector-id="${t.id}">
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
  </tr>`}function Ma(){const t=document.querySelector("#sectors-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=M.find(d=>d.id===i);if(s==="edit-sector"&&Be(n),s==="delete-sector"){if(!confirm(`Delete sector "${n==null?void 0:n.sectorCode}"?`))return;try{await Ge(i),b("success","Deleted",`Sector "${n==null?void 0:n.sectorCode}" removed.`),await lt()}catch(d){b("error","Error",d.message)}}if(s==="toggle-sector"){const o=!(a.dataset.hidden==="true");a.disabled=!0,a.textContent="Working…";try{const r=await Je(i,o);b("success",`Sector Fares ${o?"Hidden":"Shown"}`,r.message),await lt()}catch(r){b("error","Toggle Failed",r.message),await lt()}}}))}function Be(t){var a,s;const e=!!t;it(e?"Edit Sector":"Add New Sector",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("sector-form"))==null||s.addEventListener("submit",async i=>{i.preventDefault();const n=new FormData(i.target),d=Object.fromEntries(n.entries());d.sectorCode=It(d.sectorCode.toUpperCase()),d.sectorFrom=It(d.sectorFrom.toUpperCase()),d.sectorTo=It(d.sectorTo.toUpperCase());const o=i.target.querySelector("[type=submit]");o.disabled=!0,o.textContent="Saving…";try{e?(await Ye(t.id,d),b("success","Updated","Sector updated.")):(await Xe(d),b("success","Added",`Sector "${d.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await lt()}catch(r){b("error","Save Failed",r.message),o.disabled=!1,o.textContent=e?"Save Changes":"Add Sector"}})}async function ht(t=!0){t&&(U=await ie(),x.airlines=1);const e=document.getElementById("airlines-search"),a=document.getElementById("airlines-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{Vt.airlines=m.target.value,x.airlines=1,ht(!1)}),a.addEventListener("change",m=>{V.airlines=parseInt(m.target.value),x.airlines=1,ht(!1)}));const s=document.querySelector("#flights-tab .admin-table tbody");if(!s)return;const i=rt(U,"airlines"),n=V.airlines,d=Math.max(1,Math.ceil(i.length/n));x.airlines>d&&(x.airlines=d);const o=(x.airlines-1)*n,r=i.slice(o,o+n);s.innerHTML=r.length?r.map(m=>ja(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "Add Airline".</td></tr>',St("airlines",i.length,d,o,n),Fa();const l=document.querySelector("#flights-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>Ce(null))),Nt("airlines")}function ja(t){const e=t.logoUrl?`<span class="admin-logo-wrap"><img src="${t.logoUrl}" alt="${$(t.name||"Airline")}"></span>`:`<span class="admin-logo-wrap"><span class="admin-logo-fallback">${$((t.code||"NA").slice(0,3))}</span></span>`;return`<tr data-airline-id="${t.id}">
    <td>${e}</td>
    <td class="font-semibold">${t.name}</td>
    <td><span class="font-mono font-bold text-primary">${t.code}</span></td>
    <td>
      <div class="flex gap-1 items-center">
        <button data-action="edit-airline" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-airline" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Fa(){const t=document.querySelector("#flights-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=U.find(d=>d.id===i);if(s==="edit-airline"&&Ce(n),s==="delete-airline"){if(!confirm(`Delete airline "${n==null?void 0:n.name}" (${n==null?void 0:n.code})?`))return;try{await Ke(i),b("success","Deleted",`Airline "${n==null?void 0:n.name}" removed.`),await ht()}catch(d){b("error","Error",d.message)}}}))}function Ce(t){var a,s;const e=!!t;it(e?"Edit Airline":"Add New Airline",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("airline-form"))==null||s.addEventListener("submit",async i=>{var l;i.preventDefault();const n=new FormData(i.target),d=((l=n.get("logoFile"))==null?void 0:l.size)>0?n.get("logoFile"):null,o={name:n.get("name"),code:n.get("code").toUpperCase()},r=i.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{e?(await Ze(t.id,o,d),b("success","Updated","Airline updated.")):(await Qe(o,d),b("success","Added",`Airline "${o.name}" added.`)),document.getElementById("admin-modal").close(),await ht()}catch(m){b("error","Save Failed",m.message),r.disabled=!1,r.textContent=e?"Save Changes":"Add Airline"}})}async function Ra(){const t=document.getElementById("reports-tab");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=document.getElementById("reports-sector-sel");e&&e.options.length<=1&&M.forEach(d=>e.appendChild(new Option(d.sectorCode,d.id)));const a=document.getElementById("reports-agent-sel");a&&a.options.length<=1&&z.forEach(d=>a.appendChild(new Option(d.name,d.id)));const s=document.getElementById("generate-report-btn"),i=document.getElementById("reports-start-date"),n=document.getElementById("reports-end-date");s&&!s.dataset.wired&&(s.dataset.wired="1",s.addEventListener("click",async()=>{const d=(e==null?void 0:e.value)||"all",o=(a==null?void 0:a.value)||"all",r=(i==null?void 0:i.value)||null,l=(n==null?void 0:n.value)||null;if(d==="all"&&!r&&!l&&o==="all"){b("warning","No Filter Selected","Select at least a sector, an agent, or a date range.");return}s.disabled=!0,s.textContent="Generating…";try{const[m,c]=await Promise.all([ta(r,l,d,o),Ot({sectorId:d,agentId:o,startDate:r,endDate:l,includeHidden:!0})]);P=c,Na(m,t),x.reportFares=1,jt(P)}catch(m){b("error","Report Failed",m.message)}finally{s.disabled=!1,s.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Na(t,e){const{agentReport:a,sectorReport:s,totalFares:i}=t,n=document.getElementById("report-stats-row");if(n){n.classList.remove("hidden");const p=(P||[]).filter(f=>!f.isHidden).length,u=(P||[]).filter(f=>f.isHidden).length,g=new Set((P||[]).map(f=>f.agentId)).size,v=(P||[]).map(f=>f.finalRate||0).filter(f=>f>0),w=v.length?Math.round(v.reduce((f,h)=>f+h,0)/v.length):0,I=(f,h)=>{const E=document.getElementById(f);E&&(E.textContent=h.toLocaleString())};I("stat-total-fares",i),I("stat-live-fares",p),I("stat-hidden-fares",u),I("stat-agents-count",g);const B=document.getElementById("stat-avg-fare");B&&(B.textContent=w>0?`₹${w.toLocaleString()}`:"—")}const d=document.getElementById("report-total-fares");d&&(d.textContent=`${i} fare${i!==1?"s":""} matched your filter`);const o=document.getElementById("bar-chart-container");o&&a.length&&Ha(a.slice(0,8),o);const r=document.getElementById("donut-chart-svg"),l=document.getElementById("pie-legend");r&&s.length&&Pa(s.slice(0,8),r,l);const m=document.getElementById("report-leaderboards");m&&(m.classList.remove("hidden"),Ua(a,s));const c=document.getElementById("download-report-csv");if(c){const p=c.cloneNode(!0);c.parentNode.replaceChild(p,c),p.addEventListener("click",()=>qa(P)),P&&P.length?p.classList.remove("opacity-50","pointer-events-none"):p.classList.add("opacity-50","pointer-events-none")}b("success","Report Ready",`${i} fare${i!==1?"s":""} aggregated.`)}function Ha(t,e){const a=e.clientWidth||480,s=260,i={top:32,right:16,bottom:48,left:48},n=a-i.left-i.right,d=s-i.top-i.bottom,o=Math.max(...t.map(f=>f.count),1),r=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],l=4,m=Math.ceil(o/l),c=Array.from({length:l+1},(f,h)=>h*m),p=c.map(f=>{const h=i.top+d-f/(c[c.length-1]||1)*d;return`<line x1="${i.left}" y1="${h.toFixed(1)}" x2="${a-i.right}" y2="${h.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${i.left-6}" y="${(h+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${f}</text>`}).join(""),u=Math.min(48,n/t.length*.6),g=n/t.length,v=t.map((f,h)=>{const E=Math.max(4,f.count/(c[c.length-1]||1)*d),L=i.left+h*g+g/2-u/2,N=i.top+d-E,[W,Y]=r[h%r.length],K=`bg${h}`,Z=f.avgRate?`avg ₹${Math.round(f.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${K}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${W}"/>
              <stop offset="100%" stop-color="${Y}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${f.name}" data-count="${f.count}" data-avg="${Z}" style="cursor:pointer;">
              <rect x="${L.toFixed(1)}" y="${N.toFixed(1)}" width="${u}" height="${E.toFixed(1)}"
                rx="6" fill="url(#${K})" opacity="0.92"
                style="transform-origin:${(L+u/2).toFixed(1)}px ${(i.top+d).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${h*.07}s both;"/>
              <text x="${(L+u/2).toFixed(1)}" y="${(N-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${Y}">${f.count}</text>
              <text x="${(L+u/2).toFixed(1)}" y="${(i.top+d+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(f.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),w="bar-tooltip";e.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${w}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${s}" viewBox="0 0 ${a} ${s}" style="overflow:visible;">
      ${p}
      <line x1="${i.left}" y1="${i.top}" x2="${i.left}" y2="${i.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${i.left}" y1="${i.top+d}" x2="${a-i.right}" y2="${i.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${v}
    </svg>`;const I=e.querySelector("#bar-svg"),B=e.querySelector(`#${w}`);I&&B&&I.querySelectorAll(".bar-group").forEach(f=>{f.addEventListener("mousemove",h=>{const E=e.getBoundingClientRect();B.style.display="block",B.style.left=h.clientX-E.left+12+"px",B.style.top=h.clientY-E.top-40+"px";const L=f.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${f.dataset.avg}</span>`:"";B.innerHTML=`${f.dataset.name}<br><span style="color:#60a5fa;">${f.dataset.count} fares</span>${L}`}),f.addEventListener("mouseleave",()=>{B.style.display="none"})})}function Pa(t,e,a){const s=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],r=t.reduce((f,h)=>f+h.count,0),l=e.getElementById?e.getElementById("donut-segments"):e.querySelector("#donut-segments"),m=e.querySelector("#donut-center-count"),c=e.querySelector("#donut-center-label");if(!l)return;m&&(m.textContent=r),c&&(c.textContent="FARES");const p=(f,h,E,L)=>({x:f+E*Math.cos((L-90)*Math.PI/180),y:h+E*Math.sin((L-90)*Math.PI/180)});let u=0;const g=t.map((f,h)=>{const E=r>0?f.count/r*360:0,L=u+E,N=E>180?1:0,W=p(110,110,95,u),Y=p(110,110,95,L),K=p(110,110,60,u),Z=p(110,110,60,L),pt=[`M ${W.x.toFixed(2)} ${W.y.toFixed(2)}`,`A 95 95 0 ${N} 1 ${Y.x.toFixed(2)} ${Y.y.toFixed(2)}`,`L ${Z.x.toFixed(2)} ${Z.y.toFixed(2)}`,`A 60 60 0 ${N} 0 ${K.x.toFixed(2)} ${K.y.toFixed(2)}`,"Z"].join(" "),gt=u+E/2;u=L;const y=r>0?(f.count/r*100).toFixed(1):"0.0";return{pathD:pt,color:s[h%s.length],name:f.name,count:f.count,pct:y,mid:gt}}),v="http://www.w3.org/2000/svg";l.innerHTML="";const w=g.map((f,h)=>{const E=document.createElementNS(v,"path");return E.setAttribute("d",f.pathD),E.setAttribute("fill",f.color),E.setAttribute("stroke","white"),E.setAttribute("stroke-width","2"),E.style.cursor="pointer",E.style.transition="transform 0.2s, filter 0.2s",E.style.transformOrigin="110px 110px",E.setAttribute("data-index",h),l.appendChild(E),E}),I=f=>{w.forEach((h,E)=>{E===f?(h.style.transform="scale(1.04)",h.style.filter="brightness(1.1)",h.setAttribute("stroke-width","3")):(h.style.transform="scale(1)",h.style.filter="brightness(1)",h.setAttribute("stroke-width","2"))}),f>=0&&f<g.length?(m&&(m.textContent=g[f].count),c&&(c.textContent=g[f].name.split(" ")[0].toUpperCase().slice(0,7))):(m&&(m.textContent=r),c&&(c.textContent="FARES"))};if(w.forEach((f,h)=>{f.addEventListener("mouseover",()=>{I(h),B(h)}),f.addEventListener("mouseout",()=>{I(-1),B(-1)})}),a){a.innerHTML=g.map((h,E)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${E}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${h.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${h.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${h.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${h.pct}%</span>
      </div>`).join("");const f=h=>{a.querySelectorAll(".legend-row").forEach((E,L)=>{E.style.background=L===h?"#f1f5f9":""})};window._highlightLegendRows=f,a.querySelectorAll(".legend-row").forEach((h,E)=>{h.addEventListener("mouseover",()=>{I(E),f(E)}),h.addEventListener("mouseout",()=>{I(-1),f(-1)})})}function B(f){window._highlightLegendRows&&window._highlightLegendRows(f)}}function Ua(t,e){var n,d;const a=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],s=document.getElementById("leaderboard-agents");if(s&&t.length){const o=[...t].sort((l,m)=>m.count-l.count).slice(0,5),r=o[0].count||1;s.innerHTML=o.map((l,m)=>{const c=Math.max(6,Math.round(l.count/r*100));return`<div style="display:flex;align-items:center;gap:10px;">
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
      </div>`}).join("")}const i=document.getElementById("leaderboard-sectors");if(i&&e.length){const r=[...e.filter(c=>c.avgRate>0)].sort((c,p)=>c.avgRate-p.avgRate).slice(0,5),l=((n=r[0])==null?void 0:n.avgRate)||1,m=((d=r[r.length-1])==null?void 0:d.avgRate)||1;i.innerHTML=r.map((c,p)=>{const u=m>l?Math.max(6,Math.round((c.avgRate-l)/(m-l)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${p+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${c.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(c.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${u}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function qa(t){if(!t||!t.length){b("warning","No Data","No fares to export. Apply filters and fetch first.");return}const e=Object.fromEntries(z.map(c=>[c.id,c.name])),a=Object.fromEntries(M.map(c=>[c.id,c.sectorCode])),s=Object.fromEntries(U.map(c=>[c.id,c.code||c.name])),i=c=>`"${String(c??"").replace(/"/g,'""')}"`,n=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],d=t.map(c=>{const p=c.flightDate instanceof Date?c.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):c.flightDate||"";return[i(p),i(c.flightTime||""),i(a[c.sectorId]||c.sectorId),i(s[c.airlineId]||c.airlineId),i(e[c.agentId]||c.agentId),i(c.specialRate||0),i(c.finalRate||0),i(c.commission||0),i(c.baggage||""),i(c.extraBaggage||""),i(c.isHidden?"Hidden":"Live")].join(",")}),o=[n.map(i).join(","),...d].join(`
`),r=new Blob(["\uFEFF"+o],{type:"text/csv;charset=utf-8;"}),l=URL.createObjectURL(r),m=document.createElement("a");m.href=l,m.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(m),m.click(),document.body.removeChild(m),URL.revokeObjectURL(l),b("success","CSV Downloaded",`${t.length} fares exported.`)}function Ae(){return Object.keys(G).length}function Oa(){return{agentNameById:Object.fromEntries(z.map(t=>[t.id,t.name||t.id])),sectorCodeById:Object.fromEntries(M.map(t=>[t.id,t.sectorCode||`${t.sectorFrom||""} ${t.sectorTo||""}`.trim()||t.id])),airlineLabelById:Object.fromEntries(U.map(t=>[t.id,t.code?`${t.code} - ${t.name||""}`.trim():t.name||t.id]))}}function Le(t,e=0){if(!t)return e;const a=z.find(i=>i.id===t),s=Number(a==null?void 0:a.commission);return Number.isFinite(s)?Math.max(0,s):e}function _a(t,e){return t==="specialRate"||t==="finalRate"||t==="commission"||t==="extraBaggage"?e===""?"":D(e,0):t==="baggage"?e===""?"":ut(e):t==="isHidden"?e===!0||e==="hidden"||e==="true":t==="flightTime"?String(e||"").trim():t==="flightDate"?e||"":String(e||"")}function Va(t,e){return t==="specialRate"||t==="finalRate"||t==="extraBaggage"?D(e,0):t==="commission"?e==null||e===""?"":Math.max(0,D(e,0)):t==="baggage"?ut(e):t==="isHidden"?e===!0:t==="flightTime"?String(e||"").trim():t==="flightDate"?_t(e):String(e||"")}function ee(t){return t?t.commission!==void 0&&t.commission!==null&&t.commission!==""?Math.max(0,D(t.commission,0)):Math.max(0,D(t.finalRate,0)-D(t.specialRate,0)):0}function Ft(t,e){return Math.max(0,D(t,0)+Math.max(0,D(e,0)))}function Te(t){const e=G[t.id]||{},a={...t,...e},s=ee(t);return a.flightDate=e.flightDate!==void 0?Ee(e.flightDate):Mt(t.flightDate),a.specialRate=D(a.specialRate,0),a.commission=e.commission!==void 0?Math.max(0,D(e.commission,0)):s,a.finalRate=Ft(a.specialRate,a.commission),a.baggage=ut(a.baggage),a.extraBaggage=D(a.extraBaggage,0),a.isHidden=a.isHidden===!0||a.isHidden==="hidden"||a.isHidden==="true",a.flightTime=String(a.flightTime||"").trim(),a.agentId=a.agentId||"",a.sectorId=a.sectorId||"",a.airlineId=a.airlineId||"",a}function At(){const t=Ae(),e=tt.size,a=document.getElementById("database-unsaved-pill");a&&(a.textContent=`Unsaved: ${t}`);const s=document.getElementById("database-save-all-btn");s&&(s.disabled=t===0);const i=document.getElementById("database-delete-selected-btn");i&&(i.disabled=e===0);const n=document.getElementById("database-selected-count");n&&(n.textContent=String(e))}function za(){const t=document.getElementById("database-agent-filter"),e=document.getElementById("database-sector-filter"),a=document.getElementById("database-airline-filter");if(t){const s=T.agentId;t.innerHTML='<option value="all">All Agents</option>'+z.map(i=>`<option value="${$(i.id)}">${$(i.id)} · ${$(i.name||"Unnamed")}</option>`).join(""),t.value=s}if(e){const s=T.sectorId;e.innerHTML='<option value="all">All Sectors</option>'+M.map(i=>`<option value="${$(i.id)}">${$(i.sectorCode||i.id)}</option>`).join(""),e.value=s}if(a){const s=T.airlineId;a.innerHTML='<option value="all">All Airlines</option>'+U.map(i=>`<option value="${$(i.id)}">${$(i.code||"—")} · ${$(i.name||"Unnamed")}</option>`).join(""),a.value=s}}function Wa(){const t=document.getElementById("database-table-wrap");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=i=>{const n=t.querySelector(`tr[data-fare-id="${i}"]`);if(!n)return;const d=!!G[i];n.classList.toggle("admin-database-row-dirty",d);const o=n.querySelector('[data-db-action="save"]'),r=n.querySelector('[data-db-action="reset"]');o&&(o.disabled=!d),r&&(r.disabled=!d)},a=i=>{if(!i)return;const n=i.querySelector('[data-db-field="specialRate"]'),d=i.querySelector('[data-db-field="commission"]'),o=i.querySelector('[data-db-field="finalRate"]');if(!n||!d||!o)return;const r=D(n.value,0),l=Math.max(0,D(d.value,0));o.value=String(Ft(r,l))},s=i=>{const n=i.target.closest("[data-db-field]");if(!n)return;const d=n.closest("tr[data-fare-id]");if(!d)return;const o=d.dataset.fareId,r=n.dataset.dbField,l=et.find(v=>v.id===o);if(!l||!r)return;const m=n.value,c=_a(r,m),p=r==="commission"?ee(l):Va(r,l[r]),u=c!==p,g={...G[o]||{}};if(u?g[r]=c:delete g[r],r==="agentId"){const v=d.querySelector('[data-db-field="commission"]'),w=Le(c,0);v&&(v.value=String(w));const I=ee(l);w!==I?g.commission=w:delete g.commission,a(d)}Object.keys(g).length?G[o]=g:delete G[o],(r==="specialRate"||r==="commission")&&a(d),e(o),At()};t.addEventListener("input",s),t.addEventListener("change",i=>{s(i);const n=i.target.closest("#database-select-all");if(n){t.querySelectorAll("input[data-db-select]").forEach(o=>{o.checked=n.checked;const r=o.dataset.dbSelect;r&&(n.checked?tt.add(r):tt.delete(r))}),At();return}const d=i.target.closest("input[data-db-select]");if(d){const o=d.dataset.dbSelect;if(!o)return;d.checked?tt.add(o):tt.delete(o),At()}}),t.addEventListener("click",async i=>{const n=i.target.closest("[data-db-action]");if(!n)return;const d=n.dataset.dbAction,o=n.dataset.id;if(o){if(d==="save"){n.disabled=!0,await ke(o)||(n.disabled=!1),O();return}if(d==="reset"){delete G[o],O();return}if(d==="delete"){if(!confirm("Delete this fare row? This cannot be undone."))return;n.disabled=!0;try{await ne(o),et=et.filter(r=>r.id!==o),delete G[o],tt.delete(o),b("success","Deleted","Fare row removed."),O()}catch(r){b("error","Delete Failed",r.message),n.disabled=!1}}}})}function Ga(t){if(!t||t.dataset.controlsWired)return;t.dataset.controlsWired="1";const e=document.getElementById("database-search"),a=document.getElementById("database-agent-filter"),s=document.getElementById("database-sector-filter"),i=document.getElementById("database-airline-filter"),n=document.getElementById("database-status-filter"),d=document.getElementById("database-start-date"),o=document.getElementById("database-end-date"),r=document.getElementById("database-limit"),l=document.getElementById("database-clear-filters"),m=document.getElementById("database-refresh-btn"),c=document.getElementById("database-save-all-btn"),p=document.getElementById("database-delete-selected-btn"),u=document.getElementById("database-add-row-btn");e&&e.addEventListener("input",g=>{T.search=g.target.value||"",x.databaseFares=1,O()}),a&&a.addEventListener("change",g=>{T.agentId=g.target.value||"all",x.databaseFares=1,O()}),s&&s.addEventListener("change",g=>{T.sectorId=g.target.value||"all",x.databaseFares=1,O()}),i&&i.addEventListener("change",g=>{T.airlineId=g.target.value||"all",x.databaseFares=1,O()}),n&&n.addEventListener("change",g=>{T.status=g.target.value||"all",x.databaseFares=1,O()}),d&&d.addEventListener("change",g=>{T.startDate=g.target.value||"",x.databaseFares=1,O()}),o&&o.addEventListener("change",g=>{T.endDate=g.target.value||"",x.databaseFares=1,O()}),r&&(r.value=String(V.databaseFares),r.addEventListener("change",g=>{V.databaseFares=parseInt(g.target.value,10)||20,x.databaseFares=1,O()})),l&&l.addEventListener("click",()=>{T.search="",T.agentId="all",T.sectorId="all",T.airlineId="all",T.status="all",T.startDate="",T.endDate="",e&&(e.value=""),a&&(a.value="all"),s&&(s.value="all"),i&&(i.value="all"),n&&(n.value="all"),d&&(d.value=""),o&&(o.value=""),x.databaseFares=1,O()}),m&&m.addEventListener("click",async()=>{const g=m.innerHTML;m.disabled=!0,m.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing...',await re(!0),m.disabled=!1,m.innerHTML=g}),c&&c.addEventListener("click",Ya),p&&p.addEventListener("click",Xa),u&&u.addEventListener("click",Ka)}async function re(t=!0){const e=document.getElementById("database-tab");if(!e)return;if(Ga(e),Wa(),za(),t||!e.dataset.loaded)try{et=await Ot({includeHidden:!0}),G={},tt=new Set,x.databaseFares=1,e.dataset.loaded="1"}catch(s){b("error","Load Failed",s.message),et=[]}O()}function Ja(){const{agentNameById:t,sectorCodeById:e,airlineLabelById:a}=Oa(),s=T.search.trim().toLowerCase(),i=Ia(T.startDate),n=$a(T.endDate),d=et.map(l=>Te(l)).filter(l=>{var p,u;if(T.agentId!=="all"&&l.agentId!==T.agentId||T.sectorId!=="all"&&l.sectorId!==T.sectorId||T.airlineId!=="all"&&l.airlineId!==T.airlineId||T.status==="live"&&l.isHidden||T.status==="hidden"&&!l.isHidden)return!1;const m=((u=(p=Mt(l.flightDate))==null?void 0:p.getTime)==null?void 0:u.call(p))||null;return i!==null&&(m===null||m<i)||n!==null&&(m===null||m>n)?!1:s?[l.id,_t(l.flightDate),l.flightTime,l.specialRate,l.finalRate,l.commission,l.baggage,l.extraBaggage,l.isHidden?"hidden":"live",l.agentId,l.sectorId,l.airlineId,t[l.agentId]||"",e[l.sectorId]||"",a[l.airlineId]||""].join(" ").toLowerCase().includes(s):!0}),{key:o,asc:r}=st.databaseFares;return d.sort((l,m)=>{const c=g=>{var v,w;return o==="agentId"?(t[g.agentId]||g.agentId||"").toLowerCase():o==="sectorId"?(e[g.sectorId]||g.sectorId||"").toLowerCase():o==="airlineId"?(a[g.airlineId]||g.airlineId||"").toLowerCase():o==="flightDate"?((w=(v=Mt(g.flightDate))==null?void 0:v.getTime)==null?void 0:w.call(v))||0:o==="isHidden"?g.isHidden?1:0:g[o]};let p=c(l),u=c(m);return typeof p=="string"&&(p=p.toLowerCase()),typeof u=="string"&&(u=u.toLowerCase()),p<u?r?-1:1:p>u?r?1:-1:0})}function O(){const t=document.getElementById("database-table-wrap");if(!t)return;const e=Ja(),a=document.getElementById("database-total-count");a&&(a.textContent=e.length.toLocaleString());const s=V.databaseFares,i=Math.max(1,Math.ceil(e.length/s));x.databaseFares>i&&(x.databaseFares=i);const n=(x.databaseFares-1)*s,d=e.slice(n,n+s);if(!d.length){t.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-database"></i>
        </div>
        <p class="admin-empty-state-title">No fares matched your filter</p>
      </div>
    </div>`,St("databaseFares",e.length,i,n,s),At();return}const o=(p,u)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="databaseFares" data-sort-key="${p}">
      ${u} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i>
    </th>`,r=p=>z.map(u=>`<option value="${$(u.id)}" ${u.id===p?"selected":""}>${$(u.id)} · ${$(u.name||"Unnamed")}</option>`).join(""),l=p=>M.map(u=>`<option value="${$(u.id)}" ${u.id===p?"selected":""}>${$(u.sectorCode||u.id)}</option>`).join(""),m=p=>U.map(u=>`<option value="${$(u.id)}" ${u.id===p?"selected":""}>${$(u.code||"—")} · ${$(u.name||"Unnamed")}</option>`).join(""),c=d.length>0&&d.every(p=>tt.has(p.id));t.innerHTML=`
    <table class="admin-database-table">
      <thead>
        <tr>
          <th class="w-[36px] text-center"><input id="database-select-all" type="checkbox" ${c?"checked":""}></th>
          <th class="w-[56px]">#</th>
          ${o("agentId","Agent")}
          ${o("sectorId","Sector Code")}
          ${o("flightDate","Date")}
          ${o("flightTime","Time")}
          ${o("airlineId","Flight Code")}
          ${o("baggage","Baggage")}
          ${o("extraBaggage","Extra Baggage")}
          ${o("specialRate","SP Rate")}
          ${o("commission","Commission")}
          ${o("finalRate","Rate")}
          ${o("isHidden","Status")}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${d.map((p,u)=>{const g=!!G[p.id],v=tt.has(p.id);return`
            <tr data-fare-id="${p.id}" class="${g?"admin-database-row-dirty":""}">
              <td class="text-center">
                <input type="checkbox" data-db-select="${p.id}" ${v?"checked":""}>
              </td>
              <td class="font-mono text-[11px] text-text-soft">${n+u+1}</td>
              <td>
                <select data-db-field="agentId" class="db-cell-select min-w-[180px]">
                  <option value="">Select Agent</option>
                  ${r(p.agentId)}
                </select>
              </td>
              <td>
                <select data-db-field="sectorId" class="db-cell-select min-w-[140px]">
                  <option value="">Select Sector</option>
                  ${l(p.sectorId)}
                </select>
              </td>
              <td>
                <input type="date" data-db-field="flightDate" class="db-cell-input" value="${_t(p.flightDate)}">
              </td>
              <td>
                <input type="text" data-db-field="flightTime" class="db-cell-input min-w-[128px]" value="${$(p.flightTime||"")}" placeholder="04:05 - 11:10">
              </td>
              <td>
                <select data-db-field="airlineId" class="db-cell-select min-w-[170px]">
                  <option value="">No Airline</option>
                  ${m(p.airlineId)}
                </select>
              </td>
              <td>
                <select data-db-field="baggage" class="db-cell-select min-w-[110px]">
                  ${$t(Dt,ut(p.baggage))}
                </select>
              </td>
              <td>
                <select data-db-field="extraBaggage" class="db-cell-select min-w-[110px]">
                  ${$t(Dt,D(p.extraBaggage,0))}
                </select>
              </td>
              <td>
                <input type="number" data-db-field="specialRate" class="db-cell-input db-cell-num" value="${D(p.specialRate,0)}" min="0" step="1">
              </td>
              <td>
                <input type="number" data-db-field="commission" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${D(p.commission,0)}" min="0" step="1" readonly tabindex="-1">
              </td>
              <td>
                <input type="number" data-db-field="finalRate" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${D(p.finalRate,0)}" min="0" step="1" readonly tabindex="-1">
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
  `,St("databaseFares",e.length,i,n,s),Nt("databaseFares"),At()}async function ke(t,{silent:e=!1}={}){const a=et.find(m=>m.id===t);if(!a)return!1;if(!G[t])return!0;const i=Te(a),n=Mt(i.flightDate);if(!i.agentId)return e||b("warning","Missing Agent","Please select an agent before saving."),!1;if(!i.sectorId)return e||b("warning","Missing Sector","Please select a sector before saving."),!1;if(!n)return e||b("warning","Missing Date","Please set a valid flight date before saving."),!1;const d=D(i.specialRate,0),o=Math.max(0,D(i.commission,0)),r=Ft(d,o),l={agentId:i.agentId,sectorId:i.sectorId,airlineId:i.airlineId||"",flightDate:n,flightTime:i.flightTime||"",specialRate:d,finalRate:r,commission:o,baggage:ut(i.baggage),extraBaggage:D(i.extraBaggage,0),isHidden:i.isHidden===!0};try{return await ye(t,l),et=et.map(m=>m.id===t?{...m,...l}:m),delete G[t],e||b("success","Saved","Fare row updated."),!0}catch(m){return e||b("error","Save Failed",m.message),!1}}async function Ya(){const t=Object.keys(G);if(!t.length)return;const e=document.getElementById("database-save-all-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Saving...');let s=0,i=0;for(const n of t)await ke(n,{silent:!0})?s+=1:i+=1;O(),e&&(e.disabled=Ae()===0,e.innerHTML=a||"Save All"),i===0?b("success","Saved",`${s} row${s!==1?"s":""} updated.`):b("warning","Partial Save",`${s} saved, ${i} failed. Fix invalid rows and retry.`)}async function Xa(){const t=Array.from(tt);if(!t.length||!confirm(`Delete ${t.length} selected fare row${t.length!==1?"s":""}? This cannot be undone.`))return;const e=document.getElementById("database-delete-selected-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Deleting...');const s=await Promise.allSettled(t.map(d=>ne(d))),i=[];let n=0;if(s.forEach((d,o)=>{d.status==="fulfilled"?i.push(t[o]):n+=1}),i.length){const d=new Set(i);et=et.filter(o=>!d.has(o.id)),i.forEach(o=>{delete G[o],tt.delete(o)})}O(),e&&(e.innerHTML=a||"Delete Selected"),n===0?b("success","Deleted",`${i.length} row${i.length!==1?"s":""} deleted.`):b("warning","Partial Delete",`${i.length} deleted, ${n} failed.`)}function Ka(){const t=_t(new Date);it("Add Fare Row",`
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
            ${z.map(r=>`<option value="${$(r.id)}">${$(r.id)} · ${$(r.name||"Unnamed")}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Sector *</label>
          <select id="db-add-sector" class="admin-control h-10" required>
            <option value="">Select Sector</option>
            ${M.map(r=>`<option value="${$(r.id)}">${$(r.sectorCode||r.id)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Airline</label>
          <select id="db-add-airline" class="admin-control h-10">
            <option value="">No Airline</option>
            ${U.map(r=>`<option value="${$(r.id)}">${$(r.code||"—")} · ${$(r.name||"Unnamed")}</option>`).join("")}
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
            ${$t(Dt,30)}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Extra Baggage (kg)</label>
          <select id="db-add-exbag" class="admin-control h-10">
            ${$t(Dt,20)}
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
  `);const e=document.getElementById("database-add-form");if(!e)return;const a=document.getElementById("db-add-sp"),s=document.getElementById("db-add-comm"),i=document.getElementById("db-add-rate"),n=document.getElementById("db-add-agent"),d=()=>{if(!i)return;const r=D(a==null?void 0:a.value,0),l=Math.max(0,D(s==null?void 0:s.value,0));i.value=String(Ft(r,l))},o=()=>{if(!s)return;const r=Le(n==null?void 0:n.value,0);s.value=String(r),d()};a==null||a.addEventListener("input",d),n==null||n.addEventListener("change",o),o(),d(),e.addEventListener("submit",async r=>{var c,p,u,g,v,w,I,B,f,h,E,L;r.preventDefault();const l=e.querySelector('button[type="submit"]'),m=(l==null?void 0:l.textContent)||"Add Fare";l&&(l.disabled=!0,l.textContent="Adding...");try{const N=((c=document.getElementById("db-add-date"))==null?void 0:c.value)||"",W=Ee(N);if(!W)throw new Error("Please provide a valid flight date.");const Y=D((p=document.getElementById("db-add-sp"))==null?void 0:p.value,0),K=Math.max(0,D((u=document.getElementById("db-add-comm"))==null?void 0:u.value,0)),Z=Ft(Y,K);await xa({agentId:((g=document.getElementById("db-add-agent"))==null?void 0:g.value)||"",sectorId:((v=document.getElementById("db-add-sector"))==null?void 0:v.value)||"",airlineId:((w=document.getElementById("db-add-airline"))==null?void 0:w.value)||"",flightDate:W,flightTime:((B=(I=document.getElementById("db-add-time"))==null?void 0:I.value)==null?void 0:B.trim())||"",specialRate:Y,finalRate:Z,commission:K,baggage:ut((f=document.getElementById("db-add-bag"))==null?void 0:f.value),extraBaggage:D((h=document.getElementById("db-add-exbag"))==null?void 0:h.value,0),isHidden:(((E=document.getElementById("db-add-status"))==null?void 0:E.value)||"live")==="hidden"}),(L=document.getElementById("admin-modal"))==null||L.close(),await re(!0),b("success","Added","New fare row added.")}catch(N){b("error","Add Failed",N.message),l&&(l.disabled=!1,l.textContent=m)}})}const Za="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",Qa={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},fe=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let J=null,ct=JSON.parse(localStorage.getItem("zt_hist")||"[]"),de=ct.reduce((t,e)=>t+(e.rows||0),0);function tn(){var e,a,s,i;const t=document.getElementById("rateData");t&&t.addEventListener("input",function(){const n=this.value.length,d=document.getElementById("charCount");d&&(d.textContent=n.toLocaleString()+" character"+(n!==1?"s":"")),mt(),clearTimeout(window._previewTimer),n>15?window._previewTimer=setTimeout(()=>an(this.value),500):qt()}),(e=document.getElementById("resetBtn"))==null||e.addEventListener("click",()=>{t&&(t.value="");const n=document.getElementById("charCount");n&&(n.textContent="0 characters"),qt(),mt()}),(a=document.getElementById("clearBtn"))==null||a.addEventListener("click",()=>{ct=[],de=0,Pt(),Lt(),ae()}),(s=document.getElementById("manualAgent"))==null||s.addEventListener("input",function(){const n=parseInt(this.value);J=n>0?String(n):null,document.querySelectorAll(".rp-chip").forEach(d=>d.classList.remove("on")),Rt(),mt()}),(i=document.getElementById("submitBtn"))==null||i.addEventListener("click",nn),ae(),Lt()}function De(){const t=document.getElementById("chipGrid");if(!t)return;t.innerHTML="";const e=z.length?[...z].sort((a,s)=>{const i=parseInt(a.id),n=parseInt(s.id);return!isNaN(i)&&!isNaN(n)?i-n:a.id.localeCompare(s.id)}):[];if(!e.length){J=null,t.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>',Rt(),mt();return}J&&!e.some(a=>a.id===J)&&(J=null),e.forEach(a=>{const s=document.createElement("div");s.className="rp-chip",s.dataset.agentId=a.id,s.textContent=a.id,a.id===J&&s.classList.add("on"),s.addEventListener("click",()=>en(a.id,a.name,s)),t.appendChild(s)}),Rt(),mt()}function en(t,e,a){J=t,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(s=>{s.classList.remove("on")}),a&&a.classList.add("on"),Rt(),mt()}function Rt(){const t=document.getElementById("agentPill");if(t)if(J){const e=z.find(a=>a.id===J);t.textContent=`Agent ${(e==null?void 0:e.id)||J} selected ✓`,t.classList.remove("empty")}else t.textContent="Select an agent to continue",t.classList.add("empty")}function mt(){const t=document.getElementById("rateData"),e=document.getElementById("submitBtn");e&&(e.disabled=!(J&&t&&t.value.trim().length>10))}function Me(t){const e=[];let a=null,s="IX";for(const i of t.split(`
`)){const n=i.replace(/[*_~`]/g,"").trim();if(!n)continue;const d=n.match(/([A-Z]{3})\s+([A-Z]{3})/);if(d&&n.length<70&&!n.match(/\d{4,6}/)){a=d[1]+"-"+d[2];const o=n.match(fe);o&&(s=o[1]);continue}if(a){const o=n.match(fe);if(o&&!n.match(/\d{4,6}/)){s=o[1];continue}const r=n.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(r){const l=parseInt(r[3]);l>=1e3&&l<=99999&&e.push({sector:a,date:`2026-${Qa[r[2].toUpperCase()]}-${r[1].padStart(2,"0")}`,airline:o?o[1]:s,rate:l})}}}return e}function an(t){const e=Me(t);if(!e.length){qt();return}const a=document.getElementById("prevBox");a&&a.classList.add("on");const s=document.getElementById("prevCount");s&&(s.textContent=e.length+" entr"+(e.length===1?"y":"ies"));const i=document.getElementById("prevBody");i&&(i.innerHTML=e.slice(0,60).map(n=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${n.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${n.rate.toLocaleString()}</td></tr>`).join(""),e.length>60&&(i.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${e.length-60} more</td></tr>`))}function qt(){var t;(t=document.getElementById("prevBox"))==null||t.classList.remove("on")}async function nn(){const t=document.getElementById("rateData");if(!J||!(t!=null&&t.value.trim()))return;const e=document.getElementById("submitBtn"),a=e.innerHTML;e.disabled=!0,e.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI pipeline...';const s=document.getElementById("progBar"),i=document.getElementById("progFill");s&&s.classList.add("on");let n=0;const d=setInterval(()=>{n=Math.min(n+Math.random()*13,85),i&&(i.style.width=n+"%")},280),o=Me(t.value),r={id:Date.now(),agent:J,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:o.length,status:"pen"};ct.unshift(r),ct.length>15&&ct.pop(),Pt(),Lt();try{const l=await fetch(Za,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:J,raw_text:t.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(d),i&&(i.style.width="100%"),l.ok)r.status="ok",de+=o.length,Pt(),Lt(),ae(),b("success","Submitted","Rates sent to the AI parser. Firestore will update in a moment."),setTimeout(()=>{t.value="";const m=document.getElementById("charCount");m&&(m.textContent="0 characters"),qt(),mt()},500);else throw new Error("N8N webhook rejected payload")}catch(l){clearInterval(d),i&&(i.style.width="100%"),r.status="err",Pt(),Lt(),b("error","Submission Failed",l.message)}setTimeout(()=>{s&&s.classList.remove("on"),i&&(i.style.width="0%"),e.innerHTML=a,mt()},900)}function ae(){const t=document.getElementById("statSubs");t&&(t.textContent=ct.length);const e=document.getElementById("statEntries");e&&(e.textContent=de)}function Pt(){localStorage.setItem("zt_hist",JSON.stringify(ct))}function Lt(){const t=document.getElementById("historyWrap");if(t){if(!ct.length){t.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}t.innerHTML=ct.map(e=>{var s;const a=((s=z.find(i=>i.id===e.agent))==null?void 0:s.name)||`Agent ${e.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${a.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${a}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${e.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${e.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${e.status==="ok"?"bg-green-500":e.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}const sn=210/25.4*96,on=297/25.4*96;function be(){const t=document.getElementById("eticket-output-wrapper"),e=document.getElementById("eticket-print-area");if(!t||!e||t.classList.contains("hidden"))return;e.style.zoom="1",e.style.removeProperty("--eticket-print-scale");const a=Math.max(e.scrollWidth,e.offsetWidth),s=Math.max(e.scrollHeight,e.offsetHeight);if(!a||!s)return;const i=sn/a,n=on/s;let d=Math.min(1,i,n);d<1&&(d=Math.max(.7,d*.985)),e.style.zoom=String(d),e.style.setProperty("--eticket-print-scale",String(d))}function rn(){const t=document.getElementById("eticket-print-area");t&&(t.style.zoom="1",t.style.removeProperty("--eticket-print-scale"))}async function dn(){var o;const t=document.getElementById("eticket-tab");if(!t)return;const e=document.getElementById("eticket-form"),a=document.getElementById("et-add-passenger"),s=document.getElementById("et-passengers-container"),i=document.getElementById("et-airline"),n=document.getElementById("et-origin"),d=document.getElementById("et-destination");if(U.length===0&&(U=await ie()),M.length===0&&(M=oe(await se())),!t.dataset.wired){if(t.dataset.wired="1",i&&U&&(i.innerHTML='<option value="">Select Airline</option>'+U.map(l=>`<option value="${l.name}">${l.name}</option>`).join("")),n&&M){const l=[...new Set(M.map(m=>m.sectorFrom).filter(Boolean))].sort();n.innerHTML='<option value="">Select Origin</option>'+l.map(m=>`<option value="${m}">${m}</option>`).join("")}if(d&&M){const l=[...new Set(M.map(m=>m.sectorTo).filter(Boolean))].sort();d.innerHTML='<option value="">Select Destination</option>'+l.map(m=>`<option value="${m}">${m}</option>`).join("")}const r=()=>{const l=Array.from(s.querySelectorAll(".et-pax-row"));l.forEach((m,c)=>{const p=m.querySelector(".et-passenger-index");p&&(p.textContent=`Passenger ${c+1}`);const u=m.querySelector(".et-remove-passenger");u&&(l.length<=1?(u.classList.add("opacity-40","pointer-events-none"),u.setAttribute("aria-disabled","true")):(u.classList.remove("opacity-40","pointer-events-none"),u.removeAttribute("aria-disabled")))})};a==null||a.addEventListener("click",()=>{const l=`
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
                ${$t(Ea,7)}
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Check-in Bag</label>
              <select name="paxCheckBag[]" class="admin-control h-10">
                ${$t(Dt,30)}
              </select>
            </div>
          </div>
        </div>
      `;s.insertAdjacentHTML("beforeend",l),r()}),s==null||s.addEventListener("click",l=>{var c;const m=l.target.closest(".et-remove-passenger");m&&((c=m.closest(".et-pax-row"))==null||c.remove(),r())}),s.children.length===0&&(a==null||a.click()),r(),e==null||e.addEventListener("submit",async l=>{l.preventDefault(),await ln(new FormData(e))}),(o=document.getElementById("et-print-btn"))==null||o.addEventListener("click",()=>{be(),requestAnimationFrame(()=>window.print())}),window.addEventListener("beforeprint",be),window.addEventListener("afterprint",rn),e==null||e.addEventListener("reset",()=>{setTimeout(()=>{var l;Array.from(s.children).forEach((m,c)=>{c>0&&m.remove()}),s.children.length===0&&(a==null||a.click()),r(),(l=document.getElementById("eticket-output-wrapper"))==null||l.classList.add("hidden")},10),b("info","Form Reset","The E-Ticket form has been cleared.")})}}async function ln(t){var Ct,q,F;const e=(Ct=t.get("etPnr"))==null?void 0:Ct.toUpperCase(),a=(q=t.get("etAirline"))==null?void 0:q.toUpperCase(),s=(F=t.get("etFlightNo"))==null?void 0:F.toUpperCase(),i=t.get("etDate"),n=t.get("etDepTime"),d=t.get("etArrTime"),o=t.get("etPhone"),r=(S="")=>String(S).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),l=S=>{const R=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec(S||"");return R?Number(R[1])*60+Number(R[2]):null},m=(S="")=>S.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",c=S=>{const R=(S||"").trim();let H=R,xt="";const X=R.match(/^(.*?)\s*\((.*?)\)$/);return X&&(H=X[1].trim(),xt=X[2].trim()),{city:H,code:xt}},p=c(t.get("etOrigin")),u=c(t.get("etDest")),g=t.get("etOrigin")||"—",v=t.get("etDest")||"—";let w="—";if(i){const S=new Date(i);if(!isNaN(S.getTime())){const R=["SUN","MON","TUE","WED","THU","FRI","SAT"],H=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];w=`${R[S.getDay()]}, ${String(S.getDate()).padStart(2,"0")} ${H[S.getMonth()]} ${S.getFullYear()}`}}const I=S=>document.getElementById(S);let B=p.code,f=u.code,h=null;if(typeof M<"u"){if(h=M.find(S=>S.sectorFrom===g&&S.sectorTo===v),!h&&g){const S=M.find(R=>R.sectorFrom===g);S&&S.sectorCode&&(B=S.sectorCode.split(/[ -]+/)[0])}if(!h&&v){const S=M.find(R=>R.sectorTo===v);S&&S.sectorCode&&(f=S.sectorCode.split(/[ -]+/).pop())}}const E=(B||m(p.city)).toUpperCase(),L=(f||m(u.city)).toUpperCase(),N=`${E} - ${L}`,W=`${(p.city||g).toUpperCase()} to ${(u.city||v).toUpperCase()}`,Y=(p.city||g).toUpperCase(),K=(u.city||v).toUpperCase(),Z=l(n),pt=l(d);let gt="N/A";if(Z!==null&&pt!==null){let S=pt-Z;S<0&&(S+=24*60);const R=Math.floor(S/60),H=S%60;gt=`${R}h ${String(H).padStart(2,"0")}m`}I("t-pnr")&&(I("t-pnr").textContent=e||"—"),I("t-issued-by")&&(I("t-issued-by").textContent=a||"—"),I("t-customer-phone")&&(I("t-customer-phone").textContent=o||"—"),I("t-flight-code")&&(I("t-flight-code").textContent=s||"—"),I("t-travel-date")&&(I("t-travel-date").textContent=w||"—"),I("t-route-code")&&(I("t-route-code").textContent=N),I("t-route-long")&&(I("t-route-long").textContent=W),I("t-duration")&&(I("t-duration").textContent=gt);const y=new Date,C=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],A=`${String(y.getDate()).padStart(2,"0")} ${C[y.getMonth()]} ${y.getFullYear()} ${String(y.getHours()).padStart(2,"0")}:${String(y.getMinutes()).padStart(2,"0")}`;I("t-booked-on")&&(I("t-booked-on").textContent=A);const j=I("t-airline-logo"),k=I("t-issued-by-fallback");if(j){const S=typeof U<"u"?U.find(R=>R.name.toUpperCase()===a):null;S&&S.logoUrl?(j.src=S.logoUrl,j.classList.remove("hidden"),k&&k.classList.add("hidden")):(j.removeAttribute("src"),j.classList.add("hidden"),k&&(k.classList.remove("hidden"),k.textContent=(a||"No logo").toUpperCase()))}const Bt=t.getAll("paxTitle[]"),Q=t.getAll("paxName[]"),yt=t.getAll("paxType[]"),ft=t.getAll("paxCheckBag[]"),at=t.getAll("paxCarryBag[]");I("t-pax-count")&&(I("t-pax-count").textContent=String(Q.length));const _=document.getElementById("t-passengers-tbody");if(_){const S=Q.map((R,H)=>{const xt=r((Bt[H]||"MR").toUpperCase()),X=r((Q[H]||"").toUpperCase()),Gt=r((yt[H]||"ADT").toUpperCase()),Ht=r(pe(ft[H])),wt=r(pe(at[H])),Et=h&&h.sectorCode?r(h.sectorCode.toUpperCase()):r(N);return`
        <tr class="${H%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${H+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${xt}. ${X}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Gt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Et}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${r(s||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${r(e||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${wt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Ht}</td>
        </tr>
      `}).join("");_.innerHTML=S||`
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `}const nt=document.getElementById("t-travel-tbody");nt&&(nt.innerHTML=`
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${r(s||"—")}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${r(Y)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${r(E)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${r(n||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${r(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${r(K)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${r(L)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${r(d||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${r(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const vt=document.getElementById("eticket-output-wrapper");vt&&(vt.classList.remove("hidden"),vt.scrollIntoView({behavior:"smooth"}))}const he={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function b(t,e,a){const s=document.getElementById("toastsEl");if(!s)return;const i=document.createElement("div"),n={success:"border-emerald-200 bg-emerald-50/95 text-emerald-900",error:"border-rose-200 bg-rose-50/95 text-rose-900",warning:"border-amber-200 bg-amber-50/95 text-amber-900",info:"border-blue-200 bg-blue-50/95 text-blue-900"};i.className=`flex items-start gap-3 p-4 border rounded-xl shadow-md w-80 pointer-events-auto backdrop-blur-sm ${n[t]||n.error}`,i.innerHTML=`<div class="mt-0.5">${he[t]||he.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${e}</div><div class="text-xs opacity-90 mt-1">${a}</div></div>
    <button class="opacity-50 hover:opacity-100 transition-opacity" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,s.appendChild(i),setTimeout(()=>i.isConnected&&i.remove(),7e3)}window.toast=b;document.addEventListener("DOMContentLoaded",()=>{});async function ot(t=!0){if(t)try{const[n,d,o,r]=await Promise.all([xe(),ea(),aa(),na()]);Ut=n,Xt=d,Kt=o,Zt=r,x.visas=1,x.visaStampings=1,x.attestations=1,x.passportServices=1}catch(n){b("error","Error loading Visas tab data",n.message)}const e=document.querySelector("#visas-tab #visas-table-body");if(e){const n=rt(Ut,"visas"),d=V.visas,o=Math.max(1,Math.ceil(n.length/d));x.visas>o&&(x.visas=o);const r=(x.visas-1)*d,l=n.slice(r,r+d);e.innerHTML=l.length?l.map(m=>mn(m)).join(""):'<tr><td colspan="6" class="text-center py-8 text-text-muted">No tourist visas yet. Click "Add Tourist Visa".</td></tr>',un()}const a=document.querySelector("#visa-stamping-table-body");if(a){const n=rt(Xt,"visaStampings"),d=V.visaStampings,o=Math.max(1,Math.ceil(n.length/d));x.visaStampings>o&&(x.visaStampings=o);const r=(x.visaStampings-1)*d,l=n.slice(r,r+d);a.innerHTML=l.length?l.map(m=>pn(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No visa stampings yet. Click "Add Visa Stamping".</td></tr>',gn()}const s=document.querySelector("#attestations-table-body");if(s){const n=rt(Kt,"attestations"),d=V.attestations,o=Math.max(1,Math.ceil(n.length/d));x.attestations>o&&(x.attestations=o);const r=(x.attestations-1)*d,l=n.slice(r,r+d);s.innerHTML=l.length?l.map(m=>fn(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No attestations yet. Click "Add Attestation".</td></tr>',bn()}const i=document.querySelector("#passport-services-table-body");if(i){const n=rt(Zt,"passportServices"),d=V.passportServices,o=Math.max(1,Math.ceil(n.length/d));x.passportServices>o&&(x.passportServices=o);const r=(x.passportServices-1)*d,l=n.slice(r,r+d);i.innerHTML=l.length?l.map(m=>hn(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No passport services yet. Click "Add Passport Service".</td></tr>',yn()}cn()}function cn(){const t=document.getElementById("visas-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>je(null)));const e=document.getElementById("visa-stamping-add-btn");e&&!e.dataset.wired&&(e.dataset.wired="1",e.addEventListener("click",()=>Fe(null)));const a=document.getElementById("attestation-add-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",()=>Re(null)));const s=document.getElementById("passport-service-add-btn");s&&!s.dataset.wired&&(s.dataset.wired="1",s.addEventListener("click",()=>Ne(null)))}function mn(t){const e=t.flagUrl?`<span class="admin-logo-wrap"><img src="${t.flagUrl}" alt="${$(t.countryName||"Country")}"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-flag"></i></span></span>';return`<tr data-visa-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy">${$(t.countryName)}</td>
    <td class="text-text-muted text-[13px]">${$(t.visaType)}</td>
    <td class="text-text-muted text-[13px]">${$(t.processingTime)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.rate||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function un(){const t=document.querySelector("#visas-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Ut.find(d=>d.id===i);if(s==="edit-visa"&&je(n),s==="delete-visa"){if(!confirm(`Delete visa for "${n==null?void 0:n.countryName}"?`))return;try{await sa(i),b("success","Deleted",`Visa for "${n==null?void 0:n.countryName}" removed.`),await ot()}catch(d){b("error","Error",d.message)}}}))}function je(t){const e=document.getElementById("modal-visa-form");if(!e)return;it(t?"Edit Visa":"Add New Visa",e.innerHTML);const a=document.getElementById("visa-form"),s=document.getElementById("visa-id"),i=document.getElementById("visa-country"),n=document.getElementById("visa-type"),d=document.getElementById("visa-rate"),o=document.getElementById("visa-processing");t&&(s.value=t.id,i.value=t.countryName||"",n.value=t.visaType||"",d.value=t.rate||0,o.value=t.processingTime||""),a.addEventListener("submit",async r=>{r.preventDefault();const l=a.querySelector('button[type="submit"]');l.disabled=!0,l.textContent="Saving...";try{const m=s.value,c={countryName:i.value.trim(),visaType:n.value.trim(),rate:Number(d.value),processingTime:o.value.trim()},u=document.getElementById("visa-flag").files[0];m?await ia(m,c,u):await oa(c,u),b("success","Saved!",`Visa for ${c.countryName} saved.`),document.getElementById("admin-modal").close(),await ot()}catch(m){b("error","Error",m.message),l.disabled=!1,l.textContent="Save Visa"}})}function pn(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${$(t.country)}</td>
    <td class="text-text-muted text-[13px]">${$(t.description)}</td>
    <td class="text-text-muted text-[13px]">${$(t.processingTime)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function gn(){const t=document.getElementById("visa-stamping-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Xt.find(d=>d.id===i);if(s==="edit-visa-stamping"&&Fe(n),s==="delete-visa-stamping"){if(!confirm(`Delete visa stamping for "${n==null?void 0:n.country}"?`))return;try{await ra(i),b("success","Deleted",`Visa Stamping for "${n==null?void 0:n.country}" removed.`),await ot(!0)}catch(d){b("error","Error",d.message)}}}))}function Fe(t){const e=document.getElementById("modal-visa-stamping-form");if(!e)return;it(t?"Edit Visa Stamping":"Add Visa Stamping",e.innerHTML);const a=document.getElementById("visa-stamping-form"),s=document.getElementById("visa-stamping-id"),i=document.getElementById("visa-stamping-country"),n=document.getElementById("visa-stamping-desc"),d=document.getElementById("visa-stamping-time"),o=document.getElementById("visa-stamping-cost");t&&(s.value=t.id,i.value=t.country||"",n.value=t.description||"",d.value=t.processingTime||"",o.value=t.cost||0),a.addEventListener("submit",async r=>{r.preventDefault();const l=a.querySelector('button[type="submit"]');l.disabled=!0,l.textContent="Saving...";try{const m=s.value,c={country:i.value.trim(),description:n.value.trim(),processingTime:d.value.trim(),cost:Number(o.value)};m?await da(m,c):await la(c),b("success","Saved!",`Visa stamping for ${c.country} saved.`),document.getElementById("admin-modal").close(),await ot(!0)}catch(m){b("error","Error",m.message),l.disabled=!1,l.textContent="Save"}})}function fn(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${$(t.country)}</td>
    <td class="text-text-muted text-[13px]">${$(t.certificate)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-attestation" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-attestation" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function bn(){const t=document.getElementById("attestations-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Kt.find(d=>d.id===i);if(s==="edit-attestation"&&Re(n),s==="delete-attestation"){if(!confirm(`Delete attestation for "${n==null?void 0:n.country}"?`))return;try{await ca(i),b("success","Deleted",`Attestation for "${n==null?void 0:n.country}" removed.`),await ot(!0)}catch(d){b("error","Error",d.message)}}}))}function Re(t){const e=document.getElementById("modal-attestation-form");if(!e)return;it(t?"Edit Attestation":"Add Attestation",e.innerHTML);const a=document.getElementById("attestation-form"),s=document.getElementById("attestation-id"),i=document.getElementById("attestation-country"),n=document.getElementById("attestation-cert"),d=document.getElementById("attestation-cost");t&&(s.value=t.id,i.value=t.country||"",n.value=t.certificate||"",d.value=t.cost||0),a.addEventListener("submit",async o=>{o.preventDefault();const r=a.querySelector('button[type="submit"]');r.disabled=!0,r.textContent="Saving...";try{const l=s.value,m={country:i.value.trim(),certificate:n.value.trim(),cost:Number(d.value)};l?await ma(l,m):await ua(m),b("success","Saved!",`Attestation for ${m.country} saved.`),document.getElementById("admin-modal").close(),await ot(!0)}catch(l){b("error","Error",l.message),r.disabled=!1,r.textContent="Save"}})}function hn(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${$(t.type)}</td>
    <td class="text-text-muted text-[13px]">${$(t.description)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function yn(){const t=document.getElementById("passport-services-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Zt.find(d=>d.id===i);if(s==="edit-passport-service"&&Ne(n),s==="delete-passport-service"){if(!confirm(`Delete passport service "${n==null?void 0:n.type}"?`))return;try{await pa(i),b("success","Deleted",`Passport service "${n==null?void 0:n.type}" removed.`),await ot(!0)}catch(d){b("error","Error",d.message)}}}))}function Ne(t){const e=document.getElementById("modal-passport-service-form");if(!e)return;it(t?"Edit Passport Service":"Add Passport Service",e.innerHTML);const a=document.getElementById("passport-service-form"),s=document.getElementById("passport-service-id"),i=document.getElementById("passport-service-type"),n=document.getElementById("passport-service-desc"),d=document.getElementById("passport-service-cost");t&&(s.value=t.id,i.value=t.type||"",n.value=t.description||"",d.value=t.cost||0),a.addEventListener("submit",async o=>{o.preventDefault();const r=a.querySelector('button[type="submit"]');r.disabled=!0,r.textContent="Saving...";try{const l=s.value,m={type:i.value.trim(),description:n.value.trim(),cost:Number(d.value)};l?await ga(l,m):await fa(m),b("success","Saved!",`Passport service ${m.type} saved.`),document.getElementById("admin-modal").close(),await ot(!0)}catch(l){b("error","Error",l.message),r.disabled=!1,r.textContent="Save"}})}async function zt(t=!0){if(t)try{Qt=await ba({includeInactive:!0}),x.tours=1}catch(o){b("error","Error loading Tours",o.message)}const e=document.getElementById("tours-table-body");if(!e)return;const a=rt(Qt,"tours"),s=V.tours,i=Math.max(1,Math.ceil(a.length/s));x.tours>i&&(x.tours=i);const n=(x.tours-1)*s,d=a.slice(n,n+s);e.innerHTML=d.length?d.map(o=>xn(o)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No tour packages yet. Click "Add Tour Package".</td></tr>',wn(),vn()}function vn(){const t=document.getElementById("tours-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>He(null)))}function xn(t){const e=t.coverImageUrl?`<span class="admin-logo-wrap"><img src="${t.coverImageUrl}" alt="${$(t.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>',a=!t.price||t.price===0?'<span class="text-text-muted text-[12px] italic">Call for Price</span>':`<span class="font-black text-[15px] text-navy">₹${Number(t.price).toLocaleString()}</span>`,s=t.isActive!==!1?'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>':'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>';return`<tr data-tour-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy">${$(t.title)}</td>
    <td class="text-text-muted text-[13px]">${$(t.category)}</td>
    <td class="text-text-muted text-[13px]">${$(t.duration)}</td>
    <td>${a}</td>
    <td>${s}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-tour" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-tour" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function wn(){const t=document.getElementById("tours-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=Qt.find(d=>d.id===i);if(s==="edit-tour"&&He(n),s==="delete-tour"){if(!confirm(`Delete tour package "${n==null?void 0:n.title}"?`))return;try{await ha(i),b("success","Deleted",`Tour "${n==null?void 0:n.title}" removed.`),await zt()}catch(d){b("error","Error",d.message)}}}))}function Tt(t=""){return t.split(`
`).map(e=>e.trim()).filter(Boolean)}function kt(t=[]){return Array.isArray(t)?t.join(`
`):""}function He(t){var g;const e=document.getElementById("modal-tour-form");if(!e)return;it(t?"Edit Tour Package":"Add Tour Package",e.innerHTML);const a=document.getElementById("tour-form"),s=document.getElementById("tour-id"),i=document.getElementById("tour-title"),n=document.getElementById("tour-category"),d=document.getElementById("tour-duration"),o=document.getElementById("tour-price"),r=document.getElementById("tour-active"),l=document.getElementById("tour-description"),m=document.getElementById("tour-highlights"),c=document.getElementById("tour-itinerary"),p=document.getElementById("tour-inclusions"),u=document.getElementById("tour-exclusions");t&&(s.value=t.id,i.value=t.title||"",n.value=t.category||"International",d.value=t.duration||"",o.value=t.price||0,r.checked=t.isActive!==!1,l.value=t.description||"",m.value=kt(t.highlights),c.value=(g=t.itinerary)!=null&&g.length?JSON.stringify(t.itinerary,null,2):"",p.value=kt(t.inclusions),u.value=kt(t.exclusions)),a.addEventListener("submit",async v=>{var I;v.preventDefault();const w=a.querySelector('button[type="submit"]');w.disabled=!0,w.textContent="Saving…";try{const B=s.value;let f=[];const h=c.value.trim();if(h)try{f=JSON.parse(h)}catch{b("error","Invalid JSON","Itinerary must be valid JSON. Check the format."),w.disabled=!1,w.textContent="Save Tour";return}const E={title:i.value.trim(),category:n.value,duration:d.value.trim(),price:Number(o.value)||0,isActive:r.checked,description:l.value.trim(),highlights:Tt(m.value),itinerary:f,inclusions:Tt(p.value),exclusions:Tt(u.value)},L=((I=document.getElementById("tour-image"))==null?void 0:I.files[0])||null;B?await ya(B,E,L):await va(E,L),b("success","Saved!",`Tour "${E.title}" saved.`),document.getElementById("admin-modal").close(),await zt()}catch(B){b("error","Error",B.message),w.disabled=!1,w.textContent="Save Tour"}})}async function Wt(t=!0){if(t)try{te=await getHajjUmrahPackages({includeInactive:!0}),x.hajjUmrah=1}catch(o){b("error","Error loading Hajj & Umrah",o.message)}const e=document.getElementById("hajjumrah-table-body");if(!e)return;const a=rt(te,"hajjUmrah"),s=V.hajjUmrah,i=Math.max(1,Math.ceil(a.length/s));x.hajjUmrah>i&&(x.hajjUmrah=i);const n=(x.hajjUmrah-1)*s,d=a.slice(n,n+s);e.innerHTML=d.length?d.map(o=>In(o)).join(""):'<tr><td colspan="10" class="text-center py-8 text-text-muted">No packages yet. Click "Add Package".</td></tr>',$n(),En()}function En(){const t=document.getElementById("hajjumrah-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>Pe(null)))}function In(t){const e=t.coverImageUrl?`<span class="admin-logo-wrap"><img src="${t.coverImageUrl}" alt="${$(t.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>',a=!t.price||t.price===0?'<span class="text-text-muted text-[12px] italic">Call for Price</span>':`<span class="font-black text-[15px] text-navy">₹${Number(t.price).toLocaleString()}</span>`,s=t.isActive!==!1?'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>':'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>',i=t.type==="Hajj"?'<span class="px-2 py-0.5 rounded bg-blue-50 text-primary text-[11px] font-semibold">Hajj</span>':'<span class="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[11px] font-semibold">Umrah</span>';return`<tr data-hajjumrah-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy truncate max-w-[150px]" title="${$(t.title)}">${$(t.title)}</td>
    <td>${i}</td>
    <td class="text-text-muted text-[13px]">${$(t.departureCity)}</td>
    <td class="text-text-muted text-[13px]">${$(t.airline)}</td>
    <td class="text-text-muted text-[13px]">${$(t.departureDate)}</td>
    <td class="text-navy font-medium text-[13px]">${t.days}D/${t.nights}N</td>
    <td>${a}</td>
    <td>${s}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-hajjumrah" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-hajjumrah" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function $n(){const t=document.getElementById("hajjumrah-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=te.find(d=>d.id===i);if(s==="edit-hajjumrah"&&Pe(n),s==="delete-hajjumrah"){if(!confirm(`Delete package "${n==null?void 0:n.title}"?`))return;try{await deleteHajjUmrahPackage(i),b("success","Deleted",`Package "${n==null?void 0:n.title}" removed.`),await Wt()}catch(d){b("error","Error",d.message)}}}))}function Pe(t){const e=document.getElementById("modal-hajjumrah-form");if(!e)return;it(t?"Edit Package":"Add Package",e.innerHTML);const a=document.getElementById("hajjumrah-form"),s=document.getElementById("hajjumrah-id"),i=document.getElementById("hajjumrah-title"),n=document.getElementById("hajjumrah-type"),d=document.getElementById("hajjumrah-city"),o=document.getElementById("hajjumrah-airline"),r=document.getElementById("hajjumrah-date"),l=document.getElementById("hajjumrah-days"),m=document.getElementById("hajjumrah-nights"),c=document.getElementById("hajjumrah-price"),p=document.getElementById("hajjumrah-active"),u=document.getElementById("hajjumrah-description"),g=document.getElementById("hajjumrah-highlights"),v=document.getElementById("hajjumrah-inclusions");t&&(s.value=t.id,i.value=t.title||"",n.value=t.type||"Umrah",d.value=t.departureCity||"",o.value=t.airline||"",r.value=t.departureDate||"",l.value=t.days||15,m.value=t.nights||14,c.value=t.price||0,p.checked=t.isActive!==!1,u.value=t.description||"",g.value=kt(t.highlights),v.value=kt(t.inclusions)),a.addEventListener("submit",async w=>{var B;w.preventDefault();const I=a.querySelector('button[type="submit"]');I.disabled=!0,I.textContent="Saving…";try{const f=s.value,h={title:i.value.trim(),type:n.value,departureCity:d.value.trim(),airline:o.value.trim(),departureDate:r.value.trim(),days:Number(l.value)||1,nights:Number(m.value)||1,price:Number(c.value)||0,isActive:p.checked,description:u.value.trim(),highlights:Tt(g.value),inclusions:Tt(v.value)},E=((B=document.getElementById("hajjumrah-image"))==null?void 0:B.files[0])||null;f?await updateHajjUmrahPackage(f,h,E):await addHajjUmrahPackage(h,E),b("success","Saved!",`Package "${h.title}" saved.`),document.getElementById("admin-modal").close(),await Wt()}catch(f){b("error","Error",f.message),I.disabled=!1,I.textContent="Save Package"}})}
