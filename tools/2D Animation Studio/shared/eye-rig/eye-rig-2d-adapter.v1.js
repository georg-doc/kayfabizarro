/* KFB EyeRig 2D Adapter v1
   Renderer adapter for the shared kfb.eye-rig.protocol/1 control surface.
   It intentionally mirrors the public EyeRig-v6 calls used by the 3D stack.
   Source geometry remains owned by the host SVG; this adapter only transforms wrapper nodes.\n   v1.1 proof fallback: pupil wrapper follows vertical blink compression so pupils do not float outside a closed 2D eye. */
(function(global){
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const pick=(v,i)=>Array.isArray(v)?(v[i]!=null?v[i]:(v[0]||0)):(v||0);
  class EyeRig2D{
    constructor(opts={}){
      this.nodes=opts.nodes||{};
      this.frame=opts.frame||{};
      this.apply=opts.applyTransform||(()=>{});
      this.maxTrack=opts.maxTrack!=null?opts.maxTrack:2.2;
      this.blink=Object.assign({minGap:2.5,maxGap:6.5,dur:.12},opts.blink||{});
      this.life=Object.assign({on:true,wander:.45,tremor:.35},opts.life||{});
      this.kinetics=Object.assign({enabled:true,gain:1},opts.kinetics||{});
      this.emote={lidUpper:0,lidLower:0,slant:0,pupil:'normal',gaze:'front'};
      this._pt={x:0,y:0}; this._follow=false;
      this._p=[{x:0,y:0,vx:0,vy:0},{x:0,y:0,vx:0,vy:0}];
      this._blinkT=1.8; this._blinkK=-1; this._t=0; this._gen=1;
      this._kinT={a:0,c:0,j:0}; this._kin={a:0,c:0,j:0};
    }
    eyeFrame(){
      return {
        left:this.frame.left||null,right:this.frame.right||null,radius:this.frame.radius||0,
        parent:this.frame.parent||null,rig:this.frame.rig||null,gen:this._gen,
        unit:this.frame.unit||((this.frame.radius||1)/.30)
      };
    }
    setBlink(p){Object.assign(this.blink,p||{});}
    blinkNow(){if(this._blinkK<0)this._blinkK=0;}
    setGazeFollow(on){this._follow=!!on;}
    pointTo(nx,ny){this._pt={x:clamp(nx,-1,1),y:clamp(ny,-1,1)};}
    applyEmote(e){this.emote=Object.assign({lidUpper:0,lidLower:0,slant:0,pupil:'normal',gaze:'front'},e||{});}
    setKinetics(k){k=k||{};for(const q of ['a','c','j'])if(k[q]!=null)this._kinT[q]=clamp(k[q],-1.5,1.5);if(k.enabled!=null)this.kinetics.enabled=!!k.enabled;if(k.gain!=null)this.kinetics.gain=k.gain;}
    setLife(p){Object.assign(this.life,p||{});}
    update(dt){
      this._t+=dt; const E=this.emote,K=this._kin,KT=this._kinT,kr=Math.min(1,dt*7);
      K.a+=(KT.a-K.a)*kr;K.c+=(KT.c-K.c)*kr;K.j+=(KT.j-K.j)*kr;
      const kg=this.kinetics.enabled?this.kinetics.gain:0,kinAct=clamp((Math.abs(K.a)+Math.abs(K.c)+Math.abs(K.j))*kg,0,1);
      let gx=this._pt.x,gy=this._pt.y;
      if(!this._follow){
        if(kinAct>.2&&kg>0){gx=clamp(-K.c*1.1,-1,1)*kg;gy=clamp(-K.j*.7+K.a*.25,-1,1)*kg;}
        else if(E.gaze==='away'){gx=.78;gy=.18;}
        else if(E.gaze==='down'){gx=0;gy=-.82;}
      }
      const la=(this.life.on?1:0)*(1-kinAct*.85),t=this._t;
      for(let i=0;i<2;i++){
        const wander=la*this.life.wander*(Math.sin(t*.37+i*2.1)*.18+Math.sin(t*.71+i*4.4)*.08);
        const trem=la*this.life.tremor*Math.sin(t*11.3+i*3.2)*.025;
        const tx=(gx+wander+trem)*this.maxTrack,ty=(gy+Math.cos(t*.29+i)*.05*la)*this.maxTrack;
        const p=this._p[i],a=Math.min(1,dt*9);p.x+=(tx-p.x)*a;p.y+=(ty-p.y)*a;
      }
      this._blinkT-=dt;
      if(this._blinkK<0&&this._blinkT<=0){this._blinkK=0;this._blinkT=this.blink.minGap+((Math.sin(this._t*1.731)+1)*.5)*Math.max(.1,this.blink.maxGap-this.blink.minGap);}
      let bl=0;if(this._blinkK>=0){this._blinkK+=dt/Math.max(.05,this.blink.dur);bl=Math.sin(Math.min(this._blinkK,1)*Math.PI);if(this._blinkK>=1)this._blinkK=-1;}
      const wide=E.pupil==='wide'?1.18:1;
      const eyes=[this.nodes.eyeA,this.nodes.eyeB],pup=[this.nodes.pupilA,this.nodes.pupilB];
      for(let i=0;i<2;i++){
        const u=pick(E.lidUpper,i),l=pick(E.lidLower,i),sl=pick(E.slant,i);
        const lidClose=clamp((Math.max(0,u)+Math.max(0,l))*.45,0,.55);
        const sy=Math.max(.06,1-bl*.92-lidClose);
        this.apply(eyes[i],{sx:1,sy,r:sl*7});
        this.apply(pup[i],{x:this._p[i].x,y:-this._p[i].y,sx:wide,sy:wide*sy});
      }
    }
  }
  global.KFBEyeRig2D=EyeRig2D;
})(window);
