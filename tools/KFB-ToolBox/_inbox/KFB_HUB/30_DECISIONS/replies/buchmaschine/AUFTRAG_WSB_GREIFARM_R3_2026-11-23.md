# Auftrag an WSB: Greifarm r3 in der Formsprache des Orrery (über WS0, 23.11.)

**Tier 0:** Gleicher Arm wie r2, also gleiches Rig, gleiche Clips und gleiche Backen. Nur die Formsprache wechselt vom Industrieroboter zum Orrery: Messingringe, Zahnrad-Gelenke, Speichen.

**Lücke:** Die blinde Kritik nennt die Arme in vier von fünf Runden „moderne Industrieroboter (KUKA-Stil), keine Orrery-Teile“. Das bricht die Gestaltungsregel des Intros, nach der jedes Teil aus der Formsprache der Maschine kommt.

**Beleg** in `replies/buchmaschine/`:
- `BUCHMASCHINE_INTRO4_R5.mp4`
- `schluesselbilder_intro4_r5/UEBERSICHT.jpg`
- `kritik_intro4_r5/BERICHT_INTRO_GREIFARME.md`

**Formvorbild aus dem Bestand:** Orrery `src/vendor/codevember-orrery/parts.js`:
- `armGeometry` für die flachen Messingarme mit runden Enden, auf denen die Planeten sitzen;
- `gearGeometry` für Zahnräder mit Speichen;
- die Bügel und Lager des Orrery.

## Bitte
1. Neue Datei `KFB_Greifarm.r3.glb` mit Clipliste.
   - **Gleich bleiben:** Knochen, Drehachsen, Gliedlängen, Clips (park, greifen, loslassen, schub, backen_auf, backen_zu, backen_buch, greifen_buch, loslassen_buch, halten_buch_ruecken, halten_buch_vorderschnitt, fuehren_links, fuehren_rechts), Backenweiten (zu 16,8 mm, Buch 17 mm, auf 25,5 mm), Montagepunkte und die Lage von `greifpunkt`.
   - Die Bühne setzt die Gelenke selbst per Inverser Kinematik. Darum bitte nichts an der Kette ändern.
2. **Formsprache je Teil:**
   - **Sockel:** flache Scheibe mit Zahnkranz, wie ein Orrery-Rad.
   - **Gelenke** (Schulter, Ellbogen, Handgelenk): je ein Zahnrad oder eine Speichenscheibe als sichtbare Drehachse. Dazu Lagerringe statt der Motorgehäuse.
   - **Ober- und Unterarm:** flache Messingarme mit runden Enden, wie die Planetenarme. Gern als zwei parallele Laschen mit Bolzen.
   - **Backen:** Uhrzeiger- oder Ankerform mit flachen Polstern innen. Die Polster bleiben so groß wie in r2, damit man den Kontakt mit den Deckeln sieht.
   - **Kabel, Schalter, Steckverbinder, Kappen:** entfernen.
3. **Material:** Clay-Messing wie das Orrery (Messing #b08a4a, matt, Clay-Kanten). Im Intro rostet die Bühne den Arm selbst. Zwei Materialien reichen: Messing hell und Messing dunkel für Lager und Bolzen.
4. **Polygone:** in der Größenordnung von r2. Beide Arme laufen gleichzeitig im Bild.

## Abgabe
- **Dateien:** `KFB_Greifarm.r3.glb` und `KFB_Greifarm.r3.clips.json` in `assets/private 50_BLENDER/BUCH_MENSCH_R1/out`.
- **Beleg:** eine Nahaufnahme, in der ein Arm das r3d-Buch am Rücken hält, und eine Seitenansicht im gestreckten Zustand neben r2.
