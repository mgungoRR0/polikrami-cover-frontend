// Works Carousel Navigation
const carouselTrack = document.querySelector(".carousel-track");
const worksPrev = document.querySelector(".works-prev");
const worksNext = document.querySelector(".works-next");
const slides = document.querySelectorAll(".work-slide");

let currentIndex = 0;
const slidesPerView = 4;
const totalSlides = slides.length;
const maxIndex = Math.max(0, totalSlides - slidesPerView);

function updateCarousel() {
  const slideWidth = slides[0].offsetWidth;
  const gap = 24;
  const offset = currentIndex * (slideWidth + gap);

  carouselTrack.style.transform = `translateX(-${offset}px)`;

  // Buton durumlarını güncelle
  if (worksPrev) {
    worksPrev.style.opacity = currentIndex === 0 ? "0.5" : "1";
    worksPrev.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
  }

  if (worksNext) {
    worksNext.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    worksNext.style.pointerEvents = currentIndex >= maxIndex ? "none" : "auto";
  }
}

if (worksPrev && worksNext && carouselTrack) {
  // Önceki butonu
  worksPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  // Sonraki butonu
  worksNext.addEventListener("click", () => {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Sayfa yüklendiğinde ve resize'da kontrol et
  window.addEventListener("resize", updateCarousel);
  updateCarousel();
}
