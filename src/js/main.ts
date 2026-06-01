function init(): void {
  document.documentElement.classList.add('js');

  const year = String(new Date().getFullYear());
  document.querySelectorAll<HTMLElement>('[data-year]').forEach((el) => {
    el.textContent = year;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

