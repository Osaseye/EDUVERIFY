import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

export const AdminAttendanceReportsPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">System Reports</h1>
                        <p className="text-gray-500 text-sm">Download organizational attendance insights and aggregates.</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4 min-h-[50vh]">
                    <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                        <span className="material-symbols-outlined text-4xl">analytics</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Advanced Analytics Hub</h2>
                        <p className="text-gray-500 max-w-md mx-auto mt-2">
                            This module gives you a bird's-eye view of presence trends across all courses, faculties, and time periods.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full max-w-lg">
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:border-gray-800 hover:shadow-md transition-all group">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-800 mb-2">download</span>
                            <span className="font-semibold text-gray-800">Export CSV</span>
                            <span className="text-xs text-gray-500 mt-1">Raw dataset generator</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:border-gray-800 hover:shadow-md transition-all group">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-800 mb-2">picture_as_pdf</span>
                            <span className="font-semibold text-gray-800">Export PDF</span>
                            <span className="text-xs text-gray-500 mt-1">Print-ready summaries</span>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};