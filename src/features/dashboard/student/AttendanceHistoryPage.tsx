import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

export const AttendanceHistoryPage = () => {
    // Mock attendance history
    const history: any[] = [];

    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Attendance History</h2>
                    <p className="text-slate-600">Review your past attendance records and verification methods.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                        <span className="material-icons-round text-base">filter_list</span>
                        Filter
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                        <span className="material-icons-round text-base">file_download</span>
                        Export
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-surface-light shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Course</th>
                                <th className="px-6 py-4 font-medium">Time Logged</th>
                                <th className="px-6 py-4 font-medium">Verification Method</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">{record.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{record.course}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{record.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            {record.type === 'Face ID' && <span className="material-icons-round text-blue-500 text-sm">face</span>}
                                            {record.type === 'QR Code' && <span className="material-icons-round text-purple-500 text-sm">qr_code</span>}
                                            {record.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No attendance history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};
