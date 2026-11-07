// Ventanita de captura rápida: escribe, elige categoría (clic o "#nombre") y Enter.
(() => {
  'use strict';

  const CATS_KEY = 'pendientes.cats.v1';
  const LAST_KEY = 'pendientes.quickcat.v1';
  const DEFAULT_CATEGORIES = [
    { id: 'personal', name: 'Personal', color: '#a78bfa' },
    { id: 'trabajo',  name: 'Trabajo',  color: '#60a5fa' },
    { id: 'urgente',  name: 'Urgente',  color: '#fb7185' },
    { id: 'estudio',  name: 'Estudio',  color: '#34d399' }
  ];

  const input = document.getElementById('quickInput');
  const catsEl = document.getElementById('quickCats');
  const safeColor = c => (/^#[0-9a-f]{3,8}$/i.test(String(c)) ? c : '#8b90a0');
  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '');

  let cats = [];
  let picked = null;   // categoría elegida con clic
  let tagged = null;   // categoría elegida escribiendo "#nombre"

  function loadCats() {
    try {
      const c = JSON.parse(localStorage.getItem(CATS_KEY));
      if (Array.isArray(c) && c.length) return c;
    } catch {}
    return DEFAULT_CATEGORIES;
  }

  const current = () => tagged || picked || cats[0];

  // Busca un "#algo" en el texto y lo empareja con la categoría cuyo nombre empiece así
  function findTag(text) {
    const matches = [...text.matchAll(/(^|\s)#(\S+)/g)];
    for (let i = matches.length - 1; i >= 0; i--) {
      const q = norm(matches[i][2]);
      const c = cats.find(x => norm(x.name).startsWith(q));
      if (c) return { cat: c, token: matches[i][0] };
    }
    return null;
  }

  function renderCats() {
    catsEl.textContent = '';
    const cur = current();
    cats.forEach(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (c === cur ? ' active' : '');
      b.style.setProperty('--c', safeColor(c.color));
      const dot = document.createElement('i');
      b.append(dot, document.createTextNode(c.name));
      b.addEventListener('mousedown', e => e.preventDefault()); // no quitar el foco del texto
      b.addEventListener('click', () => { picked = c; tagged = null; renderCats(); input.focus(); });
      catsEl.append(b);
    });
  }

  function open() {
    if (window.Prefs) window.Prefs.reload();
    cats = loadCats();
    let last = null;
    try { last = localStorage.getItem(LAST_KEY); } catch {}
    picked = cats.find(c => c.id === last) || cats[0];
    tagged = null;
    input.value = '';
    renderCats();
    input.focus();
  }

  input.addEventListener('input', () => {
    const t = findTag(input.value);
    tagged = t ? t.cat : null;
    renderCats();
  });

  document.getElementById('quickForm').addEventListener('submit', e => {
    e.preventDefault();
    let text = input.value;
    const t = findTag(text);
    if (t) text = text.replace(t.token, ' ');
    const title = text.replace(/\s+/g, ' ').trim();
    if (!title) return;
    const cat = current();
    try { localStorage.setItem(LAST_KEY, cat.id); } catch {}
    window.desktop.submitQuick({ title, category: cat.id });
    input.value = '';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { input.value = ''; window.desktop.closeQuick(); }
  });

  if (window.desktop) window.desktop.onQuickOpen(open);
  open();
})();
