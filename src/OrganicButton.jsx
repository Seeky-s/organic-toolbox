import React, { useEffect, useRef } from 'react';
import { clamp, useReducedMotion, useMotionFrame } from './motion.js';

// Pixel radii preserve a rectangular silhouette regardless of label length.
const restingContour = '14px 16px 13px 17px / 15px 13px 16px 14px';

export function OrganicButton({ children, intensity = .5, speed = 1, motionDisabled = false, disabled = false, style, type = 'button', ...props }) {
  const ref = useRef(null), shape = useRef(null);
  const reduced = useReducedMotion(), stopped = reduced || motionDisabled || disabled;
  useMotionFrame(ref, !stopped, time => {
    const t = time * clamp(speed, .2, 3) * .65;
    const k = clamp(intensity);
    const wave = Math.sin(t) * 18 * k;
    const drift = Math.sin(t * .73) * 16 * k;
    shape.current.style.borderRadius = `${Math.max(5,14+wave)}px ${Math.max(5,16-drift)}px ${Math.max(5,13-wave)}px ${Math.max(5,17+drift)}px / ${Math.max(5,15+drift)}px ${Math.max(5,13+wave)}px ${Math.max(5,16-drift)}px ${Math.max(5,14-wave)}px`;
    shape.current.style.transform = `scale(${1+Math.sin(t*.8)*.025*k},${1+Math.sin(t*1.1)*.10*k}) skewX(${Math.sin(t*.6)*3*k}deg)`;
  });
  useEffect(()=>{if(stopped && shape.current){shape.current.style.transform='none';shape.current.style.borderRadius=restingContour;}},[stopped]);
  return <button {...props} ref={ref} type={type} disabled={disabled}
    style={{border:0,borderRadius:14,padding:'19px 32px',minHeight:56,background:'transparent',color:'white',position:'relative',isolation:'isolate',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.5:1,...style}}>
    <span ref={shape} aria-hidden="true" style={{position:'absolute',inset:0,zIndex:-1,background:'var(--organic-button-color, #304f45)',borderRadius:restingContour,pointerEvents:'none'}}/>{children}
  </button>;
}
