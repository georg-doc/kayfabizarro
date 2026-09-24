# KFB ToolBox · Stage-First working line

**Stand 2026-09-16 · Status: P0 slice tested · GEORG ACCEPTANCE PENDING**

| Was | Wo |
|---|---|
| Start (Actor · Face · Pose · Motion · Voice · Stage) | `src/KFB ToolBox Stage-First v1.dc.html` |
| Prüfstand (13 Checks, Roundtrips im Speicher, Sitzung gesichert/wiederhergestellt/nachgemessen) | `qa/Stage-First QA.dc.html` → »Run 13 checks« |
| Return mit Source Map, Promotion-Matrix, Delta-Matrix, Tested Result | `RETURN_STAGE_FIRST_P0_2026-09-16.md` |
| Hashes | `SOURCE_MAP.json` |
| Donor unverändert (Vergleich) | `src/KFB FrankenStein Studio v18.dc.html` |
| Profile (v18-Export, byte-gleich) | `profiles/kfb-pet-gothgirl.json` · `profiles/kfb-pet-hihi.json` |

`src/` = WS0 `A_QUELLSTAND/src` (87 Dateien, getestet) + drei v18-Module (`goth-biped.v1`, `browfit.v1`, `inkform.v2`) + v18-Blatt + Stage-First-Blatt. Kein Modul wurde nachgebaut oder verändert. Die sieben WS0-Blätter starten hier weiterhin.

Regeln: `../AGENTS.md`. Entwürfe leben in `localStorage` (`kfb-pet-library-v9`, `kfb-pet-studio-v5`). Die Bedien-Handler schreiben sie auch während eines Prüflaufs (v18 F10) — der Prüfstand sichert den Stand vorher, stellt ihn nachher wieder her und mißt das in Prüfung 13.
