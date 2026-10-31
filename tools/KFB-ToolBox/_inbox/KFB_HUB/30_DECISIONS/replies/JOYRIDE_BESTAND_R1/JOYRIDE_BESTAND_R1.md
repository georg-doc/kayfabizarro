# Joyride J17 · Bestandsanalyse R1 (V-1108) · 31.10.2026

Reine Analyse. Kein Spiel-Code geändert, nichts committet. Kennzeichnung: **[b]** = belegt (Code gelesen, Bild gesehen oder im laufenden J17 gemessen), **[v]** = vermutet.
Pfad-Kürzel: `V/` = `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/public/vendor/joyride-j17/`. Spiel = `origin/game/integration-r2` @99c600be, gelesen über Worktree `~/kfb-ws0/verteiler-wt` (@e12e21c1), weil der Klon partiell ist und nicht alle Blobs lokal hat. Nachgelesen wurde mit `GIT_NO_LAZY_FETCH`; ein erster `git grep` ohne diesen Schalter versuchte zwei Nachladungen, beide scheiterten an der Anmeldung, es kam nichts herein.

---

## 0 · Das Wichtigste vorweg

1. **Der Kern von Joyride ist Flächenordnung, nicht Einzelteile.** Eine ruhige Bodenfarbe trägt die ganze Welt, Farbkontrast gehört den Objektklassen, und Übergänge sind örtliche Ereignisse entlang des Wegs. Im Spiel ist der Boden selbst das bunteste Objekt im Bild (Bild `90_`, `91_` gegen `50_`, `51_`).
2. **Übergänge sind Schichten, nicht Verläufe.** 14 benannte Schichten haben je ein eigenes Zeitfenster längs der Strecke. Das ist der eigentliche „Rundkurs-Trick“; er lässt sich ohne Strecke übernehmen.
3. **Der Bürgersteig ist ein Stapel aus vier Teilen:** abgesenkter Knetwulst, einzelne Bordsteine, sandfarbener Sockel, drei Plattenreihen. Das Spiel-Modul `kfb-curb` hat nur Teile davon, WS-Design hat die Fugen schon begonnen (`cascade/r4/pavement.js`).
4. **Die Fassaden-Deformierung ist nicht die Biegung.** Biegung und Verdrehung sind seit J09 abgeschaltet. Was man sieht, ist die Vorstufe `clay-soften` (Unterteilen, Taubin, Beulen mit gut 3 m Wellenlänge) plus Material v8.
5. **Die Strecke ist eine echte Schiene.** Ein geschlossener Datenstrom mit Rahmen je 0,5 m, Fahrphysik im Streckenrahmen, Bande per Bau. Damit fährt jedes Fahrzeug auch Looping. Das Spiel hat nur die Freifahrt-Ableitung `k2t`, die Schiene fehlt ganz.

**Neueste Fassung:** `V/` ist die maßgebliche, lauffähige Fassung. J17-Cut (`KFB Joyride J17 · FB Cabrio/…/code`) enthält nur das Delta zu J16 r2. `donors/joyride-j17-staged` ist hash-gleich zu `V/`, `V/…lab.html` = J17 plus Offline-Worker (three r186 statt r160, Fernzugriffe aus `_remote/`). Bordstein, Platten, Häuser, Markierungen, Material und Kamera sind byte-gleich seit J14 (sha1-Vergleich von `transition-atlas`, `track-look.v5`, `prop-guard`, `road-markings.m2`, `crown-ao`, `clay-material.v8/v10`, `lean-pass`, `kfb-drive.k2b`, `track-core.v012`) **[b]**. Nur `tunnel-clay.tc1` kam mit J15, `joyride-drive.j10` und die Sitz-Schicht mit J17.

**Lauf:** J17 lief headless (Metal), offline aus dem Spiegel, 33 s Aufbau, 7–38 fps, keine Laufzeitfehler aus dem Spiel-Code; Fehler nur aus der DC-Hülle (`{{ knobX }}`-Attribute, zwei abgewiesene Fernzugriffe: `support.js`-Abbruch beim Worker-Neuladen, Google Fonts). Server und Browser sind beendet. Bilder: 55 aus Joyride (je 1600×900, Motiv füllt das Bild, kein HUD) plus vier vorhandene aus Spiel und WS-Design. 14 MB. Freier Speicher 13 GB.

**Stand im Lauf gemessen [b]:** 2,0 Mio. △ im Bild, 355 Draw Calls, Szene 2,6 Mio. △ vor dem Teilen. Größte Massen: Gehweg 597k, Haus nah 545k, Bordstein 466k, Strang 442k. 259 Häuser, 4312 Bordsteine, 5532 Platten, 505 Möbel, 25 Zaunteile, 57 Knetbäume, 12 Türme, 70 Stützen, 228 Boost-Pfeile. Prop-Wache: 989 ok, 2 Fahrbahn, 24 Deck, 140 Tunnel. Welt (Tisch) ≈ 1107 × 1340 m ≈ 148 ha.

---

## 1 · Bäume

**Wo:** `V/lab-track/track-look.v5.js:370–381` (`tree`), `:355–357` (`blob`), `V/lab-track/crown-ao.v1.js` (`sphereAO` :35, `voxelAO` :12), `V/lab-drive/joyride-drive.j10.js:117–121` (Normalen-AO). Stadtbaum: Tiny Treats `tree_large`, `V/lab-track/transition-atlas.v1.js:278`. Bilder `01_`, `02_`, `03_`, `14_`, `24_`.

**Wie [b]:**
- *Stamm:* 4 Punkte, seitlicher Versatz `bend = ±0,25·h`, `bend2 = ±0,175·h` in einer zufälligen Richtung, `CatmullRomCurve3`, `TubeGeometry(cv, 24, rT, 12)`. Höhe `h = (11…20)·sc`, Radius `rT = (0,75…1,15)·sc`, `sc = 0,85…1,35`. Radius konstant.
- *Fuß („Bodenplatte“):* `blob(rT·1,9, …)`, `scale(1, 0,45, 1)` in Stammfarbe, bei `y0 − 0,1`. Bild `02_` zeigt die Platte als braunen Fladen; das ist, was Georg falsch nennt.
- *Krone:* Hauptkugel `cr = (4,2…6,8)·sc`, y-Stauchung 0,9, 0,55·cr über Stammende; dazu 2–4 Nebenkugeln `r = cr·(0,45…0,70)`, Abstand 0,75·cr, Höhe `cr·(0,3…1,0)`. Farbe `leaf0/0/1/2` (Hauptton doppelt gewichtet), Nebenkugel zu 25 % andersfarbig. `blob` = Ikosaeder, Punkte auf Kugel projiziert, Beule `1 + 0,1·sin·sin·sin` (Lean: Stufe 4, ~500 △ je Kugel).
- *Verdeckung:* `sphereAO` je Vertex, analytisch aus `r²/d²·cos`, `k 0,95`, `min 0,34`, plus Normalen-AO (`min 0,42`, `lo −0,55`, `hi 0,35`). Beides als Vertexfarbe, kostet zur Laufzeit nichts. Schließt die helle Kronennaht (`POSTMORTEM.md` J05–J10).
- *Knete:* Material v10, Profil `nature`, Werkzeugmix `trunk: thumb .75, crease .5`, `nature: thumb .6, fan .55, smear .4` (`clay-toolmix.v1.js`), Handmaß K = 3.
- *Stadtbaum:* `tree_large` Skalierung 1,9 mit `voxelAO` an der Quelle (`res 44, rays 28`, 87 ms, alle Klone erben es).

**Warum es wirkt:** Der Stamm ist eine einzige weiche Linie mit Schwung, die Krone eine Traube aus wenigen großen Formen. Silhouette zuerst, null Blattwerk. Bäume sind riesig (9–27 m) gegen eine 1,8-m-Figur, also Zeichen, keine Botanik. Der Kronen-Farbton wechselt innerhalb eines Baums selten und hart (Rule of Three im Kleinen), Bild `03_`.

**Spiel heute:** Fehlt. Das Spiel nutzt KayKit Forest und Quaternius-Palmen als Kit-Teile (`src/world/placeVeg.js`, `kfb_place.r1.slim.json`: 23 Bäume, 22 Büsche), Stamm und Krone aus dem Kit, Knete über `kfb-clay v1.1`. `TubeGeometry` kommt nur im Vorhang vor. `sphereAO`/`voxelAO` fehlen (kein Treffer in `src`). Regel V-797 (KayKit = Zonen) bleibt davon unberührt: Knetbäume wären ein zusätzliches Vokabular als Anker, kein Ersatz für Waldmassen.

**Fehler, die nicht mitwandern dürfen:** Fuß-Fladen (Georg). Facettierte Kronensilhouette im Leicht-Profil (Bild `14_`, Stufe 4 ist nah zu grob). `tree()` und `bush()` nutzen einen laufenden Zufallsstrom, nicht je Ort gesät; für endlose Zellen unbrauchbar.

**Integration: anpassen.** Generator 1:1 in eine Bau-Datei, Fuß ersetzt durch einen Ausfall im Stammradius (`r(t) = rT·(1 + 0,6·(1−t)⁴)`, statt `TubeGeometry` ein Sweep), Krone Stufe 5 mit LOD. **Owner:** WSB backt 9–12 Varianten je Palettenrolle als GLB (V-1065), AO als Vertexfarbe. Spiel: `kfb-place`-Kachel `kind: tree, set: knet` (V-1076). **Schalter:** `flora=knet`. **Größe M.** **Prüfung:** Bildpaar aus Spielkamera gegen `01_`, Budget je Baum ≤ 3k △, kein sichtbarer Fuß-Fladen, blinder Kritiker. **Abhängig:** Palettenrollen V-801 (Stamm = Laub −105°, schon drin).

---

## 2 · Büsche, Steine, bunte Kleinteile

**Wo:** `track-look.v5.js:382–389` (`bush`, `rock`, Cluster), `transition-atlas.v1.js:135–141` (Dreiergruppen hinter dem Zaun), `:283–288` (Zaun), `prop-guard.p1.js`, `transition-atlas.v1.js:113–120` (`blocked`). Bilder `03b_`, `01_`, `42_`.

**Wie [b]:**
- *Busch:* 2–3 Kugeln `r = (2,0…3,4)·sc`, y 0,78, Mitte `y0 + 0,35·r`, seitlich `±0,8·r`, eine Laubfarbe je Busch.
- *Fels:* eine Kugel `r = (2,2…4,2)·sc`, Beule 0,25, Maß `1 : 0,62 : 1,1`, gedreht, Mitte `y0 + 0,2·r`. Farbe Rolle `rock` (Canyon Creme `#e2d0bc`). Einsinken rechnerisch: Busch rund 28 %, Fels rund 34 % der Höhe.
- *Verteilung offenes Land:* 52 Versuche `place(20, 95)`: Zufallspunkt, Abstand zur Strecke 20–95 m, `blocked` frei. Je Baum ein Winkel `ang`: Büsche bei `ang + k·1,4 rad` in 6–9 m, Fels bei `ang − 1,6 rad` in 8–11 m, je mit Mindestabstand 15 m zur Strecke. **Rule of Three steht wörtlich im Kommentar:** Baum Anker, zwei Büsche Stütze, Fels Akzent.
- *Verteilung am Damm:* Takt 12 m, **jede dritte Stelle bleibt Sichtachse** (`k % 3 === 2`), Schwelle nach Schichtwert `nature`.
- *Prop-Wache:* ganzes Teil raus, nie halb. Gründe `road`, `deck`, `tunnel` gegen alle Samples im 12-m-Raster, mit Fußradius, Kronenradius, Höhe.
- *Einbindung in die Bodentextur:* **gibt es nicht.** Kein Albedo-Übergang, keine Kontaktsteine, keine Sprenkel. Es tragen nur Einsinken, Sonnenschatten und die dunkle Unterseite aus Normalen-AO. GTAO ist im Leicht-Profil aus (`contactAO: false`).
- *Bunte Kleinteile [b]:* Hydrant Rot, Bank, Mülleimer, Zaun (Tiny Treats), Blumenkübel am KayKit-Haus, gelbe Boost-Pfeile, Knet-Krümel beim Fahren. Blumen, Pilze und Kiesel fehlen in Joyride ganz.

**Warum es wirkt:** Sehr wenig, sehr groß, sehr weit auseinander. 57 Baumgruppen auf 148 ha, also rund eine je 2,6 ha [b gerechnet]. Weil der Boden ruhig ist, reicht einfaches Einsinken: Der Farbsprung trennt, die Form sitzt trotzdem. Gruppen haben eine klare Lesereihenfolge.

**Spiel heute:** Dreier-Regel, Einsinken, Kontaktregeln sind dort strenger und weiter (V-565, V-749, V-1005). `place=r2` (WS-Verteiler) hat echtes Nachbarschafts-WFC, Bodenalbedo, Blumen. Joyrides Gruppen sind also **kein Vorbild für Regeln**, nur für **Maßstab und Luft**. Die Dichte des Spiels ist nicht gemessen; im Bild deutlich höher [v].

**Fehler:** `place` ist Zufall mit Abweisung, ohne Gruppen-Wissen; kein Vorbild für die Logik. Abgewiesene Plätze hinterlassen Lücken ohne Ersatz. Büsche stehen teils in der Zaunlinie (Bild `01_`, keine Abstandsprüfung im Code gefunden) [v].

**Integration: nur das Prinzip.** Für WS-Verteiler als Datenzeilen im Löser: Anteil Freifläche, Sichtachse je dritte Stelle, Abstandsbänder Anker/Stütze/Akzent (6–9 m, 8–11 m × Maßstab), Mindestabstand 15 m zur Straße. Prop-Wache als harte Schicht vor dem Löser (Gründe `road/deck/tunnel`, ganzes Teil raus) gibt es als `keepout`/`occupancy` schon in Teilen; `deck` und `tunnel` fehlen. **Owner:** WS-Verteiler. **Schalter:** `place=r2`. **Größe S.** **Prüfung:** Häufigkeitsstatistik plus Bild aus Spielkamera.

---

## 3 · Bürgersteig und Bordstein

**Wo:** `transition-atlas.v1.js:193–204` (Bordstein), `:206–223` (Sockel, Platten), `:224–243` (Plätze, Verwehung), `track-look.v5.js:199–216` (Wulst wird Lippe). Bilder `13_`, `14_`, `15_`, `16_`, `17_`, `18_`.

**Wie, von der Fahrbahn nach außen [b]** (Werte in Metern, `e` = Fahrbahnkante, Fahrbahn 14,4 m breit):

| Schicht | Geometrie | Lage | Variation |
|---|---|---|---|
| Lippe | Strang-Querschnitt, Höhe von `H` auf 0,32 gesenkt, rückt auf `e + 0,35` | Rand | Farbe per Knetfleck zu Bordfarbe, nur am Boden (`groundK`) |
| Bordstein | `RoundedBoxGeometry(0,56; 0,36; 0,9; r 0,13)` alle 1,05 m | `e + 0,62`, Höhe +0,1 | Breite ±6 %, Höhe `(0,45…1)·` Wachstum ±7,5 %, Länge −0…10 %, Drehung ±0,06 rad |
| Sockel | Band aus 7 Querpunkten je Meter: `[e+.3,−1] [e+.6,.1] [e+.9,.15] [dOut−2,.16] [dOut−.6,.02] [dOut+.5,GY−.45] [dOut+1,GY−.9]` | bis `dOut = e + 1,6 + 34·w·(0,94 + 0,12·Rauschen(s/17))` | Außenkante atmet ±2 m bei rund 17 m Wellenlänge |
| Platten | `RoundedBoxGeometry(1,6; 0,2; 1,95; r 0,07)`, Takt 2,1 m, drei Reihen | `e + 1,35 + r·1,75`, Höhe +0,22 | Breite ±3 %, Dicke ±15 %, Drehung ±0,03 rad |

- *Rundungen:* Alle Teile stehen im lokalen Rahmen (`R, U, T`) des nächsten Samples und drehen mit. **Die Steine bleiben Quader,** der Takt läuft auf der Mittellinie. Folge bei Radius 70 m: Außenreihe Abstand 2,46 m statt 2,1 (Fuge 0,51 statt 0,15), Innenreihe 1,74 m (0,21 m **Überlappung**). Bordstein außen Fuge 0,325, innen 0,03. Das gibt die Kettenanmutung um Bögen (Bild `15_`, `16_`). Enge Bögen klappen: Der Sockel ist deshalb innen auf 85 % des Krümmungsradius begrenzt (`sockelFold`, Fix J13).
- *Staffel beim Auftauchen:* `hh > wc^0,8` lässt Bordsteine erst vereinzelt, dann dicht erscheinen, Schwelle Platten `wS < 0,1 + r·0,2 + 0,28·hh`. So wächst die Stadt Stein für Stein. Bild `17_`.
- *Farben Canyon:* Sockel `#cbbba8`, Gehweg `#e7d9c5`, Bord `#f5ecdd`, Randlinie `#f7eedd`. Material Profil `prop`, `QUIET`, Sockel Profil `terrainFg`.
- *Sackgassen-Platz:* Verwehung als Punktfeld „Loses über Festes“, in J17 aus, weil der Parcours geschlossen ist.

**Warum es wirkt:** Die Fugen sind echte Schatten, kein Muster. Vier Tiefenstufen auf 6 m Breite. Weiche Bevels machen aus Quadern Kissen, wobei die Steine groß genug bleiben, um aus der Fahrkamera als Einzelteile zu lesen. Die Sockelfläche ist hell und ruhig und bildet eine Bühne, auf der die bunte Stadt steht (Bild `41_`).

**Spiel heute:**
- Stamm: fehlt ganz (kein `kfb-curb`, `street-plan`, `pavement` auf `game/integration-r2`) [b].
- `design/kartengebaeude-r1`: `src/modules/kfb-curb/index.js` (V-1000) als Polygon-Ring, Pflaster laut Spec als Shader-Muster; `cascade/r4/pavement.js` setzt Fugen schon als Geometrie „nach Joyride“: Stein 0,34×0,48 Takt 0,72, Platte 0,8×0,2 Takt 1,05, eine Plattenreihe, Keil in Ecken. `cascade/r4/streets.js` ist ein älterer Direktübertrag, laut `SOURCE.json` nicht mehr benutzt.
- Fehlend gegen Joyride: drei Reihen, Sockel, Lippe, Staffel beim Auftauchen. Bilder `92_`, `93_`.

**Fehler, nicht mitnehmen:** Überlappung und klaffende Fugen in Bögen. 108 △ je Stein und Platte (gemessen), 1,06 Mio. △ gesamt, kein Instancing (gemergt, dann in 140-m-Kacheln geteilt, `chunkify`). Bordsteinfarbe widerspricht dem eigenen Regelwerk: M2-JSON sagt „dunkler als der Gehweg“ (`#b8a58c`), gebaut wird `#f5ecdd` aus `transition-profiles` [b]. Für Georgs Blick zählt der helle Stand aus dem Bild.

**Was der Code für das Trapez-Gizmo hergibt:**
- Joyride selbst hat **keine Trapeze**, nur gedrehte Quader. Geschenkt sind aber der Rahmen und `P(q, sd, d, h)` / `PA(...)` (`transition-atlas:72–73`): Weltpunkt aus Streckenstelle, Seite, Querabstand. Damit sind die vier Ecken einer Platte exakt berechenbar: `P(s0,d0) P(s1,d0) P(s1,d1) P(s0,d1)`. Das ist das Trapez, ohne Fuge und ohne Überlappung.
- `pavement.js:block()` hat den Keil schon: `z *= 1 + x·turn` auf einem RoundedBox. Das ist ein Viereck mit parallelen Stirnkanten plus Bevel; für große Bögen ausreichend, Ecken bleiben tangential.
- `kfb-curb` liefert Offset-Ringe mit gleicher Punktzahl (`geometryFromRings`). Zwei Nachbarringe plus zwei Bogenlängen = dieselben vier Ecken für beliebige Grundrisse, auch konkav.
- **Vorschlag Gizmo-Datensatz:** `{ reihen:[{breite, fuge}], takt, taktVersatz, bevel, dicke, jitter:{quer,dicke,dreh}, staffel:{an,aus}, randStein:{breite,höhe,takt} }`. Griffe: Reihenbreite, Takt, Fuge, Bevel, Eckpunkt eines Teilstücks je Bogenabschnitt. Ein Viereck-Bau: vier Ecken → Rundung über Kissenform (`bevel`), Oberseite leicht gewölbt, Unterseite offen; **Instancing ist bei echten Trapezen nicht möglich, also Zellen-Merge pro 64 m**.

**Integration: anpassen.** Ein Modul `kfb-pavement` zieht `pavement.js` und `kfb-curb` zusammen (Ring bleibt Sockel und Höhen-Owner, V-1000), bekommt Reihenzahl, Sockel-Band, Lippe und echte Vierecke. Maße skalieren mit der Straßenbreite: 14,4-m-Fahrbahn in Joyride, 4,4 m im Kartenviertel. **Owner:** WS-Design, nach Georgs KEEP in den Stamm. **Schalter:** `viertel`, später `pave=r2`. **Größe M.** **Prüfung:** `test/design/curb-gate.mjs`, Bildpaar gegen `13_` und `15_`, Prüfung „keine Überlappung, Fuge ≥ 2 cm“ mechanisch, Bildzeit in `perf-street.mjs`.

---

## 4 · Häuser, Fassaden, Stadtbild, Stadtmöbel

**Wo:** `V/lab-clay/clay-soften.v1.js`, `transition-atlas.v1.js:146–165` (Quelle, `bend`), `:249–270` (Reihung), `:271–281` (Möbel), `:304–314` (Instanzen), `joyride-drive.j10.js:79–93` (Material v8), `:126–140` (Nah/Fern), `V/lab-drive/joyride.j06.json#facade`. Postmortem `KFB World Design Setup Claymation Test/JOYRIDE_SESSION_2026-09-29/POSTMORTEM.md`. Bilder `18_`–`24_`, `62_`.

**Die Deformierung [b]:**
- **Aktiv: `softenGeometry` je Teil vor dem Mergen.** Unterteilen bis längste Kante `0,18·diag/3` (höchstens 3 Stufen), Verschweißen nach Lage, Taubin 8 Durchgänge (`λ 0,5 / μ −0,53`), Beulen entlang der Normale: Amplitude `0,018·diag`, Frequenz `1,6·3/diag`, zweite Oktave 0,45. Rechnet man mit einer Hausdiagonale von rund 4 Kit-Einheiten [v] und Maßstab 4,1: Beule ±0,3 m, **Wellenlänge rund 3,4 m**. Das passt zu V-1004 („≥ 3–5 m, wenige Prozent“).
- **Aus: `bend` (Biegung 0,12, Verdrehung 0,18, Höhenrhythmus 0,92–1,38).** `houseK1: true` setzt alles auf 0. Grund: gestreckte Beulen (J09). Im Lauf bleibt `bend` nur auf der Quellenbank (`62_`). **Georgs „Joyride-Fassaden“ sind also gerade, nur geknetet.** Die gebogene Fassung ist kein Stand, den er zuletzt gesehen hat [v].
- **Stufen:** nah < 55 m mit `maxTris 90 000`, fern 24 000, Schattenstellvertreter als Rohform auf Ebene 1 nur für Häuser außerhalb des Bildes. Je Quelle drei `InstancedMesh`. 0,15-s-Takt für die Auswahl.
- **Material:** Häuser laufen auf **`clay-material.v8` Profil `house`**, nicht v10: Hand 0,5·hk, Kachel 1,6·hk, Abdruck 4,5·hk, Facette 0,65·hk mit `hk = 2,06` (T4-Höhe ÷ 3,4). Fingerabdruck-Karte Pflicht. Eigene Materialkopie patcht die Instanz-Drehung in die Reliefnormale (`vIM0–2`).

**Stadtbild [b]:**
- 8 Quellen `building_A–H`, Maß 4,1 gleichmäßig. Reihenfolge `(k·5 + Seite) mod 8`, also nie zwei gleiche nebeneinander. Eine Reihe je Straßenseite, Front zur Straße, einheitliche Baulinie `e + 6,2`, Lücke `1,2 + 2,6·hash`. Dahinter nichts als Sockel, dann Tisch.
- *Möbel:* Takt 10,5 m im Wechsel: Laterne bei `e + 1,55` (Maß 5,95, `yaw π/2`, Arm über die Straße), dann Baum bei `e + 3,1` (1,9). Alle 42 m Bank `e + 4,7` (1,6) plus Mülleimer 2,4 m weiter. Alle 63 m Hydrant `e + 1,35` (3,49). Ausrichtung `fwd = −sd·R`: +Z zeigt zur Straße.
- *Bewusst keine Verkehrslogik:* Nur Zeichen.

**Warum es wirkt:** Kulisse wie eine Theaterstraße: eine Baulinie, ein Rhythmus, viel Farbe an den Häusern und Ruhe auf dem Boden. Die Knete ist gleich grob wie die Häuser selbst groß sind, und die Gebäudeumrisse bleiben gerade genug, um Kit zu bleiben. Die Vorstufe rundet Kanten, ohne Silhouette zu zerstören.

**Spiel heute:** `clay-soften` ist nicht im Einsatz (nur `SOURCE.md` und Profile erwähnen es), `faceNormals` fehlt. `clay-material.v8` liegt vendort, aber Kit-Häuser im Viertel laufen über `kfb-clay v1.1`. KayKit-Maß 4,1 und `yaw` sind in `cascade/r4/kit-layout.mjs`, `street-plan.mjs` schon übernommen (V-1057), Laternen, Hydranten, Bank. Möbelwahl per Löser auf `world/verteiler-streetplan-r1` @99d21e57.

**Fehler:**
- Taubin auf dünnen Platten: Budget 24 000 statt 90 000 wellte Dächer (J10). Vorstufe **je Teil** rechnen, nie am verschmolzenen Haus.
- Aufbau zur Laufzeit dauert Sekunden. Das Postmortem sagt selbst: „offline backen“.
- Stadtweltfarben folgen dem Weltwechsel nicht: Häuser behalten die Kit-Farben in `bucht`/`otown` (`48_`, `49_`). Die Sonderstellung v8 widerspricht V-429 (ein Knete-Material).
- `J10-Fassadenschalter facadeMeshes` ist seit `postMerge: false` wirkungslos.
- Kamera-Sichtlinie gegen Häuser nur grob (Kugel, Radius × 0,72, `j10:271`).

**Integration: 1:1 die Vorstufe, Material anpassen.** WSB backt `building_A–H` (und `withoutBase`) mit genau diesen Werten als GLB in zwei Stufen, Quelle bleibt erkennbar, Modell-Owner nach V-1065. Spiel lädt nur noch, Material bleibt `kfb-clay` mit Weltmaß (siehe §7). Stadtbild: Baulinie und Möbeltakt als Datenzeilen im Löser, nicht als zweite Logik (`street-plan` hat Gruppen, V-1076). **Schalter:** `viertel`. **Größe M.** **Prüfung:** Bildpaar `21_` gegen Spielkamera, Dachkante nah, Georg-Blick; `fs-quelle`-Prinzip (Quelle neben Knete) als Gate. **Abhängig:** Palette der Häuser (Hub-Frage: Kit-Farben lassen oder einfärben).

---

## 5 · Rennstrecke

**Wo:** Core `V/lab-track/core/track-core.v012.mjs` (136 kB, rein, ohne Abhängigkeit, Zitat Kopf: „One authoritative core“), Rezepte `V/lab-track/parcours/p1-recipes.js`, Stream `V/lab-track/data/p1b.v2.stream.json`, Look `track-look.v5.js`, Markierung `road-markings.m2.js/.json`, Fahren `V/lab-drive/kfb-drive.k2b.js`, Tunnel `tunnel-clay.tc1.js`. Bilder `30_`–`39d_`, `50_`–`59_`.

### 5.1 Streckenmodell [b]
- Rezept (Liste von Stücken) → Core kompiliert → **Stream**: 8786 Samples, `ds 0,5 m`, 4392,5 m, geschlossen, Fingerprint `d42aa57e`, 25 Prüfungen, 0 Fehler. Warnungen: `vehicle_headroom 3,35`, `loop_scale 26 m`, `width_taper 11,1`, `jump_speed 32,05`.
- Je Sample: `s, p, T, U, R, kappa, bank, grade, law, tags, prm{width, offset, shoulderW, …, surface}, marking, skin, slots[14]`. `slots` ist der Querschnitt vom `under_L` bis `under_R`. Alles Weitere liest nur.
- Stücke: `STRAIGHT, TRANSITION, CURVE_EASE, HAIRPIN_180, SPIRAL, WIDTH_STEP, OFFSET_S, CREST, DIP, KICKER, AIR, LANDING, SPLIT_HALF, MERGE_HALF, LOOP, CONNECT`, dazu `PIT_LANE, WEICHE`, Kreisverkehr-Knoten (`ROUNDABOUT`, `KERB_SECTION`), Pads, Graph mit Abzweigen (`compileGraph`). Breiten 10,8–28,8.
- **Looping:** senkrechte Tropfenform `κ = kmax·sin²(πs/L)`, seitlicher Versatz `D = (Breite+3)·1,35`, Höhe Standard 100, Mindestens 60. Bild `38_`.
- **Sprünge:** `AIR` berechnet die Wurfparabel aus Lippenwinkel und Spannweite, `LANDING` fängt sie ab. **`CONNECT`** ist ein Quintik-Anschlussstück zu beliebigem Zielrahmen.
- `Rundkurs-Baukasten.png` (KFB Claymation Reference): Referenzbild für Anschluss-Logik (Kreisverkehr, Einmünden, Teilen, Randabschlüsse), nicht J17-Look (blau, rot-weiß, gelb). Das meiste davon gibt der Core schon her, ist aber in P1b nicht gebaut [b].

### 5.2 Look: Strang, Banden, Stützen [b]
- **Strang:** Hohlkehle + Randwulst + Bauch aus einem Ring je Sample: 27 Punkte je Seite, Radius `0,55·(H + Abfall)`, leichtes Rauschen (`±6 %`, Wellenlänge 9 m). **Bedeutung durch Form:** Querrippen innen in Kurven (`RIB 3,5 m`, Schwelle Krümmung 0,008–0,022), Prallwulst außen in engen Kurven (0,014–0,04), Bilder `36_`, `37_`. Farbe `#ef5a22`.
- **Fahrbahn:** 7 Punkte quer, **Kontaktfläche unverändert** aus `slots[6..7]`, Knetflecken zwischen `#566680` (Straße) und `#3d4a60` (Strecke, V-102).
- **Stützen:** Drehkörper mit Elefantenfuß (1,62·R), Taille (0,86), Bauch (1,06), Kissen an den Fugen, Kapitell (1,42). Takt 16 m (eng 11 m), weggelassen über 0,93 Neigung, im Looping, unter Höhe 3. Über 14 m doppelt mit Querbrücke. Neigung ±0,05 rad. Bild `33_`.
- **Knetgummi-Bande:** `makeWobble` (`lean-pass.l2.js:94`) schiebt Vertices am Treffpunkt: Amplitude 0,55·Energie, Abklingen 4,2/s, 24 rad/s, Radius 11 m.

### 5.3 Fahrbahnmarkierung je Abschnitt [b]
Maß `S 0,30 / B 0,60 / Q 1,20`, Querschnitt flache Knetwurst, gerade Enden, je Farbrolle eine Geometrie. Muster wird **vom Ereignis rückwärts** gelegt.

| Abschnitt | Rand | Mitte | Besonderes | Bild |
|---|---|---|---|---|
| Stadt (`STREET`) | S durchgezogen, hell | Leitlinie S 6/12 m | Warnlinie 6/3 vor Zebra (in J17 inaktiv) | `50_` |
| Rennen (`TRACK`) | B durchgezogen, hell | keine | Keil B→S über 20 m beim Übergang | `51_` |
| Magnet (`MAG`), auch im Looping | Blocklinie B 3/3 m, Signalfarbe `#f2b632` | Chevron-Pfeile: Takt 3 m, Breite 0,7·Fahrbahn, Dicke 0,95, Spitze ≤ 2 m | Fläche 228 Pfeile | `31_`, `32_`, `52_`, `54_` |
| Tunnel | wie Magnet [b, siehe Fehler] | keine | Lampen nur emissive | `56_` |
| Natur | Rand läuft aus: **Takt-Auslauf** 7 Stücke im 3-m-Takt, Länge fällt linear bis Strichbreite | keine | keine Zufallslücken | `43_` |
| Sackgasse | gerade weiter, Zugeweht | Warnlinie, Zebra 12 m vor Ende | in J17 aus | – |

Das JSON enthält mehr (Parkstände, Haltlinie, Sperrfläche, Pfeile, Start-Karo); gebaut sind nur die Zeilen oben.

### 5.4 Übergänge Stadt/Rennen → siehe §6.3 und Bild `17_`, `42_`, `43_`, `45_`, `46_`.

### 5.5 Fahrzeug und Strecke [b]
- **`stepDriver` rechnet in `(s, lat, psi)`**, nicht in x/z. `pose` baut daraus Weltlage. Helix, Überführung, Looping sind damit eindeutig. **Bande = `|lat| > half − halfW`.** Keine Kollisionsgeometrie.
- *Spurhilfe:* `assist 0,8` nimmt 80 % der Streckenbiegung mit. Prall behält Tempo (`wallKeep 0,995`). Flug ab `surface < 0,5`, Landehilfe zielt auf Landung + 6 m.
- *Fahrzeug-Vertrag:* `extraVehicles: { id, url, scale, rotY, prep(model,gltf), keepMat, notWheel }`, `fitWheels` misst Radmitte, Radius, Breite aus dem Modell. Kein Rad: Rückfall `wr 0,33`.
- *Kamera:* §7.

### 5.6 Rollercoaster-Eignung und Badewanne, Jetpack, Surfboard, Skateboard

**Eignung: hoch [b].** Ein Stream ist eine Schiene mit Dach, Boden und Rändern. Stückprüfungen laufen auf Knick, Krümmungssprung, Banksprung. Der Rahmen-Fahrer kann nicht abstürzen. Was noch fehlt:
- `drive`-Felder der Rezepte (`locked, assist, free, magnet_catch, bounce`) werden von `k2b` **nicht gelesen** (0 Treffer). Festhalten im Looping, Magnetfang, Mindesttempo müssten neu rein; ohne Tempo steht das Auto schief an der Wand (`TEST_REPORT` J17 Punkt 6).
- Überhöhung ist nur wenig genutzt (`bankDeg 18` in `fs_catch`). Echte Korkenzieher-Stücke gibt es nicht; ein `ROLL`-Stück ließe sich im Core-Muster ergänzen [v].
- Wechsel von Freifahrt auf Schiene: **gibt es nicht.** Nötig ist ein Einfädler: Spieler nähert sich Auffahrt, `k2t`-Zustand wird auf `(s, lat, psi)` projiziert (Vorlage: Funktion `project` in `kfb-drive.k2b.js`), am Ende zurück.

**Andere Fahrzeuge [b/v]:** `carG`/`holder` sind unabhängig vom Modell, Fahrzeuge kommen über `extraVehicles`, Sitz über die Schicht `cabrio-seat.j17.js`. Wanne (V-273, V-320) und Kart passen direkt. **Jetpack, Surfboard, Skateboard** [v]: `pose` hat `hover`, Fahrer steht statt sitzt. Es fehlen eine Steh-Pose (WSB), Bord-Neigung aus `roll/pitch` und ein Flugabstand; Jetpack wäre Schiene mit höherem `hover` oder Freiflug zwischen Schienen. Keine davon verlangt eine andere Strecke.

### 5.7 Vergleich Spiel und Fehler
**Spiel heute:** `src/m2/k2t.js` = k2b-Formeln in x/z ohne Streckenrahmen, ohne Spurhilfe (V-290, V-313). Squash (`SQUASH_LOOK` in `M2Car.jsx`) ist drin. Strecke, Strang, Stützen, Markierung, Tunnel: fehlen. V-985 plant Tunnel, V-210 Racetrack für später. Wobble, Fahrzeug-`fitWheels`: fehlen.

**Fehler aus J17, nicht mitnehmen [b]:**
- Zonen in `transition-profiles` hängen an festen `s` aus TD03. Alles ab s 1570 gilt als Stadt, auch Skydrive, Hero und Tunnelzufahrt; deshalb Häuserzeilen und Sand an jedem bodennahen Stück. Der Stream hat einen eigenen Eintrag `transitions`, der Atlas liest ihn nicht.
- `MAG`-Markierung läuft ab `sky_ridge` durch Sprung, Landung, Tunnel bis `hero_wide` weiter (2171 Samples), weil kein Stück sie zurücksetzt; wirkt versehentlich [v].
- Hero Jump geht nur mit Boost. Roof-Loop 26 m unter der eigenen Mindesthöhe.
- Stützen werden nur am Tisch gesucht; `below`-Prüfung lässt Lücken auf Überführungen.
- Tunnelfahrbahn liegt im Sonnenschatten, Lampen beleuchten nichts.
- Sitz, Griff, Ohren: `RETURN.md` J17 Punkt 1–7. Kamera auf 4,3-m-Auto (Cabrio klein im Bild, `50_`).
- Probenbrett und Quellenbank stehen sichtbar in der Welt (`61_`, `62_`). Kicker-Enden als Kapsel-Lippen (Bild `34_`).
- V-205: freie Knubbel-Bandenenden sind der bekannte Regress, Lippen also nur, wo sie in Boden laufen.

**Integration: Modul-Schnitt in vier Teile, Core 1:1.**
| Teil | Weg | Owner | Größe |
|---|---|---|---|
| `track-core` + Rezepte | 1:1 als vendor | Spiel | S |
| Stream → Mesh: Strang, Fahrbahn, Stützen, Pfeile, Markierung, Lippen | 1:1 aus `track-look`/`road-markings`, Teile herauslösen, Material `kfb-clay`, Kacheln je Abschnitt | Spiel (neue Sitzung WS-Strecke) | L |
| Fahren auf Schiene + Einfädler | k2b 1:1 (V-032), Übergang neu | Spiel | M |
| Einbettung im Gelände: Flachband um die Strecke (`flatInside 28`, `riseTo 115`), Tunnelfuß | anpassen an `terrainStitch`, ein Höhen-Owner | Spiel/WS1 | M |
**Schalter:** `track=j17`. **Prüfung:** `parity`-Prinzip: gleiche Kamera, gleiche Stelle gegen `chase-*.jpg` (V-010, V-206), Runde 91,6 s, 7/7 Sprünge, 0 Bande.

---

## 6 · Farbe und Boden

### 6.1 Paletten [b]
`track-look.v5.js:46–65`, `transition-profiles.v1.json#worldPresets`, Bilder `40_`, `48_`, `49_`. Sechs Massenfarben plus Akzente:

| Rolle | Canyon | Bucht | O-Town |
|---|---|---|---|
| Tisch | `#8b68c7` | `#f0cf7e` | `#3aa596` |
| Hügel | `#a582d9 #7b5bb8` | `#5cc3bf #46adb2` | `#2f8f83 #4cb5a5` |
| Strang | `#ef5a22` | `#f2708a` | `#e9b53b` |
| Turm | `#ef5a22 #e8743a` | `#9a6fd0 #b08ae0` | `#c9508f #e0679f` |
| Laub | `#1f7a3e #2f8a45 #cdc666` | `#8fcf45 #5fb84a #f7a1c4` | `#f08a2c #f5b041 #c9508f` |
| Stamm/Fels | `#8a5a3a / #e2d0bc` | `#c9895a / #9a6fd0` | `#6b4a8a / #e0679f` |
| Himmel | `#96bede` | `#8fd6ec` | `#a8d8b9` |
| Pad | `#f2b632` | `#f7d23c` | `#fff06a` |
| Fahrbahn | `#3d4a60` | `#3e5d7c` | `#4a4d6e` |

### 6.2 Warum es stimmig wirkt [b, gemessen wo angegeben]
- **Ein Boden, eine Farbe.** `M.table` ist ein einziger Ton mit Relief (`terrainBg`), 70–80 % der Bildfläche von oben. **Es gibt keine Farbbänder im Boden.** Hügel sind eine Stufe davon.
- **Kontrast gehört den Klassen:** warm gegen kalt, Strang auf Tisch fast komplementär. Innerhalb einer Klasse sehr wenig Streuung: zwei Hügeltöne, zwei Turmtöne.
- **Neutrale Puffer:** Fahrbahn schiefer, Stadtplatte sand, Fels creme, Himmel entsättigt.
- **Schatten bleiben im Farbton** (Bild `02_`, `33_`): Violett wird tiefes Violett. Das erzeugt kein Sondercode, sondern Hemisphäre 1,05 gegen Sonne 2,9 mit ACES.
- **Messung Farbton-Streuung** (Oklab, Farbton-Entropie über 12 Klassen, nur Pixel mit Chroma > 0,04, Bild auf 640 px): Joyride `50_` 1,69 · `51_` 1,45 · `40_` 1,42 · `41_` 1,57. Spiel `90_` (mit HUD) 2,36 · HUD-Bild Überblick 2,21 · Moos ohne HUD 2,04. Kantenenergie Joyride-Fahrbild 0,014–0,034, Spiel 0,039–0,053. **Stichprobe klein, drei Spielbilder, zwei mit HUD,** aber die Richtung passt zum Augenschein.

**Das Spiel hat die Palette, nicht die Flächenordnung.** `kfb-cartoon-palette.js` (V-305) bildet Farbwerte und Rollen sauber ab, sogar „Boden 60 %“ steht im Kopf. In `terrain3.js` aber laufen 6 kontrastreiche Fließbänder aus Boden, Boden hell, Hügel, Erde (Gegenfarbe), Sand (V-801) quer durch jede Ansicht, und `calm` ist seit V-800 auf 0. Georg hat das am 25.10. mit q222 abgenommen. Sein Eindruck vom 31.10. betrifft genau diesen Stand, darum **Hub-Frage statt stiller Umbau**.

### 6.3 Übergangszonen (der wichtigste Teil) [b]
`transition-profiles.v1.json`, `transition-atlas.v1.js:50–69`, Core `TRANSITION_WINDOWS:515`.
- **Achse:** `u = (s − s0)/(s1 − s0)`. Jede Schicht hat ein Fenster `[a, b]`, Gewicht `w = smoothstep(a, b, u)`. Seitenverzug `sideLag` je Seite (0,05–0,08).
- **Schichten:** `road, mark_track, mark_city, barrier, curb, sidewalk, props, embank, ditch, fence, nature, light, vfx, pit`.

| Familie | Reihenfolge der Fenster (Auszug) |
|---|---|
| A Strecke→Stadt, 100 m | barrier .00–.55 · road .05–.72 · mark_track .10–.55 · curb .28–1 · light .30–.90 · sidewalk .40–1 · mark_city .45–.82 · props .55–1 |
| B Strecke→Natur, 90 m | barrier 0–.5 · embank .08–.62 · road .12–.70 · ditch .35–.80 · nature .35–1 · fence .50–.95 · props .60–1 |
| C Natur→Strecke, 95 m (**keine Spiegelkopie**) | props 0–.30 · fence 0–.40 · nature 0–.55 · ditch .10–.50 · road .20–.75 · barrier .25–.80 · embank .30–.85 · mark_track .55–1 |

- **Vier Verfahren, nie Alpha:** Knetflecken (Farbe), abtauchende Segmente (Markierung), wachsende Masse (Sockel, Böschung), Stein-für-Stein-Schwelle (Bordstein, Platten). Dazu Lichtstimmung je Biom, mit `lerp 0,06` nachgezogen (`A.mood`, ±5 %).
- **`kfbBlend`** (`road-markings.m1.js:15–24`): Differenz zweier Gauß-Kugelfelder, Schwelle `k(w)` für Deckung ≈ w, Zelle 1,7 m (Fahrbahn), 1,7 (Strang), 2,4 (Damm), dünner dunkler Rand `1 − 0,12·rim`. Bilder `45_`, `46_`, `42_`.
- **Böschung:** Rücken wächst aus dem Tisch unter den Strang, Graben, Zaunsockel, Zaun, dann Wiese, Bilder `42_`, `43_`. Farbpatch `dam` Graben/Hügel.
- **Warum:** Weil jede Ebene ihre eigene Zeit hat, gibt es keine Linie, an der „die Welt wechselt“. Die Fahrkamera erlebt eine Abfolge, die sich erklärt: erst die Kante, dann der Belag, dann die Stadt.

**Spiel heute:**
- `kfb-speckle-transition.v1` (V-403) ist das eine Übergangsmodul, `kfbBlend` ist dort als Vorgänger benannt und läuft mit.
- Es ersetzt die **Farbfunktion**, nicht das Prinzip: **Schichtfenster gibt es im Spiel nicht.** Biomgrenzen sind Gewichte im Shader plus Bewuchs je Biom. Gebaut wird nichts gestaffelt.

**Bekannte Fehler:** feste `s`-Zonen. Knetflecken am Strang lesen stellenweise als Tarnmuster (Bild `17_` unten, `30_`). Stadtsockel endet in Rundlappen mit hartem Rand auf dem Tisch, von oben als Streifen lesbar (`41_`).

**Integration:**
- *Fenster: 1:1 die Daten, anpassen die Achse.* Modul `kfb-zone-windows`: Eingabe `u` aus Straßen-`s` oder **Abstand zum Viertelrand** (`keepout`, Kartenviertel), Ausgabe `w(layer, u, seite)`. `kfb-place` fragt Fenster als Dichte ab, `kfb-pavement` als Schwelle, Terrain als Sprenkelgewicht. **Owner:** Spielsitzung WS-Verteiler. **Schalter:** `zone=r1`. **Größe M.** **Prüfung:** Standbild alle 10 m entlang einer Einfahrt, keine Schicht springt, keine zwei beginnen am selben Punkt.
- *Ruhiger Boden: anpassen.* Schalter `ground=j17`: je Zone Grundton ≥ 60 %, Bänder Ton-in-Ton oder nur in Übergangsbändern, `calm` nutzt vorhandene Uniform. **Owner:** WS1 (Look) oder WS0-Sitzung. **Größe S.** **Prüfung:** Bildpaar plus Farbton-Entropie ≤ 1,7 aus Fahrkamera ohne HUD. **Abhängigkeit zu Verteiler:** Bodenalbedo (`place=r2`) bezieht sich auf den Boden. Auf ruhigem Boden braucht es Kontaktton statt Bänderfarbe. Vor Standard prüfen.
- *Knetfleck gegen Sprenkel:* V-403 bleibt, nur A/B-Bild zeigen (`fleck=kfb` mit Original-GLSL). Größe S.

---

## 7 · Licht, Schatten, Knete, Tusche, Kamera, Himmel

**Licht [b]** `track-look.v5.js:126–129`, `transition-profiles#light`, `lean-pass.l2.js`: Sonne `#fff4e6` 2,9 (Azimut −53°, Höhe 49°), Hemisphäre `#eef4fa/#9a8a78` 1,05, Gegenlicht `#ffe6d6` 0,6 von schräg hinten, ACES. Biome ±5 %. **Spiel:** Tagwerte stehen als `lset=r2` in `kfb-stage-light` („src J17“), Standard ist `mesa` (V-402: Sonne 2,4, Hemi 0,82 bläulich). Gegenlicht entfernt (V-392). **Sofort testbar ohne Code** mit `lset=r2`. Größe S.

**Schatten [b]:** `makeShadowFollow`: Radius in 8-m-Stufen, Mitte aufs Texelraster, `normalBias 1,2·Texel`, 4096, r 152, 70 m voraus, Texel 7,4 cm. `flatNoCast`: Gehweg, Bordstein, Sockel, Markierung, Fahrbahn, Gelände werfen nicht. **Nicht übernehmen:** der globale Schattensaum (Georg) und den 150-m-Kasten. `flatNoCast` ist die brauchbare Lehre: bei Bodenmassen Schatten aus. Spiel hat `fitShadow`, `shadowProxy`, `measureShadowSeam`. r186 meldet `PCFSoftShadowMap` entfernt, Bilder also mit PCF.

**Knete [b]:** v10 mit drei Werkzeugkarten, je Masse Mix aus `fan, smear, crease, dent, thumb, roll`. **Das Handmaß ist das Geheimnis:** `K = 3`, also Hand 1,5 m, Kachel 4,8 m, Abdruck 13,5 m. Spuren in **Weltgröße**, viel größer als realistisch, weil sie aus 10–100 m lesbar sein sollen. Fahrbahn bewusst ohne Werkzeuge (`legacy 1`). Fingerabdrücke `Fingerprints01_3K.png` (auch `lab-hud/fingerprints-512.png`). Sheen im Leicht-Profil aus. **Spiel:** `kfb-clay v1.1` ist objektrelativ, ohne Textur (`scaleRef`), Bänder in Bildanteilen. Terrain-Relief wirkt dadurch fein. **Integration: Prinzip.** `kfb-clay v1.2`, Profil `world`: absolute Spurgröße 1–5 m für Boden, Strang, Häuser. Kein v10-Import (V-429). Owner WS0 (SSOT), Größe S–M, Prüfung Bildpaar `13_`, `36_`.

**Tusche [b]:** In Joyride **keine** (kein Outline-Pass, kein Toon). Einzige Linie ist der Fleckrand `1 − 0,12·rim`. Spiel hat Figuren-Outline und Kartenkante. Für die Welt also keine Tusche nötig; die Formen lesen über Licht. Das spricht für V-1100 q334 (dünner). Georgs Urteil.

**Kamera [b]** `joyride-drive.j10.js:321–332`, `joyride.j06.json#drive.camera`: Wunschlage auf der **Schiene** bei `s − boom`, `boom 9 + 3,4·sp`, Höhe `3,5 + 0,9·sp`, seitlich Mitfolge 0,6, Korridorgrenze `half + 2,4`, Folgerate 9/s, Blick 11 m voraus und 1,2 m hoch, `up` folgt der Fahrzeugnormale (daher Looping ohne Kipper), FOV `58 + 14·sp + 7 Boost`. Flug: `up` zurück auf Welt. Orbit mit Haus-Kugeln und Gelände. **Spiel:** `followCam` (V-408) ist gefedert und frei, aber nicht schienengeführt, Boost-FOV `add 0,1`. **Integration:** nur mit Strecke, `chase`-Teil 1:1, mit Abstand nach Fahrzeuglänge (Punkt 4 aus `RETURN`). Größe S nach §5. Kein Umbau von `followCam` im Gelände.

**Himmel [b]:** Einfarbiger Hintergrund plus `Fog(700, 1900)` im selben Ton, **Knet-Wolken** aus 4–6 Kugeln bei 85–145 m, werfen nichts (Bild `47_`). **Spiel:** gemalter Kuppelhimmel (`sky-r13`, `sky3`), WS-Himmel läuft. **Nicht** ersetzen. Prinzip: Himmel ruhig halten, weil er die entsättigte Gegenfläche ist. Als Zugabe Knetwolken als Weltobjekte (WS-Himmel, S), Bild `47_`.

---

## 8 · Weiteres, das gut ist und fehlt

| Baustein | Wo | Warum gut | Spiel | Weg · Owner · Größe |
|---|---|---|---|---|
| **Tafeltürme** (3–5 Kissenblöcke, je verdreht, versetzt, schrumpfend 0,62–0,8, Kuppe zu 60 %, Bild `44_`) | `track-look:364–368` | Fernzeichen aus einfacher Grammatik, 12 Stück reichen für die ganze Welt | fehlt | Generator 1:1 als WSB-Bake, Landmarken-Slot, **nicht** `kfb-place` (V-708) · WSB/WS0 · S |
| **Hügel** (schiefe Kugeln: `x + lean·x·y²`) | `:359–362` | ein Formwort | Höhenfeld anders | Prinzip · S |
| **Rollgelände** um die Strecke (flach bis 28 m, steigt bis 115 m, Dekor wird mitgehoben) | `j10:47–70` | Strecke sitzt, Ferne rollt | hat eigenes | Prinzip für §5 |
| **Knet-VFX** (24 Profile: 6 Ereignisse × 4 Biome, Kugel/Tropfen/Span, pooled, 200 max, Bild `59_`) | `lab-vfx/` | Biomfarbe im Krümel, Rad-Emitter aus Modell | `dustTrail` als Partikel, V-767 Mix | Krümel als Zweitstufe bei Drift und Landung · WS1 · S |
| **Knetgummi-Wobble** | `lean-pass:94` | Bande lebt | fehlt | 1:1 mit Strecke, auch für Wände · S |
| **Radkontakt `fitWheels`** | `j10:168` | jedes Modell passt | J-7 hat eigene Anker | Abgleich nur |
| **Tafel als Pappaufsteller** mit Holz, Kraftpapier, Sandsäcke, gestützt (Bild `60_`) | `j10:176–214` | Karten stehen im Knet-Kosmos | `RoadsideBoards` (V-840) | Details anpassen: Sandsäcke, Stütze · S |
| **Tunnelkit** TC1: 4 Looks, Module, Portal, Einbaufreiheit (Bild `39_`, `55_`, `56_`) | `tunnel-clay.tc1.js` | Farb-Bänder, Lampen, klare Reihen | fehlt, V-100, V-985 | 1:1 als Generator, bei Tunnel-Slice · M |
| **Last-Wächter**, `dprAuto`, `chunkify` | `track-look:496`, `j10:143` | robust | teils `perfBudget` | Vergleich reicht |
| **M2-Regelwerk Markierung** als Daten | `road-markings.m2.json` | Regelwerk real ×2 / ×2,5, Takt-Auslauf, Stärke-Keil | fehlt | Spec für Stadtstraßen, auch ohne Strecke · S |
| **Bühne je Welt** mit `setWorld` färbt Knete in einem Griff | `track-look:472` | Rollen sind live | `paletteGen` ähnlich | gleich |
| **Quelle neben Knete** (Bild `20_`) | `j10:95` | ehrliches Gate | Proof Stage | Gate-Vorlage |

---

## 9 · Reihenfolge der Integration

Reihenfolge nach Wirkung ÷ Aufwand. Alles nach Georgs Auswahl im Hub und hinter Schalter (V-1108).

| # | Was | Größe | Hängt an | Owner |
|---|---|---|---|---|
| 0 | **Test ohne Bau:** `lset=r2` und `calm=1` im Spiel, gleiche Kamera wie `50_`, Bildpaar | – | – | WS0 |
| 1 | **Ruhiger Boden** `ground=j17` (§6.3) | S | 0 | WS1 oder WS0-Sitzung |
| 2 | **Gruppen mit Luft** (§2): Freifläche, Sichtachse, Abstandsbänder | S | Verteiler | **WS-Verteiler läuft** |
| 3 | **Knete Weltmaß** `kfb-clay v1.2 world` (§7) | S–M | 1 | WS0 |
| 4 | **Bürgersteig** `kfb-pavement` (§3), Reihen, Lippe, Sockel, Viereck | M | `pavement.js` | **WS-Design läuft** |
| 5 | **Übergangsfenster** `zone=r1` (§6.3) | M | 1, 4, Verteiler | WS-Verteiler |
| 6 | **Fassaden-Bake** (§4) | M | – | WSB, dann WS-Design |
| 7 | **Knetbaum** ohne Fuß (§1) und **Tafeltürme** (§8) | M/S | 1 (Palette) | WSB, Kachel WS-Verteiler |
| 8 | **Stadtbild** Möbeltakt und Baulinie als Löser-Daten | S | 4, 6, street-plan @99d21e57 | WS-Verteiler |
| 9 | **Strecke:** Core, Mesh, Schiene, Einfädler, Einbettung (§5) | L | 1, 5 | neue WS-Strecke |
| 10 | Rollercoaster-Stücke, Drive-Modi, weitere Fahrzeuge | M | 9, WSB (Steh-Pose) | WS-Strecke, WSB |
| 11 | Tunnelkit TC1 | M | V-985 oder 9 | WS0-Slice |

**Passt jetzt hinein:**
- **WS-Verteiler** (`world/verteiler-r1`, `place=r2`, Hub q333 KEEP als Richtung): Punkt 2 und später 5, 8. Direkt mitgeben: Sichtachsen-Regel, Abstandsbänder, Prop-Wache `deck/tunnel`. Warnung: Bodenalbedo ist auf den Bänderboden eingestellt, Punkt 1 kann sie verschieben.
- **WS-Design** (`design/kartengebaeude-r1`, Schalter `viertel`): V-1057 läuft schon mit Joyride-Fugen. Punkt 4 ist die Fortsetzung; Punkt 6 sollte die Kit-Häuser dort versorgen. Es sollte nicht in `streets.js` zurückfallen. `pavement.js:block()` ist der Gizmo-Einstieg.

---

## 10 · Nicht geprüft

- fps auf Georgs Gerät. Lauf hier headless in nicht sichtbarem Fenster, 7–38 fps, nur Größenordnung (Memory: rAF misst GPU nicht).
- three r160 (Original) konnte nicht laufen, weil keine Downloads. Bilder sind r186 per Lab-Patch. Abgleich mit `chase-curve.jpg` und `chase-straight.jpg`: gleiche Farben und Formen, keine echte Pixelprüfung.
- `lab-track/data/td03.stream.json`, `J16 Standalone`, `KFB Knet-Strecke T3 v3`, `KFB Joyride 01` nicht gestartet, nur Listen und Hashes. Racetrack Kit nicht gelesen (nur Ordnerliste, Core-Herkunft `TRACK-CORE/S13_V012`).
- Spiel selbst nicht gestartet. Bilder sind vorhandene Testausgaben: `90_` mit HUD vom 27.10., `91_`, `92_`, `93_` aus WS-Verteiler und WS-Design. Für Bäume und Fahrt deshalb kein gleicher Ausschnitt.
- Spiel-Dichte nicht gezählt, Hausdiagonale in §4 nicht je Teil gemessen.
- `road-markings.m1.js` nur Kopf und `kfbBlend`, `cabrio-seat.j17.js` und Fuß-Schicht nur über `RETURN.md`, `clay-relief.v4` und `clay-material.v10` nur Kopf und Schnittstellen.

---

## 11 · Bilder (`replies/JOYRIDE_BESTAND_R1/`)

| Nr. | Motiv |
|---|---|
| `01_`–`03b_` | Baum gesamt, Fuß-Platte, Krone, Dreiergruppe |
| `13_`–`17_` | Bordstein nah, Gehweg gerade, Rundung Aufsicht, Rundung außen, Staffel Strecke→Stadt |
| `18_`–`24_` | Stadtbild, Fußgängerblick, Quelle/Knete, Fassade nah, Sockel, Möbel |
| `30_`–`39d_` | Markierung Strang, Magnet, Boost, Stützen, Kicker, Roof-Loop, Prallwulst, Rippen, Looping 60 m, Tunnel, Helix, Hero, Sprungstück |
| `40_`–`49b_` | Übersicht, Totale, Natur, Rückkehr, Tafelturm, Knetflecken, Strang→Wiese, Wolken, Welten Bucht und O-Town |
| `50_`–`59_` | Verfolger Stadt, Kurve, Magnet, Looping, Tunnel, Skydrive, Hero, Kicker, Boost |
| `60_`–`62_` | Tafel, Probenbrett, Quellenbank |
| `90_`–`93_` | Spiel heute: Fahrt mit Bändern, Boden Heute/Neu, Bordstein WS-Design, Ecke nah |
