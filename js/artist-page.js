// ==========================================
// ARTIST PAGE - JavaScript
// ==========================================

(function () {
  "use strict";

  // ==========================================
  // TAB SWITCHING
  // ==========================================

  const initTabs = () => {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.getAttribute("data-tab");

        // Remove active from all buttons and panes
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabPanes.forEach((pane) => pane.classList.remove("active"));

        // Add active to clicked button and corresponding pane
        button.classList.add("active");
        document.getElementById(`${targetTab}-tab`).classList.add("active");

        // Re-initialize carousel if switching to works tab
        if (targetTab === "works") {
          setTimeout(() => {
            updateCarousel();
          }, 100);
        }
      });
    });
  };

  // ==========================================
  // 3D CAROUSEL (Without Overlay)
  // ==========================================

  const slides = [
    {
      id: 1,
      image: "../assets/images/our-work-melis1-images.png",
      alt: "Kapak 1",
    },
    {
      id: 2,
      image: "../assets/images/our-work-melis2-images.png",
      alt: "Kapak 2",
    },
    {
      id: 3,
      image: "../assets/images/our-work-melis4-images.png",
      alt: "Kapak 3",
    },
    {
      id: 4,
      image: "../assets/images/our-work-melis-images.png",
      alt: "Kapak 4",
    },
    {
      id: 5,
      image: "../assets/images/our-work-melis1-images.png",
      alt: "Kapak 5",
    },
  ];

  let currentIndex = 0;

  function createCarouselItem(slide, index) {
    const item = document.createElement("div");
    item.className = "carousel-item-3d";
    item.dataset.index = index;

    item.innerHTML = `
      <div class="carousel-card-3d">
        <img src="${slide.image}" alt="${slide.alt}">
      </div>
    `;

    return item;
  }

  function initCarousel() {
    const carouselWrapper = document.getElementById("artistCarouselWrapper");
    if (!carouselWrapper) {
      console.warn("Artist carousel wrapper bulunamadı");
      return;
    }

    // Clear existing items
    carouselWrapper.innerHTML = "";

    slides.forEach((slide, index) => {
      const item = createCarouselItem(slide, index);
      carouselWrapper.appendChild(item);
    });

    updateCarousel();

    const prevBtn = document.getElementById("artistPrevBtn");
    const nextBtn = document.getElementById("artistNextBtn");

    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      const worksTab = document.getElementById("works-tab");
      if (worksTab && worksTab.classList.contains("active")) {
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "ArrowRight") nextSlide();
      }
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carouselWrapper.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    carouselWrapper.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) nextSlide();
      if (touchEndX > touchStartX + 50) prevSlide();
    }

    console.log("✅ Artist carousel başlatıldı");
  }

  function getPositionClass(index) {
    const diff = index - currentIndex;
    const total = slides.length;
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

  function updateCarousel() {
    const items = document.querySelectorAll(".carousel-item-3d");
    items.forEach((item, index) => {
      item.className = "carousel-item-3d";
      const positionClass = getPositionClass(index);
      item.classList.add(positionClass);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  // ==========================================
  // SMOOTH SCROLL
  // ==========================================

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

  // ==========================================
  // HEADER SCROLL
  // ==========================================

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

  // ==========================================
  // MOBILE MENU
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

  // ==========================================
  // LAZY LOADING
  // ==========================================

  const initLazyLoading = () => {
    if (!("IntersectionObserver" in window)) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add("loaded");
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================

  const init = () => {
    initMobileMenu();
    initHeaderScroll();
    initTabs();
    initCarousel();
    initSmoothScroll();
    initLazyLoading();

    console.log("✅ Artist page başlatıldı");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
