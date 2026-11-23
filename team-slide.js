/* Слайд 4 «Твоя команда наставников»: тексты ru/uz и «привет» по клику */
(() => {
  'use strict';
  const slide = document.getElementById('slide-3');
  if (!slide) return;
  const T = {
    ru: {
      title_a: 'Твоя команда', title_b: 'наставников!',
      sub: 'Познакомься с экспертами, которые будут рядом на всём пути обучения',
      hi: 'Привет! 👋',
      m_name: 'Ментор', m_role: 'Твой эксперт в IT',
      m1: 'Объясняет сложные темы', m2: 'Помогает создавать проекты', m3: 'Развивает твои навыки',
      c_name: 'Куратор', c_role: 'Твоя поддержка',
      c1: 'Отвечает на вопросы', c2: 'Помогает с расписанием', c3: 'Поддерживает и мотивирует',
      next: 'Далее: смотри, как проходит обучение'
    },
    uz: {
      title_a: 'Sening', title_b: 'mentorlar jamoang!',
      sub: 'O‘qish yo‘lingda doim yoningda bo‘ladigan ekspertlar bilan tanish',
      hi: 'Salom! 👋',
      m_name: 'Mentor', m_role: 'Sening IT ekspertin',
      m1: 'Murakkab mavzularni tushuntiradi', m2: 'Loyihalar yaratishga yordam beradi', m3: 'Ko‘nikmalaringni rivojlantiradi',
      c_name: 'Kurator', c_role: 'Sening yordaming',
      c1: 'Savollaringga javob beradi', c2: 'Jadval bo‘yicha yordam beradi', c3: 'Qo‘llab-quvvatlaydi va ruhlantiradi',
      next: 'Keyingi: o‘qish qanday o‘tishini ko‘r'
    }
  };
  const root = document.documentElement;
  function render() {
    const t = T[root.lang === 'uz' ? 'uz' : 'ru'];
    slide.querySelectorAll('[data-t]').forEach(el => { const v = t[el.dataset.t]; if (v != null && el.textContent !== v) el.textContent = v; });
  }
  slide.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.remove('is-hop'); void card.offsetWidth; card.classList.add('is-hop');
      setTimeout(() => card.classList.remove('is-hop'), 1300);
      if (window.playSfx) try { window.playSfx('pop'); } catch (e) {}
    });
  });
  render();
  new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ['lang'] });
})();
