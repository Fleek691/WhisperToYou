# 🍷 WHISPER TO YOU — Official Literary & Poetry Book Website

A production-ready website built for **"WHISPER TO YOU" by Ladup Sherpa**.

Designed specifically around the physical book cover aesthetic: **deep black background (#050505), crimson typography, dark red spider lilies (*Lycoris radiata*), elegant serif typography, strong contrast, negative space, and dark romantic atmosphere.**

---

## 🚀 Key Features

1. **Bespoke Visual Identity**: Derived directly from the physical book cover (Dark romantic, crimson accents, red spider lily motifs, serif typography).
2. **Central Content Configuration (`frontend/src/config/bookConfig.ts`)**: Update book title, author, price, shipping charges, epigraph, introduction, themes, specifications, and images from ONE single file without modifying component logic.
3. **Interactive Book Preview**: Asymmetrical editorial poem gallery with a full-screen Lightbox view.
4. **Complete Checkout & Order System**: Full Indian customer address form with strict client-side & server-side validation (10-digit mobile number, 6-digit pincode, integer quantity).
5. **Server-Side Price Calculation (Security & Audit)**: Backend independently calculates subtotal, dynamic shipping (Free above threshold), and total amount. Never trusts price data from the client.
6. **Development / Test Mode Payment Support**: Seamless test payment mode built-in so you can test orders without live domain or Razorpay subscription keys!
7. **Razorpay Live Payment Gateway**: Integrated signature verification (`HMAC SHA256`) ready for production credentials.
8. **Transactional Email & SMS Architecture**: Automatic order confirmation email notifications sent via Resend / SendGrid with pluggable SMS notification service (MSG91 / Twilio).
9. **Protected Admin Dashboard (`/admin`)**: Metric cards (Total Orders, Pending, Processing, Shipped, Delivered, Revenue), order status updates, shipping carrier tracking numbers/URLs, and review moderation.
10. **Reader Reviews Moderation**: Public view displays only approved reviews; new submissions require author approval.
11. **Legal & Auxiliary Pages**: Shipping Info, Privacy Policy, Terms & Conditions, Refund Policy, and Contact Page.

---

## 🛠️ Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS, Lucide React Icons, Canvas Petal Effects.
- **Backend**: Node.js, Express.js (TypeScript).
- **Database**: MongoDB (Mongoose) with automatic In-Memory Store fallback for seamless local testing.
- **Payment**: Razorpay SDK + Development Test Payment Mode.
- **Email/SMS**: Resend API & Pluggable SMS architecture.

---

## 📂 Project Structure

```
Ladup/
├── frontend/
│   ├── public/
│   │   └── images/
│   │       ├── book-cover.png
│   │       ├── spider-lily-1.png
│   │       ├── spider-lily-2.png
│   │       ├── poem-preview-1.png
│   │       ├── poem-preview-2.png
│   │       └── poem-preview-3.png
│   └── src/
│       ├── config/
│       │   └── bookConfig.ts       <-- CENTRAL CONTENT CONFIGURATION
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── HeroSection.tsx
│       │   ├── IntroSection.tsx
│       │   ├── AboutSection.tsx
│       │   ├── ThemesSection.tsx
│       │   ├── DetailsSection.tsx
│       │   ├── PreviewSection.tsx
│       │   ├── OrderSection.tsx
│       │   ├── ReviewsSection.tsx
│       │   ├── LightboxModal.tsx
│       │   ├── PetalBackgroundCanvas.tsx
│       │   ├── SpiderLilyDivider.tsx
│       │   ├── ThankYouPage.tsx
│       │   └── Footer.tsx
│       ├── pages/
│       │   ├── AdminDashboardPage.tsx
│       │   ├── ShippingPage.tsx
│       │   ├── PrivacyPolicyPage.tsx
│       │   ├── TermsPage.tsx
│       │   ├── RefundPolicyPage.tsx
│       │   └── ContactPage.tsx
│       └── services/
│           └── api.ts
└── backend/
    └── src/
        ├── config/
        │   ├── db.ts               <-- MongoDB + In-Memory Store
        │   └── razorpay.ts
        ├── controllers/
        │   ├── orderController.ts
        │   ├── paymentController.ts
        │   ├── reviewController.ts
        │   ├── contactController.ts
        │   └── adminController.ts
        ├── middleware/
        │   └── authMiddleware.ts
        ├── models/
        │   ├── Order.ts
        │   ├── Review.ts
        │   └── ContactMessage.ts
        └── services/
            ├── emailService.ts
            └── smsService.ts
```

---

## 📦 Getting Started

### 1. Installation

Install dependencies for both frontend and backend:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

### 2. Development Mode (Running Locally)

To run the application locally without requiring paid subscriptions or live domains:

#### Start Backend:
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

#### Start Frontend:
```bash
cd frontend
npm run dev
# Running on http://localhost:3000
```

---

### 3. Development Test Mode vs Live Payment Mode

- **Development Test Mode (Current)**:
  - You can test ordering immediately by filling the form and clicking **"PLACE ORDER (TEST PAYMENT)"**.
  - No Razorpay subscription or live key is needed.
  - The order is created, processed, verified, stored in the database, and redirects straight to the Thank You page.

- **Switching to Live Razorpay Gateway**:
  - Update `backend/.env` with your production Razorpay credentials:
    ```env
    RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
    RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
    ```
  - The application will automatically open the live Razorpay modal during checkout.

---

## 🔑 Admin Dashboard Access

- **URL / Portal**: Click **"Admin Portal"** in the website footer or trigger admin login.
- **Default Password**: `admin123` (Configurable via `ADMIN_PASSWORD` in `backend/.env`).
- **Features**:
  - View Total Revenue & Order Metrics.
  - View Customer Contact & Delivery Addresses.
  - Update Order Status (*Pending, Processing, Shipped, Delivered, Cancelled*).
  - Add Courier Carrier, Tracking Number, and Tracking URL.
  - Approve or Reject Reader Reviews before they appear publicly.

---

## 🎨 Updating Book Information & Assets

To update book details, price, epigraph, introduction, or poem preview images, edit:
`frontend/src/config/bookConfig.ts`

```typescript
export const BOOK_CONFIG = {
  BOOK_TITLE: "Whisper to You",
  AUTHOR_NAME: "Ladup Sherpa",
  BOOK_PRICE: 499,
  STANDARD_SHIPPING_CHARGE: 60,
  FREE_SHIPPING_THRESHOLD: 999,
  EPIGRAPH: "[EPIGRAPH WILL BE PROVIDED]",
  INTRODUCTION: "[BOOK INTRODUCTION WILL BE PROVIDED]",
  DESCRIPTION: "[BOOK DESCRIPTION WILL BE PROVIDED]",
  // ...
};
```

---

## 📄 License & Copyright

© 2024 Ladup Sherpa. All rights reserved.
