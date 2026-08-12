# SPEC — Lettering in der Blase, KISS-Fassung (Vorschlag, 2026-08-12)

Grundlage: Perplexity-Recherche (`uploads/super. bitte recherchiere jetzt zur formatierung i.md`),
gekürzt auf das, was ein LLM zuverlässig erzeugen und der Renderer zuverlässig prüfen kann.
**Noch nicht gebaut — Georg entscheidet.**

## §1 Die eine Regel, die bleibt

> **Ein typografisches Mittel, eine gesprochene Eigenschaft.**
> Die **Form** trägt Lautqualität und Modus (Rede · Gedanke · Ruf · Flüstern · Kayfabulate).
> Die **Schrift** trägt nur noch Betonung, Pause und Abbruch.

Daraus folgt die Sparsamkeit: alles, was die Blasenform schon sagt, sagt die Schrift **nicht
noch einmal**. Kursiv fürs Flüstern, Großbuchstaben fürs Schreien, Fettdruck als Lautstärke — jedes
davon wäre eine zweite Wahrheit über dieselbe Eigenschaft.

## §2 Drei Zeichen, mehr nicht

| Markup | Bedeutung | Darstellung |
|---|---|---|
| `*wort*` | **Betonung** — das Wort, an dem die Figur den Satz packt | fett, sonst nichts |
| `…` | Pause · Zögern · Auslaufen · Fortsetzung in der nächsten Blase | unverändert gesetzt |
| `--` | **Unterbrechung**, abrupter Abbruch | unverändert gesetzt |

**Mengenregel:** kurzer Satz höchstens **ein** betontes Wort, langer höchstens **zwei**, Ruf höchstens
zwei. Mehr wird beim Einlesen **abgeschnitten**, nicht abgelehnt — die Erzählschicht darf sich irren,
die Blase nicht.

**Normalisierung beim Einlesen:** `...` → `…` · `. . .` → `…` · Leerzeichen vor `…` bleibt (deutsche
Setzung), doppelte Ausrufezeichen fallen weg (`!!!` → `!`). Der Renderer normalisiert, der Autor muss
es nicht wissen.

## §3 Was ausdrücklich NICHT kommt

- **Kein Kursiv-Markup.** Gedanke und Flüstern sind Formen, keine Schriftschnitte.
- **Keine zweite Betonungsstufe** (»bold italic = impact«). Ein Regler, zwei Zustände.
- **Kein Uppercase-Zwang.** Der Ruf ist laut, weil er zackig ist und Bangers trägt.
- **Keine Laufweiten-Dehnung** (`N O !`) und keine vervielfachten Buchstaben. Später, wenn es fehlt.
- **Kein Token-Datenmodell** mit `marks[]`. Ein String mit drei Zeichen ist für ein LLM eine Regel;
  ein verschachteltes Objekt ist eine Fehlerquelle mit Schema.

## §4 Was der Umbruch dazulernen muss (C1b, klein)

1. **Markup zählt nicht mit.** Die Zeilenlänge misst den *sichtbaren* Text — sonst bricht `*Königreich*`
   zwei Zeichen zu früh um.
2. **Ein betontes Wort steht nie allein in einer Zeile.** Der ausgeglichene Umbruch hat dafür schon
   die Regel »ein Wort allein steht nie« — sie bekommt nur zusätzliches Gewicht, wenn das Wort fett ist.
3. **Fett ist breiter.** Die gemessene Zeichenbreite (`satz()`) muss den fetten Anteil einrechnen,
   sonst läuft der Text bei zwei fetten Wörtern aus der Kontur — dieselbe Klasse wie Naht 109.

## §5 Abnahme (drei Fixtures zusätzlich)

| id | Text | Erwartung |
|---|---|---|
| `emphasis` | `Das ist nicht dein *Königreich*.` | 2 Zeilen, »Königreich« fett und **nicht** allein |
| `trailoff` | `Ich dachte, du wärst …` | 1 Zeile, Ellipse gesetzt, keine Lücke davor entfernt |
| `cutoff` | `Ich wollte nur sagen, dass --` | 1 Zeile, `--` bleibt `--` |

Dazu die bestehende Regel: Zeilenzahl und Zeiten gegen die Tabelle, Abweichung 0.
**Die Zeiten zählen den sichtbaren Text**, nicht das Markup.

## §5b Die typografische Hälfte der Teilungsregel (Coworker-Ergänzung)

Wird ein zu langer Satz an einer Satzgrenze in **zwei** Blasen geteilt (O6.5), endet die erste mit
`…` und die zweite **beginnt** mit `…`. Bisher hatte die Regel nur die Layout-Hälfte.
**Stand: Spec, nicht gebaut** — gehört zu `split` in C3.

## §6 Was die Erzählschicht (LLM) davon zu wissen braucht

Ein Absatz, mehr nicht — er passt in jeden Prompt:

> Schreibe eine Blasenzeile. Höchstens 28 Zeichen je Zeile werden gesetzt, drei Zeilen sind das
> Maximum. Betone höchstens **ein** Wort mit `*Sternchen*`. Benutze `…` für Zögern oder Auslaufen und
> `--` für eine Unterbrechung. Keine Großbuchstaben zur Betonung, keine Mehrfach-Ausrufezeichen.
> Ist der Satz länger als drei Zeilen, teile ihn an einer Satzgrenze in zwei Blasen.

---

## §7 Stand 12.8.: gebaut und abgenommen
`bubble-layout.js` **bl-v1.1** (`parse`/`normalisieren`/`segmente`) + `bubble-ts.js` **v3**.
Messblatt: **15/15 · Umbruch 7/7 · Zeiten 15/15**, drei neue Fixtures `emphasis` · `trailoff` · `cutoff`.
Der Fettschnitt wird je Schrift **gemessen** (Shantell Sans: echter Schnitt vorhanden), der Ausgleich
rechnet bei Betonung in Pixeln.
