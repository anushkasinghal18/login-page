# ERP-LMS Portal - Auth & Integration

A premium, full-stack Academic ERP and LMS Portal authentication system featuring role-based access control, secure session persistence, database fallback strategies, and Google/Microsoft/Apple social identity sign-ins.

---

## 📂 Project Structure

```text
login page/
├── backend/                  # Express.js Authentication Server
│   ├── config/               # Database config & connection state
│   │   └── db.js
│   ├── models/               # MongoDB models (Mongoose schemas)
│   │   └── User.js
│   ├── services/             # Strategy service layer (Phase 9)
│   │   └── userService.js    # In-memory Mock vs Mongo dispatcher
│   ├── middleware/           # Auth middlewares
│   │   ├── authMiddleware.js # Token extraction and validation
│   │   └── roleMiddleware.js # Role-based route authorization
│   ├── controllers/          # Business logic handlers
│   │   └── authController.js
│   ├── routes/               # API endpoint definitions
│   │   └── authRoutes.js
│   ├── utils/                # JWT utilities
│   │   └── generateToken.js
│   ├── .env                  # Server configs & secret credentials (ignored)
│   ├── .env.example          # Environment variable template
│   └── server.js             # Main server entrypoint
│
├── frontend/                 # Next.js App Router (TypeScript)
│   ├── app/                  # Route pages
│   │   ├── auth/simulated    # Simulated OAuth callback handler popup
│   │   ├── student/dashboard # Student ERP dashboard
│   │   ├── teacher/dashboard # Faculty ERP dashboard
│   │   ├── admin/dashboard   # Administration command dashboard
│   │   └── globals.css       # Styling configuration
│   ├── components/           # UI and auth form components
│   │   └── auth/             # Login/Signup/Social form components
│   └── lib/                  # Schema validations, hook utilities
│       └── auth/
│           ├── use-auth.ts   # Core client-side API state hook
│           └── schemas.ts    # Zod form validators
│
└── .gitignore                # Root gitignore rules
```

---

## 🚀 Running the Project

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
*The server will boot at `http://localhost:5000`.*

### 2. Run the Next.js Frontend App
```bash
cd frontend
npm install
npm run dev
```
*The client app will launch at `http://localhost:3000`.*

---

## ⚙️ Key Architectures

### 1. MongoDB Database Auto-Failover Strategy
The system handles database connectivity gracefully:
- If a valid `MONGO_URI` is supplied and MongoDB is online, queries route to the MongoDB database using Mongoose.
- If MongoDB is offline or `MONGO_URI` is omitted, the backend toggles a global connection state and automatically fails over to the **Mock User Store** (in-memory) without crashing.

### 2. Interactive Social Sign-In Simulation
To simplify local developer testing without requiring active Google, Azure, and Apple Developer client accounts:
- If provider Client IDs in `.env` are set to placeholder values, clicking Google, Microsoft, or Apple buttons launches a beautiful **OAuth Sign-in Simulator**.
- Selecting a role in the simulator will pass a mock OAuth identity back to the parent client window.
- The client submits the token to the backend endpoints (`/api/auth/google`, etc.). The backend verifies the simulation and securely registers the user, issues a real signed JWT, and redirects the client to the matching dashboard.
