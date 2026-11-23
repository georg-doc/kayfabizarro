# Fernkampf aus dem Bestand R1 (WSB, 23.11.2026)

**Auftrag:** WS0 23.11., Reihenfolge Punkt 2. Fernkampf-Clips je Waffenklasse aus dem Bestand mit den Extremposen Anschlag, Abgang und Rückstoß, Tafeln wie r4. Was einen neuen Mixamo-Download braucht, steht unten in der Liste und wartet auf Georgs Ja (Hub q856).

**Dateien:**
- Tafel: `belege/fernkampf_bestand_r1_extreme.png` (dazu `.svg`). Profil von rechts, je Clip ausgerichtet auf die Schussrichtung. Grau = Anschlag, schwarz = Abgang, blau = Rückstoß. Die Waffenlinie ist rot, die Mündung ein Punkt.
- Zeiten je Clip: `data/fernkampf_bestand_r1.json` (Klasse, Art, Schusshand, `anschlag_t`, `abgang_t`, `rueckstoss_t` bzw. `pose_t`).
- Werkzeug: `scripts/ml_fernkampf_extreme.py`.

**Regeln der Erkennung:**
- **Schusswaffen:**
  - Nur Clips mit Schuss im Namen (shoot, fire, gunplay_shooting, rapid, handcannon, shotgun …) und nur Bilder im Anschlag: Waffe etwa waagerecht, Hand mindestens auf Schulterhöhe minus 25 cm.
  - Abgang = Beginn des ersten deutlichen Stoßes der Schusshand gegen die Brust.
  - Rückstoß = größte Auslenkung der Hand in den 0,35 s danach.
  - Anschlag = ruhigste Zielhaltung in den 0,6 s davor. Fängt der Clip mit dem Schuss an, nehme ich das Clip-Ende.
- **Bogen:** Anschlag = Vollauszug, Abgang = schnellste Bewegung der rechten Hand danach, Rückstoß = Ende der Nachbewegung.
- **Zauber und Wurf:** Umkehrpunkt, dann schnellster Punkt, dann abgebremst. Gleiche Logik wie die Angriffe in r4.
- **Lauf-, Sprung-, Nachlade- und Treffer-Clips:** nur die Zielhaltung.
- **Schusshand:** die höher gehobene Hand. Einige Mixamo-Clips schießen links.

## Bestand je Klasse

| Klasse | Mixamo-Bibliothek (`library_r3`) | Schuss-Extreme | KayKit (Rig_Medium, im Spiel) |
|---|---|---|---|
| Pistole einhändig | 25: `pistol_*` (Stand, Zielen, Gehen, Laufen, Strafe, Knien, Springen, Treffer, Nachladen), `gunplay_handcannon_stand/kneel`, `shooting_gun` | 4 (handcannon stand/kneel, pistol_shoot, shooting_gun) | `Ranged_1H_Aiming`, `_Shoot`, `_Shooting`, `_Reload` |
| Pistole beidhändig / Blaster | 12: `shooting_2h`, `shooting`, `gunplay_a/b/c`, `gunplay_rapid_*` (4), `gunplay_shooting`, `gunplay_cover`, `idle_aiming` | 7 | `Ranged_2H_*` (4) |
| Gewehr | 14: `firing_rifle`, `rifle_fire`, `rifle_aiming_idle`, `rifle_idle_a/b`, `rifle_walk_to_stop`, `walk_with_rifle`, `rifle_run`, `rifle_jump`, `rifle_hit`, `rifle_reload`, `reloading_a/b`, `rifle_aim_to_down` | 2 (firing_rifle, rifle_fire) | `Ranged_2H_*` |
| Schrotflinte | 1: `gunplay_shotgun` | 1 | wie Gewehr |
| Bogen | 1: `shooting_arrow` | 1 | `Ranged_Bow_Idle`, `_Aiming_Idle`, `_Draw`, `_Draw_Up`, `_Release`, `_Release_Up` |
| Zauberstab (einhändig) | 6: `fireball`, `spell_cast`, `standing_1h_cast_spell_01`, `standing_1h_magic_attack_01–03` | 6 | `Ranged_Magic_Raise`, `_Shoot`, `_Spellcasting`, `_Spellcasting_Long`, `_Summon` |
| Zauber beidhändig | 9: `standing_2h_*`, `great_sword_casting` | 9 | wie oben |
| Wurf | 1: `toss_grenade` | 1 | – |

**Befunde:**
- `pistol_shoot_a` und `shooting_gun_a` sind derselbe Clip. Darin hebt die Figur die **linke** Hand, eher nach oben als gezielt. Bitte in der Tafel prüfen; als Schuss-Clip ist er unsicher.
- `gunplay_a`, `gunplay_b`, `gunplay_cover_a` zeigen keinen Schuss im Anschlag. Sie sind als Haltung geführt.
- **Lücken für Mixamo-Figuren:** Bogen (nur 1 Clip), Schrotflinte (1), Gewehr im Gehen oder Strafe mit Schuss, Pistole Strafe rechts/links. KayKit-Figuren sind über `Rig_Medium_CombatRanged` vollständig.

## Download-Liste für Georgs Ja (Mixamo, wie r4: FBX ohne Modell, 30 fps, auf Michelle)

Die Namen sind Mixamo-Suchbegriffe. Die genauen Treffer prüfe ich beim Laden; Varianten unter einem Namen lade ich mit.

**Fernkampf:**
1. **Bogen:** „Standing Draw Arrow“, „Standing Aim Overdraw“, „Standing Aim Recoil“, „Standing Aim Idle“, „Standing Aim Walk Forward / Back / Left / Right“, „Standing Equip Bow“, „Standing Disarm Bow“, „Standing Idle (Bow)“, „Standing Run Forward (Bow)“ (Longbow-Paket).
2. **Gewehr:** „Rifle Strafe Left / Right“, „Rifle Walk Backward“, „Rifle Run Backward“, „Rifle Crouch Idle“, „Rifle Crouch Walk“, „Rifle Turn Left / Right“, „Walking Firing Rifle“ (bzw. „Firing Rifle“ im Gehen).
3. **Schrotflinte:** Suche „shotgun“, alle Treffer (Pump, Schuss, Zielen).
4. **Pistole:** „Pistol Strafe Left / Right“ (falls getrennt geführt), „Pistol Turn Left / Right“.

**Schwert (breite Figuren, WS0-Nachauftrag „23.11. früh“):**

5. Der frontale Abwärtsschlag liegt im Bestand: `haft2h_standing_melee_attack_downward_a`. Ein Download ist nur als Zusatz nötig: „Sword And Shield Attack“ (Varianten von oben).
6. Ausfallschritt-Stich: Suche „lunge“, „stab“, „sword thrust“ (einhändig).

**Umfang:** schätzungsweise 25–40 Dateien. Ablage wie r4 unter `MeshyModels/Mixamo Michelle/`, dann Backen in die Bibliothek mit eigenen Tafeln.
