# BRIEF · MVP: ein Spiel-Branch + Site · R1 · 2026-10-21 · WS0 → WS1-Lead
**Register:** V-618. Grundlage: `replies/MVP_SITE_STATUS_R1.md`. Georg 21.10.: „ja, das passt“.

**Tier 0**
1. **Ein lauffähiger Spiel-Branch** aus `terrain/probe-world` + `ws-npc/*` + `ws-audio/*`, danach die Arena-Module. Use what works: nichts nachbauen, nur zusammenführen und einhängen.
2. **Als Site (geändert, V-624):** WSA work baut die Stage wieder als GPT-Site wie zuvor, mit privatem Abruf serverseitig wie WS1-Staging. Kein Cloudflare-Pages-Projekt. Der Lead liefert den Spiel-Branch.
3. **Spielbar auf Georgs Rechner:** 60 fps als Ziel, Qualitätsstufe bzw. dpr-Deckel. Abnahme durch Georg im Browser.

## Block
**Reihenfolge:**
1. **Zusammenführen** in `ws1/mvp-r1`:
   - Konflikte in `package.json`, `m1-terrain.js` und `M1World.jsx` lösen.
   - WS-NPC und WS-Audio liefern die Auflösung ihrer Teile auf Nachfrage.
   - Vertragstests aller Teile grün.
2. **Figuren aus `cast.r1.json`:**
   - die Dioramen-Besetzung: 8 Tänzer, FrizzleBob am Pult, 4 Orks mit Leader;
   - Fluffer mit `heightM 0.8`.
   - Private Dateien nur aus dem privaten Branch.
3. **Ton:** alle Sätze aus `<set>_lufs/`, neu sind `npc_steps_r1`, `heavy_steps_r1` und `combat_av_fix_r1–r3`. Musikbett je Ort, Einbau durch WS-Audio.
4. **Kampf:** Arena-Module (PR #24/#25/#27) und die Combat-AV-Prototypen mit Georgs PASS (`ws1/combat-av-r1`).
5. **Leistung:** Qualitätsregler (dpr 1 / 1,5 / 2), Messung mit `tri-count` und fps aus der Spielkamera.
6. **Einstieg:** Startseite mit Lade-Balken, Steuerungshilfe, Ton- und Qualitätsregler.
7. **Site:** WSA work baut die GPT-Site bzw. Stage aus `ws1/mvp-r1` (V-624). Der Lead nennt WSA den Stand, der gebaut werden soll.
8. **Danach** ein blinder Design- und Gameplay-Kritiker auf dem Build: erste 10 Minuten als fremder Spieler, Bericht an WS0.

**Grenzen:** Kein Merge in `main` ohne Georg. Private Dateien nie ins öffentliche Repo. Fehlt ein Teil, meldet ihr es an WS0.

**Meldung:** `WS1_STATUS.md` oben mit Site-Link, fps-Tabelle und den offenen Punkten.
