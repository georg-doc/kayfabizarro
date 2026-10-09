# RETURN · KFB Clay Stage R1 · Billboards + Bühne mit Vorhang im Clay-Look (09.10.2026)

Von Claude Design an Georg / Web Lead / WSA. Claude Design pusht nicht. Lieferung = ZIP + Preview.
Einstieg: `KFB Clay Stage R1.dc.html` (statischer Server; file:// blockiert ES-Module). Bühne braucht WebGPU.

## Fünf Zeilen
- **Ziel:** ein Design-Preview für den MVP, in dem Billboard Family und Theatervorhang denselben Clay-Look und dieselbe Palettenlogik teilen.
- **Eigentümer:** Billboard Media Residency (Billboard Family) · Theatre Curtain Core (Issue #372).
- **Quelle:** Billboard Family v1 (lokal, 04.10.) · Vorhang-Recovery 07.10. `candidate/kfb-curtain-core.js`, `CURTAIN_MODULE_CONTRACT.md`, `MATERIAL_LOOK_STUDY.md`, `KEEP_TUNE_REJECT.md`, `FAIL_ANALYSIS.md` @main · Brief `BRIEF_CLAUDE_DESIGN_CURTAIN_CLAY_R1.md` (Upload) · world-context/world-palettes @5b523eb.
- **Geschützte Grenze:** Vorhang-Kern und Vertrag unverändert (wird unverändert importiert). Billboard Family v1, CLAY-01, H13, Quote-Daten, WorldContext unverändert.
- **Fertig, wenn:** Tafeln und Bühne zeigen in einer Seite denselben Look, ein Palettenwechsel färbt beide, keine schwarzen Leuchtpunkte, 02 neu gebaut, Look-Tafeln geschlossen/halb/offen/Bühne nah/Rahmen gesamt.

## Dateien
| Datei | Was |
|---|---|
| `KFB Clay Stage R1.dc.html` | Bildschirme: Billboards · Bühne + Vorhang · Design-Logik · A/B/C wie v1 |
| `palette-roles.js` | EIN Besitzer der Rollenzuordnung (Stops + wc.accent → Rollen) für Tafeln und Bühne, inkl. bulbOn/bulbOff |
| `billboards/kit.js` | Kopie v1 + `strokeOutline` (ein Umriss Schaft+Spitze), `offsetShape` (konstante Kontur), roundPoly mit Radius je Ecke · 02 neu · 05 korrigiert · 07 Title Belt neu |
| `billboards/stage.js` | Kopie v1 + Rollen aus palette-roles · Birnen an/aus und Leuchtkugeln aus der Palette · Fassung je Birne · `pause()` · `palette()` |
| `curtain/clay-look.js` | kleidet den unveränderten Kern ein: Stoffmaterial + Decals im clothUV-Raum, Hardware-Materialien, statische Bühnen-/Rahmengeometrie |
| `curtain/host.js` | Demo-Host (wie `kfb-curtain-host-demo.js`): WebGPU-Renderer, Kamera, Licht, Prospekt, Takt, Enter |
| `evidence/` | Belegbilder dieses Laufs |

## Aus dem Vorhang-Bestand
- **Übernommen:** Cloth-Kern T1–T10 (unverändert importiert) · Patina/Decals im clothUV-Raum mit niedriger Frequenz (MATERIAL_LOOK_STUDY) · keine Kachel-Textur, keine Normal-Map auf bewegtem Stoff · Weltraum-Rauschen nur statisch · Masking-Border · Footlight-Spot über `setFootlights()` · kein Schild vor dem Vorhang als Identitätsträger.
- **Verworfen:** Samt #4a0b11 mit Sheen 1,0 · Gilt-Messing · Stein-Proszenium mit Bogen · Swag-Pelmet mit Fransen · dunkles Opernlicht/HDR-Esplanade.
- **Neu:** Knete/Filz (Sheen 0, Rauheit 0,9) · Decals: zwei Flicken je Bahn mit Naht, Flecken, Greifspur, Kantenabrieb, ausgeblichene Bahnen, Saumband mit Stich, Staub · 21 Bodenbretter mit Fugen, Versatz, Nägeln, überstehender Planke, Flickenbrett · Knetstein-Sockel, gedrechselte schiefe Säulen, Bretter-Flats, Querbalken mit Kopfbändern, gemaltes Schild ohne Schrift · Knet-Wülste, Rosetten, Knetkugel-Quasten (eine lose) · fünf Knet-Laternen.

## Ehrlichkeit
| Feld | Stand |
|---|---|
| SOURCE | siehe fünf Zeilen; Vorhang-Kern über jsDelivr `@main`, nicht gepinnt |
| DECISION | Kern wird mit `{proscenium:false, floor:false, hardware:'rings'}` erzeugt und von außen eingekleidet, statt eine Kopie zu ändern (keine zweite Wahrheit). Stoff = Rolle `cloth` (mitte, 30 % zum Dunkel), Schmuckvorhang = `frame`. Tafeln und Bühne lesen dieselben Rollen. Zwei three-Builds auf einer Seite (0.180 WebGL für Tafeln, 0.186 WebGPU für den Vorhang); je Bildschirm rendert nur einer, der andere pausiert. |
| IMPLEMENTATION | Dateien oben. Kern-API benutzt: createTheatreCurtain, warmup, update, snap, requestReveal, cover, impact, setFootlights, onState. Halb offen = Host hält den Takt bei 50 % an. |
| TESTED RESULT | Im Preview gesehen (Bilder in `evidence/`): 02 Front/Hero/Seite/Nacht, 05 Hero, 07 Front/Hero, Lineup; Bühne Front geschlossen/halb/offen, Rahmen gesamt, Bühne nah, Seite, Stoff nah; Palettenwechsel CARDS → BIOME scorched → luminous färbt Bühne und Tafeln. Decals bleiben beim Öffnen auf derselben Falte (Halb offen). Konsole: nur Warnung „Multiple instances of Three.js“. |
| NOT_TESTED | fps auf Zielgerät (Vorschau-Rahmen gedrosselt) · Safari/Firefox · Mobil · Gerät ohne WebGPU (Pfad zeigt Hinweis, Kern meldet fallback_reveal) · Character-Select-Einbau · Impact im Look |
| EXPORT | Projektordner `KFB_Clay_Stage_R1/` + DC als ZIP |
| PUBLIC DEPLOYMENT | NOT RUN |
| GEORG ACCEPTANCE | OPEN |
| OPEN | (1) Geschlossen ist der Stoff fast glatt: der Kern setzt die Pin-Amplitude bei geschlossenem Vorhang auf 0 (T3/T10). Tiefe Falten im geschlossenen Zustand wären ein Kern-TUNE, nicht Teil dieses Slices. (2) Kern ungepinnt (@main). (3) Rubbel-Grammatik und `kfbBlend` nicht gelesen und nicht eingebaut. (4) Bühnenholz ist modelliert, nicht aus KayKit/Tiny-Treats-Assets abgeleitet. (5) 01/03/04/06 nur Licht/Fassungen geändert, Silhouette wie v1. |

## Ein Gate
**GEORG CLAY STAGE REVIEW** (Bildschirm Billboards oder Bühne): je Tafel und für die Bühne KEEP / TUNE / DROP.
Offene Prüffrage: Trägt die 02-Bauweise (ein Umriss, konstante Kontur, Lichtkanal) als Vorlage für alle Tafeln?
