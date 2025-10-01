// ==========================================
// Polikrami Frontend System - v2.2 FIXED
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // Utility Functions
    // ==========================================
    
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => parent.querySelectorAll(selector);
    
    // ==========================================
    // Password Toggle System
    // ==========================================
    
    const setupPasswordToggle = () => {
        const toggleButtons = $$('.toggle-password');
        
        toggleButtons.forEach(button => {
            if (button.dataset.initialized === 'true') return;
            button.dataset.initialized = 'true';
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                let input = null;
                const parent = this.parentElement;
                input = parent.querySelector('input[type="password"], input[type="text"]');
                
                if (!input) {
                    const wrapper = this.closest('.password-wrapper');
                    if (wrapper) {
                        input = wrapper.querySelector('input[type="password"], input[type="text"]');
                    }
                }
                
                if (!input) {
                    const formGroup = this.closest('.form-group');
                    if (formGroup) {
                        input = formGroup.querySelector('input[type="password"], input[type="text"]');
                    }
                }
                
                if (!input) {
                    console.error('Password input not found for button:', this);
                    return;
                }
                
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                
                const eyeOpen = this.querySelector('.eye-open');
                const eyeClosed = this.querySelector('.eye-closed');
                
                if (eyeOpen && eyeClosed) {
                    if (isPassword) {
                        eyeOpen.style.display = 'none';
                        eyeClosed.style.display = 'block';
                    } else {
                        eyeOpen.style.display = 'block';
                        eyeClosed.style.display = 'none';
                    }
                }
            });
        });
        
        console.log(`✅ Password toggle initialized: ${toggleButtons.length} button(s)`);
    };
    
    // ==========================================
    // Input Enhancements
    // ==========================================
    
    const enhanceInputs = () => {
        $$('.form-control').forEach(input => {
            if (input.dataset.enhanced === 'true') return;
            input.dataset.enhanced = 'true';
            
            input.addEventListener('focus', function() {
                const parent = this.closest('.form-group');
                if (parent) parent.classList.add('focused');
                this.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                const parent = this.closest('.form-group');
                if (parent) parent.classList.remove('focused');
                this.classList.remove('focused');
                
                if (this.value && this.value.trim() !== '') {
                    this.classList.add('filled');
                } else {
                    this.classList.remove('filled');
                }
            });
            
            if (input.value && input.value.trim() !== '') {
                input.classList.add('filled');
            }
        });
    };
    
    // ==========================================
    // Select Dropdown Enhancement
    // ==========================================
    
    const enhanceSelects = () => {
        $$('select.form-control').forEach(select => {
            if (select.dataset.enhanced === 'true') return;
            select.dataset.enhanced = 'true';
            
            const updateSelectStyle = () => {
                if (select.value && select.value !== '') {
                    select.style.color = '#333';
                    select.classList.add('filled');
                } else {
                    select.style.color = '#A0A0A0';
                    select.classList.remove('filled');
                }
            };
            
            select.addEventListener('change', updateSelectStyle);
            updateSelectStyle();
        });
    };
    
    // ==========================================
    // OTP Input Enhancement
    // ==========================================
    
    const enhanceOTPInputs = () => {
        const otpInputs = $$('.otp-input');
        if (otpInputs.length === 0) return;
        
        const otpGroup = $('#otpGroup');
        
        otpInputs.forEach((input, idx) => {
            if (input.dataset.enhanced === 'true') return;
            input.dataset.enhanced = 'true';
            
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '').slice(0, 1);
                if (this.value && idx < otpInputs.length - 1) {
                    otpInputs[idx + 1].focus();
                }
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace') {
                    if (!this.value && idx > 0) {
                        e.preventDefault();
                        otpInputs[idx - 1].focus();
                        otpInputs[idx - 1].value = '';
                    }
                }
                
                if (e.key === 'ArrowLeft' && idx > 0) {
                    e.preventDefault();
                    otpInputs[idx - 1].focus();
                }
                if (e.key === 'ArrowRight' && idx < otpInputs.length - 1) {
                    e.preventDefault();
                    otpInputs[idx + 1].focus();
                }
            });
        });
        
        if (otpGroup) {
            otpGroup.addEventListener('paste', function(e) {
                e.preventDefault();
                const pastedData = (e.clipboardData || window.clipboardData).getData('text');
                const numbers = pastedData.replace(/[^0-9]/g, '').slice(0, otpInputs.length);
                
                numbers.split('').forEach((num, i) => {
                    if (otpInputs[i]) {
                        otpInputs[i].value = num;
                    }
                });
                
                const lastIndex = Math.min(numbers.length, otpInputs.length - 1);
                if (otpInputs[lastIndex]) {
                    otpInputs[lastIndex].focus();
                }
            });
        }
        
        console.log('✅ OTP inputs enhanced');
    };
    
    // ==========================================
    // Form Validation Helpers
    // ==========================================
    
    window.validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };
    
    window.validatePassword = (password) => {
        return password && password.length >= 6;
    };
    
    // ==========================================
    // Message Display System
    // ==========================================
    
    window.showMessage = (message, type = 'info') => {
        $$('.polikrami-message').forEach(el => el.remove());
        
        const messageEl = document.createElement('div');
        messageEl.className = `polikrami-message ${type}`;
        messageEl.textContent = message;
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background-color: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    };
    
    // ==========================================
    // Custom Styles
    // ==========================================
    
    const addCustomStyles = () => {
        if ($('#polikrami-custom-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'polikrami-custom-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes slideOutRight {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }
            
            .form-control.focused,
            .form-group.focused .form-control {
                border-color: #FF9A00 !important;
                box-shadow: 0 0 0 3px rgba(255, 154, 0, 0.1) !important;
            }
            
            .form-control.filled {
                background-color: #fff !important;
            }
            
            .toggle-password {
                transition: opacity 0.2s ease;
                cursor: pointer;
                background: none;
                border: none;
                padding: 5px;
                opacity: 0.6;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            
            .toggle-password:hover,
            .toggle-password:focus {
                opacity: 1;
                outline: none;
            }
            
            .toggle-password svg {
                width: 20px;
                height: 20px;
                pointer-events: none;
            }
            
            .otp-input {
                transition: all 0.3s ease;
            }
            
            .otp-input:focus {
                border-color: #FF9A00 !important;
                box-shadow: 0 0 0 3px rgba(255, 154, 0, 0.1) !important;
                transform: scale(1.05);
            }
            
            select.form-control {
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            select.form-control:focus {
                border-color: #FF9A00 !important;
                box-shadow: 0 0 0 3px rgba(255, 154, 0, 0.1) !important;
            }
            
            .password-wrapper {
                position: relative;
            }
            
            .password-wrapper .toggle-password {
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 10;
            }
            
            .password-wrapper input {
                padding-right: 50px;
            }
        `;
        document.head.appendChild(style);
    };
    
    // ==========================================
    // Password Strength Indicator System
    // ==========================================
    
    const strengthIndicatorHTML = `
        <div class="password-strength-container">
            <div class="strength-item" data-rule="length">
                <div class="strength-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <span class="strength-text">En az 8 karakter</span>
            </div>
            <div class="strength-item" data-rule="complexity">
                <div class="strength-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <span class="strength-text">Bir büyük harf, bir rakam, özel karakter</span>
            </div>
        </div>
    `;

    const validatePasswordLength = (password) => {
        return password.length >= 8;
    };

    const validatePasswordComplexity = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        return hasUpperCase && hasNumber && hasSpecialChar;
    };

    const updateStrengthIndicator = (container, password) => {
        const lengthItem = container.querySelector('[data-rule="length"]');
        const complexityItem = container.querySelector('[data-rule="complexity"]');

        if (validatePasswordLength(password)) {
            lengthItem.classList.add('valid');
        } else {
            lengthItem.classList.remove('valid');
        }

        if (validatePasswordComplexity(password)) {
            complexityItem.classList.add('valid');
        } else {
            complexityItem.classList.remove('valid');
        }
    };

    const initPasswordStrength = (passwordInput) => {
        if (!passwordInput) return;
        
        const formGroup = passwordInput.closest('.form-group');
        if (!formGroup || formGroup.querySelector('.password-strength-container')) {
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = strengthIndicatorHTML;
        const indicator = tempDiv.firstElementChild;
        
        formGroup.appendChild(indicator);

        passwordInput.addEventListener('input', function() {
            updateStrengthIndicator(indicator, this.value);
        });

        if (passwordInput.value) {
            updateStrengthIndicator(indicator, passwordInput.value);
        }
        
        console.log('✅ Password strength added to:', passwordInput.id);
    };

    const initAllPasswordFields = () => {
        // SADECE kayıt ve reset sayfalarında çalışsın
        const isSignupPage = $('#signupForm') !== null;
        const isResetPage = $('#resetForm') !== null;
        
        // Eğer login, forgot-password veya verify-code sayfasındaysak ÇIKIŞ YAP
        if (!isSignupPage && !isResetPage) {
            console.log('⏭️ Password strength skipped: Not a signup/reset page');
            return;
        }
        
        // Signup sayfalarında #password'ü bul
        if (isSignupPage) {
            const passwordInput = $('#password');
            if (passwordInput) {
                initPasswordStrength(passwordInput);
            }
        }
        
        // Reset sayfasında #newPassword'ü bul
        if (isResetPage) {
            const newPasswordInput = $('#newPassword');
            if (newPasswordInput) {
                initPasswordStrength(newPasswordInput);
            }
        }
    };
    
    // ==========================================
    // Initialize Everything
    // ==========================================
    
    const init = () => {
        addCustomStyles();
        setupPasswordToggle();
        enhanceInputs();
        enhanceSelects();
        enhanceOTPInputs();
        initAllPasswordFields(); 
        validateTermsCheckbox();
        
        const stats = {
            toggleButtons: $$('.toggle-password').length,
            formControls: $$('.form-control').length,
            otpInputs: $$('.otp-input').length,
            selects: $$('select.form-control').length
        };
        
        console.log('✅ Polikrami Frontend System v2.2 Initialized');
        console.log('📊 Components:', stats);
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    // ==========================================
// Terms Checkbox Validation
// ==========================================

const validateTermsCheckbox = () => {
    const signupForms = document.querySelectorAll('#signupForm');
    
    signupForms.forEach(form => {
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            const termsCheckbox = form.querySelector('#termsAccept');
            const termsContainer = form.querySelector('#termsAccept')?.closest('.terms-checkbox');
            
            const revenueCheckbox = form.querySelector('#revenueShareAccept');
            const revenueContainer = form.querySelector('#revenueShareAccept')?.closest('.terms-checkbox');
            
            let hasError = false;
            
            if (termsCheckbox && !termsCheckbox.checked) {
                e.preventDefault();
                hasError = true;
                
                if (termsContainer) {
                    termsContainer.classList.add('error');
                    setTimeout(() => termsContainer.classList.remove('error'), 3000);
                }
                
                if (typeof showMessage === 'function') {
                    showMessage('Lütfen kullanım şartlarını ve gizlilik sözleşmesini kabul edin.', 'warning');
                }
                
                termsCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            if (revenueCheckbox && !revenueCheckbox.checked) {
                e.preventDefault();
                hasError = true;
                
                if (revenueContainer) {
                    revenueContainer.classList.add('error');
                    setTimeout(() => revenueContainer.classList.remove('error'), 3000);
                }
                
                if (typeof showMessage === 'function') {
                    showMessage('Lütfen gelir paylaşımı sözleşmesini kabul edin.', 'warning');
                }
                
                revenueCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            if (hasError) return false;
            
            if (termsContainer) termsContainer.classList.remove('error');
            if (revenueContainer) revenueContainer.classList.remove('error');
        });
        
        const termsCheckbox = form.querySelector('#termsAccept');
        const termsContainer = form.querySelector('#termsAccept')?.closest('.terms-checkbox');
        
        if (termsCheckbox && termsContainer) {
            termsCheckbox.addEventListener('change', function() {
                if (this.checked) termsContainer.classList.remove('error');
            });
        }
        
        const revenueCheckbox = form.querySelector('#revenueShareAccept');
        const revenueContainer = form.querySelector('#revenueShareAccept')?.closest('.terms-checkbox');
        
        if (revenueCheckbox && revenueContainer) {
            revenueCheckbox.addEventListener('change', function() {
                if (this.checked) revenueContainer.classList.remove('error');
            });
        }
    });
};
    // Global export
    window.polikrami = {
        $,
        $$,
        showMessage,
        validateEmail,
        validatePassword,
        init
    };
    
})();