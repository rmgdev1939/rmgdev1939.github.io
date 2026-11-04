/* Chamba · app de chambas y servicios (versión de prueba, datos en este dispositivo) */
(() => {
'use strict';

const KEY = 'chamba.v1';
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => Date.now();
const H = 3600e3, D = 24 * H;

/* ---------- catálogo ---------- */
const CATS = [
  {id:'hogar', name:'Hogar', e:'🛠️', c:'#FFE9DE'},
  {id:'plomeria', name:'Plomería', e:'🚰', c:'#E3EBFF'},
  {id:'electricidad', name:'Electricidad', e:'⚡', c:'#FFF4CC'},
  {id:'limpieza', name:'Limpieza', e:'🧽', c:'#DDF5EA'},
  {id:'delivery', name:'Delivery', e:'🛵', c:'#FFE4E1'},
  {id:'mudanzas', name:'Mudanzas', e:'📦', c:'#F1E6D6'},
  {id:'tecnologia', name:'Tecnología', e:'💻', c:'#E6E4FF'},
  {id:'diseno', name:'Diseño', e:'🎨', c:'#FCE3F3'},
  {id:'clases', name:'Clases', e:'📚', c:'#E2F3FA'},
  {id:'belleza', name:'Belleza', e:'💅', c:'#FFE3EA'},
  {id:'eventos', name:'Eventos', e:'🎉', c:'#FFF0D6'},
  {id:'mecanica', name:'Mecánica', e:'🔧', c:'#E7ECEF'},
];
const CAT = Object.fromEntries(CATS.map(c => [c.id, c]));
const CITIES = ['Caracas','Valencia','Maracaibo','Barquisimeto','Coro','Maracay','Puerto La Cruz','Mérida','Remoto'];
const COLORS = ['#FF6B2C','#2F6BFF','#14A06B','#8B5CF6','#E5484D','#0EA5E9','#D97706','#DB2777'];

const PEOPLE = [
  {id:'p1', name:'María González', rating:4.9, done:38},
  {id:'p2', name:'José Rodríguez', rating:4.7, done:21},
  {id:'p3', name:'Andreína Pérez', rating:5.0, done:12},
  {id:'p4', name:'Luis Hernández', rating:4.8, done:57},
  {id:'p5', name:'Carolina Silva', rating:4.6, done:9},
  {id:'p6', name:'Daniel Medina', rating:4.9, done:44},
  {id:'p7', name:'Gabriela Rojas', rating:4.8, done:16},
  {id:'p8', name:'Kevin Torres', rating:4.5, done:7},
];
const PERSON = Object.fromEntries(PEOPLE.map(p => [p.id, p]));

function seedJobs() {
  const t = now();
  const J = (o, ago) => ({id:uid(), status:'abierta', applicants:[], createdAt:t - ago, ...o});
  return [
    J({title:'Reparar fuga en el lavaplatos', cat:'plomeria', pay:25, payType:'fijo', city:'Caracas', zone:'Los Palos Grandes', when:'Hoy', urgent:true, author:'p1', desc:'Gotea por debajo del fregadero, creo que es el sifón. Tengo algunas herramientas pero no el repuesto.'}, 35*60e3),
    J({title:'Delivery de tortas a 3 direcciones', cat:'delivery', pay:12, payType:'fijo', city:'Valencia', zone:'El Viñedo', when:'Hoy, 4 pm', urgent:true, author:'p5', desc:'Retirar en mi casa y entregar en 3 direcciones cercanas. Necesito moto y cava pequeña.'}, 2*H),
    J({title:'Logo y diseño de Instagram para panadería', cat:'diseno', pay:60, payType:'fijo', city:'Remoto', zone:'En línea', when:'Esta semana', author:'p7', desc:'Busco logo sencillo y 6 plantillas para posts. Estilo cálido, colores tierra.'}, 5*H),
    J({title:'Instalar 4 lámparas y un tomacorriente', cat:'electricidad', pay:8, payType:'hora', city:'Maracaibo', zone:'Tierra Negra', when:'Mañana', author:'p2', desc:'Lámparas ya compradas. Techo a 2,6 m, tengo escalera.'}, 7*H),
    J({title:'Limpieza profunda de apartamento (2 hab.)', cat:'limpieza', pay:35, payType:'fijo', city:'Caracas', zone:'El Cafetal', when:'Sábado', author:'p3', desc:'Incluye cocina, 2 baños y ventanas. Yo pongo los productos.'}, 9*H),
    J({title:'Clases de matemática para 4to año', cat:'clases', pay:6, payType:'hora', city:'Barquisimeto', zone:'Del Este', when:'Lun y Mié', author:'p4', desc:'Mi hija necesita reforzar funciones y trigonometría. 2 clases por semana de 1,5 h.'}, 20*H),
    J({title:'Mudanza pequeña: 10 cajas y una nevera', cat:'mudanzas', pay:45, payType:'fijo', city:'Coro', zone:'Centro', when:'Domingo', author:'p6', desc:'Del centro a Las Eugenias. Necesito camioneta y una persona más para cargar.'}, 26*H),
    J({title:'Formatear laptop e instalar programas', cat:'tecnologia', pay:15, payType:'fijo', city:'Maracay', zone:'Base Aragua', when:'Esta semana', author:'p8', desc:'Windows 11, Office y antivirus. Respaldar fotos antes de formatear.'}, 30*H),
    J({title:'Maquillaje para graduación', cat:'belleza', pay:20, payType:'fijo', city:'Valencia', zone:'Naguanagua', when:'Viernes 3 pm', author:'p3', desc:'Maquillaje social para mí y peinado sencillo. A domicilio.'}, 40*H),
    J({title:'Mesonero para cumpleaños (40 personas)', cat:'eventos', pay:5, payType:'hora', city:'Puerto La Cruz', zone:'Lechería', when:'Sábado 6 pm', author:'p1', desc:'Unas 5 horas. Servir pasapalos y bebidas. Camisa blanca.'}, 2*D),
    J({title:'Cambio de pastillas de freno', cat:'mecanica', pay:18, payType:'fijo', city:'Mérida', zone:'Av. Las Américas', when:'Mañana', author:'p4', desc:'Corolla 2012. Ya tengo las pastillas, solo mano de obra.'}, 3*D),
    J({title:'Pintar habitación de 3x4', cat:'hogar', pay:40, payType:'fijo', city:'Caracas', zone:'Chacao', when:'Esta semana', author:'p6', desc:'Paredes y techo, pintura incluida. Hay que mover algunos muebles.'}, 3*D + 4*H),
  ];
}

const REPLIES = [
  '¡Hola! Gracias por escribir 🙌 ¿Cuándo podrías empezar?',
  'Perfecto, me parece bien. ¿Me confirmas la hora?',
  'Dale, te espero. Te paso la ubicación exacta por aquí.',
  'Buenísimo 👌 ¿Aceptas pago móvil o efectivo?',
  'Excelente, cualquier cosa me avisas por aquí.',
];
const APPLY_MSGS = [
  'Tengo experiencia en esto, puedo ir hoy mismo. Llevo mis herramientas.',
  'Hola, estoy disponible y vivo cerca. Trabajo rápido y limpio.',
  'Puedo hacerlo mañana temprano. Tengo buenas referencias.',
];

/* ---------- estado ---------- */
let S;
function load() {
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || !S.jobs) S = fresh();
}
function fresh() {
  return {
    me: null, // {name, city, mode, bio, skills[], available, color}
    jobs: seedJobs(),
    applied: {},            // jobId -> {msg, offer, at, status}
    chats: {},              // chatId -> {id, with, jobId, msgs:[{from,text,at}], unread}
    earned: 0, doneCount: 0, ratingSum: 0, ratingN: 0,
    saved: {},
  };
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

/* ---------- utilidades UI ---------- */
const ago = t => {
  const m = Math.round((now() - t) / 60e3);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'ayer' : `hace ${d} días`;
};
const hhmm = t => new Date(t).toLocaleTimeString('es', {hour:'2-digit', minute:'2-digit'});
const money = (n, type) => `$${Number(n).toLocaleString('es')}${type === 'hora' ? '<small>/hora</small>' : ''}`;
const initials = n => (n || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const colorFor = s => COLORS[[...String(s)].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
function avatar(name, size = 34, color) {
  return `<span class="av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * .38)}px;background:${color || colorFor(name)}">${esc(initials(name))}</span>`;
}
function personOf(id) {
  if (id === 'me') return {name: S.me?.name || 'Tú', rating: S.ratingN ? S.ratingSum / S.ratingN : 5, done: S.doneCount, color: S.me?.color};
  return PERSON[id] || {name: id, rating: 4.8, done: 3};
}
const stars = r => `<span class="star">★</span> ${Number(r).toFixed(1)}`;

const ICON = {
  explorar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  mis:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
  publicar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  mensajes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
  perfil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  pin:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  clock:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  send:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>',
  back:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
};
const NAV = [
  {id:'explorar', label:'Explorar'},
  {id:'mis', label:'Mis chambas'},
  {id:'publicar', label:'Publicar', plus:true},
  {id:'mensajes', label:'Mensajes'},
  {id:'perfil', label:'Perfil'},
];

function unreadCount() { return Object.values(S.chats).reduce((a, c) => a + (c.unread || 0), 0); }
function newApplicants() { return S.jobs.filter(j => j.author === 'me').reduce((a, j) => a + j.applicants.filter(x => !x.seen).length, 0); }

function renderNav(route) {
  const un = unreadCount(), na = newApplicants();
  const badge = id => id === 'mensajes' && un ? `<span class="badge">${un}</span>` : id === 'mis' && na ? `<span class="badge">${na}</span>` : '';
  $('#tabbar').innerHTML = NAV.map(n => n.plus
    ? `<a class="tab plus ${route === n.id ? 'on' : ''}" href="#/${n.id}"><span class="plusc">${ICON[n.id]}</span>${n.label}</a>`
    : `<a class="tab ${route === n.id ? 'on' : ''}" href="#/${n.id}">${ICON[n.id]}${n.label}${badge(n.id)}</a>`).join('');
  $('#sideNav').innerHTML = NAV.filter(n => !n.plus).map(n =>
    `<a class="${route === n.id ? 'on' : ''}" href="#/${n.id}">${ICON[n.id]}${n.label}${badge(n.id)}</a>`).join('');
  $('#topAvatar').innerHTML = avatar(S.me?.name || 'Tú', 36, S.me?.color);
}

let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600);
}

function openSheet(html, opts = {}) {
  $('#sheet').innerHTML = `<div class="grab"></div>${opts.noClose ? '' : '<button class="sheet-x" data-close aria-label="Cerrar">✕</button>'}${html}`;
  $('#modal').hidden = false;
  $('#modal').dataset.locked = opts.noClose ? '1' : '';
  document.body.style.overflow = 'hidden';
}
function closeSheet() {
  $('#modal').hidden = true; document.body.style.overflow = '';
}

/* ---------- vistas ---------- */
const UI = {q:'', cat:'', city:'', sort:'recientes', misTab:'publicadas'};

function jobCard(j) {
  const c = CAT[j.cat], p = personOf(j.author);
  const ap = S.applied[j.id];
  const tag = j.author === 'me' ? '<span class="pill dark">Tuya</span>'
    : ap ? `<span class="pill ${ap.status === 'aceptada' ? 'green' : 'blue'}">${ap.status === 'aceptada' ? 'Te eligieron' : 'Postulado'}</span>`
    : j.urgent ? '<span class="pill hot">🔥 Urgente</span>' : '';
  return `<article class="card job" data-job="${j.id}">
    <div class="top">
      <div class="cat-ic" style="background:${c.c}">${c.e}</div>
      <div style="flex:1;min-width:0">
        <div class="row between" style="align-items:flex-start"><h3>${esc(j.title)}</h3>${tag}</div>
        <div class="meta row wrap" style="gap:10px"><span class="row" style="gap:4px">${ICON.pin}${esc(j.city)}${j.zone ? ' · ' + esc(j.zone) : ''}</span><span class="row" style="gap:4px">${ICON.clock}${esc(j.when)}</span></div>
      </div>
    </div>
    <p class="desc">${esc(j.desc)}</p>
    <div class="bottom">
      <div class="price">${money(j.pay, j.payType)}</div>
      <div class="who">${avatar(p.name, 26, p.color)}<span>${esc(p.name.split(' ')[0])}</span><span class="muted">${stars(p.rating)}</span></div>
    </div>
  </article>`;
}

function viewExplorar() {
  const open = S.jobs.filter(j => j.status === 'abierta');
  let list = open.filter(j => (!UI.cat || j.cat === UI.cat) && (!UI.city || j.city === UI.city));
  if (UI.q) {
    const q = UI.q.toLowerCase();
    list = list.filter(j => (j.title + ' ' + j.desc + ' ' + CAT[j.cat].name + ' ' + j.city + ' ' + j.zone).toLowerCase().includes(q));
  }
  if (UI.sort === 'pago') list.sort((a, b) => (b.payType === 'hora' ? b.pay * 4 : b.pay) - (a.payType === 'hora' ? a.pay * 4 : a.pay));
  else if (UI.sort === 'urgentes') list.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || b.createdAt - a.createdAt);
  else list.sort((a, b) => b.createdAt - a.createdAt);
  const total = open.reduce((a, j) => a + (j.payType === 'hora' ? j.pay * 4 : j.pay), 0);
  const first = (S.me?.name || '').split(' ')[0];

  return `
  <section class="hero"><div class="deco"></div><div class="deco2"></div><div class="inner">
    <h1>${first ? `¡Épale, ${esc(first)}! ` : ''}Encuentra <em>chamba</em> hoy mismo</h1>
    <p>Gana dinero haciendo lo que sabes, o consigue quien te resuelva en minutos.</p>
    <div class="stats"><div><b>${open.length}</b><span>chambas abiertas</span></div><div><b>$${total.toLocaleString('es')}</b><span>en pagos disponibles</span></div><div><b>${new Set(open.map(j => j.city)).size}</b><span>ciudades</span></div></div>
  </div></section>
  <label class="search">${ICON.explorar}<input id="q" type="search" placeholder="¿Qué chamba buscas? Ej: plomero, delivery…" value="${esc(UI.q)}" autocomplete="off">
    <select id="city" aria-label="Ciudad"><option value="">Todas</option>${CITIES.map(c => `<option ${UI.city === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
  <div class="chips"><button class="chip ${!UI.cat ? 'on' : ''}" data-cat="">Todas</button>${CATS.map(c => `<button class="chip ${UI.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.e} ${c.name}</button>`).join('')}</div>
  <div class="toolbar"><h2>${list.length} chamba${list.length === 1 ? '' : 's'}</h2>
    <div class="seg">${[['recientes','Recientes'],['pago','Mejor pago'],['urgentes','Urgentes']].map(([k, l]) => `<button data-sort="${k}" class="${UI.sort === k ? 'on' : ''}">${l}</button>`).join('')}</div></div>
  ${list.length ? `<div class="grid g3">${list.map(jobCard).join('')}</div>`
    : `<div class="empty card"><div class="big">🔎</div><h3>No hay chambas con ese filtro</h3><p>Prueba otra categoría o publica la tuya.</p><br><a class="btn primary" href="#/publicar">Publicar chamba</a></div>`}
  <div class="sec-title"><h2>Cómo funciona</h2></div>
  <div class="how">
    <div class="card"><span class="n">1</span><b>Publica o busca</b><p>Cuenta qué necesitas y cuánto pagas, o filtra por lo que sabes hacer.</p></div>
    <div class="card"><span class="n">2</span><b>Postúlate y conversa</b><p>Envía tu propuesta y cuadra los detalles por el chat de la app.</p></div>
    <div class="card"><span class="n">3</span><b>Cumple y califica</b><p>Al terminar, se marca la chamba como hecha y se califican mutuamente.</p></div>
  </div>`;
}

function jobDetail(id) {
  const j = S.jobs.find(x => x.id === id); if (!j) return;
  const c = CAT[j.cat], p = personOf(j.author), ap = S.applied[j.id], mine = j.author === 'me';
  let actions;
  if (mine) actions = `<a class="btn dark" href="#/mis" data-close>Ver postulantes (${j.applicants.length})</a>`;
  else if (ap) actions = `<button class="btn" data-chat-job="${j.id}">💬 Ir al chat</button><button class="btn" disabled>${ap.status === 'aceptada' ? '✅ Te eligieron' : '✓ Ya te postulaste'}</button>`;
  else actions = `<button class="btn" data-chat-job="${j.id}">💬 Preguntar</button><button class="btn primary" data-apply="${j.id}">Me interesa</button>`;
  openSheet(`
    <div class="row" style="gap:12px;padding-right:36px"><div class="cat-ic" style="background:${c.c}">${c.e}</div><div><span class="pill">${c.name}</span>${j.urgent ? ' <span class="pill hot">🔥 Urgente</span>' : ''}</div></div>
    <h2 style="margin-top:12px">${esc(j.title)}</h2>
    <p class="muted" style="font-size:13px;margin-top:4px">Publicada ${ago(j.createdAt)}</p>
    <div class="kv"><div><span>Pago</span><b>${money(j.pay, j.payType)}</b></div><div><span>Cuándo</span><b>${esc(j.when)}</b></div><div><span>Dónde</span><b>${esc(j.city)}</b></div></div>
    <p style="line-height:1.55;color:var(--ink2)">${esc(j.desc)}</p>
    ${j.zone ? `<p class="row muted" style="gap:5px;margin-top:10px;font-size:14px">${ICON.pin}${esc(j.zone)}, ${esc(j.city)}</p>` : ''}
    <div class="card row" style="padding:12px 14px;margin-top:14px;box-shadow:none">${avatar(p.name, 42, p.color)}<div class="li-main"><b>${esc(p.name)}${mine ? ' (tú)' : ''}</b><span>${stars(p.rating)} · ${p.done} chambas</span></div>${mine ? '' : '<span class="pill green">✔ Verificado</span>'}</div>
    <div class="sticky-actions">${actions}</div>`);
}

function applyForm(id) {
  const j = S.jobs.find(x => x.id === id);
  if (!S.me) return onboarding(() => applyForm(id));
  openSheet(`
    <h2>Postularme</h2><p class="muted" style="margin:4px 0 16px">${esc(j.title)}</p>
    <form id="applyF">
      <div class="field"><label>Tu mensaje</label><textarea name="msg" required maxlength="400" placeholder="Cuéntale por qué eres buena opción y cuándo puedes ir.">Hola, soy ${esc(S.me.name.split(' ')[0])}. Puedo encargarme ${j.when.toLowerCase().startsWith('hoy') ? 'hoy mismo' : 'en la fecha que indicas'}. ¿Te parece?</textarea></div>
      <div class="field"><label>Tu precio (USD)</label><input name="offer" type="number" min="1" step="1" value="${j.pay}" required><span class="hint">Puedes aceptar el precio publicado o proponer otro.</span></div>
      <button class="btn primary block" type="submit">Enviar postulación</button>
    </form>`);
  $('#applyF').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    S.applied[id] = {msg: f.get('msg'), offer: +f.get('offer'), at: now(), status: 'enviada'};
    const ch = chatFor(j.author, id);
    ch.msgs.push({from:'me', text: f.get('msg') + (Number(f.get('offer')) !== j.pay ? ` (Mi propuesta: $${f.get('offer')})` : ''), at: now()});
    save(); closeSheet(); toast('¡Postulación enviada! 🚀'); route();
    // simulación: el autor responde y luego te elige
    setTimeout(() => botReply(ch.id), 2200);
    setTimeout(() => {
      if (S.applied[id] && S.applied[id].status === 'enviada') {
        S.applied[id].status = 'aceptada';
        ch.msgs.push({from:'sys', text:`${personOf(j.author).name.split(' ')[0]} te eligió para esta chamba 🎉`, at: now()});
        ch.unread = (ch.unread || 0) + 1; save(); toast('🎉 ¡Te eligieron para una chamba!'); route();
      }
    }, 9000);
  };
}

function chatFor(withId, jobId) {
  const id = withId + ':' + jobId;
  if (!S.chats[id]) S.chats[id] = {id, with: withId, jobId, msgs: [], unread: 0};
  return S.chats[id];
}
function botReply(chatId) {
  const ch = S.chats[chatId]; if (!ch) return;
  const n = ch.msgs.filter(m => m.from === ch.with).length;
  ch.msgs.push({from: ch.with, text: REPLIES[n % REPLIES.length], at: now()});
  const viewing = location.hash === '#/chat/' + encodeURIComponent(chatId);
  if (!viewing) ch.unread = (ch.unread || 0) + 1;
  save(); route();
}

function viewPublicar() {
  if (!S.me) { setTimeout(() => onboarding(() => route()), 0); }
  const d = UI.draft || {cat:'hogar', payType:'fijo', city: S.me?.city || 'Caracas'};
  return `
  <div class="phead"><h1>Publicar una chamba</h1><p>Gratis. En minutos te empiezan a llegar postulaciones.</p></div>
  <form class="card form" id="pubF">
    <div class="field"><label>¿Qué necesitas?</label><input name="title" required maxlength="80" placeholder="Ej: Reparar la puerta del closet"></div>
    <div class="field"><label>Categoría</label><div class="opt-grid">${CATS.map(c => `<button type="button" class="opt ${d.cat === c.id ? 'on' : ''}" data-pcat="${c.id}"><span class="e">${c.e}</span>${c.name}</button>`).join('')}</div></div>
    <div class="field"><label>Detalles</label><textarea name="desc" required maxlength="600" placeholder="Explica el trabajo, materiales, horario…"></textarea></div>
    <div class="two">
      <div class="field"><label>Pago (USD)</label><input name="pay" type="number" min="1" step="1" required placeholder="25"></div>
      <div class="field"><label>Tipo de pago</label><select name="payType"><option value="fijo">Precio fijo</option><option value="hora" ${d.payType === 'hora' ? 'selected' : ''}>Por hora</option></select></div>
    </div>
    <div class="two">
      <div class="field"><label>Ciudad</label><select name="city">${CITIES.map(c => `<option ${d.city === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="field"><label>Zona</label><input name="zone" maxlength="40" placeholder="Ej: Chacao"></div>
    </div>
    <div class="field"><label>¿Cuándo?</label><input name="when" maxlength="30" placeholder="Hoy, mañana, sábado 10 am…" required></div>
    <label class="switch" style="margin-bottom:16px">🔥 Es urgente <input type="checkbox" name="urgent"></label>
    <button class="btn primary block" type="submit">Publicar chamba</button>
  </form>`;
}

function viewMis() {
  const mine = S.jobs.filter(j => j.author === 'me').sort((a, b) => b.createdAt - a.createdAt);
  const applied = Object.keys(S.applied).map(id => S.jobs.find(j => j.id === id)).filter(Boolean).sort((a, b) => S.applied[b.id].at - S.applied[a.id].at);
  const tabs = `<div class="seg" style="margin-bottom:14px"><button data-mis="publicadas" class="${UI.misTab === 'publicadas' ? 'on' : ''}">Publicadas (${mine.length})</button><button data-mis="postulado" class="${UI.misTab === 'postulado' ? 'on' : ''}">Me postulé (${applied.length})</button></div>`;
  let body;
  if (UI.misTab === 'publicadas') {
    body = mine.length ? mine.map(j => {
      const st = {abierta:['orange','Abierta'], asignada:['blue','En curso'], completada:['green','Completada']}[j.status];
      const apps = j.applicants.map(a => {
        const p = personOf(a.who);
        const acts = j.status === 'abierta' ? `<button class="btn sm green" data-accept="${j.id}|${a.who}">Elegir</button>`
          : j.assigned === a.who ? (j.status === 'asignada' ? `<button class="btn sm dark" data-complete="${j.id}">Marcar hecha</button>` : '<span class="pill green">✔ Hecha</span>') : '';
        return `<div class="applicant">${avatar(p.name, 40)}<div class="li-main" style="white-space:normal"><div class="row between"><b>${esc(p.name)}</b><span class="price" style="font-size:16px">$${a.offer}</span></div><span>${stars(p.rating)} · ${p.done} chambas</span><p>${esc(a.msg)}</p><div class="row" style="margin-top:10px;gap:8px">${acts}<button class="btn sm" data-chat-with="${a.who}|${j.id}">💬 Chat</button></div></div></div>`;
      }).join('');
      return `<div class="card" style="margin-bottom:12px;overflow:hidden">
        <div style="padding:14px 16px;border-bottom:1px solid var(--line)" class="row between"><div class="row" style="min-width:0"><div class="cat-ic" style="background:${CAT[j.cat].c};width:38px;height:38px;font-size:19px">${CAT[j.cat].e}</div><div class="li-main"><b>${esc(j.title)}</b><span>${money(j.pay, j.payType).replace(/<[^>]+>/g, '')} · ${esc(j.city)} · ${ago(j.createdAt)}</span></div></div><span class="pill ${st[0]}">${st[1]}</span></div>
        ${apps || `<div class="empty" style="padding:22px"><p>⏳ Esperando postulaciones… suelen llegar en minutos.</p></div>`}
      </div>`;
    }).join('') : `<div class="empty card"><div class="big">📋</div><h3>Aún no publicas chambas</h3><p>Publica lo que necesitas y recibe propuestas.</p><br><a class="btn primary" href="#/publicar">Publicar chamba</a></div>`;
    mine.forEach(j => j.applicants.forEach(a => a.seen = true)); save();
  } else {
    body = applied.length ? `<div class="grid">${applied.map(jobCard).join('')}</div>`
      : `<div class="empty card"><div class="big">🧰</div><h3>Todavía no te postulas</h3><p>Explora y toca «Me interesa» en una chamba.</p><br><a class="btn primary" href="#/explorar">Explorar chambas</a></div>`;
  }
  return `<div class="phead"><h1>Mis chambas</h1><p>Lo que publicaste y a lo que te postulaste.</p></div>${tabs}${body}`;
}

function viewMensajes() {
  const chats = Object.values(S.chats).filter(c => c.msgs.length).sort((a, b) => b.msgs.at(-1).at - a.msgs.at(-1).at);
  return `<div class="phead"><h1>Mensajes</h1><p>Cuadra los detalles sin compartir tu número.</p></div>
  ${chats.length ? `<div class="card" style="overflow:hidden">${chats.map(c => {
    const p = personOf(c.with), j = S.jobs.find(x => x.id === c.jobId), last = c.msgs.at(-1);
    return `<a class="list-item" href="#/chat/${encodeURIComponent(c.id)}">${avatar(p.name, 46, p.color)}<div class="li-main"><div class="row between"><b>${esc(p.name)}</b><span class="muted" style="font-size:12px;flex:none">${ago(last.at)}</span></div><span style="color:var(--ink2);font-weight:600;font-size:12.5px">${esc(j ? j.title : '')}</span><span>${last.from === 'me' ? 'Tú: ' : ''}${esc(last.text)}</span></div>${c.unread ? '<span class="dot"></span>' : ''}</a>`;
  }).join('')}</div>` : `<div class="empty card"><div class="big">💬</div><h3>Sin conversaciones</h3><p>Cuando te postules o te escriban, verás los chats aquí.</p></div>`}`;
}

function viewChat(id) {
  const c = S.chats[id];
  if (!c) return viewMensajes();
  c.unread = 0; save();
  const p = personOf(c.with), j = S.jobs.find(x => x.id === c.jobId);
  return `<div class="card chat">
    <div class="chat-head"><a href="#/mensajes" aria-label="Volver">${ICON.back}</a>${avatar(p.name, 40, p.color)}<div class="li-main"><b>${esc(p.name)}</b><span>${j ? esc(j.title) : ''}</span></div>${j ? `<button class="btn sm" data-job="${j.id}">Ver chamba</button>` : ''}</div>
    <div class="chat-body" id="chatBody">
      <div class="msg sys">🔒 Tu número nunca se comparte</div>
      ${c.msgs.map(m => m.from === 'sys' ? `<div class="msg sys">${esc(m.text)}</div>` : `<div class="msg ${m.from === 'me' ? 'me' : ''}">${esc(m.text)}<time>${hhmm(m.at)}</time></div>`).join('')}
    </div>
    <form class="chat-input" id="chatF"><input name="t" placeholder="Escribe un mensaje…" autocomplete="off" required><button class="btn primary" style="width:48px;padding:0" aria-label="Enviar">${ICON.send}</button></form>
  </div>`;
}

function viewPerfil() {
  if (!S.me) setTimeout(() => onboarding(() => route()), 0);
  const me = S.me || {name:'Invitado', city:'—', skills:[], bio:''};
  const rating = S.ratingN ? (S.ratingSum / S.ratingN).toFixed(1) : '—';
  const posted = S.jobs.filter(j => j.author === 'me').length;
  return `<div class="phead"><h1>Perfil</h1></div>
  <div class="card prof-head">${avatar(me.name, 68, me.color)}<div class="li-main"><h2>${esc(me.name)}</h2><span>${ICON.pin} ${esc(me.city)} · ${me.mode === 'ofrecer' ? 'Busca quien le ayude' : me.mode === 'buscar' ? 'Busca chamba' : 'Busca y ofrece chamba'}</span>${me.bio ? `<p style="margin-top:6px;font-size:14px;color:var(--ink2)">${esc(me.bio)}</p>` : ''}</div></div>
  <div class="stats3"><div class="card stat"><b>$${S.earned}</b><span>Ganado</span></div><div class="card stat"><b>${S.doneCount}</b><span>Chambas hechas</span></div><div class="card stat"><b>${rating === '—' ? '—' : '★ ' + rating}</b><span>Calificación</span></div></div>
  <div class="card form" style="margin-top:12px">
    <label class="switch" style="margin-bottom:14px">🟢 Disponible para chambas <input type="checkbox" id="avail" ${me.available !== false ? 'checked' : ''}></label>
    <div class="field"><label>Lo que sé hacer</label><div class="skill-tags">${(me.skills || []).length ? me.skills.map(s => `<span class="pill orange">${CAT[s].e} ${CAT[s].name}</span>`).join('') : '<span class="muted" style="font-size:14px">Aún no eliges habilidades</span>'}</div></div>
    <p class="muted" style="font-size:13.5px">Publicaste ${posted} chamba${posted === 1 ? '' : 's'} · te postulaste a ${Object.keys(S.applied).length}</p>
    <div class="row wrap" style="margin-top:16px;gap:8px"><button class="btn" id="editMe">✏️ Editar perfil</button><button class="btn" id="shareApp">📤 Compartir Chamba</button><button class="btn ${deferredInstall ? '' : 'hide'}" id="installApp">📲 Instalar app</button></div>
  </div>
  <div class="notice">ℹ️ <span>Esta es una <b>versión de prueba</b>. Todo lo que hagas se guarda solo en este dispositivo y las respuestas de otros usuarios son simuladas. <a href="#" id="resetDemo" style="text-decoration:underline;font-weight:700">Reiniciar demo</a></span></div>`;
}

/* ---------- onboarding ---------- */
function onboarding(after, edit) {
  const me = S.me || {name:'', city:'Caracas', mode:'ambas', skills:[], bio:''};
  const sel = new Set(me.skills || []);
  openSheet(`
    <div style="text-align:center;margin:6px 0 14px"><span class="logo" style="width:56px;height:56px;font-size:26px;border-radius:16px;margin:0 auto">ch</span></div>
    <h2 style="text-align:center">${edit ? 'Editar perfil' : 'Bienvenido a Chamba'}</h2>
    <p class="muted" style="text-align:center;margin:4px 0 18px">${edit ? 'Actualiza tus datos.' : 'Crea tu perfil en 20 segundos. Sin número de teléfono.'}</p>
    <form id="obF">
      <div class="field"><label>Tu nombre</label><input name="name" required maxlength="40" value="${esc(me.name)}" placeholder="Ej: Ana Martínez" autocomplete="name"></div>
      <div class="two">
        <div class="field"><label>Ciudad</label><select name="city">${CITIES.map(c => `<option ${me.city === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
        <div class="field"><label>Quiero…</label><select name="mode"><option value="ambas">Las dos cosas</option><option value="buscar" ${me.mode === 'buscar' ? 'selected' : ''}>Buscar chamba</option><option value="ofrecer" ${me.mode === 'ofrecer' ? 'selected' : ''}>Ofrecer chamba</option></select></div>
      </div>
      <div class="field"><label>¿Qué sabes hacer? <span class="muted">(opcional)</span></label><div class="opt-grid">${CATS.map(c => `<button type="button" class="opt ${sel.has(c.id) ? 'on' : ''}" data-skill="${c.id}"><span class="e">${c.e}</span>${c.name}</button>`).join('')}</div></div>
      <div class="field"><label>Sobre ti <span class="muted">(opcional)</span></label><input name="bio" maxlength="120" value="${esc(me.bio)}" placeholder="Ej: Electricista con 5 años de experiencia"></div>
      <button class="btn primary block" type="submit">${edit ? 'Guardar' : 'Empezar'}</button>
    </form>`, {noClose: !edit});
  $('#sheet').querySelectorAll('[data-skill]').forEach(b => b.onclick = () => { b.classList.toggle('on'); sel.has(b.dataset.skill) ? sel.delete(b.dataset.skill) : sel.add(b.dataset.skill); });
  $('#obF').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    S.me = {...me, name: f.get('name').trim(), city: f.get('city'), mode: f.get('mode'), bio: f.get('bio').trim(), skills: [...sel], color: me.color || '#FF6B2C', available: me.available !== false};
    if (!edit) seedWelcome();
    save(); closeSheet(); toast(edit ? 'Perfil actualizado' : `¡Listo, ${S.me.name.split(' ')[0]}! 🙌`);
    after ? after() : route();
  };
}
function seedWelcome() {
  const ch = chatFor('p6', S.jobs[S.jobs.length - 1].id);
  if (!ch.msgs.length) {
    ch.msgs.push({from:'p6', text:`¡Hola ${S.me.name.split(' ')[0]}! Vi tu perfil en Chamba. ¿Te interesa pintar una habitación esta semana?`, at: now() - 5 * 60e3});
    ch.unread = 1;
  }
}

/* ---------- router ---------- */
function route() {
  const h = location.hash.replace(/^#\/?/, '') || 'explorar';
  const [r, arg] = h.split('/');
  const v = $('#view');
  const active = r === 'chat' ? 'mensajes' : r;
  renderNav(active);
  const keepScroll = v.dataset.r === h;
  const y = window.scrollY;
  switch (r) {
    case 'publicar': v.innerHTML = viewPublicar(); break;
    case 'mis': v.innerHTML = viewMis(); renderNav(active); break;
    case 'mensajes': v.innerHTML = viewMensajes(); break;
    case 'chat': v.innerHTML = viewChat(decodeURIComponent(arg || '')); renderNav(active); { const b = $('#chatBody'); if (b) b.scrollTop = b.scrollHeight; } break;
    case 'perfil': v.innerHTML = viewPerfil(); break;
    default: v.innerHTML = viewExplorar();
  }
  v.dataset.r = h;
  if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
  bindView(r, arg);
}

function bindView(r, arg) {
  const q = $('#q');
  if (q) q.oninput = () => { UI.q = q.value; const pos = q.selectionStart; route(); const n = $('#q'); n.focus(); n.setSelectionRange(pos, pos); };
  const city = $('#city'); if (city) city.onchange = () => { UI.city = city.value; route(); };
  const pub = $('#pubF');
  if (pub) {
    let cat = (UI.draft && UI.draft.cat) || 'hogar';
    pub.querySelectorAll('[data-pcat]').forEach(b => b.onclick = () => { pub.querySelectorAll('[data-pcat]').forEach(x => x.classList.remove('on')); b.classList.add('on'); cat = b.dataset.pcat; });
    pub.onsubmit = e => {
      e.preventDefault();
      if (!S.me) return onboarding();
      const f = new FormData(pub);
      const j = {id: uid(), title: f.get('title').trim(), cat, desc: f.get('desc').trim(), pay: +f.get('pay'), payType: f.get('payType'), city: f.get('city'), zone: f.get('zone').trim(), when: f.get('when').trim(), urgent: !!f.get('urgent'), author: 'me', status: 'abierta', applicants: [], createdAt: now()};
      S.jobs.unshift(j); save(); UI.misTab = 'publicadas';
      toast('¡Chamba publicada! 🎉'); location.hash = '#/mis';
      simulateApplicants(j.id);
    };
  }
  const cf = $('#chatF');
  if (cf) cf.onsubmit = e => {
    e.preventDefault();
    const c = S.chats[decodeURIComponent(arg)], t = cf.t.value.trim(); if (!t) return;
    c.msgs.push({from:'me', text:t, at: now()}); save(); route();
    const b = $('#chatBody'); b.insertAdjacentHTML('beforeend', '<div class="typing">escribiendo…</div>'); b.scrollTop = b.scrollHeight;
    setTimeout(() => botReply(c.id), 1600);
    $('#chatF input').focus();
  };
  const em = $('#editMe'); if (em) em.onclick = () => onboarding(null, true);
  const av = $('#avail'); if (av) av.onchange = () => { if (S.me) { S.me.available = av.checked; save(); toast(av.checked ? 'Ahora estás disponible 🟢' : 'Pausaste tu disponibilidad'); } };
  const sh = $('#shareApp'); if (sh) sh.onclick = async () => {
    const data = {title:'Chamba', text:'Mira Chamba: consigue o publica trabajos rápido 👇', url: location.origin + location.pathname};
    try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(data.url); toast('Link copiado 📋'); } } catch (e) {}
  };
  const ins = $('#installApp'); if (ins) ins.onclick = async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; route(); };
  const rd = $('#resetDemo'); if (rd) rd.onclick = e => { e.preventDefault(); localStorage.removeItem(KEY); S = fresh(); UI.q = UI.cat = UI.city = ''; location.hash = '#/explorar'; route(); onboarding(); };
}

function simulateApplicants(jobId) {
  const pool = PEOPLE.slice().sort(() => Math.random() - .5).slice(0, 3);
  pool.forEach((p, i) => setTimeout(() => {
    const j = S.jobs.find(x => x.id === jobId); if (!j || j.status !== 'abierta') return;
    const offer = Math.max(1, Math.round(j.pay * (0.85 + Math.random() * 0.25)));
    j.applicants.push({who: p.id, msg: APPLY_MSGS[i % APPLY_MSGS.length], offer, at: now(), seen: false});
    const ch = chatFor(p.id, jobId);
    ch.msgs.push({from: p.id, text: `Hola, me postulé a «${j.title}». ${APPLY_MSGS[i % APPLY_MSGS.length]}`, at: now()}); ch.unread = (ch.unread || 0) + 1;
    save(); toast(`📩 ${p.name.split(' ')[0]} se postuló a tu chamba`); route();
  }, 3500 + i * 4500));
}

/* ---------- eventos globales ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-close],[data-job],[data-apply],[data-cat],[data-sort],[data-mis],[data-go],[data-chat-job],[data-chat-with],[data-accept],[data-complete],[data-rate]');
  if (!t) return;
  const d = t.dataset;
  if ('close' in d) { if ($('#modal').dataset.locked && t.classList.contains('modal-bg')) return; closeSheet(); if (t.tagName !== 'A') return; }
  if (d.job) return jobDetail(d.job);
  if (d.apply) return applyForm(d.apply);
  if (d.cat !== undefined && t.classList.contains('chip')) { UI.cat = d.cat; return route(); }
  if (d.sort) { UI.sort = d.sort; return route(); }
  if (d.mis) { UI.misTab = d.mis; return route(); }
  if (d.go) { location.hash = d.go; return; }
  if (d.chatJob) {
    if (!S.me) return onboarding(() => {});
    const j = S.jobs.find(x => x.id === d.chatJob); const c = chatFor(j.author, j.id); save(); closeSheet();
    location.hash = '#/chat/' + encodeURIComponent(c.id); return;
  }
  if (d.chatWith) { const [w, jid] = d.chatWith.split('|'); const c = chatFor(w, jid); save(); location.hash = '#/chat/' + encodeURIComponent(c.id); return; }
  if (d.accept) {
    const [jid, who] = d.accept.split('|'); const j = S.jobs.find(x => x.id === jid);
    j.status = 'asignada'; j.assigned = who;
    const c = chatFor(who, jid); c.msgs.push({from:'sys', text:'Elegiste a esta persona para la chamba ✅', at: now()});
    save(); toast(`Elegiste a ${personOf(who).name.split(' ')[0]} ✅`); route();
    setTimeout(() => { c.msgs.push({from: who, text:'¡Gracias por elegirme! 🙌 Te confirmo la hora por aquí.', at: now()}); c.unread = (c.unread || 0) + 1; save(); route(); }, 2000);
    return;
  }
  if (d.complete) {
    const j = S.jobs.find(x => x.id === d.complete); const p = personOf(j.assigned);
    openSheet(`<h2>¿Cómo te fue con ${esc(p.name.split(' ')[0])}?</h2><p class="muted" style="margin:6px 0 18px">Tu calificación ayuda a otros a elegir mejor.</p>
      <div class="row" style="justify-content:center;gap:6px;font-size:40px">${[1,2,3,4,5].map(n => `<button data-rate="${j.id}|${n}" style="font-size:40px;line-height:1" aria-label="${n} estrellas">⭐</button>`).join('')}</div>`);
    return;
  }
  if (d.rate) {
    const [jid, n] = d.rate.split('|'); const j = S.jobs.find(x => x.id === jid);
    j.status = 'completada'; j.rating = +n; save(); closeSheet(); toast(`¡Chamba completada! Calificaste con ${n} ⭐`); route(); return;
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden && !$('#modal').dataset.locked) closeSheet(); });
window.addEventListener('hashchange', () => { closeSheet(); route(); });

/* trabajos aceptados -> completar (lado trabajador): simulación de cobro */
setInterval(() => {
  let changed = false;
  for (const [id, a] of Object.entries(S.applied)) {
    if (a.status === 'aceptada' && now() - a.at > 60e3 && !a.paid) {
      const j = S.jobs.find(x => x.id === id); if (!j) continue;
      a.paid = true; a.status = 'pagada'; S.earned += a.offer; S.doneCount += 1; S.ratingSum += 5; S.ratingN += 1;
      const c = chatFor(j.author, id); c.msgs.push({from:'sys', text:`Chamba completada · Recibiste $${a.offer} y una calificación de 5 ⭐`, at: now()}); c.unread = (c.unread || 0) + 1;
      toast(`💸 Cobraste $${a.offer} por «${j.title}»`); changed = true;
    }
  }
  if (changed) { save(); route(); }
}, 5000);

/* PWA */
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; if (location.hash.includes('perfil')) route(); });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});

load();
route();
if (!S.me) setTimeout(() => onboarding(), 350);
})();
