# Gespräch mit dem Spieler · Entwurf R1 · WS0 · 31.10.2026 (V-1067) · ENTWURF, wartet auf Georg (Hub-Frage q317)

**Ziel (Georg 31.10.):** Monkey-Island-artiger Dialog als Chat in Sprechblasen statt der großen Antwortflächen. Karten-Vorschau in der Blase, mehrere Figuren im Gespräch, Kartenauftrag, Ortstipp als Wegpunkt, Karte als eigener Gesprächsbeitrag, und man darf stattdessen auch schießen. Baut auf `replies/WELTWISSEN_MODELL_R1.md` auf.

## Zwei Lagen
**Freie Gespräche der Figuren untereinander:** nichts zum Anklicken. Der Kartentitel steht fett in der Blase (V-699). Was du gehört hast, landet im Almanach-Fächer „Letzte Karten“; dort siehst du die Karte in Ruhe an. So entfällt das Timing-Problem.

**Gespräch mit dir:** Das Gespräch wartet auf dich, deshalb ist Klicken dort kein Problem. Die Blase zeigt ein Vorschaubild der Karte; ein Klick öffnet sie im Deck-Viewer, das Gespräch steht solange.

## Ablauf (Vorschlag: in der Welt, kein eigener Bildschirm)
- Du sprichst eine Figur gezielt an. Die Kamera rückt näher, die anderen bleiben stehen, schauen zu und werfen einzelne Blasen ein. Du kannst durch Anklicken zu einer anderen Figur wechseln.
- Deine Antworten erscheinen als Sprechblasen an deiner Figur, zwei bis vier zur Auswahl, aus dem Sprechblasen-SSOT (V-887, V-992). Sie ersetzen die großen Flächen aus `src/Dialog.jsx`. Inhaltlich bleibt Show it, Spin it, Sell it.

## Was du im Gespräch tun kannst
| Knopf (feste Plätze aus V-1039) | Wirkung |
|---|---|
| Antwort-Blasen | sagen |
| Kontext-Knopf: Karte spielen | Der Almanach öffnet sich als Hand. Die gewählte Karte fliegt in deine Blase (vorhandener Kartenflug) und ist dein Beitrag. Die Figur antwortet aus ihrer Liste, wie die Beleidigungs-Duelle bei Monkey Island, aber ohne richtige Lösung |
| Primär: Waffe | bleibt verfügbar, Schießen beendet das Gespräch. Das nutzt die vorhandene Warnen-, Drohen- und KO-Logik. Zuschauer sind Zeugen und merken es sich |
| Weggehen | beendet still |

Das ändert V-1039 in einem Punkt: Dort sind Primär und Sekundär im Gespräch ausgeblendet. Neu bleibt die Waffe erreichbar, klein und ohne Aufforderung.

## Kartenauftrag, ohne Quest-Maschine
- Ein Auftrag ist ein Eintrag: `Figur · gesuchte Karte · Stand`. Die Lücke ergibt sich aus Deck und Liste der Figur.
- Annehmen ist eine Antwort-Blase. Offene Aufträge stehen im Almanach.
- Erfüllen: Du spielst die Karte im Gespräch mit der Figur. Sie tauscht eine Karte und erzählt deine weiter.

## Ortstipp und Wegpunkt
- Du fragst in die Runde. Antworten kann nur, wer die Karte oder ihren Ort wirklich kennt, also einen Eintrag aus eigener Erfahrung hat; die Figur zeigt dabei in die Richtung (Bestand: `kfb_gesture_pointing_a`, noch nicht angesehen).
- „Merken“ legt den Ort in eine kurze Wegpunkt-Liste. Der Zielhinweis oben (Platz 2, V-1039) zeigt den zuletzt gewählten. Wechseln und Löschen im Almanach, mehr nicht.
- Geländekarten liegen an festen Plätzen (q241). Wir kennen ihren Ort also schon und verfolgen nichts Neues.

## Herkunft und Bau
- Vorhanden: Sprechblasen-Code, Kartenflug, Almanach-Fächer, Deck-Viewer, Blickführung, Warnen-Drohen-KO, Lean Memory.
- Neu: Gesprächs-Zustand, Antwort-Blasen, Hand-Auswahl, Auftrags- und Wegpunkt-Liste.
- Das Gesprächs-Stück im HUD v6 hat WS0 noch nicht gesehen; das Paket liegt bei WS1 (Q-013).
- Sprechblasen nicht noch einmal über Claude Design: Es scheitert daran trotz SSOT. Der Prototyp entsteht im Spiel-Code mit dem echten `BubbleHost.jsx`.

## Erster Beweis nach Georgs Ja
Eine Szene mit drei Figuren: Du sprichst eine an, bekommst den Auftrag, ein Zuschauer gibt den Ortstipp, du merkst ihn, holst die Karte, spielst sie aus der Hand. Im zweiten Lauf schießt du stattdessen.
