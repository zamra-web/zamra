import{Q as m,R as u,g as j,q as p,c as g,w as v}from"./index.esm-kRT_WKqT.js";/* empty css              */const b={apiKey:"AIzaSyDXVaGrWYqKwJBh7ow1GVCzTqnJJJDLlcM",authDomain:"zamra-web.firebaseapp.com",projectId:"zamra-web",storageBucket:"zamra-web.firebasestorage.app",messagingSenderId:"1087844474513",appId:"1:1087844474513:web:a6e8dcf6e3d0b4b5bc3671"},y=m(b,"hajj-umrah-public"),f=u(y);let l=[],n="all",h="";async function L(){try{l=(await j(p(g(f,"hajj_umrah_packages"),v("isActive","==",!0)))).docs.map(e=>({id:e.id,...e.data()})),l.sort((e,i)=>(e.departureDate||"").localeCompare(i.departureDate||""))}catch(a){console.error("Error loading packages:",a),l=[]}o()}function w(){let a=l;n!=="all"&&(a=a.filter(i=>i.type===n));const e=h.toLowerCase().trim();return e&&(a=a.filter(i=>(i.title||"").toLowerCase().includes(e)||(i.description||"").toLowerCase().includes(e)||(i.type||"").toLowerCase().includes(e)||(i.departureCity||"").toLowerCase().includes(e)||(i.airline||"").toLowerCase().includes(e)||(i.highlights||[]).some(t=>t.toLowerCase().includes(e)))),a}function o(){const a=document.getElementById("hajjumrah-loading"),e=document.getElementById("hajjumrah-grid"),i=document.getElementById("hajjumrah-empty"),t=document.getElementById("hajjumrah-count");if(!e)return;const s=w();if(a==null||a.classList.add("hidden"),s.length===0){e.classList.add("hidden"),i==null||i.classList.remove("hidden"),t&&t.classList.add("hidden");return}i==null||i.classList.add("hidden"),e.classList.remove("hidden"),t&&(t.textContent=`Showing ${s.length} package${s.length!==1?"s":""}`,t.classList.remove("hidden")),e.innerHTML=s.map(c=>$(c)).join("")}function $(a){const e=a.coverImageUrl?`<img src="${r(a.coverImageUrl)}" alt="${r(a.title)}" loading="lazy">`:'<div class="hajjumrah-card-image-placeholder"><i class="bi bi-image"></i></div>',i=a.price&&a.price>0?`<div class="hajjumrah-price-value">₹${Number(a.price).toLocaleString()}</div>`:'<div class="hajjumrah-price-value call"><i class="bi bi-telephone-fill"></i> Call for Price</div>',t=(a.highlights||[]).slice(0,2).map(d=>`<div class="hajjumrah-highlight-item"><i class="bi bi-check-circle-fill"></i><span>${r(d)}</span></div>`).join(""),s=a.type==="Hajj"?"rgba(7, 49, 96, 0.75)":"rgba(217, 119, 6, 0.75)",c=encodeURIComponent(`Hello Zamra Travels, I am interested in the ${a.title} package.`);return`
    <div class="hajjumrah-card">
      <div class="hajjumrah-card-image">
        ${e}
        <div class="hajjumrah-card-image-overlay"></div>
        <div class="hajjumrah-card-badges">
          <span class="hajjumrah-category-badge" style="background:${s};">${r(a.type||"Umrah")}</span>
        </div>
        <div class="hajjumrah-card-meta">
          <div class="hajjumrah-card-title">${r(a.title)}</div>
          <div class="hajjumrah-card-duration"><i class="bi bi-clock"></i> ${a.days} Days / ${a.nights} Nights</div>
        </div>
      </div>
      <div class="hajjumrah-card-body">
        
        <div class="hajjumrah-details-grid">
          <div class="hajjumrah-detail-item">
            <span class="hajjumrah-detail-label">Departure</span>
            <span class="hajjumrah-detail-value"><i class="bi bi-geo-alt text-primary opacity-80"></i> ${r(a.departureCity)}</span>
          </div>
          <div class="hajjumrah-detail-item">
            <span class="hajjumrah-detail-label">Airline</span>
            <span class="hajjumrah-detail-value"><i class="bi bi-airplane text-primary opacity-80"></i> ${r(a.airline)}</span>
          </div>
          <div class="hajjumrah-detail-item">
            <span class="hajjumrah-detail-label">Date</span>
            <span class="hajjumrah-detail-value"><i class="bi bi-calendar3 text-primary opacity-80"></i> ${r(a.departureDate)}</span>
          </div>
        </div>

        ${t?`<div class="hajjumrah-highlights">${t}</div>`:'<div class="hajjumrah-highlights"><p class="text-[13px] text-text-muted">'+r((a.description||"").slice(0,100))+"…</p></div>"}
        
        <div class="hajjumrah-card-footer">
          <div class="hajjumrah-price">
            <span class="hajjumrah-price-label">${a.price&&a.price>0?"Cost from":"Price"}</span>
            ${i}
          </div>
          <a href="https://wa.me/919846606739?text=${c}" target="_blank" class="hajjumrah-view-btn bg-[#25D366] hover:bg-[#1ea855]">
            <i class="bi bi-whatsapp"></i> Book
          </a>
        </div>
      </div>
    </div>
  `}function r(a=""){return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function C(){var e,i,t;(e=document.getElementById("category-chips"))==null||e.addEventListener("click",s=>{const c=s.target.closest("[data-cat]");c&&(document.querySelectorAll(".category-chip").forEach(d=>d.classList.remove("active")),c.classList.add("active"),n=c.dataset.cat,o())});let a;(i=document.getElementById("hajjumrah-search"))==null||i.addEventListener("input",s=>{clearTimeout(a),a=setTimeout(()=>{h=s.target.value,o()},220)}),(t=document.getElementById("mobile-toggle"))==null||t.addEventListener("click",()=>{var s;(s=document.getElementById("nav-menu"))==null||s.classList.toggle("mobile-open")})}document.addEventListener("DOMContentLoaded",()=>{C(),L()});
