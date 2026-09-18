# WS1 · Cartoon Vehicle Deformer · Review-Paket

Stand 18.09.2026. Fahrzeug-Linie `lab-v7` aus dem KFB Animation Lab.
Dies ist der schlanke Satz: Code, Doku, zwei Belegbilder. Ohne Asset-Bibliotheken, ohne
Screenshot-Archiv, ohne 3D-Modelle — die liegen im Repo und werden zur Laufzeit geladen.

## Was hier drin ist

```
KFB Cartoon Vehicle Deformer Lab.dc.html   die Werkbank, direkt im Browser öffnen
support.js                                 Laufzeit (nicht bearbeiten)
lab-v7/                                    acht Module und Datendateien
  vehicle-cartoon-deformer.v2.js           der Deformer: Knotenbaum, Springs, Priorität
  carrig.v1.js                             Vermessen und Riggen, Radsuche
  fixture-adapters.v2.js                   43 Fahrzeuge, Herkunft je Zeile
  deformer-profiles.json                   vier Profile (Startwerte, nicht abgenommen)
  TEST_SEQUENCES.json                      zwölf deterministische Testsequenzen
  registry-vehicles.v1.js                  Registry-Fahrzeugliste, gepinnte Adressen
  cardeform.v1.js                          ÜBERHOLT (Shader-Fassung, liegt als Nachweis)
  fixtures.v1.js                           ÜBERHOLT (Keyframe-Fixtures)
_ds/                                       DocCheck Design System, nur die zwei benutzten Dateien
docs/                                      sechs Dokumente, siehe unten
belege/                                    zwei Aufnahmen
```

Die Fahrzeugmodelle werden über gepinnte RAW-Adressen aus `georg-doc/kayfabizarro` geladen
(Handoff `10a7fdce6b`, Registry `34cde3f8f7`). Das Paket braucht also Netz, aber keine
Modelldateien.

## Was zuerst lesen

1. **`docs/HANDOVER_WSA_LEAD_2026-09-18.md`** — der Stand in einer Seite: was gebaut ist, welche
   drei Abhängigkeiten außerhalb liegen, welche zwei Regeln über die Linie hinaus gelten.
2. **`docs/RETURN_cartoon_vehicle_deformer.md`** — die Rückmeldung nach Briefing-Schema:
   IMPLEMENTED / STATIC TESTED / BROWSER TESTED / VISUALLY ACCEPTED BY GEORG / OPEN.
   Der Abschnitt `VISUALLY ACCEPTED BY GEORG` ist leer, und das ist der Punkt.
3. **`docs/HANDOVER_RACE_2026-09-18.md`** — die Schnittstelle zum Race-Runtime plus sechs Punkte,
   die beim Race-Chat liegen.
4. `docs/LIVING_VEHICLES.md` — Begründungen, Entscheidungen V1–V12, alle Befunde.
   `docs/CHANGELOG.md` — Zeitachse. `docs/HOUSEKEEPING.md` — Status je Datei und Clean Run.

## Clean Run · acht Schritte

`KFB Cartoon Vehicle Deformer Lab.dc.html` öffnen, dann:

1. Fixture-Liste links: 43 Zeilen, jede mit ihrer Herkunft (Handoff oder Registry).
2. `car_hatchback` wählen. Kopfzeile meldet `4 Räder (node) · r 0,072 · Spur 0,35 · Radstand 0,50`.
3. `BRAKE` — Nicken −2,45°, Längskompression −1,8 %, Fahrer zieht nach.
4. `DRIFT LEFT` — Yaw −7,25°, Gegenroll +1,25°, Seitenlast sichtbar reduziert.
5. `RAIL HOLD` — **ein** Einschlag, dann monotoner Abfall, dann ein Übergang beim Loslassen.
   Ein zweiter Schlag wäre der alte Fehler (vorher fünf).
6. `NEUTRAL` — `impact 0,00` über zwei Sekunden, sichtbar ruhig.
7. `RESET` — alle Springs exakt null.
8. Fixture wechseln — kein Zustand wandert mit.

Was auffällig danebenliegt, ist keine Überraschung, sondern steht benannt in `OPEN`:
der **Go-Kart by Poly** steht schief (nicht achsenparallel autoriert), **Skateboard** und
**Rollerskate** drehen keine Räder (verschweißtes Einzelnetz), **Space Base Bits** lädt nicht.

---

# Re-Briefing · was wir von WSA zurückbrauchen

Vier Sachen hängen nicht am Code, sondern an einer Entscheidung. Solange sie offen sind, wäre
jeder weitere Bauschritt geraten. Bitte je Punkt eine Zeile.

## 1 · Go-Kart by Poly steht schief

Das Modell ist nicht achsenparallel autoriert. Alle sechs achsenparallelen Lagen sind
durchgemessen, keine richtet es auf. Ein Schalter in der Werkbank kann das nicht heilen.

Möglich sind: **(a)** im Asset gerade drehen (Blender, einmalig), **(b)** eine freie Rotation je
Fahrzeug im Code erlauben — dann kommt ein Zahlenfeld in die Werkbank, das per Auge eingestellt
wird, **(c)** das Fahrzeug fallen lassen.

→ *Antwort:*

## 2 · Skateboard und Rollerskate drehen keine Räder

Die Rollen sind Teil eines einzigen verschweißten Netzes. Es gibt nichts, was man drehen könnte,
ohne das ganze Board zu drehen. Benannte Rollenknoten im Asset würden es lösen.

Möglich sind: **(a)** Knoten im Asset nachziehen, **(b)** beide ohne Radrotation akzeptieren
(Board-Roll läuft, nur die Rollen stehen still), **(c)** beide fallen lassen.

→ *Antwort:*

## 3 · Space Base Bits ist nicht ladbar

Die drei Fahrzeuge (`spacetruck`, `spacetruck_large`, `spacetruck_trailer`) liegen als glTF mit
externen `.bin`-Puffern in `KFB-Stunt-Car-Race` und lassen sich im Browser nicht abrufen.
Abhilfe: je Fahrzeug eine `.glb` (eine Datei, kein Sidecar) in
`kayfabizarro/media/3D_Assets`. Danach sind sie im Registry indiziert und die Zeile fällt in der
Werkbank von »fehlt« auf »geladen«.

Möglich sind: **(a)** jemand legt die drei `.glb` ab — wer, **(b)** die Linie bleibt auf »fehlt«
und die drei Zeilen stehen mit Grund im Tooltip.

→ *Antwort:*

## 4 · KayKit ActionFigure fehlt im Handoff

Briefing-Fixture 3 war »Skateboard + Rider«. Im Handoff-Satz (141 Assets) gibt es kein
`Rig_Medium` und keine ActionFigure. Nächstliegende gerigte Figuren sind `Astronaut_*`
(43 Joints) und `Mech_*` (13 Joints) — beide keine ActionFigure. Ersatzweise etwas anderes zu
nehmen wäre eine stille Abweichung vom Briefing, deshalb steht die Fixture aus.

Möglich sind: **(a)** die ActionFigure in den Handoff nachziehen, **(b)** eine andere Figur
benennen, die wir nehmen sollen, **(c)** Fixture 3 streichen.

→ *Antwort:*

---

## Dazu bitte, wenn es beim Ansehen entsteht

**Welche Zahlen sollen anders sein?** Kein Wert in `deformer-profiles.json` ist abgenommen; alle
stammen aus dem Briefing. Die Grenzen sind `squash .22 · stretch .16 · twist 10°`. Die Regler
stehen in der Werkbank — was zu viel oder zu wenig ist, lässt sich dort direkt einstellen und als
Zahl zurückmelden.

**Welche Sequenz liest falsch?** Die zwölf Sequenzen nennen jede ihren erwarteten Haupt-Read
(`TEST_SEQUENCES.json`). Eine Sequenz, deren Bewegung nicht das liest, was dort steht, ist ein
echter Befund — mit dem Namen der Sequenz genügt er.

**Wie geht es weiter?** Die naheliegenden nächsten Schritte, in der Reihenfolge des
Motion-Skills: erst ein Kontaktbogen über alle zwölf Sequenzen als Abnahmegrundlage, dann die
Profile abstimmen, dann Ton, Staub, Kamera-Shake und Lautwort — und erst dann der echte
Race-Runtime statt synthetischer Signale.
