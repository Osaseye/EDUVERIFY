import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// Helper function to get all records for all sessions across the platform.
// This is a slow query for a production app, but fine for prototype.
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const fetchRecentAdminRecords = async () => {
    const q = query(collection(db, 'records'), orderBy('timestamp', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const exportToCSV = (records: any[], filename = 'attendance-report.csv') => {
  if (!records || !records.length) {
    alert("No data to export");
    return;
  }

  // Format data for better CSV reading
  const formattedRecords = records.map(record => ({
      ID: record.id,
      SessionID: record.sessionId,
      UserID: record.userId,
      Method: record.verificationMethod,
      Status: record.status || 'present',
      Timestamp: record.timestamp ? new Date(record.timestamp.seconds * 1000).toLocaleString() : 'Unknown'
  }));

  const headers = Object.keys(formattedRecords[0]);

  const csvContent = [
    headers.join(','),
    ...formattedRecords.map(record =>
      headers.map(header => {
        let cellValue = (record as any)[header] === null || (record as any)[header] === undefined ? '' : String((record as any)[header]);
        if (cellValue.search(/("|,|\n)/g) >= 0) {
          cellValue = `"${cellValue.replace(/"/g, '""')}"`;
        }
        return cellValue;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const AdminAttendanceReportsPage = () => {
    const { data: records = [], isLoading } = useQuery({
        queryKey: ['admin-global-records'],
        queryFn: fetchRecentAdminRecords
    });

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">System Reports & Records</h1>
                        <p className="text-gray-500 text-sm">Download insights and view recent global attendance activity.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={() => exportToCSV(records, 'admin-global-attendance.csv')}
                        className="flex items-center gap-4 p-6 border border-gray-200 bg-white rounded-xl hover:border-primary hover:shadow-md transition-all group"
                    >
                        <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-primary/10">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">download</span>
                        </div>
                        <div className="text-left">
                            <span className="block font-semibold text-gray-800">Export All to CSV</span>
                            <span className="text-sm text-gray-500 mt-1">Raw dataset generator for all platform records</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => alert("PDF generation coming soon. Please use CSV Export for now.")}
                        className="flex items-center gap-4 p-6 border border-gray-200 bg-white rounded-xl hover:border-primary hover:shadow-md transition-all group">
                        <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-primary/10">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">picture_as_pdf</span>
                        </div>
                        <div className="text-left">
                            <span className="block font-semibold text-gray-800">Export PDF Summary</span>
                            <span className="text-sm text-gray-500 mt-1">Print-ready summaries for faculty analytics</span>
                        </div>
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-bold text-lg text-slate-800">Recent Global Check-ins</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                    <th className="px-6 py-4 font-medium">Date & Time</th>
                                    <th className="px-6 py-4 font-medium">Session ID</th>
                                    <th className="px-6 py-4 font-medium">User ID</th>
                                    <th className="px-6 py-4 font-medium">Method</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            Loading recent records...
                                        </td>
                                    </tr>
                                ) : records.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            No global attendance records found.
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((record: any) => (
                                        <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                                                {record.timestamp ? format(new Date(record.timestamp.seconds * 1000), 'PP p') : 'Unknown Date'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {record.sessionId.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {record.userId.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    {record.verificationMethod === 'face' ? (
                                                        <><span className="material-icons-round text-blue-500 text-sm">face</span> Face ID</>
                                                    ) : (
                                                        <><span className="material-icons-round text-purple-500 text-sm">qr_code</span> QR Code</>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Present
                                                </span>
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