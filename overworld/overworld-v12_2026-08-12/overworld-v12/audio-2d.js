/* KFB Overworld — Audio (V2-S3b)
   Zwei Klangebenen, beide aus CC0-Kenney-Packs im Repo:

   - sfx(event)   Treffer, Schritte, Karten, Jingles — Pfade aus dem vorhandenen Manifest
                  media/3D_Assets/Audio/sfx.json (die eine Wahrheit, hier nicht duplizieren).
   - voice(event) DER RINGSPRECHER. Das Fighter-Voiceover-Pack ist kein Grunt-Pack, sondern ein
                  Arcade-Announcer („fight", „combo", „flawless victory", „round 1–5"). Für ein
                  Kayfabe-Universum mit einem König als Richter ist das der richtige Ton:
                  nicht der Held stöhnt, sondern die Halle kommentiert.

   Gemessen statt geraten (Session 2): die Dateiliste wird einmal geholt (GitHub-API, in
   localStorage gecacht) und gegen die Map unten geschnitten — was fehlt, bleibt still.
   Kein Autoplay: der AudioContext startet bei der ersten Geste des Spielers. */
(function(){
'use strict';
const S=window.OW_SRC;
if(!S)console.error('[audio-2d] asset-source.js fehlt — Assets laden nicht');
const RAW=S?S.base():'';        // Bytes über das CDN — Quelle: asset-source.js
const API=(S?S.api:'')+'/contents/';   // Listen über die GitHub-API
const VDIR='media/3D_Assets/Audio/kenney_voiceover-pack-fighter/Audio';
const CACHE_KEY='ow_voicepack_v2';

// Ereignis → Kandidaten (in dieser Priorität). Nur was im Pack liegt, wird benutzt.
const VOICE={
  fightStart:  ['fight.ogg','begin.ogg','prepare_yourself.ogg'],
  kayfabe:     ['combo_breaker.ogg','prepare_yourself.ogg'],
  combo:       ['combo.ogg'],
  multiKill:   ['multi_kill.ogg'],
  finishHim:   ['kill_him.ogg','kill_her.ogg','kill_it.ogg'],
  eliteDown:   ['flawless_victory.ogg','winner.ogg'],
  zoneClear:   ['you_win.ogg','winner.ogg'],
  islandClear: ['flawless_victory.ogg','championship_mode.ogg'],
  heroDown:    ['you_lose.ogg','game_over.ogg','loser.ogg'],
  levelUp:     ['championship_mode.ogg','ready.ogg'],
  lowPuste:    ['sudden_death.ogg'],
  finalZone:   ['final_round.ogg'],
};
// Indizierte Ansagen: Zonen als Runden, Kill-Streak als Zählung
const ROUNDS=['round_1.ogg','round_2.ogg','round_3.ogg','round_4.ogg','round_5.ogg'];
const COUNT=['1.ogg','2.ogg','3.ogg','4.ogg','5.ogg','6.ogg','7.ogg','8.ogg','9.ogg','10.ogg'];
// Für S7 reserviert: Story-Mode-Ansagen
const MODES={farce:'arcade_mode.ogg',noir:'story_mode.ogg',protokoll:'battle_mode.ogg',
  mythos:'championship_mode.ogg',survival:'survival_mode.ogg',deathmatch:'deathmatch.ogg'};

class OwAudio{
  constructor(){
    this.ctx=null;this.master=null;this.buffers=new Map();
    this.manifest={};this.have=new Set();this.voices={};this.rounds=[];this.count=[];this.modes={};
    this.enabled=true;this.last={};this.duck=1;this.stepDist=0;
  }
  async init(){
    try{
      const r=await fetch(RAW+'media/3D_Assets/Audio/sfx.json');
      this.manifest=(await r.json()).sfx||{};
    }catch(e){console.warn('[audio] sfx.json:',e.message);}
    await this.findVoices();
    console.log('[audio] sfx',Object.keys(this.manifest).length,
      '· announcer',Object.keys(this.voices).length+'/'+Object.keys(VOICE).length,
      '· rounds',this.rounds.length,'· count',this.count.length,
      this.have.size?'':'(voice pack nicht erreichbar — bleibt still)');
  }
  async findVoices(){
    let names=null;
    try{const c=localStorage.getItem(CACHE_KEY);if(c)names=JSON.parse(c);}catch(e){}
    if(!names){
      try{
        const r=await fetch(API+VDIR);
        if(r.ok){
          names=(await r.json()).filter(f=>f.type==='file'&&/\.(ogg|mp3|wav)$/i.test(f.name))
            .map(f=>f.name);
          try{localStorage.setItem(CACHE_KEY,JSON.stringify(names));}catch(e){}
        }
      }catch(e){console.warn('[audio] voice listing:',e.message);}
    }
    if(!names||!names.length)return;
    this.have=new Set(names);
    const path=n=>VDIR+'/'+n;
    for(const k in VOICE){
      const pool=VOICE[k].filter(n=>this.have.has(n)).map(path);
      if(pool.length)this.voices[k]=pool;
    }
    this.rounds=ROUNDS.filter(n=>this.have.has(n)).map(path);
    this.count=COUNT.filter(n=>this.have.has(n)).map(path);
    for(const k in MODES)if(this.have.has(MODES[k]))this.modes[k]=path(MODES[k]);
  }
  resume(){
    if(this.ctx)return;
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return;
    this.ctx=new AC();
    this.master=this.ctx.createGain();
    this.master.gain.value=0.9;
    this.master.connect(this.ctx.destination);
  }
  async buffer(path){
    if(this.buffers.has(path))return this.buffers.get(path);
    const p=fetch(RAW+path.split('/').map(encodeURIComponent).join('/'))
      .then(r=>{if(!r.ok)throw new Error(r.status);return r.arrayBuffer();})
      .then(a=>this.ctx.decodeAudioData(a))
      .catch(e=>{console.warn('[audio]',path,e.message);return null;});
    this.buffers.set(path,p);
    return p;
  }
  async play(path,gain,rate){
    if(!this.enabled||!this.ctx||!path)return;
    const buf=await this.buffer(path);
    if(!buf)return;
    const src=this.ctx.createBufferSource();
    src.buffer=buf;src.playbackRate.value=rate||1;
    const g=this.ctx.createGain();
    g.gain.value=(gain==null?0.8:gain)*this.duck;
    src.connect(g);g.connect(this.master);
    src.start();
  }
  sfx(ev,opts){
    opts=opts||{};
    const e=this.manifest[ev];
    if(!e)return;
    if(opts.throttle){
      const t=performance.now();
      if(this.last[ev]&&t-this.last[ev]<opts.throttle)return;
      this.last[ev]=t;
    }
    this.play(e.file,(e.gain||0.8)*(opts.gain||1),
      (e.rate||1)*(1+(opts.vary||0)*(Math.random()*2-1)));
  }
  /* Der Sprecher. Sparsam dosiert: eigener Cooldown je Ereignis plus ein globaler,
     damit sich zwei Ansagen nie überreden. Duckt die SFX-Ebene, solange er spricht. */
  voice(ev,chance,cooldown){
    const pool=this.voices[ev];
    if(!pool||!this.ctx||!this.enabled)return false;
    return this._speak(pool[Math.floor(Math.random()*pool.length)],'v_'+ev,chance,cooldown);
  }
  round(n){ // Zone als Runde ansagen
    if(!this.rounds.length)return false;
    return this._speak(this.rounds[Math.min(n,this.rounds.length-1)],'v_round',1,1500);
  }
  number(n){ // Kill-Streak zählen
    if(!this.count.length||n<1||n>this.count.length)return false;
    return this._speak(this.count[n-1],'v_count',1,400);
  }
  mode(id){return this._speak(this.modes[id],'v_mode',1,4000);}
  _speak(path,key,chance,cooldown){
    if(!path||!this.ctx||!this.enabled)return false;
    const t=performance.now();
    if(this.last.v_any&&t-this.last.v_any<420)return false;
    if(this.last[key]&&t-this.last[key]<(cooldown==null?2500:cooldown))return false;
    if(chance!=null&&chance<1&&Math.random()>chance)return false;
    this.last[key]=t;this.last.v_any=t;
    this.duck=0.4;
    setTimeout(()=>{this.duck=1;},750);
    this.play(path,0.95,1);
    // Der Held ist sein eigener Ringsprecher (Georg, 6.8.): das Wort gehört in eine Sprechblase
    // am Charakter, nicht ins Off. Das Label IST der Dateiname — kein zweiter Datensatz zu pflegen.
    if(this.onSay)this.onSay(this.label(path));
    return true;
  }
  label(path){
    return path.split('/').pop().replace(/\.[a-z0-9]+$/i,'')
      .replace(/_/g,' ').replace(/'/g,'’').toUpperCase()+'!';
  }
  /* Schritte hängen an der gelaufenen Strecke, nicht an der Uhr (Lehre aus Travel S79 —
     sonst trippelt der Held im Stehen). `terrain` bekommt später eigene Klänge. */
  step(distance,terrain){
    this.stepDist+=distance;
    if(this.stepDist<58)return;
    this.stepDist=0;
    this.sfx('step',{vary:0.14,gain:terrain==='water'?0.7:1});
  }
}

window.OW_AUDIO=new OwAudio();
})();
