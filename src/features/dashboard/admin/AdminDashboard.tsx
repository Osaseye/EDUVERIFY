import { useAuthStore } from '../../../store/useAuthStore';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../../services/userService';
import { classService } from '../../../services/classService';
import { attendanceService } from '../../../services/attendanceService';

export const AdminDashboard = () => {
  const { user } = useAuthStore();

  const { data: users = [] } = useQuery({
      queryKey: ['admin-users-all'],
      queryFn: () => userService.getAllUsers()
  });

  const { data: classes = [] } = useQuery({
      queryKey: ['admin-classes-all'],
      queryFn: () => classService.getAllClasses()
  });

  const studentsCount = users.filter((u: any) => u.role === 'student').length;
  const lecturersCount = users.filter((u: any) => u.role === 'lecturer').length;

  const stats = [
      { label: 'Total Students', value: studentsCount, icon: 'school', color: 'bg-blue-100 text-blue-600', trend: 'Active' },
      { label: 'Total Lecturers', value: lecturersCount, icon: 'person', color: 'bg-blue-100 text-blue-600', trend: 'Active' },
      { label: 'Active Classes', value: classes.length, icon: 'class', color: 'bg-green-100 text-green-600', trend: 'Global' },
      { label: 'Total Users', value: users.length, icon: 'groups', color: 'bg-purple-100 text-purple-600', trend: 'Verified' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      System Overview
                  </h1>
                  <p className="text-gray-500">
                      Welcome back, {user?.name || 'Administrator'}. Here is your system snapshot.
                  </p>
              </div>
              <div className="flex gap-3">
                  <button className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 shadow-sm">
                      <span className="material-symbols-outlined text-sm">download</span>
                      System Report
                  </button>
              </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.length === 0 ? (
                  <div className="col-span-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
                      No stats available.
                  </div>
              ) : (
                  stats.map((stat, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                              <div className={`p-3 rounded-xl ${stat.color}`}>
                                  <span className="material-symbols-outlined">{stat.icon}</span>
                              </div>
                          </div>
                          <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                          <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                          <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">{stat.trend}</span>
                      </div>
                  ))
              )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Shortcut Modules</h2>
                  <div className="grid grid-cols-2 gap-4">
                      <Link to="/admin/users" className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all group">
                         <span className="material-symbols-outlined text-gray-700 bg-white p-2 rounded-lg shadow-sm mb-3 block w-max group-hover:text-blue-600">manage_accounts</span>
                         <h3 className="font-bold text-gray-900">User Management</h3>
                         <p className="text-xs text-gray-500 mt-1">Add, remove, or edit students and lecturers.</p>
                      </Link>
                      <Link to="/admin/classes" className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all group">
                         <span className="material-symbols-outlined text-gray-700 bg-white p-2 rounded-lg shadow-sm mb-3 block w-max group-hover:text-green-600">account_balance</span>
                         <h3 className="font-bold text-gray-900">Class Management</h3>
                         <p className="text-xs text-gray-500 mt-1">Manage global curriculum and assignments.</p>
                      </Link>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <div className="flex items-center justify-between mb-4">
                     <h2 className="text-lg font-bold text-gray-900">Recent Activity Logs</h2>
                     <Link to="/admin/logs" className="text-sm font-medium text-blue-600 hover:underline">View All</Link>
                 </div>
                 <div className="space-y-4">
                     <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-sm">   
                         No recent activity.
                     </div>
                 </div>
              </div>
          </div>
      </div>
    </DashboardLayout>
  );
};
