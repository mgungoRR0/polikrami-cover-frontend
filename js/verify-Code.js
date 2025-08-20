(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const show = (typeof showMessage === 'function') ? showMessage : (m) => alert(m);

  const form = $('#otpForm');
  if (!form) return;
  const inputs = $$('.otp-input');
  const group  = $('#otpGroup');

  function next(i) { if (i < inputs.length - 1) inputs[i + 1].focus(); }
  function prev(i) { if (i > 0) inputs[i - 1].focus(); }

  inputs.forEach((el, idx) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !el.value) { e.preventDefault(); prev(idx); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(idx); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(idx); }
    });
    el.addEventListener('input', () => {
      el.value = el.value.replace(/\D/g, '').slice(0, 1);
      if (el.value) next(idx);
    });
  });

  group.addEventListener('paste', (e) => {
    const t = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 4);
    if (!t) return;
    e.preventDefault();
    inputs.forEach((el, i) => el.value = t[i] || '');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = inputs.map(i => i.value.trim()).join('');
    if (code.length !== 4) { show('Lütfen 4 haneli kodu girin.'); return; }

    // Frontend demo doğrulama
    const expected = sessionStorage.getItem('expected_otp') || '1234';
    if (code !== expected) { show('Kod hatalı, tekrar deneyin.'); return; }

    show('Kod doğrulandı.');
    // Yeni şifre sayfasına geç
    window.location.href = 'reset-Password.html';
  });
})();
