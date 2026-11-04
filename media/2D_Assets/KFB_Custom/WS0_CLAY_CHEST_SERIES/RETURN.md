# RETURN · WS0 Living Clay Chest Series Prompt System · 2026-11-04

## Current additive status · 2026-11-04 · FROST R1 CANDIDATE

The next 12er topic **Frost & Frozen Wonders** has been generated as a session-local pack with two output 3×2 sheets, twelve 512² RGBA cutouts and a 96px contact. Technical tests: 12/12 sprites RGBA/transparent corners, 2/2 sheets 1536×1024, all sprites >=41px side padding, ZIP 16 files / CRC PASS. The source images were produced as two 6×2 contact generations and repacked; the generator did not directly obey native 3×2. More importantly, eye gaze and right-side gold keyhole are still somewhat repetitive, so the new style-system anti-drift goal remains **TUNE/NOT YET PROVEN**. **Georg acceptance is PENDING**. No PNG binary imported to GitHub; no runtime/Stage change. Exact candidate details: `SERIES_FROST_R1_2026-11-04.md`.

**Current one next gate: Georg visually reviews Frost R1 → PASS / TUNE / FAIL.** This current status supersedes the earlier “generate a new 12er sample” next gate later in this Return.


**Status:** **DOCUMENTED & GITHUB-VERIFIED · DRAFT PR · NO AUTO-MERGE · NO DEPLOYMENT**  
Owner **WS0 visual authoring**; keine Änderung an Asset-Librarian-, World-, ChatterBox-, 3D- oder Game-Runtime-Ownern.  
Repository: `georg-doc/kayfabizarro`  
Branch: `docs/ws0-clay-chest-prompt-system-2026-11-04`  
Draft PR: **[#465](https://github.com/georg-doc/kayfabizarro/pull/465)**, base `main`  
Branch start: `main@7e1c4ab0f143b2f1c0f33017eb473574f20190c9`.  
Evidence checkpoint before this Return: `47f79c7412cf8f62ca7b864805d7ab042863cfb6`. **Der genaue spätere Head ist die aktuelle Branch-Ref / PR Head, nicht diese prä-Return-Checkpoint-ID.**

## Was ist fertig?

Der im langen Chat erfolgreich entwickelte Clay-Chest-Look ist in **einer dauerhaften WS0-Authoring-Anleitung** erklärt, mit:
- originalem User-Masterbrief im Wortlaut;
- **14 human-PASS-Themenrunden** (Initialserie 6 + dreizehn 12er-Serien = 162 Figur-Designs als historische Auftragsmenge);
- vier tatsächlich im Chat sichtbaren historischen Bildprompts als Belege, klar getrennt vom verbesserten Zukunftsprompt;
- **themenagnostischem** Prompt-Baukasten und zwei **separaten 6er-Image-Jobs**;
- 12-Slot-Plan für **Gaze, Lid, Lock/Clasp, Proportion, Ausdruck, Farbwelt und Überraschung**;
- maschinenlesbarer `SERIES_RECIPE.template.json` als Input für neue Themen;
- **zwei 3×2-Sheets**, 12 RGBA-Einzelbilder, 96px Game-Readability, konkrete Alpha/Masking/Cropping-QA-Regeln;
- kontrollierter Übertragbarkeit der Produktionsmethodik auf andere **KFB-Asset-Familien**, ohne automatisch Schatztruhen-Merkmale dorthin zu kopieren.

## Changed files (neuer WS0-Dokumentationspfad)

`media/2D_Assets/KFB_Custom/WS0_CLAY_CHEST_SERIES/`
- `README.md` — Einstieg, Prompt zum Start in frischem Bildchat, Ownership.
- `PROMPT_SYSTEM.md` — Golden-ähnliche **Stil-Rezeptur** (nicht World-Material-Golden), Slotmatrix, Bildprompts, Anti-Drift.
- `SERIES_PROVENANCE.md` — vollständiger PASS-Runden-Census, Originalbrief und exakt sichtbare historische Prompts, Quellenstatus.
- `SERIES_RECIPE.template.json` — 12 maschinenlesbare Slots, Produktionsparameter und QA-Gates.
- `EXPORT_QA.md` — echte Alpha-Transparenz, Split 2×3×2, Format-/96px-/Zellgrenzen-Prüfung.
- `TEST_REPORT.md` — tatsächlich gelaufene lokale Datenprüfung und visuelle Proof-Einschränkungen.
- `CHANGELOG.md` — additive History.
- `RETURN.md` — dieses Handoff.

**Keine vorhandene Datei außerhalb dieses Pfads verändert.** Bestehender Builder `media/2D_Assets/sprite-sheet-builder.html` nur inspiziert, **nicht** modifiziert oder ausgeführt. `skills/chat/START_HERE.md`, `REGISTRY.json`, KFB Hub und `main` bleiben unangetastet, denn dieser Dokumentations-Slice hat keinen neuen P0-/URL-/Produkt-Routing-Gate und keine Site-Integration.

## Tatsächliche Tests/Evidence

- **8 lokale ZIPs → 112 PNG-Dateien** überprüft: 112/112 RGBA; 112/112 `alpha min=0, max>0`; 112/112 transparente obere linke Ecke; 96/96 Einzelbilder 512×512; 16/16 Sheets 1536×1024; 0 ZIP-Fehler und 0 unerwartete Dimensionen.
- Darunter 7 finale Serien + 1 ältere Robot-Variante (**kein** doppelter HUMAN PASS).
- **12 isolierte Visual-Source-Beispiele** aus in diesem Thread abgenommenen Bildserien als lokale Chat-Referenz zusammengestellt. Dunkle Vergleichsfläche und 96px-Kontaktbogen im Container visuell geöffnet.
- Session-only ZIP der 12 Referenzbilder: `WS0_CLAY_CHEST_STYLE_ANCHORS_2026-11-04.zip`, SHA256 `2b1028735e0a519d790ad9aa3334d1677fb688d173769ef24e47754b28c8394e`, **17 Dateien**. Es ist **NICHT im GitHub-PR enthalten**.
- Prompt-Rezept-JSON nach GitHub-Write erneut geholt und geparst, exakt 12 Slots. Jede GitHub-Schreiboperation wurde durch **exakten Branch-Ref-Head und vollständigen `fetch_file`-Textvergleich** geprüft.
- **Nicht getestet**: tatsächliche neue 12er-Bildausgabe unter dem Zukunftsprompt; E2E-PNG-Export des bestehenden Builders; visuelle Alpha-Halo-Freiheit aller historischen 162 Sprites; Bild-Asset-Import in ein permanentes Repo/Librarian; Laufzeitintegration/Plugin-Skill.

## Grenzen und offene Punkte

1. **Source import**: Die Chat-PNG-Bytes sind nicht in diesem GitHub-Branch. Archivpfad, Hash und isolierter Visu-Donor im bestehenden Asset-Librarian/WS0-System müssen für ein dauerhaft **source-backed** Bild-Golden später tatsächlich gespeichert und geöffnet werden. Keine Dummy-Verlinkung auf Containerpfade.
2. **Reproduzierbarkeit**: Es liegen keine abgesicherten historischen Modell-/Seed-/Sampler-Metadaten vor; Prompts garantieren keinen pixelgleichen Re-Render.
3. **Blick-/Schloss-/Schmalheitsdrift**: Durch Zukunftsregeln adressiert, aber erst ein **neuer** Bildjob belegt die Wirksamkeit.
4. **Alpha-Qualität**: Die 112 Checks belegen echtes RGBA/Transparenz, nicht automatisch jeden sauber freigestellten Alpha-Rand.
5. **Draft PR bleibt ungemergt**, keine Site-/Cloudflare-Stage-Route und kein Live-Anspruch.

## Genau ein nächster Gate

**WS0-Bildchat: eine neue 12er-Familie unter dieser Rezeptur generieren (zwei getrennte 3×2-Sheets), 96px und Alpha/Proportion/Gaze/Lock prüfen; Georg entscheidet PASS/TUNE/FAIL.** Erst bei bewusst autorisierter Archiv-/Merge-Aktion visuelle Donorbytes nach GitHub/Librarian übernehmen und exakte Source-Objekte isoliert belegen.

## Fresh-chat start line

> WS0 Clay Chest Series: lies im bestehenden Repo den `README.md`-Einstieg unter `media/2D_Assets/KFB_Custom/WS0_CLAY_CHEST_SERIES/` (Draft PR #465, solange nicht gemergt), dann `PROMPT_SYSTEM.md`, `SERIES_RECIPE.template.json`, `EXPORT_QA.md` und `SERIES_PROVENANCE.md`. Arbeite in zwei echten 3×2-Image-Jobs, liefere 12 transparent isolierte PNGs + Manifest/ZIP, teste Augen/Schlösser/96px, und verlange echte Source-Donor-Ansicht statt bloßer Asset-URL.

