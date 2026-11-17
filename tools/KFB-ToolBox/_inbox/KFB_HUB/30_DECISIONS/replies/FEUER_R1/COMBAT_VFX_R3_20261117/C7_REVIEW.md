# C7 · unabhängige Blindprüfung · 2026-11-17

**Keine AA/AAA-Freigabe.** Einzelgate mindestens 8/10 bleibt unverändert. Kein Mittelwert. C7 verbessert den C5-Waffen-Pop und die sichtbare Rückstellung; die Wirkung bei Spielentfernung bleibt unter dem gesetzten Minimum. Ein neuer beobachteter Gatling-Laufzeitfehler blockiert die technische Gesamtfreigabe.

## Exakte Fassung und Methode

Combat-Insel http://127.0.0.1:8850/combat/?fx=r2&effect=aa, sichtbare Fassung **combat-aa-r3-c7-20261117**. Native Spielkamera http://127.0.0.1:8807/combat-aa.html, sichtbare Fassung **native-originals-r3-c7-20261117**, Effektquelle ausdrücklich **AA · Ableitung**, Waffe pistol, Kamera Spielkamera, Tag. Der Namensbestandteil originals des nativen Hosts bezeichnet nicht den ausgewählten Effektmodus. Parent benennt AA-Modul SHA f814fbcfe9744dda9ae989d20634b0acbded59025d6754e3f81ac7c4d48d222f; dies ist dessen Provenienzangabe, kein unabhängiger visueller Qualitätsnachweis.

Eigener nativer Chrome-Zugang, laufende Aufnahmen durch die sichtbaren Aufnahme-/Speichern-Bedienelemente. Sechs eigene Clips kopiert und SHA256 gesichert: C7_EVIDENCE_MANIFEST.json. Keine Produktionsdatei verändert, kein eigener GPU-Server gestartet. Alle Aufnahmen vor ausdrücklicher UI-Freigabe und vor nachfolgender nativer Reparatur. Offline 24fps-Bildfolgen dienen Form-/Kontinuitätsprüfung, keine erfundene millisekundengenaue Zeitmessung. Audio wurde nicht hörend geprüft.

## Acht Einzelgates · Pistolen-Subset

| Kategorie | Wert | Konkreter Befund / Beleg | Gate |
|---|---:|---|---|
| Mündung / Impuls | 7 | Nacht-Nahaufnahme F010 und F039–041: heißer Kern, gerichtete goldene Zunge, Funken und Lichtpool; Position am Lauf kohärent. Bei Spielabstand wird der Hauptimpuls jedoch sehr klein, volumetrischer Nachdruck kaum lesbar. | unter 8 |
| Flug / Spurlesbarkeit | 6 | Combat-Spiel Tag F010–011 sowie Nacht-Nah F010: Richtung klar, aber dünne fast durchgängige helle Gerade dominiert; kaum separater kräftiger Projektilkörper. Native F042–043: kurze Verbindung sichtbar, wenig Gewicht vor Terrain. | unter 8 |
| Materialkontakt | 7 | Holz F012–028: braune lange Splitter, dunkle Kontaktspur, expandierender dunkler Rauch. Metall F012–025: hellere kurze Fragmente/Sparks und dunkle Spur. C2/C3-Hartclip nicht beobachtet. Hit bleibt klein und stilistisch noch wie einfacher Stern mit Sekundärpartikeln; Oberfläche in Spielansicht trägt wenig Impuls. Nah-Stein und Materialnormalschrägen nicht vollständig geprüft. | unter 8; Restmatrix NP |
| Timing / Recoil / Choreographie | 7 | Nacht F007–018, F037–048 und spätere Schüsse F064–136: Waffe bleibt vorhanden, kickt nach oben und stellt zurück; C5-Pop ist in diesen fünf Schüssen nicht reproduziert. Kausale Folge jetzt deutlich besser. Dauerfeuer-/Waffentyp-Choreographie und synchrone SFX nicht vollständig geprüft. | unter 8 |
| Nachlauf / Rauch / Spuren | 6 | Holz-Rauch wandert und löst sich, Splitter fallen/streuen; Kontaktspur bleibt. Mündungsrauch sehr zart und kurz; in Spielansicht verschwindet der Nachlauf weitgehend. Keine ausreichend kräftige mehrphasige Restwirkung wie in der kalibrierten Referenz. | unter 8 |
| Spielkamera / Tag–Nacht | 5 | Eigene Combat-Spiel-Tag-Stein- und native Tag-Aufnahme; eigene Nacht nur Mündungsnähe. Native AA ist tatsächlich sichtbar, aber klein: F043 Holz-Primärhit und spätere Stein/Metallkontakte konkurrieren schwach mit kontrastreichem Terrain. Native Nacht, bewegte Kamera und gesamte Waffenmatrix fehlen. | unter 8; Pflichtteile NP |
| Audiovisuelle Wirkung | NP | Keine hörende Synchronitäts-/Körper-/Clippingprüfung. Ein sichtbarer Laufzeitfehler im Gatling-Test ist zusätzlich beobachtet; daraus wird kein Audioklangscore erfunden. | offen |
| Technische Bildruhe | 7 Pistole / 3 Gesamt | Pistole bleibt in den betrachteten Nah-/Spiel-Aufnahmen sichtbar, kein C5-Pop. Gesamtfassung: Gatling beim 6s-Aufnehmen plus Dauerfeuer-Halten zeigt `(A.plays++) is not a function`; Aufnahmezustand bleibt hängen, Save-Link verweist weiter auf alten Rifle-Blob. CUA-Screenshot und AX-Text im eigenen Verlauf. Kein gültiger Gatling-Film behauptet. | unter 8 |

Die 7 der Pistolen-Bildruhe ist keine Vollständigkeitsfreigabe: längere Belastung, alle Waffen und Native-Nacht sind nicht abgedeckt. Fehlende Matrix wird nicht durch ruhige Einzelbilder ersetzt.

## Weitere Waffen · begrenzter Umfang

Alle neun Menüeinträge wurden in C7 gesehen. Aktuell tatsächlich ausgelöst: Pistole, Gewehr und Gatling. Gewehr eigene Tag-Metall-Aufnahme enthält automatischen Sequenzbetrieb und etwa 1,5s zusätzlich gehaltenes Dauerfeuer; F003–029 zeigen wiederholte gerichtete Schüsse und reale Wandkontakte. Funktionale Verbesserung gegenüber C4 bleibt bestehen; die gleichen kleinen Lichtpunkte/dünnen Spuren tragen bei Spielentfernung wenig Kraft. Keine vollständigen acht Gewehr-Einzelwerte aus diesem begrenzten Test.

Gatling zeigt zunächst Mündungs-/Trefferwirkung, dann oben genannten sichtbaren Fehler. Aufnahmeknopf bleibt deaktiviert, Link bleibt alter Rifle-Blob c5a1f039-f345-42bb-8e2c-53f144f2238d. Deshalb keine C7-Gatling-Datei aus altem Link gespeichert. Schrot, Railgun, Lilablaster, Rakete, Granate und Clownbombe bleiben in dieser C7-Prüfung **NP**; die funktionalen C5-Checks werden nicht auf C7 übertragen.

## Priorisierte nächste Arbeit

1. **Laufzeitabbruch beseitigen und genau die ausgelieferte Fassung prüfen.** Gatling-Aufnahme plus Haltefeuer muss fertigstellen und einen neuen richtigen Blob erzeugen; anschließend tatsächliche hörende SFX-Prüfung. Kein Klangscore aus Dateivorhandensein.
2. **Spielabstands-Punch als nächste gestalterische Strategie.** Native F043 und Combat Tag F010–018 sind die Annahmebilder: stärker unterscheidbarer heißer Projektilkörper, kurze gerichtete Kontaktzunge und lesbarer dunkler Auswurf/Nachlauf bei Originalzoom; vorhandene stabile Haltung beibehalten. Nur mehr Partikelzahl ohne Form-/Wertkontrast wäre kein Beleg.
3. **Gezielte Pflichtmatrix schließen:** native Nacht und bewegte Gameplaykamera, echter Stein-Nahkontakt, dann weitere Waffen nach Typ. Eigene isolierte Donorquellenprüfung separat fortführen.

C5→C7 ist beim Pop/Timing eine echte Verbesserung, beim Spielabstands-Punch keine relevante Schließung des alten Gates. C6 wurde nicht von mir bewertet; eine erfundene lückenlose Reparaturzählung wäre falsch. Falls bereits zwei Reparaturen derselben Punch-Strategie durchlaufen wurden, diese Strategie jetzt beenden und gerichtete ballistische Form-/Kontraststrategie bzw. Donorwechsel verlangen. Kein weiterer kleinteiliger Punkterücklauf auf Rauchmenge allein. Technischer Einzelfehler darf begrenzt repariert werden; das zertifiziert den Rest nicht.

## Belegübersicht

- C7-pistol-game-day-stone-sheet.jpg: 24fps, erste zwei Schüsse bei Originalspielentfernung.
- C7-pistol-muzzle-night-stone-sheet.jpg und C7-muzzle-later-shots.jpg: alle fünf Attacken mit vorhandener Waffe und Kick/Rückstellung.
- C7-pistol-contact-day-wood-sheet.jpg / -metal-sheet.jpg: jeweiliger Materialnachlauf.
- C7-rifle-game-day-metal-sheet.jpg: tatsächliches Gewehrfeuer mit Kontakten.
- C7-native-detailed-0.jpg, -1.jpg, -2.jpg und C7-native-aa-pistol-game-frames/043.png: eigene aktuelle C7-AA-Spielkamera, vier Kontakte mit Materialwechseln. Native Nachtsituation nicht behauptet.
- C7_EVIDENCE_MANIFEST.json: genaue Originalnamen, Größen und SHA256 der eigenen Filme. Root-Datei ohne `(1)` im Stage-Pistolen-Tag-Namen ist nicht meine Aufnahme und wurde nicht als eigener Beleg benutzt.

Quellenoriginale: kein neues Fidelity-Urteil in C7. Frühere getrennte native Originalaufnahme bleibt getrennt; unverändertes Original oder geladene Spenderdatei ist keine AA-Endproduktfreigabe.

Decoder-Kontrolle: Stage-eigene C7-Filme haben 275–307 originale Videoframes pro ca.6,45s; native C7 118 originale Frames in5,60s. Die 24fps-Extraktion ist eine Stichprobe und ersetzt insbesondere nativ keine vollständige Performancebewertung.
