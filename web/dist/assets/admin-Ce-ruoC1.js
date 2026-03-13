import"./firebase-config-zYKzaodH.js";import{o as Ye,l as Ke}from"./auth-DokV5l0Q.js";import{a as we,d as Xe,u as he,c as Ue,e as Ze,f as Qe,h as et,i as tt,j as ot,g as Ee,k as nt,l as rt,m as at,n as st,b as $e,o as it,p as lt,q as dt,r as ct}from"./db-DN85Zd7Y.js";async function pt(e,t,o,r,a){const s=`Generating ${e} Video... Please remain on this tab.`;return window.toast&&window.toast("info","Video Generation",s),new Promise(async(d,c)=>{try{let Z=function(b,S,k,y,I){n.beginPath(),n.moveTo(b+I,S),n.lineTo(b+k-I,S),n.arcTo(b+k,S,b+k,S+I,I),n.lineTo(b+k,S+y-I),n.arcTo(b+k,S+y,b+k-I,S+y,I),n.lineTo(b+I,S+y),n.arcTo(b,S+y,b,S+y-I,I),n.lineTo(b,S+I),n.arcTo(b,S,b+I,S,I),n.closePath()},Q=function(b){var ke;const S=b-O;if(S>G){try{U.stop()}catch(M){console.error("Error stopping recorder",M)}return}n.fillStyle="#f8fafc",n.fillRect(0,0,i,p);const k=e==="9x16"?400:300;if(n.fillStyle="#1e293b",n.fillRect(0,0,i,k),C.complete&&C.width>0){n.globalAlpha=.2;const M=Math.max(i/C.width,k/C.height),R=C.width*M,oe=C.height*M,Ae=(i-R)/2,de=(k-oe)/2;n.drawImage(C,Ae,de,R,oe),n.globalAlpha=1}const y=n.createLinearGradient(0,0,0,k);y.addColorStop(0,"#1e293b"),y.addColorStop(1,"transparent"),n.fillStyle=y,n.globalAlpha=.8,n.fillRect(0,0,i,k),n.globalAlpha=1,n.textAlign="center",n.textBaseline="middle";const I=n.createLinearGradient(0,0,i,0);I.addColorStop(0,"#2563eb"),I.addColorStop(.5,"#60a5fa"),I.addColorStop(1,"#1558c0"),n.fillStyle=I,n.fillRect(0,0,i,16);const _=200,j=40,z=60;n.fillStyle="rgba(37, 99, 235, 0.4)",Z(i/2-_/2,z,_,j,20),n.fill(),n.strokeStyle="rgba(37, 99, 235, 0.6)",n.lineWidth=1,n.stroke(),n.fillStyle="#bfdbfe",n.font="bold 16px Arial, sans-serif",n.fillText("EXCLUSIVE DEALS",i/2,z+j/2),n.fillStyle="#ffffff",n.font="900 "+(e==="16x9"?"70px":"56px")+" Arial, sans-serif",n.fillText(`${l} → ${f}`,i/2,z+80),n.fillStyle="#dbeafe",n.font="700 24px Arial, sans-serif",n.fillText("SPECIAL FARES AVAILABLE NOW",i/2,z+140);const W=k+60,P=90,N=e==="9x16"?40:e==="1x1"?80:160,te=i-N*2;n.fillStyle="#64748b",n.font="bold 18px Arial, sans-serif",n.textAlign="left",n.fillText("DATE",N+20,W-20),n.textAlign="center",n.fillText("AIRLINE",N+te*.35,W-20),n.fillText("TIME",N+te*.65,W-20),n.textAlign="right",n.fillText("FARE",N+te-20,W-20);for(let M=0;M<h.length;M++){const R=h[M],oe=1e3+M*800;if(S<oe)continue;const de=Math.min(1,(S-oe)/500),We=20*(1-de),ne=W+M*P+We;n.globalAlpha=de,M%2===0&&(n.fillStyle="#ffffff",Z(N,ne,te,P-10,12),n.fill()),n.fillStyle="#0f172a",n.textBaseline="middle";const Ve=R.flightDate instanceof Date?R.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():R.flightDate;n.textAlign="left",n.font="900 26px Arial, sans-serif",n.fillText(Ve,N+20,ne+P/2-5);const Be=N+te*.35,ce=x[R.airlineId];if(ce&&ce.width>0){const re=Math.min(100,ce.width),De=40;n.drawImage(ce,Be-re/2,ne+P/2-5-De/2,re,De)}else{n.font="700 20px Arial, sans-serif",n.textAlign="center";const re=((ke=E[R.airlineId])==null?void 0:ke.name)||R.airlineId||"—";n.fillText(re,Be,ne+P/2-5)}let pe=R.flightTime||"—";if(pe.includes("-")){const re=pe.split("-");pe=`${re[0].trim()} - ${re[1].trim()}`}n.font="800 22px Arial, sans-serif",n.textAlign="center",n.fillText(pe,N+te*.65,ne+P/2-5);const Le=`₹${(R.finalRate||0).toLocaleString()}`;n.font="900 26px Arial, sans-serif",n.textAlign="right";const Je=n.measureText(Le).width,Te=N+te-20,Re=Je+40,Fe=50;n.fillStyle="#0f172a",Z(Te-Re,ne+P/2-5-Fe/2,Re,Fe,12),n.fill(),n.fillStyle="#ffffff",n.fillText(Le,Te-20,ne+P/2-5),n.globalAlpha=1}const Se=1e3+h.length*800+500;if(S>Se){const M=Math.min(1,(S-Se)/500);n.globalAlpha=M;const R=100,oe=p-R+20*(1-M);n.fillStyle="#ffffff",n.fillRect(0,p-R,i,R),n.fillRect(0,oe,i,R),n.fillStyle="#f1f5f9",n.fillRect(0,p-R,i,2),u.complete&&u.width>0&&n.drawImage(u,N,p-R/2-24,48,48),n.fillStyle="#1e293b",n.font="900 24px Arial, sans-serif",n.textAlign="left",n.textBaseline="middle",n.fillText("Zamra Travels",N+64,p-R/2),n.font="700 20px Arial, sans-serif",n.textAlign="right",n.fillText("zamratravels.com  |  +91 98765 43210",i-N,p-R/2),n.globalAlpha=1}requestAnimationFrame(Q)},i,p;if(e==="1x1")i=1080,p=1080;else if(e==="9x16")i=1080,p=1920;else if(e==="16x9")i=1920,p=1080;else throw new Error("Invalid ratio selected");const g=document.createElement("canvas");g.width=i,g.height=p;const n=g.getContext("2d");n.imageSmoothingEnabled=!0;const m=r.find(b=>b.id===o),l=m?(m.sectorFrom||"DEP").toUpperCase():"DEP",f=m?(m.sectorTo||"ARR").toUpperCase():"ARR",h=[...t].sort((b,S)=>{let k=b.flightDate,y=S.flightDate;return k instanceof Date&&(k=k.getTime()),y instanceof Date&&(y=y.getTime()),k-y}).slice(0,10),E={};a.forEach(b=>{b.id&&(E[b.id]=b),b.code&&(E[b.code]=b),b.name&&(E[b.name]=b)});async function $(b){if(!b)return null;try{const S=await fetch(b);if(!S.ok)return null;const k=await S.blob(),y=URL.createObjectURL(k);return new Promise((I,_)=>{const j=new Image;j.onload=()=>I(j),j.onerror=()=>I(null),j.src=y})}catch{return null}}const C=new Image;await new Promise(b=>{C.onload=b,C.onerror=b,C.src="/assets/img/hero-bg.webp"});const u=new Image;await new Promise(b=>{u.onload=b,u.onerror=b,u.src="/assets/img/logo.webp"});const x={},v=[...new Set(h.map(b=>b.airlineId))].map(b=>E[b]).filter(b=>b==null?void 0:b.logoUrl);await Promise.all(v.map(async b=>{const S=await $(b.logoUrl);S&&(x[b.id]=S)}));const L=g.captureStream(30);let F="video/mp4";MediaRecorder.isTypeSupported(F)||(F="video/webm; codecs=h264",MediaRecorder.isTypeSupported(F)||(F="video/webm"));const U=new MediaRecorder(L,{mimeType:F}),q=[];U.ondataavailable=b=>{b.data&&b.data.size>0&&q.push(b.data)},U.start(100);const G=1e4+h.length*1500,O=performance.now();requestAnimationFrame(Q),U.onstop=()=>{const b=new Blob(q,{type:F}),S=URL.createObjectURL(b),k=document.createElement("a");k.href=S,k.download=`zamra-video-${e}-${Date.now()}.mp4`,k.style.display="none",document.body.appendChild(k),k.click(),setTimeout(()=>{document.body.removeChild(k),URL.revokeObjectURL(S)},100),window.toast&&window.toast("success","Video Generated",`Your ${e} video has been downloaded!`),d()},U.onerror=b=>{console.error("Recorder Error:",b),window.toast&&window.toast("error","Generation Error","Failed to encode the video stream."),c(b)}}catch(i){console.error(i),window.toast&&window.toast("error","Generation Failed",i.message),c(i)}})}let H=[],T=[],D=[],B=[],V={agents:{key:"id",asc:!0},sectors:{key:"id",asc:!0},airlines:{key:"name",asc:!0},reportFares:{key:"flightDate",asc:!0}},me={sectors:"",airlines:""},ae={agents:10,sectors:10,airlines:10,reportFares:20},A={agents:1,sectors:1,airlines:1,reportFares:1};function Ce(e,t){var d;let o=e;const r=(d=me[t])==null?void 0:d.toLowerCase();r&&t==="agents"?o=o.filter(c=>(c.name||"").toLowerCase().includes(r)||(c.email||"").toLowerCase().includes(r)||(c.contactPhone||"").toLowerCase().includes(r)||(c.id||"").toLowerCase().includes(r)):r&&t==="sectors"?o=o.filter(c=>(c.sectorFrom||"").toLowerCase().includes(r)||(c.sectorTo||"").toLowerCase().includes(r)||(c.sectorCode||"").toLowerCase().includes(r)):r&&t==="airlines"&&(o=o.filter(c=>(c.name||"").toLowerCase().includes(r)||(c.code||"").toLowerCase().includes(r)));const{key:a,asc:s}=V[t];return a&&(o=[...o].sort((c,i)=>{let p=c[a],g=i[a];if(p instanceof Date&&(p=p.getTime()),g instanceof Date&&(g=g.getTime()),a==="id"){const n=parseInt(p),m=parseInt(g);if(!isNaN(n)&&!isNaN(m))return s?n-m:m-n}return typeof p=="string"&&(p=p.toLowerCase()),typeof g=="string"&&(g=g.toLowerCase()),p<g?s?-1:1:p>g?s?1:-1:0})),o}function fe(e){document.querySelectorAll(`th[data-sort-tab="${e}"] i`).forEach(o=>{o.className="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"});const t=document.querySelector(`th[data-sort-tab="${e}"][data-sort-key="${V[e].key}"]`);if(t){const o=t.querySelector("i");o&&(o.className=`bi bi-arrow-${V[e].asc?"up":"down"} opacity-100 ml-1 text-[11px] text-primary`)}}document.addEventListener("click",e=>{const t=e.target.closest("th[data-sort-tab]");if(!t)return;const o=t.dataset.sortTab,r=t.dataset.sortKey;V[o].key===r?V[o].asc=!V[o].asc:(V[o].key=r,V[o].asc=!0),o==="agents"?J(!1):o==="sectors"?Y(!1):o==="airlines"?se(!1):o==="reportFares"&&B.length&&ee(B)});document.documentElement.style.visibility="hidden";Ye(async e=>{if(!e){window.location.href="/login.html";return}document.documentElement.style.visibility="visible";const t=document.getElementById("admin-user-name");t&&(t.textContent=e.email.split("@")[0]),await gt(),Dt(),await je()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("admin-logout-btn");e&&e.addEventListener("click",async()=>{(await Ke()).success&&(window.location.href="/login.html")}),mt(),ut(),Ft()});async function gt(){try{[H,T,D]=await Promise.all([Ue(),Ee(),$e()])}catch(e){console.error("loadGlobalData error:",e)}}function ut(){const e=document.querySelectorAll(".nav-link"),t=document.querySelectorAll(".tab-content"),o=document.getElementById("page-title");e.forEach(r=>{r.addEventListener("click",async a=>{var c;a.preventDefault(),e.forEach(i=>{i.classList.remove("active","text-primary"),i.classList.add("text-gray-500")}),r.classList.remove("text-gray-500"),r.classList.add("active","text-primary");const s=r.getAttribute("data-tab"),d=r.getAttribute("data-title");t.forEach(i=>i.classList.remove("active")),(c=document.getElementById(s))==null||c.classList.add("active"),o&&d&&(o.textContent=d),await je()})})}async function je(){const e=document.querySelector(".tab-content.active");if(!e)return;const t=e.id;t==="agents-tab"?await J():t==="sectors-tab"?await Y():t==="flights-tab"?await se():t==="dashboard-tab"?await ft():t==="reports-tab"?await It():t==="eticket-tab"&&await Ut()}function mt(){const e=document.getElementById("admin-modal"),t=document.getElementById("modal-close-btn");t&&t.addEventListener("click",()=>e.close()),e==null||e.addEventListener("click",o=>{o.target===e&&e.close()})}function be(e,t){const o=document.getElementById("admin-modal");document.getElementById("modal-title").textContent=e,document.getElementById("modal-body").innerHTML=t,o.showModal()}async function ft(){var r,a,s,d,c;if(!document.getElementById("dashboard-tab"))return;const t=document.getElementById("poster-sector-sel");t&&t.options.length<=1&&T.forEach(i=>{const p=new Option(i.sectorCode,i.id);t.appendChild(p)});const o=document.getElementById("poster-generate-btn");o&&!o.dataset.wired&&(o.dataset.wired="1",o.addEventListener("click",async()=>{const i=document.getElementById("poster-start-date"),p=document.getElementById("poster-end-date"),g=t==null?void 0:t.value,n=(i==null?void 0:i.value)||null,m=(p==null?void 0:p.value)||null;if(!g){w("warning","Validation Error","Please select a sector to generate the poster.");return}o.disabled=!0,o.textContent="Generating…";try{const l=await we({sectorId:g,startDate:n,endDate:m,includeHidden:!1});if(!l||!l.length){w("warning","No Fares","No live fares found for the selected sector and dates."),document.getElementById("poster-preview-container").classList.add("hidden");return}await bt(l,g)}catch(l){w("error","Generation Failed",l.message)}finally{o.disabled=!1,o.textContent="Generate Poster"}}),(r=document.getElementById("poster-download-jpg"))==null||r.addEventListener("click",()=>Me("jpeg")),(a=document.getElementById("poster-download-pdf"))==null||a.addEventListener("click",()=>Me("pdf")),(s=document.getElementById("poster-download-vid-1x1"))==null||s.addEventListener("click",()=>ye("1x1")),(d=document.getElementById("poster-download-vid-9x16"))==null||d.addEventListener("click",()=>ye("9x16")),(c=document.getElementById("poster-download-vid-16x9"))==null||c.addEventListener("click",()=>ye("16x9")))}async function ye(e){const t=document.getElementById("poster-sector-sel"),o=document.getElementById("poster-start-date"),r=document.getElementById("poster-end-date"),a=t==null?void 0:t.value,s=(o==null?void 0:o.value)||null,d=(r==null?void 0:r.value)||null;if(!a){w("warning","Validation Error","Please select a sector to generate the poster.");return}try{const c=await we({sectorId:a,startDate:s,endDate:d,includeHidden:!1});if(!c||!c.length){w("warning","No Fares","No live fares found for the selected sector and dates.");return}await pt(e,c,a,T,D)}catch(c){console.error("Video generation failed",c)}}async function bt(e,t){const o=document.getElementById("poster-preview-container"),r=document.getElementById("poster-fares-tbody"),a=document.getElementById("poster-sector-title");if(!o||!r||!a)return;const s=T.find(l=>l.id===t),d=s?(s.sectorFrom||"DEP").toUpperCase():"DEP",c=s?(s.sectorTo||"ARR").toUpperCase():"ARR";a.innerHTML=`${d} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${c}`;const i=[...e].sort((l,f)=>{let h=l.flightDate,E=f.flightDate;return h instanceof Date&&(h=h.getTime()),E instanceof Date&&(E=E.getTime()),h-E}).slice(0,10),p={};D.forEach(l=>{l.id&&(p[l.id]=l),l.code&&(p[l.code]=l),l.name&&(p[l.name]=l)});async function g(l){try{const f=await fetch(l);if(!f.ok)return null;const h=await f.blob();return URL.createObjectURL(h)}catch{return null}}const n=[...new Set(i.map(l=>l.airlineId))].map(l=>p[l]).filter(l=>l==null?void 0:l.logoUrl),m={};await Promise.all(n.map(async l=>{const f=await g(l.logoUrl);f&&(m[l.id]=f)})),r.innerHTML=i.map((l,f)=>{const h=l.flightDate instanceof Date?l.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}).toUpperCase():l.flightDate,E=p[l.airlineId],$=f%2===0?"#ffffff":"#f8fafc",C=m[l.airlineId]||null,u=C?`<img src="${C}" style="height:40px;max-width:100px;object-fit:contain;display:block;margin:0 auto;" alt="${(E==null?void 0:E.name)||""}">`:`<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:15px;white-space:nowrap;">${(E==null?void 0:E.name)||l.airlineId||"—"}</span>`;let x='<span style="color:#94a3b8;font-size:14px;">—</span>';if(l.flightTime){const v=l.flightTime.split("-").map(L=>L.trim());v.length>=2?x=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${v[0]} - ${v[1]}</span>`:x=`<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${l.flightTime}</span>`}return`
      <tr style="background-color:${$};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 12px;font-weight:900;color:#0f172a;font-size:22px;white-space:nowrap;">${h}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${u}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${x}</td>
        <td style="padding:16px 12px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:8px 18px;border-radius:12px;font-weight:900;font-size:22px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            &#8377;${(l.finalRate||0).toLocaleString()}
          </div>
        </td>
      </tr>`}).join(""),o.classList.remove("hidden"),o.classList.add("flex")}function Pe(e){if(!e||e.nodeType!==1)return;const t=window.getComputedStyle(e),o=["color","backgroundColor","borderTopColor","borderBottomColor","borderLeftColor","borderRightColor","outlineColor"];for(const r of o){const a=t.getPropertyValue(r);if(a&&!a.startsWith("rgb")&&!a.startsWith("#")&&a!=="transparent"&&a!=="initial")try{e.style[r]=a}catch{}}for(const r of e.children)Pe(r)}async function Me(e){const t=document.getElementById("poster-render-frame");if(!t)return;const o=document.getElementById("poster-download-jpg"),r=document.getElementById("poster-download-pdf");o&&(o.disabled=!0),r&&(r.disabled=!0);const a=t.style.transform;t.style.transform="none",w("info","Generating Export","Please wait while we render your poster…");try{await Promise.all(Array.from(t.querySelectorAll("img")).map(c=>c.complete?Promise.resolve():new Promise(i=>{c.onload=i,c.onerror=i})));const s=await html2canvas(t,{scale:2,useCORS:!1,allowTaint:!0,backgroundColor:"#ffffff",logging:!1,onclone:c=>{const i=c.getElementById("poster-render-frame");i&&Pe(i)}});t.style.transform=a;const d=s.toDataURL("image/jpeg",.95);if(e==="jpeg"){const c=document.createElement("a");c.download=`zamra-poster-${Date.now()}.jpg`,c.href=d,c.click(),w("success","Downloaded!","JPEG poster saved successfully.")}else if(e==="pdf"){const c=window.jspdf&&window.jspdf.jsPDF||window.jsPDF||window.jspdf;if(!c)throw new Error("jsPDF library not loaded.");const i=96/25.4,p=s.width/2/i,g=s.height/2/i,n=new c({orientation:p>g?"landscape":"portrait",unit:"mm",format:[p,g]});n.addImage(d,"JPEG",0,0,p,g),n.save(`zamra-poster-${Date.now()}.pdf`),w("success","Downloaded!","PDF poster saved successfully.")}}catch(s){console.error("Poster export error:",s),t.style.transform=a,w("error","Export Failed",s.message||"There was an error generating the export.")}finally{o&&(o.disabled=!1),r&&(r.disabled=!1)}}function ee(e){const t=document.getElementById("report-fares-results");if(!t)return;if(!e||!e.length){t.innerHTML=`<div class="text-center text-text-muted py-14 px-4">
      <div class="inline-flex flex-col items-center gap-3 opacity-50">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <i class="bi bi-inbox text-3xl text-slate-400"></i>
        </div>
        <p class="font-semibold text-[14px]">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;return}const o=Object.fromEntries(H.map(l=>[l.id,l.name])),r=Object.fromEntries(T.map(l=>[l.id,l.sectorCode])),a=Object.fromEntries(D.map(l=>[l.id,l.code])),{key:s,asc:d}=V.reportFares,c=[...e].sort((l,f)=>{let h=l[s],E=f[s];return h instanceof Date&&(h=h.getTime()),E instanceof Date&&(E=E.getTime()),typeof h=="string"&&(h=h.toLowerCase()),typeof E=="string"&&(E=E.toLowerCase()),h<E?d?-1:1:h>E?d?1:-1:0}),i=ae.reportFares,p=Math.max(1,Math.ceil(e.length/i));A.reportFares>p&&(A.reportFares=p);const g=(A.reportFares-1)*i,n=c.slice(g,g+i),m=(l,f)=>`<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${l}">${f} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;t.innerHTML=`
    <div class="admin-table-container overflow-x-auto w-full rounded-none border-0 shadow-none">
      <table class="admin-table w-full text-sm">
        <thead><tr>
          ${m("flightDate","Date")}
          ${m("flightTime","Time")}
          ${m("sectorId","Sector")}
          ${m("airlineId","Airline")}
          ${m("agentId","Agent")}
          ${m("specialRate","SP Rate (₹)")}
          ${m("finalRate","Rate (₹)")}
          ${m("commission","Comm (₹)")}
          ${m("baggage","Bag")}
          ${m("extraBaggage","Ex.Bag")}
          ${m("isHidden","Status")}
          <th class="whitespace-nowrap">Actions</th>
        </tr></thead>
        <tbody>
          ${n.map((l,f)=>{const h=l.flightDate instanceof Date?l.flightDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):l.flightDate||"—";return`<tr class="${f%2===1?"bg-slate-50/60":""} hover:bg-blue-50/40 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${h}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${l.flightTime||"—"}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${r[l.sectorId]||l.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${a[l.airlineId]||l.airlineId}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${o[l.agentId]||l.agentId}</td>
              <td class="whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-text-muted text-[13px] mr-0.5">₹</span>
                  <input type="number" 
                    value="${l.specialRate||0}"
                    onblur="window.__updateFareRate('${l.id}', 'specialRate', this.value)"
                    class="bg-transparent border border-transparent hover:border-slate-200 focus:border-primary/50 focus:bg-white rounded px-1 text-[13px] text-text-muted outline-none w-20 transition-colors shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-navy font-black text-[14px] mr-0.5">₹</span>
                  <input type="number" 
                    value="${l.finalRate||0}"
                    onblur="window.__updateFareRate('${l.id}', 'finalRate', this.value)"
                    class="bg-transparent border border-transparent hover:border-slate-200 focus:border-primary/50 focus:bg-white rounded px-1 font-black text-navy text-[14px] outline-none w-20 transition-colors shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </td>
              <td class="whitespace-nowrap text-[12px] text-text-muted" id="comm-${l.id}">₹${(l.commission||0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px]">${l.baggage?l.baggage+" kg":"—"}</td>
              <td class="whitespace-nowrap text-[12px]">${l.extraBaggage?l.extraBaggage+" kg":"—"}</td>
              <td class="whitespace-nowrap">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${l.isHidden?"bg-red-100 text-red-600":"bg-green-100 text-green-700"}">
                  ${l.isHidden?"● Hidden":"● Live"}
                </span>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  <button onclick="window.__openEditFareModal('${l.id}')"
                    class="bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-blue-500 hover:text-white transition-colors">Edit</button>
                  <button onclick="window.__toggleFare('${l.id}', ${!l.isHidden})"
                    class="${l.isHidden?"bg-green-50 text-green-700 border-green-200 hover:bg-green-500":"bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-500"} border px-2.5 py-1 rounded-lg text-[11px] font-bold hover:text-white transition-colors">
                    ${l.isHidden?"Show":"Hide"}
                  </button>
                  <button onclick="window.__deleteFare('${l.id}')"
                    class="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-red-500 hover:text-white transition-colors">Del</button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`,xe("reportFares",e.length,p,g,i),window.__deleteFare=async l=>{if(confirm("Delete this fare?"))try{await Xe(l),B=B.filter(f=>f.id!==l),w("success","Deleted","Fare removed."),ee(B)}catch(f){w("error","Error",f.message)}},window.__toggleFare=async(l,f)=>{try{await he(l,{isHidden:f}),B=B.map(h=>h.id===l?{...h,isHidden:f}:h),w("success","Updated",`Fare ${f?"hidden":"shown"}.`),ee(B)}catch(h){w("error","Error",h.message)}},window.__updateFareRate=async(l,f,h)=>{const E=parseFloat(h)||0,$=B.find(C=>C.id===l);if(!(!$||$[f]===E))try{const C={[f]:E};f==="specialRate"?(C.commission=Math.max(0,$.finalRate-E),$.commission=C.commission):f==="finalRate"&&(C.commission=Math.max(0,E-$.specialRate),$.commission=C.commission),await he(l,C),$[f]=E,w("success","Rate Updated","Fare successfully updated."),ee(B)}catch(C){w("error","Update Failed",C.message),ee(B)}},fe("reportFares"),window.__openEditFareModal=l=>{const f=B.find($=>$.id===l);if(!f)return;let h="";if(f.flightDate instanceof Date){const $=f.flightDate.getTimezoneOffset();h=new Date(f.flightDate.getTime()-$*60*1e3).toISOString().split("T")[0]}else typeof f.flightDate=="string"&&(h=f.flightDate.split("T")[0]);const E=`
      <form id="edit-fare-form" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Date</label>
            <input type="date" id="ef-date" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${h}" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Time</label>
            <input type="text" id="ef-time" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. 04:05 - 11:10" value="${f.flightTime||""}">
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Sector</label>
            <select id="ef-sector" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required>
              ${T.map($=>`<option value="${$.id}" ${$.id===f.sectorId?"selected":""}>${$.sectorCode}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Airline</label>
            <select id="ef-airline" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required>
              <option value="">-- None --</option>
              ${D.map($=>`<option value="${$.id}" ${$.id===f.airlineId?"selected":""}>${$.code}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Agent</label>
            <select id="ef-agent" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required>
              <option value="">-- None --</option>
              ${H.map($=>`<option value="${$.id}" ${$.id===f.agentId?"selected":""}>${$.name}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">SP Rate (₹)</label>
            <input type="number" id="ef-sprate" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${f.specialRate||0}" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Final Rate (₹)</label>
            <input type="number" id="ef-finalrate" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${f.finalRate||0}" required>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Baggage (kg)</label>
            <input type="number" id="ef-bag" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${f.baggage||0}">
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Ex. Baggage (kg)</label>
            <input type="number" id="ef-exbag" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${f.extraBaggage||0}">
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Status</label>
            <select id="ef-status" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
              <option value="live" ${f.isHidden?"":"selected"}>Live</option>
              <option value="hidden" ${f.isHidden?"selected":""}>Hidden</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onclick="document.getElementById('admin-modal').close()" class="px-5 py-2.5 rounded-xl font-bold text-sm text-text-muted bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg shadow-primary/20">Save Changes</button>
        </div>
      </form>
    `;be("Edit Fare",E),document.getElementById("edit-fare-form").onsubmit=async $=>{$.preventDefault();const C=$.target.querySelector('button[type="submit"]'),u=C.textContent;C.disabled=!0,C.textContent="Saving...";try{let x=document.getElementById("ef-date").value;const v={flightDate:x?new Date(x+"T00:00:00"):null,flightTime:document.getElementById("ef-time").value.trim(),sectorId:document.getElementById("ef-sector").value,airlineId:document.getElementById("ef-airline").value,agentId:document.getElementById("ef-agent").value,specialRate:parseFloat(document.getElementById("ef-sprate").value)||0,finalRate:parseFloat(document.getElementById("ef-finalrate").value)||0,baggage:parseFloat(document.getElementById("ef-bag").value)||0,extraBaggage:parseFloat(document.getElementById("ef-exbag").value)||0,isHidden:document.getElementById("ef-status").value==="hidden"};v.commission=Math.max(0,v.finalRate-v.specialRate),await he(l,v);const L=B.findIndex(F=>F.id===l);L!==-1&&(B[L]={...B[L],...v}),document.getElementById("admin-modal").close(),w("success","Updated","Fare updated successfully."),ee(B)}catch(x){w("error","Error",x.message),C.disabled=!1,C.textContent=u}}}}async function J(e=!0){e&&(H=await Ue(),A.agents=1);const t=document.querySelector("#agents-tab .admin-table tbody");if(!t)return;const o=document.getElementById("agents-search"),r=document.getElementById("agents-limit");o&&!o.dataset.wired&&(o.dataset.wired="1",r&&(r.dataset.wired="1"),o.addEventListener("input",g=>{me.agents=g.target.value,A.agents=1,J(!1)}),r&&r.addEventListener("change",g=>{ae.agents=parseInt(g.target.value),A.agents=1,J(!1)}));const a=Ce(H,"agents"),s=ae.agents,d=Math.max(1,Math.ceil(a.length/s));A.agents>d&&(A.agents=d);const c=(A.agents-1)*s,i=a.slice(c,c+s);t.innerHTML=i.length?i.map(g=>xt(g)).join(""):'<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>',xe("agents",a.length,d,c,s),delete t.dataset.actionsWired,ht(),yt(),vt();const p=document.getElementById("agents-add-btn");p&&!p.dataset.wired&&(p.dataset.wired="1",p.addEventListener("click",()=>Oe(null))),fe("agents")}function xt(e){const t=e.isActive!==!1?'<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700">Active</span>':'<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-600">Hidden</span>',o=e.commission!==void 0?`₹${Number(e.commission).toLocaleString()}`:"—";return`<tr data-agent-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id.slice(0,8)}…</td>
    <td class="font-semibold">${e.name}</td>
    <td>${e.email||"—"}</td>
    <td>${e.contactPhone||"—"}</td>
    <td class="font-semibold text-navy">${o}</td>
    <td>${t}</td>
    <td class="flex gap-1 flex-wrap">
      <button data-action="edit-agent" data-id="${e.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-agent" data-id="${e.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
      <button data-action="toggle-agent" data-id="${e.id}" data-active="${e.isActive!==!1}"
        class="px-3 py-1 rounded text-[12px] font-bold ${e.isActive!==!1?"bg-slate-400 text-white hover:bg-slate-500":"bg-green-500 text-white hover:bg-green-600"}">
        ${e.isActive!==!1?"Hide Fares":"Show Fares"}</button>
    </td>
  </tr>`}function ht(){const e=document.querySelector("#agents-tab .admin-table tbody");!e||e.dataset.actionsWired||(e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const o=t.target.closest("[data-action]");if(!o)return;const r=o.dataset.action,a=o.dataset.id,s=H.find(d=>d.id===a);if(r==="edit-agent"&&Oe(s),r==="delete-agent"){if(!confirm(`Delete agent "${s==null?void 0:s.name}"? This does NOT delete their fares.`))return;try{await Ze(a),w("success","Deleted",`Agent "${s==null?void 0:s.name}" removed.`),await J()}catch(d){w("error","Error",d.message)}}if(r==="toggle-agent"){const c=!(o.dataset.active==="true");o.disabled=!0,o.textContent="Working…";try{const i=await Qe(a,c);w("success",c?"Agent Shown":"Agent Hidden",i.message),await J()}catch(i){w("error","Toggle Failed",i.message),await J()}}}))}function xe(e,t,o,r,a){const s=document.getElementById(`${e}-pagination-footer`);if(!s)return;const d=Math.min(r+a,t),c=A[e];s.innerHTML=`
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${t?r+1:0} to ${d} of ${t} entries</span>
      <div class="flex items-center gap-1 ml-4 shadow-[var(--shadow-premium-soft)] rounded">
        <button data-pg-action="prev" class="px-3 py-1.5 border border-border rounded-l bg-white text-sm font-semibold hover:bg-slate-50 hover:text-navy disabled:opacity-40 premium-transition" ${c<=1?"disabled":""}>Previous</button>
        ${Array.from({length:o},(i,p)=>p+1).map(i=>`<button data-pg-action="goto" data-pg="${i}" class="px-3 py-1.5 border-y border-r border-border text-sm font-bold bg-white premium-transition ${i===c?"text-primary bg-primary-light shadow-inner border-primary/20 relative z-10":"text-text-mid hover:bg-slate-50 hover:text-navy"}">${i}</button>`).join("")}
        <button data-pg-action="next" class="px-3 py-1.5 border-y border-r border-border rounded-r bg-white text-sm font-semibold hover:bg-slate-50 hover:text-navy disabled:opacity-40 premium-transition" ${c>=o?"disabled":""}>Next</button>
      </div>
    </div>`,s.dataset.wired||(s.dataset.wired="1",s.addEventListener("click",i=>{const p=i.target.closest("[data-pg-action]");if(!p||p.disabled)return;const g=p.dataset.pgAction;g==="prev"?A[e]=Math.max(1,A[e]-1):g==="next"?A[e]++:g==="goto"&&(A[e]=parseInt(p.dataset.pg)),e==="agents"?J(!1):e==="sectors"?Y(!1):e==="airlines"?se(!1):e==="reportFares"&&ee(B)}))}function Oe(e){var o,r;const t=!!e;be(t?"Edit Agent":"Add New Agent",`
    <form id="agent-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Agent ID *</label>
        <input name="id" required value="${(e==null?void 0:e.id)||""}" placeholder="e.g. AGENT1"
          ${t?'readonly class="w-full bg-slate-100 border border-border rounded-lg h-11 px-3 text-sm focus:outline-none cursor-not-allowed text-slate-500"':'class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"'}>
        ${t?'<p class="text-[11px] text-text-soft mt-1">Agent ID cannot be changed after creation.</p>':""}
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Name *</label>
        <input name="name" required value="${(e==null?void 0:e.name)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Email</label>
        <input name="email" type="email" value="${(e==null?void 0:e.email)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Phone</label>
        <input name="contactPhone" value="${(e==null?void 0:e.contactPhone)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Commission (₹) *</label>
        <input name="commission" type="number" min="0" required value="${(e==null?void 0:e.commission)!==void 0?e.commission:500}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          placeholder="e.g. 500">
        <p class="text-[11px] text-text-soft mt-1">This commission is auto-applied to all fares ingested for this agent.</p>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit"
          class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 transition-all text-sm">
          ${t?"Save Changes":"Add Agent"}
        </button>
        <button type="button" id="modal-cancel"
          class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`),(o=document.getElementById("modal-cancel"))==null||o.addEventListener("click",()=>document.getElementById("admin-modal").close()),(r=document.getElementById("agent-form"))==null||r.addEventListener("submit",async a=>{a.preventDefault();const s=new FormData(a.target),d=Object.fromEntries(s.entries()),c=a.target.querySelector("[type=submit]");c.disabled=!0,c.textContent="Saving…";try{t?(await et(e.id,d),w("success","Updated",`Agent "${d.name}" updated.`)):(await tt(d),w("success","Added",`Agent "${d.name}" added.`)),document.getElementById("admin-modal").close(),await J()}catch(i){w("error","Save Failed",i.message),c.disabled=!1,c.textContent=t?"Save Changes":"Add Agent"}})}function yt(){const e=document.getElementById("agents-bulk-delete-btn");!e||e.dataset.wired||(e.dataset.wired="1",e.addEventListener("click",async()=>{const t=document.getElementById("agents-bulk-agent-sel"),o=document.getElementById("agents-bulk-sector-sel"),r=document.getElementById("agents-bulk-start"),a=document.getElementById("agents-bulk-end"),s=(t==null?void 0:t.value)||null,d=(o==null?void 0:o.value)||null,c=(r==null?void 0:r.value)||null,i=(a==null?void 0:a.value)||null;if(!(s&&s!=="all"||d&&d!=="all"||c||i)){w("warning","No Filter","Select at least an agent, a sector, or a date range before deleting.");return}const g=[];if(s&&s!=="all"&&g.push(`Agent: ${t.options[t.selectedIndex].text}`),d&&d!=="all"&&g.push(`Sector: ${o.options[o.selectedIndex].text}`),c&&g.push(`from ${c}`),i&&g.push(`to ${i}`),!!confirm(`Delete ALL matching fares?
${g.join(" · ")}

This cannot be undone.`)){e.disabled=!0,e.textContent="Deleting…";try{const n=await ot(s,c,i,d);w("success","Bulk Delete Complete",n.message)}catch(n){w("error","Bulk Delete Failed",n.message)}finally{e.disabled=!1,e.textContent="Bulk Delete"}}}))}function vt(){const e=document.getElementById("agents-bulk-agent-sel");if(e){const o=e.value;e.innerHTML='<option value="">All Agents</option>',H.forEach(r=>e.appendChild(new Option(r.name,r.id))),o&&(e.value=o)}const t=document.getElementById("agents-bulk-sector-sel");if(t){const o=t.value;t.innerHTML='<option value="">All Sectors</option>',T.forEach(r=>t.appendChild(new Option(r.sectorCode,r.id))),o&&(t.value=o)}}async function Y(e=!0){e&&(T=await Ee(),A.sectors=1);const t=document.getElementById("sectors-search"),o=document.getElementById("sectors-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",o.dataset.wired="1",t.addEventListener("input",g=>{me.sectors=g.target.value,A.sectors=1,Y(!1)}),o.addEventListener("change",g=>{ae.sectors=parseInt(g.target.value),A.sectors=1,Y(!1)}));const r=document.querySelector("#sectors-tab .admin-table tbody");if(!r)return;const a=Ce(T,"sectors"),s=ae.sectors,d=Math.max(1,Math.ceil(a.length/s));A.sectors>d&&(A.sectors=d);const c=(A.sectors-1)*s,i=a.slice(c,c+s);r.innerHTML=i.length?i.map(g=>wt(g)).join(""):'<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>',xe("sectors",a.length,d,c,s),Et();const p=document.querySelector("#sectors-tab .flex.justify-between button");p&&!p.dataset.wired&&(p.dataset.wired="1",p.addEventListener("click",()=>qe(null))),fe("sectors")}function wt(e){return`<tr data-sector-id="${e.id}">
    <td class="font-mono text-xs text-text-muted">${e.id.slice(0,8)}…</td>
    <td class="font-semibold">${e.sectorFrom}</td>
    <td class="font-semibold">${e.sectorTo}</td>
    <td><span class="font-mono font-bold text-primary">${e.sectorCode}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-sector" data-id="${e.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-sector" data-id="${e.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
      <button data-action="toggle-sector" data-id="${e.id}" data-hidden="${e.isHidden===!0}"
        class="px-3 py-1 rounded text-[12px] font-bold ${e.isHidden===!0?"bg-green-500 text-white hover:bg-green-600":"bg-slate-400 text-white hover:bg-slate-500"}">
        ${e.isHidden===!0?"Show Fares":"Hide Fares"}</button>
    </td>
  </tr>`}function Et(){const e=document.querySelector("#sectors-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const o=t.target.closest("[data-action]");if(!o)return;const{action:r,id:a}=o.dataset,s=T.find(d=>d.id===a);if(r==="edit-sector"&&qe(s),r==="delete-sector"){if(!confirm(`Delete sector "${s==null?void 0:s.sectorCode}"?`))return;try{await nt(a),w("success","Deleted",`Sector "${s==null?void 0:s.sectorCode}" removed.`),await Y()}catch(d){w("error","Error",d.message)}}if(r==="toggle-sector"){const c=!(o.dataset.hidden==="true");o.disabled=!0,o.textContent="Working…";try{const i=await rt(a,c);w("success",`Sector Fares ${c?"Hidden":"Shown"}`,i.message),await Y()}catch(i){w("error","Toggle Failed",i.message),await Y()}}}))}function qe(e){var o,r;const t=!!e;be(t?"Edit Sector":"Add New Sector",`
    <form id="sector-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">From City *</label>
        <input name="sectorFrom" required placeholder="e.g. Kozhikode" value="${(e==null?void 0:e.sectorFrom)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">To City *</label>
        <input name="sectorTo" required placeholder="e.g. Jeddah" value="${(e==null?void 0:e.sectorTo)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Sector Code *</label>
        <input name="sectorCode" required placeholder="e.g. CCJ JED" value="${(e==null?void 0:e.sectorCode)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono tracking-wide">
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 text-sm">
          ${t?"Save Changes":"Add Sector"}
        </button>
        <button type="button" id="modal-cancel" class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`),(o=document.getElementById("modal-cancel"))==null||o.addEventListener("click",()=>document.getElementById("admin-modal").close()),(r=document.getElementById("sector-form"))==null||r.addEventListener("submit",async a=>{a.preventDefault();const s=new FormData(a.target),d=Object.fromEntries(s.entries());d.sectorCode=d.sectorCode.toUpperCase(),d.sectorFrom=d.sectorFrom.toUpperCase(),d.sectorTo=d.sectorTo.toUpperCase();const c=a.target.querySelector("[type=submit]");c.disabled=!0,c.textContent="Saving…";try{t?(await at(e.id,d),w("success","Updated","Sector updated.")):(await st(d),w("success","Added",`Sector "${d.sectorCode}" added.`)),document.getElementById("admin-modal").close(),await Y()}catch(i){w("error","Save Failed",i.message),c.disabled=!1,c.textContent=t?"Save Changes":"Add Sector"}})}async function se(e=!0){e&&(D=await $e(),A.airlines=1);const t=document.getElementById("airlines-search"),o=document.getElementById("airlines-limit");t&&!t.dataset.wired&&(t.dataset.wired="1",o.dataset.wired="1",t.addEventListener("input",g=>{me.airlines=g.target.value,A.airlines=1,se(!1)}),o.addEventListener("change",g=>{ae.airlines=parseInt(g.target.value),A.airlines=1,se(!1)}));const r=document.querySelector("#flights-tab .admin-table tbody");if(!r)return;const a=Ce(D,"airlines"),s=ae.airlines,d=Math.max(1,Math.ceil(a.length/s));A.airlines>d&&(A.airlines=d);const c=(A.airlines-1)*s,i=a.slice(c,c+s);r.innerHTML=i.length?i.map(g=>$t(g)).join(""):'<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "+ Add Flight".</td></tr>',xe("airlines",a.length,d,c,s),Ct();const p=document.querySelector("#flights-tab .flex.justify-between button");p&&!p.dataset.wired&&(p.dataset.wired="1",p.addEventListener("click",()=>_e(null))),fe("airlines")}function $t(e){const t=e.logoUrl?`<img src="${e.logoUrl}" class="h-7 w-7 object-contain rounded" alt="${e.name}">`:`<span class="w-7 h-7 bg-primary-light text-primary text-xs font-bold rounded flex items-center justify-center">${e.code}</span>`;return`<tr data-airline-id="${e.id}">
    <td>${t}</td>
    <td class="font-semibold">${e.name}</td>
    <td><span class="font-mono font-bold text-primary">${e.code}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-airline" data-id="${e.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-airline" data-id="${e.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
    </td>
  </tr>`}function Ct(){const e=document.querySelector("#flights-tab .admin-table tbody");e&&(delete e.dataset.actionsWired,e.dataset.actionsWired="1",e.addEventListener("click",async t=>{const o=t.target.closest("[data-action]");if(!o)return;const{action:r,id:a}=o.dataset,s=D.find(d=>d.id===a);if(r==="edit-airline"&&_e(s),r==="delete-airline"){if(!confirm(`Delete airline "${s==null?void 0:s.name}" (${s==null?void 0:s.code})?`))return;try{await it(a),w("success","Deleted",`Airline "${s==null?void 0:s.name}" removed.`),await se()}catch(d){w("error","Error",d.message)}}}))}function _e(e){var o,r;const t=!!e;be(t?"Edit Airline":"Add New Airline",`
    <form id="airline-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Airline Name *</label>
        <input name="name" required placeholder="e.g. Air India Express" value="${(e==null?void 0:e.name)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">IATA Code *</label>
        <input name="code" required maxlength="3" placeholder="e.g. IX" value="${(e==null?void 0:e.code)||""}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono tracking-widest uppercase">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Logo (optional)</label>
        <input type="file" name="logoFile" accept="image/*"
          class="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary cursor-pointer">
        ${e!=null&&e.logoUrl?`<img src="${e.logoUrl}" class="mt-2 h-8 object-contain rounded" alt="current logo">`:""}
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 text-sm">
          ${t?"Save Changes":"Add Airline"}
        </button>
        <button type="button" id="modal-cancel" class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`),(o=document.getElementById("modal-cancel"))==null||o.addEventListener("click",()=>document.getElementById("admin-modal").close()),(r=document.getElementById("airline-form"))==null||r.addEventListener("submit",async a=>{var p;a.preventDefault();const s=new FormData(a.target),d=((p=s.get("logoFile"))==null?void 0:p.size)>0?s.get("logoFile"):null,c={name:s.get("name"),code:s.get("code").toUpperCase()},i=a.target.querySelector("[type=submit]");i.disabled=!0,i.textContent="Saving…";try{t?(await lt(e.id,c,d),w("success","Updated","Airline updated.")):(await dt(c,d),w("success","Added",`Airline "${c.name}" added.`)),document.getElementById("admin-modal").close(),await se()}catch(g){w("error","Save Failed",g.message),i.disabled=!1,i.textContent=t?"Save Changes":"Add Airline"}})}async function It(){const e=document.getElementById("reports-tab");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=document.getElementById("reports-sector-sel");t&&t.options.length<=1&&T.forEach(d=>t.appendChild(new Option(d.sectorCode,d.id)));const o=document.getElementById("reports-agent-sel");o&&o.options.length<=1&&H.forEach(d=>o.appendChild(new Option(d.name,d.id)));const r=document.getElementById("generate-report-btn"),a=document.getElementById("reports-start-date"),s=document.getElementById("reports-end-date");r&&!r.dataset.wired&&(r.dataset.wired="1",r.addEventListener("click",async()=>{const d=(t==null?void 0:t.value)||"all",c=(o==null?void 0:o.value)||"all",i=(a==null?void 0:a.value)||null,p=(s==null?void 0:s.value)||null;if(d==="all"&&!i&&!p&&c==="all"){w("warning","No Filter Selected","Select at least a sector, an agent, or a date range.");return}r.disabled=!0,r.textContent="Generating…";try{const[g,n]=await Promise.all([ct(i,p,d,c),we({sectorId:d,agentId:c,startDate:i,endDate:p,includeHidden:!0})]);B=n,St(g,e),A.reportFares=1,ee(B)}catch(g){w("error","Report Failed",g.message)}finally{r.disabled=!1,r.innerHTML='<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report'}}))}function St(e,t){const{agentReport:o,sectorReport:r,totalFares:a}=e,s=document.getElementById("report-stats-row");if(s){s.classList.remove("hidden");const m=(B||[]).filter(u=>!u.isHidden).length,l=(B||[]).filter(u=>u.isHidden).length,f=new Set((B||[]).map(u=>u.agentId)).size,h=(B||[]).map(u=>u.finalRate||0).filter(u=>u>0),E=h.length?Math.round(h.reduce((u,x)=>u+x,0)/h.length):0,$=(u,x)=>{const v=document.getElementById(u);v&&(v.textContent=x.toLocaleString())};$("stat-total-fares",a),$("stat-live-fares",m),$("stat-hidden-fares",l),$("stat-agents-count",f);const C=document.getElementById("stat-avg-fare");C&&(C.textContent=E>0?`₹${E.toLocaleString()}`:"—")}const d=document.getElementById("report-total-fares");d&&(d.textContent=`${a} fare${a!==1?"s":""} matched your filter`);const c=document.getElementById("bar-chart-container");c&&o.length&&kt(o.slice(0,8),c);const i=document.getElementById("donut-chart-svg"),p=document.getElementById("pie-legend");i&&r.length&&At(r.slice(0,8),i,p);const g=document.getElementById("report-leaderboards");g&&(g.classList.remove("hidden"),Bt(o,r));const n=document.getElementById("download-report-csv");if(n){const m=n.cloneNode(!0);n.parentNode.replaceChild(m,n),m.addEventListener("click",()=>Lt(B)),B&&B.length?m.classList.remove("opacity-50","pointer-events-none"):m.classList.add("opacity-50","pointer-events-none")}w("success","Report Ready",`${a} fare${a!==1?"s":""} aggregated.`)}function kt(e,t){const o=t.clientWidth||480,r=260,a={top:32,right:16,bottom:48,left:48},s=o-a.left-a.right,d=r-a.top-a.bottom,c=Math.max(...e.map(u=>u.count),1),i=[["#0c4a8a","#3b82f6"],["#065f46","#22c55e"],["#78350f","#f59e0b"],["#7f1d1d","#ef4444"],["#4c1d95","#8b5cf6"],["#134e4a","#14b8a6"],["#7c2d12","#f97316"],["#1e293b","#64748b"]],p=4,g=Math.ceil(c/p),n=Array.from({length:p+1},(u,x)=>x*g),m=n.map(u=>{const x=a.top+d-u/(n[n.length-1]||1)*d;return`<line x1="${a.left}" y1="${x.toFixed(1)}" x2="${o-a.right}" y2="${x.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${a.left-6}" y="${(x+4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${u}</text>`}).join(""),l=Math.min(48,s/e.length*.6),f=s/e.length,h=e.map((u,x)=>{const v=Math.max(4,u.count/(n[n.length-1]||1)*d),L=a.left+x*f+f/2-l/2,F=a.top+d-v,[U,q]=i[x%i.length],G=`bg${x}`,O=u.avgRate?`avg ₹${Math.round(u.avgRate).toLocaleString()}`:"";return`<defs><linearGradient id="${G}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${U}"/>
              <stop offset="100%" stop-color="${q}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${u.name}" data-count="${u.count}" data-avg="${O}" style="cursor:pointer;">
              <rect x="${L.toFixed(1)}" y="${F.toFixed(1)}" width="${l}" height="${v.toFixed(1)}"
                rx="6" fill="url(#${G})" opacity="0.92"
                style="transform-origin:${(L+l/2).toFixed(1)}px ${(a.top+d).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${x*.07}s both;"/>
              <text x="${(L+l/2).toFixed(1)}" y="${(F-6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${q}">${u.count}</text>
              <text x="${(L+l/2).toFixed(1)}" y="${(a.top+d+16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(u.name||"").split(" ")[0].slice(0,8)}</text>
            </g>`}).join(""),E="bar-tooltip";t.innerHTML=`
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${E}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${r}" viewBox="0 0 ${o} ${r}" style="overflow:visible;">
      ${m}
      <line x1="${a.left}" y1="${a.top}" x2="${a.left}" y2="${a.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${a.left}" y1="${a.top+d}" x2="${o-a.right}" y2="${a.top+d}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${h}
    </svg>`;const $=t.querySelector("#bar-svg"),C=t.querySelector(`#${E}`);$&&C&&$.querySelectorAll(".bar-group").forEach(u=>{u.addEventListener("mousemove",x=>{const v=t.getBoundingClientRect();C.style.display="block",C.style.left=x.clientX-v.left+12+"px",C.style.top=x.clientY-v.top-40+"px";const L=u.dataset.avg?`<br><span style="opacity:.7;font-weight:500;">${u.dataset.avg}</span>`:"";C.innerHTML=`${u.dataset.name}<br><span style="color:#60a5fa;">${u.dataset.count} fares</span>${L}`}),u.addEventListener("mouseleave",()=>{C.style.display="none"})})}function At(e,t,o){const r=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316"],i=e.reduce((u,x)=>u+x.count,0),p=t.getElementById?t.getElementById("donut-segments"):t.querySelector("#donut-segments"),g=t.querySelector("#donut-center-count"),n=t.querySelector("#donut-center-label");if(!p)return;g&&(g.textContent=i),n&&(n.textContent="FARES");const m=(u,x,v,L)=>({x:u+v*Math.cos((L-90)*Math.PI/180),y:x+v*Math.sin((L-90)*Math.PI/180)});let l=0;const f=e.map((u,x)=>{const v=i>0?u.count/i*360:0,L=l+v,F=v>180?1:0,U=m(110,110,95,l),q=m(110,110,95,L),G=m(110,110,60,l),O=m(110,110,60,L),Z=[`M ${U.x.toFixed(2)} ${U.y.toFixed(2)}`,`A 95 95 0 ${F} 1 ${q.x.toFixed(2)} ${q.y.toFixed(2)}`,`L ${O.x.toFixed(2)} ${O.y.toFixed(2)}`,`A 60 60 0 ${F} 0 ${G.x.toFixed(2)} ${G.y.toFixed(2)}`,"Z"].join(" "),Q=l+v/2;l=L;const b=i>0?(u.count/i*100).toFixed(1):"0.0";return{pathD:Z,color:r[x%r.length],name:u.name,count:u.count,pct:b,mid:Q}}),h="http://www.w3.org/2000/svg";p.innerHTML="";const E=f.map((u,x)=>{const v=document.createElementNS(h,"path");return v.setAttribute("d",u.pathD),v.setAttribute("fill",u.color),v.setAttribute("stroke","white"),v.setAttribute("stroke-width","2"),v.style.cursor="pointer",v.style.transition="transform 0.2s, filter 0.2s",v.style.transformOrigin="110px 110px",v.setAttribute("data-index",x),p.appendChild(v),v}),$=u=>{E.forEach((x,v)=>{v===u?(x.style.transform="scale(1.04)",x.style.filter="brightness(1.1)",x.setAttribute("stroke-width","3")):(x.style.transform="scale(1)",x.style.filter="brightness(1)",x.setAttribute("stroke-width","2"))}),u>=0&&u<f.length?(g&&(g.textContent=f[u].count),n&&(n.textContent=f[u].name.split(" ")[0].toUpperCase().slice(0,7))):(g&&(g.textContent=i),n&&(n.textContent="FARES"))};if(E.forEach((u,x)=>{u.addEventListener("mouseover",()=>{$(x),C(x)}),u.addEventListener("mouseout",()=>{$(-1),C(-1)})}),o){o.innerHTML=f.map((x,v)=>`
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${v}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${x.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${x.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${x.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${x.pct}%</span>
      </div>`).join("");const u=x=>{o.querySelectorAll(".legend-row").forEach((v,L)=>{v.style.background=L===x?"#f1f5f9":""})};window._highlightLegendRows=u,o.querySelectorAll(".legend-row").forEach((x,v)=>{x.addEventListener("mouseover",()=>{$(v),u(v)}),x.addEventListener("mouseout",()=>{$(-1),u(-1)})})}function C(u){window._highlightLegendRows&&window._highlightLegendRows(u)}}function Bt(e,t){var s,d;const o=["#1558c0","#3b82f6","#22c55e","#f59e0b","#ef4444"],r=document.getElementById("leaderboard-agents");if(r&&e.length){const c=[...e].sort((p,g)=>g.count-p.count).slice(0,5),i=c[0].count||1;r.innerHTML=c.map((p,g)=>{const n=Math.max(6,Math.round(p.count/i*100));return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:16px;width:28px;text-align:center;flex-shrink:0;">${g===0?"🥇":g===1?"🥈":g===2?"🥉":`#${g+1}`}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${p.name}</span>
            <span style="color:${o[g]};margin-left:8px;">${p.count} fares</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${n}%;height:100%;background:${o[g]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}const a=document.getElementById("leaderboard-sectors");if(a&&t.length){const i=[...t.filter(n=>n.avgRate>0)].sort((n,m)=>n.avgRate-m.avgRate).slice(0,5),p=((s=i[0])==null?void 0:s.avgRate)||1,g=((d=i[i.length-1])==null?void 0:d.avgRate)||1;a.innerHTML=i.map((n,m)=>{const l=g>p?Math.max(6,Math.round((n.avgRate-p)/(g-p)*100)):50;return`<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${m+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${n.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(n.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${l}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`}).join("")}}function Lt(e){if(!e||!e.length){w("warning","No Data","No fares to export. Apply filters and fetch first.");return}const t=Object.fromEntries(H.map(n=>[n.id,n.name])),o=Object.fromEntries(T.map(n=>[n.id,n.sectorCode])),r=Object.fromEntries(D.map(n=>[n.id,n.code||n.name])),a=n=>`"${String(n??"").replace(/"/g,'""')}"`,s=["Date","Time","Sector","Airline","Agent","SP Rate (INR)","Rate (INR)","Commission (INR)","Baggage (kg)","Extra Baggage (kg)","Status"],d=e.map(n=>{const m=n.flightDate instanceof Date?n.flightDate.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):n.flightDate||"";return[a(m),a(n.flightTime||""),a(o[n.sectorId]||n.sectorId),a(r[n.airlineId]||n.airlineId),a(t[n.agentId]||n.agentId),a(n.specialRate||0),a(n.finalRate||0),a(n.commission||0),a(n.baggage||""),a(n.extraBaggage||""),a(n.isHidden?"Hidden":"Live")].join(",")}),c=[s.map(a).join(","),...d].join(`
`),i=new Blob(["\uFEFF"+c],{type:"text/csv;charset=utf-8;"}),p=URL.createObjectURL(i),g=document.createElement("a");g.href=p,g.download=`zamra-fares-${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(g),g.click(),document.body.removeChild(g),URL.revokeObjectURL(p),w("success","CSV Downloaded",`${e.length} fares exported.`)}const Tt="https://n8n.srv1046139.hstgr.cloud/webhook/zamra",Rt={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"},Ne=/\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;let K=null,X=JSON.parse(localStorage.getItem("zt_hist")||"[]"),Ie=X.reduce((e,t)=>e+(t.rows||0),0);function Ft(){var t,o,r,a;const e=document.getElementById("rateData");e&&e.addEventListener("input",function(){const s=this.value.length,d=document.getElementById("charCount");d&&(d.textContent=s.toLocaleString()+" character"+(s!==1?"s":"")),ie(),clearTimeout(window._previewTimer),s>15?window._previewTimer=setTimeout(()=>Nt(this.value),500):ue()}),(t=document.getElementById("resetBtn"))==null||t.addEventListener("click",()=>{e&&(e.value="");const s=document.getElementById("charCount");s&&(s.textContent="0 characters"),ue(),ie()}),(o=document.getElementById("clearBtn"))==null||o.addEventListener("click",()=>{X=[],Ie=0,ge(),le(),ve()}),(r=document.getElementById("manualAgent"))==null||r.addEventListener("input",function(){const s=parseInt(this.value);K=s>0?String(s):null,document.querySelectorAll(".rp-chip").forEach(d=>d.classList.remove("on")),ze(),ie()}),(a=document.getElementById("submitBtn"))==null||a.addEventListener("click",Ht),ve(),le()}function Dt(){const e=document.getElementById("chipGrid");if(!e||e.children.length>0)return;const t=H.length?[...H].sort((o,r)=>{const a=parseInt(o.id),s=parseInt(r.id);return!isNaN(a)&&!isNaN(s)?a-s:o.id.localeCompare(r.id)}):[];if(!t.length){e.innerHTML='<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>';return}t.forEach(o=>{const r=document.createElement("div");r.className="rp-chip",r.dataset.agentId=o.id,r.textContent=o.id,r.style.cssText="height:48px;padding:0 12px;display:flex;align-items:center;justify-content:center;border:2px solid #b8cce4;border-radius:10px;font-size:13px;font-weight:700;color:#1e293b;cursor:pointer;background:#ffffff;user-select:none;box-shadow:0 1px 4px rgba(13,31,60,.10);transition:all .16s ease;white-space:nowrap;",r.addEventListener("click",()=>Mt(o.id,o.name,r)),e.appendChild(r)})}function Mt(e,t,o){K=e,document.getElementById("manualAgent").value="",document.querySelectorAll(".rp-chip").forEach(r=>{r.classList.remove("on"),r.style.background="#ffffff",r.style.color="#1e293b",r.style.borderColor="#b8cce4",r.style.boxShadow="0 1px 4px rgba(13,31,60,.10)",r.style.transform=""}),o&&(o.classList.add("on"),o.style.background="#1a73e8",o.style.color="#ffffff",o.style.borderColor="#1a73e8",o.style.boxShadow="0 4px 14px rgba(26,115,232,.3)",o.style.transform="translateY(-1px)"),ze(),ie()}function ze(){const e=document.getElementById("agentPill");if(e)if(K){const t=H.find(o=>o.id===K);e.textContent=`Agent ${(t==null?void 0:t.id)||K} selected ✓`,e.classList.remove("empty")}else e.textContent="No agent selected",e.classList.add("empty")}function ie(){const e=document.getElementById("rateData"),t=document.getElementById("submitBtn");t&&(t.disabled=!(K&&e&&e.value.trim().length>10))}function Ge(e){const t=[];let o=null,r="IX";for(const a of e.split(`
`)){const s=a.replace(/[*_~`]/g,"").trim();if(!s)continue;const d=s.match(/([A-Z]{3})\s+([A-Z]{3})/);if(d&&s.length<70&&!s.match(/\d{4,6}/)){o=d[1]+"-"+d[2];const c=s.match(Ne);c&&(r=c[1]);continue}if(o){const c=s.match(Ne);if(c&&!s.match(/\d{4,6}/)){r=c[1];continue}const i=s.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);if(i){const p=parseInt(i[3]);p>=1e3&&p<=99999&&t.push({sector:o,date:`2026-${Rt[i[2].toUpperCase()]}-${i[1].padStart(2,"0")}`,airline:c?c[1]:r,rate:p})}}}return t}function Nt(e){const t=Ge(e);if(!t.length){ue();return}const o=document.getElementById("prevBox");o&&o.classList.add("on");const r=document.getElementById("prevCount");r&&(r.textContent=t.length+" entr"+(t.length===1?"y":"ies"));const a=document.getElementById("prevBody");a&&(a.innerHTML=t.slice(0,60).map(s=>`
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${s.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${s.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${s.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${s.rate.toLocaleString()}</td></tr>`).join(""),t.length>60&&(a.innerHTML+=`<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${t.length-60} more</td></tr>`))}function ue(){var e;(e=document.getElementById("prevBox"))==null||e.classList.remove("on")}async function Ht(){const e=document.getElementById("rateData");if(!K||!(e!=null&&e.value.trim()))return;const t=document.getElementById("submitBtn"),o=t.innerHTML;t.disabled=!0,t.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI...';const r=document.getElementById("progBar"),a=document.getElementById("progFill");r&&r.classList.add("on");let s=0;const d=setInterval(()=>{s=Math.min(s+Math.random()*13,85),a&&(a.style.width=s+"%")},280),c=Ge(e.value),i={id:Date.now(),agent:K,time:new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),rows:c.length,status:"pen"};X.unshift(i),X.length>15&&X.pop(),ge(),le();try{const p=await fetch(Tt,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_id:K,raw_text:e.value.trim(),timestamp:new Date().toISOString(),source:"zamra-portal"})});if(clearInterval(d),a&&(a.style.width="100%"),p.ok)i.status="ok",Ie+=c.length,ge(),le(),ve(),w("success","Submitted","Rates dispatched to AI Agent. The database will reflect parsing results momentarily."),setTimeout(()=>{e.value="";const g=document.getElementById("charCount");g&&(g.textContent="0 characters"),ue(),ie()},500);else throw new Error("N8N webhook rejected payload")}catch(p){clearInterval(d),a&&(a.style.width="100%"),i.status="err",ge(),le(),w("error","Submission Failed",p.message)}setTimeout(()=>{r&&r.classList.remove("on"),a&&(a.style.width="0%"),t.innerHTML=o,ie()},900)}function ve(){const e=document.getElementById("statSubs");e&&(e.textContent=X.length);const t=document.getElementById("statEntries");t&&(t.textContent=Ie)}function ge(){localStorage.setItem("zt_hist",JSON.stringify(X))}function le(){const e=document.getElementById("historyWrap");if(e){if(!X.length){e.innerHTML=`<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;return}e.innerHTML=X.map(t=>{var r;const o=((r=H.find(a=>a.id===t.agent))==null?void 0:r.name)||`Agent ${t.agent}`;return`<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${o.split(" ")[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${o}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${t.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${t.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${t.status==="ok"?"bg-green-500":t.status==="err"?"bg-red-500":"bg-yellow-400"}"></div>
    </div>`}).join("")}}async function Ut(){var c;const e=document.getElementById("eticket-tab");if(!e)return;const t=document.getElementById("eticket-form"),o=document.getElementById("et-add-passenger"),r=document.getElementById("et-passengers-container"),a=document.getElementById("et-airline"),s=document.getElementById("et-origin"),d=document.getElementById("et-destination");if(D.length===0&&(D=await $e()),T.length===0&&(T=await Ee()),!e.dataset.wired){if(e.dataset.wired="1",a&&D&&(a.innerHTML='<option value="">Select Airline</option>'+D.map(i=>`<option value="${i.name}">${i.name}</option>`).join("")),s&&T){const i=[...new Set(T.map(p=>p.sectorFrom).filter(Boolean))].sort();s.innerHTML='<option value="">Select Origin</option>'+i.map(p=>`<option value="${p}">${p}</option>`).join("")}if(d&&T){const i=[...new Set(T.map(p=>p.sectorTo).filter(Boolean))].sort();d.innerHTML='<option value="">Select Destination</option>'+i.map(p=>`<option value="${p}">${p}</option>`).join("")}o==null||o.addEventListener("click",()=>{r.children.length,r.insertAdjacentHTML("beforeend",`
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-border rounded-lg bg-white et-pax-row relative">
          <button type="button" class="absolute -top-3 -right-3 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors border border-red-200" onclick="this.closest('.et-pax-row').remove()" title="Remove passenger">×</button>
          
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-text-muted mb-1">Title</label>
            <select name="paxTitle[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
              <option value="MR">MR</option>
              <option value="MRS">MRS</option>
              <option value="MS">MS</option>
              <option value="MSTR">MSTR</option>
              <option value="MISS">MISS</option>
            </select>
          </div>

          <div class="md:col-span-3">
            <label class="block text-xs font-semibold text-text-muted mb-1">Passenger Name *</label>
            <input type="text" name="paxName[]" required placeholder="e.g. JOHN DOE" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none uppercase placeholder:normal-case">
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-text-muted mb-1">Category</label>
            <select name="paxType[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
              <option value="ADT">Adult</option>
              <option value="CHD">Child</option>
              <option value="INF">Infant</option>
            </select>
          </div>

          <div class="md:col-span-5 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-text-muted mb-1">Check-in Bag</label>
              <select name="paxCheckBag[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="15 Kilograms">15 Kilograms</option>
                <option value="20 Kilograms">20 Kilograms</option>
                <option value="25 Kilograms">25 Kilograms</option>
                <option value="30 Kilograms" selected>30 Kilograms</option>
                <option value="35 Kilograms">35 Kilograms</option>
                <option value="40 Kilograms">40 Kilograms</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-text-muted mb-1">Carry-on</label>
              <select name="paxCarryBag[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="7 Kilograms" selected>7 Kilograms</option>
                <option value="10 Kilograms">10 Kilograms</option>
              </select>
            </div>
          </div>
        </div>
      `)}),r.children.length===0&&(o==null||o.click()),t==null||t.addEventListener("submit",async i=>{i.preventDefault(),await jt(new FormData(t))}),(c=document.getElementById("et-print-btn"))==null||c.addEventListener("click",()=>{window.print()}),t==null||t.addEventListener("reset",()=>{setTimeout(()=>{var i;Array.from(r.children).forEach((p,g)=>{g>0&&p.remove()}),(i=document.getElementById("eticket-output-wrapper"))==null||i.classList.add("hidden")},10),w("info","Form Reset","The E-Ticket form has been cleared.")})}}async function jt(e){var b,S,k;const t=(b=e.get("etPnr"))==null?void 0:b.toUpperCase(),o=(S=e.get("etAirline"))==null?void 0:S.toUpperCase(),r=(k=e.get("etFlightNo"))==null?void 0:k.toUpperCase();let a=e.get("etDate");const s=e.get("etDepTime"),d=e.get("etArrTime"),c=e.get("etPhone"),i=y=>{let I=(y||"").trim(),_=I,j="";const z=I.match(/^(.*?)\\s*\\((.*?)\\)$/);return z&&(_=z[1].trim(),j=z[2].trim()),{city:_,code:j}},p=i(e.get("etOrigin")),g=i(e.get("etDest"));let n=a;if(a){const y=new Date(a);if(!isNaN(y.getTime())){const I=["SUN","MON","TUE","WED","THU","FRI","SAT"],_=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];n=`${I[y.getDay()]}, ${String(y.getDate()).padStart(2,"0")} ${_[y.getMonth()]} ${y.getFullYear()}`}}const m=y=>document.getElementById(y);m("t-pnr")&&(m("t-pnr").textContent=t||"—"),m("t-crs-pnr")&&(m("t-crs-pnr").textContent=t||"—"),m("t-booking-ref")&&(m("t-booking-ref").textContent=t||"—"),m("t-airline-tollfree")&&(m("t-airline-tollfree").textContent="");const l=e.get("etOrigin")||"—",f=e.get("etDest")||"—";m("t-issued-by")&&(m("t-issued-by").textContent=o||"—"),m("t-customer-phone")&&(m("t-customer-phone").textContent=c||"—");const h=new Date,E=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];if(m("t-booked-on")&&(m("t-booked-on").textContent=`${String(h.getDate()).padStart(2,"0")}-${E[h.getMonth()]}-${h.getFullYear()} ${String(h.getHours()).padStart(2,"0")}:${String(h.getMinutes()).padStart(2,"0")}`),m("t-airline-logo")){const y=typeof D<"u"?D.find(I=>I.name.toUpperCase()===o):null;y&&y.logoUrl&&m("t-airline-logo")?(m("t-airline-logo").src=y.logoUrl,m("t-airline-logo").classList.remove("hidden"),m("t-issued-by")&&(m("t-issued-by").classList.remove("mt-1"),m("t-issued-by").textContent=o)):(m("t-airline-logo").classList.add("hidden"),m("t-issued-by")&&(m("t-issued-by").classList.add("mt-1"),m("t-issued-by").textContent=o))}let $=p.code,C=g.code,u=null;if(typeof T<"u"){if(u=T.find(y=>y.sectorFrom===l&&y.sectorTo===f),!u&&l){const y=T.find(I=>I.sectorFrom===l);y&&y.sectorCode&&($=y.sectorCode.split(/[ -]+/)[0])}if(!u&&f){const y=T.find(I=>I.sectorTo===f);y&&y.sectorCode&&(C=y.sectorCode.split(/[ -]+/).pop())}}const x=p.city.toUpperCase(),v=g.city.toUpperCase(),L=e.getAll("paxTitle[]"),F=e.getAll("paxName[]"),U=e.getAll("paxType[]"),q=e.getAll("paxCheckBag[]"),G=e.getAll("paxCarryBag[]"),O=document.getElementById("t-passengers-tbody");O&&(O.innerHTML="");for(let y=0;y<F.length;y++){const I=(L[y]||"MR").toUpperCase(),_=(F[y]||"").toUpperCase();(U[y]||"ADT").toUpperCase();const j=(q[y]||"").toUpperCase(),z=(G[y]||"").toUpperCase();let W="";u&&u.sectorCode?W=u.sectorCode.toUpperCase():W=`${$||p.city||"—"} - ${C||g.city||"—"}`.toUpperCase();const P=document.createElement("tr");P.style.borderBottom="none",P.innerHTML=`
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800">${I}. ${_}<br><span class="text-gray-500 text-[10px] uppercase"></span></td>
      <td class="border-b border-gray-200 p-2 align-top text-gray-800"></td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800">${W}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800">${r||""}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-[#1e3a8a] text-center font-bold">${t||""}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800 text-center">${z}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800 px-2">${j}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800 px-2 border-r-0"></td>
      <td class="border-b border-gray-200 p-2 align-top text-gray-800"></td>
      <td class="border-b border-gray-200 p-2 align-top text-gray-800">Confirmed</td>
    `,O&&O.appendChild(P)}const Z=document.getElementById("t-travel-tbody");Z&&(Z.innerHTML=`
      <tr class="text-black">
        <td class="p-2 border-b border-gray-300 align-top">
          <div class="font-normal text-[11px]">${r||"—"}</div>
          <div class="text-[10px] text-gray-600 mt-0.5">Non-Refundable</div>
        </td>
        <td class="p-2 border-l border-b border-gray-300 align-top">
          <div class="font-bold uppercase">${x}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${s||"—"}</span> <span class="text-gray-600 ml-1 text-[11px]">${n||"—"}</span></div>
        </td>
        <td class="p-2 border-l border-b border-gray-300 align-top">
          <div class="font-bold uppercase">${v}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${d||"—"}</span> <span class="text-gray-600 ml-1 text-[11px]">${n||"—"}</span></div>
        </td>
        <td class="p-2 border-l border-b border-gray-300 align-top text-center text-[12px]">
          Confirmed
        </td>
      </tr>
    `);const Q=document.getElementById("eticket-output-wrapper");Q&&(Q.classList.remove("hidden"),Q.scrollIntoView({behavior:"smooth"}))}const He={success:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',error:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',warning:'<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',info:'<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'};function w(e,t,o){const r=document.getElementById("toastsEl");if(!r)return;const a=document.createElement("div"),s={success:"border-green-500 bg-green-50 text-green-800",error:"border-red-500 bg-red-50 text-red-800",warning:"border-yellow-500 bg-yellow-50 text-yellow-800",info:"border-primary bg-primary/10 text-[var(--color-primary-dark)]"};a.className=`flex items-start gap-3 p-4 border-l-4 rounded shadow-md w-80 pointer-events-auto ${s[e]||s.error}`,a.innerHTML=`<div class="mt-0.5">${He[e]||He.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${t}</div><div class="text-xs opacity-90 mt-1">${o}</div></div>
    <button class="opacity-50 hover:opacity-100" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`,r.appendChild(a),setTimeout(()=>a.isConnected&&a.remove(),7e3)}window.toast=w;document.addEventListener("DOMContentLoaded",()=>{});
