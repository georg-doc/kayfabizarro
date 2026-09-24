# Anleitung · Drummer-Pose-Werkstatt (Blender)

Datei: `BLENDER MCP/ORB/DRUMMER_POSE_WERKSTATT.blend`. Eigene Datei; `orb_band_module_v5.blend` wird nicht angefasst.

## Was drin ist

- **Orc Brute** mit der unveränderten Mixamo-Trommelbewegung. Sie liegt als gesperrte Spur "Mixamo_Basis" unten im NLA.
- **Leere Korrektur-Spur** `Korrektur_Arme` darüber, im Modus Combine. Alles, was du posierst, landet hier und liegt obendrauf; die Mocap bleibt unverändert.
- **Keulen mittig in der Faust.** Sie hängen fest an der Hand und drehen sich nie in der Hand.
- **Große Kriegstrommel** auf dem Boden vor ihm.
- **Gelenkschlösser** (Limit Rotation, wirken schon beim Drehen):
  - Ellbogen (`lowerarm`): beugt nur in eine Richtung, 0–150°, keine Verdrehung.
  - Handgelenk (`wrist`): Beugen −20…75°, Verdrehen etwa ±35°, seitlich −40…25°.
  - Der Oberarm ist frei, die Schulter ist ein Kugelgelenk.
- **Marker in der Zeitleiste** an jedem Schlag der Mocap: "R Schlag" und "L Schlag".

## 1 · Öffnen und einrichten

1. Datei öffnen: `File › Open` → `DRUMMER_POSE_WERKSTATT.blend`.
2. Oben den Reiter **Animation** wählen. Oben siehst du die 3D-Ansicht, unten die Zeitleiste mit den Markern.
3. Ansicht bewegen: Trackpad mit zwei Fingern = drehen, Shift + zwei Finger = verschieben, Pinch = Zoom. Alternativ oben rechts im 3D-Fenster auf die farbigen Achsen-Kugeln klicken, das gibt Vorn-, Seiten- und Draufsicht.

## 2 · In den Pose-Modus

1. Rechts in der Liste (Outliner) auf **Brute_DR** klicken.
2. **Ctrl + Tab**. Du bist im Pose-Modus, die Knochen erscheinen als Stäbchen.
3. Nur die sechs Armknochen sind für dich relevant: `upperarm.r/l` (Oberarm), `lowerarm.r/l` (Unterarm), `wrist.r/l` (Handgelenk).

## 3 · Eine Pose setzen

1. In der Zeitleiste auf einen Marker klicken, zum Beispiel "R Schlag" bei Frame 40.
2. Einen Knochen anklicken, zum Beispiel den rechten Oberarm.
3. **R** drücken, die Maus bewegen, mit Klick bestätigen. Nur um eine Achse: **R** und dann **X**, **Y** oder **Z**; zweimal dieselbe Taste = die eigene Achse des Knochens.
4. Unterarm und Handgelenk genauso. Die Schlösser lassen keine gebrochenen Winkel zu.
5. Maus über der 3D-Ansicht, **I** drücken. Die Pose ist gespeichert (Keyframe in `Korrektur_Arme`).

## 4 · Vorgehen pro Schlag (Vorschlag)

- **Treffer-Pose** genau auf dem Marker: Keulenkopf liegt auf dem Fell.
- **Aushol-Pose** 3–4 Frames vorher: Keule oben/hinten.
- Blender rechnet dazwischen selbst. Zwei Posen pro Hand reichen für den Anfang; die kannst du kopieren: Knochen wählen, **Ctrl + C**, zum nächsten Marker, **Ctrl + V**, **I**.
- **Leertaste** = abspielen, **Cmd + Z** = rückgängig.

## 5 · Fertig

**Cmd + S** speichert in die Werkstatt-Datei. Danach gibst du mir Bescheid. Ich rechne nur noch nach (Keule im Körper, Keule im Fell, Gelenkwinkel), baue daraus den Export und dokumentiere. An deinen Posen ändere ich nichts, ohne dich zu fragen.
