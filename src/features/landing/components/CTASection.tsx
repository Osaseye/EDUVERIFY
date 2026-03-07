import React from 'react';

export const CTASection = () => {
    return (
        <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-primary rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full translate-x-1/3 translate-y-1/3 mix-blend-overlay"></div>
                    <h2 className="relative z-10 text-3xl md:text-5xl font-display font-bold text-white mb-6">Ready to modernize your campus?</h2>
                    <p className="relative z-10 text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Join over 500 universities using EduVerify to secure their attendance and improve campus safety.
                    </p>
                    <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
                        <a className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg" href="#">
                            Book a Demo
                        </a>
                        <a className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors" href="#">
                            Contact Sales
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
