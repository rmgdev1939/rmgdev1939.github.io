(() => {
  // Where estimate requests are sent. Leave empty until a form service is set up and tested
  // (e.g. https://formsubmit.co/ajax/Sumbi.cleaning.llc@gmail.com). While empty, the form
  // prepares an email to the business with all the answers.
  const FORM_ENDPOINT = '';
  const EMAIL = 'Sumbi.cleaning.llc@gmail.com';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $$('.yr').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Nav
  const nav = $('.nav'), burger = $('#burger'), links = $('#links'), float = $('#float');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  const formCard = $('#estimate');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 10);
    let show = scrollY > 600;
    if (formCard) { const r = formCard.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) show = false; }
    float.classList.toggle('show', show);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .1 });
  $$('.reveal').forEach(el => io.observe(el));

  // Estimate form
  const form = $('#form');
  if (!form) return;
  const f = form.elements;
  const cond = $('.field.cond');
  const syncCond = () => cond.classList.toggle('show', f.cleaned.value === 'Yes');
  f.cleaned.addEventListener('change', syncCond);
  syncCond();

  const LABELS = {
    name: 'Full Name', location: 'City or ZIP Code', sqft: 'Approximate Square Footage',
    cleaned: 'Professionally cleaned before', lastclean: 'Last professional cleaning', pets: 'Pets',
    service: 'Type of cleaning', frequency: 'Frequency', email: 'Email', phone: 'Phone'
  };
  const setErr = (name, msg) => {
    const fld = f[name].closest('.field');
    fld.classList.toggle('bad', !!msg);
    $(`#${name}-err`).textContent = msg || '';
  };
  function validate() {
    let first = null;
    const need = (name, msg) => {
      const ok = !!f[name].value.trim();
      setErr(name, ok ? '' : msg);
      if (!ok && !first) first = f[name];
    };
    need('name', 'Please enter your name.');
    need('location', 'Please enter your city or ZIP code.');
    need('sqft', 'Please enter the approximate square footage.');
    need('cleaned', 'Please choose Yes or No.');
    need('pets', 'Please choose Yes or No.');
    need('service', 'Please select a service.');
    need('frequency', 'Please select a frequency.');
    const em = f.email.value.trim(), ph = f.phone.value.trim();
    setErr('email', ''); setErr('phone', '');
    if (!em && !ph) {
      setErr('email', 'Please add an email or a phone number so we can reach you.');
      if (!first) first = f.email;
    } else if (em && !f.email.checkValidity()) {
      setErr('email', 'Please check your email address.');
      if (!first) first = f.email;
    } else if (ph && ph.replace(/\D/g, '').length < 10) {
      setErr('phone', 'Please check your phone number.');
      if (!first) first = f.phone;
    }
    if (first) first.focus();
    return !first;
  }
  $$('input,select', form).forEach(el => el.addEventListener('input', () => {
    if (el.closest('.field.bad')) setErr(el.name, '');
  }));

  const answers = () => Object.keys(LABELS)
    .filter(k => f[k].value.trim() && !(k === 'lastclean' && f.cleaned.value !== 'Yes'))
    .map(k => [LABELS[k], f[k].value.trim()]);

  const mailto = () => {
    const body = ['Hi Sumbi’s Cleaning! I’d like a free estimate.', '', ...answers().map(([k, v]) => `${k}: ${v}`)].join('\n');
    return `mailto:${EMAIL}?subject=${encodeURIComponent('Free Estimate Request - ' + f.name.value.trim())}&body=${encodeURIComponent(body)}`;
  };

  const fail = $('#fail'), thanks = $('#thanks'), submit = $('#submit');
  function showThanks() {
    form.hidden = true; thanks.hidden = false; thanks.focus();
    thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  async function send() {
    fail.hidden = true;
    if (!FORM_ENDPOINT) {
      // No form service yet: open the visitor's email app with the request ready to send.
      location.href = mailto();
      const note = $('#mailnote'); note.hidden = false; note.focus();
      return;
    }
    form.classList.add('sending'); submit.textContent = 'Sending…';
    try {
      const data = Object.fromEntries(answers());
      data._subject = 'Free Estimate Request - ' + f.name.value.trim();
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(res.status);
      showThanks();
    } catch (err) {
      $('#mailfallback').href = mailto();
      fail.hidden = false;
    } finally {
      form.classList.remove('sending'); submit.textContent = 'Get My Free Estimate';
    }
  }
  form.addEventListener('submit', e => { e.preventDefault(); if (validate()) send(); });
  $('#retry').addEventListener('click', () => { if (validate()) send(); });
})();
