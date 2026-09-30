# HANDOVER · Resident Atlas · 2026-09-30 r1

## Stand

- **S15** = S14 plus Fight Sandbox 02 (Cartoon-Kontakt). S14 bleibt die Messbasis für die Knetform im Friedhof. S13 hat Fight 01.
- Einzige Kampfdatenquelle: `media/…/KFB_Motion_Library/fight/KFB_Fight_Cartoon_Contact.json` (0.2). `KFB_Fight_Combos.json` (0.1) wird nicht gelesen.
- Laufzeitregeln sind umgesetzt wie im Brief: Kugel/Kapsel-Trennung, Hit-Stop, Squash, Puff, Rückstoß um die Hüfte. Dazu die Rückstoß-Sperre als Reparatur, die Staubwolke und der Schulterwurf (nur Brute vs Brute).
- 3D-Inline-Editor: das Menü am Objekt mit Snap. Einbauweg für Studio und ToolBox in `docs/EDITOR_3D_INLINE_01.md`. Die Einbauten selbst sind nicht gebaut.

## Arbeitsvorrat, Reihenfolge nach Wirkung

1. **Staubwolke neu staffeln (F4):** Blickrichtung aus den Kampfdaten statt aus dem Katalog, ein Zusammenprall-Beat (Hit-Stop und Puff), die Wolke wächst aus dem Puff, A schaut beim Auswurf zum Fallenden.
2. **Boden-Lift für liegende Posen (F5):** Tiefpunkt aus Probe-Vertices, bis auf 3 cm × Maßstab anheben, Studio und Diorama.
3. **Ring nach Rig-Maßstab (F3).** Der Seil-Rückprall ist eine eigene Entscheidung.
4. **Combos einzeln mit Georg durchgehen (F1)**, Urteile exportieren.
5. **Blender-MCP-Punkte (F2):** Requisiten- und Selbstkollision als Daten, Lift je Liegepose, Blickrichtungs-Konvention.
6. M1-Messung für S14 und S15 (fps, Kosten je Schicht, Schatten-Gate).

## Regeln, die gelten

Keine Physik, kein Ragdoll, keine Mesh-Kollision, kein IK, kein Retiming. Bekannte Grenzen bleiben sichtbar. Ein Umsetzungslauf plus höchstens eine Reparatur je benanntem Gate.

## Next Gate

**Georg spielt das Beweis-Set in S15 mit dem Feedback-Dokument daneben und exportiert seine Urteile (JSON).** Erst danach wird die Staubwolke neu gebaut und der Blender-Auftrag geschrieben.
