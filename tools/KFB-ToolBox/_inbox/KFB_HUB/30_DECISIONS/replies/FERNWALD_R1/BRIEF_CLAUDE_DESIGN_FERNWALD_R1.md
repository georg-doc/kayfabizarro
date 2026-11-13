# Briefing für Claude Design · Fernwald-Werkbank R1 · WS0 · 12.11.2026 (Georg Hub q614 und Chat 12.11.)

Du baust für KFB (Kayfabizarro, cartoonig-surreales Open-World-Spiel in Knet-Optik) eine **Werkbank als three.js-Seite mit Reglern**, auf der Georg den Look für prozedurale Bäume auswählt, die im Wald überall stehen, nah wie fern. **Ausnahme zu V-775:** Georg hat diesen Umgebungs-Auftrag an Claude Design am 12.11. im Chat ausdrücklich gewünscht (Vorschlag WS0, Antwort Georg „ja, schreib beide Briefings“). Er gilt nur für diese Werkbank. Ergebnis ist nur Code: die Seite selbst plus ein exportiertes Rezept (JSON), keine Bilder.

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Für diesen Auftrag (WS0-Entscheidung):** Eine Code-Bühne zur Vorschau, kein Spielbau. Material und Licht kommen aus den gelieferten Kanon-Modulen (`kfb-stage-light.v1.1.js`, `kfb-clay.v1.1.js`), unverändert importiert, kein eigenes Licht, keine Nachbearbeitung. Gate ist die Prüfung der Seite durch WS0 (Knete sichtbar, Schatten ohne Naht, nur das eine Licht) plus ein blinder Kritiker-Lauf auf die WS0-Fotos; dieser Tausch des Gates gehört zu Georgs Ausnahme vom 12.11. (siehe oben). Keine Figuren auf der Bühne: wo ein Maßstab nötig ist, steht eine graue Kapsel in FrizzleBobs Größe (zum Vergleich: FB in den Spielbildern unten). **Konzeptblatt (WS0):** Wer läuft oder fliegt, sieht Hänge voller ruhig wiegender, einfacher Bäume in vielen Tönen einer Farbfamilie, nah dazwischen zwei, drei Kit-Bäume als Blickfang. Helligkeit: Boden mittel, Baumkronen eine Stufe dunkler, Fußstufe am dunkelsten, Himmel am hellsten. Farb-Skript: je Masse eine Farbfamilie aus der Biom-Palette, Nachbarmassen in verwandten Familien, kein Akzent. Lebensanker: Wind mit Böen, die als Wellen über die Bäume laufen.

**[Stage/light]:** Kein Randlicht, kein Gegenlicht, keine privaten Lichttricks (unbeleuchtete Karte, eigene Tonkurve, selbstleuchtende Flächen). Teile, die ineinander stecken, bekommen Kontakt-Verschattung.

## Worum es geht
Georg will Wälder, die in der Ferne als ruhige, im Wind wiegende Baumreihen lesbar sind, so wie bei Tiny Skies. Im Nahbereich bleiben zwei, drei unserer Kit-Bäume plus Props (Pilze, Geysire). Sonst stehen überall einfache, prozedurale Baumformen, auch nah, sodass man durch den Wald hindurchläuft. Sie sollen den Look gemütlicher machen und mit unserer Farbbiom-Logik psychedelisch und surreal werden dürfen. Georg hat das am 11.11. in q614 so gewählt („und zusätzlich Fernwald aus einfachen Formen“). Für die Vegetation in der Ferne geht diese Wahl vor der allgemeinen Ebenen-Regel V-1171 (Hintergrund hyperreal).

## Material (privates Repo, Branch `design/fernwald-r1`, Ordner `design/fernwald-r1/`)
Ordner: https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/design/fernwald-r1/design/fernwald-r1

| Datei | Wofür |
|---|---|
| [tinyskies_referenz.jpg](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/tinyskies_referenz.jpg) | **Die Bildreferenz.** Daraus nimmst du: eine Tropfenform, tausendfach wiederholt; je Baum ein Ton aus einer kleinen Reihe (Grün, Oliv, Ocker); unten dunkler als Schein-Kontaktschatten; Gruppen, die ganze Hänge füllen; harte, einfache Silhouetten. Nicht übernehmen: UI, Teppich, Lava-Wasser. |
| [spiel_stand_kitbaeume.jpg](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/spiel_stand_kitbaeume.jpg) | Heutiger Spielstand im Nahbereich: Kit-Bäume (Kegelstapel), ein rosa Baum, die Farbbänder des Geländes. Daran muss der Fernwald farblich anschließen. |
| [spiel_stand_ferne.jpg](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/spiel_stand_ferne.jpg) | Heutige Ferne: Bänder, einzelne Büsche, kaum Wald. Genau hier fehlt der Fernwald. |
| [biom_paletten.json](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/biom_paletten.json) | Die echten Biom-Paletten des Spiels für drei Saaten. Je Biom: `leaf`, `leafAlt` (Laub), `low`, `mid`, `high`, `sand` (Bodenbänder), `band6`, `bloom`, `bark`. `accent` bleibt für Bäume tabu. Im Spiel wechselt die Saat je Welt, die Werkbank braucht deshalb einen Saat-Wähler. |
| [kfbWind.js](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/kfbWind.js) | Unser geteiltes Windfeld (V-605/V-619). `sway(material, { k })` hängt das Schwanken an ein Material. Unverändert nutzen, damit die Werkbank wie das Spiel weht. |
| [kfb-stage-light.v1.1.js](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/kfb-stage-light.v1.1.js) | Das eine Licht (V-392), unverändert. |
| [kfb-clay.v1.1.js](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/design/fernwald-r1/design/fernwald-r1/kfb-clay.v1.1.js) | Unsere Knete, das eine Material für alles. Per Regler die vorhandenen Profile `midground` und `background` („Gelände · Ferne (ruhig)“, günstiger) vergleichen. Kein Material außerhalb der Knete. |

## Die Werkbank
1. **Gelände:** ein Hangstück von etwa 400 × 400 m mit sanften Hügeln und einem Grat. Den Boden in breiten, fließenden Farbbändern aus `low`/`mid`/`high`/`sand` der gewählten Palette einfärben, die unabhängig von der Höhe laufen (nie Höhe → Farbe, V-564). Eine Annäherung an unser Gelände genügt. Kameras: Spielkamera (dritte Person hinter der Kapsel, Höhe und Neigung wie in den Spielbildern), Drohne (hoch, schräg über den Hang), Tiefflug (2 bis 4 m über Grund, langsam durch einen Wald).
2. **Baumformen, vier bis sechs Familien**, jede aus einem einfachen, niedrig aufgelösten Körper mit gerundeten Kanten (Form-DNA, Kanon Gebiet 16: keine exakten Zylinder, keine scharfen Prismen): Tropfen (wie Tiny Skies), Oval, Lolli (Kugel auf Stiel), gestapelte Kegel mit runden Kanten, Wolkenbausch, schlanke Säule mit runden Enden. Ein Regler je Familie für Streckung und Neigung. Stamm optional und kurz. Alle Familien teilen die gerundete Knet-Krone (V-676). Die Größe streut je Baum um ±20 %, Nachbarn sind nie gleich groß (keine Klone).
3. **Farbrezept:**
   - Je Baum ein Ton aus einer Reihe von fünf Tönen, diskret (kein Verlauf über den Baum).
   - Regler „Tonreihe“ mit drei Stufen: natürlich (Grün → Oliv → Ocker wie Tiny Skies), Biom (aus `leaf`, `leafAlt`, `low`, `mid` der Palette), psychedelisch (dazu `high`, `band6`, `bloom`; nie `accent`, der bleibt Zielen, Gefahr und Figuren vorbehalten, Kanon Gebiet 16).
   - Dunkler Fuß als Schein-Kontaktschatten: eine harte, schmale Stufe am Fuß der Krone, kein Verlauf (V-749 Punkt 4). Regler für Höhe und Stärke der Stufe.
   - Gruppen-Ähnlichkeit (nur Vorschau): Nachbarn tragen ähnliche Töne, ganze Hänge bilden Farbfamilien. Im Spiel trägt die Gruppe der Kaskade den Ton und die Bäume erben ihn; exportiert wird deshalb ein Zielwert (wie ähnlich), keine Formel.
4. **Verteilung (nur Vorschau):** Waldmassen, die Zonen dicht füllen, mit weichem Rand, wenigen Ausreißern und offenen Wiesen dazwischen. Gruppen in den drei Stufen keine, wenige (meist Dreiergruppe), viele (V-1216). Gratbäume nur als Linie mit Lücken (V-831). Eine Baumfamilie je Masse (V-798), verschiedene Familien nur zwischen den Massen. Keine gleichmäßige Streuung. Im Spiel setzt die vorhandene Verteiler-Kaskade die Bäume (FRAKTAL TIER0), die Werkbank zeigt nur, wie es aussehen soll. Ihre Vorschau-Verteilung wird nicht exportiert.
5. **Abstandsbänder:** Die prozeduralen Bäume stehen überall, auch nah an der Kapsel, kein leerer Ring. Innerhalb von 25 bis 35 m stehen je Gruppe zwei, drei graue Platzhalter für unsere Kit-Bäume als Blickfang. Regler für die Dichte je Band (nah, Mitte, Ferne).
6. **Wind:** über `kfbWind.js`, Regler für Stärke und Böen. In der Ferne sollen Böen als Wellen über die Baumreihen laufen.
7. **Leistung:** eine Instanzen-Gruppe je Familie, 5.000 bis 20.000 Bäume, Bildrate in der Ecke nur zur Orientierung. Verbindlich misst WS1 im Spiel (V-1097).
8. **Rezept-Export:** ein Knopf schreibt die gewählten Werte als JSON mit `schema: "kfb.fernwald-rezept/1"`: Familien und ihre Anteile je Welt (eine Familie je Masse), Knet-Profil, Formwerte, Tonreihe, Fuß, Wind, Gruppen-Ähnlichkeit als Zielwert. Dichten und Gruppenstufen nur als Werte, die WS1 als Tabellenzeilen in die Kaskade übernimmt. WS1 liest genau diese Datei.

## Rückgabe und Abnahme
- Bitte drei fertige Voreinstellungen anlegen, zwischen denen man mit einem Klick wechselt: „Tiny Skies natürlich“, „KFB Biom“, „KFB Psychedelisch“.
- Rückgabe: die Seite als HTML-Datei und das Rezept-JSON je Voreinstellung in den Ordner `design/fernwald-r1/rueckgabe/` im selben Branch. Die Bildschirmfotos für den Hub macht WS0.
- WS0 prüft die Seite zuerst, lässt einen blinden Kritiker nach `CANON_3D/CRITIC_3D_R1.md` über die WS0-Fotos laufen und legt sie dann Georg im Hub vor. Georg sieht nur Geprüftes.

## Nicht in diesem Auftrag
Kein Wasser (eigener Auftrag), keine Figuren, keine Bildgenerierung, keine eigene Beleuchtung, keine eigenen Kit-Baum-Modelle (graue Platzhalter genügen; die prozeduralen Bäume stehen auch nah), keine Kollision.
