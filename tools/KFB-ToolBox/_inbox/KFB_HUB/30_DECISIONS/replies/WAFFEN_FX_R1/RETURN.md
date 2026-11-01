# Waffen-Ton, Mündungsfeuer, Explosion · V-1184 · 01.11.2026
Branch `game/waffen-fx-r1`, von `game/integration-r2` @6b683955 plus PR 48 @7b2454fe, nicht gemergt, alles hinter `fx=r2`. Nur Pistole, Blaster, eine Explosion. Hören kann nur Georg.

## Ton: was falsch war
1. **Im öffentlichen Tonspeicher fehlen die Klänge.** `combat_destruct_*` steht nicht im Index @33bcb759. Auf jedem Stand, der von dort lädt, fallen alle `av2.*` still weg, das Spiel nimmt keinen Ersatz. Jetzt eigene Route `/kfb-combat/` aus den privaten Dateien, Site-Schritt 3c.
2. **PR 48 spielte die Stems, nicht die Mischung.** Körper nur Tiefbass, Anschlag und Mechanik nur Höhen, dazwischen fast nichts. Das Zischen war hörbar, der Tiefton auf kleinen Lautsprechern nicht. `shot_layers` wurde also gespielt, die Datei aus der Hub-Hörprobe nicht.
3. **Pegel:** Bass-Unterbus −3,7 dB, Regler je rund −1,8 dB, Begrenzer greift kaum ein (Ausgang zu Master +1 dB). Der 3D-Panner gilt beim eigenen Schuss nicht; er drückte nur die Explosion.
Ein alter Cue überlagert nicht, der Rauch ist stumm.

**Jetzt:** Fertige Mischung `P1/P2`, `B1/B2` plus Anschlag (Tiefpass 8,5 kHz gegen das Zischen), Mechanik leise, Oberwellen aus dem Bass parallel im einen Graphen, Musik und Atmo kurz −6 dB, Explosion lauter.

## Zahlen je Schuss am Ausgang (roher Mitschnitt, 6 Schüsse je Waffe, Bandpegel in dB)
| | Spitze | RMS 100 ms | RMS 500 ms | 20–40 | 40–80 | 80–160 | 160–500 | 500–1k | 1–4k | 4–8k | 8–16k |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Datei `P1_pistol_c` | −1,8 | −6,5 | −9,8 | −12 | −22 | −27 | −35 | −35 | −29 | −38 | −45 |
| Pistole PR 48 (ein Schuss) | −1,6 | −13,0 | −18,0 | −18 | −25 | −39 | −42 | −46 | −28 | −32 | −31 |
| Pistole neu (Spanne) | −0,3 … −2,7 | −9,4 … −11,1 | −11,9 … −14,6 | −19 … −33 | −18 … −34 | −16 … −34 | −19 … −36 | −28 … −35 | −22 … −27 | −30 … −33 | −32 … −41 |
| Blaster PR 48 (ein Schuss) | −5,5 | −18,6 | −20,0 | −53 | −23 | −34 | −39 | −48 | −35 | −31 | −31 |
| Blaster neu (Spanne) | −1,0 … −1,9 | −10,1 … −18,5 | −12,1 … −13,9 | −21 … −27 | −19 … −21 | −18 … −22 | −19 … −22 | −26 … −32 | −26 … −30 | −30 … −33 | −32 … −36 |
| Explosion neu (2) | +0,1 / −0,5 | −11,2 / −8,6 | −9,6 / −9,5 | −24 / −16 | −17 / −20 | −20 / −19 | −20 / −22 | −27 / −30 | −24 / −31 | −34 / −32 | −39 / −39 |
**Ziel nur teilweise erreicht:** Am Ausgang rund 3 bis 10 dB mehr Dauerpegel als PR 48, Mitten je nach Variante 6 bis 23 dB mehr, oberstes Band 1 bis 10 dB weniger. `P1_pistol_c` selbst bleibt 2 bis 5 dB lauter, fast nur durch Energie unter 40 Hz. Die Varianten streuen stark, nur ein Teil trägt so viel Tiefton wie die Referenz. Bild zu Ton: Bild 0 bis 83 ms vor dem Ton, gemessen im Video.

## Cues Waffen und Fahrzeuge
| Cue | Datei | im Spiel ausgelöst | gemessen |
|---|---|---|---|
| `av2.pistol_full`, `.pistol`, `.pistol_mech` | privat, nicht im öffentlichen Speicher | ja, je Schuss | oben |
| `av2.blaster_full`, `.blaster`, `.blaster_mech` | privat | ja, je Schuss | oben |
| `av2.explosion_m`, `.body`, `.shatter`, `.debris_mittel`, `.tail`, `.hit_erde` | privat | ja, je Bombe | oben |
| `av2.explosion_l` | privat | ja, wenn ein Baum getroffen ist | nicht einzeln gemessen |
| `av2.flyby` (`R2_flyby`, neu angeschlossen) | privat | nur bei Treffer unter 9 m; **im Mitschnitt nicht vorgekommen** | ungemessen |
| `av.X09a`, `av.X09ab` (`X09_bolt_flyby`) | öffentlich | nur ohne `fx=r2`, 60 ms nach dem Schuss, sehr leise | ungemessen |
| `vehicle.passby.tree`, `.bush`, `.big` | öffentlich | **Stamm: nie.** Der Auslöser fragt `DRIVE.veg.instancesNear`, die Funktion gibt es nirgends | erzwungen −7 bis −15 dB |
| `engine.doppler.v8`, `.gt`, `.pod`, `.air` | öffentlich | **Stamm: nie**, derselbe Auslöser | vorher nur 1 bis 2 dB über dem Motor; mit Faktor 3,2 Spitze −3 bis −5 dB statt −6 bis −9 |
Angeschlossen hinter `fx=r2`: Vorbeifahrt an den Bäumen des Obstgartens (15 in Reichweite). In 22 s freier Fahrt kam die Route an keinem vorbei, **echte Auslösung also nicht belegt**, nur erzwungen. Fels, Busch und übriger Bewuchs fehlen noch: Dafür braucht es eine Abfrage aus der Bewuchs-Verteilung. Der Doppler steckt in den Dateien, die Tonhöhe folgt nicht dem wirklichen Tempo.

## Bild
Modell: `MODELL.md`. Beim Bau geändert: Feuer aus spitzen Zungen statt Kugeln, Rauch als Blumenkohl, Kern immer im Vordergrund, weil Figuren-Kopf ihn sonst verdeckt.

**Selbstkontrolle, Bild für Bild:** Die Explosion wirkt wie ein Actionspiel: Blitz, Feuerzungen, Rauchsäule, Staubring, Brocken. Die Pistole ist lesbar und kurz. **Schwach bleibt der Blaster:** Von hinten sieht man vor allem Nadeln und Licht, das Plasma verdeckt der Kopf. In der Standard-Kamera ist die Figur klein, das Feuer dort nur wenige Bilder deutlich.
Risiko: Der Fächer im zweiten Explosionsbild kommt einer Krone nahe, er steht rund 130 ms und ist unregelmäßig. Das soll Georg sehen.

**Kritiker einmal, auf dem Stand davor:** FAIL „Luftballons und Knetkugeln“, Kern fehlt, Funken zu früh, Pistolenrauch zu lang, Feuerball steht still. Danach umgebaut; er hat den Endstand nicht gesehen.

**Hänger:** Bis 0,6 s rund ums erste Anlegen der Waffe, danach in diesem Lauf keiner über 150 ms. Kamerastoß nicht gebaut.

## Tests und Übergabe
Geteilte Dateien mit Absicht: `kfbAudio.js`, `AudioHost.jsx`, `M1World.jsx`, `orchard3d.js`, `kfb-flight-vfx.js` (drei `export`), `weapon-fx.r2.mjs`, `build-site.mjs`, `vitePrivateAudio.mjs`. Nötig in `assets/private`: `combat_destruct_r2/r3/r5_lufs` (Stand @3ab91d03 laut PR 48; hier aus der Dropbox gemessen).
**Nicht gelaufen:** voller Site-Build mit Schritt 3c (nur das Kopierskript), Vergleich Programmliste und Bild ohne Schalter (zu groß für den Rechner, der Router nimmt ohne Schalter die alte Fabrik), Gatling, Dark-Szene, Treffer an Figuren im Bild.

## Nachtrag Übergabe Ton (Georg PASS, V-1184)
Stand `game/waffen-fx-r1` @659c793c, Stamm @6f3fdaf7 nachgeholt. Grün nach dem Nachholen: `fxR2-off-route`, `repair-audio-ownership` (60 von 60 Klängen geladen), `combatFxR2`, `combatRepair`, `asmrMap`, `contract-static`, Site-Build mit `combat: copied`, 60 Dateien, Lauf gegen den Site-Stand mit `fx=r2` spielt die drei Schuss-Schichten. Abgleich: 60 von 60 Klängen gleich mit `assets/private` @137600de. Ohne Schalter: Vergleich vor dem Nachholen gegen @6b683955, Programmzahl und Bild im Rauschen des Ausgangs.
