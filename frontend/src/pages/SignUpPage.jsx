import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { School, User, Lock, ArrowRight, GraduationCap } from 'lucide-react';

export default function SignUpPage({ onSwitchToLogin }) {
  const { signup } = useAuth();
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    // Student specifics
    regNo: '',
    degree: 'IT',
    intake: 'Intake 41',
    // Lecturer specifics
    department: 'IT',
    faculty: 'Computing',
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Construct user object based on role
    const newUser = {
      role: role,
      name: formData.name,
      email: formData.email,
      username: formData.username,
      password: formData.password
    };

    if (role === 'STUDENT') {
      newUser.regNo = formData.regNo;
      newUser.degree = formData.degree;
      newUser.intake = formData.intake;
      newUser.faculty = 'Computing';
    } else {
      newUser.department = formData.department;
      newUser.faculty = formData.faculty;
    }

    const res = signup(newUser);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-3xl mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-3xl mix-blend-multiply" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center flex-col items-center gap-2 mt-6">
          <img src="/logo-full.png" alt="ClassOptima Logo" className="h-16 w-auto" />
          <h2 className="text-xl font-bold text-slate-700">Sign Up</h2>
        </div>
        <p className="mt-2 text-center text-sm text-slate-600">
          Create an account to access the Smart Campus Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-200">
          
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button 
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition ${role === 'STUDENT' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'}`}
              onClick={() => setRole('STUDENT')}
            >
              Student
            </button>
            <button 
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition ${role === 'LECTURER' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'}`}
              onClick={() => setRole('LECTURER')}
            >
              Lecturer
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full text-slate-900 border-slate-300 rounded-lg py-1.5 px-3 border text-sm" placeholder="John Doe" />
            </div>

            {role === 'STUDENT' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Reg No</label>
                    <input type="text" name="regNo" required value={formData.regNo} onChange={handleChange} className="w-full text-slate-900 border-slate-300 rounded-lg py-1.5 px-3 border text-sm" placeholder="D-COE-..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Intake</label>
                    <select name="intake" value={formData.intake} onChange={handleChange} className="w-full text-slate-900 border-slate-300 rounded-lg py-1.5 px-3 border text-sm bg-white">
                      <option>Intake 40</option><option>Intake 41</option><option>Intake 42</option><option>Intake 43</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degree Program / Department</label>
                  <select name="degree" value={formData.degree} onChange={handleChange} className="w-full text-slate-900 border-slate-300 rounded-lg py-1.5 px-3 border text-sm bg-white">
                    <option value="IT">Information Technology (IT)</option>
                    <option value="IS">Information Systems (IS)</option>
                    <option value="Computer Science">Computer Science (CS)</option>
                    <option value="Software Engineering">Software Engineering (SE)</option>
                    <option value="Computer Engineering">Computer Engineering (CE)</option>
                    <option value="DBA">Data Science and Business Analytics (DBA)</option>
                  </select>
                </div>
              </>
            )}

            {role === 'LECTURER' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select name="department" value={formData.department} onChange={handleChange} className="w-full text-slate-900 border-slate-300 rounded-lg py-1.5 px-3 border text-sm bg-white">
                    <option>IT</option><option>IS</option><option>Computer Science</option><option>Software Engineering</option><option>Computer Engineering</option><option>DBA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Faculty</label>
                  <input type="text" name="faculty" value={formData.faculty} onChange={handleChange} className="w-full text-slate-900 border-slate-300 rounded-lg py-1.5 px-3 border text-sm bg-slate-100" readOnly />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full text-slate-900 border-slate-300 rounded-lg py-1.5 px-3 border text-sm" placeholder="name@kdu.ac.lk" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full text-slate-900 border-slate-300 rounded-lg py-1.5 px-3 border text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full text-slate-900 border-slate-300 rounded-lg py-1.5 px-3 border text-sm" />
              </div>
            </div>

            {error && <div className="text-red-500 text-xs font-bold text-center mt-2">{error}</div>}

            <div className="pt-2">
              <button type="submit" className="w-full flex justify-center py-2 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition items-center gap-2">
                Create Account <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={onSwitchToLogin} className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
              Already have an account? Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
