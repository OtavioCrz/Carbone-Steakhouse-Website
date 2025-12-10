(function initGallery() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('#ambiente img');
    
    if (galleryImages.length === 0) return;

    // Criar modal lightbox
    const modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.className = 'fixed inset-0 bg-black/95 backdrop-blur-sm z-50 hidden flex items-center justify-center';
    modal.innerHTML = `
      <div class="relative max-w-4xl w-full mx-auto px-4">
        <!-- Imagem expandida -->
        <img 
          id="modal-image" 
          src="" 
          alt="Galeria expandida" 
          class="w-full h-auto max-h-[85vh] object-contain rounded-lg"
        />
        
        <!-- Fechar botão -->
        <button 
          id="modal-close" 
          class="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 flex items-center justify-center text-white z-10"
          aria-label="Fechar galeria"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- Navegação -->
        <button 
          id="modal-prev" 
          class="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 flex items-center justify-center text-white"
          aria-label="Imagem anterior"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <button 
          id="modal-next" 
          class="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 flex items-center justify-center text-white"
          aria-label="Próxima imagem"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        <!-- Contador -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full text-white text-sm">
          <span id="modal-counter">1</span> / <span id="modal-total">5</span>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    let currentIndex = 0;
    const images = Array.from(galleryImages).map(img => ({
      src: img.src,
      alt: img.alt
    }));

    // Abrir modal ao clicar na imagem
    galleryImages.forEach((img, index) => {
      img.parentElement.addEventListener('click', () => {
        currentIndex = index;
        openModal();
      });
    });

    function openModal() {
      const modalImg = document.getElementById('modal-image');
      const counter = document.getElementById('modal-counter');
      const totalCount = document.getElementById('modal-total');
      
      modalImg.src = images[currentIndex].src;
      modalImg.alt = images[currentIndex].alt;
      counter.textContent = currentIndex + 1;
      totalCount.textContent = images.length;
      
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }

    // Navegação
    document.getElementById('modal-close').addEventListener('click', closeModal);
    
    document.getElementById('modal-next').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      openModal();
    });
    
    document.getElementById('modal-prev').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      openModal();
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % images.length;
        openModal();
      }
      if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openModal();
      }
    });

    // Fechar ao clicar no fundo
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  });
})();