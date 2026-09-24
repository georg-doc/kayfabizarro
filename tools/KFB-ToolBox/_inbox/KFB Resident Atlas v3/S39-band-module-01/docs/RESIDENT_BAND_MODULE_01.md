# RESIDENT-BAND-MODULE-01 · KayfaBizarros Orc Band ohne Grundplatte · 2026-09-24

Status: **candidate-only · wartet auf Georgs Blick und Handpose.** Kein Push, kein Deployment.

> **S39b · Arbeitsplatz ist jetzt `KFB_Resident_Atlas_S8.html#__band`.** Die eigenständige
> DC-Seite unten ist SUPERSEDED. In S8: Klick auf Arm oder Körper greift den Bone, Klick auf eine
> Requisite greift sie, beide mit dem Werkzeugmenü am Objekt. Der Header-Knopf „IK" schaltet
> CCD-IK wie im three.js-Beispiel ein; beim Trommler zieht der Schlägelkopf. Referenzposen gelten
> je Figur und Bild.

## Was es ist

Ein Band-Modul, das ein Host auf jede echte Fläche setzt (Taverne, Straße, Stadt, WorldBuilder).
Es bringt **keine Grundplatte** mit: das `Ground`-Mesh aus ORB-P1 wird nicht referenziert.
Der Host gibt einen Ankerpunkt auf SEINER Fläche. Das Modul setzt seinen Stützpunkt (lokal y = 0)
dorthin. Die Uhr gibt auch der Host.

- Review: `KFB Resident Band Module 01.dc.html`
- Definition: `data/resident-band-module-01.json` (`kfb.resident-band-module/1`)
- Laufzeit: `lib/band-module.js` · `mountBandModule(def, { parent, anchor })` → `{ root, update(beatPos), place(), dispose() }`
- Review-Host: `lib/band-review.js`, Werkzeuge aus S7 wiederverwendet (`edit-layer`, `rigwork`-Puppe, `studio`)
- Sonden: `tools/band-module-probe.html` (Quellen, Clips, Blob), `tools/band-module-smoke.html` (Laufzeit ohne Oberfläche)

## Quellen (gemessen)

| Rolle | Datei @ Pin | Aktion |
|---|---|---|
| Leader | Legacy `character_orcB.gltf` @ `10a7fdce` + GothGirl-Mikro am `character_orcBArmRight` | `bounce` · 8 Schläge · 7/7 Spuren · Georg OK |
| Gitarrist | `OrcRaider.glb` @ `891eadf0` + `guitar_B` an `chest` (v4-Haltung) | `strum` · 1 Schlag · 69/69 · Georg OK |
| Trommler | `OrcBrute.glb` @ `891eadf0` + `Orc_Wardrum` ×2 + zwei `Orc_WardrumStick` ×2 an `handslot.l/.r` | `drum.v5c` (Standard) oder `drum.v0` · 2 Schläge · 69/69 |
| Szenerie | `Orc_Banner_Large` @ `891eadf0`, abschaltbar | — |
| Song | `Rubbish Groove 2min A extend 01.mp3` @ `c19e291e` | 100 BPM · Phase 0,465 s |

Aktions-Quellen sind die ORB-Exporte an PR #195 Kopf `9dda7957` (`orb_band_module_v5.glb`,
`drummer_v5_stehend_loop2.glb`). **Nur die Clips werden gelesen, ihre Geometrie nie gezeigt.**
Der Song wird vor dem Abspielen geprüft: der Git-Blob-SHA-1 der geladenen Bytes ist
`368eb5ae…` = der Wert aus `SOURCE.json`.

Zwei Umsetzungsdetails, beide gemessen:
- Im Stage-GLB haben zwei Skelette dieselben Bone-Namen, der Loader hängt beim zweiten `_1` an.
  `strum` wird deshalb mit `stripSuffix: "_1"` auf die echte Raider-Datei gebunden (69/69).
- Die Raider-Datei liefert ihr Material ohne Bild (0 Maps). `orc_texture_A.png` wird nachgebunden,
  wie in ORB-P1.

## Trommler-Werkstatt

1. **Schlagbild gemessen, nicht angenommen.** Über alle 48 Bilder: tiefster Punkt des Schlägelkopfs
   (obere 30 % der Keule) gegen die Fellebene, nur über dem Fell.
   v5c: **R Bild 0 · +0,026**, **L Bild 25 · +0,025**. v0: L Bild 3 · +0,076, R Bild 24 · +0,087.
2. **Halten** friert den Trommler auf diesem Bild ein. Werkzeuge: Puppe (Hand-IK; die Hüfte hebt nur
   die Figur, die Trommel bleibt auf der Fläche), Bone-Dreher für die acht Armknochen, Anfasser für
   beide Schlägel.
3. Jeder Griff landet in der Studio-Sammelstelle unter `band-01.drummer.<aktion>@R|L`. Das ist die
   Referenzpose an IHREM Bild.
4. Daraus wird ein **konstanter Patch**: Δ = q_clip(Bild)⁻¹ · q_pose, zur Laufzeit q = q_clip(t) · Δ.
   Die Korrektur läuft also mit der Bewegung mit, statt sie einzufrieren.
5. **Durch Wiedergabe prüfen**: alle 48 Bilder mit Patch nachmessen.
   - HÄLT: beide Schlagbilder |gap| ≤ 0,03, kein Bild tiefer als −0,03 im Fell, R- und L-Referenz
     verlangen für denselben Bone dasselbe Δ (≤ 2°). → „Als Resident-Patch übernehmen".
   - HÄLT NICHT: der Befund geht als `POSE-TO-BLENDER-01` raus, mit der zeitabhängigen Differenz je
     Bild (Abstand ohne/mit Patch, Verschiebung durch den Patch, Soll an den Schlagbildern,
     Eintauch-Bereiche, Bone-Konflikte R/L). **Es wird kein Löser gestartet.**

Ohne Patch hält v5c die Toleranz bereits (siehe 1). Ob der Treffer so AUSSIEHT, wie Georg ihn will,
misst diese Zahl nicht. Genau dafür ist die Handpose da.

## Befunde

- **Trommler v5c steht in der Fläche:** posierte Unterkante −0,105 … −0,082 über die Schleife.
  Nicht still korrigiert: den Trommler anzuheben hebt die Schlägel mit (Treffer 0,025 → ≈ 0,11).
  Anheben plus Arme neu posieren ist Georgs Patch. Die Puppen-Hüfte hebt dafür NUR die Figur.
- **Bannerfuß 0,209 unter der Stützebene** (Pivot an der Basis, Stab ragt nach unten). So stand er
  in ORB-P1. Auf einer Fläche, die dünner als 0,21 ist, sieht man ihn unten herausschauen.
- **Eigener Fehler, gefunden an der Zahl:** three.js schreibt eine Spur nur, wenn sich ihr Wert
  gegenüber dem zuletzt geschriebenen ändert. v5c steht in Bild 0 und 1 still, also blieb der
  aufgetragene Patch stehen und wurde im nächsten Bild noch einmal multipliziert. Gemessen:
  Bild 0 und Bild 1 sind im Clip identisch, mit Patch lagen sie bei 0,41 und 0,77. Jetzt schreibt
  `pose()` vor jedem Auswerten die zuletzt geschriebenen Clip-Werte zurück in die Bones.
  Nachgemessen: 0,4079 / 0,4079.
- Grundriss (gemessen, 16 Proben über 8 Schläge): x −3,85 … 3,92, z −5,0 … 3,51, Höhe 4,82.
  Der Stützpunkt liegt in der Grundriss-Mitte (0, 0, −0,75 im Bandrahmen).
- Host-Test: Boden und Podest 0,60 tragen 4/4 Ecken. Die Theke (3,2 tief) ist absichtlich zu
  schmal, dort meldet die Eckprüfung, dass das Modul übersteht.

## S39c · Gitarre und Trompeter

- Gitarrist: Aktion `ml.guitar.a.fit` aus der KFB Motion Library, dazu die Passung `guitar-fit-v1`
  (Nachbau von ORB `gtr_apply.apply_fit2`). `orb.strum` bleibt als Alternative.
- Trompeter: `character_orcA` + `ToySoldier_Trumpet` ×0,72, Aktion `kfb.trumpet-hold.v0` (erzeugte Pose).
  Mund gemessen bei (−0,035 · 0,975 · 0,637) im Figurenraum, Glocke nach vorn und zur linken Seite.
  Der Arm reicht 0,46, bis zum Mund braucht er 0,76. Für den Toy Soldier bleibt die Passung dieselbe,
  dort greift die Hand per IK (Rig_Medium).

## Nicht gemacht

- Kein automatisches Posieren von Armen, kein IK zur Trommel ohne Georgs Hand.
- Die Mixamo-Fassung „Guitar A auf dem Raider" (Georg OK) gibt es noch nicht als GLB-Export. Sie
  ist deshalb nicht im Browser. Gebunden ist die v4-Haltung aus ORB-P1.
- Der lautstärkeabhängige Sprung des Leaders (ORB `audioReactive`) ist nicht übernommen.
- Studio-Testdaten aus der Abnahme sind gelöscht (`clearRef` R und L). Die Ablage ist leer.

## Nächstes Gate

Georg posiert an R Bild 0 und L Bild 25 → prüfen → entweder **Resident-Patch übernehmen** oder
**POSE-TO-BLENDER-01** mit der exportierten Differenz.
