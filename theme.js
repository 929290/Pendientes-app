// Preferencias de este dispositivo: tema (sistema / claro / oscuro) y vista (tarjetas / lista).
// Se carga en el <head> para aplicar el tema antes de pintar la página (sin parpadeo).
(() => {
  'use strict';

  const KEY = 'pendientes.prefs.v1';
  const DEFAULTS = { theme: 'dark', layout: 'cards' };
  const THEMES = ['system', 'light', 'dark'];
  const LAYOUTS = ['cards', 'list'];
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  let prefs = { ...DEFAULTS };

  function read() {
    prefs = { ...DEFAULTS };
    try {
      const p = JSON.parse(localStorage.getItem(KEY)) || {};
      if (THEMES.includes(p.theme)) prefs.theme = p.theme;
      if (LAYOUTS.includes(p.layout)) prefs.layout = p.layout;
    } catch {}
  }

  function apply() {
    const root = document.documentElement;
    root.dataset.theme = prefs.theme === 'system' ? (mq.matches ? 'light' : 'dark') : prefs.theme;
    root.dataset.layout = prefs.layout;
  }

  read();
  apply();
  mq.addEventListener('change', () => { if (prefs.theme === 'system') apply(); });
  // Si otra ventana (por ejemplo la captura rápida) cambia las preferencias, se aplican aquí también
  window.addEventListener('storage', e => { if (e.key === KEY) { read(); apply(); } });

  window.Prefs = {
    get: () => ({ ...prefs }),
    set(p) {
      if (THEMES.includes(p.theme)) prefs.theme = p.theme;
      if (LAYOUTS.includes(p.layout)) prefs.layout = p.layout;
      try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch {}
      apply();
    },
    reload() { read(); apply(); }
  };
})();
