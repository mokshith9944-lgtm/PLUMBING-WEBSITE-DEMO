/**
 * Lead Capture & Retention Features:
 * - Sticky Floating "Need Help?" Widget
 * - Exit-Intent Modal Popup
 */

class LeadCaptureManager {
  constructor(config) {
    this.config = config;
    this.initFloatingWidget();
    this.initExitIntent();
  }

  // ==========================================
  // 1. STICKY FLOATING "NEED HELP?" WIDGET
  // ==========================================
  initFloatingWidget() {
    const trigger = document.getElementById("floatingHelpTrigger");
    const drawer = document.getElementById("floatingHelpDrawer");
    const closeBtn = document.getElementById("floatingHelpCloseBtn");

    if (!trigger || !drawer) return;

    const toggle = (force) => {
      const isOpen = drawer.classList.contains("active");
      const shouldOpen = typeof force === "boolean" ? force : !isOpen;
      drawer.classList.toggle("active", shouldOpen);
      trigger.setAttribute("aria-expanded", shouldOpen);
    };

    trigger.addEventListener("click", () => toggle());

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggle(false);
      });
    }

    // Action buttons inside widget
    const btnDiagnose = drawer.querySelector("#widgetDiagnoseBtn");
    const btnBook = drawer.querySelector("#widgetBookBtn");
    const btnWhatsApp = drawer.querySelector("#widgetWhatsAppBtn");
    const btnCall = drawer.querySelector("#widgetCallBtn");

    if (btnDiagnose) {
      btnDiagnose.addEventListener("click", () => {
        toggle(false);
        const assistantSec = document.getElementById("assistantSection");
        if (assistantSec) {
          assistantSec.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    if (btnBook) {
      btnBook.addEventListener("click", () => {
        toggle(false);
        if (window.openBookingModal) {
          window.openBookingModal();
        }
      });
    }

    if (btnWhatsApp) {
      const waText = encodeURIComponent(
        `Hi ${this.config.COMPANY_NAME || "Team"},\nI'm on your website and need some quick advice with a plumbing issue.`
      );
      btnWhatsApp.href = `https://wa.me/${this.config.WHATSAPP_NUMBER}?text=${waText}`;
    }

    if (btnCall) {
      btnCall.href = `tel:${this.config.PHONE_RAW}`;
    }

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!drawer.contains(e.target) && !trigger.contains(e.target) && drawer.classList.contains("active")) {
        toggle(false);
      }
    });
  }

  // ==========================================
  // 2. EXIT INTENT POPUP
  // ==========================================
  initExitIntent() {
    const modal = document.getElementById("exitIntentModal");
    if (!modal) return;

    const closeBtn = document.getElementById("exitModalCloseBtn");
    const noThanksBtn = document.getElementById("exitNoThanksBtn");
    const bookBtn = document.getElementById("exitBookBtn");
    const waBtn = document.getElementById("exitWhatsAppBtn");

    const dismiss = () => {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
      sessionStorage.setItem("plb_exit_intent_dismissed", "true");
    };

    if (closeBtn) closeBtn.addEventListener("click", dismiss);
    if (noThanksBtn) noThanksBtn.addEventListener("click", dismiss);

    if (bookBtn) {
      bookBtn.addEventListener("click", () => {
        dismiss();
        if (window.openBookingModal) window.openBookingModal();
      });
    }

    if (waBtn) {
      const waText = encodeURIComponent(
        `Hi ${this.config.COMPANY_NAME || "Team"},\nI have a plumbing question before scheduling. Could you provide a quick quote?`
      );
      waBtn.href = `https://wa.me/${this.config.WHATSAPP_NUMBER}?text=${waText}`;
      waBtn.addEventListener("click", dismiss);
    }

    // Trigger on mouse leave near top of viewport (desktop)
    let triggered = false;
    document.addEventListener("mouseleave", (e) => {
      if (triggered) return;
      if (sessionStorage.getItem("plb_exit_intent_dismissed") === "true") return;

      // Only if cursor moves up through the top edge
      if (e.clientY <= 15) {
        triggered = true;
        modal.classList.add("active");
        document.body.classList.add("modal-open");
        sessionStorage.setItem("plb_exit_intent_dismissed", "true");
      }
    });
  }
}

// Global initialization helper
window.initLeadCapture = function() {
  if (typeof SITE_CONFIG !== "undefined") {
    new LeadCaptureManager(SITE_CONFIG);
  }
};
