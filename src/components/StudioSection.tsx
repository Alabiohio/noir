import { useState } from 'react';
import { motion } from 'motion/react';
import { STUDIO_IMAGE, STUDIO_SERVICES } from '../data/studioData';
import { SplitText } from './reactbits/SplitText';
import { BlurText } from './reactbits/BlurText';
import { ScrollReveal } from './reactbits/ScrollReveal';
import { ParallaxMedia } from './reactbits/ParallaxMedia';
import { useReducedMotion } from '../hooks/useReducedMotion';

const PRACTICE_FACTS = [
  { label: 'Established', value: '2014' },
  { label: 'Built Commissions', value: '38' },
  { label: 'Atelier Locations', value: 'Zurich · Kyoto · Milan' },
  { label: 'Disciplines', value: 'Architecture · Interiors' },
];

export function StudioSection() {
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const prefersReduced = useReducedMotion();

  const activeService = STUDIO_SERVICES[activeServiceIdx];

  return (
    <section id="studio" className="py-24 md:py-36 bg-charcoal border-t hairline-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Studio Philosophy Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 md:pb-24 border-b hairline-border">
          <div className="lg:col-span-5">
            <SplitText
              as="h2"
              text="Space carved from silence, permanence, and gravity."
              className="text-[clamp(2rem,3.5vw,3.25rem)] font-light leading-[1.06] tracking-[-0.025em] text-bone [text-wrap:balance]"
            />
          </div>

          <div className="lg:col-span-7 lg:pl-10 flex flex-col justify-between space-y-8">
            <BlurText
              as="blockquote"
              text="“We do not ornament structure; we allow the quiet weight of stone, concrete, and shadow to articulate stillness.”"
              className="font-serif italic text-2xl md:text-3xl leading-[1.35] text-bone/92"
            />
            <p className="text-sm md:text-base font-light leading-relaxed text-concrete max-w-2xl">
              Founded in Zurich with ateliers in Kyoto and Milan, NOIR operates at the intersection
              of brutalist structural discipline and tactile interior restraint. Every commission
              begins with physical plaster and brushed steel scale models, testing how natural light
              travels across raw mineral surfaces over the course of a year.
            </p>
          </div>
        </div>

        {/* Adjacent Practice Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-b hairline-border">
          {PRACTICE_FACTS.map((fact) => (
            <div key={fact.label} className="space-y-1.5">
              <div className="text-xs font-mono tracking-[0.14em] uppercase text-concrete">
                {fact.label}
              </div>
              <div className="text-lg md:text-xl font-light text-bone tabular-nums">
                {fact.value}
              </div>
            </div>
          ))}
        </div>

        {/* Asymmetrical Studio Imagery & Services Index */}
        <div className="pt-16 md:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          <ScrollReveal className="lg:col-span-6 flex flex-col justify-between">
            <div className="relative overflow-hidden rounded-2xl border hairline-border bg-obsidian h-full min-h-[360px]">
              {imageFailed ? (
                <div className="w-full h-full min-h-[360px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#16181c] to-[#0b0c0e]">
                  <span className="text-xs font-mono tracking-[0.18em] text-accent uppercase">
                    NOIR Atelier
                  </span>
                  <span className="mt-2 text-lg font-light text-bone">
                    Physical Scale Modeling Studio
                  </span>
                </div>
              ) : (
                <ParallaxMedia className="w-full h-full aspect-[4/3] lg:aspect-auto lg:h-full" offset={22}>
                  <img
                    src={STUDIO_IMAGE}
                    alt="NOIR architectural studio model making table in concrete atelier"
                    referrerPolicy="no-referrer"
                    onError={() => setImageFailed(true)}
                    className="w-full h-full object-cover"
                  />
                </ParallaxMedia>
              )}
            </div>
          </ScrollReveal>

          <div className="lg:col-span-6 flex flex-col justify-between space-y-10">
            <div>
              <p className="text-xs font-mono tracking-[0.16em] text-accent uppercase mb-6">
                Architecture &amp; Interior Disciplines
              </p>

              <div className="divide-y divide-[#f2f4f6]/10 border-t border-b hairline-border">
                {STUDIO_SERVICES.map((service, idx) => {
                  const isActive = idx === activeServiceIdx;
                  return (
                    <button
                      key={service.index}
                      type="button"
                      onClick={() => setActiveServiceIdx(idx)}
                      onMouseEnter={() => setActiveServiceIdx(idx)}
                      className="w-full text-left py-5 px-1 flex items-baseline justify-between gap-6 group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    >
                      <div className="flex items-baseline gap-5">
                        <span
                          className={`text-xs font-mono tabular-nums transition-colors ${
                            isActive ? 'text-accent' : 'text-concrete'
                          }`}
                        >
                          {service.index}.
                        </span>
                        <span
                          className={`text-xl md:text-2xl font-light tracking-tight transition-colors ${
                            isActive ? 'text-bone' : 'text-bone/60 group-hover:text-bone'
                          }`}
                        >
                          {service.title}
                        </span>
                      </div>

                      <span className="hidden sm:inline text-xs font-mono text-concrete whitespace-nowrap">
                        {service.discipline.split(' · ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Service Editorial Dossier */}
            <motion.div
              key={activeService.index}
              initial={prefersReduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 md:p-8 rounded-2xl bg-obsidian border hairline-border space-y-4"
            >
              <div className="text-xs font-mono tracking-[0.14em] uppercase text-accent">
                {activeService.index} · {activeService.discipline}
              </div>
              <p className="text-sm md:text-base font-light leading-relaxed text-bone/82">
                {activeService.description}
              </p>
              <div className="pt-2 border-t hairline-border text-xs text-concrete">
                <span className="font-mono uppercase tracking-[0.12em] text-bone/65 mr-2">
                  Scope:
                </span>
                <span>{activeService.deliverables}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
