# MANIFEST — Re-Home-Paket KFB Pet Studio v9

**Erstellt:** 2026-08-28 · **Nachtrag:** 2026-08-29 (WS1)
**Ordner:** `export/pet-studio-v9_2026-08-28_ws0-rehome/` · **Einstieg:** `README_REHOME_WS0.md`
**Rezept:** `docs/studio-v5/SKILL_session-export.md`

Dieses Manifest listet, was drin ist. **Was gilt, wie es geprüft wurde und in welcher Reihenfolge
gelesen wird, steht im README.** Der Nachtrag vom 29.08. dort hält die drei Befunde aus dem
Re-Home (Zählung 66/67 · die Vertragsdatei, die nicht fehlte · die zwei Papier-Texturen) und die
Hausregel **R16**.

Der Vorgänger-Manifest liegt unverändert als `docs/MANIFEST_v9_2026-08-27.md` daneben; seine
Abschnitte 3 (Status je Artefakt), 5 (bekannte Grenzen) und 6 (Aufräum-Kandidaten) gelten weiter.

---

## Vor dem Verschicken UND nach dem Auspacken: eine Zeile

```
node tools/check-loadpath.mjs
```

Erwartet: **48 Referenzen aus 20 Quelldateien · 0 fehlend** · `✓ Ladeweg vollständig`.
Das Skript löst jede relative Adresse **seitenrelativ** auf und vergleicht gegen `LADEWEG.tsv`
(Pfad · Bytes · sha256-16). Eine Ordneransicht mit Tiefenbegrenzung ersetzt das nicht — genau daran
ist das Re-Home am 28.08. hängengeblieben (`studio-v3/PET_EDITOR/pet-LIBRARY.json` liegt eine
Ebene tiefer, als die Abfrage reichte).

---

## Umfang

| Gruppe | Größe |
|---|---|
| `(root)` | 5957 KB |
| `docs` | 225 KB |
| `fonts` | 5206 KB |
| `podcast-v2` | 38 KB |
| `studio-v3` | 145 KB |
| `studio-v7` | 142 KB |
| `studio-v8` | 14 KB |
| `studio-v9` | 38 KB |
| `tools` | 5 KB |
| **gesamt** | **11.50 MB · 69 Dateien** |

---

## Dateien — Namen und Größen; die Prüfsummen führt **`LADEWEG.tsv`** (ein Eigentümer je Zahl)

Stand (68 + `LADEWEG.tsv`)

| Datei | Bytes |
|---|---|
| `HANDOVER_WS0_v9.md` | 6608 |
| `KFB Pet Studio v9 - standalone.html` | 5233569 |
| `KFB Pet Studio v9 SESSION_LIVING - standalone.html` | 313189 |
| `KFB Pet Studio v9 SESSION_LIVING.dc.html` | 29021 |
| `KFB Pet Studio v9.dc.html` | 366981 |
| `MANIFEST_v9_rehome.md` | 5716 |
| `ONBOARDING_ext-LLM.md` | 4889 |
| `README_REHOME_WS0.md` | 8427 |
| `SPRINT_v10.md` | 7304 |
| `docs/ABGLEICH_podcast-v5_studio-v7.md` | 6150 |
| `docs/ABGLEICH_ws0-groundplane_v7.md` | 7095 |
| `docs/CHANGELOG_studio.md` | 65081 |
| `docs/HANDOVER_WS0_v7.md` | 8000 |
| `docs/HOUSEKEEPING_root.md` | 9460 |
| `docs/KFB_INK_OUTLINE_STYLE_v2.md` | 11753 |
| `docs/MANIFEST_v9_2026-08-27.md` | 6415 |
| `docs/POST_MORTEM_re-home_pflichtlektuere.md` | 9773 |
| `docs/SPEC_bubble_kiss_v7.md` | 6512 |
| `docs/studio-v5/HANDOVER_v6.md` | 7532 |
| `docs/studio-v5/KONZEPT_groundplane.md` | 7983 |
| `docs/studio-v5/POST_MORTEM_v5.md` | 7517 |
| `docs/studio-v5/SESSION_CUT_v5.md` | 5459 |
| `docs/studio-v5/SKILL_session-export.md` | 4498 |
| `docs/studio-v5/SLICE_v5_2026-08-25.md` | 27157 |
| `docs/studio-v5/SOP_kfb_ink_v1.md` | 36538 |
| `docs/studio-v7/POST_MORTEM_bubbles.md` | 4642 |
| `fonts/Bangers-Regular.ttf` | 92468 |
| `fonts/FonteysPRO-Bold.otf` | 392876 |
| `fonts/FonteysPRO-BoldItalic.otf` | 389436 |
| `fonts/FonteysPRO-Heavy.otf` | 378028 |
| `fonts/FonteysPRO-Italic.otf` | 390048 |
| `fonts/FonteysPRO-Medium.otf` | 395372 |
| `fonts/FonteysPRO-MediumItalic.otf` | 389908 |
| `fonts/FonteysPRO-Regular.otf` | 394104 |
| `fonts/GeorgComic-Bold.otf` | 488548 |
| `fonts/GeorgComic-Heavy.otf` | 220592 |
| `fonts/GeorgComic-MediumCAPS.otf` | 426232 |
| `fonts/GeorgComic-RegularPRO.otf` | 665284 |
| `fonts/GeorgComic-Title.otf` | 198460 |
| `fonts/GeorgGelPen-Regular.otf` | 104992 |
| `fonts/GeorgStorybook-Bold.otf` | 180140 |
| `fonts/GeorgStorybook-Light.otf` | 170440 |
| `fonts/pottymouthbb_reg.otf` | 54344 |
| `kfb-ink-canon.js` | 23091 |
| `kfb-pinball-audio.js` | 15973 |
| `kfb-pinball-sfx.json` | 18058 |
| `podcast-v2/bubble-shapes.json` | 3133 |
| `podcast-v2/bubbles.v4.js` | 25213 |
| `podcast-v2/bubbles.v5.js` | 11044 |
| `studio-v3/PET_EDITOR/pet-LIBRARY.json` | 20922 |
| `studio-v3/kfb-pets.json` | 36419 |
| `studio-v3/pet-eye-rig.v5.js` | 17352 |
| `studio-v3/pet-library.v6.js` | 33089 |
| `studio-v3/pet-mouth.v1.js` | 25668 |
| `studio-v3/pet-puppet.v1.js` | 15453 |
| `studio-v7/bubble-kiss.v1.js` | 16757 |
| `studio-v7/bubble-shaper.v3.js` | 53231 |
| `studio-v7/edge-treatment.v1.js` | 18060 |
| `studio-v7/ground-plane.v1.js` | 17294 |
| `studio-v7/pet-metrics.v1.js` | 25905 |
| `studio-v7/pet-session.v1.js` | 13791 |
| `studio-v8/contract-guard.v1.js` | 4232 |
| `studio-v8/ground-contract.v1.js` | 9988 |
| `studio-v9/bubble-tail.v1.js` | 13035 |
| `studio-v9/pad-base.v1.js` | 11789 |
| `studio-v9/pad-contract.v1.js` | 13594 |
| `support.js` | 69150 |
| `tools/check-loadpath.mjs` | 5123 |

---

## Herkunft der Dokumente

| Im Paket | kommt aus |
|---|---|
| `README_REHOME_WS0.md`, `MANIFEST_v9_rehome.md`, `tools/check-loadpath.mjs`, `LADEWEG.tsv` | in WS1 für dieses Paket geschrieben |
| `HANDOVER_WS0_v9.md`, `ONBOARDING_ext-LLM.md`, `SPRINT_v10.md` | Sitzungsschnitt 27.08. |
| `docs/CHANGELOG_studio.md` | `docs/` — additiv, **V9-S2** oben (Re-Home), V9-S1 darunter |
| `docs/POST_MORTEM_re-home_pflichtlektuere.md` | `docs/spinballcast-v3/POST_MORTEM_re-home.md` |
| `docs/studio-v7/POST_MORTEM_bubbles.md` | warum v6 kaputt war — die Regel hinter v7 |
| `docs/studio-v5/*` (7) | Post Mortem v5, Session-Cut, Tusche-SOP, Boden-Konzept, Export-Rezept |
| `docs/SPEC_bubble_kiss_v7.md`, `docs/ABGLEICH_ws0-groundplane_v7.md`, `docs/HANDOVER_WS0_v7.md` | Sitzungsschnitt v7 (25.08.) |
| `docs/ABGLEICH_podcast-v5_studio-v7.md` | die offene Boden-Entscheidung, gemessen |
| `docs/KFB_INK_OUTLINE_STYLE_v2.md` | Tusche-Kanon, Projektwurzel |
| `docs/HOUSEKEEPING_root.md` | `HOUSEKEEPING.md` der Projektwurzel |
