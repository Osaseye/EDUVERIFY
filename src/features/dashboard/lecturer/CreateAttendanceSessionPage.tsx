import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

export const CreateAttendanceSessionPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();

    const handleStartSession = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock navigate to the QR page for this class session
        navigate(`/lecturer/qr-generator?classId=${classId}`);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-text-light">Start Attendance Session</h1>
                            <p className="text-text-muted-light text-sm">Configure session details before opening the QR code.</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleStartSession} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Session Date</label>
                            <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)</label>
                            <select className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                                <option value="15">15 Minutes</option>
                                <option value="30">30 Minutes</option>
                                <option value="45">45 Minutes</option>
                                <option value="60">60 Minutes</option>
                                <option value="0">Indefinite (Manual Close)</option>
                            </select>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-blue-700">
                            <span className="material-symbols-outlined mt-0.5">info</span>
                            <p className="text-sm">Starting a session will generate a dynamic QR code for students to scan. Ensure your screen is visible to the class.</p>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-sm flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">qr_code</span>
                                Generate QR Code
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};
