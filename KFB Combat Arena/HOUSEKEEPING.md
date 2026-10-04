# HOUSEKEEPING — Combat Arena v2 (Stand 06.09.2026, Session-Ende)

Status je Artefakt: `AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET` · `SHARED`

## Deliverables

| Datei | Status | Anmerkung |
|---|---|---|
| `KFB Combat Arena v2.dc.html` | **AKTIV** | Integrator, Slice S3 (Schuss + Kill-Kette). Nächster Schritt: v3 im frischen Chat |
| `combat-arena-v2/host.v2.js` | **AKTIV** | Wirt: input · field · fx · time · save · cam. Enthält den FX-Anschluss (Atlas 256 px Kachel, `col→color`, Zellen-Tabelle) |
| `combat-arena-v2/floors.v2.js` | **AKTIV** | Bodenkatalog C1–C12 + S0. Prüfwerkzeug, zeichnet nichts |
| `combat-arena-v2/player.v2.js` | **AKTIV** | M2: Tempo · Rand · Blick · Clips · Sprung-Kette · Zielen |
| `combat-arena-v2/locomotion.v2.js` | **AKTIV** | M9: Schrittmaß (liest `schrittmass.json`, misst FB live) |
| `combat-arena-v2/mobs.v2.js` | **AKTIV** | M3: Roster, Spawn-Regel, Trennung, Look-Schicht |
| `combat-arena-v2/gunfight.v2.js` | **AKTIV** | M5/M6: Bamboo Rail · Würfelwurf · Deformer · Kill-Kette |
| `combat-arena-v1/arena-ring.v1.js` | **AKTIV · SHARED** | von v1 UND v2 benutzt. In dieser Session erweitert: Feld-Modus (Fläche × Motiv), Tuschekörper auf Blattgröße, Schärfe-Messung |
| `cardbuilder/kfb-card-builder.js` | **AKTIV · SHARED · KANON-DIVERGENZ** | trägt die sechs PDF-Fixes dieser Session. **Muss zurück in `skills/kfb-embed-bundle v3`** — siehe `docs/HANDOVER_kfb-card-builder-pdf-fixes.md` |

## Geteilte Module, die diese Session nur GELESEN hat — nie als tot einstufen

`modules/kfb-combat-def.js` · `kfb-weapon-dice.js` · `kfb-hit-response.js` · `kfb-monster-roster.js` ·
`kfb-monster-look.js` · `kfb-stride-measure.js` · `kfb-combat-atlas.js` · `kfb-fx-sprites.js` ·
`kfb-fx-trails.js` · `kfb-combat-cues.js` · `kfb-sfx-layers.js` · `kfb-combat-sfx.v2.json` ·
`kfb-vfx-recipes.js` · `schrittmass.json` · `studio-v12/light.v1.js` · `studio-v3/pet-eye-rig.v5.js` ·
`studio-v3/pet-mouth.v1.js` · `combat-arena-v1/host.v1.js` · `combat-arena-v1/frizzlebob.v1.js`

## Docs

| Datei | Status |
|---|---|
| `docs/combat-arena-v2/LIVING_combat-arena-v2.md` | **AKTIV** — Ist-Stand, alle Befunde, §21 offener Auftrag Gegnergrößen |
| `docs/HANDOVER_kfb-card-builder-pdf-fixes.md` | **AKTIV** — Repo-Übergabe an den Skill-Betreuer |
| `docs/combat-arena-v2/captures/` | **ASSET** — Abnahmebilder je Slice |

## In dieser Session aufgeräumt (mit Freigabe)

- `qa/` **gelöscht** (315 Dateien): Prüfbilder aus mehreren Sessions. Georgs Freigabe 06.09.
- Die **zwölf Messseiten** aus `qa/` liegen jetzt unter `qa-werkzeuge/` — sie sind in mehreren Docs
  als Messquelle zitiert (`monstercubes-orientierung.html` für die Blickachse, `cubepets-inventur.html`
  für den Pet-Bestand). **Zitatpfade in den Docs zeigen noch auf `qa/…`** — beim nächsten Doc-Durchgang
  nachziehen.

## Clean-Run-Checkliste (v2)

1. Seite laden → Vorhang zeigt »Karte … · FrizzleBob … · Gegner …«, hebt sich in unter 20 s.
2. Kopfzeile: `SLICE S3`, Status `kalibriert · ΔE ≤ 8`.
3. Knopf **Werkzeug** öffnen → Prüfblatt: **0 BLOCK gefallen**, C1 · C2 · C3 · C7 · C8 · C12 grün.
4. Klick ins Bild (Ton braucht eine Geste), dann **Schießprobe (C3)** → Kills = Würfel = Pops.
5. Konsole: nur die bekannte PMREM-Warnung (`sigmaRadians 0.06`).

## Offene Punkte (Details im LIVING)

1. **Gegnergrößen** — vier Fehlversuche, Stand laut Georg schlechter als am Anfang. Frischer Chat,
   Messung über die **Augenhöhe**, kein Werkzeugbau. (LIVING §21)
2. **Fußversatz FB** — zwei Regler auf einer Achse (v1 `_groundKeep` gegen M2). Erst entscheiden,
   wer den Boden hält, dann den anderen abschalten.
3. **Tonmischung** — Pegel 0,55, Cue-Namen kanonisch; Anschlag/Nachklang je Waffe gehört in die Bank.
4. **Bolzen als Ribbon** (`kfb-fx-trails`) statt zweischaliger Kugel.
5. **FB auf 0 HP** ohne Folge → S4 (Runden-Fluss).
6. **Pfad-Hygiene:** FBs gelbe Variante lädt über `./assets/models/FrizzleBob_Yellow*.gltf` (relativ)
   mit RAW-Rückfall auf Kenney + Tint. Im Standalone-Export greift der Rückfall — FB wäre nicht gelb.
   Kandidat: die gelben GLTF ins Repo und über RAW laden.
