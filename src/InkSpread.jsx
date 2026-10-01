import React, { useId, useRef } from 'react';
import { clamp } from './motion.js';
import { useAmbientMotion } from './useAmbientMotion.js';

export function InkSpread({children,color='#384f58',intensity=.5,speed=1,motionDisabled=false,style,...props}) {
  const ref=useRef(null), ink=useRef(null), noise=useRef(null), id=`ink-${useId().replace(/:/g,'')}`;
  useAmbientMotion(ref,motionDisabled,time=>{
    const t=time*clamp(speed,.2,3)*.3,k=clamp(intensity);
    ink.current.setAttribute('transform',`translate(300 200) scale(${1+Math.sin(t)*.22*k} ${1+Math.sin(t*.7)*.18*k}) rotate(${Math.sin(t*.5)*8*k}) translate(-300 -200)`);
    noise.current.setAttribute('baseFrequency',String(.018+Math.sin(t*.6)*.005*k));
  });
  return <div {...props} ref={ref} style={{position:'relative',isolation:'isolate',overflow:'hidden',minHeight:240,background:'#eee8d8',...style}}>
    <svg aria-hidden="true" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:-1,pointerEvents:'none'}}>
      <defs><filter id={id} x="-40%" y="-40%" width="180%" height="180%"><feTurbulence ref={noise} type="fractalNoise" baseFrequency=".018" numOctaves="3" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale={22+clamp(intensity)*38}/><feGaussianBlur stdDeviation="1.2"/></filter></defs>
      <g ref={ink} fill={color} filter={`url(#${id})`}><ellipse cx="290" cy="200" rx="155" ry="116" opacity=".16"/><ellipse cx="305" cy="194" rx="130" ry="99" opacity=".3"/><ellipse cx="282" cy="202" rx="104" ry="90" opacity=".65"/><ellipse cx="364" cy="175" rx="54" ry="64" opacity=".35"/></g>
    </svg>{children}
  </div>;
}
