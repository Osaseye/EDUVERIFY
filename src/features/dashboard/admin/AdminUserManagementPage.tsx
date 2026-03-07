import React, { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

const mockUsers: any[] = [];

export const AdminUserManagementPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">User Management</h1>
                        <p className="text-gray-500 text-sm">Manage all students, lecturers, and admins in the system.</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        Add New User
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
                        <div className="relative flex-1 max-w-sm">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                            <input 
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none text-sm transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                            <span className="material-symbols-outlined text-sm">filter_list</span>
                            Filter
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-white border-b border-gray-100">
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Name</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Email</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Role</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    mockUsers.map((user) => (
                                         <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                    {user.name.charAt(0)}
                                                </div>
                                                {user.name}
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                                                    user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'Lecturer' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                                                    user.status === 'Active' ? 'text-green-600' : 'text-red-500'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="text-gray-400 hover:text-gray-800 transition-colors p-1">
                                                    <span className="material-symbols-outlined text-lg">more_vert</span>
                                                </button>
                                            </td>
                                         </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
