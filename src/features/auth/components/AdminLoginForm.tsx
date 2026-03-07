import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';

export const AdminLoginForm = () => {
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
      // Basic mock check for admin credentials
      if (email.toLowerCase() === 'admin@eduverify.com') {
          const dummyUser = {
            uid: 'admin-123',
            name: 'Super Admin',
            email,
            role: 'admin'
          } as any;
          
          setUser(dummyUser);
          navigate('/admin/dashboard');
      } else {
         setError('Invalid admin credentials. (Hint: Use admin@eduverify.com)');
         setIsLoading(false);
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            shield_person
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all"
            placeholder="admin@eduverify.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            lock
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-800 transition-all shadow-md ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
        ) : (
          'Access Admin Portal'
        )}
      </button>
    </form>
  );
};
