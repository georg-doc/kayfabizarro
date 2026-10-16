# Herkunft · Knet-Material (L2 Schritt 2, V-340)

1:1 aus `main` von georg-doc/kayfabizarro, `tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/lab-clay/`:

| Datei | Git-Blob |
|---|---|
| `clay-material.v8.js` | f8ea4c104c6cba031f4d8e4d0f510f641bba8818 |
| `clay-profiles.v2.js` | af57b88ae382a36514f9fa50beed5ab6ca18647a |
| `clay-relief.v2.js` | 2bb843d29e9f2571f87d9e6210f34240b1a0a1a9 |

**Wahl v8 statt v10 (Begründung):** Laut `KFB_CLAYMATION_STYLE_SSOT.md` (Branch `work/clay-style-ssot-2026-10-01`) ist K1/H0 mit `clay-material.v8` die sichtbare Goldlinie. v10/K2 ist technische Basis neuer Bühnen, überstimmt K1/H0 aber erst nach bewiesenem Gleichstand im A/B-Bild („v10 is newer“ zählt nicht). Für Figuren und Fahrzeuge hat v8 die Profile `figure` und `vehicle` (clay-profiles.v2). Figuren mit Rig werden nach SSOT nur über das Material umgestellt, ohne `softenGeometry` und ohne Geometrie-Saat; Fahrzeuge in WS1 ebenso nur über das Material (V-336: keine Netzänderung zur Laufzeit).

Fingerabdruck-Karte (`ref/clay-joebinns/Fingerprints01_3K.png`) ist nicht übernommen: Lizenz im Paket nicht geprüft. Wie im Katalog-Rückfall dient die Relief-Textur als Ersatz (`uClayPrintOn` bleibt 0).
