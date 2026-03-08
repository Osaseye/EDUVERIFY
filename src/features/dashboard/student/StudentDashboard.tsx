import React from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { classService } from '../../../services/classService';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const { data: myClasses = [], isLoading } = useQuery({
        queryKey: ['student-classes', user?.uid],
        queryFn: () => classService.getClassesByStudent(user?.uid || ''),
        enabled: !!user?.uid
    });

    const recentActivity = myClasses.length > 0 ? myClasses.slice(0, 3) : [];

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <header className="bg-surface-light border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                            Welcome back, {user?.name} 👋
                        </h1>
                        <p className="text-slate-600 font-medium">Ready for your classes today?</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/student/classes')}
                            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm"
                        >
                            <span className="material-icons-round text-[20px]">class</span>
                            <span>View Classes</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Stats summary... */}
                    <div className="bg-surface-light border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                        <div className="bg-primary/10 p-4 rounded-xl text-primary">
                            <span className="material-icons-round text-3xl">school</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Enrolled Classes</p>
                            <p className="text-3xl font-black text-slate-800">{myClasses.length}</p>
                        </div>
                    </div>
                    {/* Other Stats */}
                    <div className="bg-surface-light border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                        <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600">
                            <span className="material-icons-round text-3xl">check_circle</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Attendance Rate</p>
                            <p className="text-3xl font-black text-slate-800">100%</p>
                        </div>
                    </div>

                    <div className="bg-surface-light border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                        <div className="bg-amber-50 p-4 rounded-xl text-amber-600">
                            <span className="material-icons-round text-3xl">event</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Classes Today</p>
                            <p className="text-3xl font-black text-slate-800">0</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">My Classes</h2>
                            <button
                                onClick={() => navigate('/student/classes')}
                                className="text-primary text-sm font-bold hover:text-primary-hover flex items-center gap-1"
                            >
                                View all <span className="material-icons-round text-[18px]">arrow_forward</span>
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                            </div>
                        ) : myClasses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {myClasses.slice(0, 4).map((cls) => (
                                    <div
                                        key={cls.id}
                                        onClick={() => navigate(`/student/classes/${cls.id}`)}
                                        className="bg-surface-light border border-slate-200 p-5 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-md">{cls.code}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-primary transition-colors">{cls.name}</h3>
                                        <p className="text-sm text-slate-500 font-medium mb-4">{cls.lecturerName || 'TBA'}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-surface-light border border-slate-200 rounded-2xl p-8 text-center">
                                <span className="material-icons-round text-5xl text-slate-300 mb-3">search_off</span>
                                <h3 className="text-lg font-bold text-slate-700">No classes found</h3>
                                <p className="text-slate-500 mt-1">You haven't been enrolled in any classes yet.</p>
                            </div>
                        )}
                    </section>

                    <aside className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
                        <div className="bg-surface-light border border-slate-200 rounded-2xl p-5 shadow-sm">
                            {recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivity.map((cls) => (
                                        <div key={cls.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                            <div className="bg-green-100 p-2 rounded-lg text-green-600 mt-1">
                                                <span className="material-icons-round text-[16px]">how_to_reg</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">Enrolled in {cls.name}</p>
                                                <p className="text-xs text-slate-500">{new Date(cls.createdAt || Date.now()).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <span className="material-icons-round text-4xl text-slate-200 mb-2">history</span>
                                    <p className="text-sm font-medium text-slate-500">No recent activity.</p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
};
