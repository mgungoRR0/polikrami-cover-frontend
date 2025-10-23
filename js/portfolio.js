// ==========================================
// PORTFOLIO PAGE - 3 SANATÇI CAROUSEL
// ==========================================

(function () {
  ("use strict");

  // Sanatçı 1 - Kerem Özer Çalışmaları
  const artist1Slides = [
    {
      id: 1,
      image: "../assets/images/our-work-kerem3-images.png",
      alt: "Kerem Özer - Çalışma 1",
    },
    {
      id: 2,
      image: "../assets/images/our-work-kerem1-images.png",
      alt: "Kerem Özer - Çalışma 2",
    },
    {
      id: 3,
      image: "../assets/images/our-work-kerem2-images.png",
      alt: "Kerem Özer - Çalışma 3",
    },
    {
      id: 4,
      image: "../assets/images/our-work-kerem4-images.png",
      alt: "Kerem Özer - Çalışma 4",
    },
    {
      id: 5,
      image: "../assets/images/our-work-kerem-images.png",
      alt: "Kerem Özer - Çalışma 5",
    },
  ];

  // Sanatçı 2 - Kerem Özer Çalışmaları
  const artist2Slides = [
    {
      id: 1,
      image: "../assets/images/our-work-melis4-images.png",
      alt: "Kerem Özer - Çalışma 1",
    },
    {
      id: 2,
      image: "../assets/images/our-work-melis-images.png",
      alt: "Kerem Özer - Çalışma 2",
    },
    {
      id: 3,
      image: "../assets/images/our-work-melis2-images.png",
      alt: "Kerem Özer - Çalışma 3",
    },
    {
      id: 4,
      image: "../assets/images/our-work-melis1-images.png",
      alt: "Kerem Özer - Çalışma 4",
    },
    {
      id: 5,
      image: "../assets/images/our-work-melis4-images.png",
      alt: "Kerem Özer - Çalışma 5",
    },
  ];

  // Sanatçı 3 - Kerem Özer Çalışmaları
  const artist3Slides = [
    {
      id: 1,
      image: "../assets/images/our-work-melis2-images.png",
      alt: "Kerem Özer - Çalışma 1",
    },
    {
      id: 2,
      image: "../assets/images/our-work-melis1-images.png",
      alt: "Kerem Özer - Çalışma 2",
    },
    {
      id: 3,
      image: "../assets/images/our-work-melis-images.png",
      alt: "Kerem Özer - Çalışma 3",
    },
    {
      id: 4,
      image: "../assets/images/our-work-melis4-images.png",
      alt: "Kerem Özer - Çalışma 4",
    },
    {
      id: 5,
      image: "../assets/images/our-work-melis2-images.png",
      alt: "Kerem Özer - Çalışma 5",
    },
  ];

  // ==========================================
  // CAROUSEL CLASS
  // ==========================================
  class Carousel3D {
    constructor(wrapperId, prevBtnId, nextBtnId, slides) {
      this.wrapper = document.getElementById(wrapperId);
      this.prevBtn = document.getElementById(prevBtnId);
      this.nextBtn = document.getElementById(nextBtnId);
      this.slides = slides;
      this.currentIndex = 0;

      if (!this.wrapper) {
        console.warn(`Carousel wrapper "${wrapperId}" bulunamadı`);
        return;
      }

      this.init();
    }

    createCarouselItem(slide, index) {
      const item = document.createElement("div");
      item.className = "carousel-item-3d";
      item.dataset.index = index;

      // Portfolio sayfası için OVERLAY'SIZ carousel
      item.innerHTML = `
        <div class="carousel-card-3d">
            <img src="${slide.image}" alt="${slide.alt}">
        </div>
      `;

      return item;
    }

    getPositionClass(index) {
      const diff = index - this.currentIndex;
      const total = this.slides.length;
      const normalizedDiff = ((diff % total) + total) % total;
      const position =
        normalizedDiff > total / 2 ? normalizedDiff - total : normalizedDiff;

      if (position === 0) return "center";
      if (position === 1) return "right-1";
      if (position === -1) return "left-1";
      if (position === 2) return "right-2";
      if (position === -2) return "left-2";
      return "hidden";
    }

    updateCarousel() {
      const items = this.wrapper.querySelectorAll(".carousel-item-3d");
      items.forEach((item, index) => {
        item.className = "carousel-item-3d";
        const positionClass = this.getPositionClass(index);
        item.classList.add(positionClass);
      });
    }

    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.updateCarousel();
    }

    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.updateCarousel();
    }

    init() {
      // Slide'ları oluştur
      this.slides.forEach((slide, index) => {
        const item = this.createCarouselItem(slide, index);
        this.wrapper.appendChild(item);
      });

      // İlk güncelleme
      this.updateCarousel();

      // Event listener'lar
      if (this.prevBtn) {
        this.prevBtn.addEventListener("click", () => this.prevSlide());
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener("click", () => this.nextSlide());
      }

      // Klavye desteği
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") this.prevSlide();
        if (e.key === "ArrowRight") this.nextSlide();
      });

      // Dokunmatik ekran desteği
      let touchStartX = 0;
      let touchEndX = 0;

      this.wrapper.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      this.wrapper.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      });
    }

    handleSwipe() {
      if (touchEndX < touchStartX - 50) this.nextSlide();
      if (touchEndX > touchStartX + 50) this.prevSlide();
    }
  }

  // ==========================================
  // DIĞER FONKSIYONLAR
  // ==========================================

  const initMobileMenu = () => {
    const mobileBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.getElementById("navLinks");

    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener("click", () => {
        const expanded = mobileBtn.getAttribute("aria-expanded") === "true";
        mobileBtn.setAttribute("aria-expanded", String(!expanded));
        navLinks.classList.toggle("active");

        if (!expanded) {
          const firstLink = navLinks.querySelector("a, button");
          firstLink && firstLink.focus();
        } else {
          mobileBtn.focus();
        }
      });
    }
  };

  const initHeaderScroll = () => {
    const header = document.querySelector("header");
    if (!header) return;

    window.addEventListener(
      "scroll",
      () => {
        header.classList.toggle("scrolled", window.pageYOffset > 100);
      },
      { passive: true }
    );
  };

  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  };

  const initScrollReveal = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(".artist-work-section, .artist-profile")
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity .6s ease, transform .6s ease";
        revealObserver.observe(el);
      });
  };

  // ==========================================
  // INIT
  // ==========================================
  const init = () => {
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initScrollReveal();

    // 3 Carousel'ı başlat
    new Carousel3D("carouselWrapper1", "prevBtn1", "nextBtn1", artist1Slides);
    new Carousel3D("carouselWrapper2", "prevBtn2", "nextBtn2", artist2Slides);
    new Carousel3D("carouselWrapper3", "prevBtn3", "nextBtn3", artist3Slides);

    console.log("✅ Portfolio page başlatıldı - 3 carousel aktif");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
