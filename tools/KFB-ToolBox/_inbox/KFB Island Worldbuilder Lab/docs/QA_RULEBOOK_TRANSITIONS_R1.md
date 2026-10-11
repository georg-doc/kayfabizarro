# QA-Regelwerk Übergänge R1 · Straßen, Brücken, Gelände-Naht (RKIT)

Status: **VERBINDLICH für Bau und Kritik** · 2026-10-08 · Georg: „An den Übergängen wird nur gebastelt; die Probleme liegen auf der Hand.“
Gilt für die RKIT-Sitzung (Bauende), das Lab (Gelände-Naht) **und** den blinden Kritiker. Grundlage ist das von Georg freigegebene **RKIT-R3-Übergangs-Konzept v3** (Artifact `claude.ai/artifact/4Raze6mZEtHSYCkneTSkbb`, Abschnitte 3, 6, 7, 8, 9). Dieses Regelwerk macht daraus messbare Regeln und Punkte.

## 00 · Weltlogik zuerst (Georg, 2026-10-08, gilt vor allem anderen)

> „Es wird keinerlei Storytelling betrieben. Ihr baut es auf die billigste Art, die innerhalb der Anforderungen eine Lösung sein könnte, so dass es von einem Winkel gut aussieht. Ihr habt kein mentales Modell davon, was das innerweltlich ist. Jedes Element erzählt eine eigene Geschichte, genauso wie jede Insel und jede Residency ihre eigene Geschichte erzählt.“

**Pflichtfrage je Element, bevor es gebaut wird:** *Wer hat es gebaut oder wachsen lassen, womit, warum, und was erzählt es?*
- Gilt für jeden Katalog-Eintrag, jeden Bordstein- und Plattenverband, jede Brücke und jeden Anschluss.
- Die Antwort ist ein Satz im Bauweise-Blatt (Baugeschichte: wer baut das in der Welt, mit welchem Material, in welcher Reihenfolge). Beispiele: Ein Straßenbauer schneidet Passsteine, statt Lücken zu lassen; ein Inselvolk verankert eine Brücke im Fels, statt Platten anzuklipsen; ein Ortseingang ist ein gebautes Ende, kein Farbverlauf.
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
2. Konzept v3: Übergangs-Katalog A–G, Gelände-Naht §7, Look §8, Prüfungen §9, Entscheidungen §11.
3. Joyride **J17** (`georg-doc/kayfabizarro` · `tools/KFB-ToolBox/_inbox/KFB Joyride J17 · FB Cabrio/`) als Look-Vorlage, dazu die Joyride-Rückblicke T3/T4/S1:
   - wenige große Massen;
   - eine vorhersagbare Übergangsregel;
   - „Wulst wird Bordstein“, abtauchende Segmente;
   - nichts schmaler als ein Daumen, nichts aufgeklebt.
4. `docs/SCALE_CONTRACT_K2.md` mit den Werten für Track Core v0.14/0.15: Gehweg 5,2, Bordstein 0,35, Wand 1,3, Durchfahrt ≥ 5,8.
5. Vertrag `kfb.road-bed/1` (Lab ↔ RKIT; `public/roadbeds/`).

## 1 · Konzept-Gate: Übergangs-Atlas vor jeder Insel-Anlage

Jeder benötigte Katalog-Eintrag (A1 … F2) wird einzeln als Prüfstück gezeigt, als **Bildpaar**:

- links die J17-Vorlage bzw. ein Referenzbild;
- rechts das eigene Prüfstück, aus denselben 3 Kameras (§4).

Erst nach Georgs PASS am Atlas wird eine Insel-Anlage gebaut, und zwar nur aus Katalog-Übergängen.

**Darstellung (Georg 2026-10-09):** Ein Bauweise- oder Atlas-Blatt zeigt jedes 3D-Bauteil als echtes 3D-Bild in Knet-Material (Blender- oder three.js-Render) mit Querschnitt durch das Profil. Flache, abstrakte 2D-Skizzen reichen nur als Lageplan daneben. Am Straßenrand gibt es nur zwei Familien: **Bordstein** (Stadt) und **Joyride-Bande** (rot, gerundet, cartoonig). Ein drittes Randelement braucht eine eigene Baugeschichte und ein eigenes Design. Ohne beides wird es nicht gezeigt.

## 2 · Harte Regeln (automatisch messbar, jede Verletzung = FAIL)

| Nr. | Regel | Messung |
| --- | --- | --- |
| T1 | **Kein Gelände über der Straße:** 0 Gelände-Dreiecke über Fahrbahn, Bordstein oder Gehweg, auch an Kurven-Innenseiten | `__kfb.measureRoadBed(id)` am fertig geschnittenen Inselnetz |
| T2 | **Naht dicht:** gemeinsame Kanten ≤ 0,2 mm, kein Spalt Straße ↔ Gelände ↔ Rand | dito |
| T3 | **Jeder Wechsel ist ein Katalog-Körper:** Signaturwechsel ohne Katalog-Eintrag = Bau-Fehler, nicht still überblenden | Track-Core-Validator |
| T4 | **Ein Verlauf:** Alle Kanten eines Übergangs folgen einer gemeinsamen stetigen Kurve (C2), ohne Stufe, Endstück oder versetzt startende Teile | Kanten-Ableitungen je Übergang |
| T5 | **Material nur an Bandgrenzen** oder in einer weichen Clay-Mischzone. Keine „grünen Stücke“ auf Bordstein oder Wand | Material-ID je Dreieck gegen Bandrolle |
| T6 | **Highway nie direkt in Stadt oder Land** (B4), nur über Anschlussstelle oder Kartenrand | Graph-Prüfung |
| T7 | **Maße K2:** Gehweg ≥ 1,3 H, Bordstein ≈ 0,35, Wand ≈ 1,3, Durchfahrt ≥ 5,8, Spur 3,75 / 4,0 / 4,5; Stadtstraßen auf MC-Vielfachen | Profilwerte |
| T8 | **Querneigung:** Welt ≤ 4°, Kurven-Innenseite nie höher (Anti-Cologne) | Profil je Station |
| T9 | **Muster:** Platten 1,6 × 1,6 im Weltraster, Fugen durchgehend, Keilplatten ≥ 0,6, Bordsteine kürzen statt biegen | Muster-Prüfung |
| T10 | **Brücken (C1, C2, C4):** ein Körper, wächst aus dem Inselfels (gemeinsame Kontur, Spalt 0), freitragend mit leichter Kuppe; Pfeiler nur über Gelände und dann als Clay-Beine | Kontur-Abstand, Stützen-Zählung |
| T11 | **Seitliche Anschlüsse:** Jeder Inselweg endet an einem `anchor` (D2), kein Gehweg endet stumpf in der Wiese (F2), Furten mit Absenkungen (D6) | Zählung offener Enden = 0 |
| T12 | **Regression:** Joyride-RACE und S13 bleiben byte-gleich | Hash-Vergleich |

## 3 · Bewertung (Kritiker, 0–10 je Kriterium)

Der Kritiker sieht nur die Screenshots aus §4, dieses Regelwerk und die J17-Vorlagenbilder. Text der Bauenden sieht er nicht.

| Nr. | Kriterium | 10 = | 0 = |
| --- | --- | --- | --- |
| U1 | **Gebaut, nicht gebastelt** | Jeder Übergang wirkt wie ein bewusst geformtes Bauteil | Verformte Querschnitte, Keile, Flickwerk |
| U2 | **Vorhersagbarkeit** | Nach einmal Sehen weiß man, wie der nächste Übergang aussieht | Jeder Übergang anders, Rauschen |
| U3 | **Gelände-Anschluss** | Gelände läuft weich an die Böschung, Rand und Brückenwurzel teilen eine Form | Durchstoß, Spalt, Klotz auf dem Gelände |
| U4 | **J17-Look** | Große runde helle Bordsteine, große unregelmäßige Clay-Platten in Reihen, Knet-Fahrbahn, dicke runde Banden | Rollenfarben, dünne Bänder, scharfe Kanten |
| U5 | **Massen statt Bänder** | Wenige große Körper, nichts schmaler als ein Daumen | Viele dünne Streifen |
| U6 | **Brücke** | Wächst sichtbar aus der Insel, leichte Kuppe, liest sich als ein Körper | Deckplatte auf Klötzen, gerade Platte |
| U7 | **Lesbarkeit für Figur und Auto** | Gehweg, Fahrbahn, Furt und Einmündung sind in Figurmaßstab (H) sofort lesbar | Maßstab unklar |

| U8 | **Innerweltliche Baulogik** | Man sieht, wer es wie gebaut hat: Verlegeplan, Passsteine, Übergangssteine, Tragwerk und Verankerung sind lesbar, auch in Cartoon-Logik | Gepinselt, überlagert, angeklipst, ohne Bauweise |

**Bestanden:** alle harten Regeln erfüllt **und** Mittelwert ≥ 8 **und** kein Kriterium unter 6 **und** U8 ≥ 7.

## 4 · Feste Kameras (pro Prüfstück bzw. Anschluss)

1. Schräg von oben auf den Übergang (Ganzansicht).
2. Augenhöhe Figur (1 H) vom Gehweg aus, Blick entlang des Übergangs.
3. Bodennah quer zur Naht: Kurven-Innenseite bzw. Brückenwurzel von unten.

## 5 · Ablauf und Stopp-Regel

1. Atlas-Bildpaare → Georg PASS.
2. Bau.
3. Harte Regeln automatisch prüfen. Verletzung = sofort reparieren, ohne Kritiker.
4. Screenshots → blinder Kritiker (frischer Kontext) → Punkte und Mängelliste mit Katalog-ID und Regel-Nr.
5. Reparatur gezielt nach Mängelliste → erneut 3–4.
6. **Stopp:**
   - Nach 2 Reparaturen ohne Punktgewinn am selben Kriterium: Bericht an Georg mit Bildern, Punkten und vermuteter Ursache.
   - Ein Kriterium unter 4 nach der ersten Runde heißt: zurück an den Katalog-Eintrag oder das Konzept, nicht weiterflicken.
7. Georg sieht nur Bestandenes oder einen Stopp-Bericht.

## 6 · Zuständigkeiten

- **RKIT:** Track Core, Katalog-Körper, Atlas, `roadbed.json` und GLB.
- **Lab (Steuer-Sitzung):** Gelände-Naht (`applyRoadBed`), Rand-Aussparung, Weg-Anschluss an `anchors`, Messung `measureRoadBed`.
- **Environment:** hält `field.isClear` frei.
- **Kritiker:** eigene frische Sitzung, keine Schreibrechte am Code.

## 7 · Verboten

- Einen Querschnitt linear verformen statt einen Übergangskörper zu bauen.
- Fehlende Katalog-Einträge still überblenden.
- Gelände-„Vorschau“ statt Messung am echten Netz.
- Selbstlob im Bericht, nur Messwerte und Kritiker-Punkte.
