# BRIEF WS1 · Cartoon-Terrainkonzept #439 im Spiel · R1 · 2026-10-20 · WS0
**Register:** V-561 (Fokus Spiel), Issue georg-doc/kayfabizarro#439. **Owner:** WS1, wieder aktiv (Georg 20.10.). WS1b macht nur die Vorschau-Startseite und rührt das Terrain nicht an.

**Tier 0**
1. Das ganze Terrainkonzept wird als **umschaltbare Variante** (`look=terrain2`) im bestehenden Spiel gebaut, auf einem eigenen Branch `terrain/439` ab `combo/r2`. Der Standard bleibt unverändert.
2. **Teile:**
   - Banden im J17-Look;
   - glatte Rampen, keine Stufen;
   - organische Farbflächen unabhängig von der Höhe;
   - vorn eine dunklere Tonfläche;
   - echte, mitbewegte Schatten in Palettenfarbe, nur aus dem einen Licht-Rig;
   - keine Blob- oder Scheiben-Schatten.
3. **Nachweis:** Vorher/Nachher mit derselben Kamera und Route, echte Figur und Racer, kurzer Fahrclip über Rampe und an der Bande entlang, Tests grün, p95 gegen das V-370-Budget.

## Block
**Quellen (Register-Branch `docs/kfb-decisions-register-2026-10-11`, Ordner `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/`):**
- `WS0_CARTOON_TERRAIN_PALETTE_SHADOW_DESIGN_R1_2026-10-19.md`: Georgs detailliertes Design, maßgeblich für Farbflächen, Schatten, Tonfläche und Kanten. Dazu den `..._TEST_REPORT_R1` lesen.
- `WS0_COLOURED_3D_SHADOW_MVP_TRIAL_R1_2026-10-19.md` (R1.2): Gesamtumfang inklusive Banden und Rampen.
- **POC für Banden und Rampen (präzisiert 20.10.):** Kein eigener Extra-POC ist belegt (#439: Quelle offen, Ursprung Gespräch „Funktionsvergleich Roadster KFB“ 19.10.). Basis ist, was im Spiel-Repo schon steht (combo/r2):
  - Banden: `src/m2/k2t.js` (Wände, railImpact, Optik wie J17 joyride-drive.j10);
  - Rampen: Stunt-Testfeld `src/m3/stuntData.js` + `stuntField.jsx` (@4701611), Rampen-Zonen M3-F (@8d25d62), Rampe zur Bühne m1-tune (@1befe7c).
  - Die Rampen werden glatt statt stufig. Neue Formen nur mit Georgs Bild; nichts erfinden.
- **Look-Regeln:**
  - J17-Goldstandard V-010; Fahrbahn #3d4a60, Banden #ef5a22 (V-102).
  - Ein Licht-Rig V-385/V-429, Schattensaum V-440/V-447.
  - Farbdrehbuch V-406, Paletten V-305, Sprenkel V-403.

**Reihenfolge:**
1. Banden und Rampen aus deinem POC in die Variante übernehmen; Fahrkontakt mit K2B prüfen.
2. Probe 1, Farbflächen: unabhängig von der Höhe, 3–4 Rollen aus der Palette, eigene Projektion für steile Wände. Fahrbahn und Banden behalten ihre Farben.
3. Probe 2, Schatten: die bestehende Shadow Map, eingefärbt nach der Palette des empfangenden Materials (castShadowTint). Kontakt mit max statt Summe. Gesichter bleiben lesbar. Gibt der Shader keine sichere Naht her, nur diese Naht als SOURCE_REQUIRED melden.
4. Probe 3, Tonfläche und Kanten: die Tonfläche fest im Raum, sparsame Kanten an echten Graten bzw. Bandenköpfen.

**Regeln:**
- Nichts erfinden, was der POC nicht hergibt. Maße in einer Datendatei, damit sie stellbar bleiben.
- Veröffentlichen nur über die `ws1/*`-Branches nach kurzer Meldung an WS0. Kein Merge auf main ohne Georg.
- Nur selbst geprüfte Bilder und Clips an Georg.
- Ports wie bisher; `KFB Open World/` nie anfassen.

**Meldung:** je Probe ein Abschnitt in `WS1_STATUS` (ws1/r3f-frame) mit Bildern A/B.
