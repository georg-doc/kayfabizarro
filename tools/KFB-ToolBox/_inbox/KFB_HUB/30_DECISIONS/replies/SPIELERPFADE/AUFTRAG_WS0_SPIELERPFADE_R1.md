# Auftrag an WS0 · Spielerpfade und Agenten-Läufe (R1, Georg 21.11.2026)

**Kurz:** Spielerwege in KFB aufzeichnen, alle Fahrten übereinander als Karte zeigen und POI-Routen auswerten. Danach Agenten die offene Welt durchspielen lassen und ihre Wege mit denen echter Spieler vergleichen.
**Wann:** Georg will das erst angehen, wenn drei Dinge erfüllt sind:
1. Alle prozeduralen Ereignisse und POIs stehen.
2. Ein Game Critic hat die Gameplay- und Belohnungsschleifen geprüft.
3. Die Verbesserungen aus dieser Prüfung sind eingebaut.

Bis dahin ist der Auftrag geparkt und wird nicht vorgezogen.
**Bestand zuerst:**
- `src/hud/driveRecorderCore.js` (Schema `kfb.testfahrt/1`, Schalter `rec=1`/`chronik=1`) zeichnet schon auf:
  - die Position etwa alle 0,5 s mit Tempo und Modus;
  - Ereignisse: `karte`, `begegnung`, `modus`, `fahrzeug`.
- Das Bot-Theater (`src/npc/theatre/`: providers, memory, schema, session) liefert den Unterbau für denkende Agenten.

## Bausteine (Vorschlag, WS0 entscheidet Reihenfolge und Besetzung)

1. **Sammeln:** Fahrten von Georg, Markus und Testern an einem festen Ort ablegen. Echte Spieler und Agenten getrennt markieren, sonst gleiches Format.
2. **Additive Karte:** Alle Pfade übereinander auf die Weltkarte legen.
   - Ebene 1: Häufigkeit. Viel genutzte Wege leuchten, tote Ecken bleiben dunkel.
   - Ebene 2: Halt, Umkehr, Hängenbleiben.
   - Filter nach Spieler oder Agent, Modus und Version der Welt.
3. **POI-Routen:** Aus den Ereignissen die Reihenfolge der besuchten Orte bilden. Ergebnis:
   - typische Routen;
   - Orte, die kaum jemand findet;
   - ungeplante Abkürzungen;
   - Zeit bis zum ersten Fund je POI.
4. **Einfache Bots:** Freies Umherlaufen mit Anziehung durch POIs, in Typen wie neugierig, zielstrebig oder sammelnd. Viele Läufe ohne Bildschirm. Sie prüfen:
   - ob alles erreichbar ist;
   - wo Sackgassen und Engstellen sind;
   - wie gut die Welt abgedeckt wird.
5. **Denkende Agenten:** Ein KI-Agent entscheidet nur „wohin als Nächstes“, die Bewegung übernimmt die normale Steuerung. Wenige Entscheidungen pro Minute halten die Kosten klein. Sie prüfen:
   - ob die Welt Neugier weckt;
   - ob Hinweise und Sichtachsen tragen.
6. **Abgleich:** Die Werte der Agenten an den echten Fahrten von Georg und Markus eichen. Agenten finden Fehler in der Welt, wie sie sich anfühlt, zeigen nur echte Spieler.

**Fertig, wenn:**
- Eine Karte zeigt alle Fahrten einer Weltversion übereinander, umschaltbar Spieler/Agenten.
- Eine Routenliste nennt die häufigsten POI-Folgen und die kaum gefundenen POIs.
- Ein Agenten-Lauf ohne Bildschirm erzeugt Dateien im selben Format.

Herkunft: Frage von Georg im DC-Aquarium-Feinschliff-Chat, 21.11.2026. Die Aquarium-Seite wäre ein kleiner Probelauf, ist aber nicht Teil des Auftrags.
