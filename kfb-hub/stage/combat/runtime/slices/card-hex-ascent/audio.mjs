// Card-Hex Ascent · the ONE shared audio transport (single AudioContext).
// SFX: existing Combat LayerBank (modules/kfb-sfx-layers.js) + vendored v4 manifest.
// Music: one cataloged bed streamed through the same context on the LayerBank `music` bus.
import { LayerBank } from '../../modules/kfb-sfx-layers.js';

export class AudioTransport {
  constructor({ musicUrl = null, musicLabel = '', musicStatus = '' } = {}) {
    this.ac = null; this.bank = null; this.musicEl = null; this.state = 'LOCKED';
    this.music = { url: musicUrl, label: musicLabel, status: musicStatus, playing: false, error: null };
    this.counts = {}; this.missing = []; this.muted = false;
  }
  // Must run from a user gesture.
  async unlock() {
    if (this.ac) { if (this.ac.state === 'suspended') await this.ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) { this.state = 'UNSUPPORTED'; return; }
    this.ac = new AC(); this.master = this.ac.createGain(); this.master.gain.value = 0.6; this.master.connect(this.ac.destination);
    this.state = 'LOADING';
    const root = new URL('../../', import.meta.url).href;
    this.bank = new LayerBank(this.ac, this.master, { distMax: 30, distFloor: 0.18, hosts: [root] });
    try {
      const man = await (await fetch(new URL('modules/kfb-arena-sfx.v4.json', root))).json();
      const ledger = await this.bank.load(man);
      this.missing = ledger?.missing ?? [];
      this.state = this.bank.ready ? 'READY' : 'NO_SFX';
    } catch (e) { this.state = 'SFX_ERROR'; this.missing.push(String(e.message || e)); }
    if (this.music.url) this.startMusic();
  }
  startMusic() {
    try {
      const el = new Audio(); el.crossOrigin = 'anonymous'; el.src = this.music.url; el.loop = true; el.preload = 'auto';
      const src = this.ac.createMediaElementSource(el); src.connect(this.bank.buses.music);
      this.bank.buses.music.gain.value = 0.32; this.musicEl = el;
      el.addEventListener('playing', () => { this.music.playing = true; });
      el.addEventListener('error', () => { this.music.error = 'load failed'; this.music.playing = false; });
      el.play().catch(e => { this.music.error = String(e.message || e); });
    } catch (e) { this.music.error = String(e.message || e); }
  }
  toggleMusic() { if (!this.musicEl) return; if (this.musicEl.paused) this.musicEl.play().catch(() => {}); else { this.musicEl.pause(); this.music.playing = false; } }
  setMuted(m) { this.muted = m; if (this.master) this.master.gain.value = m ? 0 : 0.6; }
  // name: cue key in kfb-arena-sfx.v4.json; opts: {at:THREE.Vector3, listener, cam}
  play(name, opts = {}) {
    this.counts[name] = (this.counts[name] || 0) + 1;
    if (!this.bank || !this.bank.ready) return false;
    if (this.listener && opts.at) { opts.listener = this.listener.position; opts.cam = this.listener; } // spatial: distance, low-pass, pan
    try { return this.bank.play(name, opts); } catch (e) { return false; }
  }
  step(dt) { if (this.bank) try { this.bank.step(dt); } catch (e) {} }
  report() { return { state: this.state, contexts: this.ac ? 1 : 0, ctxState: this.ac?.state ?? null, music: { ...this.music }, counts: { ...this.counts }, missing: this.missing.slice(0, 6) }; }
}
