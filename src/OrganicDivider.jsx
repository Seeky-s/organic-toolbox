import React, { useRef } from 'react';
import { clamp } from './motion.js';
import { useAmbientMotion } from './useAmbientMotion.js';

export function OrganicDivider({ color='#8a9e7f', intensity=.5, speed=1, motionDisabled=false, style, ...props }) {
  const ref=useRef(null), path=useRef(null);
  useAmbientMotion(ref,motionDisabled,time=>{
    const t=time*clamp(speed,.2,3), a=clamp(intensity)*22;
    path.current.setAttribute('d',`M0 50 C180 ${50+Math.sin(t)*a},300 ${50-Math.cos(t*.7)*a},500 50 S800 ${50+Math.sin(t*.8+1)*a},1000 50 L1000 100 L0 100 Z`);
  });
  return <svg {...props} ref={ref} viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true" style={{display:'block',width:'100%',height:100,...style}}><path ref={path} fill={color} d="M0 50 Q250 35 500 50 T1000 50 V100 H0 Z"/></svg>;
}
