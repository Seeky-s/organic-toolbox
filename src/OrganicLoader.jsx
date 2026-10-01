import React, { useId, useRef, useEffect } from 'react';
import { clamp, useReducedMotion, useMotionFrame } from './motion.js';

export function OrganicLoader({label='Chargement…',intensity=.5,speed=1,motionDisabled=false,color='#426751',style,...props}) {
  const ref=useRef(null),dots=useRef(null),id='goo'+useId().replace(/:/g,'');const reduced=useReducedMotion(),stopped=reduced||motionDisabled;
  useMotionFrame(ref,!stopped,time=>{const t=time*clamp(speed,.2,3)*1.8;Array.from(dots.current.children).forEach((el,i)=>{const phase=t+i*Math.PI*2/3;el.setAttribute('cx',String(90+Math.cos(phase)*(17+clamp(intensity)*25)));el.setAttribute('cy',String(50+Math.sin(phase*2)*12*clamp(intensity)));});});
  useEffect(()=>{if(stopped)Array.from(dots.current.children).forEach((el,i)=>{el.setAttribute('cx',String(60+i*30));el.setAttribute('cy','50');});},[stopped]);
  return <div {...props} ref={ref} role="status" style={{display:'inline-flex',alignItems:'center',flexDirection:'column',gap:8,...style}}><svg aria-hidden="true" width="180" height="100" viewBox="0 0 180 100"><defs><filter id={id} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation="5"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -9"/></filter></defs><g ref={dots} fill={color} filter={`url(#${id})`}>{[60,90,120].map(x=><circle key={x} cx={x} cy="50" r="17"/>)}</g></svg><span>{label}</span></div>;
}
