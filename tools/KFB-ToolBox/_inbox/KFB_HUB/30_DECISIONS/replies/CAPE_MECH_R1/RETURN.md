# Cape-Federkette und Mech-Flügel im Spiel · V-1158, V-1168 · 01.11.2026
Branch `game/cape-dangle-r1`, von `game/integration-r2` @b56fa199, nicht gemergt. Schalter `jetvar=cape`, `jetvar=mechwings`; Standard bleibt die Rakete.
Geteilte Datei: `src/m1/jetpack.js` (Cape-Aufruf, Vertrag r4, Flammenbreite nur für den Mech). Neu: `src/m1/capeDangle.js`, `test/cape-dangle.mjs`, `test/cape-gleich.mjs`, `test/unit/capeDangle.mjs`.
Nötig in `assets/private`: `KFB_Mech_Wings.r2.glb`, `v910_jetpack.contract.r4.json` (geholt von @3ab91d03, enthält beides), `cast_private/orc_brute.glb`. Der Cape-Stand ist gegen den Pin geprüft: gleich.

## Cape
- Federkette `DangleChain` (ear-dangle.v1, Datei unverändert), keine laufende Schleife mehr. Grundhaltung je Flugzustand ein Bild aus den WSB-Clips.
- Über den genehmigten Weg hinaus: Die Kette kennt nur Wind von hinten, das Cape stand im Bauchflug als Fähnchen hoch. Deshalb Ziel = Schwere + Fahrtwind, als Windeingang in dieselbe Feder. Erstes Glied trägt den Kragen und bewegt sich kaum. Im Flug höchstens 18° unter die Flughaltung.
- Kapseln an Hüfte, Rücken, Kopf, Armen, Beinen, Radien je Figur aus ihrem Netz. Berührung: abprallen.

## Prüfung, Ziel null: nicht erreicht
Stichproben im laufenden Spiel, 766 Netzpunkte je Probe, ohne Kragen (oberste Zone wie WSB).
| | Kapseln, Treffer | größte Tiefe | echtes Netz, Punkte innen |
|---|---|---|---|
| FrizzleBob Boden | 69 von 19.916 (0,3 %) | 7 cm | 0 in 3 Proben |
| FrizzleBob Flug | 1.357 von 39.066 (3,5 %) | 19 cm | 212 in 5 Proben, alle Kopf (Vorwärtsflug 180) |
| Brute Boden | 3.288 von 62.812 (5,2 %) | 32 cm | 679 in 9 Proben, nur im ersten Stand |
| Brute Flug | 2.585 von 96.516 (2,7 %) | 20 cm | 337 in 12 Proben (Boost 287, Start 50) |
Nicht abgedeckt: Echtes Netz nur Stichprobe, je Lauf wenige Proben. Beim Brute grob: alle Teile gegen eine Linie Hüfte bis Brust, Zähler dort wohl zu hoch. Kragen zählt nicht. Andere Figuren nicht geprüft. Brute-Kapseln sind groß geschätzt. Warum der erste Brute-Stand zählt, ist nicht geklärt.

## Schwingt es?
Selbst Bild für Bild angesehen, `Cape_Stopp_Bildfolge.jpg`. Es reagiert: beim Rennen weht es nach hinten, beim Stopp fällt es und kommt langsam ein Stück zurück (FrizzleBob Winkel 62, dann 47, dann 50). Das ist eine gedämpfte Rückschwingung, kein großes Pendeln, weil es am runden Hintern anliegt. Ob das cartoonig genug ist, entscheidet Georg.

## Mech
Sitz aus Vertrag r4, Düsen unten, zwei getrennte Flammen gerade nach unten, Flamme schmaler gestellt. Einbettung der inneren Knäufe stört in den angesehenen Bildern nicht, r3 nicht nötig. Nur FrizzleBob im Spiel, Brute nicht.

## Einschränkungen im Bild
- Im Flug zieht die Spielkamera weit weg, das Cape ist dort klein, im Sturz läuft die Figur an den Bildrand.
- Seitenbilder sind eine eigene Kamera mit `seethrough=0`. Mit Durchblick-Portal (V-827) schneidet es dort ein Punktraster aus; in der Spielkamera nicht gesehen.
- Die weißen Doppellinien im Flug gehören nicht zu dieser Arbeit.
- Tuch wirkt kantig, das ist die Netzform von WSB.

## Tests (V-1107 Stufe A)
`test/unit/capeDangle.mjs` PASS, `test/contract-static.mjs` PASS. Ohne Schalter: Bild weicht zum Ausgangsstand nicht stärker ab als der Ausgangsstand von sich selbst, Programmzahl 113 und 116 gegen 113 und 113, die bekannte Schwankung, Quelltext-Listen schwanken in beiden; Lauf vor den letzten zwei Cape-Werten, die nur hinter dem Schalter wirken. Kritiker einmal: Seine FAIL zu Löchern im Tuch und am Mech-Sitz kamen vom Punktraster der Seitenkamera, sein FAIL zum Nachschwingen von einer falsch geschnittenen Bildfolge; beides neu geschnitten, Kritiker nicht wiederholt.
Dateien: `Cape_FrizzleBob.mp4`, `Cape_Brute.mp4`, `Mech_R2.mp4`, `Cape_Einzelbild_Spielkamera.jpg`, `Cape_FrizzleBob_Seite.jpg`, `Cape_Brute_Seite.jpg`, `Cape_Stopp_Bildfolge.jpg`, `Mech_Blatt.jpg`.
