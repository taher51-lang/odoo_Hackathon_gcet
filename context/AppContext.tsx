import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AttendanceRecord, LeaveRequest } from '../types';
import { StorageService } from '../services/storage';

// Key for Session Storage
const SESSION_KEY = 'hrms_active_session_token';

interface AppContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  register: (user: User) => Promise<void>;
  users: User[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  checkIn: () => Promise<void>;
  checkOut: () => Promise<void>;
  applyLeave: (leave: LeaveRequest) => Promise<void>;
  updateLeaveStatus: (id: string, status: 'APPROVED' | 'REJECTED', comment?: string) => Promise<void>;
  updateProfile: (updatedUser: User) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  // Load initial data
  useEffect(() => {
    // Try to restore session
    const storedSession = sessionStorage.getItem(SESSION_KEY);
    if (storedSession) {
      try {
        const userData = JSON.parse(atob(storedSession));
        setUser(userData);
      } catch (e) {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    // Initialize DB connection
    StorageService.init().then(() => refreshData());
  }, []);

  // Poll for data or refresh when user changes
  useEffect(() => {
    if (user) refreshData();
  }, [user]);

  const refreshData = async () => {
    const [fetchedUsers, fetchedAttendance, fetchedLeaves] = await Promise.all([
      StorageService.getUsers(),
      StorageService.getAttendance(),
      StorageService.getLeaves()
    ]);
    setUsers(fetchedUsers);
    setAttendance(fetchedAttendance);
    setLeaves(fetchedLeaves);
  };

  const login = async (email: string, password?: string) => {
    const foundUser = await StorageService.login(email, password);
    if (foundUser) {
      setUser(foundUser);
      sessionStorage.setItem(SESSION_KEY, btoa(JSON.stringify(foundUser)));
      await refreshData();
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
    setUsers([]);
    setAttendance([]);
    setLeaves([]);
  };

  const register = async (newUser: User) => {
    await StorageService.addUser(newUser);
    await refreshData();
  };

  const checkIn = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const newRecord: AttendanceRecord = {
      id: '', // Backend handles ID
      userId: user.id,
      date: today,
      checkIn: new Date().toISOString(),
      status: 'PRESENT'
    };
    await StorageService.saveAttendance(newRecord);
    await refreshData();
  };

  const checkOut = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    // We pass userId and date so backend can find the record
    const updatePayload: any = {
      userId: user.id,
      date: today,
      checkOut: new Date().toISOString(),
      // Calculate hours roughly (Frontend calc, ideally backend does this)
      // but we just pass the timestamp and let backend update
    };
    
    // Find local record to calculate hours for display immediately (optional)
    const localRecord = attendance.find(a => a.userId === user.id && a.date === today);
    if (localRecord && localRecord.checkIn) {
        const start = new Date(localRecord.checkIn).getTime();
        const end = new Date(updatePayload.checkOut).getTime();
        updatePayload.totalHours = (end - start) / (1000 * 60 * 60);
    }

    await StorageService.saveAttendance(updatePayload);
    await refreshData();
  };

  const applyLeave = async (leave: LeaveRequest) => {
    await StorageService.saveLeave(leave);
    await refreshData();
  };

  const updateLeaveStatus = async (id: string, status: 'APPROVED' | 'REJECTED', comment?: string) => {
    await StorageService.updateLeave(id, status, comment);
    await refreshData();
  };

  const updateProfile = async (updatedUser: User) => {
    await StorageService.saveUser(updatedUser);
    if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
        sessionStorage.setItem(SESSION_KEY, btoa(JSON.stringify(updatedUser)));
    }
    await refreshData();
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, register, 
      users, attendance, leaves, 
      checkIn, checkOut, applyLeave, updateLeaveStatus, updateProfile 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};