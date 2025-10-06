# 🔧 VetConnect Rwanda - Backend API

<div align="center">

**RESTful API for VetConnect Rwanda Platform**

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

[API Documentation](https://api.vetconnect.rw/docs) • [Report Bug](https://github.com/yourusername/vetconnect-rwanda-backend/issues) • [Request Feature](https://github.com/yourusername/vetconnect-rwanda-backend/issues)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 About

The VetConnect Rwanda Backend API is a robust, scalable RESTful API that powers the VetConnect Rwanda platform. It handles authentication, appointment management, livestock records, veterinarian profiles, and SMS integration.

### Key Capabilities

- **RESTful API** - Clean, predictable endpoints
- **JWT Authentication** - Secure user authentication
- **Role-Based Access Control** - Farmer, Veterinarian, Admin roles
- **SMS Integration** - USSD and SMS gateway support
- **Real-time Notifications** - WebSocket support for live updates
- **Data Validation** - Request validation and sanitization
- **Error Handling** - Comprehensive error responses

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT token-based authentication
- Role-based access control (RBAC)
- Password reset functionality

### 📅 Appointment Management

- Create, read, update, delete appointments
- Real-time availability checking
- Emergency appointment prioritization
- Appointment status tracking

### 🐄 Livestock Management

- Register and manage livestock
- Health record tracking
- Vaccination history
- Medical record management

### 👨‍⚕️ Veterinarian Management

- Veterinarian profiles
- Availability scheduling
- Service area management
- Rating and review system

### 📱 SMS Integration

- USSD menu system
- SMS notifications
- Appointment booking via SMS
- Health alerts via SMS

---

## 🛠️ Tech Stack

| Technology     | Purpose                  |
| -------------- | ------------------------ |
| **Node.js**    | Runtime environment      |
| **Express.js** | Web framework            |
| **TypeScript** | Type-safe development    |
| **PostgreSQL** | Primary database         |
| **Prisma**     | ORM and database toolkit |
| **JWT**        | Authentication tokens    |
| **Bcrypt**     | Password hashing         |
| **Zod**        | Schema validation        |
| **Winston**    | Logging                  |
| **Jest**       | Testing framework        |

---

## 📁 Folder Structure

\`\`\`
vetconnect-backend/
│
├── 📁 src/
│ ├── 📁 config/ # Configuration
│ │ ├── database.ts # MongoDB connection
│ │ ├── env.ts # Environment variables
│ │ └── constants.ts # App constants
│ │
│ ├── 📁 models/ # MongoDB Models
│ │ ├── User.ts
│ │ ├── Veterinarian.ts
│ │ ├── Appointment.ts
│ │ ├── Livestock.ts
│ │ ├── HealthRecord.ts
│ │ ├── Alert.ts
│ │ ├── EmergencyFlag.ts
│ │ └── Notification.ts
│ │
│ ├── 📁 controllers/ # Route Controllers
│ │ ├── authController.ts
│ │ ├── appointmentController.ts
│ │ ├── livestockController.ts
│ │ ├── veterinarianController.ts
│ │ ├── alertController.ts
│ │ ├── notificationController.ts
│ │ └── adminController.ts
│ │
│ ├── 📁 routes/ # API Routes
│ │ ├── index.ts # Main router
│ │ ├── authRoutes.ts
│ │ ├── appointmentRoutes.ts
│ │ ├── livestockRoutes.ts
│ │ ├── veterinarianRoutes.ts
│ │ ├── alertRoutes.ts
│ │ ├── notificationRoutes.ts
│ │ └── adminRoutes.ts
│ │
│ ├── 📁 middleware/ # Middleware
│ │ ├── auth.ts # Authentication
│ │ ├── errorHandler.ts # Error handling
│ │ ├── validation.ts # Input validation
│ │ └── rateLimiter.ts # Rate limiting
│ │
│ ├── 📁 services/ # Business Logic
│ │ ├── authService.ts
│ │ ├── appointmentService.ts
│ │ ├── livestockService.ts
│ │ ├── smsService.ts # Twilio integration
│ │ ├── emailService.ts
│ │ └── 📁 predictive/
│ │ ├── vaccinationAlerts.ts
│ │ └── diseaseAlerts.ts
│ │
│ ├── 📁 utils/ # Utility functions
│ │ ├── validators.ts
│ │ ├── helpers.ts
│ │ └── logger.ts
│ │
│ ├── 📁 types/ # TypeScript types
│ │ ├── index.ts
│ │ ├── user.ts
│ │ ├── appointment.ts
│ │ └── livestock.ts
│ │
│ └── server.ts # Main server file
│
├── 📁 scripts/ # Utility scripts
│ ├── seedDatabase.ts
│ └── generateAlerts.ts
│
├── 📁 tests/ # Tests
│ ├── auth.test.ts
│ └── appointments.test.ts
│
├── .env # Environment variables
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher
- **npm** or **pnpm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**

\`\`\`bash
git clone https://github.com/yourusername/vetconnect-rwanda-backend.git
cd vetconnect-rwanda-backend
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Set up the database**

\`\`\`bash

# Create database

createdb vetconnect_rwanda

5. **Start the development server**

\`\`\`bash
npm run dev
\`\`\`

The API will be available at `http://localhost:5000`

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

\`\`\`env

# Server Configuration

NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database

DATABASE_URL=postgresql://username:password@localhost:5432/vetconnect_rwanda

# JWT

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS

CORS_ORIGIN=http://localhost:3000

# SMS Gateway (Africa's Talking)

SMS_API_KEY=your-sms-api-key
SMS_USERNAME=your-sms-username
SMS_SENDER_ID=VetConnect

# Email

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# Logging

LOG_LEVEL=debug

# Rate Limiting

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
\`\`\`

---

## 📚 API Documentation

### Base URL

\`\`\`
http://localhost:5000/api/v1
\`\`\`

### Authentication

All protected endpoints require a JWT token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

### Endpoints Overview

#### Authentication (`/auth`)

| Method | Endpoint                | Description            | Auth Required |
| ------ | ----------------------- | ---------------------- | ------------- |
| POST   | `/auth/register`        | Register new user      | No            |
| POST   | `/auth/login`           | Login user             | No            |
| POST   | `/auth/logout`          | Logout user            | Yes           |
| GET    | `/auth/me`              | Get current user       | Yes           |
| POST   | `/auth/refresh`         | Refresh token          | Yes           |
| POST   | `/auth/forgot-password` | Request password reset | No            |
| POST   | `/auth/reset-password`  | Reset password         | No            |

#### Appointments (`/appointments`)

| Method | Endpoint            | Description            | Auth Required |
| ------ | ------------------- | ---------------------- | ------------- |
| GET    | `/appointments`     | Get all appointments   | Yes           |
| GET    | `/appointments/:id` | Get single appointment | Yes           |
| POST   | `/appointments`     | Create appointment     | Yes           |
| PUT    | `/appointments/:id` | Update appointment     | Yes           |
| DELETE | `/appointments/:id` | Cancel appointment     | Yes           |

#### Livestock (`/livestock`)

| Method | Endpoint                         | Description          | Auth Required |
| ------ | -------------------------------- | -------------------- | ------------- |
| GET    | `/livestock`                     | Get all livestock    | Yes           |
| GET    | `/livestock/:id`                 | Get single livestock | Yes           |
| POST   | `/livestock`                     | Register livestock   | Yes           |
| PUT    | `/livestock/:id`                 | Update livestock     | Yes           |
| DELETE | `/livestock/:id`                 | Delete livestock     | Yes           |
| POST   | `/livestock/:id/medical-records` | Add medical record   | Yes           |

#### Veterinarians (`/veterinarians`)

| Method | Endpoint                          | Description             | Auth Required |
| ------ | --------------------------------- | ----------------------- | ------------- |
| GET    | `/veterinarians`                  | Get all veterinarians   | No            |
| GET    | `/veterinarians/:id`              | Get single veterinarian | No            |
| GET    | `/veterinarians/:id/availability` | Get availability        | No            |
| PUT    | `/veterinarians/:id`              | Update profile          | Yes           |
| POST   | `/veterinarians/:id/availability` | Set availability        | Yes           |

### Example Requests

#### Register User

\`\`\`bash
curl -X POST http://localhost:5000/api/v1/auth/register \
 -H "Content-Type: application/json" \
 -d '{
"email": "farmer@example.com",
"password": "SecurePass123!",
"name": "John Doe",
"role": "farmer",
"phone": "+250788123456"
}'
\`\`\`

#### Create Appointment

\`\`\`bash
curl -X POST http://localhost:5000/api/v1/appointments \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer <your-token>" \
 -d '{
"veterinarianId": 1,
"livestockId": 1,
"date": "2025-01-15",
"time": "10:00",
"reason": "Vaccination",
"location": "Kigali, Gasabo",
"isEmergency": false
}'
\`\`\`

---

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts (farmers, veterinarians, admins)
- **livestock** - Livestock records
- **appointments** - Veterinary appointments
- **medical_records** - Livestock medical history
- **veterinarians** - Veterinarian profiles
- **availability** - Veterinarian availability schedules
- **notifications** - User notifications
- **sms_logs** - SMS message logs

---

## 📜 Available Scripts

\`\`\`bash

# Development

npm run dev # Start development server with hot reload
npm run build # Build for production
npm run start # Start production server

# Database

npm run db:migrate # Run database migrations
npm run db:seed # Seed database with sample data
npm run db:studio # Open Prisma Studio
npm run db:reset # Reset database

# Testing

npm run test # Run all tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality

npm run lint # Run ESLint
npm run format # Format code with Prettier
npm run type-check # Run TypeScript compiler check
\`\`\`

---

## 🌐 Deployment

### Deploy to Railway/Render

1. **Push to GitHub**

\`\`\`bash
git push origin main
\`\`\`

2. **Connect to Railway/Render**

   - Create new project
   - Connect GitHub repository
   - Add environment variables
   - Deploy

3. **Set up PostgreSQL**
   - Add PostgreSQL addon
   - Copy DATABASE_URL to environment variables

### Docker Deployment

\`\`\`bash

# Build image

docker build -t vetconnect-backend .

# Run container

docker run -p 5000:5000 --env-file .env vetconnect-backend
\`\`\`

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with 💚 for Rwanda's Agricultural Future**

</div>
