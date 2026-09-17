# KFB Kit Lab · Changelog (additiv)

Nur Zuwachs. Ältere Einträge bleiben stehen.

---

## S32 · 2026-09-17 · Clown-Inszenierung: drei Tiefenebenen statt einer Reihe

Die Vignette lag auf einem flachen z-Band (-1,35 bis 1,3) und las sich deshalb als Reihe — 21 Objekte brav nebeneinander. Behoben ohne ein einziges getauschtes oder skaliertes Objekt, nur über Positionen:

| Ebene | Inhalt |
|---|---|
| hinten (z -2,0 … -2,45) | zwei Ballontrauben, Schwebehöhen 2,25 bis 3,15 statt 2,0 bis 2,6 |
| dahinter-Mitte (z -0,55 / -0,95) | Ball und Reifen-Podest als Paar |
| Mitte (z 0,0 … 0,25) | Hauptpodest mit Figur, Ballonhund-Podest |
| vorn (z 0,82 … 1,25) | die zwei losen Ballonhunde am Podestfuß, davor Bomben und lose Keulen als Pointe |

Die Staffelungstiefe ist Bildabgleich gegen die Promo-Blende, keine gemessene Größe — wie die Ballonhöhen seit S5. Als OPEN-Punkt steht das schon da.

**Nachtrag S32b · die Vorderebene lag unter der Caption-Bande.** Erste Fassung schob Bomben auf z 1,85 und Keulen auf 2,10. Projiziert lagen die tiefsten Punkte bei Bildschirm-y 482 und 505 — und `#dockrow`, die HUD-Leiste, beginnt bei 475. Verdeckt war damit genau das, was als Pointe gedacht war, und zwar nicht behebbar durch den Nutzer: „Leiste ausblenden" klappt die Seitenspalte, nicht die Caption. Vorderebene auf z 0,82 bis 1,25 zurückgenommen, `pad` von 1,2 auf 1,3 erhöht. Gemessen nachher: Ballonhunde +71/+76 px über der Kante, Bomben +65/+68, Keulen +57/+60. Ein Zwischenstand lag bei Bomben +11 und Keulen **-8** — flach liegende Keulen reichen mit ihrem tiefsten Punkt näher an die Kante als eine stehende Bombe, gleiche z-Tiefe hin oder her. Erst die zweite Messung war grün — der alte Wert war für eine rund 1,7 Einheiten flachere Vignette gesetzt. **Eine Inszenierung nach vorn muss gegen die Oberkante der Leiste projiziert werden, nicht nach Augenschein beurteilt** — der sichtbare Bildbereich endet nicht am Canvas-Rand.

**Und noch ein Fall derselben Klasse, im selben Eintrag.** Die Tabelle oben stand VOR der zweiten Messung; den Nachtrag habe ich danach angefügt und aktualisiert, die Tabelle nicht. Ergebnis: ein Eintrag mit zwei verschiedenen Bereichen für dieselbe Ebene (0,82…1,5 in der Tabelle gegen 0,82…1,25 im Nachtrag), dazu zwei ungenaue Bandgrenzen. Das Muster ist präzise benennbar: **wenn eine Messung eine Zahl ändert, ist jede Stelle im GERADE geschriebenen Dokument betroffen, nicht nur die, an der man zuletzt getippt hat.** Korrigiert gegen die gebauten z-Zentren.

Kein Mechanismus berührt: alle Änderungen sind `p`-, `float`- und `pad`-Werte in `data/cast.js`. Die zwei `on:`-Stapel (Reifen auf seinem Podest, Ballonhund auf seinem) sind mitgezogen worden, damit Basis und Aufsatz denselben xz-Punkt behalten.

---

## S31 · 2026-09-17 · Achsen-Zuordnung statt Weltrichtung — und der Pivot sagt die Rolle

Drei Befunde aus einer Messung, in T-Pose, wie Georg vorgeschlagen hat. Und das Ergebnis ist ein Modell statt drei Einzelkorrekturen.

**Der handslot-Rahmen ist überall derselbe.** In T-Pose gemessen, bei Rig_Medium wie Rig_Large identisch:

| Slot-Achse (lokal) | zeigt auf | Bedeutung |
|---|---|---|
| X | Welt -X | außen, vom Körper weg |
| Y | Welt +Z | **vorn** |
| Z | Welt +Y | **oben** |

Damit ist „richtig ausgerichtet" keine Weltrichtung mehr, sondern eine **Zuordnung**: welche eigene Achse der Requisite ist ihr Wirkende, und auf welche Slot-Achse gehört sie. Neu: `hand.slotAxis: { from, to }` — eine lokale Drehung, die in JEDEM Clip gilt. Das ist der Unterschied zu `aim`, das nur in der Pose stimmt, gegen die es gerechnet wurde (S27 und S29 haben das je einmal gekostet). Identität bleibt die Regel — sie ist der Fall `from === to`.

**Blaster, Vorlage für alle Handfeuerwaffen.** Der Lauf läuft auf der eigenen +Z (gemessen: z von -0,246 bis +0,759), die Slot-Achse für „vorn" ist +Y. Unter Identität landet der Lauf deshalb auf „oben" — in T-Pose senkrecht nach oben (was für ein geschultertes Gewehr richtig ist, siehe Toy Soldier), an einem hängenden Arm aber quer vor den Bauch. Genau das war im Screenshot zu sehen. Zuordnung +Z → +Y, 90° lokal: die Waffe zeigt jetzt dorthin, wo die Hand hinzeigt.

**Cleric-Foliant — hier war die Zuordnung falsch, und der Fehler war die Analogie.** Ich habe die Blaster-Logik auf das Buch übertragen (Seitennormale +Z auf Slot-„vorn“), weil sie beim Lauf gestimmt hatte. A/B am gebauten Knoten gemessen: senkrechter Anteil der Seitennormale **0,53** mit Zuordnung gegen **0,85** unter Identität — die Zuordnung war schlechter, das Buch stand auf dem Buchrücken. Zurück auf Identität. **Welche Slot-Achse richtig ist, hängt an der Requisite, nicht am Nachbarfall** — und das entscheidet ein A/B, keine Überlegung.

Dazu eine Behauptung, die ich in drei Dokumente geschrieben habe und die mechanisch nicht stimmen kann: „Seiten kippen nicht mehr mit dem Handgelenk“. `slotAxis` ist eine feste LOKALE Drehung — die Requisite bleibt genauso handgelenk-gekoppelt wie unter Identität, es ändert sich nur der konstante Versatz. An der Kopplung ändert das Verfahren nichts.

**Dämonenherz — der Pivot sagt die Rolle.** Der Pivot liegt in **allen drei** Achsen mittig (x -0,469…+0,411, y -0,646…+0,576, z -0,369…+0,362). Ein zentral gepivotetes Objekt mit Halbausdehnung 0,44–0,65 kann in einer Faust mit Radius 0,269 nicht sitzen — es umhüllt sie. Der `push: 0,55` aus S22 hat das Symptom verschoben, nicht die Rolle korrigiert. Georg liest es richtig: das ist ein schwebendes Artefakt. Es steht jetzt frei über dem Beschwörungskreis, 0,685 von der Figur entfernt.

Beim Herzen war zudem der S22-Eintrag zu widerrufen, und der Widerruf hatte wieder eine Lücke: das Demon-Lord-Recipe trug weiter „brauchte push=0,55 … Handvolumen, nicht falscher Anker“, „Herz in der Hand“ und „Identität“ im OPEN-Punkt — also drei widerrufene Aussagen genau in der Leiste, die Georg liest. Mein eigener S30-Grep suchte `clip-biblio`, nicht `push=0,55`. **Die Regel greift nur, wenn man die Kernbegriffe DES JEWEILIGEN Widerrufs sammelt, bevor man greppt.**

Damit ist die Pivot-Regel aus S8 vollständig. Sie hatte bisher zwei Fälle, jetzt drei:

| Pivotlage | Rolle | Beispiel |
|---|---|---|
| am Objektboden | Standobjekt | Lorekeeper-Lesepult (S8) |
| an Griff oder Kante | Handrequisit | Schwerter, Streitkolben, Blaster |
| **mittig in allen Achsen** | **schwebendes Artefakt** | **Dämonenherz (S31)** |

---

## S30 · 2026-09-17 · Blaster rechts, Blade links — und der dritte ungeprüfte „geht nicht"

Georg: „einer der ultra heroes sollte wie in der Vorlage den blaster rechts und blade links halten." In S29 hatte ich das als unmöglich dokumentiert: beide Requisiten seien für `handslot.r` authored, zwei rechtshändige an einer Figur ohne gerechnete Ausrichtung nicht belegbar.

**Wieder ungeprüft.** Eine Runde nachdem derselbe Fehler beim Cleric-Folianten aufgefallen war, habe ich ihn wiederholt — diesmal nicht bei einem Anker, sondern bei einer Kombination. Alle vier Fälle mit reiner Identität gemessen (Idle_B):

| Requisite | Hand | eigene Langachse in der Welt | Unterkante | zum Kopf-Bone |
|---|---|---|---|---|
| Blade | rechts | [-0,09 / 0,02 / 1,00] | 0,274 | 0,633 |
| Blade | **links** | [-0,07 / -0,09 / 0,99] | 0,187 | 0,643 |
| Blaster | **rechts** | [-0,96 / 0,27 / -0,10] | 0,207 | 0,604 |
| Blaster | links | [1,00 / 0,06 / 0,08] | 0,252 | 0,589 |

Das Schwert sitzt links praktisch identisch wie rechts. Der Blaster zeigt aus dem hängenden Arm jeweils zur Gegenseite quer — anatomisch richtig, keine Ausrichtung nötig. Kein Bodendurchstich, kein Kopfkontakt in keiner der vier Kombinationen. Also: Blaster rechts, Blade links, beides Identität, wie im contents-Render.

Dazu die Rollen der zwei Figuren getauscht, damit jede ihre Vorlage zeigt: **Rot steht** (Idle_B) mit beiden Requisiten wie im contents-Render, **Blau landet** (Spawn_Ground) wie in der Promo. Der zweite Blaster bleibt abgestellt.

Was bleibt: der Blaster wird getragen, aber nicht gezielt. `Idle_B` lässt den Arm hängen. Eine Zielhaltung ist unbaubar, solange kein Schuss-Clip existiert — Clip-Lücke, nicht Attachment-Frage.

**Das Muster über drei Sprints:** S28 „der Foliant ist eine Ausnahme" (war an der falschen Hand), S29 „der Pack hat eigene Clips" (waren Duplikate), S29 „zwei rechtshändige Requisiten gehen nicht" (gehen). Dreimal habe ich aus einer nicht durchgeführten Messung einen Befund gemacht. Die Regel steht schon im RETURN — sie muss vor dem Schreiben greifen, nicht danach: **bevor „geht nicht" in ein Dokument kommt, muss die Gegenprobe im Protokoll stehen.**

Und der Widerruf hatte wieder eine Lücke, diesmal an der sichtbarsten Stelle: der RETURN-Header führte „pack-eigene Clip-Bibliotheken" weiter als Errungenschaft. Mein Sweep suchte `EIGENER CLIP-BIBLIOTHEK` und `Bibliothek hat den Clip nicht` — der Header schreibt es klein und anders. **Ein Widerruf-Grep geht case-insensitiv auf den Wortstamm (`clip-biblio`), nicht auf den Satz, den man selbst geschrieben hat.** Dazu zwei Strukturschäden derselben Schreibrunde behoben: die zwei Nachtrag-Blöcke standen in umgekehrter Reihenfolge (Nummern liefen 23 → 28,29,30 → 24–27) und sind jetzt eine aufsteigende Liste 24–30, und OPEN 29 war ein zerschnittener Splice mit hängendem Gedankenstrich.

---

## S29 · 2026-09-17 · Der Foliant war keine Ausnahme — er war an der falschen Hand

**Georg im Bild: der rechte Arm des dunklen Klerikers fehlt/ist verdreht, Buchausrichtung und Anker falsch. Und sein Verdacht war die Lösung:** „ich denke, das kann wie eine Waffe platziert werden, wenn die Ausrichtung des Buches stimmt."

Genau so ist es. Gegenprobe, reine Identität, beide Hände gemessen:

| Anker | Weltmaße | Seitennormale | Befund |
|---|---|---|---|
| `handslot.l` (S28) | 0,55 × 0,86 × 1,03 | [0,96 / -0,23 / -0,15] | quer, hochkant, Seitenkante zum Betrachter |
| `handslot.r` (jetzt) | 1,08 × 0,61 × 1,10 | **[-0,40 / 0,85 / 0,35]** | nach oben und leicht vor: aufgeschlagen wie in der Promo |

(Beide Vektoren an der ungedrehten Sondeninstanz gemessen; in der gebauten Szene, Figur auf r=-18 Grad, liest sich die rechte Hand als [-0,49 / 0,85 / 0,21] — dieselbe Aussage, y=0,85.)

Der Foliant ist für die **rechte** Hand authored, wie jede andere Series-6-Requisite. Ich hatte ihn an die linke gehängt, das Ergebnis als „dritte belegte Ausnahme von der Identitätsregel" dokumentiert und eine Ausrichtung dazugerechnet — also aus meinem eigenen Ankerfehler eine Regel-Ausnahme gemacht. Die Regel galt die ganze Zeit. **Erst die andere Hand probieren, bevor man eine Ausnahme erfindet.**

Damit fällt auch die `pull`-Konstruktion wieder aus dem Recipe. Der verdrehte Arm war ihre Folge: die CCD-Nachführung blieb 0,334 vom Ziel und hat den Arm dabei sichtbar verbogen. **Eine Nachführung, die ihr Ziel nicht erreicht, ist keine Haltung, sondern ein verbogener Arm.** Der Mechanismus bleibt in `lib/atlas.js` (er ist korrekt und misst jetzt auch die Handabstände), wird hier aber nicht gebraucht — Identität an der richtigen Hand reicht.

**Resident 21 · Ultra Turbo Hero Man** (Series 7, Character 2). Drei Modelle, zwei Texturen: Rot und Blau, zweiter Farbvarianten-Fall nach dem Cleric (7 Materialien der Figur getauscht — wer nach dem Bau über den Figurenknoten traversiert, zählt 8, weil das angehängte Schwert mitläuft; es behält seine eigene Textur, und das ist gewollt). Schwert 1,793 mit Langachse +Y, Identität an handslot.r. Blaster 0,59 × 0,654 × 1,006 mit dem **Lauf auf lokal +Z** — dieselbe Konvention wie das Toy-Soldier-Gewehr.

**Der Pack bringt eigene Clip-Dateien mit — und sie sind Duplikate.** `Animations/gltf/Rig_Medium/` enthält General (15) und MovementBasic (11). Namensweise gegen die geteilte Bibliothek verglichen: **15/15 und 11/11 identisch**, kein einziger zusätzlicher Clip. Spawn_Air, Spawn_Ground, Use_Item, Death_B, Hit_B liegen längst in der geteilten Bibliothek; die rote Variante nimmt `Spawn_Ground` von dort (source-Pfad geprüft). `loadClips` kann jetzt zusätzliche Wurzeln laden und entdoppelt nach Set/Name — hier trägt der Mechanismus **null** Clips bei und bleibt als Vorbereitung stehen. Der belegbare Befund ist ein anderer und nützlicher: **ein pack-eigener Animations-Ordner ist kein Hinweis auf zusätzliche Clips.** Die Packs liefern die geteilten Sets unverändert mit.

**Zur Blaster-Frage, geprüft statt vermutet: es gibt keine Schuss- und keine Lade-Animation.** alle 119 Clips der geteilten Bibliothek gegen shoot/gun/aim/reload/blast abgeglichen — Treffer sind ausschließlich `General/Throw` und `MovementAdvanced/Running_HoldingRifle` (ein Laufzyklus, keine Schusshaltung). Deshalb steht der Blaster abgestellt statt in der Faust: eine Waffe ohne Haltung in die Hand zu stecken heißt, die Pose zu erfinden.

**Nachtrag · achter Fall, und diesmal ein erfundener Befund statt einer veralteten Zahl.** Ich habe „erster Pack mit eigener Clip-Bibliothek" in vier Dokumente geschrieben, ohne die Prämisse zu messen: verglichen hatte ich die 15 Pack-Namen gegen einen früheren shoot/gun/reload-REGEX-Scan der geteilten Bibliothek — nie gegen deren General-Liste. **Ein Regex-Scan, der fünf Namen nicht enthält, beweist nicht, dass die Namen fehlen; er beweist, dass sie nicht auf „shoot" passen.** Dazu eine Zahl aus derselben Lücke: „134 Clips geprüft" — es sind 119. Und der neue Mechanismus trägt hier null Clips bei; er ist korrekt, seine Begründung war es nicht.

Der Widerruf selbst war dann auch noch unvollständig: vier Dokumente korrigiert, zwei CODE-KOMMENTARE stehen gelassen — die falsche Behauptung stand also weiter genau dort, wo man beim Lesen zuerst hinkommt. Ursache: ich habe die Korrektur über die Prosa-Anker der Dokumente gefahren statt über die Begriffe der Behauptung. **Nach einem Widerruf projektweit nach den Kernbegriffen greppen, Kommentare eingeschlossen.**

Dazu dieselbe Entscheidung wie beim Cleric-Streitkolben: die Promo zeigt Rot mit Schwert UND Blaster gleichzeitig, aber beide sind für handslot.r authored. Zwei rechtshändige Requisiten an einer Figur sind ohne gerechnete Ausrichtung nicht belegbar — und genau die hat diesen Sprint schon einmal einen verdrehten Arm gekostet.

---

## S28 · 2026-09-17 · Spielhaltung konstruiert statt gehängt · Mixed-Bag-Widerruf

**Drei Anforderungen, die sich widersprechen.** Georg am Screenshot: linke Hand muss am Hals sein, Gitarre näher am Bauch, rechte Hand über den Saiten und hoch/runter animiert. Alle drei gehen nicht, solange das Instrument an der Pfote hängt, wo der Clip sie hinstellt — `Holding_B` setzt die linke Pfote **15 cm weiter nach vorn** als die rechte. Eine Gitarre kann dann nie gleichzeitig in der einen Hand liegen und die Decke unter der anderen haben. Kein Winkel repariert das.

**Erst die Anatomie messen.** Querschnittsprofil der Gitarre entlang der Längsachse, 24 Scheiben:

| Bereich | lokal y | Breite |
|---|---|---|
| Kopfplatte | +0,14 … +0,36 | 0,247 |
| **Hals** | **-0,28 … +0,14** | **0,09–0,12** |
| Korpus | -0,92 … -0,28 | 0,26 … 0,50 |

Decke bei z = +0,043, Rücken bei z = -0,10. Diese Tabelle hat den S27-Wert erledigt: `grip 0,42` setzte die Pfote bei lokal y = -0,42 — mitten auf den **Korpus**, nicht an den Hals. Im Bild war genau das zu sehen.

**Die Abhängigkeit umgedreht.** Neue Mechanik `hold` + `reachChain` in `lib/atlas.js`: das Instrument wird im Körperraum gesetzt, dann werden **beide Arme** per CCD dorthin nachgeführt. Anker ist die **gemessene Bauchebene**, nicht die Schulter — der Rückenpunkt der Korpusmitte liegt 4 cm vor der an posierten Mesh-Vertices gemessenen Bauchfront (z = 0,333).

Ergebnis, alles nachgemessen:

| Prüfpunkt | Wert |
|---|---|
| Griffpfote | lokal [0 / **-0,14** / 0] — mittig auf dem Hals, seitlich exakt null |
| Anschlagpfote (Bauzeit) | lokal [-0,001 / **-0,561** / 0,090] — mittig auf der Decke, 4,7 cm vor ihr |
| Deckennormale | [-0,046 / -0,033 / **0,998**] — frontal |
| Korpus zum Bauch | Soll-Parameter am Ankerpunkt 4 cm; **gemessen 2,3 cm** an der hintersten Korpuskante (z 0,356 gegen Bauchfront 0,333), keine Durchdringung |
| Unterkante (echte Vertices) | **0,471** tiefster Stand über die Schleife, 0,484 höchster. Box3 meldet hier 0,398 — 7,2 cm zu tief |
| Restfehler Nachführung | Griffarm **0,000**, Anschlagarm **0,003** |
| Anschlagbahn | senkrecht 1,25 gegen **0,01** seitlich — **107 : 1**, Ausschlag 16,9 cm |
| Pfote über der Decke | **25 / 25** Abtastpunkten, an keinem dahinter |

**Zwei meiner eigenen Prüfmethoden waren falsch.** Das gehört hierher, weil beide zuvor grünes Licht gegeben haben:

1. **Der Durchdringungstest war blind für Durchdringung.** Er maß den Abstand zum nächsten Rumpf-**Vertex** — und ein Punkt tief im Körper ist von jeder Oberfläche weit entfernt. Die Gitarre saß 45 cm im Bauch und der Test sagte "frei". Ersetzt durch einen Ebenenvergleich im Aktor-Frame.
2. **Box3 ist bei gedrehten Requisiten kein Messwerkzeug.** `setFromObject` transformiert die acht Ecken der LOKALEN AABB und umhüllt damit bei der um 36° gekippten Gitarre einen Raum, der 7,2 cm tiefer reicht als jeder echte Vertex. Meine erste Korrektur der Bodenfreiheit ersetzte einen Momentwert (0,474) durch ein Box3-Minimum (0,398) und machte die Zahl damit schlechter statt besser. Extremwerte kommen jetzt aus dem Position-Attribut über `matrixWorld`: 0,471 tiefster Stand, 0,484 höchster. Dieselbe Fehlerklasse steckte in S5 hinter der Goth Girl auf dem Hocker und in S28 hinter dem Vertex-Abstandstest.
3. **Sollwerte sind keine Messwerte.** Das Laufzeit-Protokoll meldete "Korpusrücken 4,0 cm davor" — das war der Eingabe-Parameter `bellyGap` an einem Ankerpunkt, nicht die hinterste Kante (gemessen 2,3 cm), und stand im selben Satz wie das Wort "gemessen". `holdInstrument` misst beides jetzt nach und benennt Soll und Messung getrennt. Dieselbe Konflation stand auch bei der Korpusmitte: zurückgegeben wurde `bodyY`, das Ziel, statt der gebauten Höhe (0,797).
4. **Die Bauchfront muss an einer frischen Figur gemessen werden**, nur mit dem Basis-Clip posiert. Nach der Nachführung liegen Arme und Pfoten vor dem Bauch, ein max-z über alle Aktor-Vertices misst also die Pfote und nicht den Bauch.

**Die Reihenfolgefalle.** `mixer.stopAllAction()` stellt in three.js die gecachten Ausgangswerte der gebundenen Eigenschaften wieder her — die Bone-Werte von **vor** der Nachführung. Das Bauprotokoll meldete Restfehler 0,000, und im Bild stand der Arm woanders: das Protokoll war zum Zeitpunkt der Messung richtig, eine Zeile später hat das Framework die Messung zurückgedreht. Der alte Mixer wird jetzt fallen gelassen statt gestoppt, ein frischer bindet die nachgeführte Pose.

**Anschlagachsen gerechnet statt gesucht.** Für eine Drehung um die Achse a durch den Bone-Ursprung fährt die Spitze im Abstand r mit **a × r** — gesucht ist also a mit a × r parallel zur Anschlagrichtung, und das ist genau **a = normalize(r × d)**. Der alte Suchlauf über x/y/z konnte nur Hauptachsen wählen und nahm Bahnen mit 32–41 % Ausrichtung; mit der Formel liegen alle drei Gelenke bei **88–94 %**. Gelenke unter 60 % werden ausgeschlossen und ihr Streckenanteil neu verteilt — der Ausschluss wird berichtet, damit niemand später den fehlenden Schulteranteil sucht.

**WIDERRUF · Mixed Bag 1.** In S27 habe ich gemeldet, der Pack sei "ohne Modelle eingecheckt, 0 von 7 Dateien". **Das war falsch.** Die Baumansicht des Repos listet nur Dateien, die sie für importierbar hält, und filtert `.gltf`/`.bin` weg — ich habe dem Filterergebnis geglaubt statt dem Pfad, obwohl Georg genau darauf hingewiesen hatte. Über eine Inhaltssuche gezählt liegen dort **41 glTF-Dateien**, darunter `guitar_A` und `guitar_B`.

> **Verfahrensregel:** ein Werkzeug, das "nichts gefunden" meldet, hat nicht "nichts da" gemessen — nur "nichts, was ich zeige". Pack-Inhalt wird ab jetzt über eine Inhaltssuche gezählt, nicht über eine Dateiliste.

Die beiden E-Gitarren sind **geometrisch identisch**: gleiche 1385 Vertices, gleiche Bounding-Box, gleiche Puffergröße von 50428 Byte. Pink und Blau unterscheiden sich nur in der UV-Lage auf der gemeinsamen Palette-Textur. Sie teilen die Konvention der Akustikgitarre (Längsachse lokal Y, Pivot oben im Hals, Decke auf lokal Z) — Georgs Einschätzung stimmt, `hold` nimmt sie ohne Änderung. Sie stehen trotzdem erst mal abgestellt: ihr Querschnittsprofil ist nicht gemessen, und bei einer Flying V liegt die Hals-/Korpusgrenze anders als bei einer Akustikgitarre. Ein `gripLocal` ohne diese Messung wäre geraten — genau der Fehler, der in S27 die Pfote auf den Korpus gesetzt hat.

Maßstab: 1,883 lang gegen 1,272 der Akustikgitarre, Faktor 1,48. Nicht skaliert. Sie laufen auf `commit: 'main'`, weil Mixed Bag 1 erst nach dem gepinnten Asset-Commit eingecheckt wurde — die einzige unpinned Quelle im Cast, als OPEN ausgewiesen.

**QA-Seite** `tools/guitar-qa.html`: baut die Vignette, rendert aus vier Winkeln (vorn, Seite, oben, Dreiviertel-Nah) und prüft acht Punkte gegen die Anatomie-Tabelle. Alle acht bestanden.

---

## S28 · 2026-09-17 · Requisiten am falschen Bone · Cleric mit Farbvariante

**Georgs drei Warband-Punkte waren ein Befund, nicht drei.** Schild falsch platziert, Waffen nicht in der Hand, Animationen nicht an Arm/Hand gekoppelt — Ursache für alles: die Requisiten hingen am **handSlot**, die gezeichnete Pfote aber am **Arm-Bone**.

Beim skinned Original (PrototypePete) folgt die Pfote dem `handSlot` per Gewichten. Eine zusammengesetzte Legacy-Figur hat dagegen einen **rigiden Armklotz an genau einem Bone** — `armLeft`/`armRight`. Animiert ein Clip den handSlot relativ dazu, und das tun die Legacy-Clips, dann wandert der Bone und der Klotz bleibt. Gemessen unter Idle: **Schild 0,513 und Hammeraxt 0,548 neben der Pfote**, das Schwert zufällig 0,002 — der Zufall einer Pose, kein Beleg.

Und keine meiner S25–S27-Messungen hätte das finden können: ich habe Abstand zum Kopf, zum Banner und zum Boden geprüft. Nie den Abstand zur **Hand**. Das ist die Frage, die der ganze Auftrag „sitzt die Waffe in der Hand" eigentlich stellt, und sie fehlte im Prüfsatz.

Neu: `pawAnchor()` befestigt an dem Arm-Bone, der den Klotz trägt, und misst den Griffpunkt IM Klotz — die Vertices mit dem größten Abstand zum Bone bilden das Pfotenende, ihr Mittel ist der Griff. Damit sind Requisite und Pfote rigide dasselbe Stück.

| Requisite | Abstand zur Pfote vorher | nachher | zum Kopf | Unterkante |
|---|---|---|---|---|
| Schwert (orcA) | 0,002 | 0,005 | 0,228 | 0,116 |
| Schild (orcB) | **0,513** | 0,017 | 0,024 | 0,031 |
| Hammeraxt (orcB) | **0,548** | 0,007 | 0,026 | 0,088 |

Über sieben Clips gesweept ist der Abstand zur Pfote **in jedem Clip und zu jedem Zeitpunkt 0,017 oder besser** — vorher pose-abhängig bis 0,55. Das ist die Kopplung, die Georg gemeint hat. Preis dafür: der Kopf-Freiraum sinkt von 0,2 auf 0,024, weil die Pfote selbst innerhalb der Kopf-Silhouette liegt. Eine Requisite kann nicht gleichzeitig in dieser Pfote sitzen und weit vom Kopf weg sein; sie berührt ihn nicht, aber der Spielraum ist weg.

**Resident 20 · Cleric.** Fünf Modelle (Cleric.glb, Font, Mace, Shield, Tome) und **zwei** Texturen. Damit die erste echte Farbvariante im Cast: `skin` tauscht die Karte auf der Instanz — Material geklont, damit die erste Instanz unberührt bleibt, Farbraum und Filter von der Originalkarte übernommen statt geraten. 8 Materialien getauscht, zwei Kleriker aus einer Datei. Bisher hat der Atlas Zweittexturen nur erwähnt (animatronic_A, orcbrute_texture_B, monstrosity_texture_B).

**Die Buch-Pose ohne Buch-Clip.** In den 119 Clips gibt es keinen Lese-Clip — geprüft, nur Holding_A/B/C, Fishing_Cast, Running_HoldingBow/Rifle. Gebaut über neues `pull`: Foliant in der linken Hand, der rechte Arm per CCD an die **gemessene +x-Kante der Buch-Bounding-Box** nachgeführt (CCD-Restfehler 0,830 → 0,334). Kein getippter Zielpunkt — das Ziel ist eine Kante des Objekts selbst.

~~Der Foliant ist außerdem die dritte belegte Ausnahme~~ **(in S29 widerrufen: er war an der falschen Hand, die Identitätsregel galt)** — die dritte belegte Ausnahme von der Identitätsregel (nach Lorekeeper-Krummstab und Animatronic-Gitarre): unter Identität war seine Weltbox 0,52 breit und 1,00 tief — das Buch stand hochkant mit der Seitenkante zum Betrachter und war praktisch unsichtbar. Seine dünnste Achse (lokal z, 0,267 gegen 0,864 × 0,653) ist die Seitennormale; sie zeigt jetzt gerechnet nach oben und leicht zur Figur.

Schild mit `push: 0,16` — dieselbe Regel wie Black Knight (0,55) und Skeleton Warrior (0,18), niedriger, weil diese Hand kleiner ist.

**Nachtrag · siebter Fall derselben Klasse, diesmal mit klarer Ursache.** Zwei Zahlen dieses Eintrags waren beim Schreiben schon veraltet: der Buch-Restfehler stand mit 0,660 → 0,132 — gemessen, BEVOR der Foliant seine Ausrichtung bekam; die Ausrichtung hat das Buch gedreht, also wanderte die +x-Kante und mit ihr das Ziel (richtig: 0,830 → 0,334). Und die Sweep-Grenze stand mit 0,013 statt 0,017, gemessen vor der letzten grip-Änderung am Schild (0,1 → 0,14). Beide auf dieselbe Weise entstanden: gemessen, dann einen PARAMETER geändert, dann die alte Messung dokumentiert. Die S26-Regel „nach der Doku-Runde erneut laden“ fängt kaputte Dateien — nicht stille Zahlenverschiebung. Neue Regel: **nach der LETZTEN Parameteränderung neu messen, nicht nach der letzten Codeänderung.**

Dazu eine bessere Metrik, weil die Prüfung recht hat: der CCD-Restfehler sagt nur, wie weit die Armspitze von einem gerechneten Punkt blieb — er belegt nicht „beidhändig“. Was das belegt, ist der Abstand BEIDER Hände zum Buch: **rechts 0,030, links 0,123**. Die generierte Notiz nennt jetzt beides und sagt, welche Zahl die Aussage trägt.

---

## S27 · 2026-09-17 · Gitarre an der richtigen Hand · Anschlag-Loop in der Toolbox

**Die Gitarre hing an der falschen Hand.** S26 hatte den Neigungswinkel repariert und dabei den eigentlichen Fehler nicht gesehen. Der Pivot sitzt oben im Hals — und genau das sagt, welche Hand: eine Rechtshänder-Gitarre wird am Hals von der **linken** Hand gegriffen, die rechte schlägt an. Sie hing an `handslot.r`. Damit lief der Hals quer über die Brust in die Schnauze, und die Anschlagpfote hielt das Instrument fest.

Der Warnwert stand in meinem eigenen S26-Eintrag: **Kopfabstand 0,127**. Ich hatte ihn als „größter der acht geprüften Winkel“ abgehakt, statt zu fragen, warum alle acht schlecht waren. Alle acht waren schlecht, weil der Arm falsch war.

| | S26 | S27 |
|---|---|---|
| Slot | `handslot.r` | `handslot.l` |
| `aim` | [0,50 / 0,82 / 0,28] · 55° | [0,75 / 0,60 / 0,28] · 37° |
| `grip` | 0,45 | 0,42 |
| `roll` | 90° | 270° |
| Halsspitze → Kopf-Bone | 0,66 | **1,08** |
| Kopfabstand (Box) | 0,127 | **0,288** |

Roll wieder über die Flächennormale entschieden, acht Winkel: nur 225° (z=0,86) und 270° (z=0,91) richten die Decke nach vorn. **270°** gewinnt, weil die Normale dort mit x=-0,01 praktisch keine Seitenverkantung hat — bei 225° sind es x=-0,48. Gegengeprüft, dass die Aufteilung wirklich funktioniert: `handslot.r` liegt bei [-0,28 / 0,75 / 0,39] **innerhalb** der Gitarren-Weltbox. Die rechte Pfote ist am Korpus.

> **Lehrsatz S27** (Erweiterung von S26): Box, Längsachse und Flächennormale reichen nicht, wenn die Requisite am falschen Arm hängt. Der **Pivot** sagt, welche Hand — vor jeder Messung. Und drei Metriken sind ab jetzt Pflicht: Spitze gegen Kopf-Bone, freie Hand gegen Requisiten-Box, Unterkante gegen Boden.

**Anschlag-Loop · `strumClip()` in `lib/atlas.js`.** Die Bibliothek hat in 119 Clips keinen Instrumenten-Clip. Also gerechnet statt erfunden — und **additiv**: die Bewegung liegt als Delta auf den lokalen Quaternionen, die `Holding_B` an den Bones hinterlässt. Die geprüfte Haltung bleibt erhalten, sichtbar ist ausschließlich das, was dazukommt.

Die Drehachsen sind **gemessen, nicht getippt**: jede lokale Achse der Treiber-Bones wird in beide Richtungen um 5° probegedreht, die Weltverschiebung der Anschlagpfote auf die Anschlagrichtung projiziert; die größte Projektion gewinnt, und ihr Betrag liefert gleich den Faktor Grad → Zentimeter. Deshalb ist die Amplitude eine **Strecke**: „die Pfote legt 16 cm über den Saiten zurück“ ist nachprüfbar, „18° am Ellbogen“ nicht.

Gemessenes Ergebnis am Bären:

| Bone | Achse | Anteil | Ausschlag | Faktor |
|---|---|---|---|---|
| `lowerarmr` (Ellbogen) | -x | 9 cm | 12,2° | 0,72 cm/° |
| `wristr` (Handgelenk) | -x | 5 cm | 15,9° | 0,30 cm/° |
| `upperarmr` (Schulter) | -y | 2 cm | 3,3° | 0,72 cm/° |
| `spine` (Wippen) | -x | — | 2,5°/Schlag | 0,10 cm/° am Kopf |

55 % Ellbogen, 30 % Handgelenk, 15 % Schulter — so schlägt der Unterarm an und nicht der ganze Arm. **Abschlag 40 % der Periode, Rückweg 60 %**: eine symmetrische Sinuskurve klingt wie ein Metronom, nicht wie eine Hand. 96 BPM, 4 Schläge, 2,50 s Schleife.

Das Wippen läuft auf der **Wirbelsäule**, nicht auf den Hüften: die Hüften tragen die Beine, eine Hüftdrehung würde die gepflanzten Füße verschieben. Der Kopf hängt an der Wirbelsäule und nickt mit — ein eigener Kopf-Track wäre ein zweiter erfundener Wert.

Die Anschlagrichtung selbst ist gerechnet: senkrecht zu den Saiten und in der Deckenebene = **Kreuzprodukt aus Flächennormale und Längsachse**, Gegenrichtung für den Abschlag → [0,66 / -0,69 / -0,30]. Quergeprüft: identisch mit der Flächennormale bei `roll 0` — muss sie auch sein, weil `roll 270` die Normale um 90° in derselben Ebene dreht. Zwei Wege, eine Zahl.

Beide Clips laufen **disjunkt gesplittet**: der Anschlag treibt Ellbogen, Handgelenk, Schulter rechts und die Wirbelsäule, `Holding_B` behält alle übrigen Tracks. Kein Blend-Gewicht, keine Frage welcher Clip gewinnt — dieselbe Mechanik wie bei der geschichteten Pose des Skeleton Mage. `poseFreeze` wird bei einem Anschlag bewusst übersteuert: ein Anschlag, der friert, ist keiner.

**BLOCKER · Mixed-Bag-Gitarren nicht baubar.** Die beiden Flying V (pink, blau) sind auf `contents_A.png` und `contents_B.png` klar zu sehen — die Modelle liegen aber nicht im Repo. Unter `media/3D_Assets/KayKit_Mixed_Bag_1_FREE/` stehen nur `Textures/`, zwei PNGs in `Assets/gltf/` und die beiden Contents-Blätter; eine Regex-Suche nach gltf/glb/bin/fbx/obj über den ganzen Teilbaum trifft **0 von 7 Dateien**. Ohne Datei keine Messung, ohne Messung kein Pivot: dass sie dieselbe Anatomie teilen, ist nach Augenschein plausibel, aber unbelegt — und die Flying V hat einen sichtbar anderen Korpusschwerpunkt als die Akustikgitarre. Nichts ins Recipe geschrieben.

---

## S27 · 2026-09-17 · Arm um die Gitarre, Ausrichtung gegen die Basispose, Pete zieht ein

**Der Anschlagarm steckte im Gitarrenkorpus** — und die `hold`-Mechanik hat das nicht gemeldet, weil sie die falsche Frage stellte: geprüft wurde nur, ob der HANDSLOT sein Ziel erreicht (Restfehler 0,003 — grün). Wo Handgelenk und Pfote dabei landen, hat nie jemand gemessen. Nachgemessen in Gitarre-lokalen Koordinaten: `wrist.r` bei z = **-0,074**, `hand.r` bei **-0,006** — beide mitten im 0,143 dicken Korpus (Rücken -0,100, Decke +0,043). Der Handslot saß korrekt 0,053 vor der Decke; die Kette dahinter nicht.

Der Fehler war der Ansatz, nicht der Wert: eine 0,2 große Bärentatze lässt sich nicht mittig auf eine 0,143 dicke Gitarre legen, ohne sie zu durchdringen. Weiter nach vorn schieben löst es nicht, es lässt die Pfote schweben. Neu ist deshalb `strumX`, eine Verschiebung entlang der BREITENachse: der Anschlagpunkt liegt jetzt **außerhalb der Korpus-Silhouette** (lokal x -0,34 gegen Korpus-Halbbreite 0,248), und dann darf das Handgelenk hinter der Deckenebene liegen — es liegt neben dem Korpus statt darin.

Dazu eine neue Freiprüfung, die genau die Lücke schließt: pro Gelenk des Anschlagarms gilt **vor der Deckenebene ODER außerhalb der Silhouette**. Gemessen nachher, alle fünf frei, Abstand zur Silhouettenkante:

| Gelenk | außerhalb um |
|---|---|
| upperarm.r | 0,049 |
| lowerarm.r | 0,024 |
| wrist.r | 0,065 |
| hand.r | 0,081 |
| handslot.r | 0,092 |

**Legacy-Requisiten werden jetzt gegen die BASISPOSE ausgerichtet, nicht gegen die Anzeigepose.** Ein `aim` ist eine Weltrichtung, die in eine lokale Bone-Drehung umgerechnet wird — das Ergebnis hängt davon ab, wie der Bone in diesem Moment steht. Gegen eine Anzeigepose gerechnet sitzt die Requisite in genau dieser Pose richtig und in jeder anderen irgendwo. Neu: `hand.aimIn: 'BasePose'` setzt die Figur für die Rechnung kurz in die Basispose (12/12 Tracks, erste Keyframes direkt gesetzt — kein Mixer, der die Bindings des laufenden entwerten würde) und stellt danach zurück. Damit verhält sich die Legacy-Ausrichtung wie die authored Identität bei Series 6: rigide mit der Hand, plausibel in jedem Clip.

**Key-View-Prüfung über neun Clips**, Requisite gegen Kopf und Boden, je vier Zeitpunkte pro Clip:

| Clip | min. Abstand zum Kopf | min. Unterkante |
|---|---|---|
| BasePose | 0,183 | 0,026 |
| Idle | 0,198 | 0,026 |
| Walk | 0,158 | -0,023 |
| Cheer | 0,156 | 0,026 |
| Block | 0,073 | 0,026 |
| Wave | 0,032 | 0,026 |
| Run | 0,027 | 0,021 |
| Attack(1h) | 0,006 | 0,026 |
| HeavyAttack | 0,006 | **-0,226** |

Ruhe- und Geh-Clips sind frei, Schlag-Clips nicht — und das ist kein Attachment-Fehler, sondern Animation: bei einem Hieb fährt die Waffe naturgemäß am Kopf vorbei und in den Boden. Mit einer rigiden Befestigung ist das nicht behebbar, nur messbar. Als OPEN-Punkt vermerkt statt weggerechnet.

**Motion spielt jetzt alle Figuren einer Vignette.** Die Auswahl trieb nur den Haupt-Aktor; zweite Figuren (orcB, Animatronic_Normal, Farmer_B, die Skelette) sind als Signatur-Requisiten geführt und blieben stehen. Bespielt wird jetzt jede Figur mit eigenem `poseInfo`, mit Bindungsquote je Figur im HUD: "Walk (Legacy) · orcA 18/18, orcB 18/18". Wer nicht bindet, bleibt stehen und wird genannt. Und ein Warnsatz, wo er nötig ist: bei konstruktiv gehaltenen Instrumenten überschreibt jeder Clip die CCD-Armnachführung, die gemessene Haltung gilt in dieser Motion also nicht.

**Resident 19 · Prototype Pete.** Die Figur, mit der KayKit seine Legacy-Animationen ausliefert — derselbe SkinnedMesh, den `legacyAssemble()` bei der Orc Warband ausblendet, hier als eigener Bewohner. Damit stehen zwei Bauarten einer Rig-Klasse nebeneinander: Pete geriggt und komplett, die Orcs ungeriggt in vier Teilen. Bleistift (1,098, gleiche +Y-Konvention wie die Warband-Waffen) in der Rechten, Federmappe abgestellt.

Käse ja, Honig nein: `Cheese Block by Quaternius` liegt im KFB-Sammelordner und ist **1,87 × 1,87 × 1,87** — fast genau so hoch wie Pete (1,90). Deshalb als Landmarke gesetzt, nicht als Requisite, und nicht herunterskaliert; der Maßstab ist hier der Witz, nicht der Fehler. Honig gibt es im Repo nicht (über die Tree-API nach bee/hive/jar/honey/pot gesucht) — als Ersatz steht eine Biene aus GLB_cube-pets bereit, Fremdpack, ausgewiesen, per „Optional" abschaltbar statt stillschweigend eingebaut.

---

## S26 · 2026-09-17 · Gitarre ausgerichtet · Resident 17 Action Figure

**Die Gitarre lag waagerecht.** Georgs Befund am Screenshot, und er deckt einen Messfehler von S25 auf, nicht nur eine falsche Zahl. Ich hatte `Holding_B` über die Weltbox der Gitarre ausgewählt — `y 0,32–0,92 quer vor dem Körper` klang nach Spielhaltung. Tatsächlich beschreibt derselbe Kasten auch eine Gitarre, die **waagerecht nach vorn aus dem Bauch ragt**, und genau das war es.

> **Lehrsatz S26:** Eine Bounding-Box sagt, WO eine Requisite ist, nicht WIE sie liegt. Bei jeder Ausrichtungsfrage werden zusätzlich die **Längsachse als Weltrichtung** und die **Flächennormale** gemessen — zwei Zahlen, die eine Box prinzipiell nicht liefert.

Korrektur gerechnet, nicht gedreht bis es passte. Die Vorlage zeigt die Gitarre diagonal quer vor dem Bauch, Hals hoch nach außen, Fläche zur Kamera:

| Größe | Wert | Begründung |
|---|---|---|
| `aim` | [0,50 / 0,82 / 0,28] | 55° Neigung — die Diagonale der Vorlage |
| `grip` | 0,45 | verschiebt den Griffpunkt vom Hals Richtung Korpus: darunter hängen 0,47 statt 0,92. Ohne das steht die Gitarre im Boden, weil die Hand nur auf 0,75 liegt |
| `roll` | 90° | dreht die Fläche nach vorn |

Der Roll-Winkel ist über die Flächennormale ausgewählt, über acht Winkel geprüft. Bei 0/45/135/180/225/315° zeigt die Fläche seitlich oder nach hinten. Nur **90°** liefert eine nach vorn gerichtete Fläche (Normale [-0,29 / -0,15 / **0,95**]) — und hat mit **0,127** zugleich den größten Kopfabstand aller acht. Ergebnis: Gitarre y 0,22–1,56, Korpus 0,22 über dem Boden, freie linke Pfote auf dem Instrument, kein Gesichtskontakt.

Damit ist die Gitarre die **zweite belegte Ausnahme** von der Identitätsregel im ganzen Cast (nach dem Lorekeeper-Krummstab). Der Grund ist geometrisch, nicht ästhetisch: 0,92 Requisitenlänge unter einer Hand auf 0,75 Höhe lässt eine Diagonale ohne `grip`-Versatz nicht zu.

**Resident 17 · Action Figure — zwei Achsen, zwei Mechaniken.** Der Pack macht etwas, was im Atlas vorher nicht vorkam: er variiert eine Figur über Wechselteile. Das mentale Modell dazu ist **nicht** „vier Kopf-Modelle“, sondern eine Trennung:

**Achse 1 · Kopf = GEOMETRIE.** Jede Kopf-Datei enthält Schale, Gesichtsebene und Zubehör als **getrennte Geschwister-Meshes** und ist mit Pivot auf dem `head`-Bone authored — sie sitzt mit Identität. Gemessen: alle vier Köpfe exakt 1,085 × 1,205, Unterschied nur in der Tiefe (1,117–1,251), und das ist die Zigarre, die B und D mitbringen und C nicht. Identische Pivots, also verlustfreier Tausch.

**Achse 2 · Ausdruck = TEXTUR.** `actionfigure_faces.png` ist 1024² mit vier 512²-Kacheln. Aus den UVs gemessen, nicht aus einer Tabelle gelesen:

| Kopf | Kachel | Ausdruck |
|---|---|---|
| C | [0, 1] | entschlossenes Grinsen |
| D | [1, 1] | Schrei |
| B | [1, 0] | Lachen |
| — | **[0, 0]** | **ruhig, geschlossene Augen — von keinem Auslieferungskopf benutzt** |

Die freie Kachel ist der Beweis, dass das Modell stimmt: `head_calm` ist **dieselbe Datei** wie der getragene Kopf, nur mit `faceTile [0,0]`. Der Versatz wird aus den eigenen UVs gerechnet, funktioniert also auch auf jedem künftigen Kopf dieses Packs.

**Kopf Normal fällt aus dem Schema** und ist deshalb ausgewiesen: er hat **keine** Gesichtsebene. Sein Veteranengesicht ist in die Körpertextur gemalt (UV 0,011–0,328 / 0,047–0,588). Bei ihm ist der Ausdruck Geometrie-gebunden, `faceTile` greift dort bewusst nicht.

**Drei neue Recipe-Mechaniken, jede aus einem Defekt begründet:**

- `hide: [regex]` — KayKit legt Wechselteile als Geschwister in EINE Datei. Ein aufgesetzter Kopf braucht das Abschalten des mitgelieferten Originals, sonst stecken zwei Köpfe im selben Bone; und sein eigenes Stirnband muss weg, weil die Figur ihres schon trägt (zwei wären Z-Fighting).
- `faceTile: [col, row]` — Ausgangskachel aus den UVs gemessen, **Material und Textur vorher geklont**: `instance()` teilt beide zwischen Instanzen, ein Versatz an der Originalreferenz würde jedes Gesicht der Szene mitziehen.
- `actor.graft` — der aufgesetzte Kopf gehört zur FIGUR, nicht zu ihren Requisiten. Als Requisit wäre er über die Requisiten-Ebene wegschaltbar, und weil der eigene Kopf per `hide` aus ist, stünde die Figur dann **kopflos** da. Wechselgeometrie hängt als Kind des Aktors am Bone und erbt dessen Sichtbarkeit.

Die vier schwebenden Köpfe reproduzieren das Artwork: dort hängen sie als Explosionszeichnung in Kopfhöhe neben der Figur, nicht am Boden. Die Waffen und Granaten des Artworks gehören **nicht** zu diesem Pack und sind nicht nachgebaut, statt sie aus einem Fremdpack zusammenzusuchen.

---

## S25 · 2026-09-17 · Large-Rig-Maßstab korrigiert · Resident 16 Animatronic

**Die Large-Residents trugen Medium-Waffen.** Georgs Befund an den Vorlagen, und er trifft einen Denkfehler, der seit S9 im Atlas steht: ich hatte die `*_Large`-Dateien als „zweite Größenvariante zum Vergleich“ gelesen und die Basisdatei als Standardausrüstung. Genau umgekehrt.

Gemessen an derselben Pose (`Idle_A`), Medium gegen Large: Handabstand **0,849 gegen 2,352**, Kopf-Bone **y=1,228 gegen 3,116**, Figurhöhe **2,3–2,6 gegen 4,1–4,7**. Faktor ≈ 2. Und die Waffenpaare sind, über sechs Paare nachgemessen, **exakt 2×**:

| Requisite | Medium | Large |
|---|---|---|
| BlackKnight_Sword | 2,059 | 4,117 |
| BlackKnight_Shield | 1,245 | 2,490 |
| Monstrosity_BarndoorShield | 1,539 | 3,079 |
| Monstrosity_Pitchfork | 1,646 | 3,292 |
| Orc_Axe | 0,836 | 1,672 |
| Orc_Banner | 2,512 | 5,025 |

Das ist keine Deko-Variante, das ist die Größenzuordnung des Packs. Alle drei Vorlagen bestätigen es: Black-Knight-Promo (Schwert bis über den Kopf, Schild höher als der Rumpf), `October2025_Monstrosity.gif` (Scheunentor bis zum Knie), `August2025_OrcBrute.gif` (Banner so hoch wie der Ork). Getauscht bei Black Knight, Monstrosity und Orc Brute; die Medium-Dateien liegen jetzt als abschaltbarer Größenvergleich daneben.

Gegengeprüft statt angenommen: das Large-Schild der Monstrosity hängt an `handslot.l` (y=1,94) 1,55 nach unten und endet bei y≈0,39 — knapp über dem Boden, wie im Recap. Die Large-Gabel an `handslot.r` (y=1,37) endet bei y≈0,34. Kein Bodendurchstich.

**Der Fremdpack-Fall.** Keule, Trommel, Schlägel, Trinkhorn und Rucksack stammen aus dem Orc-Raider-Pack von 2023 und haben keine Large-Variante. Sie laufen jetzt auf `s: 2` — nicht nach Augenmaß, sondern mit dem Faktor, den Kay Lousberg selbst für seine Large-Dateien verwendet. Keule 1,62→3,23, Schlägel 0,86→1,71, Trommel 1,47→2,95 breit. Bleibt die einzige Atlas-Skalierung im Cast und ist im Recipe als solche ausgewiesen. Damit ist OPEN 10 aus S24 geschlossen. Orc-Brute-Ausstattung nach Georgs Vorgabe: **Keule, Kriegstrommel, Banner**.

**Resident 16 · Animatronic.** Zwei Zustände derselben Figur (Creepy defekt, Normal intakt) — zweiter Mehr-Aktor-Fall nach den Farmers. Rig_Medium, 23 Bones, Kopf-Bone y=1,228. Der Pack hat genau drei Modelle; die drei Gitarren der Vignette sind drei Instanzen einer Datei.

**Kein Gitarren-Clip in der Bibliothek** — alle 119 Clips geprüft. Statt eine Pose zu erfinden, wurden sieben Kandidaten jeweils MIT angehängter Gitarre gemessen: Weltbox der Gitarre, Abstand zur freien Hand, Abstand zum Kopf-Bone, Bodenabstand.

| Kandidat | Gitarre y | freie Hand | Kopf | Urteil |
|---|---|---|---|---|
| `Holding_B` @ handslot.r | 0,32–0,92 | 0,07 | 0,31 | **Spielhaltung (Normal)** |
| `Waving` @ handslot.r | 0,33–1,70 | 0,93 | 0,50 | **hochgerissen (Creepy)** |
| `Holding_C` @ handslot.r | 0,16–0,98 | 0,00 | 0,25 | verworfen: 1,14 nach vorn ausgelegt, zweite Hand steckt drin |
| `Holding_A` @ handslot.l | -0,12–1,25 | 0,38 | 0,12 | verworfen: zu dicht am Kopf, Gitarre im Boden |
| `Idle_A` / `Cheering` | 0,29–0,89 | 0,51 / 0,66 | 0,45 | verworfen: getragen, nicht gespielt |

`Holding_B` legt die Gitarre quer vor den Bauch und lässt die freie Linke 7 cm vom Hals — die beste gemessene Spielhaltung des Satzes. `Waving` hebt sie über den Kopf-Bone und streckt den anderen Arm aus: genau die Promo-Haltung des defekten Bären. Beide Gitarren auf reiner Identität, kein aim, kein push.

**Referenzbilder nachgeliefert.** Das blanke Platzhalter-Pixel bei Orc Brute und Monstrosity ist weg — beide Patreon-Recap-GIFs liegen jetzt unter `ref/atlas/`, Animatronic- und Black-Knight-Promo kommen aus dem Repo am gepinnten Commit. OPEN 9 aus S24 damit erledigt.

---

## S26 · 2026-09-17 · Legacy-Waffen steckten in den Gesichtern

**Georgs Screenshot zeigte, was drei Messreihen nicht gezeigt hatten:** beide Orc-Warband-Waffen liefen senkrecht durch die Gesichter. Die Zahlen aus S25 waren alle richtig — Bodenabstand, Bindungsquote, erreichte Ausrichtung — und haben den Defekt trotzdem nicht erfasst, weil keine davon nach dem Kopf gefragt hat.

**Ursache ist die Chibi-Proportion, nachgerechnet:** die handSlots liegen auf y=0,21 und nur **0,35** von der Körpermitte, der Kopf ist **1,44 breit** und beginnt bei y=0,62. Eine Requisite, die aus dieser Hand senkrecht nach oben zeigt, *muss* durch den Kopf gehen — sie müsste 0,35 seitlich gewinnen, bevor sie 0,41 gestiegen ist, also mindestens 40° aus der Senkrechten laufen. Mein S25-Ziel war "nach oben, leicht nach vorn" ([0,1 / 0,97 / 0,22]): geometrisch der schlechteste mögliche Wert.

Neu gesetzt sind 50–58° nach außen, Richtung gegen die gemessene Körperachse der jeweiligen Figur gerechnet (nicht gegen die Weltachse — beide Orcs stehen gedreht): Schwert [-0,72 / 0,67 / 0,18], Schild [0,8 / 0,56 / 0,22], Axt [-0,78 / 0,59 / -0,19]. Damit liegen die Waffen wie in der Promo neben der Silhouette statt davor.

**Die Freiprüfung selbst war der zweite Fehler.** Box-gegen-Box meldete alle drei Waffen weiter als "im Kopf" — auch das Schwert, das mit **0 von 711 Vertices** im Kopfbereich vollständig frei lag. Ein langes diagonales Objekt füllt seine achsenparallele Box kaum aus, und der Kopf ist eine gerundete Blase in einer eckigen Box: zwei leere Boxecken überlappen, die Objekte nicht. Hätte ich dem Boxtest geglaubt, hätte ich eine korrekte Lösung weiter "korrigiert". Geprüft wird jetzt der kleinste Abstand zwischen den echten Vertex-Wolken:

| Requisite | Abstand zum Kopf | Abstand zum Banner | Unterkante über Grund |
|---|---|---|---|
| Schwert (orcA) | 0,304 | 1,269 | 0,053 |
| Schild (orcB) | 0,245 | 1,882 | 0,027 |
| Hammeraxt (orcB) | 0,208 | 0,785 | 0,096 |

Dritte Variante derselben Lehre: **Box3 lügt** — S9 bei posierten SkinnedMesh, S23 bei der Kamera-Einpassung, jetzt bei der Kollisionsfreiheit diagonaler Objekte.

**Dazu eine Aufstellungskorrektur:** orcB steht auf x=1,95 statt 1,5. Mit der nach außen gekippten Axt in der INNEREN Hand reichte die Klinge vorher bis an den Bannerfuß; jetzt 0,79 Abstand.

Offen bleibt, was keine Zahl löst: die Waffen hängen tiefer als in der Promo, weil die handSlots des Animations-Rigs auf Bauchhöhe der statischen Warband-Arme gar nicht liegen. `grip` hebt an, die Proportion bleibt.

**Nachtrag: der Doku-Schreibvorgang hat den Atlas erlegt.** Meine Batch-Ersetzung in `data/cast.js` hat das abschließende Komma eines Array-Eintrags mitgefressen — Syntaxfehler, Modul lädt nicht, Residentenliste leer, ganzer Atlas weiß. Nicht nur die Warband: alle 18 Residents. Und ich habe es nicht bemerkt, weil ich in dieser Runde **erst gemessen und danach dokumentiert** habe; alle Messungen liefen gegen die intakte Datei, der Schaden entstand nach der letzten Prüfung. Regel daraus: nach der Doku-Runde noch einmal laden, nicht nur nach der Code-Runde. Ein Doku-Commit kann eine Datenquelle zerstören, wenn Prosa in einer .js-Datei liegt.

Im selben Zug eine vierte stale Zahl: die Notes begründeten den Schild-Hub weiter mit `grip=0,22` und einer Rechnung für die SENKRECHTE Ausrichtung („0,14 unter den Boden") — beides aus der in diesem Eintrag verworfenen Version. Jetzt: grip 0,24 (Schild) und 0,20 (Axt), begründet mit den gemessenen Unterkanten 0,027 und 0,096.

---

## S25 · 2026-09-17 · Dritte Rig-Klasse: Rig_Legacy

**Die Legacy-Packs laufen nicht auf einem kleineren Rig, sondern auf einem anderen.** Gemessen an `KayKit_AnimatedCharacter_v1.2.glb`: **sechs** Bones (Body, Head, armLeft, handSlotLeft, armRight, handSlotRight) gegen 23 bei Rig_Medium und Rig_Large, und **30 Clips in EINER Datei** statt in sieben Set-Dateien. `loadClips()` hat dafür einen eigenen Zweig bekommen, keine Set-Schleife.

**Und die Legacy-Figuren sind gar nicht geriggt.** `character_orcA.gltf`: 0 Bones, 0 Skins. Stattdessen vier getrennte Teilgruppen — Body, Head, ArmLeft, ArmRight — in Bind-Pose-Weltlage. Die erste Bindungsmessung war **0/16 Tracks**, und dieser Nullwert war kein Defekt, sondern der Beweis: eine Legacy-Figur wird nicht bespielt, sie wird ZUSAMMENGESETZT. Rig laden, Platzhalter PrototypePete ausblenden, die vier Teile an die passenden Bones hängen. Neu in `lib/atlas.js`: `legacyAssemble()`, Recipe-Option `legacy: { rig }`.

Der Ausgleich ist nicht getippt: `skeleton.boneInverses[i]` IST die Inverse der Bind-Weltmatrix des Bones. Ein Teil in Bind-Weltlage bekommt genau diese Matrix als lokale Transform und sitzt exakt. Kein einziger Offset-Wert im Recipe.

Zwei Fehler auf dem Weg, beide lehrreich:

**Erstens: parts.children fand nur ein Viertel.** 1/4 Teile attachiert, Head und beide Arme "fehlten". Sie fehlten nicht — sie sind GESCHACHTELT, Kinder von Body, nicht Geschwister. Die flache Namensliste der Sonde hatte mich getäuscht (Traversal-Reihenfolge liest wie eine flache Liste). Zweite Konsequenz aus derselben Schachtelung: erst alle vier samt Bind-**Welt**matrix sammeln, dann umhängen — beim Umhängen ändert sich die Elternkette, und eine danach gelesene Weltmatrix ist die falsche.

**Zweitens: ich habe eine laufende Animation vermessen.** Unter Identität lagen Schwert, Axt und Schild flach — so die erste Messung, bei `poseFreeze: false`. Requisitenlage mitten in einem Clip ist aber kein Beweis für Attachment-Mechanik, sondern ein Standbild aus einer Bewegung; die gerechnete Ausrichtung stimmte zum Zeitpunkt der Rechnung und der Clip hat sie danach weitergedreht. Gegenprobe an **gefrorener** Idle-Pose: Schild 0,27 hoch statt 0,95, eigene Y-Achse waagerecht nach vorn ([0, 0,02, 1]); Schwert 0,69 statt 1,80. Der Befund hielt also — aber erst die zweite Messung durfte ihn belegen.

**Damit ist Rig_Legacy die einzige Klasse, in der die S18-Identitätsregel nicht gilt.** Der Grund ist eine Pack-Grenze, keine Schlamperei: Rig und Requisiten kommen aus zwei verschiedenen Legacy-Packs. Kay hat die Warband-Waffen für die statischen Warband-Arme gezeichnet, nicht für die handSlots des Animations-Packs — dort zeigt die lokale Z-Achse nach oben und Y nach vorn, während alle Requisiten ihre Langachse auf +Y tragen. Series 6 liefert Figur und Requisiten im selben Pack, deshalb gilt Identität dort. Korrektur über `axis: [0,1,0]` + `aim` + `roll: -90` (Schildfläche zeigte nach hinten; +90 war das falsche Vorzeichen, gemessen gegen die Blickrichtung des Orcs [-0,31, 0, 0,95]) und `grip` gegen Bodendurchstich (Axt lag 0,20 unter Grund, Schwertknauf 0,07).

**Resident 18 · Orc Warband.** Zwei Orcs am gepflanzten Kriegsbanner, Schwert rechts beim kleineren (1,81), Schild und Hammeraxt beim größeren (2,10). Kleinste Figurenklasse der Welle — das Rig ist 1,90 hoch gegen 3,12 Kopfhöhe beim Orc Brute. Drei Orc-Generationen im Atlas: Legacy, Raider (2023), Brute (2025); drei Bauarten, drei Maßstäbe.

Nebenher zwei Pin-Befunde: der Legacy-Ordner existiert am S5-Commit **nicht** (404 geprüft, nicht angenommen) — eigener Pin `10a7fdce`, erster Resident mit Pfaden aus zwei Commits. Und Legacy arbeitet ohne Texturblätter: die Farben kommen aus benannten Materialien (GreenLight, Red, WoodDark, Metal).

**Offen:** Die Promo zeigt rechts einen Orc mit Bärenkopf-Helm. Den gibt es im Pack nicht — die Tree-API listet genau zwei Figuren und vier Requisiten. Promo-Kunst ohne Modell, bewusst nicht nachgebaut. Und die Requisiten hängen tiefer als in der Promo: die handSlots liegen auf y=0,21, die statischen Warband-Arme hielten ihre Waffen auf Bauchhöhe. `grip` hebt an, die Chibi-Proportion bleibt.

Nummerierungs-Korrektur (nachgetragen): dieser Eintrag trug „Resident 16" — die 16 war schon an den Animatronic vergeben. Maßgeblich ist ab jetzt die ENSEMBLE-Reihenfolge in `data/cast.js`; darin ist die Warband die **18.**, Pete die **19.** Neues Werkzeug: `tools/legacy-rig-probe.html` (Bones, Clips, Materialien, Bindungsquote je Clip).

**Nachtrag, vierter Fall derselben Klasse.** Die Prüfung hat in genau diesem Eintrag zwei falsche Zahlen gefunden: orcB stand mit 2,13 in Prosa und Recipe — das ist die Box aus Figur PLUS angehängten Requisiten, die Figur allein ist 2,10 hoch. Derselbe Akkumulator-gegen-Messung-Fehler, den S23 für die HUD-Breite behoben hat, diesmal in einem Satz über die Figurenhöhe. Und dasselbe Recipe trug zwei widersprüchliche Höhenpaare: 1,76/2,05 in den Notes (die UNposierten Packmaße der Sonde) gegen 1,81/2,13 in den OPEN-Punkten. Jetzt einmal, posiert, mit dem Packmaß ausdrücklich als solchem: 1,81 / 2,10 (unposiert 1,76 / 2,05).

Außerdem eine generierte HUD-Notiz korrigiert — derselbe Bug wie der S21-Köcher: der push-Satz behauptete pauschal „Identitäts-Drehung beibehalten", auch wenn dieselbe Requisite zusätzlich `aim` und `roll` trägt. Für den Legacy-Schild war das schlicht falsch (0,1 geschoben UND ausgerichtet UND -90° gerollt). Der Satz nennt jetzt nur noch die Verschiebung, wenn eine Ausrichtung mit im Spiel ist.

---

## S24 · 2026-09-17 · Witch-Korb abgesetzt · Residents 14 & 15


**Das Pilzkörbchen hing der Witch vor dem Gesicht.** Befund von Georg am Bild, nicht aus einer Messung. Ursache ist eine Kombination, die die Strukturregel nicht abdeckt: der Korb-Pivot sitzt am Korbboden (er baut sich also nach OBEN auf), und `handslot.l` liegt unter `Holding_B` auf Kinnhöhe. Identität ist hier formal korrekt attachiert und trotzdem falsch im Bild.

Korrektur ist kein Dreh- und kein Push-Wert, sondern ein Rollenwechsel: der Korb steht abgesetzt am Boden (`p [0,72 / 0,95]`), das leere Körbchen ist auf `[1,75 / 0,55]` weggerückt. Damit ist der Besen das einzige Handrequisit der Witch, und die Zahl der Hand-Befestigungen sinkt von 15 auf 14. Die Promo zeigt den Korb getragen — ein echter „Korb am gesenkten Arm" bräuchte eine Pose mit hängender Linker; das bleibt offen statt per Offset vorgetäuscht.

**Falscher Blocker, korrigiert im selben Zug.** Ich habe `media/3D_Assets/…` lokal gesucht, 404 bekommen und daraus geschlossen, die Assets fehlten. Falsch: `loadAsset()` lädt über `raw.githubusercontent.com` am gepinnten Commit — der lokale Ordner ist gar nicht der Ladepfad. Lehre: bevor „Datei fehlt" behauptet wird, den LADEWEG lesen, nicht das Dateisystem.

**Resident 14 · Orc Brute.** Rig_Large (Handoff-Signatur `d3658fc0…`), Kopfhöhe 3,12. Der Brute-Pack selbst hat nur vier Modelle: Axt und Banner, je in zwei Größen. Trommel, Schlägel, Keule, Trinkhorn und Rucksack kommen aus dem **Orc-Raider-Pack** (Juli 2023) — ausgewiesenes Fremdpack, gleiche Fraktion.

`Idle_A` statt einer Kampfpose, und zwar gemessen begründet: die Pose hängt beide Arme seitlich herab (`handslot.r` [-1,18 / 1,26 / 0,20], `handslot.l` [1,17 / 1,27 / 0,22]) — genau die Haltung, in der Keule und Trommelschlägel ohne Drehkorrektur sitzen. `Melee_2H_Idle` führt beide Hände vor die Brust und hätte die zwei Requisiten gekreuzt. Beide Handrequisiten laufen auf reiner Identität, kein aim, kein push.

Erste Aufstellung hatte den Rucksack zu nah: seine Oberkante (0,92) und das untere Keulen-Ende (0,89) überlappten auf 3 cm. Um 0,55 nach außen und nach vorn versetzt, gemessen nachgeprüft statt nach Augenmaß.

**Resident 15 · Monstrosity.** Rig_Large, gleicher Zuschnitt wie Black Knight: Figur, Schild, Waffe, je in zwei Größen. `Melee_Blocking` ist der einzige Rig_Large-Clip, der den linken Arm mit dem Schild nach vorn hochführt. Schild mit `push: 0,5` — eine Stufe unter den 0,55 des Black Knight, weil die Monstrosity-Faust flacher modelliert ist. Die Mistgabel braucht keinen Push: `handslot.r` liegt auf y=1,37, die Gabel reicht 0,51 unter ihren Pivot und bleibt 0,85 über dem Boden.

Nachgemessen an der gebauten Szene: Schild y 1,16–2,72 bei z 1,73–1,99, Kopf-Bone bei z 0,40 — kein Gesichtskontakt. Kein Bodendurchstich bei beiden Residents.

Beide Packs haben **kein Promo im Repo**, nur Modelle und Texturblätter. Statt ein fremdes Bild als Referenz zu führen, steht ein leeres Pixel in `reference.src` und der Grund im Label. Die Positionen von Trommel, Banner und Rucksack sind damit gesetzt, nicht gegen eine Vorlage geprüft — als OPEN-Punkt vermerkt.

**Ensemble jetzt 15 Residents, 106 Objekte.** Gemessen (nicht akkumuliert):

| Ansicht | sichtbare Objekte | Breite |
|---|---|---|
| Alles | 106 | 103,65 |
| Kulissen aus | 63 | 94,17 |
| Kulissen + Requisiten aus | 15 | **67,94** |

**Nebenbefund zur Werkzeugkette.** Die Notiz in `github.md`, Modell-Binaries erschienen nicht in Tree-Listings, war zu allgemein formuliert: der Connector filtert .glb/.gltf heraus, die GitHub-Tree-API listet sie vollständig. Über sie sind die acht Pfade beider Packs ohne den 916-Asset-Shard belegt worden. Neues Werkzeug: `tools/orc-monstrosity-probe.html` (Maße, Rig_Large-Clipliste, Bone-Weltpositionen je Kandidatenpose).

---

## S23 · 2026-09-17 · Kamera-Einpassung ignorierte das Seitenverhältnis

Der Kulissen-Switch aus S22 hat die Reihe von 88,6 auf 53,2 komprimiert — auf dem Schirm kam davon nichts an, weil die Kamera den Gewinn wieder verschenkte. `frame()` rechnete:

    const radius = size.length() / 2;
    const dist = (radius * pad) / Math.sin(vfov / 2);

Das passt die **Bounding-Sphere-Diagonale** gegen das **vertikale** Blickfeld ein und ignoriert `camera.aspect` vollständig. Bei einem breiten flachen Motiv ist die Diagonale ≈ die Breite — eine 53 Einheiten breite Reihe wurde also behandelt, als müsste ihre BREITE in die HÖHE des Blickfelds passen. Ergebnis: Kamera 48 % zu weit draußen, Reihe füllte 66 % der Leinwand, jede Figur 28 statt 41 Pixel.

Neu: horizontales Blickfeld aus Seitenverhältnis ableiten, Motiv-Ausdehnung auf die Blickebene projizieren, beide Achsen gegen ihr eigenes Blickfeld rechnen und das Maximum nehmen. Zusätzlich ruft `frame()` jetzt selbst `resize()` auf — ein Panel-Umschalten ändert die Leinwand, bevor der ResizeObserver feuert, und `frame()` rechnete dann mit einem veralteten Seitenverhältnis (das allein waren noch 85,7 statt 50,5 Einheiten Abstand).

Gemessen nachher: Kameraabstand 50,5 bei 47,2 benötigt (Differenz = die 1,06 Pad-Reserve), **93 % Breitenfüllung**. Das war nicht ensemble-spezifisch — jede Vignette, die breiter als hoch ist, war betroffen (Farmers, Clown).

Außerdem: die HUD-Breite kam aus dem Layout-Akkumulator statt aus einer Messung. Der Fehler war größer als zunächst angenommen und nicht auf den einen überzähligen Abstand am Reihenende reduzierbar — er wuchs mit der Zahl eingeblendeter Objekte, weil der Akkumulator die Slot-Breiten aufsummiert, während eine Vignette ihren Slot über- oder unterragen kann: 92,55 statt 88,57 bei voller Ansicht (3,98 Differenz), 53,54 statt 53,22 im komprimierten Zustand (0,32). Die Breite wird jetzt an der sichtbaren Box gemessen, Abweichung 0,00 in allen drei Zuständen.

Dritter Fall von dokumentierter Zahl, die von der Szene abwich — nach S11 (Daten) und S21 (generierte Prosa) diesmal die HUD-Anzeige. Und bei der Korrektur gleich der vierte: die Beweistabelle in S22 und im RETURN trug weiter genau die Akkumulator-Werte, die dieser Eintrag als falsch ausweist. Beide Tabellen stehen jetzt auf den gemessenen Werten.

---

## S22 · 2026-09-17 · Kulissen-Switch im Ensemble · Residents 12 & 13

**Kulissen-Switch gebaut — mit dem Teil, der wirklich zählt.** Die Ebenen-Schalter wirken jetzt auch im Ensemble. Der erste Versuch war wirkungslos: Objekte verschwanden, die Breite blieb (88,57 → 86,97), weil `arrange()` die Slots nach den VOLLEN Maßen beim Bauen vergeben hatte — die Figuren standen weiter in ihren zu breiten Lücken. Neu: `respace()` verteilt aus den **sichtbaren** Maßen neu (Sichtbarkeit inklusive Eltern-Kette geprüft, nicht nur das Mesh-Flag).

| Ansicht | sichtbare Objekte | Breite |
|---|---|---|
| Alles | 91 | 88,57 |
| Kulissen aus | 54 | 79,03 |
| Kulissen + Requisiten aus | 13 | **53,22** |

Bei 53,2 für 13 Figuren trägt der Vergleich wieder — Black Knight und Demon Lord ragen sichtbar heraus. (Sichtbar wurde das erst nach der Kamera-Korrektur in S23.)

**Resident 12 · Skeleton Mage.** Rig_Medium, 2,63 hoch. Schädelstab identisch attachiert, keine Richtungsvorgabe nötig — anders als beim Lorekeeper-Krummstab, und diesmal gegengeprüft statt angenommen. Schlankster Resident der Welle: ein Requisit.

**Resident 13 · Demon Lord.** Georg hatte die Größenklasse vorab benannt, die Messung bestätigt sie: **5,79 × 4,62** gegen 5,77 × 4,69 beim Black Knight — Rig_Large. Diesmal von Anfang an richtig gesetzt, statt erst an einem kollabierten Mesh zu merken, dass Rig_Medium nicht passt (S9/S10). Idle_A bindet 52/52 und deformiert korrekt. Der Beschwörungskreis ist mit 7,81 × 7,81 das breiteste Einzel-Asset der Welle.

~~Das Dämonenherz brauchte `push: 0,55` — dieselbe Schild-Regel: in der Large-Tier-Faust verschwand es fast vollständig. Handvolumen, nicht falscher Anker.~~ **(in S31 widerrufen: es war der falsche ANKER, nicht Handvolumen. Zentraler Pivot = schwebendes Artefakt; das Herz hängt jetzt frei über dem Kreis.)** Die Regel greift damit über Schilde hinaus für jedes kompakte Handobjekt an einem großen Rig.

---

## S21 · 2026-09-17 · Panel-Text korrigiert, Ensemble-Pfad nachgeprüft

**Generierte Notiz behauptete Unsinn.** Der Köcher-Hinweis im Rogue-Panel las "aus der Faust geschoben" — der Köcher hängt aber am `chest`-Bone, nicht in einer Hand. Der Satz war in `lib/atlas.js` fest verdrahtet und nahm an, jedes `push`-Ziel sei ein Handslot. Genau auf dem Resident, der die erste Nicht-Hand-Befestigung einführt, und genau in dem Satz, an dem ein Leser diese neue Anker-Klasse verstehen soll. Jetzt verzweigt die Formulierung am aufgelösten Bone-Namen (`handslot` → "aus der Faust", sonst "vom Bone X weg"), und die Achse wird als lesbarer Vektor `[0, 0, 1]` statt als `001` gerendert.

Das ist dieselbe Fehlerklasse wie in S11 (Panel-Zahlen, die der laufenden Szene widersprachen) — diesmal nicht in den Daten, sondern in generierter Prosa. Der Anspruch "jede Panel-Angabe ist gemessene Evidenz" gilt auch für Sätze, die der Code selbst schreibt.

**Ensemble-Pfad nachgeprüft**, der letzte ungetestete Zweig der Sequenz-Sperre aus S20: 11 Mitglieder, 86 Objekte, genau eine Gruppe in der Szene, kein Bleed-through. Dabei sichtbar geworden und als OPEN notiert: bei 79,4 Einheiten Breite bleiben je Figur rund 20 Pixel — der Maßstabsvergleich, für den das Ensemble gebaut ist, wird von seiner eigenen Breite aufgefressen. Lösungsvarianten stehen im RETURN, entschieden ist keine.

Stale-Angabe in S19 korrigiert ("alle zehn Residents" → "alle Residents der Welle").

---

## S20 · 2026-09-17 · Schild-Anker verstanden · Resident 11 · Skeleton Rogue

**Georgs Frage nach dem Schild-Anker beantwortet, durch Messen statt Vermuten.** Der Pivot von `Skeleton_Shield_Small_A` liegt bei z von **-0,045 bis +0,112** — also praktisch auf der **Rückfläche** des Schilds. KayKits Anker ist damit genau der richtige: Schildrücken an der Hand. Dass der Arm trotzdem durchsteckt, liegt nicht am Anker, sondern daran, dass die Hand **Volumen vor dem Bone** hat — die flache Schildebene schneidet durch Knochen und Panzerhandschuh.

Daraus wird eine Regel-Klasse statt zwei Einzelfälle: **Schilde brauchen immer einen Schub entlang ihrer Normale in Höhe der Handdicke, nie ein Neudrehen.** Black Knight `push: 0,55` (große Panzerfaust), Skeleton Warrior `push: 0,18` (schmale Skeletthand) — beide frontal gegengeprüft, Buckel frei.

**Resident 11 · Skeleton Rogue.** Armbrust-Pivot sitzt am Schaft, Waffe reicht 1,14 nach +Z — identisch attachiert zeigt sie von sich aus nach vorn, kein Nachdrehen (KayKit-Konvention, gemessen). Der Köcher hängt am `chest`-Bone mit Schub nach hinten: **erster Nicht-Hand-Anker im Atlas**, weil der Rig keinen Rücken-Bone hat.

**Zur Armbrust-Frage: es gibt keinen Lade- oder Spann-Clip.** Über alle 119 Clips der geteilten Bibliothek geprüft und zusätzlich die vier pack-eigenen Animationsdateien geöffnet — die sind reine Duplikate der General/MovementBasic-Sets. Ein Armbrust-Zyklus existiert nirgends. Drei Haltungen durchprobiert und per Screenshot verworfen: `Melee_2H_Idle` hebt die Hände vor den Schädel (Waffe kreuzt das Gesicht), `Running_HoldingBow` beugt den Oberkörper so weit vor, dass die Armbrust Kopf und Rumpf verdeckt. Gesetzt ist `Idle_A` — Armbrust hängt frei an der Seite, klar lesbar. Eine echte Schusshaltung bleibt als OPEN stehen.

---

**Nebenbefund, echter Bug behoben:** Beim Umschalten zwischen Residents konnten zwei Vignetten gleichzeitig in der Szene landen — Goth Girls Boxe und Mikrofonständer standen in der Rogue-Szene. Ursache: Builds laufen asynchron und dauern teils über 10 s; ein langsamerer, früher gestarteter Build fügte seinen Root erst NACH dem `clearStage()` des neueren hinzu. `show()` hat jetzt eine Sequenz-Sperre (`showToken`) und verwirft veraltete Builds. Gegengeprüft: genau eine Vignette in der Szene.

---

## S19 · 2026-09-17 · Identität als Regel, drei belegte Ausnahmen

Der S18-Rundumschlag war zu grob: das Strippen per Regex hat auch zwei Korrekturen entfernt, die tatsächlich getragen haben — und nur vier der zehn Residents waren danach nachgesehen. Beides nachgeholt.

**Wiederhergestellt, jeweils mit sichtbarem Defekt begründet:**
- **Black-Knight-Schild** — die Panzerfaust ragte wieder durch den Mittelbuckel (dritter Auftritt desselben Symptoms). Die Drehung war nie das Problem, nur der Abstand. Neu in `lib/atlas.js`: `hand.push` — verschiebt eine Requisite entlang einer eigenen Achse, **ohne** sie neu zu drehen. Schild sitzt jetzt 0,55 aus der Faust, frontal gegengeprüft.
- **Lorekeeper-Krummstab** — lag unter Identität flach am Boden wie ein fallengelassener Stock (Vertikalspanne 0,78 bei 2,2 Länge). `aim` + `s: 0,65` zurück: Fußpunkt 0,16, Haken 1,63, Kopf bei 1,23 — aufgestützt wie in der Promo. Die einzige Requisite im Cast, die eine echte Richtungsvorgabe braucht.
- **Farmers-Forke** — Zinken 0,39 unter dem Boden. `push: 0,62` entlang Bone-(-Y), jetzt 0,014 darüber.

**Alle Residents der Welle vermessen und gesichtet** (nicht vier): kein Bodendurchstich mehr, Minimum y ≥ -0,014. Nebenbefund zur Methode: der Kopf-Abstand über achsenparallele Bounding-Boxen ist bei langen Requisiten wertlos — eine waagerecht gehaltene Muskete umschließt den Kopfbereich in der Box, ohne ihn zu berühren. Dafür bleibt nur der Blick.

Die Strukturregel selbst steht: Identität ist der Standard, diese drei sind die dokumentierten Ausnahmen, die die Regel ausdrücklich zulässt.

---

## S18 · 2026-09-17 · Strukturfehler gefunden: Hand-Requisiten brauchen gar keine Ausrichtung

Georg hat zu Recht abgebrochen — 15 Waffen einzeln per Chat-Runde geradezuziehen skaliert nicht. Statt den 16. Wert zu drehen eine Strukturannahme geprüft: `handslot.l`/`handslot.r` sind von Kay Lousberg als **Befestigungspunkte** gebaut, und die Requisiten-Pivots sind auf genau diese Bone-Orientierung authored.

**Test:** Axt und Schild des Skeleton Warriors mit reinem Identitäts-Transform attachiert — keine Drehung, kein Offset. Beide saßen sofort korrekt: Axt in der Faust seitlich heraus, Schild am Arm gegriffen, kein Clipping, kein Floaten, keine Tarnung gegen die Schulterplatte.

**Konsequenz:** Das gesamte `aim`/`roll`/`grip`-System hat gegen die Konstruktion des Packs gearbeitet. Alle **15 Hand-Befestigungen** im Cast sind auf `hand: { of, bone }` reduziert, 10 obsolete Tuning-Notizen entfernt, die Staff-Sonderskalierung (s=0,65) gestrichen. Gegengeprüft: Clown (Hammer + Keule), Toy Soldier (Gewehr + Trompete), Witch (Besen + Körbchen), Skeleton Warrior (Axt + Schild) — alle sauber, ohne einen einzigen Zahlenwert.

Das erklärt rückblickend die ganze Kette von S11 bis S17: Kante-statt-Fläche, Faust-durchs-Schildloch, Klinge-im-Schnabel, Axt-verschmilzt-mit-Schulter — alles Symptome derselben Ursache, nämlich dass die Requisiten aus ihrer authored Lage herausgedreht wurden. Regel für neue Residents: **erst Identität, eine Extra-Drehung braucht nur, was sichtbar nicht sitzt.**

---

## S17 · 2026-09-17 · Resident 10 · Skeleton Warrior (erster Pack außerhalb Series 6)

Erster Bewohner aus `KayKit_Skeletons`, einem eigenständigen Pack außerhalb Series 6 — eigene Root, eigener Ordneraufbau, auf `main` gepinnt statt auf den Handoff-Commit. 23 Bones, Rest-Höhe 2,59 — normale Rig_Medium-Größe, kein Large-Tier-Fall wie Black Knight.

Vor dem Ausliefern per Screenshot geprüft, nicht nur gemessen: die Axt verschwand zunächst komplett aus jeder Kamera-Ansicht. Ursache war keine falsche Ausrichtung — sie saß nah am Körper und verschmolz optisch mit der runden Schulterplatte (gleiche Form, ähnliche Farbe, direkt übereinander), unsichtbar nicht weil falsch platziert, sondern weil nicht *unterscheidbar*. grip=0,75 hebt sie klar über die Schulter. Schild sitzt sauber (Faust nicht sichtbar, Fläche nicht kantig) — direkt aus den bereits gelernten Black-Knight-Lektionen übernommen.

Rogue, Mage und Minion (drei weitere Charaktere desselben Packs, gleiche geteilte Waffen: Blade, Crossbow, Staff, zwei Schildgrößen) als nächste Kandidaten vorgemerkt.

---

## S16 · 2026-09-17 · Schild endgültig frei von der Faust

grip=0,35 aus S14 reichte nicht — die Faust war weiterhin sichtbar durchs Mittelloch des Schilds, per Screenshot bestätigt statt vermutet. grip=0,55 schiebt sie vollständig dahinter. Vier Versuche für diesen einen Wert (0,9 → 0,2 → 0,35 → 0,55); ab jetzt Screenshot vor jeder Freigabe, nicht nur am Ende.

---

## S15 · 2026-09-17 · Ganze Welle im Bild geprüft, nicht mehr Resident für Resident

Auf Georgs Ansage reagiert: Screenshot zuerst, Zahlen nur zur Bestätigung — und alle neun Residents in einem Durchgang statt über mehrere Nachrichten verteilt.

**Witch-Besen korrigiert.** Kreuzte Gesicht und Hutkrempe, weil die Haltehand direkt unter dem Kopf sitzt — jede aufrechte Ausrichtung läuft dort zwangsläufig am Gesicht vorbei. Jetzt fast waagerecht seitlich abgelegt (Ziel [0,92, 0,3, 0,15]), klar am Kopf vorbei.

**Caveman-Pose war ein Namensfehler, kein Ausrichtungsfehler.** `Sit_Floor_Idle` klingt nach aufrechtem Sitzen am Boden — ist im Rig_Medium-Satz tatsächlich ein Zurücklehnen mit angezogenen Beinen. Erst beim Hinsehen aufgefallen: die Figur lag flach statt am Feuer zu sitzen. Ersetzt durch `Melee_Unarmed_Idle` (stehend, Keule vor dem Körper) — funktioniert zuverlässiger als der Versuch, eine Sitzhaltung zu erzwingen, die es in dieser Form nicht gibt.

**Rest der Welle geprüft, nichts weiter gefunden:** Goth Girl, Clown, Toy Soldier, Farmers, Lorekeeper, Black Knight, Avian Swordsman — alle Hand-Requisiten sitzen sauber, keine Kopf-/Gesichts-Kollisionen, keine Kante-statt-Fläche-Fälle.

---

## S14 · 2026-09-17 · Schild endgültig, T-Pose als Prüfmethode getestet und verworfen

Georg lieferte die offizielle Black-Knight-Promo mit einer expliziten T-Pose-Referenz. Genutzt, um den Schild isoliert zu prüfen (T-Pose ist symmetrisch, keine Verdeckung durch Armbeugung) — dabei aufgefallen: grip=0,2 aus S13 ließ die eigene Faust sichtbar durchs Mittelloch des Schilds ragen. grip=0,35 schiebt sie vollständig dahinter.

**Versuch, die Requisiten an T-Pose statt an der Weltrichtung festzumachen — verworfen.** Eine an T-Pose eingefrorene lokale Rotation folgt zwar korrekt der Hand-Bone-Drehung (physikalisch "richtig" für eine starr gehaltene Waffe), aber Melee_Blocking beugt Handgelenk und Ellbogen so anders als die gestreckte T-Pose, dass Schwert und Schild in der tatsächlich angezeigten Pose regelrecht umknickten. Zurück zur gerechneten Weltrichtung (`aim`), die gegen die ANGEZEIGTE Pose abgeglichen bleibt. Lehre: T-Pose ist eine gute Methode, um die FORM einer Requisite isoliert zu prüfen (keine Verdeckung, keine Bone-Verzerrung) — aber keine geeignete Ziel-Pose für die Hand-Befestigung selbst, wenn die Anzeige-Pose stark davon abweicht.

---

## S13 · 2026-09-17 · Dritter Korrekturdurchgang: visuell statt gemessen

Zahlen-Whack-a-Mole gestoppt. Beide Fälle diesmal per Screenshot-Vergleich gelöst, nicht per Distanzmessung.

**Avian-Schwert:** hing zuvor quer über den Schnabel. Neue Richtung [0,3, -0,9, 0,3] lässt die Klinge nach unten-außen hängen — sauber am Körper vorbei, volle Klingenfläche sichtbar.

**Black Knight:** die eigentliche Ursache war nicht Schild-Rotation oder -Abstand — beide waren bereits richtig. Die Standard-Kamera (`keyArt.manualCamera`) blickte aus einem Winkel, der den Schwertarm hinter dem Torso verschwinden ließ und den Schild in die Bauchpanzerung hineinschob. Kamera auf einen Blickwinkel gedreht, der beide Waffen gleichzeitig zeigt (`pos: [-3.2, 2.4, 8.5]`, `target: [0.2, 1.8, 0.3]`) — Schild und Schwert jetzt beide sauber im Bild, keine Requisiten-Werte mehr angefasst.

---

## S12 · 2026-09-17 · Zweiter Korrekturdurchgang: Schild-Abstand, Avian-Schwert am Schnabel

**Black Knight Schild** — S11 hatte die Verdeckung durch die Schulterplatte richtig erkannt, die Korrektur aber übers Ziel hinausgeschossen: grip=0,9 löste den Schild komplett vom Arm ab (0,9 Einheiten Abstand zur Hand, sichtbar freischwebend). grip=0,2 hält ihn nah am Griff und trotzdem frei von der Schulter.

**Avian Swordsman Schwert** — Ziel [0,62, 0,55, 0,55] schwang die Klinge diagonal nach vorn-oben direkt durch den Schnabel. Neues Ziel [0,85, 0,5, -0,1] schwingt seitlich nach außen statt nach vorn — dieselbe Diagonal-Hieb-Silhouette, ohne den Kopf zu kreuzen.

Beide Fehler waren Übersteuerungen der jeweils vorherigen Korrektur, keine neuen Ursachen — Anfasser-Werte einzeln gegen den Körper gemessen statt nur "in die andere Richtung" geschätzt.

---

## S11 · 2026-09-17 · Waffen-Check: Avian-Schwert-Roll, Black-Knight-Schild-Abstand

**Avian Swordsman · Schwert zeigte die Kante statt der Klinge.** Position/Richtung waren korrekt (Hilt nah an der Hand, Spitze diagonal nach vorn-oben) — aber ohne `roll` präsentierte die Klinge ihre 0,106 dünne Kante zur Kamera statt der 0,562 breiten Fläche, sah wie ein Splitter aus. `roll: 90` dreht die Klinge um ihre eigene Länge, jetzt volle Fläche sichtbar, deckungsgleich mit einer Diagonal-Schlag-Haltung.

**Black Knight · Schild-Rotation war korrekt, Position nicht.** Weltachsen-Messung bestätigte die Flächen-Normale zeigt exakt nach vorn — der Schild steckte nur zu nah am Körper und wurde von der eigenen, überdimensionierten Schulterplatte verdeckt (sichtbar als Sichel-Rest statt Rund-Schild). `grip: 0,9` schiebt ihn entlang derselben Achse nach vorn frei — jetzt rund, mit sichtbaren Buckel-Nieten wie im Referenzbild.

Lehre: eine Requisite kann geometrisch exakt ausgerichtet sein und trotzdem falsch aussehen, wenn (a) ihre Flächen-Achse keinen `roll` bekommt (Klinge zeigt Kante statt Fläche) oder (b) sie zu dicht an der eigenen Anatomie sitzt (eigene Rüstungsteile verdecken sie). Beide Fehlerklassen sind jetzt an zwei konkreten Fällen belegt, nicht nur vermutet.

Übrige Waffen/Requisiten der Welle (Toy Soldier Gewehr/Trompete, Caveman Keule/Speer/Axt, Farmers Forke, Witch Besen, Lorekeeper Krummstab) im Schnelldurchlauf gegenkontrolliert — keine weiteren Kante-statt-Fläche- oder Verdeckungs-Fälle gefunden.

---

## S10 · 2026-09-17 · Lorekeeper-Fix · Black Knight korrigiert (Rig_Large) · Resident 9

**Lorekeeper-Stab, zweiter Versuch.** Erste S9-Korrektur (Ziel [0,72, 0,62, 0,32]) behob das Steckenbleiben im Kopf, kippte den Stab dabei aber quer durch den Raum bis zum Lesepult — überkorrigiert. Jetzt fast senkrecht ([0,18, 0,97, 0,12]), auf 65 % skaliert, grip=0,28: Fußpunkt bei y=0,15 (Bodenhöhe), Hakenspitze bei y=1,62 (knapp über Kopfhöhe 1,23) — gegen die Vorlage abgeglichen.

**Black Knight lief auf der falschen Rig-Familie.** S9 hatte den Kollaps unter `Idle_A` (Rig_Medium) korrekt erkannt, aber falsch behoben — mit einer Bind-Pose-Handkorrektur statt der eigentlichen Ursache. Georg bestätigt: Black Knight gehört zur selben Größenklasse wie **Orc Brute und Demon Lord** — **Rig_Large**, nicht Rig_Medium. Gegengeprüft: `Rig_Large_CombatMelee.glb` (34 Clips) → `Melee_Blocking` bindet 69/69 **und deformiert korrekt** — Schild hoch in der Linken, Schwert griffbereit in der Rechten. Kein Bone-Hack mehr nötig, sobald die richtige Rig-Familie gewählt ist.

Lehre für den Atlas: 23 identische Bone-NAMEN heißen nicht dieselbe Rig-Familie. KayKit führt mindestens zwei Größenklassen (Rig_Medium, Rig_Large) mit identischer Namenskonvention aber unterschiedlicher Skelett-Geometrie — Track-Bindung nach Namen bleibt blind dafür.

**Resident 9 · Avian Swordsman** (3 Modelle: AvianSwordsman.glb, AvianSwordsman_Sword, Trainingdummy_Base — Rig_Medium, 23 Bones, Resthöhe 2,32, normale Größenklasse). `Melee_1H_Attack_Jump_Chop` bindet 69/69 und deformiert korrekt, bei t=0,35 s eingefroren — der Ausholmoment kurz vor dem Treffer an der Trainingspuppe, wie im Promo.

**Welle 1 jetzt 9 Residents.**

---

## S9 · 2026-09-16 · Lorekeeper-Fix · Witch · Black Knight · Retarget-Warnung

**Lorekeeper-Stab korrigiert.** Der Krummstab stand senkrecht und lief 0,18 Einheiten am Kopf-Bone vorbei — sichtbar im Kopf. Ziel-Richtung von [0,04, 1, 0,08] auf [0,72, 0,62, 0,32] gelegt (schräg nach außen, wie im Referenzbild): Abstand zum Kopf jetzt 0,48.

**Resident 7 · Witch** (11 Modelle: Witch.glb, Basket, Basket_Mushrooms, Broom, Cauldron, Mortar, Mushroom, Pestle, Potionstation, Potionstation_decorated, Table_Small — über den Shard gezählt). Besen in der Rechten, Körbchen mit Pilzen in der Linken — das Körbchen zielt auf die WELT-Richtung [0,1,0], bleibt also aufrecht unabhängig von der Hand-Bone-Drehung. `Basket_Mushrooms` ist die beladene Variante von `Basket` (identische Maße) — dieselbe Beladen/Leer-Systematik wie bei den Farmers-Schubkarren. Kein Flug-Clip in der Bibliothek (119 Clips geprüft) — die Promo zeigt Fliegen UND Stehen; der Atlas zeigt Stehen.

**Resident 8 · Black Knight** — und ein Fund, der die bisherige Bindungs-Methodik korrigiert.

Erste Messung: Box3 des ganzen Charakters ergab 4,69 Höhe, doppelt so groß wie der Rest der Welle. Mit `Idle_A` aus der geteilten Bibliothek angewendet — Track-Bindung meldete **69/69**, volle Bindung — kollabierte die Figur sichtbar zu einem Klumpen ohne erkennbare Gliedmaßen. Bind-Pose-Vergleich (Clip entfernt, Skelett auf Rest gesetzt) zeigte die Figur **korrekt proportioniert**, deckungsgleich mit dem Promo.

**Befund: volle Track-Namen-Bindung ist kein Beleg für Retarget-Sicherheit.** Track-NAMEN passen (beide Rigs heißen "Rig_Medium", gleiche 23 Bone-Namen), Track-WERTE nicht — die Bibliothek nimmt eine kompaktere Skelett-Geometrie an, ihre Positions-Keys ziehen dieses größere Rig zu einem Klumpen zusammen. Der bisher genutzte `bindReport` (bound/total Tracks) prüft nur Namen, nie Werte — das reicht hier nicht.

Konsequenz: Black Knight bekommt **keinen Bibliotheks-Clip**. Neu in `lib/atlas.js`: `actor.manualPose` — setzt das Skelett auf Bind-Pose zurück und dreht benannte Bones direkt (hier: Ober-/Unterarme aus der T-Pose auf eine Wachhaltung). Schwert und Schild sind gegen diese Handhaltung neu berechnet (`aim`).

Der Maßstabsbefund bleibt, jetzt an der Bind-Pose statt am Box3 gemessen: Kopf-Bone bei y≈3,3, Fuß bei y≈0,3 — echte Steh­höhe rund 4, gegen 2,1–3,0 beim Rest der Welle. Kein Messfehler, ein offener Punkt für Georg/Town.

**Zweiter Fund: Box3 lügt bei SkinnedMesh unabhängig von der Pose.** Es maß in Bind-Pose dieselben ~4,69 wie in der kollabierten Animation — Box3 liest nur die rohe Vertex-Geometrie, nie die Bone-Transformation, in jeder Pose. Die automatische Kamera-Anpassung (`V.frame`) zentrierte deshalb weit über dem echten Kopf. Neu: `keyArt.manualCamera` — eine fest gesetzte Kamera als Notausgang, wenn Box3 nicht vertrauenswürdig ist. Draufsicht/Raster/Maße nutzen weiterhin die automatische Anpassung und können bei diesem Resident daneben liegen — dokumentiert, nicht verschwiegen.

Waffen/Schild-Swap: Standard-Ausrüstung (klein) angelegt, `BlackKnight_Sword_Large` und `_Shield_Large` (exakt 2× die kleinen Maße, Pack-Variante, keine Atlas-Skalierung) liegen daneben, über „Optional" zuschaltbar — als Vergleich, nicht als gleichzeitige Zweitbewaffnung.

**Welle 1 jetzt 8 Residents, 73 Objekte, Ensemble-Breite 63,3.**

---

## S8 · 2026-09-16 · Traktor gestrichen · Caveman und Lorekeeper · Welle 1 vollständig

**Georgs Entscheidungen umgesetzt**
- **Traktor gestrichen.** Die Farmers-Szene trägt sich über vier Beete, zwei Schubkarren, Gemüse und die arbeitende Forke — alles KayKit, kein Fremdpack. `kenney_car-kit` ist aus `data/cast.js` entfernt.
- **Fremdpacks erlaubt, wenn ausgewiesen** — als Regel notiert, aktuell von keinem Resident genutzt.
- **Farmer_B arbeitet** mit `Digging` (Set Tools) statt einer Haltepose. Das erledigt zugleich die unbelegte Schubkarren-Griff-Frage: die Karre steht als Ladung daneben, statt falsch gegriffen zu werden.

**Resident 5 · Caveman** (6 Modelle: Caveman.glb, Campfire_Base, Campfire_Logs, Caveman_Axe, Caveman_Club, Caveman_Spear)
- Sitzt im Schneidersitz am Feuer (`Sit_Floor_Idle`, 51/51 Tracks). Bone-Kontrolle: Hüfte 0,08 · Chest 0,62 · Kopf 0,89 · Füße 0,16 — aufrecht sitzend, gemessen statt nach Augenschein beurteilt. Aus der Nähe *wirkte* er liegend, weil sein Fellkopf größer ist als sein Rumpf.
- Drehung auf **104°** gerechnet: Richtung Figur→Feuerstelle ist (1,6 / -0,3), `atan2` ≈ 100°. Nicht gedreht, bis es passte.
- `Campfire_Base` und `Campfire_Logs` sind **zwei Hälften eines Objekts** — Steinring und Brennholz darin. Erst lagen die Scheite als separater Stapel daneben und ein leerer Ring stand in der Szene.
- Die Keule (1,9 lang, Pivot mitten im Schaft) liegt **quer über dem Schoß**. Senkrecht gezielt reichte sie 0,32 unter den Boden: bei sitzender Figur liegt die Hand auf y=0,32.

**Resident 6 · Lorekeeper** (3 Modelle — der schlankste Resident)
- **`Lorekeeper_Tome` ist kein Handrequisit.** Der Dateiname sagt „Foliant", das Modell ist ein **Lesepult** (1,58 × 1,65 × 1,14) mit aufgeschlagenem Buch, Kerzen und Schriftrollen — Pivot am Pultboden, nicht an einem Griff. In die Hand gesteckt wuchs es der 2,14 hohen Figur über den Kopf. Maße und Referenzbild haben den Dateinamen korrigiert; es steht jetzt am Boden, wie die Promo zeigt.
- Der Krummstab (2,20, Pivot mitten im Schaft) steht mit `grip: 0.3` auf dem Boden statt 0,3 darunter zu verschwinden.
- Nur **zwei von sechs** Signatur-Slots sind belegbar. Aktivitäts-, Sozial- und Eigenheit-Slot bleiben leer, statt sie mit Fremdpack-Objekten zu füllen.

**Drei Ordnerstrukturen in einem Pack** — `GothGirl/{characters,assets/gltf}`, `Caveman/{characters,assets/gltf}`, `Lorekeeper/{.,gltf}`. Deshalb wird jeder Pfad einzeln über den Shard belegt und keiner aus einem Muster abgeleitet.

**Welle 1 vollständig** · Ensemble: **57 Objekte, 6 Residents**, Breite 47,0, geteilte Bodenebene, keine Höhen-Normalisierung.

**Offen**
- Goth-Girl-Kulisse weiter unbelegt (die ruinierte Stadt der Promo ist kein Pack-Asset).
- Feuer und Pultkerzen sind unbewegt — die Packs liefern nur Geometrie, keine Flammen-Animation.
- Speer- und Axt-Positionen des Cavemans sind Bildabgleich, keine gemessenen Werte.
- Orc Brute weiter unbelegt; Magical Girl, Plant Warrior, Protagonists und Driver liegen im Shard bereit.

---

## S7 · 2026-09-16 · Griffausrichtung gerechnet · Resident 4 (Farmers, Mehr-Aktor)

**Requisiten lagen flach, weil Hand-Bones nicht achsenparallel sind**
Gewehr und Trompete zeigten waagerecht ins Nichts. Ursache gemessen, nicht geraten: das Gewehr liegt entlang seiner eigenen **+Z-Achse** (Griff bei z≈0, Bajonett bei z=2,06), und die Z-Achse von `handslotr` steht in der Welt bei **[-0,957, 0,266, -0,118]** — fast waagerecht. Mit Identitäts-Drehung legt sich deshalb *jede* Requisite hin.
Neu in `lib/atlas.js`: `hand.aim` — eine **Weltrichtung** statt eingetippter Euler-Winkel. Die lokale Quaternion wird aus der gemessenen Bone-Orientierung gerechnet (`setFromUnitVectors`), dazu optional `roll` um die Zielachse und `grip` als Verschiebung entlang ihr. Das ist selbstkorrigierend: ändert sich die Pose, bleibt die Ausrichtung richtig — bei festen Winkeln nicht.

| Requisite | eigene Achse | Ziel-Weltrichtung | erreicht |
|---|---|---|---|
| `ToySoldier_Rifle` | +Z (2,49 lang) | [0,06, 1, -0,16] geschultert | [0,059, 0,986, -0,158] · Bajonettspitze y=2,65 unter dem Tschako (3,12) |
| `ToySoldier_Trumpet` | +Z (1,13) | [0,28, -0,12, 0,92] getragen | exakt · erster Versuch [0,22, **-0,42**, 0,88] stieß auf den Boden (y=0,12) |
| `pitchfork` | **+Y** (2,06, Pivot im Schaft) | [0,1, 1, 0,05] senkrecht | [0,099, 0,994, 0,05] · Zinken auf Bodenhöhe |

Vorlagen-Abgleich: das contents-Render zeigt das Gewehr **aufrecht geschultert**, Bajonett nach oben — nicht waagerecht.

**Resident 4 · Farmers** (erster Mehr-Aktor-Fall)
Pack über den Registry-Shard gezählt: genau **acht** Modelle — `Farmer_A.glb`, `Farmer_B.glb`, `carrot`, `dirt_plot`, `lettuce`, `pitchfork`, `wheelbarrow`, `wheelbarrow_empty`.
- Zwei Bewohner in einer Vignette: Farmer_B läuft als **regulärer Requisiten-Eintrag** mit eigener Pose und eigenem Mixer durch denselben Builder — kein Sonderpfad. `buildVignette` gibt jetzt `extraMixers` zurück.
- `wheelbarrow.gltf` (1,17 hoch) ist die **beladene** Variante, `wheelbarrow_empty.gltf` (1,04) die leere — die 13 cm Differenz *ist* die Ladung. Kein Zusatz-Gemüse nötig.
- Rig-Befund korrigiert: ein erster Zählversuch ergab 161 Joints. Das war ein Zählfehler über **sieben Skin-Meshes desselben Skeletts**. Tatsächlich 23 Bones, `Rig_Medium`, Clips binden 69/69 — gleiches Rig wie der ganze Cast.

**Zwei falsche Schlüsse, die erst ein Blick von der Seite geklärt hat**
1. *Maßstab.* Traktor unskaliert 1,60 hoch, Farmer 2,41. Ich habe auf Faktor **2,3** skaliert, damit das Größenverhältnis real wirkt — und den Farmer damit in einer mitgewachsenen Karosserie versenkt.
2. *Offene Kabine.* Ein Höhenprofil über 860 Vertices zeigte eine Mulde bei z=-0,2 (y=1,057) zwischen Bügel (1,602) und Armaturenbrett (1,515). Ich hielt sie für den Fahrersitz. **Falsch:** die Mulde ist eine Dachkontur, die Kabine ist rundum verglast und geschlossen. Ein Vertex-Höhenprofil kann eine Vertiefung nicht von einem Hohlraum unterscheiden.

**BLOCKER · „fahrender Farmer" ist mit diesem Traktor nicht darstellbar**
Series 6 enthält **kein** Fahrzeug (alle 916 Assets geprüft). Der einzige Traktor im Repo ist `kenney_car-kit/Models/GLB format/tractor.glb` — Fremdpack, anderer Stil, **geschlossener Kabinenkörper ohne Innenraum**. Jede Sitzposition lässt den Kopf durchs Dach ragen. Aktueller Stand: Traktor als Landmarke, Farmer_A winkt davor (die Promo zeigt genau diese Haltung). Entscheidung über (a) offenes Fremdfahrzeug, (b) Landmarke, (c) Traktor streichen liegt bei Georg.

**Offen**
- Farmer_B hält die Schubkarre nicht an den Griffen — welches Ende die Griffe sind, ist ohne Knotennamen nicht belegt. Karre steht daneben statt falsch gegriffen.
- Traktor-Commit auf `main` gepinnt, nicht auf den Handoff-Commit — er war nie Teil des Elisa-Handoffs.
- Die Promo zeigt vier Farmer in zwei Farbvarianten; der Pack hat zwei Modelle mit zwei Texturen. Vier Figuren im Render sind nicht vier Assets.

---

## S6 · 2026-09-16 · Studio: Anfasser, Bone-Posing, Enthüllung · Resident 3 (Toy Soldier)

**Die S5-Fehlpositionierung war ein Konstruktionsfehler, kein Augenmaß-Problem**
Goth Girl saß hinter ihrem Hocker, weil die Figur per Bounding-Box auf den Boden gesetzt wurde. `THREE.Box3` sieht die Skinning-Deformation nicht — die Box war die **stehende Rest-Pose**, sichtbar war die **sitzende**. Für jede sitzende, liegende oder kletternde Figur ist Box-Grounding damit prinzipiell falsch.
Korrektur in `lib/atlas.js` (`sitOn`): Ausrichtung am **Hüft-Bone** gegen die gemessene Sitzfläche. Gemessen: Hüft-Bone lag bei y=0,481, Hockeroberfläche bei y=0,800 → Figur um **0,319** gehoben. Der Hüft-Bone wird aus der Hierarchie ermittelt (gemeinsamer Vorfahre beider Beinketten), nicht über einen fest verdrahteten Namen.

**Sitzen und winken gleichzeitig — ohne Blend-Gewichte**
Die geteilte Bibliothek hat nur Ganzkörper-Clips. Statt zu blenden wird der Clip **entlang eines Bone-Teilbaums geteilt**: `Sit_Chair_Idle` behält alle Tracks außerhalb von `chest`, `Waving` liefert die Tracks darin. Zwei disjunkte Track-Mengen auf einem Mixer — kein Gewicht, kein Ratespiel, wer gewinnt. Masken-Bone = gemeinsamer Vorfahre beider Armketten (ergibt `chest`).
Nebenbefund: die Bibliothek hat **kein** `Wave`, sondern `Waving` (Set Simulation). Eine `/wave/i`-Suche findet es nicht.

**Studio · Handkorrekturen zum Sammeln** (`lib/studio.js`)
- Anfasser (Verschieben / Drehen / Skalieren, Tasten G/R/S, Esc löst) auf jedes angeklickte Objekt.
- **Bone-Posing**: Bone aus der Liste wählen, Drehring anfassen. Hand-posierte Bones werden nach jedem Mixer-Update absolut neu gesetzt und überschreiben damit den Clip **für genau diesen Bone**.
- Jeder Handgriff hält Clip und Enthüllung automatisch an — sonst überschreibt die Animation den Griff im nächsten Frame.
- Alles wird gesammelt (pro Resident, überlebt Reload), einzeln verwerfbar, als `<resident>.studio-patch.json` exportierbar. **`data/cast.js` bleibt unberührt** — Einpflegen ist eine bewusste Handlung, kein Nebeneffekt.

**Resident 3 · Toy Soldier (Nussknacker) mit animierter Geschenk-Enthüllung**
Pfade über den Registry-Shard (`kaykit-mystery-series6.json`, 916 Assets) gezählt: der Pack hat **genau fünf** Modelle — `ToySoldier.glb`, `Present_Base`, `Present_UnwrappedBase`, `ToySoldier_Rifle`, `ToySoldier_Trumpet`. Der Handoff kannte nur drei davon; Gewehr und Trompete fehlten dort.

| Gemessen | Wert | Konsequenz |
|---|---|---|
| `Present_Base` | 1,99 × **3,48** × 1,99 | die Box ist **höher als die Figur** (2,99) — die Enthüllung ist maßstabstreu, nicht nur ein Effekt |
| `Present_UnwrappedBase` | **4,93** × 0,12 × 4,93 | flaches Papier, trägt die Figur; Soldat wird darauf gestapelt, nicht in sie hinein gegroundet |
| `ToySoldier_Rifle` | 0,29 × 0,54 × **2,49** | langes Gewehr, steckt ohne Offset in `handslot.r` |
| `ToySoldier.glb` | format `glb`, Textur **eingebettet** | einziges Asset der Welle mit eingebetteter Textur |

Enthüllung als deklarative Keyframe-Spur (`lib/studio.js · makeReveal`), 4,8 s Schleife, Zeitleiste mit Scrub und Phasenanzeige: 0,45 s Antizipation (Box staucht und kippelt) → Pop bei 1,0 s (Zustandswechsel `Present_Base` → `Present_UnwrappedBase`, verdeckt durch den Ausschlag) → Figur überschwingt 1,18 → 0,95 → 1,0 → Requisiten versetzt bei 1,45 s und 1,60 s. Keine linearen Interpolationen. **Ein öffnender Deckel existiert im Pack nicht und wurde nicht erfunden** — die zwei echten Zustände tragen die Nummer.

**Offen**
- Gewehr zeigt unter `Idle_B` waagerecht zur Seite. Die Bibliothek hat keinen stehenden Gewehr-Halte-Clip (nur `Running_HoldingRifle`, `Holding_A/B/C`). Bewusst **nicht** mit einem erfundenen Offset überschrieben — erster echter Kandidat für eine Studio-Handkorrektur.
- Balance-Pose für den Clown: über die vollständige Clip-Liste (119 Clips, 7 Sets) geprüft — existiert nicht.
- Goth-Girl-Kulisse weiter offen. Caveman und Orc Brute weiter unbelegt.
- `tools/soldier-probe.html` liest den 512-KB-Shard im Browser, weil er über der Connector-Grenze liegt. Kleines Werkzeug, kein Registry-Eingriff.

---

## S5 · 2026-09-16 · KFB Town Resident Atlas · Bewohner + Signatur-Requisiten (Welle 1)

**Gebaut**
- `KFB_Resident_Atlas_S5.html` — ein geteilter Viewer, datengetriebene Resident-Seiten. Key Art / Draufsicht / Raster / Maße, Ebenen-Schalter (Aktor · Requisiten · Habitat · Optional), Motion-Audition aus der geteilten Rig-Bibliothek, Referenz-Blende gegen das Original-Promo, Klick auf ein Objekt zeigt Pfad, Rolle, Slot und Maße, Recipe-JSON-Export.
- `lib/atlas.js` — Loader nach exaktem Repo-Pfad (kein Pack-Alias), `SkeletonUtils`-Klone für geriggte Meshes, Bodenkontakt/Stapel/Schwebe/Bone-Steck-Platzierung, Clip-Bindungsbericht, zwei vergleichbare Lichtstimmungen, Ensemble-Aufstellung.
- `data/cast.js` — lokale Resident-Recipes (candidate-only). Jeder Pfad stammt aus dem `kfb.asset-handoff.v1`-Export oder aus einem `kfb.asset-pack.v1`-Registry-Shard. Nichts abgeleitet, nichts erfunden.
- `docs/ATLAS_RETURN.md`, `docs/handoff-models.json` (52 Modelle des Handoffs als flache Liste).

**Residents Welle 1** · Goth Girl (5 Objekte, 4 Requisiten, alle aus derselben Collection) · Clown (21 Objekte, 1:1 nach Promo-Artwork) · Ensemble (beide auf einer Bodenebene, ohne Höhen-Normalisierung).

**Gemessene Rig- und Maßfakten** (Laufzeit, keine Schätzung)

| Fakt | Wert | Konsequenz |
|---|---|---|
| Rig-Familie | **Rig_Medium**, 23 Joints, inkl. `handslot.l`/`handslot.r` | jede Handrequisite wird gesteckt, nicht per Offset geraten |
| Bone-Schreibweise | Handoff `handslot.r` → zur Laufzeit **`handslotr`** | GLTFLoader entfernt den Punkt (reservierter Property-Separator). Wer exakt sucht, findet nichts. Atlas löst beide Schreibweisen auf und protokolliert es. |
| Clips im Charakter-GLB | **0** | Motion kommt ausschließlich aus `KayKit_Character_Animations_1.1` |
| Geteilte Bibliothek | **119 Clips**, 7 Sets (General, MovementBasic/Advanced, CombatMelee, Simulation, Special, Tools) | `Sit_Chair_Idle`, `Idle_B` etc. binden **69/69 Tracks** auf beiden Charakteren |
| Aktor-Höhe (Rest-Pose) | Goth Girl **2,21** · Clown **2,73** (mit Hut) | Höhenspanne 0,52 bleibt im Ensemble sichtbar, wird nicht normalisiert |
| Box3 vs. Skinning | Three.js `Box3` ignoriert Skinning-Deformation | Atlas zeigt zusätzlich die **posenabhängige Kopf-Bone-Höhe** (Goth Girl sitzend 1,23) |
| `GothGirl_Stool` | 0,6 × **0,8** × 0,6 | Sitzhöhe des Clips und Hockerhöhe passen zusammen — am Bodenkontakt geprüft |
| `GothGirl_Speaker` / `_MicStand` | 0,65 × 1,00 × 0,63 · 0,75 × 1,48 × **1,43** | der Mikroausleger ragt 1,4 in die Tiefe; Platzierung nach z, nicht nach x |
| `circus_podium` | **1,5 × 1,0 × 1,5** | das Pack hat nur **ein** Podest. Die zwei kleinen Podeste im Promo sind bewusste Vorschau-Skalierungen (s=0,55 / 0,5), im Recipe als `scaleNote` hinterlegt |
| `.gltf`-Requisiten | `.bin` + `.png` extern, `dependencyStatus: complete` | keine 404, Abhängigkeiten löst der Loader relativ auf |

**Abweichungen von der Promo · ausgewiesen, nicht kaschiert**
- Goth Girl: Handmikro steckt in `handslotr`, ist aber **aus** — die Promo zeigt es nicht. Über „Optional“ zuschaltbar.
- Goth Girl: die ruinierte Stadtkulisse ist **kein Handoff-Asset**. Kulissen-Kandidat offen, nicht ersatzweise erfunden.
- Clown: das Promo zeigt eine Balance-Pose auf einem Bein. Die geteilte Bibliothek hat keinen Balance-Clip → `Idle_B`, Abweichung bleibt stehen.
- Clown: 21 Objekte statt sechs. Sechs Slots sind belegt, der Rest ist als `promo-extra` markiert und zählt nicht als Signatur-Requisite.

**Offen (S6)**
- Zweiter Teil der Kalibrierungswelle aus dem Briefing: **Caveman** und **Orc Brute**. Beide liegen **nicht** im Elisa-Handoff — Pfade müssen erst über Librarian/Registry-Shard (`kaykit-mystery-series6.json`, 916 Assets) belegt werden, bevor eine Seite entsteht.
- Orc-Raider-Textur-Warnung des Briefings bleibt unangetastet: kein Palettenurteil aus Thumbnails, keine stille Korrektur in Librarian/Registry.
- Ballon-Schwebehöhen und Requisiten-Abstände des Clowns sind Bildabgleich über die Referenz-Blende, keine gemessenen Registry-Werte.
- Atlas-Zielordner `tools/kfb-town-resident-atlas/` ist laut Briefing **PROPOSAL** — vor dem ersten festen Commit von Georg zu bestätigen.

---

## S4 · 2026-09-16 · KayKit City Builder Bits 1.0 FREE · Sample-Szene + Platzierungsprüfung

**Gebaut**
- `KayKit_City_Sample_S4.html` — Nachbau der pack-eigenen Sample-Szene, 87 Platzierungen, Referenz-Blende, Palette aller 41 FREE-Teile, Klick auf ein Teil zeigt Name + Modulkoordinate + Maße.
- `scenes/kaykit-city.js` — Recipe in Modulkoordinaten. Teilenamen aus dem Repo ausgelesen (41 gltf), nicht aus dem Gedächtnis.
- `docs/PACK_GAPS.md` — wo die PAID/EXTRA-Assets aus den Screenshots fehlen.

**Reaktion auf die Kritik am Streckenversatz (berechtigt):** die Prüfung ist jetzt automatisch und steht oben links im Bild.
`lib/kit-lab.js` → `audit()` prüft jede Platzierung gegen das Halbmodul-Raster und auf Doppelbelegung derselben Zelle, getrennt nach Ebene (Boden/Straße vs. Gebäude) und nach Bauteil vs. Requisite. Aktueller Stand der Szene: **Struktur sauber · 64 Bauteile rasterkonform, keine Doppelbelegung · 23 Requisiten frei gesetzt**. Ein Versatz wie in S3 fällt damit als rote Zeile auf, bevor irgendwer ein Bild anschaut.

**Gemessene Bauregeln · KayKit City Builder Bits**

| Fakt | Wert | Konsequenz |
|---|---|---|
| Raster-Modul | **2 × 2** (`road_straight`) | dritter Raster im Bestand: Dungeon 4, KayKit City 2, Kenney 1 |
| Fahrbahndicke | 0,10 | Straße liegt spürbar auf, Requisiten auf y = 0,1 setzen |
| Gebäude | Grundfläche 2 × 2 | ein Gebäude = ein Modul |
| Gebäude-Varianten | `building_X` **mit** Basisplatte, `building_X_withoutBase` **ohne** | auf einer `base`-Platte gehört die withoutBase-Variante — sonst zwei Platten übereinander. Genau das hat die Doppelbelegungsprüfung aufgedeckt. |
| Straßenteile | `road_straight`, `_crossing`, `road_corner`, `road_corner_curved`, `road_junction`, `road_tsplit` | vollständiges Straßenvokabular, 6 Teile |
| Requisiten | Laterne, 3 Ampeln, Bank, Busch, Hydrant, 2 Mülleimer, Container, 2 Kisten, Wasserturm, 5 Autos | Wasserturm gehört aufs Dach (y ≈ 3,2) |

**Offen (S5)**
- Feinabgleich der Sample-Szene gegen `sample.png` über die Referenz-Blende (Straßenring und Gebäudeanordnung sind interpretiert, nicht pixelgenau abgezählt).
- Stunt Paradise 2 als Dressing-Grammatik.
- Höhenlogik für Rampen/Brücken im Streckengenerator.

---

## S3 · 2026-09-16 · Kenney Racing Kit · Streckengenerator (Kettenlogik)

**Gebaut**
- `Kenney_Racing_Track_S3.html` — Strecke als **Tokenfolge** statt Koordinatenliste. Eingabefeld + Token-Chips + Presets (Oval, Oval weit, Stadtkurs, Slalom, Haarnadel, Rampenkurs), Dressing-Schalter, Draufsicht, Raster, Recipe-Export.
- `lib/track-chain.js` — der Generator. Läuft mit einem Cursor (Anschlusspunkt + Richtung) durch die Folge und leitet jede Position/Drehung aus der gemessenen Bounding-Box des Teils ab.

**Der eine Beweis, den du wolltest:** oben links steht permanent `Kette geschlossen · Lücke 0 · Richtungsfehler 0°`. Passt eine Strecke nicht zusammen, steht dort rot die Lücke in Modulen und der Richtungsfehler in Grad. Kein Augenmaß, kein Suchen.

**Gemessene Bauregeln · Kenney Racing Kit**

| Fakt | Wert | Konsequenz |
|---|---|---|
| Spurbreite / Modul | **1** | gleiches Raster wie City Kit |
| Fahrtrichtung der Teile | lokal **−Z** | Geraden laufen in −Z, nicht in X (anders als City-Straßen!) |
| Pivot | **nicht zentriert** (`roadStraight` x −0,35…0,65, z −1,65…−0,65) | wer auf Tile-Mitte rechnet, baut jede Strecke versetzt |
| Kurven-Footprints | eng 1×1, mittel 2×2, weit 3×3 | Kurvenradius = halber Footprint |
| Kurvenanschluss | rein an der +Z-Kante, raus an der +X-Kante | Default ist eine **Rechtskurve** |
| Linkskurve | dasselbe Teil **rückwärts durchfahren** | kein Spiegeln → Normalen und Randsteine bleiben korrekt |
| `roadStart` | 1,26 × 0,67 × 2 | Torbogen, Länge 2 Module |

**Offen (S4)**
- Dressing ist eine erste Regel (Leitplanken beidseitig, Tribüne alle 6 Teile, Pylonen in Kurven) — Abstände noch nicht an der Stunt-Paradise-Referenz geeicht.
- Höhenwechsel: `roadRamp`/Brückenteile werden noch flach verkettet, y bleibt 0.
- Stunt Paradise 2 als Dressing-Grammatik (Loop, Sägeblätter, Gleise, Canyon) steht noch aus.

---

## S2 · 2026-09-16 · Kenney City Kit · Straßenraster + Blockbebauung

**Gebaut**
- `Kenney_City_Block_S2.html` — 134 Platzierungen, 26 verschiedene Bauteile. Zwei Modi: **Szene** (Straßenkreuz + Blockbebauung) und **Palette** (das komplette Teile-Vokabular eines Packs auf dem Raster ausgelegt, Teil anklicken → Name + gemessene Maße). Das ersetzt die statischen Contents-Sheets durch ein lebendes.
- `scenes/city-block.js` — Recipe in **Modulkoordinaten [i,j]**; das Modulmaß wird zur Laufzeit aus `road-straight` gemessen und eingesetzt. Kein hartverdrahtetes Weltmaß mehr.
- `lib/kit-lab.js` erweitert: sieben Packs (KayKit Dungeon/BoardGame, Kenney roads/commercial/suburban/nature/racing), `.glb` und `.gltf`, Tageslicht- und Dungeon-Stimmung, Render-Fallback für Frames ohne `requestAnimationFrame`.

**Gemessene Bauregeln · Kenney City Kit** (Laufzeitmessung)

| Fakt | Wert | Konsequenz |
|---|---|---|
| Raster-Modul | **1 × 1** (`road-straight`) | Kenney rastert auf 1; KayKit Dungeon auf 4. Nie mischen ohne Skalierung. |
| Fahrbahndicke | 0,02 | Straßen liegen praktisch flach auf y = 0 |
| Default-Achse `road-straight` | läuft entlang **X** | Nord-Süd-Straßen brauchen `r = 90`. Das war der eine Fehler im ersten Durchlauf — im Recipe dokumentiert. |
| Gebäude commercial | ~0,9 × 1,3 × 0,9 bis Hochhaus | passen ins 1er-Raster, Höhe variiert frei |
| Bodenplatte | `tile-low` | 1 Modul, als Blockfüllung unter allem außer Straße |

**Lücke im Bestand (ehrlich, nicht überspielt)**
- **KayKit City Builder Bits liegt nur als ZIP** in `media/3D_Assets/` — nicht entpackt, nicht in der Registry. Ein 1:1 des KayKit-City-Screenshots ist erst möglich, wenn das Pack entpackt im Repo liegt. Bis dahin liefert der Kenney-Straßenbaukasten die Raster-Grammatik.

**Offen (S3)**
- ~~Race Track Builder~~ → in S3 gebaut.
- Seitenleiste ist jetzt ausblendbar (S2 + S3); Pack-Wechsel schaltet direkt in den Palette-Modus.
- Stunt Paradise 2: Szenen-Dressing-Referenz (Loop-Rampe, Sägeblätter, Gleise, Herbstbäume, Canyon) → Dressing-Grammatik für Travel/Stunt.

---

## S1 · 2026-09-16 · KayKit Dungeon Pack · Key-Art 1:1

**Gebaut**
- `KayKit_Dungeon_Room_S1.html` — lauffähige 3D-Szene, 69 Platzierungen, 40 verschiedene Bauteile, Key-Art-Blick + Draufsicht + Raster + Referenz-Blende + Recipe-Export.
- `scenes/dungeon-promo.js` — Scene Recipe: jede Platzierung ist Rasterkoordinate + Rotation, replaybar.
- `lib/kit-lab.js` — Loader/Viewer: Asset-Cache (jedes Bauteil wird einmal geladen, danach geklont = instanziert), Laufzeitmessung jeder Bounding-Box.
- `tools/measure.html` — Messbank: Bauteil rein, Maße raus.
- `tools/registry-probe.html` — Registry-Abfrage (13.000 Assets, Pack-Listen, Raw-URLs).

**Gemessene Bauregeln · KayKit Dungeon 1.1** (Laufzeitmessung, keine Schätzung)

| Bauteil | Maß (x × y × z) | Regel |
|---|---|---|
| `floor_tile_large`, `floor_wood_large`, `floor_dirt_large` | 4 × 0,15 × 4 | Raster-Modul = **4 Einheiten**, Pivot zentriert, Oberkante y ≈ +0,05 |
| `floor_tile_small` | 2 × 0,15 × 2 | halbes Modul |
| `wall`, `wall_doorway`, `wall_gated`, `wall_shelves` … | 4 × 4 × 1 | Wandmitte sitzt **auf** der Modulkante; Unterkante y = 0 |
| `wall_corner` | 2,5 × 4 × 2,5 | Pivot außerhalb der Mitte (−0,75 / +0,75) → Ecken separat setzen |
| `column` | 0,7 × 1,4 × 0,7 | Dekor, nicht raumtragend |
| `table_medium` | 2 × 1 × 2 | Tischplatte y = 1 → Requisiten auf y = 1 |
| `chair` | 0,75 × 1,23 × 0,75 | |
| `barrel_large` | 1,8 × 2 × 1,8 | |

**Raumgrammatik der Key-Art** (aus dem Bild gelesen, im Recipe hinterlegt)
- 4 Räume, je 2 × 2 Module (8 × 8 Einheiten).
- Zwei Blöcke à 4 × 2 Module, gegeneinander um ein Modul versetzt → die Z-Silhouette.
- Schnittansicht: Wände nur Nord/West/Ost + Trennwände, Südseite offen.
- Mittelband = Südwand des oberen Blocks ist gleichzeitig Nordwand des unteren.

**Herkunft**
- Assets: `georg-doc/kayfabizarro` · `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/` · raw @ main · CC0 Kay Lousberg.
- Referenzbild: `uploads/Nz_zk7.png` (KayKit „Dungeon Asset Pack“ Key-Art).
- Asset Registry bleibt Quelle der Wahrheit; dieses Lab ist reiner Leser.

**Offen (S2-Kandidaten)**
- Wandmontierte Teile (`shelf_large`, `shelf_small_candles`, Banner, Fackeln): Pivot-Höhe noch nicht vermessen → aktuell per Auge auf y = 2,4.
- Höhenstufe zwischen oberem und unterem Block (Key-Art zeigt eine Stufe) fehlt.
- Requisitendichte der Key-Art (Bücher, Flaschenreihen, Geschirr) noch nicht ausgereizt.
