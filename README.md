# High-Converting Local Plumbing Website & Rule-Based Assistant

A modern, mobile-first, conversion-focused website for local plumbing companies, featuring an interactive **Rule-Based Diagnostic Assistant**, a **7-Step Interactive Booking System**, interactive before/after comparison slider, testimonial carousel, sticky bottom navigation for mobile conversions, and centralized business configuration.

Live Demo & Production Ready on **Vercel** with zero runtime dependencies.

---

## 🚀 Key Features

### 1. 🔧 Interactive Rule-Based Plumbing Assistant
- **100% Deterministic & Rule-Based** (Zero AI hallucinations or unreliable answers).
- Chat-style conversational interface that asks questions one at a time.
- Implements comprehensive decision trees:
  - **Rule 1 — Water Leak**: Urgency assessment, active flooding triage, safety shutoff advice, and emergency booking.
  - **Rule 2 — Blocked Drain**: Fixture diagnosis, drainage rate evaluation, and hydro-jetting recommendations.
  - **Rule 3 — Toilet Problems**: Flush mechanism, constantly running flapper, leaking wax ring, or auger clog clearance.
  - **Rule 4 — Water Heater**: Diagnostic paths for no hot water, low temperature, tank rumbling, leaks, and new installations.
  - **Rule 5 — Low Water Pressure**: Whole property vs single-fixture evaluation and inspection guidance.
  - **Rule 6 — No Water**: Property-wide vs local isolation checks.
  - **Rule 7 — Not Sure**: 5-question step-by-step diagnostic workflow.
- Generates a **Result Card** with recommended service, diagnostic reason, urgency badge, safety action, and instant action buttons:
  - **📅 Book a Plumber** (pre-fills the 7-step booking system)
  - **💬 WhatsApp Enquiry** (pre-fills detailed WhatsApp message)
  - **📞 Call Now** (`tel:[PHONE_NUMBER]`)

### 2. 📅 7-Step Interactive Booking System
- **Step 1 — Service**: Select from 11 core plumbing services.
- **Step 2 — Urgency**: Emergency ASAP, Today, 2–3 Days, This Week, or Quote Request (triggers emergency warning and direct callout when needed).
- **Step 3 — Interactive Date Picker**: Calendar date cards with configurable availability.
- **Step 4 — Time Window Slots**: Selectable morning and afternoon slots with booked/available statuses.
- **Step 5 — Customer Details**: Name, phone, email, address, and preferred contact method (Phone, WhatsApp, Email) with robust validation.
- **Step 6 — Problem Description & Photo Upload**: Notes area + live client image upload preview.
- **Step 7 — Booking Summary**: Review card before submission.
- **Confirmation Screen**: Unique booking reference code (e.g., `PLB-2026-XXXXX`), detailed recap, and WhatsApp / Phone escalation buttons.

### 3. 📱 Mobile-First Conversion Architecture
- **Sticky Bottom Action Bar**: Fixed high-contrast `📞 Call`, `💬 WhatsApp`, and `📅 Book` buttons on mobile devices.
- **Sticky Header**: Responsive header with desktop navigation and mobile drawer.
- **Sticky Floating "Need Help?" Widget**: Quick diagnostic and booking menu.
- **Exit-Intent Modal**: Gentle trigger when desktop visitors are about to leave without booking.

### 4. ⚙️ Centralized Business Configuration (`js/config.js`)
Easily update business branding and parameters in one single file:
- `COMPANY_NAME`
- `PHONE_NUMBER` & `PHONE_RAW`
- `WHATSAPP_NUMBER`
- `EMAIL`
- `CITY`
- `SERVICE_AREAS`
- `BUSINESS_HOURS`
- `SERVICES`
- `BOOKING_SLOTS`
- `EMERGENCY_AVAILABILITY`

---

## 🛠️ Project Structure

```
.
├── index.html                  # Semantic, SEO-optimized HTML & Schema.org LocalBusiness JSON-LD
├── vercel.json                 # Vercel deployment configuration with caching & security headers
├── .gitignore                  # Git ignore rules
├── README.md                   # Documentation
├── css/
│   ├── variables.css           # Design tokens, color palette, typography scale, shadows
│   ├── base.css                # Reset, utility classes, buttons, animations
│   ├── components.css          # Header, hero, service cards, slider, carousel, FAQ
│   ├── assistant.css           # Chat bubbles, options grid, result card, safety alert
│   ├── booking.css             # 7-step booking modal, date picker, photo upload, summary
│   └── responsive.css          # Mobile bottom bar, media queries (<1024px, <768px, <480px)
├── js/
│   ├── config.js               # Centralized business settings & services
│   ├── rules-data.js           # Predefined decision trees for Rules 1–7
│   ├── assistant.js            # Diagnostic assistant controller
│   ├── booking.js              # 7-step booking system controller & validation
│   ├── components.js           # Before/after slider, reviews carousel, accordion FAQ
│   ├── lead-capture.js         # Floating help widget & exit intent modal
│   ├── analytics.js            # Event tracking (calls, WhatsApp, bookings, assistant)
│   └── main.js                 # App orchestrator & dynamic DOM hydration
└── assets/
    └── images/
        ├── pipe-before.svg     # Before repair graphic asset
        └── pipe-after.svg      # After repair clean copper & brass graphic asset
```

---

## 🌐 Deploy to Vercel

### Option 1: Direct Vercel Git Integration (Recommended)
1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository (`PLUMBING-WEBSITE-DEMO`).
4. Keep the default settings (Framework Preset: **Other**) and click **Deploy**.
5. Your website is live with automatic SSL, global CDN, and continuous deployments on every `git push`!

### Option 2: Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts to link and deploy.

---

## 🧪 Local Preview

You can run a local test server using Python:
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080` in your web browser.
