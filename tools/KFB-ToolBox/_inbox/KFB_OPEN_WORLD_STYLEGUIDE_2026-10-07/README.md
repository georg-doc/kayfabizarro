# KFB Open World · Style- & Nachbau-Referenz · 07.10.2026

25 Bilder, JPEG q74, max. 1280 px breit, zusammen ≈ 1,6 MB. Werte stammen aus dem Code, nicht aus dem Auge.
Reihenfolge zum Lesen: `00_referenzblatt` (Zahlen) → `01_welt` → `02_strecke` → `03_knete` → `04_hud`.

Hinweis: Die Spiel-Screenshots sind in der Claude-Vorschau (Software-Rendering) entstanden. fps-Werte darin nur relativ lesen.
Das Knet-Korn der HUD-Plaketten fehlt in den Referenzblättern (Export-Grenze); in den Spiel-Screenshots `04_hud` ist es sichtbar.

## 00_referenzblatt · die Zahlen
| Datei | Inhalt |
|---|---|
| 00-intro-prinzipien | 5 Regeln: Form, Material, Farbe, Licht, HUD |
| 01-farbpaletten | Strecken-Welten Canyon / Bikini-Bucht / O-Town, Hex-Inseln Burg / Utopia / Dystopia / Protopia, Rennstrecke, Natur, HUD-Töne (alle hex) |
| 02-knet-hud-bauteile | HUD 1:1 nachgebaut + Anatomie einer Plakette (Verläufe, Schatten, Radien, Korn) + Typo + Maße |
| 03-strecke-querschnitt | Profil aus `HALF`, Maße in Metern, 8 Bauregeln |
| 04-knet-material-profile | 10 Asset-Klassen mit Rolle, scale, print, gouge, crack, dent, soften |
| 05-licht-rechenbudget | Licht-Rig R2C + Budget je Bild (gemessen vs. Ziel) |

## 01_welt · Umgebung
| Datei | Worauf achten |
|---|---|
| 01-kosmos-uebersicht-4-inseln | Layout: Burg (Start/Ziel) mittig, A Utopia, B Dystopia, C Protopia, Looping B→C. Kleine Deko-Inseln + Wolkenkugeln drumherum |
| 02-insel-utopia-hex-stufen | Höhenstufe = ganze Kachelhöhe, Polster-Hügel an Stufenwänden, Fels-Unterbau weich, Plakatwand an der Strecke |
| 03-insel-dystopia-palette | Gleiche Bauteile, nur Palette getauscht (lila Gras, dunkler Fels) |
| 04-atlas-m01-tischwelt | Alternative Lesart: Karte liegt auf dem Tisch, Nahes klappt auf. Kosten-Panel als Vorbild für Messanzeige |
| 05-REFERENZ-floating-islands-fremd | Fremdes Promo-Bild, nur Stimmungsreferenz für schwebende Inseln. Nicht nachbauen |

## 02_strecke
| Datei | Worauf achten |
|---|---|
| 01-canyon-strang-kurve-tafeltuerme | Welt A: oranger Strang, schieferblaue Fahrbahn, violetter Tisch, orange Tafeltürme |
| 02-strang-steilkurve-bordwulst | Bordwulst rund, weiße Randlinie, Mittelstrich, Kugelbäume |
| 03-race-tube-portal-und-tunnel | Portal rot/weiß + Lichtleiste, innen Ringe rot/weiß im Wechsel mit gelben Rippen, Lichtpunkte |
| 04-stadtstrasse-haeuser-baeume | Stadt: Knet-Häuser (KayKit, weich), Stufen-Bäume, Hydranten, Strang als Brücke im Hintergrund |
| 05-stadtstrasse-unter-strang | Strang-Pfeiler als Kolonnade, Bänke, Laternen |
| 06-markierung-regelwerk-m2 | Regelwerk: Längen ×2, Strichbreiten ×2,5, Fahrstreifen 7,2 m |
| 07-markierung-einmuendung | Beispiel Einmündung mit Wartelinie, Bordstein-Radien |
| 08-parcours-p1-plan-abschnitte | Abschnitts-Namen des Parcours (Farbe = Abschnittstyp, rot = Luftstück) |

## 03_knete
| Datei | Worauf achten |
|---|---|
| 01-golden-k1-totale | Golden-Bild K1 (gesperrt): weich, matt, Wolken als Knetkugeln |
| 02-golden-k1-nah-fingerabdruecke | Nahsicht: Fingerabdruck-Rillen, Druckstellen, keine scharfen Kanten |
| 03-gate-facade-source-golden-kandidat | Gleiches Haus 3×: Quelle / Golden / Kandidat v10 + Kosten je Spalte |

## 04_hud
| Datei | Worauf achten |
|---|---|
| 01-hud-fahrt-standard | Volle Anordnung im Spiel, Knet-Korn sichtbar |
| 02-hud-einstellungen-panel | Panel: Bangers-Titel, Tasten in Pfirsich-Mono, dunkle Mulde |
| 03-hud-aktionshinweis-aussteigen | Aktionshinweis unten Mitte („LEER · AUSSTEIGEN“) |

## Kernwerte zum Abtippen

**Strecke** (hex-archipel.r2c.js): Fahrbahn 9,90 m (±4,95) · Randlinie 4,0–4,5 m von Mitte · Mittelstrich 0,44 m breit, 3 m lang · Bordwulst Brücke 1,14 m / Straße 0,52 m · Unterbau bis −1,5 m · Rot/Weiß 4,5 m je Bordkante, nur ganze Streifen · Mindestradius 22 m · Ein/Ausfahrt je Insel 120° auseinander.
Farben: Asphalt `#4f5d78` · Linie `#efe8da` · Rail rot `#e2522a` · Rail weiß `#e8dfcf` · Unterbau `#c9441f` / `#8c7a66`.

**Licht**: Sonne `#fff4e6` 2,9, Höhe 46°, Azimut 128° · Hemi `#eef4fa`/`#9a8a78` 1,05 · Gegenlicht `#ffe6d6` 0,6 · Bounce `#f3dcc4` 1,1 · Himmel flach `#96bede` · Fog 1700–5600 · Schatten folgt Kamera, auf Texelraster gerastet (shadow-fit.v1).

**HUD**: Plakette `linear-gradient(180deg,#C6B8E4 0%,#A895D2 60%,#7C69AE 100%)`, padding 7 px · Mulde `linear-gradient(180deg,#221A33,#3D3359)`, `inset 0 3px 7px rgba(10,6,20,.78)` · Tiefe `inset 0 2px 2px rgba(255,255,255,.34), inset 0 -3px 6px rgba(40,25,70,.28), 0 4px 0 #4A3D6B, 0 10px 18px rgba(14,9,24,.36)` · Akzent `#FFA97A` (hi `#FFC3A2`, lo `#B87B60`, ink `#3A2416`) · Radien unregelmäßig (8 Werte), Neigung −2°…+2° · Korn: SVG feTurbulence fractalNoise .8, 3 Oktaven, 140 px · Fonts: Bangers (Zahlen/Titel), Nunito Sans (Text), Monospace 10 px (Labels).

**Performance-Leitplanken**: Draw-Calls ≤ 150 · Dreiecke im Bild ≤ 400k · 1 Material je Asset-Klasse · Farbe als Vertex-Farbe gebacken · Instanzen für Bäume/Felsen · Schattenkarte 2048² (4096² nur Desktop) · Pixelratio ≤ 1,5 · Knet-Shader ist der teuerste Posten. Werte mit „Ziel“ sind Vorgaben, keine Messungen.

Quelle im Projekt: `KFB Open World · Style Reference.dc.html` (lebendes Referenzblatt).
