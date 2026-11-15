Für Claude Design (Website-Chat) · Nachtrag 8: neue FB-Datei r1h, Schnittliste des Choreografen, Tänze und Erklär-Gesten · 15.11. (WS0, V-1808, V-1818)

**Neue FB-Datei:** `FB_WEB_KANON_agent_twin.r1h.glb` (Repo `georg-doc/KFB-Stunt-Car-Race`, Zweig `assets/private` @72d3701c, Ordner `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/`), 96 Clips, Messblatt `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1h.md`. Sie ersetzt r1f/r1g, ihre Clips sind gleich geblieben. Neu sind:
- **Katana (aus r1g):** `Melee_1H_Attack_Jump_Chop`, `Melee_2H_Attack_Spinning`, `Melee_2H_Attack_Spin`, dazu a1 und b1, Messwerte (Kontakt, Spitzenhöhe) in `RETURN_r1g.md`.
- **17 Tänze:** Georgs Wahl, geschlossene Schleifen mit Takt (bpm, beatsPerLoop, downbeatS), dazu Ein- und Ausstieg für die Posen k7/k8.
- **Erklär-Gesten:** 12 Gesprächs-Clips, auf FB übertragen und repariert, plus d1, d2, d5–d8. Die Rolle je Clip (zeigen, zählen, abwägen …) steht im Messblatt, abgeleitet aus dem Katalog.

**Hero-Shot: Schnittliste des Choreografen** (`replies/WEB_KANON_R2/CHOREO_R2D_AUSWAHL.md` und `fb_katana_hero_v9.choreo.json`, Register-Repo wie die Nachträge):
- Schnitt 1–4: Kette `Jump_Start` → `Melee_1H_Attack_Jump_Chop` → `Jump_Land` als fallender Hieb aus dem Sprung. Das starke Bild ist das Ausholen in der Luft.
- Schnitt 5: `FB_Katana_dash` → `FB_Katana_waagerecht`. Der echte Kontakt liegt bei 0,27 s; 0,50 s war schon das Ausschwingen.
- Schnitt 6–8: Kette `Jump_Start` → `Melee_2H_Attack_Spinning` → `Jump_Land` am Scheitel, Kontakt bei halber Drehung, Kamera seitlich. Das ist ein Notbehelf, bis ein echter Luft-Hieb mit Drehung da ist; Georg lädt dafür Mixamo-Clips.
- Zeitlupe bei Schnitt 1, 5 und 8, nur im Ausholen, mit Speed-Ramp, Hit-Stop 48 ms und Kamerastoß je Schnitt; alles als `zeitspur` und Ereignisse in der Choreo-Datei. Die Datei nutzt Zusatzfelder (`ab`, `kette`, `nahtOffen`, `zeitspur`, `bahn`, `kamera`); deine Schicht liest sie, der Player kennt sie noch nicht.
- Die Kartenkante bleibt auf der Tuschelinie (Nachtrag 7).

**Tänze im Leerlauf (Georg 15.11.):** Wenn FB gerade nichts erklärt, tanzt er. Nimm die Tanz-Schleifen im Takt der laufenden Musik. Das Takt-Signal hat dasselbe Format wie im Spiel (`kfb.audio-presentation-pulse/1`: `transport.bpm`, `beatPhase01`, `barPhase01`). Ein Tanz startet auf der Takt-Eins, Abspielrate = Musik-Tempo / Eigentempo (auf 0,8–1,25 gefaltet), Wechsel nach einigen Takten, wie `src/life/idleDance.js` im Spiel.
- **Bodenausgleich:** Je Tanz und Bild hebt `50_BLENDER/FB_WEB_KANON_R1/data/r1h/bodenausgleich_fb_r1h.json` (auch .csv) FB an, damit er nicht einsinkt. Die Clip-Spur bleibt unverändert, du wendest die Tabelle beim Abspielen an.

**Erklären (Regel-Guide, FAQ, Onboarding):**
- Nimm die Erklär-Gesten nach ihrer Rolle im Messblatt.
- Nicken, Kopfschütteln, Kopf wiegen sowie d6 und d7 haben im Clip einen starren Kopf. Den Kopf gibt die Haltungs-Schicht: `kfb-haltung.reaktion('nicken' | 'kopfschuetteln' | 'schulterzucken')` aus dem Mimik-Paket (Nachtrag 6, V7-Antwort).
- `dismissing` und `shrug` sind Einmal-Clips, keine Schleifen.
- Klatschen ist für FB nicht nutzbar, die Hände treffen sich nicht; eine eigene Fassung kommt später.
- d3/d4 (Sitzen) sind eine Lücke, ohne Stuhl sitzt FB in der Luft.
