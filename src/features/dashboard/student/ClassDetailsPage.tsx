import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

export const ClassDetailsPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();

    // Mock data expansion based on ID
    // In a real app we would query the backend with `classId`
    const mockClass = {
        id: classId,
        code: classId === '1' ? 'CS101' : classId === '2' ? 'CS305' : classId === '3' ? 'MTH201' : 'CS401',
        name: classId === '1' ? 'Intro to Programming' : classId === '2' ? 'Database Systems' : classId === '3' ? 'Calculus II' : 'Advanced Algorithms',
        instructor: classId === '3' || classId === '4' ? 'Prof. Sarah Jenkins' : 'Dr. Alan Smith',
        schedule: classId === '1' ? 'Mon, Wed 10:00 AM' : 'Tue, Thu 11:30 AM',
        isSessionOpen: classId === '1', // Hardcode Session Open only for 'CS101'
        attendanceRate: '92%',
        totalClasses: 24,
        attended: 22,
        description: 'This is a foundational course that covers variables, data types, structures, and foundational algorithms.'
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-slate-500 hover:text-primary mb-6 flex items-center gap-1 text-sm font-medium transition-colors w-fit"
                >
                    <span className="material-icons-round text-base">arrow_back</span> Back to Classes
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                                {mockClass.code}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">{mockClass.name}</h2>
                        <p className="text-slate-600 font-medium">{mockClass.instructor} • <span className="text-slate-500 font-normal">{mockClass.schedule}</span></p>
                    </div>
                </div>
            </div>

            {mockClass.isSessionOpen && (
                <div className="mb-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="relative flex h-3.5 w-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                            </span>
                            <h3 className="text-2xl font-bold text-emerald-900">Attendance Session Active!</h3>
                        </div>
                        <p className="text-emerald-800">Your lecturer is currently taking attendance for this class. Scan your face or the QR code to mark yourself present.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/student/scanner')}
                        className="shrink-0 flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all w-full md:w-auto justify-center"
                    >
                        <span className="material-icons-round">qr_code_scanner</span>
                        Take Attendance
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <section className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Course Description</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {mockClass.description} Note: In a fully integrated version, this section would dynamically pull the long-form syllabus and description from the database directly related to {mockClass.code}.
                        </p>
                    </section>
                    
                    <section className="rounded-xl border border-slate-200 bg-surface-light shadow-sm overflow-hidden">
                        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Your Attendance History format</h3>
                        </div>
                        <div className="p-6 text-center py-10">
                            <span className="material-icons-round text-6xl text-slate-200 mb-3">history</span>
                            <h4 className="font-medium text-slate-700">No recent logs for this specific segment</h4>
                            <p className="text-sm text-slate-500 mt-1">Attend a class session to see it logged here.</p>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Your Statistics</h3>
                        
                        <div className="flex items-center justify-center py-4 border-b border-slate-100">
                            <div className="relative h-32 w-32 rounded-full border-8 border-slate-100 flex items-center justify-center">
                                <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-emerald-500" strokeDasharray={`${parseFloat(mockClass.attendanceRate) * 2.89} 300`} />
                                </svg>
                                <div className="text-center">
                                    <span className="text-2xl font-bold text-slate-800">{mockClass.attendanceRate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1 font-medium">Total Classes</p>
                                <p className="text-xl font-bold text-slate-800">{mockClass.totalClasses}</p>
                            </div>
                            <div className="text-center p-3 bg-emerald-50 rounded-lg text-emerald-700">
                                <p className="text-xs mb-1 font-medium">Attended</p>
                                <p className="text-xl font-bold">{mockClass.attended}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
};
