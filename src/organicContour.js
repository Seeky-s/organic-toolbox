import { clamp } from './motion.js';

export const restingContour = '28% 24% 30% 25% / 24% 28% 25% 30%';

// A shared, autonomous rhythm: pointer position never influences the contour.
export function organicContour(time, intensity, speed) {
  const t = time * clamp(speed, .2, 3), k = clamp(intensity);
  return {
    borderRadius: `${28 + Math.sin(t) * 12 * k}% ${24 + Math.cos(t * .7) * 12 * k}% ${30 + Math.sin(t * .8 + 1) * 12 * k}% ${25 + Math.cos(t * .9) * 12 * k}% / 24% ${28 + Math.cos(t) * 10 * k}% 25% 30%`,
    transform: `scale(${1 + Math.sin(t * .7) * k * .012})`,
  };
}
