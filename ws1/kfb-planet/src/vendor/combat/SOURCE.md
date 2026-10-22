# Kampf-Module (byte-gleich, nur importieren) · V-618 MVP-Kampf

Quelle: georg-doc/KFB-Combat-Arena, Branch `wsa/openworld-modules-v584-2026-10-21` (PR #25, V-584 Job 3 „four independent combat modules and contract tests for WS1“), Commit **cb0d93cf3d4542c15f70f88ce2ab08d418374049**. Nicht ändern – Änderungen beim Eigentümer (WSA).

| Datei | Git-Blob | Zweck |
|---|---|---|
| `hit-stop.v1.mjs` | 81e410c0bd | V-567: Zeit je Teilnehmer, Standard 4/60 s, Deckel 150 ms, Doppel-Ereignis wird ignoriert, Kamera-Kick aus |
| `weapon-profile.v1.mjs` | 9e4713557e | Zulassung der K10-Waffenkarten (V-574 … V-594) |
| `muzzle-fx.v1.mjs` | 75e042fe93 | Mündungsblitz am Anker (+Z), Quell-Objekte injiziert |
| `muzzle-sources.v1.mjs` | 11fbcf7a28 | Referenzen der privaten KayKit-Mündungsblitze (sha256) |

Nicht übernommen: `monster-roster.v1.mjs` (hängt an `modules/kfb-monster-roster.js`; Gegner im Spiel kommen von WS-NPC).
Waffenkarten (Daten): `src/data/combat/k10/` aus `tests/fixtures/k10/` desselben Commits (Pistole Prototype Bits, HeroMan-Blaster, SOURCE_LOCK).
Vertragstest: `test/unit/combatVendor.mjs` (portiert aus `tests/open-world-contracts.test.js`, ohne Roster).

Knet-Wirkungen (Kampf R1, Georgs PASS mit TUNE im Prototyp): `knet-fx.v1.mjs` byte-gleich aus georg-doc/KFB-Combat-Arena, Branch `ws1/combat-av-r1`, Commit **17f4403e69bc** (`combat-arena-v5/ws1/knet-fx.v1.mjs`, Git-Blob **5b1a7dd548**). `createKnetFx(THREE, parent, { cap })` → `{ hit, pop, step, dispose }`, dazu `createTelegraph`, `createTrails`; THREE wird injiziert. Nur importieren.
