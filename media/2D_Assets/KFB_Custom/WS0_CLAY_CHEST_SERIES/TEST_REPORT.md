# WS0 Clay Chest Prompt System · Evidence / Test Report

Stand 2026-11-04 · Prüfer: ChatGPT Web Chat (Dokumentations- und Paketinspektion; **keine** eigenständige Neuabnahme der Kunst).

## Auftrag

Historische WS0-Chest-Serien als **Prompt-/Stilvertrag**, nicht als neues Bild-/Game-Plugin, für frische Chats nutzbar machen. Sichtbare historische Quellen prüfen, Export/Alpha-Fehler ehrlich benennen, Repo-Texte persistieren.

## Testumgebung und Befunde

**Lokal im aktuellen Gesprächscontainer**, Python 3 + Pillow + `zipfile`:
- **8 tatsächlich vorhandene ZIP-Pakete gelesen** (7 finale Themen und 1 frühere Robot-Kandidatenvariante).
- **112/112 PNG-Einträge** öffnen; **112/112 RGBA**; **112/112 Alpha enthält Transparenz und sichtbare Pixel**; **112/112 linke obere Ecke transparent**.
- **96/96 Einzel-PNGs** im 512×512-Format.
- **16/16 Sheet-PNGs** im 1536×1024-Format.
- **0** unerwartete Bildabmessungen, **0** ZIP-Lesefehler in diesen 8 Paketen.
- Das ist **format/alpha smoke PASS**, **nicht** eine perfekte Alpha-Freistellung: visuelle Halos/Checkerboard-Farbkontamination, Überlappungen oder falsche Blickrichtungen werden durch diese Tests **nicht** ausgeschlossen.
- In Sheetdateien waren ungefähr **58,8–68,6 %** der Pixel volltransparent. Dieser Bereich ist ein **gemessener Bestandswert**, kein universeller Qualitätsgrenzwert.
- `media/2D_Assets/sprite-sheet-builder.html` auf GitHub gelesen: Default 7×5 / 192, White-Key/Schatten/Footline vorhanden. Für 3×2-Chests **kein tatsächlicher Builder-Run**; Kompatibilität bleibt `NOT_TESTED`.

### Genau geprüfte ZIP-Dateien (Container-Originale, **nicht in GitHub importiert**)

| Paket | PNGs | Rolle |
|---|---:|---|
| `kfb_trash_loot_chests_12_transparent_png.zip` | 14 | final |
| `kfb_nature_biome_clay_chests_12_transparent_png.zip` | 14 | final |
| `kfb_surreal_books_clay_chests_12_transparent_png.zip` | 14 | final |
| `kfb_broadcast_media_clay_chests_12_PNG.zip` | 14 | final |
| `kfb_robots_transhuman_chests_12_RGBA.zip` | 14 | final |
| `kfb_philosophy_wisdom_chests_12_RGBA.zip` | 14 | final |
| `kfb_meta_biology_organ_chests_12_RGBA.zip` | 14 | final |
| `kfb_robot_cyborg_transhuman_chests_12_RGBA.zip` | 14 | früherer Robot-Kandidat, **nicht** zusätzliche akzeptierte Serie |

Keine Aussage über die *nicht* in diesen acht ZIPs enthaltenen frühen Bereiche (Generika, Horror, Sci-Fi, Ancient, Epic, Retro-PC) als technische Paketprüfung ableiten. Diese wurden im Chat visuell akzeptiert, sind hier aber **nicht vollständig ZIP-geprüft**.

## Source-isolated style donor proof (nur Session-Artefakt)

- **12 einzelne** 512×512-RGBA-Che sts aus verschiedenen **Georg-PASS-Reihen** isoliert und zu einem separaten Referenzpaket gepackt: ein Ur-Mimic, Trash-TV, Trash-Entchen, zwei Nature-Varianten, zwei Buch/Comic-Varianten, zwei Broadcast-Varianten, ein Robot-Brain, Zen und Herz.
- **12/12** Donor PNGs werden als RGBA gespeichert, alle mit transparentem Außeneck.
- Kontaktbogen **4×3 ist ausschließlich ein isoliertes Donor-Vergleichsblatt**, **nicht** das 3×2-Produktionssheet.
- Die visuellen Proofs `VISUAL_QA_DARK.jpg` und `QA_AT_96_PX_DARK.jpg` wurden im aktuellen Chat geöffnet; Augen, Lid und Kistenkörper sind in diesem Sample bei 96px insgesamt erkennbar, teils sehr kleine Zusatzdetails erwartbar verloren. Eine neue externe Kritik wurde **nicht** durchgeführt.
- Ein separat bereitgestelltes **Session-only Referenzarchiv** enthält 12 isolierte PNGs, Vergleichsbogen, zwei Proof-JPGs, SHA256-Manifest/README: `WS0_CLAY_CHEST_STYLE_ANCHORS_2026-11-04.zip`, **17 Einträge**, **5.088.865 Bytes**, SHA256 `2b1028735e0a519d790ad9aa3334d1677fb688d173769ef24e47754b28c8394e`.
- **WICHTIG:** Das ZIP liegt als Chat-Download **außerhalb von GitHub**. Ohne späteren echten Import plus isolierte Quellenprüfung gilt `SOURCE_NOT_ARCHIVED`. Aus dieser Markdown-Datei allein entsteht kein nachweislich gehosteter Bild-Donor.

## Dokumentation / GitHub Writes

Dateien werden auf einem dedizierten WS0-Dokumentationsbranch geschrieben. Nach **jedem** GitHub-Write wird der tatsächliche Branch-Ref/head und die neue Datei per `fetch_file` wieder gelesen und auf **exakten UTF-8-Inhalt** verglichen. Den endgültigen SHA und PR-Stand führt `RETURN.md`. Dies ist ein Prüfbericht dieser konkreten Runde, kein Ersatz für die erneute QA bei einer künftig generierten Serie.

## Bewertung

- **PASS**: Stil- und Prompt-DNA aus Chat nachvollziehbar; ursprünglicher User-Brief wörtlich abgelegt, selektive tatsächlich sichtbare Bildprompts als Historie; 12-slot Anti-Drift-Plan.
- **PASS**: lokal nachgemessene 112-Bild-Datei- und Format/Alpha-Smoke-Checks.
- **PASS**: 12 isolierte, lokale Stilanker plus 96px-Dunkel-Vergleich als Session-Download vorbereitet.
- **NOT_TESTED**: Neuer Bildjob unter dieser Prompt-Rezeptur; farbsäumefreie Alpha-Kanten bei allen 162 historischen Figuren; Sprite-Builder-End-to-End; GitHub-Librarian-Asset-Import; tatsächliche Plugin-Installation/Ausführung; KFB-Game-Integration.
- **UNRESOLVED**: Dauerhafter, source-backed Import der historischen visuellen PASS-Donors in einen bestehenden WS0-/Librarian-Ort; dieser Text-Commit legt keine binären Bilder dort ab.

## Ein nächster Gate

Mit dem gespeicherten Prompt-System **ein frisches 12er-Thema als zwei separate 3×2-Sheets** erzeugen, konkrete Gaze-/Clasp-/Silhouette-Verteilung und Alpha/96px prüfen, **Georg PASS/TUNE/FAIL**; anschließend visuelle Donors bei genehmigtem Import tatsächlich archivieren.

