# C0 · tatsächliche Arena-Quelle und Owner Map

Stand: 13.09.2026. Read-only Quellprüfung des lokalen Checkouts `bd01a150d26d572017365a2288c179bdfd830079`. Keine Spieländerung, keine Browser-/Hörabnahme, keine neue Performance-Messung. Angaben unten sind **SOURCE VERIFIED**, keine erneuten Laufzeitbeweise. Relative Zeilenanker beziehen sich exakt auf diesen Commit. Sites-Version 9 und ihr erfolgreicher Deployment-Eintrag wurden von WSA separat mit genau diesem Commit abgeglichen.

## Ergebnis

Die vollständige editierbare Arena-Quelle ist lokal vorhanden. Ihr Entry Point ist `index.html`, Titel **KFB Combat Arena v5a · Props & Play** (Z. 4). Die URL nennt weiterhin v4, aber der letzte Spielstand enthält bereits A1. Alte Versionsnamen der eingebundenen Dateien beweisen nicht, dass nur das alte v2-Spiel vorliegt: v1/v2-Dateien wurden hier während 4A/5A weiterentwickelt und durch v3/v4/v5A-Module ergänzt. Ein Neuaufbau von v2 wäre ein Rückschritt.

`tools/build.py:5` kopiert die vollständigen lokalen Laufzeitordner; Z. 8–9 kopieren Entry Point und Support. Der Entry Point setzt Three/importmap (`index.html:575`), lädt den Wirt (`1265`), baut Feld und Figuren (`1454` ff.), danach `installFun` (`1398`).

## Tatsächliche Owner Map

| Zuständigkeit | Quelle und Eingriffspunkt | Praktische Grenze |
|---|---|---|
| Szenen-Integration / Boot / Rundenzusammenbau | `index.html:1265`, `1454`, `1690`, `1398` | Der Integrator erstellt die Instanzen und verdrahtet Komponenten. Er enthält weiterhin erhebliche Laufzeitlogik und Wrapper. |
| Root/Bewegung/Drehung/Kantenreaktion FB | `combat-arena-v2/player.v2.js:68` bind, `96` schritt, `325` update, `344` root.position, `380` root.rotation.y | Player besitzt logische pos/vel und die sichtbare Weltwurzel; Host field liefert Boden und Begrenzung. |
| Boden/Bounds | `combat-arena-v2/host.v2.js:107` makeField, `135` attach, `136` floorY; `index.html:1968` feldMelden | Aktuell XZ-Rechteck plus skalare Bodenhöhe. Integrator meldet Rechteck und Ringhöhe an. |
| Mixer/Clips FB | `combat-arena-v1/frizzlebob.v1.js:157` neuer AnimationMixer; `366` play; `439` mixer.update | Pro Actor eine aktuell referenzierte Mixer-Instanz; Runtime-Anzahl nicht nachgezählt. **Clipentscheidung liegt zusätzlich im Player**, kein fertiger semantischer Actor-Vertrag. |
| Clipentscheidung / Schussvorbereitung | `player.v2.js:206` prepareGun, `217` gunReady, `226` schuss, `252` treffer, `279` _clip | Combat hängt an Player-Methoden und Three.AnimationAction-Zustand, nicht nur an semantischen Aktionen. |
| Combat / Treffer / HP / Flugbahnen | `combat-arena-v2/gunfight.v2.js:297` aimAt, `338` feuern, `353` _stepShot, `607` damageMob, `653` update | Letzter Zielklick ersetzt eine offene Intention. Keine alte FIFO-Schusswarteschlange wieder einführen. |
| Kamera | `combat-arena-v2/host.v2.js:375` makeCam, `420` camera.position, `421` lookAt; `index.html:1803` folge(fb.root) | Host besitzt Kamera. Actor darf sie nicht übernehmen. |
| Face-Grundaufbau / Tick | `frizzlebob.v1.js:291` _buildFace, `294` EyeRig, `302` PetMouth, `440`/`441` Update | Tatsächlich gebaut durch Arena-Actor, Module vom Integrator injiziert. Noch kein vollständig externer Host-Face-Adapter. |
| Face-Auslöser und Wachen | `frizzlebob.v1.js:110` pointer gaze, `424` shotExpression, `429` restore; `fun.v4.js:131` Zielblick; `index.html:1728` Augen zu und weitere Lid-/Farbwachen | Mehrere Aufrufer desselben Gesichts. Ein Graft mit eigenem Face-Tick/Policy muss diese ausdrücklich ersetzen oder anbinden. |
| Waffenmodell / Look | `frizzlebob.v1.js:39` Yellow_Gun asset, `1` import gun-look.v4a; `gunfight.v2.js:419` Gun-node, `435` Mündung, `439` Richtung | Gun-Socket wird derzeit aus Knotenname `Gun`, lokaler +Z-Achse und Rim-Geometrie abgeleitet. Neuer Actor braucht kompatiblen Socket oder expliziten Adapter. |
| Projektil + Mündungs-FX + Launch-SFX | `gunfight.v2.js:373` Markerprüfung, `383` _abgang, `410` Flash, `411` Cue, `412` Glow/Expression | Ein bestätigter Schussabgang löst diese Schichten aus. Marker ist aktuell 1/24 s im tatsächlichen Clip, nicht beliebiges Timerdelay. |
| Kill / Reward-Routing | `gunfight.v2.js:564` _kill; `fun.v4.js:90` installiert Rewards | Combat besitzt Killzählung und HP. Rewards besitzt Todesdarstellung/Drop/Pickup. |
| Loot / Coins / Pick-up-and-use | `rewards.v4a.js:62` beginDeath, `90` drop, `104` collect; `powerups.v5a.js:5` activatePowerup | Ein Prop und 1–3 Coins; Trank heilt, Bomben aktivieren beim Kontakt. Kein ausgebautes Inventar. |
| Rundenzustand / Score / Save | `runflow.v3.js:34` Phasen, `71` setze, `100` update, `162` snapshot, `172` load | Tatsächlich `ruesten/countdown/play/cleared/verloren`, **nicht lost**. Punkte = Kills + eingesammelte Coins. |
| FX/SFX-Bank / Takt | `host.v2.js:456` makeFx; `465` kopf, `466` fuss; `host.v1.js:219` frameTick, `224` fixed steps | Ein Host-Mixer-Takt, begrenzte Fixschritte. Zusätzliche Integrator-Updates (`index.html:1072`) verwenden einen auf 50ms begrenzten Render-dt. Nicht pauschal alles als denselben Takt beschreiben. |
| Slam | `slam.v4a.js:6` request, `14` beforeStep, `25` afterStep; `player.v2.js:334`/`339`; `fun.v4.js:54` impact | Bewegung/Phasen im Player-Schritt; Darstellung und Combat-impact Callback getrennt. Neuer Sprung bricht pending Slam ab. |

## Exakte bestehende Actor-Identität

Der Integrator importiert **`combat-arena-v1/frizzlebob.v1.js`** (`index.html:1456`), instanziiert ihn (`1504`), injiziert **`studio-v3/pet-eye-rig.v5.js` + `studio-v3/pet-mouth.v1.js`** (`1457–1458`, `1505`) und setzt dauerhaft die Gun-Variante (`1518`). Die Primärmodelle sind lokal **`assets/models/FrizzleBob_Yellow.gltf` und `FrizzleBob_Yellow_Gun.gltf`** (`frizzlebob.v1.js:39`, `135–137`). Bei Ladefehler existiert ein RAW-Character-Fallback mit Tint.

Das Actor-Modul kennt acht Rig_Medium-Kategorien (`frizzlebob.v1.js:40–41`), lädt im Boot ausdrücklich nur MovementBasic, falls nötig (`122`); die Eigenclips kommen aus dem geladenen Modell (`156`). Die acht Kategorien im Katalog belegen **weder acht geladene Packs noch 139 aktive Clips**. Clipimporte filtern Knoten/Tracks und behalten Root/Hips-Lage (`338–361`).

**`v13 FB` bleibt als externe Quellenbezeichnung unaufgelöst.** Im geprüften Runtime-Wiring gibt es keinen v13-Actor-Import und keinen Driver-Graft-Import. v13-Verweise im Entry Point betreffen FX-Foundation/Werkbank (`1395`, `2138`). Das reicht nicht, um v13 FB gleichzusetzen. Aktuelle Identität lässt sich nun dennoch eindeutig pinnen: obiges Modul + Gun-Asset + EyeRig + Mouth im Commit bd01a15. Der Pet-Studio-Donor `frizzlebob.v4a.js` ist kein identischer Dateipfad und darf nicht aufgrund des Namens als live-Modul ausgegeben werden; separater Content-Diff ist erforderlich.

## C1-Eingriffsnaht und Konflikte

1. **Adapter am Actor/Player-Anschluss**, beginnend bei `index.html:1504–1552`. Player, Host, Combat, Camera und Rewards behalten ihre Zuständigkeiten. Neuer Actor ersetzt den bestehenden Actor, wird nicht parallel daneben montiert. Root-Bindung `pc.bind(fb, ...)`, Mobziel `fb.root`, `gf.setKampf({pc,mb,fb,...})` (`1571`) und Kamerafokus müssen auf dieselbe Instanz zeigen.
2. Der Schussvertrag ist eng: Player verlangt findClip/play, Action.time, effektives Gewicht, fb.action-Identität; Gunfight prüft Pose/Richtung/Marker. Für einen neuen Actor entweder diese kleine Kompatibilität bewusst anbieten oder Player in einem separaten überprüfbaren Schritt auf semantische Aktionen umstellen. Eigenmächtiges Abspielen durch Lab + Player erzeugt zwei konkurrierende Entscheider.
3. **Boden-Doppelkorrektur vorhanden:** Actor `_groundKeep` (`409–419`, aufgerufen `442`) verändert `figure.position.y`; Player berechnet alle 0,25s eine weitere Fußkorrektur (`351–364`) und setzt Root-Y (`344`). In diesem Checkout existiert kein `_groundKeep = () => null`-Override. Das ist eine reale Quellkopplung, kein erneut gemessener Jitterbeweis. Beim Graft muss der Root/Boden-Owner eindeutig sein; Studio-Bodennachführung deaktivieren und Root-Track-Policy prüfen, bevor eine neue dritte Korrektur entsteht.
4. Face besitzt bereits EyeRig/Mouth, Pointer-/Zielblick, Schussausdruck und Todeswachen. Die Empfehlung „1 EyeRig, 1 Mund, 1 Mixer“ verlangt hier explizites Abmelden/Entsorgen der alten Instanz samt Pointer-Listener und genau einen Tick. Nicht nur neue Face-Komponenten ergänzen.
5. Gun-Knoten/+Z/Mündungsgeometrie sind konkrete Annahmen. Neue Driver-Gun oder anderes Attach muss einen geprüften Muzzle-Socket liefern. Ein hübscher Graft ohne diese Naht könnte den ursprünglichen Fehlklick-/Abgangsfehler zurückbringen.
6. `index.html:1822` beatAufsetzen dekoriert Combat-Methoden (`feuern`, `_abgang`, `_kill`, `_cue`, `_emit`, update). `fun.v4.js` setzt weitere Callbacks/Wrapper. Beim Austausch die Reihenfolge und Destruktion beachten, sonst doppelte Cues, Zählungen oder nicht beendete Beats. Nicht alles gehört dem Actor.
7. C1-Abnahme sollte mindestens Stand/Lauf/Zielen bei Zielwechsel, erster und schneller Folgeschuss, Sprung/Slam-Abbruch, unterbrechbarer Hit, Tod/Restart, Clear+Pickup und Pause enthalten. Bestehende automatisierte Tests ergänzen Quellbeweise, ersetzen keine Browser-/Hörabnahme. Diese Prüfung wurde in diesem Audit nicht ausgeführt.

## Reward-Invariante: alte Kurzform ist nicht mehr aktuell

- `_kill` ist gegen doppelte Aufrufe durch `m.tot` geschützt (`gunfight.v2.js:565`). Er erhöht Kills und sofort Pop je um 1 (`567`, `583`).
- Mit installiertem Rewards wird nach 0,20s genau einmal der Gegner durch Skull ersetzt (`rewards.v4a.js:123–127`, `swapped` guard). Dabei `drop`: **1 Heiltrank/Wasserfarb-Bombe/Rauchbombe plus 1–3 Coins** (`90–95`). Die alte Statistik heißt weiterhin `wuerfel`, zählt inzwischen alle Nicht-Coin-Drops (`86`).
- Einsammeln einer Coin erhöht Coins und Pop um 1 (`14`). Der Runden-Score ist `kills + coins` (`runflow.v3.js:103`, `131`), auch nach Clear. Save-Load stellt Pop entsprechend her (`180`).
- `pendingDeaths` wartet auf Skull-/Revealabschluss vor Clear (`rewards:68`, `runflow:130`); **keine Pflicht, alle Coins vor Clear einzusammeln**. `gf.aktiv` bleibt bei Clear an (`runflow:80`), Clicks erlauben Clear (`index:1337`), Reward-Tick läuft (`gunfight:664`).
- Die historische Diagnose-Ausgabe „Kills = Würfel = Pops“ (`gunfight:828`, `837`) und entsprechender Kommentar (`563`) sind semantisch veraltet. Korrekte normale Lebenszyklus-Invariante: **ein Kill → ein basis Pop + ein Nicht-Coin-Prop; Coins droppen 1–3 und geben erst beim Aufheben jeweils ein zusätzliches Pop**. Die Prop-Zählung folgt zeitversetzt; unmittelbare Gleichheit nach `_kill` ist mit Rewards falsch. Bei Levelwechsel kann ausstehender Loot bewusst entsorgt werden; daher keine unbedingte globale Gleichheit über unterbrochene Lebenszyklen behaupten.
- `tests/sprint4a.test.js:72` prüft Skull/Drop, `116` Clear+Coin; `tests/combat.test.js:23` prüft den alten Fallback ohne installierten Rewards. Der Fallback-Test ist kein Nachweis für die aktive neue Gesamtregel.

## A2-Abhängigkeit sauber getrennt

Aktiv sind weiter **arena-ring.v1** (`index:1455`), **zensur.v3** (`1584`), **flood.v3** (`1597`) und Builder `?v=21-wellen` (`arena-ring.v1.js:23`). Damit bestätigt die Quelle den noch nicht vollzogenen Modultausch.

A2 berührt: Welt↔Karte-Koordinaten, skalare Bodenhöhe, Feldrechteck, Zensur-Montage, Flood-Jobs, Kartentausch/Lebenszyklus. Konkrete jetzige Annahmen sind `fun.v4.js:50` (pos.x/z direkt an radieren), `powerups.v5a.js:11` (World-onReveal), `rewards.v4a.js:150` (floorY+0.24), Klick-Ray gegen horizontale Weltplane (`index:1342`) und `feldMelden` Rechteck (`1968–1972`).

C1-Actor-Recovery/Adapter kann auf dem gepinnten heutigen Stand gesondert geplant und getestet werden; **C1-Actor-Graft und A2-Kartenmodultausch sollten nicht in einem untrennbaren Patch landen**. Vor Produktionsfreigabe zusammengehörige Transform-/Ground-Verträge bestimmen. Portal-Gun bleibt anschließend abhängig vom belastbaren Karten-/Oberflächen-/Portalanker-Vertrag. Das Audit führt keinen dieser Schritte aus.

## Hashes wichtiger Quellen

- `index.html` SHA-256 `77bb20260e93bb45b73472cb5a531ec7e67ce7f58bc6fe9b5215c65e869e029a`
- `combat-arena-v1/frizzlebob.v1.js` SHA-256 `bd4683d936545f65783cd9d5761e77318e03cff9685d80430b0208f8fb1f9b3e`
- `assets/models/FrizzleBob_Yellow_Gun.gltf` SHA-256 `b8fd364b9a7f0bdb505a4526d521f42b8115a507386ff6df29a2bc2735538707`
- `studio-v3/pet-eye-rig.v5.js` SHA-256 `0bfaeafecc57c99e40e8476ae42f93b5d705ad4aaddd53cb7df6158955f624c1`
- `studio-v3/pet-mouth.v1.js` SHA-256 `6a84d096373fe42e36240767cc56ddc5d3114b1b2054232deba2b5f8ee9c343a`
- `combat-arena-v2/player.v2.js` SHA-256 `7233625a0ed80e5910e8684ecf3e17a16cba201e44df5d7fb887e96c7571cdf3`
- `combat-arena-v2/gunfight.v2.js` SHA-256 `90fdfb768665ebc555c762addc0eb4b80e570f188371a739fdb4409625392987`
- `combat-arena-v4/rewards.v4a.js` SHA-256 `72049a07d04c5aa0e4f0ed96863e8207c28d47d2f4a4b8b9dc368bb4a951443f`
