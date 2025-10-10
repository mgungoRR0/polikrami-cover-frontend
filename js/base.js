// ==========================================
// Polikrami Frontend System - v3.0
// Tüm sayfalarda ortak kullanılan fonksiyonlar
// ==========================================

(function () {
  "use strict";

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

  // ==========================================
  // Language Switcher (Dil Değiştirici)
  // ==========================================

  const initLanguageSwitcher = () => {
    const languageBtn = $("#languageBtn");
    const languageDropdown = $("#languageDropdown");
    const langOptions = $$(".lang-option");

    if (!languageBtn || !languageDropdown) return;

    languageBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !isExpanded);
      languageDropdown.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
      if (
        !languageDropdown.contains(e.target) &&
        !languageBtn.contains(e.target)
      ) {
        languageBtn.setAttribute("aria-expanded", "false");
        languageDropdown.classList.remove("active");
      }
    });

    langOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.preventDefault();
        const selectedLang = this.getAttribute("data-lang").toUpperCase();

        langOptions.forEach((opt) => opt.classList.remove("active"));
        this.classList.add("active");

        const langText = $(".lang-text");
        if (langText) {
          const langNames = { TR: "Türkçe", EN: "English", DE: "Deutsch" };
          langText.textContent = langNames[selectedLang] || selectedLang;
        }

        languageBtn.setAttribute("aria-expanded", "false");
        languageDropdown.classList.remove("active");

        console.log("Seçilen dil:", selectedLang);
      });
    });

    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang) {
      const savedOption = $(
        `.lang-option[data-lang="${savedLang.toLowerCase()}"]`
      );
      if (savedOption) savedOption.click();
    }

    console.log("✅ Dil değiştirici başlatıldı");
  };

  // ==========================================
  // Profile Dropdown
  // ==========================================

  const initProfileDropdown = () => {
    const profileAvatar = $("#profileAvatar");
    const profileDropdown = $("#profileDropdown");

    if (!profileAvatar || !profileDropdown) return;

    profileAvatar.addEventListener("click", function (e) {
      e.stopPropagation();
      profileDropdown.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
      if (
        !profileDropdown.contains(e.target) &&
        !profileAvatar.contains(e.target)
      ) {
        profileDropdown.classList.remove("active");
      }
    });

    profileDropdown.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    console.log("✅ Profile dropdown başlatıldı");
  };

  // ==========================================
  // Password Toggle (Şifre Göster/Gizle)
  // ==========================================

  const setupPasswordToggle = () => {
    const toggleButtons = $$(".toggle-password");

    toggleButtons.forEach((button) => {
      if (button.dataset.initialized === "true") return;
      button.dataset.initialized = "true";

      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        let input = null;
        const parent = this.parentElement;
        input = parent.querySelector(
          'input[type="password"], input[type="text"]'
        );

        if (!input) {
          const wrapper = this.closest(".password-wrapper");
          if (wrapper) {
            input = wrapper.querySelector(
              'input[type="password"], input[type="text"]'
            );
          }
        }

        if (!input) {
          const formGroup = this.closest(".form-group");
          if (formGroup) {
            input = formGroup.querySelector(
              'input[type="password"], input[type="text"]'
            );
          }
        }

        if (!input) {
          console.error("Şifre input bulunamadı:", this);
          return;
        }

        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";

        const eyeOpen = this.querySelector(".eye-open");
        const eyeClosed = this.querySelector(".eye-closed");

        if (eyeOpen && eyeClosed) {
          if (isPassword) {
            eyeOpen.style.display = "none";
            eyeClosed.style.display = "block";
          } else {
            eyeOpen.style.display = "block";
            eyeClosed.style.display = "none";
          }
        }
      });
    });

    console.log(`✅ Password toggle başlatıldı: ${toggleButtons.length} buton`);
  };

  // ==========================================
  // Input Enhancements
  // ==========================================

  const enhanceInputs = () => {
    $$(".form-control").forEach((input) => {
      if (input.dataset.enhanced === "true") return;
      input.dataset.enhanced = "true";

      input.addEventListener("focus", function () {
        const parent = this.closest(".form-group");
        if (parent) parent.classList.add("focused");
        this.classList.add("focused");
      });

      input.addEventListener("blur", function () {
        const parent = this.closest(".form-group");
        if (parent) parent.classList.remove("focused");
        this.classList.remove("focused");

        if (this.value && this.value.trim() !== "") {
          this.classList.add("filled");
        } else {
          this.classList.remove("filled");
        }
      });

      if (input.value && input.value.trim() !== "") {
        input.classList.add("filled");
      }
    });
  };

  // ==========================================
  // Select Enhancement
  // ==========================================

  const enhanceSelects = () => {
    $$("select.form-control").forEach((select) => {
      if (select.dataset.enhanced === "true") return;
      select.dataset.enhanced = "true";

      const updateSelectStyle = () => {
        if (select.value && select.value !== "") {
          select.style.color = "#333";
          select.classList.add("filled");
        } else {
          select.style.color = "#A0A0A0";
          select.classList.remove("filled");
        }
      };

      select.addEventListener("change", updateSelectStyle);
      updateSelectStyle();
    });
  };

  // ==========================================
  // OTP Input Enhancement
  // ==========================================

  const enhanceOTPInputs = () => {
    const otpInputs = $$(".otp-input");
    if (otpInputs.length === 0) return;

    const otpGroup = $("#otpGroup");

    otpInputs.forEach((input, idx) => {
      if (input.dataset.enhanced === "true") return;
      input.dataset.enhanced = "true";

      input.addEventListener("input", function (e) {
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 1);
        if (this.value && idx < otpInputs.length - 1) {
          otpInputs[idx + 1].focus();
        }
      });

      input.addEventListener("keydown", function (e) {
        if (e.key === "Backspace") {
          if (!this.value && idx > 0) {
            e.preventDefault();
            otpInputs[idx - 1].focus();
            otpInputs[idx - 1].value = "";
          }
        }

        if (e.key === "ArrowLeft" && idx > 0) {
          e.preventDefault();
          otpInputs[idx - 1].focus();
        }
        if (e.key === "ArrowRight" && idx < otpInputs.length - 1) {
          e.preventDefault();
          otpInputs[idx + 1].focus();
        }
      });
    });

    if (otpGroup) {
      otpGroup.addEventListener("paste", function (e) {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData(
          "text"
        );
        const numbers = pastedData
          .replace(/[^0-9]/g, "")
          .slice(0, otpInputs.length);

        numbers.split("").forEach((num, i) => {
          if (otpInputs[i]) {
            otpInputs[i].value = num;
          }
        });

        const lastIndex = Math.min(numbers.length, otpInputs.length - 1);
        if (otpInputs[lastIndex]) {
          otpInputs[lastIndex].focus();
        }
      });
    }

    console.log("✅ OTP inputlar başlatıldı");
  };

  // ==========================================
  // Validation Functions (Global)
  // ==========================================

  window.validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  window.validatePassword = (password) => {
    return password && password.length >= 8;
  };

  window.validatePasswordStrength = (password) => {
    const hasLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );

    return {
      isValid: hasLength && hasUpperCase && hasNumber && hasSpecialChar,
      checks: {
        length: hasLength,
        complexity: hasUpperCase && hasNumber && hasSpecialChar,
      },
    };
  };

  // ==========================================
  // Message Display System
  // ==========================================

  window.showMessage = (message, type = "info") => {
    $$(".polikrami-message").forEach((el) => el.remove());

    const messageEl = document.createElement("div");
    messageEl.className = `polikrami-message ${type}`;
    messageEl.textContent = message;

    const colors = {
      success: "#4CAF50",
      error: "#f44336",
      warning: "#ff9800",
      info: "#2196F3",
    };

    messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background-color: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;

    document.body.appendChild(messageEl);

    setTimeout(() => {
      messageEl.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  };

  // ==========================================
  // Artist Guide Modal
  // ==========================================

  const initArtistGuideModal = () => {
    const modal = $("#artistGuideModal");
    if (!modal) return;

    const closeBtn = modal.querySelector(".artist-modal-close");
    const overlay = modal.querySelector(".artist-modal-overlay");

    // Çarpı butonuna tıklama
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeArtistGuideModal();
      });
    }

    // Overlay'e tıklama
    if (overlay) {
      overlay.addEventListener("click", closeArtistGuideModal);
    }

    console.log("✅ Artist Guide modal başlatıldı");
  };

  // Modal açma fonksiyonu (global)
  window.openArtistGuideModal = () => {
    const modal = $("#artistGuideModal");
    if (!modal) {
      console.error("Artist Guide modal bulunamadı");
      return;
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    console.log("Artist Guide modal açıldı");
  };

  // Modal kapatma fonksiyonu (global)
  window.closeArtistGuideModal = () => {
    const modal = $("#artistGuideModal");
    if (!modal) return;

    modal.classList.remove("active");
    document.body.style.overflow = "";

    console.log("Artist Guide modal kapatıldı");
  };

  // ==========================================
  // Email Verification Modal
  // ==========================================

  const initEmailModal = () => {
    const emailModal = $("#emailModal");
    if (!emailModal) return;

    const modalClose = emailModal.querySelector(".modal-close");
    const modalBox = emailModal.querySelector(".modal-box");

    // Çarpı butonuna tıklama
    if (modalClose) {
      modalClose.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeEmailModal();
      });
    }

    // Overlay'e tıklama (modal dışına)
    emailModal.addEventListener("click", function (e) {
      if (e.target === emailModal) {
        closeEmailModal();
      }
    });

    // Modal box içine tıklama - kapanmasın
    if (modalBox) {
      modalBox.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    console.log("✅ Email modal başlatıldı");
  };

  // Modal açma fonksiyonu (global)
  window.showEmailModal = (email) => {
    const emailModal = $("#emailModal");
    if (!emailModal) {
      console.error("Email modal bulunamadı");
      return;
    }

    const userEmailElement = $("#userEmail");
    if (userEmailElement && email) {
      userEmailElement.textContent = email;
    }

    emailModal.classList.add("active");
    document.body.style.overflow = "hidden";

    console.log("Modal açıldı:", email);
  };

  // Modal kapatma fonksiyonu (global)
  window.closeEmailModal = () => {
    const emailModal = $("#emailModal");
    if (!emailModal) return;

    emailModal.classList.remove("active");
    document.body.style.overflow = "";

    // Form'u sıfırla
    const signupForm = $("#signupForm");
    if (signupForm) {
      signupForm.reset();

      // Select'lerin rengini sıfırla
      const selects = signupForm.querySelectorAll("select.form-control");
      selects.forEach((select) => {
        select.style.color = "#A0A0A0";
        select.classList.remove("filled");
      });

      // Input'ların class'larını temizle
      const inputs = signupForm.querySelectorAll(".form-control");
      inputs.forEach((input) => {
        input.classList.remove("filled", "focused");
      });

      // Password strength indicator'ı sıfırla
      const strengthItems = signupForm.querySelectorAll(".strength-item");
      strengthItems.forEach((item) => item.classList.remove("valid"));
    }

    console.log("Modal kapatıldı ve form sıfırlandı");
  };

  // ==========================================
  // Form Submission Handler
  // ==========================================

  const initFormSubmission = () => {
    const signupForm = $("#signupForm");
    if (!signupForm) return;

    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Email kontrolü
      const emailInput = $("#email");
      if (!emailInput || !emailInput.value) {
        showMessage("Lütfen e-posta adresinizi girin", "error");
        emailInput?.focus();
        return;
      }

      // Email formatı kontrolü
      if (!validateEmail(emailInput.value)) {
        showMessage("Geçerli bir e-posta adresi girin", "error");
        emailInput.focus();
        return;
      }

      // Şifre kontrolü
      const passwordInput = $("#password");
      const passwordConfirmInput = $("#passwordConfirm");

      if (passwordInput && passwordConfirmInput) {
        if (!passwordInput.value) {
          showMessage("Lütfen şifrenizi girin", "error");
          passwordInput.focus();
          return;
        }

        if (!passwordConfirmInput.value) {
          showMessage("Lütfen şifrenizi tekrar girin", "error");
          passwordConfirmInput.focus();
          return;
        }

        if (passwordInput.value !== passwordConfirmInput.value) {
          showMessage("Şifreler eşleşmiyor", "error");
          passwordConfirmInput.focus();
          return;
        }

        const validation = validatePasswordStrength(passwordInput.value);
        if (!validation.isValid) {
          showMessage(
            "Şifreniz güvenlik gereksinimlerini karşılamıyor",
            "error"
          );
          passwordInput.focus();
          return;
        }
      }

      // Terms checkbox kontrolü
      const termsCheckbox = $("#termsAccept");
      if (termsCheckbox && !termsCheckbox.checked) {
        showMessage("Lütfen kullanım şartlarını kabul edin", "warning");
        termsCheckbox.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Revenue share checkbox kontrolü (sadece artist sayfasında)
      const revenueCheckbox = $("#revenueShareAccept");
      if (revenueCheckbox && !revenueCheckbox.checked) {
        showMessage(
          "Lütfen gelir paylaşımı sözleşmesini kabul edin",
          "warning"
        );
        revenueCheckbox.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Tüm validasyonlar geçti - Modal'ı göster
      showEmailModal(emailInput.value);

      // Burada backend'e istek atılabilir
      console.log("Form başarıyla gönderildi:", {
        email: emailInput.value,
        firstName: $("#firstName")?.value,
        lastName: $("#lastName")?.value,
      });
    });

    console.log("✅ Form submission handler başlatıldı");
  };

  // ==========================================
  // Custom Styles
  // ==========================================

  const addCustomStyles = () => {
    if ($("#polikrami-custom-styles")) return;

    const style = document.createElement("style");
    style.id = "polikrami-custom-styles";
    style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }

            @keyframes slideOutRight {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .form-control.focused,
            .form-group.focused .form-control {
                border-color: #FF9A00 !important;
                box-shadow: 0 0 0 3px rgba(255, 154, 0, 0.1) !important;
            }

            .form-control.filled {
                background-color: #fff !important;
            }

            .toggle-password {
                transition: opacity 0.2s ease;
                cursor: pointer;
                background: none;
                border: none;
                padding: 5px;
                opacity: 0.6;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .toggle-password:hover,
            .toggle-password:focus {
                opacity: 1;
                outline: none;
            }

            .toggle-password svg {
                width: 20px;
                height: 20px;
                pointer-events: none;
            }

            .otp-input {
                transition: all 0.3s ease;
            }

            .otp-input:focus {
                border-color: #FF9A00 !important;
                box-shadow: 0 0 0 3px rgba(255, 154, 0, 0.1) !important;
                transform: scale(1.05);
            }

            select.form-control {
                cursor: pointer;
                transition: all 0.3s ease;
            }

            select.form-control:focus {
                border-color: #FF9A00 !important;
                box-shadow: 0 0 0 3px rgba(255, 154, 0, 0.1) !important;
            }

            .password-wrapper {
                position: relative;
            }

            .password-wrapper .toggle-password {
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 10;
            }

            .password-wrapper input {
                padding-right: 50px;
            }

            /* Modal Styles */
            .modal-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 9999;
                animation: fadeIn 0.3s ease;
            }

            .modal-overlay.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .modal-box {
                background: #FFFFFF;
                border-radius: 24px;
                padding: 48px 40px;
                max-width: 520px;
                width: 90%;
                position: relative;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.4s ease;
                text-align: center;
            }

            .modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 32px;
                height: 32px;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s ease;
            }

            .modal-close:hover {
                transform: rotate(90deg);
            }

            .modal-close svg {
                width: 24px;
                height: 24px;
                stroke: #999;
                stroke-width: 2;
            }

            .modal-title {
                font-size: 28px;
                font-weight: 700;
                color: #FF9900;
                margin-bottom: 24px;
                line-height: 1.3;
            }

            .modal-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .modal-icon svg {
                width: 100%;
                height: 100%;
                stroke: #4CAF50;
                stroke-width: 2;
                fill: none;
            }

            .modal-text {
                font-size: 16px;
                color: #666;
                line-height: 1.6;
                margin-bottom: 8px;
            }

            .modal-text strong {
                color: #333;
                font-weight: 600;
            }

            .modal-subtext {
                font-size: 14px;
                color: #999;
                line-height: 1.5;
                margin-top: 16px;
            }

            @media (max-width: 600px) {
                .modal-box {
                    padding: 36px 24px;
                }

                .modal-title {
                    font-size: 24px;
                }

                .modal-icon {
                    width: 64px;
                    height: 64px;
                }

                .modal-text {
                    font-size: 15px;
                }

                .modal-subtext {
                    font-size: 13px;
                }
            }
        `;
    document.head.appendChild(style);
  };

  // ==========================================
  // Password Strength Indicator
  // ==========================================

  const strengthIndicatorHTML = `
        <div class="password-strength-container">
            <div class="strength-item" data-rule="length">
                <div class="strength-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <span class="strength-text">En az 8 karakter</span>
            </div>
            <div class="strength-item" data-rule="complexity">
                <div class="strength-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <span class="strength-text">Bir büyük harf, bir rakam, özel karakter</span>
            </div>
        </div>
    `;

  const updateStrengthIndicator = (container, password) => {
    const lengthItem = container.querySelector('[data-rule="length"]');
    const complexityItem = container.querySelector('[data-rule="complexity"]');

    const validation = validatePasswordStrength(password);

    if (validation.checks.length) {
      lengthItem.classList.add("valid");
    } else {
      lengthItem.classList.remove("valid");
    }

    if (validation.checks.complexity) {
      complexityItem.classList.add("valid");
    } else {
      complexityItem.classList.remove("valid");
    }
  };

  const initPasswordStrength = (passwordInput) => {
    if (!passwordInput) return;

    const formGroup = passwordInput.closest(".form-group");
    if (!formGroup || formGroup.querySelector(".password-strength-container")) {
      return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = strengthIndicatorHTML;
    const indicator = tempDiv.firstElementChild;

    // Başlangıçta gizli
    indicator.style.display = "none";

    formGroup.appendChild(indicator);

    // Focus olunca göster
    passwordInput.addEventListener("focus", function () {
      indicator.style.display = "block";
    });

    // Blur olunca gizle
    passwordInput.addEventListener("blur", function () {
      indicator.style.display = "none";
    });

    // Input değişince güncelle
    passwordInput.addEventListener("input", function () {
      updateStrengthIndicator(indicator, this.value);
    });

    if (passwordInput.value) {
      updateStrengthIndicator(indicator, passwordInput.value);
    }

    console.log("✅ Password strength eklendi:", passwordInput.id);
  };

  const initAllPasswordFields = () => {
    const isSignupPage = $("#signupForm") !== null;
    const isResetPage = $("#resetForm") !== null;

    if (!isSignupPage && !isResetPage) {
      return;
    }

    if (isSignupPage) {
      const passwordInput = $("#password");
      if (passwordInput) {
        initPasswordStrength(passwordInput);
      }
    }

    if (isResetPage) {
      const newPasswordInput = $("#newPassword");
      if (newPasswordInput) {
        initPasswordStrength(newPasswordInput);
      }
    }
  };

  // ==========================================
  // Terms Checkbox Validation
  // ==========================================

  const validateTermsCheckbox = () => {
    const signupForms = $$("#signupForm");

    signupForms.forEach((form) => {
      if (!form) return;

      const termsCheckbox = form.querySelector("#termsAccept");
      if (termsCheckbox) {
        termsCheckbox.addEventListener("change", function () {
          const container = this.closest(".terms-checkbox");
          if (this.checked && container) container.classList.remove("error");
        });
      }

      const revenueCheckbox = form.querySelector("#revenueShareAccept");
      if (revenueCheckbox) {
        revenueCheckbox.addEventListener("change", function () {
          const container = this.closest(".terms-checkbox");
          if (this.checked && container) container.classList.remove("error");
        });
      }
    });
  };

  // ==========================================
  // Bottom Language Selector
  // ==========================================

  const syncBottomLanguageSelector = () => {
    const languageOptions = $$(".language-option");
    if (languageOptions.length === 0) return;

    const savedLang = (
      localStorage.getItem("selectedLanguage") || "TR"
    ).toLowerCase();

    languageOptions.forEach((option) => {
      const lang = option.getAttribute("data-lang");
      if (lang === savedLang) {
        option.classList.add("active");
      } else {
        option.classList.remove("active");
      }
    });

    languageOptions.forEach((option) => {
      option.addEventListener("click", function () {
        const selectedLang = this.getAttribute("data-lang").toUpperCase();

        languageOptions.forEach((opt) => opt.classList.remove("active"));
        this.classList.add("active");

        localStorage.setItem("selectedLanguage", selectedLang);

        const langText = $(".lang-text");
        if (langText) {
          const langNames = { TR: "Türkçe", EN: "English", DE: "Deutsch" };
          langText.textContent = langNames[selectedLang] || selectedLang;
        }

        console.log("Dil değiştirildi:", selectedLang);
      });
    });

    console.log("✅ Alt dil seçici başlatıldı");
  };

  // ==========================================
  // ESC Key Global Handler
  // ==========================================

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const emailModal = $("#emailModal");
      if (emailModal && emailModal.classList.contains("active")) {
        closeEmailModal();
      }

      const artistModal = $("#artistGuideModal");
      if (artistModal && artistModal.classList.contains("active")) {
        closeArtistGuideModal();
      }
    }
  });

  // ==========================================
  // Initialize
  // ==========================================

  const init = () => {
    addCustomStyles();
    initLanguageSwitcher();
    initProfileDropdown();
    setupPasswordToggle();
    enhanceInputs();
    enhanceSelects();
    enhanceOTPInputs();
    initAllPasswordFields();
    validateTermsCheckbox();
    initEmailModal();
    initFormSubmission();
    syncBottomLanguageSelector();
    initArtistGuideModal();

    console.log("✅ Polikrami Frontend System v3.0 Başlatıldı");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.polikrami = {
    $,
    $$,
    showMessage,
    validateEmail,
    validatePassword,
    validatePasswordStrength,
    showEmailModal,
    closeEmailModal,
    openArtistGuideModal,
    closeArtistGuideModal,
    init,
  };
})();
