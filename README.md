# DriveMate - Full-stack Next.js Car Rental Application 🚗

A modern, full-stack car rental web application built with **Next.js (App Router)**, **JavaScript**, **Tailwind CSS**, and **MongoDB (Mongoose)**.

---

## 🚀 Features

- **Fleet Catalog & Dynamic Filtering**: Filter by car type (SUV, Sedan, Hatchback, Sports, Electric), max rental price, and transmission (Auto / Manual).
- **Vehicle Detail Showcase**: Specs, included amenities, review ratings, mileage limit, and dynamic day-to-day rental calculator.
- **WhatsApp Direct Booking**: Instant rental inquiry generation that dispatches customer and car details directly to the owner via WhatsApp.
- **Admin Control Center**:
  - Secure JWT-authenticated Admin Dashboard.
  - Add new cars to the fleet with direct image upload.
  - Toggle vehicle availability (Available / Unavailable) on the fly.
  - Manage and track customer booking statuses (`Pending`, `Confirmed`, `Completed`, `Cancelled`).
  - One-click initial fleet database seeding.
- **Responsive Dark Cyber Aesthetic**: Built with glassmorphism, glowing accents, modern typography, and mobile-friendly navigation.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphic Dark Design System
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs`

---

## 📂 Project Structure

```
drivemate-next/
├── app/
│   ├── layout.js              # Global layout with fonts and Navbar/Footer
│   ├── globals.css            # Complete design system & glassmorphism
│   ├── page.js                # Landing page with hero & popular rentals
│   ├── cars/
│   │   ├── page.js            # Vehicle collection & filter sidebar
│   │   └── [id]/              # Car details & pricing calculator
│   ├── booking/
│   │   └── [id]/              # Customer checkout form & WhatsApp dispatch
│   ├── confirmation/          # Celebration screen with instructions
│   ├── admin-login/           # Secure admin portal login
│   ├── admin/                 # Fleet & booking management dashboard
│   └── api/
│       ├── auth/login/        # Admin authentication endpoint
│       ├── cars/              # CRUD endpoints for vehicle fleet
│       ├── bookings/          # Endpoints for rental requests & status updates
│       ├── upload/            # Multipart image upload handler
│       ├── settings/          # Public settings
│       └── seed/              # Database seeding endpoint
├── components/
│   ├── Navbar.jsx             # Top bar with WhatsApp quick link & mobile drawer
│   └── Footer.jsx             # Multi-column footer with accordions
├── context/
│   └── CarContext.jsx         # Global fleet state & operations
├── lib/
│   ├── mongodb.js             # Cached Mongoose connection helper
│   └── auth.js                # JWT token verification middleware
├── models/
│   ├── Car.js                 # Vehicle schema
│   ├── Booking.js             # Reservation schema
│   └── Admin.js               # Admin credentials schema
└── public/
    ├── cars/                  # High-res car transparent assets
    └── uploads/               # Uploaded car images
```

---

## ⚙️ Getting Started

### 1. Environment Setup
Create a `.env.local` file in the root directory (refer to `.env.example` for required variables):
```bash
cp .env.example .env.local
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.
