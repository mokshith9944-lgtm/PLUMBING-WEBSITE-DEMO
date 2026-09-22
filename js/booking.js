/**
 * Multi-Step Booking System Controller — United Kingdom Edition
 * Collects:
 * - Plumbing Service
 * - Urgency (Emergency, Today, Tomorrow, This Week, Quote)
 * - Preferred Date
 * - Preferred Time
 * - Full Name
 * - Phone Number (UK)
 * - Email
 * - UK Postcode
 * - Address
 * - Problem Description & Photo Upload (Optional)
 */
class BookingSystem {
  constructor(config) {
    this.config = config;
    this.currentStep = 1;
    this.totalSteps = 7;
    
    // Booking Form State (UK Standard)
    this.bookingData = {
      serviceId: "",
      serviceName: "",
      urgency: "",
      urgencyLabel: "",
      isEmergency: false,
      date: "",
      dateFormatted: "",
      timeSlot: "",
      fullName: "",
      phone: "",
      email: "",
      postcode: "",
      address: "",
      preferredContact: "WhatsApp",
      problemDescription: "",
      photoDataUrl: null,
      photoFileName: null
    };

    this.initDOM();
  }

  initDOM() {
    this.modal = document.getElementById("bookingModal");
    this.modalBody = document.getElementById("bookingModalBody");
    this.closeBtn = document.getElementById("bookingCloseBtn");
    this.progressBar = document.getElementById("bookingProgressBar");
    this.stepIndicator = document.getElementById("bookingStepIndicator");

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.modal && this.modal.classList.contains("active");
  }

  open(initialState = {}) {
    if (!this.modal) return;

    this.currentStep = 1;
    this.bookingData = {
      serviceId: initialState.serviceId || "",
      serviceName: "",
      urgency: initialState.urgency || "",
      urgencyLabel: "",
      isEmergency: false,
      date: "",
      dateFormatted: "",
      timeSlot: "",
      fullName: "",
      phone: "",
      email: "",
      postcode: initialState.postcode || "",
      address: "",
      preferredContact: "WhatsApp",
      problemDescription: initialState.problemNotes || "",
      photoDataUrl: null,
      photoFileName: null
    };

    if (this.bookingData.serviceId) {
      const match = this.config.SERVICES.find(s => s.id === this.bookingData.serviceId);
      if (match) {
        this.bookingData.serviceName = match.title;
        this.currentStep = 2;
      }
    }

    this.modal.classList.add("active");
    document.body.classList.add("modal-open");
    this.renderStep();

    if (window.trackEvent) {
      window.trackEvent("booking_started", { prefilledService: this.bookingData.serviceId });
    }
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  updateProgress() {
    if (this.progressBar) {
      const pct = (this.currentStep / this.totalSteps) * 100;
      this.progressBar.style.width = `${pct}%`;
    }
    if (this.stepIndicator) {
      this.stepIndicator.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
  }

  renderStep() {
    this.updateProgress();
    const container = document.getElementById("bookingStepContent");
    if (!container) return;

    container.innerHTML = "";

    switch (this.currentStep) {
      case 1:
        this.renderStep1(container);
        break;
      case 2:
        this.renderStep2(container);
        break;
      case 3:
        this.renderStep3(container);
        break;
      case 4:
        this.renderStep4(container);
        break;
      case 5:
        this.renderStep5(container);
        break;
      case 6:
        this.renderStep6(container);
        break;
      case 7:
        this.renderStep7(container);
        break;
      default:
        this.renderStep1(container);
    }
  }

  // ==========================================
  // STEP 1: SERVICE SELECTION
  // ==========================================
  renderStep1(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">Select a Plumbing or Heating Service</h3>
        <p class="step-desc">Choose the service you require for your UK home or commercial property.</p>
      </div>
      <div class="services-select-grid" id="servicesSelectGrid"></div>
      <div class="step-nav-footer">
        <span class="step-note">Step 1: Required plumbing service</span>
        <button type="button" class="btn btn-primary" id="step1NextBtn" disabled>
          Continue to Urgency →
        </button>
      </div>
    `;

    const grid = wrap.querySelector("#servicesSelectGrid");
    const nextBtn = wrap.querySelector("#step1NextBtn");

    this.config.SERVICES.forEach((srv) => {
      const card = document.createElement("div");
      card.className = `service-choice-card ${this.bookingData.serviceId === srv.id ? "selected" : ""}`;
      card.innerHTML = `
        <span class="service-choice-icon">${srv.icon}</span>
        <div class="service-choice-info">
          <h4 class="service-choice-title">${srv.title}</h4>
          <p class="service-choice-desc">${srv.shortDesc}</p>
        </div>
        <div class="service-choice-check">✓</div>
      `;

      card.addEventListener("click", () => {
        wrap.querySelectorAll(".service-choice-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        this.bookingData.serviceId = srv.id;
        this.bookingData.serviceName = srv.title;
        nextBtn.removeAttribute("disabled");

        if (window.trackEvent) {
          window.trackEvent("service_selected", { service: srv.title });
        }
      });

      grid.appendChild(card);
    });

    if (this.bookingData.serviceId) {
      nextBtn.removeAttribute("disabled");
    }

    nextBtn.addEventListener("click", () => {
      if (this.bookingData.serviceId) {
        this.currentStep = 2;
        this.renderStep();
      }
    });

    container.appendChild(wrap);
  }

  // ==========================================
  // STEP 2: URGENCY (UK Standards)
  // ==========================================
  renderStep2(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">How Urgent Is Your Request?</h3>
        <p class="step-desc">Help us assign our nearest local UK plumber or priority on-call dispatch.</p>
      </div>

      <div class="urgency-select-list" id="urgencySelectList"></div>

      <div class="emergency-alert-banner" id="emergencyBanner" style="display: none;">
        <div class="alert-icon">🚨</div>
        <div class="alert-content">
          <strong>24/7 Emergency Plumber Alert:</strong>
          <p>For uncontrollable burst pipes, ceiling leaks, or active flooding, please call our direct emergency dispatch line immediately for priority response.</p>
          <a href="tel:${this.config.PHONE_RAW}" class="btn btn-emergency-call">
            📞 Call Now for Immediate UK Dispatch
          </a>
        </div>
      </div>

      <div class="step-nav-footer">
        <button type="button" class="btn btn-outline" id="step2BackBtn">← Back</button>
        <button type="button" class="btn btn-primary" id="step2NextBtn" disabled>
          Continue to Preferred Date →
        </button>
      </div>
    `;

    const list = wrap.querySelector("#urgencySelectList");
    const banner = wrap.querySelector("#emergencyBanner");
    const nextBtn = wrap.querySelector("#step2NextBtn");
    const backBtn = wrap.querySelector("#step2BackBtn");

    backBtn.addEventListener("click", () => {
      this.currentStep = 1;
      this.renderStep();
    });

    this.config.URGENCY_LEVELS.forEach((lvl) => {
      const item = document.createElement("div");
      const isSelected = this.bookingData.urgency === lvl.id;
      item.className = `urgency-choice-item ${isSelected ? "selected" : ""} ${lvl.isEmergency ? "is-emergency-opt" : ""}`;
      item.innerHTML = `
        <div class="urgency-choice-header">
          <span class="urgency-choice-title">${lvl.label}</span>
          <span class="urgency-choice-radio"></span>
        </div>
        <span class="urgency-choice-note">${lvl.note}</span>
      `;

      item.addEventListener("click", () => {
        list.querySelectorAll(".urgency-choice-item").forEach(i => i.classList.remove("selected"));
        item.classList.add("selected");
        this.bookingData.urgency = lvl.id;
        this.bookingData.urgencyLabel = lvl.label;
        this.bookingData.isEmergency = lvl.isEmergency;

        if (lvl.isEmergency) {
          banner.style.display = "flex";
          if (window.trackEvent) window.trackEvent("emergency_booking", { service: this.bookingData.serviceName });
        } else {
          banner.style.display = "none";
        }

        nextBtn.removeAttribute("disabled");
      });

      list.appendChild(item);
    });

    if (this.bookingData.urgency) {
      nextBtn.removeAttribute("disabled");
      if (this.bookingData.isEmergency) banner.style.display = "flex";
    }

    nextBtn.addEventListener("click", () => {
      if (this.bookingData.urgency) {
        this.currentStep = 3;
        this.renderStep();
      }
    });

    container.appendChild(wrap);
  }

  // ==========================================
  // STEP 3: PREFERRED DATE (Today / Tomorrow / Upcoming)
  // ==========================================
  renderStep3(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">Select Preferred Date</h3>
        <p class="step-desc">Pick an available day for your plumber visit or boiler service.</p>
      </div>

      <div class="calendar-picker-wrapper">
        <div class="calendar-hint">
          <span>🟢 Available UK Engineer Slots</span>
          <span>🔒 Emergency Only</span>
        </div>
        <div class="calendar-date-cards" id="calendarDateCards"></div>
      </div>

      <div class="selected-date-preview" id="selectedDatePreview">
        Please tap an available date above to continue.
      </div>

      <div class="step-nav-footer">
        <button type="button" class="btn btn-outline" id="step3BackBtn">← Back</button>
        <button type="button" class="btn btn-primary" id="step3NextBtn" disabled>
          Continue to Preferred Time →
        </button>
      </div>
    `;

    const cardsGrid = wrap.querySelector("#calendarDateCards");
    const previewEl = wrap.querySelector("#selectedDatePreview");
    const nextBtn = wrap.querySelector("#step3NextBtn");
    const backBtn = wrap.querySelector("#step3BackBtn");

    backBtn.addEventListener("click", () => {
      this.currentStep = 2;
      this.renderStep();
    });

    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const isSunday = d.getDay() === 0;
      const dayName = d.toLocaleDateString("en-GB", { weekday: "short" });
      const monthName = d.toLocaleDateString("en-GB", { month: "short" });
      const dayNumber = d.getDate();
      const isoStr = d.toISOString().split("T")[0];

      const isAvailable = !isSunday || this.bookingData.isEmergency;

      let displayLabel = dayName;
      if (i === 0) displayLabel = "Today";
      else if (i === 1) displayLabel = "Tomorrow";

      const card = document.createElement("div");
      const isSelected = this.bookingData.date === isoStr;
      card.className = `date-card ${isSelected ? "selected" : ""} ${!isAvailable ? "disabled" : ""}`;
      card.innerHTML = `
        <span class="date-day-name">${displayLabel}</span>
        <span class="date-number">${dayNumber}</span>
        <span class="date-month">${monthName}</span>
        <span class="date-status-dot ${isAvailable ? "available" : "unavailable"}"></span>
      `;

      if (isAvailable) {
        card.addEventListener("click", () => {
          cardsGrid.querySelectorAll(".date-card").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          this.bookingData.date = isoStr;
          this.bookingData.dateFormatted = `${displayLabel}, ${d.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}`;
          previewEl.innerHTML = `Selected Date: <strong>${this.bookingData.dateFormatted}</strong>`;
          nextBtn.removeAttribute("disabled");
        });
      } else {
        card.title = "Sundays reserved for 24/7 emergency callouts";
      }

      cardsGrid.appendChild(card);
    }

    if (this.bookingData.date) {
      previewEl.innerHTML = `Selected Date: <strong>${this.bookingData.dateFormatted || this.bookingData.date}</strong>`;
      nextBtn.removeAttribute("disabled");
    }

    nextBtn.addEventListener("click", () => {
      if (this.bookingData.date) {
        this.currentStep = 4;
        this.renderStep();
      }
    });

    container.appendChild(wrap);
  }

  // ==========================================
  // STEP 4: PREFERRED TIME WINDOW
  // ==========================================
  renderStep4(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">Select Preferred Time Window</h3>
        <p class="step-desc">Pick your preferred engineer arrival window. Our plumber will call 30 minutes ahead.</p>
      </div>

      <div class="slots-meta-bar">
        <span class="slots-backend-notice">🇬🇧 UK Operating Slots (Morning, Afternoon & Evening Windows)</span>
      </div>

      <div class="slots-grid" id="slotsGrid"></div>

      <div class="step-nav-footer">
        <button type="button" class="btn btn-outline" id="step4BackBtn">← Back</button>
        <button type="button" class="btn btn-primary" id="step4NextBtn" disabled>
          Continue to UK Address Details →
        </button>
      </div>
    `;

    const slotsGrid = wrap.querySelector("#slotsGrid");
    const nextBtn = wrap.querySelector("#step4NextBtn");
    const backBtn = wrap.querySelector("#step4BackBtn");

    backBtn.addEventListener("click", () => {
      this.currentStep = 3;
      this.renderStep();
    });

    this.config.BOOKING_SLOTS.forEach((slot) => {
      const item = document.createElement("button");
      item.type = "button";
      const isSelected = this.bookingData.timeSlot === slot.time;
      item.className = `slot-pill ${isSelected ? "selected" : ""} ${!slot.available ? "slot-unavailable" : ""}`;
      item.disabled = !slot.available;
      item.innerHTML = `
        <span class="slot-time">${slot.time}</span>
        <span class="slot-period">${slot.available ? slot.period : "Fully Booked"}</span>
      `;

      if (slot.available) {
        item.addEventListener("click", () => {
          slotsGrid.querySelectorAll(".slot-pill").forEach(p => p.classList.remove("selected"));
          item.classList.add("selected");
          this.bookingData.timeSlot = `${slot.time} (${slot.period})`;
          nextBtn.removeAttribute("disabled");
        });
      }

      slotsGrid.appendChild(item);
    });

    if (this.bookingData.timeSlot) {
      nextBtn.removeAttribute("disabled");
    }

    nextBtn.addEventListener("click", () => {
      if (this.bookingData.timeSlot) {
        this.currentStep = 5;
        this.renderStep();
      }
    });

    container.appendChild(wrap);
  }

  // ==========================================
  // STEP 5: UK CUSTOMER DETAILS (Postcode, Phone, Address)
  // ==========================================
  renderStep5(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">Your UK Contact & Property Details</h3>
        <p class="step-desc">Please provide your UK postcode and address so we can dispatch the nearest local plumber.</p>
      </div>

      <form id="customerDetailsForm" class="customer-form-grid" novalidate>
        <div class="form-group">
          <label for="custFullName">Full Name <span class="required">*</span></label>
          <input type="text" id="custFullName" class="form-input" placeholder="e.g. James Smith" value="${this.bookingData.fullName || ""}" required>
          <span class="form-error-msg" id="nameError">Please enter your full name.</span>
        </div>

        <div class="form-group">
          <label for="custPhone">UK Phone Number <span class="required">*</span></label>
          <input type="tel" id="custPhone" class="form-input" placeholder="e.g. 07700 900123 or 020 7946 0912" value="${this.bookingData.phone || ""}" required>
          <span class="form-error-msg" id="phoneError">Please enter a valid UK telephone number.</span>
        </div>

        <div class="form-group">
          <label for="custEmail">Email Address <span class="required">*</span></label>
          <input type="email" id="custEmail" class="form-input" placeholder="e.g. james.smith@example.co.uk" value="${this.bookingData.email || ""}" required>
          <span class="form-error-msg" id="emailError">Please enter a valid email address.</span>
        </div>

        <div class="form-group">
          <label for="custPostcode">UK Postcode <span class="required">*</span></label>
          <input type="text" id="custPostcode" class="form-input uppercase" placeholder="e.g. SW1A 1AA or EC1A 1BB" value="${this.bookingData.postcode || ""}" required maxlength="10">
          <span class="form-error-msg" id="postcodeError">Please enter a valid UK postcode (e.g. SW1A 1AA).</span>
        </div>

        <div class="form-group full-width">
          <label for="custAddress">Property Address / Street Name <span class="required">*</span></label>
          <input type="text" id="custAddress" class="form-input" placeholder="e.g. 14 High Street, Flat 2B" value="${this.bookingData.address || ""}" required>
          <span class="form-error-msg" id="addressError">Please provide your property address.</span>
        </div>

        <div class="form-group full-width">
          <label>Preferred Contact Method</label>
          <div class="contact-method-options">
            <label class="radio-chip ${this.bookingData.preferredContact === "Phone" ? "selected" : ""}">
              <input type="radio" name="contactMethod" value="Phone" ${this.bookingData.preferredContact === "Phone" ? "checked" : ""}>
              <span>📞 Phone Call</span>
            </label>
            <label class="radio-chip ${this.bookingData.preferredContact === "WhatsApp" ? "selected" : ""}">
              <input type="radio" name="contactMethod" value="WhatsApp" ${this.bookingData.preferredContact === "WhatsApp" ? "checked" : ""}>
              <span>💬 WhatsApp</span>
            </label>
            <label class="radio-chip ${this.bookingData.preferredContact === "Email" ? "selected" : ""}">
              <input type="radio" name="contactMethod" value="Email" ${this.bookingData.preferredContact === "Email" ? "checked" : ""}>
              <span>📧 Email</span>
            </label>
          </div>
        </div>
      </form>

      <div class="step-nav-footer">
        <button type="button" class="btn btn-outline" id="step5BackBtn">← Back</button>
        <button type="button" class="btn btn-primary" id="step5NextBtn">
          Continue to Problem Description →
        </button>
      </div>
    `;

    const nextBtn = wrap.querySelector("#step5NextBtn");
    const backBtn = wrap.querySelector("#step5BackBtn");

    backBtn.addEventListener("click", () => {
      this.currentStep = 4;
      this.renderStep();
    });

    wrap.querySelectorAll("input[name='contactMethod']").forEach((radio) => {
      radio.addEventListener("change", (e) => {
        wrap.querySelectorAll(".radio-chip").forEach(c => c.classList.remove("selected"));
        e.target.closest(".radio-chip").classList.add("selected");
        this.bookingData.preferredContact = e.target.value;
      });
    });

    nextBtn.addEventListener("click", () => {
      const nameInput = wrap.querySelector("#custFullName");
      const phoneInput = wrap.querySelector("#custPhone");
      const emailInput = wrap.querySelector("#custEmail");
      const postcodeInput = wrap.querySelector("#custPostcode");
      const addressInput = wrap.querySelector("#custAddress");

      let isValid = true;

      // Full Name Validation
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        wrap.querySelector("#nameError").style.display = "block";
        nameInput.classList.add("input-error");
        isValid = false;
      } else {
        wrap.querySelector("#nameError").style.display = "none";
        nameInput.classList.remove("input-error");
      }

      // UK Phone Number Validation
      const phoneClean = phoneInput.value.replace(/[^0-9+]/g, "");
      if (phoneClean.length < 9) {
        wrap.querySelector("#phoneError").style.display = "block";
        phoneInput.classList.add("input-error");
        isValid = false;
      } else {
        wrap.querySelector("#phoneError").style.display = "none";
        phoneInput.classList.remove("input-error");
      }

      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        wrap.querySelector("#emailError").style.display = "block";
        emailInput.classList.add("input-error");
        isValid = false;
      } else {
        wrap.querySelector("#emailError").style.display = "none";
        emailInput.classList.remove("input-error");
      }

      // UK Postcode Validation (standard official UK format: e.g. SW1A 1AA, W1B 2HW, M1 1AA, etc.)
      const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
      const formattedPostcode = postcodeInput.value.trim().toUpperCase();
      if (!ukPostcodeRegex.test(formattedPostcode) && formattedPostcode.length < 5) {
        wrap.querySelector("#postcodeError").style.display = "block";
        postcodeInput.classList.add("input-error");
        isValid = false;
      } else {
        wrap.querySelector("#postcodeError").style.display = "none";
        postcodeInput.classList.remove("input-error");
      }

      // Address Validation
      if (!addressInput.value.trim() || addressInput.value.trim().length < 4) {
        wrap.querySelector("#addressError").style.display = "block";
        addressInput.classList.add("input-error");
        isValid = false;
      } else {
        wrap.querySelector("#addressError").style.display = "none";
        addressInput.classList.remove("input-error");
      }

      if (isValid) {
        this.bookingData.fullName = nameInput.value.trim();
        this.bookingData.phone = phoneInput.value.trim();
        this.bookingData.email = emailInput.value.trim();
        this.bookingData.postcode = formattedPostcode;
        this.bookingData.address = addressInput.value.trim();
        this.currentStep = 6;
        this.renderStep();
      }
    });

    container.appendChild(wrap);
  }

  // ==========================================
  // STEP 6: PROBLEM DESCRIPTION & PHOTO UPLOAD
  // ==========================================
  renderStep6(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">Problem Description & Photos</h3>
        <p class="step-desc">Tell us briefly what is happening to help our UK engineer arrive with the correct parts.</p>
      </div>

      <div class="form-group full-width">
        <label for="problemDescriptionText">Tell us briefly what is happening:</label>
        <textarea id="problemDescriptionText" class="form-textarea" rows="4" placeholder="Describe the leak, boiler error code, radiator issue, or blocked drain...">${this.bookingData.problemDescription || ""}</textarea>
      </div>

      <div class="form-group full-width">
        <label>Upload a Photo (Optional):</label>
        <div class="photo-upload-zone" id="photoDropZone">
          <input type="file" id="photoFileInput" accept="image/*" class="photo-file-hidden">
          <div class="upload-placeholder" id="uploadPlaceholder">
            <span class="upload-icon">📷</span>
            <p><strong>Click to browse</strong> or drag & drop a photo of the plumbing issue</p>
            <span class="upload-hint">JPG, PNG, WebP up to 10MB</span>
          </div>
          <div class="photo-preview-box" id="photoPreviewBox" style="${this.bookingData.photoDataUrl ? "display: flex;" : "display: none;"}">
            <img id="photoPreviewImg" src="${this.bookingData.photoDataUrl || ""}" alt="Plumbing problem preview">
            <div class="photo-meta">
              <span id="photoName">${this.bookingData.photoFileName || "Problem photo"}</span>
              <button type="button" class="btn-remove-photo" id="btnRemovePhoto">Remove photo ✕</button>
            </div>
          </div>
        </div>
      </div>

      <div class="step-nav-footer">
        <button type="button" class="btn btn-outline" id="step6BackBtn">← Back</button>
        <button type="button" class="btn btn-primary" id="step6NextBtn">
          Review Booking Summary →
        </button>
      </div>
    `;

    const descArea = wrap.querySelector("#problemDescriptionText");
    const fileInput = wrap.querySelector("#photoFileInput");
    const placeholder = wrap.querySelector("#uploadPlaceholder");
    const previewBox = wrap.querySelector("#photoPreviewBox");
    const previewImg = wrap.querySelector("#photoPreviewImg");
    const nameEl = wrap.querySelector("#photoName");
    const removeBtn = wrap.querySelector("#btnRemovePhoto");
    const nextBtn = wrap.querySelector("#step6NextBtn");
    const backBtn = wrap.querySelector("#step6BackBtn");

    backBtn.addEventListener("click", () => {
      this.currentStep = 5;
      this.renderStep();
    });

    placeholder.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          alert("File size exceeds 10MB. Please select a smaller photo.");
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          this.bookingData.photoDataUrl = event.target.result;
          this.bookingData.photoFileName = file.name;
          previewImg.src = event.target.result;
          nameEl.textContent = file.name;
          placeholder.style.display = "none";
          previewBox.style.display = "flex";
        };
        reader.readAsDataURL(file);
      }
    });

    removeBtn.addEventListener("click", () => {
      this.bookingData.photoDataUrl = null;
      this.bookingData.photoFileName = null;
      fileInput.value = "";
      previewImg.src = "";
      previewBox.style.display = "none";
      placeholder.style.display = "block";
    });

    nextBtn.addEventListener("click", () => {
      this.bookingData.problemDescription = descArea.value.trim();
      this.currentStep = 7;
      this.renderStep();
    });

    container.appendChild(wrap);
  }

  // ==========================================
  // STEP 7: SUMMARY & CONFIRMATION
  // ==========================================
  renderStep7(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">Review Booking Summary</h3>
        <p class="step-desc">Please review your booking request details before submitting to our UK dispatch desk.</p>
      </div>

      <div class="summary-card">
        <div class="summary-row">
          <span class="summary-label">Plumbing Service:</span>
          <span class="summary-value highlight">${this.bookingData.serviceName || "Plumbing Service"}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Urgency:</span>
          <span class="summary-value">${this.bookingData.urgencyLabel || this.bookingData.urgency}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Preferred Date:</span>
          <span class="summary-value">${this.bookingData.dateFormatted || this.bookingData.date}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Preferred Time Window:</span>
          <span class="summary-value">${this.bookingData.timeSlot}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">UK Postcode & Address:</span>
          <span class="summary-value"><strong>${this.bookingData.postcode}</strong> • ${this.bookingData.address}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Customer Name:</span>
          <span class="summary-value">${this.bookingData.fullName}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Contact Details:</span>
          <span class="summary-value">${this.bookingData.phone} • ${this.bookingData.email} (${this.bookingData.preferredContact})</span>
        </div>
        ${this.bookingData.problemDescription ? `
          <div class="summary-row full">
            <span class="summary-label">Problem Description:</span>
            <span class="summary-value">${this.bookingData.problemDescription}</span>
          </div>
        ` : ""}
        ${this.bookingData.photoDataUrl ? `
          <div class="summary-row full">
            <span class="summary-label">Attached Photo:</span>
            <div class="summary-thumb-box">
              <img src="${this.bookingData.photoDataUrl}" alt="Attached preview" class="summary-thumb">
              <span>${this.bookingData.photoFileName || "photo"}</span>
            </div>
          </div>
        ` : ""}
      </div>

      <div class="backend-disclaimer-box">
        ℹ️ <strong>UK Booking Notice:</strong> This submission constitutes an online <strong>Booking Request</strong>. All estimates and quotes are provided in <strong>GBP (£)</strong> without hidden charges. Our local dispatch manager will confirm your engineer arrival window via ${this.bookingData.preferredContact}.
      </div>

      <div class="step-nav-footer">
        <button type="button" class="btn btn-outline" id="step7BackBtn">← Back to Edit</button>
        <button type="button" class="btn btn-primary btn-cta" id="confirmBookingBtn">
          ✓ Confirm Booking Request
        </button>
      </div>
    `;

    const backBtn = wrap.querySelector("#step7BackBtn");
    const confirmBtn = wrap.querySelector("#confirmBookingBtn");

    backBtn.addEventListener("click", () => {
      this.currentStep = 6;
      this.renderStep();
    });

    confirmBtn.addEventListener("click", () => {
      confirmBtn.disabled = true;
      confirmBtn.textContent = "Processing UK Request...";
      setTimeout(() => {
        this.submitBooking();
      }, 500);
    });

    container.appendChild(wrap);
  }

  // ==========================================
  // BOOKING CONFIRMATION SCREEN
  // ==========================================
  submitBooking() {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const refCode = `PLB-UK-2026-${randomNum}`;

    if (window.trackEvent) {
      window.trackEvent("booking_completed", {
        ref: refCode,
        service: this.bookingData.serviceName,
        urgency: this.bookingData.urgency,
        postcode: this.bookingData.postcode
      });
    }

    const container = document.getElementById("bookingStepContent");
    if (!container) return;

    if (this.progressBar) this.progressBar.style.width = "100%";
    if (this.stepIndicator) this.stepIndicator.textContent = "Request Submitted";

    const waText = encodeURIComponent(
      `Hi ${this.config.COMPANY_NAME || "Valvoro Team"},\nI have submitted a booking request on your UK website.\n\n` +
      `Reference: ${refCode}\n` +
      `Service: ${this.bookingData.serviceName}\n` +
      `Urgency: ${this.bookingData.urgencyLabel || this.bookingData.urgency}\n` +
      `Date: ${this.bookingData.dateFormatted || this.bookingData.date}\n` +
      `Time Window: ${this.bookingData.timeSlot}\n` +
      `Postcode: ${this.bookingData.postcode}\n` +
      `Address: ${this.bookingData.address}\n` +
      `Customer Name: ${this.bookingData.fullName}\n` +
      `Phone: ${this.bookingData.phone}\n\n` +
      `Could you please confirm the plumber arrival time?`
    );
    const waUrl = `https://wa.me/${this.config.WHATSAPP_NUMBER}?text=${waText}`;

    container.innerHTML = `
      <div class="booking-confirmation-pane animate-scale-up">
        <div class="conf-badge">🎉 Booking Request Received</div>
        <h3 class="conf-title">Thank you, ${this.escapeHtml(this.bookingData.fullName)}!</h3>
        <p class="conf-subtitle">We've received your request for <strong>${this.escapeHtml(this.bookingData.serviceName)}</strong>.</p>
        
        <div class="conf-ref-box">
          <span class="ref-label">Booking Reference:</span>
          <span class="ref-code">${refCode}</span>
        </div>

        <div class="conf-details-card">
          <div class="conf-item">
            <span class="conf-icon">📅</span>
            <div>
              <span class="conf-meta">Date</span>
              <strong>${this.bookingData.dateFormatted || this.bookingData.date}</strong>
            </div>
          </div>
          <div class="conf-item">
            <span class="conf-icon">⏰</span>
            <div>
              <span class="conf-meta">Time Window</span>
              <strong>${this.bookingData.timeSlot}</strong>
            </div>
          </div>
          <div class="conf-item">
            <span class="conf-icon">📍</span>
            <div>
              <span class="conf-meta">Postcode & Address</span>
              <strong>${this.escapeHtml(this.bookingData.postcode)} • ${this.escapeHtml(this.bookingData.address)}</strong>
            </div>
          </div>
          <div class="conf-item">
            <span class="conf-icon">📞</span>
            <div>
              <span class="conf-meta">Telephone</span>
              <strong>${this.escapeHtml(this.bookingData.phone)}</strong>
            </div>
          </div>
        </div>

        <p class="conf-notice">
          ℹ️ Our UK dispatch manager will review your local engineer route and contact you shortly to confirm your booking.
        </p>

        <div class="conf-action-buttons">
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp">
            💬 Contact on WhatsApp
          </a>
          <a href="tel:${this.config.PHONE_RAW}" class="btn btn-outline">
            📞 Call Now
          </a>
          <button type="button" class="btn btn-secondary" id="confBackToSiteBtn">
            ← Back to Website
          </button>
        </div>
      </div>
    `;

    const backBtn = container.querySelector("#confBackToSiteBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => this.close());
    }
  }

  escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[m]);
  }
}

// Global initialization helper
window.initBookingSystem = function() {
  if (typeof SITE_CONFIG !== "undefined") {
    window.bookingInstance = new BookingSystem(SITE_CONFIG);
    window.openBookingModal = (initialState) => {
      window.bookingInstance.open(initialState);
    };
  }
};
