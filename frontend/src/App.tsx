import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { IntroSection } from './components/IntroSection';
import { AboutSection } from './components/AboutSection';
import { ThemesSection } from './components/ThemesSection';
import { DetailsSection } from './components/DetailsSection';
import { PreviewSection } from './components/PreviewSection';
import { OrderSection } from './components/OrderSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { PetalBackgroundCanvas } from './components/PetalBackgroundCanvas';
import { ThankYouPage } from './components/ThankYouPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ShippingPage } from './pages/ShippingPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { ContactPage } from './pages/ContactPage';
import { AuthModal } from './components/AuthModal';
import { OrderData } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const handleNavigate = (target: string) => {
    if (['shipping', 'privacy', 'terms', 'refund', 'contact'].includes(target)) {
      setCurrentView(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const handleOrderSuccess = (order: OrderData) => {
    setCompletedOrder(order);
    setCurrentView('thankyou');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E5E5E5] font-sans">
      {/* Interactive Subtle Petal Background */}
      <PetalBackgroundCanvas />

      {/* Navbar */}
      <Navbar onNavigate={handleNavigate} onOpenAuth={() => setShowAuthModal(true)} hasOrder={!!completedOrder} />

      {/* Main View Router */}
      <main className="relative z-10">
        {currentView === 'home' && (
          <>
            <HeroSection onNavigate={handleNavigate} />
            <IntroSection />
            <AboutSection />
            <ThemesSection />
            <DetailsSection />
            <PreviewSection />
            <OrderSection onOrderSuccess={handleOrderSuccess} />
            <ReviewsSection />
          </>
        )}

        {currentView === 'thankyou' && completedOrder && (
          <ThankYouPage
            order={completedOrder}
            onBackHome={() => handleNavigate('hero')}
          />
        )}

        {currentView === 'shipping' && <ShippingPage />}
        {currentView === 'privacy' && <PrivacyPolicyPage />}
        {currentView === 'terms' && <TermsPage />}
        {currentView === 'refund' && <RefundPolicyPage />}
        {currentView === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setShowAdminModal(true)}
      />

      {/* Admin Dashboard Modal */}
      {showAdminModal && (
        <AdminDashboardPage onClose={() => setShowAdminModal(false)} />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default App;
