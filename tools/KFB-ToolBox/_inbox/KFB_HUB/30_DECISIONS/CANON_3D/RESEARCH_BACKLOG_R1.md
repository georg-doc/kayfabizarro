# Recherche-Backlog 3D · R1 · 2026-10-20 · WS0 (V-563)

**Regel:**
- **Fehlt Wissen, wird recherchiert.** Ausführen sollen Web-Chat, NotebookLM, Perplexity oder WS1, also wo die Tokens sind.
- **Jedes Ergebnis landet als Datei** in `CANON_3D/sources/`. WS0 zieht daraus Regeln in `CANON_3D_R1.md` und macht sie prüfbar: ein Gate-Test oder ein Kritiker-Kriterium.

**Format je Ergebnis:**
- Regeln in Zahlen;
- je Regel die Quelle;
- „gilt für KFB“ oder „nicht übernommen, weil …“.

| Nr. | Thema | Warum offen | Ergebnis wird zu | Priorität |
|---|---|---|---|---|
| R1 | **Inszenierung von 3D-Dioramen und Szenen aus festen Spielkameras:** Fokus, Leserichtung, Wert- bzw. Hell-Dunkel-Massen, Tiefenstaffel, Führungslinien, Silhouette, Rahmung; Etherington „How to Think When You Draw“ (Staging-, Komposition- und Perspektiv-Tafeln), Disney/Pixar-Layout, Diorama-Fotografie, Stop-Motion-Set-Design (Aardman, Laika) | keine Recherche vorhanden; NotebookLM-Prompt P4 behandelt nur die Fahrkamera | Kanon Gebiet 12 + Gate (Fokus-Kontrast, Freiraum um den Fokus) + K1/K3 | **1** |
| R2 | **Etherington-Originale gegenlesen:** Größenverhältnis, Einsinktiefe, Tangenten, Gruppengrößen, Fels-, Baum- und Wasser-Regeln | offen in ETHERINGTON R2 §7 und Grammatik R2 §6 | Korrektur der Startwerte in `kfb_env.SINK`/`RULES` | **1** |
| R3 | **Set-Dressing und Story-Muster** („Was ist hier passiert?“): Requisiten-Funktionsgruppen, Story-Stamps, Environmental Storytelling in Spielen (Naughty Dog, Ghibli-Hintergründe, Animal Crossing, Tiny Glade, Townscaper) | P3 nennt Stamps, gebaut wurde es nie | Kanon Gebiet 3 + Stamp-Bibliothek in `kfb_env` | **1** |
| R4 | **Farbtheorie und Colour-Script** extern (Mary Blair, Pixar Colour Scripts, Wertstruktur vor Farbe) gegen die J17-Messung | bisher nur aus J17 gemessen | Gebiet 6 + K2-Kriterien + Wertprüfung (Graustufenbild) | 2 |
| R5 | **Schwebende Inseln:** Körper, Kante, Unterseite, Wasser (NotebookLM P5, Prompt liegt vor) | Ergebnis nie gespeichert | Gebiet 5 | 2 |
| R6 | **Knete-Rendering, Performance, QA-Pipeline** (NotebookLM P6, Prompt liegt vor); dazu die ClayBound-Studie aus dem Repo auf die Platte holen | Ergebnis nie gespeichert bzw. nur im Repo | Gebiet 8 + Blender-Knetmodul | 2 |
| R7 | **Augen und Gesichts-Acting** (Lead/Lag/Lock/Float, Blinzeln, Blickführung) über die Bizarro Motion Matrix hinaus | keine externe Recherche | Gebiete 9 und 10 + Bewegungs-Gate | 2 |
| R8 | **Lokomotion und Choreografie verdichten:** Recherche liegt vor (`S/RESEARCH_LOCOMOTION_PRACTICE.md`, `S/CHOREO_RESEARCH_01.md`), es fehlt eine Spec | nie zur Spec gemacht | Gebiet 10 (WS0 schreibt, keine neue Recherche nötig) | 2 |
| R9 | **Style Guide 3D R2:** `STYLE_GUIDE_3D_R1` + `MOTION_GUIDE_R1` mit V-305…V-563 zusammenführen | veraltet (11.10.) | ersetzt beide, verweist auf diesen Kanon | 3 |

**Prompts:** P5 und P6 stehen in `sources/KFB_DEEP_RESEARCH_PROMPTS_R1.md`. Für R1–R4 schreibt WS0 die Prompts im selben Format, sobald Georg die ausführende Stelle nennt.

## Erledigt (20.10.)
- R1 Inszenierung, R2 Etherington-Abgleich, R3 Set-Dressing, R4 Farbtheorie: WS1, Anhang A (V-570).
- R10 Cartoon-Hintergründe, R11 3D-Farbe/Licht, Flächengrammatik: WS1, Anhang A.
- R12 Cartoon-Animation-Abgleich, R13 Himmel/Horizont/Ferne: WS1, Anhang B (V-575).
- Offen bleiben R5 (Inseln), R6 (Knete-Rendering), R7 (Augen-Acting), R8 (Lokomotion-Spec), R9 (Style Guide R2).
