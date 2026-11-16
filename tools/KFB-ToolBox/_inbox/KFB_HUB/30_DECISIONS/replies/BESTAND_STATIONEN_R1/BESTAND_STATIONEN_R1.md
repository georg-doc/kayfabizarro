# Bestand aller Stationen R1 · 17.11.2026 (WS0, Georg „mach die Bestandsliste aller Stationen“)

Quellen: Hub-Briefings (462, davon 4 offen), Schalterliste `src/flags.js` (166 Schalter, 130 im Release), GitHub-Zweige, Kanäle, Register bis V-1877.

## Je Station
| Station | Offener Auftrag | Letzte Lieferung | Im Spiel? | Kanal |
|---|---|---|---|---|
| **WS0** (Stamm, Einbau) | Kampfbühne R1 (q742 PASS); Soldaten auf Ende-Kaskade | Ende-Kaskade Würfelmonster 16.11. | Freigegeben, aber noch nicht eingeschaltet: Patch-Fahren + Fahrton (q727–q732 PASS), Ende-Kaskade (q741 PASS) | – |
| **WS1** (MacBook, Spielszene) | keiner | 08.11. | – | comms/ws0-ws1 still seit 08.11.; WS1 pausiert (V-1684), seitdem kein Commit |
| **WSA Stage/Audio/Site** (ChatGPT) | keiner offen | 15.11. Sprechblasen, HUD minimal, Toolbox-Webbuild | Sprechblasen, HUD minimal: ja | Georg fügt Text ein, keine Bestätigung |
| **WSA Patch** | Waffenwirkung (V-1877): Blaster gegen Kartenraum | 16.11. zerstörbarer Kartenraum (eigene Site, 277 Tests) | Infinite Rooms R3: nein (Schalter aus, Kandidat) | Georg fügt Text ein |
| **WSB** (Blender, Mac mini) | R1b läuft, dann Würfelmonster-Kampf, dann FB r1k | 16.11. Ausdrucksblatt R1 | Tanz, Web-Kanon: ja | seit 17.11. `replies/WSB_KANAL` + Bestätigung (vorher kaputt) |
| **WSV** (Video) | keiner | 08.11. Feature-Clip (q556 PASS) | HyperNorm-Kern: ja | comms/ws0-wsv still seit 08.11. (fertig) |
| **WSR** (Racer, neu) | Racer-Kern R0 (b460, 16.11.) | – | – | Rückmeldung fehlt: noch nicht klar, ob der Chat läuft |
| **Claude Design** | keiner offen | 16.11. Knete v14 | Knete v12: nein (q718 TUNE); v14: noch nicht geprüft | Georg fügt Text ein |
| **Verteiler** | keiner offen | 07.11. | Pop-ups, Pilze: ja | Rückmeldung über Georg |
| **Bild-Chat** | keiner offen | 14.11. Münder R4 | ja | Georg |
| **Suno, HeyGen** | – | Georgs eigene Werkzeuge | Ton: ja | Georg |

## Was das Stückwerk erzeugt (Befund)
1. **Einbau-Engpass:** WS1 ist seit 08.11. pausiert, aber `src/m1/M1World.jsx` (die Spielszene, in die jedes neue Modul eingehängt wird) darf nur WS1 anfassen. Neue Teile (Kampfbühne, Infinite Rooms, Racer-Kern) können nur über Umwege ins Spiel.
2. **Freigegeben, aber nicht eingeschaltet:** Patch-Fahren mit Fahrton und die Ende-Kaskade stehen noch auf „prüfen“, obwohl du PASS gegeben hast.
3. **Geliefert, aber nicht im Spiel:** Infinite Rooms R3, Knete v14, Racer-Kern (noch nicht begonnen).
4. **Kanäle ohne Bestätigung:** Nur WSB hat seit heute einen Kanal mit Bestätigung. WSA, WSA Patch, Claude Design und WSR laufen über deinen Copy-Paste, ohne Rückmeldung an WS0.
5. **Keine gemeinsame Prüfstelle:** Belege entstehen je Station anders. Die Kampfbühne (q742) wird die Prüfstelle für Kampf und Kollision.

## Vorschlag
- **A · Einbau:** Solange WS1 pausiert, hängt WS0 neue Module selbst in `M1World.jsx` ein (nur Einhängen und Schalter, sonst nichts). WS1 bekommt beim Wiederstart eine Liste der Änderungen.
- **B · Einschalten:** Alles mit PASS kommt sofort in Testfahrt und Release: Patch-Fahren + Fahrton, Ende-Kaskade.
- **C · Kanäle:** Jede Station bekommt einen Ordner `replies/<STATION>_KANAL/` mit Bestätigungspflicht wie WSB. Deine Pastes enthalten den Satz „Antwort als Datei in …“.
- **D · Meilenstein „Spielbar 1“:** ein zusammengeführter Stand auf deiner Site. Er enthält Fahren (Patch), Kampf mit Ende-Kaskade (Würfelmonster, Soldaten), Kampfbühne für die Belege und den Kartenraum, wenn WSA Patch bis dahin den Treffer-Anschluss hat. Bis dahin keine neuen Einzelthemen von WS0, außer du willst es anders.
