// ==========================================
// Polikrami Frontend System
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // Utility Functions
    // ==========================================
    
    // DOM selector helpers
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => parent.querySelectorAll(selector);
    
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
        addCustomStyles();
        
        console.log('✅ Polikrami Frontend System Initialized');
    };
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();