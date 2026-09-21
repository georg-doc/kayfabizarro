# LIVING · Rigging-Linie

*Stand 13.09.2026. Das ist ab jetzt das **eine** Stand-Dokument dieser Linie. `ONBOARDING_frischer_chat.md`
und `POSTMORTEM_carlrig_v4_16B.md` bleiben als Archiv daneben stehen und werden nicht mehr fortgeschrieben.*

## Übergabe

**CapsuleCarl wird jetzt an einer Oberfläche geriggt, nicht mehr an einem Beweis-Blatt.**
`KFB Rigging Lab v1.dc.html` lädt Carl, ebnet die Mundmulde ein, montiert das PetStudio-Gesicht und
stellt genau drei Gruppen Regler: Augen, Mund, Zonen. Dazu Zurücksetzen je Gruppe und eine
Einstellung, die als Datei herausfällt (`kfb-carl-rig-v6.json`) und zwischen zwei Besuchen im Browser
liegen bleibt. Kein Katalog, keine Clips, keine Messblätter — das war die Lehre aus v4 und 16B.

Daneben liegt `v17/` als 1:1-Kopie von FrankenStein Studio 16 aus dem Repo, 59 Dateien, nur die
Einstiegsdatei umbenannt.

**Was als Nächstes ansteht:** Georgs Urteil über Augengröße, Augenabstand und den Mund-Decal. Beides
sind bisher **Ablesungen**, keine Abstimmungen — deshalb gibt es jetzt Regler dafür und keine weitere
Zahl von mir.

---

## Wohin das geht · Briefing Wissens-Pilli v0.1

Gelesen am 13.09.:
`travel/wip/travel_globe_wsa/_inbox/DC MicroLearning WS1/BRIEFING_STUDIO_Wissens-Pilli_Preparation_v0.1.md`

**Diese Werkbank IST die Studio-Scheibe.** CapsuleCarl wird als **Wissens-Pilli** zum
wiederverwendbaren Präsentator-Schauspieler für ein 16:9-Lern-Embed. Studio baut **nicht** die
Lern-App, keine Karten, keine TTS, keine fertigen Animationen. Studio besitzt: Quellprüfung,
Gesichts-Eigentum, Augen/Pupillen/Lider, Mund-Eigentum und -Anker, Material- und Schwierigkeitszonen,
Schaden-Requisiten, Sprechblasen-Anker, Blickziele, deformationssicheren Ruhezustand, die
**exportierbare Schauspieler-Konfiguration** und die Sicht-Abnahme.

Zwei Regeln aus dem Briefing, die zu dem passen, was hier ohnehin gilt:
- **»Do not invent a skeleton merely because the character must move.«** Statischer Körper plus
  Cartoon-Deformer ist gewollt. Genau der Befund aus dem Post mortem.
- **Ein Eigentümer je sichtbarem Gesichtssystem.** Der Mund ist damit entschieden: Weg **B** —
  das KFB-Modul ist Eigentümer, die Originalgeometrie wird eingeebnet und ausgeblendet, **niemals
  beide gerendert**. Das ist gebaut (R3–R6). »Do not delete source geometry destructively« ist
  ebenfalls erfüllt: die Datei bleibt unberührt.

**Die Lieferung ist Konfiguration, nicht Geometrie** — `actor/wissens-pilli.actor.json`,
`.anchors.json`, `.states.json` unter `micro-learning/wissens-pilli/`. Ein GLB nur als
nicht-zerstörendes Derivat, wenn es wirklich gebraucht wird.

### Was die Werkbank vom Abnahme-Tor (§17) heute schon kann

| # | Gefordert | Stand hier |
|---|---|---|
| 1 | Schwierigkeit umfärben | Zonenfarben sind da und reversibel — aber **ohne** die semantischen Fächer `basic / intermediate / advanced / neutral` |
| 2 | Pupillen sicher bewegen | EyeRig-Tracking läuft (`track` 0,04); **Blickziele nicht ausgemessen** |
| 3 | Blinken | Lider sind da und öffnen; **kein Blink-Griff in der Oberfläche** |
| 4 | Mund öffnen/schließen | Viseme-Griffe da, `red` als Satz gesetzt |
| 5 | Blick auf Karte und Nutzer | **fehlt** — `card-left/center/right`, `user-camera` |
| 6 | Schaden-Requisiten schalten | Zonen an/aus ist genau das; die Namen unterscheiden Platten, Pfeile und Spitzen. **Stabile IDs fehlen** — der Inselindex wäre der Kandidat, er ist je Quelldatei stabil |
| 7 | Sprechblasen-Anker | **fehlt** |
| 8 | Sichere Stauchung / Neigung | **fehlt** — Deformer ist nicht angefasst |
| 9 | Sauberer Ruhezustand | implizit vorhanden, nicht benannt |

**Noch kein Auftrag.** Der Export heißt heute `kfb.carl.rig/6` und hat eine andere Form als
`kfb.wissens-pilli.actor/0.1`. Ob die Werkbank auf das Schauspieler-Schema umgestellt wird oder
daneben exportiert, ist eine Entscheidung, keine Messung.

## Das Verfahren, in sechs Schritten

Der wiederverwendbare Teil. Es gilt für jede statische Figur ohne Knochen, nicht nur für Carl.

| # | Schritt | Werkzeug | Was dabei gilt |
|---|---|---|---|
| 1 | Laden und in Inseln trennen | `lab-v2/audit.js` → `lab-v4/carlrig.js` `splitIslands` | Insel #1 ist der Körper und **muss** `body` heißen. Das ist der Vertrag, an dem alle Gesichtsteile hängen. |
| 2 | Ansehen, bevor gemessen wird | Kamera-Vorgaben, Nahaufnahmen | Betrifft die Frage eine Form, ist die erste Messung ein Bild. Drei Mundanläufe sind an dieser Regel gescheitert. |
| 3 | Fläche heilen, nicht zudecken | `flattenRecesses` | Ein Deckel auf einer gekrümmten Fläche ist eine andere Fläche. Die gemessenen Muldenpunkte wandern auf die gemessene Kapselfläche, Normalen analytisch, dann über Position verschweißt. Die Datei bleibt unberührt. |
| 4 | Was in der alten Höhle lag, ausblenden | `partsInsideBoxes` | Die Ausblende-Kiste kommt aus dem **tiefen Kern** der Mulde, nicht aus dem geglätteten Bereich — sonst verschluckt sie die Panzerplatten. |
| 5 | Gesicht montieren | `buildFace` + die fünf PetStudio-Module | `EyeRig` baut nicht im Konstruktor und öffnet die Lider nicht in `build()`. **Ohne `update(dt)` im Bildlauf sind die Augen zu.** |
| 6 | Anker ablesen, nicht erben | C0-Katalog der Inseln | Die Vorgaben der Module sind auf FrizzleBobs Kopf geeicht. Auf einem anderen Wirt sind sie falsch, nicht nur ungenau. |

**Der Griff, der in Schritt 6 immer gebraucht wird:** die Module haben Setter für den Betrieb —
`EyeRig.setAnchor / setEye / setLashes`, `PetMouth.setParams / setSet / setViseme`,
`BrowRig.set / NoseRig.set / MoustacheRig.set` plus `sync()`. Jeder Setter ruft intern `build()`.
Ein Regler darf sie darum nicht je Ereignis rufen: v6 sammelt die Änderungen und wendet sie **einmal
je Bild** an.

---

## Entscheidungen

**R1 · Messwerkzeug und Rigging-Werkzeug sind zwei Gegenstände.** (13.09., Georg: »mit diesem UI kann
ich noch weniger anfangen.«) v6 zeigt keine Datenspalte, keinen Beweisbogen, keine Bindungszahlen.
Was gemessen werden muss, wird woanders gemessen.

**R2 · ~~v6 baut auf v1s Oberfläche~~ — aufgehoben durch R12.** Galt bis 13.09. abends: dunkle
Schale, IBM Plex, warme Bühne `#dedbd4`. Steht hier, weil die Belegbilder bis `v6-11` so aussehen.

**R3 · Eine Figur, keine Liste.** (Georgs Wahl A, 13.09.) Katalog und Clips kommen später und dürfen
die Rigging-Ansicht nicht wieder in ein Panel-Werkzeug verwandeln.

**R4 · Der Mund-Decal wird gemessen angesetzt.** `MOUTH_DEFAULTS` (size 0,44 · dy −0,52) sind auf
FrizzleBobs Schnauze geeicht und legen auf Carl ein halbes Gesicht. v6 leitet Größe und Höhe aus der
eben eingeebneten Mulde ab, in PetMouths eigenen Einheiten: `U` = halbe Body-Höhe,
`dy = (Muldenmitte − Body-Mitte) / U`, `size = Muldenbreite / (U · 274/169)`. Das ist derselbe
Vorgang wie beim Augenanker: ablesen statt erben. **Ein Urteil ist es damit nicht** — dafür sind die
zwei Regler da.

**R5 · Zonenfarben liegen in der Einstellung, nicht im Modell.** `setZoneStyle(part, {hidden, color})`,
`color: null` gibt die Original-Bildtafel zurück. Ein Textur-**Tausch** je Zone ist nicht gebaut.

**R6 · Der zweite Mund ist aufgemalt und wird in der Bildtafel übermalt.** (Georg, 13.09.: »da scheint
ein Mund-Artefakt aus Original zu überlagern.«) Das Netz ist seit der Einebnung glatt — die Farbe
zeigte weiter Zähne und Lippen. `lab-v6/texclean.js` malt die **gemessene** Mundregion in der Tafel
zu, zur Laufzeit, Quelldatei unberührt. Zwei Griffe, die den Unterschied machen: es werden die
**Dreiecke** der Region gefüllt, nicht ihre Hüllkiste (eine Bildtafel ist ein Atlas — ein Rechteck in
UV-Raum trifft fremde Inseln mit); und die Füllfarbe ist ein **Median** über verteilte Stichpunkte
außerhalb der Region, weil ein Mittelwert von den aufgemalten Extremen weggezogen wird. Knopf
`Paint` schaltet zurück auf die Originaltafel. Dasselbe Verfahren war im Projekt schon bezahlt:
`lab-v2/assets/driver_texture_kfb.png`, die beiden GoGoGo-Aufdrucke.

**R7 · Die angeklickte Zone leuchtet im Modell, sie wird nicht umgefärbt.** (Georg, 13.09.)
Eigenleuchten in der Akzentfarbe, 0,34 bei Auswahl, 0,6 beim Überfahren. Eine Farbüberschreibung
hätte die eingestellte Zonenfarbe und die Bildtafel verdeckt und wäre nach dem Abwählen nicht sicher
zurückzunehmen — genau der Fehler, der in der ersten Fassung als `hilite()` drinstand. Startzustand
ist jetzt **keine** Auswahl; die Farbpalette erscheint erst mit einer gewählten Zone.

**R8 · Die Namen der Teile nennen Form und gemessenen Ort, nicht Anatomie.** (Georg, 13.09.)
Das Modell benennt seine Inseln nicht — 1 Netz, 1 Material, 21 Inseln. Die erste Fassung riet
Anatomie (`arrow`, `plate`, `eye piece`) und lieferte für **11 von 21** Inseln den nackten Rückfall
`part L 3` — und für Carls Pupillen den Namen `tooth`. Ein Name, der falsch sein kann, ohne dass man
es sieht, ist schlimmer als eine Nummer.

`lab-v6/zonenames.v3.js` benennt darum nach **Form** (`plate` · `spike` · `block`, aus den Maßen)
und **Ort** (senkrechtes Band × Richtung × Seite, aus dem Mittelpunkt):
`block · lower front L`, `plate · top side L`, `spike · lower back, outboard`. Beides ist am
Tooltip nachrechenbar, es gibt keinen Rückfall-Namen. Zwei Ausnahmen tragen echte Namen, weil sie
**gemessen** sind: `tooth` (liegt waagerecht UND senkrecht in der vermessenen Mundmulde) und
`pupil` (liegt am abgelesenen Augenanker). Ohne diese Trennung wandern Carls Pupillen unter
»tooth«, weil die Ausblende-Kiste gepolstert ist — genau der Fehler der ersten Fassung.
**Seitenbezeichnung: »L«/»R« sind aus Sicht der Figur** (sie schaut nach +z, also ist rechts −x) —
die Umkehrung ist der häufigste stille Fehler bei Seitennamen.

**R9 · Nie `flattened[0]` — immer die tiefste Mulde.** `flattenRecesses` sortiert seinen Bericht
nach **Punktzahl**, nicht nach Tiefe. `flattened[0]` war bei Carl eine **0,0048 u** flache Delle über
**0,866 u** Breite, also die halbe Vorderseite. Daran hingen zwei Fehler gleichzeitig: der Mund kam
0,866 u breit und auf Bauchhöhe heraus (dy 0), und die Mund-Kamera zielte auf den Bauch und stand so
nah, dass die vordere Schnittebene die Kapsel aufschnitt — das Bild war ein schwarzer Balken.
Genommen wird die Mulde mit dem größten `maxInset`: **0,1865 u**, die im Post mortem belegte.
Die Höhe kommt aus Carls **eigenen Zähnen** (Inseln 9/10, y 1,105), wenn er welche in der Mulde hat —
sie liegen genauer als die Hüllkiste der Mulde, die nach unten ausläuft.
Ergebnis: `size 0,255 · dy 0,105`, Mund 0,414 u breit an y 1,105.

**R10 · Ein versioniertes Modul heißt `.vN.js`.** Eine überschriebene `zonenames.js` blieb im
Zwischenspeicher des Browsers liegen; die Seite lief minutenlang mit der alten Fassung, während der
Quelltext schon die neue war. Neue Fassung, neuer Dateiname — wie `pet-eye-rig.v6.js` und
`ears.v2.js` es im Projekt ohnehin halten. Gilt auch für eine reine Wortänderung: v3 unterscheidet
sich von v2 nur im Regel-Text (`block` sagt jetzt »no dominant axis« mit beiden Verhältnissen,
statt »roughly equal dims« über einer gemessenen 2,6:1-Insel) — und wäre als stille Überschreibung
genau so im Zwischenspeicher hängen geblieben.

**R12 · Der Rahmen läuft auf dem DocCheck Design System, die Bühne bleibt neutral.**
(Georg, 13.09., Fassung B — hebt R2 auf.) Geladen wird
`_ds/…/colors_and_type.css` plus Bundle; alle Farben, Schriften, Abstände und Radien kommen aus den
Tokens. Roter Markenbalken mit Roboto-Slab-Wortmarke, weiße Flächen, Zonenliste als
Haarlinien-Zeilen (`1px solid #eee`), Chips als `--radius-pill`, Farbfelder als Kreise,
Abstände auf 5/10/20, Radien 3/5 px.

Drei bewusste Abweichungen, jede mit Grund:
1. **Die 3D-Bühne bleibt neutral** (`--dc-bg-grey`, ein Token) — auf DC-Rot ist ein oranges Modell
   nicht zu beurteilen. Ausdrücklich so beauftragt.
2. **Zahlenspalten in `--font-mono`.** Messwerte ohne feste Laufweite lassen sich nicht
   untereinander vergleichen.
3. **Der Primärknopf trägt SCHWARZE Schrift auf `--dc-green`**, nicht das weiße `.dc-btn`.
   Weiß auf `#9c3` sind **1,9:1**; schwarz sind **10,5:1**, und `#000` ist ohnehin die Textfarbe
   des Systems. Gemessen: `saveBg rgb(153,204,51)` / `saveColor rgb(0,0,0)`.

Kein 100-px-Markenbalken: der gehört zu Seiten mit 100-px-Stegen, hier wären es 16 % eines
628-px-Fensters. Der Balken ist 52 px hoch und behält Farbe, Wortmarke und Schrift.

**R14 · `--color-fg-muted` (#888) trägt keine Zahlen und keine Bedienbeschriftungen.** Gemessen
lagen fünf Klassen Text im Panel darunter: die Regler-Anzeigen (3,54:1), die Abschnitts-Überschriften
(3,54:1), die Zonennummern (3,54:1), die Beschriftung ausgeblendeter Zonen (3,54:1) und die
`Off`-Knöpfe (3,06:1 auf `#eee`) — alle bei 11–13 px, also ohne Anspruch auf die 3:1-Ausnahme für
Schlagzeilengröße. Ausgerechnet die Regler-Anzeigen sind dieselbe Art Inhalt, die einen Schritt
weiter links schon einmal beanstandet wurde: gemessene Zahlen sind der Zweck dieser Werkbank.
Getauscht auf `--color-fg-subtle` (#666) — **5,74:1** auf Weiß, **4,95:1** auf `#eee`. Das ist ein
Tausch INNERHALB des Systems, kein Abweichen davon: beide Token waren schon definiert.
`#888` bleibt nur, wo etwas wirklich Zierde ist — im Panel ist davon nichts übrig.

**Nachtrag 13.09. abends:** die Regel ist beim ersten neuen Text sofort wieder gebrochen worden. Der
Hinweis »on/off in the header« im Bart-Abschnitt kam NACH dem Sammeltausch und stand darum wieder auf
`#888` (3,54:1) — und er ist Bedienhinweis, nicht Zierde. Lehre: ein Sammeltausch räumt den Bestand
auf, aber er hält nichts. **Neuer Text im Panel nimmt `--color-fg-subtle`, nicht `--color-fg-muted`** —
letzteres ist im Panel für nichts mehr zuständig.

**R13 · `accent-color` statt `::-webkit-slider-thumb`.** Die Engine entprefixt
`-webkit-appearance` beim Parsen; die Pseudo-Regel greift dann nicht und der graue Systemkreis
bleibt stehen — gemessen, die Regel war live und wirkte trotzdem nicht.
`accent-color: var(--dc-red)` ist Standard, färbt Griff und Spur, und ist eine Zeile statt fünf.
Gegengemessen: `accentColor rgb(204,0,51)`. **Achtung:** der Aufnahme-Nachzeichner stellt
`accent-color` nicht dar — auf Belegbildern sehen die Griffe grau aus, in der Seite sind sie rot.

**R11 · Text auf der 3D-Bühne bekommt einen eigenen Grund.** Die Stempelzeile war dreimal
unleserlich, dreimal aus einem anderen Grund: abgeschnitten durch `nowrap`, dann unter den
Kameraknöpfen, dann quer über Carls Körper bei **2,3:1** Kontrast. Ein Platz mit »gerade freien
Pixeln« ist keine Lösung, weil die Kamera sich dreht. Die Zeile sitzt jetzt auf
`rgba(23,24,26,.78)` mit `width:max-content` — lesbar gegen Grund, Modell und jede Kameralage.

---

## Register

*(R12 und die drei Urteile vom 13.09. abends stehen oben bei den Entscheidungen.)*

### Was die Werkbank anschließt

| Datei | Rolle |
|---|---|
| `lab-v4/carlrig.js` | Rig-Kern. Für neuen Code gilt ausschließlich `flattenRecesses`; `patchOpenings` und `closeMouth` bleiben als dokumentierte Irrwege stehen. |
| `lab-v2/audit.js` · `lab-v2/sources.js` | Laden, Inselerkennung, gepinnte Quelle. |
| `lab-v2/vendor/petstudio-v9/studio-v12/` | `pet-eye-rig.v6` · `brow-rig.v2` · `pet-nose.v2` · `pet-moustache.v1` — unberührtes WS0-Eigentum. |
| `lab-v2/vendor/petstudio-v9/studio-v3/pet-mouth.v1.js` | Mund als Textursatz, drei Sätze (male · female · red), Regler-Metadaten `MOUTH_META`. |
| `lab-v6/texclean.js` | Übermalt eine gemessene Region einer Bildtafel, dreieckweise, Füllfarbe als Median. Neu, R6. |
| `lab-v6/partrig.v1.js` | Riggt eine ORIGINAL-Insel: sichtbar, um ihre eigene Mitte skaliert, verschoben, gekippt. Paare gespiegelt. Trägt Braue und Nase — und ist der Griff für den FB-Driver-Graft. Neu, R18. |
| `lab-v6/inkform.v1.js` | Baut Schlauch-Formen, die an der Maske GESCHLOSSEN sind (Läufe + Deckel). Von Braue und Bart gemeinsam benutzt. Neu, R19. |
| `lab-v6/brow.v3.js` · `lab-v6/stache.v3.js` | Unterklassen von BrowRig und MoustacheRig, die nur `rebuild()` ersetzen und die Form über `inkform` bauen. Vendor unberührt. |
| `lab-v6/zonenames.v4.js` | Inselnamen nach Form und gemessenem Ort, mit mitgeführter Regel. Neu, R8. |
| `carl-proof.html` | Beweis-Blatt. Ladeweg und Kamera-Vorgaben von v6 sind von dort 1:1 übernommen. |

### Die drei Rigs, die Georg als Nächstes genannt hat — was davon vorhanden ist

**Klo-Rolli · vollständig vorhanden.** `v17/petstudio-v9/studio-v10/KloRolli.js`, 57 173 Byte, bringt
alle fünf Teile mit: Rolle aus `Toilet Paper Roll.glb`, Nagel, Augen (EyeRig auf einer unsichtbaren
Box am Nagel-Pivot), Mund als gebogene Lippenschale, und das Verlet-Blatt mit Zug-, Dreh- und
Riss-Gestik. Studio v17 ruft das Modul bereits auf; der Roster-Eintrag heißt `klo-rolli`, Art
`hanging`. Der Wirt setzt nur die Bodenhöhe (`setGroundY`) — das Modul kennt keine Bühne.
**Hier wird nichts nachgebaut.**

**Recherchi · nicht vorhanden.** Null Treffer im ganzen Projekt, in beiden Studio-Fassungen und in
allen Vendor-Ordnern. Wenn das geriggt werden soll, fehlt zuerst die Quelle — Modell oder Modul.
Das ist ein Fund, keine Kleinigkeit.

**Waffe in der Kugel-Faust (FB-Driver-Graft) · teilweise vorhanden, Urteil offen.**
`lab-v4/weapons.js` (Handknochen nach Rang, Laufrichtung aus der gemessenen Blickrichtung Ferse→Zeh,
Lauflänge 2,0 × Unterarm, `WeaponHandoff.v1`), dazu `lab-v4/WEAPON_HOLDS.md` und
`lab-v4/POSTMORTEM_WEAPON_HOLD.md`. Auf der Studio-Seite liegen `studio-v12/weapon-mods.v1.js`
(Katalog, Skins, Handgriffe) und `gun-look.v4a.js` (Würfel-Palette der Waffe). **Achtung, bezahlte
Falle:** `weapon-mods.v1.js` lag monatelang im Vendor-Ordner, ohne dass es je gerufen wurde. Vor
»fehlt« wird nach dem **Aufrufer** gesucht, nicht nach dem Modul.

### Handgriff zum Ablesen

`window.__rig` in der laufenden Seite — `parts`, `face`, `heal`, `clean`, `names`, `view(n)` und
`report()`. Damit lässt sich der Stand ablesen, ohne die Oberfläche zu bedienen; dieselbe Rolle wie
`__proof` im Beweis-Blatt. Für Abnahmebilder und Fehlersuche.

### Zwei untaugliche Prüfungen, als Warnung

**»Der Mund rendert nicht« war zweimal ein Messfehler, kein Befund.** Wer `mouth.mesh.visible = false`
setzt und dann vergleicht, prüft nichts: `PetMouth.update(dt)` setzt in **jedem Bild**
`mesh.visible = this.enabled` zurück. Beide Aufnahmen zeigen denselben Zustand. Geschaltet wird über
`mouth.enabled`. Dazu kommt: der große schwarze Balken im Gesicht ist der **Walrus-Bart**, nicht der
Mund — zum Prüfen muss er aus.

**Ein DOM-Nachzeichner kann eine WebGL-Fläche nicht abbilden.** Für alles, was in der 3D-Bühne liegt,
gilt nur eine echte Pixelaufnahme.

**Die Aufnahme hält keinen Scroll-Stand.** Zwischen zwei Schritten lädt die Seite neu, ein gesetztes
`scrollTop` ist danach 0 — mehrere Bilder der »nicht scrollenden« Zonenliste waren allein das.
Gemessen scrollt sie: `scrollTop 900` gesetzt, `900` gelesen, `scrollHeight 1685` gegen
`clientHeight 576`. Für Zustände unterhalb des Falzes wird **gemessen**, nicht fotografiert.

### Der Abschneider in der Spalte, gemessen

Georgs Befund »die Sidebar schneidet ab« war echt und hatte eine Zahl: die Zonenzeile war **328 px**
breit bei **307 px** Spaltenbreite. Ursache war `width:100%` **plus** 10 px Polster **ohne**
`box-sizing:border-box` — 21 px Überstand, abgeschnitten wurden die on/off-Knöpfe am rechten Rand.
Behoben an drei Stellen: `box-sizing:border-box` und `min-width:0` auf der Zeile, `flex:1 1 auto`
plus `min-width:0` auf dem Namensfeld (damit es schrumpft statt zu drücken), und die Spalte selbst
auf `width:306px; max-width:46%; min-width:212px` — sie gibt jetzt in schmalen Fenstern nach,
anstatt die Bühne aufzufressen.

### Beweise

| Bild | Was es belegt |
|---|---|
| `screenshots/01…06-carl-mouth-closed.png` | Mund zu, ohne und mit Gesichts-Rig: keine Kante, keine Lücke, keine Naht; Panzerplatten unverändert. |
| `screenshots/v6-01-boot.png` | v6 kalt gestartet: Carl geriggt, Augen offen, Wimpern vorhanden, Mund-Decal noch in der Modul-Vorgabe. |
| `screenshots/01-v6-02-mouthseed.png` · `02-v6-02-mouthseed.png` | der **falsche** Mund-Ansatz aus `flattened[0]`, als Gegenprobe behalten (R9). |
| `screenshots/0{1,2,3}-v6-09-mouthtest.png` | Mund an / aus / an bei abgeschaltetem Bart: der Decal rendert. |
| `screenshots/03-v6-10-visemes.png` | `red`-Satz, Visem `ah` — klar lesbarer Mund an der gemessenen Stelle. Daneben `01-…` derselbe Griff mit `male`: fast unsichtbar. |
| `screenshots/01-v6-11-names.png` | Stand nach R9/R10, Mund an y 1,105 — letztes Bild der dunklen Schale. |
| `screenshots/01-v6-13-ds.png` | Rahmen auf DocCheck (R12): roter Balken, Roboto-Slab-Wortmarke, weiße Fläche, grüner Primärknopf. Mund im `red`-Satz. |
| `screenshots/03-v6-13-ds.png` | angeklickte Zone leuchtet in DC-Rot (R7 mit dem neuen Akzent) — der rechte Pfeil kippt nach Violett. |

### Zahlen, die gelten

```
Carl            KayKit_Mystery_Series6/CapsuleCarl/gltf/player.gltf — 1 Netz, 4772 Tris, 21 Inseln,
                0 Knochen, 0 Morphs, 0 Clips
Körperinsel     Kapsel r 0,500 u · Kappenmitten y 0,500 / 1,500 · Hülle 1,000 × 2,000 × 1,000 u
Randschleifen   12 — alle UV-Nähte, 0 echte Löcher
Mund            wasserdichte Mulde 0,1865 u tief → nach Einebnung Restabweichung 0 u,
                328 Punkte verschoben, Datei unberührt
Augenanker      dx 0,164 · dy 0,317 · ring 0,13 · track 0,04 (abgelesen an Insel #14/#15)
                lidFit 0,92 · pupilSize 0,40 · gloss 0,90 · Wimpern 0,45 / 7 / 1
Studio v17      59 Dateien, Quelle kayfabizarro @ main, Baum 3a9700fe
```

---

## Entschieden am 13.09. abends

| Frage | Georgs Urteil |
|---|---|
| Rahmen auf DocCheck umstellen? | **Ja, Fassung B** — Rahmen auf die Tokens, 3D-Bühne bleibt neutral. Als R12 ausgeführt. |
| Welcher Mund-Satz ist Carls? | **`red`** — ist jetzt der Startwert, auch nach »Reset«. male/female bleiben wählbar. |
| Carls aufgemalter Mund | **Übermalen bleibt an** — nur der Decal spricht. `Paint` an ist der Startzustand. |

## Gebaut am 13.09. abends · drei Griffe

**R15 · Die Messdaten-Bauchbinde liegt hinter dem »i« im Kopf.** (Georg) Sie war immer sichtbar und
hat drei Runden Leserlichkeit gekostet (R11). Jetzt ist sie aus, bis man sie holt — der Knopf steht
neben »Reset all« und leuchtet weiß, solange sie liegt.

**R16 · Die »block«-Braue wird aus Carls eigenen Brauen zurückgerechnet.** (Georg: »augenbrauen
würde ich gerne wie die original-brauen so für uns riggen & gestalten, dann als dritte brow-mod
neben line, tube.«) `lab-v6/browblock.v1.js` findet die beiden Brauen-Inseln über ihre **Lage**
(vorn am Kopf, über der Augenlinie, beidseitig, breiter als hoch — keine Namensvermutung), misst sie
und kehrt die Formeln aus `brow-rig.v2.js` um. Gemessen an Carl:

```
Inseln          #7 + #8
je Braue        0,300 × 0,166 × 0,235 u     Mitten ±0,222 / 1,519 / 0,406
Gesamtbreite    0,744 u                     Lücke 0,144 u
Farbe           #8c4c39  — aus der Bildtafel GELESEN (Median über die UV-Punkte der Inseln)
→ Regler        length 0,954 · height 0,460 · thickness 3 · round 1,42 · mask 0,193 · taper 0 · cap 1
gerendert       Breite 0,744 u  — der Kreis schließt sich, gemessen = gerendert
```

**Eine Deckelung, offen gemeldet:** die gemessene Brauenhöhe verlangt `thickness 3,29`, der Regler
endet bei 3. Die Braue rendert damit **91 %** der gemessenen Höhe. Das steht im Tooltip des
`block`-Knopfes, nicht nur hier — eine abgeschnittene Zahl, die niemand sieht, ist eine Lüge.

**R17 · Der Bart als Schlauch, über eine Unterklasse.** (Georg: »bart auch als tube statt line, die
ist links und rechts zu unterschiedlich.«) Der Befund ist derselbe, der bei der Braue schon bezahlt
wurde: die Feder liefert je Abtastung eine eigene Breite. `brow-rig.v2.js` hat dafür drei erprobte
Regler, die `pet-moustache.v1.js` nicht hat — `solid`, `even` (EIN Radius, der **Mittelwert** der
Feder über die ganze Kurve, damit der Dicke-Regler dasselbe bedeutet) und `symmetric`.

`lab-v6/stache.v2.js` ist eine **Unterklasse**, die genau eine Methode ersetzt (`rebuild()`) und
Konstruktor, `style()`, `sync()`, `_probeSkin()`, Material und Export erbt. Das Vendor-Modul bleibt
unberührt, und es gibt keinen zweiten Bart und keine zweite Formentabelle. Gegengemessen:
`form "tube (even)"`, `evenHalf 0,017`. `line` bleibt als Rückweg wählbar.

## Gebaut am 13.09. spät · vier Korrekturen

**R18 · »block« IST Carls Braue, nicht ihre Annäherung.** (Georg am Bild: »du hast die block
augenbrauen aus tubes gebaut, statt die original-augenbrauen zu verwenden.«) Der Fehler war nicht die
Messung — die war richtig (Inseln #7/#8, 0,300 × 0,166 × 0,235 u, Mitten ±0,222/1,519/0,406). Der
Fehler war die Schlussfolgerung: aus einer gemessenen Form wurde ein **Schlauch mit 774 Eckpunkten**
gebaut, der eine Form annähert, die im Netz schon liegt. Facettiert, mit offener Kante an der Maske.

`lab-v6/partrig.v1.js` macht die Insel selbst zum Rig: sichtbar schalten, um ihre **eigene** Mitte
skalieren, verschieben, kippen. Der Dreh dabei: eine Insel steht in Körperkoordinaten, ihr Drehpunkt
ist der Körperursprung — Skalieren hätte sie vom Bauchnabel weggezogen. Sie wird darum **einmal** in
eine Gruppe auf ihrer gemessenen Mitte gehängt und ihr Versatz ausgeglichen. Die Geometrie wird nicht
angefasst, die Datei bleibt unberührt. Paare werden gespiegelt bedient (`spread`, `tilt` tragen das
Vorzeichen von x).

`browblock.v1.js` ist damit **gelöscht**, nicht als Irrweg aufbewahrt: ein Modul, das eine bessere
Lösung nachbaut, wird sonst irgendwann wieder importiert.

**Das Modul weiß nichts über Anatomie, nur über Inseln und Spiegelung** — darum trägt es Braue und
Nase mit derselben Klasse, und darum ist es der Griff für den Waffen-Halt in der Kugel-Faust des
FB-Driver-Grafts, nach dem Georg gefragt hat. Dort sind es dieselben zwei Operationen: eine
Original-Insel sichtbar schalten und um ihre eigene Mitte stellen.

**R19 · Eine Maske kann eine Form nicht schließen — ein Verwurf nimmt nur Pixel weg.** (Georg: »der
maskierte teil führt zu artefakten → bitte form nach slider-maske schließen.«) Gemessen am Shader:
`mask` ist ein **Fragment-Verwurf** (uniform `gap`), der ein Band in der Mitte der Kurve wegschneidet,
nachdem die Geometrie gebaut ist. Auf einem flachen Bändchen fällt das nicht auf — es hat keine
Innenseite. Ein Schlauch hat eine: man sieht in das hohle Rohr, und weil der Ring 6 Punkte hat, sieht
man sechs Facetten und eine Kerbe.

`lab-v6/inkform.v1.js` schließt die Form dort, wo sie entsteht: die Kurve wird in **Läufe** geteilt
(links und rechts der Maske), jeder Lauf bekommt Ringe, und an **beiden Enden jedes Laufs** wird der
Ring auf seinen Mittelpunkt zusammengezogen — ein Fächer, also ein Deckel. Danach wird der Verwurf auf
0 gestellt, sonst schneidet er in die geschlossene Form. Die Wicklung der zwei Deckel ist
gegenläufig, sonst zeigt einer nach innen.

Gilt für **Braue und Bart** (`brow.v3`, `stache.v3`), weil es derselbe Fehler an zwei Stellen war.
Beim Bart betrifft es die Formen mit Lücke — `chaplin` (0,45), `pencil` (0,4), `handlebar` (0,18).
Gegengemessen: `form "tube (even, capped)"`. `solid:false` gibt das Bändchen samt Shader-Maske
zurück.

**R20 · Die Auswahl bekommt eine KONTUR, keine Farbe.** (Georg: »gewählte parts/zones sollten mit
outline markiert sein, nicht farb-tint.«) Eigenleuchten war der zweite Fehlversuch und schlimmer als
der erste: es färbt das ganze Teil um und verfälscht damit **genau die Farbe, die man gerade
beurteilt** — an Carls Orange wurde ein blauer Pfeil violett. Jetzt ist es `EdgesGeometry` als **Kind
des Netzes**: die Kontur folgt jeder Bewegung des Rigs, verdeckt nichts, und `depthTest:false` macht
sie auch hinter dem Körper sichtbar. Auswahl volle Deckung, Überfahren halbe.

**R21 · Brauen und Nase heißen »Brow« und »Nose«, weil sie gemessen sind.** (Georg) Das sind die
einzigen Stellen, an denen die Namensliste von Form-und-Ort abweicht — erlaubt, weil der Name aus
**derselben** Messung kommt, mit der `partrig` diese Inseln riggt: vorn am Kopf, über der Augenlinie,
beidseitig, breiter als hoch (Braue); auf der Mittelachse und über die gemessene Hülle hinaus (Nase).
Die Regel steht wie immer im Tooltip. Gegengemessen: `06 Nose`, `07 Brow L`, `08 Brow R`.

**Ein Fehler, den die Messung gefunden hat:** nach dem Umbau standen **zwei Nasen übereinander** —
`origNose.enabled false`, aber `mesh.visible true`. Die Modi wurden in den **Startstand** der Zonen
gefaltet, und die gespeicherte Einstellung hat ihn danach überschrieben. Sichtbarkeit gehört der
Zonenliste, aber der gewählte Modus ist ihr Besitzer: die Faltung geht jetzt auf den endgültigen
Stand.

## Bestellt, noch nicht gebaut · Farbwahl und Kopfzeilen-Umzug

*Georg, 13.09. spät. Als Auftrag notiert, nicht angefangen — das Nutzungslimit war erreicht.*

**Eine Farbwahl mit Hex-Feld und Kopier-Knopf, an zwei Stellen.** Heute gibt es sieben feste
Farbfelder aus dem DocCheck-System (R12) und sonst nichts. Gebraucht wird je Ziel: ein Farbfeld, das
den Wert anzeigt, ein **`#rrggbb`-Feld zum Lesen und Eintippen**, und ein **Kopier-Knopf**, der den
Hex-Wert in die Ablage legt. Die Systemfelder bleiben als Schnellwahl daneben — sie sind die
verbindlichen Marken-Töne, die Freiwahl ist für Messungen und Vergleiche.

Ziele:
1. **Alle Zonen** — heute `setZoneStyle(part, {hidden, color})`, `color: null` gibt die Bildtafel
   zurück. Die Freiwahl hängt sich an denselben Griff, nichts Neues im Rig nötig.
2. **Das Augen-Rig, einzeln nach Teil** — Augapfel, **Lid**, **Wimper**, Pupille. Achtung, das ist
   kein einzelner Wert: `pet-eye-rig.v6.js` baut mehrere Netze. Vor dem Bauen ist zu **messen**,
   welche Materialien es führt und welche davon getrennt ansprechbar sind; `setLashes` nimmt heute
   Länge, Dichte und Breite, keine Farbe. Falls das Modul keine Farbe je Teil kennt, gilt die
   Vendor-Regel: Unterklasse in `lab-v6/`, nicht die Vendor-Datei ändern.

**`Paint` und `Walrus` ziehen aus der Kopfzeile in die Spalte.** Beide sind keine Werkzeuge, sondern
Eigenschaften eines Teils, und sie gehören zu dem Abschnitt, den sie betreffen:
- **`Walrus`** → in den Abschnitt *Moustache*, als An/Aus neben `line` / `tube`. Die Farbe des Barts
  wird dort zur normalen Farbwahl (`MoustacheRig.set({color})` kennt sie schon).
- **`Paint`** → in den Abschnitt *Zones*, denn es ist eine Eigenschaft der Körperzone: die übermalte
  Bildtafel gegen die Originaltafel (R6). Beim Umzug ist die Kopplung in `applyPaint()` zu behalten —
  eine Zonenfarbe schlägt die Tafel, darum wird sie nach jedem Zonen-Griff neu gesetzt.

In der Kopfzeile bleiben damit nur die Griffe, die das ganze Modell betreffen: `Face`, `Wire`, `i`,
`Reset all`, `Save setting`.

**Danach: vollständiger Sitzungs-Export mit Doku und Übergabe.** Gemeint ist der ganze Code-Stand
dieser Linie plus `LIVING_RIGGING.md` und `CLAUDE.md` als Paket für WSA und für einen frischen Chat.
Zwei Dinge, die dabei nicht vergessen werden dürfen:
- Die WS0-Module unter `lab-v2/vendor/` gehören **nicht** dieser Linie. Im Export muss erkennbar
  bleiben, was Vendor ist und was `lab-v6/` daneben gelegt hat — sonst wandert eine Unterklasse beim
  nächsten Mal in die Vendor-Datei.
- Der Export ist eine **Kopie des Stands**, keine Zusammenfassung. Die Zahlen im Stand-Dokument sind
  Messungen; wer sie beim Übertragen rundet, macht sie zu Meinungen.

## Offen

- **Augengröße und -abstand:** Ablesung, kein Urteil. Regler stehen.
- **Mund-Decal:** Ansatz jetzt aus der tiefsten Mulde plus Carls Zähnen (R9), Größe und Höhe
  weiterhin **nicht abgestimmt**. Regler stehen.
- **Die Teile-Suche ist an Carl geprüft, nicht an anderen Figuren.** Die Lage-Regeln sind plausibel,
  aber eine Figur ohne Original-Brauen oder -Nase liefert `null` — dann fehlt der Stand in der
  Auswahl. Das ist gewollt: kein erfundener Ersatz.
- **`PartRig` am FB-Driver-Graft ist nicht erprobt.** Es trägt Braue und Nase; dass es den
  Waffen-Halt in der Kugel-Faust trägt, ist eine begründete Erwartung, keine Messung.
- **Die Nase kennt nur die ganze Insel.** Georgs Frage nach der Größe der »vorderen Knolle« allein
  ist damit nicht beantwortet — `scale` skaliert das ganze Teil. Eine Knolle getrennt zu stellen
  hieße, die Insel weiter zu zerlegen; das ist eine eigene Scheibe.
- **Semantische Schwierigkeitsfächer fehlen** (`basic / intermediate / advanced / neutral`,
  Briefing §6). Die Zonenfarben können es, die Fächer sind nicht benannt.
- **Ein Rest im Kopf der geladenen Seite.** Im laufenden Fenster hängt noch der alte
  IBM-Plex-`<link>`, obwohl er in der Datei nicht mehr steht (gemessen: Datei sauber, DOM nicht) —
  eine Helmet-Einhängung, die ein Neuladen im Rahmen nicht abräumt. Folgenlos, die Schrift wird
  nicht benutzt; beim frischen Öffnen ist er weg.
- **Eine sculpted Naht am unteren Vorderrand der Kapsel** bleibt stehen, außerhalb der Mundregion.
- **Textur-Tausch je Zone** ist nicht gebaut, nur Farbe gegen Bildtafel.
- **Vernetzte Werkzeugkiste** (Studio + Bühne + Podcast, 1–6 Figuren) ist Georgs Ziel, aber noch kein
  Auftrag. Was v6 dafür beiträgt: eine Rigging-Ansicht, die eine Figur besitzt und ihre Einstellung
  als Datei herausgibt — das ist die Naht, an der eine Bühne sie später übernehmen kann.
