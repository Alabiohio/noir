import { ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroBrutalistScene } from './three/HeroBrutalistScene';
import { SplitText } from './reactbits/SplitText';
import { BlurText } from './reactbits/BlurText';
import { Magnet } from './reactbits/Magnet';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function HeroSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden bg-obsidian flex items-end md:items-center pt-24"
    >
      {/* Full-viewport Procedural 3D Brutalist Luxury Residence */}
      <div className="absolute inset-0 z-0">
        <HeroBrutalistScene />
      </div>

      {/* Restrained directional scrim preserving full architectural clarity on right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-[#0b0c0e]/92 via-[#0b0c0e]/42 to-transparent md:bg-gradient-to-r md:from-[#0b0c0e]/88 md:via-[#0b0c0e]/28 md:to-transparent"
      />

      {/* Oversized Editorial Foreground Typography — Constrained Left Column */}
      <div className="relative z-10 pointer-events-none w-full max-w-[1440px] mx-auto px-6 md:px-12 pb-20 pt-16 md:py-24">
        <div className="max-w-xl lg:max-w-[660px]">

          {/* Dominant Oversized Brutalist Headline */}
          <SplitText
            as="h1"
            lines={['ARCHITECTURE', 'BEYOND', 'FORM.']}
            delay={0.12}
            stagger={0.09}
            accentFinalPeriod
            className="text-[clamp(2.85rem,5.7vw,5.85rem)] font-light leading-[0.9] tracking-[-0.035em] text-bone"
          />

          <BlurText
            as="p"
            delay={0.42}
            text="Sculpting monolithic concrete, dark basalt, and calibrated shadow into enduring residential and cultural architecture."
            className="mt-8 max-w-md text-sm md:text-base font-light leading-relaxed tracking-[0.01em] text-bone/76"
          />

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-7 pointer-events-auto"
          >
            <Magnet strength={0.18}>
              <a
                href="#projects"
                className="group inline-flex items-center rounded-full gap-3 px-6 py-3.5 text-[11px] font-mono tracking-[0.18em] uppercase bg-bone text-obsidian hover:bg-accent transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span>Explore Works</span>
                <ArrowDownRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </Magnet>

            <a
              href="#explorer"
              className="text-[11px] font-mono tracking-[0.18em] uppercase text-bone/72 hover:text-accent transition-colors duration-200 border-b border-bone/25 hover:border-accent pb-1 whitespace-nowrap shrink-0"
            >
              3D Spatial Study
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
