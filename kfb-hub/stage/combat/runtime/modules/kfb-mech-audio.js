/* kfb-mech-audio.js · Sample-Bank fuer den KFB-Mech-Slice
 *
 * WARUM DIESE DATEI EXISTIERT
 * Die Overworld hat vermutlich seit Tag eins keinen einzigen ihrer Toene gespielt
 * (docs/BEFUND_audio-pfade.md). Nicht wegen eines Codec-Problems, sondern weil die
 * Manifest-Pfade daneben zeigten UND der Lader Fehlschlaege verschluckt hat. Bei 100 %
 * Ausfall klingt Stille genau wie ein fehlerfreies System.
 *
 * Also die Regel dieses Moduls: STILLE DARF EIN ERGEBNIS SEIN, ABER NIE EIN UNBEMERKTES.
 * Jeder Ladeversuch wird gezaehlt und in EINER Konsolenzeile gemeldet.
 *
 * DIE FALLE, gemessen (qa/audio-probe.html):
 * Cloudflare Pages antwortet auf FEHLENDE Pfade mit HTTP 200 und der 333-kB-index.html,
 * nicht mit 404. `if (r.ok)` haelt das fuer einen Erfolg. Darum entscheidet hier der
 * Content-Type, nicht der Status. RAW und jsDelivr antworten ehrlich mit 404.
 */

export const HOSTS = [
  'https://kayfabizarro.pages.dev/',                            // schnell, eigene Domain
  'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/',    // CDN, ehrliche 404
  'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/' // Quelle, ehrliche 404
];

/* Die Bruecke zwischen dem Slice und dem Manifest. Der Slice ruft seit v2 flache
   Synthese-Namen (`pop`, `hitmetal`, `land`); das Manifest denkt in Familien
   (`launch.<waffe>`, `impact.<energie>.<oberflaeche>`). Genau EINE Tabelle uebersetzt —
   damit kein Aufrufer im Slice zwei Namen kennen muss. Punktierte Schluessel gehen
   unveraendert durch, dann greift die volle 24-Zellen-Auflösung. */
export const ALIAS = {
  pop: 'launch.stinger', buzz: 'launch.hornet', railzap: 'launch.railgun',
  wetlob: 'launch.acid', scrapboom: 'launch.scrap', whoosh: 'launch.rocket',
  thump: 'launch.mortar', zap: 'launch.beam',
  hitdirt: 'impact.kinetic.earth', hitmetal: 'impact.kinetic.metal',
  hitbone: 'impact.kinetic.bone', splash: 'impact.kinetic.water',
  ping: 'impact.kinetic.shield', splat: 'impact.wet.earth',
  snap: 'impact.electric.metal',
  boom: 'aftermath.boom', trail: 'travel.ink',
  step: 'locomotion.step', land: 'locomotion.land', jump: 'locomotion.jump',
  hurt: 'locomotion.hurt', die: 'locomotion.die',
  spawn: 'ui.spawn'
};

const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
const AUDIO_CT = /^(audio|application\/(ogg|octet-stream))/;

/* Ein Cue, wie er nach dem Laden aussieht: Puffer (oder mehrere Varianten), Gain,
   Rate-Jitter. Alles andere kommt zur Spielzeit. */
class Cue {
  constructor(key, rec) {
    this.key = key;
    this.gain = rec.gain == null ? 0.6 : rec.gain;
    this.jitter = rec.rateJitter || 0;
    this.rate = rec.rate || 1;
    this.taktMs = rec.takt_ms || 0;
    this.bufs = [];
    this.files = [];
    this.lastPlay = -1e9;
    this.lastTakt = -1e9;
  }
  pick() { return this.bufs.length === 1 ? this.bufs[0] : this.bufs[(Math.random() * this.bufs.length) | 0]; }
}

export class SampleBank {
  /* ac      · ein bestehender AudioContext (der Slice hat schon einen)
     master  · der Gain-Knoten, unter dem alles haengt
     opts.hosts, opts.distMax, opts.distFloor */
  constructor(ac, master, opts) {
    const o = opts || {};
    this.ac = ac;
    this.out = ac.createGain();
    this.out.gain.value = o.busGain == null ? 1 : o.busGain;
    this.out.connect(master || ac.destination);
    this.hosts = o.hosts || HOSTS;
    this.distMax = o.distMax || 55;      // ab hier nur noch Bodensatz
    this.distFloor = o.distFloor || 0.15; // Bodensatz, aus _rules.distanz
    this.cues = new Map();
    this.ledger = { total: 0, loaded: 0, missing: [], hostUse: {}, bytes: 0, ms: 0 };
    this.ready = false;
    this.debounceMs = 40;
    this.poly = { cap: 3, windowMs: 90, recent: [] };
  }

  /* Ein Cue kann mehrere Dateien tragen: `varianten: 5` heisst footstep_grass_000..004.
     Das steht so im Manifest, also liest es der Lader auch so — nicht der Aufrufer. */
  _filesFor(rec) {
    if (!rec.varianten) return [rec.file];
    const m = rec.file.match(/^(.*?)(\d{3})(\.\w+)$/);
    if (!m) return [rec.file];
    const out = [];
    for (let i = 0; i < rec.varianten; i++) out.push(m[1] + String(i).padStart(3, '0') + m[3]);
    return out;
  }

  _flatten(manifest) {
    const out = [];
    for (const [grp, val] of Object.entries(manifest)) {
      if (grp.startsWith('_') || !val || typeof val !== 'object' || Array.isArray(val)) continue;
      for (const [k, v] of Object.entries(val)) {
        if (v && v.file) out.push([grp + '.' + k, v]);
        else if (v && typeof v === 'object') {
          for (const [k2, v2] of Object.entries(v)) if (v2 && v2.file) out.push([grp + '.' + k + '.' + k2, v2]);
        }
      }
    }
    return out;
  }

  /* Ein Pfad, drei Hosts, der erste ehrliche Treffer gewinnt. „Ehrlich" heisst:
     Status ok UND Content-Type ist Audio UND der Decoder nimmt es an. Alle drei
     Pruefungen haben einen Grund; die mittlere ist die Cloudflare-Falle. */
  async _fetchBuffer(path) {
    let lastErr = 'unbekannt';
    for (const host of this.hosts) {
      const url = host + enc(path);
      try {
        const r = await fetch(url);
        if (!r.ok) { lastErr = 'HTTP ' + r.status; continue; }
        const ct = (r.headers.get('content-type') || '').toLowerCase();
        if (!AUDIO_CT.test(ct)) { lastErr = 'Content-Type ' + ct + ' (Host liefert Ersatzseite statt 404)'; continue; }
        const raw = await r.arrayBuffer();
        const buf = await this.ac.decodeAudioData(raw.slice(0));
        this.ledger.hostUse[host] = (this.ledger.hostUse[host] || 0) + 1;
        this.ledger.bytes += raw.byteLength;
        return buf;
      } catch (e) { lastErr = (e && (e.message || e.name)) || String(e); }
    }
    throw new Error(lastErr);
  }

  /* manifestUrlOrObject: URL-String ODER das bereits geparste Manifest.
     Laedt mit begrenzter Parallelitaet und meldet danach EINMAL. */
  async load(manifestUrlOrObject, opts) {
    const t0 = (performance.now && performance.now()) || 0;
    let manifest = manifestUrlOrObject;
    if (typeof manifest === 'string') {
      const urls = [manifest, ...this.hosts.map((h) => h + 'modules/kfb-combat-sfx.json')];
      let ok = null;
      for (const u of urls) { try { const r = await fetch(u); if (r.ok) { ok = await r.json(); break; } } catch (e) { /* naechster */ } }
      if (!ok) { console.warn('[audio] Manifest nicht ladbar — bleibe bei der Synthese'); return this.ledger; }
      manifest = ok;
    }
    /* FALLE, benannt statt abgewartet: die korrigierte Fassung des Manifests liegt
       im PROJEKT, nicht im Repo. Faellt der Ladeweg auf einen CDN-Host zurueck, holt
       er die ALTE Fassung mit den kaputten Pfaden — und dann sind 100 % der Cues weg,
       genau der Zustand, den dieses Modul aufdecken soll. `_hosts` gibt es nur in der
       korrigierten Fassung, also ist es der Pruefstein. */
    if (!manifest._hosts) {
      console.warn('[audio] ALTE Manifest-Fassung geladen (kein `_hosts`) — die Pfade darin '
        + 'sind nachweislich falsch, siehe docs/BEFUND_audio-pfade.md. Erwarte 0 geladene Cues.');
    }
    this.rules = manifest._rules || {};
    if (this.rules.debounce_ms) this.debounceMs = this.rules.debounce_ms;
    if (this.rules.cap_polyphony) this.poly.cap = this.rules.cap_polyphony;
    if (this.rules.fenster_ms) this.poly.windowMs = this.rules.fenster_ms;

    const entries = this._flatten(manifest);
    this.ledger.total = entries.length;

    const jobs = [];
    for (const [key, rec] of entries) {
      const cue = new Cue(key, rec);
      cue.files = this._filesFor(rec);
      this.cues.set(key, cue);
      jobs.push([cue, rec]);
    }

    const LANES = (opts && opts.lanes) || 8;
    let idx = 0;
    const lane = async () => {
      while (idx < jobs.length) {
        const [cue] = jobs[idx++];
        const bufs = await Promise.all(cue.files.map((f) => this._fetchBuffer(f).catch((e) => ({ err: e.message, f }))));
        const good = bufs.filter((b) => b && !b.err);
        const bad = bufs.filter((b) => b && b.err);
        if (good.length) { cue.bufs = good; this.ledger.loaded++; }
        else { this.cues.delete(cue.key); this.ledger.missing.push(cue.key + ' (' + (bad[0] ? bad[0].err : '?') + ')'); }
      }
    };
    await Promise.all(Array.from({ length: LANES }, lane));

    this.ledger.ms = Math.round(((performance.now && performance.now()) || 0) - t0);
    this.ready = this.ledger.loaded > 0;
    console.log('[audio] ' + this.line());
    if (this.ledger.missing.length) console.warn('[audio] nicht gefunden:\n  ' + this.ledger.missing.join('\n  '));
    return this.ledger;
  }

  /* Die eine Zeile, die es am ersten Tag beendet haette. */
  line() {
    const L = this.ledger;
    const hosts = Object.entries(L.hostUse).map(([h, n]) => n + '× ' + h.replace(/^https?:\/\//, '').split('/')[0]).join(' · ');
    return L.total + ' Cues · ' + L.loaded + ' geladen · ' + (L.total - L.loaded) + ' nicht gefunden · '
      + Math.round(L.bytes / 1024) + ' kB · ' + L.ms + ' ms' + (hosts ? ' · ' + hosts : '');
  }

  resolve(name) {
    if (this.cues.has(name)) return this.cues.get(name);
    const a = ALIAS[name];
    if (a && this.cues.has(a)) return this.cues.get(a);
    /* Ruecklauf innerhalb der Impact-Tabelle: eine unbekannte Oberflaeche fällt
       auf `earth` derselben Energieart, nicht auf Stille. */
    if (a && a.startsWith('impact.')) {
      const p = a.split('.');
      const alt = 'impact.' + p[1] + '.earth';
      if (this.cues.has(alt)) return this.cues.get(alt);
    }
    return null;
  }

  /* Rueckgabe FALSE heisst: hier ist nichts geladen, synthetisiere du.
     Der Slice behaelt damit seine prozeduralen Toene als Notweg — genau wie im
     Vertrag von kfb-combat-sfx.json beschrieben. */
  play(name, o) {
    if (!this.ready) return false;
    const cue = this.resolve(name);
    if (!cue || !cue.bufs.length) return false;
    o = o || {};
    const nowMs = (performance.now && performance.now()) || 0;

    if (cue.taktMs) { if (nowMs - cue.lastTakt < cue.taktMs) return true; cue.lastTakt = nowMs; }
    if (nowMs - cue.lastPlay < this.debounceMs) return true;   // gespielt gilt als erledigt
    cue.lastPlay = nowMs;

    const w = o.weight == null ? (o.vol == null ? 1 : o.vol) : o.weight;
    this.poly.recent = this.poly.recent.filter((c) => nowMs - c.t < this.poly.windowMs);
    if (this.poly.recent.length >= this.poly.cap) {
      let weakest = Infinity; for (const c of this.poly.recent) weakest = Math.min(weakest, c.w);
      if (w <= weakest) return true;   // verdraengt, aber nicht „ungehoert"
    }
    this.poly.recent.push({ t: nowMs, w });

    let V = (o.vol == null ? 1 : o.vol) * cue.gain;
    if (o.at && o.listener) {
      const d = o.at.distanceTo(o.listener);
      V *= Math.max(this.distFloor, 1 - d / this.distMax);
    }
    if (V <= 0.0008) return true;

    const ac = this.ac;
    if (ac.state === 'suspended') ac.resume();
    const src = ac.createBufferSource();
    src.buffer = cue.pick();
    src.playbackRate.value = cue.rate * (cue.jitter ? 1 + (Math.random() * 2 - 1) * cue.jitter : 1) * (o.rate || 1);
    const g = ac.createGain();
    g.gain.value = V;
    src.connect(g); g.connect(this.out);
    src.start(ac.currentTime);
    src.onended = () => { try { src.disconnect(); g.disconnect(); } catch (e) { /* schon weg */ } };
    return true;
  }

  setGain(v) { this.out.gain.value = v; }
  dispose() { try { this.out.disconnect(); } catch (e) { /* schon weg */ } this.cues.clear(); this.ready = false; }
}
