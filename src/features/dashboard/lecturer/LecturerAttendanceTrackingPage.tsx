import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../store/useAuthStore';
import { classService } from '../../../services/classService';
import { attendanceService } from '../../../services/attendanceService';
import { userService } from '../../../services/userService';
import type { AttendanceRecord } from '../../../types';

export const LecturerAttendanceTrackingPage = () => {
    const { user } = useAuthStore();
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    const { data: myClasses = [] } = useQuery({
        queryKey: ['lecturer-classes', user?.uid],
        queryFn: () => classService.getClassesByLecturer(user?.uid || ''),
        enabled: !!user?.uid
    });

    const { data: sessions = [] } = useQuery({
        queryKey: ['class-sessions', selectedClassId],
        queryFn: () => attendanceService.getSessionsByClassId(selectedClassId!),
        enabled: !!selectedClassId
    });

    const { data: students = [] } = useQuery({
        queryKey: ['all-students'],
        queryFn: () => userService.getUsersByRole('student'),
    });

    const { data: allRecords = [] } = useQuery({
        queryKey: ['all-records-for-sessions', selectedClassId],
        queryFn: async () => {
             const allClassRecords: AttendanceRecord[] = [];
             for(let session of sessions) {
                 const records = await attendanceService.getRecordsBySessionId(session.id);
                 allClassRecords.push(...records);
             }
             return allClassRecords;
        },
        enabled: sessions.length > 0
    });

// Helper calculate attendance stats
    const selectedClass = myClasses.find(c => c.id === selectedClassId);

    const handleExportCSV = () => {
        if (!selectedClass || !selectedClass.studentIds || selectedClass.studentIds.length === 0) {
            alert("No students to export.");
            return;
        }

        const reportData = selectedClass.studentIds.map(studentId => {
            const student = students.find(s => s.uid === studentId);
            const totalSessions = sessions.length;
            const attendedSessions = allRecords.filter(r => r.userId === studentId).length;
            const rate = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0;

            return {
                "Student Name": student?.name || 'Unknown Student',
                "Matric Number": student?.profile?.matricNumber || 'N/A',
                "Total Sessions": totalSessions,
                "Attended Sessions": attendedSessions,
                "Attendance Rate (%)": rate
            };
        });

        const headers = Object.keys(reportData[0]);
        const csvContent = [
            headers.join(','),
            ...reportData.map(record =>
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
        link.setAttribute('download', `${selectedClass.code}_Attendance_Report.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    return (
        <DashboardLayout>
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-text-light mb-1">Track Attendance</h1>
                            <p className="text-text-muted-light text-sm">View records and manage student attendance history.</p>
                        </div>
                        
                        <div className="w-full sm:w-auto flex items-center gap-3">
                            <select 
                                value={selectedClassId || ''} 
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                className="w-full sm:w-64 p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            >
                                <option value="" disabled>Select a class...</option>
                                {myClasses.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.code} - {cls.name}</option>
                                ))}
                            </select>
                            {selectedClassId && (
                                <button
                                    onClick={handleExportCSV}
                                    className="px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium rounded-xl transition-colors flex items-center gap-2 border border-primary/20"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span> Export
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead className="bg-slate-50">
                                <tr className="border-b border-gray-200">
                                    <th className="p-4 font-semibold text-gray-600">Student Name</th>
                                    <th className="p-4 font-semibold text-gray-600">Matric No</th>
                                    <th className="p-4 font-semibold text-gray-600">Total Attended</th>
                                    <th className="p-4 font-semibold text-gray-600">Present Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!selectedClassId && (
                                     <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">
                                            Please select a class to view attendance records.
                                        </td>
                                    </tr>
                                )}
                                
                                {selectedClassId && selectedClass?.studentIds?.length === 0 && (
                                     <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            No students enrolled in this class.
                                        </td>
                                    </tr>
                                )}

                                {selectedClassId && selectedClass?.studentIds?.map((studentId) => {
                                    const student = students.find(s => s.uid === studentId);
                                    
                                    // Calculate rates
                                    const totalSessions = sessions.length;
                                    const attendedSessions = allRecords.filter(r => r.userId === studentId).length;
                                    const rate = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0;
                                    
                                    return (
                                     <tr key={studentId} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">{student?.name || 'Unknown Student'}</td>
                                        <td className="p-4 text-gray-500">{student?.profile?.matricNumber || 'N/A'}</td>
                                        <td className="p-4 text-gray-500 font-medium">{attendedSessions} / {totalSessions}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${rate > 70 ? 'bg-green-100 text-green-700' : rate > 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                {rate}%
                                            </span>
                                        </td>
                                     </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};