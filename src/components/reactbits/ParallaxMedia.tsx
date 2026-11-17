import { type ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ParallaxMediaProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

export function ParallaxMedia({
  children,
  className = '',
  offset = 32,
}: ParallaxMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div
        style={prefersReduced ? undefined : { y }}
        className="w-full h-full scale-[1.08] will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
