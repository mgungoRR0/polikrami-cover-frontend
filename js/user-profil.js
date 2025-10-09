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
// PASSWORD PAGE JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the password page
  const passwordForm = document.getElementById("passwordForm");

  if (!passwordForm) return;

  console.log("Password page JavaScript loaded");

  // ==========================================
  // PASSWORD VISIBILITY TOGGLE
  // ==========================================

  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);

      if (input.type === "password") {
        input.type = "text";
        this.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;
      } else {
        input.type = "password";
        this.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      }
    });
  });

  // ==========================================
  // PASSWORD VALIDATION
  // ==========================================

  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const requirements = document.querySelectorAll(".requirement");

  // Password validation rules
  const passwordRules = {
    length: (password) => password.length >= 8,
    complex: (password) => {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      return hasUpperCase && hasNumber && hasSpecialChar;
    },
  };

  // Update requirement indicators
  function updateRequirements() {
    const password = newPasswordInput.value;

    requirements.forEach((requirement) => {
      const rule = requirement.getAttribute("data-rule");

      if (passwordRules[rule](password)) {
        requirement.classList.add("valid");
      } else {
        requirement.classList.remove("valid");
      }
    });
  }

  // Check all requirements are met
  function isPasswordValid() {
    const password = newPasswordInput.value;
    return Object.values(passwordRules).every((rule) => rule(password));
  }

  newPasswordInput.addEventListener("input", updateRequirements);

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
      alert("Lütfen eski şifrenizi giriniz");
      return;
    }

    if (!newPassword) {
      alert("Lütfen yeni şifrenizi giriniz");
      return;
    }

    if (!isPasswordValid()) {
      alert("Yeni şifreniz gereksinimleri karşılamıyor");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Yeni şifreler eşleşmiyor");
      return;
    }

    if (oldPassword === newPassword) {
      alert("Yeni şifre eski şifreden farklı olmalıdır");
      return;
    }

    // Mock: Send to backend
    console.log("Password change requested");
    console.log("Old password:", oldPassword);
    console.log("New password:", newPassword);

    // Simulate API call
    setTimeout(() => {
      alert("Şifreniz başarıyla değiştirildi!");

      // Clear form
      passwordForm.reset();

      // Reset requirement indicators
      requirements.forEach((req) => req.classList.remove("valid"));
    }, 500);
  });

  // ==========================================
  // REAL-TIME PASSWORD MATCH CHECK
  // ==========================================

  confirmPasswordInput.addEventListener("input", function () {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword.length > 0) {
      if (newPassword === confirmPassword) {
        confirmPasswordInput.style.borderColor = "var(--primary-green)";
      } else {
        confirmPasswordInput.style.borderColor = "#e74c3c";
      }
    } else {
      confirmPasswordInput.style.borderColor = "";
    }
  });
});
