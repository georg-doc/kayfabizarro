# SESSION CUT · 2026-09-24 · WorldBuilder v1 FAIL → WB-W0 Scale + Traversability

```
Datum:     2026-09-24
Projekt:   KFB World Design Setup (Claude Design)
Scope:     WorldBuilder v1 Slice 1 (rejected) · Post Mortem · WB-W0 (candidate)
Mode:      live
Hinweis:   Die Referenz `cut-prompt-v1-2.md` des Skills war in dieser Umgebung nicht lesbar.
           Aufbau nach Skill-Header (Sektionen 1–5), Inhalte aus diesem Chat.
```

## 1 · Stand

**WorldBuilder v1 · Slice 1:** `HUMAN_REJECTED_FOUNDATION · DO NOT PATCH`. Eingefroren unter
`returns/WORLDBUILDER_V1_2026-09-24/` mit `POST_MORTEM.md`, `NEXT_GATE_WB-W0.md`, Evidenz, Code.

**WB-W0 · World Scale + Traversability Proof:** gebaut, 10/10 Gates PASS im Preview. Georg:
„Gesamtkonzept und Anmutung gefallen mir schon sehr gut.“ Offene Punkte siehe §4.
- Einstieg `KFB WB-W0 · World Scale + Traversability.dc.html` · Module `w0-boot.js`, `w0-region.js`,
  `w0-globe.js`, `w0-actor.js`, `w0-ink.js` · geteilt: `wd-registry.js`, `wd-donors.js`, `bb-scene.js`.
- Rückgabe `returns/WB-W0_2026-09-24/` (code, evidence, RETURN, CHANGELOG, SOURCE).
- Messwerte: GothGirl 2,211 m · KayKit-Tür 2,80 m · Tiny Treats ×1,12 · Kenney ×14,286 · Route
  Racer CP0→CP2 241 m, 18,0 m + 2,7 m Schulter, Sperrkorridor ±13,14 m · Rampentest unveränderter
  Travel-`walk-controller.js` → `controllerWalkSlopeMax 25°` (30°/35°: Auto-Hops) → Weltgrenze 25°.

## 2 · Was schiefging (und was nicht)

- **Slice 1:** Planet-/Editor-Demo vor Massstab, Begehbarkeit, Route und Region. Ausführlich:
  `returns/WORLDBUILDER_V1_2026-09-24/POST_MORTEM.md` (Briefing-Ursachen B-1…B-6, Umsetzung 4.1…4.8).
- **In W0 gefangen und behoben:** Tür-Gate zählte die Türschwelle als Kollision · Felsen auf zu
  unebenem Grund (Auflagetest ergänzt) · Böschungen bis 44° (Rampentest vor Gelände, Talus = 25°) ·
  Farbsprung Globus ↔ Region (Einstrahlung des Rigs gerechnet) · Billboard-Flackern (z-fighting
  der Kartenfläche bei ×14, Schattenbox schwamm) · Report meldete die Dungeon-Wand statt der
  Dungeon-Tür.
- **Noch nicht gefangen, von Georg gesehen:** Outline zeichnet den ganzen runden Kopf (wirkt
  falsch) · schwarze Bäume.

## 3 · Entscheidungen

- Globus = Übersicht im eigenen Massstab; Region = ENU 1 u = 1 m; geteilt nur Semantik (WGS84,
  Zone/Route-ID, Seed, Tageszeit). Travel-Radius 474 m für begehbare Welt verworfen.
- Region Köln `dom-zentrum-v0`, Racer-Route als Koordinaten- und Streckenwahrheit, Dom nur Referenz.
- Route 18,0 m STANDARD, Schulter und Sperrkorridor getrennt gespeichert.
- Landmark Kenney-Billboard B0 (Karte forget_utopia #7).
- Hang: Spawn ≤ 3° · Route ≤ 10° · sonst ≤ 30°, abgesenkt auf gemessene 25°.
- Masse aus Quellen; einzige Setzung ohne Quelle: Böschungsbreite 26 m (benannt).

## 4 · Handover (für den nächsten Chat / WSA)

Weiterbauen auf WB-W0, nicht auf Slice 1. Nächste Punkte, Reihenfolge nach Georg:

1. **Outline:** aktuell wird der ganze runde Kopf der Figur umrandet und wirkt falsch. Georg
   tendiert gerade zu **ohne Outline**; optimieren nur, wenn es sauber lösbar ist (z. B. Figuren
   ausnehmen oder Innenkanten-Schwelle). `w0-ink.js`, Schalter `INK` im Panel.
2. **Schwarze Bäume:** KayKit `Tree_1_A_Color1` rendert schwarz — Material/Textur prüfen
   (`repairTextures`-Weg, Palette-Atlas), nicht umfärben.
3. **Animation (wichtig für WSA-Übergabe):** aktuell nur der alte harte Wechsel Walk ↔ Run
   (Shift). Gewünscht: **stufenloser Übergang** zwischen den Bewegungszuständen mit je eigenem
   Tempo pro Movement-State (Idle · Walk · Run), Clip-Geschwindigkeit an die gemessene
   Controller-Geschwindigkeit gekoppelt (`state.speed`, `walkRef`, `runRef` liefert der
   walk-controller schon). Für die Promotion zwingend; danach in W0 einbauen. Mixamo-Bibliothek
   (`ANIMATION_INTAKE_01_MIXAMO_2026-09-24.md`) als späterer Tausch per Clip-ID.
4. Danach laut Gate-Linie: Fahrzeugtest auf der 18-m-Route, OSM-Zone, Gebäudegrammatik,
   Landmarks, Wetter, God-Mode.

Offen aus RETURN: Haus ohne Inneres (Tür nur bis Schwelle) · Racer-Schulter in W0 flach ·
Routenanfang/-ende ohne Start-/Zielbauteil · WB2-Sculpt/edit-layer in W0 noch nicht verdrahtet.

---

## 5 · Memory-Snapshot

- Georg will zuerst **einen messbaren, begehbaren Ort**, dann Welt/Editor. Jede Zahl mit Quelle.
- Eingefrorene Grundlagen (PR #194 Hürth/Elastic, WB v1 Slice 1) nicht als Donor nutzen.
- Rampentest-Ergebnis des unveränderten Controllers bestimmt die Weltgrenze; Physik nicht tunen.
- Outline: aktuell eher aus. Animationsübergänge stufenlos, Tempo je Zustand.
