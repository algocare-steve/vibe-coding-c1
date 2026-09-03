document.addEventListener('DOMContentLoaded', () => {
  const countEl = document.getElementById('routine-count');
  const cards = document.querySelectorAll('main section:nth-of-type(2) li');
  let count = 0;

  cards.forEach((card) => {
    const addBtn = card.querySelector('.routine-add');
    const todayBtn = card.querySelector('.routine-today');
    if (!addBtn || !todayBtn) return;

    addBtn.addEventListener('click', () => {
      const isAdded = addBtn.getAttribute('aria-pressed') === 'true';

      if (isAdded) {
        addBtn.setAttribute('aria-pressed', 'false');
        addBtn.textContent = '루틴에 담기';
        todayBtn.hidden = true;
        todayBtn.setAttribute('aria-pressed', 'false');
        todayBtn.textContent = '오늘 챙김';
        count -= 1;
      } else {
        addBtn.setAttribute('aria-pressed', 'true');
        addBtn.textContent = '담김 ✓';
        todayBtn.hidden = false;
        count += 1;
      }

      countEl.textContent = String(count);
    });

    todayBtn.addEventListener('click', () => {
      const isChecked = todayBtn.getAttribute('aria-pressed') === 'true';
      todayBtn.setAttribute('aria-pressed', String(!isChecked));
      todayBtn.textContent = isChecked ? '오늘 챙김' : '오늘 챙김 ✓';
    });
  });
});
