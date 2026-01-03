# HRMS Pro

## Overview
HRMS Pro is a Human Resource Management System with a React/TypeScript frontend and Flask/Python backend. It provides employee management, attendance tracking, leave management, and payroll features.

## Project Structure
```
/
├── backend/              # Flask Python backend
│   ├── app.py           # Main Flask application with API routes
│   └── requirements.txt # Python dependencies
├── components/          # React components
│   └── Layout.tsx       # Main layout component
├── context/
│   └── AppContext.tsx   # React context for state management
├── pages/               # React page components
│   ├── Attendance.tsx
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── DatabaseSchema.tsx
│   ├── EmployeeManagement.tsx
│   ├── Leaves.tsx
│   ├── Payroll.tsx
│   └── Profile.tsx
├── services/
│   └── storage.ts       # API service for backend communication
├── App.tsx              # Main React app component
├── index.html           # HTML entry point
├── index.tsx            # React entry point
├── types.ts             # TypeScript type definitions
├── vite.config.ts       # Vite configuration
└── package.json         # Node.js dependencies
```

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (CDN)
- **Backend**: Flask, Flask-SQLAlchemy, Flask-CORS
- **Database**: PostgreSQL (via Replit)
- **Icons**: Lucide React
- **Charts**: Recharts

## Running the Application

### Development
- **Frontend**: Runs on port 5000 via `npm run dev`
- **Backend**: Runs on port 8000 via `python backend/app.py`

The frontend proxies API calls to the backend through Vite's proxy configuration.

### Default Credentials
- **Admin**: admin@hrms.com / admin123

## Database
The application uses PostgreSQL. The database is automatically initialized when the backend starts.

### Tables
- `users` - Employee/admin user accounts
- `attendance` - Attendance records (check-in/check-out)
- `leaves` - Leave requests and approvals

## API Endpoints
- `GET /api/init` - Initialize database
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create/update attendance
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id` - Update leave status

## Recent Changes
- 2026-01-03: Initial setup - recreated backend from corrupted files, configured for Replit environment
