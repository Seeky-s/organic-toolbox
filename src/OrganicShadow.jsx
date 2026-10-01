import React, { useRef } from 'react';
import { clamp } from './motion.js';
import { useAmbientMotion } from './useAmbientMotion.js';

export function OrganicShadow({children,color='#425d46',intensity=.5,speed=1,motionDisabled=false,style,...props}) {
  const ref=useRef(null), shadow=useRef(null);
  useAmbientMotion(ref,motionDisabled,time=>{
    const t=time*clamp(speed,.2,3)*.55,k=clamp(intensity);
    shadow.current.style.transform=`translate(${Math.sin(t)*22*k}px,${12+Math.cos(t*.7)*12*k}px) rotate(${Math.sin(t*.8)*6*k}deg) scale(${1+Math.sin(t*.9)*.13*k},${1+Math.cos(t*.6)*.18*k})`;
    shadow.current.style.borderRadius=`${38+Math.sin(t)*14*k}% 48% ${35+Math.cos(t)*15*k}% 45%`;
  });
  return <div {...props} ref={ref} style={{position:'relative',isolation:'isolate',...style}}><div ref={shadow} aria-hidden="true" style={{position:'absolute',inset:'12% -3% -8%',background:color,opacity:.32,filter:'blur(22px)',borderRadius:'38% 48% 35% 45%',zIndex:-1,pointerEvents:'none'}}/>{children}</div>;
}
