import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background-light">
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img alt="EduVerify Logo" className="h-10 w-10 border rounded-lg shadow-sm" src="/icon.png" />
              <span className="font-display font-bold text-2xl tracking-tight text-primary">EduVerify</span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>

      {/* Right Image/Branding Section */}
      <div className="hidden lg:block relative w-0 flex-1 bg-primary">
        <div className="absolute inset-0 h-full w-full object-cover flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-12">
          <div className="max-w-xl text-center">
            <h2 className="text-4xl font-display font-bold text-white mb-6">
              Secure Attendance Built for the Future
            </h2>
            <p className="text-lg text-white/80">
              Join thousands of students and lecturers using facial recognition to streamline campus presence effortlessly and securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
