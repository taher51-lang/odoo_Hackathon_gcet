export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added password field
  role: Role;
  position: string;
  department: string;
  joinDate: string;
  phone?: string;
  address?: string;
  salary?: number;
  avatarUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // ISO Date string YYYY-MM-DD
  checkIn?: string; // ISO Time string
  checkOut?: string; // ISO Time string
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  totalHours?: number;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'PAID' | 'SICK' | 'UNPAID';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminComment?: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'PAID' | 'PENDING';
}