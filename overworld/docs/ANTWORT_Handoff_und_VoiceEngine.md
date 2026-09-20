# Antwort auf WS0-Handoff und Voice Engine — von WS1 (Lead), 10. August

Zwei Dokumente, zwei sehr verschiedene Qualitäten. Kurz vorweg: **die Voice Engine ist das bessere
von beiden**, und das Handoff hat eine Lücke, die es teuer machen kann.

---

## 1 · Die Voice Engine ist stark — und sie hat sofort etwas repariert

Teil A bis D sind das Beste, was bisher aus dem Konzept-Workspace kam. Drei Gründe:

- **Layer Zero ist prüfbar**, nicht stimmungsvoll. »Keine Objekt-Handlung«, »kein Tech-Jargon als
  Deko«, »wirf die ersten drei Gags weg« — das sind Regeln, gegen die man eine Zeile halten kann.
- **Der Ein-Zeilen-Generator (Teil D)** ist genau der richtige Zuschnitt: sieben Schritte für **eine**
  Blase. Kein Framework, ein Handgriff.
- **Werkzeug 10 (Manufactured Consent)** beschreibt exakt, was `chatter-2d.js` schon tut, und gibt
  ihm einen Namen: dieselbe Quelle, drei Verdauungen. Das ist die Art Rückmeldung, die man einbauen
  kann, ohne etwas umzubauen.

**Und Layer Zero hat direkt gegriffen:** die Regel »keine Gedankenstriche« habe ich gegen unseren
Vorrat gehalten — **zwei** von 143 Spielzeilen hatten einen (`»{X}« — that is how they get you.` und
`Arbeitstiere — das sind wir…`). Beide sind raus. Die Regel gilt für das **Gesprochene**;
Dokumentation und Code-Kommentare bleiben, wie sie sind.

**Übernommen, ohne Diskussion:** C1, die Seed-Hierarchie. »Card Seed remains the semantic core
whenever a Card is present« ist richtiger als das, was hier lief — der Feed wurde zuerst befragt,
auch wenn eine Karte in der Zone lag. Die Karte **ist** das Beweisstück, die Schlagzeile ist
Beiwerk. Geändert (V10-S21).

---

## 2 · Das Handoff schickt WS0 an Arbeit, die hier schon fertig ist

Das ist der Punkt, der Geld kosten kann. Die **Priority order (P)** listet als »build/validate now«:

| Handoff sagt »jetzt bauen« | Ist-Stand hier |
|---|---|
| 1 · speech-bubble geometry + streaming QA | **fertig** V10-S18: Geometrie einmal aus dem vollen Text, gemessen 308×139 stabil bei 9 → 59 Zeichen |
| 2 · thought + shout bubble styles | **fertig** V10-S18/S18b: Denkblase mit atmenden Kreisen, Schrei mit Zackenkontur in Bangers, über `say(…,'shout')` verdrahtet |
| 3 · timing/readability controls | **teilweise**: zwei Uhren getrennt (Schrei hat eine, die bedienbare Blase nicht); 15 CPS und Dwell fehlen |
| 4 · emote integration | **läuft** seit v10-S3b, ein Zeichen je Blase |
| 11 · title/name HUD space | **fertig** V10-S20: Zeile beim Avatar, `OW_IDENT.wer()` |

A1 bis A3 des Handoffs beschreiben also **unseren gebauten Stand als Auftrag**. Wenn WS0 das liest
und loslegt, entstehen zwei Blasenzeichner — genau das, was beide Dokumente an drei Stellen
ausschließen.

**Bitte an den Konzept-Workspace:** ein Handoff, das Produktion auslöst, braucht eine Spalte
»existiert bereits«. Der Changelog ist die Quelle dafür; er ist im Export.

**Was für WS0 wirklich offen ist**, aus derselben Liste: 5 (Audio-Hooks), 6 (Card Viewer für Quest-
und Deck-Präsentation), 7 (Theater/Replay), 8 (3D-Ball-POC), 12 (Post-Kasten) — plus das, was ich
heute eigens geschickt habe: **die Lulls-Skins**
(`docs/BRIEFING_WS0_lulls-skins.md`, Kopf-Anker und Follow-Anker mit Cartoon-Physik).

---

## 3 · Drei Stellen, an denen ich widerspreche

**G · »Tutorial loot includes first title: Leichenfledderer«.** Das Doc sagt im selben Satz
»English in the game content«. Die Kanon-Regel ist präziser: **Englisch, Eigennamen deutsch** — und
Eigennamen sind Puste · Witz · Schneid · BLÖDSINN! · Kayfabulation · FrizzleBob · King Kayfabian.
»Leichenfledderer« ist keiner davon, sondern ein deutsches Wort in englischem Text. Entweder es wird
ein Eigenname (dann gehört es in die Liste, und das ist eine Entscheidung, keine Übersetzung), oder
es heißt *Grave Robber* / *Corpse-Picker*. Beides geht — aber nicht beides gleichzeitig.

**L · 3D-Ball-POC.** Guter Testfall, falscher Zeitpunkt. Der Bodenkontakt in 2D ist **gerade erst**
sauber geworden: gebackene Schatten, Clip auf das Kartenblatt, Schrittlänge an der gelaufenen
Strecke. Ein 3D-Objekt mit eigenem Schatten darüber ist eine zweite Antwort auf dieselbe Frage
(»wo steht etwas?«). Vorschlag: **nach** den Lulls-Skins — die klären dieselbe Physik in 2D und für
einen Bruchteil des Aufwands.

**K · Howler.js.** Bleibt offen, wie im Masterplan §4.4c beschlossen: erst wenn der Demonstrator
zeigt, dass `audio-2d.js` nicht reicht. Das Handoff nennt es korrekt »candidate«, aber die
WS0-Prioritätsliste führt Audio-Hooks auf Platz 5 — bitte ohne Bibliotheksentscheidung.

---

## 4 · Zum NIE-Feedback: angenommen, und der Vertrag steht jetzt fest

Die Rollenaufteilung übernehme ich unverändert — NIE als semantischer Upstream, Masken als
Performance-Schicht, ChatterBox als Präsentation, Blase/Emote/TTS als Ausgabe. Und **Card Seed
bleibt König** ist seit V10-S21 nicht mehr nur eine Absicht, sondern Code: die Karte wird vor der
Schlagzeile befragt.

**Den Request/Response-Contract habe ich festgeschrieben** statt ihn als Hook zu belassen:
`docs/NIE_ADAPTER_HOOK.md`. Grund ist keine Eile, sondern eine Lehre aus dieser Session — wir haben
fünfmal hintereinander dieselbe Klasse repariert, weil eine Liste an mehreren Orten geführt wurde.
*Ein Vertrag, den drei Workspaces gleichzeitig erfinden, sind drei Verträge.* Er bleibt ausdrücklich
**nicht gebaut**; er legt nur die Form fest.

**Das »fractal context budget« ist der beste neue Gedanke im Feedback** und steht jetzt neben
unserem Präsentationsbudget. Beide sagen dasselbe auf zwei Ebenen: *die Welt darf nicht zu
Untertiteln werden* (max 2 Blasen) und *eine Blase darf nicht die ganze Welt tragen wollen* (Kontext
in Stufen). »Eine Blase braucht nur so viel Welt, wie ihr Beat bezahlen kann« ist eine Regel, die
man beim Schreiben spürt — die habe ich wörtlich übernommen.

**Drei Felder fehlten im Entwurf**, und ohne sie trägt der Vertrag nicht:

1. **`fallback` ist kein Notfall, sondern der Normalfall.** Er muss gesetzt sein, **bevor** gefragt
   wird — der Vorrat ist er. Damit darf die Anfrage nichts voraussetzen, was der Vorrat nicht auch
   liefern kann.
2. **`deadline_ms` gehört in die Anfrage**, nicht in die Implementierung, sonst entscheidet jeder
   Aufrufer anders, wie lange die Welt schweigt. Vorschlag 700 ms: nach einer Sekunde gehört eine
   Blase nicht mehr zum Anlass.
3. **Die Antwort darf abgelehnt werden — und jemand muss es tun.** Ein LLM liefert manchmal Murks.
   Länge, Em-Dash/Emoji und Zahlen sind **maschinell prüfbar** und gehören in den Adapter; der
   Register-Test ist es nicht und bleibt eine Abnahmefrage für Georg.

## 5 · Was ich mir als Nächstes wünsche

Teil D beschreibt den Generator für **eine** Zeile. Was fehlt, ist der Beleg: **eine Fraktion
komplett durchgezogen** — alle acht Felder, mit den sieben Schritten nachvollziehbar angewandt, plus
zwei Zeilen, die den Register-Test **nicht** bestehen, mit Begründung warum. Ein Negativbeispiel
lehrt mehr als zehn gute Zeilen — und daran sieht man auch, ob der Vertrag oben die richtigen Felder
hat.

Danach ist der Vorrat Fleißarbeit, und die kann jeder machen.

**Stay fluffy.**
