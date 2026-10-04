# HOUSEKEEPING — KFB Travel v16 (main) + Satelliten (living document)

Zweck: EINE Quelle für Aufräum-Entscheidungen und Clean-Runs in **diesem** Workspace. Nichts wird
ohne Freigabe gelöscht. Die Status-Spalte ist die Wahrheit, nicht das Datum.

Legende: **AKTIV** (weiterbauen) · **FROZEN** (Referenz, nicht anfassen) · **SUPERSEDED** (ersetzt,
archivierbar) · **EXPERIMENT** (Wert offen) · **DEAD** (löschbar nach Sign-off) · **ASSET** (Binär).

**Die Rollenverteilung seit 2026-08-12:** `KFB Travel v16.dc.html` ist **main** der Travel-Linie
(§4x, Landschaft); v15 (§4w, Flug-Sprint) und v14 sind Vergleichsmaßstab und FROZEN.
Die drei cut-v4-Werkzeuge sind **Autoren-Werkzeuge**, kein zweites Spiel. Zwischen beiden steht
**ein Vertrag: `zone-registry.json` + `zone-index.json` an der Wurzel.** Wer die schreibt, ändert
die Welt; wer sie liest, zeigt sie. Diese Naht nicht verwischen.

---

## 0. Travel v14 — FROZEN seit 2026-08-12 (Fork-Basis für v15, siehe §4w)

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel v14.dc.html` + `terrain-v14/` (56 Module + `edge3.jpg` + 4 JSON) | Fork-Basis für v15, Vergleichsmaßstab | **FROZEN seit 2026-08-12** — nicht weiterbauen, nicht löschen |
| `docs/travel-v14/SPRINT_travel-v14.md` | Fahrplan: **W1–W3** (Werkzeuge) + Stufe 0 + Block A–D | **AKTIV, maßgeblich** |
| `docs/travel-v14/CHANGELOG_v14.md` | additiv nach oben, jede Änderung mit Zahl | **AKTIV** |
| `KFB Travel v13.dc.html` + `terrain-v13/` | Fork-Basis, Vergleichsmaßstab | **FROZEN** — nicht weiterbauen, nicht löschen |

v14 darf sich nur da anders verhalten als v13, wo eine Abnahmezahl es verlangt.
**Erledigt:** W1 (Registry-Batch-Zeichnung, siehe §1). **Als nächstes:** **E0** — `asset-index.js`
beim Coworker anfordern; sie blockiert den ganzen neuen **Block E** (Card Zone in die Reise holen).
Parallel A0 + E1–E3 (Georg entscheidet Deck-Zahl, Kartenauswahl, Zonen-Zahl).

**⚠ Drei Dinge heißen „Zone"** — Registry-Hexkarte (Landkarte zum Autorieren), Hex-Ring
(Platzierungsraster; `hexSize` = Abstand zwischen Zonenmitten in Welt-Einheiten) und Card Zone
(der **rechteckige** Ort mit Boden, Beam und Props). Sie widersprechen sich nicht: das Sechseck ist
das Raster, auf dem die rechteckigen Zonen stehen. Tabelle in `docs/travel-v14/SPRINT_travel-v14.md`
— bei Verwirrung dort nachsehen, nicht raten.

---

## 0b. Travel v13 — Import-Herkunft (Stand S93f, FROZEN)

Quelle: Coworker-Ordner `travel-v13_S93f_2026-07-29` (Workspace 1). Captures und die FROZEN-
Herkunftsdoku (v12-Fassungen) blieben drüben.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel v13.dc.html` | die Reise, Stand S93f | **FROZEN** (Fork-Basis für v14) |
| `terrain-v13/` (56 Module + `edge3.jpg` + 4 JSON) | Runner + Slices | FROZEN |
| `cardbuilder/` (`kfb-card-format.js`, `-builder.js`, `-ink-canon.js`) | geteilt; `card-format` liefert `CARD_AR` an `academy-deck` / `card-registry` / `sky-cards` | AKTIV, geteilt — **nicht löschen** |
| `themes/kfb-med.css` · `themes/kayfabe.json` | Wortmarke + Palette; das DC lädt die CSS direkt | AKTIV, geteilt |
| `docs/travel-v13/` (11 Dokumente) | Cut S93f, Sprint v14, SSOT Deck/Ausschnitt, Changelog, Coworker-Handover + Change-Orders, README, KFB_CONTEXT | AKTIV |
| `docs/travel-v13/*_source_*.md` (3) | Quell-Fassungen HOUSEKEEPING / CLAUDE / github aus Workspace 1 | **FROZEN** (Referenz) |
| `docs/travel-v13/SPRINT_travel-v14.md` | Ursprungsfassung des Fahrplans | FROZEN — die gepflegte liegt in `docs/travel-v14/` |
| `terrain-v13/kfb-pets.js` | lokaler Spiegel des Pet-Stacks | **Fallback, nie Quelle** — Runner zieht `PETS_CANON` über jsdelivr |

**Abnahme 2026-08-02 (nach dem cut-v4-Import):** `runStep('fade')` und `runStep('vehicle')` → `true`,
`__bootErrors` leer, `ring.ok` → **true**. `ring.report()`: 18 Slots / 18 belegt, 6 Biome verteilt
(Filz-Sumpf 4, Zeitungsstadt 1, Ton-Ebenen 2, Stein-Katakomben 3, Holzsteg-Werft 5, Wellpappe-
Wildnis 3), Ebenen mid 6 / up 7 / down 5. **Die Zonen-Lücke aus dem ersten Import ist geschlossen.**

**Clean-Run v13 (hier)**
1. DC öffnen, ~8 s: Voxel-Welt, drei Würfel, Pet auf der Flug-Karte, Kartenblätter nach 3–8 s.
   Im versteckten Tab kommt nichts — Absicht.
2. `__travelPOC.mgr.runStep('fade', 1/60)` und `runStep('vehicle', 1/60)` → `true`,
   `window.__loopErr` → `null`. (`__bootErrors` sieht diese Fehlerklasse NICHT.)
   **Der Handle heißt `window.__travelPOC`, nicht `T`** — die alte Checkliste sagt `T.mgr`.
3. Doppelklick auf eine Karte: Pad fliegt hin, **bleibt sichtbar stehen**, dann POV-Fahrt.
4. 60 s angedockt ohne Eingabe: Tempo ~0, kein selbsttätiger Abflug. Esc: Abflug ~3,9 s, monoton.
5. Panel → *Zonen-Ring*: Bodenluft > 0, Biome-Verteilung nicht einseitig.
   (`report().luft` ist `null`, solange kein `settle` gelaufen ist — kein Fehler.)

---

## 1. Zonen- und Worldbuilder (Import cut-v4, 2026-08-02)

Quelle: `KFB Voxel + Assets Worldbuilding + Cartoon Deformer + Zone Registry v3/kfb-cut-v4`
(Coworker-Export 2026-07-26). Alle drei DCs sind flach gewurzelt (`./`) und liefen hier ohne
Pfad-Änderung — bis auf `terrain-v10/`, das nachgereicht werden musste.

| Artefakt | Rolle | Status |
|---|---|---|
| `zone-registry.json` · `zone-index.json` (Wurzel) | **der Vertrag.** Ableitungs-Wahrheit · Biome-Kanon. Gelesen von `terrain-v13/zone-ring.js` (`../zone-*.json`) UND von der Registry (`./zone-*.json`) | **AKTIV, Contract — fremd, nur lesen** |
| `KFB Zonen-Registry.dc.html` | Weltkarte: Zonen auf dem Hex-Grid, Lernstand, Flows. Der Einstieg | AKTIV (Autoren-Werkzeug) |
| `KFB Card Zone Lab v2.dc.html` | **der Ort selbst** — rechteckiger Zonenboden mit Stufen, Graben + Wasser, Karte klappt auf, **Beam** (Holo-Schleier), Projektor-Sockel, Props | AKTIV (Autoren-Werkzeug) — **bootet wieder seit 2026-08-05**: `asset-index.js` + `constructs.json` aus dem Re-Home-Export cut-v5 nachgereicht (E0 erledigt) |
| `KFB Cartoon-Verbieger.dc.html` | Prop-Verbieger am Regler (Bogen, Neigung, Verjüngung, Verdrehung, Squash); Export = Parametersatz für den Scatter | AKTIV (Autoren-Werkzeug) — bootet, lädt Props live |
| `kfb-cartoon-deform.js` | Verbieger-Modul (objekt-normiert, Per-Instanz-Seed, Normalen nachgezogen) | AKTIV — **noch nicht eingehängt** (Slice **E3z**, war W2/S88p) |
| `kfb-box-material.js` · `kfb-ink-outline.js` | Voxel-Material · Tusche-Pass (im Lab aus) | AKTIV, geteilt — Import `./asset-index.js` läuft wieder (E0-Fix) |
| `asset-index.js` · `constructs.json` | Runtime-API über `asset-repo.json` (`loadIndex`, `getSet`, `getTexture`…) · Blueprint-Format | **AKTIV — nachgereicht 2026-08-05** aus `kfb-rehome-2026-08-02` (WS-Ordner, cut-v5). E0 erledigt; Block E / O3b entsperrt |
| `asset-repo.json` · `kfb-texture-catalog.json` | Prop-/Textur-Kataloge für Lab + Verbieger | AKTIV (Daten) |
| `terrain-v10/` (`voxel-terrain.js`, `world-context.js`, `edge3.jpg`) | **kanonisch** laut cut-v4-README; die Registry importiert `./terrain-v10/world-context.js` | AKTIV — **Achtung: `terrain-v14/` hat eigene Forks beider Dateien. Zwei Wahrheiten (Slice W3).** |
| `docs/zone-registry/` (8 Dokumente) | README cut-v4, drei Handover, zwei Session-Cuts, SPEC v10 Terrain | AKTIV (Doku) |
| `docs/zone-registry/HOUSEKEEPING_source_cut-v4.md` | Quell-Fassung | FROZEN |

**Nicht importiert:** `kfb-cut-v4/cardbuilder/` und `kfb-cut-v4/support.js` — beide sind hier schon
da (v13-Fassung bzw. Projekt-Wurzel). Der Builder weicht laut v13-Doku bewusst ab (750×418 gegen
573×391); **nicht stillschweigend angleichen**, das ist eine offene Entscheidung.

**Befund beim Boot (2026-08-02) — behoben mit W1.** Die Registry-README spricht von **168 Card
Zones** — geladen werden **6321**. Vorher: 6325 SVG-Knoten, Hauptthread ~30 s blockiert. Nach der
Batch-Zeichnung (gleiche Füllung + Deckkraft = ein `<path>`, Klick über eine Sammelfläche mit
Hit-Test): **32 Knoten**, Filterklick über alle 6321 Zonen **69 ms**, keine Zone verloren.
Rückweg `drawBatch: false`. Details und Zahlen in `docs/travel-v14/CHANGELOG_v14.md`.
**Gehört beim nächsten Abgleich an den Coworker gemeldet** — es ist sein Werkzeug.

---

## 2. PetFlight

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB PetFlight v2.dc.html` + `petflight.v2.js` | Flug-Bühne | **AKTIV** |
| `export/petflight-v2/` | fork-fertiges Standalone-Paket (Handover, Housekeeping, README, Assets) | AKTIV (Auslieferung) |
| `KFB PetFlight v1.dc.html` | Vorgänger | SUPERSEDED von v2 |
| `Pet Embed v2 POC.dc.html` | Embed-Probe | EXPERIMENT |
| toter „Disco"-Button im Ansicht-Panel (v2) | bewusst stehen gelassen, damit der Export byte-gleich bleibt | bekannt, DEAD-Code |

## 3. Rollercoaster

| Artefakt | Rolle | Status |
|---|---|---|
| `Rollercoaster Ride v11.dc.html` | aktueller Stand, three **0.178 / WebGPU + TSL** | **AKTIV** |
| `Rollercoaster Ride v10.dc.html` · `v9` | Vorgänger | SUPERSEDED / FROZEN (Referenz) |
| `Fractal Skydome POC.dc.html` | Skydome-Studie, Tauschkandidat | EXPERIMENT |
| `Dancefloor POC.dc.html` | Studie | EXPERIMENT |
| `Canvas.dc.html` | undokumentiert, Wert prüfen | EXPERIMENT |

**Befund 2026-08-02 — Richtung korrigiert:** In `Rollercoaster Ride v11.dc.html` steht **kein**
Erzähler, **kein** LLM-Aufruf, **kein** Audio (0 Treffer auf `narrator`, `claude.complete`,
`speechSynthesis`, `AudioContext`, `jukebox`, `sfx`). Travel v13 bringt das alles schon mit:
`narrator.js`, `narrator-llm.js`, `narrator-prompts.js` (12 Blätter live aus dem Repo),
`frizzlebob-voice.js`, `travel-audio.js`, `sfx.json`, `jukebox.json`.
**Vom Rollercoaster zu holen ist also nicht der Erzähler, sondern das Rendering** — WebGPU/TSL,
Partikel, Schienen-Kinematik. Das ist ein Renderer-Wechsel, kein Modul-Kopieren.

**Offene Integrations-Entscheidung:** drei three-Stände — Travel v13 **0.160/WebGL**,
PetFlight v2 **0.160/WebGL**, Rollercoaster v11 **0.178/WebGPU**. Vor jedem Merge klären, welcher
Stand gewinnt. WebGPU↔WebGL ist kein Versionssprung.

## 4. Grand Theft Tax (neu 2026-08-04 · **FROZEN 2026-08-05, Pivot zu Overworld v1**)

Treadmill-Konzept eingefroren — wiederkehrende Defekte waren Symptome eines zweiten
Welt-Bewegungssystems neben dem fertigen v14-Stack. Begründung + Transplantations-Tabelle:
`docs/gtt/FREEZE_gtt-v2_2026-08-05.md`. Nachfolger: §4b.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Grand-Theft-Tax v2.dc.html` + `gtt-v2/` (4 Module + `vendor/`) | das Spiel: Strip-Architektur, KayKit-Knight, Juice, Booklet-B-UI, EN | **FROZEN** — Content-Spender für Overworld v1, nicht weiterbauen |
| `gtt-v2/vendor/` (zipkit, motion-matrix, death-variants, frankenstein-eyes/-rigs) | **Vertrag zum Asset Lab (WS1)** — dort autorisiert, hier nur lesen/spiegeln | AKTIV, fremd |
| `KFB Grand-Theft-Tax v1.dc.html` + `gtt-v1/` | erster Kern-Loop, Vergleichsmaßstab | **FROZEN** (Playtest-Basis für Living Doc §8) |
| `LESSONS_GrandTheftTax.md` | Abweichungs-Doku (Briefing-Auftrag) | AKTIV |
| `docs/gtt/HANDOVER_assets_2026-08-04.md` | Asset-Abgleich für den Coworker: 9 neue Packs ungezippt, Katalog-/Manifest-Lücken | **AKTIV — an Coworker** (gilt auch für Overworld: Brücken/Planken) |
| `docs/gtt/FREEZE_gtt-v2_2026-08-05.md` | Freeze-Begründung + was transplantiert wird | AKTIV |
| `uploads/BRIEFING_KFB_GrandTheftTax_v1.md` · `uploads/Handover_GrandTheftTax_Living_v1.7.html` | Auftrag + Living Doc | FROZEN (Referenz) |

Wiederverwendet, nicht kopiert: `terrain-v13/voxel-terrain.js`, `skydome-shader.js`, `world-palettes.js`, `travel-audio.js` (Imports über `../terrain-v13/`). GLBs live per RAW.

## 4b. Overworld v1 (Kickoff 2026-08-05)

Fork von Travel v14: freie Bewegung (walk + flight), Aggro-Gegner, KISS-Kampf (Eldermyr-Vorbild,
Mini-Healthbars), Card Zones als Wellen-Arenen mit Karten-Freischaltung. Meta-Thema
deck-agnostisch über Deck-Config.

| Artefakt | Rolle | Status |
|---|---|---|
| `docs/overworld-v1/SPRINT_overworld-v1.md` | Fahrplan O1–O7, Prinzipien, offene Entscheidungen | **AKTIV, maßgeblich** |
| `docs/overworld-v1/CHANGELOG_overworld-v1.md` | additiv nach oben, jede Änderung mit Zahl | **AKTIV** |
| `KFB Overworld v1.dc.html` + `overworld-v1/` (56 Module + ow-avatar/-combat/-arena/-zone-geo + `vendor/`) | das Spiel, Arbeitsstand | **AKTIV — O1–O3b abgenommen 2026-08-05** |
| `overworld-v1/ow-avatar.js` | Boden-Avatar: KayKit Knight + Schwert, Clips/Aktionen über den Motion-Matrix-Vertrag; geteilte Loader | AKTIV |
| `overworld-v1/ow-combat.js` | Combat Core: Skeleton-Pool, Aggro/Leash, J/Klick-Angriff, Healthbars, Coins, HUD + Wellen-API | AKTIV |
| `overworld-v1/ow-arena.js` | Zonen-Arenen: Trigger am Ring, Wellen-Regie aus waves.json, Kontext-Beats, Karten-Freischaltung | AKTIV |
| `overworld-v1/ow-places.js` | **die Ortsschicht** — Ort = reine Funktion der Hex-Kachel (deterministisch, kein Speicher); Biome-Landschaften aus `hexHomes` | AKTIV — einzige Wahrheit über Orte |
| `overworld-v1/ow-zone-geo.js` | die Zone als Ort: Boden/Graben+Fluid/Planken/Böschung/Beam, Terrain-Carve (v10-Muster im Fork) | AKTIV — führt Zonen nach Kachel |
| `overworld-v1/ow-pointer.js` | Rechtsklick = Absicht (hingehen / hinfliegen / angreifen); linke Taste gehört der Kamera | AKTIV |
| `overworld-v1/vendor/` (7 Verträge v3 + waves/vfx/lighting/pickups.js + motion-matrix, zipkit, death-variants, frankenstein-*) | Asset-Lab-Verträge, Spiegel des Check-ins `assetlab-v3_2026-08-05` | AKTIV, fremd (Asset Lab WS1) — **nur lesen** |
| `docs/overworld-v1/FEEDBACK_assetlab-v4_2026-08-05.md` | Rückmeldung an WS1: Befunde + Wünsche (motion-trails, Gear-Zonen für rig-lose Körper) | AKTIV — an Coworker |
| `docs/overworld-v1/SPRINT_fighting-pets.md` | Einschätzung + Fahrplan FP1–FP4: Pets als Kampf-Avatare („die Waffe ist der Akteur“) | AKTIV — 3 Entscheidungen offen (Georg) |

`KFB Travel v14.dc.html` bleibt **main der Reise** und wird vom Fork nicht angefasst.

**Stand:** O1–O3f-a stehen. Steuerung nach **WoW-Logik**: links ziehen = Kamera, rechts ziehen =
drehen, rechts klicken = Absicht (hingehen / hinfliegen / angreifen), WASD wie gehabt.
Terrain rastet auf 6 Stufen und ist **vollständig kletterbar** (Hindernisse müssen gesetzt
werden). **Die Ortsschicht (`ow-places.js`) ist die einzige Wahrheit über Orte** — Orte werden
aus der Kachel gerechnet, nicht vergeben; damit ist das Zonen-Flackern strukturell erledigt
(`docs/overworld-v1/BEFUND_ortsschicht_2026-08-05.md`).
**Als Nächstes: O3f-b** — Lab-Geometrie & Seed-Optionen, Sky-Card- und Beam-Shader (ohne Card
Cube / 3D-Stapel), danach Flusslauf. Parallel FP3 bei WS1. Zahlen im Changelog.

## 4c. Overworld v4_B — Re-Home + HUD v6 → **HUD v7** (2026-08-06 / 07)

Re-Home des Coworker-Exports `KFB Overworld v4/overworld-v4.1_2026-08-06` (WS-Ordner
„KFB VoxelWorld"). Verzeichnis **umbenannt** auf `overworld-v4b/`, damit §4b (`overworld-v1/`)
nicht kollidiert. `overworld-game.js` ist **nicht angefasst** — der Abnahmestand des Exports gilt.
Dazu die HUD/UI-Arbeit aus `uploads/BRIEFING_KFB_HUD_ReHome_WS1_v1.md`.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v4_B.dc.html` + `overworld-v4b/` (12 Module + `paper-atlas.js` · `hud-v6.js` · `hud-slots.json`) | das 2D-Overworld-Spiel, Arbeitsstand hier | **AKTIV** |
| `overworld-v4b/hud-v7.js` | **das HUD** (v7.0 „Tisch & Hand") — Papier + schwarze Blockkante; Blatt / Kompass+Quest / Bühne oben, Logbuch / Karten-Hand / Almanach-Fächer unten. Kein Chat. Drei Fenster, Ambient, UI-Klang mit `cap_polyphony`, Skillpunkt-Siegel | **AKTIV** |
| `overworld-v4b/hud-v6.js` | Vorgänger (v6.2) — Würfel-Slots, Chatbar, helle Kante auf Dunkel | **SUPERSEDED** — Rückfall per Helmet-Zeile |
| `overworld-v4b/paper-atlas.js` | Teileliste Tiny-Swords-UI + 9-Slice-Setzer (Update-010: lückenloses 3×3 aus 64ern — **nicht** das Free-Pack-Raster). v7 nutzt davon **nur noch `icon('gear')`** | AKTIV, geteilt (v6 + v7) |
| `overworld-v4b/hud-slots.json` | Slot-Config, der WoW-Swap. Ein Eintrag = eine Handkarte; v7 ignoriert `skin`/`colors` aus der Datei | **AKTIV, Daten** |
| `media/3D_Assets/Audio/ui-sfx.json` (Repo, live) | **der UI-Klang** — eine Familie, 16 Ereignisse; wird in `game.audio.manifest` gemergt. Die Lulls (Hover, Tippen, Bewegung) sind Absicht | AKTIV, fremd — nur lesen |
| `overworld-v4b/hud-skin.js` (hud-v5.0) · `hud-paper.js` (hud-v4.2) | Vorgänger-HUDs. Ausbauen = im Helmet tauschen; `hud-paper` ist das Papier-Register für NPC-Dialoge | **FROZEN, Referenz — nicht löschen** |
| `docs/overworld-v4b/HANDOVER_hud-v7_2026-08-07.md` | **der maßgebliche Vertrag** — Konzept, gelesene/gerufene/gesetzte Felder, Skillpunkt-Logik, Clean-Run, offene Nähte | **AKTIV, maßgeblich** |
| `docs/overworld-v4b/HANDOVER_WS1_2026-08-08.md` | **ÜBERGABE an WS1 + Coworker** — Originalgrößen-Regel (`scale = 1`), Diff-Liste der drei geänderten Dateien, Zustandsvertrag (was WS1 verdrahten muss), Asset-Bestand mit 20 Lücken, Fremdressourcen-Bewertung, Abnahme in vier Handgriffen | **AKTIV — Einstiegspunkt für WS1** |
| `docs/overworld-v4b/INDEX_tiny-swords-assets.md` | **Asset-Index aller drei gekauften Packs** — Klasse, Kontext, Animationen mit gemessenen Frames, Zustände, Funktion, Bauweise (9-Slice/3-Slice/Bars/Schriftrollen). 20 Positionen Lücken-Liste. Geparkt: Floor Tiles | **AKTIV — Bestandsaufnahme** |
| `KFB SpriteLab v1.dc.html` | **2D-Sheet-Messplatz** — Kontaktbogen, Messprotokoll gegen die 64er-Kachel, Zustandsvertrag, Größenappell, Export `sprite-matrix.json` (Schwester von `assetlab/motion-matrix.json`) | **AKTIV** |
| `overworld-v4b/unit-loader.js` | die **eine Wahrheit** für Sprites. **V3 (2026-08-08): Originalgröße, `scale = 1`** — `sizeRel` nur noch Datum. Takt über `FPS` + `unit.frameAt(key, sekunden)`; Anker seitlich korrigiert (`sideOffset`). Takt je Einheit: `def.fpsMul` / `def.fps` | **AKTIV** |
| `docs/overworld-v4b/BEFUND_frames_2026-08-07.md` | **§10 Frame-Befund** (Takt kam vom Aufrufer, krummer Maßstab, sieben ungenutzte Animationen) · **§10.8** idle flächendeckend 1,00 s → `FPS.idle` 8→11 · **§11** Anker seitlich schief (Minotaur −28 px) · **§12 der Normierungs-Irrweg**, zurückgenommen | **AKTIV, maßgeblich für Animation** |
| `docs/overworld-v4b/BRIEFING_bewegung-buehne.md` | **nächster Sprint (M): Bewegungs-Bühne** — Wasserregel in drei Klassen, Boot-Zustandsautomat, freies Testgelände, drei Vergleichsmodi, fünf Regler + Parametersatz-Export, Arena-Anschluss vorbereitet. Entschieden 2026-08-07, **noch nicht gebaut**. Schritt 0 ist der Frame-Befund §10 | **AKTIV — Startpunkt für frischen Chat** |
| `docs/overworld-v4b/HANDOVER_hud-v6_2026-08-06.md` | Atlas-Maße (weiter gültig), v6-Vertrag | SUPERSEDED, Atlas-Teil weiter lesen |
| `docs/overworld-v4b/` (7 Dokumente aus dem Export) | Masterplan, Session-Cut v4, Changelog, SSOT Tilemap | Doku (fremd, lesen) |
| `cardbuilder/kfb-ink-canon.js` | die **eine** Kante (Preset `card`) — das HUD lädt sie relativ, jsdelivr als Rückfall | AKTIV, geteilt |

**Die Nähte, die man kennen muss.** (1) `useSignature()` gibt es im Runner nicht; Slot 4 feuert
bis dahin den schweren Grundschlag und sagt das im Charakter-Fenster. (2) Lootbox-Funde tragen
sich noch nicht in den Almanach ein — der Einflug ist gebaut, es fehlt ein `game.onLoot`-Haken.
(3) `cap_polyphony: 4` **ist seit v7 umgesetzt** — das HUD zählt seine eigenen Stimmen, weil
`audio-2d.js` es nicht tut. (4) **Skillpunkte:** das Spiel kennt keinen Vorrat (`levelUp()` fragt
sofort). v7 zeigt ein Siegel, sobald `hero.skillPoints` gesetzt ist, und gibt notfalls selbst aus —
WS1 sollte `game.spendSkillPoint(stat)` nachliefern. (5) **Kompass/Minimap** ist die nächste Runde.
(6) **`u.anim` und `u.atkT` sind seit 2026-08-07 Sekunden**, keine Framezähler — wer sie erhöht,
erhöht Zeit; den Frame rechnet `unit.frameAt()`. Älterer Code, der `Math.floor(u.anim)%frames`
macht, ist falsch (§10.2). (7) `pick('row')` liefert den Ruderstreifen (nur Paddle Shark hat einen),
aber **kein** Zustand setzt ihn bisher — das ist Arbeit des Bühnen-Sprints.
(8) **Sprites zeichnen 1:1** (2026-08-08). `sizeRel` steuert das Zeichnen nicht mehr — wer es
wieder als Maßstab benutzt, frisst die Outline-Pixel. Ausnahme nur über `def.drawScale`, ganzzahlig.
(9) **FrizzleBob + die drei KFB-Heroes sind vorerst draußen** (Georg): stilistisch unpassend, keine
Linksdrehung beim Laufen, Augenpixel. Es gibt damit **keinen Helden als Bezugsgröße** — gemessen
wird gegen die 64er-Weltkachel.

**HUD v7 ist in WS0 verbaut (2026-08-07).** Der nächste Sprint hier ist ein anderes Subsystem:
**Bewegungs-Bühne** (`docs/overworld-v4b/BRIEFING_bewegung-buehne.md`) — Fortbewegung und
Terrain-Traversal statt UI. Kern-Entscheidung: Wasser ist **kein** Ja/Nein, sondern drei Klassen
(amphibisch · Seefahrer mit Boot · Landratte mit Planke), damit `tempBridge` seinen Job behält.
**Befund aus dem Katalog:** zwei leere Boot-Sprites, Ruder-Animation nur bei `paddle_shark`,
kein Boot für große Körper (Minotaur/Troll) — an WS1 zu melden.

`KFB Overworld v1.dc.html` (§4b, 3D-Fork von Travel v14) und `KFB Travel v14.dc.html` (main der
Reise) sind davon **nicht berührt**. v4_B ist der 2D-Zweig.

## 4d. Overworld v8 — Re-Home + Terrain-Floor-Art (2026-08-08)

Re-Home von `KFB Overworld v8.dc.html` als Basis. Beschluss aus BENCHMARK §2: **die Weltschicht in
v8 ist ungleich teurer nachzubauen als unsere FX-Schicht zu portieren** — also v8-Export als Basis,
unsere Module dazu. Warnung aus derselben Quelle: `game-feel.js` **nicht doppelt** einbauen.

Diese Session hat den **Boden** bearbeitet — neun Bauarten, acht davon gescheitert. Die Fehlerkette
ist dokumentiert, weil sie der teuerste Teil der Session war.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v8.dc.html` | die Basis, Weltschicht + Kollisionsraster | **AKTIV — Basis, hier nicht angefasst** |
| `KFB Boden-Konzept.dc.html` | **der Bodengenerator.** Neun schaltbare Ebenen (Züge · Schwamm · Trockenpinsel · KFB-Tusche · Marken · Papier · Dreck · Wabern · Feldbänder), sechs Biome, **Bandbauart**. Vollbild neu **264 ms** (vorher 5146) | **AKTIV** |
| `KFB Boden-Analyse und Briefing.dc.html` | Fehlerkette (9 Anläufe), Feldbänder-Prüfstand, **lösungsoffenes Briefing** für externe Modelle | **AKTIV** |
| `KFB Übergabe WS1.dc.html` | menschenlesbares Übergabedokument | **AKTIV — Einstiegspunkt für WS1** |
| `docs/overworld-v8/HANDOVER_WS1_2026-08-08.json` | **maschinenlesbare Übergabe** — Fraktionen, Slices, Anti-Pattern, Asset-Befunde, Messwerte | **AKTIV, Contract-nah** |
| `docs/overworld-v8/HANDOVER_WS1_2026-08-08.md` | Volldoku derselben Übergabe | **AKTIV, maßgeblich** |
| `KFB Mob Übersicht.dc.html` | Einheitenkatalog. **`BOSS_ZONE` ist jetzt SSOT** für Zone *und* Gruppe; Monk/Lancer ergänzt; Troll-Prüfhinweis | **AKTIV** |
| `KFB Boden-Werkstatt.dc.html` | Vorläufer mit Oval-/Gitter-Bauart | **SUPERSEDED** von `KFB Boden-Konzept.dc.html` |
| `scraps/troll-blatt.png` · `scraps/baer-run.png` | Abnahme-Belege zu den Asset-Befunden | **ASSET** (klein, behalten) |
| `scraps/boden-*.jpg` · `scraps/band-*.png` · `scraps/anwuchs-*.png` · `scraps/feld-probe*.png` | Zwischenstände der neun Bauarten | **DEAD** — abgearbeitet, in der Fehlerkette dokumentiert. Löschen nach Sign-off. |

**Die Nähte, die man kennen muss.**
(1) **Der Boden ist die sichtbare Schicht, nie die spielende.** Kollision bleibt beim `land[]`-Raster.
(2) **Bevel und Emboss gehören zur Höhen-/Ebenenlogik**, nicht in die Floor-Art einer Ebene — die
häufigste Vermischung in dieser Session.
(3) **`BOSS_ZONE` überschreibt nur die Anzeige.** Die Quelle ist der externe Katalog `OW_UNITS`;
dort nachziehen, sonst gibt es zwei Wahrheiten.
(4) **Troll-Sprite:** die Quelle ist geprüft und korrekt (4608×384, grüner Troll mit Keule). Zeigt
die Kachel etwas anderes, liegt der Fehler im **Zuschnitt der Übersicht**.
(5) **Monk und Lancer liegen im Free Pack**, nicht in Update 010 — und noch nicht im Katalog.
(6) ⚠ **Null Audiodateien im Repo.** Der Ansager ist verdrahtet und stumm. Jede Ton-Idee steht auf
einer Schicht, die nicht existiert.
(7) **Kostenregel:** erstes Bild < 400 ms, 60 fps beim Scrollen, **nie synchron im Zeichenpfad**
backen. Referenz ist der 36-s-Kaltstart, der das Reliefsystem umgebracht hat.

## 4e. Overworld v9-B — die rechte Spalte ist ein Kartenspiel (2026-08-08)

Auftrag Georg: Mini-Map als **Rechteck im KFB-Kartenformat mit KFB-Tuschekante**, Quest darunter als
Karten-Vorschau, Actor-Karte unten rechts (gezogen aus dem Zonen-Deck, **gespeichert**), geräumte
Szenen-Karten gestapelt darüber, Sichtzeichen bei drei Szenen — und **Motive statt Platzhaltertext**
in Almanach und Quest-Log.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v9-B.dc.html` | v8 + zwei Skripte im Helmet. Sonst identisch (gleiche Props) | **AKTIV** |
| `overworld/card-art-v9b.js` | Kartenmotiv aus dem Deck-PDF: Seitenviertel + `yShift`, auf `CARD_AR` aufgezogen. Ein Render zur Zeit, Watchdog | **AKTIV** |
| `overworld/card-rail-v9b.js` | die Spalte: Insel-Rechteck · Quest · Szenen-Stapel · Actor + Almanach/Quest-Log als Blattraster | **AKTIV** |
| `KFB Overworld v8.dc.html` | unverändert — lädt die zwei Skripte nicht | **AKTIV, Basis** |

**Die Nähte, die man kennen muss.**
(8) **Kein Eingriff im Runner.** `overworld/` ist geteilt: das Modul hängt sich an das **fertige**
v7-HUD (versteckt Kompass und Almanach-Stapel, setzt seine Blätter an deren Platz). v8 bleibt bitgleich.
(9) **Der Kanal ist der des Spiels, nicht der des Manifests.** `baseUrl` aus `index.json` wird
verworfen, es gilt `OW_SRC.kfb()` — dieselbe Entscheidung wie in `overworld-game.loadDeck`.
(10) **Crop-Zahlen bleiben eine Zahl, ein Ort:** `yShift` wird aus `terrain-v13/card-grids.json`
gelesen, nicht kopiert. Fehlt die Datei, bleibt es beim stumpfen Seitenviertel.
(11) **Ein Blatt malt sich erst, wenn es seine Größe kennt.** Gemessen: mit `requestAnimationFrame`
blieben alle Almanach-Blätter auf dem Canvas-Standard 300×150 leer, weil im nicht sichtbaren Tab kein
Frame kommt. Also zeichnet `fillGrid` **nach dem Anhängen synchron**; der `ResizeObserver` malt nur nach.
(12) **Kein zweiter Titel auf dem Blatt.** Das PDF-Motiv trägt seinen Titel selbst; ein gesetzter
Titel darüber war doppelt und verdeckte die Illustration. Die Rolle steht als **Stempel** im Blatt
(`ISLAND · 1/6` · `QUEST · 2/6` · `SCENE 1` · `ACTOR`), der Name im Tooltip und im Almanach.
(13) **Eigener Speicher, kein Vertragsbruch.** Actor + Quest-Log liegen unter
`kfb.v9b.rail.<seed>`; das `quests`-Fach im Journey-Save von v8 bleibt unberührt (es zu belegen wäre
eine Vertragsänderung, keine HUD-Sache).
(14) **Offen:** der König lobt je geräumter Szene ein Blatt aus einer anderen Welt aus, Deckel 6 —
die *Auflösung* (Quest-Finale, Actor-Wechsel als Skill) hängt an `game.rail.setActor/dropQuest` und
ist noch nicht bespielt.

**Nicht gebaut, aber spezifiziert** (Slices M3–M6 im Handover): Sternkarte mit Turm im Zentrum und
sechs terrainfolgenden Pfaden · Kartenzone mit Gummi-Outline, Fluid-Gutter und Holzbrücke ·
drei Wellen mit Boss · lebendige Biome in vier Zuständen.

---

## 4f. UI-Baukasten TS — WS0 Paket 2 (2026-08-09)

Auftrag: `uploads/BRIEFING_WS0_v10.md` §1 Paket 2 · §2. Der Tiny-Swords-Baukasten als eigenes Modul,
mit **zwei Zeichenwegen von Anfang an** (Bildschirm für HUD, Welt für Zonentitel/Ortsschild) —
damit der Welt-Weg nicht später nachgebaut wird (Fehlerklasse »zwei Wahrheiten«).

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld/ui-kit-ts.js` (uikit-v1.3) | **der Baukasten** — `paper9` · `band3` · `bar` · `fixed`, `drawScreen` / `drawWorld`, ein Cache. Misst die Slice-Blätter selbst (Alpha-Scan + Einrasten auf 64) | **AKTIV** |
| `KFB UI-Baukasten TS.dc.html` | **das Musterblatt** — Messprotokoll, vier Muster in drei Größen, Kappen-/Ecken-Beweis, Welt-Weg-Bühne, `ui-slices.json`-Download | **AKTIV** |
| `overworld/ui-slices.json` | Messdatei zum Nachlesen — **zeichengleich mit `OW_UIKIT.exportSlices()`**, denselben Weg nimmt der Download-Knopf. **Bei Abweichung gilt die Messung**, nicht die Datei | AKTIV, Daten |
| `docs/overworld-v4b/BEFUND_ui-kit-ts_2026-08-09.md` | Befunde, Messverfahren, Oberfläche, Offenes | **AKTIV, maßgeblich** |
| `scraps/uikit-rohblaetter.png` · `scraps/uikit-papers.png` | Abnahme-Belege (Rohblätter im 64er-Raster) | ASSET (klein, behalten) |
| `overworld/paper-atlas.js` (pa-v1.0) | Vorgänger: Maße als Konstanten, zeichnet **halbiert** | **SUPERSEDED** — Leser `hud-paper.js` und `asset-browser-2d.js` hängen noch daran, Umstellung in Paket 3 |

**Abnahme 2026-08-09:** 19 Blätter, 0 Fehler · **Pixelmessung 12/12 bestanden**
(Abweichung 0 an allen Kappen und Ecken) · alle Teile aller Blätter Vielfache von 64.
Ladezeit kalt über CDN 379 / 577 ms in zwei Läufen — **ohne festen Standpunkt, also keine
Abnahmezahl** (Hausregel 2), nur eine Größenordnung.

**Die Nähte, die man kennen muss.**
(1) **`Banner_Slots.png` ist ein 9-Slice**, kein 3-Slice — 192×192, lückenloses 3×3 aus 64ern,
dasselbe Format wie die `*_9Slides` des 010-Satzes. Das Briefing §2 sagt anderes.
(2) **`RegularPaper`/`SpecialPaper` sind 9-Slice-Atlanten** (320×320, 3×3 mit 64er-Lücke) —
`INDEX_tiny-swords-assets.md` §8.2 („kein 9-Slice, feste Form") ist widerlegt. Einschränkung: die
Teile tragen eine gemalte Falte, die sich über große Flächen sichtbar wiederholt.
(3) **Die Free-Pack-Bars sind 3-Slice mit Lücken** (Kappe 64 · Lücke 64 · Mitte 64 · Lücke 64 ·
Kappe 64) — eine Leiste ist in jeder Länge baubar. `Swords.png` ebenso (Trennstrich).
(4) **Die Messung rastet auf 64 ein.** Der rohe Alpha-Scan liefert den Inhalt, nicht das Fach; die
durchsichtige Fassung um eine gerissene Kante gehört zum Teil.
(5) **Im Welt-Weg bleibt der Maßstab 1.** UI-Kunst wächst nicht mit dem Kamera-Zoom (Outline-Pixel).
`scaleMode:'integer'` ist der Notausgang. Die Sortierung gehört dem Aufrufer (`sortY`).
(6) **K5-Grenze:** das Modul kennt `kfb-ink-canon.js` nicht. TS-Kunst bleibt as-is.

**Blockiert:** Paket 3 (HUD-Rework) — `docs/REVIEW_WS0_hud-v9b.md` liegt nicht in diesem Workspace.
**Nicht machbar hier:** Paket 1 (`sfx.json` ins Repo) — kein Schreibzugriff; die Datei kann gebaut,
muss aber von Georg hochgeladen werden.

---

## 4g. Overworld v10-S5 — Re-Home des Lead-Stands (2026-08-09)

Quelle: WS1-Export `KFB Overworld v10-S5/overworld-v10-S5_2026-08-09` (lokaler Ordner). Grund:
die Review sagt es selbst — **WS0 forkt bisher v8, WS1 ist bei v10-S5.** Solange die HUD-Arbeit
additiv im Helmet hängt, ist das folgenlos; sobald jemand am Runner baut, ist es Fork-Divergenz.
Der HUD-Umbau (Paket 3) setzt deshalb auf diesem Stand auf, nicht mehr auf v8.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v10.dc.html` + `overworld-v10/` (39 Module + Font + `hud-slots.json`) | **der Lead-Stand, neue Fork-Basis für WS0** | **AKTIV — Basis** |
| `refs/KFB-Overworld-v10-S5-standalone.html` | offline lauffähige Fassung zum Durchklicken | AKTIV (Referenz) |
| `KFB Overworld Masterplan.dc.html` | der Leser für `docs/overworld-v10/MASTERPLAN_overworld.md` | AKTIV |
| `docs/overworld-v10/` (11 Dokumente + 3 Captures) | Masterplan · Briefing (2. Fassung, §2a trägt unsere Messbefunde) · **REVIEW_WS0_hud-v9b.md** · Antwort an WS0 · Changelog · Onboarding · Living Concept · Konzept-Archiv · Session-Cut · Waber-SSOT · README | **AKTIV, maßgeblich** |
| `overworld/` (v8-Linie) + `KFB Overworld v8/v9-B.dc.html` | Vorgänger-Zweig; v8 muss bitgleich bleiben | **FROZEN nach dem HUD-Umbau** — bis dahin Quelle für `card-rail-v9b.js` |

**Die eine Änderung am Export:** die 38 Skriptpfade im DC zeigen auf `./overworld-v10/` statt
`./overworld/`, weil unter `overworld/` hier die eingefrorene v8/v9-B-Linie liegt. Ein Fork-Stempel
steht im Kopf des DC. **Der Runner ist nicht angefasst.**

**Abnahme 2026-08-09 (echter Bedienweg, im Vorschaufenster gemessen):** Module **39/39** geladen ·
`ready` true · 6 Zonen · 29 Mobs · Held gesetzt · `window.__loopErr` null · **Audio 26 Ereignisse,
Ansager 12/12** (Paket 1 ist im Repo angekommen — der Ansager ist nicht mehr stumm) · Relief 6 von
9, 483 ms kalt · Boden 13/13 Blätter · **von 104 lokalen Ressourcen keine mit Status ≥ 400**.
Einzige Warnung: `drop_002.ogg` dekodiert nicht — der bekannte, bereits umgangene Defekt.

**Beim ersten Anlauf gefehlt, behoben: `hud-slots.json`.** Der WS1-Export enthält sie nicht,
obwohl das README ihn als vollständig beschreibt — bei WS1 fällt das nicht auf, weil die Datei
dort im Verzeichnis liegt. `hud-v7.js` holt sie **relativ zum Modul** und schluckt den Fehlschlag
in einem leeren `catch`: **kein Konsolenfehler, das HUD fällt still auf `FALLBACK` zurück** und
sieht dabei aus wie in Ordnung. Gefunden wurde es nur über den Netzwerkweg (ein 404 von 104
Ressourcen). Aus der v8-Linie kopiert, gegengeprüft: **Status 200, 8 Slot-Einträge**.
**Gehört in die nächste Nachricht an WS1** — ihr Export ist unvollständig.
Merksatz für diese Klasse: *ein leeres `catch` um einen `fetch` macht eine fehlende Datei
unsichtbar; wer eine Konfiguration lädt, muss ihren Fehlschlag melden.*

**Nebenbefund, behoben:** `overworld/card-rail-v9b.js` rief `game.travelPoint(x, y, label)` an zwei
Stellen **ohne das vierte Argument**. Der Runner nimmt dann drei Felder Nachsicht — auf einer
112 px breiten Insel für 240 Felder ist ein Pixel zwei Felder, also fand jeder Klick irgendein
Ufer: **der Strand-Teleport.** `hud-v7.js:858` ruft mit `1`; wer den Kompaß ersetzt, erbt die Regel.
Insel-Klick jetzt mit `1`, Peilung behält die Vorgabe (sie zeigt auf einen benannten Ort).
Das ist Konflikt (c) aus `REVIEW_WS0_hud-v9b.md` §3 — belegt und erledigt.

---

## 4h. HUD-Umbau auf den Baukasten — WS0 Paket 3, Slice A (2026-08-09)

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v10 HUD.dc.html` | **der Arbeitsstand**: v10-Runner + Baukasten + Rail. `kfb-paper-atlas.js` ist ausgehängt | **AKTIV** |
| `overworld/card-rail-v9b.js` | die Kartenspalte. Kartenkunst über `OW_ART` (Adapter statt zweitem Modul), Chrome über `OW_UIKIT` | **AKTIV** |
| `overworld/ui-kit-ts.js` (uikit-v1.5) | + Icons (10 × 3 Zustände) · Zeiger (6) · Münzblätter · **Bandblätter mit Farbzeilen** (`band3(key,w,zeile)` / `band3By(key,w,'blue')`) · `icon` `pointer` `strip` `url` `src` `iconSrc` `pointerSrc` | **AKTIV** |
| `overworld-v10/units-catalog.js` | **zusammengeführt** aus der WS0-Fassung, gegen die v10-S5-Fassung gediffed (31/31 Einheiten, keine verloren). + Lancer/Monk, Menschen-Avatare als Regel, Gegner-Avatare 12→6 ungeklärt. Fork-Stempel im Kopf | **AKTIV — Diff an WS1** |
| `overworld-v10/hud-v7.js` | **von WS0 geändert** (WS1: »die Datei gehört euch«): Zahnrad aus dem Baukasten, `hud-slots.json`-Fehlschlag wird gemeldet | **AKTIV — Diff an WS1** |
| `docs/overworld-v10/BEFUND_hud-umbau_2026-08-09.md` | Umbau, Messungen, die zwei Laufzeitfehler, der nächste Slice | **AKTIV, maßgeblich** |
| `overworld/card-art-v9b.js` | zweites Kartenkunst-Modul | **DEAD** — nirgends mehr geladen, löschbar nach Sign-off |
| `overworld/paper-atlas.js` · `overworld-v10/kfb-paper-atlas.js` | Vorgänger-Teileliste | **SUPERSEDED** — im HUD-DC ausgehängt; Rückbau im Runner-Helmet ist ein Vorschlag an WS1 |

**Abnahme 2026-08-09 (echter Bedienweg):** die vier Punkte aus dem Briefing erfüllt — Kompaß
sichtbar (Insel zeichnet, 516 deckende Proben) · `snap`-Fix intakt · **ein** Kartenkunst-Modul ·
Pfad zu `card-grids.json` stimmt (`OW_ART` liest neben sich selbst). Dazu: `__loopErr` null ·
**keine Ressource mit Status ≥ 400** · 5 Blätter, 4 mit Motiv · `KFB_PAPER` nicht mehr geladen.

**Die Nähte, die man kennen muss.**
(1) **Der Adapter ist kein Modul.** `OW_ART` liefert Versprechen, das Rail braucht im Zeichentakt
eine synchrone Antwort — der Adapter hält nur das Ergebnis. `ready`/`decks`/`deckCards` benutzen
**dieselbe Auswahlregel und dieselben Feldnamen wie der Runner** (`loadDeck`).
(2) **Zwei Zugriffsarten auf eine Teileliste.** `icon()` misst und braucht `load()`;
`iconSrc()` gibt nur die Adresse und ist synchron — Chrome, das beim Anhängen gebaut wird, kann
nicht auf ein Versprechen warten.
(3) **Eine Regel an der Eingangstür gilt nicht für das, was schon im Haus ist.** Gespeicherte
Quests umgingen die Regel »nur gemessene Decks« und zeigten angeschnittene Karten; sie werden
jetzt beim Aufwachen verworfen. Derselbe Fehler wie `CA.ready`: beides fiel **still** aus.
(4) **`hud-v7.js` gehört WS0** (WS1, 9.8.) — Änderungen daran gehen als Diff zurück, nicht als
stiller Fork.
(5) **Das Heldenblatt prüft Fähigkeiten, nicht Versionen.** `popCost`/`popSpend` da → POP kauft;
nicht da → der alte Punkte-Weg. V10-S6 ist im vorliegenden Export **noch nicht enthalten**, also
ist der neue Weg `GEBAUT`, nicht `LÄUFT` — Beleg braucht einen Export mit S6.
(6) **Kein Level mehr im HUD-Text.** Damit ist WS1s Shadow-Regel, die unsere Level- und
»Frequency«-Zeile ausblendet, überflüssig.
(7) **Almanach und Quest-Log sind zwei Ringe** (Slice C). Die Blattgröße ist FEST — sie ist die
der Aktionskarten. Wer sie wieder variabel macht, holt sich das Neuzeichnen je Bild zurück:
Canvas-Blätter dürfen nicht per CSS skaliert werden, sonst weicht die Tuschekante auf.
Geometrie: Drehpunkt fünf Blattbreiten rechts außerhalb, Schritt 0,62 Blatthöhen, daraus der
Winkel (4,08° bei 87 px Blattbreite). Der Ausgriff nach rechts wird ausgeglichen — ohne das
standen 36 px über dem Bildrand.
(8) ⚠ **Ein Backtick in einem CSS-Kommentar beendet das Template-Literal.** Zum dritten Mal
getreten, diesmal zwei Zeilen unter der Warnung davor. Symptom: das Rail fehlt vollständig,
das HUD sieht dabei heil aus.
(9) **Ein Bandblatt darf Zeilen haben.** `Swords.png` sind **fünf liegende Schwerter, eines je
Farbe** (blau · rot · gelb · lila · stahl), je 3-Slice: Griff 128 · Klinge 64 kachelbar ·
Spitze 128, Zeilenhöhe 128. Der Messcode setzte für Bänder pauschal `rows=[[0,h]]` — »Band« hieß
dort »eine Zeile« — und meldete deshalb eine 602 px hohe Klinge, die es nicht gibt.
**Eine Messung, die auf einer Annahme sitzt, misst die Annahme.** Behoben in uikit-v1.5;
Kappen-Beweis 0 für alle fünf Farben.
(10) **Das Panel des Runners zeigt seit V10-S6 dasselbe noch einmal** (FLUFF · XP mit POP · Level ·
drei Werte) und liegt an derselben Stelle wie unser Blatt. Der erste Anlauf blendete nur die
Zeilen weg — zu wenig: **der Kasten selbst blieb stehen** und lag als graugrüne Platte über
unserem Papier. Jetzt fällt der Kasten mit (Hintergrund, Rahmen, Polsterung). **Was bleibt, sind
die Kayfabe-Ladungen** (`.kf`) — die zeigt unser Blatt nicht, und wer eine Anzeige versteckt, die
er nicht ersetzt, nimmt dem Spiel eine Auskunft weg. Gemessen: Panel-Hintergrund transparent,
genau ein sichtbares Kind (`kf`), **nichts Fremdes mehr im Statkasten**.
(11) **Papier ist Papier, kein Glas.** Die Statleiste lief auf der gemeinsamen Sichtbarkeit des
Rails (`--r9op` 0,78) mit. Bei den kleinen Kartenblättern fällt das nicht auf, bei einer Fläche
von 446×69 schon — das Gras schien durch und machte aus dem Papier eine olivgrüne Scheibe.
Das war Georgs Befund »die alte Fluff-Box wiederherstellen«: nicht die Tusche fehlte, die
**Deckkraft**. Gemessen nach dem Fix: Deckkraft 1, Papier rgb(237,229,208), voll deckend.
Die gemeinsame Sichtbarkeit gilt weiter für alles, was Teil des Bildes ist; ein beschriebenes
Blatt gehört nicht dazu.
(12) ⚠ **Vierter Backtick-Treffer im CSS-Literal** — diesmal im Kommentar, der Punkt (11) erklärt.
Andere Fehlermeldung (»Invalid left-hand side expression«), gleiche Wirkung: kein Rail.
**Wer im CSS-Block einen Bezeichner nennt, schreibt ihn ohne Backticks** und prüft danach, dass
der Block null Backticks enthält.

---

## 4i. Re-Home v10-S10 — der zweite Export des Tages (2026-08-09)

Quelle: WS1-Export `overworld-v10-S10_2026-08-09`. Bringt **V10-S6 (POP)** und alles danach; ersetzt
den S5-Stand. Selektiv re-homed: **zwei Dateien wurden NICHT überschrieben**, weil WS0 sie führt.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v10 HUD.dc.html` | Arbeitsstand: S10-Runner + Baukasten + Rail, `kfb-paper-atlas.js` ausgehängt | **AKTIV** |
| `overworld-v10/` (46 Module + Font + 3 JSON) | S10-Stand · neu: `bubble-ts.js` (Sprechblase aus Pet Studio v4, bedienbar) · `chatter-phrases.js` (8 Fraktionen × 8 Felder) | **AKTIV — Basis** |
| `overworld-v10/hud-v7.js` | **nicht ersetzt** — S10s Fassung ist zeichengleich mit unserer Basis bis auf genau die drei Zeilen, die wir geändert haben. Es gab nichts zu übernehmen | **AKTIV — Diff an WS1** |
| `overworld-v10/units-catalog.js` | **nicht ersetzt** — unsere zusammengeführte Fassung (317 Zeilen gegen 252); WS1 hat den Diff noch nicht eingebaut | **AKTIV — Diff an WS1** |
| `docs/overworld-v10/` | + Antwort Runde 3 (Signaturen) · Masterplan §6 mit Aufruf-Tabelle · Changelog · **`EXPORT_PRUEFLISTE.md`** (aus unserem Befund entstanden) | **AKTIV** |
| `refs/KFB-Overworld-v10-S10-standalone.html` | offline lauffähig | AKTIV (Referenz) |
| `scraps/hud-v7-S10.js` · `scraps/units-catalog-S10.js` | die WS1-Fassungen als Vergleichsmaßstab | ASSET (klein, behalten) |

**Abnahme 2026-08-09:** `ready` true · Rail hängt · `__loopErr` null · **keine Ressource ≥ 400** ·
`popCost`/`popSpend` vorhanden · Held: **POP 8**, sechs Werte aus dem Runner, kein Level ·
Sprechblase und Fraktions-Phrasen geladen · Baukasten uikit-v1.4 · fünf Ritterklassen.

**Die Naht, die man kennen muss.** Drei Annahmen über die POP-Oberfläche waren falsch, und der
teuerste Punkt war der dritte: **vier der sechs Werte hießen im Rail anders** (`kayfabingo` gegen
`bingo`) und wurden dort als eigene Zahl geführt, weil der Runner sie früher nicht kannte. Seit
V10-S6 gehören alle sechs dem Runner. Ohne den Abgleich hätte das Heldenblatt vier Zahlen gezeigt,
die mit dem Spiel nichts zu tun haben — zwei Wahrheiten, und die stillere hätte gewonnen.

---

## 4j. POP-Knopf, Tab ohne Sprung, untere Bahn — Slice A2 (2026-08-09)

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld/card-rail-v9b.js` | POP als runder Knopf mit Zahl darin; `lean` ohne Hover-Sprung; `lane()` verteilt Logbuch und Aktionskarten | **AKTIV** |
| `overworld/ui-kit-ts.js` | + `btnRound` (TinyRoundBlueButton) als `fixed`-Teil | **AKTIV** |

**Gemessen (681 px Breite):** POP-Knopf 32 × 32 mit Zahl darin · Abstand Logbuch → erste Karte
**14 px** · rechts 150 px frei · kein Hochsteigen nötig.

**Die Nähte.**
(13) **Ein Kreis hat keine dehnbare Mitte** — der runde Knopf ist `fixed`, nicht 9-Slice; 64 → 32
ist exakt halbiert und bleibt auf ganzen Pixeln.
(14) **Fester Kasten statt Textzeile:** die Zahl liegt IM Knopf, damit dreistellige Stände die
Zeile nicht schieben.
(15) **Eine Transform zählt für das Layout nicht.** Der Kartenfächer kippt per `transform`, also
wusste die Hand nichts von ihrer wirklichen Breite und schob ihr linkes Blatt unter das Logbuch.
`lane()` misst die belegten Rechtecke, statt mit Breiten zu rechnen.
(16) **Eine mittig gesetzte Reihe verschluckt die Hälfte** eines linken Polsters — gemessen kamen
von 26 px genau 13 an. Wird verdoppelt, solange `justify-content: center` gilt.
(17) **Wer weniger zeigen will, zeigt dauerhaft weniger — nicht abwechselnd.** Der `lean`-Tab
wechselte beim Zeigerkontakt die Breite (346 ↔ 446); das ruckte durchs Bild. Jetzt eine Breite.
(18) ⚠ **Zwei verschiedene Dinge unter einem Klassennamen sind die »zwei Wahrheiten«-Klasse in
CSS.** Das Badge hiess zuerst `.pop` — den Namen besitzt der Runner aber schon, als Vollbild-Modal
mit `background: rgba(12,18,15,.72)`. `position` und `display` wurden überschrieben, **der
Hintergrund nicht**: hinter dem runden Knopf mit durchsichtigen Ecken lag ein schwarzes Quadrat.
Ein Fehler, der nur an den Ecken sichtbar wird und sonst wie Absicht aussieht. Jetzt `.r9acct` —
rail-eigen, wie jede andere Klasse des Rails. **Vor jedem neuen Klassennamen im fremden Shadow-Root
gehört ein Blick in dessen Stylesheet.** Gemessen nach der Umbenennung: Hintergrund transparent.

---

## 4k. Avatare: alle geprüft, gemappt, korrigiert (2026-08-09)

Anlass: Georgs Befund »das Avatarbild ist falsch (war schon öfter so)«.

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld-v10/units-catalog.js` | Zuordnung korrigiert; `HAV_SLOT` (Klasse → Platz) statt nackter Ziffern; Schwarz-Block ergänzt | **AKTIV — Diff an WS1** |
| `docs/overworld-v10/BEFUND_avatare_2026-08-09.md` | Verfahren, beide Tabellen, Belege | **AKTIV, maßgeblich** |
| `scraps/avatare-25.png` · `avatare-16-25.png` · `avatar-vs-unit3.png` · `gegner-avatare.png` · `gegner-zuordnung.png` | die Prüfbilder — jedes Blatt neben seiner Einheit | ASSET (klein, behalten) |

**Vorher/nachher:** Menschenklassen richtig 1/5 → **5/5** · Gegner mit Porträt 12 → **18** ·
offene Blätter 6 → **0** · spielbar ohne Porträt 6 → **1** (FrizzleBob, hat kein Blatt).

**Die Nähte.**
(19) **»Gemessen an der Übersicht« war nicht gemessen.** Der Kommentar behauptete die Reihenfolge
Warrior · Archer · Pawn; am Bild ist sie **Warrior · Lancer · Archer · Monk · Pawn**. Vier von fünf
Klassen trugen ein fremdes Gesicht — und keine so falsch, dass es beim Vorbeischauen auffällt.
(20) **Eine nackte Ziffer kann man nicht falsch finden, nur falsch haben.** `humanAvatar(c,1)`
stand an fünf Stellen. Jetzt nennt die Klasse ihren Platz selbst (`humanAvatar(c,'monk')`).
(21) **Ein Aufrufer, dem eine Farbe fehlt, fällt still auf die Vorgabe zurück.** `HAV_BASE` kannte
kein Schwarz, also trugen die fünf Schwarz-Ritter blaue Porträts — ohne eine Zeile Warnung.
(22) **»Offen« hieß: noch nicht hingesehen.** Sechs Gegner-Blätter galten als unklärbar; alle sechs
haben ein eindeutiges Gegenstück. Ohne Blatt bleiben genau zwei (`pig`, `pig_rider`).
(23) **Prüfen heißt nebeneinanderlegen.** Erst auf 130–150 px vergrößert wird ein Strohhut ein
Strohhut und eine Zipfelmütze eine Zipfelmütze — in Miniatur sind beide »klein, bunt, mit Hut«.
(24) **Die POP-Zahl saß nie schief** (gemessen: Versatz 0/0 zur Knopfmitte, Ziffernmitte gegen
Zeilenbox 0,11 px). Schief aussah sie wegen des gerichteten Schattens `0 1.5px`. Auf einer runden
Scheibe ist ein Schatten mit Richtung immer eine Behauptung über Licht — jetzt ein symmetrischer
Umriss, der nichts behauptet.

---

## 4l. Baukasten erweitert: 19 → 96 Teile (2026-08-09)

`overworld/ui-kit-ts.js` **uikit-v1.5**. Neu: Knopfzustände (Zeiger · gesperrt · gedrückt) als
3- und 9-Slice, Reiter rot, `Carved_Regular`, die beiden hängenden Banner — und **28 Verbinder
für Menübäume**, die als Regel stehen statt als Liste (`conn_blue_up`, `conn_red_left_pressed`,
`conn_banner_down`).

**Gemessen:** 96 Blätter, **905 ms** kalt (vorher 3003 ms bei denselben 96), 0 Fehler, alle
Pixelbeweise weiter bestanden.

**Die Nähte.**
(25) **Nebenläufig laden, sonst wartet jedes Blatt auf seinen Vorgänger.** Bei 19 Teilen fällt das
nicht auf, bei 96 sind es 2 Sekunden reine Wartezeit. Die Messung bleibt in Listenreihenfolge
(lesbares Protokoll), Fehler bleiben einzeln — ein fehlendes Blatt reißt die anderen 95 nicht mit.
(26) **28 Blätter als Liste sind unlesbar, als Regel sind sie sechs Zeilen.** Benannt wird nach
dem, wonach man sucht: Farbe, Richtung, Zustand.
(27) **`Carved_Regular` ist `fixed`, kein Slice.** Ein fertiges Täfelchen von 1,2 kB — wer es
dehnt, dehnt eine Zeichnung. Dehnbare Tafeln heißen `carved3` und `carved9`.

---

## 4m. Das leere Statblatt — Zustand am Bildtakt (2026-08-09)

`renderStats()` · `paintAvatar()` · `lane()` standen allein in der rAF-Schleife. Drosselt der
Browser die Bilder (Vorschau ohne Fokus, versteckter Tab, Screenshot-Lauf), läuft `frame()` nie —
das Blatt wird gebaut, aber **nie befüllt**: kein Fluff, keine Werte, POP 0, kein Gesicht, und
**keine Zeile Fehler**. Behoben: die drei hängen zusätzlich an der 800-ms-Uhr, die es in dieser
Datei längst gibt.

**Die Nähte.**
(28) ⚠ **Was einen Zustand zeigt, darf nicht am Bild hängen.** Animation gehört in die
Bildschleife, ein Zahlenstand nicht. Die Regel stand seit dem Kill-Wurf im selben File —
die Zustandsanzeigen waren nur nicht darunter gehängt.
(29) **Der Beleg lag im Log und wurde überlesen:** `[card-art] Wachhund: Render hängt (Tab
inaktiv?)` — ein anderes Modul meldet genau diesen Zustand. Wer eine Wachhund-Warnung eines
fremden Moduls ignoriert, verschenkt eine fremde Messung.
(30) **`lane()` prüfte `display` und `visibility`, nicht `opacity`.** Das eingeschlafene
Logbuch (opacity 0) reservierte weiter Platz. Was man nicht sieht, schiebt keine Karten.

**Gemessen im gedrosselten Zustand:** 120/120 · POP 8 · BZ 3 KF 2 BI 1 BO 1 BG 1 BS 0 · Porträt
108 px sichtbar · `--r9hand` 89 px.

---

## 4n. Skins, Snacks, Popcorn-Tüte — **Sprint für einen frischen Chat** (konsolidiert 2026-08-10)

Zwei WS1-Briefings (Lulls-Skins · Food/Googly/Popcorn) plus ihre Antwort mit den Sign-offs, in
**einem** Blatt zusammengeführt. Rein visuell, absurd, **ohne jeden Bonus** (K1). **Noch nicht gebaut.**

| Artefakt | Rolle | Status |
|---|---|---|
| `docs/overworld-v10/SPRINT_skins-snacks_2026-08-10.md` | **das eine Blatt**: Vertrag, Physik, die vier Stücke, fünf Klärungen mit Messwerten, Showroom, Reihenfolge | **AKTIV — Startpunkt für frischen Chat** |
| `docs/overworld-v10/BRIEFING_lulls-skins_2026-08-10.md` | erstes Briefing im Wortlaut | **SUPERSEDED** — in den Sprint gefaltet, löschbar nach Sign-off |
| `overworld/skins-2d.js` · Showroom-DC | `OW_SKINS.draw(ctx, skinId, u, dt, moved)` + `OW_SKINS.list()` | **GEPLANT** |

**Die drei Fragen sind beantwortet — mit Code.** WS1 hat den **Zeichen-Haken gebaut** (V10-S22: im
Runner, nach der Einheit, vor dem Etikett, getragen von `u.skin`), den Zustand uns gegeben
(Schlüssel Einheit × skinId, WeakMap) und die zweite Uhr in den Vertrag geschrieben. Der Luftballon
wird **gezeichnet**, nicht gekauft. Unser K1-Testfall ist übernommen.
**Damit ist die Blockade weg — und durch eine andere ersetzt: der Haken ist in S22, wir sind auf
S10.** Das Re-Home ist Schritt null dieses Sprints, keine Aufgabe daneben.

**Fünf Klärungen, die WS0 gemessen hat und die vor dem ersten Bild entschieden sein müssen:**
1 ⚠ **Augengröße 12–14 px passt nicht.** Das Briefing rechnet mit `bodyH 72–86`; gemessen sind
  **31–111 px** (Schaf 31, Bär 111). 13 px sind auf dem Schaf 42 % der Körperhöhe. Also **Anteil von
  `bodyH`**, nicht absolute Zahl.
2 **Das Food-Emote-Pack gibt es so nicht.** Im Repo: `Foods Asset HQ` (bis 4,2 MB, die »zu glatte«
  Variante), `Foods Assets Small`, und `Foods Assets CartoonOnion` — **eine Zwiebel in zehn
  Stimmungen**, keine Speisensammlung. Die Biome-Zuordnung hat noch keine Quelle.
3 **Kenney Googly Eyes liegen nicht im Repo** (0 Treffer in 3153 Dateien) — und **vier Lider bekommt
  man aus einem Sprite ohnehin nicht heraus**. Zeichnen ist hier nicht der Notnagel, sondern richtig.
4 **`KFB Pet Studio v4.dc.html` fehlt** in Projekt, S22-Export und Repo (nur der 3D-Pet-Editor ist
  da). Ohne das Rig bauen wir die Lider neu und tauschen sie später — genau das, was vermieden
  werden soll.
5 ⚠ **Die Popcorn-Tüte kollidiert mit dem POP-Knopf von gestern** (§4j/§4o): Icon + Zähler + Knopf
  gibt es bereits einmal. Zwei Bedienstellen für eine Währung sind zwei Wahrheiten. Dazu der
  ausgesprochene Widerspruch: »das Buffet darf kein Menü werden« — unsere Einkaufsliste **ist** eine
  Liste mit Preisen und wurde gestern abgenommen. **Preise zu zeigen ist nicht dasselbe wie Werte
  anzuzeigen**; ein Automat ohne Preisschild ist ein Glücksspiel. Georg entscheidet.

**Sign-offs von WS1 (10.8.), hier nachgetragen:** Schwert-als-Wappen **Go** · Almanach/Quest-Log als
zwei Ringe **Go** · `overworld/card-art-v9b.js` löschen **Go** · `scraps/boden-*.jpg` löschen **Go** ·
§5 uploads sichten **Go** (behalten, was ein Sprint zitiert).
**Der Ink-Kanon gehört WS1** — `bend`/`torn` bauen sie, wir liefern die Anforderung (wofür, welche
Größe, welche Anmutung). Damit ist unsere Blockade B beantwortet, nicht mehr offen.
**`game.onLoot`:** WS1 baut den Haken, sobald wir sagen, was wir brauchen — Ereignis mit Karte und
Zone oder nur ein Zähler. *Sie raten es ausdrücklich nicht.*

---

## 4o. Statblatt: Name, Titel, Padding — und der Almanach-Befund (2026-08-10)

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld-v10/identity.js` | **aus dem WS1-Export S22 vorgezogen** (ident-v1, V10-S20): Name, Titel, Schmähung. Die eine Wahrheit über »wer ist der Spieler« | **AKTIV, fremd — nur lesen/rufen** |
| `overworld/card-rail-v9b.js` | Namenszeile im Statblatt (Name schreibbar, Titel durchblätterbar), Polster oben/unten 13/14 px, `reconcile()` an der 800-ms-Uhr | **AKTIV** |

**Notiz für den nächsten Sprint (Georg, 10.8.):** das **alte Fluff-Box-Design von WS1** ist wegen der
**Dreier-Gruppen** der Werte besser lesbar als unsere Sechserzeile (2 × 3 statt 1 × 6, Wert und
Kürzel als Paar). Daraus ein **Best-of** bauen: unsere Kante, unser Papier, unser POP-Knopf — ihre
Gruppierung und ihr POP-Band (»+21 POP to spend →« als ganze Zeile statt nur als Knopf).
Belege: `uploads/Bildschirmfoto 2026-08-10 um 00.47.33.png`.

**Die Nähte.**
(31) **Titel entstehen nur, wenn jemand fragt.** `OW_IDENT.pruefe()` ruft in unserem S10-Stand
niemand (die Titel kamen mit S20). Das Blatt fragt jetzt selbst — **mit dem, was hier bekannt ist**
(geborgene Karten, Ruf) und ohne erfundene Felder (Jagd, Schreie fehlen im S10-Runner).
(32) **Der Name wird an Ort und Stelle geschrieben.** `prompt()` kann in einem eingebetteten Rahmen
unterdrückt werden — dann passiert nichts, ohne eine Zeile Fehler. Ein bearbeitbares Feld kann das
nicht. Dazu: **die Tasten dürfen nicht durchfallen**, sonst läuft der Held mit WASD durch die Welt,
während man seinen Namen tippt.
(33) ⚠ **Zum ZWEITEN Mal: Zustand am Bildtakt** (§4m, Naht 28). `reconcile()` — das, was ein
Kartenblatt vom Textstand auf sein Motiv hebt — stand allein in der rAF-Schleife. Im gedrosselten
Tab lief sie nicht, also blieben Almanach und Quest-Stapel dauerhaft Text, **obwohl das Motiv im
Speicher lag** (gemessen: `OW_ART.art()` antwortete in 0 ms aus dem Cache). Das war Georgs Befund
»almanac cards werden nicht angezeigt«. Jetzt hängt `reconcile()` an der 800-ms-Uhr.
**Merksatz, jetzt zweimal bezahlt: was einen Zustand HEILT, gehört nicht ans Bild.**
(34) **»Unlesbar« darf nicht »für immer« heißen.** Drei Fehlversuche galten als kaputtes Deck, der
Eintrag flog aus der Liste — und drei Fehlversuche sind im Hintergrundtab der Normalfall, weil der
Wachhund von `card-art-2d` zuschlägt. Jetzt: 30 Sekunden Ruhe statt Todesurteil, und **im
versteckten Tab wird gar nicht gezählt** — ein Fehlschlag dort ist eine Aussage über den Tab.
(35) ⚠ **Fünfter und sechster Backtick-Treffer im CSS-Literal**, dazu eine neue Verwandte:
`content:'\00b7'` ist im Template-Literal eine **Oktal-Escape** und damit ein Syntaxfehler
(»Octal escape sequences are not allowed in template strings«). Wirkung wie immer: kein Rail, HUD
sieht heil aus. **Im CSS-Block gehören weder Backticks noch `\0…`-Escapes — Zeichen direkt setzen.**

---

## 4p. Re-Home auf v10-S22 — W1 Schritt null (2026-08-10)

Quelle: WS1-Export `overworld-v10-S22_2026-08-10` (`uploads/Georg's Infinite Canvas (8)/`). Ersetzt den
S10-Stand aus §4i. **Der Fork-Punkt, den `UPDATE_WS0_2026-08-10.md` §4 verlangt** — die HUD-Linie
sitzt jetzt auf dem aktuellen Runner, nicht mehr zwei Slices dahinter.

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld-v10/` (S22-Stand, 50 Module + Font + 3 JSON + `backs/`) | **die neue Basis** | **AKTIV** |
| `overworld-v10/card-backs.js` + `backs/` (4 PNG) | Kartenrückseiten je Zone (V10-S16) | **AKTIV — neu** |
| `overworld-v10/rss-2d.js` | RSS als Plauder-Quelle (V10-S13), Regler standardmäßig **off** | **AKTIV — neu** |
| `overworld-v10/zone-story.js` | Mini-Story je Zone (V10-S17), sechs Anlässe | **AKTIV — neu** |
| `overworld-v10/units-catalog.js` | **nicht ersetzt** — unsere zusammengeführte Fassung (317 Zeilen, §4h/4k). WS1 hat den Diff noch nicht eingebaut | **AKTIV — Diff an WS1** |
| `overworld-v10/hud-v7.js` | **S22-Fassung genommen** + unsere zwei Eingriffe wieder aufgetragen | **AKTIV — siehe unten** |
| `scraps/hud-v7-WS0-preS22.js` | unsere Fassung vor dem Re-Home, als Vergleichsmaßstab | ASSET (klein, behalten) |
| `KFB Pet Studio v4.dc.html` | **das Augen-Rig** — Klärung 4 aus §4n ist damit geschlossen | **AKTIV, fremd — nur lesen** |
| `refs/KFB-Overworld-v10-S22-standalone.html` | offline lauffähig | AKTIV (Referenz) |

**Abnahme 2026-08-10 (echter Bedienweg, Konsole gelesen):** Module **39/39** · **keine Fehlerzeile** ·
Audio **26 Ereignisse, Ansager 12/12** · Relief 7 von 9, **417 ms** kalt · Boden 13/13 Blätter ·
Welt 240×180, **6 Zonen**, 23 Mobs + 8 Wegelagerer · Rückseiten-Satz kfb **4 Blätter** ·
`[rail-v9b] Kartenspalte steht` · Tutorial-Zone besetzt (skull am Tor, pig als Übungsgegner) ·
`[hud-v7] Kanon: kfb-ink-canon.js · opt ja`.
**Kein Warnruf zu `hud-slots.json`** — sie lädt, unser wieder aufgetragener Melder schweigt zu Recht.

**Der `hud-v7.js`-Handgriff, und warum genau so.** WS1 hat die Datei an **sechs** Stellen angefaßt
(12 markierte Blöcke `WS1-Eingriff 9.8.`); unsere S10-Fassung hatte **null** davon — der Diff war real,
nicht die drei Zeilen aus §4i. Also: **S22-Fassung als Basis** (sie trägt die sechs Leser: POP statt
Level, sechs Werte aus `game.STAT_KEYS`, Farben aus `STAT_INFO`, `openPts` am Kontostand, Slot-Preise
aus `popCost`, Name/Titel-Zeile) und unsere zwei Eingriffe darauf neu:
(a) **Zahnrad aus dem Baukasten** — `PA()` fällt jetzt `KFB_PAPER` → `OW_UIKIT.iconSrc` → Glyph,
weil `kfb-paper-atlas.js` im HUD-DC ausgehängt ist;
(b) **`hud-slots.json`-Fehlschlag wird gemeldet** statt in einem leeren `catch` zu verschwinden.

**Die Nähte.**
(36) **Ein Diff, den man nicht sieht, ist keiner.** §4i notierte »zeichengleich bis auf drei Zeilen« —
gemessen war das ein Vergleich gegen S10, nicht gegen S22. Zwischen beiden liegen POP (S6) und
Name/Titel (S20). **Wer »identisch« schreibt, muß dazusagen, gegen welchen Stand.**
(37) **Die Reihenfolge der Skripte ist eine Messung, keine Meinung.** `card-backs.js` steht im
Runner-DC des Exports zwischen `card-ink-2d` und `card-art-2d`, `rss-2d` nach `chatter-2d`,
`zone-story` nach `bubble-ts`. Übernommen wie geliefert — eine umgestellte Abhängigkeit fällt erst
in der Zone auf, nicht beim Start.
(38) **`OW_UIKIT.iconSrc` statt `icon`, weil Chrome beim Anhängen gebaut wird** (§4h Naht 2). Die
messende Variante gibt ein Versprechen; das Zahnrad kann nicht warten.

**Damit offen, und es ist unsere Liste, nicht ihre:** die vier Punkte, die in den neun WS0-Slices
(`UPDATE_WS0_2026-08-10.md` §5) **nicht vorkommen** — Slice C (zwei Ringmenüs, »Go« am 10.8.) ·
Schwert-als-Wappen (»Go«) · Best-of-Statblatt aus §4o (ihre Dreier-Gruppen, unser Papier, ihr
POP-Band) · **die Icon-Pfade** (`overworld/icons-rpg/` ist relativ und bricht im Standalone-Export;
gehört nach `media/2D_Assets/icons-rpg/` mit `OW_SRC`-Routing). Sie gehören in ihre Reihenfolge,
sonst verschwinden sie still.

---

## 4q. Echte Rückseiten, Stapelgröße — und der Crop-Befund (2026-08-10)

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld/card-rail-v9b.js` | Rücken-Stapel nimmt `OW_BACKS` statt `OW_CARD.back()`; überlagert die Insel knapp, vier feste Lagen | **AKTIV** |
| `overworld-v10/card-backs.js` | Pfade lösen relativ zum **Modul** auf, nicht zum Dokument | **AKTIV — Diff an WS1** |

**Gemessen:** `[rail-v9b] Rückseiten kfb 4 geladen 4 gefehlt 0` · `[backs] Satz kfb · 4 Blätter ·
Zonen belegt **6/6** · Varianten 3` (vorher **0/6**, Varianten 1).

**Die Nähte.**
(39) **Ein Modul, das nachlädt, muß relativ zu SICH auflösen.** `card-backs.js` trug
`overworld/backs/…` — dokumentbezogen, also richtig neben WS1s DC und falsch neben unserem
(`overworld-v10/`). Und weil `für()` einen Rückweg auf das alte Einzelblatt hat, wurde daraus
**kein Fehler, sondern eine still falsche Rückseite in allen sechs Zonen.** Dieselbe Klasse wie
`hud-slots.json` (§4g). Behoben über `document.currentScript.src`.
(40) **Das Rail war älter als das Modul.** Es rief `OW_CARD.back()` — das *gezeichnete* Ersatzblatt
mit den Buchstaben »KFB« — weil `card-backs.js` erst mit dem Re-Home ankam. **Wer ein Modul
nachrüstet, muß prüfen, wer bisher seine Aufgabe vertreten hat**; der Vertreter verschwindet nicht
von selbst.
(41) **Unregelmäßig heißt nicht gewürfelt.** Vier feste Lagen (Drehung ·0,6…3,1°, Versatz 0…4 px).
Ein Stapel, der sich bei jedem Aufbau umsortiert, ist keine Handlung.
(41b) ⚠ **Default und Rückweg waren vertauscht** (Georgs Befund 10.8.). Der Satz hieß `kfb` und
führte die vier BLÖDSINN!-Blätter — das sind die Rückseiten des **Anti-Rules-Decks**. Die
Standardrückseite der KFB-Decks ist die **Wortmarke**, und die lag im **Rückweg**
(`card-backside.png`). Sie war damit nur erreichbar, wenn alles andere fehlschlug — also genau
solange, wie die Pfade kaputt waren. **Unser Pfad-Fix hat den Fehler erst sichtbar gemacht.**
Jetzt: `kfb` = Wortmarke (ein Blatt, richtig — ein Deck hat eine Rückseite) · `anti_rules` = die vier
Stempelblätter. Gemessen: `Satz kfb · 1 Blätter · Zonen belegt 6/6 · Varianten 1`.
**Merksatz:** *ein Rückweg, der besser ist als die Vorgabe, ist keine Absicherung — er ist eine
vertauschte Vorgabe.*

**Crop-Befund (Georgs Frage 10.8.) — in `BEFUNDE_fuer_WS1_2026-08-10.md` §4, und dort **korrigiert**:
der Blind-Viertel-Crop ist bei `forget_utopia` **kein** Defekt (Re-Messung 8.8. über Weißraum:
Vollanschnitt, gapX 0,024, Zelle 1,81 — ein stumpfes Viertel liegt ~1 % daneben; der Terrain-Reader
nutzt das Raster laut `_warnung_terrain` absichtlich nicht, V9-B4g). Ursache ist allein **`cover`
statt `fit`**: Zelle 1,81 gegen Sollformat 1,74 beschneidet links und rechts, und dort beginnt der
Titel. Der eigentliche Befund ist **drei Orte für denselben Schnitt** — das Kanon-Dokument (6.8.)
veröffentlicht die 26.7.-Zahlen als gemessen, `card-grids.json` (8.8.) führt sie als widerlegten
Vorgänger, `index.json` soll der einzige Ort sein. **Wir haben aus dem Dokument gerechnet und einen
Umbau angemeldet, den niemand braucht** — zurückgezogen, bevor er rausging.
**Merksatz:** *ein Dokument, das Zahlen abschreibt, wird still falsch, wenn die Messung nachgezogen
wird — Zahlen gehören an einen Ort, Dokumente verweisen darauf.*

---

## 4r. W6 · Ink-Normierung gemessen — und die Sammlung für WS1 (2026-08-10)

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Ink-Normierung.dc.html` | **das Messblatt** — sieben echte Größen, `measureInk` gegen `INK_CHECK`, Ecke in 1:1, Preset und Seed umschaltbar | **AKTIV** |
| `docs/overworld-v10/BEFUNDE_fuer_WS1_2026-08-10.md` | **die Sammlung** für die nächste Runde — wird bis Session-Ende fortgeschrieben | **AKTIV, wächst** |

**Der Befund:** `card` trägt `hb 0.0069` relativ zu `min(W,H)` — daneben aber **`minHalf: 1.2`, eine
absolute Zahl in Pixeln.** Umschlagpunkt **`min(W,H)` = 174 px**, bei AR 1,74 also **Blattbreite
303 px**. Darunter skaliert die Feder nicht mehr.

**Gemessen (Feder in % von min(W,H), Soll 1,20–1,80):** Weltteller 940×540 **1,38** · Blatt-Backe
700×390 **1,38** · Große Vorlage 320×184 **1,56** — alle drei im Soll. Rücken-Stapel 150×86 **2,79** ·
Handkarte 120×69 **3,48** · Almanach-Blatt 87×50 **4,80** · Statleiste 446×69 **3,48** — **vier von
sieben über dem Soll, alle vier unter 303 px.** Bauchung überall sauber (0,32–0,35 gegen Deckel 0,5),
Familie überall `Band`.

**Die Nähte.**
(42) ⚠ **Meine Zuordnung war falsch, der Befund richtig.** Die zu dicke Kante auf der Actor-Karte in
der Welt hatte ich der fehlenden Normierung zugeschrieben — der Weltteller misst **1,38 %** und liegt
im Soll. Die schwere Kante dort kommt aus einer anderen Quelle. **Eine Ursache, die zur Beobachtung
passt, ist noch keine gemessene Ursache.** Steht als offener Punkt in der WS1-Sammlung, ausdrücklich
als Selbstkorrektur.
(43) ⚠ **Ein Vergleich, der Groß- und Kleinschreibung nicht kennt, erfindet einen Fehlstand.**
`measureInk` gibt `Band`, `INK_CHECK` führt `band` — der strenge Vergleich meldete auf **jeder** der
sieben Zeilen »falsche Familie«. Das wäre als Anforderung an WS1 gegangen und hätte dort einen
Umbau ausgelöst, den niemand braucht. Gefunden nur, weil das Blatt die Familie **auch als Wort
anzeigt** und daneben »falsche Familie« stand: *zwei Anzeigen derselben Sache widersprachen sich im
selben Bild.*
(44) **Ein Name, zwei Bedeutungen: `torn`.** Im Masterplan §4.2c ein gewollter künftiger Stil, im
Ink-Kanon §2.4 die Bezeichnung für den gemessenen Fehlstand (`sky-2026-07`, »ein Fehler, kein
Stil«). Vorschlag an WS1: der Stil heißt **`tear`**, `torn` bleibt dem Vergleichsmaßstab.
(45) **Ein hot-reload der Logik führt `componentDidMount` nicht erneut aus.** Der Fix aus (43) war im
Code und nicht im Bild, weil die Messung im Zustand lag. Wer eine Messung im Aufbau rechnet, muss
zum Prüfen **neu laden**, nicht neu zeichnen.
(46) ⚠ **Ein Schlüssel mit `ß` löst in einer Vorlage nie auf.** `'maß'` im Zustand und `{{ z.maß }}`
in der Vorlage — der Pfad-Leser nimmt kein `ß`, die Stelle blieb **leer, ohne Fehler im Bild**.
Wirkung: das Messprotokoll nannte Feder und `min(W,H)`, aber nie die Größe, aus der sie kamen, und
beide Ankermaße — **das Einzige, um das WS1 gebeten hatte** — standen als »Ankermaß « ohne Zahl da.
**Objektschlüssel, die in einer Vorlage gelesen werden, bleiben ASCII.** Deutsche Bezeichner sind im
Code willkommen, in einem Pfad nicht.
(47) **Ein Platzhalter-Durchlauf fordert Bilder an, die es noch nicht gibt.** `<img src="{{ z.png }}">`
lädt in der Platzhalter-Runde wörtlich `%7B%7B%20z.png%20%7D%7D` — ein fehlgeschlagener Ladevorgang
je Aufbau. Jetzt in `<sc-if>` mit `hint-placeholder-val false`.

---

## 4s. Kartenschau — die große Kartendarstellung (2026-08-10)

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Kartenschau.dc.html` | **drei Ansichten, EIN Kartenzeichner**: eine Karte groß · Karussell (max 3) · Almanach mit Blättern. Echte Feder aus `kfb-ink-canon.js`, `fit` statt `cover` | **GEPARKT 10.8.** — siehe unten |

**Geparkt am 10.8. (Georg):** »das ist alles noch sehr unfertig — das sind auch nicht die TS-UI-
Elemente, und Karten sehe ich auch nicht, nur den Text der Rückseite in einem halbfertigen Mix.«
**Der Fehler war der Ansatz, nicht die Ausführung:** eine Kartenschau **ohne echte Karte** kann die
Frage »man kann nichts erkennen« gar nicht beantworten. Gezeichnet wurde der kanonische Textzustand
(§5.1 »Text zuerst«) — richtig als Ladezustand, falsch als Beurteilungsgrundlage. Danach wurde drei
Runden lang Layout um einen Platzhalter herum optimiert.
**Merksatz:** *ein Entwurf, dessen Hauptgegenstand ein Platzhalter ist, prüft nur den Rahmen.*

**Beschluss:** Karten werden **im Window** gezeigt (Georg 10.8.) — das Vokabular steht bereits, damit
ist die offene Frage Größe und Inhalt, kein neues Möbel. Georg gestaltet eine **Design-Vorlage**;
gebaut wird dagegen. Was aus dem Blatt trägt und weiterverwendet wird:
· **`fit` statt `cover`** (Zelle 1,81 gegen Sollformat 1,74 — der Beschnitt frisst den Titelanfang),
· die **Lesbarkeitsschwelle 683 px** und die Regel *unter der Schwelle wird weniger gezeichnet, nicht kleiner*,
· **Untergrund unterscheidet, nicht die Karte** (NEU gegen gesammelt),
· **Ablehnen legt unter den Stapel**, es wirft nicht weg.

Anlass: Georgs Befund »die Karte muss viel größer sein, man kann ja nichts erkennen — das gilt für
alle cards«. **Noch nicht im HUD verdrahtet** — erst die Schau, dann die drei Aufrufer.

**Die drei Entscheidungen, die drinstecken.**
(1) **`fit`, nicht `cover`.** Die gemessene Zelle ist 1,81, das Sollformat 1,74 — mit `cover` läuft
die Breite über und beschneidet links und rechts, und dort beginnt der Titel. Eingepaßt stehen
Titel, POWER und LORE im Bild. **Größe allein hätte nichts geheilt**, sie hätte den Beschnitt nur
größer gezeigt.
(2) **Untergrund unterscheidet, nicht die Karte.** NEU sitzt auf einem eigenen Rahmen mit Stempel,
GESAMMELT liegt als Papierblatt im Buch — **dieselbe Zeichnung, zwei Rahmen**. Später tritt die
TS-Schriftrolle an die Stelle des NEU-Rahmens (Georg: Buch-/BG-Layer).
(3) **Ablehnen heißt nicht wegwerfen** (Georg 10.8.): die Karte geht **unter den Stapel**, die
nächste erscheint zur Aufnahme. Die heutige Rail-Fassung erlaubt genau **einen** Rückweisung
(`declined < 1`) und läßt die Karte am Stapelort ausblenden — das wird beim Verdrahten ersetzt.

**Mindestbreite ist eine Messung, keine Vorliebe:** die Zelle ist 683 px breit gemessen; darunter
fällt die LORE-Zeile unter einen Pixel Strichstärke. Das ist aber ein **Ziel, kein Boden** — siehe
Naht (48).

**Die Nähte.**
(48) ⚠ **»So groß wie es geht« hat zwei Achsen.** Die erste Fassung rechnete nur mit der Breite
(`innerWidth × 0,66`) und hatte 560 px als **harten Boden**. Auf einem flachen Fenster (924×540
gemessen) stand die Entscheidungsfrage — »In den Almanach« / »Unter den Stapel« — dadurch **42 px
unter der Falte**, und das ist die eine Handlung, für die die Ansicht existiert. **Eine Karte, die man
nicht bedienen kann, ist nicht groß, sondern zu groß.** Jetzt wird gegen beide Achsen gerechnet
(Kopfzeile 60 · Polster 82 · Titelblock + Knöpfe 190), und die gemessene Zellbreite ist ein Ziel, das
gegen die Höhe verlieren darf.
(49) **Ein deklarierter Regler, den niemand liest, ist eine Lüge im Bedienfeld.** `startAnsicht` und
`maxBreite` standen in `data-props`, wurden aber nirgends aus `this.props` gelesen — zwei Bedienelemente
ohne Wirkung. Jetzt gelesen, und `ansicht()` fällt erst auf den Regler zurück, **solange niemand im
Blatt umgeschaltet hat**: ein Regler darf eine Wahl des Betrachters nicht überschreiben.
(50) ⚠ **Der erste Höhen-Fix hat den Fehler nur getauscht.** Die Knöpfe standen wieder im Bild — dafür
war die Karte **362 px** breit, also **0,53 × der eigenen Lesbarkeitsschwelle** von 683 px. Gemessen:
**457 px Beiwerk gegen 540 px Fensterhöhe**, die Karte bekam 208 px Höhe. **Wer eine Grenze
aufschreibt und dann dagegen zeichnet, hat die Grenze nicht.**
(51) **Die teuerste Zeile war eine Wiederholung.** Unter der Karte stand »The Missing Receipt« — 38 px
unter demselben Titel, den `malKarte` in die Leinwand schreibt. Der Block kostete mit seinen Lücken
**121 px Höhe, also rund 210 px Kartenbreite**. Zustandszeile und Knöpfe stehen jetzt in **einer**
Reihe. *Eine Beschriftung, die das Bild wiederholt, bezahlt der Betrachter in Größe.*
(52) **Jede Ansicht hat ihr eigenes Budget.** Ein fester Abzug ließ das **Buch** für eine Knopfreihe
zahlen, die es nicht hat — in genau der Ansicht, die »möglichst groß« im Auftrag trägt. Jetzt je
Ansicht gerechnet; die Fußnote darf unter die Falte, weil sie Prosa ist und keine Bedienung.

**Offen und benannt:** der NEU-Untergrund ist noch aus CSS gebaut. Georgs Vorgabe ist die
**TS-Schriftrolle/das Banner als Buch-/BG-Layer** — `overworld/ui-kit-ts.js` (uikit-v1.5, 99 Teile,
darunter die zwei hängenden Banner und dehnbare Schriftrollen) ist in diesem Blatt **nicht geladen**.
Nächster Schritt, sobald die Schau trägt.

**Die zweite Runde — und hier lag die eigentliche Ursache.**
(53) ⚠ **Was Platz braucht, muss in der Box stehen.** Alle drei Rahmenlagen waren
`position:absolute` mit negativem Versatz — die Wrapper-Box war damit **exakt die Leinwand**
(gemessen 612×352 bei 30 px Überstand). Die Flex-Spalte hat den Überstand nie gesehen, also war
**jede** gerechnete Lücke um genau ihn zu kurz, und die Knopfreihen lagen auf dem Rahmen (schau 4 px,
buch 16 px). Drei Runden Zahlendrehen hätten das nie geschlossen, weil die Zahl nicht der Fehler war.
Jetzt trägt der Wrapper **echtes Polster** und die Rahmen liegen darin (`inset` statt negativ) —
gemessen: Wrapper 616×388, kein Überlapp.
(54) ⚠ **Eine Zahl an zwei Orten, dritter Treffer dieser Klasse.** `budget().oben` stand auf 14, die
Vorlage auf `padding:50px` — die Breite rechnete gegen ein Polster, das es nicht gab, und die
Knopfreihe stand 24 px unter der Falte. Beide Zahlen sind jetzt gleich, mit Verweis aufeinander im
Kommentar. **Die Vorlage kann die Logik nicht lesen; darum muss der Kommentar es tun.**
(55) **Ein Karussell ist keine Reihe Daumennagel.** Drei gleich große Blätter zu **212 px** — 0,31 ×
der eigenen Schwelle — während 170 px Fensterhöhe leer blieben, weil `unten` 150 px für eine
**Fußnote** reservierte, die laut eigener Regel unter die Falte darf. Jetzt Mitte 536, Flanken 342
hinter der Mitte eingesteckt.
(56) **Unter der Schwelle wird WENIGER gezeichnet, nicht kleiner.** Eine knappe Karte (Zelle < 470 px)
trägt Titel und POWER in gröÞrem Grad und lässt Lore und Bildunterschrift weg. Text zu setzen, den
niemand lesen kann, ist die »Behauptung von Lesbarkeit«, gegen die dieses Blatt gebaut ist.

**Gemessen bei 924×540 (Vorschaugröße, also der schlechteste Fall):** Karte **560 px** (0,82 × der
Schwelle), Knopfreihe endet bei 528 gegen die Falte bei 540. Auf einem normalen Fenster (Höhe 900)
läuft die Rechnung auf 1186 px und wird von der Breite gedeckelt — die Schwelle ist dort kein Thema.

---

## 4t. Große Karte in der Welt · Glossar-Abgleich (2026-08-10)

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld/card-rail-v9b.js` | große Vorlage mit `fit` statt `cover`; Kürzel aus dem Kanon | **AKTIV** |
| `github.md` | Repo-Anbindung `georg-doc/kayfabizarro`, Zweig `main`, Pfad `overworld` | **AKTIV** |

**Die Karte in der Welt.** `bigW` stand auf `min(320, max(200, Breite × 0,26))` — eine Briefmarke auf
einer Fläche, die ein Vielfaches hergibt (Georgs Markierung im Bild). Jetzt gegen **beide** Achsen:
`max(320, min(Breite × 0,56, Höhe × 0,58 × 1,74))` — bei 1850×1500 sind das **1036 px statt 320**.

**Und der Grund, warum nur das Bild zu sehen war:** `artSheet` rechnet
`Math.max(W/aw, H/ah) × OVERSCAN` — **cover mit Überschuss**. Auf einem Daumennagel ist das richtig
(sonst steht Papier neben der Briefmarke), auf der großen Vorlage schneidet es Titel, POWER und LORE
weg, die auf der gedruckten Zelle **stehen**. Jetzt zwei Passungen: `fit` für die Vorlage (Kanon §3,
Rest cremefarben innerhalb der Feder), `cover` für die Blätter im Rail.
**Merksatz:** *zwei Absichten, zwei Passungen — dieselbe Funktion für Briefmarke und Vorlage ist eine
Entscheidung, die niemand getroffen hat.*

**Glossar-Abgleich** (`overworld/docs/GLOSSAR_KFB.md`, Stand 10.8.) — es enthält eine ausdrückliche
WS0-Regel, und wir haben sie verletzt:
· **Zwei-Buchstaben-Kürzel fallen weg.** Unser Statblatt zeigte `BZ KF BI BO BG BS`; Kanon ist
  `Biz · Kay · Bin · Bon · Bog · Blö`. Behoben, gemessen: `Biz 3 Kay 2 Bin 1 Bon 1 Bog 1 Blö 0`.
· **Warum drei Buchstaben:** ein Schnitt aus dem Etikett ergäbe bei Kayfabe/KayfaBingo/-Bongo/-Boggle
  **viermal »Kay«**. Deshalb führt der Runner ein eigenes Feld `short`; wir lesen es und haben die
  Kanon-Kürzel nur als Rückweg.
· Etiketten und IDs waren bereits kanonisch (`bingo` → KayfaBingo usw.), ebenso `Newbie` und
  `Leichenfledderer`.
· **Papierseitig nachzuziehen:** die Eskalationsstufen der Schmährufe heißen seit 10.8. `P1`/`P2`;
  `K1`/`K2` gehören allein den Kanon-Regeln. Betrifft nur Dokumente, keinen Code.

**Die Nähte.**
(57) ⚠ **`game` ist kein Global.** Mein erster Anlauf suchte `window.game` — der Runner reicht sich
aber nur in `install(game, sh)` herein. Der Ausdruck fiel still auf den alten Wert zurück, das Blatt
zeigte weiter `BZ KF BI`, **ohne eine Zeile Fehler**. Jetzt wird der Runner übergeben, nicht gesucht.
Dieselbe Klasse wie das leere `catch` und der `ß`-Schlüssel: *etwas, das aussieht, als würde es
funktionieren.*
(58) **Ein Kürzel, das aus einem Etikett geschnitten wird, gehört niemandem.** Der Kanon hat dafür
ein eigenes Feld bekommen, weil eine Etikettänderung sonst still vier Anzeigen zerstört hätte.
(59) **Die äußere Grabenlinie ist ein Strich, keine Feder — und der Beweis ist die Streuung.**
An Georgs Bild gemessen (fünf senkrechte Proben): Kartenfeder **27–49 px** (Taper und Lichtlogik,
also ein Band), Grabenlinie **9–10 px über 1864 px praktisch konstant**. *Eine Linie ohne Streuung
ist kein Band.* Verhältnis gemessen **0,25**, §4.2b verlangt **0,45** — also ist nicht die Karte zu
dick, sondern die Nachbarin zu dünn. Beides Runner-Gebiet (`gutter-2d.js`, `drawCardPlate`);
**hier nicht gefixt**, sondern in `BEFUNDE_fuer_WS1_2026-08-10.md` §7 zurückgegeben. Ein Fork des
Runners wäre genau die Divergenz, gegen die §6 des Masterplans geschrieben ist.
(60) **Ein Fächer aus einer Karte ist eine Karte.** Almanach- und Quest-Stapel sind vorhanden und
sichtbar (gemessen: beide `.r9pile`, 87×50, je ein Kind) — sie sehen nur nach nichts aus, solange je
eine Karte darin liegt. Slice C (zwei Ringmenüs) ist das, was daraus wird.

---

## 4u. Overworld v11 — HUD-Statblatt, dreißig spielbare Einheiten, Flugkörper (2026-08-11)

Fork von `KFB Overworld v10.dc.html` (Basis v10-S22, §4p) mit den drei WS0-Reparaturen aus dem
WS1-Handover: `anim-clock` MIN_SLIP 7 · `mob-ai` Lauf-Hysterese 34/16 · Rücksprung auf Bild 0 raus.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v11.dc.html` + `overworld-v11/` (60 Module + Font + `backs/` + `icons-rpg/` + 3 JSON) | Fork-Basis für v12 (§4v) | **SUPERSEDED von v12 — nicht löschen** (Vergleichsmaßstab) |
| `overworld-v11/shots.js` (shots-v1.0) | **neu** — alles, was fliegt: eine Bahn für Held und Gegner, Ausrichtung und Bilderzahl am Blatt gemessen, Bogen aus dem Katalog | **AKTIV — an WS1 anbieten** |
| `overworld-v11/reach.js` | eine Reichweite für Held und Gegner, aus beiden Körpern gerechnet | **AKTIV** |
| `overworld-v11/game-feel.js` (gf-v1.3) | + `bodyFactor()` als fünfter Tempofaktor · Lebensfarbe (fünf Stufen, unter ⅓ rot) für HUD **und** Weltbalken | **AKTIV — Diff an WS1** |
| `overworld-v11/unit-loader.js` | + `bump` (kein Angriffsclip → Laufstreifen als Rempler), gemessen statt gepflegt | **AKTIV — Diff an WS1** |
| `overworld-v11/units-catalog.js` | unsere zusammengeführte Fassung + `shot:{speed,arc}` (4 Einträge) + die korrigierte Zahl **30** | **AKTIV — Diff an WS1, seit §4h offen** |
| `overworld-v11/roster-sheet.js` (roster-v1.1) | Wahlblatt **ist** Messblatt: Körper, Bilder je Animation, Rempler, Wurfart, Tempo — je Kachel, plus Summenzeile | **AKTIV** |
| `overworld-v11/overworld-game-v10.js` · `mob-ai.js` · `card-rail-v9b.js` · `identity.js` · `anim-clock.js` | Runner + KI + HUD, diese Session geändert | **AKTIV — Diff an WS1** |
| `docs/overworld-v11/HANDOVER_WS0_2026-08-11.md` | **Onboarding für frischen Chat (§A) + Diff an WS1 (§B) + Nähte 61–66 (§C)** | **AKTIV, maßgeblich** |
| `KFB Overworld v10.dc.html` + `overworld-v10/` | Fork-Basis, WS1-Lead-Stand | **SUPERSEDED von v11 — nicht löschen** (Vergleichsmaßstab) |

**Abnahme 2026-08-11 (im laufenden Spiel gemessen, Konsole + Zustand):** keine Fehlerzeile ·
`OW_SHOTS` shots-v1.0 / `OW_FEEL` gf-v1.3 / `OW_ROSTER` roster-v1.1 geladen · Wahlblatt füllt
**30/30** Kacheln: *30 gemessen · 28 mit Hieb · 2 Rempler · 5 mit Wurf · 23 mit Porträt* ·
Tempo Schaf 31 px → **205 px/s**, Warrior 91 → **250**, Troll 177 → **305** · Heldenpfeil trifft den
Schädel nach 0,42 s auf 270 px (34 → 22 HP, Rückstoß 102 px/s) · Gnoll-Knochen steigt 30 px und
nimmt 7 HP. **Bild-Abnahme entfällt** — im gedrosselten Vorschaufenster kommt kein Frame (Naht 66).

**Die Nähte 61–66** stehen im Handover §C: Radius gegen Fußpunkt · Katalogdatum ohne Leser ·
gleiches Tempo macht die Auswahl zum Kostüm · Rempler statt Schlag in die Ruhe · ein Etikett
überlebt seinen Anlass · der gedrosselte Rahmen zeigt nichts.

**Entschieden am 11.8., noch nicht gebaut** (die Reihenfolge steht im Handover §A):
(1) **Wasser KISS** — eine Streufarbe je Fluid-KÖRPER (Säure-See = ein Giftgrün; flach/tief kommt
aus der Tiefe, nicht aus einer zweiten Farbe), Gradienten statt Höhenfeld, inkommensurable
Richtungen, Steigung als geführte Zahl.
(2) **Ink-Outline als System** — Stärke trägt, Farbe bestätigt; schwarz+dick = Sperre,
farbig+dünner = passierbar; Outline-Farbe **abgeleitet** (`inkOf(terrainfarbe)`), nie gewählt; das
Gummiband reagiert nur auf Schwarz; eine schwarze Linie wird **nie unterbrochen, nur überdeckt** —
die Holzbrücke ist die Tür.
(3) **Gummiband greift zu früh** — Hypothese: Trigger an der Feldgrenze, Tusche mit eigener
Verjüngung. Fix wie `reach.js`: eine Kontur, zwei Leser. **Vor dem Bauen messen.**
(4) Linienstärken (fällt mit 2 zusammen) · (5) Sprechblasen mit Level · (6) sieben Einheiten ohne
Porträt — **kein Sprite-Kopf als Ersatz** (Georg 11.8.).

**Pfad-Hygiene:** vier relative Ressourcen in `overworld-v11/` — `fonts/pottymouthbb_reg.otf`
(53 kB), `backs/*.png` (4 × ~340 kB), `card-backside.png` (**1,0 MB**), `icons-rpg/*.svg` (11, 16 kB).
Alle unter dem 2-MB-Budget, deshalb im Export drin; ins Repo mit `OW_SRC`-Routing gehören sie
trotzdem (offen seit §4p).

---

## 4v. Overworld v12 — Slice 1 »Wasser KISS« (2026-08-12)

Fork von `KFB Overworld v11.dc.html` (Stand §4u). Der Runner ist beim Fork **nicht** angefaßt
worden; die drei Änderungen unten kamen mit dem Slice.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v12.dc.html` + `overworld-v12/` (75 Module + Font + `backs/` + `icons-rpg/` + 3 JSON) | **der Arbeitsstand** | **AKTIV — main der 2D-Linie** |
| `overworld-v12/water-kiss.js` (water-v2.0) | **neu** — eine Streufarbe je Fluid-Körper, **harte** Glanzformen (keine Rampe), Schwelle je Ort moduliert (Formen unterscheiden sich), **gestuftes Morphen** in zwei Folgen (7/9), Schelf am Ufer, RMS-Neigung als geführte Zahl. **Drei Formfamilien als Schalter** (`waterForm`: kleckse · striche · schlieren) — Georg entscheidet | **AKTIV — an WS1 anbieten** |
| `overworld-v12/terrain-paint.js` (tp-v4.6) | `drawWater` delegiert an `OW_WATER`; behält nur Clip und Ausschnitt. Alter Rauschweg bleibt als Rückfall | **AKTIV — Diff an WS1** |
| `overworld-v12/overworld-game-v10.js` | `paintOpt` trägt `fluid` + `nah`; `drawWater` steht jetzt **hinter** der Fluid-Schicht | **AKTIV — Diff an WS1** |
| `docs/overworld-v12/SLICE_wasser-kiss_2026-08-12.md` | Entscheidung, Bauart, Wellentabelle, Diff, Nähte 67–70, Abnahme | **AKTIV, maßgeblich** |
| `KFB Overworld v11.dc.html` + `overworld-v11/` | Fork-Basis | **SUPERSEDED von v12 — nicht löschen** |

**Abnahme 2026-08-12 (Konsole, echter Bedienweg):** `[water] water-v1.0 · RMS-Neigung 4° · Kachel
maxAlpha 230/255, Deckung 32,8 %` · Module **39/39** · **keine Fehlerzeile** · Audio 26 / Ansager
12/12 · Relief 7 von 9, 412 ms kalt · Boden 13/13 · Welt 240×180, 6 Zonen, 23 Mobs + 8 Wegelagerer ·
Rückseiten kfb 1/6 Zonen belegt · `[rail-v9b] Kartenspalte steht`.
**Der Wasserzweig getrennt:** er hängt an `nah` (`zoomEff()/dpr ≥ 0,7`) und läuft in der
**Standardansicht nicht** (1/2 = 0,5 — Bestand seit v10-S1f). Mit erhöhtem Zoom gemessen:
`drawWater` **20 Aufrufe in 800 ms** mit `{fluid:'wasser', nah:true}`, Streufarben je Fluid richtig.
**Bild-Abnahme entfällt** — im gedrosselten Vorschaufenster kommt kein Frame (Naht 66).

**Die Nähte 67–72** stehen im Slice-Blatt §3:
(67) **eine Schicht, die zugedeckt wird, ist keine Schicht** — das Glitzern lag vor dem Land, die
Fluid-Schicht deckt es mit 0,82 zu: 18 % blieben übrig · (68) **weiß ist keine Farbe des Körpers** ·
(69) **kachelbar und inkommensurabel schließen sich nicht aus** — der Cord-Befund lag nicht am
Sinus, sondern an zwei kommensurablen Perioden · (70) **eine Neigung, die niemand führt, wandert** ·
(71) ⚠ **eine Schranke ist keine Verteilung** — die Rampe normierte gegen die Summe aller vier
Wellen und traf damit fast nichts (maxAlpha 30, Deckung 0,5 %: die 5-von-255-Klasse aus
`terrain-paint.js` §449, ein zweites Mal); jetzt gegen das P98 des wirklichen Feldes ·
(72) **ein Slice, der nur im Boot-Log abgenommen wird, ist nicht abgenommen.**

**Nachtrag 12.8. — warum das Wasser trotzdem aussah wie vorher (v12-W1c):** der ganze Zweig hing
seit v10-S1f an `nah` (`zoomEff()/dpr ≥ 0,7`); bei **dpr 2** ist die Standardansicht 0,5, es wurde
also **nie** gezeichnet. Sperre raus, Aliasing dort behandelt, wo es entsteht: der Kachelmaßstab hat
eine Untergrenze (ein Quellpixel nie unter 0,6 Gerätepixel).
(73) **eine Sperre gegen ein Bildfehler-Risiko ist auch ein Ausschalter.**

**HUD-Runde 12.8.** (`card-rail-v9b.js`, vier Befunde von Georg):
(74) ⚠ **`document.activeElement` hört an der Schattengrenze auf** — »R« öffnete das Roster beim
Namenstippen, obwohl die Abfrage da war; sie sah den Wirt statt des Feldes. Betrifft nur
capture-Tasten · (75) **ein Dreieck von 9×6 px ist kein Ziel** — Trefferfläche 31×28, Zeichnung
unverändert · (76) **eine feste Zahl kann nicht ausweichen — und eine spätere feste Zahl schlägt
sie**: der erste Anlauf wirkte an einer von vier Stellen (`.r9stat.slim .sheet` war spezifischer,
der Avatar bekam seine Größe inline aus dem JS); jetzt drei Stufen, **nicht** per `transform`
(Canvas-Kante, §4h Naht 7) · (77) **Selbstkorrektur** — die Behauptung »das Logbuch ist
`pointer-events:none`, also war sein `:hover` tot« ist **falsch** (gemessen: `auto`, Hover feuert).
Geblieben ist ein 22-px-Saum; **warum Georg nichts sah, ist offen und benannt.** ·
(78) ⚠ **siebter Backtick-Treffer im CSS-Literal** — im Kommentar, der die Regel erklärt; das Rail
fiel komplett aus, Boot-Log unauffällig. **Abnahme des Rails ist die Zeile `[rail-v9b] Kartenspalte
steht`, nicht der Boot-Log** — eine fehlende Zeile sieht man nur, wenn man sie benannt hat.

**water-v2.0 (12.8., nach Georgs Bild):** (79) **der Betrag eines Gradientenfeldes ist ein
Höhenzug — also Aale**, und eine weiche Kante ist Airbrush in einem Bild, das überall Tusche
trägt · (80) **ab da war es eine Bildentscheidung, keine Ingenieursfrage** — vier Tuningrunden
tauschten nur Artefakte; die drei Formfamilien stehen jetzt als Schalter `waterForm`
(kleckse 9,9 % · striche 7,6 % · schlieren 4,8 % Deckung), **Georg entscheidet** · (81) **eine
Vorzugsrichtung ist kein Cord, ein messbarer Abstand schon.**
Runner-Diff dazu: ein Attribut `water-form` (observedAttributes + eine Zeile im Callback).

**Stand 12.8. abends: das Glitzern steht auf `aus`.** (82) **zwei Bewegungen, die sich
widersprechen, liest man als Ruckeln** — die Lage driftet stetig, die Form springt alle 0,38 s;
Georg sah Konfetti und vermutete ein Performance-Problem · (83) **wo das mentale Modell fehlt,
gehört kein Entwurf hin** — die Fluid-Schicht des Waber-Shaders zeichnet wieder allein, Gerüst und
Formfamilien bleiben über `waterForm` erreichbar. **Offen: Referenzen für Cartoon-Wasser** (Georg
recherchiert Shader mit klarem Vorbild).
Dazu aus derselben Runde: POP-account-Zeile raus (Ballast; Weg zurück: `ACCT_ZEILE`), Fluff-Balken
läuft wieder bis an seine Zahl, Avatar-Polster +14 px.

**Karten-Zone und Kamera (12.8., dritte Runde):**
(84) **wer eine Kamera an eine Uhr hängt, hat eine Kamera, die sich selbst bewegt** — das
zeitgesteuerte Überblenden auf die Blattmitte plus die Dämpfung darunter waren zwei geschachtelte
Glättungen (Georgs »springt/schwimmt«); ersetzt durch eine **geometrische Klammer**, die das Blatt
im Bild hält · (85) **ein Moduswechsel, den der Spieler nicht ausgelöst hat, liest sich als
Defekt** — das Blatt schaltete das HUD auf `minimal` (V9-B3b); der Grund (HUD deckte die obere
Kartenreihe) ist seit dem Rail-Umbau weg, der Griff war geblieben · (86) **Requisiten dürfen
überlappen, Einheiten nicht** — `aufBlatt()` als eine Abfrage für drei Säher, gemessen 42 Mobs /
**0 auf dem Blatt**.
Runner-Diff wächst damit um: Kamerazweig, `stepReader`, `spawnPoints`, `spawnCritters`,
Tutorial-Gegner, drei gelöschte Konstanten.

**Fluff-Zeile neu gelegt (12.8., vierte Runde):** obere Zeile gehört Name und Titel (Titel darf
umbrechen, keine Ellipse mehr), darunter Balken + Zahl + FLUFF als Gruppe, dahinter abgesetzt POP.
(87) **ein Element, das nur wegen seiner Stabilität irgendwo sitzt, bezahlt die anderen dafür** —
POP hielt seit v11-H5 die Namenszeile besetzt; das feste Raster in `.hp` ist durch eine
Mindestbreite an der Zahl ersetzt · Ausfahr-Verzögerung 260+500 ms → 90+220 ·
(88) ⚠ **achter Backtick-Treffer**, diesmal zwei Stück im erklärenden Kommentar selbst: `TypeError`
statt `SyntaxError`, gleiche Wirkung (kein Rail, HUD sieht heil aus).

**Statblatt als Unit Frame (12.8., fünfte Runde) — `docs/overworld-v12/KONZEPT_statblatt_2026-08-12.md`:**
(89) **ein Layout über Budget sieht nicht schief aus, sondern kaputt** — gemessen: Inhaltsspalte
176 px, gebraucht 204; die POP-Gruppe stand 16 px über dem Papierrand, und der Balken konnte nicht
wachsen, weil er auf seinem Minimum saß. Vier Runden Ausrichtungsregeln waren deshalb wirkungslos ·
(90) **die Bauform aus WoW/RPG löst es strukturell**: die Werte liegen IM Balken, nicht daneben —
eine Zeile, ein Kind, kein Streit um Breite. Drei Zeilen (Name/Titel · Fluff-Balken · POP-Platte),
alle gleich breit. Gemessen nach dem Umbau: **168/168/168 px, Überlauf 0, Polster rechts 20** ·
(91) **eine Mindestbreite am flexiblen Stück ist keine Lösung, sondern eine Überlaufgarantie.** ·
(93) **wer eine gute Anordnung wegen eines Platzproblems ersetzt, tauscht eine Stärke gegen eine
Zahl** — der Unit-Frame-Umbau ist zurückgenommen, die v11-Fluffbox steht zeichengleich wieder da
(Blatt 446/434, Avatar 108, Polster 132, Balken 118; keine Variablen, keine Media Queries).
Geblieben: deckendes Papier, `--pad` 13…22, Trefferfläche am Titel-Dreieck, POP-account-Zeile weg,
Logbuch so hoch wie sein Inhalt.

**Slice J1 · Die Journey speichert die Einheit (12.8.):** Schema **2.3.0 → 2.4.0** (`hero.unit`,
Katalogschlüssel ohne `hero_`-Präfix, alte Stände `null` = nie gewählt).
(94) **ein Spielstand, der die Wahl nicht kennt, macht die Wahl zur Dekoration** — 30
unterscheidbare Einheiten waren genau eine Sitzung lang unterscheidbar ·
(95) **zwei Kennungen für dieselbe Einheit, und nur eine passt ins Attribut** (Loader `hero_bear`,
Katalog `bear`) — die falsche zu speichern gibt still wieder eine gewürfelte Einheit.
Abnahme: Held `hero_gnoll` → Save `unit:"gnoll"`, geschrieben und zurückgelesen gleich, 6 Zonen,
Export/Import über das Tagebuch (J).
**Brücke (v12-B1):** zwei Felder statt einem (sie endete auf den beiden Panel-Linien), Tor-Loch im
Graben raus (daher das grüne Gras darunter) — die Linie wird überdeckt, nicht unterbrochen. ·
(92) ⚠ **»Papier ist Papier, kein Glas« — zum ZWEITEN Mal** (§4h Naht 11): das Statblatt lief wieder
auf der gemeinsamen Rail-Sichtbarkeit (0,78) mit, das Gras schien durch und ein Prop stand im
Namen. Die Regel war seit 9.8. da und ist beim Umbau verlorengegangen; sie steht jetzt im selben
Block wie das übrige Statblatt-Layout. Gemessen: **Deckkraft 1, Papier rgb(226,215,192), voll
deckend.** *Eine Regel, die nicht bei ihrem Gegenstand steht, überlebt dessen nächsten Umbau nicht.*

**Offen, Reihenfolge unverändert:** (2) Ink-Outline als System · (3) Gummiband greift zu früh
(**vor dem Bauen messen**) · (4) Linienstärken · (5) Sprechblasen mit Level · (6) sieben Einheiten
ohne Porträt.

**Wartet auf Sign-off, nicht gelöscht:** `scraps/`-Prüfbilder aus §4k/§4l · die tote `.no`-Regel in
`roster-sheet.js:48` (das Etikett dazu ist mit Naht 65 gefallen).

---

## 4w. Travel v15 — Flug-Sprint (Fork 2026-08-12 aus v14/S94a)

Auftrag Georg: Controls, Gameplay, **Flug- und Manöverdynamik**; erste Bedingung *„boden-kontakt
sollte nicht in den walk mode wechseln"*. **Blueprint und Benchmark:**
`github.com/dannylimanseta/tinyskies` (Zweig `cursor/globefly-multiplayer-globe-flight-game`) —
ein Mehrspieler-Flugspiel auf einer Kugel; unser Maßstab ist dort der **fliegende Teppich**
(`client/src/game/Carpet.ts`), weil er unser Fahrzeug ist: trägt eine Figur, schwebt über Gelände,
vier Tasten.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel v15.dc.html` + `terrain-v15/` (56 Module + `edge3.jpg` + 4 JSON) | Fork-Basis für v16, Vergleichsmaßstab | **FROZEN seit 2026-08-12** |
| `terrain-v15/flight-controller.js` (**fc-v2.0**) | die Fahrdynamik: Kurs als Zahl, exponentielle Zeitkonstanten, Traktion & Drift, Kurvendeckel, Kufe | **AKTIV — der Gegenstand des Sprints** |
| `terrain-v15/travel-poc.js` | Runner. **Zwei Zeilen geändert:** `autoMode = false` (F0) und `input.noDrift` (F1). Fork-Stempel im Kopf | AKTIV |
| `terrain-v15/settings-schema.js` | Panel-Block *Fahrdynamik* (12 Regler + Messanzeige), Steuerungstabelle neu | AKTIV |
| `docs/travel-v15/SPRINT_travel-v15.md` | Fahrplan **F0–F6**, drei Prinzipien, was NICHT gemacht wird, Clean-Run | **AKTIV, maßgeblich** |
| `docs/travel-v15/BENCHMARK_tinyskies.md` | **der Lesebericht**: fünf gelesene Dateien, Tabelle übernommen/abgewandelt/gelassen mit beiden Zahlensätzen | **AKTIV, maßgeblich** |
| `docs/travel-v15/CHANGELOG_v15.md` | additiv nach oben, jede Änderung mit Zahl, Nähte 96–100 | **AKTIV** |
| `KFB Travel v14.dc.html` + `terrain-v14/` | Fork-Basis, Vergleichsmaßstab | **FROZEN** — nicht weiterbauen, nicht löschen |

**Was der Sprint entschieden hat.** (a) **Bodennähe ist ein FAHRZUSTAND, kein Zustandswechsel** —
im Vorbild schwebt der Teppich über der Oberfläche, „Boden" bedeutet dort gar nichts. Bei uns war
Bodenkontakt beides, und die Hälfte der `mode-owner`-Regeln existierte nur, um die Fälle
auszunehmen, in denen es das nicht sein sollte. *Eine Regel, die man dreimal ausnehmen muß, ist
keine Regel.* (b) **Zahlen aus dem Vorbild kommen mit Herkunft oder gar nicht** — übernommen sind
Raten (1/s) und Verhältnisse, nie Absolutwerte (tinyskies rechnet auf Weltradius 5).
(c) **Was Geschmack ist, wird ein Regler** — Haftung, Rutschwinkel-Deckel, Kurvendeckel, Kufe und
Kissenhöhe stehen im Panel; **Georg entscheidet am Regler**, dasselbe Verfahren wie `waterForm`
in §4v.

**Nicht übernommen, mit Grund:** die **geländefolgende Höhe** des Vorbilds. Karten, Zonenring
(»Bodenluft«) und Anflug hängen bei uns an ABSOLUTEN Höhen — geländefolgend wäre eine zweite
Höhen-Wahrheit neben der Registry. Übernommen ist die **Kufe** (ein Kissen über dem Boden), nicht
das Prinzip.

**Abnahme 2026-08-12 (im laufenden Spiel, `flight.update` direkt getaktet):**
`[travel-v15] fc-v2.0 · Drift an · Kurvenwiderstand 0.12 · Kufe 6 · Modus folgt der Höhe: nein` ·
`mgr.runStep('fade'|'vehicle')` → **true** · `__loopErr` **null** · `__bootErrors` **2** (die zwei
leeren `SCRIPT`-Einträge, die v14 genauso hat) ·
`modeOwner.request('walk','altitude')` → **abgelehnt, `höhe-abgeschaltet`**, `'hand'` → **ok**
(hin und zurück) · Vollgas geradeaus **42,00 u/s**, in voller Kurve **36,96** (−12 %), im Boost
wieder **42,00** · Rutschwinkel volle Kurve **40°** (Deckel), halbe Kurve **10°**, 0,5 s nach X
**13°** · Kufe an: min. Bodenabstand **2,86 u / 0 Klemm-Bilder**, Kufe aus: **2,20 u / 86** ·
Schwebehöhe über flachem Boden **3,46 u** · Bildratenspanne 120↔30 fps über 4 s Kurvenflug:
Ort **0,72 / 0,58 u** auf 38,6 u Weg, Tempo **38,05 gegen 38,06 u/s**.

**Die Nähte 96–100** stehen im Changelog: (96) ein Abzug am Soll, den eine gehaltene Taste im
selben Bild auffüllt, ist kein Widerstand (gemessen 0 %) · (97) ein Rutschwinkel ohne Deckel ist
Lenkrate ÷ Haftung = 78° — eine fremde Zahl trägt die fremde Streckenlänge mit · (98) eine Kufe,
die das SOLL nachzieht, ist langsamer als die Klemme, die sie ersetzen soll (86 Klemm-Bilder mit
UND ohne) · (99) ⚠ »am Boden« mußte umdefiniert werden, sonst hätte der Umbau still `landed`
unmöglich gemacht und damit den v14-Rückweg getötet · (100) ⚠ ein Modul ohne Versionsstempel in
der URL wird aus dem Cache bedient — zwei Meßrunden lang wurden Zahlen eines Codes gemessen, der
so nicht mehr im Projekt stand.

**Offen (Georg am Regler, Reihenfolge im Sprint §4):** Haftung normal 5,0 bedeutet **21,8°
Dauer-Schräglauf** in jeder normalen Kurve — Vorbildzahl, aber Geschmack · Rutschwinkel-Deckel 40° ·
Kurvendeckel 12 % · Schwebehöhe 3,46 u (damit setzt das Pad nie mehr auf — soll es das können?) ·
**F2 Boost-Grammatik** (Dauertaste oder Belohnung — das ist Spieldesign, keine Zahl).

**Blockiert, und nicht durch uns:** der **Standalone-Export** (Naht 101). Der Bundler verliert bei
jedem Einstiegs-Modul die erste relative Abhängigkeit und meldet den Fehler beim Nachbarn; sieben
Umgehungen gemessen, alle gescheitert. Die Overworld-Linie ist nicht betroffen (klassische
`<script src>` statt ES-Module) — deshalb gibt es dort Standalone-Fassungen und hier keine.
**Ersatz:** der Manifest-Export läuft offline über jeden statischen Server.

**Noch nicht gebaut:** F2 Boost · F3 Kamera am Tempo (FOV 60→80, `closeDamp`) · F4 den Drift
SEHEN (unsere Streifen hängen am Facing, nicht am Rutschwinkel) · F5 benannte Manöver · F6 Touch.

---

## 4x. Travel v16 — Landschaft · L1 »Stufung« + L2 »Farbwelten« + L2d »Ringwellen« (Fork 2026-08-12 aus v15)

Auftrag Georg: wechselnde Landschaften (Farben, Terrains, Farb-Instanzierung nach
`three.js/examples/webgl_instancing_dynamic`), **1/6-Stufung der Voxel-Höhen** für Steigungen und
Senken **neben** hohen Klippen, später **Kenney-3D-Props** statt der grauen Platzhalter-Blöcke
(Katalog `media/3D_Assets/CATALOG/catalog.json`: 2538 Assets, 33 Packs, mit `size` und
`footprint_xz`). Drei Slices, nacheinander — L1 steht, L2 und L3 sind offen.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel v16.dc.html` + `terrain-v16/` (56 Module) | **die Reise, Arbeitsstand** | **AKTIV — main der Travel-Linie** |
| `terrain-v16/voxel-terrain.js` | die Stufung: Reliefkarte → vier Stufengrößen; `stepAt` · `reliefAt` · `setStepping` · `stepReport` | **AKTIV — der Gegenstand von L1** |
| `terrain-v16/color-worlds.js` (**cw-v1.0**) | **die Farbwelten (L2)** — `regionAt` (Ort → Palette), Weltwürfel, Atem, `rotateStops`/`guardStops`. **Null Zeilen GLSL**: der Shader konnte die Front seit v3 | **AKTIV** |
| `themes/kfb-shell.css` | **die Bühne, EINMAL** — von `index.html` und dem DC per `<link>` eingebunden; der TEXT der Meta-Zeile kommt aus `SHELL_META` im Runner. Vorher lagen die Regeln inline in beiden Fassungen und waren eine Runde später uneinig (Naht 122) | **AKTIV, GETEILT** |
| `index.html` | **die Betriebsfassung** — GitHub Pages, Vollbild, Performance-Messung. Kein Bundler (Naht 101 blockiert ihn; für Pages braucht es ihn nicht, und getrennte Dateien messen ehrlicher). **0 Boot-Fehler**, das DC hat 2 aus der Werkzeug-Hülle | **AKTIV — die Fassung für GitHub** |
| `KFB Travel Testliste.dc.html` | **T1** · 6 Gruppen / 27 Punkte mit Handgriff UND Erwartungswert, Zustände OK/DEFEKT/N/A/offen, Notizen, JSON-Export/Import, Zustand überlebt Neuladen | **AKTIV** |
| `docs/travel-v16/HANDOVER_WS_2026-08-12.md` | **Onboarding für frische Chats** (§A) + Diff (§B) + Testverfahren (§C) + Nähte (§D) + Offene Punkte (§E) | **AKTIV, maßgeblich** |
| `terrain-v16/prop-scatter.js` (**ps-v1.1**) | **die Props (L3)** — 9 Kenney-Modelle über `asset-repo.json` (RAW), globale InstancedMeshes, Verbieger pro Instanz, Bodenbewegung + Bodenfarbe + Squash am Bob des Würfels | **AKTIV** |
| `docs/travel-v16/HANDOVER_assets_chatgpt.md` | **Standalone-Auftrag an ChatGPT**, den Asset-Index zu konsolidieren: die zwei Indizes, sechs verifizierte Fallen, Zielformat, Verifikations-Pflicht | **AKTIV, maßgeblich für den Asset-Aufräumer** |
| `asset-repo.json` (Wurzel, 328 kB, 986 Assets mit `ghUrl`) | die **Laufzeit-Wahrheit** über ladbare Assets. Geteilt mit `KFB Cartoon-Verbieger.dc.html` | **GETEILT — nicht umbauen, ohne beide Verbraucher umzustellen** |
| `kfb-cartoon-deform.js` (Wurzel) | die Verbieger-Referenz. L3 hat die Mathematik übernommen, die Datei **nicht** angefasst | **GETEILT, unverändert** |
| `terrain-v16/settings-schema.js` | Abschnitte *Stufung* (7+2) · *Farbwelten* (13+3) · *Ringwellen* (6+2) · *Props* (16+3) | AKTIV |
| `scraps/01…03-farbwelten-v16.jpg` | Abnahme-Belege L2a: drei Seeds, drei Welten (11 mystical · 42 forbidden · 777 heroic) | ASSET (klein, behalten) |
| `scraps/01…04-wellen-v16.jpg` | Abnahme-Belege L2d: grüner Ring läuft über rosa Gelände nach außen | ASSET (klein, behalten) |
| `docs/travel-v16/SPRINT_travel-v16.md` | Fahrplan **L1–L3**, Reliefart-Tabelle, vier offene Entscheidungen, Clean-Run | **AKTIV, maßgeblich** |
| `docs/travel-v16/CHANGELOG_v16.md` | Messtabelle mit/ohne Stufung, Nähte 102–105 | **AKTIV** |
| `scraps/01-stufung-v16.jpg` | Abnahme-Beleg (Nahaufnahme — aus 46 u sieht man L1 nicht, Naht 105) | ASSET (klein, behalten) |
| `KFB Travel v15.dc.html` + `terrain-v15/` | Fork-Basis, Vergleichsmaßstab | **FROZEN seit 2026-08-12** — nicht weiterbauen, nicht löschen |

**Der Kern, in einem Satz.** Eine feinere Stufe allein löst die Aufgabe nicht: wer überall auf
`CELL/6` rastet, bekommt überall sanfte Terrassen und verliert die Klippe. **Steigung und Klippe
sind kein Gegensatz von Höhe, sondern von Stufengröße** — dieselbe Differenz ist eine Treppe in
zwölf Stufen und eine Wand in einer. Also ist die Stufengröße ein **Ort-Merkmal**: Hang 0,50 u ·
Terrasse 1,50 u · Kiste 3,00 u · Klippe 6,00 u, verteilt über eine langwellige Reliefkarte
(≈ 220 u). Das Höhenfeld darunter ist unverändert — an einer Reliefgrenze wechselt die Rasterung,
nicht der Berg. `stepAt(x,z)` ist eine reine Funktion des Ortes, also können Physik und Bild
nicht auseinanderlaufen.

**Abnahme L1 — RICHTIGGESTELLT 2026-08-12 (siehe Naht 115).** ⚠ Die erste Abnahme galt einem
festen Weltseed; **L2a hat ihn gewürfelt und damit L1s Zahlen still ungültig gemacht** — gefunden
hat das der Verifier, nicht ich. Die Schwellen sind seither **Flächenanteile** (Perzentilrang aus
einer je Welt gemessenen Verteilung), `reliefKontrast` ist ersatzlos weg.

*Global, 5 Welten, je 40 000 Proben über 12 000 u:* Hang **42–47 %** · Terrasse **31–34 %** ·
Kiste **15–16 %** · Klippe **7–8 %** (Ziel aus den Schwellen: 45/30/18/7 — die Regler bedeuten
jetzt, was sie sagen).
*Lokal, 6 Welten, 480 u:* 34–69 / 18–56 / 9–30 / 0–3 % — **die Streuung ist gewollt**: ein
480-u-Fenster enthält zwei Reliefwellenlängen, also ist ein Ort dort ein Ort und kein Durchschnitt.
*Die eigentliche Abnahmezahl:* Wände **in Klippengebieten 8,1–12,5 %** gegen **0,9–2,8 % sonst**
(4- bis 9-fache Konzentration) · gesamt mit Stufung 1,1–2,8 %, ohne 1,8–1,9 % · mittlerer
Nachbarsprung 0,44–0,52 gegen 0,55–0,60 u · größter 6,00 u · Weltwürfel inkl. Verteilungstabelle
**27 ms** · `__loopErr` null · `__bootErrors` 2 (die bekannten).

**Gestrichen, weil widerlegt:** die frühere Kernaussage „der Wandanteil ist mit und ohne Stufung
1,9 % — es sind nicht mehr Wände geworden". Gemessen hatte die Stufung den unkletterbaren Anteil
verdoppelt (1,8 → 3,1–4,5 %). Ein **Gesamtanteil kann eine Trennung nicht abnehmen**, er mittelt sie
weg (Naht 117).

**Startort, 40 Welten geprüft:** der Ursprung fällt **1 von 40** Mal in ein Klippenfeld; lokaler
Klippenanteil im 480-u-Fenster Median **2 %** (0–32 %). Aufgefallen ist es nur, weil die neue
Messzeile den Ort nennt. Nicht weggebogen — ein Startplatz mit Klippen kann dramatisch sein, das
ist eine Produktentscheidung; der Hebel wäre eine Startplatzsuche, kein Eingriff in die Verteilung.

**Gemessene Einschränkung, die dazugehört:** die Fläche außerhalb der Klippen ist mit 0,9–2,8 %
**nicht messbar begehbarer als v15**. Der Grund: „Kiste" (15–16 %) ist unverändertes v15-Verhalten,
und ein steiler, auf 3 u gerasterter Hang kann zwei Stufen zwischen Nachbarn springen. Wer die
Fläche wirklich begehbar will, schiebt *… bis Terrassen* hoch.

**L2 · Farbwelten (12.8., zweite Runde).** Drei Regeln standen vor dem ersten Bild:
(1) **Farbwelt ≠ Story-Modus** — der Modus trägt die TINTE (HUD, Würfel, Speedlines, Ton) und
gehört der Erzählung; eine Region wechselt nur Terrain, Himmel und Nebel. (2) ⚠ **Biom ist Farbe
und Props, NIE Höhe** — `setWorldContext` rebaked, `biomeShape`/`heightScale` verbiegen das
Höhenfeld, eine Biomgrenze im Flug hätte die Landschaft unter dem Spieler neu wachsen lassen
(dieselbe Disziplin wie die Wasserregel »Farbe, niemals eine Ebene«). (3) **Eine Bewegung, nicht
drei** — der Atem ist dieselbe Front wie der Wechsel, nur kleiner; ein zweites Morph-System wäre
die Konfetti-Falle aus §4v/82.
**Gemessen:** mittlere Weite einer Farbwelt **1500 u** (Kachel 1800, 8 Wechsel auf 12 km) ·
gleicher Ort → gleiches Ergebnis **ja** · Ursprung ist eine Kachel**mitte** ((0,0), (200,−200),
(−300,300) dieselbe Kachel) · Ereignisse in den ersten Sekunden **1** statt 2 (Naht 107) · Sprung
um 3000 u → genau **1** Wechsel · Atem 0° → 12,6° → 25,2° → 12,6° → 0°, kehrt um ·
drei Seeds → drei Welten (**11** mystical/Säuregrün · **42** forbidden/Glut · **777**
heroic/Bubblegum) · keine Fehlerzeile.
**Die Nähte 106–110:** (106) der Renderer konnte es die ganze Zeit — L2 brauchte **null Zeilen
GLSL**; wer nicht prüft, was sein Renderer kann, baut ein zweites davon · (107) ⚠ ein Raster,
dessen Nullpunkt auf einer Grenze liegt, feuert beim ersten Schritt · (108) eine Auswahl, die sich
von selbst zurücknimmt, sind zwei Wahrheiten über eine Farbe (Handauswahl schaltet die Farbwelten
ab und meldet es) · (109) ⚠ Biom ≠ Höhe · (110) der Atem ist dieselbe Bewegung wie der Wechsel.

**L2d · Ringwellen (12.8., dritte Runde).** Variante **A**: die Welle zieht durch, kein Gedächtnis.
Acht Plätze in einem Uniform-Array, Ring im Fragment-Shader — **kein Draw-Call, kein Attribut,
kein Rebake**, weil `vWXZ` seit v3 dort liegt. Eine flache Scheibe wäre falsch: sie z-fightet mit
den Würfeloberseiten und schwebt über Stufen, und L1 hat das Gelände gerade stufiger gemacht.
**Ausgelöst durch Ereignisse, nie durch den Beat** (Aufsetzen mit Wucht · Karte durchflogen vom Ort
der Karte · Farbwelt-Wechsel · Atemzug schwächer) — eine Welle im Takt wäre Deko statt Ursache.
**Gemessen:** Radius nach 2 s bei 46 u/s **92 u** · neunte Welle verdrängt die älteste · nach 7 s
alle Plätze frei · Ring-Scheitel **1,00** (alte Formel 0,50) · Fläche `#f54d8c` gegen Welle
`#66ff85`, ΔLum **+0,24** · keine Fehlerzeile.
**Die Nähte 111–114:** (111) ⚠ ein Backtick in einem GLSL-Kommentar beendet das Template-Literal
und der Fehler erscheint bei einem Nachbarn — **zweimal am selben Tag**, deshalb steht die Warnung
jetzt im Shader-Block · (112) ein Ring aus zwei smoothstep-Kanten erreicht im Scheitel nur die
Hälfte (0,50 statt 1,0; Atemzug kam auf 21 % Beimischung) — wer eine Kurve aus zwei Kanten baut,
muss ihren Scheitel ausrechnen, nicht ansehen · (113) ⚠ eine Welle in der Farbe der Palette ist
**per Konstruktion unsichtbar** — Kontrast zur Palette, nicht Mitgliedschaft in ihr · (114) der
Kontrast muss aus FARBE kommen, nicht aus Dunkelheit (ein dunkles Band liest sich als Schatten),
**und die Stelle in der Kette entscheidet mit**: vor dem Streu-Kanal des Terrains wurde der Ring
olivgrau, weil dieser jede Farbe um 11–28 % entsättigt.

**Backlog, bewusst außerhalb des Sprints (Georg, 12.8.):** **Variante B — die Welle FÄRBT EIN**
(`instanceColor`), Grundlage für farbige Wassertropfen aus dem geplanten Wetter. Die eigentliche
Frage dort ist nicht der Puffer, sondern **was beim Chunk-Recycling passiert**: eine Einfärbung,
die beim Wegfliegen verschwindet, ist keine Erinnerung — und eine, die bleibt, braucht einen Ort,
an dem sie wohnt (gerechnet oder gespeichert, dieselbe Entscheidung wie bei `stepAt`/`regionAt`).
Dazu ein Deckel gegen Matsch. Vollständig in `SPRINT_travel-v16.md` §3b.

**L3 · Kenney-Props (12.8., vierte Runde).** Die grauen Streu-Blöcke sind ersetzt: **9 Modelle**
aus `kenney_nature-kit`, zur Laufzeit über `asset-repo.json` (RAW, nichts kopiert), als **globale**
InstancedMeshes je Modell-Teil — **17 Draw-Calls statt 81** (vorher ein Streu-Mesh je Chunk). Der
Umbau macht das Bild reicher UND die Liste kürzer. **Die Standorte gehören dem Terrain**
(`propSites`): wer den Boden zweimal rechnet, hat zwei Höhen. **Biom-Logik über den Dateinamen** —
der Index hat von jedem Baum `_dark`/`_fall`, also ist „Herbstwald" ein Suffix und kein System.
**Die grauen Blöcke bleiben als Fallback**, nicht als Altlast: ein 404 macht die Landschaft ärmer,
nicht leer.

**Vor der ersten Zeile gemessen:** `kenney_nature-kit` liegt unter `Models/GLTF format/` — und
dieser Ordner enthält **`.glb`**. Wer die Endung aus dem Ordnernamen ableitet, baut 329 kaputte
URLs. Dazu: 19–31 Y-Ebenen bei den Bäumen, also **biegen** sie wirklich (der Verbieger braucht ≥ 4).

**L3b/c/d — Georgs drei Nachfragen, alle zu Vereinfachungen geworden:**
(b) *„Props sollten die Bewegung des Floor mitmachen — sonst versinken sie im Voxel."* Richtig; die
Reparatur war **nicht**, die Rechnung nachzubauen, sondern sie zu **teilen**: `MOTION_GLSL` als
exportierter Block, Uniforms als **dieselben Objekte** (`terrain.motionUniforms`). Die Phase kommt
vom WÜRFEL, nicht vom Prop — mit der eigenen Position liefe es minimal anders und versänke an den
Umkehrpunkten.
(c) *„runde Ecken"* = zwei Regler, keine Geometrie: Normale zwischen hart und weich mischen
(Beleuchtung) + entlang der weichen Normale aufblasen (Silhouette). *„mit der Terrain-Farbe
einfärben"* = **jedes Prop nimmt die Farbe des Würfels, auf dem es steht** (`kfbGroundColor`,
geteilte Paletten-Uniforms samt Front) — ein Wald färbt damit **mit** der Ringwelle um, ohne
benachrichtigt zu werden.
(d) *„Cartoon-Bounce aufwendig?"* Nein — es hat eine **falsche** Bewegung ersetzt: der Squash lief
an einer eigenen Uhr. Jetzt kommt er aus demselben `kfbBob` (Würfel unten → gestaucht, oben →
gestreckt) mit **Nachlauf** 0,09 s ± 0,06 s. `update()` ist dadurch leer geworden.

**Abnahme:** 9/9 Modelle in 307–453 ms · **17 Draw-Calls** · 4 030 Vertices · 1 376–1 427 Props
gesetzt, 0 über Budget (2 400) · Aufbau je Chunk-Wechsel **20–24 ms** (vorher 26–30, Naht 119) ·
`__loopErr` null · `__bootErrors` 2 (die bekannten).

**Die Nähte 119–121:** (119) 8 400 Attribut-Namenssuchen je Aufbau = anderthalb verlorene Bilder pro
Sekunde · (120) **die zweite Uhr ist der Fehler, nicht die fehlende Bewegung** — zweimal in einem
Slice, beide Male war die Lösung, den vorhandenen Takt zu teilen · (121) geteilte Uniforms brauchen
keine Synchronisation, und **die beste Synchronisation ist die, die es nicht gibt**.

**Offen bei L3:** der Aufbau (20–24 ms je Chunk-Wechsel) ist noch ein spürbarer Hänger — der Rest
sind `mulberry32` und Trigonometrie je Standort, also entweder ein Cache über die Chunk-Kachel oder
ein Aufbau in Scheiben über mehrere Bilder. Nicht gebaut, weil es eine Optimierung ohne Auftrag wäre.

**Asset-Aufräumen ist beauftragt, aber nicht von uns:** `docs/travel-v16/HANDOVER_assets_chatgpt.md`
ist ein **standalone** Auftrag an ChatGPT — zwei Indizes (`catalog.json` 2538 lokal gegen
`asset-repo.json` 986 mit `ghUrl`), sechs verifizierte Fallen (Ordner „GLTF format" mit `.glb`,
umbenannte Packs, verschachtelte Pfade, doppelte Namenswelten, Teilmengen, drei widersprüchliche
Größenangaben des Katalogs), Zielformat und **Verifikationspflicht** (jede URL mit HEAD geprüft,
Datum im Datensatz).

**T1 · Parametersatz und Testliste (12.8., fünfte Runde).** Panel *Varianten & Test*:
**Parametersatz sichern** schreibt 17 Abschnitte (Seed, Story, Biom, alle Regler, **plus die
Messwerte**) nach `localStorage['kfb-travel-params']`; die Testliste holt sie von dort. **Regler
würfeln** schüttelt die Grenzen durch und **lässt den Seed stehen** — man ändert Regler ODER Welt,
nie beides, sonst weiß niemand, welches gewirkt hat. Der Grund für das Ganze ist Naht 115: ein
Ergebnis ohne seinen Parametersatz ist eine Anekdote, und genau so wurde L1s Abnahme still
ungültig. Gemessen: 17 Abschnitte, Messwerte vollständig, `__bootErrors` **0** in `index.html`.

**S60d · Die drei Himmelswürfel zurück auf 120°** (Georg, 12.8.). `spreadAz` von 0,24 (≈ 29°) auf
**1**. Die 29° stammten vom 26.7. — damals sollten alle drei zugleich im Bild sein. Das war eine
Regie-Entscheidung, keine Messung, und sie kostete genau das, was die 120° leisten: eine ORDNUNG
des Himmels. Rückweg auf das alte Bild: 0,24.

**Offen (Georg am Regler):** Klippenanteil **7–8 %** (Schwelle *… bis Kisten*) — mehr Drama? ·
die Kiste behalten oder ihren Anteil den Terrassen geben (das ist der Hebel für „begehbar
außerhalb der Klippen", siehe Einschränkung oben)? · Klippenhöhe 6,0 u (über der Sprunggrenze 4,2)
oder überwindbar? · feiner Teiler 6 → 12 (0,25 u, unter der Tuschekante)? · Kachelgröße einer
Farbwelt (1800 u = 43 s) · Front-Dauer 9 s · Atemzug alle 44 s mit 12,6° · Lesbarkeits-Riegel bei
80 % · Wellentempo 46 u/s, Ringbreite 24 u, Deckkraft 100 % · **als nächstes L3 (Kenney-Props)
oder Variante B aus dem Backlog?**

---

## 4y. Overworld v13 — Fork (2026-08-12) + Doku-Abgleich

Fork von `KFB Overworld v12.dc.html` (Stand §4v). Der Runner ist beim Fork **nicht** angefaßt;
geändert sind nur die 39 Skriptpfade, das `x-import`-`from` und der Fork-Stempel im Kopf.
**Keine Modulzeile geändert** — die Module lösen ihre Nachbarn über die eigene Adresse auf, deshalb
wandert `icons-rpg/` mit dem Ordner.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v13.dc.html` + `overworld-v13/` (56 Module + `icons-rpg/` + 3 JSON) | **der Arbeitsstand** | **AKTIV — main der 2D-Linie** |
| `docs/overworld-v13/SPRINT_overworld-v13.md` | Fork-Fakten, Fork-Abnahme, Slice-Reihenfolge, was NICHT gemacht wird | **AKTIV, maßgeblich** |
| `docs/overworld-v13/ABGLEICH_briefings_2026-08-12.md` | Briefings gegen Masterplan/Doku, Masterplan-Patch-Vorschlag, offener Runner-Diff | **AKTIV** |
| `KFB Overworld v12.dc.html` + `overworld-v12/` | Fork-Basis | **SUPERSEDED von v13 — nicht löschen** |
| `KFB Terrain-Probe v1.dc.html` (tp-probe-v1) | **Messplatz, kein Spiel** — Pirate Bomb neben Tiny-Swords-Einheiten/Requisiten auf lean Boden; lädt über `OW_SRC` → `OW_UNITS.heroDef` → `OW_LOADER.loadUnit(refBody 91)`, misst mit `probeBox`. Liest nur, ändert kein Modul | **AKTIV (Autoren-Werkzeug)** |
| `uploads/HANDOVER_Cowork_2026-08-12.md` + `kfb_overworld_living_doc.html` + `kfb_piratebomb_bundle(1).html` | **Eingang Coworker 12.8.** — Bubble-Setzungsarbeit (O1–O7, 12 ausgerechnete Fixtures), Asset-Befunde (Pirate Bomb CC0/20 fps/0 % Saum; Emanata-Blatt A ohne Raster; King 29 646 Farben → Portrait) | **AKTIV, maßgeblich für Runde 1** |

**Fork-Abnahme steht aus** (Reihenfolge im Sprint-Blatt §1): Module 39/39 · `[rail-v9b] Kartenspalte
steht` · Roster-Fußzeile `30 gemessen · …` · `[water]`-Zeile · Save trägt `hero.unit` (2.4.0) ·
Statblatt-Papier voll deckend. **Ohne diese Zahlen ist v13 GEBAUT, nicht LÄUFT** (Hausregel 4).

**Befund des Abgleichs (2026-08-12), drei Sätze:**
(101) **ein Plan, der drei Forks alt ist, wird stillschweigend zur zweiten Wahrheit** — der
Masterplan hat Stand 9.8./v10 und kennt neun Entscheidungen aus v11/v12 nicht (Ink-Regel,
Wasser-Kanon, 30 statt 31 Einheiten, Körper-Tempo, Journey 2.4.0, Statblatt-Rücknahme,
Kamera-Klammer, `aufBlatt()`, Glitzern aus). Er gehört WS1 — deshalb steht der Patch als
**Vorschlag** im Abgleich, nicht als Änderung am Plan.
(102) ⚠ **zwei ungesendete Runden übereinander** — §4v markiert drei Dateien als »Diff an WS1«,
seither sind `water-form`, Kamerazweig, `stepReader`, `spawnPoints`, `spawnCritters`, Journey 2.4.0
und die vier Rail-Befunde dazugekommen. Das Sync-Ritual (§6 Masterplan) sagt: eine Richtung, eine
Runde, ein Export. Empfehlung: Handover-Blatt **vor** dem ersten v13-Slice.
(103) **der Pixelbäcker liegt fertig, aber ohne Empfänger** — vier Prüfpunkte vor dem Absenden
(Loader-Messung gegen `bake.json` als Abnahme statt als Beleg · Outline (a) ausdrücklich als
nicht-KFB-Kante deklarieren, sonst zweite Feder gegen K5 · Körperhöhe in **Quellpixeln** melden ·
`shadow.lean/off` an **einen** Ort). Dazu fehlt ihm Naht 66/72: ein Werkzeug, dessen Ergebnis ein
Bild ist, darf nicht über die Vorschau abgenommen werden.

**Erste Messung an der Probe (12.8.):** Bald Pirate **Körper 59 px → ×1,54 = 91 px** neben Warrior
(192er-Zelle, 91 px, ×1,00) und Minotaur (Streifen, 129 px → ×1,23 = 159 px). Die Leinwand 63×67 ist
also **nicht zu groß** — die Figur füllt sie knapp zur Hälfte. Damit ist die offene Entscheidung 11
des Cowork-Handovers gemessen statt geschätzt.
(104) **Pirate Bomb ist ein DRITTES Blattformat** — der Katalog kennt `rowsheet` (192er-Zellen) und
`strips` (eine Datei je Animation); hier liegt **ein Bild je Frame in einem Ordner** (181 Bilder).
Entweder ein dritter Zweig `framedir` im `unit-loader` oder einmal zu Streifen backen (181
Anfragen → 11). **Nicht stillschweigend als `strips` eintragen** — das Blattformat entscheidet die
Bauart, und eine falsche Formangabe ist eine zweite Wahrheit über dieselbe Figur.

**Reihenfolge nach dem Cowork-Eingang (Slice-Plan im Sprint-Blatt §5):** H0 Handover (halbe Runde) →
Runde 1 **Bubble/ChatterBox** C1–C5 gegen die 12 ausgerechneten Fixtures → Runde 2 **Pirate Bomb**
P1–P5. Der Einwand des Coworkers ist angenommen: eine Runde Handover, keine Serie — v12 war ein
Housekeeping-Fork, v13 darf kein zweiter werden.

**Entscheidungen Georg 12.8. (Formular + Blick auf die Probe):**
| Frage | Entscheidung |
|---|---|
| Reihenfolge v13 | **H0 Handover → Bubble/ChatterBox C1–C5**, danach Pirate Bomb |
| Masterplan | **eine Zeile Vermerk am Kopf** — gesetzt am 12.8.: »liegt hinter dem Code, keine gültige Quelle für v11+«. Eigentum bleibt WS1, eingearbeitet wird dort |
| Pirate-Bomb-Maßstab | **HERO_REF-normiert** — »pirates passen super so« am Blatt (Bald Pirate ×1,54 = 91 px, neben Archer und Captain gesehen) |
| Blattformat | **zu Streifen backen** und als `strips` eintragen (181 Anfragen → 11) — kein dritter Loader-Zweig |
| Richtungen | **zwei** (spiegeln); die Ruheposen stehen fast frontal |
| Rolle | **alle fünf**: Gegner am Steg/Ufer · Card-Zone-Wächter · Bewohner/NPC · **Captain als Card-Owner** (Fluchtanimation) · Wegelagerer-Zone |
| Emanata | **Blatt B beauftragen** (7 fehlende Zeichen) + **Blatt A umbenennen** (keine Leerzeichen/Kommas/Punkte). Cyan-Frage bleibt offen |
| King Kayfabon | **zweiter Auftrag** — nicht Portrait aus dem Bestand, nicht Unit |

**H0 erledigt 12.8.:** `docs/overworld-v13/HANDOVER_WS1_2026-08-12.md` — und der Diff ist **größer
als §4v behauptet hat**: gemessener Byte-Vergleich v11 gegen v13 ergibt **acht** Dateien statt drei
(`water-kiss.js` neu · `overworld-game-v10.js` · `card-rail-v9b.js` · `terrain-paint.js` ·
`journey.js` · `card-backs.js` · `asset-source.js` · `gutter-2d.js`), am Wirt ein Attribut
`water-form`. `units-catalog.js`, `unit-loader.js`, `mob-ai.js`, `game-feel.js`, `reach.js`,
`shots.js`, `roster-sheet.js` sind **unverändert**.
(105) **eine Diff-Liste aus dem Gedächtnis ist eine Schätzung** — drei genannte Dateien, acht
gemessene. Der Byte-Vergleich kostet eine Minute und ist die einzige Fassung, die ein Empfänger
nachbauen kann.

**Slice C1 · Blasen-Layout (12.8.) — abgenommen gegen die Erwartung, nicht gegen den Eindruck.**
| Artefakt | Rolle | Status |
|---|---|---|
| `overworld-v13/bubble-layout.js` (bl-v1.0) | **die Setzungen als Code**: fünf Arten, ausgeglichener Umbruch (DP über Quadratsummen), Innenabstand in em, Kasten aus dem Textblock, Zeiten (34 Zchn/s · 800+42·n gedeckelt 5000 · Abgang 220 · min 1200). Kennt **keine** Blasengröße als Eingabe | **AKTIV — Leser folgen in C2/C3** |
| `KFB Bubble-Fixtures v1.dc.html` | die **Abnahme**: zwölf O7-Fixtures, Soll/Ist je Zeile, Gegenprobe füllend↔ausgeglichen, eigener Satz | **AKTIV (Messblatt)** |

**Abnahme 2026-08-12:** `[bubble-fixtures] C1 · 12/12 Fixtures · Zeilen 12/12 · Umbruch 5/5 ·
Zeiten 12/12 · Überlauf gemeldet`. Im Bild geprüft: `sandwich` 3 Zeilen / 5090 ms (Obergrenze und
Haltedeckelung), `thought` einzeilig bei genau 28 Zeichen, `overflow` **4 Zeilen → abgewiesen**
(»zu lang als INHALT, gehört gekürzt«), Gegenprobe zeigt bei vier von fünf Fällen die
Ein-Wort-Restzeile links und den Ausgleich rechts.
(106) **die Blase wird aus dem Textblock abgeleitet, nie umgekehrt** — deshalb nimmt das Modul keine
Größe an: die leere Riesenblase kann nicht entstehen, sie ist konstruktiv unmöglich.
(107) **der füllende Umbruch ist keine Ungenauigkeit, sondern eine andere Methode** — er füllt und
lässt den Rest fallen; der Ausgleich minimiert die Summe der Quadrate. Bei gleicher Zeilensumme ist
sie genau dann minimal, wenn die Zeilen gleich lang sind. `wrapFill()` bleibt als **Gegenprobe** im
Modul, nicht als Rückweg — wer sie im Spiel benutzt, hat den Slice zurückgedreht.
(108) **ein Modul, das seine eigene Abnahme kennt, prüft sich selbst** — die zwölf Erwartungswerte
stehen im Messblatt, nicht in `bubble-layout.js`.
**Offen aus O6, jetzt sichtbar:** Flüstern hat **keine** gesetzte Zeilenlänge. Fixtures sind mit
**28** gerechnet, rechnerisch sind es **33** (kleinere Schrift, mehr Zeichen). Regler liegt im
Messblatt (Tweaks); bei 33 wird `whisper` einzeilig. **Georgs Entscheidung.**

**Slice C2 · Fünf Formen (12.8.) — und zwei Konturen zweimal gebaut.**
| Artefakt | Rolle | Status |
|---|---|---|
| `overworld-v13/bubble-ts.js` (**bubble-ts-v2**) | fünf Register: rede · gedanke · **ruf (Sternplatzer)** · fluester · **kayfabulate (Kasten)**. `satz()` ist die EINE Satz-Rechnung (Umbruch + Schriftgröße + gemessene Zeichenbreite), `formen` gibt die Konturen einzeln heraus | **AKTIV — Diff an WS1** |
| `KFB Blasen-Formen v1.dc.html` | Messblatt C2: fünf Register nebeneinander, Ankerwinkel und Streuung am Regler, Zahlen je Block | **AKTIV (Messblatt)** |

**Der Kern des Slice:** der Textblock kommt aus `bubble-layout.js`, die Kontur legt sich darum.
Vorher stand im Träger `max-width:230px` — also eine Blasengröße, in die Text gelegt wird, genau die
Reihenfolge, die O6 verbietet.
(109) **eine angenommene Zeichenbreite ist eine angenommene Blasenbreite** — `charPx = font·0,60`
stimmt für Courier, nicht für Bangers und nicht für einen Ersatz-Monospace: der Text lief aus der
Kontur. Jetzt `measureText` über den wirklichen Satz. *Gemessen, nicht angenommen* — dieselbe Regel
wie beim Bestand, nur eine Ebene kleiner.
(110) ⚠ **eine Zacke auf einer Kante ist kein Platzer** (Georgs Befund) — der Ruf war ein Rechteck
mit Sägeprofil. Comic-Logik ist **radial**: ein **Kranz** aus 12–18 fast gleich langen Spitzen, Täler
bis auf den Block (0,92), dazu **Aufprall-Striche** in drei gesetzten Gruppen außerhalb der Fläche.
Zwischenschritt verworfen: 7–11 stark gestreute Spitzen auf einem Oval — das las sich als Klecks mit
zwei Hörnern. *Die Wirkung kommt aus Zahl und Tiefe, nicht aus Streuung.*
(111) **der Kranz braucht einen runderen Grund als der Text** — ein einzeiliger Ruf ist 3,6:1 flach;
mit dem Rechteck als Grundmaß wachsen zwei waagerechte Hörner. Die kurze Achse wird auf mindestens
0,42 der langen angehoben. *Die Kontur folgt dem Block, ihr Grundmaß folgt der Form.*
(112) **eine Wolke ist ein Kranz aus Lappen, keine gewellte Kante** — `blobPath` verband Punkte auf
einer Ellipse mit Bögen vom halben Sehnenmaß: eine gewellte Kartoffel. Jetzt Kerben auf dem Grundmaß
und Lappen als Bögen mit **Bauchung 0,74** darüber.
(113) **ein fehlender Kanon heißt dünnere Kante, nicht keine** — ohne `OW_CARD.canon` (ES-Import über
den CDN) zeichnete das Flüstern gar keine Kontur, und der Fehler war unsichtbar. Rückfall auf einen
gestrichelten Strich **mit Konsolenzeile**.
(115) ⚠ **der Weg, auf dem das Flüstern seine Kante holte, existiert im Kanon nicht — seit v10-S15.**
Gemessen am geladenen Kanon v2: er führt `inkRibbon2D` · `inkHalfWidth` · `measureInk` und die
Presets `card · chip · academy-2026-07 · sky-2026-07` — **kein `dashedPathD`, kein `card-dash`.**
`fluesterKante()` lieferte darum immer `''`, die Blase wurde mit `stroke-width 0` gezeichnet, und
sichtbar war nur der Schlagschatten. Ein Jahr Doku sagt »gestrichelte Kanon-Feder«; gebaut war ein
Griff nach einer API, die es nicht gibt. *Ein Aufruf mit Rückfall auf Leerstring meldet nichts —
er sieht wie eine Absicht aus.* Zusätzlich: `inkRibbon2D` zeichnet auf **Canvas**, nicht in einen
SVG-Pfad. Eine Kanonfeder im Overlay braucht also eine Canvas-Ebene oder eine SVG-Ausgabe im Kanon.
**Kein zweiter Federzeichner** (K5) — die gestrichelte Variante gehört in `kfb-ink-canon.js`, und
die gehört WS1. Bis dahin: gestrichelter Strich als **benannter** Platzhalter, mit Konsolenzeile.
(116) **ein Guard auf ein noch nicht geladenes Modul ist ein stiller Verzicht** — das Messblatt rief
`OW_CARD.ready()` einmal in `componentDidMount`, da war `window.OW_CARD` noch nicht da: der Guard
griff nicht, danach fragte niemand mehr. Jetzt nachziehen, bis es da ist (dasselbe Muster wie die
`OW_HERO`-Abfrage in der Terrain-Probe).
(117) **ein leeres Fehlerobjekt ist keine Erklärung, die Reihenfolge ist es** — die fünf
`render error … {}` beim Aufbau kamen von `ref`-Rückrufen, die **vor** `componentDidMount` feuern:
`this.b` gab es da noch nicht. Als Klassenfeld deklariert, weg.
(114) **eine Ergänzung im Export, die nicht greift, sieht wie eine Absicht aus** — `aufprall` fehlte
in `OW_BUBBLE.formen`, der Aufruf im Messblatt lief in einen `TypeError`, die Zeichenschleife starb
still, und drei Karten zeigten **alte** Geometrie. Gefunden nur, weil die Punktzahl der Pfade gezählt
wurde. *Ein Messblatt, das nichts mehr aktualisiert, sieht aus wie ein Messblatt.*
**Dritter Anlauf, 12.8. spät (Georg an fünf Bildern):**
(118) **eine Blase hat eine ovale Grundform, keine Kreissumme** — »die Bubbles dürfen nicht stumpf
aus Kreisen gebaut sein; es muss eine ovale Grundform sein, die harmonisch mit Bogenformen
nachgezeichnet wird«. Wolke UND Ruf sitzen jetzt auf **einer** Grundellipse (Halbmaße × √2, kurze
Achse ≥ 0,46 der langen, `ovalBasis()`). Vorher war das Grundmaß der Abstand zur **Rechteck**kante —
der springt an den Diagonalen, daher die zwei waagerechten Hörner (Ruf) und die gewellte Kartoffel
(Wolke). *Die Ellipse ist die Harmonie, die Bögen sind die Handschrift.*
(119) **die Denk-Kreise gehören AUSSERHALB der Wolke** — sie saßen auf halber Blockbreite und lagen
damit unter den Lappen. Jetzt vom Ellipsenrand plus Lappenhöhe gemessen.
(120) **ein Kasten mit toter Linie ist ein UI-Dialog** — Kayfabulate bekommt dieselbe Federsprache
wie die Rede (vier Zwischenpunkte je Kante, ±1,3 px), nur ohne Zipfel.
· Pfeilbasis der Rede 18 → **13,5 px** (»ca. 1/4 schmaler«).
(121) **ein Stil ist eine Maske über der Kante, keine zweite Kante** (Georgs Lösung für Naht 115):
gestrichelt heißt **Lücken über einer durchgängigen Kante**. `luecken()` stanzt quer zur
Laufrichtung in eine SVG-Maske; die Kante wird einmal gezeichnet. Damit braucht das Flüstern **keine**
zweite Feder — und dieselbe Maske liegt später über der Kanon-Feder, sobald die im SVG ankommt.
**Ehrlich dazu:** heute tragen Flüstern und Kasten die **Jitter-Kante des Trägers**, nicht die
KFB-Kanon-Feder. Die zeichnet auf Canvas (`inkRibbon2D`), das Overlay ist SVG — Bitte an WS1 steht
im Handover §5b.
**Vierter Anlauf, 12.8. Nacht — die Kante kommt jetzt wirklich aus dem Kanon:**
(122) **die KFB-Feder für ALLE Register, ohne zweiten Zeichner** (Georg: »Ruf hat eine dead line …
bitte für alle«). Der Kanon zeichnet auf **Canvas**, das Overlay ist SVG — also bekommt das Overlay
eine **Canvas-Ebene**: Fläche, Maske und Klick bleiben SVG, die **Kante** zeichnet `inkRibbon2D`
über dieselbe Punktkette, die die Fläche begrenzt (`kanonFeder()`, Preset `card`). Gemessen im
Messblatt: Tuschepixel je Karte **7582 · 7055 · 8445 · 2802 (Flüstern, mit Lücken) · 6146**.
Rückfall auf die SVG-Kontur bleibt und meldet sich.
(123) **eine Form aus `A`-Befehlen hat keine Kante** — die Wolke bestand aus Bögen; die Feder liest
eine PUNKTLISTE. Jetzt acht Stützpunkte je Lappen (quadratisch, Bauchung 0,42 der Sehne): optisch
derselbe Zug, aber eine Kette, die jeder lesen kann.
(124) **ein `canvas.width`-Schreibzugriff löscht die Fläche** — je Bild neu gesetzt heißt: zwischen
Löschen und Zeichnen darf nichts schiefgehen. Jetzt nur bei Maßänderung. Dazu Hausregel 8 im
Messblatt nachgezogen: **eine Kachel darf misslingen, die Bildschleife nicht** — ein Fehler in einer
Form hatte alle fünf Karten eingefroren, und eingefrorene Karten sehen aus wie fertige Karten.
(125) **ein Polster in em schrumpft mit der Schrift, der Zeichenstrich nicht** — beim Flüstern
(0,85-fach) fielen 0,60 em auf 8 px. `bubble-layout.js` hat jetzt ein **Mindestpolster** (11/8 px).
(126) **die Ellipse durch die Ecken polstert ungleich** — Halbmaß × √2 sitzt an den Ecken am Block
und steht an den Seiten 41 % ab (bei einer breiten Zeile 40 px seitlich gegen 14 px oben). Jetzt
eine **Superellipse** (n = 3) mit Mindestskalierung: gleicher glatter Zug, überall ähnliches Polster.
(127) **ein Rand, gemessen vom Block, ist definitionsgemäß null** — die erste Messung ging vom
Textblock aus, der das Polster schon enthält. Gemessen wird ab der **Schrift**; das Messblatt zeigt
die Zahl je Register.
**Schrift entschieden (Georg, 12.8. Nacht): `shantell` ist die Vorgabe** — Shantell Sans für alle
Blasen, **Special Elite für den Erzählkasten** (Kayfabulate), Bangers bleibt beim Ruf. Der Bestand
schrieb Courier: sauber, aber nicht gesprochen. *Erzählung darf nicht dieselbe Stimme haben wie
Rede — die Schrift trägt denselben Unterschied wie die Form.* Umsetzung: `SCHRIFT='shantell'` +
`SCHRIFT_JE_ART={kayfabulate:'elite'}` in `bubble-ts.js`, Schriften werden im Träger nachgeladen.

**Zwei Befunde von Georg am Bild (12.8. spät), beide behoben:**
(139) ⚠ **ein Rückfall ohne Wiedervorlage wird zum Zustand** — die Aktionskarten des v7-HUD standen
mit runden Ecken und ohne Tuschekante da. Grund: der Kanon lädt asynchron; die Karten der Hand
entstehen **nach** dem einen Nachzeichnen bei `loadInk().then()`, zeichneten also mit dem Rückfall
und wurden nie wieder angefaßt. Eine runde Ecke sieht nicht nach Fehler aus, sondern nach Entwurf.
Jetzt merkt `draw()` jede Fläche, die ohne Kanon gezeichnet hat (`OHNE_INK`), und zieht sie nach —
plus ein zweiter Blick nach 1,2 s. Gemessen im Spiel: 6 Aktionskarten, je **~3250 Tuschepixel** auf
der Kante (vorher 0).
(140) **Chat aus** (Georg): `chatter` steht im DC jetzt auf `off`. Die Umgebungs-Plauderei ist damit
stumm, **nicht ausgebaut** — der Weg zurück ist dieser eine Wert in den Tweaks.

(141) **was verschwindet, muss verschwinden dürfen** — das Logbuch ist eine rollende Liste mit
fester Höhe (`min(19vh,108px)`); die älteste Zeile wurde hart beschnitten und las sich als Defekt
(»chat ist abgeschnitten«). Jetzt läuft sie oben weich aus (Maske 0 → 22 px). Kein Layoutwechsel,
eine Zeile CSS.

⚠ **OFFEN, gemeldet 12.8. spät: dieselbe Quest-Karte steht zweimal im Bild** (Georgs Bild:
»The Convert Bonus«, das Blatt doppelt untereinander). Nicht diagnostiziert — Verdacht: das
Quest-Fenster zeichnet Blatt und Viertelseite übereinander, oder ein Knoten wird beim Neuaufbau
nicht geleert. **Erster Schritt für den nächsten Slice: nicht raten, sondern zählen** — wie viele
Knoten trägt der Quest-Behälter, und wer hängt sie ein.

**Abnahme v13 im Standalone (12.8.), damit steht die Zahl:** Module **39/39** ·
`[rail-v9b] Kartenspalte steht · Quests 2` · `[journey] Einheit aus dem Spielstand: gnoll`
(Schema 2.4.0 liest zurück) · `[water] water-v2.0 — Glitzern steht auf aus` · `[bubble-layout]
bl-v1.1` · Kanon v2 geladen · `__bootErrors` **0** · Welt 240×180, 6 Zonen, 23 Mobs + 8 Wegelagerer,
Rückseiten 6/6. **Damit ist v13 LÄUFT, nicht nur GEBAUT.**
Bekannt und benannt geblieben: `KFB_Props/sheet-02.png` fehlt im Repo (Requisiten kommen aus dem
Tiny-Swords-Vorrat, 700), `drop_002.ogg` dekodiert nicht (seit 9.8.), `HUD-Skin v7 · undefined`
(kosmetisch, aber es steht in der Zeile, die sonst die Abnahme trägt).

**Vier Pfad-Fänge aus dem Bündeln (12.8., alle behoben und im Export):**
(135) ⚠ **eine relative Adresse gegen eine `blob:`-Basis wirft — und zwar synchron im Promise.**
`new URL('./x.json', 'blob:…')` ist kein gültiger Aufruf; der Fehler erreicht den vorhandenen
Rückweg **nicht**, sondern landet als unbehandelte Rejection. Betraf `hud-v7.js` (Kanon-Kandidat,
`hud-slots.json`) und `card-ink-2d.js`. *Ein Rückweg, der erst nach dem Wurf greift, ist keiner.*
(136) ⚠ **das gemessene Kartenraster ging im Standalone verloren** — `card-grids.json` wurde relativ
aufgelöst, der Wurf fiel in den `catch`, und die ausgelieferte Fassung zeichnete mit dem **geratenen**
Rückfallwert, während die gemessenen Zahlen (V10-S7) danebenlagen. Jetzt zwei Kandidaten: eigene
Adresse, dann `OW_SRC.ow()`.
(137) **ein 404 mit hübschem Ersatz fällt nie auf** — `prop-sheet.js` lud seit dem v11-Fork
`./overworld/prop-sheets.json`, den Ordner gibt es hier nicht mehr. Sichtbar wurde nichts, weil der
Rückfall 700 Tiny-Swords-Requisiten liefert. Der falsche Pfad wäre mit dem Check-in weitergereist.
(138) **das Bündel ist der einzige Ort, an dem diese Klasse auffällt** — im Projekt lösen sich alle
vier Adressen sauber auf. *Wer nur im Projekt prüft, prüft die Umgebung mit, in der der Fehler nicht
vorkommt.*

**Check-in 2026-08-12: `export/overworld-v13_2026-08-12/`** — Code (57 Module), vier **Standalone-
HTML** (Overworld · Bubble-Fixtures · Blasen-Formen · Terrain-Probe), `docs/overworld-v13/` (Sprint ·
zwei Abgleiche · Spec Lettering · Handover WS1), HOUSEKEEPING-Kopie, Masterplan-Kopie (Eigentum WS1),
die Bauanleitung des Coworkers als Eingang, Schreibweisen-Kanon, README mit Diff und Abnahme.
(133) **eine Kopfzeile, die einmal beim Mount gelesen wird, altert sofort** — im Standalone stand
»bubble-ts fehlt«, während die Blasen daneben zeichneten.
(134) ⚠ **ein Blatt, das alles in `renderVals` rechnet, meldet im Standalone 0/15** — die Rechnung
lief, nur zu früh: das Modul war beim ersten Rendern noch nicht geladen. Beide Blätter ziehen jetzt
nach. *Ein Messblatt, das »0/15« zeigt, ohne dass etwas kaputt ist, ist schlimmer als eines, das
gar nichts zeigt.*

**Slice C1b · Lettering in der Blase (12.8., nach Perplexity-Recherche + Coworker-Prüfung).**
Spec: `docs/overworld-v13/SPEC_lettering_2026-08-12.md` — **drei Zeichen, mehr nicht:** `*wort*`
(Betonung, fett), `…` (Pause/Auslaufen/Fortsetzung), `--` (Unterbrechung). Gestrichen: Kursiv-Markup,
zweite Betonungsstufe (bold italic), Uppercase-Zwang, Laufweiten-Dehnung, Token-Datenmodell mit
`marks[]`. Leitsatz: **ein typografisches Mittel, eine gesprochene Eigenschaft** — die Form trägt
Modus und Lautqualität, die Schrift nur Betonung, Pause, Abbruch.
Gebaut: `bubble-layout.js` **bl-v1.1** (`parse` · `normalisieren` · `segmente`, Deckel 1 Betonung bei
≤34 Zeichen, sonst 2) + `bubble-ts.js` **bubble-ts-v3**. Abnahme **15/15 · Umbruch 7/7 · Zeiten 15/15**.
(129) **Markup, das mitzählt, bricht die Zeile zu früh** — Umbruch und Zeiten rechnen auf dem
**sichtbaren** Text. `trailoff`: »...« → »…« macht aus 24 Zeichen 22, und die Zeit sinkt mit.
(130) ⚠ **fett ist breiter, also rechnet der Ausgleich in Pixeln** (Coworker-Fang): der ausgeglichene
Umbruch minimiert die Abweichung der Zeilen*längen* — mit einem fetten Wort ist die Zeichenzahl nicht
mehr die Länge. Die 28 Zeichen bleiben Deckel, die Ausgleichsrechnung nimmt die **gemessene** Breite,
und die Breitenfunktion bekommt je Wort den Schnitt mit. Ohne das sitzt genau die Zeile mit der
Betonung daneben.
(131) **ob eine Schrift Fettdruck kann, ist eine Messung** (Coworker-Fang): 400 gegen 700 gemessen;
unter 6 % Unterschied gibt es keinen echten Schnitt (synthetisch verfettet sieht bei 13 px matschig
aus). Dann trägt die Betonung Größe (×1,06) und Laufweite statt Fettdruck — ein Mittel, eine
Eigenschaft, nur ein anderes Mittel.
(132) **ein fettes Wort, das buchstabenweise einläuft, verliert seine Auszeichnung mittendrin** —
ein betonter Satz wird gesetzt, nicht getippt (wie der Ruf, Naht 128).
**Offen dazu:** die Anschluss-Ellipse bei geteilten Blasen (erste endet mit `…`, zweite beginnt mit
`…`) ist Spec, aber noch nicht im Code — sie gehört zu `split` in C3.

(128) **ein Schrei tippt sich nicht** — der Ruf wird jetzt **gesetzt**: Zeichen einzeln auf einem
flachen Bogen (15° Spanne, Drehung je Zeichen, Kipp ±1,6°, geseedet), dazu eine leichte
Gesamtneigung und Scherung. Bangers gerade auf der Linie las sich wie eine Überschrift.
Kein Filter, kein Warp — nur Buchstaben auf einer Kurve. Folge: für den Ruf ist das
Zeichen-für-Zeichen-Streaming **aus** (es würde den Bogen bei jedem Bild neu setzen).
`OW_BUBBLE.bogenSatz(text,seed,bogen)`; die Extremvariante aus Georgs Vorlage (starker Bogen,
Umriss-Schrift) bleibt eine Ausbaustufe.

**Abgleich mit dem Coworker-Handover (`uploads/HANDOVER_Bubbles_Design.md`), 12.8.:**
`docs/overworld-v13/ABGLEICH_bubbles_2026-08-12.md`. Deckungsgleich in allem Zählbaren (Fixtures,
Zeiten, Umbruch, Maße, »keine zweite Tusche«). **Ein echter Widerspruch:** die Bauanleitung §5.5
verlangt »**kein** gleichmäßiger Sternburst, 8–16 **unregelmäßige** Zacken«, gebaut ist auf Georgs
Ansage ein **Kranz** mit ±7 % Winkelstreuung — der erste, unregelmäßige Anlauf war von Georg als
Klecks mit Hörnern verworfen worden. *Regelmäßigkeit im Winkel ist billig, Regelmäßigkeit in der Zahl
ist Comic.* Vorschlag (nicht gebaut): ein bis zwei Zacken ×1,45, eine nach innen gekippt.
Sechs benannte Lücken (Gedankenpfad-Radien und Querversatz · Tail-Ansatz unteres Drittel +
Gesichts-Anker als Datum je Einheit + Deckel 22 statt 34 · Gedanke kursiv · Flüstern kontrastärmer ·
Wolke mit Bruchstellen · Debug-Schalter im Spiel) — alle in C2-Nachzug oder C3 einsortiert.
⚠ **Zwei Stellen veralteter Kanon im Handover:** »Puste, Witz, Schneid« ist am 9.8. verworfen (es
gelten sechs Werte + Fluff + POP), und »BLÖDSINN!« ist **beides** — sechster Wert **und** Todes-Regie.
**Perplexity:** zu Sprechblasen liegt im Workspace **nichts** vor (die zwei Blätter sind Tiny Swords);
drei Fragen sind im Abgleich §6 formuliert, damit der Abgleich nicht erfunden wird.

**Schrift-Variante (Georg 12.8.):** `OW_BUBBLE.SCHRIFTEN` — `courier` (Bestand) · `elite`
(*Special Elite*) · `shantell` (*Shantell Sans*), umschaltbar im Messblatt (Tweaks). Wer umschaltet,
ändert auch die **Messung**: `satz()` misst mit der wirklich gesetzten Schrift.

**Angefordert, noch nicht gebaut:** eine **wellige** Kontur (»emotional bewegt«) als sechstes
Register, hoch **und** quer — Vorlage liegt in `uploads/` (12.8.).

**Offen (O2), unverändert:** Kayfabulate als Kasten (so gebaut) oder als Blase mit doppelter Kontur.
**C3 findet vor:** `OW_BLAYOUT.PLACE` (Anker +6 px, Zipfel max 22 px, Emanatum 4 px, zwei Blasen).

**Eingang 12.8. spät: Franken-Bündel v2 (Georg, »update für später«)** — Pirate Bomb ist **fünf**
Figuren, **485 Bilder**, ~620 kB: Bomb Guy 58×58 (Inhalt 49×54, **kein Angriff**, dafür
`10-Door In`/`11-Door Out` mit je 16 Bildern = ein **Erscheinungsritual**), Bald Pirate 63×67
(39×59), Cucumber 64×68 (30×61, *Lunte auspusten* = defuse/deny), Captain 80×72 (48×67, Angstlauf),
Whale 68×46 (64×40, *Bombe verschlucken* = swallow/accept, einziger breiter als hoch). Weicher Saum
0,0 %, 14–21 Farben, Leinwand je Figur konstant, 20 fps kanonisch.
**Der inhaltliche Fund:** alle reagieren auf **denselben Gegenstand** verschieden — der Skeptiker
entschärft, der Gläubige schluckt, die Autorität flieht. Das ist die Card-Zone-Dynamik als fertiges
Animationsvokabular. Rollenvorschlag des Coworkers: Bomb Guy NPC/zweite Heldenhaut · Bald Pirate
Standard-Mob · Cucumber Skeptiker · Whale Gläubiger · Captain Card-Owner am Zugang.
In der Terrain-Probe sind alle fünf eingetragen (`PB_CHARS`, Bilderzahlen übernommen, nicht
geschätzt). **Für P2 kommt damit ein Manifest dazu** (Bündel §6, `kfb.sprite-pack/0.1`): der Lader
kennt nur `idle/walk/attack/…`, welcher Ordner dahinter liegt, steht in Daten — sonst kostet jedes
neue Paket (Kings and Pigs) eine Codezeile. **Noch offen:** `footY` als Vertrag, `view:"side"`
sichtbar halten, Tile-Set ungeprüft.

**Offen, unverändert aus §4v:** (1+2) Ink-Outline als System + Linienstärken · (3) Gummiband —
**vor dem Bauen messen** · (4) Sprechblasen mit Level · (5) sieben Einheiten ohne Porträt ·
Cartoon-Wasser-Referenzen (Georg).

---

## 5. Uploads / Briefings

`uploads/` hält 11 Markdown-Briefings (PetFlight-Sprint, Dragonflight, Partikel-Fix, Steuerungs-
Nachrichten) und 5 JSON (Deck-Daten, Jukebox, `kfb-index.json`). Zu sichten: was in einen Sprint
gewandert ist, gehört nach `docs/`; der Rest ist löschbar. **Entscheidung offen.**

## 6. Regeln

- Assets IMMER per GitHub-RAW laden, nichts Schweres ins Projekt (Decks, PDFs, GLBs, Texturen).
- `zone-registry.json` / `zone-index.json` sind **fremder Contract** — hier nur lesen. Änderungen
  gehen über den Coworker-Export, nicht über eine lokale Korrektur.
- Session-Export nach `session-export`: Manifest → Veto-Fenster → nur Session-Dateien. Nie Voll-Zip.
- Wer eine Version einfriert, ein Experiment beendet oder Assets verschiebt, trägt es hier nach.
