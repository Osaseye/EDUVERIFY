import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../features/landing/components/HeroSection';
import { TrustedBySection } from '../features/landing/components/TrustedBySection';
import { SecurityFeaturesSection } from '../features/landing/components/SecurityFeaturesSection';
import { StatsSection } from '../features/landing/components/StatsSection';
import { WorkflowSection } from '../features/landing/components/WorkflowSection';
import { BlogSection } from '../features/landing/components/BlogSection';
import { CTASection } from '../features/landing/components/CTASection';

export const LandingPage = () => {
    return (
        <div className="bg-background-light text-text-light font-sans antialiased">
            <Navbar />
            <main>
                <HeroSection />
                <TrustedBySection />
                <SecurityFeaturesSection />
                <StatsSection />
                <WorkflowSection />
                <BlogSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};
