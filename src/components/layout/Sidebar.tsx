import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const Sidebar = () => {
    const { user, logout } = useAuthStore();

    const studentNavItems = [
        { path: '/student/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/student/classes', icon: 'class', label: 'My Classes' },
        { path: '/student/history', icon: 'history', label: 'Attendance History' },
        { path: '/student/scanner', icon: 'qr_code_scanner', label: 'Scan Attendance' },
        { path: '/student/settings', icon: 'settings', label: 'Settings' },
    ];

    const lecturerNavItems = [
        { path: '/lecturer/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/lecturer/create-class', icon: 'add_box', label: 'Create Class' },
        { path: '/lecturer/attendance-tracking', icon: 'rule', label: 'Attendance Tracking' },
        { path: '/lecturer/qr-generator', icon: 'qr_code', label: 'QR Generator' },
        { path: '/lecturer/settings', icon: 'settings', label: 'Settings' },
    ];

    const navItems = user?.role === 'lecturer' ? lecturerNavItems : studentNavItems;

    return (
        <aside className="hidden w-64 overflow-y-auto border-r border-slate-200 bg-surface-light md:block flex-shrink-0">
            <div className="flex h-16 items-center justify-center border-b border-slate-200 px-6">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <img src="/icon.png" alt="EduVerify" className="h-8 w-8 object-contain" />
                    <span>EduVerify</span>
                </div>
            </div>
            <div className="px-4 py-6">
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`
                            }
                        >
                            <span className="material-icons-round">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="mt-auto px-4 py-6 border-t border-slate-200">
                <div className="flex items-center gap-3 rounded-lg p-3 bg-slate-50">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h4 className="truncate font-medium text-sm">{user?.name || 'User'}</h4>
                        <p className="truncate text-xs text-slate-500 capitalize">{user?.role || 'Student'}</p>
                    </div>
                    <button onClick={logout} className="text-slate-400 hover:text-slate-600">
                        <span className="material-icons-round text-sm">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

