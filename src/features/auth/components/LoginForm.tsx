import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      let role: 'student' | 'lecturer' | 'admin' = 'student';
      if (email.toLowerCase() === 'teacher@eduverify.com' || email.toLowerCase() === 'lecturer@eduverify.com') {
          role = 'lecturer';
      } else if (email.toLowerCase() === 'admin@eduverify.com') {
          role = 'admin';
      }

      const dummyUser = {
        uid: 'user-123',
        name: role === 'admin' ? 'Admin User' : role === 'lecturer' ? 'Dr. John Doe' : 'Jane Student',
        email,
        role: role,
        matricNumber: role === 'student' ? 'CSC/2020/001' : undefined
      } as any;
      
      setUser(dummyUser);
      
      // Route based on role
      if (role === 'student') {
        navigate('/student/dashboard');
      } else if (role === 'lecturer') {
         navigate('/lecturer/dashboard');
      } else {
         navigate('/admin/dashboard');
      }
      
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
         <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
            <span className="material-symbols-outlined shrink-0 text-base">error</span>
            <p>{error}</p>
         </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            mail
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            lock
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700 font-medium mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">info</span> Helper
          </p>
          <ul className="text-xs text-blue-600 list-disc pl-4 space-y-1">
              <li>Log in with <strong className="font-bold">teacher@eduverify.com</strong> to access the Lecturer Dashboard.</li>
              <li>Log in with any other email for the Student Dashboard.</li>
          </ul>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-primary text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-opacity-90 transition-all shadow-md ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
};
