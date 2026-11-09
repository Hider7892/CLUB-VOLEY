/* ====== Configuración ====== */
const WHATSAPP = "573000000000"; // Cambia por el número del club (código de país + número, sin + ni espacios)

const PRODUCTS = [
  { id: 1, nombre: "Camiseta de competencia blanca", tipo: "competencia", precio: 85000, d: "jersey-blanca" },
  { id: 2, nombre: "Camiseta de competencia azul", tipo: "competencia", precio: 85000, d: "jersey-azul" },
  { id: 3, nombre: "Pantaloneta de competencia", tipo: "competencia", precio: 60000, d: "short-azul" },
  { id: 4, nombre: "Camiseta de entrenamiento manga larga", tipo: "entrenamiento", precio: 65000, d: "entreno-larga" },
  { id: 5, nombre: "Camiseta de entrenamiento sin mangas", tipo: "entrenamiento", precio: 50000, d: "entreno-corta" },
  { id: 6, nombre: "Licra corta de entrenamiento", tipo: "entrenamiento", precio: 45000, d: "short-negro" }
];

const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toLocaleString("es-CO");
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

/* ====== Menú móvil ====== */
$("#menuBtn").onclick = () => {
  const open = $("#nav").classList.toggle("open");
  $("#menuBtn").setAttribute("aria-expanded", open);
};
$("#nav").onclick = () => $("#nav").classList.remove("open");

/* ====== Tienda ====== */
const NAVY = "#0a1f44";
const FONT = 'font-family="Barlow Condensed,sans-serif" font-weight="800"';
function art(d) {
  const [kind, v] = d.split("-");
  if (kind === "short") {
    const c = v === "negro" ? "#05080f" : NAVY, t = v === "negro" ? "#8ec5ff" : "#fff";
    return `<svg viewBox="0 0 100 100" role="img" aria-label="Pantaloneta"><path d="M24 22h52l7 54H55l-5-26-5 26H17z" fill="${c}" stroke="#8ec5ff" stroke-width="1.5"/><path d="M24 22h52" stroke="${t}" stroke-width="3"/><text x="27" y="62" font-size="13" ${FONT} fill="${t}">26</text><text x="27" y="70" font-size="5" ${FONT} fill="${t}">BELLATOR</text></svg>`;
  }
  const body = "M32 8 42 6 50 17 58 6 68 8 70 28Q64 36 66 48L68 92H32L34 48Q36 36 30 28Z";
  if (kind === "jersey") {
    const w = v === "blanca", bg = w ? "#fff" : NAVY, trim = w ? NAVY : "#8ec5ff", ink = w ? NAVY : "#fff";
    return `<svg viewBox="0 0 100 100" role="img" aria-label="Camiseta de competencia"><path d="${body}" fill="${bg}" stroke="${trim}" stroke-width="2"/><path d="M42 6 50 17 58 6" fill="none" stroke="${trim}" stroke-width="3"/><path d="M30 28Q36 36 34 48L32 92M70 28Q64 36 66 48L68 92" fill="none" stroke="${trim}" stroke-width="3"/><circle cx="59" cy="30" r="4" fill="#1565e0"/><text x="50" y="68" text-anchor="middle" font-size="26" ${FONT} fill="${ink}">26</text><text x="50" y="85" text-anchor="middle" font-size="6" ${FONT} fill="${ink}">BELLATOR</text></svg>`;
  }
  const sleeves = v === "larga" ? '<path d="M32 8 14 20 8 72l11 2 11-38zM68 8l18 12 6 52-11 2-11-38z" fill="#fff" stroke="#c9d6ee"/>' : "";
  return `<svg viewBox="0 0 100 100" role="img" aria-label="Camiseta de entrenamiento">${sleeves}<path d="M32 8 42 6 50 17 58 6 68 8 70 36V92H30V36Z" fill="${NAVY}"/><path d="M36 12 50 46 64 12 57 12 50 32 43 12Z" fill="#fff"/><text x="50" y="76" text-anchor="middle" font-size="7" ${FONT} fill="#fff">BELLATOR</text></svg>`;
}

function renderProducts(filter = "todos") {
  const list = PRODUCTS.filter((p) => filter === "todos" || p.tipo === filter);
  $("#products").innerHTML = list.map((p) => `
    <article class="card">
      ${art(p.d)}
      <div class="card-b">
        <span class="tag">${p.tipo === "competencia" ? "Competencia" : "Entrenamiento"}</span>
        <h3>${p.nombre}</h3>
        <span class="price">${money(p.precio)}</span>
        <div class="card-f">
          <select aria-label="Talla" id="size-${p.id}">
            <option>S</option><option selected>M</option><option>L</option><option>XL</option>
          </select>
          <button class="btn" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    </article>`).join("");
}

document.querySelectorAll(".chip").forEach((c) => {
  c.onclick = () => {
    document.querySelectorAll(".chip").forEach((x) => x.classList.remove("on"));
    c.classList.add("on");
    renderProducts(c.dataset.f);
  };
});

$("#products").onclick = (e) => {
  const id = e.target.dataset.add;
  if (!id) return;
  const talla = $("#size-" + id).value;
  const found = cart.find((i) => i.id == id && i.talla === talla);
  found ? found.cant++ : cart.push({ id: +id, talla, cant: 1 });
  saveCart();
  toast("Agregado al carrito");
};

/* ====== Carrito ====== */
let cart = load("bellator_cart", []);
const saveCart = () => { save("bellator_cart", cart); renderCart(); };

function renderCart() {
  const total = cart.reduce((s, i) => s + PRODUCTS.find((p) => p.id === i.id).precio * i.cant, 0);
  $("#cartCount").textContent = cart.reduce((s, i) => s + i.cant, 0);
  $("#cartTotal").textContent = money(total);
  $("#cartItems").innerHTML = cart.length
    ? cart.map((i, n) => {
        const p = PRODUCTS.find((x) => x.id === i.id);
        return `<div class="item">
          <div><strong>${p.nombre}</strong><br><small>Talla ${i.talla} · ${money(p.precio)}</small></div>
          <div class="qty">
            <button data-q="${n}" data-d="-1" aria-label="Quitar uno">&minus;</button>
            <span>${i.cant}</span>
            <button data-q="${n}" data-d="1" aria-label="Agregar uno">+</button>
          </div></div>`;
      }).join("")
    : '<p class="empty">Tu carrito está vacío. Agrega uniformes desde la tienda.</p>';
}

$("#cartItems").onclick = (e) => {
  const n = e.target.dataset.q;
  if (n === undefined) return;
  cart[n].cant += +e.target.dataset.d;
  if (cart[n].cant <= 0) cart.splice(n, 1);
  saveCart();
};

function toggleCart(open) {
  $("#drawer").classList.toggle("open", open);
  $("#drawer").setAttribute("aria-hidden", !open);
  $("#shade").hidden = !open;
}
$("#cartBtn").onclick = () => toggleCart(true);
$("#closeCart").onclick = () => toggleCart(false);
$("#shade").onclick = () => toggleCart(false);
document.addEventListener("keydown", (e) => e.key === "Escape" && toggleCart(false));

$("#orderForm").onsubmit = (e) => {
  e.preventDefault();
  if (!cart.length) return toast("Agrega al menos un producto");
  const f = new FormData(e.target);
  let total = 0;
  const lineas = cart.map((i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    total += p.precio * i.cant;
    return `- ${i.cant} x ${p.nombre} (talla ${i.talla}) ${money(p.precio * i.cant)}`;
  });
  const msg = `Hola Bellator, quiero hacer este pedido:\n${lineas.join("\n")}\nTotal: ${money(total)}\n\nNombre: ${f.get("cliente")}\nTeléfono: ${f.get("tel")}\nCorreo: ${f.get("correo")}\nEntrega: ${f.get("direccion")}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  cart = [];
  saveCart();
  e.target.reset();
  toggleCart(false);
  toast("Pedido enviado por WhatsApp");
};

/* ====== Registro de deportistas ====== */
let athletes = load("bellator_athletes", []);

function renderAthletes() {
  const q = $("#search").value.trim().toLowerCase();
  const list = athletes.filter((a) => (a.nombre + " " + a.categoria + " " + a.posicion).toLowerCase().includes(q));
  $("#total").textContent = athletes.length + (athletes.length === 1 ? " deportista" : " deportistas");
  $("#athletes").innerHTML = list.length
    ? list.map((a) => `
      <div class="ath">
        <span class="num">${esc(a.numero || "–")}</span>
        <div><strong>${esc(a.nombre)}</strong>
        <small>${esc(a.posicion)} · ${esc(a.categoria)} · ${esc(a.telefono)}</small></div>
        <button class="del" data-del="${a.id}" aria-label="Eliminar a ${esc(a.nombre)}">Eliminar</button>
      </div>`).join("")
    : `<p class="empty">${athletes.length ? "No hay resultados para tu búsqueda." : "Aún no hay deportistas registrados. Completa el formulario para inscribir al primero."}</p>`;
}

$("#athleteForm").onsubmit = (e) => {
  e.preventDefault();
  const a = Object.fromEntries(new FormData(e.target));
  a.id = Date.now();
  athletes.push(a);
  save("bellator_athletes", athletes);
  e.target.reset();
  renderAthletes();
renderStats();
setToday();
  renderStats();
  toast("Deportista guardado");
};

$("#athletes").onclick = (e) => {
  const id = e.target.dataset.del;
  if (!id || !confirm("¿Eliminar a este deportista del registro?")) return;
  athletes = athletes.filter((a) => a.id != id);
  stats = stats.filter((s) => s.aid != id);
  save("bellator_athletes", athletes);
  save("bellator_stats", stats);
  renderAthletes();
renderStats();
setToday();
  renderStats();
};
$("#search").oninput = renderAthletes;

/* ====== Estadísticas ====== */
let stats = load("bellator_stats", []);
const METRICS = ["ataques", "aces", "recepciones", "errores"];
const LEADERS = [["ataques", "Más ataques"], ["aces", "Más aces"], ["recepciones", "Más recepciones"]];

function renderStats() {
  const sel = $("#statAthlete"), prev = sel.value;
  sel.innerHTML = '<option value="">Elegir deportista</option>' + athletes.map((a) => `<option value="${a.id}">${esc(a.nombre)}</option>`).join("");
  sel.value = prev;

  const rows = athletes.map((a) => {
    const g = stats.filter((s) => s.aid == a.id);
    const t = { nombre: a.nombre, pj: g.length };
    METRICS.forEach((k) => (t[k] = g.reduce((n, s) => n + s[k], 0)));
    return t;
  }).sort((x, y) => y.ataques - x.ataques);

  $("#leaders").innerHTML = LEADERS.map(([k, label]) => {
    const top = rows.filter((r) => r[k] > 0).sort((x, y) => y[k] - x[k])[0];
    return `<div class="leader"><span>${label}</span><strong>${top ? esc(top.nombre) : "Sin datos"}</strong><small>${top ? top[k] + " en " + top.pj + (top.pj === 1 ? " partido" : " partidos") : "Registra un partido"}</small></div>`;
  }).join("");

  $("#totals").innerHTML = rows.length
    ? rows.map((r) => `<tr><td>${esc(r.nombre)}</td><td>${r.pj}</td><td>${r.ataques}</td><td>${r.aces}</td><td>${r.recepciones}</td><td>${r.errores}</td></tr>`).join("")
    : '<tr><td colspan="6" class="empty">Primero registra deportistas para llevar sus estadísticas.</td></tr>';

  const hist = stats.filter((s) => athletes.some((a) => a.id == s.aid)).sort((x, y) => y.fecha.localeCompare(x.fecha) || y.id - x.id);
  $("#history").innerHTML = hist.length
    ? hist.map((s) => {
        const a = athletes.find((x) => x.id == s.aid);
        return `<div class="ath"><div><strong>${esc(a.nombre)} vs ${esc(s.rival)}</strong>
          <small>${esc(s.fecha)} · Ataques ${s.ataques} · Aces ${s.aces} · Recepciones ${s.recepciones} · Errores ${s.errores}</small></div>
          <button class="del" data-sdel="${s.id}" aria-label="Eliminar partido">Eliminar</button></div>`;
      }).join("")
    : '<p class="empty">Aún no hay partidos registrados.</p>';
}

function setToday() { $("#statDate").valueAsDate = new Date(); }

$("#statForm").onsubmit = (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const s = { id: Date.now(), aid: f.aid, fecha: f.fecha, rival: f.rival };
  METRICS.forEach((k) => (s[k] = Math.max(0, parseInt(f[k], 10) || 0)));
  stats.push(s);
  save("bellator_stats", stats);
  e.target.reset();
  setToday();
  renderStats();
  toast("Partido guardado");
};

$("#history").onclick = (e) => {
  const id = e.target.dataset.sdel;
  if (!id || !confirm("¿Eliminar este partido?")) return;
  stats = stats.filter((s) => s.id != id);
  save("bellator_stats", stats);
  renderStats();
};

/* ====== Inicio ====== */
renderProducts();
renderCart();
renderAthletes();
renderStats();
setToday();
