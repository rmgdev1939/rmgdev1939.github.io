/* Súper Once · app de pedidos (vista previa R/DEV) */
const WA = '584126740960'; // wa.me público de la tienda (bio de Instagram)
const FREE_SHIP = 50;
const RATE_FALLBACK = 230.0; // se reemplaza por la tasa BCV en vivo si hay conexión

const CATS = [
  {id:'carniceria', n:'Carnicería Cortes', e:'🥩', bg:'#FDE3E3'},
  {id:'charcuteria', n:'Charcutería', e:'🧀', bg:'#FFF4CC'},
  {id:'panaderia', n:'Panadería', e:'🥖', bg:'#FBE9D6'},
  {id:'viveres', n:'Víveres', e:'🍚', bg:'#EEF2DF'},
  {id:'frutas', n:'Frutas y verduras', e:'🥑', bg:'#E4F6E3'},
  {id:'lacteos', n:'Lácteos y huevos', e:'🥛', bg:'#E6F1FB'},
  {id:'bebidas', n:'Bebidas', e:'🥤', bg:'#E3F4F6'},
  {id:'licores', n:'Licores', e:'🍾', bg:'#EFE6F7'},
  {id:'snacks', n:'Snacks y dulces', e:'🍫', bg:'#FBE7EF'},
  {id:'limpieza', n:'Limpieza', e:'🧽', bg:'#E3EEFA'},
  {id:'cuidado', n:'Cuidado personal', e:'🧴', bg:'#F2ECF9'},
  {id:'bebe', n:'Bebé', e:'🍼', bg:'#FDEFE3'},
];

// p = precio $, o = precio antes (oferta), u = unidad, k = se vende por kilo, pop = popularidad
const P = [
  // carnicería
  {id:'c1', c:'carniceria', n:'Carne molida de primera', b:'Cortes', e:'🥩', p:6.90, o:7.80, u:'kg', k:1, pop:98},
  {id:'c2', c:'carniceria', n:'Chuletón de pernil', b:'Cortes', e:'🍖', p:5.99, u:'kg', k:1, pop:90, t:'Nuevo'},
  {id:'c3', c:'carniceria', n:'Chuleta de peine', b:'Cortes', e:'🥓', p:6.49, u:'kg', k:1, pop:86},
  {id:'c4', c:'carniceria', n:'Pechuga de pollo', b:'Cortes', e:'🍗', p:5.20, o:5.90, u:'kg', k:1, pop:97},
  {id:'c5', c:'carniceria', n:'Muslos de pollo', b:'Cortes', e:'🍗', p:3.60, u:'kg', k:1, pop:80},
  {id:'c6', c:'carniceria', n:'Punta trasera', b:'Cortes', e:'🥩', p:10.90, u:'kg', k:1, pop:74, t:'Premium'},
  {id:'c7', c:'carniceria', n:'Costilla de res', b:'Cortes', e:'🍖', p:5.50, u:'kg', k:1, pop:70},
  {id:'c8', c:'carniceria', n:'Chorizo parrillero', b:'Cortes', e:'🌭', p:6.20, o:6.90, u:'kg', k:1, pop:84},
  // charcutería
  {id:'h1', c:'charcuteria', n:'Queso blanco duro', b:'Llanero', e:'🧀', p:5.90, o:6.80, u:'kg', k:1, pop:96},
  {id:'h2', c:'charcuteria', n:'Queso amarillo', b:'Paisa', e:'🧀', p:9.80, u:'kg', k:1, pop:82},
  {id:'h3', c:'charcuteria', n:'Jamón de pierna', b:'Plumrose', e:'🥓', p:8.90, u:'kg', k:1, pop:78},
  {id:'h4', c:'charcuteria', n:'Mortadela especial', b:'Plumrose', e:'🥓', p:4.50, u:'kg', k:1, pop:72},
  {id:'h5', c:'charcuteria', n:'Queso de mano', b:'Artesanal', e:'🧀', p:7.40, u:'kg', k:1, pop:68},
  // panadería
  {id:'b1', c:'panaderia', n:'Pan de jamón', b:'Súper Once', e:'🥐', p:12.99, u:'und', pop:95, t:'Ya disponible'},
  {id:'b2', c:'panaderia', n:'Pan canilla', b:'Súper Once', e:'🥖', p:0.80, u:'und', pop:94},
  {id:'b3', c:'panaderia', n:'Pan campesino', b:'Súper Once', e:'🍞', p:1.60, u:'und', pop:70},
  {id:'b4', c:'panaderia', n:'Golfeados (4 und)', b:'Súper Once', e:'🥮', p:3.20, u:'paq', pop:66},
  {id:'b5', c:'panaderia', n:'Torta de chocolate', b:'Súper Once', e:'🎂', p:9.50, u:'und', pop:60},
  // víveres
  {id:'v1', c:'viveres', n:'Harina de maíz 1 kg', b:'P.A.N.', e:'🌽', p:1.25, o:1.45, u:'und', pop:99},
  {id:'v2', c:'viveres', n:'Arroz blanco 1 kg', b:'Mary', e:'🍚', p:1.30, u:'und', pop:93},
  {id:'v3', c:'viveres', n:'Pasta larga 1 kg', b:'Capri', e:'🍝', p:1.70, u:'und', pop:88},
  {id:'v4', c:'viveres', n:'Aceite vegetal 1 L', b:'Vatel', e:'🫒', p:3.40, o:3.90, u:'und', pop:91},
  {id:'v5', c:'viveres', n:'Azúcar 1 kg', b:'Montalbán', e:'🍬', p:1.40, u:'und', pop:85},
  {id:'v6', c:'viveres', n:'Café molido 500 g', b:'Fama de América', e:'☕', p:5.60, u:'und', pop:89},
  {id:'v7', c:'viveres', n:'Caraotas negras 500 g', b:'Pantera', e:'🫘', p:1.50, u:'und', pop:76},
  {id:'v8', c:'viveres', n:'Atún en aceite 140 g', b:'Margarita', e:'🐟', p:1.90, u:'und', pop:79},
  {id:'v9', c:'viveres', n:'Mayonesa 445 g', b:'Mavesa', e:'🥫', p:3.10, u:'und', pop:77},
  {id:'v10', c:'viveres', n:'Salsa de tomate 397 g', b:'Heinz', e:'🍅', p:2.40, u:'und', pop:65},
  // frutas
  {id:'f1', c:'frutas', n:'Cambur', b:'Fresco', e:'🍌', p:1.10, u:'kg', k:1, pop:83},
  {id:'f2', c:'frutas', n:'Tomate', b:'Fresco', e:'🍅', p:1.60, u:'kg', k:1, pop:87},
  {id:'f3', c:'frutas', n:'Cebolla', b:'Fresco', e:'🧅', p:1.40, u:'kg', k:1, pop:86},
  {id:'f4', c:'frutas', n:'Aguacate', b:'Fresco', e:'🥑', p:2.80, o:3.30, u:'kg', k:1, pop:75},
  {id:'f5', c:'frutas', n:'Papa', b:'Fresco', e:'🥔', p:1.30, u:'kg', k:1, pop:82},
  {id:'f6', c:'frutas', n:'Plátano', b:'Fresco', e:'🍌', p:1.20, u:'und', pop:84},
  // lácteos
  {id:'l1', c:'lacteos', n:'Cartón de huevos (30)', b:'Granja', e:'🥚', p:5.90, o:6.80, u:'und', pop:97},
  {id:'l2', c:'lacteos', n:'Leche completa 1 L', b:'La Campiña', e:'🥛', p:2.20, u:'und', pop:88},
  {id:'l3', c:'lacteos', n:'Leche en polvo 900 g', b:'Nido', e:'🥛', p:12.50, u:'und', pop:74},
  {id:'l4', c:'lacteos', n:'Margarina 500 g', b:'Mavesa', e:'🧈', p:2.90, u:'und', pop:80},
  {id:'l5', c:'lacteos', n:'Yogurt de fresa 1 L', b:'Migurt', e:'🍓', p:3.20, u:'und', pop:62},
  // bebidas
  {id:'d1', c:'bebidas', n:'Refresco cola 2 L', b:'Coca-Cola', e:'🥤', p:2.50, u:'und', pop:90},
  {id:'d2', c:'bebidas', n:'Malta 355 ml (6 und)', b:'Maltín Polar', e:'🍺', p:4.80, o:5.40, u:'paq', pop:81},
  {id:'d3', c:'bebidas', n:'Agua mineral 5 L', b:'Minalba', e:'💧', p:2.10, u:'und', pop:78},
  {id:'d4', c:'bebidas', n:'Jugo de naranja 1.5 L', b:'Yukery', e:'🧃', p:2.70, u:'und', pop:67},
  // licores
  {id:'x1', c:'licores', n:'Cerveza Polar Pilsen (12)', b:'Polar', e:'🍺', p:10.50, o:11.90, u:'caja', pop:92},
  {id:'x2', c:'licores', n:'Ron añejo 0.75 L', b:'Santa Teresa', e:'🥃', p:9.90, u:'und', pop:73},
  {id:'x3', c:'licores', n:'Vino tinto 0.75 L', b:'Pomar', e:'🍷', p:8.50, u:'und', pop:58},
  // snacks
  {id:'s1', c:'snacks', n:'Papitas 150 g', b:'Pepito', e:'🍟', p:1.80, u:'und', pop:76},
  {id:'s2', c:'snacks', n:'Chocolate de leche', b:'Savoy', e:'🍫', p:1.30, u:'und', pop:72},
  {id:'s3', c:'snacks', n:'Galletas María', b:'Puig', e:'🍪', p:1.20, u:'und', pop:69},
  // limpieza
  {id:'z1', c:'limpieza', n:'Detergente en polvo 1 kg', b:'Ace', e:'🧺', p:3.90, o:4.50, u:'und', pop:85},
  {id:'z2', c:'limpieza', n:'Lavaplatos en crema 500 g', b:'Las Llaves', e:'🧽', p:1.90, u:'und', pop:79},
  {id:'z3', c:'limpieza', n:'Cloro 1 L', b:'Nevex', e:'🧴', p:1.20, u:'und', pop:77},
  {id:'z4', c:'limpieza', n:'Papel higiénico (4 rollos)', b:'Scott', e:'🧻', p:2.60, u:'paq', pop:90},
  // cuidado personal
  {id:'p1', c:'cuidado', n:'Gel limpiador hidratante', b:'CeraVe', e:'🧴', p:16.90, u:'und', pop:71, t:'Dermo'},
  {id:'p2', c:'cuidado', n:'Loción hidratante facial PM', b:'CeraVe', e:'🧴', p:19.50, u:'und', pop:66, t:'Dermo'},
  {id:'p3', c:'cuidado', n:'Agua micelar 296 ml', b:'CeraVe', e:'💧', p:14.20, u:'und', pop:63, t:'Dermo'},
  {id:'p4', c:'cuidado', n:'Champú 400 ml', b:'Head & Shoulders', e:'🧴', p:6.30, u:'und', pop:68},
  {id:'p5', c:'cuidado', n:'Crema dental 100 ml', b:'Colgate', e:'🪥', p:2.10, u:'und', pop:80},
  // bebé
  {id:'y1', c:'bebe', n:'Pañales talla M (40)', b:'Huggies', e:'👶', p:13.90, o:15.50, u:'paq', pop:75},
  {id:'y2', c:'bebe', n:'Toallitas húmedas (80)', b:'Huggies', e:'🧻', p:3.20, u:'paq', pop:64},
];

const COMBOS = [
  {id:'k1', n:'Combo Parrillero', e:'🔥', items:['1 kg chorizo','1.5 kg costilla','1 kg chuleta','Pan canilla x4','Refresco 2 L'], p:24.90, o:29.40, s:'¡Nos volvimos locos!'},
  {id:'k2', n:'Combo Desayuno', e:'🍳', items:['Harina P.A.N. x2','Huevos (30)','Queso blanco 1/2 kg','Margarina','Café 500 g'], p:15.90, o:18.10, s:'Rinde toda la semana'},
  {id:'k3', n:'Combo Mercado Básico', e:'🛒', items:['Harina x3','Arroz x2','Pasta x2','Aceite 1 L','Azúcar','Caraotas'], p:14.50, o:16.80, s:'Lo que tu cocina necesita'},
  {id:'k4', n:'Combo Limpieza', e:'🧼', items:['Detergente 1 kg','Lavaplatos','Cloro x2','Papel (4 rollos)'], p:9.50, o:11.10, s:'Casa brillante'},
  {id:'k5', n:'Combo Punto Naranja', e:'🍊', items:['Queso blanco 1 kg','Huevos (30)','Carne molida 1 kg'], p:16.90, o:19.80, s:'Solo este fin de semana'},
  {id:'k6', n:'Combo Fin de Semana', e:'🍻', items:['Polar Pilsen (12)','Papitas x2','Hielo','Chorizo 1/2 kg'], p:17.90, o:20.60, s:'Para compartir en familia'},
];

const SLIDES = [
  {cls:'s-red', s:'¡Nos volvimos locos!', h:'Combo Parrillero', p:'Chorizo, costilla, chuleta, pan y refresco por solo $24.90.', btn:'Lo quiero', go:{combo:'k1'}, art:'🔥🥩'},
  {cls:'s-green', s:'Tu próxima compra', h:'Empieza aquí', p:'Haz tu mercado desde el celular y recíbelo en casa. Pide por WhatsApp en segundos.', btn:'Ver catálogo', go:{view:'catalogo'}, art:'🛒'},
  {cls:'s-orange', s:'Solo este fin de semana', h:'Punto Naranja', p:'Ofertas destacadas en queso, huevos y carnes.', btn:'Ver ofertas', go:{view:'ofertas'}, art:'🍊'},
  {cls:'s-yellow', s:'Ahora con Cashea', h:'Compra hoy, paga después', p:'Haz tu mercado y págalo en cuotas sin intereses.', btn:'Saber más', go:{view:'cashea'}, art:'💳'},
];

/* ---------- estado ---------- */
const store = {
  get(k, d){ try{ const v = localStorage.getItem('so_'+k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem('so_'+k, JSON.stringify(v)); }catch(e){} },
};
let cart = store.get('cart', {});          // id -> cantidad
let favs = new Set(store.get('favs', []));
let cur = store.get('cur', 'usd');
let rate = store.get('rate', null) || {v: RATE_FALLBACK, src:'referencial', manual:false};
let delivery = 'delivery';
let curCat = 'all', curView = 'inicio';
const prof = store.get('prof', {});

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const byId = Object.fromEntries([...P, ...COMBOS.map(c => ({...c, c:'combo', u:'combo', combo:1}))].map(x => [x.id, x]));
const catOf = id => CATS.find(c => c.id === id);

/* ---------- formato ---------- */
const fUsd = v => '$' + v.toFixed(2);
const fBs = v => 'Bs ' + (v * rate.v).toLocaleString('es-VE', {minimumFractionDigits:2, maximumFractionDigits:2});
const main = v => cur === 'usd' ? fUsd(v) : fBs(v);
const alt = v => cur === 'usd' ? fBs(v) : fUsd(v);
const step = p => p.k ? 0.5 : 1;
const fQty = (p, q) => p.k ? (q % 1 ? q.toFixed(1) : q) + ' kg' : q;

/* ---------- tarjetas ---------- */
function card(p){
  const q = cart[p.id] || 0, c = catOf(p.c);
  const off = p.o ? Math.round((1 - p.p / p.o) * 100) : 0;
  return `<article class="pc" data-id="${p.id}">
    <div class="pc-img" style="background:${c.bg}">
      <span class="em">${p.e}</span>
      ${off ? `<span class="off">-${off}%</span>` : ''}
      ${p.t ? `<span class="tagc">${p.t}</span>` : ''}
      <button class="fav ${favs.has(p.id)?'on':''}" data-fav="${p.id}" aria-label="Favorito">${favs.has(p.id)?'❤️':'🤍'}</button>
    </div>
    <div class="pc-b">
      <span class="brand-s">${p.b}</span>
      <h4>${p.n}</h4>
      <div class="price"><b>${main(p.p)}</b>${p.k?'<span class="unit">/kg</span>':''}${p.o?`<s>${main(p.o)}</s>`:''}<span class="alt">≈ ${alt(p.p)}</span></div>
      ${ctl(p, q)}
    </div>
  </article>`;
}
function ctl(p, q){
  return q ? `<div class="qty"><button data-dec="${p.id}" aria-label="Menos">−</button><span>${fQty(p,q)}</span><button data-inc="${p.id}" aria-label="Más">+</button></div>`
           : `<button class="add" data-inc="${p.id}">＋ Agregar</button>`;
}
function comboCard(k){
  const q = cart[k.id] || 0;
  return `<article class="combo" data-id="${k.id}">
    <span class="em">${k.e}</span>
    <small>${k.s}</small>
    <h4>${k.n}</h4>
    <ul>${k.items.map(i => `<li>${i}</li>`).join('')}</ul>
    <div class="cp"><b>${main(k.p)}</b><s>${main(k.o)}</s><span class="alt">Ahorras ${main(k.o-k.p)}</span></div>
    ${ctl(k, q)}
  </article>`;
}

/* ---------- render ---------- */
function renderStatic(){
  $('#sideCats').innerHTML = `<button data-cat="all" class="on">🛒 Todo el súper</button>
    <button data-go="ofertas">🔥 Ofertas</button><button data-go="combos">🎁 Combos</button>` +
    CATS.map(c => `<button data-cat="${c.id}">${c.e} ${c.n}</button>`).join('');
  $('#catStrip').innerHTML = `<button data-go="ofertas"><span class="ci" style="background:#FFE1E1">🔥</span>Ofertas</button>
    <button data-go="combos"><span class="ci" style="background:#FFF3B0">🎁</span>Combos</button>` +
    CATS.map(c => `<button data-cat="${c.id}"><span class="ci" style="background:${c.bg}">${c.e}</span>${c.n}</button>`).join('');
  $('#chips').innerHTML = `<button data-chip="all" class="on">Todo</button>` + CATS.map(c => `<button data-chip="${c.id}">${c.e} ${c.n}</button>`).join('');
  $('#hero').innerHTML = SLIDES.map((s,i) => `<div class="slide ${s.cls} ${i?'':'on'}">
      <small>${s.s}</small><h2>${s.h}</h2><p>${s.p}</p>
      <button class="btn btn-y" data-slide="${i}">${s.btn} ›</button><div class="art">${s.art}</div></div>`).join('');
  $('#heroDots').innerHTML = SLIDES.map((_,i) => `<button class="${i?'':'on'}" data-dot="${i}" aria-label="Banner ${i+1}"></button>`).join('');
  $('#waInfo').href = `https://wa.me/${WA}?text=${encodeURIComponent('¡Hola Súper Once! Tengo una consulta 😊')}`;
}

function renderProducts(){
  const ofertas = P.filter(p => p.o).sort((a,b) => (b.o-b.p)/b.o - (a.o-a.p)/a.o);
  $('#rowOfertas').innerHTML = ofertas.slice(0, 10).map(card).join('');
  $('#rowCombos').innerHTML = COMBOS.slice(0, 3).map(comboCard).join('');
  $('#rowCarne').innerHTML = P.filter(p => p.c === 'carniceria').map(card).join('');
  $('#gridTop').innerHTML = [...P].sort((a,b) => b.pop - a.pop).slice(0, 12).map(card).join('');
  $('#gridOfertas').innerHTML = ofertas.map(card).join('');
  $('#gridCombos').innerHTML = COMBOS.map(comboCard).join('');
  const fl = P.filter(p => favs.has(p.id));
  $('#gridFav').innerHTML = fl.map(card).join('');
  $('#emptyFav').hidden = fl.length > 0;
  renderCatalog();
}

function renderCatalog(){
  const q = $('#q').value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  let list = P.filter(p => curCat === 'all' || p.c === curCat);
  if (q) list = P.filter(p => (p.n+' '+p.b+' '+catOf(p.c).n).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(q));
  const s = $('#sort').value;
  list.sort(s==='asc' ? (a,b)=>a.p-b.p : s==='desc' ? (a,b)=>b.p-a.p : s==='off' ? (a,b)=>((b.o||b.p)-b.p)/(b.o||b.p)-((a.o||a.p)-a.p)/(a.o||a.p) : (a,b)=>b.pop-a.pop);
  $('#gridCat').innerHTML = list.map(card).join('');
  $('#emptyCat').hidden = list.length > 0;
  $('#catTitle').textContent = q ? `Resultados para “${$('#q').value.trim()}”` : curCat === 'all' ? 'Todo el súper' : catOf(curCat).e + ' ' + catOf(curCat).n;
}

function totals(){
  let t = 0, save = 0, n = 0;
  for (const [id, q] of Object.entries(cart)){ const p = byId[id]; if(!p) continue; t += p.p*q; if (p.o) save += (p.o-p.p)*q; n += p.k ? 1 : q; }
  return {t, save, n};
}

function renderCart(){
  const ids = Object.keys(cart).filter(id => byId[id]);
  const {t, save, n} = totals();
  $('#cartItems').innerHTML = ids.length ? ids.map(id => {
    const p = byId[id], q = cart[id], bg = p.combo ? '#FFF3B0' : catOf(p.c).bg;
    return `<div class="ci-row"><div class="ci-em" style="background:${bg}">${p.e}</div>
      <div><div class="ci-n">${p.n}</div><div class="ci-p">${main(p.p)}${p.k?'/kg':''} · ${main(p.p*q)}</div></div>
      <div class="ci-q"><button data-dec="${id}">−</button><span>${fQty(p,q)}</span><button data-inc="${id}">+</button></div></div>`;
  }).join('') : `<div class="cart-empty"><span>🛒</span>Tu carrito está vacío.<br>Agrega productos y envía tu pedido por WhatsApp.</div>`;
  $('#tUsd').textContent = cur === 'usd' ? fUsd(t) : fBs(t);
  $('#tBs').textContent = cur === 'usd' ? fBs(t) : fUsd(t);
  $('#tBs').previousElementSibling.textContent = cur === 'usd' ? 'En bolívares (BCV)' : 'En dólares';
  $('#tSave').hidden = !save; $('#tSave').textContent = `🎉 Estás ahorrando ${main(save)}`;
  const left = FREE_SHIP - t;
  $('#shipBar').innerHTML = (delivery === 'retiro') ? '🏪 Retiras en tienda: Av. Independencia, Coro. Te avisamos cuando esté listo.'
    : left > 0 ? `Te faltan <b>${main(left)}</b> para el <b>delivery gratis</b> 🛵<div class="track"><div class="fill" style="width:${Math.min(100,t/FREE_SHIP*100)}%"></div></div>`
    : `🎉 ¡Tienes <b>delivery gratis</b>!<div class="track"><div class="fill" style="width:100%"></div></div>`;
  $('#sendWa').disabled = !ids.length;
  $('#cartCount').textContent = n;
  $('#fcCount').textContent = n; $('#fcTotal').textContent = main(t);
  $('#floatCart').hidden = !ids.length;
  document.body.classList.toggle('has-cart', ids.length > 0);
  $('#repeatBtn').hidden = !(store.get('last', null) && !ids.length);
  $('#clearBtn').hidden = !ids.length;
  $('#fAddr').style.display = delivery === 'retiro' ? 'none' : '';
}

function refreshCards(id){
  $$(`[data-id="${id}"]`).forEach(el => {
    const p = byId[id], box = el.querySelector('.qty, .add');
    if (box) box.outerHTML = ctl(p, cart[id] || 0);
  });
}

/* ---------- acciones ---------- */
function change(id, dir){
  const p = byId[id]; if (!p) return;
  const s = step(p), before = cart[id] || 0;
  let q = before + dir * s;
  if (dir > 0 && before === 0 && p.k) q = 1;
  if (q <= 0) delete cart[id]; else cart[id] = Math.round(q*10)/10;
  store.set('cart', cart);
  refreshCards(id); renderCart();
  if (dir > 0 && before === 0){ toast(`${p.e} ${p.n} agregado`); const b = $('#cartCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
}

function toggleFav(id){
  favs.has(id) ? favs.delete(id) : favs.add(id);
  store.set('favs', [...favs]);
  $$(`[data-fav="${id}"]`).forEach(b => { b.classList.toggle('on', favs.has(id)); b.textContent = favs.has(id) ? '❤️' : '🤍'; });
  if (curView === 'favoritos') renderProducts();
  toast(favs.has(id) ? 'Guardado en favoritos' : 'Quitado de favoritos');
}

function go(view){
  if (view === 'cashea'){ go('inicio'); setTimeout(() => $('#cashea').scrollIntoView({behavior:'smooth', block:'center'}), 50); return; }
  curView = view;
  $$('.view').forEach(v => v.classList.toggle('on', v.id === 'v-'+view));
  $$('.bottom button').forEach(b => b.classList.toggle('on', b.dataset.go === view));
  if (view === 'favoritos') renderProducts();
  window.scrollTo({top:0, behavior:'smooth'});
}
function openCat(id){
  curCat = id; $('#q').value = '';
  $$('#chips button').forEach(b => b.classList.toggle('on', b.dataset.chip === id));
  $$('#sideCats [data-cat]').forEach(b => b.classList.toggle('on', b.dataset.cat === id));
  renderCatalog(); go('catalogo');
}

function openCart(){ $('#cartPanel').classList.add('open'); $('#scrim').classList.add('on'); }
function closeCart(){ $('#cartPanel').classList.remove('open'); $('#scrim').classList.remove('on'); }

function sendOrder(){
  const ids = Object.keys(cart).filter(id => byId[id]);
  if (!ids.length) return;
  const name = $('#fName').value.trim(), addr = $('#fAddr').value.trim();
  if (!name){ $('#fName').focus(); toast('Escribe tu nombre para el pedido'); return; }
  if (delivery === 'delivery' && !addr){ $('#fAddr').focus(); toast('Indica tu dirección para el delivery'); return; }
  const {t, save} = totals();
  const lines = ids.map(id => { const p = byId[id], q = cart[id]; return `• ${fQty(p,q)}${p.k?'':' x'} ${p.n}${p.b && !p.combo ? ' ('+p.b+')' : ''} = ${fUsd(p.p*q)}`; });
  const msg = [
    '🛒 *NUEVO PEDIDO · Súper Once*', '',
    `👤 *Cliente:* ${name}`,
    delivery === 'delivery' ? `🛵 *Delivery a:* ${addr}` : '🏪 *Retiro en tienda*',
    `💳 *Pago:* ${$('#fPay').value}`, '',
    '*Productos:*', ...lines, '',
    `*TOTAL: ${fUsd(t)}*`,
    `*En Bs: ${fBs(t)}* (tasa BCV ${rate.v.toFixed(2)})`,
    save ? `Ahorro con ofertas: ${fUsd(save)}` : '',
    delivery === 'delivery' ? (t >= FREE_SHIP ? '✅ Aplica delivery gratis' : 'Delivery: por confirmar según zona') : '',
    $('#fNote').value.trim() ? `\n📝 *Notas:* ${$('#fNote').value.trim()}` : '',
    '', '_Los productos por kilo se ajustan al peso real._',
  ].filter((l, i, a) => l !== '' || a[i-1] !== '').join('\n');
  store.set('prof', {name, addr, pay: $('#fPay').value});
  store.set('last', cart);
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
  toast('Abriendo WhatsApp con tu pedido…');
}

let toastT;
function toast(m){ const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 1800); }

/* ---------- tasa BCV ---------- */
function showRate(){
  $('#rateV').textContent = 'Bs ' + rate.v.toLocaleString('es-VE', {minimumFractionDigits:2, maximumFractionDigits:2});
  $('#rateSrc').textContent = rate.manual ? 'Tasa ajustada manualmente.' : rate.src === 'BCV' ? `Tasa oficial BCV${rate.d ? ' · ' + rate.d : ''}.` : 'Tasa referencial (sin conexión). Puedes ajustarla.';
}
async function loadRate(){
  if (rate.manual) return showRate();
  try{
    const r = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {cache:'no-store'});
    const j = await r.json();
    const v = +(j.promedio || j.precio);
    if (v > 0){ rate = {v, src:'BCV', d: j.fechaActualizacion ? new Date(j.fechaActualizacion).toLocaleDateString('es-VE') : ''}; store.set('rate', rate); }
  }catch(e){}
  showRate(); rerenderPrices();
}
function rerenderPrices(){ renderProducts(); renderCart(); }

/* ---------- horario ---------- */
function openStatus(){
  const h = new Date(new Date().toLocaleString('en-US', {timeZone:'America/Caracas'})).getHours();
  const open = h >= 8 && h < 22;
  ['#openPill', '#openPill2'].forEach(s => { const e = $(s); e.textContent = open ? '● Abierto ahora' : '● Cerrado · abre 8:00 am'; e.classList.toggle('closed', !open); });
}

/* ---------- ofertas: cuenta regresiva al domingo 10pm ---------- */
function countdown(){
  const now = new Date(new Date().toLocaleString('en-US', {timeZone:'America/Caracas'}));
  const end = new Date(now); end.setDate(now.getDate() + ((7 - now.getDay()) % 7)); end.setHours(22,0,0,0);
  if (end <= now) end.setDate(end.getDate() + 7);
  const s = Math.floor((end - now)/1000), d = Math.floor(s/86400), h = Math.floor(s%86400/3600), m = Math.floor(s%3600/60);
  $('#countdown').textContent = `${d ? d+'d ' : ''}${h}h ${m}m`;
}

/* ---------- banner ---------- */
let slide = 0, slideT;
function setSlide(i){
  slide = (i + SLIDES.length) % SLIDES.length;
  $$('.slide').forEach((s, j) => s.classList.toggle('on', j === slide));
  $$('#heroDots button').forEach((s, j) => s.classList.toggle('on', j === slide));
  clearInterval(slideT); slideT = setInterval(() => setSlide(slide + 1), 5000);
}

/* ---------- instalar (PWA) ---------- */
let deferred = null;
const isStandalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; maybeInstallToast(); });
function maybeInstallToast(){
  if (isStandalone || store.get('noInstall', false)) return;
  setTimeout(() => { $('#installToast').hidden = false; }, 9000);
}
async function doInstall(){
  if (deferred){ deferred.prompt(); await deferred.userChoice; deferred = null; $('#installToast').hidden = true; return; }
  if (isIOS) toast('En Safari: toca Compartir ⬆️ y luego “Agregar a inicio”');
  else toast('Abre el menú ⋮ del navegador y elige “Instalar app”');
}

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('button, a'); if (!t) return;
  const d = t.dataset;
  if (d.inc){ change(d.inc, 1); return; }
  if (d.dec){ change(d.dec, -1); return; }
  if (d.fav){ e.stopPropagation(); toggleFav(d.fav); return; }
  if (d.go){ e.preventDefault(); go(d.go); return; }
  if (d.cat){ e.preventDefault(); openCat(d.cat); return; }
  if (d.chip){ openCat(d.chip); return; }
  if (d.cur){ cur = d.cur; store.set('cur', cur); $$('.cur button').forEach(b => b.classList.toggle('on', b.dataset.cur === cur)); rerenderPrices(); return; }
  if (d.del){ delivery = d.del; $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.del === delivery)); renderCart(); return; }
  if (d.dot){ setSlide(+d.dot); return; }
  if (d.slide){ const g = SLIDES[+d.slide].go; if (g.view) go(g.view); if (g.combo){ change(g.combo, 1); openCart(); } return; }
});
$('#cartBtn').onclick = openCart; $('#floatCart').onclick = openCart;
$('#cartClose').onclick = closeCart; $('#scrim').onclick = closeCart;
$('#sendWa').onclick = sendOrder;
$('#clearBtn').onclick = () => { cart = {}; store.set('cart', cart); rerenderPrices(); };
$('#repeatBtn').onclick = () => { cart = {...store.get('last', {})}; store.set('cart', cart); rerenderPrices(); toast('Tu último pedido está en el carrito'); };
$('#q').addEventListener('input', () => { if (curView !== 'catalogo') go('catalogo'); renderCatalog(); });
$('#sort').onchange = renderCatalog;
$('#rateBtn').onclick = () => { $('#rateInput').value = rate.v.toFixed(2); $('#rateSheet').hidden = false; };
$('#rateCancel').onclick = () => $('#rateSheet').hidden = true;
$('#rateSave').onclick = () => { const v = +$('#rateInput').value; if (v > 0){ rate = {v, src:'manual', manual:true}; store.set('rate', rate); showRate(); rerenderPrices(); } $('#rateSheet').hidden = true; };
$('#installBtn').onclick = doInstall; $('#installBtn2').onclick = doInstall;
$('#installX').onclick = () => { $('#installToast').hidden = true; store.set('noInstall', true); };
['#fName', '#fAddr'].forEach(s => $(s).addEventListener('change', () => store.set('prof', {...store.get('prof', {}), name: $('#fName').value, addr: $('#fAddr').value})));

/* ---------- inicio ---------- */
$('#fName').value = prof.name || ''; $('#fAddr').value = prof.addr || ''; if (prof.pay) $('#fPay').value = prof.pay;
$$('.cur button').forEach(b => b.classList.toggle('on', b.dataset.cur === cur));
if (isStandalone) $('#installCard').hidden = true;
if (isIOS && !isStandalone) maybeInstallToast();
renderStatic(); showRate(); rerenderPrices(); openStatus(); countdown(); setSlide(0);
setInterval(() => { openStatus(); countdown(); }, 60000);
loadRate();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
