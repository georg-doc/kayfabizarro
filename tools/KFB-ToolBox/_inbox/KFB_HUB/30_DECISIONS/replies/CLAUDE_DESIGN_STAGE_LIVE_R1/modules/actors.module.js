// Darsteller-Modul · Host-Vertrag R1.2 · „Wireface demo stand-in“ (V-219).
// Die Wireface-Theatre-Figuren kommen aus dem Wireface SDK (@wireface/sdk/three, Download nur mit Konto).
// Liegt das SDK unter vendor/wireface/ vor, kann WS1 options.fromSdk(sdk) setzen; sonst steht hier ein beschrifteter Aufsteller,
// in den ein Standbild der Demo-Figur gezogen wird. Keine KayKit-Figur (V-214), keine neue Geometrie außer Ebene/Scheibe.
import * as THREE from 'three';

const LABEL = 'Wireface demo stand-in';
function labelSprite(text, sub) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 112; const x = c.getContext('2d');
  x.fillStyle = 'rgba(29,29,27,.92)'; x.beginPath(); x.roundRect(4, 4, 504, 104, 14); x.fill();
  x.fillStyle = '#fff'; x.font = '700 34px system-ui,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 256, 40);
  x.font = '500 24px ui-monospace,Menlo,monospace'; x.fillStyle = '#f6e3c8'; x.fillText(sub, 256, 80);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true })); s.scale.set(2.4, 0.525, 1); s.renderOrder = 10; return s;
}

export function create(o) {
  const id = o.id, H = o.height ?? 3.64, Wd = H * 0.6, g = new THREE.Group(); g.name = 'actor-' + id;
  g.position.set(o.x ?? 0, o.y ?? 0, o.z ?? 0);
  const cv = document.createElement('canvas'); cv.width = 600; cv.height = 1000; const x = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.02, side: THREE.DoubleSide, toneMapped: false });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(Wd, H), mat); panel.position.y = H / 2 + 0.06; panel.castShadow = true; g.add(panel);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(Wd * 0.42, Wd * 0.46, 0.08, 40), new THREE.MeshStandardMaterial({ color: '#3a342a', roughness: 0.9 }));
  base.position.y = 0.04; base.receiveShadow = base.castShadow = true; g.add(base);
  const tag = labelSprite(LABEL, o.role || id); tag.position.set(0, 0.55, 0.25); g.add(tag); // unten am Aufsteller, damit die Blase über dem Kopf frei bleibt
  let img = null, speaking = 0, t = 0, sdkState = 'WIREFACE_SDK_NOT_PRESENT';
  function draw() {
    x.clearRect(0, 0, 600, 1000);
    if (img) { const s = Math.min(600 / img.width, 1000 / img.height), w = img.width * s, h = img.height * s; x.drawImage(img, (600 - w) / 2, 1000 - h, w, h); }
    else {
      x.fillStyle = 'rgba(255,255,255,.82)'; x.beginPath(); x.roundRect(20, 20, 560, 960, 40); x.fill();
      x.setLineDash([22, 16]); x.lineWidth = 6; x.strokeStyle = '#6e1d10'; x.stroke(); x.setLineDash([]);
      x.fillStyle = '#1d1d1b'; x.textAlign = 'center'; x.font = '800 54px system-ui,sans-serif'; x.fillText(id, 300, 420);
      x.font = '600 34px system-ui,sans-serif'; x.fillText(o.role || '', 300, 480);
      x.font = '500 28px ui-monospace,Menlo,monospace'; x.fillStyle = '#6e1d10'; x.fillText('Standbild der', 300, 590); x.fillText('Wireface-Demo-Figur', 300, 630); x.fillText('hierher ziehen', 300, 670);
    }
    tex.needsUpdate = true;
  }
  draw();
  if (o.fromSdk) { try { o.fromSdk(g); sdkState = 'SDK_ADAPTER'; panel.visible = false; } catch (e) { sdkState = 'SDK_ERROR ' + e.message; } }
  const head = new THREE.Vector3();
  return {
    object3d: g, id,
    get sdkState() { return sdkState; },
    headWorld() { return g.localToWorld(head.set(0, H * 0.96 + 0.06, 0)); },
    faceBox() { return { center: g.localToWorld(new THREE.Vector3(0, H * 0.8, 0)), h: H * 0.42, w: Wd * 0.7 }; },
    setImage(im) { img = im; draw(); },
    setSpeaking(v) { speaking = v ? 1 : 0; },
    update(dt, ctx) {
      t += dt; const cam = ctx && ctx.camera; if (cam) { const p = g.getWorldPosition(new THREE.Vector3()); g.rotation.y = Math.atan2(cam.position.x - p.x, cam.position.z - p.z) * 0.85; }
      const step = Math.floor(t * 12) / 12; panel.position.y = H / 2 + 0.06 + (speaking ? Math.abs(Math.sin(step * 7)) * 0.05 : Math.sin(step * 1.6) * 0.015);
      panel.scale.y = 1 + (speaking ? Math.sin(step * 7) * 0.012 : 0); panel.scale.x = 1 / panel.scale.y;
    },
    dispose() { tex.dispose(); mat.dispose(); panel.geometry.dispose(); base.geometry.dispose(); base.material.dispose(); tag.material.map.dispose(); tag.material.dispose(); }
  };
}
