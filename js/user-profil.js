// ==========================================
// USER PROFILE PAGE JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // NOTE: Language & Profile Dropdowns
  // ==========================================
  // Handled by base.js - no need to duplicate here

  // ==========================================
  // PHONE INPUT MASK
  // ==========================================

  const phoneInput = document.getElementById("phoneInput");

  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Sadece rakamlar

    // 10 haneden fazla girişi engelle
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    // Format: 5XX XXX XX XX
    let formatted = "";
    if (value.length > 0) {
      formatted = value.slice(0, 3);
    }
    if (value.length > 3) {
      formatted += " " + value.slice(3, 6);
    }
    if (value.length > 6) {
      formatted += " " + value.slice(6, 8);
    }
    if (value.length > 8) {
      formatted += " " + value.slice(8, 10);
    }

    e.target.value = formatted;
  });

  // Sadece rakam girişine izin ver
  phoneInput.addEventListener("keypress", function (e) {
    if (!/\d/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }
  });

  // ==========================================
  // VERIFY PHONE BUTTON
  // ==========================================

  const verifyPhoneBtn = document.getElementById("verifyPhoneBtn");
  const otpModal = document.getElementById("otpModal");
  const closeModal = document.getElementById("closeModal");
  const maskedPhone = document.getElementById("maskedPhone");

  verifyPhoneBtn.addEventListener("click", function () {
    const phone = phoneInput.value.replace(/\s/g, "");

    // Telefon numarası boş mu kontrolü
    if (phone.length === 0) {
      alert("Lütfen telefon numaranızı giriniz");
      return;
    }

    // Telefon numarası kontrolü
    if (phone.length !== 10) {
      alert("Lütfen geçerli bir telefon numarası giriniz (10 hane)");
      return;
    }

    if (!phone.startsWith("5")) {
      alert("Telefon numarası 5 ile başlamalıdır");
      return;
    }

    // İlk 3 hanesini göster
    maskedPhone.textContent = phone.slice(0, 3);

    // Modal'ı aç
    otpModal.classList.add("active");

    // Timer'ı başlat
    startTimer();

    // İlk OTP input'una focus yap
    document.querySelector(".otp-input").focus();

    // Mock: Backend'e SMS gönderildi mesajı (Console'da)
    console.log("SMS sent to: 0" + phone);
    console.log("OTP Code (Mock): 1234"); // Geliştirme için
  });

  // Modal kapatma
  closeModal.addEventListener("click", function () {
    closeOtpModal();
  });

  // Modal dışına tıklayınca kapat
  otpModal.addEventListener("click", function (e) {
    if (e.target === otpModal) {
      closeOtpModal();
    }
  });

  function closeOtpModal() {
    otpModal.classList.remove("active");
    clearOtpInputs();
    stopTimer();
  }

  // ==========================================
  // OTP INPUTS
  // ==========================================

  const otpInputs = document.querySelectorAll(".otp-input");

  otpInputs.forEach((input, index) => {
    // Sadece rakam girişi
    input.addEventListener("input", function (e) {
      const value = e.target.value;

      // Sadece rakam kabul et
      if (!/^\d$/.test(value)) {
        e.target.value = "";
        return;
      }

      // Otomatik sonraki input'a geç
      if (value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    // Backspace ile önceki input'a geç
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });

    // Paste event'i handle et
    input.addEventListener("paste", function (e) {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

      if (pastedData.length === 4) {
        otpInputs.forEach((inp, idx) => {
          inp.value = pastedData[idx] || "";
        });
        otpInputs[3].focus();
      }
    });
  });

  function clearOtpInputs() {
    otpInputs.forEach((input) => (input.value = ""));
  }

  function getOtpValue() {
    return Array.from(otpInputs)
      .map((input) => input.value)
      .join("");
  }

  // ==========================================
  // OTP VERIFICATION
  // ==========================================

  const verifyOtpBtn = document.getElementById("verifyOtpBtn");

  verifyOtpBtn.addEventListener("click", function () {
    const otpCode = getOtpValue();

    if (otpCode.length !== 4) {
      alert("Lütfen 4 haneli kodu giriniz");
      return;
    }

    // Mock: Backend OTP doğrulaması (Şimdilik her kod kabul edilir)
    console.log("Verifying OTP:", otpCode);

    // Başarılı doğrulama simülasyonu
    setTimeout(() => {
      alert("Telefon numaranız başarıyla doğrulandı!");
      closeOtpModal();

      // Telefon input'unu readonly yap ve yeşil border ver
      phoneInput.readOnly = true;
      phoneInput.style.borderColor = "#659e36";
      phoneInput.style.backgroundColor = "#f0f8f0";

      // Doğrula butonunu gizle
      verifyPhoneBtn.style.display = "none";

      // Success icon ekle (opsiyonel)
      const successIcon = document.createElement("span");
      successIcon.innerHTML = "✓";
      successIcon.style.cssText =
        "color: #659e36; font-size: 20px; font-weight: bold;";
      verifyPhoneBtn.parentNode.appendChild(successIcon);
    }, 500);
  });

  // ==========================================
  // TIMER (90 SECONDS)
  // ==========================================

  let timerInterval;
  const timerElement = document.getElementById("timer");
  const resendBtn = document.getElementById("resendBtn");

  function startTimer() {
    let timeLeft = 90; // 90 saniye (1:30)

    resendBtn.disabled = true;

    timerInterval = setInterval(() => {
      timeLeft--;

      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;

      timerElement.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      if (timeLeft <= 0) {
        stopTimer();
        resendBtn.disabled = false;
        timerElement.textContent = "";
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // ==========================================
  // RESEND OTP
  // ==========================================

  resendBtn.addEventListener("click", function () {
    if (!resendBtn.disabled) {
      console.log("Resending OTP...");
      alert("Yeni doğrulama kodu gönderildi!");
      clearOtpInputs();
      startTimer();
      document.querySelector(".otp-input").focus();
    }
  });

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const profileForm = document.getElementById("profileForm");

  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const phone = phoneInput.value.replace(/\s/g, "");

    // Telefon girilmişse ama doğrulanmamışsa uyar
    if (phone.length > 0 && !phoneInput.readOnly) {
      alert("Telefon numaranızı doğrulamak ister misiniz? (İsteğe bağlı)");
      // Kullanıcı yine de kaydedebilir, sadece bilgilendirme
    }

    // Mock: Backend'e form gönderimi
    const formData = {
      phone: phoneInput.readOnly ? phone : null, // Doğrulanmışsa gönder
      phoneVerified: phoneInput.readOnly,
    };

    console.log("Saving profile...", formData);

    // Başarılı kayıt simülasyonu
    setTimeout(() => {
      alert("Profiliniz başarıyla güncellendi!");
    }, 500);
  });

  // ==========================================
  // PROFILE PHOTO ACTIONS (Static - Just for UX)
  // ==========================================

  const photoActionAdd = document.querySelector(".photo-action-link.add");
  const photoActionRemove = document.querySelector(".photo-action-link.remove");

  // Bu butonlar şimdilik sadece alert gösterir
  // Backend entegrasyonunda gerçek upload/remove işlemleri yapılacak

  photoActionAdd.addEventListener("click", function () {
    alert("Profil fotoğrafı yükleme özelliği yakında eklenecek!");
  });

  photoActionRemove.addEventListener("click", function () {
    alert("Profil fotoğrafı kaldırma özelliği yakında eklenecek!");
  });
});
// ==========================================
// ORDERS PAGE JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the orders page by checking if modals exist
  const cancelModal = document.getElementById("cancelModal");

  // If cancel modal doesn't exist, we're not on orders page
  if (!cancelModal) return;

  // ==========================================
  // MODAL ELEMENTS
  // ==========================================

  const reasonModal = document.getElementById("reasonModal");
  const successModal = document.getElementById("successModal");

  const closeCancelModal = document.getElementById("closeCancelModal");
  const closeReasonModal = document.getElementById("closeReasonModal");
  const closeSuccessModal = document.getElementById("closeSuccessModal");

  const cancelNo = document.getElementById("cancelNo");
  const cancelYes = document.getElementById("cancelYes");

  const skipReason = document.getElementById("skipReason");
  const submitReason = document.getElementById("submitReason");

  const cancelReason = document.getElementById("cancelReason");

  let currentOrderId = null;

  console.log("Orders page JavaScript loaded");
  console.log(
    "Cancel buttons found:",
    document.querySelectorAll(".cancel-btn").length
  );

  // ==========================================
  // CANCEL ORDER FLOW
  // ==========================================

  // Step 1: Click "İptal Et" button
  const cancelButtons = document.querySelectorAll(".cancel-btn");
  cancelButtons.forEach((button) => {
    button.addEventListener("click", function () {
      currentOrderId = this.getAttribute("data-order-id");
      console.log("Cancel order requested:", currentOrderId);
      openModal(cancelModal);
    });
  });

  // Step 2: Confirm cancellation
  cancelYes.addEventListener("click", function () {
    closeModal(cancelModal);
    // Open reason modal after a short delay
    setTimeout(() => {
      openModal(reasonModal);
    }, 300);
  });

  // Step 2b: Cancel the cancellation
  cancelNo.addEventListener("click", function () {
    closeModal(cancelModal);
    currentOrderId = null;
  });

  // Step 3a: Submit cancellation reason
  submitReason.addEventListener("click", function () {
    const reason = cancelReason.value.trim();

    if (reason.length === 0) {
      alert("Lütfen bir neden giriniz");
      return;
    }

    // Mock: Send cancellation to backend
    console.log("Order cancelled:", currentOrderId);
    console.log("Reason:", reason);

    // Simulate API call
    setTimeout(() => {
      closeModal(reasonModal);
      cancelReason.value = ""; // Clear textarea

      // Show success modal
      setTimeout(() => {
        openModal(successModal);

        // Auto-close success modal after 3 seconds
        setTimeout(() => {
          closeModal(successModal);
          currentOrderId = null;

          // Optionally: Remove the cancelled order from the page
          // Or update its status
        }, 3000);
      }, 300);
    }, 500);
  });

  // Step 3b: Skip reason
  skipReason.addEventListener("click", function () {
    // Mock: Send cancellation without reason
    console.log("Order cancelled without reason:", currentOrderId);

    closeModal(reasonModal);
    cancelReason.value = ""; // Clear textarea

    // Show success modal
    setTimeout(() => {
      openModal(successModal);

      // Auto-close success modal after 3 seconds
      setTimeout(() => {
        closeModal(successModal);
        currentOrderId = null;
      }, 3000);
    }, 300);
  });

  // ==========================================
  // MODAL CLOSE BUTTONS
  // ==========================================

  closeCancelModal.addEventListener("click", function () {
    closeModal(cancelModal);
    currentOrderId = null;
  });

  closeReasonModal.addEventListener("click", function () {
    closeModal(reasonModal);
    cancelReason.value = "";
  });

  closeSuccessModal.addEventListener("click", function () {
    closeModal(successModal);
    currentOrderId = null;
  });

  // Close modals when clicking outside
  [cancelModal, reasonModal, successModal].forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal(modal);
        if (modal === cancelModal || modal === reasonModal) {
          currentOrderId = null;
        }
        if (modal === reasonModal) {
          cancelReason.value = "";
        }
      }
    });
  });

  // ==========================================
  // PREVIEW BUTTONS
  // ==========================================

  const previewButtons = document.querySelectorAll(".preview-btn");
  previewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Mock: Open order preview
      alert("Önizleme özelliği yakında eklenecek!");
    });
  });

  // ==========================================
  // TRACKING ACTION BUTTON
  // ==========================================

  const trackingButtons = document.querySelectorAll(".tracking-action-btn");
  trackingButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Mock: Open cargo tracking
      alert("Kargo takip özelliği yakında eklenecek!");
    });
  });

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  function openModal(modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }

  function closeModal(modal) {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }

  // Close modals on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (cancelModal.classList.contains("active")) {
        closeModal(cancelModal);
        currentOrderId = null;
      }
      if (reasonModal.classList.contains("active")) {
        closeModal(reasonModal);
        cancelReason.value = "";
      }
      if (successModal.classList.contains("active")) {
        closeModal(successModal);
        currentOrderId = null;
      }
    }
  });
});
// ==========================================
// PASSWORD PAGE JAVASCRIPT - FINAL VERSION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the password page
  const passwordForm = document.getElementById("passwordForm");

  if (!passwordForm) return;

  console.log("Password page JavaScript loaded");

  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  // ==========================================
  // PASSWORD STRENGTH VALIDATION
  // ==========================================

  const passwordRules = {
    length: (password) => password.length >= 8,
    complexity: (password) => {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      return hasUpperCase && hasNumber && hasSpecialChar;
    },
  };

  // Update strength indicators
  function updateStrengthIndicators() {
    const password = newPasswordInput.value;
    const strengthItems = document.querySelectorAll(".strength-item");

    strengthItems.forEach((item) => {
      const rule = item.getAttribute("data-rule");

      if (passwordRules[rule] && passwordRules[rule](password)) {
        item.classList.add("valid");
      } else {
        item.classList.remove("valid");
      }
    });
  }

  // Check all requirements are met
  function isPasswordValid() {
    const password = newPasswordInput.value;
    return Object.values(passwordRules).every((rule) => rule(password));
  }

  if (newPasswordInput) {
    newPasswordInput.addEventListener("input", updateStrengthIndicators);
  }

  // ==========================================
  // FORM SUBMISSION
  // ==========================================

  passwordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    if (!oldPassword) {
      if (typeof showMessage === "function") {
        showMessage("Lütfen eski şifrenizi giriniz", "error");
      } else {
        alert("Lütfen eski şifrenizi giriniz");
      }
      return;
    }

    if (!newPassword) {
      if (typeof showMessage === "function") {
        showMessage("Lütfen yeni şifrenizi giriniz", "error");
      } else {
        alert("Lütfen yeni şifrenizi giriniz");
      }
      return;
    }

    if (!isPasswordValid()) {
      if (typeof showMessage === "function") {
        showMessage(
          "Yeni şifreniz güvenlik gereksinimlerini karşılamıyor",
          "error"
        );
      } else {
        alert("Yeni şifreniz güvenlik gereksinimlerini karşılamıyor");
      }
      return;
    }

    if (!confirmPassword) {
      if (typeof showMessage === "function") {
        showMessage("Lütfen yeni şifrenizi tekrar giriniz", "error");
      } else {
        alert("Lütfen yeni şifrenizi tekrar giriniz");
      }
      return;
    }

    if (newPassword !== confirmPassword) {
      if (typeof showMessage === "function") {
        showMessage("Yeni şifreler eşleşmiyor", "error");
      } else {
        alert("Yeni şifreler eşleşmiyor");
      }
      return;
    }

    if (oldPassword === newPassword) {
      if (typeof showMessage === "function") {
        showMessage("Yeni şifre eski şifreden farklı olmalıdır", "warning");
      } else {
        alert("Yeni şifre eski şifreden farklı olmalıdır");
      }
      return;
    }

    // Mock: Send to backend
    console.log("Password change requested");
    console.log("Old password:", oldPassword);
    console.log("New password:", newPassword);

    // Simulate API call
    setTimeout(() => {
      if (typeof showMessage === "function") {
        showMessage("Şifreniz başarıyla değiştirildi!", "success");
      } else {
        alert("Şifreniz başarıyla değiştirildi!");
      }

      // Clear form
      passwordForm.reset();

      // Reset strength indicators
      const strengthItems = document.querySelectorAll(".strength-item");
      strengthItems.forEach((item) => item.classList.remove("valid"));
    }, 500);
  });

  // ==========================================
  // REAL-TIME PASSWORD MATCH CHECK
  // ==========================================

  if (confirmPasswordInput && newPasswordInput) {
    confirmPasswordInput.addEventListener("input", function () {
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (confirmPassword.length > 0) {
        if (newPassword === confirmPassword) {
          confirmPasswordInput.style.borderColor = "#4caf50";
        } else {
          confirmPasswordInput.style.borderColor = "#e74c3c";
        }
      } else {
        confirmPasswordInput.style.borderColor = "";
      }
    });
  }
});
// ==========================================
// ADDRESSES PAGE JAVASCRIPT - COMPLETE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  const addressListView = document.getElementById("addressListView");
  const addressFormView = document.getElementById("addressFormView");

  if (!addressListView || !addressFormView) return;

  const addAddressBtn = document.getElementById("addAddressBtn");
  const backBtn = document.getElementById("backBtn");
  const addressForm = document.getElementById("addressForm");

  let isEditMode = false;
  let currentEditId = null;

  // ==========================================
  // FORM DATA STRUCTURE
  // ==========================================

  // İl-İlçe-Mahalle Hiyerarşisi
  const locationData = {
    ankara: {
      districts: {
        cankaya: ["Çayyolu", "Ümitköy", "Alacaatlı", "Yaşamkent", "Kızılay"],
        kecioren: ["Etlik", "Bağlum", "Kalaba", "Şentepe", "Ayvalı"],
        yenimahalle: ["Demetevler", "Batıkent", "Ergazi", "Kardelen", "İvedik"],
        mamak: ["Akdere", "Ege", "Harman", "Boğaziçi", "Ege"],
        etimesgut: ["Eryaman", "Elvankent", "Güzelkent", "Tunahan", "Bağlıca"],
      },
    },
    istanbul: {
      districts: {
        kadikoy: ["Moda", "Fenerbahçe", "Göztepe", "Caddebostan", "Bostancı"],
        besiktas: ["Levent", "Etiler", "Bebek", "Ortaköy", "Arnavutköy"],
        sisli: [
          "Mecidiyeköy",
          "Gayrettepe",
          "Osmanbey",
          "Halaskargazi",
          "Teşvikiye",
        ],
        uskudar: [
          "Kısıklı",
          "Beylerbeyi",
          "Çengelköy",
          "Kandilli",
          "Altunizade",
        ],
        beyoglu: ["Taksim", "Cihangir", "Galata", "Karaköy", "Şişhane"],
      },
    },
    izmir: {
      districts: {
        konak: ["Alsancak", "Basmane", "Göztepe", "Hatay", "Kahramanlar"],
        karsiyaka: [
          "Bostanlı",
          "Mavişehir",
          "Çiğli",
          "Karşıyaka Merkez",
          "Yamanlar",
        ],
        bornova: ["Erzene", "Kazımdirik", "Atatürk", "Evka", "Çamdibi"],
        buca: ["İnönü", "Kozağaç", "Adatepe", "Yaylacık", "Kuruçeşme"],
        cigli: ["Atatürk", "Balatçık", "Harmandalı", "Kalecik", "Pınarbaşı"],
      },
    },
  };

  // ==========================================
  // PHONE MASKING
  // ==========================================

  const phoneInput = document.getElementById("phoneNumber");

  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      if (value.length > 10) {
        value = value.slice(0, 10);
      }

      let formatted = "";
      if (value.length > 0) {
        formatted = "(" + value.slice(0, 3);
      }
      if (value.length > 3) {
        formatted += ")" + value.slice(3, 6);
      }
      if (value.length > 6) {
        formatted += " " + value.slice(6, 8);
      }
      if (value.length > 8) {
        formatted += " " + value.slice(8, 10);
      }

      e.target.value = formatted;
    });

    phoneInput.addEventListener("keypress", function (e) {
      if (!/\d/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
        e.preventDefault();
      }
    });
  }

  // ==========================================
  // LOCATION DROPDOWNS (İL-İLÇE-MAHALLE)
  // ==========================================

  const citySelect = document.getElementById("citySelect");
  const districtSelect = document.getElementById("districtSelect");
  const neighborhoodSelect = document.getElementById("neighborhoodSelect");

  // İl seçildiğinde İlçeleri yükle
  citySelect.addEventListener("change", function () {
    const selectedCity = this.value;

    // İlçe dropdown'unu sıfırla
    districtSelect.innerHTML = '<option value="">İlçe seçiniz</option>';
    districtSelect.disabled = !selectedCity;

    // Mahalle dropdown'unu sıfırla
    neighborhoodSelect.innerHTML = '<option value="">Mahalle seçiniz</option>';
    neighborhoodSelect.disabled = true;

    if (selectedCity && locationData[selectedCity]) {
      const districts = locationData[selectedCity].districts;
      Object.keys(districts).forEach((districtKey) => {
        const option = document.createElement("option");
        option.value = districtKey;
        option.textContent =
          districtKey.charAt(0).toUpperCase() + districtKey.slice(1);
        districtSelect.appendChild(option);
      });
    }
  });

  // İlçe seçildiğinde Mahalleleri yükle
  districtSelect.addEventListener("change", function () {
    const selectedCity = citySelect.value;
    const selectedDistrict = this.value;

    // Mahalle dropdown'unu sıfırla
    neighborhoodSelect.innerHTML = '<option value="">Mahalle seçiniz</option>';
    neighborhoodSelect.disabled = !selectedDistrict;

    if (
      selectedCity &&
      selectedDistrict &&
      locationData[selectedCity]?.districts[selectedDistrict]
    ) {
      const neighborhoods =
        locationData[selectedCity].districts[selectedDistrict];
      neighborhoods.forEach((neighborhood) => {
        const option = document.createElement("option");
        option.value = neighborhood.toLowerCase();
        option.textContent = neighborhood;
        neighborhoodSelect.appendChild(option);
      });
    }
  });

  // ==========================================
  // VIEW SWITCHING
  // ==========================================

  function showAddressForm(editMode = false, addressId = null) {
    addressListView.style.display = "none";
    addressFormView.style.display = "block";

    isEditMode = editMode;
    currentEditId = addressId;

    const formTitle = addressFormView.querySelector(".profile-title");
    formTitle.textContent = editMode ? "Adres Düzenle" : "Adres Ekle";

    if (editMode && addressId) {
      populateFormForEdit(addressId);
    } else {
      addressForm.reset();
      districtSelect.disabled = true;
      neighborhoodSelect.disabled = true;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showAddressList() {
    addressFormView.style.display = "none";
    addressListView.style.display = "block";

    addressForm.reset();
    districtSelect.disabled = true;
    neighborhoodSelect.disabled = true;
    isEditMode = false;
    currentEditId = null;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  addAddressBtn.addEventListener("click", function (e) {
    e.preventDefault();
    showAddressForm(false);
  });

  backBtn.addEventListener("click", function () {
    showAddressList();
  });

  // ==========================================
  // EDIT ADDRESS
  // ==========================================

  function attachEditListeners() {
    const editButtons = document.querySelectorAll(".address-action-btn.edit");
    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const addressId = this.getAttribute("data-address-id");
        showAddressForm(true, addressId);
      });
    });
  }

  function populateFormForEdit(addressId) {
    const addressCard = document.querySelector(
      `.address-card-new[data-address-id="${addressId}"]`
    );

    if (addressCard) {
      // Adres kartından bilgileri çek
      const label = addressCard
        .querySelector(".address-label")
        .textContent.trim();
      const recipientFull = addressCard
        .querySelector(".address-recipient")
        .textContent.trim();
      const phone = addressCard
        .querySelector(".address-phone")
        .textContent.trim();
      const fullAddress = addressCard
        .querySelector(".address-detail-text")
        .textContent.trim();

      // Ad ve Soyad'ı ayır
      const nameParts = recipientFull.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Form alanlarını doldur
      document.getElementById("firstName").value = firstName;
      document.getElementById("lastName").value = lastName;
      document.getElementById("phoneNumber").value = phone;
      document.getElementById("addressTitle").value = label;

      // Açık adresten il, ilçe, mahalle ve detayı ayıkla
      // Format: "Detay, Mahalle, İlçe / İl, Türkiye"
      const addressParts = fullAddress.split(",").map((part) => part.trim());

      if (addressParts.length >= 3) {
        // Açık adres detayı (ilk kısım)
        const addressDetail = addressParts[0];
        document.getElementById("addressDetail").value = addressDetail;

        // Mahalle (ikinci kısım)
        const neighborhood = addressParts[1];

        // İlçe / İl (üçüncü kısım)
        const districtCity = addressParts[2]
          .split("/")
          .map((part) => part.trim());

        if (districtCity.length >= 2) {
          const district = districtCity[0];
          const cityFull = districtCity[1].split(",")[0].trim(); // "Ankara, Türkiye" -> "Ankara"

          // İl'i küçük harfe çevir (select value ile eşleşmesi için)
          const cityValue = cityFull
            .toLowerCase()
            .replace(/ı/g, "i")
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c");

          // İl seç
          citySelect.value = cityValue;
          citySelect.dispatchEvent(new Event("change"));

          // İlçe ve Mahalle'yi seç (bir süre bekle ki dropdown'lar yüklensin)
          setTimeout(() => {
            const districtValue = district
              .toLowerCase()
              .replace(/ı/g, "i")
              .replace(/ğ/g, "g")
              .replace(/ü/g, "u")
              .replace(/ş/g, "s")
              .replace(/ö/g, "o")
              .replace(/ç/g, "c")
              .replace(/\s+/g, "");

            districtSelect.value = districtValue;
            districtSelect.dispatchEvent(new Event("change"));

            setTimeout(() => {
              const neighborhoodValue = neighborhood
                .toLowerCase()
                .replace(/ı/g, "i")
                .replace(/ğ/g, "g")
                .replace(/ü/g, "u")
                .replace(/ş/g, "s")
                .replace(/ö/g, "o")
                .replace(/ç/g, "c");

              neighborhoodSelect.value = neighborhoodValue;
            }, 100);
          }, 100);
        }
      }
    }
  }

  // ==========================================
  // DELETE ADDRESS
  // ==========================================

  const deleteModal = document.getElementById("deleteModal");
  const closeDeleteModal = document.getElementById("closeDeleteModal");
  const deleteNo = document.getElementById("deleteNo");
  const deleteYes = document.getElementById("deleteYes");

  let deleteAddressId = null;

  function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll(
      ".address-action-btn.delete"
    );
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        deleteAddressId = this.getAttribute("data-address-id");
        openModal(deleteModal);
      });
    });
  }

  deleteNo.addEventListener("click", function () {
    closeModal(deleteModal);
    deleteAddressId = null;
  });

  deleteYes.addEventListener("click", function () {
    if (deleteAddressId) {
      const addressCard = document.querySelector(
        `.address-card-new[data-address-id="${deleteAddressId}"]`
      );

      if (addressCard) {
        // Silinen adresin varsayılan olup olmadığını kontrol et
        const radioButton = addressCard.querySelector(".default-address-radio");
        const wasDefault = radioButton && radioButton.checked;

        addressCard.style.opacity = "0";
        addressCard.style.transform = "translateX(-20px)";

        setTimeout(() => {
          addressCard.remove();

          // Eğer silinen adres varsayılansa ve başka adres varsa, ilk adresi varsayılan yap
          if (wasDefault) {
            const remainingAddresses =
              document.querySelectorAll(".address-card-new");
            if (remainingAddresses.length > 0) {
              const firstRadio = remainingAddresses[0].querySelector(
                ".default-address-radio"
              );
              if (firstRadio) {
                firstRadio.checked = true;
                console.log(
                  "Varsayılan adres silindi, ilk adres yeni varsayılan olarak ayarlandı"
                );
              }
            }
          }

          alert("Adres başarıyla silindi!");
        }, 300);
      }

      closeModal(deleteModal);
      deleteAddressId = null;
    }
  });

  closeDeleteModal.addEventListener("click", function () {
    closeModal(deleteModal);
    deleteAddressId = null;
  });

  deleteModal.addEventListener("click", function (e) {
    if (e.target === deleteModal) {
      closeModal(deleteModal);
      deleteAddressId = null;
    }
  });

  // ==========================================
  // FORM SUBMISSION
  // ==========================================

  addressForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const city = citySelect.value;
    const district = districtSelect.value;
    const neighborhood = neighborhoodSelect.value;
    const detail = document.getElementById("addressDetail").value.trim();
    const title = document.getElementById("addressTitle").value.trim();

    // Validasyonlar
    if (!firstName || !lastName) {
      alert("Lütfen ad ve soyad giriniz");
      return;
    }

    if (!phone || phone.replace(/\D/g, "").length !== 10) {
      alert("Lütfen geçerli bir telefon numarası giriniz");
      return;
    }

    if (!city || !district || !neighborhood) {
      alert("Lütfen il, ilçe ve mahalle seçiniz");
      return;
    }

    if (!detail || !title) {
      alert("Lütfen tüm alanları doldurunuz");
      return;
    }

    const addressData = {
      firstName,
      lastName,
      phone,
      city,
      district,
      neighborhood,
      detail,
      title,
    };

    if (isEditMode) {
      updateAddressCard(currentEditId, addressData);
      alert("Adres başarıyla güncellendi!");
    } else {
      addNewAddressCard(addressData);
      alert("Adres başarıyla eklendi!");
    }

    showAddressList();
  });

  // ==========================================
  // ADD/UPDATE ADDRESS CARD
  // ==========================================

  function updateAddressCard(addressId, data) {
    const card = document.querySelector(
      `.address-card-new[data-address-id="${addressId}"]`
    );

    if (card) {
      // Etiket güncelle
      card.querySelector(".address-label").textContent = data.title;

      // Alıcı adı güncelle
      card.querySelector(
        ".address-recipient"
      ).textContent = `${data.firstName} ${data.lastName}`;

      // Telefon güncelle
      card.querySelector(".address-phone").textContent = data.phone;

      // Adres detayı güncelle - Select'lerden seçilen metinleri al
      const citySelectEl = document.getElementById("citySelect");
      const districtSelectEl = document.getElementById("districtSelect");
      const neighborhoodSelectEl =
        document.getElementById("neighborhoodSelect");

      const cityName =
        citySelectEl.options[citySelectEl.selectedIndex].textContent;
      const districtName =
        districtSelectEl.options[districtSelectEl.selectedIndex].textContent;
      const neighborhoodName =
        neighborhoodSelectEl.options[neighborhoodSelectEl.selectedIndex]
          .textContent;

      card.querySelector(
        ".address-detail-text"
      ).textContent = `${data.detail}, ${neighborhoodName}, ${districtName} / ${cityName}, Türkiye`;
    }
  }

  function addNewAddressCard(data) {
    const newId = Date.now();
    const cityName = citySelect.options[citySelect.selectedIndex].textContent;
    const districtName =
      districtSelect.options[districtSelect.selectedIndex].textContent;
    const neighborhoodName =
      neighborhoodSelect.options[neighborhoodSelect.selectedIndex].textContent;

    // ÖNEMLI: Eğer hiç adres yoksa, yeni adresi varsayılan olarak işaretle
    const existingAddresses = document.querySelectorAll(".address-card-new");
    const isFirstAddress = existingAddresses.length === 0;

    const cardHTML = `
      <div class="address-card-new" data-address-id="${newId}" style="opacity: 0; transform: translateY(20px);">
        <div class="address-card-wrapper">
          <input
            type="radio"
            name="defaultAddress"
            class="default-address-radio"
            id="default-${newId}"
            data-address-id="${newId}"
            ${isFirstAddress ? "checked" : ""}
          />
          <label for="default-${newId}" class="radio-label"></label>

          <div class="address-card-content">
            <div class="address-card-header-new">
              <div class="address-info-row">
                <svg
                  class="address-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                  ></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span class="address-label">${data.title}</span>
              </div>

              <div class="address-info-row">
                <svg
                  class="address-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  ></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span class="address-recipient">${data.firstName} ${
      data.lastName
    }</span>
              </div>

              <div class="address-info-row">
                <svg
                  class="address-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  ></path>
                </svg>
                <span class="address-phone">${data.phone}</span>
              </div>

              <div class="address-actions-new">
                <button class="address-action-btn edit" data-address-id="${newId}">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    ></path>
                    <path
                      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    ></path>
                  </svg>
                </button>
                <button class="address-action-btn delete" data-address-id="${newId}">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <p class="address-detail-text">
              ${
                data.detail
              }, ${neighborhoodName}, ${districtName} / ${cityName}, Türkiye
            </p>
          </div>
        </div>
      </div>
    `;

    const addressCards = document.querySelector(".address-cards");
    addressCards.insertAdjacentHTML("beforeend", cardHTML);

    const newCard = addressCards.lastElementChild;
    setTimeout(() => {
      newCard.style.transition = "all 0.3s ease";
      newCard.style.opacity = "1";
      newCard.style.transform = "translateY(0)";
    }, 50);

    // Yeni karta event listener'ları ekle
    attachEditListeners();
    attachDeleteListeners();
    attachDefaultAddressListeners();

    // Eğer ilk adres ise, kullanıcıya bilgi ver
    if (isFirstAddress) {
      console.log("İlk adres eklendi ve varsayılan olarak işaretlendi");
    }
  }

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  function openModal(modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Escape tuşu ile modal kapatma
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (deleteModal.classList.contains("active")) {
        closeModal(deleteModal);
        deleteAddressId = null;
      }
    }
  });

  // ==========================================
  // DEFAULT ADDRESS HANDLING
  // ==========================================

  function attachDefaultAddressListeners() {
    const radioButtons = document.querySelectorAll(".default-address-radio");
    radioButtons.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.checked) {
          const addressId = this.getAttribute("data-address-id");
          console.log("Varsayılan adres değiştirildi:", addressId);

          // Burada backend'e varsayılan adres güncellemesi gönderilebilir
          // Mock: Backend'e API call
          // updateDefaultAddress(addressId);
        }
      });
    });
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  // Sayfa yüklendiğinde mevcut kartlara event listener'ları ekle
  attachEditListeners();
  attachDeleteListeners();
  attachDefaultAddressListeners();
});
// ==========================================
// CREDIT PAGE JAVASCRIPT - UPDATED
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  const creditPageContent = document.getElementById("creditPageContent");

  if (!creditPageContent) return;

  console.log("Credit page JavaScript loaded - UPDATED");

  const creditListView = document.getElementById("creditListView");
  const creditLoadView = document.getElementById("creditLoadView");
  const openLoadCreditBtn = document.getElementById("openLoadCreditBtn");

  const creditOptionButtons = document.querySelectorAll(".credit-option-btn");
  const customCreditAmount = document.getElementById("customCreditAmount");

  const cardNumberInput = document.getElementById("cardNumber");
  const cvvNumberInput = document.getElementById("cvvNumber");
  const creditForm = document.getElementById("creditForm");

  // CVV Tooltip Elements (NOT MODAL)
  const cvvQuestionBtn = document.getElementById("cvvQuestionBtn");
  const cvvTooltip = document.getElementById("cvvTooltip");
  const cvvTooltipClose = document.getElementById("cvvTooltipClose");

  // Expiry Date Elements
  const expiryMonth = document.getElementById("expiryMonth");
  const expiryYear = document.getElementById("expiryYear");

  // Summary elements
  const summaryPriceDisplay = document.getElementById("summaryPriceDisplay");
  const summaryOrderPrice = document.getElementById("summaryOrderPrice");
  const summaryCargoPrice = document.getElementById("summaryCargoPrice");
  const summaryTotalPrice = document.getElementById("summaryTotalPrice");

  let selectedCredit = 500;
  let selectedPrice = 100;

  // ==========================================
  // VIEW SWITCHING
  // ==========================================

  function showLoadCreditView() {
    creditListView.style.display = "none";
    creditLoadView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showListView() {
    creditLoadView.style.display = "none";
    creditListView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (openLoadCreditBtn) {
    openLoadCreditBtn.addEventListener("click", showLoadCreditView);
  }

  // ==========================================
  // CREDIT AMOUNT SELECTION
  // ==========================================

  creditOptionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      creditOptionButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      selectedCredit = parseInt(this.getAttribute("data-credit"));
      selectedPrice = parseInt(this.getAttribute("data-price"));

      if (customCreditAmount) {
        customCreditAmount.value = "";
      }

      updateSummary(selectedPrice);
    });
  });

  // ==========================================
  // CUSTOM AMOUNT INPUT - FIXED: DELETABLE
  // ==========================================

  if (customCreditAmount) {
    customCreditAmount.addEventListener("input", function (e) {
      let value = e.target.value.replace(/[^\d]/g, "");

      if (value.length > 0) {
        creditOptionButtons.forEach((btn) => btn.classList.remove("active"));

        // NO SUFFIX IN INPUT - IT'S OUTSIDE NOW
        e.target.value = value;

        const customCredit = parseInt(value);
        const calculatedPrice = Math.round(customCredit * 0.2);

        selectedCredit = customCredit;
        selectedPrice = calculatedPrice;

        updateSummary(calculatedPrice);
      } else {
        e.target.value = "";
      }
    });

    // Allow only numbers
    customCreditAmount.addEventListener("keypress", function (e) {
      if (!/\d/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
        e.preventDefault();
      }
    });
  }

  // ==========================================
  // UPDATE SUMMARY
  // ==========================================

  function updateSummary(orderPrice) {
    const cargo = 30;
    const total = orderPrice + cargo;

    if (summaryPriceDisplay) {
      summaryPriceDisplay.textContent = orderPrice + " TL/Adet";
    }

    if (summaryOrderPrice) {
      summaryOrderPrice.textContent = orderPrice + " TL";
    }

    if (summaryCargoPrice) {
      summaryCargoPrice.textContent = cargo + " TL";
    }

    if (summaryTotalPrice) {
      summaryTotalPrice.textContent = total + " TL";
    }
  }

  // ==========================================
  // CARD NUMBER FORMATTING
  // ==========================================

  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\s/g, "").replace(/[^\d]/g, "");

      if (value.length > 16) {
        value = value.slice(0, 16);
      }

      let formatted = "";
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += "-";
        }
        formatted += value[i];
      }

      e.target.value = formatted;
    });

    cardNumberInput.addEventListener("keypress", function (e) {
      if (!/\d/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
        e.preventDefault();
      }
    });
  }

  // ==========================================
  // CVV INPUT
  // ==========================================

  if (cvvNumberInput) {
    cvvNumberInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      if (value.length > 3) {
        value = value.slice(0, 3);
      }

      e.target.value = value;
    });

    cvvNumberInput.addEventListener("keypress", function (e) {
      if (!/\d/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
        e.preventDefault();
      }
    });
  }

  // ==========================================
  // CVV TOOLTIP (INLINE, NOT MODAL)
  // ==========================================

  if (cvvQuestionBtn && cvvTooltip) {
    cvvQuestionBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      cvvTooltip.classList.toggle("active");
    });
  }

  if (cvvTooltipClose) {
    cvvTooltipClose.addEventListener("click", function () {
      cvvTooltip.classList.remove("active");
    });
  }

  // Close tooltip when clicking outside
  document.addEventListener("click", function (e) {
    if (
      cvvTooltip &&
      !cvvTooltip.contains(e.target) &&
      e.target !== cvvQuestionBtn
    ) {
      cvvTooltip.classList.remove("active");
    }
  });

  // ==========================================
  // FORM SUBMISSION
  // ==========================================

  if (creditForm) {
    creditForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const cardHolderName = document
        .getElementById("cardHolderName")
        .value.trim();
      const cardNumber = cardNumberInput.value.replace(/-/g, "");
      const month = expiryMonth.value;
      const year = expiryYear.value;
      const cvv = cvvNumberInput.value;

      // Validation
      if (!cardHolderName) {
        alert("Lütfen kart sahibinin adını ve soyadını giriniz");
        return;
      }

      if (cardNumber.length !== 16) {
        alert("Lütfen geçerli bir kart numarası giriniz (16 hane)");
        return;
      }

      if (!month || !year) {
        alert("Lütfen son kullanma tarihini seçiniz");
        return;
      }

      if (cvv.length !== 3) {
        alert("Lütfen geçerli bir CVV giriniz (3 hane)");
        return;
      }

      // Mock: Payment processing
      console.log("Payment:", {
        credit: selectedCredit,
        price: selectedPrice,
        cardHolderName,
        cardNumber,
        expiry: `${month}/${year}`,
        cvv,
      });

      setTimeout(() => {
        alert(`Ödeme başarılı! ${selectedCredit} kredi yüklendi.`);

        creditForm.reset();
        showListView();

        // Update balance
        const balanceElement = document.querySelector(".balance-amount");
        if (balanceElement) {
          const currentBalance = parseInt(
            balanceElement.textContent.replace(/[^\d]/g, "")
          );
          const newBalance = currentBalance + selectedCredit;
          balanceElement.textContent = newBalance;
        }

        addTransactionToHistory(selectedPrice);
      }, 1000);
    });
  }

  // ==========================================
  // ADD TRANSACTION TO HISTORY - UPDATED WITH ₺
  // ==========================================

  function addTransactionToHistory(price) {
    const historyList = document.querySelector(".credit-history-list");

    if (!historyList) return;

    const now = new Date();
    const dateString = `${now.getDate()} ${getMonthName(
      now.getMonth()
    )} ${now.getFullYear()} | ${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const newTransaction = document.createElement("div");
    newTransaction.className = "credit-transaction-item";
    newTransaction.style.opacity = "0";
    newTransaction.style.transform = "translateY(-10px)";

    newTransaction.innerHTML = `
      <div class="transaction-info">
        <div class="transaction-title">Kredi Yükleme</div>
        <div class="transaction-date">${dateString}</div>
      </div>
      <div class="transaction-amount positive">+₺${price}</div>
    `;

    historyList.insertBefore(newTransaction, historyList.firstChild);

    setTimeout(() => {
      newTransaction.style.transition = "all 0.3s ease";
      newTransaction.style.opacity = "1";
      newTransaction.style.transform = "translateY(0)";
    }, 100);
  }

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  function getMonthName(monthIndex) {
    const months = [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ];
    return months[monthIndex];
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  updateSummary(100);
});
// ==========================================
// RETURN PAGE JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  const returnPageContent = document.getElementById("returnPageContent");

  if (!returnPageContent) return;

  console.log("Return page JavaScript loaded");

  // Modal elements
  const cancelReturnModal = document.getElementById("cancelReturnModal");
  const successReturnCancelModal = document.getElementById(
    "successReturnCancelModal"
  );

  const closeCancelReturnModal = document.getElementById(
    "closeCancelReturnModal"
  );
  const closeSuccessReturnModal = document.getElementById(
    "closeSuccessReturnModal"
  );

  const cancelReturnNo = document.getElementById("cancelReturnNo");
  const cancelReturnYes = document.getElementById("cancelReturnYes");

  let currentReturnId = null;

  // ==========================================
  // CANCEL RETURN FLOW
  // ==========================================

  // Step 1: Click "İptal Et" button
  const returnCancelButtons = document.querySelectorAll(".return-cancel-btn");

  returnCancelButtons.forEach((button) => {
    button.addEventListener("click", function () {
      currentReturnId = this.getAttribute("data-return-id");
      console.log("Cancel return requested:", currentReturnId);
      openModal(cancelReturnModal);
    });
  });

  // Step 2: Confirm cancellation
  cancelReturnYes.addEventListener("click", function () {
    closeModal(cancelReturnModal);

    // Mock: Send cancellation to backend
    console.log("Return cancelled:", currentReturnId);

    // Simulate API call
    setTimeout(() => {
      // Show success modal
      openModal(successReturnCancelModal);

      // Auto-close success modal after 3 seconds
      setTimeout(() => {
        closeModal(successReturnCancelModal);

        // Remove the cancelled return item from the page
        const returnCard = document
          .querySelector(
            `.return-cancel-btn[data-return-id="${currentReturnId}"]`
          )
          .closest(".return-item-card");

        if (returnCard) {
          returnCard.style.opacity = "0";
          returnCard.style.transform = "translateX(-20px)";

          setTimeout(() => {
            returnCard.remove();
          }, 300);
        }

        currentReturnId = null;
      }, 3000);
    }, 500);
  });

  // Step 2b: Cancel the cancellation
  cancelReturnNo.addEventListener("click", function () {
    closeModal(cancelReturnModal);
    currentReturnId = null;
  });

  // ==========================================
  // MODAL CLOSE BUTTONS
  // ==========================================

  closeCancelReturnModal.addEventListener("click", function () {
    closeModal(cancelReturnModal);
    currentReturnId = null;
  });

  closeSuccessReturnModal.addEventListener("click", function () {
    closeModal(successReturnCancelModal);
    currentReturnId = null;
  });

  // Close modals when clicking outside
  [cancelReturnModal, successReturnCancelModal].forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal(modal);
        if (modal === cancelReturnModal) {
          currentReturnId = null;
        }
      }
    });
  });

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  function openModal(modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Close modals on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (cancelReturnModal.classList.contains("active")) {
        closeModal(cancelReturnModal);
        currentReturnId = null;
      }
      if (successReturnCancelModal.classList.contains("active")) {
        closeModal(successReturnCancelModal);
        currentReturnId = null;
      }
    }
  });
});
/* ====================================
   SİPARİŞ ÖNİZLEME SAYFASI
   ==================================== */

document.addEventListener("DOMContentLoaded", function () {
  const orderPreviewPage = document.getElementById("orderPreviewPage");
  if (!orderPreviewPage) return;

  // Mock Data - Backend'den gelecek
  const mockOrderData = {
    orderId: "49858476",
    orderDate: "03.10.2025",
    artistName: "Melis Aksoy",
    artistMessage:
      "Çalışmanızı tamamladım ve ekteki görselde önizlemesini görebilirsiniz. Umarım beklentilerinizi karşılar :)",
    previewImage: "../images/preview-sample.jpg",
    totalRevisions: 3,
    usedRevisions: 1,
    remainingRevisions: 2,
  };

  // State Elementleri
  const previewState = document.getElementById("previewState");
  const reviewState = document.getElementById("reviewState");
  const revisionState = document.getElementById("revisionState");

  // Önizleme Butonları
  const approveBtn = document.getElementById("approveBtn");
  const revisionBtn = document.getElementById("revisionBtn");

  // Değerlendirme
  const ratingStars = document.querySelectorAll(".order-review__star");
  const reviewComment = document.getElementById("reviewComment");
  const submitReviewBtn = document.getElementById("submitReviewBtn");

  // Revize
  const revisionNote = document.getElementById("revisionNote");
  const submitRevisionBtn = document.getElementById("submitRevisionBtn");
  const totalRevisionsEl = document.getElementById("totalRevisions");
  const remainingRevisionsEl = document.getElementById("remainingRevisions");
  const revisionProgressBar = document.getElementById("revisionProgressBar");

  // Modal
  const revisionConfirmModal = document.getElementById("revisionConfirmModal");
  const closeRevisionModal = document.getElementById("closeRevisionModal");
  const cancelRevisionBtn = document.getElementById("cancelRevisionBtn");
  const confirmRevisionBtn = document.getElementById("confirmRevisionBtn");
  const modalTotalRevisions = document.getElementById("modalTotalRevisions");
  const modalRemainingRevisions = document.getElementById(
    "modalRemainingRevisions"
  );

  // Sayfa verilerini doldur
  function initializePageData() {
    document.getElementById("orderNumber").textContent = mockOrderData.orderId;
    document.getElementById("orderDate").textContent = mockOrderData.orderDate;
    document.getElementById("artistName").textContent =
      mockOrderData.artistName;
    document.getElementById("artistMessage").textContent =
      mockOrderData.artistMessage;

    // Tüm görselleri güncelle
    document
      .querySelectorAll(
        ".order-preview__image, .order-review__image, .order-revision__image"
      )
      .forEach((img) => {
        img.src = mockOrderData.previewImage;
      });

    // Revize bilgilerini güncelle
    updateRevisionInfo();
  }

  // Revize bilgilerini güncelle
  function updateRevisionInfo() {
    const remaining = mockOrderData.remainingRevisions;
    const total = mockOrderData.totalRevisions;
    const percentage = ((total - remaining) / total) * 100;

    totalRevisionsEl.textContent = total;
    remainingRevisionsEl.textContent = remaining;
    revisionProgressBar.style.width = percentage + "%";

    modalTotalRevisions.textContent = total;
    modalRemainingRevisions.textContent = remaining;
  }

  // State değiştirme fonksiyonu
  function changeState(targetState) {
    // Tüm state'leri gizle
    previewState.style.display = "none";
    reviewState.style.display = "none";
    revisionState.style.display = "none";

    // Hedef state'i göster
    switch (targetState) {
      case "review":
        reviewState.style.display = "block";
        break;
      case "revision":
        revisionState.style.display = "block";
        break;
      default:
        previewState.style.display = "block";
    }

    // Sayfayı yukarı scroll et
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Onayla butonu - Değerlendirme sayfasına geç
  approveBtn.addEventListener("click", function () {
    changeState("review");
  });

  // Revize Talep Et butonu - Revize sayfasına geç
  revisionBtn.addEventListener("click", function () {
    changeState("revision");
  });

  /* ====================================
       DEĞERLENDİRME (RATING) SİSTEMİ
       ==================================== */

  let selectedRating = 0;

  ratingStars.forEach((star) => {
    star.addEventListener("click", function () {
      selectedRating = parseInt(this.getAttribute("data-rating"));
      updateStars(selectedRating);
    });

    star.addEventListener("mouseenter", function () {
      const hoverRating = parseInt(this.getAttribute("data-rating"));
      updateStars(hoverRating);
    });
  });

  // Rating container'dan çıkınca seçili rating'i göster
  const ratingContainer = document.querySelector(".order-review__rating");
  if (ratingContainer) {
    ratingContainer.addEventListener("mouseleave", function () {
      updateStars(selectedRating);
    });
  }

  function updateStars(rating) {
    ratingStars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add("active");
      } else {
        star.classList.remove("active");
      }
    });
  }

  // Değerlendirme gönder
  submitReviewBtn.addEventListener("click", function () {
    const comment = reviewComment.value.trim();

    // Validasyon
    if (selectedRating === 0) {
      alert("Lütfen yıldız vererek değerlendirme yapın.");
      return;
    }

    if (comment === "") {
      alert("Lütfen bir yorum yazın.");
      return;
    }

    // Backend'e gönderilecek veri
    const reviewData = {
      orderId: mockOrderData.orderId,
      rating: selectedRating,
      comment: comment,
    };

    console.log("Değerlendirme gönderiliyor:", reviewData);

    // TODO: Sanatçı sayfasına yönlendir
    // window.location.href = "artist-profile.html?id=" + artistId;
    alert(
      "Değerlendirmeniz için teşekkürler! Sanatçı sayfasına yönlendirileceksiniz."
    );
  });

  /* ====================================
       REVİZE TALEBİ
       ==================================== */

  submitRevisionBtn.addEventListener("click", function () {
    const note = revisionNote.value.trim();

    // Validasyon
    if (note === "") {
      alert("Lütfen revize notunuzu yazın.");
      return;
    }

    if (mockOrderData.remainingRevisions <= 0) {
      alert("Revize hakkınız kalmamıştır.");
      return;
    }

    // Modal'ı aç
    revisionConfirmModal.classList.add("active");
  });

  // Modal kapatma
  function closeModal() {
    revisionConfirmModal.classList.remove("active");
  }

  closeRevisionModal.addEventListener("click", closeModal);
  cancelRevisionBtn.addEventListener("click", closeModal);

  // Modal overlay'e tıklayınca kapat
  revisionConfirmModal.addEventListener("click", function (e) {
    if (e.target === revisionConfirmModal) {
      closeModal();
    }
  });

  // Revize talebini onayla
  confirmRevisionBtn.addEventListener("click", function () {
    const note = revisionNote.value.trim();

    // Backend'e gönderilecek veri
    const revisionData = {
      orderId: mockOrderData.orderId,
      revisionNote: note,
      remainingRevisions: mockOrderData.remainingRevisions - 1,
    };

    console.log("Revize talebi gönderiliyor:", revisionData);

    // Modal'ı kapat
    closeModal();

    // TODO: Sanatçı sayfasına yönlendir
    // window.location.href = "artist-profile.html?id=" + artistId;
    alert("Revize talebiniz iletildi! Sanatçı sayfasına yönlendirileceksiniz.");

    // Mock: Revize hakkını azalt (gerçek uygulamada backend'den gelecek)
    mockOrderData.remainingRevisions--;
    updateRevisionInfo();
  });

  // Sayfa yüklendiğinde verileri doldur
  initializePageData();
});
