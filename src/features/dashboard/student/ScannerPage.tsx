import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

export const ScannerPage = () => {
    const [mode, setMode] = useState<'options' | 'face' | 'qr'>('options');
    const [status, setStatus] = useState<'scanning' | 'success' | 'failed'>('scanning');
    const webcamRef = useRef<Webcam>(null);

    // Simulate scanning process
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (mode !== 'options' && status === 'scanning') {
            timer = setTimeout(() => {
                setStatus('success');
            }, 3000); // simulate a 3-second scan
        }
        return () => clearTimeout(timer);
    }, [mode, status]);

    const resetScan = () => {
        setMode('options');
        setStatus('scanning');
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Scan Attendance</h2>
                <p className="text-slate-600">Join an active lecture session by verifying your presence.</p>
            </div>

            <div className="max-w-2xl mx-auto">
                {mode === 'options' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button 
                            onClick={() => setMode('face')}
                            className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <span className="material-icons-round text-6xl text-slate-400 group-hover:text-primary mb-4 transition-colors">face_retouching_natural</span>
                            <h3 className="text-xl font-bold text-slate-800">Face ID Scan</h3>
                            <p className="text-sm text-slate-500 text-center mt-2">Recommended. Verify identity securely using your camera.</p>
                        </button>
                        
                        <button 
                            onClick={() => setMode('qr')}
                            className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <span className="material-icons-round text-6xl text-slate-400 group-hover:text-primary mb-4 transition-colors">qr_code_scanner</span>
                            <h3 className="text-xl font-bold text-slate-800">QR Code</h3>
                            <p className="text-sm text-slate-500 text-center mt-2">Scan the QR code displayed on the lecturer's screen.</p>
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center p-6 sm:p-10">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-900">
                                {mode === 'face' ? 'Face Verification' : 'QR Scanner'}
                            </h3>
                            <p className="text-slate-500 mt-1">
                                {status === 'scanning' ? 'Please position yourself in front of the camera.' : 'Processing complete.'}
                            </p>
                        </div>

                        <div className="relative w-full max-w-sm aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden shadow-inner border-4 border-slate-100 flex items-center justify-center">
                            {status === 'scanning' ? (
                                <>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{ facingMode: mode === 'qr' ? 'environment' : 'user' }}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Scanning Overlay Effect */}
                                    <div className="absolute inset-0 pointer-events-none z-10 box-border">
                                        <div className={`absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_2px_#046c4e] animate-[scan_2s_ease-in-out_infinite]`}></div>
                                        {mode === 'face' && (
                                            <div className="absolute inset-0 border-4 border-white/30 rounded-[50%] m-8 opacity-50 mix-blend-overlay"></div>
                                        )}
                                        {mode === 'qr' && (
                                            <div className="absolute inset-16 border-2 border-dashed border-white/70 bg-white/10 mix-blend-overlay rounded-lg"></div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-600 p-6 text-center">
                                    <span className="material-icons-round text-6xl mb-3">check_circle</span>
                                    <h4 className="font-bold text-xl mb-1">Attendance Verified</h4>
                                    <p className="text-sm font-medium">CS305: Database Systems</p>
                                    <p className="text-xs text-emerald-700/80 mt-1">October 26, 2023 - 11:25 AM</p>
                                </div>
                            )}
                        </div>

                        {status === 'scanning' ? (
                            <button onClick={resetScan} className="mt-8 px-6 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                                Cancel Scan
                            </button>
                        ) : (
                            <button onClick={resetScan} className="mt-8 px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-hover transition-colors">
                                Return to Dashboard
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </DashboardLayout>
    );
};
