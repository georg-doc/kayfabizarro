# RETURN · World Core R2A→R2C · Clay-Gate FACADE-A/B-01 · 2026-10-01

Status: **R2C CANDIDATE · Georg: „sieht gut aus“** · Gate FACADE-A/B-01: **MATCH (Georg)** für v10-Parität.

## Probleme zuerst
1. **fps nur in der Claude-Vorschau gemessen** (gedrosselt, Software-Rendering). Georg-Gerät: R2B ≈ 31 fps, Stand GPT-Analyse ≈ 56 fps · 71 Calls · 354k △. R2C hat mehr Batches (≈ 85 Gruppen, 90–186 Calls je Ansicht). Kein belastbarer Messlauf auf GPU für R2C.
2. **Inselweg-Glättung konvergiert nicht immer** (`relax` Inseln = 500 = Abbruch). Die Streckenglättung danach erreicht in 8/8 Testsaaten ≥ 22 m Radius und 0 Kreuzungen; ein Rest-Knick ist möglich, wird im HUD als „Kreuzungen“ und „Glättung“ angezeigt.
3. **Looping bleibt Sondergeometrie** (fest, von der Glättung ausgenommen). Für Fahrphysik braucht er einen Schienenmodus (siehe HANDOVER).
4. **Quaternius-Berge entfernt** (brauner Saum = lose Dirt-Komponenten). Datei bleibt als Asset.
5. **Joyride-Rückseiten-Deformation** nicht im Insel-Kontext geprüft (anderer Deformer).
6. **building_E** nicht durch das Gate (Matrix: erst nach building_A-PASS, jetzt frei).
7. **Atlas→Palette**: Farbklassen per Farbton geschätzt (grass/dirt/stone/leaf/water/sand/snow). Fehlklassen möglich bei neuen KayKit-Teilen.

## Was läuft
- **Hex-Archipel R2C**: 4 Hauptinseln + 7 Trittsteine, Ring Burg → A → B → Looping → C → Burg, Kosmos-Layout aus R1A.
- **Katalog** KayKit Medieval Hexagon Pack 1.0 FREE vollständig geprüft (tiles 54, nature 42, buildings, props); 28/28 genutzte Teile laden.
- **Bau-Logik nach Promo / Nature Usage Guide**: Höhenstufe = 1 Kachelhöhe (`hex_grass` auf `hex_grass_bottom`), je Plateau eine Rampe `hex_grass_sloped_high`, Polster `hill_single_A–C` an Stufenwänden, Berge/Hügel/Wälder je EINE Zelle.
- **Unterseite**: ein Felskörper je Insel aus der äußeren Kontur (keine Hex-Säulen).
- **Strecke**: Inselweg als Bézier senkrecht rein/raus, Ein-/Ausgang ≥ 120° gespreizt, Mindestradius 22 m, Kreuzungsprüfung (0 in 8 Saaten). Rot-Weiß je Bordkante in ganzen Streifen (≈ 4,5 m, Runde geht auf), keine Anschnitte.
- **Knete**: K2/v10 auf K1-Parität (Gate MATCH), Fingerabdrücke nur im Nah-Band.
- **Schatten**: LESSONS_SHADOWS-Rezept (`lab-world/shadow-fit.v1.js`): Gate = gepasst + texelgerastet + MSAA 4; Welt = shadowFollow.
- **UI**: Resident-Atlas-S7-Schale (Kopfzeile mit ‹ ›, Leiste, „Nur Ansicht“).
- **Wolken**: Jarlan-Perez-GLB in 5 Komponenten, Taubin-geglättet.

## Gate FACADE-A/B-01 (building_A)
| Kandidat | Δ | Detail | Urteil |
|---|---|---|---|
| v10 · R2A-Einstellung | 2,7–5,9 | 0,82–0,87 | TUNE |
| v10 · Parität | 2,5–3,3 | 0,97–0,99 | **MATCH (Georg)** |

## Pfade (Export-Hygiene)
- Umgestellt auf jsDelivr @main (01.10., geprüft 200): Fingerabdruck-Textur (H0-Paket `external/`), Jarlan-Perez-Wolken, Quaternius-Berge (nur R2A/R2B).
- KayKit, building_A, Deck-Cover: waren schon RAW/jsDelivr.
- Code-Module (`lab-clay/*`, `sky-core`, `bb-scene`) bleiben relative Imports und liegen im letzten Cut.

## Offen für Georg / WSA
- Owner Track-Format: R2C-Sweep oder T4-Strang (TD03) als kanonisch?
- Looping: Schienenmodus ok?
- Messprotokoll R2C auf Georg-GPU (Baseline für Korridor).
