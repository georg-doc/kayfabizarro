# Buchmaschine: Timing-Blatt Intro R1 (23.11., internes Werkzeug, nach WS0)

Grundlage: SHOTLISTE_PRODUKTFILM_R1, Kritik R6 („die Bilder tragen, die Übergänge nicht“), Georg 23.11.:
- strikt Englisch, Internationalisierung vorsehen;
- Befund subtil, nicht didaktisch, kein AI-Slop;
- der Stempel „Gedankenverbrechen“ ist gestrichen.

Gebaut wird erst, wenn r3c von WSB da ist. Danach beginnt die Zählung neu: höchstens 5 Runden, Stopp nach 2 ohne Verbesserung.

## Regeln (gelten für jede Zeile)
1. Je Einstellung eine Kameraspur und eine Buchspur. In jeder Zeitspanne bewegt sich höchstens eines von beiden. Ausnahme: der Orbit, wenn das Buch dabei ruht.
2. Jeder Übergang dauert mindestens 0,8 s und hat Ease-in und Ease-out. Es gibt keine harten Schnitte.
3. Bei einer Nahfahrt oder einem Nahhalt steht das Buch still (Drehung, Klappen, Blättern).
4. Jeder Hero-Halt dauert mindestens 1,2 s und ist auf das Motiv kadriert: Das Motiv liegt mittig und ganz im Bild, mit 8 % Rand. Nichts ist angeschnitten.
5. Die Klappen bewegen sich nur in der Totalen, wenn das ganze Buch mit Rand im Bild ist.
6. Glanz an Kanten ist gedeckelt: Die Kantenlichter folgen dem Drehwinkel, sodass nichts ausbrennt.

## Analyse-Sprache: aus der Bühne, keine HUD-Bastelei
- Die Overlay-Anzeige aus R6 entfällt. Sie war mit festen Farben und Formen im Code gebaut und damit nicht aus dem Kit abgeleitet.
- Die Analyse sieht man an der Maschine selbst:
  - das Scanlicht wandert als Lichtkante über das Papier;
  - der Lichtring am Teller ändert seine Farbe;
  - die Planeten des Orrery tasten mit dünnen Lichtbögen das Motiv ab, auf das gerade geschaut wird;
  - die Kammer brummt.
- Schrift erscheint nur auf den HyperNorm-Wänden (bestehende Typo-Wand, Archiv-Montage nach Curtis). Sie steht im Hintergrund, unscharf, nur in Totalen und ist sparsam: Objektnummer, Format, Motivnamen.
- Alle Texte sind englisch und kommen aus einer Stringtabelle mit Schlüsseln, sodass später eine deutsche Fassung möglich ist:

| Schlüssel | en |
|---|---|
| `bm.scan.object` | OBJECT 0417 |
| `bm.scan.format` | 165 × 230 MM |
| `bm.motif.animals` | ANIMALS |
| `bm.motif.title` | TITLE |
| `bm.motif.human` | HUMAN |
| `bm.page.30` | PAGE 30 |

## Befund: leise, ohne Wort
- Kein Stempel, kein Urteilswort, keine rote Bühne.
- Die Maschine zeigt den Befund durch ihr Verhalten:
  - Das Scanlicht wird auf der Mammut-Seite langsamer und bleibt auf der Frage nach der Kooperation stehen.
  - Das Brummen setzt aus.
  - Die Planeten halten an.
  - Der Lichtring kühlt von Weiß nach einem gedämpften Rot ab, in 1,5 s, ohne Blitz.
  - Das Buchlicht wird schwächer, bis nur die Kante bleibt.
- Die Kamera zieht langsam zurück, das Buch bleibt still. Danach folgt der Ablauf aus dem Regiebuch (Sezierung).

## Zeitplan (≈ 35 s)

| Zeit (s) | Einstellung | Kamera | Buch | Licht, Effekt, Ton |
|---|---|---|---|---|
| 0,0–2,0 | E1 Hero | langsames Push-in, halbnah, leicht von unten, ganzes Cover mit Rand | ruht, leicht geneigt | Kantenlichter, Schärfe auf dem Cover |
| 2,0–3,6 | E1 Halt (1,6) | steht | ruht | Scanlicht über das Cover 2,1–3,3, ein Planet tastet das Cover ab |
| 3,6–4,4 | Übergang | zieht auf die Drehposition (frontal, etwas weiter) | ruht | – |
| 4,4–6,8 | E2 Drehung | steht | dreht 180° auf die Rückseite, holt aus und federt nach | Kantenlichter folgen dem Winkel |
| 6,8–8,0 | E2 Halt Rückseite (1,2) | steht | ruht | Scanlicht über die Rückseite 6,9–7,7 |
| 8,0–9,0 | Übergang | zurück in die Totale (ganzes Buch, viel Rand) | ruht | – |
| 9,0–10,6 | E3 Deckel öffnet | steht (Totale) | Vorderdeckel öffnet 180° nach hinten (Clip `umschlag_ausfalten`) | – |
| 10,4–11,6 | E3 Klappen | steht (Totale) | vordere Klappe 10,4–11,2, hintere 10,8–11,6, je mit leichtem Überschwingen | Klick-Sounds |
| 11,6–13,2 | E3 Halt Panorama (1,6) | steht, Umschlag füllt etwa 80 % der Breite, tief und leicht aufschauend | ruht | Streiflicht wandert einmal über das Panorama, Wand zeigt `bm.scan.format` |
| 13,2–14,4 | Übergang | Seitwärtsfahrt zu den Tieren (Rückseite) | ruht | – |
| 14,4–15,8 | H1 Tiere (1,4) | steht, Ratte, Vogel und Fisch ganz im Bild | ruht | Planet tastet ab |
| 15,8–16,8 | Übergang | Fahrt zum Titel | ruht | – |
| 16,8–18,2 | H2 Titel (1,4) | steht, Titel ganz im Bild | ruht | Schärfe wandert vom Titel zur Figur (im Halt) |
| 18,2–19,2 | Übergang | Fahrt zur Frau mit Bär | ruht | – |
| 19,2–20,6 | H3 Frau mit Bär (1,4) | steht | ruht | Planet tastet ab |
| 20,6–21,8 | Übergang | Rückzug in die Totale | ruht | – |
| 21,8–23,0 | E4 Einfalten | steht (Totale) | Klappen falten ein (`umschlag_einfalten`) | – |
| 23,0–24,4 | E4 Wenden | steht (Totale) | Buch wendet sich mit den Innenseiten nach oben, sinkt leicht | – |
| 24,4–25,4 | Übergang | in die Orbit-Startposition, halbnah | ruht | – |
| 25,4–26,8 | E5 Orbit, Teil 1 | Orbit etwa 60°, halbnah | ruht, aufgeschlagen | Scanlicht über die Doppelseite |
| 26,8–28,6 | E5 Blättern | steht | `blaettern` p01 26,9–27,8, b14 27,8–28,6 (Mammut-Doppelseite) | Blatt-Sounds |
| 28,6–29,6 | Übergang | Fahrt auf das Mammut | ruht | – |
| 29,6–31,4 | H4 Mammut (1,8) | steht, Mammut ganz im Bild | ruht | Scanlicht wird langsamer |
| 31,4–33,0 | Befund | steht | ruht | Scanlicht bleibt auf der Kooperationsfrage stehen, Brummen setzt aus, Planeten halten, Ring kühlt nach gedämpftem Rot |
| 33,0–35,0 | Befund, Rückzug | zieht langsam zurück in die Halbtotale | ruht | Buchlicht schwächer, nur die Kante bleibt, Stille |

## Prüfung vor jeder Runde (im Code, vor der Kritik)
- Ein Skript liest die Spuren und meldet jede Zeitspanne, in der sich Kamera und Buch zugleich bewegen (außer im Orbit-Teil).
- Es meldet auch jeden Übergang unter 0,8 s und jeden Halt unter 1,2 s.
- Kadrierung: Für jeden Halt wird die Bounding-Box des Motivs auf den Bildschirm projiziert. Sie muss mit 8 % Rand ganz im Bild liegen.
- Die Kritik bekommt Bögen mit 6 fps und dieses Blatt.
