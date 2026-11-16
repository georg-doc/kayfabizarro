# Kampfbühne R1 · Prüf- und Freigabebühne für Kampf-, Kollisions-, VFX- und SFX-Kaskaden im KFB-Gelände (WS0, 16.11.2026)

**Auftrag (Georg 16.11.):** eine saubere (Kampf-)Bühne mit Freigabe und Kameras, so etwas wie der Übungsplatz von patch.gg/patch/elements, im KFB-Environment mit passenden Kamerapositionen und -winkeln. Später prüft dort ein externer, blinder Kritiker (Cartoon-Animation + Kampf-/Action-Game-Artist, Mac mini) alle Kaskaden.

**Warum:** Belege entstehen heute irgendwo im Gelände (Hügel, Kisten, Ruinen, Staub vor der Kamera, Figuren in der Kamera); jede Aufnahme braucht neue Suche nach einem Ort (q730, Soldaten, Würfelmonster). Ergebnis: schwer vergleichbar, oft unbrauchbar.

## Aufbau (Grundriss siehe kampfbuehne_grundriss.png)
- **Platz:** rund, eben, Durchmesser 40 m, KFB-Boden (unser Gelände-Look, eine Fläche, keine Kacheln), am Rand ein niedriger Gummiring (einfacher Torus, ein Material, V-Regel „Simple clean frames“).
- **Ort:** eigene Stelle im endlosen Gelände (Platz wird wie der Arena-Platz eben gelegt), frei von Begegnungen, Viertel und Bewuchs; Horizont offen. Erreichbar über Schalter `buehne=r1` (springt hin), im normalen Spiel nicht vorhanden.
- **Achse:** eine Aktionsachse durch die Mitte (Ost–West). Darauf die Plätze **A** (Angreifer: FB oder Wagen-Start) und **Z** (Ziel) 6 m auseinander, für Wagen eine Anlauf-Bahn durch eine Lücke im Ring (30 m Anlauf).
- **Ziele:** Slots für Plastik-Soldat, Würfelmonster, Slop, weiße Übungspuppe (Patch-Mannequin, V-1860 „weiße Puppen nur als Übungs-/Crash-Puppen“), dazu ein Prop-Slot (Baum, Pilz, Pop-up) für Hartgummi-Kollisionen.
- **Licht:** das eine Spiel-Rig, Tageszeit fest (Nachmittag, Sonne seitlich hinter der Kamera Seite), keine Bühnenlampen (V-385).

## Kameras (fest, relativ zur Aktionsachse, nicht zur Figur)
| Name | Lage | wofür |
|---|---|---|
| totale | 12 m, 35° über der Achse, schräg | ganzer Ablauf, Flugbahn |
| seite | quer zur Achse, Augenhöhe Ziel, 8 m | Kraftrichtung, Aufprall, Landung |
| dreiviertel | 40° vor dem Ziel, 6 m | Treffer am Körper, Gesicht |
| kontakt | 2,5 m, tief am Ziel | Treffermoment, Spritzer, Pfütze |
| oben | senkrecht über Z, 10 m | Pfützen, Splats, Fleck-Form |
| fahrkamera | die Spielkamera hinter dem Wagen | Fahrbelege (Pflicht) |

Jede Aufnahme: dieselbe Kaskade gleichzeitig in **zwei** Ansichten (Haupt + Nah) als geteiltes Bild, plus Einzelbilder an den Rezept-Marken (Kontakt, Landung, Platzen, Pfütze) – für Georg und den Kritiker.

## Steuerung (Prüfzugang, nur debug)
`__kfbBuehne`: `setze(slot, figur)`, `ausloesen(art, { staerke, richtung })` mit art = schuss | explosion | nahkampf | auto | wurf, `kamera(name)`, `aufnahme({ ansichten, dauer })`. Proben über `test/lib/buehne.mjs`.

## Reihenfolge
1. Grundriss + Konzept (diese Seite) → Hub-Frage.
2. R1 Bau: Platz, Ring, Slots, Kameras, Steuerung, ein Beleg (Würfelmonster Kampf + Umfahren aus allen Ansichten).
3. Danach alle Kaskaden-Belege nur noch auf der Bühne; Kritiker-Auftrag an den Mac mini, wenn Soldaten, Slops, Props und Waffen-Treffer drin sind.
