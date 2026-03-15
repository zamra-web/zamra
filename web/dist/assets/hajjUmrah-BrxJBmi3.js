import{Q as H,R as U,g as z,q as A,c as T,w as M}from"./index.esm-DPDniVF0.js";import{i as N}from"./site-chrome-Dy5oun64.js";const _={apiKey:"AIzaSyDXVaGrWYqKwJBh7ow1GVCzTqnJJJDLlcM",authDomain:"zamra-web.firebaseapp.com",projectId:"zamra-web",storageBucket:"zamra-web.firebasestorage.app",messagingSenderId:"1087844474513",appId:"1:1087844474513:web:a6e8dcf6e3d0b4b5bc3671"},J=H(_,"hajj-umrah-public"),G=U(J);let h=[],g="all",S="";async function V(){try{h=(await z(A(T(G,"hajj_umrah_packages"),M("isActive","==",!0)))).docs.map(t=>({id:t.id,...t.data()})),h.sort((t,a)=>(t.departureDate||"").localeCompare(a.departureDate||""))}catch(e){console.error("Error loading packages:",e),h=[]}p()}function F(){let e=h;g!=="all"&&(e=e.filter(a=>a.type===g));const t=S.toLowerCase().trim();return t&&(e=e.filter(a=>(a.title||"").toLowerCase().includes(t)||(a.description||"").toLowerCase().includes(t)||(a.type||"").toLowerCase().includes(t)||(a.departureCity||"").toLowerCase().includes(t)||(a.airline||"").toLowerCase().includes(t)||(a.highlights||[]).some(i=>i.toLowerCase().includes(t)))),e}function p(){const e=document.getElementById("hajjumrah-loading"),t=document.getElementById("hajjumrah-grid"),a=document.getElementById("hajjumrah-empty"),i=document.getElementById("hajjumrah-count");if(!t)return;const r=F();if(e==null||e.classList.add("hidden"),r.length===0){t.classList.add("hidden"),a==null||a.classList.remove("hidden"),i&&i.classList.add("hidden");return}a==null||a.classList.add("hidden"),t.classList.remove("hidden"),i&&(i.textContent=`Showing ${r.length} package${r.length!==1?"s":""}`,i.classList.remove("hidden")),t.innerHTML=r.map(s=>K(s)).join("")}function K(e){const t=e.coverImageUrl?`<img src="${c(e.coverImageUrl)}" alt="${c(e.title)}" loading="lazy">`:'<div class="hajjumrah-card-image-placeholder"><i class="bi bi-image"></i></div>',a=e.price&&e.price>0?`<div class="hajjumrah-price-value">₹${Number(e.price).toLocaleString()}</div>`:'<div class="hajjumrah-price-value call"><i class="bi bi-telephone-fill"></i> Call for Price</div>',r=y(e.highlights).slice(0,3).map(l=>`<div class="hajjumrah-highlight-item"><i class="bi bi-check-circle-fill"></i><span>${c(l)}</span></div>`).join(""),s=(e.description||"").trim(),o=r?`<div class="hajjumrah-highlights">${r}</div>`:s?`<div class="hajjumrah-highlights"><p class="text-[13px] text-text-muted">${c(s.slice(0,100))}…</p></div>`:'<div class="hajjumrah-highlights"><p class="text-[13px] text-text-muted">Contact us for full package details.</p></div>',n=e.type==="Hajj"?"rgba(7, 49, 96, 0.75)":"rgba(217, 119, 6, 0.75)";return`
    <div class="hajjumrah-card">
      <div class="hajjumrah-card-image">
        ${t}
        <div class="hajjumrah-card-image-overlay"></div>
        <div class="hajjumrah-card-badges">
          <span class="hajjumrah-category-badge" style="background:${n};">${c(e.type||"Umrah")}</span>
        </div>
        <div class="hajjumrah-card-meta">
          <div class="hajjumrah-card-title">${c(e.title)}</div>
          <div class="hajjumrah-card-duration"><i class="bi bi-clock"></i> ${e.days} Days / ${e.nights} Nights</div>
        </div>
      </div>
      <div class="hajjumrah-card-body">
        
        <div class="hajjumrah-details-grid">
          <div class="hajjumrah-detail-item">
            <span class="hajjumrah-detail-label">Departure</span>
            <span class="hajjumrah-detail-value"><i class="bi bi-geo-alt text-primary opacity-80"></i> ${c(e.departureCity)}</span>
          </div>
          <div class="hajjumrah-detail-item">
            <span class="hajjumrah-detail-label">Airline</span>
            <span class="hajjumrah-detail-value"><i class="bi bi-airplane text-primary opacity-80"></i> ${c(e.airline)}</span>
          </div>
          <div class="hajjumrah-detail-item">
            <span class="hajjumrah-detail-label">Date</span>
            <span class="hajjumrah-detail-value"><i class="bi bi-calendar3 text-primary opacity-80"></i> ${c(e.departureDate)}</span>
          </div>
        </div>

        ${o}
        
        <div class="hajjumrah-card-footer">
          <div class="hajjumrah-price">
            <span class="hajjumrah-price-label">${e.price&&e.price>0?"Cost from":"Price"}</span>
            ${a}
          </div>
          <button type="button" class="hajjumrah-view-btn border-0 cursor-pointer" data-hajjumrah-id="${e.id}">
            View Details <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `}function c(e=""){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function y(e){return Array.isArray(e)?e.map(t=>String(t).trim()).filter(Boolean):typeof e=="string"?e.split(`
`).map(t=>t.trim()).filter(Boolean):[]}function q(e,t){return e.length?e.map(a=>`<div class="flex items-start gap-2 text-[13px] text-text-muted">
      <i class="${t} text-[14px] mt-[2px]"></i>
      <span>${c(a)}</span>
    </div>`).join(""):""}function R(e){const t=document.getElementById("hajjumrah-modal");if(!t)return;const a=document.getElementById("hajjumrah-modal-hero"),i=document.getElementById("hajjumrah-modal-type"),r=document.getElementById("hajjumrah-modal-title"),s=document.querySelector("#hajjumrah-modal-duration span"),o=document.getElementById("hajjumrah-modal-description"),n=document.getElementById("hajjumrah-modal-highlights"),l=document.getElementById("hajjumrah-modal-inclusions"),d=document.getElementById("hajjumrah-modal-price"),m=document.getElementById("hajjumrah-modal-price-label"),u=document.getElementById("hajjumrah-modal-price-note"),f=document.getElementById("hajjumrah-modal-wa"),v=document.getElementById("hajjumrah-modal-departure"),b=document.getElementById("hajjumrah-modal-airline"),E=document.getElementById("hajjumrah-modal-date"),I=document.getElementById("hajjumrah-modal-quick-departure"),C=document.getElementById("hajjumrah-modal-quick-airline"),x=document.getElementById("hajjumrah-modal-quick-date"),B=document.getElementById("hajjumrah-modal-description-block"),L=document.getElementById("hajjumrah-modal-highlights-block"),$=document.getElementById("hajjumrah-modal-inclusions-block");a&&(a.style.backgroundImage=e.coverImageUrl?`url("${e.coverImageUrl}")`:""),i&&(i.textContent=e.type||"Umrah"),r&&(r.textContent=e.title||"Package"),s&&(s.textContent=`${e.days||"—"} Days / ${e.nights||"—"} Nights`),v&&(v.textContent=e.departureCity||"—"),b&&(b.textContent=e.airline||"—"),E&&(E.textContent=e.departureDate||"—"),I&&(I.textContent=e.departureCity||"—"),C&&(C.textContent=e.airline||"—"),x&&(x.textContent=e.departureDate||"—"),o&&(o.textContent=e.description||""),B&&B.classList.toggle("hidden",!e.description);const w=y(e.highlights),D=y(e.inclusions);if(n&&(n.innerHTML=q(w,"bi bi-check-circle-fill text-emerald-500")),l&&(l.innerHTML=q(D,"bi bi-check-circle-fill text-emerald-500")),L&&L.classList.toggle("hidden",!w.length),$&&$.classList.toggle("hidden",!D.length),d&&m&&(e.price&&e.price>0?(m.textContent="Cost from",d.textContent=`₹${Number(e.price).toLocaleString()}`,u&&(u.textContent="Per person")):(m.textContent="Price",d.textContent="Call for Price",u&&(u.textContent=""))),f){const P=encodeURIComponent(`Hello Zamra Travels, I am interested in the ${e.title} ${e.type?`(${e.type})`:""} package from ${e.departureCity||"your city"} on ${e.departureDate||"your upcoming date"}. Please share full details.`);f.href=`https://wa.me/919846606739?text=${P}`}t.classList.remove("hidden"),document.body.style.overflow="hidden"}function j(){const e=document.getElementById("hajjumrah-modal");e&&(e.classList.add("hidden"),document.body.style.overflow="")}function O(){var t,a,i,r,s,o;(t=document.getElementById("category-chips"))==null||t.addEventListener("click",n=>{const l=n.target.closest("[data-cat]");l&&(document.querySelectorAll(".category-chip").forEach(d=>d.classList.remove("active")),l.classList.add("active"),g=l.dataset.cat,p())});let e;(a=document.getElementById("hajjumrah-search"))==null||a.addEventListener("input",n=>{clearTimeout(e),e=setTimeout(()=>{S=n.target.value,p()},220)}),(i=document.getElementById("hajjumrah-grid"))==null||i.addEventListener("click",n=>{const l=n.target.closest("[data-hajjumrah-id]");if(!l)return;const d=h.find(m=>m.id===l.dataset.hajjumrahId);d&&R(d)}),(r=document.getElementById("hajjumrah-modal-close"))==null||r.addEventListener("click",j),(s=document.getElementById("hajjumrah-modal-close-btn"))==null||s.addEventListener("click",j),(o=document.getElementById("hajjumrah-modal-backdrop"))==null||o.addEventListener("click",j),document.addEventListener("keydown",n=>{n.key==="Escape"&&j()})}document.addEventListener("DOMContentLoaded",()=>{N({enableSmoothScroll:!1}),O(),V()});
