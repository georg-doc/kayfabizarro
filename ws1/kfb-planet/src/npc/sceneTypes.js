// WS-NPC · S3 Begegnungs-Module: Typen und Datensatz `kfb.scene/1` (Entwurf, Konzept Prozedurale Welt R1.5 §5.1; WS0 S3: Auslöser, Platz, Freigabe-Status).
// Nur freigegebene Typen kommen in den Pool (WS0). Freigabe heute: alle „entwurf“ – Bilder 0b liegen bei Georg (V-740), Abnahme steht aus.
// MiB-Turm und UFO erst nach ihren Design-Paketen (V-744). Sorten der Fluffer: K15 (fluffer.kinds.k15.json), Register q_<sorte>.
// phase: Heimat-Phase der Regie; pot: Konfliktpotenzial = Zielspannung der Heimat-Phase (Konzept: Aufbau 0,4, Konflikt 0,8, Ruhe 0,1)
// platz: Bedarf nach Konzept §5.1 (Vorschlag WS-NPC); besetzung: Register-IDs (characterId), Rollen der Band vorläufig (WS0 §155)
import K15 from '../data/npc/fluffer.kinds.k15.json' with { type: 'json' }

export const PHASE_ZIEL = Object.freeze({ aufbau: 0.4, konflikt: 0.8, ruhe: 0.1 })
export const FREIGABE = Object.freeze(['frei', 'entwurf', 'gesperrt'])

export const SCENE_TYPES = Object.freeze([
  { typ: 'bewohner', phasen: ['ruhe', 'aufbau'], phase: 'ruhe', freigabe: 'entwurf', platz: { R: 6, maxSlope: null, plinthe: false },
    besetzungen: [[{ characterId: 'lorekeeper', rolle: 'resident', aktivitaet: 'study' }], [{ characterId: 'farmer_b', rolle: 'resident', aktivitaet: 'tend' }]] },
  { typ: 'band', phasen: ['ruhe'], phase: 'ruhe', freigabe: 'entwurf', platz: { R: 8, maxSlope: 0.0192, plinthe: 'Bühne Ø 5 m' },   // Neigung < 1,1° = tan 0,0192
    besetzungen: [[{ characterId: 'orc_legacy_b', rolle: 'kfb_band_leader' }, { characterId: 'orc_raider', rolle: 'kfb_band_guitarist' }, { characterId: 'orc_brute', rolle: 'kfb_band_drummer' }, { characterId: 'orc_legacy_a', rolle: 'kfb_band_trumpeter' }]] },
  { typ: 'disco', phasen: ['ruhe'], phase: 'ruhe', freigabe: 'entwurf', platz: { R: 9, maxSlope: null, plinthe: false, note: 'discoSite r 9·s' },
    // MC plus die sieben Tänzer (K12-Plätze; Register über kfb_disco_*), Lead 25.10.: die Tänzer tragen die Signatur-Decks der Szene
    besetzungen: [[{ characterId: 'frizzlebob', rolle: 'kfb_disco_mc' }, ...['skeleton_minion', 'avian_swordsman', 'protagonist_a', 'toy_soldier', 'witch', 'black_knight', 'demon_lord'].map((characterId) => ({ characterId, rolle: 'kfb_disco_dancer' }))]] },
  // Konflikt (Lead 25.10.): Skelett-Patrouille (groupLife, Route an den Anker verschoben) und Dark Fluffer am Obstbaum (flufferSet, Platz = Baum der Fluffer-Definition)
  { typ: 'patrouille', phasen: ['konflikt'], phase: 'konflikt', freigabe: 'entwurf', platz: { R: 10, maxSlope: null, plinthe: false, note: 'Route mit ≥ 2 m Freiraum' }, gruppe: 'skeleton_patrol',
    besetzungen: [[{ characterId: 'skeleton_warrior', rolle: 'skeleton_patrol' }, { characterId: 'skeleton_rogue', rolle: 'skeleton_patrol' }, { characterId: 'skeleton_mage', rolle: 'skeleton_patrol' }]] },
  { typ: 'fluffer', phasen: ['konflikt', 'aufbau'], phase: 'konflikt', freigabe: 'entwurf', platz: { R: 6, maxSlope: null, plinthe: false, quelle: 'baum', note: 'Route ≥ 2 m frei, 4 m am Baum' },
    besetzungen: K15.kinds.map(({ kind }) => [{ characterId: 'q_' + kind, rolle: 'dark_fluffer', sorte: kind }]) },
].map((t) => Object.freeze({ ...t, pot: PHASE_ZIEL[t.phase] })))

export const typeOf = (typ) => SCENE_TYPES.find((t) => t.typ === typ) || null
// Pool: nur frei; mit includeDraft (Schalter #scenes=entwurf, Tests und Bilder) auch Entwürfe; gesperrt nie
export const poolTypes = ({ includeDraft = false, types = SCENE_TYPES } = {}) => types.filter((t) => t.freigabe === 'frei' || (includeDraft && t.freigabe === 'entwurf'))

// kfb.scene/1 (Entwurf): ein Datensatz je Begegnung. ausloeser 'zufall' (Regie) oder 'kontext' (Anfrage eines Ereignisses); karte füllt die Wechselrede
export function makeScene({ seed, n, typ, spot, yaw, besetzung, phase, tau, ausloeser = 'zufall', grund = null, karte = null }) {
  const T = typeOf(typ)
  return Object.freeze({ schema: 'kfb.scene/1', id: `s-${seed}-${n}`, typ, zelle: spot.cell, anker: { x: spot.x, z: spot.z, R: T?.platz.R ?? spot.R, yaw: +yaw.toFixed(3), plinth: false, ...(spot.ref ? { ort: spot.ref } : {}) },
    besetzung: besetzung.map((b) => ({ characterId: b.characterId, rolle: b.rolle ?? null, gimmick: b.gimmick ?? null, ...(b.aktivitaet ? { aktivitaet: b.aktivitaet } : {}), ...(b.sorte ? { sorte: b.sorte } : {}) })),
    karte, phase, tau: +tau.toFixed(3), seed, ausloeser, grund, freigabe: T?.freigabe ?? 'entwurf', locusId: null })
}
export function validScene(s) {
  return !!s && s.schema === 'kfb.scene/1' && typeof s.id === 'string' && !!typeOf(s.typ) && Array.isArray(s.zelle) && s.zelle.length === 2 && Number.isFinite(s.anker?.x) && Number.isFinite(s.anker?.z) &&
    Array.isArray(s.besetzung) && s.besetzung.every((b) => typeof b.characterId === 'string') && ['zufall', 'kontext'].includes(s.ausloeser) && FREIGABE.includes(s.freigabe)
}
