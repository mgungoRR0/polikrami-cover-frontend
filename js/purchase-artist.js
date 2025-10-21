// Purchase Artist Page JavaScript - Dynamic Step System with Artist Selection

let currentStep = 1;
let totalSteps = 5; // Default: 5 adım (hediye kartı hayır)
let giftCardEnabled = false; // Default: Hayır
let selectedArtistId = null;

// MOCK DATA - Adresler
const mockAddresses = [
  {
    id: 1,
    label: "Ev",
    recipient: "Sinem Nur Koza",
    firstName: "Sinem Nur",
    lastName: "Koza",
    phone: "(539)601 30 25",
    city: "ankara",
    district: "cankaya",
    neighborhood: "yenimahalle",
    address:
      "Yenimahalle, Akasya Caddesi No: 72, Akdeniz Apartmanı, Kat: 5, Daire: 9",
    fullAddress:
      "Yenimahalle, Akasya Caddesi No: 72, Akdeniz Apartmanı, Kat: 5, Daire: 9, 06560 Çankaya / Ankara, Türkiye",
    addressType: "individual",
    tcNumber: "12345678901",
  },
  {
    id: 2,
    label: "İş",
    recipient: "Sinem Nur Koza",
    firstName: "Sinem Nur",
    lastName: "Koza",
    phone: "(532)456 78 90",
    city: "ankara",
    district: "cankaya",
    neighborhood: "kizilay",
    address:
      "Kızılay Mahallesi, Atatürk Bulvarı No: 125, Ofis Plaza Kat: 8, Daire: 15",
    fullAddress:
      "Kızılay Mahallesi, Atatürk Bulvarı No: 125, Ofis Plaza Kat: 8, Daire: 15, 06420 Çankaya / Ankara, Türkiye",
    addressType: "corporate",
    companyName: "Polikrami Teknoloji A.Ş.",
    taxOffice: "Çankaya Vergi Dairesi",
    taxNumber: "1234567890",
  },
  {
    id: 3,
    label: "Yazlık",
    recipient: "Sinem Nur Koza",
    firstName: "Sinem Nur",
    lastName: "Koza",
    phone: "(545)123 45 67",
    city: "mugla",
    district: "bodrum",
    neighborhood: "bodrum",
    address:
      "Bodrum Mahallesi, Sahil Caddesi No: 45, Deniz Apartmanı, Kat: 3, Daire: 7",
    fullAddress:
      "Bodrum Mahallesi, Sahil Caddesi No: 45, Deniz Apartmanı, Kat: 3, Daire: 7, 48400 Bodrum / Muğla, Türkiye",
    addressType: "individual",
    tcNumber: "12345678901",
  },
];

let selectedAddressId = 1;
let editingAddressId = null;
let nextAddressId = 4;

// MOCK DATA - Sanatçılar (Backend'den 3 tane gelecek)
const mockArtists = [
  {
    id: 1,
    name: "Kerem Özer",
    bio: "Tasarımda sadelikten yanayım. Duyguyu yansıtan sade tasarımlar üretmek en büyük önceliğim.",
    image: "../assets/images/kerem-ozer.jpg",
    available: false,
  },
  {
    id: 2,
    name: "Mine Ceylan",
    bio: "Tasarımda sadelikten yanayım. Duyguyu yansıtan sade tasarımlar üretmek en büyük önceliğim.",
    image: "../assets/images/mine-ceylan.jpg",
    available: true,
  },
  {
    id: 3,
    name: "Emre Yılmaz",
    bio: "Tasarımda sadelikten yanayım. Duyguyu yansıtan sade tasarımlar üretmek en büyük önceliğim.",
    image: "../assets/images/emre-yilmaz.jpg",
    available: false,
  },
];

let displayedArtists = [...mockArtists]; // Her zaman 3 sanatçı

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  initializeSteps();
  initializeMethodCards();
  initializeMessageCards();
  loadArtists();
  loadAddresses();
  initializePaymentInputs();
  updateSidebarStructure();
});

function initializeSteps() {
  showStep(1);

  document.querySelectorAll(".step-item").forEach((item) => {
    item.addEventListener("click", function () {
      const step = parseInt(this.dataset.step);
      if (step <= currentStep) {
        goToStep(step);
      }
    });
  });
}

function updateSidebarStructure() {
  const stepIndicator = document.getElementById("stepIndicator");
  if (!stepIndicator) return;

  const steps = stepIndicator.querySelectorAll(".step-item");

  if (giftCardEnabled) {
    // Hediye kartı EVET: 6 adım
    totalSteps = 6;

    // Step 4'ü göster (Mesaj Kartı)
    if (steps[3]) {
      steps[3].style.display = "flex";
      steps[3].querySelector("h3").textContent = "Adım 4";
      steps[3].querySelector("p").textContent = "Mesaj Kartını Seç";
    }

    // Step 5 ve 6'yı yeniden numaralandır
    if (steps[4]) {
      steps[4].querySelector("h3").textContent = "Adım 5";
      steps[4].querySelector("p").textContent = "Sipariş Bilgilerini Gir";
    }
    if (steps[5]) {
      steps[5].querySelector("h3").textContent = "Adım 6";
      steps[5].querySelector("p").textContent = "Ödemeni Tamamla";
    }
  } else {
    // Hediye kartı HAYIR: 5 adım
    totalSteps = 5;

    // Step 4'ü gizle (Mesaj Kartı)
    if (steps[3]) {
      steps[3].style.display = "none";
    }

    // Step 5'i 4 olarak göster
    if (steps[4]) {
      steps[4].querySelector("h3").textContent = "Adım 4";
      steps[4].querySelector("p").textContent = "Sipariş Bilgilerini Gir";
    }

    // Step 6'yı 5 olarak göster
    if (steps[5]) {
      steps[5].querySelector("h3").textContent = "Adım 5";
      steps[5].querySelector("p").textContent = "Ödemeni Tamamla";
    }
  }

  updateSidebar(currentStep);
}

function handleGiftCardChange() {
  const giftCardYes = document.querySelector(
    'input[name="giftCard"][value="yes"]'
  );
  const newGiftCardState = giftCardYes.checked;

  if (newGiftCardState !== giftCardEnabled) {
    giftCardEnabled = newGiftCardState;
    updateSidebarStructure();
  }
}

function initializeMethodCards() {
  const cards = document.querySelectorAll(".method-card");
  const radioInputs = document.querySelectorAll(
    '.method-card input[type="radio"]'
  );

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      cards.forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");

      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
    });
  });

  radioInputs.forEach((radio) => {
    radio.addEventListener("change", function () {
      cards.forEach((c) => c.classList.remove("selected"));
      this.closest(".method-card").classList.add("selected");
    });
  });
}

function initializeMessageCards() {
  const cards = document.querySelectorAll(".message-card-item");
  const radioInputs = document.querySelectorAll(
    '.message-card-item input[type="radio"]'
  );

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      cards.forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");

      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
    });
  });

  radioInputs.forEach((radio) => {
    radio.addEventListener("change", function () {
      cards.forEach((c) => c.classList.remove("selected"));
      this.closest(".message-card-item").classList.add("selected");
    });
  });
}

function showStep(step) {
  document.querySelectorAll(".step-section").forEach((section) => {
    section.classList.remove("active");
  });

  const currentSection = document.getElementById(`step${step}`);
  if (currentSection) {
    currentSection.classList.add("active");
  }

  updateSidebar(step);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateSidebar(step) {
  document.querySelectorAll(".step-item").forEach((item) => {
    const itemStep = parseInt(item.dataset.step);
    item.classList.remove("active", "completed");

    if (itemStep === step) {
      item.classList.add("active");
    } else if (itemStep < step) {
      item.classList.add("completed");
    }
  });
}

function goToStep(step) {
  if (step >= 1 && step <= 6) {
    // Step 4'e gidilmek isteniyorsa ve hediye kartı kapalıysa, izin verme
    if (step === 4 && !giftCardEnabled) {
      return;
    }

    currentStep = step;
    showStep(step);
  }
}

function nextStep() {
  if (validateStep(currentStep)) {
    if (currentStep < 6) {
      let nextStepNumber = currentStep + 1;

      // Step 3'ten sonra hediye kartı HAYIR ise Step 4'ü (mesaj kartı) atla
      if (currentStep === 3 && !giftCardEnabled) {
        nextStepNumber = 5; // Direkt Step 5'e git (Sipariş Bilgileri)
      }

      currentStep = nextStepNumber;
      showStep(currentStep);
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    let prevStepNumber = currentStep - 1;

    // Step 5'ten geriye giderken hediye kartı HAYIR ise Step 4'ü (mesaj kartı) atla
    if (currentStep === 5 && !giftCardEnabled) {
      prevStepNumber = 3; // Direkt Step 3'e git (Sanatçı Seç)
    }

    currentStep = prevStepNumber;
    showStep(currentStep);
  }
}

function validateStep(step) {
  switch (step) {
    case 1:
      const selectedMethod = document.querySelector(
        '.method-card input[type="radio"]:checked'
      );
      if (!selectedMethod) {
        alert("Lütfen bir tasarım yöntemi seçin.");
        return false;
      }
      return true;

    case 2:
      const bookName = document.getElementById("bookName");
      const bookType = document.getElementById("bookType");

      if (!bookName.value.trim()) {
        alert("Lütfen kitabın adını girin.");
        bookName.focus();
        return false;
      }

      if (!bookType.value) {
        alert("Lütfen kitabın türünü seçin.");
        bookType.focus();
        return false;
      }

      return true;

    case 3:
      if (!selectedArtistId) {
        alert("Lütfen bir sanatçı seçin.");
        return false;
      }
      return true;

    case 4:
      if (giftCardEnabled) {
        const receiverName = document.getElementById("receiverName");
        const senderName = document.getElementById("senderName");
        const messageContent = document.getElementById("messageContent");
        const selectedCard = document.querySelector(
          '.message-card-item input[type="radio"]:checked'
        );

        if (!receiverName || !receiverName.value.trim()) {
          alert("Lütfen alıcı bilgisini girin.");
          if (receiverName) receiverName.focus();
          return false;
        }

        if (!senderName || !senderName.value.trim()) {
          alert("Lütfen gönderen ad soyadını girin.");
          if (senderName) senderName.focus();
          return false;
        }

        if (!messageContent || !messageContent.value.trim()) {
          alert("Lütfen mesaj içeriğini girin.");
          if (messageContent) messageContent.focus();
          return false;
        }

        if (!selectedCard) {
          alert("Lütfen bir mesaj kartı seçin.");
          return false;
        }
      }
      return true;

    case 5:
    case 6:
      return true;

    default:
      return true;
  }
}

// ==========================================
// ARTIST FUNCTIONS
// ==========================================

function loadArtists() {
  const artistsGrid = document.getElementById("artistCardsGrid");
  if (!artistsGrid) return;

  artistsGrid.innerHTML = "";

  // Her zaman sadece 3 sanatçı göster
  displayedArtists.forEach((artist) => {
    const artistCard = createArtistCard(artist);
    artistsGrid.appendChild(artistCard);
  });
}

function createArtistCard(artist) {
  const card = document.createElement("div");
  card.className = "artist-card";
  card.setAttribute("data-artist-id", artist.id);

  const imageContent = artist.available
    ? `<img src="${artist.image}" alt="${artist.name}" />`
    : `<div class="artist-placeholder-text">Sanatçımız şu an uygun değil</div>`;

  card.innerHTML = `
    <div class="artist-card-image ${!artist.available ? "placeholder" : ""}">
      ${imageContent}
    </div>
    <div class="artist-card-content">
      <h3 class="artist-card-name">${artist.name}</h3>
      <p class="artist-card-bio">${artist.bio}</p>
      <a href="#" class="artist-card-status" onclick="handleNotifyClick(event, ${
        artist.id
      })">
        Uygun Olunca Haber Ver
      </a>
    </div>
    <div class="artist-card-radio">
      <input
        type="radio"
        name="artistSelection"
        id="artist-${artist.id}"
        value="${artist.id}"
      />
      <label for="artist-${artist.id}"></label>
    </div>
  `;

  // Click event for card
  card.addEventListener("click", function (e) {
    // "Uygun Olunca Haber Ver" linkine tıklanmışsa kart seçimi yapma
    if (e.target.classList.contains("artist-card-status")) {
      return;
    }

    // Radio'ya tıklanmışsa zaten seçilecek
    if (e.target.type === "radio" || e.target.tagName === "LABEL") {
      return;
    }

    const radio = card.querySelector('input[type="radio"]');
    if (radio) {
      radio.checked = true;
      selectArtist(artist.id);
    }
  });

  // Radio change event
  const radio = card.querySelector('input[type="radio"]');
  if (radio) {
    radio.addEventListener("change", function () {
      if (this.checked) {
        selectArtist(artist.id);
      }
    });
  }

  return card;
}

function selectArtist(artistId) {
  selectedArtistId = artistId;

  // Remove selected class from all cards
  document.querySelectorAll(".artist-card").forEach((card) => {
    card.classList.remove("selected");
  });

  // Add selected class to selected card
  const selectedCard = document.querySelector(
    `.artist-card[data-artist-id="${artistId}"]`
  );
  if (selectedCard) {
    selectedCard.classList.add("selected");
  }

  console.log("Selected artist ID:", artistId);
}

function handleNotifyClick(event, artistId) {
  event.preventDefault();
  event.stopPropagation();

  // Bu kısım backend'de yapılacak
  // Kullanıcının email'ine bildirim kaydı yapılacak
  console.log("Notify request for artist ID:", artistId);

  alert("Sanatçı uygun olduğunda sizi haberdar edeceğiz!");

  // Backend API çağrısı:
  // POST /api/artists/notify
  // Body: { artistId: artistId, userId: currentUser.id }
}

function handleArtistSearch() {
  const searchInput = document.getElementById("artistSearch");
  if (!searchInput) return;

  const searchTerm = searchInput.value.toLowerCase().trim();

  // Backend'e arama isteği atılacak
  // Şimdilik mock data ile çalışıyor
  console.log("Searching for:", searchTerm);

  // Backend API çağrısı:
  // GET /api/artists/recommended?search=${searchTerm}
  // Response olarak her zaman 3 sanatçı dönecek

  // Mock: Şu anki 3 sanatçıyı göster (gerçekte backend'den gelecek)
  loadArtists();
}

// ==========================================
// BILLING & ADDRESS FUNCTIONS
// ==========================================

function toggleBillingAddress() {
  const checkbox = document.getElementById("sameBillingAddress");
  const billingForm = document.getElementById("billingAddressForm");

  if (checkbox.checked) {
    billingForm.style.display = "none";
  } else {
    billingForm.style.display = "block";
  }
}

function toggleBillingFields() {
  const individualRadio = document.querySelector(
    'input[name="billingType"][value="individual"]'
  );
  const taxOfficeField = document.getElementById("taxOfficeField");
  const companyNameField = document.getElementById("companyNameField");

  if (individualRadio && individualRadio.checked) {
    if (taxOfficeField) taxOfficeField.style.display = "none";
    if (companyNameField) companyNameField.style.display = "none";
  } else {
    if (taxOfficeField) taxOfficeField.style.display = "block";
    if (companyNameField) companyNameField.style.display = "block";
  }
}

// ==========================================
// ADDRESS MODAL FUNCTIONS
// ==========================================

function loadAddresses() {
  const addressList = document.getElementById("addressList");
  if (!addressList) return;

  addressList.innerHTML = "";

  mockAddresses.forEach((address, index) => {
    const addressCard = createAddressCard(address, index === 0);
    addressList.appendChild(addressCard);
  });
}

function createAddressCard(address, isChecked = false) {
  const card = document.createElement("div");
  card.className = "address-modal-card";
  card.setAttribute("data-address-id", address.id);

  card.innerHTML = `
    <input
      type="radio"
      name="addressSelection"
      id="addr-${address.id}"
      value="${address.id}"
      class="address-modal-radio"
      ${isChecked ? "checked" : ""}
    />
    <label for="addr-${address.id}" class="address-modal-card-content">
      <div class="address-modal-info">
        <div class="address-modal-header">
          <div class="address-info-row">
            <svg class="address-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span class="address-label">${address.label}</span>
          </div>
          <div class="address-info-row">
            <svg class="address-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="address-recipient">${address.recipient}</span>
          </div>
          <div class="address-info-row">
            <svg class="address-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span class="address-phone">${address.phone}</span>
          </div>
        </div>
        <p class="address-modal-text">${address.fullAddress}</p>
      </div>
      <div class="address-modal-actions">
        <button type="button" class="address-action-btn" onclick="editAddress(${
          address.id
        })" title="Düzenle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button type="button" class="address-action-btn" onclick="deleteAddress(${
          address.id
        })" title="Sil">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </label>
  `;

  return card;
}

function openAddressModal() {
  const modal = document.getElementById("addressModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    const radioToCheck = document.querySelector(
      `input[name="addressSelection"][value="${selectedAddressId}"]`
    );
    if (radioToCheck) {
      radioToCheck.checked = true;
    }
  }
}

function closeAddressModal() {
  const modal = document.getElementById("addressModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function selectAddress() {
  const selectedRadio = document.querySelector(
    'input[name="addressSelection"]:checked'
  );

  if (!selectedRadio) {
    alert("Lütfen bir adres seçin.");
    return;
  }

  const addressId = parseInt(selectedRadio.value);
  const selectedAddress = mockAddresses.find((addr) => addr.id === addressId);

  if (!selectedAddress) {
    alert("Adres bulunamadı.");
    return;
  }

  selectedAddressId = addressId;
  updateSelectedAddressCard(selectedAddress);
  closeAddressModal();
}

function updateSelectedAddressCard(address) {
  const addressCard = document.getElementById("selectedAddressCard");
  if (!addressCard) return;

  addressCard.innerHTML = `
    <div class="address-card-wrapper-purchase">
      <div class="address-card-content-purchase">
        <div class="address-card-header-purchase">
          <div class="address-info-row">
            <svg class="address-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span class="address-label">${address.label}</span>
          </div>
          <div class="address-info-row">
            <svg class="address-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="address-recipient">${address.recipient}</span>
          </div>
          <div class="address-info-row">
            <svg class="address-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span class="address-phone">${address.phone}</span>
          </div>
        </div>
        <p class="address-detail-text">${address.fullAddress}</p>
      </div>
    </div>
  `;
}

function editAddress(addressId) {
  const address = mockAddresses.find((addr) => addr.id === addressId);
  if (!address) {
    alert("Adres bulunamadı.");
    return;
  }

  editingAddressId = addressId;
  openAddressFormModal(address);
}

function deleteAddress(addressId) {
  if (!confirm("Bu adresi silmek istediğinizden emin misiniz?")) {
    return;
  }

  const index = mockAddresses.findIndex((addr) => addr.id === addressId);
  if (index !== -1) {
    mockAddresses.splice(index, 1);
    loadAddresses();

    if (selectedAddressId === addressId && mockAddresses.length > 0) {
      selectedAddressId = mockAddresses[0].id;
      updateSelectedAddressCard(mockAddresses[0]);
    }

    console.log("Address deleted:", addressId);
  }
}

function openAddressFormModal(address = null) {
  closeAddressModal();

  const modal = document.getElementById("addressFormModal");
  const form = document.getElementById("addressForm");
  const title = document.getElementById("addressFormTitle");

  if (!modal || !form) return;

  if (address) {
    title.textContent = "Adres Düzenle";
    fillAddressForm(address);
  } else {
    title.textContent = "Adres Ekle";
    form.reset();
    editingAddressId = null;
    toggleAddressTypeFields();
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeAddressFormModal() {
  const modal = document.getElementById("addressFormModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    editingAddressId = null;
  }
}

function fillAddressForm(address) {
  document.getElementById("formFirstName").value = address.firstName || "";
  document.getElementById("formLastName").value = address.lastName || "";
  document.getElementById("formPhone").value = address.phone || "";
  document.getElementById("formCity").value = address.city || "";
  document.getElementById("formDistrict").value = address.district || "";
  document.getElementById("formNeighborhood").value =
    address.neighborhood || "";
  document.getElementById("formAddress").value = address.address || "";
  document.getElementById("formAddressLabel").value = address.label || "";

  const addressTypeRadio = document.querySelector(
    `input[name="formAddressType"][value="${address.addressType}"]`
  );
  if (addressTypeRadio) {
    addressTypeRadio.checked = true;
    toggleAddressTypeFields();
  }

  if (address.addressType === "individual") {
    document.getElementById("formTcNumber").value = address.tcNumber || "";
  } else {
    document.getElementById("formTaxOffice").value = address.taxOffice || "";
    document.getElementById("formTaxNumber").value = address.taxNumber || "";
    document.getElementById("formCompanyName").value =
      address.companyName || "";
  }
}

function saveAddress(event) {
  event.preventDefault();

  const formData = {
    id: editingAddressId || nextAddressId++,
    firstName: document.getElementById("formFirstName").value.trim(),
    lastName: document.getElementById("formLastName").value.trim(),
    phone: document.getElementById("formPhone").value.trim(),
    city: document.getElementById("formCity").value,
    district: document.getElementById("formDistrict").value,
    neighborhood: document.getElementById("formNeighborhood").value,
    address: document.getElementById("formAddress").value.trim(),
    label: document.getElementById("formAddressLabel").value.trim(),
    addressType: document.querySelector('input[name="formAddressType"]:checked')
      .value,
  };

  if (formData.addressType === "individual") {
    formData.tcNumber = document.getElementById("formTcNumber").value.trim();
  } else {
    formData.taxOffice = document.getElementById("formTaxOffice").value.trim();
    formData.taxNumber = document.getElementById("formTaxNumber").value.trim();
    formData.companyName = document
      .getElementById("formCompanyName")
      .value.trim();
  }

  formData.recipient = `${formData.firstName} ${formData.lastName}`;

  const cityName = getCityName(formData.city);
  const districtName = getDistrictName(formData.district);
  formData.fullAddress = `${formData.address}, ${districtName} / ${cityName}, Türkiye`;

  if (editingAddressId) {
    const index = mockAddresses.findIndex(
      (addr) => addr.id === editingAddressId
    );
    if (index !== -1) {
      mockAddresses[index] = formData;
      console.log("Address updated:", formData);
    }
  } else {
    mockAddresses.push(formData);
    console.log("Address added:", formData);
  }

  loadAddresses();
  closeAddressFormModal();
  openAddressModal();
}

function getCityName(cityValue) {
  const cities = {
    ankara: "Ankara",
    istanbul: "İstanbul",
    izmir: "İzmir",
    mugla: "Muğla",
  };
  return cities[cityValue] || cityValue;
}

function getDistrictName(districtValue) {
  const districts = {
    cankaya: "Çankaya",
    kizilay: "Kızılay",
    bodrum: "Bodrum",
  };
  return districts[districtValue] || districtValue;
}

function backToAddressList() {
  closeAddressFormModal();
  openAddressModal();
}

function toggleAddressTypeFields() {
  const individualRadio = document.querySelector(
    'input[name="formAddressType"][value="individual"]'
  );
  const tcField = document.getElementById("formTcField");
  const taxOfficeField = document.getElementById("formTaxOfficeField");
  const taxNumberField = document.getElementById("formTaxNumberField");
  const companyNameField = document.getElementById("formCompanyNameField");

  if (individualRadio && individualRadio.checked) {
    if (tcField) {
      tcField.style.display = "block";
      document.getElementById("formTcNumber").required = true;
    }
    if (taxOfficeField) {
      taxOfficeField.style.display = "none";
      document.getElementById("formTaxOffice").required = false;
    }
    if (taxNumberField) {
      taxNumberField.style.display = "none";
      document.getElementById("formTaxNumber").required = false;
    }
    if (companyNameField) {
      companyNameField.style.display = "none";
      document.getElementById("formCompanyName").required = false;
    }
  } else {
    if (tcField) {
      tcField.style.display = "none";
      document.getElementById("formTcNumber").required = false;
    }
    if (taxOfficeField) {
      taxOfficeField.style.display = "block";
      document.getElementById("formTaxOffice").required = true;
    }
    if (taxNumberField) {
      taxNumberField.style.display = "block";
      document.getElementById("formTaxNumber").required = true;
    }
    if (companyNameField) {
      companyNameField.style.display = "block";
      document.getElementById("formCompanyName").required = true;
    }
  }
}

// Modal close events
document.addEventListener("click", function (e) {
  const addressModal = document.getElementById("addressModal");
  const formModal = document.getElementById("addressFormModal");

  if (addressModal && e.target === addressModal) {
    closeAddressModal();
  }

  if (formModal && e.target === formModal) {
    closeAddressFormModal();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const addressModal = document.getElementById("addressModal");
    const formModal = document.getElementById("addressFormModal");

    if (formModal && formModal.classList.contains("active")) {
      closeAddressFormModal();
    } else if (addressModal && addressModal.classList.contains("active")) {
      closeAddressModal();
    }
  }
});

// ==========================================
// PAYMENT FUNCTIONS
// ==========================================

function initializePaymentInputs() {
  const cardNumberInput = document.getElementById("cardNumber");
  const cvvInput = document.getElementById("cvv");

  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function () {
      formatCardNumber(this);
    });
  }

  if (cvvInput) {
    cvvInput.addEventListener("input", function () {
      formatCVV(this);
    });
  }
}

function formatCardNumber(input) {
  let value = input.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  let formattedValue = value.match(/.{1,4}/g)?.join("-") || value;
  input.value = formattedValue;
}

function formatCVV(input) {
  input.value = input.value.replace(/[^0-9]/g, "");
}

function submitPayment() {
  const form = document.getElementById("paymentForm");

  if (!form) {
    alert("Form bulunamadı.");
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const agreement1 = form.querySelector(
    '.payment-agreements input[type="checkbox"][required]'
  );
  if (agreement1 && !agreement1.checked) {
    alert("Lütfen sözleşmeleri onaylayın.");
    return;
  }

  const paymentData = {
    cardNumber: document.getElementById("cardNumber").value,
    cardHolder: document.getElementById("cardHolder").value,
    expiryMonth: document.getElementById("expiryMonth").value,
    expiryYear: document.getElementById("expiryYear").value,
    cvv: document.getElementById("cvv").value,
  };

  console.log("Payment data:", paymentData);
  alert("Ödeme işlemi başarıyla tamamlandı! (Bu bir test mesajıdır)");
}

// Export functions
window.nextStep = nextStep;
window.prevStep = prevStep;
window.goToStep = goToStep;
window.handleGiftCardChange = handleGiftCardChange;
window.toggleBillingAddress = toggleBillingAddress;
window.toggleBillingFields = toggleBillingFields;
window.openAddressModal = openAddressModal;
window.closeAddressModal = closeAddressModal;
window.selectAddress = selectAddress;
window.editAddress = editAddress;
window.deleteAddress = deleteAddress;
window.openAddressFormModal = openAddressFormModal;
window.closeAddressFormModal = closeAddressFormModal;
window.saveAddress = saveAddress;
window.backToAddressList = backToAddressList;
window.toggleAddressTypeFields = toggleAddressTypeFields;
window.submitPayment = submitPayment;
window.handleArtistSearch = handleArtistSearch;
window.selectArtist = selectArtist;
window.handleNotifyClick = handleNotifyClick;
