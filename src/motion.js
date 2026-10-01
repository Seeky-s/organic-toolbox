import { useEffect, useRef, useState } from 'react';

export const clamp = (v, min = 0, max = 1) => Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : min;
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

// One loop per instance, suspended while hidden or outside the viewport.
export function useMotionFrame(ref, enabled, draw) {
  const callback = useRef(draw); callback.current = draw;
  useEffect(() => {
    if (!enabled || !ref.current) return;
    let frame = 0, last = 0, time = 0, visible = true;
    const tick = now => {
      frame = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min((now - (last || now)) / 1000, .05);
      last = now; time += dt; callback.current(time, dt);
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(ref.current); document.addEventListener('visibilitychange', sync); sync();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, [ref, enabled]);
}

export function useOrganicPointer(disabled) {
  const target = useRef({ x: 0, y: 0 });
  return { target, handlers: {
    onPointerMove: e => {
      if (disabled || e.pointerType === 'touch') return;
      const r = e.currentTarget.getBoundingClientRect();
      target.current = { x: clamp((e.clientX-r.left)/r.width*2-1,-1,1), y: clamp((e.clientY-r.top)/r.height*2-1,-1,1) };
    },
    onPointerLeave: () => { target.current = { x: 0, y: 0 }; },
    onBlur: () => { target.current = { x: 0, y: 0 }; },
  }};
}
