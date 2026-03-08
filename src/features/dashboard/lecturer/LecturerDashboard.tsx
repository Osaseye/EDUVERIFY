import React from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { classService } from '../../../services/classService';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';

export const LecturerDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const { data: myClasses = [], isLoading } = useQuery({
        queryKey: ['lecturer-classes', user?.uid],
        queryFn: () => classService.getClassesByLecturer(user?.uid || ''),
        enabled: !!user?.uid
    });

    const recentActivity = myClasses.length > 0 ? myClasses.slice(0, 3) : [];

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <header className="bg-surface-light border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                            Welcome back, Prof. {user?.name} 👋
                        </h1>
                        <p className="text-slate-600 font-medium">Ready for your classes today?</p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => navigate('/lecturer/create-class')} className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm flex items-center gap-2">
                            <span className="material-icons-round text-sm">add</span>
                            Create Class
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-slate-800">My Classes</h2>
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold">{myClasses.length} Total</span>
                        </div>

                        {isLoading ? (
                            <div className="bg-surface-light border border-slate-200 rounded-2xl p-8 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
                            </div>
                        ) : myClasses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {myClasses.map((cls) => (
                                    <div key={cls.id} className="bg-surface-light border border-slate-200 p-5 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-md">{cls.code}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-primary transition-colors">{cls.name}</h3>
                                        <p className="text-sm text-slate-500 font-medium mb-4">{cls.studentIds?.length || 0} Students Enrolled</p>

                                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                                            <button onClick={() => navigate(`/lecturer/classes/${cls.id}`)} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-[13px] font-bold hover:bg-slate-200 transition-colors">Details</button>
                                            <button onClick={() => navigate(`/lecturer/edit-class/${cls.id}`)} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-[13px] font-bold hover:bg-slate-200 transition-colors">Edit</button>
                                            <button 
                                                onClick={() => {
                                                    if (!cls.studentIds || cls.studentIds.length === 0) {
                                                        alert("You cannot start a session for a class with no enrolled students.");
                                                        return;
                                                    }
                                                    navigate(`/lecturer/create-session/${cls.id}`);
                                                }} 
                                                className={`flex-1 text-white py-2 rounded-lg text-[13px] font-bold transition-colors flex justify-center items-center gap-1 ${!cls.studentIds || cls.studentIds.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover'}`}
                                                title={!cls.studentIds || cls.studentIds.length === 0 ? "No students enrolled" : "Start Session"}
                                            >
                                                <span className="material-icons-round text-[16px]">qr_code</span> Start
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-surface-light border border-slate-200 rounded-2xl p-8 text-center">
                                <span className="material-icons-round text-5xl text-slate-300 mb-3">school</span>
                                <h3 className="text-lg font-bold text-slate-700">No classes yet</h3>
                                <p className="text-slate-500 mt-1 mb-4">Create your first class to get started.</p>
                                <button
                                    onClick={() => navigate('/lecturer/create-class')}
                                    className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm"
                                >
                                    Create First Class
                                </button>
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
                                            <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1">
                                                <span className="material-icons-round text-[16px]">add_circle</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">Created class {cls.name}</p>
                                                <p className="text-xs text-slate-500">{new Date(cls.createdAt || Date.now()).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-sm text-slate-500">No recent activity.</p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LecturerDashboard;
