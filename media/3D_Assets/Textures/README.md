# KFB imported textures — sauberer Web-Satz (`_web/`)

**83 CC0-Materialien** (ambientCG + Poly Haven, gemischt eingesammelt), pro Material genau die 4 nötigen Maps, einheitlich benannt.

## Struktur
`_web/<name>/<name>_diffuse.jpg` · `<name>_normal.jpg` (OpenGL) · `<name>_roughness.jpg` · `<name>_ao.jpg` (wo vorhanden). Alles **JPG-1K**. Index: `_CONTACT_SHEET_imported.png`.

## Was gesammelt / was verworfen
- **Gesammelt:** Color→diffuse · NormalGL→normal · Roughness→roughness · AmbientOcclusion→ao.
- **Verworfen:** NormalDX, Displacement, EXR, `.blend`/`.usdc`/`.mtlx`/`.tres`(Godot)/`.sbsar`, Preview-PNGs, HDRIs.
- **Originale bleiben unangetastet** in `imported/<Ordner>/` — `_web/` ist non-destruktiv daneben gebaut.

## three.js
`diffuse` = sRGB (`map`) · `normal` = linear (`normalMap`, OpenGL-Konvention) · `roughness` = linear (`roughnessMap`) · `ao` = linear (`aoMap`, braucht 2. UV-Kanal oder denselben). Wrap `Repeat`, Tiling 2–4×, Tint über Material-Color.

## Aufräum-Hinweis
Der Ordner **`_clean/` ist ein Buggy-Erstlauf** (Poly-Haven-Maps fälschlich als Einzel-„Materialien" getrennt) — **löschen**; die Sandbox durfte ihn nicht selbst entfernen. `_web/` ist der einzige saubere Satz.

*Regenerierbar/anpassbar: `outputs/kfb_tex_clean.py` (Quell-Ordner-Scan, Map-Erkennung, Rename).*
