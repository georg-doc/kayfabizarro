# Kaltstart · Billboard H6 (KFB-Karten)

Stand 30.09.2026. Lies `CLAUDE.md`, `WORKFLOW.md`, dann dieses Paket (`README.md`, `CHANGELOG_ADDITIVE.md`, `docs/FAIL_2026-09-30.md`).

## Stand

- H4 PASS (26.09.), unverändert. H5 = H4 + freier Pool + Basis FILM, Abnahme offen, Georg: „besser“.
- Collage-Engine v0 ist FAIL. Nicht weiterbauen. Jede neue Fläche ist eine Kopie der letzten guten (H4 → H5 → H6), ein Slice je Lauf.

## Nächster Slice (Georg, 30.09.): A · Karten live, Exhibition-Trio

- Ziel: KFB-Karten und enge Motiv-Crops als Collage-Material in H6 (Kopie von H5).
- Eigentümer: Billboard Media Residency. Karten kommen **nur** über `kfb-card-builder.js` (`pageOf()`), keine eigene PDF-Halbierung, keine `cardGrid`-Zahlen im JS (SSOT_KFB_CardBuilder_PDF §6).
- Quelle: `media/kfb/index.json`, Decks `forget_utopia`, `ignore_dystopia`, `embrace_protopia`. `cardGrid` laut SSOT gemessen; in `index.json` auf main aber nicht enthalten. Vor dem Bau klären, wo die Werte liegen (Handover nennt `card-grids.json`).
- Geschützte Grenze: H5 unverändert. Kompositor, Songform, Typo unverändert; Karten sind nur neue Einträge im Plattenpool (Gattung `card` und `motif`).
- Fertig, wenn: Motiv-Crops isoliert in Arbeitsgröße gezeigt (Regel 7), dann im Schnitt; Zeit je Seitenrender und Frame-Einbruch im UI ausgewiesen.

## Danach: B · Bake (Web-Chat)

`briefings/BRIEFING_KFB_CARD_BAKE.md`. Motivrahmen aus Slice A fließen dort ein.
