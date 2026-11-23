/* Slide 4: presentation of the LMS inspected on 2026-10-27.
   Example progress is local to this presentation; no account API is called. */
(() => {
  'use strict';
  const root = document.getElementById('platform-preview');
  if (!root) return;
  let view = 'home';
  const copy = {
    ru: {
      heroTitle:'Добро пожаловать, друг!', heroSub:'Готов к урокам? <b>3 урока</b> уже ждут тебя', coinPill:'+100 coin', tasksTitle:'Задачи на сегодня', reward:'Награда +500 coin', online:'24/7 онлайн', referralCoins:'+1000 coin', bestLabel:'Лучший результат', chat:'Чат с ментором',
      home:'Главная', schedule:'Расписание', history:'История монет', profile:'Профиль', courses:'Курсы', certs:'Сертификаты', rating:'Рейтинг', shop:'CoinShop',
      demo:'Знакомство с платформой · данные для примера', hello:'Привет, будущий создатель!', hero:'Тебя ждут<br>новые открытия!', ready:'Выбирай курс и исследуй его вместе с ментором.',
      gifts:'Каталог подарков', allCourses:'Твоё обучение', place:'Твои достижения', achievements:'Пройденные модули', today:'Твои курсы',
      tasks:'Выбери урок и продолжай учиться', progress:'Прогресс', ongoing:'В процессе', next:'Следующий урок',
      web:'Веб-программирование', math:'Математика', english:'Английский', kids:'Kids курс',
      lessonWeb:'HTML, CSS и JavaScript — оживи человечка', lessonMath:'Числа, логика и геометрия — попробуй решить', lessonEnglish:'Gaming, Coding, Global — открой свой мир', lessonKids:'Четыре планеты — отправляйся в путешествие', openCourse:'Исследовать курс',
      streak:'Серия занятий', streakSub:'Занимайся регулярно', days:'дня подряд', best:'Лучший результат', freeze:'Заморозка', challenge:'Челлендж месяца', challengeSub:'Следи за условиями и прогрессом на платформе',
      mentor:'Помощь ментора', mentorSub:'Есть вопрос по уроку или нужна помощь с заданием?', write:'Написать ментору',
      calendar:'Календарь активности', calendarSub:'Каждый шаг виден', weekdays:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
      webinar:'Ближайший вебинар', webinarSub:'Тема, время и вход в занятие — в личном кабинете.', openSchedule:'Открыть расписание ↗',
      games:'Мини-игры', soon:'Скоро', counting:'Учимся считать', words:'Находим слова', colors:'Смешиваем цвета',
      ratingSub:'Следи за своим местом в группе и общем рейтинге.', group:'Моя группа', everyone:'Все ученики', points:'Баллы отражают учебную активность.',
      catalogNote:'Примеры направлений. Доступные курсы зависят от выбранной программы.', back:'← На главную',
      certHero:'Каждый модуль —<br>новый сертификат', certSub:'Здесь можно увидеть завершённые модули и прогресс до следующего сертификата.', completed:'Завершено', inProgress:'В процессе', certExample:'Пример сертификата', certificate:'Сертификат за пройденный модуль',
      shopHero:'Учись и двигайся<br>к своей цели!', shopSub:'В CoinShop собраны подарки, на которые можно копить монеты за учёбу.', shopRules:'Как получать монеты', testRule:'Тест на 100% с первой попытки', practiceRule:'Успешно выполненная практика', rulesNote:'Награда зависит от условий задания и количества попыток. Актуальный каталог и условия смотри на платформе.', openShop:'Открыть CoinShop ↗',
      lessonTitle:'Так начинается обучение', lessonText:'На платформе эта карточка открывает урок курса. На пробном занятии мы знакомимся с интерфейсом; практику попробуем на следующем слайде.', lessonAction:'Перейти к практике →',
      helpTitle:'Поддержка во время обучения', helpText:'На главной странице есть кнопка связи с ментором. Через неё ученик может обратиться за помощью по уроку или заданию.', helpAction:'Открыть платформу ↗', close:'Закрыть',
      done:'Понятно', explore:'Нажимай на разделы и знакомься с платформой', referral:'Пригласи друга', referralText:'Условия приглашения и начисления монет доступны в личном кабинете.',
    },
    uz: {
      heroTitle:'Xush kelibsiz, do‘stim', heroSub:'Darslarga tayyormisiz? <b>3 ta dars</b> tayyor turibdi', coinPill:'+100 coin', tasksTitle:'Bugungi vazifalar', reward:'Mukofot +500 coin', online:'24/7 onlayn', referralCoins:'+1000 coin', bestLabel:'Eng zo‘r natija', chat:'Mentor bilan chat',
      home:'Bosh sahifa', schedule:'Dars jadvali', history:'Coin tarixi', profile:'Profil', courses:'Kurslar', certs:'Sertifikatlar', rating:'Leaderboard', shop:'CoinShop',
      demo:'Platforma bilan tanishuv · namunaviy ma’lumotlar', hello:'Salom, bo‘lajak ijodkor!', hero:'Sizni yangi<br>kashfiyotlar kutmoqda!', ready:'Kursni tanlang va mentor bilan birga o‘rganing.',
      gifts:'Sovg‘alar ro‘yxati', allCourses:'Barcha kurslaringiz', place:'Reytingdagi o‘rningiz', achievements:'Yutuqlaringiz', today:'Kurslaringiz',
      tasks:'Darsni tanlang va o‘rganishda davom eting', progress:'Natija', ongoing:'Jarayonda', next:'Keyingi dars',
      web:'Web dasturlash', math:'Matematika', english:'Ingliz tili', kids:'Kids kurs',
      lessonWeb:'HTML, CSS va JavaScript — qahramonni jonlantiring', lessonMath:'Sonlar, mantiq va geometriya — sinab ko‘ring', lessonEnglish:'Gaming, Coding, Global — o‘z olamingizni oching', lessonKids:'To‘rtta sayyora — sayohatga otlaning', openCourse:'Kursni o‘rganish',
      streak:'Streak', streakSub:'Muntazam shug‘ullaning', days:'kun ketma-ket', best:'Eng zo‘r natija', freeze:'Freeze qoldi', challenge:'Oylik challenge', challengeSub:'Shartlar va natijalarni platformada kuzating',
      mentor:'Mentor yordami', mentorSub:'Dars bo‘yicha savolingiz bormi yoki vazifani bajarishda qiynalyapsizmi?', write:'Mentorga yozish',
      calendar:'Aktivlik kalendari', calendarSub:'Har bir qadam ko‘rinadi', weekdays:['Du','Se','Ch','Pa','Ju','Sh','Ya'],
      webinar:'Keyingi vebinar', webinarSub:'Mavzu, vaqt va darsga kirish — shaxsiy kabinetda.', openSchedule:'Dars jadvalini ochish ↗',
      games:'Mini o‘yinlar', soon:'Tez kunda', counting:'Sanoqni o‘rganamiz', words:'So‘zlarni topamiz', colors:'Ranglarni aralashtiramiz',
      ratingSub:'Guruhdagi va umumiy reytingdagi o‘rningizni kuzating.', group:'Guruh', everyone:'Barcha', points:'Ballar o‘quv faolligini aks ettiradi.',
      catalogNote:'Yo‘nalishlardan namunalar. Kurslarga kirish tanlangan dasturga bog‘liq.', back:'← Bosh sahifaga',
      certHero:'Har bir modul —<br>yangi sertifikat', certSub:'Tugallangan modullar va keyingi sertifikatgacha bo‘lgan natijalarni kuzating.', completed:'Yakunlandi', inProgress:'Jarayonda', certExample:'Sertifikat namunasi', certificate:'Tugallangan modul uchun sertifikat',
      shopHero:'O‘rganing va<br>maqsadingizga erishing!', shopSub:'CoinShop’da o‘qish orqali to‘plangan coinlarga olinadigan sovg‘alar jamlangan.', shopRules:'Coinlarni qanday olish mumkin', testRule:'Testni birinchi urinishda 100% bajarish', practiceRule:'Amaliy mashg‘ulotni muvaffaqiyatli bajarish', rulesNote:'Mukofot vazifa shartlari va urinishlar soniga bog‘liq. Amaldagi katalog va shartlarni platformada ko‘ring.', openShop:'CoinShop’ni ochish ↗',
      lessonTitle:'O‘qish shunday boshlanadi', lessonText:'Platformada bu karta kurs darsini ochadi. Sinov darsida interfeys bilan tanishamiz; amaliyotni keyingi slaydda sinab ko‘ramiz.', lessonAction:'Amaliyotga o‘tish →',
      helpTitle:'O‘qish davomida yordam', helpText:'Bosh sahifada mentor bilan bog‘lanish tugmasi mavjud. O‘quvchi undan dars yoki vazifa bo‘yicha yordam so‘rash uchun foydalanishi mumkin.', helpAction:'Platformani ochish ↗', close:'Yopish',
      done:'Tushunarli', explore:'Bo‘limlarni bosib, platforma bilan tanishing', referral:'Do‘stingizni taklif qiling', referralText:'Taklif qilish va coin berish shartlari shaxsiy kabinetda ko‘rsatilgan.',
    }
  };
  const t = () => copy[document.documentElement.lang === 'uz' ? 'uz' : 'ru'];
  const img = (name, cls='') => `<img class="${cls}" src="images/${name}" alt="" loading="lazy">`;
  const icon = (name) => {
    const shapes = {home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',book:'<path d="M12 5v16M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2z"/>',cup:'<path d="M7 3h10v6a5 5 0 0 1-10 0zM12 14v7M7 21h10M7 5H3v3a4 4 0 0 0 4 4M17 5h4v3a4 4 0 0 1-4 4"/>',cert:'<rect x="4" y="3" width="16" height="14" rx="2"/><path d="m8 17-1 5 5-2 5 2-1-5M8 7h8M8 11h5"/>',gift:'<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8C4 8 6 1 9 3l3 5c8 0 6-7 3-5z"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v5M17 3v5M3 11h18M7 15h3M14 15h3"/>',user:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',coin:'<circle cx="12" cy="12" r="9"/><path d="M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9M12 6v12"/>'};
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name] || shapes.book}</svg>`;
  };
  const button = (target, label, symbol, sub='') => `<button type="button" data-platform-view="${target}" class="pp-shortcut"><span class="pp-quick-art">${img(({gift:'gift_keyboard.webp',book:'junior_planet_1.webp',cup:'profile_robot_thumbsup.webp',cert:'cert_preview_html.webp'})[symbol])}</span><span><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</span><span class="pp-arrow">↗</span></button>`;
  const link = (path, label) => `<a href="https://go.junior-it.uz/${path}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const courseData = [
    ['kids','lessonKids','junior_planet_2.webp'],
    ['web','lessonWeb','anatomy_human.webp'],
    ['math','lessonMath','platform/math-course.svg'],
    ['english','lessonEnglish','course_english.webp']
  ];
  const rows = () => {
    const program = document.documentElement.dataset.lessonProgram;
    const priority = program === 'math' ? ['math','english','kids','web'] : program === 'english' ? ['english','web','math','kids'] : ['web','english','kids','math'];
    const courses = program ? [...courseData].sort((a,b) => priority.indexOf(a[0]) - priority.indexOf(b[0])) : courseData;
    return `<div class="pp-course-cards">${courses.map(([name,lesson,picture])=>`<button type="button" class="pp-course-tile pp-course-${name}" data-platform-course="${name}"><span class="pp-course-art">${img(picture)}<span class="pp-course-play" aria-hidden="true">▶</span></span><span class="pp-course-description"><b>${t()[name]}</b><small>${t()[lesson]}</small><span>${t().openCourse} <span aria-hidden="true">↗</span></span></span></button>`).join('')}</div>`;
  };
  const ico = {
    book:'<svg viewBox="0 0 40 40"><rect x="5" y="23" width="30" height="8" rx="2" fill="#5b7bd6"/><rect x="7" y="16" width="27" height="8" rx="2" fill="#7da2f2"/><rect x="9" y="9" width="24" height="8" rx="2" fill="#a9c4fa"/></svg>',
    pad:'<svg viewBox="0 0 40 40"><rect x="4" y="12" width="32" height="19" rx="9" fill="#6f63d8"/><rect x="10" y="18" width="3" height="9" rx="1.5" fill="#fff"/><rect x="7" y="21" width="9" height="3" rx="1.5" fill="#fff"/><circle cx="27" cy="19.5" r="2.2" fill="#ffd45e"/><circle cx="31" cy="24" r="2.2" fill="#ff7a8a"/></svg>',
    chest:'<svg viewBox="0 0 40 40"><rect x="5" y="17" width="30" height="16" rx="3" fill="#b8793f"/><path d="M5 20a15 9 0 0130 0z" fill="#d69a5a"/><rect x="17" y="19" width="6" height="8" rx="1.5" fill="#ffd45e"/></svg>',
    podium:'<svg viewBox="0 0 40 40"><rect x="4" y="22" width="10" height="13" rx="2" fill="#5b95e8"/><rect x="15" y="15" width="10" height="20" rx="2" fill="#3f7bdb"/><rect x="26" y="25" width="10" height="10" rx="2" fill="#7db0f2"/><path d="M20 4l2 4.5 4.8.6-3.5 3.3.9 4.8L20 14.8l-4.2 2.4.9-4.8-3.5-3.3 4.8-.6z" fill="#ffc83d"/></svg>',
    snow:'<svg viewBox="0 0 40 40" fill="none" stroke="#6bb6ea" stroke-width="3.4" stroke-linecap="round"><path d="M20 5v30M7 12.5l26 15M7 27.5l26-15"/><circle cx="20" cy="20" r="4" fill="#d9f0ff"/></svg>',
    crown:'<svg viewBox="0 0 40 40"><path d="M4 13l8 7 8-13 8 13 8-7-3 19H7z" fill="#ffc83d"/><rect x="7" y="32" width="26" height="4" rx="2" fill="#f0a91d"/></svg>',
    target:'<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#fff" stroke="#ef4f4f" stroke-width="4"/><circle cx="20" cy="20" r="7" fill="#fff" stroke="#ef4f4f" stroke-width="4"/><circle cx="20" cy="20" r="2.6" fill="#ef4f4f"/></svg>',
    bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0112 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"/><path d="M10 20a2.2 2.2 0 004 0"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M5 3.5h14a3 3 0 013 3v8a3 3 0 01-3 3h-7l-5.5 4v-4H5a3 3 0 01-3-3v-8a3 3 0 013-3z"/></svg>'
  };
  const shortcut = (target, label, sub, art) => `<button type="button" data-platform-view="${target}" class="pp-shortcut"><span class="pp-quick-art">${ico[art]}</span><span><b>${label}</b><small>${sub}</small></span></button>`;
  const taskArt = {web:['course_web.webp','#f26a4f'], math:['platform/math-course.svg','#bfe9f7'], english:['course_english.webp','#e6dcff'], kids:['junior_planet_2.webp','#f3e1c9']};
  function tasks() {
    const c=t(), program=document.documentElement.dataset.lessonProgram;
    const priority = program === 'math' ? ['math','english','web','kids'] : program === 'english' ? ['english','web','math','kids'] : ['web','math','english','kids'];
    const list = priority.slice(0,4).map((name,i) => {
      const lesson = courseData.find(d=>d[0]===name)[1];
      return `<li class="pp-task-item"><span class="pp-task-no">${i+1}</span><button type="button" class="pp-task-row${i===0?' is-first':''}" data-platform-course="${name}"><span class="pp-task-art" style="background:${taskArt[name][1]}">${img(taskArt[name][0])}</span><span class="pp-task-text"><b>${c[name]}</b><small>${c[lesson]}</small></span><span class="pp-task-coin"><img src="images/coin_gold.webp" alt="" loading="lazy" width="16" height="16"> ${c.coinPill}</span></button></li>`;
    }).join('');
    return `<ol class="pp-task-list">${list}</ol>`;
  }
  function streakRing() {
    const c=t(), n=c.weekdays.length;
    const petals = c.weekdays.map((d,i)=>{
      const a=(-90+i*360/n)*Math.PI/180, x=50+37*Math.cos(a), y=50+37*Math.sin(a);
      return `<span class="pp-petal${i<3?' pp-flame-lit':''}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%">${img('platform/streak-flame.svg')}<small>${d}</small></span>`;
    }).join('');
    return `<div class="pp-ring">${petals}<div class="pp-ring-center">${img('platform/streak-flame.svg','pp-main-flame')}<strong>3</strong><small>${c.days}</small></div></div>`;
  }
  function home() {
    const c=t();
    return `<div class="pp-columns"><div class="pp-main">
    <section class="pp-card pp-welcome"><div class="pp-hero"><div class="pp-hero-text"><small>${c.hello}</small><h3>${c.heroTitle}</h3><p>${c.heroSub}</p><span class="pp-pill"><img src="images/coin_gold.webp" alt="" width="16" height="16"> ${c.coinPill}</span></div>${img('robot_mentor.webp','pp-robot')}<span class="pp-badge-progress" aria-hidden="true">0/3</span></div>
    <div class="pp-shortcuts">${shortcut('courses',c.courses,c.allCourses,'book')}${shortcut('rating',c.rating,c.place,'pad')}${shortcut('shop',c.shop,c.gifts,'chest')}${shortcut('certs',c.certs,c.achievements,'podium')}</div></section>
    <section class="pp-card pp-tasks"><div class="pp-section-head"><h3>${c.tasksTitle}</h3></div>${tasks()}</section></div>
    <aside class="pp-sidebar"><section class="pp-card pp-streak">${streakRing()}<div class="pp-stat-row"><span><i>${ico.snow}</i><b>0</b><small>${c.freeze}</small></span><span><i>${ico.crown}</i><b>3</b><small>${c.bestLabel}</small></span></div>
    <div class="pp-challenge"><i>${ico.target}</i><span><b>${c.challenge}</b><small>${c.reward}</small></span><em>1/30</em></div></section>
    <section class="pp-card pp-mentor"><div class="pp-mentor-head"><div><h3>${c.mentor}</h3><b class="pp-online">${c.online}</b></div>${img('robot_mentor.webp')}</div><button type="button" data-platform-action="help">${c.write}</button></section>
</aside></div>
    <button type="button" class="pp-fab" data-platform-action="help" aria-label="${c.chat}">${ico.chat}</button>`;
  }
  function body() {
    const c=t();
    if(view==='home') return home();
    if(view==='courses') return `<section class="pp-card pp-catalog"><h3>${c.courses}</h3><p>${c.catalogNote}</p>${rows()}</section>`;
    if(view==='certs') return `<section class="pp-cert-hero"><div><h3>${c.certHero}</h3><p>${c.certSub}</p></div>${img('cert_hero_robots.webp')}</section><div class="pp-certificate-grid">${['HTML','CSS','JavaScript'].map((n,i)=>`<button type="button" class="pp-card pp-cert-card" ${i===2?'disabled':''} data-platform-action="certificate"><span class="pp-status ${i===2?'pp-pending':''}">${i===2?c.inProgress:c.completed}</span>${icon('cert')}<h3>${n}</h3><div class="pp-bar" style="--progress:${i===2?40:100}%"></div><small>${i===2?'40%':c.certExample}</small></button>`).join('')}</div>`;
    return `<section class="pp-card pp-rating">${icon('cup')}<h3>${c.rating}</h3><p>${c.ratingSub}</p><div class="pp-filters"><button type="button" aria-pressed="true" data-platform-filter="group">${c.group}</button><button type="button" aria-pressed="false" data-platform-filter="all">${c.everyone}</button></div><div class="pp-rating-example"><b>3</b><span>${c.place}</span><strong>+120 point</strong></div><p>${c.points}</p></section>`;
  }
  function render() {
    const c=t();
    root.innerHTML=`<div class="pp-topbar"><button class="pp-logo" type="button" data-platform-view="home" aria-label="${c.home}">${img('junior_logo.webp')}</button><nav>${link('schedule',c.schedule)}${link('coin-history',c.history)}</nav><div class="pp-wallet"><span>ϟ <b>120</b></span><span>${img('coin_gold.webp')} <b>80</b></span><span class="pp-bell" aria-hidden="true">${ico.bell}<i></i></span>${link('profile',icon('user')+`<span class="pp-sr">${c.profile}</span>`)}</div><span class="pp-demo-label">${c.demo}</span></div><div class="pp-content">${view!=='home'?`<button type="button" class="pp-back" data-platform-view="home">${c.back}</button>`:''}${body()}</div><dialog class="pp-dialog"><button type="button" class="pp-dialog-close" data-platform-action="close" aria-label="${c.close}">×</button><div id="pp-dialog-body"></div></dialog>`;
  }
  let mathQuestion = 0;
  let practiceQuestion = 0;
  const practiceMath = document.getElementById('practice-math-task');
  const mathQuestions = [
    {ru:['Найди закономерность','2, 4, 8, 16, …',['24','32','30'],'Каждое следующее число в два раза больше предыдущего.'], uz:['Qonuniyatni toping','2, 4, 8, 16, …',['24','32','30'],'Har bir keyingi son oldingisidan ikki baravar katta.'], correct:1, illustration:'2 → 4 → 8 → 16'},
    {ru:['Раздели целое на части','Сколько составляет ¼ от 20?',['4','10','5'],'Раздели 20 на четыре равные части.'], uz:['Butunni qismlarga ajrating','20 ning ¼ qismi nechaga teng?',['4','10','5'],'20 ni to‘rtta teng qismga bo‘ling.'], correct:2, illustration:'¼'},
    {ru:['Исследуй геометрию','Стороны прямоугольника — 6 и 4. Чему равна площадь?',['24','20','10'],'Площадь прямоугольника равна произведению его сторон.'], uz:['Geometriyani o‘rganing','To‘g‘ri to‘rtburchak tomonlari 6 va 4. Uning yuzi nechaga teng?',['24','20','10'],'To‘g‘ri to‘rtburchak yuzi uning tomonlari ko‘paytmasiga teng.'], correct:0, illustration:'6 × 4'}
  ];
  function renderMath(content=root.querySelector('#pp-dialog-body'), questionIndex=mathQuestion) {
    const uz=document.documentElement.lang==='uz';
    const q=mathQuestions[questionIndex], [title,question,answers,hint]=q[uz?'uz':'ru'];
    if (!content) return;
    content.innerHTML=`<div class="pp-math-header"><span>${t().math}</span><small>${uz?'Namuna topshiriq':'Попробуй сам'} · ${questionIndex+1} / ${mathQuestions.length}</small></div><div class="pp-math-visual">${questionIndex===2?'<span class="pp-math-rectangle">6 × 4</span>':q.illustration}</div><h3>${title}</h3><p>${question}</p><div class="pp-math-answers">${answers.map((a,i)=>`<button type="button" data-math-answer="${i}">${a}</button>`).join('')}</div><p class="pp-math-feedback" role="status"></p><details class="pp-math-hint"><summary>${uz?'Yordam':'Подсказка'}</summary><p>${hint}</p></details><button type="button" class="pp-math-next" data-math-next>${uz?'Keyingi topshiriq':'Другая задача'} →</button>`;
  }
  function openCourse(course) {
    if(course==='kids') {window.openJuniorCourseMap(); return;}
    if(course==='web') {window.openWebAnatomyModal(); return;}
    if(course==='english') {window.openEnglishModal(); return;}
    mathQuestion=0; renderMath();
    root.querySelector('dialog').classList.add('pp-math-dialog');
    root.querySelector('dialog').showModal();
  }
  function handleMathAction(target, content, isPractice=false) {
    const questionIndex=isPractice ? practiceQuestion : mathQuestion;
    if(target.hasAttribute('data-math-answer')) {
      const correct=Number(target.dataset.mathAnswer)===mathQuestions[questionIndex].correct;
      const uz=document.documentElement.lang==='uz';
      const feedback=content.querySelector('.pp-math-feedback');
      feedback.textContent=correct?(uz?'To‘g‘ri! Ajoyib natija!':'Верно! Отличный результат!'):(uz?'Yana bir bor o‘ylab ko‘ring. Yordamni ochish mumkin.':'Попробуй ещё раз. Можно открыть подсказку.');
      feedback.classList.toggle('pp-math-success',correct);
      target.classList.add(correct?'pp-answer-right':'pp-answer-wrong');
      if(correct) { content.querySelectorAll('[data-math-answer]').forEach(b=>b.disabled=true); }
      return true;
    }
    if(target.hasAttribute('data-math-next')) {
      const next=(questionIndex+1)%mathQuestions.length;
      if(isPractice) practiceQuestion=next; else mathQuestion=next;
      renderMath(content,next);
      return true;
    }
    return false;
  }
  practiceMath?.addEventListener('click', event => {
    const target=event.target.closest('button');
    if(target) handleMathAction(target,practiceMath,true);
  });
  root.addEventListener('click', event => {
    const target=event.target.closest('button');
    if(!target) return;
    if(handleMathAction(target,root.querySelector('#pp-dialog-body'))) return;

    if(target.dataset.platformView==='shop'){window.openCoinShopModal(); return;}
    if(target.dataset.platformCourse){openCourse(target.dataset.platformCourse); return;}
    if(target.dataset.platformView){view=target.dataset.platformView; render(); if(view!=='home') root.querySelector('.pp-back').focus({preventScroll:true});}
    if(target.dataset.platformFilter){root.querySelectorAll('[data-platform-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===target))); root.querySelector('.pp-rating-example strong').textContent=target.dataset.platformFilter==='all'?'+360 point':'+120 point';}
    const action=target.dataset.platformAction;
    if(!action) return;
    const dialog=root.querySelector('dialog'), c=t();
    if(action==='close'){dialog.close(); dialog.classList.remove('pp-math-dialog'); return;}
    const content=root.querySelector('#pp-dialog-body');
    if(action==='help') content.innerHTML=`${img('robot_mentor.webp')}<h3>${c.helpTitle}</h3><p>${c.helpText}</p>${link('',c.helpAction)}`;
    if(action==='certificate') content.innerHTML=`${icon('cert')}<small>${c.certExample}</small><h3>${target.querySelector('h3').textContent}</h3><p>${c.certificate}</p><button type="button" data-platform-action="close">${c.done}</button>`;
    if(action==='practice'){dialog.close(); window.goToSlide(5); return;}
    dialog.classList.remove('pp-math-dialog');
    dialog.showModal();
  });
  new MutationObserver(()=>{render();renderMath(practiceMath,practiceQuestion);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.addEventListener('junior:programchange', render);
  // Preserve the existing lesson while allowing a direct link to this preview.
  window.addEventListener('pageshow', () => {
    const value = new URLSearchParams(location.search).get('slide');
    const target = Number(value);
    if (value !== null && Number.isInteger(target) && target >= 0 && target < 8) window.goToSlide(target);
  });
  render();
  renderMath(practiceMath,practiceQuestion);
  // Подгонка под высоту экрана: слайд «Платформа» помещается целиком, без прокрутки (на десктопе).
  const slide4 = document.getElementById('slide-4');
  let fitQueued = false;
  function fit() {
    fitQueued = false;
    const el = root;
    el.style.zoom = '';
    if (!slide4 || !slide4.classList.contains('active') || window.innerWidth <= 900) return;
    const doc = document.documentElement;
    let z = 1;
    for (let i = 0; i < 4; i++) {
      el.style.zoom = String(z);
      const over = doc.scrollHeight - window.innerHeight;
      if (over <= 0) break;
      const h = el.getBoundingClientRect().height;
      if (!h) break;
      z = Math.max(0.55, z * (h - over - 8) / h);
    }
    el.style.zoom = String(Math.round(z * 100) / 100);
  }
  const queueFit = () => { if (fitQueued) return; fitQueued = true; requestAnimationFrame(() => requestAnimationFrame(fit)); };
  window.addEventListener('resize', queueFit);
  new MutationObserver(queueFit).observe(document.documentElement, { attributes: true, attributeFilter: ['data-current-slide'] });
  new MutationObserver(queueFit).observe(root, { childList: true });
  root.addEventListener('load', queueFit, true);
  setTimeout(queueFit, 600);
})();
