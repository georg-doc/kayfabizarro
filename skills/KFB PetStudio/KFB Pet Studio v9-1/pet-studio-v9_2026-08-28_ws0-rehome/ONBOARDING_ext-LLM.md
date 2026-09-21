# ONBOARDING für ein externes LLM — KFB Pet Studio v9

Du hast kein Vorwissen über dieses Projekt. Dieses Blatt gibt dir genau so viel, dass du nichts
kaputt machst. Es ersetzt nicht `HANDOVER_WS0_v9.md` — es kommt davor.

---

## 1 · Was das ist

**Kayfabizarro (KFB)** ist ein Cartoon-Universum mit würfelförmigen Tieren (»Cube Pets«), gezeichnet
in einem Tusche-Look. Das **Pet Studio** ist das Werkzeug, in dem ein Pet eingestellt und
**vermessen** wird; die Messwerte wandern in einen **Vertrag** (`kfb-pets.json`), den alle anderen
Anwendungen lesen — ein Flipper-Spiel (»SpinballCast«), eine Podcast-Bühne, eine Overworld.

Das Studio ist **eine Datei**: `KFB Pet Studio v9.dc.html`, ein Design Component. Template oben,
Logikklasse unten. Die Module darunter (`studio-v3/`, `studio-v7/`, `studio-v8/`, `studio-v9/`) sind
gewöhnliche ES-Module ohne Bundler.

---

## 2 · Die sechs Begriffe, ohne die du das Projekt falsch liest

| Wort | Bedeutung |
|---|---|
| **Pad** | alles mit einer Bodenfläche: Pet, Requisite, Klorolle. Das *ganze* Bauteil. |
| **Base** | die graue Fläche darunter. Sie fängt den Schatten. |
| **Anker** | Punkte am Pad für Ausrüstung: Hüfte, Hand-Entsprechungen, Kopf, Fuß, Mund, Bubble. Cube-Pets haben keine Gelenke — das ist Cartoon-Anatomie, keine Skelettierung. |
| **Bubble** | Sprechblase, Sammelbegriff. Vier Arten: Speech · Thought · Whisper · Scream. |
| **Ansatz** | die zwei Punkte, wo der Pfeil aus der Bubble-Kante wächst. **Nicht** die Füße des Pets. |
| **Spitze** | das dünne Ende des Pfeils, das man zieht. Thought hat statt Ansatz und Spitze eine **Spur**. |

Dazu **Grundform** = `body.cubeH`, die Höhe des Körperwürfels. Sie ist der Maßstab für fast alles,
auch für die Größe der Sprechblasen.

---

## 3 · Die Arbeitsweise dieses Projekts (das Wichtigste)

Das ist keine Stilfrage, das ist der Grund, warum das Projekt noch funktioniert:

1. **Messen, nicht raten.** Jede Zahl im Code hat eine Herkunft: gemessen, aus dem Vertrag gelesen,
   oder von Georg entschieden. Eine vierte Sorte gibt es nicht. Wenn du eine Zahl brauchst, die du
   nicht hast, **miss sie und schreib die Messung auf** — nicht »0.3 sieht gut aus«.
2. **Eine Zahl, ein Eigentümer.** Zwei Rechnungen für dieselbe Größe sind ein Rechenfehler mit
   Verzögerung. Wenn du eine Zahl an zwei Stellen brauchst, liest die zweite Stelle die erste.
3. **Additiv.** Verträge und Changelogs verlieren nie Felder. Ein falscher Befund wird durch einen
   **neuen** Eintrag korrigiert, nicht überschrieben. (Ein Changelog, der dreimal etwas behauptete,
   was der Code nicht tat, war der teuerste Fehler des Projekts.)
4. **Ein Bauteil sagt selbst, was es ist.** Name im Szenengraph, Rolle in `userData`, Hilfsflächen
   **aus im Default**. Sonst hält der nächste Leser eine Messhilfe für Design.
5. **Ein Regler, der sich bewegt und nichts tut, ist eine Lüge mit Schieber.** Entweder er wirkt
   über seinen ganzen Weg, oder er verschwindet.
6. **Eine Änderung ohne Reload ist keine Messung.** Prüfe, dass der Code, den du messsen willst,
   auch der geladene ist.
7. **Belegen, nicht behaupten.** »Ich habe X geändert und jetzt sieht es richtig aus« ist keine
   Ursache. Wer eine Ursache behauptet, schaltet sie einmal ab.

---

## 4 · Wie du prüfst, ob etwas funktioniert

Im laufenden Studio liegt der Messgriff auf `window.__STUDIO9`. Nützlich:

```js
const s = window.__STUDIO9;
s._pet().pad                 // der Pad-Block des aktuellen Pets
s._padMeasure(true)          // Anker neu messen, mit einer Zeile in der Konsole
s._padBase.report()          // Kontaktsaum, Tuschekante, Fussradius, Kachelkante
s._tRep                      // der letzte Zipfel-Bericht (Spanne, Länge, Winkel, Stempel)
s._tDrawN / s._tStampN       // Zeichnungen / Geometrie-Änderungen der Zipfel-Werkbank
s.state.v9pad / s.state.v9tail
```

**Der Stempel-Zähler ist ein Beweismittel:** `_tStampN` steigt genau dann, wenn sich die
Zipfelgeometrie ändert. Wer nichts anfasst und die Zahl steigen sieht, hat eine versteckte
Neuberechnung gefunden.

---

## 5 · Was du nicht anfassen darfst

`KFB Pet Studio v8.dc.html` sowie alles unter `studio-v7/` und `studio-v8/` ist **eingefroren** —
es ist der Vergleichsmaßstab. Auch `bubble-shaper.v3.js` bleibt, obwohl darin ein bekannter Fehler
beschrieben ist (der Zipfel wird in der Silhouette *gesucht* statt gesetzt): der Ersatz liegt
daneben in `studio-v9/bubble-tail.v1.js`. Wer beides gleichzeitig ändert, verliert den Maßstab.

---

## 6 · Wenn du unsicher bist

Frag. Das Projekt hat einen Auftraggeber (Georg), er antwortet in Sätzen und trifft Entscheidungen
schnell — aber er liest keine Kürzel und keine Paragraphennummern. Schreib in Alltagssprache,
benenne das Ding, nicht die Datei, und sag, welche zwei Möglichkeiten du siehst und was jede kostet.
