import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useAuthStore } from '../../../store/useAuthStore';
import { userService } from '../../../services/userService';
import { toast } from 'sonner';

type OnboardingStep = 'personal' | 'academic' | 'face';

export const StudentOnboarding = () => {
    const { user, setUser } = useAuthStore();
    const navigate = useNavigate();
    const [step, setStep] = useState<OnboardingStep>('personal');

    // Form state
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');

    // Academic details
    const [matricNumber, setMatricNumber] = useState('');
    const [department, setDepartment] = useState('');
    const [level, setLevel] = useState('');
    const [group, setGroup] = useState('');

    const [faceCaptured, setFaceCaptured] = useState(false);
    const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    const webcamRef = React.useRef<Webcam>(null);

    useEffect(() => {
        if (step !== 'face') return;
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
        if (!modelsLoaded) {
            loadModels();
        }
    }, [step, modelsLoaded]);

    const handleNext = () => {
        if (step === 'personal') {
            if (!phone || !dob || !gender || !address) {
                toast.error('Please fill in all personal details.');
                return;
            }
            setStep('academic');
        } else if (step === 'academic') {
            if (!matricNumber || !department || !level || !group) {
                toast.error('Please fill in all academic details.');
                return;
            }
            setStep('face');
        }
    };

    const handleBack = () => {
        if (step === 'face') setStep('academic');
        else if (step === 'academic') setStep('personal');
    };

    const captureFace = async () => {
        if (!webcamRef.current?.video || !modelsLoaded) {
            if (!modelsLoaded) toast.error('Models are still loading, please wait...');
            return;
        }

        setIsCapturing(true);
        const toastId = toast.loading('Analyzing face...');
        
        try {
            const video = webcamRef.current.video;
            const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                .withFaceLandmarks()
                .withFaceDescriptor();
                
            if (detection) {
                setFaceDescriptor(Array.from(detection.descriptor));
                setFaceCaptured(true);
                toast.success('Face registered successfully!', { id: toastId });
            } else {
                toast.error('No face detected. Please ensure your face is clearly visible and well-lit.', { id: toastId });
            }
        } catch (error) {
            console.error('Face capture error:', error);
            toast.error('Error capturing face. Please try again.', { id: toastId });
        } finally {
            setIsCapturing(false);
        }
    };

    const handleFinish = async () => {
        if (!user) return;
        
        if (!faceDescriptor || !faceCaptured) {
            toast.error('Please capture your face before finishing.');
            return;
        }

        try {
            const updateData = {
                profile: {
                    phone,
                    dob,
                    gender,
                    address,
                    matricNumber,
                    department,
                    level,
                    group,
                },
                enrolledFaceId: 'true', // We also save the actual descriptor via saveFaceDescriptor
            };

            // Save actual face descriptor to user document
            await userService.saveFaceDescriptor(user.uid, faceDescriptor);
            // Update the rest of the profile
            await userService.updateUser(user.uid, updateData);
            
            setUser({ ...user, ...updateData });
            toast.success('Onboarding completed successfully!');
            navigate('/student/dashboard');
        } catch (error: any) {
            console.error('Error saving profile:', error);
            toast.error(error.message || 'Failed to save profile. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-white text-text-light flex flex-col">
            {/* Header */}
            <div className="bg-primary px-4 sm:px-8 py-8 sm:py-10 text-white shadow-md">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <img src="/icon.png" alt="EduVerify Icon" className="w-10 h-10 object-contain" />
                        <h2 className="text-3xl font-display font-bold">Welcome to EduVerify</h2>
                    </div>
                    <p className="text-white/80 mt-2 text-lg">Let's get your profile set up to verify your attendance.</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${step === 'personal' || step === 'academic' || step === 'face' ? 'bg-primary text-white shadow-soft' : 'bg-gray-200 text-gray-500'}`}>1</div>
                        <span className={`text-sm sm:text-base font-medium ${step === 'personal' ? 'text-primary' : 'text-gray-500'}`}>Personal</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-300 mx-4 sm:mx-8"></div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${step === 'academic' || step === 'face'? 'bg-primary text-white shadow-soft' : 'bg-gray-200 text-gray-500'}`}>2</div>
                        <span className={`text-sm sm:text-base font-medium ${step === 'academic' ? 'text-primary' : 'text-gray-500'}`}>Academic</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-300 mx-4 sm:mx-8"></div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${step === 'face' ? 'bg-primary text-white shadow-soft' : 'bg-gray-200 text-gray-500'}`}>3</div>
                        <span className={`text-sm sm:text-base font-medium ${step === 'face' ? 'text-primary' : 'text-gray-500'}`}>Face Setup</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-10">
                {step === 'personal' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">Full Name</label>
                                <input type="text" readOnly value={user?.name || ''} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-500" />
                                <p className="text-xs text-gray-400 mt-1">Name is synced from your registration.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">Email Address</label>
                                <input type="email" readOnly value={user?.email || ''} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">Phone Number</label>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">Date of Birth</label>
                                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">Gender</label>
                                <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="e.g. Male, Female, Other" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light mb-1">Home Address</label>
                            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your full residential address" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"></textarea>
                        </div>
                    </div>
                )}

                {step === 'academic' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">Matric Number</label>
                                <input type="text" value={matricNumber} onChange={(e) => setMatricNumber(e.target.value)} placeholder="e.g. 22/0206" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">Department</label>
                                <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
                                    <option value="" disabled>Select Department</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Software Engineering">Software Engineering</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Electrical Engineering">Electrical Engineering</option>
                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                    <option value="Civil Engineering">Civil Engineering</option>
                                    <option value="Chemical Engineering">Chemical Engineering</option>
                                    <option value="Business Administration">Business Administration</option>
                                    <option value="Accounting">Accounting</option>
                                    <option value="Economics">Economics</option>
                                    <option value="Mass Communication">Mass Communication</option>
                                    <option value="Law">Law</option>
                                    <option value="Medicine">Medicine</option>
                                    <option value="Nursing">Nursing</option>
                                    <option value="Pharmacy">Pharmacy</option>
                                    <option value="Arts">Arts</option>
                                    <option value="Education">Education</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">Level / Year</label>
                                <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
                                    <option value="" disabled>Select Level</option>
                                    <option value="100">100 Level</option>
                                    <option value="200">200 Level</option>
                                    <option value="300">300 Level</option>
                                    <option value="400">400 Level</option>
                                    <option value="500">500 Level</option>
                                    <option value="600">600 Level</option>
                                    <option value="700">700 Level</option>
                                    <option value="Postgraduate">Postgraduate</option>
                                    <option value="Masters">Masters</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">Group</label>
                                <select value={group} onChange={(e) => setGroup(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
                                    <option value="" disabled>Select Group</option>
                                    <option value="Group A">Group A</option>
                                    <option value="Group B">Group B</option>
                                    <option value="Group C">Group C</option>
                                    <option value="Group D">Group D</option>
                                    <option value="Group E">Group E</option>
                                    <option value="Group F">Group F</option>
                                    <option value="None">None</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                    {step === 'face' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-bold text-text-light">Register Your Face</h3>
                                <p className="text-sm text-text-muted-light mt-1">
                                    This biometric data will be used securely to mark your attendance in classes. Ensure your face is clearly visible and well-lit.
                                </p>
                            </div>

                            <div className="relative w-full max-w-sm mx-auto aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden shadow-inner border-4 border-gray-200">
                                {!faceCaptured ? (
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{ facingMode: "user" }}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-green-50 text-green-600">
                                        <span className="material-symbols-outlined text-6xl mb-2">face_retouching_natural</span>
                                        <p className="font-bold text-lg">Face registered successfully!</p>
                                    </div>
                                )}
                                
                                {!faceCaptured && (
                                    <div className="absolute inset-0 pointer-events-none border-[3px] border-dashed border-white/50 m-8 rounded-full opacity-50 z-10 before:content-[''] before:absolute before:-inset-8 before:bg-black/40 before:-z-10 mix-blend-overlay"></div>
                                )}
                            </div>

                            {!faceCaptured ? (
                                <div className="flex justify-center">
                                    <button 
                                        onClick={captureFace} 
                                        disabled={isCapturing || !modelsLoaded}
                                        className={`bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-all ${isCapturing || !modelsLoaded ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
                                    >
                                        {isCapturing ? (
                                            <span className="material-symbols-outlined animate-spin">sync</span>
                                        ) : (
                                            <span className="material-symbols-outlined">photo_camera</span>
                                        )}
                                        {isCapturing ? 'Analyzing Face...' : (!modelsLoaded ? 'Loading Models...' : 'Capture Face Data')}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <button onClick={() => setFaceCaptured(false)} className="text-primary hover:underline text-sm font-medium">
                                        Retake Photo
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            {/* Footer / Buttons */}
            <div className="bg-gray-50 border-t border-gray-100 mt-auto">
                <div className="max-w-4xl mx-auto px-4 sm:px-8 py-5 flex justify-between">
                    {step !== 'personal' ? (
                        <button onClick={handleBack} className="px-6 py-2.5 rounded-xl border border-gray-300 text-text-light font-medium hover:bg-gray-200 transition-colors">
                            Back
                        </button>
                    ) : (
                        <div></div> // Empty div for flex spacing
                    )}

                    {step === 'face' ? (
                        <button 
                            onClick={handleFinish} 
                            disabled={!faceCaptured}
                            className={`px-8 py-2.5 rounded-xl font-bold transition-all shadow-md ${faceCaptured ? 'bg-primary text-white hover:bg-opacity-90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            Complete Setup
                        </button>
                    ) : (
                        <button onClick={handleNext} className="px-8 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md">
                            Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


