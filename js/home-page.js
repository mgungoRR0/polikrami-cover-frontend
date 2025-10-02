// ==========================================
// HOME PAGE - Carousel ve Team Scroll
// ==========================================

(function() {
    'use strict';

    const initMobileMenu = () => {
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.getElementById('navLinks');

        if (mobileBtn && navLinks) {
            mobileBtn.addEventListener('click', () => {
                const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
                mobileBtn.setAttribute('aria-expanded', String(!expanded));
                navLinks.classList.toggle('active');
                
                if (!expanded) {
                    const firstLink = navLinks.querySelector('a, button');
                    firstLink && firstLink.focus();
                } else {
                    mobileBtn.focus();
                }
            });
        }
    };

    const initHeaderScroll = () => {
        const header = document.querySelector('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.pageYOffset > 100);
        }, { passive: true });
    };

    let currentPosition = 3;
    const totalItems = 5;

    const initCarousel = () => {
        const carousel = document.getElementById('carousel');
        if (!carousel) {
            console.warn('Carousel element bulunamadı');
            return;
        }

        function updateCarousel() {
            if (window.innerWidth > 480) {
                carousel.style.setProperty('--position', currentPosition);
            } else {
                const items = carousel.querySelectorAll('.item');
                items.forEach((item, index) => {
                    if (index + 1 === currentPosition) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        }

        function nextSlide() {
            currentPosition = currentPosition >= totalItems ? 1 : currentPosition + 1;
            updateCarousel();
        }

        function previousSlide() {
            currentPosition = currentPosition <= 1 ? totalItems : currentPosition - 1;
            updateCarousel();
        }

        carousel.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') previousSlide();
            else if (e.key === 'ArrowRight') nextSlide();
        });

        let startX = 0, endX = 0, startY = 0, endY = 0, isSwiping = false;

        carousel.addEventListener('touchstart', function(e) {
            e.preventDefault();
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = true;
        }, { passive: false });

        carousel.addEventListener('touchmove', function(e) {
            if (!isSwiping) return;
            e.preventDefault();
        }, { passive: false });

        carousel.addEventListener('touchend', function(e) {
            if (!isSwiping) return;
            e.preventDefault();
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            handleCarouselSwipe();
            isSwiping = false;
        }, { passive: false });

        function handleCarouselSwipe() {
            const threshold = 30;
            const diffX = startX - endX;
            const diffY = Math.abs(startY - endY);

            if (Math.abs(diffX) > threshold && Math.abs(diffX) > diffY) {
                if (diffX > 0) nextSlide();
                else previousSlide();
            }
        }

        let isDragging = false, startMouseX = 0;

        carousel.addEventListener('mousedown', function(e) {
            isDragging = true;
            startMouseX = e.clientX;
            carousel.style.cursor = 'grabbing';
        });

        carousel.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
        });

        carousel.addEventListener('mouseup', function(e) {
            if (!isDragging) return;
            const diffX = startMouseX - e.clientX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) nextSlide();
                else previousSlide();
            }
            
            isDragging = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mouseleave', function() {
            isDragging = false;
            carousel.style.cursor = 'grab';
        });

        setTimeout(() => {
            updateCarousel();
            carousel.style.cursor = 'grab';
            
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            if (prevBtn) prevBtn.addEventListener('click', previousSlide);
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            
            window.addEventListener('resize', updateCarousel);
            
            console.log('✅ 3D Carousel başlatıldı');
        }, 100);
    };

    let currentTeamIndex = 0;

    function computeTeamMaxIndex() {
        const teamMembers = document.querySelectorAll('.team-member');
        const teamCarousel = document.querySelector('.team-carousel');
        if (!teamCarousel) return { memberWidth: 208, maxIndex: 0 };
        
        const memberWidth = 208;
        const containerWidth = teamCarousel.offsetWidth;
        const visibleMembers = Math.max(1, Math.floor(containerWidth / memberWidth));
        const maxIndex = Math.max(0, teamMembers.length - visibleMembers);
        return { memberWidth, maxIndex };
    }

    function applyTeamTransform() {
        const { memberWidth, maxIndex } = computeTeamMaxIndex();
        const teamGrid = document.getElementById('teamGrid');
        if (!teamGrid) return;
        
        if (currentTeamIndex < 0) currentTeamIndex = 0;
        if (currentTeamIndex > maxIndex) currentTeamIndex = maxIndex;
        
        const translateX = -(currentTeamIndex * memberWidth);
        teamGrid.style.transform = `translateX(${translateX}px)`;
    }

    window.scrollTeam = function(direction) {
        currentTeamIndex += direction;
        applyTeamTransform();
    };

    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    };

    const initScrollReveal = () => {
        const observerOptions = { 
            threshold: 0.1, 
            rootMargin: '0px 0px -100px 0px' 
        };
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.process-card, .team-member').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity .6s ease, transform .6s ease';
            revealObserver.observe(el);
        });
    };

    const initLazyLoading = () => {
        if (!('IntersectionObserver' in window)) return;

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    };

    const init = () => {
        initMobileMenu();
        initHeaderScroll();
        initCarousel();
        initSmoothScroll();
        initScrollReveal();
        initLazyLoading();
        
        window.addEventListener('resize', applyTeamTransform);
        
        console.log('✅ Home page başlatıldı');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();