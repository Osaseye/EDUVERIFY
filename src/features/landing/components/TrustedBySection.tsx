import React from 'react';

export const TrustedBySection = () => {
    return (
        <section className="py-10 border-y border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-semibold text-text-muted-light uppercase tracking-wider mb-8">Trusted by leading educational institutions</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 font-display font-bold text-xl text-text-light"><span className="material-symbols-outlined text-3xl">school</span> University A</div>
                    <div className="flex items-center gap-2 font-display font-bold text-xl text-text-light"><span className="material-symbols-outlined text-3xl">menu_book</span> Tech Institute</div>
                    <div className="flex items-center gap-2 font-display font-bold text-xl text-text-light"><span className="material-symbols-outlined text-3xl">science</span> State College</div>
                    <div className="flex items-center gap-2 font-display font-bold text-xl text-text-light"><span className="material-symbols-outlined text-3xl">architecture</span> Design Academy</div>
                    <div className="flex items-center gap-2 font-display font-bold text-xl text-text-light"><span className="material-symbols-outlined text-3xl">history_edu</span> Law School</div>
                </div>
            </div>
        </section>
    );
};
