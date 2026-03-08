import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '../../../services/classService';
import { userService } from '../../../services/userService';
import { attendanceService } from '../../../services/attendanceService';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export const LecturerClassDetailsPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [activeSession, setActiveSession] = useState<any>(null);

    // Fetch Class Details
    const { data: cls, isLoading: isClassLoading } = useQuery({
        queryKey: ['class-details', classId],
        queryFn: () => classService.getClassById(classId || ''),
        enabled: !!classId
    });

    useEffect(() => {
        if (!classId) return;
        const unsubscribe = attendanceService.subscribeToActiveSession(classId, (session) => {
            setActiveSession(session);
        });
        return () => unsubscribe();
    }, [classId]);

    const handleCloseSession = async () => {
        if (!activeSession) return;
        try {
            await attendanceService.closeSession(activeSession.id);
            toast.success('Session closed successfully.');
        } catch (error) {
            toast.error('Failed to close session.');
        }
    };


    // Fetch all students to potentially enroll them (and correctly name them in live feed)
    const { data: students = [], isLoading: isStudentsLoading } = useQuery({
        queryKey: ['all-students'],
        queryFn: () => userService.getUsersByRole('student'),
    });

    const [liveRecords, setLiveRecords] = useState<any[]>([]);

    useEffect(() => {
        if (!activeSession) return;
        const unsubscribe = attendanceService.subscribeToSessionRecords(activeSession.id, (records) => {
            setLiveRecords(records);
        });
        return () => unsubscribe();
    }, [activeSession]);

    const enrollMutation = useMutation({
        mutationFn: (studentId: string) => classService.enrollStudent(classId!, studentId),
        onSuccess: () => {
            toast.success('Student enrolled successfully');
            queryClient.invalidateQueries({ queryKey: ['class-details', classId] });
        },
        onError: () => {
            toast.error('Failed to enroll student');
        }
    });

    if (isClassLoading) {
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
                        onClick={() => navigate('/lecturer/dashboard')}
                        className="mt-6 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"
                    >
                        Return to Dashboard
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
                    <span className="material-icons-round text-base">arrow_back</span> Back
                </button>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
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
                        <p className="text-slate-600 font-medium">
                            <span className="text-slate-500 font-normal">{cls.scheduleDays?.join(', ')} at {cls.scheduleTime}</span>
                        </p>
                        {cls.location && (
                            <p className="text-slate-500 mt-1 flex items-center gap-1">
                                <span className="material-icons-round text-sm">location_on</span> {cls.location}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {!activeSession && (
                            <button
                                onClick={() => navigate(`/lecturer/create-session/${cls.id}`)}
                                className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <span className="material-icons-round text-sm">sensors</span> Start Session
                            </button>
                        )}
                        <button
                            onClick={() => navigate(`/lecturer/edit-class/${cls.id}`)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                        >
                            <span className="material-icons-round text-sm">edit</span> Edit
                        </button>
                        <button
                            onClick={() => setIsEnrollModalOpen(true)}
                            className="px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <span className="material-icons-round text-sm">person_add</span> Enroll Students
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {activeSession && (
                        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm flex flex-col items-center text-center animate-fade-in">
                            <h3 className="font-bold text-xl text-emerald-800 mb-2">Active Attendance Session</h3>
                            <p className="text-emerald-600 mb-6 font-medium">Students can now check in using Face ID or this QR Code.</p>
                            
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 mb-6">
                                <QRCodeSVG 
                                    value={JSON.stringify({ sessionId: activeSession.id })}
                                    size={200}
                                    level="H"
                                    includeMargin
                                />
                            </div>

                            <button 
                                onClick={handleCloseSession}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 mb-6"
                            >
                                <span className="material-icons-round">stop_circle</span> Close Session
                            </button>
                            
                            <div className="w-full text-left bg-white rounded-xl border border-emerald-100 overflow-hidden mt-4">
                                <div className="bg-emerald-50 px-4 py-3 flex justify-between items-center border-b border-emerald-100">
                                    <h4 className="font-bold text-emerald-800">Live Check-ins</h4>
                                    <span className="font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-sm">
                                        {liveRecords.length} / {cls.studentIds?.length || 0}
                                    </span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {liveRecords.length === 0 ? (
                                        <div className="text-center p-6 text-emerald-600/70 text-sm">Waiting for students to check in...</div>
                                    ) : (
                                        <ul className="divide-y divide-emerald-50">
                                            {liveRecords.map(record => {
                                                const student = students.find(s => s.id === record.userId);
                                                return (
                                                    <li key={record.id} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs uppercase">
                                                                {student?.name?.charAt(0) || '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-800 text-sm">{student?.name || 'Unknown'}</p>
                                                                <p className="text-xs text-slate-500">{student?.profile?.matricNumber || 'No Matric'}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                                            <span className="material-icons-round text-sm">
                                                                {record.verificationMethod === 'face' ? 'face' : 'qr_code'}
                                                            </span>
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Course Description</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {cls.description || 'No description provided for this class.'}
                        </p>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-xl border border-slate-200 bg-surface-light p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Class Statistics</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Enrolled</p>
                                <p className="text-3xl font-black text-slate-800">{cls.studentIds?.length || 0}</p>
                            </div>
                            <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700">
                                <p className="text-xs mb-1 font-medium uppercase tracking-wide">Status</p>
                                <p className="text-xl font-bold mt-1">Active</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Enroll Students Modal Modal */}
            {isEnrollModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center p-5 border-b border-slate-100">
                            <h3 className="font-bold text-lg text-slate-800">Enroll Students</h3>
                            <button onClick={() => setIsEnrollModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-icons-round">close</span>
                            </button>
                        </div>
                        
                        <div className="p-5 overflow-y-auto flex-1">
                            {isStudentsLoading ? (
                                <div className="text-center py-8 text-slate-500">
                                    <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-primary">progress_activity</span>
                                    <p className="text-sm">Loading available students...</p>
                                </div>
                            ) : students.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl">
                                    <p>No students found in the system.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {students.map((student: any) => {
                                        const isEnrolled = cls.studentIds?.includes(student.uid || student.id);
                                        return (
                                            <div key={student.uid || student.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                                                    <p className="text-xs text-slate-500">{student.email}</p>
                                                </div>
                                                <button
                                                    disabled={isEnrolled || enrollMutation.isPending}
                                                    onClick={() => enrollMutation.mutate(student.uid || student.id)}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                                                        isEnrolled 
                                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                                    }`}
                                                >
                                                    {isEnrolled ? 'Enrolled' : 'Add'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};