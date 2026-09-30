# Sprintplanung · Billboard Kaleidoscope ab H13

Stand 30.09.2026 · gilt, bis Georg es ändert. Fortsetzung von `docs/SPRINT_billboard-hypernorm.md` (dort S1–S6, W1; G0 entschieden).
Regel: ein Slice je Lauf, H14 = Kopie von H13, vorher fünf Zeilen, nachher Screenshot in Arbeitsgröße.

## Übersicht

| Slice | Eigentümer | Ziel | Fertig, wenn | Hängt an |
|---|---|---|---|---|
| S-A | Claude Design | **Statischer Render-Modus** in H14: fester Seed, feste Einstellungsfolge, Export PNG-Reihe/WebM, Manifest mit Quellen | Ein Seed ergibt zweimal dieselbe Folge (Bildvergleich), Manifest listet je Ebene Quelle + Pin | — |
| S-B | Claude Design | **S1 Rechte-Kuratierung** der 33 LoC-Platten (`PROVENANCE_LOC_H4.json`) | Jede Platte `rights` ≠ NOT_VERIFIED, Ausfallliste | — |
| S-C | Claude Design | **R3-Material einhängen**: neuer Pin, Themen `cat:<id>` als Auswahlkriterium, Live-Suche abschaltbar | ≥ 24 Manifest-Bilder je Thema geladen, Live-Suche aus, Screenshot je Thema | W5 (R3 gemergt) |
| S-D | Claude Design | **R4-Themen** (Medizin mit `deck:`-Paarung Beleg + Karte, Tiere, Buchseiten, Architektur, Artefakte) | Pro Thema ein Shot, Medizin-Paarung zeigt Karte desselben Decks | S-C, R4 gemergt |
| S-E | Claude Design | **S3 STAGE3D-Ebene** (KayKit-Figur/Prop mit Clip als Ebene) über `mountGraft()`/`mountCarl()` | Bone- und Clip-Bindung im UI, ein Renderer | — |
| S-F | Claude Design | **S2 PD-Film als Basis** (Clips, CORS geprüft) | Ein Clip läuft im Schnitt, Quelle + Rechte belegt | S-B |
| S-G | Claude Design | **Textbestand:** Satzbestand aus Karten erweitern, Freigabe durch Georg | Liste von Georg abgenommen, Generator zieht nur daraus | Georg |
| S-H | Claude Design | **Performance:** fps auf Mittelklasse-Laptop und Mobil messen, Rückfallstufen | Messwerte im UI, Rückfall dokumentiert | — |
| S-I | Claude Design | **Mehrfachausgabe:** eine Engine, mehrere Canvas-Ziele | 4 Ziele gleichzeitig, ein WebGL-/Canvas-Besitzer | S-H |
| W1–W5 | WSA | siehe `HANDOVER_WSA.md` | siehe dort | — |

## Empfohlene Reihenfolge

1. **S-A** (macht W2 möglich, hängt an nichts)
2. **S-B** (entscheidet, was in committete Assets darf)
3. **S-C**, sobald R3 gemergt ist
4. **S-E**, **S-F**, **S-D** nach Georgs Reihenfolge (D3: Film → KayKit → Karten)
5. **S-H**, **S-I** vor der Mehrfach-Tafel

Parallel bei WSA: W5 → W2 → W1 → W3 → W4.

## Meilensteine

| Meilenstein | Enthält | Beleg |
|---|---|---|
| M1 Statisch | S-A, S-B, W2 | committete Billboards mit Manifest |
| M2 Material | S-C, S-D | Themen-Bogen, Paarung Beleg + Karte |
| M3 Bühne | S-E, S-F, W1, W3 | H-Fläche auf der Tafel, Disco-Anschluss |
| M4 Betrieb | S-H, S-I | Messwerte, Mehrfachausgabe |

## Georg-Entscheidungen offen

- Format der statischen Billboards (Auflösung, PNG/WebM).
- Reddit-Referenzen (seit B2b-P1 offen).
- Satzbestand (S-G).
- Reihenfolge nach M1, falls abweichend von D3.

## Risiken

| Risiko | Gegenmaßnahme |
|---|---|
| Rückfall in Generator-Look durch neue Würfel | Kombinationen entscheiden, nicht würfeln; Blick aufs Bild vor Zahl |
| Rechte unklar bei LoC-Platten | S-B vor jedem committeten Asset |
| R3/R4 verzögert | S-A, S-B, S-E laufen unabhängig |
| Ein Kontext je Canvas bei mehreren Tafeln | S-I |
| Frischer Chat baut neben H13 | Onboarding-Regel 1 und 2 |

## Nicht im Plan

Engine v0 weiterbauen · B2b-P1 reparieren · neue Registry · Figuren-Nachbauten · Push aus Claude Design.
