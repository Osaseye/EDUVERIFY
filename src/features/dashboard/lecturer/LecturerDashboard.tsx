import React from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';

// Temporary mock data for the dashboard
const stats = [
    { label: 'Active Classes', value: '4', icon: 'class', trend: '+1 this week', color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Students', value: '256', icon: 'groups', trend: 'Stable', color: 'bg-green-100 text-green-600' },
    { label: 'Avg Attendance', value: '89%', icon: 'fact_check', trend: '+2% from last week', color: 'bg-purple-100 text-purple-600' },
];

const upcomingClasses = [
    { id: 1, course: 'CSC 301 - Operating Systems', time: '10:00 AM - 12:00 PM', location: 'LT 1', attendance: '85/90', status: 'upcoming' },
    { id: 2, course: 'CSC 303 - Database Design', time: '01:00 PM - 03:00 PM', location: 'Lab 4', attendance: '--', status: 'upcoming' },
];

const LecturerDashboard = () => {
    const user = useAuthStore(state => state.user);

    return (
        <DashboardLayout>
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                   <h1 className="text-2xl font-bold text-text-light mb-1">
                       Welcome back, {user?.name || 'Lecturer'} 👋
                   </h1>
                   <p className="text-text-muted-light">
                       Here's what's happening with your classes today.
                   </p>
                </div>
                <div className="flex gap-3">
                   <Link to="/lecturer/create-class" className="px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-sm">
                       <span className="material-symbols-outlined text-sm">add</span>
                       Create Class
                   </Link>
                   <button className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 border border-gray-200">
                       <span className="material-symbols-outlined text-sm">file_download</span>
                       Export Reports
                   </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <span className="material-symbols-outlined">{stat.icon}</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{stat.trend}</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                       <div className="flex items-center justify-between mb-6">
                           <h2 className="text-lg font-bold text-text-light">Today's Classes</h2>
                           <button className="text-primary text-sm font-medium hover:underline">View Schedule</button>
                       </div>
                       
                       <div className="space-y-4">
                           {upcomingClasses.map((cls) => (
                               <div key={cls.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/50 transition-colors gap-4">
                                   <div className="flex items-start gap-4">
                                       <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined">library_books</span>
                                       </div>
                                       <div>
                                           <h3 className="font-bold text-gray-800">{cls.course}</h3>
                                           <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                               <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">schedule</span> {cls.time}</span>
                                               <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">location_on</span> {cls.location}</span>
                                           </div>
                                       </div>
                                   </div>
                                   <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-200 sm:border-0">
                                       <div className="text-sm font-medium text-gray-500">
                                            Students: <span className="text-gray-800 font-bold">{cls.attendance}</span>
                                       </div>
                                       <Link to={`/lecturer/create-session/${cls.id}`} className="px-4 py-2 bg-text-light text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto border border-transparent shadow-sm whitespace-nowrap text-center">
                                           Start Session
                                       </Link>
                                   </div>
                               </div>
                           ))}
                           
                           {upcomingClasses.length === 0 && (
                               <div className="text-center py-8 text-gray-500">
                                   <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">event_available</span>
                                   <p>No classes scheduled for today.</p>
                               </div>
                           )}
                       </div>
                   </div>
                </div>

                {/* Right Sidebar Area */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-text-light">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/lecturer/qr-generator" className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-green-50/50 transition-all text-gray-600 hover:text-primary group">
                                <span className="material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform">qr_code</span>
                                <span className="text-xs font-medium text-center">QR Generator</span>
                            </Link>
                            <Link to="/lecturer/attendance-tracking" className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-green-50/50 transition-all text-gray-600 hover:text-primary group">
                                <span className="material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform">rule</span>
                                <span className="text-xs font-medium text-center">Track Attendance</span>
                            </Link>
                            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-green-50/50 transition-all text-gray-600 hover:text-primary group">
                                <span className="material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform">assessment</span>
                                <span className="text-xs font-medium text-center">Reports</span>
                            </button>
                            <Link to="/lecturer/settings" className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-green-50/50 transition-all text-gray-600 hover:text-primary group">
                                <span className="material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform">settings</span>
                                <span className="text-xs font-medium text-center">Settings</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </DashboardLayout>
    );
};

export default LecturerDashboard;
