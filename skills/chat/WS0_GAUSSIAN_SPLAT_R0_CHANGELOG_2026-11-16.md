# WS0 Gaussian Splats R0 · Additive Changelog · 2026-11-16
Alle Einträge sind additions-only; Source-Branch `docs/ws0-splat-assets-slops-scenelets-r0-2026-11-16`.

## 01 · Drei Klassen definiert
- 2D Props: echtes vorhandenes Alpha-PNG → nur 2.5D bei fehlendem 3D; gesondertes Mesh-/SDF-Original nur nach Quellenprüfung.
- Slops: ein Actor aus bereits vorhandenem privatem 72er InkBlob-Atlas, face-safe SDF/Splat-Kandidat; vorhandener mobs2d/Hit/Jump/Splash-Owner.
- Scenelets: echtes vorhandenes GLB aus aktuellem Diorama-Pfad, unveränderte Quellen-/Collider-/LOD-Basis.
- Gemeinsam: Original isoliert vor Konverter, geometrischer und visueller Side-by-Side, Performance/alpha/96px; Patch später.
- Datei: `WS0_GAUSSIAN_SPLAT_2D_SLOPS_SCENELETS_R0_2026-11-16.md`.
- Briefing-Commit: `d42f154ace1d12a063975b0cfbc05f20112071e3`; Datei danach zurückgelesen.

## 02 · Folgeauftrag Dungeon/Höhlen ergänzt
- Reale Quelle: R3 InfiniteRooms 3.0.0-candidate.2, 3.2×3.2-m-Luke, zwei Räume, frei bleibender Gang und 18-m-zerstörbares Zwischenmaterial. Environment- und Look-Freigabe weiterhin NO-GO.
- Eingang, Wanddurchbruch, Raum sind getrennte Beweisobjekte, aber ein kleiner zusammenhängender Testkorridor.
- A Originalmesh, B SDF→Mesh, C Originalmesh→Splat, D SDF→Splat; Kollision, Apertur, Material, Renderer und Licht unabhängig vergleichen.
- Datei: `WS0_SDF_SPLAT_DUNGEON_CAVES_ROOMS_WALLS_ENTRIES_R0_2026-11-16.md`.
- Briefing-Commit: `19db15070a7cdfc8c1eb85c44bff0268833013a5`; Datei danach zurückgelesen.

## 03 · Übergabe
- Local Return + Changelog, Review-Router/Hub-Hinweis. **Keine** Splat-Implementierung, kein Asset-Binärimport, keine Render-, Collider- oder GPU-Tests im Auftrag; keine öffentliche Stage und kein Live.
- Keine neuen Stilkanons, keine placeholders, kein zweiter Runtime-Owner, kein Merge/Live.
- Nächster Gate: Source-Objekte einzeln mit echten Bytes/Hash isolieren; erst dann A/B-Viewer, danach Dungeon-Vergleich.
