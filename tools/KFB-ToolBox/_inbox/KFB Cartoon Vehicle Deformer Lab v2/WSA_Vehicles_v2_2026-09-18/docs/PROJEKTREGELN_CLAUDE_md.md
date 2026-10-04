# Projektregeln (Kopie von CLAUDE.md)

# Projekt-Notizen · KFB Animation Lab

## Wissensbasis · Modelle, Rigs und Requisiten

**Asset Librarian (KFB):**
<https://asset-librarian-v1-2-site-co.kayfabizarro.pages.dev/tools/asset_registry/librarian/>

Erste Anlaufstelle, wenn ein Modell, ein Rig oder eine Requisite gebraucht wird — **vor** dem
Nachbauen und vor dem Suchen im Repo. Kontext und Quellstand:
<https://github.com/georg-doc/kayfabizarro/tree/main/travel/wip/travel_globe_wsa/_inbox/DC%20MicroLearning%20WS1>

Registry im Repo: `registry/assets/v1`, Werkzeuge in `tools/asset_registry`, Modelle unter
`media/3D_Assets` (siehe `github.md`).

**Regel aus Erfahrung:** Verzeichnislisten zeigen `.gltf`/`.glb` nicht zuverlässig. Ob ein Modell
vorhanden ist, wird über eine Byte-Abfrage auf den Pfad geprüft, nie über eine Ordneransicht.
Und bevor ein Modul als »fehlt« gilt, wird nach seinem **Aufrufer** gesucht, nicht nach der Datei.

## Stand dieser Linie

`LIVING_RIGGING.md` ist das eine Stand-Dokument der Rigging-Linie. Ein frischer Chat liest zuerst
das, dann diese Datei. `ONBOARDING_frischer_chat.md` und `POSTMORTEM_carlrig_v4_16B.md` sind Archiv.

## Arbeitsweise

- Gemessen statt geraten: Anker, Größen und Farben werden am Modell oder an der Bildtafel
  abgelesen. Eine Zahl ohne Messung kommt nicht ins Rig.
- Die WS0-Module unter `lab-v2/vendor/` bleiben **unberührt**. Änderungen leben daneben
  (`lab-v6/…`, Unterklasse oder eigene Fassung), nie in der Vendor-Datei.
- Neue Fassung eines Moduls heißt `.vN.js`. Eine überschriebene Datei bleibt im Zwischenspeicher
  des Browsers liegen und die Seite läuft still mit der alten.
- Für alles in der 3D-Bühne gilt nur eine echte Pixelaufnahme; ein DOM-Nachzeichner bildet WebGL
  nicht ab und hält auch keinen Scroll-Stand.
