// AtmoEngine — procedural underwater drone atmosphere for the Conspiracy Iceberg Explorer.
// Exposes window.AtmoEngine. Zero assets required (synth mode). If per-tier loops exist at
// assets/atmo/tier-1.mp3 … tier-7.mp3 (ElevenLabs pipeline, see docs/ATMO-prompts.md), the
// engine auto-upgrades to tracks mode with 3s crossfades; synth stays as universal fallback.
//
// Contract (view-agnostic): start() / stop() / setTier(0..7) / duck(bool) / dispose().
// tier 0 = surface, 7 = abyss. All transitions are slow ramps — nothing snaps.
(function () {
  "use strict";

  // Per-tier character tables (index 0 = surface … 7 = deepest).
  // interval: color-osc ratio over the 55Hz root (A1): fifth → fourth → maj3 → min3 → tritone → minor 2nd.
  var IV    = [1.5, 1.5, 1.335, 1.26, 1.189, 1.414, 1.414, 1.0595];
  var CUT   = [950, 820, 640, 480, 360, 260, 200, 150];   // noise lowpass Hz
  var BEAT  = [0.15, 0.25, 0.5, 0.9, 1.4, 2.0, 2.7, 3.2]; // detune-beat Hz (psychedelic ↑)
  var SUBG  = [0.02, 0.03, 0.04, 0.05, 0.065, 0.08, 0.09, 0.10];
  var VIB   = [4, 5, 7, 10, 14, 18, 24, 30];              // vibrato depth cents
  var PINGF = [860, 780, 620, 480, 380, 300, 240, 190];   // sonar ping base Hz
  var PINGT = [9, 10, 11, 12, 13, 15, 17, 20];            // avg seconds between pings

  function AtmoEngine() {
    this.running = false;
    this._ctx = null;
    this._tier = 0;
    this._tracks = null;      // decoded AudioBuffers (tracks mode) or null
    this._trackSrc = null;    // active {src, gain, tier}
    this._pingTimer = null;
    this._level = 0.3;
  }

  AtmoEngine.prototype._ensure = function () {
    if (this._ctx) return;
    var C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    var ctx = this._ctx = new C();
    var t = ctx.currentTime;

    // master: everything → comp → masterGain → out
    this._master = ctx.createGain(); this._master.gain.value = 0;
    this._comp = ctx.createDynamicsCompressor();
    this._comp.threshold.value = -20; this._comp.ratio.value = 8;
    this._comp.connect(this._master); this._master.connect(ctx.destination);

    // synth bus (so tracks mode can fade the whole synth out)
    this._synthBus = ctx.createGain(); this._synthBus.gain.value = 1;
    this._synthBus.connect(this._comp);

    // --- layer: water noise (brown-ish) → lowpass ---
    var len = 4 * ctx.sampleRate, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), b = 0;
    for (var i = 0; i < len; i++) { b = (b + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = b * 3.5; }
    this._noise = ctx.createBufferSource(); this._noise.buffer = buf; this._noise.loop = true;
    this._noiseLP = ctx.createBiquadFilter(); this._noiseLP.type = "lowpass"; this._noiseLP.frequency.value = CUT[0]; this._noiseLP.Q.value = 0.8;
    var ng = ctx.createGain(); ng.gain.value = 0.16;
    this._noise.connect(this._noiseLP); this._noiseLP.connect(ng); ng.connect(this._synthBus);
    // slow drift on the filter — the water breathes
    this._lfoN = ctx.createOscillator(); this._lfoN.frequency.value = 0.06;
    var lfoNG = ctx.createGain(); lfoNG.gain.value = 60;
    this._lfoN.connect(lfoNG); lfoNG.connect(this._noiseLP.frequency);

    // --- layer: sub root (A1 → glides deeper) ---
    this._sub = ctx.createOscillator(); this._sub.type = "sine"; this._sub.frequency.value = 55;
    this._subG = ctx.createGain(); this._subG.gain.value = SUBG[0];
    this._sub.connect(this._subG); this._subG.connect(this._synthBus);

    // --- layer: drone body (A2 triangle, present near surface, recedes below) ---
    this._body = ctx.createOscillator(); this._body.type = "triangle"; this._body.frequency.value = 110;
    this._bodyG = ctx.createGain(); this._bodyG.gain.value = 0.07;
    this._body.connect(this._bodyG); this._bodyG.connect(this._synthBus);

    // --- layer: color interval + beating twin (the eerie/psychedelic core) ---
    this._col = ctx.createOscillator(); this._col.type = "sine"; this._col.frequency.value = 110 * IV[0];
    this._colG = ctx.createGain(); this._colG.gain.value = 0.045;
    this._col.connect(this._colG); this._colG.connect(this._synthBus);
    this._twin = ctx.createOscillator(); this._twin.type = "sine"; this._twin.frequency.value = 110 * IV[0] + BEAT[0];
    this._twinG = ctx.createGain(); this._twinG.gain.value = 0.04;
    this._twin.connect(this._twinG); this._twinG.connect(this._synthBus);
    // shared slow vibrato (depth-scaled) — disorientation dial
    this._lfoV = ctx.createOscillator(); this._lfoV.frequency.value = 0.09;
    this._lfoVG = ctx.createGain(); this._lfoVG.gain.value = VIB[0];
    this._lfoV.connect(this._lfoVG); this._lfoVG.connect(this._col.detune); this._lfoVG.connect(this._twin.detune);

    // --- sonar ping voice: fed through a feedback delay (cavernous echo) ---
    this._delay = ctx.createDelay(2); this._delay.delayTime.value = 0.55;
    this._fb = ctx.createGain(); this._fb.gain.value = 0.42;
    this._delay.connect(this._fb); this._fb.connect(this._delay);
    this._pingBus = ctx.createGain(); this._pingBus.gain.value = 0.9;
    this._pingBus.connect(this._delay); this._delay.connect(this._synthBus); this._pingBus.connect(this._synthBus);

    [this._noise, this._lfoN, this._sub, this._body, this._col, this._twin, this._lfoV].forEach(function (n) { n.start(t); });
    this._tryTracks();
  };

  AtmoEngine.prototype._ping = function () {
    if (!this.running || !this._ctx) return;
    var ctx = this._ctx, t = ctx.currentTime, i = this._tier;
    var o = ctx.createOscillator(); o.type = "sine";
    o.frequency.value = PINGF[i] * (0.85 + Math.random() * 0.3);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0004, t + 2.2 + i * 0.25);
    o.connect(g); g.connect(this._pingBus);
    o.start(t); o.stop(t + 3.5 + i * 0.3);
    this._schedulePing();
  };

  AtmoEngine.prototype._schedulePing = function () {
    clearTimeout(this._pingTimer);
    var s = PINGT[this._tier] * (0.6 + Math.random() * 0.8);
    this._pingTimer = setTimeout(this._ping.bind(this), s * 1000);
  };

  // optional tracks mode — silently upgrades if all 7 loops are present
  AtmoEngine.prototype._tryTracks = function () {
    var self = this, ctx = this._ctx;
    var loads = [];
    for (var n = 1; n <= 7; n++) (function (n) {
      loads.push(fetch("assets/atmo/tier-" + n + ".mp3")
        .then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then(function (ab) { return ctx.decodeAudioData(ab); })
        .catch(function () { return null; }));
    })(n);
    Promise.all(loads).then(function (bufs) {
      if (bufs.every(function (b) { return b; })) {
        self._tracks = bufs;
        if (self.running) self._applyTier(self._tier, true);
      }
    });
  };

  AtmoEngine.prototype._applyTier = function (i, force) {
    var ctx = this._ctx; if (!ctx) return;
    var t = ctx.currentTime, T = 4.5; // slow morph
    function tgt(p, v, tc) { p.setTargetAtTime(v, t, tc || T); }
    tgt(this._noiseLP.frequency, CUT[i]);
    tgt(this._sub.frequency, i >= 6 ? 41.2 : 55, 6);          // E1-ish drop in the abyss
    tgt(this._subG.gain, SUBG[i]);
    tgt(this._bodyG.gain, 0.075 - i * 0.006);
    tgt(this._col.frequency, 110 * IV[i], 6);
    tgt(this._twin.frequency, 110 * IV[i] + BEAT[i], 6);
    tgt(this._lfoVG.gain, VIB[i], 6);
    tgt(this._fb.gain, 0.36 + i * 0.02);
    // tracks mode: crossfade per-tier loops over the (now quiet) synth
    if (this._tracks) {
      var synthBed = 0.12; // synth stays as faint glue under the tracks
      tgt(this._synthBus.gain, synthBed, 2.5);
      var want = Math.max(0, i - 1); // tier 0 (surface) borrows tier-1, quieter
      var vol = i === 0 ? 0.45 : 1;
      if (!this._trackSrc || this._trackSrc.tier !== want || force) {
        var old = this._trackSrc;
        var src = ctx.createBufferSource(); src.buffer = this._tracks[want]; src.loop = true;
        var g = ctx.createGain(); g.gain.value = 0;
        src.connect(g); g.connect(this._comp);
        src.start(t, Math.random() * src.buffer.duration);
        g.gain.setTargetAtTime(vol, t, 1.4);
        this._trackSrc = { src: src, gain: g, tier: want };
        if (old) { old.gain.gain.setTargetAtTime(0, t, 1.2); old.src.stop(t + 5); }
      } else {
        this._trackSrc.gain.gain.setTargetAtTime(vol, t, 1.4);
      }
    }
  };

  AtmoEngine.prototype.setTier = function (tier) {
    var i = Math.max(0, Math.min(7, tier | 0));
    if (i === this._tier) return;
    this._tier = i;
    if (this.running) { this._applyTier(i); this._schedulePing(); }
  };

  AtmoEngine.prototype.start = function () {
    this._ensure(); if (!this._ctx) return;
    var ctx = this._ctx;
    if (ctx.state === "suspended") ctx.resume();
    this.running = true;
    this._master.gain.setTargetAtTime(this._level, ctx.currentTime, 1.8);
    this._applyTier(this._tier, true);
    this._schedulePing();
  };

  AtmoEngine.prototype.stop = function () {
    this.running = false;
    clearTimeout(this._pingTimer);
    if (!this._ctx) return;
    var ctx = this._ctx;
    this._master.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
    var self = this;
    setTimeout(function () { if (!self.running && ctx.state === "running") ctx.suspend(); }, 2600);
  };

  AtmoEngine.prototype.duck = function (on) {
    if (!this._ctx || !this.running) return;
    this._master.gain.setTargetAtTime(on ? this._level * 0.35 : this._level, this._ctx.currentTime, on ? 0.25 : 1.2);
  };

  AtmoEngine.prototype.dispose = function () {
    this.running = false;
    clearTimeout(this._pingTimer);
    try { if (this._ctx) this._ctx.close(); } catch (e) {}
    this._ctx = null;
  };

  window.AtmoEngine = AtmoEngine;
})();
