// Form elementleri
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Şifre toggle işlemi için genel fonksiyon
function setupPasswordToggle(toggleButtonId, passwordInputId) {
    const toggleButton = document.getElementById(toggleButtonId);
    const passwordInput = document.getElementById(passwordInputId);
    
    if (toggleButton && passwordInput) {
        toggleButton.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const eyeOpen = this.querySelector('.eye-open');
            const eyeClosed = this.querySelector('.eye-closed');
            
            if (type === 'password') {
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            } else {
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            }
        });
    }
}

// Tüm şifre toggle'larını kur
setupPasswordToggle('togglePassword', 'password');
setupPasswordToggle('togglePasswordConfirm', 'passwordConfirm');

// Email validasyon fonksiyonu
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Şifre güç kontrolü
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    return strength;
}

// Form mesajlarını göster
function showMessage(message, type = 'error') {
    // Mevcut mesajı kaldır
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Yeni mesaj oluştur
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 12px;
        margin: 10px 0;
        border-radius: 8px;
        font-size: 14px;
        text-align: center;
        animation: slideDown 0.3s ease;
        ${type === 'error' ? 
            'background: #fee; color: #c33; border: 1px solid #fcc;' : 
            'background: #efe; color: #3c3; border: 1px solid #cfc;'}
    `;
    
    // Formu bul ve mesajı ekle
    const form = loginForm || signupForm;
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
        
        // 5 saniye sonra otomatik kaldır
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Login Form İşlemleri
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email')?.value.trim();
        const password = document.getElementById('password')?.value;
        
        // Validasyon
        if (!email || !password) {
            showMessage('Lütfen tüm alanları doldurun.');
            return;
        }
        
        if (!validateEmail(email)) {
            showMessage('Geçerli bir e-posta adresi girin.');
            return;
        }
        
        if (password.length < 6) {
            showMessage('Şifre en az 6 karakter olmalıdır.');
            return;
        }
        
        // Form verileri
        const formData = {
            email: email,
            password: password
        };
        
        // Buton loading durumu
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Giriş yapılıyor...';
        submitBtn.disabled = true;
        
        try {
            // API çağrısı simülasyonu
            console.log('Login Form Data:', formData);
            
            // Gerçek API çağrısı örneği:
            // const response = await fetch('/api/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
            // const data = await response.json();
            
            // Simülasyon için 2 saniye bekle
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Başarılı mesaj
            showMessage('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
            
            // Yönlendirme (örnek)
            // setTimeout(() => window.location.href = '/dashboard', 1500);
            
        } catch (error) {
            showMessage('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Signup Form İşlemleri
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName')?.value.trim();
        const lastName = document.getElementById('lastName')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const password = document.getElementById('password')?.value;
        const passwordConfirm = document.getElementById('passwordConfirm')?.value;
        const specialization = document.getElementById('specialization')?.value;
        
        // Boş alan kontrolü
        if (!firstName || !lastName || !email || !password || !passwordConfirm) {
            showMessage('Lütfen tüm alanları doldurun.');
            return;
        }
        
        // Sanatçı formunda uzmanlık alanı zorunlu
        if (document.getElementById('specialization') && !specialization) {
            showMessage('Lütfen uzmanlık alanınızı seçin.');
            return;
        }
        
        // Email validasyonu
        if (!validateEmail(email)) {
            showMessage('Geçerli bir e-posta adresi girin.');
            return;
        }
        
        // Şifre kontrolü
        if (password.length < 8) {
            showMessage('Şifre en az 8 karakter olmalıdır.');
            return;
        }
        
        // Şifre gücü kontrolü (opsiyonel)
        if (checkPasswordStrength(password) < 4) {
            showMessage('Lütfen daha güçlü bir şifre seçin. Büyük/küçük harf ve rakam kullanın.');
            return;
        }
        
        // Şifre eşleşme kontrolü
        if (password !== passwordConfirm) {
            showMessage('Şifreler eşleşmiyor.');
            return;
        }
        
        // Form verileri
        const formData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            userType: specialization ? 'artist' : 'user',
            specialization: specialization || null
        };
        
        // Buton loading durumu
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Kayıt yapılıyor...';
        submitBtn.disabled = true;
        
        try {
            // API çağrısı simülasyonu
            console.log('Signup Form Data:', formData);
            
            // Simülasyon için 2 saniye bekle
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Başarılı mesaj
            showMessage('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...', 'success');
            
            // Yönlendirme
            setTimeout(() => {
                window.location.href = '../pages/user-Login.html';
            }, 2000);
            
        } catch (error) {
            showMessage('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Input focus efektleri ve animasyonlar
document.querySelectorAll('.form-control').forEach(input => {
    // Focus animasyonu
    input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
        this.parentElement.classList.remove('focused');
        
        // Blur'da boş değilse "filled" class'ı ekle
        if (this.value) {
            this.classList.add('filled');
        } else {
            this.classList.remove('filled');
        }
    });
    
    // Sayfa yüklendiğinde dolu inputları işaretle
    if (input.value) {
        input.classList.add('filled');
    }
});

// Dropdown için özel stil
const selectElement = document.getElementById('specialization');
if (selectElement) {
    selectElement.addEventListener('change', function() {
        if (this.value) {
            this.style.color = '#333';
            this.classList.add('filled');
        } else {
            this.style.color = '#999';
            this.classList.remove('filled');
        }
    });
    
    // İlk yüklemede rengi ayarla
    if (!selectElement.value) {
        selectElement.style.color = '#999';
    }
}

// Enter tuşu ile form gönderme
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('form-control')) {
        const form = e.target.closest('form');
        if (form) {
            const submitBtn = form.querySelector('.submit-btn');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            }
        }
    }
});

// CSS animasyon için stil ekle
if (!document.getElementById('custom-animations')) {
    const style = document.createElement('style');
    style.id = 'custom-animations';
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .form-group.focused .form-control {
            border-color: #FF9A00 !important;
        }
        
        .form-control.filled {
            background-color: #fff !important;
        }
        
        .password-strength-container {
            animation: slideDown 0.3s ease;
        }
        
        .password-strength-text {
            font-family: 'Poppins', sans-serif;
            letter-spacing: 0.5px;
        }
        
        .password-criteria {
            animation: slideDown 0.3s ease;
        }
        
        .criteria-item {
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .criteria-icon {
            display: inline-block;
            width: 14px;
            height: 14px;
            line-height: 14px;
            text-align: center;
            font-size: 10px;
            transition: all 0.2s ease;
        }
        
        .criteria-item[style*="00cc00"] .criteria-icon {
            animation: pulse 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Sayfa yüklendiğinde console'a bilgi
console.log('Polikrami Auth System - Ready');