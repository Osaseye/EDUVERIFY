import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

export const LecturerQRGeneratorPage = () => {
    const [searchParams] = useSearchParams();
    const classId = searchParams.get('classId');

    return (
        <DashboardLayout>
            <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 max-w-lg w-full text-center">
                    <h1 className="text-3xl font-bold text-text-light mb-2">Scan to Attend</h1>
                    <p className="text-text-muted-light mb-8">
                        {classId ? `Class ID: ${classId}` : 'Select a class to generate a valid QR code'}
                    </p>
                    
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 mb-8 aspect-square flex items-center justify-center relative group">
                         {/* Placeholder for actual QR code rendering library like qrcode.react */}
                        <div className="flex flex-col items-center justify-center opacity-40">
                             <span className="material-symbols-outlined text-9xl">qr_code_2</span>
                             <p className="mt-4 font-medium">QR Code Renders Here</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all font-medium flex items-center justify-center gap-2">
                             <span className="material-symbols-outlined">stop_circle</span>
                             End Session
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
