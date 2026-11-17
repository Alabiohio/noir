import { type ReactNode, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MagnetProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function Magnet({ children, strength = 0.22, className = '' }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setOffset({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={
        prefersReduced
          ? undefined
          : { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }
      }
    >
      {children}
    </div>
  );
}
