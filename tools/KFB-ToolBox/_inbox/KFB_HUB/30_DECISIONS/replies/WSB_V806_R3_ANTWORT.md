# WSB · V-806 nach Kritiker-Runde 3 · Weg (c) · WS0 · 25.10.2026

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Die drei Wege aus deinem Bericht** (Begriffe für alle weiteren Rückmeldungen):
- (a) sanft bleibt: Stand Runde 3, also Meshy-Teile Zug 0,8 und Kit-Teile 0,85, Deckel ΔE00 ≤ 18 nach der Deckel-Regel, dunkle Flächen ≥ 5 (V-286, V-806 mit Nachträgen).
- (b) „Rolle voll“: Zug 1,0 auf Farbton und Sättigung für Rollen-Teile auf Meshy-Bühnen.
- (c) Flächen-Codes und Fokus, unabhängig von (a)/(b). **Nur (c) baust du jetzt**, nach V-808 (Nachtrag zu V-806):
  - Ein Code gilt je zusammenhängender Fläche: Flächen, die über Kanten verbunden sind und deren Normalen höchstens 35° vom Mittel der Fläche abweichen. Der Code der Fläche ist die Mehrheit der Textur-Codes darin. Das gilt für Sockel, Treppen, Felskörper und Kappen, nicht nur für steile Wände.
  - Die Ausnahmen aus V-806 gehen der Mehrheits-Regel vor: Schlanke Türme und Amphitheater-Bögen bleiben `tower` (V-402), Bewuchs bleibt `leaf`, Boden bleibt Boden, Steinkit, Fluff und Kayfabrick bleiben unberührt.
  - Fokus bleibt genau ein Teil je Bühne (CANON Gebiet 16). Wo es einen Bühnen- oder Billboard-Rahmen gibt, ist es der ganze Rahmen einschließlich der Einfassung der Bildschirmkante als eine Fläche; die Karten- bzw. Bildschirmfläche selbst bleibt ohne Rolle (V-329). Ohne Rahmen ist es das zentrale Wahrzeichen. Nur dieser Teil trägt `pad`; der Rahmen ist damit nicht mehr `strang`. Das Konzeptblatt `replies/FARBROLLEN_KONZEPTBLATT_WSB.md` ist entsprechend ergänzt.

**Giza** wird nicht neu gebaut. Es geht nach der Stopp-Regel zurück aufs Konzeptblatt, und das schreibt WS0. **Atlantis** ist bestanden und bleibt unverändert.

**Ausnahme Kritiker:** Bis Georg zwischen (a) und (b) entschieden hat, gibt es keine Kritiker-Runde 4 und keinen weiteren Dreh am Zug. Die Abgabe von (c) ist deshalb ein Diagnoseblatt nur für WS0 und geht nicht in den Hub.

**Rückgabe:**
- Diagnoseblatt mit Theater, Prison und MesaIsland_A_faithful. Je Motiv drei Spalten: ungetönt · Runde 3 (r806d) · (c) mit Zug wie in Runde 3, beide Paletten.
- Das Farbrollen-Gate, mit dem Runde 3 lief (`50_BLENDER/V803_FARBROLLEN/scripts/farbrollen_gate*.py`; `kfb_env_bpy.run()` passt für reines Umfärben nicht), grün für die drei Fassungen und erweitert um die Prüfungen aus V-808: ein Code je zusammenhängender Fläche, Code 5 nur an der Fokus-Fläche; die Ausnahmen aus V-806 lässt auch das Gate aus. Dazu Asset-Pass (Gate M5).
- In RETURN.md eine Zeile je Bühne: welche Teile jetzt als eine Fläche gelten und welches Teil der Fokus ist.
