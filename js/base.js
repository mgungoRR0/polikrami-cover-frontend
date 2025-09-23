// ==========================================
// Polikrami Frontend System - v2.1 Fixed
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // Utility Functions
    // ==========================================
    
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => parent.querySelectorAll(selector);
    
    // ==========================================
    // Password Toggle System - FULLY FIXED
    // ==========================================
    
    const setupPasswordToggle = () => {
        const toggleButtons = $$('.toggle-password');
        
        toggleButtons.forEach(button => {
            // Duplicate event listener kontrolü
            if (button.dataset.initialized === 'true') return;
            button.dataset.initialized = 'true';
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Input'u bulmak için birden fazla yol dene
                let input = null;
                
                // Yöntem 1: Aynı parent içinde ara
                const parent = this.parentElement;
                input = parent.querySelector('input[type="password"], input[type="text"]');
                
                // Yöntem 2: Eğer parent password-wrapper ise
                if (!input) {
                    const wrapper = this.closest('.password-wrapper');
                    if (wrapper) {
                        input = wrapper.querySelector('input[type="password"], input[type="text"]');
                    }
                }
                
                // Yöntem 3: Form group içinde ara
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
                
                // Toggle password visibility
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                
                // Toggle icons
                const eyeOpen = this.querySelector('.eye-open');
                const eyeClosed = this.querySelector('.eye-closed');
                
                if (eyeOpen && eyeClosed) {
                    if (isPassword) {
                        // Şifre gösteriliyor
                        eyeOpen.style.display = 'none';
                        eyeClosed.style.display = 'block';
                    } else {
                        // Şifre gizleniyor
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
            
            // Initial state
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
            
            // Initial state
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
                // Sadece rakam kabul et
                this.value = this.value.replace(/[^0-9]/g, '').slice(0, 1);
                
                // Değer girildiyse sonraki input'a geç
                if (this.value && idx < otpInputs.length - 1) {
                    otpInputs[idx + 1].focus();
                }
            });
            
            input.addEventListener('keydown', function(e) {
                // Backspace
                if (e.key === 'Backspace') {
                    if (!this.value && idx > 0) {
                        e.preventDefault();
                        otpInputs[idx - 1].focus();
                        otpInputs[idx - 1].value = '';
                    }
                }
                
                // Arrow keys
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
        
        // Paste event - grup üzerinde dinle
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
                
                // Son dolu veya sonraki boş input'a focus
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
        // En az 6 karakter olsun basit kontrol için
        return password && password.length >= 6;
    };
    
    // ==========================================
    // Message Display System
    // ==========================================
    
    window.showMessage = (message, type = 'info') => {
        // Mevcut mesajları temizle
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
        
        // 3 saniye sonra kaldır
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
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
            
            /* Form control focus styles */
            .form-control.focused,
            .form-group.focused .form-control {
                border-color: #FF9A00 !important;
                box-shadow: 0 0 0 3px rgba(255, 154, 0, 0.1) !important;
            }
            
            .form-control.filled {
                background-color: #fff !important;
            }
            
            /* Password toggle button styles */
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
            
            .toggle-password:hover {
                opacity: 1;
            }
            
            .toggle-password:focus {
                outline: none;
                opacity: 1;
            }
            
            .toggle-password svg {
                width: 20px;
                height: 20px;
                pointer-events: none;
            }
            
            /* OTP input styles */
            .otp-input {
                transition: all 0.3s ease;
            }
            
            .otp-input:focus {
                border-color: #FF9A00 !important;
                box-shadow: 0 0 0 3px rgba(255, 154, 0, 0.1) !important;
                transform: scale(1.05);
            }
            
            /* Select dropdown styles */
            select.form-control {
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            select.form-control:focus {
                border-color: #FF9A00 !important;
                box-shadow: 0 0 0 3px rgba(255, 154, 0, 0.1) !important;
            }
            
            /* Password wrapper positioning fix */
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
            
            /* Form group with password wrapper */
            .form-group.password-wrapper {
                position: relative;
            }
            
            .form-group.password-wrapper .toggle-password {
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 10;
            }
            
            .form-group.password-wrapper input {
                padding-right: 50px;
            }
        `;
        document.head.appendChild(style);
    };
    
    // ==========================================
    // Initialize Everything
    // ==========================================
    
    const init = () => {
        // Temel özellikleri kur
        addCustomStyles();
        setupPasswordToggle();
        enhanceInputs();
        enhanceSelects();
        enhanceOTPInputs();
        
        // Debug bilgisi
        const stats = {
            toggleButtons: $$('.toggle-password').length,
            formControls: $$('.form-control').length,
            otpInputs: $$('.otp-input').length,
            selects: $$('select.form-control').length
        };
        
        console.log('✅ Polikrami Frontend System v2.1 Initialized');
        console.log('📊 Components:', stats);
    };
    
    // DOM hazır olduğunda başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
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