# Nexus HRMS

## Overview
A Human Resource Management System (HRMS) built with React, TypeScript, and Vite. The application provides features for employee management, attendance tracking, leave management, and payroll.

## Project Architecture
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (via CDN)
- **Routing**: React Router DOM
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## Directory Structure
- `/components` - Reusable React components (Layout)
- `/context` - React context providers (AuthContext)
- `/pages` - Page components (Dashboard, Employees, Attendance, Leaves, Payroll, Profile, Login)
- `/services` - Service layer (mockService for demo data)

## Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build` (outputs to `dist/`)

## Demo Credentials
- Admin: admin@nexus.com
- Employee: john@nexus.com

## Recent Changes
- Jan 3, 2026: Initial import and Replit environment setup
  - Configured Vite to use port 5000 with allowedHosts
  - Added script entry point to index.html
  - Set up static deployment configuration
