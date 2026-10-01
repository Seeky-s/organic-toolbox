const vertex = `attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision mediump float;
varying vec2 uv;
uniform sampler2D photo;
uniform vec2 resolution, imageSize, pointer;
uniform float time, depth, liquid;
uniform vec4 waves[12];
void main(){
  float aspect=resolution.x/resolution.y;
  vec2 p=uv;
  vec2 offset=vec2(0.);
  for(int i=0;i<12;i++){
    float age=time-waves[i].z;
    vec2 delta=(uv-waves[i].xy)*vec2(aspect,1.);
    float distance=length(delta);
    float front=distance-age*.23;
    float envelope=exp(-front*front*110.)*exp(-age*1.6)*waves[i].w;
    float ripple=sin(front*42.)*envelope*.015;
    offset+=delta/max(distance,.001)/vec2(aspect,1.)*ripple;
  }
  // Slow refraction; motion is paused completely for reduced-motion preference.
  offset+=vec2(sin(uv.y*9.+time*.65)*cos(uv.x*5.-time*.3),cos(uv.x*8.+time*.5)*sin(uv.y*6.+time*.3))*.003;
  p+=offset*liquid;
  // Simulated depth increases near the lower portion of the image.
  p+=(pointer-.5)*depth*.065*(.45+.55*(1.-uv.y));
  p=(p-.5)*.86+.5;
  float imageAspect=imageSize.x/imageSize.y;
  vec2 cover=vec2(min(1.,aspect/imageAspect),min(1.,imageAspect/aspect));
  p=(p-.5)*cover+.5;
  gl_FragColor=texture2D(photo,clamp(p,vec2(.001),vec2(.999)));
}`;

export class LiquidParallax {
  constructor(canvas, host, image) {
    this.canvas=canvas; this.host=host; this.depth=.45; this.liquid=.55; this.paused=false;
    this.time=0; this.last=0; this.cursor=[.5,.5]; this.target=[.5,.5]; this.waves=new Float32Array(48);
    this.nextWave=0; this.lastWave=-1; this.visible=true; this.dead=false;
    this.motion=matchMedia('(prefers-reduced-motion: reduce)');
    const gl=this.gl=canvas.getContext('webgl',{alpha:false,antialias:false});
    if(!gl) throw Error('WebGL unavailable');
    const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
    this.program=gl.createProgram();
    for(const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){const s=shader(type,source);gl.attachShader(this.program,s);gl.deleteShader(s);}
    gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(this.program));
    gl.useProgram(this.program);
    this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const a=gl.getAttribLocation(this.program,'position');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    this.uniform=Object.fromEntries(['resolution','imageSize','pointer','time','depth','liquid','waves[0]'].map(name=>[name,gl.getUniformLocation(this.program,name)]));
    this.texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    this.setImage(image);
    this.abort=new AbortController();const on=(el,name,fn)=>el.addEventListener(name,fn,{signal:this.abort.signal});
    const locate=e=>{const r=host.getBoundingClientRect();this.target=[Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,1-(e.clientY-r.top)/r.height))];};
    on(host,'pointermove',e=>{locate(e);if(this.time-this.lastWave>.065)this.addWave(.65);});
    on(host,'pointerdown',e=>{locate(e);this.addWave(1.8);});
    on(host,'pointerleave',()=>{this.target=[.5,.5];});
    on(host,'pointerup',e=>{if(e.pointerType!=='mouse')this.target=[.5,.5];});
    on(host,'pointercancel',()=>{this.target=[.5,.5];});
    on(this.motion,'change',()=>{this.cursor=[.5,.5];this.target=[.5,.5];this.waves.fill(0);this.draw();});
    on(canvas,'webglcontextlost',e=>{e.preventDefault();this.dead=true;cancelAnimationFrame(this.frame);this.canvas.style.visibility='hidden';});
    this.resize=new ResizeObserver(()=>{const r=host.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);this.draw();});this.resize.observe(host);
    this.observer=new IntersectionObserver(([e])=>{this.visible=e.isIntersecting;});this.observer.observe(host);
    this.tick=now=>{if(this.dead)return;const dt=Math.min((now-(this.last||now))/1000,.05);this.last=now;if(this.visible&&!document.hidden&&!this.paused&&!this.motion.matches){this.time+=dt;const ease=1-Math.exp(-dt*5);for(let i=0;i<2;i++)this.cursor[i]+=(this.target[i]-this.cursor[i])*ease;this.draw();}this.frame=requestAnimationFrame(this.tick);};
    this.frame=requestAnimationFrame(this.tick);
  }
  addWave(power){if(this.paused||this.motion.matches)return;this.waves.set([...this.target,this.time,power],this.nextWave*4);this.nextWave=(this.nextWave+1)%12;this.lastWave=this.time;}
  setImage(image){
    const gl=this.gl;const max=Math.min(4096,gl.getParameter(gl.MAX_TEXTURE_SIZE));
    const w=image.naturalWidth||image.width,h=image.naturalHeight||image.height;
    const scaled=document.createElement('canvas');const ratio=Math.min(1,max/Math.max(w,h));scaled.width=Math.max(1,Math.round(w*ratio));scaled.height=Math.max(1,Math.round(h*ratio));scaled.getContext('2d').drawImage(image,0,0,scaled.width,scaled.height);
    gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,scaled);this.imageSize=[w,h];this.draw();
  }
  renderStatic(){if(this.paused||this.motion.matches)this.draw();}
  draw(){const gl=this.gl,u=this.uniform;if(!this.imageSize)return;const calm=this.motion.matches;gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.uniform2f(u.resolution,this.canvas.width,this.canvas.height);gl.uniform2fv(u.imageSize,this.imageSize);gl.uniform2fv(u.pointer,calm?[.5,.5]:this.cursor);gl.uniform1f(u.time,this.time);gl.uniform1f(u.depth,calm?0:this.depth);gl.uniform1f(u.liquid,calm?0:this.liquid);gl.uniform4fv(u['waves[0]'],this.waves);gl.drawArrays(gl.TRIANGLES,0,6);this.host.style.transform=calm?'none':`perspective(1500px) rotateX(${(this.cursor[1]-.5)*this.depth*5}deg) rotateY(${(this.cursor[0]-.5)*this.depth*5}deg)`;}
  destroy(){this.dead=true;cancelAnimationFrame(this.frame);this.abort.abort();this.resize.disconnect();this.observer.disconnect();this.gl.deleteTexture(this.texture);this.gl.deleteBuffer(this.buffer);this.gl.deleteProgram(this.program);this.host.style.transform='';}
}
