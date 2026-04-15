# 🐾 PawTracker

PawTracker is a web-based platform designed to help pet owners and animal care organizations manage animal information in a centralized and efficient way. The system allows users to register pets, track medical history, find nearby veterinarians, and support adoption initiatives. By integrating these features into a single application, PawTracker improves organization, accessibility, and overall animal care management.


---

## App Cloud Deploy

https://pawtrackerclient-v8vs.onrender.com

- AI feature 98% working 

## 📁 Project Structure

```
/
├── backend/      # Node.js + Express REST API
└── frontend/     # React (Vite) client
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- MongoDB connection (configured in backend `.env`)

---

### Backend

```bash
cd backend
npm install
node server.js
```

The API will run on `http://localhost:5000`.

--

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or whichever port Vite assigns).

---

## 👤 User Roles

PawTracker has three types of users:

| Role | Description |
|------|-------------|
| **User** | Regular adopter — can browse animals and submit adoption requests |
| **Organization** | Animal shelter or rescue — can list and manage animals |
| **Admin** | Platform administrator — approves organization sign-ups |

---

## 🔐 Authentication & Test Accounts

### Regular User
Sign up directly on the platform — no approval needed.

### Organization
Organization sign-up goes through admin approval. To skip that flow and test directly, use:

```
Email:    saveanimals@org.com
Password: 123456
```

### Admin
```
Email:    adminpawtracker@gmail.com
Password: Admin@123
```

> ⚠️ **Note:** The admin account has **MFA (Multi-Factor Authentication)** enabled via Gmail. You'll need access to the admin's Gmail inbox to complete login.

Email: adminpawtracker@gmail.com
Password: Admin@123

---

## 🌟 Features

### For Users
- CRUD for their own pets
- Browse available animals with filters 
- Submit adoption requests
- Find Care Campaigns
- Find Clinics with Map


### For Organizations
- Register and manage animals (create, edit, delete)
- Filter animals by name, breed, species, and adoption status
- View and respond to adoption requests from users
- CRUD for Care Campaigns
- Edit their profile
- Edit Settings (dark mode)

### For Admins
- Approve or reject organization sign-up requests
- Deactive accounts
- Get overall analysis of the application
- CRUD for clinics
- Check adoption actions
- Manage and create care campaigns


## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |

---

## 📌 Notes

- The backend must be running before the frontend for API calls to work.
