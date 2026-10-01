import React, { useEffect, useRef } from 'react';
import { useReducedMotion, useMotionFrame } from './motion.js';
import { organicContour, restingContour } from './organicContour.js';

export function OrganicSurface({children,intensity=.5,speed=1,motionDisabled=false,style,...props}) {
  const ref=useRef(null), skin=useRef(null);const reduced=useReducedMotion();const stopped=reduced||motionDisabled;
  useMotionFrame(ref,!stopped,time=>{
    Object.assign(skin.current.style, organicContour(time,intensity,speed));
  });
  useEffect(()=>{if(stopped&&skin.current){skin.current.style.borderRadius=restingContour;skin.current.style.transform='none';}},[stopped]);
  return <div {...props} ref={ref} style={{padding:48,position:'relative',isolation:'isolate',...style}}><div ref={skin} aria-hidden="true" style={{position:'absolute',inset:0,zIndex:-1,background:'var(--organic-surface-color, #d5debc)',borderRadius:restingContour,pointerEvents:'none'}}/>{children}</div>;
}
