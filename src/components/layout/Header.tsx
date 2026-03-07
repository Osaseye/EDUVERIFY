import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export const Header = () => {
    const user = useAuthStore((state) => state.user);
    
    const dashboardTitle = user?.role === 'lecturer' 
        ? 'Lecturer Dashboard' 
        : user?.role === 'admin' 
        ? 'Admin Dashboard'
        : 'Student Dashboard';

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-surface-light px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 md:hidden">
                    <img src="/icon.png" alt="EduVerify" className="h-6 w-6 object-contain" />
                </div>
                <h1 className="font-display text-xl md:text-2xl font-semibold text-slate-800">{dashboardTitle}</h1>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
                    <span className="material-icons-round">notifications</span>
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <div className="hidden md:flex items-center text-sm text-slate-500">
                    <span className="material-icons-round mr-1 text-base">today</span>
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
        </header>
    );
};


