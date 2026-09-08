import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import LecturerPortal from './pages/LecturerPortal';
import StudentPortal from './pages/StudentPortal';
import { LayoutDashboard, GraduationCap, School, ShieldAlert, Cpu } from 'lucide-react';

function MainApp() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('auto'); // auto follows role

  const currentView = activeTab === 'auto' ? currentUser.role : activeTab;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs for Easy Demonstration during University Presentation */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl glass-panel border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                currentView === 'ADMIN' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              1. Admin & AI Optimizer
            </button>

            <button
              onClick={() => setActiveTab('LECTURER')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                currentView === 'LECTURER' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              2. Lecturer Portal & Swaps
            </button>

            <button
              onClick={() => setActiveTab('STUDENT')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                currentView === 'STUDENT' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              3. Student Study Hub
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 pr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Core Active: Random Forest + Genetic Algorithm</span>
          </div>
        </div>

        {/* Dynamic Role Page Render */}
        <main className="transition-all duration-300">
          {currentView === 'ADMIN' && <AdminDashboard />}
          {currentView === 'LECTURER' && <LecturerPortal />}
          {currentView === 'STUDENT' && <StudentPortal />}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 glass-panel mt-12">
        <p>Essentials of Artificial Intelligence (Intake 42) • Group Project Submission</p>
        <p className="text-[11px] text-slate-600 mt-1">Smart Campus Resource Optimization & Classroom Allocation Engine</p>
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
