export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum LeaveType {
  SICK = 'SICK',
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  CASUAL = 'CASUAL'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  HALF_DAY = 'HALF_DAY',
  LEAVE = 'LEAVE'
}

export type Mood = 'HAPPY' | 'NEUTRAL' | 'SAD' | 'TIRED' | 'STRESSED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId: string;
  position: string;
  department: string;
  phone?: string;
  address?: string;
  joinDate: string;
  salary: number;
  avatarUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:mm
  checkOut?: string; // HH:mm
  status: AttendanceStatus;
  workHours: number;
  mood?: Mood;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string; // Denormalized for simpler list view
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  adminComment?: string;
  appliedOn: string;
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
