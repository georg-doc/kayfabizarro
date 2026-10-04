# LIVING · KFB Travel Globe

**Additive Chronik der Travel-Globe-Linie ab dem Re-home.** Aeltere Eintraege werden nicht
umgeschrieben, damit der jeweils aktuelle Plan unvermeidlich aussieht. Die Chronik des v13-Stands
selbst liegt daneben in `docs/v13/LIVING_KFB-Travel-Globe.md` (ARCHIVED HISTORY, unveraendert).

---

## 2026-09-13 · R0 Re-home · TESTED RESULT

**Eingang:** Handover-Paket `KFB_TRAVEL_GLOBE_REHOME_WS0_HANDOVER_2026-09-13` (11 Dokumente),
Arbeitsstand `KFB Travel Globe v13.dc.html` im WS0-Workspace.

**Gemessen**
- Import-Graph vom Einstieg: **87 Module**, 1.786.736 B Quelltext, **0 fehlende Dateien**.
- Davon **7 ausserhalb `globe-v13/`**: `terrain-planets-v1/{card-carrier,card-registry,kfb-pets}.js`,
  `cardbuilder/kfb-card-format.js`, `modules/kfb-mech-combat.js`, `kfb-cartoon-deform.js`,
  `kfb-deform-instanced.js`.
- Nicht-JS: `support.js`, zwei Themes, `asset-repo.json` (335 kB), vier lokale JSON,
  `card-grids.json`, `kfb-index.json`, `rift.png`.
- Kaltstart des kopierten Baums: **0 Boot-Fehler, 0 HTTP ≥ 400**, 97 lokale Ressourcen, alle
  unterhalb `travel/`, WebGL 2.0.
- Remote im Bootlauf: 140× `raw.githubusercontent.com`, 10× jsDelivr, 2× unpkg (Host-React), 1× Fonts.
- `globe-v13/` enthaelt **84 JS**, davon **80 im Graphen**; vier Werkzeugdateien haengen am Einstieg nicht.

**Was sich geaendert hat**
Nichts am Verhalten. Nur Ort: ein geschlossener Baum `rehome-r0/travel/` plus Doku.

**Der eigentliche Befund**
`export-globe-v13/` (09.09./10.09.) war als **Quellbaum nicht geschlossen** — die sieben externen
Module, beide Themes, `support.js` und `asset-repo.json` fehlten. Lauffaehig war nur die
gebuendelte STANDALONE-Datei, weil der Buendler sie aus dem Workspace mitgefaltet hat. Ein
gruenes Buendel hat die Luecke im Quellbaum also **verdeckt**. Das ist derselbe Fehlertyp wie
`rift.png` am 10.09.: es lief, also wurde nicht gefragt, woraus.

**Beleg:** `travel/QA/R0_coldstart.png`, `travel/QA/R0_QA.md`, `docs/REHOME_DEPENDENCY_CLOSURE.md`.

**Rueckweg:** Das Paket ist eine Kopie. `KFB Travel Globe v13.dc.html` und `globe-v13/` im
Workspace sind unberuehrt; `rehome-r0/` loeschen stellt den Zustand vor R0 her.

**Offen**
1. `rift.png` im Bootfenster nicht angefordert — Portal-Anflug fehlt als Beweis.
2. `@main` als Asset-Referenz ist beweglich; der Baseline fehlt eine feste Asset-Revision.
3. `sourceRevision` offen bis zum Push nach `georg-doc/KFB-Travel-Globe`.
4. QA-Zeilen 8–15 brauchen eine Tastatur im normalen Browser.

**Naechste Frage**
Nicht „welche Scheibe", sondern: **laeuft dieser Baum bei Georg im normalen Browser genauso?**
Erst danach R1 (FrizzleBob Driver Graft auf der Karte).
