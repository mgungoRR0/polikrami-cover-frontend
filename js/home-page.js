// ==========================================
// HOME PAGE - YENİ 3D Carousel ve Team Scroll
// ==========================================

(function () {
  ("use strict");

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

  // ==========================================
  // YENİ 3D CAROUSEL
  // ==========================================

  const slides = [
    {
      id: 1,
      image: "../signal-2025-09-09-114423.jpeg",
      alt: "Kapak 1",
      designer: "Melis Aksyon",
      title: "Güneşin Doğuşu",
      likes: 1247,
    },
    {
      id: 2,
      image: "../assets/images/our-work-melis1-images.png",
      alt: "Kapak 2",
      designer: "Zeynep Kaya",
      title: "E-Commerce Platform",
      likes: 892,
    },
    {
      id: 3,
      image: "../assets/images/our-work-melis4-images.png",
      alt: "Kapak 3",
      designer: "Mehmet Demir",
      title: "Mobile App Design",
      likes: 2134,
    },
    {
      id: 4,
      image: "../assets/images/our-work-melis2-images.png",
      alt: "Kapak 4",
      designer: "Ayşe Çelik",
      title: "Analytics Dashboard",
      likes: 1567,
    },
    {
      id: 5,
      image: "../assets/images/our-work-melis-images.png",
      alt: "Kapak 5",
      designer: "Can Öztürk",
      title: "Portfolio Website",
      likes: 945,
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
            <div class="carousel-overlay-3d">
                <p class="overlay-label-3d">Tasarımcı</p>
                <h3 class="overlay-designer-3d">${slide.designer}</h3>
                <p class="overlay-label-3d">Proje Adı</p>
                <h2 class="overlay-title-3d">${slide.title}</h2>
                <div class="overlay-likes-3d">
                    <svg class="heart-icon-3d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span class="likes-count-3d">${slide.likes.toLocaleString(
                      "tr-TR"
                    )}</span>
                    <span class="likes-text-3d">beğeni</span>
                </div>
            </div>
        </div>
    `;

    return item;
  }

  function initCarousel() {
    const carouselWrapper = document.getElementById("carouselWrapper3D");
    if (!carouselWrapper) {
      console.warn("3D Carousel wrapper bulunamadı");
      return;
    }

    slides.forEach((slide, index) => {
      const item = createCarouselItem(slide, index);
      carouselWrapper.appendChild(item);
    });

    updateCarousel();

    const prevBtn = document.getElementById("prevBtn3D");
    const nextBtn = document.getElementById("nextBtn3D");

    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);

    // Klavye desteği
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    });

    // Dokunmatik ekran desteği
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

    console.log("✅ 3D Carousel başlatıldı");
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
  // TEAM CAROUSEL
  // ==========================================
  let currentTeamIndex = 0;

  function computeTeamMaxIndex() {
    const teamMembers = document.querySelectorAll(".team-member-card");
    const teamCarousel = document.querySelector(".team-carousel");
    if (!teamCarousel) return { memberWidth: 256, maxIndex: 0 };

    const memberWidth = 256;
    const containerWidth = teamCarousel.offsetWidth;
    const visibleMembers = Math.max(
      1,
      Math.floor(containerWidth / memberWidth)
    );
    const maxIndex = Math.max(0, teamMembers.length - visibleMembers);
    return { memberWidth, maxIndex };
  }

  function applyTeamTransform() {
    const { memberWidth, maxIndex } = computeTeamMaxIndex();
    const teamGrid = document.getElementById("teamGrid");
    if (!teamGrid) return;

    if (currentTeamIndex < 0) currentTeamIndex = 0;
    if (currentTeamIndex > maxIndex) currentTeamIndex = maxIndex;

    const translateX = -(currentTeamIndex * memberWidth);
    teamGrid.style.transform = `translateX(${translateX}px)`;
  }

  window.scrollTeam = function (direction) {
    currentTeamIndex += direction;
    applyTeamTransform();
  };

  // ==========================================
  // TESTIMONIALS CAROUSEL
  // ==========================================

  let currentTestimonialIndex = 0;
  const totalTestimonials = 5; // Toplam yorum sayısı

  function updateTestimonialDisplay() {
    const cards = document.querySelectorAll(".testimonial-card-single");
    const dots = document.querySelectorAll(
      ".testimonial-pagination .pagination-dot"
    );

    cards.forEach((card, index) => {
      if (index === currentTestimonialIndex) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });

    dots.forEach((dot, index) => {
      if (index === currentTestimonialIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  window.changeTestimonial = function (direction) {
    currentTestimonialIndex += direction;

    if (currentTestimonialIndex < 0) {
      currentTestimonialIndex = totalTestimonials - 1;
    } else if (currentTestimonialIndex >= totalTestimonials) {
      currentTestimonialIndex = 0;
    }

    updateTestimonialDisplay();
  };

  window.goToTestimonial = function (index) {
    currentTestimonialIndex = index;
    updateTestimonialDisplay();
  };

  // Otomatik kayma (isteğe bağlı)
  let testimonialAutoPlay = setInterval(() => {
    changeTestimonial(1);
  }, 5000); // 5 saniyede bir

  // Kullanıcı manuel değiştirdiğinde otomatik kaymayı durdur
  document
    .querySelectorAll(".testimonial-nav-arrow, .pagination-dot")
    .forEach((element) => {
      element.addEventListener("click", () => {
        clearInterval(testimonialAutoPlay);
        // 10 saniye sonra tekrar başlat
        testimonialAutoPlay = setInterval(() => {
          changeTestimonial(1);
        }, 5000);
      });
    });

  // ==========================================
  // DİĞER FONKSİYONLAR
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

    document.querySelectorAll(".process-card, .team-member").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity .6s ease, transform .6s ease";
      revealObserver.observe(el);
    });
  };

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

  const init = () => {
    initMobileMenu();
    initHeaderScroll();
    initCarousel();
    initSmoothScroll();
    initScrollReveal();
    initLazyLoading();
    updateTestimonialDisplay();
    window.addEventListener("resize", applyTeamTransform);

    console.log("✅ Home page başlatıldı");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
