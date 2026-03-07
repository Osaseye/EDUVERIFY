import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const FloatingMobileNav = () => {
    const { user } = useAuthStore();

    const studentNavItems = [
        { path: '/student/dashboard', icon: 'dashboard', label: 'Home' },
        { path: '/student/classes', icon: 'class', label: 'Classes' },
        { path: '/student/scanner', icon: 'qr_code_scanner', label: 'Scan', main: true },
        { path: '/student/history', icon: 'history', label: 'History' },
        { path: '/student/settings', icon: 'settings', label: 'Settings' },
    ];

    const lecturerNavItems = [
        { path: '/lecturer/dashboard', icon: 'dashboard', label: 'Home' },
        { path: '/lecturer/create-class', icon: 'add_box', label: 'Class' },
        { path: '/lecturer/qr-generator', icon: 'qr_code', label: 'QR', main: true },
        { path: '/lecturer/attendance-tracking', icon: 'rule', label: 'Track' },
        { path: '/lecturer/settings', icon: 'settings', label: 'Settings' },
    ];

    const adminNavItems = [
        { path: '/admin/dashboard', icon: 'dashboard', label: 'Home' },
        { path: '/admin/users', icon: 'group', label: 'Users' },
        { path: '/admin/classes', icon: 'school', label: 'Classes', main: true },
        { path: '/admin/reports', icon: 'assessment', label: 'Reports' },
        { path: '/admin/settings', icon: 'settings', label: 'Settings' },
    ];

    const navItems = user?.role === 'admin'
        ? adminNavItems
        : user?.role === 'lecturer'
        ? lecturerNavItems
        : studentNavItems;

    return (
        <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 animate-in slide-in-from-bottom-6">
            <nav className="bg-gray-900 shadow-xl rounded-full px-2 py-2 flex items-center gap-1 border border-gray-700/50 backdrop-blur-md">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => {
                            if (item.main) {
                                return `flex flex-col items-center justify-center w-14 h-14 rounded-full -mt-6 shadow-lg border-4 border-background-light bg-primary text-white transition-transform hover:scale-105 active:scale-95`;
                            }
                            return `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${
                                isActive 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-gray-400 hover:text-gray-200'
                            }`;
                        }}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`material-symbols-outlined ${item.main ? 'text-2xl' : 'text-xl'}`}>
                                    {item.icon}
                                </span>
                                {item.main ? null : (
                                    <span className="text-[9px] font-medium mt-0.5 tracking-wide">
                                        {item.label}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};
