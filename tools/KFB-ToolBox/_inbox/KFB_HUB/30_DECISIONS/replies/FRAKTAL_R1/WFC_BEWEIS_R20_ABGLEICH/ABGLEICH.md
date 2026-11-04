# Abgleich Dropbox ↔ Pop-up-Katalog · 04.11.2026

Durchsucht wurde „KFB Claymation Reference“ mit allen Unterordnern. Darin liegen „KFB Claymation PopUps“ (unter „KFB Popup Assets“), die frühen Ink-Blob-Bögen und die Kings+Queens-Bögen. Grundlage ist `ingest_popups.py`, die Regeln stehen in `popup_regeln.r1.json`.

**Zahlen**
- 704 Bild- und Zip-Dateien gefunden. 367 davon sind von vornherein ausgeschlossen, siehe unten.
- Aus dem Rest (samt entpackten Zips) kamen 560 Bilddateien, 179 davon sind Datei-Dubletten.
- 840 Stücke sind schon im Katalog. Das betrifft auch alles aus „KFB Claymation PopUps“ (Wahrzeichen, Azteken, Baumgeister, Statuen) und die frühen Ink-Blob- und Kings+Queens-Bögen.
- 36 Stücke sind neu aufgenommen:
  - Dschungel-Dioramen (4)
  - fleischfressende Pflanzen (4)
  - Welt-Dioramen (7)
  - Sci-Fi-Dioramen (8)
  - Fantasie- und RPG-Dioramen (7)
  - Pilzwelten und Pilzgestalten (6)
- 27 Fast-Dubletten bewusst weggelassen: Neu-Renderings desselben Motivs, etwa die Wahrzeichen-Bögen zu den Wahrzeichen-Einzelbildern. Sie stehen in `weg` in den Regeln.
- 0 nicht machbar: Es gibt keinen Bogen, dessen Motive nur in nicht freistellbarer Fassung vorliegen.

**Ausgeschlossen, mit Grund**
- **HUD, UI, Radios, 9-Slice:** gehen an die Kartenkante. Betroffen sind die UI-Atlanten in „KFB Claymation Scenes + HUD“, „KFB Radios“, die Satelliten- und Röhren-Skins und der Steampunk-HUD-Baukasten.
- **Fluff-Sprites** (24 Zustände, Spray-Tropfen): gehen an die Kartenkante.
- **VFX:** „KFB Impact + Splatter VFX“.
- **Insel- und Konzeptbilder, Stil-Studien:** schwebende Inseln, DioramaScenes A–I, Vulkanfestung, Maze-Insel, Concept-Sheets, Coconimo, Mesa-Design.
- **Innenräume ohne freistellbaren Fuß:** Dystopia (2), KFB Akashic Library (3), OkkultStudio (2).
- **Rennstrecken, Straßen, Fahrzeuge:** Race Track Builder, Race track details, country roads, island city streets, Bath Vehicle.
- **V-708-Wahrzeichen als 2D-Aufsteller** (WS0 03.11.): Hollywood/LA- und Paris-1950-Bögen sowie die Pariser Werbetafeln in „KFB Popup Assets“.
- **Vorschauen und Prüfbilder:** _64px, _96px, QA, contact, PREVIEW, Quellbögen in Zips mit Einzelbildern.

**Keying-Fälle**
Nachliefern muss Georg nichts. Drei Bögen haben einen Grund in der Farbe der Motive. Ihre Motive sind trotzdem sauber im Katalog, weil sie aus anderen Bögen oder Zips kommen:
- „Historische Monsterhelden im Claylook“ (MixedBag 05)
- „Philosophie-Schatztruhen im Weisheitsraster“ (MixedBag 05)
- `kfb_clay_treasure_chests_12_sprites`: aus einem Bogen ohne Alpha geschnitten, mit Resten der Nachbarn
