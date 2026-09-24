/* KFB Animation Lab v2 · sources — WAS GEPRÜFT WIRD, an einer festen Revision.
 *
 * Eine Stelle für Pfade und Revision. Kein Pfad wird aus einem Muster gebaut (die Monatsordner der
 * Mystery Series sind nicht einheitlich benannt), und kein Clipname steht hier — Clipnamen kommen
 * aus der Datei, nie aus Dokumentation.
 *
 * ⚠ WARUM DER VERZEICHNISBAUM ALS BELEG NICHT TAUGT: die GitHub-Baumabfrage listet `.glb` gar
 * nicht. Vorhandensein wird darum im Browser gemessen (`verify`), eine Byte-Abfrage je Pfad —
 * derselbe Weg wie `lab/verify-sources.js` in v1.
 */
export const SCHEMA = 'kfb.source-pin.v2';

/* Gepinnt auf Georgs beobachteten Stand von main (12.09.). Auflösbar geprüft, bevor er hier stand.
   v1 lief auf b97b5ac5 — dazwischen liegen 89 Commits, die im Wesentlichen weitere Mystery-Series-
   Monate hinzufügen (Combat Mech, Superhero, Black Knight, Vampire, Witch, Helpers, Protagonists,
   Hiker, Tiefling). Für die acht Animationssätze und den Driver ändert sich nichts — gemessen wird
   es trotzdem, siehe `verify`. */
export const REV = 'cb52cc2b3d89f0c45471d8ebc5bfa0b42477b13b';
export const REPO = 'georg-doc/kayfabizarro';
export const RAW = 'https://raw.githubusercontent.com/' + REPO + '/' + REV + '/media/3D_Assets/';
export const url = (p) => RAW + p.split('/').map(encodeURIComponent).join('/');

/* Die Wirtskörper. `driver` ist das Prüfobjekt des Briefings v2, `medium` bleibt Vergleich und
   Debug. `template` und `carl` kommen aus dem v3-Briefing und sind KEINE Graft-Wirte: sie werden
   in C0 nur GEMESSEN (`mode: 'audit'`), nicht zusammengesetzt. */
export const HOSTS = [
  { key: 'driver', label: 'Driver', variant: 'driver', mode: 'graft',
    path: 'KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb',
    tex: 'KayKit_Mystery_Series6/2 - August 2023 - Driver/textures/driver_texture.png',
    /* KFB-Fassung der Bildtafel: die beiden GoGoGo-Aufdrucke (Trikot und Jacke) sind mit der
       Bandfarbe ihrer Zeile übermalt, auf dem Rücken steht die Wortmarke — »Kayfa« schwarz,
       darunter »Bizarro« papierweiß auf rotem Feld, Schräge −8° wie beim Original.
       Erzeugt aus `driver_texture.png` an der gepinnten Revision; das Original bleibt liegen und
       ist im Werkzeug umschaltbar. Nichts wird still ersetzt. */
    texKFB: './assets/driver_texture_kfb.png', texKFBMaterial: /driver_texture/i },
  { key: 'medium', label: 'Mannequin M', variant: 'medium', mode: 'graft',
    path: 'KayKit_Character_Animations_1.1/Mannequin Character/characters/Mannequin_Medium.glb', tex: null },
  { key: 'template', label: 'CharacterTemplate', mode: 'audit',
    path: 'KayKit_Mystery_Series6/CharacterTemplate/gltf/CharacterTemplate.glb', tex: null },
  { key: 'carl', label: 'CapsuleCarl', mode: 'audit',
    path: 'KayKit_Mystery_Series6/CapsuleCarl/gltf/player.gltf',
    tex: 'KayKit_Mystery_Series6/CapsuleCarl/gltf/capsule_texture.png' },
  /* v4 · CapsuleCarl-Rig (13.09.): vierter Wirtsweg, NEBEN dem reinen C0-Audit oben — 'carl' bleibt
     unverändert (nichts geschnitten, nichts gebaut), 'carlrig' baut auf denselben Messungen die
     Materialzonen, die Mund-Schließung und die PetStudio-Gesichtsmontage. */
  { key: 'carlrig', label: 'CapsuleCarl (rig)', mode: 'rig',
    path: 'KayKit_Mystery_Series6/CapsuleCarl/gltf/player.gltf',
    tex: 'KayKit_Mystery_Series6/CapsuleCarl/gltf/capsule_texture.png' },
];

/* Die acht echten Rig_Medium-Sätze. Reihenfolge = Ladefolge; `General` zuerst, weil dort die Idles
   liegen (gemessen: `MovementBasic` hat keins). */
export const SETS = ['General', 'MovementBasic', 'MovementAdvanced', 'CombatMelee', 'CombatRanged', 'Simulation', 'Special', 'Tools'];
export const setPath = (s) => 'KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_' + s + '.glb';

/* Die Module des Grafts, als gepinnte Kopie im Projekt. Quelle: georg-doc/KFB-Stunt-Car-Race,
   `_inbox/KFB FrankenStein Studio/KFB-session-2026-09-12/`. Kopie, nicht Neubau — WS0 bleibt
   Eigentümer. Wer hier etwas ändert, forkt WS0s Gesicht; das ist keine Lab-Entscheidung. */
export const MODULES = {
  graft: '../frizzlegraft-v1/graft-biped.v1.js',
  facehost: '../frizzlegraft-v1/facehost.v1.js',
  headgraft: '../frizzlegraft-v1/headgraft.v1.js',
  eyes: '../petstudio-v9/studio-v12/pet-eye-rig.v6.js',
  mouth: '../petstudio-v9/studio-v3/pet-mouth.v1.js',
  brow: '../petstudio-v9/studio-v12/brow-rig.v2.js',
  nose: '../petstudio-v9/studio-v12/pet-nose.v2.js',
};

/* Georgs Einstellungen für genau diese Figur — aus dem Studio exportiert, nicht hier erfunden.
   `_inbox/Config_JSONs/kfb-pet-graft-driver (1).json`, Eintrag `graft-driver`: Mund, Nase, Braue,
   Halsversatz, Hautschnitt, Kopfzonen. Das Lab liest sie und stellt nichts selbst ein — sonst
   prüfte es eine Figur, die niemand abgenommen hat. */
export const CONFIG = './config/kfb-pet-graft-driver.json';
export const CONFIG_PET = 'graft-driver';
export const AUDIT_MODULE = './audit.js';

/* ⚠ DIE KOPFDATEI. `headgraft.v1` und `ears.v*` laden FrizzleBobs Kopf aus einer GEPATCHTEN
   Modelldatei, relativ zum Modul:
       petstudio-v9/assets/models/FrizzleBob_Yellow.gltf
   NACHTRAG 12.09. 17:00 — DAS ERSTE URTEIL WAR FALSCH. Sie liegt im Repo, im WS0-Handoff:
       KFB-Stunt-Car-Race · _inbox/KFB Mech & Vehicle Rig v2 WS0/WSA_2026-09-12/petstudio-v9/assets/models/
       608342 Byte · Blob-SHA e0a757ece30accabc4c61f1ad11751b15bd06974
   WARUM SIE NICHT GEFUNDEN WURDE: die Baumabfrage listet nur »importierbare« Dateien und läßt
   3D-Modelle weg — `.glb` UND `.gltf`. Drei Suchmuster liefen ins Leere, obwohl die Datei da war.
   REGEL: Modell-Vorhandensein wird per Byte-Abfrage geprüft (`verify`), nie über einen Dateibaum.
   Die Kopie liegt jetzt im Projekt. */
export const HEAD_DONOR = {
  rel: 'petstudio-v9/assets/models/FrizzleBob_Yellow.gltf',
  status: 'PINNED_COPY_IN_PROJECT',
  repo: 'georg-doc/KFB-Stunt-Car-Race',
  repoPath: '_inbox/KFB Mech & Vehicle Rig v2 WS0/WSA_2026-09-12/petstudio-v9/assets/models/FrizzleBob_Yellow.gltf',
  bytes: 608342,
  blobSha: 'e0a757ece30accabc4c61f1ad11751b15bd06974',
  copiedTo: 'petstudio-v9/assets/models/FrizzleBob_Yellow.gltf',
  note: 'Liegt im WS0-Handoff, nicht an einem kanonischen Charakter-Asset-Pfad. Nicht verschieben, nicht doppeln — die Entscheidung über eine kanonische Ablage gehört WS0/Georg.',
};

/** Vorhandensein MESSEN, nicht annehmen: eine Byte-Abfrage je Pfad an der gepinnten Revision. */
export async function verify(paths, onStep) {
  const out = [];
  for (const p of paths) {
    const u = url(p);
    let row = { path: p, url: u, ok: false, status: 0, note: '' };
    try {
      const r = await fetch(u, { headers: { Range: 'bytes=0-0' }, cache: 'no-store' });
      row.status = r.status;
      row.ok = r.status === 200 || r.status === 206;
      if (row.ok) { const b = await r.arrayBuffer(); row.note = b.byteLength + ' byte read'; }
    } catch (e) { row.note = String((e && e.message) || e); }
    out.push(row);
    if (onStep) onStep(row, out.length, paths.length);
  }
  return out;
}

/** Alle Pfade, die dieses Lab benutzt — die Liste, die `verify` bekommt. */
export function allPaths() {
  const out = [];
  for (const h of HOSTS) { out.push(h.path); if (h.tex) out.push(h.tex); }
  for (const s of SETS) out.push(setPath(s));
  return out;
}

export function pinDoc(rows, meta) {
  const ok = rows.filter((r) => r.ok).length;
  return {
    schema: SCHEMA, repo: REPO, revision: REV, generatedAt: new Date().toISOString(),
    verdict: ok === rows.length ? 'COMPLETE_AT_REVISION' : 'INCOMPLETE_AT_REVISION',
    paths: { checked: rows.length, present: ok, missing: rows.filter((r) => !r.ok).map((r) => ({ path: r.path, status: r.status, note: r.note })) },
    headDonor: HEAD_DONOR,
    graftModules: { source: 'georg-doc/KFB-Stunt-Car-Race · _inbox/KFB FrankenStein Studio/KFB-session-2026-09-12', copiedTo: 'lab-v2/vendor/', edited: false },
    three: meta && meta.three, rows,
  };
}
