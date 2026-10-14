# Meshy Amphitheater · Quell-Isolation R1 (14.10.2026, WS1)

Gate: `WS1_MESHY_AMPHITHEATER_SOURCE_ISOLATION_AND_SINGLETON_01` (README `media/3D_Assets/MeshyModels/README.md` auf `planning/frankenstein-composer-gpt-site-2026-10-04` @708d8fae). Auftrag von Georg im Chat, WS0 koordiniert. **Teil 1 (Quelle isolieren) erledigt; Teil 2 (Registrierung, Ablage, Einbau) wartet auf WS0.**

## 1 · Übernahme, unverändert
- Quelle: geteilter Dropbox-Ordner `/CLAUDE/MeshyModels/` (Link aus der README), als Ordner-Zip geladen. Es enthielt genau die zwei Dateien, Größen wie in der README.
- Ablage WS1: `~/kfb-ws1/assets/meshy/` auf Georgs Mac, schreibgeschützt. **Nicht im Repo** (siehe §4).

| Datei | Bytes | SHA-256 |
|---|---|---|
| `Meshy_AI_Claymation_Amphitheat_1014024048_image-to-3d-texture.glb` | 73 029 272 | `11846848465efb0f119bf2ab27290787cdbb2c63f55773915d1dca38952a9efb` |
| `Meshy_AI_Claymation Amphitheater.png` (Vorschau, 1536 × 864) | 2 093 325 | `5d4f70045934f86615919072eb36e7f647ffe1fd25da9c3bddffa482d99d52ed` |

## 2 · Inventur (aus dem GLB selbst, `glbinfo.mjs`, ohne Konvertierung)
- glTF 2.0, Generator `pygltflib@v1.16.5`, keine Erweiterungen, 1 Szene, **1 Knoten** (Einheitsmatrix), **1 Mesh, 1 Primitive** (Dreiecke).
- **861 843 Punkte, 1 622 044 Dreiecke.** Attribute: POSITION, NORMAL, TEXCOORD_0.
- Maße (normalisiert): 1,903 × 0,490 × 1,701 (x × y × z), Mitte ≈ Ursprung. **Y ist oben.** Die offene Seite des Halbrunds zeigt nach +Z.
- 1 Material (PBR): Farbe 4096² JPEG (14,1 MB), Metall/Rau 2048² JPEG (1,9 MB), Normalen 4096² JPEG (10,0 MB); metallic 1 (gesteuert über die Textur), roughness 1, doubleSided, OPAQUE.
- Keine Animation, kein Skin. Ein einziges zusammenhängendes Mesh, nicht in Teile gegliedert.

## 3 · Sichtprüfung (Render des unveränderten GLB, three 0.186.1 GLTFLoader, neutrales Licht; `amph.html`)
- `pair_preview_vs_render.jpg`: Meshy-Vorschau neben Render aus derselben Richtung (Azimut 0°, Elevation 35°), dazu Rückseite und Innenansicht. **Stimmt mit der Vorschau überein:** zwei Bogen-Ruinen, freistehende Säulen, sechs Sitzreihen mit drei Treppen, runde Bühnenfläche mit Steinrand, Knet-Felsen, Grün.
- `sheet_orbit.jpg`: Rundum (8 × 45°): geschlossen, ohne Löcher.
- `sheet_detail.jpg`: Aufsicht, flach vorne, flach hinten, unten, viermal von der Bühnenmitte aus.
  - Die **Rückseite** ist ausmodelliert (Mauer, Felsen, Grün).
  - Die **Bühnenfläche** ist eben und ohne Hindernisse.
  - Von der Bühne aus umschließen die Ränge rund 270°, vorne ist der Zugang offen.
- **Befund A · offene Unterseite:** Das Modell ist eine Hülle ohne Boden. Von unten sieht man ins dunkle Innere. Es muss auf Gelände stehen (Bodenschluss V-203) und darf von unten nicht sichtbar sein.
- **Befund B · Last:** 1,62 Mio. Dreiecke und ~200 MB Grafikspeicher (zwei 4K-Texturen) als eine einzige Zeichnung. Georgs Hinweis: Auch die hochauflösenden Texturen kommen als Ursache infrage. Gemessen auf Georgs Mac (Apple M4, ANGLE Metal, 1536 × 864, nur das Amphitheater, 120 Bilder Rundflug, GPU-Sync per readPixels; `amph-bench.mjs`). Die Varianten liegen nur im Speicher, das Original bleibt unverändert.

  | Variante | Bildzeit Median | p95 |
  |---|---|---|
  | wie geliefert (Farbe/Normalen 4096², Metall/Rau 2048²) | 8,5 ms | 11,3 ms |
  | Texturen auf 1024² (Metall/Rau 512²) | 8,1 ms | 10,6 ms |
  | ohne Texturen | 6,1 ms | 7,6 ms |

  **Lesart:**
  - Für die **Bildrate** ist die Texturauflösung fast egal (−0,4 ms). Die meiste Zeit (≈ 6 ms) kostet die Geometrie mit 1,6 Mio. Dreiecken.
  - Die 4K-Texturen kosten vor allem **Speicher und Ladezeit**: ~26 MB JPEG zum Herunterladen und Dekodieren, ~180 MB Grafikspeicher mit Mipmaps.
  - Allein belegt das Theater gut die Hälfte eines 60-fps-Budgets (16,7 ms). Figuren, Billboard und Blasen kommen noch dazu.
  - Hebel für die Bildrate: Geometrie reduzieren. Hebel für Speicher und Download: Texturen auf 2048² und KTX2 bringen.
  - Beides in einer Browser-Fassung unter eigener Kennung, mit Bildpaar gegen das Master (§4.1).

## 4 · Fragen an WS0 (blockieren nichts außer dem Einbau)
1. **Ablage:** Das Repo hat kein LFS. Die größte Datei unter `media/3D_Assets` hat heute ~23 MB, das GLB 73 MB (GitHub warnt ab 50 MB, Grenze 100 MB). Vorschlag:
   - das Master-GLB bleibt in der Dropbox, mit SHA-256 und Herkunft im Asset Librarian;
   - ins Repo kommt nur eine geprüfte Browser-Fassung unter eigener Kennung und Version: Meshopt/Decimation auf ~300–500 Tsd. Dreiecke, Texturen 2048² KTX2/WebP, Ziel < 20 MB;
   - dazu ein Bildpaar Master | Browser-Fassung aus gleichen Kameras.
   - Das Werkzeug dafür (z. B. `@gltf-transform/cli`) wäre eine neue Abhängigkeit. Bitte freigeben.
2. **Registrierung:** genau eine Asset-Kennung über den vorhandenen Asset Librarian (`registry/assets/v1`). Wer trägt ein, WS1 oder der Librarian-Owner?
3. **Maßstab:** Vorschlag Bühnenfläche ≈ 14 m Durchmesser (Faktor ≈ 19). Dann ist das Theater ≈ 36 × 9 × 32 m. Das 12 × 6 m-Billboard (V-220) passt hinten auf die Bühne, zwei Figuren davor. Bitte bestätigen oder vorgeben.
4. **Einbau-Reihenfolge:** Das Amphitheater wird die erste Bühne statt der Hex-Kulisse (V-216: kompakter organischer Boden). Eingehängt wird es als Modul `create/update/dispose` über ModuleHost, eine Platzierung. Darin kommen nur vorhandene Bausteine: Billboard nach V-220, Figuren mit Eye-Rig (F1), Blasen und Wahl (S5). **WS1 baut den Einbau erst, wenn Billboard und F1 stehen**, sonst stünden wieder Figuren ohne Augen bzw. Karten als Rechtecke in der Szene.
