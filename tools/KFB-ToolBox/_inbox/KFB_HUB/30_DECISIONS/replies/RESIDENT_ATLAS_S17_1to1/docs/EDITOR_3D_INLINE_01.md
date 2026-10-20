# 3D-INLINE-EDITOR · Menü am Objekt · Stand S15 · 2026-09-30

Der Editor, der künftig auch im Studio und in der ToolBox laufen soll. Diese Seite beschreibt den Stand im Resident Atlas. Der Vertrag steht in `docs/SNAP_EDITOR_CONTRACT_01.md` und gilt unverändert.

## 1 · Was er ist

- **Ein Edit-Owner:** Bearbeitet wird nur über das Menü am Objekt (`#objmenu`). Es erscheint an der Auswahl, ohne zweite Palette und ohne Fenster über der Szene. Zahlenwerte stehen nur im Inspektor „Details“.
- **Auswahl:** Die Auswahl fällt auf `pointerup` mit 4-px-Schwelle, damit eine Kamerafahrt nichts auswählt. Picking trifft nur Sichtbares. Figuren lassen sich bis auf den Bone auswählen (Glieder).
- **Werkzeuge:** ✥ ⟳ ⤢ (G/R/S) an einem TransformControls · W/L Welt/Lokal · ⌗ Raster · ▦ ⊶ ⚓ Snap (Raster, Anschluss, Halterung) · ⬓ Absetzen (Grounding) · ◎ Fokus · ↶ ↷ Undo/Redo · ⓘ Details · ✕ Schließen.
- **Snap** (`lib/snap.js`): Raster 0,05 / 15° / 0,05. Anschluss: Kachelkanten und Enden langer Teile, `tol` 0,35. Halterung: Requisite an `handslot`, `tolMount` 0,55.
- **Sammelstelle:** Jede Änderung läuft über `recordNodes` und kann rückgängig gemacht werden. Export läuft über die Studio-Ablage (`lib/studio.js`: `recordBone`/`recordNode`, `check`/`bundle`/`merge`).
- **Optik des Menüs:** `KFB Studio Editor Radial B2.dc.html`, Stufe B1: nur Symbole, kompakt, aktiver Zustand als heller Grauton mit Innenkontur (S13 TUNE). Das ist die Vorlage für Studio und ToolBox.

## 2 · Dateien

| Datei | Rolle | Abhängig von |
|---|---|---|
| `lib/edit-layer.js` | Auswahl, Picking, Menü am Objekt, TransformControls, Undo | three, OrbitControls, TransformControls |
| `lib/snap.js` | Raster, Anschluss, Halterung | edit-layer, `lib/grounding.js` |
| `lib/grounding.js` | gemeinsamer Absetz-Schritt | – |
| `lib/studio.js` | Ablage, Rezept-Export, Merge | – |
| `lib/rigwork.js`, `lib/ik-rig.js` | Gliederpuppe, CCD-IK (optional) | atlas.js |
| `KFB Studio Editor Radial B2.dc.html` | Gestaltungsvorlage des Menüs | – |

## 3 · Einbau in Studio und ToolBox

```js
const EDIT = makeEditLayer(V, canvas, { getRoot, recordOf });  // lib/edit-layer.js
const SNAP = makeSnap(EDIT, V, { getRoot, onSnap(r, node) {} }); // lib/snap.js
const GR = makeGrounding(V, { surfaces, getRoot });               // lib/grounding.js
SNAP.setMode('grid' | 'connector' | 'mount');
```

Voraussetzungen: ein Viewer mit `scene`, `camera`, `controls`, `renderer` (wie `makeViewer` in `lib/atlas.js`). Objekte tragen `userData.entry` (`id`, `scope`, `kind`, `role`), sonst lassen sie sich nicht auswählen.

**Der dritte Einbau ist erreicht** (Atlas, Band, Disco). `edit-layer` ist damit laut HOUSEKEEPING ToolBox-Kandidat. Für die Übergabe:

1. Die Symbolzeile aus B1 ins Menü übernehmen. Heute trägt der Atlas noch die Textbeschriftung aus S12.
2. three-freie Teile (snap-Regeln, Toleranzen) von der three-Schicht trennen, wie bei `lib/resident-collide.js`.
3. Fight Sandbox: `fighter.A/B` und `fight-ring` tragen `userData.entry` und sind damit auswählbar. Die Fight-Staging-Werte überschreiben eine Verschiebung aber beim nächsten Bild. Im Fight ist der Editor nur Ansicht.

## 4 · Offen

- Anschluss zwischen Kachel und Zaun ist nicht definiert.
- Halterung kennt nur `handslot`, keine Rücken- oder Gürtel-Slots.
- Toleranzen sind gesetzt, nicht gemessen.
- Die Studio- und ToolBox-Einbauten sind nicht gebaut. Diese Seite beschreibt, was es gibt, keinen Einbau.
