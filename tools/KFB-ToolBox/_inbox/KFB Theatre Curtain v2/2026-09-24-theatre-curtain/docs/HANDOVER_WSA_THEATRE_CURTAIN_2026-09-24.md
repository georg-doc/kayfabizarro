# Handover für WSA-Chat — KFB Theatre Curtain

**Stand:** 2026-09-24 · **Status:** v2 funktioniert, kein Streifenartefakt, geschlossen + offen geprüft.

## Was ist das

Ein Bühnenvorhang aus zwei WebGPU-Compute-Cloth-Panels (echte Physik-Simulation, keine SVG/CSS-
Animation), die sich seitlich auf- und zuziehen. Rot, KFB-Farbe. Gebaut für Ladescreen-Übergänge
zwischen Spielszenen.

## Wie wir hier hingekommen sind (kurz)

1. **v1 (verworfen):** CPU-Verlet-Cloth + KFB-Fabric-Texturen (Original-Donor-Runtime aus dem
   `kayfabizarro`-Repo). Zeigte ein Streifen-/Flicker-Artefakt bei Bewegung auf allen Texturen.
   Fünf Fixversuche (Anisotropie, Mesh-Trianguliserung, Normal-Map-Tuning, analytische Normalen,
   Texturen entfernen) haben es nicht gelöst. Volle Analyse:
   `docs/POSTMORTEM_2026-09-24_theatre-curtain-stripe-artifact.md`.
2. **Root Cause:** Vergleich mit dem offiziellen `mrdoob/three.js`-Beispiel
   (`examples/webgpu_compute_cloth.html`) zeigte: das Original verwendet **gar keine Textur** — nur
   Volltonfarbe + Sheen + HDR-Environment-Reflexion, plus analytische Per-Quad-Normalen statt
   `computeVertexNormals()`. Das ist strukturell immun gegen das Artefakt.
3. **v2 (aktiv):** Das offizielle Beispiel 1:1 als zwei Panel-Instanzen dupliziert, rot gefärbt,
   Öffnen/Schließen über eine Zug-Uniform an der fixierten Schienen-Reihe ergänzt. Kein Artefakt.
   Auf Nutzer-Feedback verfeinert: höher, breiter, lückenlos geschlossen, straffere Falten.

## Aktueller Stand — was funktioniert

- **Datei:** `KFB Theatre Curtain v2.html` (eigenständige HTML-Datei, kein DC — bewusste Ausnahme,
  siehe unten).
- Zwei Panels, symmetrisch gespiegelt, roter Sheen-Stoff, HDR-Environment-Reflexion.
- **Geschlossen:** Panels überlappen leicht am Zentrum (kein Spalt, kein Hintergrund sichtbar),
  fallen weitgehend gerade mit sanften Vertikalfalten.
- **Offen:** Klick auf OPEN zieht beide Panels seitlich weg, gibt die volle Bühnenöffnung frei.
- Physik läuft auf der GPU (WebGPU Compute Shader, 360 Hz Sub-Steps), nicht auf der CPU.
- **Wichtiger Preview-Hinweis:** Im Design-Sandbox-iframe läuft `requestAnimationFrame`
  (`renderer.setAnimationLoop`) nicht, wenn die Seite als `hidden`/unfokussiert gilt (bestätigt via
  `document.hidden === true` in dieser Session). Alle Screenshots in dieser Session wurden daher mit
  manuell vorgespulten Physik-Schritten erzeugt. **Im echten Browser-Tab beim Endnutzer ist das kein
  Problem** — dort ist die Seite sichtbar/fokussiert und der native Animation-Loop läuft normal.
  Trotzdem vor Auslieferung einmal in einem echten, sichtbaren Browser-Tab bestätigen.

## Bekannte offene Punkte (noch nicht umgesetzt, aus dem Chatverlauf)

- **Aufhängung/Hardware:** soll rundlicher/cartoon-hafter aussehen (Ringe/Haken), nicht die
  aktuelle unsichtbare Fixierung. Referenz: Muppets-Theatervorhang-Bild aus dem Chat (nicht im
  Projekt gespeichert).
- **Top-Volant/Scalloped Pelmet-Reihe** (bauchige Stoff-Halbkreise oben) — von Georg explizit als
  eigenes, späteres, ein-/ausschaltbares Layer eingestuft. Nicht Teil des Grundzustands.
- **WebGPU-Pflicht:** `WebGPU.isAvailable() === false` wirft einen Fehler und zeigt Three.js'
  Standard-Fehlermeldung. Kein WebGL-Fallback vorhanden (das offizielle three.js-Beispiel hat auch
  keinen: `// TODO: Fix example with WebGL backend`). Vor Rollout an Endnutzer mit älteren
  Browsern/GPUs klären, ob ein Fallback nötig ist.
- **Fabric-Textur wieder einführen?** Aktuell komplett texturlos (wie der Donor). Falls das
  "exakte KFB-Fabric"-Look-Ziel (ursprüngliches Game-Asset-Package) bestehen bleibt, mit Vorsicht
  angehen — genau diese Textur-Kachelung war die Wurzel des v1-Problems. Erst mit einer sehr
  niedrig aufgelösten, kaum wahrnehmbaren Bump-Textur experimentieren und wieder im
  Bewegungsvergleich (mehrere Frames, nicht nur Standbild) prüfen.

## DC- vs. Plain-HTML-Hinweis

Dieses Projekt verlangt normalerweise Design Components (`.dc.html`). `KFB Theatre Curtain v2.html`
ist bewusst eine Ausnahme: reine Three.js/WebGPU-Canvas-Erfahrung ohne DOM-Layout, nur ein
OPEN/CLOSE-Button-Overlay. Sobald mehr Bedienelemente (Fabric-Auswahl, Tie-Back, HUD-Toggle wie in
der eingestellten v1-DC) dazukommen sollen, sollte die produktive Fassung als DC gebaut werden
(Template + Logic-Klasse, Three.js-Szene in `componentDidMount`) — Vorlage dafür ist
`KFB Theatre Curtain.dc.html` (eingestellt, aber als Wiring-Referenz brauchbar).

## Repo-Herkunft

- `georg-doc/kayfabizarro@chat/gds-theatre-curtain-v1-2026-09-20` — v1-Donor (eingestellt,
  siehe Postmortem).
- `mrdoob/three.js@master`, Commit `7300402f96c23bfa2174ffc0da01fb4e277d33da` —
  `examples/webgpu_compute_cloth.html`, Basis für v2 (nur lesend importiert, dann in-Projekt
  dupliziert/erweitert).
- Details in `github.md`.

## Dateien in diesem Paket

- `KFB Theatre Curtain v2.html` — aktive, funktionierende Fassung.
- `Three.js Donor - webgpu_compute_cloth.html` — unveränderter 1:1-Referenzmount des offiziellen
  Beispiels.
- `KFB Theatre Curtain.dc.html` + `game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`
  — eingestellter v1-Ansatz, als Referenz/Lernmaterial belassen.
- `docs/POSTMORTEM_2026-09-24_theatre-curtain-stripe-artifact.md` — volle Fix-Historie v1.
- `docs/HANDOVER_THEATRE_CURTAIN_FRESH_START.md` — ursprüngliche Neustart-Anleitung (jetzt
  umgesetzt, siehe Status-Vermerk darin).
- `docs/HANDOVER_WSA_THEATRE_CURTAIN_2026-09-24.md` — dieses Dokument.
- `CHANGELOG.md` — additive Historie, neuester Eintrag oben.
- `github.md` — Repo-Anbindung.
- `screenshots/` — Vergleichsbelege (Donor sauber, KFB-Port final vor Abbruch).
