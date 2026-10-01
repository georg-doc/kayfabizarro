# RETURN · FACADE-A/B-01 · building_A · 2026-10-01

Clay style SSOT: read `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md` and `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` (work/clay-style-ssot-2026-10-01) before editing geometry, materials, palettes, deformation, shadows or contact. Do not invent a replacement look.

## Aufbau
- Bühne: `KFB Clay Gate FACADE-AB-01 · building_A.dc.html` · Code `golden/facade-ab-01.js`
- K1-Quellen 1:1 aus `KFB_K1_H0_CODEBASE_2026-09-29` → `golden/k1/lab-clay/` (clay-catalog.v5, clay-material.v8, clay-soften.v1, clay-profiles.v2, clay-relief.v2), Fingerabdrücke `golden/k1/ref/clay-joebinns/`
- building_A: KayKit City Builder Bits @2ff8b350 (gleicher PIN wie K1), Höhe 3,2 m
- Kamera 6 m · 30° · FOV 34 · Richtung (0,25 / 0 / 1); K1 MOODS.day; K1-Tisch; Schatten 4096; GTAO wie K1
- Vorstufe softenGeometry (maxEdge 0,18 · 3 Stufen · 90 000 △) → seedGeometry → Material
- Abweichung: claySeed = 101 + Mesh-Index statt 101 + o.id (o.id ist je Szene verschieden)

## Ergebnis (Messung im Claude-Browser, vorläufig bis Georgs Bildurteil)
| Kandidat | Ansicht | Δ (0–255) | Detail × Golden | Messung |
|---|---|---|---|---|
| v10 · R2A-Einstellung (Hand ×10, Werkzeuge an, Abdrücke aus) | Gate | 5,4 | 0,87 | TUNE |
| v10 · R2A | Dachkante | 5,9 | 0,84 | TUNE |
| v10 · R2A | Sockel | 2,7 | 0,82 | TUNE |
| v10 · Parität (v8-Werte, Werkzeuge aus, HexK 3, volle Drehung, FacetSoft 0) | Gate | 2,6 | 0,99 | MATCH |
| v10 · Parität | Dachkante | 3,3 | 0,98 | MATCH |
| v10 · Parität | Sockel | 2,5 | 0,97 | MATCH |

Lesart: Die Knete auf den Hex-Inseln (R2A) weicht vom gesperrten K1-Look ab (zu wenig Feindetail, keine Abdrücke, Handmaß ×10). v10 reproduziert Golden, wenn es auf die v8-Werte gestellt wird.

Kosten Gate: Haus 828 △ (Quelle) → 53,0k △ nach Vorstufe · 11 Calls je Bühne · Vorstufe 745 ms · Bildzeit hier nicht belastbar (Software-Rendering).

## Offen
- Georg: Bildurteil MATCH/TUNE/FAIL in der Bühne setzen (Protokoll lokal).
- Danach erst: building_E, dann Übertragung auf Hex-Inseln (Terrain-Zeile, H0-Referenz 05/07) mit Parität-Werten.
- Wolken: Jarlan-Perez-Anatomie läuft in R2B bereits als 5 Komponenten; Variationen und Knete erst nach Gate.

## Georg-Urteil 01.10.: „passt“ → Parität = MATCH
- Schatten-Saum (Treppenkante + Kontakt) behoben, Rezept `LESSONS_SHADOWS.md` in `lab-world/shadow-fit.v1.js`:
  Gate = Frustum auf Haus + Schattenwurf gepasst, texelgerastet, normalBias 1,5 × Texel, bias −0,00015, Composer mit MSAA 4 (Treppen kamen aus dem Composer ohne Multisampling). A/B-Schalter „Schatten K1 roh | Schatten-Rezept“ in der Bühne.
  Welt (R2B) = shadowFollow: Feld folgt Blickziel, ±60–760 m nach Kameraabstand, texelgerastet, normalBias 1,2 × Texel, bias −0,00003 (ersetzt festes ±720 m / normalBias 0,6).
- Übertragen auf R2B Hex-Inseln: Knete `clay: parity` (Standard), Fingerabdrücke nur im Nah-Band (lodNear), sonst unverändert.
- Offen: Terrain-Zeile (H0 05/07) A/B auf den Inseln; Joyride-Rückseiten-Deformation im Insel-Kontext prüfen (anderer Deformer); building_E.
- Hinweis: fps im Claude-Vorschaufenster nicht aussagekräftig (verborgenes iframe wird gedrosselt).

Evidence: `screenshots/fab01-gate.jpg`
