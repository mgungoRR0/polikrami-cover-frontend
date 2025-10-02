// ==========================================
// FORGOT PASSWORD - Email Gönderme
// ==========================================

(function() {
    'use strict';

    const form = document.getElementById('forgotForm');
    if (!form) return;

    const showMessage = window.polikrami?.showMessage || ((m) => alert(m));
    const validateEmail = window.polikrami?.validateEmail || ((e) => /\S+@\S+\.\S+/.test(e));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('email');
        const email = emailInput?.value.trim();

        if (!email) {
            showMessage('Lütfen e-posta adresinizi girin.', 'warning');
            emailInput?.focus();
            return;
        }

        if (!validateEmail(email)) {
            showMessage('Geçerli bir e-posta adresi girin.', 'error');
            emailInput?.focus();
            return;
        }

        sessionStorage.setItem('reset_email', email);
        sessionStorage.setItem('expected_otp', '1234');
        
        showMessage('Doğrulama kodu e-postanıza gönderildi! Yönlendiriliyorsunuz...', 'success');

        setTimeout(() => {
            window.location.href = 'verify-Code.html';
        }, 1500);
    });

    console.log('✅ Forgot password formu başlatıldı');

})();