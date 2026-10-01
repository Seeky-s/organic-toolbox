import React, { useRef } from 'react';
import { clamp } from './motion.js';
import { useAmbientMotion } from './useAmbientMotion.js';

export function OrganicSpotlight({src,alt='',children,intensity=.5,speed=1,motionDisabled=false,style,...props}) {
  const ref=useRef(null), light=useRef(null);
  useAmbientMotion(ref,motionDisabled,time=>{
    const t=time*clamp(speed,.2,3)*.35,k=clamp(intensity);
    light.current.style.background=`radial-gradient(ellipse at ${50+Math.sin(t)*32*k}% ${45+Math.cos(t*.8)*25*k}%, transparent 5%, rgba(9,26,25,${.35+k*.4}) 76%)`;
  });
  return <div {...props} ref={ref} style={{position:'relative',isolation:'isolate',overflow:'hidden',minHeight:300,background:'#263e39',...style}}><img src={src} alt={alt} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:-2}}/><div ref={light} aria-hidden="true" style={{position:'absolute',inset:0,zIndex:-1,pointerEvents:'none',background:'radial-gradient(ellipse at 50% 45%, transparent, #091a19aa)'}}/>{children}</div>;
}
