/* Chamba · app de chambas y servicios (usuarios reales con Supabase) */
(() => {
'use strict';

const SB_URL = 'https://sowvoofqokxogeirdhgo.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvd3Zvb2Zxb2t4b2dlaXJkaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyODIwNjYsImV4cCI6MjEwOTg1ODA2Nn0.-BuxGYAcz4pbda8GYZUXqPPUqDwck6HSu_zTv1zQzGw';
const ADMIN_EMAIL = 'rmoringutierrez@gmail.com';
const sb = window.supabase.createClient(SB_URL, SB_KEY, {auth: {persistSession: true, autoRefreshToken: true}});

const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const now = () => Date.now();
const T = d => new Date(d).getTime();

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
const catOf = id => CAT[id] || CAT.hogar;
const CITIES = ['Caracas','Valencia','Maracaibo','Barquisimeto','Coro','Maracay','Puerto La Cruz','Mérida','Remoto'];
const COLORS = ['#FF6B2C','#2F6BFF','#14A06B','#8B5CF6','#E5484D','#0EA5E9','#D97706','#DB2777'];

/* ---------- estado ---------- */
const D = {session:null, uid:null, email:'', me:null, profiles:{}, jobs:[], apps:[], msgs:[], loaded:false};
const isAdmin = () => D.email === ADMIN_EMAIL;
let lastRead = {};
try { lastRead = JSON.parse(localStorage.getItem('chamba.read') || '{}'); } catch (e) {}
const saveRead = () => { try { localStorage.setItem('chamba.read', JSON.stringify(lastRead)); } catch (e) {} };

async function loadAll() {
  if (!D.uid) {
    const [p, j] = await Promise.all([sb.from('profiles').select('*').limit(2000), sb.from('jobs').select('*').order('created_at', {ascending:false}).limit(500)]);
    if (p.error || j.error) { console.error(p.error || j.error); toast('Sin conexión. Reintentando…'); return; }
    D.profiles = Object.fromEntries(p.data.map(x => [x.id, x])); D.jobs = j.data; D.apps = []; D.msgs = []; D.me = null; D.loaded = true;
    return;
  }
  const [p, j, a, m] = await Promise.all([
    sb.from('profiles').select('*').limit(2000),
    sb.from('jobs').select('*').order('created_at', {ascending:false}).limit(500),
    sb.from('applications').select('*').order('created_at', {ascending:false}).limit(2000),
    sb.from('messages').select('*').order('created_at', {ascending:true}).limit(3000),
  ]);
  const err = p.error || j.error || a.error || m.error;
  if (err) { console.error(err); toast('Sin conexión. Reintentando…'); return; }
  D.profiles = Object.fromEntries(p.data.map(x => [x.id, x]));
  D.me = D.profiles[D.uid] || null;
  D.jobs = j.data; D.apps = a.data; D.msgs = m.data; D.loaded = true;
}

/* ---------- utilidades UI ---------- */
const ago = t => {
  const m = Math.round((now() - T(t)) / 60e3);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'ayer' : `hace ${d} días`;
};
const hhmm = t => new Date(t).toLocaleTimeString('es', {hour:'2-digit', minute:'2-digit'});
const num = n => Number(n).toLocaleString('es', {maximumFractionDigits:2});
const money = (n, type) => `$${num(n)}${type === 'hora' ? '<small>/hora</small>' : ''}`;
const initials = n => (n || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const colorFor = s => COLORS[[...String(s)].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
function avatar(name, size = 34, key) {
  return `<span class="av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * .38)}px;background:${colorFor(key || name)}">${esc(initials(name))}</span>`;
}
function personOf(id) {
  const p = D.profiles[id];
  const done = D.jobs.filter(j => j.assigned === id && j.status === 'completada');
  const rated = done.filter(j => j.rating);
  return {id, name: p ? p.name : 'Usuario', city: p?.city, rating: rated.length ? rated.reduce((a, j) => a + j.rating, 0) / rated.length : null, done: done.length, banned: p?.banned};
}
const stars = r => r == null ? '<span class="muted">Nuevo</span>' : `<span class="star">★</span> ${Number(r).toFixed(1)}`;
const first = n => (n || '').split(' ')[0];

const ICON = {
  explorar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  mis:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
  publicar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  mensajes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
  perfil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  admin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
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

/* ---------- conversaciones ---------- */
const chatKey = (jobId, worker) => jobId + '_' + worker;
function chats() {
  const map = {};
  for (const m of D.msgs) {
    const k = chatKey(m.job_id, m.worker);
    (map[k] ||= {id:k, jobId:m.job_id, worker:m.worker, msgs:[]}).msgs.push(m);
  }
  return Object.values(map).map(c => {
    const j = D.jobs.find(x => x.id === c.jobId);
    c.other = c.worker === D.uid ? (j ? j.author : null) : c.worker;
    const lr = lastRead[c.id] || 0;
    c.unread = c.msgs.filter(m => m.sender !== D.uid && T(m.created_at) > lr).length;
    return c;
  });
}
const unreadCount = () => chats().reduce((a, c) => a + (c.unread ? 1 : 0), 0);
function newApplicants() {
  const seen = lastRead.apps || 0;
  const mine = new Set(D.jobs.filter(j => j.author === D.uid).map(j => j.id));
  return D.apps.filter(a => mine.has(a.job_id) && T(a.created_at) > seen).length;
}

function renderNav(route) {
  const un = unreadCount(), na = newApplicants();
  const badge = id => id === 'mensajes' && un ? `<span class="badge">${un}</span>` : id === 'mis' && na ? `<span class="badge">${na}</span>` : '';
  $('#tabbar').innerHTML = NAV.map(n => n.plus
    ? `<a class="tab plus ${route === n.id ? 'on' : ''}" href="#/${n.id}"><span class="plusc">${ICON[n.id]}</span>${n.label}</a>`
    : `<a class="tab ${route === n.id ? 'on' : ''}" href="#/${n.id}">${ICON[n.id]}${n.label}${badge(n.id)}</a>`).join('');
  const side = NAV.filter(n => !n.plus).concat(isAdmin() ? [{id:'admin', label:'Administrador'}] : []);
  $('#sideNav').innerHTML = side.map(n => `<a class="${route === n.id ? 'on' : ''}" href="#/${n.id}">${ICON[n.id]}${n.label}${badge(n.id)}</a>`).join('');
  $('#topAvatar').innerHTML = D.me ? avatar(D.me.name, 36, D.uid) : '<span class="btn sm primary" style="height:34px">Entrar</span>';
}

let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2800);
}
function openSheet(html, opts = {}) {
  $('#sheet').innerHTML = `<div class="grab"></div>${opts.noClose ? '' : '<button class="sheet-x" data-close aria-label="Cerrar">✕</button>'}${html}`;
  $('#modal').hidden = false;
  $('#modal').dataset.locked = opts.noClose ? '1' : '';
  document.body.style.overflow = 'hidden';
}
function closeSheet() { $('#modal').hidden = true; document.body.style.overflow = ''; }
async function busy(btn, fn) {
  if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = 'Un momento…'; }
  try { return await fn(); }
  finally { if (btn && btn.isConnected) { btn.disabled = false; btn.textContent = btn.dataset.t; } }
}
const errMsg = e => {
  const m = (e && (e.message || e.error_description || e.error)) || 'Algo salió mal';
  if (/Invalid login/i.test(m)) return 'Correo o contraseña incorrectos';
  if (/row-level security/i.test(m)) return 'No tienes permiso para hacer esto';
  if (/duplicate key/i.test(m)) return 'Ya lo habías hecho';
  return m;
};

/* ---------- vistas ---------- */
const UI = {q:'', cat:'', city:'', sort:'recientes', misTab:'publicadas'};

function myApp(jobId) { return D.apps.find(a => a.job_id === jobId && a.worker === D.uid); }

function jobCard(j) {
  const c = catOf(j.cat), p = personOf(j.author), ap = myApp(j.id);
  const tag = j.author === D.uid ? '<span class="pill dark">Tuya</span>'
    : ap ? ({aceptada:'<span class="pill green">Te eligieron</span>', completada:'<span class="pill green">✔ Hecha</span>', rechazada:'<span class="pill">No elegido</span>'}[ap.status] || '<span class="pill blue">Postulado</span>')
    : j.status !== 'abierta' ? '<span class="pill">Cerrada</span>'
    : j.urgent ? '<span class="pill hot">🔥 Urgente</span>' : '';
  const photo = (j.photos || [])[0];
  return `<article class="card job" data-job="${j.id}">
    ${photo ? `<div class="job-photo" style="background-image:url('${esc(photo)}')">${j.photos.length > 1 ? `<span class="pill dark">📷 ${j.photos.length}</span>` : ''}</div>` : ''}
    <div class="top">
      <div class="cat-ic" style="background:${c.c}">${c.e}</div>
      <div style="flex:1;min-width:0">
        <div class="row between" style="align-items:flex-start"><h3>${esc(j.title)}</h3>${tag}</div>
        <div class="meta row wrap" style="gap:10px"><span class="row" style="gap:4px">${ICON.pin}${esc(j.city)}${j.zone ? ' · ' + esc(j.zone) : ''}</span>${j.when_txt ? `<span class="row" style="gap:4px">${ICON.clock}${esc(j.when_txt)}</span>` : ''}</div>
      </div>
    </div>
    <p class="desc">${esc(j.descr)}</p>
    <div class="bottom">
      <div class="price">${money(j.pay, j.pay_type)}</div>
      <div class="who">${avatar(p.name, 26, p.id)}<span>${esc(first(p.name))}</span><span class="muted">${stars(p.rating)}</span></div>
    </div>
  </article>`;
}

function viewExplorar() {
  const open = D.jobs.filter(j => j.status === 'abierta');
  let list = open.filter(j => (!UI.cat || j.cat === UI.cat) && (!UI.city || j.city === UI.city));
  if (UI.q) {
    const q = UI.q.toLowerCase();
    list = list.filter(j => (j.title + ' ' + j.descr + ' ' + catOf(j.cat).name + ' ' + j.city + ' ' + j.zone).toLowerCase().includes(q));
  }
  const val = j => j.pay_type === 'hora' ? j.pay * 4 : +j.pay;
  if (UI.sort === 'pago') list.sort((a, b) => val(b) - val(a));
  else if (UI.sort === 'urgentes') list.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || T(b.created_at) - T(a.created_at));
  const total = open.reduce((a, j) => a + val(j), 0);
  const users = Object.keys(D.profiles).length;
  const fn = first(D.me?.name);
  const guest = !D.uid ? `<div class="row" style="margin-top:16px;gap:10px;flex-wrap:wrap"><button class="btn primary" data-open-auth="registro">Crear cuenta gratis</button><button class="btn" data-open-auth="entrar" style="background:transparent;color:#fff;border-color:#4A4A58">Entrar</button></div>` : '';
  return `
  <section class="hero"><div class="deco"></div><div class="deco2"></div><div class="inner">
    <h1>${fn ? `¡Épale, ${esc(fn)}! ` : ''}Encuentra <em>chamba</em> hoy mismo</h1>
    <p>Gana dinero haciendo lo que sabes, o consigue quien te resuelva en minutos.</p>
    <div class="stats"><div><b>${open.length}</b><span>chambas abiertas</span></div><div><b>$${num(total)}</b><span>en pagos disponibles</span></div><div><b>${users}</b><span>usuarios</span></div></div>${guest}
  </div></section>
  <label class="search">${ICON.explorar}<input id="q" type="search" placeholder="¿Qué chamba buscas? Ej: plomero, delivery…" value="${esc(UI.q)}" autocomplete="off">
    <select id="city" aria-label="Ciudad"><option value="">Todas</option>${CITIES.map(c => `<option ${UI.city === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
  <div class="chips"><button class="chip ${!UI.cat ? 'on' : ''}" data-cat="">Todas</button>${CATS.map(c => `<button class="chip ${UI.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.e} ${c.name}</button>`).join('')}</div>
  <div class="toolbar"><h2>${list.length} chamba${list.length === 1 ? '' : 's'}</h2>
    <div class="seg">${[['recientes','Recientes'],['pago','Mejor pago'],['urgentes','Urgentes']].map(([k, l]) => `<button data-sort="${k}" class="${UI.sort === k ? 'on' : ''}">${l}</button>`).join('')}</div></div>
  ${list.length ? `<div class="grid g3">${list.map(jobCard).join('')}</div>`
    : `<div class="empty card"><div class="big">🔎</div><h3>${open.length ? 'No hay chambas con ese filtro' : 'Todavía no hay chambas publicadas'}</h3><p>${open.length ? 'Prueba otra categoría o publica la tuya.' : '¡Sé la primera persona en publicar una!'}</p><br><a class="btn primary" href="#/publicar">Publicar chamba</a></div>`}
  <div class="sec-title"><h2>Cómo funciona</h2></div>
  <div class="how">
    <div class="card"><span class="n">1</span><b>Publica o busca</b><p>Cuenta qué necesitas y cuánto pagas, o filtra por lo que sabes hacer.</p></div>
    <div class="card"><span class="n">2</span><b>Postúlate y conversa</b><p>Envía tu propuesta y cuadra los detalles por el chat de la app.</p></div>
    <div class="card"><span class="n">3</span><b>Cumple y califica</b><p>Al terminar, se marca la chamba como hecha y se califica a quien la hizo.</p></div>
  </div>`;
}

function jobDetail(id) {
  const j = D.jobs.find(x => x.id === id); if (!j) return;
  const c = catOf(j.cat), p = personOf(j.author), ap = myApp(j.id), mine = j.author === D.uid;
  let actions;
  if (mine) actions = `<a class="btn dark" href="#/mis" data-close>Ver postulantes (${j.applicants_count})</a>`;
  else if (ap) actions = `<button class="btn" data-chat-job="${j.id}">💬 Ir al chat</button><button class="btn" disabled>${ap.status === 'aceptada' ? '✅ Te eligieron' : ap.status === 'rechazada' ? 'Eligieron a otra persona' : ap.status === 'completada' ? '✔ Hecha' : '✓ Ya te postulaste'}</button>`;
  else if (j.status !== 'abierta') actions = `<button class="btn" disabled>Esta chamba ya no recibe postulaciones</button>`;
  else if (!D.uid) actions = `<button class="btn primary" data-open-auth="registro">Crea tu cuenta para postularte</button>`;
  else actions = `<button class="btn" data-chat-job="${j.id}">💬 Preguntar</button><button class="btn primary" data-apply="${j.id}">Me interesa</button>`;
  const adminDel = isAdmin() && !mine ? `<button class="btn sm ghost" style="color:var(--red);margin-top:10px" data-admin-del="${j.id}">Eliminar (admin)</button>` : '';
  openSheet(`
    <div class="row" style="gap:12px;padding-right:36px"><div class="cat-ic" style="background:${c.c}">${c.e}</div><div><span class="pill">${c.name}</span>${j.urgent ? ' <span class="pill hot">🔥 Urgente</span>' : ''}</div></div>
    ${(j.photos || []).length ? `<div class="gallery">${j.photos.map(u => `<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt="Foto de la chamba" loading="lazy"></a>`).join('')}</div>` : ''}
    <h2 style="margin-top:12px">${esc(j.title)}</h2>
    <p class="muted" style="font-size:13px;margin-top:4px">Publicada ${ago(j.created_at)} · ${j.applicants_count} postulante${j.applicants_count === 1 ? '' : 's'}</p>
    <div class="kv"><div><span>Pago</span><b>${money(j.pay, j.pay_type)}</b></div><div><span>Cuándo</span><b>${esc(j.when_txt || 'A convenir')}</b></div><div><span>Dónde</span><b>${esc(j.city)}</b></div></div>
    <p style="line-height:1.55;color:var(--ink2);white-space:pre-line">${esc(j.descr)}</p>
    ${j.zone ? `<p class="row muted" style="gap:5px;margin-top:10px;font-size:14px">${ICON.pin}${esc(j.zone)}, ${esc(j.city)}</p>` : ''}
    <a class="card row" href="#/u/${p.id}" data-close style="padding:12px 14px;margin-top:14px;box-shadow:none">${avatar(p.name, 42, p.id)}<div class="li-main"><b>${esc(p.name)}${mine ? ' (tú)' : ''}</b><span>${stars(p.rating)} · ${p.done} chambas hechas</span></div><span class="muted" style="font-size:13px;font-weight:700">Ver perfil ›</span></a>
    <div class="sticky-actions">${actions}</div>
    <div class="row" style="gap:8px;margin-top:8px"><button class="btn sm wa" data-share="${j.id}">🟢 Compartir por WhatsApp</button><button class="btn sm" data-copy="${j.id}">🔗 Copiar link</button></div>${adminDel}`);
}

function applyForm(id) {
  const j = D.jobs.find(x => x.id === id);
  openSheet(`
    <h2>Postularme</h2><p class="muted" style="margin:4px 0 16px">${esc(j.title)}</p>
    <form id="applyF">
      <div class="field"><label>Tu mensaje</label><textarea name="msg" required maxlength="400" placeholder="Cuéntale por qué eres buena opción y cuándo puedes ir.">Hola, soy ${esc(first(D.me.name))}. Puedo encargarme de esta chamba. ¿Te parece?</textarea></div>
      <div class="field"><label>Tu precio (USD)</label><input name="offer" type="number" min="1" step="0.5" value="${+j.pay}" required><span class="hint">Puedes aceptar el precio publicado o proponer otro.</span></div>
      <button class="btn primary block" type="submit">Enviar postulación</button>
    </form>`);
  $('#applyF').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target), btn = e.target.querySelector('button');
    busy(btn, async () => {
      const offer = +f.get('offer'), msg = String(f.get('msg')).trim();
      const r = await sb.from('applications').insert({job_id: id, worker: D.uid, msg, offer});
      if (r.error) return toast(errMsg(r.error));
      await sb.from('messages').insert({job_id: id, worker: D.uid, sender: D.uid, body: msg + (offer !== +j.pay ? ` (Mi propuesta: $${num(offer)})` : '')});
      await loadAll(); closeSheet(); toast('¡Postulación enviada! 🚀'); route();
    });
  };
}

function viewPublicar() {
  return `
  <div class="phead"><h1>Publicar una chamba</h1><p>Gratis. Las personas interesadas te escriben por la app.</p></div>
  <form class="card form" id="pubF">
    <div class="field"><label>¿Qué necesitas?</label><input name="title" required minlength="3" maxlength="80" placeholder="Ej: Reparar la puerta del closet"></div>
    <div class="field"><label>Categoría</label><div class="opt-grid">${CATS.map((c, i) => `<button type="button" class="opt ${i === 0 ? 'on' : ''}" data-pcat="${c.id}"><span class="e">${c.e}</span>${c.name}</button>`).join('')}</div></div>
    <div class="field"><label>Detalles</label><textarea name="descr" required minlength="3" maxlength="600" placeholder="Explica el trabajo, materiales, horario…"></textarea></div>
    <div class="two">
      <div class="field"><label>Pago (USD)</label><input name="pay" type="number" min="1" step="0.5" required placeholder="25"></div>
      <div class="field"><label>Tipo de pago</label><select name="pay_type"><option value="fijo">Precio fijo</option><option value="hora">Por hora</option></select></div>
    </div>
    <div class="two">
      <div class="field"><label>Ciudad</label><select name="city">${CITIES.map(c => `<option ${D.me?.city === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="field"><label>Zona</label><input name="zone" maxlength="40" placeholder="Ej: Chacao"></div>
    </div>
    <div class="field"><label>¿Cuándo?</label><input name="when_txt" maxlength="30" placeholder="Hoy, mañana, sábado 10 am…" required></div>
    <div class="field"><label>Fotos <span class="muted">(opcional, hasta 3)</span></label><label class="photo-drop"><input type="file" id="pubPhotos" accept="image/*" multiple hidden><span>📷 Agregar fotos</span></label><div class="photo-prev" id="photoPrev"></div></div>
    <label class="switch" style="margin-bottom:16px">🔥 Es urgente <input type="checkbox" name="urgent"></label>
    <button class="btn primary block" type="submit">Publicar chamba</button>
  </form>`;
}

function viewMis() {
  const mine = D.jobs.filter(j => j.author === D.uid);
  const appliedIds = D.apps.filter(a => a.worker === D.uid).map(a => a.job_id);
  const applied = appliedIds.map(id => D.jobs.find(j => j.id === id)).filter(Boolean);
  const tabs = `<div class="seg" style="margin-bottom:14px"><button data-mis="publicadas" class="${UI.misTab === 'publicadas' ? 'on' : ''}">Publicadas (${mine.length})</button><button data-mis="postulado" class="${UI.misTab === 'postulado' ? 'on' : ''}">Me postulé (${applied.length})</button></div>`;
  let body;
  if (UI.misTab === 'publicadas') {
    body = mine.length ? mine.map(j => {
      const st = {abierta:['orange','Abierta'], asignada:['blue','En curso'], completada:['green','Completada']}[j.status];
      const apps = D.apps.filter(a => a.job_id === j.id).map(a => {
        const p = personOf(a.worker);
        const acts = j.status === 'abierta' ? `<button class="btn sm green" data-accept="${a.id}">Elegir</button>`
          : j.assigned === a.worker ? (j.status === 'asignada' ? `<button class="btn sm dark" data-complete="${j.id}">Marcar hecha</button>` : `<span class="pill green">✔ Hecha${j.rating ? ' · ' + j.rating + '⭐' : ''}</span>`) : '';
        return `<div class="applicant">${avatar(p.name, 40, p.id)}<div class="li-main" style="white-space:normal"><div class="row between"><b>${esc(p.name)}</b><span class="price" style="font-size:16px">$${num(a.offer)}</span></div><span>${stars(p.rating)} · ${p.done} chambas · ${ago(a.created_at)}</span><p>${esc(a.msg)}</p><div class="row" style="margin-top:10px;gap:8px">${acts}<button class="btn sm" data-chat-with="${j.id}|${a.worker}">💬 Chat</button></div></div></div>`;
      }).join('');
      return `<div class="card" style="margin-bottom:12px;overflow:hidden">
        <div style="padding:14px 16px;border-bottom:1px solid var(--line)" class="row between"><div class="row" style="min-width:0;cursor:pointer" data-job="${j.id}"><div class="cat-ic" style="background:${catOf(j.cat).c};width:38px;height:38px;font-size:19px">${catOf(j.cat).e}</div><div class="li-main"><b>${esc(j.title)}</b><span>$${num(j.pay)}${j.pay_type === 'hora' ? '/hora' : ''} · ${esc(j.city)} · ${ago(j.created_at)}</span></div></div><div class="row" style="gap:6px;flex:none"><span class="pill ${st[0]}">${st[1]}</span>${j.status === 'abierta' ? `<button class="btn sm ghost" data-del="${j.id}" aria-label="Eliminar" title="Eliminar">🗑️</button>` : ''}</div></div>
        ${apps || `<div class="empty" style="padding:22px"><p>⏳ Aún no hay postulaciones. Comparte la app para que llegue a más gente.</p></div>`}
      </div>`;
    }).join('') : `<div class="empty card"><div class="big">📋</div><h3>Aún no publicas chambas</h3><p>Publica lo que necesitas y recibe propuestas.</p><br><a class="btn primary" href="#/publicar">Publicar chamba</a></div>`;
    lastRead.apps = now(); saveRead();
  } else {
    body = applied.length ? `<div class="grid">${applied.map(jobCard).join('')}</div>`
      : `<div class="empty card"><div class="big">🧰</div><h3>Todavía no te postulas</h3><p>Explora y toca «Me interesa» en una chamba.</p><br><a class="btn primary" href="#/explorar">Explorar chambas</a></div>`;
  }
  return `<div class="phead"><h1>Mis chambas</h1><p>Lo que publicaste y a lo que te postulaste.</p></div>${tabs}${body}`;
}

function viewMensajes() {
  const list = chats().sort((a, b) => T(b.msgs.at(-1).created_at) - T(a.msgs.at(-1).created_at));
  return `<div class="phead"><h1>Mensajes</h1><p>Cuadra los detalles sin compartir tu número.</p></div>
  ${list.length ? `<div class="card" style="overflow:hidden">${list.map(c => {
    const p = personOf(c.other), j = D.jobs.find(x => x.id === c.jobId), last = c.msgs.at(-1);
    return `<a class="list-item" href="#/chat/${c.id}">${avatar(p.name, 46, p.id)}<div class="li-main"><div class="row between"><b>${esc(p.name)}</b><span class="muted" style="font-size:12px;flex:none">${ago(last.created_at)}</span></div><span style="color:var(--ink2);font-weight:600;font-size:12.5px">${esc(j ? j.title : '')}</span><span>${last.sender === D.uid ? 'Tú: ' : ''}${esc(last.body)}</span></div>${c.unread ? '<span class="dot"></span>' : ''}</a>`;
  }).join('')}</div>` : `<div class="empty card"><div class="big">💬</div><h3>Sin conversaciones</h3><p>Cuando te postules o te escriban, verás los chats aquí.</p></div>`}`;
}

function viewChat(id) {
  const [jobId, worker] = id.split('_');
  const j = D.jobs.find(x => x.id === jobId);
  if (!j || !worker) return viewMensajes();
  const msgs = D.msgs.filter(m => m.job_id === jobId && m.worker === worker);
  const other = worker === D.uid ? j.author : worker;
  if (other === D.uid) return viewMensajes();
  lastRead[id] = now(); saveRead();
  const p = personOf(other);
  return `<div class="card chat">
    <div class="chat-head"><a href="#/mensajes" aria-label="Volver">${ICON.back}</a>${avatar(p.name, 40, p.id)}<div class="li-main"><b>${esc(p.name)}</b><span>${esc(j.title)}</span></div><button class="btn sm" data-job="${j.id}">Ver chamba</button></div>
    <div class="chat-body" id="chatBody">
      <div class="msg sys">🔒 Tu número nunca se comparte</div>
      ${msgs.map(m => m.sender == null ? `<div class="msg sys">${esc(m.body)}</div>` : `<div class="msg ${m.sender === D.uid ? 'me' : ''}">${esc(m.body)}<time>${hhmm(m.created_at)}</time></div>`).join('')}
      ${msgs.length ? '' : '<p class="muted" style="text-align:center;font-size:13.5px;margin-top:20px">Escribe el primer mensaje 👋</p>'}
    </div>
    <form class="chat-input" id="chatF" data-job-id="${jobId}" data-worker="${worker}"><input name="t" placeholder="Escribe un mensaje…" autocomplete="off" required maxlength="1000"><button class="btn primary" style="width:48px;padding:0" aria-label="Enviar">${ICON.send}</button></form>
  </div>`;
}

function viewPerfil() {
  const me = D.me || {name:'—', city:'—', skills:[], bio:''};
  const p = personOf(D.uid);
  const earned = D.apps.filter(a => a.worker === D.uid && a.status === 'completada').reduce((s, a) => s + +a.offer, 0);
  const posted = D.jobs.filter(j => j.author === D.uid).length;
  return `<div class="phead"><h1>Perfil</h1></div>
  <div class="card prof-head">${avatar(me.name, 68, D.uid)}<div class="li-main"><h2>${esc(me.name)}</h2><span>${ICON.pin} ${esc(me.city)} · ${me.mode === 'ofrecer' ? 'Busca quien le ayude' : me.mode === 'buscar' ? 'Busca chamba' : 'Busca y ofrece chamba'}</span><span style="font-size:12.5px">${esc(D.email)}${isAdmin() ? ' · <b style="color:var(--brand-d)">Administrador</b>' : ''}</span>${me.bio ? `<p style="margin-top:6px;font-size:14px;color:var(--ink2)">${esc(me.bio)}</p>` : ''}</div></div>
  <div class="stats3"><div class="card stat"><b>$${num(earned)}</b><span>Ganado</span></div><div class="card stat"><b>${p.done}</b><span>Chambas hechas</span></div><div class="card stat"><b>${p.rating == null ? '—' : '★ ' + p.rating.toFixed(1)}</b><span>Calificación</span></div></div>
  <div class="card form" style="margin-top:12px">
    <label class="switch" style="margin-bottom:14px">🟢 Disponible para chambas <input type="checkbox" id="avail" ${me.available !== false ? 'checked' : ''}></label>
    <div class="field"><label>Lo que sé hacer</label><div class="skill-tags">${(me.skills || []).length ? me.skills.filter(s => CAT[s]).map(s => `<span class="pill orange">${CAT[s].e} ${CAT[s].name}</span>`).join('') : '<span class="muted" style="font-size:14px">Aún no eliges habilidades</span>'}</div></div>
    <p class="muted" style="font-size:13.5px">Publicaste ${posted} chamba${posted === 1 ? '' : 's'} · te postulaste a ${D.apps.filter(a => a.worker === D.uid).length}</p>
    <div class="row wrap" style="margin-top:16px;gap:8px">
      <button class="btn" id="editMe">✏️ Editar perfil</button><button class="btn" id="chPass">🔑 Cambiar contraseña</button>
      <button class="btn" id="shareApp">📤 Compartir Chamba</button><button class="btn ${deferredInstall ? '' : 'hide'}" id="installApp">📲 Instalar app</button>
      ${isAdmin() ? '<a class="btn dark" href="#/admin">🛡️ Panel de administrador</a>' : ''}
      <button class="btn ghost" id="logout" style="color:var(--red)">Cerrar sesión</button>
    </div>
  </div>`;
}

let adminStats = null;
function viewAdmin() {
  if (!isAdmin()) return viewExplorar();
  if (!adminStats) { sb.rpc('admin_stats').then(r => { adminStats = r.data || {}; if (location.hash === '#/admin') route(); }); }
  const s = adminStats || {};
  const users = Object.values(D.profiles).sort((a, b) => T(b.created_at) - T(a.created_at));
  const emails = s.emails || {};
  return `<div class="phead"><h1>Administrador</h1><p>Solo tú ves este panel.</p></div>
  <div class="stats3"><div class="card stat"><b>${s.users ?? users.length}</b><span>Usuarios</span></div><div class="card stat"><b>${s.jobs ?? D.jobs.length}</b><span>Chambas</span></div><div class="card stat"><b>${s.applications ?? '…'}</b><span>Postulaciones</span></div></div>
  <div class="stats3"><div class="card stat"><b>${s.open ?? '…'}</b><span>Abiertas</span></div><div class="card stat"><b>${s.done ?? '…'}</b><span>Completadas</span></div><div class="card stat"><b>$${num(s.volume ?? 0)}</b><span>Movido en chambas</span></div></div>
  <div class="sec-title"><h2>Usuarios</h2><span class="muted">${users.length}</span></div>
  <div class="card" style="overflow:hidden">${users.map(u => `<div class="list-item" style="cursor:default">${avatar(u.name, 40, u.id)}<div class="li-main"><b>${esc(u.name)}${u.id === D.uid ? ' (tú)' : ''}${u.banned ? ' <span class="pill hot">Bloqueado</span>' : ''}</b><span>${esc(emails[u.id] || '')} · ${esc(u.city)} · ${ago(u.created_at)}</span></div>${u.id === D.uid ? '' : `<div class="row" style="gap:6px;flex:none"><button class="btn sm" data-reset="${u.id}" title="Nueva contraseña">🔑</button><button class="btn sm" data-ban="${u.id}">${u.banned ? 'Desbloquear' : 'Bloquear'}</button></div>`}</div>`).join('')}</div>
  <div class="sec-title"><h2>Chambas</h2><span class="muted">${D.jobs.length}</span></div>
  <div class="card" style="overflow:hidden">${D.jobs.length ? D.jobs.map(j => `<div class="list-item"><div class="li-main" data-job="${j.id}"><b>${esc(j.title)}</b><span>${esc(personOf(j.author).name)} · $${num(j.pay)} · ${j.status} · ${ago(j.created_at)}</span></div><button class="btn sm ghost" style="color:var(--red)" data-admin-del="${j.id}">Eliminar</button></div>`).join('') : '<div class="empty"><p>Sin chambas aún</p></div>'}</div>`;
}

/* ---------- fotos ---------- */
let pendingPhotos = [];
function shrink(file, max = 1280) {
  return new Promise((res, rej) => {
    const img = new Image(); img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(b => b ? res(b) : rej(new Error('blob')), 'image/jpeg', .82); URL.revokeObjectURL(img.src);
    }; img.onerror = rej; img.src = URL.createObjectURL(file);
  });
}
async function uploadPhotos(blobs) {
  const urls = [];
  for (const b of blobs) {
    const path = `${D.uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    const {error} = await sb.storage.from('chamba-fotos').upload(path, b, {contentType: 'image/jpeg', upsert: false});
    if (error) throw error;
    urls.push(sb.storage.from('chamba-fotos').getPublicUrl(path).data.publicUrl);
  }
  return urls;
}

/* ---------- perfil público ---------- */
function viewUser(id) {
  const u = D.profiles[id]; if (!u) return '<div class="empty card"><div class="big">🤷</div><h3>Perfil no encontrado</h3></div>';
  const p = personOf(id);
  const reviews = D.jobs.filter(j => j.assigned === id && j.status === 'completada' && j.rating).sort((a, b) => T(b.created_at) - T(a.created_at));
  const open = D.jobs.filter(j => j.author === id && j.status === 'abierta');
  return `<div class="row" style="margin-bottom:12px"><a class="btn sm" href="javascript:history.back()">${ICON.back} Volver</a></div>
  <div class="card prof-head">${avatar(u.name, 68, id)}<div class="li-main"><h2>${esc(u.name)}${id === D.uid ? ' (tú)' : ''}</h2><span>${ICON.pin} ${esc(u.city)} · en Chamba desde ${new Date(u.created_at).toLocaleDateString('es', {month:'long', year:'numeric'})}</span>${u.available !== false ? '<span class="pill green" style="margin-top:6px;display:inline-flex">🟢 Disponible</span>' : ''}${u.bio ? `<p style="margin-top:8px;font-size:14px;color:var(--ink2)">${esc(u.bio)}</p>` : ''}</div></div>
  <div class="stats3"><div class="card stat"><b>${p.rating == null ? '—' : '★ ' + p.rating.toFixed(1)}</b><span>Calificación</span></div><div class="card stat"><b>${p.done}</b><span>Chambas hechas</span></div><div class="card stat"><b>${reviews.length}</b><span>Reseñas</span></div></div>
  ${(u.skills || []).length ? `<div class="card form" style="margin-top:12px"><div class="field" style="margin:0"><label>Sabe hacer</label><div class="skill-tags">${u.skills.filter(s => CAT[s]).map(s => `<span class="pill orange">${CAT[s].e} ${CAT[s].name}</span>`).join('')}</div></div></div>` : ''}
  <div class="sec-title"><h2>Reseñas</h2></div>
  ${reviews.length ? `<div class="card" style="overflow:hidden">${reviews.map(j => { const a = personOf(j.author); return `<div class="applicant">${avatar(a.name, 36, a.id)}<div class="li-main" style="white-space:normal"><div class="row between"><b>${esc(a.name)}</b><span class="star">${'★'.repeat(j.rating)}<span class="muted">${'★'.repeat(5 - j.rating)}</span></span></div><span>${esc(j.title)}</span>${j.review ? `<p>“${esc(j.review)}”</p>` : ''}</div></div>`; }).join('')}</div>` : '<div class="empty card"><p>Todavía no tiene reseñas.</p></div>'}
  ${open.length ? `<div class="sec-title"><h2>Chambas que publicó</h2></div><div class="grid">${open.map(jobCard).join('')}</div>` : ''}`;
}

/* ---------- admin: nueva contraseña ---------- */
function adminReset(uid) {
  const u = D.profiles[uid];
  const pass = 'Chamba-' + Math.random().toString(36).slice(2, 8);
  openSheet(`<h2>Nueva contraseña</h2><p class="muted" style="margin:4px 0 16px">Para ${esc(u?.name)}. Pásasela y que la cambie en su perfil.</p>
    <form id="rsF"><div class="field"><label>Contraseña nueva</label><input name="p" value="${pass}" minlength="6" required></div><button class="btn primary block">Guardar contraseña</button></form>`);
  $('#rsF').onsubmit = e => {
    e.preventDefault();
    busy(e.target.querySelector('button'), async () => {
      const {data} = await sb.auth.getSession();
      const r = await fetch(`${SB_URL}/functions/v1/chamba-admin`, {method:'POST', headers:{'Content-Type':'application/json', apikey: SB_KEY, Authorization:`Bearer ${data.session.access_token}`}, body: JSON.stringify({action:'reset', user: uid, password: e.target.p.value})}).then(r => r.json()).catch(() => ({error:'Sin conexión'}));
      if (r.error) return toast(r.error);
      closeSheet(); toast('Contraseña cambiada ✅');
    });
  };
}

/* ---------- acceso ---------- */
function authSheet(tab = 'registro') {
  const reg = tab === 'registro';
  const sel = new Set();
  openSheet(`
    <div style="text-align:center;margin:6px 0 14px"><span class="logo" style="width:56px;height:56px;font-size:26px;border-radius:16px;margin:0 auto">ch</span></div>
    <h2 style="text-align:center">${reg ? 'Crea tu cuenta en Chamba' : 'Entra a Chamba'}</h2>
    <p class="muted" style="text-align:center;margin:4px 0 14px">${reg ? 'Gratis y sin número de teléfono.' : 'Qué bueno verte de nuevo.'}</p>
    <div class="seg" style="display:flex;margin-bottom:16px"><button style="flex:1" data-auth="registro" class="${reg ? 'on' : ''}">Crear cuenta</button><button style="flex:1" data-auth="entrar" class="${reg ? '' : 'on'}">Entrar</button></div>
    <form id="authF">
      ${reg ? `<div class="field"><label>Tu nombre</label><input name="name" required maxlength="40" placeholder="Ej: Ana Martínez" autocomplete="name"></div>` : ''}
      <div class="field"><label>Correo</label><input name="email" type="email" required autocomplete="email" placeholder="tucorreo@gmail.com"></div>
      <div class="field"><label>Contraseña</label><input name="password" type="password" required minlength="6" autocomplete="${reg ? 'new-password' : 'current-password'}" placeholder="Mínimo 6 caracteres"></div>
      ${reg ? `<div class="two">
        <div class="field"><label>Ciudad</label><select name="city">${CITIES.map(c => `<option>${c}</option>`).join('')}</select></div>
        <div class="field"><label>Quiero…</label><select name="mode"><option value="ambas">Las dos cosas</option><option value="buscar">Buscar chamba</option><option value="ofrecer">Ofrecer chamba</option></select></div>
      </div>
      <div class="field"><label>¿Qué sabes hacer? <span class="muted">(opcional)</span></label><div class="opt-grid">${CATS.map(c => `<button type="button" class="opt" data-skill="${c.id}"><span class="e">${c.e}</span>${c.name}</button>`).join('')}</div></div>` : ''}
      <p id="authErr" class="hide" style="color:var(--red);font-weight:600;font-size:14px;margin-bottom:12px"></p>
      <button class="btn primary block" type="submit">${reg ? 'Crear cuenta' : 'Entrar'}</button>
    </form>`);
  $('#sheet').querySelectorAll('[data-skill]').forEach(b => b.onclick = () => { b.classList.toggle('on'); sel.has(b.dataset.skill) ? sel.delete(b.dataset.skill) : sel.add(b.dataset.skill); });
  $('#sheet').querySelectorAll('[data-auth]').forEach(b => b.onclick = () => authSheet(b.dataset.auth));
  $('#authF').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target), btn = e.target.querySelector('button[type=submit]');
    const email = String(f.get('email')).trim().toLowerCase(), password = String(f.get('password'));
    const showErr = m => { const el = $('#authErr'); el.textContent = m; el.classList.remove('hide'); };
    busy(btn, async () => {
      if (reg) {
        const r = await fetch(`${SB_URL}/functions/v1/chamba-signup`, {method:'POST', headers:{'Content-Type':'application/json', apikey: SB_KEY, Authorization:`Bearer ${SB_KEY}`},
          body: JSON.stringify({email, password, name: f.get('name'), city: f.get('city')})}).then(r => r.json()).catch(() => ({error:'Sin conexión, intenta de nuevo'}));
        if (r.error) return showErr(r.error);
      }
      const {data, error} = await sb.auth.signInWithPassword({email, password});
      if (error) return showErr(errMsg(error));
      if (reg) {
        await sb.from('profiles').update({mode: f.get('mode'), skills: [...sel]}).eq('id', data.user.id);
      }
      await onSession(data.session);
      closeSheet();
      toast(reg ? `¡Bienvenido a Chamba, ${first(D.me?.name)}! 🙌` : `¡Hola de nuevo, ${first(D.me?.name)}!`);
    });
  };
}

function editProfile() {
  const me = D.me, sel = new Set(me.skills || []);
  openSheet(`<h2>Editar perfil</h2><p class="muted" style="margin:4px 0 16px">Así te ven las demás personas.</p>
    <form id="edF">
      <div class="field"><label>Tu nombre</label><input name="name" required maxlength="40" value="${esc(me.name)}"></div>
      <div class="two">
        <div class="field"><label>Ciudad</label><select name="city">${CITIES.map(c => `<option ${me.city === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
        <div class="field"><label>Quiero…</label><select name="mode"><option value="ambas">Las dos cosas</option><option value="buscar" ${me.mode === 'buscar' ? 'selected' : ''}>Buscar chamba</option><option value="ofrecer" ${me.mode === 'ofrecer' ? 'selected' : ''}>Ofrecer chamba</option></select></div>
      </div>
      <div class="field"><label>¿Qué sabes hacer?</label><div class="opt-grid">${CATS.map(c => `<button type="button" class="opt ${sel.has(c.id) ? 'on' : ''}" data-skill="${c.id}"><span class="e">${c.e}</span>${c.name}</button>`).join('')}</div></div>
      <div class="field"><label>Sobre ti</label><input name="bio" maxlength="160" value="${esc(me.bio)}" placeholder="Ej: Electricista con 5 años de experiencia"></div>
      <button class="btn primary block" type="submit">Guardar</button>
    </form>`);
  $('#sheet').querySelectorAll('[data-skill]').forEach(b => b.onclick = () => { b.classList.toggle('on'); sel.has(b.dataset.skill) ? sel.delete(b.dataset.skill) : sel.add(b.dataset.skill); });
  $('#edF').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    busy(e.target.querySelector('button[type=submit]'), async () => {
      const r = await sb.from('profiles').update({name: String(f.get('name')).trim(), city: f.get('city'), mode: f.get('mode'), bio: String(f.get('bio')).trim(), skills: [...sel]}).eq('id', D.uid);
      if (r.error) return toast(errMsg(r.error));
      await loadAll(); closeSheet(); toast('Perfil actualizado'); route();
    });
  };
}

function changePass() {
  openSheet(`<h2>Cambiar contraseña</h2><p class="muted" style="margin:4px 0 16px">Escribe tu nueva contraseña.</p>
    <form id="pwF"><div class="field"><label>Nueva contraseña</label><input name="p" type="password" minlength="6" required autocomplete="new-password"></div><button class="btn primary block">Guardar</button></form>`);
  $('#pwF').onsubmit = e => {
    e.preventDefault();
    busy(e.target.querySelector('button'), async () => {
      const {error} = await sb.auth.updateUser({password: e.target.p.value});
      if (error) return toast(errMsg(error));
      closeSheet(); toast('Contraseña actualizada 🔑');
    });
  };
}

/* ---------- router ---------- */
function route() {
  if (!D.loaded) { renderNav(''); $('#view').innerHTML = '<div class="empty"><p>Cargando…</p></div>'; return; }
  if (D.me?.banned) { $('#view').innerHTML = '<div class="empty card"><div class="big">⛔</div><h3>Tu cuenta está bloqueada</h3><p>Escríbenos a @rdev.lab en Instagram si crees que es un error.</p></div>'; return; }
  const h = location.hash.replace(/^#\/?/, '') || 'explorar';
  let [r, arg] = h.split('/');
  if (r === 'chamba') { r = 'explorar'; if (arg && !$('#modal').hidden === false) setTimeout(() => jobDetail(arg), 0); }
  if (!D.uid && !['explorar', 'u'].includes(r)) { r = 'explorar'; setTimeout(() => authSheet(h.startsWith('perfil') ? 'entrar' : 'registro'), 0); }
  const v = $('#view');
  const active = r === 'chat' ? 'mensajes' : r;
  const keepScroll = v.dataset.r === h, y = window.scrollY;
  const focused = document.activeElement && document.activeElement.id;
  switch (r) {
    case 'publicar': if (keepScroll && $('#pubF')) { renderNav(active); return; } v.innerHTML = viewPublicar(); break;
    case 'mis': v.innerHTML = viewMis(); break;
    case 'mensajes': v.innerHTML = viewMensajes(); break;
    case 'chat': {
      const draft = $('#chatF input')?.value || '';
      v.innerHTML = viewChat(arg || '');
      const b = $('#chatBody'); if (b) b.scrollTop = b.scrollHeight;
      const inp = $('#chatF input'); if (inp && draft) inp.value = draft;
      if (inp && keepScroll) inp.focus();
      break;
    }
    case 'perfil': v.innerHTML = viewPerfil(); break;
    case 'admin': v.innerHTML = viewAdmin(); break;
    case 'u': v.innerHTML = viewUser(arg); break;
    default: v.innerHTML = viewExplorar();
  }
  renderNav(active);
  v.dataset.r = h;
  if (r !== 'chat') window.scrollTo(0, keepScroll ? y : 0);
  bindView(r, arg);
  if (focused === 'q' && $('#q')) { const n = $('#q'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }
}

function viewWelcome() {
  return `<section class="hero"><div class="deco"></div><div class="deco2"></div><div class="inner">
    <h1>Encuentra <em>chamba</em> hoy mismo</h1>
    <p>Gana dinero haciendo lo que sabes, o consigue quien te resuelva en minutos.</p>
    <div class="row" style="margin-top:18px;gap:10px"><button class="btn primary" data-open-auth="registro">Crear cuenta gratis</button><button class="btn" data-open-auth="entrar" style="background:transparent;color:#fff;border-color:#4A4A58">Entrar</button></div>
  </div></section>
  <div class="sec-title"><h2>Cómo funciona</h2></div>
  <div class="how">
    <div class="card"><span class="n">1</span><b>Publica o busca</b><p>Cuenta qué necesitas y cuánto pagas, o filtra por lo que sabes hacer.</p></div>
    <div class="card"><span class="n">2</span><b>Postúlate y conversa</b><p>Envía tu propuesta y cuadra los detalles por el chat de la app.</p></div>
    <div class="card"><span class="n">3</span><b>Cumple y califica</b><p>Al terminar, se marca la chamba como hecha y se califica a quien la hizo.</p></div>
  </div>`;
}

function bindView(r, arg) {
  const q = $('#q');
  if (q) q.oninput = () => { UI.q = q.value; route(); };
  const city = $('#city'); if (city) city.onchange = () => { UI.city = city.value; route(); };
  const pub = $('#pubF');
  if (pub) {
    let cat = 'hogar';
    const pf = $('#pubPhotos');
    const drawPrev = () => { $('#photoPrev').innerHTML = pendingPhotos.map((b, i) => `<div class="pp"><img src="${URL.createObjectURL(b)}" alt=""><button type="button" data-rmphoto="${i}" aria-label="Quitar">✕</button></div>`).join(''); $('#photoPrev').querySelectorAll('[data-rmphoto]').forEach(x => x.onclick = () => { pendingPhotos.splice(+x.dataset.rmphoto, 1); drawPrev(); }); };
    pf.onchange = async () => { for (const f of [...pf.files]) { if (pendingPhotos.length >= 3) { toast('Máximo 3 fotos'); break; } try { pendingPhotos.push(await shrink(f)); } catch (e) { toast('Esa imagen no se pudo leer'); } } pf.value = ''; drawPrev(); };
    drawPrev();
    pub.querySelectorAll('[data-pcat]').forEach(b => b.onclick = () => { pub.querySelectorAll('[data-pcat]').forEach(x => x.classList.remove('on')); b.classList.add('on'); cat = b.dataset.pcat; });
    pub.onsubmit = e => {
      e.preventDefault();
      const f = new FormData(pub);
      busy(pub.querySelector('button[type=submit]'), async () => {
        let photos = [];
        try { photos = await uploadPhotos(pendingPhotos); } catch (err) { console.error(err); return toast('No se pudieron subir las fotos'); }
        const row = {photos, author: D.uid, title: String(f.get('title')).trim(), cat, descr: String(f.get('descr')).trim(), pay: +f.get('pay'), pay_type: f.get('pay_type'), city: f.get('city'), zone: String(f.get('zone')).trim(), when_txt: String(f.get('when_txt')).trim(), urgent: !!f.get('urgent')};
        const r = await sb.from('jobs').insert(row);
        if (r.error) return toast(errMsg(r.error));
        await loadAll(); UI.misTab = 'publicadas'; pub.reset(); pendingPhotos = [];
        toast('¡Chamba publicada! 🎉'); location.hash = '#/mis';
      });
    };
  }
  const cf = $('#chatF');
  if (cf) cf.onsubmit = async e => {
    e.preventDefault();
    const t = cf.t.value.trim(); if (!t) return;
    cf.t.value = '';
    const r = await sb.from('messages').insert({job_id: cf.dataset.jobId, worker: cf.dataset.worker, sender: D.uid, body: t});
    if (r.error) { cf.t.value = t; return toast(errMsg(r.error)); }
    await loadAll(); route();
  };
  const em = $('#editMe'); if (em) em.onclick = editProfile;
  const cp = $('#chPass'); if (cp) cp.onclick = changePass;
  const lo = $('#logout'); if (lo) lo.onclick = async () => { history.replaceState(null, '', '#/explorar'); await sb.auth.signOut(); };
  const av = $('#avail'); if (av) av.onchange = async () => { await sb.from('profiles').update({available: av.checked}).eq('id', D.uid); await loadAll(); toast(av.checked ? 'Ahora estás disponible 🟢' : 'Pausaste tu disponibilidad'); };
  const sh = $('#shareApp'); if (sh) sh.onclick = async () => {
    const data = {title:'Chamba', text:'Únete a Chamba: consigue o publica trabajos rápido 👇', url: location.origin + location.pathname};
    try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(data.url); toast('Link copiado 📋'); } } catch (e) {}
  };
  const ins = $('#installApp'); if (ins) ins.onclick = async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; route(); };
}

/* ---------- eventos globales ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-close],[data-job],[data-apply],[data-cat],[data-sort],[data-mis],[data-go],[data-chat-job],[data-chat-with],[data-accept],[data-complete],[data-rate],[data-del],[data-admin-del],[data-ban],[data-open-auth],[data-share],[data-copy],[data-reset]');
  if (!t) return;
  const d = t.dataset;
  if ('close' in d) { if ($('#modal').dataset.locked && t.classList.contains('modal-bg')) return; closeSheet(); if (t.tagName !== 'A') return; }
  if (d.openAuth) return authSheet(d.openAuth);
  if (d.share || d.copy) {
    const j = D.jobs.find(x => x.id === (d.share || d.copy)); if (!j) return;
    const url = location.origin + location.pathname + '#/chamba/' + j.id;
    const text = `🔥 Chamba: ${j.title} · $${num(j.pay)}${j.pay_type === 'hora' ? '/hora' : ''} en ${j.city}. Míralo en Chamba 👉 ${url}`;
    if (d.share) { window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener'); return; }
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast('Link copiado 📋'), () => toast(url));
    return;
  }
  if (d.reset) return adminReset(d.reset);
  if (!D.uid && (d.apply || d.chatJob || d.chatWith || d.go === '#/publicar')) return authSheet('registro');
  if (d.job) return jobDetail(d.job);
  if (d.apply) return applyForm(d.apply);
  if (d.cat !== undefined && t.classList.contains('chip')) { UI.cat = d.cat; return route(); }
  if (d.sort) { UI.sort = d.sort; return route(); }
  if (d.mis) { UI.misTab = d.mis; return route(); }
  if (d.go) { location.hash = d.go; return; }
  if (d.chatJob) { closeSheet(); location.hash = '#/chat/' + chatKey(d.chatJob, D.uid); return; }
  if (d.chatWith) { const [jid, w] = d.chatWith.split('|'); location.hash = '#/chat/' + chatKey(jid, w); return; }
  if (d.accept) {
    return busy(t, async () => {
      const a = D.apps.find(x => x.id === d.accept);
      const r = await sb.rpc('accept_application', {app: d.accept});
      if (r.error) return toast(errMsg(r.error));
      await loadAll(); toast(`Elegiste a ${first(personOf(a.worker).name)} ✅`); route();
    });
  }
  if (d.complete) {
    const j = D.jobs.find(x => x.id === d.complete); const p = personOf(j.assigned);
    openSheet(`<h2>¿Cómo te fue con ${esc(first(p.name))}?</h2><p class="muted" style="margin:6px 0 18px">Tu calificación ayuda a otros a elegir mejor.</p>
      <div class="row rate-row" style="justify-content:center;gap:6px">${[1,2,3,4,5].map(n => `<button type="button" data-star="${n}" style="font-size:40px;line-height:1" aria-label="${n} estrellas">⭐</button>`).join('')}</div>
      <div class="field" style="margin-top:16px"><label>Escribe una reseña <span class="muted">(opcional)</span></label><textarea id="revTxt" maxlength="300" placeholder="Ej: Muy puntual y dejó todo limpio."></textarea></div>
      <button class="btn primary block" data-rate="${j.id}" disabled>Calificar y cerrar chamba</button>`);
    let sel = 0; const paint = () => $('#sheet').querySelectorAll('[data-star]').forEach(b => b.style.opacity = +b.dataset.star <= sel ? 1 : .3);
    paint(); $('#sheet').querySelectorAll('[data-star]').forEach(b => b.onclick = () => { sel = +b.dataset.star; paint(); const r = $('#sheet [data-rate]'); r.disabled = false; r.dataset.stars = sel; });
    return;
  }
  if (d.rate) {
    const jid = d.rate, n = +d.stars, comment = ($('#revTxt')?.value || '').trim();
    if (!n) return;
    return busy(t, async () => {
      const r = await sb.rpc('complete_job', {job: jid, stars: n, comment});
      if (r.error) return toast(errMsg(r.error));
      await loadAll(); closeSheet(); toast(`¡Chamba completada! Calificaste con ${n} ⭐`); route();
    });
  }
  if (d.del || d.adminDel) {
    const id = d.del || d.adminDel;
    if (t.dataset.confirm !== '1') { t.dataset.confirm = '1'; t.textContent = '¿Seguro? Toca otra vez'; setTimeout(() => { if (t.isConnected) { t.dataset.confirm = ''; t.textContent = d.del ? '🗑️' : 'Eliminar'; } }, 3000); return; }
    return busy(t, async () => {
      const r = await sb.from('jobs').delete().eq('id', id);
      if (r.error) return toast(errMsg(r.error));
      closeSheet(); await loadAll(); toast('Chamba eliminada'); adminStats = null; route();
    });
  }
  if (d.ban) {
    const u = D.profiles[d.ban];
    return busy(t, async () => {
      const r = await sb.from('profiles').update({banned: !u.banned}).eq('id', u.id);
      if (r.error) return toast(errMsg(r.error));
      await loadAll(); toast(u.banned ? 'Usuario desbloqueado' : 'Usuario bloqueado'); route();
    });
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden && !$('#modal').dataset.locked) closeSheet(); });
window.addEventListener('hashchange', () => { if (!$('#modal').dataset.locked) closeSheet(); route(); });

/* ---------- tiempo real ---------- */
let channel, refreshT;
function subscribe() {
  if (channel) sb.removeChannel(channel);
  channel = sb.channel('chamba-live-' + (D.uid || 'anon'))
    .on('postgres_changes', {event:'*', schema:'public', table:'jobs'}, () => refresh())
    .on('postgres_changes', {event:'*', schema:'public', table:'profiles'}, () => refresh())
    .on('postgres_changes', {event:'*', schema:'public', table:'applications'}, p => {
      const a = p.new;
      if (p.eventType === 'INSERT' && a && a.worker !== D.uid) { const j = D.jobs.find(x => x.id === a.job_id); if (j && j.author === D.uid) toast(`📩 ${first(personOf(a.worker).name)} se postuló a «${j.title}»`); }
      if (p.eventType === 'UPDATE' && a && a.worker === D.uid && a.status === 'aceptada') toast('🎉 ¡Te eligieron para una chamba!');
      refresh();
    })
    .on('postgres_changes', {event:'INSERT', schema:'public', table:'messages'}, p => {
      const m = p.new;
      if (m && m.sender && m.sender !== D.uid && location.hash !== '#/chat/' + chatKey(m.job_id, m.worker)) toast(`💬 ${first(personOf(m.sender).name)}: ${String(m.body).slice(0, 60)}`);
      refresh();
    })
    .subscribe();
}
function refresh() { clearTimeout(refreshT); refreshT = setTimeout(async () => { await loadAll(); route(); }, 250); }
document.addEventListener('visibilitychange', () => { if (!document.hidden && D.uid) refresh(); });

async function onSession(session) {
  D.session = session; D.uid = session?.user?.id || null; D.email = (session?.user?.email || '').toLowerCase();
  if (channel) { sb.removeChannel(channel); channel = null; }
  if (!D.uid) D.me = null;
  D.loaded = false; route();
  await loadAll(); route(); subscribe();
  const m = location.hash.match(/^#\/chamba\/([\w-]+)/); if (m) jobDetail(m[1]);
}

/* PWA */
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; if (location.hash.includes('perfil')) route(); });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});

sb.auth.onAuthStateChange((ev, session) => {
  if (ev === 'SIGNED_OUT') onSession(null);
  else if (ev === 'TOKEN_REFRESHED') D.session = session;
});
sb.auth.getSession().then(({data}) => onSession(data.session));
})();
