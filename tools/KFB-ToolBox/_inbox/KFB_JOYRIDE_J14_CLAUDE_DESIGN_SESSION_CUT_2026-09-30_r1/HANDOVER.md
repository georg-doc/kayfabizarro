# HANDOVER · J14 Reisemodi · 2026-09-30

## Was steht
- J14 fährt Parcours 1a (Track Core v0.12, P1_A_J14, Fingerprint 840a0a2e) mit **K2B** (= k2 + Drift-Zeile + Rundkurs-Naht; K2 pur wählbar).
- Reisemodi Fuß / Auto / Flug (= nur K2-Sprung über Luftstücke, Steigen/Sinken MISSING) über `lab-travel/travel-core.j14.js`.
- Ein-/Aussteigen mit **I** als Cartoon-Schnitt: Sprung aufs Dach → Versinken mit Puffs → unsichtbares „Plumpsen“ mit Nachfedern; Aussteigen = Ausspucken aus dem Dach → Bogen → Landung neben der Tür. Leertaste = immer Hüpfen/Springen.
- Figuren: ActionFigure (Rig_Medium, 1,85 m) und Black Knight (Rig_Large, 2,30 m Design-Wahl). Beide 23/23 Knochen kompatibel.
- Begehbarkeit DERIVED aus Stücktypen; Parkboxen P1/P2 + Wendestelle als Core-Pads (pad_level PASS).
- Ground schreibt nur `walk-controller.js` (gepinnte Kopie); Clips nur über `locomotion-profiles.v1` / `anim-map.v1`.

## Was nicht steht
- **Leistung:** Vorschau 7–19 fps, von Georg ~10 fps bestätigt („ruckelig“). Global zu lösen, nicht J14-lokal.
- **Sitzmaß:** ActionFigure passt nicht in den Sedan (Dach 1,69 m, Kopf sitzend 1,53 m über Hüfte) → im Auto ausgeblendet. Kein Auto-PASS.
- Sprint (Running_B × 1,3), Rückwärts, Seitlich, Drehen im Stand, Sprung aus dem Lauf: Fuß rutscht messbar → UNPROVEN.
- Black Knight: Large-Set ohne Jump/Rückwärts/Seitlich (UNMAPPED); Knight-Gangarten rutschen stark (Laufen 144 %).
- Fassaden/Schatten außer Scope, unverändert.

## Owner-Grenzen (nicht verschieben)
Track/Fläche = Track Core Stream · Auto = kfb-drive.k2b/k2 · Ground = walk-controller · Clips = Router · Travel-Core = nur Zustände, Gates, Schnitt, Messung.

## Next Gate
**Globaler Performance-Pass (Brief D) auf genau dieser J14-Route mit ActionFigure: gleiche Kamera/Route, je ein Kostenblock A/B, Ziel stabil ≥ 30 fps auf Georgs Gerät; J14-Logik bleibt eingefroren.**
