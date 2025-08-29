// ==========================================
// Polikrami Navigation System
// ==========================================

(function() {
    'use strict';
    
    // ==========================================
    // Navigation Configuration
    // ==========================================
    
    const ROUTES = {
        // Auth pages
        login: 'user-login.html',
        register: 'user-register.html',
        artistRegister: 'artist-register.html',
        forgotPassword: 'forgot-password.html',
        verifyCode: 'verify-code.html',
        resetPassword: 'reset-password.html',
        
        // Main pages
        home: 'home-page.html',
        
        // Future pages (to be implemented)
        dashboard: 'dashboard.html',
        artistPanel: 'artist-panel.html',
        gallery: 'gallery.html',
        orderTracking: 'order-tracking.html'
    };
    
    // ==========================================
    // URL Path Helpers
    // ==========================================
    
    const getCurrentPage = () => {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    };
    
    const navigateTo = (page, delay = 0) => {
        if (delay > 0) {
            setTimeout(() => {
                window.location.href = page;
            }, delay);
        } else {
            window.location.href = page;
        }
    };
    
    const isLoggedIn = () => {
        return sessionStorage.getItem('isLoggedIn') === 'true';
    };
    
    const getUserType = () => {
        return sessionStorage.getItem('userType') || 'user';
    };
    
    // ==========================================
    // Fix All Navigation Links
    // ==========================================
    
    const fixNavigationLinks = () => {
        const currentPage = getCurrentPage();
        
        // Fix all anchor links
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http')) return;
            
            // Remove any path prefixes and fix the link
            let fixedHref = href;
            
            // Remove ../pages/ prefix if exists
            fixedHref = fixedHref.replace('../pages/', '');
            fixedHref = fixedHref.replace('/pages/', '');
            fixedHref = fixedHref.replace('pages/', '');
            
            // If we're not on the same page, update the href
            if (!href.startsWith('#')) {
                link.setAttribute('href', fixedHref);
            }
            
            // Add smooth transition on click
            if (!link.dataset.enhanced) {
                link.dataset.enhanced = 'true';
                
                link.addEventListener('click', function(e) {
                    // Don't interfere with hash links or external links
                    if (href.startsWith('#') || href.startsWith('http')) return;
                    
                    e.preventDefault();
                    
                    // Add loading class to body
                    document.body.classList.add('navigating');
                    
                    // Navigate after a short delay for smooth transition
                    setTimeout(() => {
                        window.location.href = fixedHref;
                    }, 200);
                });
            }
        });
    };
    
    // ==========================================
    // Auth Guard
    // ==========================================
    
    const checkAuthStatus = () => {
        const currentPage = getCurrentPage();
        const publicPages = [
            'user-login.html',
            'user-register.html',
            'artist-register.html',
            'forgot-password.html',
            'verify-code.html',
            'reset-password.html',
            'home-page.html'
        ];
        
        const protectedPages = [
            'dashboard.html',
            'artist-panel.html',
            'order-tracking.html'
        ];
        
        // If on protected page and not logged in, redirect to login
        if (protectedPages.includes(currentPage) && !isLoggedIn()) {
            showMessage('Bu sayfayı görüntülemek için giriş yapmalısınız.', 'warning');
            setTimeout(() => {
                navigateTo(ROUTES.login);
            }, 2000);
        }
        
        // If artist panel and not artist, redirect to dashboard
        if (currentPage === 'artist-panel.html' && getUserType() !== 'artist') {
            showMessage('Bu sayfaya erişim yetkiniz yok.', 'error');
            setTimeout(() => {
                navigateTo(ROUTES.dashboard);
            }, 2000);
        }
    };
    
    // ==========================================
    // Header User Info
    // ==========================================
    
    const updateHeaderUserInfo = () => {
        const headerRight = document.querySelector('.nav-links');
        if (!headerRight || !isLoggedIn()) return;
        
        const userEmail = sessionStorage.getItem('userEmail');
        const userType = getUserType();
        
        // Create user menu if doesn't exist
        if (!document.querySelector('.user-menu')) {
            const userMenu = document.createElement('li');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>${userEmail || 'Kullanıcı'}</span>
                    </button>
                    <div class="dropdown-content">
                        <a href="${userType === 'artist' ? ROUTES.artistPanel : ROUTES.dashboard}">
                            ${userType === 'artist' ? 'Sanatçı Paneli' : 'Hesabım'}
                        </a>
                        <a href="${ROUTES.orderTracking}">Siparişlerim</a>
                        <a href="#" id="logoutBtn">Çıkış Yap</a>
                    </div>
                </div>
            `;
            
            headerRight.appendChild(userMenu);
            
            // Add logout functionality
            document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    };
    
    // ==========================================
    // Logout Function
    // ==========================================
    
    const logout = () => {
        // Clear session
        sessionStorage.clear();
        
        // Show message
        if (window.polikrami && window.polikrami.showMessage) {
            window.polikrami.showMessage('Çıkış yapıldı. Ana sayfaya yönlendiriliyorsunuz...', 'success');
        }
        
        // Redirect to home
        setTimeout(() => {
            navigateTo(ROUTES.home);
        }, 1500);
    };
    
    // ==========================================
    // Add Navigation Styles
    // ==========================================
    
    const addNavigationStyles = () => {
        if (document.getElementById('navigation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'navigation-styles';
        style.textContent = `
            body.navigating {
                opacity: 0.8;
                transition: opacity 0.2s ease;
            }
            
            .user-menu {
                position: relative;
            }
            
            .user-dropdown {
                position: relative;
                display: inline-block;
            }
            
            .user-button {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            
            .user-button:hover {
                background: #FF9A00;
                color: white;
                border-color: #FF9A00;
            }
            
            .user-button svg {
                width: 20px;
                height: 20px;
            }
            
            .dropdown-content {
                display: none;
                position: absolute;
                right: 0;
                background: white;
                min-width: 200px;
                box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                border-radius: 8px;
                z-index: 1000;
                margin-top: 8px;
                overflow: hidden;
            }
            
            .user-dropdown:hover .dropdown-content {
                display: block;
                animation: fadeIn 0.3s ease;
            }
            
            .dropdown-content a {
                display: block;
                padding: 12px 16px;
                text-decoration: none;
                color: #333;
                transition: background 0.3s ease;
            }
            
            .dropdown-content a:hover {
                background: #f5f5f5;
                color: #FF9A00;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    };
    
    // ==========================================
    // Initialize
    // ==========================================
    
    const init = () => {
        fixNavigationLinks();
        checkAuthStatus();
        updateHeaderUserInfo();
        addNavigationStyles();
        
        // Re-fix links on any dynamic content load
        const observer = new MutationObserver(() => {
            fixNavigationLinks();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Navigation System Initialized');
    };
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for global use
    window.polikramiNav = {
        navigateTo,
        isLoggedIn,
        getUserType,
        logout,
        ROUTES
    };
    
})();