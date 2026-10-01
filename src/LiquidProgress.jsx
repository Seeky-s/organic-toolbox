import React, { useId, useRef } from 'react';
import { clamp } from './motion.js';
import { useAmbientMotion } from './useAmbientMotion.js';

export function LiquidProgress({value=0,max=100,label='Progression',color='#547b69',intensity=.5,speed=1,motionDisabled=false,style,...props}) {
  const ref=useRef(null), wave=useRef(null), id=`progress-${useId().replace(/:/g,'')}`;
  const limit=Number.isFinite(max)&&max>0?max:100, amount=clamp(value,0,limit), ratio=amount/limit;
  const draw=time=>{
    const t=time*clamp(speed,.2,3)*1.4, y=200*(1-ratio), a=(ratio===0||ratio===1)?0:clamp(intensity)*12;
    wave.current.setAttribute('d',`M0 ${y} C50 ${y+Math.sin(t)*a},100 ${y-Math.cos(t)*a},150 ${y} S250 ${y+Math.cos(t+.7)*a},300 ${y} V200 H0 Z`);
  };
  useAmbientMotion(ref,motionDisabled||ratio===0||ratio===1,draw);
  return <div {...props} ref={ref} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={limit} aria-valuenow={amount} style={{position:'relative',width:'100%',maxWidth:300,aspectRatio:'3 / 2',...style}}>
    <svg aria-hidden="true" viewBox="0 0 300 200" style={{display:'block',width:'100%',height:'100%'}}><defs><clipPath id={id}><rect width="300" height="200" rx="24"/></clipPath></defs><g clipPath={`url(#${id})`}><rect width="300" height="200" fill="#dce3d5"/><path ref={wave} fill={color} d={`M0 ${200*(1-ratio)} H300 V200 H0 Z`}/></g></svg>
    <span aria-hidden="true" style={{position:'absolute',inset:0,display:'grid',placeItems:'center',fontSize:36,fontVariantNumeric:'tabular-nums',color:'#172f28',textShadow:'0 1px 5px #ffffffaa'}}>{Math.round(ratio*100)}%</span>
  </div>;
}
