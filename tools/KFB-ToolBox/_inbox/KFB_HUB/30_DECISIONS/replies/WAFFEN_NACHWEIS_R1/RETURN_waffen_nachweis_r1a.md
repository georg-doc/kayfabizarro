# Waffen-Nachweis R1a · spygun und ranger · RETURN (WSB, 17.11.2026)

**Auftrag:** WS0 im Kanal am 17.11. spät, mit Vorrang (Georg). Die Karten der Waffenkammer R1 (WS1, `waffen/kammer-r1` @50c8ebb9) sollen `weapon-profile.v2` bestehen.

**Ergebnis:** Beide Karten haben jetzt **CONTRACT_PASS**, geprüft mit `src/vendor/combat/weapon-profile.v2.mjs` aus dem Zweig. Halterung, Geometrie und Clips sind unverändert; nachgetragen wurden nur Nachweise und Pflichtfelder.

## Dateien
`karten/` mit denselben Namen wie im Zweig, also 1:1 nach `src/data/combat/k10/` zu übernehmen:
- `kfb_kit_spy_gun_silencer.weapon.json`
- `kfb_kit_spaceranger_rifle.fb_r3.weapon.json`

Nachweise:
- `data/spygun_mount_measure.json`, `data/spygun_silencer_mount_measure.json`, `data/ranger_mount_measure.json`. Gemessen an FB Web-Kanon r1j mit den unveränderten Kit-Clips aus `Rig_Medium_CombatRanged.glb`, Skript `scripts/halterung_r1.mjs`.
- Sichtbeleg: `belege/WAFFEN_NACHWEIS_R1_halterung_fb.jpg`.
- Karten-Skript: `scripts/karten_r1.py`.

## Was nachgetragen ist

**spygun:**
- `instances: 1`.
- `mount.evidence`: Messung an FB. Die Halterung ist unverändert: handslot.r, Ry +90°.
- `muzzle`:
  - Der Vertrags-Anker ist jetzt `KFB_Muzzle` (0; 0,15; 0,511), weil `muzzle-sources.v1` den Knoten `KFB_Muzzle` verlangt.
  - Dazu `primary`/`secondary` (KayKit Muzzleflash / Muzzleflash_Long, wie die Pistole), `variants: []` und `evidence`.
  - Die Schalldämpfer-Mündung steht als Zusatzfeld `muzzle.aufsatz`: `KFB_Muzzle_Silencer` im Teil `Silencer`, Spitze im Spy-Gun-Raum z 1,108.
  - Laufzeit geprüft: `combatPlayer.r2.js` Z. 273 nimmt zuerst den Vertrags-Anker, `setzeAufsatz` (Z. 682) schaltet danach auf den Aufsatz-Anker aus `WK_WAFFEN` um. Der Schalldämpfer bleibt also wirksam.
- `release.evidence`: Ranged_1H_Shoot 0,2667 s, wie die Spiel-Pistole.

**ranger:**
- `handCount: 'source'`, weil die Kit-Clips 2H unverändert sind (V-574). `handCount` wird zur Laufzeit nicht gelesen.
- `slotOffset.evidence`: Achsdrehung Ry +90° wie bei `kfb_kit_gun_rifle_fb` (Kit +Z gegen handslot.r +X), dazu die Messung.
- `families.rule = 'V-582'`. Der alte Langtext steht jetzt in `ruleText`. Dazu `families.evidence` mit eigener Halterung je Clip; Reload −4 cm.
- `muzzle.primary/secondary/variants`. Das alte Feld `flash` ist entfernt, die Quellen stehen jetzt in `primary`/`secondary`.
- `release.evidence`: Ranged_2H_Shoot 0,2667 s.

## Messung an FB (Ausschnitt)

| Waffe · Clip | Lauf-Gier | Lauf-Nicken | Durchstich in Rumpf/Kopf |
|---|---|---|---|
| spygun · Ranged_1H_Shooting | 1,3…3,9° | 0,7…17,2° | 0 |
| spygun · Ranged_1H_Shoot | −18,0…3,9° | −21,6…17,2° | 0 |
| ranger · Ranged_2H_Shooting | 1,1° | 0,7° | 0 |
| ranger · Ranged_2H_Reload (−4 cm) | −2,3…1,4° | −18,2…11,0° | 0 |

Die Werte sind gleich wie in den abgenommenen K10-Messungen der Pistole und des Gewehrs.

**Gegenprobe:** Die Waffe hing an `chest` mitten im Rumpf. Der Durchstich-Test schlug an mit 166 Punkten und 19 cm Tiefe. Er misst also wirklich.

## Offen und nicht Teil dieser Lieferung
- Die linke Hand am Vorderschaft (WS1 R1 Punkt 2, 23 cm) braucht Arm-IK. Die Entscheidung liegt bei WS0; die Karte bleibt beim Kit-Clip.
- Teil 2 des Auftrags (Survivalist, Marksman, Toy Soldier) und Teil 3 (Kenney-Anker) folgen als R1b.
- Fund dazu: `WSB_REIHE_R1/6_SPY/waffen/` enthält schon `KFB_Marksman_Rifle.r1.glb` mit Mündungsanker und einem Kartenentwurf, der v2 noch nicht besteht. Für Toy Soldier liegen K10-Messungen vor.
