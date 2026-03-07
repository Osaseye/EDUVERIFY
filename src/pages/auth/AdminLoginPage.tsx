import React from 'react';
import { AdminLoginForm } from '../../features/auth/components/AdminLoginForm';

export const AdminLoginPage = () => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
        <p className="text-gray-500">Sign in to the administration framework</p>
      </div>

      <AdminLoginForm />
      
      <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
        Secured by EduVerify Systems
      </div>
    </div>
  );
};
