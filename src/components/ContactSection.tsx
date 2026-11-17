import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { SplitText } from './reactbits/SplitText';
import { ScrollReveal } from './reactbits/ScrollReveal';
import { Magnet } from './reactbits/Magnet';

interface ContactSectionProps {
  inquiryInputRef?: React.RefObject<HTMLInputElement | null>;
}

const TYPOLOGY_OPTIONS = [
  'Private Residence',
  'Cultural Pavilion / Museum',
  'Spatial Interior Architecture',
  'Hospitality Sanctuary',
];

export function ContactSection({ inquiryInputRef }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [typology, setTypology] = useState(TYPOLOGY_OPTIONS[0]);
  const [brief, setBrief] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !email.includes('@')) {
      setError('Please provide your name and a valid email address.');
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <footer id="contact" className="bg-obsidian border-t hairline-border pt-24 md:pt-36 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 pb-20 md:pb-28 border-b hairline-border">
          {/* Left Editorial Invitation */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-10">
            <div>
              <p className="text-xs font-mono tracking-[0.18em] text-accent uppercase mb-4">
                04. Commissions &amp; Dialogue
              </p>
              <SplitText
                as="h2"
                text="Initiate an architectural commission."
                className="text-[clamp(2.25rem,4vw,3.75rem)] font-light leading-[1.03] tracking-[-0.025em] text-bone [text-wrap:balance]"
              />
              <p className="mt-6 text-sm md:text-base font-light leading-relaxed text-concrete max-w-md">
                NOIR accepts a limited number of cultural, residential, and spatial interior
                commissions each year. Share your site context and timeline for a confidential
                studio review.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4 text-sm">
              <div>
                <p className="text-xs font-mono tracking-[0.14em] uppercase text-accent mb-2">
                  Zurich
                </p>
                <p className="text-bone/80 font-light leading-relaxed">
                  Talstrasse 84
                  <br />
                  8001 Zurich
                </p>
              </div>
              <div>
                <p className="text-xs font-mono tracking-[0.14em] uppercase text-accent mb-2">
                  Kyoto
                </p>
                <p className="text-bone/80 font-light leading-relaxed">
                  Nakagyo-ku 142
                  <br />
                  Kyoto 604-8006
                </p>
              </div>
              <div>
                <p className="text-xs font-mono tracking-[0.14em] uppercase text-accent mb-2">
                  Direct
                </p>
                <a
                  href="mailto:commissions@noir-studio.arch"
                  className="text-bone/85 hover:text-accent transition-colors font-light underline underline-offset-4 decoration-bone/25"
                >
                  commissions@noir-studio.arch
                </a>
              </div>
            </div>
          </div>

          {/* Right Minimal Commission Form */}
          <ScrollReveal className="lg:col-span-6">
            {submitted ? (
              <div className="p-8 md:p-10 rounded-2xl bg-charcoal border hairline-border space-y-5">
                <div className="w-10 h-10 rounded-2xl border border-accent/50 flex items-center justify-center text-accent">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-light text-bone">Commission Inquiry Recorded</h3>
                <p className="text-sm font-light leading-relaxed text-bone/75">
                  Thank you, {name}. Our Zurich partners will review your {typology.toLowerCase()}{' '}
                  brief and respond within three studio days.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setBrief('');
                  }}
                  className="text-xs font-mono tracking-[0.14em] uppercase text-accent hover:text-bone transition-colors cursor-pointer pt-2"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="p-7 md:p-10 rounded-2xl bg-charcoal border hairline-border space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono tracking-[0.14em] uppercase text-concrete mb-2"
                    >
                      Name
                    </label>
                    <input
                      ref={inquiryInputRef}
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Elena Vance"
                      className="w-full bg-obsidian border hairline-border px-4 py-3 text-sm text-bone placeholder:text-concrete/50 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono tracking-[0.14em] uppercase text-concrete mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="elena@domain.com"
                      className="w-full bg-obsidian border hairline-border px-4 py-3 text-sm text-bone placeholder:text-concrete/50 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-typology"
                    className="block text-xs font-mono tracking-[0.14em] uppercase text-concrete mb-2"
                  >
                    Commission Typology
                  </label>
                  <select
                    id="contact-typology"
                    value={typology}
                    onChange={(e) => setTypology(e.target.value)}
                    className="w-full bg-obsidian border hairline-border px-4 py-3 text-sm text-bone focus:outline-none focus:border-accent transition-colors"
                  >
                    {TYPOLOGY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-obsidian text-bone">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-brief"
                    className="block text-xs font-mono tracking-[0.14em] uppercase text-concrete mb-2"
                  >
                    Site &amp; Spatial Brief
                  </label>
                  <textarea
                    id="contact-brief"
                    rows={3}
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="Site location, approximate scale, and target schedule..."
                    className="w-full bg-obsidian border hairline-border px-4 py-3 text-sm text-bone placeholder:text-concrete/50 focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs text-accent-light font-mono">
                    {error}
                  </p>
                )}

                <div className="pt-2 flex items-center justify-between gap-4">
                  <Magnet strength={0.18}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-3 px-6 py-3.5 text-xs font-medium tracking-[0.16em] uppercase bg-bone text-obsidian hover:bg-accent transition-colors duration-200 cursor-pointer whitespace-nowrap"
                    >
                      <span>Request Consultation</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </Magnet>

                  <span className="hidden sm:inline text-[11px] font-mono text-concrete">
                    Private Studio Review
                  </span>
                </div>
              </form>
            )}
          </ScrollReveal>
        </div>

        {/* Quiet Editorial Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-concrete">
          <div className="flex items-center gap-4">
            <span className="font-medium tracking-[0.22em] text-bone uppercase">© 2026 Oheo</span>
            <span aria-hidden="true">•</span>
            <a href="https://oheo.site" target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
              oheo.site
            </a>
          </div>

          <div className="flex items-center gap-6">
            <a href="#top" className="hover:text-bone transition-colors">
              Top
            </a>
            <a href="#projects" className="hover:text-bone transition-colors">
              Projects
            </a>
            <a href="#explorer" className="hover:text-bone transition-colors">
              3D Explorer
            </a>
            <a href="#studio" className="hover:text-bone transition-colors">
              Studio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
