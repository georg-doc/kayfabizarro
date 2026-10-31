# WSA → WS0 · Combat VFX R2 · Referenz R1 · 01.11.2026

**RETURN / TUNE – kein Integrations-PASS.** V-1126, V-1135, V-1140 und V-1142 sind zusammengeführt. Aktuell nur Pistole/Blaster; danach Stopp. Keine Merges, kein Deployment.

## Lieferung

- [Draft PR #47](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/47), Branch `wsa/combat-vfx-r2-pistol-blaster-2026-10-31`, Commit `ac07947eda7a2d43057fd08d1ea7e2af3829c9e5`.
- [Einheitliches Arbeitsbriefing](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ac07947eda7a2d43057fd08d1ea7e2af3829c9e5/docs/combat-fx-r2/ACTIVE_BRIEF.md).
- [Vollständige Rückgabe mit Dateizweck, Quellen und Prüfgrenzen](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ac07947eda7a2d43057fd08d1ea7e2af3829c9e5/docs/combat-fx-r2/RETURN.md).
- [Private Bilder, bewegte Clips mit Ton und Abschlussprotokolle](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/bbc142bb3366e5e6dde8dbe6f7c733c36ee1493d/75_REFS/combat_vfx_r2_2026-10-31/runtime), auf `assets/private` @`bbc142bb3366e5e6dde8dbe6f7c733c36ee1493d`. Acht PNGs in 1440×900, zwei gültige WebMs. Ursprünglicher Belegcommit `4a7a386f73b5969d81d222808393ba1c6468cd06`; Ergänzung mit abschließenden Schalterprüfungen im oben genannten privaten Stand.
- [Neun Moodbilder und Manifest](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/bbc142bb3366e5e6dde8dbe6f7c733c36ee1493d/75_REFS/combat_vfx_r2_2026-10-31/concepts). **MOOD_ONLY/TUNE**, keine Runtime-Assets oder Animationsfreigabe. Originale Kaufmodelle werden nicht veröffentlicht.

## Ergebnis auf A

Kurze selbstleuchtende Kit-Formen, heller Kern/Farbverlauf, zeitlicher Aufbau und Strecken/Stauchen, kleine seeded axiale Variation, geringer Impuls auf einem Kindknoten des festen Waffenhalters und ein stabiles gemeinsames Spielerlicht. Neue versionierte Prüferkopie mit Clip-Ausschlüssen. Die Originaldatei `combatPlayer.js` bleibt byte-identisch (Blob `1413a8083edebfcae935f852f0ed6bead3610f04`). Ein Router wählt genau eine Factory. An bestehenden Produktionsdateien ändern sich nur der eine Import in `src/m1/M1World.jsx` und die Herkunftsergänzung in `src/vendor/combat/SOURCE.md`.

Clips, gemessener Griff, Actor-Mixer, Root, Input, Kamera, Schaden und Audio behalten ihre Owner. Luftsperre bleibt. V1-Kopien unverändert. Der Blaster ist vorerst eine kurze cyanweiße Entladung auf Kit-Form, kein fertiger verzweigter Blitz. R2 enthält keine neuen Trails; der alte V1-Pfad bleibt ohne Schalter erhalten.

## Prüfstand

- **16/16** gezielte Node-Tests grün. Beide Stamm-Waffenkarten bestehen den neuen Prüfer; Ausschlussfälle werden abgelehnt. Keine vollständige Spieltestsuite behauptet.
- Kalte Browserprüfung: ohne Schalter exakt Originalfunktion, mit Schalter exakt R2-Funktion. Beide feuern; keine Page-Errors. Wiederholtes Rendern derselben eingefrorenen Szene liefert je Modus identische Pixel und stabile Programmlisten. Das ist kein kompletter unabhängiger Welt-Baselinevergleich.
- Vier reale Releases je Waffe im Normaltempo. Geschoss-Ursprung am Mündungsanker, Abstand 0; native Marke .2667 s wird im Replay-Step bei .2833 s gekreuzt.
- Acht Standbilder an einem helleren und einem dunkleren Ort, jeweils nah und Spielkamera. Die Dateibezeichnung `shadow` belegt keine isolierte Sonne/Schatten-Lichtkonfiguration: strenges Licht-A/B bleibt offen.
- Zwei gültige bewegte WebM-Clips: Pistole 5,366 s, Blaster 3,599 s, 1440×900; Dekodierung und nichtstummes Audiosignal geprüft. **Keine subjektive Hörabnahme.**
- Ein stabiles Schusslicht; zwei Materialien je Waffe, keine eigenen Quellgeometrien, bisherige Geschoss-/Ereignisdeckel 12/64. `perf.json` enthält Szenen-Zählwerte, keinen isolierten FPS- oder Gatling-Lastvergleich.
- Frühere fehlgeschlagene Rekonstruktions-/HMR-Prüfungen und ungültige Videoversuche sind im RETURN dokumentiert, nicht als bestanden ausgegeben. Endgültige Clips sind dekodierbar. Ein vorhandener optionaler `vehicle_soul_r1/manifest.json`-404 bleibt Umfeldbefund.

## Aktualität / V-1137

Aufnahmen und Hauptprüfung entstanden auf `game/integration-r2` @`f1e617190da07e98f34a150e83a1eef432a27bbc`. Vor Übergabe erneut gelesen: `b56fa1997a3e275a9dcfb2642d788937b0fe4620` (ein nachfolgender Himmels-/Atlas-Commit, sechs Pfade, keine Combat-Überschneidung). Der Liefercommit übernimmt dessen kompletten Git-Baum als Elternstand; kein Cherry-Pick oder Merge anderer Linien. Neuer Atlas-Blob `861d7790614c03669059a1bca4f110ff91610dec` im Lieferbaum nachgewiesen. Der Connector konnte diesen binären Atlas lokal nicht auslesen: **Gesamtspiel auf dem neuen Himmel noch nicht erneut abgenommen.** WS1 muss vor Promotion auf dem zusammengesetzten Stamm erneut prüfen.

Privat: bestehende Karten-/Flash-Hashes unverändert. Gelesener späterer FB-Gatling-Griff auf `assets/private` @`548ad8dd488bf7968e6657acbdff65aa46ca4c0f`, Datei `50_BLENDER/K10/data/combatmech_minigun_mounts.fb_r2.json`, Blob `b75e6b6ba578f410f41f6ae2f2651711b3cfec0e`: FB −35°, Mech −36°. Noch nicht verwendet.

## Georgs Rückmeldung / B

Die bisher erzeugten Bilder wirken als statische Comic-Illustrationen und für reines Mündungsfeuer zu groß/komplex; sie zeigen keine zusammenhängende Animation. Die generell positive Stilreaktion ist keine Einzeldatei-Freigabe. Deshalb wurden keine weiteren dekorativen Standbildvarianten erzeugt. Bereits vorhanden: vier Mündungsmotive, vier Geschoss-/Spurmotive, ein Wandloch außen; je ein Bild. Innen-/Schrägansicht und eine kohärente Animationsfolge fehlen weiterhin. Alpha-/Bounds-Probleme sind im privaten Manifest als TUNE markiert. WSA empfiehlt, zunächst die tatsächliche kurze Bewegung beurteilen zu lassen; keine behauptete Streichung des Bildstrangs.

## Quellen / gemeinsame Linien-Naht

- Runtime Pistole/Blaster nutzt die verifizierten vorhandenen Action-Figure-Kit-Formen, keine generierten Bilder.
- Beide offiziellen Etherington-Lightning-Tafeln #65/#66 gelesen: https://theetheringtonbrothers.blogspot.com/2020/07/how-to-think-when-you-draw-lightning.html . Quellen bleiben verlinkt, keine Umverteilung der Tafeln.
- Binbun ist ein Godot-Shader-/Controller-Paket; Puls-/Öffnung als Referenz, kein stiller Three-Port.
- Brackeys `fire_point_6x5.png` wirklich angesehen: 30 Frames, pixelig/kreisförmig, deshalb nicht Hauptmündungsfeuer. Moodmotive sind aus den KFB-Impact-Blättern stilistisch abgeleitet, keine behauptete Übernahme eines fertigen V1142-Effekts.
- Kein zweites Strich-Modul. Von WS-Design benötigt: Modulpfad/Revision/Owner, Start/Ende und Taper, dünnere/kürzere Äste, Host-dt, Seed/Ereignis-ID, Anker-/Weltraum, Instanzdeckel und Dispose. Danach organische Blasteräste und gerichtete Spuren.
- Game Development Studio konzeptionell konsultiert; dessen `game-dev`-CLI fehlt hier. Vorhandene Projektprüfungen genutzt, keine CLI-Quittungen oder bezahlten Ersatzläufe behauptet.

## Nächste Entscheidung / Stopp

**Eine Wahl für Georg über WS0:** kleine reale Pistolen-/Blaster-Bewegung hinsichtlich Größe, Dauer, Helligkeit und Waffencharakter auswählen; Moodbilder nicht als Animationsbeleg verwenden. WS0 entscheidet zuerst, ob dieser ausdrücklich unangenommene Referenzstand trotz offener Linien-/Licht-/Hörabnahme zur gestalterischen Auswahl vorgelegt werden darf.

Offen bleiben die genannten Qualitäts-/Integrationsgates und der höchstens einmalige blinde Kritiker auf A (noch nicht ausgeführt). Gatling, Rakete, Riss-Code, weitere Waffenzuordnungen und Promotion warten. Keine direkte Weitergabe als bestanden an Georg. Merge ausschließlich über WS1. WSA stoppt nach dieser Rückgabe.

Lokaler gemeinsamer Hand-over ohne ZIP: `CLAUDE/KFB Combat Arena/_handover/COMBAT_VFX_R2_REFERENCE_2026-11-01/` (dünnes Quell-/Belegpaket, kein vollständiges Spiel und keine Kaufmodellkopie).
