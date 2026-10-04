# Konzept-Aufträge für ChatGPT und Coworker — Stand 10. August 2026

Fünf Aufträge, die **hier nichts blockieren** und deren Ergebnis direkt einbaubar ist. Alle nach
derselben Grenze: **Inhalt und Struktur dort, Laufzeit hier.**

Reihenfolge, wenn ihr wählen müsst: **K1 → K5 → K3 → K2 → K4.** K1 ist neu vorn, weil Georgs
Präzisierung vom 10.8. den Auftrag deutlich größer und interessanter macht.

---

## K1 · Der Titel-Katalog — Achievement, Loot und Pool

**Georgs Präzisierung (10.8.):** Titel sind **Achievements, Loot und ggf. Pool** — mit
Kayfabe/Bizarro-Vibe. Das Register: **Wrestling-Tropes treffen satirische RPG-Tropes.**
Dazu: **sechs unique Angles**, und optional je ein passender **Lulls-Skin als »Skill«** —
rein visuell-absurd, ohne jede Wirkung.

Das ist ein anderer Auftrag als »20 Titel schreiben«. Der Kern ist die **Herkunftsart**, nicht die
Menge: ein Titel, den man *findet*, fühlt sich anders an als einer, den man *verdient*, und wieder
anders als einer, den man *zugewiesen bekommt*.

### Die drei Herkunftsarten (bitte unterscheiden)

| Art | Wie man ihn bekommt | Beispielhafte Logik |
|---|---|---|
| **Achievement** | eine Tat, die messbar ist | drei Schweine ohne Grund → *Scourge of Swine* |
| **Loot** | er fällt aus einer Kiste, einer Zone, einem Deck | man hat ihn, ohne ihn verdient zu haben — und das ist die Pointe |
| **Pool** | zufällig gezogen aus einem Vorrat, seed-gebunden | zwei Spieler derselben Welt tragen andere Titel |

Für jeden Titel bitte angeben, aus welcher Art er kommt. Ein Titel, der in allen dreien funktioniert,
ist meistens keiner von dreien.

### Die sechs Angles — Vorschlag, damit nicht sechsmal dasselbe kommt

Sechs *Winkel*, nicht sechs *Themen*. Jeder hat eine eigene Komik-Mechanik:

1. **Kayfabe-Rang** — der erfundene Titel, den nur der Träger ernst nimmt.
   *Undisputed Something · Interim Champion of Nothing.*
2. **Jobbing** (Wrestling: der, der verliert, damit andere gut aussehen) — der Titel für
   Niederlagen. *Ate the Pin · Reliable Loser.*
3. **Heel Turn** — der Titel, den man bekommt, weil man sich schlecht benommen hat. Deckt sich mit
   dem Ruf-System: wer bei −9 angegriffen wird, hat sich das erarbeitet.
4. **Gimmick** — der Titel als Kostüm: eine Rolle, die nichts mit dem Können zu tun hat.
   *Man of the People (self-appointed).*
5. **Shoot** (Wrestling: der Moment, in dem jemand aus der Rolle fällt) — der Titel, der die vierte
   Wand streift. Selten, und nur wenn er wirklich sitzt.
6. **Statistician's Revenge** — der Titel für absurd spezifische Zahlen. *Fourth-Best in This Cave.*
   Die Komik liegt darin, dass jemand mitgezählt hat.

Wenn ihr einen Winkel für schwach haltet: **ersetzt ihn und sagt warum.** Sechs gute sind besser als
sechs vorgegebene.

### Der peinliche Titel

Die Frage, die den Katalog gut macht: **welche Titel will man nicht zeigen?** Einer, den man
versteckt, ist mehr wert als einer, den jeder trägt — und »kein Titel« ist eine gültige Wahl, also
muss es einen Grund geben, sie zu treffen. Angle 2 und 6 sind dafür die naheliegenden.

### Der Lulls-Skin

Optional je Titel ein **rein visueller Zusatz** ohne jede Wirkung — ein Hut, eine Aura, ein
Fußabdruck, eine Farbe. Zwei Bedingungen: er darf **nichts können** (K1: keine Zahlen, keine Boni),
und er muss **absurd** sein, nicht cool. Ein Skin, der stark aussieht, wird als Bonus gelesen und
bricht die Regel, auch wenn er keinen hat.

Was ihr liefert: für jeden Titel eine Zeile Beschreibung des Skins — **nicht** die Grafik. Ob und
wie er gebaut wird, entscheidet sich später mit WS0.

### Format

```js
{id:'pigsbane', name:'Scourge of Swine', angle:'heel', art:'achievement',
 woher:'drei Schweine ohne Grund',
 bedingung:'hunt >= 3',                 // lesbar aus {hunt, collected, rep, shouts, zones, decks}
 skin:'ein einzelnes Borstenhaar, das immer im Bild bleibt'}
```

**Umfang:** 24–36 Titel, verteilt über die sechs Angles und die drei Herkunftsarten. Name ≤ 28
Zeichen (er steht in einer HUD-Zeile). Sprache Englisch, Eigennamen deutsch.

**Was wir schon haben** (nicht doppeln): Newbie · Scourge of Swine · Keeper of Evidence ·
The Unwelcome · Professionally Loud.

---

## K5 · Mini-Story-Beats für die Tutorial-Zone

Das Gerüst läuft (`OW_STORY`), der Inhalt fehlt. Gebraucht: **eine vollständige Zone** —
Skelett/Graveyard — mit Beats für alle sechs Anlässe (`enter · guard · fight · win · reveal ·
leave`), plus **zwei Alternativ-Beats je Anlass** für den zweiten und dritten Besuch.

Das ist der Testfall, an dem sich zeigt, ob sechs Anlässe reichen. Die Antwort darauf ist wertvoller
als weitere Konzeptseiten — wenn ihr beim Schreiben merkt, dass ein siebter fehlt, sagt welcher und
wofür.

Format je Beat: `{on, who:'guard'|'mob'|'narrator', text, type:'speech'|'thought'|'whisper'|'shout'}`.
Eine Blase, nie zwei. `reveal` kommt **1,6 s nach** `win` — der Satz darf die Karte nicht verraten,
bevor man sie sieht.

---

## K3 · Der Witzpool (Wiseguy)

Nicht brillante Witze, sondern **flaches Material mit gutem Timing** (Fips-Asmussen-Logik). Drei
Teile:

- **(a)** 30–40 kurze Witze, nach Fraktion sortiert
- **(b)** das **Duell-Geplänkel**: was ruft er beim Ausweichen, in Steigerung über drei Runden
- **(c)** der Abgangssatz vor dem Puff

Länge: eine Blase, nie zwei. Die harte Grenze steht schon: **drei Fehlschläge oder acht Sekunden**,
dann Puff — und **ein Treffer ist möglich**, wenn der Spieler ihn in die Ecke treibt.

---

## K2 · Schmährufe je Fraktion

Sechs Register liegen als Muster vor, je drei bis vier Zeilen. Gebraucht: **je sechs**, plus zwei
neue Lagen (Publikum, Hofwache).

Zwei Regeln: `{who}` ist die Stelle für »Titel Name«, und der Satz muss **auch ohne Titel**
funktionieren. Und: **Steigerung** — bei Ruf −3 klingt es anders als bei −9, kurz vor dem Angriff.
Zwei Stufen je Fraktion wären das Ziel.

Neu relevant durch K1: wenn ein Spieler einen **peinlichen** Titel trägt, sollte mindestens eine
Zeile je Fraktion darauf anspielen können. Das ist der Punkt, an dem Titel und Schmähung sich
gegenseitig verstärken.

---

## K4 · Deck → Avatar-Skin (Trophäen-Mapping)

Jedes gekaufte Deck schaltet einen Avatar-Skin frei. Gebraucht ist **nicht** der Code, sondern die
**Zuordnung**: welches Deck, welcher Skin, welche Rolle spielt er im Meta-Narrativ dieser Welt.

Die Frage, die vorher zu klären ist: ist der Skin **kosmetisch** (dann Trophäe, K1-konform) oder
**narrativ** (dann Teil der Zonen-Mini-Story) — oder beides, und wie hält man das auseinander?
Nach K1 kommt eine zweite dazu: wie verhält sich der Deck-Skin zum **Lulls-Skin** aus dem
Titel-System? Zwei Skin-Quellen, die nichts voneinander wissen, ergeben zwei Wahrheiten darüber,
wie der Held aussieht.

**Stay fluffy.**
