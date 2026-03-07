import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate send email
    setTimeout(() => {
      setIsSent(true);
    }, 1000);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-text-light">
        Reset Password
      </h2>
      <p className="mt-2 text-sm text-text-muted-light">
        Remember your password?{' '}
        <Link to="/login" className="font-semibold text-primary hover:text-secondary hover:underline transition-colors">
          Log in here
        </Link>
      </p>

      <div className="mt-8">
        {isSent ? (
          <div className="rounded-xl bg-green-50 p-4 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-symbols-outlined text-green-400">check_circle</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Email sent</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
                <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                    &larr; Back to Login
                </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
