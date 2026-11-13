# Auftrag WS1 · Fernwald R1 · Einbau-Slot für prozedurale Bäume im Gelände · WS0 · 12.11.2026 (Georg Hub q614 und Chat 12.11.)

Baue in unser aktuelles Gelände einen Wald aus einfachen, prozeduralen Baumformen nach dem Rezept von Tiny Skies, erst mit einer Tropfenform als Platzhalter. Den endgültigen Look wählt Georg parallel auf einer Werkbank von Claude Design. Dein Modul liest dann deren Rezept-Datei. Branch `module/fernwald-r1` von `game/integration-r2`, Schalter `fernwald=r1` (aus).

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Für diesen Auftrag (WS0-Entscheidung):** Laufzeit-Code im Spiel, Gate sind die Tests des Schalters `fernwald=r1` plus die Pflichtliste unten. **Konzeptblatt (WS0):** Wer läuft oder fliegt, sieht in der Ferne Hänge voller ruhig wiegender, einfacher Bäume in vielen Tönen einer Farbfamilie. Nah stehen zwei, drei unserer Kit-Bäume mit Props als Blickfang, und man läuft durch den Wald einfach hindurch. Farb-Skript: Töne aus der Biom-Palette des Orts, je Baum ein Ton, Nachbarn ähnlich. Form-DNA: einfache, gerundete Körper (Tropfe, später die Familien der Werkbank). Lebensanker: Wind mit Böen, die als Wellen über die Reihen laufen. Verboten: neue Platzierungsformel, gleichmäßige Streuung, Kollision mit den prozeduralen Bäumen, Verlauf als Fußschatten. Kameras: Spielkamera fern und nah, Drohne, Tiefflug.

**[Motion/tests]:** Lauf- und Fahrtests mit mindestens 50 Bildern pro Sekunde **und** gedrosselt auf 30. Landungen kommen aus dem Bodenkontakt, nicht aus der Animation.

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

## Warum
Georg (q614, 11.11., und Chat 12.11.): Wälder aus 10 bis 20 und mehr Kit-Bäumen sind zu viel. Im Nahbereich reichen zwei, drei Kit-Bäume plus Props. Sonst stehen einfache, ovale Formen, die im Wind wiegen und durch die man wie bei Tiny Skies einfach durchläuft oder durchfliegt. Die verschiedenen Töne und unsere Farbbiome machen den Look gemütlicher. Für die Vegetation in der Ferne geht Georgs Wahl vor der allgemeinen Ebenen-Regel V-1171 (Hintergrund hyperreal).

## Material
Ordner im privaten Repo: https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/design/fernwald-r1/design/fernwald-r1
- [tinyskies_referenz.jpg](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/tinyskies_referenz.jpg): die Bildreferenz (eine Tropfenform tausendfach, je Baum ein Ton aus Grün, Oliv und Ocker, dunkler Fuß, Hänge voller Gruppen).
- [spiel_stand_ferne.jpg](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/spiel_stand_ferne.jpg) und [spiel_stand_kitbaeume.jpg](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/spiel_stand_kitbaeume.jpg): heutiger Stand (Stamm @7b24ac6e).
- [spiel_stand_weisse_steine.jpg](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/spiel_stand_weisse_steine.jpg): zu Punkt 6.
- Briefing der Werkbank zum Mitlesen: [BRIEF_CLAUDE_DESIGN_FERNWALD_R1.md](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/BRIEF_CLAUDE_DESIGN_FERNWALD_R1.md) (gleicher Branch).

## Was du baust
1. **Modul `src/world/fernwald.js`** nach Host-Vertrag R1.2: zeichnet die Baum-Instanzen, die die Kaskade setzt, eine Instanzen-Gruppe je Baumform, heute nur die Tropfenform. Es verteilt selbst nichts. Es liest später `src/data/worlds/fernwald.rezept.r1.json` (Schema `kfb.fernwald-rezept/1` aus der Werkbank: Familien und Anteile je Welt, eine Familie je Masse nach V-798, Knet-Profil, Tonreihe, Fuß, Wind, Gruppen-Ähnlichkeit als Zielwert). Bis dahin eine Platzhalter-Datei mit der Tropfe und der Tonreihe „natürlich“.
2. **Ort über die Kaskade (`place=r3`, `src/world/placeVeg.js`, Tabelle `kfb-place-cascade.r3.json`):**
   - Die Wald-Zellen der Ebene `hain` bekommen den prozeduralen Baum als Instanzart. Dichten und Gruppenstufen (keine, wenige, viele) sind Tabellenzeilen, kein Code.
   - Die prozeduralen Bäume stehen überall im Wald, auch nah am Spieler. So entsteht keine leere Blase um FB.
   - Kit-Bäume (unverändert, V-574) erscheinen nur nah, innerhalb von 25 bis 35 m, als höchstens zwei, drei Blickfänge je Gruppe mit Props. Welche Zelle ein Kit-Baum ist, entscheidet die Tabelle.
   - Die heutigen fernen Kit-Fassungen und die Kit-Massen ersetzt der Fernwald.
   - Kit-Bäume erscheinen und gehen mit organischem Sprenkel-Durchdringen (V-403), nie mit hartem Umschalten oder Überblenden.
   - Der Ring von 25 bis 35 m ist Georgs Vorgabe. Willst du davon abweichen, zeig ein Bildpaar und frag WS0 über den Kanal.
   - Unter 3 Pixeln keine Instanz, sondern Shader oder nichts.
3. **Farbe:** aus `BIOME_PALETTES` (`src/look/biomeTerrain.js`, Felder `leaf`, `leafAlt`, `low`, `mid`, für „psychedelisch“ dazu `high`, `band6`, `bloom`; nie `accent`, Kanon Gebiet 16). Die Hain-Zelle bzw. Gruppe der Kaskade trägt einen Ton aus der Reihe von fünf, die Bäume erben ihn mit kleiner diskreter Abweichung (TIER0 Zeile 9). Wie ähnlich, steht als Tabellenwert der Ebene `hain`. Der dunkle Fuß ist eine harte, schmale Stufe, kein Verlauf (V-749 Punkt 4). Die Saat der Welt bleibt die Quelle (`setBiomePalettes`). Material über die Knete `kfb-clay` v1.1, Profil aus dem Rezept (bis dahin `background`, „Gelände · Ferne (ruhig)“, auch für nahe Bäume), kein eigenes Material.
4. **Wind und Durchgang:** Schwanken über das geteilte Windfeld `src/world/kfbWind.js` (`sway`, V-605/V-619), Böen laufen als Wellen über die Bäume. Die prozeduralen Bäume haben keine Kollision: FB, Wagen und Flug gehen durch. Sie weichen dabei wie die übrigen Windgruppen kurz aus (V-605), wenn das Windfeld das schon kann; sonst bleiben sie ruhig, und du meldest es WS0 über den Kanal. Kit-Bäume behalten den Kontakt, den sie heute haben (keine festen Kollider unter `place=r3`, V-1228).
5. **Leistung:** 10.000 Bäume sichtbar mit höchstens 1,5 ms GPU je Bild. Gemessen wird nach dem Muster der GPU-Zeitmessung mit Rücklesen (nicht mit Bildabstand oder Timer-Abfragen). Abstufung nach Kachelgröße wie in `endlessVeg.js` (64-m- und 128-m-Kacheln).
6. **Nebenbefund Georg 12.11. (klein, eigener Schalter `steinband=1`):** Die hellen, fast weißen Steine sollen die Farbbänder des Geländes tragen, so wie früher mit dem Boden-Albedo-Überzug: Die Bänder laufen über die Steine weiter und binden sie ins Gelände ein (Bild `spiel_stand_weisse_steine.jpg`). Anschluss an die vorhandene Boden-Albedo (`src/look/groundAlbedo.js`).

## Pflichtliste und Beleg an WS0 (über `comms/ws0-ws1`)
- Löser-Ausgabe von oben über mehrere Zellen mit zwei Saaten plus die geänderten Tabellenzeilen. Zählwerte in `perf.json`.
- Je Ort ein Bildpaar vorher und nachher, gleiche Lage und Kamera: Spielkamera und Drohne. Orte sind die drei aus den Spielstand-Bildern.
- Ein kurzes Video im Tiefflug durch einen Wald, mit Wind.
- Messwerte: GPU-Zeit bei 10.000 Bäumen, Bildrate gedrosselt auf 30, Ladezeit.
- Stein-Bänder: ein Bildpaar vorher und nachher.

WS0 prüft die Bilder selbst, lässt einen blinden Kritiker nach `CANON_3D/CRITIC_3D_R1.md` darüber laufen und legt sie dann Georg im Hub vor. Rückfragen nur über den Kanal (Q-###).
