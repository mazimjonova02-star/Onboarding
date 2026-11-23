/* Облачные переходы между слайдами. Двигают настоящее небо на фоне (слои облаков ускоряются, приближаются, уходят вниз),
   поверх — пролетающие облака, мягкий «вжух» (если звук включён).
   Варианты: fly — полёт сквозь облака, rise — подъём в небо, wind — порыв ветра.
   Панель #fx-pick внизу слева — временная, чтобы выбрать вариант; убрать: SHOW_PICKER = false. */
(() => {
  'use strict';
  const SHOW_PICKER = true;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');
  const NAMES = { ru: { t: 'Переход:', fly: 'Полёт', rise: 'Подъём', wind: 'Ветер' }, uz: { t: 'O‘tish:', fly: 'Parvoz', rise: 'Ko‘tarilish', wind: 'Shamol' } };
  let mode = 'fly';
  try { mode = localStorage.getItem('junior-fx') || 'fly'; } catch (e) {}
  if (!NAMES.ru[mode]) mode = 'fly';

  let layer, busy = false, pending = null, ready = false, actx = null;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const $ = s => document.querySelector(s);
  const active = () => $('.slide-card.active');
  const mobile = () => matchMedia('(max-width:900px)').matches;
  const anim = (el, kf, o) => el ? el.animate(kf, Object.assign({ fill: 'both' }, o)) : null;
  const done = list => Promise.all(list.filter(Boolean).map(a => a.finished.catch(() => {})));

  function build() {
    if (layer) return;
    layer = document.createElement('div'); layer.id = 'fx-layer'; layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
  }
  function puff(i, w) {
    const im = new Image(); im.alt = ''; im.src = `images/sky/cloud${(i % 5) + 1}.webp`;
    im.style.width = w + 'px'; layer.appendChild(im); return im;
  }

  /* --- мягкий звук «вжух» (синтез, без файлов) --- */
  function whoosh(dur) { try { window.JuniorSfx && window.JuniorSfx('whoosh', dur); } catch (e) {} }

  /* --- ускорение настоящих облаков на фоне (меняем скорость их CSS-анимаций) --- */
  function gust(rate, ms) {
    const list = [];
    document.querySelectorAll('.sky-strip,.sky-cloud').forEach(el => el.getAnimations().forEach(a => { if (a.animationName === 'sky-strip' || a.animationName === 'sky-cross') list.push(a); }));
    if (!list.length) return;
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / ms), k = Math.sin(Math.PI * p);         // плавно разгон и торможение
      const r = 1 + (rate - 1) * k * k;
      list.forEach(a => { try { a.playbackRate = r; } catch (e) {} });
      if (p < 1) requestAnimationFrame(step); else list.forEach(a => { try { a.playbackRate = 1; } catch (e) {} });
    };
    requestAnimationFrame(step);
  }
  const strips = () => ['.sky-far', '.sky-mid', '.sky-fg'].map($);

  /* ===== 1. Полёт сквозь облака: камера летит вперёд, облака проносятся мимо ===== */
  async function fly(dir, swap, k) {
    const W = innerWidth, H = innerHeight, cx = W / 2, cy = H * .48, A = [];
    whoosh(.9 * k, dir > 0);
    const sky = $('.sky-bg');
    A.push(anim(sky, [{ scale: 1 }, { scale: dir > 0 ? 1.35 : .82, offset: .5 }, { scale: 1 }], { duration: 1150 * k, easing: 'cubic-bezier(.45,0,.3,1)' }));
    const [far, mid, fg] = strips();
    A.push(anim(fg, [{ translate: '0 0' }, { translate: `0 ${dir > 0 ? 18 : -6}vh`, offset: .5 }, { translate: '0 0' }], { duration: 1150 * k, easing: 'ease-in-out' }));
    A.push(anim(mid, [{ translate: '0 0' }, { translate: `0 ${dir > 0 ? 8 : -3}vh`, offset: .5 }, { translate: '0 0' }], { duration: 1150 * k, easing: 'ease-in-out' }));
    const n = mobile() ? 9 : 13;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * .4, w = (mobile() ? 220 : 340) + Math.random() * 120;
      const near = [Math.cos(a) * W * .06, Math.sin(a) * H * .06], far2 = [Math.cos(a) * W * .9, Math.sin(a) * H * .9];
      const im = puff(i, w); im.style.left = (cx - w / 2) + 'px'; im.style.top = (cy - w * .22) + 'px';
      const from = dir > 0 ? near : far2, to = dir > 0 ? far2 : near, s0 = dir > 0 ? .25 : 4.2, s1 = dir > 0 ? 4.2 : .25;
      A.push(anim(im, [
        { transform: `translate(${from[0]}px,${from[1]}px) scale(${s0})`, opacity: 0 },
        { opacity: 1, offset: .3 }, { opacity: 1, offset: .62 },
        { transform: `translate(${to[0]}px,${to[1]}px) scale(${s1})`, opacity: 0 }
      ], { duration: 1050 * k, delay: (90 + Math.random() * 160) * k, easing: 'cubic-bezier(.5,0,.6,1)' }));
    }
    const old = active();
    const o = anim(old, [{ scale: 1, opacity: 1, filter: 'blur(0)' }, { scale: dir > 0 ? 1.14 : .86, opacity: 0, filter: 'blur(10px)' }], { duration: 440 * k, easing: 'cubic-bezier(.5,0,.9,.6)' });
    await sleep(560 * k); swap(); o && o.cancel();
    A.push(anim(active(), [{ scale: dir > 0 ? .86 : 1.12, opacity: 0, filter: 'blur(10px)' }, { scale: 1, opacity: 1, filter: 'blur(0)' }], { duration: 620 * k, easing: 'cubic-bezier(.16,1,.3,1)' }));
    await done(A); A.forEach(a => a && a.cancel());
  }

  /* ===== 2. Подъём в небо: всё уходит вниз, облака пролетают сверху вниз, новый слайд опускается сверху ===== */
  async function rise(dir, swap, k) {
    const W = innerWidth, H = innerHeight, A = [], s = dir > 0 ? 1 : -1;
    whoosh(.95 * k, dir > 0);
    const [far, mid, fg] = strips();
    [[fg, 70], [mid, 40], [far, 18]].forEach(([el, v]) => A.push(anim(el, [{ translate: '0 0' }, { translate: `0 ${v * s}vh`, offset: .45 }, { translate: `0 ${v * s}vh`, offset: .55 }, { translate: '0 0' }], { duration: 1300 * k, easing: 'cubic-bezier(.6,0,.3,1)' })));
    const n = mobile() ? 8 : 12;
    for (let i = 0; i < n; i++) {
      const depth = Math.random(), w = (mobile() ? 140 : 200) + depth * (mobile() ? 220 : 340);
      const im = puff(i, w); im.style.left = (Math.random() * (W + w * .6) - w * .8) + 'px'; im.style.opacity = '0';
      const y0 = s > 0 ? -w * .6 - Math.random() * H * .3 : H + Math.random() * H * .3, y1 = s > 0 ? H + w * .3 : -w * .7;
      A.push(anim(im, [{ transform: `translateY(${y0}px)`, opacity: .2 + depth * .8 }, { transform: `translateY(${y1}px)`, opacity: .2 + depth * .8 }],
        { duration: (1150 - depth * 420) * k, delay: Math.random() * 260 * k, easing: 'cubic-bezier(.4,0,.6,1)' }));
    }
    const old = active();
    const o = anim(old, [{ translate: '0 0', opacity: 1 }, { translate: `0 ${s * 38}vh`, opacity: 0 }], { duration: 460 * k, easing: 'cubic-bezier(.6,0,.9,.5)' });
    await sleep(560 * k); swap(); o && o.cancel();
    A.push(anim(active(), [{ translate: `0 ${-s * 32}vh`, opacity: 0 }, { translate: `0 ${s * 1.4}vh`, opacity: 1, offset: .72 }, { translate: '0 0', opacity: 1 }], { duration: 720 * k, easing: 'cubic-bezier(.22,1,.36,1)' }));
    await done(A); A.forEach(a => a && a.cancel());
  }

  /* ===== 3. Порыв ветра: облака на фоне разгоняются, линии ветра, слайд уносит как листок ===== */
  async function wind(dir, swap, k) {
    const W = innerWidth, H = innerHeight, A = [], s = dir > 0 ? -1 : 1;
    whoosh(1 * k, dir > 0);
    gust(s * 70, 1300 * k);
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); layer.appendChild(svg);
    for (let i = 0; i < 7; i++) {
      const y = H * (.12 + i * .12) + Math.random() * 30, len = W * (.35 + Math.random() * .3), curl = 26 + Math.random() * 26;
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', `M0 ${y} C ${len * .35} ${y - curl}, ${len * .65} ${y + curl}, ${len} ${y} s ${curl} ${-curl * 1.6} ${-curl * .2} ${-curl * 1.3}`);
      p.setAttribute('stroke-width', String(2 + Math.random() * 3));
      const L = len + curl * 3; p.style.strokeDasharray = `${L * .45} ${L * 2}`;
      svg.appendChild(p);
      const x0 = s < 0 ? W + 40 : -len - 40, x1 = s < 0 ? -len - 40 : W + 40;
      A.push(anim(p, [{ transform: `translateX(${x0}px)`, strokeDashoffset: L * .45, opacity: 0 }, { opacity: .95, offset: .25 }, { opacity: .95, offset: .7 }, { transform: `translateX(${x1}px)`, strokeDashoffset: -L * .9, opacity: 0 }],
        { duration: (900 + Math.random() * 300) * k, delay: Math.random() * 280 * k, easing: 'cubic-bezier(.4,0,.5,1)' }));
    }
    for (let i = 0; i < (mobile() ? 4 : 6); i++) {
      const w = 160 + Math.random() * 220, im = puff(i, w); im.style.top = (Math.random() * H * .8) + 'px';
      const x0 = s < 0 ? W + 20 : -w - 20, x1 = s < 0 ? -w - 20 : W + 20;
      A.push(anim(im, [{ transform: `translateX(${x0}px)`, opacity: .95 }, { transform: `translateX(${x1}px)`, opacity: .95 }], { duration: (700 + Math.random() * 400) * k, delay: (120 + Math.random() * 300) * k, easing: 'linear' }));
    }
    const old = active();
    const o = anim(old, [{ translate: '0 0', rotate: '0deg', opacity: 1 }, { translate: `${s * 8}vw -1vh`, rotate: `${-s * 2}deg`, opacity: 1, offset: .35 }, { translate: `${s * 110}vw -6vh`, rotate: `${s * 9}deg`, opacity: 0 }], { duration: 560 * k, easing: 'cubic-bezier(.5,0,.85,.4)' });
    await sleep(520 * k); swap(); o && o.cancel();
    A.push(anim(active(), [{ translate: `${-s * 90}vw 3vh`, rotate: `${s * 6}deg`, opacity: 0 }, { translate: `${s * 1.5}vw 0`, rotate: `${-s * 1}deg`, opacity: 1, offset: .7 }, { translate: '0 0', rotate: '0deg', opacity: 1 }], { duration: 780 * k, easing: 'cubic-bezier(.22,1,.36,1)' }));
    await done(A); A.forEach(a => a && a.cancel());
  }

  const FX = { fly, rise, wind };

  async function run(from, to, apply, force) {
    if (busy) { pending = apply; return; }
    build(); busy = true; pending = apply;
    const k = mobile() ? .85 : 1, dir = to >= from ? 1 : -1;
    layer.classList.add('is-on');
    const swap = () => { const f = pending; pending = null; f && f(); };
    const guard = setTimeout(swap, 2600);
    try { await FX[force && FX[force] ? force : mode](dir, swap, k); } catch (e) { swap(); }
    clearTimeout(guard); swap();
    layer.textContent = ''; layer.classList.remove('is-on'); busy = false;
  }

  /* --- временная панель выбора варианта --- */
  function picker() {
    if (!SHOW_PICKER || $('#fx-pick')) return;
    const box = document.createElement('div'); box.id = 'fx-pick';
    const draw = () => {
      const T = NAMES[document.documentElement.lang === 'uz' ? 'uz' : 'ru'];
      box.innerHTML = `<b>${T.t}</b>` + Object.keys(FX).map(m => `<button type="button" data-fx="${m}" class="${m === mode ? 'on' : ''}">${T[m]}</button>`).join('');
    };
    draw();
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-fx]'); if (!b || busy) return;
      mode = b.dataset.fx; try { localStorage.setItem('junior-fx', mode); } catch (er) {}
      draw();
      const cur = Number(document.documentElement.dataset.currentSlide || 0);
      if (!(reduce && reduce.matches)) run(cur, cur + 1, () => {});           // показать переход прямо на этом слайде
    });
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    document.body.appendChild(box);
  }

  window.addEventListener('load', () => { picker(); setTimeout(() => { ready = true; }, 400); });
  window.JuniorFx = {
    run,
    isBusy: () => busy,
    canRun: (a, b) => ready && !!Element.prototype.animate && !(reduce && reduce.matches) && !document.hidden && a !== b && !!active()
  };
})();
