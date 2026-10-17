# RETURN · B7 · Dschungel-Computer (V-397) · WSB · 2026-10-17

**Status: DONE. Georg 17.10.: beide Rahmen nehmen, Default B · Holz, Tuning später** (siehe unten). Die Browser-Fassung ist fertig: Monitor vermessen, Ruhezustand ohne Billboard, Stein- und Holzrahmen in Knete, Augen-Anker gesetzt. Gerendert wurde **ohne** Augen, weil Georg das bis zur Figurenkarte zurückgestellt hat (V-391).

## Quelle
- `~/Dropbox/CLAUDE/MeshyModels/Meshy_AI_jungle_computer_diora_1017014450_image-to-3d-texture.glb`
  - Größe: 234 MB, sha256 `7e9663bf11abc738c6630c89a987762c8e2b1127abe817a57a5cffcbfee46531` (`_src/source.sha256`)
  - Geometrie: 7.0 M Dreiecke, 1 Mesh, 3 JPEG-Texturen (Farbe, Metall/Rau, Normal)
  - Bounding Box: 1,87 × 1,11 × 1,79 u
- Quell-Isolation in vier Ansichten: `renders/B7_source_front|q34|side|top.png`
- **Inhalt:** Röhrencomputer aus Stein auf Tempelstufen. Links eine Lautsprecher-Gitterplatte, rechts ein Lautsprecher mit roter Linse, oben eine Steinmaske. Dazu Tastatur, Totems, Holzpfosten mit Anhängern, Pflanzen und Schalen.

## Browser-Fassung
**Stand v3 (17.10., Lautsprecher-Fix):** Die Dateien unten ersetzen v2/v1. Die alten liegen in `_superseded/`.

| Datei | Dreiecke | Größe | Texturen |
|---|---|---|---|
| `JungleComputer_A_browser.v3.glb` | 80 000 | 6,9 MB | WebP 2048 (q90) + gebackene Normal-Map |
| `JungleComputer_LOD1.v3.glb` | 25 000 | 2,3 MB | WebP 1024 |
| `JungleComputer_A_screen.v2.glb` (Stein) | 80 000 + Rahmen 8 134 | 7,6 MB | + Ruhemotiv |
| `JungleComputer_B_screen.v2.glb` (Holz) | 80 000 + Rahmen 16 512 | 8,1 MB | + Ruhemotiv |

- **Verfahren:** Headless Blender 5.2 (Collapse-Decimate, wie WS0 `_browser/_tools/decimate.py`). meshoptimizer/Node gibt es auf dem Mac mini nicht.
- **v3 Lautsprecher-Fix (Georg 17.10.: Artefakte am Lautsprecher):**
  - **Ursache:** Die gleichmäßige Dezimierung hatte die Gitter-Löcher links zu großen, spitzen Dreiecken zusammengefaltet: 718 Dreiecke für die ganze Platte. Die Meshy-Normal-Map passte danach nicht mehr.
  - **Versuch 1, nur Normal-Bake vom Original auf 80 k:** fast keine Wirkung (`renders/B7_lautsprecher_2_nur_bake.png`). Fehlende Löcher lassen sich nicht wegbeleuchten, und K1 schwächt Normal-Maps ohnehin auf 0,45 ab.
  - **Lösung:** Dezimierung mit geschützten Detailflächen, die 80 k insgesamt bleiben gleich (`scripts/b7_redecimate.py`, Vertex-Gruppe, Gewicht 0,2 in vier Boxen).

    | Detailfläche | Dreiecke v2 | Dreiecke v3 |
    |---|---|---|
    | Gitter | 718 | 4 216 |
    | Linse | 121 | 1 661 |
    | Maske | 430 | 4 963 |
    | Tastatur | 657 | 5 636 |

    Danach Umfärben, Normal-Bake Original → 80 k (`scripts/b7_bake.py`; Cycles, Tangentenraum, 2048, Käfig 0,012 u; 12 s, Spitze 5,5 GB) und Rahmen neu.
  - **Bilder:** `renders/B7_lautsprecher_1_vorher|2_nur_bake|3_nachher.png` und Gesamtansicht `B7_idle_weit_v3.png`. Der Rest des Modells sieht aus wie vorher.
  - **Nebenwirkung:** Die Bühnenrand-Palette hat sich leicht verschoben. Moos-Oliv `#5a610d` liegt jetzt bei 43,9 %, siehe `data/b7_stage_edges.json`; die alte Fassung liegt in `_superseded/`.
  - Die A/B-Rahmenbilder (`B7_A_*`, `B7_B_*`) stammen noch von v1. Die Rahmen sind identisch, nur der Lautsprecher war schlechter.
- **Lage:** Basis y = 0, Mitte xz = 0.
- **Ressourcen:** Spitzenverbrauch 5,4 GB RSS, 56 s. Watchdog ausnahmsweise 10 GB statt 8 GB, Grund: 7 M Dreiecke. Der Swap war frei.
- **Maßstab 4,2 m/u.** Begründung: Setzstufen ≈ 0,045 u entsprechen 0,19 m. Damit:
  - Computer ≈ 7,9 × 4,7 × 7,5 m;
  - Bildschirmglas 1,78 × 1,36 m (4:3).

## Bildschirm (`*.slot.json`)
- **Glas** per Strahlenraster gemessen (dunkelgrüne Texel am Treffer, `data/b7_grid_measure.json`):
  - x −0,262 … 0,162 u, y 0,508 … 0,832 u, z ≈ −0,013 u;
  - frontal, Normale (0, 0, 1).
- **Kartenfläche `kfb_screen_slot`:** volle Glasbreite × Kartenformat 1,793 → 0,424 × 0,2365 u (1,78 × 0,99 m).
  - Sie sitzt vor dem vordersten Geometriestück im Kartenbereich: Eine Liane liegt auf dem Glas und stach sonst durch die Karte.
  - UV nach glTF-Konvention (`flipY = false`).
- **Ruhezustand ohne Billboard (Georg 17.10.)** als `kfb_screen_idle`:
  - Das Motiv (Pyramiden-Karte, Glyphen-Liste) ist im Original durch die Dezimierung verzerrt. Es wurde deshalb im **Original** orthografisch abfotografiert (nur Albedo, 2048 × 1565) und als flache Fläche 2 mm vor die gewölbte Glasmitte gesetzt.
  - Laufzeit: unlit.
  - Standard: Rahmen und Kartenfläche aus, Ruhemotiv an (wie bei der Portal-Ruine, `billboard.defaultVisible: false`).
- **Varianten (beide in Knete, Profil `prop`, abgerundet und leicht geknetet, V-369):**
  - **A · Stein:** Rahmen in Gehäusefarbe `#C9B796` mit eingekerbten Rissen und Fugen. Zwei Längsbalken engen das 4:3-Glas auf Kartenformat ein.
    - Story: Ein Steinmetz der Anhänger hat dem Bildschirm eine Fassung aus demselben Stein gehauen.
  - **B · Holz:** vier gezimmerte, überstehende, leicht schiefe Balken `#8A5634` mit Lianen-Seil `#CDB27A` an den Kreuzungen.
    - Story: Die Anhänger haben der heiligen Karte einen Halter gezimmert.

## Augen-Anker (nur gesetzt)
- **`KFB_Eye_C_anchor` (Zyklop):** rote Linse im rechten Lautsprecher.
  - Mitte (0,363, 0,555, 0,003) u, Radius 0,047 u ≈ 0,20 m.
  - Lokal +Z = frontal (keine Außen-Normalen, V-201), +Y = oben, Skalierung = Augenradius.
- **Alternative:** `KFB_Eye_L/R_anchor_mask_alt` auf den beiden Glyphen der Steinmaske über dem Monitor.

## Georg-Tunes (Chat, 17.10.)
1. **Ruhemotiv ohne Billboard plausibel:** gelöst über das unverzerrte Motiv aus dem Original (siehe oben).
2. **Braune Stufen-Flecken unter der Tastatur:** Die rotbraunen Texel der oberen Stufen wurden auf den Stein-Ton der Nachbarstufen umgefärbt (Median `#E6BA9F` im sRGB-Texturraum). Dabei bleibt die Struktur relativ erhalten, Fugen und Moos werden nicht angefasst. Nachweis: 6 800 bzw. 19 942 Texel nachweislich in der Exportdatei geändert.
   - Stolperstein unterwegs: Blender exportiert eingebettete Bilder unverändert, wenn man nur ihre Pixel ändert. Lösung: neue Bild-Datenbank.

## Bühnenrand (`data/b7_stage_edges.json`, Format `kfb.stage-edges/1`)
- `footprint`: konvexe Hülle der Geometrie bis 0,5 m über dem Boden, 29 Punkte, ≈ 40,7 m². **Das ist eine Näherung**; WS0s Methode schneidet die Bodenplatte.
- `edgePalette`: `#575d0c` 32,8 %, `#695317` 30,1 %, `#646414` 26,0 %, `#8f733c` 5,9 %, `#bf9b71` 5,2 % (Moos-Oliv und Erdbraun). Bodenfarbe nach V-396 = größter Anteil.

## Bilder
`renders/`, alle 1920 px, Knete, J17-Sonne ohne Gegenlicht, Schatten nach Rezept:
- `B7_idle_weit|nah`, `B7_A_weit|nah`, `B7_B_weit|nah`
- `B7_check_markers.png`: Messkontrolle, interne Markierungen
- `B7_screen_idle_capture.png`: das Motiv

Proof-Seite: `proof/b7_stage.html`.

## NOT_RUN / offen
- **Kein Augen-Render:** von Georg zurückgestellt. Die Anker-Ausrichtung ist nur rechnerisch gesetzt, nicht im Bild geprüft.
- **Keine Figur als Maßstab im Bild:** Mumien ohne Augen-Rig sind nicht erlaubt.
- Keine Laufzeit-Messung (fps, Draw-Calls) und kein Hypernormalisation-Screen getestet. Die Ruhe-Fläche ist nicht als „unlit“ im GLB markiert, das macht nur die Proof-Seite.
- Rahmen v1 schlicht:
  - A ist eher Bilderrahmen als Artefakt;
  - die Seil-Bindungen in B lesen sich teils wie helle Hörner.

  Beides lässt sich nach Georgs Wahl tunen.
- Rest-Spiegelung der Liane: Sie liegt auf dem Glas und ist im Motiv mit abgebildet, die Ruhe-Fläche verdeckt das 3D-Stück dort.
- Die Proof-Seite läuft aus dem Scratch-Spiegel (Pfade `../../proof/vendor`), nicht direkt aus dem Dropbox-Ordner.

## Georg zu den Rahmen (Chat, 17.10.): beide nehmen, Default Holz, Tuning später
- **Entscheid:** Beide Rahmen sind brauchbar. **Default ist B · Holz**, weil er sich schöner in die Szene einfügt. A · Stein bleibt als Variante.
- **Tuning-Backlog, später, nicht jetzt:**
  - **Stein (A):**
    - etwas weiter nach hinten schieben, damit er sich mehr in die Szene einfügt;
    - das sich wiederholende Muster ist sichtbar, vermutlich die Textur bzw. die Relief-Kachel. Siehe Knete-Look R2: Kachel-Wiederholung auf großen Flächen.
  - **Holz (B):**
    - Die hellen Ringe an den Kreuzungen sind als Seil-Bindung falsch konstruiert und zu groß.
    - Sie lesen sich aber wie Halterungen oder Stoßzähne, und das gefällt Georg. Beim Tuning deshalb nicht einfach durch Seil ersetzen, sondern bewusst entscheiden: Seil richtig wickeln oder als Stoßzahn-Halter ausformen. Bilder für die Entscheidung kommen dann.
  - **Für beide:** neue A/B-Bilder auf v3, damit der Lautsprecher sauber ist.
- **Schweben:** Georg sieht das Modell über dem Boden schweben.
  - **Gemessen** (`scripts/b7_ground_gap.py`, 120 × 120 Strahlen von unten): 98 % der Unterseite liegen 6,1 bis 6,6 cm über dem tiefsten Punkt, weil einzelne Steinspitzen tiefer ragen.
  - **Festgelegt:** `data/b7_stage_edges.json` → `groundY_u = 0,0238` (0,10 m). Das sind 6,3 cm Schwebe plus etwa 4 cm Einsinken, also rund 20 % der untersten Stufe (V-396).
  - **Der natürliche Übergang** (Schürze, Dünen, Verwehungen, Übergangssteine) ist WS1 Schritt 4 (V-341) mit WS0-Daten. Die WSB-Proof-Bühne bleibt bewusst flach.

## Nächstes Gate (eins)
Rahmen-Tuning, sobald Georg es freigibt (siehe oben). Der Augen-Render folgt, sobald die Figurenkarte steht.
