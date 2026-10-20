# R2 · Etherington-Originale gegengelesen · R1 · 2026-10-20

**Backlog:** `CANON_3D/RESEARCH_BACKLOG_R1.md` Zeile R2 (Priorität 1). **Ziel:** Startwerte in `kfb_env.SINK` / `kfb_env.RULES` bestätigen oder korrigieren; offene Fragen `ETHERINGTON_REGELN_IN_ZAHLEN_R1` §7 (1) und (2) sowie `SPEC_PLACEMENT_GRAMMAR_R2` §6 letzter Punkt („Etherington-Originale noch nicht gegengelesen“).
**Stand:** Recherche-Ergebnis, noch kein Kanon. WS0 entscheidet, was übernommen wird. Kein Repo wurde verändert.

## Lesehilfe

**Was gelesen wurde.** Die Reihe „How to THINK when you DRAW“ der Etherington Brothers: Zeichner ist **Lorenzo Etherington**, sein Bruder Robin ist Autor. (Ein „Marc Etherington“ kommt in keiner Quelle vor.) Die Tafeln sind Bilder ohne Fließtext. Ich habe jede unten genannte Tafel im Original auf dem Blog der Brüder angesehen und den Inhalt in eigenen Worten wiedergegeben. Quelle je Regel: Tutorial-Nummer und Blog-URL. Gelesen wurden 21 Tafeln: Felsformationen #9/#10, Gras #41/#42, Vorder-, Mittel- und Hintergrund #69/#70, Pflanzen-Cluster #79/#80, Baumwurzeln #87/#88, Negativraum #117, Schatten-Komposition #129, Berge #149, Detail in der Ferne #155/#156, Klein/Mittel/Groß #161/#162, Kiesel und Geröll #169/#170, Kontrast #181, 2-zu-1-Abstand Teil A/B, Komposition mit Dreiecken, Wälder Teil C/D, Wasser #3/#4, Spiegelungen #289, Tangenten #341/#342 (dazu die Kurzfassung „Tangents“ von 2026 auf DeviantArt, inhaltsgleich mit #341).

**Wichtigster Befund vorab.**
- Etherington nennt **keine Prozentwerte**: keine Einsinktiefe, keine Überlappung in Prozent, keine Pixel-Toleranz und kein Größenverhältnis.
- Belegt sind fünf Zähl- bzw. Verhältnisregeln:
  - Abstand **2 : 1**;
  - **drei** Kerngrößen;
  - höchstens **drei** Primärformen je Cluster;
  - **fünf** Tiefenstufen auf einer Steinfläche;
  - **acht** Typen von Landmarken.
- Alle Prozentzahlen in `ETHERINGTON_REGELN_IN_ZAHLEN_R1` und `kfb_env` sind deshalb KFB-Entscheidungen oder P3-Ableitungen, nicht Etherington. Das Dokument sagt das in seinem Kopf selbst („meist abgeleitet“); dieser Abgleich bestätigt es Regel für Regel.

**Herkunft jeder Zahl:**
- **[Q]** Die Zahl oder Aussage steht so in der genannten Quelle (Tafel).
- **[V]** Mein Vorschlag bzw. meine Heuristik, keine Quelle. Muss an KFB-Szenen geeicht werden.
- **[KFB]** Georgs Entscheidung bzw. bestehender KFB-Wert. Nach Kanon-Rangfolge gilt Georg vor jeder Quelle; ein Quellenbefund kann ihn nur anregen, nicht überstimmen.
- **[P3]** Wert aus dem NotebookLM-Bericht P3 (abgeleitet, keine Primärquelle).
- **„keine Quelle gefunden“** heißt: In den gelesenen Original-Tafeln steht dazu nichts. Nicht ausgeschlossen ist, dass eine nicht gelesene Tafel (es gibt über 300) etwas dazu sagt.

**Urteile:** „gilt für KFB“ (unverändert oder mit Korrektur), „nicht übernommen, weil …“ (Quelle widerspricht oder Regel passt nicht zu KFB).

---

## Teil A · `kfb_env.SINK` (Einsinken je Objektart, Anteil der Höhe unter Gelände)

| Nr. | Regel | aktueller Wert | Quellenbefund | Vorschlag | Urteil |
|---|---|---|---|---|---|
| S1 | `rock` großer Fels / Findling | 0,25–0,45 [KFB; P3 hatte 0,20–0,35] | **#10 Felsformationen B:** Findlinge sitzen **im** Gelände, nicht darauf; Bildunterschrift sinngemäß „Eisberg umgekehrt“. Gezeichnet ist der vergrabene Teil als kleinerer Abschnitt unter der Bodenlinie, also unter der Hälfte. Mein Augenmaß an der Tafel: etwa ein Fünftel der Gesamthöhe [V, keine Quellenzahl]. **Keine Prozentzahl in der Quelle.** | 0,25–0,45 behalten [KFB]. Harte Obergrenze für alle Fels- und Steinklassen ≤ 0,50 [V], abgeleitet aus „umgekehrter Eisberg“: Der sichtbare Teil bleibt der größere. | **gilt für KFB.** Prinzip bestätigt, Zahl bleibt KFB (Georg: „tief im Gelände“). |
| S2 | `rockgroup` Felsgruppe / Mesa | 0,20–0,35 (Mittelblöcke 0,15–0,25 [P3]) | **#10:** Findlinge in einer Gruppe lehnen in **unterschiedlichen Winkeln**, folgen aber einer **gemeinsamen Richtung** mit einer **Ausnahme**. Eiförmige Steine liegen auf dem **breiteren Ende**. **#9:** Gestapelte Formationen verjüngen sich nach oben; harte und weiche Schichten erodieren verschieden schnell (Zickzack). Keine Einsinkzahl. | 0,20–0,35 behalten. Neue Regeln N1–N4 (Teil D). | **gilt für KFB** (Zahl: keine Quelle gefunden). |
| S3 | `tree` Baum | 0,05–0,10 | **#87/#88 Baumwurzeln:** Wurzeln **zeigen** statt verstecken. Als denke man sich den Boden abgetragen: wenige dicke Hauptwurzeln, kleine Wurzeln setzen sofort an, darunter kleine Lücken. Über Felsen bestimmt der Fels die Ausbreitung; Wurzeln brechen auf einer Seite ab und tauchen wieder auf. Keine Einsinkzahl. | 0,05–0,10 behalten. Zusatz N7 (sichtbarer Wurzelanlauf). | **gilt für KFB** (Zahl: keine Quelle gefunden). |
| S4 | `bush` Busch | 0,05–0,12 | Keine Busch-Tafel gelesen; #79/#80 (Pflanzen-Cluster) sagt nichts zur Tiefe. | behalten | **gilt für KFB** (keine Quelle gefunden). |
| S5 | `building` Gebäude | 0,0–0,15 | Keine Quelle gefunden (Architektur-Tafeln nicht Teil dieses Abgleichs). | behalten | **gilt für KFB** (keine Quelle gefunden). |
| S6 | `prop` Requisit | 0,02–0,05 | Keine Quelle gefunden. | behalten | **gilt für KFB** (keine Quelle gefunden). |
| S7 | `stone_L` Steinkit, Band-0-Anker | **0,45–0,60** [Grammatik R2 §4.1] | Gleiche Quelle wie S1. Über 0,50 steckt mehr Stein im Boden als darüber; das kehrt den „umgekehrten Eisberg“ der Tafel um. | **0,40–0,50** [V]. Die Obergrenze 0,50 folgt aus S1, die Untergrenze 0,40 hält den Abstand zu `stone_M`. | **gilt für KFB mit Korrektur**, wenn Georg zustimmt. Bis dahin gilt 0,45–0,60 (Rang Register > Quelle). |
| S8 | `stone_M` | 0,35–0,50 | wie S1 | behalten (Obergrenze = Kappe 0,50) | **gilt für KFB** |
| S9 | `stone_S` | 0,30–0,40 | wie S1. **#170 Kiesel:** Steine liegen **nicht alle flach**, flache können hochkant stehen, ein paar größere liegen obenauf. | behalten. Zusatz N6: ein Teil der kleinen Steine liegt schräg bzw. hochkant. | **gilt für KFB** |
| S10 | `grass` / `fluff` / `water_plant` | 0–1 (frei) | #41/#42 Gras: Büschel wie Haarlocken, Richtung beachten. Keine Tiefe. | behalten | **gilt für KFB** (keine Quelle gefunden) |
| S11 | `character` / `vehicle` | 0–0,03 | Keine Quelle gefunden. | behalten | **gilt für KFB** (keine Quelle gefunden) |

**Nebenbefund Grammatik R1 §4:** Dort steht noch „Eingraben 5–15 % für alles“ und „Kontaktschatten (AO) und ein Ring Bodenfarbe am Fuß“. Das widerspricht ETHERINGTON R2 §1/§2 (Tiefe je Objektart, keine dunklen Ringe) und V-011. Etherington selbst zeigt keine Ringe. **Vorschlag:** R1 §4 als abgelöst markieren (WS0).

## Teil B · `kfb_env.RULES` (Prüfer einer Gruppe)

| Nr. | Regel | aktueller Wert | Quellenbefund | Vorschlag | Urteil |
|---|---|---|---|---|---|
| R1 | `spread`: Nachbarabstände ungleich, (max − min)/max der Nächster-Nachbar-Abstände | ≥ 0,30 [P3/Startwert] | **2-zu-1-Abstand A/B:** Bei drei ähnlichen Elementen sitzt das mittlere außermittig; die beiden Lücken stehen im Verhältnis **2 : 1** [Q]. Das gilt auch für Formen in einer Form, für Köpfe in Figurengruppen und für Architektur. Ausdrücklich nur ein **Ausgangspunkt**, kein Selbstzweck [Q]. Im KFB-Maß ergibt 2 : 1 einen `spread` von (2 − 1)/2 = **0,50**. | **Gate-Untergrenze 0,30 bleibt** (Lesart „kein Selbstzweck“). **Generator-Ziel** (`nest`, Thomas-Keime) = **0,50**, also 2 : 1 [Q, umgerechnet]. Zwischen 0,30 und 0,45 meldet das Gate einen Hinweis (TUNE), keinen FAIL [V]. | **gilt für KFB mit Korrektur** (Zielwert neu, Gate unverändert) |
| R2 | `size_tol`: zwei Nachbarn gelten als gleich groß, wenn der Radius < 10 % abweicht | 0,10 | **#161 Klein/Mittel/Groß:** Drei gleich große Formen wirken langweilig; eine größer und eine kleiner machen die Gruppe interessant [Q]. Keine Prozentzahl. | **0,20** [V]. Die eigene Staffel 1 : 0,62 : 0,38 hat Stufen von 38 %; eine halbe Stufe (≈ 20 %) ist die kleinste Abweichung, die man aus der Spielkamera noch als „anders groß“ liest. 10 % sieht aus der Spielkamera gleich aus. | **gilt für KFB mit Korrektur** (Zahl ist Heuristik) |
| R3 | `line_tol` + „≤ 2 auf einer Geraden“ | 0,05; ≤ 2 | **#341 Tangenten:** Eine „Fortsetzungs-Tangente“ (Elemente reihen sich auf einer Linie) koppelt die Objekte optisch und nimmt Tiefe [Q]. **Komposition mit Dreiecken:** Schlüsselelemente auf Dreiecks-Grundrissen verbinden sich und lenken den Blick [Q]. Keine Toleranzzahl. | behalten | **gilt für KFB** (Prinzip bestätigt, Zahl: keine Quelle gefunden) |
| R4 | `overlap` 0,85 / `air` 1,25: Kontur-Regel, nie Fast-Berühren; ETHERINGTON §4: ≥ 15 % überlappt oder ≥ 25 % Luft; im Bild nie 0–5 px | 0,85 / 1,25; 15 % / 25 %; 5 px [P3] | **#341/#342:** Eine Tangente entsteht, wenn sich zwei Formen berühren, ohne zu überlappen, oder wenn sich ihre Linien aufreihen. Sie raubt Tiefe und zieht den Blick an [Q]. Vermeiden muss man nur **ungewollte** Tangenten; gewollt sind sie ein starkes Mittel für den Fokus (Rahmen-, Kanten-, Konvergenz-Tangente) [Q]. Überlappen erzeugt Tiefe und ist besser als bloßes Aufreihen [Q]. **Keine Zahlen.** | Zahlen behalten [P3/KFB]. **Ausnahme neu:** Eine gewollte Tangente ist erlaubt, wenn das Konzeptblatt sie als Fokus-Mittel benennt (Feld `focal`), höchstens 1 je Szene [V]. | **gilt für KFB mit Ergänzung** |
| R5 | `neighbour_r` (Nachbarschaft für den Geraden-Test) | 4,5 | technisch, keine Quelle | behalten | **gilt für KFB** (Werkzeugwert) |
| R6 | `neg_space` Freifläche | ≥ 0,30 [KFB] | **#117 Negativraum:** Es zählt nicht nur die Menge, sondern dass der Raum **verschieden geformt** ist [Q]; rund um die Fokusform freiräumen und Muster vereinfachen [Q]. **#156:** Details rund um die Landmarke etwas zurücknehmen gibt zusätzlichen Fokus [Q]. Keine Prozentzahl. | 30 % behalten [KFB]. **Zusatz N10:** Freiraum um den Fokus; die Freiflächen-Stücke haben ungleiche Größen [V]. | **gilt für KFB mit Ergänzung** |
| R7 | `float_tol_H` | 0,003 | technisch | behalten | **gilt für KFB** (Werkzeugwert) |
| R8 | `landmark_front` (Baum vor der Landmarke ≤ 60 % ihrer Höhe) + „Landmarke immer das höchste Element“ | 0,60; höchste [KFB] | **#155 Detail in der Ferne:** Eine Landmarke ist die **Ausnahme von der Regel** ihrer Umgebung [Q]. Etherington nennt **acht** Typen [Q]: allein stehendes Element, größtes, kleinstes, einzigartige Form, Bruch im Muster, Negativraum, ungewöhnlicher Winkel, Bruch im Horizont. „Am höchsten“ ist nur einer davon. In belebter Umgebung muss sie dramatisch sein, in ruhiger reicht ein kleines Detail [Q, #156]. | 0,60 behalten. „Höchstes“ bleibt **Default** für Inseln [KFB]. Für Scenelets und Dioramen schlage ich vor: Das Konzeptblatt nennt den Landmarken-Typ aus den acht; geprüft wird dann „Ausnahme“ statt „höchstes“ [V]. | **gilt für KFB als Default; Erweiterung zur Entscheidung an Georg** (Quelle ist breiter als die Regel) |
| R9 | `repeat_max` gleiche Form ≤ 3 × ohne Variation | 3 [Startwert] | **#162:** Eine Größenklasse darf mehrfach vorkommen; wer sie flutet, verliert den Fokus [Q]. **#169:** Aus der Ferne nicht zu viele „Schlüsselsteine“ setzen, lieber leichte Streuung von Muster und Textur [Q]. Keine Zahl. | behalten | **gilt für KFB** (Zahl: keine Quelle gefunden) |
| R10 | `clone_dist_H` | 6/3,64 | technisch | behalten | **gilt für KFB** (Werkzeugwert) |
| R11 | `ratio_LMS` Staffel 1 : 3 : 9 (Anzahl groß : mittel : klein) | (1, 3, 9) [KFB] | **#161:** **drei** Kerngrößen [Q]; keine Mengenverhältnisse. | behalten | **gilt für KFB** (Zahl: keine Quelle gefunden; „drei Klassen“ bestätigt) |
| R12 | `groups` 2–4 Gruppen je Insel | (2, 4) | keine Quelle gefunden | behalten | **gilt für KFB** (keine Quelle gefunden) |
| R13 | `NEST.sizes` 1 : 0,62 : 0,38 | Grammatik R2 §1 | **#161:** drei Größen, Verhältnis nicht angegeben. 0,62/0,38 ist der Goldene Schnitt, eine KFB-Wahl. | behalten | **gilt für KFB** (Zahl: keine Quelle gefunden) |

## Teil C · Weitere Startwerte aus `ETHERINGTON_REGELN_IN_ZAHLEN_R1` §2–§4

| Nr. | Regel | aktueller Wert | Quellenbefund | Vorschlag | Urteil |
|---|---|---|---|---|---|
| E1 | Ungerade Gruppen 3/5/7 | [Prinzip] | Eine Regel „ungerade Anzahl“ steht in keiner gelesenen Tafel. Belegt sind Dreiergruppen: 2 : 1 mit drei Elementen, drei Größen, Dreiecks-Grundrisse [Q]. | behalten | **gilt für KFB**. Die „Rule of Odds“ stammt nicht von Etherington; Herkunftsfeld auf „[Prinzip, allgemein]“ ändern. |
| E2 | Groß : mittel : klein : mikro ≈ 1 : 0,6 : 0,35 : 0,15 | [Prinzip, P3] | drei Kerngrößen [Q, #161]; die Mikro-Ebene erscheint bei Etherington als Oberflächen-Textur bzw. Kies, nicht als vierte Größe (#169/#170) | behalten; die Mikro-Ebene zählt nicht als Gruppenmitglied, nur als Streuung [V] | **gilt für KFB** (Zahl: keine Quelle gefunden) |
| E3 | Größe der Bröckel am Fels ≤ 12 % des Felses | [Startwert] | keine Quelle gefunden | behalten | **gilt für KFB** (keine Quelle gefunden) |
| E4 | Wurzelhügel Radius 1,3–1,6 × Stammradius | [Startwert] | **#87:** Wurzelanlauf sichtbar machen, kompakte dicke Hauptwurzeln [Q]; keine Zahl | behalten | **gilt für KFB** (keine Quelle gefunden) |
| E5 | Grasbüschel in Gruppen 3–7, gestaffelt | [Startwert] | **#41/#42:** Büschel als Haarlocken mit Richtung; lange Halme werden nach oben weicher; Halme fächern in alle Richtungen; kurze, lange Halme und Samenstände mischen [Q]. Keine Gruppenzahl. | behalten; Zusatz N9 (Richtung, Mischung) | **gilt für KFB** |
| E6 | Wasserufer: Sand- bzw. Kiesband, Uferabstand 0,6–3,4 (R2D) | [Startwert] | **#3/#4 Wasser, #289 Spiegelungen:** handeln von Wellen (Spitzen und Täler versetzt), Gischt, Fließrichtung und Spiegelungen, **nicht vom Uferaufbau**. | behalten; Zusatz N11 (Fließrichtung an festen Objekten) | **gilt für KFB** (Uferzahl: keine Quelle gefunden) |
| E7 | Tangenten: ≥ 15 % / ≥ 25 % / 5 px | [Startwert, P3] | siehe R4 | siehe R4 | **gilt für KFB mit Ergänzung** |
| E8 | Überlappen für Tiefe: jede Gruppe überlappt mindestens eine andere | [Prinzip] | **#342:** Überlappen erzeugt Tiefe und mehr Möglichkeiten im Layout [Q]. **#79:** Ein Cluster ist eine Miniatur-Umgebung mit eigenem verdichtetem Vorder-, Mittel- und Hintergrund [Q]. | behalten; Zusatz N12 (Mini-Staffel im Cluster) | **gilt für KFB** |
| E9 | Silhouette erkennbar, keine gleich hohen Kanten nebeneinander | [Prinzip] | **#9:** Silhouette prüfen; „schwankende Höhe“, klein/groß im Wechsel [Q]. **#341:** Die „Kamm-Tangente“ (Oberkanten auf gleicher Höhe) ist eine der Tangentenarten [Q]. | behalten | **gilt für KFB** |
| E10 | Formwiederholung ≤ 3 × | [Startwert] | siehe R9 | behalten | **gilt für KFB** |
| E11 | Wertkontrast: Landmarke und Hauptfigur heben sich am stärksten ab | [Prinzip] | **#181 Kontrast:** Kontrast legt fest, wo ein Element in der Gesamtwirkung steht; mehr Kontrast hebt Unterschiede hervor; „Odd one out“ als Formkontrast [Q]. **Wälder Teil C:** Schatten setzen Fokus und trennen Vorder-, Mittel- und Hintergrund [Q]. | behalten; Messung in R4 (Graustufen) | **gilt für KFB** |
| E12 | Kits: nie zwei Kits in einer Gruppe | [KFB] | **#80 Pflanzen-Cluster:** Komposition auf **höchstens drei** Kern-Pflanzen- bzw. Baumtypen aufbauen; Nebentypen beliebig, solange die Primärformen auf drei begrenzt bleiben [Q]. | behalten; Zusatz N5 (≤ 3 Primärformen je Gruppe) | **gilt für KFB** |

## Teil D · Neue Regeln aus den Originalen (Antwort auf §7 Frage 2)

Jede Regel: Zahl, Quelle, Urteil. Zahlen ohne [Q] sind Heuristik.

**N1 · Gemeinsame Lehnrichtung mit einer Ausnahme (Felsgruppen).**
- **Regel:** In einer Fels- bzw. Steingruppe teilen die Elemente eine Lehnrichtung (Hauptachsen innerhalb ±15° zueinander [V]); genau **1** Element weicht um 25–45° ab [V]. Die Neigungen sind trotzdem unterschiedlich: keine zwei Neigungswinkel innerhalb von 5° [V].
- **Quelle:** #10 Felsformationen B, „lean boulders at different angles“ mit Markierung „common direction / exception“ [Q, qualitativ]. https://theetheringtonbrothers.blogspot.com/2017/02/how-to-think-when-you-draw-rock.html
- **Urteil:** gilt für KFB. Ergänzt „Hauptachse folgt dem Hang“ (§2) um die Ausnahme.

**N2 · Eiform liegt auf dem breiten Ende.**
- **Regel:** Ein länglicher Stein bzw. Findling hat seinen größten Querschnitt in den unteren 40 % seiner sichtbaren Höhe [V].
- **Quelle:** #10 [Q, qualitativ].
- **Urteil:** gilt für KFB. Passt zur Geschichte „auf seiner breitesten Seite zur Ruhe gekommen“ (§2).

**N3 · Formationen verjüngen sich nach oben.**
- **Regel:** Bei gestapelten Felsen bzw. Mesas ist die Basis breiter als die Spitze, Breite unten ≥ 1,2 × oben [V]. Ausnahme: ein gewollter Überhang aus Geschichte (Erosion an weicher Schicht).
- **Quelle:** #9 Felsformationen A, „taper up from the base“ [Q, qualitativ]. Gleiche URL wie N1.
- **Urteil:** gilt für KFB (Gebiet 5, Mesa: Cap → Body → Skirt).

**N4 · Schichten wechseln Dicke und Winkel.**
- **Regel:** Benachbarte Schichten bzw. Steinlagen unterscheiden sich in der Dicke um ≥ 30 % [V] und im Winkel um 3–10° [V]. Das Bild der Quelle: ein Stapel nicht zusammenpassender Teller und Schüsseln. Harte Schichten stehen vor, weiche sind zurückgewittert (Zickzack). Waagerechte Schichtlinien und senkrechte Risse teilen die Felswand in ein Mosaik.
- **Quelle:** #9 und #10 [Q, qualitativ].
- **Urteil:** gilt für KFB. Achtung ETHERINGTON §5c („Kit-Modelle werden nicht verformt“): Das gilt für neu geknetete Formen bzw. Mesas, nicht als Verformung fremder Kits.

**N5 · Höchstens drei Primärformen je Gruppe.**
- **Regel:** Eine Pflanzen- bzw. Objektgruppe baut auf **≤ 3** Primärformen auf [Q]. Nebenformen sind beliebig, solange sie die drei nicht überdecken: Fläche der Nebenformen ≤ 30 % der Gruppensilhouette [V]. Mehrere Pflanzen lassen sich von einem gedachten Mittelpunkt aus auffächern [Q].
- **Quelle:** #80 Pflanzen-Cluster B. https://theetheringtonbrothers.blogspot.com/2017/10/how-to-think-when-you-draw-monkey-nuts.html
- **Urteil:** gilt für KFB. Verträgt sich mit „ein Kit je Gruppe“: Das Kit ist die Stilquelle, die Primärformen sind die Arten darin.

**N6 · Kiesel und Geröll: Schlüsselsteine sparsam, Fläche in fünf Stufen.**
- **Regel:**
  - Aus der Ferne wenige Schlüsselsteine: ≤ 1 Schlüsselstein je Steingruppe im Bild der Spielkamera [V].
  - Eine große Steinfläche wird in der Tiefe in **5** Stufen gegliedert [Q], damit die Balance der Details aufbricht.
  - Flächen werden mit einem größeren Objekt unterbrochen (Stumpf, Balken) [Q].
  - Nicht alle Steine liegen flach: ≥ 20 % der kleinen Steine schräg (> 15°) oder hochkant [V].
  - Geröll ist von Natur aus gleichförmig; Abwechslung kommt aus kleinen Gruppen in der Masse [Q].
- **Quelle:** #169/#170 Kiesel und Geröll. https://theetheringtonbrothers.blogspot.com/2018/08/how-to-think-when-you-draw-pebbles-and.html
- **Urteil:** gilt für KFB. Achtung: Die Grammatik R2 §4.4 begrenzt die Neigung auf ≤ 12°. Für Kiesel (Band 2) schlage ich bis 35° vor; für Anker und Stützen bleibt ≤ 12°.

**N7 · Wurzelanlauf sichtbar, Wurzeln mit Ursache.**
- **Regel:**
  - Bäume zeigen den Wurzelanlauf. Wenige dicke Wurzeln, die das Astwerk spiegeln [Q], also 3–5 sichtbare Hauptwurzeln [V].
  - Steht der Baum auf bzw. an einem Fels, folgen die Wurzeln dem Fels [Q] und brechen auf einer Seite ab [Q].
- **Quelle:** #87/#88 Baumwurzeln. https://theetheringtonbrothers.blogspot.com/2017/11/how-to-think-when-you-draw-tree-roots.html
- **Urteil:** gilt für KFB **nur für eigene Knet-Bäume**. Nicht übernommen für Kit-Bäume, weil §5c Wurzel-Zusatzmeshes an Kit-Modellen ausschließt („kein Kneten“). Dort bleibt der Wurzelhügel aus Gelände.

**N8 · Bäume am Hang lehnen aus der Geländekurve.**
- **Regel:** Am Hang stehen Bäume nicht senkrecht wie Zaunpfähle, sie lehnen etwas aus der Hangkurve heraus [Q]. Neigung = 20–40 % des Winkels zwischen Senkrechter und Hangnormale [V]. Stammdicken benachbarter Bäume unterscheiden sich um ≥ 20 % [V] (verschiedene Alter und Arten [Q]).
- **Quelle:** Wälder Teil D, Tipp 8, und Teil C, Tipp 1. https://theetheringtonbrothers.blogspot.com/2019/03/fourteen-days-left-to-get-tutorials.html
- **Urteil:** gilt für KFB. Drehen ist keine Verformung, also ist es auch für Kit-Bäume erlaubt.

**N9 · Gras beschreibt die Form fester Körper.**
- **Regel:** Gras wird genutzt, um die Form eines Felses oder Objekts zu beschreiben; es folgt der Kontur am Fuß bzw. oben [Q]. Gegen den „Blümchenkranz“ [KFB]: Gras bedeckt ≤ 50 % des Fußumfangs, die längste freie Strecke ist ≥ 25 % des Umfangs [V]. Büschel haben eine Richtung, z. B. Wind, Hang [Q].
- **Quelle:** #41/#42 Gras. https://theetheringtonbrothers.blogspot.com/2017/06/how-to-think-when-you-draw-grass.html
- **Urteil:** gilt für KFB. Das Beispiel „besser“ der Tafel zeigt Gras rund um den Fuß. Das Teil-Umfangs-Limit hält die Kranz-Sperre ein.

**N10 · Freiraum um den Fokus.**
- **Regel:** Rund um Landmarke bzw. Fokus wird Detail zurückgenommen [Q]. Ring mit Radius 0,5 × Fußabdruck-Radius der Landmarke: dort ≤ 1 Objekt der Größenklasse M oder größer [V]. Die Freiflächen sind ungleich geformt [Q]: Die größte freie Teilfläche ist ≥ 2 × die zweitgrößte [V], entsprechend 2 : 1.
- **Quelle:** #156 Detail in der Ferne B; #117 Negativraum. https://theetheringtonbrothers.blogspot.com/2018/07/how-to-think-when-you-draw-detail-at.html · https://theetheringtonbrothers.blogspot.com/2018/01/how-to-think-when-you-draw-negative.html
- **Urteil:** gilt für KFB. Ergänzt `neg_space` und Grammatik R1 §1 (Zone „Landmarke + Vorplatz“).

**N11 · Fließrichtung zeigt sich an festen Objekten.**
- **Regel:** Ruhiges Wasser zeigt die Strömung daran, auf welcher Seite es an Steinen bzw. Pfählen bricht: Gischt nur auf einer Seite, die andere bleibt glatt [Q]. Spiegelungen sind in der Ferne klarer und nah verzerrter [Q].
- **Quelle:** #3 Wasser A; #289 Spiegelungen. https://theetheringtonbrothers.blogspot.com/2017/01/how-to-think-when-you-draw-sea-water.html · https://theetheringtonbrothers.blogspot.com/2019/09/how-to-think-when-you-draw-water.html
- **Urteil:** gilt für KFB (Gebiet 5, Fluss und Überlauf), soweit Wasser-Shader das zulassen. Die Spiegel-Regel nur, wenn Spiegelungen gerendert werden.

**N12 · Jeder Cluster ist eine Mini-Staffel.**
- **Regel:** Auch eine kleine Gruppe hat ihren eigenen verdichteten Vorder-, Mittel- und Hintergrund [Q], also aus der Prüfkamera ≥ 1 Element je Ebene [V]. In sehr kleinen Clustern vereinheitlicht man die Richtung [Q]; Formen werden für mehr Kontrast gebündelt [Q].
- **Quelle:** #79 Pflanzen-Cluster A (gleiche URL wie N5); #69/#70 Vorder-, Mittel-, Hintergrund. https://theetheringtonbrothers.blogspot.com/2017/09/how-to-think-when-you-draw-foreground.html
- **Urteil:** gilt für KFB. Schnittstelle zu R1 (Inszenierung).

**N13 · Verfall und Schaden zeigen.**
- **Regel:** Nicht alles wächst: Verfall und Schaden zeigen das Vergehen der Zeit [Q]. Gemeint sind gebrochene Äste, niedergetretenes Laub, gefällte Bäume [Q]. Pro Baum- bzw. Pflanzengruppe ≥ 1 Element der Schicht „Vergehen“ [V].
- **Quelle:** Wälder Teil C, Tipp 2, und Teil D, Tipp 10 (URL wie N8).
- **Urteil:** gilt für KFB. Deckt sich mit Kanon Gebiet 3 (vier Schichten, Schicht 3 „Vergehen“).

**N14 · Boden als Flickenteppich.**
- **Regel:** Ein Waldboden besteht aus vielen Flächen: Gras, flache Steine, Zweige, Pilze, Wurzeln, Erde [Q]. Je Gruppe 3–5 verschiedene Bodenbeläge [V], Übergänge nach V-403 als Sprenkel.
- **Quelle:** Wälder Teil D, Tipp 7 (URL wie N8).
- **Urteil:** gilt für KFB.

## Teil E · Kurzantwort auf die offenen Punkte

- **ETHERINGTON §7 (1) „Stimmen die Startwerte?“** Größenverhältnis, Einsinktiefe, Tangenten-Prozent und Gruppengrößen stehen **nicht** in den Originalen. Bestätigt sind die Prinzipien dahinter: eingraben, drei Größen, ungleiche Abstände, Tangenten meiden, überlappen. **Eine Zahl ist belegt:** Abstand 2 : 1, daher Korrektur R1 (`spread`-Ziel 0,50). Zwei Korrekturen schlage ich als Heuristik vor: `size_tol` 0,20 und `stone_L` ≤ 0,50.
- **§7 (2) „Welche Regeln fehlen?“** Siehe N1–N14 (Fels: Lehnrichtung, Eiform, Verjüngung, Schichten; Kiesel; Wurzeln; Hangbäume; Gras; Wasser; Verfall).
- **§7 (3) „Prozedural ohne Streuungs-Look“:** nicht Teil von R2; das gehört zu R1/R3.
- **Grammatik R2 §6 „Etherington-Originale“:** hiermit gegengelesen. Folgen für §4: Band-0-Einsinken (S7), Kiesel-Neigung (N6), Gruppen-Lehnrichtung (N1).
- **Landmarke (R8):** einzige Stelle, an der die Quelle **breiter** ist als die KFB-Regel. Entscheidung bei Georg.

---

## Vorschlag Prüfung

Gate = `kfb_env`-Erweiterung (mechanisch); K = Kriterium für den blinden Kritiker nach `CRITIC_3D_R1.md`.

| Regel | Prüfung | Art |
|---|---|---|
| S1–S11 | wie heute `kfb_env` B2/E1 (Einsinken im Band). Neu: harte Kappe `sink ≤ 0,50` für `rock`, `rockgroup`, `stone_*` | Gate |
| S7 | Band `stone_L` auf (0,40, 0,50), sobald Georg zustimmt | Gate |
| R1 | `rule_report`: FAIL bei `spread < 0,30` (wie heute), TUNE bei `0,30 ≤ spread < 0,45`. `nest()`-Test: Mittelwert über 50 Seeds ≥ 0,45 | Gate + Generator-Test |
| R2 | `size_tol = 0,20` in `RULES` und `grammar.js` gleichzeitig (Brief W1: Toleranzen identisch) | Gate |
| R4 | Bildraum-Tangenten-Test bleibt (0–5 px). Neu: Ausnahme, wenn `concept.focal.tangent = <Objekt-IDs>`; höchstens 1 | Gate |
| R6 / N10 | Freifläche ≥ 30 % (heute). Neu: im Ring 0,5 × r(Landmarke) ≤ 1 Objekt ≥ M; größte freie Teilfläche ≥ 2 × zweitgrößte (Rasterflächen aus `_neg_space` zu Inseln verbinden) | Gate |
| R8 | Heute: Landmarke höchstes Element. Neu (falls Georg zustimmt): `concept.landmark_type ∈ {biggest, smallest, standalone, unique_shape, pattern_break, negative_space, unique_angle, horizon_break}`; Gate prüft je Typ: biggest → höchste/größte; smallest → kleinste ihrer Klasse und frei stehend; standalone → Freiring nach N10 usw. | Gate + K1 „Ist die Landmarke als Ausnahme lesbar?“ |
| N1 | Hauptachsen-Azimut je Gruppe: Streuung ohne Ausreißer ≤ 15°, genau 1 Ausreißer 25–45°; Neigungen paarweise ≥ 5° verschieden | Gate (braucht `rot`/`up_axis` im Export) |
| N2 / N3 | Bounding-Profil des Meshes: größter Querschnitt in den unteren 40 %; Basis ≥ 1,2 × Spitze | Gate (Mesh-Messung in `kfb_env_bpy`) |
| N4 | K4: „Wirkt der Fels geschichtet (ungleiche Lagen, Zickzack) oder wie ein glatter Klotz?“ | K4 |
| N5 | Anzahl verschiedener `asset`-Primärformen je `group` ≤ 3 (Primär = Fläche ≥ 10 % der Gruppensilhouette) | Gate |
| N6 | Anteil `stone_S` mit Neigung > 15° ≥ 20 %; K4: „Aus der Spielkamera: wenige Schlüsselsteine, eine ruhige Steinfläche mit Tiefenstufen?“ | Gate + K4 |
| N7 | K4/K9 (nur Knet-Bäume): „Sieht man den Wurzelanlauf, und folgen Wurzeln Fels bzw. Hang?“ | K4, K9 |
| N8 | Neigung von `tree` am Hang: 20–40 % des Winkels zur Hangnormale; Stammdicken benachbarter Bäume ≥ 20 % verschieden | Gate |
| N9 | Gras-Abdeckung am Fuß ≤ 50 % des Umfangs, längste Lücke ≥ 25 %; K4: „Kranz?“ | Gate + K4 |
| N11 | K6: „Zeigt das Wasser eine Fließrichtung (einseitige Gischt an Steinen)?“ | K6 |
| N12 | Aus jeder Kritiker-Kamera: je Gruppe ≥ 1 Element im Vorder-, Mittel- und Hintergrund der Gruppe (Tiefensortierung der Objekt-Mittelpunkte im Kamerabild, drei Terzile) | Gate (Bildraum) + K3 |
| N13 | ≥ 1 Objekt mit `layer = 3` (Vergehen) je Pflanzengruppe | Gate (`kfb_env` S3/S4 erweitern) |
| N14 | 3–5 verschiedene Boden-Rollen bzw. Materialcodes je Gruppe | Gate |

---

## Quellen

Alle Tafeln: Lorenzo Etherington (Zeichnung) mit Robin Etherington, „How to THINK when you DRAW“, Blog der Etherington Brothers. Inhalt aus den Bildtafeln selbst gelesen, in eigenen Worten wiedergegeben.

- #9/#10 Felsformationen (2017): https://theetheringtonbrothers.blogspot.com/2017/02/how-to-think-when-you-draw-rock.html (Wiederveröffentlichung 2018: https://theetheringtonbrothers.blogspot.com/2018/01/how-to-think-when-you-draw-rock.html)
- #41/#42 Gras: https://theetheringtonbrothers.blogspot.com/2017/06/how-to-think-when-you-draw-grass.html
- #69/#70 Vorder-, Mittel-, Hintergrund: https://theetheringtonbrothers.blogspot.com/2017/09/how-to-think-when-you-draw-foreground.html
- #79/#80 Pflanzen-Cluster: https://theetheringtonbrothers.blogspot.com/2017/10/how-to-think-when-you-draw-monkey-nuts.html
- #87/#88 Baumwurzeln: https://theetheringtonbrothers.blogspot.com/2017/11/how-to-think-when-you-draw-tree-roots.html
- #117 Negativraum: https://theetheringtonbrothers.blogspot.com/2018/01/how-to-think-when-you-draw-negative.html
- #129 Schatten-Komposition: https://theetheringtonbrothers.blogspot.com/2018/03/how-to-think-when-you-draw-shadow.html
- #149 Berge: https://theetheringtonbrothers.blogspot.com/2018/05/how-to-think-when-you-draw-mountains.html
- #155/#156 Detail in der Ferne: https://theetheringtonbrothers.blogspot.com/2018/07/how-to-think-when-you-draw-detail-at.html
- #161/#162 Klein, Mittel, Groß: https://theetheringtonbrothers.blogspot.com/2018/07/how-to-think-when-you-draw-small-medium.html
- #169/#170 Kiesel und Geröll: https://theetheringtonbrothers.blogspot.com/2018/08/how-to-think-when-you-draw-pebbles-and.html
- #181 Kontrast: https://theetheringtonbrothers.blogspot.com/2018/10/how-to-think-when-you-draw-contrast.html
- 2-zu-1-Abstand A/B (Buch 2): https://theetheringtonbrothers.blogspot.com/2019/03/eighteen-days-left-to-get-tutorials.html
- Komposition mit Dreiecken (Buch 2): https://theetheringtonbrothers.blogspot.com/2019/03/its-nearly-over-eleven-days-left-to-get.html
- Wälder Teil C/D (Buch 2): https://theetheringtonbrothers.blogspot.com/2019/03/fourteen-days-left-to-get-tutorials.html
- #3/#4 Wasser und Wellen: https://theetheringtonbrothers.blogspot.com/2017/01/how-to-think-when-you-draw-sea-water.html
- #289 Spiegelungen: https://theetheringtonbrothers.blogspot.com/2019/09/how-to-think-when-you-draw-water.html
- #341/#342 Schnittlinien und Tangenten: https://theetheringtonbrothers.blogspot.com/2020/03/how-to-think-when-you-draw-tangents-and.html · Kurzfassung 2026: https://www.deviantart.com/etheringtonbrothers/art/How-to-THINK-When-You-Draw-TANGENTS-1292660147
- Gesamtindex der ersten 300 Tafeln: https://theetheringtonbrothers.blogspot.com/p/every-how-to-think-when-you-draw.html
- Interview (Haltung: Denkweisen, keine starren Regeln; keine Zahlen): Skwigly, „How to THINK When You Draw – An Interview with Lorenzo Etherington“, https://www.skwigly.co.uk/how-to-think-when-you-draw-an-interview-with-lorenzo-etherington/

**Nicht gelesen bzw. nicht zugänglich:** die Bücher als Ganzes (Bände 1–4; die Blog-Tafeln sind Auszüge daraus), Tafeln nach 2020 außer „Tangents“ und „Rocks and Pebbles Tip“ (inhaltsgleich mit #169). Raubkopien der Bücher (dokumen.pub u. a.) wurden bewusst nicht benutzt.
