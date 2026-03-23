import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Html5Qrcode } from 'html5-qrcode';
import { attendanceService } from '../../../services/attendanceService';
import { useAuthStore } from '../../../store/useAuthStore';
import { toast } from 'sonner';

export const ScannerPage = () => {
    const [mode, setMode] = useState<'options' | 'face' | 'qr'>('options');
    const [status, setStatus] = useState<'scanning' | 'success' | 'failed'>('scanning');
    const webcamRef = useRef<Webcam>(null);
    const { user } = useAuthStore();

    // Simulate scanning process for face
    useEffect(() => {
        let timer: number;
        if (mode === 'face' && status === 'scanning') {
            timer = window.setTimeout(() => {
                setStatus('success');
            }, 3000); // simulate a 3-second scan
        }
        return () => window.clearTimeout(timer);
    }, [mode, status]);

    // Setup QR Scanner
    useEffect(() => {
        let html5QrCode: Html5Qrcode | null = null;

        if (mode === 'qr' && status === 'scanning') {
            html5QrCode = new Html5Qrcode('reader');
            html5QrCode.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                async (decodedText: string, _decodedResult: any) => {
                    try {
                        const payload = JSON.parse(decodedText);
                        if (!payload.sessionId) {
                            throw new Error('Invalid QR code');
                        }

                        const session = await attendanceService.getSessionById(payload.sessionId);
                        if (!session) {
                            throw new Error('Session not found');
                        }

                        // If qrCodeToken is enforced in the payload, validate it here
                        if (session.qrCodeToken && payload.token && session.qrCodeToken !== payload.token) {
                            throw new Error('Invalid or expired QR code');
                        }
                        
                        await attendanceService.markAttendance({
                            sessionId: payload.sessionId,
                            userId: user!.uid,
                            status: 'present',
                            
                            verificationMethod: 'qr',
                            location: { latitude: 0, longitude: 0 }
                        });
                        
                        setStatus('success');
                        html5QrCode?.stop().catch(console.error);
                        toast.success('Attendance marked successfully');
                    } catch (error) {
                        console.error('Failed to parse or mark attendance:', error);
                        toast.error('Failed to mark attendance. Invalid QR code or session.');
                    }
                },
                undefined
            ).catch((err) => {
                console.error("Error starting scanner", err);
                toast.error('Failed to start camera. Please check permissions.');
            });
        }

        return () => {
            if (html5QrCode?.isScanning) {
                html5QrCode.stop().catch(console.error);
            }
        };
    }, [mode, status, user]);

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
                                    {mode === 'face' ? (
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            videoConstraints={{ facingMode: 'user' }}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div id="reader" className="w-full h-full" />
                                    )}
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
