<div align="center">

# 🛒 NestJS Enterprise E-Commerce Engine

[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo_5.0-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Stripe](https://img.shields.io/badge/Stripe-SDK_22.0-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

A modern, high-performance, and feature-complete E-Commerce Backend API built with **NestJS**, **TypeScript**, **MongoDB**, **GraphQL**, **Redis**, and **Stripe**. Features an enterprise-grade 2FA security system, event-driven email notifications, and an extensible architecture.

</div>

---

## 🌟 Key Features

### 🔐 Advanced Security & Authentication
- **Dual Authentication**: JWT-based Access & Refresh Token rotation for secure session management.
- **Email OTP Verification**: Automated registration verification with OTP expiry using Nodemailer & EJS HTML templates.
- **Password Management**: Secure password reset & forgot-password flow with single-use OTPs.
- **🛡️ Two-Factor Authentication (2FA)**:
  - **TOTP Algorithm**: Full support for Google Authenticator, Authy, and 1Password via `otplib`.
  - **QR Code Generation**: Direct base64 Data URL generation for effortless scanning.
  - **AES-256-CBC Secret Encryption**: 2FA secret keys are symmetrically encrypted at rest in MongoDB.
  - **Single-Use Backup Codes**: Generates 10 hashed, single-use recovery codes for emergency account access.
- **Hybrid Hashing & Encryption**: Supports both **Argon2** and **Bcrypt** hashing alongside AES-256 symmetric encryption.

### 🛍️ E-Commerce Core Engine
- **Product Management**: Products, Categories, Subcategories, Brands, Stock tracking, and pricing.
- **Shopping Cart**: Dynamic cart management with stock availability validation.
- **Coupons & Promotions**: Fixed and percentage-based discount coupons with automatic expiration logic.
- **Order & Checkout System**: Full order creation lifecycle, address linking, and pricing calculation.
- **Stripe Payments & Webhooks**: Seamless Stripe Checkout integration and secure webhook processing for payment status updates.
- **Reviews & Ratings**: Customer product reviews and aggregated rating calculations.
- **Media Uploads**: File and image upload management using `Multer`.

### ⚡ High Performance & Hybrid APIs
- **Hybrid API Layer**: Full **RESTful API** endpoints alongside a **GraphQL API** (Apollo Server + NestJS GraphQL).
- **Redis Caching**: High-speed caching layer using `ioredis` / Upstash Redis for optimal response times.
- **Real-Time WebSockets**: Integrated `@nestjs/websockets` & `socket.io` for real-time notifications and updates.
- **Event-Driven Architecture**: Decoupled asynchronous tasks using `@nestjs/event-emitter`.
- **Repository Pattern**: Generic `BaseRepository` abstracting Mongoose queries (`findById`, `findOneAndUpdate`, pagination, etc.).

---

## 🛠️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [NestJS 11](https://nestjs.com/) (Node.js) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose 9](https://mongoosejs.com/) |
| **GraphQL** | [Apollo Server 5](https://www.apollographql.com/) + `@nestjs/graphql` |
| **Caching** | [Redis](https://redis.io/) (`ioredis` / Upstash) |
| **Security** | `otplib`, `bcrypt`, `argon2`, `crypto` (AES-256-CBC) |
| **Payments** | [Stripe API](https://stripe.com/) (`stripe` SDK) |
| **Real-time** | [WebSockets](https://socket.io/) (`@nestjs/websockets` / `socket.io`) |
| **Emails** | [Nodemailer](https://nodemailer.com/) + `@nestjs-modules/mailer` + EJS Templates |
| **Testing & Linting** | Jest, ESLint, Prettier |

---

## 📁 Project Structure

```text
src/
├── main.ts                       # Application entry point
├── app.module.ts                  # Root application module
├── DB/                           # Database & Data Layer
│   ├── database.repository.ts    # Generic Abstract Base Repository
│   ├── Models/                   # Mongoose Schemas & Models (User, Product, Order, etc.)
│   └── repos/                    # Custom Repository Classes
├── common/                       # Shared Utilities & Infrastructure
│   ├── decorators/               # Custom NestJS Decorators
│   ├── dto/                      # Common Data Transfer Objects (Pagination, etc.)
│   ├── enums/                    # Security, User, and System Enums
│   ├── filters/                  # Global Exception Filters
│   ├── guards/                   # Authentication & Role Guards
│   ├── modules/                  # Common Modules (Token, 2FA, Security)
│   ├── security/                 # Encryption (AES-256), Hashing (Bcrypt/Argon2)
│   └── services/                 # 2FA Service (TOTP, Backup Codes)
└── modules/                      # Core Business Feature Modules
    ├── auth/                     # Authentication, Registration, 2FA, Password Reset
    ├── brand/                    # Brand Management
    ├── cart/                     # Cart Operations
    ├── category/                 # Category & Subcategory Management
    ├── coupons/                  # Coupon & Promotion Management
    ├── mail/                     # Event-Driven Email Services & Templates
    ├── order/                    # Order Processing & Stripe Payments
    ├── product/                  # Product Catalog Management
    ├── reviews/                  # Product Reviews & Ratings
    └── user/                     # User Profiles & Administration
```

---

## ⚙️ Environment Configuration

Create a `.env.dev` file inside the `config/` directory based on the following template:

```env
# Application
PORT=3005

# Database & Cache
DB_URI=mongodb://localhost:27017/
DB_NAME=e-commerce
REDIS_HOST=rediss://default:...@flying-stag-164288.upstash.io:6379

# JWT Secrets & Signatures
JWT_USER_SECRET=your_jwt_user_secret
JWT_REFRESH_USER_SECRET=your_jwt_refresh_user_secret
JWT_ADMIN_SECRET=your_jwt_admin_secret
JWT_REFRESH_ADMIN_SECRET=your_jwt_refresh_admin_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=30m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
JWT_ACCESS_SIGNUTURE=SFSFKFAKFS
JWT_REFRESH_SIGNUTURE=FSFSVZVBZB
JWT_ADMIN_ACCESS_SIGNUTURE=ADMSFKFAKFS
JWT_ADMIN_REFRESH_SIGNUTURE=ADMFSVZVBZB

# Encryption & Hashing
ENCRYPTION_KEY=32_character_encryption_key_here!
BCRYPT_SALT=10

# Email Service
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISH_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUCCESS_URL=http://localhost:3000/success
CANCEL_URL=http://localhost:3000/cancel
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.x` or `v20.x`+
- **MongoDB**: Local instance or MongoDB Atlas
- **Redis**: Local Redis instance or Upstash cloud instance

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/MohamedSamyHossebo/Ecommerce-Nestjs.git
cd Ecommerce-Nestjs

# Install dependencies
npm install
```

### 3. Running the Server

```bash
# Development mode with Hot Reload
npm run start:dev

# Production Build & Execution
npm run build
npm run start:prod
```

### 4. Running Tests & Code Formatting

```bash
# Unit Tests
npm run test

# End-to-End Tests
npm run test:e2e

# Test Coverage
npm run test:cov

# Code Formatting & Linting
npm run format
npm run lint
```

---

## 🔐 2FA Integration Flow Summary

```text
[Client]                               [Backend API]
   │                                         │
   ├────── POST /auth/2fa/generate ─────────►│ Generates Secret + QR Code Data URL
   │◄───── Returns { qrCodeDataUrl } ────────┤
   │                                         │
   │      (User Scans QR Code in App)        │
   │                                         │
   ├────── POST /auth/2fa/enable ───────────►│ Verifies TOTP code & saves backup codes
   │◄───── Returns { backupCodes } ──────────┤
   │                                         │
   ├────── POST /auth/2fa/verify-login ─────►│ Verifies 2FA during login & issues JWTs
   │◄───── Returns { accessToken } ──────────┤
```

---

## 📄 License

This project is licensed under the **UNLICENSED** / Educational License. Built during the **Route IT Back-End Diploma** training program.

---

<div align="center">

Crafted with ❤️ by **Mohamed Samy Hossebo**

</div>
