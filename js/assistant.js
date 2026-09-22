/**
 * Interactive Rule-Based Plumbing Assistant Controller
 * Manages chat-style UI, decision progression, history, and the result screen.
 */
class PlumbingAssistant {
  constructor(containerId, rules, config) {
    this.container = document.getElementById(containerId);
    this.rules = rules;
    this.config = config;
    this.history = [];
    this.currentQuestionId = rules.initialQuestionId;
    this.isCompleted = false;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.renderContainerStructure();
    this.goToQuestion(this.rules.initialQuestionId);
  }

  renderContainerStructure() {
    this.container.innerHTML = `
      <div class="assistant-card" id="assistantCard">
        <div class="assistant-header">
          <div class="assistant-header-badge">
            <span class="pulse-dot"></span>
            <span>Interactive Diagnostic Assistant</span>
          </div>
          <h3 class="assistant-title">🔧 Plumbing Assistant</h3>
          <p class="assistant-subtitle">Tell us what's happening and we'll help you figure out the next step.</p>
        </div>

        <div class="assistant-chat-window" id="assistantChatWindow">
          <div class="assistant-messages" id="assistantMessages"></div>
          <div class="assistant-options-container" id="assistantOptionsContainer"></div>
        </div>

        <div class="assistant-footer">
          <span class="assistant-footer-note">Rule-based preliminary guidance • Fast & confidential</span>
          <button type="button" class="btn-text" id="assistantRestartBtn" style="display: none;">
            🔄 Start Over
          </button>
        </div>
      </div>
    `;

    const restartBtn = document.getElementById("assistantRestartBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => this.restart());
    }
  }

  goToQuestion(questionId) {
    const question = this.rules.questions[questionId];
    if (!question) {
      console.error("Unknown question ID in rules:", questionId);
      return;
    }

    this.currentQuestionId = questionId;

    if (this.history.length === 0 && window.trackEvent) {
      window.trackEvent("assistant_started", { initialQuestion: questionId });
    }

    this.renderQuestion(question);
  }

  renderQuestion(question) {
    const messagesEl = document.getElementById("assistantMessages");
    const optionsEl = document.getElementById("assistantOptionsContainer");
    const restartBtn = document.getElementById("assistantRestartBtn");

    if (restartBtn) {
      restartBtn.style.display = this.history.length > 0 ? "inline-flex" : "none";
    }

    // Add assistant chat bubble
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-bubble assistant-bubble animate-fade-in";
    msgDiv.innerHTML = `
      <div class="chat-avatar">🔧</div>
      <div class="chat-body">
        <div class="chat-author">${this.config.COMPANY_NAME || "Plumbing Assistant"}</div>
        <div class="chat-text">${question.text}</div>
        ${question.subtitle ? `<div class="chat-subtext">${question.subtitle}</div>` : ""}
      </div>
    `;
    messagesEl.appendChild(msgDiv);

    // Render option buttons
    optionsEl.innerHTML = "";
    const optionsGrid = document.createElement("div");
    optionsGrid.className = "assistant-options-grid";

    question.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "assistant-opt-btn";
      btn.innerHTML = `
        <span class="opt-label">${opt.label}</span>
        <span class="opt-arrow">→</span>
      `;
      btn.addEventListener("click", () => this.handleOptionSelect(question, opt));
      optionsGrid.appendChild(btn);
    });

    optionsEl.appendChild(optionsGrid);
    this.scrollToBottom();
  }

  handleOptionSelect(question, option) {
    const messagesEl = document.getElementById("assistantMessages");
    const optionsEl = document.getElementById("assistantOptionsContainer");

    // Add user response bubble to chat
    const userMsg = document.createElement("div");
    userMsg.className = "chat-bubble user-bubble animate-fade-in";
    userMsg.innerHTML = `
      <div class="chat-body">
        <div class="chat-text">${option.label}</div>
      </div>
      <div class="chat-avatar user-avatar">👤</div>
    `;
    messagesEl.appendChild(userMsg);

    // Save to history
    this.history.push({
      questionId: question.id,
      questionText: question.text,
      selectedLabel: option.label,
      option
    });

    if (window.trackEvent) {
      window.trackEvent("assistant_step", {
        step: this.history.length,
        question: question.id,
        answer: option.label
      });
    }

    // Clear option buttons while processing next step
    optionsEl.innerHTML = "";

    // Check if option triggers a result or leads to next question
    if (option.result) {
      this.showResult(option.result);
    } else if (option.next) {
      setTimeout(() => {
        this.goToQuestion(option.next);
      }, 300);
    }
  }

  showResult(result) {
    this.isCompleted = true;
    const optionsEl = document.getElementById("assistantOptionsContainer");
    const messagesEl = document.getElementById("assistantMessages");
    const restartBtn = document.getElementById("assistantRestartBtn");

    if (restartBtn) restartBtn.style.display = "inline-flex";

    if (window.trackEvent) {
      window.trackEvent("assistant_completed", {
        service: result.serviceName,
        urgency: result.urgency
      });
    }

    const resultCard = document.createElement("div");
    resultCard.className = "assistant-result-card animate-scale-up";
    
    // Prepare dynamic WhatsApp URL
    const waText = encodeURIComponent(
      `Hi ${this.config.COMPANY_NAME || "Team"},\nI used your online Plumbing Assistant.\n\nRecommended: ${result.serviceName}\nUrgency: ${result.urgency}\nLocation: ${this.config.CITY}\n\nCan you help me arrange this?`
    );
    const waUrl = `https://wa.me/${this.config.WHATSAPP_NUMBER}?text=${waText}`;

    resultCard.innerHTML = `
      <div class="result-header">
        <span class="result-badge">🔧 Recommended Service</span>
        ${result.alertBadge ? `<div class="result-alert-badge">${result.alertBadge}</div>` : ""}
      </div>
      <h4 class="result-title">${result.serviceName}</h4>
      
      <div class="result-field">
        <span class="field-label">Why:</span>
        <p class="field-value">${result.why}</p>
      </div>

      <div class="result-meta-row">
        <div class="meta-item">
          <span class="meta-label">Suggested Urgency:</span>
          <span class="meta-badge urgency-badge">${result.urgency}</span>
        </div>
      </div>

      ${result.safetyAdvice ? `
        <div class="safety-advice-box">
          <span class="safety-icon">⚠️</span>
          <div>
            <strong>Recommended Safety Action:</strong>
            <p>${result.safetyAdvice}</p>
          </div>
        </div>
      ` : ""}

      <div class="result-actions">
        <button type="button" class="btn btn-primary btn-cta" id="assistantBookBtn">
          📅 ${result.ctaLabel || "Book a Plumber"}
        </button>
        <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp" id="assistantWhatsAppBtn">
          💬 WhatsApp
        </a>
        <a href="tel:${this.config.PHONE_RAW}" class="btn btn-outline" id="assistantCallBtn">
          📞 Call Now
        </a>
      </div>

      <div class="result-disclaimer">
        ⚠️ <strong>Important Notice:</strong> This assistant provides general guidance and does not replace an in-person professional inspection.
      </div>
    `;

    messagesEl.appendChild(resultCard);
    this.scrollToBottom();

    // Bind action to open the booking system pre-filled
    const bookBtn = resultCard.querySelector("#assistantBookBtn");
    if (bookBtn) {
      bookBtn.addEventListener("click", () => {
        if (window.openBookingModal) {
          window.openBookingModal({
            serviceId: result.serviceId,
            urgency: result.urgencyValue || "today",
            problemNotes: `Identified via Assistant: ${result.serviceName}. Issue context: ${result.why}`
          });
        }
      });
    }
  }

  scrollToBottom() {
    const chatWindow = document.getElementById("assistantChatWindow");
    if (chatWindow) {
      setTimeout(() => {
        chatWindow.scrollTo({
          top: chatWindow.scrollHeight,
          behavior: "smooth"
        });
      }, 50);
    }
  }

  restart() {
    this.history = [];
    this.isCompleted = false;
    const messagesEl = document.getElementById("assistantMessages");
    const optionsEl = document.getElementById("assistantOptionsContainer");
    if (messagesEl) messagesEl.innerHTML = "";
    if (optionsEl) optionsEl.innerHTML = "";
    this.goToQuestion(this.rules.initialQuestionId);
  }
}

// Global initialization helper
window.initPlumbingAssistant = function(containerId) {
  if (typeof ASSISTANT_RULES !== "undefined" && typeof SITE_CONFIG !== "undefined") {
    return new PlumbingAssistant(containerId, ASSISTANT_RULES, SITE_CONFIG);
  }
  console.warn("Assistant rules or site config not loaded yet.");
};
