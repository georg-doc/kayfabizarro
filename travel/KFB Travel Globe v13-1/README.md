# KFB Travel Globe v13 · Export mit voller Codebasis (2026-09-09)

Kein Session-Export im engen Sinn: **in dieser Sitzung wurde an v13 nichts geändert.** Was hier
liegt, ist der Stand vom 03.09. vollständig — Codebasis, Doku, Wirt — damit v13 unabhängig vom
Projekt weiterarbeitbar ist.

```
KFB Travel Globe v13.dc.html      der Wirt, Einstiegspunkt
globe-v13/                        90 Dateien · 1.725 kB Quelltext
docs/                             10 Dokumente
github.md                         Repo-Bindung + Sync-Stand
```

---

## Was v13 ist

Der **andere Ansatz** zum Travel-Modus: keine Höhenfeld-Kachelwelt wie die terrain-Linie, sondern
eine **geschlossene Kugel mit gekrümmtem Horizont**. Vorbild und Messlatte ist
`dannylimanseta/tinyskies` — ein Mehrspieler-Flugspiel auf einer Kugel. Übernommen werden dort
**Raten und Verhältnisse, nie Absolutwerte** (tinyskies rechnet auf Weltradius 5); jede Abweichung
von der Quelle ist im Code deklariert. Der Lesebericht dazu ist `docs/TS-DELTA-v12.md`.

v13 selbst ist ein Zweig aus v12: Contrails als Comic-Speedlines, Cartoon-Trägheit, Standbild vor
dem Anflug.

| Modul | Rolle |
|---|---|
| `globe-poc.js` (366 kB) | der Wirt der Kugelwelt. Größte Datei des Projekts. |
| `globe.js` (71 kB) | die Kugel selbst, Shader zeichengleich mit `tinyskies/Globe.ts` |
| `portal.js` (73 kB) | Weltportale · braucht `rift.png` (liegt lokal, 78 kB) |
| `globe-landmarks.js` (53 kB) · `sky-cards.js` (43 kB) · `sky-enemies.js` (39 kB) · `sky-dice.js` (38 kB) | Welt und Kampf |
| `contrails.js` · `pet-traegheit.js` | **neu in v13**, je mit Panel-Tor |

---

## Doku im Paket

| Datei | wofür |
|---|---|
| `ONBOARDING_v13_frischer-Chat.md` | **hier anfangen**, wenn die Vorgeschichte fehlt |
| `CHANGELOG_v13.md` · `CHANGELOG_v12.md` | jede Änderung mit Nummer |
| `SPRINTPLAN_v14_frischer-Chat.md` | der geplante nächste Schritt |
| `TS-DELTA-v12.md` | was aus tinyskies übernommen, abgewandelt, gelassen wurde |
| `WIRT_v13.md` | der Wirt und seine Verträge |
| `LIVING_KFB-Travel-Globe.md` | das living document der Globe-Linie |
| `QUELLE_tinyskies-Inventar.md` | die gelesenen Quelldateien |
| `BACKLOG_globe.md` | offene Punkte |

---

## Assets und Pfade

Alles Schwere (GLB, Audio, Texturen, Kartenblätter) läuft zur Laufzeit über die kanonischen
RAW-URLs aus `georg-doc/kayfabizarro`. **Eine Ausnahme:** `globe-v13/rift.png` (78 kB) liegt lokal,
weil die Datei aus tinyskies stammt (`client/public/2D/rift.png`) und keine kanonische KFB-URL hat.
Sie ist unter dem Budget und bleibt drin — Upload-Kandidat, falls sie ins Repo soll.

Die drei lokalen JSON (`auswahl-georg.json`, `flora-auswahl.json`, `jukebox.json`, `sfx.json`) sind
klein und gehören zum Code, nicht zu den Medien.

---

## Standalone

`export/kfb-travel-globe-v13_2026-09-03/KFB_Travel_Globe_v13_STANDALONE.html` — 2,5 MB, am 03.09.
gebaut **und geprüft** (110 fps, 37 Szenenknoten, 87 Module, 0 Boot-Fehler). Die Datei liegt nicht
in diesem Paket, weil sie den v13-Stand vom 03.09. trägt und separat abgelegt ist.

Bauweise, falls sie neu gebaut werden muss: **Blob-Kette plus Import-Map**. Ein Standardbündler
faltet den Einstieg in einen einzigen `blob:`-Modulblob, und eine Blob-URL ist keine hierarchische
Basis — jeder `./x.js`-Spezifizierer scheitert dann beim Parsen, und `globe-poc.js` beginnt mit 87
davon. Der funktionierende Weg schreibt relative Spezifizierer auf bare keys (`kfb:pfad`) um und
erzeugt beim Start je Quelle einen eigenen Blob plus **eine** Importmap.
