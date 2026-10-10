# KFB Environment Kit R1 · Natur aus fertigen Kits, instanziert und lebendig

Status: **SPEC · Entscheidung Georg 2026-10-08**
Prüfstand: KFB Island Worldbuilder Lab (`http://127.0.0.1:5192`), Code unter `src/environment/`.
Ersetzt Teil A (Vegetation und Steine) aus `BRIEF_CLAUDE_DESIGN_NATURE_WATER_LANDMARK_KIT_R1.md`. Claude Design behält B (Pyramide), C (Wasser), D (Unterseite).
Regeln für Zonen, Gruppen und Erdung: `SPEC_PLACEMENT_GRAMMAR_R1.md`. Diese Spec regelt **Assets, Technik, Bewegung, Prüfung**.

## Warum

- Die selbstgebauten Kugelbäume sehen nicht gut aus.
- Sie machen 60 % aller Dreiecke aus: 289 k von 483 k pro Pass, 50 Draw Calls (Inspector Proof 01, `docs/PROJECT_STATE.md`).
- Fertige Kits sind schöner, sauber modelliert und CC0.

## 1 · Quellen

| Kit | Lizenz | Inhalt | Rolle |
| --- | --- | --- | --- |
| KayKit Forest Nature Pack 1.0 | CC0 | 84 Modelle: Bäume, Büsche, Steine, Gras einseitig | Haupt-Kit Wald, Wiese, Herbst |
| Kenney Nature Kit | CC0 | 329 Modelle: Bäume, Felsen, Klippen, Ufer, Pflanzen, Stege | Ergänzung: Ufer, Klippen, Pflanzen |
| Tiny Treats Pretty Park 1.0 (Isa Lousberg) | CC0 | Bäume, Büsche, Blumen, Gras, Vogel | Akzente, Blumen, Grasbüschel |
| KayKit Medieval Snow Biome | CC0 | Schnee-Bäume, Steine | Schnee-Biom (liegt schon im Lab) |
| **Quaternius Ultimate Nature Pack** | CC0 | 150 Modelle (FBX/OBJ): Laub-, Nadel-, Birken-, Weidenbäume, Palmen, Kakteen, Büsche, Steine, Stümpfe, Gras, Blumen, Getreide; fast alles in Varianten Sommer, Herbst, Schnee, tot | **Haupt-Kit Wald, Herbst, Schnee, Wüste** (Georg 2026-10-08: große Bandbreite, Tannen passen) |
| Quaternius Stylized Nature MegaKit | Standard (gekauft) | Palmen, Kakteen, Pflanzen | Strand, Wüste; nur im Lab, nicht roh in öffentliche Repos |

Fundort: `Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/`.
- Quaternius Ultimate Nature ist entpackt unter `~/KFB-AssetCache/quaternius/UltimateNature/` (FBX, OBJ, License; ohne .blend).
- Dieselbe ZIP liegt auf GitHub: `main` · `media/3D_Assets/Ultimate Nature Pack by Quaternius(1).zip`, 22,9 MB, identisch.
- 14 Proben liegen unter `public/assets/env/quaternius/`, 6 KayKit-Forest-Proben unter `public/assets/env/kaykit-forest/`.

**Gemessen (Aufreihung `lineup.html?tt=1.6&q=0.044`, Zeile „Natur“):**
- **Quaternius-FBX sind in Zentimetern:** CommonTree 248, Pine 270, Palm 447. Der Kit-Faktor 0,044 bringt die Bäume auf 3–4,3 H, ähnlich den KayKit-Bäumen (1,8–3 H).
- **Gras und Büsche** sind bei Quaternius relativ zu den Bäumen groß (Gras 1,2 H, Beerenbusch 1,5 H). Deshalb gilt für Natur keine Kit-Faktor-Regel, sondern **Zielhöhen pro Rolle in H** (§2).
- **Farben:** Quaternius-FBX speichern Blenders lineare Diffusfarbe, und FBXLoader dunkelt sie ein zweites Mal ab. Einmal `convertLinearToSRGB()` stellt sie her. Im Spiel färbt ohnehin die Palette um (§3).
- **Stil:** Quaternius ist facettiert-low-poly mit naturnahen Silhouetten, KayKit und Tiny Treats sind weich, satt und klobig. Ob Palette + Clay K2 + Soften beide zusammenbringen, zeigt E1.
  - Wenn nicht: Quaternius für Wald-, Herbst-, Schnee- und Wüsten-Inseln, KayKit und Tiny Treats für Stadt-, Park- und Strand-Inseln.
  - **Nie zwei Kits in derselben Rule-of-Three-Gruppe.**

Übernahme: Nur die tatsächlich genutzten Dateien kommen nach `public/assets/env/<kit>/`, mit Lizenzdatei. Das ist dieselbe Regel wie beim Unity-Intake.

## 2 · Maßstab (Kontrakt K1)

Kontrakt **K2** (`docs/SCALE_CONTRACT_K2.md`): keine Meter. H = Medium-Figur = 3,64 Lab-Einheiten.
Für Natur gilt statt eines Kit-Faktors eine **Zielhöhe pro Rolle in H**. Jede Art wird einmal auf die Mitte ihres Bands normiert:

| Rolle | Zielhöhe |
| --- | --- |
| Grasbüschel | 0,1–0,25 H |
| Blume | 0,15–0,35 H |
| Busch | 0,4–0,8 H |
| kleiner Baum, Kaktus | 1,5–2,5 H |
| großer Baum, Palme (Anker) | 2,5–4 H |
| Stein, Akzent | 0,15–0,7 H |
| Stein, Fels am Rand | 0,7–2 H |

Varianz kommt danach nur aus der Platzierung (Rule-of-Three-Skalen 0,7–1,4).

## 3 · Look

- **Palette:** Die Kit-Farben werden auf die Insel-Palette umgefärbt. Erst wird der Farbatlas des Kits auf Paletten-Slots abgebildet (Laub, Stamm, Stein, Blüte). Dann färbt der Shader nach Slot um. Die Kit-Texturen bleiben unverändert.
- **Clay:** Clay K2, Klasse `nature` (`clay-material v10`); kleine Teile ohne eigenes Soften.

## 4 · Instanzierung

- Pro Art und Variante ein `InstancedMesh` je Insel, alternativ `BatchedMesh` für alle Arten einer Insel.
- Pro Instanz: Transform, Gruppen-ID, Phase, Biegesteifigkeit, Paletten-Slot.
- **Schatten:** Nur Anker und große Steine werfen Schatten. Gras, Blumen und kleine Büsche empfangen nur.
- **Budget** für 4 Inseln, Natur inklusive Gras, gemessen mit `__kfb.profile()`:
  - höchstens 120 k Dreiecke und 16 Draw Calls pro Pass (heute 289 k und 50);
  - Gras über Distanz-LOD ausdünnen.

## 5 · Cartoon-Deformer

Vertex-Shader in der Clay-Kette (onBeforeCompile), gewichtet nach normalisierter Höhe im Modell: Der Fuß bleibt fest, damit die Erdung erhalten bleibt.

- **Biegen:** Krone neigt sich in Windrichtung, quadratisch über die Höhe.
- **Squash und Stretch:** Volumen bleibt erhalten (y × s, xz / √s).
- **Wobble:** Kronen schwingen nach, gedämpft und federnd, cartoonig statt realistisch.
- Pro Instanz-Attribut steuerbar; jede Art bekommt Standardwerte (Palme biegt weich, Busch kaum, Gras stark).

## 6 · Wind-Gruppen

- Jede Instanz gehört zu einer **Gruppe**. Eine Rule-of-Three-Gruppe bewegt sich gemeinsam: gleiche Grundphase, kleiner Versatz je Mitglied.
- **Windfeld:** globale Richtung und Stärke, dazu Böen als Wellen, die über die Insel laufen. Die Gruppenphase folgt der Position im Feld.
- Gruppenwerte liegen in einem kleinen Uniform-Array oder einer Daten-Textur (bis 64 Gruppen je Insel). So lässt sich eine Gruppe einzeln anstoßen, etwa wenn eine Figur vorbeigeht oder ein Auto vorbeifährt.
- **Offen:** Georg hat auf ein Konzept aus einem Web-Chat verwiesen. Es wird eingearbeitet, sobald es vorliegt.

## 7 · Musik-Visualizer

- Dieselben Gruppen-Uniforms werden aus Audio gespeist, über WebAudio `AnalyserNode` mit 3–5 Bändern:
  - **Bass** lässt die Anker hüpfen (Squash);
  - **Mitten** wiegen die Stützen;
  - **Höhen** lassen Akzente und Blumen zucken und das Gras schimmern.
- Modi: Wind, Musik, beides gemischt. Testmusik: `Cartoonish Music Pack` aus dem Asset-Ordner.
- Schnittstelle offen für Beat-Events aus anderen KFB-Systemen.

## 8 · Gras

- Gras steht in **Büscheln**, nie als einzelne Halme verstreut. Quellen: Tiny Treats `grass_A`, KayKit `Grass_1/2 Singlesided`.
- Büschel bilden Felder nach Rauschen und Zonen (Grammatik §1): dicht in Senken und am Ufer, frei auf Wegen, Vorplatz und Freifläche, hier höchstens kurz.
- **Etherington-Überlappung:** 3–8 kleine Büschel am Fuß jedes Objekts (Grammatik §4.3).
- Ein Draw Call pro Insel und Grasart; Wind wie §6 mit starker Biegung.

## 9 · Rule of Three

Cluster-Rezepte mit Anker, Stützen und Akzent nach Grammatik §3. Zusätzlich je Biom eine Tabelle, welche Kit-Arten welche Rolle füllen dürfen, etwa:

- **Wüste:** Palme als Anker, Dattelbusch als Stütze, Kaktus oder Stein als Akzent.
- **Wald:** großer Laubbaum als Anker, kleiner Baum oder Busch als Stütze, Pilz oder Stein als Akzent.

## 10 · Etherington: Best Practices und Q&A

- **Referenzblatt** `docs/ETHERINGTON_GROUNDING_R1.md` mit den drei Techniken Eingraben, Kontakt und Überlappen. Je Technik ein Gut-Schlecht-Paar als Screenshot aus dem Lab. Quelle im KFB-Style-Reference-Pool verifizieren.
- **Automatische Prüfungen** (`__kfb.measure(id)` erweitern):
  - kein Fuß über dem Boden;
  - Einsinktiefe 5–15 % der Objekthöhe;
  - Überlappungen pro Objekt ≥ 3;
  - nichts im Wegbett oder im Wasser;
  - Anteil Freifläche ≥ 30 %;
  - Landmarke ist das höchste Element.
- **Georg-Blick:** feste Kamera-Presets je Insel (oben, Augenhöhe Figur, Nahaufnahme Fuß); PASS oder FAIL.

## 11 · Schnittstelle

```ts
buildEnvironment({ field, palette, biome, seed, recipe }) → {
  object: THREE.Object3D,            // Instanzen je Art
  groups: EnvGroup[],                // id, role, center, members
  update(t: number, drive: { wind?: { dir, strength, gust }, audio?: { bands: number[] } }): void,
}
```

Das Rezept ist Seed + Regeln + Georgs Overrides, wie Grammatik §7. Der Editor kann Gruppen verschieben, löschen und neu würfeln.

## 12 · Gates

| Gate | Inhalt | Nachweis |
| --- | --- | --- |
| E1 | Intake, Maßstab K1, Umfärben, Clay | Screenshot je Biom, Größenliste aus `__kfb.sizes()` |
| E2 | Instanzierung, Schattenregel, Budget | `__kfb.profile()` vorher/nachher |
| E3 | Deformer + Wind-Gruppen | kurzes Video, eine Gruppe einzeln angestoßen |
| E4 | Grasbüschel + Überlappung am Fuß | Nahaufnahme Fuß je Objektart |
| E5 | Musik-Visualizer | Video mit Testmusik |
| E6 | Etherington-Referenzblatt + automatische Prüfungen | Prüfbericht je Insel, Georg PASS/FAIL |

## Nicht machen

- Keine Grundkörper-Bäume mehr, keine einzelnen Halme, keine eigenen Skalenfaktoren pro Modell.
- Keine Kit-Rohdateien in öffentliche Repos, wenn die Lizenz nicht CC0 ist.
- Bewohner, Wege und Gebäude nicht anfassen: Die gibt es schon.

## 13 · Fluff-Ernte (Georg, 2026-10-08) · Idee, noch nicht im Bau

- **Wachsen:** Bunte Fluff-Kugeln in der Biom-Farbe (Farb-Grammatik, Rolle Blüte bzw. Akzent) wachsen an Bäumen und Sträuchern. Farmen ernten sie.
- **Fallen:** Reife Kugeln fallen als Fallobst, springen, rollen bergab und bleiben in Mulden liegen. Das ist Georgs „unebener Boden“, und hier hat er eine Aufgabe.
- **Aufsammeln:** durch Drüberlaufen, für Spieler und NPCs.
- **Bezug zur Zellen-Grammatik** (`planning/kfb-cell-metric-voxel-world-grammar-2026-10-07`): Fluff ist dort Rohmasse für Bau und Reparatur (`HARVEST/GATHER → AGGREGATE → ROUGH_MASS → SCULPT → RESOLVE`). Die Ernte ist also der Anfang der Bau-Kette: Natur → Fluff → Bau.
- **Zuständig:**
  - Environment: wo Fluff wächst, je Art und Biom, Wachstumsstellen am Modell.
  - Lab: Mulden im Gelände, Roll-Physik (einfach: bergab bis zur nächsten Mulde).
  - Blender-Coworker: NPC-Activities (ernten, tragen, sammeln).
- **Weltlogik (§00):** Wer hat den Baum gepflanzt, wer erntet, wohin bringt er die Kugeln? Jede Fluff-Stelle braucht diese Antwort.
