/* Лабиринт Scratch: блоки можно перетаскивать из панели в «Программу Стива».
   Клик по блоку работает как раньше. Логику игры не меняет: при отпускании над
   программой просто нажимается тот же блок. */
(function () {
  'use strict';
  const root = document.getElementById('practice-kids-block');
  if (!root) return;
  let drag = null, swallow = false;
  const box = () => root.querySelector('.algo-queue-box');
  const inside = (x, y) => { const b = box(); if (!b) return false; const r = b.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; };

  function end(drop) {
    if (!drag) return;
    const d = drag; drag = null;
    document.body.classList.remove('mz-dragging');
    const b = box(); if (b) b.classList.remove('mz-drop-on');
    if (d.ghost) d.ghost.remove();
    d.btn.classList.remove('mz-drag-src');
    if (d.go) {
      if (drop) d.btn.click();
      swallow = true; setTimeout(() => { swallow = false; }, 0);
    }
  }

  root.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const btn = e.target.closest && e.target.closest('.blockly-cmd-btn');
    if (!btn || !root.contains(btn)) return;
    drag = { btn, x: e.clientX, y: e.clientY, id: e.pointerId, go: false, ghost: null };
  });
  window.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.go) {
      if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return;
      drag.go = true;
      const r = drag.btn.getBoundingClientRect();
      const g = drag.btn.cloneNode(true);
      g.removeAttribute('onclick'); g.removeAttribute('id');
      g.className = 'mz-ghost';
      const cs = getComputedStyle(drag.btn);
      g.style.cssText = 'width:' + r.width + 'px;height:' + r.height + 'px;background-image:' + cs.backgroundImage + ';background-color:' + cs.backgroundColor + ';font-size:' + cs.fontSize + ';text-shadow:' + cs.textShadow + ';padding:' + cs.padding + ';opacity:1';
      document.body.appendChild(g);
      drag.ghost = g; drag.w = r.width; drag.h = r.height;
      drag.btn.classList.add('mz-drag-src');
      document.body.classList.add('mz-dragging');
    }
    drag.ghost.style.transform = 'translate(' + (e.clientX - drag.w / 2) + 'px,' + (e.clientY - drag.h / 2) + 'px) rotate(-3deg) scale(1.06)';
    const b = box(); if (b) b.classList.toggle('mz-drop-on', inside(e.clientX, e.clientY));
    e.preventDefault();
  }, { passive: false });
  window.addEventListener('pointerup', e => { if (drag && e.pointerId === drag.id) end(inside(e.clientX, e.clientY)); });
  window.addEventListener('pointercancel', () => end(false));
  root.addEventListener('click', e => { if (swallow) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
  root.addEventListener('dragstart', e => e.preventDefault());
})();
