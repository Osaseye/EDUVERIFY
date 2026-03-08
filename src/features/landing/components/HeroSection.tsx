import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';

export const HeroSection = () => {
  const { user } = useAuthStore();
  
  const dashboardRoutes = {
    student: '/student/dashboard',
    lecturer: '/lecturer/dashboard',
    admin: '/admin/dashboard',
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-pattern z-0 pointer-events-none"></div>
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-text-light mb-6 leading-tight">
          Secure Attendance Through <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Facial Recognition</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-text-muted-light">
          Transform campus security and streamline classroom management with AI-powered identity verification. Fast, accurate, and contactless.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          {user ? (
            <Link to={dashboardRoutes[user.role as keyof typeof dashboardRoutes] || '/'} className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Go to Dashboard
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          ) : (
            <Link to="/register" className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Get Started Free
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          )}
          <a className="px-8 py-4 bg-white text-text-light border border-gray-200 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all flex items-center justify-center" href="#demo">
            <span className="material-symbols-outlined mr-2">play_circle</span>
            See How It Works
          </a>
        </div>
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-surface-light">
            <div className="absolute inset-0 bg-gradient-to-t from-background-light via-transparent to-transparent opacity-20 z-10"></div>
            <img alt="EduVerify Dashboard Interface" className="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChsNQC0sZZ6k-NjjqYSw2Sn_v2SOtXC_M-n07QApjfDlBic9QqstNmo-zm0VcahRZZnqMofp3rf3SMNc53hvkSNP8IuhAx6o_bFu0oJefa8hp64JfwaxbZOzjtk8-23YwaUWFyEH1B7f4_tQect0W2Lb3WTWocDnKBYwoZMKC7X_YoZspHu12LBtpNjXUcVTJ4bZzNQ6UztVAXefZztY2n0tIiNi_idxcY8RG2X1aE-ouVzQwyKbpqVUuNs4HSipoAOhtkE-hMEJsK" />
            <div className="absolute top-10 left-10 md:-left-12 bg-surface-light p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4 animate-[bounce_3s_infinite]">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                <p className="text-sm font-bold text-text-light">Verified Successfully</p>
                <p className="text-xs text-text-muted-light">Sarah J. • 9:41 AM</p>
              </div>
            </div>
            <div className="absolute bottom-10 right-10 md:-right-12 bg-surface-light p-5 rounded-xl shadow-xl border border-gray-100 w-48">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-text-muted-light">Attendance Rate</span>
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <div className="text-3xl font-bold text-primary">98.5%</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '98.5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
