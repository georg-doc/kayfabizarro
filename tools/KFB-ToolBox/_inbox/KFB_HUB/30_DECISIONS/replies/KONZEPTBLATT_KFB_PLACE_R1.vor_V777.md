# Konzeptblatt · kfb-place R1 · Kern-Modul für Umgebung, Props und Natur · WS0 · 25.10.2026 (V-748, V-749)

**In einem Satz:** Ein Regelwerk mit Kachel-Datei und einem Löser legt jede Zelle der prozeduralen Welt nach unseren Regeln an. Proof-Bild und Spiel zeigen deshalb bei gleichem Seed dasselbe Bild.

**Grundlage:**
- Prüfbericht `replies/AUDIT_PLACEMENT_CORE_R1.md`;
- Kanon Gebiete 2, 3, 4, 15, 16, 17;
- Entscheide V-749 zu den Widersprüchen;
- Auftrag Prozedurale Welt (Hub b223, V-746).

## 1 · Was das Modul ist
| Teil | Datei | Aufgabe |
|---|---|---|
| Regelwerk | `CANON_3D/lib/kfb_place.r1.json` (`kfb.place/1`) | Die einzige Zahlenquelle: Einheiten (Meter), Einsinken je Objektart, Gruppen, Nester, Kontakt, gebaute Ordnung, Dichte-Bänder, Masken, Einbettung (aus N36), Abschlüsse (aus `kfb_edge`), Fluff (aus `grammar.js`), Rezepte, Biome, Kompatibilität, Kacheln mit Sockets |
| Löser | `kfb-place-core.v1.mjs` + CLI | Rein und deterministisch über den Seed, ohne three.js und ohne bpy: `placeChunk`, `solveLocal` (lokales WFC), `embedStamp` (nur auftragen) |
| Rezept | `kfb.place-recipe/1` | Die Ausgabe je Zelle: Instanzen, Gruppen, Rollen, Einsinken, Stamps, Höhen-Deltas, Regel-Bericht |
| Blender-Adapter | `kfb_place_bpy.py` | Rezept → Import → Knete → `kfb_env_bpy.place` → Proof-Stage |
| Laufzeit-Adapter | im Spiel, ersetzt `placeCell` in `endlessVeg.js` | Rezept → BatchedMesh in 64-m-Zellen, Wind je Gruppe, hinter `veg=core` |
| Gate | `kfb_env.gate` liest dieselbe JSON | prüft das Rezept: ENV-Gruppe, ENV-Kontakt, ENV-Einsinken, ENV-Ordnung, Ü1–Ü7, Ursache E7 |

## 2 · Wie eine Zelle entsteht (vier Ebenen)
1. **Zone (Makro):** 2–4 Gruppenkeime auf der Maske. Negativraum ≥ 30 %, der Fokusplatz bleibt frei, die Landmarke ist am höchsten.
2. **Gruppe (Meso):**
   - Ein Rezept wählen, zum Beispiel Baumgruppe: Anker + 3 Stützen + Akzent.
   - `solveLocal` belegt die Plätze mit Kacheln: ein Kit je Gruppe, Größen 1 : 0,62 : 0,38 (Toleranz 0,20), keine Klone, Wiederholung ≤ 3.
   - Danach Nest-Prüfung (≤ 0,85 × oder ≥ 1,25 ×), Lehnregeln, Einsinken nach Objektart und Hang.
3. **Mikro:**
   - Kontakt-Geometrie mit Ursache auf 40–50 % des Umfangs, Lücke ≥ 25 %, keine Kränze.
   - Kiesel und Fallobst hangabwärts, Fluff an den Ankern.
4. **Ränder:**
   - Am Biom-Rand werden Übergangs-Familien gewählt (Ausdünnen der Arten, Steinband). Der Boden selbst bleibt Sprenkel.
   - An Bauten kommt die Abschluss-Form aus `kfb_edge` (freies oder gebautes Ende).

**WFC darf:** Plätze in Gruppen belegen, Raster-Module mit Sockets legen (B29-Mauern, Hex-Straße, Küste und Fluss, Zäune, Hecken) und Übergangs-Familien wählen.

**WFC darf nie:**
- Landmarken, OSM-Gebäude, Straßennetz oder Geländehöhe anfassen;
- ein globales Natur-Raster legen;
- Kit-Teile verformen.

Landmarken und Dioramen sind feste Stamps, um sie herum läuft nur die Einbettung (V-716).

## 2b · Fluff und Fundstücke (Georg 25.10.)
**Fluff an Bäumen und Sträuchern** wird mit platziert, nach der abgenommenen Bauweise und der B2-R2-Grammatik:
- Am Baum sitzt der Fluff in der Krone an der Lichtseite: ein Hero-Nest plus 0–2 Neben-Nester. Am Strauch greifen 1–2 Nester unter den Rand.
- Kahle Bäume tragen keinen Fluff.
- Je Nest 5–7 Kugeln (1 groß, 3 mittel, 1–3 klein; B2-R2 Variante A als Startwert, Georg wählt am P0-Bild). Je Nest eine Farbe aus dem Candy-Band gegenüber dem Laub (V-305), nie Oliv auf Grün. Keine Zufallsfarbe je Kugel. Die Zonenmischung (V-368) kommt erst nach P0.
- **Ernte basic:** gestaffelt nach V-423 (im Schnitt 3 Schläge, 2 Schüsse oder 1 Explosion leeren einen Baum; Abwurf 1–2, dann 3–4, dann alle). Es springt 2–3-mal, rollt hangabwärts und wird bei Kontakt aufgesammelt und im Gesamt-Fluff gezählt.
- „Kein Fluff ohne Herkunft.“

**Fundstücke** (optional, höchstens eins je Zelle):
- Darstellung nach V-450/V-453: 15 cm über dem Boden, langsam drehend, sanft auf und ab, längliche Teile schräg 35°. Aufnehmen bei Kontakt. Nur Paket-Varianten (V-434), für P0 eine Axt oder eine Brotzeit.
- Platz nur mit Ursache aus der Ortsbiografie, also am Stumpf, unter dem Baum oder am Wegrand.

Beides steht im Regelwerk und im Rezept. Jede Instanz trägt ihre Rolle (`fluff_nest`, `find`), damit Blender und Spiel sie gleich zeigen.

## 2c · Farbharmonie für Gelände, Fluff und Fluids (Georg 25.10.)
- **Eine Farbregel für alles:** COLOR_HARMONY_R1 (V-305). Der Boden trägt den Grundton jedes Bioms, daraus folgen Strecke, Blickfang, Laub, Himmel, Fluff und Fluids. Das Regelwerk nennt die Regel einmal, Gelände-Shader, Fluff und Fluids lesen dieselben Rollen.
- **Fluids als Rezepte:** Der Gelände-Shader kennt schon Wasser, Kaugummi und Säure. Jedes Biom wählt seine Fluid-Art, die Farbe kommt aus der Harmonie:
  - Wasser: nasser Saum, Tiefenstufen;
  - Kaugummi-See im Candy-Band: rosa Schlieren, zähe Wellen, langsam platzende Blasen;
  - blubbernde Säure im Gegenton zum Boden: Ufer verätzt.
- Es gibt einen Fluid-Shader, die Art ist ein Parameter. Owner ist WS1c, das Licht kommt aus dem einen Rig.

## 2d · Einbettung als Pflicht-SOP (Georg 25.10., V-753)
Jedes Prop, Diorama, jede Landmarke und jede andere Terrain-Einbettung läuft durch dieselben Schritte, so wie wir sie in den Blender-Dioramen erarbeitet haben (N36, Steinkit, K8, B29):
1. Fußabdruck und Maske aus der Kachel.
2. Düne bzw. Schürze nur auftragen, Profil Anschluss → Düne → Auslauf, Lee-Seite länger. Flanke ≤ 22°.
3. Sockel zu 15–25 % vom Gelände bedeckt, keine Stufe über 2 cm an der Kontaktlinie.
4. Eingänge frei, Rampe ≤ 15°.
5. Steinbänder in drei Ringen aus dem Steinkit, gerundet und eingesunken.
6. Abschluss je Kante: freies Ende durch Verfall oder gebautes Ende. Harte Kanten (Dungeon-Generator, Kachelfelder, Mauern, Plinthen) werden organisch abgerundet, dazu kleine gerundete Rubble- bzw. Ruinensteine und Staub als sauberer Übergang, nur wo nötig (V-754).
7. Kontakt-Geometrie mit Ursache.
8. Bodenübergang als Sprenkel.
9. Gate auf dem Rezept.

Sand-Dünen als Geländeform in Wüsten-Biomen gehören dem einen Höhen-Owner (WS1b). kfb-place setzt Rezepte und Einbettung darauf.

## 2e · Lückenfelder (Georg 25.10., V-755)
- Die Lücken zwischen Straßen, Modellen und Gelände werden über Voronoi-Felder gefüllt. Straßenkanten, Fußabdrücke und Stamps sind die Keime, die Zellen sind die Lückenflächen.
- Jede Zelle bekommt ein Füll-Rezept nach Ursache: Schatten gibt Moos, Abfluss gibt Kies, Sonne gibt Blüten und Gras, der Hangfuß gibt Rubble.
- Das Zellmuster ist nie sichtbar: keine Linien an den Grenzen, die Grenzen sind Sprenkel. Voronoi ordnet nur, was wohin gehört.
- Stand: Konzept, im Löser ab v2.

## 3 · Erste Probe P0 (eine Zelle)
- **In einem Satz:** „Diese Lichtung zeigt einen alten Waldrand am Hang, weil der Wind das Laub hangabwärts treibt, und der Spieler sieht zuerst den Baumstumpf mit Fluff.“
- **Ort:** 64-m-Zelle im Biom `moos`, fester Seed. Ein Kit je Gruppe: Bäume und Büsche aus KayKit Forest, Stumpf und Holzstücke aus dem Kenney Nature Kit (KayKit Forest FREE hat keinen Stumpf); Steinnest und Wegspur aus Steinkit v4.
- **Gruppen:**
  - Baumgruppe (1 Baum, 3 Büsche, 1 Akzentstein);
  - Busch-Nest;
  - Steinkit-Nest am Hang.
- **Fester Stamp:** ein Baumstumpf als Mini-Landmarke; er darf nicht umgeordnet werden. Daran ein Fundstück.
- **Fluff:** Baumgruppe und Busch-Nest tragen farbige Fluff-Nester, ein Schlag löst Fallobst, das sich aufsammeln lässt.
- **Ortsbiografie (alle vier Schichten als Instanz):**
  - Entstehen: der alte Waldrand-Baum (Anker der Baumgruppe);
  - Nutzen: Abfuhrweg als Steinspur vom Rand zum Stumpf. Steine und Fragmente sind organisch verteilt nach V-578: heiler Kern, dann verwittert gerundete Stücke dicht → locker, einzelne fehlen, Erde in der Lücke, keine Reihe (Georg-TUNE q201). Übergang als Sprenkel;
  - Vergehen: der gefällte Stamm wird zum Stumpf. Er ist die Signatur, dazu zwei Echos (Holzstücke desselben Stamms). Am Stumpf mindestens zwei Gebrauchsspuren: Sägeschnitt, Axtkerbe, Moos auf der Schnittfläche;
  - Bewachsen: Moos und Büsche in den Fugen, Busch-Nest.
- **Bilder:** Blender-Proof und Spiel hinter `veg=core`, gleiche Kamera, A/B gegen die heutige Vegetation. Echtes Terrain, sobald der Höhenfeld-Export greift, sonst als Platzhalter markiert.
- **Zielbild-Paket vor dem Bau (V-740):** Claude Design liefert vier Style-Frames: Lichtung am Hang, Stumpf mit Fluff und Fundstück, Fallobst rollt hangabwärts, Steinnest. Material und Referenzen kommen über GitHub. Georg nimmt die Frames ab, bevor P0-Proof und `veg=core` gebaut werden. Löser, Regeldatei und Kachelmessung dürfen vorher laufen.
- **Gate:** Das Rezept läuft durch `kfb_env.gate`, dann urteilt der blinde Kritiker gegen die Style-Frames. Danach gehen die P0-Bilder an Georg; mit seiner Abnahme ist P0 die Vorlage.
- **P1:** dieselbe Zelle mit Biom-Rand `moos` → `wueste` und einem B29-Mauerstück mit freiem Ende.

### P0 · Konzeptfelder (Vorlage KONZEPTBLATT_R1)
| Feld | P0 |
|---|---|
| `focal` | Stumpf mit Fluff und Fundstück; gewinnt über Form (einziger Schnitt im Bild) und Akzentfarbe des Fluffs. Leserichtung: Steinspur → Stumpf → alter Baum |
| `space` | Vorne Wegspur und Kiesel, Mitte Stumpf und Busch-Nest, hinten Baumgruppe und Steinnest am Hang. Negativraum ist die freie Lichtung. Ruhe/Struktur/Bedeutung 70/20/10, stärkster Kontrast am Stumpf |
| `palette_roles` | Boden-Grundton Biom `moos` nach COLOR_HARMONY_R1; Laub natürlich; Stein und Rinde aus der Insel-Palette; Fluff und Fundstück im Candy-Band als Akzent |
| `color_script` | ruhige Mittagsstimmung, ein Licht-Rig; verboten: Neon-Flächen, zweite Lampe, Zufallsfarben |
| `form_dna` | runde Kronen, gerundete Steine, Kugel-Fluff; sekundär Schnittfläche und Wegspur; verboten: harte Kanten, Kachelmuster |
| `life_anchor` | Fluff wiegt im Wind je Gruppe; Fallobst hüpft und rollt nach einem Schlag; Fundstück dreht sich |
| `material_codes` | Moos in Fugen (Dreiergruppen), Steinkit-Kiesel hangabwärts, KayKit-Rinde mit Knete |
| `story_beat` | eingefrorener Moment kurz nach dem Holzfällen: Stamm weg, Fluff wächst nach |
| `cameras` | die vier festen Kritiker-Kameras plus Spielkamera |
| `reference` | die vier Style-Frames (nach Abnahme), dazu B2-Bäume und Steinkit v4 |

## 4 · Wer was macht
| Teil | Owner | Erste Lieferung |
|---|---|---|
| `kfb_place.r1.json`: Zahlen nach V-749, Rezepte und Story-Vorlagen für P0 | WS0 | R1 aus `kfb_env`, `n36_rules`, `kfb_edge_params`, `GRAMMAR`, Biom-Liste |
| Kacheln messen (Hülle, Höhe, Ruhelage, Einsinken, Anker, Sockets) und Asset-Pass je Teil | WSB | KayKit Forest 84, Steinkit 82, B29 28 |
| Löser + CLI + Golden-Test (gleicher Seed = gleicher Rezept-Hash) | WS1b | Natur ohne Sockets |
| Blender-Adapter + Gate-Erweiterung (ENV-Präfix mit Zuordnungstabelle alt → neu, gebaute Ordnung, Kontaktfenster; `kfb_env` liest RULES, NEST, SINK aus der Regeldatei) | WSB | P0-Proof |
| Laufzeit-Adapter `veg=core` (Standard bleibt bytegleich) | WS1b | P0 im Spiel |
| Höhen-Delta, Sprenkel, Laufzeit-Abschlüsse | WS1 Lead | nach P0 |

## 5 · Referenzbilder (Bild-Paket, Hub)
- Georg-getunte KayKit-Baumgruppen aus B2 (organische Grüppchen, nichts piekt durch);
- Steinkit v4 (Steine) und das freie Ende nach V-578 als Verteilung; Georg-TUNE q201: Steine und organischer verteilte Fragmente, kein Holz;
- B29-Mauer r4 (abgenommen q32).

Das Zielbild ist ein einziges handgemachtes Objekt (Kanon Gebiet 16), keine Streuung.
