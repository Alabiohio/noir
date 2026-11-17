import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SELECTED_PROJECTS, type ArchitecturalProject } from '../data/studioData';
import { ScrollReveal } from './reactbits/ScrollReveal';
import { ParallaxMedia } from './reactbits/ParallaxMedia';
import { SplitText } from './reactbits/SplitText';
import { ProjectModal } from './ProjectModal';
import { useReducedMotion } from '../hooks/useReducedMotion';

function EditorialProjectMedia({
  project,
  aspectClass,
  parallaxOffset = 22,
}: {
  project: ArchitecturalProject;
  aspectClass: string;
  parallaxOffset?: number;
}) {
  const [failed, setFailed] = useState(false);
  const prefersReduced = useReducedMotion();

  if (failed) {
    return (
      <div
        className={`${aspectClass} w-full bg-gradient-to-br from-[#171a1f] via-[#111316] to-[#192029] flex flex-col items-center justify-center p-8 text-center`}
      >
        <span className="text-xs font-mono tracking-[0.2em] text-accent uppercase">
          {project.index} · {project.location}
        </span>
        <span className="mt-2 text-lg font-light text-bone">{project.title}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, scale: 1.05 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full will-change-transform"
    >
      <ParallaxMedia className={aspectClass} offset={parallaxOffset}>
        <img
          src={project.image}
          alt={`${project.title} — ${project.typology} in ${project.location}`}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
        />
      </ParallaxMedia>
    </motion.div>
  );
}

function ProjectEditorialDossier({
  project,
  onOpen,
  align = 'left',
}: {
  project: ArchitecturalProject;
  onOpen: () => void;
  align?: 'left' | 'right';
}) {
  return (
    <div
      className={`flex flex-col justify-between space-y-6 ${
        align === 'right' ? 'lg:pl-4' : 'lg:pr-4'
      }`}
    >
      <div className="space-y-5">
        <div className="flex items-baseline justify-between gap-4 border-b hairline-border pb-4">
          <span className="text-[clamp(3.25rem,5.5vw,5.25rem)] font-light leading-none tracking-[-0.04em] text-accent tabular-nums">
            {project.index}
          </span>
          <span className="text-[11px] font-mono tracking-[0.16em] text-concrete uppercase tabular-nums text-right">
            {project.typology} / {project.location}
          </span>
        </div>

        <h3 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-bone group-hover:text-accent transition-colors duration-200">
          {project.title}
        </h3>

        <p className="text-sm md:text-base font-light leading-relaxed text-bone/74">
          {project.summary}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.16em] uppercase text-bone hover:text-accent transition-colors cursor-pointer border-b border-bone/25 hover:border-accent pb-1"
        >
          <span>View Presentation</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>

        <span className="text-[11px] font-mono tracking-[0.14em] text-concrete tabular-nums">
          {project.area} · {project.year}
        </span>
      </div>
    </div>
  );
}

export function SelectedProjectsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (activeIndex === null) return;
    const total = SELECTED_PROJECTS.length;
    setActiveIndex(
      direction === 'next' ? (activeIndex + 1) % total : (activeIndex - 1 + total) % total
    );
  };

  const p1 = SELECTED_PROJECTS[0];
  const p2 = SELECTED_PROJECTS[1];
  const p3 = SELECTED_PROJECTS[2];
  const p4 = SELECTED_PROJECTS[3];

  return (
    <section id="projects" className="py-24 md:py-36 bg-obsidian border-t hairline-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Gallery Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 md:pb-24 border-b hairline-border items-end">
          <div className="lg:col-span-7">
            <SplitText
              as="h2"
              text="Monographs in stone, concrete, and calibrated light."
              className="text-[clamp(2rem,3.8vw,3.5rem)] font-light leading-[1.05] tracking-[-0.025em] text-bone [text-wrap:balance]"
            />
          </div>
          <div className="lg:col-span-5 lg:pl-8">
            <p className="text-sm md:text-base font-light leading-relaxed text-concrete">
              Four signature commissions spanning Lagos, Accra, Cape Town, and Copenhagen. Select
              any monograph to examine full architectural documentation and spatial concepts.
            </p>
          </div>
        </div>

        {/* 01 — THE MONOLITH (Left 8-col Cinema Image / Right 4-col Dossier) */}
        <ScrollReveal className="pt-16 md:pt-24">
          <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <button
              type="button"
              onClick={() => setActiveIndex(0)}
              aria-label={`Open ${p1.title} architectural presentation`}
              className="lg:col-span-8 relative block w-full text-left overflow-hidden rounded-2xl bg-charcoal border hairline-border group-hover:border-accent/55 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <EditorialProjectMedia project={p1} aspectClass="aspect-[16/9]" parallaxOffset={24} />
            </button>

            <div className="lg:col-span-4 pb-1">
              <ProjectEditorialDossier project={p1} onOpen={() => setActiveIndex(0)} align="right" />
            </div>
          </article>
        </ScrollReveal>

        {/* 02 — HOUSE OF LIGHT (Inverted Asymmetric: Left 5-col Dossier / Right 7-col Image) */}
        <ScrollReveal className="pt-20 md:pt-32">
          <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <ProjectEditorialDossier project={p2} onOpen={() => setActiveIndex(1)} align="left" />
            </div>

            <button
              type="button"
              onClick={() => setActiveIndex(1)}
              aria-label={`Open ${p2.title} architectural presentation`}
              className="lg:col-span-7 order-1 lg:order-2 relative block w-full text-left overflow-hidden rounded-2xl bg-charcoal border hairline-border group-hover:border-accent/55 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <EditorialProjectMedia project={p2} aspectClass="aspect-[4/3]" parallaxOffset={22} />
            </button>
          </article>
        </ScrollReveal>

        {/* 03 — CONCRETE HORIZON (Vertical Asymmetric: Left 6-col Portrait / Right 5-col Offset Dossier) */}
        <ScrollReveal className="pt-20 md:pt-32">
          <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <button
              type="button"
              onClick={() => setActiveIndex(2)}
              aria-label={`Open ${p3.title} architectural presentation`}
              className="lg:col-span-6 relative block w-full text-left overflow-hidden rounded-2xl bg-charcoal border hairline-border group-hover:border-accent/55 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <EditorialProjectMedia project={p3} aspectClass="aspect-[3/4]" parallaxOffset={26} />
            </button>

            <div className="lg:col-span-5 lg:col-start-8 space-y-8">
              <ProjectEditorialDossier project={p3} onOpen={() => setActiveIndex(2)} align="right" />

              {/* Quiet secondary architectural preview plate */}
              <button
                type="button"
                onClick={() => setActiveIndex(2)}
                className="hidden lg:block w-full overflow-hidden rounded-2xl border hairline-border hover:border-accent/55 transition-colors cursor-pointer text-left"
              >
                <div className="aspect-[16/9] overflow-hidden bg-charcoal">
                  <img
                    src={p3.gallery[1].url}
                    alt={p3.gallery[1].caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 hover:opacity-100 hover:scale-[1.03] transition-all duration-500"
                  />
                </div>
                <div className="px-4 py-2.5 bg-charcoal text-[11px] font-mono text-concrete truncate">
                  Interior Atrium · {p3.location}
                </div>
              </button>
            </div>
          </article>
        </ScrollReveal>

        {/* 04 — SILENT FORM (Inverted Closing Wide Spread: Left 4-col Dossier / Right 8-col Cinema Image) */}
        <ScrollReveal className="pt-20 md:pt-32">
          <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-4 order-2 lg:order-1 pb-1">
              <ProjectEditorialDossier project={p4} onOpen={() => setActiveIndex(3)} align="left" />
            </div>

            <button
              type="button"
              onClick={() => setActiveIndex(3)}
              aria-label={`Open ${p4.title} architectural presentation`}
              className="lg:col-span-8 order-1 lg:order-2 relative block w-full text-left overflow-hidden rounded-2xl bg-charcoal border hairline-border group-hover:border-accent/55 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <EditorialProjectMedia project={p4} aspectClass="aspect-[16/9]" parallaxOffset={24} />
            </button>
          </article>
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <ProjectModal
            project={SELECTED_PROJECTS[activeIndex]}
            onClose={() => setActiveIndex(null)}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
