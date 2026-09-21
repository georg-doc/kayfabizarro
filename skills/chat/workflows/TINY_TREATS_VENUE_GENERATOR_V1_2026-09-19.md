# Tiny Treats Venue Generator v1 · Bakery, Kitchen, später Diner

Status: **BRIEFING READY · SEPARATE FROM DUNGEON**  
Datum: 2026-09-19  
Owner: Venue / scenery consumer; Asset-Library bleibt Owner der Identität  
Arbeitsweg: ChatGPT Web / Coding Agent

## Ziel

Aus den vorhandenen Tiny Treats Packs entsteht ein kleiner, austauschbarer **Innenraum-/Venue-Generator** für KFB Town: zuerst Bakery und Charming Kitchen, später ein Diner-Zweig nur dann, wenn dessen echte Quellen im Registry nachgewiesen sind.

Dies ist kein Dungeon, kein HUD-Donor und keine zweite Asset Library.

## Read first

- `registry/assets/v1/` und Asset Librarian
- `skills/chat/workflows/ASSET_LIBRARIAN_TINY_TREATS_RECON_V1_2026-09-19/START_HERE.md`
- `media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/`
- `media/3D_Assets/Tiny_Treats_Charming_Kitchen_1.1_FREE/`
- Plant Prop Lab, sofern Pflanzen/Scenery gebraucht werden
- `skills/session-entry-use-what-works_v1.md`

## Eine erste begehbare Probe

1. Ein vorhandenes, schlichtes Gebäude liefert Boden, Wände, Tür und Kollisionsgrenze.
2. Der Venue-Generator stellt daraus **Bakery** oder **Charming Kitchen** zusammen.
3. Jede Rolle kommt aus dem Register: Arbeitsfläche, Ofen/Küchen-Mittelpunkt, Auslage/Backware, Sitz-/Ablagefläche, Wegmarke/Lesepunkt.
4. Der Spieler kann eintreten, die drei bis fünf Dinge lesen und wieder herausgehen.

## Verträge

- Gebäudeschale und Kollision bleiben bei der World-/Building-Stage.
- Tiny Treats liefert nur echte, registrierte Innenraumteile und Rezepte.
- Der Librarian liefert Name, Pack, Pfad, Vorschau und Alias; der Generator konsumiert sie.
- Bei fehlender Diner-Quelle: Bakery/Kitchen liefern, Diner als **MISSING_DONOR** zurückgeben.
- Kein Original-Asset kopieren, umbenennen oder selbst als Ersatz nachbauen.

## Lieferformat

Fester Stage-Kandidat:
`kfb-hub/stage/venues/tiny-treats-bakery-v1/`

Beilegen: `SOURCE.json`, `RECIPE.json`, `RETURN.md`, `TEST_REPORT.md`, drei Screenshots (Eingang, Lesepunkt, Raumüberblick) und einen menschlichen Vibe-/Lesbarkeits-Gate.

## Nicht tun

- Tiny Treats in Dungeon Raid oder Race HUD schieben;
- jede Pack-Datei zwangsweise in einen Raum legen;
- mit einer neuen UI-Bibliothek am Librarian vorbei arbeiten;
- “Diner” aus einer nicht belegten Quelle behaupten.
