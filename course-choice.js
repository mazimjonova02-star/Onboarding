/* Age and programs are explicit, independent choices. One or several programs can be picked. No account API is used. */
(() => {
  'use strict';
  const picker = document.getElementById('program-picker');
  if (!picker) return;
  const ORDER = ['web', 'math', 'english'];
  const storageKey = 'junior.lessonProgram';
  let selected = [];
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) selected = ORDER.filter(v => saved.includes(v));
  } catch (_) { /* The picker also works when storage is unavailable. */ }
  function render() {
    picker.querySelectorAll('input[name="lesson-program"]').forEach(input => {
      input.checked = selected.includes(input.value);
    });
    const root = document.documentElement;
    root.dataset.lessonProgram = selected[0] || '';
    root.dataset.lessonPrograms = selected.join(' ');
    const age = document.querySelector('input[name="lesson-age"]:checked');
    const dict = window.JuniorI18n.translations[root.lang === 'uz' ? 'uz' : 'ru'];
    const has = selected.length > 0;
    const ageLabel = age ? dict[`age_${age.value}_title`] || '' : '';
    // Slide 1: age. The pupil picks the age first, then the subjects on the next slide.
    const ageNext = document.getElementById('age-next-btn');
    if (ageNext) ageNext.disabled = !age;
    const ageOutcome = document.getElementById('age-outcome');
    if (ageOutcome) ageOutcome.textContent = age ? String(dict.age_selected || '').replace('{age}', ageLabel) : dict.age_choose;
    const chip = document.getElementById('age-chip-value');
    if (chip) chip.textContent = ageLabel || '—';
    // Slide 2: subjects.
    const key = !has ? 'program_choose_course' : selected.length > 1 ? 'program_outcome_multi' : `program_outcome_${selected[0]}`;
    document.getElementById('program-outcome').textContent = dict[key];
    document.getElementById('start-adventure-btn').disabled = !age || !has;
    const hint = document.getElementById('start-hint');
    if (hint) hint.textContent = !age ? dict.program_choose_age : ''; // «выбери курс» уже показано в блоке выше — не дублируем
  }
  window.updateProgramPreview = render;
  picker.addEventListener('change', event => {
    if (event.target.name !== 'lesson-program' || !ORDER.includes(event.target.value)) return;
    const v = event.target.value;
    selected = ORDER.filter(x => (x === v ? event.target.checked : selected.includes(x)));
    try { sessionStorage.setItem(storageKey, JSON.stringify(selected)); } catch (_) {}
    // Cancel a running maze if the pupil changes the programs after returning.
    window.setPracticeGame('teens');
    render();
    document.dispatchEvent(new CustomEvent('junior:programchange'));
  });
  new MutationObserver(render).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  render();
})();
