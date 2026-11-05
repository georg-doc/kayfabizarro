# ÜBERGABE · WS-Design → WS1 · HyperNorm-Fassade, Aufprall, Zensurmasse · R1 · 05.11.

**Stand:** Georg 05.11.: „HyperNorm-Fassade ist PASS.“ Übergabe an WS1 **nur für die Kartenhäuser**. KayKit-Häuser bleiben im Original, das HyperNorm-Bild liegt auf ihnen nur hinter `kitfassade=1` (Georg: auf den 3D-Häusern „total buggy“). Ein eigenes Konzept für Kit-Häuser mit gerahmten Flächen folgt.
Alles läuft hinter Schaltern, ohne Schalter bleibt das Spiel wie bisher.

## 1 · Zweige (privates Repo)

| Zweig | Inhalt |
|---|---|
| `design/aufprall-r3` | Fassade (fassade=r2, Shot-Ring), Aufprall (Schramme, Ramm-Bresche), Risse (risse=r2), Zensurmasse und enthüllte Karte (zensur=1), Aufkleber und Slop-Plakate, Viertel-Lader-Fix, Vorfüllen und Vorwärmen der Fassade |
| `design/viertelgen-r1` | Viertel-Generator kfb.viertel/1 (nur Node, noch nicht in field.mjs) und Vorwärmen der Pop-ups (popupClayCore). Baut auf `design/kfbinsert-r1` auf |

Den Commit nennt WS0 mit der Abnahme. `src/private` ist in keinem Commit.

## 2 · Schalter (Hash)

| Schalter | Wirkung |
|---|---|
| `viertel=1` | Kartenviertel im Endlos-Spiel (wie bisher) |
| `fassade=r2` | Fassade der **Kartenhäuser** aus der einen H15-Engine:<br>– fester Weltmaßstab 7 m, um das Haus abgewickelt;<br>– Shot-Ring mit 16 Ebenen: nur PLATE ohne Post-Effekte, jeder Text und jedes Bild nur einmal, live jeder dritte passende Shot, beim Vorfüllen jeder zweite;<br>– je 7-m-Feld eine eigene Ebene, über das Viertel fortlaufend; Wiederholungen als anderer Ausschnitt;<br>– je Haus ein Wortfeld;<br>– Aufkleber und Slop-Plakate.<br>KayKit-Häuser bleiben original (Treffer und Löcher wirken weiter) |
| `kitfassade=1` | Legt das HyperNorm-Bild auch auf KayKit-Häuser (alter Stand, nicht für WS1) |
| `ringtest=1` | Prüfbild: jedes Feld in der Farbe seines Ring-Platzes |
| `risse=r2` | Risse aus Riss-Masken (cascade/r4/assets/risse-r1, Quellen in CREDITS.md) mit Puder-Hof, Ruß gedämpft |
| `zensur=1` | Aus der Bresche fällt Zensurmasse (Ink-Blobs) statt bunter Kugeln. Die Karte in der Bresche ist geschwärzt und wird mit `enthuellt` von oben frei |
| `enthuellt=<0..1>` | Prüfschalter: setzt den Wert fest (sonst aus `slops.ausbruch`) |
| `ebenen=0` | fassade=r2 ohne Shot-Ring (nur zum Messen) |
| `fassadetest=1` | Testbild statt H15 (Pfeil, LESEN, OBEN und UNTEN, Prüffarbe je Wand) |
| `h15res=2` | Nicht verwenden. Nur für die Messung, WS0 hat es abgelehnt (H15 malt auf dem Hauptfaden) |

## 3 · Haken für Ladebildschirm und Spiel

**Fassade, nur dynamisch über runtime.js laden.** Ein statischer Import von buildings.js aus dem Hauptbündel bringt die Chunk-Reihenfolge durcheinander, das Spiel startet dann nicht („Q is not a constructor“ in muzzle-fx).
```
const { fassadeVorfuellen, fassadeVorwaermen } = await import('<repo>/cascade/r4/runtime.js')
await fassadeVorfuellen({ gl: renderer, onFortschritt: (p) => { /* 0..1 */ } })   // Shot-Ring vorfüllen, höchstens 30 s
await fassadeVorwaermen({ renderer, camera, scene })                              // Fassaden-Shader gegen Lichter, Nebel, Schatten
```

**Pop-ups (design/viertelgen-r1):**
```
await popupClay.vorwaermen(renderer, camera, scene)   // dritter Wert scene ist Pflicht, sonst stimmen Licht-Varianten nicht
```

- **Reihenfolge:** Vorfüllen, dann Fassade vorwärmen, dann Pop-ups vorwärmen. Danach geht der Vorhang auf.
- **Ereignis:** `slops.ausbruch { id, n, bewohner, … }` über cueBus. Solange es noch keinen cueBus gibt, wird dasselbe als Fenster-Ereignis `kfb:slops.ausbruch` angenommen. Daraus folgt `enthuellt = min(1, (Slops + Blobs × 0,05) / Bewohner)`.
- Die H15-Engine bleibt stumm: kein AudioContext; mirror und kaleido sind gesperrt.

## 4 · Daten (ohne Code änderbar)

- `cascade/r4/assets/spill.r1.json`:
  - Beute: 40 Kugeln je Gebäude.
  - Zensur-Blobs: 24 je Gebäude, liegen 6 s, sinken 4 s ein, Rückprall 0,12.
  - Bewohner-Rückfall 4, Blob-Faktor 0,05.
- `cascade/r4/engine.js` `EBENEN`: Ring 16, ABSTAND 3 (live), VORFUELL_ABSTAND 2, Basen- und Schrift-Folge der Engine-Führung, Vorfüll-Takt 0,25, Vorfüllen höchstens 30 s.
- `cascade/r4/buildings.js` `FASSADE`: Bildbreite 7 m, Schatten höchstens auf 0,75.
- `cascade/r4/aufkleber.js`: `PLAKATE` (13 Golden Samples je Familie), `HIMMELSKOERPER` (15 Planeten und Monde), Größen.

## 5 · Tests

**Rein in Node:** wie in test/design/viertel-tests.mjs, die Liste `pure`:
- skycard-beat-gate, stroke-gate, skycard-outline-gate
- fracture-gate, wall-gate, props-gate, curb-gate, crater-gate, kit-gate
- cascade/r4-core, cascade/r4-curb
- dazu auf design/viertelgen-r1: viertel-gen-gate (200 Saaten)

**Im Spiel (Build mit KFB_SPLIT=1 --base=./, dann DIST=<Ordner>):**
- `test/design/fassade.mjs` mit `WARTE_S=60 HASH_EXTRA=fassade=r2,risse=r2` (+ `VORWAERMEN=1`)
  - Bilder: drei Häuser, 20-m-Fahrkamera, Ecke, Kit-Häuser.
  - Werte: Ring-Status, Programme bei Start, ready und ready+30 s, Bildzeit.
- `test/design/aufprall.mjs` mit `WARTE_S=60 HASH_EXTRA=fassade=r2`: Schramme aus 3,5 m und 9 m.
- `test/design/aufprall.mjs` mit `RAMM=1 HASH_EXTRA=fassade=r2,risse=r2,zensur=1,enthuellt=0|0.6`: Bresche, Zensurmasse nach 6 und 10 s, Karte.

**Zuletzt gemessen (Runde 5/6):**
- Programme nach ready: keine neuen (z. B. 150 → 150; das Vorwärmen nimmt 4 vorweg).
- Bildzeit in der Mitte 23,9–26,7 ms mit Ring bei ruhigem Rechner (Ziel 25 ms). Bei belastetem Rechner liegen auch ohne neue Fassade rund 95 ms vor; das ist kein Fassaden-Wert.

## 6 · Bekannte Grenzen

- **Grafikspeicher:** Shot-Ring etwa 33 MB (16 × 1024 × 512).
- **Kit-Häuser** werden beim Laden des Viertels vorgewärmt, nicht im Ladebildschirm, weil ihr Material im Modell steckt.
- **Straßenseite:** Das Wortfeld sitzt auf Wand 0 des Hauses. Mit dem Viertel-Generator kann es die echte Straßenseite aus dem Plan nehmen.
- **Ent-Zensur** (Treffer lässt einen Blob platzen, dann bunte Kugeln) wartet auf Flugs gooBlobMaterial und Goo-Platzen.
- **Schramme:** als Rinne (dunkler Grund, Lichtkante, Schatten, Normale aus dem Linien-Gefälle). Sie ist noch nicht abgenommen; offener Punkt.
- **Kit-Häuser mit HyperNorm:** neues Konzept mit gerahmten Flächen (Billboard, Leuchtkasten, Plakatwand, Schaufenster-Screen). Folgt erst als Bild mit Hub-Frage.
