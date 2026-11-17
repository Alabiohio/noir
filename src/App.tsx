import { useRef } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SelectedProjectsSection } from './components/SelectedProjectsSection';
import { ArchitectureExplorerSection } from './components/ArchitectureExplorerSection';
import { StudioSection } from './components/StudioSection';
import { ContactSection } from './components/ContactSection';

export default function App() {
  const inquiryInputRef = useRef<HTMLInputElement>(null);

  const handleOpenInquiry = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => {
        inquiryInputRef.current?.focus({ preventScroll: true });
      }, 450);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-obsidian text-bone selection:bg-accent/35 selection:text-bone">
        <Navbar onOpenInquiry={handleOpenInquiry} />
        <main>
          <HeroSection />
          <SelectedProjectsSection />
          <ArchitectureExplorerSection />
          <StudioSection />
        </main>
        <ContactSection inquiryInputRef={inquiryInputRef} />
      </div>
    </MotionConfig>
  );
}
