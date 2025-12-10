// Código leve: smooth-scroll para anchors do footer e proteção contra duplo clique em links externos
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;

  // smooth scroll para anchors internos
  if (a.getAttribute('href')?.startsWith('#')) {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    }
  }

  // evita múltiplos envios por clique repetido em botões/links do footer
  if (a.closest('footer')) {
    a.addEventListener('click', () => {
      a.setAttribute('aria-disabled', 'true');
      setTimeout(() => a.removeAttribute('aria-disabled'), 800);
    }, { once: true });
  }
});