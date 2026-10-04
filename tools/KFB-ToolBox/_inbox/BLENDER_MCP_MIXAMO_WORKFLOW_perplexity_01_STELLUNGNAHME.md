# Stellungnahme · BLENDER_MCP_MIXAMO_WORKFLOW_perplexity_01

**Von:** Coworker (Claude) · **Datum:** 2026-09-24 · **Status:** Vorschlag für später, keine Umsetzung beauftragt

**Kurz:** Als Plan für später gut, vor allem die festen Werkzeuge und die automatischen Prüfungen. Einen großen Umbau braucht es nicht, das Fundament steht schon (Motion Library 01, PR #197). Offen bleibt eine Lizenzfrage, die Georg entscheidet.

## Haben wir schon (Motion Library 01)
- Original-FBX bleiben in der Dropbox (`BLENDER MCP/MOTION_LIB/`), nicht auf GitHub.
- Ein gemeinsames KayKit-Skelett (23 Knochen), Übertragung auf Rig_Medium und Rig_Large per Skript (`source/ml_bake.py`).
- Katalog als Datei (`kfb.motion-catalog.v1`), Kontaktbögen pro Clip, Ladetest mit three.js r169.

Das Papier beschreibt im Kern, was schon läuft.

## Lohnt sich zu übernehmen
1. **Feste Werkzeuge statt jedes Mal neuer Code:** die vorhandenen Skripte als wenige benannte Befehle verpacken („Clip übertragen“, „Loop schließen“, „Clip prüfen“, „veröffentlichen“). Ergebnis: weniger Aufwand pro Clip, gleichmäßigere Qualität.
2. **Automatische Prüfungen pro Clip:**
   - Fußrutschen (Füße sollen am Boden stehen bleiben)
   - Sprung an der Loop-Naht
   - Option „am Ort bleiben“ oder „vom Fleck bewegen“ (Wurzelbewegung)

   Das hätte `climb_to_top` und `thriller` (Loop-Abweichung > 6°) sofort markiert.
3. **Zwei Prüfstufen:** „streng“ für realistische Bewegung und „cartoonig erlaubt“ für übertriebene. Das passt zu KFB.
4. **Kategorien** (Idle, Gehen, Kampf, Gesten …) sind später für die Figuren in der Welt sinnvoll. Die Katalogfelder dafür können wir ergänzen, ohne die IDs zu ändern.

## Widerspruch zu einer bestehenden Entscheidung (Georg entscheidet)
- Das Papier empfiehlt, übertragene, extrahierbare Animationen **nicht** öffentlich ins Repo zu legen.
- Im Animation-Intake 01 (§2) ist festgelegt: Laufzeit-GLBs liegen mit `NOTICE.md` im öffentlichen Repo.
- Das ist eine Frage der Adobe/Mixamo-Nutzungsbedingungen. Das Papier selbst rät, sie zu prüfen. Empfehlung: einmal bewusst gegenprüfen, nicht einfach umbauen.

## Würde ich nicht (jetzt) machen
- **Blender-Anschluss wechseln** (dcc-mcp-blender mit lokalem Server auf 127.0.0.1:9765): Das ist ein zweites System mit zusätzlichem Aufwand, und der jetzige Anschluss funktioniert. Wenn überhaupt, dann später getrennt testen.
- **„Stil-Profile“ für Large** (etwa Arme um einen festen Faktor verlängern): Die Zahlen sind ausgedacht [These]. Der Resident Atlas hält fest, dass Large eigene Animationen braucht. Ein Nachbearbeitungs-Schritt taugt also als Experiment, nicht als Lösung.
- Die Angaben zu Rokoko und Auto-Rig Pro sind nicht belegt und von mir nicht geprüft.

## Mögliche nächste Schritte (nur auf Georgs Auftrag)
1. `ml_bake.py` in drei Befehle aufteilen: übertragen, prüfen, veröffentlichen.
2. Die Prüfwerte (Fußrutschen, Loop-Naht) für alle 33 Clips messen und in `RETURN.md` ergänzen.
3. Lizenzfrage zu den GLBs im öffentlichen Repo: Georg entscheidet.
