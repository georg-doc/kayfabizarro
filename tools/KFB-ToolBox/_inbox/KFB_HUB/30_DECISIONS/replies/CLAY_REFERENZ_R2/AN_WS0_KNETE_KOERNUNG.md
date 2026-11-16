An WS0 · Knete: v1.1 bleibt, dazu Körnung ×3 · Georg 16.11. · ersetzt AN_WS0_V13.md

Von WS-Design (Chat „Claymation Look & Animations“). Auftrag war BRIEF_CD_KNETE_V13_R1 (q718, V-1839, V-1840).

**Georgs Entscheidung (16.11., im Chat):**
- Das heutige kfb-clay v1.1 bleibt die Basis. Georg findet es aus der Weite mit seinen gut verteilten Dellen am überzeugendsten.
- Dazu kommt eine Körnungsschicht: feine Poren und Krümel, feine dunkle Sprenkel und eine leichte Farbverschiebung innerhalb des Materials, in Größe ×3, „kleines Knetpüppchen“.
- v1.3, Texturen als Relief-Ersatz und Geometrie-Verformung gehen nicht weiter. Der Schalter `knete13` wird nicht gebraucht.

**Die Körnungsschicht (so im Stilbild abgenommen):**
- **Körnung:** Normal-Karte ambientCG Ground026 (CC0), triplanar im Objektraum, ohne UV.
  - Kachel 1,5 Figurenhöhen, Stärke 0,35. Das Korn liegt bei ≈ 0,4 % der Figur.
  - Datei: `replies/CLAY_REFERENZ_R2/assets/Ground026_1K-JPG_NormalGL.jpg`, Nennung in `assets/CREDITS.md`.
- **Sprenkel:** 5 % der Zellen, Zelle 1,05 % der Figurenhöhe, 30 % dunkler. Sie blenden aus, sobald sie kleiner als ≈ 1 px werden.
- **Farbverschiebung** in OKLab: Farbton bis ±0,14 rad und Helligkeit ±5 %, in großen und mittleren Flecken (0,22 und 0,09 Figurenhöhen).
- **Code:** `replies/CLAY_REFERENZ_R2/knete_v13.html`, Funktionen `KFB_COMBO`, `grainPatch`, `COL_MAIN`, `TRI_DECL`/`TRI_MAIN`; Lauf mit `tests/render_combo.mjs`. Das ist Harness-Code, noch kein Modul.
- **Bilder:**
  - `replies/CLAY_REFERENZ_R2/evidence/combo_gesicht_heute_x1_x2_x3.jpg` (Georg wählte ×3)
  - `evidence/combo_ganz_x3_c1.jpg`
- **Geprüft:** Kanon-Wache FB r1j PASS (Knete nur auf der Haut).
  - Gates G0–G5 liefen für die Schicht noch nicht. G2 (Streifen) und G4 (Auflösung) muss das Modul bestehen.

**Bitte:**
1. **Kanon Gebiet 8 öffnen:** Bisher arbeitet das Knete-Modul ohne Texturen. Die Körnung ist eine Karte im selben Modul, kein zweites Modul. Dafür braucht es eine Register-Zeile und eine Kanon-Zeile.
2. **Schicht ins Modul bringen:** als nächste kfb-clay-Version, v1.1 bleibt byte-gleich.
   - Neue Stufe „Körnung“ hinter einen Schalter, im Spiel zunächst aus. Sie blendet mit dem Abstand aus wie die Bänder.
   - clayBake bleibt wie heute; die Körnung läuft live (drei Textur-Abrufe je Pixel).
3. **Abnahme im Spiel:** mit Spielkamera und von vorn, mit FB-Kanon-Wache, dann eine Hub-Karte.
4. **Bauen oder WSB:** Wer baut das Modul, WS-Design oder WSB? Sag Bescheid.

**Befunde unterwegs:**
- **Mund-Quadrat in meinen Bildern** war ein Fehler meiner Testbühne: Die durchsichtige Mundkarte `FB_Mund_closed` warf Schatten. Im Spiel ist das schon richtig (V-1773, `faceMountActor.js`: nur Nase und Brauen werfen Schatten). Im Harness ist es behoben.
- **Heller Saum an der Nasenbasis:** Die Clay-Testbühne (`CLAY_SSOT_R1/proof-kit.v1.js`) nutzt noch `kfb-stage-light.v1`. Genau dessen Schattensaum ist in v1.1 behoben (Proof-Stage G6). Für die Körnung spielt das keine Rolle; die Bühne sollte bei Gelegenheit auf v1.1 umziehen.
- **Auch r1j trägt noch die alten Extras** `userData.kfbClayOrig` an `KFB_Tail_Bunny` und `KFB_Shirt_FB`. Ich verwerfe sie beim Laden; säubern muss sie WSB.

**Hintergrund (nicht weiterverfolgt, nur zum Nachlesen in `replies/CLAY_REFERENZ_R2/`):**
- `RETURN_v13_stilbild.md`: Stopp-Bericht v1.3 (zwei Kritiker REWORK, keine Löcher mehr, zu wenig Knete);
- `TEXTUR_TEST_R1.md`: fertige Knete-Texturen; keine trägt allein;
- `PROTOTYP_VERFORMUNG_R1.md` und `KNETMODELL_R1.md`: Tutorial ausgewertet, Knetmodell von Georg bestätigt, Abschnitt G = diese Entscheidung.
