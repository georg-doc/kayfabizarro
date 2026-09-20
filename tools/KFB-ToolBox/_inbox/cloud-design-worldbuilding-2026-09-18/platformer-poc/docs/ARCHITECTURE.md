# Architektur

Ein Renderer, ein Loop, **ein Bewegungs-Besitzer**, **ein Aktor-Mixer**. Jede Datei hat genau
eine Zuständigkeit; wo zwei Dinge sich berühren, steht im Code, warum.

```
index.html          Shell: Importmap (three 0.160), Stylesheet, <canvas>, <div id="hud">
src/main.js         Boot, Eingabe, Loop, Moduswechsel, Persistenz, window.KFB_POC
src/sources.js      Repo, Pins, raw()/jsDelivr-Regel, Ladeprotokoll
src/loader.js       EIN GLTFLoader, Cache, Textur-Faltung, Messen, deterministisches RNG
src/world.js        Plattform-Graph + Pack-Geometrie; SOLID (Kollision) getrennt von VISUAL
src/physics.js      Player: semantische Zustände, Kollision, Sprung, Rettung, Ereignisse
src/assist.js       Chill: Zielbewertung + ballistische Bahn (solveArc/arcPoints)
src/camera-rig.js   Third-Person-Follow mit freiem Orbit, kein Selbstlauf
src/actors.js       Vier Adapter + Clip-Präsentation; mountActor() ist der einzige Eingang
src/fx.js           Ereignis → Ton (WebAudio, synthetisiert) und Sicht-Feedback
src/hud.js          Kopfband, Aktor-Blatt, Motion Lab, Hilfe, Weltbeschriftungen
data/*.json         Level, Portale, Roster, Pack-Pfadindex
```

## Der eine Bewegungs-Besitzer

`physics.js` schreibt Position und Geschwindigkeit. Kein Adapter, keine Kamera, kein Assist
tut das. Adapter LESEN den Zustand und liefern Präsentation:

```
IDLE · WALK · RUN · DUCK · JUMP_START · AIRBORNE · LAND · HIT · EMOTE
```

`JUMP_START` ist die Anticipation (0,14 s): Position friert, Geschwindigkeit bleibt. Danach
`takeoff()` — manuell (Sprunggeschwindigkeit nach oben, Horizontale gehört dem Spieler) oder
assistiert (gerechnete Anfangsgeschwindigkeit). Ein Sprung, zwei Herkünfte, eine Kette.

## Drei Messungen, die den Bau tragen

1. **Zellkante** aus `Cube_Grass_Center` (2,000). Alle Level-Maße sind Zellen; erst
   `world.js` macht Weltmaße daraus. Ein anderes Pack → ein anderes Maß, gleiches Level.
2. **Figurenhöhe** je Aktor gemessen und auf 1,05 Zellen gebracht. Die Pack-Figur ist
   2,057 hoch, also ist eine Zelle rund eine Figur — das ist die Proportion des Packs, nicht
   eine gewählte.
3. **Bindungsquote** je Clip: wie viele Tracks eines KayKit-Clips im Skelett dieses Aktors
   auflösen. Steht im Lab. Ein hübsch aussehender Clip ist kein Beweis.

## Kollisionsreihenfolge (die teuerste Lektion dieses Baus)

Erst **Boden**, dann **Wände**. Umgekehrt schob die seitliche Auflösung eine gerade landende
Figur aus der Plattform, weil sie für ein Bild 0,1 unter der Oberkante stand — gemessen:
drei von neun assistierten Sprüngen endeten so im Fall. Zusätzlich prüft der Bodentest die
STRECKE `prevY → pos.y`, nicht nur den Endpunkt (Durchschlag bei -20 u/s und 50 ms).
Die Wandprüfung greift erst, wenn die Oberkante deutlich (0,3 Zellen) über den Füßen liegt —
darunter ist es eine Landung, kein Anstoßen.

## Assist: warum der Bogen ballistisch bleiben MUSS

`solveArc` löst über die Apexhöhe, nicht über die Zeit: reicht die Horizontalgeschwindigkeit
nicht, wird der Bogen **höher**, nicht schneller. Obergrenzen (4,5 Zellen Überhöhung, 1,9 s)
lehnen unplausible Ziele ab — die Combat Arena erreicht man über den Bouncer, nicht über einen
Assist, der alles kann.

Während eines assistierten Fluges ist die Luftkontrolle **null**. Mit Dämpfung 0,8 blieb die
Figur bei einem 11,4-Einheiten-Sprung zwei Einheiten vor der Plattform: „Landung garantiert"
wäre dann eine Lüge gewesen. Ohne Eingabe bremst die Luft auch im manuellen Sprung fast nicht
(0,25 statt 4,5) — sonst fressen 0,9 s Flugzeit 98 % des Anlaufs.

## Was dieses Paket NICHT besitzt

Kein Asset-Registry (es liest den vorhandenen Shard), keine zweite Animationsbibliothek (sie
kommt aus `KayKit_Character_Animations_1.1`), kein eigenes FrizzleBob-Gesicht (das kommt aus
`kfb-rigs-embed-v3`), keine Travel-/Combat-/OSM-Integration, kein Audio-Motor (WebAudio-Blips
als Ereignisabbildung).
