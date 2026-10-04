# SPRINTS · Fahrzeug- und Fluglinie (lab-v7)

**Additiv.** Ein abgeschlossener Sprint bleibt stehen und bekommt sein Ergebnis angehängt.
Reihenfolge ist Absicht: jeder Sprint liefert etwas, das der nächste braucht.
Stand: 18.09.2026, nach Runde 6.

---

## S0 · abgeschlossen · Deformer, vier Motion-Familien, 46 Fixtures
17.–18.09. · Gruppenbasierter Cartoon-Deformer, sechs Profile, 23 Sequenzen, Schlingern,
Manöver, Zwei-Rad, Fassrolle. Telemetrie-Naht `window.__cvd`. Zeitachse: `CHANGELOG.md`.
**Ergebnis:** läuft, in sich geprüft, **nicht abgenommen.**

## S1 · abgeschlossen · Fehlende Fahrzeuge, Atlas-Schnitt, Flug-Tab
18.09. · Handoff `animation-lab` @ 29aac106 gegen die Liste gerechnet, 15 Bodenfixtures
aufgenommen (46 → 61), 10 Flug-Fixtures deklariert, Oberfläche v2 im Schnitt des Resident Atlas.
**Ergebnis:** alle 25 neuen Zeilen geladen und vermessen. Ein Verdacht offen (`rover-round`: 1 Rad).

---

## S2 · als Nächstes · SICHTABNAHME (blockiert alles Weitere)
**Warum zuerst:** kein Profilwert ist abgestimmt. Jede weitere Zahl wäre geraten, und zwei
Runden Nachbesserung hingen zuletzt an genau einem Blick aufs Bild.
- Georg sieht die 23 Sequenzen an **car_hatchback** und an zwei Ausreißern (`race`, `vehicle-monster-truck`).
- Je Sequenz nur eine Frage: liest der Hauptread? Wenn nein — zu stark, zu schwach, oder falsch?
- Ergebnis sind Profilkorrekturen, kein Code.
**Fertig, wenn:** die sechs Profile Werte tragen, die Georg gesehen hat.
**Aufwand:** eine Sitzung. **Abhängigkeit:** keine.

## S3 · Rad-Paar-Regel nachziehen
- `rover-round` meldet **1** Rad — eine Eins verletzt die Paar-Regel (V9). Insel-Weg nachmessen.
- `tractor-poly` und `truck-armored` melden 2. Prüfen, ob das der Wahrheit entspricht
  (verschiedene Radgrößen vorn/hinten) oder ob die ±35-%-Median-Schwelle zu eng ist.
- Regel bleibt: findet sich nichts, steht 0 im Bericht. Erfunden wird nichts.
**Fertig, wenn:** jede Fixture entweder 0, 2 oder 4 Räder meldet und die Zahl am Bild stimmt.
**Abhängigkeit:** keine. Kann parallel zu S2 laufen.

## S4 · Flight Deformer · Schnitt 1 (Lage)
Nach `PLAN_flight_deformer.md`: Spannweite, Rumpflänge, Flügelebene, Hüllenschwerpunkt messen;
eine Gruppe für Rollen/Nicken/Gieren; Bank als abgeleitete Größe, nicht als zweiter Regler.
**Fertig, wenn:** ein Flugzeug eine Kurve fliegt, deren Rollwinkel aus der Querbeschleunigung folgt.
**Abhängigkeit:** S2 (die Deformer-Grenzen, an denen sich `FLIGHT_LIGHT` orientiert).

## S5 · Flight Deformer · Schnitt 2 + 3 (Form, Ereignisse)
Profil `FLIGHT_LIGHT`, an mindestens sechs Fixtures abgetastet (V13), darunter die Ausreißer
Papierflieger (0,12 u) und Spaceship Rae (9,95 u). Ereignisse: Böe, Einschlag, Abfangen, Aufsetzen
— jedes ein Spring-Impuls, keine Pose.
**Abhängigkeit:** S4.

## S6 · Brücke Fahren → Fliegen (Klappräder)
`steer` um z um 90° → Radscheibe waagerecht, dreht als Rotor; `susp.position.y` senkt sie.
EIN Faktor 0…1 führt Klappwinkel, Fahrhöhe und Schubneigung. Kandidaten: die drei Spacetrucks
(`HOVER_CANDIDATES`).
**Abhängigkeit:** S4.

## S7 · VFX-Schicht
Billboards, keine Volumen — `media/3D_Assets/FX_Visual/kenney_smoke-particles/PNG` liegt als
Einzelbilder vor. Vorlagen im Repo: `speed-lines.js`, `contrails.js`, `drift-smoke.js`,
`impact-dust.js`, `post-radial.js`. Skill §15 deckelt: ein Haupt-Read, ein Lautwort, ein Kamera-Griff.
**Abhängigkeit:** S2. Nicht vor der Choreografie.
