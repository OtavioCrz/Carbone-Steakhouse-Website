(function initReservaLink() {
  const btn = document.querySelector('#contato .btn-reservar');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.open('https://widget.getinapp.com.br/yPAAvWPz', '_blank');
  });
})();
