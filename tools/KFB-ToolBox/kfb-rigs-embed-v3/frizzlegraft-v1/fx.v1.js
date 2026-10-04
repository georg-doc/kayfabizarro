/* KFB FX v1 · Mündungs- und Treffer-Effekte am Waffenanker (14.09.2026).
   Hängt an »KFB muzzle« (graft-mount.v1), nie an Handknochen. Drei Arten aus WEAPON_CLASSES.fx:
   muzzle = Blitz an der Mündung + Leuchtspur + Treffer vorn · tip = Spur + Treffer (Bogen/Armbrust)
   · edge = Funke an der Klingenkante. Sprites in einer eigenen Gruppe, damit ein Kontaktbogen sie je Zelle
   ein- und ausblenden kann. Größen relativ zur Unterarmlänge der Figur, nicht in Metern geraten. */
export function makeFx(THREE, parent) {
  const tex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 3; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; x.beginPath(); x.moveTo(32 - Math.cos(a) * 30, 32 - Math.sin(a) * 30); x.lineTo(32 + Math.cos(a) * 30, 32 + Math.sin(a) * 30); x.stroke(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const root = new THREE.Group(); root.name = 'KFB fx'; parent.add(root);
  const live = [];
  const sprite = (color) => { const m = new THREE.SpriteMaterial({ map: tex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }); const s = new THREE.Sprite(m); root.add(s); return s; };
  const spawn = (obj, life, tick) => live.push({ obj, t: 0, life, tick });
  const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _d = new THREE.Vector3();
  /** muzzle: Object3D »KFB muzzle«; kind: muzzle|tip|edge; L: Unterarmlänge (Welt). */
  function fire(muzzle, kind, L) {
    if (!muzzle || !muzzle.parent) return;
    muzzle.getWorldPosition(_a); muzzle.parent.getWorldPosition(_b); _d.copy(_a).sub(_b); if (_d.lengthSq() < 1e-8) _d.set(0, 0, 1); _d.normalize();
    const here = _a.clone();
    if (kind === 'edge') { const s = sprite(0xfff2c0); s.position.copy(here); spawn(s, 0.1, (o, f) => { o.scale.setScalar(L * (0.5 + f * 0.9)); o.material.opacity = 1 - f; }); return; }
    const hit = here.clone().addScaledVector(_d, L * 3.2);
    if (kind === 'muzzle') { const s = sprite(0xffc040); s.position.copy(here); spawn(s, 0.09, (o, f) => { o.scale.setScalar(L * (0.6 + f * 1.1)); o.material.opacity = 1 - f * f; }); }
    const geo = new THREE.CylinderGeometry(L * 0.03, L * 0.03, here.distanceTo(hit), 5, 1); geo.translate(0, here.distanceTo(hit) / 2, 0);
    const tr = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: kind === 'tip' ? 0xd8e8ff : 0xffe08a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    tr.position.copy(here); tr.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), _d); root.add(tr);
    spawn(tr, kind === 'tip' ? 0.16 : 0.07, (o, f) => { o.material.opacity = 0.9 * (1 - f); });
    const h = sprite(0xffffff); h.position.copy(hit); h.visible = false;
    spawn(h, kind === 'tip' ? 0.3 : 0.16, (o, f) => { const on = f > (kind === 'tip' ? 0.45 : 0.3); o.visible = on; if (on) { const g = (f - (kind === 'tip' ? 0.45 : 0.3)) / (kind === 'tip' ? 0.55 : 0.7); o.scale.setScalar(L * (0.4 + g * 1.4)); o.material.opacity = 1 - g; } });
  }
  function update(dt) {
    for (let i = live.length - 1; i >= 0; i--) { const e = live[i]; e.t += dt; const f = Math.min(1, e.t / e.life); e.tick(e.obj, f); if (f >= 1) { root.remove(e.obj); if (e.obj.geometry) e.obj.geometry.dispose(); e.obj.material.dispose(); live.splice(i, 1); } }
  }
  function dispose() { for (const e of live) { root.remove(e.obj); if (e.obj.geometry) e.obj.geometry.dispose(); e.obj.material.dispose(); } live.length = 0; root.removeFromParent(); tex.dispose(); }
  return { root, fire, update, dispose, get count() { return live.length; } };
}

/* Auslösezeitpunkte je Clip, GEMESSEN aus der Rotationsspur der Waffenhand-Seite: Spitzen der
   Winkelgeschwindigkeit (Rückstoß, Sehnenschlag, Hieb) ≥ 50 % der größten Spitze, mindestens 120 ms
   auseinander. Erst der Slot-Knochen, wenn der ruhig ist (< 90°/s, z. B. Ranged_*_Shooting) die Hand;
   ist auch die ruhig, Dauerfeuer alle 150 ms. `how` sagt, welcher Weg es war. Nur für Clips einer
   Auslöse-Phase (Shoot/Shooting/Release/Attack/Spellcasting/Throw). */
export function fireTimes(THREE, clip, side) {
  if (!clip || !/Shoot|Release|Attack|Spellcast|Throw|Slice|Chop|Hammer|Pickax/i.test(clip.name)) return { times: [], how: 'keine Auslöse-Phase' };
  const s = side || 'r', q0 = new THREE.Quaternion(), q1 = new THREE.Quaternion();
  const peaks = (name) => {
    const tr = clip.tracks.find((t) => t.name === name + '.quaternion'); if (!tr || tr.times.length < 3) return null;
    const v = []; for (let i = 1; i < tr.times.length; i++) { q0.fromArray(tr.values, (i - 1) * 4); q1.fromArray(tr.values, i * 4); const dt = tr.times[i] - tr.times[i - 1] || 1e-3; v.push({ t: (tr.times[i] + tr.times[i - 1]) / 2, w: q0.angleTo(q1) / dt * 180 / Math.PI }); }
    const mx = Math.max(...v.map((x) => x.w)); if (mx < 90) return { max: mx, times: [] };
    const out = []; for (let i = 1; i < v.length - 1; i++) if (v[i].w >= v[i - 1].w && v[i].w >= v[i + 1].w && v[i].w >= mx * 0.5 && (!out.length || v[i].t - out[out.length - 1] > 0.12)) out.push(+v[i].t.toFixed(3));
    return { max: mx, times: out };
  };
  const a = peaks('handslot' + s); if (a && a.times.length) return { times: a.times, how: 'Slot-Spitzen ' + a.max.toFixed(0) + '°/s' };
  const b = peaks('hand' + s); if (b && b.times.length) return { times: b.times, how: 'Hand-Spitzen ' + b.max.toFixed(0) + '°/s (Slot ruhig)' };
  const out = []; for (let t = 0.05; t < clip.duration; t += 0.15) out.push(+t.toFixed(3));
  return { times: out, how: 'Dauerfeuer 150 ms (Slot und Hand ruhig)' };
}
