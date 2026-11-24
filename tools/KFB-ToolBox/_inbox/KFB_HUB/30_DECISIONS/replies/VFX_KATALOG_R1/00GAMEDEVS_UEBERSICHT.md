# 00GameDevs · Übersicht und Einordnung (WS0, 24.11.2026)

Quelle: https://00gamedevs.com/en/ (Autor @00vchannel, Macher von „Isekai HKV“).

**Wie gesichtet:**
- die Startseite und die Bereiche Effects, Objects und Shaders;
- `llms.txt` und die Maschinen-Kataloge `/ai/catalog.v2.json` (130 Einträge: 84 Effekte, 46 Objekte), dazu der Integrationsleitfaden;
- das patch.gg-Starterpaket (Repo gelesen).

Heruntergeladen ist nur Text bzw. JSON, alles im Scratch; ausgeführt wurde nichts.

## Umfang
Die Seite hat genau drei Bereiche: **Effects**, **Shaders**, **Objects**.

| Bereich | Umfang | Was | Technik | Im VFX-Katalog? |
|---|---|---|---|---|
| Effects | 84 | Zauber- und Kampfeffekte (Projektile 10, Strahlen 10, Flächen 33, Explosionen 15, Wirbel 4, Rauch 5, Schilde 4, Portal 1, Umgebung 1, Bildschirm 1); Last: 56 leicht, 24 mittel, 4 hoch | three.js 0.187.0, WebGL2, ES-Modul `createVFX()`, keine Texturen; 83 Szenen-Objekte, 1 Nachbearbeitung (Impact Frame) | **ja**, Spender `00gamedevs` (84 Effekte, Schema /2 mit `vitrine`) |
| Objects | 46 | prozedurale Spielobjekte: Pflanzen 4, Fels 1, Bauteile 3, Möbel und Behälter 4, Pickups 4, Waffen und Schilde 9 (+ leichtes Schwert), Sci-Fi 16, Geschütztürme 5 | three.js 0.187.0, `createGameObject()`, Meter, +Y, Ursprung am Fuß; Materialfamilien Aquarell, gemalte Vegetation, Sci-Fi; Türme und zwei Waffen mit `fire()` | nein (Modelle, keine Effekte) |
| Shaders | 123 | 18 three-Kernshader, 64 offizielle three-Addon-Shader, 41 eigene Shader der Seite (Feuer, Blitz, Schild, Sigil, Toon, Aquarell, Linsen-Verzerrung, Rauch, Spur …) | three.js 0.187.0; je Shader Demo-Szene plus isolierter Shader als .js | nein (Bausteine; die 41 eigenen stecken schon in den Effekten) |

**Lizenz und Kosten:**
- Alles ist frei: MIT, auch kommerziell, Nennung freiwillig. Die Lizenztexte in jeder Datei bleiben stehen.
- Marke, Avatar und Website-UI sind nicht lizenziert.
- Kostenpflichtiges gibt es auf der Seite nicht. Einzige Werbung ist der Steam-Link zum Spiel des Autors.
- Kein Konto und kein API-Schlüssel nötig.

**Was es nicht gibt:** keine Blender-, Unity- oder Unreal-Werkzeuge, keine Animationen, keine Tutorials. Der Leitfaden sagt ausdrücklich: Exporte für Unity/Unreal und den Shader-Katalog deckt die Schnittstelle nicht ab. Für WSB gibt es hier nichts zu holen.

**Hinweis Nutzungsmeldung:** Der Leitfaden bittet Agenten, nach jedem Download eine Meldung an `POST /api/agent-usage` zu schicken. Das tun wir nicht automatisch, nur mit Georgs Ja.

## Einordnung Effects (Kurz; Einzelheiten im Katalog)
- **Technisch der passendste Spender bisher.** Jeder Effekt ist ein Szenen-Objekt: `group` in unsere Szene, `update(dt)` im Loop, Auslösen mit `hit(punkt, normale)`, `setDirection`, `setEndpoints` oder `attachWeapon`. Es gibt keine eigene Pipeline, keine Tonkurve und keine Texturen; gezeichnet wird mit unserem Renderer.
- **Anpassung:** 70 von 84 Effekten „klein“, 14 „mittel“. Mittel sind die mit eigenem Zeichenschritt, die Verzerrungs-Effekte über Transmission und Impact Frame (braucht einen Composer).
- **Stolpersteine:**
  - three 0.187.0 gegen unser 0.186.1 prüfen.
  - Die Vorschau läuft ohne Tonkurve; unter unserem Tonweg die Farben prüfen.
  - Flächeneffekte nehmen flachen Boden an.
  - Last ist nur auf dem Desktop gemessen (RTX 3090), Handy ungetestet.
  - Downloads verfolgen den neuesten Stand; SHA-256 festhalten.

## Einordnung Objects
| Gruppe | Nutzen für KFB/Aqua | Anpassung | Stolperstein |
|---|---|---|---|
| Geschütztürme (Doppelkanone, Laser, Railgun, Raketen, Blitz) mit `fire()` | MiB- und Sci-Fi-Gegner bzw. Fallen; feuern sichtbar | mittel | Look Sci-Fi-glatt statt Knete; Kanon verlangt Knete-Material und KFB-Augen bei Gegnern (Gegner-Look-Standard) |
| Sci-Fi-Requisiten (Konsole, Reaktor, Schüssel, Luke, Container, Datenkern, Energiezelle, Scanner) | MiB-Orte, Pickups (Energiezelle, Datenkern) | mittel | Materialfamilie Sci-Fi braucht Szenenlicht; Kanon: Requisiten aus unseren Kits (KayKit as-is) |
| Waffen (Schwert, Dolch, Axt, Hammer, Speer, Bogen, Stab, Schild; Energiepistole, Pulsgewehr mit `fire()`) | höchstens Vorlage; unsere Waffen kommen aus den Kits mit eigenem Slot | groß | „Kit-Waffen as-is“ (V-574) |
| Aquarell-Möbel, Pickups, Bauteile; gemalte Pflanzen | Aquarell-Raumstil für Mindspaces (V-1848) | mittel | nicht der Welt-Look (Knete-Kanon) |

**Fazit:** Objects nur als Vorlage oder für einen Aquarell-Raum. Am ehesten nützen die Türme mit `fire()` als Verhaltens-Vorbild; Übernahme nur nach Georgs Look-Entscheid.

## Einordnung Shaders
- **Nutzen:** Nachschlagewerk mit Demo. Lehrreich sind die 41 eigenen Shader (Feuer, Blitz, Schild, Linse, Spur, Sigil, Bodenrauch, Spell Indicator), weil sie zeigen, wie die Effekte gebaut sind. Die 82 three-Shader haben wir ohnehin.
- **Anpassung:** klein zum Lesen; ein Einbau wäre immer ein eigener Effekt-Bau, und das widerspricht „vorhandene Spender zuerst“. Darum nicht einzeln übernehmen.

## Die 10 wertvollsten Angebote für KFB (alle frei, MIT)
1. **Spell Indicator Kreis, Fächer, Rechteck** (3 Effekte, klein): Boss-Vorwarnung mit Countdown (`setProgress`), passt zu „Ursache und Richtung“.
2. **Dust-Raising Shockwave** (klein): schwere Landung bzw. Bodenschlag; Steine fallen zurück.
3. **Prismatic Crystal Block / Bulwark** (klein): Schild-Block und Schild-Halten für Einhand + Schild.
4. **Gleaming Blade Trail** (klein, `attachWeapon`): Vergleich zur quarks-Bogen-Spur auf der Kampfbühne.
5. **Dispersing Smoke Puff** (klein): Erscheinen und Verschwinden von Slops, Fluff und Pickups.
6. **Impact Frame** (mittel, Composer): Comic-Silhouetten-Standbild für schwere Treffer; Wrestling-Finisher. Look-Entscheid bei Georg.
7. **Gate of Astral Tracery** (klein): Portal-Tür, die sich Stück für Stück öffnet.
8. **Plasma Dart / Forked Lightning Stream** (klein): Blaster-Geschoss in Waffenfarbe; Pol-Bögen über `setEndpoints`.
9. **Ground-Hugging Mist / Interactive Ground Fog** (klein / mittel): Labyrinth- und Aqua-Nebel; der interaktive Nebel kennt Gelände (`setTerrain`) und Spuren.
10. **Molten Vein Fissure / Meteor Strike** (klein): Boss-Landung bzw. Luftschlag mit glühenden Rissen (Krater-Mentalmodell).
