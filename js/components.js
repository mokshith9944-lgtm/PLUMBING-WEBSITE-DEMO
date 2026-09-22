/**
 * Interactive UI Components:
 * - Service Detail Modal
 * - Before / After Comparison Slider
 * - Testimonial Carousel
 * - Accordion FAQ
 * - Service Area Click Interactivity
 */

// ==========================================
// 1. SERVICE DETAIL MODAL
// ==========================================
class ServiceModalManager {
  constructor(config) {
    this.config = config;
    this.modal = document.getElementById("serviceDetailModal");
    this.body = document.getElementById("serviceDetailBody");
    this.closeBtn = document.getElementById("serviceModalCloseBtn");

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) this.close();
    });

    this.bindCardClicks();
  }

  isOpen() {
    return this.modal && this.modal.classList.contains("active");
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  bindCardClicks() {
    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        // Prevent opening if user clicked a direct CTA inside the card
        if (e.target.closest("button") || e.target.closest("a")) return;
        const srvId = card.getAttribute("data-service-id");
        const srv = this.config.SERVICES.find(s => s.id === srvId);
        if (srv) this.open(srv);
      });

      const exploreBtn = card.querySelector(".service-explore-btn");
      if (exploreBtn) {
        exploreBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const srvId = card.getAttribute("data-service-id");
          const srv = this.config.SERVICES.find(s => s.id === srvId);
          if (srv) this.open(srv);
        });
      }
    });
  }

  open(service) {
    if (!this.modal || !this.body) return;

    const waText = encodeURIComponent(
      `Hi ${this.config.COMPANY_NAME || "Team"},\nI'm inquiring about your service: ${service.title}.\nLocation: ${this.config.CITY}\nCan you provide more information or check availability?`
    );
    const waUrl = `https://wa.me/${this.config.WHATSAPP_NUMBER}?text=${waText}`;

    this.body.innerHTML = `
      <div class="service-modal-header">
        <div class="service-modal-icon-badge">${service.icon}</div>
        <div>
          <span class="service-badge-pill">${service.badge || "Professional Service"}</span>
          <h2 class="service-modal-title">${service.title}</h2>
        </div>
      </div>

      <div class="service-modal-desc">
        <p>${service.description}</p>
      </div>

      <div class="service-modal-columns">
        <div class="service-modal-col">
          <h4 class="col-title">⚠️ Common Signs You Need This:</h4>
          <ul class="col-list">
            ${service.commonSigns.map(sign => `<li>✓ ${sign}</li>`).join("")}
          </ul>
        </div>
        <div class="service-modal-col">
          <h4 class="col-title">🔧 What Our Plumbers Help With:</h4>
          <ul class="col-list">
            ${service.whatPlumberDoes.map(item => `<li>• ${item}</li>`).join("")}
          </ul>
        </div>
      </div>

      <div class="service-urgency-banner">
        <strong>Typical Urgency:</strong>
        <span>${service.urgency}</span>
      </div>

      <div class="service-modal-actions">
        <button type="button" class="btn btn-primary btn-cta" id="modalBookServiceBtn">
          📅 Book This Service
        </button>
        <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp">
          💬 WhatsApp Inquiry
        </a>
        <a href="tel:${this.config.PHONE_RAW}" class="btn btn-outline">
          📞 Call Now
        </a>
      </div>
    `;

    const bookBtn = this.body.querySelector("#modalBookServiceBtn");
    if (bookBtn) {
      bookBtn.addEventListener("click", () => {
        this.close();
        if (window.openBookingModal) {
          window.openBookingModal({
            serviceId: service.id,
            urgency: service.recommendedUrgencyValue || "today"
          });
        }
      });
    }

    this.modal.classList.add("active");
    document.body.classList.add("modal-open");
  }
}

// ==========================================
// 2. BEFORE / AFTER COMPARISON SLIDER
// ==========================================
class BeforeAfterSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.slider = this.container.querySelector(".slider-handle");
    this.afterImage = this.container.querySelector(".slider-image-after");
    this.isDragging = false;

    this.init();
  }

  init() {
    if (!this.slider || !this.afterImage) return;

    const setPosition = (x) => {
      const rect = this.container.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      if (pos < 0.05) pos = 0.05;
      if (pos > 0.95) pos = 0.95;

      const pct = pos * 100;
      this.slider.style.left = `${pct}%`;
      this.afterImage.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
    };

    // Mouse events
    this.slider.addEventListener("mousedown", () => {
      this.isDragging = true;
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      setPosition(e.clientX);
    });

    // Touch events on handle and container for easy mobile sliding
    this.slider.addEventListener("touchstart", (e) => {
      this.isDragging = true;
      if (e.touches && e.touches[0]) setPosition(e.touches[0].clientX);
    }, { passive: true });

    this.container.addEventListener("touchstart", (e) => {
      this.isDragging = true;
      if (e.touches && e.touches[0]) setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener("touchend", () => {
      this.isDragging = false;
    });

    window.addEventListener("touchmove", (e) => {
      if (!this.isDragging) return;
      if (e.touches && e.touches[0]) setPosition(e.touches[0].clientX);
    }, { passive: true });

    // Click anywhere on container to move handle
    this.container.addEventListener("click", (e) => {
      if (e.target.closest(".slider-handle")) return;
      setPosition(e.clientX);
    });
  }
}

// ==========================================
// 3. TESTIMONIAL CAROUSEL
// ==========================================
class TestimonialCarousel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.track = this.container.querySelector(".testimonial-track");
    this.slides = this.container.querySelectorAll(".testimonial-slide");
    this.prevBtn = this.container.querySelector(".carousel-btn.prev");
    this.nextBtn = this.container.querySelector(".carousel-btn.next");
    this.dotsContainer = this.container.querySelector(".carousel-dots");
    this.currentIndex = 0;

    this.init();
  }

  init() {
    if (!this.track || this.slides.length === 0) return;

    // Create dots
    if (this.dotsContainer) {
      this.dotsContainer.innerHTML = "";
      this.slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `carousel-dot ${i === 0 ? "active" : ""}`;
        dot.setAttribute("aria-label", `Slide ${i + 1}`);
        dot.addEventListener("click", () => this.goTo(i));
        this.dotsContainer.appendChild(dot);
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.prev());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.next());
    }

    // Touch swipe support
    let startX = 0;
    this.container.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.container.addEventListener("touchend", (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) this.next();
        else this.prev();
      }
    });
  }

  goTo(index) {
    if (index < 0) index = this.slides.length - 1;
    if (index >= this.slides.length) index = 0;

    this.currentIndex = index;
    if (this.track) {
      this.track.style.transform = `translateX(-${index * 100}%)`;
    }

    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll(".carousel-dot");
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === index);
      });
    }
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }
}

// ==========================================
// 4. ACCORDION FAQ
// ==========================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const panel = item.querySelector(".faq-panel");

    if (trigger && panel) {
      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";
        
        // Close siblings for clean accordion behavior
        faqItems.forEach((other) => {
          if (other !== item) {
            const otherTrig = other.querySelector(".faq-trigger");
            const otherPan = other.querySelector(".faq-panel");
            if (otherTrig) otherTrig.setAttribute("aria-expanded", "false");
            if (otherPan) otherPan.style.maxHeight = null;
            other.classList.remove("open");
          }
        });

        trigger.setAttribute("aria-expanded", !isExpanded);
        item.classList.toggle("open", !isExpanded);

        if (!isExpanded) {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
          if (window.trackEvent) {
            window.trackEvent("faq_interaction", { question: trigger.textContent.trim() });
          }
        } else {
          panel.style.maxHeight = null;
        }
      });
    }
  });
}

// ==========================================
// 5. SERVICE AREAS INTERACTIVITY
// ==========================================
function initServiceAreaInteractivity(config) {
  const pills = document.querySelectorAll(".area-pill");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const areaName = pill.getAttribute("data-area-name") || pill.textContent.trim();
      if (window.openBookingModal) {
        window.openBookingModal({
          serviceId: "plumbing-inspection",
          problemNotes: `Inquiring for property located in: ${areaName}`
        });
      }
    });
  });
}

// Global initialization helper
window.initComponents = function() {
  if (typeof SITE_CONFIG !== "undefined") {
    new ServiceModalManager(SITE_CONFIG);
    new BeforeAfterSlider("comparisonSlider");
    new TestimonialCarousel("testimonialCarousel");
    initFaqAccordion();
    initServiceAreaInteractivity(SITE_CONFIG);
  }
};
