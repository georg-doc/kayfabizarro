/* KFB Brush Playground · brush-core.js
 * Pure, DOM-free logic shared by the editor and the Node tests:
 *  - bplist00 reader + NSKeyedArchiver flattening for Procreate Brush.archive
 *  - safe .brush ZIP inspection (needs fflate, passed in)
 *  - decoded Procreate fields -> simulation parameters (HEURISTIC, not Procreate-equivalent)
 *  - deterministic stamp generator (seeded) for live drawing and replay
 * Nothing here reads the network. Brush files stay on the user's device.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.KFBBrushCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- limits for private local import ---------- */
  const LIMITS = {
    archiveBytes: 32e6,      // whole .brush file
    entries: 64,             // ZIP members
    entryBytes: 24e6,        // any single decompressed member
    totalBytes: 48e6,        // all decompressed members we accept
    plistBytes: 2e6,         // Brush.archive
    plistObjects: 20000,
    imagePixels: 4096 * 4096,
    imageSide: 4096
  };

  /* ---------- bplist00 ---------- */
  function parseBplist(bytes) {
    if (!(bytes instanceof Uint8Array)) bytes = new Uint8Array(bytes);
    if (bytes.length < 40 || bytes.length > LIMITS.plistBytes) throw Error('Brush.archive size out of range');
    const magic = String.fromCharCode.apply(null, bytes.subarray(0, 8));
    if (magic !== 'bplist00') throw Error('Brush.archive is not a binary plist');
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const T = bytes.length - 32;
    const offSize = bytes[T + 6], refSize = bytes[T + 7];
    const numObjects = readUInt(T + 8, 8), top = readUInt(T + 16, 8), tableOff = readUInt(T + 24, 8);
    if (numObjects > LIMITS.plistObjects || tableOff + numObjects * offSize > T || ![1, 2, 4, 8].includes(offSize) || ![1, 2, 4, 8].includes(refSize))
      throw Error('Malformed binary plist trailer');
    const cache = new Map(), active = new Set();

    function readUInt(pos, n) {
      if (pos < 0 || pos + n > bytes.length) throw Error('plist read out of bounds');
      let v = 0;
      for (let i = 0; i < n; i++) v = v * 256 + bytes[pos + i];
      return v;
    }
    function offsetOf(i) {
      if (i >= numObjects) throw Error('plist object ref out of range');
      return readUInt(tableOff + i * offSize, offSize);
    }
    function lenAt(pos, nib) {
      if (nib !== 0xf) return { n: nib, start: pos + 1 };
      const m = bytes[pos + 1];
      if ((m & 0xf0) !== 0x10) throw Error('plist bad length marker');
      const w = 1 << (m & 0xf);
      return { n: readUInt(pos + 2, w), start: pos + 2 + w };
    }
    function obj(i) {
      if (cache.has(i)) return cache.get(i);
      if (active.has(i)) throw Error('plist reference cycle');
      active.add(i);
      const pos = offsetOf(i), m = bytes[pos], hi = m >> 4, lo = m & 0xf;
      let v;
      switch (hi) {
        case 0x0: v = lo === 8 ? false : lo === 9 ? true : null; break;
        case 0x1: {
          const w = 1 << lo;
          if (w === 8) v = Number(dv.getBigInt64(pos + 1));
          else v = readUInt(pos + 1, w);
          break;
        }
        case 0x2: v = lo === 2 ? dv.getFloat32(pos + 1) : dv.getFloat64(pos + 1); break;
        case 0x3: v = { $date: dv.getFloat64(pos + 1) }; break;
        case 0x4: { const L = lenAt(pos, lo); v = bytes.slice(L.start, L.start + L.n); break; }
        case 0x5: { const L = lenAt(pos, lo); let s = ''; for (let k = 0; k < L.n; k++) s += String.fromCharCode(bytes[L.start + k]); v = s; break; }
        case 0x6: { const L = lenAt(pos, lo); let s = ''; for (let k = 0; k < L.n; k++) s += String.fromCharCode(dv.getUint16(L.start + 2 * k)); v = s; break; }
        case 0x8: v = { $uid: readUInt(pos + 1, lo + 1) }; break;
        case 0xa: { const L = lenAt(pos, lo); v = []; for (let k = 0; k < L.n; k++) v.push(obj(readUInt(L.start + k * refSize, refSize))); break; }
        case 0xd: {
          const L = lenAt(pos, lo); v = {};
          for (let k = 0; k < L.n; k++) {
            const key = obj(readUInt(L.start + k * refSize, refSize));
            v[String(key)] = obj(readUInt(L.start + (L.n + k) * refSize, refSize));
          }
          break;
        }
        default: throw Error('Unsupported plist object 0x' + m.toString(16));
      }
      active.delete(i); cache.set(i, v);
      return v;
    }
    return obj(top);
  }

  /* NSKeyedArchiver -> plain object of the root SilicaBrush (one level of UID resolution,
     nested dicts kept shallow so unknown newer fields stay visible instead of guessed). */
  function unarchive(plist) {
    const objects = plist && plist.$objects;
    if (!Array.isArray(objects) || !plist.$top) throw Error('Brush.archive is not an NSKeyedArchiver file');
    const rootRef = plist.$top.root || Object.values(plist.$top)[0];
    const deref = (v, depth) => {
      if (v && typeof v === 'object' && '$uid' in v) {
        const o = objects[v.$uid];
        if (o === '$null') return null;
        if (o && typeof o === 'object' && !Array.isArray(o) && !(o instanceof Uint8Array)) {
          if ('NS.string' in o) return o['NS.string'];
          if ('NS.bytes' in o) return o['NS.bytes'];
          if (depth > 2) return { $ref: v.$uid };
          const out = {};
          for (const k in o) if (k !== '$class') out[k] = deref(o[k], depth + 1);
          if (o.$class) { const c = objects[o.$class.$uid]; if (c && c.$classname) out.$class = c.$classname; }
          return out;
        }
        return o;
      }
      return v;
    };
    const rootObj = objects[rootRef.$uid];
    const flat = {};
    for (const k in rootObj) {
      if (k === '$class') { const c = objects[rootObj.$class.$uid]; flat.$class = c && c.$classname; continue; }
      flat[k] = deref(rootObj[k], 1);
    }
    return flat;
  }

  /* ---------- .brush ZIP (single brush; .brushset deferred) ---------- */
  const ACTIVE = { archive: 'Brush.archive', shape: 'Shape.png', grain: 'Grain.png', thumb: 'QuickLook/Thumbnail.png' };
  function inspectBrushZip(bytes, fflate) {
    if (!(bytes instanceof Uint8Array)) bytes = new Uint8Array(bytes);
    if (bytes.length > LIMITS.archiveBytes) throw Error('Archive exceeds 32 MB private-import limit');
    if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) throw Error('Not a ZIP-based .brush file');
    const seen = [], wanted = new Set(Object.values(ACTIVE));
    let total = 0;
    const files = fflate.unzipSync(bytes, {
      filter(f) {
        seen.push(f.name);
        if (seen.length > LIMITS.entries) throw Error('Too many ZIP entries');
        if (f.name.includes('..') || f.name.startsWith('/') || f.name.includes('\\')) throw Error('Unsafe path in archive: ' + f.name);
        if (!wanted.has(f.name)) return false;          // Reset/, author pictures etc. ignored
        if (f.originalSize > LIMITS.entryBytes) throw Error(f.name + ' too large');
        total += f.originalSize;
        if (total > LIMITS.totalBytes) throw Error('Archive expands beyond safety cap');
        return true;
      }
    });
    if (!files[ACTIVE.archive]) throw Error('Brush.archive missing: not a single Procreate brush' + (seen.some(n => n.endsWith('brushset.plist')) ? ' (.brushset import is a later phase)' : ''));
    if (!files[ACTIVE.shape]) throw Error('Shape.png missing (bundled Procreate shapes are not in the file)');
    for (const k in files) if (files[k].length > LIMITS.entryBytes) throw Error(k + ' decompressed beyond cap');
    const settings = unarchive(parseBplist(files[ACTIVE.archive]));
    return {
      settings,
      entries: seen,
      shapePng: files[ACTIVE.shape],
      grainPng: files[ACTIVE.grain] || null,
      thumbPng: files[ACTIVE.thumb] || null
    };
  }

  /* ---------- decoded fields -> simulation parameters ----------
     Status labels are shown in the inspector. HEURISTIC = we use the number with our own
     interpretation; IGNORED = decoded but not simulated; MISSING = referenced but not in file. */
  const num = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d);
  function mapSettings(s) {
    const p = {
      name: typeof s.name === 'string' ? s.name : 'Unnamed brush',
      spacing: Math.max(0.02, num(s.plotSpacing, 0.1)),
      jitter: num(s.plotJitter, 0),
      smoothing: num(s.plotSmoothing, 0),
      pressureSize: num(s.dynamicsPressureSize, 1),
      pressureOpacity: num(s.dynamicsPressureOpacity, 0),
      speedSize: num(s.dynamicsSpeedSize, 0),
      speedOpacity: num(s.dynamicsSpeedOpacity, 0),
      jitterSize: num(s.dynamicsJitterSize, 0),
      jitterOpacity: num(s.dynamicsJitterOpacity, 0),
      tiltSize: num(s.dynamicsTiltSize, 0),
      tiltOpacity: num(s.dynamicsTiltOpacity, 0),
      tiltAngle: num(s.dynamicsTiltAngle, 0),
      rotation: num(s.shapeRotation, 0),
      scatter: num(s.shapeScatter, 0),
      shapeInverted: !!s.shapeInverted,
      randomise: !!s.shapeRandomise,
      taperStart: num(s.taperStartLength, 0),
      taperEnd: num(s.taperEndLength, 0),
      taperSize: num(s.taperSize, 0),
      taperOpacity: num(s.taperOpacity, 0),
      flow: Math.max(0.05, num(s.dynamicsGlazeFlow, num(s.dynamicsGlazedFlow, 1))),
      // INTERPRETATION: glaze type 1 read as Procreate "Uniform glaze" = stamps do not build up
      // inside one stroke (per-pixel maximum). Every other type accumulates (source-over).
      glazeUniform: s.dynamicsGlazeType === 1 ? 1 : 0,
      opacity: num(s.paintOpacity, 1),
      grainScale: num(s.textureScale, 1),
      grainZoom: num(s.textureZoom, 1),
      grainInverted: !!s.textureInverted,
      grainMovement: num(s.textureMovement, 0),
      bundledGrain: typeof s.bundledGrainPath === 'string' ? s.bundledGrainPath : null,
      bundledShape: typeof s.bundledShapePath === 'string' ? s.bundledShapePath : null
    };
    return p;
  }
  const FIELD_STATUS = [
    ['dynamicsPressureSize', 'pressure → size', 'HEURISTIC'],
    ['dynamicsPressureOpacity', 'pressure → opacity', 'HEURISTIC'],
    ['dynamicsSpeedSize', 'speed → size', 'HEURISTIC'],
    ['dynamicsSpeedOpacity', 'speed → opacity', 'HEURISTIC'],
    ['dynamicsJitterSize', 'size jitter', 'HEURISTIC'],
    ['dynamicsJitterOpacity', 'opacity jitter', 'HEURISTIC'],
    ['dynamicsTiltSize', 'tilt → size (pen only)', 'HEURISTIC'],
    ['dynamicsTiltOpacity', 'tilt → opacity (pen only)', 'HEURISTIC'],
    ['dynamicsTiltAngle', 'tilt threshold', 'HEURISTIC'],
    ['shapeRotation', 'follow stroke direction', 'HEURISTIC'],
    ['shapeScatter', 'random stamp rotation', 'HEURISTIC'],
    ['shapeInverted', 'shape polarity', 'HEURISTIC'],
    ['plotSpacing', 'stamp spacing', 'HEURISTIC'],
    ['plotJitter', 'lateral position jitter', 'HEURISTIC'],
    ['plotSmoothing', 'streamline smoothing', 'HEURISTIC'],
    ['taperStartLength', 'start taper length', 'HEURISTIC'],
    ['taperEndLength', 'end taper length', 'HEURISTIC'],
    ['taperSize', 'taper size amount', 'HEURISTIC'],
    ['taperOpacity', 'taper opacity amount', 'HEURISTIC'],
    ['dynamicsGlazeFlow', 'glaze flow per stamp', 'HEURISTIC'],
    ['dynamicsGlazeType', 'glaze mode: 1 → uniform (no build-up), else accumulate', 'HEURISTIC'],
    ['dynamicsGlazedFlow', 'glaze flow per stamp (newer format)', 'HEURISTIC'],
    ['textureScale', 'grain scale', 'HEURISTIC'],
    ['textureInverted', 'grain polarity', 'HEURISTIC'],
    ['textureMovement', 'grain movement (rolling)', 'IGNORED · texturized only'],
    ['textureZoom', 'grain zoom', 'IGNORED'],
    ['textureRotation', 'grain rotation', 'IGNORED'],
    ['textureOrientation', 'grain orientation', 'IGNORED'],
    ['shapeOrientation', 'shape orientation mode', 'IGNORED'],
    ['shapeAzimuth', 'azimuth rotation', 'IGNORED'],
    ['dynamicsFalloff', 'falloff', 'IGNORED'],
    ['dynamicsMix', 'wet mix', 'IGNORED'],
    ['dynamicsLoad', 'wet load', 'IGNORED'],
    ['dynamicsPressureSpeed', 'pressure smoothing', 'IGNORED'],
    ['paintSize', 'Procreate size slider', 'IGNORED · UI size in px'],
    ['maxSize', 'size limit', 'IGNORED'],
    ['minSize', 'size limit', 'IGNORED']
  ];

  /* ---------- deterministic randomness ---------- */
  function rng(seed) {
    let x = (seed | 0) || 0x9e3779b9;
    return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 4294967296; };
  }
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  /* Pixel lengths for Procreate's normalised taper lengths. Heuristic constant. */
  const TAPER_PX = 600;
  /* Screen (CSS) px/ms that counts as "fast" (speed norm 1). Heuristic constant.
     Strokes carry speedScale = CSS px per canvas px so speed does not depend on window size. */
  const FAST_SPEED = 4;

  /* Effective per-stroke parameters: decoded brush values, optionally overridden in the UI. */
  function strokeParams(brushParams, overrides) {
    return Object.assign({}, brushParams, overrides || {});
  }

  /* Stamp generator. Feed samples one by one (live) or all at once (replay).
     sample = {x,y,t,p,alt}  p: 0..1 pressure; alt: altitude angle in radians or null.
     settings = {size, seed, params} */
  function createStamper(settings) {
    const P = settings.params, base = settings.size, rand = rng(settings.seed), speedScale = settings.speedScale || 1;
    const taperStartPx = P.taperStart * TAPER_PX, taperEndPx = P.taperEnd * TAPER_PX;
    let prev = null, carry = 0, arc = 0, speed = 0, sx = 0, sy = 0, first = true;
    const totalLen = settings.totalLength; // known only on final replay (end taper)

    function dynamics(p, alt, s, atArc) {
      const pf = 1 - P.pressureSize * (1 - p);
      const sf = 1 - P.speedSize * s;
      let tf = 1, tof = 1;
      if (alt != null) {
        const tilt = clamp(1 - alt / (Math.PI / 2), 0, 1);
        const t = P.tiltAngle < 1 ? clamp((tilt - P.tiltAngle) / (1 - P.tiltAngle), 0, 1) : 0;
        tf = 1 + P.tiltSize * t;
        tof = 1 - P.tiltOpacity * t;
      }
      let taper = 1, taperO = 1;
      if (taperStartPx > 0 && atArc < taperStartPx) {
        const u = atArc / taperStartPx;
        taper = Math.min(taper, 1 - P.taperSize * (1 - u));
        taperO = Math.min(taperO, 1 - P.taperOpacity * (1 - u));
      }
      if (totalLen != null && taperEndPx > 0 && totalLen - atArc < taperEndPx) {
        const u = clamp((totalLen - atArc) / taperEndPx, 0, 1);
        taper = Math.min(taper, 1 - P.taperSize * (1 - u));
        taperO = Math.min(taperO, 1 - P.taperOpacity * (1 - u));
      }
      const size = base * clamp(pf, 0.02, 2) * clamp(sf, 0.05, 2) * tf * clamp(taper, 0.02, 1);
      const alpha = P.flow * clamp(1 - P.pressureOpacity * (1 - p), 0, 1) * clamp(1 - P.speedOpacity * s, 0.03, 1) * clamp(tof, 0, 1) * clamp(taperO, 0, 1);
      return { size, alpha };
    }

    function stamp(x, y, heading, p, alt, s, atArc, out) {
      const d = dynamics(p, alt, s, atArc);
      const jit = 1 - P.jitterSize * rand();
      const ajit = 1 - P.jitterOpacity * rand();
      const ang = P.rotation * heading + (rand() - 0.5) * 2 * Math.PI * P.scatter;
      const lat = (rand() - 0.5) * 2 * P.jitter * d.size * 4;
      const size = Math.max(0.5, d.size * jit);
      out.push({
        x: x - Math.sin(heading) * lat,
        y: y + Math.cos(heading) * lat,
        size,
        angle: ang,
        alpha: clamp(d.alpha * ajit, 0, 1)
      });
      return size;
    }

    return {
      add(sample, out) {
        out = out || [];
        const smooth = clamp(P.smoothing, 0, 0.95);
        if (first) {
          sx = sample.x; sy = sample.y; first = false;
          prev = { x: sx, y: sy, t: sample.t, p: sample.p, alt: sample.alt };
          stamp(sx, sy, 0, sample.p, sample.alt, 0, 0, out);
          carry = 0;
          return out;
        }
        sx += (sample.x - sx) * (1 - smooth);
        sy += (sample.y - sy) * (1 - smooth);
        const dx = sx - prev.x, dy = sy - prev.y, dist = Math.hypot(dx, dy);
        const dt = Math.max(1, sample.t - prev.t);
        speed += (dist / dt - speed) * 0.25;
        const s = clamp(speed * speedScale / FAST_SPEED, 0, 1);
        if (dist < 1e-6) { prev.t = sample.t; return out; }
        const heading = Math.atan2(dy, dx);
        let travelled = 0;
        // next stamp distance depends on the current diameter
        for (let guard = 0; guard < 100000; guard++) {
          const f0 = travelled / dist;
          const pAt = prev.p + (sample.p - prev.p) * f0;
          const est = dynamics(pAt, sample.alt, s, arc + travelled).size;
          const step = Math.max(0.5, est * P.spacing) - carry;
          if (travelled + step > dist) { carry += dist - travelled; break; }
          travelled += step; carry = 0;
          const f = travelled / dist;
          const pp = prev.p + (sample.p - prev.p) * f;
          stamp(prev.x + dx * f, prev.y + dy * f, heading, pp, sample.alt, s, arc + travelled, out);
        }
        arc += dist;
        prev = { x: sx, y: sy, t: sample.t, p: sample.p, alt: sample.alt };
        return out;
      },
      get length() { return arc; }
    };
  }

  /* Arc length of the raw samples after the same smoothing the stamper applies. */
  function pathLength(points, smoothing) {
    const sm = clamp(smoothing || 0, 0, 0.95);
    if (!points.length) return 0;
    let sx = points[0].x, sy = points[0].y, L = 0;
    for (let i = 1; i < points.length; i++) {
      const nx = sx + (points[i].x - sx) * (1 - sm), ny = sy + (points[i].y - sy) * (1 - sm);
      L += Math.hypot(nx - sx, ny - sy); sx = nx; sy = ny;
    }
    return L;
  }

  /* Full deterministic replay of a stroke record (used for commit, undo/redo, comparison). */
  function stampsForStroke(stroke) {
    const params = stroke.params;
    const st = createStamper({ size: stroke.size, seed: stroke.seed, params, speedScale: stroke.speedScale, totalLength: pathLength(stroke.points, params.smoothing) });
    const out = [];
    for (const pt of stroke.points) st.add(pt, out);
    return out;
  }

  return { LIMITS, FIELD_STATUS, parseBplist, unarchive, inspectBrushZip, mapSettings, strokeParams, createStamper, stampsForStroke, pathLength, rng, TAPER_PX, FAST_SPEED };
});
