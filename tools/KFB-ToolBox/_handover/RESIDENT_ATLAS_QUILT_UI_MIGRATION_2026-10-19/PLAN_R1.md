# Resident Atlas × Quilt – Migrations-/Workspace-Plan R1

**Datum:** 2026-10-19
**Status:** PLANUNG / DONOR-RESEARCH / ENTSCHEIDUNGSVORBEREITUNG; nicht implementiert, nicht abgenommen.
**Georgs aktuelle Vorgabe:** Resident Atlas soll ohnehin umziehen; bei diesem Umzug die UI gezielt verbessern und Quilt (`niko-dellic/quilt`) als Workspace-Donor prüfen. Das ist **kein** Auftrag zum sofortigen Umzug oder zu einem vollständigen UI-Redesign.
**Einziger bestehender Owner dieser Planung:** KFB ToolBox / Resident Atlas (Quell-/Authoring-Lane). KFB ToolBox bleibt ein einzelner Tool-Katalog/Router, kein neuer Atlas-Runtime-Owner. Für spätere Welt-/God-Mode-Integration behält der jeweilige World/WS1-Owner Welt, Kamera/Bewegung, Terrain, Persistenz und Platzierung.
**Repo / Branch:** `georg-doc/kayfabizarro` / `planning/resident-atlas-quilt-ui-migration-r1-2026-10-19` · isolierter Dokumentationszweig von `main@c746a9567e0ea20a24b8969fe9130ac0756e7a7e`.

## 1. Welche echte Atlas-Version und welcher Umzug?

- Aktueller überprüfter Design-Quellstand (Session Cut, nicht aktueller produktiver Site-Beleg): `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-10-04_r2/`; `CURRENT_STATE.md` nennt **S17** inklusive `#__duel`, ausdrücklich **DESIGN CANDIDATE** und **GitHub-Push des Originaldesign-Workspaces NOT_PERFORMED**. S16 bleibt Quellen-/Übergabebasis für `WSA-RES-SET-01`. S14/S15 sind getrennte Mess-/Fight-Donors.
- `tools/resident_atlas_s6/` ist ein älterer portabler Atlas-Quell-/Promotionsstrang; `tools/resident_atlas/` ist laut eigener README nur ein **Scene-Composition-Consumer**, **kein** Nachfolger des Atlas-S6/S17-Autorenwerkzeugs. Sie nicht als automatisch gültigen Migrations-Zielhost verwechseln.
- Die S17-Quelle nutzt eine konkrete Production-05-Split-Schale mit KFB-spezifischen Tokens/Controls (sichtbar im HTML) und Three.js **0.184.0** (Importmap). Die Split-Shell-Dokumentation hält bereits `Leiste zu`, `Leiste auf` und `Nur Ansicht` sowie das Problem der ~924-px-Chat-Splitbreite fest. Das funktionierende Verhalten ist eine **Bestandsfunktion**, nicht eine zu ersetzende neue Idee.
- KFB ToolBox P07 trägt den bestehenden Editor-Port `edit-layer.v2.js`, `snap.v1.js`, `grounding.v1.js`; er ist gemäß P07 Return / Atlas-Handover wiederzuverwenden, nicht neu zu bauen. Geometrie-/Bone-Posing, TransformControls, Kameraziel und Undo/Redo gehören ihren aktuellen Implementierungen.
- Aktuelle Oberflächenpolicy `skills/chat/KFB_SURFACE_CONSOLIDATION_2026-10-04.md`: **ein Production Hub**, **ein ToolBox-Frontdoor-Router**, **Spezialwerkzeuge als eigene Tools/Sites**. Die zentrale ToolBox-Startseite erhält keinen Docking-Editor. Keine zweite ToolBox-Site, keine stillschweigende ersetzende Resident-Site.
- **Migrationsziel NICHT GEKLÄRT:** Georgs Umzugsabsicht ist gegeben; exakte Ziel-Site/-Projekt-ID, aktueller Host-Quellstand, Paket-/Buildweg, produktive Reader/Writer und Umzugszeitpunkt sind vor Implementierung anhand aktueller Owner-Daten zu klären. Ein bereits vorhandenes Tool/Site wird aktualisiert, nicht dupliziert. Kein neuer Site-Name oder URL wird aus diesem Plan erfunden.

## 2. Externer Donor Quilt – tatsächlich nachgeschlagener Stand

`niko-dellic/quilt@ed31a7398aa086e05bd85534e5d85297fa0f8a6a`

- Repo: https://github.com/niko-dellic/quilt
- Dokumentation: https://github.com/niko-dellic/quilt/blob/ed31a7398aa086e05bd85534e5d85297fa0f8a6a/README.md
- Compatibility: https://github.com/niko-dellic/quilt/blob/ed31a7398aa086e05bd85534e5d85297fa0f8a6a/docs/compatibility.md
- Three-Integration: https://github.com/niko-dellic/quilt/blob/ed31a7398aa086e05bd85534e5d85297fa0f8a6a/docs/three.md
- Library `quilt-three` version `0.11.0`, peer `three: ^0.186.0`; `quilt-three-react` benötigt React 19 / R3F 9. S17 importiert Three **0.184.0** – **Versions-/API-Kompatibilität offen, kein automatisches Upgrade**.
- Quilt-Pakete: `quilt-core` (headless Layout-Modell), `quilt-vanilla` (DOM, Tabs, Fenster), `quilt-react` (Bindings), optionale `quilt-three` / `quilt-three-react` (Shared-Scene Views). **Layout-Modell und Editor-Daten strikt trennen.**
- Echte Features laut README: verschachtelte Split-Panels, Dock/Tab-Gruppen, Min-/Max-Größen, keyboard-/pointergestütztes Resize, Theme-CSS-Tokens, versioniertes Layout-JSON, Same-Origin-Popout mit Rückkehr bei Schließen, vordefinierte Workspaces. Das erzeugt **keine** Resident-Daten-/Pose-Persistenz.
- Externe Demos (nur Donor/Studie, niemals KFB-Abnahmefläche): https://quilt-layouts.vercel.app/vanilla.html und https://quilt-layouts.vercel.app/react.html.
- Lizenz: **MIT**, `LICENSE` geprüft; bei späterer Codeübernahme Copyright-/Lizenztext erhalten. Die Lizenz ist kein KFB-Design-PASS.
- Limitation: Popouts nur selbe Origin, je Fenster ein Pane; Browser muss Fenster erlauben. Quilt kümmert sich nicht um KFB-spezifische Asset-Registry, Audio, Figuren, Poses, Save/Reload oder unabhängig laufende Cross-Origin-Sites. Three-Extension besitzt pro Dokument Rendering-/Lifecycle-Ressourcen, je View eigene Controls; die bereits bestehende KFB-Owner-Semantik hat Vorrang.
- **Prüfstand:** Quelltexte, Dokumentation, Paketdefinition und Lizenz gelesen. Kein visual-isolated Quilt-Donor-Screenshot aufgenommen, keine Demo interaktiv bedient, keine Playwright-/GPU-/Atlas-Integration getestet.

## 3. Bewertete Reuse-Möglichkeiten (kein blindes Framework-Adopt)

| KFB-Aufgabe | Quilt-Kandidat | Zu behalten / nicht zu verändern | Empfehlung |
| --- | --- | --- | --- |
| Desktop-Editor Platzverteilung | `quilt-core` + ggf. `quilt-vanilla` als äußere, reversible Layout-Schicht | aktuelle Atlas 3D-Bühne, KFB Panel-/Typo-Tokens, Selection/Focus, Editor-Owner | **A: zuerst vergleichend testen** |
| Studio-Workflow | gespeicherte Presets `Focus`, `Edit`, `Review` | Resident-/Pose-Daten, echte Dropdowns, Timeline-/Motion-Logik | **A: prüfen** |
| Tabs für Scene, Actor, Rig, Pose, Props, Habitat, Timeline | Quilt Tab-Gruppen und Containergrößen | vorhandene Module/Daten und eine einzige Undo/Save-Kette | **A: prüfen** |
| mehrere Kameras/Ansichten desselben Residents | optionale `quilt-three` Shared-Scene Views | **eine** Scene- und Asset-Wahrheit, ein Gizmo-/Input-Owner, KFB Kameraziel beim Layoutwechsel | **B: erst nach Layout-A/B, versions-/kostenabhängig** |
| Popout auf zweitem Bildschirm | same-origin companion | keine Cross-Origin-Projekte synchronisieren oder separate App-/Window-Owner schaffen | **C: optional/desktoptauglich** |
| Theme Presets | Quilt CSS-Token-Mapping | akzeptierte KFB Production-05 / ToolBox-Designsprache, keine generischen Demo-Tabs | **nur als Styling-Adapter** |
| ToolBox-Router | **keine** Quilt-Integration | bestehender Frontdoor-Katalog, Specialist-Sites | **nicht anfassen** |

## 4. Vorgesehene Layouts für den Atlas nach Umzug – Konzept, kein Mockup

1. **Focus / Nur Ansicht:** große echte 3D-Szene, Resident-Auswahl bzw. notwendige kleine Steuerung, alle Inspectors geschlossen; Kamera bleibt bei Resize/Hide auf **gleichem Zielpunkt**, keine unbeabsichtigte Neurahmung, Gizmo deaktiviert wenn nötig.
2. **Edit:** 3D-Hauptfenster und rechts Inspector-Panels mit bereits vorhandenem Edit-Layer / Snap / Pose / EyeRig / Requisiten; optional links echter Librarian-Picker als *Consumer*, keine zweite Suche/Registry.
3. **Review:** große Ansicht + vorhandene Motion-/Timeline-/QA-/JSON-Bereiche unten/seitlich, ohne doppelte Mixer/Playback-Uhren; Layout passt an die vorhandenen Module, nicht umgekehrt.
4. **Vier Ansichten (optional, später):** gleiche Resident-Szene aus mehreren Kameras. Nicht im ersten Gate, da extra Renderer/Controls, Resize/Pointer-Lifecycle, VRAM und Three-Version geprüft werden müssen.

Die drei Namen sind **Vorschläge für Presets**, kein neues KFB Canon oder globales ToolBox-UI-Gesetz. Nutzer-Layout-JSON wird separat von Resident-Rezepten, Scenelet/Stage-Export, Undo und Game Save gespeichert.

## 5. Migrations- und QA-Grenzen

**Vor jeder produktiven Veränderung (Source + owner gate):**
- Exakten Quell- und Ziel-Host samt Site-Projekt-ID/URL/Owner identifizieren; S17 Session Cut und aktuellen Authoring-Stand vergleichen; keine still verlorenen Features/Scenelets/Clips.
- Source-isoliert die **wirklich vorhandene** Atlas-Split-Shell und tatsächliche Quilt-Bedienung zeigen (nicht nur URL laden), anschließend visueller A/B-Vergleich identischer Inhalte.
- Atlas-Module/DOM-Canvas/Three-Imports/Asset Registry/pointer+keyboard ownership/camera/TransformControls/Undo/Redo, Status- und Fehlermeldungen inventarisieren.
- Quilt ohne neuen Three.js-Owner, ohne zweites Animations-Loop, ohne erzwungene React-Retrofit prüfen; falls Quilt gegenwärtige 0.184.0-Kette destabilisiert, mit **Layout-only** prüfen oder als Donor-Pattern verwerfen.

**Erstes zulässiges technisches Pilot-Gate nach expliziter Ausführungsfreigabe:**
Ein **reversibles Atlas Layout A/B** in bestehendem Zielhost: Original vs dieselbe echte Resident-Szene/echten Inspector mit drei Layouts. Kein selbst erstelltes Ersatz-Asset und keine generische Demo-Szene; keine visuellen KFB-Tokens austauschen.
Messbare Checks: Layoutwechsel und Resize, unveränderte Kamera/Scene-Identität und selektiertes Objekt, exakt **ein** Gizmo/Animationstakt, Save/Import/Export-/Undo-Roundtrip, 924-px-Chat-Split-Breite ohne abgeschnittenen Hauptschalter, unter 600 px ein einfacher Ein-Viewport-Modus, kein Canvas-/Listeners-Leak, Vergleich CPU/FPS/Draw-Calls auf Zielgerät.
Danach erst Popouts/Multiview prüfen, wenn sie echten Nutzen zeigen.

**Nicht im Plan autorisiert:** Migration jetzt, Site-Neuanlage, React/Three-Upgrade, Durchmischung der Atlas-/Scene-Viewer-Owners, WorldBuilder-/WS1-Laufzeitmigration, eine dritte Edit-Layer- oder Audio-Implementierung, Neubranding, Merge oder Live-Promotion.

## 6. Genau ein nächster Gate

**WS0 / bestehender ToolBox–Resident-Atlas-Owner klärt den exakten Zielhost/Site-Projektbezug und pinnt den heute wirklich editierbaren Atlas-Quellstand (S17-Session-Cut vs aktueller Arbeitsstand) als Receiving-Source; darauf folgt erst nach separater Umsetzungsfreigabe der kleine Layout-only-A/B-Pilot.**

Der User muss für diese **reine Planungs-Persistenz nichts bedienen**. Kein Stage/Site erforderlich; keine GitHub-Writes außerhalb dieses isolierten Planning-Branches.

## Quellanker (GitHub main beim Audit `c746a9567e0ea20a24b8969fe9130ac0756e7a7e`)

- `tools/KFB-ToolBox/START_HERE.md`: ein ToolBox-Frontdoor-Router.
- `skills/chat/KFB_SURFACE_CONSOLIDATION_2026-10-04.md`: Site/Tool-Ownership.
- `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-10-04_r2/{CURRENT_STATE.md,HANDOVER.md,RETURN.md,KFB_Resident_Atlas_S17.html}`.
- `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-10-04_r2/docs/UI_SPLIT_EINBAU_RESIDENT_ATLAS.md`.
- `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/docs/RETURN_TOOLBOX_PRODUCTION_07.md`.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/WSA_RESIDENT_ATLAS_MVP_INTAKE_2026-10-04.md`.
- `tools/resident_atlas/README.md`: Scene-Composition-Consumer, kein Atlas-Ersatz.
