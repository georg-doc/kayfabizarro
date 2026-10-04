/* KFB Eye Sequence Runner v1
   Renderer-neutral dispatcher. It calls only public semantic EyeRig methods.
   No geometry, Three.js, SVG or host-specific knowledge lives here. */
(function(global){
  class EyeSequenceRunner{
    constructor(opts={}){
      this.targets=opts.targets||[];
      this.library=opts.library||{clips:{}};
      this.sequence=opts.sequence||this.library.sequence||Object.keys(this.library.clips||{});
      this.loop=opts.loop!==false;
      this.onStep=opts.onStep||(()=>{});
      this.onCommand=opts.onCommand||(()=>{});
      this.onError=opts.onError||(()=>{});
      this.playing=false;this.index=0;this.elapsed=0;this.commandIndex=0;this.started=false;
    }
    setTargets(t){this.targets=(t||[]).filter(Boolean);return this;}
    currentName(){return this.sequence[this.index]||null;}
    currentClip(){return (this.library.clips||{})[this.currentName()]||null;}
    _invoke(target,cmd){
      const fn=target&&target[cmd.method];
      if(typeof fn!=='function'){this.onError({target,cmd,error:'missing method '+cmd.method});return;}
      try{
        if(cmd.args===undefined)fn.call(target);
        else if(Array.isArray(cmd.args))fn.apply(target,cmd.args);
        else fn.call(target,cmd.args);
        this.onCommand({target,cmd,step:this.currentName()});
      }catch(error){this.onError({target,cmd,error});}
    }
    _enter(){
      this.elapsed=0;this.commandIndex=0;this.started=true;
      this.onStep({index:this.index,name:this.currentName(),clip:this.currentClip()});
      this._dispatchDue();
    }
    _dispatchDue(){
      const clip=this.currentClip();if(!clip)return;
      const cmds=clip.commands||[];
      while(this.commandIndex<cmds.length && (cmds[this.commandIndex].at||0)<=this.elapsed+1e-9){
        const cmd=cmds[this.commandIndex++];
        for(const target of this.targets)this._invoke(target,cmd);
      }
    }
    play(){if(!this.started)this._enter();this.playing=true;return this;}
    pause(){this.playing=false;return this;}
    restart(){this.index=0;this._enter();this.playing=true;return this;}
    next(){
      this.index++;
      if(this.index>=this.sequence.length)this.index=this.loop?0:this.sequence.length-1;
      this._enter();return this;
    }
    previous(){
      this.index--;if(this.index<0)this.index=this.loop?this.sequence.length-1:0;
      this._enter();return this;
    }
    update(dt){
      if(!this.playing)return;
      const clip=this.currentClip();if(!clip)return;
      this.elapsed+=Math.max(0,dt||0);this._dispatchDue();
      if(this.elapsed>=Math.max(.01,clip.duration||.5)){
        if(this.index===this.sequence.length-1 && !this.loop){this.playing=false;return;}
        this.next();
      }
    }
  }
  global.KFBEyeSequenceRunner=EyeSequenceRunner;
})(window);
