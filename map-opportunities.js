/* Слайд 3 «Карта возможностей»: флаг, главная карточка и карточки 2–3 подстраиваются под предметы и возраст. Тексты ru/uz — здесь. */
(() => {
  'use strict';
  const slide = document.getElementById('slide-2');
  if (!slide) return;
  const ORDER = ['web', 'math', 'english'];
  const root = document.documentElement;

  const T = {
    ru: {
      title_a: 'Твои интересы сегодня —', title_b: 'твои возможности завтра!',
      sub: 'Узнай, что ты сможешь создавать, какие навыки развивать и какие новые горизонты откроются перед тобой.',
      pin_web: 'Программирование', pin_math: 'Математика', pin_english: 'Английский язык',
      card_title: 'Твои идеи могут стать реальностью!',
      back: '← Назад', next: 'Далее: познакомься со своей командой',
      flag: {
        web: 'Веб-разработчик', math: 'Аналитик', english: 'Мир без границ',
        'web math': 'Создатель игр и технологий', 'web english': 'Международный IT-разработчик',
        'math english': 'Международное образование', 'web math english': 'Создатель технологий будущего'
      },
      age: {
        kids: 'Представь, сколько интересного ты сможешь создать!',
        juniors: 'Пробуй, создавай и открывай свои способности!',
        teens: 'Начни развивать навыки для будущей карьеры уже сегодня!'
      },
      c1: ['Развивай мышление', 'Находи нестандартные решения и уверенно справляйся с новыми задачами.'],
      c2: {
        web: ['Создавай собственные проекты', 'Делай сайты и игры, превращая идеи в настоящие проекты.'],
        math: ['Применяй математику на деле', 'Находи закономерности и принимай умные решения.'],
        english: ['Рассказывай о своих идеях', 'Общайся с ровесниками из других стран на английском.'],
        'web math': ['Создавай игры и алгоритмы', 'Соединяй код и логику, чтобы идеи заработали.'],
        'web english': ['Создавай проекты для всего мира', 'Делай сайты и приложения для людей из разных стран.'],
        'math english': ['Применяй знания на практике', 'Решай сложные задачи и объясняй идеи на английском.'],
        'web math english': ['Создавай собственные проекты', 'Делай сайты и игры, подключая логику и английский.']
      },
      c3t: 'Открывай новые горизонты',
      c3: {
        web: 'Осваивай технологии будущего и расширяй свои возможности.',
        math: 'Готовься к олимпиадам, науке и профессиям с логикой и анализом.',
        english: 'Получай знания со всего мира и расширяй свои возможности.',
        'web math': 'Открывай игры, данные, инженерию и новые технологии.',
        'web english': 'Входи в мировое IT-сообщество и расширяй своё будущее.',
        'math english': 'Готовься к олимпиадам и новым образовательным возможностям.',
        'web math english': 'Получай знания со всего мира и расширяй свои возможности.'
      }
    },
    uz: {
      title_a: 'Bugungi qiziqishlaring —', title_b: 'ertangi imkoniyatlaring!',
      sub: 'Nimalar yaratishing, qanday ko‘nikmalarni rivojlantirishing va oldingda qanday yangi imkoniyatlar ochilishini kashf et!',
      pin_web: 'Dasturlash', pin_math: 'Matematika', pin_english: 'Ingliz tili',
      card_title: 'G‘oyalaring haqiqiy loyihalarga aylanishi mumkin!',
      back: '← Orqaga', next: 'Keyingi: jamoang bilan tanish',
      flag: {
        web: 'Veb-dasturchi', math: 'Tahlilchi', english: 'Chegarasiz dunyo',
        'web math': 'O‘yin va texnologiyalar yaratuvchisi', 'web english': 'Xalqaro IT-dasturchi',
        'math english': 'Xalqaro ta’lim', 'web math english': 'Kelajak texnologiyalari yaratuvchisi'
      },
      age: {
        kids: 'Qancha qiziqarli narsalarni yarata olishingni tasavvur qil!',
        juniors: 'Sinab ko‘r, yarat va qobiliyatlaringni kashf et!',
        teens: 'Kelajak kasbing uchun ko‘nikmalarni bugundan rivojlantir!'
      },
      c1: ['Fikrlashingni rivojlantir', 'Noodatiy yechimlarni top va yangi vazifalarni ishonch bilan bajar.'],
      c2: {
        web: ['O‘z loyihalaringni yarat', 'Saytlar va o‘yinlar yarat, g‘oyalaringni haqiqiy loyihaga aylantir.'],
        math: ['Matematikani amalda qo‘lla', 'Qonuniyatlarni top va aqlli qarorlar qabul qil.'],
        english: ['G‘oyalaring haqida gapirib ber', 'Boshqa mamlakatlardagi tengdoshlaring bilan ingliz tilida muloqot qil.'],
        'web math': ['O‘yinlar va algoritmlar yarat', 'Kod va mantiqni birlashtir, g‘oyalaring ishlasin.'],
        'web english': ['Butun dunyo uchun loyihalar yarat', 'Turli mamlakatlardagi odamlar uchun saytlar va ilovalar yarat.'],
        'math english': ['Bilimlaringni amalda qo‘lla', 'Murakkab masalalarni yech, g‘oyalaringni ingliz tilida tushuntir.'],
        'web math english': ['O‘z loyihalaringni yarat', 'Saytlar va o‘yinlar yarat, mantiq va ingliz tilini qo‘sh.']
      },
      c3t: 'Yangi imkoniyatlarni kashf et',
      c3: {
        web: 'Kelajak texnologiyalarini o‘zlashtir va imkoniyatlaringni kengaytir.',
        math: 'Olimpiadalarga, fanga va mantiq talab qilinadigan kasblarga tayyorlan.',
        english: 'Butun dunyo bilimlarini o‘rgan va imkoniyatlaringni kengaytir.',
        'web math': 'O‘yinlar, ma’lumotlar, muhandislik va yangi texnologiyalarni kashf et.',
        'web english': 'Jahon IT hamjamiyatiga qo‘shil va kelajagingni kengaytir.',
        'math english': 'Olimpiadalarga va yangi ta’lim imkoniyatlariga tayyorlan.',
        'web math english': 'Butun dunyo bilimlarini o‘rgan va imkoniyatlaringni kengaytir.'
      }
    }
  };

  const lang = () => (root.lang === 'uz' ? 'uz' : 'ru');
  const programs = () => {
    const list = ORDER.filter(p => (root.dataset.lessonPrograms || '').split(' ').includes(p));
    return list.length ? list : ORDER.slice(); // если слайд открыт напрямую — показываем все три
  };
  const ageKey = () => {
    const r = document.querySelector('input[name="lesson-age"]:checked');
    return r ? r.value : 'juniors';
  };
  const $ = id => document.getElementById(id);

  let last = null;
  function render(noSwap) {
    const d = T[lang()];
    const sel = programs();
    const key = sel.join(' ');
    const age = ageKey();

    slide.querySelectorAll('[data-m]').forEach(el => { const v = d[el.dataset.m]; if (typeof v === 'string') el.textContent = v; });

    $('map-stage').dataset.count = String(sel.length);
    slide.querySelectorAll('.map-pin').forEach(pin => {
      const i = sel.indexOf(pin.dataset.pin);
      pin.classList.toggle('is-on', i >= 0);
      pin.style.setProperty('--d', Math.max(i, 0));
      const lab = slide.querySelector(`.map-pin-label[data-label="${pin.dataset.pin}"]`);
      if (lab) lab.style.setProperty('--d', Math.max(i, 0));
    });
    slide.querySelectorAll('.map-pin-label').forEach(l => l.classList.toggle('is-off', !sel.includes(l.dataset.label)));
    slide.querySelectorAll('.map-veil').forEach(v => v.classList.toggle('is-off', !sel.includes(v.dataset.veil)));

    const goal = d.flag[key];
    $('map-goal-flag').textContent = goal;
    const flagBox = slide.querySelector('.map-flag');
    flagBox.toggleAttribute('data-long', goal.length > 24);

    $('map-age-text').textContent = d.age[age] || d.age.juniors;
    $('map-c1-t').textContent = d.c1[0]; $('map-c1-p').textContent = d.c1[1];
    $('map-c2-t').textContent = d.c2[key][0]; $('map-c2-p').textContent = d.c2[key][1];
    $('map-c3-t').textContent = d.c3t; $('map-c3-p').textContent = d.c3[key];

    // Смена языка или выбора, пока слайд на экране: плавная смена текстов
    const snap = key + '|' + age + '|' + lang();
    if (!noSwap && last && last !== snap && slide.classList.contains('active')) swap();
    last = snap;

    // Результат остаётся в браузере (на сайте нет аккаунтов и сервера)
    try { sessionStorage.setItem('junior.mapResult', JSON.stringify({ programs: sel, age, goalKey: key })); } catch (_) {}
  }

  let swapTimer;
  function swap() {
    slide.classList.remove('is-swap');
    void slide.offsetWidth;
    slide.classList.add('is-swap');
    clearTimeout(swapTimer);
    swapTimer = setTimeout(() => slide.classList.remove('is-swap'), 1300);
  }

  // Параллакс от мыши (только компьютер с мышью)
  const stage = $('map-stage');
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  stage.addEventListener('pointermove', e => {
    if (!fine.matches || calm.matches || raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const r = stage.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      stage.style.setProperty('--px', Math.max(-1, Math.min(1, nx)).toFixed(3));
      stage.style.setProperty('--py', Math.max(-1, Math.min(1, ny)).toFixed(3));
    });
  });
  stage.addEventListener('pointerleave', () => { stage.style.setProperty('--px', 0); stage.style.setProperty('--py', 0); });

  $('map-back-btn').addEventListener('click', () => window.goToSlide(1));
  $('map-next-btn').addEventListener('click', () => window.goToSlide(3));

  document.addEventListener('junior:programchange', () => render(true));
  new MutationObserver(() => { if (root.dataset.currentSlide === '2') render(true); }).observe(root, { attributes: true, attributeFilter: ['data-current-slide'] });
  new MutationObserver(() => render()).observe(root, { attributes: true, attributeFilter: ['lang', 'data-lesson-programs'] });
  document.querySelectorAll('input[name="lesson-age"]').forEach(i => i.addEventListener('change', () => render(true)));
  render();
})();
