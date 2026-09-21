# Sprint · KFB Travel Combat v26

Status: **Planung.** Kein Code geschrieben. Fork-Punkt ist v25.2s (edge3-Pfad korrigiert).
Vorgänger: `SPRINT_v25.md`. Einstieg für neue Mitarbeit: `ONBOARDING_v26_frischer-Chat.md`.

---

## §0 · Die Entscheidung, die alles andere aufhält

**Sky-Karten aus einem Zufallsdeck.** Heute ist die Ziehung streng sequenziell:
`deck[i % deck.length]` beim Bauen, `deck[nextIdx++ % deck.length]` beim Nachrücken. Jeder Durchlauf
zeigt dieselbe Reihenfolge. Das war für den Aufbau richtig — es machte Fehler reproduzierbar — und
ist für das Spiel falsch.

Zu entscheiden ist **eine** Frage, und sie ist keine technische:

**(A) Ein Deck pro Zone.** Jede Zone hat ihren eigenen Kartensatz. Zonen bleiben unterscheidbar,
der Spieler lernt „hier fliegen diese Dinger". Kostet: pro Zone ein gepflegter Satz, und die Frage,
was passiert, wenn ein Satz leer ist.

**(B) Alle drei durchmischt.** Ein Topf, aus dem gezogen wird. Maximale Abwechslung, kein
Pflegeaufwand pro Zone — aber die Zonen verlieren ihr Gesicht, und ein Gegner, der zur Zone nicht
passt, taucht trotzdem auf.

Empfehlung, falls du keine Präferenz hast: **(A)**, weil die Zonen in diesem Spiel das einzige sind,
was Ortsgefühl herstellt, und weil (B) sich aus (A) jederzeit herstellen lässt (ein Deck, das alle
enthält), umgekehrt aber nicht.

Was in beiden Fällen dazugehört und nicht vergessen werden darf:
- **Kein Doppel direkt hintereinander** (gezogene Karte ans Ende, nicht zurück in die Mitte).
- **Seed** für reproduzierbare Läufe — sonst ist die nächste Fehlersuche im Kampf blind.
  `__travelPOC.setSeed(n)`, Standard: Zufall.

---

## §1 · Die vier Urteile aus v25 (nur Georg)

Alle vier sind gebaut und stellbar. Was fehlt, ist ein Blick darauf. Sie stehen hier, weil sie in
v25 nicht mehr gefällt wurden — nicht, weil sie unwichtig sind. Jeder Punkt ist in Minuten erledigt,
wenn das Fenster offen ist.

| # | Punkt | Naht | Wie man hinsieht | Wenn es falsch aussieht |
|---|---|---|---|---|
| 1 | **Renn-Bob** | 179 | Sprinten, dann `petKin.bobReport()` | `petKin.setBob('run', v)` · `setBob('hang', v)` |
| 2 | **Trefferreaktion** | S1 | Einmal auf einen Mob feuern | Knockback steht auf 0,9 (war 0,55) |
| 3 | **Schrittmaß** | §3 | Am Boden laufen, auf die Füße sehen | Rutschen 2,70 · Strampeln 0,3731 · oder Lauftempo senken |
| 4 | **Maßstab/Assets** | §5 | Palme, Blatt, Felsstufen im Bild | Maße in `settings-schema.js` |

Zu **3** gehört eine Warnung: zwischen den beiden Werten liegt Faktor **7,24**. Das ist kein
Feintuning, das sind zwei verschiedene Bewegungen. `schrittmass.json` (41 Messungen) wird heute
gelesen und **absichtlich nicht angewandt** — die Begründung steht in `SPRINT_v25.md` §3 und sollte
gelesen werden, bevor jemand die Anwendung „nachrüstet".

---

## §2 · Zwei Zahlen, die nur abgelesen werden müssen

Gebaut in v25, nie in einem fokussierten Fenster gelaufen:

```js
await __travelPOC.fpsprobe(5)                       // fps @1080p bei 57 Draw-Calls
__travelPOC.setMode('fly'); combat.poolprobe(6)     // Erwartung 10,6 Kreise/Wurf
```

Erst wenn diese beiden Zahlen auf dem Tisch liegen, ist über Performance überhaupt zu reden. Alles
andere wäre Raten. **Wenn fps unter 50 liegt**, ist der nächste Schritt Draw-Call-Reduktion und nicht
Shader-Kosmetik: 57 Calls sind für diese Szene viel.

---

## §3 · Rückstand aus v24 (unverändert offen)

| Punkt | Warum es liegen blieb |
|---|---|
| Terrain wirft keinen Schatten auf sich selbst | Kosten unklar, hängt an §2 |
| Terrain-Karten neu denken | Konzeptarbeit, kein Bug |
| Waffen-Balancing Hornet / Bog | Braucht Spielzeit, keine Messung |
| Tanz-Abgriff mit Audio | Abhängigkeit außerhalb des Codes |
| Asset-Library abspecken | 4,3 MB; läuft heute per RAW-URL, tut also nicht weh |

---

## §4 · Vorschlag für die Reihenfolge in v26

1. **§0 entscheiden** (Georg, 5 Minuten) — sonst ist Kartenarbeit nicht anfangbar.
2. **§2 ablesen** (Georg, 2 Minuten) — entscheidet, ob v26 ein Performance-Sprint wird.
3. **§1 durchsehen** (Georg, 15 Minuten) — vier Urteile in einer Sitzung.
4. Danach erst Code: Zufallsdeck bauen (§0), dann was §2 vorgibt.

Punkte 1–3 sind zusammen etwa **20 Minuten an einem fokussierten Fenster** und entscheiden über den
gesamten restlichen Sprint. Vorher zu bauen heißt, auf Verdacht zu bauen.

---

## §5 · Was v26 **nicht** tut

- **v24 nicht anfassen.** Er ist der Vergleichsmaßstab. Geteilte Module bleiben parametrisiert.
- **Kein Bundler, kein Framework.** ES-Module und three.js, so wie bisher.
- **Keine neuen Waffen**, bevor Hornet/Bog balanciert sind.
- **Keine Messung ohne fokussiertes Fenster** in ein Dokument schreiben.
