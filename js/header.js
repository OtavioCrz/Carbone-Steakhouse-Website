/* Header interactions moved to external script to support dynamic HTML injection.
   This script waits for `#main-header` to be present, then initializes mobile menu,
   mobile "more" submenu, desktop "more" dropdown, closing behavior and scroll-spy
   to highlight the active anchor while scrolling.
*/

(function initHeader() {
  'use strict';

  function waitForSelector(selector, timeout = 5000) {
    return new Promise((resolve) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const observer = new MutationObserver(() => {
        const node = document.querySelector(selector);
        if (node) {
          observer.disconnect();
          resolve(node);
        }
      });
      observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  function addClass(el, cls) { if (!el) return; el.classList.add(...cls.split(' ')); }
  function removeClass(el, cls) { if (!el) return; el.classList.remove(...cls.split(' ')); }

  function init() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMoreBtn = document.getElementById('mobile-more-btn');
    const mobileMore = document.getElementById('mobile-more');
    const mobileMoreIcon = document.getElementById('mobile-more-icon');

    const desktopMoreBtn = document.getElementById('desktop-more-btn');
    const desktopMore = document.getElementById('desktop-more');
    const desktopMoreIcon = document.getElementById('desktop-more-icon');

    const header = document.getElementById('main-header');

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });

      // Close mobile menu when clicking links
      mobileMenu.addEventListener('click', (e) => {
        const target = e.target.closest('a');
        if (target) {
          mobileMenu.classList.add('hidden');
          if (mobileMore) mobileMore.classList.add('hidden');
        }
      });
    }

    // Mobile 'More' toggle
    if (mobileMoreBtn && mobileMore) {
      mobileMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const opened = !mobileMore.classList.toggle('hidden');
        if (mobileMoreIcon) mobileMoreIcon.style.transform = opened ? 'rotate(90deg)' : 'rotate(0deg)';
      });
    }

    // Desktop 'More' toggle
    if (desktopMoreBtn && desktopMore) {
      // helpers to animate dropdown via Tailwind utility classes
      function openDesktopMore() {
        desktopMore.classList.remove('invisible', 'pointer-events-none', 'opacity-0', 'scale-95');
        desktopMore.classList.add('visible', 'pointer-events-auto', 'opacity-100', 'scale-100');
        desktopMoreBtn.setAttribute('aria-expanded', 'true');
        if (desktopMoreIcon) desktopMoreIcon.style.transform = 'rotate(180deg)';
      }
      function closeDesktopMore() {
        desktopMore.classList.remove('visible', 'pointer-events-auto', 'opacity-100', 'scale-100');
        desktopMore.classList.add('invisible', 'pointer-events-none', 'opacity-0', 'scale-95');
        desktopMoreBtn.setAttribute('aria-expanded', 'false');
        if (desktopMoreIcon) desktopMoreIcon.style.transform = 'rotate(0deg)';
      }

      // toggle on click
      desktopMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const opened = desktopMore.classList.contains('visible');
        if (opened) closeDesktopMore(); else openDesktopMore();
      });

      // close dropdown when clicking outside
      document.addEventListener('click', (ev) => {
        if (!desktopMore.contains(ev.target) && !desktopMoreBtn.contains(ev.target)) {
          if (desktopMore.classList.contains('visible')) {
            closeDesktopMore();
          }
        }
      });

      // close dropdown when clicking one of its links
      desktopMore.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (a) {
          closeDesktopMore();
        }
      });

      // keyboard navigation for dropdown
      desktopMoreBtn.addEventListener('keydown', (e) => {
        // Enter/Space open and focus first item
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const opened = desktopMore.classList.contains('visible');
          if (!opened) openDesktopMore();
          const first = desktopMore.querySelector('[role="menuitem"]');
          if (first) first.focus();
        }
        // ArrowDown opens and focuses first
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const opened = desktopMore.classList.contains('visible');
          if (!opened) openDesktopMore();
          const first = desktopMore.querySelector('[role="menuitem"]');
          if (first) first.focus();
        }
      });

      // manage focus within menu: ArrowUp/ArrowDown and Esc
      desktopMore.addEventListener('keydown', (e) => {
        const items = Array.from(desktopMore.querySelectorAll('[role="menuitem"]'));
        const idx = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = items[(idx + 1) % items.length];
          if (next) next.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = items[(idx - 1 + items.length) % items.length];
          if (prev) prev.focus();
        } else if (e.key === 'Escape' || e.key === 'Esc') {
          e.preventDefault();
          closeDesktopMore();
          desktopMoreBtn.focus();
        }
      });

      // close dropdown when focus leaves the menu (for keyboard users)
      desktopMore.addEventListener('focusout', (e) => {
        // if focus moved outside the desktopMore and desktopMoreBtn
        setTimeout(() => {
          const active = document.activeElement;
          if (!desktopMore.contains(active) && !desktopMoreBtn.contains(active)) closeDesktopMore();
        }, 10);
      });
    }

    // Header hide/show on scroll
    if (header) {
      let lastScrollTop = 0;
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        if (scrollTop > lastScrollTop && scrollTop > 500) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      }, { passive: true });

      // Add/remove background on scroll
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          header.classList.add('bg-both-black/95', 'shadow-md');
          header.classList.remove('bg-gradient-to-b');
        } else {
          header.classList.remove('bg-both-black/95', 'shadow-md');
          header.classList.add('bg-gradient-to-b', 'from-black/90', 'to-black/40');
        }
      }, { passive: true });
    }

    // Scroll spy / active link highlighting using IntersectionObserver
    function setupScrollSpy() {
      const sectionIds = Array.from(document.querySelectorAll('section[id]')).map(s => s.id);
      if (!sectionIds.length) return false;

      const idToLinks = {};
      // collect all anchor links that point to these ids (desktop, dropdown and mobile)
      const allAnchors = document.querySelectorAll('a[href^="#"]');
      allAnchors.forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
          const id = href.slice(1);
          if (!id) return;
          if (!idToLinks[id]) idToLinks[id] = [];
          idToLinks[id].push(a);
        }
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          const links = idToLinks[id] || [];
          if (entry.isIntersecting) {
            links.forEach(link => {
              link.classList.add('text-both-gold');
              link.classList.add('font-semibold');
            });
          } else {
            links.forEach(link => {
              link.classList.remove('text-both-gold');
              link.classList.remove('font-semibold');
            });
          }
        });
      }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return true;
    }

    // Try to setup scrollspy now; if no sections yet, wait for them
    if (!setupScrollSpy()) {
      waitForSelector('section[id]', 5000).then(() => {
        setupScrollSpy();
      });
    }
  }

  // Wait for header to be injected into DOM (used because header.html is loaded via fetch)
  waitForSelector('#main-header', 8000).then((node) => {
    if (node) {
      init();
    } else {
      // fallback: try init anyway
      setTimeout(init, 200);
    }
  });

})();