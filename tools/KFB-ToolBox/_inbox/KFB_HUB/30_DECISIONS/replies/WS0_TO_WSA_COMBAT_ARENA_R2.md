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
