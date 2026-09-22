/**
 * Centralized Event Analytics Logger
 * Prepared for Google Analytics 4 (gtag), Meta Pixel, or custom backend dispatch.
 */

(function() {
  window.AnalyticsTracker = {
    events: [],

    track: function(eventName, params = {}) {
      const timestamp = new Date().toISOString();
      const payload = {
        event: eventName,
        timestamp,
        ...params
      };

      this.events.push(payload);

      // Console logging for debugging/verification
      console.log(`%c[Analytics] ${eventName}`, "color: #f97316; font-weight: bold;", payload);

      // Dispatch to Google Analytics 4 if gtag exists
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
      }

      // Dispatch to Meta Pixel if fbq exists
      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", eventName, params);
      }

      // Custom browser event for external listeners
      const customEvent = new CustomEvent("plumbing_analytics_event", { detail: payload });
      window.dispatchEvent(customEvent);
    }
  };

  // Global helper
  window.trackEvent = function(eventName, params) {
    window.AnalyticsTracker.track(eventName, params);
  };
})();
