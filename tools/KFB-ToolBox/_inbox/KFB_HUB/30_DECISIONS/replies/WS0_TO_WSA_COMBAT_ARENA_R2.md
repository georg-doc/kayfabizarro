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

## Magie K10 §9: Zauberstab fertig (WSB 21.10., V-593)
- **Karte:** `50_BLENDER/K10/data/kfb_kit_wand.weapon.json` (Adventurers wand, CC0), CONTRACT_PASS. Skelett-Magier mit KFB-Augen, Clips Ranged_Magic_* unverändert.
- **`KFB_Muzzle`** = Zauberpunkt, +Z = Zauberrichtung. Den Zauber-Effekt baust du (V-499: keine Emission außer am Effekt selbst). Statt der Kit-Mündungsblitze ein `cast`-Effekt, wie `release` bei der Armbrust.
- **Marken:** `K10/out/magic/magic_markers.json`.
  - Shoot cast 0,300 s
  - Long: Aufladen bis 1,233, cast 1,567 s
  - Raise: cast 0,633, halten bis 1,467 s
  - Dauerzauber: Schleife 0,667 s
  - Summon: Bodenstoß 2,767 s
- **Summon** nur ohne Waffe (exclude bei Zauberstab bzw. Stab).
- Lange Stäbe folgen, wenn WSB sie freigibt.

## Lange Stäbe K10 §10 fertig (WSB 21.10., V-593)
- **Karten:** `50_BLENDER/K10/data/kfb_kit_skeleton_staff.weapon.json`, `kfb_kit_staff.weapon.json` (CC0), CONTRACT_PASS. `mount.families.perClip`: je Clip eine feste Kippung + Griff am Stiel.
- **Clips:** Shoot, Spellcasting, Spellcasting_Long. Ausgeschlossen: Raise (keine freie Haltung) und Summon mit Waffe.
- **Zauberrichtung** beim cast 10–13° seitlich durch die Kippung. Mit der Ziel-Familien-Logik ausgleichen: Figur drehen bzw. zielen (wie V-582).
- **Marken mit Halterung:** Shoot cast 0,300 s, Long 1,567 s. Bild `K10/out/K10_magie_staebe_v593.png`.

## Bogen K10 §12 fertig, K10 komplett (WSB 21.10., V-594)
- **Karten:** `50_BLENDER/K10/data/kfb_kit_bow_a_withstring.weapon.json`, `kfb_kit_bow_withstring.weapon.json` (CC0), CONTRACT_PASS. Darin drawRule (Sehne über Blendshape Draw), arrow, shootCycle, families.
- **Halterung:** eine je Bogen für Idle, Aiming_Idle, Draw_Up, Release_Up und Running_HoldingBow. Draw und Release sind ausgeschlossen.
- **shootCycle:** Draw_Up (nock 0,467, voll 0,733/0,767) → optional Aiming_Idle (gespannt halten) → Release_Up (Lösen 0,033 s).
- **Abflug steil 41–43°:** als Bogenschuss (ballistische Bahn) spielen. `rootYawDeg` −39,0 (bow_A) bzw. −24,4 (Adventurers).
- **Pfeil:** fest in der Zughand von nock bis Lösen. Federn an der Wange = Anker-Pose, ok.
- Kein Mündungsfeuer, sondern dein `release`-Effekt (wie Armbrust).
- **Damit ist K10 vollständig:** Handwaffen, Soldat, Armbrust, Gatling, Action-Figur-Gewehr, Wurf, 1H-Nahkampf, Magie, Bogen.

## ToolBox-Job FrizzleBob: Brauen und Schatten-Empfang (WS1 §110/§111, WS0 21.10.)
Gehört in die neue ToolBox (P08-Export, „Fixes nur noch in der ToolBox“), nicht in die Arena und nicht nach Blender.
1. **Brauen:** Sie ragen an den Schläfen über den Kopfumriss und sind von hinten als schwarze Spitzen an den Ohransätzen sichtbar (Georg-Screenshot). Schmaler bzw. enger an den Kopf, Lage von vorn unverändert.
2. **Schatten-Empfang:** Haarbüschel, Brauen, Schnurrbart und Mund sind ShaderMaterials ohne Schatten-Chunks und empfangen deshalb keinen Schatten. Entweder die Schatten-Chunks ergänzen oder auf Knet-Material (kfb-clay) umstellen. Das Bild bleibt in der Proof-Stage gleich.
- **Abgabe:** Proof-Stage-Bilder vorn/hinten/seitlich und mit Schatten, P08-Export, Meldung über WS0. Merge nur mit Georg.

## weaponDrop K10 §13 (WSB 21.10.)
- **Alle 11 K10-Karten** haben jetzt das Feld `weaponDrop` (Lösen, Liegen, Endlage relativ zur Wurzel, Bahnregel), für Death_A und Death_B. Die Kit-Clips sind unverändert.
- **Lösen,** wenn die Hüfte 25 % ihres Falls hinter sich hat:
  - Death_A 0,433 s (Krieger 0,500, Magier 0,100);
  - Death_B 0,167 s.
- **Fall** ≤ 0,4 s, Ruhelage flach neben der Figur.
- Bitte an den Death-Clips anschließen. Bild: `K10/out/K10_weapondrop.png`.
- Ausnahme: Bei den Bögen in Death_B prüft WSB noch die Endlage nach.

## Nachtrag zum ToolBox-Job FrizzleBob (WSB-Befund 21.10.)
- Das FB-Rohmodell `FB_TEMPLATE_LOOK_v5b.glb` enthält noch die Modell-Augen. Brauen, Nase und Mund stehen dort ohne Georgs Werte; die setzt bisher nur die Prüfbühne aus der Karte (`pets[0].original`).
- Jede Laufzeit ohne face-mount zeigt deshalb Doppelaugen und zu tiefe Brauen. Bitte im ToolBox-Export (P08) so lösen, dass der Export selbst Georgs Werte trägt.
- WSB baut FB nicht mehr (Georg). Ein falscher Blender-Versuch (k12b/k12c) ist verworfen.

## PR #27 gesehen (21.10., WS0): K10-Waffenfamilien in der Arena
- Stark: alle zwölf K10-Verbraucher spielbar, native Marken, Ausschlusslisten, ballistische Pfeile, HitStop und Fallbahnen. Merge nur durch Georg.
- **Bogen Death_B:** von WSB freigegeben (21.10.). Der Bogen liegt am Ende sichtbar hinter den Füßen, Endlage bow_a [1,80, 0,05, −0,58], Bild `50_BLENDER/K10/out/K10_weapondrop_bogen_deathB.png`. Den Ausschluss bitte aufheben.
- **Rauchbombe ohne weaponDrop-Karte:** Dein Laufzeit-Rückfall ist ok. Sie wird beim Wurf verbraucht; stirbt die Figur mit der Bombe in der Hand, fällt sie nach derselben Bahnregel. Kein WSB-Nachzug nötig.
- **Offen:** Stab-Long/Channel/Area und finales Waffensounddesign. Für Ton nimm die vorhandenen WSA- bzw. ElevenLabs-Sets (`KFB_HUB/40_AUDIO/elevenlabs_r1/combat_r1`, `blaster_r1`, `throwables_r1`). Hörabnahme macht Georg.
- **Als Nächstes von WSB:** K13 Large-Rig-Nahkampf (black_knight, demon_lord, orc_brute). Meldung über WS0.

## Neuer Job (21.10., V-599): Repo `kayfabizarro` privat vorbereiten
Georg will das Repo privat stellen, seine öffentlichen Seiten müssen aber weiterlaufen: `kayfabizarro.pages.dev/FrizzleBob/` (Regeln, Essays), PDF- bzw. Deck-Viewer, die übrigen Pages und die chatgpt.site-Werkzeuge. Brief: `replies/BRIEF_WSA_REPO_PRIVATE_SWITCH_R1.md` (auf deiner Inventur vom 17.10. aufbauend). Den Schalter legt Georg um, nicht du.

## Aus WS1 Combat-AV R1 (21.10., V-604): Werkzeug-Fixes und kommender Einbau
- `tools/serve_soldier.py`: `request_queue_size=256` (verliert sonst beim ersten Laden Modul-Anfragen, `ERR_CONNECTION_RESET`).
- Parameter heißt `?actor=soldier-r3d` (nicht `soldier`, `qa.js:22`).
- Einbau der Prüfer-Prototypen (`ws1/combat-av-r1`: Klang je Waffe mit Ebenen V-461, Klinge Schwung vor Treffer, Gegner-Bus 0,4, `?hit=knet` als Umschalter, Gegner-Ankündigung): nach Georgs Auswahl über dich. `gunfight.v2.js` ist hash-gesperrt, also mit Nachtrag im Recovery-Manifest.
- **Kaskade-Fehler:** `confirm.hit` feuert auch bei eigenem Schaden, Tod und Rauchbombe; Rauchbombe ruft `impact.kinetic.air`, den es nicht gibt; stumm sind Magie `raise`, weaponDrop, Schädel und Beute. Das gehört zu deinem nächsten Arena-Schritt.

## Georg im Hub (21.10., V-609): Goo-Gegenmittel und Zensurbalken
- **Freiwaschen:** jede Fluff-Farbe wäscht Geschwärztes frei (Karten und Spielfeld); die passende Farbe als Rätsel kommt später über Spielknoten. Für die Card Ink Defense bzw. das Arena-Clearen.
- **Zensurbalken:** Knet-Streifen in Tintenschwarz mit Glanz und Tropfkante über 1–2 Inhaltswörtern, in Sprechblasen **und** auf geschwärzten Karten-Texten; nie über Kartentiteln oder Namen (V-508). Freiwaschen entfernt sie.


## 22.10. · V-624: MVP-Stage als GPT-Site
- Georg: Die spielbare MVP-Fassung baust du wieder als GPT-Site bzw. Stage wie zuvor, mit privatem Abruf serverseitig wie bei WS1-Staging. Kein Cloudflare-Pages-Projekt fürs Spiel.
- Quelle ist der Spiel-Branch `ws1/mvp-r1` vom WS1-Lead (Brief `BRIEF_WS1_MVP_MERGE_SITE_R1.md`).


## 22.10. · K13 Rig_Large-Nahkampf liegt im privaten Branch
- WSB hat K13 geliefert, alle Karten CONTRACT_PASS (Prüfer WSA):
  - Schwert groß, Axt groß, Keule (Raider), Schild normal (Knight), Schild groß (Brute/Demon);
  - je Clip eine feste Halterung, `excludedClips` mit Grund, `clipMarkers`, `weaponDrop`;
  - Boss-Launch V-600 für Large und Medium.
- Pfad: `50_BLENDER/K13/` (`_privat_kauf_asset/`, `boss/`, `RETURN.md`).
- Einbau in die Arena wie K10, nach Georgs Abnahme des Proof-Stage-Bogens.


## 22.10. · V-628: Kartenprüfung für gerichtete Waffen
- **Neue Prüfung in eurem Karten-Check (CONTRACT):**
  - Bei Waffen mit Anker `KFB_Edge` (Axt, Schwert, Katana, Samurai-Schwert, Spitzhacke, Sense, Hammer) muss die Schneide an der Kontakt-Marke in Bewegungsrichtung der Waffenspitze zeigen (Skalarprodukt ≥ 0,7). Sonst ist die Karte FAIL.
  - Ohne `KFB_Edge` an einer gerichteten Waffe: ebenfalls FAIL.
- **Grund:** K13 hatte eine verdrehte Orc-Axt mit CONTRACT_PASS (Georg).
- **K13 liegt im privaten Branch** (`50_BLENDER/K13/`): Schwert groß, Axt groß, Keule, Schild normal und groß, Boss-Launch. WSB korrigiert die Axt (N21) und liefert große Waffen für den Boss-Move (N22). Einbau nach Georgs Abnahme des Proof-Stage-Bogens.


## 22.10. · Antwort auf deinen ToolBox- und Death_B-Bericht
- **Dein Bericht** (Draft-PR kayfabizarro #442) ist hier übernommen. Bitte schreib künftig direkt eine eigene Datei `replies/WSA_TO_WS0_*.md` statt in diese WS0-Datei; die WS0-Datei wird über die Sync laufend geändert und gerät sonst in Konflikt. #442 kann Georg dann schließen.
- **ToolBox P08 FrizzleBob-Gesicht** (`wsa/toolbox-frizzlebob-face-2026-10-21` @20a0123): Den Stage-Nachweis bitte **lokal aus dem Branch** holen, ohne Login und ohne Preview-URL:
  - ToolBox statisch serven;
  - P08 im Headless-Browser laden;
  - Stage-Screenshots (vorn, ¾, Gesicht nah, mit Schatten auf Haar, Brauen, Schnurrbart und Mund);
  - Export → Import-Roundtrip mit Vergleich von `parts.eyes` und `partColors`.

  Die Bilder schickst du an WS0, WS0 stellt sie Georg in den Hub.
- **Death_B Bogen** (Arena #28, CI #524 grün): Inhalt passt. Nach deinem Stage-Bild mit Death_B samt weaponDrop entscheidet Georg über den Merge.


## 22.10. · Bitte von WS-Audio (Status 8)
- Die Neuaufnahmen C01–C12 (v2/v3 aus `combat_av_fix_r1/r2`, als `_lufs`) bitte ins Arena-Ton-Manifest aufnehmen. Das Spiel nutzt sie schon, der Arena-Kampf noch nicht.


## 22.10. · Karten-Check: neuer slotOffset-Grund „edge-forward“ (V-628)
- WSB trägt bei Halterungen, die wegen der Schneidenregel gedreht sind, `alsoReason: "edge-forward"` ein. Bitte diesen Grund im Karten-Check zulassen, neben „visible-interpenetration“.
- K13 ist nach der Axt-Korrektur neu im privaten Branch: alle 5 Karten CONTRACT_PASS, Axt-Block_Attack und -Stab auf exclude.


## 22.10. · WSA-Work-Job „GPT-Site mit allen Features“ fürs MVP (V-624, V-630)
- **Übergabe von WS1:** `ws1/handoff/HANDOFF_GPT_SITE_R1.md` auf `ws1/mvp-r1` (Kopie in `ws1/kfb-planet/docs/`).
- **Quelle:** privates Repo `KFB-Stunt-Car-Race`, Branch `game/mvp-r1`. Private Dateien kommen aus `assets/private`.
- **Build:** `npm ci && node scripts/site/build-site.mjs` (Node 22, `ASSETS_TOKEN`) → `dist/`. Umfang: 46 MB Spiel, 242 MB Ton.
- **Laufzeit:** Passwort für alle Pfade (Plattform-Secret), `/raw`-Proxy, HTTP-Range für Musik, MIME-Typen.
- **Bitte beantworten:** Plattform-Grenzen, Funktionen und Secrets, Deploy-Auslöser, Adresse und Tester. Antwort in eine eigene Datei `replies/WSA_TO_WS0_GPT_SITE_R1.md`.
- **Danach:** FrizzleBob-P08-Roundtrip melden, damit WS1 ihn übernimmt.


## 22.10. · Bitte von WS-Audio: Musik-Katalog der Audio Site
- WS-Audio braucht `catalog.snapshot.json` der Audio Site (bpm, Downbeat, Moods und Lautheit für die 14 Suno-Fahrt-Titel und die 24 Cozy Tunes) und, falls vorhanden, die Visualizer-Form.
- Bitte als Datei nach `KFB-Stunt-Car-Race/assets/private` unter `40_AUDIO/catalog/` legen bzw. WS0 den Pfad nennen. Datei liegt im privaten Branch, nicht öffentlich.
- **K10 Skeleton_Blade:** Die Marken ziehen nach der Tempo-Regel vor (Chop 0,600, Stab 0,400; V-635). WSB passt die Karte an. Bitte im Arena-Profil übernehmen, sobald sie im privaten Branch liegt.


## 22.10. · K13 floorLift + weaponDrop-Bezug (WSB)
- WSB legt für Death_A der Rig_Large-Figuren floorLift-Tabellen je Figur × Clip an (`K13/data/k13_floorlift_<fig>.json`, V-596), weil Knight, Demon und Brute sonst tief einsinken.
- **Wichtig für die Arena:** Die weaponDrop-Ruhelage bezieht sich auf den Weltboden (y ≈ 0,003). Sie darf nicht an der gelifteten Wurzel hängen. In den Karten steht `weaponDrop.frame = "Boden, ohne floorLift"`.


## 22.10. · ToolBox P08: FrizzleBob-Ohren reduzieren (V-643)
- **Befund WS1 (Leistung R1):** Jedes FB-Ohr hat 22 k Dreiecke, das ist der größte Einzelposten an der Figur.
- **Bitte in der ToolBox-Quelle (P08)** auf etwa 4 k je Ohr reduzieren:
  - Silhouette, Ohr-Rig und Feder-Bones unverändert;
  - Sichtprüfung vorher/nachher (vorn, ¾, Seite, nah).
- Dann einen neuen P08-Export. Das gehört in denselben Gang wie der lokale Stage-Nachweis des Gesichts.


## 22.10. · Meshy-Suche im Asset Librarian (V-644)
- **Weg B zuerst:** Meshy-Community-Links kommen in die vorhandene Selection- bzw. Importliste des Librarian, mit Provenienz und echter Modellprüfung. Grundlage ist dein Brief `BRIEF_WSA_WORK_MESHY_LIBRARIAN_INTEGRATION_R1.md` auf `planning/asset-librarian-meshy-community-search-r1-2026-10-22`.
- **Weg A** (Enterprise-Endpoint) nur, wenn Georg Enterprise-Zugang hat. Keine undokumentierten Web-Endpunkte.

## 22.10. · Repo-privat (PR #443)
- Danke, sauberer Zwischenstand. Weiter mit den restlichen Seiten-Migrationen.
- Die Frage zu den öffentlichen Spiel-Slices mit Kauf-Figuren liegt bei Georg; Antwort folgt.


## 22.10. · Georgs Antworten (V-647)
- **Meshy:** kein Enterprise, also nur Weg B (Link-Import in den Librarian).
- **Öffentliche Spiel-Slices** (Arena, Travel, Race) kommen hinter dasselbe Passwort wie die übrigen privaten Seiten, vorerst nur für Georg. Bitte in der Repo-privat-Umstellung (PR #443) so einplanen, keine Ersatzfiguren.


## 22.10. · K13 N28: große Orc-Keule (V-651)
- `kfb_kit_orc_club_large.weapon.json` (privater Branch, `50_BLENDER/K13/_privat_kauf_asset/`): Orc_Club ×2,0 über einen skalierten Wurzelknoten, Netz byte-gleich.
- **Bitte im Karten-Check ein Feld `scaleException` mit Verweis auf V-651 zulassen.** Bisher kennt der Prüfer nur kit-original und custom.
- Boss-Slash mit Hammer-Space (Erscheinen 0,50 s, Treffer 0,60 s, weg 1,033 s), CONTRACT_PASS bei WSB.
