# CampusSwap — Student Second-Hand Marketplace

A full-stack college marketplace web application built for university students to buy, sell, exchange, and donate semester essentials (textbooks, drafters, calculators, hostel furniture, lab gear).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript (`strict: true`), Tailwind CSS, Lucide React icons, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose) following strict **MVC (Model-View-Controller)** pattern, JWT Authentication.
- **Client-Side Optimizations**: HTML5 Canvas image compression for fast uploads without bloated DB payloads.

---

## 📂 Project Structure

```text
├── backend/                        # Node.js + Express + MongoDB (MVC Pattern)
│   ├── config/                     # MongoDB connection
│   ├── models/                     # User, Listing, Enquiry schemas
│   ├── controllers/                # Business logic
│   ├── routes/                     # REST API endpoints
│   ├── middleware/                 # JWT auth guard & error handler
│   ├── seed/                       # Pre-populated Indian college items (INR)
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Server entry point
│
└── frontend/                       # Next.js (App Router) + TypeScript
    ├── src/
    │   ├── types/                  # Strict TypeScript interfaces
    │   ├── services/               # Typed Axios client & API handlers
    │   ├── context/                # AuthContext with 1-click Demo Switcher
    │   ├── utils/                  # Canvas image compression & AI smart helpers
    │   ├── components/             # Reusable UI components (Navbar, Cards, Modals)
    │   └── app/                    # Next.js App Router pages
    ├── .env.local.example
    ├── next.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## 🚀 Key Features

1. **Marketplace Discovery & Search**:
   - Filter by Category (Books, Electronics, Furniture, Stationery, Other), Condition, Listing Type (For Sale, Free, Exchange), and Max Price (₹ INR).
   - Instant title & description search with relevance sorting.
2. **Product Details & Negotiation**:
   - Item image gallery, seller details, campus location, and contact preferences (WhatsApp / Email).
   - "Make an Offer / Enquire" modal allowing counter-offers.
   - Shareable QR code generator for hostel noticeboards.
3. **Smart Helpers for Sellers**:
   - **Auto-Suggest Category**: Keyword-based category prediction.
   - **Generate Description Template**: Pre-formatted semester-ready item description.
   - **Canvas Image Compression**: Client-side resizing to max 800px at 70% JPEG quality.
4. **4-Tab Student Dashboard**:
   - **My Listings**: Manage inventory, toggle status (Available, Reserved, Sold, Inactive), or delete.
   - **Received Enquiries**: Review buyer offers; clicking "Accept" automatically reserves the item.
   - **Sent Offers**: Track negotiation status (Pending, Accepted, Rejected) with unread notification badges.
   - **Saved Favorites**: Bookmark items with availability status alerts.
5. **Instant Demo Student Switcher**:
   - Switch between pre-seeded student accounts (Anshu, Priya, Rohan) in one click for instant viva / evaluation testing without OTP hurdles.

---

## 💻 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas)

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Seed database with sample students, college items, and offers
npm run seed

# Start Express server (runs on port 5000)
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local

# Start Next.js development server (runs on port 3000)
npm run dev
```

Visit **http://localhost:3000** in your browser.
