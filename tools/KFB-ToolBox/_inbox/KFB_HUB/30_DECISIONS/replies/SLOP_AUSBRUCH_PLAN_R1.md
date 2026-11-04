# Slop-Ausbruch aus der Bresche · Plan R1 · 04.11.2026 · Flug

Grundlage: SLOP_METANARRATIV_R1.md, §2.1–2.2 und §4 „Flug“. Gebaut wird nach Testlauf 5.

**Kurz**
- Wird ein Gebäude aufgebrochen, springen seine Bewohner-Slops als Gruppe aus der Bresche heraus.
- Danach reagiert jede Gruppe nach ihrer Haltung: **verwirrt** taumeln und umsehen, **unzufrieden** schimpfend weggehen, **kämpferisch** auf den Spieler zu.
- Was mit herausfällt, ist Zensurmasse: Blobs aus dem Slop-Goo-Material, die rollen und einsickern.
- Es werden nur vorhandene Clips, Federn und Module verwendet. Keine neuen Keyframes.

---

## 1 · Ablauf (Ursache → Wirkung)
1. WS1 meldet `gebaeude.bresche { id, x, y, z, normale, klasse, biome, menge }` über cueBus. `normale` zeigt aus der Bresche heraus, `menge` ist die Zahl der Bewohner.
2. mobs2d `ausbruch(e)` bildet eine Gruppe aus Bewohnern dieser Gebäudeklasse und dieses Bioms (Feld `rolle.bewohner`) und gibt jedem Slop seine `haltung`.
3. **Heraus:** Der vorhandene Nachschub-Sprung (`rausSprung`, Kontroll-Eskalation K2) wird gestaffelt (0,18 s je Slop). Jeder wächst aus der Bresche, springt im Bogen entlang `normale` heraus und landet 2–4 m davor.
   - Bei der Landung stoßen die vorhandenen Lande-Spritzer Tinte aus.
   - Dazu meldet `slops.ausbruch` an WS-Design, wie viele herausgekommen sind; daraus folgt Faktor und Takt für `karte.enthuellt`.
4. **Reaktion** nach Haltung, ab der Landung (§2).
5. **Zensurmasse:** WS-Design lässt die Blobs aus der Bresche fallen und rollen (spill, §3). Material und Einsickern kommen von mir.

## 2 · Die drei Reaktionen (nur Bibliothek: ruhe, plaudern, huepfen, schreck, treffer, panik)

| Haltung | Bewegung | Clips | Blick | Ton |
|---|---|---|---|---|
| verwirrt | 3–5 kleine Hüpfer mit 40 % Höhe in wechselnde Richtungen im Umkreis von 2,5 m; dazwischen 0,6–1,2 s Pause | `schreck` bei der Landung, dann `ruhe`, je Pause einmal `panik` mit 0,5 Stärke als Zittern | Umsehen: Squash-Flip (bildparallel) wechselt je Pause die Seite | `schreck` je Stimmrolle |
| unzufrieden | Hüpfer weg von Spieler und Bresche, bis 12 m, langsamer Takt | `plaudern` vor dem Abgang und bei jedem zweiten Halt (Schimpfen; die Marken s0–s7 sind die Silben für den Ton) | Blick zurück zum Spieler beim Schimpfen (`schauZu`) | plaudern-Silben je Stimmrolle |
| kämpferisch | `schreck` mit Stärke 1,8 (Unruhe wie K1), dann Hüpfer auf den Spieler zu mit Abstandshaltung wie heute; danach normales Gruppenverhalten (notice, Abstand, Treffer) | `schreck` → `huepfen` | immer zum Spieler | `schreck`, Treffer-Töne wie heute |

- Alles läuft in Slop-Zeit (TEMPO 0,75), mit der gedämpften Feder und nur auf freiem Boden (`bodenFrei`, `options.frei`).
- Nach der Reaktion gehen verwirrte und unzufriedene Slops in das normale Wandern ihrer neuen Gruppe über; die Bresche ist dann ihr Zuhause.
- **Gemischte Gruppen:** Die Haltung gilt je Slop. Die Gruppe bleibt zusammen, bis sich die Wege trennen: Die Kämpferischen bilden dann eine eigene Gruppe.
- Neu ist nur ein reines Logikmodul `src/npc/slopHaltung.js` ohne three.js: Ziele, Takt und Clip-Wahl je Haltung, mit Node-Test. mobs2d ruft es auf.

## 3 · Zensurmasse (Goo-Blobs) · Abstimmung mit WS-Design
- **Material:** `gooBlobMaterial(THREE)` aus slopGoo, dieselbe Tinte wie Slop-Goo und Lande-Spritzer: dunkel, matter Glanz, nass. Ich liefere es als Fabrik.
- **Form, Rollen, Physik:** WS-Design (spill.js). Die Blobs sind runde 3D-Klumpen mit harter Kante (D-Form-Regel: rund-organisch mit harten Kanten).
- **Einsickern:** über das gemeinsame Modul `einsickern.js` (`einsickern3d(material)`, `einsickernKurve`).
  - Ablauf: erst liegen, dann matt werden, dann versinken, mit unruhiger Kante. Kein Ausblenden.
  - Die Werte `liegen` und `dauer` legen WS-Design und ich gemeinsam fest. Vorschlag: liegen 6 s, dauer 4 s. Fürs Lesen müssen sie lange genug liegen.
- **Ent-Zensur** (Konzept §3, Georg bestätigt): Platzt ein Blob (Treffer) oder stirbt ein Slop, wird aus Schwarz bunter Fluff. Das Platzen übernimmt das vorhandene Goo-Platzen; den bunten Fluff macht WS-Design (spill).

## 4 · Schnittstellen
- **Verteiler:** Die Slop-Karte bekommt `haltung` (verwirrt | unzufrieden | kämpferisch) und `rolle.bewohner` (Gebäudeklassen, Biome). Ich lese beides aus dem Roster.
  - Rückfall, solange die Felder fehlen: Trash → verwirrt, Common → unzufrieden, Elite → kämpferisch. Kein Zufall, damit Belege gleich bleiben.
- **WS1:** liefert `gebaeude.bresche` und hört auf `slops.ausbruch { id, n, bewohner, verwirrt, unzufrieden, kaempferisch }`. Der Eskalationszähler bleibt wie V-1416.
- **WS-Design:** hört auf `slops.ausbruch` (für `enthuellt`) und `slops.gelandet { i, x, z }` (für die ersten Tropfspuren). Es ruft `gooBlobMaterial` und das Einsickern-Modul auf.
- **Writer's Room:** Rufe je Haltung nur aus dem Triplet-Bestand. Bei mir sind es nur die Tonsilben; Sprechblasen gehören WS1.

## 5 · Belege
- **Node:** slopHaltung.js. Je Haltung Ziele, Takt und Clip-Folge festgelegt; Abstände zur Bresche und zum Spieler; nur freier Boden.
- **Browser** (ein Slot): Test-Hausstelle mit einer Bresche und drei Gruppen, je eine Haltung. Kamera von vorn und von der Seite, feste Uhr, 6 s. Dazu ein Blob-Fall mit Einsickern, sobald spill von WS-Design steht.
- Ein Kritiker am Ende.

## 6 · Entschieden (WS0, 04.11.)
1. **Kämpferisch:** vorerst nur bedrohen wie heute, mit vorhandenen Clips. Ein eigener Angriff kommt erst mit einem fertigen Clip; nicht selbst animieren.
2. **Bewohner:** 3–6 je Gebäude. Die Zahl kommt vom Verteiler je Gebäudegröße, als Datenwert (`menge` in `gebaeude.bresche`).
3. **enthuellt:** = min(1, (Slops × 1 + Blobs × 0,2) / Bewohnerzahl). Damit ist das Motiv ganz frei, wenn alle draußen sind. `slops.ausbruch` trägt dafür `bewohner`.
4. **Einsickern:** liegen 6 s, dauer 4 s. Wird mit WS-Design abgestimmt.

Gebaut wird nach Testlauf 5.
