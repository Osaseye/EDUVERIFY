import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../../features/auth/components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500">Sign in to your account to continue</p>
      </div>

      <LoginForm />

      <p className="text-center mt-8 text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-bold hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

