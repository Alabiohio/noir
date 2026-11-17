import { motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'p' | 'h2' | 'h3' | 'span' | 'blockquote';
}

export function BlurText({
  text,
  className = '',
  delay = 0.15,
  as = 'p',
}: BlurTextProps) {
  const prefersReduced = useReducedMotion();
  const words = text.split(' ');

  if (prefersReduced) {
    const StaticTag = as;
    return <StaticTag className={className}>{text}</StaticTag>;
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      {words.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          className="inline-block mr-[0.26em] last:mr-0 will-change-[transform,opacity,filter]"
          variants={{
            hidden: { opacity: 0, filter: 'blur(8px)', y: 10 },
            visible: {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              transition: {
                duration: 0.55,
                delay: delay + idx * 0.025,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
