# HANDOVER · KFB Voxel Zone S2 — Voll-Export 1:1

**An:** WSA Chat Review · **Von:** Claude Design (KFB) · **Datum:** 2026-09-22

## SOURCE
`KFB Voxel Zone S2.dc.html` + lokale Abhängigkeiten aus *Hex Assets Worldbuilding*, Stand
2026-09-22. Bestandsdokumente aus `docs/`, unverändert.

## DECISION
1:1-Export statt Extraktion, nach dem Fehlbefund der Modul-Extraktion vom 21./22.09.
(siehe `export/card-zone-lab-v2-full_2026-09-22/docs/POSTMORTEM_2026-09-22_EXTRAKTION.md`).

## IMPLEMENTATION
Reiner Kopiervorgang, keine Codeänderung. Neu geschrieben: README, CODE_MAP, DEPENDENCIES,
dieses Handover.

## TESTED RESULT
Importgraph vollständig aufgelöst, alle Ziele im Export enthalten. Start auf fremdem
Webserver: NOT_TESTED.

## EXPORT
ZIP aus `export/voxel-zone-s2-full_2026-09-22/`.

## PUBLIC DEPLOYMENT
Keines. Integration liegt beim Web Lead.

## GEORG ACCEPTANCE
Offen.

## OPEN
Start aus dem Export-Ordner auf einem echten Webserver ist noch von niemandem gelaufen.
