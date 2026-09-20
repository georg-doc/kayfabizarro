# KFB Resident Atlas · S6

Viewer und Messwerkzeug für KayKit-Bewohner-Vignetten. 21 Residents, drei Rig-Klassen, alle Rezepte datengetrieben.

Start: siehe `START_HERE.md`. Übergabe: `docs/RECOVERY.md`.

**Legacy source update · 2026-09-18:** [KayKit Legacy Intake](docs/LEGACY_INTAKE_2026-09-18.md) records newly available Skeleton, Spooktober, Orc Warband and Dungeon 1.0 resident/prop candidates. The existing 21-resident S6 cast is unchanged; new identities remain candidate-only until explicitly authored.

## Dateien

| Pfad | Inhalt |
|---|---|
| `KFB_Resident_Atlas_S6.html` | Einstiegspunkt, Viewer-UI, Studio-Panel |
| `KFB_Resident_Atlas_S5.html` | Vorgängerstand, bewusst erhalten |
| `lib/atlas.js` | Laden/Messen, Rig-Introspektion, Vignetten-Bau, prozedurale Clips, Kamera |
| `lib/studio.js` | Anfasser, Bone-Posing, Korrektur-Sammlung, Enthüllungs-Zeitleiste |
| `data/cast.js` | die 21 Resident-Rezepte plus Ensemble-Definition |
| `tools/*.html` | Messsonden (Rig, Legacy, Orc/Monstrosity, Registry) |
| `docs/` | Übergabe, Architektur, Asset-Manifest, Tests, offene Punkte |
| `registry/`, `media/`, `ref/` | Registry-Index, Referenzbilder; **keine Modelldateien** |

Weitere Szenen im Projekt (`KayKit_City_Sample_S4.html`, `Kenney_City_Block_S2.html`, `Kenney_Racing_Track_S3.html`, `KayKit_Dungeon_Room_S1.html`) sind ältere Kit-Lab-Stände derselben Reihe und bleiben unverändert erhalten.

Status aller Ausgaben: `candidate-only`. Runtime-Eignung, Rig-Freigabe und Charakterbedeutung liegen bei den empfangenden Modulen.