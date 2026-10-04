# RETURN · ToolBox Production-07 · 3D-Inline-Editor aus dem Resident Atlas S15 · 2026-09-30

Grundlage: `KFB ToolBox Production-06.dc.html`. P06 bleibt unverändert.
Vertrag: `tools/KFB-ToolBox/docs/SNAP_EDITOR_CONTRACT_01.md` und `EDITOR_3D_INLINE_01.md` (Kopien aus dem Atlas-Cut).

## Neu
- `kfb-lib/edit-layer.v2.js`: Atlas-S15-Datei, unverändert übernommen. Wird lokal geladen, weil sie noch nicht im Repo liegt. Rückfall ist die gepinnte v1.
- `kfb-lib/snap.v1.js`: Port von snap.js. Nimmt `recordOf` statt `userData.entry`. Eine Figur erkennt er an einer SkinnedMesh, `hands()` ist öffentlich.
- `kfb-lib/grounding.v1.js`: Port von grounding.js mit eingebautem `skinnedWorld`, ohne atlas.js. Die Verschiebung rechnet er in Welt-y.
- Menü am Objekt nach B1: ✥ ⟳ ⤢ − + | W ⌗ ▦ ⊶ ⚓ | ⬓ ◎ ⊞ ↺ | ↶ ↷ | ⓘ ✕. Aktiver Knopf: heller Grauton mit Innenkontur.
- Ein Verlauf für Ziehen, Snap, Absetzen, ± Skalieren und Zurücksetzen. Der Elternknoten gehört zum Schnappschuss, damit Undo auch eine Halterung zurücknimmt. Tasten: Strg+Z / Strg+Shift+Z.
- Absetzen (⬓) misst jetzt den Fußkontakt der posierten Haut. Findet es keine Fläche, fällt es auf die Box-Unterkante bei y 0 zurück.
- Halterung: Eine Requisite hängt in `handslot*` (Rig_Medium: `handslotl` / `handslotr`) und wird als `rec.mount` gespeichert. Nach jedem Neuaufbau des Darstellers kommt sie zurück an die Hand (`_remount`).
- Details (ⓘ): Studio › Scene zeigt Snap-Modus, Rasterweite, Winkel, Toleranzen, Mount-Offset, Anschlüsse der Auswahl und den letzten Snap.
- **Tastenwechsel:** F ist jetzt Fokus, wie im Vertrag. Bisher war F Absetzen, das liegt jetzt nur noch auf ⬓.

## Abnahme E1–E9 (Studio › Scene › „Run editor acceptance“) · frizzlebob-earrig-v5 · PASS
E1 ein Gizmo · E2 Menüsatz vollständig · E3 Undo/Redo · E4 Raster am Gizmo · E5 Figur verweigert · E6 Halterung, Undo, Redo, Lösen (handslotl, d 0,1) · E7 Absetzen gap 0 auf Stage floor · E8 Fokus-Ziel Δ 0,0001 · E9 Gesichtsgriff leiht denselben Gizmo.

## Offen
- Bone-Auswahl (Glieder) aus pose-tool.js ist nicht übernommen. In der ToolBox decken IK-Punkte und Gesichtsgriffe das ab.
- Die Designvorlage `KFB Studio Editor Radial B2.dc.html` fehlt. Das Menü ist nach der Beschreibung gebaut.
- Anschluss (⊶) ist nur sinnvoll mit Kacheln oder Zäunen auf der Bühne (Resident- und Band-Presets).
- Toleranzen sind gesetzt, nicht gemessen. Das gilt wie im Atlas.
- Schatten: Der Editor fügt keine Schattenwerfer hinzu. Montierte Requisiten liegen im Frustum des Darstellers (LESSONS_SHADOWS), das Neueinpassen läuft aber noch nicht automatisch.
