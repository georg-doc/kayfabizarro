# HOUSEKEEPING · Stand 13.09.2026 spät

Status je Artefakt: AKTIV · FROZEN · SUPERSEDED · DEAD · ASSET

## Blätter
- `KFB FrankenStein Studio v17.dc.html` — **AKTIV**. v16 → **SUPERSEDED** (Referenz, `KFB FrankenStein Studio v16.dc.html` bleibt liegen).
- `KFB Rigging Lab v1.dc.html` — **AKTIV**.
- `KFB Animation Lab v2.dc.html` — **AKTIV**. v1 → **FROZEN** (Referenz, bewusst uncluttered gehalten, nicht weiterentwickelt).
- `KFB FrizzleDummy Lab v1.dc.html`, `KFB Mech & Vehicle Rig v1/v2.dc.html` — unverändert diese Sitzung, Status unangetastet.
- `petstudio-v9/KFB FrankenStein Studio v15/v16.dc.html`, `KFB FrizzleBob Studio v14.dc.html` — **SUPERSEDED**, Referenzkopien.

## Geteilte Module (mehrfach importiert — NICHT als tot einstufen)
- `petstudio-v9/studio-v7/pet-session.v1.js` — von Studio UND Animation Lab v2 importiert (Sync).
- `lab-v4/carlrig.js`, `lab-v2/audit.js` — von Rigging Lab UND Studio (`lab-v6/carlrig-mount.v1.js`) importiert.
- `frizzlegraft-v1/{actor-wobble,actor-color}.v1.js` — von Rigging Lab UND Studio importiert.
- `lab-v6/facegraft.v1.js` — von Rigging Lab UND Studio importiert.

## Neu diese Sitzung (ASSET/AKTIV)
`lab-v6/{carl-contract,facegraft,carlrig-mount}.v1.js` · `frizzlegraft-v1/{actor-wobble,actor-color,anim-contract}.v1.js` ·
`petstudio-v9/kfb-pet-{graft-driver-default,capsule-carl}.json` (Verträge, ASSET) ·
`ONBOARDING_ANIM_LAB_V2_GRAFT_DEFAULT.md` (Doku, AKTIV).

## Bekannte Lücke, nicht behoben (Fund beim Export)
`KFB FrankenStein Studio v17` referenziert 17 lokale Schriftdateien (`fonts/FonteysPRO-*`,
`GeorgComic-*`, `Bangers-Regular.ttf`, `pottymouthbb_reg.otf`, `GeorgStorybook-*`,
`GeorgGelPen-Regular.otf`), die nicht im Projekt liegen — vorbestehend, nicht aus dieser Sitzung.
Der Standalone-Export bündelt trotzdem (1,8 MB), diese 17 Schriften fehlen darin offline.
Für WSA: entweder die Dateien nachreichen oder die Referenzen auf Web-Fonts umstellen.

## Aufräum-Kandidaten (nur benannt, nichts ausgeführt — Freigabe nötig)
- `petstudio-v9/KFB FrankenStein Studio v15/v16.dc.html` — superseded, könnten raus.
- `uploads/*` — Beweisbilder und Alt-Anhänge (viele Duplikate `kfb-pet-graft-driver (1..4).json` etc.), nie Quelle, nur Spiegel des jeweils aktuellen Anhangs.
- `export/KFB-session-2026-09-12/`, `export/KFB-v16/`, `export/WSA_2026-09-12/` — ältere Exportbündel, durch `export/WSA_2026-09-13/` (dieser Export) abgelöst.
- `fixtures/*.json` — zwei Fahrzeug-Fixtures, in dieser Sitzung nicht berührt, Zweck unklar ohne Rücksprache.
- `petstudio-v9/assets/models/FrizzleBob_Yellow.gltf` (608 KB) — lokal, sollte laut `sources.js` kanonisch ins Repo (georg-doc/KFB-Stunt-Car-Race) wandern.
