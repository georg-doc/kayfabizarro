# CHANGELOG · Billboard B0 Source Proof

Additiv, chronologisch. Ältere Einträge stehen weiter oben in ihrem jeweiligen Übergabe-Kontext;
diese Datei beginnt bei der B0-Recovery vom 2026-09-24.

## 2026-09-24 — B0 Recovery (Ausgangsstand dieser Sitzung)
- Neu: `KFB Billboard Media Szene · B0 Source Proof.dc.html` + `bb0-boot.js`, geteilter Owner
  `bb-scene.js` (unverändert übernommen aus dem GATE-1-Build für `HERO_DONORS`,
  `renderCardQuarter()`, `buildStage()`).
- Zwei Render-Loop-Fehler behoben: Off-Origin-Pivot-Recentering beim Boot; rAF-Stalls in
  unfokussierten Vorschau-Frames (Umstellung auf das projekteigene rAF+Intervall-Hybrid-Muster
  aus `wm-boot.js`).
- `renderCardQuarter()` mit 12 s Timeout abgesichert (`page.render()` hängt im Preview-Sandbox,
  siehe `POST_MORTEM.md` bzw. `RETURN.md` §4) — zeigt `SOURCE CARD FAILED` mit echter
  Fehlermeldung statt Ersatzkunst.

## 2026-09-24 — Korrektur 1 (Georg: Karte muss direkt auf das Billboard, kein "TANKCO", kein Rand)
- `bb-scene.js` `loadHero()`: erster Versuch, die Ad-Face-Fläche automatisch zu finden (größte
  flache Mesh-Node-Box), inkl. `adFace.visible = false`. **Fehlgeschlagen** — Donor ist ein
  gemergtes Multi-Material-Mesh, siehe `POST_MORTEM.md` Fehler 2. Panel blieb auf der alten,
  falschen Positionsheuristik.
- `bb0-boot.js` `drawCard()`: von Fit-mit-Letterbox auf Cover-Crop umgestellt, Metadaten-Text-
  Einblendung (Titel/Kartennummer/Seite/Quadrant) entfernt. Canvas-Auflösung an
  `info.panelW/panelH`-Seitenverhältnis gekoppelt statt fest 1024×676.

## 2026-09-24 — Korrektur 2 (Georg: "DO NOT MOUNT! FILL THE EXACT 3D PLANE! NO BLACK BORDERS!")
- Live-Introspektion im laufenden Preview (Mesh-/Material-/Drawrange-Vermessung per
  Injektions-Code, Ergebnis ins Diag-Panel geschrieben, siehe `RETURN.md` §2): Ad-Face-Fläche
  exakt `4,20 × 2,10` Welteinheiten, volle Modellbreite, obere Hälfte der Modellhöhe,
  `ctr(0, 3.15, 0.993)`.
- `bb-scene.js` `loadHero()`: automatische Mesh-Erkennung entfernt (unbrauchbar bei dieser
  Modellstruktur, siehe `POST_MORTEM.md`), ersetzt durch die gemessenen exakten Fraktionen
  (`panelW = bs.x`, `panelH = bs.y * 0.5`, `cy = box.max.y - panelH/2`, `cz = box.max.z + 0.012`).
- Ergebnis geprüft per Screenshot (WIDE- und FRONT-Ansicht): Panel deckungsgleich mit der
  Werbefläche, "TANKCO" vollständig verdeckt, kein Rand auf irgendeiner Seite.
- **Von Georg abgenommen.**

## Nächster Schritt (angesagt, nicht in diesem Pass bearbeitet)
- Cartoon-Anatomie der Karten-Motive und die Anatomie/Proportion des 3D-Modells sollen
  aneinander angeglichen werden ("beide etwas runter"). Siehe `RETURN.md` §5 — bewusst nicht
  weiter dokumentiert, nur als nächster Schritt vermerkt.
