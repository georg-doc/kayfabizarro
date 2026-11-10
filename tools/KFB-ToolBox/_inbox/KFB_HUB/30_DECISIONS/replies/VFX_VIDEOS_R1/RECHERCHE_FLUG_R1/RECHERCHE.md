# Nahkampf-Treffer · Recherche R1 (Flug, 10.11.2026, zu ANALYSE_UND_AUFTRAG.md Punkt 1)

## Nachtrag R1c · gesamter Bestand, je Ordner ein Übersichtsblatt
Ordner **BESTAND_UEBERSICHT/** enthält je Bestandsordner ein Blatt; Folgen stehen als Reihe, Namen darunter.
- O1 Brackeys Teilchen, O2 Brackeys Flipbooks, O3 FreeHitVfx.
- O4 explosions_smoke: alle 14 GIF als Bildfolgen.
- O5 kenney_smoke-particles, O6 Beams_BinbunVFX (Textur), O7 pipo.
- O8 Craftpix-Rauch, O9 kenney_splat, O10 Tiny Swords Particle FX, O11 Craftpix Wasser/Feuer.
- Fehlen noch: kenney_particle-pack, unity_labs_WispySmoke01, unity_labs_DiscSmoke01 (kommen nach WS0s Push).

Bestes Stück je Trefferfamilie aus dem **gesamten** Bestand (ohne die drei neuen Ordner):

| Familie | Bestes Stück | Zweitbestes | Lücke? |
|---|---|---|---|
| Wisch-Bogen | FreeHitVfx t_stylizedhit_1 (harte gezeichnete Sicheln, Einzelbild) | explosions_smoke impact_verticalring.gif bzw. fireimpact.gif (Sichel in Schlagrichtung, Pixel-Art, klein) | ja: flache weiße Sichel mit dunklem Rand als Folge in groß |
| Treffer-Stern | **Georgs Blatt C** (Handgezeichneter Trefferblitz, 8 Bilder, sehr nah an Absolum) | Tiny Swords Explosion_02 Bild 2–4 (Zackenstern mit Umriss, 192 px, Pixel-Art); explosionbig Bild 3–4 | mit C geschlossen |
| Zacken-Explosion | Tiny Swords Explosion_02 (192 px) | explosionbig/whitehotbig (80 px) | ja, für die große Fassung mit Tusche-Umriss |
| Blitz-Scheibe | explosionbig/whitehotbig/whitehotmedium Bild 1 (flache weiße Scheibe) | – | nein |
| Tempolinien | collisionspark*.gif Bild 3–5 (harte gezeichnete Funkenstriche nach außen, Pixel-Art) | Brackeys trace/scratch (weich) | teilweise: keine großen langen Linien |
| Staub | Craftpix Smoke Explosion / Smoke Blow (flach, Bodenring) | Kenney White puff (weich wie Absolum); Tiny Swords Dust_02 (Pixel) | nein |
Nicht passend für Nahkampf: pipo (Magie-Kugeln), Craftpix Wasser/Feuer (Geschosse), kenney_splat (Kleckse, eher Decal), Beams (nur eine Platzhalter-Textur), Kenney Fart/Black smoke.

## Nachtrag R1b · 2D-Ebene nach Absolum: eigener Bestand je Trefferfamilie
Bild: **B3_Bestand_je_Familie_neben_Absolum.jpg** (je Zeile links das Absolum-Standbild, daneben die besten Bestandsstücke). Absolum-Folgen: V4_Absolum_Folgen.jpg (119,3 / 142,0 / 143,6 / 148,9 s, selbst gezogen).

Bestand gelesen aus kayfabizarro@main (bf1a7ca1): FX_Visual (brackeys, FreeHitVfx, explosions_smoke, kenney_smoke-particles, pipo) und 2D_Assets (Craftpix-Rauch, kenney_splat, Tiny Swords Particle FX). Die Dropbox-Kopien sind fast alle nur Online-Platzhalter (0 Byte); deshalb vom Repo gelesen, nicht von Dropbox.

| Familie | Bestes Bestandsstück | Passt? |
|---|---|---|
| Wisch-Bogen | FreeHitVfx t_stylizedhit_1 (gezeichnete harte Sicheln, ein Bild, Schwarzweiß-Maske) | nah, aber keine Folge. **Lücke:** flache weiße Sichel mit dunklem Rand als Bildfolge. Brackeys slash_01–04 sind weich und glühen. |
| Treffer-Stern | Brackeys big_hit_6x5, impact_white_6x4; explosionbig Bild 3–4 | Form ähnlich, aber weicher und dünner als Absolum; explosionbig hat die Absolum-Form (gelbe Zacken, weißer Kern), ist aber Pixel-Art mit 80×66 px. |
| Zacken-Explosion | explosionbig, whitehotbig (explosions_smoke) | Stil passt, Größe nicht (66–80 px). **Lücke:** große radiale Blitzzacken mit Tusche-Umriss. |
| Blitz-Scheibe | explosionbig/whitehotbig Bild 1 (flache weiße Scheibe) | passt, eine Vollfläche skaliert sauber. |
| Tempolinien | Brackeys trace, scratch | **Lücke:** nur weiche Glühstriche, keine harten gezeichneten Linien. |
| Staub | Craftpix Smoke Explosion (16 Bilder), Smoke Blow (12); Kenney White puff | passt (Craftpix flach mit Bodenring, Kenney weich wie der Absolum-Staub). |

Nicht passend: pipo (Magie-Kugeln), Tiny Swords Dust/Explosion (Pixel-Art, winzig), Brackeys circle/light (Glühen), kenney_splat (Farbkleckse, eher Decal), Beams_BinbunVFX (Godot-Shader, kein Bild).

Neue 2D-Pakete: Die Seiten (opengameart „hit animation frame by frame“ 1 und 2, itch flashyfeather „Hit Animations Vol.4“, lil-cthulhu „hit-effect“, pimen „Battle VFX Hit Spark“) blocken automatische Abrufe. Lizenz und Stil sind ungeprüft, nichts heruntergeladen. Die Suchtreffer sind überwiegend Pixel-Art. Ein frei nutzbares, handgezeichnetes Paket im Absolum-Stil habe ich nicht belegen können.

Noch nichts gebaut. Branch fx/nahkampf-vfx-r1 liegt auf Stamm @a4e76512 (PISTOLE_TREFFER_K=3 drin), ohne eigenen Commit.

## Drei Spiel-Vorbilder (Standbilder selbst aus den offiziellen Trailern gezogen, je Clip in Spieltempo 30 fps und Viertel-Tempo)

**V1 · 2XKO, Vi (Riot, 2025): Gerade und Uppercut mit Faust-Handschuh.** Das genaueste Vorbild für unseren Fall (Riot = Video 1).
Quelle: youtube.com/watch?v=quGZjIkigu4, 9,3–10,8 s. Dateien: V1_2XKO_Vi_Folge.jpg, V1_*_spieltempo.mp4, V1_*_viertel.mp4.
- Hieb-Band: Sichel entlang des Faustbogens. Dunkelblauer, halb durchsichtiger Kern, außen eine gemalte, ausgefranste hellblau-weiße Kante. Das Band frisst vom Ende her aus. Sichtbar etwa 12 Bilder (9,99–10,38 s).
- Aufprall: 4–6 harte gelb-weiße Zacken und lange Speedlines in Schlagrichtung, keine runde Form. Gerade (9,40 s) etwa 4 Bilder, Uppercut etwa 6 Bilder.
- Staub: gemalte hellbraune Pinsel-Schlieren am Boden, bleiben länger als der Blitz.

**V2 · Hi-Fi Rush (Tango, 2023): Hieb und Comic-Treffer, Verfolgerkamera wie bei uns.**
Quelle: youtube.com/watch?v=goHUnImp-oc, 14,65–14,93 s. Dateien: V2_HiFiRush_Folge.jpg und die beiden Clips.
- Hieb-Band: kurze rot-gelbe Sichel, nur 2–3 Bilder.
- Aufprall: weißer Blitz und Comic-Ausbruch, etwa 5–6 Bilder. Die gezeichneten weißen Bogenstriche um den Ausbruch sind gebrochen, nicht geschlossen; die Mitte ist bunt.
- Liest sich aus Spielkamera-Abstand sofort.

**V3 · Astro Bot (Team Asobi, 2024): Spielzeugwelt, Sandboden, Aufprall mit Staub.**
Quelle: youtube.com/watch?v=unYFdcEjV9k, 43,1–43,75 s. Dateien: V3_AstroBot_Folge.jpg und die beiden Clips.
- Aufprall: weiß-heiße Zackenspitzen mit Funken, etwa 12 Bilder.
- Staub: weiche Staubbäusche, die am Treffpunkt aufsteigen und lange nachwirken (wie Sand bei uns).
- Kein echtes Hieb-Band (Ansturm statt Faust); Vorbild nur für Aufprall und Staub im 3D-Licht.

Gemeinsam bei allen drei:
- harte, kurze Spitze am Kontakt, 4–6 Bilder;
- das Band folgt der echten Bahn und ist gemalt, nicht glatt;
- Staub ist die langsamste Ebene;
- nirgends ein geschlossener Ring.

## Bestand (schon im Repo bzw. in Dropbox, kein Download nötig)
Brackeys-Paket, im Spiel schon für Pistole und Blaster genutzt: B1_Bestand_Teilchen.jpg, B2_Bestand_Flipbooks.jpg.
- Hieb: slash_01 und slash_03 sind weiche, verschwommene Sicheln ohne gemalte Kante. Neben V1 sehen sie nach Bastelei aus. Für das Band **nicht geeignet**.
- Aufprall: **impact_white_6x4** (weiße Zacken, 24 Bilder) und **big_hit_6x5** (gelber Funkenstern) kommen V1/V2 am nächsten. Kandidaten für den Kontaktmoment.
- star_04 und star_06: Lichtblitz-Stütze.
- Staub: dirt_01 und smoke_03 (Einzelbilder, kein Flipbook) als Stütze; für Staubbäusche wie V3 zu wenig.

## Freie Quellen, Downloads (nur mit Georgs Ja)
1. **Kenney Particle Pack**, kenney.nl/assets/particle-pack. Inhalt: 80 Bilder, 512 × 512, CC0, ohne Konto. Größe und Dateiname sind auf der Seite nicht angegeben; die Datei kommt nach „Continue without donating“. Gewinn: die fehlenden Varianten zu slash, star, dirt und smoke (bei uns liegen 46 der 80). Der Stil ist gleich weich, also nur Stütze.
2. **Unity Labs WispySmoke01-flipbooks.zip**, 4,6 MB (4 646 205 Bytes), CC0, TGA. Link: unity3d.com/files/labs/downloads/vfx/assets01/WispySmoke01/WispySmoke01-flipbooks.zip. Echter Rauch aus Houdini, **realistisch**, für Staubbäusche wie V3 umzufärben.
3. **Unity Labs DiscSmoke01-flipbooks.zip**, 8,5 MB (8 506 874 Bytes), CC0, Link wie 2. Flacher Bodenring-Staub, realistisch.
- Geprüft und verworfen: CGHEVEN (CC0, aber Energie- und Magie-Flipbooks, kein Aufprall-Stern und kein Hieb auf der Liste), Binbun Hit FX (nur Godot-Shader, Seite nicht lesbar), MaykerStudio Free Slash (Unity-Paket, Seite gesperrt), Superhive Slash Trails (kostet).

## Lücke und Vorschlag für Punkt 2
- Eine freie Hieb-Band-Textur in V1-Qualität habe ich nicht gefunden.
- Deshalb nach Video 1 und 3: Strähnen-Textur **malen**, kachelbar der Länge nach. Dunkler Kern, ausgefranste helle Außenkante, 3–4 Strähnen, Schwarz/Grau/Weiß für die Farbrampe; Vorlage ist V1 bei 10,05–10,25 s. Malen in Blender Texture Paint oder Krita, nicht im Code.
- Form: Bandnetz entlang der echten Handknochen-Spur von Gerade und Uppercut.
- Shader: nur Lauf, Farbrampe und Ausfressen von hinten.
- Kontakt: impact_white_6x4 oder big_hit_6x5 als Kandidat A/B, dazu Lichtblitz und Kamerastoß.
- Staub: nach Georgs Ja WispySmoke als Kandidat, sonst dirt/smoke aus dem Bestand.
