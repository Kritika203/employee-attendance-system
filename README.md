# AttendSync - Employee Attendance System

A full-stack Employee Attendance Management System built with the MERN stack and Flutter. The web dashboard allows admins to manage employees and view attendance records, while the Flutter mobile app allows employees to mark their own attendance using a unique employee code.

---

## Live Demo

| Platform | URL |
|----------|-----|
| Web Dashboard | https://employee-attendance-system-wheat.vercel.app |
| Backend API | https://employee-attendance-system-backend-tnhv.onrender.com |

**Admin Credentials:**
- Email: `admin@attendance.com`
- Password: `admin123`

> Note: The backend is hosted on Render's free tier and may take 30-50 seconds to wake up after inactivity. Open the backend URL first to warm it up before using the web or mobile app.

---

## Project Structure

```
employee-attendance-system/
├── backend/          # Node.js + Express REST API
├── frontend/         # React + Vite web dashboard
└── mobile/           # Flutter mobile application
```

---

## Features

### Web Dashboard (Admin)
- Admin login with JWT authentication
- Employee management — Add, Edit, Delete, View
- Auto-generated unique employee codes (EMP001, EMP002, ...)
- Daily attendance records with date and employee filters
- Dashboard with real-time stats (Total, Present, Absent, Not Marked)
- Auto-refresh attendance every 30 seconds
- Fully responsive UI with hamburger menu on mobile

### Mobile App (Employee)
- Employee login using employee code (e.g. EMP001)
- Mark attendance as Present or Absent
- View personal attendance history
- Profile screen with employee details
- Token stored locally using SharedPreferences

### Integration
- Attendance marked on mobile appears on the admin web dashboard
- Employees created on the web are immediately available on mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Authentication | JWT (JSON Web Tokens), bcryptjs |
| Web Frontend | React, Vite, Axios, React Router DOM |
| Mobile | Flutter, Dart, HTTP package, SharedPreferences |
| Database | MongoDB Atlas |
| Web Hosting | Vercel (frontend), Render (backend) |

---

## Prerequisites

Before running this project locally, make sure you have the following installed:

### General
- Git
- Node.js v18 or higher
- npm v9 or higher

### Backend and Frontend
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)

### Mobile
- Flutter SDK 3.0 or higher (https://flutter.dev/docs/get-started/install)
- Android Studio (for Android emulator or physical device)
- Android device with USB debugging enabled, OR Android emulator

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Kritika203/employee-attendance-system.git
cd employee-attendance-system
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

To get your `MONGO_URI`:
1. Create a free cluster on MongoDB Atlas
2. Go to Connect > Drivers
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Add your database name before the `?` (e.g. `attendance-db`)

Seed the admin user:

```bash
node seed.js
```

This creates an admin account with:
- Email: `admin@attendance.com`
- Password: `admin123`

Start the backend server:

```bash
npm run dev       # development mode with nodemon
npm start         # production mode
```

The server runs at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Update the API base URL in `src/api/axios.js`:

```js
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // for local development
});
```

Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`

---

### 4. Mobile Setup

```bash
cd mobile
flutter pub get
```

Update the API base URL in `lib/services/api_service.dart`:

```dart
const String baseUrl = 'http://10.0.2.2:5000/api'; // for Android emulator
// OR use your deployed Render URL for production
const String baseUrl = 'https://your-render-url.onrender.com/api';
```

> Note: Android emulators use `10.0.2.2` to refer to the host machine's localhost.

Run on emulator or connected device:

```bash
flutter run
```

---

## Data Flow

### Admin Login Flow
```
Admin enters email + password on web
        |
        v
POST /api/auth/login (Express)
        |
        v
bcryptjs compares password with hashed password in MongoDB
        |
        v
JWT token generated and returned to frontend
        |
        v
Token stored in localStorage
        |
        v
Axios interceptor attaches token to all subsequent requests
```

### Employee Login Flow (Mobile)
```
Employee enters employee code (e.g. EMP001) on Flutter app
        |
        v
POST /api/auth/employee-login (Express)
        |
        v
MongoDB looks up employee by employeeCode
        |
        v
JWT token generated with employee role and returned
        |
        v
Token and employee data saved to SharedPreferences
        |
        v
Employee navigated to Home screen
```

### Mark Attendance Flow (Mobile to Web Integration)
```
Employee taps Present or Absent on Flutter app
        |
        v
POST /api/attendance with employeeId, date, status
        |
        v
Express middleware verifies JWT token
        |
        v
Attendance record saved to MongoDB Atlas
        |
        v
Admin opens Attendance page on web dashboard
        |
        v
GET /api/attendance fetches records from same MongoDB Atlas
        |
        v
Attendance record appears in admin dashboard
        (auto-refreshes every 30 seconds)
```

### Add Employee Flow (Web to Mobile Integration)
```
Admin fills Add Employee form on web dashboard
        |
        v
POST /api/employees with name, phone, department
        |
        v
isAdmin middleware checks JWT role === 'admin'
        |
        v
employeeCode auto-generated (EMP001, EMP002, ...)
        |
        v
Employee saved to MongoDB Atlas
        |
        v
Admin shares employeeCode with the employee
        |
        v
Employee uses code to log in on Flutter mobile app
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Admin login | No |
| POST | `/api/auth/employee-login` | Employee login with code | No |

### Employees
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/employees` | Get all employees | Yes |
| POST | `/api/employees` | Add new employee | Yes (Admin only) |
| PUT | `/api/employees/:id` | Update employee | Yes (Admin only) |
| DELETE | `/api/employees/:id` | Delete employee | Yes (Admin only) |

### Attendance
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/attendance` | Mark attendance | Yes |
| GET | `/api/attendance` | Get attendance records | Yes |

**Query Parameters for GET `/api/attendance`:**
- `date` — filter by date (format: YYYY-MM-DD)
- `employeeId` — filter by employee MongoDB ID

---

## Database Schema

### Users Collection
```json
{
  "name": "String (required)",
  "email": "String (required, unique)",
  "password": "String (required, hashed with bcryptjs)",
  "role": "String (default: admin)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Employees Collection
```json
{
  "name": "String (required, letters only)",
  "phone": "String (required, exactly 10 digits)",
  "department": "String (required, letters only)",
  "employeeCode": "String (auto-generated, unique, e.g. EMP001)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Attendance Collection
```json
{
  "employeeId": "ObjectId (required, references Employee)",
  "date": "String (required, format: YYYY-MM-DD)",
  "status": "String (required, enum: Present | Absent)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Security

- Passwords are hashed using bcryptjs with a salt round of 10 before storing in the database
- All protected routes require a valid JWT token passed in the Authorization header as Bearer token
- Employee CRUD operations (create, update, delete) are restricted to admin role only via isAdmin middleware
- Input validation on all API endpoints — name and department accept letters only, phone must be exactly 10 digits
- CORS configured to allow only trusted origins (Vercel frontend and localhost)
- Environment variables used for all sensitive credentials — never committed to version control

---

## Deployment

### Backend (Render)
1. Connect your GitHub repo to Render (https://render.com)
2. Create a new Web Service
3. Set Root Directory to `backend`
4. Set Build Command to `npm install`
5. Set Start Command to `node server.js`
6. Add environment variables: `PORT`, `MONGO_URI`, `JWT_SECRET`
7. Select Free instance type
8. Deploy

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel (https://vercel.com)
2. Set Root Directory to `frontend`
3. Vercel auto-detects Vite configuration
4. Click Deploy
5. Ensure `vercel.json` exists in the frontend folder for client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for Render compatibility
4. Copy the connection string and add to Render environment variables

---

## Author

Kritika Yadav
BHons Computer Science — Biratnagar International College
GitHub: https://github.com/Kritika203