# KFB Cartoon Combat VFX — Design v10.1
**Stand 2026-09-02 · gilt für `modules/kfb-vfx.js` und `KFB Mech Combat Slice v10.dc.html`**
Quellen: `KFB Cartoon Combat VFX.md` · `KFB Mech Slice - Combat VFX.md` · `REFERENCES Combat VFX.md` · `KFB_COMBAT_FX_MENTAL_MODELS.md` (v3) · `media/3D_Assets/FX_Visual/` (Brackeys-Bundle, FreeHitVfx als SOP-Referenz)

Der Leitsatz bleibt: **Mündung zeigt Absicht, Projektil zeigt Richtung, Impact zeigt Konsequenz, Marke zeigt Nachwirkung, Ton setzt den Punkt.** Neu ist nicht der Satz, sondern wer ihn spricht: ein Modul, nicht 600 Zeilen im Wirt.

---

## 0 — Kritik am Bestand (v3 → v10.0), ehrlich

Was v3 richtig gemacht hat, bleibt: eine Impact-Tabelle statt einer Effektbibliothek, ein Hauptbuch gegen Flimmern, Reaktion vor Partikel, Marken die altern. Was nicht trug:

| Befund | Warum es ein Problem ist | v10.1 |
|---|---|---|
| **Atlas aus Canvas-Polygonen.** Ohne die Tuschefeder (die v10 bewusst weglässt) sind das 12 grobe Vielecke. Ein „burst“ ist ein Zackenkreis, ein „puff“ drei weiche Kreise. | Die Form trägt die Lesbarkeit. Polygon-Bursts lesen sich als Platzhalter, nicht als Cartoon. | Atlas aus **Brackeys-Masken** (CC0, weiß auf Alpha, 512 px): echte Mündungskegel, Rauch, Funkennetze, Sterne, Klecks, Schmauch. Prozedural nur noch als Notweg, bis die Masken geladen sind. |
| **Vier Primitive-Systeme nebeneinander:** Sprite-Pool, `_rings` (eigene Meshes), Tracer als Cylinder-/Streak-Gruppen pro Schuss, Decals als eigene Meshes mit eigenem Cache und eigener Alterungsschleife. | Vier Schleifen, vier Lebenszyklen, vier Stellen für Lecks. Das v3-Dokument nennt selbst „zwei Codepfade für dieselbe Sache“ als Schuld. | **Ein Pool, vier Ausrichtungen:** `bill` (Kamera), `ground` (flach), `surf` (Flächennormale), `vel` (Flugrichtung, Fläche zur Kamera). Ring, Streak, Marke, Funke und Rauch sind derselbe Quad mit anderem Modus. |
| **Der Beam war Schnellfeuer.** Kadenz 0,06 s, jeder Takt ein neuer Streak-Schuss mit Mündungsblitz. | Ein Dauerstrahl ist kein Maschinengewehr. Das Hauptbuch degradierte fast jeden Treffer — die Drosselung war ein Notbehelf gegen ein falsches Modell. | **`beam()` ist ein Strich** Mündung → Kontakt, jeden Frame nachgeführt, Hitscan pro Frame, Schaden im 60-ms-Takt. Ein Klick = 0,7-s-Stoß. Verblasst, wenn niemand mehr ruft. |
| **Staub und Rauch in festem Beige** (`0x9a8f76`, `0x8f8570`). | Auf einer roten FORBIDDEN-Welt oder einem blauen TRAGIC-Tal ist beiges Zeug fremd — die FX gehören dann nicht zur Landschaft, in der sie stattfinden. | **`setWorldTint(palette)`**: Staub = Mittelstop → Spitze, Rauch = Mittelstop → Grau, Wasser-Spritzer = Spitze → Weiß. Jede gewürfelte Welt färbt ihre FX. |
| **FX-Code im Wirt.** `_impact`, `_muzzleFx`, `_decal`, `_claim`, `_cue`, `_buildAtlas`, `_spritePool`, `_streakMesh`… im selben Objekt wie Kamera, Steuerung, Gegner-KI. | Nicht in einen zweiten POC zu tragen, ohne 600 Zeilen zu kopieren. v3 sagt: „wird beim Wirt-Einbau umgehängt“ — das ist genau jetzt. | **`modules/kfb-vfx.js`**: zeichnet, entscheidet nichts, feuert vier Ereignisse. Der Slice behält 60 Zeilen Adapter. |
| **Primärsignal war immer eine skalierte Kachel.** | Die gezeichnete Interpunktion — der eine Frame, in dem ein Treffer „sitzt“ — braucht Bewegung in der Form, nicht nur Wachstum. | **Flipbooks** (predrawn, 6×5) **nur für das Primärsignal** von heißen und harten Treffern. Frames gezählt, nicht geraten: `big_hit` hat 11 gezeichnete von 30. |

Nicht kritisiert, weil richtig: die 1/2/3-Regel, das Hauptbuch, der Hitstop der nie stapelt, Marken nur wo die Tabelle sie erlaubt, der Ring als semantische Sperre.

---

## 1 — Was die Referenzen lehren

**Brackeys-Bundle** (Picster + Kenney Masken, CodeManu-Sheets, Iché-Flipbooks): Masken sind *Rollen*, keine Effekte. `muzzle_01` ist ein Kegel — er wird Stinger-Mündung, Rail-Mündung und Flammenzunge, je nach Farbe, Größe, Ausrichtung. Eine Maske × n Farben × 4 Ausrichtungen = die ganze Effektbank. Das ist das Atlas-Argument aus v3, nur mit besserem Rohmaterial.

**FreeHitVfx (Godot, nur SOP)**: Ein Effekt ist ein *Preset* (drei Farben core/main/accent, duration, flash_size, layers mit size/lifetime/spin/overshoot/dissolve) über einem *System*, das jede weiß-auf-schwarz-Textur nimmt. Die Trennung „System zeichnet, Preset beschreibt“ übernehmen wir eins zu eins: `IMPACT[energy][surface]` ist unser Preset, `VFX` unser System. **Nicht übernommen:** Glow-Postprocessing als Voraussetzung (README: „Glow enabled … for the intended look“). Das Briefing verbietet Glow als Formersatz, und die Masken tragen ihre Kante selbst. Ebenso nicht: Mesh-Ringe mit Shader-Distortion — ein flacher Reif-Quad tut es.

---

## 2 — Mentale Modelle

Die acht aus v3 gelten weiter (Satz · Hauptbuch · Handschlag · Cartoon-Silbe · Bildebene · Reaktion schlägt Partikel · Beweisstück · ein Zeichner). Drei kommen dazu, weil v10 etwas anderes ist als v3: eine gewürfelte Welt, ein Modul, ein Chill-Shooter.

### M9 · DIE ROLLE, NICHT DAS BILD
**Eine Kachel hat genau eine Rolle. Die Rolle steht in der Tabelle, nicht im Code.**

`ATLAS[i].role` ist Pflichtfeld. „cone = Mündung schmal“, „trace = Speedline“, „ring = NUR Wasser/Schild/Ladung/Respawn“. Wer eine Kachel für etwas anderes braucht, legt eine neue an — nicht weil Speicher knapp wäre, sondern weil ein Auge, das dieselbe Form an zwei Stellen mit zwei Bedeutungen sieht, beide verlernt.

*Entscheidet:* ob ein neuer Effekt eine neue Kachel bekommt (ja, wenn neue Rolle) oder eine neue Farbe (ja, wenn gleiche Rolle).
*Gegenprobe:* Atlas ansehen (F1). Wenn man nicht zu jeder Kachel sagen kann, wann sie erscheint, ist eine zu viel.

### M10 · DIE WELT FÄRBT
**Waffe bringt Farbe. Oberfläche bringt Form. Die Welt bringt den Staub.**

Drei Farbquellen, drei Zuständigkeiten. Eine Explosion auf einer TRAGIC-Welt hat denselben Burst wie auf COMIC, aber der Rauch danach ist blaugrau statt olivgrau — und liest sich deshalb als Teil *dieser* Landschaft. Das gilt für alles Tertiäre (Staub, Rauch, Wasserspritzer); Primär und Sekundär bleiben bei der Waffe, sonst verliert man die Waffe.

*Entscheidet:* `setWorldTint()` bei jedem Weltwechsel; keine Tertiär-Farbe hart im Code.
*Gegenprobe:* Zwei Welten, derselbe Raketentreffer. Burst gleich, Rauch verschieden. Wenn der Rauch auch gleich ist, ist er falsch.

### M11 · DAS MODUL ZEICHNET, DER WIRT ENTSCHEIDET
**Physik, Kamera, Zeit, Ton und Ziel gehören dem Wirt. Das Modul bekommt einen Ort und meldet, was der Wirt tun *sollte*.**

Vier Ereignisse, mehr nicht: `shake {amt}` · `hitstop {s}` · `cue {kind, vol, at, weight}` · `react {target, knock, squash, dir}`. Das Modul kennt weder `camera.fov` noch `AudioContext` noch `enemy.hp`. Der Wirt darf jedes Ereignis ignorieren — dann fehlt Gewicht, aber nichts bricht. So läuft dasselbe Modul im Travel-Wirt (dort hört `trauma.js` auf `shake` und `tiny-audio` auf `cue`) ohne eine Zeile Änderung.

*Entscheidet:* die API. Kein `this._P`, kein `this._scene.fog`, kein `enemy.hurt()` im Modul.
*Gegenprobe:* `grep` im Modul nach `camera.fov`, `Audio`, `.hp` → 0 Treffer.

---

## 3 — Der Vertrag

```js
import VFX, { IMPACT, ATLAS, FLIP, BEAT } from './modules/kfb-vfx.js';
const vfx = new VFX({ THREE, scene, camera, poolSize: 280, decalCap: 70 });
vfx.on('shake', e => trauma.add(e.amt))
   .on('hitstop', e => time.stop(e.s))
   .on('cue', e => audio.play(e.kind, e.vol, e.at))
   .on('react', e => enemies.knock(e.target, e.dir, e.knock, e.squash));
vfx.setWorldTint(palette);           // bei jedem Weltwechsel
await vfx.load();                    // Masken + Flipbooks per RAW, prozedural bis dahin

// im Spiel
vfx.muzzle(from, dir, weapon);                          // Subjekt
const spr = vfx.streak(from, dir, color, len, w);       // Verb (Kugel = Speedline)
vfx.moveStreak(spr, pos, grow01, opacity01);            // pro Frame
vfx.beam(from, to, color, w);                           // Dauerstrahl, pro Frame rufen
vfx.impact({ point, normal, weapon, surface, heavy, scale, target, groundY, waterY });  // Objekt
vfx.aftermath(pos, radius, color);                      // Nachsatz schwerer Treffer
vfx.update(dt);                                         // die eine Schleife
vfx.stats();                                            // Sprites, Marken, Ledger, Kette, Atlas
```

**Waffenzeile** (im Wirt): `{ color, flash?, energy: kinetic|hot|wet|electric, heft 0..1, muz: star|spread|blast|charge|rail, fxExtra?: [kachel, n] }`. Eine neue Waffe ist diese Zeile. Braucht sie mehr, ist das Modell verletzt (M8).

**Oberflächen:** `earth · metal · bone · air · water · shield`. Wer getroffen wurde, sagt der Wirt (`_surfaceOf`), nie das Modul.

---

## 4 — Atlas und Flipbooks

**Atlas 4 × 4 à 256 px**, beim Boot aus `particles/alpha/` komponiert, 12 px Saum gegen Bluten. `rot90` für Kegel und Speedline, weil im Modus `vel` die U-Achse entlang der Flugrichtung läuft.

| # | Kachel | Maske | Rolle |
|---|---|---|---|
| 0 | cone | muzzle_01 | Mündung schmal (Schnellfeuer, Rail) |
| 1 | wide | muzzle_02 | Mündung breit (Schrot, Rakete, Mörser) |
| 2 | star4 | star_04 | harter Kontakt (kinetisch auf Metall/Luft) |
| 3 | star8 | star_01 | Kill-Glanz, Strahl-Kontakt |
| 4 | bolt | spark_03 | elektrisch: Netz am Ziel |
| 5 | flare | flare_01 | Glanzpunkt, Strahlkern |
| 6 | smoke | smoke_03 | Rauch, Nachwirkung |
| 7 | puff | smoke_06 | Staub, Landung, Erde-Treffer |
| 8 | dirt | dirt_01 | Klecks, Erdspritzer, Kleber |
| 9 | scorch | scorch_01 | Schmauch-Marke |
| 10 | ring | circle_02 | Reif — **nur** Wasser, Schild, Ladung, Respawn |
| 11 | glow | circle_05 | weicher Kern unter allem Heißen |
| 12 | trace | trace_01 | Speedline: Tracer, Funke, Strahl |
| 13 | slash | slash_01 | Wasserwelle (halb), Trudel-Bogen |
| 14 | flame | flame_05 | Flammenzunge |
| 15 | twirl | twirl_01 | Kleber-Wirbel, Ladung |

**Flipbooks** (predrawn, eigene Texturen, ein Durchlauf): `hit` (big_hit 6×5, **11** Frames, 36 fps) für heiß · `white` (impact_white 6×4, 11, 40 fps) für kinetisch auf Metall/Knochen · `star` (star_explosion 6×5, 26, 42 fps) für Kill/Nachwirkung · `ering` (electric_ring 6×5, 30, 40 fps) für Schild. Nicht genommen: `explosion_6x5` (832 kB, eingebackene Farbe — die Farbe gehört der Waffe), `vortex` (1,4 MB), `fire_ring`/`fire_point` (Loops, wir loopen nicht), `blood_impact` (kein Blut in KFB).

---

## 5 — Rhythmus (M4, als Daten)

```
BEAT = { muzzle 55 ms · burst 140 ms + 60 ms × heft · after 550 ms · Marke Boden 22 s · Marke Körper 6 s }
```
Struktur konstant, Amplitude über `heft`. Schwer heißt: längerer Hitstop, mehr Knockback, tieferer Ton — nicht größerer Burst.

---

## 6 — Chill & Fun: was der Shooter vom Modul braucht

- **Lesbarkeit vor Menge.** Hauptbuch aktiv (`useLedger`), `density` als Regler. Unter Dauerfeuer flackert nichts, einzelne Treffer bleiben zählbar.
- **Kein Bestrafen des Auges.** Kein Weißblitz, kein Screen-Glow, Shake gedeckelt (0,3), FOV-Punch nur beim Kill, Hitstop ≤ 90 ms und nie gestapelt.
- **Die Welt bleibt sichtbar.** Rauch max. Deckkraft 0,5 und kurz; Marken sind Zeugen, keine Tapete (Cap 70, älteste weicht, Bodenmarken sterben mit der Welt beim Reroll).
- **Feedback ohne Kosten zuerst:** Flash, Knockback, Squash, Trudeln kommen als `react`-Ereignis *vor* dem ersten Sprite. F2 (Sprites aus) muss spielbar bleiben — nur langweilig.

---

## 7 — Abnahme v10.1

- [x] `vfx.load()` meldet 16/16 Masken, 4 Flipbooks (F1 → ATLAS-Zeile)
- [x] Kugel, Bolzen, Skelett-Blitz sind Speedlines aus dem Pool; keine Tracer-Meshes mehr im Slice
- [x] Heat Beam ist ein Strich, kein Schnellfeuer; Klick = 0,7 s; Kontaktglanz sitzt am Treffer
- [x] Pool 280, Marken 70; `stats()` zeigt beides; kein Wachstum der Szene
- [x] Reroll färbt Staub/Rauch um (`setWorldTint`), Bodenmarken sterben mit der Welt
- [ ] Standbild-Test pro Waffe auf Erde/Metall/Knochen/Luft (Beleg-Captures fehlen noch)
- [ ] F2-Gegenprobe im Dauerfeuer dokumentiert
- [ ] Sound-Vorrang im Wirt-Mixer nachgebaut (der Slice spielt Dateien direkt, `cue` gilt)

## 8 — Was ausdrücklich nicht kommt

Glow/Bloom · DecalGeometry auf Skinned Meshes · Flammenwerfer/Eis/Homing (neue Familien, nicht neue Grammatik) · eine zweite Arena · Ink & Karten (kommen als eigene Schicht *über* dieses Modul, wenn KFB draufgesetzt wird: der Ink-Kanon ersetzt dann `load()` durch eine Feder-Zeichnung ins selbe 4×4-Raster — der Vertrag bleibt).
