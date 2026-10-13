# EcoConnect — Community-Based E-Waste Collection & Recycler Connection Platform

> **College Community Engagement Program (CEP) Proposal Project**  
> *Connect • Collect • Recycle — Give Your E-Waste a Better Destination.*

EcoConnect is a full-stack, production-ready web platform that bridges household e-waste generators with verified, certified electronic waste recyclers and community collection points. It enables community residents to schedule doorstep pickups or kiosk drop-offs, track collection requests through an auditable lifecycle, maintain permanent digital recycling archives, and participate in community awareness initiatives.

---

## 📌 Technology Stack

- **Frontend:**
  - React (v18)
  - Vite (v6)
  - JavaScript (ES6+)
  - React Router (v6)
  - Leaflet & React-Leaflet + OpenStreetMap (No paid API required)
  - Recharts (Dynamic MongoDB aggregation charts)
  - Lucide React (Clean environmental icons)
  - Responsive CSS3 custom design system (Mobile, Tablet, Desktop)
- **Backend:**
  - Node.js (v20+)
  - Express.js (v4 RESTful API)
  - MongoDB & Mongoose (v8) with MongoDB Atlas & local URI support
  - JWT Authentication (JsonWebToken)
  - bcryptjs password hashing
  - Built-in Node test runner (`node:test`) + Supertest
- **Database:**
  - MongoDB (MongoDB Atlas cloud cluster or local mongod)

---

## 🏛 Architecture & Monolithic Flow

```text
React (Vite :5173) ──HTTP / REST (JWT)──> Express API (:5000) ──Mongoose ODM──> MongoDB (Atlas / Local)
```

1. **Community User:** Registers items (phones, laptops, cables, batteries) → Selects location via Leaflet map or GPS → Chooses verified recycler & reserved slot → Submits request.
2. **Recycler Hub:** Views incoming requests → Accepts/Declines → Confirms schedule → Dispatches collection → Marks as `COLLECTED`.
3. **Permanent Archive & Admin:** Completed collections automatically generate an immutable `CollectionRecord` in MongoDB, driving real-time Recharts analytics and community metrics.

---

## 👥 User Roles & Access Control

| Role | Permissions & Portals |
| :--- | :--- |
| **Community User** (`user`) | Submit multi-item e-waste requests, pinpoint location on map, view request status timeline, cancel pending requests, participate in community survey. |
| **Recycler Partner** (`recycler`) | Manage collection requests, accept/schedule/mark collected, create and manage drop-off pickup spots and time slots, update facility operational coverage. Accounts initially register as `PENDING` until admin verification. |
| **Platform Admin** (`admin`) | Approve or reject recycler facilities, inspect all requests, view permanent collection records archive with multi-filter queries, review real-time Recharts analytics, analyze community survey metrics. |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB: A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string or a local MongoDB instance.

---

### Step 1: Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (copy from `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecoconnect
# If using MongoDB Atlas, replace with your URI:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecoconnect?retryWrites=true&w=majority
JWT_SECRET=ecoconnect_jwt_super_secret_key_college_cep_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Seed initial administrator, verified recycler, and demo records:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
# or: npm start
```
The backend API will be running at `http://localhost:5000`.

---

### Step 2: Frontend Setup

Open a new terminal window:

```bash
cd client
npm install
```

Create a `.env` file in `client/` (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:

```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🔑 Demo Credentials (For Presentation & Evaluation)

The database seed script (`npm run seed` in `server`) creates the following demo accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@ecoconnect.org` | `AdminPassword123!` | System administrator with approval & analytics access |
| **Verified Recycler** | `recycler@greencycle.org` | `RecyclerPassword123!` | Active recycler with pickup spots & assigned requests |
| **Community Resident** | `user@ecoconnect.org` | `UserPassword123!` | Alex Rivera, resident with active & completed requests |
| **Pending Recycler** | `contact@metroescrap.com` | `RecyclerPassword123!` | Metro E-Scrap Hub, awaiting Admin verification |

*(A convenient one-click "Demo Fast Fill" button is also integrated directly on the Login page for demonstration).*

---

## 📂 Project Structure

```text
CEP Project/
├── client/                           # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/               # Navbar, Footer, MapPicker, StatusTimeline, etc.
│   │   ├── context/                  # AuthContext (JWT, state, user, recycler)
│   │   ├── pages/                    # 13 Complete functional pages
│   │   ├── services/                 # api.js (Axios central endpoints)
│   │   ├── App.jsx                   # React Router routing configuration
│   │   ├── main.jsx                  # React DOM mount point
│   │   └── index.css                 # Clean environmental design system
│   ├── index.html                    # HTML entry with Leaflet & Google fonts
│   ├── vite.config.js                # Vite build & local proxy config
│   ├── package.json
│   └── .env.example
├── server/                           # Express + MongoDB Backend
│   ├── config/                       # db.js (Mongoose connection & Atlas support)
│   ├── controllers/                  # Auth, Request, Recycler, PickupSpot, Admin, Survey
│   ├── middleware/                   # JWT auth, role validation, error handler
│   ├── models/                       # Mongoose Schemas (User, Recycler, EWasteRequest, etc.)
│   ├── routes/                       # Express REST API routes
│   ├── seed/                         # seed.js (Demo accounts, requests, surveys)
│   ├── tests/                        # api.test.js (Backend integration tests)
│   ├── server.js                     # Central Express app entry
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register user or recycler (`role: 'user' | 'recycler'`)
- `POST /api/auth/login` — Login with email/password; returns JWT token
- `GET /api/auth/me` — Retrieve authenticated user & linked recycler profile
- `PUT /api/auth/profile` — Update user profile details

### Collection Requests (`/api/requests`)
- `POST /api/requests` — Submit new multi-item e-waste collection request
- `GET /api/requests/my` — Get authenticated user's collection requests
- `GET /api/requests/:id` — Get full request details with status history
- `PATCH /api/requests/:id/cancel` — Cancel a pending or accepted request

### Recycler Directory & Operations (`/api/recyclers`)
- `GET /api/recyclers` — Search verified recyclers by location, category, or distance
- `GET /api/recyclers/:id` — Get single recycler profile and active drop-off kiosks
- `GET /api/recyclers/profile/me` — Recycler's own profile and availability
- `PATCH /api/recyclers/:id/availability` — Update operational days, time slots, service areas
- `GET /api/recyclers/requests/all` — Recycler's incoming requests queue
- `PATCH /api/recyclers/requests/:id/status` — Update request status (`ACCEPTED`, `SCHEDULED`, `COLLECTED`, `REJECTED`)

### Pickup Spots (`/api/pickup-spots`)
- `GET /api/pickup-spots` — List active pickup spots
- `POST /api/pickup-spots` — Create a new collection kiosk / spot (Recycler / Admin)
- `PATCH /api/pickup-spots/:id` — Update spot capacity, coordinates, dates, slots
- `DELETE /api/pickup-spots/:id` — Remove a pickup spot

### Admin & Analytics (`/api/admin`)
- `GET /api/admin/stats` — Overall system statistics (requests, items, recyclers, users)
- `GET /api/admin/users` — List registered users
- `GET /api/admin/recyclers` — List recyclers with `PENDING` queue
- `PATCH /api/admin/recyclers/:id/verify` — Approve (`VERIFIED`) or reject recycler
- `GET /api/admin/requests` — View all system-wide collection requests
- `GET /api/admin/records` — Filter permanent collection records archive
- `GET /api/admin/analytics` — Recharts aggregation data (categories, status, trends)

### Community Survey (`/api/survey`)
- `POST /api/survey` — Submit responses to 10 CEP e-waste survey questions
- `GET /api/survey/analytics` — Aggregated survey charts (Admin only)
- `GET /api/survey/all` — Individual respondent survey submissions (Admin only)

---

## 🧪 Automated Testing

Run the automated integration test suite:

```bash
cd server
npm test
```

The test suite validates:
- Health check endpoint
- User registration and JWT issuance
- User authentication with valid and invalid passwords
- Protected route authorization
- Multi-item e-waste request creation
- User request list retrieval
- Recycler request acceptance, scheduling, and collection completion

---

## 🚢 Deployment Notes

- **Frontend:** Build with `npm run build` in `client`. Ready for deployment on Vercel, Netlify, or AWS Amplify. Set `VITE_API_URL` to the production backend URL.
- **Backend:** Ready for deployment on Render, Railway, or Heroku. Set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` in environment variables.
- **Database:** MongoDB Atlas M0 (Free Tier) cluster. Ensure network access IP whitelist (`0.0.0.0/0`) is enabled in the Atlas dashboard.
