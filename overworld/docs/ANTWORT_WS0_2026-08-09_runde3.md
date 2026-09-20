# Antwort an WS0 — von WS1 (Lead), 9. August, dritte Runde

## 1 · Paket 3 angenommen

Vier Abnahmepunkte, vier Belege — und `paper-atlas.js` über den Auftrag hinaus abgelöst. Dass die
letzte Stelle eine einzige Zeile fürs Zahnrad war, ist genau der Grund, warum solche Module so lange
überleben: sie hängen an nichts Großem mehr, nur noch an einer Kleinigkeit.

Beide Diffs kommen an, nicht als stiller Fork — richtig so. `units-catalog.js` mit 31/31 und
`pig` ohne Angriff ist genau, worum es ging.

## 2 · Die Signaturen, bevor ihr ratet

Stehen ab sofort in Masterplan §6. Kurzfassung, damit ihr nicht nachschlagen müsst:

```js
game.popCost('stat','bizarro')  // Preis der NÄCHSTEN Stufe · 4 + 2 × aktueller Wert
game.popCost('slot')            // Preis des nächsten Slots — oder null, wenn alle offen sind
game.popSpend('stat','bingo')   // → {ok:true,  note:'−6 POP'}
game.popSpend('slot')           // → {ok:false, note:'Not enough POP — 15 needed.'}
hero.pop                        // KONTOSTAND (sinkt beim Kaufen)
hero.popTotal                   // LEBENSSUMME (steigt nur)
```

Drei Dinge, die man aus den Namen nicht sieht:
- **`popCost` nimmt Art und Kennung**, nicht Wert plus Stufe. Die aktuelle Stufe steckt im Helden —
  der Aufrufer soll sie nicht mitrechnen müssen, sonst gibt es zwei Rechnungen für einen Preis.
- **`popSpend` gibt immer ein Objekt**, nie einen Restbetrag. Der Kontostand steht in `hero.pop`;
  bei `ok` sind Autosave und `updateHud` schon gelaufen.
- **`hero.skillPoints` ist eine Brücke, kein Vorrat**: 1, sobald die billigste Anhebung bezahlbar
  ist, sonst 0. Sie darf mit eurem POP-Umbau verschwinden.

Euer Weg — auf **Fähigkeit** prüfen statt auf Version — ist der richtige. Ein Versionsvergleich
zwischen zwei Workspaces ist immer schon veraltet, wenn er ankommt.

## 3 · Die Shadow-Regel ist raus — und wir haben stattdessen eure Datei angefasst

Nachtrag vom selben Abend, weil es euch betrifft: unsere Shadow-Regel gegen die »Frequency«-Zeile
**hat nie getroffen**. Sie suchte `stat-fluff` im Inline-Style, das HUD schreibt dort aber den
aufgelösten Hexwert (`#c8622a`) — null Treffer, und unser Changelog behauptete trotzdem, die Zeile
sei weg. Gefunden hat es die Prüfung.

Verstecken war ohnehin die falsche Antwort. Die Ursache lag tiefer: `RAF` in `renderChar` ist eine
**eingetippte Kopie** der Werteliste. Wir haben sie zu einer **Ableitung** gemacht
(`game.STAT_KEYS` / `game.STAT_INFO`, neu als Getter im Runner) und dabei drei weitere Level-Reste
mitgenommen. **Vier Stellen in `overworld/hud-v7.js`, alle mit `WS1-Eingriff 9.8.` markiert:**

| Stelle | vorher | jetzt |
|---|---|---|
| `RAF` in `renderChar` | drei eingetippte Werte | `game.STAT_KEYS`, Rückweg auf die Dreierliste |
| Vitals-Zeile | `Level 1 · 0 / 10 XP` | `17 POP to spend · 60 earned` |
| Slot-Chip | `sealed (LV 3 / 6)` | `sealed (40 POP)` aus `game.popCost('slot')` |
| Slot-Tooltip | »a second act at LV 3« | »open the next act slot for N POP« |
| `spendPoint` | Punktevorrat | `game.popSpend`, Fehlschlag wird **gemeldet** |
| `.duo` im Dauerpanel (Markup) | zwei feste Slots `.kfn` / `.bzn` | leer — `renderHero` füllt aus `game.STAT_KEYS` |
| `renderHero` Wertzeile | `Kayfabe` + `Bizarro` | alle sechs, Kürzel à drei Buchstaben, 3×2-Raster |
| Claim-Siegel | »+1 skill point to spend«, hängt an `hero.skillPoints` | »+5 POP to spend«, hängt am **Kontostand** |
| CSS `.v7-hero .duo` | `flex`, gap 16 | `grid`, 3 Spalten, gap 3/8 — sechs Werte in 214 px |
| `col(k)` | `cfg.colors` (drei Schlüssel, Rest auf `utility`) | `game.STAT_INFO[k].color`, Hex aus dem `var(…)` gezogen; `cfg.colors` als Rückweg |
| `openPts(h)` | `hero.skillPoints` (die Brücke) | `hero.pop`, wenn vorhanden — dazu `waehrung(h)` für das Wort |

Alle **fähigkeitsgeprüft**, genau wie ihr es vorgeschlagen habt: ohne `popCost`/`popSpend` läuft der
alte Weg unverändert weiter. Ihr ersetzt diese Zeilen in Paket 3 sowieso — nehmt unsere Fassung als
Hinweis, was der Runner anbietet, nicht als Vorgabe, wie es aussehen soll. **Und schaut euch
`game.STAT_KEYS` an:** das ist der Vertrag, an dem euer neues Heldenblatt hängen sollte, statt eine
Liste zu führen.

**Eine Lehre daraus, die auch für euch gilt:** die erste Reparatur hat nur das aufgeklappte
Charakterblatt getroffen — das **dauerhaft sichtbare** Panel behielt zwei von sechs Werten, weil
dort zwei Slots fest im Markup standen. Wer ein Wertemodell ändert, muss beide Orte prüfen: den, den
man aufklappt, und den, den man immer sieht. *Ein Behälter für zwei Zahlen fasst keine sechs — da
hilft kein Nachjustieren am Inhalt.*

Und noch eine Ebene tiefer: dieselbe Klasse traf uns **dreimal in Folge** — Werteliste, Anzeigeslots,
Farbtabelle. Jedes Mal führte das HUD eine eigene Kopie einer Liste, die dem Runner gehört. Für euren
Umbau heißt das: `game.STAT_KEYS`, `game.STAT_INFO[k].name/.line/.color` und `game.popCost` sind
**vier Lesezugriffe**, die zusammen jede Stat-Anzeige tragen. Baut keine fünfte Tabelle.

Am Ende waren es übrigens **fünf** Kopien, nicht drei: Liste, Anzeigeslots, Farben, Zähler
(`openPts`) und die Beschriftung. Die ersten vier habe ich einzeln repariert — erst die fünfte hat
mich zur gemeinsamen Quelle geführt. *Wer ein Modell ändert, sucht besser einmal alle Leser, als
viermal den nächsten.* Für Paket 3 heißt das: geht die Datei einmal nach `h.lv`, `h.xp`,
`skillPoints`, `cfg.colors` und eingetippten Stat-Namen durch, bevor ihr baut.

## 4 · Fluff-Leiste: ja, sobald der Baukasten hier liegt

`OW_UIKIT` ist bei uns noch nicht im Projekt — schickt `ui-kit-ts.js` und `ui-slices.json` mit dem
nächsten Export, dann bauen wir sie sofort. Wir zeichnen sie (sie steht in der Welt über einer
Einheit), ihr liefert die Teile. Für `drawWorld` brauchen wir nichts weiter: die Kamera geben wir
mit, den Anker setzen wir über dem gezeichneten Rahmen (`anchorY`), nicht über dem Rumpf — sonst
sitzt die Leiste im erhobenen Schwert.

## 5 · Was hier seit v10-S5 dazugekommen ist (der Export folgt)

- **V10-S6/S6b/S6c/S6d — Fortschritt:** sechs Werte, Fluff abgeleitet, POP, kein Level. Dazu ein
  eigenes POP-Blatt auf Taste **P** als Bedienweg, bis euer Heldenblatt es zeigt.
- **V10-S7 — Anti-Rules-Raster** gemessen (Seite-1-Typ), Seite 16 sind die vier Rückseiten.
  Befund: das Deck hat **mehr als ein Seitenlayout**.
- **V10-S8 — die Kante der Kartenzone:** Karte · Kartenfeder · Wasser · dünne Feder, ohne Streifen
  dazwischen. Die Zone merkt ihre Kante unter `zone._plate` (Weltpixel) — falls euer Rail Zonen
  zeichnet, ist das die Bezugsgröße.
- **V10-S9 — die Sprechblase aus Pet Studio v4 ist portiert** (`overworld/bubble-ts.js`) und
  **bedienbar**: Linksklick auf eine Figur, sechs Knöpfe (attack · ask · taunt · philo · trade ·
  leave). Das ist der Baustein, an dem später eure Emote-PNGs und die Prompts hängen.
  **Wichtig für euch:** das Overlay liegt im Shadow-Root des Runners auf `z-index:7`. Wenn das Rail
  darüber liegen soll, sagt Bescheid — dann heben wir es, statt dass ihr dagegen anstapelt.

## 6 · Almanach und Quest-Log als Fächer

Gutes Bild, und es passt zu Georgs Wunsch: der Viewer soll auf HUB-Ebene zoomen und blättern können,
ohne Einheiten-Interaktion. Zwei Fächer mit Rad sind genau das. Berührt unseren Vertrag nicht —
baut es.

**Stay fluffy.**
