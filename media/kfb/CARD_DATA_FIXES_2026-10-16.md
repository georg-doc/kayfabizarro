# Kartendaten-Fixes Batch 8 (16.10.2026)

Basis: `data/kfb-card-title-case-2026-10-15` @ `eade4aec`. Register `media/kfb/index.json` @ `52adc8f1` (Datenpfade, `coverOffset`). Anlass: WS0-Intake der Triplet-Review Batch 8 (`BATCH8_WS0_INTAKE.md`, Abschnitt „Datenhinweise für WS0“).

Regel: Druck = Wahrheit (V-242, V-271). Geprüft am gerenderten Seitenbild der PDF v05 (PDFKit, Seite 2,7- bis 6-fach, Viertel gezoomt). Die lokalen PDFs sind blob-gleich mit `media/kfb/<pdf>` auf `main`. Alter Wert bleibt jeweils erhalten (`jsonLegacy` bzw. `jsonLegacyPower`), neu ist `textSource` mit `checkedAt: 2026-10-16`. Jede Datei behält ihr JSON-Format (Einrückung 2 bzw. 0). Geändert sind nur die vier Deck-Dateien und dieses Protokoll.

## Auftrag (4 Fixes)

| Deck | Karte | Feld | vorher | nachher | Druck |
|---|---|---|---|---|---|
| `pharaoh_piledriver` | #46 The Field of Reeds (VIP Lounge) | `power` | `null` | „Heal all damage at end of turn.“ | S. 13 oben rechts; gedruckt als „EFFECT: …“, Feldlabel wie bei #45/#47/#48 nur in `printTypo` |
| `pharaoh_piledriver` | #46 | `lore` | „Aaru. The goal. It's just like Earth but you don't have to pay taxes.“ | unverändert (= Druck) | S. 13 oben rechts |
| `trust_and_betrayal` | #30 Heel-Face Turn | `power` | „Switch from 'Evil' to 'Good': All your Damage cards become healing cards.“ | `null`; alter Wert in `jsonLegacyPower`; `printNote`: „no POWER/LORE printed on card (verified 2026-10-16)“ | S. 9 oben rechts: nur Titel und Werte [R] 3, [A] 4, [F] 4 |
| `cosmic_grift_dark_journalism` | #20 Nature Elementals | `lore` | „… occasionally ghost-write your [text truncated]“ | „… occasionally ghost-write your …“ (Teilfix, siehe unten) | S. 5 unten rechts |
| `observation_underground` | #3 The Taschenspion | `cardName` / `cardNamePrint` | „Die Taschenspion (The Pocket Spy)“ / „DIE TASCHENSPION (The Pocket Spy)“ | „The Taschenspion (The Pocket Spy)“ / „THE TASCHENSPION (The Pocket Spy)“ | S. 1 unten links |

**Cosmic #20 bleibt inhaltlich OPEN.** Die Lore ist im Druck nicht vollständig: nach „ghost-write your s…“ verdeckt das GW-Signaturlogo den Rest. Dasselbe in `Cosmic_Grift_-_Dark_Journalism - ADD.pdf`; im Original `CONSPIRACY/Cosmic_Grift - Dark Journalism.pdf` verdeckt das NotebookLM-Logo dieselbe Stelle. Kein Exemplar zeigt das Satzende, auch keine Analyse-Datei. Deshalb nichts ergänzt: nur die Markierung „[text truncated]“ (kein Drucktext, würde mitgesprochen) durch „…“ ersetzt; Befund in `printNote`. Das Satzende braucht eine Entscheidung des Autors.

## Zusätzlich gefunden und am Druck verifiziert (Stichprobe)

| Deck | Karte | Feld | vorher | nachher | Druck |
|---|---|---|---|---|---|
| `cosmic_grift_dark_journalism` | #40 Space Pearl Harbor | `lore` | „… blame the aliens, seize tota[text truncated]“ | „… blame the aliens, seize total global control.“ | S. 10 unten rechts; Wortende vom GW-Logo verdeckt, Oberlängen passen; voll lesbar im Original `CONSPIRACY/Cosmic_Grift - Dark Journalism.pdf` S. 10 unten rechts (`printTypo`) |
| `observation_underground` | #1 Uncle FrizzleBob | `power` | „Dispels techno-scenic illusions …“ | „Dispels technocratic illusions …“ | S. 1 oben links |
| `observation_underground` | #1 | `lore` | „… sloppy bucket of watercolour ink.“ | „… sloppy bucket of watercolor truth.“ | S. 1 oben links |
| `observation_underground` | #4 The Media Matrix | `power` | „Triggers infinite scroll doom loop. …“ | „Triggers infinite scroll loop. …“ | S. 1 unten rechts |
| `observation_underground` | #4 | `lore` | „Over 8.92 billion captive animals …“ | „Over 6.92 billion captive animals …“ | S. 1 unten rechts |
| `observation_underground` | #33 DARPA's Toy | `lore` | „… Internet—… The ultimate weapon for covert population attack, …“ | „… internet—… The ideal weapon for covert population attacks, …“ | S. 9 oben links |
| `observation_underground` | #36 Google Play Protect | `lore` | „… the perfect tool to make independent media apps …“ | „… the perfect tool to nuke independent media apps …“ | S. 9 unten rechts; Druckfehler „spps“ in der POWER nur in `printTypo` |

## Stichprobe je Deck (10+ Karten, ganze Seiten gerendert)

| Deck | geprüft | Befund |
|---|---|---|
| `cosmic_grift_dark_journalism` | #9–12, #37–40, #49–52 (12) | 11 = Druck; #40 korrigiert (oben) |
| `observation_underground` | #1–4, #17–20, #33–36 (12) | 7 = Druck; #1, #3, #4, #33, #36 korrigiert. Das Deck war nicht im Drucktext-Abgleich R1 (`CARD_TEXT_CANONICAL_R1.md`) und hat keine einzige `textSource`. Bei 5 von 12 Abweichungen ist ein vollständiger Abgleich aller 48 Karten nötig. |
| `pharaoh_piledriver` | #9–12, #21–24, #37–40 (12) | Text 12 = Druck. Hinweis, nicht geändert: #39 druckt den Titel stilisiert „SE7EN SCORPIONS (THE POSSE)“, JSON `cardNamePrint` „SEVEN SCORPIONS (THE POSSE)“ |
| `trust_and_betrayal` | #13–16, #29–32, #45–48 (12) | 11 = Druck, #30 korrigiert (oben) |

## Nicht geändert

- Registry-Kopien `registry/assets/v1/decks/*.json` (laut CHANGELOG noch aus dem Kartentext neu zu erzeugen).
- Deck-Metadaten (`qa`, `todos`, `notes`, `gradeReason`) und `artworkPrompt`.
