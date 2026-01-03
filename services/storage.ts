import { User, AttendanceRecord, LeaveRequest } from '../types';

const API_URL = '/api';

const headers = {
  'Content-Type': 'application/json',
};

// --- API Service ---

export const StorageService = {
  
  // Initialize Database (Optional helper)
  init: async () => {
    try {
      await fetch(`${API_URL}/init`);
    } catch (e) {
      console.error("Backend not running");
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const res = await fetch(`${API_URL}/users`);
      return res.ok ? await res.json() : [];
    } catch (e) {
      console.error("Failed to fetch users", e);
      return [];
    }
  },
  
  saveUser: async (user: User) => {
    await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(user)
    });
  },

  addUser: async (user: User) => {
    // This is handled by register usually, but needed for interface consistency
    await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify(user)
    });
  },

  getAttendance: async (): Promise<AttendanceRecord[]> => {
    try {
      const res = await fetch(`${API_URL}/attendance`);
      return res.ok ? await res.json() : [];
    } catch (e) {
      console.error("Failed to fetch attendance", e);
      return [];
    }
  },
  
  saveAttendance: async (record: AttendanceRecord) => {
    await fetch(`${API_URL}/attendance`, {
      method: 'POST',
      headers,
      body: JSON.stringify(record)
    });
  },

  getLeaves: async (): Promise<LeaveRequest[]> => {
    try {
      const res = await fetch(`${API_URL}/leaves`);
      return res.ok ? await res.json() : [];
    } catch (e) {
      console.error("Failed to fetch leaves", e);
      return [];
    }
  },
  
  saveLeave: async (leave: LeaveRequest) => {
    // Determine if it's new or update based on calling context in AppContext, 
    // but our backend split them slightly.
    // For simplicity, if it has 'status' change alone it might be update.
    // We will assume new leave creation here.
    await fetch(`${API_URL}/leaves`, {
      method: 'POST',
      headers,
      body: JSON.stringify(leave)
    });
  },

  updateLeave: async (id: string, status: string, comment?: string) => {
    await fetch(`${API_URL}/leaves/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status, adminComment: comment })
    });
  },

  login: async (email: string, password?: string): Promise<User | undefined> => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error("Login failed", e);
    }
    return undefined;
  }
};