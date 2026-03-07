import React from 'react';

export const StatsSection = () => {
  return (
    <section className="py-16 bg-surface-light border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-display font-bold text-text-light">Proven Results for Higher Education</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-background-light border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-gray-200" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-primary" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeDasharray="351.86" strokeDashoffset="35.18" strokeWidth="8"></circle>
              </svg>
              <span className="absolute text-3xl font-bold text-text-light">90%</span>
            </div>
            <h3 className="text-lg font-semibold text-text-light mb-2">Reduction in Admin Time</h3>
            <p className="text-sm text-text-muted-light">Faculty spend less time on roll calls.</p>
          </div>
          <div className="p-6 rounded-2xl bg-background-light border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-gray-200" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-secondary" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeDasharray="351.86" strokeDashoffset="10.55" strokeWidth="8"></circle>
              </svg>
              <span className="absolute text-3xl font-bold text-text-light">97%</span>
            </div>
            <h3 className="text-lg font-semibold text-text-light mb-2">Accuracy Rate</h3>
            <p className="text-sm text-text-muted-light">In varying lighting conditions.</p>
          </div>
          <div className="p-6 rounded-2xl bg-background-light border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-gray-200" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-indigo-500" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeDasharray="351.86" strokeDashoffset="70.37" strokeWidth="8"></circle>
              </svg>
              <span className="absolute text-3xl font-bold text-text-light">80%</span>
            </div>
            <h3 className="text-lg font-semibold text-text-light mb-2">Cost Savings</h3>
            <p className="text-sm text-text-muted-light">Year-over-year operational savings.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
