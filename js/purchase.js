// Purchase Page JavaScript

let currentStep = 1;
let totalSteps = 5; // Her zaman 5 adım
let giftCardEnabled = false;

// MOCK DATA - Adresler (Backend entegrasyonunda silinecek)
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

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  initializeSteps();
  initializeMethodCards();
  initializeFileUpload();
  initializeMessageCards();
  loadAddresses();
  initializePaymentInputs();
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

  // Her zaman 5 adım olsun
  if (stepIndicator.children.length === 4) {
    // 5. adımı ekle
    const step5 = document.createElement("div");
    step5.className = "step-item";
    step5.setAttribute("data-step", "5");
    step5.innerHTML = `
      <div class="step-number">5</div>
      <div class="step-content">
        <h3>Adım 5</h3>
        <p>Ödemeni Tamamla</p>
      </div>
    `;
    stepIndicator.appendChild(step5);

    step5.addEventListener("click", function () {
      const step = parseInt(this.dataset.step);
      if (step <= currentStep) {
        goToStep(step);
      }
    });
  }

  const steps = stepIndicator.querySelectorAll(".step-item");

  if (giftCardEnabled) {
    // Hediye kartı EVET: Step 3 = Mesaj Kartı
    steps[2].querySelector("p").textContent = "Mesaj Kartını Seç";
  } else {
    // Hediye kartı HAYIR: Step 3'ü atla (görünmez yap)
    steps[2].querySelector("p").textContent = "Mesaj Kartını Seç";
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

function initializeFileUpload() {
  const uploadArea = document.getElementById("fileUploadArea");
  if (!uploadArea) return;

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, () => {
      uploadArea.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, () => {
      uploadArea.classList.remove("dragover");
    });
  });

  uploadArea.addEventListener("drop", handleDrop);
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

function triggerFileInput() {
  document.getElementById("fileInput").click();
}

function handleFileSelect(event) {
  const files = event.target.files;
  handleFiles(files);
}

function handleFiles(files) {
  if (files.length === 0) return;

  const file = files[0];
  const maxSize = 50 * 1024 * 1024;

  if (file.size > maxSize) {
    alert("Dosya boyutu 50MB'dan küçük olmalıdır.");
    return;
  }

  displayFile(file);
}

function displayFile(file) {
  const preview = document.getElementById("filePreview");
  preview.innerHTML = "";
  preview.classList.add("active");

  const fileItem = document.createElement("div");
  fileItem.className = "file-item";

  const fileSize = formatFileSize(file.size);

  fileItem.innerHTML = `
    <div class="file-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
        <polyline points="13 2 13 9 20 9"></polyline>
      </svg>
    </div>
    <div class="file-info">
      <div class="file-name">${file.name}</div>
      <div class="file-size">${fileSize}</div>
    </div>
    <button type="button" class="file-remove" onclick="removeFile()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  preview.appendChild(fileItem);
}

function removeFile() {
  const preview = document.getElementById("filePreview");
  preview.innerHTML = "";
  preview.classList.remove("active");
  document.getElementById("fileInput").value = "";
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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
  if (step >= 1 && step <= totalSteps) {
    currentStep = step;
    showStep(step);
  }
}

function nextStep() {
  if (validateStep(currentStep)) {
    if (currentStep < totalSteps) {
      let nextStepNumber = currentStep + 1;

      // Hediye kartı HAYIR ise step 3'ü (mesaj kartı) atla
      if (currentStep === 2 && !giftCardEnabled && nextStepNumber === 3) {
        nextStepNumber = 4; // Direkt step 4'e (sipariş bilgileri) git
      }

      currentStep = nextStepNumber;
      showStep(currentStep);
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    let prevStepNumber = currentStep - 1;

    // Hediye kartı HAYIR ise step 3'ü (mesaj kartı) atla
    if (currentStep === 4 && !giftCardEnabled && prevStepNumber === 3) {
      prevStepNumber = 2; // Direkt step 2'ye (bilgiler) git
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

    case 4:
    case 5:
      return true;

    default:
      return true;
  }
}

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
// ADDRESS SELECTION MODAL FUNCTIONS
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

// ==========================================
// ADDRESS FORM MODAL FUNCTIONS
// ==========================================

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
    // Default olarak bireysel seçili
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

  // Bireysel veya Kurumsal bilgileri doldur
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

  // Bireysel veya Kurumsal bilgileri kaydet
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
    // Bireysel: Sadece TC Kimlik No göster
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
    // Kurumsal: Vergi Dairesi, VKN, Firma Adı göster
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

// Modal dışına tıklanınca kapat
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

// ESC tuşu ile modal kapat
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

// Export functions
window.nextStep = nextStep;
window.prevStep = prevStep;
window.goToStep = goToStep;
window.handleGiftCardChange = handleGiftCardChange;
window.triggerFileInput = triggerFileInput;
window.handleFileSelect = handleFileSelect;
window.removeFile = removeFile;
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

// Kart numarası formatla (XXXX-XXXX-XXXX-XXXX)
function formatCardNumber(input) {
  let value = input.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  let formattedValue = value.match(/.{1,4}/g)?.join("-") || value;
  input.value = formattedValue;
}

// CVV sadece rakam
function formatCVV(input) {
  input.value = input.value.replace(/[^0-9]/g, "");
}

// Ödeme işlemi
function submitPayment() {
  const form = document.getElementById("paymentForm");

  if (!form) {
    alert("Form bulunamadı.");
    return;
  }

  // Form validasyonu
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Sözleşme onayı kontrolü
  const agreement1 = form.querySelector(
    '.payment-agreements input[type="checkbox"][required]'
  );
  if (agreement1 && !agreement1.checked) {
    alert("Lütfen sözleşmeleri onaylayın.");
    return;
  }

  // Ödeme bilgilerini topla
  const paymentData = {
    cardNumber: document.getElementById("cardNumber").value,
    cardHolder: document.getElementById("cardHolder").value,
    expiryMonth: document.getElementById("expiryMonth").value,
    expiryYear: document.getElementById("expiryYear").value,
    cvv: document.getElementById("cvv").value,
    installment: document.querySelector('input[name="installment"]:checked')
      .value,
  };

  console.log("Payment data:", paymentData);

  // TODO: Backend'e gönderilecek
  alert("Ödeme işlemi başarıyla tamamlandı! (Bu bir test mesajıdır)");

  // Başarılı ödeme sonrası yönlendirme yapılabilir
  // window.location.href = "/order-success";
}
