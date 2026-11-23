/* «Конструктор сайта» для 11–17 лет: 5 шагов (Текст → Цвета → Кнопка → Изображение → Готово).
   Ученик правит сайт TravelDiscover, а справа сразу видит результат («Было / Стало»).
   Подключается лениво с острова «Программирование». Картинки: images/builder/*.webp (если файла нет — показывается заглушка). */
(() => {
  'use strict';
  const IMG = 'images/builder/';
  const T = {
    ru: {
      title: 'Конструктор сайта', back: 'К островам', steps: ['Текст', 'Цвета', 'Кнопка', 'Изображение', 'Готово'],
      tools: 'Инструменты', blocks: 'Блоки', hint: 'Подсказка', task: 'Задание', next: 'Далее', finish: 'Завершить', preview: 'Просмотр сайта', before: 'Было', after: 'Стало',
      nav: ['Главная', 'Направления', 'Блог', 'Контакты'], cards: ['Европа', 'Азия', 'Другие страны'], fullscreen: 'На весь экран',
      v: {
        text: { h: 'Редактируй текст на сайте', hint: 'Измени текст сайта, и результат сразу появится справа.', task: 'Измени главный заголовок сайта на свой вариант.', code: 'Код (HTML)' },
        color: { h: 'Выбери цвета сайта', hint: 'Нажимай на цвета: сайт справа меняется сразу.', task: 'Выбери новый цвет для кнопки сайта.', code: 'Код (CSS)' },
        btn: { h: 'Настрой кнопку', hint: 'Чем больше скругление, тем круглее кнопка.', task: 'Выбери форму кнопки.', code: 'Код (CSS)' },
        img: { h: 'Выбери картинку сайта', hint: 'Нажми на картинку: она появится на главной странице.', task: 'Выбери картинку для главной страницы.', code: 'Код (HTML)' },
        blocks: { h: 'Блоки сайта', hint: 'Включай и выключай карточки направлений.', task: 'Включай и выключай блоки. Это по желанию, потом нажми «Далее».', code: 'Код (HTML)' },
        done: { h: 'Твой сайт готов!', hint: 'Нажми «Было» и «Стало», чтобы сравнить сайт до и после.', task: 'Сравни «Было» и «Стало», потом нажми «Завершить».' }
      },
      f: { h1: 'Главный заголовок', desc: 'Текст описания', btn: 'Текст кнопки', ph1: 'Например: Открой новые города', ideas: 'Идеи:', accent: 'Цвет слова в заголовке', btnc: 'Цвет кнопки', shape: 'Форма кнопки', sq: 'Квадратная', rd: 'Скруглённая', pill: 'Круглая', size: 'Размер', imgs: ['Города', 'Горы', 'Море'], blk: 'Показать на сайте' },
      ideas: ['Открой новые города', 'Путешествуй с нами', 'Мир ждёт тебя'],
      done: { l1: 'Ты изменил текст, цвета, кнопку и картинку.', l2: 'Это и есть работа веб-разработчика: код превращается в сайт.', big: 'Сайт собран!' },
      was: { h1: 'Добро пожаловать', desc: 'Мы рассказываем о путешествиях.', btn: 'Нажми' }
    },
    uz: {
      title: 'Sayt konstruktori', back: 'Orollarga', steps: ['Matn', 'Ranglar', 'Tugma', 'Rasm', 'Tayyor'],
      tools: 'Asboblar', blocks: 'Bloklar', hint: 'Maslahat', task: 'Topshiriq', next: 'Keyingisi', finish: 'Yakunlash', preview: 'Saytni ko‘rish', before: 'Oldin', after: 'Keyin',
      nav: ['Bosh sahifa', 'Yo‘nalishlar', 'Blog', 'Aloqa'], cards: ['Yevropa', 'Osiyo', 'Boshqa davlatlar'], fullscreen: 'To‘liq ekran',
      v: {
        text: { h: 'Saytdagi matnni tahrirla', hint: 'Matnni o‘zgartir, natija o‘ng tomonda darrov chiqadi.', task: 'Saytning bosh sarlavhasini o‘zingnikiga almashtir.', code: 'Kod (HTML)' },
        color: { h: 'Sayt ranglarini tanla', hint: 'Ranglarni bos: o‘ngdagi sayt darrov o‘zgaradi.', task: 'Sayt tugmasi uchun yangi rang tanla.', code: 'Kod (CSS)' },
        btn: { h: 'Tugmani sozla', hint: 'Yumaloqlik qancha katta bo‘lsa, tugma shuncha dumaloq.', task: 'Tugma shaklini tanla.', code: 'Kod (CSS)' },
        img: { h: 'Sayt rasmini tanla', hint: 'Rasmni bos: u bosh sahifada paydo bo‘ladi.', task: 'Bosh sahifa uchun rasm tanla.', code: 'Kod (HTML)' },
        blocks: { h: 'Sayt bloklari', hint: 'Yo‘nalish kartalarini yoqib-o‘chir.', task: 'Bloklarni yoq va o‘chir. Bu ixtiyoriy, keyin «Keyingisi» ni bos.', code: 'Kod (HTML)' },
        done: { h: 'Saytingiz tayyor!', hint: '«Oldin» va «Keyin» ni bosib, sayt qanday o‘zgarganini solishtir.', task: '«Oldin» va «Keyin» ni solishtir, keyin «Yakunlash» ni bos.' }
      },
      f: { h1: 'Bosh sarlavha', desc: 'Tavsif matni', btn: 'Tugma matni', ph1: 'Masalan: Yangi shaharlarni kashf et', ideas: 'G‘oyalar:', accent: 'Sarlavhadagi so‘z rangi', btnc: 'Tugma rangi', shape: 'Tugma shakli', sq: 'Kvadrat', rd: 'Yumaloqlangan', pill: 'Dumaloq', size: 'O‘lcham', imgs: ['Shaharlar', 'Tog‘lar', 'Dengiz'], blk: 'Saytda ko‘rsatish' },
      ideas: ['Yangi shaharlarni kashf et', 'Biz bilan sayohat qil', 'Dunyo seni kutmoqda'],
      done: { l1: 'Sen matn, ranglar, tugma va rasmni o‘zgartirding.', l2: 'Veb-dasturchi ishi shunday: kod saytga aylanadi.', big: 'Sayt tayyor!' },
      was: { h1: 'Xush kelibsiz', desc: 'Biz sayohatlar haqida gapiramiz.', btn: 'Bosing' }
    }
  };
  const COLORS = ['#ff7a00', '#2f8cff', '#7a5cff', '#1fc99a', '#ff5c8a', '#f5b800'];
  const IMGS = [{ id: 'city', emoji: '🕌', bg: 'linear-gradient(180deg,#8fd0ff,#ffe2b8 70%,#ffb27a)' }, { id: 'mountain', emoji: '🏔️', bg: 'linear-gradient(180deg,#a6d8ff,#e8f4ff 65%,#9fd49a)' }, { id: 'sea', emoji: '🏝️', bg: 'linear-gradient(180deg,#8fe0ff,#d6f6ff 55%,#47b6e8)' }];
  const SHAPES = { sq: 6, rd: 16, pill: 999 };
  const SIZES = { s: '8px 16px', m: '11px 22px', l: '14px 28px' };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function mount(opts) {
    const lang = () => (opts.lang && opts.lang() === 'uz' ? 'uz' : 'ru');
    const t = () => T[lang()];
    const was = () => ({ h1: t().was.h1, desc: t().was.desc, btn: t().was.btn });
    const D = { h1: null, desc: null, btn: null, accent: '#7f8aa3', btnc: '#9aa3b5', shape: 'sq', size: 'm', img: 'none', cards: [true, true, true], touched: {} };
    let view = 'text', step = 0, max = 0, cmp = 'after', focusLine = 0, off = false, ended = false;
    const root = document.createElement('div'); root.className = 'sb'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Конструктор сайта');
    document.body.appendChild(root); document.documentElement.classList.add('sb-open');
    const VIEWS = ['text', 'color', 'btn', 'img', 'done'];
    const sfx = n => { try { window.JuniorSfx && window.JuniorSfx(n); } catch (e) {} };

    const cur = () => (cmp === 'before' ? { ...was(), accent: '#7f8aa3', btnc: '#9aa3b5', shape: 'sq', size: 'm', img: 'none', cards: [true, true, true] } : { h1: D.h1 == null ? was().h1 : D.h1, desc: D.desc == null ? was().desc : D.desc, btn: D.btn == null ? was().btn : D.btn, accent: D.accent, btnc: D.btnc, shape: D.shape, size: D.size, img: D.img, cards: D.cards });
    const taskDone = () => {
      if (view === 'text') return D.h1 != null && D.h1.trim() && D.h1 !== was().h1;
      if (view === 'color') return !!(D.touched.btnc);
      if (view === 'btn') return !!D.touched.shape;
      if (view === 'img') return D.img !== 'none';
      return true;
    };
    const accentH1 = h => { const w = h.trim().split(/\s+/); if (w.length < 2) return `<span class="acc">${esc(h)}</span>`; const last = w.pop(); return esc(w.join(' ')) + ' <span class="acc">' + esc(last) + '</span>'; };

    function previewHTML() {
      const c = cur(), L = t(), im = IMGS.find(i => i.id === c.img);
      const radius = SHAPES[c.shape], pad = SIZES[c.size];
      const cards = L.cards.map((n, i) => c.cards[i] ? `<div class="sb-card"><i><img src="${IMG}icon-${['europe', 'asia', 'other'][i]}.webp" alt="" onerror="this.replaceWith(document.createTextNode('${['🏛️', '⛰️', '🏝️'][i]}'))"></i><b>${esc(n)}</b><span aria-hidden="true">›</span></div>` : '').join('');
      return `<div class="sb-browser"><div class="sb-bdots"><i></i><i></i><i></i></div>
        <div class="sb-site"><div class="sb-snav"><span class="sb-logo"><img src="${IMG}logo-plane.webp" alt="" width="26" height="26" onerror="this.remove()">TravelDiscover</span><span class="sb-links">${L.nav.map(n => `<a>${esc(n)}</a>`).join('')}</span></div>
        <div class="sb-hero${im ? '' : ' empty'}" ${im ? `style="background:${im.bg}"` : ''}>${im ? `<img class="sb-bg" src="${IMG}hero-${im.id}.webp" alt="" onerror="this.remove()">` : ''}<div class="sb-htxt"><h2>${accentH1(c.h1).replace('class="acc"', `class="acc" style="color:${c.accent}"`)}</h2><p>${esc(c.desc)}</p>
        <a class="sb-btn" style="background:${c.btnc};border-radius:${radius}px;padding:${pad}">${esc(c.btn)} <span aria-hidden="true">→</span></a></div>
        <div class="sb-cards">${cards}</div></div></div></div>`;
    }
    function codeHTML() {
      const c = cur(), L = t(); let lines = [];
      if (view === 'text') lines = [`<h1>${c.h1}</h1>`, `<p>${c.desc}</p>`, `<a class="btn">${c.btn}</a>`];
      else if (view === 'color') lines = [`h1 span { color: ${c.accent}; }`, `.btn { background: ${c.btnc}; }`];
      else if (view === 'btn') lines = [`.btn {`, `  border-radius: ${SHAPES[c.shape]}px;`, `  padding: ${SIZES[c.size]};`, `}`];
      else if (view === 'img') lines = c.img === 'none' ? ['<img src="" alt="">'] : [`<img src="hero-${c.img}.webp"`, `     alt="${L.f.imgs[IMGS.findIndex(i => i.id === c.img)]}">`];
      else if (view === 'blocks') lines = c.cards.map((on, i) => on ? `<div class="card">${L.cards[i]}</div>` : null).filter(Boolean);
      const hl = view === 'text' ? focusLine : view === 'color' ? (D.touched.btnc && !D.touched.accent ? 1 : 0) : view === 'btn' ? 1 : -1;
      return `<div class="sb-code"><div class="sb-codeh">‹›&nbsp; ${L.v[view].code}</div><div class="sb-codeb">${lines.map((l, i) => `<div class="ln${i === hl ? ' hl' : ''}"><em>${i + 1}</em><code>${esc(l).replace(/^ +/, m => '&nbsp;'.repeat(m.length))}</code></div>`).join('')}</div></div>`;
    }
    function editorHTML() {
      const L = t(), F = L.f, c = cur();
      if (view === 'text') {
        const ico = (cls, s) => `<i class="sb-ico ${cls}">${s}</i>`;
        return `<div class="sb-fields">
          <label class="sb-fld on">${ico('o', 'H1')}<span><small>${F.h1}</small><input id="sbi-h1" maxlength="38" autocomplete="off" placeholder="${F.ph1}" value="${esc(D.h1 == null ? '' : D.h1)}"></span></label>
          <div class="sb-ideas"><small>${F.ideas}</small>${t().ideas.map((x, i) => `<button type="button" data-idea="${i}">${esc(x)}</button>`).join('')}</div>
          <label class="sb-fld">${ico('p', '≡')}<span><small>${F.desc}</small><input id="sbi-desc" maxlength="70" autocomplete="off" value="${esc(c.desc)}"></span></label>
          <label class="sb-fld">${ico('b', '➤')}<span><small>${F.btn}</small><input id="sbi-btn" maxlength="24" autocomplete="off" value="${esc(c.btn)}"></span></label></div>`;
      }
      if (view === 'color') {
        const row = (key, label) => `<div class="sb-row"><small>${label}</small><div class="sb-sw">${COLORS.map(col => `<button type="button" class="${D[key] === col ? 'on' : ''}" data-col="${key}:${col}" style="background:${col}" aria-label="${col}"></button>`).join('')}</div></div>`;
        return `<div class="sb-fields">${row('accent', F.accent)}${row('btnc', F.btnc)}</div>`;
      }
      if (view === 'btn') {
        return `<div class="sb-fields"><div class="sb-row"><small>${F.shape}</small><div class="sb-seg">${Object.keys(SHAPES).map(k => `<button type="button" class="${D.shape === k && D.touched.shape ? 'on' : ''}" data-shape="${k}"><i style="border-radius:${Math.min(SHAPES[k], 14)}px"></i>${F[k]}</button>`).join('')}</div></div>
          <div class="sb-row"><small>${F.size}</small><div class="sb-seg">${['s', 'm', 'l'].map(k => `<button type="button" class="${D.size === k ? 'on' : ''}" data-size="${k}">${k.toUpperCase()}</button>`).join('')}</div></div></div>`;
      }
      if (view === 'img') {
        return `<div class="sb-fields"><div class="sb-imgs">${IMGS.map((im, i) => `<button type="button" class="${D.img === im.id ? 'on' : ''}" data-img="${im.id}"><span style="background:${im.bg}"><b>${im.emoji}</b><img src="${IMG}hero-${im.id}.webp" alt="" onerror="this.remove()"></span><em>${F.imgs[i]}</em></button>`).join('')}</div></div>`;
      }
      if (view === 'blocks') {
        return `<div class="sb-fields"><small class="sb-cap">${F.blk}</small>${L.cards.map((n, i) => `<label class="sb-tog"><input type="checkbox" data-blk="${i}" ${D.cards[i] ? 'checked' : ''}><span class="sw"></span><i><img src="${IMG}icon-${['europe', 'asia', 'other'][i]}.webp" alt="" onerror="this.replaceWith(document.createTextNode('${['🏛️', '⛰️', '🏝️'][i]}'))"></i><b>${esc(n)}</b></label>`).join('')}</div>`;
      }
      return `<div class="sb-fields sb-win"><div class="sb-trophy">🎉</div><b>${L.done.big}</b><p>${L.done.l1}</p><p>${L.done.l2}</p></div>`;
    }

    function render() {
      const L = t(), V = L.v[view], isDone = view === 'done', ok = taskDone();
      const toolDefs = [['text', 'T', L.steps[0], 0], ['color', '🎨', L.steps[1], 1], ['btn', '☝', L.steps[2], 2], ['img', '🖼', L.steps[3], 3], ['blocks', '▦', L.blocks, -1]];
      root.innerHTML = `
        <header class="sb-top"><button type="button" class="sb-back" data-a="back" aria-label="${L.back}">‹</button>
          <img class="sb-logoimg" src="images/junior_logo.webp" alt="Junior" width="120" height="40"><span class="sb-sep"></span><h1>${L.title}</h1>
          <nav class="sb-steps">${L.steps.map((s, i) => `<button type="button" class="${i === step && view !== 'blocks' ? 'cur' : ''} ${i < step ? 'done' : ''}" data-step="${i}" ${i > max ? 'disabled' : ''}><b>${i < step ? '✓' : i + 1}</b><span>${s}</span></button>${i < 4 ? '<em>→</em>' : ''}`).join('')}</nav>
          <button type="button" class="sb-fs" data-a="fs" aria-label="${L.fullscreen}">⛶</button></header>
        <main class="sb-main">
          <aside class="sb-panel sb-tools"><h3>${L.tools}</h3>
            ${toolDefs.map(([v, ic, nm, si]) => `<button type="button" class="sb-tool ${view === v ? 'on' : ''}" data-tool="${v}" ${si > max ? 'disabled' : ''}><i>${ic}</i><span>${esc(nm)}</span><em>›</em></button>`).join('')}
            <div class="sb-hint"><i>💡</i><div><b>${L.hint}</b><p>${V.hint}</p></div></div></aside>
          <section class="sb-panel sb-edit"><h3>${V.h}</h3>${editorHTML()}${isDone ? '' : `<div id="sb-codewrap">${codeHTML()}</div>`}</section>
          <section class="sb-panel sb-prev"><div class="sb-prevh"><h3><i>👁</i>${L.preview}</h3><div class="sb-cmp"><button type="button" data-cmp="before" class="${cmp === 'before' ? 'on' : ''}">${L.before}</button><button type="button" data-cmp="after" class="${cmp === 'after' ? 'on' : ''}">✓ ${L.after}</button></div></div><div id="sb-pv">${previewHTML()}</div></section>
        </main>
        <footer class="sb-foot"><div class="sb-task"><i>🎯</i><b>${L.task}</b><span class="sb-tsep"></span><p>${V.task}</p></div><button type="button" class="sb-next" data-a="next" ${ok ? '' : 'disabled'}>${isDone ? L.finish : L.next} →</button></footer>`;
    }
    const refresh = () => { const pv = root.querySelector('#sb-pv'); if (pv) pv.innerHTML = previewHTML(); const cw = root.querySelector('#sb-codewrap'); if (cw) cw.innerHTML = codeHTML(); const nx = root.querySelector('.sb-next'); if (nx) nx.disabled = !taskDone(); };

    function go(v) { view = v; const i = VIEWS.indexOf(v); if (i >= 0) step = i; cmp = 'after'; render(); }
    root.addEventListener('input', e => {
      const id = e.target.id;
      if (id === 'sbi-h1') { D.h1 = e.target.value; focusLine = 0; sfx('tick'); }
      else if (id === 'sbi-desc') { D.desc = e.target.value; focusLine = 1; }
      else if (id === 'sbi-btn') { D.btn = e.target.value; focusLine = 2; }
      else return;
      cmp = 'after'; const cc = root.querySelector('.sb-cmp'); if (cc) cc.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.cmp === 'after')); refresh();
    });
    root.addEventListener('change', e => { const b = e.target.closest('[data-blk]'); if (b) { D.cards[+b.dataset.blk] = b.checked; sfx('pop'); cmp = 'after'; refresh(); } });
    root.addEventListener('focusin', e => { const id = e.target.id; const m = { 'sbi-h1': 0, 'sbi-desc': 1, 'sbi-btn': 2 }; if (id in m) { focusLine = m[id]; refresh(); } });
    root.addEventListener('click', e => {
      const q = s => e.target.closest(s);
      let el;
      if ((el = q('[data-a]'))) {
        const a = el.dataset.a;
        if (a === 'back') { sfx('click'); opts.onExit && opts.onExit(); }
        else if (a === 'fs') { const d = document; try { d.fullscreenElement ? d.exitFullscreen() : root.requestFullscreen && root.requestFullscreen(); } catch (er) {} }
        else if (a === 'next' && !el.disabled) {
          sfx('star');
          if (view === 'done') { if (!ended) { ended = true; opts.onComplete && opts.onComplete(); } return; }
          if (view === 'blocks') { go(VIEWS[Math.min(max, 4)]); return; }
          const nxt = step + 1;
          max = Math.max(max, nxt); go(VIEWS[nxt]);
        }
      } else if ((el = q('[data-step]')) && !el.disabled) { sfx('click'); go(VIEWS[+el.dataset.step]); }
      else if ((el = q('[data-tool]')) && !el.disabled) { sfx('click'); go(el.dataset.tool); }
      else if ((el = q('[data-cmp]'))) { cmp = el.dataset.cmp; sfx('pop'); root.querySelectorAll('.sb-cmp button').forEach(b => b.classList.toggle('on', b.dataset.cmp === cmp)); refresh(); }
      else if ((el = q('[data-idea]'))) { const inp = root.querySelector('#sbi-h1'); D.h1 = t().ideas[+el.dataset.idea]; inp.value = D.h1; focusLine = 0; cmp = 'after'; sfx('pop'); refresh(); }
      else if ((el = q('[data-col]'))) { const [k, c] = el.dataset.col.split(':'); D[k] = c; D.touched[k] = true; cmp = 'after'; sfx('pop'); el.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === el)); refresh(); }
      else if ((el = q('[data-shape]'))) { D.shape = el.dataset.shape; D.touched.shape = true; cmp = 'after'; sfx('pop'); el.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === el)); refresh(); }
      else if ((el = q('[data-size]'))) { D.size = el.dataset.size; cmp = 'after'; sfx('pop'); el.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === el)); refresh(); }
      else if ((el = q('[data-img]'))) { D.img = el.dataset.img; cmp = 'after'; sfx('pop'); el.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === el)); refresh(); }
    });
    const onKey = e => { if (e.key === 'Escape' && !document.fullscreenElement) { opts.onExit && opts.onExit(); } };
    document.addEventListener('keydown', onKey);
    render();
    return {
      setLang() { if (!off) render(); },
      destroy() { off = true; document.removeEventListener('keydown', onKey); try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {} root.remove(); document.documentElement.classList.remove('sb-open'); }
    };
  }
  window.JuniorSiteBuilder = { mount };
})();
