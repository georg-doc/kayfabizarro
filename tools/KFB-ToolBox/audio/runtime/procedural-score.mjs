/** KFB Audio: deterministic phrase compiler. DATA ONLY — the host MusicClock owns time. */
const MODES = Object.freeze({
  major: [0,2,4,5,7,9,11], mixolydian: [0,2,4,5,7,9,10],
  lydian: [0,2,4,6,7,9,11], dorian: [0,2,3,5,7,9,10],
  aeolian: [0,2,3,5,7,8,10], hijaz: [0,1,4,5,7,8,10],
  phrygian: [0,1,3,5,7,8,10]
});
const PENTATONIC = {
  major: [0,2,4,5,7], mixolydian: [0,2,4,5,7],
  lydian: [0,2,4,6,7], dorian: [0,2,3,5,7],
  aeolian: [0,2,3,5,7], hijaz: [0,1,4,5,7],
  phrygian: [0,1,3,5,7]
};
// PROPOSAL profiles, not a replacement for authored songs or radio.
export const PROFILES = Object.freeze({
  'world.kfb-town': { mode:'mixolydian', bpm:[87,101], palette:['marimba','pluck','flute'] },
  'world.utopia': { mode:'lydian', bpm:[72,90], palette:['kalimba','flute','musicbox'] },
  'world.protopia': { mode:'major', bpm:[90,110], palette:['steelpan','marimba','flute'] },
  'world.dystopia': { mode:'dorian', bpm:[83,105], palette:['fm-bass','pluck','saw'] },
  'biome.forest': { mode:'dorian', bpm:[76,93], palette:['kalimba','pluck','flute'] },
  'biome.beach': { mode:'mixolydian', bpm:[89,108], palette:['steelpan','marimba','flute'] },
  'biome.snow': { mode:'aeolian', bpm:[64,80], palette:['musicbox','pluck','flute'] },
  'biome.desert': { mode:'hijaz', bpm:[82,104], palette:['pluck','fm-bass','flute'] },
  'vehicle.speedboat': { mode:'phrygian', bpm:[116,136], palette:['saw','fm-bass','pluck'] }
});
const PROGRESSION = [[0,3,4,0],[0,5,3,4],[0,4,5,3],[0,2,3,4]];
// FNV-1a over UTF-8 gives stable non-ASCII place identities.
function hash(value) {
  let h=2166136261;
  for (const byte of new TextEncoder().encode(String(value))) h=Math.imul(h^byte,16777619);
  return h>>>0;
}
function rng(seed) {
  let n=seed||0x6D2B79F5;
  return ()=>{ n^=n<<13; n^=n>>>17; n^=n<<5; return (n>>>0)/4294967296; };
}
function degree(root,mode,step,octave=0) {
  const index=((step%7)+7)%7;
  return root+mode[index]+12*(Math.floor(step/7)+octave);
}
const pick=(a,r)=>a[Math.floor(r()*a.length)];
const freezeNotes=notes=>Object.freeze(notes.map(note=>Object.freeze(note)));

/** Eight bars, 4/4, 16 steps/bar; no transport, playback or gameplay reads. */
export function composePlace({placeId,profileId,variation=0,dayPhase='day'}) {
  if (typeof placeId!=='string'||!placeId.length) throw new TypeError('stable placeId required');
  const profile=PROFILES[profileId];
  if (!profile) throw new RangeError('unknown profile: '+profileId);
  if (!Number.isSafeInteger(variation)||variation<0) throw new RangeError('invalid variation');
  const random=rng(hash(placeId+'\u0000'+profileId+'\u0000'+variation));
  const mode=MODES[profile.mode], pent=PENTATONIC[profile.mode];
  const root=48+Math.floor(random()*12);
  const bpm=profile.bpm[0]+Math.floor(random()*(profile.bpm[1]-profile.bpm[0]+1));
  const progression=[...pick(PROGRESSION,random)];
  const notes=[];
  for(let bar=0;bar<8;bar++) {
    const chord=progression[Math.floor(bar/2)];
    if(bar%2===0) for(const interval of [0,2,4]) notes.push({
      layer:'bed',voice:profile.palette[0],step:bar*16,length:32,
      pitch:degree(root,mode,chord+interval,-1),velocity:0.23
    });
    for(let beat=0;beat<4;beat++) notes.push({
      layer:'groove',voice:profile.palette[1],step:bar*16+beat*4+2,
      length:2,pitch:degree(root,mode,chord,0),velocity:0.25
    });
  }
  let walk=Math.floor(random()*pent.length);
  for(let step=0;step<128;) {
    const bar=Math.floor(step/16),chordRoot=progression[Math.floor(bar/2)];
    const advance=pick([2,4,4,6,8],random);
    if(random()>0.24) {
      if(step%32===0) {
        const chordPC=[0,2,4].map(i=>degree(0,mode,chordRoot+i)%12);
        const candidate=[walk,(walk+1)%5,(walk+4)%5];
        const hit=candidate.find(i=>chordPC.includes(pent[i]));
        if(hit!==undefined) walk=hit;
      }
      notes.push({
        layer:'lead',voice:profile.palette[2],step,length:Math.min(advance,8),
        pitch:root+pent[walk]+12,velocity:0.24+Math.round(random()*8)/100
      });
      walk=Math.max(0,Math.min(4,walk+pick([-1,0,1],random)));
    }
    step+=advance;
  }
  if(dayPhase==='day'&&profileId==='biome.forest'&&random()<0.5) {
    notes.push({layer:'accent',voice:'flute',step:112,length:1,pitch:root+36,velocity:0.10});
    notes.push({layer:'accent',voice:'flute',step:114,length:1,pitch:root+38,velocity:0.08});
  }
  notes.sort((a,b)=>a.step-b.step||a.layer.localeCompare(b.layer));
  return Object.freeze({
    schema:'kfb.audio.procedural-phrase.v1',placeId,profileId,variation,
    mode:profile.mode,bpm,rootMidi:root,bars:8,ticksPerBar:16,
    progression:Object.freeze(progression),notes:freezeNotes(notes)
  });
}
export function nextTwoBarSeam(step) {
  if(!Number.isFinite(step)||step<0) throw new RangeError('invalid transport step');
  return Math.ceil(step/32)*32;
}
export function cueForEvent(type,absoluteStep,rootMidi=60) {
  const cues={
    POI_DISCOVERED:[0,4,7],CARD_ACQUIRED:[0,7,12],
    RACE_START:[0,7,5,12],ROCKET_COUNTDOWN:[12,7,5,0]
  };
  if(!cues[type]) return Object.freeze([]);
  const step=nextTwoBarSeam(absoluteStep);
  return freezeNotes(cues[type].map((n,i)=>({
    layer:'accent',voice:'musicbox',step:step+i*2,length:2,
    pitch:rootMidi+n,velocity:0.30
  })));
}
export function mixForActivity(activity='ROAM') {
  const mixes={
    ROAM:{bed:0.65,groove:0.50,lead:0.70,accent:1},
    STAY:{bed:0.85,groove:0.15,lead:0.45,accent:1},
    DRIVE:{bed:0.55,groove:0.85,lead:0.75,accent:1},
    RIDE:{bed:0.60,groove:0.75,lead:0.80,accent:1},
    SPEECH:{bed:0.24,groove:0.12,lead:0.10,accent:0.4}
  };
  if(!mixes[activity]) throw new RangeError('unknown activity: '+activity);
  return Object.freeze({...mixes[activity]});
}
