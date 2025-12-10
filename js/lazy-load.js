(function initLazyLoad() {
  'use strict';

  // Fallback SVG (inline) — usado como último recurso
  const FALLBACK_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"%3E%3Crect width="100%25" height="100%25" fill="%230f0f13"/%3E%3Ctext x="50%25" y="50%25" fill="%23C9A24B" font-size="20" text-anchor="middle" dy=".35em"%3EImagem indispon%C3%ADvel%3C/text%3E%3C/svg%3E';

  // Limite de tentativas por imagem
  const MAX_RETRIES = 2;
  const retryCounts = new WeakMap();

  // Reduce console noise
  const LOG = {
    info: () => {},
    warn: (msg) => console.warn(msg),
    error: (msg) => console.error(msg)
  };

  // Verificar suporte a IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    LOG.warn('IntersectionObserver não suportado — imagens carregarão normalmente.');
    return;
  }

  function markLoaded(img) {
    img.classList.add('loaded');
    img.classList.remove('error');
  }

  function markError(img) {
    img.classList.add('error');
  }

  function tryLoadImage(img, src) {
    return new Promise((resolve, reject) => {
      const temp = new Image();
      // Evita CORS issues no console (não necessário para simples load)
      try { temp.crossOrigin = 'anonymous'; } catch (e) {}
      temp.onload = () => resolve(src);
      temp.onerror = () => reject(src);
      temp.src = src;
    });
  }

  function getRetryCount(img) {
    return retryCounts.get(img) || 0;
  }
  function incRetry(img) {
    const n = getRetryCount(img) + 1;
    retryCounts.set(img, n);
    return n;
  }

  function loadAndApply(img, src) {
    return tryLoadImage(img, src)
      .then(() => {
        // Só trocar src após carregada com sucesso
        if (img.getAttribute('src') !== src) img.src = src;
        markLoaded(img);
      })
      .catch(() => {
        const retries = incRetry(img);
        if (retries <= MAX_RETRIES) {
          // Tenta sem query string (uma variação simples)
          const fallbackSrc = src.split('?')[0];
          if (fallbackSrc !== src) {
            return loadAndApply(img, fallbackSrc);
          }
        }
        // último recurso: placeholder inline
        img.src = FALLBACK_SVG;
        markError(img);
        LOG.warn(`Falha no carregamento da imagem; aplicado fallback inline — ${src}`);
      });
  }

  function setupLazyLoading() {
    const lazyImages = Array.from(document.querySelectorAll('img[loading="lazy"]'));

    if (lazyImages.length === 0) return;

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;

        // Se já carregou nativamente
        if (img.complete && img.naturalWidth > 0) {
          markLoaded(img);
          observer.unobserve(img);
          return;
        }

        const src = img.dataset.src || img.getAttribute('src');
        if (!src) {
          // sem src — aplicar fallback e parar
          img.src = FALLBACK_SVG;
          markError(img);
          observer.unobserve(img);
          return;
        }

        // carregar e aplicar com controle de retries
        loadAndApply(img, src).finally(() => {
          observer.unobserve(img);
        });
      });
    }, { rootMargin: '80px 0px', threshold: 0.01 });

    lazyImages.forEach(img => {
      // evita observar múltiplas vezes
      io.observe(img);
    });
  }

  // Inicializa quando DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLazyLoading);
  } else {
    setupLazyLoading();
  }

  // Re-scan quando componentes são carregados dinamicamente,
  // mas debounce para evitar chamadas repetidas.
  let mutationTimer = null;
  const mutationObserver = new MutationObserver(() => {
    clearTimeout(mutationTimer);
    mutationTimer = setTimeout(setupLazyLoading, 250);
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
})();

// Fallback para conexão lenta - media query
if (window.matchMedia('(prefers-reduced-data: reduce)').matches) {
  document.documentElement.setAttribute('data-reduced-motion', 'true');
}