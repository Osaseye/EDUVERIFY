import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../store/useAuthStore';
import { classService } from '../../../services/classService';
import { toast } from 'sonner';

export const EditClassPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { classId } = useParams();
    
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState({
        code: '',
        title: '',
        department: '',
        level: '',
        location: '',
        description: '',
        scheduleDays: [] as string[],
        scheduleTime: ''
    });

    useEffect(() => {
        const fetchClass = async () => {
            if (!classId) return;
            try {
                const data = await classService.getClassById(classId);
                if (data) {
                    setFormData({
                        code: data.code || '',
                        title: data.name || '',
                        department: data.department || '',
                        level: data.level || '',
                        location: data.location || '',
                        description: data.description || '',
                        scheduleDays: data.scheduleDays || [],
                        scheduleTime: data.scheduleTime || ''
                    });
                }
            } catch (error) {
                toast.error('Failed to load class details');
            } finally {
                setInitialLoading(false);
            }
        };
        fetchClass();
    }, [classId]);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleDayToggle = (day: string) => {
        setFormData(prev => ({
            ...prev,
            scheduleDays: prev.scheduleDays.includes(day) 
                ? prev.scheduleDays.filter(d => d !== day)
                : [...prev.scheduleDays, day]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user || !classId) return;
        if (!formData.code || !formData.title || !formData.department || !formData.level || formData.scheduleDays.length === 0 || !formData.scheduleTime || !formData.location) {
            toast.error('Please fill in all required fields.');
            return;
        }

        setIsLoading(true);
        try {
            await classService.updateClass(classId, {
                code: formData.code,
                name: formData.title,
                department: formData.department,
                level: formData.level,
                location: formData.location,
                description: formData.description,
                scheduleDays: formData.scheduleDays,
                scheduleTime: formData.scheduleTime,
            });
            toast.success('Class updated successfully!');
            navigate('/lecturer/dashboard');
        } catch (error: any) {
            console.error('Error updating class:', error);
            toast.error(error.message || 'Failed to update class');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold text-text-light mb-2">Edit Class</h1>
                    <p className="text-text-muted-light mb-6">Update existing course details.</p>

                    {initialLoading ? (
                        <div className="py-12 text-center text-gray-500">
                            <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-primary">progress_activity</span>
                            <p>Loading details...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Code <span className="text-red-500">*</span></label>
                                    <input required type="text" placeholder="e.g. CSC 301" 
                                           value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})}
                                           className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all uppercase" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title <span className="text-red-500">*</span></label>
                                    <input required type="text" placeholder="e.g. Operating Systems" 
                                           value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                           className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
                                    <select required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
                                        <option value="" disabled>Select Department</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Software Engineering">Software Engineering</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Cybersecurity">Cybersecurity</option>
                                        <option value="Business Administration">Business Administration</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Level <span className="text-red-500">*</span></label>
                                    <select required value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
                                        <option value="" disabled>Select Level</option>
                                        <option value="100 Level">100 Level</option>
                                        <option value="200 Level">200 Level</option>
                                        <option value="300 Level">300 Level</option>
                                        <option value="400 Level">400 Level</option>
                                        <option value="500 Level">500 Level</option>
                                        <option value="Postgraduate">Postgraduate</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Days <span className="text-red-500">*</span></label>
                                <div className="flex flex-wrap gap-2">
                                    {daysOfWeek.map(day => (
                                        <button 
                                            key={day} type="button"
                                            onClick={() => handleDayToggle(day)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                formData.scheduleDays.includes(day)
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time <span className="text-red-500">*</span></label>
                                    <input required type="time" 
                                           value={formData.scheduleTime} onChange={e => setFormData({...formData, scheduleTime: e.target.value})}
                                           className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                                    <input required type="text" placeholder="e.g. Hall A, Science Block" 
                                           value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                                           className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea placeholder="Brief description of the course..." rows={3} 
                                          value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none transition-all"></textarea>
                            </div>

                            <div className="pt-4">
                                <button disabled={isLoading} type="submit" className={`px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-md flex items-center justify-center min-w-[200px] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                    {isLoading ? <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> : 'Update Class'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

