/* KFB WhackMan v1 · Klang
   Die Dateien kommen aus dem Repo-Manifest `media/3D_Assets/Audio/sfx.json`, nicht aus einer
   eigenen Liste. Das Manifest ist dort ausdrücklich als Wahrheit benannt: die Ordneransicht auf
   github.com ist JavaScript-gerendert und meldet den Audio-Ordner fälschlich als leer, und die
   rekursive Tree-API bricht bei diesem Repo ab. 1006 CC0-Sounds liegen da.

   Eine Falle steht ebenfalls im README und ist hier eingehalten: die Sounds liegen
   `<pack>/Audio/<datei>` verschachtelt. Wer das `/Audio/`-Segment weglässt, bekommt 404. */

const MANIFEST = 'media/3D_Assets/Audio/sfx.json';
const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');

/* Spielereignis → Datei. Brief §13 verlangt fünf Mindestcues.

   Zwei Einträge kommen bewusst NICHT aus `sfx.json`, sondern direkt aus dem Bestand:

   · `boost` ist im Manifest selbst als Platzhalter markiert — `_todo`: „jump/boost =
     Platzhalter (laser) -> besseren Whoosh". Ich hatte ihn trotzdem für die Sonderleckerei
     genommen, also machte ein Tiny-Treats-Donut im KayKit-Dungeon `laser3.ogg`. Das ist genau
     das Retro-Neon, das Brief §11 ausschliesst. Ersetzt durch ein Pizzicato-Jingle: gezupft,
     verspielt, passt zum Gebäck.
   · `error_001.ogg` ist ein UI-Fehlerpiepton, kein Treffer auf eine Figur. Ersetzt durch einen
     schweren Plattenaufschlag.

   Die übrigen Cues bleiben beim Manifest — dort sind sie gegen die echten Dateien aufgelöst. */
export const CUES = {
  pellet: 'coin',
  whack: 'hit',
  clear: 'win',
  start: 'confirm',
  ui: 'ui'
};

/* Eigene Einträge in derselben Form wie das Manifest: Pfad ab Repo-Wurzel, mit `/Audio/`. */
export const EIGEN = {
  special: { file: 'media/3D_Assets/Audio/kenney_music-jingles/Audio/Pizzicato jingles/jingles_PIZZI04.ogg', gain: 0.85, rate: 1,
    grund: 'Manifest-Eintrag boost ist dort als Laser-Platzhalter markiert' },
  tod: { file: 'media/3D_Assets/Audio/kenney_impact-sounds/Audio/impactPlate_heavy_000.ogg', gain: 0.9, rate: 1,
    grund: 'Manifest-Eintrag error ist ein UI-Piepton, kein Treffer auf eine Figur' }
};

export class Audio {
  constructor() {
    this.ready = false;
    this.buffers = new Map();
    this.manifest = null;
    this.ctx = null;
    this.gain = null;
    this.on = false;
    this.lastAt = new Map();
    this.report = { quelle: MANIFEST, geladen: [], fehlend: [] };
  }

  async load(onProgress = () => {}) {
    const r = await fetch(RAW + enc(MANIFEST));
    if (!r.ok) throw new Error('sfx.json ' + r.status);
    this.manifest = (await r.json()).sfx;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0.9;
    this.gain.connect(this.ctx.destination);

    const names = [...new Set(Object.values(CUES)), ...Object.keys(EIGEN)];
    for (const n of names) {
      const e = EIGEN[n] || this.manifest[n];
      if (!e) { this.report.fehlend.push(n + ' (nicht im Manifest)'); continue; }
      try {
        const res = await fetch(RAW + enc(e.file));
        if (!res.ok) { this.report.fehlend.push(n + ' HTTP ' + res.status); continue; }
        const buf = await this.ctx.decodeAudioData(await res.arrayBuffer());
        this.buffers.set(n, { buf, gain: e.gain ?? 1, rate: e.rate ?? 1 });
        this.report.geladen.push(n + ' · ' + e.file.split('/').pop() + (e.grund ? ' [eigen: ' + e.grund + ']' : ' [Manifest]'));
      } catch (err) { this.report.fehlend.push(n + ' · ' + err.message); }
      onProgress(this.report.geladen.length, names.length);
    }
    this.ready = true;
    return this.report;
  }

  /* Ein Ereignis, ein Ton. Kein Dauerteppich: die Kekskette würde sonst zum Maschinengewehr.
     `gap` drosselt Wiederholungen desselben Cues. */
  play(cue, { rate = 1, gain = 1, gap = 0.05 } = {}) {
    if (!this.on || !this.ready || !this.ctx) return;
    const name = CUES[cue] || cue;
    const e = this.buffers.get(name);
    if (!e) return;
    const now = this.ctx.currentTime;
    if (now - (this.lastAt.get(name) || -9) < gap) return;
    this.lastAt.set(name, now);
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const src = this.ctx.createBufferSource();
    src.buffer = e.buf;
    src.playbackRate.value = e.rate * rate;
    const g = this.ctx.createGain();
    g.gain.value = e.gain * gain;
    src.connect(g).connect(this.gain);
    src.start();
  }

  setOn(v) { this.on = !!v; }
  /* Browser verlangen eine Geste, bevor Ton laufen darf. Ein Tastendruck reicht. */
  arm() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
}
