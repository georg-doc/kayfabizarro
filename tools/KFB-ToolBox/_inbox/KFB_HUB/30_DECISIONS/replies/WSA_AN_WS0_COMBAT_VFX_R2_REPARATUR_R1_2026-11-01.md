# WSA → WS0 · Combat VFX R2 · Reparatur R1 · 01.11.2026

Bezug V-1151/1156/1162/1167, V-1126/1135/1140/1142/1152. **RETURN/TUNE – keine Integrationsfreigabe.** Pistole und Blaster aus der Spielkamera deutlich lesbarer; neue echte WS0-R5-Schichten angeschlossen. Treffer-/Explosions-Gesamtbild bleibt FAIL, Hörurteil Georg. Keine weiteren Waffen, kein Merge, kein Deployment.

## Gepinnte Lieferung

- Code: [7b2454fe](https://github.com/georg-doc/KFB-Stunt-Car-Race/commit/7b2454fe0d6df04a3a0f4688f252c0a82289efac), Branch `wsa/combat-vfx-r2-repair-2026-11-01`, [Draft PR48](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/48). Ersetzt den Vorschlag aus PR47; beide ungemerged.
- Tatsächliche Code- UND Aufnahmebasis: `game/integration-r2` @8d438b3375dd1e974c9084cea061ca6d39f4b638, einschließlich richtigem Atlas r3, vor Übergabe nochmals gelesen.
- Modell-Seite vor dem Bau separat eingecheckt: a3d62546286465220e445a3551738abf00434e53. Quellenprinzipien und konkrete Übernahmen dort, keine behaupteten Größenmessungen fremder Spiele.
- Erforderlicher Quellenstand `assets/private`: mindestens3ab91d035a393167f49e335ce3b9358397c3390e. Rollenplan Blob bdee568d3ae6e5c3a2b114db72ca0e71ff1d6b9f;24 R5-Anschlag/Körper/Mechanik-Dateien gegen Git-Blobs geprüft. Keine neuen Audio-/Bildproviderjobs.
- Private Prüfdateien: [137600de / 75_REFS/combat_vfx_repair_r1_2026-11-01](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/137600de3acefddbf50d784cf4b291d0a3cf3131/75_REFS/combat_vfx_repair_r1_2026-11-01).72 Dateien nach Upload per Git-Blob geprüft. Nur Aufnahmen/Protokolle; originale Kaufmodelle und Audioquellen unverändert.
- Vollständiger technischer Rücklauf: [REPARATUR_RETURN_R1.md](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/7b2454fe0d6df04a3a0f4688f252c0a82289efac/docs/combat-fx-r2/REPARATUR_RETURN_R1.md). Dateizweck/Herkunft: [SOURCE.md](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/7b2454fe0d6df04a3a0f4688f252c0a82289efac/src/vendor/combat/SOURCE.md); ausführbarer Herkunftslock im selben docs-Ordner.

## Bild / Ton / Tests

Ein vorhandenes Kit-Modell je Feuerform, ein Material mit hellem Kern statt doppelter Außenform; größer und zeitlich gehalten, echter Alpha-Zerfall. Pistole im Tages-Peak124×123 sichtbare Pixel, Blaster182×127 bei1440×900. Bestehender begrenzter Rauch, fester Mount mit transientem Slot-Impuls, ein Spielerlicht. Native Clips, Geometrie, Griffe und Original-Consumer unverändert. Optionalen Kamerastoß nicht gebaut: Kamera bleibt ruhig, keine behauptete Wucht-A/B-Abnahme.

Fünf aktuelle Clips mit echter Tonspur in Normaltempo: beide Waffen Tag/Nacht sowie freie Treffer-/Explosionsansicht. Vier Peakbilder aus der Rücken-Spielkamera, Nachtzustand light.mood.tod=0 tatsächlich frisch geladen.727 native Frames in33 chronologischen Kontaktbögen selbst angesehen, keine gehaltenen Effekte in bewegten Clips. Tagesschuss-Schedule −0,82 bis +5,03ms zur ersten Release-beobachtenden RAF; keine Behauptung Geräte-/Hörlatenz.

Ein kfbAudio-Kontext,58/58 Rollen vorgeladen. Je Waffe vier Anschlag-, Körper-, Mechanikvarianten ohne direkte Wiederholung; Schichten ca.0/10/70ms, begrenzter Bass-Unterbus und bestehender Begrenzer. Treffer bleiben material-/entfernungsbezogen, Explosion Fullband + Material → Körper → Bersten → Trümmer → Nachrollen; body-only niemals allein. M4A-Indizierung und privater SITE-Export korrigiert; keine zweite Normalisierung oder Kameradistanz-Ausdünnung eigener Schüsse.

Finale Tagesclips: Pistole Peak−0,89dBFS / RMS−24,48dBFS /40–160Hz18,0%; Blaster−6,96 /−26,89 /66,5%. Freie Treffer/Explosion−2,84 /−23,68 /24,9%. Keine geclippten dekodierten Samples. RMS über ganze Clips mit Ruhe/Weltgeräuschen, keine True-Peak-Zertifizierung. Werte beweisen keine Immersion. **Ich kann nicht hören; Hörabnahme Georg.** Vorerst keine zusätzliche Klangrolle für diese beiden Waffen angefordert.

26/26 gezielte Node-Tests grün, inklusive bestehender Karten-/Vendor-/AudioMixer-/Chatter-Prüfung und privatem SITE-Dry-run mit vollständigen Quellen. Browser: exakte Factory-Auswahl in beiden Modi und0 geänderte Kanäle bei eingefrorener Wiederholung innerhalb jedes Modus; kein unabhängiger Welt-Baselinevergleich. Zwei gültige Audioereignisse mit gleicher lokaler ID erzeugen je genau3Layer; Host-Sequenz bleibt Owner. Ressourcen in perf.json, keine Gatling-Lastmessung/kein Gesamtwelt-FPS-PASS. GDS-CLI fehlt; keine erfundenen Receipts.

## Pflichtbefund bleibt offen

Ein Kritiker, eine begrenzte Reparatur seiner zwei Befunde. Helle Waffenfassung akzeptierte er als referenztauglich; die Lieferung insgesamt war FAIL. Die Nachreparatur liefert echte dunkle Fälle und eine freie Blickachse. **Explosion weiter FAIL:** native Frames2,361→2,519s überspringen158ms mit dem bei ca.2,440s geplanten Anschlag; außerdem wirkt die bestehende Obst-/Knet-Reaktion ohne überzeugende Feuer-/Rauchkaskade. Das Video ist ein Befund, keine bestandene Gestaltungsvorlage. Kein zweiter Kritiker; R5-Tonlieferung kam nach dem Audit und wurde selbst technisch geprüft, nicht unabhängig gehört.

Frühe #debug-Aufnahmen profilierten2,60s in getProgramInfoLog. Die normale App deaktiviert diese synchrone Prüfung bereits. Eine allgemeine Produktionsblocker-Aussage daraus war falsch. Finale QA verwendet die vorhandene Produktionsrichtlinie mit q=fast/DPR1; Shader-LINK-Prüfung danach außerhalb der Videos:144 bzw.102/103 Programme,0 Fehler. App.jsx unverändert. Der neue158-ms-Befund ist echt, seine Ursache nicht isoliert; kein Verschweigen und kein allgemeiner Performance-PASS.

## Nächste Entscheidung / Stopp

WS0 bitte zuerst lesen. Georg wählt Größe/Standzeit anhand der Waffenreferenzen und hört die vier Waffenclips. **Noch keine Gesamtfreigabe:** für die Explosionsfolge einen engen Folgeauftrag mit Welt-/Explosions-Owner festlegen; die vorhandene N-Blast-Reaktion ist keine neue Shooter-Explosion. Gatling/Rakete weiter bis zur ausdrücklichen Referenzfreigabe zurückstellen. Gerichtete neue Spuren/Blasteräste warten auf WS-Design; Risse weiter auf Wahl/Kartengebäude.

Absicht der6 gemeinsam geänderten Dateien steht je Datei in SOURCE.md. WS1 muss vor einer späteren Übernahme den dann aktuellen Stamm erneut nachholen und jede Naht prüfen. Keine Änderungen im ursprünglichen combatPlayer.js/V1/App.jsx/dustTrail.js. WSA stoppt nach Rückgabe.

Gemeinsame Übergabe ohne ZIP: `Dropbox/CLAUDE/KFB Combat Arena/_handover/COMBAT_VFX_REPAIR_R1_2026-11-01/`, Code-Overlay, private Belege und SHA-256-Manifest. Keine behauptete automatische Lesebestätigung durch WS0.
