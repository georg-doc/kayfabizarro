# KONZEPT · Das Statblatt — Breitenbudget statt Wunschliste (WS0, 2026-08-12)

Anlass: vier Runden Nachbessern an derselben Zeile, jede hat eine Regel über die vorige gelegt und
keine hat das Problem angefasst. Das Problem ist **kein Ausrichtungsproblem**. Es ist ein
Budgetproblem, und ohne die Zahl kann man es nicht lösen — nur verschieben.

---

## §1 Das mentale Modell in fünf Sätzen

1. **Das Blatt hat EINE Breite** (`--r9sheet`). Alles darin ist eine *Aufteilung* dieser Breite,
   nie eine Summe von Wünschen.
2. Davon geht ab: die **Avatarspalte** (`--r9avpad`) und das rechte Polster. Was übrig bleibt, ist
   die **Inhaltsspalte** — das einzige Budget, das es gibt.
3. In der Inhaltsspalte liegen zwei Zeilen:
   **A · Identität** (Name · Titel · Dreieck) — sie sagt, wer gemeint ist.
   **B · Zustand** (Balken · Fluff-Zahl · POP-Zahl) — sie sagt, wie es steht.
4. **In einer Zeile darf genau EIN Stück elastisch sein.** Hier ist es der Balken. Alles andere ist
   inhaltsgroß — und muss klein genug bleiben, dass der Balken noch ein Balken ist.
   **Unter 72 px ist ein Balken ein Strich.** Das ist die Untergrenze, an der alles hängt.
5. Passt es nicht, wird **weniger gezeigt, nicht kleiner** — dieselbe Regel, die für die Karten
   schon gilt (§4s, Kartenschau: *unter der Schwelle wird WENIGER gezeichnet, nicht kleiner*).

---

## §2 Das Budget, gemessen (12.8., Blatt 288 px)

| Stück | gemessen |
|---|---|
| Inhaltsspalte = Blatt 288 − Avatarspalte 100 − Polster 12 | **176 px** |
| Balken (Minimum) | 52 |
| Lücke | 11 |
| »120 Fluff« | 72 |
| Lücke + Absatz | 18 |
| »0 Pop« | 51 |
| **Summe** | **204 px** |

**28 px zu viel.** Folge im Bild: die POP-Gruppe endet bei 317, das Papier bei 301 — sie steht
über der Kante, und der Balken kann nicht wachsen, weil er schon auf seinem Minimum sitzt.
*Ein Layout, das über Budget ist, sieht nicht falsch ausgerichtet aus — es sieht kaputt aus, und
jede Ausrichtungsregel darin ist wirkungslos.*

---

## §3 Was daraus wurde — und was zurückgenommen ist

Mein Schluss aus §2 war: die Bauform ist schuld, also die Bauform wechseln — **Unit Frame**, Werte
IM Balken (WoW-Vorbild), damit niemand mehr um Breite streitet. Gebaut, gemessen, sauber:
Überlauf 0, drei Zeilen gleich breit, 20 px Polster.

**Und trotzdem zurückgenommen** (Georg, 12.8.): »das vorherige Design in v11 war um Klassen besser,
intuitiver und sauberer.« Er hat recht, und der Denkfehler ist benennbar:

**(93) Wer eine gute Anordnung wegen eines Platzproblems ersetzt, tauscht eine Stärke gegen eine
Zahl.** Das Budget war echt — aber die richtige Antwort auf »28 px zu wenig« ist **Breite
hergeben**, nicht die Aufteilung austauschen. Zu schmal geworden war das BLATT (meine responsive
Stufe auf 288 px), nicht die Anordnung. Eine Messung sagt, DASS etwas nicht passt; sie sagt nicht,
was man dafür aufgeben soll.

Gültig ist damit wieder die v11-Aufteilung:

| Zeile | Inhalt |
|---|---|
| **A** | Name · Titel · Dreieck · **POP rechts** |
| **B** | Etikett · Fluff-Balken · **»120 Fluff« rechts** |

Gemessen nach der Rücknahme (Blatt 288): beide Zeilen 168 px, Überlauf **0**, Polster rechts 20,
Deckkraft 1.

Was aus der Runde **bleibt**, weil es unabhängige Befunde waren:
· **Papier ist Papier, kein Glas** (§4h Naht 11) — das Blatt lief wieder auf 0,78 mit;
· **mehr Luft**: Innenpolster 16/20/18 statt 13/16/14, `--pad` 13…22 für alle vier Ecken;
· **der Titel darf umbrechen** statt sich mit einer Ellipse zu behelfen;
· und das Budget-Modell aus §1/§2 selbst — es hat die Ursache in einer Minute gezeigt.

---

## §4 Zeile A: warum der Titel jetzt Platz hat

Bis 12.8. saß die POP-Gruppe in der Identitätszeile (v11-H5, damit sie beim Aufklappen nicht
springt). Der Preis stand woanders: der Titel bekam den Rest der Zeile und half sich mit einer
Ellipse (»Leichenfle…«), und im schmalen Blatt stand POP allein auf einer sonst leeren Zeile.

**Ein Element, das nur wegen seiner Stabilität irgendwo sitzt, bezahlt die anderen dafür.**
POP steht jetzt in Zeile B, wo es hingehört (beides sind Zahlen über den Stand). Zeile A gehört
dem Namen: der Titel darf **umbrechen**, die Zeile wächst um eine Zeilenhöhe, und das Blatt trägt
es — Höhe ist hier billig, Breite ist teuer.

Stabil bleibt es trotzdem: die **Zahl** trägt eine Mindestbreite und steht rechtsbündig, das Wort
daneben kann deshalb nicht wandern, wenn aus 8 eine 120 wird. Ein festes Raster (40/42) braucht es
dafür nicht — das war die Lösung, die die Gruppe auseinandergezogen hat.

---

## §5 Was daraus als Regel bleibt

- **Vor jeder neuen Zeile im Blatt: das Budget rechnen.** Inhaltsspalte minus die inhaltsgroßen
  Stücke minus Lücken — bleibt weniger als 72 px für den Balken, ist die Zeile nicht baubar.
- **Zu wenig Platz heißt zuerst: mehr Platz geben.** Erst wenn das Blatt nicht breiter werden darf,
  wird über die Aufteilung geredet — und dann wird weniger gezeigt, nicht umgebaut.
- **Ein elastisches Stück je Zeile.** Zwei elastische Stücke heißt: keins hat eine Breite.
- **Eine Mindestbreite am flexiblen Stück ist keine Lösung, sondern eine Überlaufgarantie** —
  sie verhindert das Schrumpfen genau dort, wo geschrumpft werden müsste.
- **Weniger zeigen, nicht kleiner** — falls es doch je eng wird (die Regel bleibt gültig, sie wird
  nur nicht mehr gebraucht: Wörter fallen vor Zahlen, Zahlen vor dem Balken).
- Gemessen wird am lebenden Element (`getBoundingClientRect`), nicht am Screenshot und nicht im
  Kopf. Die Tabelle in §2 ist so entstanden, und sie hat die Ursache in einer Minute gezeigt,
  nachdem vier Runden Vermuten sie nicht gefunden hatten.
- **Und vorher hinsehen.** Vier Runden gingen raus, ohne dass ich das Ergebnis angeschaut habe —
  das ist der eigentliche Fehler dieser Session, nicht die CSS-Zeile.
