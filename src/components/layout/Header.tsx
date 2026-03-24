import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export const Header = () => {
    const user = useAuthStore((state) => state.user);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dashboardTitle = user?.role === 'lecturer'
        ? 'Lecturer Dashboard'
        : user?.role === 'admin'
        ? 'Admin Dashboard'
        : 'Student Dashboard';

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-surface-light px-4 md:px-6 shrink-0 relative">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 md:hidden">
                    <img src="/icon.png" alt="EduVerify" className="h-6 w-6 object-contain" />
                </div>
                <h1 className="font-display text-xl md:text-2xl font-semibold text-slate-800">{dashboardTitle}</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        <span className="material-icons-round">notifications</span>
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>
                    
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800">Notifications</h3>
                                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">New</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                <div className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors cursor-pointer flex gap-3 items-start">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0">
                                        <span className="material-icons-round text-sm">info</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-800 font-medium">Welcome back to EduVerify!</p>
                                        <p className="text-xs text-slate-500 mt-1">Check your dashboard for today's classes.</p>
                                    </div>
                                </div>
                                <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start">
                                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg shrink-0">
                                        <span className="material-icons-round text-sm">security</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-800 font-medium">System Update</p>
                                        <p className="text-xs text-slate-500 mt-1">Biometric verification accuracy improved.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                                <button className="text-xs font-medium text-primary hover:underline">Mark all as read</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="hidden md:flex items-center text-sm text-slate-500">
                    <span className="material-icons-round mr-1 text-base">today</span>
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
        </header>
    );
};


