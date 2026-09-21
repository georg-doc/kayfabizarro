# Briefing WS0 — Lulls-Skins: Kopf-Anker, Follow-Anker, Cartoon-Physik

**Von:** WS1 (Lead) · **Stand:** 2026-08-10 · **Paket:** eigenständig, blockiert nichts
**Vorgeschichte:** Titel sind Trophäen ohne Wirkung (V10-S20). Georg will je Titel optional einen
**Lulls-Skin** — rein visuell, absurd, ohne jeden Bonus.

---

## 1 · Was gebaut werden soll

Ein Satz **Skins**, die an einer Einheit hängen und sich selbst bewegen. Kein neues Rendersystem,
kein Partikelmotor: **Frankensteining aus vorhandenen Assets** plus etwas Bewegungslogik.

Zwei Aufhängungen, mehr nicht:

### A · Kopf-Anker — alles schwebt

Das Ding sitzt **über oder am Kopf** und ist nicht am Sprite festgeklebt: es hat eine eigene
Trägheit, hängt nach, schwingt aus. Dieselbe Grammatik wie unsere Sprechblase: **Totzone plus
weiches Nachziehen** (`bubble-ts.js`, Kennzahlen `dead 44`, `lazy 0.10`). Der Kopfpunkt ist
`u.y - bodyH*sizeMul`.

Wichtig: es schwebt **immer**, auch im Stand. Ein Ding, das nur beim Laufen wackelt, sieht aus wie
ein Fehler in der Animation.

### B · Follow-Anker — Luftballon und unsichtbare Hundeleine

Etwas folgt der Einheit im **Abstand**, an einer gedachten Schnur:

- **Luftballon** — steigt, zieht seitlich weg, kommt zurück
- **unsichtbare Hundeleine** — ein Schaf oder ein gefangener Troll trottet hinterher, mit
  **Ruck**: er bleibt stehen, die Leine spannt, er wird gezogen. Das Ruckeln ist der Witz.

Der Unterschied zu A ist nicht die Entfernung, sondern die **Physik**: A schwingt um einen Punkt,
B wird gezogen und bremst.

---

## 2 · Die Motive (kreativ auslegen, nicht wörtlich nehmen)

Georgs Liste, mit dem, was daran cartoonhaft ist:

| Motiv | Der Witz liegt in … |
|---|---|
| **Glubschauge** | es folgt dem Spieler, nicht der Blickrichtung der Einheit. Zwei Augen, die verschiedene Dinge ansehen, sind besser als zwei, die dasselbe tun |
| **Plappermund** | er bewegt sich, **wenn niemand spricht**. Ein Mund, der zur Blase passt, ist Lippensynchronität; einer, der ohne Anlass plappert, ist ein Gag |
| **Pilzkappe** | zu groß, zu schwer, kippt beim Anhalten nach vorn und richtet sich auf |
| **Goldmünze** (Mario-Spoof) | sie dreht sich in der immer gleichen Frequenz und macht *immer* dasselbe Geräusch — die Unbeirrbarkeit ist der Gag |
| **Explosion / Rauch** | eine **Gewitterwolke**, die über dem Kopf bleibt und gelegentlich blitzt. Kein Effekt, der endet, sondern ein Zustand |

**Und die Regel, die alles zusammenhält:** ein Skin darf **nichts können**. Er darf auch nicht
*aussehen*, als könne er etwas. Ein Skin, der stark wirkt, wird als Bonus gelesen und bricht K1
(keine Zahlen, keine Boni) — auch wenn er keinen hat. **Absurd ja, mächtig nein.**

---

## 3 · Cartoon-Physik — vier Regeln, mehr braucht es nicht

Aus dem, was hier schon gebaut ist (`game-feel.js`, `bubble-ts.js`, die BLÖDSINN!-Regie):

1. **Nachhang statt Kopplung.** Alles folgt weich, nichts sitzt fest. Faktor um 0,10 je Bild.
2. **Anhalten ist eine Bewegung.** Beim Bremsen kippt das Ding nach vorn und schwingt zurück —
   das ist der billigste Weg zu Gewicht.
3. **Überschwingen und nachprellen**, nicht sanft einlaufen. Zwei Prellungen reichen (die
   BLÖDSINN!-Landung nutzt genau das).
4. **Nichts wird ausgeblendet, alles wird ausgeworfen.** Ein Skin, der verschwindet, tut es mit
   einem Puff, nicht mit einem Alphawert.

**Was NICHT gebaut wird:** keine Physik-Bibliothek, keine Kollision zwischen Skins, kein Sortieren
nach Tiefe über das hinaus, was die Einheit ohnehin macht. Wenn zwei Skins sich überlappen, ist das
ein Comic, kein Fehler.

---

## 4 · Die Aufhängung im Code (unser Vertrag)

Ein Skin bekommt je Bild:

```js
{ x, y,            // Fußpunkt der Einheit, Weltpixel
  bodyH,           // gemessene Tintenhöhe (Oberkante = y - bodyH)
  face,            // -1 links, +1 rechts
  state,           // 'idle' | 'run' | 'attack' | 'hit' | 'dead'
  moved,           // in diesem Bild gelaufene Strecke (Weltpixel) — die Uhr fürs Laufen
  dt }
```

`moved` ist wichtig: **Laufen hängt an der Strecke, nicht an der Zeit** (aclock-v1.1). Ein Skin, der
seine Bewegung aus `dt` zieht, schwebt genauso wie ein Sprite es täte.

Gezeichnet wird auf **derselben Leinwand**, im Weltmaßstab, nach der Einheit. Bitte **kein**
DOM-Overlay: das Blasen-Overlay ist die eine Ausnahme, und es ist eine, weil es Knöpfe trägt.

**Rückgabe an uns:** ein Modul `overworld/skins-2d.js` mit
`OW_SKINS.draw(ctx, skinId, u, dt, moved)` und `OW_SKINS.list()`. Mehr Schnittstelle brauchen wir
nicht — wer welchen Skin trägt, entscheidet das Titel-System hier.

### Nachtrag 10.8. — die vier Löcher, die WS0 gefunden hat

Alle vier berechtigt. Drei sind zu, eines ist eine Entscheidung.

**1 · Wer ruft `draw()`? — zu, der Haken ist gebaut** (V10-S22). Der Zeichenpfad gehört dem Runner,
also gehört der Haken dorthin; ihr greift nirgends ein. Er sitzt **nach der Einheit und vor dem
Etikett** — ein Skin liegt über der Figur, aber unter ihrer Beschriftung. Getragen wird er von
`u.skin` (ein String, den das Titel-System setzt); ohne `OW_SKINS` passiert nichts, und eine
werfende `draw()` wird einmal gemeldet statt das Bild zu töten.

**2 · Zustand — euer, nicht unserer.** Die Signatur bleibt zustandslos, die Physik nicht: führt den
Zustand **intern** mit Schlüssel `(Einheit × skinId)`. Wir geben euch keine ID mit; nehmt die
Einheit selbst als Schlüssel (WeakMap) — dann räumt sich das mit dem Mob von allein auf.

**3 · Zwei Uhren — zu, beide kommen jetzt an.** `dt` fürs Schweben (auch im Stand), `moved` für
alles, was am Laufen hängt. Stand im Fließtext, fehlte im Vertrag; mein Fehler.

**4 · Der Luftballon hat kein Blatt.** Entscheidung: **zeichnen, nicht einkaufen** — ein Ballon ist
eine Ellipse mit Glanzpunkt und einer Schnur, und er soll ohnehin nach unserer Feder aussehen, nicht
nach einem fremden Pack. Nehmt die Kanon-Tusche (`cardbuilder/kfb-ink-canon.js`); dann passt er
zur Kartenkante statt daneben zu liegen.

**Und eure zwei Ergänzungen, beide angenommen:**

- **Die K1-Regel braucht einen Testfall statt einer Absichtserklärung.** Richtig. Im Showroom:
  Skin **neben einen echten Effekt** stellen (Kayfabe-Ladung, Treffer-Aufblitzen) und einen Dritten
  fragen, welcher davon etwas kann. Wer den Skin nennt, hat den Beweis geliefert — dann ist er zu
  stark, egal wie hübsch er ist.
- **Die Goldmünze ist ein Klangthema.** Ja, und sie fällt unter `cap_polyphony 4`. Wichtiger noch:
  ihr Gag ist die **Unbeirrbarkeit** — dieselbe Frequenz, derselbe Ton, immer. Ein Klang, der
  variiert, ist kein Gag mehr, sondern eine Vertonung. Wenn vier Münzen gleichzeitig laufen und der
  Deckel greift, ist das richtig so: die fünfte schweigt und dreht sich weiter.

---

## 5 · Showroom

Ein eigenes Blatt zum Abnehmen und Schrauben, wie euer UI-Baukasten-Musterblatt:

- **jeder Skin einzeln**, auf einer Einheit, die man **laufen, anhalten, springen und sterben**
  lassen kann — die vier Zustände, in denen sich Cartoon-Physik entscheidet
- **Regler** für die zwei bis drei Zahlen, die den Charakter ausmachen (Nachhang, Überschwingen,
  Amplitude) — nicht für alles
- **nebeneinander**: zwei Skins auf derselben Einheit, damit man sieht, ob sie sich beißen
- **eine Zeile Messwerte** je Skin: Zeichenzeit in ms je Bild. Zehn Skins, die je 0,4 ms kosten,
  sind 4 ms — das ist ein Drittel unseres Budgets für den Boden.

Abnahmefrage: **»Sieht das aus wie etwas, das jemand aufgeklebt hat — oder wie etwas, das dazu
gehört und trotzdem nicht hingehört?«** Das zweite ist das Ziel.

---

## 6 · Reihenfolge

Fangt mit **zwei** an, einem je Aufhängung: **Glubschauge** (Kopf-Anker) und **Luftballon**
(Follow-Anker). Wenn die beiden im Showroom sitzen, ist die Physik bewiesen und der Rest ist
Fleißarbeit. Erst dann Pilzkappe, Münze, Gewitterwolke, Plappermund.

Und: **kein Titel-Mapping bei euch.** Welcher Skin zu welchem Titel gehört, entscheidet Georg mit
ChatGPT (Auftrag K1) — ihr baut die Skins, nicht die Zuordnung.

## 7 · Was wir zurückgeben

Nach eurem Check-in hier: Einbau ins Titel-System, Abnahme über den echten Bedienweg (Titel wählen →
Skin erscheint), und die Zeichenzeit im Changelog. Wenn ein Skin teurer ist als er wirkt, sagen wir
es mit Zahlen, nicht mit Geschmack.

**Stay fluffy.**
