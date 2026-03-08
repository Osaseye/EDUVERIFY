import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { classService } from '../../../services/classService';
import { attendanceService } from '../../../services/attendanceService';
import { useAuthStore } from '../../../store/useAuthStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { StudentActiveSessionScanner } from './components/StudentActiveSessionScanner';
import type { AttendanceSession } from '../../../types';

export const ClassDetailsPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
    const [isJoining, setIsJoining] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);

    useEffect(() => {
        if (!classId) return;

        const unsubscribe = attendanceService.subscribeToActiveSession(classId, async (session) => {
            if (session && !activeSession) {
                toast.info('An attendance session is now open for this class!');
            }
            if (!session && activeSession) {
                setIsJoining(false);
                toast.info('The active attendance session has been closed.');
            }
            setActiveSession(session);
            
            // Check if the student has already checked into this session
            if (session && user) {
                try {
                    const records = await attendanceService.getRecordsBySessionId(session.id as string);
                    const alreadyCheckedIn = records.some(r => r.userId === user.uid);
                    setHasCheckedIn(alreadyCheckedIn);
                } catch (error) {
                    console.error("Failed to check existing attendance", error);
                }
            } else {
                setHasCheckedIn(false);
            }
        });

        return () => unsubscribe();
    }, [classId, activeSession, user]);

    const { data: cls, isLoading } = useQuery({
        queryKey: ['class-details', classId],
        queryFn: () => classService.getClassById(classId || ''),
        enabled: !!classId
    });

    const { data: classSessions = [], isLoading: isLoadingSessions } = useQuery({
        queryKey: ['class-sessions', classId],
        queryFn: () => attendanceService.getSessionsByClassId(classId || ''),
        enabled: !!classId
    });

    const { data: studentRecords = [], isLoading: isLoadingRecords } = useQuery({
        queryKey: ['student-records', user?.uid],
        queryFn: () => attendanceService.getRecordsByStudentId(user!.uid),
        enabled: !!user?.uid
    });

    const stats = useMemo(() => {
        const totalSessions = classSessions.length;
        
        // Filter records to only those that match the sessions of THIS class
        const classSessionIds = classSessions.map(s => s.id);
        const attendedRecords = studentRecords.filter(r => classSessionIds.includes(r.sessionId));
        
        const attended = attendedRecords.length;
        const percentage = totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0;

        // Map sessions to include attendance status for the history view
        const history = classSessions.map(session => {
            const record = attendedRecords.find(r => r.sessionId === session.id);
            
            // Format dates
            let sessionDate = 'Unknown Date';
            let sessionTime = 'Started';
            
            if (session.createdAt) {
                const dateObj = new Date(session.createdAt);
                sessionDate = format(dateObj, 'MMM dd, yyyy');
                sessionTime = format(dateObj, 'hh:mm a');
            } else if (session.startTime) {
                let dateObj: Date;
                if (session.startTime.seconds) {
                    dateObj = new Date(session.startTime.seconds * 1000);
                } else {
                    dateObj = new Date(session.startTime);
                }
                sessionDate = format(dateObj, 'MMM dd, yyyy');
                sessionTime = format(dateObj, 'hh:mm a');
            }

            return {
                ...session,
                attended: !!record,
                record: record || null,
                displayDate: sessionDate,
                displayTime: sessionTime,
                sortDate: session.createdAt ? new Date(session.createdAt).getTime() : 0
            };
        }).sort((a, b) => b.sortDate - a.sortDate); // newest first

        return { totalSessions, attended, percentage, history };
    }, [classSessions, studentRecords]);

    if (isLoading || isLoadingSessions || isLoadingRecords) {
        return (
            <DashboardLayout>
                <div className="flex justify-center p-12">
                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                </div>
            </DashboardLayout>
        );
    }

    if (!cls) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <span className="material-icons-round text-6xl text-slate-300 mb-4">school</span>
                    <h2 className="text-2xl font-bold text-slate-700">Class Not Found</h2>
                    <p className="text-slate-500 mt-2">The class details are not available or it has been deleted.</p>
                    <button
                        onClick={() => navigate('/student/classes')}
                        className="mt-6 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"
                    >
                        Return to Classes
                    </button>
                </div>
            </DashboardLayout>
        );
    }

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
                                {cls.code}
                            </span>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                                {cls.department} - {cls.level}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">{cls.name}</h2>
                        <p className="text-slate-600 font-medium">Instructor: {cls.lecturerName || 'TBA'} • <span className="text-slate-500 font-normal">{cls.scheduleDays?.join(', ')} at {cls.scheduleTime}</span></p>
                        {cls.location && (
                            <p className="text-slate-500 mt-1 flex items-center gap-1">
                                <span className="material-icons-round text-sm">location_on</span> {cls.location}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Session Notification */}
                    {activeSession && !hasCheckedIn && !isJoining && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-fade-in">
                            <div className="flex items-center gap-3">
                                <span className="material-icons-round text-emerald-600 animate-pulse">sensors</span>
                                <div>
                                    <h4 className="font-bold text-emerald-800">Active Session!</h4>
                                    <p className="text-sm text-emerald-600">The lecturer has opened attendance for this class.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsJoining(true)}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
                            >
                                Join Session
                            </button>
                        </div>
                    )}

                    {isJoining && activeSession && (
                        <StudentActiveSessionScanner 
                            sessionId={activeSession.id} 
                            onSuccess={() => {
                                setHasCheckedIn(true);
                                setIsJoining(false);
                            }}
                            onCancel={() => setIsJoining(false)}
                        />
                    )}

                    {hasCheckedIn && activeSession && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                            <span className="material-icons-round text-emerald-600">check_circle</span>
                            <div>
                                <h4 className="font-bold text-emerald-800">You are checked in!</h4>
                                <p className="text-sm text-emerald-600">Your attendance for the current session has been verified.</p>
                            </div>
                        </div>
                    )}

                    <section className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Course Description</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {cls.description || 'No description provided for this class.'}
                        </p>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-surface-light shadow-sm overflow-hidden">
                        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Your Attendance History</h3>
                        </div>
                        {stats.history.length === 0 ? (
                            <div className="p-6 text-center py-10">
                                <span className="material-icons-round text-6xl text-slate-200 mb-3">history</span>
                                <h4 className="font-medium text-slate-700">No attendance sessions recorded yet</h4>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                                {stats.history.map((session: any) => (
                                    <div key={session.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                        <div>
                                            <p className="font-medium text-slate-800">
                                                {session.displayDate}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {session.displayTime} 
                                                {session.record?.verificationMethod && ` • Checked in via ${session.record.verificationMethod.toUpperCase()}`}
                                            </p>
                                        </div>
                                        <div>
                                            {session.attended ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    Present
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Absent
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Your Statistics</h3>

                        <div className="flex items-center justify-center py-4 border-b border-slate-100">
                            <div className={`relative h-32 w-32 rounded-full border-8 flex items-center justify-center ${
                                stats.percentage >= 75 ? 'border-emerald-500' :
                                stats.percentage >= 50 ? 'border-amber-500' : 'border-red-500'
                            }`}>
                                <div className="text-center">
                                    <span className="text-2xl font-bold text-slate-800">{stats.percentage}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1 font-medium">Total Classes</p>
                                <p className="text-xl font-bold text-slate-800">{stats.totalSessions}</p>
                            </div>
                            <div className="text-center p-3 bg-emerald-50 rounded-lg text-emerald-700">
                                <p className="text-xs mb-1 font-medium">Attended</p>
                                <p className="text-xl font-bold">{stats.attended}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
};
