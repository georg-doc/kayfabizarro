# RKIT · Vorlagen-Zeile Skin `trail` (Geh-Netz, V-152 / V-154) · Vorschlag, kein Bau (R1)

Stand 2026-10-11 · Grundlage:
- CR2 (Fußwege und Wanderpfade);
- Georgs Antworten in STEERING_ANSWERS_TD_R2 (V-154): trail = Geh-Netz ohne Autos; Pfad 1 MC schmal bzw. 2 MC Hauptweg; Steinstufen aus Masonry A; Trittsteine einen Figurenschritt auseinander; Tunnel-Steg mit Geländer; Holzbrücke erst aus Bestand.

## Bestand (V-140, vor dem Vorschlag geprüft)

| Teil | gefunden | nicht gefunden |
|---|---|---|
| Geh-Netz im Lab | `IslandLayout.routes {from, to, w, bend}` + `places` (plaza / clearing / lookout), `src/island/spec.ts:83–88`; Walker: Boden bis 35° begehbar (`src/main.ts:333`) | Track Core hat kein Geh-Netz |
| Steinstufen | Masonry A `STUFE_1MC` (6,35 × 0,77 × 0,45, Steigung 0,45, Auftritt ⅛ MC = 0,8) und `STUFE_12MC` (3,15 breit) | – |
| Holzbrücke | KayKit Medieval Builder `bridge.gltf.glb` (Bogen-Steg auf zwei Widerlagern, 2,0 × 0,74 × 0,78 Modell) und `bridge_roofed`; KayKit Hexagon `building_bridge_A/B` (Bogen, Hex-Feld, im Lab vorhanden). Material: Atlas-Textur, im Lab am Bild prüfen, ob Holz | Tiny Treats: keine Brücke in Bakery, Homely House, Pretty Park (Lab-Auszug), Pleasant Picnic |
| Zaun / Gatter (auch Schotter-Ende) | Tiny Treats `fence_straight`, `gate_single`; KayKit Hex `fence_wood_straight(_gate)`, `fence_stone_straight(_gate)` | – |
| Aussicht | Lab `places` kind `lookout` | Plattform-Bauteil |
| Trittsteine | – | weder Core noch Lab |

## Vorlagen-Zeile

| Feld | Vorschlag |
|---|---|
| **Logik** | Track Core bekommt eine Geh-Familie `TRAIL`: Maßstab `walk`, keine Autos, keine Fahr-Checks. Fahrzeug-Checks und Knoten-Fahrwege entfallen, dafür kommen Geh-Checks dazu. Der Schlüssel `trail` wird nur für TRAIL freigeschaltet; eine Fahr-Familie auf trail ist ein Fehler. |
| **Breite** | 1 MC (6,4) schmaler Bergpfad, 2 MC (12,8) Hauptweg (V-154) |
| **Querschnitt** | Pfadfläche + weiche Erdlippe beidseits (kein Bord). Rollen: path, path_edge, verge, embankment. |
| **Steigung** | Rampe bis **12 %** (Vorschlag, Frage A). Steiler wird ein Stück `STAIRS`: Stufen aus Masonry A (Steigung 0,45, Auftritt 0,8); mindestens 3, höchstens 12 Stufen, dann ein Podest von 1 MC. Als Daten je Stufe {s, Höhe, Breite}; der Strom bleibt eine Rampe für den Walker (35°-Regel). |
| **Trittsteine** | Stück `STEPPING_STONES` über Bach oder Wiese: Steine als Daten {p, r}, Abstand ein Figurenschritt (Frage B: Maß), keine durchgehende Fläche |
| **Holzbrücke** | Bestand: KayKit Medieval Builder `bridge`, sonst Hexagon-`building_bridge`. Core liefert nur Anker und Spannweite (Stück `FOOTBRIDGE`, Pfeiler nur auf der Insel, V-120); Look aus dem Bestand. Erst wenn der Bestand nicht passt: RKIT baut eine Holz-Familie wie Masonry A. |
| **Knoten** | Gabel / T / Y als JUNCTION in TRAIL (Platte bündig, keine Markierung). Wendeschleifen gibt es nicht; Pfade enden an einem Anker (Platz, Aussicht, Hof), nie im Nichts (Lab-Regel HIGH 4). |
| **Übergänge** | T1 Pfad ↔ Platz (bündig, V-150 #8); T2 Pfad ↔ Straße (an Gehweg bzw. Bord mit Absenkung; Zebra nur mit Gehweg zu Gebäuden, V-150 #9); T3 Pfad ↔ Schotter (bündig, Kies franst aus). Je 1 MC, Daten in `g.transitions`. |
| **Tunnel-Steg** | Im Straßentunnel ein erhöhter Steg mit Geländer: als Tunnel-Seitendaten `walkway {side, w 1,5, h 0,45, rail}`; der Fahrraum bleibt unverändert (Checks) |
| **Aussicht** | Ende-Anker `lookout` mit Plattform-Rahmen (Lab-`places`) |
| **Lab-Anbindung** | TRAIL-Ströme liefern dem Lab die Mittellinie, Breite und Anker für `IslandLayout.routes`, in Absprache mit der MVP-Sitzung (Frage C) |
| **Checks** | `walk_grade` (≤ Rampe bzw. STAIRS), `walk_ends` (jedes Ende an einem Anker), `walk_clear` (keine Fahrstraße auf dem Pfad, außer an T2) |
| **Tests** | `test-trail.mjs`; Teil 0 und alle Suiten bitgleich |
| **Owner** | Core: Familie, Stücke, Daten, Checks. Lab: Walker, Look, Ausstattung. RKIT: Stufen bzw. Mauer aus Masonry A, ggf. Holz-Familie. |
| **Aufwand** | L |

## Fragen vor dem Bau (V-148)

| | Frage |
|---|---|
| A | Größte Pfad-Steigung ohne Stufen: 12 % in Ordnung? Der Walker schafft bis 35°, aber Pfade sollen gemütlich sein. |
| B | Trittstein-Abstand: Was ist ein „Figurenschritt“ in Lab-Maß (Vorschlag 0,6 H ≈ 2,2)? |
| C | Wer besitzt das Geh-Netz: Track Core TRAIL (wie Straßen) mit Übergabe an `IslandLayout.routes`, oder bleibt das Lab-Layout führend und TRAIL liefert nur Bauteile (Stufen, Steg, Brücke)? |

## Entscheid C (Steuerung 11.10., V-002) und Folge für die Vorlage (R1a)

**Das Geh-Netz gehört dem Lab-Layout** (`IslandLayout.routes / places`, Georg gestaltet im Editor). Es gibt keinen zweiten Netz-Besitzer. Damit ändert sich die Vorlage:

| Feld | R1 | R1a |
|---|---|---|
| Logik | Familie TRAIL mit eigenen Strömen und Knoten | **Bibliothek** `trail` in Track Core, die das Lab aufruft. Sie baut keine eigenen Routen und keine Knoten. |
| Eingabe | Rezept | Lab-Route: Mittellinie (Punkte), Breite (1 bzw. 2 MC), Boden-Höhenfunktion bzw. Höhenprofil, Anker an beiden Enden |
| Bauteile | STAIRS, STEPPING_STONES, FOOTBRIDGE als Rezept-Stücke | Funktionen, die Daten zurückgeben: `trailStairs(segment)` (Stufen aus Masonry A, 3–12, Podest 1 MC), `trailSteppingStones(segment, gap)`, `trailFootbridge(a, b)` (Anker + Spannweite; Look aus KayKit-Bestand), `trailTransition(kind)` (Pfad ↔ Platz / Straße / Schotter) |
| Prüfungen | Graph-Checks | `trailChecks(route)`: `walk_grade` (Rampe ≤ A, sonst Stufen), `walk_ends` (beide Enden an einem Anker), `walk_clear` (keine Fahrstraße auf dem Pfad, außer an Übergängen; prüft gegen die Track-Core-Ströme der Insel) |
| Tunnel-Steg | Tunnel-Seitendaten | bleibt ein Tunnel-Datum im Core (Straßentunnel gehört dem Core) |
| Knoten / Wenden | Geh-Knoten in Core | entfällt: Kreuzungen und Gabeln macht das Lab-Layout |
| Aufwand | L | **M** |

Gebaut wird erst, wenn Georg A (Steigung ohne Stufen) und B (Trittstein-Abstand) beantwortet hat.

**Ergänzung MVP-Sicht (11.10.):** passt zu R1a.
- Das Insel-Layout führt; die Lab-Gehfläche (`surface.ts`, Walker 35°, `stepMax`) prüft.
- TRAIL rechnet das Profil aus Mittellinie + Höhenverlauf des Lab: Stufenzahl und -höhe, Steg- bzw. Brückenspanne, Trittstein-Abstand.
- TRAIL gibt Anker `{p, T, U}` zurück. Es gilt dasselbe Schema wie bei B7: Geometrie RKIT, Look und Platzierung Lab.

## Entscheid B (Georg, V-157) und Parameter-Schnittstelle

Der Trittstein-Abstand wird nicht geschätzt, sondern aus Locomotion bzw. Animationen gemessen. Hauptreferenz ist das Medium-Rig. Die MVP-Sitzung liefert die Schrittlängen je Gangart. Im Core steht **kein fester Wert**.

**Schnittstelle (vorgesehen, Bau erst nach A):**

```js
// gait = vom Lab gemessen (Medium-Rig), Lab-Einheiten; Track Core rechnet nur damit, speichert nichts davon
const gait = { rig: 'medium', walk: { stride }, jog: { stride }, hop: { maxGap, maxRise },   // Schrittlänge je Gangart, Sprung-Grenzen
               step: { maxRise, minTread } };                                                   // was der Walker als Stufe nimmt
trailSteppingStones(segment, { gait, mode: 'walk' | 'hop' })   // Abstand = gait[mode].stride (bzw. ≤ hop.maxGap), Steine {p, T, U, r}
trailStairs(segment, { gait, kit: 'masonry_a' })               // Stufenhöhe = min(Masonry-A-Steigung 0,45, gait.step.maxRise); Auftritt ≥ gait.step.minTread
```

- Fehlt `gait`, wirft die Funktion einen Fehler. Es gibt keinen stillen Standardwert.
- `trailChecks` prüft zusätzlich: Steinabstand ≤ `stride`, Stufe ≤ `maxRise`.
- Offen bleibt A, die größte Pfad-Steigung ohne Stufen.
