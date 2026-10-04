import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { School, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage({ onSwitchToSignup }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/10 blur-3xl mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-3xl mix-blend-multiply" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <img src="/logo-full.png" alt="ClassOptima Logo" className="h-16 w-auto" />
        </div>
        <p className="mt-2 text-center text-sm text-slate-600">
          Resource Optimization & Classroom Allocation Engine
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl bg-white/50 backdrop-blur-sm py-2 px-3 border text-slate-900"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl bg-white/50 backdrop-blur-sm py-2 px-3 border text-slate-900"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition items-center gap-2"
              >
                Sign in <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button onClick={onSwitchToSignup} className="text-sm font-medium text-brand-600 hover:text-brand-500">
              Don't have an account? Sign up
            </button>
          </div>

          {/* Demo Credentials Box */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Demo Credentials
            </h3>
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Admin (Timetable Gen)</span>
                  <span className="text-slate-500">U: admin | P: 123</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Lecturer Portal</span>
                  <span className="text-slate-500">U: lecturer | P: 123</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Student Study Hub</span>
                  <span className="text-slate-500">U: student | P: 123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
