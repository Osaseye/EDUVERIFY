
export const BlogSection = () => {
    return (
        <section className="py-24 bg-surface-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-secondary font-semibold uppercase tracking-wider text-sm">Resources</span>
                        <h2 className="text-3xl font-display font-bold text-text-light mt-2">Latest from our blog</h2>
                    </div>
                    <a className="hidden sm:flex items-center text-primary font-semibold hover:underline" href="#">
                        View all posts <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group cursor-pointer">
                        <div className="overflow-hidden rounded-2xl mb-4 aspect-w-16 aspect-h-9 bg-gray-100">
                            <img alt="Blog Post Image" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAYz4PqQIlKJS-3YK52IW4vzIFFa1rWsTWvPYYUcHoUUOHIuJkzZGFfbcOZpa20TaynH-IvungbE-2UF54hGIysYKW5e96jzNt7s5D0QJRFrPpxYYLF_76hXYrcbRcKpgMoxKwAP2eMAKI2k6kek-eDnBtgSIb13dElv4uwfbEZ09VqK8m03KAdfkEDhasRqNwj9vn_8pssKXFeWk-YfQCvrqQoM7pXUTwxLH6tR-8AfSJR31l3VAa9tjQoioyoWiPzUc4YAbWZ5pJ" />
                        </div>
                        <div className="text-xs font-semibold text-secondary mb-2">PRODUCT UPDATE � 5 MIN READ</div>
                        <h3 className="text-xl font-bold text-text-light mb-2 group-hover:text-primary transition-colors">Implementing AI Ethics in Campus Surveillance</h3>
                        <p className="text-text-muted-light text-sm">How we ensure student privacy remains paramount while improving security.</p>
                    </div>
                    <div className="group cursor-pointer">
                        <div className="overflow-hidden rounded-2xl mb-4 aspect-w-16 aspect-h-9 bg-gray-100">
                            <img alt="Blog Post Image" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEv0pvrwuePCTVgWWKFQYWsj0rHqFdEYnUq9cTH4e6Wc8yVWf8M4HkJYt-abIXFqvPxUQ6uVC5jVdW5ymSBJwLbYCG64pjTy5jOk0CmoVXjEgcEbY_IlVCGs8DY7pkAz7XOH8MU7FkouVqjge8NONpHlo-hBDXzPkg8h29xgyhzX1rCR12nDV2IojcQZFRf4_0v9S7w-TxaM_kbo7qPlBLyURxtxKR_6Fyo8OBT2K0zvzZmbZVKnJIlJ1bNzwSqH7AY-sc_tVmx9RT" />
                        </div>
                        <div className="text-xs font-semibold text-secondary mb-2">CASE STUDY � 3 MIN READ</div>
                        <h3 className="text-xl font-bold text-text-light mb-2 group-hover:text-primary transition-colors">Tech Institute Cuts Attendance Time by 90%</h3>
                        <p className="text-text-muted-light text-sm">Read how one university saved 500 hours of faculty time per semester.</p>
                    </div>
                    <div className="group cursor-pointer">
                        <div className="overflow-hidden rounded-2xl mb-4 aspect-w-16 aspect-h-9 bg-gray-100">
                            <img alt="Blog Post Image" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKtVm9qnceXcyoMXSVX5tjlalwPX4EvgDbeJGI87-tEjk9HNrDBVAgCfwxScW5P5LM3Vo3cJ1sdWWiDg9Q0tv3MOzq_A74isQhxgtyVbvVYzPiOFi08-5Nc06hFb-YG__HbgfpIOWFbZ2dT8FOTddCDgIXw2skouJIjqwa-sjx5chK5rXL4B4Jh_CPDFKXDdzfwTlIZAeDC7Orv73vmRWWtmqlapqR4xXkTJ9c0OOH6MbT2RgxxoP73LvDODDUapX-_P8vOUoJ5Yxe" />
                        </div>
                        <div className="text-xs font-semibold text-secondary mb-2">SECURITY � 4 MIN READ</div>
                        <h3 className="text-xl font-bold text-text-light mb-2 group-hover:text-primary transition-colors">Understanding Facial Recognition Accuracy</h3>
                        <p className="text-text-muted-light text-sm">A deep dive into the technology that powers EduVerify.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
