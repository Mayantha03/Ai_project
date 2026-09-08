import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Sparkles, User, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const { currentUser, switchRole } = useAuth();
  const { notifications, markAllRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
      {/* Brand & AI Tag */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white">Smart Campus AI</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              v1.0 • KDU Optimizer
            </span>
          </div>
          <p className="text-xs text-slate-400">Intelligent Space Allocation & Predictive Resource System</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifs(!showNotifs);
              if (!showNotifs) markAllRead();
            }}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel-glow bg-slate-950/95 border border-slate-800 shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-brand-500" />
                  Live AI Notifications
                </h3>
                <span className="text-xs text-slate-400">{notifications.length} alerts</span>
              </div>
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-emerald-400">{n.title}</span>
                      <span className="text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <span className="text-xl">{currentUser.avatar}</span>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white">{currentUser.name}</p>
              <p className="text-[10px] font-semibold text-brand-500 tracking-wide uppercase">{currentUser.role} VIEW</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel bg-slate-950 border border-slate-800 shadow-2xl p-2 z-50">
              <p className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Persona</p>
              
              <button
                onClick={() => { switchRole('admin'); setShowRoleMenu(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                  currentUser.role === 'ADMIN' ? 'bg-brand-900/40 text-brand-400 border border-brand-800/50' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">👑 Administrator</span>
                {currentUser.role === 'ADMIN' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => { switchRole('lecturer'); setShowRoleMenu(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                  currentUser.role === 'LECTURER' ? 'bg-brand-900/40 text-brand-400 border border-brand-800/50' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">👨‍🏫 Lecturer</span>
                {currentUser.role === 'LECTURER' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => { switchRole('student'); setShowRoleMenu(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                  currentUser.role === 'STUDENT' ? 'bg-brand-900/40 text-brand-400 border border-brand-800/50' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">🎓 Student</span>
                {currentUser.role === 'STUDENT' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
