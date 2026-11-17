import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Magnet } from './reactbits/Magnet';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface NavbarProps {
  onOpenInquiry: () => void;
}

const NAV_LINKS = [
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'explorer', label: 'Explorer', href: '#explorer' },
  { id: 'studio', label: 'Studio', href: '#studio' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export function Navbar({ onOpenInquiry }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('top');
  const [scrolled, setScrolled] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const sectionIds = ['top', 'projects', 'explorer', 'studio', 'contact'];

    const updateFromScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 36);

      if (scrollY < 160) {
        setActiveSection('top');
        return;
      }

      const probeY = scrollY + window.innerHeight * 0.35;
      let current = 'top';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probeY) {
          current = id;
        }
      }

      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 40) {
        current = 'contact';
      }

      setActiveSection(current);
    };

    updateFromScroll();
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateFromScroll);
      window.removeEventListener('resize', updateFromScroll);
    };
  }, []);

  const handleLinkClick = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-3 md:top-5 inset-x-0 z-40 px-4 md:px-8 pointer-events-none">
      <div
        className={`pointer-events-auto max-w-[1392px] rounded-full mx-auto px-5 md:px-8 py-3 md:py-3.5 flex items-center justify-between gap-8 border transition-colors duration-300 ${
          scrolled
            ? 'bg-[#0b0c0e]/95 border-[#f2f4f6]/14'
            : 'bg-[#0b0c0e]/80 border-[#f2f4f6]/10'
        }`}
      >
        {/* Zone 1: Refined NOIR editorial wordmark */}
        <a
          href="#top"
          onClick={() => handleLinkClick('top')}
          className="text-base md:text-lg font-medium tracking-[0.36em] text-bone uppercase whitespace-nowrap shrink-0 hover:text-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          NOIR
        </a>

        {/* Zone 2: Minimal single-line navigation links with animated active indicator */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-10 text-xs font-mono tracking-[0.16em] uppercase"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => handleLinkClick(item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`relative py-2 whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                  isActive ? 'text-bone' : 'text-bone/60 hover:text-bone'
                }`}
              >
                <span className="inline-block transition-transform duration-200 hover:-translate-y-[1px]">
                  {item.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId={prefersReduced ? undefined : 'nav-active-indicator'}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 right-0 bottom-0 h-px bg-accent"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <Magnet strength={0.16} className="hidden md:inline-block">
            <button
              type="button"
              onClick={onOpenInquiry}
              className="px-5 py-2 text-[11px] rounded-full font-mono tracking-[0.18em] uppercase text-obsidian bg-bone hover:bg-accent transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Inquire
            </button>
          </Magnet>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-2 text-bone hover:text-accent transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Floating Drawer */}
      {mobileOpen && (
        <div className="pointer-events-auto md:hidden max-w-[1392px] mx-auto mt-2 rounded-2xl bg-[#0b0c0e]/98 border hairline-border px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => handleLinkClick(item.id)}
                className={`flex items-center justify-between py-2 text-sm font-mono tracking-[0.14em] uppercase border-b hairline-border transition-colors ${
                  isActive ? 'text-accent' : 'text-bone/80 hover:text-bone'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-4 h-px bg-accent" aria-hidden="true" />}
              </a>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenInquiry();
            }}
            className="mt-2 w-full py-3.5 text-xs font-mono tracking-[0.18em] uppercase text-obsidian bg-bone hover:bg-accent transition-colors cursor-pointer"
          >
            Inquire
          </button>
        </div>
      )}
    </header>
  );
}
