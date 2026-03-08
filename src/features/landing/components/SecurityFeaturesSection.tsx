
export const SecurityFeaturesSection = () => {
  return (
    <section className="py-24 bg-background-light overflow-hidden" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg text-primary mb-6">
              <span className="material-symbols-outlined">security</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-light mb-6">
              Achieving Superior <br /> Campus Security
            </h2>
            <p className="text-lg text-text-muted-light mb-8">
              EduVerify replaces outdated card swipes and manual roll calls with seamless, non-intrusive facial recognition. Enhance safety while reducing administrative burden.
            </p>
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center mt-1">
                  <span className="material-symbols-outlined text-secondary text-sm font-bold">check</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-text-light">Eliminate Proxy Attendance</h3>
                  <p className="mt-1 text-text-muted-light">Ensure that the student in the seat is actually who they say they are.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center mt-1">
                  <span className="material-symbols-outlined text-secondary text-sm font-bold">check</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-text-light">Real-time Access Control</h3>
                  <p className="mt-1 text-text-muted-light">Manage entry to dorms, labs, and libraries instantly.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center mt-1">
                  <span className="material-symbols-outlined text-secondary text-sm font-bold">check</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-text-light">GDPR Compliant Privacy</h3>
                  <p className="mt-1 text-text-muted-light">Built with privacy-first architecture. Data is encrypted and secure.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl transform rotate-3 scale-105 blur-lg"></div>
            <img alt="Student Verification Scenario" className="relative rounded-2xl shadow-2xl border border-gray-200 w-full object-cover h-[600px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP70tWAAkZA6-ap8Xet79GSoCn-B6QpveyWJdskIgu9wdfoSLFqWgTh0QVtecS_iFpQdedrGp4e4mlS9fWTcApZgCo8172XF8kr6dNXY6Uuc4EQrEAl180CbHOF_F3KDa6xOmm_YI7SQ_zhkRjNIWIzi8lZ-26KusirL3OuQIO_hWwBGooPrisvmUK6GQWxthe7VbYw3GhubJE7XYEmT91R3vWpnq17vKFY6RlUKHLIR7ygzSapZ_LUClemv1IGLsbfHdrWDY-Det-" />
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg border border-white/20 max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">group</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-light">29 Million</div>
                  <div className="text-xs text-text-muted-light">Verifications Processed</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">timer</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-light">&lt; 0.2s</div>
                  <div className="text-xs text-text-muted-light">Verification Speed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
