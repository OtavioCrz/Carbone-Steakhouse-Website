document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const container = document.getElementById('ambiente-carousel');
    if (!container) return;

    const buttons = document.querySelectorAll('.carousel-btn');
    const slideWidth = () => container.clientWidth;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const direction = btn.dataset.direction === 'next' ? 1 : -1;
        container.scrollBy({
          left: slideWidth() * direction,
          behavior: 'smooth'
        });
      });
    });
  }, 400);
});

(function initAmbienteCarousel(){
  const tryInit = () => {
    const container = document.getElementById('ambiente-carousel');
    if (!container) return false;

    const buttons = Array.from(document.querySelectorAll('.carousel-btn'));
    if (!buttons || buttons.length === 0) return false;

    const slideWidth = () => container.clientWidth;

    // remove listeners duplicados substituindo por clones
    buttons.forEach(btn => {
      const clone = btn.cloneNode(true);
      btn.parentNode.replaceChild(clone, btn);
    });

    const freshButtons = document.querySelectorAll('.carousel-btn');
    freshButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const direction = btn.dataset.direction === 'next' ? 1 : -1;
        container.scrollBy({
          left: slideWidth() * direction,
          behavior: 'smooth'
        });
      });
    });

    // permitir navegação via teclado (esquerda/direita) quando o carrossel estiver em foco
    container.tabIndex = -1;
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') container.scrollBy({ left: slideWidth(), behavior: 'smooth' });
      if (e.key === 'ArrowLeft') container.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
    });

    return true;
  };

  if (!tryInit()) {
    const observer = new MutationObserver((mutations, obs) => {
      if (tryInit()) obs.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
