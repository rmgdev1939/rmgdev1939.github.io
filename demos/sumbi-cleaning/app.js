(() => {
  const PHONE = '19194401639';
  const EMAIL = 'sumbi.cleaning.llc@gmail.com';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const ES = {
    'nav.services': 'Servicios', 'nav.work': 'Trabajos', 'nav.how': 'Cómo funciona', 'nav.area': 'Zona', 'nav.quote': 'Presupuesto gratis',
    'hero.eyebrow': 'Residencial y comercial · Triangle Area, NC',
    'hero.title': 'Vuelve a un hogar que <em>brilla</em>.',
    'hero.lead': 'Limpieza profesional para casas y negocios en Raleigh, Durham, Cary, Chapel Hill y alrededores. Calidad, puntualidad y eficiencia para que recuperes tu tiempo.',
    'hero.cta': 'Pedir presupuesto gratis', 'hero.t1': 'Neighborhood Fave', 'hero.t2': 'presupuestos', 'hero.t3': 'abierto hasta las', 'hero.award': 'Neighborhood Fave',
    'band.1': 'Alta calidad', 'band.2': 'Confiables', 'band.3': 'Eficientes', 'band.4': 'Casas y oficinas', 'band.5': 'Votados por tus vecinos',
    'svc.eyebrow': 'Lo que hacemos', 'svc.title': 'Servicios de limpieza para la vida real', 'svc.sub': 'Elige un servicio y lo adaptamos a tu espacio, tu horario y tu presupuesto.',
    'svc.s1': 'Limpieza regular del hogar', 'svc.s1d': 'Cocina, baños, habitaciones y salas: polvo, superficies, aspirado y trapeado.',
    'svc.s2': 'Limpieza profunda', 'svc.s2d': 'Detalle de arriba a abajo: zócalos, juntas, sarro, manchas del inodoro y los pequeños detalles.',
    'svc.s3': 'Mudanzas (entrada / salida)', 'svc.s3d': 'Deja impecable el lugar anterior o empieza de cero en el nuevo. Ideal para inquilinos y realtors.',
    'svc.s4': 'Limpieza recurrente', 'svc.s4d': 'Visitas semanales, quincenales o mensuales para que tu casa siempre esté lista.',
    'svc.s5': 'Comercial y oficinas', 'svc.s5d': 'Oficinas, estudios y pequeños negocios, en un horario que no interrumpe tu trabajo.',
    'svc.s6': 'Organización del hogar', 'svc.s6d': 'Clósets, despensas y gabinetes ordenados para que todo tenga su lugar.',
    'svc.pick': 'Solicitar este',
    'work.eyebrow': 'Nuestro trabajo', 'work.title': 'Cuidamos los pequeños detalles', 'work.sub': 'Trabajos reales de nuestro equipo. Síguenos en Instagram para ver más.',
    'work.c1': 'Baños relucientes', 'work.c2': 'Limpieza profunda de ducha', 'work.c3': 'Adiós a las manchas difíciles', 'work.c4': 'Detalle en cada superficie', 'work.ig': 'Ver más en Instagram @sumbi.cleaning_',
    'love.eyebrow': 'Premios Neighborhood Fave', 'love.title': 'Favoritos del vecindario tres años seguidos',
    'love.sub': 'El premio Neighborhood Fave reconoce a los mejores negocios locales, votados por los vecinos. Esto es lo que más valoran de nosotros:',
    'love.c1': 'Trabajo de calidad', 'love.c2': 'Profesionalismo', 'love.c3': 'Gran valor',
    'how.eyebrow': 'Cómo funciona', 'how.title': 'Reservar toma menos de un minuto',
    'how.1': 'Cuéntanos de tu espacio', 'how.1d': 'Llena el formulario: servicio, tamaño y el día que te conviene.',
    'how.2': 'Recibe tu presupuesto', 'how.2d': 'Te respondemos por mensaje o correo con un precio claro y confirmamos tu cita.',
    'how.3': 'Relájate, nosotros nos encargamos', 'how.3d': 'Llegamos puntuales y dejamos tu espacio fresco, limpio y ordenado.',
    'q.eyebrow': 'Presupuesto gratis', 'q.title': 'Dejemos tu espacio reluciente', 'q.sub': 'Sin compromiso. Envía tu solicitud y te respondemos rápido con un precio.',
    'q.hours': 'Abierto hasta las 8:00 PM', 'q.area': 'Triangle Area, Carolina del Norte',
    'f.service': 'Servicio', 'f.place': 'Tipo de lugar', 'f.house': 'Casa', 'f.apt': 'Apartamento', 'f.office': 'Oficina',
    'f.beds': 'Habitaciones', 'f.baths': 'Baños', 'f.freq': '¿Con qué frecuencia?', 'f.once': 'Una vez', 'f.weekly': 'Semanal', 'f.biweekly': 'Cada 2 semanas', 'f.monthly': 'Mensual',
    'f.date': 'Fecha preferida', 'f.name': 'Tu nombre', 'f.zip': 'Código postal', 'f.notes': '¿Algo que debamos saber? (opcional)', 'f.notesph': 'Mascotas, zonas prioritarias, estacionamiento, acceso…',
    'f.err': 'Agrega tu nombre para saber a quién responder.', 'f.sms': 'Enviar por mensaje', 'f.email': 'Enviar por correo',
    'f.fine': 'Tu solicitud se abre en tu app de mensajes o correo, lista para enviar. Nunca compartimos tus datos.',
    'area.eyebrow': 'Zona de servicio', 'area.title': 'Con orgullo servimos al Triangle', 'area.sub': '¿No sabes si llegamos a tu zona? Pregúntanos, seguro estamos cerca.',
    'final.title': '¿Agenda llena? Deja la limpieza en nuestras manos.', 'final.call': 'Llámanos ahora', 'foot.area': 'Triangle Area, NC',
    toast: 'Abriendo tu app… ¡solo presiona enviar!'
  };
  const EN = { toast: 'Opening your app… just hit send!' };

  // Capture English copy from the page so it stays the single source of truth.
  $$('[data-i18n]').forEach(el => { EN[el.dataset.i18n] ??= el.textContent; });
  $$('[data-i18n-html]').forEach(el => { EN[el.dataset.i18nHtml] = el.innerHTML; });
  $$('[data-i18n-ph]').forEach(el => { EN[el.dataset.i18nPh] = el.placeholder; });

  let lang = 'en';
  const t = k => (lang === 'es' ? ES : EN)[k] ?? EN[k] ?? k;
  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
    try { localStorage.setItem('sumbi-lang', l); } catch (e) {}
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  let saved = null;
  try { saved = localStorage.getItem('sumbi-lang'); } catch (e) {}
  if (saved === 'es' || (!saved && /^es/i.test(navigator.language || ''))) setLang('es');

  // Nav
  const nav = $('.nav'), burger = $('#burger'), links = $('#links'), float = $('#float');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });
  const quote = $('#quote');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 10);
    const q = quote.getBoundingClientRect();
    float.classList.toggle('show', scrollY > 600 && !(q.top < innerHeight && q.bottom > 0));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  // Service cards -> preselect in form
  const service = $('#service');
  $$('.card .pick').forEach(b => b.addEventListener('click', () => {
    service.value = b.closest('.card').dataset.svc;
    quote.scrollIntoView({ behavior: 'smooth' });
  }));

  // Place type + counters
  const place = $('#place');
  let placeVal = 'house';
  place.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', place).forEach(x => x.classList.toggle('on', x === b));
    placeVal = b.dataset.v;
    $$('.counter')[0].classList.toggle('off', placeVal === 'office');
  });
  const counts = { beds: 2, baths: 2 };
  $$('.ctr').forEach(c => c.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const n = c.dataset.name;
    counts[n] = Math.min(10, Math.max(n === 'beds' ? 0 : 1, counts[n] + +b.dataset.d));
    $('output', c).textContent = counts[n];
  }));

  const form = $('#form');
  const d = form.elements.date;
  d.min = new Date().toISOString().slice(0, 10);
  $('#yr').textContent = new Date().getFullYear();

  const optText = sel => sel.options[sel.selectedIndex].textContent;
  const toast = $('#toast');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.elements.name;
    if (!name.value.trim()) {
      name.classList.add('invalid'); $('#err').hidden = false; name.focus(); return;
    }
    name.classList.remove('invalid'); $('#err').hidden = true;
    const via = e.submitter?.dataset.via || 'sms';
    const es = lang === 'es';
    const placeTxt = $('#place .on').textContent;
    const lines = [
      es ? `¡Hola Sumbi's Cleaning! Quisiera un presupuesto.` : `Hi Sumbi's Cleaning! I'd like a free quote.`,
      `${es ? 'Nombre' : 'Name'}: ${name.value.trim()}`,
      `${es ? 'Servicio' : 'Service'}: ${optText(service)}`,
      `${es ? 'Lugar' : 'Place'}: ${placeTxt}` + (placeVal === 'office' ? '' : ` · ${counts.beds} ${es ? 'hab.' : 'bed'} / ${counts.baths} ${es ? 'baños' : 'bath'}`),
      `${es ? 'Frecuencia' : 'Frequency'}: ${optText(form.elements.freq)}`
    ];
    if (d.value) lines.push(`${es ? 'Fecha' : 'Date'}: ${new Date(d.value + 'T12:00').toLocaleDateString(es ? 'es' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`);
    if (form.elements.zip.value.trim()) lines.push(`ZIP: ${form.elements.zip.value.trim()}`);
    if (form.elements.notes.value.trim()) lines.push(`${es ? 'Notas' : 'Notes'}: ${form.elements.notes.value.trim()}`);
    const body = encodeURIComponent(lines.join('\n'));
    const url = via === 'email'
      ? `mailto:${EMAIL}?subject=${encodeURIComponent(es ? 'Solicitud de presupuesto' : 'Free quote request')}&body=${body}`
      : `sms:+${PHONE}${/iP(hone|ad)/.test(navigator.userAgent) ? '&' : '?'}body=${body}`;
    toast.textContent = t('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
    location.href = url;
  });
})();
