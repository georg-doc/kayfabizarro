# HOUSEKEEPING — KFB Travel v14 (main) + Satelliten (living document)

Zweck: EINE Quelle für Aufräum-Entscheidungen und Clean-Runs in **diesem** Workspace. Nichts wird
ohne Freigabe gelöscht. Die Status-Spalte ist die Wahrheit, nicht das Datum.

Legende: **AKTIV** (weiterbauen) · **FROZEN** (Referenz, nicht anfassen) · **SUPERSEDED** (ersetzt,
archivierbar) · **EXPERIMENT** (Wert offen) · **DEAD** (löschbar nach Sign-off) · **ASSET** (Binär).

**Die Rollenverteilung seit 2026-08-02:** `KFB Travel v14.dc.html` ist **main** — der Spieler.
Die drei cut-v4-Werkzeuge sind **Autoren-Werkzeuge**, kein zweites Spiel. Zwischen beiden steht
**ein Vertrag: `zone-registry.json` + `zone-index.json` an der Wurzel.** Wer die schreibt, ändert
die Welt; wer sie liest, zeigt sie. Diese Naht nicht verwischen.

---

## 0. Travel v14 — main (Fork 2026-08-02 aus v13/S93f)

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel v14.dc.html` + `terrain-v14/` (56 Module + `edge3.jpg` + 4 JSON) | die Reise, Arbeitsstand | **AKTIV — main** |
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

**Nicht gebaut, aber spezifiziert** (Slices M3–M6 im Handover): Sternkarte mit Turm im Zentrum und
sechs terrainfolgenden Pfaden · Kartenzone mit Gummi-Outline, Fluid-Gutter und Holzbrücke ·
drei Wellen mit Boss · lebendige Biome in vier Zuständen.

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
