# Kampf-VFX und -Ton · Shortlist R3: nur kostenlos, zuerst unser Bestand · WSV → WS0 · 05.11.2026

Anlass: Georg zur Kauf-Shortlist: „Das ist natürlich völlig inakzeptabel, dass ich jetzt hier irgendwas zahle, wo es doch so viele kostenlose SFX gibt. Also nicht zuletzt auch in dem GitHub-Ordner.“ Die Kaufliste (R2) ist damit gestrichen. Die Look-Richtung bleibt Vorschlag, die Einbauregeln aus `VFX_ART_DIRECTION_R1.md` §4 gelten weiter. Heruntergeladen wurde nichts.

## 1 · Ton im Bestand: was schon da ist und was davon taugt
**Was es gibt:**
- **KFB-eigene Sätze** (`KFB_HUB/40_AUDIO/elevenlabs_r1`, gespiegelt in `assets/private/40_AUDIO`, im Spiel über `src/audio/combatFxPlan.r2.js`):
  - `combat_destruct_r5`: Waffen in Schichten, je Pistole, Blaster und Gatling Crack, Body und Mechanik mit 4–6 Varianten;
  - `combat_r1`: Fäuste, Rakete, Explosion klein und groß;
  - `blaster_r1`: Schuss, Salve, Nachladen, Einschläge auf Knete und Metall, Vorbeiflug, Überhitzen;
  - `detonator_r1`, `throwables_r1`, `debris_crash_r1`: Trümmer, Holz, Schrauben, Staub.
- **Freie Pakete auf der Platte** (unter `Frizzlebob fractal almanac … /3D ASSETS/Audio/`):
  - Kenney Sci-Fi Sounds und Impact Sounds (beide CC0, Lizenzdatei liegt bei);
  - „400 Sounds Pack“;
  - IndieSFX „S050C Arcade Shooter“ (440 Dateien, Lizenz-PDF liegt bei);
  - „Classic Arcade SFX“ und „Add“ (Laser, Bass-Wellen).

  Bei den drei letzten muss die Lizenz noch gelesen werden; ihre Herkunft ist nicht dokumentiert.

**Messung statt Bauchgefühl:** Ich habe die wichtigsten Dateien technisch vermessen, siehe die Tabelle unten. Das ersetzt kein Anhören, zeigt aber die Fehlerklasse.

| Datei | Anschlag | Bass < 150 Hz | Punch 80–200 Hz | Nachhall | Befund |
|---|---|---|---|---|---|
| R5 Pistole Crack | 15 ms | 0 % | 0 % | 0,13 s | guter Anschlag, kein Körper |
| R5 Pistole Body | 32 ms | 100 % | **0 %** | 0,14 s | **liegt ganz unter 80 Hz: auf MacBook-Lautsprechern praktisch unhörbar** |
| R5 Gatling Body | 26 ms | 100 % | 13 % | 0,14 s | **Pegel −30 dB**, viel zu leise |
| R5 Blaster Body | **123 ms** | 100 % | 0 % | 0,12 s | Anschlag viel zu weich, unter 80 Hz |
| combat_r1 Explosion groß | 64 ms | 89 % | 28 % | 0,34 s | Anschlag zu weich (Benchmark: im ersten Bild) |
| Kenney lowFrequency_explosion | **227 ms** | 98 % | 46 % | 0,45 s | schwillt an, klingt eher nach Triebwerk |
| Kenney explosionCrunch | 2 ms | 70 % | 24 % | 0,53 s | **guter Kandidat** kleine Explosion |
| S050C ExploRetroDeep | 5 ms | 67 % | 46 % | 0,61 s | **guter Kandidat** große Explosion (Kern) |
| Kenney impactMetal_heavy | 1 ms | 87 % | 0 % | 0,16 s | guter Treffer- bzw. Mechanik-Anschlag |
| 400 Sounds shot_muffled | 75 ms | 47 % | **78 %** | 0,33 s | starker Laptop-Punch, Anschlag weich: als Body-Schicht |
| S050C Machinegun / AutoGun | 2–7 ms | 12–13 % | 17–20 % | 0,14–0,19 s | Arcade, dünn; höchstens Stakkato-Takt |

**Diagnose für q370/q374:** Unsere Schichten sind nicht grundsätzlich falsch, aber:
- Der Bass sitzt fast ganz unter 80 Hz und ist damit auf Laptop-Lautsprechern unhörbar.
- Die Gatling-Bass-Schicht ist rund 30 dB zu leise.
- Blaster und große Explosion haben einen zu weichen Anschlag.

Das deckt sich mit „kaum hörbar“ und „Triebwerk“.

Erster Schritt ohne einen neuen Download: die vorhandenen Bass-Schichten auf 80–200 Hz anheben bzw. sättigen, die Gatling-Bass-Schicht im Pegel angleichen, den Anschlag der Explosionen schärfen. Dazu Kenney explosionCrunch, S050C ExploRetroDeep und impactMetal_heavy als zusätzliche Schichten aus dem Bestand.

## 2 · VFX im Bestand
- **Brackeys VFX Bundle** (`KFB Hex Assets … /FX_Visual/brackeys_vfx_bundle`):
  - 8 gezeichnete Flipbooks: Sternexplosion, Big Hit, Feuerring, weißer Impact, Elektroring, Aufladen, Feuerpunkt, Blut;
  - 38 Einzeltexturen: muzzle_01–05, spark, smoke, flame, trace, scorch, dirt, star, circle; die Namen entsprechen dem Kenney Particle Pack (CC0).
  - Lizenz des Bundles laut V-977 „Bestand FX_Visual“; schriftlich geprüft habe ich sie nicht.
  - Big Hit ist pixelig und laut V-977 nicht als Haupteffekt gedacht.
- **FreeHitVfx `t_stylizedhit_1.png`** (2048 px): eine stilisierte Treffer-Formmaske, genau die Art Textur für die Erosions-Technik. Lizenz nicht geprüft.
- **KFB Impact + Splatter VFX** (Georgs Bögen 26.10., 4 Bögen): Einschlag-Krater, Tintenspritzer, Trümmerkränze, Rauchpuffs in Draufsicht. Das sind Georgs eigene Bilder, also frei. Sie passen als Decal bzw. Krater und für die Tinten-Slops (V-1483), nicht als Feuerball.
- **MixedBag-Tintenblobs** (Popup Assets 04, `KFB_BlackInk_*`): für Slop-Treffer, nicht für Waffen.
- **Kenney Smoke Particles und Splat Pack** (CC0) liegen als Ordner bzw. Zip im Almanach-Ordner.

## 3 · Was fehlt, nur aus freien Quellen (Downloads erst nach Georgs Ja)
| Lücke | Freie Quelle | Größe | Lizenz |
|---|---|---|---|
| echte Gatling bzw. Minigun (Stakkato, Mechanik) | Freesound CC0: „Gatling Gun Close“ (mikewest), „MiniGun Shooting“ (Steelskull) | wenige MB | CC0 |
| echte Salven mit Wumms | BOOM Free ZU-23-2 | **0,7 GB** | frei für Spiele, keine Weitergabe; Seite sagt „nur für gewerbliche Kunden“ |
| Explosionen und Impacts mit Anschlag | BOOM Free Processed Impacts | **0,5–0,7 GB** | wie oben |
| großer Grundstock | Sonniss GDC Bundles | **je Jahrgang viele GB** | frei, keine Nennung; **zu groß für die Platte (10–15 GB frei)**, nur einzelne Jahrgänge bzw. Ordner |
| hochaufgelöste Explosions- und Rauch-Flipbooks | Unity Labs Free VFX Image Sequences & Flipbooks | nicht geprüft | CC0 |
| Funken, Rauch, Mündung (Ergänzung) | Kenney Particle Pack (fehlt lokal teilweise) | klein | CC0 |

Nicht nehmen: Ember Lite (laut Seite mit generativer KI gemacht), ZapSplat gratis (Namensnennung Pflicht), Kalponic (Lizenzangaben widersprechen sich), Unity-Asset-Store-Texturen (EULA verbietet offene Auslieferung im Web-Spiel).

## 4 · Look-Richtung mit einem freien Beispiel
`beispiel/EROSION_BEISPIEL_R1.png` zeigt die Technik in 6 Phasen (Bild 0, 2, 4 bis 10):
- Ausgangspunkt ist die freie Formmaske aus dem Bestand (FreeHitVfx).
- Daraus wird ein Abstandsfeld, das mit harter Kante erodiert, statt auszublenden; der Kern hält am längsten.
- Eine Farbrampe führt von Weiß über KFB-Gelb und Orange nach Dunkelrot.

Das Beispiel ist eine Anschauung der Technik, kein fertiger Effekt. Mit Bestandsformen (Brackeys-Sterne, Kenney muzzle_01–05, FreeHitVfx) lässt sich die Richtung ohne Kauf umsetzen; der Abspiel-Shader ist eine Stütz-Ebene (WS0-Entscheid).

## 5 · Vorschlag für die Hub-Frage
1. **Ton zuerst aus dem Bestand reparieren**, ohne Download:
   - Bass-Schichten auf Laptop-Punch heben (80–200 Hz, Sättigung).
   - Gatling-Body um ~30 dB angleichen.
   - Anschlag der Explosionen schärfen.
   - Kenney explosionCrunch, S050C ExploRetroDeep und Kenney impactMetal_heavy als Schichten dazu.

   Vorher die Lizenzen von 400 Sounds, S050C und Classic Arcade lesen.
2. **Download-Freigabe klein:** zwei Freesound-CC0-Gatlings, Kenney Particle Pack und die Unity-Labs-Flipbooks (CC0). Die BOOM-Gratispakete (je ~0,7 GB) erst, wenn Platz ist.
3. **VFX aus dem Bestand:** Brackeys-Sterne und -Ringe, Kenney muzzle bzw. spark bzw. smoke, FreeHitVfx-Maske, gespielt mit Erosion und Farbrampe. Georgs Impact- und Splatter-Bögen für Krater und Decal.
