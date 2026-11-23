/* Step 5: course program.
   Content comes from the "Junior Dasturlash" deck and the "Matematika 1–11" brief for the onboarding team.
   The block follows the program chosen on step 0 (data-lesson-program) and the RU/UZ switch.
   No account API is called. */
(() => {
  'use strict';
  const root = document.getElementById('course-program');
  if (!root) return;

  const lang = () => (document.documentElement.lang === 'uz' ? 'uz' : 'ru');
  const x = (o) => (o == null ? '' : typeof o === 'string' ? o : (o[lang()] ?? o.ru));
  const chosen = () => { const l = (document.documentElement.dataset.lessonPrograms || document.documentElement.dataset.lessonProgram || 'web').split(' ').filter(Boolean); return l.length ? l : ['web']; };
  let viewProg = null;
  const program = () => { const l = chosen(); if (!viewProg || !l.includes(viewProg)) viewProg = l[0]; return viewProg; };
  /* English reuses the texts already on the site (translations.js), so nothing new is invented for it. */
  const tr = (k) => { const d = window.JuniorI18n && window.JuniorI18n.translations && window.JuniorI18n.translations[lang()]; return (d && d[k]) || ''; };
  let tab = 'lesson';
  const firstTab = () => (program() === 'english' ? 'route' : 'lesson');
  let dir = 0;
  let grade = 5;

  /* ---------- Shared interface text ---------- */
  const UI = {
    tabs: {
      lesson: { ru: 'Как проходит урок', uz: "Dars qanday o'tadi" },
      support: { ru: 'Помощь и контроль', uz: 'Yordam va nazorat' },
      result: { ru: 'Цифры и результат', uz: 'Raqamlar va natija' }
    },
    lessonsShort: { ru: 'ур.', uz: 'dars' },
    pickDir: { ru: 'Нажми на направление, чтобы увидеть, что ребёнок будет делать.', uz: "Ko'rish uchun yo'nalishni bosing." },
    topics: { ru: 'Темы', uz: 'Mavzular' },
    result: { ru: 'Результат', uz: 'Natija' },
    pickGrade: { ru: 'Выбери класс:', uz: 'Sinfni tanlang:' },
    gradeWord: { ru: 'класс', uz: '-sinf' },
    algebra: { ru: 'Алгебра', uz: 'Algebra' },
    geometry: { ru: 'Геометрия', uz: 'Geometriya' },
    next: { ru: 'К финалу', uz: 'Finalga' }
  };

  /* ---------- Web programming: "Junior Dasturlash" ---------- */
  const WEB = {
    title: { ru: 'Junior Dasturlash: от первого сайта до веб-приложения', uz: "Junior Dasturlash: birinchi saytdan veb-ilovagacha" },
    desc: { ru: '11–14 лет · с нуля · 9 направлений · 110+ уроков', uz: "11–14 yosh · noldan · 9 yo'nalish · 110+ dars" },
    art: 'images/course_web.webp',
    dirs: [
      { n: 'HTML', k: 9, s: { ru: 'Скелет сайта', uz: 'Saytning skeleti' },
        t: { ru: 'Структура документа · заголовки и текст · списки · ссылки · картинки · формы · структура настоящего сайта · итоговый проект', uz: "HTML-hujjat tuzilishi · sarlavha va matn · ro'yxatlar · havolalar · rasmlar · formalar · haqiqiy sayt tuzilishi · yakuniy loyiha" },
        r: { ru: 'Пишет страницу своего сайта с нуля: заголовок, текст, картинка, ссылка, список и анкета. Умеет делить сайт на части: шапка, меню, основная часть и подвал.', uz: "O'z saytining sahifasini noldan yozadi: sarlavha, matn, rasm, havola, ro'yxat va anketa. Saytni qismlarga bo'lishni biladi: sarlavha qismi, menyu, asosiy qism va pastki qism." } },
      { n: 'CSS', k: 17, s: { ru: 'Одежда и дизайн', uz: 'Kiyim va dizayn' },
        t: { ru: 'Цвета и фон · текст и блоки (Box Model) · расположение (Flexbox) · hover и анимации · адаптивность под телефон', uz: "Ranglar va fon · matn va bloklar (Box Model) · joylashuv (Flexbox) · hover va animatsiyalar · telefon uchun moslashuvchan sayt" },
        r: { ru: 'Делает сайт красивым: цвета, карточки, кнопки, анимации. Сайт правильно выглядит и на телефоне.', uz: "Saytni chiroyli qiladi: ranglar, kartochkalar, tugmalar, animatsiya. Sayt telefonda ham to'g'ri ko'rinadi." } },
      { n: { ru: 'Искусственный интеллект', uz: "Sun'iy intellekt" }, k: 8, s: { ru: 'Сайт вместе с ИИ', uz: 'AI bilan sayt' },
        t: { ru: 'Формула промпта из 7 вопросов: что? зачем? для кого? что внутри? как выглядит? как работает? правила? · проверка и улучшение результата · итоговый проект', uz: "Prompt formulasi: 7 savol (nima? nega? kim uchun? ichida nima? ko'rinishi? qanday ishlaydi? qoidalar?) · natijani tekshirib yaxshilash · yakuniy loyiha" },
        r: { ru: 'Пишет ИИ чёткое задание, проверяет готовый сайт и улучшает его. ИИ работает не вместо ребёнка, а вместе с ним. В уроках есть симулятор: ребёнок пишет промпт и сразу видит, каким получится сайт.', uz: "AI'ga aniq topshiriq yozadi, tayyor saytni tekshirib yaxshilaydi. AI bola o'rniga emas, bola bilan birga ishlaydi. Darslarda simulyator bor: bola promptni yozadi va sayt qanday chiqishini darhol ko'radi." } },
      { n: 'Bootstrap', k: 10, s: { ru: 'Готовые компоненты', uz: 'Tayyor komponentlar' },
        t: { ru: 'Цвета и кнопки · картинки · Flex, Container, Grid · Card, Carousel, Dropdown, Modal · формы', uz: "Ranglar va tugmalar · rasmlar · Flex, Container va Grid · Card, Carousel, Dropdown, Modal · formalar" },
        r: { ru: 'Быстро собирает сайт из готовых блоков: карточки, слайдер, меню, окно. Раскладывает страницу по сетке, и она правильно выглядит на телефоне.', uz: "Saytni tayyor bloklardan tez yig'adi: kartochkalar, slayder, menyu, oyna. Sahifani to'rga bo'lib joylaydi va u telefonda ham to'g'ri ko'rinadi." } },
      { n: 'Tilda', k: 14, s: { ru: 'Сайт без кода', uz: 'Kodsiz sayt' },
        t: { ru: 'Регистрация и блоки · текст, кнопка, картинка, cover · header, hero, content, footer · card, popup, anchor, формы · Zero block, шаблоны, публикация', uz: "Ro'yxatdan o'tish va bloklar · matn, tugma, rasm, cover · header, hero, content, footer · card, popup, anchor, formalar · Zero block, shablonlar, saytni chiqarish" },
        r: { ru: 'Собирает многостраничный сайт и публикует его в интернете. Tilda — платформа, на которой настоящие компании делают сайты.', uz: "Tilda'da bir necha sahifali tayyor sayt yig'adi va uni internetga chiqaradi. Tilda — haqiqiy bizneslar sayt yasaydigan platforma." } },
      { n: 'Blockly', k: null, s: { ru: 'Логика из блоков', uz: 'Bloklar bilan mantiq' },
        t: null,
        r: { ru: 'Учится логике программирования с помощью блоков.', uz: "Bloklar yordamida dasturlash mantiqini o'rganadi." } },
      { n: 'JavaScript', k: 25, s: { ru: '«Мозг» сайта', uz: "Saytning «miyasi»" },
        t: { ru: 'Переменные и типы · условия и функции · массивы, циклы, объекты · DOM, клики, формы · поиск, фильтры, таймеры · итоговый проект', uz: "O'zgaruvchilar va turlar · shartlar va funksiyalar · massivlar, sikllar, obyektlar · DOM, kliklar, formalar · qidirish, filtrlash, taymerlar · yakuniy loyiha" },
        r: { ru: 'Добавляет сайту логику: кнопки работают, форма проверяется, получаются игры, викторины, списки с фильтром и страницы с таймером.', uz: "Saytga mantiq qo'shadi: tugmalar ishlaydi, forma tekshiriladi, o'yinlar yasaladi. Viktorinalar, filtrli ro'yxatlar va taymerli sahifalar yaratadi." } },
      { n: 'Git va GitHub', k: null, s: { ru: 'Хранение и обмен кодом', uz: 'Kodni saqlash va ulashish' },
        t: null,
        r: { ru: 'Хранит свой код на GitHub и может им поделиться.', uz: "Kodini GitHub'da saqlaydi va ulashadi." } },
      { n: 'React', k: 27, s: { ru: 'Вершина курса: веб-приложения', uz: "Kursning cho'qqisi: veb-ilovalar" },
        t: { ru: 'JSX, компоненты, props · CSS в React · useState, списки, формы, поиск · React Router и несколько языков · useEffect, API, Axios · итоговый проект', uz: "JSX, komponentlar, props · React'da CSS · useState, ro'yxatlar, formalar, qidirish · React Router, ko'p tillilik · useEffect, API, Axios · yakuniy loyiha" },
        r: { ru: 'Создаёт полноценное веб-приложение: несколько страниц, несколько языков, данные с сервера. Его можно показать как портфолио.', uz: "React'da to'liq veb-ilova yaratadi: bir necha sahifa, bir necha til, serverdan ma'lumot. Uni portfolio sifatida ko'rsata oladi." } }
    ],
    routeNote: { ru: 'Каждое направление опирается на предыдущее: сначала устройство и дизайн сайта, потом готовые инструменты, затем логика на JavaScript и в конце React. Число уроков Blockly и Git в презентации не указано и в 110+ не входит.', uz: "Har bir yo'nalish oldingisiga tayanadi: avval saytning tuzilishi va dizayni, keyin tayyor vositalar, so'ng JavaScript mantiq va oxirida React. Blockly va Git darslari soni taqdimotda ko'rsatilmagan va 110+ ga kirmaydi." },
    steps: [
      [{ ru: 'Интересное начало', uz: 'Qiziqarli boshlanish' }, { ru: 'История и короткая цель: что делаем сегодня.', uz: 'Hikoya va qisqa maqsad: bugun nima qilamiz.' }],
      [{ ru: 'Объяснение', uz: 'Tushuntirish' }, { ru: 'Kodi объясняет голосом, на экране всё показывается само.', uz: "Kodi ovoz bilan gapiradi, ekranda hammasi o'zi ko'rsatiladi." }],
      [{ ru: 'Делает сам', uz: "O'zi qiladi" }, { ru: 'Ребёнок пишет код и сразу видит результат в браузере.', uz: "Bola kod yozadi, natijani darhol brauzerda ko'radi." }],
      [{ ru: 'Повторение', uz: 'Takrorlash' }, { ru: 'То же самое в новой ситуации.', uz: 'Xuddi shu narsani yangi vaziyatda takrorlaydi.' }],
      [{ ru: 'Итоговая проверка', uz: 'Yakuniy tekshiruv' }, { ru: 'Всё из урока в одном задании.', uz: "Darsdagi hamma narsa bitta topshiriqda." }]
    ],
    lessonFacts: [
      { ru: 'В каждом уроке не менее 17 экранов. Правило: один экран — одно действие, поэтому ребёнок всегда знает, что делать дальше.', uz: "Har darsda kamida 17 ta ekran. Qoida: bir ekran — bitta harakat, shuning uchun bola nima qilishni doim biladi." },
      { ru: 'После урока: практика, 5 тестов и задание в компиляторе. В практике код пишется с нуля.', uz: "Darsdan keyin: amaliyot, 5 ta test va kompilyator topshirig'i. Amaliyotda bola kodni noldan o'zi yozadi." }
    ],
    help: [
      [{ ru: 'Помощь в 3 шага', uz: '3 bosqichli yordam' }, { ru: 'Если трудно: куда смотреть, что это значит, пример.', uz: "Qiynalsa: qayerga qarash, nimani anglatadi, namuna." }],
      [{ ru: 'Ошибки не страшны', uz: "Xatodan qo'rqmaydi" }, { ru: 'Объясняют причину ошибки и как исправить. Штрафов нет.', uz: "Xatoning sababi va qanday tuzatish aytiladi. Jarima yo'q." }],
      [{ ru: 'Настоящий код', uz: 'Haqiqiy kod' }, { ru: 'Ребёнок сам пишет код и сразу видит результат.', uz: "Bola kodni o'zi yozadi va natijani darhol ko'radi." }],
      [{ ru: 'Озвучка на узбекском', uz: "O'zbek tilida, ovozli" }, { ru: 'Робот Kodi проговаривает каждый шаг. Есть русский и английский.', uz: "Robot Kodi har bir qadamni gapirib tushuntiradi. Rus va ingliz tillari ham bor." }],
      [{ ru: 'Учится в своём темпе', uz: "O'z sur'atida o'rganadi" }, { ru: 'Уроки понятны и без преподавателя. Подходят телефон, планшет или компьютер.', uz: "Darslar o'qituvchisiz ham tushunarli. Telefon, planshet yoki kompyuterda o'tish mumkin." }],
      [{ ru: 'Результат в каждом уроке', uz: 'Har darsda natija' }, { ru: 'Ребёнок уходит с уроком с собственной страницей.', uz: "Bola darsdan o'zi yaratgan sahifa bilan chiqadi." }]
    ],
    nums: [
      ['9', { ru: 'направлений от HTML до React', uz: "yo'nalish: HTML'dan React'gacha" }],
      ['110+', { ru: 'уроков, без Blockly и Git', uz: "dars, Blockly va Git'siz" }],
      ['5', { ru: 'итоговых проектов: HTML, CSS, ИИ, JavaScript, React', uz: 'yakuniy loyiha: HTML, CSS, AI, JavaScript, React' }],
      ['155', { ru: 'тестов к урокам HTML, CSS и ИИ', uz: "test: HTML, CSS va AI darslariga" }]
    ],
    numNote: { ru: 'Плюс 25 практик после уроков HTML и CSS и задание в компиляторе к каждому уроку.', uz: "HTML va CSS darslaridan keyin 25 ta amaliyot, har darsga kompilyator topshirig'i." },
    results: [
      { ru: 'Пишет свой сайт с нуля и делает его красивым и удобным на телефоне.', uz: "O'z saytini noldan yozadi va uni chiroyli, telefonga mos qiladi." },
      { ru: 'Быстро собирает сайт с ИИ, Bootstrap и Tilda.', uz: "AI, Bootstrap va Tilda bilan saytni tez yig'adi." },
      { ru: 'Оживляет сайт на JavaScript: кнопки, формы, игры.', uz: "JavaScript bilan saytni jonlantiradi: tugmalar, formalar, o'yinlar." },
      { ru: 'Создаёт веб-приложение на React и хранит код на GitHub.', uz: "React'da veb-ilova yaratadi va kodini GitHub'da saqlaydi." }
    ],
    portfolio: { ru: 'К концу курса у ребёнка есть портфолио: HTML/CSS-сайт, сайт с ИИ, проект на JavaScript и приложение на React.', uz: "Kurs oxirida bolada portfolio bo'ladi: HTML/CSS sayti, AI bilan qilingan sayt, JavaScript loyihasi va React ilovasi." },
    skillsTitle: { ru: 'Жизненные навыки', uz: "Hayotiy ko'nikmalar" },
    skills: [
      { ru: 'Логика и точность', uz: 'Mantiqiy fikrlash va aniqlik' },
      { ru: 'Поиск и исправление ошибок', uz: 'Xatoni topish va tuzatish' },
      { ru: 'Чувство дизайна: цвет, шрифт, расположение', uz: 'Dizayn didi: rang, shrift, joylashuv' },
      { ru: 'Умение ясно выразить мысль', uz: 'Fikrni aniq ifodalash' },
      { ru: 'Большая задача по маленьким шагам', uz: 'Katta ishni kichik qadamlarga bo‘lish' },
      { ru: 'Довести проект до конца', uz: 'Loyihani oxirigacha yetkazish' }
    ],
    rec: { ru: 'Рекомендуем 11–14 лет, тем, кто хочет начать программирование с нуля.', uz: "Tavsiya: 11–14 yosh, dasturlashni noldan boshlamoqchi bo'lgan bolalar uchun." }
  };

  /* ---------- Mathematics 1–11 ---------- */
  const T = (ru, uz) => ({ ru, uz });
  const GRADE_TOPICS = {
    1: T('Числа и действия с ними, десятки и единицы, прямые и кривые линии, отрезок, четырёхугольник и квадрат, меры длины. В 1 классе ребёнок учится писать цифры по правилам школьного письма.', "Sonlar va ular bilan amallar, o'nlik va birlik, to'g'ri va egri chiziqlar, kesma, to'rtburchak va kvadrat, uzunlik o'lchovlari. 1-sinfda raqamlarni maktab yozuvi qoidasi bo'yicha yozishni o'rganadi."),
    3: T('Тысячи и многозначные числа: чтение, запись, сравнение. Сложение и вычитание столбиком, умножение и деление на 10, 100, 1000, свойства умножения, решение задачи с таблицей.', "Minglar va ko'p xonali sonlar, ularni o'qish, yozish va taqqoslash, ustun ko'rinishida qo'shish va ayirish, 10, 100, 1000 ga ko'paytirish va bo'lish, ko'paytirish xossalari, masalani jadval bilan yechish."),
    4: T('Умножение и деление многозначных чисел, признаки делимости, деление с остатком, миллион, округление, работа над типичными ошибками.', "Ko'p xonali sonlarni ko'paytirish va bo'lish, bo'linish alomatlari, qoldiqli bo'lish, million, yaxlitlash, tipik xatolar ustida ishlash."),
    5: T('Большие числа, порядок действий, обыкновенные и десятичные дроби, смешанные числа, умножение дробей, площадь и объём, отношение и норма, проценты, среднее значение, углы, треугольник и четырёхугольники.', "Katta sonlar, amallar tartibi, oddiy va o'nli kasrlar, aralash sonlar, kasrlarni ko'paytirish, yuz va hajm, nisbat va me'yor, foizlar, o'rtacha qiymat, burchaklar, uchburchak va to'rtburchaklar."),
    6: T('Алгебраические выражения и уравнения, деление дробей, отношения, проценты, окружность и круг (площадь и периметр), задачи на скорость и движение, объём и поверхность, диаграммы, развёртки пространственных тел.', "Algebraik ifodalar va tenglamalar, kasrlarni bo'lish, nisbat, foizlar, aylana va doira (yuzi va perimetri), tezlik va harakat masalalari, hajm va sirt, diagrammalar, fazoviy jismlar yoyilmasi."),
    7: T('Делимость, степени и корни, округление, введение в алгебру, линейные уравнения, задачи через уравнение, многоугольники, последовательности, координаты и линейная функция, площадь и объём, работа с данными.', "Bo'linuvchanlik, daraja va ildizlar, yaxlitlash, algebraga kirish, chiziqli tenglamalar, tenglama tuzib masala yechish, ko'pburchaklar, ketma-ketliklar, koordinatalar va chiziqli funksiya, yuz va hajm, ma'lumotlar bilan ishlash."),
    8: { a: T('Алгебраические дроби, обратная пропорциональность, арифметический корень, степень с рациональным показателем, неравенства, модуль, квадратные уравнения и задачи на них, средние, комбинаторика.', "Algebraik kasrlar, teskari proporsional funksiya, arifmetik ildiz, ratsional ko'rsatkichli daraja, sonli va bir noma'lumli tengsizliklar, modul, kvadrat tenglama va u bilan masala yechish, o'rtachalar, kombinatorika."),
         g: T('Многоугольники, параллелограмм, трапеция, теорема Фалеса и средняя линия, теорема Пифагора, тригонометрические тождества, метод координат, векторы, площадь, окружность и углы в ней.', "Ko'pburchaklar, parallelogramm, trapetsiya, Fales teoremasi va o'rta chiziq, Pifagor teoremasi, trigonometrik ayniyatlar, koordinatalar usuli, vektorlar, yuz, aylana va undagi burchaklar.") },
    9: { a: T('Квадратичная функция и её график, квадратные неравенства и метод интервалов, свойства функций, системы уравнений и неравенств, радианы, тригонометрические функции и формулы, арифметическая и геометрическая прогрессии, вероятность, случайные величины.', "Kvadrat funksiya va grafigi, kvadrat tengsizlik va intervallar usuli, funksiya xossalari, tenglamalar va tengsizliklar sistemasi, radian, trigonometrik funksiyalar va formulalar, arifmetik va geometrik progressiya, ehtimollik, tasodifiy miqdorlar."),
         g: T('Подобие треугольников, геометрические преобразования и гомотетия, теоремы синусов и косинусов, скалярное произведение, вписанные и описанные многоугольники, длина окружности и площадь круга, пропорциональные отрезки.', "Uchburchaklar o'xshashligi, geometrik almashtirishlar va gomotetiya, sinuslar va kosinuslar teoremasi, skalyar ko'paytma, ichki va tashqi chizilgan ko'pburchaklar, aylana uzunligi va doira yuzi, proporsional kesmalar.") },
    10: { a: T('Функция и область определения, сложные, обратные и периодические функции, преобразования графиков, рациональные и иррациональные уравнения, показательная функция, логарифм, тригонометрические уравнения и неравенства, вероятность.', "Funksiya va aniqlanish sohasi, murakkab, teskari va davriy funksiyalar, grafik almashtirishlar, ratsional va irratsional tenglamalar, ko'rsatkichli funksiya, logarifm, trigonometrik tenglama va tengsizliklar, ehtimollik."),
          g: T('Основы стереометрии, многогранники и сечения, прямые в пространстве, параллельность и перпендикулярность, расстояния, ортогональная проекция, углы в пространстве.', "Stereometriya asoslari, ko'pyoqlar va kesimlar, fazoda to'g'ri chiziqlar, parallellik va perpendikulyarlik, masofa, ortogonal proyeksiya, fazodagi burchaklar.") },
    11: { a: T('Предел, производная и её применение, первообразная и интеграл, определённый интеграл и его применение, комбинаторика и бином Ньютона, анализ статистических данных, вероятность, биномиальное и нормальное распределения.', "Limit, hosila va uning tatbiqlari, boshlang'ich funksiya va integral, aniq integral va uning tatbiqlari, kombinatorika va Nyuton binomi, statistik ma'lumotlar tahlili, ehtimollik, binomial va normal taqsimot."),
          g: T('Координаты и векторы в пространстве, призма, цилиндр, пирамида, конус, шар и сфера, поверхность и объём, повторение стереометрии, подготовка к экзамену.', "Fazoda koordinatalar va vektorlar, prizma, silindr, piramida, konus, shar va sfera, sirt va hajm, stereometriyani takrorlash, imtihonga tayyorgarlik.") }
  };
  GRADE_TOPICS[2] = GRADE_TOPICS[1];
  const MATH = {
    title: { ru: 'Математика 1–11 классы: отдельный курс на каждый класс', uz: "Matematika 1–11-sinf: har sinf uchun alohida kurs" },
    desc: { ru: 'Новый учебный план 2026–2027 · 1640 уроков · русский, узбекский и английский', uz: "Yangi o'quv reja 2026–2027 · 1640 dars · o'zbek, rus va ingliz tillari" },
    art: 'images/platform/math-course.svg',
    bands: [
      { n: 'KIDS', g: '1–4', k: [1, 4], c: 'green', l: T('120 уроков в каждом классе', "Har sinfda 120 ta dars") },
      { n: 'JUNIOR', g: '5–7', k: [5, 7], c: 'blue', l: T('120 уроков в каждом классе', "Har sinfda 120 ta dars") },
      { n: 'SENIOR', g: '8–11', k: [8, 11], c: 'purple', l: T('200 уроков: 120 алгебры и 80 геометрии', "200 ta dars: 120 algebra va 80 geometriya") }
    ],
    basis: { ru: 'Уроки подготовлены на основе утверждённых рабочих часов и учебного плана и согласованы со школьной программой.', uz: "Darslar tasdiqlangan ish soati va o'quv dars rejasi asosida tayyorlangan, maktab dasturi bilan hamohang." },
    steps: [
      [T('Вопрос', 'Savoldan boshlanadi'), T('Жизненный вопрос или спор двух детей. В конце урока на него отвечают новым знанием, и видно, кто прав и в чём ошибся второй.', "Darsning boshida hayotiy savol yoki ikki bolaning bahsi beriladi. Oxirida shu savolga yangi bilim bilan javob qaytariladi.")],
      [T('План', 'Reja'), T('Ребёнок сразу видит, что узнает сегодня.', "Bola bugun nimani bilib olishini darsning boshida ko'radi.")],
      [T('Объяснение показом', "Ko'rsatib tushuntirish"), T('Правило не даётся готовым. Чертёж, модель и пример рисуются на глазах, диктор комментирует. От простого к сложному.', "Qoida tayyor holda berilmaydi. Chizma, model va misol ekranda ko'z oldida chiziladi, diktor ovozi izohlab boradi.")],
      [T('Сам делает', "Darrov o'zi bajaradi"), T('Сразу после объяснения на том же экране ребёнок применяет способ сам.', "Tushuntirishdan keyin shu ekranning o'zida bola ko'rsatilgan usulni o'zi qo'llaydi.")]
    ],
    formats: [
      { h: T('1–4 классы: 10 слайдов', "1–4-sinf: 10 slayd"), b: T('Вопрос, план, ролики-объяснения, ответ на вопрос, проверка из трёх заданий (отсюда балл в LMS) и кубок в конце.', "Savol, reja, tushuntirish roliklari, savolga javob, uchta topshiriqdan iborat tekshiruv (LMS balli shu yerdan), oxirida kubok.") },
      { h: T('5–11 классы: 15 слайдов', "5–11-sinf: 15 slayd"), b: T('Вопрос, план, объяснение, ответ на вопрос. Затем практика: вопрос с вариантами, ввод ответа, серия из 3 примеров, сортировка или сопоставление, жизненная задача, итоговая проверка (балл в LMS) и вывод.', "Savol, reja, tushuntirish, savolga javob, so'ng amaliyot: variantli savol, javob kiritish, 3 misollik seriya, saralash yoki moslashtirish, hayotiy masala, yakuniy tekshiruv (LMS balli), xulosa.") }
    ],
    lessonFacts: [
      T('Один урок учит одному новому понятию и занимает 10–15 минут. Урок идёт как голосовой диалог с учеником.', "Har dars bitta yangi tushunchani o'rgatadi va 10–15 daqiqada tugaydi. Dars o'quvchi bilan ovozli suhbat shaklida boradi."),
      T('К каждому уроку 10 заданий только по теме этого урока: новый приём не появляется неожиданно.', "Har darsga 10 ta topshiriq. Topshiriqlar faqat shu darsda tushuntirilgan narsadan tuzilgan, yangi usul kutilmaganda chiqmaydi.")
    ],
    help: [
      [T('Входная проверка', "Boshlang'ich tekshiruv"), T('Сначала проверяется уровень, затем открывается подходящий урок. Можно начать со школьной темы, а при необходимости с нуля.', "Avval bolaning bilim darajasi tekshiriladi, natijaga qarab unga mos dars ochiladi. Maktabdagi mavzudan yoki kerak bo'lsa noldan boshlash mumkin.")],
      [T('ПК · промежуточный контроль', "PK · oraliq nazorat"), T('Проверяет пройденный блок. Порог 80%, 3 попытки. Если за 3 попытки не прошёл, ученик повторяет блок.', "O'tilgan blokni tekshiradi. O'tish chegarasi 80%, 3 ta urinish. 3 urinishda ham o'ta olmasa, bola blokni qayta takrorlaydi.")],
      [T('ИК · итоговый контроль', "IK · yakuniy nazorat"), T('В конце этапа или класса проверяет общие знания. Порог 70%.', "Bosqich yoki sinf oxirida umumiy bilimni tekshiradi. O'tish chegarasi 70%.")],
      [T('Тренажёр', 'Trenajor'), T('По одному на класс. В каждой попытке 15 случайных вопросов по четвертям и темам класса, к каждому есть разбор. Попытку можно повторить.', "Har sinfda bitta. Har urinishda 15 ta savol tasodifiy tanlanadi, har savolga yechim izohi bor, urinishni takrorlash mumkin.")],
      [T('Разбор ошибок', "Xatolar izohi"), T('К каждому неверному ответу своё пояснение. Оно не подсказывает ответ, а показывает, на что не обратил внимание и откуда ошибка. Неверные варианты построены по типичным ошибкам.', "Har noto'g'ri javobga alohida izoh. Izoh javobni aytib qo'ymaydi, bola nimaga e'tibor bermagani va xato qayerdan kelib chiqqanini ko'rsatadi.")],
      [T('Куратор и ИИ', "Kurator va sun'iy intellekt"), T('Ученик учится под наблюдением куратора и обращается к нему, если что-то непонятно. Внутри платформы можно быстро задать вопрос ИИ по примеру или теме.', "O'quv jarayonida bola kurator nazoratida bo'ladi. Platforma ichida misol yoki mavzu bo'yicha tezkor savol berish mumkin.")]
    ],
    helpNote: { ru: 'ПК (80%, 3 попытки) и ИК (70%) — разные проверки с разными порогами.', uz: "PK (80%, 3 urinish) va IK (70%) — turli tekshiruvlar, chegaralari ham har xil." },
    nums: [
      ['1640', T('уроков в курсах 1–11 классов', "dars: 1–11-sinf bo'yicha")],
      ['16 400', T('практических заданий', "amaliyot topshirig'i")],
      ['11', T('тренажёров, по одному на класс', 'trenajor, har sinfda bittadan')],
      ['10–15', T('минут занимает один урок', 'daqiqa: bitta dars')]
    ],
    skillsTitle: T('Что формируется', "Qanday ko'nikmalar shakllanadi"),
    skills: [
      T('Считать с пониманием: видеть, откуда берётся правило, а не заучивать его', "Tushunib hisoblash: qoidani yodlash o'rniga u qayerdan kelib chiqishini ko'radi"),
      T('Проверять результат обратным действием и оценкой ответа', "Natijani tekshirish: teskari amal bilan va javobni baholash orqali"),
      T('Разбирать текстовую задачу: записывать кратко, таблицей или выражением', "Matnli masalani tahlil qilish: qisqa yozuv, jadval yoki bitta ifoda ko'rinishida yozish"),
      T('Находить типичную ошибку в готовом решении', "Tipik xatolarni topish: tayyor yechimdan xatoni ko'ra olish"),
      T('Логическое и пространственное мышление: фигуры, тела, координаты, диаграммы', "Mantiqiy va fazoviy fikrlash: shakllar, jismlar, koordinatalar, diagrammalar"),
      T('Жизненные задачи: проценты, скорость, меры, среднее значение', "Hayotiy masalalar: foiz, tezlik, o'lchov birliklari, o'rtacha qiymat")
    ],
    where: [
      T('Три языка: русский, узбекский (латиница) и английский. По-узбекски к ребёнку обращаются на «Вы», имена в задачах узбекские.', "Uch tilda: o'zbek (lotin), rus va ingliz. O'zbek tilida bolaga hurmat bilan «siz» deb murojaat qilinadi, masalalardagi ismlar o'zbekcha."),
      T('Телефон и компьютер: экраны от 360 до 1440 пикселей, крупные кнопки. После обновления страницы урок возвращается на тот же слайд.', "Telefon va kompyuter: 360 dan 1440 pikselgacha ekranlar, barmoq bilan bosishga qulay tugmalar. Sahifa yangilansa dars o'sha slaydga qaytadi."),
      T('Результат попадает в LMS: зачёт или нет, процент, число верных и неверных ответов, длительность урока.', "Natija LMS da: o'tdi/o'tmadi belgisi, foiz, to'g'ri va noto'g'ri javoblar soni, dars davomiyligi.")
    ]
  };

  /* ---------- English ---------- */
  const ENG = {
    art: 'images/course_english.webp',
    get title() { return tr('en_onboard_title'); },
    get desc() { return tr('en_onboard_sub'); },
    tabs: { route: { ru: 'Три мира', uz: 'Uch olam' }, result: { ru: 'Что получишь', uz: 'Nimaga ega bo‘lasiz' } }
  };

  /* ---------- Rendering helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const card = (h, b, cls = '') => `<div class="cp-card ${cls}"><b>${esc(x(h))}</b><p>${esc(x(b))}</p></div>`;
  const nums = (list) => `<div class="cp-nums">${list.map(([n, c], i) => `<div class="cp-num-card cp-n${i % 4}"><strong>${esc(n)}</strong><span>${esc(x(c))}</span></div>`).join('')}</div>`;
  const list = (items) => `<ul class="cp-list">${items.map((i) => `<li>${esc(x(i))}</li>`).join('')}</ul>`;
  const chips = (items) => `<div class="cp-chips">${items.map((i) => `<span>${esc(x(i))}</span>`).join('')}</div>`;
  const steps = (arr) => `<ol class="cp-steps">${arr.map((s, i) => `<li><em>${i + 1}</em><b>${esc(x(s[0]))}</b><span>${esc(x(s[1]))}</span></li>`).join('')}</ol>`;

  /* ---------- Web tabs ---------- */
  function webRoute() {
    const d = WEB.dirs[dir];
    const name = x(d.n);
    return `<div class="cp-dirs">${WEB.dirs.map((it, i) => `<button type="button" class="game-3d-card cp-dir ${i === dir ? 'cp-selected' : ''}" data-cp="dir" data-v="${i}" aria-pressed="${i === dir}"><span class="cp-dir-num">${String(i + 1).padStart(2, '0')}</span><b>${esc(x(it.n))}</b><small>${esc(x(it.s))}</small>${it.k ? `<em>${it.k} ${esc(x(UI.lessonsShort))}</em>` : ''}</button>`).join('')}</div>
      <div class="cp-detail" role="status" aria-live="polite"><h3>${String(dir + 1).padStart(2, '0')} · ${esc(name)}${d.k ? ` · ${d.k} ${esc(x(UI.lessonsShort))}` : ''}</h3>
      ${d.t ? `<p><b>${esc(x(UI.topics))}:</b> ${esc(x(d.t))}</p>` : ''}<p><b>${esc(x(UI.result))}:</b> ${esc(x(d.r))}</p></div>
      <p class="cp-note">${esc(x(WEB.routeNote))}</p>`;
  }
  function webLesson() {
    return `${steps(WEB.steps)}<div class="cp-two">${WEB.lessonFacts.map((f) => `<div class="cp-pill-card">${esc(x(f))}</div>`).join('')}</div>`;
  }
  function webSupport() {
    return `<div class="cp-cards">${WEB.help.map((h) => card(h[0], h[1])).join('')}</div>`;
  }
  function webResult() {
    return `${nums(WEB.nums)}<p class="cp-note cp-note-tight">${esc(x(WEB.numNote))}</p>
      <div class="cp-split"><div><h4>${esc(x({ ru: 'К концу курса ребёнок', uz: 'Kurs oxirida bola' }))}</h4>${list(WEB.results)}<p class="cp-note">${esc(x(WEB.portfolio))}</p></div>
      <div><h4>${esc(x(WEB.skillsTitle))}</h4>${chips(WEB.skills)}<p class="cp-rec">${esc(x(WEB.rec))}</p></div></div>`;
  }

  /* ---------- Math tabs ---------- */
  function bandOf(g) { return MATH.bands.find((b) => g >= b.k[0] && g <= b.k[1]); }
  function mathRoute() {
    const cur = bandOf(grade);
    const tp = GRADE_TOPICS[grade];
    const body = tp.a
      ? `<p><b>${esc(x(UI.algebra))}:</b> ${esc(x(tp.a))}</p><p><b>${esc(x(UI.geometry))}:</b> ${esc(x(tp.g))}</p>`
      : `<p>${esc(x(tp))}</p>`;
    return `<div class="cp-bands">${MATH.bands.map((b) => `<div class="cp-band cp-band-${b.c} ${b === cur ? 'cp-selected' : ''}"><strong>${b.n}</strong><b>${b.g} ${esc(x({ ru: 'классы', uz: '-sinf' }))}</b><small>${esc(x(b.l))}</small></div>`).join('')}</div>
      <p class="cp-pick">${esc(x(UI.pickGrade))}</p>
      <div class="cp-grades" role="group" aria-label="${esc(x(UI.pickGrade))}">${Array.from({ length: 11 }, (_, i) => `<button type="button" class="cp-grade ${i + 1 === grade ? 'cp-selected' : ''}" data-cp="grade" data-v="${i + 1}" aria-pressed="${i + 1 === grade}">${i + 1}</button>`).join('')}</div>
      <div class="cp-detail" role="status" aria-live="polite"><h3>${grade}${lang() === 'uz' ? '-sinf' : ' класс'}</h3>${body}</div>
      <p class="cp-note">${esc(x(MATH.basis))}</p>`;
  }
  function mathLesson() {
    return `${steps(MATH.steps)}<div class="cp-two">${MATH.formats.map((f) => card(f.h, f.b)).join('')}</div>
      <div class="cp-two">${MATH.lessonFacts.map((f) => `<div class="cp-pill-card">${esc(x(f))}</div>`).join('')}</div>`;
  }
  function mathSupport() {
    return `<div class="cp-cards">${MATH.help.map((h) => card(h[0], h[1])).join('')}</div><p class="cp-note cp-warn">${esc(x(MATH.helpNote))}</p>`;
  }
  function mathResult() {
    return `${nums(MATH.nums)}<div class="cp-split"><div><h4>${esc(x(MATH.skillsTitle))}</h4>${list(MATH.skills)}</div><div><h4>${esc(x({ ru: 'Язык, устройства, результат', uz: 'Til, qurilma, natija' }))}</h4>${list(MATH.where)}</div></div>`;
  }

  /* ---------- English tabs ---------- */
  function engRoute() {
    const worlds = [['en_tab_1', 'en_t1_hint'], ['en_tab_2', 'en_t2_hint'], ['en_tab_3', 'en_vision_subtitle']];
    const words = ['code', 'bug', 'victory'];
    return `<div class="cp-cards">${worlds.map(([h, b]) => card(tr(h), tr(b))).join('')}</div>
      <div class="cp-split"><div><h4>${esc(x({ ru: 'Слова из карточек', uz: 'Kartochkalardagi so‘zlar' }))}</h4><ul class="cp-list">${words.map((w) => `<li><b>${esc(tr('en_card_' + w + '_word'))}</b> ${esc(tr('en_card_' + w + '_trans'))}. ${esc(tr('en_card_' + w + '_desc'))}</li>`).join('')}</ul></div>
      <div class="cp-detail"><h3>${esc(x({ ru: 'Пример диалога', uz: 'Suhbat namunasi' }))}</h3><p><b>${esc(tr('en_bubble_1'))}</b><br>${esc(tr('en_bubble_1_sub'))}</p><p><b>${esc(tr('en_bubble_2'))}</b><br>${esc(tr('en_bubble_2_sub'))}</p></div></div>`;
  }
  function engResult() {
    return `<h4>${esc(tr('en_t3_title'))}</h4><div class="cp-cards">${[1, 2, 3].map((n) => card(tr('en_p' + n + '_title'), tr('en_p' + n + '_desc'))).join('')}</div><p class="cp-note">${esc(tr('en_vision_footer_quote'))}</p>`;
  }

  const VIEWS = {
    web: { route: webRoute, lesson: webLesson, support: webSupport, result: webResult },
    math: { route: mathRoute, lesson: mathLesson, support: mathSupport, result: mathResult },
    english: { route: engRoute, result: engResult }
  };

  function render() {
    const p = program();
    const data = p === 'math' ? MATH : p === 'english' ? ENG : WEB;
    const labels = p === 'english' ? ENG.tabs : UI.tabs;
    if (!labels[tab]) tab = firstTab();
    const title = document.getElementById('cp-title');
    const desc = document.getElementById('cp-desc');
    const next = document.getElementById('cp-next-label');
    if (title) title.textContent = x(data.title);
    if (desc) desc.textContent = x(data.desc);
    if (next) next.textContent = x(UI.next);
    const tabs = Object.keys(labels).map((k) => `<button type="button" role="tab" class="cp-tab ${k === tab ? 'cp-selected' : ''}" data-cp="tab" data-v="${k}" aria-selected="${k === tab}">${esc(x(labels[k]))}</button>`).join('');
    const list_ = chosen();
    const progBar = list_.length > 1 ? `<div class="cp-tabs cp-programs" role="tablist">${list_.map((k) => `<button type="button" role="tab" class="cp-tab ${k === p ? 'cp-selected' : ''}" data-cp="prog" data-v="${k}" aria-selected="${k === p}">${esc(tr('program_' + k))}</button>`).join('')}</div>` : '';
    root.innerHTML = progBar + `<div class="cp-top"><img class="cp-art" src="${data.art}" alt="" width="88" height="64" decoding="async"><div class="cp-tabs" role="tablist">${tabs}</div></div><div class="cp-panel" role="tabpanel">${VIEWS[p][tab]()}</div>`;
  }

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cp]');
    if (!b) return;
    const v = b.dataset.v;
    if (b.dataset.cp === 'prog') { viewProg = v; tab = firstTab(); }
    if (b.dataset.cp === 'tab') tab = v;
    if (b.dataset.cp === 'dir') dir = Number(v);
    if (b.dataset.cp === 'grade') grade = Number(v);
    render();
    const focus = root.querySelector(`[data-cp="${b.dataset.cp}"][data-v="${v}"]`);
    if (focus) focus.focus({ preventScroll: true });
  });

  document.addEventListener('junior:languagechange', render);
  document.addEventListener('junior:programchange', () => { viewProg = null; tab = firstTab(); render(); });
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'data-lesson-program', 'data-lesson-programs'] });
  render();
})();
