// ==========================================
// Polikrami Authentication System
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // Utility Functions
    // ==========================================
    
    // DOM selector helpers
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => parent.querySelectorAll(selector);
    
    // Email validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    };
    
    // Password strength checker
    const checkPasswordStrength = (password) => {
        let strength = 0;
        const checks = [
            password.length >= 8,
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[^a-zA-Z0-9]/.test(password)
        ];
        
        strength = checks.filter(Boolean).length;
        
        return {
            score: strength,
            label: ['Çok Zayıf', 'Zayıf', 'Orta', 'İyi', 'Güçlü'][strength] || 'Çok Zayıf',
            color: ['#e74c3c', '#e67e22', '#f39c12', '#3498db', '#27ae60'][strength] || '#e74c3c'
        };
    };
    
    // ==========================================
    // Message System
    // ==========================================
    
    const showMessage = (message, type = 'error', duration = 5000) => {
        // Remove existing message
        const existingMessage = $('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Style based on type
        const styles = {
            error: {
                background: '#fee',
                color: '#c33',
                border: '1px solid #fcc'
            },
            success: {
                background: '#efe',
                color: '#3a3',
                border: '1px solid #cfc'
            },
            warning: {
                background: '#ffeaa7',
                color: '#d68910',
                border: '1px solid #fdcb6e'
            }
        };
        
        Object.assign(messageDiv.style, {
            padding: '12px',
            margin: '10px 0',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center',
            animation: 'slideDown 0.3s ease',
            ...styles[type]
        });
        
        // Find form and insert message
        const form = $('#loginForm') || $('#signupForm') || $('#forgotForm') || $('#resetForm');
        if (form) {
            form.insertBefore(messageDiv, form.firstChild);
            
            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    messageDiv.style.animation = 'slideUp 0.3s ease';
                    setTimeout(() => messageDiv.remove(), 300);
                }, duration);
            }
        }
        
        return messageDiv;
    };
    
    // ==========================================
    // Password Toggle System
    // ==========================================
    
    const setupPasswordToggle = () => {
        $$('.toggle-password').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Find the password input
                const wrapper = this.closest('.password-wrapper');
                const input = wrapper ? wrapper.querySelector('input') : null;
                
                if (!input) return;
                
                // Toggle type
                const newType = input.type === 'password' ? 'text' : 'password';
                input.type = newType;
                
                // Toggle icons
                const eyeOpen = this.querySelector('.eye-open');
                const eyeClosed = this.querySelector('.eye-closed');
                
                if (eyeOpen && eyeClosed) {
                    if (newType === 'password') {
                        eyeOpen.style.display = 'block';
                        eyeClosed.style.display = 'none';
                    } else {
                        eyeOpen.style.display = 'none';
                        eyeClosed.style.display = 'block';
                    }
                }
            });
        });
    };
    
    // ==========================================
    // Form Handlers
    // ==========================================
    
    const handleLoginForm = () => {
        const form = $('#loginForm');
        if (!form) return;
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = $('#email')?.value.trim();
            const password = $('#password')?.value;
            
            // Validation
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
            
            // Button loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Giriş yapılıyor...';
            submitBtn.disabled = true;
            
            try {
                // Simulated API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Store user data (for demo)
                sessionStorage.setItem('userEmail', email);
                sessionStorage.setItem('isLoggedIn', 'true');
                
                showMessage('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
                
                // Redirect to homepage
                setTimeout(() => {
                    window.location.href = 'home-page.html';
                }, 1500);
                
            } catch (error) {
                showMessage('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    };
    
    const handleSignupForm = () => {
        const form = $('#signupForm');
        if (!form) return;
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const firstName = $('#firstName')?.value.trim();
            const lastName = $('#lastName')?.value.trim();
            const email = $('#email')?.value.trim();
            const password = $('#password')?.value;
            const passwordConfirm = $('#passwordConfirm')?.value;
            const specialization = $('#specialization')?.value;
            
            // Validation
            if (!firstName || !lastName || !email || !password || !passwordConfirm) {
                showMessage('Lütfen tüm alanları doldurun.');
                return;
            }
            
            // Artist form specialization check
            if ($('#specialization') && !specialization) {
                showMessage('Lütfen uzmanlık alanınızı seçin.');
                return;
            }
            
            if (!validateEmail(email)) {
                showMessage('Geçerli bir e-posta adresi girin.');
                return;
            }
            
            const passwordStrength = checkPasswordStrength(password);
            if (passwordStrength.score < 3) {
                showMessage(`Şifreniz ${passwordStrength.label}. Lütfen daha güçlü bir şifre seçin.`, 'warning');
                return;
            }
            
            if (password !== passwordConfirm) {
                showMessage('Şifreler eşleşmiyor.');
                return;
            }
            
            // Button loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Kayıt yapılıyor...';
            submitBtn.disabled = true;
            
            try {
                // Simulated API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                showMessage('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'user-login.html';
                }, 2000);
                
            } catch (error) {
                showMessage('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    };
    
    // ==========================================
    // Input Enhancements
    // ==========================================
    
    const enhanceInputs = () => {
        // Add focus/blur animations
        $$('.form-control').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                
                if (this.value) {
                    this.classList.add('filled');
                } else {
                    this.classList.remove('filled');
                }
            });
            
            // Check initial state
            if (input.value) {
                input.classList.add('filled');
            }
        });
        
        // Handle select dropdown styling
        const selectElement = $('#specialization');
        if (selectElement) {
            selectElement.addEventListener('change', function() {
                if (this.value) {
                    this.style.color = '#333';
                    this.classList.add('filled');
                } else {
                    this.style.color = '#A0A0A0';
                    this.classList.remove('filled');
                }
            });
            
            // Set initial state
            if (!selectElement.value) {
                selectElement.style.color = '#A0A0A0';
            }
        }
    };
    
    // ==========================================
    // Password Strength Indicator
    // ==========================================
    
    const addPasswordStrengthIndicator = () => {
        const passwordInput = $('#password');
        if (!passwordInput || $('#passwordStrength')) return;
        
        const indicator = document.createElement('div');
        indicator.id = 'passwordStrength';
        indicator.style.cssText = `
            margin-top: 5px;
            font-size: 12px;
            transition: all 0.3s ease;
        `;
        
        passwordInput.parentElement.appendChild(indicator);
        
        passwordInput.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            
            if (this.value.length > 0) {
                indicator.textContent = `Şifre Gücü: ${strength.label}`;
                indicator.style.color = strength.color;
                indicator.style.opacity = '1';
            } else {
                indicator.style.opacity = '0';
            }
        });
    };
    
    // ==========================================
    // Add Custom Styles
    // ==========================================
    
    const addCustomStyles = () => {
        if ($('#polikrami-custom-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'polikrami-custom-styles';
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
            
            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-10px);
                }
            }
            
            .form-group.focused .form-control {
                border-color: #FF9A00 !important;
                box-shadow: 0 0 0 3px rgba(255, 154, 0, 0.1) !important;
            }
            
            .form-control.filled {
                background-color: #fff !important;
            }
            
            .form-message {
                animation: slideDown 0.3s ease;
            }
            
            .toggle-password {
                transition: opacity 0.2s ease;
            }
            
            .toggle-password:hover {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    };
    
    // ==========================================
    // Initialize Everything
    // ==========================================
    
    const init = () => {
        // Core setups
        setupPasswordToggle();
        enhanceInputs();
        addPasswordStrengthIndicator();
        addCustomStyles();
        
        // Form handlers
        handleLoginForm();
        handleSignupForm();
        
        // Make utilities globally available
        window.polikrami = {
            showMessage,
            validateEmail,
            checkPasswordStrength
        };
        
        console.log('✅ Polikrami Auth System Initialized');
    };
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();