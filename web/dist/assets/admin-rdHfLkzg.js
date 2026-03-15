import"./index.esm-DPDniVF0.js";import{o as Ba,l as Ca}from"./auth-BI9FOYFY.js";import{a as le,d as Se,u as Je,c as Xe,e as Ta,f as Aa,h as La,i as ka,g as Be,j as Da,k as Ma,l as Fa,m as Ra,b as Ce,n as ja,o as Ha,p as Na,q as Pa,r as Ke,s as Ua,t as qa,v as Oa,w as _a,x as Va,y as za,z as Ga,A as Wa,B as Ya,C as Ja,D as Xa,E as Ka,F as Za,G as Qa,H as tn,I as en,J as an,K as nn,L as sn,M as on,N as rn,O as dn,P as ln,Q as cn}from"./db-Dzh3zJx8.js";import"./firebase-config-CsZGR70X.js";async function Ue(t,e,a,s,i){const n=`Generating ${t} Video... Please remain on this tab.`;if(window.toast&&window.toast("info","Video Generation",n),typeof MediaRecorder>"u")throw window.toast&&window.toast("error","Video Generation","Your browser does not support MediaRecorder."),new Error("MediaRecorder is not supported in this browser.");const o=[{id:"classic",topBar:["#0c4a8a","#1e67c2","#60a5fa"],headerBg:"#0f172a",headerOverlayFrom:"#0f172a",headerOverlayTo:"rgba(15, 23, 42, 0)",badgeBg:"rgba(12, 74, 138, 0.25)",badgeBorder:"rgba(96, 165, 250, 0.4)",badgeText:"#dbeafe",subtitle:"#dbeafe",accent:"#60a5fa",bodyBg:"#f8fafc",tableHeadText:"#64748b",rowAlt:"#f3f6ff",sectorText:"#2563eb",fareBadgeBg:"#0f172a",fareBadgeText:"#ffffff",footerBg:"#ffffff",footerBorder:"#f1f5f9",footerText:"#1e293b",footerAccent:"#2563eb"},{id:"deep",topBar:["#073160","#0c4a8a","#1e67c2"],headerBg:"#111827",headerOverlayFrom:"#111827",headerOverlayTo:"rgba(17, 24, 39, 0)",badgeBg:"rgba(12, 74, 138, 0.28)",badgeBorder:"rgba(30, 103, 194, 0.45)",badgeText:"#e0efff",subtitle:"#cfe1ff",accent:"#1e67c2",bodyBg:"#f8fafc",tableHeadText:"#64748b",rowAlt:"#f4f7ff",sectorText:"#1e67c2",fareBadgeBg:"#111827",fareBadgeText:"#ffffff",footerBg:"#ffffff",footerBorder:"#f1f5f9",footerText:"#1e293b",footerAccent:"#1e67c2"},{id:"royal",topBar:["#0f4f9e","#1e67c2","#60a5fa"],headerBg:"#0c1f3a",headerOverlayFrom:"#0c1f3a",headerOverlayTo:"rgba(12, 31, 58, 0)",badgeBg:"rgba(15, 79, 158, 0.25)",badgeBorder:"rgba(96, 165, 250, 0.4)",badgeText:"#dbeafe",subtitle:"#dbeafe",accent:"#0f4f9e",bodyBg:"#f8fafc",tableHeadText:"#64748b",rowAlt:"#f0f7ff",sectorText:"#0f4f9e",fareBadgeBg:"#0c1f3a",fareBadgeText:"#ffffff",footerBg:"#ffffff",footerBorder:"#f1f5f9",footerText:"#1e293b",footerAccent:"#0f4f9e"}];function r(d=""){const m=String(d);let u=0;for(let y=0;y<m.length;y++)u=(u<<5)-u+m.charCodeAt(y),u|=0;return Math.abs(u)}function l(d){if(!o.length)return o[0];const m=r(d)%o.length;return o[m]}return new Promise(async(d,m)=>{try{let G=function(v,A,L,U,_){c.beginPath(),c.moveTo(v+_,A),c.lineTo(v+L-_,A),c.arcTo(v+L,A,v+L,A+_,_),c.lineTo(v+L,A+U-_),c.arcTo(v+L,A+U,v+L-_,A+U,_),c.lineTo(v+_,A+U),c.arcTo(v,A+U,v,A+U-_,_),c.lineTo(v,A+_),c.arcTo(v,A,v+_,A,_),c.closePath()},Ct=function(v){if(ct)return;const A=v-jt;if(A>Bt){try{ct=!0,Z.stop()}catch(W){console.error("Error stopping recorder",W)}return}c.fillStyle=h.bodyBg,c.fillRect(0,0,u,y);const L=c.createLinearGradient(0,0,u,y);if(L.addColorStop(0,"rgba(255,255,255,0.35)"),L.addColorStop(.5,"rgba(255,255,255,0)"),L.addColorStop(1,"rgba(37,99,235,0.06)"),c.fillStyle=L,c.fillRect(0,0,u,y),c.fillStyle=h.headerBg,c.fillRect(0,0,u,nt),j.complete&&j.width>0){const W=6*Math.sin(A/1800);c.globalAlpha=.22;const P=Math.max(u/j.width,nt/j.height),ut=j.width*P,Ht=j.height*P,Lt=(u-ut)/2,kt=(nt-Ht)/2+W;c.drawImage(j,Lt,kt,ut,Ht),c.globalAlpha=1}const U=c.createLinearGradient(0,0,0,nt);U.addColorStop(0,h.headerOverlayFrom),U.addColorStop(1,h.headerOverlayTo),c.fillStyle=U,c.globalAlpha=.8,c.fillRect(0,0,u,nt),c.globalAlpha=1,c.textAlign="center",c.textBaseline="middle";const _=(Math.sin(A/1600)+1)/2,qt=c.createLinearGradient(-u*.15*_,0,u*(1+.15*_),0);qt.addColorStop(0,h.topBar[0]),qt.addColorStop(.5,h.topBar[1]),qt.addColorStop(1,h.topBar[2]),c.fillStyle=qt,c.fillRect(0,0,u,16);const At=200,De=40,Ot=60,wa=1+.02*Math.sin(A/700);c.fillStyle=h.badgeBg,G(u/2-At/2,Ot,At*wa,De,20),c.fill(),c.strokeStyle=h.badgeBorder,c.lineWidth=1,c.stroke(),c.fillStyle=h.badgeText,c.font="bold 16px Arial, sans-serif",c.fillText("EXCLUSIVE DEALS",u/2,Ot+De/2);const $a=t==="16x9"?70:56;c.font=`900 ${$a}px Arial, sans-serif`,c.textBaseline="middle";const ge="→";if(E.includes(ge)){const W=E.split(ge),P=W[0].trim(),ut=W[1].trim(),Ht=` ${ge} `;c.textAlign="left";const Lt=c.measureText(P).width,kt=c.measureText(Ht).width,pe=c.measureText(ut).width,gt=Lt+kt+pe,_t=(u-gt)/2,Vt=Ot+80-6*(1-T(Math.min(1,A/800)));c.fillStyle="#ffffff",c.fillText(P,_t,Vt),c.fillStyle=h.accent,c.fillText(Ht,_t+Lt,Vt),c.fillStyle="#ffffff",c.fillText(ut,_t+Lt+kt,Vt),c.textAlign="center"}else{c.fillStyle="#ffffff",c.textAlign="center";const W=Ot+80-6*(1-T(Math.min(1,A/800)));c.fillText(E,u/2,W)}c.fillStyle=h.subtitle,c.font="700 24px Arial, sans-serif";const Ea=Ot+140-8*(1-T(Math.min(1,A/1e3)));c.globalAlpha=Math.min(1,A/1e3),c.fillText("SPECIAL FARES AVAILABLE NOW",u/2,Ea),c.globalAlpha=1;const Q=t==="9x16"?40:t==="1x1"?80:160,ht=u-Q*2;c.fillStyle=h.tableHeadText,c.font="bold 18px Arial, sans-serif",c.textAlign="left",c.fillText("DATE",Q+20,dt-20),c.textAlign="center",c.fillText("SECTOR",Q+ht*.25,dt-20),c.fillText("AIRLINE",Q+ht*.45,dt-20),c.fillText("TIME",Q+ht*.65,dt-20),c.textAlign="right",c.fillText("FARE",Q+ht-20,dt-20);for(let W=0;W<lt.length;W++){const P=lt[W],ut=1e3+W*800;if(A<ut)continue;const Lt=Math.min(1,(A-ut)/650),kt=T(Lt),pe=26*(1-kt),gt=dt+W*k+pe;c.globalAlpha=kt;const _t=W%2===0?"#ffffff":h.rowAlt;c.fillStyle=_t,G(Q,gt,ht,k-10,12),c.fill(),c.fillStyle="#0f172a",c.textBaseline="middle";const Vt=P.flightDate instanceof Date?P.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():P.flightDate;c.textAlign="left",c.font="900 26px Arial, sans-serif",c.fillText(Vt,Q+20,gt+k/2-5),c.font="700 22px Arial, sans-serif",c.fillStyle=h.sectorText,c.textAlign="center";const Ia=S[P.sectorId]||P.sectorId;c.fillText(Ia,Q+ht*.25,gt+k/2-5),c.fillStyle="#0f172a";const Fe=Q+ht*.45,zt=$(P.airlineId),ae=zt?et[zt.id]:null;if(ae&&ae.width>0){const Dt=Math.min(100,ae.width),Pe=40;c.drawImage(ae,Fe-Dt/2,gt+k/2-5-Pe/2,Dt,Pe)}else{c.font="700 20px Arial, sans-serif",c.textAlign="center";const Dt=(zt==null?void 0:zt.name)||P.airlineId||"—";c.fillText(Dt,Fe,gt+k/2-5)}let ne=P.flightTime||"—";if(ne.includes("-")){const Dt=ne.split("-");ne=`${Dt[0].trim()} - ${Dt[1].trim()}`}c.font="800 22px Arial, sans-serif",c.textAlign="center",c.fillText(ne,Q+ht*.65,gt+k/2-5);const Re=`₹${(P.finalRate||0).toLocaleString()}`;c.font="900 26px Arial, sans-serif",c.textAlign="right";const Sa=c.measureText(Re).width,je=Q+ht-20,He=Sa+40,Ne=50;c.fillStyle=h.fareBadgeBg,G(je-He,gt+k/2-5-Ne/2,He,Ne,12),c.fill(),c.fillStyle=h.fareBadgeText,c.fillText(Re,je-20,gt+k/2-5),c.globalAlpha=1}const Me=1e3+lt.length*800+500;if(A>Me){const W=q(Math.min(1,(A-Me)/600));c.globalAlpha=W;const P=100,ut=y-P+20*(1-W);c.fillStyle=h.footerBg,c.fillRect(0,y-P,u,P),c.fillRect(0,ut,u,P),c.fillStyle=h.footerBorder,c.fillRect(0,y-P,u,2),z.complete&&z.width>0&&c.drawImage(z,Q,y-P/2-24,48,48),c.fillStyle=h.footerText,c.font="900 24px Arial, sans-serif",c.textAlign="left",c.textBaseline="middle",c.fillText("Zamra Travels",Q+64,y-P/2),c.font="700 20px Arial, sans-serif",c.textAlign="right",c.fillStyle=h.footerText,c.fillText("zamratravels.com  |  +91 98466 06739",u-Q,y-P/2),c.globalAlpha=1}requestAnimationFrame(Ct)},u,y;if(t==="1x1")u=1080,y=1080;else if(t==="9x16")u=1080,y=1920;else if(t==="16x9")u=1920,y=1080;else throw new Error("Invalid ratio selected");const p=document.createElement("canvas");p.width=u,p.height=y;const c=p.getContext("2d");c.imageSmoothingEnabled=!0;let E="MULTIPLE → SECTORS",f=a;if(a!=="all"){const v=s.find(U=>U.id===a),A=v?(v.sectorFrom||"DEP").toUpperCase():"DEP",L=v?(v.sectorTo||"ARR").toUpperCase():"ARR";E=`${A} → ${L}`,f=(v==null?void 0:v.sectorCode)||`${A}-${L}`}const h=l(f),C=new Map;e.forEach(v=>{const A=v.flightDate instanceof Date?v.flightDate.getTime():v.flightDate,L=`${v.sectorId}_${v.airlineId}_${A}_${v.flightTime}`;C.has(L)?v.finalRate<C.get(L).finalRate&&C.set(L,v):C.set(L,v)});const g=Array.from(C.values()).sort((v,A)=>{let L=v.flightDate,U=A.flightDate;return L instanceof Date&&(L=L.getTime()),U instanceof Date&&(U=U.getTime()),L-U}),b={};i.forEach(v=>{v.id&&(b[v.id.trim().toLowerCase()]=v),v.code&&(b[v.code.trim().toLowerCase()]=v),v.name&&(b[v.name.trim().toLowerCase()]=v)});const $=v=>v?b[String(v).trim().toLowerCase()]:null,S={};s.forEach(v=>{S[v.id]=v.sectorCode||v.id});const M=v=>String(v||"").trim().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"").toLowerCase();let H="all-sectors";if(a!=="all"){const v=s.find(L=>L.id===a),A=(v==null?void 0:v.sectorCode)||(v?`${v.sectorFrom||""}-${v.sectorTo||""}`:"")||S[a]||a;H=M(A)||M(a)||"sector"}async function D(v){if(!v)return null;try{const A=await fetch(v);if(!A.ok)return null;const L=await A.blob(),U=URL.createObjectURL(L);return new Promise((_,qt)=>{const At=new Image;At.onload=()=>_(At),At.onerror=()=>_(null),At.src=U})}catch{return null}}const j=new Image;await new Promise(v=>{j.onload=v,j.onerror=v,j.src="/assets/img/hero-banner-bg.png"});const z=new Image;await new Promise(v=>{z.onload=v,z.onerror=v,z.src="/assets/img/logo.webp"});const et={},ot=[...new Set(g.map(v=>v.airlineId))].map(v=>$(v)).filter(v=>v&&v.logoUrl);await Promise.all(ot.map(async v=>{const A=await D(v.logoUrl);A&&(et[v.id]=A)}));const St=p.captureStream(30);let J="video/mp4";MediaRecorder.isTypeSupported(J)||(J="video/webm; codecs=h264",MediaRecorder.isTypeSupported(J)||(J="video/webm"));const Z=new MediaRecorder(St,{mimeType:J}),Ft=[];Z.ondataavailable=v=>{v.data&&v.data.size>0&&Ft.push(v.data)},Z.start(100);const nt=t==="9x16"?400:300,k=90,rt=100,dt=nt+60,st=y-dt-rt-20,Rt=Math.max(1,Math.floor(st/k)),lt=g.slice(0,Rt),Bt=1e4+lt.length*1500,jt=performance.now();let ct=!1;const T=v=>1-Math.pow(1-v,3),q=v=>v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2,Tt=setTimeout(()=>{if(!ct&&Z.state==="recording")try{ct=!0,Z.stop()}catch(v){console.error("Safety stop error:",v)}},Bt+1500);requestAnimationFrame(Ct),Z.onstop=()=>{clearTimeout(Tt);const v=new Blob(Ft,{type:J});if(!v||!v.size){window.toast&&window.toast("error","Generation Error","No video data was produced."),m(new Error("No video data generated."));return}const A=URL.createObjectURL(v),L=document.createElement("a");L.href=A;const U=J.includes("mp4")?"mp4":"webm";L.download=`zamra-video-${t}-${H}-${Date.now()}.${U}`,L.style.display="none",document.body.appendChild(L),L.click(),setTimeout(()=>{document.body.removeChild(L),URL.revokeObjectURL(A)},100),window.toast&&window.toast("success","Video Generated",`Your ${t} video has been downloaded!`),d()},Z.onerror=v=>{console.error("Recorder Error:",v),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),m(v)}}catch(u){console.error(u),window.toast&&window.toast("error","Generation Failed",u.message),m(u)}})}let K=[],F=[],O=[],ie=[],he=[],ye=[],ve=[],xe=[],we=[],Y=[],it=[],tt={},mt=new Set,yt=new Set;const Ze="zamra-admin-theme";let $e="light";function Qe(){try{return localStorage.getItem(Ze)}catch{return null}}function mn(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function oe(t){$e=t,document.documentElement.dataset.theme=t,document.documentElement.style.colorScheme=t;const e=document.getElementById("admin-theme-toggle");e&&(e.classList.toggle("is-dark",t==="dark"),e.setAttribute("aria-pressed",t==="dark"?"true":"false"),e.setAttribute("aria-label",t==="dark"?"Switch to light mode":"Switch to dark mode"))}function un(){const t=document.getElementById("admin-theme-toggle");!t||t.dataset.wired||(t.dataset.wired="1",t.addEventListener("click",()=>{const e=$e==="dark"?"light":"dark";try{localStorage.setItem(Ze,e)}catch{}oe(e)}),oe($e))}const ta=Qe();oe(ta||mn());var Ye;if(!ta&&window.matchMedia){const t=window.matchMedia("(prefers-color-scheme: dark)");(Ye=t.addEventListener)==null||Ye.call(t,"change",e=>{Qe()||oe(e.matches?"dark":"light")})}function Nt(t){return t==null?t:String(t).replace(/damamm/gi,e=>e===e.toUpperCase()?"DAMMAM":e===e.toLowerCase()?"dammam":"Dammam")}function ea(t={}){return{...t,sectorFrom:Nt(t.sectorFrom||""),sectorTo:Nt(t.sectorTo||""),sectorCode:Nt(t.sectorCode||"")}}function Te(t=[]){return t.map(e=>ea(e))}function B(t=""){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function N(t,e=0){const a=Number(t);return Number.isFinite(a)?a:e}const aa=[5,7,10],re=[20,25,30,35,40];function Pt(t=[],e=0){const a=Math.max(0,It(e)),s=[...new Set(t.map(n=>Math.max(0,It(n))))].filter(n=>n>0).sort((n,o)=>n-o);if(!s.length)return"";const i=s.includes(a)?a:s[0];return s.map(n=>`<option value="${n}" ${n===i?"selected":""}>${n} Kg</option>`).join("")}function It(t){if(t==null||t==="")return 0;const e=parseFloat(String(t).replace(/[^\d.]/g,""));return Number.isFinite(e)?e:0}function qe(t,e="—"){if(t==null||t==="")return e;const a=String(t).trim();return a?/^\d+(\.\d+)?(\s*kg)?$/i.test(a)?`${It(a)} Kg`:a.toUpperCase():e}function Xt(t){if(!t)return null;if(t instanceof Date)return Number.isNaN(t.getTime())?null:t;const e=new Date(t);return Number.isNaN(e.getTime())?null:e}function Kt(t){const e=Xt(t);if(!e)return"";const a=e.getTimezoneOffset();return new Date(e.getTime()-a*60*1e3).toISOString().split("T")[0]}function na(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e}function gn(t){if(!t)return null;const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?null:e.getTime()}function pn(t){if(!t)return null;const e=new Date(`${t}T23:59:59.999`);return Number.isNaN(e.getTime())?null:e.getTime()}let pt={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},visas:{key:"countryName",asc:!0},visaStampings:{key:"country",asc:!0},attestations:{key:"country",asc:!0},passportServices:{key:"type",asc:!0},tours:{key:"title",asc:!0},hajjUmrah:{key:"title",asc:!0},reportFares:{key:"flightDate",asc:!0},databaseFares:{key:"flightDate",asc:!0}},ce={agents:"",sectors:"",airlines:"",visas:"",visaStampings:"",attestations:"",passportServices:"",tours:"",hajjUmrah:""},I={agents:1,sectors:1,airlines:1,visas:1,visaStampings:1,attestations:1,passportServices:1,tours:1,hajjUmrah:1,reportFares:1,databaseFares:1},X={agents:10,sectors:25,airlines:10,visas:10,visaStampings:10,attestations:10,passportServices:10,tours:10,hajjUmrah:10,reportFares:10,databaseFares:25};const R={search:"",agentId:"all",sectorId:"all",airlineId:"all",status:"all",startDate:"",endDate:""};function vt(t,e){var o;let a=t;const s=(o=ce[e])==null?void 0:o.toLowerCase();s&&e==="agents"?a=a.filter(r=>(r.name||"").toLowerCase().includes(s)||(r.email||"").toLowerCase().includes(s)||(r.contactPhone||"").toLowerCase().includes(s)||(r.id||"").toLowerCase().includes(s)):s&&e==="sectors"?a=a.filter(r=>(r.sectorFrom||"").toLowerCase().includes(s)||(r.sectorTo||"").toLowerCase().includes(s)||(r.sectorCode||"").toLowerCase().includes(s)):s&&e==="airlines"?a=a.filter(r=>(r.name||"").toLowerCase().includes(s)||(r.code||"").toLowerCase().includes(s)):s&&e==="visas"?a=a.filter(r=>(r.countryName||"").toLowerCase().includes(s)||(r.visaType||"").toLowerCase().includes(s)):s&&e==="visaStampings"?a=a.filter(r=>(r.country||"").toLowerCase().includes(s)||(r.description||"").toLowerCase().includes(s)):s&&e==="attestations"?a=a.filter(r=>(r.country||"").toLowerCase().includes(s)||(r.certificate||"").toLowerCase().includes(s)):s&&e==="passportServices"?a=a.filter(r=>(r.type||"").toLowerCase().includes(s)||(r.description||"").toLowerCase().includes(s)):s&&e==="tours"?a=a.filter(r=>(r.title||"").toLowerCase().includes(s)||(r.category||"").toLowerCase().includes(s)||(r.duration||"").toLowerCase().includes(s)):s&&e==="hajjUmrah"&&(a=a.filter(r=>(r.title||"").toLowerCase().includes(s)||(r.type||"").toLowerCase().includes(s)||(r.departureCity||"").toLowerCase().includes(s)||(r.airline||"").toLowerCase().includes(s)));const{key:i,asc:n}=pt[e];return i&&(a=[...a].sort((r,l)=>{let d=r[i],m=l[i];if(d instanceof Date&&(d=d.getTime()),m instanceof Date&&(m=m.getTime()),i==="id"){const u=parseInt(d),y=parseInt(m);if(!isNaN(u)&&!isNaN(y))return n?u-y:y-u}return typeof d=="string"&&(d=d.toLowerCase()),typeof m=="string"&&(m=m.toLowerCase()),d<m?n?-1:1:d>m?n?1:-1:0})),a}function ee(t){document.querySelectorAll(`th[data-sort-tab="${t}"] i`).forEach(a=>{a.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const e=document.querySelector(`th[data-sort-tab="${t}"][data-sort-key="${pt[t].key}"]`);if(e){const a=e.querySelector("i");a&&(a.className=`bi bi-arrow-${pt[t].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",t=>{const e=t.target.closest("th[data-sort-tab]");if(!e)return;const a=e.dataset.sortTab,s=e.dataset.sortKey;pt[a].key===s?pt[a].asc=!pt[a].asc:(pt[a].key=s,pt[a].asc=!0),a==="agents"?xt(!1):a==="sectors"?wt(!1):a==="airlines"?Mt(!1):a==="visas"?bt(!1):a==="tours"?me(!1):a==="hajjUmrah"?ue(!1):a==="reportFares"&&Y.length?Zt(Y):a==="databaseFares"&&V()});document.documentElement.style.visibility="hidden";Ba(async t=>{if(!t){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const e=document.getElementById("admin-user-name");e&&(e.textContent=t.email.split("@")[0]),await fn(),ga(),await sa()});document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("admin-logout-btn");t&&t.addEventListener("click",async()=>{(await Ca()).success&&(window.location.href="/login.html")}),un(),hn(),bn(),Gn()});async function fn(){try{const[t,e,a,s]=await Promise.all([Xe(),Be(),Ce(),Ke()]);K=t,F=Te(e),O=a,ie=s}catch(t){console.error("loadGlobalData error:",t)}}function bn(){var i;const t=document.querySelectorAll(".nav-link"),e=document.querySelectorAll(".tab-content"),a=document.getElementById("page-title"),s=document.getElementById("admin-tab-select");if(t.forEach(n=>{n.addEventListener("click",async o=>{var d;o.preventDefault(),t.forEach(m=>{m.classList.remove("active","text-primary"),m.classList.add("text-text-muted")}),n.classList.remove("text-text-muted"),n.classList.add("active","text-primary");const r=n.getAttribute("data-tab"),l=n.getAttribute("data-title");e.forEach(m=>m.classList.remove("active")),(d=document.getElementById(r))==null||d.classList.add("active"),a&&l&&(a.textContent=l),s&&r&&(s.value=r),await sa()})}),s){const n=document.querySelector(".nav-link.active");(i=n==null?void 0:n.dataset)!=null&&i.tab&&(s.value=n.dataset.tab),s.addEventListener("change",()=>{const o=s.value,r=document.querySelector(`.nav-link[data-tab="${o}"]`);r&&r.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0}))})}}async function sa(){const t=document.querySelector(".tab-content.active");if(!t)return;const e=t.id;e==="agents-tab"?await xt():e==="sectors-tab"?await wt():e==="flights-tab"?await Mt():e==="dashboard-tab"?await wn():e==="reports-tab"?await An():e==="database-tab"?await Le():e==="visas-tab"?await bt():e==="tours-tab"?await me():e==="hajjumrah-tab"?await ue():e==="agent-sheets-tab"?(ga(),te(),Et()):e==="eticket-tab"&&await Qn()}function hn(){const t=document.getElementById("admin-modal"),e=document.getElementById("modal-close-btn");e&&e.addEventListener("click",()=>t.close()),t==null||t.addEventListener("click",a=>{a.target===t&&t.close()})}function ft(t,e,a=!1){const s=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=t,s.classList.toggle("max-w-lg",!a),s.classList.toggle("max-w-2xl",a);const i=document.getElementById("modal-body");i.innerHTML=e,s.showModal()}const Oe=10,fe=[{id:"classic",topBar:["#0c4a8a","#1e67c2","#60a5fa"],headerBg:"#0f172a",headerOverlayFrom:"#0f172a",headerOverlayTo:"rgba(15, 23, 42, 0)",badgeBg:"rgba(12, 74, 138, 0.22)",badgeBorder:"rgba(96, 165, 250, 0.35)",badgeText:"#dbeafe",subtitle:"#dbeafe",accent:"#60a5fa",bodyBg:"#f8fafc",cardBg:"#ffffff",cardBorder:"#e2e8f0",tableHeadBg:"#eef4ff",tableHeadText:"#475569",tableBorder:"#e2e8f0",rowAlt:"#f3f6ff",sectorChipBg:"rgba(37, 99, 235, 0.12)",sectorChipText:"#2563eb",fareText:"#0f172a",footerBg:"#ffffff",footerBorder:"#e2e8f0",footerAccent:"#2563eb"},{id:"deep",topBar:["#073160","#0c4a8a","#1e67c2"],headerBg:"#111827",headerOverlayFrom:"#111827",headerOverlayTo:"rgba(17, 24, 39, 0)",badgeBg:"rgba(12, 74, 138, 0.24)",badgeBorder:"rgba(30, 103, 194, 0.38)",badgeText:"#e0efff",subtitle:"#cfe1ff",accent:"#1e67c2",bodyBg:"#f8fafc",cardBg:"#ffffff",cardBorder:"#e2e8f0",tableHeadBg:"#eef4ff",tableHeadText:"#475569",tableBorder:"#e2e8f0",rowAlt:"#f4f7ff",sectorChipBg:"rgba(30, 103, 194, 0.12)",sectorChipText:"#1e67c2",fareText:"#0f172a",footerBg:"#ffffff",footerBorder:"#e2e8f0",footerAccent:"#1e67c2"},{id:"royal",topBar:["#0f4f9e","#1e67c2","#60a5fa"],headerBg:"#0c1f3a",headerOverlayFrom:"#0c1f3a",headerOverlayTo:"rgba(12, 31, 58, 0)",badgeBg:"rgba(15, 79, 158, 0.22)",badgeBorder:"rgba(96, 165, 250, 0.35)",badgeText:"#dbeafe",subtitle:"#dbeafe",accent:"#0f4f9e",bodyBg:"#f8fafc",cardBg:"#ffffff",cardBorder:"#e2e8f0",tableHeadBg:"#ecf3ff",tableHeadText:"#475569",tableBorder:"#e2e8f0",rowAlt:"#f0f7ff",sectorChipBg:"rgba(15, 79, 158, 0.12)",sectorChipText:"#0f4f9e",fareText:"#0f172a",footerBg:"#ffffff",footerBorder:"#e2e8f0",footerAccent:"#0f4f9e"}];function yn(t=""){const e=String(t);let a=0;for(let s=0;s<e.length;s++)a=(a<<5)-a+e.charCodeAt(s),a|=0;return Math.abs(a)}function vn(t){if(!fe.length)return null;const e=yn(t)%fe.length;return fe[e]}function xn(t,e){if(!t||!e)return;const a=t.querySelector("[data-poster-top-bar]");a&&(a.style.background=`linear-gradient(to right, ${e.topBar.join(", ")})`);const s=t.querySelector("[data-poster-header]");s&&(s.style.backgroundColor=e.headerBg);const i=t.querySelector("[data-poster-header-overlay]");i&&(i.style.background=`linear-gradient(to top, ${e.headerOverlayFrom}, ${e.headerOverlayTo})`);const n=t.querySelector("[data-poster-badge]");n&&(n.style.backgroundColor=e.badgeBg,n.style.borderColor=e.badgeBorder,n.style.color=e.badgeText);const o=t.querySelector("[data-poster-subtitle]");o&&(o.style.color=e.subtitle);const r=t.querySelector("[data-poster-body]");r&&(r.style.backgroundColor=e.bodyBg);const l=t.querySelector("[data-poster-card]");l&&(l.style.backgroundColor=e.cardBg,l.style.borderColor=e.cardBorder);const d=t.querySelector("[data-poster-table-head]");d&&(d.style.borderBottom=`2px solid ${e.tableBorder}`,d.style.backgroundColor=e.tableHeadBg),t.querySelectorAll("[data-poster-th]").forEach(u=>{u.style.color=e.tableHeadText});const m=t.querySelector("[data-poster-footer]");m&&(m.style.backgroundColor=e.footerBg,m.style.borderTopColor=e.footerBorder),t.querySelectorAll("[data-poster-footer-accent]").forEach(u=>{u.style.color=e.footerAccent})}async function wn(){var s,i,n,o,r;if(!document.getElementById("dashboard-tab"))return;const e=document.getElementById("poster-sector-sel");e&&e.options.length<=2&&F.forEach(l=>{const d=new Option(l.sectorCode,l.id);e.appendChild(d)});const a=document.getElementById("poster-generate-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",async()=>{const l=document.getElementById("poster-start-date"),d=document.getElementById("poster-end-date"),m=e==null?void 0:e.value,u=(l==null?void 0:l.value)||null,y=(d==null?void 0:d.value)||null;if(!m){w("warning","Validation Error","Please select a sector to generate the poster.");return}a.disabled=!0,a.textContent="Generating…";try{const p=await le({sectorId:m,startDate:u,endDate:y,includeHidden:!1});if(!p||!p.length){w("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await $n(p,m)}catch(p){w("error","Generation Failed",p.message)}finally{a.disabled=!1,a.textContent="Generate Poster"}}),(s=document.getElementById("poster-download-jpg"))==null||s.addEventListener("click",()=>_e("jpeg")),(i=document.getElementById("poster-download-pdf"))==null||i.addEventListener("click",()=>_e("pdf")),(n=document.getElementById("poster-download-vid-1x1"))==null||n.addEventListener("click",()=>be("1x1")),(o=document.getElementById("poster-download-vid-9x16"))==null||o.addEventListener("click",()=>be("9x16")),(r=document.getElementById("poster-download-vid-16x9"))==null||r.addEventListener("click",()=>be("16x9")))}async function be(t){const e=document.getElementById("poster-sector-sel"),a=document.getElementById("poster-start-date"),s=document.getElementById("poster-end-date"),i=e==null?void 0:e.value,n=(a==null?void 0:a.value)||null,o=(s==null?void 0:s.value)||null;if(!i){w("warning","Validation Error","Please select a sector to generate the poster.");return}try{const r=await le({sectorId:i,startDate:n,endDate:o,includeHidden:!1});if(!r||!r.length){w("warning","No Fares","No live fares found for the selected sector and dates.");return}if(i==="all"){const l=new Map;r.forEach(p=>{const c=p.sectorId||"unknown";l.has(c)||l.set(c,[]),l.get(c).push(p)});const d=new Map(F.map((p,c)=>[p.id,c])),m=Array.from(l.keys()).sort((p,c)=>{const E=d.get(p)??1e9,f=d.get(c)??1e9;return E!==f?E-f:String(p).localeCompare(String(c))});w("info","Video Generation",`Generating ${m.length} videos. This may take a while…`);let u=0,y=0;for(const p of m){const c=l.get(p)||[];if(c.length)try{await Ue(t,c,p,F,O),u+=1}catch(E){y+=1,console.error("Video generation failed for sector",p,E)}}u&&w("success","Video Generation",`Downloaded ${u} videos successfully.`),y&&w("error","Video Generation",`${y} videos failed to generate. Check console for details.`);return}await Ue(t,r,i,F,O)}catch(r){console.error("Video generation failed",r),w("error","Generation Failed",r.message||"Video generation failed.")}}async function $n(t,e){const a=document.getElementById("poster-preview-container"),s=document.getElementById("poster-render-stack"),i=document.querySelector('[data-poster-template="1"]')||document.getElementById("poster-render-frame");if(!a||!s||!i)return;s.querySelectorAll('[data-poster-clone="1"]').forEach(g=>g.remove());const n=new Map;t.forEach(g=>{const b=g.flightDate instanceof Date?g.flightDate.getTime():g.flightDate,$=`${g.sectorId}_${g.airlineId}_${b}_${g.flightTime}`;n.has($)?g.finalRate<n.get($).finalRate&&n.set($,g):n.set($,g)});const r=Array.from(n.values()).sort((g,b)=>{let $=g.flightDate,S=b.flightDate;return $ instanceof Date&&($=$.getTime()),S instanceof Date&&(S=S.getTime()),$-S}),l={};O.forEach(g=>{g.id&&(l[g.id.trim().toLowerCase()]=g),g.code&&(l[g.code.trim().toLowerCase()]=g),g.name&&(l[g.name.trim().toLowerCase()]=g)});const d=g=>g?l[String(g).trim().toLowerCase()]:null;async function m(g){try{const b=await fetch(g);if(!b.ok)return null;const $=await b.blob();return URL.createObjectURL($)}catch{return null}}const u=[...new Set(r.map(g=>g.airlineId))].map(g=>d(g)).filter(g=>g&&g.logoUrl),y={};await Promise.all(u.map(async g=>{const b=await m(g.logoUrl);b&&(y[g.id]=b)}));const p={};F.forEach(g=>p[g.id]=g.sectorCode);const c=g=>String(g||"").trim().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"").toLowerCase(),E=(g,b,$,S)=>{const M=g.querySelector("[data-poster-title]")||g.querySelector("#poster-sector-title"),H=g.querySelector("[data-poster-tbody]")||g.querySelector("#poster-fares-tbody");if(!M||!H)return;xn(g,S);const D=F.find(k=>k.id===$);let j=D?(D.sectorFrom||"DEP").toUpperCase():"DEP",z=D?(D.sectorTo||"ARR").toUpperCase():"ARR";if(!D){const k=p[$]||$,rt=String(k).match(/^\s*([A-Za-z0-9]+)\s*[-→>]\s*([A-Za-z0-9]+)\s*$/);rt?(j=rt[1].toUpperCase(),z=rt[2].toUpperCase()):(j=String(k).toUpperCase(),z="")}const et=(S==null?void 0:S.accent)||"#60a5fa";M.innerHTML=z?`${j} <span style="color:${et};font-weight:900;">&#8594;</span> ${z}`:`${j}`;const ot=[],St=(S==null?void 0:S.rowAlt)||"#f8fafc",J=(S==null?void 0:S.tableBorder)||"#f1f5f9",Z=(S==null?void 0:S.sectorChipBg)||"rgba(37,99,235,0.1)",Ft=(S==null?void 0:S.sectorChipText)||"#2563eb",nt=(S==null?void 0:S.fareText)||"#0f172a";b.forEach((k,rt)=>{const dt=k.flightDate instanceof Date?k.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():k.flightDate,st=d(k.airlineId),Rt=rt%2===0?"#ffffff":St,lt=st?y[st.id]:null,Bt=lt?`<img src="${lt}" style="height:26px;max-width:90px;object-fit:contain;display:block;margin:0 auto;" alt="${(st==null?void 0:st.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:13px;white-space:nowrap;">${(st==null?void 0:st.name)||k.airlineId||"—"}</span>`,jt=`<span style="font-weight:700;color:${Ft};background-color:${Z};padding:4px 8px;border-radius:6px;font-size:12px;text-align:center;white-space:nowrap;">${p[k.sectorId]||k.sectorId}</span>`;let ct='<span style="color:#94a3b8;font-size:13px;">—</span>';if(k.flightTime){const T=k.flightTime.split("-").map(q=>q.trim());T.length>=2?ct=`<span style="font-weight:700;font-size:13px;color:#0f172a;white-space:nowrap;">${T[0]} - ${T[1]}</span>`:ct=`<span style="font-weight:700;font-size:13px;color:#0f172a;white-space:nowrap;">${k.flightTime}</span>`}ot.push(`
        <tr style="background-color:${Rt};border-bottom:1px solid ${J};">
          <td style="padding:10px 8px;font-weight:700;color:#0f172a;font-size:13px;white-space:nowrap;">${dt}</td>
          <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${jt}</td>
          <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${Bt}</td>
          <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${ct}</td>
          <td style="padding:10px 8px;text-align:right;vertical-align:middle;">
            <div style="display:inline-block;color:${nt};font-weight:900;font-size:15px;">
              &#8377;${(k.finalRate||0).toLocaleString()}
            </div>
          </td>
        </tr>`)});for(let k=b.length;k<Oe;k++){const rt=k%2===0?"#ffffff":St;ot.push(`
        <tr style="background-color:${rt};border-bottom:1px solid ${J};">
          <td style="padding:10px 8px;">&nbsp;</td>
          <td style="padding:10px 8px;">&nbsp;</td>
          <td style="padding:10px 8px;">&nbsp;</td>
          <td style="padding:10px 8px;">&nbsp;</td>
          <td style="padding:10px 8px;">&nbsp;</td>
        </tr>`)}H.innerHTML=ot.join("")},f=new Map;r.forEach(g=>{const b=g.sectorId||"unknown";f.has(b)||f.set(b,[]),f.get(b).push(g)});let h=[];if(e==="all"){h=Array.from(f.keys());const g=new Map(F.map((b,$)=>[b.id,$]));h.sort((b,$)=>{const S=g.get(b)??1e9,M=g.get($)??1e9;return S!==M?S-M:String(b).localeCompare(String($))})}else h=[e];const C=(g,b)=>{const $=[];for(let S=0;S<g.length;S+=b)$.push(g.slice(S,S+b));return $},x=[];h.forEach(g=>{const b=f.get(g)||[];if(!b.length)return;const $=C(b,Oe),S=$.length||1;$.forEach((M,H)=>{x.push({sid:g,fares:M,page:H+1,pages:S})})}),x.forEach((g,b)=>{const{sid:$,fares:S,page:M,pages:H}=g;let D=i;if(b>0){D=i.cloneNode(!0),D.dataset.posterClone="1",D.removeAttribute("data-poster-template"),D.querySelectorAll("#poster-sector-title, #poster-fares-tbody").forEach(St=>St.removeAttribute("id"));const et=p[$]||$,ot=c(et)||`sector-${b+1}`;D.id=`poster-render-frame-${ot}-${M}-${b+1}`,s.appendChild(D)}else D.id="poster-render-frame";D.dataset.posterFrame="1",D.dataset.sectorId=$,D.dataset.sectorCode=p[$]||$,D.dataset.posterPage=String(M),D.dataset.posterPageCount=String(H);const j=p[$]||$,z=vn(j);E(D,S,$,z)}),a.classList.remove("hidden"),a.classList.add("flex")}function ia(t){if(!t||t.nodeType!==1)return;const e=window.getComputedStyle(t),a=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const s of a){const i=e.getPropertyValue(s);if(i&&!i.startsWith("rgb")&&!i.startsWith("#")&&i!=="transparent"&&i!=="initial")try{t.style[s]=i}catch{}}for(const s of t.children)ia(s)}async function _e(t){const e=document.getElementById("poster-render-stack"),a=e?Array.from(e.querySelectorAll('[data-poster-frame="1"]')):[];if(!a.length)return;const s=document.getElementById("poster-download-jpg"),i=document.getElementById("poster-download-pdf");s&&(s.disabled=!0),i&&(i.disabled=!0);const n=m=>String(m||"").trim().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"").toLowerCase(),o=Date.now(),r=a.length>1;w("info","Generating Export",r?`Rendering ${a.length} posters. Your browser may ask to allow multiple downloads…`:"Please wait while we render your poster…");let l=0,d=null;for(let m=0;m<a.length;m++){const u=a[m],y=u.style.transform;u.style.transform="none";try{await Promise.all(Array.from(u.querySelectorAll("img")).map(b=>b.complete?Promise.resolve():new Promise($=>{b.onload=$,b.onerror=$})));const p=await html2canvas(u,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:b=>{const $=u.id?b.getElementById(u.id):null;$&&ia($)}}),c=p.toDataURL("image/jpeg",.95),E=u.dataset.sectorCode||u.dataset.sectorId||`poster-${m+1}`,f=n(E)||`poster-${m+1}`,h=Number(u.dataset.posterPage||1),x=Number(u.dataset.posterPageCount||1)>1?`-p${h}`:"",g=`zamra-poster-${f}${x}-${o}`;if(t==="jpeg"){const b=document.createElement("a");b.download=`${g}.jpg`,b.href=c,b.click()}else if(t==="pdf"){const b=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!b)throw new Error("jsPDF library not loaded.");const $=96/25.4,S=p.width/2/$,M=p.height/2/$,H=new b({orientation:S>M?"landscape":"portrait",unit:"mm",format:[S,M]});H.addImage(c,"JPEG",0,0,S,M),H.save(`${g}.pdf`)}l+=1}catch(p){console.error("Poster export error:",p),d||(d=p)}finally{u.style.transform=y}}if(l){const m=r?`Downloaded ${l} ${t==="pdf"?"PDFs":"JPEGs"} successfully.`:`${t==="pdf"?"PDF":"JPEG"} poster saved successfully.`;w("success","Downloaded!",m)}d&&w("error","Export Failed",d.message||"There was an error generating the export."),s&&(s.disabled=!1),i&&(i.disabled=!1)}function Zt(t){const e=document.getElementById("report-fares-results");if(!e)return;if(!t||!t.length){e.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-inbox"></i>
        </div>
        <p class="admin-empty-state-title">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const a=Object.fromEntries(K.map(p=>[p.id,p.name])),s=Object.fromEntries(F.map(p=>[p.id,p.sectorCode])),i=Object.fromEntries(O.map(p=>[p.id,p.code])),{key:n,asc:o}=pt.reportFares,r=[...t].sort((p,c)=>{let E=p[n],f=c[n];return E instanceof Date&&(E=E.getTime()),f instanceof Date&&(f=f.getTime()),typeof E=="string"&&(E=E.toLowerCase()),typeof f=="string"&&(f=f.toLowerCase()),E<f?o?-1:1:E>f?o?1:-1:0}),l=X.reportFares,d=Math.max(1,Math.ceil(t.length/l));I.reportFares>d&&(I.reportFares=d);const m=(I.reportFares-1)*l,u=r.slice(m,m+l),y=(p,c)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${p}">${c} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;e.innerHTML=`
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
          ${u.map((p,c)=>{const E=p.flightDate instanceof Date?p.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):p.flightDate||"—";return`<tr class="${c%2===1?"bg-slate-50/60":""} hover:bg-slate-100/80 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${E}</td>
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
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,Ut("reportFares",t.length,d,m,l),window.__deleteFare=async p=>{if(confirm("Delete this fare?"))try{await Se(p),Y=Y.filter(c=>c.id!==p),w("success","Deleted","Fare removed."),Zt(Y)}catch(c){w("error","Error",c.message)}},window.__toggleFare=async(p,c)=>{try{await Je(p,{isHidden:c}),Y=Y.map(E=>E.id===p?{...E,isHidden:c}:E),w("success","Updated",`Fare ${c?"hidden":"shown"}.`),Zt(Y)}catch(E){w("error","Error",E.message)}},ee("reportFares")}async function xt(t=!0){t&&(K=await Xe(),I.agents=1);const e=document.querySelector("#agents-tab .admin-table tbody");if(!e)return;const a=document.getElementById("agents-search"),s=document.getElementById("agents-limit");a&&!a.dataset.wired&&(a.dataset.wired="1",s&&(s.dataset.wired="1"),a.addEventListener("input",m=>{ce.agents=m.target.value,I.agents=1,xt(!1)}),s&&s.addEventListener("change",m=>{X.agents=parseInt(m.target.value),I.agents=1,xt(!1)}));const i=vt(K,"agents"),n=X.agents,o=Math.max(1,Math.ceil(i.length/n));I.agents>o&&(I.agents=o);const r=(I.agents-1)*n,l=i.slice(r,r+n);e.innerHTML=l.length?l.map(m=>En(m)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',Ut("agents",i.length,o,r,n),In();const d=document.getElementById("agents-add-btn");d&&!d.dataset.wired&&(d.dataset.wired="1",d.addEventListener("click",()=>oa(null))),ee("agents")}function En(t){const e=t.isActive!==!1?'<span class="admin-status-pill admin-status-active">Active</span>':'<span class="admin-status-pill admin-status-inactive">Hidden</span>',a=t.commission!==void 0?`₹${Number(t.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${t.id}">
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
  </tr>`}function In(){const t=document.querySelector("#agents-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const s=a.dataset.action,i=a.dataset.id,n=K.find(o=>o.id===i);if(s==="edit-agent"&&oa(n),s==="delete-agent"){if(!confirm(`Delete agent "${n==null?void 0:n.name}"? This does NOT delete their fares.`))return;try{await Ta(i),w("success","Deleted",`Agent "${n==null?void 0:n.name}" removed.`),await xt()}catch(o){w("error","Error",o.message)}}if(s==="toggle-agent"){const r=!(a.dataset.active==="true");a.disabled=!0,a.textContent="Working…";try{const l=await Aa(i,r);w("success",r?"Agent Shown":"Agent Hidden",l.message),await xt()}catch(l){w("error","Toggle Failed",l.message),await xt()}}}))}function Ut(t,e,a,s,i){const n=document.getElementById(`${t}-pagination-footer`);if(!n)return;const o=Math.min(s+i,e),r=I[t];n.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${e?s+1:0} to ${o} of ${e} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${r<=1?"disabled":""}>Previous</button>
        ${function(){return a<=7?Array.from({length:a},(l,d)=>d+1):r<=4?[1,2,3,4,5,"...",a]:r>=a-3?[1,"...",a-4,a-3,a-2,a-1,a]:[1,"...",r-1,r,r+1,"...",a]}().map(l=>l==="..."?'<span class="admin-pagination-btn" style="cursor:default;opacity:0.5;background:transparent;">...</span>':`<button data-pg-action="goto" data-pg="${l}" class="admin-pagination-btn ${l===r?"admin-pagination-btn-active":""}">${l}</button>`).join("")}
        <button data-pg-action="next" class="admin-pagination-btn" ${r>=a?"disabled":""}>Next</button>
      </div>
    </div>`,n.dataset.wired||(n.dataset.wired="1",n.addEventListener("click",l=>{const d=l.target.closest("[data-pg-action]");if(!d||d.disabled)return;const m=d.dataset.pgAction;m==="prev"?I[t]=Math.max(1,I[t]-1):m==="next"?I[t]++:m==="goto"&&(I[t]=parseInt(d.dataset.pg)),t==="agents"?xt(!1):t==="sectors"?wt(!1):t==="airlines"?Mt(!1):t==="reportFares"?Zt(Y):t==="databaseFares"&&V()}))}function oa(t){var a,s;const e=!!t;ft(e?"Edit Agent":"Add New Agent",`
    <form id="agent-form" class="admin-modal-form">
      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Agent Profile</p>
            <p class="admin-form-section-desc">Details used across fares and reports.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="admin-field sm:col-span-2">
            <label class="admin-label">Agent ID *</label>
            <input name="id" required value="${(t==null?void 0:t.id)||""}" placeholder="e.g. AGENT1"
              ${e?'readonly class="admin-control cursor-not-allowed bg-slate-100 text-slate-500"':'class="admin-control"'}>
            ${e?'<p class="admin-help">Agent ID cannot be changed after creation.</p>':""}
          </div>
          <div class="admin-field">
            <label class="admin-label">Name *</label>
            <input name="name" required value="${(t==null?void 0:t.name)||""}" class="admin-control">
          </div>
          <div class="admin-field">
            <label class="admin-label">Email</label>
            <input name="email" type="email" value="${(t==null?void 0:t.email)||""}" class="admin-control">
          </div>
          <div class="admin-field">
            <label class="admin-label">Phone</label>
            <input name="contactPhone" value="${(t==null?void 0:t.contactPhone)||""}" class="admin-control">
          </div>
          <div class="admin-field sm:col-span-2">
            <label class="admin-label">Commission (₹) *</label>
            <input name="commission" type="number" min="0" required value="${(t==null?void 0:t.commission)!==void 0?t.commission:500}"
              class="admin-control" placeholder="e.g. 500">
            <p class="admin-help">This commission is auto-applied to all fares ingested for this agent.</p>
          </div>
        </div>
      </div>
      <div class="admin-modal-footer">
        <button type="button" id="modal-cancel" class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary text-sm">
          ${e?"Save Changes":"Add Agent"}
        </button>
      </div>
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("agent-form"))==null||s.addEventListener("submit",async i=>{i.preventDefault();const n=new FormData(i.target),o=Object.fromEntries(n.entries()),r=i.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{e?(await La(t.id,o),w("success","Updated",`Agent "${o.name}" updated.`)):(await ka(o),w("success","Added",`Agent "${o.name}" added.`)),document.getElementById("admin-modal").close(),await xt()}catch(l){w("error","Save Failed",l.message),r.disabled=!1,r.textContent=e?"Save Changes":"Add Agent"}})}async function wt(t=!0){t&&(F=Te(await Be()),I.sectors=1);const e=document.getElementById("sectors-search"),a=document.getElementById("sectors-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{ce.sectors=m.target.value,I.sectors=1,wt(!1)}),a.addEventListener("change",m=>{X.sectors=parseInt(m.target.value),I.sectors=1,wt(!1)}));const s=document.querySelector("#sectors-tab .admin-table tbody");if(!s)return;const i=vt(F,"sectors"),n=X.sectors,o=Math.max(1,Math.ceil(i.length/n));I.sectors>o&&(I.sectors=o);const r=(I.sectors-1)*n,l=i.slice(r,r+n);s.innerHTML=l.length?l.map(m=>Sn(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',Ut("sectors",i.length,o,r,n),Bn();const d=document.querySelector("#sectors-tab .flex.justify-between button");d&&!d.dataset.wired&&(d.dataset.wired="1",d.addEventListener("click",()=>ra(null))),ee("sectors")}function Sn(t){const e=ea(t);return`<tr data-sector-id="${t.id}">
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
  </tr>`}function Bn(){const t=document.querySelector("#sectors-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=F.find(o=>o.id===i);if(s==="edit-sector"&&ra(n),s==="delete-sector"){if(!confirm(`Delete sector "${n==null?void 0:n.sectorCode}"?`))return;try{await Da(i),w("success","Deleted",`Sector "${n==null?void 0:n.sectorCode}" removed.`),await wt()}catch(o){w("error","Error",o.message)}}if(s==="toggle-sector"){const r=!(a.dataset.hidden==="true");a.disabled=!0,a.textContent="Working…";try{const l=await Ma(i,r);w("success",`Sector Fares ${r?"Hidden":"Shown"}`,l.message),await wt()}catch(l){w("error","Toggle Failed",l.message),await wt()}}}))}function ra(t){var a,s;const e=!!t;ft(e?"Edit Sector":"Add New Sector",`
    <form id="sector-form" class="admin-modal-form">
      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Sector Details</p>
            <p class="admin-form-section-desc">Define the route and sector code.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="admin-field">
            <label class="admin-label">From City *</label>
            <input name="sectorFrom" required placeholder="e.g. Kozhikode" value="${(t==null?void 0:t.sectorFrom)||""}"
              class="admin-control">
          </div>
          <div class="admin-field">
            <label class="admin-label">To City *</label>
            <input name="sectorTo" required placeholder="e.g. Jeddah" value="${(t==null?void 0:t.sectorTo)||""}"
              class="admin-control">
          </div>
          <div class="admin-field">
            <label class="admin-label">Sector Code *</label>
            <input name="sectorCode" required placeholder="e.g. CCJ JED" value="${(t==null?void 0:t.sectorCode)||""}"
              class="admin-control font-mono tracking-wide">
          </div>
        </div>
      </div>
      <div class="admin-modal-footer">
        <button type="button" id="modal-cancel" class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary text-sm">
          ${e?"Save Changes":"Add Sector"}
        </button>
      </div>
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("sector-form"))==null||s.addEventListener("submit",async i=>{i.preventDefault();const n=new FormData(i.target),o=Object.fromEntries(n.entries());o.sectorCode=Nt(o.sectorCode.toUpperCase()),o.sectorFrom=Nt(o.sectorFrom.toUpperCase()),o.sectorTo=Nt(o.sectorTo.toUpperCase());const r=i.target.querySelector("[type=submit]");r.disabled=!0,r.textContent="Saving…";try{e?(await Fa(t.id,o),w("success","Updated","Sector updated.")):(await Ra(o),w("success","Added",`Sector "${o.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await wt()}catch(l){w("error","Save Failed",l.message),r.disabled=!1,r.textContent=e?"Save Changes":"Add Sector"}})}async function Mt(t=!0){t&&(O=await Ce(),I.airlines=1);const e=document.getElementById("airlines-search"),a=document.getElementById("airlines-limit");e&&!e.dataset.wired&&(e.dataset.wired="1",a.dataset.wired="1",e.addEventListener("input",m=>{ce.airlines=m.target.value,I.airlines=1,Mt(!1)}),a.addEventListener("change",m=>{X.airlines=parseInt(m.target.value),I.airlines=1,Mt(!1)}));const s=document.querySelector("#flights-tab .admin-table tbody");if(!s)return;const i=vt(O,"airlines"),n=X.airlines,o=Math.max(1,Math.ceil(i.length/n));I.airlines>o&&(I.airlines=o);const r=(I.airlines-1)*n,l=i.slice(r,r+n);s.innerHTML=l.length?l.map(m=>Cn(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "Add Airline".</td></tr>',Ut("airlines",i.length,o,r,n),Tn();const d=document.querySelector("#flights-tab .flex.justify-between button");d&&!d.dataset.wired&&(d.dataset.wired="1",d.addEventListener("click",()=>da(null))),ee("airlines")}function Cn(t){const e=t.logoUrl?`<span class="admin-logo-wrap"><img src="${t.logoUrl}" alt="${B(t.name||"Airline")}"></span>`:`<span class="admin-logo-wrap"><span class="admin-logo-fallback">${B((t.code||"NA").slice(0,3))}</span></span>`;return`<tr data-airline-id="${t.id}">
    <td>${e}</td>
    <td class="font-semibold">${t.name}</td>
    <td><span class="font-mono font-bold text-primary">${t.code}</span></td>
    <td>
      <div class="flex gap-1 items-center">
        <button data-action="edit-airline" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-airline" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function Tn(){const t=document.querySelector("#flights-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=O.find(o=>o.id===i);if(s==="edit-airline"&&da(n),s==="delete-airline"){if(!confirm(`Delete airline "${n==null?void 0:n.name}" (${n==null?void 0:n.code})?`))return;try{await ja(i),w("success","Deleted",`Airline "${n==null?void 0:n.name}" removed.`),await Mt()}catch(o){w("error","Error",o.message)}}}))}function da(t){var a,s;const e=!!t;ft(e?"Edit Airline":"Add New Airline",`
    <form id="airline-form" class="admin-modal-form">
      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Airline Details</p>
            <p class="admin-form-section-desc">Name, IATA code, and logo.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="admin-field">
            <label class="admin-label">Airline Name *</label>
            <input name="name" required placeholder="e.g. Air India Express" value="${(t==null?void 0:t.name)||""}"
              class="admin-control">
          </div>
          <div class="admin-field">
            <label class="admin-label">IATA Code *</label>
            <input name="code" required maxlength="3" placeholder="e.g. IX" value="${(t==null?void 0:t.code)||""}"
              class="admin-control font-mono tracking-widest uppercase">
          </div>
          <div class="admin-field">
            <label class="admin-label">Logo (optional)</label>
            <div class="admin-file">
              <input type="file" name="logoFile" accept="image/*">
              ${t!=null&&t.logoUrl?`<img src="${t.logoUrl}" class="mt-3 h-9 object-contain rounded" alt="current logo">`:""}
            </div>
          </div>
        </div>
      </div>
      <div class="admin-modal-footer">
        <button type="button" id="modal-cancel" class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary text-sm">
          ${e?"Save Changes":"Add Airline"}
        </button>
      </div>
    </form>`),(a=document.getElementById("modal-cancel"))==null||a.addEventListener("click",()=>document.getElementById("admin-modal").close()),(s=document.getElementById("airline-form"))==null||s.addEventListener("submit",async i=>{var d;i.preventDefault();const n=new FormData(i.target),o=((d=n.get("logoFile"))==null?void 0:d.size)>0?n.get("logoFile"):null,r={name:n.get("name"),code:n.get("code").toUpperCase()},l=i.target.querySelector("[type=submit]");l.disabled=!0,l.textContent="Saving…";try{e?(await Ha(t.id,r,o),w("success","Updated","Airline updated.")):(await Na(r,o),w("success","Added",`Airline "${r.name}" added.`)),document.getElementById("admin-modal").close(),await Mt()}catch(m){w("error","Save Failed",m.message),l.disabled=!1,l.textContent=e?"Save Changes":"Add Airline"}})}async function An(){const t=document.getElementById("reports-tab");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=document.getElementById("reports-sector-sel");e&&e.options.length<=1&&F.forEach(o=>e.appendChild(new Option(o.sectorCode,o.id)));const a=document.getElementById("reports-agent-sel");a&&a.options.length<=1&&K.forEach(o=>a.appendChild(new Option(o.name,o.id)));const s=document.getElementById("generate-report-btn"),i=document.getElementById("reports-start-date"),n=document.getElementById("reports-end-date");s&&!s.dataset.wired&&(s.dataset.wired="1",s.addEventListener("click",async()=>{const o=(e==null?void 0:e.value)||"all",r=(a==null?void 0:a.value)||"all",l=(i==null?void 0:i.value)||null,d=(n==null?void 0:n.value)||null;s.disabled=!0,s.textContent="Generating…";try{const[m,u]=await Promise.all([Pa(l,d,o,r),le({sectorId:o,agentId:r,startDate:l,endDate:d,includeHidden:!0})]);Y=u,Ln(m,t),I.reportFares=1,Zt(Y)}catch(m){w("error","Report Failed",m.message)}finally{s.disabled=!1,s.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function Ln(t,e){const{agentReport:a,sectorReport:s,totalFares:i}=t,n=document.getElementById("report-stats-row");if(n){n.classList.remove("hidden");const y=(Y||[]).filter(x=>!x.isHidden).length,p=(Y||[]).filter(x=>x.isHidden).length,c=new Set((Y||[]).map(x=>x.agentId)).size,E=(Y||[]).map(x=>x.finalRate||0).filter(x=>x>0),f=E.length?Math.round(E.reduce((x,g)=>x+g,0)/E.length):0,h=(x,g)=>{const b=document.getElementById(x);b&&(b.textContent=g.toLocaleString())};h("stat-total-fares",i),h("stat-live-fares",y),h("stat-hidden-fares",p),h("stat-agents-count",c);const C=document.getElementById("stat-avg-fare");C&&(C.textContent=f>0?`₹${f.toLocaleString()}`:"—")}const o=document.getElementById("report-total-fares");o&&(o.textContent=`${i} fare${i!==1?"s":""} matched your filter`);const r=document.getElementById("bar-chart-container");r&&a.length&&kn(a.slice(0,8),r);const l=document.getElementById("donut-chart-svg"),d=document.getElementById("pie-legend");l&&s.length&&Dn(s.slice(0,8),l,d);const m=document.getElementById("report-leaderboards");m&&(m.classList.remove("hidden"),Mn(a,s));const u=document.getElementById("download-report-csv");if(u){const y=u.cloneNode(!0);u.parentNode.replaceChild(y,u),y.addEventListener("click",()=>Fn(Y)),Y&&Y.length?y.classList.remove("opacity-50","pointer-events-none"):y.classList.add("opacity-50","pointer-events-none")}w("success","Report Ready",`${i} fare${i!==1?"s":""} aggregated.`)}function kn(t,e){const a=e.clientWidth||480,s=260,i={top:32,right:16,bottom:48,left:48},n=a-i.left-i.right,o=s-i.top-i.bottom,r=Math.max(...t.map(x=>x.count),1),l=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],d=4,m=Math.ceil(r/d),u=Array.from({length:d+1},(x,g)=>g*m),y=u.map(x=>{const g=i.top+o-x/(u[u.length-1]||1)*o;return`<line x1="${i.left}" y1="${g.toFixed(1)}" x2="${a-i.right}" y2="${g.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${i.left-6}" y="${(g+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${x}</text>`}).join(""),p=Math.min(48,n/t.length*.6),c=n/t.length,E=t.map((x,g)=>{const b=Math.max(4,x.count/(u[u.length-1]||1)*o),$=i.left+g*c+c/2-p/2,S=i.top+o-b,[M,H]=l[g%l.length],D=`bg${g}`,j=x.avgRate?`avg ₹${Math.round(x.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${D}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${M}"/>
              <stop offset="100%" stop-color="${H}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${x.name}" data-count="${x.count}" data-avg="${j}" style="cursor:pointer;">
              <rect x="${$.toFixed(1)}" y="${S.toFixed(1)}" width="${p}" height="${b.toFixed(1)}"
                rx="6" fill="url(#${D})" opacity="0.92"
                style="transform-origin:${($+p/2).toFixed(1)}px ${(i.top+o).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${g*.07}s both;"/>
              <text x="${($+p/2).toFixed(1)}" y="${(S-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${H}">${x.count}</text>
              <text x="${($+p/2).toFixed(1)}" y="${(i.top+o+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(x.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),f="bar-tooltip";e.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${f}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${s}" viewBox="0 0 ${a} ${s}" style="overflow:visible;">
      ${y}
      <line x1="${i.left}" y1="${i.top}" x2="${i.left}" y2="${i.top+o}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${i.left}" y1="${i.top+o}" x2="${a-i.right}" y2="${i.top+o}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${E}
    </svg>`;const h=e.querySelector("#bar-svg"),C=e.querySelector(`#${f}`);h&&C&&h.querySelectorAll(".bar-group").forEach(x=>{x.addEventListener("mousemove",g=>{const b=e.getBoundingClientRect();C.style.display="block",C.style.left=g.clientX-b.left+12+"px",C.style.top=g.clientY-b.top-40+"px";const $=x.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${x.dataset.avg}</span>`:"";C.innerHTML=`${x.dataset.name}<br><span style="color:#60a5fa;">${x.dataset.count} fares</span>${$}`}),x.addEventListener("mouseleave",()=>{C.style.display="none"})})}function Dn(t,e,a){const s=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],l=t.reduce((x,g)=>x+g.count,0),d=e.getElementById?e.getElementById("donut-segments"):e.querySelector("#donut-segments"),m=e.querySelector("#donut-center-count"),u=e.querySelector("#donut-center-label");if(!d)return;m&&(m.textContent=l),u&&(u.textContent="FARES");const y=(x,g,b,$)=>({x:x+b*Math.cos(($-90)*Math.PI/180),y:g+b*Math.sin(($-90)*Math.PI/180)});let p=0;const c=t.map((x,g)=>{const b=l>0?x.count/l*360:0,$=p+b,S=b>180?1:0,M=y(110,110,95,p),H=y(110,110,95,$),D=y(110,110,60,p),j=y(110,110,60,$),z=[`M ${M.x.toFixed(2)} ${M.y.toFixed(2)}`,`A 95 95 0 ${S} 1 ${H.x.toFixed(2)} ${H.y.toFixed(2)}`,`L ${j.x.toFixed(2)} ${j.y.toFixed(2)}`,`A 60 60 0 ${S} 0 ${D.x.toFixed(2)} ${D.y.toFixed(2)}`,"Z"].join(" "),et=p+b/2;p=$;const ot=l>0?(x.count/l*100).toFixed(1):"0.0";return{pathD:z,color:s[g%s.length],name:x.name,count:x.count,pct:ot,mid:et}}),E="http://www.w3.org/2000/svg";d.innerHTML="";const f=c.map((x,g)=>{const b=document.createElementNS(E,"path");return b.setAttribute("d",x.pathD),b.setAttribute("fill",x.color),b.setAttribute("stroke","white"),b.setAttribute("stroke-width","2"),b.style.cursor="pointer",b.style.transition="transform 0.2s, filter 0.2s",b.style.transformOrigin="110px 110px",b.setAttribute("data-index",g),d.appendChild(b),b}),h=x=>{f.forEach((g,b)=>{b===x?(g.style.transform="scale(1.04)",g.style.filter="brightness(1.1)",g.setAttribute("stroke-width","3")):(g.style.transform="scale(1)",g.style.filter="brightness(1)",g.setAttribute("stroke-width","2"))}),x>=0&&x<c.length?(m&&(m.textContent=c[x].count),u&&(u.textContent=c[x].name.split(" ")[0].toUpperCase().slice(0,7))):(m&&(m.textContent=l),u&&(u.textContent="FARES"))};if(f.forEach((x,g)=>{x.addEventListener("mouseover",()=>{h(g),C(g)}),x.addEventListener("mouseout",()=>{h(-1),C(-1)})}),a){a.innerHTML=c.map((g,b)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${b}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${g.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${g.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${g.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${g.pct}%</span>
      </div>`).join("");const x=g=>{a.querySelectorAll(".legend-row").forEach((b,$)=>{b.style.background=$===g?"#f1f5f9":""})};window._highlightLegendRows=x,a.querySelectorAll(".legend-row").forEach((g,b)=>{g.addEventListener("mouseover",()=>{h(b),x(b)}),g.addEventListener("mouseout",()=>{h(-1),x(-1)})})}function C(x){window._highlightLegendRows&&window._highlightLegendRows(x)}}function Mn(t,e){var n,o;const a=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],s=document.getElementById("leaderboard-agents");if(s&&t.length){const r=[...t].sort((d,m)=>m.count-d.count).slice(0,5),l=r[0].count||1;s.innerHTML=r.map((d,m)=>{const u=Math.max(6,Math.round(d.count/l*100));return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="width:28px;text-align:center;flex-shrink:0;">${m===0?'<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:#fff7ed;color:#b45309;border:1px solid #fed7aa;"><i class="bi bi-trophy-fill" style="font-size:12px;"></i></span>':`<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:#f8fafc;color:#64748b;border:1px solid #e2e8f0;font-size:11px;font-weight:800;">#${m+1}</span>`}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${d.name}</span>
            <span style="color:${a[m]};margin-left:8px;">${d.count} fares</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${u}%;height:100%;background:${a[m]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}const i=document.getElementById("leaderboard-sectors");if(i&&e.length){const l=[...e.filter(u=>u.avgRate>0)].sort((u,y)=>u.avgRate-y.avgRate).slice(0,5),d=((n=l[0])==null?void 0:n.avgRate)||1,m=((o=l[l.length-1])==null?void 0:o.avgRate)||1;i.innerHTML=l.map((u,y)=>{const p=m>d?Math.max(6,Math.round((u.avgRate-d)/(m-d)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${y+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${u.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(u.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${p}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function Fn(t){if(!t||!t.length){w("warning","No Data","No fares to export. Apply filters and fetch first.");return}const e=Object.fromEntries(K.map(u=>[u.id,u.name])),a=Object.fromEntries(F.map(u=>[u.id,u.sectorCode])),s=Object.fromEntries(O.map(u=>[u.id,u.code||u.name])),i=u=>`"${String(u??"").replace(/"/g,'""')}"`,n=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],o=t.map(u=>{const y=u.flightDate instanceof Date?u.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):u.flightDate||"";return[i(y),i(u.flightTime||""),i(a[u.sectorId]||u.sectorId),i(s[u.airlineId]||u.airlineId),i(e[u.agentId]||u.agentId),i(u.specialRate||0),i(u.finalRate||0),i(u.commission||0),i(u.baggage||""),i(u.extraBaggage||""),i(u.isHidden?"Hidden":"Live")].join(",")}),r=[n.map(i).join(","),...o].join(`
`),l=new Blob(["\uFEFF"+r],{type:"text/csv;charset=utf-8;"}),d=URL.createObjectURL(l),m=document.createElement("a");m.href=d,m.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(m),m.click(),document.body.removeChild(m),URL.revokeObjectURL(d),w("success","CSV Downloaded",`${t.length} fares exported.`)}function la(){return Object.keys(tt).length}function ca(){return{agentNameById:Object.fromEntries(K.map(t=>[t.id,t.name||t.id])),sectorCodeById:Object.fromEntries(F.map(t=>[t.id,t.sectorCode||`${t.sectorFrom||""} ${t.sectorTo||""}`.trim()||t.id])),airlineLabelById:Object.fromEntries(O.map(t=>[t.id,t.code?`${t.code} - ${t.name||""}`.trim():t.name||t.id])),airlineCodeById:Object.fromEntries(O.map(t=>[t.id,t.code||t.name||t.id]))}}function ma(t,e=0){if(!t)return e;const a=K.find(i=>i.id===t),s=Number(a==null?void 0:a.commission);return Number.isFinite(s)?Math.max(0,s):e}function Rn(t,e){return t==="specialRate"||t==="finalRate"||t==="commission"||t==="extraBaggage"?e===""?"":N(e,0):t==="baggage"?e===""?"":It(e):t==="isHidden"?e===!0||e==="hidden"||e==="true":t==="flightTime"?String(e||"").trim():t==="flightDate"?e||"":String(e||"")}function jn(t,e){return t==="specialRate"||t==="finalRate"||t==="extraBaggage"?N(e,0):t==="commission"?e==null||e===""?"":Math.max(0,N(e,0)):t==="baggage"?It(e):t==="isHidden"?e===!0:t==="flightTime"?String(e||"").trim():t==="flightDate"?Kt(e):String(e||"")}function Ee(t){return t?t.commission!==void 0&&t.commission!==null&&t.commission!==""?Math.max(0,N(t.commission,0)):Math.max(0,N(t.finalRate,0)-N(t.specialRate,0)):0}function Qt(t,e){return Math.max(0,N(t,0)+Math.max(0,N(e,0)))}function Ae(t){const e=tt[t.id]||{},a={...t,...e},s=Ee(t);return a.flightDate=e.flightDate!==void 0?na(e.flightDate):Xt(t.flightDate),a.specialRate=N(a.specialRate,0),a.commission=e.commission!==void 0?Math.max(0,N(e.commission,0)):s,a.finalRate=Qt(a.specialRate,a.commission),a.baggage=It(a.baggage),a.extraBaggage=N(a.extraBaggage,0),a.isHidden=a.isHidden===!0||a.isHidden==="hidden"||a.isHidden==="true",a.flightTime=String(a.flightTime||"").trim(),a.agentId=a.agentId||"",a.sectorId=a.sectorId||"",a.airlineId=a.airlineId||"",a}function Gt(){const t=la(),e=mt.size,a=document.getElementById("database-unsaved-pill");a&&(a.textContent=`Unsaved: ${t}`);const s=document.getElementById("database-save-all-btn");s&&(s.disabled=t===0);const i=document.getElementById("database-delete-selected-btn");i&&(i.disabled=e===0);const n=document.getElementById("database-selected-count");n&&(n.textContent=String(e))}function Hn(){const t=document.getElementById("database-agent-filter"),e=document.getElementById("database-sector-filter"),a=document.getElementById("database-airline-filter");if(t){const s=R.agentId;t.innerHTML='<option value="all">All Agents</option>'+K.map(i=>`<option value="${B(i.id)}">${B(i.id)} · ${B(i.name||"Unnamed")}</option>`).join(""),t.value=s}if(e){const s=R.sectorId;e.innerHTML='<option value="all">All Sectors</option>'+F.map(i=>`<option value="${B(i.id)}">${B(i.sectorCode||i.id)}</option>`).join(""),e.value=s}if(a){const s=R.airlineId;a.innerHTML='<option value="all">All Airlines</option>'+O.map(i=>`<option value="${B(i.id)}">${B(i.code||"—")} · ${B(i.name||"Unnamed")}</option>`).join(""),a.value=s}}function Nn(){const t=document.getElementById("database-table-wrap");if(!t||t.dataset.wired)return;t.dataset.wired="1";const e=i=>{const n=t.querySelector(`tr[data-fare-id="${i}"]`);if(!n)return;const o=!!tt[i];n.classList.toggle("admin-database-row-dirty",o);const r=n.querySelector('[data-db-action="save"]'),l=n.querySelector('[data-db-action="reset"]');r&&(r.disabled=!o),l&&(l.disabled=!o)},a=i=>{if(!i)return;const n=i.querySelector('[data-db-field="specialRate"]'),o=i.querySelector('[data-db-field="commission"]'),r=i.querySelector('[data-db-field="finalRate"]');if(!n||!o||!r)return;const l=N(n.value,0),d=Math.max(0,N(o.value,0));r.value=String(Qt(l,d))},s=i=>{const n=i.target.closest("[data-db-field]");if(!n)return;const o=n.closest("tr[data-fare-id]");if(!o)return;const r=o.dataset.fareId,l=n.dataset.dbField,d=it.find(E=>E.id===r);if(!d||!l)return;const m=n.value,u=Rn(l,m),y=l==="commission"?Ee(d):jn(l,d[l]),p=u!==y,c={...tt[r]||{}};if(p?c[l]=u:delete c[l],l==="agentId"){const E=o.querySelector('[data-db-field="commission"]'),f=ma(u,0);E&&(E.value=String(f));const h=Ee(d);f!==h?c.commission=f:delete c.commission,a(o)}Object.keys(c).length?tt[r]=c:delete tt[r],(l==="specialRate"||l==="commission")&&a(o),e(r),Gt()};t.addEventListener("input",s),t.addEventListener("change",i=>{s(i);const n=i.target.closest("#database-select-all");if(n){t.querySelectorAll("input[data-db-select]").forEach(r=>{r.checked=n.checked;const l=r.dataset.dbSelect;l&&(n.checked?mt.add(l):mt.delete(l))}),Gt();return}const o=i.target.closest("input[data-db-select]");if(o){const r=o.dataset.dbSelect;if(!r)return;o.checked?mt.add(r):mt.delete(r),Gt()}}),t.addEventListener("click",async i=>{const n=i.target.closest("[data-db-action]");if(!n)return;const o=n.dataset.dbAction,r=n.dataset.id;if(r){if(o==="edit"){yt.add(r),V();return}if(o==="cancel_edit"){yt.delete(r),V();return}if(o==="save"){n.disabled=!0,await ua(r)?yt.delete(r):n.disabled=!1,V();return}if(o==="share"){const l=it.find(b=>b.id===r)||tt[r]||{},d=Ae(l)||l,m=F.find(b=>b.id===d.sectorId)||{},y=(O.find(b=>b.id===d.airlineId)||{}).name||d.airlineId||"Unknown Airline",p=m.sectorFrom||"TBA",c=m.sectorTo||"TBA",E={day:"2-digit",month:"short",year:"numeric"};let f="TBA";if(d.flightDate){const b=d.flightDate instanceof Date?d.flightDate:new Date(d.flightDate);isNaN(b)||(f=b.toLocaleDateString("en-GB",E).replace(/,/g,""))}const h=d.flightTime&&d.flightTime.split("-")[0]?d.flightTime.split("-")[0].trim():"TBA",C=d.flightTime&&d.flightTime.includes("-")?d.flightTime.split("-")[1].trim():"TBA",x="₹"+(Number(d.finalRate)||0).toLocaleString("en-IN"),g=`Hello Zamra Travels, I'm interested in booking this flight:

✈️ *${y.toUpperCase()}*
🛫 From: *${p}*
🛬 To: *${c}*
📅 Date: *${f}*
⏰ Dep: ${h} | Arr: ${C}
💵 Price: *${x}*

Please confirm availability!`;try{await navigator.clipboard.writeText(g),w("success","Copied!","Flight details copied to clipboard.")}catch(b){w("error","Copy failed",b.message)}return}if(o==="reset"){delete tt[r],yt.delete(r),V();return}if(o==="delete"){if(!confirm("Delete this fare row? This cannot be undone."))return;n.disabled=!0;try{await Se(r),it=it.filter(l=>l.id!==r),delete tt[r],mt.delete(r),yt.delete(r),w("success","Deleted","Fare row removed."),V()}catch(l){w("error","Delete Failed",l.message),n.disabled=!1}}}})}function Pn(t){if(!t||t.dataset.controlsWired)return;t.dataset.controlsWired="1";const e=document.getElementById("database-search"),a=document.getElementById("database-agent-filter"),s=document.getElementById("database-sector-filter"),i=document.getElementById("database-airline-filter"),n=document.getElementById("database-status-filter"),o=document.getElementById("database-start-date"),r=document.getElementById("database-end-date"),l=document.getElementById("database-limit"),d=document.getElementById("database-clear-filters"),m=document.getElementById("database-refresh-btn"),u=document.getElementById("database-save-all-btn"),y=document.getElementById("database-delete-selected-btn"),p=document.getElementById("database-add-row-btn");e&&e.addEventListener("input",c=>{R.search=c.target.value||"",I.databaseFares=1,V()}),a&&a.addEventListener("change",c=>{R.agentId=c.target.value||"all",I.databaseFares=1,V()}),s&&s.addEventListener("change",c=>{R.sectorId=c.target.value||"all",I.databaseFares=1,V()}),i&&i.addEventListener("change",c=>{R.airlineId=c.target.value||"all",I.databaseFares=1,V()}),n&&n.addEventListener("change",c=>{R.status=c.target.value||"all",I.databaseFares=1,V()}),o&&o.addEventListener("change",c=>{R.startDate=c.target.value||"",I.databaseFares=1,V()}),r&&r.addEventListener("change",c=>{R.endDate=c.target.value||"",I.databaseFares=1,V()}),l&&(l.value=String(X.databaseFares),l.addEventListener("change",c=>{X.databaseFares=parseInt(c.target.value,10)||20,I.databaseFares=1,V()})),d&&d.addEventListener("click",()=>{R.search="",R.agentId="all",R.sectorId="all",R.airlineId="all",R.status="all",R.startDate="",R.endDate="",e&&(e.value=""),a&&(a.value="all"),s&&(s.value="all"),i&&(i.value="all"),n&&(n.value="all"),o&&(o.value=""),r&&(r.value=""),I.databaseFares=1,V()}),m&&m.addEventListener("click",async()=>{const c=m.innerHTML;m.disabled=!0,m.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing...',await Le(!0),m.disabled=!1,m.innerHTML=c}),u&&u.addEventListener("click",qn),y&&y.addEventListener("click",On),p&&p.addEventListener("click",_n)}async function Le(t=!0){const e=document.getElementById("database-tab");if(!e)return;if(Pn(e),Nn(),Hn(),t||!e.dataset.loaded)try{it=await le({includeHidden:!0}),tt={},mt=new Set,yt=new Set,I.databaseFares=1,e.dataset.loaded="1"}catch(s){w("error","Load Failed",s.message),it=[]}V()}function Un(){const{agentNameById:t,sectorCodeById:e,airlineLabelById:a}=ca(),s=R.search.trim().toLowerCase(),i=gn(R.startDate),n=pn(R.endDate),o=it.map(d=>Ae(d)).filter(d=>{var y,p;if(R.agentId!=="all"&&d.agentId!==R.agentId||R.sectorId!=="all"&&d.sectorId!==R.sectorId||R.airlineId!=="all"&&d.airlineId!==R.airlineId||R.status==="live"&&d.isHidden||R.status==="hidden"&&!d.isHidden)return!1;const m=((p=(y=Xt(d.flightDate))==null?void 0:y.getTime)==null?void 0:p.call(y))||null;return i!==null&&(m===null||m<i)||n!==null&&(m===null||m>n)?!1:s?[d.id,Kt(d.flightDate),d.flightTime,d.specialRate,d.finalRate,d.commission,d.baggage,d.extraBaggage,d.isHidden?"hidden":"live",d.agentId,d.sectorId,d.airlineId,t[d.agentId]||"",e[d.sectorId]||"",a[d.airlineId]||""].join(" ").toLowerCase().includes(s):!0}),{key:r,asc:l}=pt.databaseFares;return o.sort((d,m)=>{const u=c=>{var E,f;return r==="agentId"?(t[c.agentId]||c.agentId||"").toLowerCase():r==="sectorId"?(e[c.sectorId]||c.sectorId||"").toLowerCase():r==="airlineId"?(a[c.airlineId]||c.airlineId||"").toLowerCase():r==="flightDate"?((f=(E=Xt(c.flightDate))==null?void 0:E.getTime)==null?void 0:f.call(E))||0:r==="isHidden"?c.isHidden?1:0:c[r]};let y=u(d),p=u(m);return typeof y=="string"&&(y=y.toLowerCase()),typeof p=="string"&&(p=p.toLowerCase()),y<p?l?-1:1:y>p?l?1:-1:0})}function V(){const t=document.getElementById("database-table-wrap");if(!t)return;const e=Un(),{agentNameById:a,sectorCodeById:s,airlineLabelById:i,airlineCodeById:n}=ca(),o=document.getElementById("database-total-count");o&&(o.textContent=e.length.toLocaleString());const r=X.databaseFares,l=Math.max(1,Math.ceil(e.length/r));I.databaseFares>l&&(I.databaseFares=l);const d=(I.databaseFares-1)*r,m=e.slice(d,d+r);if(!m.length){t.innerHTML=`<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-database"></i>
        </div>
        <p class="admin-empty-state-title">No fares matched your filter</p>
      </div>
    </div>`,Ut("databaseFares",e.length,l,d,r),Gt();return}const u=(f,h)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="databaseFares" data-sort-key="${f}">
      ${h} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i>
    </th>`,y=f=>K.map(h=>`<option value="${B(h.id)}" ${h.id===f?"selected":""}>${B(h.id)} · ${B(h.name||"Unnamed")}</option>`).join(""),p=f=>F.map(h=>`<option value="${B(h.id)}" ${h.id===f?"selected":""}>${B(h.sectorCode||h.id)}</option>`).join(""),c=f=>O.map(h=>`<option value="${B(h.id)}" ${h.id===f?"selected":""}>${B(h.code||"—")} · ${B(h.name||"Unnamed")}</option>`).join(""),E=m.length>0&&m.every(f=>mt.has(f.id));t.innerHTML=`
    <table class="admin-database-table">
      <thead>
        <tr>
          <th class="w-[36px] text-center"><input id="database-select-all" type="checkbox" ${E?"checked":""}></th>
          <th class="w-[56px]">#</th>
          ${u("agentId","Agent")}
          ${u("sectorId","Sector Code")}
          ${u("flightDate","Date")}
          ${u("flightTime","Time")}
          ${u("airlineId","Flight")}
          ${u("baggage","Baggage")}
          ${u("extraBaggage","Extra")}
          ${u("specialRate","SP Rate")}
          ${u("commission","Commission")}
          ${u("finalRate","Rate")}
          ${u("isHidden","Status")}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${m.map((f,h)=>{const C=!!tt[f.id],x=mt.has(f.id),g=yt.has(f.id)||C,b=a[f.agentId]||f.agentId,$=s[f.sectorId]||f.sectorId;i[f.airlineId]||f.airlineId;const S=n[f.airlineId]||f.airlineId,M=f.flightDate instanceof Date?f.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):f.flightDate?Kt(f.flightDate):"—",H=h%2===1?"bg-slate-50/60":"";return`
            <tr data-fare-id="${f.id}" class="${C?"admin-database-row-dirty":H} hover:bg-slate-100/80 transition-colors">
              <td class="text-center">
                <input type="checkbox" data-db-select="${f.id}" ${x?"checked":""}>
              </td>
              <td class="font-mono text-[11px] text-text-soft">${d+h+1}</td>
              <td class="whitespace-nowrap ${g?"":"text-[12px]"}">
                ${g?`
                <select data-db-field="agentId" class="db-cell-select min-w-[150px]">
                  <option value="">Select Agent</option>
                  ${y(f.agentId)}
                </select>
                `:`<span class="text-text-muted">${B(b)}</span>`}
              </td>
              <td class="whitespace-nowrap ${g?"":"text-[12px]"}">
                ${g?`
                <select data-db-field="sectorId" class="db-cell-select min-w-[120px]">
                  <option value="">Select Sector</option>
                  ${p(f.sectorId)}
                </select>
                `:`<span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${B($)}</span>`}
              </td>
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">
                ${g?`
                <input type="date" data-db-field="flightDate" class="db-cell-input" value="${Kt(f.flightDate)}">
                `:B(M)}
              </td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">
                ${g?`
                <input type="text" data-db-field="flightTime" class="db-cell-input min-w-[110px]" value="${B(f.flightTime||"")}" placeholder="04:05 - 11:10">
                `:B(f.flightTime||"—")}
              </td>
              <td class="whitespace-nowrap ${g?"":"font-semibold text-[13px]"}">
                ${g?`
                <select data-db-field="airlineId" class="db-cell-select min-w-[150px]">
                  <option value="">No Airline</option>
                  ${c(f.airlineId)}
                </select>
                `:B(S)}
              </td>
              <td class="whitespace-nowrap text-[12px]">
                ${g?`
                <select data-db-field="baggage" class="db-cell-select min-w-[90px]">
                  ${Pt(re,It(f.baggage))}
                </select>
                `:f.baggage?f.baggage+" kg":"—"}
              </td>
              <td class="whitespace-nowrap text-[12px]">
                ${g?`
                <select data-db-field="extraBaggage" class="db-cell-select min-w-[90px]">
                  ${Pt(aa,N(f.extraBaggage,0))}
                </select>
                `:f.extraBaggage?f.extraBaggage+" kg":"—"}
              </td>
              <td class="whitespace-nowrap">
                ${g?`
                <input type="number" data-db-field="specialRate" class="db-cell-input db-cell-num" value="${N(f.specialRate,0)}" min="0" step="1">
                `:`<span class="text-[13px] text-text-muted">₹${(f.specialRate||0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${g?`
                <input type="number" data-db-field="commission" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${N(f.commission,0)}" min="0" step="1" readonly tabindex="-1">
                `:`<span class="text-[12px] text-text-muted" id="comm-${f.id}">₹${(f.commission||0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${g?`
                <input type="number" data-db-field="finalRate" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${N(f.finalRate,0)}" min="0" step="1" readonly tabindex="-1">
                `:`<span class="font-black text-navy text-[14px]">₹${(f.finalRate||0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${g?`
                <select data-db-field="isHidden" class="db-cell-select min-w-[94px]">
                  <option value="live" ${f.isHidden?"":"selected"}>Live</option>
                  <option value="hidden" ${f.isHidden?"selected":""}>Hidden</option>
                </select>
                `:`
                <span class="admin-status-pill ${f.isHidden?"admin-status-hidden":"admin-status-live"}">
                  ${f.isHidden?"● Hidden":"● Live"}
                </span>
                `}
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  ${g?`
                  <button data-db-action="save" data-id="${f.id}" class="admin-action-btn admin-action-edit" ${C?"":"disabled"}><i class="bi bi-check2-circle"></i>Save</button>
                  <button data-db-action="${C?"reset":"cancel_edit"}" data-id="${f.id}" class="admin-action-btn admin-action-toggle"><i class="bi ${C?"bi-arrow-counterclockwise":"bi-x"}"></i>${C?"Reset":"Cancel"}</button>
                  `:`
                  <button data-db-action="edit" data-id="${f.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil"></i>Edit</button>
                  `}
                  <button data-db-action="share" data-id="${f.id}" class="admin-action-btn admin-action-show"><i class="bi bi-box-arrow-up"></i>Share</button>
                  <button data-db-action="delete" data-id="${f.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Del</button>
                </div>
              </td>
            </tr>
          `}).join("")}
      </tbody>
    </table>
  `,Ut("databaseFares",e.length,l,d,r),ee("databaseFares"),Gt()}async function ua(t,{silent:e=!1}={}){const a=it.find(m=>m.id===t);if(!a)return!1;if(!tt[t])return!0;const i=Ae(a),n=Xt(i.flightDate);if(!i.agentId)return e||w("warning","Missing Agent","Please select an agent before saving."),!1;if(!i.sectorId)return e||w("warning","Missing Sector","Please select a sector before saving."),!1;if(!n)return e||w("warning","Missing Date","Please set a valid flight date before saving."),!1;const o=N(i.specialRate,0),r=Math.max(0,N(i.commission,0)),l=Qt(o,r),d={agentId:i.agentId,sectorId:i.sectorId,airlineId:i.airlineId||"",flightDate:n,flightTime:i.flightTime||"",specialRate:o,finalRate:l,commission:r,baggage:It(i.baggage),extraBaggage:N(i.extraBaggage,0),isHidden:i.isHidden===!0};try{return await Je(t,d),it=it.map(m=>m.id===t?{...m,...d}:m),delete tt[t],yt.delete(t),e||w("success","Saved","Fare row updated."),!0}catch(m){return e||w("error","Save Failed",m.message),!1}}async function qn(){const t=Object.keys(tt);if(!t.length)return;const e=document.getElementById("database-save-all-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Saving...');let s=0,i=0;for(const n of t)await ua(n,{silent:!0})?s+=1:i+=1;V(),e&&(e.disabled=la()===0,e.innerHTML=a||"Save All"),i===0?w("success","Saved",`${s} row${s!==1?"s":""} updated.`):w("warning","Partial Save",`${s} saved, ${i} failed. Fix invalid rows and retry.`)}async function On(){const t=Array.from(mt);if(!t.length||!confirm(`Delete ${t.length} selected fare row${t.length!==1?"s":""}? This cannot be undone.`))return;const e=document.getElementById("database-delete-selected-btn"),a=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-repeat animate-spin"></i> Deleting...');const s=await Promise.allSettled(t.map(o=>Se(o))),i=[];let n=0;if(s.forEach((o,r)=>{o.status==="fulfilled"?i.push(t[r]):n+=1}),i.length){const o=new Set(i);it=it.filter(r=>!o.has(r.id)),i.forEach(r=>{delete tt[r],mt.delete(r),yt.delete(r)})}V(),e&&(e.innerHTML=a||"Delete Selected"),n===0?w("success","Deleted",`${i.length} row${i.length!==1?"s":""} deleted.`):w("warning","Partial Delete",`${i.length} deleted, ${n} failed.`)}function _n(){const t=Kt(new Date);ft("Add Fare Row",`
    <form id="database-add-form" class="admin-modal-form">
      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Flight Details</p>
            <p class="admin-form-section-desc">Date, time, agent, sector, and airline.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="admin-field">
            <label class="admin-label">Date *</label>
            <input id="db-add-date" type="date" class="admin-control" value="${t}" required>
          </div>
          <div class="admin-field">
            <label class="admin-label">Time</label>
            <input id="db-add-time" type="text" class="admin-control" placeholder="e.g. 04:05 - 11:10">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div class="admin-field">
            <label class="admin-label">Agent *</label>
            <select id="db-add-agent" class="admin-control" required>
              <option value="">Select Agent</option>
              ${K.map(l=>`<option value="${B(l.id)}">${B(l.id)} · ${B(l.name||"Unnamed")}</option>`).join("")}
            </select>
          </div>
          <div class="admin-field">
            <label class="admin-label">Sector *</label>
            <select id="db-add-sector" class="admin-control" required>
              <option value="">Select Sector</option>
              ${F.map(l=>`<option value="${B(l.id)}">${B(l.sectorCode||l.id)}</option>`).join("")}
            </select>
          </div>
          <div class="admin-field">
            <label class="admin-label">Airline</label>
            <select id="db-add-airline" class="admin-control">
              <option value="">No Airline</option>
              ${O.map(l=>`<option value="${B(l.id)}">${B(l.code||"—")} · ${B(l.name||"Unnamed")}</option>`).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Pricing</p>
            <p class="admin-form-section-desc">Rates and commission.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="admin-field">
            <label class="admin-label">SP Rate (₹)</label>
            <input id="db-add-sp" type="number" class="admin-control" min="0" step="1" value="0">
          </div>
          <div class="admin-field">
            <label class="admin-label">Commission (₹)</label>
            <input id="db-add-comm" type="number" class="admin-control bg-slate-50 text-slate-500" min="0" step="1" value="0" readonly tabindex="-1">
          </div>
          <div class="admin-field">
            <label class="admin-label">Final Rate (₹)</label>
            <input id="db-add-rate" type="number" class="admin-control bg-slate-50 text-slate-500" min="0" step="1" value="0" readonly tabindex="-1">
          </div>
        </div>
        <p class="admin-help mt-2">Rate is auto-calculated as <strong>SP Rate + Commission</strong>.</p>
      </div>

      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Baggage &amp; Status</p>
            <p class="admin-form-section-desc">Check-in, extra baggage, and visibility.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="admin-field">
            <label class="admin-label">Baggage (kg)</label>
            <select id="db-add-bag" class="admin-control">
              ${Pt(re,30)}
            </select>
          </div>
          <div class="admin-field">
            <label class="admin-label">Extra Baggage (kg)</label>
            <select id="db-add-exbag" class="admin-control">
              ${Pt(re,20)}
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div class="admin-field">
            <label class="admin-label">Status</label>
            <select id="db-add-status" class="admin-control">
              <option value="live">Live</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>
      </div>

      <div class="admin-modal-footer">
        <button type="button" onclick="document.getElementById('admin-modal').close()" class="admin-btn admin-btn-ghost px-5">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary px-5">Add Fare</button>
      </div>
    </form>
  `,!0);const e=document.getElementById("database-add-form");if(!e)return;const a=document.getElementById("db-add-sp"),s=document.getElementById("db-add-comm"),i=document.getElementById("db-add-rate"),n=document.getElementById("db-add-agent"),o=()=>{if(!i)return;const l=N(a==null?void 0:a.value,0),d=Math.max(0,N(s==null?void 0:s.value,0));i.value=String(Qt(l,d))},r=()=>{if(!s)return;const l=ma(n==null?void 0:n.value,0);s.value=String(l),o()};a==null||a.addEventListener("input",o),n==null||n.addEventListener("change",r),r(),o(),e.addEventListener("submit",async l=>{var u,y,p,c,E,f,h,C,x,g,b,$;l.preventDefault();const d=e.querySelector('button[type="submit"]'),m=(d==null?void 0:d.textContent)||"Add Fare";d&&(d.disabled=!0,d.textContent="Adding...");try{const S=((u=document.getElementById("db-add-date"))==null?void 0:u.value)||"",M=na(S);if(!M)throw new Error("Please provide a valid flight date.");const H=N((y=document.getElementById("db-add-sp"))==null?void 0:y.value,0),D=Math.max(0,N((p=document.getElementById("db-add-comm"))==null?void 0:p.value,0)),j=Qt(H,D);await cn({agentId:((c=document.getElementById("db-add-agent"))==null?void 0:c.value)||"",sectorId:((E=document.getElementById("db-add-sector"))==null?void 0:E.value)||"",airlineId:((f=document.getElementById("db-add-airline"))==null?void 0:f.value)||"",flightDate:M,flightTime:((C=(h=document.getElementById("db-add-time"))==null?void 0:h.value)==null?void 0:C.trim())||"",specialRate:H,finalRate:j,commission:D,baggage:It((x=document.getElementById("db-add-bag"))==null?void 0:x.value),extraBaggage:N((g=document.getElementById("db-add-exbag"))==null?void 0:g.value,0),isHidden:(((b=document.getElementById("db-add-status"))==null?void 0:b.value)||"live")==="hidden"}),($=document.getElementById("admin-modal"))==null||$.close(),await Le(!0),w("success","Added","New fare row added.")}catch(S){w("error","Add Failed",S.message),d&&(d.disabled=!1,d.textContent=m)}})}const Vn="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",zn={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},Ve=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let at=null,$t=JSON.parse(localStorage.getItem("zt_hist")||"[]"),ke=$t.reduce((t,e)=>t+(e.rows||0),0);function Gn(){var e,a,s,i;const t=document.getElementById("rateData");t&&t.addEventListener("input",function(){const n=this.value.length,o=document.getElementById("charCount");o&&(o.textContent=n.toLocaleString()+" character"+(n!==1?"s":"")),Et(),clearTimeout(window._previewTimer),n>15?window._previewTimer=setTimeout(()=>Yn(this.value),500):de()}),(e=document.getElementById("resetBtn"))==null||e.addEventListener("click",()=>{t&&(t.value="");const n=document.getElementById("charCount");n&&(n.textContent="0 characters"),de(),Et()}),(a=document.getElementById("clearBtn"))==null||a.addEventListener("click",()=>{$t=[],ke=0,se(),Wt(),Ie()}),(s=document.getElementById("manualAgent"))==null||s.addEventListener("input",function(){const n=parseInt(this.value);at=n>0?String(n):null,document.querySelectorAll(".rp-chip").forEach(o=>o.classList.remove("on")),te(),Et()}),(i=document.getElementById("submitBtn"))==null||i.addEventListener("click",Jn),Ie(),Wt()}function ga(){const t=document.getElementById("chipGrid");if(!t)return;t.innerHTML="";const e=K.length?[...K].sort((a,s)=>{const i=parseInt(a.id),n=parseInt(s.id);return!isNaN(i)&&!isNaN(n)?i-n:a.id.localeCompare(s.id)}):[];if(!e.length){at=null,t.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>',te(),Et();return}at&&!e.some(a=>a.id===at)&&(at=null),e.forEach(a=>{const s=document.createElement("div");s.className="rp-chip",s.dataset.agentId=a.id,s.textContent=a.id,a.id===at&&s.classList.add("on"),s.addEventListener("click",()=>Wn(a.id,a.name,s)),t.appendChild(s)}),te(),Et()}function Wn(t,e,a){at=t,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(s=>{s.classList.remove("on")}),a&&a.classList.add("on"),te(),Et()}function te(){const t=document.getElementById("agentPill");if(t)if(at){const e=K.find(a=>a.id===at);t.textContent=`Agent ${(e==null?void 0:e.id)||at} selected ✓`,t.classList.remove("empty")}else t.textContent="Select an agent to continue",t.classList.add("empty")}function Et(){const t=document.getElementById("rateData"),e=document.getElementById("submitBtn");e&&(e.disabled=!(at&&t&&t.value.trim().length>10))}function pa(t){const e=[];let a=null,s="IX";for(const i of t.split(`
`)){const n=i.replace(/[*_~`]/g,"").trim();if(!n)continue;const o=n.match(/([A-Z]{3})\s+([A-Z]{3})/);if(o&&n.length<70&&!n.match(/\d{4,6}/)){a=o[1]+"-"+o[2];const r=n.match(Ve);r&&(s=r[1]);continue}if(a){const r=n.match(Ve);if(r&&!n.match(/\d{4,6}/)){s=r[1];continue}const l=n.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(l){const d=parseInt(l[3]);d>=1e3&&d<=99999&&e.push({sector:a,date:`2026-${zn[l[2].toUpperCase()]}-${l[1].padStart(2,"0")}`,airline:r?r[1]:s,rate:d})}}}return e}function Yn(t){const e=pa(t);if(!e.length){de();return}const a=document.getElementById("prevBox");a&&a.classList.add("on");const s=document.getElementById("prevCount");s&&(s.textContent=e.length+" entr"+(e.length===1?"y":"ies"));const i=document.getElementById("prevBody");i&&(i.innerHTML=e.slice(0,60).map(n=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${n.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${n.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${n.rate.toLocaleString()}</td></tr>`).join(""),e.length>60&&(i.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${e.length-60} more</td></tr>`))}function de(){var t;(t=document.getElementById("prevBox"))==null||t.classList.remove("on")}async function Jn(){const t=document.getElementById("rateData");if(!at||!(t!=null&&t.value.trim()))return;const e=document.getElementById("submitBtn"),a=e.innerHTML;e.disabled=!0,e.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI pipeline...';const s=document.getElementById("progBar"),i=document.getElementById("progFill");s&&s.classList.add("on");let n=0;const o=setInterval(()=>{n=Math.min(n+Math.random()*13,85),i&&(i.style.width=n+"%")},280),r=pa(t.value),l={id:Date.now(),agent:at,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:r.length,status:"pen"};$t.unshift(l),$t.length>15&&$t.pop(),se(),Wt();try{const d=await fetch(Vn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:at,raw_text:t.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(o),i&&(i.style.width="100%"),d.ok)l.status="ok",ke+=r.length,se(),Wt(),Ie(),w("success","Submitted","Rates sent to the AI parser. Firestore will update in a moment."),setTimeout(()=>{t.value="";const m=document.getElementById("charCount");m&&(m.textContent="0 characters"),de(),Et()},500);else throw new Error("N8N webhook rejected payload")}catch(d){clearInterval(o),i&&(i.style.width="100%"),l.status="err",se(),Wt(),w("error","Submission Failed",d.message)}setTimeout(()=>{s&&s.classList.remove("on"),i&&(i.style.width="0%"),e.innerHTML=a,Et()},900)}function Ie(){const t=document.getElementById("statSubs");t&&(t.textContent=$t.length);const e=document.getElementById("statEntries");e&&(e.textContent=ke)}function se(){localStorage.setItem("zt_hist",JSON.stringify($t))}function Wt(){const t=document.getElementById("historyWrap");if(t){if(!$t.length){t.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}t.innerHTML=$t.map(e=>{var s;const a=((s=K.find(i=>i.id===e.agent))==null?void 0:s.name)||`Agent ${e.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${a.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${a}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${e.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${e.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${e.status==="ok"?"bg-green-500":e.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}const Xn=210/25.4*96,Kn=297/25.4*96;function ze(){const t=document.getElementById("eticket-output-wrapper"),e=document.getElementById("eticket-print-area");if(!t||!e||t.classList.contains("hidden"))return;e.style.zoom="1",e.style.removeProperty("--eticket-print-scale");const a=Math.max(e.scrollWidth,e.offsetWidth),s=Math.max(e.scrollHeight,e.offsetHeight);if(!a||!s)return;const i=Xn/a,n=Kn/s;let o=Math.min(1,i,n);o<1&&(o=Math.max(.7,o*.985)),e.style.zoom=String(o),e.style.setProperty("--eticket-print-scale",String(o))}function Zn(){const t=document.getElementById("eticket-print-area");t&&(t.style.zoom="1",t.style.removeProperty("--eticket-print-scale"))}async function Qn(){var r;const t=document.getElementById("eticket-tab");if(!t)return;const e=document.getElementById("eticket-form"),a=document.getElementById("et-add-passenger"),s=document.getElementById("et-passengers-container"),i=document.getElementById("et-airline"),n=document.getElementById("et-origin"),o=document.getElementById("et-destination");if(O.length===0&&(O=await Ce()),F.length===0&&(F=Te(await Be())),!t.dataset.wired){if(t.dataset.wired="1",i&&O&&(i.innerHTML='<option value="">Select Airline</option>'+O.map(d=>`<option value="${d.name}">${d.name}</option>`).join("")),n&&F){const d=[...new Set(F.map(m=>m.sectorFrom).filter(Boolean))].sort();n.innerHTML='<option value="">Select Origin</option>'+d.map(m=>`<option value="${m}">${m}</option>`).join("")}if(o&&F){const d=[...new Set(F.map(m=>m.sectorTo).filter(Boolean))].sort();o.innerHTML='<option value="">Select Destination</option>'+d.map(m=>`<option value="${m}">${m}</option>`).join("")}const l=()=>{const d=Array.from(s.querySelectorAll(".et-pax-row"));d.forEach((m,u)=>{const y=m.querySelector(".et-passenger-index");y&&(y.textContent=`Passenger ${u+1}`);const p=m.querySelector(".et-remove-passenger");p&&(d.length<=1?(p.classList.add("opacity-40","pointer-events-none"),p.setAttribute("aria-disabled","true")):(p.classList.remove("opacity-40","pointer-events-none"),p.removeAttribute("aria-disabled")))})};a==null||a.addEventListener("click",()=>{const d=`
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
                ${Pt(aa,7)}
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Check-in Bag</label>
              <select name="paxCheckBag[]" class="admin-control h-10">
                ${Pt(re,30)}
              </select>
            </div>
          </div>
        </div>
      `;s.insertAdjacentHTML("beforeend",d),l()}),s==null||s.addEventListener("click",d=>{var u;const m=d.target.closest(".et-remove-passenger");m&&((u=m.closest(".et-pax-row"))==null||u.remove(),l())}),s.children.length===0&&(a==null||a.click()),l(),e==null||e.addEventListener("submit",async d=>{d.preventDefault(),await ts(new FormData(e))}),(r=document.getElementById("et-print-btn"))==null||r.addEventListener("click",()=>{ze(),requestAnimationFrame(()=>window.print())}),window.addEventListener("beforeprint",ze),window.addEventListener("afterprint",Zn),e==null||e.addEventListener("reset",()=>{setTimeout(()=>{var d;Array.from(s.children).forEach((m,u)=>{u>0&&m.remove()}),s.children.length===0&&(a==null||a.click()),l(),(d=document.getElementById("eticket-output-wrapper"))==null||d.classList.add("hidden")},10),w("info","Form Reset","The E-Ticket form has been cleared.")})}}async function ts(t){var Bt,jt,ct;const e=(Bt=t.get("etPnr"))==null?void 0:Bt.toUpperCase(),a=(jt=t.get("etAirline"))==null?void 0:jt.toUpperCase(),s=(ct=t.get("etFlightNo"))==null?void 0:ct.toUpperCase(),i=t.get("etDate"),n=t.get("etDepTime"),o=t.get("etArrTime"),r=t.get("etPhone"),l=(T="")=>String(T).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),d=T=>{const q=/^([01]?\d|2[0-3]):([0-5]\d)$/.exec(T||"");return q?Number(q[1])*60+Number(q[2]):null},m=(T="")=>T.replace(/[^A-Za-z]/g,"").toUpperCase().slice(0,3)||"---",u=T=>{const q=(T||"").trim();let G=q,Ct="";const Tt=q.match(/^(.*?)\s*\((.*?)\)$/);return Tt&&(G=Tt[1].trim(),Ct=Tt[2].trim()),{city:G,code:Ct}},y=u(t.get("etOrigin")),p=u(t.get("etDest")),c=t.get("etOrigin")||"—",E=t.get("etDest")||"—";let f="—";if(i){const T=new Date(i);if(!isNaN(T.getTime())){const q=["SUN","MON","TUE","WED","THU","FRI","SAT"],G=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];f=`${q[T.getDay()]}, ${String(T.getDate()).padStart(2,"0")} ${G[T.getMonth()]} ${T.getFullYear()}`}}const h=T=>document.getElementById(T);let C=y.code,x=p.code,g=null;if(typeof F<"u"){if(g=F.find(T=>T.sectorFrom===c&&T.sectorTo===E),!g&&c){const T=F.find(q=>q.sectorFrom===c);T&&T.sectorCode&&(C=T.sectorCode.split(/[ -]+/)[0])}if(!g&&E){const T=F.find(q=>q.sectorTo===E);T&&T.sectorCode&&(x=T.sectorCode.split(/[ -]+/).pop())}}const b=(C||m(y.city)).toUpperCase(),$=(x||m(p.city)).toUpperCase(),S=`${b} - ${$}`,M=`${(y.city||c).toUpperCase()} to ${(p.city||E).toUpperCase()}`,H=(y.city||c).toUpperCase(),D=(p.city||E).toUpperCase(),j=d(n),z=d(o);if(j!==null&&z!==null){let T=z-j;T<0&&(T+=24*60);const q=Math.floor(T/60),G=T%60;`${q}${String(G).padStart(2,"0")}`}h("t-pnr")&&(h("t-pnr").textContent=e||"—"),h("t-issued-by")&&(h("t-issued-by").textContent=a||"—"),h("t-customer-phone")&&(h("t-customer-phone").textContent=r||"—"),h("t-flight-code")&&(h("t-flight-code").textContent=s||"—"),h("t-travel-date")&&(h("t-travel-date").textContent=f||"—"),h("t-route-code")&&(h("t-route-code").textContent=S),h("t-route-long")&&(h("t-route-long").textContent=M);const et=new Date,ot=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],St=`${String(et.getDate()).padStart(2,"0")} ${ot[et.getMonth()]} ${et.getFullYear()} ${String(et.getHours()).padStart(2,"0")}:${String(et.getMinutes()).padStart(2,"0")}`;h("t-booked-on")&&(h("t-booked-on").textContent=St);const J=h("t-airline-logo"),Z=h("t-issued-by-fallback");if(J){const T=typeof O<"u"?O.find(q=>q.name.toUpperCase()===a):null;T&&T.logoUrl?(J.src=T.logoUrl,J.classList.remove("hidden"),Z&&Z.classList.add("hidden")):(J.removeAttribute("src"),J.classList.add("hidden"),Z&&(Z.classList.remove("hidden"),Z.textContent=(a||"No logo").toUpperCase()))}const Ft=t.getAll("paxTitle[]"),nt=t.getAll("paxName[]"),k=t.getAll("paxType[]"),rt=t.getAll("paxCheckBag[]"),dt=t.getAll("paxCarryBag[]");h("t-pax-count")&&(h("t-pax-count").textContent=String(nt.length)),h("t-top-pax-count")&&(h("t-top-pax-count").textContent=String(nt.length));const st=document.getElementById("t-passengers-tbody");if(st){const T=nt.map((q,G)=>{const Ct=l((Ft[G]||"MR").toUpperCase()),Tt=l((nt[G]||"").toUpperCase()),v=l((k[G]||"ADT").toUpperCase()),A=l(qe(rt[G])),L=l(qe(dt[G])),U=g&&g.sectorCode?l(g.sectorCode.toUpperCase()):l(S);return`
        <tr class="${G%2===0?"bg-white":"bg-slate-50/80"} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${G+1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${Ct}. ${Tt}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${v}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${U}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${l(s||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${l(e||"—")}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${L}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${A}</td>
        </tr>
      `}).join("");st.innerHTML=T||`
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `}const Rt=document.getElementById("t-travel-tbody");Rt&&(Rt.innerHTML=`
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${l(s||"—")}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${l(H)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${l(b)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${l(n||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${l(f||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${l(D)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${l($)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${l(o||"—")}</span> <span class="text-slate-500 ml-1 text-[11px]">${l(f||"—")}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `);const lt=document.getElementById("eticket-output-wrapper");lt&&(lt.classList.remove("hidden"),lt.scrollIntoView({behavior:"smooth"}))}const Ge={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function w(t,e,a){const s=document.getElementById("toastsEl");if(!s)return;const i=document.createElement("div"),n={success:"border-emerald-200 bg-emerald-50/95 text-emerald-900",error:"border-rose-200 bg-rose-50/95 text-rose-900",warning:"border-amber-200 bg-amber-50/95 text-amber-900",info:"border-blue-200 bg-blue-50/95 text-blue-900"};i.className=`flex items-start gap-3 p-4 border rounded-xl shadow-md w-80 pointer-events-auto backdrop-blur-sm ${n[t]||n.error}`,i.innerHTML=`<div class="mt-0.5">${Ge[t]||Ge.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${e}</div><div class="text-xs opacity-90 mt-1">${a}</div></div>
    <button class="opacity-50 hover:opacity-100 transition-opacity" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,s.appendChild(i),setTimeout(()=>i.isConnected&&i.remove(),7e3)}window.toast=w;document.addEventListener("DOMContentLoaded",()=>{});async function bt(t=!0){if(t)try{const[n,o,r,l]=await Promise.all([Ke(),Ua(),qa(),Oa()]);ie=n,he=o,ye=r,ve=l,I.visas=1,I.visaStampings=1,I.attestations=1,I.passportServices=1}catch(n){w("error","Error loading Visas tab data",n.message)}const e=document.querySelector("#visas-tab #visas-table-body");if(e){const n=vt(ie,"visas"),o=X.visas,r=Math.max(1,Math.ceil(n.length/o));I.visas>r&&(I.visas=r);const l=(I.visas-1)*o,d=n.slice(l,l+o);e.innerHTML=d.length?d.map(m=>as(m)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No tourist visas yet. Click "Add Tourist Visa".</td></tr>',ns()}const a=document.querySelector("#visa-stamping-table-body");if(a){const n=vt(he,"visaStampings"),o=X.visaStampings,r=Math.max(1,Math.ceil(n.length/o));I.visaStampings>r&&(I.visaStampings=r);const l=(I.visaStampings-1)*o,d=n.slice(l,l+o);a.innerHTML=d.length?d.map(m=>ss(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No visa stampings yet. Click "Add Visa Stamping".</td></tr>',is()}const s=document.querySelector("#attestations-table-body");if(s){const n=vt(ye,"attestations"),o=X.attestations,r=Math.max(1,Math.ceil(n.length/o));I.attestations>r&&(I.attestations=r);const l=(I.attestations-1)*o,d=n.slice(l,l+o);s.innerHTML=d.length?d.map(m=>os(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No attestations yet. Click "Add Attestation".</td></tr>',rs()}const i=document.querySelector("#passport-services-table-body");if(i){const n=vt(ve,"passportServices"),o=X.passportServices,r=Math.max(1,Math.ceil(n.length/o));I.passportServices>r&&(I.passportServices=r);const l=(I.passportServices-1)*o,d=n.slice(l,l+o);i.innerHTML=d.length?d.map(m=>ds(m)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No passport services yet. Click "Add Passport Service".</td></tr>',ls()}es()}function es(){const t=document.getElementById("visas-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>fa(null)));const e=document.getElementById("visa-stamping-add-btn");e&&!e.dataset.wired&&(e.dataset.wired="1",e.addEventListener("click",()=>ba(null)));const a=document.getElementById("attestation-add-btn");a&&!a.dataset.wired&&(a.dataset.wired="1",a.addEventListener("click",()=>ha(null)));const s=document.getElementById("passport-service-add-btn");s&&!s.dataset.wired&&(s.dataset.wired="1",s.addEventListener("click",()=>ya(null)))}function as(t){const e=t.flagUrl?`<span class="admin-logo-wrap"><img src="${t.flagUrl}" alt="${B(t.countryName||"Country")}"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-flag"></i></span></span>';return`<tr data-visa-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy">${B(t.countryName)}</td>
    <td class="text-text-muted text-[13px]">${B(t.visaType)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.rate||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function ns(){const t=document.querySelector("#visas-tab .admin-table tbody");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=ie.find(o=>o.id===i);if(s==="edit-visa"&&fa(n),s==="delete-visa"){if(!confirm(`Delete visa for "${n==null?void 0:n.countryName}"?`))return;try{await _a(i),w("success","Deleted",`Visa for "${n==null?void 0:n.countryName}" removed.`),await bt()}catch(o){w("error","Error",o.message)}}}))}function fa(t){const e=document.getElementById("modal-visa-form");if(!e)return;ft(t?"Edit Visa":"Add New Visa",e.innerHTML);const a=document.getElementById("visa-form"),s=document.getElementById("visa-id"),i=document.getElementById("visa-country"),n=document.getElementById("visa-type"),o=document.getElementById("visa-rate");t&&(s.value=t.id,i.value=t.countryName||"",n.value=t.visaType||"",o.value=t.rate||0),a.addEventListener("submit",async r=>{r.preventDefault();const l=a.querySelector('button[type="submit"]');l.disabled=!0,l.textContent="Saving...";try{const d=s.value,m={countryName:i.value.trim(),visaType:n.value.trim(),rate:Number(o.value)},y=document.getElementById("visa-flag").files[0];d?await Va(d,m,y):await za(m,y),w("success","Saved!",`Visa for ${m.countryName} saved.`),document.getElementById("admin-modal").close(),await bt()}catch(d){w("error","Error",d.message),l.disabled=!1,l.textContent="Save Visa"}})}function ss(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${B(t.country)}</td>
    <td class="text-text-muted text-[13px]">${B(t.description)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa-stamping" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function is(){const t=document.getElementById("visa-stamping-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=he.find(o=>o.id===i);if(s==="edit-visa-stamping"&&ba(n),s==="delete-visa-stamping"){if(!confirm(`Delete visa stamping for "${n==null?void 0:n.country}"?`))return;try{await Ga(i),w("success","Deleted",`Visa Stamping for "${n==null?void 0:n.country}" removed.`),await bt(!0)}catch(o){w("error","Error",o.message)}}}))}function ba(t){const e=document.getElementById("modal-visa-stamping-form");if(!e)return;ft(t?"Edit Visa Stamping":"Add Visa Stamping",e.innerHTML);const a=document.getElementById("visa-stamping-form"),s=document.getElementById("visa-stamping-id"),i=document.getElementById("visa-stamping-country"),n=document.getElementById("visa-stamping-desc"),o=document.getElementById("visa-stamping-cost");t&&(s.value=t.id,i.value=t.country||"",n.value=t.description||"",o.value=t.cost||0),a.addEventListener("submit",async r=>{r.preventDefault();const l=a.querySelector('button[type="submit"]');l.disabled=!0,l.textContent="Saving...";try{const d=s.value,m={country:i.value.trim(),description:n.value.trim(),cost:Number(o.value)};d?await Wa(d,m):await Ya(m),w("success","Saved!",`Visa stamping for ${m.country} saved.`),document.getElementById("admin-modal").close(),await bt(!0)}catch(d){w("error","Error",d.message),l.disabled=!1,l.textContent="Save"}})}function os(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${B(t.country)}</td>
    <td class="text-text-muted text-[13px]">${B(t.certificate)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-attestation" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-attestation" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function rs(){const t=document.getElementById("attestations-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=ye.find(o=>o.id===i);if(s==="edit-attestation"&&ha(n),s==="delete-attestation"){if(!confirm(`Delete attestation for "${n==null?void 0:n.country}"?`))return;try{await Ja(i),w("success","Deleted",`Attestation for "${n==null?void 0:n.country}" removed.`),await bt(!0)}catch(o){w("error","Error",o.message)}}}))}function ha(t){const e=document.getElementById("modal-attestation-form");if(!e)return;ft(t?"Edit Attestation":"Add Attestation",e.innerHTML);const a=document.getElementById("attestation-form"),s=document.getElementById("attestation-id"),i=document.getElementById("attestation-country"),n=document.getElementById("attestation-cert"),o=document.getElementById("attestation-cost");t&&(s.value=t.id,i.value=t.country||"",n.value=t.certificate||"",o.value=t.cost||0),a.addEventListener("submit",async r=>{r.preventDefault();const l=a.querySelector('button[type="submit"]');l.disabled=!0,l.textContent="Saving...";try{const d=s.value,m={country:i.value.trim(),certificate:n.value.trim(),cost:Number(o.value)};d?await Xa(d,m):await Ka(m),w("success","Saved!",`Attestation for ${m.country} saved.`),document.getElementById("admin-modal").close(),await bt(!0)}catch(d){w("error","Error",d.message),l.disabled=!1,l.textContent="Save"}})}function ds(t){return`<tr data-id="${t.id}">
    <td class="font-bold text-navy">${B(t.type)}</td>
    <td class="text-text-muted text-[13px]">${B(t.description)}</td>
    <td class="font-black text-[15px] text-navy">₹${(t.cost||0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-passport-service" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function ls(){const t=document.getElementById("passport-services-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=ve.find(o=>o.id===i);if(s==="edit-passport-service"&&ya(n),s==="delete-passport-service"){if(!confirm(`Delete passport service "${n==null?void 0:n.type}"?`))return;try{await Za(i),w("success","Deleted",`Passport service "${n==null?void 0:n.type}" removed.`),await bt(!0)}catch(o){w("error","Error",o.message)}}}))}function ya(t){const e=document.getElementById("modal-passport-service-form");if(!e)return;ft(t?"Edit Passport Service":"Add Passport Service",e.innerHTML);const a=document.getElementById("passport-service-form"),s=document.getElementById("passport-service-id"),i=document.getElementById("passport-service-type"),n=document.getElementById("passport-service-desc"),o=document.getElementById("passport-service-cost");t&&(s.value=t.id,i.value=t.type||"",n.value=t.description||"",o.value=t.cost||0),a.addEventListener("submit",async r=>{r.preventDefault();const l=a.querySelector('button[type="submit"]');l.disabled=!0,l.textContent="Saving...";try{const d=s.value,m={type:i.value.trim(),description:n.value.trim(),cost:Number(o.value)};d?await Qa(d,m):await tn(m),w("success","Saved!",`Passport service ${m.type} saved.`),document.getElementById("admin-modal").close(),await bt(!0)}catch(d){w("error","Error",d.message),l.disabled=!1,l.textContent="Save"}})}async function me(t=!0){if(t)try{xe=await en({includeInactive:!0}),I.tours=1}catch(r){w("error","Error loading Tours",r.message)}const e=document.getElementById("tours-table-body");if(!e)return;const a=vt(xe,"tours"),s=X.tours,i=Math.max(1,Math.ceil(a.length/s));I.tours>i&&(I.tours=i);const n=(I.tours-1)*s,o=a.slice(n,n+s);e.innerHTML=o.length?o.map(r=>ms(r)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No tour packages yet. Click "Add Tour Package".</td></tr>',us(),cs()}function cs(){const t=document.getElementById("tours-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>va(null)))}function ms(t){const e=t.coverImageUrl?`<span class="admin-logo-wrap"><img src="${t.coverImageUrl}" alt="${B(t.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>',a=!t.price||t.price===0?'<span class="text-text-muted text-[12px] italic">Call for Price</span>':`<span class="font-black text-[15px] text-navy">₹${Number(t.price).toLocaleString()}</span>`,s=t.isActive!==!1?'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>':'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>';return`<tr data-tour-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy">${B(t.title)}</td>
    <td class="text-text-muted text-[13px]">${B(t.category)}</td>
    <td class="text-text-muted text-[13px]">${B(t.duration)}</td>
    <td>${a}</td>
    <td>${s}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-tour" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-tour" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function us(){const t=document.getElementById("tours-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=xe.find(o=>o.id===i);if(s==="edit-tour"&&va(n),s==="delete-tour"){if(!confirm(`Delete tour package "${n==null?void 0:n.title}"?`))return;try{await an(i),w("success","Deleted",`Tour "${n==null?void 0:n.title}" removed.`),await me()}catch(o){w("error","Error",o.message)}}}))}function Yt(t=""){return t.split(`
`).map(e=>e.trim()).filter(Boolean)}function Jt(t=[]){return Array.isArray(t)?t.join(`
`):""}function gs(t,e="",a=[]){const s=a.length?a.join(`
`):"";return`
    <div class="tour-day-row admin-form-section relative bg-white" data-day-index="${t}">
      <div class="flex items-center justify-between mb-3 pr-8">
        <span class="tour-day-number admin-label text-primary">Day ${t+1}</span>
      </div>
      <button type="button" class="tour-remove-day absolute top-3 right-3 w-7 h-7 rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center" title="Remove day">
        <i class="bi bi-x-lg text-[11px]"></i>
      </button>
      <div class="grid grid-cols-1 gap-3">
        <div class="admin-field">
          <label class="admin-label">Day Label / Title *</label>
          <input type="text" class="tour-day-label admin-control" placeholder="e.g. Day 1 – Arrival" value="${B(e)}" required>
        </div>
        <div class="admin-field">
          <label class="admin-label">Activities</label>
          <p class="admin-help">One activity per line.</p>
          <textarea class="tour-day-activities admin-control" rows="3" placeholder="Airport pickup&#10;Hotel check-in&#10;Welcome dinner">${B(s)}</textarea>
        </div>
      </div>
    </div>`}function We(t){const e=t.querySelectorAll(".tour-day-row");e.forEach((a,s)=>{const i=a.querySelector(".tour-day-number");i&&(i.textContent=`Day ${s+1}`),a.dataset.dayIndex=s;const n=a.querySelector(".tour-remove-day");n&&(e.length<=1?n.classList.add("opacity-40","pointer-events-none"):n.classList.remove("opacity-40","pointer-events-none"))})}function ps(t){const e=t.querySelectorAll(".tour-day-row");return Array.from(e).map(a=>{var s,i;return{day:((s=a.querySelector(".tour-day-label"))==null?void 0:s.value.trim())||"",activities:(((i=a.querySelector(".tour-day-activities"))==null?void 0:i.value)||"").split(`
`).map(n=>n.trim()).filter(Boolean)}}).filter(a=>a.day)}function va(t){const e=document.getElementById("modal-tour-form");if(!e)return;ft(t?"Edit Tour Package":"Add Tour Package",e.innerHTML,!0);const a=document.getElementById("tour-form"),s=document.getElementById("tour-id"),i=document.getElementById("tour-title"),n=document.getElementById("tour-category"),o=document.getElementById("tour-duration"),r=document.getElementById("tour-price"),l=document.getElementById("tour-active"),d=document.getElementById("tour-description"),m=document.getElementById("tour-highlights"),u=document.getElementById("tour-inclusions"),y=document.getElementById("tour-exclusions"),p=document.getElementById("tour-itinerary-container"),c=document.getElementById("tour-add-day-btn"),E=(f="",h=[])=>{const C=p.querySelectorAll(".tour-day-row").length;p.insertAdjacentHTML("beforeend",gs(C,f,h)),We(p)};c==null||c.addEventListener("click",()=>{var f;E(),(f=p.lastElementChild)==null||f.scrollIntoView({behavior:"smooth",block:"nearest"})}),p.addEventListener("click",f=>{var C;const h=f.target.closest(".tour-remove-day");h&&((C=h.closest(".tour-day-row"))==null||C.remove(),We(p))}),t&&(s.value=t.id,i.value=t.title||"",n.value=t.category||"International",o.value=t.duration||"",r.value=t.price||0,l.checked=t.isActive!==!1,d.value=t.description||"",m.value=Jt(t.highlights),u.value=Jt(t.inclusions),y.value=Jt(t.exclusions),(Array.isArray(t.itinerary)?t.itinerary:[]).forEach(h=>E(h.day||"",h.activities||[]))),p.querySelectorAll(".tour-day-row").length===0&&E(),a.addEventListener("submit",async f=>{var C;f.preventDefault();const h=a.querySelector('button[type="submit"]');h.disabled=!0,h.textContent="Saving…";try{const x=s.value,g=ps(p),b={title:i.value.trim(),category:n.value,duration:o.value.trim(),price:Number(r.value)||0,isActive:l.checked,description:d.value.trim(),highlights:Yt(m.value),itinerary:g,inclusions:Yt(u.value),exclusions:Yt(y.value)},$=((C=document.getElementById("tour-image"))==null?void 0:C.files[0])||null;x?await nn(x,b,$):await sn(b,$),w("success","Saved!",`Tour "${b.title}" saved.`),document.getElementById("admin-modal").close(),await me()}catch(x){w("error","Error",x.message),h.disabled=!1,h.textContent="Save Tour"}})}async function ue(t=!0){if(t)try{we=await on({includeInactive:!0}),I.hajjUmrah=1}catch(r){w("error","Error loading Hajj & Umrah",r.message)}const e=document.getElementById("hajjumrah-table-body");if(!e)return;const a=vt(we,"hajjUmrah"),s=X.hajjUmrah,i=Math.max(1,Math.ceil(a.length/s));I.hajjUmrah>i&&(I.hajjUmrah=i);const n=(I.hajjUmrah-1)*s,o=a.slice(n,n+s);e.innerHTML=o.length?o.map(r=>bs(r)).join(""):'<tr><td colspan="10" class="text-center py-8 text-text-muted">No packages yet. Click "Add Package".</td></tr>',hs(),fs()}function fs(){const t=document.getElementById("hajjumrah-add-btn");t&&!t.dataset.wired&&(t.dataset.wired="1",t.addEventListener("click",()=>xa(null)))}function bs(t){const e=t.coverImageUrl?`<span class="admin-logo-wrap"><img src="${t.coverImageUrl}" alt="${B(t.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`:'<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>',a=!t.price||t.price===0?'<span class="text-text-muted text-[12px] italic">Call for Price</span>':`<span class="font-black text-[15px] text-navy">₹${Number(t.price).toLocaleString()}</span>`,s=t.isActive!==!1?'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>':'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>',i=t.type==="Hajj"?'<span class="px-2 py-0.5 rounded bg-blue-50 text-primary text-[11px] font-semibold">Hajj</span>':'<span class="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[11px] font-semibold">Umrah</span>';return`<tr data-hajjumrah-id="${t.id}">
    <td class="w-16">${e}</td>
    <td class="font-bold text-navy truncate max-w-[150px]" title="${B(t.title)}">${B(t.title)}</td>
    <td>${i}</td>
    <td class="text-text-muted text-[13px]">${B(t.departureCity)}</td>
    <td class="text-text-muted text-[13px]">${B(t.airline)}</td>
    <td class="text-text-muted text-[13px]">${B(t.departureDate)}</td>
    <td class="text-navy font-medium text-[13px]">${t.days}D/${t.nights}N</td>
    <td>${a}</td>
    <td>${s}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-hajjumrah" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-hajjumrah" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`}function hs(){const t=document.getElementById("hajjumrah-table-body");!t||t.dataset.actionsWired||(t.dataset.actionsWired="1",t.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const{action:s,id:i}=a.dataset,n=we.find(o=>o.id===i);if(s==="edit-hajjumrah"&&xa(n),s==="delete-hajjumrah"){if(!confirm(`Delete package "${n==null?void 0:n.title}"?`))return;try{await rn(i),w("success","Deleted",`Package "${n==null?void 0:n.title}" removed.`),await ue()}catch(o){w("error","Error",o.message)}}}))}function xa(t){const e=document.getElementById("modal-hajjumrah-form");if(!e)return;ft(t?"Edit Package":"Add Package",e.innerHTML,!0);const a=document.getElementById("hajjumrah-form"),s=document.getElementById("hajjumrah-id"),i=document.getElementById("hajjumrah-title"),n=document.getElementById("hajjumrah-type"),o=document.getElementById("hajjumrah-city"),r=document.getElementById("hajjumrah-airline"),l=document.getElementById("hajjumrah-date"),d=document.getElementById("hajjumrah-days"),m=document.getElementById("hajjumrah-nights"),u=document.getElementById("hajjumrah-price"),y=document.getElementById("hajjumrah-active"),p=document.getElementById("hajjumrah-description"),c=document.getElementById("hajjumrah-highlights"),E=document.getElementById("hajjumrah-inclusions");t&&(s.value=t.id,i.value=t.title||"",n.value=t.type||"Umrah",o.value=t.departureCity||"",r.value=t.airline||"",l.value=t.departureDate||"",d.value=t.days||15,m.value=t.nights||14,u.value=t.price||0,y.checked=t.isActive!==!1,p.value=t.description||"",c.value=Jt(t.highlights),E.value=Jt(t.inclusions)),a.addEventListener("submit",async f=>{var C;f.preventDefault();const h=a.querySelector('button[type="submit"]');h.disabled=!0,h.textContent="Saving…";try{const x=s.value,g={title:i.value.trim(),type:n.value,departureCity:o.value.trim(),airline:r.value.trim(),departureDate:l.value.trim(),days:Number(d.value)||1,nights:Number(m.value)||1,price:Number(u.value)||0,isActive:y.checked,description:p.value.trim(),highlights:Yt(c.value),inclusions:Yt(E.value)},b=((C=document.getElementById("hajjumrah-image"))==null?void 0:C.files[0])||null;x?await dn(x,g,b):await ln(g,b),w("success","Saved!",`Package "${g.title}" saved.`),document.getElementById("admin-modal").close(),await ue()}catch(x){w("error","Error",x.message),h.disabled=!1,h.textContent="Save Package"}})}
