import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Layers, Moon, RotateCcw, Sun } from 'lucide-react';
import {
  EXPLORER_CAMERA_PRESETS,
  EXPLORER_MATERIALS,
  type ArchitecturalMaterialId,
  type CameraPresetId,
} from '../data/studioData';
import { ExplorerBuildingScene } from './three/ExplorerBuildingScene';
import { SplitText } from './reactbits/SplitText';
import { ScrollReveal } from './reactbits/ScrollReveal';

export function ArchitectureExplorerSection() {
  const [lightingMode, setLightingMode] = useState<'day' | 'night'>('night');
  const [materialId, setMaterialId] = useState<ArchitecturalMaterialId>('concrete');
  const [presetId, setPresetId] = useState<CameraPresetId>('perspective');
  const [exploded, setExploded] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [isViewportVisible, setIsViewportVisible] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (!('IntersectionObserver' in window)) {
      setHasEnteredViewport(true);
      setIsViewportVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasEnteredViewport(true);
        setIsViewportVisible(entry.isIntersecting);
      },
      { rootMargin: '300px', threshold: 0 }
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const activeMaterial =
    EXPLORER_MATERIALS.find((m) => m.id === materialId) || EXPLORER_MATERIALS[0];
  const activePreset =
    EXPLORER_CAMERA_PRESETS.find((p) => p.id === presetId) || EXPLORER_CAMERA_PRESETS[0];

  const handleReset = () => {
    setLightingMode('night');
    setMaterialId('concrete');
    setPresetId('perspective');
    setExploded(false);
  };

  return (
    <section id="explorer" className="py-24 md:py-36 bg-obsidian border-t hairline-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 md:pb-16 items-end">
          <div className="lg:col-span-7">
            <SplitText
              as="h2"
              text="Examine mass, material, and light in real time."
              className="text-[clamp(2rem,3.6vw,3.35rem)] font-light leading-[1.06] tracking-[-0.025em] text-bone [text-wrap:balance]"
            />
          </div>
          <div className="lg:col-span-5 lg:pl-8">
            <p className="text-sm md:text-base font-light leading-relaxed text-concrete">
              Rotate the cantilevered pavilion freely, shift between solar daylight and nocturnal
              interior illumination, and test primary cladding assemblies.
            </p>
          </div>
        </div>

        {/* Interactive 3D Viewport Stage */}
        <ScrollReveal>
          <div
            ref={viewportRef}
            className="relative w-full h-[580px] md:h-[660px] lg:h-[720px] rounded-2xl border hairline-border bg-[#0b0c0e] overflow-hidden select-none"
          >
            {hasEnteredViewport ? (
              <ExplorerBuildingScene
                lightingMode={lightingMode}
                materialId={materialId}
                cameraPreset={activePreset}
                exploded={exploded}
                active={isViewportVisible}
              />
            ) : (
              <div aria-hidden="true" className="w-full h-full bg-[#0b0c0e]" />
            )}

            {/* Minimal Top-Left Specification Readout (Non-obstructive) */}
            <div className="pointer-events-none absolute top-5 left-5 right-5 flex items-start justify-between gap-4">
              <div
                className={`rounded-2xl px-3.5 py-2.5 border transition-colors duration-300 ${
                  lightingMode === 'day'
                    ? 'bg-[#121417]/88 border-[#f2f4f6]/15 text-bone'
                    : 'bg-[#0e1013]/88 border-[#f2f4f6]/12 text-bone'
                }`}
              >
                <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-[0.14em] uppercase text-accent">
                  <span>{activeMaterial.label}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lightingMode === 'day' ? 'Solar Daylight' : 'Nocturnal'}</span>
                </div>
                <p className="mt-1 text-xs font-light text-bone/75 hidden sm:block max-w-md">
                  {activeMaterial.description}
                </p>
              </div>

              <div className="pointer-events-auto flex items-center gap-2">
                <span className="hidden md:inline-block rounded-2xl px-3 py-2 text-[11px] font-mono tracking-[0.12em] uppercase bg-[#0e1013]/88 border hairline-border text-bone/70">
                  Drag to Orbit 360°
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset Explorer View"
                  aria-label="Reset Explorer View"
                  className="p-2.5 bg-[#0e1013]/92 border hairline-border text-bone/75 hover:text-accent hover:border-accent/60 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Collapsible Bottom Control Dock (Zero Center Occlusion) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(940px,calc(100%-24px))] flex flex-col items-center z-20">
              <button
                type="button"
                onClick={() => setDockCollapsed((prev) => !prev)}
                className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 bg-[#121417]/95 border hairline-border text-[11px] font-mono tracking-[0.14em] uppercase text-bone/75 hover:text-accent transition-colors cursor-pointer"
              >
                {dockCollapsed ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Show Controls</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Hide Controls</span>
                  </>
                )}
              </button>

              {!dockCollapsed && (
                <div className="w-full rounded-2xl bg-[#0e1013]/96 border hairline-border px-4 py-3.5 md:px-5 md:py-3.5 flex flex-wrap items-center justify-between gap-4">
                  {/* Lighting Mode Switch */}
                  <div className="flex items-center gap-1 rounded-2xl bg-[#181b20] p-1 border hairline-border shrink-0">
                    <button
                      type="button"
                      onClick={() => setLightingMode('day')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap ${
                        lightingMode === 'day'
                          ? 'bg-bone text-obsidian font-medium'
                          : 'text-bone/70 hover:text-bone'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Day</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightingMode('night')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap ${
                        lightingMode === 'night'
                          ? 'bg-accent text-obsidian font-medium'
                          : 'text-bone/70 hover:text-bone'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Night</span>
                    </button>
                  </div>

                  {/* Architectural Material Selector */}
                  <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Architectural material">
                    {EXPLORER_MATERIALS.map((mat) => {
                      const active = mat.id === materialId;
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setMaterialId(mat.id)}
                          className={`inline-flex items-center gap-2 px-2.5 py-1.5 text-xs transition-colors cursor-pointer border whitespace-nowrap shrink-0 ${
                            active
                              ? 'border-accent bg-[#181d24] text-bone'
                              : 'border-transparent hover:border-[#f2f4f6]/20 text-bone/70 hover:text-bone'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="w-3 h-3 border border-white/25 shrink-0"
                            style={{ backgroundColor: mat.swatchHex }}
                          />
                          <span>{mat.label.split(' ').slice(-1)[0]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Camera Presets & Tectonic Exploded View */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {EXPLORER_CAMERA_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setPresetId(preset.id)}
                        className={`px-2.5 py-1.5 text-[11px] font-mono tracking-wider uppercase transition-colors cursor-pointer border whitespace-nowrap shrink-0 ${
                          presetId === preset.id
                            ? 'border-bone/50 text-bone bg-white/8'
                            : 'border-transparent text-concrete hover:text-bone'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setExploded((prev) => !prev)}
                      aria-pressed={exploded}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono tracking-wider uppercase transition-colors cursor-pointer border whitespace-nowrap shrink-0 ${
                        exploded
                          ? 'border-accent bg-accent/20 text-accent-light'
                          : 'border-white/15 text-bone/75 hover:border-accent/50 hover:text-bone'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Explode</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
