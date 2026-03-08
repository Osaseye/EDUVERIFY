import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../store/useAuthStore';

export const SettingsPage = () => {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Settings</h2>
                <p className="text-slate-600">Manage your account preferences and biometric data.</p>
            </div>

            <div className="max-w-3xl space-y-6">
                {/* Profile Section */}
                <section className="rounded-xl border border-slate-200 bg-surface-light shadow-sm overflow-hidden">
                    <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
                        <h3 className="font-bold text-lg text-slate-800">Profile Information</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <button className="text-sm font-medium text-primary hover:underline">Change Avatar</button>
                                <p className="text-xs text-slate-500 mt-1">JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input type="text" readOnly value={user?.name || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input type="email" readOnly value={user?.email || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Biometric Section */}
                <section className="rounded-xl border border-slate-200 bg-surface-light shadow-sm overflow-hidden">
                    <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
                        <h3 className="font-bold text-lg text-slate-800">Biometric Data</h3>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-slate-900">Face Data Enrollment</h4>
                                <p className="text-sm text-slate-500 mt-1">Your face data is currently enrolled and active for class verification.</p>
                            </div>
                            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700">
                                Retake Face Scan
                            </button>
                        </div>
                        <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-3">
                            <span className="material-icons-round text-emerald-600">verified_user</span>
                            <div>
                                <p className="text-sm font-medium text-emerald-800">Privacy Secured</p>
                                <p className="text-xs text-emerald-600 mt-1">Your biometric data is encrypted and securely stored. It is only used for attendance verification.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Preferences Section */}
                <section className="rounded-xl border border-slate-200 bg-surface-light shadow-sm overflow-hidden">
                    <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
                        <h3 className="font-bold text-lg text-slate-800">Notifications</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-slate-900">Push Notifications</h4>
                                <p className="text-sm text-slate-500">Receive alerts when attendance sessions open.</p>
                            </div>
                            <button 
                                onClick={() => setNotifications(!notifications)}
                                className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${notifications ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <span className={`w-4 h-4 bg-white rounded-full absolute transition-all ${notifications ? 'right-1' : 'left-1'}`}></span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-slate-900">Email Alerts</h4>
                                <p className="text-sm text-slate-500">Receive weekly attendance summaries.</p>
                            </div>
                            <button 
                                onClick={() => setEmailAlerts(!emailAlerts)}
                                className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${emailAlerts ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <span className={`w-4 h-4 bg-white rounded-full absolute transition-all ${emailAlerts ? 'right-1' : 'left-1'}`}></span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};
