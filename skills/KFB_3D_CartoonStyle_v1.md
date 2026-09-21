Klar — hier ist das **Tiny Treats / KayKit 3D-Rendering- und Coloring-Konzept als kompaktes HowTo** für **cartoonige Props, Assets und kleine Landmarks** mit **runden Ecken**, **Spielzeug-/Clay-Charakter** und **ohne kleinteilige harte Kanten**.

---

# Tiny Treats / KayKit Cartoon-Prop HowTo

## Zielbild

Wir wollen **nicht**:

* realistische Hard-Surface-Modelle
* kleinteilige, technisch zerhackte Geometrie
* harte 90°-Kanten überall
* zu viele kleine Extrusionsdetails
* noisy Texturen oder PBR-Gedöns mit viel Mikrodetail

Wir wollen **stattdessen**:

* **große klare Grundformen**
* **abgerundete Silhouetten**
* **toy-like / clay-like Volumen**
* **wenige, lesbare Details**
* **freundliche, handgemachte Oberflächen**
* **KayKit-kompatible Farbigkeit**
* Props, die schon als kleine 3D-Icons gut lesbar sind

Das visuelle Spektrum liegt ungefähr zwischen:

* **KayKit**
* **Tiny Treats**
* **Spielzeug**
* **Claymation**
* **vereinfachter Cartoon**
* etwas **Monopoly-/Diorama-Logik**, aber weicher und charmanter

---

# 1. Die Kernregel: erst große Form, dann Mini-Details

## Faustregel

Wenn das Objekt als schwarze Silhouette schon nicht gut aussieht, helfen Details nicht.

### Reihenfolge:

1. **Grundkörper**
2. **Abrundung / Softening**
3. **große Sekundärformen**
4. **wenige lesbare Details**
5. Farbe / Material
6. erst ganz am Ende kleine Akzente

### Beispiel „runde Rechteckplatte mit drei Knöpfen“

Nicht:

* Platte mit vielen extrudierten Kanten
* Knöpfe mit harten Zylindern
* viele Rillen, Schrauben, Panel-Linien

Sondern:

* 1 weiches, dickes Rounded-Rectangle
* 3 einfache, leicht gewölbte Knöpfe
* maximal 1–2 zusätzliche Formhinweise

---

# 2. Formensprache

## A. Primärformen bevorzugen

Arbeite möglichst aus einfachen Volumina:

* Kugel
* Kapsel
* Quader mit starkem Bevel
* Zylinder mit weichen Enden
* abgerundete Platte
* Tropfenform
* stumpfer Kegel
* weiche Bögen

## B. Sekundärformen nur lesbar und groß

Sekundärformen sollen die Hauptform unterstützen, nicht zersägen.

Gut:

* Griff
* Knopf
* Schnabel, Antenne, Hebel
* Fensterfläche
* Dach, Sockel, Vorsprung

Schlecht:

* fünf kleine Panelebenen
* zehn Schrauben
* Mini-Fugen
* filigrane technische Zwischenstufen

## C. Keine scharfen Ecken als Default

Die Default-Annahme ist:

> **Alles ist erst einmal weich.**
> Harte Kanten sind Ausnahme, nicht Basis.

---

# 3. Runde Ecken richtig bauen

Das ist der wichtigste Teil.

## Grundsatz

Eine „runde Ecke“ heißt nicht einfach „ein bisschen beveln“, sondern:

* die **Silhouette** wird weich
* die **Lichtkante** wird breit und lesbar
* das Objekt bekommt **Volumen und Gewicht**
* es sieht **greifbar / spielzeughaft** aus

## Ziel

Statt so:

* dünne Platte
* knappe 1-Segment-Bevel
* fast weiterhin hard surface

eher so:

* spürbar dickes Volumen
* großzügiger Bevel-Radius
* genug Segmente für weiche Lichtläufe
* Ecken lesen sich fast wie kleine aufgedunsene Formen

## Praktische Regel für Props

Bei KayKit-/Tiny-Treats-Props sind oft gut:

* **Bevel Radius eher mutig**
* lieber **zu rund als zu technisch**
* lieber **weniger Teile**, aber jedes Teil schön weich

## Quick-Heuristik

Wenn du denkst „das ist wahrscheinlich schon rund genug“, dann oft noch:

* etwas **dicker**
* etwas **runder**
* etwas **einfacher**

## Für flache Platten

Gerade bei Konsolen, Tafeln, Schildern, Kacheln, Control Panels:

* die Platte nicht papierdünn machen
* etwas **Toy-Thickness** geben
* Ecken deutlich runden
* Vorderkante und Rückkante ähnlich weich behandeln

---

# 4. Modellierungsrezept für typische Cartoon-Props

## Rezept 1: Rounded Box Prop

Für Kiste, Radio, Gerät, Toaster, Button-Panel etc.

1. Starte mit Cube
2. skalieren auf Zielproportion
3. genug Dicke geben
4. **Bevel** mit ordentlichem Radius
5. Segmente erhöhen, bis Licht schön läuft
6. Shade Smooth
7. ggf. Auto Smooth / Weighted Normals
8. Details nur als **große, einfache Aufsätze**

## Rezept 2: Button / Knopf

Nicht technisch, sondern toy-like:

* kurzer Zylinder oder abgeflachte Kugel
* obere Fläche leicht gewölbt
* Seiten weich
* nicht zu dünn
* lieber etwas „bonbonartig“

## Rezept 3: Hebel / Antenne / Beinchen

* lieber Kapsel- oder Tube-Logik
* Verbindungen nie superdünn
* Übergänge weich
* Sockel großzügig

## Rezept 4: Fenster / Display / Inset

Nicht tief technisch insetten. Lieber:

* sanfte Vertiefung
* weiche Einfassung
* klarer großer Farbkontrast
* notfalls nur aufgesetzte Fläche statt echter Tiefe

---

# 5. Claymation- vs. Toy-Look

Beide sind verwandt, aber nicht identisch.

## Toy-Look

* sauberer
* definierter
* etwas glatter
* klarere Kantenführung
* wirkt wie hochwertiges Spielzeug

## Clay-Look

* noch weicher
* leicht organisch
* manchmal minimal unregelmäßig
* sanfte Oberflächen
* dickeres Volumen, mehr „Handmasse“

## KFB-Empfehlung

Für die meisten Props:

> **Toy-Basis + leichte Clay-Infusion**

Also:

* saubere Modellierung
* klare Form
* aber weich genug, dass nichts technisch-kalt wirkt

---

# 6. Farbkonzept

## Grundprinzip

Farbe soll **lesbar, freundlich und flächig** sein.

Nicht:

* fotorealistische Texturflächen
* busy roughness maps
* Dreck-/Grunge-Noise
* zu viele Zwischentöne

Sondern:

* **große Farbflächen**
* kontrollierte Palette
* wenige Akzentfarben
* eher matte Materialien
* klar getrennte Materialzonen

## Materialzonen-Regel

Für Props möglichst wenige Zonen:

1. **Main color**
2. **secondary color**
3. **neutral trim**
4. optional **accent color**

Mehr braucht man meistens nicht.

## Gute Zonen-Beispiele

### Toaster/Radio/Panel

* Hauptkörper: eine Hauptfarbe
* Knöpfe: zweite Farbe oder hell/dunkel davon
* Füße/Trim: neutral
* kleines Akzentdetail: rot, teal, gelb o.ä.

### Landmark-Miniversion

* Hauptmasse: 1 Grundfarbe
* Dach / Spitze / Fensterband: 1–2 Sekundärfarben
* Sockel: neutral oder dunkler

---

# 7. KayKit-/Tiny-Treats-Coloring-Logik

## A. Farben eher „modellbausatzfreundlich“

* leicht entsättigt, aber nicht grau
* freundlich
* warm / charmant
* nicht neon
* nicht superpastellig ausgewaschen
* keine schmutzige Realwelt-Farbigkeit

## B. Helligkeit trennt Formen oft besser als reine Buntheit

Ein guter Prop funktioniert schon mit:

* hellem Körper
* mittlerem Sekundärteil
* dunklem Trim
* kleinem Farb-Akzent

## C. Wenige Akzente, bewusst gesetzt

Der Akzent ist für:

* Knopf
* LED
* Emblem
* Highlight-Part
* Interaktionshinweis

Nicht alles gleichzeitig akzentuieren.

---

# 8. Shading und Rendering

## Ziel

Das Modell soll im kleinen Maßstab gut lesbar bleiben.

## Materialempfehlung

Für solche Assets meist:

* **matte bis seidenmatte** Oberflächen
* moderate Roughness
* wenig bis kein Metalness
* kleine Highlights ja, aber nicht glossy-plastikmäßig übertrieben
* kein Mikrodetail-Zirkus

## Licht

Am besten lesbar mit:

* weiches Key Light
* sanftes Fill Light
* leichtes Rim Light
* saubere Schatten
* genug Helligkeitskontrast, aber nicht dramatisch

## Wichtige Wirkung

Die Rundungen müssen im Licht **sichtbar laufen**.
Wenn man den Bevel kaum im Licht sieht, ist er oft zu klein oder die Form zu hart.

---

# 9. Texturen

## Default: so wenig Textur wie möglich

Wenn Texturen nötig sind, dann:

* sauber
* großflächig
* ruhig
* gleichmäßige Skalierung
* keine winzigen pattern details

## Besser als Textur:

* Geometrieform
* Materialkontrast
* Farbfläche
* sanfte Inset-/Outset-Formen

## UV / Texel

Wenn Textur verwendet wird:

* gleiche Texel-Dichte
* nicht verzerren
* keine winzigen Faces mit riesigem Detailbedarf

---

# 10. Landmarks: Wie reale Gebäude cartoonisieren?

Das ist wichtig für deine Storytelling-Map.

## Regel

Nicht „Mini-Realismus“, sondern **ikonische Vereinfachung**.

Also nicht:

* echter Eiffelturm in klein
* lauter Streben
* filigrane Details
* historisch exakte Fassadenlogik

Sondern:

* erkennbare Hauptsilhouette
* 2–4 charakteristische Merkmale
* stark vereinfachte Massen
* abgerundete, charmante Volumina

## Landmark-Rezept

Frage für jedes Gebäude:

### 1. Woran erkennt man es sofort?

* Form
* Dach
* Turm
* Fensterband
* Proportion
* Farbcode

### 2. Was ist nur visuelles Rauschen?

Alles, was für Wiedererkennbarkeit nicht entscheidend ist, wird vereinfacht oder gestrichen.

### 3. Wie übersetze ich es in Spielzeuglogik?

* dicker Sockel
* weichere Übergänge
* stabile Proportionen
* vereinfachte Öffnungen
* größere lesbare Features

## Faustregel Landmark

> Lieber 70 % weniger Details und 200 % bessere Lesbarkeit.

---

# 11. Typische Fehler

## Fehler 1: zu viele Einzelteile

Das Asset wird unruhig und technisch.

**Fix:** Teile zusammenfassen, größere Volumen bevorzugen.

## Fehler 2: Bevel zu klein

Es bleibt eigentlich doch hard surface.

**Fix:** Radius erhöhen, Segmente erhöhen, Lichtcheck machen.

## Fehler 3: zu dünne Elemente

Wirken fragil oder low-poly-technisch.

**Fix:** Toy-Thickness geben.

## Fehler 4: realistische Detail-Logik

Schrauben, Ritzen, technische Unterformen etc.

**Fix:** auf ikonische Cartoon-Logik zurück.

## Fehler 5: zu viele Farben

Asset verliert Fokus.

**Fix:** 2–4 Farbgruppen maximal.

## Fehler 6: Landmark als echtes Architekturmodell

Miniatur bleibt unlesbar.

**Fix:** auf Symbolform herunterbrechen.

---

# 12. Schnelles KFB-Style-Rezept

Wenn du schnell entscheiden willst, nimm dieses Kurzschema:

## KFB Toy/Clay Asset Formel

**1.** Ein großer klarer Grundkörper
**2.** ordentliche Dicke
**3.** mutige Rundungen / weiche Ecken
**4.** 1–3 große Zusatzformen
**5.** 2–4 Farbgruppen
**6.** matte/seidenmatte Oberfläche
**7.** keine Mikrodetails
**8.** Silhouette muss sofort lesbar sein

---

# 13. Mini-Beispiele

## A. Cartoon-Panel mit drei Knöpfen

* Basis: abgerundetes Rechteck, relativ dick
* Knöpfe: 3 weiche Bonbon-Zylinder
* Farben: Body hell, Knöpfe farbiger, Trim dunkler
* keine Schrauben, keine feinen Panel-Linien

## B. Toaster

* Hauptkörper: rundlicher Block
* Schlitze: nur 1–2 simple Inset-Öffnungen
* Hebel: dicker und weich
* Füße: stumpf und klar
* Farbe: Body + Metal/neutral + Akzent

## C. Funkturm / Eiffelturm-artige Landmark

* Turm nicht filigran
* 2–3 Ebenen maximal
* diagonale Struktur stark reduziert
* sanft tapernde Gesamtform
* breiter Sockel
* Wiedererkennung über Silhouette, nicht über Strebenanzahl

---

# 14. Praktischer Produktions-Workflow

## Phase 1 — Shape Blockout

* nur große Formen
* nur Silhouette prüfen
* noch keine Kleinteile

## Phase 2 — Softening

* Bevel / Rundung
* Dicke
* Gewicht
* Spielzeugcharakter

## Phase 3 — Secondary Forms

* Knöpfe, Fenster, Griff, Aufsätze
* nur wenige
* alles weich

## Phase 4 — Color Zoning

* Hauptfarbe
* Sekundärfarbe
* Trim
* Accent

## Phase 5 — Readability Check

Asset sehr klein anschauen:

* Ist es lesbar?
* Sind die Formen klar?
* Wirkt es toy/clay statt hard-surface?

## Phase 6 — Integration Check

* passt zu KayKit/Tiny Treats?
* gleiche Formensprache?
* gleiche Materialruhe?
* gleiche Farbdisziplin?

---

# 15. Ein einfacher Merksatz

## KFB-Motto für solche Assets:

> **Erst weich, dann klar, dann charmant — niemals erst technisch.**

Oder noch kürzer:

> **Big shape first. Round by default. Detail last.**

---

Wenn du willst, kann ich dir daraus direkt noch **eine konkrete KFB-Style-Checkliste** machen, z. B.:

1. **10 Modellierungsregeln**
2. **10 Farbregeln**
3. **10 No-Gos**
4. **ein Blender-Kochrezept**
5. **ein Claude-/GPT-Briefing-Template für solche Props**

Dann hast du es als wiederverwendbare Produktionsvorlage.


---

# 16. KFB measured defaults · candidate

These are **starting rules, not immutable canon**. They come from the current Toy/Clay experiments and must remain visually reviewable.

- **Macro massing first:** roughly 80–90% of the first read should come from large forms.
- **Rounded-box radius:** start around **14% of the smallest dimension**, clamped below half-thickness.
- **Material baseline:** metalness 0; roughness about **0.8–0.9**.
- **XS prop:** 1–4 visible authored parts.
- **S prop:** 3–6 parts.
- **M landmark:** 5–10 primary forms, up to ~16 hero parts.
- **L hero landmark:** 8–16 primary forms; more needs a named recognition reason.
- **Detail earns geometry only if it changes silhouette, identity or interaction.**

A technically valid micro-bevel that is invisible at review distance **fails** the style rule.

---

# 17. DO / DON'T quick reference

## DO

1. Build the silhouette from a few large primitives.
2. Make corners visibly round at the intended camera distance.
3. Give flat panels real toy thickness.
4. Use capsule/tube forms for rods, handles, limbs and supports.
5. Keep buttons pill-like, fat and readable.
6. Use 2–4 material/color zones.
7. Let value contrast separate forms before adding texture.
8. Use matte / satin materials and soft scene lighting.
9. Simplify landmarks to the 2–5 masses that make them recognizable.
10. Delete detail before adding detail when the result feels technical.

## DON'T

1. Do not default to hard 90° boxes.
2. Do not use a one-pixel/micro-bevel as “rounding”.
3. Do not reproduce every real screw, lattice, seam or panel break.
4. Do not use thin realistic rods where a chunky capsule carries the idea.
5. Do not solve weak massing with AO, grime or noise.
6. Do not add many material changes to compensate for unclear geometry.
7. Do not let low-poly become faceted/hard by default.
8. Do not copy architectural filigree into map-scale landmarks.
9. Do not shrink real-world detail until it becomes visual noise.
10. Do not call a technically green build visually accepted.

---

# 18. Interactive reference

Companion source:

`skills/KFB_3D_CartoonStyle_v1.html`

The interactive viewer is designed as a **teaching/reference surface**, not a new runtime owner.

It contains:
- exact Tiny Treats Charming Kitchen toaster donor;
- DO · rounded 3-button panel;
- DON'T · hard technical panel;
- DO · toy/icon landmark;
- DON'T · thin/detail-heavy landmark;
- material-zone / wire / silhouette review modes.

The exact donor must be shown in isolation before derived examples are treated as stylistically related.

---

# 19. Living problem → solution log

Append here. Never rewrite an old failure to make the history cleaner.

## 2026-09-21 · Hard-edge drift

**Observed:** Generated KFB props repeatedly became hard rectangular objects with barely visible bevels.

**Cause:** “Bevel” was treated as cleanup rather than visible mass.

**Repair:** Increase radius, increase thickness, remove secondary pieces, then review silhouette before materials.

**Reusable rule:** if the bevel is not visible at target distance, it does not count.

## 2026-09-21 · Architecture miniature drift

**Observed:** Landmark candidates retained too many real structural parts and read as miniature engineering models.

**Cause:** Real-world decomposition was mistaken for visual identity.

**Repair:** identify 2–5 iconic masses; discard filigree unless recognition genuinely depends on it.

**Reusable rule:** build the landmark's toy icon, not its construction drawing.

## 2026-09-21 · Detail before mass

**Observed:** Surface polish and extra geometry were added while the primary form was still wrong.

**Cause:** Material/detail iteration began before silhouette acceptance.

**Repair order:** delete parts → enlarge masses → increase rounding → thicken supports → restore one iconic feature → material last.

## 2026-09-21 · Thin cartoon facial/accessory parts

**Observed:** eyelids / similar parts can be technically present but read as thin shells or rims instead of clay/cartoon volume.

**Repair direction:** rounded outer mass + intentional thickness + crisp functional inner edge. This same principle should be tested on future ears, lips, handles and other cartoon parts.

---

# 20. WSA elaboration brief

**WSA: continue this skill additively.**

Use this file plus the interactive HTML as a visual style notebook.

For every new example:
1. pin the exact donor/source;
2. show it isolated first;
3. build one minimal DO and one useful DON'T when appropriate;
4. record measured form/material facts;
5. record the visible failure;
6. record likely/proven cause separately;
7. record repair;
8. attach screenshot/browser evidence;
9. only then generalize a rule.

Required reading before production work:
- `skills/chat/START_HERE.md`
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
- `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`
- `skills/session-entry-use-what-works_v1.md`
- `skills/KFB_3D_CartoonStyle_v1.md`

Useful source families:
- Tiny Treats registered assets;
- KayKit source packs and palettes;
- ToolBox Toy/Clay Form Lab evidence;
- `tools/img2threejs/` landmark experiments;
- FrankenStein / EyeRig visual modules;
- current Asset Librarian / Registry.

Do not turn this skill into a second Asset Librarian, renderer, World owner or character rig owner.

---

# 21. Next examples to add

Candidate examples for future WSA/Chat additions:

- FrizzleBob rabbit ears: soften sharp/faceted silhouette, widen outer rim, head-color outer zone, separate inner-ear zone.
- Clay eyelids: rounded outer mass + crisp eye-facing inner edge.
- Pencil / Rubber EyeRig props.
- Legacy / Medium / Large character face-host examples.
- Tiny Treats radio / toaster / kitchen props.
- Cologne Cathedral / Eiffel / grotesque local landmarks.

Each remains a separate donor-first visual gate.

---

## Skill status

**DRAFT / EXPERIMENTAL.**

This file is a reusable production reference but is not yet a promoted immutable visual canon. Georg's visible acceptance of representative examples is required before stronger canon language.


## 2026-09-21 · Rabbit ears · two-pass visual repair

**Donor:** `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/ears.v2.js`  
**Color donor:** `FrizzleBob_Yellow.gltf` · `Main` / `Main_Light`.

### Candidate 0 · technical green, visual fail

**Observed:** the new inner-ear zone was made by scaling a duplicate of the complete donor ear mesh. It visibly intersected and opened near the root.

**Cause:** a full 3D shell was used where a distinct inset/cartoon material zone was required.

**Repair:** build the inner ear as its own rounded, shallow extruded panel.

**General rule:** a color/material zone should not be implemented as a scaled duplicate of an irregular shell when the intended read is a clean inset.

### Repair 1 · inner zone fixed, outer donor topology still failed

**Observed:** the independent inner panel was clean, but the right ear still showed faceted/torn-looking topology near the tip.

**Cause:** the legacy donor topology itself was being asked to provide the new smooth toy/clay silhouette. Smoothing cannot reliably turn a structurally awkward source mesh into a clean new design language.

**Repair:** stop patching the old topology. Keep donor-derived measurements and the proven `ears.v2` host placement/pivot/dangle behavior, but rebuild only the visible outer shell as one continuous rounded extruded cartoon form.

### Repair 2 · current candidate

Current properties:
- donor-measured dimensions;
- one continuous rounded outer shell;
- broad visible rim;
- separate rounded inner zone;
- outer `Main`: **#f2c93a**;
- inner `Main_Light`: **#e7b772**;
- `ears.v2` remains behavior owner.

**Technical evidence:** 51/51 static + 10/10 syntax + 53/53 browser PASS on run `35591372998`.

**Assistant visual observation:** the prior intersections/tears are gone and the ear now reads as a clean toy/clay candidate. Georg visual acceptance is still required.

**Reusable rule:** when the donor supplies the right identity/measurement/behavior but its topology fights the target visual language, preserve the donor seams and measurements; rebuild only the presentation shell instead of applying a third cosmetic topology patch.
