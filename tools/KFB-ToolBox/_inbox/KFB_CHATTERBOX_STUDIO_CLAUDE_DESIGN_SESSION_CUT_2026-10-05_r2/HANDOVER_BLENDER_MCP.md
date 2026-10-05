# HANDOVER · Blender MCP · BUBBLE-CLAY-3D-02 · 3D-Versionen der Blasen

Ersetzt BUBBLE-CLAY-3D-01 (r1). Ziel: echtes Clay-Volumen für die Blasen der Triplet-Bühne — als **Look-Referenz + messbare Parameter**, die die Runtime aus dem vorhandenen SVG-Pfad nachbaut. Keine Asset-Serie je Text.

## Warum Parameter statt fertiger Meshes
Blasen haben beliebige Textlängen. Die Runtime extrudiert den Pfad aus `chatterbox-core.js` (`THREE.ExtrudeGeometry` / Shape). Blender liefert, **wie** dick, gerundet, getönt und beleuchtet das aussieht, plus Referenz-GLBs in drei Größen zum Vergleich.

## Formvertrag (SPEC_COMPONENTS §2–2b, nicht neu erfinden)
- Silhouette Speech: Rechteck, leichter Jitter (Clay) bzw. Ecken r ≈ 0,3 × Höhe, ≤ 14 px-Äquivalent (Clay pur). Zipfel = Teil derselben Fläche, Fuß ≈ 18 px-Äq., Schultern 55 %, Spitze spitz, Länge 14–24 (Clay pur 10–16).
- Volumen: Kissen, Dicke 6–8 % der Höhe, Bevel ≈ 35 % der Dicke, Oberseite leicht konvex. Licht oben links (Azimut ~225°, Elev. ~50°), Wand + Kontaktschatten unten rechts.
- Material: Knete, Roughness 0,85–0,95, stabiles Fingerspur-Noise. Farbe = Papier `#fbf2df` + 15–20 % Sprecherfarbe: Goth Girl `#9a7cc4` · Clown `#3cc0dc` · Witch `#e6b53a`.
- Kontur: Clay pur ohne Ink; Clay optional **eine** Silhouettenlinie `#1f1a14` oben. Nie doppelt, kein Emboss.
- Text nie ins Mesh. Mesh trägt nur ein Empty `TEXT_RECT` (Textfläche) und `TAIL_TIP` (Zipfelspitze = Ursprung).

## Aufgaben
- **B1 Speech** (Clown-Tönung), Clay + Clay pur, Größen kurz / mittel / lang, Zipfel unten links.
- **B2 Triplet-Stapel:** eine Silhouette, Höhe für 3 Blöcke (Blockabstand 0,5 × Schrift). Prüfen: liest sich der Stapel als **eine** Blase?
- **B3 Gedanke „…“** (Schweigen): kleine Scallop-Wolke + 3 getrennte Kugeln 0,4 / 0,64 / 1,0 × R0 zum Kopf hin kleiner.
- **B4 Choice 2×2:** Trägerblase + 4 flache Knopfplatten in Tonfarbe (BINGO `#e2b33c`, BOGGLE `#59c3e6`, BONGO `#7fc46a`, BLÖDSINN `#e5563d`), Hover-Zustand = 2 px höher.
- **B5 Impact-Burst** (Kranz + flacherer Innenstern), ohne Text.
- **B6 Renders** je Asset: Frontal-Ortho 1024², transparenter Hintergrund; zusätzlich 1 Render ¾-Ansicht 20°.
- **B7 Export:** GLB (Meter, +Y oben, Ursprung = TAIL_TIP bzw. Mitte bei Burst), ≤ 2k Tris je Blase, Material als Principled ohne Bildtexturen (Noise dokumentieren statt backen).
- **B8 Parameterblatt** (JSON): `thicknessRatio, bevelRatio, bevelSegments, convexity, cornerRadius, tailFoot, tailLen, tint, roughness, noiseScale, noiseStrength` je Variante + Polycount + Renderzeit.

## Lesbarkeitsregel (Runtime, zur Info)
Blasen bleiben screen-stabil: Billboard zur Kamera, keine Idle-Bewegung, Anker-Totzone 14 px. 3D-Look darf das nicht ändern — keine Eigenrotation, kein Schweben.

## Rückgabe
`skills/chat/workflows/BUBBLE_CLAY_3D_02_<datum>/`: GLBs, PNGs, .blend, `bubble-clay-params.v1.json`, kurzer Messbericht. Kein Einbau in Runtimes.

## Abbruch
Zwei Durchgänge ohne sichtbaren Gewinn gegenüber SVG-Clay → stoppen, Renders + Befund zurück.
