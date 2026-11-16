# Tinte R1 · Zensur-Tinte als Fläche, Würfelmonster beißen und spucken · Konzept · WS0 · 16.11.2026 (Georg, V-1852)

Erst dieses Blatt, dann bauen. Kein Stückwerk: Biss, Spucken, Fläche, Tod und Ton kommen als ein Paket, mit einem Kritiker-Lauf vor dem Video.

## 1 · Georgs Regeln (16.11., Kern wörtlich)
- Kein Heilen-Kreislauf mit Waffenwechsel, das ist zu komplex. Wir gehen von der **Flächenlogik** aus.
- Wer in die schwarze Zensur-Tinte tritt, wird **langsamer** („klebt fest“), die Monster beißen dann leichter. **Schaden** durch Tinte nur im **Hard Mode**.
- Wer ein Tinten-Monster **tötet**, setzt **farbigen Fluff** frei, und die **Zensurfläche löst sich** in der Nähe wieder auf.
- Inkwave als Vorbild für Spritzer und Flächenfüllung; es soll ein fließender Übergang sein.

## 2 · Bestand zuerst (nichts davon wird neu gebaut)
| Teil | Wo |
|---|---|
| Würfelmonster vermessen (Clips, Blickachse +Z, Kopfstoß Bite_Front 0,44–0,47 u, Fernkampf je Art) | Repo `georg-doc/KFB-Combat-Arena` `modules/kfb-monster-roster.js`, `kfb-combat-def.js`, `kfb-hit-response.js`, `kfb-vfx-recipes.js` |
| Spucken mit Tropfen am Maul, Bogen, Aufprall, Fleck | Stamm `src/npc/darkFluffer.js` (SPIT, spuck.v3), `src/npc/flufferSim.js` |
| Spuck-Töne | `cueMap.js`: `fluffer.windup` DF01, `fluffer.spit` DF02, `fluffer.impact` DF03, `fluffer.taint` DF04 |
| Beiß-Ton | `combat_av_fix_r1/L07_mob_bite` (Eintrag in `cueMap.js` fehlt noch) |
| Trefferblitz Nahkampf | `src/modules/nahkampfFx.r1.js` (Georg q591 PASS) |
| FB-Reaktion | `src/m1/fbTreffer.js` (q638/q639 PASS), Mimik `fbMimik.js` |
| Leben, Tod, Spielmodi | `src/world/spielerLeben.js` (V-1849), `src/world/arena/spielModus.js` (q634: Chill/Normal/Hard) |
| Nasse Tintenspur der Ink-Blobs | V-1328 (inkPatch-Erweiterung wet: Glanz, Meniskus, einheitlicher Tintenton) |
| Farb-Fluff beim Tod | `orchard.burst` (wie heute) |
| Vorbild Farbkarte | Inkwave, Zweig `ref/inkwave-r1` @ed59d00: `src/world/paint.js`, `src/world/inkShading.js`, `src/game/actor.js` (MIT, three 0.186) |

## 3 · Wie es sich spielt
1. **Spucken (Fernkampf):** Ein Monster in 6–14 m holt aus (Tropfen sammeln sich am Maul, Ton DF01), spuckt im Bogen auf FB bzw. knapp vor ihn (DF02). Beim Aufprall (DF03) platzt ein Tintenfleck auf den Boden. Trifft der Bogen FB direkt, kostet das im Normal-Modus kein Leben, aber FB steht dann in Tinte.
2. **Tinte am Boden:** Der Fleck bleibt liegen und trocknet in etwa 6 s vom glänzenden zum matten Schwarz. Wer darin läuft, wird auf ein Tempo-Limit gebremst und springt weniger hoch (Inkwave: Tempo-Limit, Sprung × 0,72, schnelles Abbremsen beim Hineinlaufen). Im **Hard Mode** zusätzlich Schaden je Sekunde bis zu einer Obergrenze (Inkwave: 20 je s, höchstens 40 durch Tinte allein). Werte werden im Spiel an FBs Gehen/Joggen gemessen und angepasst, nicht übernommen.
3. **Beißen (Nahkampf):** Steht FB nah, beißt das Monster mit dem echten Kit-Clip `Bite_Front`. Es stellt sich so hin, dass der Kopfstoß des Clips FB erreicht (Reichweite je Art aus der Arena-Messung). Im Kontaktbild des Clips (Maul vorn) kommen Schaden, Trefferblitz an der Stelle, wo das Maul FBs Körper trifft, Beiß-Ton L07 und FBs Zucken. Kein künstlicher Vorschub des Körpers.
4. **Tod eines Monsters:** Death-Clip, dann farbiger Fluff (wie heute) und die Tinte im Umkreis löst sich auf; an der Stelle bleibt kurz ein farbiger Spritzer in Fluff-Farbe, der verblasst.
5. **Heilen** bleibt als Test-Schalter (q676), ist aber nicht der Spielweg.

## 4 · Technik
- **Eine Farbkarte am Boden (Inkwave-Prinzip, angepasst):** Inkwave malt in einen Atlas je Fläche. Unser Gelände ist ein endloses Höhenfeld, deshalb eine **mitwandernde Bodenkarte** um die Spielfigur (zum Beispiel 128 × 128 m, eine Textur), in die Spritzer von oben gestempelt werden. Kanäle wie Inkwave: Anteil Tinte/Farbe, Nässe, Ton, Deckung. Der Boden-Shader (`biomeTerrain`, Viertelboden) liest sie mit weichem Rand, Tintenwulst und nassem Glanz; Licht nur aus dem einen Rig (V-385).
- **Spielabfrage:** ein grobes Raster (0,25 m) auf der CPU beantwortet „steht FB in Tinte?“ und rechnet aus derselben Randform wie der Shader, damit Bild und Bremse übereinstimmen.
- **Ersetzt** die heutigen höchstens 4 Kreis-Flecken (`terrain.setInkPatches`) für die Würfelmonster; die alten Flecken bleiben bis zum Umstieg hinter ihrem Schalter.
- **Bremse:** über die Bewegungsgrenze der Spielfigur (Tempo-Limit, Sprungfaktor), ein Anschluss im Spieler-Modul, kein zweiter Controller.
- **Spucken:** vorhandener Bogen aus `darkFluffer`, Ziel = FB bzw. ein Punkt knapp vor ihm, Aufprall stempelt in die Farbkarte.
- **Leistung:** eine Textur und ein Lesevorgang im Boden-Shader; Stempeln nur bei Aufprall. Messung mit `test/_allesan.mjs` vorher und nachher.
- **Schalter:** `tinte=r1` (Testfahrt), erst nach Georgs PASS Release.

## 5 · Belege vor dem Hub
- Unit-Test: Randform CPU = Shader, Bremse an/aus, Trocknen, Auflösen beim Tod.
- Spieltest `test/_tinte.mjs`: Monster spuckt, Fleck liegt, FB wird langsamer (gemessen), Biss mit Kontakt im Clipbild, Tod löst Tinte auf; keine Seitenfehler; Bildzeit.
- Ein blinder Kritiker-Lauf auf das Video (Kontakt sichtbar? Effekt am Kontaktort? Biss statt Rempeln? Fleck lesbar?).
- Dann eine Hub-Karte mit Video aus der Seitenansicht auf der Sonnenseite.

## 6 · Nachtrag nach dem ersten Kritiker-Lauf (16.11., V-1854)
- Der Kritiker sah den Biss als Anlehnen: Der Kit-Clip `Bite_Front` zeigt aus Spielabstand kein deutliches Aufklappen und Zuschnappen. Die Tintenfläche las sich wie Schatten.
- **Bestand zuerst (V-956, V-954 FAIL):** Der Mac mini sichtet die vorhandenen Clips jeder Art (`Bite_Front`, `Bite_InPlace`, `Yes`, `No`, `Jump`, `HitRecieve`) nah und von der Seite mit FB davor und schlägt vor, wie sie ohne Umbau zu Biss und Spucken zusammengesetzt werden (Reihenfolge, Tempo, Übergänge). Über neue Clips (ob, wie, wer) entscheidet Georg erst nach dem Bestands-Bericht (V-954 offen).
- Die Kampfdaten je Art (Kontaktbild, Reichweite, Abgangsbild) kommen in die Figuren-SSOT der Würfelmonster (`src/data/characters/q_<art>.character.json`, Abschnitt `game`, V-1611), kein neues Format.
- WS0 im Spiel: Tinte tiefschwarz mit Glanz und Wulst, Ziel neben FB, größere Tropfen in hohem Bogen, Effekt am Maul, Rückstoß für FB (gebaut, Stamm), Seitenkamera für Belege.
