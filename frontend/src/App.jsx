import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import LecturerPortal from './pages/LecturerPortal';
import StudentPortal from './pages/StudentPortal';
import { LayoutDashboard, GraduationCap, School, ShieldAlert, Cpu } from 'lucide-react';

import LoginPage from './pages/LoginPage';
import AuthFlow from './pages/AuthFlow';

function MainApp() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthFlow />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Dynamic Role Page Render */}
        <main className="transition-all duration-300">
          {currentUser.role === 'ADMIN' && <AdminDashboard />}
          {currentUser.role === 'LECTURER' && <LecturerPortal />}
          {currentUser.role === 'STUDENT' && <StudentPortal />}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-6 text-center text-xs text-slate-500 glass-panel bg-white/80 mt-12">
        <p className="font-medium text-slate-700">Essentials of Artificial Intelligence (Intake 42) • Group Project Submission</p>
        <p className="text-[11px] text-slate-500 mt-1">Smart Campus Resource Optimization & Classroom Allocation Engine</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainApp />
      </NotificationProvider>
    </AuthProvider>
  );
}
