/* ============================================================================
   kfb-living.js — KFB Living Illustration Engine (exploration build v0.1.0)
   ----------------------------------------------------------------------------
   Render upgrade for the per-card canvas that kfb-viewer.js already produces.
   Takes ONE already-cropped, flat card canvas and returns a subtly animated
   layer. Canvas 2D only. No WebGL, no build step, no dependencies, no CDN.
   Shadow-DOM safe (operates only on the host element it is given).

   API:
     KFBLiving.attach(hostEl, {
       card:      HTMLCanvasElement   // required — already-cropped card bitmap
       treatment: 'still' | 'atmosphere' | 'depth' | 'shimmer' | 'boil' | 'kenburns'
       mood:      string              // e.g. "seductive, uncanny" (from artworkPrompt)
       intensity: 0..1.5              // default 1
       speed:     0..2                // default 1
       respectReducedMotion: bool     // default true → renders a still
     }) -> handle { canvas, preset, reducedMotion,
                    setIntensity(v), setSpeed(v), play(), pause(), destroy() }

     KFBLiving.parseMood(artworkPrompt) -> "seductive, uncanny" | null
     KFBLiving.analyze(cardCanvas)      -> shared analysis (cached per canvas)

   Design law (briefing §2/§5): stable frame, living interior. The card never
   moves; only the depicted world stirs. If it reads as a cartoon, it failed.
   ========================================================================= */
(function () {
  'use strict';
  if (window.KFBLiving) return;

  var REDUCED = null;
  try { REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch (e) { }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }

  /* ------------------------------------------------ mood → motion presets
     The Mood descriptor in artworkPrompt is the control input (briefing §2).
     Small keyword table, not per-card hand animation. */
  var MOOD_PRESETS = [
    { name: 'iridescent-slow', match: /seductive|uncanny|iridescent|hypnotic|glossy/i,
      tempo: 0.7, amp: 1.0, hueDrift: 1.2, dust: 0.8, mist: 0.9 },
    { name: 'near-still',      match: /drained|wistful|hollow|melancho|tired|empty|numb/i,
      tempo: 0.4, amp: 0.55, hueDrift: 0.3, dust: 1.0, mist: 0.6 },
    { name: 'ceremonial-sway', match: /ceremonial|preposterous|grandiose|pompous|solemn/i,
      tempo: 0.55, amp: 1.2, hueDrift: 0.5, dust: 0.7, mist: 1.1 },
    { name: 'uneasy-flicker',  match: /sinister|menac|paranoid|dread|ominous|anxious/i,
      tempo: 0.9, amp: 0.8, hueDrift: 0.4, dust: 1.2, mist: 1.2 },
    { name: 'default',         match: /./,
      tempo: 0.6, amp: 0.9, hueDrift: 0.7, dust: 1.0, mist: 1.0 }
  ];
  function presetFor(mood) {
    var m = mood || '';
    for (var i = 0; i < MOOD_PRESETS.length; i++) {
      if (MOOD_PRESETS[i].match.test(m)) return MOOD_PRESETS[i];
    }
    return MOOD_PRESETS[MOOD_PRESETS.length - 1];
  }
  function parseMood(artworkPrompt) {
    var m = /Mood:\s*([^.]+)\.?\s*$/i.exec(artworkPrompt || '');
    return m ? m[1].trim() : null;
  }

  /* ------------------------------------------------ one-time card analysis
     Auto-derived from the single flat image (briefing §7): no hand-authored
     masks required. Luminance heuristic:
       bright regions → shimmer zone (sky, dome, highlights)
       dark regions   → near/foreground (pseudo-depth layer)
     Feathered so nothing reads as a hard cutout. */
  var analysisCache = [];
  function analyze(card) {
    for (var i = 0; i < analysisCache.length; i++) {
      if (analysisCache[i].card === card) return analysisCache[i].a;
    }
    var sw = 128, sh = Math.max(8, Math.round(card.height / card.width * sw));
    var sc = document.createElement('canvas'); sc.width = sw; sc.height = sh;
    var sx = sc.getContext('2d');
    sx.drawImage(card, 0, 0, sw, sh);
    var d = sx.getImageData(0, 0, sw, sh).data;
    var bright = sx.createImageData(sw, sh);
    var near = sx.createImageData(sw, sh);
    var rS = 0, gS = 0, bS = 0, n = d.length / 4;
    /* pass 1: luminance histogram → card-adaptive thresholds. Fixed cutoffs
       fail on parchment decks (nearly everything is "bright"); quantiles
       confine the masks to the truly brightest / darkest regions. */
    var lums = new Float32Array(n);
    for (var p = 0, li = 0; p < d.length; p += 4, li++) {
      lums[li] = (0.2126 * d[p] + 0.7152 * d[p + 1] + 0.0722 * d[p + 2]) / 255;
      rS += d[p]; gS += d[p + 1]; bS += d[p + 2];
    }
    var sorted = Float32Array.from(lums).sort();
    var qBright = sorted[Math.floor(n * 0.82)];
    var qNear = sorted[Math.floor(n * 0.22)];
    var median = sorted[Math.floor(n * 0.5)];
    for (var p2 = 0, li2 = 0; p2 < d.length; p2 += 4, li2++) {
      var lum = lums[li2];
      bright.data[p2] = bright.data[p2 + 1] = bright.data[p2 + 2] = 255;
      near.data[p2] = near.data[p2 + 1] = near.data[p2 + 2] = 255;
      bright.data[p2 + 3] = Math.round(255 * smooth((lum - qBright) / 0.12));
      near.data[p2 + 3] = Math.round(255 * smooth((qNear - lum) / 0.12));
    }
    function maskCanvas(imgData) {
      var mc = document.createElement('canvas'); mc.width = sw; mc.height = sh;
      mc.getContext('2d').putImageData(imgData, 0, 0);
      /* feather: upscale with blur into a card-resolution mask */
      var out = document.createElement('canvas');
      out.width = Math.min(card.width, 1024);
      out.height = Math.round(out.width * card.height / card.width);
      var ox = out.getContext('2d');
      try { ox.filter = 'blur(' + Math.round(out.width / 90) + 'px)'; } catch (e) { }
      ox.drawImage(mc, 0, 0, out.width, out.height);
      return out;
    }
    var a = {
      avg: 'rgb(' + Math.round(rS / n) + ',' + Math.round(gS / n) + ',' + Math.round(bS / n) + ')',
      medLum: median,
      brightMask: maskCanvas(bright),
      nearMask: maskCanvas(near)
    };
    /* pre-masked card layers (used by depth + shimmer) */
    a.nearLayer = maskedLayer(card, a.nearMask);
    a.brightLayer = maskedLayer(card, a.brightMask);
    analysisCache.push({ card: card, a: a });
    while (analysisCache.length > 6) analysisCache.shift();
    return a;
  }
  function maskedLayer(card, mask) {
    var c = document.createElement('canvas');
    c.width = card.width; c.height = card.height;
    var x = c.getContext('2d');
    x.drawImage(card, 0, 0);
    x.globalCompositeOperation = 'destination-in';
    x.drawImage(mask, 0, 0, c.width, c.height);
    return c;
  }

  /* ------------------------------------------------ boiling-line filters
     Squigglevision: 3 SVG feTurbulence+feDisplacementMap filters with
     different seeds, swapped at ~7fps — stepped, not interpolated. */
  var boilUid = 0;
  function makeBoil(host) {
    var NS = 'http://www.w3.org/2000/svg';
    var uid = 'kfbBoil' + (++boilUid) + '_';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;';
    var defs = document.createElementNS(NS, 'defs');
    var maps = [];
    for (var i = 0; i < 3; i++) {
      var f = document.createElementNS(NS, 'filter');
      f.setAttribute('id', uid + i);
      f.setAttribute('x', '-6%'); f.setAttribute('y', '-6%');
      f.setAttribute('width', '112%'); f.setAttribute('height', '112%');
      var t = document.createElementNS(NS, 'feTurbulence');
      t.setAttribute('type', 'fractalNoise');
      t.setAttribute('baseFrequency', '0.014 0.022');
      t.setAttribute('numOctaves', '2');
      t.setAttribute('seed', String(2 + i * 11));
      t.setAttribute('result', 'n');
      var d = document.createElementNS(NS, 'feDisplacementMap');
      d.setAttribute('in', 'SourceGraphic');
      d.setAttribute('in2', 'n');
      d.setAttribute('scale', '6');
      d.setAttribute('xChannelSelector', 'R');
      d.setAttribute('yChannelSelector', 'G');
      f.appendChild(t); f.appendChild(d);
      defs.appendChild(f);
      maps.push(d);
    }
    svg.appendChild(defs);
    host.appendChild(svg);
    return { uid: uid, svg: svg, maps: maps };
  }

  /* ------------------------------------------------ sprites */
  function dotSprite(size, color) {
    var c = document.createElement('canvas'); c.width = c.height = size;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(255,248,236,0)');
    x.fillStyle = g; x.fillRect(0, 0, size, size);
    return c;
  }

  /* ------------------------------------------------ shared ticker */
  var live = [];
  var ticking = false;
  function loop(ts) {
    if (!live.length) { ticking = false; return; }
    for (var i = 0; i < live.length; i++) live[i]._frame(ts);
    requestAnimationFrame(loop);
  }
  function wake() { if (!ticking) { ticking = true; requestAnimationFrame(loop); } }

  /* ------------------------------------------------ attach */
  function attach(host, opts) {
    opts = opts || {};
    var card = opts.card;
    if (!card || !card.width) throw new Error('KFBLiving.attach: opts.card (canvas) required');
    var treatment = opts.treatment || 'still';
    var preset = presetFor(opts.mood);
    var an = analyze(card);

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;';
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d', { alpha: false });

    var h = {
      canvas: canvas,
      preset: preset,
      reducedMotion: false,
      intensity: opts.intensity != null ? opts.intensity : 1,
      speed: opts.speed != null ? opts.speed : 1,
      paused: false,
      visible: true,
      t0: performance.now() - Math.random() * 20000, /* de-sync panels */
      pointer: { x: 0, y: 0, tx: 0, ty: 0, active: 0 }
    };

    function fit() {
      var cw = host.clientWidth || 300;
      var ch = Math.round(cw * card.height / card.width);
      var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      var bw = Math.min(Math.round(cw * dpr), 1440);
      canvas.width = bw;
      canvas.height = Math.round(bw * card.height / card.width);
      canvas.style.height = ch + 'px';
      drawFrame(h.t0 + 1);
    }

    /* particles (treatment A) */
    var dust = [];
    var NDUST = Math.round(26 * preset.dust);
    for (var i = 0; i < NDUST; i++) {
      dust.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.3) * 0.006, vy: -(0.002 + Math.random() * 0.006),
        ph: Math.random() * Math.PI * 2, tw: 0.4 + Math.random() * 0.9,
        s: 0.5 + Math.random() * 1.1
      });
    }
    var dotWarm = dotSprite(24, 'rgba(255,246,225,0.9)');
    var dotCool = dotSprite(24, 'rgba(230,240,255,0.75)');
    var mistBlob = dotSprite(280, 'rgba(255,250,240,0.55)');
    /* light cards (parchment decks): light particles + screen are invisible —
       switch to ink motes / shadow mist with multiply instead */
    var lightCard = an.medLum > 0.55;
    if (lightCard) {
      dotWarm = dotSprite(24, 'rgba(92,70,48,0.9)');
      dotCool = dotSprite(24, 'rgba(64,74,90,0.8)');
      mistBlob = dotSprite(280, 'rgba(128,102,74,0.5)');
    }
    var particleBlend = lightCard ? 'multiply' : 'screen';
    var mistBlend = lightCard ? 'multiply' : 'soft-light';
    var mistAlpha = lightCard ? 0.2 : 0.34;
    var fx = document.createElement('canvas'); /* alpha offscreen for masked compositing */

    /* ---- frame renderers -------------------------------------------- */
    function drawBase(shiftX, shiftY, scale) {
      var W = canvas.width, H = canvas.height;
      var s = scale || 1;
      ctx.drawImage(card, (W - W * s) / 2 + (shiftX || 0), (H - H * s) / 2 + (shiftY || 0), W * s, H * s);
    }

    function drawAtmosphere(t) {
      var W = canvas.width, H = canvas.height;
      var I = h.intensity, tempo = preset.tempo * h.speed;
      drawBase();
      /* mist: three large soft blobs drifting on slow paths */
      ctx.save();
      ctx.globalCompositeOperation = mistBlend;
      for (var m = 0; m < 3; m++) {
        var mp = t * 0.05 * tempo + m * 2.4;
        var mx = W * (0.5 + 0.42 * Math.sin(mp * 0.6 + m * 1.9));
        var my = H * (0.45 + 0.32 * Math.cos(mp * 0.43 + m));
        var ms = W * (0.5 + 0.14 * Math.sin(mp));
        ctx.globalAlpha = Math.min(1, mistAlpha * I * preset.mist);
        ctx.drawImage(mistBlob, mx - ms / 2, my - ms / 2, ms, ms);
      }
      ctx.restore();
      /* dust: sparse, painterly, twinkling */
      ctx.save();
      ctx.globalCompositeOperation = particleBlend;
      for (var i = 0; i < dust.length; i++) {
        var p = dust[i];
        var px = ((p.x + p.vx * 2 * t * tempo) % 1 + 1) % 1;
        var py = ((p.y + p.vy * 2 * t * tempo) % 1 + 1) % 1;
        var a = 0.16 + 0.38 * (0.5 + 0.5 * Math.sin(t * p.tw * 1.8 * tempo + p.ph));
        ctx.globalAlpha = Math.min(1, a * I);
        var sz = p.s * W / 62;
        ctx.drawImage(i % 3 === 2 ? dotCool : dotWarm, px * W - sz / 2, py * H - sz / 2, sz, sz);
      }
      ctx.restore();
    }

    function drawDepth(t) {
      var W = canvas.width, H = canvas.height;
      var I = h.intensity, tempo = preset.tempo * h.speed;
      /* auto-orbit (lissajous) + eased pointer offset */
      var ox = Math.sin(t * 0.10 * tempo) * 0.7 + Math.sin(t * 0.043 * tempo + 1.3) * 0.3;
      var oy = Math.cos(t * 0.083 * tempo) * 0.6;
      var P = h.pointer;
      P.x += (P.tx * P.active - P.x) * 0.04;
      P.y += (P.ty * P.active - P.y) * 0.04;
      var dx = (ox * (1 - Math.abs(P.x)) + P.x * 1.6) * W * 0.006 * I * preset.amp;
      var dy = (oy * (1 - Math.abs(P.y)) + P.y * 1.2) * H * 0.006 * I * preset.amp;
      var overscan = 1.03 + 0.014 * Math.min(I, 2);
      /* far plane: whole card, drifts slightly against the near plane */
      drawBase(-dx * 0.45, -dy * 0.45, overscan);
      /* near plane: dark-region layer, drifts with the "camera", breathes */
      var breathe = overscan * (1 + 0.0035 * I * Math.sin(t * 0.14 * tempo));
      ctx.drawImage(an.nearLayer,
        (W - W * breathe) / 2 + dx * 0.85,
        (H - H * breathe) / 2 + dy * 0.85,
        W * breathe, H * breathe);
    }

    function drawShimmer(t) {
      var W = canvas.width, H = canvas.height;
      var I = h.intensity, tempo = preset.tempo * h.speed;
      drawBase();
      /* iridescent hue drift, confined to bright regions (the dome).
         Built in an ALPHA offscreen canvas — destination-in cannot cut an
         opaque (alpha:false) context, it just leaves black. */
      if (fx.width !== W || fx.height !== H) { fx.width = W; fx.height = H; }
      var fc = fx.getContext('2d');
      fc.globalCompositeOperation = 'source-over';
      fc.clearRect(0, 0, W, H);
      var ang = t * 0.1 * tempo * preset.hueDrift;
      var gx = Math.cos(ang) * W * 0.6, gy = Math.sin(ang) * H * 0.6;
      var g = fc.createLinearGradient(W / 2 - gx, H / 2 - gy, W / 2 + gx, H / 2 + gy);
      var hue = (t * 16 * tempo * preset.hueDrift) % 360;
      g.addColorStop(0, 'hsl(' + hue + ',75%,68%)');
      g.addColorStop(0.5, 'hsl(' + ((hue + 90) % 360) + ',70%,76%)');
      g.addColorStop(1, 'hsl(' + ((hue + 200) % 360) + ',75%,66%)');
      fc.fillStyle = g;
      fc.fillRect(0, 0, W, H);
      fc.globalCompositeOperation = 'destination-in';
      fc.drawImage(an.brightMask, 0, 0, W, H);
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = Math.min(1, 0.55 * I);
      ctx.drawImage(fx, 0, 0);
      ctx.restore();
      /* slow sheen sweep across highlights every ~7s */
      var period = 7 / Math.max(0.2, tempo);
      var ph = (t % period) / period;           /* 0..1 */
      var band = smooth(1 - Math.abs(ph - 0.5) * 4); /* visible mid-cycle */
      if (band > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = Math.min(1, 0.7 * band * I);
        var pos = (ph - 0.5) * 2;               /* -1..1 across the card */
        var bx = W * (0.5 + pos * 0.9);
        var sg = ctx.createLinearGradient(bx - W * 0.18, 0, bx + W * 0.18, H * 0.25);
        sg.addColorStop(0, 'rgba(255,255,255,0)');
        sg.addColorStop(0.5, 'rgba(255,252,240,0.85)');
        sg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = sg;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
      /* imperceptible candle-flicker of overall light */
      var fl = 0.5 + 0.5 * Math.sin(t * 0.9 * tempo) * Math.sin(t * 0.37 * tempo + 2);
      ctx.save();
      ctx.globalCompositeOperation = 'soft-light';
      ctx.globalAlpha = Math.min(1, 0.1 * I * fl);
      ctx.fillStyle = '#fff6e2';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    /* boiling line: stepped filter swap, base drawn once */
    var boil = treatment === 'boil' ? makeBoil(host) : null;
    var boilStep = -1;
    if (boil) canvas.style.transform = 'scale(1.02)'; /* hide displaced edges */
    function applyBoilScale() {
      if (!boil) return;
      var s = Math.round(4 + 4 * h.intensity);
      for (var i = 0; i < boil.maps.length; i++) boil.maps[i].setAttribute('scale', String(s));
    }
    function drawBoil(t) {
      var step = Math.floor(t * 7 * Math.max(0.2, h.speed * preset.tempo * 1.6)) % 3;
      if (step !== boilStep) {
        boilStep = step;
        canvas.style.filter = 'url(#' + boil.uid + step + ')';
      }
    }

    /* ken burns: slow zoom + pan of the whole card (chapter/cover use) */
    function drawKenBurns(t) {
      var W = canvas.width, H = canvas.height;
      var I = Math.min(h.intensity, 2), tempo = preset.tempo * h.speed;
      var ph = t * 0.03 * tempo;
      var z = 1.045 + 0.05 * I * (0.5 + 0.5 * Math.sin(ph));
      var mx = W * (z - 1) * 0.4, my = H * (z - 1) * 0.4;
      drawBase(Math.sin(ph * 0.7 + 1) * mx, Math.cos(ph * 0.53) * my, z);
    }

    function drawFrame(now) {
      var t = (now - h.t0) / 1000;
      if (treatment === 'atmosphere') drawAtmosphere(t);
      else if (treatment === 'depth') drawDepth(t);
      else if (treatment === 'shimmer') drawShimmer(t);
      else if (treatment === 'boil') { drawBase(); drawBoil(t); }
      else if (treatment === 'kenburns') drawKenBurns(t);
      else drawBase();
    }

    h._frame = function (ts) {
      if (h.paused || !h.visible || h.reducedMotion) return;
      if (treatment === 'boil') { drawBoil((ts - h.t0) / 1000); return; } /* cheap: filter swap only */
      drawFrame(ts);
    };

    /* pointer (depth parallax responds; others ignore) */
    function onMove(e) {
      var r = host.getBoundingClientRect();
      h.pointer.tx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1);
      h.pointer.ty = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1);
      h.pointer.active = 1;
    }
    function onLeave() { h.pointer.active = 0; }
    if (treatment === 'depth') {
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
    }

    /* visibility: pause panels that scrolled away */
    var io = null;
    if (window.IntersectionObserver) {
      io = new IntersectionObserver(function (es) {
        for (var i = 0; i < es.length; i++) h.visible = es[i].isIntersecting;
      }, { rootMargin: '120px' });
      io.observe(host);
    }
    var ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(fit); ro.observe(host); }

    /* reduced motion → beautiful still (briefing §5) */
    var respectRM = opts.respectReducedMotion !== false;
    function applyRM() {
      h.reducedMotion = !!(respectRM && REDUCED && REDUCED.matches);
      if (h.reducedMotion) {
        if (boil) canvas.style.filter = 'none';
        drawFrame(h.t0 + 1);
      }
    }
    if (REDUCED && REDUCED.addEventListener) REDUCED.addEventListener('change', applyRM);
    applyRM();

    h.setIntensity = function (v) { h.intensity = clamp(v, 0, 2.5); applyBoilScale(); if (h.reducedMotion || h.paused) drawFrame(performance.now()); };
    h.setSpeed = function (v) { h.speed = clamp(v, 0, 2); };
    h.pause = function () { h.paused = true; };
    h.play = function () { h.paused = false; wake(); };
    h.destroy = function () {
      var ix = live.indexOf(h); if (ix >= 0) live.splice(ix, 1);
      if (io) io.disconnect(); if (ro) ro.disconnect();
      if (REDUCED && REDUCED.removeEventListener) REDUCED.removeEventListener('change', applyRM);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      if (boil && boil.svg.parentNode) boil.svg.parentNode.removeChild(boil.svg);
      canvas.width = canvas.height = 0;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };

    applyBoilScale();
    fit();
    if (treatment !== 'still') { live.push(h); wake(); }
    return h;
  }

  window.KFBLiving = {
    version: '0.1.0',
    attach: attach,
    analyze: analyze,
    parseMood: parseMood,
    presets: MOOD_PRESETS
  };
})();
