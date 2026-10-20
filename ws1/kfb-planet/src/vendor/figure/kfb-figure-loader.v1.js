// kfb-figure-loader.v1.js · kfb.figure-loader/1 · V-391 / V-409 / V-422 · WS1, vendorbar (Bühne, Dramatis Personae, ToolBox-Studio)
// Eine Figur kommt nur über ihre Karte (kfb.figure/1, WS0 replies/FIGURES_R1/figures/<id>.figure.json). Der Loader
//   1. prüft die Karte (Schema, eyeRig, sha256 des Körpers, Samt ≤ 0,05, Status-Tor) – checkCard, rein, ohne three und DOM;
//   2. lädt den Körper als Bytes, rechnet sha256 im Browser nach und lehnt ab, wenn er nicht zur Karte passt – loadFigureBody;
//   3. setzt bei Kopfteil-Figuren (eyeRig.seat 'headpart-socket', Aliens) Kopf, EyeRig v6 und die E2-Lidhaut nach dem WS0-Beweis
//      E2_ATTACH_R1/proof_r1e.html zusammen – buildHeadpartEyes. Lider und Sockel werden nicht selbst gebaut (V-422).
// Abweichung vom Karten-Körper nur über eine Varianten-Datei (kfb.figure-variant/1), die an Karten-id und Karten-sha256 hängt
// (heute: Sockelrand 80° für die Aliens, V-422/V-430) – applyVariant.
// Keine Abhängigkeit außer dem three-Namensraum und GLTFLoader, die der Wirt übergibt (gleiche Klassen wie seine Szene).
export const FIGURE_SCHEMA = 'kfb.figure/1'
export const VARIANT_SCHEMA = 'kfb.figure-variant/1'
export const LOADER_SCHEMA = 'kfb.figure-loader/1'

// Status-Tor (FIGURE_SCHEMA_R1 Regel 2 und 5): approved überall, candidate auf Bühne/Beweis (Vermerk außerhalb des Bildes), open-design nur in der Werkstatt
export function checkCard(card, { sha256 = null, where = 'stage' } = {}) {
  if (!card) return { ok: false, reason: 'keine Karte' }
  if (card.schema !== FIGURE_SCHEMA) return { ok: false, reason: 'Schema ist nicht ' + FIGURE_SCHEMA }
  if (!card.eyeRig) return { ok: false, reason: 'eyeRig fehlt' }
  if (card.eyeRig.required === false && !card.eyeRig.none?.reason) return { ok: false, reason: 'eyeRig.required=false ohne none.reason' }
  if (!card.body?.glb?.sha256) return { ok: false, reason: 'body.glb.sha256 fehlt' }
  if (sha256 !== card.body.glb.sha256) return { ok: false, reason: sha256 ? 'Körper-GLB passt nicht zur Karte (sha256)' : 'kein lokaler Körper zur Karte' }
  if (!card.material) return { ok: false, reason: 'material fehlt' }
  if (!(card.material.sheenMax <= 0.05)) return { ok: false, reason: 'material.sheenMax > 0,05' }
  const st = card.approval?.status
  if (st === 'open-design' && where !== 'workshop') return { ok: false, reason: 'open-design: nur Figuren-Werkstatt' }
  if (!['approved', 'candidate', 'open-design'].includes(st)) return { ok: false, reason: 'approval.status fehlt' }
  return { ok: true, reason: null, status: st }
}

// Variante: ersetzt nur body.glb und hängt an Karte (id + sha256), sonst Ablehnung. Gibt eine Kopie der Karte zurück.
export function applyVariant(card, variant) {
  if (!variant) return { ok: true, card, variant: null }
  if (variant.schema !== VARIANT_SCHEMA) return { ok: false, reason: 'Variante: Schema ist nicht ' + VARIANT_SCHEMA }
  if (variant.base !== card?.id) return { ok: false, reason: 'Variante gehört zu ' + variant.base }
  if (variant.baseSha256 !== card.body?.glb?.sha256) return { ok: false, reason: 'Variante passt nicht zum Karten-Körper (sha256)' }
  if (!variant.body?.glb?.sha256) return { ok: false, reason: 'Variante: body.glb.sha256 fehlt' }
  return { ok: true, card: { ...card, body: { ...card.body, glb: { ...variant.body.glb } } }, variant: { id: variant.id, vRef: variant.vRef || [] } }
}

// Feste Adresse eines Karten-GLB (Commit-Pin; ohne Commit keine Adresse, nie ein beweglicher Branch)
export function glbUrl(glb, base = 'https://raw.githubusercontent.com/') {
  if (!glb?.repo || !glb?.commit || !glb?.path) return null
  return base + glb.repo + '/' + glb.commit + '/' + glb.path.split('/').map(encodeURIComponent).join('/')
}

export async function sha256Hex(buf) {
  const d = await globalThis.crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(d), (b) => b.toString(16).padStart(2, '0')).join('')
}

// loadFigureBody({ card, url?, where, GLTFLoader, fetch? }) → { ok, card, status, sha256, gltf } | { ok: false, reason, sha256? }
// url: lokaler Pfad (gebündelt) oder null → glbUrl(card.body.glb). Der Körper wird erst nach bestandener Prüfung geparst.
export async function loadFigureBody({ card, url = null, where = 'stage', GLTFLoader, fetch = globalThis.fetch.bind(globalThis) } = {}) {
  const pre = checkCard(card, { sha256: card?.body?.glb?.sha256, where }) // Karte ohne Körper-Prüfung (die kommt nach dem Laden)
  if (!pre.ok) return { ok: false, reason: pre.reason }
  const src = url || glbUrl(card.body.glb)
  if (!src) return { ok: false, reason: 'keine feste Adresse für den Körper (commit fehlt)' }
  let buf
  try { const r = await fetch(src); if (!r.ok) return { ok: false, reason: 'Körper nicht ladbar (HTTP ' + r.status + ')' }; buf = await r.arrayBuffer() }
  catch (e) { return { ok: false, reason: 'Körper nicht ladbar (' + (e?.message || e) + ')' } }
  const sha256 = await sha256Hex(buf)
  const chk = checkCard(card, { sha256, where })
  if (!chk.ok) return { ok: false, reason: chk.reason, sha256 }
  const gltf = await new GLTFLoader().parseAsync(buf, '')
  return { ok: true, card, status: chk.status, sha256, gltf, bytes: buf.byteLength }
}

// Kopfteil-Figur (kfb.headpart/1 im Rezept, eyeRig.seat 'headpart-socket'): Kopf nach den Rezept-Stellgrößen setzen, EyeRig v6 an den
// Sockel-Ankern bauen, E2-Lidhaut anhängen (v6-Schalen ganz aus, Passung im Sockel nach Weg A: shellRadius / R je Auge).
// Übernommen aus E2_ATTACH_R1/proof_r1e.html (loadFigure + buildEyes), ohne Kamera, Messung und Ton.
// deps: { THREE, EyeRig (pet-eye-rig.v6), attachClaySkin (clay-skin-attach.v1) }; makeMat(lidColour) liefert das Lid-Material des Wirts.
export function buildHeadpartEyes({ THREE, EyeRig, attachClaySkin, fig, recipe, makeMat, life = true, eyeForward = 0 }) {
  const pet = recipe.pets[0], hp = pet.headPart, E = pet.eyeHost, o = pet.eye
  const SAN = (n) => THREE.PropertyBinding.sanitizeNodeName(n)
  const root = fig.getObjectByName(SAN(hp.root)), headNode = fig.getObjectByName(SAN(hp.mesh))
  if (!root || !headNode) throw new Error('HEADPART_NODES_MISSING: ' + hp.root + ' / ' + hp.mesh)
  const headMeshes = []; headNode.traverse((m) => { if (m.isMesh) headMeshes.push(m) })
  const sockets = headMeshes.filter((m) => /Sockel/i.test(m.material?.name || ''))
  const T = hp.tunables
  root.position.set(...T.headOffset.value); root.scale.setScalar(T.headScale.value)
  for (const m of headMeshes) { const i = m.morphTargetDictionary?.neckTaper; if (i != null) m.morphTargetInfluences[i] = T.neckTaper.value }
  fig.updateMatrixWorld(true)
  const host = new THREE.Group(); host.name = 'KFB_EyeHost'; root.add(host)
  const box = E.proxy.box, pg = new THREE.BoxGeometry(box[1][0] - box[0][0], box[1][1] - box[0][1], box[1][2] - box[0][2])
  pg.translate((box[0][0] + box[1][0]) / 2, (box[0][1] + box[1][1]) / 2, (box[0][2] + box[1][2]) / 2)
  const proxy = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ visible: false })); proxy.name = E.proxy.name; host.add(proxy); host.updateMatrixWorld(true)
  const rig = new EyeRig({ THREE, inner: host, o: { makeMat: () => makeMat(E.lidColour) } },
    { anchor: { ...o.anchor }, pupilStyle: o.pupilStyle, pupilSize: o.pupilSize, inset: o.inset, lidFit: o.lidFit, gloss: o.gloss,
      converge: o.converge, baseColor: parseInt(o.baseColor.slice(1), 16), blink: { ...o.blink }, lashes: { ...o.lashes } })
  const byKey = Object.fromEntries(pet.eyes.map((e) => [e.cdKey, e])), one = pet.eyes.length === 1
  const eyeQ = ['eyeL', 'eyeR'].map((k) => byKey[k] || pet.eyes[0])
  const place = () => {
    if (!rig.eyes) return
    rig.eyes.forEach((e, i) => { const q = eyeQ[i]; e.position.set(...q.pos); e.scale.setScalar(q.scale); e.rotation.y = 0 })
    if (one) { rig.eyes[0].quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...pet.eyes[0].gaze)); rig.eyes[1].visible = false }
  }
  const b0 = rig.build.bind(rig); rig.build = (...a) => { const r = b0(...a); place(); return r }
  const skin = attachClaySkin(rig, THREE, { socketInnerR: eyeQ.map((q) => q.shellRadius / q.R), ...(eyeForward ? { eyeForward } : {}) })
  rig.build()
  if (!life) { rig.setLife({ on: false }); rig.setKinetics({ enabled: false }) }
  return { rig, skin, host, proxy, sockets, eyeQ, one }
}

// Lid-Zustände wie im Beweis (emote = Ziel − v6-Ruhe); v6 zeigt höchstens c = 0 offen
export const LID_STATES = { open: { u: -1, l: -1 }, rest: { u: 0.12, l: 0.06 }, half: { u: 0.5, l: 0.5 }, closed: { u: 1, l: 1 } }
export function setLidState(rig, name) {
  const t = LID_STATES[name]; if (!t) return false
  rig.applyEmote({ lidUpper: t.u - rig._rest.u, lidLower: t.l - rig._rest.l, slant: 0, pupil: 'normal', gaze: 'center' }); return true
}
