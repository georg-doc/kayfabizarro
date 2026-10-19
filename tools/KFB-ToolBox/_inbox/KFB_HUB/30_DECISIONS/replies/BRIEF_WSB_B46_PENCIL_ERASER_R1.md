# BRIEF WSB · B46 · Prop-Charaktere Bleistift + Radiergummi · R1 · 2026-10-19 · WS0
**Register:** V-553. **Reihenfolge:** klein, darf in Lücken der Warteschlange (z. B. während langer Renders) oder direkt nach B44.

**Tier 0**
1. **Bleistift-Charakter:**
   - Körper aus dem KayKit-Bleistift lang mit Radiergummi-Spitze (Kopf = Radierer);
   - KFB-Eye-Rig + Mund;
   - klassisch gelb-orange Flächen bzw. Streifung am Körper.
2. **Radiergummi-Charakter:**
   - KFB-Eye-Rig + Mund;
   - klassisch zweifarbig: blaue Hälfte unten, rosa Hälfte oben.
3. Prüfstand mit QA V-520 + Lieferung als Scenelet-Darsteller (GLB + Base64 + Figurenkarte).

## Block
- **Quellen:**
  - Bleistift: KayKit (z. B. `KayKit Legacy/…/Pencil.gltf.glb` bzw. KayKit RPG Tools `pencil_*`); den langen mit Radierer-Spitze wählen.
  - Radiergummi: zuerst CC0 suchen. Vorhanden sind `media/3D_Assets/KFB/Eraser by GkStudio…glb` und `Eraser by Poly by Google…glb`, Lizenz prüfen; CC-BY nur mit Georgs OK.
  - Kein Eigenbau-Körper, wenn ein Asset passt (V-511).
- **Figur:**
  - Kopf- und Körper-Zonen als Rollen-Materialien (umschaltbar); Knet-Look.
  - Augen-Anker `KFB_Eye_L/R_anchor` (Lid = Körperfarbe gemessen).
  - Mund aus der aktuellen KFB-Mund-Serie (neutral + 1 Ausdruck).
  - Kleine Ärmchen bzw. Beinchen nur, wenn ein KayKit-Rig sauber passt; sonst als hüpfender Prop-Charakter mit `procedural`-Idle (Hüpfen, Squash, Neigen).
- **Clips bzw. Bewegung:** Hüpfen, Freuen (Squash und Stretch), Erschrecken.
  - Radiergummi extra: „radieren“ (reibt hin und her).
  - Bleistift extra: „schreiben bzw. zeichnen“ (Spitze kritzelt).
  - Bezug zur Comic- bzw. Karten-Welt: Sie können später Karten „zeichnen“ bzw. Tinte (Black Goo, V-531) wegradieren.
- **Abnahme:** Prüfstand je Figur (Augen Ruhe / halb / zu, Mund), Streifen der Bewegungen; Scenelet-Darsteller-Eintrag.
