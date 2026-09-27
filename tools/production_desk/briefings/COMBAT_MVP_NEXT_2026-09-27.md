# Combat Arena · nächster produktiver MVP-Schritt · 2026-09-27

Status: **C-MVP-A PUBLIC_VERIFIED · KERNLOOP FUNKTIONIERT · FREEPLAY SPÄTER**

Owner: `georg-doc/KFB-Combat-Arena`

Aktuelle Implementierungsquelle:

- Draft PR #5
- Branch `chatgpt-web/combat-arena-integration-v2-2026-09-19`
- aktueller Head `d6cf532e64d45fd3117775ec61cfc87b9e948ac0`
- feste Stage: https://kayfabizarro.pages.dev/kfb-hub/stage/combat/

## Was bereits funktioniert

Der kleinste echte Combat-Loop ist bewiesen:

`FrizzleBob Driver → Warrior anvisieren → schießen → 3 Treffer → Kill → Reward/Pop → Run Clear → Next Card → Respawn`

Öffentliche Browser-Evidence:

- 3 Schüsse / 3 Treffer;
- 1 Warrior-Kill;
- 1 Reward und 1 Pop;
- Card Clear und frischer Warrior nach Next Card;
- 0 Runtime-Fehler;
- Desktop und Narrow View brauchbar;
- Audio 22/22 geladen.

Der Skeleton Mage bleibt korrekt als `HOLD_C_MVP_MAGE_ADAPTER` außerhalb des kritischen Pfads.

## Was Georg später testet

Ein freier Spieltest auf der festen Stage:

1. fühlt sich Zielen und Schießen unmittelbar an?
2. sind Treffer, Kill und Reward verständlich?
3. bleibt FrizzleBob bei Bewegung und Schuss visuell sauber?
4. ist die Oberfläche für Spielen brauchbar oder noch zu sehr Test-Interface?

Dieser Test entscheidet über TUNE, blockiert aber keine vorbereitende Quellenarbeit.

## Was als Nächstes gebaut werden darf

### P0 · Combat-Freeplay nach Georgs Rückkehr

Nur kleine Playability-Korrekturen am bewiesenen Warrior-Loop. Kein Mage, Legacy oder Melee in denselben Reparaturpass ziehen.

### P1 · CA2-LEGACY-01R vorbereiten

Quelle: Combat PR #10 @ `663f0610eb960f322d67b078f1302d0c6178d1c2`.

Kleinstes Set:

- Rogue;
- Rogue-default head;
- Common Crossbow;
- native `Shoot(2h)`;
- vorhandener Arena-Gunfight bleibt Owner.

Vor Runtime-Integration werden nur EyeRig, Zweihand-Griff, Mündung und Release sichtbar vermessen. Kein neuer Combat-Controller.

### P2 · Melee nach Ranged

Quelle: Combat PR #7 @ `f773dbeb0cfa09fa7e1bd72a4323130b2c0eff06`.

Bereits vorhanden:

- aktives Trefferfenster;
- swept contact;
- AttackLedger;
- Rig_Medium Skeleton Blade / echter 1H-Clip.

Melee wird erst als eigener Slice eingebaut, wenn der Ranged-MVP im Freeplay akzeptiert oder gezielt getuned wurde.

## Quarantäne / später

- Skeleton Mage;
- Legacy-Vollroster;
- GothGirl-Aim-Pitch;
- Spindle Sky;
- Rig_Large / 2H;
- Combos und HeavyAttack;
- World-Portal und Open-World-Combat;
- neues HUD oder neue Damage-/AI-Architektur.

## Genau ein nächster Gate

**Georgs Combat-Freeplay auf der bestehenden festen Stage.**

Bis dahin darf nur der source-isolierte Legacy-Rogue/Crossbow-Proof vorbereitet werden; keine konkurrierende Runtime und keine öffentliche Promotion.
