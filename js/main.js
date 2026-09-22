/**
 * Main Application Orchestrator
 * Coordinates config hydration, responsive navigation, sticky header,
 * mobile action bar, CTA buttons, and initializes all modules.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Hydrate DOM elements with centralized config
  hydrateSiteConfig();

  // 2. Setup Sticky Navigation & Mobile Hamburger
  setupNavigation();

  // 3. Setup Global CTAs (Hero, Emergency Banner, Mobile Action Bar)
  setupActionTriggers();

  // 4. Initialize Core Interactive Modules
  if (window.initPlumbingAssistant) {
    window.initPlumbingAssistant("assistantAppContainer");
  }

  if (window.initBookingSystem) {
    window.initBookingSystem();
  }

  if (window.initComponents) {
    window.initComponents();
  }

  if (window.initLeadCapture) {
    window.initLeadCapture();
  }
});

/**
 * Hydrates DOM text and links with SITE_CONFIG variables
 */
function hydrateSiteConfig() {
  if (typeof SITE_CONFIG === "undefined") return;

  // Replace text bindings
  document.querySelectorAll("[data-config-text]").forEach((el) => {
    const key = el.getAttribute("data-config-text");
    if (SITE_CONFIG[key] !== undefined) {
      el.textContent = SITE_CONFIG[key];
    }
  });

  // Replace tel links
  document.querySelectorAll("a[href^='tel:']").forEach((link) => {
    link.href = `tel:${SITE_CONFIG.PHONE_RAW}`;
    if (link.hasAttribute("data-display-phone")) {
      link.textContent = SITE_CONFIG.PHONE_NUMBER;
    }
    link.addEventListener("click", () => {
      if (window.trackEvent) window.trackEvent("call_click", { location: link.getAttribute("data-track-loc") || "header" });
    });
  });

  // Replace dynamic WhatsApp links
  document.querySelectorAll(".dynamic-whatsapp-link").forEach((link) => {
    const defaultMsg = encodeURIComponent(`Hi ${SITE_CONFIG.COMPANY_NAME || "Team"},\nI would like to inquire about plumbing services in ${SITE_CONFIG.CITY}.`);
    link.href = `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${defaultMsg}`;
    link.addEventListener("click", () => {
      if (window.trackEvent) window.trackEvent("whatsapp_click", { location: link.getAttribute("data-track-loc") || "general" });
    });
  });

  // Render Service Cards in Grid dynamically if container exists
  renderServicesGrid();

  // Render Service Areas
  renderServiceAreas();
}

/**
 * Renders the interactive service cards
 */
function renderServicesGrid() {
  const container = document.getElementById("servicesGridContainer");
  if (!container || !SITE_CONFIG.SERVICES) return;

  container.innerHTML = "";
  SITE_CONFIG.SERVICES.forEach((srv) => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.setAttribute("data-service-id", srv.id);
    card.innerHTML = `
      <div class="service-card-top">
        <span class="service-card-icon">${srv.icon}</span>
        <span class="service-card-badge">${srv.badge}</span>
      </div>
      <h3 class="service-card-title">${srv.title}</h3>
      <p class="service-card-desc">${srv.shortDesc}</p>
      
      <div class="service-card-urgency-tag">
        <span>⏱️ Urgency:</span> <strong>${srv.urgency}</strong>
      </div>

      <div class="service-card-footer">
        <button type="button" class="service-explore-btn">
          Explore Details & Signs →
        </button>
        <button type="button" class="btn-card-book" data-service-book="${srv.id}">
          Book Now
        </button>
      </div>
    `;

    const bookBtn = card.querySelector("[data-service-book]");
    if (bookBtn) {
      bookBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.openBookingModal) {
          window.openBookingModal({
            serviceId: srv.id,
            urgency: srv.recommendedUrgencyValue || "today"
          });
        }
      });
    }

    container.appendChild(card);
  });
}

/**
 * Renders service area pills
 */
function renderServiceAreas() {
  const container = document.getElementById("serviceAreasContainer");
  if (!container || !SITE_CONFIG.SERVICE_AREAS) return;

  container.innerHTML = "";
  SITE_CONFIG.SERVICE_AREAS.forEach((area) => {
    const pill = document.createElement("div");
    pill.className = "area-pill";
    pill.setAttribute("data-area-name", area.name);
    pill.innerHTML = `
      <span class="area-pin">📍</span>
      <div class="area-text-wrap">
        <strong class="area-title">${area.name}</strong>
        <span class="area-note">${area.note}</span>
      </div>
      <span class="area-check">✓ Active</span>
    `;
    container.appendChild(pill);
  });
}

/**
 * Sticky Navigation and Mobile Hamburger Menu
 */
function setupNavigation() {
  const header = document.getElementById("mainHeader");
  const hamburger = document.getElementById("navHamburger");
  const mobileNav = document.getElementById("mobileNavDrawer");
  const mobileOverlay = document.getElementById("mobileNavOverlay");
  const closeNavBtn = document.getElementById("closeMobileNavBtn");

  // Sticky header shadow on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, { passive: true });

  const toggleMobileNav = (state) => {
    const isOpen = typeof state === "boolean" ? state : !mobileNav.classList.contains("open");
    mobileNav.classList.toggle("open", isOpen);
    mobileOverlay.classList.toggle("active", isOpen);
    document.body.classList.toggle("modal-open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  };

  if (hamburger) {
    hamburger.addEventListener("click", () => toggleMobileNav());
  }

  if (closeNavBtn) {
    closeNavBtn.addEventListener("click", () => toggleMobileNav(false));
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", () => toggleMobileNav(false));
  }

  // Close mobile nav when clicking a link
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", () => toggleMobileNav(false));
  });
}

/**
 * Setup Action Triggers (Hero Buttons, Mobile Bottom Bar, Modals)
 */
function setupActionTriggers() {
  // Hero Primary CTA: Book a Plumber
  const heroBookBtn = document.getElementById("heroBookBtn");
  if (heroBookBtn) {
    heroBookBtn.addEventListener("click", () => {
      if (window.trackEvent) window.trackEvent("hero_cta_click", { action: "book" });
      if (window.openBookingModal) window.openBookingModal();
    });
  }

  // Hero Secondary CTA: Talk to Our Plumbing Assistant
  const heroAssistantBtn = document.getElementById("heroAssistantBtn");
  if (heroAssistantBtn) {
    heroAssistantBtn.addEventListener("click", () => {
      if (window.trackEvent) window.trackEvent("hero_cta_click", { action: "assistant" });
      const sec = document.getElementById("assistantSection");
      if (sec) sec.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Header "Book Now" button
  const headerBookBtn = document.getElementById("headerBookBtn");
  if (headerBookBtn) {
    headerBookBtn.addEventListener("click", () => {
      if (window.trackEvent) window.trackEvent("header_book_click");
      if (window.openBookingModal) window.openBookingModal();
    });
  }

  // Mobile Bottom Bar Book Button
  const mobileBarBookBtn = document.getElementById("mobileBarBookBtn");
  if (mobileBarBookBtn) {
    mobileBarBookBtn.addEventListener("click", () => {
      if (window.trackEvent) window.trackEvent("mobile_bar_book_click");
      if (window.openBookingModal) window.openBookingModal();
    });
  }

  // Emergency Callout Buttons
  document.querySelectorAll("[data-action-emergency]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.trackEvent) window.trackEvent("emergency_booking", { source: "banner" });
      if (window.openBookingModal) {
        window.openBookingModal({
          serviceId: "emergency-plumbing",
          urgency: "emergency"
        });
      }
    });
  });

  // Quote Request Buttons
  document.querySelectorAll("[data-action-quote]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.trackEvent) window.trackEvent("quote_request");
      if (window.openBookingModal) {
        window.openBookingModal({
          urgency: "quote"
        });
      }
    });
  });
}
