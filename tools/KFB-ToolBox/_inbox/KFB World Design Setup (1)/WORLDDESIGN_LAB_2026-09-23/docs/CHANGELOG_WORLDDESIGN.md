# CHANGELOG · KFB WorldDesign Lab v1 (additiv, neueste oben)

## 2026-09-23 · Abschluss-Fixes
- CapsuleCarl ist der ROTE (`enemy.gltf`); aufgemalter Mund übermalt über `texclean` (gemessene Box, auf geheilter Tafel, Material geklont).
- Neu: Rig_Large **Monstrosity** (Mystery S6 Okt 2025) und **Driver-Auto** (`car.glb`) in Bank und Welt, Revision gepinnt.
- Neu: **NORMALEN-LOOK** und **RAUHEITS-LOOK** (Kanal-Ansicht als Albedo, Welt-Normale), Ebene „Kanal als Look".
- Neu: **Story-Palette** über alle Looks (Owner-Stopps aus `world-context.js`), **Tuschefarbe aus Fläche**, **Tageszeit-Zyklus** (tinyskies Tag → Abend → Nacht).
- Tusche: Silhouette aus zweiter Tiefenableitung, Innenkanten nur an echten Knicken, Breite feldhöhenbezogen.

## 2026-09-23 · Derek-Korrektur
- Tusche nach KFB-Schattenlogik (Licht dünn, Schatten dick), weicher Wobble, kein Zellen-Mosaik, SOURCE ohne Tusche.
- Look: Morph der Farbflächen + Schattenkante aus Textur; Geometrie-Wobble für Derek aus.

## 2026-09-22 spät · UI-Rework + Features
- Burger rechts oben, Schublade mit Anfasser, Beleg als Abschnitt, 1er/4er-Umschalter, Rahmung horizontal+vertikal.
- Tusche je Feld, Cel-Shading, Derek-Defaults, Himmel (Sky · Shader S/A · Aquarell · tinyskies).
- Natur: Kenney Nature Kit, Tiny Treats, Plant Lab (A/B/C). Welt mit McCloud-Ebenen.

## 2026-09-22 nachts · Derek-RGB + Voxel
- RGB-Palette (Derek-Verfahren), Referenzkachel, RGB-Generator; Voxel-Gelände über Voxel-Zone-S2-Owner.

## 2026-09-22 abends · Bank-Umbau
- Vergleichsbank statt Galerie; Ebenen-Stapel; Makro-Generator (toroidal); Lichtprofile; Eigenschatten-Fix; Cube-Pet mit EyeRig.

## 2026-09-22 · Gate WD0
- Spendergalerie über Registry-Shards und Owner-Reader; Beleg-JSON.
