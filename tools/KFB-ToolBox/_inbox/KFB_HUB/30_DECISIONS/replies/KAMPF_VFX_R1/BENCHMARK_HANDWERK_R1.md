# BENCHMARK_HANDWERK_R1 – Schuss, Treffer, Explosion, Dauerfeuer (Bild + Ton)

Stand 05.11.2026 · nur Web-Recherche · Ziel: Handwerk lernen, nichts kopieren.
Kennzeichnung: **[Q n]** = belegt (Quelle n unten) · **[I]** = eigene Ableitung. Frames bei 60 fps, falls nicht anders gesagt.

**Quellenlage ehrlich:** Overwatch-artige Explosionen, Riot/LoL, Smash/Guilty Gear (Timing), DICE/Wwise (Mix) und Waffen-Ton-Handwerk sind gut dokumentiert. Zu Ratchet & Clank Rift Apart, Splatoon, Fortnite und Hi-Fi Rush gibt es öffentlich kaum Frame- oder Layer-Angaben. Diese Spiele bleiben Blick-Referenz, liefern hier aber keine Zahlen.

## Querschnitt-Regeln (gelten für alle 5 Ereignisse)

- **Drei Phasen: Ankündigung → Treffer → Auflösung.** Der Höhepunkt sitzt im **ersten Viertel** der Lebenszeit, nie lineare Kurven [Q1].
- **Primär vor Sekundär:** Das Gameplay-Signal bekommt den hellsten Wert, eine harte Silhouette und volle Deckkraft. Rauch und Funken bleiben dunkler, weicher und leiser. Nicht zu viele Alpha-Flächen stapeln. Kein reines Schwarz oder Weiß, die Wertspitze nur im Trefferblitz [Q1]. Dunkles nach hinten, Helles nach vorn, Kontrolle per Graustufen-Screenshot [Q2].
- **Größe folgt Wichtigkeit:** Je stärker die Wirkung, desto größer, heller und spitzer die Formen [Q3]. Riot sagt dazu: „if everything is important, nothing is important“ [Q3].
- **Stilisierung = handgezeichnete Formen und harte Kanten.** Abgestufte statt weicher Alpha-Blende wirkt cartoonhafter [Q4]. Verschmierte Zwischenbilder (Smears) ersetzen Motion Blur und stehen nur kurz, laut Faustregel 2–4 Frames [Q5]. „Limited animation“ mit wenigen gewählten Posen statt vieler Frames liest sich 2D [Q6]. Hi-Fi Rush animiert Cutscenes auf 2s (≤30 fps) [Q7].
- **Hitstop/Freeze:** Ein kurzer Bildstopp beim Treffer gibt Wucht. In Smash dauert das je nach Schaden 8–15 Frames [Q8, Q9].
- **Kamerawackeln:** Treffer laden einen „Trauma“-Wert auf, der linear abklingt. Das sichtbare Wackeln = Trauma² bzw. ³ über Perlin-Noise [Q10]. Kleine Treffer bleiben dadurch fast still, große knallen.
- **Ton-Grundaufbau (Waffe):** Transient/Crack, Body, Sub/Thump, Mechanik, Tail. Der Tail läuft getrennt, damit das Spiel ihn je nach Ort setzt [Q11, Q12, Q13]. Pro Layer gibt es mehrere Varianten, im Beispiel 4 Body, 3 Mechanik, 4 Tail und 2 Detail, dazu zufällige Tonhöhe und Lautstärke. Die Layer setzen um wenige Millisekunden versetzt ein, damit die Transienten keine Spitze stapeln [Q11]. Sub nur für die Spielerwaffe [Q11]. Die eigene Waffe ist das Wichtigste im Mix (Destiny) [Q14], und Ton allein lässt eine Waffe stärker wirken [Q15].

## (1) Mündungsfeuer – Pistole, Blaster, Gatling-Einzelschuss

| Layer (zeitlich) | Dauer / Größe | Beleg |
|---|---|---|
| Spitzes Blitz-Sprite (Stern, harte Zacken) | 1–2 Frames | [Q16] |
| Kern-Flash + kleiner Flipbook-Kegel | gesamt 0,1–0,2 s, kein Loop | [Q17] |
| Dynamisches Licht | ~0,1 s (GoldSrc-Muzzle-Licht; Angabe aus zweiter Hand) | [Q18] |
| Rückstoß-Kick, Rauchfaden, Hülse | Kick 2–4 Frames, Rauch 0,3–0,6 s, dunkler und weich | [I] |
| Größe | Pistole ≈ 10–15 % der Figurenhöhe, Blaster ≈ 15–25 %, Gatling ≈ 20–30 % pro Schuss | [I] |

- Cartoon heißt hier: 2–3 handgezeichnete Formvarianten zufällig wählen und drehen, statt eine weiche Fackel abzuspielen [I, gestützt auf Q1/Q4].
- **Ton:** Transient/Crack (hohe Frequenzen, „Snap“), kurzer Body, kurzer Sub mit enger Hüllkurve und Mechanik-Klick [Q11, Q12]. Sci-Fi: Der Kern ist ein Synth mit schneller Tonhöhen- und Filterbewegung, dazu ein echtes Mechanik-Layer, damit sich die Waffe nach Hand anfühlt [Q12]. Krotos nutzt dafür die Stufen Onset → Body → Thump → Tail [Q19].
- **Diagnose „Puff zu schwach“ [I]:** Wahrscheinlich fehlt der harte Onset. Ein Rauschen mit weichem Attack plus Hall liest sich als „Puff“. Abhilfe: Transient im ersten Frame, Mechanik-Klick und einen kurzen Sub von 50–100 ms ergänzen, den Hall kürzen. Für DIY-Waffen eignet sich das Borderlands-Prinzip: Ton pro Waffenteil, also Lauf, Mechanik und Magazin als eigene Layer [Q20].

## (2) Projektil-/Blaster-Treffer

| Layer | Dauer / Größe | Beleg |
|---|---|---|
| Hitstop am Ziel | 2–6 Frames für Kleinwaffen (Smash 8–15 Frames für schwere Treffer) | [Q8] [I] |
| Trefferblitz (Stern/Sprite, höchster Wert) | 1–2 Frames | [Q1] [I] |
| Funken/Splitter (gerichtet, Gegenrichtung zum Einschlag) | 4–10 Frames, Lebenszeit streuen | [Q4] |
| Staub-/Rauchpuff, dann Decal | 0,3–0,5 s; Decal bleibt | [I] |
| Größe | ≈ 15–30 % der Figurenhöhe | [I] |

- **Ton:** Impact-Transient, Material-Layer (Metall, Holz, Erde), kurzer Tail. Der Treffer muss sich vom Schuss klar unterscheiden [I]. Overwatch-Prinzip „play by sound“: Ein Treffer ist sofort hörbar als Information, und eine Priorisierung hebt bedrohliche Quellen hervor [Q21].

## (3) Kleine Explosion (Granate, Fass)

Phasenmodell aus dem Overwatch-inspirierten RTVFX-Thread [Q22]; Gesamtdauer ~0,5 s [Q4]:

| Zeit | Layer | Beleg |
|---|---|---|
| F0–1 (max. 2) | Anfangsblitz markiert den Einschlagpunkt | [Q22] |
| F1–5 | Volle Größe: Druckring zeigt den Radius, Funken auf voller Größe, Ring verblasst mit ihnen | [Q22] |
| F2–3 versetzt | Feuerkern wächst weiter und schrumpft nie zurück | [Q22] [Q4] |
| ab F2 bis Ende | Rauch und Trümmer bleiben am längsten, ziehen aber keinen Blick | [Q4] [Q22] |
| parallel | Licht-Puls (~0,1–0,2 s), Kamera-Trauma 0,3–0,5 | [Q10] [I] |

- Die Startzeiten der 18 Layer lagen nur 2–3 Frames auseinander, entscheidend war das Feintuning [Q4]. Feedback dort: abgestuftes Alpha, schnellerer Ring, „schnell rein, langsam raus“ [Q4].
- Größe: TF2-Rakete hat 146 HU ≈ 2,8 m Radius [Q23]. Das entspricht etwa dem 1,5–2-fachen Figurenradius bzw. einem Durchmesser von 3 Figurenhöhen [I].
- **Ton:** Crack/Transient (die hohen Anteile lassen sofort reagieren), Body, kurzer Sub-Thump, dann Trümmer-Tail [Q24]. Trümmer erst nach dem Hauptknall auslösen, mit zufälliger Verzögerung [Q25].

## (4) Große Explosion (Tank, Gebäude, Finale)

| Zeit | Layer | Beleg |
|---|---|---|
| −0,2…0 s | Ankündigung (Aufglühen, Implosion); Ton: Pegel kurz absenken = „Vakuum“ | [Q1] [Q26] |
| F0–2 | Vollbild-Blitz / Impact-Frame (s/w-Inversion, je 1 Frame) | [Q27] |
| F2–8 | Feuerball mit harter Silhouette, Druckring + Verzerrung | [Q22] [Q4] |
| 0,2–2 s+ | Rauchpilz, Trümmer im Bogen, Staubring am Boden | [I] |
| parallel | Hitstop 3–8 Frames, Kamera-Trauma 0,8–1,0, Licht-Puls ~0,3 s | [Q8] [Q10] [I] |
| Größe | 2–6 Figurenhöhen, aber eng an den Spielraum am Boden gebunden | [Q1] [I] |

- **Ton – Gewicht:** Bei echten Explosionen liegt der Attack ~40 dB über dem Tail bei 500 ms. Die Wucht steckt in den ersten paar hundert Millisekunden, Transient-Shaper betonen sie [Q28]. HDR-Mix: Ein lauter Ereignis-Ton duckt alles Leisere [Q29, Q30]. Eine vorgezogene Hüllkurve erzeugt eine kurze Stille direkt vor dem Knall [Q26]. Der Sub muss von genau einem Layer kommen, dazu ein Test auf kleinen Lautsprechern [Q31].
- **Diagnose „klingt wie vorbeifliegendes Sci-Fi-Triebwerk“ [I, gestützt auf Q28/Q12/Q32]:** Das Rezept ist zu viel gleichmäßiges, langes Rauschen ohne Transient und ohne kurzen Tiefbass-Schlag, oft mit Tonhöhen- oder Filterverlauf (Doppler-Gefühl). Abhilfe: Onset im ersten Frame, ein Sub-Thump von 150–300 ms mit Pitch-Drop, das Rauschen-Bett per Hüllkurve schnell fallen lassen, Trümmer als einzelne Ereignisse statt als Teppich, kein Sweep.

## (5) Dauerfeuer – klapprige Gatling

| Teil | Regel | Beleg |
|---|---|---|
| Anlauf (Spin-up) | Eigenes Rotor-Geräusch vor dem ersten Schuss; TF2: 0,87 s | [Q33] |
| Schuss-Layer | Kurz und straff; was nachklingt, wird bei hoher Kadenz „Matsch“ | [Q12] |
| Sub | Kurze Hüllkurve, sonst verschmiert Schuss in Schuss | [Q12] |
| Variation | Samples rotieren statt wiederholen; Tonhöhe/Pegel zufällig | [Q19] [Q11] |
| Tail | Eigenes Ereignis erst nach Feuerende | [Q34] |
| Auslauf | Spin-down + Tail beim Loslassen | [Q33] [Q34] |
| Bild | Pro Schuss ein Blitz aus 3–4 rotierenden Formen, Licht flackert mit; Hülsen-Strom; Hitze-Glühen am Lauf nach ~1 s; Kamera kleines Dauer-Trauma | [I] |

- Monotonie vermeiden [I]: einen Body-Pool von ≥4 Varianten round-robin abspielen. Mechanik-Rattern und Rotor als eigener Loop, Schüsse einzeln darüber. Den Sub nur auf jeden 2.–3. Schuss oder als Burst-Akzent setzen. Leichte Kadenz-Schwankung als Charakter der klapprigen Mechanik.

## Quellen
1. VFX Apprentice: 10 Design Tips from the LoL VFX Style Guide – https://www.vfxapprentice.com/blog/10-league-of-legends-vfx-design-tips (Original: https://nexus.leagueoflegends.com/en-us/2017/10/dev-leagues-vfx-style-guide/)
2. 80.lv, Luis Aguas (Blizzard), WoW VFX – https://80.lv/articles/world-of-warcraft-vfx-overview-from-luis-aguas/
3. Riot Beardilocks, Anatomy of a LoL Missile Pt. 2 – https://realtimevfx.com/t/anatomy-of-a-league-of-legends-missile-part-2-what-are-we-communicating-with-our-vfx/13062
4. RTVFX, Stylized Frag Launcher Explosion (Overwatch-Inspiration) – https://realtimevfx.com/t/stylized-frag-launcher-explosion-overwatch-inspiration/1894
5. Kotaku zu David Gibson (Blizzard) Smear Frames – https://kotaku.com/this-is-not-an-overwatch-glitch-1777612546 ; 2–4-Frames-Faustregel: https://polycount.com/discussion/comment/2646544/
6. GDC 2015, Motomura: GuiltyGearXrd's Art Style – https://gdcvault.com/play/1022031/GuiltyGearXrd-s-Art-Style-The
7. Gameranx zu Hi-Fi Rush Technik – https://gameranx.com/updates/id/436553/article/hi-fi-rush-is-a-huge-technical-achievement-heres-how-tango-gameworks-pulled-it-off/
8. SSBWiki Hitlag – https://www.ssbwiki.com/Hitlag
9. Sakurai Famitsu-Kolumne zu Hitstop (Übersetzung) – https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/
10. GDC 2016, Eiserloh: Juicing Your Cameras With Math – https://gdcvault.com/play/1023146/Math-for-Game-Programmers-Juicing
11. Splice, Ronny Mraz: How to design a weapon sound – https://splice.com/blog/design-weapon-sound-video-games/
12. Violet Recording: How to Design Weapon Sounds – https://violetrecording.com/how-to-design-weapon-sounds/
13. Designing Sound, Chuck Russom: Gun Sound Design – https://designingsound.org/2010/04/chuck-russom-special-gun-sound-design/
14. Digital Trends, Destiny Audio (Jay Weinland) – https://digitaltrends.com/gaming/destiny-behind-the-scenes-sound
15. Game Informer, Destiny-Waffenbalance – https://gameinformer.com/b/features/archive/2015/08/14/why-gjallarhorn-is-overpowered-and-the-tricks-to-balancing-destinys-weapons
16. RTVFX, Feedback on Explosion VFX (Spitzer Muzzle-Sprite 1–2 Frames) – https://realtimevfx.com/t/looking-for-feedback-on-explosion-vfx/29528
17. CGHEVEN, Muzzle Flash VFX in Unity – https://cgheven.com/blog/how-to-use-muzzle-flash-vfx-in-unity-2025
18. TWHL, Client-side dynamic lights (Seite gesperrt, Angabe aus Suchauszug) – https://twhl.info/wiki/page/Tutorial:_Client_sided_dynamic_lights_(muzzle_flash,_flashlight...)
19. Krotos Weaponiser (Onset/Body/Thump/Tail, Sample-Rotation) – https://www.krotosaudio.com/Weaponiser/
20. Kotaku, Borderlands 3: 5000+ Waffensounds pro Teil – https://kotaku.com/a-lot-of-work-went-into-creating-over-5000-gun-sounds-f-1839143014
21. GDC 2016, Lawlor/Neumann: Overwatch – Play by Sound – https://gdcvault.com/play/1023010/Overwatch-The-Elusive-Goal-Play ; PC Gamer: https://pcgamer.com/how-overwatch-uses-sound-to-pinpoint-threats-you-cant-see
22. RTVFX, Stylized Cartoon Explosion – Overwatch Inspired (Phasenmodell Sirhaian) – https://realtimevfx.com/t/stylized-cartoon-explosion-overwatch-inspired/1767
23. TF2 Wiki Rocket Launcher – https://wiki.teamfortress.com/wiki/Rocket_Launcher
24. Pixflow, Explosion Sound Effects Guide (Hersteller-Blog, schwach) – https://pixflow.net/blog/explosion-sound-effects-a-complete-guide
25. GameDev.net, FMOD Designer Explosion – https://cone3d.gamedev.net/tutorials/audio/music-and-sound-fx/using-fmod-designer-to-create-explosion-sound-e-r2752
26. Designing Sound, Buffoni (Audiokinetic): HDR Audio in Wwise – https://designingsound.org/2013/06/21/finding-your-way-with-high-dynamic-range-audio-in-wwise/
27. 80.lv, Anime-Impact-Frames in UE5 – https://80.lv/articles/my-hero-academia-style-attack-vfx-in-unreal-engine-5 ; RTVFX: https://realtimevfx.com/t/impact-frames-in-ue5/24982
28. Designing Sound, Frank Bry: Transient Enhancement with Explosions – https://designingsound.org/2013/01/21/transient-enhancement-with-explosions/
29. EA Frostbite: How HDR Audio makes Battlefield Bad Company go boom – https://www.ea.com/frostbite/news/how-hdr-audio-makes-battlefield-bad-company-go-boom
30. DICE GDC-Folien Adaptive Mixing in Frostbite – https://www.slideshare.net/slideshow/adaptive-mixing-in-frostbite/3128152
31. Sonilo, Explosion SFX Guide (Hersteller, schwach) – https://sonilo.com/ai-music/explosion-sound-effect-guide
32. IRPR, Explosion sounds weak (Hersteller, schwach) – https://sounddesign.irpr.agency/solutions/explosion-sounds-weak/
33. TF2 Wiki Minigun/Tomislav – https://wiki.teamfortress.com/wiki/Tomislav
34. CRYENGINE Docs, Weapons and Sound – https://cryengine.com/docs/static/engines/cryengine-3/categories/1114113/pages/13205649
