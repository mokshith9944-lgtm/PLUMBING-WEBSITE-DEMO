/**
 * Main Application Orchestrator — Valvoro UK Edition
 * Coordinates config hydration, responsive navigation, sticky header,
 * mobile action bar, CTA buttons, scroll animations, and initializes all modules.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Hydrate DOM elements with centralized UK config
  hydrateSiteConfig();

  // 2. Setup Sticky Navigation & Mobile Hamburger
  setupNavigation();

  // 3. Setup Global CTAs (Hero, Emergency Banner, Mobile Action Bar)
  setupActionTriggers();

  // 4. Setup Scroll & Viewport Animations
  setupScrollAnimations();

  // 5. Initialize Core Interactive Modules
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
    const defaultMsg = encodeURIComponent(`Hi ${SITE_CONFIG.COMPANY_NAME || "Valvoro Team"},\nI would like to inquire about plumbing services in ${SITE_CONFIG.CITY}.`);
    link.href = `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${defaultMsg}`;
    link.addEventListener("click", () => {
      if (window.trackEvent) window.trackEvent("whatsapp_click", { location: link.getAttribute("data-track-loc") || "general" });
    });
  });

  // Render Service Cards in Grid with Authentic Photography
  renderServicesGrid();

  // Render UK Postcode Service Areas
  renderServiceAreas();
}

/**
 * Renders the interactive service cards with authentic imagery
 */
function renderServicesGrid() {
  const container = document.getElementById("servicesGridContainer");
  if (!container || !SITE_CONFIG.SERVICES) return;

  container.innerHTML = "";
  SITE_CONFIG.SERVICES.forEach((srv, index) => {
    const card = document.createElement("div");
    card.className = `service-card reveal-on-scroll stagger-${(index % 3) + 1}`;
    card.setAttribute("data-service-id", srv.id);
    card.innerHTML = `
      <div class="service-card-img-wrap">
        <img src="${srv.image}" alt="${srv.alt}" loading="lazy" width="400" height="230" class="service-card-img">
        <span class="service-card-badge">${srv.badge}</span>
      </div>
      
      <div class="service-card-body">
        <div class="service-card-header-row">
          <span class="service-card-icon">${srv.icon}</span>
          <h3 class="service-card-title">${srv.title}</h3>
        </div>
        <p class="service-card-desc">${srv.shortDesc}</p>
        
        <div class="service-card-urgency-tag">
          <span>⏱️ Typical Urgency:</span> <strong>${srv.urgency}</strong>
        </div>

        <div class="service-card-footer">
          <button type="button" class="service-explore-btn">
            Details & Signs →
          </button>
          <button type="button" class="btn-card-book" data-service-book="${srv.id}">
            Book Plumber
          </button>
        </div>
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
 * Renders UK service area pills with Postcodes
 */
function renderServiceAreas() {
  const container = document.getElementById("serviceAreasContainer");
  if (!container || !SITE_CONFIG.SERVICE_AREAS) return;

  container.innerHTML = "";
  SITE_CONFIG.SERVICE_AREAS.forEach((area) => {
    const pill = document.createElement("div");
    pill.className = "area-pill reveal-on-scroll";
    pill.setAttribute("data-area-name", area.name);
    pill.innerHTML = `
      <span class="area-pin">📍</span>
      <div class="area-text-wrap">
        <strong class="area-title">${area.name}</strong>
        <span class="area-note">${area.note}</span>
      </div>
      <span class="area-check">✓ UK Coverage</span>
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

  // Header "Book a Plumber" CTA button
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

  // Floating Hero Card Book Button
  const heroFloatingBookBtn = document.getElementById("heroFloatingBookBtn");
  if (heroFloatingBookBtn) {
    heroFloatingBookBtn.addEventListener("click", () => {
      if (window.trackEvent) window.trackEvent("hero_floating_book_click");
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

/**
 * Scroll-Triggered Viewport Animations
 */
function setupScrollAnimations() {
  if (!("IntersectionObserver" in window)) {
    // Fallback: make all visible if browser lacks observer
    document.querySelectorAll(".reveal-on-scroll").forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}
