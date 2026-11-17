import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { motion } from 'motion/react';
import type { ArchitecturalProject } from '../data/studioData';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ProjectModalProps {
  project: ArchitecturalProject;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function ProjectModal({ project, onClose, onNavigate }: ProjectModalProps) {
  const prefersReduced = useReducedMotion();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    setSelectedImageIdx(0);
  }, [project.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate('next');
      if (e.key === 'ArrowLeft') onNavigate('prev');
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNavigate]);

  const gallery = project.gallery.length > 0 ? project.gallery : [{ url: project.image, caption: project.title }];
  const activeMedia = gallery[selectedImageIdx] || gallery[0];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      initial={prefersReduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-[#0a0a0b]/96 overflow-y-auto"
    >
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 py-8 md:py-12 min-h-screen flex flex-col justify-between">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between gap-6 pb-6 border-b hairline-border">
          <div className="flex items-center gap-3 text-xs font-mono tracking-[0.16em] text-concrete uppercase tabular-nums">
            <span className="text-accent">{project.index}</span>
            <span aria-hidden="true">/</span>
            <span>{project.typology}</span>
            <span aria-hidden="true">·</span>
            <span>{project.location}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project presentation"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-[0.14em] uppercase text-bone hover:text-accent border hairline-border hover:border-accent/60 transition-colors cursor-pointer min-h-[40px]"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Presentation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 py-10 items-start">
          {/* Left Multi-Image Architectural Plate Viewer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="w-full overflow-hidden rounded-2xl bg-charcoal border hairline-border">
              <img
                src={activeMedia.url}
                alt={activeMedia.caption}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[60vh] object-cover block"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs font-mono text-concrete leading-relaxed">
                Plate 0{selectedImageIdx + 1} — {activeMedia.caption}
              </p>

              {gallery.length > 1 && (
                <div className="flex items-center gap-2.5 shrink-0">
                  {gallery.map((item, idx) => {
                    const active = idx === selectedImageIdx;
                    return (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => setSelectedImageIdx(idx)}
                        aria-label={`View plate ${idx + 1}`}
                        className={`w-20 h-14 overflow-hidden rounded-2xl border transition-all cursor-pointer ${
                          active
                            ? 'border-accent opacity-100'
                            : 'border-[#f2f4f6]/15 opacity-55 hover:opacity-90'
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Architectural Concept & Dossier */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-5xl md:text-6xl font-light tracking-[-0.04em] text-accent tabular-nums leading-none">
                  {project.index}
                </span>
                <span className="text-xs font-mono tracking-[0.14em] text-concrete uppercase tabular-nums">
                  {project.coordinates}
                </span>
              </div>

              <h2
                id="modal-project-title"
                className="text-3xl md:text-5xl font-light tracking-[-0.02em] text-bone [text-wrap:balance]"
              >
                {project.title}
              </h2>

              <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-bone/90">
                {project.summary}
              </p>

              <p className="text-sm md:text-base font-light leading-relaxed text-bone/75">
                {project.narrative}
              </p>

              <div className="pt-4 border-t hairline-border space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-[0.16em] text-accent">
                  Architectural Concept
                </h3>
                <p className="text-sm font-light leading-relaxed text-bone/80">
                  {project.architecturalConcept}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-y-5 gap-x-6 pt-6 border-t hairline-border text-sm">
              <div>
                <dt className="text-xs font-mono uppercase tracking-[0.14em] text-concrete">
                  Location
                </dt>
                <dd className="mt-1 text-bone">{project.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-mono uppercase tracking-[0.14em] text-concrete">
                  Typology · Area
                </dt>
                <dd className="mt-1 text-bone tabular-nums">
                  {project.typology} · {project.area}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs font-mono uppercase tracking-[0.14em] text-concrete">
                  Material Palette
                </dt>
                <dd className="mt-1.5 text-bone/85">{project.materials.join(' · ')}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Bottom Monograph Navigation */}
        <div className="flex items-center justify-between pt-6 border-t hairline-border">
          <button
            type="button"
            onClick={() => onNavigate('prev')}
            className="inline-flex items-center gap-3 text-xs font-mono tracking-[0.14em] uppercase text-bone/75 hover:text-accent transition-colors cursor-pointer py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Project</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('next')}
            className="inline-flex items-center gap-3 text-xs font-mono tracking-[0.14em] uppercase text-bone/75 hover:text-accent transition-colors cursor-pointer py-2"
          >
            <span>Next Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
