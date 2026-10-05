import React, { useRef, useState } from 'react';
import { clamp } from './motion.js';
import { useAmbientMotion } from './useAmbientMotion.js';

export function OrganicImageCompare({before,after,beforeAlt='Avant',afterAlt='Après',defaultValue=50,value,onValueChange,intensity=.5,speed=1,motionDisabled=false,style,...props}) {
  const [local,setLocal]=useState(defaultValue);
  const position=clamp(value??local,0,100),ref=useRef(null),image=useRef(null);
  useAmbientMotion(ref,motionDisabled,time=>{
    const t=time*clamp(speed,.2,3),amplitude=Math.min(position,100-position,clamp(intensity)*3);
    const edge=Array.from({length:31},(_,i)=>`${position+Math.sin(i/30*Math.PI*3+t)*amplitude}% ${i/30*100}%`).join(',');
    image.current.style.clipPath=`polygon(0 0,${edge},0 100%)`;
  });
  return <div {...props} ref={ref} style={{width:'100%',...style}}>
    <div style={{position:'relative',height:320,overflow:'hidden',borderRadius:18}}>
      <img src={after} alt={afterAlt} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
      <img ref={image} src={before} alt={beforeAlt} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',clipPath:`inset(0 ${100-position}% 0 0)`}}/>
      <span aria-hidden="true" style={{position:'absolute',bottom:20,left:20,color:'white',background:'#203b35bb',padding:'6px 12px',borderRadius:20}}>Avant</span>
      <span aria-hidden="true" style={{position:'absolute',bottom:20,right:20,color:'white',background:'#203b35bb',padding:'6px 12px',borderRadius:20}}>Après</span>
    </div>
    <label style={{display:'grid',gap:10,marginTop:20,fontSize:12}}>Comparer les images · {Math.round(position)} %
      <input type="range" aria-label="Position de la comparaison" min="0" max="100" value={position} onChange={e=>{const next=Number(e.target.value);setLocal(next);onValueChange?.(next)}} style={{width:'100%',accentColor:'#547b69'}}/>
    </label>
  </div>;
}
