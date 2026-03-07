import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

export const MyClassesPage = () => {
    const navigate = useNavigate();

    // Mock data for classes
    const classes: any[] = [];

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">My Classes</h2>
                <p className="text-slate-600">View and manage the classes you are currently enrolled in.</p>
            </div>

            {classes.length === 0 ? (
                <div className="p-12 text-center border border-slate-200 bg-surface-light rounded-xl shadow-sm text-slate-500">
                    You are not enrolled in any classes.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => navigate(`/student/classes/${cls.id}`)}
                            className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm hover:shadow-md hover:border-primary/50 cursor-pointer transition-all flex flex-col group relative overflow-hidden"
                        >
                        {cls.isSessionOpen && (
                            <div className="absolute top-0 right-0 right-[-2rem] top-[1rem] bg-emerald-500 text-white text-[10px] font-bold py-1 px-8 rotate-45 shadow-sm">
                                LIVE
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${cls.isSessionOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                                {cls.code}
                            </span>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent navigation on menu click
                                }} 
                                className="text-slate-400 hover:text-primary z-10"
                            >
                                <span className="material-icons-round">more_vert</span>
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{cls.name}</h3>
                        <p className="text-sm text-slate-500 mb-4">{cls.instructor}</p>
                        
                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-sm text-slate-600">
                            <span className="material-icons-round text-base mr-2 text-slate-400">schedule</span>
                            {cls.schedule}
                        </div>
                    </div>
                ))}
                </div>
            )}
        </DashboardLayout>
    );
};
