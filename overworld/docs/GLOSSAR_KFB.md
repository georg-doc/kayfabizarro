# KFB Glossar — die eine Begriffstabelle

**Stand:** 10. August 2026 · **Besitzer:** WS1 (Lead) · **Format:** Kanon nach Georgs A1-Beschluss

> **ID = Implementierung · Label = Kanon / player-facing · Short = kompakte Darstellung.**
> Ein String macht nicht drei Jobs. Jede Zeile trägt ihre Quelle.

Diese Datei ersetzt konkurrierende Begriffstabellen (A1, Living Concept §16/§38, Masterplan-Prosa).
Wer einen Begriff ändert, ändert ihn **hier** und nirgends sonst. Unbelegte Zeilen tragen
`NEEDS_SOURCE` und gelten nicht.

## 1 · Die sechs Werte

| ID (Code) | Label (Kanon) | Short (HUD) | Bedeutung | Quelle |
|---|---|---|---|---|
| `bizarro` | Bizarro | `Biz` | Nahkampf / Tank-Äquivalent | Masterplan §4.4 · V10-S6 |
| `kayfabe` | Kayfabe | `Kay` | Fernkampf / »Magie«; zeigt im HUD die **Ladungen**, nicht den Rohwert | Masterplan §4.4 · `hud-v7.js` V10-S6f |
| `bingo` | **KayfaBingo** | `Bin` | gelandet / Treffer-Anerkennung | Georg 10.8. (Label) · Runner V10-S6 (ID) |
| `bongo` | **KayfaBongo** | `Bon` | den Takt halten, wenn der Raum kippt | Georg 10.8. (Label) · Runner V10-S6 (ID) |
| `boggle` | **KayfaBoggle** | `Bog` | umstellen, was alle schon gesehen haben | Georg 10.8. (Label) · Runner V10-S6 (ID) |
| `bloedsinn` | **BLÖDSINN!** | `Blö` | Einspruch / Kayfabe-Bruch | Masterplan K2 · V10-S6 · Kurzform Georg 10.8. |

**Alle drei Ebenen sind gebaut (10.8.).** `short` ist ein eigenes Feld in `STAT_INFO`
(`overworld-game-v10.js`), das HUD liest es (`hud-v7.js`, `kurz()`). Der Schnitt aus dem Namen bleibt
nur als Rückweg für einen Runner ohne `short`.

**Warum das Feld nötig war — der Befund, der Georgs Label-Beschluss beinahe gekostet hätte:** das
Kürzel war `name.slice(0,3)`, also abgeleitet und nirgends gesagt. Mit den kanonischen Etiketten
hätte diese Ableitung **Kay · Kay · Kay** ergeben — KayfaBingo, KayfaBongo, KayfaBoggle und Kayfabe
beginnen mit denselben drei Buchstaben. Vier gleiche Kürzel in einem Panel mit sechs Zahlen, und die
Farbe wäre der einzige Unterschied gewesen. Ein Etikett zu ändern, das jemand anders zerschneidet,
ist keine Textkorrektur.

**`Blö` war nie eine Kennung.** Die Zeichenfolge `BLÖ` existierte in keiner Zeile Code — sie war
der Anfang des Etiketts `BLÖDSINN!`. Die ID hieß und heißt `bloedsinn`. Damit ist die Korrektur
reine Darstellung und keine Migration, wie erhofft.

**Erster Auftritt, Tooltip, Hilfe/FAQ und Inspektion zeigen immer das Label**, nie das Kürzel.
WS0-Regel dazu: `card-rail-v9b.js` normalisiert auf `ID = bingo/bongo/boggle` und die
Zwei-Buchstaben-Kürzel (`BO`, `BG`) fallen weg. Keine ID-Migration im Runner.

## 2 · Abgeleitete und getrennte Größen

| ID | Label | Bedeutung | Quelle |
|---|---|---|---|
| `fluff` | Fluff | **Lebenspunkte, abgeleitet** `4 + Summe/3`. Kein siebter Wert, nicht kaufbar, nicht gespeichert — `fluffOf()` rechnet | Masterplan §4.4 · V10-S6 |
| `pop` | POP | Fortschritts-Währung (XP-Äquivalent). `pop` = Kontostand, `popTotal` = Lebenssumme | Masterplan §6 · V10-S6 |
| `rep` | Ruf / »Ruhm« | zweite Währung, Fraktionen, **getrennt von POP** | Masterplan §4.4 · `factions.js` |
| — | Effective Power | unsichtbare Rechengröße zur Gegner-Zuordnung, **getrennt** von sichtbarer Prahlerei | Living Concept §55 · A1 |
| — | Kayfabe-Power | die sichtbare Behauptung (`+12% DESTROY EVERYTHING`) — Zahl als Beweisstück | Masterplan K1 (geschärft 10.8.) |

**Kein sichtbares Spieler-Level.** `hero.lv`/`hero.xp` sind eingefroren auf 1 und 0.

## 3 · Der Doppelbegriff

| Ebene | `Kayfabe` bedeutet | Quelle |
|---|---|---|
| **Player-facing** — Welt, HUD, UI, Karten, Chatter | der **Wert** (`Kayfabe +3`, `Kayfabe Rank`) | Georg 10.8. · Masterplan K7 |
| **Intern** — Konzept, Masterplan-Prosa, Chat | der **Realitätsrahmen** von KFB | Georg 10.8. · Masterplan §2.1 |

`K-Fabe` ist **gestrichen** (nur Living Concept §16, kein Code, kein Masterplan).

## 4 · Semantik und Erzählung

| Label | Bedeutung | Quelle |
|---|---|---|
| Closure | der Beitrag des Spielers zur Bedeutung (McCloud) | A1 · Living Concept §148 |
| Closure Operator | das gewählte Satzband zwischen zwei Karten: BECAUSE · BUT · SO · THEN · MEANWHILE · AGAIN | Living Concept §148.2 (A6 v0.2) |
| AND THEN | legales **Anti-Closure**; dreimal in fünf Karten → Publikum BOO, König −1 Quest Die, **kein** Fehlerzustand | Living Concept §148.4 |
| Kayfabulation / kayfabulieren | das Erzählen der Geschichte beim König | Masterplan K2 |
| Story-Modi | Tragic · Comic · Absurd · Heroic · Mystical · Forbidden — **englisch** | Masterplan K3 |
| Story Mode Die | wählt den Erzählmodus | Living Concept §144 |
| Quest Die | Quest-Fortschritt, läuft auf 6 — **nicht** dasselbe wie der Story Mode Die | Living Concept §144 |
| Journey Evidence | verdichtete Belege, **kein** Roh-Mitschnitt jeder Handlung | A1 · Living Concept §140 |

## 5 · Karten und Orte

| Label | Bedeutung | Quelle |
|---|---|---|
| Actor Card | narrative Identität des Spielers, erster Almanach-Eintrag | Living Concept §13 |
| Scene Card | erspielte Karte aus einer geräumten Zone | Living Concept §11 |
| Quest Card | die vom König verlangte Schlusspointe | Living Concept §11 |
| Action Card | Fähigkeit im Slot — gefunden, gelootet, erobert; **getrennt** vom Story-Deck | Masterplan §4.4 · Living Concept §51 |
| Card Zone | begehbares Kartenblatt in der Welt, Kante = Tuschefeder | Masterplan §4.4c · V10-S2b |
| Fractal Almanac | dauerhafte Kartensammlung; Karten werden **nicht** verbraucht | Living Concept §12 |
| Content Surface | der Kartenteller trägt freie AR: Karte · Video · Demo · HTML (Rickroll-Kayfabe ist Kanon) | Masterplan, Georg 9.8. |
| 1 Deck = 56 Karten = 1 Welt | Welten dürfen sparse oder kartenfrei sein | Masterplan, Georg 9.8. |

## 6 · Stimmen und Ebenen

| Label | Bedeutung | Quelle |
|---|---|---|
| ChatterBox | die **Präsentationsebene** für Sprache (Blase, Timing, Emote) | A1 |
| Chatter | die Laufzeit im Runner; Fraktions-Phrasen sind WS0-Inhalt | Masterplan §6, 9.8. |
| NIE | semantischer Upstream | A1 — `NEEDS_SOURCE` für den ausgeschriebenen Namen |
| Mask | Performance-Ebene einer Figur | A1 |
| Historian | Erzähler als Gedächtnis-Schnittstelle der Journey; **Geschichte ist Daten, Erzählung ist Deutung** | Living Concept §F.11 |
| Wiseguy | normaler Mob mit besonderer Maske; **keine Witzmaschine**. Grammatik: `Fragment → Wendung → Lücke → Closure`. Grenze: 3 Fehlschläge oder ~8 s → Puff | A1/A2 · Masterplan §7.9 |
| Pottymouth | Eskalationsregister, **nicht** Dauerstimme. Regel: **1 Glyph, maximal 3** | Living Concept, A5.1 |
| P1 / P2 (Schmähruf) | P1 = soziale Abfuhr · P2 = Statusangriff. P2 ändert die **Bedeutung**, nicht die Lautstärke. Umbenannt aus K1/K2 (Georg 10.8., Namensraum-Hygiene, **keine** Verhaltensänderung) | Living Concept §147 (A5) · Georg 10.8. |
| Titel | kosmetische soziale Identität, **keine** Spielkraft. Vorgabe `Newbie`; Tutorial-Titel `Leichenfledderer` | Living Concept §146 (A3) |

**Namensraum, entschieden 10.8.:** `K1`/`K2` gehören **allein** den Kanon-Regeln des Masterplans.
Die Eskalationsstufen der Schmährufe heißen ab jetzt `P1`/`P2` (Pottymouth). Reine Hygiene, kein
Verhalten geändert. Der Runner führte keine der beiden Kennungen (`chatter-phrases.js`: kein Treffer),
also kostet die Umbenennung nichts — sie betrifft nur Papiere.

## 7 · Eigennamen — nie übersetzen

Uncle FrizzleBob · King Kayfabian · Kayfabulation · **BLÖDSINN!** · *Stay fluffy.* ·
Leichenfledderer

> **UI-Sprache EN, Eigennamen deutsch** (Masterplan K6). `Leichenfledderer` ist kein deutsches Wort
> in englischem Text, sondern ein Eigenname wie BLÖDSINN!.

## 8 · Statusvokabular

**Handoffs** (A1, angenommen 10.8.): `BUILT · PARTIAL · OPEN · HOOK · DEFERRED · REJECTED · NEEDS_SOURCE`

**Masterplan intern** (seit 9.8., »GILT« ist raus): `LÄUFT` (mit Beleg) · `GEBAUT` · `ENTSCHIEDEN` ·
`OFFEN` · `GEPARKT`

Die beiden Reihen sind absichtlich verschieden: das Handoff-Vokabular beschreibt, was ein **anderer**
Workspace vorfindet; das interne beschreibt, was **hier** gilt.

## 9 · Was hier nicht hineingehört

Achsenwerte eines Spielermodells (`trust`, `agency`, `confidence 0.7`) sind **keine Begriffe, sondern
Daten** — und werden nach dem Beschluss vom 10.8. nicht gespeichert. Das Journey-JSON enthält
Kartenreferenzen und Closure-Operatoren. Sobald ein Achsenwert im Speicherstand steht, ist es ein
Profil, unabhängig vom Namen.
