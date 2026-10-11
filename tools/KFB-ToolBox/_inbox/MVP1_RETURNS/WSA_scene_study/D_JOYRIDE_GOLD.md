# D · Joyride J17 Goldstandard · Quellenstudie · 11.10.2026

**Status: dokumentierte Originalbeobachtung, kein Neubau und keine Lab-Lieferung.**
Maßgeblich: V-010/V-102 Look; V-011 Übergänge; V-032 Fahrphysik; V-053 Clay; V-060 Maßstab; V-099/V-100 Anschlüsse/Tunnel; V-118 Rampenvorlagen; V-120 Inselverbindung; V-122 Planvorrang.
WSA-Brief: bestehender Branch wsa/kfb-scene-study-2026-10-10 / BRIEF_WSA_SCENE_STUDY_R1.md, Reihenfolge D → A → C → B.
Quellen: main@dccf75cabd222d951380693d84ab88053ee7e519, J17/JOYRIDE_J17_2026-10-01/pictures; geerbtes J16-r2-Paket (Blob4dc1d1fe41e856e50d4e1d02bf9563de2e72c657). Original-Pixel von9 benannten Bildern geprüft; Hashes in D_SOURCE_IMAGES.json.

## Beobachtungen nach Originalbild
| Originalbild | Sichtbarer Befund | Übertragbare Regel / Grenze |
| --- | --- | --- |
| chase-curve.jpg | Durchgehender plastischer orange-roter Strang mit gerollter Krone; dunkle Fahrbahn; Kurve, Stadtfassade und höher liegende Trasse bilden mehrere Raumebenen. | Nicht einzelne quergestellte Randstücke oder flache Platten aneinanderreihen. Kurvenform und Querschnitt als zusammenhängende Familie erhalten. |
| chase-straight.jpg | Straße führt zwischen Fassaden, Gehwegen und Bäumen; Tür-/Schaufensterfronten adressieren den Weg. Breite Mitte bleibt lesbar, Schatten geben Bodenkontakt. | Objekte begrenzen einen benutzten Raum. Nicht specimenartige Werkbänke auf einer freien Bühne verteilen. J17-Stadt ist Vorlagenbeobachtung, keine Town-Gestaltung durch WSA. |
| chase-loop-a/b.jpg | Gelbe Pfeile auf schieferblauem Band, flankiert vom durchgehenden orangen Strang; Kamera folgt der Raumkurve statt den Horizont festzuhalten. | Gleicher sichtbarer Streckenkörper in Gerade, Kurve, Höhenwechsel und Loop. Pfeile nur als tatsächliche Source-Markierung, nicht erfundene Ersatzgrafik. |
| chase-tunnel.jpg | Orange/cremefarbene gekrümmte Röhre, wiederholte Ringstöße und Lichtpunkte; Fahrbahn läuft kontinuierlich weiter; Portal und Innenschale gehören zusammen. | TC1 race_tube übernehmen, kein beliebiger neu gezeichneter Bogen. Nach V-100 Styles später je Tunnel wählbar; bestehender TC1-Schalter ist zunächst global. |
| hop-in-1/4, hop-out-1/4 | Fahrzeug, Figur, Fassade und Straße besitzen räumlichen Zusammenhang; Materialspuren sind aus Spielerhöhe sichtbar. | Als Maß-/Nähebeobachtung verwenden, nicht als Abnahme des Cabrio/Hop. V-030 bleibt geschlossenes Retro-Auto für MVP; V-031 Hop ist TUNE. |

Die am Bild abgelesenen FPS sind historische Anzeigen, kein aktueller Leistungstest. Screenshot-UI ist kein zu portierendes HUD: V-040 gilt.

## Farben aus dem tatsächlichen Code, nicht aus beleuchteten Pixeln geschätzt
Quelle: geerbtes lab-track/track-look.v5.js, WORLDS (Zeilen46–65).
| Rolle | canyon | bucht | otown |
| --- | --- | --- | --- |
| Straße | #566680 | #5f7f9a | #6a6e8f |
| Rennfahrbahn | #3d4a60 | #3e5d7c | #4a4d6e |
| gerollter Randstrang | #ef5a22 | #f2708a | #e9b53b |
| Grund-/Tischrolle | #8b68c7 | #f0cf7e | #3aa596 |
| Himmel | #96bede | #8fd6ec | #a8d8b9 |
| Boost-Akzent | #f2b632 | #f7d23c | #fff06a |

V-102 ersetzt die ältere Farbbeschreibung in V-010: schieferblaue Fahrbahn, orange-rote Banden. Beleuchtung erklärt Schatten-/Highlight-Abweichungen im Foto. Die Tabelle ist Originalwissen, keine zweite Insel-Farbverwaltung; Phase A/F/G verwendet den bestehenden Insel-Thema-Owner (V-051).

## Geometrie- und Materialregeln aus Originalmodulen
- Native Track Core0.12 STANDARD-Fahrbreite14.4, Schulter1.98, Bandabstand.72, Banddicke1.62, Bandhöhe1.35, Decktiefe2.25 **Source-Einheiten**, aus PROFILE_DEFAULTS. Das sind Herkunftswerte, keine neue Lab-Dimensionierung.
- Original T4 sideProfile/ringOf rollt eine weiche Bandkrone; Innenkurvenrippen haben Source-Abstand3.5. Die Krone reagiert auf Kurvenkrümmung, nicht nur auf Bevel eines Kastens.
- Fahrbahn/Strang bleiben Geometrie-, Material- und Kontaktrollen. Clay-Spuren ersetzen keine Gelände- oder Anschlusskonstruktion.
- Source-Road-Blending verwendet aW/aBio/aSU und den nativen KFB-Knetfleck-Vertrag / transition-atlas; kein pauschaler glatter Farbverlauf als Ersatz (V-011).
- J17 erbt K2/v10 und Toolmix. Nahband, Materialrollen, Schatten und echte Source-Karten gehören zum Ergebnis (V-053); einfaches Blender-Noise war im WSA-R1-Fall sichtbar unzureichend.
- Querschnitts-Kappen dürfen keine Speichen/Segel über die Fahrbahn ziehen; Source strangCap-Korrektur behalten.
- Säulen im alten J17-Kurs sind Beobachtung innerhalb einer bodengestützten Kurswelt. Das ist keine Erlaubnis für Pfeiler zwischen schwebenden Inseln: V-120(a).

## Fahrkamera: gemessener Konfigurationsstand, keine neue Einstellung
Source joyride.j06.json / drive.camera: boom9, height3.5, side2.4, latFollow.6, follow9, FOV58; boomSpeed3.4. J17 joyride-drive.j10.js führt die Schienenlage im Streckenrahmen.
Diese Werte sind reine Konfigurationsbelege. Bestehende Lab-Kameraentscheidungen V-025/V-088 und C1a-Parity nicht überschreiben. J17-Fahrkamera ist nicht der World-Orbit bzw. die Laufkamera.
V-103: Deformer-v2 ist keine abgenommene J17-Komponente und bleibt draußen. Keine Quellenbehauptung aus dem allgemeineren V-010-Wortlaut ableiten.

## Konsequenz für Protopia/Maker-Referenz (V-110/V-120)
Die Quelle verlangt nicht nur einen Strang im leeren Raum: Auf-/Abfahrt auf Bodenhöhe, Straße durch einen tatsächlich benutzten Platz, Rampe zur nächsten Ebene, Wendeschleife/Drehscheibe als Ziel. Die mechanische Vorlage dafür sind EXIT/ENTRY aus Track Core≥0.14 nach V-118; alte v0.12-Docks bzw. nachgezeichnete Pad-Flächen sind kein Ersatz.
R1-Georg-FAIL: Asset-Sammlung ohne Architektur/Story/Übergänge. R2-Privatpilot bestätigt die Lücke: Originalcontroller PASS, Gesamtkonstruktion und Komposition FAIL. Mehr Textur oder höhere Asset-Anzahl beheben diese Beziehung nicht.
Die Gestaltung gehört Georg in den Lab-Werkzeugen; WSA liefert belegte Beziehungen/Regeln als Eingang für D/F/G. Der Vier-Insel-A/B-Vergleich ist nach V-122 kein Lab-Tor.

## Beleggrenzen und nächste Arbeit
9 Originalbilder + native Source-Konfiguration geprüft. Keine neue Szene angenommen, kein Video-/Performance-/Lab-parity-Test, keine Material-Golden-Parity, keine Figuren-Skalierung.
Nicht aus Standbildern messbar: Kameraradius eines360°-Flugs, reale Abstände außerhalb der Source-Konfiguration, tatsächliche Kontaktversenkung beliebiger Inselkörper. Solche Werte bleiben UNKNOWN statt erfundene Regeln.
D abgeschlossen als Quellenblatt. Nächster Teil A: vorhandenen KayKit-Tutorial-Atlas und echte Creator-Previews studieren; danach C, dann B aus dem privaten8-Insel-ZIP.
