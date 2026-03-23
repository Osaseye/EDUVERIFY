import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Html5Qrcode } from 'html5-qrcode';
import { attendanceService } from '../../../../services/attendanceService';
import { userService } from '../../../../services/userService';
import { useAuthStore } from '../../../../store/useAuthStore';
import { toast } from 'sonner';

interface StudentActiveSessionScannerProps {
    sessionId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

// Distance calculation using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
};

export const StudentActiveSessionScanner: React.FC<StudentActiveSessionScannerProps> = ({ sessionId, onSuccess, onCancel }) => {

    const [mode, setMode] = useState<'options' | 'face' | 'qr'>('options');
    const [status, setStatus] = useState<'scanning' | 'success' | 'failed'>('scanning');
    const [modelsLoaded, setModelsLoaded] = useState(false);
    
    const webcamRef = useRef<Webcam>(null);
    const { user } = useAuthStore();

    // Load face-api models
    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
                ]);
                setModelsLoaded(true);
            } catch (err) {
                console.error('Error loading face-api models', err);
            }
        };
        loadModels();
    }, []);

    // Remove the continuous face check logic entirely from useEffect,
    // we'll replace this with a manual click handler
    // Helper function to handle the geofenced attendance marking
    const processAttendance = async (method: 'face' | 'qr', loadingToastId?: string | number) => {
        try {
            const session = await attendanceService.getSessionById(sessionId);
            if (!session) throw new Error("Session not found.");

            // Get user's location
            const userLocation: { latitude: number, longitude: number } = await new Promise((resolve, _reject) => {
                if (!navigator.geolocation) {
                    resolve({ latitude: 0, longitude: 0 }); // Fallback if not supported
                } else {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                        (err) => {
                            console.warn("Geolocation error:", err);
                            resolve({ latitude: 0, longitude: 0 });
                        },
                        { enableHighAccuracy: true, timeout: 5000 }
                    );
                }
            });

            // If session has location and geofence enabled (radius > 0)
            if (session.location && session.location.latitude !== 0 && session.location.longitude !== 0 && session.geofenceRadius > 0) {
                if (userLocation.latitude === 0 && userLocation.longitude === 0) {
                    throw new Error("Unable to retrieve your location for geofencia. Please enable location services.");
                }

                const distance = calculateDistance(
                    session.location.latitude,
                    session.location.longitude,
                    userLocation.latitude,
                    userLocation.longitude
                );

                if (distance > session.geofenceRadius) {
                    throw new Error(`You are too far from the classroom (${Math.round(distance)}m). You must be within ${session.geofenceRadius}m to check in.`);
                }
            }

            await attendanceService.markAttendance({
                sessionId: sessionId,
                userId: user!.uid,
                status: 'present',
                verificationMethod: method,
                location: userLocation
            });
            
            setStatus('success');
            if (loadingToastId) {
                toast.success('Identity verified! Attendance marked.', { id: loadingToastId });
            } else {
                toast.success('Attendance marked successfully.');
            }
            onSuccess();
        } catch (error: any) {
            console.error('Attendance mark error:', error);
            if (loadingToastId) {
                toast.error(error.message || 'Failed to mark attendance.', { id: loadingToastId });
            } else {
                toast.error(error.message || 'Failed to mark attendance.');
            }
            setStatus('failed');
        }
    };

    const verifyFace = async () => {
        if (!webcamRef.current?.video || !modelsLoaded || !user) {
            toast.error("Camera or models not loaded yet.");
            return;
        }
        const video = webcamRef.current.video;
        
        // Explicitly ensure the video is fully ready before running detection
        if (video.readyState !== 4 || video.videoWidth === 0) {
            toast.error("Camera is not ready yet. Please wait a moment.");
            return;
        }

        const loadingToast = toast.loading('Detecting face...');

        try {
            const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                toast.dismiss(loadingToast);
                toast.error('No face detected. Please ensure you are clearly visible.');
                return;
            }

            toast.loading('Verifying identity...', { id: loadingToast });
            
            // fetch student's stored face descriptor
            const storedDescriptorData = await userService.getFaceDescriptor(user.uid);
            if (!storedDescriptorData || storedDescriptorData.length === 0) {
                toast.dismiss(loadingToast);
                toast.error('No face registered. Please contact admin.');
                setStatus('failed');
                return;
            }

            const storedDescriptor = new Float32Array(storedDescriptorData);
            const distance = faceapi.euclideanDistance(detection.descriptor, storedDescriptor);

            // Threshold is usually 0.6 for face-api
            if (distance < 0.6) {
                // Match successful
                await processAttendance('face', loadingToast);
            } else {
                // Face doesn't match
                toast.dismiss(loadingToast);
                toast.error('Face verification failed. Please try again.');
                setStatus('failed');
            }
        } catch (err) {
            console.error('Face scan error', err);
            toast.dismiss(loadingToast);
            toast.error('Error scanning face.');
        }
    };

    // Setup QR Scanner
    useEffect(() => {
        let html5QrCode: Html5Qrcode | null = null;
        let isScanning = true;

        if (mode === 'qr' && status === 'scanning') {
            html5QrCode = new Html5Qrcode('reader');
            
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            };

            const onScanSuccess = async (decodedText: string, _decodedResult: any) => {
                if (!isScanning) return;
                try {
                    const payload = JSON.parse(decodedText);
                    // Prevent marking for different session
                    if (!payload.sessionId || payload.sessionId !== sessionId) {
                        throw new Error('Invalid QR code for this session.');
                    }
                    
                    isScanning = false;
                    
                    // Stop scanner as soon as a code is scanned to avoid double scanning
                    if (html5QrCode && html5QrCode.isScanning) {
                        await html5QrCode.stop().catch(console.error);
                    }

                    await processAttendance('qr');

                } catch (error: any) {
                    console.error('Failed to parse or mark attendance:', error);
                    toast.error(error.message || 'Failed to mark attendance. Invalid QR code or session.');
                    setStatus('failed');
                }
            };

            const onScanFailure = (_errorMessage: any) => {
                // Ignore scan errors as they happen constantly until a valid code is found
            };

            const startCamera = async () => {
                try {
                    // Try environment/rear camera first
                    await new Promise(resolve => setTimeout(resolve, 200)); // Ensure DOM is painted
                    if (!isScanning) return;
                    await html5QrCode!.start({ facingMode: 'environment' }, config, onScanSuccess, onScanFailure);
                } catch (err) {
                    console.log("Environment camera failed, falling back to user camera:", err);
                    if (!isScanning) return;
                    try {
                        // Fallback to user/front camera (mostly for desktops/laptops)
                        await html5QrCode!.start({ facingMode: 'user' }, config, onScanSuccess, onScanFailure);
                    } catch (fallbackErr) {
                        console.error("Camera startup failed:", fallbackErr);
                        toast.error('Failed to start camera. Please check permissions or hardware.');
                        setStatus('failed');
                    }
                }
            };

            startCamera();
        }

        return () => {
            isScanning = false;
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().then(() => html5QrCode?.clear()).catch(console.error);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, status]);

    const resetScan = () => {
        setMode('options');
        setStatus('scanning');
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center p-6 sm:p-10 mb-6 w-full">
            <div className="flex justify-between w-full items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                    Verify Identity
                </h3>
                <button onClick={onCancel} className="text-slate-500 hover:bg-slate-100 p-2 rounded-full transition-colors">
                    <span className="material-icons-round">close</span>
                </button>
            </div>

            {mode === 'options' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    <button 
                        onClick={() => {
                            if (!modelsLoaded) toast.loading('Loading face models...');
                            setMode('face');
                        }}
                        className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                        <span className="material-icons-round text-5xl text-slate-400 group-hover:text-primary mb-3 transition-colors">face_retouching_natural</span>
                        <h4 className="text-lg font-bold text-slate-800">Face ID Scan</h4>
                        <p className="text-xs text-slate-500 text-center mt-1">Recommended. Verify identity securely using camera.</p>
                    </button>
                    
                    <button 
                        onClick={() => setMode('qr')}
                        className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                        <span className="material-icons-round text-5xl text-slate-400 group-hover:text-primary mb-3 transition-colors">qr_code_scanner</span>
                        <h4 className="text-lg font-bold text-slate-800">QR Code</h4>
                        <p className="text-xs text-slate-500 text-center mt-1">Scan the QR code displayed on the lecturer's screen.</p>
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-slate-500 text-center mb-6">
                        {status === 'scanning' 
                            ? (mode === 'face' ? 'Please position your face clearly and click Verify.' : 'Please position the QR code in front of the camera.')
                            : status === 'success' ? 'Processing complete.' : 'Verification failed, please try again.'}
                    </p>

                    <div className="relative w-full max-w-sm aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden shadow-inner border-4 border-slate-100 flex items-center justify-center">
                        {status === 'scanning' && (
                            <>
                                {mode === 'face' ? (
                                    <>
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            videoConstraints={{ facingMode: 'user' }}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
                                            <button 
                                                onClick={verifyFace}
                                                className="bg-primary text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-primary-hover active:scale-95 transition-all flex items-center gap-2 border-2 border-white"
                                            >
                                                <span className="material-icons-round">photo_camera</span>
                                                Verify Face
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div id="reader" className="w-full h-full bg-black flex items-center justify-center [&>video]:w-full [&>video]:h-full [&>video]:object-cover" />
                                )}
                                
                                {/* Scanning Overlay Effect */}
                                <div className="absolute inset-0 pointer-events-none z-10 box-border">
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_2px_#046c4e] animate-[scan_2s_ease-in-out_infinite]"></div>
                                    {mode === 'face' ? (
                                        <div className="absolute inset-0 border-4 border-white/30 rounded-[50%] m-8 opacity-50 mix-blend-overlay"></div>
                                    ) : (
                                        <div className="absolute inset-16 border-2 border-dashed border-white/70 bg-white/10 mix-blend-overlay rounded-lg"></div>
                                    )}
                                </div>
                            </>
                        )}
                        
                        {status === 'success' && (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-600 p-6 text-center">
                                <span className="material-icons-round text-6xl mb-3">check_circle</span>
                                <h4 className="font-bold text-xl mb-1">Attendance Verified!</h4>
                                <p className="text-sm font-medium">You have been marked present.</p>
                            </div>
                        )}

                        {status === 'failed' && (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600 p-6 text-center">
                                <span className="material-icons-round text-6xl mb-3">error</span>
                                <h4 className="font-bold text-xl mb-1">Verification Failed</h4>
                                <button 
                                    onClick={() => setStatus('scanning')} 
                                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                    {status === 'scanning' && (
                        <button onClick={resetScan} className="mt-6 px-6 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                            Change Method
                        </button>
                    )}
                </>
            )}
            
            <style>{`
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};