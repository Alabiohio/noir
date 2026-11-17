import { motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SplitTextProps {
  text?: string;
  lines?: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  accentFinalPeriod?: boolean;
}

export function SplitText({
  text,
  lines,
  className = '',
  lineClassName = '',
  delay = 0.08,
  stagger = 0.06,
  as = 'h1',
  accentFinalPeriod = false,
}: SplitTextProps) {
  const prefersReduced = useReducedMotion();
  const resolvedLines = lines && lines.length > 0 ? lines : [text || ''];
  const fullLabel = resolvedLines.join(' ');
  const Component = motion[as];

  if (prefersReduced) {
    const StaticTag = as;
    return (
      <StaticTag className={className}>
        {resolvedLines.map((line, idx) => (
          <span key={idx} className={`block ${lineClassName}`}>
            {line}
          </span>
        ))}
      </StaticTag>
    );
  }

  let wordCounter = 0;

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      aria-label={fullLabel}
    >
      {resolvedLines.map((line, lineIdx) => {
        const words = line.split(' ').filter(Boolean);
        const isLastLine = lineIdx === resolvedLines.length - 1;

        return (
          <span key={`line-${lineIdx}`} className={`block ${lineClassName}`}>
            {words.map((word, wordIdx) => {
              const currentIndex = wordCounter++;
              const isLastWord = isLastLine && wordIdx === words.length - 1;
              const hasPeriod = accentFinalPeriod && isLastWord && word.endsWith('.');
              const bodyText = hasPeriod ? word.slice(0, -1) : word;

              return (
                <span
                  key={`${word}-${currentIndex}`}
                  className="inline-block overflow-hidden align-bottom mr-[0.26em] last:mr-0"
                >
                  <motion.span
                    className="inline-block will-change-transform"
                    variants={{
                      hidden: { y: '108%', opacity: 0 },
                      visible: {
                        y: '0%',
                        opacity: 1,
                        transition: {
                          duration: 0.82,
                          delay: delay + currentIndex * stagger,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      },
                    }}
                  >
                    {bodyText}
                    {hasPeriod && <span className="text-accent">.</span>}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Component>
  );
}
