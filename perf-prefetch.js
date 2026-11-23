/* Быстрое открытие: картинки следующих слайдов подгружаются в фоне, когда браузер свободен. */
(() => {
  'use strict';
  const root = document.documentElement;
  const seen = new Set();
  const idle = window.requestIdleCallback ? f => requestIdleCallback(f, { timeout: 2500 }) : f => setTimeout(f, 400);
  function warm(n) {
    const s = document.getElementById('slide-' + n);
    if (!s) return;
    s.querySelectorAll('img[src]').forEach(i => {
      if (i.closest('.legacy-practice')) return; // скрытая прежняя практика не грузится
      const u = i.currentSrc || i.src;
      if (seen.has(u)) return;
      seen.add(u);
      const im = new Image();
      im.decoding = 'async';
      im.src = u;
    });
  }
  function plan() {
    const n = Number(root.dataset.currentSlide) || 0;
    idle(() => warm(n + 1));
    setTimeout(() => idle(() => warm(n + 2)), 1500);
  }
  window.addEventListener('load', () => setTimeout(plan, 600));
  new MutationObserver(plan).observe(root, { attributes: true, attributeFilter: ['data-current-slide'] });
})();
