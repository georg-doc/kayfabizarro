# Konzeptblatt · Resident Ork-Band · The KayfaBizarros · R1 · 2026-10-20 · WS0
**Vorlage:** `30_DECISIONS/CANON_3D/KONZEPTBLATT_R1.md` · **Kanon:** V-563/V-564/V-566 · **Szene:** `resident-band-module-01`

**Quelle 1:1:** Resident Atlas S17 `data/resident-band-module-01.json` + `lib/band-module.js` + `lib/band-workshop.js`, live unter `#__band`.
- Besetzung, Anker, Aktionen, Requisiten (Mikro, Gitarre, Kriegstrommel mit zwei Schlägeln, Trompete, Banner), Song und Uhr werden **nicht verändert**.
- Das Modul hat **keine Grundplatte** (`baseplate: false`) und ist so im RA abgenommen. Der Host stellt die Fläche, das Modul setzt nur seinen Stützpunkt darauf.
- **Ort aus der Quelle:** die reservierte Band-Zone rechts am Disco-Platz (`resident-disco-01.json` → `reserved.band`, x 9,8–15,6 · z −5,4–2,7). Die Disco nimmt ihren Song aus dem Band-Modul (`songFrom`).
- Neu ist nur die **Einpassung ins Terrain** (Kanon Gebiet 15).

**Gegenbeispiel:**
- das ORB-P1-`Ground`-Mesh (die Quelle referenziert es absichtlich nicht);
- die Prüf-Hosts des RA als Bühne: Boden 80 × 80 (#2e281d), Podest 0,60, Theke 1,05;
- Dioramen auf Scheiben mit eigenen Farben und eigenem Licht (FAIL 19./20.10., V-561).

---

## Ein Satz (`one_sentence`)
**Diese Szene zeigt die Hausband The KayfaBizarros live am rechten Rand des O-Town-Platzes, weil sie jeden Abend den Song spielt, zu dem der Platz tanzt, und der Spieler soll zuerst den Leader am Mikro sehen, zu dem das Banner hinführt.**

## Geschichte (`story`)
Am rechten Rand des O-Town-Platzes spielt jeden Abend die Hausband, The KayfaBizarros:
- der Legacy-Ork B singt und hüpft vorn am Mikro;
- der Orc Raider spielt Gitarre;
- der Orc Brute haut hinten auf die Kriegstrommel;
- der Legacy-Ork A bläst Trompete dagegen.

Ihr Banner steckt hinter ihnen im Boden. Es läuft Rubbish Groove, derselbe Song, zu dem der Platz tanzt. **Man soll fühlen:** Die Musik kommt von hier, live und laut.

## Bildidee (`image_idea`)
**Die Band steht auf einem hellen, abgetretenen Fleck am Rand des Petrol-Platzes, wo das Gelände ansteigt. Das Banner ragt hinten links aus dem Boden, der Leader hüpft vorn am Mikro, der Brute trommelt dahinter.**

## Fokus und Leserichtung (`focal`)
1. **Banner:** Landmarke und höchstes Element (Oberkante 4,82 über Grund, Fuß 0,21 im Boden, Quelle), hinten links. Vom Platz aus zuerst lesbar.
2. **Leader (Legacy Orc B):** Fokus. Vorn, mit Mikro, 8-Schlag-Bounce.
3. **Brute mit Kriegstrommel:** hinten Mitte, die große dunkle Masse, der Takt.
4. **Gitarrist:** links vorn (−2,7 / 1,2).
5. **Trompeter:** rechts hinten (3,3 / −1,6, Drehung −24°), optional.

**Landmarken-Regel:** Landmarke (Banner) und Fokus (Leader) sind getrennt und liegen auf einer Diagonale von hinten links nach vorn Mitte. Der Blick läuft am Banner herab zum Leader. Ist das Banner abgeschaltet (Quelle: optional), ist der Brute mit der Trommel die Landmarke (Bindepose 4,19).

## Raumkonzept (`space`)
Bandrahmen der Quelle, Front = +z. Die Drehung in der Welt ist offen (siehe Offene Punkte).
- **Vordergrund (Front):**
  - offen zum Platz, Negativraum ≥ 30 %;
  - der helle Fleck läuft als Sprenkel in den Petrol-Boden der Tanzfläche aus;
  - keine Bühnenkante, kein Rand.
- **Mittelgrund:** Leader vorn Mitte (Ort aus dem Bounce-Clip), Gitarrist links, Brute hinter der Trommel, Trompeter rechts hinten.
- **Hintergrund:**
  - Banner hinten links am Hangfuß;
  - dahinter steigt das Gelände an, dasselbe Ansteigen, das im Disco-Blatt den Platz hinten schließt;
  - keine Mauer.
- **Grundfläche:**
  - Der Footprint der Quelle (x −3,85…3,92, z −5,0…3,51) ist eine natürliche ebene Terrasse im Terrain.
  - Die Kontaktebene y = 0 hält die Quell-Toleranz 0,03 unter Füßen, Trommel und Leader-Weg.
  - Außerhalb beginnt der Hang. Kein Podest, keine sichtbare Stufe.
- **Hell-Dunkel:**
  - hell: abgetretener Fleck, am hellsten in der Leader-Zone;
  - mittel: Petrol-Boden;
  - dunkel: der Hang hinten und die Masse Brute mit Trommel;
  - das Banner-Tuch sitzt als Akzent darüber.
- **70/20/10 (V-566, ersetzt 70/30):**
  - Ruhe (70 %): Petrol-Boden ringsum und der Hang, großflächig und kontrastarm;
  - Struktur (20 %): Spielfleck mit Sprenkelband, Trommel und Instrumente, Steinbänder am Hangfuß, Gras-Gruppen;
  - Bedeutung (10 %): Leader (Fokus), Gitarrist, Brute, Trompeter und das Banner-Tuch. Hier liegt der stärkste Kontrast.
- **Wertstruktur und drei Tiefenebenen:** siehe „Bildanatomie (V-566)“.

## Palettenrollen (`palette_roles`)
**Welt:** O-Town aus dem Farbdrehbuch V-406 (Joyride C), Stimmung V-564.
**Warum:** Die Band hat ihre Zone am Disco-Platz und spielt dessen Song. Beides ist ein Ort, also gilt eine Palette (Kanon 15 (2)).

| Rolle | Ton | Wo |
|---|---|---|
| ground | `#3aa596` Petrol | Terrain ringsum, ~60 % |
| path | `#f3e6c8` | abgetretener Fleck unter der Band, läuft als Sprenkel aus |
| hill | `#229484` (Harmonie-Zeile `hill1`) | ansteigender Hang hinten, dunkle Rückwand |
| stone | `#e0679f` | Steinbänder und Bröckel am Hangfuß |
| tiers | `#2f8f83` | Gras-Büschel am Hang |
| frame | `#e9b53b` | Kriegstrommel, Gitarre, Trompete (leicht getönt, V-286) |
| structures | `#c9508f` | Kleinteile: Banner-Stab, Schlägel, Mikro |
| accent | `#f08a2c` | Banner-Tuch (Hero), ≤ 10 % |
| sky | `#a8d8b9` | Himmel |

- Figuren behalten ihre eigenen Farben und werden nie umgetönt.
- Am Platz liegt das zweite Orange (Radio, Disco-Blatt) links, das Banner rechts. Beide rahmen den Platz.

## Licht
- **Ein Rig:** `kfb-stage-light.v1.1`, Stimmung **MESA gold**, dieselbe wie am Disco-Platz (ein Rig der Welt, derselbe Abend).
- **Keine Praktikals:** Die Quelle hat keine (`band-module.js` und `band-workshop.js` setzen kein Licht). Kein Bühnenlicht, keine Spots.
- **Schatten:** echte Schatten aus der Sonne, nach Empfänger-Palette getönt (V-564). Keine Blob-Schatten.

## Bildanatomie (V-566)
Nach Kanon Gebiet 16. Die Quelle bleibt 1:1; alles hier wirkt nur über Terrain, Knet-Oberfläche, Rollenfarbe und das eine Licht.

**Farb-Skript (`color_script`)**

| Feld | Festlegung |
|---|---|
| Stimmung | derselbe laue Partyabend wie am Disco-Platz: live und laut, die Musik kommt von hier |
| Terrain | Petrol #3aa596 ringsum (~60 %), Hang #229484 als dunkle Rückwand, Gras #2f8f83 am Hang; ruhig |
| Sekundär | Pfad-Ton #f3e6c8 im Spielfleck, Trommel und Instrumente #e9b53b (leicht getönt), Kleinteile #c9508f, Steine #e0679f am Hangfuß |
| Akzent (nur mit Bedeutung) | Orange #f08a2c nur am Banner-Tuch: Landmarke und Revier der Band, die Diagonale führt am Stab herab zum Leader (Erzählkern), ≤ 10 %. Der Leader selbst gewinnt über Figurenfarben auf dem hellsten Boden. |
| Verboten | Orange oder Gold an Gras, Steinen oder Hang; Bühnen- oder Spotlicht-Farben; Figuren umtönen |
| Licht | ein Rig kfb-stage-light.v1.1, MESA gold wie am Disco-Platz; keine Praktikals (Quelle); echte Schatten nach Empfänger getönt |

**Form-DNA (`form_dna`)**

| Feld | Festlegung |
|---|---|
| Grundformen (3) | ebene runde Terrasse vor einem sanften Hangrücken · abgeflachte Kugeln (Gras-Polster am Hang, Bröckel am Hangfuß) · weiche Keile (Erdkeil am Bannerfuß, Erdkragen an der Trommel, Hangschürze) |
| Sekundärformen (2) | gerundete Trommel- und Instrumentenkörper nach Eingangsprüfung · schlanker gerundeter Stab mit weich fallendem Tuch (Banner) |
| Verbotene Formfamilie | scharfe Prismen: Podest, Theke, Bühnenkante, sichtbare Terrassenstufe |
| Kantenrundung | weich wie das Terrain; Terrassenrand ohne Kante, Kit-Kanten über kfb_clay_bpy.apply gerundet |
| Unregelmäßigkeit | kontrolliert: Spielfleck vorn glatt, hinten und seitlich loser; Bröckel rechts hinter dem Trompeter mehr; Gruppen 3/5 |

**Lebensanker (`life_anchor`)**
- Gras-Büschel am Hang wiegen in Wind-Gruppen und im Bass der Band (Kit §6/§7)
- Leader-Bounce, Trommelschlägel, Gitarre und Trompete bewegen sich mit der Quell-Aktion auf der Song-Uhr (Rubbish Groove, 100 BPM)
- **Glaubwürdig macht es:** Figuren und Gras folgen derselben Uhr wie die Tanzfläche nebenan.

**Wertstruktur (`space`)**

| Zone | Wo |
|---|---|
| hell | abgetretener Spielfleck, am hellsten in der Leader-Zone |
| mittel | Petrol-Boden |
| dunkel | der Hang hinten und die Masse Brute mit Trommel |
| **stärkster Kontrast** | Leader auf dem hellsten Fleck vor der dunklen Masse aus Brute und Trommel, also auf dem Fokus; das Banner-Tuch sitzt als Akzent darüber |
| ruhig | Petrol-Boden ringsum und der Hang |

**Drei Tiefenebenen (`space`)**

| Ebene | Aufgabe | Inhalt |
|---|---|---|
| Vordergrund | rahmt | offen zum Platz: dunklerer Petrol-Boden der Tanzfläche, der Spielfleck läuft als Sprenkel hinein; keine Objekte, keine Kante |
| Mittelgrund | trägt die Handlung | Leader, Gitarrist, Brute mit Trommel, Trompeter: höchste Klarheit, stärkster Kontrast |
| Hintergrund | vereinfacht | Banner am Hangfuß als einzige klare Form, dahinter der Hang #229484 mit Gras, vereinfacht |
- **Das Terrain ist nie die lauteste Fläche:** Hang und Petrol bleiben unter dem Wert des Spielflecks.

**70/20/10 (`space`, ersetzt 70/30)**

| Anteil | Inhalt |
|---|---|
| 70 % Ruhe | Petrol-Boden ringsum und der Hang |
| 20 % Struktur | Spielfleck mit Sprenkelband, Trommel und Instrumente, Steinbänder am Hangfuß, Gras-Gruppen |
| 10 % Bedeutung | Leader (Fokus), Gitarrist, Brute, Trompeter und das Banner-Tuch; hier liegt der stärkste Kontrast |

**Gebrauchsspuren (Kanon Gebiet 3, V-566)**: RA-Quelle, daher nur über Knet-Oberfläche und Terrain; die Silhouette bleibt 1:1.

| Objekt | Spur | Ursache |
|---|---|---|
| Banner (Hero, Landmarke) | Tuch unten mit Erdspritzern | Fleck: steckt im Boden am Hangfuß, Füße wirbeln Erde auf |
| Banner (Hero, Landmarke) | Tuch-Orange oben leicht ausgeblichen | Farbverlust: steht jeden Abend draußen |
| Banner (Hero, Landmarke) | Erdkeil und Erdspuren am Stabfuß | eingerammt, 0,21 im Boden (Quelle) |
| Kriegstrommel (Echo) | Fell in der Mitte heller abgegriffen | Abnutzung durch die Schlägel, R auf 1, L auf 2 |
| Kriegstrommel (Echo) | Erdkragen am Fuß | Gewicht und Schläge drücken sie in den Boden (Trommel bleibt auf Quellhöhe) |

## Materialcodes (`material_codes`, höchstens 3)
1. **Petrol-Knete-Boden mit Hang:** Gras-Büschel in Dreier- und Fünfergruppen am Hang, dichter nach oben, frei im Footprint. Sie wiegen in Wind-Gruppen (Environment-Kit §6) und im Bass der Band mit (§7 Musik-Visualizer).
2. **Abgetretener Spielfleck:** Knete im Pfad-Ton, kein Pflaster, keine Platte. Vorn beim Leader am glattesten und hellsten, nach hinten und zu den Seiten loser, dann Sprenkel in den Petrol-Boden. Bewegt sich nicht.
3. **Ork-Gerät:** Kriegstrommel, Banner und Instrumente, Kit-Formen. Vor dem Bau durch die Eingangsprüfung (`kfb_clay_bpy.apply`), danach Knete und Rollenton. Bewegt sich nur mit der Quell-Aktion (Schlägel, Gitarre, Trompete an der Figur).

## Ortsbiografie (`biography`)
Nur Terrain-Arbeit, keine neuen Requisiten.

| Schicht | Ein Satz | Umsetzung |
|---|---|---|
| 1 Entstehen | Rechts am Platz eine natürliche ebene Terrasse vor dem Hang, groß genug für die Band | Terrain-Form, keine Stufe, kein Sockel |
| 2 Nutzen | Hier wird jeden Abend gespielt: Der Boden ist hell abgetreten, am hellsten vorn beim Leader. Die Trommel hat sich einen Erdkragen gedrückt, das Banner ist eingerammt | Pfad-Ton-Kern → Sprenkelband 2–5 m (V-403) → Petrol. Erdkragen am Trommelfuß, **die Trommel bleibt auf Quellhöhe** (Kontaktmessung). Erdkeil am Bannerfuß (0,21 im Boden = Quelle). **Gebrauchsspuren (V-566, nur Knet-Oberfläche/Terrain):** Banner (Hero, Landmarke): Tuch unten mit Erdspritzern (Fleck: steckt im Boden am Hangfuß, Füße wirbeln Erde auf); Banner (Hero, Landmarke): Tuch-Orange oben leicht ausgeblichen (Farbverlust: steht jeden Abend draußen); Banner (Hero, Landmarke): Erdkeil und Erdspuren am Stabfuß (eingerammt, 0,21 im Boden (Quelle)); Kriegstrommel (Echo): Fell in der Mitte heller abgegriffen (Abnutzung durch die Schlägel, R auf 1, L auf 2); Kriegstrommel (Echo): Erdkragen am Fuß (Gewicht und Schläge drücken sie in den Boden (Trommel bleibt auf Quellhöhe)) |
| 3 Vergehen | Am Hangfuß bröckelt der Rand in magentafarbene Steinchen, rechts hinter dem Trompeter mehr | Steinbänder nach Grammatik §4 (Band 0–2), `nest_ok`, ungerade Gruppen |
| 4 Bewachsen | Moos in den Steinfugen am Hangfuß, Gras-Büschel am Hang hinter Banner und Trommel. Im Footprint wächst nichts | Fugen-Sprenkel, Gras 0–2 m vom Hangfuß, Gruppen 3/5 |

**Kontakt-Geometrie (V-565):** Jede Fuge wird gebrochen (`kfb_env.contact`):
- am Bannerfuß der Erdkeil plus ein Steinchen-Dreier bergab;
- am Trommelfuß der Erdkragen plus Bröckel, die Trommel bleibt auf Quellhöhe;
- Figuren stehen direkt auf dem Spielfleck.

**Signatur:** Hero = Banner (`Orc_Banner_Large`); Echo = Kriegstrommel (`Orc_Wardrum`, dieselbe Fraktion). Nichts weiter.

## Gruppen (`groups`)
- **g1 Banner hinten links:** Banner (Anker) + Erdkeil + Steinnest (3). Ortsgrund: Hangfuß; das Banner markiert das Revier der Band und ist vom Platz aus sichtbar.
- **g2 Trommel hinten Mitte:** Kriegstrommel (Anker) + Erdkragen + Gras-Dreier am Hang dahinter. Ortsgrund: ebener, fester Grund vor dem Hang; der Brute steht dahinter (Quelle: Trommler z −1,3, Trommel vor ihm).
- **g3 Hangfuß rechts:** Steinnest (5) + Gras-Dreier hinter dem Trompeter. Ortsgrund: Hangseite, wo der Rand zerfällt.
- Steine aus der Schürze zählen in die Gruppen; jede Gruppe ungerade (Gate G1).

## Story-Beat (`story_beat`)
Eine Uhr ist der Song: **Rubbish Groove 2min A extend 01**, 100 BPM, Phase 0,465 s, 4/4. Der Host gibt `beatPos`, das Modul hat keine eigene Uhr.
- Leader: Bounce, 8 Schläge.
- Trommler: v5c, 2 Schläge, R auf 1, L auf 2.
- Gitarrist: Guitar A, 8 Schläge (4,8 s).
- Trompeter: Kontrapunkt zum Leader, 8 Schläge (Georg 2026-09-24: „vom Song gesteuert, synergistisch zu Beats, Moves und Lautstärke des Leaders“).
- Die Quelle hat keinen eigenen Phrasenplan. Die Disco-Phrase (16 Takte) läuft auf derselben Uhr.
- **Standbild für den Kritiker:** Trommler-Schlagbild R (Bild 0). Dort misst die Quelle den Kontakt.

## Besetzung (`cast`)
Quelle, Anker unverändert:

| Slot | Figur | cast-ID | Aktion · Requisite | Status cast.r1 |
|---|---|---|---|---|
| leader | Legacy Orc B | `orc_legacy_b` | `orb.bounce` · Mikro an `character_orcBArmRight` | pending |
| guitarist | Orc Raider | `orc_raider` | `ml.guitar.a.fit` · `guitar_B` | ready |
| drummer | Orc Brute | `orc_brute` | `orb.drum.v5c` · Wardrum ×2 + 2 Schlägel ×2 | ready |
| trumpeter | Legacy Orc A | `orc_legacy_a` | `kfb.trumpet-groove.v1` · Trompete ×0,72 · optional | pending |

- Jede Figur hat KFB-Augen und E2-Lider, an jeder Variante.
- Figuren werden nie skaliert.

## Kameras (`cameras`)
1. 45° schräg von oben, von vorn links über die Band.
2. Augenhöhe (1 H Leader) vom Platz auf den Leader, das Banner im Hintergrund.
3. Fuß nah: Trommelfuß und Füße des Brute beim Schlagbild R (Erdkragen, Sprenkel, Kontakt).
4. Seite links: Silhouette des Banners im Boden, Gitarrist, Hang.
5. Gesicht nah: Leader und Trompeter (`near_face`).
6. Spielkamera (Bühnen-Orbit V-257).

## Referenz (`reference`)
- RA S17 `#__band`: Grundriss, Anker und Aktionen 1:1.
- Disco-Konzeptblatt `65_SCENELETS/disco/`: Platz, Band-Zone, Licht.
- Joyride C O-Town: Farbwelt.
- Terrain-Design 19.10. (#439): Farbflächen, getönte Schatten.

## Verbote für diese Szene
- Podest, Theke, Bühne, Platte, Scheibe oder eigener Boden, auch nicht die RA-Prüf-Hosts.
- Das ORB-`Ground`-Mesh.
- Bühnenlicht, Spots, eigene Lampen.
- Figuren skalieren, Anker verschieben, die Trommel absenken.
- Neue Requisiten (Boxen, Verstärker, Kabel, Notenständer).
- Den Bannerfuß „reparieren“: 0,21 im Boden ist hier die Erdung.
- Die Terrasse als sichtbare Kante oder Stufe.

## Offene Punkte
1. **Footprint passt nicht in die Zone.** Band 7,77 × 8,51 (Quelle, mit Leader-Weg und Banner) gegen Zone 5,8 × 8,1 (Disco-Quelle). Das passt in keiner Drehung. Georg entscheidet: Zone vergrößern oder Banner bzw. Trompeter abschalten (beide sind in der Quelle optional).
2. **Drehung in der Welt fehlt in der Quelle** (lokal Front +z): Front zum Spieler oder zur Tanzfläche?
3. **Trommler-Füße** liegen −0,105…−0,082 unter der Kontaktebene (Quellbefund, Georgs Patch steht aus). Das liegt im Figuren-Einsinken des Gates (≤ 3 %), wird aber nicht vom Terrain kaschiert.
4. **Trommel-Aktion v5c** ist „Arbeitshypothese, hölzern“ (Georg). Feinschliff offen.
5. **Trompeter:** `kfb.trumpet-groove.v1` braucht laut Quelle Georgs Blick. Der Legacy-Arm ist 0,30 zu kurz; WSB r1b löst das mit dem Gummiarm (V-555), die RA-Quelle noch mit Anker `paw`.
6. **WSB-Scenelet `orc_band_01` weicht von der RA-Quelle ab:** Gitarrist `strum` statt `ml.guitar.a.fit`, Mikro an `hand.l` statt `character_orcBArmRight`, Licht MESA day statt gold. Die RA-Quelle gilt; WS0 und WSB gleichen ab.
7. **cast.r1** führt `orc_legacy_a/b` als pending, `ORKBAND/RETURN.md` meldet alle vier abnahmefähig. Die Bestätigung durch WS0 (B50) steht aus.
8. **Banner optional:** Ist es aus, werden Hero und Landmarke die Kriegstrommel.

## Ablauf
- **WS1 (Paket E):** Einpassung im Spielterrain an der Band-Zone des Disco-Platzes, nach Klärung der Offenen Punkte 1 und 2.
- **WSB (ORKBAND r1b):** Knete und Rollen-Tönung für Trommel, Banner und Instrumente.
- **Prüfung:** Gate mit `concept.json` daneben, dann der blinde Kritiker mit den Kameras 1–6.
- Georg sieht nur das Bestandene.


## WS0-Entscheide (20.10., Art Direction)
Diese Entscheide schließen die offenen Punkte oben; was dort noch offen steht, ist hiermit beantwortet.
- Platz: Die Band bekommt eine eigene Terrasse direkt rechts am Disco-Platz. Die reservierte Zone der Disco wird auf die Band-Grundfläche (7,77 × 8,51) erweitert; die Positionen im Band-Modul bleiben 1:1.
- Blickrichtung: Die Band spielt zur Platzmitte (Disco), das Publikum ist der Platz.
- Füße des Drummers 8–10 cm unter der Kontaktebene sind ein Messfehler, kein Design: Sie werden auf das Terrain gesetzt (Proof Stage G3).
- Das Banner bleibt an (Quell-Standard) und ist die Landmarke.
- Das Scenelet `orc_band_01` (WSB) wird auf den RA-Stand zurückgeführt: Guitar A, Mikro wie RA, Licht MESA gold. Das RA zählt.
- Drum-Aktion v5c und Trompeter-Groove bleiben als bestehende Hub-Fragen offen; sie berühren das Konzept nicht.
- Datenfehler `cast.r1` (Legacy-Orks pending ↔ RETURN ready) korrigiert WS0 in den Daten.
