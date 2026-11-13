# WSA-Work · Patch-Transfer R1: POC Karten-Räume + Analyse · 13.11. (Georg)

**Ziel:** (A) ein POC für prozedurale Räume und unmögliche Innenräume aus unseren Karten, zuerst; (B) für drei weitere Systeme von patch.gg klären, welche Teile wir übernehmen können. Immer ohne fremden Renderer und ohne zweite Spielschleife, kein Einbau ins Spiel. Voxel-Zerstörung testet Georg schon mit dir, die bleibt hier draußen.

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Konzeptblatt Teil A (WS0, V-561):** Wer durch eine Karte tritt, steht in einem Raum, der innen größer ist als außen. Wände, Decke und Boden sind unsere Kartenbilder, unverändert, wie Tapeten; in der zweiten Variante laufen sie als HyperNorm-Bilder. Gänge verbinden Räume mit Rollen (Eingang, Kampf, Schatz, Boss), alles aus einer Saat. Farb-Skript: die Karten selbst, Licht und Knete aus den Kanon-Modulen. Form-DNA: einfache Quader-Räume, Kartenformat als Raster. Kein Konstruktionsmuster sichtbar, keine schweren Dekor-Meshes.
Bilder aus dem Spiel nur mit Knete, echtem Gelände und Spielkamera (CANON Gebiet 8 und 15); Demo-Bilder der Patch-Originale sind davon ausgenommen.

**TIER0 Verteilung** (wörtlich aus `replies/FRAKTAL_R1/TIER0.md`)
1. Alles Stehende und Liegende kommt aus einer Löser-Kaskade: je Maßstab ein Raster und eine Tabelle von Nachbarschafts-Wahrscheinlichkeiten zu allen Seiten. Kein zweiter Verteiler, keine eigene Formel, Zufall nur aus Saat und Ort.
2. Löser ist `createLevel` und `collapse` aus `kfb-place-field` und `kfb-place-collapse`. Ein neuer Fall ist eine Tabellenzeile in `kfb-place-cascade.r3.json`, kein Code.
3. Die Zelle der feineren Ebene ist bedingt durch den Zustand der gröberen. „leer“ vererbt sich, unter einem Objekt bleibt der Platz frei. Keine feine Ebene ohne gröbere.
4. Gruppen, Größenstufen, Abfall und Lücken sind Ergebnis der Tabelle. Nie von Hand setzen: keine Kränze, Säume, Reihen, keine Abstandskurve je Objekt. Ausnahme Bäume (V-1216): Stufen keine, wenige (meist Dreiergruppe), viele (Fibonacci-Folge) als Tabellenwert der Ebene `hain`, nie im Code.
5. Größe hängt am Raster der Ebene. Keine eigene Größenregel, Spannen aus der Tabelle.
6. Hang, Schatten, Sperre, Thema, Deck und Wasserabstand wirken als Faktor im Vorwissen der Ebene, nie als Nachbearbeitung.
7. `kinder()` nur, wenn ein Ereignis etwas auswirft (Einschlag, Spritzer, Fluff im Flug): Große bleiben nah und fallen, Mittlere fächern, Kleinste fliegen am weitesten. Was danach liegt, gehört wieder der Kaskade. Ausnahmen: Kartenrelief, dort bestimmt das Bild die Kugeln; Linien an Ufer und Rissen folgen dem Gelände, laufen spitz aus und setzen aus.
8. Mindestens die Hälfte des Bodens bleibt frei, Materialcodes nur gegen kahle Flächen. Keine Konturen im Bereich 0,85–1,25 der Radien (V-749). Beides wird gemessen.
9. Farbe aus Elternteil oder Boden an dieser Stelle, diskret, Kugeln nur über `ballCore`. Unter 3 Pixeln keine Instanz, sondern Shader oder nichts (V-403, V-1090). Nie Landmarken, Gebäude, Straßen oder Höhen (V-708).
10. Abgabe: Löser-Ausgabe von oben über mehrere Zellen mit zwei Saaten plus die Tabelle, dann Einzelbilder aus dem Spiel (V-1100). Zählwerte in `perf.json`. Lesen nur `replies/FRAKTAL_R1/FRAKTAL_R1.md` §1 und §5.

**Unser Stand (Spiel `game/integration-r2` @4b748ce6 im privaten Repo `georg-doc/KFB-Stunt-Car-Race`):** three 0.186.1 mit WebGLRenderer über react-three-fiber, Rapier 0.19.2 (compat), eine Spieluhr. Ein System, das nur mit WebGPU läuft, kann höchstens als Verfahren übernommen werden.

**Teil A · POC Karten-Räume (zuerst):**
- Aus **Realistic procedural dungeons** (patch.gg/blendi/realistic-procedural-dungeons) nur den Generator (Räume, Gänge, Raumrollen, Saat), nicht die Darstellung (laut Recherche ~3,5 Mio. Dreiecke je Bild).
- Räume daraus bauen mit (a) unseren Karten als Wände, Decken und Böden (Kartenbilder aus `cardart=pack`, Original nie umgefärbt) und (b) als zweite Variante mit dem HyperNorm-Shader (`hnkern`).
- **Impossible spaces** (patch.gg/blendi/impossible-spaces) als Verfahren für Kartenportale: ein Raum, der innen größer ist als außen, betreten über eine Karte.
- Eine isolierte Seite im Zweig `wsa/patch-transfer-r1` mit three 0.186.1 (WebGL) und Rapier 0.19.2; FrizzleBob-Kapsel als Maßstab, drei Saaten.
- Rahmen: Illusions-Budget (V-726), Regeln für Dungeon-Wände (V-754, CANON Gebiet 4), Vergleich mit `src/modules/randomMaze/graph.mjs`.
- Zurück: Dreiecke, Zeichenaufrufe, Bildzeit auf dem Mac mini als Zielgerät (V-407, V-1216); je Saat ein Bild, ein kurzes Video durch einen Raum und ein Portal.

**Teil B · Analyse (danach, ohne Proben im Spiel):**
1. **Realistic car** (patch.gg/patch/car) gegen unsere Fahrzeuge (`src/m2/M2Car.jsx`, `racerRig.js`, `k2t.js`): Fahrphysik und Fahrgefühl, Reifen und Federung, Steuerung mit Leertaste als Handbremse (Georgs Wunsch; heute liegen auf der Leertaste Flug, Turbo und Fassrolle, der Drift auf Q/E – bitte die Belegung nur analysieren, entschieden wird im Hub), Reifenspuren, Fahrzeug-Ton und SFX, Kollision, Stunts und Rampen, alle weiteren Aspekte.
2. **Low-poly trees** (patch.gg/patch/lowpoly-trees) gegen unseren Fernwald (`src/world/fernwald.js`, Formen aus der Werkbank R2), das gemeinsame Windfeld `src/world/kfbWind.js` (V-605) und das Biegen/Federn bei Kontakt (Hartgummi, V-1227/V-1228): steuerbare Blätter (z. B. Fluff-Ernte als Blätterfall), Wind, Wachsen, Klick- und Sprung-Reaktion, Bewegungsrig der Bäume.
3. **Particle physics** (patch.gg/patch/particle-physics): Stoff (Vorhang), dynamische Flüssigkeiten, Honig-Regen, Wasserfall; gegen unseren Bestand: den einen Partikel-Kern `src/world/ballCore.js` (Kugeln, Trümmer, Spritzer; TIER0 Zeile 9), Kit-Fluid `src/look/kfbWater.js` mit Fluid-Look `src/look/fluidLook.js` und den Vorhang. Ein zweiter Partikel-Kern neben ballCore kommt nicht infrage; übernommen würde nur, was ballCore oder kfbWater erweitert.

**Je System aus Teil B zurück (ein Abschnitt, kurz):**
- Quellcode gelesen: Aufbau, Abhängigkeiten, Renderer (WebGL oder nur WebGPU), eigene Schleife ja/nein, Physik-Engine und Version.
- Was sich als Modul ohne fremden Renderer herauslösen lässt, mit Dateien und Funktionen.
- Kosten: Dreiecke, Zeichenaufrufe, Bildzeit, Speicher, gemessen in der Patch-Demo auf dem M1 Max; Messungen unserer Proben auf dem Mac mini als Zielgerät (V-407, V-1216).
- Vergleich mit unserem Bestand: was nachweislich besser wäre, was wir schon haben.
- Vorschlag für eine isolierte Probe mit unseren Assets (z. B. unser Wagen mit dem Patch-Reifenmodell), ohne Spielcode zu ändern.

**Grenzen:** kein Einbau in `game/integration-r2`, keine neue Site, keine fremden Assets ins Spiel-Repo; Proben in eigenem Zweig `wsa/patch-transfer-r1`.

**Rückgabe an WS0 in PR #49:** POC aus Teil A, die drei Abschnitte aus Teil B, Zweig-SHA der Proben, Bilder oder kurze Videos der Proben. WS0 entscheidet danach mit Georg im Hub, was eingebaut wird.
