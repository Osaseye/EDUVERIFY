import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

const mockClasses: any[] = [];

export const AdminClassManagementPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Class Management</h1>
                        <p className="text-gray-500 text-sm">Oversee global curriculum, assign lecturers, and view class metrics.</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">add_box</span>
                        Create Class Request
                    </button>
                </div>

                {mockClasses.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500">No classes found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockClasses.map((cls) => (
                            <div key={cls.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <span className="material-symbols-outlined">school</span>
                                    </div>
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${cls.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {cls.status}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">{cls.title}</h3>
                                <p className="text-sm font-medium text-gray-500 mb-4">{cls.code}</p>
                                
                                <div className="mt-auto space-y-2 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Lecturer</span>
                                        <span className="font-semibold text-gray-800">{cls.lecturer}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Students</span>
                                        <span className="font-semibold text-gray-800">{cls.students} Enrolled</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mt-5">
                                    <button className="py-2 px-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">Edit</button>
                                    <button className="py-2 px-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Archive</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};