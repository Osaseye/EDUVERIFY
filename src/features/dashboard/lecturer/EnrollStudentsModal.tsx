import React, { useState, useEffect } from 'react';
import { classService } from '../../../services/classService';
import { userService } from '../../../services/userService';
import { toast } from 'sonner';
import type { ClassGroup } from '../../../types';

interface EnrollStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    classData: ClassGroup;
    onEnrolled: () => void;
}

export const EnrollStudentsModal: React.FC<EnrollStudentsModalProps> = ({ isOpen, onClose, classData, onEnrolled }) => {
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchStudents();
            setSelectedStudents(classData.studentIds || []);
        }
    }, [isOpen, classData]);

    const fetchStudents = async () => {
        setIsFetching(true);
        try {
            const allUsers = await userService.getAllUsers();
            const allStudents = allUsers.filter(u => u.role === 'student');
            setStudents(allStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to load students');
        } finally {
            setIsFetching(false);
        }
    };

    const handleToggleStudent = (studentId: string) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleEnroll = async () => {
        setIsLoading(true);
        try {
            await classService.updateClass(classData.id, { studentIds: selectedStudents });
            toast.success('Students enrolled successfully!');
            onEnrolled();
            onClose();
        } catch (error: any) {
            console.error('Error enrolling students:', error);
            toast.error(error.message || 'Failed to enroll students');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredStudents = students.filter(s => 
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.matricNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Enroll Students</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage students for {classData.name} ({classData.code})</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input 
                            type="text" 
                            placeholder="Search by name or matric number..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    {isFetching ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500">Loading students...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">person_off</span>
                            <p>No students found.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredStudents.map(student => (
                                <div 
                                    key={student.uid}
                                    onClick={() => handleToggleStudent(student.uid)}
                                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedStudents.includes(student.uid) ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                            {(student.name || '?')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{student.name}</p>
                                            <p className="text-sm text-gray-500">{student.matricNumber || student.email || 'No Matric No.'}</p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${selectedStudents.includes(student.uid) ? 'bg-primary text-white' : 'border-2 border-gray-300'}`}>
                                        {selectedStudents.includes(student.uid) && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                    <div className="text-sm font-medium text-gray-600">
                        Selected: <span className="text-primary font-bold">{selectedStudents.length}</span> / {students.length}
                    </div>
                    <div className="flex gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleEnroll}
                            disabled={isLoading}
                            className={`px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:bg-primary-hover transition-all flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Saving...' : 'Save Enrollment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};