# WSA → WS0 · V-584 Jobs 1–4 · Rückgabe 21.10.2026

Die vier Jobs wurden in der beauftragten Reihenfolge bearbeitet. Alle Quellenänderungen liegen auf `wsa/*`-Branches. **Keine Merges, kein WS1-Einbau, keine Kauf-Assets veröffentlicht.** Arena-main unverändert auf `f6a59ad15b9ffcf3164b0ab013f223962b63f61f`.

| Job | Lieferung / gepinnter Commit | Prüfung |
|---|---|---|
| 1 Profilprüfer | [PR #23](https://github.com/georg-doc/KFB-Combat-Arena/pull/23), `412269c91f2b3293e04a0b88635cf0ceeeb5aa9f`, `wsa/arena-weapon-policy-r1-2026-10-20` | 95/95 Tests, Build 205, Rehome 172/66; GitHub-CI grün |
| 2 Primärwaffen / r3d | [PR #24](https://github.com/georg-doc/KFB-Combat-Arena/pull/24), `c04e4deb295c94474e454ab742ea71680f387d16`, `wsa/toysoldier-r3c-playable-2026-10-20` (historischer Branchname) | 109/109 Tests, Build 225, 167 Runtime-Dateien unverändert + 5 dokumentierte Deltas, 66 Donoren; GitHub-CI grün; echter Browser-Spieltest |
| 3 WS1-Bausteine | [PR #25](https://github.com/georg-doc/KFB-Combat-Arena/pull/25), `cb0d93cf3d4542c15f70f88ce2ab08d418374049`, `wsa/openworld-modules-v584-2026-10-21` | 69/69 Tests, 9/9 zusätzlich aus isolierter portabler Ablage ohne Arena; Build 208, Rehome 172/66; GitHub-CI grün |
| 4 Dark-Fluffer-Spender | [PR #26](https://github.com/georg-doc/KFB-Combat-Arena/pull/26), `028dd009bca606d393b94094d6d10390e8e4bddd`, `wsa/dark-fluffer-donor-v584-2026-10-21` | 66/66 Tests, 17 Originalmodelle/34 PNGs tatsächlich gerendert, Hashes geprüft, Zielringe 0; Build 203, Rehome 172/66; GitHub-CI grün |

## 1 · K10-Karten grün

Prüfer unterstützt belegte feste `slotOffset.rotation` V-581 (+90° Y, q und −q), Positionsversatz mit eigenem Durchdringungsbeleg, V-582-Clip-Familien/Teilclipmasken und ausschließlich gemessenen Aim-Wurzelversatz. Bogen/Armbrust haben einen physischen Release-Anker; kein Flash, optional kurzer nichtemissiver string-snap/dust-puff. Fehlende Feuerwaffen-Mündung bleibt FAIL.

**Die echten K10-Karten Pistole und Hero-Man-Blaster wurden unverändert als Metadaten-Fixtures gehasht und melden beide CONTRACT_PASS.** Das ist keine neue visuelle Quellenfreigabe. Kanonischer ES-Modul-Pfad: `modules/combat/weapon-profile.v1.mjs`. Details in `_handover/V584_JOBS_2026-10-21/JOB1_PROFILE.md`.

## 2 · Spielbarer Anschluss

`?actor=pistol`, `?actor=blaster`, `?actor=soldier-r3d`; bisherige r3c-URL öffnet kompatibel r3d. FrizzleBob bleibt erhalten. `&fire=loop` ist der ausdrücklich wählbare native Dauerfeuer-Modus.

- Originalwaffen, fester K10-Mount; Blaster mit belegtem Versatz. Native 1H-Clips/Messwerte: fire 0,2667 s; Schleife 0/0,4/0,8/1,2 s. Genau ein Abgang je Marker; Loslassen/Fokusverlust beendet Folgeabgänge ohne Auftragswarteschlange.
- r3d.v3-Modellhash `756b70b2910abc8715d4c7831b72e7e42580920b10755f394876aa0be0e40ecf`. Familienhalterungen/geschichtete native Teilclips sind bereits im Paket; kein zweites Anwenden. Natürliche Ruhe-/Laufhaltung, gemessener Aim-Wurzelversatz −37,54°, Rückkehr zur Bewegungsrichtung über den bestehenden Controller.
- Ein aktiver Körper-Mixer, ein EyeRig v6/E2, bestehende Welt-/Combat-/Reward-/Zeit-Owner. Physischer animierter KFB_Muzzle +Z, beide Originalblitze as-is. Keine Zielvektor-Ersatzmunition.
- Browser mit echter Maus/Tastatur: Pistole 3 Schüsse/3 Treffer/1 Kill; Blaster 6 Schüsse/3 Treffer/1 Kill; r3d 4 Schüsse/3 Treffer/1 Kill. Je Kill 1 Würfel/1 Pop. r3d danach im Lauf- und Ruheclip gesehen. Blaster-Schleifenwechsel und Stop nach Loslassen belegt. Keine Actor-Ausnahme in den gespeicherten Reports.
- Ein gefundener Maßfehler ist behoben: vor dem Host-Skalieren die Skinbounds nach nativer Pose erneuern, sonst wurde HeroMan mit alter Bindbox doppelt so groß. Der Host bleibt Skalierungs-/Boden-Owner.
- Bestehende Würfelmunition bleibt, keine neue Schadens-/Ausrüstungspipeline. Keine neue subjektive Hörabnahme behauptet.

## 3 · Übernahme vorbereitet, nicht eingebaut

PR #20 bleibt die historische Planung. Seine **WSA-Fortsetzung #25** liegt bewusst auf einem neuen `wsa/*`-Branch, gegen den unveränderten Planning-Branch; in #20 ist der Verweis ergänzt. Keine Quellenänderung auf einem `planning/*`-Branch.

`open_world_donors/README.md` nennt je Modul Eingang/Ausgang/Test/Abhängigkeiten. Profilprüfer, Original-Muzzle-Adapter, Hit-Stop V-567 und immutable Monster-Roster-Adapter laufen ohne Arena-Wirt. Portables Paket mit SHA-Lock tatsächlich außerhalb des Repos getestet. Keine zweite Monster-Tabelle oder Asset-Datenbank.

Hit-Stop ist ein vorbereiteter Zeitbudget-Vertrag, kein bereits spielabgenommenes Arena-System: Default 4/60 s, max. 150 ms je aktives Überlappungsfenster, nur beteiligte Figuren, keine globalen Mixer-/World-Schreibzugriffe. Kamera-Kick ist standardmäßig aus. Der alte Cartoon-Deformer mit direktem mixer.timeScale wird nicht als zweiter Zeit-Owner mitgegeben. **WS1-Lead und Georg entscheiden den Einbau.**

## 4 · Wichtiger offener Bildbefund für WS-NPC/WSB

Alle 17 Boden-Cubes, tatsächliche GLTF-Cliplisten/-dauern, +Z und lokale Mauldaten liegen in `dark_fluffer_donor/`. Die 34 Bilder zeigen Front-Idle und Spuck-Abgang bei 0,35 s nach 0,34 s Ansage; Original-Spuckquelle unverändert, 3–5 konfigurierte Tropfen mit Nachlauf, kein Zielring. Seed 17 hat drei konfigurierte Tropfen; im frühen Abgang ist zunächst nur der führende sichtbar. Der Viewer hat keinen Welt-Gameplay-Owner.

**Es gibt bisher keinen präzise gemessenen Maul-Socket pro Cube.** Die bestehende Arena-Formel ist `[0, hoehe×0,62, radius×1,02]`. Sie ist in den Daten klar als `arena-gameplay-derived` gekennzeichnet, zusätzlich zu 15 nativen `Mouth`-Gelenkpositionen. Ein Gelenkursprung ist nicht automatisch eine sichtbare Öffnung. Chicken und Penguin haben keinen `Mouth`-Knoten; Tree hat keinen `Death`; Skull wird als Donor nicht in die bestehende Arena-Auswahl promoviert.

**Konkreter Bildbefund:** Beim Alien sitzt der berechnete Abgangspunkt auf der Stirn, auch nach frisch ausgewerteten Skin-Maßen: Körperhöhe 2,069856 u, Radius 1,094707 u → Maul y 1,283311 / z 1,116601. Die Formel darf nicht als anatomischer Socket-PASS in Dark Fluffer übernommen werden. **Bitte WS-NPC/WSB die Maul-/Schnabel-Socket-Kalibrierung vor dem Gameplay-Anschluss zuordnen.** Hier ist bewusst kein geratener Nachdreher/Offset und kein Welt-Implementierungsschritt gebaut.

## Gemeinsame Ablage / Start

Unter `CLAUDE/KFB Combat Arena/`:
- `_work/WSA-v584-{policy,runtime,openworld,dark-fluffer}-2026-10-21/`: vollständige, saubere flache Git-Arbeitskopien an den exakten GitHub-Commits, mit Herkunftsbeleg.
- `_handover/V584_JOBS_2026-10-21/`: diese Rückgabe, Einzelprotokolle und eigenständiges kopierbares Modul-Paket (ohne ZIP).
- `_qa/V584_2026-10-21/`: private Waffenbilder/Reports und 34 Cube-Bilder/Kontaktbogen, keine Kauf-Payloads.
- Runtime-Starter `START_V584_ARENA.command`, Cube-Prüfung `START_CUBE_DONOR.command` in den jeweiligen Arbeitskopien.

Lokales Spiel: `http://127.0.0.1:8779/?actor=pistol`; Cube-Isolation: `http://127.0.0.1:8782/dark_fluffer_donor/`. Live-main/Cloudflare bleibt unverändert; private neue Actorquellen werden dort nicht mitveröffentlicht. Branchübergreifende Zusammenführung bleibt Georgs Entscheidung; insbesondere #24 ist kein behaupteter konfliktfrei mergbarer Sammelstand aller offenen Gameplay-Linien.
