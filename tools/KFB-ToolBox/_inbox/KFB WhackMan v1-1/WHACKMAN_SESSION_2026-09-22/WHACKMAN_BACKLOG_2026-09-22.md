# KFB WhackMan v1 · Backlog nach dem Kollisions-/Feedback-Pass

Offene Punkte aus dem Gespräch 2026-09-22, absichtlich nicht blind in einem Zug gebaut.

## 1 · Generelles Kollisions-/Bounce-Modul (Kern-Ask)
Aktuell: Verfolger weichen ruhenden Sammelstücken kontinuierlich aus (siehe letzter Pass), aber
das ist eine Speziallösung für EINEN Fall (Verfolger vs. Pickup). Noch nicht gelöst: Verfolger
laufen weiterhin sichtbar in Dots/Kekse/Pizzastücke — die Grundfrage "zwei Dinge dürfen niemals
ineinanderstecken" ist nicht generisch beantwortet.

Vorschlag als eigenes Modul (`wm-collide.js` existiert schon für Wand-AABB, wird erweitert):
- Jeder Akteur UND jedes Prop bekommt einen Kreis (Radius, schon vorhanden für die meisten).
- Ein Overlap-Resolver läuft einmal pro Frame über alle Paare: bei Überlappung wird das
  LEICHTERE/passivere Objekt (Prop vor Akteur, kleinerer Akteur vor größerem) im Impact-Vektor
  weggedrückt — kein Ineinanderstecken, egal welche Kombination.
- Cartoon-Rückkehr statt hartem Snap: weggedrücktes Objekt bekommt einen Bounce (kurzer
  Ausschlag, Squash am Umkehrpunkt) und kriecht danach mit Easing zurück zur Ruheposition —
  "gummiartig", wie im Gespräch beschrieben.
- Spieler-Treffer wird dabei aufgewertet: statt nur horizontalem Knockback (aktueller Stand)
  ein kurzer Wirbel nach oben (Y-Impuls + Spin), Fall, Bodenkontakt-Squash, dann Rückkehr in die
  Standpose — dieselbe Feder-/Bounce-Logik wie beim Sammelgut, nur mit Höhe.

Das ist der Kern der Anfrage und der aufwendigste Punkt — verdient einen eigenen Bau-Durchgang,
nicht einen Nebensatz in einem Chat-Turn.

## 2 · Freie Orbit-Kamera IM Spielmodus mit Rückkehr-Transition
Wunsch: während des Spielens (nicht nur in der separaten `orbit`-Ansicht) frei um den Spieler
drehen können (Maus/Drag), und sobald sich der Spieler wieder bewegt, weich zurück in die
Verfolgerkamera-Position hinter ihm gleiten — kein Umschalten von Hand nötig. Nebenbei als
Fahr-/Foto-Modus interessant, um Deko zu prüfen.

## 3 · Deko-Grounding
Bäume/Deko stecken nicht sauber im Boden ("schweben"/falsch versenkt) — Sichtprüfung + Fix in
Gate B's Platzierung.

## 4 · 3D-Platzierungs-Editor
Bestehendes Editor-Werkzeug (im Projekt/Toolset schon vorhanden) für Props nutzen, um Position/
Rotation/Bodenhöhe direkt zu setzen, statt Koordinaten zu tippen.

## Vorschlag Reihenfolge
1 (Kollisions-/Bounce-Modul) zuerst, weil es das Kernproblem ("Kekse fressen", Ineinanderstecken)
grundsätzlich statt punktuell löst. Danach 2 (Kamera), dann 3 (Deko-Fix, klein), dann 4 (Editor,
eigenständiges Werkzeug).
