document.addEventListener('DOMContentLoaded', () => {
  console.log('Global JS Loaded');

  // Ajusta caminhos ao carregar paginas dentro de /html/
  const basePath = window.location.pathname.includes('/html/') ? '../' : '';

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  let mobileObserver = null;

  if (isMobile && 'IntersectionObserver' in window) {
    mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          mobileObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
  }

  const registerMobileAnimations = (root = document) => {
    if (!mobileObserver) return;
    const targets = root.querySelectorAll('section, footer');
    targets.forEach(target => {
      if (target.classList.contains('animate-mobile-ready')) return;
      target.classList.add('animate-mobile-ready');
      mobileObserver.observe(target);
    });
  };

  // Lista de componentes
  const components = [
    { id: 'header-container', src: `${basePath}html/header.html` },
    { id: 'hero-container', src: `${basePath}html/hero.html` },
    { id: 'section-story-container', src: `${basePath}html/section-story.html` },
    { id: 'section-highlights-container', src: `${basePath}html/section-highlights.html` },
    { id: 'section-gallery-container', src: `${basePath}html/section-gallery.html` },
    { id: 'section-adega-container', src: `${basePath}html/section-adega.html` },
    { id: 'section-about-container', src: `${basePath}html/section-about.html` },
    { id: 'section-chef-sommelier-container', src: `${basePath}html/section-chef-sommelier.html` },
    { id: 'section-depoimentos-container', src: `${basePath}html/section-depoimentos.html` },
    { id: 'section-menu-cta-container', src: `${basePath}html/section-menu-cta.html` },
    { id: 'section-mapa-container', src: `${basePath}html/section-mapa.html` },
    { id: 'section-reserva-container', src: `${basePath}html/section-reserva.html` },
    { id: 'section-faq-container', src: `${basePath}html/section-faq-container.html` },
    // cache-buster para garantir que o footer atualizado carregue
    { id: 'footer-container', src: `${basePath}html/footer.html?v=2` }
  ];

  const footerFallback = `
<footer class="bg-both-black border-t border-white/10">
  <div class="section-wrapper py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 footer-grid">
      <div class="footer-brand">
        <h3 class="text-2xl font-heading font-bold text-both-gold mb-4">Carbone SteakHouse</h3>
        <p class="text-gray-400 text-sm leading-relaxed mb-6">Parrilla aberta, cortes nobres, adega curada e ambiente autoral em Fortaleza.</p>
        <div class="flex gap-4">
          <a href="https://www.instagram.com/carbonesteakhouse/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="text-gray-400 hover:text-both-gold">IG</a>
          <a href="https://www.tripadvisor.com.br/Restaurant_Review-g303293-d21406901-Reviews-Carbone_Steakhouse-Fortaleza_State_of_Ceara.html" target="_blank" rel="noopener noreferrer" aria-label="TripAdvisor" class="text-gray-400 hover:text-both-gold">TripAdvisor</a>
          <a href="https://wa.me/5585992922597" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" class="text-gray-400 hover:text-both-gold">WhatsApp</a>
        </div>
      </div>
      <nav class="footer-nav" aria-label="Navegacao do site">
        <h4 class="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Navegacao</h4>
        <ul class="space-y-3">
          <li><a href="#sabores" class="text-gray-400 hover:text-both-gold text-sm">Sabores</a></li>
          <li><a href="#adega" class="text-gray-400 hover:text-both-gold text-sm">Adega</a></li>
          <li><a href="#ambiente" class="text-gray-400 hover:text-both-gold text-sm">Ambiente</a></li>
          <li><a href="#menus" class="text-gray-400 hover:text-both-gold text-sm">Menus</a></li>
          <li><a href="#contato" class="text-gray-400 hover:text-both-gold text-sm">Reservas</a></li>
        </ul>
      </nav>
      <div class="footer-contact">
        <h4 class="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Informacoes</h4>
        <ul class="space-y-3">
          <li><a href="tel:+558531211614" class="text-gray-400 hover:text-both-gold text-sm flex items-center gap-2">(85) 3121-1614</a></li>
          <li><a href="mailto:contato@carbonesteakhouse.com.br" class="text-gray-400 hover:text-both-gold text-sm flex items-center gap-2">contato@carbonesteakhouse.com.br</a></li>
          <li class="text-gray-400 text-sm flex items-center gap-2">Fortaleza, CE</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="border-t border-white/10"></div>
  <div class="section-wrapper py-8">
    <div class="pt-8 text-center">
      <p class="text-gray-500 text-sm">Todos os direitos reservados &copy; 2025 Carbone SteakHouse | <a href="https://otaviocruz.dev" target="_blank" rel="noopener noreferrer" class="text-both-gold hover:text-yellow-300">Desenvolvido por Otavio Cruz</a></p>
    </div>
  </div>
</footer>`;

  function loadComponent(id, src) {
    const existing = document.getElementById(id);
    if (existing && existing.innerHTML.trim().length > 0) {
      document.dispatchEvent(new Event(`${id}-loaded`));
      return;
    }

    fetch(src)
      .then(response => {
        if (!response.ok) throw new Error(`Erro ao carregar ${src}: ${response.statusText}`);
        return response.text();
      })
      .then(html => {
        const container = document.getElementById(id);
        if (!container) {
          console.warn(`Container nao encontrado: ${id}`);
          return;
        }

        const safeHtml = html && html.trim().length > 0
          ? html
          : (id === 'footer-container' ? footerFallback : html);

        container.innerHTML = safeHtml;
        document.dispatchEvent(new Event(`${id}-loaded`));
        registerMobileAnimations(container);
      })
      .catch(err => {
        console.error(`Falha critica ao carregar ${src}:`, err);
        const container = document.getElementById(id);
        if (container) container.innerHTML = `<p style="color:red; padding:20px;">Erro ao carregar: ${src}</p>`;
      });
  }

  // Carrega todos os componentes
  components.forEach(({ id, src }) => {
    loadComponent(id, src);
  });

  // animações mobile para o que já estiver no DOM
  registerMobileAnimations();

  // Carrega scripts adicionais
  const scripts = [
    `${basePath}js/header.js`,
    `${basePath}js/lazy-load.js`,
    `${basePath}js/gallery.js`,
    `${basePath}js/section-reserva.js`,
    `${basePath}js/section-faq.js`,
    `${basePath}js/footer.js`
  ];

  scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  });
});
