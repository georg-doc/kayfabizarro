# Für Claude Design · Nachtrag zum Umgebungs-Modul: Antwort auf NACHTRAG_1 und der Bestand zum Mitnehmen · 17.11.2026 (WS0, Georg „Bürgersteige, City-Street-Props, WFC-Module, Schalter, Props, Materialcodes direkt mitgeben“)

Danke für Zwischenstand 2 (`claude/umgebung-r1` @4ac18fae). Unten stehen die Antworten auf deinen Nachtrag und alles, was es im Stamm schon gibt. Bau damit weiter, wie es dir sinnvoll erscheint.

## Antworten auf NACHTRAG_1
- **A, Felder am Straßenrand:** Ja, so ist es besser als Stoff über der ganzen Welt. Der Feld-Modus wird Standard, die Abfrage „liegt ein Punkt im Feld“ ist genau richtig. Platzieren darf später der Verteiler, dein Muster-Planer ist die Vorlage dafür.
- **B, Zellen (Quadrat und Wabe):** Gern als zwei Familien.
- **C, Begrenzungen:** Zaun, Mauer, Bordstein und Rennbande als ein Standard entlang einer Linie, mit Knet-Regel und auslaufenden Endstücken. Bitte bau das auf dem vorhandenen Stützen-Besitzer `src/modules/kfb-curb/` auf (V-1000, „one procedural support owner“: Bordstein-Kontur, konvexe Ecken als Kreisbögen, konkave über die Kontur aus `terrainStitch`). So gibt es einen Besitzer statt zwei. Die Straßenanatomie unten gilt als Grundlage.
- **D, Steinchen als Materialcode:** Genau so. Die Material-Tabelle sitzt in `src/modules/materialContact.js` (paper, metal, clay, Aliase). Lose Kleinteile liest der Verteiler, der heute schon Kiesel setzt. Bitte erweitern statt einen zweiten Streuer bauen.
- **Labyrinth-Einwand:** Schreib ihn ruhig ausführlicher, ich lege ihn Georg vor.

## Bestand zum Mitnehmen (Stamm `georg-doc/KFB-Stunt-Car-Race`, Zweig `game/integration-r2`)
**Straße und Gehweg**
- `src/world/viertelZufahrt.js`: Fahrbahn bündig im Gelände, Pflaster wie die Gehwege der Viertel (Läuferverband mit Fugen, Ton aus der Knete), Ränder laufen über das Sprenkel-Modul ins Gelände aus (V-403).
- `src/world/viertelLoader.js` und `ViertelZone.jsx`: Kartenviertel mit Gebäuden, Hülle, Straßen und Gehwegen aus dem Viertel-Generator. Die Zerstörung der Kartengebäude ist dort der Hauptmechanismus.
- `src/modules/kfb-curb/`: Bordsteine und Stützen als prozedurale Kontur.
- `src/world/terrainStitch.js` und `src/world/grounding.js`: Naht zum Gelände und Platzierungs-Grammatik. Sockel sinken ein, Gelände steigt an, Gruppen ungerade, nichts schwebt (SPEC_PLACEMENT_GRAMMAR_R2).
- Gelände-Öffnungen und Schneisen: `endlessTerrain.reserveOpening` und `gelaendeOeffnung.js`.

**City-Props**
- KayKit City Builder Bits (citybits-Atlas) laufen schon im Spiel: Häuser mit warmen Nachtfenstern (`src/world/lichtinseln/index.js`). Ampeln, Hydranten, Bänke, Laternen und Schilder aus demselben Kit passen dazu, Kit-Teile unverändert (V-574).
- KayKit und Tiny Treats hast du schon. Zäune und Begrenzungen bitte nach Teil C.
- Arena-Stadt (Low Poly Shooter Pack, `src/world/arena/arenaStadt.js`): Mauern, Stände, Fässer und Kisten als Instanzen mit Kollisionskästen. Das ist ein Muster für Hindernis-Props.

**Props, Verteiler, Physik**
- Knet-Pop-ups (`src/world/popupClayCore.js`): Der eine Verteiler ruft `popup.add(zelle, [...])` beim Zellbau und `drop` beim Freigeben. So sollten auch deine Teile andocken.
- Hartgummi-Tabelle `src/world/gummiTabelle.r1.json` (V-1229): je Prop-Klasse `steif` und `durchlass`. Neue Klassen (Meeple, Domino, Zaun) bitte dort eintragen.
- Kontaktfleck und Erdung: `src/look/footContact.js` und `src/modules/contactBlob.js`, ein Weg für alle.

**WFC und Platzierung**
- `src/world/startWfc.r1.json` (Schalter `start=wfc`): Start-Anordnung aus dem Pop-up-Katalog.
- `src/world/dioramen/` (Schalter `diorama=r2`): Meshy-Dioramen mit Farbrolle, Einbettung, Steinbändern und Platzwahl.
- Szenen-Plätze `src/world/szenen/` mit Belegungsregel (`src/world/occupancy.js`): Wer zuerst kommt, belegt.

**Schalter:** Alle Schalter stehen in `src/flags.js` mit Besitzer und Status. Deine kommen dazu (`boden=patchworld`, `bits=r1`, für Begrenzungen ggf. `rand=r1`).

**Licht und Knete:** ein Licht-Rig (V-385), Knete über `claySSOT`. Teile bekommen Figurenlicht und Knete wie alle Props, keine eigenen Lampen.
