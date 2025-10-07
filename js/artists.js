// ==========================================
// ARTISTS PAGE - Search & Filter
// ==========================================

(function () {
  "use strict";

  // Arama fonksiyonu
  function initSearch() {
    const searchInput = document.getElementById("artistSearch");
    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const artistCards = document.querySelectorAll(".artist-card");

      artistCards.forEach((card) => {
        const artistName = card
          .querySelector(".artist-name")
          .textContent.toLowerCase();
        if (artistName.includes(searchTerm)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // Filtre fonksiyonu
  function initFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    if (filterBtns.length === 0) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Aktif class'ı değiştir
        filterBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const filter = this.getAttribute("data-filter");
        const artistCards = document.querySelectorAll(".artist-card");

        artistCards.forEach((card) => {
          if (filter === "all") {
            card.style.display = "flex";
          } else {
            const categories = card.getAttribute("data-category");
            if (categories && categories.includes(filter)) {
              card.style.display = "flex";
            } else {
              card.style.display = "none";
            }
          }
        });
      });
    });
  }

  // Load More butonu
  function initLoadMore() {
    const loadMoreBtn = document.querySelector(".load-more-btn");
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener("click", function () {
      // Burada daha fazla sanatçı yükleme işlemi yapılabilir
      console.log("Load more artists...");
      // Backend'den yeni sanatçılar yükle
    });
  }

  // Initialize
  const init = () => {
    initSearch();
    initFilter();
    initLoadMore();

    console.log("✅ Artists page başlatıldı");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
