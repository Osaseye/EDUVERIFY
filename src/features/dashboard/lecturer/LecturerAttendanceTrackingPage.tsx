import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

export const LecturerAttendanceTrackingPage = () => {
    return (
        <DashboardLayout>
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold text-text-light mb-2">Track Attendance</h1>
                    <p className="text-text-muted-light mb-8">View records and manage student attendance history.</p>
                    
                    {/* Mock Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="p-4 font-semibold text-gray-600">Student Name</th>
                                    <th className="p-4 font-semibold text-gray-600">Matric No</th>
                                    <th className="p-4 font-semibold text-gray-600">Course</th>
                                    <th className="p-4 font-semibold text-gray-600">Present Rate</th>
                                    <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[] as any[].map((item) => (
                                     <tr key={item} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">Student {item}</td>
                                        <td className="p-4 text-gray-500">CSC/2020/00{item}</td>
                                        <td className="p-4 text-gray-500">CSC 301</td>
                                        <td className="p-4">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">95%</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-primary hover:underline text-sm font-medium">View History</button>
                                        </td>
                                     </tr>
                                ))}
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                                        No attendance records found.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};