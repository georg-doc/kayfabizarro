# NIE-Adapter — der Vertrag, bevor ihn drei Workspaces erfinden

**Status:** Architektur-Hook, **nicht gebaut**. WS1 (Lead), 10. August 2026.
**Anlass:** ChatGPTs Vorschlag eines Request/Response-Contracts. Angenommen — und hier festgeschrieben,
weil ein Vertrag, den drei Workspaces gleichzeitig erfinden, drei Verträge sind.

---

## 1 · Die Rollen, wie sie jetzt stehen

```
NIE              semantischer und struktureller Upstream (Konflikt, Ironie, Soziolekt)
FrizzleBob-Masken  Performance-Schicht (Fixer · Analyst · Carny · Bedside · RapGod · Mensch)
ChatterBox       Welt-Präsentation (wer wann spricht, Budget, Sprecherwahl)
Bubble/Emote/TTS Ausgabe
```

**Card Seed bleibt König.** Ein Kant-Seed bleibt Kant und wird nicht von einem generischen
Goblin-Prompt überschrieben. Das ist seit V10-S21 auch im Code so: die Karte wird vor der
Schlagzeile befragt.

---

## 2 · Der Vertrag

### Anfrage

```js
{ seed, source,            // Kartentitel/Lore, oder Schlagzeile, oder Ort
  faction, role,           // wer spricht, in welcher Funktion
  situation, relationship,  // was gerade passiert, wie er zum Spieler steht
  mask, heat,              // Performance-Maske, Content-Intensität
  language, bubble_type,
  length_budget,           // Zeichen, nicht Wörter

  /* Drei Felder, die in keinem Entwurf standen und ohne die der Vertrag nicht trägt: */
  fallback,                // was gesagt wird, wenn nichts kommt — IMMER gesetzt
  deadline_ms,             // ab wann der Fallback gilt. Vorschlag: 700
  context_budget }         // siehe §3
```

### Antwort

```js
{ text, speaker, tell,     // `tell` = was er WILL, sichtbar im Emote
  bubble_type, emote_hint, timing_hint }
```

---

## 3 · Zwei Budgets, dieselbe Haltung

ChatGPTs bester neuer Gedanke, und er gehört fest hinein:

> **Eine Blase braucht nur so viel Welt, wie ihr Beat bezahlen kann.**

Die Reihenfolge, in der Kontext zugeteilt wird:

```
Card Seed  >  unmittelbare Lage  >  Fraktions-Weltbild  >  Beziehung
           >  lokale Geschichte  >  globaler/RSS-Kontext
```

Damit hat KFB jetzt **zwei** Budgets, und sie sagen dasselbe auf zwei Ebenen:

| Budget | Grenze | Was es verhindert |
|---|---|---|
| **Präsentation** (V10-S19) | 2 Blasen in der Welt, 1 je Zone | die Welt wird zu Untertiteln |
| **Kontext** (hier) | Stufen 200 / 800 / 2000 Zeichen | eine Blase will die ganze Welt tragen |

---

## 4 · Was am Vertrag fehlte — drei Punkte

**1 · Der Fallback ist kein Notfall, er ist der Normalfall.** Ohne LLM-Antwort muss eine Zeile da
sein, und zwar **bevor** gefragt wird. Der Vorrat (`OW_PHRASES`) ist dieser Fallback, und deshalb
darf die Anfrage nichts voraussetzen, was er nicht auch liefern kann. *Ein guter kurzer statischer
Satz schlägt einen genialen, der zwei Sekunden zu spät kommt.*

**2 · Eine Frist, keine Warteschlange.** `deadline_ms` gehört in die Anfrage, nicht in die
Implementierung — sonst entscheidet jeder Aufrufer anders, wie lange die Welt schweigt. Vorschlag
700 ms, weil eine Blase nach einer Sekunde nicht mehr zum Anlass gehört.

**3 · Die Antwort darf abgelehnt werden, und jemand muss es tun.** Ein LLM liefert manchmal Murks:
zu lang, falsches Register, ein Toaster-Gag. Der Vertrag braucht eine **Annahmebedingung**, sonst
landet der Murks in der Welt:

```
Länge ≤ length_budget          · sonst Fallback
kein Em-Dash, kein Emoji       · Layer Zero, prüfbar
keine Zahl, kein Wert          · K1
besteht den Register-Test      · nur ein Mensch oder ein zweiter Durchlauf kann das
```

Die ersten drei sind **maschinell prüfbar** und gehören in den Adapter. Der vierte nicht — deshalb
ist er kein Filter, sondern eine Abnahmefrage für Georg.

---

## 5 · Was jetzt nicht passiert

Kein NIE im Runner. `chatter-2d.js` bleibt, was es ist: die Laufzeit, die entscheidet **wer wann
was** sagt. Der Adapter wäre eine eigene Datei, und er kommt, wenn es eine NIE gibt, die man fragen
kann — nicht vorher.

**Der nächste sinnvolle Schritt** ist deshalb nicht Code, sondern der Beleg aus §4 der letzten
Antwort: **eine Fraktion komplett durchgezogen**, mit den sieben Schritten des Ein-Zeilen-Generators
nachvollziehbar angewandt, plus zwei Zeilen, die den Register-Test **nicht** bestehen, mit
Begründung. Daran sieht man, ob der Vertrag die richtigen Felder hat.

**Stay fluffy.**
