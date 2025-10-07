# 🔧 VetConnect Rwanda - Backend API

<div align="center">

**RESTful API for VetConnect Rwanda Platform**

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

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
| **MongoDB**    | Primary database (Atlas) |
| **Mongoose**   | MongoDB ODM              |
| **JWT**        | Authentication tokens    |
| **Bcrypt**     | Password hashing         |
| **Zod**        | Schema validation        |
| **Winston**    | Logging                  |
| **Jest**       | Testing framework        |

---

## 📁 Folder Structure

```
vetconnect-backend/
│
├── 📁 src/
│   ├── 📁 config/                             # Configuration
│   │   ├── database.ts                        # MongoDB Atlas connection
│   │   ├── env.ts                             # Environment variables
│   │   └── constants.ts                       # App constants
│   │
│   ├── 📁 models/                             # MongoDB Models
│   │   ├── User.ts
│   │   ├── Veterinarian.ts
│   │   ├── Appointment.ts
│   │   ├── Livestock.ts
│   │   ├── HealthRecord.ts
│   │   ├── Alert.ts
│   │   ├── EmergencyFlag.ts
│   │   └── Notification.ts
│   │
│   ├── 📁 controllers/                        # Route Controllers
│   │   ├── authController.ts
│   │   ├── appointmentController.ts
│   │   ├── livestockController.ts
│   │   ├── veterinarianController.ts
│   │   ├── alertController.ts
│   │   ├── notificationController.ts
│   │   └── adminController.ts
│   │
│   ├── 📁 routes/                             # API Routes
│   │   ├── index.ts                           # Main router
│   │   ├── authRoutes.ts
│   │   ├── appointmentRoutes.ts
│   │   ├── livestockRoutes.ts
│   │   ├── veterinarianRoutes.ts
│   │   ├── alertRoutes.ts
│   │   ├── notificationRoutes.ts
│   │   └── adminRoutes.ts
│   │
│   ├── 📁 middleware/                         # Middleware
│   │   ├── auth.ts                            # Authentication
│   │   ├── errorHandler.ts                    # Error handling
│   │   ├── validation.ts                      # Input validation
│   │   └── rateLimiter.ts                     # Rate limiting
│   │
│   ├── 📁 services/                           # Business Logic
│   │   ├── authService.ts
│   │   ├── appointmentService.ts
│   │   ├── livestockService.ts
│   │   ├── smsService.ts                      # Twilio integration
│   │   ├── emailService.ts
│   │   └── 📁 predictive/
│   │       ├── vaccinationAlerts.ts
│   │       └── diseaseAlerts.ts
│   │
│   ├── 📁 utils/                              # Utility functions
│   │   ├── validators.ts
│   │   ├── helpers.ts
│   │   └── logger.ts
│   │
│   ├── 📁 types/                              # TypeScript types
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── appointment.ts
│   │   └── livestock.ts
│   │
│   └── server.ts                              # Main server file
│
├── 📁 scripts/                                # Utility scripts
│   ├── seedDatabase.ts
│   └── generateAlerts.ts
│
├── 📁 tests/                                  # Tests
│   ├── auth.test.ts
│   └── appointments.test.ts
│
├── .env                                       # Environment variables
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **MongoDB Atlas account**
- **npm** or **pnpm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Ange-Mukundente/vetconnect-backend.git
cd vetconnect-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB Atlas credentials and other configuration (see [Environment Variables](#environment-variables))

4. **Start the development server**

```bash
npm run dev
```

The API will be avaiable live at `https://vetconnect-backend-3.onrender.com`
The API will be available at `http://localhost:5000`

---

## 🔐 Environment Variables

```env

# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vetconnect?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# SMS Gateway (Africa's Talking)

```

```

---

## 📚 API Documentation

### Base URL

```

http://localhost:5000/api/v1

```

### Authentication Header

```

Authorization: Bearer <token>

````

### Key Endpoints

#### Authentication (`/auth`)

- POST `/register` - Register new user
- POST `/login` - Login user
- POST `/logout` - Logout user
- GET `/me` - Current user profile

#### Appointments (`/appointments`)

- GET `/appointments` - List all
- GET `/appointments/:id` - Get single
- POST `/appointments` - Create
- PUT `/appointments/:id` - Update
- DELETE `/appointments/:id` - Cancel

#### Livestock (`/livestock`)

- GET `/livestock` - List all
- POST `/livestock` - Register
- PUT `/livestock/:id` - Update
- DELETE `/livestock/:id` - Delete

#### Veterinarians (`/veterinarians`)

- GET `/veterinarians` - List all
- GET `/veterinarians/:id` - Profile
- GET `/veterinarians/:id/availability` - Availability

---

## 🗄️ Database Schema

- `users` - Users (farmers, vets, admins)
- `livestock` - Livestock records
- `appointments` - Vet appointments
- `medical_records` - Health history
- `veterinarians` - Vet profiles
- `notifications` - Alerts & reminders

---

## 📜 Available Scripts

```bash
# Development
npm run dev
npm run build
npm run start

# Database
npm run db:seed
npm run db:reset

# Testing
npm run test
npm run test:watch

# Code Quality
npm run lint
npm run format
npm run type-check
````

---

## 🌐 Deployment

### Deploy to Render

**Push to GitHub**

```bash
git push origin main
```

**Connect to Render**

1. Go to Render and create a new Web Service.
2. Connect your GitHub repository (`vetconnect-rwanda-backend`).
3. Set the Environment to **Node**.
4. Specify the Build Command:

```bash
npm install && npm run build
```

5. Specify the Start Command:

```bash
npm run start
```

6. Add the environment variables from your `.env` file in the Render dashboard.

**Database Setup**

- Use a managed MongoDB Atlas database or external MongoDB.
- Copy the database URL to the `DATABASE_URL` environment variable.

✅ After deployment, your backend API is live at a Render URL, e.g.,
`https://vetconnect-backend.onrender.com/api/v1`

---

## 🤝 Contributing

Contributions welcome! Fork → branch → commit → PR.

---

## 📄 License

MIT License. See [LICENSE](LICENSE).

---
