# Onboarding · frischer Chat · Organ-Attraktionen

Lies in dieser Reihenfolge:
1. `CLAUDE.md` (Projektregeln, Asset Librarian zuerst, gemessen statt geraten, Vendor unberührt, `.vN.js`).
2. `BRIEF_ORGAN_ATTRAKTIONEN.md` (Georgs Vorgaben wörtlich).
3. `LIVING_CLAY.md`, Abschnitt »Organ-Attraktionen nach Brief«.
4. `SPRINT_ORGAN_ATTRAKTIONEN.md` (was als Nächstes dran ist).
5. `CHANGELOG.md`, nur die Einträge 2026-10-03 (7)–(18).

## Wo was liegt

- Bühne aller Organ-Attraktionen: `lab-organ/organ-islands.v7.js`, `boot(canvas, { only: 'darm' | 'hirn' | 'herz' })`. Niere: `organ-islands.v6.js` mit `only: 'niere'`.
- Bakes: `lab-organ/bake/*` (Darm, Herz, Niere), Hirn: `lab-brain/brain-world.v1.bin` (radiales Feld).
- Seiten: `KFB Darm-Attraktion E2.dc.html`, `KFB Hirn-Attraktion G2.dc.html`, `KFB Herz-Attraktion C2.dc.html`, `KFB Nieren-Attraktion N1.dc.html`.
- Strecke nur aus Track Core v0.12 (`vendor-j15/lab-track/core/track-core.v012.mjs`), nie eigene Straßen.

## Prüfen

- Konsole: `[E2]/[G2]/[C2] Varianten` und `Wahl` (Check-Fehler, Querschnitt-Treffer), `[N1 v6] Querschnitt`.
- Im Bild: `__o1.portalViews(dist)` und `__o1.look(p, t)`; besser entlang der Strecke: Stützstelle 70 m vor dem Portal aus `__o1.stream.samples`.
- Für die 3D-Bühne zählt nur eine echte Pixelaufnahme.
- Laden dauert 2–4 Minuten (Varianten werden kompiliert).

## Nicht tun

- Keine Attraktion nach Schablone einer anderen bauen.
- Keine Spirale unter ein Organ setzen, nur weil sie Höhe bringt.
- Vendor-Dateien nicht ändern; neue Fassung als `organ-islands.v8.js`.
