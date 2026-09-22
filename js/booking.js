/**
 * Multi-Step Booking System Controller
 * Handles 7-step interactive booking modal, validation, photo upload preview,
 * summary generation, and confirmation screen.
 */
class BookingSystem {
  constructor(config) {
    this.config = config;
    this.currentStep = 1;
    this.totalSteps = 7;
    
    // Booking Form State
    this.bookingData = {
      serviceId: "",
      serviceName: "",
      urgency: "",
      urgencyLabel: "",
      isEmergency: false,
      date: "",
      timeSlot: "",
      fullName: "",
      phone: "",
      email: "",
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

    // Close on backdrop click
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    // Keyboard support
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

    // Reset or pre-fill state
    this.currentStep = 1;
    this.bookingData = {
      serviceId: initialState.serviceId || "",
      serviceName: "",
      urgency: initialState.urgency || "",
      urgencyLabel: "",
      isEmergency: false,
      date: "",
      timeSlot: "",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      preferredContact: "WhatsApp",
      problemDescription: initialState.problemNotes || "",
      photoDataUrl: null,
      photoFileName: null
    };

    // If pre-filled from assistant or service card
    if (this.bookingData.serviceId) {
      const match = this.config.SERVICES.find(s => s.id === this.bookingData.serviceId);
      if (match) {
        this.bookingData.serviceName = match.title;
        // If service is already specified, start at step 2 or stay at 1
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
        <h3 class="step-title">Select a Plumbing Service</h3>
        <p class="step-desc">Choose the category that best describes your requirement.</p>
      </div>
      <div class="services-select-grid" id="servicesSelectGrid"></div>
      <div class="step-nav-footer">
        <span class="step-note">Step 1: Required service category</span>
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
  // STEP 2: URGENCY
  // ==========================================
  renderStep2(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">How Urgent Is Your Need?</h3>
        <p class="step-desc">Help us assign the appropriate priority and scheduling window.</p>
      </div>

      <div class="urgency-select-list" id="urgencySelectList"></div>

      <div class="emergency-alert-banner" id="emergencyBanner" style="display: none;">
        <div class="alert-icon">🚨</div>
        <div class="alert-content">
          <strong>Immediate Dispatch Notice:</strong>
          <p>Emergency service availability may depend on location and plumber on-call capacity. For active floods or burst pipes, please call directly.</p>
          <a href="tel:${this.config.PHONE_RAW}" class="btn btn-emergency-call">
            📞 Call Now for Immediate Dispatch
          </a>
        </div>
      </div>

      <div class="step-nav-footer">
        <button type="button" class="btn btn-outline" id="step2BackBtn">← Back</button>
        <button type="button" class="btn btn-primary" id="step2NextBtn" disabled>
          Continue to Date Selection →
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
      if (this.bookingData.isEmergency) {
        banner.style.display = "flex";
      }
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
  // STEP 3: DATE SELECTION
  // ==========================================
  renderStep3(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">Select an Appointment Date</h3>
        <p class="step-desc">Pick an available day for your plumbing service or inspection.</p>
      </div>

      <div class="calendar-picker-wrapper">
        <div class="calendar-hint">
          <span>🟢 Available Dates</span>
          <span>🔒 Limited / Emergency Only</span>
        </div>
        <div class="calendar-date-cards" id="calendarDateCards"></div>
      </div>

      <div class="selected-date-preview" id="selectedDatePreview">
        Please tap an available date above to continue.
      </div>

      <div class="step-nav-footer">
        <button type="button" class="btn btn-outline" id="step3BackBtn">← Back</button>
        <button type="button" class="btn btn-primary" id="step3NextBtn" disabled>
          Continue to Time Slot →
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

    // Generate upcoming 10 days
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const isSunday = d.getDay() === 0;
      const isPast = false;
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const monthName = d.toLocaleDateString("en-US", { month: "short" });
      const dayNumber = d.getDate();
      const isoStr = d.toISOString().split("T")[0];

      const isAvailable = !isSunday || this.bookingData.isEmergency;

      const card = document.createElement("div");
      const isSelected = this.bookingData.date === isoStr;
      card.className = `date-card ${isSelected ? "selected" : ""} ${!isAvailable ? "disabled" : ""}`;
      card.innerHTML = `
        <span class="date-day-name">${i === 0 ? "Today" : (i === 1 ? "Tmrw" : dayName)}</span>
        <span class="date-number">${dayNumber}</span>
        <span class="date-month">${monthName}</span>
        <span class="date-status-dot ${isAvailable ? "available" : "unavailable"}"></span>
      `;

      if (isAvailable) {
        card.addEventListener("click", () => {
          cardsGrid.querySelectorAll(".date-card").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          this.bookingData.date = isoStr;
          this.bookingData.dateFormatted = d.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          });
          previewEl.innerHTML = `Selected Date: <strong>${this.bookingData.dateFormatted}</strong>`;
          nextBtn.removeAttribute("disabled");
        });
      } else {
        card.title = "Sundays reserved for emergency calls only";
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
  // STEP 4: TIME SLOT SELECTION
  // ==========================================
  renderStep4(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">Select a Time Window</h3>
        <p class="step-desc">Pick an arrival slot. Our plumber will provide a 30-minute notice prior to arrival.</p>
      </div>

      <div class="slots-meta-bar">
        <span class="slots-backend-notice">ℹ️ Configurable demonstration slots (connectable to Google Calendar / CRM)</span>
      </div>

      <div class="slots-grid" id="slotsGrid"></div>

      <div class="step-nav-footer">
        <button type="button" class="btn btn-outline" id="step4BackBtn">← Back</button>
        <button type="button" class="btn btn-primary" id="step4NextBtn" disabled>
          Continue to Your Details →
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
        <span class="slot-period">${slot.available ? slot.period : "Booked"}</span>
      `;

      if (slot.available) {
        item.addEventListener("click", () => {
          slotsGrid.querySelectorAll(".slot-pill").forEach(p => p.classList.remove("selected"));
          item.classList.add("selected");
          this.bookingData.timeSlot = slot.time;
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
  // STEP 5: CUSTOMER DETAILS
  // ==========================================
  renderStep5(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">Your Contact & Location Details</h3>
        <p class="step-desc">We use this to verify availability and dispatch technicians.</p>
      </div>

      <form id="customerDetailsForm" class="customer-form-grid" novalidate>
        <div class="form-group">
          <label for="custFullName">Full Name <span class="required">*</span></label>
          <input type="text" id="custFullName" class="form-input" placeholder="e.g. John Miller" value="${this.bookingData.fullName || ""}" required>
          <span class="form-error-msg" id="nameError">Please enter your full name.</span>
        </div>

        <div class="form-group">
          <label for="custPhone">Phone Number <span class="required">*</span></label>
          <input type="tel" id="custPhone" class="form-input" placeholder="e.g. (555) 123-4567" value="${this.bookingData.phone || ""}" required>
          <span class="form-error-msg" id="phoneError">Please enter a valid phone number.</span>
        </div>

        <div class="form-group">
          <label for="custEmail">Email Address <span class="required">*</span></label>
          <input type="email" id="custEmail" class="form-input" placeholder="e.g. john@example.com" value="${this.bookingData.email || ""}" required>
          <span class="form-error-msg" id="emailError">Please enter a valid email address.</span>
        </div>

        <div class="form-group">
          <label for="custAddress">Property Address / Service Location <span class="required">*</span></label>
          <input type="text" id="custAddress" class="form-input" placeholder="Street, Apt / Suite, ${this.config.CITY}" value="${this.bookingData.address || ""}" required>
          <span class="form-error-msg" id="addressError">Please provide your service address.</span>
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
          Continue to Problem Details →
        </button>
      </div>
    `;

    const form = wrap.querySelector("#customerDetailsForm");
    const nextBtn = wrap.querySelector("#step5NextBtn");
    const backBtn = wrap.querySelector("#step5BackBtn");

    backBtn.addEventListener("click", () => {
      this.currentStep = 4;
      this.renderStep();
    });

    // Contact method radio chips
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

      // Phone Validation (simple robust international/national check)
      const phoneClean = phoneInput.value.replace(/[^0-9]/g, "");
      if (phoneClean.length < 7) {
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
        <p class="step-desc">Share any specific details or photos to help our plumbers arrive prepared.</p>
      </div>

      <div class="form-group full-width">
        <label for="problemDescriptionText">Tell us briefly what is happening:</label>
        <textarea id="problemDescriptionText" class="form-textarea" rows="4" placeholder="Describe where the leak/clog is, what fixtures are affected, or any unusual noises...">${this.bookingData.problemDescription || ""}</textarea>
      </div>

      <div class="form-group full-width">
        <label>Upload a Photo (Optional):</label>
        <div class="photo-upload-zone" id="photoDropZone">
          <input type="file" id="photoFileInput" accept="image/*" class="photo-file-hidden">
          <div class="upload-placeholder" id="uploadPlaceholder">
            <span class="upload-icon">📷</span>
            <p><strong>Click to browse</strong> or drag & drop a photo here</p>
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
          Review Summary →
        </button>
      </div>
    `;

    const descArea = wrap.querySelector("#problemDescriptionText");
    const fileInput = wrap.querySelector("#photoFileInput");
    const dropZone = wrap.querySelector("#photoDropZone");
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
  // STEP 7: BOOKING SUMMARY
  // ==========================================
  renderStep7(container) {
    const wrap = document.createElement("div");
    wrap.className = "booking-step-pane animate-fade-in";
    wrap.innerHTML = `
      <div class="step-header">
        <h3 class="step-title">Review Booking Summary</h3>
        <p class="step-desc">Please verify your details before submitting your booking request.</p>
      </div>

      <div class="summary-card">
        <div class="summary-row">
          <span class="summary-label">Service:</span>
          <span class="summary-value highlight">${this.bookingData.serviceName || "Plumbing Service"}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Urgency:</span>
          <span class="summary-value">${this.bookingData.urgencyLabel || this.bookingData.urgency}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Requested Date:</span>
          <span class="summary-value">${this.bookingData.dateFormatted || this.bookingData.date}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Time Window:</span>
          <span class="summary-value">${this.bookingData.timeSlot}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Service Location:</span>
          <span class="summary-value">${this.bookingData.address}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Customer Name:</span>
          <span class="summary-value">${this.bookingData.fullName}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Contact:</span>
          <span class="summary-value">${this.bookingData.phone} • ${this.bookingData.email} (${this.bookingData.preferredContact})</span>
        </div>
        ${this.bookingData.problemDescription ? `
          <div class="summary-row full">
            <span class="summary-label">Notes:</span>
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
        ℹ️ <strong>Please Note:</strong> This submission constitutes an online <strong>Booking Request</strong>. Our dispatch team will confirm technician availability and contact you via ${this.bookingData.preferredContact}.
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
      confirmBtn.textContent = "Processing Request...";
      setTimeout(() => {
        this.submitBooking();
      }, 500);
    });

    container.appendChild(wrap);
  }

  // ==========================================
  // CONFIRMATION SCREEN
  // ==========================================
  submitBooking() {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const refCode = `PLB-2026-${randomNum}`;

    if (window.trackEvent) {
      window.trackEvent("booking_completed", {
        ref: refCode,
        service: this.bookingData.serviceName,
        urgency: this.bookingData.urgency
      });
    }

    const container = document.getElementById("bookingStepContent");
    if (!container) return;

    if (this.progressBar) this.progressBar.style.width = "100%";
    if (this.stepIndicator) this.stepIndicator.textContent = "Request Submitted";

    // Dynamic WhatsApp message with all booking details
    const waText = encodeURIComponent(
      `Hi ${this.config.COMPANY_NAME || "Team"},\nI just submitted a booking request on your website.\n\n` +
      `Reference: ${refCode}\n` +
      `Service: ${this.bookingData.serviceName}\n` +
      `Urgency: ${this.bookingData.urgencyLabel || this.bookingData.urgency}\n` +
      `Date: ${this.bookingData.dateFormatted || this.bookingData.date}\n` +
      `Time: ${this.bookingData.timeSlot}\n` +
      `Location: ${this.bookingData.address}\n` +
      `Name: ${this.bookingData.fullName}\n` +
      `Phone: ${this.bookingData.phone}\n\n` +
      `Could you please confirm this appointment?`
    );
    const waUrl = `https://wa.me/${this.config.WHATSAPP_NUMBER}?text=${waText}`;

    container.innerHTML = `
      <div class="booking-confirmation-pane animate-scale-up">
        <div class="conf-badge">🎉 Booking Request Received</div>
        <h3 class="conf-title">Thanks, ${this.escapeHtml(this.bookingData.fullName)}!</h3>
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
              <span class="conf-meta">Location</span>
              <strong>${this.escapeHtml(this.bookingData.address)}</strong>
            </div>
          </div>
          <div class="conf-item">
            <span class="conf-icon">📞</span>
            <div>
              <span class="conf-meta">Phone</span>
              <strong>${this.escapeHtml(this.bookingData.phone)}</strong>
            </div>
          </div>
        </div>

        <p class="conf-notice">
          ℹ️ Our dispatch manager will review technician routes and contact you shortly to confirm your scheduled arrival.
        </p>

        <div class="conf-action-buttons">
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp">
            💬 Contact on WhatsApp
          </a>
          <a href="tel:${this.config.PHONE_RAW}" class="btn btn-outline">
            📞 Call Us
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
