# KFB Ink + Cartoon Mechanics v1 · Outline, Gummi, Tube, Augenbraue

Status: **PLANNING BRIEF · FOUR ISOLATED PROOFS FIRST**  
Datum: 2026-09-19  
Visual source of truth: vorhandener KFB-Ink-Kanon, nicht neu erfinden

## Ausgangspunkt

Die frische [TE-01 OSM Depth + KFB Ink Stage](https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/te01-osm-depth-ink/) ist ein **technisch getesteter Kandidat**, keine visuell freigegebene Live-Baseline. Sie belegt die bestehende Ink-Linie für OSM-World-Elemente; die menschliche Motion-/Art-Freigabe steht noch aus.

Zuerst lesen:

- `skills/kfb-ink-canon.js`
- `skills/SSOT_Card_Ink_Outline_v2.md`
- `skills/SOP_kfb_ink_v1.md`
- `media/kfb/KFB_INK_OUTLINE_STYLE_v2.md`
- `kfb-hub/stage/stunt-world/te01-osm-depth-ink/PROVENANCE.md`
- `skills/session-entry-use-what-works_v1.md`

## Vier kleine Beweise

### IM1 · Ink als Welt-Lesbarkeit

Bestehenden Ink-Kanon auf einen OSM-Rand, ein Landmark und eine Card-/Wayfinding-Fläche anwenden. OFF / INK / BEND vergleichbar machen. Kein neuer Shader- oder Outline-Owner.

### IM2 · Gummi-Bande

Eine echte Race-Barrier als **visuelle** Federreaktion: Treffer → Squash/Stretch → Rückstellung. Physischer Kontakt, Fahrzeugantwort und Audio bleiben bei ihren bestehenden Owners. Der Effekt ruft höchstens einen klaren Ereignis-Hook auf; er ersetzt niemals Kollisionsphysik.

### IM3 · 3D-Tube

Ein sichtbarer Tube/Schlauch als Rail, Kabel, Wegweiser oder Portal-Spur. Sichtmesh und Kollisions-/Fahrkurve bleiben getrennt. Erst ein gemessener Anker beweist Befahrbarkeit; keine Mesh-Kollision nach Gefühl.

### IM4 · Augenbrauen-/EyeRig-Reaktion

Der bestehende EyeRig/FaceHost bekommt nur eine lesbare Emotion bei Sprung, Treffer, Nähe oder Quest-Hinweis. Er steuert weder Fahrzeug noch Trefferlogik. EyeRig Batch ist die Quelle für Profil/Calibration; die Game-Mechanik konsumiert ein kleines Ereignis.

## Integrationsregel

Nach vier isolierten Stage-Proofs folgt höchstens **eine** Cross-Integration: Race Barrier + Ink + kurzer EyeRig-Reaction-Hook. Jeder Teil behält seinen Owner. Keine “KFB vibe”-Megaklasse und keine Ersatzgeometrie.

## Lieferung

Je Proof: feste Stage-URL, `SOURCE.json`, ein Screenshot vor/nach, Browsercheck, klarer Owner-Satz und ein menschlicher Look-/Lesbarkeits-Gate. Erst danach wird ein Teil in die Race-World-MVP-Slice vorgeschlagen.
