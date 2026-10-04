# HANDOVER & ONBOARDING — KFB Travel v16
Stand **2026-08-12**. **§A ist das Onboarding für einen frischen Chat**, §B der Diff für Coworker,
§C das Testen, §D die Nähte. Wer nur eine Sache liest, liest §A.

---

## §A · Onboarding — was ein frischer Chat wissen muss

### A1 Was hier läuft
**`index.html`** ist die Betriebsfassung (GitHub Pages, Vollbild, Performance-Messung).
**`KFB Travel v16.dc.html`** ist dieselbe Welt im Design-Werkzeug. Beide laden denselben Code aus
`terrain-v16/` (57 Module) — es gibt **keine** zweite Fassung des Spiels.

Es ist ein three.js-Spiel (0.160, WebGL): ein **Kartenblatt als fliegendes Pad** mit einem Pet
darauf, das über eine Voxel-Welt fliegt und Akademie-Karten anfliegt.

**Der Einstiegspunkt zum Lesen ist `terrain-v16/travel-poc.js`** — der Runner. Er verdrahtet, er
rechnet nichts. Die Frame-Reihenfolge steht dort als Liste (`mgr`), nicht als Kommentar.

### A2 Die Dokumente, in dieser Reihenfolge
1. `HOUSEKEEPING.md` **§4x** — was AKTIV, FROZEN, GETEILT ist. Die Statusspalte ist die Wahrheit.
2. `docs/travel-v16/SPRINT_travel-v16.md` — Fahrplan L1–L4, die drei Prinzipien, was NICHT gemacht wird.
3. `docs/travel-v16/CHANGELOG_v16.md` — jede Änderung mit Messwert, Nähte 102–121.
4. `docs/travel-v16/HANDOVER_assets_chatgpt.md` — der ausgelagerte Asset-Auftrag (nicht hier bauen).
5. Vorgeschichte: `docs/travel-v15/` (Flug-Sprint), `docs/travel-v14/`, `docs/travel-v13/`.
   **Nicht dort weiterbauen** — alle FROZEN.

### A3 Die sechs Regeln dieses Workspaces
1. **Assets IMMER per GitHub-RAW.** Nichts Schweres ins Projekt (GLBs, Texturen, Decks, PDFs).
2. `zone-registry.json` / `zone-index.json` an der Wurzel sind **fremder Contract** — hier nur lesen.
3. `asset-repo.json` und `kfb-cartoon-deform.js` sind **GETEILT** mit `KFB Cartoon-Verbieger.dc.html`.
   Nicht umbauen, ohne beide Verbraucher umzustellen.
4. **Was Geschmack ist, wird ein Regler**, kein Beschluss. Das Panel (Tab) ist der Ort dafür.
5. **Eine Zahl gehört an EINEN Ort.** Dokumente verweisen darauf, sie schreiben sie nicht ab.
   ⚠ Das gilt auch für **Markup und Inhalt**: `index.html` und das DC teilen `themes/kfb-shell.css`
   und holen ihre Meta-Zeile aus `SHELL_META` im Runner. Eine Kopie war eine Runde später schon
   uneinig (Naht 122) — Inhalt driftet schneller als Code, weil nichts kaputtgeht, wenn er driftet.
6. ⚠ **Jede Abnahmezahl nennt Seed und Fläche, über die sie gilt.** Das ist die Regel aus Naht 115:
   L1 wurde auf einem festen Weltseed gemessen, L2a hat ihn gewürfelt, und die Abnahme war still
   ungültig. Ein Befund ohne Seed ist eine Anekdote.

### A4 Clean-Run (acht Handgriffe, ~4 Minuten)
1. `index.html` öffnen. Der Ladeschirm nennt die Zeit und verschwindet. **`__bootErrors` muss 0
   sein** (im DC sind es 2 — die kommen aus der Werkzeug-Hülle, nicht aus unserem Code).
2. Konsole zeigt **vier** Zeilen: `[travel-v16] fc-v2.0 · …` · `[farbwelten] {…}` ·
   `[stufung] Seed … · 480 u um (0,0) · …` · `[props] {…}`. **Die Seed-Angabe in der
   Stufungs-Zeile ist Teil der Abnahme**, nicht Zierrat.
3. `__travelPOC.mgr.runStep('fade', 1/60)` und `runStep('vehicle', 1/60)` → `true`,
   `window.__loopErr` → `null`. Der Handle heißt **`window.__travelPOC`**.
4. `__travelPOC.modeOwner.request('walk','altitude')` → `{ok:false, why:'höhe-abgeschaltet'}`.
   **Das ist F0** (Bodenkontakt landet nicht). `request('walk','hand')` → `ok:true`.
5. W halten bis ~20 u/s, dann A halten: das Pad **rutscht** und lehnt sich hinein. **X** holt die
   Haftung sofort zurück.
6. Panel (Tab) → *Stufung* → *Wände — wo liegen sie?*: in Klippengebieten 8–12 %, sonst 0,9–2,8 %.
   **Das ist die Abnahme von L1** — nicht der Gesamtanteil, der mittelt die Trennung weg.
7. Panel → *Props* → *Geladen*: **9/9, 17 Draw-Calls**. Tief über Props fliegen: sie **versinken
   nicht** und stauchen sich mit dem Würfel-Bob.
8. Panel → *Varianten & Test* → *Parametersatz sichern*. Dann `KFB Travel Testliste.dc.html`
   öffnen → *Aus dem Spiel holen*.

### A5 Wo man NICHT anfängt
- **Nicht in `terrain-v15/` oder älter** — FROZEN, Vergleichsmaßstab.
- **Nicht am Runner**, wenn die Frage die Fahrdynamik ist: die steht in `flight-controller.js`.
- **Nicht am Standalone-Bundler.** Er ist blockiert (Naht 101, sieben Umgehungen gemessen). Für
  GitHub Pages braucht es ihn nicht — `index.html` + Ordner genügt und ist zum Messen besser.
- **Nicht an der geländefolgenden Höhe** und **nicht an Biom→Höhe** — beides begründet abgelehnt
  (Sprint §3, Naht 109).

---

## §B · Was in v16 gebaut wurde

| Slice | Kern | Abnahme |
|---|---|---|
| **L1/L1b** | Stufengröße als **Ort-Merkmal**: Hang 0,50 · Terrasse 1,50 · Kiste 3,00 · Klippe 6,00 u aus einer Reliefkarte. Schwellen sind **Flächenanteile** (Perzentil je Welt) | global 42–47 / 31–34 / 15–16 / 7–8 % über 5 Welten · Wände in Klippen 8–12 % gegen 0,9–2,8 % sonst |
| **L2a–c** | **Farbwelt als ORT** (`regionAt`), Weltwürfel aus EINER Zahl, Atem als dieselbe Front nur kleiner | Kachel 1500 u gemessen · Atem 0→12,6→25,2→12,6→0° · **null Zeilen GLSL** (der Shader konnte es seit v3) |
| **L2d** | **Ringwellen**, Variante A (kein Gedächtnis). 8 Plätze im Uniform-Array, Ring im Fragment-Shader, **Ereignis-Auslöser, nie der Beat** | Radius 92 u nach 2 s bei 46 u/s · Ring-Scheitel 1,00 · Fläche `#f54d8c` gegen Welle `#66ff85` |
| **L3/b/c/d** | **Kenney-Props** statt grauer Blöcke: 9 Modelle über `asset-repo.json` (RAW), globale InstancedMeshes, Verbieger pro Instanz, Bodenbewegung + Bodenfarbe + Squash am Würfel-Bob | 9/9 in ~350 ms · **17 Draw-Calls statt 81** · 1 376 Props · Aufbau 20–24 ms |
| **S60d** | Die drei Himmelswürfel zurück auf **120°** (`spreadAz` 1 statt 0,24) | eine Zeile, Rückweg dokumentiert |
| **T1** | **Parametersatz + Regler-Würfel** (`saveParams`, `rollParams`) und die **Testliste** als eigenes DC mit JSON-Import/Export | 17 Abschnitte im Satz, inkl. Messwerte |

**Was ein Übernehmer wissen muss:**
1. `terrain.motionUniforms` und `paletteUniforms` geben **dieselben Objekte** heraus, nicht Kopien.
   Ein Schreibvorgang erreicht Terrain und Props zugleich — es gibt keine Synchronisation, und das
   ist Absicht (Naht 121).
2. `MOTION_GLSL` und `PALETTE_GLSL` werden aus `voxel-terrain.js` exportiert und von
   `prop-scatter.js` eingebunden. **Die Bewegung existiert genau einmal.**
3. `state.forward` ist das Facing, `state.vDir` die Fahrtrichtung — im Drift laufen sie auseinander.
   Spuren und Streifen lesen noch das Facing (offener Slice F4).
4. ⚠ **Keine Backticks in den GLSL-Blöcken** (Naht 111, zweimal passiert): sie stehen in
   Template-Literalen, und ein Backtick im Kommentar beendet das Literal — der Fehler erscheint
   dann bei einem **Nachbarn**.
5. **Rückwege ohne Fork:** v15-Fahrgefühl → `driftOn:false, turnDrag:0, hugRise:0, autoMode=true`.
   v15-Landschaft → *Feine Stufung* aus. Graue Blöcke → *Props statt grauer Blöcke* aus.
   Würfel-Bild vom 26.7. → `spreadAz: 0.24`.

---

## §C · Testen (T1)

**Die Regel:** ein Ergebnis wird mit dem **Parametersatz** und dem **Seed** gespeichert, die es
erzeugt haben. Sonst ist es nicht reproduzierbar — und ein nicht reproduzierbarer Befund hat in
diesem Projekt schon einmal eine ganze Abnahme entwertet.

**Der Weg:** Panel → *Varianten & Test* → *Parametersatz sichern* (schreibt
`localStorage['kfb-travel-params']`) → `KFB Travel Testliste.dc.html` → *Aus dem Spiel holen*.
Beide Dateien müssen von **derselben Adresse** laufen, sonst teilen sie den Speicher nicht; dann
bleibt das Einkleben von Hand.

**Die Liste** hat 6 Gruppen / 27 Punkte (Start & Abnahme · Flug · Stufung · Farbwelten & Wellen ·
Props · Würfel & Karten), jeder mit **Handgriff und Erwartungswert**. Zustände: OK · DEFEKT · N/A ·
offen; derselbe Knopf nochmal nimmt zurück. Notizfeld je Punkt. Export/Import als JSON, Zustand
überlebt ein Neuladen (`localStorage['kfb-travel-tests']`).

**Der Regler-Würfel** (*Regler würfeln*) schüttelt die Grenzen durch, **lässt den Seed aber stehen**:
so ändert man Regler ODER Welt, nie beides — sonst weiß niemand, welches gewirkt hat.

---

## §D · Die Nähte 102–121 (Kurzfassung)

Vollständig im `CHANGELOG_v16.md`. Die vier, die am meisten gekostet haben:

- **(115) ⚠⚠ Ein späterer Slice hat die Abnahme eines früheren still ungültig gemacht.** L2a würfelte
  den Seed, an dem L1s Zahlen hingen. Gefunden hat es der Verifier, nicht ich. *Wer einen
  gemeinsamen Eingang würfelt, muss jede Abnahme nachmessen, die von ihm abhing.*
- **(116)** Eine Spreizung verschiebt eine Verteilung, ohne sie zu kennen. *Ein Regler, dessen
  Wirkung vom Seed abhängt, ist kein Regler, sondern ein Gerücht.*
- **(120)** **Die zweite Uhr ist der Fehler, nicht die fehlende Bewegung.** Zweimal in L3: die
  Bodenbewegung sollte „nachgebaut" werden, der Squash lief an eigener Uhr. Beide Male war die
  Lösung, den **vorhandenen** Takt zu teilen.
- **(118)** Eine Beschreibung im UI hat den dritten Anlauf nicht mitbekommen — die gefährlichere
  Sorte Fehler, weil eine falsche Zahl beim Nachmessen auffällt, eine falsche **Begründung** aber
  genau dann geglaubt wird, wenn man sie am nötigsten braucht.

---

## §E · Was offen ist

**Flug (v15):** F2 Boost-Grammatik (Dauertaste vs. Belohnung — Spieldesign) · F3 Kamera am Tempo
(FOV 60→80, `closeDamp`) · F4 den Drift **sehen** (`vDir` liegt bereit) · F5 benannte Manöver ·
F6 Touch. Dazu: Banking 34° gegen 45° im Vorbild, Nicken aus dem Soll statt aus dem Ist.

**Landschaft:** Variante B (Wellen *färben ein*, `instanceColor`) — die eigentliche Frage dort ist
**das Chunk-Recycling**, nicht der Puffer · Wetter hängt daran · **L3e** Aufbau in Scheiben
(20–24 ms je Chunk-Wechsel sind spürbar).

**v17 geplant:** Kartengitter / endloses Terrain (Georg, 12.8.) — Gitter statt Ring, weil man
Strecken wiederholen können muss.

**Ausgelagert:** Asset-Index-Konsolidierung → `HANDOVER_assets_chatgpt.md`.

**~20 Regler warten auf Georgs Urteil** — die Liste steht in der Testliste rechts unten und in
HOUSEKEEPING §4x.
