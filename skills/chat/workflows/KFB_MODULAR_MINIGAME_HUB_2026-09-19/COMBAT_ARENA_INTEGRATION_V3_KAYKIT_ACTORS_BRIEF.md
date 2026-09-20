# Combat Arena Integration v3 · KayKit-Spielerfamilie

Status: **CURRENT BRIEF · PREPARATION STARTED · RUNTIME NOT CHANGED**  
Datum: 2026-09-20  
Implementation-Owner: `georg-doc/KFB-Combat-Arena`  
Lead/Integration: WSA · kleine Inputs: Web/Agenten/ToolBox

## Georgs Entscheidung

KayKit/Rig_Medium wird die bevorzugte Spielerfamilie. `frizzlebob-driver` ist Default, `gothgirl` die zweite erste Spielerfigur; `legacy-frizzlebob-v5a` bleibt als ausdrückliche Auswahl. Weitere Medium-Modelle werden katalogisiert, aber erst nach Asset-, Clip-, Face-, Ground- und Muzzle-Gate freigeschaltet.

Der rohe Driver und FrizzleBob Driver Graft sind verschiedene Actor-Identitäten. Das Graft ergänzt Gesicht und den vorhandenen Waffen-/Mündungsvertrag.

## Belegte Basis

- Combat: `georg-doc/KFB-Combat-Arena@f6a59ad15b9ffcf3164b0ab013f223962b63f61f`; Gameplay weiterhin 5A/A1.
- Kayfabizarro: `53b828a29c71b9ee20635dc0133813e37697f961`.
- Motion Lab: PUBLIC 87/87 für FB Driver Graft, GothGirl (Rig_Medium) und Black Knight; Georg-/Attachment-Abnahme offen.
- FB und GothGirl binden dieselben 25 General-/MovementBasic-Clips. CombatRanged, GothGirl Face/Gun und sichtbare FB-Waffenpose sind nicht als Arena-Kette abgenommen.
- Existierende drei Gegner, Treffer, Kill, Rewards, Pickups, Card Clear und Post-Clear-Spiel bleiben erhalten.

## Produktschnitt

Vor dem Countdown: kompakte Kämpferwahl, FB Driver vorgewählt, bestätigte Wahl gespeichert, reproduzierbares `?actor=<id>`. Ein Wechsel startet zunächst die Runde neu. Fehlt der Default, zeigt die Arena `MISSING_ASSET` plus sichtbaren Legacy-Start; kein stiller Fallback.

Genau eine Actor-Instanz geht an Player, Gunfight, Kamera und Zielwahl. Player besitzt Weltposition/Drehung/Boden. Actor besitzt einen Mixer und genau einen Face-Modus. Combat bleibt Gunfight-/Arena-Owner.

## Reihenfolge

1. CA2-00 Source Probe: exakte Pins, Modelle, Dependencies, Lizenzen, Bones, Face, Clips, Waffen/Mündung.
2. CA2-01 Actor Profile + Selector POC: Vertrag/isolierte Stage, keine Live-Arena.
3. WSA Actor-Plattform: Registry/Factory, Legacy-Adapter, Default-FB; ein Root/Mixer/Face/Ground.
4. CA2-02 ToolBox Ranged Calibration: echtes `Rig_Medium_CombatRanged.glb`, Character_Gun, Grip/Muzzle/Marker für FB + GothGirl.
5. WSA Pose→Muzzle→Release: neuestes Ziel, genau ein Release, Schnellklick/Movement/Respawn/Post-Clear.
6. weitere Medium-Profile einzeln; danach CA2-03 zwei Gegneradapter innerhalb der bestehenden Dreierlogik.
7. SKY-01 Shared Spindle Sky isoliert; WSA integriert Consumer und A2 später.

## WSA Lead bleibt

`index.html`, `player.v2.js`, `gunfight.v2.js`, Actor-Lifecycle, echtes Mob/Damage/Reward-System, A2, Consumer-Sky, Browser/Audio/Performance und Promotion. Kein Web-Slice editiert diese Integrator-Dateien parallel.

## Delegierte Briefs

- [CA2-00 Source Probe](./COMBAT_ARENA_CA2_00_SOURCE_PROBE.md)
- [CA2-01 Actor Selector/Profile](./COMBAT_ARENA_CA2_01_ACTOR_SELECTOR_PROFILE.md)
- [CA2-02 Ranged/Muzzle Calibration](./COMBAT_ARENA_CA2_02_RANGED_WEAPON_CALIBRATION.md)
- [CA2-03 Gegnerpaar-Matrix](./COMBAT_ARENA_CA2_03_TWO_ENEMY_ADAPTER_MAP.md)
- [SKY-01 Spindle Sky](./SPINDLE_SKY_MODULE_V1_BRIEF.md)

Alle arbeiten nach `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, mit Branch/PR ohne Auto-Merge. Technischer PASS, PUBLIC_VERIFIED und HUMAN_ACCEPTED bleiben getrennt.
