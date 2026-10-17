# Blender MCP · FrizzleBob v5 · Lider A sauber bauen
*14.10.2026 · Auftrag von Georg · Quelle: KFB ToolBox Production-08 + `Lid Reference.dc.html` (Spalte A)*

## Warum Blender
Die ToolBox baut die Lider zur Laufzeit aus zwei Schalen. Fünf Runden haben das Prinzip geklärt, die Form bleibt aber gebastelt: harte Innenkante zum Augapfel, Rand nicht weich gerundet, an den Ecken sieht man den Spalt zwischen den Schalen, die Lider stehen über den Kopf. Das ist Modellierarbeit, keine Laufzeit-Rechnung. Ziel: ein sauber modelliertes, geriggtes Lidpaar je Auge im GLB.

## Referenz
- Tutorial (Georg): https://www.youtube.com/watch?v=y3Q3oD7A1kM, bitte selbst ansehen und den Aufbau übernehmen. Claude Design konnte das Video nicht sehen.
- Look: `Lid Reference.dc.html` Spalte **A · Haut-Lid**: Auge etwa zur Hälfte im Kopf, das Lid wächst aus der Haut.
- Ausgangsstand: `handover/FB_V5_RIG_BASELINE_2026-10-14.json` (Augenlage, Oval, Brauen, Nase, Mund, Ohren, Haare).

## Mentales Modell (verbindlich)
1. **Das Lid ist Haut, kein Deckel.** Es geht nahtlos in den Kopf über, gleiches Material, und hat keine sichtbare Hinterkante.
2. **Eine Achse, zwei Lider.** Ober- und Unterlid drehen um dieselbe Achse durch die Augapfelmitte. Die Achse liegt **waagerecht im Kopf** (Kopf links–rechts), nicht quer zur schräg gestellten Augennormale. Das ist die Ursache des traurig/böse-Blicks in der ToolBox.
3. **Die Ecken sitzen fest.** Innen- und Außenwinkel sind Punkte auf der Haut. Beide Lidkanten laufen in diese Punkte. Hinter den Ecken gibt es keinen Spalt: dort ist das Gewebe verschmolzen.
4. **Ecken auf einer Linie.** Bei Neigung 0 liegen Innen- und Außenwinkel beider Augen auf einer waagerechten Linie.
5. **Die Kante ist ein runder Wulst.** Der Querschnitt der Lidkante ist ein Halbrund. Die Innenseite liegt dicht am Augapfel und läuft ohne Kante zu ihm aus.
6. **Geschlossen ist eine gerade Linie.** Die Lider treffen sich auf einer Naht etwas unter der Mitte (−3°), mit leichter Überlappung.

## Konstruktion
- Je Auge: Ober- und Unterlid als konzentrische Schale um den Augapfel (Innenradius ≈ 1,02 R, Dicke ≈ 0,07 R, Wulst ≈ 0,04 R), Ecken verschmolzen, Rand in die Kopfhaut verblendet.
- Augapfel: Halbachsen 0,114 / 0,114 / 0,113 (Körpereinheiten), Mitten L (−0,19 | 0,088 | 0,349), R (0,19 | 0,088 | 0,349). Oval-Neigung ±25° liegt auf der Augengruppe, **nicht** auf den Lidern.
- Antrieb: je Lid ein Knochen an der gemeinsamen Achse, **oder** Shape Keys `upper_close`, `lower_close` (0…1) plus `upper_slant_in`, `upper_slant_out` für Emotes. Die ToolBox liest beides.
- Offen-Winkel neutral: Oberkante vorn ≈ 50° über der Mitte, Unterkante ≈ 48° darunter.
- Material: Hautmaterial des Kopfes. Lider werfen **keinen** Schatten, empfangen aber (LESSONS_SHADOWS).

## Abnahme
1. Front, Neigung 0: Ecken beider Augen auf einer Linie (≤ 0,5°).
2. Kein Spalt hinter den Ecken, keine sichtbare Hinterkante, keine Naht zur Haut (Nahaufnahme Front und ¾).
3. Geschlossen: von vorn und in ¾ keine Sklera sichtbar.
4. Kantenquerschnitt rund, Übergang Innenseite → Augapfel ohne harte Kante.
5. Blick ±0,5 rad: Pupille sticht nirgends durchs Lid.
6. Renders: Front, ¾, Seite × neutral / müde / zu / böse / traurig / fröhlich (dieselben sechs wie die Referenz).

## Lieferung
GLB `FB_TEMPLATE_LOOK_v5c.glb` (Lider als eigene, benannte Meshes `FB_Lid_U_L`, `FB_Lid_L_L`, `FB_Lid_U_R`, `FB_Lid_L_R`), Renders, RETURN mit Messwerten zu 1–5.
