# Onboarding · Rigging Lab in dieses Projekt holen + FB mit Carls Nase/Braue
*Geschrieben im FrankenStein-Studio-Projekt, 13.09.2026 — für einen frischen Opus-Chat GENAU HIER
im Projekt (nicht extern). Ziel laut Georg: Rig, Studio und Animation in einem Projekt, Updates
danach über die `/session-export`-Skill an die Spiele (KFB/DocCheck), nicht als Projekt-Export.*

## Was in dieser Sitzung schon gebaut ist — nicht neu bauen
In `KFB FrankenStein Studio v16.dc.html`, Abschnitt „Waffe · Handbetrieb":
- **Waffen-Default = Georgs eigene Kalibrierung.** Er hat den Regler benutzt und in seinem
  Kontrakt gespeichert (`kfb-pet-graft-driver.json`, `pets[0].graft.weapon`):
  `ex:-14, ey:77, ez:0, ox:0, oy:-0.03, oz:0, scale:0.37`. Das ist jetzt `_weaponDefaults()`,
  nicht mehr Null.
- **Waffen-Materialzonen.** `_weaponMatNames()` liest die Materialnamen der geladenen
  `Character_Gun.gltf`, `_weaponColorSet(name, hex)` färbt sie einzeln, `matColors` geht mit in
  die `kfb.weapon-handoff.v1`-Abgabe. Eigene Material-Kopien beim Mount (`__weaponMatClone`) —
  das Original im Cache bleibt unberührt, „Original"-Knopf je Zone geht zurück.

## Die drei offenen Aufträge

### 1 · KFB Rigging Lab v1 hierher holen
Georgs Wunsch: **1:1 kopieren**, aber „1:1" heißt hier *funktionsgleich*, nicht *jede Datei* — der
lokale Ordner trägt 316 Dateien, die meisten davon Beweisbilder und Archivstände, die CLAUDE.md
dieses Projekts ausdrücklich ausschließt („Keine Binärdateien, keine captures/-Halden").

**Mitnehmen** (das, was die Rigging-Linie heute trägt, laut `LIVING_RIGGING.md`):
- `KFB Rigging Lab v1.dc.html` (Einstieg)
- `lab-v6/*.js` — `partrig.v1.js`, `inkform.v1.js`, `brow.v3.js`, `stache.v3.js`,
  `zonenames.v4.js`, `texclean.js` (alles Carls eigene Arbeit dieser Linie)
- `lab-v4/carlrig.js` (Rig-Kern: `splitIslands`, `flattenRecesses`, `partsInsideBoxes`, `buildFace`)
- `lab-v2/audit.js`, `lab-v2/sources.js` (Laden, Inselerkennung, gepinnte Quelle — von `carlrig.js`
  gebraucht, existieren noch nicht in diesem Projekt)
- `LIVING_RIGGING.md`, `CLAUDE.md`, `github.md` als Referenz

**Nicht mitnehmen, mit Grund:**
- `lab-v2/vendor/petstudio-v9/studio-v12/…` — das ist eine gepinnte Kopie von Dateien, die in
  DIESEM Projekt bereits unter `petstudio-v9/studio-v12/` liegen (`pet-eye-rig.v6`, `brow-rig.v2`,
  `pet-nose.v2`, `pet-moustache.v1`). Die Importe in `lab-v6/*.js` müssen auf den hiesigen Pfad
  umgebogen werden, statt eine zweite Kopie zu ziehen — sonst gibt es zwei Wahrheiten.
- `screenshots/`, `uploads/`, `export/`, `lab/`, `lab-v3/`, `handoff/`, `clipschau-v1/`,
  `templates/`, `data/` — Archiv, Beweisbilder, überholte Vorläufer (v1–v3 sind laut
  `LIVING_RIGGING.md` durch v4/v6 abgelöst). Bleiben im lokalen Ordner, falls später ein Beleg
  gebraucht wird.
- `KFB FrankenStein Studio 16B.dc.html`, `16B-FAILED.md`, `v4-FAILED.md`,
  `POSTMORTEM_carlrig_v4_16B.md` — dokumentierte Irrwege, als Lehre in `LIVING_RIGGING.md` schon
  zusammengefasst, nicht als Code mitnehmen.

**Nach dem Kopieren:** `KFB Rigging Lab v1.dc.html` bekommt eine eigene Seite im Dropdown dieses
Projekts (wie `KFB FrankenStein Studio v16` und `KFB Mech & Vehicle Rig v2` nebeneinander stehen).

### 2 · CapsuleCarl als Actor ins Studio
Zwei Verträge stehen nebeneinander und sind NICHT dieselbe Form:
- `kfb.pets/1` (dieses Studio, `kfb-pet-graft-driver.json`) — Pets/Bipeds mit `graft`, `pose`,
  `cardRider`, `mouth`, `nose`, `brow` als flache Felder.
- `kfb.carl.rig/6` (Rigging Lab, `kfb-carl-rig-v6.json`) — eigene Form: `eye`, `mouth`, `mouthSet`,
  `moustache`, `brow.mod`, `nose.mod`, `zones[]` als Index-Array (Inselnummer implizit).

**Das ist eine Entscheidung, keine Messung** (steht so auch in `LIVING_RIGGING.md`): entweder Carl
bekommt einen eigenen `kind` im Studio-Roster (wie „Graft" und die Kenney-Pets eigene `module`-Werte
haben) und sein Vertrag wird beim Import in `kfb.pets/1`-Form übersetzt (Index-Zonen → benannte
Felder), oder das Studio lernt, Carls Form direkt zu lesen. Empfehlung: **übersetzen, nicht
zweigleisig fahren** — sonst pflegt das Studio zwei Export-Pfade.

### 3 · Carls Nase + Block-Braue auf FB graften — NICHT „für alle Rigs" verallgemeinern
Georgs Wunsch, wörtlich: „die Nasen-Alternative und die Block-Augenbrauen des Original-Meshes
würde ich gerne als Optionen für Nase und Augenbrauen ALLEN Charaktern/Rigs zur Verfügung stellen."

**Der eine Fund, der die Reihenfolge bestimmt** (`LIVING_RIGGING.md`, Abschnitt „Offen"): *„Die
Teile-Suche ist an Carl geprüft, nicht an anderen Figuren … eine Figur ohne Original-Brauen oder
-Nase liefert `null` — dann fehlt der Stand in der Auswahl."* `PartRig` (lab-v6/partrig.v1.js)
findet Carls Brauen/Nase über ihre **Lage im Netz** (vorn am Kopf, über der Augenlinie, beidseitig
für die Braue; auf der Mittelachse für die Nase) — das ist eine Eigenschaft von CARLS Mesh, nicht
von FB oder vom KayKit-Driver. FB hat keine „Original-Nase" in diesem Sinn (sein Kopf ist eine
Graft-Übernahme, siehe `headgraft.v1.js`), der KayKit-Driver auch nicht.

**Also nicht:** `PartRig` generisch auf jedes Rig loslassen und hoffen, dass es was findet.
**Sondern:** Carls Nase (Insel #6, gemessen 0,131×0,151×0,334, Mitte 0/1,3/0,622) und Braue
(Inseln #7/#8, je 0,300×0,166×0,235, Mitten ±0,222/1,519/0,406) sind **Carls Geometrie** — sie
werden wie FrizzleBobs Kopf beim Driver-Graft (`headgraft.v1.js`) als **Spender-Teile
herausgeschnitten und auf den Zielkopf gegraftet**, nicht am Zielrig neu gesucht. Das macht sie zu
einer dritten Mod-Option NEBEN FBs vorhandenem Nose-/Brow-Rig (`pet-nose.v2.js` /
`brow-rig.v2.js`), auswählbar wie `line`/`tube`/`block` es bei Carl schon sind — aber als
gegraftete Fremdteile, nicht als neu gerechnete Form.

**Rezept, aus dem bestehenden Graft-Verfahren übernommen** (`frizzlegraft-v1/headgraft.v1.js` ist
die Vorlage, nicht neu erfunden):
1. Carls Nase/Brauen-Inseln aus `player.gltf` schneiden (derselbe Schnitt, den `carlrig.js`
   `splitIslands` schon liefert — Inseln #6/#7/#8 sind bekannt, s.o.).
2. Am Zielkopf (FB) einen Anker messen — wo auf FBs Gesicht sitzt „Nasenmitte", wo „Augenlinie"?
   FB hat dafür schon `facehost.v1.js`/`eyeoval.v1.js`-Anker; wiederverwenden, nicht neu suchen.
3. Carls Teile auf diesen Anker skalieren/versetzen (dieselbe `PartRig`-Mechanik — sichtbar
   schalten, um die EIGENE Mitte skalieren/verschieben/kippen — funktioniert unabhängig vom Wirt,
   sobald die Zielmitte gemessen statt geraten ist).
4. Als Mod-Eintrag `nose.mod = 'carl-original'` / `brow.mod = 'carl-original'` neben den
   bestehenden Optionen anbieten — Testfall laut Georg: **FB mit Carls Nase und Augenbrauen.**

## Reihenfolge
1. Rigging Lab v1 kopieren (Abschnitt 1), Importe auf `petstudio-v9/studio-v12/` umbiegen, einmal
   laden und prüfen, dass Carl unverändert steht (Kontrollprobe: dasselbe Bild wie
   `screenshots/v6-01-boot.png` im Quellordner).
2. Carl-Vertrag → `kfb.pets/1`-Übersetzung schreiben (Abschnitt 2) — Voraussetzung dafür, dass
   Carl im selben Roster wie FB und der Driver auftaucht.
3. Nase/Braue-Graft (Abschnitt 3), Testfall FB + Carls Teile, ein Bild als Beleg.
4. `/session-export` fahren (Skill ist an dieses Projekt angehängt) — Manifest zuerst, Georgs Okay
   abwarten, dann erst der Export für die Spiele.

## Bereits bezahlte Fallen (aus `LIVING_RIGGING.md`, nicht neu treffen)
- **R9 — nie die erste gefundene Mulde/Insel nehmen, immer die mit dem stärksten Maß** (tiefste
  Mulde bei `flattenRecesses`, nicht `flattened[0]`).
- **R18 — eine gemessene Form wird gegraftet, nicht angenähert.** Der erste Block-Brauen-Versuch
  baute einen 774-Punkte-Schlauch statt Carls echte Braue zu benutzen — genau der Fehler, den
  dieser Auftrag (Abschnitt 3) vermeiden muss.
- **R19 — eine Shader-Maske schließt keine Form**, ein Verwurf nimmt nur Pixel weg. Gilt nur für
  `inkform`-Schläuche (Braue/Bart-Formen mit Lücke), nicht für den PartRig-Graft.
- **Vendor-Regel:** WS0-Module (`petstudio-v9/studio-v12/*`) werden nie direkt geändert — neue
  Fassung als Unterklasse/eigenes Modul daneben, wie `brow.v3.js` es mit `BrowRig` schon vormacht.
- **Ein verändertes Modul bekommt einen neuen Dateinamen** (`.vN.js`) — sonst hängt der
  Browser-Cache an der alten Fassung, ohne dass es auffällt.

## Wo was liegt
Lokal (nur lesbar, nicht Teil dieses Projekts): `KFB Rigging Lab v1/` — `LIVING_RIGGING.md` zuerst,
dann `CLAUDE.md`. Hier im Projekt: `KFB FrankenStein Studio v16.dc.html` (Waffen-Regler fertig,
s.o.), `petstudio-v9/studio-v12/` (die Vendor-Module, auf die die Rigging-Lab-Importe zeigen
sollen), `frizzlegraft-v1/headgraft.v1.js` (die Graft-Vorlage für Abschnitt 3).
