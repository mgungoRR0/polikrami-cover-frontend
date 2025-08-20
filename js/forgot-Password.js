(function () {
  const form = document.getElementById('forgotForm');
  if (!form) return;

  const show = (typeof showMessage === 'function') ? showMessage : (m) => alert(m);
  const isEmail = (typeof validateEmail === 'function')
    ? validateEmail
    : (e) => /\S+@\S+\.\S+/.test(e);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email')?.value.trim();

    if (!email) { show('Lütfen e-posta adresinizi girin.'); return; }
    if (!isEmail(email)) { show('Geçerli bir e-posta adresi girin.'); return; }

    // Tamamen frontend: beklenen OTP'yi local olarak saklıyoruz (DEMO)
    sessionStorage.setItem('reset_email', email);
    sessionStorage.setItem('expected_otp', '1234'); // Demo: sabit 1234
    show('Doğrulama kodu e-postanıza gönderildi (demo).');

    // Kod girme sayfasına git
    window.location.href = 'verify-Code.html';
  });
})();
