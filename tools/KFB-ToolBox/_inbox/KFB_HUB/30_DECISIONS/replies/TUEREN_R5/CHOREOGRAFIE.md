# Türen R5 · Choreografie des Durchgangs (WS-Design, 04.11.2026)

Georg zu R4: „bei 80 %“. Es fehlt ein Gesamtkonzept. Das Loch in der Mitte des Strudels, die punktförmige Umwandlung und die Transition selbst wirken wie 3–4 Ebenen.
Vorbilder (Recherche, Quellen unten): Mario-Gemälde (das Bild *ist* das Ziel, Tunnel in der Portalfarbe), Rift Apart (Zwischenraum etwa 0,7 s, Tausch im Weißblitz, Kamera und Bewegungsunschärfe nach dem Sprung angeglichen), Hyperraum (Sterne werden Streifen, dann Tunnel, dann Schnapp), Rick-and-Morty-Portal (dieselbe Scheibe an beiden Enden), Match Cut, Smear Frame.

## Das eine Bild

**Die gemalte Tür ist der einzige Träger.** Ihre Öffnung zeigt von Anfang an das Ziel. Beim Hineinfahren wird das Türbild selbst zu Streifen, die am Spieler vorbeiziehen. Die Ziel-Öffnung wächst, bis sie das Bild ist. Gewechselt wird im hellsten Moment. Am Ziel kommt der Wagen in Fahrt aus derselben Tür.
Alles hängt an einem Fortschrittswert *t*: eine Farbkurve, eine Kamerakurve, ein Tonbogen.
Das Zentrum ist nie leer, denn dort ist immer das Ziel. Einen punktförmigen Wechsel gibt es nicht, weil der Wechsel in einer Strecke und im Spitzenlicht liegt.

## Zustände (Zeit ab Berührung, Wagen etwa 27 m/s)

| Zustand | Zeit | Portal | Spieler | Kamera | Farbe und Form | Ton |
|---|---|---|---|---|---|---|
| **Annäherung** | ab ~8 m bis 0 | Glow und Ströme werden stärker. Die bemalte Fläche wellt sich zum Wagen hin (Mario-Welle). In der Öffnung leuchtet das **Ziel-Bild** (Kartenmotiv und Biom-Farbe, weich). | fährt normal | normal | Ströme in Türfarbe, das Ziel-Bild wird heller | Sog schwillt an |
| **Berührung** | 0 | Von der Kontaktstelle läuft ein Wellenring über die Fläche, das Bild dellt sich um die Wagennase ein. | Wagen staucht kurz (Antizipation) | zieht 0,1 s leicht zurück, Sichtfeld etwas enger | – | „Plopp“ der Fläche |
| **Eintauchen** | 0–0,35 s | Das **Türbild zieht sich zu Streifen** um die Kamera (Smear, keine fremde Fläche). Die Ziel-Öffnung wächst aus der Bildmitte nach außen. | bleibt im Bild, behält Tempo und Richtung, Bewegungsunschärfe nach hinten | **Sichtfeld-Kick** (+12°) mit Ease-in, leichte Unschärfe in Fahrtrichtung | alte Palette (Tür) wird zu Streifen, Ziel-Palette in der Mitte | Rauschen steigt |
| **Tunnel** | 0,35–0,7 s | Streifen fließen vorbei. Innen strömen schon die **Ziel-Farben** mit, außen verblassen die Türfarben. Das Blau ist nur Licht auf den Streifen, keine eigene Fläche. | Wagen als Anker in der Mitte | hält das weite Sichtfeld, leichtes Zittern | ein Farbverlauf von Tür über Portallicht zu Ziel | ein Sweep |
| **Spitze** | 0,7 s (2–3 Bilder) | Das Ziel-Bild ist überall, Spitzenlicht in Portalfarbe hell. **Hier wird versetzt.** | – | – | heller Blitz, kein Schwarz, kein Punkt | „Schnapp“ |
| **Austritt** | 0,7–1,2 s | Die Streifen werden langsamer (Ease-out) und legen sich als **Ausgangstür** hinter den Wagen. Es ist dieselbe Türform in der neuen Welt, Farbtropfen fallen ab. | ploppt in Fahrt heraus, kurzes Strecken und Federn | Sichtfeld schwingt zurück mit leichtem Überschwingen, Zittern klingt ab | die neue Welt *ist* das Ziel-Bild, Reste der Portalfarbe tropfen an den Rändern ab | Ausklang |
| **Ankommen** | 1,2–2 s | Die Ausgangstür hinter dem Wagen glüht noch und beruhigt sich. | fährt weiter | normal | – | Nachhall |

## Was wegfällt

- das Loch in der Mitte und der Kern-Punkt: Die Mitte ist immer das Ziel-Bild
- der Farbschleier als eigene Ebene: Die Ziel-Farbe ist dieselbe Ebene wie das Ziel-Bild
- die runde Scheibe, die von der Tür abhebt: Das Türbild selbst wird zu Streifen

## Umsetzung (nach Georgs Ja zum Storyboard)

- Ein Shader mit Fortschritt *t*, gespeist aus Türbild (Streifen), Ziel-Bild (Kartenmotiv plus Biom-Palette) und Portallicht.
- Der Wagen wird über dem Übergang gezeichnet, damit er sichtbar bleibt.
- Sichtfeld-Kurve und Zittern laufen über die Folgekamera.
- Die Ausgangstür steht hinter dem Wagen, und die Folgekamera hält sie im Bild, wenn sie hinschaut.
- Ton: ein Bogen aus vorhandenen Klängen (Sog → Sweep → Schnapp → Nachhall), ausgetauscht wird nur der Platzhalter.

Quellen: [Digital Trends: Rift Apart](https://www.digitaltrends.com/gaming/ratchet-and-clank-rift-apart-interview/) · [Push Square](https://www.pushsquare.com/news/2021/04/this_ratchet_and_clank_rift_apart_loading_transition_is_a_reminder_of_what_ps5_can_do) · [MarioWiki: Painting](https://www.mariowiki.com/Painting) · [sm64 paintings.c](https://github.com/n64decomp/sm64/blob/master/src/game/paintings.c) · [Wikipedia: Hyperspace](https://en.wikipedia.org/wiki/Hyperspace) · [Match cut](https://en.wikipedia.org/wiki/Match_cut) · [Smear frame](https://en.wikipedia.org/wiki/Smear_frame) · [fxguide: Spider-Verse](https://www.fxguide.com/?p=244678) · [GamesRadar: Outlaws](https://www.gamesradar.com/games/open-world/how-star-wars-outlaws-is-trying-to-tackle-one-of-the-features-i-wanted-in-starfield-a-transition-from-the-open-world-to-space-flight) · [GDC: Juicing Your Cameras](https://gdcvault.com/play/1023146/Math-for-Game-Programmers-Juicing)
