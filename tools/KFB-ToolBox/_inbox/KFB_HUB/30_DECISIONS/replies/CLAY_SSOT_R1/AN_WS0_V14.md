An WS0 · kfb-clay v1.4 (v1.1 + Körnung ×3) gebaut · ein Gate knapp rot, Entscheidung nötig · 16.11. (V-1853)

Von WS-Design (Chat „Claymation Look & Animations“).

**Ergebnis:**
- `replies/CLAY_SSOT_R1/kfb-clay.v1.4.js` (sha256 `be49a87f…cd9f`): v1.1 unverändert plus die Stufe „Körnung“, Option `koernung`, Standard aus. v1.1 bleibt byte-gleich.
- **Ohne `koernung`:** derselbe Shader wie v1.1. Pixelgleich über alle 64 Golden-Renders.
- **Mit `koernung`:** Werte aus der Übergabe.
  - Ground026 triplanar, Kachel 1,5 H, Stärke 0,35;
  - Sprenkel 5 % / 1,05 % / 30 %;
  - OKLab ±0,14 rad / ±5 %, Flecken 0,22 / 0,09;
  - Ausblenden mit dem Abstand: Korn voll ab 2,5 px, Sprenkel ab 2,4 px, weg unter etwa 1 px.
  - Nur `character` (kit-figure läuft über den Override mit).
  - Ohne Körnung bleiben Augen, Lider, Mund, Brauen, Nase, Haarbüschel und Shirt. Die Karte kommt per `koernungMap` vom Aufrufer; `handle.setKoernung(on)` schaltet zur Laufzeit.
- **Bühne:** `proof-kit.v1.4.js` mit `kfb-stage-light.v1.1`. Der Saum an der Nasenbasis ist weg, G6 hat 0 px in vier Richtungen.

**Prüfungen:**
- Unit 60/60.
- Golden: G0, G1 (SSIM 1, Abweichung 0), G1b (v14 = v11), G3, G4 und G5 PASS. G5 liegt genau auf der Grenze 0,950.
- Proof-Stage-Art: G1, G2, G3, G5 und G6 PASS; G4 und G7 n/a. Kanon-Wache FB r1j PASS.
- **G2 FAIL nur bei FB in niedriger Auflösung:** 3,011 gegen die Grenze 3,0; in hoher Auflösung 2,80.
  - Ursache gemessen: Die Brauen sind nach V-1853 ohne Körnung, und ihre waagrecht begrenzten Flächen erzeugen im Differenzbild eine Richtung.
  - Mit ausgeblendeten Brauen und Nase liegt v1.4 bei 2,56 / 2,51 und damit gleich wie v1.1 (2,48 / 2,62). Die Körnung selbst macht keine Streifen.
- **Kritiker:** Wegen Tier 0 ist er nicht gelaufen (rotes Gate geht zurück, nicht an den Kritiker).

**Bitte entscheiden (eins davon):**
- **A)** G2 maskiert die Teile ohne Körnung (Grenze 3,0 bleibt). Danach lasse ich den Kritiker laufen.
- **B)** Brauen und Nase bekommen doch Körnung. Das ist eine Kanon-Änderung zu V-1853.
- **C)** Die Ausnahme so akzeptieren und v1.4 direkt hinter `knete14` (aus) ins Spiel, Abnahme im Spiel.

**Dateien:**
- `replies/CLAY_SSOT_R1/RETURN.md`: oberster Abschnitt mit allen Zahlen und der Diagnosetabelle.
- Bilder: `evidence/v14_gesicht_s1.jpg`, `v14_vorn_s1.jpg`, `v14_spielkamera_s1.jpg` (jeweils v1.1 | v1.4 Körnung).
- Tests:
  - `tests/kfb-clay.v1.4.unit.test.mjs`
  - `tests/golden.v1.4.test.mjs`
  - `tests/g2diag.v1.4.mjs`
  - `tests/stilbild.v1.4.mjs`
- Karte und Nennung: `replies/CLAY_REFERENZ_R2/assets/`.

**Fürs Spiel** (wenn du einbaust):
- `kfb-clay.v1.4.js` byte-gleich nach `src/vendor/clay/`.
- Der Wahlschalter in `kfbClay.js` bekommt v1.4. `applyClay` erhält bei `knete14` die Optionen `{ koernung: true, koernungMap: <URL der Karte> }`, nur für Figuren.
- Die Karte gehört ins Spiel-Asset-Verzeichnis, mit Nennung.
