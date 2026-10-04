# HANDOVER — Cartoon-Verbieger für Zone-Props (Worldbuilder)

**Ziel:** Ein wiederverwendbarer **„Cartoon-Verbieger"** für Props im Worldbuilder — Türme leicht
gebogen, Fässer schief, Requisiten lebendig windschief (Nickelodeon-Look). **Automatisch, in sich
konsistent für ein Set, per Instanz variiert.** Direkt an Zone-Props/Sets testbar (Graveyard, Türme,
Pirate-Teile — alle GLBs liegen auf GitHub, `media/3D_Assets/…`).

## 1 · Der Look, in einem Satz
Weiche **Bogen-Verbiegung** (nicht geknickt) + leichte **Neigung** + **Verjüngung** + eine Spur
**Verdrehung**, stärker nach oben hin — plus optional atmendes **Squash & Stretch**. Subtil. Ein gerader
Turm wird eine leichte Banane, kein Gummi.

## 2 · Wie (Vertex-Verformung im Objektraum — nichts an der Datei ändern)
Im Vertex-Shader (`onBeforeCompile` auf dem Prop-Material, oder ein geteiltes Shader-Snippet). Alles in
**normierten Objektkoordinaten**, damit es über das Set konsistent ist:

```
t   = (y - bbMinY) / (bbMaxY - bbMinY)     // Höhe 0..1
// weiche Verbiegung (quadratisch → am Fuß verankert, oben am stärksten)
pos.x += bendX * t*t;   pos.z += bendZ * t*t;
// Neigung (linear)
pos.x += leanX * t;     pos.z += leanZ * t;
// Verjüngung (oben schmaler/breiter)
pos.xz *= (1.0 - taper * t);
// leichte Verdrehung um die Hochachse
rotateXZ(pos, twist * t);
```
- **Anker am Boden:** Verbiegung/Verjüngung mit `t` (bzw. `t²`) → das Prop bleibt unten stehen und wird
  nach oben krumm. Kein Schweben, kein abgeschnittener Fuß.
- **Normalen:** nach der Verformung neu annähern (oder leichten Beleuchtungsfehler akzeptieren — im
  stilisierten Look meist unsichtbar).

## 3 · Konsistenz für ein SET (der wichtige Punkt)
- **Bounding-Box je Prop normieren** (0..1 über Höhe/Breite), NICHT in Metern rechnen. So biegt sich ein
  kleines Fass und ein hoher Turm **gleich stark relativ** → das ganze Set spricht eine Sprache.
- **Ein Parametersatz fürs Set:** `bendMax, leanMax, taperMax, twistMax, squashAmp`. Diese Grenzen gelten
  für alle Props des Sets.
- **Per-Instanz-Seed:** jede platzierte Instanz zieht aus `mulberry32(seed)` ihre Werte **innerhalb** der
  Grenzen (`bendX ∈ [−bendMax, +bendMax]` usw.). → alle unterschiedlich krumm, aber **reproduzierbar**
  (gleicher Seed = gleiche Form, kein Flackern beim Neuladen). Seed = Instanz-Index ⊕ Zonen-Seed.
- Ergebnis: „automatisch + in sich konsistent + lebendig" — eine Regel, viele Varianten.

## 4 · Squash & Stretch (optional, animiert)
Volumen-erhaltend, gegen „Ballon": `sy = 1 + amp*sin(phase + time*speed)`, `sxz = 1/sqrt(sy)`. Phase pro
Instanz aus dem Seed → das Set atmet ungleichzeitig. (Die Pets machen das schon — dieselbe Idee.)

## 5 · Ehrliche Haken (im Brief lassen)
- **Weich nur bei genug Höhen-Segmenten.** Ein Turm mit vertikaler Unterteilung biegt sich rund; eine
  grobe 2-Ecken-Kiste **schert** nur. Sehr grobe Low-Poly-Props: entweder einmal leicht **unterteilen**
  (Höhen-Segmente einziehen), ODER bei ihnen nur **neigen + verjüngen** (kein Biegen). Beim Set-Test
  sofort sehen, welche Props biegbar sind.
- **Rein optisch** (keine Physik/Kollision). Für Deko-Props ok; Props, auf/an denen man landet, nur
  leicht verformen.
- **Kein Über-Gummi.** Nickelodeon ist subtil — Grenzen klein starten (siehe §7).

## 6 · Test-Oberfläche (direkt im Worldbuilder)
- Ein **Zonen-Prop-Set** laden (z. B. Graveyard-Steine/Kreuze oder Türme aus `GLB_pirate`/Kenney).
- Regler: **Biegen · Neigen · Verjüngen · Verdrehen · Squash-Amplitude · Seed** + Umschalter
  „Per-Instanz-Seed an/aus".
- Danebe: **eine Reihe desselben Props mit verschiedenen Seeds** → man sieht die Set-Konsistenz (alle
  gleiche Sprache, keiner gleich) auf einen Blick.
- Der Worldbuilder gibt den Parametersatz pro Prop-Set an den Scatter weiter (wie die Streu-/Palette-Config).

## 7 · Startwerte (konservativ, dann eindrehen an Georgs Referenz)
`bendMax ≈ 0.06` (× Höhe), `leanMax ≈ 0.05`, `taperMax ≈ 0.12`, `twistMax ≈ 6°`, `squashAmp ≈ 0.03`.
Georg reicht Referenzbilder nach — dann die Grenzen daran justieren. **Am Regler konvergieren, nicht raten.**

## 8 · Stack / Regeln
- **WebGL, three 0.160, ein Build.** Kein WebGPU.
- **Deterministisch per Seed** (gleiche Zone/Instanz → gleiche Form).
- Assets über RAW-URL. Reiht sich in das vorhandene Per-Instanz-Seed-Muster ein (Box-Material, Pet-Motion).
- **Verformung objekt-normiert**, nie in Weltmetern (sonst inkonsistent über Größen).

## 9 · Abnahme
- Ein Turm liest sich **weich gebogen**, nicht geknickt; Fuß steht, Kopf ist krumm.
- Ein Prop-Set wirkt **konsistent windschief + je Instanz anders**; gleicher Seed = gleiche Form.
- Grobe Props fallen auf (schern statt biegen) → dokumentiert, mit Neigen/Verjüngen als Fallback.
- Keine kaputten Normalen/Löcher, die wie ein Bug aussehen. Anmutung entscheidet Georgs Auge.
