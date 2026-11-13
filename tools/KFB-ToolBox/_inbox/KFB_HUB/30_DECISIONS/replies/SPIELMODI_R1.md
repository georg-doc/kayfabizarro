# Spielmodi · Chill, Normal, Hard · R1 · WS0 · 12.11.2026 (V-1665, q628, Hub q634)

Baut nur auf Festgelegtem auf: Georg 11.11. (Fun-Modus als Standard, Wrestling-Logik, kaum Strafen, Skill ja), q628 (Umfallen, Neustart am Speicherpunkt, God Mode), Georg 10.10. (Chill: Zielhilfe), Georg 11.10. (Chill: Fahr- und Physik-Hilfe, Normal/Hard schwerer), GAME_LOOP_R1 (Deck komplett → Song + Freischaltung), WELTWISSEN_MODELL_R1 (Haltung je Karte), SLOP_SAMMELN_STUFEN_R1 (Album, Wanted-Bosse), Kontroll-Eskalation V-1416. Mit **Vorschlag** markiert ist, was neu ist und Georgs Ja braucht.

## Grundsatz
Wrestling ist Show. FB „verkauft“ Niederlagen und steht wieder auf. Strafen gibt es kaum. Der Spaß liegt in Zerstörung, Kaskaden, Effekten und im kreativen Ausschalten und „Hacken“ der Gegner. FB ist verwundbar, aber selten lange unten. Der God Mode bleibt ein Testschalter in den Einstellungen, kein Spielmodus.

## Drei Stufen, ein System
Gewählt wird im Einstellungsmenü. Chill ist der Standard. Alle Stufen teilen dieselbe Welt, dieselben Gegner und denselben Fortschritt.

| | Chill (Standard) | Normal | Hard |
|---|---|---|---|
| Leben heilt von selbst | schnell, nach kurzer Ruhe | langsam | nicht (**Vorschlag:** nur über Heil-Fluff aus der Aktionsleiste) |
| Bei null Leben | **Kayfabe-Auszählen am Ort:** FB fällt komisch um, Sterne, Mizzy zählt, FB steht beim „Kick-out“ wieder auf | Umfallen, Neustart am letzten Speicherpunkt (gebaut, q628) | **Satirischer Tod:** Erweckung am Friedhof (offene Welt) |
| In der Arena | wie oben, am Ort | Neustart am Tor (gebaut) | Neustart am Tor, kein Friedhof (Georg 11.11.) |
| Verlust | keiner | keiner | **Vorschlag:** getragener Fluff bleibt am Ort liegen und kann wieder eingesammelt werden |
| Hilfen | Zielhilfe (Tab wechselt durch sichtbare Gegner), Fahr- und Physik-Hilfe | weniger Hilfe | ohne Hilfe |
| Gegner nach dem Umfallen | vergessen FB, gehen zurück auf Wache (gebaut) | wie Chill | **Vorschlag:** bleiben wachsam |

Mizzy kommentiert alle drei Fälle mit den vorhandenen Clips: niedrig, umfallen, aufstehen (Chill), Neustart (Normal und Hard).

## Fortschritt ohne klassisches Leveln
Für alle Stufen gleich. Es gibt keine Erfahrungspunkte. Fortschritt heißt: mehr Karten, mehr Welt, mehr Ansehen.
1. **Karten:** Ist ein Deck komplett, läuft der Deck-Song, und es gibt eine Freischaltung (Portal, Fahrzeug-Skin, Landmark, Almanach-Eintrag). So steht es im Game Loop.
   - **Vorschlag A:** Die Abilities werden Kartenkräfte. Jedes volle Deck schaltet eine Ability frei. Heute sind alle zehn gleich da, im Testbetrieb bleibt das so.
   - **Vorschlag B:** Das größte Leben wächst mit vollen Decks und gefassten Wanted-Bossen. So sieht man in jeder Stufe, wie FB stärker wird.
2. **Ansehen bei Figuren:** Jede Figur merkt sich, wie sie zu FB und seinen Karten steht (Weltwissen, Gedächtnis plus oder minus). Wer FB mag, hilft und erzählt mehr. Wer ihn nicht mag, beleidigt ihn über die Chatterbox. Wer es zu bunt findet, greift an.
3. **Chaos hat Folgen statt Strafen:** Viel Zerstörung lässt die Eskalation steigen: Slops, dann Spielzeugsoldaten, dann Men in Black, dann Hunky & Dory. Das ist die Antwort der Welt, kein Punktabzug.
4. **Skill:** Das Slop-Album, die Absurditäts-Leiter und die Wanted-Bosse belohnen gutes, kreatives Ausschalten. Wie lange man überlebt, zählt nicht.

## Bau-Reihenfolge nach PASS
1. **WS0, gleich:** Moduswahl in Einstellungen › Character neben dem God Mode (Chill vorgewählt). Selbstheilung je Stufe. Chill-Auszählen am Ort mit den Mizzy-Clips „aufstehen“. Normal ist schon gebaut. Alles hinter einem Schalter, mit Beleg.
2. **Lebensleiste:** läuft über die HUD-Runde R2 der Kartenkante (V-1668).
3. **Später, mit dem Friedhof-Ort:** Hard-Tod in der offenen Welt.
4. **Nach dem MVP:** Kartenkräfte, wachsendes Leben (wenn Vorschlag A oder B gewählt) und Ansehen über WS-NPC.

Technik (nicht für Georg): Werte liegen als Daten in einer Tabelle `SPIELMODUS` (heilVerzugS, heilProS, nullAktion, verlust, zielhilfe, fahrhilfe). Der Speicher ist localStorage `kfb.spielmodus`, wie `kfb.godmode`. Ereignisse laufen über `SPIEL.bus` (arena.spieler.treffer, tod.phase).
