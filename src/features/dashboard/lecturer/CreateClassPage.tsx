import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

export const CreateClassPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold text-text-light mb-2">Create New Class</h1>
                    <p className="text-text-muted-light mb-6">Set up a new course to start tracking attendance.</p>
                    
                    <form className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                <input type="text" placeholder="e.g. CSC 301" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                <input type="text" placeholder="e.g. Operating Systems" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                            <textarea placeholder="Brief description of the course..." rows={3} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"></textarea>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-sm">
                                Create Class
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};
