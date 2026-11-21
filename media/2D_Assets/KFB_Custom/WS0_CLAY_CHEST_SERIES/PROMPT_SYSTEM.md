# WS0 Clay Chest Prompt System · v1.0

**Purpose:** ein wiederholbarer **visueller Form- und Produktionsvertrag**, kein deterministischer Seed und kein Bildgenerator-Plugin. Anker: Georgs tatsächlich abgenommene Truhenreihen, siehe SERIES_PROVENANCE.md.

## A · Art DNA / Keep invariants

1. **Chest first:** Selbst als Leber, Bücherstapel, Radio, Roboter oder Müllkarton bleibt das Objekt bei 96 px als **aufklappbare Schatztruhe** erkennbar. Solider Body + klar abgegrenzter beweglicher Lid + Lückenraum + Schloss/Clasp/Mechanismus. Das Thema **verwandelt** den Kistenkörper, ersetzt ihn aber nicht völlig.
2. **Character from lid:** Genau **ein** eigener cartooniger Chest-Character, seine **großen weißen Augen** mit schwarzen Pupillen und dünnen, sichtbaren Augenlidern schauen aus dem dunklen Lid-Spalt. Augen dürfen unterschiedlich groß, auf halber Höhe, leicht schielend oder schläfrig sein. Keine zusätzlichen humanoiden Körper/Arme nötig.
3. **Handmade KFB clay:** rundliche, klobige Stop-Motion-Plastilinformen, subtile Fingerabdrücke, Knetnähte, Toolmarks, unregelmäßige Kanten und handgeformte Farbe; **matt** und satt, nicht glatt generischer CGI-Glanz.
4. **Readability:** Hauptform, Gesicht und Verschluss ab 96×96 px; maximale 1 ikonische überraschende Idee plus 1–2 tragende Nebenmotive; nicht das Kleinteile-Inventar von zehn Props.
5. **Presentation:** ein vollständiges isoliertes Objekt je Zelle, Front-3/4 leicht von oben, weiches Studio-Licht von links oben, keine Bodenplatte, keine Boden-/Wurfschatten, keine Rahmen, keine Szene oder anderen Figuren, echter transparenter Hintergrund.
6. **Cartoon acting:** eigenwillig, surreal/absurd, gelegentlich satirisch; passend zum Thema, aber **kein austauschbarer Standard-Smiley**. Kein generischer KFB-Schriftzug, keine vorgefertigten UI-Container.

## B · Controls für Variation und Anti-Drift

### Body proportion / silhouette

Design zuerst als 12er-Serie planen. Vorschlagsmix (kein starres Mathematikgesetz):
- **4 breite/flache Kisten**, grobes B:H des Gesamtobjekts 1.3–1.8;
- **4 kompakte/nahezu quadratische Kisten**, B:H 0.9–1.3;
- **4 schmale/hohe Kisten**, B:H 0.65–0.9.

Proportionswerte sind **Gestaltungs-Zielklassen**, keine bisher nachgemessenen Goldens. Eine Ausprägung darf je nach Thema mehr Platz benötigen. Nicht alle in exakt demselben rechteckigen Block zusammendrücken.

### Eyes / gaze / lid acting

Vor der Generierung einen **Gaze-/Expression-Plan** schreiben. Über zwölf Figuren mindestens:
- 2 Blick links, 2 rechts, 2 oben/seitlich, 2 unten/seitlich,
- 2 frontal bzw. aneinander vorbei, 2 Sonderfälle (Schielen/ungleiche Augen/Sleepy).
- Mimik über Lidspannung: skeptisch, neugierig, gelangweilt, berauscht, stolz, ängstlich, misstrauisch, ironisch, schläfrig, überdreht, stoisch, heimlich.

**Nicht** zwölf blickgleiche strenge Pupillen, nicht alle in dieselbe Richtung starrend, nicht zwölf identische Lid-Gaps. Blick-Kohärenz pro Figur: Augenstellung und Körperidee erzählen gemeinsam eine Geschichte.

### Lock/clasp morphology

Mindestregel: Jeder Chest hat eine erkennbare **Schließmechanik**, aber **nicht** immer denselben goldenen zentralen Keyhole-Schild.

Möglicher 12er-Mix:
- 3 zentrale Plaketten in deutlich verschiedenen Formen;
- 2 links versetzte Verschlüsse;
- 2 rechts versetzte Verschlüsse;
- 2 seitliche oder umlaufende Riegel/Straps;
- 2 exotische symbolische Clasp-Mechanismen;
- 1 asymmetrische integrierte Verriegelung.

Metall, Stein, Holz, Pappe, Schleim, Buchschnalle, Laborclip, organischer Verschluss etc. aus dem Thema ableiten. Plausibler Deckelweg bleibt erhalten. Schloss darf einen Teil des Gesichts **nicht** verdecken.

### Palette / ornament / point

Satte Primär- und Sekundärfarben statt Einheitssepia: warm/kalt, hell/dunkel, Natur/Technik innerhalb einer Familie abwechseln. Jedes Objekt hat **eine unverwechselbare Überraschung**, zum Beispiel ein Dino-Fossil als klappbarer Deckel oder ein selbstgefälliger Algorithmus als Kassen-Riegel. Keine bloße Austauschdekoration über zwölf gleiche Basistruhen.

## C · Der 12-Slot-Designplan (vor zwei Bildjobs)

Eine frühe Planung kann so aussehen; **Spalten sind Variablen, keine feste Motivliste**:

| Slot | Körperform | Blick/Gefühl | Schlossmechanik | Konzeptfunktion |
|---|---|---|---|---|
| 01 | squat | links, misstrauisch | zentral, keilförmig | [A] |
| 02 | tall | rechts, vergnügt | links, Band-Clip | [B] |
| 03 | square | aufwärts, träumerisch | rechts, Seitengriff | [C] |
| 04 | squat | frontal, schläfrig | umlaufender Riegel | [D] |
| 05 | tall | down-left, skeptisch | Symbol-Clasp | [E] |
| 06 | square | schielend, überdreht | rechts versetzt | [F] |
| 07 | square | links, stolz | zentral, organisch | [G] |
| 08 | squat | up-right, überrascht | links versetzt | [H] |
| 09 | tall | frontal, stoisch | seitliche Schnalle | [I] |
| 10 | square | down-right, neugierig | zentral, oval | [J] |
| 11 | squat | rechts, paranoid | asymmetrischer Clip | [K] |
| 12 | tall | unterschiedlich hoch, ironisch | abstrakter Riegel | [L] |

Für jedes Slot vor dem Prompt festlegen: `name`, `themeFacet`, `surprise`, `shape`, `gaze`, `expression`, `lidAngle`, `clasp`, `palette`. Die Tabelle ist eine **Produktionshilfe**, nicht die Garantie, dass das Bildmodell sie geometrisch exakt einhält.

## D · Copy-ready PROMPT — first 6er sheet (EN)

~~~text
Create ONE game-asset sprite SHEET with EXACTLY SIX DIFFERENT character treasure chests in a clean 3-COLUMNS × 2-ROWS grid. This is SHEET 1 of a coordinated two-sheet 12-character family called [SERIES_NAME]. THEME: [THEME].

KFB CHEST FAMILY DNA: physically handmade stop-motion cartoon claymation, chunky real plasticine, subtle fingerprints and tool marks, irregular soft sculpted edges, richly saturated matte colors, gentle studio light from upper left. Front three-quarter view slightly from above; consistent camera and scale family, but varied silhouettes and body proportions. Every subject is unmistakably a treasure chest with a physically plausible opening hinged lid, visible dark lid gap, and a lock, clasp or readable closure mechanism. Each chest has a pair of expressive oversized WHITE CARTOON EYES with BLACK PUPILS and THIN EYELIDS peeking through its own lid gap. Their gaze directions, lid attitudes and personalities MUST vary.

At 96px the chest silhouette, eyes and closing mechanism are legible. One strange, witty, unique idea per chest. Avoid excess tiny details. Six different body aspect ratios, colors, lid angles, gaze directions and closure positions. Do NOT repeat the same central keyhole shield and frowning side-eye six times.

Six separate slots, reading left to right, top to bottom:
1 [SLOT_01: personality, specific subject, 1 surprising idea, shape, gaze, clasp]
2 [SLOT_02]
3 [SLOT_03]
4 [SLOT_04]
5 [SLOT_05]
6 [SLOT_06]

Each complete object is isolated WITH AIR GAP between neighboring silhouettes; 8%+ safety margin from cell edges. EXACTLY six, no cropped pieces, one object per slot. Fully TRANSPARENT ALPHA background (not a white/grey/colored/checkerboard image), NO floor, NO cast shadow, NO pedestal, NO frame, NO title, NO labels, NO extra objects, NO humanoid characters. Show one finished clean PNG image of the 3×2 sheet.
~~~

## E · Copy-ready PROMPT — matching second sheet (EN)

~~~text
NEW image generation job. Create SHEET 2 of the SAME KFB 12-character clay treasure-chest family. EXACTLY SIX NEW and distinct chests, arranged 3 COLUMNS × 2 ROWS, consistent with the actual visually verified Sheet 1 [ATTACH APPROVED SOURCE IF AVAILABLE]. Preserve the complete clay/chest/eye/camera/lighting/alpha rules from the family contract. Six new facets [SLOT_07] through [SLOT_12]. Not palette swaps or copies of Sheet 1. Increase the variety of eye directions, facial expressions, chest widths/heights, hinge geometry and clasp placement. Each has one surprising idea, 96px readability, and a safe empty gutter around the full silhouette. True transparent RGBA, no checkerboard pixels, no floor, no cast shadows, no framing and no text. No extra characters.
~~~

**Falls Generator kein echtes Alpha liefert:** Die Formulierung „transparent“ ist **nur Absicht, kein QA-Befund**. Export/Masking in EXPORT_QA.md durchführen. Hintergrund-Illusion oder Alpha-Fehler nie als PASS deklarieren.

## F · Optional single-character re-render (EN)

~~~text
Render ONE previously approved KFB clay treasure-chest character in isolation, not a sheet: [SOURCE CHARACTER + VISUAL REFERENCE]. Keep the exact family material, body/face identity, original palette and three-quarter camera. Improve ONLY [CROP | GAZE | CLOSURE | MARGIN | ALPHA] without replacing the character. Entire object inside a square 512×512 transparent RGBA sprite with a safe margin, no floor or shadow. Eyes visible between lid and body; original hinge/closure remains physically convincing. Do not introduce a different chest.
~~~

Bei echter Geometrie-Überlappung oder mehreren abgeschnittenen Motiven: **frische 6er-Generierung** statt Zauberei mit fehlerhaftem Auto-Crop. Eine akzeptierte einzelne Figur darf dagegen im selben Job gezielt korrigiert werden.

## G · Negative / diagnostic prompt anchors

„no 4×3 master grid; no 2×6 strip; no background or checkerboard bitmap; no ground, no drop shadow, no halo or vignette; no labels; no board, card, display frame or UI chrome; no human body; no identical gaze direction; no center-keyhole clones; no tiny filigree that vanishes at 96px; no clipping; no smooth mass-produced plastic/metal CG look; no false transparent thumbnail.“

**Keine pauschale Typografiesperre für alle KFB-Assets:** Diese konkrete Chest-Familie vermeidet Schrift normalerweise. Bei Comic-, Broadcast- oder Buch-Chests sind kurze diegetische Worte/Zeichen möglich, wenn die Serie das **explizit** verlangt (wie in früheren PASS-Designs), aber nicht als UI-Labels.

## H · Themes sind Slots, nicht der Style

- **Chest family** (eigentliche Anwendung): Horror/Occult, Sci-Fi, Hidden History, Schatzhort, Trash, Retro-PC, Nature/Biome, Bücher/Comics, Medien/Propaganda, Cyborgs, Weisheitslehren, Organe/Meta-Biology usw. Beliebig neue Kategorie einstecken, ohne die sechs Formkerne zu verlieren.
- **Anatomische Themen:** Ein identifizierbarer biologischer Organcharakter als Chest, organisch plausibler Hauptumriss, aber keine falschen „medizinischen Exaktheits“-Claims aus Cartoonbildern.
- **Satire:** spezifische, visuell lesbare Ironie (z.B. ewiges Upgrade als Schlaufe, pessimistisches Buch mit verschlossenem Fragezeichen) statt beliebiger Gag-Aufkleber.
- **Weitere Assetfamilien (Transfer):** Dieselbe Serienmethodik (STYLE / INVARIANTS / SLOT VARIATION / CAMERA / OUTPUT / ALPHA / QA) für Doors, Scenelets, Black Ink Blobs, Props, Plants, HUD-Skins etc. **NICHT** automatisch Chest-Deckel, Schlüsselloch oder Chest-Augen auf andere Objektfamilien übertragen. Deren eigene SSOT/Rules ersetzen Abschnitt A. Beispiel: Scenelets brauchen den Ort und ein klares Environment-Narrativ; Black Fluffer folgt seinen eigenen Körper-/Silhouette-Regeln.
- **Keine Marken- oder Source-Ersetzung**: tatsächliche Donors immer isoliert zeigen und Source-Treue nachweisen, bevor sie als Stilanker gelten.

## I · Ausführung / Loop

1. 12-Ideen-Brief mit obigem Slot-Plan; maximal eine Leitidee je Chest.
2. Zwei **separate** Bildjobs, pro Job **EXAKT 3×2**.
3. Rohbilder sichern; 6 Figuren je Sheet visuell kontrollieren; bei Clipping/Augendrift lieber neu rendern.
4. Alpha-Prozess + Sprite-Export + 96px-Kontaktblatt nach EXPORT_QA.md.
5. PASS/TUNE/FAIL durch Georg. Nur akzeptierte Versionen als Stil-Donors listen.
6. Neue Serien zum Paket ergänzen; Prompt/Seed/Engine/Source nicht erfinden; fehlende echte Quelle ausdrücklich kennzeichnen.

