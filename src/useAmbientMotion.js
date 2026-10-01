import { useEffect } from 'react';
import { useMotionFrame, useReducedMotion } from './motion.js';

export function useAmbientMotion(ref, disabled, draw) {
  const reduced = useReducedMotion();
  const stopped = disabled || reduced;
  useMotionFrame(ref, !stopped, draw);
  useEffect(() => { if (stopped) draw(0); }, [stopped, draw]);
  return stopped;
}
