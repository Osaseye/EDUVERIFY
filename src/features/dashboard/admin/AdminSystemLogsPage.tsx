import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

const mockLogs: any[] = [];

export const AdminSystemLogsPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">System Logs</h1>
                        <p className="text-gray-500 text-sm">Monitor application health, security alerts, and key audit events.</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Refresh Logs
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto">
                        <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-sm font-medium cursor-pointer">All Events</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200">Errors</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200">Warnings</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200">Audit Actions</span>
                    </div>
                    
                    <div className="divide-y divide-gray-50">
                        {mockLogs.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">No system logs available.</div>
                        ) : (
                            mockLogs.map((log) => (
                                <div key={log.id} className="p-4 hover:bg-gray-50/50 transition-colors flex items-start gap-4">
                                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                                        log.type === 'error' ? 'bg-red-50 text-red-500' :
                                        log.type === 'warning' ? 'bg-amber-50 text-amber-500' :
                                        'bg-blue-50 text-blue-500'
                                    }`}>
                                        <span className="material-symbols-outlined text-sm">
                                            {log.type === 'error' ? 'error' : log.type === 'warning' ? 'warning' : 'info'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-semibold text-gray-900 text-sm">{log.action}</h4>
                                            <span className="text-xs text-gray-500">{log.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{log.details}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};