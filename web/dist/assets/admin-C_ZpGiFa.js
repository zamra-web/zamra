import"./firebase-config-C3FJvAwC.js";import{o as De,l as Me}from"./auth-BH7Zihzs.js";import{a as jt,d as Xt,u as me,c as ue,e as Fe,f as Re,h as Ne,i as He,g as Kt,j as Pe,k as je,l as Ue,m as qe,b as Zt,n as Oe,o as Ve,p as _e,q as ze,r as pe,s as We,t as Ge,v as Je,w as Ye,x as Xe,y as Ke,z as Ze,A as Qe,B as ta,C as ea,D as aa,E as na,F as sa,G as ia,H as oa,I as ra}from"./db-VIz2p67e.js";async function da(t,e,a,i,s){const n=`Generating ${t} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",n),new Promise(async(r,d)=>{try{let ct=function(y,B,A,F,T){c.beginPath(),c.moveTo(y+T,B),c.lineTo(y+A-T,B),c.arcTo(y+A,B,y+A,B+T,T),c.lineTo(y+A,B+F-T),c.arcTo(y+A,B+F,y+A-T,B+F,T),c.lineTo(y+T,B+F),c.arcTo(y,B+F,y,B+F-T,T),c.lineTo(y,B+T),c.arcTo(y,B,y+T,B,T),c.closePath()},ut=function(y){var Ct;const B=y-K;if(B>X){try{z.stop()}catch(q){console.error("Error stopping recorder",q)}return}c.fillStyle="#f8fafc",c.fillRect(0,0,o,l);const A=t==="9x16"?400:300;if(c.fillStyle="#1e293b",c.fillRect(0,0,o,A),C.complete&&C.width>0){c.globalAlpha=.2;const q=Math.max(o/C.width,A/C.height),R=C.width*q,$=C.height*q,N=(o-R)/2,P=(A-$)/2;c.drawImage(C,N,P,R,$),c.globalAlpha=1}const F=c.createLinearGradient(0,0,0,A);F.addColorStop(0,"#1e293b"),F.addColorStop(1,"transparent"),c.fillStyle=F,c.globalAlpha=.8,c.fillRect(0,0,o,A),c.globalAlpha=1,c.textAlign="center",c.textBaseline="middle";const T=c.createLinearGradient(0,0,o,0);T.addColorStop(0,"#2563eb"),T.addColorStop(.5,"#60a5fa"),T.addColorStop(1,"#1558c0"),c.fillStyle=T,c.fillRect(0,0,o,16);const St=200,Z=40,yt=60;c.fillStyle="rgba(37, 99, 235, 0.4)",ct(o/2-St/2,yt,St,Z,20),c.fill(),c.strokeStyle="rgba(37, 99, 235, 0.6)",c.lineWidth=1,c.stroke(),c.fillStyle="#bfdbfe",c.font="bold 16px Arial, sans-serif",c.fillText("EXCLUSIVE DEALS",o/2,yt+Z/2),c.fillStyle="#ffffff",c.font="900 "+(t==="16x9"?"70px":"56px")+" Arial, sans-serif",c.fillText(`${u} → ${g}`,o/2,yt+80),c.fillStyle="#dbeafe",c.font="700 24px Arial, sans-serif",c.fillText("SPECIAL FARES AVAILABLE NOW",o/2,yt+140);const pt=A+60,et=90,V=t==="9x16"?40:t==="1x1"?80:160,at=o-V*2;c.fillStyle="#64748b",c.font="bold 18px Arial, sans-serif",c.textAlign="left",c.fillText("DATE",V+20,pt-20),c.textAlign="center",c.fillText("AIRLINE",V+at*.35,pt-20),c.fillText("TIME",V+at*.65,pt-20),c.textAlign="right",c.fillText("FARE",V+at-20,pt-20);for(let q=0;q<v.length;q++){const R=v[q],$=1e3+q*800;if(B<$)continue;const P=Math.min(1,(B-$)/500),vt=20*(1-P),Y=pt+q*et+vt;c.globalAlpha=P,q%2===0&&(c.fillStyle="#ffffff",ct(V,Y,at,et-10,12),c.fill()),c.fillStyle="#0f172a",c.textBaseline="middle";const Ot=R.flightDate instanceof Date?R.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():R.flightDate;c.textAlign="left",c.font="900 26px Arial, sans-serif",c.fillText(Ot,V+20,Y+et/2-5);const Rt=V+at*.35,xt=h[R.airlineId];if(xt&&xt.width>0){const gt=Math.min(100,xt.width),ie=40;c.drawImage(xt,Rt-gt/2,Y+et/2-5-ie/2,gt,ie)}else{c.font="700 20px Arial, sans-serif",c.textAlign="center";const gt=((Ct=w[R.airlineId])==null?void 0:Ct.name)||R.airlineId||"—";c.fillText(gt,Rt,Y+et/2-5)}let wt=R.flightTime||"—";if(wt.includes("-")){const gt=wt.split("-");wt=`${gt[0].trim()} - ${gt[1].trim()}`}c.font="800 22px Arial, sans-serif",c.textAlign="center",c.fillText(wt,V+at*.65,Y+et/2-5);const Vt=`₹${(R.finalRate||0).toLocaleString()}`;c.font="900 26px Arial, sans-serif",c.textAlign="right";const ke=c.measureText(Vt).width,ae=V+at-20,ne=ke+40,se=50;c.fillStyle="#0f172a",ct(ae-ne,Y+et/2-5-se/2,ne,se,12),c.fill(),c.fillStyle="#ffffff",c.fillText(Vt,ae-20,Y+et/2-5),c.globalAlpha=1}const ht=1e3+v.length*800+500;if(B>ht){const q=Math.min(1,(B-ht)/500);c.globalAlpha=q;const R=100,$=l-R+20*(1-q);c.fillStyle="#ffffff",c.fillRect(0,l-R,o,R),c.fillRect(0,$,o,R),c.fillStyle="#f1f5f9",c.fillRect(0,l-R,o,2),f.complete&&f.width>0&&c.drawImage(f,V,l-R/2-24,48,48),c.fillStyle="#1e293b",c.font="900 24px Arial, sans-serif",c.textAlign="left",c.textBaseline="middle",c.fillText("Zamra Travels",V+64,l-R/2),c.font="700 20px Arial, sans-serif",c.textAlign="right",c.fillText("zamratravels.com  |  +91 98765 43210",o-V,l-R/2),c.globalAlpha=1}requestAnimationFrame(ut)},o,l;if(t==="1x1")o=1080,l=1080;else if(t==="9x16")o=1080,l=1920;else if(t==="16x9")o=1920,l=1080;else throw new Error("Invalid ratio selected");const m=document.createElement("canvas");m.width=o,m.height=l;const c=m.getContext("2d");c.imageSmoothingEnabled=!0;const p=i.find(y=>y.id===a),u=p?(p.sectorFrom||"DEP").toUpperCase():"DEP",g=p?(p.sectorTo||"ARR").toUpperCase():"ARR",v=[...e].sort((y,B)=>{let A=y.flightDate,F=B.flightDate;return A instanceof Date&&(A=A.getTime()),F instanceof Date&&(F=F.getTime()),A-F}).slice(0,10),w={};s.forEach(y=>{y.id&&(w[y.id]=y),y.code&&(w[y.code]=y),y.name&&(w[y.name]=y)});async function I(y){if(!y)return null;try{const B=await fetch(y);if(!B.ok)return null;const A=await B.blob(),F=URL.createObjectURL(A);return new Promise((T,St)=>{const Z=new Image;Z.onload=()=>T(Z),Z.onerror=()=>T(null),Z.src=F})}catch{return null}}const C=new Image;await new Promise(y=>{C.onload=y,C.onerror=y,C.src="/assets/img/hero-bg.webp"});const f=new Image;await new Promise(y=>{f.onload=y,f.onerror=y,f.src="/assets/img/logo.webp"});const h={},E=[...new Set(v.map(y=>y.airlineId))].map(y=>w[y]).filter(y=>y==null?void 0:y.logoUrl);await Promise.all(E.map(async y=>{const B=await I(y.logoUrl);B&&(h[y.id]=B)}));const k=m.captureStream(30);let H="video/mp4";MediaRecorder.isTypeSupported(H)||(H="video/webm; codecs=h264",MediaRecorder.isTypeSupported(H)||(H="video/webm"));const z=new MediaRecorder(k,{mimeType:H}),J=[];z.ondataavailable=y=>{y.data&&y.data.size>0&&J.push(y.data)},z.start(100);const X=1e4+v.length*1500,K=performance.now();requestAnimationFrame(ut),z.onstop=()=>{const y=new Blob(J,{type:H}),B=URL.createObjectURL(y),A=document.createElement("a");A.href=B,A.download=`zamra-video-${t}-${Date.now()}.mp4`,A.style.display="none",document.body.appendChild(A),A.click(),setTimeout(()=>{document.body.removeChild(A),URL.revokeObjectURL(B)},100),window.toast&&window.toast("success","Video Generated",`Your ${t} video has been downloaded!`),r()},z.onerror=y=>{console.error("Recorder Error:",y),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),d(y)}}catch(o){console.error(o),window.toast&&window.toast("error","Generation Failed",o.message),d(o)}})}let _=[],M=[],U=[],Ht=[],zt=[],Wt=[],Gt=[],j=[],tt=[],W={},Q=new Set;function Et(t){return t==null?t:String(t).replace(/damamm/gi,e=>e===e.toUpperCase()?"DAMMAM":e===e.toLowerCase()?"dammam":"Dammam")}function ge(t={}){return{...t,sectorFrom:Et(t.sectorFrom||""),sectorTo:Et(t.sectorTo||""),sectorCode:Et(t.sectorCode||"")}}function Qt(t=[]){return t.map(e=>ge(e))}function S(t=""){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function D(t,e=0){const a=Number(t);return Number.isFinite(a)?a:e}const la=[5,7,10],Lt=[20,25,30,35,40];function $t(t=[],e=0){const a=Math.max(0,lt(e)),i=[...new Set(t.map(n=>Math.max(0,lt(n))))].filter(n=>n>0).sort((n,r)=>n-r);if(!i.length)return"";const s=i.includes(a)?a:i[0];return i.map(n=>`<option value="${n}" ${n===s?"selected":""}>${n} Kg</option>`).join("")}function lt(t){if(t==null||t==="")return 0;const e=parseFloat(String(t).replace(/[^\d.]/g,""));return Number.isFinite(e)?e:0}function oe(t,e="—"){if(t==null||t==="")return e;const a=String(t).trim();return a?/^\d+(\.\d+)?(\s*kg)?$/i.test(a)?`${lt(a)} Kg`:a.toUpperCase():e}function Tt(t){if(!t)return null;if(t instanceof Date)return Number.isNaN(t.getTime())?null:t;const e=new Date(t);return Number.isNaN(e.getTime())?null:e}function Ut(t){const e=Tt(t);if(!e)return"";const a=e.getTimezoneOffset();return new Date(e.getTime()-a*60*1e3).toISOString().split("T")[0]}function fe(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e}function ca(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e.getTime()}function ma(t){if(!t)return null;const e=new Date(`${t}T23:59:59.999`);return Number.isNaN(e.getTime())?null:e.getTime()}let nt={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},visas:{key:"countryName",asc:!0},visaStampings:{key:"countryName",asc:!0},attestations:{key:"countryName",asc:!0},passportServices:{key:"serviceName",asc:!0},reportFares:{key:"flightDate",asc:!0},databaseFares:{key:"flightDate",asc:!0}},qt={agents:"",sectors:"",airlines:"",visas:"",visaStampings:"",attestations:"",passportServices:""},x={agents:1,sectors:1,airlines:1,visas:1,visaStampings:1,attestations:1,passportServices:1,reportFares:1,databaseFares:1};const L={search:"",agentId:"all",sectorId:"all",airlineId:"all",status:"all",startDate:"",endDate:""};function ft(t,e){var r;let a=t;const i=(r=qt[e])==null?void 0:r.toLowerCase();i&&e==="agents"?a=a.filter(d=>(d.name||"").toLowerCase().includes(i)||(d.email||"").toLowerCase().includes(i)||(d.contactPhone||"").toLowerCase().includes(i)||(d.id||"").toLowerCase().includes(i)):i&&e==="sectors"?a=a.filter(d=>(d.sectorFrom||"").toLowerCase().includes(i)||(d.sectorTo||"").toLowerCase().includes(i)||(d.sectorCode||"").toLowerCase().includes(i)):i&&e==="airlines"?a=a.filter(d=>(d.name||"").toLowerCase().includes(i)||(d.code||"").toLowerCase().includes(i)):i&&e==="visas"?a=a.filter(d=>(d.countryName||"").toLowerCase().includes(i)||(d.visaType||"").toLowerCase().includes(i)):i&&e==="visaStampings"?a=a.filter(d=>(d.countryName||"").toLowerCase().includes(i)||(d.description||"").toLowerCase().includes(i)):i&&e==="attestations"?a=a.filter(d=>(d.countryName||"").toLowerCase().includes(i)||(d.certificateType||"").toLowerCase().includes(i)):i&&e==="passportServices"&&(a=a.filter(d=>(d.serviceType||"").toLowerCase().includes(i)||(d.description||"").toLowerCase().includes(i)));const{key:s,asc:n}=nt[e];return s&&(a=[...a].sort((d,o)=>{let l=d[s],m=o[s];if(l instanceof Date&&(l=l.getTime()),m instanceof Date&&(m=m.getTime()),s==="id"){const c=parseInt(l),p=parseInt(m);if(!isNaN(c)&&!isNaN(p))return n?c-p:p-c}return typeof l=="string"&&(l=l.toLowerCase()),typeof m=="string"&&(m=m.toLowerCase()),l<m?n?-1:1:l>m?n?1:-1:0})),a}function Ft(t){document.querySelectorAll(`th[data-sort-tab="${t}"] i`).forEach(a=>{a.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const e=document.querySelector(`th[data-sort-tab="${t}"][data-sort-key="${nt[t].key}"]`);if(e){const a=e.querySelector("i");a&&(a.className=`bi bi-arrow-${nt[t].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",t=>{const e=t.target.closest("th[data-sort-tab]");if(!e)return;const a=e.dataset.sortTab,i=e.dataset.sortKey;nt[a].key===i?nt[a].asc=!nt[a].asc:(nt[a].key=i,nt[a].asc=!0),a==="agents"?it(!1):a==="sectors"?ot(!1):a==="airlines"?bt(!1):a==="visas"?st(!1):a==="reportFares"&&j.length?kt(j):a==="databaseFares"&&O()});document.documentElement.style.visibility="hidden";De(async t=>{if(!t){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const e=document.getElementById("admin-user-name");e&&(e.textContent=t.email.split("@")[0]),await ua(),Se(),await be()});document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("admin-logout-btn");t&&t.addEventListener("click",async()=>{(await Me()).success&&(window.location.href="/login.html")}),ga(),pa(),qa()});async function ua(){try{const[t,e,a,i]=await Promise.all([ue(),Kt(),Zt(),pe()]);_=t,M=Qt(e),U=a,Ht=i}catch(t){console.error("loadGlobalData error:",t)}}function pa(){const t=document.querySelectorAll(".nav-link"),e=document.querySelectorAll(".tab-content"),a=document.getElementById("page-title");t.forEach(i=>{i.addEventListener("click",async s=>{var d;s.preventDefault(),t.forEach(o=>{o.classList.remove("active","text-primary"),o.classList.add("text-text-muted")}),i.classList.remove("text-text-muted"),i.classList.add("active","text-primary");const n=i.getAttribute("data-tab"),r=i.getAttribute("data-title");e.forEach(o=>o.classList.remove("active")),(d=document.getElementById(n))==null||d.classList.add("active"),a&&r&&(a.textContent=r),await be()})})}async function be(){const t=document.querySelector(".tab-content.active");if(!t)return;const e=t.id;e==="agents-tab"?await it():e==="sectors-tab"?await ot():e==="flights-tab"?await bt():e==="dashboard-tab"?await fa():e==="reports-tab"?await $a():e==="database-tab"?await te():e==="visas-tab"?await st():e==="agent-sheets-tab"?(Se(),Mt(),dt()):e==="eticket-tab"&&await Ja()}function ga(){const t=document.getElementById("admin-modal"),e=document.getElementById("modal-close-btn");e&&e.addEventListener("click",()=>t.close()),t==null||t.addEventListener("click",a=>{a.target===t&&t.close()})}function mt(t,e){const a=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=t,document.getElementById("modal-body").innerHTML=e,a.showModal()}async function fa(){var i,s,n,r,d;if(!document.getElementById("dashboard-tab"))return;const e=document.getElementById("poster-sector-sel");e&&e.options.length<=1&&M.forEach(o=>{const l=new Option(o.sectorCode,o.id);e.appendChild(l)});const a=document.getElementById("poster-generate-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",async()=>{const o=document.getElementById("poster-start-date"),l=document.getElementById("poster-end-date"),m=e==null?void 0:e.value,c=(o==null?void 0:o.value)||null,p=(l==null?void 0:l.value)||null;if(!m){b("warning","Validation Error","Please select a sector to generate the poster.");return}a.disabled=!0,a.textContent="Generating…";try{const u=await jt({sectorId:m,startDate:c,endDate:p,includeHidden:!1});if(!u||!u.length){b("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await ba(u,m)}catch(u){b("error","Generation Failed",u.message)}finally{a.disabled=!1,a.textContent="Generate Poster"}}),(i=document.getElementById("poster-download-jpg"))==null||i.addEventListener("click",()=>re("jpeg")),(s=document.getElementById("poster-download-pdf"))==null||s.addEventListener("click",()=>re("pdf")),(n=document.getElementById("poster-download-vid-1x1"))==null||n.addEventListener("click",()=>_t("1x1")),(r=document.getElementById("poster-download-vid-9x16"))==null||r.addEventListener("click",()=>_t("9x16")),(d=document.getElementById("poster-download-vid-16x9"))==null||d.addEventListener("click",()=>_t("16x9")))}async function _t(t){const e=document.getElementById("poster-sector-sel"),a=document.getElementById("poster-start-date"),i=document.getElementById("poster-end-date"),s=e==null?void 0:e.value,n=(a==null?void 0:a.value)||null,r=(i==null?void 0:i.value)||null;if(!s){b("warning","Validation Error","Please select a sector to generate the poster.");return}try{const d=await jt({sectorId:s,startDate:n,endDate:r,includeHidden:!1});if(!d||!d.length){b("warning","No Fares","No live fares found for the selected sector and dates.");return}await da(t,d,s,M,U)}catch(d){console.error("Video generation failed",d)}}async function ba(t,e){const a=document.getElementById("poster-preview-container"),i=document.getElementById("poster-fares-tbody"),s=document.getElementById("poster-sector-title");if(!a||!i||!s)return;const n=M.find(u=>u.id===e),r=n?(n.sectorFrom||"DEP").toUpperCase():"DEP",d=n?(n.sectorTo||"ARR").toUpperCase():"ARR";s.innerHTML=`${r} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${d}`;const o=[...t].sort((u,g)=>{let v=u.flightDate,w=g.flightDate;return v instanceof Date&&(v=v.getTime()),w instanceof Date&&(w=w.getTime()),v-w}).slice(0,10),l={};U.forEach(u=>{u.id&&(l[u.id]=u),u.code&&(l[u.code]=u),u.name&&(l[u.name]=u)});async function m(u){try{const g=await fetch(u);if(!g.ok)return null;const v=await g.blob();return URL.createObjectURL(v)}catch{return null}}const c=[...new Set(o.map(u=>u.airlineId))].map(u=>l[u]).filter(u=>u==null?void 0:u.logoUrl),p={};await Promise.all(c.map(async u=>{const g=await m(u.logoUrl);g&&(p[u.id]=g)})),i.innerHTML=o.map((u,g)=>{const v=u.flightDate instanceof Date?u.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():u.flightDate,w=l[u.airlineId],I=g%2===0?"#ffffff":"#f8fafc",C=p[u.airlineId]||null,f=C?`<img src="${C}" style="height:40px;max-width:100px;object-fit:contain;display:block;margin:0 auto;" alt="${(w==null?void 0:w.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:15px;white-space:nowrap;">${(w==null?void 0:w.name)||u.airlineId||"—"}</span>`;let h='<span style="color:#94a3b8;font-size:14px;">—</span>';if(u.flightTime){const E=u.flightTime.split("-").map(k=>k.trim());E.length>=2?h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${E[0]} - ${E[1]}</span>`:h=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${u.flightTime}</span>`}return`
      <tr style="background-color:${I};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 12px;font-weight:900;color:#0f172a;font-size:22px;white-space:nowrap;">${v}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${f}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${h}</td>
        <td style="padding:16px 12px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:8px 18px;border-radius:12px;font-weight:900;font-size:22px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            &#8377;${(u.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),a.classList.remove("hidden"),a.classList.add("flex")}function ye(t){if(!t||t.nodeType!==1)return;const e=window.getComputedStyle(t),a=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const i of a){const s=e.getPropertyValue(i);if(s&&!s.startsWith("rgb")&&!s.startsWith("#")&&s!=="transparent"&&s!=="initial")try{t.style[i]=s}catch{}}for(const i of t.children)ye(i)}async function re(t){const e=document.getElementById("poster-render-frame");if(!e)return;const a=document.getElementById("poster-download-jpg"),i=document.getElementById("poster-download-pdf");a&&(a.disabled=!0),i&&(i.disabled=!0);const s=e.style.transform;e.style.transform="none",b("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(e.querySelectorAll("img")).map(d=>d.complete?Promise.resolve():new Promise(o=>{d.onload=o,d.onerror=o})));const n=await html2canvas(e,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:d=>{const o=d.getElementById("poster-render-frame");o&&ye(o)}});e.style.transform=s;const r=n.toDataURL("image/jpeg",.95);if(t==="jpeg"){const d=document.createElement("a");d.download=`zamra-poster-${Date.now()}.jpg`,d.href=r,d.click(),b("success","Downloaded!","JPEG poster saved successfully.")}else if(t==="pdf"){const d=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!d)throw new Error("jsPDF library not loaded.");const o=96/25.4,l=n.width/2/o,m=n.height/2/o,c=new d({orientation:l>m?"landscape":"portrait",unit:"mm",format:[l,m]});c.addImage(r,"JPEG",0,0,l,m),c.save(`zamra-poster-${Date.now()}.pdf`),b("success","Downloaded!","PDF poster saved successfully.")}}catch(n){console.error("Poster export error:",n),e.style.transform=s,b("error","Export Failed",n.message||"There was an error generating the export.")}finally{a&&(a.disabled=!1),i&&(i.disabled=!1)}}function kt(t){const e=document.getElementById("report-fares-results");if(!e)return;if(!t||!t.length){e.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-inbox"></i>
        </div>
        <p class="admin-empty-state-title">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const a=Object.fromEntries(_.map(u=>[u.id,u.name])),i=Object.fromEntries(M.map(u=>[u.id,u.sectorCode])),s=Object.fromEntries(U.map(u=>[u.id,u.code])),{key:n,asc:r}=nt.reportFares,d=[...t].sort((u,g)=>{let v=u[n],w=g[n];return v instanceof Date&&(v=v.getTime()),w instanceof Date&&(w=w.getTime()),typeof v=="string"&&(v=v.toLowerCase()),typeof w=="string"&&(w=w.toLowerCase()),v<w?r?-1:1:v>w?r?1:-1:0}),o=tableLimit.reportFares,l=Math.max(1,Math.ceil(t.length/o));x.reportFares>l&&(x.reportFares=l);const m=(x.reportFares-1)*o,c=d.slice(m,m+o),p=(u,g)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${u}">${g} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;e.innerHTML=`
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
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${i[u.sectorId]||u.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${s[u.airlineId]||u.airlineId}</td>
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
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,It("reportFares",t.length,l,m,o),window.__deleteFare=async u=>{if(confirm("Delete this fare?"))try{await Xt(u),j=j.filter(g=>g.id!==u),b("success","Deleted","Fare removed."),kt(j)}catch(g){b("error","Error",g.message)}},window.__toggleFare=async(u,g)=>{try{await me(u,{isHidden:g}),j=j.map(v=>v.id===u?{...v,isHidden:g}:v),b("success","Updated",`Fare ${g?"hidden":"shown"}.`),kt(j)}catch(v){b("error","Error",v.message)}},Ft("reportFares")}async function it(t=!0){t&&(_=await ue(),x.agents=1);const e=document.querySelector("#agents-tab .admin-table tbody");if(!e)return;const a=document.getElementById("agents-search"),i=document.getElementById("agents-limit");a&&!a.dataset.wired&&(a.dataset.wired="1",i&&(i.dataset.wired="1"),a.addEventListener("input",m=>{qt.agents=m.target.value,x.agents=1,it(!1)}),i&&i.addEventListener("change",m=>{tableLimit.agents=parseInt(m.target.value),x.agents=1,it(!1)}));const s=ft(_,"agents"),n=tableLimit.agents,r=Math.max(1,Math.ceil(s.length/n));x.agents>r&&(x.agents=r);const d=(x.agents-1)*n,o=s.slice(d,d+n);e.innerHTML=o.length?o.map(m=>ya(m)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',It("agents",s.length,r,d,n),delete e.dataset.actionsWired,ha();const l=document.getElementById("agents-add-btn");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>he(null))),Ft("agents")}function ya(t){const e=t.isActive!==!1?'<span class="admin-status-pill admin-status-active">Active</span>':'<span class="admin-status-pill admin-status-inactive">Hidden</span>',a=t.commission!==void 0?`₹${Number(t.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${t.id}">
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
  </tr>`}function ha(){const t=document.querySelector("#agents-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const i=a.dataset.action,s=a.dataset.id,n=_.find(r=>r.id===s);if(i==="edit-agent"&&he(n),i==="delete-agent"){if(!confirm(`Delete agent "${n==null?void 0:n.name}"? This does NOT delete their fares.`))return;try{await Fe(s),b("success","Deleted",`Agent "${n==null?void 0:n.name}" removed.`),await it()}catch(r){b("error","Error",r.message)}}if(i==="toggle-agent"){const d=!(a.dataset.active==="true");a.disabled=!0,a.textContent="Working…";try{const o=await Re(s,d);b("success",d?"Agent Shown":"Agent Hidden",o.message),await it()}catch(o){b("error","Toggle Failed",o.message),await it()}}}))}function It(t,e,a,i,s){const n=document.getElementById(`${t}-pagination-footer`);if(!n)return;const r=Math.min(i+s,e),d=x[t];n.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${e?i+1:0} to ${r} of ${e} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${d<=1?"disabled":""}>Previous</button>
        ${Array.from({length:a},(o,l)=>l+1).map(o=>`<button data-pg-action="goto" data-pg="${o}" class="admin-pagination-btn ${o===d?"admin-pagination-btn-active":""}">${o}</button>`).join("")}
        <button data-pg-action="next" class="admin-pagination-btn" ${d>=a?"disabled":""}>Next</button>
      </div>
    </div>`,n.dataset.wired||(n.dataset.wired="1",n.addEventListener("click",o=>{const l=o.target.closest("[data-pg-action]");if(!l||l.disabled)return;const m=l.dataset.pgAction;m==="prev"?x[t]=Math.max(1,x[t]-1):m==="next"?x[t]++:m==="goto"&&(x[t]=parseInt(l.dataset.pg)),t==="agents"?it(!1):t==="sectors"?ot(!1):t==="airlines"?bt(!1):t==="reportFares"?kt(j):t==="databaseFares"&&O()}))}function he(t){var a,i;const e=!!t;mt(e?"Edit Agent":"Add New Agent",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(i=document.getElementById("agent-form"))==null||i.addEventListener("submit",async s=>{s.preventDefault();const n=new FormData(s.target),r=Object.fromEntries(n.entries()),d=s.target.querySelector("[type=submit]");d.disabled=!0,d.textContent="Saving…";try{e?(await Ne(t.id,r),b("success","Updated",`Agent "${r.name}" updated.`)):(await He(r),b("success","Added",`Agent "${r.name}" added.`)),document.getElementById("admin-modal").close(),await it()}catch(o){b("error","Save Failed",o.message),d.disabled=!1,d.textContent=e?"Save Changes":"Add Agent"}})}async function ot(t=!0){t&&(M=Qt(await Kt()),x.sectors=1);const e=document.getElementById("sectors-search"),a=document.getElementById("sectors-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{qt.sectors=m.target.value,x.sectors=1,ot(!1)}),a.addEventListener("change",m=>{tableLimit.sectors=parseInt(m.target.value),x.sectors=1,ot(!1)}));const i=document.querySelector("#sectors-tab .admin-table tbody");if(!i)return;const s=ft(M,"sectors"),n=tableLimit.sectors,r=Math.max(1,Math.ceil(s.length/n));x.sectors>r&&(x.sectors=r);const d=(x.sectors-1)*n,o=s.slice(d,d+n);i.innerHTML=o.length?o.map(m=>va(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',It("sectors",s.length,r,d,n),xa();const l=document.querySelector("#sectors-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>ve(null))),Ft("sectors")}function va(t){const e=ge(t);return`<tr data-sector-id="${t.id}">
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
  </tr>`}function xa(){const t=document.querySelector("#sectors-tab .admin-table tbody");t&&(delete t.dataset.actionsWired,t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:i,id:s}=a.dataset,n=M.find(r=>r.id===s);if(i==="edit-sector"&&ve(n),i==="delete-sector"){if(!confirm(`Delete sector "${n==null?void 0:n.sectorCode}"?`))return;try{await Pe(s),b("success","Deleted",`Sector "${n==null?void 0:n.sectorCode}" removed.`),await ot()}catch(r){b("error","Error",r.message)}}if(i==="toggle-sector"){const d=!(a.dataset.hidden==="true");a.disabled=!0,a.textContent="Working…";try{const o=await je(s,d);b("success",`Sector Fares ${d?"Hidden":"Shown"}`,o.message),await ot()}catch(o){b("error","Toggle Failed",o.message),await ot()}}}))}function ve(t){var a,i;const e=!!t;mt(e?"Edit Sector":"Add New Sector",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(i=document.getElementById("sector-form"))==null||i.addEventListener("submit",async s=>{s.preventDefault();const n=new FormData(s.target),r=Object.fromEntries(n.entries());r.sectorCode=Et(r.sectorCode.toUpperCase()),r.sectorFrom=Et(r.sectorFrom.toUpperCase()),r.sectorTo=Et(r.sectorTo.toUpperCase());const d=s.target.querySelector("[type=submit]");d.disabled=!0,d.textContent="Saving…";try{e?(await Ue(t.id,r),b("success","Updated","Sector updated.")):(await qe(r),b("success","Added",`Sector "${r.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await ot()}catch(o){b("error","Save Failed",o.message),d.disabled=!1,d.textContent=e?"Save Changes":"Add Sector"}})}async function bt(t=!0){t&&(U=await Zt(),x.airlines=1);const e=document.getElementById("airlines-search"),a=document.getElementById("airlines-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{qt.airlines=m.target.value,x.airlines=1,bt(!1)}),a.addEventListener("change",m=>{tableLimit.airlines=parseInt(m.target.value),x.airlines=1,bt(!1)}));const i=document.querySelector("#flights-tab .admin-table tbody");if(!i)return;const s=ft(U,"airlines"),n=tableLimit.airlines,r=Math.max(1,Math.ceil(s.length/n));x.airlines>r&&(x.airlines=r);const d=(x.airlines-1)*n,o=s.slice(d,d+n);i.innerHTML=o.length?o.map(m=>wa(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "Add Airline".</td></tr>',It("airlines",s.length,r,d,n),Ea();const l=document.querySelector("#flights-tab .flex.justify-between button");l&&!l.dataset.wired&&(l.dataset.wired="1",l.addEventListener("click",()=>xe(null))),Ft("airlines")}function wa(t){const e=t.logoUrl?`<span class="admin-logo-wrap"><img src="${t.logoUrl}" alt="${S(t.name||"Airline")}"></span>`:`<span class="admin-logo-wrap"><span class="admin-logo-fallback">${S((t.code||"NA").slice(0,3))}</span></span>`;return`<tr data-airline-id="${t.id}">
    <td>${e}</td>
    <td class="font-semibold">${t.name}</td>
    <td><span class="font-mono font-bold text-primary">${t.code}</span></td>
    <td>
      <div class="flex gap-1 items-center">
        <button data-action="edit-airline" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-airline" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Ea(){const t=document.querySelector("#flights-tab .admin-table tbody");t&&(delete t.dataset.actionsWired,t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:i,id:s}=a.dataset,n=U.find(r=>r.id===s);if(i==="edit-airline"&&xe(n),i==="delete-airline"){if(!confirm(`Delete airline "${n==null?void 0:n.name}" (${n==null?void 0:n.code})?`))return;try{await Oe(s),b("success","Deleted",`Airline "${n==null?void 0:n.name}" removed.`),await bt()}catch(r){b("error","Error",r.message)}}}))}function xe(t){var a,i;const e=!!t;mt(e?"Edit Airline":"Add New Airline",`
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
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(i=document.getElementById("airline-form"))==null||i.addEventListener("submit",async s=>{var l;s.preventDefault();const n=new FormData(s.target),r=((l=n.get("logoFile"))==null?void 0:l.size)>0?n.get("logoFile"):null,d={name:n.get("name"),code:n.get("code").toUpperCase()},o=s.target.querySelector("[type=submit]");o.disabled=!0,o.textContent="Saving…";try{e?(await Ve(t.id,d,r),b("success","Updated","Airline updated.")):(await _e(d,r),b("success","Added",`Airline "${d.name}" added.`)),document.getElementById("admin-modal").close(),await bt()}catch(m){b("error","Save Failed",m.message),o.disabled=!1,o.textContent=e?"Save Changes":"Add Airline"}})}async function $a(){const t=document.getElementById("reports-tab");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=document.getElementById("reports-sector-sel");e&&e.options.length<=1&&M.forEach(r=>e.appendChild(new Option(r.sectorCode,r.id)));const a=document.getElementById("reports-agent-sel");a&&a.options.length<=1&&_.forEach(r=>a.appendChild(new Option(r.name,r.id)));const i=document.getElementById("generate-report-btn"),s=document.getElementById("reports-start-date"),n=document.getElementById("reports-end-date");i&&!i.dataset.wired&&(i.dataset.wired="1",i.addEventListener("click",async()=>{const r=(e==null?void 0:e.value)||"all",d=(a==null?void 0:a.value)||"all",o=(s==null?void 0:s.value)||null,l=(n==null?void 0:n.value)||null;if(r==="all"&&!o&&!l&&d==="all"){b("warning","No Filter Selected","Select at least a sector, an agent, or a date range.");return}i.disabled=!0,i.textContent="Generating…";try{const[m,c]=await Promise.all([ze(o,l,r,d),jt({sectorId:r,agentId:d,startDate:o,endDate:l,includeHidden:!0})]);j=c,Ia(m,t),x.reportFares=1,kt(j)}catch(m){b("error","Report Failed",m.message)}finally{i.disabled=!1,i.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Ia(t,e){const{agentReport:a,sectorReport:i,totalFares:s}=t,n=document.getElementById("report-stats-row");if(n){n.classList.remove("hidden");const p=(j||[]).filter(f=>!f.isHidden).length,u=(j||[]).filter(f=>f.isHidden).length,g=new Set((j||[]).map(f=>f.agentId)).size,v=(j||[]).map(f=>f.finalRate||0).filter(f=>f>0),w=v.length?Math.round(v.reduce((f,h)=>f+h,0)/v.length):0,I=(f,h)=>{const E=document.getElementById(f);E&&(E.textContent=h.toLocaleString())};I("stat-total-fares",s),I("stat-live-fares",p),I("stat-hidden-fares",u),I("stat-agents-count",g);const C=document.getElementById("stat-avg-fare");C&&(C.textContent=w>0?`₹${w.toLocaleString()}`:"—")}const r=document.getElementById("report-total-fares");r&&(r.textContent=`${s} fare${s!==1?"s":""} matched your filter`);const d=document.getElementById("bar-chart-container");d&&a.length&&Sa(a.slice(0,8),d);const o=document.getElementById("donut-chart-svg"),l=document.getElementById("pie-legend");o&&i.length&&Ca(i.slice(0,8),o,l);const m=document.getElementById("report-leaderboards");m&&(m.classList.remove("hidden"),Ba(a,i));const c=document.getElementById("download-report-csv");if(c){const p=c.cloneNode(!0);c.parentNode.replaceChild(p,c),p.addEventListener("click",()=>Aa(j)),j&&j.length?p.classList.remove("opacity-50","pointer-events-none"):p.classList.add("opacity-50","pointer-events-none")}b("success","Report Ready",`${s} fare${s!==1?"s":""} aggregated.`)}function Sa(t,e){const a=e.clientWidth||480,i=260,s={top:32,right:16,bottom:48,left:48},n=a-s.left-s.right,r=i-s.top-s.bottom,d=Math.max(...t.map(f=>f.count),1),o=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],l=4,m=Math.ceil(d/l),c=Array.from({length:l+1},(f,h)=>h*m),p=c.map(f=>{const h=s.top+r-f/(c[c.length-1]||1)*r;return`<line x1="${s.left}" y1="${h.toFixed(1)}" x2="${a-s.right}" y2="${h.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${s.left-6}" y="${(h+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${f}</text>`}).join(""),u=Math.min(48,n/t.length*.6),g=n/t.length,v=t.map((f,h)=>{const E=Math.max(4,f.count/(c[c.length-1]||1)*r),k=s.left+h*g+g/2-u/2,H=s.top+r-E,[z,J]=o[h%o.length],X=`bg${h}`,K=f.avgRate?`avg ₹${Math.round(f.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${X}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${z}"/>
              <stop offset="100%" stop-color="${J}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${f.name}" data-count="${f.count}" data-avg="${K}" style="cursor:pointer;">
              <rect x="${k.toFixed(1)}" y="${H.toFixed(1)}" width="${u}" height="${E.toFixed(1)}"
                rx="6" fill="url(#${X})" opacity="0.92"
                style="transform-origin:${(k+u/2).toFixed(1)}px ${(s.top+r).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${h*.07}s both;"/>
              <text x="${(k+u/2).toFixed(1)}" y="${(H-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${J}">${f.count}</text>
              <text x="${(k+u/2).toFixed(1)}" y="${(s.top+r+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(f.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),w="bar-tooltip";e.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${w}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${i}" viewBox="0 0 ${a} ${i}" style="overflow:visible;">
      ${p}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+r}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${s.left}" y1="${s.top+r}" x2="${a-s.right}" y2="${s.top+r}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${v}
    </svg>`;const I=e.querySelector("#bar-svg"),C=e.querySelector(`#${w}`);I&&C&&I.querySelectorAll(".bar-group").forEach(f=>{f.addEventListener("mousemove",h=>{const E=e.getBoundingClientRect();C.style.display="block",C.style.left=h.clientX-E.left+12+"px",C.style.top=h.clientY-E.top-40+"px";const k=f.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${f.dataset.avg}</span>`:"";C.innerHTML=`${f.dataset.name}<br><span style="color:#60a5fa;">${f.dataset.count} fares</span>${k}`}),f.addEventListener("mouseleave",()=>{C.style.display="none"})})}function Ca(t,e,a){const i=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],o=t.reduce((f,h)=>f+h.count,0),l=e.getElementById?e.getElementById("donut-segments"):e.querySelector("#donut-segments"),m=e.querySelector("#donut-center-count"),c=e.querySelector("#donut-center-label");if(!l)return;m&&(m.textContent=o),c&&(c.textContent="FARES");const p=(f,h,E,k)=>({x:f+E*Math.cos((k-90)*Math.PI/180),y:h+E*Math.sin((k-90)*Math.PI/180)});let u=0;const g=t.map((f,h)=>{const E=o>0?f.count/o*360:0,k=u+E,H=E>180?1:0,z=p(110,110,95,u),J=p(110,110,95,k),X=p(110,110,60,u),K=p(110,110,60,k),ct=[`M ${z.x.toFixed(2)} ${z.y.toFixed(2)}`,`A 95 95 0 ${H} 1 ${J.x.toFixed(2)} ${J.y.toFixed(2)}`,`L ${K.x.toFixed(2)} ${K.y.toFixed(2)}`,`A 60 60 0 ${H} 0 ${X.x.toFixed(2)} ${X.y.toFixed(2)}`,"Z"].join(" "),ut=u+E/2;u=k;const y=o>0?(f.count/o*100).toFixed(1):"0.0";return{pathD:ct,color:i[h%i.length],name:f.name,count:f.count,pct:y,mid:ut}}),v="http://www.w3.org/2000/svg";l.innerHTML="";const w=g.map((f,h)=>{const E=document.createElementNS(v,"path");return E.setAttribute("d",f.pathD),E.setAttribute("fill",f.color),E.setAttribute("stroke","white"),E.setAttribute("stroke-width","2"),E.style.cursor="pointer",E.style.transition="transform 0.2s, filter 0.2s",E.style.transformOrigin="110px 110px",E.setAttribute("data-index",h),l.appendChild(E),E}),I=f=>{w.forEach((h,E)=>{E===f?(h.style.transform="scale(1.04)",h.style.filter="brightness(1.1)",h.setAttribute("stroke-width","3")):(h.style.transform="scale(1)",h.style.filter="brightness(1)",h.setAttribute("stroke-width","2"))}),f>=0&&f<g.length?(m&&(m.textContent=g[f].count),c&&(c.textContent=g[f].name.split(" ")[0].toUpperCase().slice(0,7))):(m&&(m.textContent=o),c&&(c.textContent="FARES"))};if(w.forEach((f,h)=>{f.addEventListener("mouseover",()=>{I(h),C(h)}),f.addEventListener("mouseout",()=>{I(-1),C(-1)})}),a){a.innerHTML=g.map((h,E)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${E}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${h.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${h.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${h.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${h.pct}%</span>
      </div>`).join("");const f=h=>{a.querySelectorAll(".legend-row").forEach((E,k)=>{E.style.background=k===h?"#f1f5f9":""})};window._highlightLegendRows=f,a.querySelectorAll(".legend-row").forEach((h,E)=>{h.addEventListener("mouseover",()=>{I(E),f(E)}),h.addEventListener("mouseout",()=>{I(-1),f(-1)})})}function C(f){window._highlightLegendRows&&window._highlightLegendRows(f)}}function Ba(t,e){var n,r;const a=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],i=document.getElementById("leaderboard-agents");if(i&&t.length){const d=[...t].sort((l,m)=>m.count-l.count).slice(0,5),o=d[0].count||1;i.innerHTML=d.map((l,m)=>{const c=Math.max(6,Math.round(l.count/o*100));return`<div style="display:flex;align-items:center;gap:10px;">
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
      </div>`}).join("")}const s=document.getElementById("leaderboard-sectors");if(s&&e.length){const o=[...e.filter(c=>c.avgRate>0)].sort((c,p)=>c.avgRate-p.avgRate).slice(0,5),l=((n=o[0])==null?void 0:n.avgRate)||1,m=((r=o[o.length-1])==null?void 0:r.avgRate)||1;s.innerHTML=o.map((c,p)=>{const u=m>l?Math.max(6,Math.round((c.avgRate-l)/(m-l)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
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
      </div>`}).join("")}}function Aa(t){if(!t||!t.length){b("warning","No Data","No fares to export. Apply filters and fetch first.");return}const e=Object.fromEntries(_.map(c=>[c.id,c.name])),a=Object.fromEntries(M.map(c=>[c.id,c.sectorCode])),i=Object.fromEntries(U.map(c=>[c.id,c.code||c.name])),s=c=>`"${String(c??"").replace(/"/g,'""')}"`,n=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],r=t.map(c=>{const p=c.flightDate instanceof Date?c.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):c.flightDate||"";return[s(p),s(c.flightTime||""),s(a[c.sectorId]||c.sectorId),s(i[c.airlineId]||c.airlineId),s(e[c.agentId]||c.agentId),s(c.specialRate||0),s(c.finalRate||0),s(c.commission||0),s(c.baggage||""),s(c.extraBaggage||""),s(c.isHidden?"Hidden":"Live")].join(",")}),d=[n.map(s).join(","),...r].join(`
`),o=new Blob(["\uFEFF"+d],{type:"text/csv;charset=utf-8;"}),l=URL.createObjectURL(o),m=document.createElement("a");m.href=l,m.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(m),m.click(),document.body.removeChild(m),URL.revokeObjectURL(l),b("success","CSV Downloaded",`${t.length} fares exported.`)}function we(){return Object.keys(W).length}function La(){return{agentNameById:Object.fromEntries(_.map(t=>[t.id,t.name||t.id])),sectorCodeById:Object.fromEntries(M.map(t=>[t.id,t.sectorCode||`${t.sectorFrom||""} ${t.sectorTo||""}`.trim()||t.id])),airlineLabelById:Object.fromEntries(U.map(t=>[t.id,t.code?`${t.code} - ${t.name||""}`.trim():t.name||t.id]))}}function Ee(t,e=0){if(!t)return e;const a=_.find(s=>s.id===t),i=Number(a==null?void 0:a.commission);return Number.isFinite(i)?Math.max(0,i):e}function Ta(t,e){return t==="specialRate"||t==="finalRate"||t==="commission"||t==="extraBaggage"?e===""?"":D(e,0):t==="baggage"?e===""?"":lt(e):t==="isHidden"?e===!0||e==="hidden"||e==="true":t==="flightTime"?String(e||"").trim():t==="flightDate"?e||"":String(e||"")}function ka(t,e){return t==="specialRate"||t==="finalRate"||t==="extraBaggage"?D(e,0):t==="commission"?e==null||e===""?"":Math.max(0,D(e,0)):t==="baggage"?lt(e):t==="isHidden"?e===!0:t==="flightTime"?String(e||"").trim():t==="flightDate"?Ut(e):String(e||"")}function Jt(t){return t?t.commission!==void 0&&t.commission!==null&&t.commission!==""?Math.max(0,D(t.commission,0)):Math.max(0,D(t.finalRate,0)-D(t.specialRate,0)):0}function Dt(t,e){return Math.max(0,D(t,0)+Math.max(0,D(e,0)))}function $e(t){const e=W[t.id]||{},a={...t,...e},i=Jt(t);return a.flightDate=e.flightDate!==void 0?fe(e.flightDate):Tt(t.flightDate),a.specialRate=D(a.specialRate,0),a.commission=e.commission!==void 0?Math.max(0,D(e.commission,0)):i,a.finalRate=Dt(a.specialRate,a.commission),a.baggage=lt(a.baggage),a.extraBaggage=D(a.extraBaggage,0),a.isHidden=a.isHidden===!0||a.isHidden==="hidden"||a.isHidden==="true",a.flightTime=String(a.flightTime||"").trim(),a.agentId=a.agentId||"",a.sectorId=a.sectorId||"",a.airlineId=a.airlineId||"",a}function Bt(){const t=we(),e=Q.size,a=document.getElementById("database-unsaved-pill");a&&(a.textContent=`Unsaved: ${t}`);const i=document.getElementById("database-save-all-btn");i&&(i.disabled=t===0);const s=document.getElementById("database-delete-selected-btn");s&&(s.disabled=e===0);const n=document.getElementById("database-selected-count");n&&(n.textContent=String(e))}function Da(){const t=document.getElementById("database-agent-filter"),e=document.getElementById("database-sector-filter"),a=document.getElementById("database-airline-filter");if(t){const i=L.agentId;t.innerHTML='<option value="all">All Agents</option>'+_.map(s=>`<option value="${S(s.id)}">${S(s.id)} · ${S(s.name||"Unnamed")}</option>`).join(""),t.value=i}if(e){const i=L.sectorId;e.innerHTML='<option value="all">All Sectors</option>'+M.map(s=>`<option value="${S(s.id)}">${S(s.sectorCode||s.id)}</option>`).join(""),e.value=i}if(a){const i=L.airlineId;a.innerHTML='<option value="all">All Airlines</option>'+U.map(s=>`<option value="${S(s.id)}">${S(s.code||"—")} · ${S(s.name||"Unnamed")}</option>`).join(""),a.value=i}}function Ma(){const t=document.getElementById("database-table-wrap");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=s=>{const n=t.querySelector(`tr[data-fare-id="${s}"]`);if(!n)return;const r=!!W[s];n.classList.toggle("admin-database-row-dirty",r);const d=n.querySelector('[data-db-action="save"]'),o=n.querySelector('[data-db-action="reset"]');d&&(d.disabled=!r),o&&(o.disabled=!r)},a=s=>{if(!s)return;const n=s.querySelector('[data-db-field="specialRate"]'),r=s.querySelector('[data-db-field="commission"]'),d=s.querySelector('[data-db-field="finalRate"]');if(!n||!r||!d)return;const o=D(n.value,0),l=Math.max(0,D(r.value,0));d.value=String(Dt(o,l))},i=s=>{const n=s.target.closest("[data-db-field]");if(!n)return;const r=n.closest("tr[data-fare-id]");if(!r)return;const d=r.dataset.fareId,o=n.dataset.dbField,l=tt.find(v=>v.id===d);if(!l||!o)return;const m=n.value,c=Ta(o,m),p=o==="commission"?Jt(l):ka(o,l[o]),u=c!==p,g={...W[d]||{}};if(u?g[o]=c:delete g[o],o==="agentId"){const v=r.querySelector('[data-db-field="commission"]'),w=Ee(c,0);v&&(v.value=String(w));const I=Jt(l);w!==I?g.commission=w:delete g.commission,a(r)}Object.keys(g).length?W[d]=g:delete W[d],(o==="specialRate"||o==="commission")&&a(r),e(d),Bt()};t.addEventListener("input",i),t.addEventListener("change",s=>{i(s);const n=s.target.closest("#database-select-all");if(n){t.querySelectorAll("input[data-db-select]").forEach(d=>{d.checked=n.checked;const o=d.dataset.dbSelect;o&&(n.checked?Q.add(o):Q.delete(o))}),Bt();return}const r=s.target.closest("input[data-db-select]");if(r){const d=r.dataset.dbSelect;if(!d)return;r.checked?Q.add(d):Q.delete(d),Bt()}}),t.addEventListener("click",async s=>{const n=s.target.closest("[data-db-action]");if(!n)return;const r=n.dataset.dbAction,d=n.dataset.id;if(d){if(r==="save"){n.disabled=!0,await Ie(d)||(n.disabled=!1),O();return}if(r==="reset"){delete W[d],O();return}if(r==="delete"){if(!confirm("Delete this fare row? This cannot be undone."))return;n.disabled=!0;try{await Xt(d),tt=tt.filter(o=>o.id!==d),delete W[d],Q.delete(d),b("success","Deleted","Fare row removed."),O()}catch(o){b("error","Delete Failed",o.message),n.disabled=!1}}}})}function Fa(t){if(!t||t.dataset.controlsWired)return;t.dataset.controlsWired="1";const e=document.getElementById("database-search"),a=document.getElementById("database-agent-filter"),i=document.getElementById("database-sector-filter"),s=document.getElementById("database-airline-filter"),n=document.getElementById("database-status-filter"),r=document.getElementById("database-start-date"),d=document.getElementById("database-end-date"),o=document.getElementById("database-limit"),l=document.getElementById("database-clear-filters"),m=document.getElementById("database-refresh-btn"),c=document.getElementById("database-save-all-btn"),p=document.getElementById("database-delete-selected-btn"),u=document.getElementById("database-add-row-btn");e&&e.addEventListener("input",g=>{L.search=g.target.value||"",x.databaseFares=1,O()}),a&&a.addEventListener("change",g=>{L.agentId=g.target.value||"all",x.databaseFares=1,O()}),i&&i.addEventListener("change",g=>{L.sectorId=g.target.value||"all",x.databaseFares=1,O()}),s&&s.addEventListener("change",g=>{L.airlineId=g.target.value||"all",x.databaseFares=1,O()}),n&&n.addEventListener("change",g=>{L.status=g.target.value||"all",x.databaseFares=1,O()}),r&&r.addEventListener("change",g=>{L.startDate=g.target.value||"",x.databaseFares=1,O()}),d&&d.addEventListener("change",g=>{L.endDate=g.target.value||"",x.databaseFares=1,O()}),o&&(o.value=String(tableLimit.databaseFares),o.addEventListener("change",g=>{tableLimit.databaseFares=parseInt(g.target.value,10)||20,x.databaseFares=1,O()})),l&&l.addEventListener("click",()=>{L.search="",L.agentId="all",L.sectorId="all",L.airlineId="all",L.status="all",L.startDate="",L.endDate="",e&&(e.value=""),a&&(a.value="all"),i&&(i.value="all"),s&&(s.value="all"),n&&(n.value="all"),r&&(r.value=""),d&&(d.value=""),x.databaseFares=1,O()}),m&&m.addEventListener("click",async()=>{const g=m.innerHTML;m.disabled=!0,m.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing...',await te(!0),m.disabled=!1,m.innerHTML=g}),c&&c.addEventListener("click",Na),p&&p.addEventListener("click",Ha),u&&u.addEventListener("click",Pa)}async function te(t=!0){const e=document.getElementById("database-tab");if(!e)return;if(Fa(e),Ma(),Da(),t||!e.dataset.loaded)try{tt=await jt({includeHidden:!0}),W={},Q=new Set,x.databaseFares=1,e.dataset.loaded="1"}catch(i){b("error","Load Failed",i.message),tt=[]}O()}function Ra(){const{agentNameById:t,sectorCodeById:e,airlineLabelById:a}=La(),i=L.search.trim().toLowerCase(),s=ca(L.startDate),n=ma(L.endDate),r=tt.map(l=>$e(l)).filter(l=>{var p,u;if(L.agentId!=="all"&&l.agentId!==L.agentId||L.sectorId!=="all"&&l.sectorId!==L.sectorId||L.airlineId!=="all"&&l.airlineId!==L.airlineId||L.status==="live"&&l.isHidden||L.status==="hidden"&&!l.isHidden)return!1;const m=((u=(p=Tt(l.flightDate))==null?void 0:p.getTime)==null?void 0:u.call(p))||null;return s!==null&&(m===null||m<s)||n!==null&&(m===null||m>n)?!1:i?[l.id,Ut(l.flightDate),l.flightTime,l.specialRate,l.finalRate,l.commission,l.baggage,l.extraBaggage,l.isHidden?"hidden":"live",l.agentId,l.sectorId,l.airlineId,t[l.agentId]||"",e[l.sectorId]||"",a[l.airlineId]||""].join(" ").toLowerCase().includes(i):!0}),{key:d,asc:o}=nt.databaseFares;return r.sort((l,m)=>{const c=g=>{var v,w;return d==="agentId"?(t[g.agentId]||g.agentId||"").toLowerCase():d==="sectorId"?(e[g.sectorId]||g.sectorId||"").toLowerCase():d==="airlineId"?(a[g.airlineId]||g.airlineId||"").toLowerCase():d==="flightDate"?((w=(v=Tt(g.flightDate))==null?void 0:v.getTime)==null?void 0:w.call(v))||0:d==="isHidden"?g.isHidden?1:0:g[d]};let p=c(l),u=c(m);return typeof p=="string"&&(p=p.toLowerCase()),typeof u=="string"&&(u=u.toLowerCase()),p<u?o?-1:1:p>u?o?1:-1:0})}function O(){const t=document.getElementById("database-table-wrap");if(!t)return;const e=Ra(),a=document.getElementById("database-total-count");a&&(a.textContent=e.length.toLocaleString());const i=tableLimit.databaseFares,s=Math.max(1,Math.ceil(e.length/i));x.databaseFares>s&&(x.databaseFares=s);const n=(x.databaseFares-1)*i,r=e.slice(n,n+i);if(!r.length){t.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-database"></i>
        </div>
        <p class="admin-empty-state-title">No fares matched your filter</p>
      </div>
    </div>`,It("databaseFares",e.length,s,n,i),Bt();return}const d=(p,u)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="databaseFares" data-sort-key="${p}">
      ${u} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i>
    </th>`,o=p=>_.map(u=>`<option value="${S(u.id)}" ${u.id===p?"selected":""}>${S(u.id)} · ${S(u.name||"Unnamed")}</option>`).join(""),l=p=>M.map(u=>`<option value="${S(u.id)}" ${u.id===p?"selected":""}>${S(u.sectorCode||u.id)}</option>`).join(""),m=p=>U.map(u=>`<option value="${S(u.id)}" ${u.id===p?"selected":""}>${S(u.code||"—")} · ${S(u.name||"Unnamed")}</option>`).join(""),c=r.length>0&&r.every(p=>Q.has(p.id));t.innerHTML=`
    <table class="admin-database-table">
      <thead>
        <tr>
          <th class="w-[36px] text-center"><input id="database-select-all" type="checkbox" ${c?"checked":""}></th>
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
        ${r.map((p,u)=>{const g=!!W[p.id],v=Q.has(p.id);return`
            <tr data-fare-id="${p.id}" class="${g?"admin-database-row-dirty":""}">
              <td class="text-center">
                <input type="checkbox" data-db-select="${p.id}" ${v?"checked":""}>
              </td>
              <td class="font-mono text-[11px] text-text-soft">${n+u+1}</td>
              <td>
                <select data-db-field="agentId" class="db-cell-select min-w-[180px]">
                  <option value="">Select Agent</option>
                  ${o(p.agentId)}
                </select>
              </td>
              <td>
                <select data-db-field="sectorId" class="db-cell-select min-w-[140px]">
                  <option value="">Select Sector</option>
                  ${l(p.sectorId)}
                </select>
              </td>
              <td>
                <input type="date" data-db-field="flightDate" class="db-cell-input" value="${Ut(p.flightDate)}">
              </td>
              <td>
                <input type="text" data-db-field="flightTime" class="db-cell-input min-w-[128px]" value="${S(p.flightTime||"")}" placeholder="04:05 - 11:10">
              </td>
              <td>
                <select data-db-field="airlineId" class="db-cell-select min-w-[170px]">
                  <option value="">No Airline</option>
                  ${m(p.airlineId)}
                </select>
              </td>
              <td>
                <select data-db-field="baggage" class="db-cell-select min-w-[110px]">
                  ${$t(Lt,lt(p.baggage))}
                </select>
              </td>
              <td>
                <select data-db-field="extraBaggage" class="db-cell-select min-w-[110px]">
                  ${$t(Lt,D(p.extraBaggage,0))}
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
  `,It("databaseFares",e.length,s,n,i),Ft("databaseFares"),Bt()}async function Ie(t,{silent:e=!1}={}){const a=tt.find(m=>m.id===t);if(!a)return!1;if(!W[t])return!0;const s=$e(a),n=Tt(s.flightDate);if(!s.agentId)return e||b("warning","Missing Agent","Please select an agent before saving."),!1;if(!s.sectorId)return e||b("warning","Missing Sector","Please select a sector before saving."),!1;if(!n)return e||b("warning","Missing Date","Please set a valid flight date before saving."),!1;const r=D(s.specialRate,0),d=Math.max(0,D(s.commission,0)),o=Dt(r,d),l={agentId:s.agentId,sectorId:s.sectorId,airlineId:s.airlineId||"",flightDate:n,flightTime:s.flightTime||"",specialRate:r,finalRate:o,commission:d,baggage:lt(s.baggage),extraBaggage:D(s.extraBaggage,0),isHidden:s.isHidden===!0};try{return await me(t,l),tt=tt.map(m=>m.id===t?{...m,...l}:m),delete W[t],e||b("success","Saved","Fare row updated."),!0}catch(m){return e||b("error","Save Failed",m.message),!1}}async function Na(){const t=Object.keys(W);if(!t.length)return;const e=document.getElementById("database-save-all-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Saving...');let i=0,s=0;for(const n of t)await Ie(n,{silent:!0})?i+=1:s+=1;O(),e&&(e.disabled=we()===0,e.innerHTML=a||"Save All"),s===0?b("success","Saved",`${i} row${i!==1?"s":""} updated.`):b("warning","Partial Save",`${i} saved, ${s} failed. Fix invalid rows and retry.`)}async function Ha(){const t=Array.from(Q);if(!t.length||!confirm(`Delete ${t.length} selected fare row${t.length!==1?"s":""}? This cannot be undone.`))return;const e=document.getElementById("database-delete-selected-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Deleting...');const i=await Promise.allSettled(t.map(r=>Xt(r))),s=[];let n=0;if(i.forEach((r,d)=>{r.status==="fulfilled"?s.push(t[d]):n+=1}),s.length){const r=new Set(s);tt=tt.filter(d=>!r.has(d.id)),s.forEach(d=>{delete W[d],Q.delete(d)})}O(),e&&(e.innerHTML=a||"Delete Selected"),n===0?b("success","Deleted",`${s.length} row${s.length!==1?"s":""} deleted.`):b("warning","Partial Delete",`${s.length} deleted, ${n} failed.`)}function Pa(){const t=Ut(new Date);mt("Add Fare Row",`
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
            ${_.map(o=>`<option value="${S(o.id)}">${S(o.id)} · ${S(o.name||"Unnamed")}</option>`).join("")}
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
            ${U.map(o=>`<option value="${S(o.id)}">${S(o.code||"—")} · ${S(o.name||"Unnamed")}</option>`).join("")}
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
            ${$t(Lt,30)}
          </select>
        </div>
        <div>
          <label class="admin-label text-[10px] mb-1">Extra Baggage (kg)</label>
          <select id="db-add-exbag" class="admin-control h-10">
            ${$t(Lt,20)}
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
  `);const e=document.getElementById("database-add-form");if(!e)return;const a=document.getElementById("db-add-sp"),i=document.getElementById("db-add-comm"),s=document.getElementById("db-add-rate"),n=document.getElementById("db-add-agent"),r=()=>{if(!s)return;const o=D(a==null?void 0:a.value,0),l=Math.max(0,D(i==null?void 0:i.value,0));s.value=String(Dt(o,l))},d=()=>{if(!i)return;const o=Ee(n==null?void 0:n.value,0);i.value=String(o),r()};a==null||a.addEventListener("input",r),n==null||n.addEventListener("change",d),d(),r(),e.addEventListener("submit",async o=>{var c,p,u,g,v,w,I,C,f,h,E,k;o.preventDefault();const l=e.querySelector('button[type="submit"]'),m=(l==null?void 0:l.textContent)||"Add Fare";l&&(l.disabled=!0,l.textContent="Adding...");try{const H=((c=document.getElementById("db-add-date"))==null?void 0:c.value)||"",z=fe(H);if(!z)throw new Error("Please provide a valid flight date.");const J=D((p=document.getElementById("db-add-sp"))==null?void 0:p.value,0),X=Math.max(0,D((u=document.getElementById("db-add-comm"))==null?void 0:u.value,0)),K=Dt(J,X);await ra({agentId:((g=document.getElementById("db-add-agent"))==null?void 0:g.value)||"",sectorId:((v=document.getElementById("db-add-sector"))==null?void 0:v.value)||"",airlineId:((w=document.getElementById("db-add-airline"))==null?void 0:w.value)||"",flightDate:z,flightTime:((C=(I=document.getElementById("db-add-time"))==null?void 0:I.value)==null?void 0:C.trim())||"",specialRate:J,finalRate:K,commission:X,baggage:lt((f=document.getElementById("db-add-bag"))==null?void 0:f.value),extraBaggage:D((h=document.getElementById("db-add-exbag"))==null?void 0:h.value,0),isHidden:(((E=document.getElementById("db-add-status"))==null?void 0:E.value)||"live")==="hidden"}),(k=document.getElementById("admin-modal"))==null||k.close(),await te(!0),b("success","Added","New fare row added.")}catch(H){b("error","Add Failed",H.message),l&&(l.disabled=!1,l.textContent=m)}})}const ja="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",Ua={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},de=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let G=null,rt=JSON.parse(localStorage.getItem("zt_hist")||"[]"),ee=rt.reduce((t,e)=>t+(e.rows||0),0);function qa(){var e,a,i,s;const t=document.getElementById("rateData");t&&t.addEventListener("input",function(){const n=this.value.length,r=document.getElementById("charCount");r&&(r.textContent=n.toLocaleString()+" character"+(n!==1?"s":"")),dt(),clearTimeout(window._previewTimer),n>15?window._previewTimer=setTimeout(()=>Va(this.value),500):Pt()}),(e=document.getElementById("resetBtn"))==null||e.addEventListener("click",()=>{t&&(t.value="");const n=document.getElementById("charCount");n&&(n.textContent="0 characters"),Pt(),dt()}),(a=document.getElementById("clearBtn"))==null||a.addEventListener("click",()=>{rt=[],ee=0,Nt(),At(),Yt()}),(i=document.getElementById("manualAgent"))==null||i.addEventListener("input",function(){const n=parseInt(this.value);G=n>0?String(n):null,document.querySelectorAll(".rp-chip").forEach(r=>r.classList.remove("on")),Mt(),dt()}),(s=document.getElementById("submitBtn"))==null||s.addEventListener("click",_a),Yt(),At()}function Se(){const t=document.getElementById("chipGrid");if(!t)return;t.innerHTML="";const e=_.length?[..._].sort((a,i)=>{const s=parseInt(a.id),n=parseInt(i.id);return!isNaN(s)&&!isNaN(n)?s-n:a.id.localeCompare(i.id)}):[];if(!e.length){G=null,t.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>',Mt(),dt();return}G&&!e.some(a=>a.id===G)&&(G=null),e.forEach(a=>{const i=document.createElement("div");i.className="rp-chip",i.dataset.agentId=a.id,i.textContent=a.id,a.id===G&&i.classList.add("on"),i.addEventListener("click",()=>Oa(a.id,a.name,i)),t.appendChild(i)}),Mt(),dt()}function Oa(t,e,a){G=t,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(i=>{i.classList.remove("on")}),a&&a.classList.add("on"),Mt(),dt()}function Mt(){const t=document.getElementById("agentPill");if(t)if(G){const e=_.find(a=>a.id===G);t.textContent=`Agent ${(e==null?void 0:e.id)||G} selected ✓`,t.classList.remove("empty")}else t.textContent="Select an agent to continue",t.classList.add("empty")}function dt(){const t=document.getElementById("rateData"),e=document.getElementById("submitBtn");e&&(e.disabled=!(G&&t&&t.value.trim().length>10))}function Ce(t){const e=[];let a=null,i="IX";for(const s of t.split(`
`)){const n=s.replace(/[*_~`]/g,"").trim();if(!n)continue;const r=n.match(/([A-Z]{3})\s+([A-Z]{3})/);if(r&&n.length<70&&!n.match(/\d{4,6}/)){a=r[1]+"-"+r[2];const d=n.match(de);d&&(i=d[1]);continue}if(a){const d=n.match(de);if(d&&!n.match(/\d{4,6}/)){i=d[1];continue}const o=n.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(o){const l=parseInt(o[3]);l>=1e3&&l<=99999&&e.push({sector:a,date:`2026-${Ua[o[2].toUpperCase()]}-${o[1].padStart(2,"0")}`,airline:d?d[1]:i,rate:l})}}}return e}function Va(t){const e=Ce(t);if(!e.length){Pt();return}const a=document.getElementById("prevBox");a&&a.classList.add("on");const i=document.getElementById("prevCount");i&&(i.textContent=e.length+" entr"+(e.length===1?"y":"ies"));const s=document.getElementById("prevBody");s&&(s.innerHTML=e.slice(0,60).map(n=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${n.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${n.rate.toLocaleString()}</td></tr>`).join(""),e.length>60&&(s.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${e.length-60} more</td></tr>`))}function Pt(){var t;(t=document.getElementById("prevBox"))==null||t.classList.remove("on")}async function _a(){const t=document.getElementById("rateData");if(!G||!(t!=null&&t.value.trim()))return;const e=document.getElementById("submitBtn"),a=e.innerHTML;e.disabled=!0,e.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI pipeline...';const i=document.getElementById("progBar"),s=document.getElementById("progFill");i&&i.classList.add("on");let n=0;const r=setInterval(()=>{n=Math.min(n+Math.random()*13,85),s&&(s.style.width=n+"%")},280),d=Ce(t.value),o={id:Date.now(),agent:G,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:d.length,status:"pen"};rt.unshift(o),rt.length>15&&rt.pop(),Nt(),At();try{const l=await fetch(ja,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:G,raw_text:t.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(r),s&&(s.style.width="100%"),l.ok)o.status="ok",ee+=d.length,Nt(),At(),Yt(),b("success","Submitted","Rates sent to the AI parser. Firestore will update in a moment."),setTimeout(()=>{t.value="";const m=document.getElementById("charCount");m&&(m.textContent="0 characters"),Pt(),dt()},500);else throw new Error("N8N webhook rejected payload")}catch(l){clearInterval(r),s&&(s.style.width="100%"),o.status="err",Nt(),At(),b("error","Submission Failed",l.message)}setTimeout(()=>{i&&i.classList.remove("on"),s&&(s.style.width="0%"),e.innerHTML=a,dt()},900)}function Yt(){const t=document.getElementById("statSubs");t&&(t.textContent=rt.length);const e=document.getElementById("statEntries");e&&(e.textContent=ee)}function Nt(){localStorage.setItem("zt_hist",JSON.stringify(rt))}function At(){const t=document.getElementById("historyWrap");if(t){if(!rt.length){t.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}t.innerHTML=rt.map(e=>{var i;const a=((i=_.find(s=>s.id===e.agent))==null?void 0:i.name)||`Agent ${e.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${a.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${a}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${e.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${e.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${e.status==="ok"?"bg-green-500":e.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}const za=210/25.4*96,Wa=297/25.4*96;function le(){const t=document.getElementById("eticket-output-wrapper"),e=document.getElementById("eticket-print-area");if(!t||!e||t.classList.contains("hidden"))return;e.style.zoom="1",e.style.removeProperty("--eticket-print-scale");const a=Math.max(e.scrollWidth,e.offsetWidth),i=Math.max(e.scrollHeight,e.offsetHeight);if(!a||!i)return;const s=za/a,n=Wa/i;let r=Math.min(1,s,n);r<1&&(r=Math.max(.7,r*.985)),e.style.zoom=String(r),e.style.setProperty("--eticket-print-scale",String(r))}function Ga(){const t=document.getElementById("eticket-print-area");t&&(t.style.zoom="1",t.style.removeProperty("--eticket-print-scale"))}async function Ja(){var d;const t=document.getElementById("eticket-tab");if(!t)return;const e=document.getElementById("eticket-form"),a=document.getElementById("et-add-passenger"),i=document.getElementById("et-passengers-container"),s=document.getElementById("et-airline"),n=document.getElementById("et-origin"),r=document.getElementById("et-destination");if(U.length===0&&(U=await Zt()),M.length===0&&(M=Qt(await Kt())),!t.dataset.wired){if(t.dataset.wired="1",s&&U&&(s.innerHTML='<option value="">Select Airline</option>'+U.map(l=>`<option value="${l.name}">${l.name}</option>`).join("")),n&&M){const l=[...new Set(M.map(m=>m.sectorFrom).filter(Boolean))].sort();n.innerHTML='<option value="">Select Origin</option>'+l.map(m=>`<option value="${m}">${m}</option>`).join("")}if(r&&M){const l=[...new Set(M.map(m=>m.sectorTo).filter(Boolean))].sort();r.innerHTML='<option value="">Select Destination</option>'+l.map(m=>`<option value="${m}">${m}</option>`).join("")}const o=()=>{const l=Array.from(i.querySelectorAll(".et-pax-row"));l.forEach((m,c)=>{const p=m.querySelector(".et-passenger-index");p&&(p.textContent=`Passenger ${c+1}`);const u=m.querySelector(".et-remove-passenger");u&&(l.length<=1?(u.classList.add("opacity-40","pointer-events-none"),u.setAttribute("aria-disabled","true")):(u.classList.remove("opacity-40","pointer-events-none"),u.removeAttribute("aria-disabled")))})};a==null||a.addEventListener("click",()=>{const l=`
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
                ${$t(la,7)}
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Check-in Bag</label>
              <select name="paxCheckBag[]" class="admin-control h-10">
                ${$t(Lt,30)}
              </select>
            </div>
          </div>
        </div>
      `;i.insertAdjacentHTML("beforeend",l),o()}),i==null||i.addEventListener("click",l=>{var c;const m=l.target.closest(".et-remove-passenger");m&&((c=m.closest(".et-pax-row"))==null||c.remove(),o())}),i.children.length===0&&(a==null||a.click()),o(),e==null||e.addEventListener("submit",async l=>{l.preventDefault(),await Ya(new FormData(e))}),(d=document.getElementById("et-print-btn"))==null||d.addEventListener("click",()=>{le(),requestAnimationFrame(()=>window.print())}),window.addEventListener("beforeprint",le),window.addEventListener("afterprint",Ga),e==null||e.addEventListener("reset",()=>{setTimeout(()=>{var l;Array.from(i.children).forEach((m,c)=>{c>0&&m.remove()}),i.children.length===0&&(a==null||a.click()),o(),(l=document.getElementById("eticket-output-wrapper"))==null||l.classList.add("hidden")},10),b("info","Form Reset","The E-Ticket form has been cleared.")})}}async function Ya(t){var Ct,q,R;const e=(Ct=t.get("etPnr"))==null?void 0:Ct.toUpperCase(),a=(q=t.get("etAirline"))==null?void 0:q.toUpperCase(),i=(R=t.get("etFlightNo"))==null?void 0:R.toUpperCase(),s=t.get("etDate"),n=t.get("etDepTime"),r=t.get("etArrTime"),d=t.get("etPhone"),o=($="")=>String($).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),l=$=>{const N=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec($||"");return N?Number(N[1])*60+Number(N[2]):null},m=($="")=>$.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",c=$=>{const N=($||"").trim();let P=N,vt="";const Y=N.match(/^(.*?)\s*\((.*?)\)$/);return Y&&(P=Y[1].trim(),vt=Y[2].trim()),{city:P,code:vt}},p=c(t.get("etOrigin")),u=c(t.get("etDest")),g=t.get("etOrigin")||"—",v=t.get("etDest")||"—";let w="—";if(s){const $=new Date(s);if(!isNaN($.getTime())){const N=["SUN","MON","TUE","WED","THU","FRI","SAT"],P=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];w=`${N[$.getDay()]}, ${String($.getDate()).padStart(2,"0")} ${P[$.getMonth()]} ${$.getFullYear()}`}}const I=$=>document.getElementById($);let C=p.code,f=u.code,h=null;if(typeof M<"u"){if(h=M.find($=>$.sectorFrom===g&&$.sectorTo===v),!h&&g){const $=M.find(N=>N.sectorFrom===g);$&&$.sectorCode&&(C=$.sectorCode.split(/[ -]+/)[0])}if(!h&&v){const $=M.find(N=>N.sectorTo===v);$&&$.sectorCode&&(f=$.sectorCode.split(/[ -]+/).pop())}}const E=(C||m(p.city)).toUpperCase(),k=(f||m(u.city)).toUpperCase(),H=`${E} - ${k}`,z=`${(p.city||g).toUpperCase()} to ${(u.city||v).toUpperCase()}`,J=(p.city||g).toUpperCase(),X=(u.city||v).toUpperCase(),K=l(n),ct=l(r);let ut="N/A";if(K!==null&&ct!==null){let $=ct-K;$<0&&($+=24*60);const N=Math.floor($/60),P=$%60;ut=`${N}h ${String(P).padStart(2,"0")}m`}I("t-pnr")&&(I("t-pnr").textContent=e||"—"),I("t-issued-by")&&(I("t-issued-by").textContent=a||"—"),I("t-customer-phone")&&(I("t-customer-phone").textContent=d||"—"),I("t-flight-code")&&(I("t-flight-code").textContent=i||"—"),I("t-travel-date")&&(I("t-travel-date").textContent=w||"—"),I("t-route-code")&&(I("t-route-code").textContent=H),I("t-route-long")&&(I("t-route-long").textContent=z),I("t-duration")&&(I("t-duration").textContent=ut);const y=new Date,B=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],A=`${String(y.getDate()).padStart(2,"0")} ${B[y.getMonth()]} ${y.getFullYear()} ${String(y.getHours()).padStart(2,"0")}:${String(y.getMinutes()).padStart(2,"0")}`;I("t-booked-on")&&(I("t-booked-on").textContent=A);const F=I("t-airline-logo"),T=I("t-issued-by-fallback");if(F){const $=typeof U<"u"?U.find(N=>N.name.toUpperCase()===a):null;$&&$.logoUrl?(F.src=$.logoUrl,F.classList.remove("hidden"),T&&T.classList.add("hidden")):(F.removeAttribute("src"),F.classList.add("hidden"),T&&(T.classList.remove("hidden"),T.textContent=(a||"No logo").toUpperCase()))}const St=t.getAll("paxTitle[]"),Z=t.getAll("paxName[]"),yt=t.getAll("paxType[]"),pt=t.getAll("paxCheckBag[]"),et=t.getAll("paxCarryBag[]");I("t-pax-count")&&(I("t-pax-count").textContent=String(Z.length));const V=document.getElementById("t-passengers-tbody");if(V){const $=Z.map((N,P)=>{const vt=o((St[P]||"MR").toUpperCase()),Y=o((Z[P]||"").toUpperCase()),Ot=o((yt[P]||"ADT").toUpperCase()),Rt=o(oe(pt[P])),xt=o(oe(et[P])),wt=h&&h.sectorCode?o(h.sectorCode.toUpperCase()):o(H);return`
        <tr class="${P%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${P+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${vt}. ${Y}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Ot}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${wt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${o(i||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${o(e||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${xt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Rt}</td>
        </tr>
      `}).join("");V.innerHTML=$||`
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `}const at=document.getElementById("t-travel-tbody");at&&(at.innerHTML=`
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${o(i||"—")}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${o(J)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${o(E)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${o(n||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${o(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${o(X)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${o(k)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${o(r||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${o(w||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const ht=document.getElementById("eticket-output-wrapper");ht&&(ht.classList.remove("hidden"),ht.scrollIntoView({behavior:"smooth"}))}const ce={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function b(t,e,a){const i=document.getElementById("toastsEl");if(!i)return;const s=document.createElement("div"),n={success:"border-emerald-200 bg-emerald-50/95 text-emerald-900",error:"border-rose-200 bg-rose-50/95 text-rose-900",warning:"border-amber-200 bg-amber-50/95 text-amber-900",info:"border-blue-200 bg-blue-50/95 text-blue-900"};s.className=`flex items-start gap-3 p-4 border rounded-xl shadow-md w-80 pointer-events-auto backdrop-blur-sm ${n[t]||n.error}`,s.innerHTML=`<div class="mt-0.5">${ce[t]||ce.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${e}</div><div class="text-xs opacity-90 mt-1">${a}</div></div>
    <button class="opacity-50 hover:opacity-100 transition-opacity" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,i.appendChild(s),setTimeout(()=>s.isConnected&&s.remove(),7e3)}window.toast=b;document.addEventListener("DOMContentLoaded",()=>{});async function st(t=!0){if(t)try{const[n,r,d,o]=await Promise.all([pe(),We(),Ge(),Je()]);Ht=n,zt=r,Wt=d,Gt=o,x.visas=1,x.visaStampings=1,x.attestations=1,x.passportServices=1}catch(n){b("error","Error loading Visas tab data",n.message)}const e=document.querySelector("#visas-tab #visas-table-body");if(e){const n=ft(Ht,"visas"),r=tableLimit.visas,d=Math.max(1,Math.ceil(n.length/r));x.visas>d&&(x.visas=d);const o=(x.visas-1)*r,l=n.slice(o,o+r);e.innerHTML=l.length?l.map(m=>Ka(m)).join(""):'<tr><td colspan="6" class="text-center py-8 text-text-muted">No tourist visas yet. Click "Add Tourist Visa".</td></tr>',Za()}const a=document.querySelector("#visa-stamping-table-body");if(a){const n=ft(zt,"visaStampings"),r=tableLimit.visaStampings,d=Math.max(1,Math.ceil(n.length/r));x.visaStampings>d&&(x.visaStampings=d);const o=(x.visaStampings-1)*r,l=n.slice(o,o+r);a.innerHTML=l.length?l.map(m=>Qa(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No visa stampings yet. Click "Add Visa Stamping".</td></tr>',tn()}const i=document.querySelector("#attestations-table-body");if(i){const n=ft(Wt,"attestations"),r=tableLimit.attestations,d=Math.max(1,Math.ceil(n.length/r));x.attestations>d&&(x.attestations=d);const o=(x.attestations-1)*r,l=n.slice(o,o+r);i.innerHTML=l.length?l.map(m=>en(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No attestations yet. Click "Add Attestation".</td></tr>',an()}const s=document.querySelector("#passport-services-table-body");if(s){const n=ft(Gt,"passportServices"),r=tableLimit.passportServices,d=Math.max(1,Math.ceil(n.length/r));x.passportServices>d&&(x.passportServices=d);const o=(x.passportServices-1)*r,l=n.slice(o,o+r);s.innerHTML=l.length?l.map(m=>nn(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No passport services yet. Click "Add Passport Service".</td></tr>',sn()}Xa()}function Xa(){const t=document.getElementById("visas-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>Be(null)));const e=document.getElementById("visa-stamping-add-btn");e&&!e.dataset.wired&&(e.dataset.wired="1",e.addEventListener("click",()=>Ae(null)));const a=document.getElementById("attestation-add-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",()=>Le(null)));const i=document.getElementById("passport-service-add-btn");i&&!i.dataset.wired&&(i.dataset.wired="1",i.addEventListener("click",()=>Te(null)))}function Ka(t){const e=t.flagUrl?`<span class="admin-logo-wrap"><img src="${t.flagUrl}" alt="${S(t.countryName||"Country")}"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-flag"></i></span></span>';return`<tr data-visa-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy">${S(t.countryName)}</td>
    <td class="text-text-muted text-[13px]">${S(t.visaType)}</td>
    <td class="text-text-muted text-[13px]">${S(t.processingTime)}</td>
    <td class="font-black text-[15px] text-navy">AED ${(t.rate||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Za(){const t=document.querySelector("#visas-tab .admin-table tbody");t&&(delete t.dataset.actionsWired,t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:i,id:s}=a.dataset,n=Ht.find(r=>r.id===s);if(i==="edit-visa"&&Be(n),i==="delete-visa"){if(!confirm(`Delete visa for "${n==null?void 0:n.countryName}"?`))return;try{await Ye(s),b("success","Deleted",`Visa for "${n==null?void 0:n.countryName}" removed.`),await st()}catch(r){b("error","Error",r.message)}}}))}function Be(t){const e=document.getElementById("modal-visa-form");if(!e)return;mt(t?"Edit Visa":"Add New Visa",e.innerHTML);const a=document.getElementById("visa-form"),i=document.getElementById("visa-id"),s=document.getElementById("visa-country"),n=document.getElementById("visa-type"),r=document.getElementById("visa-rate"),d=document.getElementById("visa-processing");t&&(i.value=t.id,s.value=t.countryName||"",n.value=t.visaType||"",r.value=t.rate||0,d.value=t.processingTime||""),a.addEventListener("submit",async o=>{o.preventDefault();const l=a.querySelector('button[type="submit"]');l.disabled=!0,l.textContent="Saving...";try{const m=i.value,c={countryName:s.value.trim(),visaType:n.value.trim(),rate:Number(r.value),processingTime:d.value.trim()},u=document.getElementById("visa-flag").files[0];m?await Xe(m,c,u):await Ke(c,u),b("success","Saved!",`Visa for ${c.countryName} saved.`),document.getElementById("admin-modal").close(),await st()}catch(m){b("error","Error",m.message),l.disabled=!1,l.textContent="Save Visa"}})}function Qa(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${S(t.country)}</td>
    <td class="text-text-muted text-[13px]">${S(t.description)}</td>
    <td class="text-text-muted text-[13px]">${S(t.processingTime)}</td>
    <td class="font-black text-[15px] text-navy">AED ${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function tn(){const t=document.getElementById("visa-stamping-table-body");t&&(delete t.dataset.actionsWired,t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:i,id:s}=a.dataset,n=zt.find(r=>r.id===s);if(i==="edit-visa-stamping"&&Ae(n),i==="delete-visa-stamping"){if(!confirm(`Delete visa stamping for "${n==null?void 0:n.country}"?`))return;try{await Ze(s),b("success","Deleted",`Visa Stamping for "${n==null?void 0:n.country}" removed.`),await st(!0)}catch(r){b("error","Error",r.message)}}}))}function Ae(t){const e=document.getElementById("modal-visa-stamping-form");if(!e)return;mt(t?"Edit Visa Stamping":"Add Visa Stamping",e.innerHTML);const a=document.getElementById("visa-stamping-form"),i=document.getElementById("visa-stamping-id"),s=document.getElementById("visa-stamping-country"),n=document.getElementById("visa-stamping-desc"),r=document.getElementById("visa-stamping-time"),d=document.getElementById("visa-stamping-cost");t&&(i.value=t.id,s.value=t.country||"",n.value=t.description||"",r.value=t.processingTime||"",d.value=t.cost||0),a.addEventListener("submit",async o=>{o.preventDefault();const l=a.querySelector('button[type="submit"]');l.disabled=!0,l.textContent="Saving...";try{const m=i.value,c={country:s.value.trim(),description:n.value.trim(),processingTime:r.value.trim(),cost:Number(d.value)};m?await Qe(m,c):await ta(c),b("success","Saved!",`Visa stamping for ${c.country} saved.`),document.getElementById("admin-modal").close(),await st(!0)}catch(m){b("error","Error",m.message),l.disabled=!1,l.textContent="Save"}})}function en(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${S(t.country)}</td>
    <td class="text-text-muted text-[13px]">${S(t.certificate)}</td>
    <td class="font-black text-[15px] text-navy">AED ${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-attestation" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-attestation" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function an(){const t=document.getElementById("attestations-table-body");t&&(delete t.dataset.actionsWired,t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:i,id:s}=a.dataset,n=Wt.find(r=>r.id===s);if(i==="edit-attestation"&&Le(n),i==="delete-attestation"){if(!confirm(`Delete attestation for "${n==null?void 0:n.country}"?`))return;try{await ea(s),b("success","Deleted",`Attestation for "${n==null?void 0:n.country}" removed.`),await st(!0)}catch(r){b("error","Error",r.message)}}}))}function Le(t){const e=document.getElementById("modal-attestation-form");if(!e)return;mt(t?"Edit Attestation":"Add Attestation",e.innerHTML);const a=document.getElementById("attestation-form"),i=document.getElementById("attestation-id"),s=document.getElementById("attestation-country"),n=document.getElementById("attestation-cert"),r=document.getElementById("attestation-cost");t&&(i.value=t.id,s.value=t.country||"",n.value=t.certificate||"",r.value=t.cost||0),a.addEventListener("submit",async d=>{d.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=i.value,m={country:s.value.trim(),certificate:n.value.trim(),cost:Number(r.value)};l?await aa(l,m):await na(m),b("success","Saved!",`Attestation for ${m.country} saved.`),document.getElementById("admin-modal").close(),await st(!0)}catch(l){b("error","Error",l.message),o.disabled=!1,o.textContent="Save"}})}function nn(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${S(t.type)}</td>
    <td class="text-text-muted text-[13px]">${S(t.description)}</td>
    <td class="font-black text-[15px] text-navy">AED ${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function sn(){const t=document.getElementById("passport-services-table-body");t&&(delete t.dataset.actionsWired,t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:i,id:s}=a.dataset,n=Gt.find(r=>r.id===s);if(i==="edit-passport-service"&&Te(n),i==="delete-passport-service"){if(!confirm(`Delete passport service "${n==null?void 0:n.type}"?`))return;try{await sa(s),b("success","Deleted",`Passport service "${n==null?void 0:n.type}" removed.`),await st(!0)}catch(r){b("error","Error",r.message)}}}))}function Te(t){const e=document.getElementById("modal-passport-service-form");if(!e)return;mt(t?"Edit Passport Service":"Add Passport Service",e.innerHTML);const a=document.getElementById("passport-service-form"),i=document.getElementById("passport-service-id"),s=document.getElementById("passport-service-type"),n=document.getElementById("passport-service-desc"),r=document.getElementById("passport-service-cost");t&&(i.value=t.id,s.value=t.type||"",n.value=t.description||"",r.value=t.cost||0),a.addEventListener("submit",async d=>{d.preventDefault();const o=a.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Saving...";try{const l=i.value,m={type:s.value.trim(),description:n.value.trim(),cost:Number(r.value)};l?await ia(l,m):await oa(m),b("success","Saved!",`Passport service ${m.type} saved.`),document.getElementById("admin-modal").close(),await st(!0)}catch(l){b("error","Error",l.message),o.disabled=!1,o.textContent="Save"}})}
