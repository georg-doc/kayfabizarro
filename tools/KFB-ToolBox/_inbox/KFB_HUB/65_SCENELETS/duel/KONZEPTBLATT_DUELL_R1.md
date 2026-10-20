# Konzeptblatt · Gunfight Duell 01 · Fernkampf · R1 · 2026-10-20 · WS0
**Vorlage:** `30_DECISIONS/CANON_3D/KONZEPTBLATT_R1.md` · **Kanon:** V-563/V-564/V-565/V-566 · **Szene:** `resident-gunfight-duel-01`

**Quelle 1:1:** Resident Atlas S17 `data/gunfight-duel-01.json` + `lib/gunfight-duel-01.js`, live unter `#__duel`.
- **Bleibt unverändert:**
  - Duellanten (5 Figuren-Fassungen) und Waffen (Blaster, Gewehr, Minigun, Würfel);
  - Arena-Kanon-Werte (Tempo, Takt, Rückstoß, Munitionsmaße, Energie, Oberflächen, Schutzzone 0,18 H);
  - Zeiten (Standoff 0,9 s, Pause 0,35 s) und die vier Skripte;
  - Standard A = Hero rot mit Blaster, B = Hero blau mit Blaster, Skript `duel5`;
  - Aufstellung: A und B auf einer Achse, Abstand **D = 3,6 × Figurhöhe H**.
- **Neu** ist nur die **Einpassung ins Terrain** (Kanon Gebiet 15). Das „Testgelände“ der Quelle bekommt seinen Ort in der Welt allein über das Terrain.
- **Verbindlich von Georg:**
  - 04.10.: Grundlage für den Combat Slice, Blasterhaltung falsch, Stage-Instanz je Szene;
  - V-536: Waffen auf der Unterarmachse;
  - V-562 / q132: Karabiner einhändig; Soldat ohne Augen FAIL.
- **Figuren und Aktion** sind abgenommen (B50 Gunfight r1 PASS). Dieses Blatt betrifft nur die Umgebung.

**Gegenbeispiel (FAIL):**
- Platzhalter-Ellipse (Scheibe #d6ccb8) mit Bahn-Streifen und runden Startmarken rot/blau;
- B50-Platzhalterboden `KFB_Duel_Ground.glb`;
- Dioramen auf Scheiben (V-561).

---

## Ein Satz (`one_sentence`)
**Diese Szene zeigt ein Probeduell zweier Helden in einer Sandsenke hinter den Dünen der Bikini-Bucht, weil sie sich hier immer auf denselben zwei Standplätzen treffen, und der Spieler soll zuerst die leere Schusslinie zwischen den Duellanten sehen.**

## Geschichte (`story`)
Hinter den Dünen der Bikini-Bucht liegt eine flache Sandsenke. Hier treffen sich die Helden zum Probeduell, immer auf denselben zwei Standplätzen. Darum ist die Bahn zwischen ihnen ausgetreten und die Standplätze sind tief festgetreten. Erst wird lange gestarrt, dann fliegen Strahlen, und einer weicht aus, einer wird getroffen, einer fällt. **Man soll fühlen:** die Stille vor dem Schuss, Cartoon-Western, niemand stirbt wirklich.

## Bildidee (`image_idea`)
**Zwei Duellanten an den Enden einer hellen, ausgetretenen Bahn in einer Sandsenke. Niedrige Dünen rahmen sie wie Ränge, dazwischen liegt nur leerer Boden. Die Leere ist das Bild, bis der erste Strahl sie kreuzt.**

## Fokus und Leserichtung (`focal`)
**Landmarken-Regel:**
- Die Quelle hat keine Bau-Requisite. Landmarke ist das Duellpaar; beide sind gleich hoch (Rig_Medium).
- In der Senke steht nichts Höheres.
- Das Gelände steigt erst außerhalb der Quell-Fläche an (siehe Raum).

Leserichtung:
1. **Die Schusslinie**, die leere Bahn zwischen den Mündungen. Dort laufen Strahl, Puff und Ausweichen.
2. **Duellant A** links (rot, in `duel5` der Sieger).
3. **Duellant B** rechts (blau).
4. **Standplätze** (festgetretene Mulden, Farbsprenkel).
5. **Dünen-Rahmen** hinten, höher auf der B-Seite.

## Raumkonzept (`space`)
- **Vordergrund (Spielkamera-Seite, quer zur Bahn wie Quelle `view`):**
  - offener Sand;
  - dunklere Tonfläche (#439).
- **Mittelgrund:**
  - die Bahn entlang x, A bei −D/2, B bei +D/2 (Quelle);
  - die ebene Fläche hat genau die Ausdehnung der Quell-Ellipse: Radius D/2 + 1,1 H, Tiefe × 0,62;
  - so wird der Platzhalter zur flachen Sohle der Senke, ohne Scheibe.
- **Hintergrund:** Außerhalb der Ellipse steigen niedrige Dünen an, hinten rechts (B-Seite) höher, vorn links (A-Seite) flach. Das ist asymmetrisch, damit kein Spiegelbild entsteht (Friedhof-TUNE „zu symmetrisch“).
- **Negativraum:** die Bahn zwischen den Duellanten, mindestens 2,6 H leer. Sie ist der Spannungsträger.
- **Hell-Dunkel:**
  - hell: Bahn (Pfad-Ton) und die Strahlen;
  - mittel: Sand;
  - dunkel: die Schattenseiten der Dünen im Goldlicht, die Vordergrund-Tonfläche, violette Steine.
- **70/20/10 (V-566, ersetzt 70/30):**
  - Ruhe (70 %): Sandsohle, Dünenflächen und Vordergrund, großflächig und kontrastarm;
  - Struktur (20 %): Bahn mit Sprenkelband, Standplatz-Mulden, Steinnester, Dünengras;
  - Bedeutung (10 %): die Duellanten mit ihren Blastern, die Schusslinie mit Strahl und Puff. Hier liegt der stärkste Kontrast.
- **Wertstruktur und drei Tiefenebenen:** siehe „Bildanatomie (V-566)“.

## Palettenrollen (`palette_roles`)
**Welt: Bikini-Bucht** aus dem Farbdrehbuch V-406 (Joyride B). **Warum:** Das Testgelände ist eine offene Sandebene (Konverter-Tag desert/western). Die Bucht liefert den Sandboden und die Aqua-Dünen. Die Quell-Strahlen (Cyan #9fe6ff, Gelb #ffe89a) stehen auf Sand klar.

| Rolle | Ton | Wo |
|---|---|---|
| ground | `#f0cf7e` Sand | Sohle und Dünen, ~60 % |
| path | `#fff1d2` | ausgetretene Bahn (statt Quelle #bfb193), läuft als Sprenkel in den Sand aus |
| tiers | `#5cc3bf` | organische Aqua-Farbflächen im Sand (#439, unabhängig von der Höhe); Dünengras-Büschel |
| stone | `#9a6fd0` | Steinnester am Dünenfuß |
| frame | `#f2708a` | Standplatz A als Farbsprenkel (statt Scheibe rot #b8361f) |
| tiers2 | `#46adb2` | Standplatz B als Farbsprenkel (statt Scheibe blau #3f6f9c) |
| sky | `#8fd6ec` | Himmel |

- Figuren und Waffen behalten ihre eigenen Farben und werden nie umgetönt. Hero rot/blau, Mech weiß/oliv und Soldat bleiben, wie sie sind.
- Die Effekte behalten die Quell-Farben aus dem Arena-Kanon (Strahl #9fe6ff, Schiene #8fe6ff, Stinger #ffe89a, Würfel #f3ead3, Treffer-Tönung je Oberfläche).
- Der Knet-Puff wird ohne Emissive gebaut (Kanon §11).

## Licht
- **Ein Rig:** `kfb-stage-light.v1.1`, Stimmung **MESA gold**: Showdown am späten Nachmittag, tiefe warme Sonne quer zur Bahn, kühlere Füllung. Die langen Schatten der Duellanten und der Dünenkämme schneiden die Bahn als Streifen.
- **Figurenlicht nach Regel 11 (V-386):** warm und schattenlos, je Duellant, damit Visier bzw. Gesicht lesbar bleibt.
- **Keine Praktikals:** Die Quelle hat keine Lampe. Mündungsfeuer und Strahl sind Effekte, keine Lichtquellen.
- **Schatten:** echte Schatten aus der Sonne, nach Empfänger-Palette getönt (V-564). Keine Blob-Schatten.

## Bildanatomie (V-566)
Nach Kanon Gebiet 16. Die Quelle bleibt 1:1; alles hier wirkt nur über Terrain, Knet-Oberfläche, Rollenfarbe und das eine Licht.

**Farb-Skript (`color_script`)**

| Feld | Festlegung |
|---|---|
| Stimmung | Showdown am späten Nachmittag, die Stille vor dem Schuss, Cartoon-Western |
| Terrain | Sand #f0cf7e (~60 %), organische Aqua-Farbflächen #5cc3bf, vorn die dunklere Tonfläche (#439); ruhig |
| Sekundär | ausgetretene Bahn #fff1d2, violette Steinnester #9a6fd0, Dünengras |
| Akzent (nur mit Bedeutung) | (1) Standplatz-Sprenkel A #f2708a und B #46adb2: Interaktion (Startpunkte). (2) Strahlen #9fe6ff / #ffe89a nur auf der Schusslinie: Gefahr. (3) Hero rot und blau: Figur. Nie an Dünen oder Steinen. |
| Verboten | Startscheiben, Bahn-Streifen, Platzhalter-Ellipse #d6ccb8; Akzentfarben in Dünen oder Steinen; Emission an den Strahlen; Figuren umtönen |
| Licht | ein Rig kfb-stage-light.v1.1, MESA gold (tiefe warme Sonne quer zur Bahn, lange Schatten als Streifen), Figurenlicht nach Regel 11; keine Praktikals |

**Form-DNA (`form_dna`)**

| Feld | Festlegung |
|---|---|
| Grundformen (3) | runde, niedrige Dünenhügel · flache ovale Senke (Sohle = Quell-Ellipse) · abgeflachte Kugeln (runde Findlinge, Gras-Polster) |
| Sekundärformen (2) | weiche Sandkeile an den Steinnestern · flache Trittmulden an den Bahnenden |
| Verbotene Formfamilie | exakte Zylinder und Scheiben: Startmarken, Platzhalter-Ellipse, Deckung, Fässer |
| Kantenrundung | Bahnkanten als Sprenkel, keine Linie; Dünenkämme weich; Steine rund |
| Unregelmäßigkeit | kontrolliert: B-Seite höher und mit mehr Steinen, A-Seite flach; kein Spiegelbild; Gruppen 3/5 |

**Lebensanker (`life_anchor`)**
- Dünengras-Büschel wiegen in Wind-Gruppen mit starker Biegung im Abendwind (Kit §6/§8)
- Dodge und Treffer-Puff wirbeln Pfad-Ton auf (Quelle)
- der Strahl kreuzt die leere Bahn (Quelle)
- **Glaubwürdig macht es:** Nur das Gras bewegt sich im Standoff; das macht die Stille vor dem ersten Schuss hörbar.

**Wertstruktur (`space`)**

| Zone | Wo |
|---|---|
| hell | Bahn (Pfad-Ton) und die Strahlen |
| mittel | Sand |
| dunkel | Schattenseiten der Dünen im Goldlicht, Vordergrund-Tonfläche, violette Steine |
| **stärkster Kontrast** | die helle, leere Bahn zwischen den Duellanten, geschnitten von den Schattenstreifen; dort kreuzt der Strahl, also auf dem Fokus |
| ruhig | Sandsohle, Dünenflächen, Vordergrund |

**Drei Tiefenebenen (`space`)**

| Ebene | Aufgabe | Inhalt |
|---|---|---|
| Vordergrund | rahmt | offener Sand quer zur Bahn, dunkle Tonfläche |
| Mittelgrund | trägt die Handlung | Bahn mit A, B und den Standplätzen: höchste Klarheit, stärkster Kontrast |
| Hintergrund | vereinfacht | Dünen außerhalb der Ellipse (B-Seite höher), Gras auf den Kämmen unter Kopfhöhe |
- **Das Terrain ist nie die lauteste Fläche:** Sand und Aqua-Flächen bleiben unter dem Wert der Bahn.

**70/20/10 (`space`, ersetzt 70/30)**

| Anteil | Inhalt |
|---|---|
| 70 % Ruhe | Sandsohle, Dünenflächen und Vordergrund |
| 20 % Struktur | Bahn mit Sprenkelband, Standplatz-Mulden, Steinnester, Dünengras |
| 10 % Bedeutung | die Duellanten mit ihren Blastern, die Schusslinie mit Strahl und Puff; hier liegt der stärkste Kontrast |

**Gebrauchsspuren (Kanon Gebiet 3, V-566)**: RA-Quelle, daher nur über Knet-Oberfläche und Terrain; die Silhouette bleibt 1:1.

| Objekt | Spur | Ursache |
|---|---|---|
| Duellanten und Blaster (Hero, Landmarke) | keine Spur an Figuren oder Waffen: Sie werden nie umgetönt | Besetzungsregel (nie umtönen) |
| Bahn (Terrain) | gerade ausgetreten, heller als der Sand | Abnutzung: immer dieselbe Probestrecke |
| Standplätze (Terrain) | am tiefsten getretene Mulden | Abnutzung: immer dieselben zwei Standplätze |
| Standplatz-Sprenkel A/B (Terrain) | zum Rand blasser, Sand weht darüber | Farbverlust durch Sandverwehung |
| Steinnester (Terrain) | Moos in den Fugen, Sandkeil bergab | Moos am Dünenfuß, Sand rieselt von der Düne |

## Materialcodes (`material_codes`, höchstens 3)
1. **Sand-Knete-Boden:**
   - Form: weiche Dünenrücken mit Aqua-Farbflächen.
   - Verteilung: Dünengras in Dreier-Büscheln nur auf den Dünenkämmen; auf Sohle und Bahn nichts.
   - Bewegung: Die Büschel wiegen in Wind-Gruppen (Environment-Kit §6/§8), mit starker Biegung im Abendwind.
2. **Ausgetretene Bahn:**
   - Form: gestampfter Sand in Pfad-Ton, gerade und flach.
   - Verteilung: Die Kanten laufen als Sprenkel aus. An beiden Enden liegt eine festgetretene Mulde (Standplatz), darin ein Farbsprenkel A (frame) bzw. B (tiers2).
   - Bewegung: Dodge und Treffer-Puff wirbeln Pfad-Ton auf (Puff-Ton = Boden).
3. **Violette Steinnester:**
   - Form: runde Knet-Findlinge und Kiesel.
   - Verteilung: am Dünenfuß, nach Grammatik §4 ungerade, auf der B-Seite mehr.
   - Bewegung: Die Steine liegen ruhig und tragen Moos in den Fugen.

## Ortsbiografie (`biography`)
Nur Terrain-Arbeit, keine neuen Requisiten.

| Schicht | Ein Satz | Umsetzung |
|---|---|---|
| 1 Entstehen | Eine flache Sandsenke zwischen niedrigen Dünen, hinten rechts höher | Terrain-Form, Sohle = Quell-Ellipse, keine Scheibe, keine Stufen |
| 2 Nutzen | Vom Üben ist eine gerade Bahn ausgetreten, die Standplätze an den Enden sind am tiefsten getreten | Pfad-Ton-Bahn (D lang, Quelle), Sprenkelband (V-403); Mulden mit Farbsprenkel A/B. **Gebrauchsspuren (V-566, nur Knet-Oberfläche/Terrain):** Duellanten und Blaster (Hero, Landmarke): keine Spur an Figuren oder Waffen: Sie werden nie umgetönt (Besetzungsregel (nie umtönen)); Bahn (Terrain): gerade ausgetreten, heller als der Sand (Abnutzung: immer dieselbe Probestrecke); Standplätze (Terrain): am tiefsten getretene Mulden (Abnutzung: immer dieselben zwei Standplätze); Standplatz-Sprenkel A/B (Terrain): zum Rand blasser, Sand weht darüber (Farbverlust durch Sandverwehung); Steinnester (Terrain): Moos in den Fugen, Sandkeil bergab (Moos am Dünenfuß, Sand rieselt von der Düne) |
| 3 Vergehen | Am Dünenfuß liegen violette Steine, auf der höheren B-Seite mehr; Sand weht über die Bahnkanten | Steinbänder Grammatik §4 (Band 0–2), `nest_ok`; Sprenkel in beide Richtungen |
| 4 Bewachsen | Dünengras-Büschel auf den Kämmen, Moos in den Fugen der Steinnester. Auf der Bahn wächst nichts | Gras-Gruppen 3/5, Fugen-Sprenkel |

**Kontakt-Geometrie (V-565):** Jede Fuge wird gebrochen (`kfb_env.contact`):
- an jedem Steinnest ein Sandkeil bergab plus Moos;
- die Figuren stehen in den Standplatz-Mulden direkt auf dem Terrain;
- gefallene Figuren (`kill`, Dodge-Weg 0,81 u) brauchen eine ebene Sohle ohne Steinchen.

**Signatur:** Hero = der Blaster von A; Echo = der Blaster von B (gleiche Form, Spiegel der Schusslinie). Nichts Drittes.

## Gruppen (`groups`)
- **g1 Standplatz B, hinten rechts:**
  - Steinnest Band 0 (Anker) + 2 Stützen + Dünengras-Dreier am höheren Dünenfuß;
  - Ortsgrund: Hang, Geröll rollt von der hohen Düne.
- **g2 Standplatz A, hinten links:**
  - kleines Steinnest (Anker) + Gras-Dreier, leichter als g1;
  - Ortsgrund: flacher Dünenfuß.
- **g3 Dünenkamm hinten Mitte:**
  - Gras-Fünfer auf dem Kamm hinter der Bahnmitte;
  - Ortsgrund: Kamm, rahmt die Schusslinie, bleibt unter Kopfhöhe im Bild der Spielkamera.
- Jede Gruppe ungerade (Gate G1). Kontakt-Steinchen zählen nicht in die Gruppenregeln.

## Story-Beat (`story_beat`)
Standard `duel5` (Quelle): Standoff 0,9 s, dann
1. A **miss**;
2. B **hit**;
3. A **dodge**;
4. B **dodge**;
5. A **kill**.

Zwischen den Beats 0,35 s Pause. Für jeden Schuss gilt:
- Ausholen → Mündung → Geschoss im selben Bild;
- Knet-Puff mit Hit-Stop, Squash, Rückstoß in Schussrichtung;
- Puffs werden aus der Gesichtszone geschoben, nicht weggelassen.

Weitere Skripte der Quelle: `quickdraw`, `nohits`, `trade`.

## Besetzung (`cast`)
Alle Rig_Medium, Quelle:

| Fassung | Figur | Augen |
|---|---|---|
| hero_red | Hero Man rot (`hero_man` rot), Standard A | KFB-Augen hinter dem Visier (occludedBy visor), G1 PASS |
| hero_blue | Hero Man blau (`hero_man` blau), Standard B | KFB-Augen hinter dem Visier, G1 PASS |
| soldier | Toy Soldier (`toy_soldier` duel_carbine) | **erst nach Augen-Fix V-562** |
| mech | Combat Mech weiß (`combat_mech`) | KFB-Augen in der Visier-Nische |
| mech_alt | Combat Mech oliv | KFB-Augen Pflicht; Karte fehlt (Offene Punkte) |

- Jede Figur hat KFB-Augen und E2-Lider, an jeder Variante.
- Waffen nach V-536 (Mündung auf der Unterarmachse, `KFB_Grip` / `KFB_Muzzle`).

## Kameras (`cameras`)
1. 45° schräg von oben über die Bahn.
2. Augenhöhe (1 H) hinter A, die Bahn entlang auf B (Hauptweg = Bahn).
3. Fuß nah: Standplatz B (Mulde, Farbsprenkel, Steinnest, Sandkeil).
4. Seite: quer zur Bahn wie Quelle `view('side')`, Dünen-Silhouette dahinter.
5. Gesicht nah: Hero rot und blau (Visier), dazu Soldat und Mech, wenn sie besetzt sind.
6. Spielkamera (Bühnen-Orbit V-257).

## Referenz (`reference`)
- RA S17 `#__duel`, Skript `duel5`: Aufstellung, Abstand und Effekte 1:1.
- Joyride B Bikini-Bucht: Farbwelt.
- Terrain-Design 19.10. (#439): Farbflächen, dunklere Vordergrund-Tonfläche, getönte Schatten.

## Verbote für diese Szene
- Scheibe, Ellipse, Platte oder eigener Boden; runde Startmarken.
- Deckung, Fässer, Zäune oder andere neue Requisiten.
- Symmetrische Spiegel-Szene.
- Abstand D oder Zeiten „verschönern“.
- Eigene Lampen; Strahlen als Lichtquelle.

## Offene Punkte (Quelle lückenhaft oder widersprüchlich, nicht durch Erfinden gelöst)
1. **Testgelände:** Die Quelle nennt keinen Ort. Er ist hier nur über das Terrain gesetzt (Sandsenke Bucht). Der Welt-Anker kommt mit der Stage-Instanz (WSA-STAGE-01).
2. **Startmarken:** Die Quelle hat runde Scheiben rot/blau, Kanon B1 verbietet Scheiben, und ihre Farben liegen außerhalb der Palette. Vorschlag: Farbsprenkel in frame und tiers2. Möchte Georg die Marken anders oder gar nicht, entscheidet er.
3. **Waffenhaltung:**
   - Die Quelle hat Pistolenhaltung an `handslot.r` mit Roll 75° (Georg 04.10.: falsch) → V-536 (B50: an `lowerarm.r`).
   - Die Quelle nennt „Gewehr beidhändig“, q132 sagt Karabiner einhändig. Georg gilt vor der Quelle.
4. **Soldat:** V-562 (Register: FAIL, keine Augen) widerspricht der B50-r2-Rückgabe (G1 PASS). Es gilt das Register, also erst neue Prüfung.
5. **Hero-Augen:** Sie sind hinter dem Visier verborgen (occludedBy). Möchte Georg sichtbare Augen auf dem Visier, ist das ein kleiner Umbau.
6. **mech_alt:** `60_CAST/cast.r1.json` führt nur `combat_mech`. Für die olive Fassung fehlen Karte und Augen-Nachweis.
7. **Strahl-Leuchten:** Die Quelle hat Farbe plus Mündungsblitz, B50 sagt „Leuchten zur Laufzeit“. Das widerspricht Kanon §11 („keine Emission“). Nicht entschieden.
8. **Würfel:** Er ist prozedural weiß mit dunklen Augen; das Arena-Würfel-GLB ist nicht eingebunden.
9. **Abstand:** Die Quelle sagt D = 3,6 H, B50 setzt ±3,3 u. Gleichheit ist ungeprüft.
10. **Atlas-Licht:** Die Quell-Bühne nutzt das neutrale Atlas-Licht; hier gilt nur das Welt-Rig.

## Ablauf
- **WS1 (Paket E):** Einpassung im Spielterrain Bucht. Die Senke folgt der Quell-Ellipse.
- **WSB:** Soldat-Augen (V-562), Karte `mech_alt`, Eingangsprüfung für Waffen-GLBs.
- **WSA:** Stage-Instanz `kfb.resident-stage/0.1` (WSA-STAGE-01), Save/Reload, gleiche Choreografie.
- **Prüfung:** Gate mit `concept.json` daneben, dann der blinde Kritiker mit den Kameras 1–6.
- Georg sieht nur das Bestandene.


## WS0-Entscheide (20.10., Art Direction)
Diese Entscheide schließen die offenen Punkte oben; was dort noch offen steht, ist hiermit beantwortet.
- Startmarken: keine Scheiben, sondern Sprenkelfelder in den Duellanten-Farben im Sand.
- Waffenhaltung nach V-536 und q132 (Karabiner einhändig).
- Spielzeugsoldat erst nach dem Augen-Fix (V-562); das Register zählt, nicht die alte B50-Rückmeldung.
- Hero-Man-Augen hinter dem Visier wie in der Quelle, solange G1 sie nachweist.
- `mech_alt` bleibt draußen, bis eine Figurenkarte existiert.
- Blaster-Strahlen ohne Emission: als Knet-VFX im einen Licht (Kanon Gebiet 11).
- Abstand 3,6 H aus der Quelle zählt; WS1 misst gegen B50.
