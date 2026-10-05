import React, { useRef } from 'react';
import { clamp } from './motion.js';
import { useAmbientMotion } from './useAmbientMotion.js';

export function OrganicSkeleton({label='Chargement du contenu',intensity=.5,speed=1,motionDisabled=false,style,...props}) {
  const ref=useRef(null),light=useRef(null);
  useAmbientMotion(ref,motionDisabled,time=>{
    const t=time*clamp(speed,.2,3)*.65,k=clamp(intensity);
    light.current.style.background=`radial-gradient(ellipse at ${50+Math.sin(t)*45*k}% ${50+Math.cos(t*.7)*35*k}%, rgba(255,255,245,${.25+k*.6}), transparent 65%)`;
  });
  return <div {...props} ref={ref} role="status" aria-label={label} style={{width:'100%',...style}}><div aria-hidden="true" style={{position:'relative',overflow:'hidden',padding:22,background:'#edf0e6',borderRadius:18}}><div style={{height:150,background:'#cbd5c2',borderRadius:'16px 22px 14px 20px'}}/><div style={{height:16,width:'70%',background:'#cbd5c2',borderRadius:8,marginTop:22}}/><div style={{height:12,width:'90%',background:'#d8dfd1',borderRadius:8,marginTop:14}}/><div style={{height:12,width:'55%',background:'#d8dfd1',borderRadius:8,marginTop:10}}/><div ref={light} style={{position:'absolute',inset:0,pointerEvents:'none'}}/></div></div>;
}
