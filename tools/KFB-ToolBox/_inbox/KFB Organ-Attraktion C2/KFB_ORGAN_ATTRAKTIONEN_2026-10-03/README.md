# KFB · Organ-Attraktionen · Session 2026-10-03

Knetwelt-Linie. Vier Organ-Attraktionen aus Track-Core-v0.12-Stücken, in die Organe modelliert (BodyParts3D, geknetet).

## Öffnen
Ordner über einen lokalen Server ausliefern (z. B. `npx serve`), dann eine Seite öffnen. Laden 2–4 Minuten (Varianten werden kompiliert und geprüft). three.js kommt vom CDN, Figuren und Wolken-Spender von GitHub (raw).

| Seite | Inhalt | Stand |
|---|---|---|
| `KFB Darm-Attraktion E2.dc.html` | Fahrt durch den Dickdarm, Caecum → Anus | READY_FOR_DECISION |
| `KFB Hirn-Attraktion G2.dc.html` | Sehbahn-Tunnel Stirn → Chiasma → Sehrinde, Spirale um die Hirnoberfläche | READY_FOR_DECISION |
| `KFB Herz-Attraktion C2.dc.html` | Weg des Blutes durch beide Herzhälften | READY_FOR_DECISION |
| `KFB Nieren-Attraktion N1.dc.html` | Sturz, Rinne, Blasen-Bumper, Katapult, Schlucht | READY_FOR_DECISION |
| `FAIL/` G1, C1, E1 | nach Schablone gebaut, nicht nach Brief | FAIL (Stand) |

Alle vier: runChecks ohne Fehler, Querschnitt-Durchdringung außerhalb geplanter Tunnel 0.

## Doku
- `docs/BRIEF_ORGAN_ATTRAKTIONEN.md` — Georgs Vorgaben wörtlich
- `docs/SPRINT_ORGAN_ATTRAKTIONEN.md` — Sprintplan A (Abnahme/Feinschliff), B (Fahrphysik), C (O1-Ring)
- `docs/ONBOARDING_frischer_chat_organ_attraktionen.md` — Einstieg für den nächsten Chat
- `docs/LIVING_CLAY.md` — Stand der Linie · `docs/CHANGELOG.md` — Einträge 03.10. (7)–(18)
- `docs/CLAUDE_projekt.md` — Projektregeln (Kopie von CLAUDE.md)

## Module
- `lab-organ/organ-islands.v7.js` — Bühne E2/G2/C2 · `organ-islands.v6.js` — N1 und die FAIL-Stände
- Quellen: `lab-organ/SOURCES.md` (BodyParts3D 3.0 © DBCLS, CC BY-SA 2.1 JP)
