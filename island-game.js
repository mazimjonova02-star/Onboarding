/* Слайд 6 «Острова»: ученик выбирает остров, камера летит к нему, открывается короткая игра на 3 задания.
   Сложность зависит от возраста (kids / juniors / teens). Ошибиться нельзя: первая ошибка — подсказка, вторая — робот решает вместе.
   Без таймера и оценок. Тексты RU/UZ. Прежняя практика лежит скрытой в .legacy-practice. */
(() => {
  'use strict';
  const root = document.documentElement;
  const stage = document.getElementById('island-stage');
  const play = document.getElementById('island-play');
  const studio = document.getElementById('ig-studio');
  if (!stage || !play) return;
  const lang = () => (root.lang === 'uz' ? 'uz' : 'ru');
  const L = x => (x && typeof x === 'object' && !Array.isArray(x) && 'ru' in x ? x[lang()] : x);
  const sfx = n => { try { window.JuniorSfx && window.JuniorSfx(n); } catch (e) {} };
  const ARROW = { U: '↑', D: '↓', L: '←', R: '→' };
  const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z"/></svg>';

  const T = {
    ru: {
      title_a: 'Выбери остров,', title_b: 'и лети!', sub: 'Нажми на остров, и начнётся короткая игра. Ошибиться нельзя: робот всегда подскажет.',
      n_web: 'Программирование', n_math: 'Математика', n_english: 'Английский', t_web: 'Командуй роботом', t_math: 'Решай головоломки', t_english: 'Угадывай слова',
      tag_choice: 'Твой выбор', next_hint: 'Слетай хотя бы на один остров', back: '← К островам', studio_done: 'Готово ✓', ask_tag: 'Вопрос ученикам', ach: 'Мои достижения', next: 'Дальше →', finish: 'Завершить миссию →',
      cheer: ['Отлично!', 'Верно!', 'Так держать!', 'Супер!'], assisted: 'Вместе у нас получилось! Идём дальше.',
      wrong2: 'Давай решим вместе: правильный ответ подсвечен.', path_miss: 'Почти! Робот не дошёл до звезды. ', hint: 'Подсказка: ',
      run: 'Запуск ▶', clear: 'Стереть', round: 'Задание',
      hello_web: 'Привет! Помоги мне запрограммировать путь!', hello_math: 'Привет! Найди нужные числа, и ворота откроются!', hello_english: 'Hello! Помоги мне найти нужные слова!',
      res_ok: 'Отличная работа!', res_web: 'Ты провёл Стива к порталу и собрал свой первый алгоритм!', res_web_site: 'Ты собрал свой первый сайт: текст, цвета, кнопка и картинка!', res_math: 'Ты решил все головоломки и открыл ворота!', res_english: 'Ты нашёл нужные слова и помог роботу!', chip_done: 'Уровень пройден', chip_web: 'Алгоритм собран', chip_web_site: 'Сайт собран', chip_math: 'Задачи решены', chip_english: 'Слова найдены', chip_stars: '3 звезды из 3',
      res_title: 'Миссия выполнена!', res_text: 'Ты так легко проходишь логические задания — значит, и наши уроки по IT тебе по силам! Ты научишься программировать и сможешь сам создавать такие же игры.', res_btn: 'Продолжить приключение →'
    },
    uz: {
      title_a: 'Orolni tanla,', title_b: 'va uch!', sub: 'Orolga bos, qisqa o‘yin boshlanadi. Xato qilish mumkin emas: robot doim yordam beradi.',
      n_web: 'Dasturlash', n_math: 'Matematika', n_english: 'Ingliz tili', t_web: 'Robotni boshqar', t_math: 'Boshqotirmalarni yech', t_english: 'So‘zlarni top',
      tag_choice: 'Sening tanloving', next_hint: 'Hech bo‘lmasa bitta orolga uch', back: '← Orollarga', studio_done: 'Tayyor ✓', ask_tag: 'O‘quvchilarga savol', ach: 'Yutuqlarim', next: 'Keyingi →', finish: 'Missiyani yakunlash →',
      cheer: ['Zo‘r!', 'To‘g‘ri!', 'Barakalla!', 'Ajoyib!'], assisted: 'Birga uddaladik! Davom etamiz.',
      wrong2: 'Keling, birga hal qilamiz: to‘g‘ri javob belgilandi.', path_miss: 'Deyarli! Robot yulduzga yetib bormadi. ', hint: 'Maslahat: ',
      run: 'Ishga tushir ▶', clear: 'O‘chirish', round: 'Topshiriq',
      hello_web: 'Salom! Yo‘lni dasturlashimga yordam ber!', hello_math: 'Salom! Kerakli sonlarni top, darvoza ochiladi!', hello_english: 'Hello! Kerakli so‘zlarni topishimga yordam ber!',
      res_ok: 'Ajoyib ish!', res_web: 'Sen Stivni portalga olib bording va birinchi algoritmingni tuzding!', res_web_site: 'Sen birinchi saytingni yig‘ding: matn, ranglar, tugma va rasm!', res_math: 'Sen barcha boshqotirmalarni yechib, darvozani ochding!', res_english: 'Sen kerakli so‘zlarni topib, robotga yordam berding!', chip_done: 'Bosqich bajarildi', chip_web: 'Algoritm tuzildi', chip_web_site: 'Sayt yig‘ildi', chip_math: 'Masalalar yechildi', chip_english: 'So‘zlar topildi', chip_stars: '3 ta yulduz',
      res_title: 'Missiya bajarildi!', res_text: 'Sen mantiqiy topshiriqlarni juda oson bajarding — demak, bizning IT darslarimiz ham senga osonlik bilan beriladi! Dasturlashni o‘rganib, shunday o‘yinlarni o‘zing ham yarata olasan.', res_btn: 'Sarguzashtni davom ettirish →'
    }
  };

  /* ---------- задания: [kids 8–10, juniors 11–13, teens 14–17] × 3 раунда ---------- */
  const money = n => ({ ru: n + ' сум', uz: n + ' so‘m' });
  const km = n => ({ ru: n + ' км', uz: n + ' km' });
  const Q_MISS = { ru: 'Какое число пропущено?', uz: 'Qaysi son tushib qolgan?' };
  const Q_PICT = { ru: 'Выбери слово к картинке', uz: 'Rasmga mos so‘zni tanla' };
  const Q_PATH = { ru: 'Нажимай стрелки и расставь команды. Робот должен дойти до звезды!', uz: 'Strelkalarni bosib buyruqlarni joylashtir. Robot yulduzga yetib borishi kerak!' };
  const Q_PROG = { ru: 'Какая программа приведёт робота к звезде?', uz: 'Qaysi dastur robotni yulduzga olib boradi?' };
  const Q_OUT = { ru: 'Что выведет программа?', uz: 'Dastur nimani chiqaradi?' };
  const Q_REPLY = { ru: 'Тебе написали. Выбери подходящий ответ', uz: 'Senga yozishdi. Mos javobni tanla' };
  const Q_JIG_ADD = { ru: 'Сложи пазлы: сколько фруктов получится? Выбери нужный пазл.', uz: 'Pazllarni qo‘sh: nechta meva chiqadi? Kerakli pazlni tanla.' };
  const Q_JIG_SUB = { ru: 'Из большого пазла убрали фрукты. Сколько осталось? Выбери пазл.', uz: 'Katta pazldan mevalar olib tashlandi. Nechta qoldi? Pazlni tanla.' };
  const Q_MACHINE = { ru: 'Найди правило машины. Что выйдет в конце?', uz: 'Mashina qoidasini top. Oxirida nima chiqadi?' };
  const Q_MAGIC = { ru: 'В магическом квадрате суммы строк, столбцов и диагоналей равны. Найди число вместо ?', uz: 'Sehrli kvadratda qatorlar, ustunlar va diagonallar yig‘indisi teng. ? o‘rniga sonni top.' };
  const Q_SYS = { ru: 'Найди числа и ответь, чему равно последнее выражение.', uz: 'Sonlarni top va oxirgi ifoda nimaga tengligini ayt.' };
  const Q_SCALE = { ru: 'Подбери x, чтобы весы стали ровными.', uz: 'Tarozi tekis bo‘lishi uchun x ni tanla.' };
  const k = '<span class="k">', s = '<span class="s">', n = '<span class="n">', e = '</span>';

  const DATA = {
    math: [
      [
        { k: 'c', v: 'jig', fruit: 'lemon', x: 2, y: 3, op: '+', q: Q_JIG_ADD, o: [4, 5, 6], a: 1, h: { ru: 'Посчитай фрукты на обоих пазлах и сложи.', uz: 'Ikkala pazldagi mevalarni sanab, qo‘sh.' } },
        { k: 'c', v: 'line', from: 4, d: 3, min: 3, max: 9, q: { ru: 'Робот стоит на числе 4 и прыгает вперёд на 3 шага. Куда он приземлится? Нажми на число.', uz: 'Robot 4 sonida turibdi va 3 qadam oldinga sakraydi. U qayerga tushadi? Sonni bos.' }, o: [3, 4, 5, 6, 7, 8, 9], a: 4, h: { ru: 'Считай прыжки по числам: 5, 6, 7.', uz: '5, 6, 7 deb sakrashlarni sana.' } },
        { k: 'c', v: 'jig', fruit: 'apple', x: 8, y: 3, op: '−', q: Q_JIG_SUB, o: [4, 5, 6], a: 1, h: { ru: 'Сколько фруктов останется, если убрать маленький пазл?', uz: 'Kichik pazl olib tashlansa, nechta meva qoladi?' } }
      ],
      [
        { k: 't', op: '+', rows: [4, 6], cols: [3, 5, 7], scene: 'planet', q: { ru: 'Заполни таблицу: верный ответ открывает кусочек картинки.', uz: 'Jadvalni to‘ldir: to‘g‘ri javob rasmning bir bo‘lagini ochadi.' }, h: { ru: 'Сложи число из строки и число из столбца.', uz: 'Qatordagi va ustundagi sonlarni qo‘sh.' } },
        { k: 'c', q: { ru: 'Продолжи ряд', uz: 'Qatorni davom ettir' }, big: '3, 6, 12, 24, ?', o: ['30', '36', '48'], a: 2, h: { ru: 'Каждое число умножается на 2.', uz: 'Har bir son 2 ga ko‘paytiriladi.' } },
        { k: 'c', v: 'scale', L: { x: 2, c: 3 }, R: { x: 0, c: 11 }, q: Q_SCALE, o: [4, 5, 3], a: 0, h: { ru: 'Подставь x и сравни левую и правую чаши.', uz: 'x ni qo‘yib, chap va o‘ng pallalarni solishtir.' } }
      ],
      [
        { k: 't', op: '×', rows: [3, 4], cols: [2, 5, 6], scene: 'rocket', q: { ru: 'Таблица умножения: верный ответ открывает кусочек картинки.', uz: 'Ko‘paytirish jadvali: to‘g‘ri javob rasmning bir bo‘lagini ochadi.' }, h: { ru: 'Умножь число из строки на число из столбца.', uz: 'Qatordagi sonni ustundagi songa ko‘paytir.' } },
        { k: 'c', v: 'machine', pairs: [[2, 5], [3, 7], [6, 13]], inp: 10, q: Q_MACHINE, o: [20, 21, 22], a: 1, h: { ru: 'Машина делает два шага: сначала умножает на 2, потом прибавляет 1.', uz: 'Mashina ikki qadam qiladi: avval 2 ga ko‘paytiradi, keyin 1 qo‘shadi.' } },
        { k: 'c', v: 'tag', price: 150000, off: 20, q: { ru: 'Скидка 20% на товар за 150 000 сум. Сколько заплатим?', uz: '150 000 so‘mlik tovarga 20% chegirma. Qancha to‘laymiz?' }, o: [money('130 000'), money('120 000'), money('125 000')], a: 1, h: { ru: '10% от 150 000 — это 15 000. Значит, 20% — это 30 000. Вычти.', uz: '150 000 ning 10% i 15 000. Demak 20% i 30 000. Ayirib ol.' } }
      ]
    ],
    english: [
      [
        { k: 'c', q: Q_PICT, big: '🐱', bc: 'emoji', o: ['dog', 'cat', 'bird'], a: 1, h: { ru: 'Она мурлычет и любит молоко.', uz: 'U miyovlaydi va sutni yaxshi ko‘radi.' } },
        { k: 'c', q: Q_PICT, big: '🍎', bc: 'emoji', o: ['apple', 'banana', 'milk'], a: 0, h: { ru: 'Оно красное и растёт на дереве.', uz: 'U qizil va daraxtda o‘sadi.' } },
        { k: 'c', q: Q_PICT, big: '📖', bc: 'emoji', o: ['bag', 'book', 'ball'], a: 1, h: { ru: 'Это читают.', uz: 'Buni o‘qishadi.' } }
      ],
      [
        { k: 'b', q: { ru: 'Собери предложение: «Я люблю играть в игры»', uz: 'Gapni tuz: «Men o‘yin o‘ynashni yaxshi ko‘raman»' }, w: ['I', 'like', 'to', 'play', 'games'], p: [3, 0, 4, 1, 2], h: { ru: 'Начни со слова I.', uz: 'I so‘zidan boshla.' } },
        { k: 'b', q: { ru: 'Собери предложение: «Мы пишем код каждый день»', uz: 'Gapni tuz: «Biz har kuni kod yozamiz»' }, w: ['We', 'write', 'code', 'every', 'day'], p: [2, 4, 0, 3, 1], h: { ru: 'Кто? We. Что делает? write.', uz: 'Kim? We. Nima qiladi? write.' } },
        { k: 'b', q: { ru: 'Собери предложение: «Мой друг живёт в Ташкенте»', uz: 'Gapni tuz: «Do‘stim Toshkentda yashaydi»' }, w: ['My', 'friend', 'lives', 'in', 'Tashkent'], p: [4, 2, 0, 3, 1], h: { ru: 'Начни со слова My.', uz: 'My so‘zidan boshla.' } }
      ],
      [
        { k: 'c', q: Q_REPLY, big: '“Can you help me with my project?”', bc: 'say', o: ['Sure, no problem!', 'I am fine, thanks.', 'It is on the table.'], a: 0, h: { ru: 'Друг просит помощи. Согласись.', uz: 'Do‘sting yordam so‘ramoqda. Rozi bo‘l.' } },
        { k: 'c', q: Q_REPLY, big: '“How was your weekend?”', bc: 'say', o: ['Nine o’clock.', 'Yes, I do.', 'It was great, I built a game!'], a: 2, h: { ru: 'Тебя спрашивают, как прошли выходные.', uz: 'Dam olish kuni qanday o‘tgani so‘ralmoqda.' } },
        { k: 'c', q: Q_REPLY, big: '“Excuse me, where is the library?”', bc: 'say', o: ['I like reading.', 'Nice to meet you.', 'Go straight, then turn left.'], a: 2, h: { ru: 'Спрашивают дорогу. Объясни, как пройти.', uz: 'Yo‘l so‘ralmoqda. Qanday borishni tushuntir.' } }
      ]
    ],
    web: [
      [
        { k: 'p', q: Q_PATH, g: { w: 4, h: 3, robot: [0, 1], star: [3, 1], walls: [] }, sol: 'RRR', max: 5, h: { ru: 'Робот идёт по клеткам. Сосчитай шаги до звезды.', uz: 'Robot kataklar bo‘ylab yuradi. Yulduzgacha qadamlarni sana.' } },
        { k: 'p', q: Q_PATH, g: { w: 3, h: 3, robot: [0, 0], star: [2, 2], walls: [] }, sol: 'RRDD', max: 6, h: { ru: 'Два шага вправо и два вниз.', uz: 'Ikki qadam o‘ngga, ikki qadam pastga.' } },
        { k: 'p', q: Q_PATH, g: { w: 4, h: 2, robot: [0, 1], star: [3, 1], walls: [[1, 1]] }, sol: 'URRRD', max: 7, h: { ru: 'Через стену не пройти: обойди её сверху.', uz: 'Devordan o‘tib bo‘lmaydi: uni yuqoridan aylanib o‘t.' } }
      ],
      [
        { k: 'c', q: Q_PROG, g: { w: 4, h: 3, robot: [0, 0], star: [2, 1], walls: [] }, seq: true, o: ['RDD', 'RRD', 'RRR'], a: 1, h: { ru: 'Проходи команды по порядку и смотри, где окажется робот.', uz: 'Buyruqlarni tartib bilan bajar va robot qayerda qolishini kuzat.' } },
        { k: 'c', q: Q_PROG, g: { w: 4, h: 3, robot: [0, 2], star: [3, 0], walls: [] }, seq: true, o: ['RRRU', 'URRU', 'UURRR'], a: 2, h: { ru: 'Нужно подняться на два вверх и пройти три вправо.', uz: 'Ikki qadam yuqoriga, uch qadam o‘ngga borish kerak.' } },
        { k: 'c', q: Q_PROG, g: { w: 4, h: 2, robot: [0, 1], star: [3, 1], walls: [[1, 1]] }, seq: true, o: ['URRR', 'URRRD', 'RRRD'], a: 1, h: { ru: 'Стену обходят сверху, а потом спускаются к звезде.', uz: 'Devor yuqoridan aylanib o‘tiladi, keyin yulduzga tushiladi.' } }
      ],
      [
        { k: 'c', q: Q_OUT, bc: 'code', big: k + 'for' + e + ' i ' + k + 'in' + e + ' range(' + n + '3' + e + '):\n    print(' + s + '"Hi"' + e + ')', o: ['Hi Hi Hi', 'Hi', '3'], a: 0, h: { ru: 'Цикл повторяет print три раза.', uz: 'Sikl print ni uch marta takrorlaydi.' } },
        { k: 'c', q: Q_OUT, bc: 'code', big: 'x = ' + n + '5' + e + '\ny = x + ' + n + '2' + e + '\nprint(y)', o: ['52', '5', '7'], a: 2, h: { ru: 'Сначала посчитай y: x равен 5.', uz: 'Avval y ni hisobla: x 5 ga teng.' } },
        { k: 'c', q: Q_OUT, bc: 'code', big: 'name = ' + s + '"Junior"' + e + '\nprint(' + s + '"Hello, "' + e + ' + name)', o: ['Hello, name', 'Hello Junior', 'Hello, Junior'], a: 2, h: { ru: 'В name лежит слово Junior, а плюс склеивает строки.', uz: 'name da Junior so‘zi turibdi, plyus esa satrlarni ulaydi.' } }
      ]
    ]
  };
  window.JuniorIslandData = DATA; // для автотеста

  /* ---------- состояние ---------- */
  const done = {};
  let S = { key: null, r: 0, tries: 0, solved: false, view: 'stage', q: [], placed: [], run: 0, running: false, timers: [], busy: false, cell: 0, ct: 0, ta: false, cellBusy: false };
  const tierOf = () => ({ kids: 0, juniors: 1, teens: 2 })[root.dataset.lessonAge] ?? 1;
  const tasks = key => DATA[key][tierOf()];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const t = key => T[lang()][key];
  const wait = ms => new Promise(res => S.timers.push(setTimeout(res, ms)));
  const dirs = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
  function step(g, pos, c) {
    const nx = pos[0] + dirs[c][0], ny = pos[1] + dirs[c][1];
    if (nx < 0 || ny < 0 || nx >= g.w || ny >= g.h || g.walls.some(w => w[0] === nx && w[1] === ny)) return pos;
    return [nx, ny];
  }
  const sim = (g, seq) => [...seq].reduce((p, c) => step(g, p, c), g.robot);
  window.JuniorIslandSim = sim;


  /* ---------- математика: рисунки в SVG (пазлы, весы, ценник, картинки для таблицы) ---------- */
  const FRUIT = {
    lemon: '<g transform="rotate(-35)"><path d="M-13 0Q-14-3-11-4Q-6-11 0-11T11-4Q14-3 13 0Q14 3 11 4Q6 11 0 11T-11 4Q-14 3-13 0z" fill="#ffd93b" stroke="#e0a800" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="-2" cy="-5" rx="5" ry="2.2" fill="#fff" opacity=".6"/></g><path d="M5-9q6-6 11-3-3 6-11 3z" fill="#4fbf47" stroke="#2f9a3a" stroke-width="1"/>',
    apple: '<circle r="10.5" fill="#ff5a4e" stroke="#d93a30" stroke-width="1.6"/><path d="M0-9q0-5 3-6" stroke="#7a4a1d" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M1-10q6-5 10-2-4 5-10 2z" fill="#4fbf47"/><ellipse cx="-4" cy="-3" rx="3" ry="4.5" fill="#fff" opacity=".4"/>',
    berry: '<path d="M0 12C-13 5-12-8 0-7 12-8 13 5 0 12z" fill="#ff4d77" stroke="#d92f58" stroke-width="1.6"/><path d="M-6-8L0-13 6-8 0-6z" fill="#4fbf47"/><g fill="#ffe3a8"><circle cx="-4" cy="-1" r="1.2"/><circle cx="3" cy="-2" r="1.2"/><circle cx="0" cy="3" r="1.2"/><circle cx="-3" cy="6" r="1"/><circle cx="4" cy="4" r="1"/></g>'
  };
  const PIECE = 'M0 0H120V38a14 14 0 1 1 0 24V100H0V62a14 14 0 1 0 0-24Z';
  const PIECE_FILL = { a: '#fff1b8', b: '#ffd9e2', c: '#d7f0ff' };
  function fruitsIn(n, fruit) {
    let h = '';
    const rows = Math.ceil(n / 3), ys = rows === 1 ? [50] : rows === 2 ? [36, 66] : [24, 50, 76];
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / 3), inRow = Math.min(3, n - r * 3), c = i % 3;
      h += `<g transform="translate(${60 + (c - (inRow - 1) / 2) * 31} ${ys[r]}) scale(1.12)">${FRUIT[fruit]}</g>`;
    }
    return h;
  }
  const pieceG = (n, fruit, tone) => `<path d="${PIECE}" fill="${PIECE_FILL[tone]}" stroke="#2f8cff" stroke-width="3" stroke-linejoin="round"/>${fruitsIn(n, fruit)}`;
  function jigHeader(task) {
    return `<div class="ig-big scene"><svg class="ig-jig" viewBox="0 0 530 112" role="img" aria-label="${task.x} ${task.op} ${task.y} = ?">
      <g transform="translate(6 6)">${pieceG(task.x, task.fruit, 'a')}</g>
      <text x="164" y="70" text-anchor="middle" font-size="46" fill="#2f8cff">${task.op}</text>
      <g transform="translate(190 6)">${pieceG(task.y, task.fruit, 'b')}</g>
      <text x="352" y="70" text-anchor="middle" font-size="46" fill="#2f8cff">=</text>
      <g transform="translate(384 6)" id="ig-slot"><path d="${PIECE}" fill="#f0f4ff" stroke="#9aa8d8" stroke-width="3" stroke-dasharray="7 6"/><text x="60" y="64" text-anchor="middle" font-size="42" fill="#9aa8d8">?</text></g>
    </svg></div>`;
  }
  const jigOption = (n, fruit) => `<svg viewBox="-2 -2 140 104" aria-hidden="true">${pieceG(n, fruit, 'c')}</svg>`;

  /* числовая прямая */
  function lineHTML(task) {
    const ticks = task.o.map((v, i) => `<button type="button" class="ig-opt tick${v === task.from ? ' start' : ''}" data-act="opt" data-i="${i}">${v}</button>`).join('');
    return `<div class="ig-nlwrap" id="ig-nlw"><span class="ig-rb" id="ig-rb" aria-hidden="true">🤖</span><svg class="ig-hops" id="ig-hops" aria-hidden="true"></svg><div class="ig-opts nl">${ticks}</div></div>`;
  }
  const tickCenter = (i) => {
    const w = document.getElementById('ig-nlw'), tk = w && w.querySelectorAll('.tick')[i];
    if (!tk) return 0;
    const a = w.getBoundingClientRect(), b = tk.getBoundingClientRect();
    return b.left - a.left + b.width / 2;
  };
  function placeRobot(task) {
    const rb = document.getElementById('ig-rb'); if (!rb) return;
    rb.style.left = tickCenter(task.o.indexOf(task.from)) + 'px';
  }
  function hopRobot(task) {
    const rb = document.getElementById('ig-rb'), svg = document.getElementById('ig-hops'); if (!rb || !svg) return;
    const dir = task.d > 0 ? 1 : -1, steps = Math.abs(task.d), s0 = task.o.indexOf(task.from);
    let paths = '';
    for (let i = 0; i < steps; i++) {
      const x1 = tickCenter(s0 + dir * i), x2 = tickCenter(s0 + dir * (i + 1));
      paths += `<path d="M${x1} 52Q${(x1 + x2) / 2} 0 ${x2} 52" pathLength="1" style="animation-delay:${i * 0.42}s"/>`;
      S.timers.push(setTimeout(() => { rb.style.left = x2 + 'px'; rb.classList.remove('hop'); void rb.offsetWidth; rb.classList.add('hop'); sfx('step'); }, i * 420 + 40));
    }
    svg.innerHTML = paths;
  }

  /* весы */
  const SC = { cx: 230, cy: 52, arm: 140 };
  function panItems(side, val) {
    const items = [];
    for (let i = 0; i < side.x; i++) items.push({ w: 26, svg: `<rect x="-13" y="-26" width="26" height="26" rx="7" fill="#7a5cff" stroke="#5b3fe0" stroke-width="2"/><text class="xb" x="0" y="-8" text-anchor="middle" font-size="17" fill="#fff">${val == null ? 'x' : val}</text>` });
    if (side.c) { const r = side.c > 9 ? 18 : 15; items.push({ w: r * 2, svg: `<circle cx="0" cy="${-r}" r="${r}" fill="#ffb02e" stroke="#e08a00" stroke-width="2"/><text x="0" y="${-r + 6}" text-anchor="middle" font-size="${side.c > 9 ? 16 : 17}" fill="#fff">${side.c}</text>` }); }
    const total = items.reduce((a, b) => a + b.w + 4, -4);
    let x = -total / 2, h = '';
    items.forEach(it => { h += `<g transform="translate(${x + it.w / 2} 80)">${it.svg}</g>`; x += it.w + 4; });
    return h;
  }
  const panG = (id, side, val) => `<g id="${id}" class="sc-pan"><path d="M0 0L-58 80M0 0L58 80" stroke="#9aa8d8" stroke-width="3"/><g class="pi">${panItems(side, val)}</g><path d="M-64 80H64q0 22-30 24H-34q-30-2-30-24z" fill="#ffd36b" stroke="#e8a900" stroke-width="3" stroke-linejoin="round"/><text class="tot" x="0" y="136" text-anchor="middle" font-size="22" fill="#2f8cff"></text></g>`;
  function scaleHTML(task) {
    return `<div class="ig-big scene"><svg class="ig-scale" id="ig-scale" viewBox="0 0 460 250" role="img" aria-label="${task.L.x}x + ${task.L.c} = ${task.R.x ? task.R.x + 'x + ' : ''}${task.R.c}">
      <path d="M230 52L196 232H264z" fill="#d7e3ff" stroke="#9aa8d8" stroke-width="3" stroke-linejoin="round"/><rect x="170" y="228" width="120" height="14" rx="7" fill="#9aa8d8"/>
      <g id="sc-beam" class="sc-beam"><rect x="-148" y="-6" width="296" height="12" rx="6" fill="#2f8cff"/></g>
      <g id="sc-l" class="sc-p">${panG('sc-lp', task.L, null)}</g><g id="sc-r" class="sc-p">${panG('sc-rp', task.R, null)}</g>
      <circle cx="230" cy="52" r="11" fill="#ffc41a" stroke="#e08a00" stroke-width="3"/></svg></div>`;
  }
  function setScale(task, val) {
    const svg = document.getElementById('ig-scale'); if (!svg) return;
    const Lv = val == null ? null : task.L.x * val + task.L.c, Rv = val == null ? null : task.R.x * val + task.R.c;
    const deg = val == null ? 0 : Math.max(-15, Math.min(15, -(Lv - Rv) * 2.2)), rad = deg * Math.PI / 180;
    const beam = svg.querySelector('#sc-beam'), l = svg.querySelector('#sc-l'), r = svg.querySelector('#sc-r');
    beam.style.transform = `translate(${SC.cx}px,${SC.cy}px) rotate(${deg}deg)`;
    l.style.transform = `translate(${SC.cx - SC.arm * Math.cos(rad)}px,${SC.cy - SC.arm * Math.sin(rad)}px)`;
    r.style.transform = `translate(${SC.cx + SC.arm * Math.cos(rad)}px,${SC.cy + SC.arm * Math.sin(rad)}px)`;
    [['sc-lp', task.L], ['sc-rp', task.R]].forEach(([id, side], i) => {
      const g = svg.querySelector('#' + id); g.querySelector('.pi').innerHTML = panItems(side, val);
      g.querySelector('.tot').textContent = val == null ? '' : String(i ? Rv : Lv);
    });
    svg.classList.toggle('level', val != null && Lv === Rv);
  }

  /* ценник */
  function tagHTML(task) {
    const nf = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `<div class="ig-big scene"><svg class="ig-tag" viewBox="0 0 330 130" role="img" aria-label="${nf(task.price)} −${task.off}%">
      <path d="M12 18H230L316 65 230 112H12z" fill="#fff4cf" stroke="#ffb02e" stroke-width="4" stroke-linejoin="round"/><circle cx="288" cy="65" r="7" fill="#fff" stroke="#ffb02e" stroke-width="3"/>
      <text x="150" y="76" text-anchor="middle" font-size="32" fill="#c25e00" text-decoration="line-through">${nf(task.price)}</text>
      <g transform="translate(40 30)"><path d="M0-30L8-17 23-22 21-7 36 0 21 7 23 22 8 17 0 30-8 17-23 22-21 7-36 0-21-7-23-22-8-17z" fill="#ff4d4d" stroke="#d92f2f" stroke-width="2.5" stroke-linejoin="round"/><text x="0" y="7" text-anchor="middle" font-size="17" fill="#fff">−${task.off}%</text></g></svg></div>`;
  }

  /* таблица + картинка */
  const SCENES = {
    planet: `<defs><linearGradient id="gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9d4ff"/><stop offset="1" stop-color="#f0c9ff"/></linearGradient><radialGradient id="gpl" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffd36b"/><stop offset="1" stop-color="#ff7a3d"/></radialGradient></defs>
      <rect width="300" height="200" fill="url(#gp)"/>
      <g fill="#fff" opacity=".9"><circle cx="30" cy="30" r="2.5"/><circle cx="85" cy="18" r="2"/><circle cx="265" cy="150" r="2.5"/><circle cx="215" cy="180" r="2"/><circle cx="20" cy="150" r="2"/><circle cx="170" cy="22" r="2"/></g>
      <ellipse cx="125" cy="112" rx="88" ry="20" transform="rotate(-18 125 112)" fill="none" stroke="#ffe48a" stroke-width="9" opacity=".95"/>
      <circle cx="125" cy="112" r="52" fill="url(#gpl)"/><g fill="#ff9a3d" opacity=".7"><circle cx="105" cy="98" r="9"/><circle cx="142" cy="126" r="12"/><circle cx="148" cy="90" r="6"/></g>
      <path d="M40 135Q125 160 212 100" fill="none" stroke="#ffe48a" stroke-width="9" opacity=".95" stroke-linecap="round"/>
      <g transform="translate(232 54)"><path d="M-14 22L-30 62H30L14 22z" fill="#ffe86b" opacity=".45"/><ellipse cy="14" rx="34" ry="11" fill="#b8b2f0" stroke="#7a6af0" stroke-width="3"/><path d="M-18 10a18 18 0 0 1 36 0z" fill="#bff1ff" stroke="#7a6af0" stroke-width="3"/><g fill="#ffd93b"><circle cx="-18" cy="16" r="3"/><circle cx="0" cy="19" r="3"/><circle cx="18" cy="16" r="3"/></g></g>`,
    rocket: `<defs><linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d9ff"/><stop offset="1" stop-color="#ffe3f0"/></linearGradient></defs>
      <rect width="300" height="200" fill="url(#gp)"/>
      <g fill="#fff"><circle cx="30" cy="28" r="2.5"/><circle cx="110" cy="16" r="2"/><circle cx="260" cy="120" r="2.5"/><circle cx="60" cy="110" r="2"/><circle cx="190" cy="30" r="2"/></g>
      <circle cx="235" cy="52" r="32" fill="#fff3b8"/><g fill="#f3dc82"><circle cx="224" cy="44" r="6"/><circle cx="246" cy="62" r="8"/><circle cx="244" cy="38" r="4"/></g>
      <circle cx="45" cy="185" r="62" fill="#5ac8a0"/><path d="M5 170q30-24 60-8 22 10 30 30H0z" fill="#3fae86"/><path d="M-6 160q20-14 34 0" fill="none" stroke="#fff" stroke-width="5" opacity=".6" stroke-linecap="round"/>
      <g transform="translate(150 100) rotate(32)"><path d="M0 52Q-9 70 0 92Q9 70 0 52z" fill="#ffb02e"/><path d="M0 52Q-4 66 0 78Q4 66 0 52z" fill="#ffe86b"/><path d="M-18 24L-34 54-14 46zM18 24L34 54 14 46z" fill="#ff5a4e" stroke="#d93a30" stroke-width="2.5" stroke-linejoin="round"/><path d="M0-62C22-40 22 6 14 52H-14C-22 6-22-40 0-62z" fill="#fff" stroke="#b8c4e8" stroke-width="3"/><path d="M0-62C10-52 15-42 17-30H-17C-15-42-10-52 0-62z" fill="#ff5a4e"/><circle cx="0" cy="-6" r="12" fill="#bff1ff" stroke="#7a6af0" stroke-width="4"/></g>`
  };
  const cellVal = (task, r, c) => (task.op === '×' ? task.rows[r] * task.cols[c] : task.rows[r] + task.cols[c]);
  function cellOpts(task, i) {
    const r = Math.floor(i / task.cols.length), c = i % task.cols.length, v = cellVal(task, r, c), d = task.op === '×' ? 2 : 1;
    const base = [v, v + d, v - d], rot = i % 3;
    return base.map((_, j) => base[(j + rot) % 3]);
  }
  function tableHTML(task) {
    const nc = task.cols.length, total = task.rows.length * nc;
    let g = `<i class="tc hd op">${task.op}</i>` + task.cols.map(v => `<i class="tc hd">${v}</i>`).join('');
    task.rows.forEach((rv, r) => { g += `<i class="tc hd">${rv}</i>`; for (let c = 0; c < nc; c++) g += `<i class="tc cell" data-i="${r * nc + c}">?</i>`; });
    let covers = '';
    for (let i = 0; i < total; i++) { const x = (i % nc) * (300 / nc), y = Math.floor(i / nc) * (200 / task.rows.length); covers += `<g class="cv" data-i="${i}"><rect x="${x + 2}" y="${y + 2}" width="${300 / nc - 4}" height="${200 / task.rows.length - 4}" rx="10" fill="#7a5cff" stroke="#fff" stroke-width="3"/><text x="${x + 150 / nc}" y="${y + 100 / task.rows.length + 12}" text-anchor="middle" font-size="34" fill="#fff">?</text></g>`; }
    return `<p class="ig-q">${L(task.q)}</p><div class="ig-tab"><div class="ig-tbl" style="--cols:${nc + 1}">${g}</div><svg class="ig-pic" viewBox="0 0 300 200" aria-hidden="true">${SCENES[task.scene]}${covers}</svg></div><div class="ig-cellq" id="ig-cellq"></div><div class="ig-opts short" id="ig-topts"></div>`;
  }
  function drawTable(task) {
    const nc = task.cols.length, total = task.rows.length * nc, cur = S.cell;
    play.querySelectorAll('.ig-tbl .cell').forEach(el => {
      const i = Number(el.dataset.i);
      el.className = 'tc cell' + (i < cur ? ' done' : i === cur ? ' cur' : '');
      el.textContent = i < cur ? String(cellVal(task, Math.floor(i / nc), i % nc)) : '?';
    });
    play.querySelectorAll('.ig-pic .cv').forEach(el => el.classList.toggle('off', Number(el.dataset.i) < cur));
    const q = document.getElementById('ig-cellq'), o = document.getElementById('ig-topts');
    if (cur >= total) { q.textContent = ''; o.innerHTML = ''; return; }
    const r = Math.floor(cur / nc), c = cur % nc;
    q.textContent = `${task.rows[r]} ${task.op} ${task.cols[c]} = ?`;
    o.innerHTML = cellOpts(task, cur).map(v => `<button type="button" class="ig-opt" data-act="topt" data-v="${v}">${v}</button>`).join('');
  }
  function onCell(v) {
    const task = tasks(S.key)[S.r]; if (S.solved || S.cellBusy) return;
    const nc = task.cols.length, total = task.rows.length * nc, r = Math.floor(S.cell / nc), c = S.cell % nc, right = cellVal(task, r, c);
    const btns = [...play.querySelectorAll('#ig-topts .ig-opt')], b = btns.find(x => Number(x.dataset.v) === v);
    const advance = () => {
      S.cell++; S.ct = 0; S.cellBusy = false; drawTable(task); sfx('pop');
      if (S.cell >= total) { sfx('star'); solved(S.ta); }
    };
    if (v === right) { b.classList.add('ok'); S.cellBusy = true; setTimeout(advance, 380); return; }
    b.classList.add('bad'); sfx('boing'); setTimeout(() => b && b.classList.remove('bad'), 450);
    S.ct++;
    if (S.ct === 1) { say(t('hint') + L(task.h), 'hint'); return; }
    say(t('wrong2'), 'hint'); S.ta = true; S.cellBusy = true;
    btns.forEach(x => (x.disabled = true));
    const ok = btns.find(x => Number(x.dataset.v) === right); ok && ok.classList.add('ok', 'assist');
    setTimeout(advance, 800);
  }

  /* ---------- слайд-сцена ---------- */
  function texts() {
    document.querySelectorAll('#slide-5 [data-ig]').forEach(el => { el.textContent = t(el.dataset.ig); });
    stage.querySelectorAll('.ig-island').forEach(b => b.setAttribute('aria-label', t('n_' + b.dataset.island) + '. ' + t('t_' + b.dataset.island)));
  }
  function updateStage() {
    const cnt = Object.keys(done).length;
    stage.querySelectorAll('.ig-island').forEach(b => b.classList.toggle('is-done', !!done[b.dataset.island]));
    document.getElementById('ig-star-count').textContent = String(cnt * 3);
    document.getElementById('ig-stars-pill').classList.toggle('on', cnt > 0);
    const next = document.getElementById('ig-next');
    if (next) next.disabled = cnt === 0;
    const hint = document.getElementById('ig-next-hint');
    if (hint) hint.classList.toggle('off', cnt > 0);
  }
  function resetView() {
    S.timers.forEach(clearTimeout); S.timers = []; S.run++; S.running = false;
    if (S.eq) { try { S.eq.destroy(); } catch (e) {} S.eq = null; }
    if (S.sb) { try { S.sb.destroy(); } catch (e) {} S.sb = null; }
    play.hidden = true; play.innerHTML = ''; stage.hidden = false; S.view = 'stage';
    if (studio && !studio.hidden) { studio.hidden = true; try { window.stopAlgoRun && window.stopAlgoRun(); } catch (e) {} }
    stage.classList.remove('is-leaving'); stage.querySelectorAll('.is-picked').forEach(b => b.classList.remove('is-picked'));
    updateStage();
  }

  function openIsland(key, btn) {
    if (S.busy) return;
    S.busy = true; sfx('whoosh');
    btn.classList.add('is-picked'); stage.classList.add('is-leaving');
    const go = () => { S.busy = false; startGame(key); };
    setTimeout(() => {
      const fx = window.JuniorFx;
      if (fx && fx.canRun(5, 6)) fx.run(5, 6, go, 'fly'); else go();
    }, 260);
  }
  function exitGame() {
    if (S.busy) return;
    S.busy = true; sfx('whoosh');
    const apply = () => { S.busy = false; resetView(); };
    const fx = window.JuniorFx;
    if (fx && fx.canRun(6, 5)) fx.run(6, 5, apply, 'fly'); else apply();
  }

  /* ---------- игра ---------- */
  window.JUNIOR_ALGO_STEP_MS = 480;
  const ASK = {
    ru: {
      k1: '',
      k2: 'Спроси: как сделать несколько одинаковых шагов одним блоком?',
      k3: 'Спроси: где Стиву нужен «Прыжок»?',
      kerr: 'Спроси: на какой клетке Стив ошибся? Какой блок поменяем?',
      kwin: 'Спроси: какой блок помог Стиву больше всего?',
      html: 'Спроси ребят: как назовём наш сайт?',
      css: 'Спроси: какого цвета будет кнопка?',
      js: 'Спроси: что должно случиться, когда нажмём на кнопку?',
      all: 'Спроси: кого из героев прокачаем первым?',
      n_html: 'Дальше: одежда CSS →', n_css: 'Дальше: мозг JS →', n_js: 'Весь сайт целиком →'
    },
    uz: {
      k1: '',
      k2: 'So‘ra: bir xil qadamlarni bitta blok bilan qanday qilamiz?',
      k3: 'So‘ra: Stiv qayerda «Sakrash» qilishi kerak?',
      kerr: 'So‘ra: Stiv qaysi katakda adashdi? Qaysi blokni almashtiramiz?',
      kwin: 'So‘ra: Stivga qaysi blok eng ko‘p yordam berdi?',
      html: 'Bolalardan so‘ra: saytimizni qanday nomlaymiz?',
      css: 'So‘ra: tugma qaysi rangda bo‘lsin?',
      js: 'So‘ra: tugmani bosganda nima bo‘lishi kerak?',
      all: 'So‘ra: qaysi qahramonni birinchi kuchaytiramiz?',
      n_html: 'Keyingi: CSS kiyimi →', n_css: 'Keyingi: JS miyasi →', n_js: 'Butun sayt →'
    }
  };
  const NEXT_MODE = { html: 'css', css: 'js', js: 'all' };
  let algoFlag = null;
  function webStep() {
    const a = document.querySelector('#practice-teens-block .layer-pill-btn.active');
    return a ? a.id.replace('pill-mode-', '') : 'all';
  }
  function ensureNextBtn() {
    let b = document.getElementById('ig-wnext');
    if (b || !studio) return b;
    const pills = studio.querySelector('#practice-teens-block .layer-switcher-pills');
    if (!pills) return null;
    b = document.createElement('button'); b.type = 'button'; b.id = 'ig-wnext'; b.className = 'ig-wnext';
    b.addEventListener('click', () => { const n = NEXT_MODE[webStep()]; if (n && window.setWebLayerMode) { window.setWebLayerMode(n); sfx('whoosh'); } });
    pills.appendChild(b);
    return b;
  }
  function updateAsk() {
    if (!studio || studio.hidden) return;
    const A = ASK[lang()], kids = !document.getElementById('practice-kids-block').classList.contains('hidden');
    let key;
    if (kids) {
      const lv = (document.querySelector('.quest-lvl-btn.active') || { id: 'btn-lvl-1' }).id.slice(-1);
      if (document.getElementById('maze-success-panel')) key = 'kwin';
      else if (algoFlag === 'error' && document.querySelector('#algo-commands-list .chip-error')) key = 'kerr';
      else key = 'k' + lv;
    } else key = webStep();
    const el = document.getElementById('ig-ask-text');
    const askBox = document.getElementById('ig-ask'); if (askBox) askBox.hidden = !A[key];
    if (el && A[key] && el.textContent !== A[key]) { el.textContent = A[key]; const box = document.getElementById('ig-ask'); box.classList.remove('pop'); void box.offsetWidth; box.classList.add('pop'); }
    const step = kids ? 'maze' : webStep();
    if (studio.dataset.wstep !== step) studio.dataset.wstep = step;
    const nb = ensureNextBtn();
    if (nb) { nb.hidden = !NEXT_MODE[step]; if (NEXT_MODE[step]) nb.textContent = A['n_' + step]; }
  }
  let askRaf = 0;
  const queueAsk = () => { if (askRaf) return; askRaf = requestAnimationFrame(() => { askRaf = 0; updateAsk(); }); };
  if (studio) {
    new MutationObserver(queueAsk).observe(studio, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    const won = new Set();
    function drawAch() {
      const n = won.size, el = document.getElementById('mz-ach-count'), fill = document.getElementById('mz-ach-fill'), ch = document.querySelectorAll('#mz-ach .mz-ach-chests img');
      if (el) el.textContent = n + ' / 3'; if (fill) fill.style.width = (n / 3 * 100) + '%';
      ch.forEach((im, i) => { const open = i < n; const src = open ? 'images/maze/chest.svg' : 'images/maze/lock.svg'; if (im.getAttribute('src') !== src) im.setAttribute('src', src); im.classList.toggle('open', open); });
    }
    document.addEventListener('junior:algostate', ev => { algoFlag = ev.detail && ev.detail.kind; if (algoFlag === 'win' && ev.detail.level) { won.add(ev.detail.level); drawAch(); } queueAsk(); });
  }
  function startStudio() {
    S = Object.assign(S, { key: 'web', view: 'studio', running: false });
    stage.hidden = true; play.hidden = true; studio.hidden = false; stage.classList.remove('is-leaving');
    stage.querySelectorAll('.is-picked').forEach(b => b.classList.remove('is-picked'));
    done.web = true; updateStage();
    const age = root.dataset.lessonAge || 'teens';
    algoFlag = null;
    if (typeof window.setWebLayerMode === 'function') window.setWebLayerMode('html');
    if (typeof window.setPracticeGame === 'function') window.setPracticeGame(age === 'kids' ? 'kids' : 'teens');
    updateAsk();
    studio.scrollTop = 0;
  }
  function startGame(key) {
    S.site = false;
    if (key === 'web' && studio) { if ((root.dataset.lessonAge || 'teens') !== 'kids') { loadBuilder(startBuilder); return; } startStudio(); return; }
    S = Object.assign(S, { key, r: 0, tries: 0, solved: false, q: [], placed: [], view: 'round', running: false });
    S.timers.forEach(clearTimeout); S.timers = []; S.run++;
    if (S.eq) { try { S.eq.destroy(); } catch (e) {} S.eq = null; }
    play.dataset.island = key; play.style.setProperty('--isl', `url(images/ui/island-${key}.webp)`);
    stage.hidden = true; play.hidden = false; stage.classList.remove('is-leaving');
    stage.querySelectorAll('.is-picked').forEach(b => b.classList.remove('is-picked'));
    if (key === 'english') { loadEnglish(startEnglish); return; }
    renderRound(true);
  }
  /* английская игра подгружается только когда выбран остров (быстрее старт сайта) */
  let eqLoading = null;
  function loadEnglish(cb) {
    if (window.JuniorEnglishQuest) { cb(); return; }
    play.innerHTML = '<div class="ig-eq ig-eq-wait"></div>';
    if (!eqLoading) eqLoading = new Promise((res, rej) => {
      const V = '?v=20261122-m1', l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'english-quest.css' + V; document.head.appendChild(l);
      const sc = document.createElement('script'); sc.src = 'english-quest.js' + V; sc.onload = res; sc.onerror = () => { eqLoading = null; rej(); }; document.head.appendChild(sc);
    });
    const run = S.run; eqLoading.then(() => { if (S.run === run && S.key === 'english' && !play.hidden) cb(); }, () => { if (S.run === run) exitGame(); });
  }
  /* «Конструктор сайта» (11–17 лет) подгружается при выборе острова «Программирование» */
  let sbLoading = null;
  function loadBuilder(cb) {
    if (window.JuniorSiteBuilder) { cb(); return; }
    if (!sbLoading) sbLoading = new Promise((res, rej) => {
      const V = '?v=20261123-m3', l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'site-builder.css' + V; document.head.appendChild(l);
      const sc = document.createElement('script'); sc.src = 'site-builder.js' + V; sc.onload = res; sc.onerror = () => { sbLoading = null; rej(); }; document.head.appendChild(sc);
    });
    const run = S.run; sbLoading.then(() => { if (S.run === run) cb(); }, () => { if (S.run === run) resetView(); });
  }
  function startBuilder() {
    S = Object.assign(S, { key: 'web', view: 'sb', running: false }); S.run++;
    stage.hidden = true; play.hidden = true; if (studio) studio.hidden = true; stage.classList.remove('is-leaving');
    stage.querySelectorAll('.is-picked').forEach(b => b.classList.remove('is-picked'));
    if (S.sb) { try { S.sb.destroy(); } catch (e) {} }
    S.sb = window.JuniorSiteBuilder.mount({
      lang: () => lang(),
      onExit: () => { if (S.sb) { S.sb.destroy(); S.sb = null; } resetView(); },
      onComplete: () => { S.site = true; if (S.sb) { S.sb.destroy(); S.sb = null; } play.hidden = false; play.dataset.island = 'web'; play.style.setProperty('--isl', 'url(images/ui/island-web.webp)'); finish(); }
    });
  }
  function startEnglish() {
    S.view = 'eq';
    play.innerHTML = `<div class="ig-bar"><button type="button" class="ig-back" data-act="back">${t('back')}</button><span class="ig-name">${t('n_english')}</span></div><div class="ig-eq" id="ig-eq"></div>`;
    const age = ({ kids: 9, juniors: 12, teens: 15 })[root.dataset.lessonAge] || 12;
    S.eq = window.JuniorEnglishQuest.mount(document.getElementById('ig-eq'), {
      lang: () => lang(), age: () => age,
      onComplete: () => { if (S.eq) { S.eq.destroy(); S.eq = null; } finish(); },
      onExit: () => exitGame()
    });
  }
  function dots() {
    return [0, 1, 2].map(i => `<span class="ig-dot ${i < S.r || (i === S.r && S.solved) ? 'ok' : i === S.r ? 'cur' : ''}">${i < S.r || (i === S.r && S.solved) ? STAR : i + 1}</span>`).join('');
  }
  function robotImg() { return '<img src="images/robot_mentor.webp" alt="" width="450" height="334" decoding="async">'; }
  function renderRound(first) {
    S.view = 'round'; S.tries = first || !S.keep ? 0 : S.tries; S.solved = false; S.q = []; S.placed = []; S.running = false; S.keep = false; S.run++;
    const task = tasks(S.key)[S.r];
    play.innerHTML = `<div class="ig-bar"><button type="button" class="ig-back" data-act="back">${t('back')}</button><span class="ig-name">${t('n_' + S.key)}</span><div class="ig-dots" id="ig-dots">${dots()}</div></div>
      <div class="ig-arena"><div class="ig-robot" id="ig-robot">${robotImg()}</div>
      <div class="ig-main"><div class="ig-say" id="ig-say"></div><div class="ig-task" id="ig-task"></div><div class="ig-actions" id="ig-actions"></div></div></div>`;
    say(S.r === 0 ? t('hello_' + S.key) : pick(T[lang()].cheer) + ' ' + t('round') + ' ' + (S.r + 1) + '/3', '');
    const body = document.getElementById('ig-task');
    S.cell = 0; S.ct = 0; S.ta = false; S.cellBusy = false;
    if (task.k === 'c') { body.innerHTML = choiceHTML(task); if (task.v === 'scale') setScale(task, null); if (task.v === 'line') requestAnimationFrame(() => placeRobot(task)); }
    else if (task.k === 't') { body.innerHTML = tableHTML(task); drawTable(task); }
    else if (task.k === 'b') { body.innerHTML = `<p class="ig-q">${L(task.q)}</p><div class="ig-slots" id="ig-slots"></div><div class="ig-bank" id="ig-bank"></div>`; renderBuild(task); }
    else { body.innerHTML = `<p class="ig-q">${L(task.q)}</p><div class="ig-pathwrap"><div class="ig-grid" id="ig-grid" style="--w:${task.g.w}"></div><div class="ig-cmds"><div class="ig-queue" id="ig-queue"></div><div class="ig-pad">${['U', 'D', 'L', 'R'].map(c => `<button type="button" data-act="cmd" data-c="${c}" aria-label="${c}">${ARROW[c]}</button>`).join('')}</div><div class="ig-runrow"><button type="button" class="ig-clear" data-act="clear">${t('clear')}</button><button type="button" class="ig-run" data-act="run">${t('run')}</button></div></div></div>`; drawGrid(task.g, task.g.robot); drawQueue(task); }
  }
  function say(text, tone) {
    const el = document.getElementById('ig-say'); if (!el) return;
    el.textContent = text; el.className = 'ig-say' + (tone ? ' ' + tone : '');
    const r = document.getElementById('ig-robot');
    if (r && tone) { r.classList.remove('cheer', 'nope'); void r.offsetWidth; r.classList.add(tone === 'good' ? 'cheer' : 'nope'); }
  }
  function gridInner(g, pos) {
    let h = '';
    for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
      const wall = g.walls.some(w => w[0] === x && w[1] === y), rb = pos[0] === x && pos[1] === y, st = g.star[0] === x && g.star[1] === y;
      h += `<i class="c${wall ? ' wall' : ''}" data-x="${x}" data-y="${y}">${wall ? '🧱' : rb && st ? '🎉' : rb ? '🤖' : st ? '⭐' : ''}</i>`;
    }
    return h;
  }
  function drawGrid(g, pos) { const el = document.getElementById('ig-grid'); if (el) el.innerHTML = gridInner(g, pos); }
  function machineHTML(task) {
    const gear = '<svg viewBox="0 0 64 64" class="ig-gear" aria-hidden="true"><rect x="6" y="12" width="52" height="40" rx="12" fill="#e8f0ff" stroke="#2f8cff" stroke-width="3.5"/><circle cx="24" cy="32" r="8" fill="#ffc41a" stroke="#e08a00" stroke-width="3"/><circle cx="42" cy="32" r="5" fill="#ff7a00" stroke="#d65f00" stroke-width="3"/><path d="M32 4v8M18 4v8M46 4v8" stroke="#2f8cff" stroke-width="3.5" stroke-linecap="round"/></svg>';
    const row = (a, b, last) => `<div class="ig-mrow${last ? ' last' : ''}"><b>${a}</b><i aria-hidden="true">→</i>${gear}<i aria-hidden="true">→</i><b class="ig-mout" id="${last ? 'ig-mq' : ''}">${b}</b></div>`;
    return `<div class="ig-big mach">${task.pairs.map(p => row(p[0], p[1], false)).join('')}${row(task.inp, '?', true)}</div>`;
  }
  function groupsHTML(task) {
    if (task.plates) return `<div class="ig-big grp">${Array.from({ length: task.plates }, () => `<div class="ig-plate">${task.e.repeat(task.per).match(/./gu).map(x => `<span>${x}</span>`).join('')}</div>`).join('')}</div>`;
    return `<div class="ig-big grp">${task.parts.map((p, i) => (i ? '<b class="ig-plus">+</b>' : '') + `<div class="ig-heap">${Array.from({ length: p.n }, () => `<span>${p.e}</span>`).join('')}</div>`).join('')}</div>`;
  }
  function magicHTML(task) {
    return `<div class="ig-big magic"><div class="ig-mg">${task.grid.map(r => r.map(v => v == null ? '<span class="q" id="ig-mq">?</span>' : `<span>${v}</span>`).join('')).join('')}</div></div>`;
  }
  function sysHTML(task) {
    const chip = t => t.replace(/\b([AB])\b/g, '<i class="c$1">$1</i>');
    return `<div class="ig-big eqn">${task.sys.map(x => `<div>${chip(x)}</div>`).join('')}<div class="ask">${chip(task.ask)} = ?</div></div>`;
  }
  function choiceHTML(task) {
    if (task.v === 'line') return `<p class="ig-q">${L(task.q)}</p>` + lineHTML(task);
    const labels = task.o.map(o => (task.seq ? [...o].map(c => ARROW[c]).join(' ') : task.v === 'jig' ? jigOption(o, task.fruit) : task.v === 'scale' ? 'x = ' + o : L(o)));
    const long = task.v ? false : labels.some(l => String(l).length > 16);
    let h = `<p class="ig-q">${L(task.q)}</p>`;
    if (task.v === 'jig') h += jigHeader(task);
    if (task.v === 'scale') h += scaleHTML(task);
    if (task.v === 'tag') h += tagHTML(task);
    if (task.v === 'machine') h += machineHTML(task);
    if (task.v === 'groups') h += groupsHTML(task);
    if (task.v === 'magic') h += magicHTML(task);
    if (task.v === 'sys') h += sysHTML(task);
    if (task.g) h += `<div class="ig-pathwrap ro"><div class="ig-grid" style="--w:${task.g.w};margin-bottom:14px">${gridInner(task.g, task.g.robot)}</div></div>`;
    if (task.big) h += `<div class="ig-big ${task.bc || ''}">${L(task.big)}</div>`;
    h += `<div class="ig-opts ${long ? 'long' : 'short'}${task.v === 'jig' ? ' pc' : ''}">${labels.map((l, i) => `<button type="button" class="ig-opt${task.v === 'jig' ? ' pc' : ''}" data-act="opt" data-i="${i}"${task.v === 'jig' ? ` aria-label="${task.o[i]}"` : ''}>${l}</button>`).join('')}</div>`;
    return h;
  }
  /* собери предложение */
  function renderBuild(task) {
    const slots = document.getElementById('ig-slots'), bank = document.getElementById('ig-bank');
    slots.innerHTML = S.placed.map((id, i) => `<button type="button" class="ig-chip" data-act="unplace" data-p="${i}">${task.w[id]}</button>`).join('');
    bank.innerHTML = task.p.map(id => `<button type="button" class="ig-chip ${S.placed.includes(id) ? 'used' : ''}" data-act="place" data-w="${id}">${task.w[id]}</button>`).join('');
  }
  function drawQueue(task) {
    const q = document.getElementById('ig-queue'); if (!q) return;
    q.innerHTML = S.q.map((c, i) => `<span class="ig-chip" data-i="${i}">${ARROW[c]}</span>`).join('');
    const run = play.querySelector('.ig-run'); if (run) run.disabled = !S.q.length || S.running;
  }

  /* результат раунда */
  function solved(assisted) {
    S.solved = true;
    say(assisted ? t('assisted') : pick(T[lang()].cheer), 'good'); sfx('star');
    document.getElementById('ig-dots').innerHTML = dots();
    const last = S.r === 2;
    document.getElementById('ig-actions').innerHTML = `<button type="button" class="ig-go" data-act="go">${last ? t('finish') : t('next')}</button>`;
  }
  function miss(task) {
    S.tries++;
    sfx('boing');
    if (S.tries === 1) { say(t('hint') + L(task.h), 'hint'); return false; }
    say(t('wrong2'), 'hint'); return true; // true => робот решает вместе
  }
  function onOpt(i) {
    if (S.solved) return;
    const task = tasks(S.key)[S.r], btns = play.querySelectorAll('.ig-opt');
    if (task.v === 'scale') setScale(task, task.o[i]);
    if (i === task.a) { btns[i].classList.add('ok'); btns.forEach(b => (b.disabled = true)); reveal(task, i); solved(S.tries > 1); return; }
    btns[i].classList.add('bad'); setTimeout(() => btns[i] && btns[i].classList.remove('bad'), 450);
    if (task.v === 'scale') setTimeout(() => { if (!S.solved) setScale(task, null); }, 1300);
    if (miss(task)) { btns.forEach(b => (b.disabled = true)); btns[task.a].classList.add('ok', 'assist'); setTimeout(() => reveal(task, task.a), 250); setTimeout(() => solved(true), 700); }
  }
  function reveal(task, i) {
    if (task.v === 'jig') { const slot = document.getElementById('ig-slot'); if (slot) { slot.innerHTML = pieceG(task.o[i], task.fruit, 'c'); slot.classList.add('snap'); } }
    else if (task.v === 'scale') setScale(task, task.o[i]);
    else if (task.v === 'line') hopRobot(task);
    else if (task.v === 'machine' || task.v === 'magic') { const q = document.getElementById('ig-mq'); if (q) { q.textContent = task.o[i]; q.classList.add('done'); } }
  }
  function checkBuild() {
    const task = tasks(S.key)[S.r], slots = document.getElementById('ig-slots');
    if (S.placed.join() === task.w.map((_, i) => i).join()) { slots.classList.add('ok'); play.querySelectorAll('#ig-bank .ig-chip').forEach(b => (b.disabled = true)); solved(S.tries > 1); return; }
    slots.classList.add('bad');
    const assist = miss(task);
    setTimeout(() => {
      slots.classList.remove('bad');
      if (assist) { S.placed = task.w.map((_, i) => i); renderBuild(task); slots.classList.add('ok'); setTimeout(() => solved(true), 500); }
      else { S.placed = []; renderBuild(task); }
    }, 520);
  }
  async function runPath(assisted) {
    const task = tasks(S.key)[S.r], g = task.g, id = ++S.run;
    S.running = true; drawQueue(task);
    let pos = [...g.robot]; drawGrid(g, pos);
    const chips = [...play.querySelectorAll('#ig-queue .ig-chip')];
    for (let i = 0; i < S.q.length; i++) {
      chips.forEach((c, j) => c.classList.toggle('run', j === i));
      await wait(420); if (id !== S.run) return;
      const np = step(g, pos, S.q[i]);
      if (np === pos) { const cell = play.querySelector(`#ig-grid .c[data-x="${pos[0]}"][data-y="${pos[1]}"]`); cell && cell.classList.add('bump'); sfx('unselect'); }
      else sfx('step');
      pos = np; drawGrid(g, pos);
    }
    await wait(350); if (id !== S.run) return;
    chips.forEach(c => c.classList.remove('run')); S.running = false;
    if (pos[0] === g.star[0] && pos[1] === g.star[1]) { drawQueue(task); solved(assisted || S.tries > 1); return; }
    const helpNow = miss(task);
    say(t('path_miss') + (S.tries === 1 ? t('hint') + L(task.h) : t('wrong2')), 'hint');
    await wait(700); if (id !== S.run) return;
    drawGrid(g, g.robot);
    if (helpNow) { S.q = [...task.sol]; drawQueue(task); await wait(500); if (id !== S.run) return; runPath(true); }
    else drawQueue(task);
  }

  function finish() {
    done[S.key] = true; updateStage(); S.view = 'result'; S.run++;
    const colors = ['#ff7a00', '#ffc41a', '#2f8cff', '#7a5cff', '#1fc99a', '#ff5c8a'];
    const isle = S.key;
    const chips = [
      ['<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#34c759"/><path d="M8 16.5l5.5 5.5L24 11" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>', t('chip_done')],
      ['<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#7a5cff"/><path d="M12 11l-5 5 5 5M20 11l5 5-5 5M17.5 9l-3 14" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>', t(S.site && isle === 'web' ? 'chip_web_site' : 'chip_' + isle)],
      [STAR, t('chip_stars'), ' ig-chip-star']
    ].map(c => `<span class="ig-chip${c[2] || ''}"><i>${c[0]}</i><b>${c[1]}</b></span>`).join('');
    const hero = '';
    play.innerHTML = `<div class="ig-bar"><button type="button" class="ig-back" data-act="back">${t('back')}</button><span class="ig-name">${t('n_' + S.key)}</span></div>
      <div class="ig-result ig-card ig-win${hero ? ' ig-win-hero-on' : ''}">
        <img class="ig-deco ig-deco-island" src="images/maze/win-island.webp" alt="" decoding="async"><img class="ig-deco ig-deco-grass" src="images/maze/win-grass.webp" alt="" decoding="async"><img class="ig-deco ig-deco-chest" src="images/maze/win-chest.webp" alt="" decoding="async">
        ${hero}<div class="ig-win-hero"><img class="ig-win-laurel" src="images/maze/win-laurel.webp" alt="" width="620" height="253" decoding="async"></div>
        <div class="ig-ribbon"><img src="images/maze/win-ribbon.webp" alt="" width="760" height="162" decoding="async"><h3>${t('res_title')}</h3><span class="ig-pill">${t('res_ok')}</span></div>
        <p class="ig-res-line">${t(S.site && isle === 'web' ? 'res_web_site' : 'res_' + isle)}</p><p class="ig-res-sub">${t('res_text')}</p>
        <div class="ig-chips">${chips}</div>
        <button type="button" class="ig-go" data-act="back">${t('res_btn')}</button></div>`;
    sfx('fanfare');
    const resBox = play.querySelector('.ig-result');
    if (resBox && window.fireMazeCannons) setTimeout(() => window.fireMazeCannons(resBox, true), 250);
  }

  /* ---------- события ---------- */
  if (studio) studio.addEventListener('click', ev => {
    const el = ev.target.closest('[data-sact]'); if (!el) return;
    if (el.dataset.sact === 'back') exitGame();
    else if (el.dataset.sact === 'done') { sfx('click'); studio.hidden = true; play.hidden = false; S.key = 'web'; play.dataset.island = 'web'; finish(); }
  });
  stage.addEventListener('click', ev => {
    const b = ev.target.closest('.ig-island'); if (b) openIsland(b.dataset.island, b);
  });
  play.addEventListener('click', ev => {
    const el = ev.target.closest('[data-act]'); if (!el) return;
    const act = el.dataset.act, task = S.view === 'round' ? tasks(S.key)[S.r] : null;
    if (act === 'back') exitGame();
    else if (act === 'opt') onOpt(Number(el.dataset.i));
    else if (act === 'topt') onCell(Number(el.dataset.v));
    else if (act === 'go') { sfx('click'); S.r === 2 ? finish() : (S.r++, S.tries = 0, renderRound(true)); }
    else if (act === 'place' && task && !S.solved) { const id = Number(el.dataset.w); if (S.placed.includes(id)) return; S.placed.push(id); sfx('pop'); renderBuild(task); if (S.placed.length === task.w.length) checkBuild(); }
    else if (act === 'unplace' && task && !S.solved) { S.placed.splice(Number(el.dataset.p), 1); sfx('click'); renderBuild(task); }
    else if (act === 'cmd' && task && !S.solved && !S.running) { if (S.q.length < task.max) { S.q.push(el.dataset.c); sfx('click'); drawQueue(task); } }
    else if (act === 'clear' && task && !S.solved && !S.running) { S.q = []; drawQueue(task); }
    else if (act === 'run' && task && !S.solved && !S.running && S.q.length) runPath(false);
  });

  new MutationObserver(() => { if (root.dataset.currentSlide !== '5') { S.busy = false; resetView(); } }).observe(root, { attributes: true, attributeFilter: ['data-current-slide'] });
  new MutationObserver(() => {
    texts();
    if (S.view === 'eq' && S.eq && !play.hidden) { S.eq.setLang(); const nm = play.querySelector('.ig-name'); if (nm) nm.textContent = t('n_english'); const bk = play.querySelector('.ig-back'); if (bk) bk.textContent = t('back'); }
    else if (S.view === 'sb' && S.sb) S.sb.setLang();
    else if (S.view === 'round' && !play.hidden) { S.keep = true; renderRound(false); }
    else if (S.view === 'result' && !play.hidden) finish();
    else if (S.view === 'studio' && studio && !studio.hidden) { texts(); updateAsk(); }
  }).observe(root, { attributes: true, attributeFilter: ['lang'] });
  document.addEventListener('junior:programchange', updateStage);
  texts(); updateStage();
})();
