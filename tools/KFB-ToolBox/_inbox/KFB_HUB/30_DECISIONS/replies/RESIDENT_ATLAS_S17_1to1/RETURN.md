# RETURN · Atlas S17 · Gunfight Duell 01 · 2026-10-04

## Auftrag
Combat Slice mit Schusswaffen: Duell zweier KayKit-Figuren mit Blaster, Gewehr, Minigun, Choreografie nach Würfelwurf,
Effekte aus dem Arena-Kanon. S16 bleibt Übergabestand.

## Geliefert
- `lib/gunfight-duel-01.js` · `data/gunfight-duel-01.json` · Szene `#__duel` in `KFB_Resident_Atlas_S17.html`.
- Clips: `kfb_action_shooting_gun_a` (Motion Library, `KFB_Motion_action_i04.glb`), sonst KayKit Character Animations
  (Idle_A, Hit_A, Death_A, Dodge_Left/Right, Throw, Running_HoldingRifle als Oberkörper).
- Waffen gemessen statt geschätzt: Schussbild über den Ruck der Hand (40 gilt, 61 verworfen), Achsen je Haltung,
  Mündung an der Laufspitze, Zielkorrektur aus der Laufrichtung.
- Effekte: Mündungsfeuer, Geschoss, Knet-Puff, Hitstop, Squash, Rückstoß; Gesichtszone schiebt Puffs weg.
- Regler + Urteil + JSON-Export wie Fight 02. Kamera seitlich versetzt.

## Befunde
- Lauf zur Bahn ≤ 3,2° bei 5 Schüssen (vorher 26–53°). Minigun/Gewehr 2,8°.
- KayKit `Dodge_Left` weicht 0,69 m aus, 0,04 m nachgeholfen.
- Chibi-Brust liegt in der Arena-Gesichtszone (C9) → Puffs verschoben statt weggelassen.
- Georg 2026-10-04: Grundlage Combat Slice; Blasterhaltung falsch; Ring als Stage-Instanz je Szene.

## Offen
HANDOVER §E.
