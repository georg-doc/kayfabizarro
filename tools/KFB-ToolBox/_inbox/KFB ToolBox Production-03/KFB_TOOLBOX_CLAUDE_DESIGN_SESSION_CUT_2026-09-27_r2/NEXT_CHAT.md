# Onboarding · frischer Chat (Claude Design, Projekt »KFB ToolBox«)
**Rolle:** Du arbeitest an `KFB ToolBox Production-03.dc.html`. Georg schreibt knapp, oft per Sprache, auf Deutsch. Tippfehler sind normal, lies die Absicht. Antworten kurz, ohne Vorrede.

## Zuerst lesen
1. `CLAUDE.md` (Projektregeln: Schatten nach LESSONS_SHADOWS, Gesichtsfelder nur über face-mount.v1, Ohren/Stiele über ear-dangle.v1).
2. `handover/RECOVERY_01_INVENTORY.md` · die gültige Lückenliste (ersetzt PARITY_… und PET_STUDIO_FEATURE_MAP als Arbeitsliste).
3. `github.md` · Repo, Pins, Screen-Map. Schreibweg 403.
4. `handover/LESSONS_SHADOWS.md` vor jedem Licht-/Schatten-Eingriff.

## Arbeitsregeln
- Neue Version nur bei größerem Umbau (Production-04). Kleine Edits gezielt, keine Neuschreibungen.
- Nur wirklich gelaufene Tests heißen PASS. Jede neue Funktion bekommt einen Selbsttest-Schritt (Muster: 21c–21f, 26b).
- Kein `//`-Kommentar mitten in einer einzeiligen Anweisung. `sc-if` immer mit `hint-placeholder-val`; `<img src="{{ … }}">` nie im Template (lädt die Lochschrift) → als Element aus der Logik.
- Metatext gehört hinter »Notes«. Neue Abschnitte in Rigging als `isHead` (klappt automatisch).
- Sprint-Ende: `ready_for_verification`, dann kurze Zusammenfassung.

## Sprintplan (ab Georgs Abnahme P03)
| # | Sprint | Inhalt | Gate |
|---|---|---|---|
| S1 | **BODY-02 · Look** | Cube-Pet Material (Kenney/Clay/Cel, Tex-Scale, Tint, Relief, AO, Roughness) · Surface-Gruppen + Mods · Color-Swatches/Native/Facets · Light-Mood Day/Dusk/Night/Under + Azimut/Höhe/Rim (v18 V2CFG koerper Z. 605–629) | Pet-Look-Export feldgleich zum v18-Schema, Schatten-Prüfteil PASS |
| S2 | **BODY-03 · Zonen** | Materialzonen am Driver (matzones.v1) · Kopfzonen-Töne Gesicht/Kopf (headzones.v1) | Driver-Rundlauf ohne Feld-Diff |
| S3 | **FILE-01** | v18 File-Menü: Export Auswahl / ganzer Satz / Laden | Satz-Export → Import → 0 Diff |
| S4 | **DRIVER-02** | Carl-Graft-Felder `brow.graft.*` / `nose.graft.*` · Driver §2b Puppet (setExpression · playState · speak) | Driver-Rundlauf ohne Feld-Diff |
| S5 | **ROSTER-02** | Carl · Klo-Rolli (Pad: Anker, Base, Audio, Roll) · Recherchi | alle v18-Rosterklassen ohne SOURCE MISSING |
| S6 | **VOICE-01** | Blasen-Rework mit/ohne KFB-Outline (Design-Slice mit Optionen, Georg wählt) | Georgs Auswahl |
| S7 | **LAB-R3** | Cross-Rig M+L · FIT · Waffe/FX am Anker (VFX-Recipes aus KFB-Combat-Arena) | Georgs Sichtprüfung |
| S8 | **HUNKY-01** | Lord Hunky (Alien Build A): Augenstiele mit DangleChain | braucht Modell mit Stiel-Knochen |

## Erste Handlung im frischen Chat
Georg fragen: »P03 abgenommen?« Wenn ja → S1 BODY-02. Wenn Befunde → erst diese, im selben File.
