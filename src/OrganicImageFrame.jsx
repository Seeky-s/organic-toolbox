import React, { useRef } from 'react';
import { clamp } from './motion.js';
import { useAmbientMotion } from './useAmbientMotion.js';

export function OrganicImageFrame({src,alt='',intensity=.5,speed=1,motionDisabled=false,style,...props}) {
  const ref=useRef(null),frame=useRef(null);
  useAmbientMotion(ref,motionDisabled,time=>{
    const t=time*clamp(speed,.2,3)*.6,k=clamp(intensity);
    frame.current.style.borderRadius=`${10+Math.sin(t)*8*k}% ${16+Math.cos(t*.7)*12*k}% ${12-Math.sin(t)*8*k}% ${18-Math.cos(t*.8)*12*k}% / ${16+Math.sin(t*.8)*12*k}% ${12+Math.cos(t)*8*k}% ${18-Math.sin(t*.7)*12*k}% ${10-Math.cos(t)*8*k}%`;
  });
  return <div {...props} ref={ref} style={{width:'100%',aspectRatio:'4 / 3',...style}}><img ref={frame} src={src} alt={alt} style={{display:'block',width:'100%',height:'100%',objectFit:'cover',borderRadius:'10% 16% 12% 18% / 16% 12% 18% 10%'}}/></div>;
}
