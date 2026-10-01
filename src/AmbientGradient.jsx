import React, { useRef, useEffect } from 'react';
import { clamp, useReducedMotion, useMotionFrame } from './motion.js';

export function AmbientGradient({children,intensity=.5,speed=1,motionDisabled=false,colors=['#203f47','#89aa91','#d8b18c'],style,...props}) {
  const ref=useRef(null),layer=useRef(null);const reduced=useReducedMotion(),stopped=reduced||motionDisabled;
  useMotionFrame(ref,!stopped,time=>{const t=time*clamp(speed,.2,3)*.35,k=clamp(intensity);Array.from(layer.current.children).forEach((el,i)=>{el.style.transform=`translate(${Math.sin(t+i*2)*22*k}%, ${Math.cos(t*.8+i*1.7)*24*k}%) scale(${1+Math.sin(t+i)*.12*k})`;});});
  useEffect(()=>{if(stopped)Array.from(layer.current.children).forEach(el=>el.style.transform='none');},[stopped]);
  return <div {...props} ref={ref} style={{position:'relative',isolation:'isolate',overflow:'hidden',background:colors[0],...style}}><div ref={layer} aria-hidden="true" style={{position:'absolute',inset:'-20%',zIndex:-1,filter:'blur(45px)',pointerEvents:'none'}}>{colors.slice(0,3).map((color,i)=><div key={i} style={{position:'absolute',width:'85%',height:'95%',left:`${i*25-10}%`,top:`${i%2*35-20}%`,borderRadius:'45% 55% 65% 35%',background:color,opacity:.85}}/>)}</div>{children}</div>;
}
