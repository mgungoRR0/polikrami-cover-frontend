// ==========================================
// VERIFY CODE - OTP Doğrulama
// ==========================================

(function() {
    'use strict';

    const form = document.getElementById('otpForm');
    if (!form) return;

    const inputs = document.querySelectorAll('.otp-input');
    const showMessage = window.polikrami?.showMessage || ((m) => alert(m));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const code = Array.from(inputs).map(i => i.value.trim()).join('');
        
        if (code.length !== 4) {
            showMessage('Lütfen 4 haneli kodu girin.', 'warning');
            return;
        }

        const expected = sessionStorage.getItem('expected_otp') || '1234';
        
        if (code !== expected) {
            showMessage('Kod hatalı, tekrar deneyin.', 'error');
            inputs.forEach(input => input.value = '');
            if (inputs[0]) inputs[0].focus();
            return;
        }

        showMessage('Kod doğrulandı! Yönlendiriliyorsunuz...', 'success');
        
        setTimeout(() => {
            window.location.href = 'reset-Password.html';
        }, 1500);
    });

    console.log('✅ Verify code formu başlatıldı');

})();