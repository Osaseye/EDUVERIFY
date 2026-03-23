import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { attendanceService } from '../../../services/attendanceService';
import { classService } from '../../../services/classService';
import { useAuthStore } from '../../../store/useAuthStore';
import { format } from 'date-fns';

export const AttendanceHistoryPage = () => {
    const { user } = useAuthStore();
    const [allSessions, setAllSessions] = useState<any[]>([]);

    const { data: records = [], isLoading: isLoadingRecords } = useQuery({
        queryKey: ['student-attendance-records', user?.uid],
        queryFn: () => attendanceService.getRecordsByStudentId(user!.uid),
        enabled: !!user?.uid
    });

    const { data: classes = [], isLoading: isLoadingClasses } = useQuery({
        queryKey: ['student-my-classes', user?.uid],
        queryFn: () => classService.getClassesByStudent(user!.uid),
        enabled: !!user?.uid
    });

    // Fetch sessions related to the user's classes
    useEffect(() => {
        if (classes.length > 0) {
            const fetchSessions = async () => {
                const sessionsPromises = classes.map(cls => attendanceService.getSessionsByClassId(cls.id));
                const sessionsResults = await Promise.all(sessionsPromises);
                setAllSessions(sessionsResults.flat());
            };
            fetchSessions();
        }
    }, [classes]);

    const [sortAsc, setSortAsc] = useState(false);

    const history = useMemo(() => {
        if (!records.length) return [];
        
        const data = records.map(record => {
            const session = allSessions.find(s => s.id === record.sessionId);
            let course = classes.find(c => c.id === session?.classId);
            
            // if we have denormalized classId on the record itself
            if (!course && record.classId) {
                course = classes.find(c => c.id === record.classId);
            }

            let dateStr = 'Unknown Date';
            let timeStr = 'Unknown Time';
            if (record.timestamp?.seconds) {
                dateStr = format(new Date(record.timestamp.seconds * 1000), 'MMM dd, yyyy');
                timeStr = format(new Date(record.timestamp.seconds * 1000), 'hh:mm a');
            } else if ((record as any).createdAt) {
                dateStr = format(new Date((record as any).createdAt), 'MMM dd, yyyy');
                timeStr = format(new Date((record as any).createdAt), 'hh:mm a');
            }
            
            return {
                id: record.id,
                date: dateStr,
                course: course?.name || course?.code || `Course (${session?.classId || '...'})`,
                time: timeStr,
                type: record.verificationMethod === 'face' ? 'Face ID' : record.verificationMethod === 'qr' ? 'QR Code' : 'Manual',
                status: record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : 'Present',
                rawDate: record.timestamp?.seconds || 0
            };
        });
        
        return data.sort((a, b) => sortAsc ? a.rawDate - b.rawDate : b.rawDate - a.rawDate);
    }, [records, classes, allSessions, sortAsc]);

    const handleExport = () => {
        if (!history.length) return;
        const headers = ["Date", "Course", "Time Logged", "Verification Method", "Status"];
        const rows = history.map(r => [r.date, r.course, r.time, r.type, r.status]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.map(f => `"${f}"`).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "attendance_history.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Check loading
    const isLoading = isLoadingRecords || isLoadingClasses;


    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Attendance History</h2>
                    <p className="text-slate-600">Review your past attendance records and verification methods.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setSortAsc(!sortAsc)} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                        <span className="material-icons-round text-base">filter_list</span>
                        Sort {sortAsc ? 'Newest' : 'Oldest'}
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        Loading attendance history...
                                    </td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No attendance history found.
                                    </td>
                                </tr>
                            ) : (
                                history.map((record: any) => (
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
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};
