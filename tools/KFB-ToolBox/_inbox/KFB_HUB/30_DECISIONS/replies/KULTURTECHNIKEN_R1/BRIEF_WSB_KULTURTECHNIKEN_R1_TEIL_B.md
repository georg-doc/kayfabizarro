# Für WSB (Mac mini, Blender MCP) · KFB-Kulturtechniken R1 · Teil B: Georgs Wahl ist da · 15.11. (V-1793)

**Kern (3 Zeilen):**
1. Georg hat gewählt (q686–q692). Teil B läuft jetzt genau nach dem Brief `KFB_HUB/30_DECISIONS/replies/KULTURTECHNIKEN_R1/BRIEF_WSB_KULTURTECHNIKEN_R1.md` (Abschnitt Teil B: Import, Boden, Requisiten, Tanz und Musik, Übergänge, Daten, Beleg). Dieser Nachtrag nennt nur die Wahl und Georgs zwei Notizen.
2. Kevin Iglesias (itch.io, kostenlos) und CMU (Charleston) darfst du laden. Mixamo kommt später: Georg lädt selbst, wenn es ihm passt.
3. Rückgabe als Git-Bundle wie Teil A, Zweig `assets/wsb-kulturtechniken-r1` weiter ab @82212dc9. WS0 pusht und baut ein.

**Grundlage:** Repo `georg-doc/KFB-Stunt-Car-Race`, Stamm `game/integration-r2` @532f63d9f, Assets `assets/private` @82212dc9 (enthält deine Teil-A-Lieferung `50_BLENDER/KULTURTECHNIKEN_R1/`). Kandidaten-Daten: `50_BLENDER/KULTURTECHNIKEN_R1/data/kandidaten_r1.json`.

**Georgs Wahl (Namen wie auf deinen Vorschauen in `50_BLENDER/KULTURTECHNIKEN_R1/vorschau/`):**

| Technik | gewählt | nicht gewählt |
|---|---|---|
| Tanz | t1 Gangnam Style · t2 House Dancing C · t3 Breakdance Uprock · t4 Brooklyn Uprock · t5 Breakdance 1990 · t7 Breakdance Freeze Var 1 · t8 UAL1 Dance Loop | t6 (war nicht lesbar) |
| Lesen | l1 Texting And Walking · l2 Walking While Texting · l3 Writing · l4 Cards | – |
| Fluff / Alchemie | f3 Pick Fruit B · f5 UAL2 Consume · f6 Casting Spell · f7 Shaking Dice · f8 UAL1 Fixing Kneeling | f1, f2, f4 (waren nicht lesbar) |
| Brickfish | b1 UAL2 Overhand Throw · b2 Throwing Dice · b3 Swatting Bugs | – |
| Geschenke | g1–g8 alle | – |
| Debatten | d1–d8 alle | – |

Dazu aus dem Bestand, wie im Teil-A-Return vorgeschlagen: die 20 abgenommenen Tanz-Clips, die der Idle-Tanz noch nicht nutzt, mit denselben Feldern messen (beatsPerLoop, downbeatS, tier, rank, bpm, energy, saubere Schleife).

**Neu laden (Georg q692: Download ok):**
- Kevin Iglesias „Human Dance Animations FREE“ über itch.io (kevdev.itch.io/human-dance-animations-free), Preis 0. Kein Konto, nicht der Unity Asset Store.
- CMU Mocap Charleston, Subjekte 93 und 103, über den KIT-Spiegel. Salsa als Paar (60/61) erst prüfen: nur übernehmen, wenn es wirklich ein Paar-Take ist, sonst als Lücke melden.
- Beides durchläuft dieselbe Bühne wie Teil A. Die Vorschauen kommen in die Rückgabe, Georg wählt sie im Hub (V-195).

**Mixamo:** In dieser Runde nicht. Georg lädt die Reihen später selbst nach `KFB_HUB/50_BLENDER/KULTURTECHNIKEN_R1/in_mixamo/` (Liste: `KFB_HUB/30_DECISIONS/replies/KULTURTECHNIKEN_R1/MIXAMO_LISTE_SPAETER_R1.md`).

**Georgs Notizen (Wortlaut):**
- Tanz: „später können wir noch checken, wie wir verhindern, das der kopf bei einigen dances/moves im boden steckt.“
  - Für dich heißt das: Der Bodenausgleich je Bild (K12 `floorlift`, V-596) misst bei jedem Tanz- und Boden-Clip alle Kontaktstellen, auch Kopf, Hände, Knie und Rumpf, nicht nur die Füße.
  - Bleibt bei einem Clip der Kopf trotzdem im Boden, meldest du ihn mit Bild und Zeitstelle.
  - Kein neuer Hüft-Lift in der Spur, wie im Brief.
- Brickfish: „das muss natürlich mit dem briskfish getestet werden, um zu sehen, ob die clips funktionieren und der brickfish nicht irgendwo im kopf steckt; dazu muss wurfbewegungen, flugbahn, impact etc passen“
  - Jeder Brickfish-Clip wird mit dem echten Wurf-Requisit belegt: `50_BLENDER/B41/props/KFB_Throw_BrickFish.medium.r1.glb` bzw. `50_BLENDER/BRICKFISH_R1/data/KFB_Throw_BrickFish.large.r4.glb`, an `KFB_Grip` mit festem slotOffset (V-536, V-574).
  - Der Beleg zeigt pro Clip den ganzen Ablauf: Halten, Abwurf an der Abwurf-Marke (Format wie `KFB_HUB/50_BLENDER/B41/data/b41_throw_markers_r1.json`), Flugbahn und Aufprall am Ziel.
  - Es gibt einen Prüfwert: Abstand Brickfish zum Kopf in jedem Bild bis zum Abwurf, der nie unter 0 fällt.
  - b3 Swatting Bugs wird als Abwehr belegt, mit einem ankommenden Brickfish.

**Requisiten für diese Runde:**
- Lesen: `50_BLENDER/K11/props/KFB_Book_Open.k11.glb` an `KFB_Grip`.
- Comic-Heft, geschlossenes Buch, Karte für l4: Platzhalter, Build folgt.
- Fluff übergeben und f7: `KFB_HUB/50_BLENDER/B41/props/KFB_Throw_FluffBomb.medium.r1.glb`.
- Kessel und Flasche (f5): Platzhalter, Build folgt.
- Geschenke: `Present_Base.gltf` aus dem Brief.
- Sitz-Clips d3, d4, d5: Stuhl Platzhalter, Build folgt. Du meldest die Sitzhöhe je Clip.

**Rückgabe:**
- Bundle und RETURN.md in `KFB_HUB/30_DECISIONS/replies/KULTURTECHNIKEN_R1/`.
- Je Technik Belege nach dem Brief (vorn oder seitlich plus Spielkamera, Proof-Stage, Knete, KFB-Augen, Kanon-Wache FB, ein Kritiker je Runde).
- Dazu je Kevin-Iglesias- und CMU-Kandidat eine Einzelvorschau wie in Teil A.
