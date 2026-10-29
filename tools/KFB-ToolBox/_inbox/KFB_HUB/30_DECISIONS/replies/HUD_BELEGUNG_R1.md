# HUD-Belegung R1 · was der Spieler wann sieht und drückt · WS0 · 29.10.2026 (V-1035, V-1038) · FREIGEGEBEN Georg 29.10. (mit Radio im HUD und Almanach an seinem heutigen Platz)

## Grundsatz
Wenige feste Plätze, in allen Modi an derselben Stelle. Es wechseln nur die Inhalte, nie die Plätze. Was gerade nichts zu tun hat, ist ausgeblendet. Keine Knöpfe außerhalb der Plätze.

## Die Plätze
| # | Platz | Inhalt | Bleibt/neu |
|---|---|---|---|
| 1 | **Almanach** (oben links) | Kartenstapel mit Zähler, Fächer „Letzte Karten“, Inventar (ersetzt die Truhe) | bleibt wie er ist, an seinem heutigen Platz |
| 2 | **Zielhinweis** (oben Mitte) | Richtung, Name und Entfernung zum nächsten Ziel (wie heute „Existentialist Café 260 m“), nur wenn aktiv | ersetzt den quer zeigenden Pfeil und die Orts-Zeile |
| 3 | **Status** (oben rechts) | Leben und Fluff-Vorrat, schlicht, eine Zeile; daneben klein und gerade das Zahnrad für Einstellungen | ersetzt die Fluff-Münzreihe und das schräge Zahnrad |
| 4 | **Reise-Knopf** (unten links) | ein Knopf, öffnet den Fächer Gehen · Jetpack/Rakete/Cape · Fahrzeuge (V-940) | neu |
| 5 | **Radio** (unten links neben dem Reise-Knopf) | drei runde Knöpfe: Play/Pause, nächster Titel, Ton an/aus; Tippen auf den Titel öffnet die Playlist | bleibt im HUD (Georg 29.10.), ohne Kassetten-Gehäuse |
| 6 | **Vier Aktionsknöpfe** (unten rechts, Daumenbereich) | Primär · Sekundär · Bewegung · Kontext | neu, ersetzt Leiste und Sprechblasen-Fach |

Entfällt: Kassetten-Gehäuse, bläuliche Truhe, schräges Zahnrad, quer zeigender Pfeil, Fluff-Münzreihe, die zwei Extra-Knöpfe außerhalb. Vorerst nicht im HUD: Minikarte, Tacho, Modus-Plakette; Tempo zeigt später das Fahrzeug bzw. das Raketen-Bullauge (V-1032).

Abklingzeit eines Knopfs: Farbe füllt den Knopf von unten wieder auf (V-673).

## Die vier Aktionsknöpfe je Modus
| Modus | Primär | Sekundär | Bewegung | Kontext (nur wenn etwas da ist) |
|---|---|---|---|---|
| Gehen | Waffe, Hauptfeuer | Zweitfeuer der Waffe oder gewählte Wurfwaffe | Springen (doppelt = Jetpack starten) | Reden, Aufheben, Einsteigen, Heilen |
| Fliegen (Jetpack, Rakete, Cape) | wie Gehen | wie Gehen | Boost | Landen |
| Fahren (Dachfahrer) | wie Gehen, Figur schießt vom Dach | wie Gehen | Boost | Aussteigen |
| Gespräch | ausgeblendet | ausgeblendet | ausgeblendet | Antwort wählen über die Sprechblasen |

Kampf ist kein eigener Modus: Primär und Sekundär sind in allen Bewegungsarten gleich belegt.

## Waffen-Logik (V-1038)
- **Ein Paar je Waffe:** jede Waffe hat Hauptfeuer und Zweitfeuer, wie im Destruction-Mech-POC (Gatling: Kugeln / Rakete) – kein Waffenwechsel für das Zweitfeuer.
- **Wahl des Spielers:** statt des Zweitfeuers darf man eine Wurfwaffe auf Sekundär legen (Granate, Cartoon-Bombe).
- **Waffe wählen:** Primär lange drücken öffnet den Fächer mit bis zu sechs Waffen (V-940); Sekundär lange drücken den Fächer der Wurfwaffen.

## Fahren mit Waffe (V-1038)
- Keine Bordwaffen am Fahrzeug jetzt. Die Figur auf dem Dach trägt ihre Waffe; ist eine Waffe gewählt, verschwindet das Lenkrad und die Figur lenkt cartoonig mit der Gatling mit. Figur bleibt starr verankert (V-994); nur die Gatling darf beim Feuern wackeln und rotieren, Mündungsfeuer aus dem Bestand.
- Rammen von Gebäuden löst dieselbe Schaden- und Zerstörungslogik aus wie die Waffen.
- Später, nur als Option: Bordkanone auf der Motorhaube im Mad-Max-Stil, gekoppelt an den Fahrer.

## Tasten (Vorschlag, Desktop)
Linke Maustaste Primär · rechte Maustaste Sekundär · Leertaste Bewegung · E Kontext · Q Reise-Fächer · M Radio Play/Pause · N nächster Titel · Esc Einstellungen. Zahlen 1–6 wählen direkt eine Waffe.

## Danach
Nach Georgs Freigabe baut Claude Design daraus einen klickbaren HTML-Prototyp aus den freigestellten Claymation-Vorlagen (Bilder ≤ 2 MB, Paket auf GitHub); Georg klickt ihn durch; dann Einbau ins Spiel durch WS0 nach So.
