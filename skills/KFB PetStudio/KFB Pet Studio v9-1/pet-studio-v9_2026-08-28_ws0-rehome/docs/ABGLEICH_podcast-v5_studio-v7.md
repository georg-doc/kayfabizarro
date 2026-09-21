# Abgleich Podcast v5 (WS0) ↔ Pet Studio v6/v7 (hier)

**26.08.2026, gemessen, nicht behauptet.** Erledigt ToDo 1 (»Abgleich & Konsolidierung Pets mit
Groundplane & Schatten«). Jede Zeile hier ist eine Messung oder eine offene Entscheidung — nichts
davon ist Meinung.

---

## 1 Was schon konsolidiert IST (nichts zu tun)

| Sache | Messung | Befund |
|---|---|---|
| **Vertrag** `kfb-pets.v5.json` ↔ `studio-v3/kfb-pets.json` | **byteidentisch**, 36.418 Bytes, 24 Pets, **0** abweichende Blattfelder | v1.2.7 gilt auf beiden Seiten |
| **Messschicht** `pet-metrics.v1.js` | Paket 442 Z ↔ `studio-v7/` 442 Z, **0** abweichende Zeilen | identisch, kein Rückläufer nötig |
| Kachel als Maßeinheit (`tile.edge × fill`) | FrizzleBob 0,351 · Pinguin 0,390 | beide Seiten rechnen gleich |

Das ist die gute Nachricht: die *Zahlen* über die Pets sind zwischen WS0 und WS1 nicht auseinander
gelaufen. Auseinander gelaufen sind die **Verfahren**.

---

## 2 Wo das Paket einen Stand zurück ist

| Modul | Paket (WS0) | hier (studio-v7) | Unterschied |
|---|---|---|---|
| `bubble-shaper` | **v2**, 863 Z | **v3**, 887 Z | zwei Fehler in der Zipfelerkennung (bei `free` eine Blase 78 × 1922 px; Satz 10,5 px neben der Formmitte) |
| Blasenschicht | — | `bubble-kiss.v1` + `edge-treatment.v1` | »einmal zeichnen, nur `scale(k)`« — die v6-Fehlerklasse ist damit abgeschafft, nicht behoben |
| `ground-plane.v1` | 303 Z (im Paket als **DEAD** geführt) | 330 Z **plus `screenTile()`** | die Blasengröße hängt inzwischen am Boden |

**Georgs Entscheidung 26.8.: beim Paket-Stand v2 bleiben, Blasen erst nach dem Spiel anfassen.**
Eingetragen, nicht angefasst. Preis, damit er benannt ist: die zwei Zipfel-Fehler sind in
SpinballCast v1 noch drin, und `bubble-kiss` gilt hier nicht.

---

## 3 Der eine echte Widerspruch: zwei Anlagen für denselben Schatten

Drei Papiere sagen drei verschiedene Dinge — und das ist kein Redaktionsfehler, sondern zwei
Verfahren, die beide funktionieren:

| Quelle | Aussage |
|---|---|
| `HANDOVER_WS1_petstudio_v6.md` §1 | »Das Studio-Rig nimmt die Silhouette von OBEN ab … **wir haben es verworfen**« (Ohren liegen neben den Füßen) |
| `MODELL_szene_v5.md` §2 | »Der Schatten ist ein **STEMPEL**, kein empfangenes Licht« |
| `HOUSEKEEPING` (WS0) | `podcast-v5/ground-plane.v1.js` = **DEAD im Scope**, nicht importiert |
| **Der Code** (`ground.v5.js`, gelesen) | eigener Werfer `intensity 0` + **`ShadowMaterial`-Kachel je Pet** + zwei Kamera-Durchgänge |

**Der Code gewinnt:** die Sendung fährt die Kachel-Anlage, `MODELL_szene_v5` §2 beschreibt einen
Stand, der im Modulkopf ausdrücklich als Fehler A geführt wird. Der Widerspruch ist damit
aufgelöst — aber die Entscheidung, welche Anlage in SpinballCast gilt, ist **offen** (§5).

### Die Frage in Alltagssprache (Georgs Rückfrage vom 26.8.)

Es gibt zwei Wege, einen Pet-Schatten auf den Boden zu bekommen:

**A · Kachel und Licht** (heute im Podcast v5). Jedes Pet bringt eine kleine Bodenplatte mit, ein
eigenes Licht wirft die Figur darauf. Es ist ein *echter* Schatten: er wird beim Hüpfen kleiner,
verzieht sich beim Drehen, und die Platte kann später Treffer-Effekte tragen. Preis: eine Platte hat
einen Rand, und die Kamera muss von oben genug auf sie schauen — in der Sendung steht sie 0,82
Einheiten UNTER den Sohlen, deshalb braucht es dort einen zweiten Kamera-Durchgang je Pet.

**B · Stempel** (im Pet Studio v6/v7). Eine kleine Kamera schaut die Figur an, nimmt ihre Silhouette
ab, und dieses Bild wird als Abziehbild auf den Boden gelegt. Kann nicht ausreißen, hat keine
Frustum-Kante, und die **Blasengröße hängt inzwischen daran** (`screenTile`). Preis: von oben
gesehen liegen Ohren neben den Füßen — an FrizzleBobs Sohle wackelte sein Ohr.

**C · Beides, nach Ansicht** — meine Empfehlung. In der **Sendung** die Kachel (A), im **gekippten
Feld** der Stempel (B). Begründung ist keine Geschmacksfrage: im Feld schaut die Kamera 44° von oben
auf das Blatt, und genau dann ist »von oben« richtig statt falsch. Das Ohr-Problem verschwindet mit
dem Blickwinkel, der es erzeugt hat.

Wenn du das **sehen** willst statt lesen: sag es, dann baue ich einen Umschalter in SpinballCast
(ein Regler, zwei Anlagen, gleiches Pet, beide Ansichten) — dann entscheidest du am Bild.

---

## 4 Die Lücke im Export — geschlossen

Von **30** Importen der Sendung fehlten hier **8**: `podcast-v4/{gutter,content,typecase,cardback,
storymode,wordmark,poke,spin}.v4.js`. Ohne sie lädt die Seite nicht (toter Import, kein Look-Problem).

Georg hat sie am 26.8. nachgeliefert (`KFB Pet Podcast v4.zip`). Eingebaut sind **10** Module
(4.058 Zeilen: `layout.v4` 1151 · `gutter.v4` 634 · `wordmark.v4` 479 · `ground.v4` 465 ·
`cardback.v4` 391 · `content.v4` 304 · `spin.v4` 211 · `storymode.v4` 170 · `poke.v4` 167 ·
`typecase.v4` 86) plus vier Docs und `KFB Pet Podcast v4.dc.html`.

**Jetzt: 30 Importe, 0 fehlend** (tiefe Ebene: 7 Importe, 0 fehlend). `KFB Pet Podcast v5.dc.html`
läuft hier — Karte, Gutter-Aquarell, Wortmarke, beide Pets, Blasen-Spalte. Konsole: nur die bekannte
`sigmaRadians`-Warnung von three.js und der ungeklärte leere `SCRIPT`-Ladefehler, der im Projekt seit
SpinBallPop v3 mitläuft (`docs/spinballpop/HOUSEKEEPING.md` §5a).

---

## 5 Offen, mit Empfehlung

| # | Frage | Empfehlung |
|---|---|---|
| 1 | Boden-Anlage in SpinballCast: **A**, **B** oder **C** (§3) | **C** — Kachel in der Sendung, Stempel im Feld |
| 2 | `screenTile()` auch hier? (Blasengröße aus der Bodenplatte) | ja, sobald die Blasen dran sind (Georg: erst nach dem Spiel) |
| 3 | Vertrag v1.2.7 ins Repo (`media/3D_Assets/`) | offen seit v5 — blockiert die kanonische URL |
| 4 | Rückläufer ins Repo: `ground-plane.v1` mit `screenTile`, `bubble-shaper.v3` | unverändert offen (`HOUSEKEEPING.md` §oben) |
| 5 | **Die Pets teilen das untere Band mit den Scheren** (gemessen: Sitze auf Blatt-Unterkante, Scheren-Drehpunkt 0,062 Blatthöhen darunter) | in Georgs Mockup stehen die Pets **oben**; das ist eine Layout-Zahl, kein Scheren-Problem — entscheiden, dann `layout.v5` |
