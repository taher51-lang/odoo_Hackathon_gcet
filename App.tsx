import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Profile from './pages/Profile';
import EmployeeManagement from './pages/EmployeeManagement';
import DatabaseSchema from './pages/DatabaseSchema';
import { Role } from './types';

const AppContent = () => {
  const { user } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'attendance':
        return <Attendance />;
      case 'leaves':
        return <Leaves />;
      case 'payroll':
        return <Payroll />;
      case 'profile':
        return <Profile />;
      case 'employees':
        return user.role === Role.ADMIN ? <EmployeeManagement /> : <Dashboard />;
      case 'database':
        return user.role === Role.ADMIN ? <DatabaseSchema /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
