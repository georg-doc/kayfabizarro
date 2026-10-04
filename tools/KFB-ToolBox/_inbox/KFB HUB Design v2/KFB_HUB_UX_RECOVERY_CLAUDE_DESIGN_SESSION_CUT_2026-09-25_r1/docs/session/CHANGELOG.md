# CHANGELOG · KFB Hub UX Recovery (Claude Design)

## 2026-09-25 · v2 eingecheckt · Resident-Overlay v1.1
- **Georg:** v2 reicht als Prototyp. Eingecheckt als **Kandidat v2** (`KFB Hub UX Recovery v2.dc.html` + `hub-recovery/resident-overlay.v1.js` v1.1). Kein Live.
- Overlay liegt jetzt sicher obenauf: `z-index 2147483000`, eigene Stacking-Isolation. Bühne 220×300 → 400×480, damit Sprünge/Würfe/Death nicht mehr am Canvasrand abgeschnitten werden (das war das „hinter einem Layer landen“).
- Nur die Figurfläche (150×230) fängt Klick und Ziehen; der Rest der Bühne lässt Klicks zum Hub durch.
- Kreis-Schatten ersetzt durch echten three.js-Schlagschatten: `DirectionalLight.castShadow` + unsichtbare `ShadowMaterial`-Bodenebene (Deckkraft 0,22), PCF-Soft. Licht steil von oben-vorne-links, Schatten fällt kurz nach hinten-rechts.
- Klick-Pool ohne `_Pose`, `Jump_Start`, `Jump_Land` (Standbilder/Teilstücke): 12 Clips bei FrizzleBob.

### Lessons
- Ein zu enges Canvas wirkt wie ein Ebenenfehler: die Figur verschwindet an einer unsichtbaren Kante. Bühne großzügig, Trefferfläche klein.

## 2026-09-25 · v2.1 · Ecken + Resident-Overlay
- Ecken leicht gerundet: Flächen und Buttons 4 → 8 px, Chips 3 → 6 px.
- Neu: Resident-Overlay (`hub-recovery/resident-overlay.v1.js`). Personen-Icon in der Kopfzeile schaltet es ein/aus, daneben ein Dropdown mit FrizzleBob · Driver Graft (Standard), GothGirl, Black Knight.
- Actor-Rezepte und Asset-Pin 1:1 aus dem Motion-Lab-Donor (`kaykit-motion-lab-v1/lab.mjs`, PIN `bdaea064`): FrizzleBob über `mountGraft(animation:'host')`, die anderen direkt als KayKit-GLB, Clips aus Rig_Medium/Rig_Large General + MovementBasic.
- Klick auf den Actor spielt einen zufälligen einmaligen Clip (12 bei FrizzleBob: Death, Hit, Interact, PickUp, Spawn, Throw, Use_Item, Jump_Full), danach zurück in Idle_A. Ziehen verschiebt, Position in `kfb.hub.resident.pos.v1`, An/Aus + Actor in `kfb.hub.resident.v1`.
- Prüfgriff `window.__KFB_HUB_RESIDENT__` (actor, clip, clips, ready, random, play).
- Resident-Atlas-Szenen als Komplettpaket sind noch nicht angebunden.

### Lessons
- three.js-Addons importieren `three` als bare specifier; ohne Importmap im DC über esm.sh laden, dann teilen Kern und Loader dieselbe Instanz. Die Graft-Module bekommen THREE injiziert und brauchen keine Importmap.
- WebGL-Canvas erscheint in DOM-Screenshots eingefroren; Clip-Wechsel über den Prüfgriff belegen.

## 2026-09-25 · v2 · Lesbarkeits-Pass (Georg-Feedback)
- Feedback: zu kleinteilig, kaum lesbar, schwarze Blöcke schwer, Karo-Raster weg, Standardaktionen als Icons.
- Grundschrift 13 → 15 px, Titel 16–19 px, Abschnitte 21 px, Metadaten min. 13 px. Mono-Chips durch lesbare Sans-Chips ersetzt.
- Papier-Raster entfernt. Muted-Farbe dunkler (#5f584d) für Kontrast.
- Keine gefüllten schwarzen Buttons mehr: Hauptaktionen als Umriss (Rot = prüfen, Grün = speichern/kopieren), Tabs als Unterstreichung.
- Startnachricht kopieren, Brief, PR, Prüfseite, Entscheidung öffnen, Download, Löschen, Theme: Icon-Buttons mit Tooltip + aria-label (Lucide-Pfade, 38–44 px Trefferfläche).
- Zeilen in Läuft/Kann starten: höchstens drei Icons (kopieren, Hauptlink, entscheiden); alle Links im aufgeklappten Detail.
- Frische-Hinweis nur noch, wenn nicht „Aktuell geprüft“. Commit/Hash in den Tooltip des Zeitstempels verschoben.
- Rechte Spalte 380 px, einspaltig unter 1100 px.

## 2026-09-25 · v1 · erster Kandidat
- Donor dfaafac0 isoliert belegt (`Hub Donor Proof v2.dc.html`), Donor-Defekt gefunden (Kopfzeilen-Links unsichtbar).
- Kandidat liest `registry/production/v1` live, Fallback eingebaut, Reload mit vier Zuständen.
- Heute, Briefings (v3-Katalog), Projekte, Entscheidungen, Archiv als Hash-Routen.
- PASS/TUNE/HOLD/DONE/MISSING + Notiz, lokal, Sync-Paket `kfb.hub-decision/1`.
- Pocket Inbox mit Donor-IndexedDB.
- Befund: zu kleinteilig (Georg) → v2.

### Lessons
- Donor-„Prominenz“ vor dem Übernehmen im Render prüfen, nicht im Markup: der ToolBox-Link stand im HTML, war aber per CSS versteckt.
- Iframes erscheinen nicht in DOM-Screenshots. Breitenbelege für den Kandidaten kommen aus seiner eigenen Breitenlogik (Root-Breite), der Donor-Beleg aus echten Iframes im Browser.
