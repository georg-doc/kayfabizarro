# POSTMORTEM · S4 Track-Look T1/T2 · TOTAL FAIL · 2026-09-27

**Urteil Georg (wörtlich, 27.09. abends):** »das ganze Design, Farben und Cartoon- & Claymation-Look ist ein TOTALER FAIL« · »die Farbpalette ist kacke« · »wirkt wie ein Wireframe, schau dir Claybound an« · »SUPER SCHLAMPIG DAHIN GEROTZT« · »die Bande-Schildchen sind totaler AI SLOP« · »noch nicht einmal die Cartoon-Anatomie der Pylone stimmt« · »kein weiteres Whack-a-mole-Guesswork« · »das war ein Scheiß-Job«.
**Einzig gut:** die Fahrbahn-Texturen (Handspuren im Straßenprofil). Sie wurden im Verlauf zeitweise entfernt; auch das war ein Fehler.

## Was geliefert wurde

- **T1** (`KFB Knet-Strecke T1.dc.html`): drei Look-Optionen A/B/C auf TD03.
- **T2** (`KFB Knet-Strecke T2.dc.html`): Richtung »AB«, dann »Ein Guss«, dann »CB«, jeweils auf Zuruf umgebaut. TD03, TN02-Portal, Kanten-Atlas.
- Technisch lief alles: Stream unverändert gelesen, Fahrbahn unverformt, 7-m-Hülle gemessen, Knetflecken statt Verläufe. **Gestalterisch ist alles durchgefallen.**

## Fehlerkette (in der Reihenfolge, in der Georg sie gefunden hat)

| # | Befund | Beleg | Ursache |
|---|---|---|---|
| 1 | Doppelte rot-weiße Bande (Kerb und Wand nebeneinander gestreift) | `evidence/georg_21-30-25.png` | Race-Semantik als Farbstreifen auf zwei Rollen gelegt, ohne Hierarchie |
| 2 | Banden in mehreren Farben und Mustern ohne mentales Konzept | `evidence/georg_21-47-17.png` | pro Rolle eine eigene Farbe (Schulter, Kerb, Fuge, Wand, Kappe), Farbe folgte den Slots des Core statt einer Idee |
| 3 | Riesige Knet-Artefakte wirken wie Bugs | `evidence/georg_21-47-17.png`, `21-48-19` | Druckstellen und Abdrücke mit dem Diorama-Faktor k = 3 skaliert: Krater von 1–3 m auf Fahrbahn und Wand; Tisch mit Riesenfalten |
| 4 | Helle Kappe auf brauner Wand | `evidence/georg_21-49-38.png` | Kappe als eigene Rolle mit eigener (heller) Farbe; Wand als »Deckel + Körper« statt als eine Masse |
| 5 | Bauchige Verformung | `evidence/georg_21-50-30.png` | Knet-Geometrie als Beule entlang s auf Außenwand und Unterseite (0,35 m); liest als Blähung, nicht als Handarbeit. Rampe: Form kommt aus der Core-Geometrie (dort zu lösen) |
| 6 | Kleinteilig, nicht integriert, nicht cartoony | `evidence/georg_21-50-30.png` | viele dünne Bänder (Schulter 0,6 m, Fuge, Randlinie, Kerb) statt weniger großer Massen |
| 7 | Palette schlecht | alle | eigene Farbwahl (Petrol, Rotbraun, Creme) statt der gemessenen Claybound-Palette, obwohl sie im Projekt lag (`clay-material.v8.js` PALETTES.claybound) |
| 8 | Wirkt wie Drahtgitter | alle | leerer Tisch, keine Welt, harte gleichmäßige Flächen; Claybound-Benchmark nicht angewendet |
| 9 | Fahrbahn-Texturen entfernt, **zweimal** | – | erst beim Beheben von #3 »glatt gestrichen«; dann beim Palettenwechsel (CB) Abdruck-Kachel von 13,5 m auf 0,9 m, Detailweite und Handspurstärke global verändert: Fahrbahn wieder ohne sichtbares Relief, auch im Export. Am 27.09. spät auf den Stand 21:30 zurückgesetzt (globale Werte fest, Fahrbahn-Rollen ohne Überschreibung). |
| 10 | Kerb-Streifen zerrissen, schlampig | `evidence/georg_22-28-00.png` | Streifen beginnen mitten in einem Fleckenübergang; kein sauberer Anfang/Ende |
| 11 | Banden-Schildchen = AI-Slop | `evidence/georg_22-28-49.png` | generische Pfeiltafeln als Aufkleber auf die Wand gesetzt, ohne Bezug zu Welt und Anatomie |
| 12b | T2 lud im ersten Export nicht (»ctr before initialization«) | – | Streuung vor der Tisch-Berechnung eingefügt, ohne danach selbst zu laden. Behoben 27.09. spät, Export neu. |
| 12 | Stützen ohne Cartoon-Anatomie | `evidence/georg_22-29-57.png` | gedrehter Stab auf Teller; zu schlank, kein Fuß, keine Last, kein Kapitell |

## Wurzelursachen

1. **Kein Designprinzip vor dem Bau.** Ich habe die Geometrie-Rollen des Core (Slots) mit Farben belegt und das für Design gehalten. Der Brief verlangte ein Konzept, keinen Paint-over (§1). Geliefert wurde ein Paint-over.
2. **Die vorhandenen Vorgaben nicht angewendet.** Claybound-Benchmark (5 Achsen), gemessene Palette, Environment-Grammar (Palette-Leiter, Rule of Three), H0-Regeln (Kugel-in-Kugel, warmes Licht) lagen vor. Ich habe sie gelesen und dann eigene Farben und Formen erfunden.
3. **Whack-a-mole statt Diagnose.** Jede Kritik wurde lokal gepatcht (Farbe hier, Streifen dort, Tafeln dazu), elf Runden lang. Jeder Patch hat eine neue Inkonsistenz erzeugt.
4. **Technik-Nachweise statt Bildurteil.** Prüfer und Panel haben Zahlen belegt (Hülle, Slot-Fehler, Mesh-Zählung); das Bild selbst habe ich nicht gegen Claybound gehalten. Grün in den Checks, durchgefallen im Bild.
5. **Maßstab falsch übertragen.** Handmaß mit k = 3 skaliert statt die Knetspuren an der Welt (Figur, Auto, Hand) zu eichen.
6. **Rückfragen statt Entscheidungen.** Wo klare Guidelines existieren, habe ich gefragt. Georg: »es gibt klare Farb-, Design- und Cartoon-/Claymation-Anatomie«.

## Was bleibt verwendbar (nur Technik, nicht Look)

- Stream-Lesen ohne Neu-Lösen, Rollen je Querschnitt, Fahrbahn exakt, Hülle 7 m gemessen (`track-kit.v2.js`).
- Deterministische Knetflecken über (s, u) als Übergangstechnik.
- TN02-Röhre aus `tunnelRings`, Kragen nach Ring.
- Fahrbahn-Relief im Straßenprofil (»das einzig Gute«).
- Kanten-Atlas als Prüfstand (Profil aus prm, 0,02 cm gegen Stream bei voller Wand).

## Was nicht wieder passieren darf

- Kein Bau ohne freigegebenes, bebildertes Designprinzip auf Basis der vorhandenen Guidelines.
- Keine eigene Palette, wenn eine gemessene existiert.
- Keine Farbe je Core-Slot; Farben folgen Massen.
- Keine Aufkleber-Semantik (Tafeln, Pfeilschilder, Streifen auf Wänden).
- Keine Knetspuren größer als die Hand der Welt; nichts, was als Fehler lesen kann.
- Keine Stützen, Wülste oder Ränder ohne Cartoon-Anatomie (Last, Squash, Fuß, Kopf).
- Kein Entfernen dessen, was Georg gut findet. Globale Material-Regler nie ändern, um eine einzelne Rolle zu beheben.
- Bildurteil gegen Claybound vor jedem Zahlenbeweis.
