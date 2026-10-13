# EcoConnect – E-Waste Collection Platform

**College Community Engagement Program (CEP) Project**

EcoConnect connects community members with verified e-waste recyclers for easy collection, pickup scheduling, and responsible electronic waste recycling.

## Technology Stack
- **Frontend:** React, Vite, JavaScript, Leaflet, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs

## Features
- User and recycler registration and login
- E-waste collection request submission and tracking
- Recycler search and pickup scheduling
- Map-based location selection
- Recycler verification by admin
- Collection history and analytics dashboard
- Community e-waste awareness survey

## Project Structure
- `client/` – React frontend
- `server/` – Express backend and APIs
- `README.md` – Project documentation

## Installation and Setup

**1. Backend**
```bash
cd server
npm install
```

Create a `.env` file using `.env.example` and configure `PORT`, `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.

```bash
npm run seed
npm run dev
```

**2. Frontend**

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file and set:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Testing
Run backend tests:

```bash
cd server
npm test
```

## Project Goal
To promote responsible e-waste disposal by connecting communities with verified recyclers through a simple digital platform.
