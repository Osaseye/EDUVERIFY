
export const WorkflowSection = () => {
    return (
        <section className="py-24 bg-background-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-secondary font-semibold uppercase tracking-wider text-sm">Workflow</span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-text-light mt-2">Seamless Integration</h2>
                    <p className="mt-4 text-text-muted-light max-w-2xl mx-auto">Deploy EduVerify across your campus in three simple steps.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 -z-10"></div>
                    <div className="relative group">
                        <div className="w-20 h-20 mx-auto bg-surface-light rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
                        </div>
                        <div className="absolute top-0 right-0 left-0 flex justify-center -mt-3">
                            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">01</span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-text-light mb-3">Enroll Students</h3>
                            <p className="text-text-muted-light">Upload student photos securely to the database. Supports bulk import from existing SIS.</p>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="w-20 h-20 mx-auto bg-surface-light rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined text-4xl text-primary">face</span>
                        </div>
                        <div className="absolute top-0 right-0 left-0 flex justify-center -mt-3">
                            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">02</span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-text-light mb-3">Scan &amp; Verify</h3>
                            <p className="text-text-muted-light">Cameras at entry points or handheld devices scan faces and match them instantly.</p>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="w-20 h-20 mx-auto bg-surface-light rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined text-4xl text-primary">analytics</span>
                        </div>
                        <div className="absolute top-0 right-0 left-0 flex justify-center -mt-3">
                            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">03</span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-text-light mb-3">Analyze Data</h3>
                            <p className="text-text-muted-light">View attendance reports, spot trends, and export data for grading systems.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
