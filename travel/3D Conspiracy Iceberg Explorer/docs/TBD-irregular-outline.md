# TBD (nächste Session) — Globale „irreguläre Outline" mit Varianz

## Befund (Georg, 2026-07-04)
Alle Fenster/Panels tragen denselben Wobble-Radius-Konstantwert. Die **untere
rechte Ecke** ist überall identisch und weicht optisch so stark von den anderen
drei ab, dass die Wiederholung das eine geteilte Outline-Konstrukt entlarvt →
wirkt mechanisch statt handgezeichnet. Betrifft App UND Report-Template.

Konkret der überall gleiche Wert (grep `6px 14px 4px 18px`):
`border-radius: 6px 14px 4px 18px / 12px 6px 18px 8px` (Fenster) bzw.
die kleineren `3px 9px…` / `4px 10px…` Varianten (Chips/Buttons) — jeweils EIN
fixer String, x-fach kopiert.

## Ziel
Eine **leichtgewichtige, globale** „hand-gezeichnete Outline" mit etwas
Randomness/Variation für alle Fenster, Buttons, Chips, UI-Elemente — ohne die
Inline-Style-Konvention (DC) oder Paint-Fallen (#3) zu verletzen.

## Optionen (in nächster Session abwägen)
1. **Radius-Pool + deterministischer Pick pro Element.** Kleine Helper-Fn
   `wob(seed, size)` in der Logic: wählt aus ~5–6 kuratierten Wobble-Strings
   anhand eines Seeds (z. B. Element-id/Index-Hash → stabil über Re-Renders,
   nicht bei jedem Frame neu). Gibt den `border-radius`-String zurück, inline
   gesetzt. Vorteil: bleibt Inline-Style, kein CSS-Klassen-Delay, deterministisch.
   - Größenklassen: `wob-lg` (Fenster), `wob-md` (Karten/Selects), `wob-sm`
     (Chips/kleine Buttons) — je Klasse 5–6 Varianten.
   - Rotation ist schon variabel (`rots[]`); Radius analog behandeln.
2. **Nur die auffällige Ecke brechen.** Wenn Pool zu viel Aufwand: pro Element
   einen kleinen Offset (±2–4px) auf die 4 Radius-Werte, seed-basiert. Minimal-
   invasiv, killt die „immer gleiche BR-Ecke" schon spürbar.
3. **SVG-Ink-Border (nur wenn 1/2 zu clean).** `border-image` mit leicht
   variierender hand-inked SVG-Kontur. Höheres Risiko (Falle #3: gestapelte
   Konstrukte), daher nur als Eskalation, nicht Default.

## Empfehlung
Start mit **Option 1** (Radius-Pool + seed-Pick), Größenklassen lg/md/sm.
- App: die Wobble-Strings in Logic zentralisieren, an den ~30 Fenster/Panel/
  Chip-Stellen durch `wob(seed, klasse)` ersetzen.
- Template `KayfabPaperDoc`: `--wob-lg/md/sm` sind heute fixe CSS-Vars →
  dort 3–4 Alternativ-Vars + per `nth-child`/manueller Klassen-Zuweisung
  streuen (Template hat keine Logic; rein CSS lösbar via mehreren `--wob-*a/b/c`
  und Rotation der Zuweisung, analog zur bestehenden `.toc a:nth-child`-Streuung).

## Akzeptanz
Zwei benachbarte Fenster nebeneinander dürfen NICHT dieselbe Eck-Signatur
zeigen. Effekt subtil halten (weiter „eine Familie", nur nicht kloniert).
Keine neuen Console-Errors, kein Paint-Ausfall, Inline-Style-Konvention gewahrt.
