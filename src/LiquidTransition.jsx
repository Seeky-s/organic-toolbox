import React, { useEffect, useRef, useState } from 'react';
import { clamp, useReducedMotion } from './motion.js';

/** Change transitionKey to reveal a new child. Intermediate requests cancel safely. */
export function LiquidTransition({children,transitionKey,duration=1100,motionDisabled=false,color='#90a78b',style,...props}) {
  const reduced=useReducedMotion(),cover=useRef(null),latest=useRef(children),previous=useRef(transitionKey);
  const [shown,setShown]=useState(children),[busy,setBusy]=useState(false);latest.current=children;
  useEffect(()=>{
    if(previous.current===transitionKey){setShown(latest.current);setBusy(false);return;}
    previous.current=transitionKey;
    if(reduced||motionDisabled){setShown(latest.current);setBusy(false);return;}
    const ms=clamp(duration,300,3000);setBusy(true);
    const animation=cover.current.animate([
      {transform:'translate(-50%, -50%) scale(0) rotate(-35deg)',borderRadius:'38% 62% 55% 45%'},
      {transform:'translate(-50%, -50%) scale(1.6) rotate(0deg)',borderRadius:'50%',offset:.48},
      {transform:'translate(-50%, -50%) scale(1.6) rotate(5deg)',borderRadius:'50%',offset:.52},
      {transform:'translate(-50%, -50%) scale(0) rotate(35deg)',borderRadius:'55% 45% 38% 62%'}
    ],{duration:ms,easing:'cubic-bezier(.65,0,.35,1)'});
    const swap=setTimeout(()=>setShown(latest.current),ms/2);
    animation.onfinish=()=>setBusy(false);
    return()=>{clearTimeout(swap);animation.cancel();};
  },[transitionKey,reduced,motionDisabled,duration]);
  return <div {...props} aria-busy={busy} style={{position:'relative',overflow:'hidden',isolation:'isolate',...style}}>{shown}<div ref={cover} aria-hidden="true" style={{pointerEvents:'none',position:'absolute',left:'50%',top:'50%',width:'150%',height:'300%',background:color,transform:'translate(-50%, -50%) scale(0)',zIndex:2,borderRadius:'40% 60% 50% 50%'}}/></div>;
}
