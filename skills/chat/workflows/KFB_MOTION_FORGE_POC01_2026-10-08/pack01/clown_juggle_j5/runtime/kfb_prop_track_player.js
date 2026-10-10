// KFB prop-track performer · reference runtime for kfb.prop-tracks.v2 (Clown juggling J5, sprint #381)
// three.js >= 0.160 · no other dependency.
//
// What it does
//   * plays the Rig_Medium clips of a performance GLB (skeleton-only clip library) on an actor
//     (the clip GLB scene itself, or any KayKit Rig_Medium character: bone names match);
//   * places the props from the prop-track rows: one transform per frame and prop, child of the actor root;
//   * runs the state machine juggle -> stop -> talk (loops while a line plays) -> resume -> juggle.
//
// Contract (do not reinterpret)
//   * 30 fps. Clip c has n frames; it occupies n/30 s. Loops: frame n == frame 0. One-shots: the last frame
//     is held for its 1/30 s, then the next clip starts at its frame 0 (all joins are pose-continuous).
//   * Rows are [tx, ty, tz, qx, qy, qz, qw, s] in glTF space relative to the actor root (the armature origin,
//     which stands on the podium top). Apply them to the RAW prop asset (glTF scene as shipped) as its local
//     transform under the actor root. Between frames: lerp position / scale, slerp rotation.
//   * Speech: call requestLine(); the performer switches at the next juggle frame 0 -> stop. Inside the clips'
//     talkWindows it reports talkWindowOpen = true; start the Chatterbox line then. When the line has finished,
//     call endLine(); talk runs to its frame 0, then resume -> juggle.
import * as THREE from 'three';

export const DEFAULT_STATES = {
  juggle: 'kfb_clown_juggle_cascade3_d',
  stop: 'kfb_clown_juggle_stop_j5',
  talk: 'kfb_clown_juggle_talk_j5',
  resume: 'kfb_clown_juggle_resume_j5',
};

// One-shot clips flow into a fixed next clip (all joins are pose-continuous):
const NEXT = { stop: 'talk', resume: 'juggle' };

function closeClip(clip, loop, fps, nextClip) {
  // Append one key at n/fps: frame 0 of this clip for loops (seamless wrap), frame 0 of the next clip for
  // one-shots (so the last 1/30 s blends into the next clip instead of holding and jumping).
  const n = Math.round(clip.duration * fps) + 1;
  const first = (name) => { const t = nextClip && nextClip.tracks.find((x) => x.name === name); return t ? t.values.slice(0, t.getValueSize()) : null; };
  const tEnd = n / fps;
  const tracks = clip.tracks.map((tr) => {
    const times = Array.from(tr.times), vs = tr.getValueSize(), vals = Array.from(tr.values);
    if (times.length === 2 && times[1] < tEnd - 1e-6 && tr.getInterpolation() === THREE.InterpolateDiscrete) {
      times[1] = tEnd;                                   // constant (STEP) channel: stretch
      return new tr.constructor(tr.name, times, vals, THREE.InterpolateDiscrete);
    }
    const nxt = loop ? null : first(tr.name);
    times.push(tEnd);
    for (let k = 0; k < vs; k++) vals.push(nxt ? nxt[k] : tr.values[(loop ? 0 : times.length - 2) * vs + k]);
    return new tr.constructor(tr.name, times, vals);
  });
  return new THREE.AnimationClip(clip.name, tEnd, tracks);
}

export class PropTrackPerformer {
  /**
   * @param {THREE.Object3D} actor   actor root (armature origin); its descendants carry the Rig_Medium bone names
   * @param {THREE.AnimationClip[]} clips  clips from the performance GLB
   * @param {object} tracks           parsed kfb.prop-tracks.v2 JSON (one prop kind)
   * @param {THREE.Object3D[]} props  three raw prop assets in track order (prop_0..prop_2)
   */
  constructor(actor, clips, tracks, props, states = DEFAULT_STATES) {
    this.actor = actor; this.tracks = tracks; this.props = props; this.states = states;
    this.fps = tracks.fps || 30;
    this.mixer = new THREE.AnimationMixer(actor);
    this.actions = {};
    for (const [state, id] of Object.entries(states)) {
      const src = clips.find((c) => c.name === id);
      if (!src) throw new Error(`clip ${id} missing in the GLB`);
      const loop = !!tracks.clips[id].loop;
      const nextSrc = NEXT[state] ? clips.find((c) => c.name === states[NEXT[state]]) : null;
      const a = this.mixer.clipAction(closeClip(src, loop, this.fps, nextSrc));
      a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.enabled = true;
      this.actions[state] = a;
    }
    for (const p of props) { p.matrixAutoUpdate = true; actor.add(p); }
    this.state = 'juggle'; this.t = 0; this.lineRequested = false; this.lineDone = false;
    this._play('juggle');
  }

  requestLine() { this.lineRequested = true; this.lineDone = false; }
  endLine() { this.lineDone = true; }

  get clipId() { return this.states[this.state]; }
  get frames() { return this.tracks.clips[this.clipId].frames; }
  get frame() { return this.t * this.fps; }
  get talkWindowOpen() {
    const f = Math.floor(this.frame);
    return (this.tracks.clips[this.clipId].talkWindows || []).some(([a, b]) => f >= a && f <= b);
  }

  _play(state) {
    for (const a of Object.values(this.actions)) a.stop();
    this.state = state; this.t = 0;
    const a = this.actions[state]; a.reset(); a.play();
  }

  _next() {
    const s = this.state;
    if (s === 'juggle') return this.lineRequested ? 'stop' : 'juggle';
    if (s === 'stop') return 'talk';
    if (s === 'talk') return this.lineDone ? 'resume' : 'talk';
    return 'juggle';                                                // resume
  }

  update(dt) {
    this.t += dt;
    let dur = this.frames / this.fps;
    while (this.t >= dur) {                                         // clip boundary: switch exactly at frame 0
      const rest = this.t - dur, nxt = this._next();
      if (nxt === 'stop') this.lineRequested = false;
      if (nxt === 'resume') this.lineDone = false;
      this._play(nxt); this.t = rest; dur = this.frames / this.fps;
    }
    this._apply();
  }

  /** Jump to an exact frame of a state (tests, scrubbing). */
  seek(state, frame) { this._play(state); this.t = frame / this.fps; this._apply(); }

  _apply() {
    const a = this.actions[this.state];
    a.time = this.t; this.mixer.update(0);
    const c = this.tracks.clips[this.clipId], n = c.frames, f = this.t * this.fps;
    const i0 = Math.min(Math.floor(f), n - 1), w = f - i0;
    const last = i0 === n - 1, nextC = !c.loop && last && NEXT[this.state] ? this.tracks.clips[this.states[NEXT[this.state]]] : null;
    const i1 = c.loop ? (i0 + 1) % n : Math.min(i0 + 1, n - 1);
    const p0 = new THREE.Vector3(), p1 = new THREE.Vector3(), q0 = new THREE.Quaternion(), q1 = new THREE.Quaternion();
    c.props.forEach((pr, k) => {
      const r0 = pr.track[i0], r1 = nextC ? nextC.props[k].track[0] : pr.track[i1], o = this.props[k];
      p0.set(r0[0], r0[1], r0[2]); p1.set(r1[0], r1[1], r1[2]);
      q0.set(r0[3], r0[4], r0[5], r0[6]); q1.set(r1[3], r1[4], r1[5], r1[6]);
      o.position.copy(p0.lerp(p1, w)); o.quaternion.copy(q0.slerp(q1, w));
      o.scale.setScalar(r0[7] + (r1[7] - r0[7]) * w);
    });
    this.actor.updateMatrixWorld(true);
  }
}
