# Waffen-Playtest · Slices und Abnahme

Stand: 13.09.2026. **VORBEREITET**, kein Auftrag automatisch gestartet. Je Slice Basisrevision, erlaubte Dateien, Ergebnisrevision und tatsächliche Prüfungen nennen. Ein Review darf ohne Implementierung enden, wenn der konkret notwendige Eingang fehlt.

## Kleine, wiederverwendbare Rückgaben

| Slice | Verantwortung | Konkrete Rückgabe | Voraussetzung |
|---|---|---|---|
| W0 Quellen-/Vertragsdelta | Web-Review | Gegen aktuelle Arena + gepinntes Studio geprüfte Owner-/Export-Lücken; kleinste Eingriffsnaht | Startprompt im Paket |
| W1 Befestigung kalibrieren | Studio / Animation Lab | Numerisches Profil, Quelle + Dependencies, Bind/Grip/Muzzle/Einheiten, Reset-/Import-Beleg, zwei gerenderte Clips | Bestätigter Actor-/Waffenexport |
| W2 Arena-Actor anschließen | WSA / zugewiesener C1-Slice | Ein Driver-Mixer, ein Face-Owner, Welt/Boden beim Wirt; bestehende Bewegung erhalten | C1-Handoff + abgestimmte A2-Surface-Grenze |
| W3 Aim/Turn/Release | Zugewiesener C2-Slice | Gewähltes Aim-Modell, Zielwechsel ohne FIFO, Pose → Muzzle → Release; vorhandenes Combat/Rewards | W1 + W2 |
| W4 Aufgeräumter Spiel-/Prüfmodus | UI-Slice | Werkzeuge verbergen/zeigen ohne Reload; Arena-HUD/Controls erhalten | Gemeinsamer Lifecycle-/Input-Vertrag |
| W5 Messung und zweiter Blaster | Getrennte kleine Rückgaben | Nichtmutierende Instrumentierung; zweite Waffe erst nach erster Abnahme | W1–W4 abgenommen für zweite Waffe |

W0/W1 lassen sich vorbereiten, während A2 eigenständig bearbeitet wird. W2/W3 werden am gemeinsamen Actor/Player/Combat serialisiert oder mit ausdrücklich getrennten Dateien beauftragt. Instrumentierung kann vorab spezifiziert werden; sie darf selbst keine Pose, Weltposition oder Schussentscheidung ändern.

## Abnahmematrix

Alle folgenden Kriterien: **UNTESTED für die neue Integration**. Pro Ergebnis Build-Commit, Szenario, Beobachtung/Messung, Screenshot/Clip/Log und Grenze des Nachweises eintragen. Ein Node-Test ist keine visuelle oder akustische Abnahme.

| ID | Prüfung / Erfolgskriterium |
|---|---|
| W01 | Referenztransform aus gepinnter Datei literal erfasst; Bones, Achsen und Einheiten am Export bestätigt. |
| W02 | Bind-Korrektur einmal gemessen; keine kumulierende Rotation oder zusätzlicher Owner pro Frame. |
| W03 | Export/Import erhält sechs Zahlen; Referenz-Reset setzt Benutzer-Offsets auf null, nicht den Donor-Transform. Keine Platzhalter im Consumer. |
| W04 | Mindestens zwei benannte Clips gerendert; Griff und Lauf stabil, tatsächliche Handbewegung von Befestigungsfehlern getrennt. |
| G01 | Spiel ↔ Kalibrierung ohne Reload, Weltreset, doppelte Listener/Mixer; Pause bleibt konsistent. |
| G02 | Prüfoverlays im Spiel verborgen; HP, Pop, Controls und sinnvolle sechs Slots bedienbar. |
| M01 | Projektil startet am Muzzle der aktuellen Weltpose; exakt ein Release erzeugt Projektil, Mündungs-VFX und Launch-SFX. Frame-/Eventfolge belegen. |
| A01–03 | Nahes, mittleres und fernes Ziel: Ziel-/Mündungsrichtung und Treffer konsistent; gewähltes Modell und zulässige Abweichung vor Messung festhalten. |
| T01 | Schnelle links/rechts-Klickwechsel: neuestes Ziel ersetzt wartendes; keine alte Zielschlange oder Zwischen-Rückdrehung. Feuerrate und Klick→Release-Latenz protokollieren. |
| T02 | 180°-Zielwechsel: sichtbares Drehen, erst danach korrekt gerichteter Release. Freie Kartenklicks ohne Gegner funktionieren. |
| L01 | Bewegung/Shift + Zielen, Sprung/Space, Slam/F und Hit-Reaktion: kein unsichtbarer Input-Lock, Sprung kann wartenden Slam abbrechen. |
| S01 | Bestehende Gegnerauswahl/Treffer/Kill zuverlässig, kein zweites Damage-/Reward-Ereignis. |
| S02 | Optional: ein seitlich bewegtes Ziel zur Aim-Prüfung, keine neue KI. |
| R01 | Kill +1 Pop; ein Prop +1–3 Coins; jede eingesammelte Coin +1 Pop. Nach Clear Schießen/Pickups weiter möglich. |
| R02 | Fehlschuss fliegt/fällt/kullert weiter; keine schwebenden eingefrorenen Projektile. |
| R03 | Ein World-/Boden-Owner, ein Mixer, ein Gesicht; Wechsel/Pause/Neustart hinterlassen keine Leaks oder wiederholten Events. |
| P01 | Vergleich Basis/Kandidat auf gleichem Gerät/Browser, gleiche Szene und 60-s-Sequenz mit schnellen Schüssen + Jump/Slam. Framezeit p50/p95/Max, lange Frames und aktive FX/Projektile erfassen; Ursachen statt erfundener FPS melden. |
| H01 | Hörabnahme nach Nutzergeste: ein Schussklang je Release, kein Doppel-/Nachlauf bei Pause; Mute wirksam. |

Bestehende Node-Tests nach Codeänderungen ausführen, gezielte Regressionstests für geänderte Logik ergänzen. Browser/GPU und Audio separat ausweisen. Erst WSA-Review, dann Integration/Promotion des geprüften Kandidaten.

## Rückgabeformat

Basis-Commit → Ergebnis-Commit/Branch; geänderte Dateien; gelieferte numerische Konfiguration; verwendete Quellen mit Pin/Hash; reproduzierbare Start- und Prüfschritte; Matrixergebnisse mit Beleg; offene Punkte; kleinster nächster Schritt. Keine PASS-Markierung aus fremden Quellenberichten übernehmen.
