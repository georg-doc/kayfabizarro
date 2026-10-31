# Auftrag WS1 · Uferlinien im Wasser · WS0 · 31.10.2026 (V-1102, N-015)
Georg: Am Ufer fehlen die cartoonigen auslaufenden Linien. Das ist eine zusätzliche Ebene neben dem Fluid, keine Änderung am Fluid.

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Für diesen Auftrag (WS0-Entscheidung):** Laufzeit-Code im Spiel, Gate sind die Tests des Schalters plus Pflichtliste. Blinder Kritiker eine Runde, nur für Form und Muster. **Konzeptblatt (WS0):** Das Ufer zeigt, dass das Wasser lebt und aufs Land läuft; der Spieler sieht zuerst die Linie an der Kante, dann das Wasser. Form: wenige breite, unterbrochene Linien, die der Uferform folgen. Verboten: gleich breiter heller Saum (Kanon Gebiet 17), aufgemalte Linien, Textur. Kameras: Spielkamera, Bodennähe am Ufer.

**Vorlage (nur die Logik, kein Code, V-092):** Eine Kontur aus dem Abstand zum Land: `fract((abstand + kleine Welle) × dichte − zeit × tempo)`, daraus eine weiche Linie per `smoothstep`. Mit zunehmender Tiefe früh ausblenden. Das ist die Grundlogik unseres Farbbands in `terrain3`.

**Bau:**
- Eine eigene Ebene hinter `shore=lines`, die `vShore` und die Fließrichtung aus `src/look/kfbWater.js` liest. Der Code von `kitFluid` bleibt ohne Schalter unverändert, das Wasser sieht ohne Schalter gleich aus.
- Farbe wie die Gischt: helle, weißliche Fluidfarbe. Die Linien folgen der echten Uferlinie aus dem Gelände.
- Reihenfolge: mit Wasser R2 (Nähte). Georgs direkte Korrekturen an dich gehen vor.

**Beweis (V-1100):** Einzelbilder aus dem Spiel, kein Sammelblatt: nahes Ufer am See, Fluss, Spielkamera, je mit und ohne Schalter, dazu ein kurzes Video, weil die Bewegung das Entscheidende ist. Meldung im Kanal mit Kritiker-Wert, WS0 holt Georgs Urteil im Hub ein.
