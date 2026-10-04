# HOUSEKEEPING — Hex Assets Worldbuilding → KFB 3D Asset Repo

**Living-Status je Artefakt.** Stand: 2026-07-26 (Session „Card Zone Lab v1" — Session-Cut, Export)
Status: `AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET` · `SHARED` (von mehreren importiert) · `SPIEGEL` (Kopie, Kanon liegt woanders) · `FORK` (geänderte Kopie, Kanon liegt woanders)

Dieses Projekt wechselt mit dieser Session das Thema: vom **Hex-Worldbench** (abgeschlossen) auf
**KFB 3D World-Assets & Voxel-Worldbuilder** (`_handoff/BRIEF_KFB_3D_AssetRepo_v1.md`).
Sprintplan + Status: **`docs/SPRINT_3D-AssetRepo.md`** · Historie Hex: **`PROJECT_LOG.md`**.

---

## Card Zone Lab (Session 2026-07-26, Cut + Export)

| Datei | Status | Notiz |
|---|---|---|
| `KFB Card Zone Lab v1.dc.html` | **FROZEN** | Abgenommener Spielplatz: 16×9-Zone im v10-Terrain, Wassergraben mit Ufer, Card Cube auf Sockel, Karte im Himmel, Schleier. Weiterbau in **v2** (Kopie), nicht hier. Ist-Stand + gefundene Ursachen: `docs/SESSION_card-zone-lab-v1_2026-07-26.md` |
| `KFB Card Zone Lab v2.dc.html` | **AKTIV** | Kopie von v1 + **Aufdeck-Animation**: die verdeckte Karte liegt flach auf dem Plateau (Rückseite oben) und klappt um ihre Unterkante auf, das Blatt biegt sich dabei; Würfel und Sockel erscheinen erst mit ihr. Auslöser: Knopf oder Annäherung (< 62 Einheiten) |
| `docs/SESSION_card-zone-lab-v1_2026-07-26.md` | **AKTIV (Doku)** | 13 Symptome mit Ursache und Messwert, Vertrag Card Zone, Reglerliste. Die Datei, die ein frischer Chat vor v2 liest |
| `docs/HANDOVER_card-zone-lab_v2.md` | **AKTIV (Doku)** | Was v2 anfasst (Aufdeck-Animation, Zugbrücken, Face-Focus, Seed-Kopplung, Sound, Narrative Flow), plus die Fallen, die schon Zeit gekostet haben |
| `docs/PATCH_v10_terrain.md` | **AKTIV (Doku)** | Die zwei Zusätze am v10-Terrain zum Rückportieren. **Blocker für v2, wenn ignoriert** |
| `KFB Textur-Browser.dc.html` | **AKTIV** | 86 Diffuse-Texturen als Kontaktbogen, A/B am echten Voxel-Cluster, Bewertung ja/prüfen/nein mit JSON-Export. Zwei Presets: *Terrain v9* (unsichtbar genug) und *Struktur* (beurteilbar) — eine Textur muss beide bestehen |
| `kfb-texture-catalog.json` | **AKTIV (Contract)** | v0.1.0 — alle 86 Texturen mit Familie (11), RAW-URL und §5-Vorbewertung. **Zweite Leseart:** die `nein`-Liste ist die Collage-Bank der Card Zones (bedrucktes Zeug ist dort erwünscht) |
| `terrain-v10/voxel-terrain.js` | **FORK / SHARED** | Kanon = `session-v10-cut/terrain-v10/`. Zwei additive Zusätze: `heightStep` (D6-Unterteilung) + `setCarve()` (Zonen-Loch). Beide rückwärtskompatibel → gehören ins kanonische v10 |
| `terrain-v10/world-context.js` · `terrain-v10/edge3.jpg` | **SPIEGEL / SHARED** | unverändert. `edge3.jpg` ist nur lokaler Fallback, Kanon ist die RAW-URL |
| `cardbuilder/kfb-card-builder.js` · `kfb-ink-canon.js` | **SPIEGEL / SHARED** | unverändert. Liefert echte Karten (PDF-Quadrant, Tusche-Kanon). Nur andocken, nicht umschreiben |
| `kfb-box-material.js` | **AKTIV / SHARED** | erweitert: `aStack` (Säulenkopplung — Stapel liest als Säule), Moving Floor (`uKfbAmp`/`uKfbFlow`/`uKfbZone`, Vertrag wie `uZone[4]` in v10), Fluid-Muster (`uKfbFluid` 1 flüssig · 2 gas · 3 fest) |
| `kfb-ink-outline.js` | **AKTIV / SHARED** | drei Fixes: Schwelle skaliert mit dem Anstellwinkel (kein Rauschen an schleifenden Flächen), Stift-Druck als `grain`-Param in groben Zellen, Composer-Target mit `samples: 4` (das „Flackern" beim Drehen) |
| `terrain/` (v9-Spiegel, 2 Dateien) | **SUPERSEDED** | durch `terrain-v10/` ersetzt. Aufräum-Kandidat |
| `captures/01–03` | **ASSET (Beleg)** | Abnahme v1: Zone total · Würfel nah · Graben mit Ufer |

**Nächster Schritt:** `KFB Card Zone Lab v2.dc.html` als **Kopie** von v1 anlegen, dann Aufdeck-Animation.
Vorher `docs/PATCH_v10_terrain.md` entscheiden (zurückportieren oder Fork bewusst führen).

---

## Sprint 3D-AssetRepo (Session 2026-07-25, angelegt)

| Datei | Status | Notiz |
|---|---|---|
| `KFB 3D Asset Repo.dc.html` | **AKTIV** | Living Cockpit: Slice-Leiter mit Status, verifizierte Asset-Wahrheit, Textur-Beleg live per RAW-URL (= Pfad-Hygiene-Beweis), Blocker-Liste. Die eine Seite, die ein frischer Chat zuerst öffnet |
| `docs/SPRINT_3D-AssetRepo.md` | **AKTIV (Doku)** | **Das Living Document.** Slices S0–S4, Definition of Done je Slice, Arbeitsregeln für frische Chats, Datenverträge, Blocker/Upload-Kandidaten, Backlog, Changelog |
| `kfb-textures.json` | **AKTIV (Contract)** | v0.1.0 — die 12 KFB-Texturen als benannte Material-Sets (edge/brick/water/noise/alpha/tri), je mit RAW-URL + Map-Rolle + colorSpace. Alle Pfade am 2026-07-25 gegen den Live-Tree geprüft |
| `constructs.json` | **AKTIV (Contract)** | v0.1.0 — Blueprint-Format für Voxel-Konstrukte steht, `blueprints: []` noch leer (füllt Slice 2) |
| `asset-repo.json` | **AKTIV (Contract)** | v0.1.0 — **986 platzierbare Assets** aus 17 live-Packs, angereichert um `role`, `biomes[]`, `storyModes[]`, `naturalScale`, `ghUrl`. Plus `pending` (20 Packs, nicht platzieren) und `aliases` (Katalog-Name → GitHub-Pfad). Quelle: `CATALOG/INDEX.md` + `github_status.json` |
| `asset-index.js` | **AKTIV** | Runtime-API: `loadIndex`, `getAsset`, `getUrl`, `getSet({biome,storyMode,role,pack,sub,animated,maxFootprint,seed})`, `getTexture`, `edgeVariant`, `getBlueprint`, `buildConstruct`, `hash32`. Deterministisch (FNV-1a + LCG-Shuffle) |
| `media/3D_Assets/CATALOG/` (3 Dateien) | **ASSET / SPIEGEL** | `INDEX.md` (169 KB, 2776 Assets), `github_status.json`, `PACK_SUMMARY.md` — aus dem Repo kopiert, Quelle der Anreicherung. Kanon bleibt das Repo |
| `terrain/world-context.js` | **SPIEGEL / SHARED** | Kanon = `KFB VoxelWorld/terrain-v9/world-context.js`. Nur **andocken**, nicht umschreiben (Brief §8). Kopiert 2026-07-25 |
| `terrain-v10/voxel-terrain.js` | **AKTIV / KANONISCH** | Ab 2026-07-26 kein Fork mehr: `heightStep`, `setCarve`, `setCarvePath` sind übernommen. Spec + Fallen: `docs/SPEC_v10_terrain.md`. Der v9-Spiegel `terrain/voxel-terrain.js` ist gelöscht |
| `KFB Voxel Zone S1.dc.html` | **SUPERSEDED (Referenz)** | **Slice-1-Abnahme:** 30×30-Voxel-Zone mit KFB-Texturen, Instanz-Variation, 6 Story-Modi, brick-Mauer mit Tor, Wasser. 956 Instanzen / 5 Draw-Calls |
| `kfb-box-material.js` | **AKTIV / SHARED** | Variations-Schicht (Instanced-Attribute + `onBeforeCompile`), Rezept 1:1 aus `voxel-terrain.js`: Textur multiplikativ, Variation über Helligkeit/Sättigung, **keine UV-Rotation**; brick über Welt-UV (triplanar). Wird von S2 (Konstrukte) und S4 (Streuung) mitgenutzt — nicht als tot einstufen |
| `KFB Material Bench.dc.html` | **AKTIV** | Material-Bank: fünf Blöcke mit **echten** Texturen (Papier · Karton · Filz · Ton · Stein), **stochastisches Sampling** gegen Kachel-Wiederholung, gemeinsame weiße Fuge, Tusche darüber. Hier wird Material für Material abgenommen, bevor es in die Zone geht |
| `KFB Voxel Zone S2.dc.html` | **AKTIV** | Konsolidierungs-Demo: **links Bestands-Rezept (Travel v9), rechts prozedural, verschiebbare Naht** + Screen-Space-Tusche über allem, Schraffur, Boiling Lines, Wasser mit Schaumkante. Die Seite, an der über die Art-Direction für v10+ entschieden wird |
| `kfb-ink-outline.js` | **AKTIV / SHARED** | Tusche-Pass (Sobel über Tiefe + Normalen, EffectComposer). Asset-agnostisch — umrandet später auch Kenney-GLBs, Pets, Karten |
| `docs/ART_DIRECTION_konsolidiert.md` | **AKTIV (Doku)** | Was aus den beiden Art-Direction-Papieren übernommen ist, was wartet, was nicht kommt — plus Übernahme-Reihenfolge für Travel v10+ |
| `docs/TEXTUR_KONZEPT_voxel.md` | **AKTIV (Doku)** | Textur-Denkmodell für die Box-Sprache: drei Layer (Kante/Fleck/Korn), vier Regeln, wie der vorhandene `Textures/`-Satz als gedämpfter Fleck-Layer nutzbar wird, was nicht zu bauen ist |
| `docs/COWORKER_catalog-fixes.md` | **AKTIV (Doku)** | 8 belegte Katalog-/Pfad-Probleme mit Fix je Punkt + Kurzfassung zum Weiterschicken |
| `github.md` | **AKTIV (Doku)** | Repo-Assoziation + Last-Sync-Beleg |

**Nächster Schritt:** Slice 2 — Blueprint-Einträge in `constructs.json` + ein Signature-Konstrukt
(King Tower) in der echten Szene, navigierbar. Die Box-Sprache und das Material stehen dafür bereit.
Slice 0 + 1 sind abgenommen (Resolver im Cockpit · A/B-Variation in der Zone).

## Hex-Worldbench (Meilenstein 2026-07-14, abgeschlossen)

| Datei | Status | Notiz |
|---|---|---|
| `Hex-Worldbench.dc.html` | **FROZEN** | Der abgeschlossene Hex-Worldbench (echte Kenney-Hex-GLB, Biome, Look-Modi Kenney/Clay/Cel, Licht-Moods, Slot-System, Floor-FX, Tilt-Shift). Weiterbau nicht hier — Erkenntnisse wandern in den Voxel-Sprint |
| `zone-index.json` | **ASSET / Contract** | Zonen-/Biome-Datenvertrag (material clay\|cel, mood-tint, Register). Kandidat für die `biomes[]`-Anreicherung in `asset-repo.json` |
| `Zonen-Atlas.dc.html` | **SUPERSEDED (Referenz)** | 2D-Zonenatlas, 6 Biomes, Genre-Tags |
| `Hex-Buehne.dc.html` · `HexTile.dc.html` | **SUPERSEDED (Referenz)** | frühe 2D-Bühne / Tile-Baustein |
| `PROJECT_LOG.md` | **AKTIV (Doku)** | Hex-Historie + technische Learnings (pointy-top-Maße, textur-gestrippte Tiles, GLB-im-Tree-Falle). Nicht anfassen, nur ergänzen |
| `tex/` (23 Texturen) | **ASSET** | stilisierte Texturen, ursprünglich fürs Quadrat-Projekt. Kandidaten für Upload nach `media/3D_Assets/`, damit sie per RAW laufen |
| `refs/` · `uploads/` · `versions/` | **ASSET / Session-Input** | Referenzmaterial, nicht ausliefern |
| `support.js` | **SHARED / AKTIV** | DC-Runtime. Nicht anfassen |

## Blocker & Upload-Kandidaten (nur benannt, nichts ausgeführt)

| Sache | Befund (2026-07-25 geprüft) | Empfehlung |
|---|---|---|
| `CATALOG/catalog.json` | **weiter nicht im Repo** — `CATALOG/` wurde am 25.07. gepusht, enthält aber nur `INDEX.md`, `PACK_SUMMARY.md`, `github_status.json`, `asset-browser.html`, die zwei `.py` | kein Blocker mehr (INDEX.md trägt dieselben Felder). Nachpushen, wenn `n_meshes`/`skinned` gebraucht werden |
| 20 Packs „pending upload" | `github_status.json`: castle, coaster, factory, furniture, prototype, tower-defense, modular-* + Dice = nur lokal · holiday + 3 city-kits = **absent** · 5 Mini-Kits nur als Character-Teilmenge | nicht platzieren. Wenn ein Pack gebraucht wird: pushen, dann `github_status.json` + `asset-repo.json` nachziehen |
| `GLB format/` (Repo-Top-Level) | laut `github_status.json` unklar: Mittelalter-/Hex-Terrain, keinem Katalog-Pack zugeordnet | Identität vs. `GLB_hexagon_kit` klären, dann benennen und in den Index aufnehmen |
| `tex/` (23 lokale Texturen) | liegen nur in diesem Projekt | wenn sie im Voxel-Look gebraucht werden: nach `media/3D_Assets/` pushen, dann RAW referenzieren |
| Screenshots/Captures | dieses Projekt hat noch keine | Beleg-Bilder pro Slice kommen in `captures/`, nie in den Export einbetten |

**Aufräum-Kandidaten (2026-07-26, nur benannt — nichts ausgeführt):**

| Sache | Größe/Umfang | Empfehlung |
|---|---|---|
| `terrain/world-context.js` | 1 Datei | **BLEIBT** — S1, S2 und Material Bench importieren sie. `terrain/voxel-terrain.js` ist gelöscht (2026-07-26) |
| ~~`uploads/KFB CardBuilder + Ink Outlines v2/`~~ | — | gelöscht 2026-07-26; die gebrauchten Teile liegen als `cardbuilder/` und `terrain-v10/` im Projekt |
| ~~`uploads/*.png` (Feedback-Bilder)~~ | — | gelöscht 2026-07-26 (41 Bilder) |
| `tex/` (23 Texturen) | lokal | **nicht löschen** — weiter Upload-Kandidat nach `media/3D_Assets/` |
| `media/3D_Assets/CATALOG/INDEX.md` | 169 KB | Spiegel, Kanon ist das Repo — kann weg, wenn keine Anreicherung mehr läuft |

Löschen oder Verschieben nur nach Georgs Freigabe, jeder Schritt einzeln.

## Pfad-Hygiene (der stille Killer)

- Jeder Asset läuft über die kanonische RAW-URL `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/…`, nie über `./assets/…`.
- Cache-Buster `?v=x` anhängen, wenn ein frisch gepushter Pfad geprüft wird — ohne liefert der CDN bis zu 5 Minuten alte 404 (Quelle: `media/3D_Assets/ASSETS.md`).
- `edge3.psd` und `test` nie referenzieren.
- Aktueller Stand: **kein relativer Asset-Pfad** in den neuen Dateien. `kfb-textures.json` ist die einzige Adressquelle für Texturen.

## Clean-Run-Checkliste (Stand Slice 1)

1. `KFB 3D Asset Repo.dc.html` öffnen → bootet ohne Konsolenfehler in **Chrome und Firefox**.
2. Textur-Beleg-Streifen zeigt alle 12 KFB-Texturen als Bild → RAW-Pfade stimmen.
3. `kfb-textures.json` lädt und jedes Set löst zu einer RAW-URL auf.
4. `docs/SPRINT_3D-AssetRepo.md` nennt für jede Slice einen Status und ein Definition-of-Done.
5. `KFB Voxel Zone S1.dc.html` öffnen → Zone rendert, HUD zeigt Instanzen/Draw-Calls/fps ≠ 0.
   Regler `Variation` auf 0 → sichtbar gekachelt, zurück auf 1 → variiert. Story-Modus wechseln → Zone färbt um.
6. Ab Slice 2: Konstrukt ist umrundbar / hat freie An- und Abflugbahn (Beleg-Bild).

## Clean-Run-Checkliste Card Zone Lab (Stand v1)

1. `KFB Card Zone Lab v1.dc.html` öffnen → bootet ohne Konsolenfehler; Terrain, Zone, Graben, Würfel, Karte da.
2. Graben-Breite 2 → 7 durchziehen: keine Löcher zwischen Zone und Terrain, Wasser auf **allen vier** Seiten.
3. `Hub` auf 1 → Terrain bewegt sich, Plateau und Zonen-**Ecken** stehen still.
4. Auf dem Würfel ziehen → Würfel dreht, Kamera steht. Zug über dem Dock beenden → Kamera wieder frei.
5. Fläche anklicken → bleibt vorn, bis die Kamera bewegt wird.
6. `Nächste Karte` → Art-Fläche zeigt zum Spieler, PDF-Artwork erscheint nach wenigen Sekunden.
7. Vor jeder visuellen Beurteilung: `preserveDrawingBuffer` ist gesetzt — ohne das zeigen Captures alte Frames.

## Export-Procedere (Pflicht)

Jeder Session-Cut folgt `skills/session-export_v1.md`: **Manifest → Veto abwarten → Housekeeping
nachziehen → Cleanup nur benennen → Export nur der Manifest-Dateien.** Kein Voll-Projekt-Zip,
keine Datei über 2 MB, alles Schwere (GLB, Texturen, Skydomes, Captures) per RAW-URL.


## Meta-Konzept: Narrative Flow / Story-Fließrichtungen (2026-07-26)

**Idee (Georg, Card Zone Lab):** Das Wasser-Level plus die D6-Unterteilung (sechs Höhenstufen pro
Cube, `heightStep = CELL/6` in `terrain-v10/voxel-terrain.js`) reichen aus, um **unregelmäßige
Übergangsflächen** zu modellieren: flaches Wasser, auslaufende Ufer, Sandbänke. Damit wird der
Wassergraben einer Card Zone kein geschlossener Ring mehr, sondern kann sich öffnen und **als Fluss
weiterlaufen**.

**Warum das mehr ist als Deko:** Solche Flüsse verbinden Card Zones nicht nur visuell, sondern
semantisch — als **narrative flow** bzw. **Story-Fließrichtung**:

- verwandte Karten (Tags, Deck, Cluster) liegen am selben Strom
- gespielte / gelesene Zonen liegen stromabwärts, offene stromaufwärts
- Lern- und Datenströme der 3D Academy lassen sich als Verzweigungen lesen (Kapitel = Nebenarm)
- Fließrichtung = Leserichtung: der Strom sagt, wohin die Geschichte läuft, ohne UI

**Technische Voraussetzungen, die schon stehen:**
- Wasser liegt auf dem Zellraster (ein Quad pro Zelle, nur wo der Wannenboden unter dem Wasserstand
  liegt) — ein Fluss ist damit dieselbe Mechanik wie der Graben, nur mit anderer Zellmenge
- `setCarve()` stanzt Terrain rechteckig aus; für Flussläufe braucht es eine **Pfad-Variante**
  (Polyline mit Breite statt Rechteck)
- Ufer rasten exakt auf `groundHeightAt()`, also fügt sich ein Flusslauf ohne Stufe ins Terrain

**Offen:** Fließrichtung als Shader-Parameter (Strömung in dudv-Richtung), Verzweigungslogik,
Zuordnung Kartenrelation → Flussgraph.


## Abgleich Coworker-Umsetzung (2026-07-26)

Gegengecheckt: `skills/SSOT_KFB_CardBuilder_PDF.md`, `skills/kfb-card-builder.js`,
`skills/SSOT_Card_Ink_Outline_v2.md`, `skills/kfb-ink-canon.js` (Repo main).

**Module identisch.** `kfb-card-builder.js` und `kfb-ink-canon.js` in `skills/` sind
zeilengleich mit unseren Kopien in `cardbuilder/` (INK_CANON_VERSION 2, `cardGrid: null`,
`gridOf` Z. 159-162). Der Coworker hat die Module unverändert übernommen — kein Merge nötig.

**Neu vom Coworker:** `SSOT_KFB_CardBuilder_PDF.md` (Karten-Bau-Kanon) + `SOT_REGISTRY.md`.
Damit ist die offene Frage aus unserer Ink-SSOT §9 beantwortet: `cardGrid` gehört ins
`index.json`, Zahlen NUR dort, nie in JS. Gemessene Werte:

| Deck | cardGrid | Kopfband |
|---|---|---|
| forget_utopia | x .050 · y .037 · w .899 · h .947 | nein |
| ignore_dystopia | x .060 · y .117 · w .879 · h .833 | ja |
| embrace_protopia | x .048 · y .093 · w .903 · h .822 | ja (dünn) |

Fallback für un-gemessene Decks: `{ x:.05, y:.05, w:.90, h:.90 }` + `cardGrid_status: "geschätzt"`.

**Korrektur an uns:** unsere §9-Zahl „Zeilentrennung bei 0,466·H" ist falsch, gemessen ≈ **0,51·H**.

**Offen (blockiert):** `media/kfb/index.json` enthält **kein** `cardGrid` (geprüft am 2026-07-26,
nur `packId/coverOffset/pdf/data`). Die gemessenen Zahlen stehen also im Dokument, aber in keinem
Manifest — jeder Consumer schneidet weiter blind, und bei den zwei Kopfband-Decks fängt der
TL-Schnitt die Seitenüberschrift. Betrifft direkt die Karten im Card Zone Lab (embrace_protopia).
Nächster Schritt gehört dem Coworker: `cardGrid` pro Deck ins `index.json`.
Zwischenlösung wäre eine lokale `cardbuilder/cardgrid-overrides.json` (Zahlen bleiben in JSON,
nicht in JS; fällt weg, sobald das Manifest sie trägt) — nicht gebaut, wartet auf Entscheidung.


---

## Aufräumen 2026-07-26 (Session-Cut v2)

**Gelöscht:** `terrain/voxel-terrain.js` (v9-Spiegel, von nichts importiert · ersetzt durch
`terrain-v10/`) · `docs/PATCH_v10_terrain.md` (aufgegangen in `docs/SPEC_v10_terrain.md`) ·
`uploads/KFB CardBuilder + Ink Outlines v2/` (67 Dateien Session-Input; die gebrauchten Teile liegen
als `cardbuilder/` und `terrain-v10/` im Projekt) · 41 Feedback-Screenshots aus `uploads/`.

**Bewusst behalten:** `terrain/world-context.js` (S1, S2, Material Bench importieren sie) ·
`uploads/*.md` (Art-Direction- und Cartoon-Deformer-Briefings) · `uploads/KFB Cube Academy v1.html`
(Mechanik-Referenz) · `tex/` (Upload-Kandidat) · `export/card-zone-lab-v1/` (v1-Abnahme).

**Neu:** `docs/SPEC_v10_terrain.md` (kanonische v10-Spec) ·
`docs/HANDOVER_card-zone-lab_v2_2026-07-26.md` (für Design-Chat und Coworker, mit den vier Regeln,
an denen die meiste Zeit hing).

## Status der Dateien nach v2

| Datei | Status |
|---|---|
| `KFB Card Zone Lab v2.dc.html` | **AKTIV** — Zone, Graben, Zonen-Wasser, Fluss, Card Cube, Face-Focus, Blasen, Drone |
| `KFB Card Zone Lab v1.dc.html` | **SUPERSEDED (Referenz)** — Stand vor der Aufdeck-Animation |
| `terrain-v10/voxel-terrain.js` | **AKTIV / KANONISCH** |
| `kfb-box-material.js` · `kfb-ink-outline.js` | **AKTIV / SHARED** (Tusche im Lab abgeschaltet — Kante gehört aus dem Ink-Kanon abgeleitet) |
| `cardbuilder/*.js` | **AKTIV / SPIEGEL** — Kanon liegt im Repo unter `skills/` |


## Session-Cut v3 · 2026-07-26

**Neu:** `KFB Zonen-Registry.dc.html` (AKTIV — Weltkarte, 168 Zonen, Lernstand, Flows) ·
`zone-registry.json` (Vertrag + Zuordnungstabellen, `overrides.byZone` für Handkorrekturen) ·
`docs/SESSION_cut-v3_2026-07-26.md` · `export/card-zone-lab-v3/`.

**Geändert:** `terrain-v10/voxel-terrain.js` um `setCarvePath`, `carvedAt`, `pathDistAt` erweitert ·
`KFB Card Zone Lab v2.dc.html` um Fluss, Face-Focus, Blasen, Drone und den Registry-Übergabehaken.

**Vertrag zwischen Registry und Lab:** `localStorage['kfb-zone-open']` = `{ packId, n }`. Das Lab
liest ihn beim Laden und **verwirft** ihn danach — ein Reload soll nicht ewig auf derselben Zone hängen.

| Datei | Status |
|---|---|
| `KFB Zonen-Registry.dc.html` | **AKTIV** — Einstieg |
| `Zonen-Atlas.dc.html` | **REFERENZ** — Poster zum Biome-System, keine Laufzeit |
| `zone-index.json` | **KANON** — Biome, Register, Connectors, Props |
| `zone-registry.json` | **KANON** — Ableitungsvertrag der Card Zones |
