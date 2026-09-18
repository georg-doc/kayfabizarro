# CHANGELOG · KFB Animation Lab

**Additiv.** Neue Einträge kommen oben dazu. Nichts wird überschrieben, nichts gelöscht.
Ein überholter Eintrag bekommt `NACHTRAG` und bleibt stehen — wer nur den aktuellen Stand
sieht, kann nicht erkennen, welche Wege schon verworfen wurden, und geht sie wieder.

Stand-Dokumente: `LIVING_RIGGING.md` (Carl/Gesicht), `LIVING_VEHICLES.md` (Fahrzeuge).
Dieser Changelog ist die Zeitachse, die Stand-Dokumente sind die Begründung.

---

## 2026-09-18 · Session-Cut · Fahrzeug-Linie, dritte Runde abgeschlossen

**Gebaut**
- `KFB Cartoon Vehicle Deformer Lab.dc.html` — Werkbank mit elf Briefing-Knöpfen plus
  `RAIL HOLD` und `NEUTRAL`, vier Profilen, Signal-Reglern, `Flip` und `Orient` mit
  Gedächtnis je Fixture.
- `lab-v7/vehicle-cartoon-deformer.v2.js` — gruppenbasierter Deformer: nested Groups,
  bounded non-uniform scale, gedämpfte Springs. Kein Shader, kein Softbody.
- `lab-v7/fixture-adapters.v2.js` — 43 Fixtures, generiert aus Handoff (25) und
  Registry (18), Herkunft je Zeile.
- `lab-v7/deformer-profiles.json`, `lab-v7/TEST_SEQUENCES.json`.

**Sieben Befunde aus Georgs Sichtprüfung behoben**
- Rad-Regel um drei gemessene Bedingungen erweitert (Gegenstück, Bodenkontakt, Größen-Median).
  Police Car 15 → 4, Wagon 10 → 4. Vorher rotierte beim Police Car die **Tür** bei ACCEL mit.
- Kamera folgt nicht mehr der Blickrichtung (z-Lage war mit `facing` multipliziert).
- Near/Far aus der Modellhülle statt fest 0,01/200.
- Orient-Schalter auf sechs achsenparallele Lagen statt vier.
- Abgelesen und eingetragen: `Kart by Ben`, `vehicle-monster-truck`, `vehicle-truck` auf −z;
  `Wagon` auf X−90°.

**Kontakt-Latch statt Cooldown** — `railImpact()` darf je Frame gerufen werden; Aufrufe
innerhalb `retriggerMs` sind derselbe Kontakt. Drei Anläufe, zwei falsch gebaut, einer falsch
gemeldet (600 ms Wandkontakt ergaben gemessene fünf Einschläge, berichtet war einer).

**Überholt, bleibt liegen**
- `lab-v7/cardeform.v1.js` — Shader-Fassung. Briefing verlangt ausdrücklich keinen
  Vertex-Overkill. Preis: die Bananen-Biegung ist entfallen.
- `lab-v7/fixtures.v1.js` — Keyframe-Fixtures, ersetzt durch signalgetriebene Sequenzen.
- `KFB Vehicle Lab v1.dc.html` — erste Werkbank.

**Offen geblieben** — Go-Kart nicht achsenparallel, Rollerskate/Skateboard-Rollen
Einzelnetz, Space Base Bits nicht ladbar, ActionFigure fehlt, keine Zahl abgenommen,
kein Ton/VFX/Kamera. Vollständig in `RETURN_cartoon_vehicle_deformer.md` (OPEN) und
`HANDOVER_RACE_2026-09-18.md`.

---

## 2026-09-17 · Fahrzeug-Linie `lab-v7` angelegt

- Auftrag: KayKit Space Base Bits aufnehmen, Fahrzeuge mit Cartoon-Deformern für
  Speed-Race-Tracks vorbereiten. Track baut Georg selbst (`kfb-hub/stunt-race/track-lab-v062`).
- **Befund B1:** das Pack hat genau drei Fahrzeuge, nicht 57. Die übrigen glTF sind Basismodule.
- **Befund B2:** Space Base Bits liegt nicht im Registry und ist im Browser nicht ladbar.
- **Befund B3:** die Registry-Fahrzeuge sind die tragfähige Quelle (22 aus drei Packs).
- **NACHTRAG (17.09. abends):** der Asset-Handoff `kfb.asset-handoff.v1` @ `10a7fdce6b` ist
  ab jetzt die Quelle, nicht das Registry. Beide bleiben, getrennt gekennzeichnet.
- Stand-Dokument `LIVING_VEHICLES.md` angelegt.

---

## 2026-09-12 · Animation Lab v1.1 · Cross-Rig abgenommen

- Cross-Rig (`M+L`) mit `FIT`/`RAW`: fremde Clips füllen nur Lücken, das gemessene Rig
  hat Vorrang. Sechs Versuche eingetragen, Urteil vom Bediener.
- **Befund Large-Lücke:** Orc Brute mit `Jump_Start` aus Rig Medium bindet 23/23 und faltet
  roh zusammen; ohne Positionsspuren hält er. Urteil *limited*.
  **Produktionsfolge: Custom-Sprungclips für Rig Large entfallen.**
- Quellen gepinnt auf `b97b5ac55df2724fae623992433685583eece51e`, 94 Pfade vorher geprüft.
- `export/AnimationMap.v0.json` und `MISSING_ANIMATIONS.md` aus den echten Inventaren erzeugt.
- Evidence-Batch: Georgs Vollauf 48/48 Zellen gegengeprüft.
- Details in `HOUSEKEEPING.md` und `LAB_QA.md`.

---

## 2026-09-09 bis 09-11 · Clip-Schau und Asset-Aufnahme

- `KFB Clip-Schau v1.dc.html` als Evidence-Viewer, nach Sprint 1 eingefroren.
- Asset-Bibliothek von Georg aufgenommen, Pfade und doppelte Pack-Kopien in `SOURCE_PATHS.md`.
- Rigging-Linie (Carl/Gesicht) in `LIVING_RIGGING.md`; `16B-FAILED.md` und
  `POSTMORTEM_carlrig_v4_16B.md` sind das bezahlte Lehrgeld.
