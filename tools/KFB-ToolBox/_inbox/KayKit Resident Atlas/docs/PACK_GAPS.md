# Pack-Lücken · was in den Screenshots steht und was wir wirklich haben

Stand 2026-09-16. Grundlage: Ordner in `georg-doc/kayfabizarro/media/3D_Assets/` (gelesen, nicht erinnert),
die Asset-Registry und die Promo-/Demo-Screenshots im `reference`-Ordner.

## 1 · Nutzbar im Repo (entpackt, Dateien da)

| Pack | Stand | Modul |
|---|---|---|
| KayKit Dungeon Pack 1.1 FREE | 207 Modelle, gltf | 4 |
| KayKit City Builder Bits 1.0 FREE | 41 Modelle, gltf | 2 |
| KayKit BoardGame Bits 1.0 FREE | 162 Modelle | Props, kein Raster |
| KayKit Block Bits / Fantasy Weapons / RPG Tools / Halloween / Forest Nature | indexiert | – |
| KayKit Adventurers, Skeletons, Mystery Series 6 + 7 | indexiert | – |
| Kenney City Kit (roads / commercial / suburban / industrial) | glb | 1 |
| Kenney Racing Kit | 112 Modelle, glb | 1 |

## 2 · In den Screenshots zu sehen, im Repo **gar nicht vorhanden**

Diese Packs tauchen in den Promo-/Bundle-Bildern auf, es liegt aber kein Ordner in `media/3D_Assets/`:

- **Space Base Bits** (Screenshot „BITS BUNDLE 1 · SPACE BASE BITS", inkl. „+ ALTERNATE TEXTURE") — kein Pack-Ordner, keine Registry-Einträge.
- **Resource Bits** — nur Referenzbilder, kein Pack.
- **Medieval Hexagon Pack** — nur Referenzbilder/ZIP-Historie, kein entpackter Ordner.
- **Holiday Bits** (CC0-Release Dez 2025, 55+ Modelle) — kein Pack.
- ~~**Mixed Bag 1**~~ — **WIDERRUFEN (S28).** Ich hatte hier gemeldet, der Pack sei "ohne Modelle eingecheckt, 0 von 7 Dateien". Das war falsch und der Fehler lag bei mir: die Baumansicht des Repos listet nur Dateien, die sie für importierbar hält, und filtert `.gltf`/`.bin` weg. Ich habe dem Filterergebnis geglaubt statt dem Pfad. Über eine Inhaltssuche gezählt liegen unter `KayKit_Mixed_Bag_1_FREE/Assets/gltf/` **41 glTF-Dateien** — Arcade, Zirkuszelt, Regenschirme, Comicboxen, Rollschuhe, Puzzlewürfel, Kamera, Taco, Feuerhydrant, Holzofen, und die zwei E-Gitarren `guitar_A` / `guitar_B`. Der Pack ist voll nutzbar.

  **Verfahrensregel daraus:** ein Werkzeug, das "nichts gefunden" meldet, hat nicht "nichts da" gemessen — nur "nichts, was ich zeige". Pack-Inhalt wird ab jetzt über eine Inhaltssuche (`"generator" : "Khronos glTF`) gezählt, nicht über eine Dateiliste.
- **Restaurant Bits, Prototype Bits, Furniture Bits** — released, kein Pack.
- **Medieval Village (Exteriors / Interiors / Villagers)** — beim Autor noch in Arbeit, gibt es öffentlich noch nicht.

→ Für 1:1-Nachbauten dieser Screenshots fehlt schlicht die Geometrie. Entweder Pack beschaffen und entpackt einchecken, oder mit Kenney-Äquivalenten arbeiten (Space Base → `SciFI_Ultimate Space Kit_Quaternius`, Hexagon → `kenney_hexagon-kit` / `GLB_hexagon_kit`).

## 3 · EXTRA- / PAID-Tier · im FREE-Pack systematisch nicht enthalten

KayKit liefert pro Pack drei Stufen: **FREE** (CC0-Kern), **EXTRA** (Zusatzmodelle), **SOURCE** (Blender-Dateien).
Was in den Bundle-Promos zu sehen ist, stammt oft aus EXTRA.

### City Builder Bits
FREE hat 41 Teile: Basisplatte, 6 Straßenteile, 8 Gebäude (je mit und ohne Basis), Wasserturm, Straßenlaterne, 3 Ampeln, Bank, Busch, Kisten, Container, Hydrant, 2 Mülleimer, 5 Autos.
Im Bundle-Promo (Parkszene) zu sehen und **nicht** im FREE-Pack:
- Bäume (FREE hat nur `bush`), Hecken, Blumenbeete
- Parkwege, Rasenflächen, Teich/Brunnen
- geschwungene Bordsteine/Randeinfassungen für Parkflächen
- zusätzliche Fassaden-/Stockwerksteile für höhere Häuser

### Dungeon Pack
FREE deckt die Key-Art ab. EXTRA ergänzt weitere Props/Varianten — für den Nachbau der Key-Art nicht nötig.

### Platformer (Screenshot „EXTRA ONLY", blaue Hindernisbahn)
Komplett EXTRA-Tier. Im Repo liegt nur `Platformer Game Kit - Dec 2021` (anderer Ursprung, 113 Modelle) — **nicht** dieselbe Bahn. Ein 1:1 dieses Screenshots ist ohne EXTRA-Kauf nicht möglich.

### Holiday Bits
Kern-Pack ist CC0/FREE, EXTRA ergänzt 30+ Lebkuchen-Teile. Beides fehlt im Repo.

## 4 · Konsequenz für die Sprints

- **Texturen ohne Geometrie sind kein Pack.** Mixed Bag 1 ist der erste Fall, in dem ein Ordner existiert und trotzdem nichts baubar ist — ein Ordnername im Repo ist also kein Beleg. Geprüft wird auf Modelldateien, nicht auf Anwesenheit.
- Nachbaubar **heute**: Dungeon Key-Art (S1 ✓), Kenney-Straßenraster (S2 ✓), Racing-Strecken (S3 ✓), City Builder Sample (S4 ✓).
- Nachbaubar **nach Entpacken/Einchecken**: alles unter Punkt 2.
- Nicht nachbaubar ohne Kauf: die EXTRA-Inhalte unter Punkt 3 — dort ersetzen wir bewusst mit Kenney/Quaternius statt so zu tun, als hätten wir sie.
