import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Bell, User, ChevronDown, CheckCircle2, X } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { notifications, markAllRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel bg-white/90 border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-sm">
      {/* Brand & AI Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <img src="/logo-icon.png" alt="ClassOptima" className="w-10 h-10 object-contain" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-900">ClassOptima</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              v1.0 • KDU Optimizer
            </span>
          </div>
          <p className="text-xs text-slate-500">Intelligent Space Allocation & Predictive Resource System</p>
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
            className="relative p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition"
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
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-600" />
                    Live AI Notifications
                  </h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">{notifications.length} alerts</span>
                </div>
                <button 
                  onClick={() => setShowNotifs(false)} 
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-emerald-700">{n.title}</span>
                      <span className="text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
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
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 hover:border-slate-300 transition"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
              <User className="w-5 h-5" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] font-semibold text-brand-600 tracking-wide uppercase">{currentUser.role} VIEW</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 ml-1" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50">
              <div className="px-3 py-2 text-xs text-slate-500 mb-2 border-b border-slate-100">
                Signed in as <br/>
                <span className="font-bold text-slate-800">{currentUser.email}</span>
              </div>
              
              <button
                onClick={() => { logout(); setShowRoleMenu(false); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
