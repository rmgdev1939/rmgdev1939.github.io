/* Chamba · efectos visuales */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const view = document.getElementById('view');

  // onda al tocar botones
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('.btn,.chip,.tab,.opt');
    if (!b || reduce) return;
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
    const w = document.createElement('span');
    w.className = 'ripple';
    w.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
    b.style.overflow = 'hidden';
    b.appendChild(w); setTimeout(() => w.remove(), 650);
  });

  // luz que sigue al cursor en las tarjetas
  document.addEventListener('pointermove', e => {
    const c = e.target.closest('.job'); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, {passive: true});

  // aparición escalonada
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), {rootMargin: '0px 0px -5% 0px'}) : null;

  // contadores animados
  function countUp(el) {
    const txt = el.textContent.trim(), m = txt.match(/^(\$?)(\d{1,3}(?:\.\d{3})+|\d+)()$/);
    if (!m) return;
    const target = parseInt(m[2].replace(/\./g, ''), 10);
    if (!isFinite(target) || target === 0) return;
    const t0 = performance.now(), dur = 900;
    const step = t => {
      const k = Math.min(1, (t - t0) / dur), v = target * (1 - Math.pow(1 - k, 3));
      el.textContent = m[1] + Math.round(v).toLocaleString('es') + m[3];
      if (k < 1) requestAnimationFrame(step); else el.textContent = txt;
    };
    requestAnimationFrame(step);
  }

  let lastRoute = '';
  function enhance() {
    const route = view.dataset.r || '';
    const fresh = route !== lastRoute; lastRoute = route;
    if (fresh && !reduce) { view.classList.remove('enter'); void view.offsetWidth; view.classList.add('enter'); }
    if (reduce || !io) return;
    let i = 0;
    view.querySelectorAll('.job,.how .card,.stat,.list-item,.applicant,.prof-head').forEach(el => {
      if (el.dataset.fx) { el.classList.add('reveal', 'in'); return; }
      el.dataset.fx = '1';
      if (!fresh) return;
      el.classList.add('reveal'); el.style.setProperty('--d', Math.min(i++ * 55, 500) + 'ms'); io.observe(el);
    });
    if (fresh) view.querySelectorAll('.hero .stats b,.stat b').forEach(countUp);
  }
  new MutationObserver(() => requestAnimationFrame(enhance)).observe(view, {childList: true});
})();
