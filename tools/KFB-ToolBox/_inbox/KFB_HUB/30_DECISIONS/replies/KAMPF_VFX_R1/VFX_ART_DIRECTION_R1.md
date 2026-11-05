# Waffen-, Treffer- und Explosions-VFX und -Ton · Art Direction R2 · WSV → WS0 · 05.11.2026 (V-1508)

Georgs Vorgaben:
- Action- und Sci-Fi-Spiele sind Benchmark und Vorlage.
- Keine Claude-Eigenbau-VFX außer als Stütz-Ebene.
- Alte, klapprige DIY-Waffen mit viel Bass, Wumms, Rückstoß und Stakkato (q370).
- Bisherige Fehler: Das Mündungsfeuer war flach und das „Puff“ kaum hörbar (q374). Die große Explosion klang wie ein vorbeifliegendes Triebwerk.

Unterlagen (alle Angaben mit Quellen):
- `BENCHMARK_HANDWERK_R1.md`: Handwerk je Ereignis, 34 Quellen
- `QUELLEN_SHORTLIST_R1.md`: Flipbook- und Tonquellen mit Vorschaubildern, Preisen und Lizenzen

Es wurde nichts heruntergeladen oder gekauft.

## 1 · Benchmark-Blatt (Kurzform; Zahlen bei 60 fps, „≈“ = eigene Ableitung)
Die drei Regeln, die alles tragen:
- **Spitze früh:** Der hellste, schärfste Moment sitzt im ersten Viertel der Lebenszeit, dann folgt ein langsames Ausklingen. Nie linear (Riot, LoL VFX Style Guide).
- **Primär vor sekundär:** Nur der Blitz bzw. Kern trägt den höchsten Wert und die harte Silhouette. Rauch, Funken und Trümmer bleiben dunkler und weicher.
- **Stilisiert heißt wenige harte Bilder:** gestufte Deckkraft statt weichem Ausblenden, Smears 2–4 Bilder, Formvarianten statt einer weichen Fackel (Blizzard, Guilty Gear).

| Ereignis | Bild-Schichten in zeitlicher Reihenfolge | Größe zur Figur | Dauer | Ton-Schichten |
|---|---|---|---|---|
| Mündungsfeuer Pistole/Blaster | Zackenstern 1–2 Bilder → Kegel/Kern-Flipbook → Licht-Puls ~0,1 s → Rückstoß-Kick 2–4 Bilder → Rauchfaden, Hülse | ≈ 10–15 % (Pistole), 15–25 % (Blaster) | 0,1–0,2 s, Rauch 0,3–0,6 s | harter Crack im 1. Bild · kurzer Body · Sub 50–100 ms · Mechanik-Klick · kurzer, getrennter Tail |
| Treffer | Hitstop 2–6 Bilder → Trefferblitz 1–2 → gerichtete Funken/Splitter 4–10 → Staubpuff → Decal bleibt | ≈ 15–30 % | 0,3–0,5 s | Impact-Transient · Material (Metall, Holz, Knete) · kurzer Tail; klar anders als der Schuss |
| Kleine Explosion | Blitz 1–2 Bilder → bis Bild 4–5 Druckring und Funken voll → Feuerkern wächst weiter (schrumpft nie) → Rauch und Trümmer am längsten; Licht 0,1–0,2 s, Kamera-Trauma 0,3–0,5 | Durchmesser ≈ 3 Figurenhöhen (TF2-Rakete 2,8 m Radius) | ~0,5 s, Rauch länger | Crack · Body · kurzer Sub-Thump · Trümmer-Tail mit zufälliger Verzögerung |
| Große Explosion | Ankündigung −0,2 s (Aufglühen, Ton-„Vakuum“) → Impact-Frame 1–2 Bilder → Feuerball mit harter Silhouette, Druckring → Rauchpilz, Trümmerbögen, Staubring; Hitstop 3–8, Trauma 0,8–1,0 | 2–6 Figurenhöhen | 2 s+ | Attack ~40 dB über dem Tail · Sub 150–300 ms mit Pitch-Drop · Rauschbett fällt schnell · Trümmer · HDR-Ducking des Rests |
| Leuchtspur (Pistole, Gatling) | gestreckte Linie bzw. Kapsel entlang der Flugbahn, 2–4 Bilder sichtbar, kamera-zugewandt um die Flugachse; jede 2.–4. Kugel | Länge ≈ 1–2 Figurenhöhen | 2–4 Bilder | keiner (Treffer trägt den Ton) |
| Dauerfeuer Gatling | Anlauf → pro Schuss Blitz aus 3–4 rotierenden Formen, Licht flackert mit → Hülsenstrom → Laufglühen nach ~1 s → Auslauf; kleines Dauer-Trauma | ≈ 20–30 % pro Schuss | Spin-up ~0,9 s (TF2) | Rotor-/Rassel-Loop · Schüsse einzeln darüber, Body-Pool ≥ 4 im Wechsel · Sub nur jeder 2.–3. Schuss · Tail erst nach Feuerende · Spin-down |

**Diagnose der Fehler** (abgeleitet, Ton gestützt auf Designing Sound und Violet Recording):
- **Mündungsfeuer dunkel und flach (Bild):** Wahrscheinliche Ursachen sind:
  - Das Material nimmt Licht, Nebel und Tonemapping an; ACES drückt helle Flächen.
  - Es wird normal überblendet statt premultiplied bzw. additiv.
  - Es gibt keine einzelne Form, die von der Third-Person-Kamera (hinter bzw. neben der Figur) lesbar ist.
  - Fix: unbeleuchtet, `fog: false`, eigener Tonwert-Weg für VFX bzw. Werte über 1 in den Bloom; Kreuz-Ebenen entlang des Laufs plus Stern zur Kamera (§4).
- **„Puff“ zu schwach:** Es fehlt der harte Anschlag; ein weiches Rauschen plus Hall liest sich als Puff. Fix: Transient im ersten Bild, Mechanik-Klick, kurzer Sub, weniger Hall.
- **Explosion wie Triebwerk:** gleichmäßiges, langes Rauschen ohne Transient und ohne Tiefbass-Schlag, dazu ein Filter- oder Tonhöhenverlauf. Fix: Anschlag zuerst, Sub-Thump mit Pitch-Drop, Rauschen schnell abfallen lassen, Trümmer als eigene Schicht.

## 2 · Fertige Profi-Effekte (Empfehlung aus der Shortlist, nach Sichtung der Vorschaubilder)
**Wichtiger Befund:** Stilisierte Profi-Explosionen (Overwatch-Look) sind meist keine abgespielten Flipbook-Filme. Sie bestehen aus wenigen Mesh-Schalen bzw. Sternformen mit **Erosions-Shader** (eine Rausch- bzw. Dichte-Textur, die per Schwellwert harte Kanten abfrisst) und **Farbrampe**, dazu wenigen Flipbooks für Rauch und Funken. Für Overwatch selbst ist das nicht öffentlich belegt; die Technik zeigen Breakdowns wie [Adrift Arena: Creating Stylised Explosions](https://quirkbit.itch.io/adrift-arena/devlog/122433/creating-stylised-explosions) und [Godot-Explosion-Breakdown](https://d34kmbgkaszffl.cloudfront.net/blog/breaking-down-a-stylized-explosion-vfx-made-in-godot), und das Vefects-Vorschaubild sieht genau so aus. Für uns heißt das: Gekauft werden Texturen und gegebenenfalls Meshes. Der kleine Abspiel-Shader (Erosion und Farbrampe) muss für three.js nachgebaut werden. Das ist Code von uns, aber eine Stütz-Ebene ohne eigene Formen (Frage 2 in §5).

| Rang | Wofür | Quelle | Format | Preis | Urteil |
|---|---|---|---|---|---|
| 1 | Mündungsfeuer, Mündungsrauch, Einschläge, Splitter, Staub, Explosionssterne | **Vefects Flipbook VFX** (itch.io, Unity-Paket, Texturen herauslösbar) | Texturen 2048 | $19.45 | stilisiert, harte Formen, Erosionskanten, im Vorschaubild AAA-nah; **Lizenz vor dem Kauf klären** |
| 2 | Rauch, Feuer, Dichte für die Erosion | **luezpz Explosion Flipbooks Vol. 1** | 8×8, Normal RG, Feuer B, Dichte A; Auflösung je Bild vor Kauf belegen (Vorschau 1024 px ≈ 128 px/Bild) | $4.99 | **nur als Datenquelle**: Dichtekanal per Schwellwert-Erosion abspielen (gestufte harte Kante, kein Alpha-Fade, sonst gegen V-499), Normal-Map nur fürs eine Licht-Rig; fotoreale Form, Stilbruch-Risiko |
| 3 | Funken, Staub, Splats | **Kenney Particle, Smoke, Splat** (CC0) | PNG | gratis | Stütze ohne Rechtsrisiko |
| 4 | Gegenprobe | **Ember Lite** (inkharbor, gratis) | 256 px | gratis | **nicht kaufen**: laut Seite mit generativer KI gemacht, weicher Bloom-Mobile-Look, das „Side Muzzle Flash“ ist genau das durchgefallene flache Feuer; nur als Vergleich, wie es nicht aussehen soll |
| – | Cartoon-Feuerball groß | DucVu Ultimate 2D FX | 2D-Frontalbilder | $60 | für eine 3D-Kamera nur bedingt geeignet (frontal gezeichnet), daher nicht empfohlen |

Noch offen: Fab-Pakete mit Mesh und Textur. Deren Standardlizenz ist engine-unabhängig, ich prüfe sie vor der Hub-Frage, wenn gewünscht. Die Vorschaubilder je Quelle stehen in `QUELLEN_SHORTLIST_R1.md`, A1 bis A5.

**Weitergabe im Web:** Jede PNG liegt im Browser offen. Für alle Pakete gilt deshalb: nur umgepackte, komprimierte Atlanten (KTX2) ausliefern, nie die Originaldateien. Vor jedem Kauf prüfen, ob die Lizenz Web-Spiele erlaubt. Für Texturen aus dem Unity Asset Store ist das ausdrücklich verboten.

## 3 · Ton: aufgenommene Profi-Bibliotheken
| Wofür | Bibliothek | Preis | Warum |
|---|---|---|---|
| Pistole, Blaster, Bass-Punch | **Epic Stock Media Game Weapons** | $76.80 (Sale) | Pipe Gun, Wobbly Gun, Blaster und 55 Bass-Hits, also der fehlende Wumms schon für Stufe 1 |
| DIY-Mechanik | **Bluezone Steampunk Weapon & Textures** | $17.80 | rotierende Läufe, Hülsen; **vorher anhören**: Dampfzischen ist noch nicht „klapprig DIY“ |
| Rassel- und Klick-Schicht | **BOOM Toy Guns** | €59 | Klappern, Drehen, Klicken über echten Schüssen |
| Stakkato-Salven, Booms zum Testen | **BOOM ZU-23-2, BOOM Processed Impacts, BOOM Cinematic, Sonniss GDC Bundles** | gratis | sofort testbar; BOOM-Gratis laut Seite nur für gewerbliche Kunden, Sonniss lizenzfrei ohne Nennung |
| Explosionen, Kern | **BOOM Urban Explosions** | €119–229 | professionellster Kern, Stufe 2 |
| Schrott-Schicht | **Russ Harris Trash, Clatter and Clunk** | £12 | Klappern und Scheppern |

Lizenzfallen: ZapSplat gratis nur mit Namensnennung; Sonniss und ZapSplat verbieten KI-Training.

## 4 · Look-Vorschlag: Profi-Effekte in der Knete-Welt
**Ein Satz:** Formen kommen aus gekauften Texturen und Meshes und laufen über einen Erosions- und Farbrampen-Shader. Die Knete-Welt kommt durchs Graden. Claude baut nur Abspiel-Shader, Licht-Puls, Kamera-Stoß, Hitstop und Decal.

1. **Farbe und Kante:**
   - Blitz, Kern und Schockstern laufen unbeleuchtet über eine Farbrampe (KFB-Feuerpalette) und erodieren mit harter, gestufter Kante.
   - Nur der Blitz darf über 1 in den Bloom gehen; Rauch und Funken bleiben darunter.
   - Kein Ausbrennen auf Weiß, kein eingebackener Glow.
   - Rauch nimmt das eine Licht-Rig über die Normal-Map (V-385). Er vergeht durch Erosion nach den V-499-Regeln, nicht durch Ausblenden.
2. **Ausrichtung im Raum** (Third-Person-Kamera hinter bzw. neben der Figur):
   - Mündungsfeuer: Kreuz aus zwei Ebenen entlang des Laufs plus ein Stern zur Kamera, damit es von hinten und von der Seite liest.
   - Schockring: flach auf dem Boden.
   - Feuerball und Rauch: kamera-zugewandt über das gemeinsame Modul (q495).
   - Funken: nach ihrer Geschwindigkeit gestreckt.
   - Leuchtspur: entlang der Flugachse.
3. **Weiche Kanten am Boden:** Rauch und Feuerball werden gegen die Tiefe des Geländes ausgeblendet (Soft Particles), sonst entstehen harte Schnittkanten im Boden, der Billig-Look Nummer eins. Dafür braucht der Render eine Tiefentextur; Flug prüft, ob es sie gibt.
4. **Budget:**
   - Große Explosion höchstens 3–4 große Ebenen plus Funken; Partikelbudget je Ereignis fest.
   - Atlanten als KTX2/Basis (ein 2048×4096-RGBA-Blatt kostet sonst ~32 MB Grafikspeicher).
   - Gemessen wird mit einem Readback-Gate, nicht mit normalen Timern.
5. **Gestuft abspielen:**
   - Blitze auf Zweiern bzw. mit gehaltenen Bildern, Rauch weich.
   - Je Ereignis 2–4 Varianten, zufällig gedreht, nie zweimal dieselbe hintereinander.
6. **Stütz-Ebenen von uns:**
   - Licht-Puls je Schuss bzw. Explosion (V-1126-Ausnahme, nur für den Spieler);
   - Kamera-Trauma mit Perlin-Rauschen (Eiserloh);
   - Hitstop 2–8 Bilder;
   - Decal bzw. Brandspur (Treffer-Grammatik V-1011);
   - Rückstoß an Waffe und Figur.

   Keine eigenen Feuer-, Rauch- oder Funkenformen.
7. **Ton-Mix:**
   - **Schichten:** Je Waffe Transient, Body, Sub, Mechanik und Tail aus Pools. Den Sub bekommt nur die Waffe des Spielers.
   - **Gatling:** Rotor-Loop, Einzelschüsse darüber, Tail erst nach dem Loslassen. Die Schüsse werden auf `AudioContext.currentTime` geplant, nicht per Timer, sonst eiert das Stakkato. Dazu ein Stimmenlimit mit Voice-Stealing.
   - **Große Explosion:** kurzes „Vakuum“ davor, Ducking danach.
   - **Gesamt:** Master-Limiter und ein festes Lautheitsziel.
   - **Offene Welt:** Nah- und Fern-Variante, Outdoor-Slap statt Hallraum.
   - **Lautsprecher-Check:** Der Punch muss auch auf MacBook-Lautsprechern hörbar sein, also bei 80–200 Hz mit Sättigung, nicht nur als Sub bei 50 Hz.
8. **Abnahme je Stufe:**
   - Pistole/Blaster → Explosion → Gatling, im Spiel als Video mit Ton aus Front- bzw. Seitenkamera, dazu einmal in der Spielkamera.
   - Kriterien: Lesbarkeit von hinten, keine Bodenschnitte, Budget eingehalten, Punch auf Laptop-Lautsprechern hörbar.

## 5 · Was Georg entscheiden muss (Hub)
1. **Look-Richtung:** stilisierte Profi-Formen mit Erosion und Farbrampe (Vefects-Vorschaubild als Beispiel), Rauch beleuchtet und erodierend. Ja oder nein?
2. **Erlaubnis für den Abspiel-Shader:** Gekaufte Texturen bzw. Meshes, Claude portiert nur den Abspiel-Shader (Erosion, Farbrampe, weiche Bodenkante) als Stütz-Ebene. Ja?
3. **Kauf Stufe 1 (Pistole/Blaster), etwa $100:**
   - Vefects $19.45 nach geklärter Lizenz;
   - luezpz $4.99;
   - Epic Stock Game Weapons $76.80.

   Vorher gratis testen: Kenney, die BOOM-Gratispakete, Sonniss. Ember Lite nur als Gegenprobe.
4. **Kauf Stufe 2** (Explosion, Gatling) erst nach der Abnahme von Stufe 1: BOOM Urban Explosions ab €119, BOOM Toy Guns €59, Bluezone Steampunk $17.80 nach Hörprobe.

Umsetzung danach: Flug spielt die Effekte ab (ein VFX-Modul mit Abspiel-Shader, Grading und Stufen-Abspieler), WSA Combat liefert nur die Waffen-Logik aus PR #48. Downloads nur mit Georgs Ja in meinem Chat.
