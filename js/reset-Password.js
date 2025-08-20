(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const show = (typeof showMessage === 'function') ? showMessage : (m) => alert(m);

  // Göz ikonları
  document.querySelectorAll('.toggle-password').forEach((el) => {
    el.addEventListener('click', () => {
      const target = $(el.getAttribute('data-target'));
      if (!target) return;
      const isPass = target.getAttribute('type') === 'password';
      target.setAttribute('type', isPass ? 'text' : 'password');
      el.textContent = isPass ? '🙈' : '👁';
    });
  });

  const form = $('#resetForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const p1 = $('#newPassword').value.trim();
    const p2 = $('#confirmPassword').value.trim();

    if (p1.length < 6) { show('Şifre en az 6 karakter olmalıdır.'); return; }
    if (p1 !== p2)    { show('Şifreler eşleşmiyor.'); return; }

    // Frontend-only: başarı mesajı ve login'e dönüş
    show('Şifreniz güncellendi (demo).');
    window.location.href = 'user-Login.html';
  });
})();
