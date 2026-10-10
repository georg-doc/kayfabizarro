# QA-Regelwerk Environment R1 · Biome, Natur, Platzierung

Status: **VERBINDLICH für Bau und Kritik** · 2026-10-08 · Georg: „Konzeptlos, belanglos, lieblos hingewürfelt. Die Modelle sind nicht verstanden, es gibt kein Storytelling und kein Farbkonzept.“
Gilt für die Environment-Sitzung (Bauende) **und** den blinden Kritiker. Beide lesen nur diese Datei und die hier genannten Quellen. Georg wiederholt keine Regel mehr.

## 00 · Weltlogik zuerst (Georg, 2026-10-08, gilt vor allem anderen)

> „Es wird keinerlei Storytelling betrieben. Ihr baut es auf die billigste Art, die innerhalb der Anforderungen eine Lösung sein könnte, so dass es von einem Winkel gut aussieht. Ihr habt kein mentales Modell davon, was das innerweltlich ist. Jedes Element erzählt eine eigene Geschichte, genauso wie jede Insel und jede Residency ihre eigene Geschichte erzählt.“

**Pflichtfrage je Element, bevor es gebaut wird:** *Wer hat es gebaut oder wachsen lassen, womit, warum, und was erzählt es?*
- Gilt für jeden Baum, jede Gruppe, jeden Fels, jeden Weg und jedes Requisit, ebenso für die Insel als Ganzes.
- Die Antwort ist ein Satz im Biom-Blatt bzw. Bauweise-Blatt.
- Die Form, der Ort, die Farbe und die Erdung folgen aus diesem Satz, nicht aus der billigsten Lösung, die die Messregeln erfüllt.
- **Ein Element, dessen Geschichte nicht erzählt werden kann, wird nicht gebaut.**
- Messregeln sind die Untergrenze, keine Lösung. Wer nur die Messregeln erfüllt, hat noch nichts geliefert.
- Prüfen aus mehreren Winkeln: Was nur aus einem Winkel funktioniert, ist eine Kulisse ohne Welt.

## 01 · Keine harten Schnitte, keine sichtbaren Kanten (Georg, 2026-10-09, gilt grundsätzlich)

> „Wichtig als Regel scheint mir, dass es da keine harten Schnitte und keine sichtbaren Kanten gibt bei den ganzen Übergängen und dass das alles organisch mit Cartoon-Logik und entsprechendem Knetgummi-Design plausibel erscheint und nicht einfach so abgeschnitten wirkt.“

- **Gilt für jeden Übergang in der KFB-Welt:** Straße, Gehweg, Gelände, Natur, Inselrand, Brücke, Tunnelportal, freistehende Räume, Fluff-An- und Abbau, HUD- und Bühnen-Bauteile.
- **Nichts wirkt abgeschnitten.** Keine Messerkante, keine gerade Schnittlinie, kein Polygonrand, kein Farbsprung an einer Linie, kein Rausch-Gesprenkel, kein Farbverlauf.
- **Gebaute Enden sind Knet-Bauteile:** Kantenstein, Bordsteinkopf, Wandkopf und Portal sind gerundet und weich modelliert und sitzen mit Rubbel bzw. Knetfleck in ihrer Umgebung. Sie haben nie eine rasierte Kante.
- **Freie Enden runden sich durch Wachstum oder Verfall:** Bei erodierten Steinen kippen die Teile, die Ecken runden sich, sie brechen und laufen über Rubbel in einzelne Knetsteinchen aus. Flächen wechseln über `kfbBlend`-Knetflecken in drei Größen.
- **Prüfung:** Kein Kriterium ist erfüllt, wenn aus irgendeiner Prüfkamera eine harte Schnittkante oder eine helle Kante ohne Übergang zu sehen ist. Diese Kanten markiert der Kritiker als Befund (Teil von K9 bzw. U8).
- Details: `docs/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`.

## 0 · Quellen (Wahrheit in dieser Reihenfolge)

1. Dieses Regelwerk.
2. `docs/SPEC_PLACEMENT_GRAMMAR_R1.md`: Zonen, Rule of Three, Erdung, Wasser.
3. `docs/SPEC_ENVIRONMENT_KIT_R1.md`: Kits, Zielhöhen pro Rolle, Instanzierung, Budget.
4. `docs/SCALE_CONTRACT_K2.md`: H = 3,64, MacroCell = 6,4, keine Meter.
5. **Referenzbilder:**
   - `~/Dropbox/CLAUDE/KFB Claymation Reference/` (DioramaScenes A–I, FLOATING ISLANDS DESIGN);
   - Joyride `track-look.v5.js` (Paletten Canyon, Bikini-Bucht, O-Town; Kronen, Kissentürme);
   - `georg-doc/kayfabizarro` Branch `planning/style-reference-library-r1-2026-10-05` (Style-Reference-Library).
6. Paletten: `src/palettes.ts`.

## 0b · Georgs Entscheidungen 2026-10-08 (abends)

1. **Kein Kneten:** Die Kit-Modelle werden nicht rund geknetet, sondern richtig eingesetzt. Die „harten Kanten“ waren ein falsches Bauteil: ein Anschluss- bzw. Kachelstück am Rand statt einer Felsformation.
2. **Set-Hierarchie pro Insel** (korrigiert nach R2-Urteil): primär **Kenney Nature Kit zusammen mit Tiny Treats und KayKit**. Die Kenney-Mesa- und Felsstrukturen „funktionieren gut“. Quaternius und andere ergänzen *innerhalb* eines Bioms, mit einheitlichem Look. Mischen ist erlaubt, ohne Kneten.
3. **Keine Kachel- oder Anschlussstücke** (Kenney `cliff_*`, `ground_*`, `path_*`, `bridge_*`, Tile- und Connector-Teile) als Natur oder Felsen. Nur freistehende Einzelobjekte.
4. **Farbe semantisch statt willkürlich:** Farben leiten sich von natürlichen Farbschattierungen des Bioms ab und dürfen surreal verschoben sein, aber nicht willkürlich.
   - Stein kommt aus Boden und Fels der Insel: Wüste = Sandstein-Ocker, kein Lila.
   - Laub, Rinde, Blüte und Wasser haben je eine begründete Farbfamilie.
   - Die Joyride-Paletten sind Stimmungen und Harmonien; ihr Mapping auf Material-Rollen wird geprüft (Farb-Grammatik, §1).
6. **R2-Urteil (Georg, 2026-10-08):**
   - Farb-Grammatik passt („könnte funktionieren“), die Größen passen.
   - **Etherington-Probe FAIL, Konzept falsch:** Ein Fels liegt anders in der Landschaft als ein Strauch oder ein Ball. Er steckt tief im Gelände und wirkt schwer, als läge er lange dort. „Ein paar Blümchen am Rand“ sind Behelf, und ein falscher Schatten verrät falsches Liegen.
   - **Randblöcke**, die halb abgeschnitten sind oder von der Insel fallen müssten: verboten.
5. **Erdung zuerst beweisen:** Vor jeder Insel-Platzierung kommt eine Etherington-Probe. Ein Baum, ein Busch und ein Fels zeigen Eingraben, Kontakt und Überlappen, als Nahaufnahme. Erst nach Georgs PASS wird die Insel platziert.

## 1 · Konzept-Gate: vor jedem Platzierungs-Code

Ohne ein von Georg bestätigtes **Biom-Blatt** wird nichts platziert. Ein Blatt pro Insel bzw. Biom, eine Seite, Bilder statt Prosa.

| Feld | Inhalt | Prüffrage |
| --- | --- | --- |
| Geschichte | 2–3 Sätze: Wer lebt hier, was ist passiert, was soll man fühlen? Bezug zur Landmarke und zu den Bewohnern. | Erklärt sie, *warum* hier welche Pflanze steht? |
| Farbkonzept | **Farb-Grammatik:** je Material-Rolle (Boden, Fels/Stein, Rinde, Laub, Blüte, Wasser, Requisit) eine Farbfamilie, abgeleitet aus natürlicher Schattierung, surreal verschoben über die Palette. Begründung in einem Satz je Rolle. Dazu Haupt-, Neben- und Akzentfarbe aus der Insel-Palette. Verhältnis etwa 60/30/10. Welche Rolle trägt welche Farbe (Laub, Stamm, Blüte, Stein, Boden)? Hell-Dunkel-Staffel zur Landmarke hin. | Ist auf einen Blick klar, wohin das Auge geht? |
| Artenliste | 2–3 Baumarten, 1–2 Büsche, Steine, Gras, Akzent. **Jede Art mit Bild aus der Aufreihung** (`lineup.html`) und Zielhöhe in H. | Wurde jedes Modell einzeln angesehen, und passt es zur Geschichte? |
| Kit-Zuordnung | Primär KayKit + Tiny Treats; Kenney und Quaternius ergänzen innerhalb des Bioms. Nur freistehende Einzelobjekte, keine Kachel- oder Anschlussstücke. Kein Kneten. Umfärbung pro Material-Rolle nach Farb-Grammatik. | Liest es sich wie *eine* Welt, ohne Kneten? |
| Gruppen-Rezepte | 2–4 Rule-of-Three-Gruppen mit Anker, Stützen und Akzent, je mit Ort-Begründung: Wasser, Hang, Rand, Weg, Landmarke. | Hat jede Gruppe einen Grund, genau dort zu stehen? |
| Blickachsen | Von welchen 3 Kameras soll die Insel wirken? Was rahmt die Landmarke, was bleibt frei? | Bleiben Freifläche und Blick auf die Landmarke frei? |
| Referenz | 2–3 Bilder aus den Quellen, die die Stimmung zeigen. | Ist das Ergebnis mit der Referenz vergleichbar? |

Georg prüft das Blatt mit einem Blick (PASS/FAIL), bevor Code entsteht.

## 2 · Harte Regeln (automatisch messbar, jede Verletzung = FAIL)

| Nr. | Regel | Messung |
| --- | --- | --- |
| H1 | **Erdung je Objektart, aus Physik und Geschichte**, nicht eine Zahl für alles:<br>Fels und Findling liegen tief eingebettet (ein großer Teil im Boden), das Gelände zieht am Fels hoch.<br>Ein Strauch wächst heraus, ein Baum hat einen Wurzelanlauf.<br>Ein Requisit liegt auf (Kontakt ohne Einsinken).<br>Ein Randfels ist Teil des Inselkörpers oder steht vollständig auf.<br>**Das Gelände selbst wird verformt**, keine Erdhügel-Aufkleber. Nichts schwebt (Fuß ≤ 0 über Boden). | `__kfb.envCheck()` je Objekt + Bauweise-Blatt „Wie liegt was in der Landschaft“ |
| H2 | Nichts im Wegbett, im Wasser (außer Wasserpflanzen) oder in `field.isClear` | Zählung = 0 |
| H3 | Freifläche ≥ 30 % der Inselfläche | Flächenanteil |
| H4 | 2–4 Gruppen erkannt, keine Einzelgänger im Kern | Cluster-Analyse (Abstand 2–6 innen, ≥ 12 zwischen Gruppen) |
| H5 | Landmarke ist das höchste Element im Blickfeld; kein Baum vor ihr über 60 % ihrer Höhe | Höhenvergleich |
| H6 | Zielhöhen pro Rolle in H eingehalten (Environment-Spec §2) | `__kfb.sizes()` |
| H7 | Größenstaffel: wenige große, mehr mittlere, viele kleine Objekte (Anteile etwa 1 : 3 : 9) | Histogramm |
| H8 | Überlappungen (Gras, Kiesel, Krümel) nur, wo die Geschichte sie begründet. Als Zählregel ist das kein Ersatz für ein Erdungskonzept | Bauweise-Blatt, Kritiker K4 |
| H12 | Kein Randblock, der halb über den Rand ragt oder fallen müsste. Randfelsen sind Teil des Inselkörpers oder stehen vollständig auf | Überstand über `poly` = 0 |
| H9 | Ein Kit pro Gruppe; Kit-Mix auf der Insel nur, wenn das Biom-Blatt ihn erlaubt | Kit-Tags je Instanz |
| H10 | Budget: Natur ≤ 120 k Dreiecke und ≤ 16 Draw Calls pro Pass (4 Inseln) | `__kfb.profile()` |
| H11 | Keine geklonten Nachbarn: zwei gleiche Varianten mit gleicher Drehung im Abstand < 6 sind verboten | Zählung = 0 |

## 2b · Automatische Kompositions-Tests (nach Recherche P3, 2026-10-09)

Laufen aus den festen Kameras von §4 und auf den Platzierungsdaten. Jede Verletzung ist ein Befund für den Kritiker; E1–E3 sind FAIL.

| Test | Messung | Grenze |
| --- | --- | --- |
| E1 Schweben | Strahl nach unten von den unteren Ecken jeder Instanz | kein Fußpunkt > 0,003 H über dem Boden |
| E2 Einsinken | (Bodenhöhe − Mesh-Unterkante) / Mesh-Höhe | im Band der Objektart (`ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` §2), weder zu flach noch zu tief |
| E3 Tangenten | kleinster Abstand zweier Silhouetten im Bild | nicht zwischen 0 und 5 px (Überlappung oder Luft sind gültig) |
| E4 Gruppengröße | Cluster je Kategorie (Radius ≈ 0,4 H) | Anzahl 3, 5 oder 7; gerade Gruppen ≥ 2 sind ein Befund |
| E5 Symmetrie | Streuung der Positionen um die Gruppenachse, Kollinearität | keine Reihe aus ≥ 3, keine Spiegelsymmetrie |
| E6 Größenhierarchie | Volumen je Klasse groß, mittel, klein | Abweichung von 1 : 0,6 : 0,35 ≤ 0,15 (sonst „überladen“ oder „Sekundärformen fehlen“) |
| E7 Ursache | Fallobst, Fluff, Geröll | liegen unter bzw. hangabwärts ihres Ursprungs, nie verstreut |

## 3 · Bewertung (Kritiker, 0–10 je Kriterium)

Der Kritiker sieht **nur** Screenshots aus den Kameras in §4, dieses Regelwerk und das Biom-Blatt. Erklärungen, Code und Absichten der Bauenden sieht er nicht.

| Nr. | Kriterium | 10 = | 0 = |
| --- | --- | --- | --- |
| K1 | **Geschichte lesbar** | Ohne Text erkennbar, was hier los ist; das Biom-Blatt wird sichtbar eingelöst | Zufällige Deko ohne Bezug |
| K2 | **Farbkonzept** | 60/30/10 hält; Akzente führen zur Landmarke; Palette der Insel klar | Bunt durcheinander, Farben ohne Rolle |
| K3 | **Komposition** | Klare Gruppen mit Anker, Stützen und Akzent, Silhouette gebrochen am Rand, Freifläche atmet | Gleichmäßige Streuung, „hingewürfelt“ |
| K4 | **Erdung (Etherington)** | Eingraben, Kontakt (AO, Bodenfarbe) und Überlappen sichtbar an jedem Objekt | Aufgeklebt, schwebend, harte Fußkante |
| K5 | **Modell-Verständnis** | Jede Art steht dort, wo sie hingehört: Tanne am Hang, Weide am Wasser, Palme am Strand; Varianten (Herbst, Schnee, tot) passen zum Biom | Arten ohne Standortlogik |
| K6 | **Eine Welt** | Kits, Clay K2 und Palette lesen sich zusammen; nichts wirkt fremd | Stilbruch sichtbar |
| K7 | **Vielfalt ohne Rauschen** | Abwechslung in Größe, Drehung und Art, trotzdem ruhig | Monoton **oder** wirr |
| K8 | **Referenz-Nähe** | Hält den Vergleich mit den Referenzbildern aus dem Biom-Blatt aus | Kein Bezug zur Referenz |

| K9 | **Innerweltliche Logik / Storytelling** | Jedes Element hat erkennbar Herkunft und Grund (gepflanzt, gewachsen, abgelagert, gebaut, benutzt); die Insel erzählt ihre Geschichte aus jedem Winkel | Elemente ohne Grund, nur für einen Kamerawinkel arrangiert |

**Bestanden:** alle harten Regeln erfüllt **und** Mittelwert ≥ 8 **und** kein Kriterium unter 6 **und** K9 ≥ 7.

## 4 · Feste Kameras (pro Insel)

1. Übersicht schräg von oben (Preset `<islandId>`).
2. Augenhöhe Figur (1 H über Boden) vom Hauptweg auf die Landmarke.
3. Nahaufnahme Fuß einer Ankergruppe (Erdung).
4. Seitenansicht Rand (Silhouette).

Ausgabe: `node tools/shoot.mjs … --presets` mit diesen vier Kameras. Die Bilder gehen ohne Begleittext an den Kritiker.

## 5 · Ablauf und Stopp-Regel

1. Biom-Blatt → Georg PASS.
2. Bau.
3. Harte Regeln automatisch prüfen. Verletzung = sofort reparieren, ohne Kritiker.
4. Screenshots → blinder Kritiker (frischer Kontext) → Punkte und Mängelliste (Was? Wo? Welche Regel?). Der Kritiker schlägt keinen Code vor.
5. Reparatur gezielt nach Mängelliste → erneut 3–4.
6. **Stopp:**
   - Nach 2 Reparaturen ohne Punktgewinn am selben Kriterium hört die Sitzung auf und meldet Georg: Bilder, Punkte, vermutete Ursache.
   - Ein Kriterium unter 4 nach der ersten Runde heißt: Das Konzept ist falsch, zurück zu Schritt 1. Nicht weiterreparieren.
7. Georg sieht nur Inseln, die bestanden haben, oder einen Stopp-Bericht.

## 6 · Verboten

- Gleichmäßige Zufallsstreuung, Poisson-Teppiche, „ein bisschen von allem“.
- Arten ohne Standortlogik, Kit-Mix in einer Gruppe, Grundkörper-Pflanzen.
- Selbstlob im Bericht. Der Bericht nennt Messwerte und Punkte des Kritikers, keine Adjektive.
