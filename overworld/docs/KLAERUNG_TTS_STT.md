# Stimme: TTS für Einheiten, STT für den Spieler

**Status:** Klärung, nichts gebaut. WS1 (Lead), 10. August 2026.

---

## 1 · TTS — das Mapping ist kleiner als es klingt

Der Browser bringt `speechSynthesis` mit, kostenlos, ohne Netz, ohne Abhängigkeit. Was fehlt, ist
nicht Technik, sondern **eine Zuordnung** — und die hat drei Fallen.

### Was der Browser wirklich hat

Nicht »Stimmen«, sondern **die Stimmen, die das Betriebssystem gerade installiert hat.** Auf einem
Mac sind das Dutzende, auf einem frischen Windows drei, auf einem Linux manchmal keine. Eine feste
Zuordnung »Hof spricht mit *Daniel*« ist deshalb keine Zuordnung, sondern eine Wette.

**Die Regel, die das löst:** eine Fraktion bekommt kein *Stimmen-Name*, sondern ein **Profil**, und
der Adapter sucht die nächstbeste vorhandene Stimme:

```js
kingCourt: { lang:'en-GB', geschlecht:'m', rate:0.92, pitch:0.85 }  // langsam, tief, amtlich
cave:      { lang:'en',    geschlecht:'*', rate:1.05, pitch:1.35 }  // hoch, hastig, hallend
```

**Rate und Pitch tragen mehr als der Stimmenname.** Dieselbe Systemstimme bei 0,85 Pitch und 0,92
Rate klingt wie eine andere Person als bei 1,35/1,05 — und das funktioniert auf jedem Rechner. Wer
die Charakterisierung an den Stimmennamen hängt, bekommt auf drei Rechnern drei Ergebnisse; wer sie
an Rate und Pitch hängt, auf allen dasselbe.

### Die drei Fallen

1. **TTS ist langsam und asynchron.** `speak()` beginnt irgendwann. Die Blase darf **nicht** darauf
   warten — sie erscheint sofort, der Ton kommt dazu. Ohne diese Regel steht die Welt still, wenn
   die Stimme hakt. (Dasselbe Prinzip wie beim NIE-Adapter: `deadline_ms`, dann Fallback.)
2. **Vier Stimmen gleichzeitig sind Lärm.** Es gilt dasselbe Budget wie für Blasen: eine Stimme,
   höchstens zwei, und wer spricht, hat Vorrang vor wer denkt. Der Schrei unterbricht.
3. **Sie muss abschaltbar sein und standardmäßig aus.** Ein Spiel, das beim Öffnen redet, wird
   geschlossen.

### Was das an Arbeit ist

Klein: ein Modul, das `OW_PHRASES`-Profile liest, die Systemstimmen einmal einsammelt, das beste
Paar wählt und beim Zeigen einer Blase mitspricht. Der Anschluss existiert schon — jede Blase geht
durch **eine** Stelle. **Reihenfolge:** nach dem Timing-Feinschliff, denn ohne saubere Standzeiten
kann man nicht beurteilen, ob Ton und Text zusammenpassen.

---

## 2 · STT — die Fehler sind der Inhalt

Hier wird es interessant, und Georgs Nebensatz ist der eigentliche Fund:

> *audio-/transcript bugs are welcome ;-)*

**Genau. In jedem anderen Spiel ist ein Erkennungsfehler ein Defekt. In KFB ist er eine
Kayfabulation.** Wer »Kant« sagt und die Welt versteht »can't«, hat keinen Bug gefunden, sondern ein
Missverständnis erzeugt — und Missverständnisse sind hier das Baumaterial. Das Spiel handelt davon,
dass die Welt nicht stimmt.

### Was das für den Bau heißt

Die naheliegende Architektur wäre: erkennen → Absicht bestimmen → Befehl ausführen. **Die ist
falsch.** Sie behandelt die Fehlerkennung als Problem und baut Korrekturen ein.

Die richtige ist: **erkennen → als Seed behandeln → durch die Fraktion verdauen.** Das ist exakt der
Weg, den RSS-Schlagzeilen schon nehmen (`ueber`-Feld, Werkzeug 10 »Manufactured Consent«). Ein
gesprochener Satz des Spielers ist dann nichts anderes als eine Schlagzeile mit einer Quelle: dem
Spieler.

```
Spieler spricht  →  Transkript (fehlerhaft, gerne)  →  Seed
                 →  Fraktion verdaut ihn            →  Blase
```

Und die Pointe liegt dann nicht im Erkennen, sondern in der **Reaktion**: der Hof legt eine Akte an,
die Höhle hallt es falsch zurück, das Lager wittert einen Plan. Drei Missverständnisse aus einem.

### Die drei harten Punkte

1. **Es gibt keinen Standard.** `SpeechRecognition` ist Chrome und Edge; Firefox und Safari haben es
   nicht oder nur halb. Also: **eine Zutat, kein Fundament.** Nichts im Spiel darf Sprache
   voraussetzen — sie ist eine zusätzliche Art, mit der Welt zu reden, nie die einzige.
2. **Mikrofon-Erlaubnis ist ein Moment.** Sie muss vom Spieler ausgehen (ein Knopf, ein Halten),
   nie beim Start. Und wenn er ablehnt, ist das kein Fehlerzustand, sondern der Normalfall.
3. **Dauerhaftes Zuhören ist die falsche Form.** Push-to-talk: Taste halten, sprechen, loslassen.
   Das erzeugt einen **Beat** — genau die Dramaturgie, die ChatterBox ohnehin will (Setup, Pause,
   Reaktion). Ein Mikrofon, das immer offen ist, erzeugt Rauschen und Unbehagen.

### Der kleinste sinnvolle Versuch

Eine Zone, ein Knopf, eine Fraktion. Halten, einen Satz sagen, loslassen — und **eine** Figur
antwortet darauf durch ihr Weltbild. Kein Befehl, keine Absichtserkennung, kein Menü. Die
Abnahmefrage lautet:

> **Ist es lustiger, wenn sie einen falsch versteht, als wenn sie einen richtig versteht?**

Wenn ja, ist die Richtung gut und der Rest ist Fleißarbeit. Wenn nein, war es eine
Bedienoberfläche und kein Spiel.

---

## 2b · Der beste erste TTS-Einsatz: der Erzähler (Georg 10.8.)

Browser-TTS klingt nach Maschine. Für jede Figur ist das ein Problem — **für den Erzähler als
Datumscomputer ist es die Rolle.** Damit ist er der einzige Sprecher, bei dem die Systemstimme
nicht trotz, sondern **wegen** ihrer Künstlichkeit passt.

**Deadpan und trocken** (Georg 10.8.) — und das ist der Grund, warum es trägt: eine Maschine, die
eine Katastrophe im selben Ton meldet wie ein Datum, ist komisch; eine, die sich anstrengt, ist
peinlich. *Der Witz gehört dem Satz, nicht der Betonung* — und Browser-TTS **kann** gar nicht
betonen. Also keine Pausen-Tricks im Text, keine Ausrufezeichen-Akrobatik.

Er umgeht damit das ganze Mapping-Problem aus §1: **keine Stimmensuche, kein Profil je Fraktion** —
tiefer Pitch (0,7–0,8), langsame Rate (0,85), erstbeste Systemstimme. Eine Roboterstimme, die auf
drei Rechnern verschieden klingt, klingt immer noch nach Roboter.

*Eine Stimme, ein Profil, kein Mapping* — deshalb gehört er an den Anfang, nicht ans Ende.

## 3 · Reihenfolge

**Der Erzähler zuerst** (§2b), dann der Rest von TTS, dann STT — und alles nach dem
Timing-Feinschliff. Grund: TTS macht die vorhandene Welt
hörbar, STT baut eine neue Eingabeart. Und der Timing-Slice entscheidet ohnehin über die Standzeiten,
an denen sich beide messen lassen.

**Wo es hingehört:** TTS ist Ausgabe und damit **WS0-nah** (sie haben die Audio-Schicht), STT ist
Eingabe und damit **Lead-Gebiet** — es erzeugt einen Seed, und Seeds gehen durch `chatter-2d.js`.

**Stay fluffy.**
