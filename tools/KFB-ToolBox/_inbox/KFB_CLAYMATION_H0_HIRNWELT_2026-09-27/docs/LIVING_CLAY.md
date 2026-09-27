# LIVING_CLAY · Knetwelt-Linie (Claymation-Look)

Stand 2026-09-27 · das eine Stand-Dokument dieser Linie. Ein frischer Chat liest zuerst
`ONBOARDING_frischer_chat_claymation.md`, dann dieses, dann `CLAUDE.md`.
Verfahren und Zahlen: `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`. Verlauf: `CHANGELOG.md` (nur oberste Einträge lesen).

## Pflege-Regel (hält dieses Dokument klein)

- Höchstens **120 Zeilen / 10 kB**. Wird es größer, wandert der älteste Abschnitt »Stand je Scheibe« nach
  `docs/archive/LIVING_CLAY_<datum>.md` und hier bleibt eine Zeile mit Verweis.
- Je Scheibe **höchstens 8 Zeilen**: Einstieg, was sie zeigt, Georgs Urteil, offene Punkte.
- Begründungen, Zahlenreihen und Befund-Geschichten gehören in den `CHANGELOG.md` (additiv, oben neu)
  oder ins How-to, nicht hierher.
- Eine Zeile »Offen« wird gestrichen, wenn sie erledigt ist; erledigt steht im Changelog.

## Stand je Scheibe

**H0 · Hirnwelt** (27.09., Georg: »begeistert … großartig«) — `KFB Hirnwelt H0.dc.html` → `lab-brain/brain-world.v4.js`.
BodyParts3D-Hirn (44 Netze) als kleine Knetwelt: Gyri Hügel, Sulci Flüsse, Straße auf den Graten mit Brücken,
12 Orte nach Funktion der Region, 14 Figuren (4 Large, 10 Medium) aus dem Resident Atlas, 8 Autos, Mitfahr-Kamera.
Quellen `lab-brain/SOURCES.md`. Offen: Ladezeit ≈ 40 s · Orte-Kamera bei der Sternwarte zu nah · Figuren nicht
gegen die Straße geprüft (Demon Lord steht am Rand) · eine Runde, keine Kreuzungen · Broca fehlt in der Quelle.

**M0 · Knet-Medizin** (26.09.) — `KFB Knet-Medizin M0.dc.html` → `lab-med/med-probe.v3.js`. Molekül (PubChem),
Herz (BodyParts3D, 12 Strukturen), Erythrozyt (Evans & Fung). Knetgrad 0–100 mit gemessener Formabweichung.
Slice `export/doccheck-slice/Knet-Medizin/`. Offen: Herzkammern ohne eigene Netze · Leukozyten für Sim-Blood.

**D1 · Knet-Probe** (26.09., Georg: »top! guter erster POC«) — `KFB Knet-Probe D1.dc.html` → `lab-clay/clay-probe.v5.js`.
Plateau aus Kissenziegeln, KayKit-Häuser, Kenney-Fahrbahn und -Rennwagen, CapsuleCarl, Wolke, Knetmasse, Tafelberge.
Jede Schicht schaltbar. Konzept: `KFB Knetwelt Look-Konzept.dc.html`. Offen: Tafelberge sind Kästen · Kenney-Auto wird gelb.

## Module (aktiv)

| Datei | Rolle |
|---|---|
| `lab-clay/clay-material.v4.js` | Knet-Material, Modelle-Weg für alles, `scale` je Material, Saat je Objekt |
| `lab-clay/clay-relief.v2.js` | Gradientkarte der Handspuren (RG) und Feinkorn (BA) |
| `lab-clay/clay-soften.v1.js` | Vorstufe: unterteilen, verschweißen, Taubin, Beulen |
| `lab-clay/clay-probe.v5.js` | Bühne D1 |
| `lab-brain/brain-world.v4.js` + `brain-world.v1.bin/.json` | Bühne H0 und gebackenes Gelände |
| `lab-med/med-probe.v3.js` | Bühne M0 |

Superseded, kein Importer: `clay-probe.v1–v4`, `clay-material.v1–v3`, `clay-relief.v1`, `brain-world.v1–v3` (gelöscht).

## Entscheidungen Georg

- Relief über den Modelle-Weg für alles (Stempelkarte, Facetten, Abdrücke). Palette Claybound, Option C als Schalter.
- Häuser bleiben KayKit + Vorstufe (»exakt diese Cartoon-Optik«), nicht nachmodellieren.
- Kugel-in-Kugel als Muster für Wolken und Bäume behalten.
- Straßenführung über Grate mit Brücken und Flüsse in den Furchen sind abgenommen.
- CC BY-SA (BodyParts3D) ist in Ordnung. Kein Stop-Motion vorerst.
- Panel im Stil `kfb-hub/index.html`, nicht DocCheck (Konzept-Dokumente bleiben DocCheck).

## Offen (linienweit)

- TUNE: Default-Reglerstand aus Georgs Einstellungen übernehmen.
- OPEN: Vorstufe offline als `.glb` backen (Ladezeit H0, Bildrate D2).
- OPEN: Figuren ohne KFB-Augen-Rig.
- DEFERRED: KlayfaBizarro-Kollisionen (Gummi federt zurück, Knete bleibt verformt).
- OPEN: Lizenz cgbookcase Fingerprints 01 vor Veröffentlichung prüfen.

## Nächstes Gate

Georg wählt. Kandidaten: **D2** Startgerade Cologne Option C im Knet-Look mit Bildrate bei Renntempo ·
**H1** Hirnwelt mit Kreuzungen, zweiter Runde und Vorstufe offline · **M1** Knet-Werkstatt Erythrozyt.
