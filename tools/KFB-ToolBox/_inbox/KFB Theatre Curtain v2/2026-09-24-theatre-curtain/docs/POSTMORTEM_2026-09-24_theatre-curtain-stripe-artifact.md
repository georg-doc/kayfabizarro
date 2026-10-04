# Postmortem — KFB Theatre Curtain v1, Streifen-/Flicker-Artefakt

**Datum:** 2026-09-24
**Betroffen:** `KFB Theatre Curtain.dc.html` + `game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`
**Status:** Reißleine gezogen. CPU-Verlet-+-Textur-Architektur wird nicht weiter gepatcht.
**Entscheidung:** Neustart in frischem Chat auf Basis des drei.js-WebGPU-Donors (siehe HANDOVER-Dokument).

## 0. Zusammenfassung für den ungeduldigen Leser

Der v1-Donor (`kfb-theatre-curtain.mjs`, CPU-Verlet-Cloth + KFB-Fabric-Texturen) zeigt bei Bewegung
durchgehend ein Streifen-/Flicker-Artefakt auf allen vier Fabric-Sets. Fünf aufeinanderfolgende,
jeweils technisch begründete Fixversuche haben das Problem **nicht** beseitigt. Der direkte 1:1-Vergleich
mit dem offiziellen three.js-Beispiel (`examples/webgpu_compute_cloth.html`, das dieselbe Verlet-Cloth-Idee
implementiert) zeigt: **das Original hat überhaupt keine Textur** — nur Volltonfarbe + Sheen + HDR-Reflexion.
Das ist der eigentliche Strukturunterschied, nicht irgendein Parameter, den man tunen kann. Weiteres
Patchen der bestehenden CPU-Verlet+Textur-Architektur ist erwartungsgemäß nicht zielführend.

## 1. Chronologie der Fixversuche

| # | Hypothese | Maßnahme | Verifikation | Ergebnis |
|---|---|---|---|---|
| 1 | Textur-Aliasing/Anisotropie fehlt | `texture.anisotropy = maxAnisotropy`, explizite Mipmap-Filter | Nur statischer Screenshot, **keine** Bewegungsprüfung | Nutzer: "hat nichts gebracht" |
| 2 | Mesh-Trianguliserung — jedes Quad immer gleiche Diagonale geschnitten → kohärente Facetten-Bänder unter Sheen | Diagonale schachbrettartig alternieren (`(x+y)%2`), Mesh-Auflösung 26×32 → 34×40, Sheen runter, `normalScale` runter | Statischer Screenshot vor/nach — sah klar besser aus | Nutzer bestätigte zunächst optisch besser, aber Ursache noch nicht durch Bewegungsvergleich geprüft |
| 3 | Normal-Map + Sheen verstärken winzigen Physik-Jitter zwischen Frames zu sichtbarem Schimmern | `normalScale` 0.4, `sheen` 0.16, `sheenRoughness` 0.95, `roughness` 0.9 | **Erster echter Mehrframe-Vergleich** (4 Screenshots über 12 Physik-Substeps) — Verbesserung im Vergleich sichtbar | Nutzer: "immer noch Streifen-Artefakte im Gegensatz zum Original" |
| 4 | `BufferGeometry.computeVertexNormals()` ist an die (nun alternierende) Dreiecks-Topologie gekoppelt und daher pro Frame leicht inkonsistent | Normalen analytisch pro Vertex aus 4 Nachbarn berechnen (`cross(tangent, bitangent)`), komplett unabhängig von der Dreiecks-Topologie — direkt nach Vorbild des offiziellen Beispiels | 4-Frame-Vergleich | Nutzer: "keine Änderung" |
| 5 | Die gekachelte `normalMap`/`roughnessMap` selbst ist die Quelle, nicht die Mesh-Normale | `normalMap` und `roughnessMap` komplett entfernt, nur noch `map` (Diffuse) + `aoMap` + `sheen`, wie im Original | 4-Frame-Vergleich, sah im Vergleich stabiler aus | Nutzer: **"nein das bringt so alles nichts"** → Abbruch |

## 2. Direkter 1:1-Vergleich mit dem offiziellen Donor

Auf Nutzerwunsch wurde `mrdoob/three.js` `examples/webgpu_compute_cloth.html`
(gepinnter Commit `7300402f96c23bfa2174ffc0da01fb4e277d33da`, three.js `0.186.0`) **unverändert**
gemountet als `Three.js Donor - webgpu_compute_cloth.html` (WebGPU-Renderer, live via CDN + threejs.org-Assets).//
Läuft im Preview mit >130 FPS, **vollständig streifenfrei**, auch bei Bewegung.

### Strukturelle Unterschiede Original vs. KFB-Port

| Aspekt | Offizielles three.js-Beispiel | KFB CPU-Verlet-Port |
|---|---|---|
| Fabric-Textur | **Keine** — nur `color` (Volltonfarbe) + `sheen` + HDR-Environment-Reflexion | 4 gekachelte Texturen (diffuse/normal/roughness/AO) aus KFB-Fabric-Library |
| Normalenberechnung | Analytisch, pro Quad, aus den 4 lebenden Verlet-Eckpunkten (`cross(tangent, bitangent)`), jeden Frame neu auf der GPU | `computeVertexNormals()` (CPU, Dreiecks-Mittelung) → dann analytisch ersetzt (Fix #4), änderte nichts messbar |
| Render-Mesh | Separates, gröberes Mesh: 1 Vertex pro Quad-Zentroid, nur zur Konnektivität — Normale kommt aus dem Shader-Node, nicht aus der Mesh-Topologie | 1:1-Grid-Mesh, Normale direkt auf den Simulations-Vertices |
| Physik-Rate | 360 Hz, GPU Compute Shader (WebGPU/TSL) | 120 Hz, CPU Verlet (JS) |
| Wind | `triNoise3D` (organisches 3D-Noise auf Weltposition+Zeit) | Summe zweier Sinus-Terme, phasenabhängig von lokaler Position |
| Federn | Nur Struktur- + 2 Diagonal-Federn | Struktur + 2 Diagonal + 2 "Skip-2"-Biege-Federn |
| Fixpunkte oben | Jede 5. Spalte | Jede 2. Spalte |
| Beleuchtung | HDR-Environment-Reflexion (`royal_esplanade_2k.hdr`) | Spot- + Point-Lights, kein Environment |
| Material | `MeshPhysicalNodeMaterial`, `transparent:true, opacity:0.85` | `MeshPhysicalMaterial`, `side:DoubleSide`, opak |

**Kernbefund:** Das Original erzielt seinen überzeugenden Stoff-Look **ausschließlich** über Sheen +
Falten + Environment-Reflexion — ganz ohne eine einzige Textur. Genau die gekachelte
Normal-/Roughness-Map, die den "exakten KFB-Fabric"-Look liefern sollte (README-Vorgabe des
ursprünglichen Game-Asset-Packages), ist im direkten Vergleich der wahrscheinlichste Strukturgrund
für das Artefakt — und Fix #5 (Maps entfernen) hat das im Bewegungsvergleich auch bestätigt gebessert,
aber laut Nutzer immer noch nicht auf dem Niveau des Originals.

## 3. Warum wir hier aufhören, statt Fix #6, #7, ... zu versuchen

- Fünf begründete, einzeln verifizierte Fixversuche in Folge haben das Problem nicht auf
  Original-Niveau gebracht. Das ist ein Signal, dass das verbleibende Delta nicht in einem einzelnen
  Parameter liegt, sondern strukturell ist (CPU-Verlet-Grid + reales Textur-Set + Punkt-Lichter vs.
  GPU-Compute-Cloth + texturlos + HDR-Environment).
- Jeder weitere Versuch, das bestehende CPU-Verlet-Setup Richtung "textur-frei + Environment-Light"
  zu biegen, nähert sich in der Praxis einer Neuimplementierung des Originals an — nur eben nicht 1:1,
  sondern über denselben Trial-and-Error-Pfad, den wir gerade fünfmal gegangen sind.
- Das Original läuft bereits, ist geprüft, ist bekannt gut. Der wirtschaftlich richtige nächste
  Schritt ist: **das Original selbst zum Vorhang machen**, nicht seine Eigenschaften in einem anderen
  System nachbilden.

## 4. Was NICHT das Problem war (zur Vermeidung von Wiederholungsfehlern)

- **Nicht** Anisotropie/Mipmap-Filterung (Fix #1) — das war ein reiner Textur-Sampling-Parameter,
  keine Wirkung.
- **Nicht** primär die Mesh-Trianguliserungs-Diagonale (Fix #2) — sah im Standbild besser aus, hat
  das Bewegungsproblem aber nicht gelöst.
- **Nicht** primär die CPU-`computeVertexNormals()`-Kopplung an die Dreiecks-Topologie (Fix #4) —
  Ersatz durch analytische Normalen brachte laut Nutzer **keine** messbare Änderung. Das ist ein
  wichtiger Negativ-Befund: die Mesh-Normalen-Berechnung war nicht die Hauptursache.
- **Am nächsten am Kern, aber nicht ausreichend:** das Entfernen von `normalMap`/`roughnessMap`
  (Fix #5) — Verbesserung im Vergleich sichtbar, aber laut Nutzer immer noch nicht auf Original-Niveau.

## 5. Belege

- `screenshots/postmortem-donor-webgpu-clean.png` — offizielles Beispiel, unverändert, läuft
  streifenfrei bei >130 FPS.
- `screenshots/postmortem-kfb-cpu-verlet-final-state.png` — KFB-Port im finalen Zustand nach Fix #5
  (Standbild; das Artefakt ist ein Bewegungs-Phänomen und daher im Einzelbild nur eingeschränkt
  sichtbar — siehe Nutzer-Feedback für die verbindliche Bewertung).
- Vollständige Fix-Historie in Git-artigen Edits dieser Session, siehe `github.md` "Last sync" und
  Änderungsprotokoll in `CHANGELOG.md`.

## Empfehlung für den nächsten Chat — STATUS: UMGESETZT (2026-09-24, v2)

~~Siehe `docs/HANDOVER_THEATRE_CURTAIN_FRESH_START.md`. Kurzfassung: das offizielle three.js-Beispiel
zweimal (links/rechts) einbinden, rot einfärben, als Vorhang deklarieren, dann inkrementell
Deckungsgrad/Undurchsichtigkeit ergänzen — auf der bewiesen funktionierenden Basis, nicht auf der
CPU-Verlet-+-Textur-Basis.~~

Umgesetzt in `KFB Theatre Curtain v2.html` — siehe CHANGELOG-Eintrag "2026-09-24 — Theatre Curtain
v2". Kein Streifenartefakt, geschlossener und offener Zustand geprüft.
