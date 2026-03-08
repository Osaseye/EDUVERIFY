import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

export const AdminSettingsPage = () => {
    const [strictFaceAuth, setStrictFaceAuth] = useState(true);
    const [geofencing, setGeofencing] = useState(true);

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">System Settings</h1>
                    <p className="text-gray-500 text-sm">Configure global application parameters and security thresholds.</p>
                </div>

                <div className="max-w-3xl space-y-6">
                    {/* Security Settings */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 text-gray-900">
                            <span className="material-symbols-outlined">security</span>
                            <h2 className="text-lg font-bold">Security & Authentication</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-800">Strict Face Authentication</h3>
                                    <p className="text-sm text-gray-500 max-w-sm mt-1">Require 95%+ confidence score on model checks for successful marking.</p>
                                </div>
                                <button 
                                    onClick={() => setStrictFaceAuth(!strictFaceAuth)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${strictFaceAuth ? 'bg-gray-900' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${strictFaceAuth ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            
                            <hr className="border-gray-100" />
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-800">Geofence Enforcements</h3>
                                    <p className="text-sm text-gray-500 max-w-sm mt-1">Enforce location checks during attendance scanning.</p>
                                </div>
                                <button 
                                    onClick={() => setGeofencing(!geofencing)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${geofencing ? 'bg-gray-900' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${geofencing ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                        <div className="flex items-center gap-2 mb-4 text-red-600">
                            <span className="material-symbols-outlined">warning</span>
                            <h2 className="text-lg font-bold">Danger Zone</h2>
                        </div>
                        <p className="text-sm text-red-600/80 mb-4 max-w-lg">
                            These actions form irreversible changes to the database structure. Backup data before executing.
                        </p>
                        <button className="px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm text-sm">
                            Wipe Global Attendance Records
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};