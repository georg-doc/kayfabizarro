# GEPARKT · Fight Sandbox 02 · Wiederaufnahme (Stand 2026-10-01)

Georg, 2026-10-01: „Sieht soweit gut aus. Fights später wieder aufnehmen, feintunen, weitere Animationen dazu." Bis dahin ruht der Strang. Nichts ist offen angefangen.

## Einstieg in 5 Minuten

1. `KFB_Resident_Atlas_S15.html#__fight` öffnen. Das ist der Stand, nicht verändern — Arbeit geht in eine Kopie **S16** (Hausregel: eine Szene pro Sprint, Vorgänger bleibt Messbasis).
2. Lesen, in dieser Reihenfolge: `GEORG_FEEDBACK_2026-09-30.md` (Befunde F1–F6, Blender-Punkte) → `RETURN.md` (Probleme 1–8, Abnahme) → `SESSION_CUT.md` §4.
3. Georgs Urteile liegen, falls exportiert, im Browser unter dem Key `…verdicts.v2` (Schema `kfb.fight-sandbox-verdicts/0.2`). Vor dem ersten Umbau als JSON nach `docs/RESIDENT_FIGHT_SANDBOX_02/` ablegen, sonst gehen sie mit dem Browser-Speicher verloren.

## Was steht (nicht neu verhandeln)

- Cartoon-Kontakt: niemand berührt sich, Hit-Stop + Squash + Knet-Puff + Rückstoß verkaufen den Treffer. Abnahme 1–6 ✓.
- Rückstoß-Sperre (15 Bilder) bleibt schaltbar, roh = 0/16.
- Einzige Kampfdatenquelle: `fight/KFB_Fight_Cartoon_Contact.json` 0.2. `KFB_Fight_Combos.json` wird nicht gelesen.
- Nicht-Ziele: Physik, Ragdoll, Mesh-Kollision, IK, Retiming. Seil-Kollision wäre eine neue Entscheidung.

## Offene Entscheidungen bei Georg

| # | Frage | Default, falls Georg nichts sagt |
|---|---|---|
| D1 | Schulterwurf: Trennung an oder Ausnahme? (Opfer wird 3,53 m weggeschoben) | Ausnahme für die Dauer des Griffs, danach Trennung |
| D2 | Brute → Raider hoch: sichtbarer Fehlschlag bleibt? | bleibt, rot markiert |
| D3 | `reaction_a` und `standing_react_small_from_right`: Richtung bestätigt? | geschätzt, so markiert lassen |
| D4 | Ring nach Rig-Maßstab (~23 m für Brute) oder Anker zur Mitte? | Anker zur Mitte, Ring bleibt 9 m |

## Feintuning-Reihenfolge (Vorschlag)

1. **F5 Liegende Posen im Boden** — billigster sichtbarer Gewinn. Boden-Lift nur für `endsLying`, Probe-Vertices Kopf + Becken, erlaubte Einsinktiefe 3 cm × Maßstab. Messbar: Anteil Vertices unter Grund (heute 30–62 %, Ziel < 5 %).
2. **F4 Staubwolke** — Blickrichtung aus `startFacingYawDeg` statt Katalogwert (95° Widerspruch), Zusammenprall-Beat (Hit-Stop + Puff) vor der Wolke, beim Auswurf schaut A zum Fallenden.
3. **F1 Rücken an Rücken** — Combo für Combo mit Georg, Urteil im Export. `hitFrom: behind`-Reaktionen sind absichtlich, große Folge-Drehungen nicht.
4. **F3 Ring/Brute** — nach D4.
5. **F2 Hammer im Körper** — wartet auf Blender-MCP (Requisiten-Kapsel, Prop-Schlag für lange Stiele). Hier nur melden, nicht lösen.

## Neue Animationen (Wunschliste, noch ohne Clips)

Aus SESSION_CUT §5 und Georgs Wunsch: **Schubsen, Tackle, Body Slam**. Dazu als Kandidaten: Seil-Rückprall (braucht D4 + neue Entscheidung), Aufstehen nach Rückenlage (heute übersprungen). Jede neue Bewegung braucht in `KFB_Fight_Cartoon_Contact.json` dieselben Felder wie die 17 bestehenden (`contactFrame`, `hipsAtContact`, `limbAtContact`, `impactPuffAt`, `knockbackYawInClipDeg`), sonst greift die Abnahme nicht. Clips kommen aus dem Blender-MCP-Chat, nicht von hier.

## Abnahme beim Wiederaufnehmen

Erst „Abnahme 1–6 messen" in S16 laufen lassen, **bevor** etwas geändert wird. Muss 6/6 wie S15 liefern. Danach jede Änderung gegen dieselbe Messung.

## Ebenfalls geparkt (anderer Strang)

S14 Knetform/Friedhof: `docs/RESIDENT_CLAY_AR_01/OPEN_LATER.md` (fps M1, Schatten-Gate, Skelett-Füße).
