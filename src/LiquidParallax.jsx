import React, { useEffect, useRef, useState } from 'react';
import { LiquidParallax as Engine } from './engine.js';

/** A React image container. depth/liquid: 0–1; children remain interactive. */
export function LiquidParallax({ src, alt = '', depth = .45, liquid = .55, paused = false, children, style, ...props }) {
  const host=useRef(null), canvas=useRef(null), engine=useRef(null);
  const [ready,setReady]=useState(false);
  const settings=useRef({depth,liquid,paused}); settings.current={depth,liquid,paused};
  useEffect(()=>{
    let cancelled=false; setReady(false);
    const image=new Image(); image.crossOrigin='anonymous'; image.src=src;
    image.onload=()=>{
      if(cancelled)return;
      try { engine.current=new Engine(canvas.current,host.current,image); Object.assign(engine.current,settings.current);engine.current.draw();setReady(true); }
      catch(error){ console.warn('LiquidParallax: using static image fallback',error); }
    };
    return ()=>{cancelled=true;image.onload=null;engine.current?.destroy();engine.current=null;};
  },[src]);
  useEffect(()=>{if(engine.current){Object.assign(engine.current,{depth:Math.max(0,Math.min(1,depth)),liquid:Math.max(0,Math.min(1,liquid)),paused});engine.current.renderStatic();}},[depth,liquid,paused]);
  return <div {...props} ref={host} style={{...style,position:'relative',isolation:'isolate',overflow:'hidden',touchAction:'pan-y'}}>
    <img src={src} alt={alt} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:-2}}/>
    <canvas ref={canvas} aria-hidden="true" style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:-1,opacity:ready?1:0,pointerEvents:'none'}}/>
    {children}
  </div>;
}
