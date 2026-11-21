# WS0 · KFB Living Clay Chest Series · Wiederverwendbare Bildproduktions-Grammatik

Status: **SOURCE/PROMPT CONTRACT v1.0 · DOCUMENTED · NO NEW TOOL/PLUGIN/RUNTIME**  
Stand: 2026-11-04 · Owner: **WS0 (KFB Design-/Bild-Authoring)** · Georg: **alle hier erfassten Serien visuell PASS**  
Repo: georg-doc/kayfabizarro · Branch: docs/ws0-clay-chest-prompt-system-2026-11-04

## In einem Satz

Eine überraschende Themenidee wird zu einer **lebenden, klar erkennbaren Schatztruhe** aus echter handmodellierter Cartoon-Knete: Augen schauen aus dem Deckelspalt, eine glaubwürdige Öffnung/Schließe bleibt erkennbar, und jede Figur hat eigenständige Gestalt, Stimmung, Blickrichtung und Pointe. Ausgabe standardmäßig **zwei 3×2-Sheets à 6**, **12 Einzel-PNGs mit echter Alpha-Transparenz**, plus Manifest/QA/ZIP.

## Einstieg für neuen Bildchat (copy/paste)

> Lies zuerst https://github.com/georg-doc/kayfabizarro/blob/docs/ws0-clay-chest-prompt-system-2026-11-04/media/2D_Assets/KFB_Custom/WS0_CLAY_CHEST_SERIES/README.md und PROMPT_SYSTEM.md sowie EXPORT_QA.md im selben Ordner. Produziere eine neue KFB-Clay-Chest-Serie zum Thema: **[THEMA]**. Zwei echte 3×2-Sheets mit jeweils sechs verschiedenen Truhen, danach zwölf 512×512-RGBA-Einzelbilder und ZIP. Behalte echte Knetfingerabdrücke, dicke Clayformen, Charakteraugen aus dem Lid-Gap, lesbaren Öffnungsmechanismus, eigenständige Silhouetten/Gazes/Locks. Keine Text- oder Background-Fakes; 96px-Lesbarkeit prüfen. Nicht als PASS behaupten, bevor ich die Bilder abgenommen habe.

**Zuerst einen existierenden PASS-Chest als isolierten visuellen Stil-Donor anzeigen**, falls das Bild tatsächlich als Quelle verfügbar ist. Seine bloße URL oder ein Dateiname ist kein Bildbeleg. Fehlt ein abrufbarer Donor, so benennen und ausdrücklich mit diesem Textvertrag arbeiten; kein generischer Bildersatz.

## Was ist bindend, was nicht?

- **User-Entscheid**: Die bisher in diesem Thread gezeigten Serien wurden vom Nutzer mit PASS angenommen. Daraus folgt **Stilfreigabe**, nicht automatischer Import der Bildbytes ins Repo.
- **Dieses Paket** ist eine **WS0-Authoring-Rezeptur**, kein zweiter Asset Librarian, kein Plugin-Release, kein Chest-Runtime-Modul, kein 3D-Rig und keine Änderung an KayKit oder KFB World.
- **Visuales KFB-Umfeld**: der bestehende `skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md` und `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`; Bildsets bleiben Quellen/Anker, nicht automatisch World-Material-Golden.
- **Vorhandenes Werkzeug**: `media/2D_Assets/sprite-sheet-builder.html` ist ein möglicher Editor/Exporter. Seine Auto-Slice-/White-Key-/Shadow-Defaults sind **nicht** als erfolgreich für diese Chests getestet; niemals blind auf RGB/Alpha anwenden. Dokumentierte PNG-Pipeline in EXPORT_QA.md.
- **Keine Stage/Site nötig** für einen reinen Dokumentations-/Prompt-Slice. Kein Runtime-Owner und kein Public-Link erzeugt.

## Lesen, Produzieren, Prüfen

1. `PROMPT_SYSTEM.md` — Bild-DNA, Baukasten, Unterschiede, 6er-/12er-Prompts, Erweiterung auf andere Asset-Typen.
2. `SERIES_PROVENANCE.md` — menschliche PASS-Serie, tatsächlich sichtbare historische Prompts vs. rekonstruierte Vorgaben, Quellenstatus.
3. `EXPORT_QA.md` — 3×2-Raster, PNG-Alpha, 96px, visuelle Probe, negative QA, Sprite-Metadaten.
4. `TEST_REPORT.md` — nachgemessene, eng begrenzte technische Bestandsaufnahme dieser Runde.
5. `SERIES_RECIPE.template.json` — maschinenlesbare 12-Slot-Inputvorlage für neue Themen (kein ausführbares Plugin).
6. `CHANGELOG.md` + `RETURN.md` — Fortsetzung/Recovery und ein nächstes Gate.

## Bindende Stilkerne (Kurzform)

**Keep**: plastische, unregelmäßige, matt-satte Clayoberflächen; händische Fingerabdrücke und Werkzeugspuren; drei-Viertel-Ansicht leicht von oben; weiches Licht links oben; starke Silhouette; Augen weiß/schwarze Pupillen + dünne Lids; Deckelspalt; Verschluss oder Schließe; überraschende Idee pro Truhe; voll im Frame; echte RGBA-Transparenz ohne Boden oder Schatten; 96px-Silhouette.

**Variieren**: breit/quadratisch/hoch, anthropomorphe Stimmung, Gaze, Lid-Öffnungswinkel, Schlossposition und -form, Themen-Fundstücke, Farbpalette, Materialverschleiß, Gesichts-/Augen-Acting.

**Never**: eine 4×3-Gesamtfläche als angebliche zwei 3×2-Sheets ausgeben; bunte/karierte Hintergrundpixel als „transparent“ melden; an Zellkanten beschnittene Silhouetten; zwölf identische Augen-/Schloss-Kompositionen; generische UI, Sockel, pseudo-realistische Menschkörper oder komplette Truhen-Verwandlung ohne schlüssigen Deckel.

## Nächster Gate

**Eine neue 12er-Testserie mit gezielt planbaren Augen-, Schloss- und Proportionsvarianten generieren, 96px/Alpha prüfen, Georg entscheidet PASS/TUNE.** Keine automatische Veröffentlichung oder Merge.
