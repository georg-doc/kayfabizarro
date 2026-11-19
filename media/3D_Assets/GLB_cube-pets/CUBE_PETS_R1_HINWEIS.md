# Cube-Pets R1 · neue Fassung und Abwärtskompatibilität

**Stand:** 19.11.2026 · WSB (PETS_R1) · Auftrag Georg 19.11.: alle 24 Cube-Pets umgebaut, SSOTs prüfen, alte Anwendungen lauffähig halten.

## Kurz

- **Was neu ist:** Gebackene Probe-Figuren `KFB_Pet_<id>.<rev>.glb` mit Figurenkarte `kfb.figure/1` für die KFB-Prüfbühne (N35) und das Spiel. Sie enthalten:
  - **Augen:** EyeRig v6 mit Knete-Lidern (E2), Lid in Hautfarbe, leicht abgedunkelt. Leichtes Schielen `converge 0.15`.
  - **Mund:** Cartoon-Mund aus den R4-Sätzen als eigene Fläche `KFB_Mouth`, an die Haut angeschmiegt, mit Abstand für die Sprechformen.
  - **Brauen:** Block-Brauen `KFB_Brow_L/R` mit Schalter `brows`, standardmäßig an.
  - **Kenney-Aufleger entfernt:** Augenscheiben, Pupillen, Mundlinien und Zunge sind im gebackenen GLB aus dem Index genommen. Panda-Flecken, Nasen und Schnauzen bleiben.
- **Was bleibt:** Die Original-Kenney-Modelle `media/3D_Assets/GLB_cube-pets/animal-*.glb`, `media/3D_Assets/kfb-pets.json` (`kfb.pets/1` 1.2.8), `pet-LIBRARY.json`, `kfb-pets.js` und `build/` bleiben **unverändert**.
  - Alte Anwendungen laufen weiter, zum Beispiel der Rollercoaster v11 mit FrizzleBob als Cube-Pet über `pet-LIBRARY.json`, `Character`, EyeRig v5 und `stripEyeShells`, außerdem Travel v16/v25 und Pet Studio v12.
- **Wo die neue Fassung liegt:**
  - Arbeitsstand: `KFB_HUB/50_BLENDER/PETS_R1/` mit `glb/`, `data/pet_<id>.<rev>.figure.json`, `belege/` und `RETURN_pets_r1.md`.
  - Übernahme ins Spiel-Repo per Bündel über WS0.

## Regeln für die Abwärtskompatibilität

1. **Nichts überschreiben.** Gebackene GLBs bekommen eigene Namen (`KFB_Pet_*`). Sie ersetzen nie `animal-*.glb`.
2. **Gebackene GLBs nicht durch `makePet` / `kfb-pets.js` laden.**
   - Die Kenney-Augen sind schon entfernt, und die Laufzeit würde ein zweites Augenpaar bauen.
   - Der richtige Weg ist der Kartenweg:
     - EyeRig v6 mit `clay-skin-attach` aus `card.eyeRig.settings`;
     - Mund über `card.mouth` (`owner: original-mesh`, Knoten `KFB_Mouth`, anschmiegen);
     - Brauen über den Knoten-Schalter `extras.kfb.toggle = 'brows'`.
3. **Neue Daten nur additiv.** Vorschlag für `kfb-pets.json`: optionale Felder, die alte Lader ignorieren. Unbekannte Felder müssen den Round-Trip überstehen, wie in EMBED v2.3 §14 verlangt.
   - `pet.kfbFigure = { card, glb, rev }` verweist auf Karte und gebackenes GLB.
   - `pet.mouth.r4 = { set: 'buck_grin', scale }` ist der Cartoon-Mund. `mouth.set` (male/female/red) bleibt **unverändert**, weil pet-mouth.v1 sonst ins Leere greift.
   - `pet.brow.style = 'block'` mit `nodes: ['KFB_Brow_L','KFB_Brow_R']` und `default: true`.
   - `pet.eye.kenneyAnchor = { dx, dy, ring }` ist die Lage von Kenneys Augen, automatisch gemessen. Das Studio-`anchor` bleibt.
   - `pet.eye.converge = 0.15` gilt nur für den Kartenweg. Der globale Wert `face.eye.converge 0` bleibt für Legacy.
4. **Rollercoaster mit den neuen Pets** (Hinweis, keine Code-Änderung): Pet-Def wie bisher holen, aber `KFB_Pet_<id>.glb` mit Karte laden, `stripEyeShells` und `pet-mouth` überspringen und EyeRig v6 mit E2 nach Karte bauen. Ohne diesen Umbau bleibt der alte Weg gültig.

## Widersprüche, die WS0 entscheiden muss

| Thema | SSOT alt | Neue Fassung | Vorschlag |
|---|---|---|---|
| Schema | `kfb.pets/1` (Contract 1.3.0) | `kfb.figure/1`-Karten je Pet | Karte als eigene Datei; Verweis `pet.kfbFigure` |
| Augen | EyeRig v5 zur Laufzeit, Schalen-Lider | EyeRig v6 + E2-Knete-Lider (N35/Spiel) | v5-Weg = Legacy; v6/E2 im Kartenweg |
| Kenney-Augen | `stripEyes` zur Laufzeit (eyeShell z 0,635) | im GLB entfernt, Panda-Fleck bleibt | gebackene GLBs nur im Kartenweg |
| Mund | pet-mouth.v1 PNG-Decals male/female/red; „Münder tragen keine Emotion“ | R4-Cartoon-Münder, eigene Fläche | `mouth.r4` additiv; Kanon-Satz klären |
| Brauen | v12 `pet.brow` = eine Kurve, „nie zwei Brauen“ | zwei Block-Knoten mit Schalter (Georg 19.11.) | `brow.style 'block'` als zweite Art |
| Schielen | `converge 0`; Spiel `augenR2.schielen 0.45` | 0,15 (Georg 19.11.: 0,45 zu stark) | je Darstellungsweg eigener Wert |
| Maße | Kenney-Einheiten, Studio-Maßstab 1,6 | Karten mit Spielmaßstab | Maßstab in der Karte, Daten in Kenney-Einheiten |
| Wimpern | `rig.setLashes` an der Lidschale (pig, penguin) | gehen unter E2 verloren | E2 muss Wimpern an den Lidrand hängen (an WS0) |

## Anforderungen von Georg (19.11.) für das Toolbox-Studio

- Cube-Pets (24) und Würfelmonster lassen sich konfigurieren und werden als Dramatis-Personae-Eintrag gespeichert. Dazu gehören Name, Eigenschaften, Backstory und bevorzugte Chatterbox-Triplets, zusammen mit der visuellen Konfiguration.
- Die Nase ist wählbar: Originalnase oder Schnauze, oder eine vorhandene KFB-Nase wie die rote Knubbelnase.
- Jedes Körperteil hat eine eigene Materialzone. Standard ist die Körpertextur; jede Zone lässt sich gezielt überschreiben, etwa cartoon-glänzend oder mit Knete.
- Der Mund ist je Figur wählbar, zum Beispiel FB-Standardmund für den gelben Hasen.

## Stand der Figuren (19.11.2026)

- Es gibt 25 Probe-Figuren: alle 24 Kenney-Cube-Pets plus Hase in FB-Gelb. Alle bestehen die Prüfbühne N35. Beim Fisch schlägt nur G3 fehl, weil er 4 cm schwebt, wie in Kenneys Fisch-Pose.
- **Kenney-Aufleger:** Augenscheiben, Pupillen, Mundlinien und Zunge sind entfernt. Panda-Flecken, Nasen und Nasenlöcher bleiben.
  - Bei der Krabbe liegt keine Haut hinter den Kenney-Augen. Dort sind sie in Hautfarbe umgefärbt statt gelöscht.
- **Maßstab:** Der Grundwürfel ist bei allen Pets 1,25 Kenney-Einheiten groß. Die Mundgröße bezieht sich jetzt auf den Würfel und nicht mehr auf die Körperhöhe mit Ohren und Geweih.
- **Offen** (Entscheidung Georg):
  - Elefant: Der Mund liegt hinter dem Rüssel.
  - Biber: Kenneys Zähne sind sein Mund.
- **Bericht und Tabelle je Pet:** `KFB_HUB/50_BLENDER/PETS_R1/RETURN_pets_r1.md`, Abschnitte r1r–r1v.
