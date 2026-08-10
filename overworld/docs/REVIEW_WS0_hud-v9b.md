# Review · WS0-Export »v9-B — HUD/UI + Avatare« (9.8.2026)

Gelesen: `ONBOARDING_v9b.md`, `HOUSEKEEPING.md`, `card-rail-v9b.js` (2073 Zeilen),
`card-art-v9b.js`, `units-catalog.js`. Liegt unter
`uploads/KFB Overworld v9-B - HUD session + avatare/v9b_2026-08-09/`.
**Nicht eingebaut** — dieses Blatt ist die Bewertung und der Einbauplan.

---

## 1 · Kurzurteil

**Architektonisch das sauberste Stück, das aus WS0 hierher gekommen ist.** Der Grund steht in einem
Satz seiner eigenen Doku: *»Kein Eingriff im Runner«* — das Rail hängt sich an das **fertige** v7-HUD
im Shadow-DOM, versteckt Kompaß und Almanach-Stapel und setzt seine Blätter an deren Platz. v8 bleibt
bitgleich. Damit ist der Einbau bei uns im Prinzip **zwei Zeilen im Helmet**, obwohl die Fassung auf
v8 forkt und unsere Linie über v9 läuft.

Vier seiner neun Regeln decken sich wörtlich mit unseren Hausregeln (»eine Zahl, ein Ort« ·
»gemessen, nicht geschätzt« · »wer pausiert, räumt den Weg ab« · Sichtbarkeit ist Zustand). Zwei sind
neu und gut:

- **Ein `stopPropagation` in der Fangphase erreicht das Ziel nie.** Das Klick-Tor stoppt deshalb nur
  `pointerdown` und `contextmenu`, nie `click`. Das ist genau die Klasse Fehler, die man einmal baut
  und nie vergisst.
- **Ein Blatt malt sich erst, wenn es seine Größe kennt.** Im unsichtbaren Tab kommt kein
  `requestAnimationFrame` — also synchron nach dem Anhängen zeichnen, `ResizeObserver` malt nur nach.
  Dieselbe Falle, die uns bei den Standpunkt-Messungen Zeit gekostet hat, nur in der UI.

---

## 2 · Was ohne Diskussion übernommen werden sollte

**`units-catalog.js` ist ein echter Zugewinn** und wir teilen die Datei ohnehin:

| Was | bei uns heute | im Export |
|---|---|---|
| Menschen-Avatare (Free Pack, 25 Blätter) | fehlen | `HAV_BASE` + `humanAvatar(color, slot)` — Regel statt Liste |
| Gegner-Avatare | 6 (Goblins, Fische) | +8 (bear · lizard · snake · spider · gnome · skull …), 6 offen (`avatarsUnmapped`) |
| Lancer · Monk | fehlen | spielbar, als `strips` (Free Pack) statt `rowsheet` — *»das Blattformat entscheidet die Bauart, nicht die Fraktion«* |
| `KNIGHT_CLASSES` | 3 | 5 |

**Vor dem Tausch eine Sache prüfen:** unsere vier `guard`-Clips (minotaur · skull · panda · turtle mit
`guardIn`/`guardOut`) müssen in der neuen Fassung stehen — an ihnen hängt seit v10-S2d die
Warnhaltung des Kartenwächters. Ein Diff, kein blinder Überschreib.

---

## 3 · Drei Konflikte mit unserem Stand — konkret, lösbar

**a · Zwei Kartenkunst-Module.** Wir haben `overworld/card-art-2d.js` (`OW_ART.quarter()`, Regel:
*eine Halbierung kann nicht falsch sitzen*), der Export bringt `card-art-v9b.js` (`OW_CARDART`, mit
`yShift` aus `card-grids.json`). **Beide rendern dasselbe.** Das ist genau die zweite Wahrheit, die
ihre eigene Regel 1 verbietet. Die WS0-Fassung ist inhaltlich weiter (gemessener Versatz statt
stumpfem Viertel) — mein Vorschlag: `yShift` **in unser** `card-art-2d.js` einziehen und
`card-art-v9b.js` gar nicht erst mitnehmen. Ein Modul, zwei Aufrufer.

**b · Der Pfad zu den Crop-Zahlen stimmt nicht.** WS0 liest `terrain-v13/card-grids.json`, bei uns
liegt die Datei unter `overworld/card-grids.json`. Eine Zeile — aber sie fällt still aus (»fehlt die
Datei, bleibt es beim stumpfen Seitenviertel«), also merkt man es nicht.

**c · Das Rail versteckt den Kompaß — und damit unseren Reise-Fix.** In v10-S1h sitzt die Nachsicht
als Argument in `travelPoint(x, y, label, snap)`: Anker 3 Felder, Klick 1. Der Kompaß im v7-Möbel
ruft das mit `snap = 1`. Wenn das Insel-Rechteck des Rails an seine Stelle tritt, **muß es dieselbe
Regel mitbringen** — sonst ist der Strand-Teleport zurück, und diesmal an einer Stelle, an der wir
ihn nicht suchen. Dazu passend: das Rail rechnet Klicks über `getBoundingClientRect`, und ihr eigener
offener »Steuerungs-Befund« vermutet dort einen Maßstabsfehler. Beides ist dieselbe Frage.

---

## 4 · Was ich nicht übernehmen würde (jetzt)

- **Skill-Icons + Slot-Overlay** mit `SLOT_COST = [12, 24, 48]` und `TRAIN_COST = 4`. Zahlen sind als
  WIP freigegeben, aber sie kollidieren mit unserem Kanon: *Karten sind Beweisstücke, keine Powers* —
  Kosten in Zahlen sind der Anfang eines Punktestands. Erst entscheiden, ob das Spiel Preise haben
  soll, dann Zahlen.
- **Die Weltkarte aus dem Rail.** Ihr eigener Satz: *»Die Vollbild-Übersicht gehört dem Runner, nicht
  dem Rail-Modul«* — und der Runner sind wir. Unsere Übersicht ist seit S1f aufgeräumt (Marken, ein
  Name am Zeiger). Die Pergament-Idee (`Carved_9Slides`, 3×3 aus 64ern, Mitte gekachelt, nie gedehnt)
  gehört in unseren Backlog, nicht in ihr Modul.

---

## 4b · Der Steuerungs-Befund — unsere Referenzwerte (gemessen 9.8., v10-S2d)

Georg: *»da ist irgendetwas mit der Steuerung kaputtgegangen, das wir analysieren sollten vor dem
Einbau.«* Damit die Analyse nicht bei null anfängt, ist **unser** Stand vermessen — er ist die
Vergleichsgröße, gegen die der WS0-Befund gehalten werden muss.

| Prüfung | Ergebnis |
|---|---|
| Laufbefehl per Klick (ohne Taste) | Feld 130 → **135** in 2,5 s, Pfad 7 Knoten |
| Tastatur (ohne Laufbefehl) | Feld 135 → **139** in 0,9 s |
| `rect.width` gegen `canvas.width / dpr` | 788 gegen 788 — **stimmt** |
| Klick-Rücklauf Bildschirm → Welt → Bildschirm | **0 px Abweichung** an fünf Punkten |
| Ancestor-Skalierung (`zoom`, Transform) | keine — Host-Rechteck = Canvas-Rechteck |

**Ihr Verdacht »Maßstabsfehler in der skalierten Vorschau« trifft auf unseren Stand nicht zu**, und
der Grund ist strukturell: `zoomEff()` liefert außerhalb der Übersicht `att.zoom`, also einen
**CSS-Maßstab**, und die Klickrechnung nutzt `rect.width` — ebenfalls CSS. Beide Seiten rechnen in
derselben Einheit, das Gerätepixel kommt gar nicht vor. Deshalb ändert auch `renderScale` (v10-S1a)
am Klick nichts: es sitzt in `dpr`, und `dpr` taucht in dieser Rechnung nicht auf. Wer dagegen
irgendwo `dpr` zum Umrechnen benutzt, hat einen Fehler, der bei `devicePixelRatio 1` **unsichtbar**
ist und auf einem Retina-Schirm alles verdoppelt.

**Zwei Kandidaten, die ich zuerst prüfen würde** (beide in ihrem Modul, nicht in unserem):

1. **Die Torwache frisst den Weltklick.** Das Tor hängt in der **Fangphase am Shadow-Root** — und die
   Leinwand hängt **im selben Shadow-Root**. Es entscheidet also über jeden Weltklick mit, nicht nur
   über HUD-Klicks. Trifft `UI_SEL` einmal zu breit (ein Vorfahr, der über der Leinwand liegt), ist
   die Steuerung tot, ohne dass eine Zeile Fehler erscheint. Prüfung: `composedPath()` eines
   Weltklicks protokollieren und gegen `UI_SEL` halten.
2. **Der Knopf, den das Trackpad liefert.** Im Spiel gilt außerhalb der Übersicht `e.button !== 2 →
   return`: **die Welt hört nur auf die rechte Taste.** Ein Trackpad kann `contextmenu` ohne
   vorangehendes `pointerdown` schicken — und genau `contextmenu` stoppt ihr Tor. Prüfung: an einem
   Weltklick `e.button`, `e.pointerType` und die Reihenfolge der Ereignisse mitschreiben.

**Was ich nicht tun kann:** ihren Stand hier laden. Der Export liegt unter `uploads/`, referenziert
`terrain-v13/` und ist fremder Code — ich messe ihn nicht blind, sondern liefere die Prüfschritte.
Wenn der Befund kommt, ist der Vergleich in zwei Minuten gemacht.

## 5 · Reihenfolge für den Einbau (nach dem Masterplan)

1. **`units-catalog.js`** tauschen, nach Diff gegen die vier `guard`-Clips. Risikoarm, sofort sichtbar
   (Avatare im Roster).
2. **`yShift`** in `card-art-2d.js` einziehen, Pfad auf `overworld/card-grids.json`. Danach ist ein
   Aufruf für Reader, Kampfzone und Rail derselbe.
3. **`card-rail-v9b.js`** ins Helmet — mit dem `snap`-Argument im Insel-Rechteck und einer Messung des
   Klickziels, bevor irgendetwas anderes daran gebaut wird.
4. Erst dann: Skill-Icons, Weltkarte, Töne (**ihr Befund: null abspielbare Audiodateien im Repo** —
   deckt sich mit unserer Warnung beim Content-Type).

---

## 6 · Zwei Beobachtungen zur Arbeitsteilung

**Die Statleiste ersetzt unser gelöschtes Zonen-Banner.** In v10-S1g habe ich das Banner entfernt, weil
das v7-Möbel dasselbe schon sagt. Das Rail baut genau dort weiter — die Entscheidung war also richtig
und die beiden Stränge laufen aufeinander zu, nicht auseinander.

**Was fehlt, ist ein gemeinsamer Fork-Punkt.** WS0 forkt v8, wir sind bei v10-S2. Solange die
WS0-Arbeit additiv im Helmet hängt, ist das kein Problem — sobald jemand `overworld-game.js` anfaßt,
ist es eins. Wenn die HUD-Linie weitergeht, sollte sie auf unseren Check-in forken
(`export/overworld-v10-S2_2026-08-09/`), nicht auf v8.
