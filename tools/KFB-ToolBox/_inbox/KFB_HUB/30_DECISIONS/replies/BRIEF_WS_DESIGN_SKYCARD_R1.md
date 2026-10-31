# Auftrag WS-Design · Sky-Card als Deck-Landmarke · WS0 · 31.10.2026 (V-1102, ergänzt V-173, V-1002)
Georg: Über einem Kartenviertel soll das Deck von weitem lesbar sein. Statt Billboards nehmen wir die schwebende Karte aus dem Card Zone Lab v2, die ihm dort gefallen hat.

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Für diesen Auftrag (WS0-Entscheidung):** Laufzeit-Code im Spiel, Gate sind die Tests des Schalters plus Pflichtliste. **Konzeptblatt (WS0):** Das Viertel zeigt, welches Deck hier lebt; der Spieler sieht von weitem zuerst die schwebende Karte, dann das Viertel. Form: echte Karte mit Kanon-Kante, Schleier statt Säule. Verboten: Billboard-Gestell, Kegel, Lichtsäule, Linien. Kameras: Spielkamera fern und nah.

**Vorlage:** `~/Dropbox/CLAUDE/KFB Card Zone Lab v2/card-zone-lab-v2-full_2026-09-22/KFB Card Zone Lab v2.dc.html` als Code, Bild `KFB Card Zone Lab v2/KFB Style References/Card Zone Lab v2 Bildschirmfoto 2026-09-22 um 01.13.13.png`. Übernimm aus dem Lab:
- den Schleier (`holoU`, ab Zeile 1208): vier wabernde Bahnen von den Zonenecken zu den Kartenecken;
- `tickCard` (ab Zeile 2240): Zero-G-Drift, träge zur Kamera, aus der Nähe ruhig;
- das Aufdecken bei Annäherung. Eine eigene Drehung der Karte kommt nur dazu, wenn sie aus der Ferne hilft; `spin` im Lab ist die Kamera.
Nachbauen heißt übernehmen, kein neuer Entwurf.

## Bau auf `design/kartengebaeude-r1`, hinter `skycard=1`
- Ein Modul, das eine Karte und eine Zone nimmt. Inhalt ist das Cover des Decks, aus demselben Weg wie der Deck-Viewer; Kante aus `module/card-edge-r1` (Stand a8554963, noch nicht im Stamm; prüfe die ferne Karte, die dort ungeprüft ist).
- Größe und Höhe so, dass die Karte aus der Spielkamera von weitem lesbar ist und nichts verdeckt. Du entscheidest sie selbst nach Bild.
- Die Karte läuft über das eine Rig (V-385). WS0-Entscheidung auf Georgs Wunsch nach dem Kraftfeld: Der Schleier ist ein Effekt wie im Lab und darf additiv leuchten. Er wirft kein Licht auf Figuren oder Boden. Er nimmt die Farben der Viertel-Palette.
- Viertel heilen (V-1002): Ist das Viertel geheilt, sinkt die Karte in den Almanach mit dem vorhandenen Kartenflug. Fehlt dafür noch der Auslöser, melde das, und zeige es per Testknopf.
- Der Cover-Aufsteller bleibt, bis Georg geurteilt hat. Modelle ändert nur WSB (V-1065).

## Rückgabe an WS0, dann Stopp
Einzelbilder in voller Größe (V-1100): von weitem aus der Spielkamera, vom Rand des Viertels, darunter stehend, dazu ein kurzes Video mit Drift und Schleier. Je Bild ein Satz, was abzunehmen ist. Messung gepaart mit und ohne `skycard=1` über das 1×1-Readback-Tor (`gpuGate` in `spike/main.js`, V-1094, V-1097), gleiche Kamera, dpr 1, ohne HUD, Fremdlast nennen; Unterschiede unter 20–30 % gelten als nicht belegt (V-1090). Branch, Commit, Tests, was ungeprüft ist. Kritiker höchstens einmal, eine Reparaturrunde je Befund. Merge nur mit Georg.
