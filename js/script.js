/* PUNTO Y VENTA — JavaScript puro. Edita la sección CONFIG para personalizar. */
'use strict';

/* ===== CONFIG ===== */
const WHATSAPP_NUMBER = '50369732482'; // +503 6973 2482 (código de país + número, sin + ni espacios)
const WHATSAPP_MESSAGE = 'Hola, quiero reservar un mueble personalizado o de catálogo.';
const FORM_ENDPOINT = '';          // Ej: 'https://formspree.io/f/XXXX'. Vacío = no se envía nada.
const IMG = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;

/* Productos: agrega, quita o edita. categoria: 'Personalizado' | 'Catálogo' */
const PRODUCTS = [
    { n: 'Closets personalizados', c: 'Personalizado', d: 'Puertas, repisas y gavetas distribuidas según tu ropa y tu pared.', i: '1616486338812-3dadae4b4ace' },
    { n: 'Cocinas integrales', c: 'Personalizado', d: 'Muebles altos y bajos con cubiertas y herrajes a tu elección.', i: '1556909114-f6e7ad7d3136' },
    { n: 'Escritorios', c: 'Personalizado', d: 'Para oficina en casa o estudio, con pasacables y gavetas a medida.', i: '1518455027359-f3f8164ba6bd' },
    { n: 'Centros de entretenimiento', c: 'Personalizado', d: 'Soporte para TV, equipo de sonido y almacenamiento cerrado.', i: '1593696140826-c58b021acf8b' },
    { n: 'Muebles para dormitorios', c: 'Personalizado', d: 'Cabeceras, mesas de noche y roperos que encajan en tu cuarto.', i: '1505693416388-ac5ce068fe85' },
    { n: 'Estanterías', c: 'Personalizado', d: 'Libreros y vitrinas de piso a techo en la profundidad que necesites.', i: '1594620302200-9a762244a156' },
    { n: 'Mobiliario comercial', c: 'Personalizado', d: 'Mostradores, vitrinas y góndolas para tiendas, oficinas y restaurantes.', i: '1497366216548-37526070297c' },
    { n: 'Mesas', c: 'Catálogo', d: 'Mesas de comedor y centro en madera maciza, listas para comprar.', i: '1538688525198-9b88f6f53126' },
    { n: 'Sillas', c: 'Catálogo', d: 'Sillas de comedor con estructura de madera y asiento cómodo.', i: '1503602642458-232111445657' },
    { n: 'Camas', c: 'Catálogo', d: 'Bases de cama en varios tamaños, con cabecera de madera.', i: '1505693416388-ac5ce068fe85' },
    { n: 'Gaveteros', c: 'Catálogo', d: 'Cómodas de varias gavetas con correderas suaves.', i: '1555041469-a586c61ea9bc' },
    { n: 'Repisas', c: 'Catálogo', d: 'Repisas flotantes y de pared en distintos largos.', i: '1594620302200-9a762244a156' },
    { n: 'Armarios', c: 'Catálogo', d: 'Armarios de una y dos puertas con barra y entrepaños.', i: '1616486338812-3dadae4b4ace' },
    { n: 'Muebles auxiliares', c: 'Catálogo', d: 'Mesas laterales, bancas y recibidores para completar un espacio.', i: '1565538810643-b5bdb714032a' }
];

/* Enlace de WhatsApp con mensaje prellenado */
const waUrl = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ===== Tema (persistente) ===== */
const root = document.documentElement, themeBtn = $('#themeBtn');
function applyTheme(t) {
    root.dataset.theme = t;
    themeBtn.textContent = t === 'dark' ? 'Modo claro' : 'Modo oscuro';
    themeBtn.setAttribute('aria-pressed', String(t === 'rustic'));
    try { localStorage.setItem('pyv-theme', t); } catch (e) { }
}
applyTheme(root.dataset.theme === 'rustic' ? 'rustic' : 'dark');
themeBtn.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'rustic' : 'dark'));

/* ===== Menú móvil ===== */
const burger = $('#burger'), menu = $('#menu');
function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ===== Catálogo y filtros ===== */
const grid = $('#grid');
grid.innerHTML = PRODUCTS.map((p, k) => `
  <article class="card" data-cat="${p.c}">
    <img loading="lazy" src="${IMG(p.i)}" alt="${p.n}">
    <div class="in"><span class="tag">${p.c === 'Personalizado' ? 'Mueble personalizado' : 'Catálogo'}</span>
    <h3>${p.n}</h3><p>${p.d}</p>
    <a class="btn btn-alt" href="#contacto" data-product="${k}">CONSULTAR PRODUCTO</a>
    <a class="btn" target="_blank" rel="noopener" href="${waUrl(`Hola, quiero reservar: ${p.n} (${p.c === 'Personalizado' ? 'mueble personalizado' : 'producto de catálogo'}). ¿Me pueden indicar disponibilidad, precio y tiempo de entrega?`)}">RESERVAR POR WHATSAPP</a></div>
  </article>`).join('');
/* Si una imagen falla, se muestra un marcador de posición */
$$('img', document).forEach(img => img.addEventListener('error', () => {
    if (img.closest('.card')) { const d = document.createElement('div'); d.className = 'ph-img'; d.textContent = 'Imagen'; img.replaceWith(d); }
    else img.style.visibility = 'hidden';
}));
$$('.chip').forEach(btn => btn.addEventListener('click', () => {
    $$('.chip').forEach(b => b.classList.toggle('on', b === btn));
    const f = btn.dataset.filter;
    $$('.card', grid).forEach(c => {
        const ok = f === 'all' || c.dataset.cat === f;
        c.hidden = !ok; c.classList.remove('show');
        if (ok) { void c.offsetWidth; c.classList.add('show'); }
    });
}));

/* ===== Prellenar formulario desde botones ===== */
const tipo = $('#tipo'), mensaje = $('#mensaje');
grid.addEventListener('click', e => {
    const a = e.target.closest('[data-product]'); if (!a) return;
    const p = PRODUCTS[a.dataset.product];
    tipo.value = p.c === 'Personalizado' ? 'Mueble personalizado' : 'Producto de catálogo';
    mensaje.value = `Quiero consultar por: ${p.n}.`;
});
$$('[data-prefill]').forEach(a => a.addEventListener('click', () => { tipo.value = a.dataset.prefill; }));

/* ===== WhatsApp ===== */
$$('[data-wa]').forEach(a => {
    a.href = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}` : '#contacto';
    if (!WHATSAPP_NUMBER) a.removeAttribute('target');
});

/* ===== Formulario ===== */
const form = $('#form'), status = $('#status');
const RULES = {
    nombre: v => v.trim().length >= 3 || 'Escribe tu nombre completo.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Escribe un correo válido, como nombre@dominio.com.',
    tel: v => /^[+\d][\d\s()-]{6,}$/.test(v.trim()) || 'Escribe un teléfono con al menos 7 dígitos.',
    tipo: v => v !== '' || 'Selecciona un tipo de solicitud.',
    mensaje: v => v.trim().length >= 10 || 'Describe tu proyecto en al menos 10 caracteres.'
};
function check(field) {
    const r = RULES[field.name](field.value), msg = r === true ? '' : r;
    field.classList.toggle('bad', !!msg);
    field.setAttribute('aria-invalid', String(!!msg));
    $(`[data-for="${field.name}"]`).textContent = msg;
    return !msg;
}
$$('input,select,textarea', form).forEach(f => f.addEventListener('blur', () => check(f)));
form.addEventListener('submit', async e => {
    e.preventDefault(); status.textContent = '';
    const fields = $$('input,select,textarea', form), results = fields.map(check);
    if (results.includes(false)) { fields[results.indexOf(false)].focus(); status.textContent = 'Corrige los campos marcados.'; return; }
    /* Sin backend: no se simula el envío. Configura FORM_ENDPOINT para activarlo. */
    if (!FORM_ENDPOINT) { status.textContent = 'Datos validados, pero el envío aún no está configurado. Escríbenos por WhatsApp o correo.'; return; }
    try {
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        if (!res.ok) throw new Error(res.status);
        form.reset(); status.textContent = 'Solicitud enviada. Te responderemos pronto.';
    } catch (err) { status.textContent = 'No se pudo enviar. Inténtalo de nuevo o escríbenos por WhatsApp.'; }
});

/* ===== Scroll: botón subir, enlace activo, entrada discreta ===== */
const topBtn = $('#top');
addEventListener('scroll', () => topBtn.classList.toggle('on', scrollY > 600), { passive: true });
topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
const links = $$('#menu a');
const spy = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle('act', l.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));
const rv = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rv.unobserve(en.target); } }), { threshold: .1 });
$$('.sec-head,.mv,.team,.svc').forEach(el => { el.classList.add('rv'); rv.observe(el); });

/* ===== Reservar por WhatsApp desde el formulario (valida y abre el chat con los datos) ===== */
$('#waReserve').addEventListener('click', () => {
    const fields = $$('input,select,textarea', form), results = fields.map(check);
    if (results.includes(false)) { fields[results.indexOf(false)].focus(); status.textContent = 'Completa los campos marcados para reservar.'; return; }
    const d = Object.fromEntries(new FormData(form));
    const text = `Hola, quiero hacer una reserva.\nNombre: ${d.nombre}\nCorreo: ${d.email}\nTeléfono: ${d.tel}\nTipo: ${d.tipo}\nDetalle: ${d.mensaje}`;
    status.textContent = 'Abriendo WhatsApp con tu reserva…';
    window.open(waUrl(text), '_blank', 'noopener');
});