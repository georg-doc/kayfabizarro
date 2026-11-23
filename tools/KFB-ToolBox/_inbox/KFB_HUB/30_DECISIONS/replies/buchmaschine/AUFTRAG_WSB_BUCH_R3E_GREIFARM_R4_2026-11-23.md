# Auftrag an WSB: Buch r3e (Stauchen mit Wölbung) und Greifarm r4 (breite Polster), über WS0, 23.11.

**Tier 0:**
- Das Buch staucht beim Aufprall wie Hartgummi: Deckel und Buchblock wölben sich, das Volumen bleibt, danach schwingt es nach.
- Die Greifarme bekommen breite Polster, die man sichtbar auf beiden Deckeln liegen sieht.
- Sonst bleibt alles wie r3d und Greifarm r3.

**Beleg der Lücke** in `replies/buchmaschine/`:
- `BUCHMASCHINE_INTRO5_R3.mp4`
- `kritik_intro5_r3/BERICHT_INTRO5.md`
- die Streifen in 30 fps in `kritik_intro5_r3/streifen_*.jpg`

## 1. Buch `KFB_Buch_Mensch.r3e.glb` (Basis r3d)
- **Shape-Keys am geschlossenen Buch** (Umschlag, Deckel, Buchblock, Rücken gemeinsam), steuerbar von 0 bis 1:
  - `stauchen`:
    - Dicke etwa 0,45, Fläche etwa 1,2 (volumenerhaltend).
    - Die Deckel wölben sich in der Mitte nach außen, der Buchblock bekommt einen Bauch an Kopf, Schnitt und Fuß.
    - Die Ecken bleiben etwas zurück, damit es nicht nach gleichmäßigem Skalieren aussieht.
  - `strecken`: Dicke etwa 1,2, Fläche etwa 0,92, die Deckel leicht nach innen gezogen.
  - `wippen_l` und `wippen_r`: das Buch wölbt sich über eine Längskante, für das Nachschwingen.
- **Clip `stauchen_landung`** (etwa 0,6 s, 30 fps), der die Keys in dieser Folge fährt:
  - Kontakt;
  - 2 Bilder Stauchen 1,0;
  - Absprung mit Strecken;
  - zweiter Kontakt mit Stauchen 0,6;
  - kleines Nachwippen;
  - Ruhe.

  Die Bühne darf die Keys auch selbst steuern. Bitte die Keys darum zusätzlich einzeln nutzbar lassen.
- **Drehpunkt** der Verformung an der Kontaktfläche, also an der Unterseite des liegenden Buchs (Rückdeckel unten), nicht in der Buchmitte.
- **Gleich bleiben:** Knochennamen und Clips von r3d. Die Keys dürfen `zu` und `umschlag_abgeloest` nicht stören.
- **Beleg:** eine Nahaufnahme aus tiefer Kamera, schräg von vorn, mit den Zuständen Ruhe, Stauchen 1,0 und Strecken nebeneinander.

## 2. Greifarm `KFB_Greifarm.r4.glb` (Basis r3)
- **Polster:** breite flache Polster innen an beiden Backen, etwa 18 × 30 mm, also deutlich größer als die Uhrzeiger-Spitzen.
  - Sie liegen beim Greifen sichtbar flach auf Vorder- und Rückdeckel.
  - Sie dürfen in einer dunklen Gummi- oder Lederfarbe von Messing und Rost abstechen.
- **Polsterlage:** Die Polster reichen vom Buchrand höchstens 12 mm auf den Deckel, damit das Cover frei bleibt. Kein tieferer Griff (WS0).
- **Messpunkt:** Bitte einen Knochen oder Leerknoten `polster_mitte` in die Mitte zwischen beide Polsterflächen setzen. Bei r3 sind `polster_l` und `polster_r` Netze ohne eigene Lage, die Bühne musste die Mitte aus den Vertices errechnen.
- **Gleich bleiben:** Rig, Clips, Backenweiten (zu 16,8, Buch 17, auf 25,5 mm), Montagepunkte und die Orrery-Formsprache von r3.
- **Beleg:** eine Nahaufnahme, in der ein Arm das Buch r3e am Vorderschnitt hält, aus der Kamera vor dem Cover.

## Abgabe
In `assets/private 50_BLENDER/BUCH_MENSCH_R1/out`:
- `KFB_Buch_Mensch.r3e.glb` und `r3e.clips.json`;
- `KFB_Greifarm.r4.glb` und `r4.clips.json`.
