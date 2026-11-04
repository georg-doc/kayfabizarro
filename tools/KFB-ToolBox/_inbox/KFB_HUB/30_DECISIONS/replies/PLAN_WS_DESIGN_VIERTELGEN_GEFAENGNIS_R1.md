# PLAN · WS-Design · Viertel-Generator + Gefängnis (Panoptikum) · R1 · 04.11. · an WS0

Start erst, wenn Testlauf 5 auf der Stage läuft. Bis dahin nur dieser Plan, kein Browser-Slot.

## 1 · Viertel-Generator (mit dem Verteiler)

**Heute:** `cascade/r4/field.mjs` setzt vier Kartengebäude und drei Kit-Häuser von Hand (`QUARTER_FORMS` 1/2). Diese Teile gibt es schon und sie bleiben:
- der Außenrand aus den Grundflächen (`quarter-outline.mjs`)
- die Straßen-Props per kleiner WFC je Gehweg-Platz (`street-plan.mjs`)
- der Bordstein (`kfb-curb`)
- der Kartenbau (`holoBau`)
- der Boden (`deckGround`, Schlüssel Deck|Platz)

Hart verdrahtet ist nur eines: Die Schattenfelder erwarten genau vier Quader. Das wird auf N Gebäude erweitert, mit Obergrenze (siehe offene Punkte).

**Neues Modul `cascade/r4/viertel-gen.mjs`:** reine Rechnung, ohne three und ohne Browser, in Node prüfbar.
- Aufruf: `viertelPlan({ seed, biom, deck, flaeche }) → plan`.
- Gleiche Saat ergibt den gleichen Plan. Der Zufall kommt aus `rng` von `kfb-place-core`.

**Vorgehen (Straßenkarten-Logik, V-1042):**
1. Eine Hauptstraße quer durch die Fläche, leicht schräg. Davon gehen Querstraßen in unregelmäßigem Abstand ab, rekursiv geteilt, bis die Blöcke 18–40 m groß sind.
2. Jeder Block wird von der Fahrbahn (6,5 m) zurückgesetzt, dann folgen Bordstein und Gehweg (1,3 m) und schließlich die Parzellen.
3. Je Parzelle steht ein Gebäude:
   - ein Kartenquader, dessen Höhe aus dem Höhenband des Bioms kommt;
   - oder ein KayKit-Haus, wenn die Parzelle das Kit-Maß trägt. Dabei gilt die gemessene Kit-Box, nicht die Layout-Box.
4. Blöcke am Rand schneidet die Fläche ab. Daraus entsteht der unregelmäßige Umriss über `quarterOutline` aus den Grundflächen.
5. Straßen, die die Fläche verlassen, werden Zufahrten.

**Datenformat `kfb.viertel/1`:** JSON, Meter, lokal um die Zellmitte, y = 0 auf der Platte.
```
{ v:1, seed, biom, deck, flaeche:{ r } | { polygon },
  strassen:[{ id, punkte:[[x,z]…], breite }],
  bloecke:[{ id, polygon, gehweg:1.3 }],
  gebaeude:[{ id, block, x, z, w, d, h, yaw, art:'karte'|'kit', kit?, cardNo }],
  zufahrten:[{ strasse, x, z, richtung:[dx,dz], breite }],
  umriss:[[x,z]…] }
```

**Bau:**
- `field.mjs` nimmt `plan.gebaeude` statt der festen Anordnung. Es gibt keine fest eingebauten Szenen mehr; `viertelform=` bleibt nur als alter Prüfweg.
- Die Gebäude bauen sich über den Kartenbau auf und tragen die eine geteilte HyperNorm-Engine (`sharedEngine`) als Fassade.
- Bordstein und Gehweg je Block baut `kfb-curb`, die Props `street-plan`.
- Den Boden liefert `deckGround` mit der Saat `deck|seed`.

**Schnittstelle zum Verteiler:**
- **Verteiler → mich:** Der Verteiler setzt die große WFC-Zelle als Art `viertel` und ruft `viertelZelle({ key, seed, biom, x, z, flaeche, fy })` auf.
- **Ich → Verteiler:** Die Antwort kommt synchron, als reine Rechnung, bevor irgendetwas gebaut wird:
  ```
  { plan, umriss, zufahrten, belegt(x, z, r) → bool }
  ```
- **Verwendung beim Verteiler:**
  - `umriss` statt Kreis für die Platte; der Saum bleibt wie heute.
  - `zufahrten` als Anschlusspunkte für die Nachbarzellen und die Straße.
  - `belegt` als Sperrfläche für Bewuchs und Props; ersetzt das heutige `viertelVeg` mit Kreis.
- Den Bau übernimmt danach der vorhandene Lader `viertelLoader` mit Laden ab `near` und Freigeben ab `far`.

**Schalter:**
- `viertelgen=1` (nur zusammen mit `viertel=1`). Ohne den Schalter bleibt die feste Anordnung.
- `viertelsaat=<n>` zwingt eine Saat zum Prüfen.

**Prüfung:**
1. Node-Test über 200 Saaten. Er prüft: keine Überschneidung, jedes Gebäude an einer Straße, jeder Block mit Bordstein, Umriss geschlossen, Gebäudezahl im Rahmen, gleiche Saat ergibt den gleichen Plan.
2. Danach ein Beleg aus der Spielkamera.

## 2 · Gefängnis-Level, mein Teil

**Panoptikum:**
- Modell: `MeshyModels/_browser/prison_panopticon/PrisonPanopticon_B_simpler.glb`, mit KFB-Knete, Licht über das eine Rig.
- Sockel: ein Steinsockel aus Kit bzw. Asset-Suche, als einfache, saubere Grundform.
- Platz: in der Labyrinth-Mitte, das ist der Hof-Knoten `hub` aus `randomMaze`.

**Suchscheinwerfer:**
- Ein Kegel über `createLightCones(owner, { count: 1 })` aus `lightCone.js`, das eine Modul (V-632/V-1034). Er bekommt kein eigenes Licht.
- Der Kegel startet an der Lampe oben am Turm.
- Er wandert langsam über das Labyrinth, auf einem Pfad aus Rauschen, mit weichem An- und Abbremsen und kurzen Haltepunkten an Ecken.

**Treffer:**
- FB gilt als getroffen, wenn er im Kegel steht (Abstand zur Achse ≤ r0 + tan · t) und freie Sicht hat. Die Sicht prüft ein Strahl gegen die Mauerboxen.
- Ereignis `window.dispatchEvent(new CustomEvent('kfb:scheinwerfer', { detail: { art:'treffer'|'verloren', x, z, t } }))`, mit 0,3 s Nachlauf gegen Flackern. Das Muster `kfb:*` nutzt das Spiel schon.
- Was der Treffer im Spiel auslöst, gehört nicht zu meinem Teil.

**Raben bzw. Geier:**
- Deko: 6–10 Vögel kreisen um den Turm.
- Erst die Asset-Suche nach einem fertigen Modell mit Flugclip; der Clip bleibt unverändert, nichts von Hand animiert.
- Gibt es keines, nehme ich 2D-Sprites über das gemeinsame Modul, das sie zur Kamera dreht.

**Schnittstelle:**
```
createPanoptikum({ scene, mitte, radius, mauern, fbPos, groundAt }) → { update(dt), info(), dispose() }
```

**Schalter:** `gefaengnis=1`.

## Offen (WS0 entscheidet)

1. Wer baut das Labyrinth selbst? Ich nehme an: der Verteiler bzw. der Besitzer des Levels. Ich bekomme Mitte, Radius und Mauerboxen.
2. Obergrenze Gebäude je Viertel: Vorschlag 12, nach Messung im Slot.
3. Reicht das Ereignis `kfb:scheinwerfer`, oder gibt es einen anderen Ereigniskanal?
