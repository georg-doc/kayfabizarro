import { MusicClock, BOUNDARIES } from '../adaptive-music-proof-01/music-clock.mjs';
import { validateContext, resolveFamily } from './music-resolver.mjs';

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number(v)||0));
const roleMap=stems=>Object.fromEntries(stems.map(s=>[s.role,s]));

export class KfbAudioRuntime {
  constructor({audioContext,destination,assetBaseUrl,fetchImpl=globalThis.fetch,registry,onError=()=>{}}={}){
    if(!audioContext) throw new Error('KFB Audio Runtime requires injected audioContext');
    if(!registry) throw new Error('KFB Audio Runtime requires registry');
    if(typeof fetchImpl!=='function') throw new Error('fetchImpl required');
    this.ctx=audioContext;
    this.destination=destination||audioContext.destination;
    this.base=assetBaseUrl;
    this.fetch=fetchImpl;
    this.registry=registry;
    this.onError=onError;
    this.graph=this.#graph();
    this.current=null;
    this.context=null;
    this.functionState='STAYING';
    this.familyId=null;
    this.seq=-1;
    this.speechFocus=false;
    this.log=[];
    this.errors=[];
  }

  #graph(){
    const master=this.ctx.createGain(), eq=this.ctx.createBiquadFilter(), music=this.ctx.createGain();
    eq.type='peaking'; eq.frequency.value=2200; eq.Q.value=.85; eq.gain.value=0;
    music.gain.value=.86; music.connect(eq); eq.connect(master); master.connect(this.destination);
    return {master,eq,music};
  }

  #url(path){
    if(typeof this.base==='function') return this.base(path);
    if(!this.base) return path;
    return new URL(path,this.base).href;
  }

  #record(type,extra={}){this.log.push({type,time:this.ctx.currentTime,...extra});if(this.log.length>120)this.log.shift()}

  async #decode(path){
    const r=await this.fetch(this.#url(path));
    if(!r.ok) throw new Error(path+' HTTP '+r.status);
    return this.ctx.decodeAudioData(await r.arrayBuffer());
  }

  async loadFamily(id,{startDelay=.16}={}){
    const family=this.registry.families?.[id];
    if(!family||family.status!=='SITE_RUNTIME_VERIFIED') throw new Error('Family not runtime verified: '+id);
    await this.stopFamily();
    const loaded=await Promise.all(family.stems.map(async s=>({stem:s,buffer:await this.#decode(family.folder+'/'+s.file)})));
    const durations=loaded.map(x=>x.buffer.duration),min=Math.min(...durations),max=Math.max(...durations);
    const epoch=this.ctx.currentTime+startDelay;
    const clock=new MusicClock({bpm:family.bpm,beatsPerBar:family.beatsPerBar||4,phraseBars:family.phraseBars||8,epoch});
    const voices=new Map();
    for(const {stem,buffer} of loaded){
      const gain=this.ctx.createGain();
      gain.gain.value=Math.max(.0001,stem.default||0);
      gain.connect(this.graph.music);
      const src=this.ctx.createBufferSource();
      src.buffer=buffer; src.loop=true; src.connect(gain); src.start(epoch);
      voices.set(stem.role,{stem,buffer,gain,src});
    }
    this.current={id,family,voices,clock,epoch,durations,deltaMs:(max-min)*1000};
    this.familyId=id;
    this.#record('FAMILY_START',{id,epoch,deltaMs:this.current.deltaMs});
    return this.getEvidence();
  }

  async stopFamily(){
    if(!this.current)return;
    for(const v of this.current.voices.values()){try{v.src.stop();v.src.disconnect();v.gain.disconnect()}catch{}}
    this.#record('FAMILY_STOP',{id:this.current.id});
    this.current=null; this.familyId=null;
  }

  #when(boundary='BAR'){
    if(!this.current)return this.ctx.currentTime+.02;
    const map={NOW:BOUNDARIES.IMMEDIATE,BEAT:BOUNDARIES.NEXT_BEAT,BAR:BOUNDARIES.NEXT_BAR,PHRASE:BOUNDARIES.NEXT_PHRASE};
    return this.current.clock.nextBoundary(this.ctx.currentTime,map[boundary]||BOUNDARIES.NEXT_BAR,.055);
  }

  applyPreset(name,{boundary='BAR'}={}){
    if(!this.current)return null;
    const preset=this.current.family.presets?.[name];
    if(!preset)return null;
    const when=this.#when(boundary);
    for(const [role,v] of this.current.voices) if(Object.hasOwn(preset,role)){
      v.gain.gain.cancelScheduledValues(when);
      v.gain.gain.setTargetAtTime(Math.max(.0001,preset[role]),when,.10);
    }
    this.#record('PRESET',{family:this.current.id,name,boundary,when});
    return when;
  }

  setSpeechFocus(on,{boundary='BEAT'}={}){
    const when=this.#when(boundary), family=this.current?.family, cfg=family?.speechFocus;
    this.speechFocus=!!on;
    if(cfg&&this.current){
      const defaults=roleMap(family.stems);
      for(const [role,v] of this.current.voices){
        let target=defaults[role]?.default||0;
        if(on&&cfg.roleMultipliers?.[role]!=null) target*=cfg.roleMultipliers[role];
        v.gain.gain.cancelScheduledValues(when);v.gain.gain.setTargetAtTime(Math.max(.0001,target),when,.12);
      }
      this.graph.music.gain.cancelScheduledValues(when);
      this.graph.music.gain.setTargetAtTime(on?cfg.musicGain:.86,when,.14);
      this.graph.eq.frequency.setValueAtTime(cfg.eqHz,when);
      this.graph.eq.Q.setValueAtTime(cfg.eqQ,when);
      this.graph.eq.gain.setTargetAtTime(on?cfg.eqGainDb:0,when,.14);
    }
    this.#record('SPEECH_FOCUS',{on:!!on,when});
    return when;
  }

  async setContext(snapshot){
    validateContext(snapshot);
    if(snapshot.seq<=this.seq)return this.getEvidence();
    this.seq=snapshot.seq; this.context=snapshot;
    const r=resolveFamily({context:snapshot,registry:this.registry,previousFunction:this.functionState,previousFamily:this.familyId});
    const changedFunction=r.function!==this.functionState;
    this.functionState=r.function;
    if(r.familyId&&r.familyId!==this.familyId){
      try{await this.loadFamily(r.familyId)}catch(e){this.errors.push(e.message);this.onError(e)}
    }
    if(r.function==='TALKING')this.setSpeechFocus(true,{boundary:'BEAT'});
    else if(this.speechFocus)this.setSpeechFocus(false,{boundary:'BAR'});
    this.#record('CONTEXT',{seq:snapshot.seq,function:r.function,familyId:r.familyId,reason:r.reason,changedFunction});
    return this.getEvidence();
  }

  emit(event){
    if(!event||event.schema!=='kfb.audio.event.v1')throw new Error('Expected kfb.audio.event.v1');
    this.#record('EVENT',{eventType:event.type,seq:event.seq,sourceId:event.sourceId||null,intensity01:clamp(event.intensity01)});
    if(event.type==='DIALOGUE_START')this.setSpeechFocus(true,{boundary:'BEAT'});
    if(event.type==='DIALOGUE_END')this.setSpeechFocus(false,{boundary:'BAR'});
    return this.getEvidence();
  }

  getCapabilities(){
    const verified=Object.entries(this.registry.families||{}).filter(([,v])=>v.status==='SITE_RUNTIME_VERIFIED');
    return {
      schema:'kfb.audio.capabilities.v1',
      contextSchema:'kfb.audio.context.v1',
      eventSchema:'kfb.audio.event.v1',
      createsAudioContext:false,
      adaptiveMusic:true,
      speechFocus:true,
      quantizedTransitions:['NOW','BEAT','BAR','PHRASE'],
      families:verified.map(([id,v])=>({id,title:v.id,functionHints:v.functionHints||[]})),
      functions:[...new Set(verified.flatMap(([,v])=>v.functionHints||[]))]
    };
  }

  getEvidence(){
    return {
      schema:'kfb.audio.evidence.v1',
      contextSeq:this.seq,
      resolvedFunction:this.functionState,
      familyId:this.familyId,
      audioContextState:this.ctx.state,
      createsAudioContext:false,
      clock:this.current?.clock.snapshot(this.ctx.currentTime)||null,
      alignment:this.current?{count:this.current.durations.length,deltaMs:this.current.deltaMs}:null,
      activeRoles:this.current?[...this.current.voices.keys()]:[],
      speechFocus:this.speechFocus,
      errors:[...this.errors],
      log:this.log.slice(-30)
    };
  }

  async suspend(){if(this.ctx.state==='running')await this.ctx.suspend()}
  async resume(){if(this.ctx.state==='suspended')await this.ctx.resume()}
  async dispose(){await this.stopFamily();try{this.graph.music.disconnect();this.graph.eq.disconnect();this.graph.master.disconnect()}catch{}}
}

export function createKfbAudioRuntime(opts){return new KfbAudioRuntime(opts)}
