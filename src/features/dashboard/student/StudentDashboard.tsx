import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Good morning, {user?.name?.split(' ')[0] || 'Student'}</h2>
                    <p className="text-slate-600">Here's your attendance overview for today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                        <span className="material-icons-round text-base">file_download</span>
                        Export Report
                    </button>
                    <button 
                        onClick={() => navigate('/student/scanner')}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-primary-hover transition-colors"
                    >
                        <span className="material-icons-round text-base">qr_code_scanner</span>
                        Scan Attendance
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                            <span className="material-icons-round text-xl">school</span>
                        </div>
                        <span className="flex items-center text-xs font-medium text-green-600">
                            <span className="material-icons-round mr-1 text-sm">trending_up</span>
                            Enrolled
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">6</h3>
                    <p className="text-sm font-medium text-slate-500">Total Classes</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                            <span className="material-icons-round text-xl">check_circle</span>
                        </div>
                        <span className="flex items-center text-xs font-medium text-green-600">
                            <span className="material-icons-round mr-1 text-sm">trending_up</span>
                            +2%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">92%</h3>
                    <p className="text-sm font-medium text-slate-500">Average Attendance</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                            <span className="material-icons-round text-xl">history_edu</span>
                        </div>
                        <span className="flex items-center text-xs font-medium text-red-500">
                            <span className="material-icons-round mr-1 text-sm">warning</span>
                            2 Missed
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">48</h3>
                    <p className="text-sm font-medium text-slate-500">Classes Attended</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                            <span className="material-icons-round text-xl">event_available</span>
                        </div>
                        <span className="text-xs font-medium text-slate-400">Today</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">2</h3>
                    <p className="text-sm font-medium text-slate-500">Upcoming Sessions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-primary to-emerald-900 p-6 shadow-md text-white">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Ready for your next class?</h3>
                                <p className="text-emerald-100 max-w-md">CS305: Database Systems starts in 30 minutes. Make sure you are in the geofenced area.</p>
                            </div>
                            <button 
                                onClick={() => navigate('/student/scanner')}
                                className="shrink-0 flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary hover:bg-emerald-50 shadow-lg transition-transform active:scale-95"
                            >
                                <span className="material-icons-round">qr_code_scanner</span>
                                Scan to Attend
                            </button>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-surface-light shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <h3 className="font-bold text-lg text-slate-800">Recent Attendance Activity</h3>
                            <a className="text-sm font-medium text-primary hover:text-primary-hover" href="#">View All</a>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <div className="flex items-start gap-4 p-6 hover:bg-slate-50 transition-colors">
                                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                    <span className="material-icons-round text-xl">co_present</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-slate-800">CS101: Intro to Programming</h4>
                                        <span className="text-xs text-slate-500">2 hours ago</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">Attendance marked present for "Lecture 5: Loops".</p>
                                    <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1 text-green-600"><span className="h-2 w-2 rounded-full bg-green-500"></span> Verified via Face ID</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 hover:bg-slate-50 transition-colors">
                                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                    <span className="material-icons-round text-xl">cancel</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-slate-800">MTH201: Calculus II</h4>
                                        <span className="text-xs text-slate-500">Yesterday</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">Missed attendance for "Lecture 12: Integrals".</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-xl border border-slate-200 bg-surface-light shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <h3 className="font-bold text-lg text-slate-800">Upcoming Sessions</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="relative overflow-hidden rounded-lg border border-l-4 border-slate-200 border-l-primary bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                                <div className="mb-2 flex justify-between">
                                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">In 30 min</span>
                                    <button className="text-slate-400 hover:text-primary"><span className="material-icons-round text-sm">more_horiz</span></button>
                                </div>
                                <h4 className="font-bold text-slate-800">CS305: Database Systems</h4>
                                <p className="text-sm text-slate-500">Room 302 • Lecture Hall B</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="text-xs font-medium text-slate-500">Dr. Alan Smith</div>
                                    <button className="text-xs font-semibold text-primary hover:text-primary-hover">Prepare</button>
                                </div>
                            </div>
                            <div className="relative overflow-hidden rounded-lg border border-l-4 border-slate-200 border-l-orange-500 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                                <div className="mb-2 flex justify-between">
                                    <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800">14:00 PM</span>
                                </div>
                                <h4 className="font-bold text-slate-800">CS401: Advanced Algorithms</h4>
                                <p className="text-sm text-slate-500">Lab 4 • Science Block</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="text-xs font-medium text-slate-500">Prof. Sarah Jenkins</div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-slate-200 px-6 py-3 text-center">
                            <a className="text-sm font-medium text-primary hover:text-primary-hover" href="#">View Full Schedule</a>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Pending Tasks</h3>
                        <div className="space-y-3">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900">Complete face data onboarding</span>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900">Review attendance dispute for MTH201</span>
                            </label>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
};

