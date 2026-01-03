import { User, AttendanceRecord, LeaveRequest, LeaveStatus, PayrollRecord, Mood } from '../types';

const API_URL = '/api';

const fetchJson = async (endpoint: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });
    if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
    }
    return res.json();
};

export const mockService = {
  // Auth
  login: async (email: string): Promise<User | null> => {
    try {
        return await fetchJson('/login', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    } catch (e) {
        console.error("Login failed", e);
        return null;
    }
  },
  
  register: async (user: Partial<User>): Promise<User> => {
    // Note: Registration not implemented in Python backend for this demo
    // Returning dummy to satisfy interface if needed
    throw new Error("Registration not supported in this demo");
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    return fetchJson('/users');
  },
  
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    return fetchJson(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
  },

  // Attendance
  getAttendance: async (userId?: string): Promise<AttendanceRecord[]> => {
    const query = userId ? `?userId=${userId}` : '';
    return fetchJson(`/attendance${query}`);
  },

  checkIn: async (userId: string, mood?: Mood): Promise<AttendanceRecord> => {
    return fetchJson('/attendance/checkin', {
        method: 'POST',
        body: JSON.stringify({ userId, mood })
    });
  },

  checkOut: async (userId: string): Promise<AttendanceRecord> => {
    return fetchJson('/attendance/checkout', {
        method: 'POST',
        body: JSON.stringify({ userId })
    });
  },

  // Leaves
  getLeaves: async (userId?: string): Promise<LeaveRequest[]> => {
    const query = userId ? `?userId=${userId}` : '';
    return fetchJson(`/leaves${query}`);
  },

  applyLeave: async (leave: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    return fetchJson('/leaves', {
        method: 'POST',
        body: JSON.stringify(leave)
    });
  },

  updateLeaveStatus: async (id: string, status: LeaveStatus, comment?: string): Promise<LeaveRequest> => {
    return fetchJson(`/leaves/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, comment })
    });
  },

  // Payroll
  getPayroll: async (userId?: string): Promise<PayrollRecord[]> => {
    const query = userId ? `?userId=${userId}` : '';
    return fetchJson(`/payroll${query}`);
  },

  // Analytics
  getBurnoutRisks: async (): Promise<User[]> => {
    return fetchJson('/analytics/burnout');
  },

  getHappinessStats: async (): Promise<{ name: string; value: number; color: string }[]> => {
    return fetchJson('/analytics/happiness');
  }
};
