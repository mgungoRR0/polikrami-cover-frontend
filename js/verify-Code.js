// ==========================================
// VERIFY CODE - OTP Doğrulama + Timer
// ==========================================

(function() {
    'use strict';

    const form = document.getElementById('otpForm');
    if (!form) return;

    const inputs = document.querySelectorAll('.otp-input');
    const resendBtn = document.getElementById('resendBtn');
    const timerText = document.getElementById('timerText');
    const showMessage = window.polikrami?.showMessage || ((m) => alert(m));

    let countdownInterval = null;
    let timeRemaining = 90; // 1.5 dakika

    // Timer başlat
    function startCountdown() {
        timeRemaining = 90;
        
        if (resendBtn) resendBtn.disabled = true;
        if (timerText) timerText.classList.remove('expired');
        
        if (countdownInterval) clearInterval(countdownInterval);
        
        countdownInterval = setInterval(() => {
            timeRemaining--;
            
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            if (timerText) timerText.textContent = formattedTime;
            
            if (timeRemaining <= 0) {
                clearInterval(countdownInterval);
                
                if (timerText) {
                    timerText.textContent = '00:00';
                    timerText.classList.add('expired');
                }
                
                if (resendBtn) resendBtn.disabled = false;
                
                showMessage('Kod süresi doldu. Lütfen yeni kod isteyin.', 'warning');
            }
        }, 1000);
    }

    // Yeniden gönder butonu
    if (resendBtn) {
        resendBtn.addEventListener('click', function() {
            inputs.forEach(input => input.value = '');
            if (inputs[0]) inputs[0].focus();
            
            startCountdown();
            showMessage('Yeni doğrulama kodu gönderildi!', 'success');
        });
    }

    // Form gönderimi
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (timeRemaining <= 0) {
            showMessage('Kod süresi dolmuş. Lütfen yeni kod isteyin.', 'error');
            return;
        }
        
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

        if (countdownInterval) clearInterval(countdownInterval);
        
        showMessage('Kod doğrulandı! Yönlendiriliyorsunuz...', 'success');
        
        setTimeout(() => {
            window.location.href = 'reset-Password.html';
        }, 1500);
    });

    // Sayfa açılınca timer başlat
    startCountdown();
    if (inputs[0]) inputs[0].focus();

    console.log('✅ Verify code + timer başlatıldı');

})();