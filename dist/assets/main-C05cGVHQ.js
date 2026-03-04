import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{const i=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?i.classList.add("scrolled"):i.classList.remove("scrolled")});const d=document.getElementById("mobile-toggle"),o=document.getElementById("nav-menu");d&&d.addEventListener("click",()=>{o.classList.toggle("active");const e=d.querySelector("i");o.classList.contains("active")?e.classList.replace("bi-list","bi-x-lg"):e.classList.replace("bi-x-lg","bi-list")}),document.querySelectorAll(".nav-menu a").forEach(e=>{e.addEventListener("click",()=>{o.classList.contains("active")&&(o.classList.remove("active"),d.querySelector("i").classList.replace("bi-x-lg","bi-list"))})});const u=[{code:"JED",name:"JEDDAH"},{code:"RUH",name:"RIYADH"},{code:"DMM",name:"DAMAMM"},{code:"DOH",name:"DOHA"},{code:"MCT",name:"MUSCUT"},{code:"BAH",name:"BAHRAIN"},{code:"KWI",name:"KUWAIT"},{code:"DXB",name:"DUBAI"},{code:"SHJ",name:"SHARJA"},{code:"AUH",name:"ABUDHABI"},{code:"RKT",name:"Ras Al Khaimah"},{code:"AAN",name:"AL AIN"},{code:"FJR",name:"FUJAIRAH"}];[{id:"kozhikode",code:"CCJ",name:"KOZHIKKODE"},{id:"kochi",code:"COK",name:"KOCHI"},{id:"kannur",code:"CNN",name:"KANNUR"}].forEach(e=>{const s=document.getElementById(`grid-${e.id}`);s&&u.forEach(c=>{const m=`${e.code} ${c.code}`,g=`${e.name} → ${c.name}`,n=document.createElement("div");n.className="sector-card",n.setAttribute("data-sector",m),n.innerHTML=`<h4>${e.name} <i class="bi bi-airplane"></i> ${c.name}</h4>`,n.addEventListener("click",()=>v(m,g)),s.appendChild(n)})});const t=document.getElementById("sector-modal"),r=document.getElementById("modal-close"),l=document.getElementById("modal-body"),A=document.getElementById("modal-route");function v(e,s){A.textContent=e.replace(" "," → "),t.classList.add("active"),document.body.style.overflow="hidden",l.innerHTML='<div class="loading-spinner"></div><p class="text-center text-muted">Fetching latest fares...</p>',setTimeout(()=>{l.innerHTML=`
                <div class="text-center mb-4">
                    <h4 style="color: var(--primary-dark); margin-bottom: 8px;">Available Flights for ${s}</h4>
                    <p class="text-muted">Prices are introductory and subject to availability.</p>
                </div>
                <table class="styled-table">
                    <thead>
                        <tr>
                            <th>Airlines</th>
                            <th>Departure</th>
                            <th>Arrival</th>
                            <th>Status</th>
                            <th>Price Start At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Air India Express</strong></td>
                            <td>10:45 AM</td>
                            <td>01:20 PM</td>
                            <td><span style="color: #16a34a;">Available</span></td>
                            <td><strong>₹12,450</strong></td>
                        </tr>
                        <tr>
                            <td><strong>Saudi Airlines</strong></td>
                            <td>04:30 PM</td>
                            <td>08:15 PM</td>
                            <td><span style="color: #16a34a;">Available</span></td>
                            <td><strong>₹14,200</strong></td>
                        </tr>
                        <tr>
                            <td><strong>Oman Air</strong></td>
                            <td>11:00 PM</td>
                            <td>03:45 AM</td>
                            <td><span style="color: #d97706;">Few Seats</span></td>
                            <td><strong>₹13,800</strong></td>
                        </tr>
                    </tbody>
                </table>
            `},800)}function a(){t.classList.remove("active"),document.body.style.overflow=""}r&&r.addEventListener("click",a),t&&t.addEventListener("click",e=>{e.target===t&&a()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("active")&&a()}),(()=>{document.querySelector(".partners-slider")})()});
