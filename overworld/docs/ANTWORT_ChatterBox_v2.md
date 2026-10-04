# Antwort auf ChatterBox v2 / Living Concept v12 — von WS1 (Lead), 9. August

Konzeptionell stark, und §15 trifft S17 genau: **Upstream-Event, kein zweiter Renderer.** Nichts
daran zu korrigieren. Vier Punkte, wo das Dokument auf unseren Code trifft — zwei davon sind
technische Fallen, die jemand sonst teuer baut.

---

## 1 · Streaming-Text kollidiert mit der Blasengeometrie (§13.3)

»Streaming ON« als Standard ist richtig gedacht und in der naiven Umsetzung kaputt.

Unsere Blase misst den fertigen Textblock (`box.offsetWidth/offsetHeight`) und baut daraus den
**Konturpfad** — jittriges Rechteck, Zipfel an der Kante, Schulterpunkte bei 55 %. Wenn der Text
zeichenweise wächst, wächst die Box mit, also wird der Pfad bei **jedem Zeichen neu gebaut**. Der
Jitter ist zwar seed-stabil, aber die Kantenlängen ändern sich — die Kontur zappelt, und der Zipfel
wandert, während man liest.

**Die Regel, die ins Doc gehört:**

> Die Geometrie wird **einmal aus dem vollständigen Text** gemessen; der Text streamt **in die
> fertige Blase hinein**.

Kostet nichts (unsichtbarer Textblock zum Messen, sichtbarer zum Streamen) und ist der Unterschied
zwischen »lebendig« und »wackelt«. §13.3 sagt bereits »Streaming speed ≠ reading speed« — das hier
ist der Zwilling: **Streaming ändert den Inhalt, nie die Form.**

## 2 · Zwei Blasenarten, zwei Timing-Regeln (§12, §13.1)

Das Timing-Kapitel behandelt alle Blasen gleich. Im Code sind es zwei Dinge:

| | Ambient-Chatter (`chatter-2d.js`) | Bedienbare Blase (`bubble-ts.js`) |
|---|---|---|
| gezeichnet auf | Leinwand | DOM/SVG-Overlay |
| Anzahl | viele gleichzeitig | **immer nur eine** |
| Ende | **Uhr** (Lesezeit + Dwell) | **der Spieler** — sie trägt Knöpfe |
| Timing-Regeln aus §12 | gelten voll | gelten für die Antwort**verzögerung**, nicht für die Standzeit |

Eine Blase mit `attack · ask · taunt · philo · trade · leave` darf nicht nach 2,7 s verschwinden,
während der Finger unterwegs ist. Umgekehrt braucht der Ambient-Chatter genau die Uhr aus §12.
**Die 15 CPS gelten für das, was die Welt sagt, nicht für das, was sie fragt.**

## 3 · Shout fehlt uns wirklich (§14.1)

Richtig erkannt: wir haben `speech · thought · whisper`, kein `shout` — und **BLÖDSINN!** ist genau
der Fall, für den es gebaut gehört. Der Weg dahin ist seit V10-S15 kurz: die gestrichelte Feder hat
gezeigt, wie eine vierte Kontur entsteht, ohne eine zweite Zeichenlogik zu bauen (`dashedBands()`
liefert Geometrie, Canvas und SVG teilen sie). Ein Zackenrand ist dieselbe Übung.

Eine Bitte: **Bangers und Irish Grover nicht beide.** Irish Grover läuft bereits im HUD und auf den
Karten. Eine zweite Auszeichnungsschrift für einen Sonderfall ist eine zweite Wahrheit über »laut«.

## 4 · Das Duell braucht ein Ende (§11.6)

Der ausweichende Wiseguy ist ein guter Gag und wird ohne **Abbruchbedingung** zur Frustquelle — der
Unterschied zwischen »der Typ ist unmöglich« und »das Spiel ist kaputt« ist, dass der Spieler sieht,
wann es vorbei ist. Vorschlag: nach **drei** vergeblichen Schlägen oder ~8 s kommt das Puff, egal
wie gut der Spieler zielt. Der Gag ist die Unerreichbarkeit, nicht die Dauer.

Und ein Zusatz, der nichts kostet: **er darf einmal getroffen werden**, wenn der Spieler ihn in eine
Ecke treibt. Ein unbesiegbarer Witzbold ist eine Regel; ein fast unbesiegbarer ist eine Geschichte.

---

## Klein, aber für ein SSOT-Dokument wichtig

Die Nummerierung ist doppelt vergeben: **§13** existiert zweimal (»Browser QA Slice — Timing Lab«
und »Speech Bubble Readability«), **§14** ebenfalls (»Proposed Initial Defaults« und »Comic Bubble
Grammar«). Bei einem Living Doc, auf das drei Workspaces verweisen, wird das beim ersten
»siehe §13« teuer.

---

## Was hier ohne weitere Absprache gebaut werden kann

1. **Shout-Modus** — vierte Kontur, Zackenrand, dieselbe Fläche wie Blase + Zipfel. Klein.
2. **Denkblasen für Tiere und arbeitende Units** (§13.7/13.8) — Schaf, Schwein und die Wächter am
   Wegesrand haben schon Blasen; sie brauchen nur `type:'thought'` und einen eigenen, sparsamen
   Takt. Der Goblin mit »Arbeitstiere — das sind wir…« ist ein Zweizeiler im Vorrat.
3. **Geometrie-vor-Streaming** (§1 oben) — die Voraussetzung für alles Weitere in §13.

**Nicht** ohne Georgs Wort: Speaker's Corner, Abyss, Karaoke, Disco. Die sind im Doc korrekt als
Hooks markiert, und jeder einzelne ist ein eigener Slice.

**Stay fluffy.**
