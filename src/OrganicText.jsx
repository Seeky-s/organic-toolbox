import React, { useEffect, useRef } from 'react';
import { clamp, useReducedMotion, useMotionFrame, useOrganicPointer } from './motion.js';

export function OrganicText({children,intensity=.5,speed=1,motionDisabled=false,as:Tag='span',style,...props}) {
  const ref=useRef(null);const reduced=useReducedMotion(),stopped=reduced||motionDisabled;
  const {target,handlers}=useOrganicPointer(stopped);const energy=useRef(0),active=useRef(false);
  const text=String(children??'');
  useMotionFrame(ref,!stopped,(time,dt)=>{
    energy.current+=((active.current?1:0)-energy.current)*(1-Math.exp(-dt*6));
    const letters=ref.current.querySelectorAll('[data-letter]');
    letters.forEach((letter,i)=>{
      const position=letters.length>1?i/(letters.length-1)*2-1:0;
      const proximity=Math.exp(-Math.pow(position-target.current.x,2)*3);
      const wave=Math.sin(time*clamp(speed,.2,3)*2.2-i*.55)*clamp(intensity)*energy.current*proximity;
      letter.style.transform=`translateY(${wave*12}px) rotate(${wave*5}deg)`;
    });
  });
  useEffect(()=>{if(stopped)ref.current?.querySelectorAll('[data-letter]').forEach(el=>el.style.transform='none');},[stopped]);
  return <Tag {...props} ref={ref} aria-label={text} onPointerMove={e=>{active.current=true;handlers.onPointerMove(e)}} onPointerLeave={()=>{active.current=false;handlers.onPointerLeave()}} style={{display:'inline-block',...style}}><span aria-hidden="true">{text.split(/(\s+)/).map((word,w)=>/^\s+$/.test(word)?word:<span key={w} style={{display:'inline-block',whiteSpace:'nowrap'}}>{Array.from(word).map((char,i)=><span key={i} data-letter style={{display:'inline-block'}}>{char}</span>)}</span>)}</span></Tag>;
}
