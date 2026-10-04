# ABGLEICH — Coworker-Briefings gegen Projekt-Doku, Sprint & Masterplan (2026-08-12, v13)

Zweck: **vor** dem ersten v13-Slice sehen, wo drei Papiere und ein Code-Stand auseinanderlaufen.
Kein Vorschlag steht hier als Beschluss; offene Punkte stehen als offene Punkte.

---

## §1 Was an Briefings tatsächlich im Workspace liegt

| Blatt | Richtung | Stand | Zustand |
|---|---|---|---|
| `docs/overworld-v12/BRIEFING_pixelbaecker_2026-08-12.md` | **raus** — an einen frischen Chat / eigenes Projekt | 12.8. | vollständig (Auftrag, Verträge, Slices B1–B6, Anti-Pattern). **Nicht abgeschickt / kein Empfänger vermerkt** |
| `docs/overworld-v11/HANDOVER_WS0_2026-08-11.md` | **raus** (§B = Diff an WS1/Coworker) | 11.8. | abgeschickt; deckt v11 ab, **nicht** v12 |
| `docs/overworld-v10/BRIEFING_WS0_v10.md` · `BRIEFING_lulls-skins` · `SPRINT_skins-snacks` | raus, älter | 9./10.8. | erledigt bzw. in §4n konsolidiert |
| `docs/overworld-v10/MASTERPLAN_overworld.md` | **rein** (WS1 besitzt es) | **9.8., v10** | drei Forks alt — siehe §3 |
| **Rückmeldung des Coworkers auf 11.8./12.8.** | rein | — | **liegt hier nicht.** Wenn es eine gibt, fehlt sie im Workspace |

*Ehrlich benannt:* »Coworker-Briefings zur Diskussion« kann ich nur an dem prüfen, was hier liegt.
Neue eingehende Blätter (Antwort auf den v11-Diff, Pixelbäcker-Rückmeldung, WS0/WS1-Gegenlesen)
sind **nicht** im Projekt — bitte einwerfen, dann wird dieses Blatt fortgeschrieben.

---

## §2 Der Pixelbäcker gegen den Bestand — vier Prüfpunkte

Das Briefing ist in sich schlüssig und benennt seinen eigenen Vorbefund (§0: *es gibt das Konzept,
nicht die Spezifikation*). Was beim Abgleich auffällt:

1. **Der Ausgabe-Vertrag (§4) und `unit-loader.js` müssen dieselbe Zahl meinen.** Das Briefing
   verlangt »Zelle quadratisch und Vielfaches von 64 (96/128/160)«. Der Loader **misst** heute
   Fußpunkt, Körperkasten und gebackenen Schatten selbst — er liest keine `bake.json`. Solange das
   so ist, ist die Messdatei ein **Beleg**, kein Eingang. Das steht im Briefing (»soll ihm nichts
   wegnehmen«) — es sollte aber als Abnahme formuliert sein: *gebackenes Blatt durch den Loader
   schicken, dessen Messung gegen `bake.json` halten, Abweichung 0*. Sonst wird die Messdatei zur
   zweiten Wahrheit über den Fußpunkt.
2. **Outline-Wahl (§5) ist noch nicht entschieden** — Empfehlung (a) Bildkante, (c) als Schalter.
   Das verträgt sich mit K5 nur, wenn (c) **die** Feder aus `kfb-ink-canon.js` importiert und (a)
   ausdrücklich als *nicht-KFB-gezeichnete* Bildoperation deklariert wird. Sonst haben wir eine
   zweite Kante — genau die Fehlerklasse, die K5 verhindert.
3. **HERO_REF 91 und `scale = 1`** stehen richtig drin. Der Bäcker muss deshalb **Körperhöhe in
   Quellpixeln** melden, nicht »Zellgröße« — die Zelle ist Verpackung, der Körper ist der Maßstab.
   Im Vertrag steht `koerper:{w,h}`: gut, aber die Einheit fehlt (Quellpixel, nicht Zellprozent).
4. **Licht (§6)** nennt `shadow.lean 0.34` / `off 0.27` aus dem Bestand. Das ist eine geteilte
   Zahl an zwei Orten, sobald der Bäcker sie nachbildet — **ein Ort** wäre `sfx`-artig eine
   Konfiguration im Repo, aus der beide lesen. Vorschlag, nicht Beschluss.

**Nicht im Briefing, gehört aber hinein:** die Aussage aus §4v/§4u, dass **im gedrosselten Tab kein
Bild kommt** (Naht 66/72) — der Bäcker ist ein Werkzeug, dessen ganzes Ergebnis ein Bild ist. Seine
Abnahme muss über Zustand, Konsole und **exportierte Datei** laufen, nicht über die Vorschau.

---

## §3 Masterplan gegen Code — was der Plan nicht weiß

Der Masterplan hat **Stand 9.8. / v10** und sagt selbst: *Eigentum WS1, es gibt keinen zweiten.*
Wir schreiben ihn hier **nicht** um; das Folgende ist der Patch-Vorschlag, den er bekommen sollte.

| Entschieden/gebaut seit 9.8. | Wo belegt | Im Masterplan |
|---|---|---|
| **Ink-Outline als System**: Stärke trägt, Farbe bestätigt; `inkOf()` abgeleitet; Gummiband reagiert nur auf Schwarz; schwarze Linie wird überdeckt, nie unterbrochen | v11-Handover §A(2), 11.8. | **fehlt** (4.5 kennt nur »Signatur-Shader je Terrain-Typ«) |
| **Wasser-Kanon**: eine Streufarbe je Fluid-**Körper**, Gradient statt Höhenfeld, inkommensurable Wellen, RMS-Neigung ~4° als geführte Zahl | v11-Handover §A(1) · §4v | **fehlt** |
| **Glitzern steht auf `aus`**, `waterForm` als Schalter, Referenzen offen (Georg recherchiert) | §4v, Nähte 79–83 | **fehlt** |
| **30 spielbare Einheiten, nicht 31** (gemessen `roster().length`) | v11-Handover §B, Befund 1 | **fehlt** — und die 31 wandert sonst weiter |
| **Tempo aus dem Körper** `(bodyH/91)^0,3`, Rempler, `shots.js` (eine Wurfweite 260 für Held und Gegner), `reach.js` | v11-Handover §A(4/5), §B | **fehlt** (4.3 kennt Hitstop/Rückstoß, nicht die Körperkurve) |
| **Journey-Schema 2.4.0** — `hero.unit`, Katalogschlüssel ohne `hero_`-Präfix, alte Stände `null` | §4v Slice J1, Nähte 94/95 | **fehlt** (4.4 nennt Journey nur `GEBAUT`) |
| **Statblatt-Rücknahme (93)**: v11-Fluffbox steht zeichengleich wieder da; Papier ist Papier, kein Glas (Naht 92, **zweimal** bezahlt) | §4v, `KONZEPT_statblatt` | **fehlt**; 4.2b listet die Fluff-Leiste noch als `OFFEN` bei WS0 |
| **Kamera-Klammer** statt zeitgesteuertem Überblenden; Blatt schaltet HUD **nicht** mehr auf `minimal` | §4v, Nähte 84–86 | **fehlt** |
| `aufBlatt()` — Requisiten dürfen überlappen, Einheiten nicht (42 Mobs / 0 auf dem Blatt) | §4v Naht 86 | **fehlt** |

**Dazu zwei Dinge, die der Masterplan als offen führt und die inzwischen beantwortet sind:**
Fluff-Leiste als TS-Balken (4.2b, »WS0 liefert«) — durch (93) faktisch entschieden: **die v11-Box
bleibt**. Und die Frage nach dem Tutorial-Rickroll (§8) ist am 9.8. beantwortet worden (liegt in der
Tutorial-**Welt**, nicht in der Tutorial-**Runde**), steht aber weiter unter »Offene Fragen«.

---

## §4 Der offene Diff — die teuerste Stelle

HOUSEKEEPING §4v markiert drei Dateien als **»Diff an WS1«**: `terrain-paint.js` (tp-v4.6),
`overworld-game-v10.js` (`paintOpt` mit `fluid`+`nah`, `drawWater` hinter der Fluid-Schicht) und
`water-kiss.js` (neu). **Seit dem sind dazugekommen:** `water-form`-Attribut (observedAttributes +
eine Zeile im Callback), Kamerazweig, `stepReader`, `spawnPoints`, `spawnCritters`,
Tutorial-Gegner, drei gelöschte Konstanten, Journey 2.4.0, `card-rail-v9b.js` (vier Befunde,
Nähte 74–78, 87/88), Statblatt-Rücknahme.

Der Masterplan §6 verlangt: *eine Richtung je Runde, ein Export, ein Empfänger, eine Abnahme mit
Zahlen.* Wir haben jetzt **zwei Runden ungesendet** übereinander. Das ist genau die Vorstufe von
»zwei Wahrheiten«, der laut §9 teuersten Klasse dieses Projekts — und sie trifft ausgerechnet den
Runner, der WS1 gehört.

**Empfehlung:** bevor v13 einen Slice baut, **ein** Handover-Blatt `docs/overworld-v13/
HANDOVER_WS1_2026-08-12.md` mit (a) Datei-für-Datei-Diff v11→v12→v13, (b) den Nähten 67–95,
(c) dem Masterplan-Patch aus §3 als fertigem Textblock zum Einsetzen. Kosten: eine Runde.
Nutzen: der Plan und der Code meinen wieder dasselbe.

---

## §5 Offene Punkte, die Georg gehören

1. **Erster v13-Slice** — Ink-Outline als System (1+2 zusammen) oder erst Gummiband messen (3)?
2. **Cartoon-Wasser-Referenz** — steht seit 12.8. auf »Georg recherchiert«; solange ist `waterForm`
   geparkt und das Glitzern aus.
3. **Pixelbäcker** — geht das Briefing so raus, oder mit den vier Prüfpunkten aus §2 eingearbeitet?
   Und: eigener Chat/Projekt (wie im Blatt vorgesehen) oder hier?
4. **Masterplan-Patch** — schicken wir ihn an WS1, oder pflegen wir die hiesige Kopie mit
   ausdrücklichem Vermerk »Kopie, Eigentum WS1«? (Zweiteres ist bequem und riskant.)
5. **Sieben Einheiten ohne Porträt** — bleibt es bei »kein Sprite-Kopf als Ersatz«, oder darf ein
   gebackenes Porträt aus dem Pixelbäcker die Lücke füllen? Das wäre die erste echte Kopplung
   zwischen Bäcker und Spiel.
