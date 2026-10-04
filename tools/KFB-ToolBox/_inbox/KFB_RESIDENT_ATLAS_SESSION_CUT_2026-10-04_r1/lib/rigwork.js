/* KFB Resident Atlas · Rig-Werkstatt (S7)
   Gliederpuppe statt Auswahlliste: sichtbare Anfasser im Raum, IK auf Hände und Füße,
   Boden-Haftung, und Absetzen von Requisiten auf die nächste Fläche.

   Was hier NICHT passiert: nichts wird an data/cast.js geschrieben. Jeder Griff landet über
   `studio.recordBone` / `studio.recordNode` in derselben Sammelstelle wie der alte Anfasser,
   wird über `studio.post()` jeden Frame wieder aufgetragen und ist damit exportierbar. Die
   Puppe ist eine Eingabeform für dieselben Korrekturen, kein zweiter Datenpfad. */
import * as THREE from 'three';
import { reachChain, skinnedWorld } from './atlas.js';

const N = (s) => (s || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
const _v = new THREE.Vector3();

/* Unterkante auf der POSIERTEN Haut. Box3 sieht die Skinning-Verformung nicht — dieselbe
   Falle wie in atlas.js (S9/S33b), hier noch einmal gebraucht, weil die Puppe die Pose
   ÄNDERT und die Bind-Pose-Box danach erst recht nichts mehr aussagt. */
export function lowestPosedY(node, step = 3) {
  let min = Infinity, skinned = false;
  node.updateWorldMatrix(true, true);
  node.traverse((o) => {
    if (!o.isSkinnedMesh || !o.visible) return;
    skinned = true;
    const pa = o.geometry.attributes.position;
    for (let i = 0; i < pa.count; i += step) {
      skinnedWorld(o, i, _v);
      if (_v.y < min) min = _v.y;
    }
  });
  return skinned && Number.isFinite(min) ? min : new THREE.Box3().setFromObject(node).min.y;
}

/* Absetzen wohnt in lib/edit-layer.js, nicht hier. Zwei Umsetzungen derselben Geste sind zwei
   Wahrheiten, und die zweite gewinnt immer beim nächsten Handgriff. */

/* ---------- die Puppe ----------
   Anfasser werden aus der HIERARCHIE abgeleitet, nicht aus einer Namensliste: Spitze über ein
   tolerantes Muster suchen (der Loader frisst den Punkt, `wrist.l` kommt als `wristl` an), Kette
   sind die N Bone-Eltern darüber. Was nicht gefunden wird, wird GEMELDET statt still zu fehlen —
   der Legacy-Rig hat vier Bones und keine Beine, und eine Puppe, die dort stumm bleibt, sieht
   aus wie ein kaputtes Werkzeug. */
const SPEC = [
  { key: 'hand.l', label: 'Hand links', kind: 'ik', links: 3, color: 0x6fd1ff, head: ['hand', 'wrist'], side: 'l' },
  { key: 'hand.r', label: 'Hand rechts', kind: 'ik', links: 3, color: 0x6fd1ff, head: ['hand', 'wrist'], side: 'r' },
  { key: 'foot.l', label: 'Fuß links', kind: 'ik', links: 2, color: 0x9ad36a, head: ['foot', 'toe'], side: 'l', foot: true },
  { key: 'foot.r', label: 'Fuß rechts', kind: 'ik', links: 2, color: 0x9ad36a, head: ['foot', 'toe'], side: 'r', foot: true },
  { key: 'head', label: 'Kopf drehen', kind: 'rot', color: 0xe8c84a, head: ['head'] },
  { key: 'chest', label: 'Brust drehen', kind: 'rot', color: 0xd39ad3, head: ['chest', 'torso', 'spine', 'upperbody'] },
  { key: 'hips', label: 'Hüfte · ganze Figur', kind: 'root', color: 0xf0b37e, head: ['hips', 'pelvis', 'body', 'root'] }
];

/* Die Puppe bringt KEINEN eigenen Anfasser mit. Sie leiht sich den einen aus der Editor-Schicht
   (`lib/edit-layer.js`) — zwei TransformControls auf demselben Canvas waren genau der Fehler,
   der das Werkzeug unbedienbar gemacht hat. */
export function makePuppet(viewer, edit) {
  const group = new THREE.Group();
  group.name = 'puppet-handles';
  viewer.scene.add(group);

  const gizmo = edit.gizmo;
  const listeners = new Set();
  const notify = () => listeners.forEach((f) => f());

  const P = {
    on: false, actor: null, node: null, nodeId: null, studio: null,
    handles: [], missing: [], active: null, dragging: false,
    stick: false, pins: new Map(), lastHit: 0, unit: 0.05, _prev: new THREE.Vector3(),

    onChange(f) { listeners.add(f); },
    busy() { return edit.busy(); },

    mount(actor, node, nodeId, studio) {
      P.unmount();
      P.actor = actor; P.node = node; P.nodeId = nodeId; P.studio = studio;
      const bones = [];
      actor.traverse((o) => { if (o.isBone || o.type === 'Bone') bones.push(o); });
      if (!bones.length) { P.missing = ['kein Bone im Aktor — assembliertes Legacy-Teil, keine Puppe möglich']; notify(); return P; }

      const h = new THREE.Box3().setFromObject(actor).getSize(_v.clone()).y || 2;
      P.unit = Math.max(0.03, h / 26);

      for (const s of SPEC) {
        const tip = findTip(bones, s);
        if (!tip) { P.missing.push(s.label); continue; }
        const chain = s.kind === 'ik' ? chainOf(tip, s.links) : [];
        if (s.kind === 'ik' && chain.length < 2) { P.missing.push(`${s.label} (nur ${chain.length} Kettenglied)`); continue; }
        const marker = makeMarker(s, P.unit);
        marker.userData.handle = s.key;
        group.add(marker);
        P.handles.push({ ...s, tip, chain, marker, residual: null, bone: tip });
      }
      P.setVisible(P.on);
      notify();
      return P;
    },

    unmount() {
      if (P.active) edit.release();
      for (const hh of P.handles) { group.remove(hh.marker); hh.marker.geometry.dispose(); hh.marker.material.dispose(); }
      P.handles = []; P.missing = []; P.active = null; P.pins.clear(); P.stick = false;
      P.actor = null; P.node = null;
    },

    setOn(on) {
      P.on = on;
      P.setVisible(on);
      if (!on) { if (P.active) edit.release(); P.active = null; }
      notify();
    },
    setVisible(v) { group.visible = v && P.handles.length > 0; },

    select(key) {
      const hh = P.handles.find((x) => x.key === key);
      if (!hh) return null;
      P.active = hh;
      P._prev.copy(hh.marker.position);
      edit.borrow(hh.kind === 'rot' ? hh.bone : hh.marker,
                  hh.kind === 'rot' ? 'rotate' : 'translate',
                  () => P.apply(hh), hh.label);
      notify();
      return hh;
    },
    deselect() { P.active = null; edit.release(); notify(); },

    /* Ein Zug am Anfasser landet hier — dieselbe Stelle, egal ob der Griff an einem IK-Ziel,
       an einem Bone oder an der Hüfte hing. */
    apply(hh) {
      if (!P.studio) return;
      if (hh.kind === 'rot') {
        P.studio.recordBone(hh.bone.name, hh.bone);
      } else if (hh.kind === 'root') {
        P.node.position.add(_v.copy(hh.marker.position).sub(P._prev));
        P._prev.copy(hh.marker.position);
        P.node.updateWorldMatrix(true, true);
        if (P.stick) P.resolvePins();
        P.studio.recordNode(P.nodeId, P.node);
      } else {
        P.solve(hh);
        if (P.stick && !hh.foot) P.resolvePins();
      }
      notify();
    },

    /* Boden-Haftung ist kein Schalter auf eine Physik, sondern ein festgehaltener MESSWERT:
       die Weltposition beider Fußspitzen im Moment des Einrastens. Jede spätere Bewegung von
       Hüfte oder Oberkörper zieht die Beine per IK auf genau diese zwei Punkte zurück. */
    setStick(on) {
      P.stick = on;
      P.pins.clear();
      if (on) for (const hh of P.handles) if (hh.foot) P.pins.set(hh.key, hh.tip.getWorldPosition(new THREE.Vector3()));
      notify();
      return P.pins.size;
    },

    ground() {
      if (!P.node) return null;
      const y = lowestPosedY(P.node);
      P.node.position.y -= y;
      P.node.updateWorldMatrix(true, true);
      for (const v of P.pins.values()) v.y -= y;
      P.studio.recordNode(P.nodeId, P.node);
      notify();
      return +(-y).toFixed(4);
    },

    solve(hh) {
      const res = reachChain(P.actor, hh.chain.map((b) => b.name), hh.tip.name, hh.marker.position, 18);
      hh.residual = res ? +res.after.toFixed(4) : null;
      for (const b of hh.chain) P.studio.recordBone(b.name, b);
      return res;
    },
    resolvePins() {
      for (const hh of P.handles) {
        if (!hh.foot || !P.pins.has(hh.key)) continue;
        hh.marker.position.copy(P.pins.get(hh.key));
        P.solve(hh);
      }
    },

    /* Marker folgen den Bones — AUSSER dem gerade gezogenen und den eingerasteten Füßen.
       Ein Marker, der nach dem Loslassen auf die erreichte Stelle zurückspringt, ist die
       ehrliche Rückmeldung bei einem unerreichbaren Ziel: der Arm ist zu kurz, und man sieht es. */
    post() {
      if (!P.on) return;
      for (const hh of P.handles) {
        if (hh === P.active && gizmo.dragging) continue;
        if (hh.foot && P.stick && P.pins.has(hh.key)) { hh.marker.position.copy(P.pins.get(hh.key)); continue; }
        if (hh.kind === 'root') hh.marker.position.copy(hh.tip.getWorldPosition(_v));
        else hh.marker.position.copy(hh.tip.getWorldPosition(_v));
      }
    },

    state() {
      return {
        on: P.on, stick: P.stick, pinned: P.pins.size, missing: P.missing.slice(),
        active: P.active ? P.active.key : null,
        handles: P.handles.map((h) => ({ key: h.key, label: h.label, kind: h.kind, bone: h.tip.name, residual: h.residual }))
      };
    }
  };

  gizmo.addEventListener('dragging-changed', (e) => {
    if (e.value && P.active) P._prev.copy(P.active.marker.position);
  });

  /* Anspruch auf den Klick, angemeldet bei der Editor-Schicht statt als eigener Listener in der
     Capture-Phase. Ein Marker liegt VOR der Figur; ohne diesen Vorrang wählt derselbe Klick den
     Anfasser UND das Körperteil dahinter. */
  edit.addClaim((ray) => {
    if (!P.on || !P.handles.length) return false;
    const hit = ray.intersectObjects(group.children, false)[0];
    if (!hit) return false;
    P.select(hit.object.userData.handle);
    return true;
  });

  return P;
}

/* Die Reihenfolge in `head` ist eine RANGFOLGE, keine Alternativenliste. Nach Tiefe allein zu
   wählen nahm bei jedem Fuß die ZEHE (tiefer als der Fuß) und bei jeder Hand das Handgelenk —
   und eine Kette, die am Handgelenk endet und an der Schulter nicht anfängt, erreicht nichts:
   gemessen 0,80 Restfehler auf einer 2,3 hohen Figur, weil nur der Unterarm drehen durfte. */
function findTip(bones, s) {
  for (const pat of s.head) {
    const cands = bones.filter((b) => {
      const n = N(b.name);
      if (n.includes('slot') || n.includes('poletarget') || n.includes('ik')) return false;
      if (!n.startsWith(pat)) return false;
      if (!s.side) return true;
      return n.endsWith(s.side) || n.endsWith(s.side + '001') || n.includes(s.side === 'l' ? 'left' : 'right');
    });
    if (cands.length) return cands.sort((a, b) => depth(b) - depth(a))[0];
  }
  return null;
}
function depth(o) { let d = 0, p = o; while (p) { d++; p = p.parent; } return d; }
function chainOf(tip, links) {
  const out = [];
  let o = tip.parent;
  while (o && (o.isBone || o.type === 'Bone') && out.length < links) { out.unshift(o); o = o.parent; }
  return out;
}

/* depthTest aus: Hüfte und Füße liegen IM Körper. Ein Anfasser, den die eigene Figur verdeckt,
   ist kein Anfasser. */
function makeMarker(s, u) {
  const geo = s.kind === 'ik' ? new THREE.SphereGeometry(u, 16, 12)
    : s.kind === 'rot' ? new THREE.OctahedronGeometry(u * 1.15)
      : new THREE.BoxGeometry(u * 1.7, u * 1.7, u * 1.7);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: s.color, transparent: true, opacity: 0.85, depthTest: false }));
  m.renderOrder = 999;
  return m;
}
