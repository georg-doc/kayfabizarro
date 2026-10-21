# BRIEF · Wasser im Spiel: Seen, Flüsse, Unterwasser + Fahren im Wasser · R1 · 2026-10-22 · WS0 → WS1 (dritte Sitzung)
**Register:** V-631, V-621. Läuft parallel zum MVP auf eigenem Branch `ws1/water-r1`, basiert auf `ws1/mvp-r1`. Eingebaut wird über den Lead.

**Tier 0**
1. **Use what works:**
   - Claude-Design-Wasser F0–F2 inkl. Ufer (V-052, „auf keinen Fall verlieren“);
   - die Wasser- und Tusche-Teile, die schon in `ws1/mvp-r1` stecken (hydro aus WS-NPC);
   - Gelände-Bake;
   - ein Licht-Rig (V-385).
2. **KISS:** Wasser ist eine Fläche mit Shader plus wenigen Kräften am Wagen. Keine zweite Physik-Engine, keine echten Lichter.
3. **Leistung:** ≤ 1,5 ms für Wasser im Bild, Ziel 60 fps auf Georgs Rechner.

## Block
**Schritt 1 · Seen und Flüsse** (WS1-Backlog):
- kleine Seen mit gezacktem Rand und olivem Saum (Nahsicht);
- Flüsse mit Ausfransen an Fällen und Mündungen;
- Platzierung aus dem Gelände (Senken, Täler).

**Schritt 2 · Unterwasser-Ansicht:**
- Farbe, Nebel und Lichtflecken über das eine Rig;
- Blasen;
- weicher Übergang an der Oberfläche.

**Schritt 3 · Fahren im, unter und über Wasser** (Backlog A, V-621):
- **Physik:** Auftrieb und Widerstand am Wagen; Übergänge Land → Wasser → unter Wasser; Sprung aus dem Wasser.
- **VFX:** Bugwelle, Kielwasser, Spritzer beim Eintauchen.
- **SFX:** Fehlende Klänge als Liste an WS0, WS0 erzeugt sie.
- **Kamera:** über Wasser etwas höher; beim Abtauchen weicher Wechsel; unter Wasser näher und ruhiger.

**Prüfbild:**
- Kontaktbogen: See nah und fern, Fluss mit Fall, Unterwasser;
- 60-s-Fahrclip mit Ton (rein, durch, unter, raus);
- fps-Tabelle.

**Kritiker:** am Ende ein blinder Sub-Agent (CRITIC_3D_R1).

**Grenzen:** Kanon unverändert. Kein Merge. Private Dateien nie öffentlich. **Meldung:** `ws1/audits/WATER_R1.md` + Kurzstatus an WS0.
