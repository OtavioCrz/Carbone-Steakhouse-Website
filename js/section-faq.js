(() => {
  const stateKey = '__carboneFaqInitialized__';

  const getEls = (card) => {
    const btn = card.querySelector('.faq-btn');
    const icon = card.querySelector('.faq-icon');
    const question = card.querySelector('.faq-question');
    const answer = card.querySelector('.faq-answer');
    return { btn, icon, question, answer };
  };

  const closeCard = (card) => {
    const { btn, icon, question, answer } = getEls(card);

    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (icon) icon.classList.remove('rotate-45');

    if (question) {
      question.style.filter = 'none';
      question.style.opacity = '1';
    }

    if (answer) {
      answer.style.opacity = '0';
      answer.style.transform = 'translateY(8px)';
      answer.style.pointerEvents = 'none';
      answer.style.display = 'none';
    }

    card.classList.remove('faq-open');
  };

  const openCard = (card) => {
    const { btn, icon, question, answer } = getEls(card);

    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (icon) icon.classList.add('rotate-45');

    if (question) {
      question.style.filter = 'blur(2px)';
      question.style.opacity = '0.25';
    }

    if (answer) {
      answer.style.display = 'block';
      answer.style.zIndex = '1';
      requestAnimationFrame(() => {
        answer.style.opacity = '1';
        answer.style.transform = 'translateY(0)';
        answer.style.pointerEvents = 'auto';
      });
    }

    card.classList.add('faq-open');
  };

  const setupFaq = () => {
    if (window[stateKey]) return true;

    const cards = Array.from(document.querySelectorAll('.faq-card'));
    if (!cards.length) return false;

    window[stateKey] = true;

    // prepara estilos iniciais
    cards.forEach(card => {
      const { question, answer } = getEls(card);

      if (question) {
        question.style.transition = 'all 0.28s ease';
      }

      if (answer) {
        answer.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
        answer.style.opacity = '0';
        answer.style.transform = 'translateY(8px)';
        answer.style.pointerEvents = 'none';
        answer.style.display = 'none';
      }

      closeCard(card);
    });

    // listeners
    cards.forEach(card => {
      const btn = card.querySelector('.faq-btn');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const isOpen = card.classList.contains('faq-open');

        if (isOpen) {
          closeCard(card);
        } else {
          // fecha os outros
          cards.forEach(c => {
            if (c !== card) closeCard(c);
          });
          openCard(card);
        }
      });
    });

    return true;
  };

  const bootstrap = () => {
    if (window[stateKey]) return;
    if (setupFaq()) return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      if (setupFaq() || attempts >= 15) {
        clearInterval(interval);
      }
    }, 200);
  };

  document.addEventListener('section-faq-container-loaded', bootstrap);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
