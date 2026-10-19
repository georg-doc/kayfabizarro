# Combat Arena · Statusbericht R1 · 2026-10-19 · WS0 (V-552)
Quelle: Repo `georg-doc/KFB-Combat-Arena`, lokal `~/Developer/KFB-Combat-Arena`, nur gelesen. **PR #22** (WSA-Audit V-536) war lokal und remote nicht auffindbar: weder als Branch noch per Treffer. Die V-536-Punkte unten sind aus dem Code abgeleitet.

## Stand
- **main** (`f6a59ad`, 13.09.): nur Doku, Gameplay-Stand 5A/A1 (Module v1–v4, 21 Quaternius MonsterCuteCubes aus `mobs.v2.js`).
- **Arbeit nur auf ungemergten Branches**, in drei Linien:
  - #5/#11: Integration v2 (öffentlich verifiziert, Warrior PASS, Mage HOLD), FB-Player v5 (Fernkampf FAIL, eingefroren);
  - #19 `coworker/card-hex-ascent-one-shot`: 159 Commits, enthält Sword #12, Brickfish #17, Melee #7, Card-Hex Ascent;
  - VFX-Branches vom 03.10.: Contact-Impact mit Klinge, Ribbon, Stern/Splat, Lehm-Fragmenten.

## Figuren
- **Spieler:** FrizzleBob-Graft auf Rig_Medium. Clips Idle, Walk/Run, Ranged_1H Aiming/Shoot, Hit_A, Death_A.
- **KayKit Medium:** Skeleton Warrior produktiv, aber noch mit Faust statt Waffe; Mage HOLD; in Card-Hex Hero Man, ToySoldier, CombatMech mit `KFB_Motion_ranged.glb` + Dodge.
- **KayKit Large:** Black Knight mit 16 CombatMelee-Clips (2H Attack/Slam), nur Doku; Schild-Platzierung abgelehnt, Korrektur gehört in den RA.
- **KayKit Legacy:** 6-Bone-Rig mit 30 Clips (Throw, Roll, Dash, Block, Shoot 1h/2h). Kandidaten Rogue (Armbrust), Knight (Schwert). Orc HOLD (Clipping).
- **Quaternius:**
  - CuteCubes: 16 Läufer mit 10 Clips, 4 Flieger mit 4 Clips; Tree ohne Death.
  - Space Kit Enemies: ready.
  - 17 Ultimate-Monster-Flieger: nicht ready, Clips ungeprüft.

## Systeme
- **Fernkampf:** `gunfight.v2.js`; Gegner werfen Würfel im Bogen.
- **Nahkampf:** `contact.v1.js` (Swept Contact, AttackLedger) + visible/impact.
- **Treffer:** `kfb-hit-response.js`.
- **Dodge:** nur Card-Hex.
- **Werfen:** kein Wurf-Clip angebunden.
- **VFX:** Atlas, Sprites, Recipes.
- **SFX:** 27 Dateien; es fehlen Whoosh, Body-Impact, Block.

## V-536 (abgeleitet)
- **Card-Hex `anim.mjs`:** CARRY-Verdrehung gegen die Hand → Verstoß.
- **`combat.mjs`:** Spieler-Schuss zeigt direkt aufs Ziel statt entlang des Laufs.
- **`gunfight.v2.js`:** Laufachse = Muzzle − Holder statt Unterarmachse.
- **Brickfish:** Griff am Schwanz ok. Achsen der Äxte ungeklärt.

## Integration
- Vanilla three@0.160 ohne R3F, kein Scenelet-Bezug.
- Saubere Grenzen vorhanden: ein Mixer je Actor, Präsentation ohne Positionsschreiben, Knockback als Rückgabe, AttackLedger, URL-Contract, `SOURCE.json` mit Pins.
- **Blocker:**
  - Laufzeit-Laden von `raw.githubusercontent`;
  - drei ungemergte Linien;
  - kein Event-Schema;
  - offene Gesten.

## Top 8
1. Branches zusammenführen: #5 + #19-Linie auf main, VFX-03.10. rebasen, #11/#15 schließen. **Merge nur mit Georg.**
2. **Waffen-Profil V-536:** Griff in der Faust, Mündung auf der Unterarmachse; CARRY entfernen; `_gunDirection` und `muzzleWorld` auf die Unterarmachse.
3. **Eine Clip-Tabelle** für Medium, Large, Legacy und Quaternius: Rig_Medium CombatRanged/Melee, Legacy Throw/Shoot, Mixamo-Würfe.
4. **Wurf-Pipeline:** Clip mit `release` → ballistisches Projektil (aus `gunfight`).
5. Skeleton Warrior auf Klingen-Chop umstellen.
6. Legacy Knight (Schwert) + Rogue (Armbrust); Large Black Knight 2H (passt zu B45 Dark Knight).
7. Quaternius Ultimate Monsters: Clips messen, `ready` setzen; Death-Ersatz für Tree. Dazu alle Quaternius-Figuren nach V-552 (Karte, Augen, Clay).
8. **SFX-Lücken:** WS0 hat `blaster_r1` und `throwables_r1`, es fehlen noch Whoosh, Body-Impact, Block. Assets lokal bzw. per CDN. Event-Schema damage/vfx/sfx → Scenelet- bzw. R3F-Adapter.

## Vorschlag Verteilung
- **WSA** (Arena-Repo-Owner): 1, 2, 3, 4, 5, 8-Teil Event-Schema.
- **WSB:** 6, 7 (Figuren-Optimierung Quaternius + Legacy/Large), Assets für Scenelets.
- **WS0:** SFX-Lücken (ElevenLabs), Event-Schema-Abgleich mit `kfb.scenelet/1`, Bühnen-Adapter.
- **WS1b:** Integration ins Spiel nach Merge.
