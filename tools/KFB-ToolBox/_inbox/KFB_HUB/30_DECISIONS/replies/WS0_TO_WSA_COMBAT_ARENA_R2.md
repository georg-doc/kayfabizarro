# WS0 → WSA · Combat Arena · Antwort auf RETURN R2 · 20.10.2026

Danke für PR #23 und die saubere Korrektur zu V-574.

1. **Scenelet R2 §4/6** ist nachgezogen (`replies/SPEC_SCENELET_R2.md`, Abschnitt (6)):
   - Originale Kit-Waffen bleiben am Kit-Slot mit nativen Clips (`axis: "kit"`).
   - V-536 (lowerarm, forearm) gilt nur für eigene Zielwerkzeuge.
2. **Mündungsfeuer gehört zum nächsten Runtime-Schritt** (Georg 17.10., Erinnerung 20.10.): die beiden Muzzle-Modelle der KayKit Mystery S6 „Action Figure“.
   - Primär `…/6 - December 2023 - Action Figure/assets/gltf/Muzzleflash.gltf`, sekundär `Muzzleflash_Long`.
   - Beide as-is (V-574) am Anker `KFB_Muzzle` der jeweiligen Waffe.
   - Laser und Magie nur als Farb- bzw. VFX-Varianten (V-499: eine Masse, keine Emission außer am Mündungsblitz selbst).
   - Bitte im Waffenprofil-Prüfer ein Feld `muzzle: { primary, secondary, variants[] }` ergänzen und prüfen, dass es auf diese zwei Quellen zeigt.
   - Private Kauf-Assets (Mystery S6) kommen nie in öffentliche Dateien; im Profil nur als Pfad bzw. Referenz.
3. **Erster Consumer ist der Spielzeugsoldat r3b von WSB:**
   - Original-Gewehr am KayKit-Slot, KayKit-Ranged-Clips;
   - Mündung neu gemessen: 2H-Anschlag −89° zur Figurenseite;
   - Sterbe-Clips mit `weaponDrop`.
   - Quelle: `50_BLENDER/B50/RETURN.md`, Abschnitt r3b; Scenelet `gunfight_duel_02`, Handoff 634.
4. **Zusammenführung der Branches:** entscheidet Georg. Bis dahin keine Merges.

**Nachtrag:** Die Mündungsmesswerte des Soldaten r3b stellt WSB bereit: `data/ToySoldier_muzzle.json` (Gieren −88,9°, 2H-Anschlag). Weitere Messwerte bitte über WS0 anfragen.

## Antwort auf MUZZLE R3 (20.10.)
- **Anker:** `KFB_Muzzle` hat glTF-lokal +Z = Laufrichtung (V-579), damit die Blitze as-is sitzen. WSB richtet den Anker in r3c aus; kein Drehoffset im Adapter.
- **Duel-Facing und Figurenkarte:** WSB korrigiert sie in r3c (native 2H-Mündung −88,9°, r3b/V-574-Texte).
- **Anschluss:** Danach schließt du an. Meldung über WS0.

## Soldat r3c fertig (20.10., WSB) – Anschlusswerte
- **GLB:** `50_BLENDER/B50/_privat_kauf_asset/KFB_ToySoldier_duel.r3c.glb`, sha256 `8ff9685f4ba6e435298239ec21afd20fabbe2042ea2fd37fed9656d7c83dbccb`. Geometrie, Skin, Clips und Materialien sind byte-gleich zu r3b; nur 4 Anker-Knoten sind neu.
- **KFB_Muzzle:** Kind von `kfb_rifle_ToySoldier_Rifle` an `handslot.r`, translation `[0, 0.2192, 1.5798]`, rotation Einheit. Ursprung in der Mitte der Mündungsöffnung, glTF +Z = Schuss, +Y = oben.
  - Probe: Anker-+Z ∥ Lauf 0,000° in allen Schuss-Clips, Gieren −88,9°.
  - Die Blitze kommen as-is als Kind ohne Drehung an diesen Anker.
- **Mitgezogen:** KFB_Grip, KFB_Grip_L und KFB_Bayonet_Tip auf dieselbe Konvention, die Lage ist unverändert.
- **gunfight_duel_02:** Akteur A ry = 178,9° (ry_rule im Scenelet), Waffe 2H Kit-Slot (V-574), Einhand-Notizen entfernt.
- **Daten und Karten:** `data/ToySoldier_muzzle.json` (inkl. Up-Vektoren), Figurenkarte `toysoldier_duel_r3c.figure.json`, `HANDOFF_R1/handoff.json` auf r3c.
- **Damit frei für den Runtime-Anschluss** in der Arena. Danach folgt die Spiel- bzw. Bildabnahme über WS0 und den Kritiker; die Merge-Entscheidung liegt bei Georg.

## V-581 · Kit-Achsen und Halterungsdrehung (Georg 20.10.)
- **Befund WSB (K10):** Die KayKit-Ranged-Clips halten handslot lokal +X nach vorn, die Kit-Waffen liegen lokal +Z. Deshalb zeigt der Lauf as-is etwa 82–89° zur Seite. Das betrifft Armbrust und Gewehr (Soldat −88,9°) und vermutlich alle Handguns und Blaster.
- **Regel:** Je Waffe gibt es eine feste, gemessene Halterungsdrehung. Bitte den Profilprüfer erweitern um `slotOffset.rotation` mit dem Grund `kit-axis-mismatch`: ein Wert für alle Clips, Beleg-Datei Pflicht, sonst FAIL. Nachdrehen je Bild und Wurzeldrehung bleiben verboten.
- **Priorität 1:** Handguns und Blaster, die Primärwaffen der Arena. Danach Gewehr, Armbrust und Gatling (2H, linke Stützhand).
- **Armbrust:** Sie bekommt kein Mündungsfeuer. Bitte `muzzle` für Bogen und Armbrust optional machen bzw. eine Variante `release` zulassen (Sehnen-Schnapp bzw. kleiner Staub-Puff, V-499, kurz).
- **source:** Ein CC0-Original, das nicht in Git liegt, ist als Dropbox-Pfad mit sha256 zulässig; `private: true`, weil die CombatRanged-Clips privat geführt werden.

**Nachtrag K10 §1 (WSB):** Handwaffen-Karten im Arena-Format liegen vor: `50_BLENDER/K10/data/kfb_kit_gun_pistol_prototype.weapon.json` und `K10/_privat_kauf_asset/kfb_kit_heroman_blaster.weapon.json`. Dein Prüfer meldet dort `SLOT_OFFSET_NEEDS_VISIBLE_INTERPENETRATION` bzw. `FINITE_SLOT_OFFSET_REQUIRED`, weil er `slotOffset.rotation` (V-581, Grund kit-axis-mismatch, Wert (0, 0.70711, 0, 0.70711) für alle Kit-Fernkampfwaffen) noch nicht kennt. Bitte ergänzen. Mess-Ereignisse aus den nativen Clips bei 30 fps: fire.1h 0,2667 s; fire-loop 0/0,4/0,8/1,2 s.

## V-582 · 2H-Waffen in drei Clip-Familien (Georg 20.10.)
- **Prüfer-Folgen:** `slotOffset.rotation` je Clip-Familie (Ziel, Bewegung/Ruhe, geschichtet); eine Wurzeldrehung je Waffe für die Ziel-Familie (Soldat ry_A 52,46°); geschichtete Clips (Upper-Body-Mask aus Running_HoldingRifle) als zulässige Quelle, `nativeClipsUnchanged` gilt dann je Teilclip.
- **Werte und Belege:** von WSB in `50_BLENDER/B50/RETURN.md` (r3d) und `K10/RETURN.md`.
- **Gatling aus dem Destruction-Mech-POC:** per-Bild-`aimGun()` und Lauf-Emission entfallen beim Übernehmen.

**Soldat r3d fertig (V-582):** `50_BLENDER/B50/_privat_kauf_asset/KFB_ToySoldier_duel.r3d.v3.glb` (sha 756b70b2910a…), Karte `toysoldier_duel_r3d.figure.json` (Halterung je Familie, rootYawDeg −37,54), Scenelet gunfight_duel_02 ry_A 52,46°, `data/ToySoldier_muzzle.json` r3d. Host-Hinweis: Die Rückdrehung der Figur in die Laufrichtung zwischen den Zielphasen ist Laufzeit-Sache (dein Adapter).

## Nächste Jobs (21.10., WS0 nach Durchsicht von PR #20–#24)
Reihenfolge; alles auf eigenen `wsa/*`-Branches, Merges nur mit Georg.
1. **Prüfer fertig machen (PR #23):**
   - `slotOffset.rotation` mit Grund `kit-axis-mismatch` (V-581, Wert (0, 0.70711, 0, 0.70711) für alle Kit-Fernkampfwaffen);
   - Clip-Familien nach V-582;
   - `muzzle` für Bogen und Armbrust optional bzw. Variante `release`.
   - Danach die K10-Karten (Pistole, Heroman-Blaster) grün melden.
2. **Handguns und Blaster spielbar** (Priorität 1, die Primärwaffen der Arena), wie der Soldat in PR #24: native Clips, Mündungsblitz as-is am `KFB_Muzzle`, Mess-Ereignisse fire.1h 0,2667 s und fire-loop 0/0,4/0,8/1,2 s. PR #24 auf Soldat **r3d** umstellen (`50_BLENDER/B50/RETURN.md`, r3d).
3. **Übernahme in die offene Welt vorbereiten (PR #20 fortschreiben):** Die Bausteine, die WS1 übernehmen soll, als eigenständige ES-Module mit Vertragstests, die ohne Arena laufen:
   - Waffenprofil-Prüfer;
   - Muzzle-Adapter;
   - Hit-Stop (V-567);
   - Monster-Roster.
   Je Modul: Eingang, Ausgang, Test, bekannte Abhängigkeiten. In WS1 wird nichts eingebaut; das entscheidet der WS1-Lead mit Georg.
4. **Spender-Paket Dark Fluffer (V-583/V-584)** für die neue WS1-Sitzung WS-NPC (Phase C, V-585):
   - aus `modules/kfb-monster-roster.js` und `combat-arena-v3/spuck.v3.js` je Bodenläufer-Cube: Maul-Anker (lokal), Blickrichtung +Z, Clip-Liste, Spuck-Timing (Ausholen ≈ 0,34 s, 3–5 Tropfen);
   - eine Isolationsseite (je Cube von vorn, Spuck-Bild ohne Zielring).
   - Ablage `dark_fluffer_donor/` auf einem `wsa/*`-Branch; Meldung über WS0.
   - Kein Laufzeit-Code für die Welt, nur Daten und Belege.

## Stand gesehen (21.10. früh, WS0)
- PR #24 (Pistole, Blaster, Soldat r3d) und #25 (vier Module mit Vertragstests) passen zu V-584 Job 1–3. Danke. Merge nur durch Georg.
- **Weiter mit Job 4** (Spender-Paket Dark Fluffer). WS-NPC (V-585) nutzt es in Phase C.
- **Neu von WSB, danach anschließen:** Armbrust K10 §3 fertig nach V-582.
  - Karte `50_BLENDER/K10/data/kfb_kit_crossbow_2handed.weapon.json`, Halterungen `K10/data/crossbow_2handed_mounts.json`.
  - Ziel ohne Figurdrehung.
  - Marken: fire.2h 0,2667 s, fire-loop.2h 0/0,267/0,533/0,8 s.
  - Kein Mündungsfeuer, sondern dein kurzer `release`-Effekt (Sehnen-Schnapp bzw. Staub-Puff, V-499).
  - Liegt nur in Georgs Dropbox; Zugriff wie bei den K10-Handwaffen.
- Gatling folgt (am Boden fertig, Flug in Arbeit), Meldung über WS0.

## Spender-Paket Dark Fluffer angenommen (PR #26, V-589)
- Danke, sauber: 17 Cubes, isolierte Bilder, kein Zielring. Der Befund zur Maulformel ist wichtig.
- WS0-Auswahl: `q_mushroom` zuerst, dann `q_ghost`.
- Den Maul-Anker `KFB_Mouth` an der sichtbaren Öffnung baut WSB (K11). Die 0,62-Formel wird nicht übernommen.
- Für dich bleiben nur noch die Armbrust (oben) und danach die Gatling, wenn WSB sie meldet.

## Gatling K10 §4 fertig (WSB 21.10.), danach anschließen
- **Karte und Werte:** `50_BLENDER/K10/_privat_kauf_asset/kfb_kit_combatmech_minigun.weapon.json` (privat), Werte `K10/data/combatmech_minigun_mounts.json`, Bild `K10/out/K10_gatling.png`.
- **Halterung:** eine für Boden und Flug, seitlich am Tragegriff: q (−0.26562, 0.39234, −0.08089, 0.87691) + [0, 0, 0.15], je Clip 1–2 cm mit Beleg (V-574).
- **Boden:** Oberkörper ruhig aus Running_HoldingRifle @ 0,25 s, Beine aus dem Clip (V-582 geschichtet). 10 Clips, 0 Durchstich.
- **Flug:** 8 Flight-Family-Clips.
- **Nicht für die Minigun:** Ranged_2H_*, flight_aim, flight_brake_recover; roll_reaction HOLD.
- **Feuern:** `rootYawDeg −36` (Ziel-Familie mit Figurdrehung). Dauerfeuer ohne Schuss-Clip, 18/s, Spin-up 0,16 s, Barrel-Spin um lokal +Z. Mündungsblitz as-is am `KFB_Muzzle`.
- **Prüfer:** nur die bekannte V-581-Feldmeldung. Bitte so erweitern, dass „Clip-Familie ausgeschlossen“ (exclude-Liste je Waffe) zulässig ist.
- Liegt nur in Georgs Dropbox; Zugriff wie bei den anderen K10-Karten. Merge nur durch Georg.

## Action-Figur-Gewehr K10 §6 = 1H (V-592, WS0 21.10.)
- Wie im Kit-Artwork (Mystery S4) **einhändig an der Hüfte**, nicht als 2H. Mit Stützhand geht das klobige Gewehr in allen Ziel-Clips durch Körper und Arm.
- **Karte:** `50_BLENDER/K10/_privat_kauf_asset/kfb_kit_actionfigure_gun.weapon.json` (privat). Bild `K10/out/K10_actionfigur_gewehr_1h.png`.
- **Halterung:** Kit-Drehung +90°/Y wie alle Handwaffen (V-581) + Versatz [0,1, 0, 0,02] mit Beleg.
- **Clips:** Ranged_1H_Aiming/Shoot/Shooting, 0 Durchstich, keine Figurdrehung (Lauf 1,3°).
- **Marken:** fire 0,267 s, Dauerfeuer alle 0,4 s.
- **Ausgeschlossen:** Ranged_1H_Reload, Ranged_2H_* (exclude-Liste wie bei der Gatling).
- Prüfer: nur die bekannte Versatz-Meldung wie beim Blaster.

## Wurf K10 §7 fertig (WSB 21.10.), Rauchbombe
- **Karte:** `50_BLENDER/K10/data/kfb_kit_smokebomb.weapon.json` (use throw; KayKit Adventurers 2.0 FREE, CC0). Bild `K10/out/K10_wurf_v574.png`.
- **Halterung:** keine Drehung, Versatz [0, 0, 0,1] handslot-lokal mit Beleg (V-574). 0 Durchstich in 42 Bildern.
- **Abwurf:** Bild 19 = 0,633 s, Punkt [−0,713, 1,400, −0,188], 14,55 u/s, Gieren −8,0°, Steigung 9,3°.
- Prüfer: nur die bekannte Versatz-Meldung.

## 1H-Nahkampf K10 §8 fertig (WSB 21.10.), as-is angenommen
- **Karte:** `50_BLENDER/K10/data/kfb_kit_skeleton_blade.weapon.json` (use melee, clipMarkers, asIsFindings, `KFB_Tip`), CONTRACT_PASS. Klinge Skeleton_Blade as-is an handslot.r, CombatMelee-Clips (CC0) unverändert.
- **Kontakt-Marken** (eine Regel über das Spitzentempo, trifft K9-Chop 0,633 s):
  - Jump_Chop 0,800 s
  - Slice_Diagonal 0,467 s
  - Slice_Horizontal 0,333 s
  - Stab 0,433 s
  - Volle Tabelle: `K10/out/melee/melee_markers.json`.
- **Kleine Kit-Streifungen** (Helm ≤ 1,1 cm, Umhang, Körperseite beim Ausholen): Bei Spieltempo nicht sichtbar, deshalb **kein Versatz** (V-574: Versatz nur bei sichtbarer Durchdringung). In der Karte als `asIsFindings` dokumentiert.
- Hit-Stop (V-567) und Kontakt-Event bitte an diese Marken hängen.
