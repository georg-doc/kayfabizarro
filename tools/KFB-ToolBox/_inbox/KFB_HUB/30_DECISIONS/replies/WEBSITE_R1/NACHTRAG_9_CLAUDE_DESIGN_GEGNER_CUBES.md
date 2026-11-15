Für Claude Design (Website-Chat) · Nachtrag 9: Gegner (neun Würfelmonster), Treffer-Flipbook, alle Songs · 15.11. (Georg q712, q714, V-1705, V-1824)

**1 · Gegner: Georgs Wahl (Hub q712)** Alien, Kaktus, Huhn, Krebs, Hirsch, Dämon, Pilz, Schwein, Panda. Cthulhu folgt (Punkt 4).

Repo `georg-doc/KFB-Stunt-Car-Race`, Zweig `assets/private` @72d3701c, je Würfel zwei Dateien:

| Würfel | Figur (`50_BLENDER/K15/cubes_kfb/`) | Figurenkarte (`50_BLENDER/K15/data/kfb/`) |
|---|---|---|
| Alien | `KFB_Alien_kfbeyes.k11c.glb` | `q_alien.figure.json` |
| Kaktus | `KFB_Cactus_kfbeyes.k11c.glb` | `q_cactus.figure.json` |
| Huhn | `KFB_Chicken_kfbeyes.k11c.glb` | `q_chicken.figure.json` |
| Krebs | `KFB_Crab_kfbeyes.k11c.glb` | `q_crab.figure.json` |
| Hirsch | `KFB_Deer_kfbeyes.k11c.glb` | `q_deer.figure.json` |
| Dämon | `KFB_Demon_kfbeyes.k11c.glb` | `q_demon.figure.json` |
| Pilz | `KFB_Mushroom_kfbeyes.k11c.glb` | `q_mushroom.figure.json` |
| Schwein | `KFB_Pig_kfbeyes.k11c.glb` | `q_pig.figure.json` |
| Panda | `KFB_Panda_kfbeyes.k11c.glb` | `q_panda.figure.json` |

- **Quelle:** Quaternius „Cute Animated Monsters Pack“ (MonsterCuteCubes), CC0.
- **Clips je Datei:** `Idle`, `Walk`, `Jump`, `Bite_Front`, `Bite_InPlace`, `HitRecieve`, `Death`, `Dance`, `Yes`, `No` (Schreibweise wie im Kit).
- **Augen nur mit Karte:** Die Figur trägt die Augenanker `KFB_Eye_R_anchor` / `KFB_Eye_L_anchor`. Die Augenschicht `50_BLENDER/K15/stage/kfb-proof-eyes.v1.js` (mit `stage/vendor/`) setzt EyeRig v6 und E2-Lider darauf und liest aus der Karte Augengröße, Pupille, Lidfarbe, Blickrichtung, Höhe und Bodenhub. Ohne Karte fallen die Augen auf Standardwerte zurück, und Schwein und Kaktus sinken rund 10 cm ein.
- **Gegner-Zustand:** `50_BLENDER/K15/stage/vendor/eye-goo.v1.1.js`, `attachEyeGoo(THREE, rig)`:
  - `set('red')`: Goo, schwarzer Augapfel, rot glühende Pupille. Das ist der Gegner im Hero-Shot.
  - `set('normal')`: geheilt, normale KFB-Augen (wie in der Karte unter `states.healed`).
  - `set('white')` ist ebenfalls Goo (weiß glühend), nicht geheilt.
- **Größe:** alle Würfel 0,8 m hoch (Georg q148), gleichmäßig skaliert über die Höhe aus der Karte.
- **Treffer:** Der getroffene Würfel spielt `HitRecieve` beim echten Kontakt der Klinge, beim letzten Hieb `Death`. Effekt und Kamerastoß nur am Kontakt und in Hiebrichtung (Nachtrag 7).
- **Stand:** Für die Würfel gibt es noch keine gebackene Web-Datei. Bis dahin gilt Figur + Karte + Augenschicht als Build.

**2 · Treffer-Flipbook `katana.hit`** (Stamm `game/integration-r2` @fef0526d):
- Ereignis: `src/data/combat/katanaReference.r1.json` → `ereignisse["katana.hit"]` (Staub aus den Zellen `dirt_01`, `dirt_02`, `smoke_06`, Kamera-Billboard, Leben 0,25 s, wachsend 0,6 → 1,5, Erosion), dazu `katana.hit.metal`; Hit-Stop 48 ms im selben File.
- Atlas: `src/assets/fx/blaster-reference-r1/combat-atlas.webp` + `combat-atlas.json` (Zellen mit `rect`), Herkunft `SOURCE_LOCK.json`, `LICENSE.txt` (CC0).
- Abspielen wie im Spiel: `src/modules/combatPlayer.r2.js`.

**3 · Songs (Georg q714): alle für die Website.** „Es sind meine Songs, und die sollen alle auf dem gleichen Weg und für KFB verfügbar sein.“
- Liste mit Titel, Tempo und Tonart: `src/audio/songsR2.js` im Stamm (`SONGS_PUBLIC`, `SONGS_PRIVATE`, `SONGS_ARENA`).
- Dateien: die zwei Titel aus `SONGS_PUBLIC` im Repo `georg-doc/kayfabizarro` @fae628c2 unter `media/kfb-audio/r1/suno_r2/`; alle übrigen AAC-Master (−18 LUFS) in `assets/private` unter `40_AUDIO/music_aac/suno_20261103/` und `40_AUDIO/music_aac/horror_wrestling_r1/`, Pfade und Prüfsummen in `scripts/audio/songs-pin.json` (Stamm). WS0 legt alle bald an einen gemeinsamen Ort; die Schlüssel bleiben gleich.

**4 · Cthulhu** liegt im selben Quaternius-Paket (`Cthulhu.gltf`) und hat noch keine KFB-Augen. Der Mac mini baut ihn wie die anderen, mit Karte `q_cthulhu.figure.json`. Bis dahin ist er ein Platzhalter; die Dateien kommen als kurzer Nachtrag mit gleichem Namensschema.

**5 · Zu deinen Fragen aus v12:**
- Der Carny-Satz „Krazy. Kayfabizarro. The Egyptian Mythology Wrestling Card Deck. Cut along the dotted lines. Don't eat the cards. I'm a rabbit, not a cop.“ stimmt wörtlich mit Georgs FrizzleBob-Stimmvorlage überein.
- Höhere Sprünge in Schnitt 6–8: bleibt so, bis der echte Luft-Hieb (Mixamo) da ist; der Choreograf passt dann die Flugzeit an.
