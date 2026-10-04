# README — Check-in KFB Overworld v13 (2026-08-12)

**Basis:** `KFB Overworld v12.dc.html` (HOUSEKEEPING §4v) · **Stand hier:** v13 mit C1 · C1b · C2.
**Empfänger:** WS1 (Lead) und der Coworker. **Eine Richtung, eine Runde, eine Abnahme mit Zahlen.**

## Was drin liegt

| Pfad | Inhalt |
|---|---|
| `KFB Overworld v13.dc.html` + `overworld-v13/` | der Arbeitsstand (57 Module + `icons-rpg/` + 3 JSON) |
| `KFB Bubble-Fixtures v1.dc.html` | Abnahme C1/C1b: **15 ausgerechnete Fixtures**, Soll/Ist je Zeile, Gegenprobe füllend↔ausgeglichen |
| `KFB Blasen-Formen v1.dc.html` | Abnahme C2: fünf Register, Ankerwinkel und Streuung am Regler, Rand bis Kontur je Register |
| `KFB Terrain-Probe v1.dc.html` | Messplatz: Pirate Bomb (5 Figuren) neben Tiny-Swords-Einheiten und -Requisiten, ein Maßstab |
| `support.js` | Laufzeit der Design Components |
| `standalone/` | **vier eigenständige HTML-Dateien** — laufen ohne Projekt, ohne Netz (bis auf die Assets über den CDN-Kanal): Overworld v13 (809 kB) · Bubble-Fixtures (130 kB) · Blasen-Formen (597 kB) · Terrain-Probe (158 kB) |
| `docs/overworld-v13/` | Sprint · Abgleich Briefings · Abgleich Bubbles · Spec Lettering · Handover an WS1 |
| `docs/HOUSEKEEPING.md` | Status je Artefakt, Nähte 101–132 |
| `docs/MASTERPLAN_overworld.md` | **Kopie, Eigentum WS1** — trägt seit 12.8. den Vermerk »liegt hinter dem Code« |
| `docs/HANDOVER_Bubbles_Design_coworker.md` | die Bauanleitung des Coworkers (Eingang), gegen die abgeglichen wurde |
| `docs/KANON_schreibweisen.md` | KayfaBINGO · KayfaBONGO · KayfaBOGGLE |

## Der Diff gegen v11 (gemessen, nicht erinnert)

Byte-Vergleich `overworld-v11/` gegen `overworld-v13/`: **elf** Dateien.
Aus v12: `water-kiss.js` (neu) · `overworld-game-v10.js` · `card-rail-v9b.js` · `terrain-paint.js` ·
`journey.js` · `card-backs.js` · `asset-source.js` · `gutter-2d.js`.
Neu in v13: **`bubble-layout.js`** (neu) · `bubble-ts.js` · das DC (eine Skriptzeile mehr).
Alles Übrige ist unverändert — Einzelheiten in `docs/overworld-v13/HANDOVER_WS1_2026-08-12.md` §1.

## Abnahme (echter Bedienweg, nicht Boot-Log)

**C1 + C1b** — `[bubble-fixtures] C1 · 15/15 Fixtures · Zeilen 15/15 · Umbruch 7/7 · Zeiten 15/15 ·
Überlauf gemeldet`. `overflow` wird **abgewiesen**, nicht vierzeilig gezeigt.
**C2** — fünf Register, Kante aus dem KFB-Kanon auf einer Canvas-Ebene (Tuschepixel je Register
gemessen: 7582 · 7055 · 8445 · 2802 mit Lücken · 6146), Rand bis Kontur 7–12 px.
**Terrain-Probe** — Bald Pirate Körper 59 px → ×1,54 = 91 px neben Warrior (91 px, ×1,00) und
Minotaur (129 px → ×1,23 = 159 px).
**v13 selbst — im Standalone gemessen (12.8.):** Module **39/39** · `[rail-v9b] Kartenspalte steht ·
Quests 2` · `[journey] Einheit aus dem Spielstand: gnoll` · `[water] Glitzern steht auf aus` ·
Kanon v2 geladen · `__bootErrors` **0** · Welt 240×180, 6 Zonen, 23 Mobs + 8 Wegelagerer,
Rückseiten 6/6. **v13 LÄUFT.**

**Vier Pfad-Fänge, die erst das Bündeln zeigte** (behoben, im Export enthalten): eine relative
Adresse gegen eine `blob:`-Basis wirft synchron und umgeht den Rückweg (`hud-v7.js`,
`card-ink-2d.js`) · das **gemessene** Kartenraster fiel auf den geratenen Rückfallwert
(`card-art-2d.js`) · `prop-sheet.js` lud seit dem v11-Fork `./overworld/prop-sheets.json`, den es
hier nicht mehr gibt — unsichtbar, weil der Rückfall 700 Requisiten liefert.
*Wer nur im Projekt prüft, prüft die Umgebung mit, in der der Fehler nicht vorkommt.*

**Zwei Befunde von Georg am Bild, im Export enthalten:** die Aktionskarten hatten runde Ecken und
keine Tuschekante — der Kanon lädt asynchron, die Karten der Hand entstehen danach und wurden nie
nachgezeichnet (*ein Rückfall ohne Wiedervorlage wird zum Zustand*; jetzt ~3250 Tuschepixel je
Karte gemessen) · **`chatter` steht auf `off`** (stumm, nicht ausgebaut — Weg zurück in den Tweaks).

Offen und benannt: `KFB_Props/sheet-02.png` fehlt im Repo · `drop_002.ogg` dekodiert nicht (seit
9.8.) · `HUD-Skin v7 · undefined` (kosmetisch).

**Zwei Nähte aus dem Bündeln selbst** (dieselbe Klasse wie Naht 116, beide behoben):
(133) **eine Kopfzeile, die einmal beim Mount gelesen wird, altert sofort** — im Standalone sind die
Module beim ersten Rendern noch nicht da; die Blasen zeichneten, die Zeile sagte »bubble-ts fehlt«.
(134) ⚠ **ein Blatt, das alles in `renderVals` rechnet, meldet im Standalone 0/15** — nicht kaputt,
nur zu früh gefragt. Beide ziehen jetzt nach, sobald das Modul steht.

## Drei Bitten an den Empfänger

1. **Kanon:** `kfb-ink-canon.js` v2 hat **keine** gestrichelte Variante (kein `dashedPathD`, kein
   Preset `card-dash`) — der alte Aufruf lief seit v10-S15 ins Leere. Gelöst über Maskenlücken über
   einer durchgängigen Kante; eine benannte Preset-Variante und die Frage Canvas↔SVG gehören WS1.
   Handover §5b.
2. **Masterplan:** der Patch (neun Entscheidungen aus v11/v12) liegt einsetzbar im Abgleich §3.
3. **An den Coworker:** zwei Stellen veralteter Kanon in der Bauanleitung (»Puste, Witz, Schneid«
   ist verworfen; BLÖDSINN! ist **beides** — Wert und Todes-Regie) und der eine offene Widerspruch
   zur Zackenform (Kranz gegen Unregelmäßigkeit) — Abgleich §2 und §4.

## Offen, in Georgs Reihenfolge

Zacken-Unregelmäßigkeit · Rede-Hausform (Rechteck oder Rundform) · Flüstern-Zeilenlänge 28/33 ·
Kayfabulate Kasten oder doppelte Kontur, am Sprite oder am Bildrand · wellige Kontur »emotional
bewegt« (C2b) · Anschluss-Ellipse bei geteilten Blasen (C3) · Perplexity-Runde zu Blasenformen.
