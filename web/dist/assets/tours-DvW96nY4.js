import{Q as u,R as m,g as p,q as v,c as h,w as b,o as f}from"./index.esm-kRT_WKqT.js";/* empty css              */const y={apiKey:"AIzaSyDXVaGrWYqKwJBh7ow1GVCzTqnJJJDLlcM",authDomain:"zamra-web.firebaseapp.com",projectId:"zamra-web",storageBucket:"zamra-web.firebasestorage.app",messagingSenderId:"1087844474513",appId:"1:1087844474513:web:a6e8dcf6e3d0b4b5bc3671"},L=u(y,"tours-public"),w=m(L);let d=[],l="all",g="";async function C(){try{d=(await p(v(h(w,"tours"),b("isActive","==",!0),f("title")))).docs.map(t=>({id:t.id,...t.data()}))}catch(e){console.error("Error loading tours:",e),d=[]}n()}function E(){let e=d;l!=="all"&&(e=e.filter(i=>i.category===l));const t=g.toLowerCase().trim();return t&&(e=e.filter(i=>(i.title||"").toLowerCase().includes(t)||(i.description||"").toLowerCase().includes(t)||(i.category||"").toLowerCase().includes(t)||(i.duration||"").toLowerCase().includes(t)||(i.highlights||[]).some(a=>a.toLowerCase().includes(t)))),e}function n(){const e=document.getElementById("tours-loading"),t=document.getElementById("tours-grid"),i=document.getElementById("tours-empty"),a=document.getElementById("tours-count");if(!t)return;const s=E();if(e==null||e.classList.add("hidden"),s.length===0){t.classList.add("hidden"),i==null||i.classList.remove("hidden"),a&&a.classList.add("hidden");return}i==null||i.classList.add("hidden"),t.classList.remove("hidden"),a&&(a.textContent=`Showing ${s.length} tour package${s.length!==1?"s":""}`,a.classList.remove("hidden")),t.innerHTML=s.map(c=>I(c)).join("")}function I(e){const t=e.coverImageUrl?`<img src="${r(e.coverImageUrl)}" alt="${r(e.title)}" loading="lazy">`:'<div class="tour-card-image-placeholder"><i class="bi bi-image"></i></div>',i=e.price&&e.price>0?`<div class="tour-price-value">₹${Number(e.price).toLocaleString()}</div>`:'<div class="tour-price-value call"><i class="bi bi-telephone-fill"></i> Call for Price</div>',a=(e.highlights||[]).slice(0,3).map(o=>`<div class="tour-highlight-item"><i class="bi bi-check-circle-fill"></i><span>${r(o)}</span></div>`).join(""),c={International:"rgba(12,74,138,0.75)",Domestic:"rgba(5,122,85,0.75)","Hajj-Umrah":"rgba(120,60,5,0.75)"}[e.category]||"rgba(12,74,138,0.75)";return`
    <div class="tour-card">
      <div class="tour-card-image">
        ${t}
        <div class="tour-card-image-overlay"></div>
        <div class="tour-card-badges">
          <span class="tour-category-badge" style="background:${c};">${r(e.category||"Tour")}</span>
        </div>
        <div class="tour-card-meta">
          <div class="tour-card-title">${r(e.title)}</div>
          <div class="tour-card-duration"><i class="bi bi-clock"></i> ${r(e.duration)}</div>
        </div>
      </div>
      <div class="tour-card-body">
        ${a?`<div class="tour-highlights">${a}</div>`:'<div class="tour-highlights"><p class="text-[13px] text-text-muted">'+r((e.description||"").slice(0,100))+"…</p></div>"}
        <div class="tour-card-footer">
          <div class="tour-price">
            <span class="tour-price-label">${e.price&&e.price>0?"Starting from":"Price"}</span>
            ${i}
          </div>
          <a href="/tour-detail.html?id=${encodeURIComponent(e.id)}" class="tour-view-btn">
            View Details <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `}function r(e=""){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function $(){var t,i,a;(t=document.getElementById("category-chips"))==null||t.addEventListener("click",s=>{const c=s.target.closest("[data-cat]");c&&(document.querySelectorAll(".category-chip").forEach(o=>o.classList.remove("active")),c.classList.add("active"),l=c.dataset.cat,n())});let e;(i=document.getElementById("tours-search"))==null||i.addEventListener("input",s=>{clearTimeout(e),e=setTimeout(()=>{g=s.target.value,n()},220)}),(a=document.getElementById("mobile-toggle"))==null||a.addEventListener("click",()=>{var s;(s=document.getElementById("nav-menu"))==null||s.classList.toggle("mobile-open")})}document.addEventListener("DOMContentLoaded",()=>{$(),C()});
