# LIVING · FrizzleGraft v1 — unser Gesicht auf einem fremden Kopf

*Additiv, neueste Zeile oben.*

## 2026-09-13 Nacht spät · DRIVER ALS DEFAULT · KANONISCHER CARL · CAPSULECARL IST EIN BEWOHNER

Drei Aufträge. Ein echter Pfadfehler gefunden und behoben, der zwei Default-Seeds lahmlegte.

**1 · Animation Lab v2 startet mit dem FB-Driver-Rig** (`ms4_driver`), nicht mehr Lorekeeper —
er benutzt ja ohnehin Driver/KayKit-Animationen plus die eigenen. Eigene UI-Ablage bekommen
(`kfb-lab-v2:ui` statt der von v1 geerbten `kfb-lab-v1:ui`) — sonst hätte das Öffnen von v1 nach v2
den zuletzt in v2 gewählten Charakter geerbt. Dabei eine Schlüssel-Kollision gefunden: die Contract-
Petid-Ablage nutzte versehentlich denselben Schlüssel wie die allgemeine UI-Ablage und hätte sich
gegenseitig überschrieben — auf `kfb-lab-v2:contract` gelegt.

**2 · Rigging Lab defaultet jetzt auf »unser json carl«** — die KANONISCHE `kfb.pets/1`-Datei
(`petstudio-v9/kfb-pet-capsule-carl.json`, per `toPets1` aus Georgs Kalibrierung erzeugt), übersetzt
über `fromPets1` beim Start — derselbe Weg wie der `Load…`-Knopf, keine zweite Ladebahn mehr über
die rohe `kfb.carl.rig/6`-Kopie.

**3 · CapsuleCarl ist ein Bewohner des Studios** (`kind:'capsule'`, `module:'CarlRig'`) — erster
PROP-artiger Bewohner neben Klo-Rolli, mit dem ORIGINAL-Modell, demselben Gesicht (EyeRig/BrowRig/
NoseRig/Moustache/PetMouth — dieselben Dateien, die FrizzleBob und der Graft benutzen) und derselben
Geometrie-Pipeline wie die Rigging-Werkbank. Neues Modul `lab-v6/carlrig-mount.v1.js`: EIN Aufruf
(`mountCarl`), keine zweite Pipeline — `splitIslands`/`flattenRecesses`/`buildFace` kommen
unverändert aus `lab-v4/carlrig.js`. Georgs Vertrag (»unser json carl«) wird beim ersten Start EINMAL
eingespielt, seedet Braue/Nase/Mund/Zonen. Gegengeprüft: 21 Teile, Augen sichtbar, Brauen+Nase
gefunden, 21 benannte Zonen, Braue `block`.

**Ein Pfadfehler, gefunden über einen Zwischenlog, nicht vermutet:** beide Default-Seeds
(Graft-Driver UND CapsuleCarl) liefen komplett ohne Fehlermeldung ins Leere — `_abs()` ist im
Studio bereits auf `.../petstudio-v9/` verankert (`window.__KFB_MODBASE`), mein Pfad
`_abs('./petstudio-v9/kfb-pet-…json')` verdoppelte das Verzeichnis und traf nie eine echte Datei.
`grab()` gab still `null` zurück, der Seed lief nie. Auf `_abs('./kfb-pet-…json')` korrigiert,
gegengeprüft mit einem Konsolen-Log VOR und NACH dem Fix.

**Eine zweite, echte Ursache dahinter, ebenfalls gefunden:** selbst mit korrektem Pfad hätte der
CapsuleCarl-Seed die nächste Seite nicht überlebt — `this.lib.pets` ist nur der Arbeitsspeicher,
gespeichert wird über `ses.drafts`. Beide Seeds schrieben vorher nur `this.lib.pets` und
`petVersions`, nie einen echten Entwurf — nach einem Neuladen wäre `boot()` wieder bei den rohen
Werten gelandet, während `petVersions` das erneute Einspielen für immer gesperrt hätte. Jetzt
schreibt jeder Seed auch `_SES.putDraft(ses, …)`.


## 2026-09-13 Nacht · ANIMATION LAB v1 GEHOLT · v2 MIT VERTRAG, SYNC, EXPORT/IMPORT, TEST

**Auftrag 1: Animation Lab v1 1:1 ins Projekt.** Vier Dateien, geprüft auf Abhängigkeiten (v1
selbst hängt an nichts als `lab/assets.js`, `lab/locomotion.js`, `lab/zipstore.js` — keine
weiteren lokalen Dateien): `KFB Animation Lab v1.dc.html`, `lab/{assets,locomotion,zipstore}.js`.
Lädt sauber, Roster erscheint, kein Fehler. Die übrigen lokalen Fassungen (v2–v4) blieben liegen
— Georgs eigenes Urteil: »die anderen sind cluttered«.

**Auftrag 2: v2, nach Georgs vier Antworten.** Kopie von v1, plus ein Vertrags-Reiter im
bestehenden Datenfeld (kein vierter Spaltenbereich):

- **EIN neuer Block in `kfb.pets/1`** (`pets[].anim`: `rig`, `mode`, `clipMap`, `params`) — kein
  zweiter Vertrag. Neues Modul `frizzlegraft-v1/anim-contract.v1.js`: `normalize()`, `resolveClip()`
  (Override zuerst, dann `lab/locomotion.js`s Kandidatenliste, gegen das WIRKLICH geladene Paket
  geprüft), `selfTest()`, `roundtrip()`.
- **Sync, alle drei Bedeutungen zugleich.** Das Lab lädt Studios EIGENES Sitzungsmodul
  (`petstudio-v9/studio-v7/pet-session.v1.js`, WS0-Eigentum, unangetastet importiert — keine
  Kopie, die auseinanderlaufen kann) und schreibt/liest DIESELBE `localStorage`-Sitzung
  (`kfb-pet-studio-v5`). Das ist zugleich: Datei-Übergabe (Export/Import), Live-Abgleich zwischen
  offenen Tabs (dieselbe Origin, derselbe Schlüssel — kein Broadcast nötig), und der Anfang eines
  Drift-Checks (dieselbe `union()`-Regel wie Studios Repo-Guard). Ein Pet, das die Sitzung noch
  nicht kennt, wird NICHT erfunden — der Knopf meldet das, statt einen leeren Entwurf anzulegen.
- **Export/Import**, kompatibel mit Studios Format: `$schema: kfb.pets/1`, ein Pet, der `anim`-Block.
  Import liest `pets[0].anim`, weist eine Datei OHNE diesen Block ab (nicht geraten).
- **Test, alle drei zugleich:** Abnahme-Zeilen (Rig/Modus gültig, jede gesetzte Clip-Überschreibung
  gegen das geladene Paket geprüft, jeder gesetzte Parameter im Bereich), Rundweg-Probe (normalisieren
  → JSON → zurück → Diff muss leer sein), Bildbeleg (verweist auf den vorhandenen »Strip«-Knopf aus
  v1, kein zweiter Knopf für dasselbe).

**Gegengeprüft, nicht nur behauptet:** Sync schreibt echt in `kfb-pet-studio-v5` (`drafts['graft-driver'].pet.anim`
gelesen, vorhanden). Export liefert ein gültiges `kfb.pets/1`-Dokument (abgefangen über einen
`HTMLAnchorElement.click`-Eingriff, nicht angenommen). Import eines fremden Exports (`graft-orc`,
Rig Large, Modus full, Clip-Überschreibung) übernimmt Pet-ID und Werte sichtbar (Large/full-Knopf
leuchten). Test liefert vier Zeilen, drei bestanden, eine neutral.

**Zwei stille Pfadfehler unterwegs, gefunden und behoben** (dieselbe Klasse Fehler wie schon zweimal
diese Sitzung): `../frizzlegraft-v1/…` und `../petstudio-v9/…` liefen aus der Projektwurzel ins
Leere — v2 liegt selbst auf der Wurzel, `../` geht darüber hinaus. Korrigiert auf `./…`.
Und: mehrere Textzeilen im Vertrags-Reiter trugen `—`/`→` als LITERALEN Text statt
als Zeichen — in Template-Markup wird kein JS-Escape aufgelöst (anders als in echtem JS-Quelltext,
wo dieselbe Schreibweise korrekt ist). Ersetzt durch die echten Zeichen, gegengeprüft am DOM.

**Bewusst nicht in v2:** Cockpit/Vehicle-Rigs — Georgs vierte Antwort war eindeutig: eigene,
spätere Baustelle, nicht Teil dieses Vertrags.


## 2026-09-13 später Abend · v17 · DEFAULT-ANHANG · POSE-FUND · KARTENKIPPUNG BEHOBEN

Georgs vier Studio-Aufträge und zwei Werkbank-Aufträge, in seiner Reihenfolge.

**1 · Studio läuft ab jetzt als v17.** `KFB FrankenStein Studio v17.dc.html` ist die Arbeitsdatei
(verschoben, nicht kopiert), v16 bleibt daneben liegen als Referenz. `CLAUDE.md` zeigt jetzt auf
v17.

**2 · Georgs eigene Kalibrierung ist der Startzustand — an beiden Häusern.** Studio:
`petstudio-v9/kfb-pet-graft-driver-default.json` (sein Anhang, petVersion 6: Waffe an, Card Rider
an, Braue `carl-original`, Materialfarben) wird beim Boot über denselben Weg wie ein normaler
Import (`planImport`/`applyImport`) übernommen, versioniert — eine ältere Sitzung wird nicht
überschrieben, aber `activeId` zeigt danach auf `graft-driver`. **Ein Fund dabei:** die
Roster-Heuristik (»zweibeinig wird bevorzugt«) hätte trotzdem `graft-orc` geladen, weil der nicht
der erste Zweibeiner im Roster ist — behoben mit einem EXPLIZITEN Index für den Default, keiner
Heuristik, die für einen anderen Fall gebaut ist. Gegengeprüft: `S._pet().id === 'graft-driver'`.

Werkbank: `lab-v2/config/kfb-carl-rig-default.json` (Georgs Anhang) springt nur ein, wenn
`localStorage` noch KEINE Sitzung trägt — dieselbe Regel wie im Studio, die Sitzung gewinnt gegen
den Anhang, der Anhang ist der Anfang.

**3 · Die Stand-Pose war da, wurde aber vom Sitzprofil überschrieben — gefunden, nicht vermutet.**
`p.pose.preset:'stand'` stand im Anhang richtig; `_seatApply('neutral_chair')` (weil `p.seat.profile`
zufällig noch gesetzt war) erzwingt aber `preset:'armchair'` (Hüfte 88°, Knie 92°) — ZWEI
unabhängige Vertragsfelder (»welches Möbelstück steht zur Messung« gegen »wie steht die Figur«),
die sich beim Laden gegenseitig überschrieben, ohne dass Georg je »Sitzprofil« gewählt hätte. Fix:
die zuletzt gespeicherte Pose wird NACH dem Sitzprofil-Aufbau erneut gesetzt — sie gewinnt.
Gegengeprüft: `S._pose.p.preset === 'stand'`, Hüfte/Knie 0°/0°.

**4 · Kartenkippung — gefunden UND behoben, nicht nur vermutet.** OFFEN_nach_v16.md hatte zwei
Verdachte; **Verdacht 1 traf zu**: die Bildschleife schreibt `fig.quaternion`/`fig.position` JEDES
Bild neu (Animations-Mixer, dann die Pose), und `_cardPlace()` drehte die Figur nur EINMAL, bei
einem Klick — ihr eigener Zwischenspeicher `kfbRideBase` änderte daran nichts, er hielt einen
einmal gemerkten Stand fest, während der Mixer laufend einen anderen schrieb. Die Kippung stand
darum genau ein Bild lang.

Fix: `_cardRideTick()`, neu, läuft JEDES Bild direkt nach Mixer und Pose — sie liest die FRISCHE
(untilted) Haltung dieses Bildes und legt die Kippung direkt darauf, ohne Zwischenspeicher (der
war die Ursache, nicht die Rettung). `_cardUnride()` (für die Messung im geraden Zustand) invertiert
dieselbe Drehung für einen synchronen Aufruf, ebenfalls ohne Zwischenspeicher.

```
Zustand    Figur-Rotation.x      Differenz zum Cruise
cruise     0,559 rad             —
climb      0,279 rad             −0,280 (Soll: −16° ≈ −0,279)
descent    0,838 rad             +0,279 (Soll: +16° ≈ +0,279)
```
Über 700 ms Bildlauf blieb der Wert stabil (0,559 → 0,559) — die Kippung bleibt jetzt stehen,
statt nach einem Bild zu verschwinden. Das Kartenmotiv selbst (OFFEN Punkt 1) war schon auf
`rotation = 0` korrigiert — keine Änderung nötig, nur bestätigt.

**5 · Werkbank: kfb.pets/1-Import, der Rückweg zum Export.** `Load…` neben `Save setting` liest
eine `kfb.pets/1`-Datei, prüft `$schema` und `pets[0].id === 'capsule-carl'` (ein anderes Pet wird
**abgewiesen, nicht geraten**), übersetzt über `fromPets1` zurück und lädt neu. **Ein Fund beim
Gegenprüfen:** `fromPets1` gibt die REICHE Exportform zurück (`brow.original.islands`,
`brow.graft.donor` als Dokumentation) — die gespeicherte Sitzung ist aber FLACH (`browMod` als
eigenes Feld). Ohne Übersetzung dazwischen kam `browMod` als `undefined` an. Jetzt sitzt die
Übersetzung in der Werkbank selbst (Eigenheit der Sitzungsform, nicht der Vertragsform) und ist
gegengeprüft: Export → Import → `browMod === 'block'`, 21 Zonen, Augenwerte gleich.

**Offen, ausdrücklich nicht angefasst — beide sind eigene Entwürfe, kein Nachtrag:**
- **Header-Tabs neu sortiert/kompakter für Split-Screen.** Die fünf Reiter sind schon
  `flex:1 1 auto` (schrumpfen mit dem Fenster); was fehlt, ist eine Neuordnung der vielen
  Klapp-Abschnitte INNERHALB der Reiter (»Body« trägt allein zehn). Das ist eine
  Informationsarchitektur-Entscheidung, keine Zeile CSS — verdient einen eigenen, aufmerksamen
  Durchgang.
- **Werkbank-UI optisch an Studio angeglichen.** Die Werkbank trägt das DocCheck-System (R12,
  roter Balken); Studio hat seine eigene Papier-Optik (Space Grotesk, helle Flächen, eigene
  Token). Die Vertragskompatibilität (Punkt 5) ist unabhängig davon fertig — die optische
  Angleichung ist ein zweiter, größerer Schritt.


## 2026-09-13 spät · NASE ALS ZWEITE GRAFT-OPTION · WOBBLE · LID/WIMPER-VORGABE

Georgs drei Aufträge: Nase UND Braue als Graft-Option für alle Rigs verfügbar machen, ein
Cartoon-Deformer nach dem Konzept »jedes Rig ist ein Schauspieler« (wippende Teile), und eine feste
Vorgabe für Lid-/Wimpernfarbe (-1/-2 Stufen der Körperfarbe, überschreibbar).

**Zwei neue geteilte Module, weil die Idee jetzt an mehreren Stellen gebraucht wird:**
- `frizzlegraft-v1/actor-wobble.v1.js` — der Federausschlag, der in `ears.v2.js` schon lief
  (Weltgeschwindigkeit eines Ankers → Ziel-Ausschlag → gedämpfte Feder → Drehpunkt AUF dem Teil),
  jetzt als `Wobble`-Klasse für neue Verbraucher. `ears.v2.js` selbst bleibt unangetastet — ein
  geprüftes Modul wird nicht angefaßt, nur weil dieselbe Idee jetzt auch woanders gilt.
- `frizzlegraft-v1/actor-color.v1.js` — `shade(hex, steps)`, eine OKLCH-Stufe (perzeptuell
  gleichmäßig, nicht `multiplyScalar` auf sRGB). `shade('#f2c93c', -1) → #cea600`,
  `shade('#d99a4e', -2) → #925800` — gegengeprüft.

**`lab-v6/facegraft.v1.js` löst `browgraft.v1.js` ab** (R10: neue Fassung, neuer Name). EIN
Spender-Fetch trägt jetzt BEIDE Teile (`loadDonorFace`), vorher hätten Braue und Nase den Spender
zweimal geholt. Neu: `NoseGraft`, dieselbe Struktur wie `BrowGraft` — Carls Nasen-Insel (#6,
0,131×0,151×0,334 u, Mitte 0/1,3/0,622) als Spender-Geometrie, Anker `eyeFrame()`, Tiefe per
Strahl auf die Kopfoberfläche (Formel wörtlich aus `pet-nose.v2.js`). Beide Klassen tragen jetzt
einen eigenen Drehpunkt AUF dem Teil (vorher: Position direkt am Mesh) — das ist die Voraussetzung
für den Wobble, sonst würde eine Drehung um den Wirt-Ursprung kreisen statt am eigenen Ansatz zu
wackeln.

**Wobble, gemessen an beiden Häusern:** eine simulierte Kopfbewegung (0,3 u seitlich, 150 ms) löst
einen Ausschlag von 0,137 rad aus, der binnen 600 ms auf 0,029 rad abklingt — Werkbank und Studio
liefern praktisch denselben Wert (0,1367 vs. 0,1237 rad Ausschlag). Ohne Bewegung: 0 Differenz über
1,5 s (Prime Directive — Kopf still, Teil still). Vorgabe: Nase AN (0,5), Braue AUS (0) — eine
Braue, die am Kopf klebt, wackelt normalerweise nicht mit; beide Regler stehen und sind
überschreibbar.

**Wo die Nasen-Option steht:** Werkbank als dritter Nasen-Stand `graft` neben `ours`/`original`;
Studio als Quellen-Umschalter »ours (drawn) · Carl's own« im Nase-Abschnitt, exakt wie bei der
Braue — ein Eigentümer je Gesichtsteil, die gezeichnete Knolle geht aus, solange der Graft steht.
Gegengeprüft am Graft-Driver: Insel #6 (0,131×0,151×0,334 u) trifft die erwartete Messung, Platzierung
bei Skalierung 1,073, Treffer auf der Kopfoberfläche (`hit: true`).

**Generalisierung — strukturell, nicht 24-mal von Hand verdrahtet.** `_mountBrow`/`_mountBrowGraft`
und `_mountNose`/`_mountNoseGraft` laufen im Studio an der EINEN Stelle, die für jeden Bewohner
gilt (Kommentar im Code: »kommt mit jedem Rig — derselbe Bauweg für Cube-Pet, Rolli und Hase«).
Die neue Nase/Braue-Option ist damit für alle 24 Cube-Pets, FrizzleBob und die Graft-Varianten
automatisch da, ohne 24 einzelne Verdrahtungen — das ist die Naht, die »jedes Rig ist ein
Schauspieler« technisch trägt.

**Lid/Wimper-Vorgabe, nur in der Werkbank umgesetzt.** `applyEyeColors()` färbt Lid/Wimper jetzt
IMMER — entweder die gesetzte Überschreibung oder `shade(Körperfarbe, -1)`/`shade(…, -2)`, nicht
mehr der alte Hautabtast-/autoColor-Wert des Moduls. Körperfarbe = Zone-1-Farbe, sonst `#d99a4e`.
Gegengeprüft: ohne Override liefert das Rig `lid #b57828`, `lash #925800` — exakt `shade('#d99a4e',
-1)`/`shade('#d99a4e', -2)`. **Im Studio NICHT gebaut:** die Lid-Farbe hängt dort an einem älteren,
rollen-basierten System (`g.roles.eyes`/`scan.lid`), eine Wimpern-Überschreibung existiert dort noch
gar nicht. Das umzubauen ist eine eigene, saubere Chirurgie an einer anderen Stelle — hier bewusst
nicht mit angefasst, um die bestehende Farb-Pipeline nicht halb zu brechen.

**Ein Pfadfehler unterwegs, gefunden und behoben:** die Werkbank importierte das neue
`actor-color.v1.js` mit `../frizzlegraft-v1/…` — falsch, weil die Werkbank selbst auf der
Projektwurzel liegt (nicht in einem Unterordner wie `lab-v6/`, wo `../` korrekt hierher zurückführt).
Der Pfad lief ins Leere, ohne dass eine Fehlermeldung im Rahmen sichtbar wurde (stiller
Ladefehler); gefunden über den isolierten Import-Test, nicht über eine Vermutung.

**Offen:** Studio-Lid/Wimper-Formalisierung (s.o.), Ohren noch nicht auf `actor-wobble.v1`
umgezogen (funktioniert unverändert über die eigene Kopie in `ears.v2.js`), Carl-Vertrag `kind:
'capsule'` hat weiterhin keinen Bauweg im Studio.


## 2026-09-13 · CARLS BRAUE AUF FREMDEM KOPF · VERTRAG ÜBERSETZT · FARBWAHL

Georgs vier Antworten abgearbeitet. Alles am Wert oder am Pixel gemessen, nichts behauptet.

**1 · Carls Braue auf FrizzleBobs Kopf — am Pixel belegt.** `lab-v6/browgraft.v1.js`: Carls
Brauen-Inseln werden aus `player.gltf` geschnitten und als **Spender-Teile** auf den Zielkopf
gesetzt. Was ausdrücklich NICHT passiert: die Lage-Suche von `partrig` auf dem Zielrig laufen
lassen — sie ist an Carls Netz geprüft, FrizzleBob hat keine Original-Brauen, dort käme `null`.
Der Anker ist `EyeRig.eyeFrame()`, die Stellformel **wörtlich die von `brow-rig.v2.js`** (Mitte und
Spanne aus den Augen, Tiefe aus `probeSkin` auf der Haut des Wirts). Die eine übertragene Zahl ist
das Verhältnis: Carls Brauenpaar ist 0,744 u breit.

```
Spender          Inseln 7 + 8 · je 0,300 × 0,166 × 0,235 u · Paar 0,744 u
                 → deckungsgleich mit der gepinnten Messung (matchesExpected true)
Auf Graft-Driver Paar 0,744 u → Wirtsspanne 0,685 u, Maßstab 0,9205, Haut-Abtastung z 0,2466
Sichtbar?        AM PIXEL gemessen, 28×28 über der Braue:
                 mit Graft rgb(179,97,66) · ohne rgb(233,211,93) · wieder an rgb(179,97,66)
                 Unterschied 195 von 765 = 26 % — und reversibel auf denselben Wert
```

**Die Kontrollprobe, die den Weg beweist** (in der Werkbank, am Spender selbst): derselbe
Graft-Weg gegen Carls eigene Insel gestellt.

```
Regler Width 0,95 (= R16s zurückgerechnete 0,954)
                 Graft   x ±0,221 · y 1,501 · z 0,330 · Maßstab 0,997
                 Insel   x ±0,222 · y 1,519 · z 0,406
```
x auf **1/1000 u** gleich, Größe auf **0,3 %** gleich. Zwei offene Abweichungen, benannt statt
geglättet: y liegt **0,018 u** tiefer, z **0,076 u** flacher — letzteres mit Grund, die Abtastung
setzt die Braue auf die HAUT, während die Original-Insel mit ihrer halben Tiefe (0,118 u) darüber
hinausragt. Beide sitzen auf Reglern. Dass die Formel bei `length 0,954` auf Maßstab 1,00 kommt,
ist die zweite unabhängige Bestätigung von R16.

**⚠ Ein Widerspruch zu R16, offen gemeldet.** R16 nennt `#8c4c39` als aus der Bildtafel gelesene
Brauenfarbe. An dieser Datei und Revision ist die Brauen-Insel in `capsule_texture` **grau**: über
94 Dreiecksmitten sind die häufigsten Werte #7f7f7f, #989898, #404040, #595959, der Median #989898
(über die ECKPUNKTE #b2b2b2 — die liegen auf UV-Nähten und treffen die Nachbarzelle). Gerendert
erscheint sie aber braun, am Pixel #b36142. Welche Messung die Braue meint, ist **nicht
entschieden**; deshalb rendert der Graft die Original-Bildtafel des Spenders, und die Stichprobe
ist nur der Startwert der Farbwahl. So steht es auch im Modul und im Hinweis der Oberfläche.

**Wo die Option steht** (Georgs Wahl: in beiden Häusern): im Studio im Gesichts-Reiter als
Quelle »ours (drawn) · Carl's own« mit den sieben Graft-Reglern und der Messzeile; in der Werkbank
als vierter Brauen-Stand `graft` neben `line`/`tube`/`block`. **Ein Eigentümer je Gesichtsteil:**
solange der Graft steht, ist die gezeichnete Braue aus und Carls eigene Insel ausgeblendet — kein
doppeltes Paar. Ein Modul, zwei Häuser, keine zweite Kopie.

**Eine bezahlte Falle unterwegs:** `splitIslands` braucht `mesh.userData.kfbIslandOf` — die
Inselzuordnung, die `audit.js` beim Laden anlegt. Ein selbst geladenes GLTF hat sie nicht, und dann
steht `splitIslands` still auf `null` (»Cannot read properties of null«). Der Spender kommt darum
über **denselben** Lader wie die Werkbank.

**2 · Der Vertrag ist übersetzt, es gibt einen Export-Pfad.** `lab-v6/carl-contract.v1.js`:
`kfb.carl.rig/6` → `kfb.pets/1`, die Form, die das Studio liest. Der Kern ist die Auflösung der
**Index-Zonen**: aus `zones[7] = {hidden,color}` wird `{island: 8, name: "Brow L", hidden, color}` —
aus einer stillen Position wird eine benannte Angabe, mit dem GEMESSENEN Namen aus `zonenames.v4`.
Gemessen am Ergebnis: 21 Zonen, **21 von 21 benannt**, 6 ausgeblendet; Rückweg (`fromPets1`) gibt
dieselben Werte zurück. Kein zweiter `kfb.carl.rig/6`-Block in der Datei — zwei Wahrheiten sind
genau das, was die Übersetzung vermeidet. Drei Felder sind **neu** in `kfb.pets/1` und als solche
in der `FIELD_MAP` geführt: `eye.lashes`, `eye.colors`, `moustache`. Die Werkbank speichert jetzt
`kfb-pet-capsule-carl.json`.

**Offen und ausdrücklich nicht gebaut:** das Studio hat den Bauweg »CarlRig« nicht. Der Eintrag
trägt `kind: 'capsule'` und die Einstellung — er ist die Einstellung, nicht der Bau. Das steht auch
in seinem `notes`-Feld, damit es niemandem als fertig verkauft wird.

**3 · Farbwahl mit Hex-Feld und Kopier-Knopf.** An drei Stellen dieselbe Zeile: Feld liest und
nimmt `#rrggbb`, `Copy` legt den Wert in die Ablage, `Orig` gibt die Modul- bzw. Bildtafel-Farbe
zurück; die sechs Systemfelder bleiben als Schnellwahl. Ziele: **alle Zonen** (hängt am vorhandenen
`setZoneStyle`-Griff), der **Bart** (`MoustacheRig.set({color})` kannte das Feld schon) und das
**Augen-Rig je Teil**. Letzteres ist am Modul gemessen, nicht geraten: `pet-eye-rig.v6.js` baut je
Auge [Augapfel, Pupillen-Pivot, Lider]; Augapfel und Pupille teilen je EIN Material über beide
Augen, das Lid eines je Auge (Farbe aus der Haut abgetastet), die Wimpern hängen als Gruppe unter
dem Oberlid mit eigenem Material. `setLashes` kennt keine Farbe — gefärbt wird darum das Material,
die Vendor-Datei bleibt unberührt. Gemessen: alle vier Ziele nehmen die Farbe an (`f3ede2` →
`3388ee` usw.).

**Zwei Fallen, beide gemessen und beide behoben:**
- **Ein Regler-Zug am Auge baut das Rig neu** und macht frische Materialien — die Farbe war danach
  still weg. Das Modul zählt seine Bauten in `gen`; die Farben werden jetzt **im selben Griff**
  nach dem Bauen aufgelegt (in `flush()`), nicht erst im nächsten Bild: in einem verborgenen
  Fenster parkt die Bildschleife, dann käme das nächste Bild nie.
- **Eine gespeicherte Farbe stand im Feld, aber nicht am Material.** Die Bildschleife hatte ihren
  Bauzähler beim ersten leeren Durchlauf gemerkt und danach nie wieder verglichen. Die
  Wiederherstellung sitzt jetzt dort, wo der Stand ankommt.

**4 · »Paint« und »Walrus« sind aus der Kopfzeile ausgezogen.** Der Bart als An/Aus neben
`line`/`tube` samt Farbwahl, die übermalte Bildtafel als An/Aus im Zonen-Abschnitt — beides sind
Eigenschaften eines Teils, keine Werkzeuge. In der Kopfzeile stehen nur noch `Face`, `Wire`, `i`,
`Reset all`, `Save setting`.


## 2026-09-13 · RIGGING LAB IST HIER · funktionsgleich kopiert, nicht doppelt

**Auftrag 1 aus `ONBOARDING_RIGGING_MERGE_v1.md` ist ausgeführt.** `KFB Rigging Lab v1.dc.html`
steht als eigenes Blatt im Projekt und lädt Carl unverändert: Augen offen mit Wimpern, Carls
**eigene** Block-Brauen und Nase als Original-Inseln (R18/R21), Mund-Decal im `red`-Satz an der
gemessenen Stelle, Panzerplatten und Pfeile unangetastet. Selbst gerendert, nicht aus der
verborgenen Schleife gelesen; Meldungsfenster leer.

**14 Dateien mitgekommen** — Einstieg, `lab-v6/{partrig.v1,inkform.v1,brow.v3,stache.v3,zonenames.v4,texclean}.js`,
`lab-v4/carlrig.js`, `lab-v2/{audit,sources}.js`, `lab-v2/config/kfb-pet-graft-driver.json`,
`LIVING_RIGGING.md`, DocCheck-Tokens + Bundle. **302 Dateien bewusst NICHT** — Beweisbilder,
Archivstände v1–v3, dokumentierte Irrwege (16B, v4-FAILED), und vor allem der Ordner
`lab-v2/vendor/petstudio-v9/`: das war eine gepinnte Zweitkopie von Dateien, die hier schon liegen.

**Der eine Eingriff am kopierten Code:** alle Importe auf `lab-v2/vendor/petstudio-v9/…` zeigen jetzt
auf `petstudio-v9/…` in diesem Projekt — **eine** Wahrheit für `pet-eye-rig.v6`, `brow-rig.v2`,
`pet-nose.v2`, `pet-moustache.v1`, `pet-mouth.v1`, `kfb-ink-canon`. Sonst ist keine Zeile geändert.

**Zweiter Eingriff, am Rahmen:** die Schriftdateien des DocCheck-Systems sind 13 `.ttf` — in diesem
Projekt gilt »keine Binärdateien«. Roboto und Roboto Slab kommen darum vom Schriftdienst; die
`@font-face`-Zeilen der Token-Datei laufen ins Leere, ohne zu schaden. Gegengeprüft: Wortmarke im
Slab, Panel im Sans, roter Balken, grüner Primärknopf — der Rahmen ist der aus R12.

Carl lädt zur Laufzeit vom Repo (`sources.js`, Revision `cb52cc2b`), es liegt kein Modell im Projekt.

**Offen und unverändert:** Auftrag 2 (Carl-Vertrag `kfb.carl.rig/6` → `kfb.pets/1`) und Auftrag 3
(Carls Nase/Braue als Graft-Option auf FB). Beides nicht angefangen.


## 2026-09-13 · P34-S37 DER WACKELNDE ARM · KARTENMOTIV · FB KIPPT MIT

Drei Befunde von Georg, alle drei am Wert nachgewiesen.

**1 · »Rechter Arm ist broken und wackelt/dreht sich.«** Nicht der Löser war kaputt — **die
Ellbogenebene war entartet**. Der Hinweis steht fest auf L [1,−0,6,−0,2] / R [−1,−0,6,−0,2], also
fast PARALLEL zur Armachse, sobald der Arm zur Seite zeigt. Nach dem Herausprojizieren der Achse
bleibt ein Rest nahe null, dessen Richtung mit jedem Bild springt, das die Bildschleife die Schulter
bewegt. Dazu kam: **der Löser faßt den Handknochen nie an** (er hängt an keiner der zwei Ketten) —
die laufende Bildschleife dreht ihn weiter, das ist die sich drehende Faust.
Drei Eingriffe: eigener Hinweis für die Surfhaltung (0, −1, −0,35 — Ellbogen nach unten und hinten),
Notausgang-Schwelle von 1e−6 auf **0,05** (fast entartet ist auch entartet), Hand zurück auf ihre
gemessene Bindelage nach jedem Lösen.

**⚠ UND EIN ZWEITER FEHLER VON MIR, im Messen gefunden.** Mein erstes Surf-Ziel rechnete mit
`a.armLen` = **0,3157** — die Kette misst aber **0,5758** (lenU 0,2419 + lenL 0,3339); die alte Zahl
stammt aus einer früheren Messung. Nach der Korrektur auf die echte Reichweite lag das linke Ziel bei
**1,037 der Reichweite**, also AUSSERHALB: der Löser klemmt auf die Strecklage, der Arm steht
durchgedrückt — genau das »broken«. Ein Ziel aus absoluten Koordinaten kann das nicht garantieren.
Es wird jetzt **vom Schulterpunkt aus** gesetzt: Richtung × 0,82 der Reichweite. Nachgemessen:
**beide Seiten 0,820**, Fehler 0,0039, Ellbogen unter der Hand, **Drift über 30 Bilder = 0,00000**.

**2 · Kartenmotiv und Größe.** `KayfaBizarro_Card_Backside_01_lowrez.png` aus dem Repo ins Projekt
KOPIERT (nicht verlinkt — ein Blatt, das aus dem Netz nachlädt, ist beim nächsten Ausfall leer),
800 × 447, liegt auf Ober- und Unterseite, um 90° gedreht (das Blatt ist hochkant, die Karte quer),
Schnittkanten bleiben Papier. Größe verdoppelt: Figurenhöhe von 0,55 auf **0,275 der Kartenbreite**,
Fußabdruck jetzt 10 % / 13 % der Fläche.

**3 · »Karte kippt, aber FB bleibt stehen.«** Stimmt — Karte und Figur sind GESCHWISTER unter
`biped-root`. Die Figur einfach mitzudrehen reicht nicht: sie drehte sich um ihren eigenen Ursprung
und die Füße wanderten durch die Platte. Sie wird um den **Kartenmittelpunkt** gedreht
(p + R·(0 − p)); kein `scale`, kein Eingriff an `biped-root`. Nachgemessen: Figur 0,384 rad =
Karte 0,384 rad.

**⚠ Und die Messung bleibt gerade.** Mit gekippter Karte wären Fußabdruck und Kontakt Zahlen einer
Schräglage — in Travel eine Abgabe, die nur für eine Kurve gilt. `_cardMeasure` stellt vorher gerade.
Erster Versuch wich trotzdem um **0,0606** ab: die Knochen trugen noch die Weltmatrizen des gekippten
Bildes. Mit erzwungenem Durchrechnen sinkt sie auf **−0,006** — der Fußabdruck ist exakt gleich, der
tiefste Kontakt nicht ganz. ⚠ Die erste Fassung dieses Eintrags schrieb hier »0«; das war eine
Behauptung, keine Messung (Abnahme 13.09.). Der Rest von 0,006 Card-Einheiten ist benannt, nicht
nachgefaßt — er liegt unter der Strichstärke der Karte (0,055 Dicke) und damit unter dem, was in
Travel sichtbar würde.

## 2026-09-13 · P34-S36 CARD RIDER · DIE ABGABE FÜR TRAVEL GLOBE

Nach dem Briefing »KFB Travel Globe · FrizzleBob Card Rider« (Georg, 13.09.). Das Studio bleibt
Mess-, Aufsetz- und Pose-Werkzeug: **keine Flugphysik, keine Travel-Karte** — nur Referenzgeometrie,
Zahlen und eine Pose. Neuer Abschnitt **Card Rider** im Körper-Reiter, Modul `cardrider.v1.js`.

**Die Kartenmaße sind ZITIERT, nicht gemessen** (Briefing §3: 3,0 × 1,676 × 0,055, 10 × 14 Segmente)
— und das steht auch so im Modul, damit sie niemand für eine eigene Messung hält. Die sieben
Prüfzustände aus §9 sind Stellungen, keine Bewegung. Die Facing-Kurve aus §7
(`clamp(1 − speed01 × 1.5, 0, 1)`) wird **wörtlich zitiert**, nicht nachgebaut — die Vorschau
TRACK/MIX/PLAYER zeigt nur, was sie ergibt (100 % / 50 % / 0 %).

**⚠ DIE EINHEITENFRAGE WAR DIE GANZE ARBEIT.** Die Bühne des Studios hat ihren eigenen Maßstab (die
Figur steht bei ×0,42); eine Zahl daraus wäre in Travel bedeutungslos — die Falle vom Wannen-Sitz.
Deshalb ist **die Karte der Maßstab**: sie wird in Bühnenmaßen zur Figur passend skaliert, und jede
exportierte Zahl steht in **Card-Einheiten**. `actorScale` ist genau der Faktor, mit dem Travel die
Figur auf die echte Karte setzt.

**⚠ ZWEI BEFUNDE AUS DER ERSTEN MESSUNG, beide korrigiert:**
1. **Der Startmaßstab war wieder ein Riese auf einem Spielzeug.** Erster Vorschlag ging über den
   Fußabdruck (45 % der Kartentiefe) und ergab eine Figur von **3,82 Card-Einheiten Höhe** auf einer
   3,0 breiten Karte. Dieselbe Klasse wie beim Rover (S30). Der Maßstab hängt jetzt an der **Höhe**:
   Vorschlag 0,55 der Kartenbreite. Nachgemessen mit Surf-Pose: Höhe **1,80** = **60 %** der Breite,
   Fußabdruck **0,65 × 0,47** = 22 % / 28 % der Karte — Bewegungsreserve, wie §6 sie verlangt.
2. **`seatLift` war ein Reglerwert und damit eine Null, die im Bild falsch ist.** Gemessen: in der
   Surf-Pose steht der tiefste Fußpunkt **unter** der Kartenoberkante (−0,136), weil das Pose-Rig
   die Wurzel bei gebeugten Knien nicht mithebt. Der Export nimmt jetzt den **gemessenen** Lift
   (0,164) plus die Korrektur am Regler.

**Gemessen wird an den FUSSKNOCHEN**, nicht an der Bounding Box — die endet bei dieser Figur an den
Ohren (Hausregel »Die Box ist nicht die Silhouette«). 238 Fußpunkte, Blickrichtung aus dem Pose-Rig.
Abnahme am selbst gerenderten Bild: Karte sichtbar (8755 rote Punkte), bei »Bank links« 9040.

**CARD_SURF_BASE** ist die Surf-Pose aus S33 (Beinversatz `stagger`, Knie gebeugt, Arme außen) —
Briefing §6 beschreibt genau sie. Der Knopf im Abschnitt setzt sie und mißt nach.

**Die Abgabe** (§10) fällt als JSON heraus (Ablage oder Datei): `actorScale`, die vier Offsets,
`footprint*`, `frontFoot`/`rearFoot`, `seatLift`, `contactLowestY`, `basePose`, die Pose selbst, der
ganze Look (Zonen, Kopfzonen, Wortmarke, Augen) und die Quellen — Fahrer, Kopfspender, Studio-Fassung,
Vertrag, Briefing. Was nicht gemessen ist, steht als `null` drin, nie geraten.

**Offen:** Waffenhaltung (Referenz `Character_Gun.gltf` wörtlich setzen statt ableiten) · Briefing für
den Lab-v5-Bau durch einen zweiten Chat.

## 2026-09-13 · P34-S35 SPENDER-AUGEN WEG · WORTMARKE AUS DEM LAB ÜBERNOMMEN

**1 · Die gelben Originalaugen.** Georgs Befund: unter dem Eye-Rig liegen FrizzleBobs eigene
Augenschalen und nehmen die Kopffarbe an. Ursache: `headgraft` nimmt aus dem Spender ALLE Dreiecke
an Kopf- und Ohrenknochen — die Schalen hängen dort auch, und im Studio trägt der Kopf nur zwei
Materialien, also fallen sie über keinen Namen auf.

**Die Regel ist gemessen, nicht geraten.** Kopfnetz `kfb-head`, 1500 Dreiecke, acht zusammenhängende
Inseln: Schädel 768 mittig · Ohren 2 × 120 bei z −0,297 · Zacken 2 × 108 bei z 0,241 (nicht exakt
gespiegelt) · mittlere Zacke 84 · **Augenschalen 2 × 96 bei x ±0,513, z 0,604** — das VORDERSTE exakt
gespiegelte Paar gleicher Dreieckszahl, 0,043 vom Rig-Auge entfernt. Daraus die Regel: unter den
gespiegelten Paaren gewinnt das mit dem größten z. Ohren fallen über z heraus, Zacken über die
Spiegelung. Nachgemessen nach dem Bau: **192 Dreiecke weg, 1308 von 1500 bleiben**, Kandidatenliste
96/0,604 vor 108/0,241 vor 120/−0,297. Ausgeblendet mit Zeichengruppen, **nicht geschnitten** — der
Schalter »stehen lassen« holt sie zurück (`graft.donorEyes`).

**2 · Die Wortmarke.** Aus **KFB Animation Lab v2** (`lab-v2/graft.js`, `composeKFB`) übernommen,
nicht neu gebaut — zwei Fassungen wären zwei Wortmarken, die auseinanderlaufen. Übernommen sind
Georgs gemessene Werte: Kästen im Atlas 1024² **Rücken 833,853 126 × 87** und **Trikot 676,846 56 × 38**,
Schräge −8°, Rot #b3311f, Tinte #141210, Papier #f6efd9, Irish Grover, Bizarro gibt das Maß und Kayfa
folgt mit 88 %.

**Der eine Unterschied zum Lab, und er ist der Grund für das eigene Modul:** das Lab tauscht eine
ZWEITE Bildtafel ein. Hier gibt es die Zonen-Leinwand schon, also wird die Marke als **Stempel** in
sie hineingemalt — `matzones` kennt jetzt Stempel und läßt sie nach jedem Zonen-Anstrich neu laufen.
Damit nimmt das Übermalen der beiden GO-GO-GO-Kästen die **aktuelle** Farbe neben dem Kasten: auf der
schwarzen Lederjacke also Schwarz. Eine getauschte Tafel hätte das alte Orange zurückgebracht.

**Gemessen nach dem Bau:** Schrift **Irish Grover geladen** (nicht der Georgia-Rückweg), Bizarro 31 px,
Kayfa 27 px, Kasten 114 × 41, Block 72 von 79 hoch, beide Kästen übermalt. Rückenfeld-Mitte vor der
Marke 193/71/6 (Jackenorange), mit Marke 1551 papierfarbene Punkte im Kasten. »Kayfa« ist als Tinte
frei wählbar — Papier #f6efd9 für die schwarze Jacke steht als Knopf daneben, Georgs Wunsch.

**Offen, benannt:** die Waffenhaltung. Das Postmortem des Labs (`lab-v4/POSTMORTEM_WEAPON_HOLD.md`)
nennt die Ursache selbst: die Referenz `Character_Gun.gltf` lag vor, wurde aber sechsmal abgeleitet
statt wörtlich übernommen; Versuch 5 war richtig und scheiterte nur an der Eigenlage von `FistR`
gegen `handslotr`. Für das Studio heißt das: **Referenzlage übernehmen, Rest an Regler**, und die
eingestellte Lage in den Vertrag exportieren, damit das Lab sie liest statt sie neu zu rechnen.

## 2026-09-13 · P34-S34 KOPFZONEN FREI · UND DIE TINT-REIHEN SIND RAUS

Georgs Befund am fertigen v16: »ich brauche die Farben auch für den Kopf … das Gesicht kann ich nicht
färben … die Idee ist nicht, dass das wie ein Kostüm wirkt« und »diese ganzen Färbungen rausnehmen,
die einfach nur einen Tint darüber setzen — die hat über 2000 Dreiecke einfach blau gemacht«.

**Raus sind sieben Reihen:** Palette · Kleidung · Akzent · Augen-Swatches · Gesicht-Swatches ·
Grundgelb-Swatches · Sättigung. Nicht versteckt, sondern **ersetzt** — Kleidung durch die
Materialzonen (Atlasfelder, S33), Kopf durch den neuen Abschnitt **Head zones**.

**Acht Kopfzonen, jede mit freiem Wähler.** Gemessen am laufenden Blatt, bevor gebaut wurde:
Kopf = EIN Netz `kfb-head` (1500 Dreiecke) mit ZWEI Materialien — `Main` #f7cb00 (Schädel, Ohren,
Zacken) und `Main_Light` #f6c19d (Gesicht, Schnauze). Auge = vier Netze je Seite: Augapfel #f3ede2,
Pupille #070707, zwei Lider #ceaa20 (abgedunkelte Grundfarbe). Nase, Braue und Schnurrbart sind
eigene Bauteile mit eigenem Farbfeld — die Braue trägt ein ShaderMaterial OHNE `color`, sie geht
ausschließlich über `brow.set({color})`.

**Kein neuer Speicherort für sechs der acht Zonen:** `graft.zones.bodyHex` · `graft.zones.faceHex` ·
`graft.roles.eyes` · `nose.color` · `brow.color` · `moustache.color` gab es längst. Neu sind nur
`eye.sclera` und `eye.pupil` — die beiden Werte stehen im geteilten Augen-Rig hart und hatten keinen
Eigentümer. `headzones.v1.js` hängt sich wie `eyeoval` EINMAL an `build()`; nachgemessen: Augapfel
#2f6f8f und Pupille #b8361f stehen nach einem Neubau wieder da und kehren auf #f3ede2/#070707 zurück.

**⚠ EIN MESSFEHLER VON MIR, benannt statt verschwiegen.** Erste Abnahme sagte »Gesicht färbt sich
nicht«: blaue Bildpunkte 26 668 vorher wie nachher. Der Bau war gesund — **die Figur stand mit dem
Rücken zur Kamera**, die Schnauze war gar nicht im Bild. Am Material nachgemessen:
`Main_Light` #f6c19d → **#2f6f8f** → zurück auf #f6c19d. Die Hausregel »getroffen ist nicht gesehen«
gilt auch andersherum: **nicht gesehen ist nicht kaputt** — erst die Blickrichtung prüfen, dann den Bau.
Und der Befund dahinter: das Gesicht war schon in v15 färbbar, es gab nur keinen Wähler dafür,
sondern fünf Hauttöne. Georgs »ich finde die Option nicht« war präzise.

**Offen:** Wortmarke auf dem Rückenfeld — Georg hat sie im **Animation Lab** schon gebaut und bietet
an, die Konfiguration herüberzureichen; von dort übernehmen statt neu bauen.

## 2026-09-13 · P34-S33 MATERIALZONEN · DIE TEXTUR IST DER ATLAS, NICHT DAS KLEIDUNGSSTÜCK

Neues Blatt **v16** (`petstudio-v9/KFB FrankenStein Studio v16.dc.html` + Wurzelkopie). Drei
Aufgaben aus Georgs Diktat vom 13.09., in seiner Reihenfolge.

**1 · Materialzonen mit Farbwähler.** ⚠ Die Rollentabelle aus v15 KONNTE das nicht, und der Grund ist
gemessen: der Driver hat **ein** Material und sieben Netze — Jacke, Hose und Schuh stecken in
DENSELBEN Netzen. Was sie trennt, ist die Textur: `driver_texture` ist kein gemaltes Kleidungsstück,
sondern ein **Farbfeld-Atlas**, gemessen **8 × 4 Felder à 128 × 256** (Rasterkanten aus dem Bild
gemessen, nicht angenommen). Jedes Dreieck zeigt über seinen UV-Schwerpunkt in genau ein Feld:

| Feld | Zone | Dreiecke |
|---|---|---|
| r1c1 | **Jacke** | 992 (Körper 384 · Arme je 304) |
| r0c0 | Haut · Hände | 760 |
| r1c7 | **Hose** | 376 (Körper 104 · Beine je 136) |
| r2c6 | Brille · Gestell | 364 |
| r0c1 | Wirtskopf (verdeckt) | 336 |
| r2c3 | **Schuh dunkel** | 296 |
| r0c2 | Schwarz · Brillenglas | 158 |
| r2c4 | **Schuh hell** | 136 |
| r3c5 | **Shirt** (mit kleinem GO GO GO) | 78 |
| r3c6 + r3c7 | **Rückenfeld** (mit großem GO GO GO) | 36 + 36 |

Gebaut wird mit **drei Leinwänden** im Atlas-Raster — Farbe, Rauheit, Metall — und **ohne einen
einzigen Schnitt am Netz**: damit bleibt der Hautschnitt (`_tintHost`) alleiniger Eigentümer der
Netz-Indizes. Die genau umgekehrte Entscheidung wie in v15, und aus demselben Grund wie damals:
zwei Eigentümer für dieselben Indizes ist die Fehlerklasse, die hier schon zweimal Geld gekostet hat.
Farbe ERSETZT den Farbton und behält den Verlauf (Punkt für Punkt sein Verhältnis zur gemessenen
mittleren Leuchtdichte des Feldes) — Naht, Falte und Logo bleiben stehen. Oberfläche = eigene Karte:
Stoff · Matt · **Leder** (Rauheit 0,44 + deterministisches Korn + Hauch Metall) · Lack · Metall.

**Abnahme am gerenderten Bild, nicht am »sieht gut aus«** (`readPixels` direkt nach eigenem
`render`): Jacke auf #1a1a1a + Leder → orange Bildpunkte **256 935 → 190 382**, dunkle
**19 091 → 92 998**; zurück auf Original ergibt **exakt 256 935** wieder. Leinwandprobe in der Feldmitte
193/71/6 → 26/26/26 → 193/71/6.

**⚠ Ein Regler, der nichts bewegt:** das Hautfeld r0c0 trägt am Wirt die Hände — aber der Hautschnitt
hat ihnen ein Material OHNE Bildtafel gegeben (`kfb-skin`), eine Farbe in der Leinwand käme dort nie
an. Dieses eine Feld geht deshalb den Weg, der wirkt (`setSkinColor`, gemessener Handton) und
schreibt in dasselbe Feld wie der Hände-Regler. Und: **Rollenfarbe multipliziert die Leinwand** —
steht eine, sagt es die Leiste und bietet »auf Original« an, statt still zu gewinnen.

**2 · Ovale Augen und Neigung.** `eyeoval.v1.js` statt eines sechsten Rig-Forks: das geteilte
`pet-eye-rig.v6` bleibt unberührt. Gemessen, bevor gebaut wurde: die Bildschleife des Rigs schreibt
`_pivot`, `_lids` und `_up/_lo` — **`e.scale` und `e.rotation.z` rührt sie nie an**. Vier Regler
(Breite · Höhe · Tiefe · Neigung), Neigung spiegelgleich (links +12°, rechts −12°). `attach` hängt
sich EINMAL an `build()`; nachgemessen: nach einem Neubau steht 1,12 / 0,80 / 10° wieder da, wenn der
Wert im Eintrag steht — und 1/1/0°, wenn nicht. Eigentümer: `pet.eye.oval`.

**3 · Surfpose.** Preset `surf` + neues Feld `stagger` (Beinversatz auf demselben Hüftwinkel, je Bein
gegenläufig) + Griff `hands:'surf'` (beide Hände außen auf 0,72 der gemessenen Armlänge, die Hand über
dem vorderen Bein ein Stück weiter vorn). Gemessen: Fußversatz vorwärts **−0,034 → 0,227**, seitlicher
Fußabstand **0,395 → 0,563**. ⚠ Die Fußkorrektur muß den WIRKLICHEN Hüftwinkel zurücknehmen, nicht den
eingestellten — sonst kippt beim Versatz genau eine Sohle weg.

**Export:** nichts Neues nötig — `graft.mat`, `eye.oval` und `pose.stagger` sind Blattfelder unter
`pets[]` und fahren im Vertrag `kfb.pets/1` mit (nachgemessen: 81 → 89 Blattfelder, Rundlauf
verlustfrei). Damit greift auch die Ärmer-Sperre des Exports auf die neuen Felder.

**Offen:** Wortmarke auf dem Rückenfeld (r3c6/r3c7 ist jetzt isoliert — »Kayfa« in Papierweiß auf der
schwarzen Lederjacke, roter Kasten unter »Bizarro«) · Hals als Knopf.

## 2026-09-12 · P33-S32 REITER »WANNE« · DAS RENNEN ALS REZEPT, NICHT ALS ERINNERUNG

Dritter Reiter in **v2**: `bath.gltf` + vier Kenney-Räder (`wheel-racing`) + `Space engine` als Düse,
die GANZE Figur ohne Cockpit. Die Sitzhaltung ist **abgeschrieben, wo sie hingehört**: `seat-lab.v1`
zitiert das Rennen wörtlich — »NO leg solve … the host puts the hips under the waterline«. Also kein
Beinlöser; die Hüfte wandert unter die gemessene Wasserlinie, die Wanne verdeckt den Rest.

**Gemessen:** Wanne 2,000 × 1,608 × 3,000 · Innenboden 1,116 · **Wasserlinie 1,316** · Rand 1,978 ·
Räder ø 0,675, Spur 2,120, Radstand 1,860 · Figur bei ×0,61: Hüfte **0,267 UNTER** der Wasserlinie,
Verhältnis Figur : Wanne **0,74** (Rennen 1,55 : 2,1 = 0,738) · 5 % der Figurenpunkte unter dem
Innenboden = die Beine.

**⚠ Die häufigste Fehlerklasse dieses Projekts, wieder zugeschlagen: gemessen, aber nicht
angeschlossen.** `measureTub` liefert `floorY`, `rimY` und `water` als **Objekt** `{topY, centerZ}`.
Ich hatte `tm.floor` und `tm.water` gelesen — beide `undefined`, der Bericht sagte »kein Wassernetz
gefunden«, obwohl das Netz `bath_water` geladen war und `topY 0,940` gemessen wurde. Der Sitz bezog
sich dadurch auf den Rand statt auf das Wasser. Behoben und nachgemessen.

**Zweiter Fund:** die Düse nach der Breite zu skalieren ergab bei verlangten 0,55 gemessen **0,27** —
ein langes Rohr ist in der Breite schmal. Jetzt nach der längsten Kante.

**Verhältnis statt geliehener Absolutzahl:** `RACE.lift = −0,28` gilt für einen 1,55 hohen Fahrer.
Übernommen wird deshalb der Anteil (**−0,181 der Figurenhöhe**), nicht die Zahl — sonst Äpfel gegen
Birnen.

**Material-Zonen erweitert:** `wanne` · `reifen` · `duese` als eigene Zonen. **Reifen werden nie
mitgefärbt und bekommen keine Textur** (Georgs Befund fürs Garage Lab). Die Übergabe dazu steht in
`WSA_UEBERGABE_ROVER_MATERIAL_ANTRIEB_2026-09-12.md`.

**Offen:** Wortmarke auf dem Jacken-Rücken · Hals als Knopf.

## 2026-09-12 · P33-S31 DER VERLORENE ARM · »LÄUFT« IST KEIN BEWEIS, DASS ETWAS SCHREIBT

Georgs Befund (Bild 16.36): beide Arme waagerecht nach außen, seine eingestellte Haltung weg.
**Gemessen, nicht gerätselt:** die Aktion `Idle_A` läuft (`isRunning() === true`), aber mit
**Gewicht 0** und `mixer.time = 0` — sie schreibt keinen einzigen Knochen. Der Nachhol-Griff aus
S29b hat daraufhin die **Skelett-Bindelage** als »Clip bei t = 0« gemerkt (Hände x ±0,787 · y 1,107 ·
z 0 = T-Haltung), und Georgs −38°/38° darauf ergaben die ausgestreckten Arme. Rechte Hand **0,546**
von der Knüppelkugel (Radius 0,098).

**Die Klasse, nicht die Stelle:** dritter Fall derselben Art. `mx.time > 0` war kein Beweis (S29b),
`isRunning()` ist auch keiner. Der Nullpunkt hängt jetzt an **keinem Laufzeitzustand mehr**: die
Armknochen lesen ihren Bezug direkt aus der **Clipspur** (`<knochen>.quaternion`, erster
Schlüsselwert). Kein Mixer, keine Zeit, kein Gewicht. Nachgemessen mit Georgs Zahlen: rechte Hand
**0,114** an der Kugel (Radius 0,098) statt 0,546 — Haltung ist zurück. In **v1 und v2** behoben.

**Satellitenschüssel weg (v2).** Sie ist kein eigenes Teil: der Rover sind vier Räder plus EIN Netz
(3196 Dreiecke). Die Trennlinie ist gemessen — der xz-Radius fällt über der Kuppel von 1,37 (y 3,0)
auf 0,96 (3,25) und bleibt bis 5,0 zwischen 0,41 und 0,55: das ist Mast plus Schüssel. Geschnitten
wird mit ZWEI Bedingungen (ganz über y 3,40 UND Radius < 0,70); nur die Höhe hätte die Kuppelkappe
mitgenommen, nur der Radius die Radnaben. Knopf »Antenne · weg/dran«.

**Farbzonen und Texturen (v2).** Gemessen, welche Zonen es gibt: Rover = EIN Material »Atlas« ·
Platte = Kenney »colormap« · Knöpfe und Panel = dasselbe · Knüppelschaft #2b3440 und Kugel #b8361f
sind eigene. Fünf Wähler plus Hauspalette, Farbe wird multipliziert (Weiß = unverändert), Knopf
»Rover + Platte + Knöpfe gleich«. Die Figur bleibt ausgespart — ihre Farben gehören `look.v1`.
Texturen aus `Textures/<Name>/<Name>_diffuse|normal|roughness.jpg` (vier Vorschläge + eigener Name).
⚠ **Zwei bezahlte Fallen umgangen:** `clone(true)` teilt Material UND Geometrie mit dem Spender im
Cache — beides wird vor dem Stylen kopiert, sonst färbt man jede künftige Kopie mit. Und die
Atlas-UV der Kenney-/Quaternius-Netze machen aus einer Kacheltextur einen Farbfleck pro Fläche;
deshalb **Box-Projektion** als Vorgabe, mit Rückweg auf die Original-UV.

## 2026-09-12 · P33-S30 ROVER-REITER · DAS RIG ALS EIN STÜCK AUFS FAHRZEUG

Neues Blatt **`KFB Mech & Vehicle Rig v2.dc.html`** (Kopie von v1, v1 bleibt unberührt). Zweiter
Reiter »Rover«: **Rover_Round.gltf** als Träger, das fertige Rig aus Reiter 1 als EIN Stück darauf —
Größe, X/Y/Z, Drehung.

**1:1 per Bauweise, nicht per Abschrift.** Sockel, Cockpit und Figur hängen jetzt in einem Behälter
`kfb-rig`; Reiter 2 verschiebt und skaliert NUR diesen Behälter, gebaut wird weiter bei Identität.
Damit landet auf dem Rover exakt das, was Reiter 1 zeigt — inklusive Georgs Cockpit-Werten und
Armwinkeln. Die alte Falle (Weltmaße gegen eine skalierte Elterngruppe) ist umgangen, nicht bezahlt.

**⚠ Zwei Messbefunde, die einen falschen Nullpunkt verhindert haben.**
1. **Die Bounding-Box des Rovers ist die ANTENNE.** Box-Spitze **5,168**, aber das Dach liegt bei
   **3,563** (25 Strahlen von oben, Median; Spanne 3,367–3,669, drei Ausreißer 4,8–5,0 am Mast).
   Ein Nullpunkt auf der Box hätte das Rig 1,6 Einheiten über dem Dach schweben lassen. Der Anker
   ist deshalb die **abgetastete Dachfläche**, nicht die Box.
2. **Mein Maßstab-Vorschlag war ein Riese auf einem Spielzeug.** »Platte auf 70 % der Roverbreite«
   ergab gemessen **×2,99**, Kopfoberkante **12,39** bei einem 5,17 hohen Rover. Der Reiter fängt
   jetzt bei **×1** an — dem echten 1:1 — und schlägt 30 %/50 % nur auf Knopfdruck vor.

**Gemessen am Rover_Round:** Wanne 3,95 × 3,46 (y 0,28–5,17) · Räder 1,35 hoch · mit Rädern 5,79
breit. Rig bei ×1: 2,42 hoch, Platte 1,36 breit = **34 %** der Wannenbreite. Abnahme am selbst
gerenderten Bild (Bildschleife parkt im verborgenen Fenster — Hausregel, wieder gegriffen):
Rig steht auf dem Dach, 0 % Rig-Punkte unter der Dachfläche.

**Offen:** Wortmarke auf dem Jacken-Rücken · sitzender Einbau (v3) · Wanne als Fahrzeug.

## 2026-09-12 · P33-S29c DER LINKE ARM IST BEI DER UMSTELLUNG DURCHGERUTSCHT

Prüferbefund, wieder gemessen und wieder richtig: ich habe beim Bind-Umbau nur die RECHTE Hand
gelöst und die linke abgeschrieben — Zahlen aus dem alten Bezug. Ergebnis unter der neuen Ruhelage:
linke Hand bei x 0,684, die Platte reicht bis 0,679 — der Arm stand waagerecht NEBEN der Platte.

Jetzt beide Seiten gelöst und selbst gerendert nachgemessen (Bildschleife parkt im verborgenen
Fenster — Hausregel): rechts **0,020 ≤ 0,098** an der Knüppelkugel, links **0,223 ≤ 0,305** auf der
Knopffläche, Hand über der Platte, 0,213 über der Oberkante. Drei Ladungen, dreimal exakt dieselben
Zahlen. Startwerte: rechts −51,3 / −23,8 / −0,9 · links −90 / −19,4 / 0.

**Die Lehre, die schon zweimal Geld gekostet hat:** wenn sich der BEZUG ändert, sind alle darauf
beruhenden Zahlen ungültig — nicht nur die, die man gerade prüft.

## 2026-09-12 · P33-S29b DIE BINDELAGE WAR EIN ANIMATIONSFRAME

Prüferbefund, gemessen und richtig: `_grabArms()` merkte sich `bone.quaternion` IM MOMENT DES
LADENS — da läuft der Idle-Clip schon. Über drei Ladevorgänge desselben Wirts kam dreimal ein
anderes »Bind«-Quaternion heraus, also ergab dieselbe JSON jedes Mal eine andere Haltung.
**Ein Export, der die Pose nicht zurückholt, ist kein Export.**

**Jetzt aus dem SKELETT:** `boneInverses[i]` ist die inverse Weltmatrix der Bindelage, lokal gilt
`boneInverses[parent] · inv(boneInverses[i])`. Nachgemessen: dreimal dasselbe Quaternion
`[-0.5141, 0.4855, 0.4855, 0.5141]`, Flag `mvFromSkel` true.

**Und die abgeschriebenen Winkel waren damit wertlos:** unter dem echten Bezug schwebte Georgs
rechte Hand **0,608** über einer Kugel mit Radius **0,098**. Statt neue Zahlen zu raten, werden sie
jetzt **gesucht** — `_solveHand()`: grobes Raster, zweimal verfeinert, Gütemaß ist der Abstand
Hand↔Kugel. Ergebnis für Georgs Knüppel: **−45 / −26,9 / 1,9** bei Abstand **0,012**. Als Startwert
eingetragen; am geladenen Blatt nachgemessen 0,064 ≤ 0,098 — die Hand greift.

Dazu der Knopf **»Hand an den Knüppel«**: löst live für die aktuelle Knüppellage (rechte Hand auf
die Kugel, linke auf den flachen Knopf, wenn sie hinreicht) und nennt in der Meldung den erreichten
Abstand gegen den Radius. Reproduzierbarkeit geprüft: drei Ladungen 0,034 · 0,032 · 0,034, alle
greifend; Rundlauf über das JSON 0,0009.

## 2026-09-12 · P33-S29 COPY CONFIG / IMPORT / EXPORT IM RIG — UND ZWEI EIGENE FEHLER DABEI

Georg: »leider gibt's keine (funktionierende!) copy config bzw. import/export — analog zu Studio.«
Abschnitt **Konfiguration** eingebaut: Copy config · Datei ↓ · Datei ↑ · Text übernehmen (Einfügefeld).

**Die Ablage-Falle war im Studio schon bezahlt und hier nicht angewandt.** Gemessen im
Vorschaufenster: `navigator.clipboard.writeText` → **NotAllowedError**. Also derselbe Weg wie im
Studio: erst die Ablage, sonst fällt eine DATEI heraus, und die Meldung sagt, was passiert ist.
Rundlauf geprüft: Wert verstellt, JSON eingelesen, **identisch zurück** (Figur, Schnitt, Basis,
Einpassung, alle vier Cockpit-Teile, beide Arme). Müll wird abgewiesen mit Grund (»kein lesbares
JSON« / »keine Rig-Konfiguration«). Die Meßzeilen fahren im JSON mit.

**⚠ Eigener Fehler 1, beim Messen aufgefallen:** `_load()` setzte das Cockpit bei JEDEM Aufbau auf
PARTS0 — also auch beim Hot-Reload und beim Neuladen des Blattes. Damit hat mein eigener Umbau
Georgs von Hand gesetzte Werte weggeworfen (Panel stand wieder auf 0,70 statt auf seinen 1,04).
Jetzt: **nur beim WIRTSWECHSEL** zurücksetzen, ein Neuaufbau desselben Wirts behält alles.

**⚠ Eigener Fehler 2:** der Einpaßlauf rückte auch bei ÜBERSTAND aus. Ein Pult, das über die Kante
ragt, ist aber Absicht — er hat es genau so eingestellt. Ausgerückt wird nur noch bei echter
**Durchdringung** (Figurenpunkte in der Box).

**Und die Startwerte sind jetzt GEORGS Zahlen** (aus seinen drei Bildschirmfotos): Knüppel
−0,81 / 0,74 / −0,48 / ×0,90 · Knopf rund 0,52 / 0,80 / −0,33 / ×0,30 · Knopf eckig 0,81 / 0,58 /
−0,35 / ×0,30 · Panel 0 / 1,04 / −0,58 / ×0,90, Arme rechts −38/38/6 und links −28/22/0.
Nachgemessen über alle vier Wirte: **keine Durchdringung**, nur beim Orc rückt das Panel.

## 2026-09-12 · P33-S28b DIE VORGABE WAR DER FEHLERZUSTAND

Prüferbefund, und er trifft: meine Startwerte fürs Cockpit waren genau das Bild, das Georg zweimal
gemeldet hatte — Panel 63 Figurenpunkte in der Box und über die Platte ragend, Schaft 2 Punkte im
Arm. Ein Blatt, das mit zwei ⚠ aufmacht, ist kein Startpunkt.

**Jetzt:** die Startwerte sind gegen den EIGENEN Bericht geprüft (Driver: alle vier Teile »frei«,
alle innerhalb der Platte, `flat` und `wide`, Hände frei) und stehen als `PARTS0` fest.
**Beim Figurenwechsel** rückt jedes kollidierende Teil einmal, bis der Bericht »frei« sagt — erst
nach vorn, dann zur Seite (auf der Platte geklemmt), zuletzt kleiner —, und was gerückt wurde, steht
in der Leiste. **Beim Schieben rückt nichts**: das ist Georgs Hand.

Nachgemessen über alle vier Wirte: **null Warnungen** · Orc (panel, stick, round gerückt) · Clown
(panel, round) · Mannequin (round) · Driver ohne Rücken.
Zwei eigene Fehler dabei gefunden: mein erstes Ausrücken schob den Knüppel beim Orc und beim
Mannequin VON der Platte (jetzt erst nach vorn, x geklemmt auf ±0,85), und jeder Wirt schleppte die
Einpassung des vorigen mit (Panel kam mit z 0,88 und ×0,306 beim Mannequin an) — jeder Wirt fängt
jetzt bei `PARTS0` an. Der Einpaßlauf brauchte beim Orc mehr als 12 Runden; Grenze auf 26.

## 2026-09-12 · P33-S28 CONTROLS ZUM SELBERBAUEN — KLAPPABSCHNITTE UND ARM-POSING

Georg, nach drei Fehlversuchen von mir: »sonst bau mir halt Controls für das Selberbauen … mit
Klappern … und Arm-Posing.« Das Blatt ist umgebaut:

- **Sieben Klappabschnitte** (Figur · Schnitt · Basis · Einpassen · Cockpit · Arme · Messen), offen
  ist nur, was er braucht. Das Panel ist damit auf 312 px lesbar statt eine Rolle.
- **Cockpit von Hand:** jedes Teil (Knüppel · Knopf rund · Knopf eckig · Panel) hat X, Z, Höhe,
  Größe und einen An/Aus-Schalter. Einheiten sind ANTEILE der gemessenen Platte (X/Z Halbbreite,
  Höhe Plattendicke, Größe Halbbreite) — dieselben Zahlen gelten später für jedes Fahrzeug.
  **Meine Automatik ist weg**, die MESSUNG bleibt: je Teil steht im Bericht, wie viele
  Figurenpunkte in seiner Box liegen und ob es über die Platte ragt. Messen ja, entscheiden nein.
- **Arm-Posing:** je Seite Schulter heben, Schulter vor, Ellbogen. Gedreht wird ab der gemerkten
  BINDELAGE, und die Haltung wird nach jedem Bild neu aufgelegt, weil der Idle-Clip die Armknochen
  jedes Bild überschreibt (die Spuren `upperarml/r`, `lowerarml/r`, `handl/r` liegen im Clip).
  Ein Knopf »am Knüppel (Vorschlag)« setzt beide Arme auf eine brauchbare Haltung.
  Gemessen: rechte Hand wandert zwischen Bindelage und Vorschlag **0,559** Einheiten.

**⚠ Und eine Hausregel hat wieder zugeschlagen:** meine erste Messung sagte »Arm-Posing wirkt
nicht« — Zähler 0 Takte. Die Bildschleife war im **verborgenen** Vorschaufenster geparkt, nicht der
Bau war kaputt. Zwei Folgen: selbst rendern, bevor gemessen wird (steht in CLAUDE.md), UND der
Regler legt die Haltung jetzt sofort auf und rendert einmal selbst, statt auf den Takt zu warten.

## 2026-09-12 · P33-S27 DIE BLAUEN AUGEN WAREN MEINE — UND DAS COCKPIT SITZT JETZT GEMESSEN

**Georgs Frage »warum setzen wir Standards, wenn wir sie selbst nicht umsetzen« trifft mich zu Recht.**
Die blauen Augen und die blaue Kleidung kamen NICHT aus seiner Konfiguration, sondern aus **meiner
Meßprobe**: die Palette »blau«, die ich zum Prüfen der Rollen gesetzt hatte, stand als Entwurf in
seiner Sitzung (`graft-driver`: `roles {cloth,accent,eyes}` + `palette:"blau"`) — und mein neues
Look-Modul hat sie brav übernommen. Das ist derselbe Fehler wie S20b, nur eine Runde später.
Bereinigt (Rollen und Palette aus allen Entwürfen entfernt); nachgemessen liest der Look jetzt
»Rollen Kleidung — · Akzent — · Augen #f2c93c«, also seinen echten Stand: der Wirt behält sein
Original, die Augen das Kanon-Gelb.
**Regel, die ich mir merken muß:** eine Messung, die über einen Handler schreibt, ist ein Eingriff.

**Cockpit, vier Ansagen, alle gemessen erledigt:**
1 · **Seiten vertauscht.** Die Figur schaut in +z, ihre rechte Hand liegt bei NEGATIVEM x — ich
hatte den Knüppel auf ihre linke Seite gestellt. Knüppel jetzt x −0,52 (weicht gemessen auf −0,67
aus), Knöpfe auf +0,52.
2 · **»Der Knopf steckt im Ärmel — das wäre durch eine Messung klar gewesen.«** Jetzt wird der Umriß
der Figur über dem Schnitt abgetastet, und jedes Teil weicht aus: erst seitlich, dann nach vorn.
Nachgemessen: **alle sieben Cockpitteile null Treffer** gegen die Figur.
3 · **Und das Ausweichen selbst hatte zwei Fehler**, beide gemessen: die Box wurde IN der Schleife
genommen (der Versatz rechnete sich selbst weg, der viereckige Knopf fiel auf y 0 zu Boden), und
das Ausweichen kannte den Plattenrand nicht (x 0,913 bei 0,679 Halbbreite — der Knopf schwebte
neben dem Sockel). Jetzt Box EINMAL am Ursprung, Ausweichen geklemmt auf die Platte.
4 · **Display größer, mittig, versenkt.** Breite jetzt am PLATTENmaß (1,25 × Halbbreite) statt an
der Resttiefe, Mitte auf x = 0, Unterkante 0,237 unter der Oberfläche (die Füße stecken drin), und
der Überstand nach vorn ist auf ein Drittel der Plattentiefe gedeckelt (0,373). Hinterkante bleibt
vor der gemessenen Rumpfvorderkante (0,348).

**Offen und benannt:** im neuen Blatt fehlen **Braue, Nase und Schnurrbart** — die baut das Studio
mit eigenen Wegen (`_browParams` und Geschwister), das Graft-Modul kennt sie nicht. Solange das so
ist, sieht FrizzleBob dort ohne Brauen aus. Nächster Schritt wäre, auch diese drei über `look.v1`
zu führen, damit »1:1 in allen Apps« wirklich stimmt.

## 2026-09-12 · P33-S26 DER LOOK KOMMT AUS DER KONFIGURATION — UND DAS COCKPIT AUS KENNEY-TEILEN

**Georgs Forderung:** »ein Charakter, den ich im Studio konfiguriert habe, soll hier 1:1 aussehen —
dieselbe JSON-Konfiguration in allen Apps.«

Neu: `frizzlegraft-v1/look.v1.js`. Es **liest** den Eintrag statt ihn nachzubauen — Repo-Vertrag
(`kfb-pets.json`), darüber der Sitzungsentwurf des Studios im SELBEN Browser (`localStorage`,
späterer Stand gewinnt Feld für Feld) — und legt ihn in der Reihenfolge auf, in der die Werte
voneinander abhängen: Hände → Hautmodus → Handton → Kopfzonen (die brauchen den gemessenen Handton,
den erst der Hautschnitt erzeugt) → Wirtsrollen → Augen.
Nachgemessen im neuen Blatt, Quelle »Sitzung (Entwurf)«: Palette blau kommt an —
Kleidung **#2f6f8f**, Akzent **#e6a13c**, Augen #2f6f8f, Kopfzonen #f6c19d / #f7cb00; die Materialien
der Arme, des Körpers und der Beine tragen genau diese Werte.
⚠ Offen und benannt: das **Studio** setzt den Look noch über seine eigenen zwei Methoden
(`_applyZones`/`_applyRoles`). Solange beide dasselbe tun, ist es nur doppelt; sobald sich eine
ändert, ist es eine zweite Wahrheit. Nächster Schritt: das Studio auf `look.v1` umstellen.

**Cockpit auf der Platte** (Georgs Bauplan: Joystick vorne rechts als Kugel über der Kante, großer
Knopf links, Keyboard/Panel). Alles aus KENNEY-Teilen, die er verlinkt hat — nicht selbstgedreht:
`button-round.glb` · `button-square.glb` (Platformer-Kit, die Waffenknöpfe) ·
`screen-panel-flat.glb` / `screen-panel-wide.glb` (Factory-Kit, umschaltbar).
Die Anker liegen in **Anteilen der gemessenen Sockelhalbbreite** (Joystick x 0,55 / z 0,55; Knöpfe
x −0,55) — dann gelten dieselben Zahlen für jede Sockelgröße und jedes Fahrzeug. Gemessen: 7 Netze,
Kugel auf Höhe 1,001, Panel 0,747 × 0,464 × 0,498.

**Hände in der Platte:** wird jetzt GEMESSEN statt vermutet — welche Handknochen unter der
Sockeloberkante und innerhalb ihres Umrisses liegen, und wie tief. In der geprüften Haltung:
»Hände frei über der Platte (4 Knochen geprüft)«. Hängen die Arme, steht die Tiefe in der Leiste —
und die Cockpit-Anker sind die Stellen, an die eine Hand später greifen kann.

**Offen:** drei Rover · vier Mechs (Kopfschnitt) · Studio auf `look.v1` · Wortmarke · Hals.

## 2026-09-12 · P33-S25 GESICHT IM NEUEN BLATT · RUCKELN · MANNEQUIN-HANDSCHUHE

**1 · »Das komplette Eye-Rig, Mund etc. fehlt.«** Richtig: das Graft-Modul baut das Gesicht nur,
wenn es die Rig-MODULE bekommt (Rolli-Regel — im Studio baut das Studio sie selbst). Jetzt bekommt
das neue Blatt sie mit, samt der Augen- und Mundwerte aus `headgraft.FB_FACE`, die für die
SCHÄDELBOX abgenommen wurden. Und der Bewohner bekommt seinen Takt (`update(dt)`), sonst blinkt
nichts. Nachgemessen: Augen-Rig da, **2 Augen**, Mund da.
⚠ Dabei bezahlt: `pointer` ist ein ABONNEMENT, kein Punkt — das Modul ruft `pointer.on(cb)` und
will eine Abmeldefunktion zurück (»this.pointer.on is not a function«, Bühne blieb leer).

**2 · »Beim Ziehen flackert und ruckelt es sehr.«** Jeder Regler-Tick riß Schnitt und Sockel ab und
baute beide neu — samt Netzabruf der Sockeldatei. Jetzt: die Datei wird EINMAL geholt und danach nur
geklont, und der Neubau läuft 90 ms nach dem letzten Tick. Gemessen: **20 Regler-Ticks → 1 Neubau**
(vorher 20), ein Sockel.

**3 · Georgs Driver-Einstellung ist die Vorgabe** (Bildschirmfoto 05:43): Schnitthöhe +5 %,
Sitz ×1,60, Breite ×1,20, Höhe 1, Länge 1, Kante vergraben ×1,15.

**4 · Studio: gelbe Zacken am Mannequin-Unterarm.** GEMESSEN: der häufigste Ton unter den
Hand-Kandidaten ist **#ea5229** — kräftiges Orange, also der HANDSCHUH des Mannequins. Er kam durch
die Plausibilitätsprobe (warm, R≥G≥B) und landete danach auch als Gesichtston auf FrizzleBobs
Schnauze. `HOST_HANDS.medium` steht jetzt auf `gloves`: drei von fünf Wirten tragen Handschuhe, ein
Mannequin hat keine Haut. Dazu neu und generell: **kein Texturbeleg, kein Hautschnitt** — ohne
Bildtafel steht die Knochenregel allein, und die zackt am Handgelenk.

## 2026-09-12 · P33-S24b DER SOCKEL-STAPEL: JEDER REGLER-TICK BAUTE EINEN NEUEN

Georg: »das ist alles voll buggy, Regler broken?« — und im Bild lag ein **Stapel Sockel**.
**Ursache, gemessen:** `_apply()` ist asynchron (die Basis wird geladen). Jeder Regler-Tick startete
einen neuen Lauf; zwei Läufe gleichzeitig ergaben zwei Sockel, gemerkt war nur der letzte, der Rest
blieb in der Szene stehen. Jetzt: **ein Lauf zur Zeit**, ein nachgestellter Lauf wird gemerkt und
danach gefahren, und vor dem Einhängen fliegt jeder verirrte `kfb-base`-Knoten hinaus.
Nachgemessen: 12 Regler-Ticks so schnell wie möglich → **ein** Sockel (vorher einer pro Tick).

**Und Georgs eigentlicher Wunsch war ein anderer als meine drei Achsen:** »nur breiter, nicht höher —
und den (ruhig zackigen) Oberkörper hineinstecken, xyz einpassen.« Also drei Regler mehr, aber für
die FIGUR: X seitlich · Y tiefer/höher · Z vor/zurück. Der Sockel bleibt stehen, die Figur wandert,
die Schnittlinie wandert mit — so steckt der zackige Saum im Sockel statt darauf.
Nachgemessen: Breite ×1,8 ergibt 1,865 × **0,311** × 1,865 (Höhe unverändert); Figur 0,20 tiefer →
Schnitt 0,319 unter Sockeloberkante 0,352.

## 2026-09-12 · P33-S24 FALSCHER KÖRPER, ZACKEN, ZU KLEINE BASIS — DREI ANSAGEN VON GEORG

**1 · »Du hast den falschen Body!«** Richtig, und es war der alte: das neue Blatt lud den
Platformer-Spender (die frühere FrizzleBob-Figur). Die aktuelle Figur ist der **Graft** — KayKit-
Körper mit FrizzleBobs Kopf. Jetzt baut das Blatt ihn über `frizzlegraft-v1/graft-biped.v1.js`,
**dasselbe Modul wie das Studio**, mit demselben Kontext (ohne Gesichts-Rigs — die baut das Studio).
Vier Wirte in der Liste: Driver · Mannequin M · Orc Raider · Clown. Nachgemessen: Driver 2,420 hoch,
Hüftlinie 0,519 aus `upperlegl/r`, 866 Dreiecke weg; Clown 2,728 hoch, 1208 weg.

**2 · »Zacken funktionieren nicht.«** Auch richtig — und unvermeidlich, solange nur der INDEX
geteilt wird: das Netz hat keine Punkte auf der Schnittebene, also läuft die Kante über vorhandene
Dreieckskanten und der Saum bekommt Spitzen. Statt ein Planschneiden zu bauen, wird die
**Zackentiefe gemessen** (wie weit behaltene Geometrie unter die Linie reicht: **0,0284** beim
Driver) und die Basis genau so weit höher gesetzt — was unter der Sockeloberkante liegt, ist
verdeckt. Der Regler ist ein Vielfaches dieser gemessenen Tiefe (Vorgabe ×1,15), keine Zahl aus der
Luft, und beides steht im Bericht.

**3 · »Die Base ist zu klein — muß in 3 Ebenen skalierbar sein.«** Grundzugabe 1,2 → **1,6**, und
drei Achsfaktoren obendrauf (Breite · Höhe · Länge, je 0,3–4). Nachgemessen: 1,036 × 0,311 × 1,036
→ Länge ×2 ergibt 2,073 · Höhe ×2 ergibt 0,622 · zurück auf 1/1/1 wieder 1,036.

**Und ein Prüferbefund davor:** der Knopf »FrizzleBob · mit Waffe« lud eine Datei, die es im Projekt
nicht gibt (HTTP 404) und leerte damit die Bühne, während die alten Messzeilen stehen blieben.
Beides erledigt sich mit dem Graft-Weg; die Regel bleibt: **schlägt das Laden fehl, verschwinden die
Zahlen** (»— keine Figur geladen, keine Messung gültig —«).

## 2026-09-12 · P33-S23 LICHT »TAG«: DER TÄTER WAR DAS UMGEBUNGSLICHT

Georg: »Day ist etwas zu überstrahlt, um die Farben gut beurteilen zu können.« **Am Pixel gemessen,
und zwar NUR an der Figur** — Maske aus Bild mit gegen Bild ohne Figur, 45 000 Bildpunkte; das ganze
Bild hätte der Aquarellhimmel verwässert.

| Stand | Mittel | Streuung | Sättigung | sehr hell |
|---|---:|---:|---:|---:|
| vorher | 192 | 46,3 | **0,402** | 1,46 % |
| ohne Umgebungslicht | 140 | 42,3 | 0,659 | 0 % |
| **jetzt** | 153 | **56,0** | **0,585** | **0 %** |

**Nicht die Sonne war zu stark, sondern das Umgebungslicht** (`RoomEnvironment` als
`scene.environment`): es flutet die Figur gleichmäßig und nimmt ihr die Farbe. Deshalb ist `env`
jetzt ein eigener Faktor je Stimmung (auf `envMapIntensity` der Figurenmaterialien, Tag 0,35),
die Flut sinkt (amb 0,55 → 0,16 · hemi 0,55 → 0,26), das Schlüssellicht steigt (×0,5 auf 2,6) und
die Belichtung geht auf 0,82. Sättigung **+46 %**, Streuung +21 %, keine ausgebrannte Stelle.

**⚠ Und ein Fehler auf dem Weg, dieselbe Klasse wie immer:** der Faktor stand gesetzt und wirkte
nicht — `applyLights` läuft VOR dem Figurenaufbau, und `_paintRoles` legt danach neue
Materialkopien an. Gemessen: `envMapIntensity` = 1 trotz 0,35 in der Stimmung. Jetzt legt
`_applyRoles` die Lichtwerte nach jedem Färben noch einmal auf.

## 2026-09-12 · P33-S22b DIE LEINWAND HAT SICH SELBST AUFGEBLÄHT

Vom Prüfer gefunden: das neue Blatt zeigte eine Nahaufnahme der Sockelunterseite und schrieb
viermal »ResizeObserver loop completed with undelivered notifications« in die Konsole. Gemessen:
`canvas` **1248 × 16 056 320** Bildpunkte, `cam.aspect` **0,00008**.

**Ursache, eine Rückkopplung:** die Leinwand lag als Block-Kind IM FLUSS ihres Feldes. Ihre
Attributhöhe bestimmte die Höhe des Feldes, der ResizeObserver sah eine neue Höhe, `setSize`
schrieb sie zurück — und die Höhe wuchs pro Runde. Kein Kamerafehler.

**Behoben an der Wurzel:** Leinwand `position:absolute;inset:0`, beide Rasterkinder mit
`min-height:0`, `fit()` mißt die RASTERZELLE (`getBoundingClientRect`) und klemmt auf 200…4000,
und die Kamera wird aus der Figurenbox gerahmt statt auf eine feste Lage gesetzt (die Figur ist 3,6
Einheiten hoch). Nachgemessen: Leinwand 1064 × 1170 (Feld 532 × 585 bei doppelter Punktdichte),
Seitenverhältnis 0,909, **Figur füllt 29,3 %** des Bildes, keine Konsolenmeldung.

## 2026-09-12 · P33-S22 OBERKÖRPER OHNE HÜFTE, AUF EINER BASIS — EIGENES BLATT

Georgs Wahl: **eigenes Blatt**, Schnitt als **Geometrieschnitt**, Reihenfolge **Basis + Oberkörper
zuerst**. Neu:
- `frizzlegraft-v1/torsobase.v1.js` — Hüftlinie messen · unter der Linie schneiden (unsichtbares
  Material, nichts gelöscht, `undo()`) · Basis laden, skalieren, auf die Schnittlinie setzen.
  Dasselbe Werkzeug wie `headgraft` am Wirtskopf; später tragen es Rover, Mechs und das Studio.
- `KFB Mech & Vehicle Rig v1.dc.html` — die Werkbank dazu: Figur, Schnitt an/aus, Basis an/aus,
  drei Regler (Schnitthöhe als **Anteil der Figurenhöhe**, Basisbreite, Versenkung) und der Befund.

**Drei Messfehler, alle in dieser Sitzung gefunden und behoben:**
1 · Die Hüftlinie kam aus dem Knochen `Hips` — und der ist bei diesem Spender die **Wurzel**, nicht
das Gelenk: y 0,358 bei 3,600 Figurenhöhe, der Schnitt nahm 232 Dreiecke (die Schuhe). Jetzt aus den
**Beinknochen** (`UpperLegL/R`): y 0,408.
2 · Die Basisbreite kam aus der Box aller Netze über der Linie — das sind Ohren und Arme: 2,554
breit, Basis 3,065. Jetzt der **Querschnitt in einer dünnen Scheibe** über dem Schnitt (4 % der
Figurenhöhe), als 5-bis-95-Prozent-Bereich statt als Äußerstes.
3 · Der erste Versuch mit einer 18-%-Scheibe fing bei steigendem Schnitt die **Arme** ein
(Querschnitt sprang 1,33 → 3,13). Mit der dünnen Scheibe: 1,49 · 1,49 · 1,20 über die Schnitthöhen
0,41 / 0,62 / 0,84 — stabil. Ab Brusthöhe (0,2 der Höhe) sind die Arme wirklich da, dann steht 3,05
im Bericht: eine Zahl, die Georg sieht, statt einer, die ich verstecke.

**Noch nicht gebaut:** die drei Rover und die vier Mechs (dort ist der Cartoon-Kopf ein
Geometrieschnitt an EINEM Netz — dasselbe Werkzeug).

## 2026-09-12 · P33-S21 DREI FALSCHE WANNEN — UND DANN VON HAND

**Drei Anläufe, drei falsche Zahlen, und jede war eine Herleitung:**
1 · Länge aus der Beinreichweite → **0,146 × 0,202** innen, ein Zuber (Georg: »die Wanne ist viel zu klein!«)
2 · Länge aus Körpertiefe + Bein → 0,706 × 0,637, fast **quadratisch** (Georg: »und jetzt quadratisch?!«)
3 · Der Fehler dahinter: jede Formel hat die **Proportion des Spendermodells zerstört**, um eine Zahl
zu treffen, die niemand gefordert hat.

**Georgs Satz war die Antwort: »ich kann die gerne per Hand skalieren.«**
Jetzt **uniform** am gemessenen Sitz-Grundriß × Zugabe (Regler), Modellform bleibt — plus ein zweiter
Regler, der die **Länge** streckt (1 = Form des Modells). Kein Automatismus, kein Maßstab-Umschalter.
Gemessen am Clown: Grundriß 0,718 × 0,520 · Zugabe 1,25 · uniform ×0,673 → **innen 0,897 × 1,237**,
Verhältnis 0,725 wie im Modell, außen 1,35 × 1,08 × 2,02 gegen Figur 0,72 breit. Haltung unverändert
(83°/0°/40°/0°), Sitzprobe 5/6.

**Und meine Messung hat diesmal nichts geschrieben** (Hausregel aus S20b): Zustand gesichert, ohne
`save` gemessen, danach zurückgesetzt.

## 2026-09-12 · P33-S21b DIE ACHT DATEIEN FÜR BASIS UND FAHRZEUGE — GEPRÜFT, NICHT GERATEN

Georgs Links, alle acht abgerufen (HTTP 200, alle **autark**: Puffer als base64, keine externen
Bildtafeln — die Textur-Nachlieferung braucht es hier also nicht):

| Datei | KB | Knoten | Netze |
|---|---:|---:|---|
| `button-floor-round.glb` (Basis) | 14 | — | binär |
| `Rover_Round` · `Rover_1` | 402 · 431 | 5 · 5 | `Cube.00x` |
| `Rover_2` | 470 | 7 | `Cube.00x` |
| vier `Mech_*` | 757–1014 | 15 | **je EIN Netz** |

**Zwei Befunde, die den Bauplan entscheiden:**
- Die Rover haben 5–7 Netze mit Namen wie `Cube.003` — die **Satellitenschüssel ist nicht am Namen
  erkennbar**. Sie muß über Lage und Größe gemessen werden (oder Georg klickt sie im Blatt aus).
- Die Mechs haben **ein einziges Netz** für die ganze Figur. »Cartoon-Kopf wegnehmen« ist dort kein
  Ausblenden, sondern ein **Geometrieschnitt** — genau das, was `headgraft` beim Wirtskopf schon tut
  (Netz teilen, oberen Anteil aushängen). Dasselbe Werkzeug trägt auch den **Torso-Schnitt**
  (FrizzleBob ohne Hüfte auf einer Basis).

**Offen:** wo das wohnt (Studio oder eigenes Blatt) · Licht »Tag« · Wortmarke · Hals.

## 2026-09-12 · P33-S20b MEINE MESSPROBE HAT IN GEORGS SITZUNG GESCHRIEBEN

**Vom Prüfer gefunden, und es ist mein Fehler.** Die Meßschleife über die drei Wannen-Maßstäbe lief
über den LEBENDEN Eintrag und rief jedes Mal `_seatApply(..., {save:true})` — das schreibt einen
Entwurf. Stehen geblieben ist der letzte Durchlauf: `graft-clown` trug `pose.tubMode:'leg'` (die
Wanne als Zuber, Hüfte 120° statt Georgs 83°) und dazu `jig:true, jigChosen:true` — womit meine
eigene einmalige Attrappen-Bereinigung ausgerechnet für diese Figur gesperrt war.

Bereinigt: `tubMode` zurück auf `split`, `jig` aus, `jigChosen` entfernt — in der Sitzung
(`localStorage['kfb-pet-studio-v5'].drafts`) und an den lebenden Einträgen. Nachgemessen am Clown:
innen 0,706 × 0,637, Haltung 83°/0°/40°/0°, Attrappe unsichtbar, Sitzprobe 5/6.

**⚠ NEUE BEZAHLTE FALLE (gehört in die Hausregeln): eine Messung darf nichts speichern.**
Wer über `_seatApply`, einen `h.*`-Handler oder irgendetwas mit `_touchPet`/`_ensureInLib` messen
will, mißt am lebenden Entwurf und schreibt in Georgs Arbeit. Richtig: auf einer Kopie messen oder
den Ausgangszustand danach wiederherstellen — und der `save`-Weg bleibt dem Klick vorbehalten.

## 2026-09-12 · P33-S20 DIE WANNE IST DA — UND GEORGS POSE BLEIBT STEHEN

**»Wanne sehe ich nicht« hatte eine dumme Ursache: ZWEI Knöpfe namens »Bathtub«.** Der im
Pose-Abschnitt setzte nur die HALTUNG, das Möbelstück hängt am Sitzprofil im Abschnitt Sitzprobe.
Gemessen an seinem Stand: `_tubs` leer, `seatId` nicht gesetzt. Jetzt holt der Pose-Knopf das Möbel
mit (armchair → neutral_chair · cockpit → pickup · bath → bathtub).

**Und der eigentliche Fehler dahinter:** die Wannen-Haltung überschrieb jedes Mal seine abgenommene
Pose mit festen Werten (`hands:'free', lean:-14, toe:6, spread:12`) und ließ danach den Sitzlöser
Hüfte und Knie neu rechnen. Jetzt gilt das Profil — Georgs Werte (Hüfte 83° · Knie 0° · Fuß 40°) —
und der Löser greift **nur**, wenn die Füße wirklich unter dem Wannenboden liegen. Nachgemessen:
Löser lief nicht, Haltung unverändert, Sitzprobe 5/6.

**Wannen-Maßstab, drei Stände (Georgs Entscheidung: Beinlänge).** Gemessen, bevor gebaut wurde —
und die Messung hat seine Wahl korrigiert:

| Stand | innen (B × L) | Folge |
|---|---|---|
| `leg` (uniform am Bein) | **0,146 × 0,202** | kleiner als die Figur (Körper 0,565 × 0,551) — der Löser rettet mit Hüfte 120°, Sitzprobe 4/6 |
| `width` (uniform, bisher) | 0,706 × 0,974 | Wanne deutlich länger als nötig |
| **`split` (Vorgabe)** | **0,706 × 0,649** | Breite aus dem Körper, Länge aus Körpertiefe + Beinreichweite (Bedarf 0,649) |

Die Beine dieser Figur sind kurz (Reichweite 0,145 in Weltmaßen) und der Körper breit — ein
uniformer Maßstab am Bein kann die Figur nicht fassen. `split` verzerrt das Spendermodell (es gibt
Breite:Länge 0,72 vor), trifft aber beide Bedingungen; bei einer Wanne als FAHRZEUG ist das Maß
wichtiger als die Modelltreue. Alle drei Stände stehen im Umschalter, mit den Zahlen daneben.
⚠ Seitdem ist der Wannen-Maßstab **nicht mehr uniform**: `poseIntoTub` liest die Bodenhöhe jetzt an
`scale.y`, nicht an `scale.x`.

**»copy pose JSON« funktionierte nicht:** im Vorschaufenster ist die Zwischenablage gesperrt, und der
Fehler wurde geschluckt. Jetzt erst die Ablage, und wenn die nicht will, fällt eine Datei heraus
(`kfb-pose-<preset>.json`); die Meldung sagt, was passiert ist.

**Vier Griffe statt drei** (Georg): `rest` auf den Armlehnen · `controls` Knüppel und Knöpfe
(später Lenkrad oder Tastatur auf dem Wasser) · **`wide` auf dem Rand, festhalten** (später auch
Buch und Zeitung) · `free` dem Clip gelassen. `wide` sitzt auf dem gemessenen Armlehnenpunkt, nur
weiter außen und höher, mit zwei Reglern (`gripDx`/`gripDy`). Gemessen: Hände von ±0,432 auf
**±0,552** nach außen, symmetrisch.

**Offen:** Licht »Tag« überstrahlt (Benchmark Mario Kart) · Wortmarke · Hals ·
Wanne als Fahrzeug (Referenz: `KFB Frankenstein Race v1`, dort noch mit Cube-Pet).

## 2026-09-12 · P33-S19b ZWEI FOLGEN DES FIX, VOM PRÜFER GEFUNDEN

**1 · FrizzleBobs Schnauze wurde ORC-GRÜN.** Folge der engeren Schwelle: sie liefert beim Orc erstmals
einen Handton, und der ist `#4fb070`. Die Graft-Vorgabe `zones.face:'hand'` legte ihn prompt auf die
Schnauze — grünes Gesicht, gelbe Arme, niemand hatte es bestellt.
Jetzt wird der gemessene Handton geprüft, bevor er gilt: **warme Ordnung (R≥G≥B) oder nahezu neutral**
(Spanne < 24). Gemessen: Driver `#f6c19d` besteht · Clown `#e5e9eb` besteht · Orc `#4fb070` fällt durch
und wird GEMELDET (`handToneNote`, sichtbar in der Zeile »Haut · Gesicht«), das Gesicht behält den
Spenderton `#fae2aa`. Nachgemessen: Orc-Gesicht #fae2aa · Driver unverändert #f6c19d.

**2 · Die zwei Linien blieben für Georgs Figur sichtbar.** Die neue Vorgabe `jig:false` greift nicht
gegen einen GESPEICHERTEN Wert — und das ist richtig so. Aber ein Wert, den nie jemand gewählt hat,
ist keine Wahl: ohne `pose.jigChosen` wird `jig` beim Aufbau einmalig auf aus gesetzt; wer den Knopf
drückt, setzt `jigChosen` und behält seinen Stand. Nachgemessen an allen drei Wirten: `jig` false,
Attrappe unsichtbar.

## 2026-09-12 · P33-S19 ZACKEN, ZWEI LINIEN, SPREIZEN — VIER BEFUNDE AM BILD

**1 · Die Manschetten-Zacken hatten ZWEI Ursachen, nicht eine.**
*Orc Raider:* die Farbschwelle war zu weit. Orc-Haut `#4fb070` gegen Panzer-Grau `#899499` liegt bei
Abstand² **5829** — unter den alten **96² = 9216**, also wurde der Panzer als Haut bestätigt und
**kein einziges** Dreieck zurückgewiesen. Dazu forderte die Regel eine ABSOLUTE Mehrheit; am Orc
trägt die größte Farbgruppe nur 22 % (Arme aus Panzer und Bandagen). Jetzt: Schwelle **64² = 4096**,
Bedingung »die Gruppe um den Startton trägt mindestens ein Fünftel«.
Gemessen: Orc 0 → **235** zurückgewiesene Dreiecke (Haut 157) · Driver unverändert 272/50 · Clown 0,95
statt 1,00 Gruppenanteil.

*Clown:* dort ist keine Schwelle die Antwort. Am Handknochen hängt ein **Handschuh** (Zackenkante
inbegriffen), und Handschuh UND Unterarm sind derselbe Ton `#e5e9eb` — keine Farbregel kann das
trennen. Also eine **Angabe je Wirt** mit Schalter: *Hände · Haut | Handschuh*
(`HOST_HANDS`: driver skin · medium skin · ninja gloves · clown gloves · orcRaider skin,
`pet.graft.hands` überschreibt). Gemessen am Clown: **0** Haut-Dreiecke, kein `kfb-skin`-Material,
keine Zacken.

**2 · Die zwei dünnen Linien am Boden sind die Attrappe** (`pose-jig`, zwei `LineSegments` —
Sitzlinie und Armlehne, eine sichtbar, eine nicht). Kein Bühnenteil, kein Boden. Sie heißen jetzt so
(`pose-jig · Sitzlinie` · `pose-jig · Armlehne`), und die Vorgabe ist **aus**: eine Messhilfe, die
niemand angefordert hat, ist im Bild ein Rätsel.

**3 · »Knees apart« verschob beide Beine in EINE Richtung.** `sp()` liefert bereits das Vorzeichen,
das das Knie nach außen dreht (es spiegelt intern nach Seite) — das zusätzliche `* -1` war eine
zweite Spiegelung, und zwei heben sich auf. Gemessen (Seitenachse, Spreizen 0 → 25):
vorher **+0,0359 / +0,0360**, nachher **+0,0363 / −0,0372**.

**4 · »Ankle · toe up«** reichte bis 40° und stand damit am Anschlag. Jetzt **−30 bis 75°**.
Badewannen-Vorgabe auf Georgs eigene Werte gesetzt: Hüfte 83° · Knie 0° · Fuß 40° · Knie zusammen.

**Gemessen, aber NICHT entschieden — die Badewanne:** der Sitzlöser rechnet die Beine fast gerade
(Spanne 0,369 von 0,376 möglicher Beinlänge, gemessene Beugung **23,5°**, davon **12,2°** schon in
der Bindepose). Die Wanne ist dabei **7× länger als das Bein reicht** (innen 1,049 · Beinreichweite
0,145 · `fillsLength` **0,138**), weil sie uniform an der KÖRPERBREITE skaliert — das Wannenmodell
gibt Breite:Länge 0,72 vor, die Figur hätte 3. Ein Maßstab kann nur eins treffen; Breite war Georgs
Abnahme. Das ist die offene Frage, nicht ein Fehler.

**Offen:** Wannen-Maßstab (Breite gegen Beinlänge) · Licht »Tag« überstrahlt (Benchmark: Mario Kart)
· Wortmarke · Hals.

## 2026-09-12 · P33-S18 FARBZONEN GENERISCH — UND WARUM MATERIALNAMEN DAFÜR NICHT REICHEN

**Erst gemessen, dann gebaut — und die Messung hat den naheliegenden Plan widerlegt.**
Der Plan aus der Übergabe war eine Rollentabelle über MATERIALNAMEN. Gemessen an drei Wirten:

| Wirt | Materialien | Bildtafel |
|---|---|---|
| Driver | **1** · `driver_texture` | eingebacken |
| Clown | **1** · `clown` | eingebacken |
| Orc Raider | **1** · `orc_texture_A` | **fehlt** (liegt eine Stufe höher in `textures/`) |

Ein Material kann nichts trennen. Was alle drei teilen, sind gleich gebaute **Mesh-Namen**:
`<Name>_ArmLeft/ArmRight/Body/LegLeft/LegRight/Head` plus **ein** Extra (Sunglasses · Hat · Warpack).
Also: **Rollen über Mesh-Namen als Vorgabe, Materialnamen als Rückfall** (FrizzleBobs eigener Spender
trägt sechs Flachfarben — dort greift weiter `applyZones`). Genau Georgs Formularwahl, nur mit dem
Mechanismus, den die Figuren wirklich hergeben.

**Vier Rollen, drei Wege:** Haut = der gemessene Schnitt aus Knochenregel + Texturprobe (unverändert,
der Mesh-Name würde die Manschette zur Hand machen) · Kleidung und Akzent = Mesh-Rollen, gefärbt als
**Kopie** des Materials je Netz · Augen = `rig.setBaseColor`. Dazu fünf freie Paletten
(FrizzleBob · Blau · Rot · Grün · Original), die alle vier Rollen auf einen Klick setzen.

**Abnahme, je Wirt gemessen (Dreiecke):**
Driver Kleidung 2222 · Akzent 390 (Brille) — Orc 2996 · 1230 (Warpack) — Clown 3468 · 518 (Hut).
Kopf in allen drei Fällen übersprungen, `Original` läßt **keinen Rest** zurück.
`pet.graft.roles` geht durch Export und Import unverändert hindurch.

**Zwei Fehler auf dem Weg, beide bezahlt und beide dieselbe Frage — WER GEHÖRT DEM WIRT:**
1 · Erste Regel war negativ (»alles, was nicht Kopf heißt«): am Driver 15 Netze angemalt statt 6 und
**13834** Akzent-Dreiecke statt 390 — mitgenommen wurden namenlose Netze (Mund-Abziehbild, Augen) und
FrizzleBobs Gesicht; die Braue hat ein ShaderMaterial ohne `color` und hat den Anstrich abgebrochen.
2 · Zweite Regel war zu streng (»nur geskinnte Netze«): Brille und Hut sind **nicht geskinnt** und
fielen heraus. Jetzt entscheidet `_hostParts()`: geskinnt **oder** Träger einer Wirts-Bildtafel.

**Dazu:** `orcRaider` und `clown` sind neue Wirte im Roster (`graft-orc` · `graft-clown`), und die
fehlende Bildtafel wird im Modul nachgereicht (Suche unter dem Materialnamen in `textures/`, ``,
`texture/`, `gltf/` über drei Ordnerstufen) — Georgs zweite offene Frage, damit beantwortet.

**Offen:** Wortmarke · Hals als Knopf mit Regler · Rollen für die übrigen Mystery-Figuren
(die Regel steht, jede weitere Figur ist eine Messung, kein Umbau).

## 2026-09-12 · P33-S17 v15 »FRANKENSTEIN« — UND DER RUNDLAUF, GEMESSEN

Blatt umbenannt: **v14 → KFB FrankenStein Studio v15** (Quelle `petstudio-v9/`, Wurzelkopie erzeugt).
Grund (Georg): nach FrizzleBob kommen fremde Körper, Mods und Rigs.

**Georgs Prüfauftrag Import/Export — die Datenschicht ist sauber.** Gemessen an einer Graft-Figur mit
einer Markierung in JEDEM neuen Feld (`graft.zones/neck/size/skin/tone` · `brow.solid·even·cap·round` ·
`nose.wide·tall` · `moustache` · `pose`): **94 Blattfelder raus, 94 zurück, null fehlend, null verändert.**
Die Rig-Leser (`_browParams` · `_noseParams` · `_moustParams`) geben jede Markierung zurück — die Felder
stehen alle in den DEFAULTS der Module, deshalb überleben sie das Wiederlesen.
Alte Datei (`kfb-pets` v1.2.9, 26 Pets) plant mit **0 Feldverlusten**, 23 »same«, 3 »diff« (gemessene
Körperzahlen des bunny), keine Warnung.

**Zwei Löcher gefunden — beide dieselbe Klasse: ein Wert existiert, ist aber nicht angeschlossen.**

1 · **Die Figuren standen nicht in der Datei.** Roster **29** Einträge, Voll-Export **24**: FrizzleBob,
FrizzleBob·Gun, beide Grafts und der Klo-Rolli fielen heraus, weil sie nur im Roster leben und erst mit
der ersten Berührung in die Bibliothek wandern. Das ist die Klasse des Datenverlusts vom 25.8. — die
Figur, an der gebaut wird, stand nicht in der Datei, die alle lesen.
Behoben: `_allPets()` hängt jeden Roster-Eintrag **mit `module`** als ÄLTESTE Quelle ein (ein reicherer
Stand aus Vertrag, Bibliothek oder Entwurf gewinnt weiterhin). Nachgemessen: **29/29 im Export**,
Abnahme **5/5**, Rundlauf über alle 29 **null Feldverluste**, kein Pet ärmer. Das Menü sagt nicht mehr
»Full set (24)«.

2 · **Das Sitzprofil war ein Wegwerfregler.** `state.seatId` lebte nur in der Sitzung, kein Pet trug ein
`seat`-Feld — nach dem Neuladen saß niemand mehr, und im Export stand nichts davon. Jetzt
`pet.seat = { profile, widthK }`, geschrieben **nur bei eigener Wahl** (`opt.save`): die clip-getriebene
Sitzprobe (SEATSTATE) schreibt weiter nichts, sonst schriebe ein abgespielter Clip heimlich eine Haltung
in die Datei. Beim Laden zuerst die Wannenbreite in den Zustand, dann anlegen — die Sitzprobe LIEST
`state.seatWidthK`, ein Aufruf davor hätte den alten Wert genommen.

**Neu am Horizont:** die Animation Library aus WS1 baut auf denselben KayKit-Rigs. `RigCompatibility.json`
(12.09., 3D-Cartoon-Animation-Library) sagt je Figur, ob **Medium** oder **Large** trägt — das ist der
Anschluß für den Anim-Reiter, wenn dort mehr als `Rig_Medium` stehen soll.

**Offen:** Wortmarke · Hals als Knopf mit Regler · Farbzonen generisch.

## 2026-09-12 · P33-S16 DIE BRAUE HAT DREI STÄNDE

Georgs Befund am Bild: die Tube **erbt die unregelmäßige Tuschebreite der Feder**. Auf einer
Fläche liest sich das organisch, auf einem Körper werden daraus eingeschnittene Ecken.

**Drei Stände statt eines Schalters:** Strich (Bändchen wie bisher) · Tube (Feder, organisch) ·
**Balken** (gleichmäßig, runde Enden). Im Balken nimmt der Rig statt der Federkurve EINEN Radius —
den **Mittelwert der Feder über die ganze Kurve**, gemessen statt gewählt, damit der Dicke-Regler
derselbe Regler bleibt. `cap` rundet die Enden wie bei der Nase.

**Gemessen (Dickenstreuung über das mittlere Drittel):**
Tube mit Feder **23,7 %** Streuung · Balken **0 %**. Mittlere Dicke 0,021 gegen 0,019 — der Balken
ist also nicht dünner, nur ruhig.

**Offen:** das Logo. Zwei Wege stehen zur Wahl (Voluntaryismus-V oder die schräge Wortmarke) —
das ist die nächste Runde.

## 2026-09-12 · P33-S15 BRAUEN ALS SCHLAUCH — UND DIE HALSFRAGE, GEMESSEN

**⚠ Erst falsch gemessen.** Georgs Frage war »von der Seite kaum lesbar«, und ich habe eine
BOUNDING BOX berichtet (»Querschnitt so tief wie breit«, 0,0094 Tiefengewinn). Die Projektregel
steht in CLAUDE.md: »getroffen« ist nicht »gesehen« — Sichtbarkeit wird am Pixel gemessen.

**Am Pixel, strenge Seitenansicht, dunkle Tinte gezählt, flach gegen rund:**

| Federbreite | flach | rund (0,8) | rund (1) | Gewinn |
|---|---:|---:|---:|---:|
| 1 | 266 | 309 | **323** | +21 % |
| 2,42 (Georgs Wert) | 589 | 793 | **846** | +44 % |
| 3 | 692 | 984 | **1050** | +52 % |

Frontansicht zum Vergleich: **3242**. Die Seite trägt also rund ein Viertel der Frontpräsenz —
der Schlauch verbessert das deutlich, löst es aber nicht allein. Wer die Braue im Profil voll
lesen will, dreht zusätzlich die Federbreite auf.

**Was der Schlauch ist:** die Braue war ein BÄNDCHEN, zwei Punkte je Abtastung, eine Fläche ohne
Dicke. Jetzt derselbe Verlauf als Ring aus sechs Punkten, Radius = die Tuschebreite, die die Kurve
ohnehin liefert — gleiches Konzept, gleiche Spiegelung, gleiche Maske. 258 → 774 Punkte.
`round` steht auf **1** (voller Kreis); 0,8 hätte 20 % der möglichen Tiefe verschenkt, und die
Tiefe ist hier der Zweck.

**Halsfrage, gemessen statt gebaut:** Schädelunterkante **0,511**, Körperoberkante **0,551** —
die beiden **überlappen um 0,040**, es gibt keine Lücke. Der Schädel ist unten offen (478
Randkanten) und stülpt sich über den Kragen. Der Wirt hat **keinen Halsknochen**, eine Animation
könnte einen Hals also gar nicht bewegen.

**Empfehlung:** kein Hals, solange die Naht überlappt. Ab `neck` > 0,04 entsteht eine echte Lücke
— dann ist ein Zylinder in FrizzleBobs Grundgelb richtig und kann an denselben Regler.

**Offen:** Farbzonen generisch für andere Modelle und freie Paletten (Blau/Rot) · Logo.

## 2026-09-12 · P33-S14 EINE FEHLERKLASSE, SIEBEN FUNDORTE: FESTE FARBEN IM THEME

Der Theme-Umbau hatte **einen** Fehler, aber an sieben Stellen — und jede Runde fand der Prüfer
eine weitere, weil ich jeweils nur die gemeldete geflickt und nicht nach der Klasse gesucht habe:

| Fundort | war | ist |
|---|---|---|
| `V2THEME.tcol` | fester Akzent `#e6a13c` | Token `--tcol` je Stand |
| Seitengrund · Bühne · Pad-Leiste | feste Papierfarben | `--app-bg` · `--stage` · `--pad` |
| `bankLabelStyle` | `#6f6753` | `--chip-text` |
| `pad()` + drei Tint-Paletten | Creme-Chips | Lab-Regel: transparent + Haarlinie, aktiv gefüllt |
| vier Zeilentypen | `--faint` (tertiär) | `--muted` |
| Notizzeile | Amber-Grund hob den Untergrund an | Fläche + Akzentkante (Lab-Shell Z. 127) |
| `_bubbleSections`-Knöpfe | Creme `#f6efd9` auf Amber | `--on-accent` |

**Warum gerade die Blasen zuletzt:** sie bauen ihre Zeilen selbst (`_built: true`) und laufen an
jedem Zeilenbauer vorbei — keine meiner Korrekturen konnte sie erfassen.

**Und ein Messfehler von mir:** ich habe Kontraste erst ohne Alpha-Überlagerung gemessen (meldet
bei halbtransparenten Gründen irreführende Werte) und dann über drei statt fünf Reiter.

**Abnahme, mit Alpha-Überlagerung, alle sichtbaren Textknoten, fünf Reiter, beide Stände:**
Lab 172 · 232 · 61 · 136 · 162 Knoten, schlechtester **5,44** (Face 4,52) ·
Paper dieselben, schlechtester **4,86** (Face 4,52) · **null Knoten unter 4,5.**

## 2026-09-12 · P33-S13 LAB-THEME UND DER PROSA-FILTER

**Theme** aus `KFB Lab UI Shell v1.html` (Claude Design WS1) übernommen, 1:1 auf die vorhandenen
Variablennamen gelegt — kein zweiter Satz Tokens: Grund `#17181a` · Fläche `#1d1f21` · Haarlinie
`#2a2d30` · Hover `#26292c` · Tinte `#e7e7e5` · **EIN Akzent `#e6a13c`**. `paper` ist die helle
Entsprechung in derselben Sprache (`#dedbd4`/`#efece6`), **zwei Stände, ein Schalter** oben rechts.
Schrift: **IBM Plex Sans** für die Oberfläche, **IBM Plex Mono** für Zahlen — als `!important` nur
auf `.v2c`, weil das Blatt »Space Grotesk« in dutzenden Inline-Stilen trägt und kein Stylesheet die
überstimmt. Bühne, Blasen und Wortmarke bleiben unberührt.

**Sieben Reiter-Akzentfarben auf eine.** Rosa, Gold, Türkis, Rot, Violett, Blau, Oliv unterschieden
nichts, was nicht schon an der Aufschrift stand.

**Der eigentliche Befund war die ROLLLÄNGE, nicht die Abschnittszahl.** Nach dem Umbau: Body
**6590 px** in einem 440-px-Fenster, davon 2346 px Erklärprosa. Sechs Abschnitte nach »Messen« zu
hängen half nicht, weil die Prosa INNERHALB der verbliebenen Abschnitte steht — und »offen als
Vorgabe« hat sie erst recht sichtbar gemacht.

**Ein Filter an einer Stelle statt zwei Ad-hoc-Schaltern:** Notizen über 90 Zeichen erscheinen nur
im Reiter »Messen« oder wenn »Erklärtexte« im File-Menü an ist. **Gemessen:** Body 6590 → **3665**
(−44 %), Voice 5054 → 2954, lange Notizen in den vier Gestaltungs-Reitern **0**, in »Messen« 18.

Face bleibt mit 5198 px lang — das sind 80 Zeilen echte Regler (Augen, Brauen, Nase, Schnurrbart,
Mund, Viseme, Asymmetrie, Leben, Kinetik). Das zu kürzen hieße Funktion kürzen, nicht Ballast.

**Farbe steht jetzt ganz oben** im Graft-Abschnitt — vor Hals und Kopfgröße. Georgs Beschwerde war,
daß er die Farbfelder nicht findet; sie lagen 1,5 Bildschirme unter dem Anfang. Die Reihenfolge ist
die Antwort, nicht ein weiterer Regler.

## 2026-09-12 · P33-S12 INTERFACE-UMBAU: ACHT REITER AUF FÜNF, ALLES OFFEN

**Befund, gemessen in Georgs Fenster (832 px, Splitscreen):** 1457 px Inhalt in 491 px Sichtfenster,
**19 Abschnitte gleichzeitig als »offen« gemerkt**, aber Vorgabe `false` — also war alles zugeklappt.
Georg hat die Farbfelder nicht gefunden, obwohl sie da waren. Kein Scroll-Fehler: das Panel rollt.
Das Problem war Rangordnung, nicht Mechanik.

**Umgesetzt nach seinem Formular:**
- **Fünf Reiter statt acht:** Body (+ Pad) · Face (+ Actor) · Motion (+ Anim) · Voice (+ Bubbles) ·
  **Messen**. Abschnitte je Reiter: 7 · 10 · 6 · 7 · 6.
- **Offen ist die Vorgabe**, Überschriften kleben oben (`position:sticky`), kleiner gesetzt
  (13 px statt 15), weniger Polster (9/8 px statt 14/14).
- **Messdaten in einen eigenen Reiter** — sechs Abschnitte wandern dorthin (Body contract ·
  Ground plane · Driver contract · Anchors · Zählwerk · Dateien).
- **Ohne Klick da:** Bewegungen und Gesichtsausdruck stehen jetzt in JEDEM Reiter unten, nicht nur
  im Gesicht; die Figurenwahl steht im Kopf.

**Als ZUORDNUNG gebaut, nicht als Umzug.** `V2CFG` bleibt, wo es ist; `V2MERGE` und `V2MESS` sagen
nur, was wohin gehört. Wer Abschnitte verschiebt, verschiebt auch ihre Zeilenbauer — und sucht dann
beides. Alte Reiterkennungen einer gemerkten Sitzung werden umgelenkt (`V2TABREDIR`), sonst zeigt
`v2tab: 'pad'` nach dem Umbau ins Leere.

**Ein Abschnitt darf das Panel nicht mehr mitnehmen.** Der Voice-Reiter starb an
»Cannot read properties of undefined«, weil der Blasen-Shaper erst beim Reiterwechsel geweckt wird.
Jeder Zeilenbauer läuft jetzt in seinem eigenen Netz: der Abschnitt sagt, was ihm fehlt, die
anderen stehen weiter.

**Das Blatt liegt jetzt auf der Wurzel** (`KFB FrizzleBob Studio v14.dc.html`), damit es im Dropdown
steht. Es wird aus `petstudio-v9/…` ERZEUGT — Unterschied ist eine Zeile `__KFB_MODBASE`, weil die
Module in `petstudio-v9/` bleiben. Die Quelle ist das Blatt im Unterordner.

**Offen, in Georgs Reihenfolge:** Zonen generisch (Rollen als Vorgabe, Materialnamen als Rückfall) ·
Logo (T-Shirt weg, Rücken bekommt ein cartoonig gesalbtes Voluntaryismus-V) · Import/Export-Prüfung,
ob alle neuen Felder mitkommen und alte Cube-Pet-Dateien noch laden.

## 2026-09-12 · P33-S11 FARBE IN DREI ZONEN, REGLER STATT ZAHLEN

Georg: »Farbregler für die einzelnen Zonen — und die Meterdaten verstecken, damit das als Interface
dient.« Der Body-Tab hat jetzt drei Farbzeilen und keinen Messtext mehr im Weg:

- **Gesicht** (Schnauze + Zier): fünf Hauttöne plus »Hände« · zweite Zeile mit den abgeleiteten
  Ständen (Körper + 40 % weiß · Hände heller · Original)
- **Hände**: gemessen · **wie Gesicht** · vier Töne
- **FB-Gelb** (Körper + Ohren): Original plus fünf Gelbs · Sättigungsregler

**»Wie Gesicht« ist eine BINDUNG, kein gespeicherter Farbwert** — sie wird beim Anlegen der Zonen
nachgezogen, folgt dem Gesicht also auch, wenn es sich später ändert. Ein GEWÄHLTER Ton schlägt
jede Ableitung: Georgs Regler gewinnt gegen meine Formel.

**Abnahme:** Vorgabe → Gesicht #f6c19d (gemessener Handton), Körper #f7cb00 · Gesicht gewählt
#e8b48a → Hände folgen auf #e8b48a · Gelb gewählt #ffd51e → nur der Körper ändert sich.

Die Messtexte (Haut-Trennung, Dreieckszahlen, Zonenbericht) liegen hinter dem Schalter »Zahlen«,
wie schon in der Sitzprobe.

**Vom Mund abgerückt:** Georg hat die Schattengrenze am Kinn selbst über den `Hug`-Regler gelöst
(»jetzt passt der Mund eigentlich gut«) — kein Kinnschatten nötig.

**Offen, von Georg benannt:** das `GO`-Logo auf T-Shirt und Jackenrücken soll weg, auf den Rücken
stattdessen ein großflächiges Voluntaryismus-**V** mit abgerundeten Ecken, dessen Gelb das FB-Gelb
ist (Quelle: `VforVoluntary_normal.svg`). Dazu die Frage, ob Tabs zusammengelegt werden.

## 2026-09-12 · P33-S10 DIE ZONEN GAB ES SCHON — DER TRANSPLANT HAT SIE WEGGEWORFEN

Referenz von Georg: **KFB Combat Arena v5b** (`combat-arena-v1/frizzlebob.v1.js` +
`gun-look.v4a.js#matchBellyZone`). Dort teilen sich **Gesicht, Zier und Hände** einen Ton, der
Körper trägt das FB-Gelb — und zwar **ohne Schnitt**: die Zonen liegen als MATERIALNAMEN im
Spender (`Main` · `Main_Light` · `Main2`). Ich hätte einen Schnitt gebaut, wo eine Referenz lag.

**Zwei Gründe, warum das im Studio nicht zu sehen war:**

1. **Die Zonenlogik lag brach.** `frizzlebob.v4a` hat sie (`only: ['Main','Main_Light']`,
   `lightMix: 0.4`) — aber nur im Tint-Pfad, und der ist AUS, weil das Gelb aus der gepatchten
   Datei kommt. Neue Methode `applyZones()` wirkt unabhängig davon.
2. **`headgraft` hat die Zone gemessen und dann weggeworfen.** `isLight` diente nur als Rückfall
   für die Blickrichtung; der verpflanzte Kopf bekam EIN flaches Material. Jetzt zwei
   Zeichengruppen und zwei benannte Materialien — **gemessen: 1372 Dreiecke `Main`, 128
   `Main_Light`** (die Schnauze).

**Abnahme:** Handton **gemessen** aus der Arm-Textur des Wirts = **#f6c19d** (nicht gewählt).
Gesichtszone nimmt ihn exakt an; FB-Gelb bei Sättigung 1,25 → **#f7cb00** (satter, Helligkeit
bleibt — Sättigung im HSL-Raum, damit der Ton nicht ins Braune kippt). Vier Modi im Body-Tab
(wie die Hände / Körper + 40 % weiß / Hände heller / Original) plus Sättigungsregler. Vorgabe des
Graft-Eintrags: Handton, Sättigung 1,25.

## 2026-09-12 · P33-S9 BRAUEN UND NASE, GLOBAL (Georgs vier Befunde am Gesicht)

Alle drei Änderungen liegen in den MODULEN, gelten also für jeden Bewohner, nicht nur für den Graft.

**1. Brauen standen zu weit vor dem Kopf.** Der Regler dafür existierte — er hieß »Float in front of
the face« und stand auf **0,92 Augenradien**, also fast einen ganzen Radius vor der Stirn. Vorgabe
jetzt **0,30**, Spanne **−1 bis 2** (negativ = in den Kopf hinein), Aufschrift auf Deutsch:
»Abstand vom Kopf · 0 = auf der Stirn«. **Gemessen:** 0,92 → 0,30 zieht die Braue **0,094** näher.
Ein Pet mit eigenem gespeicherten Wert behält ihn.

**2. Brauen waren unterschiedlich groß — und Georgs Vermutung war richtig: die Linienkonstruktion.**
Die Federbreite kommt aus einer GESEEDETEN Tuschesimulation, die links und rechts verschieden
ausfällt (handgezeichneter Eindruck, ursprünglich so gewollt). **Gemessen:** mittlere Breite links
0,0166 · rechts 0,0230 — die rechte Braue war **39 % breiter**. Neuer Schalter `symmetric`
(Vorgabe an) spiegelt die linke Hälfte auf die rechte: **Unterschied 0,0064 → 0,0001.**

**3. Nase: Breite und Höhe getrennt.** `size` war EIN Faktor für alle drei Achsen. `wide` und `tall`
liegen als Faktoren oben drauf, Vorgabe 1 — gespeicherte Pets sehen unverändert aus. **Gemessen:**
`wide 1,8` ändert nur X (0,0786 → 0,1401), `tall 0,5` nur Y (0,0675 → 0,0340).

**Offen (Georgs vierter Punkt):** Gesicht heller im Handton, restlicher Kopf in einem anderen Ton.
Dazu braucht es eine Entscheidung, WO das Gesicht endet — der Schädel ist ein Netz mit einem
Material. Frage liegt bei Georg.

**Nachtrag zur Wanne:** Nicht-Uniform-Skalierung wieder herausgenommen (Georg hat das Bild mit
Breite als Bezug abgenommen). Stattdessen neuer Prüfpunkt **»Figur füllt das Möbelstück«** als
Verhältnis Beinreichweite ÷ Innenlänge (Schwelle 45 %) — vorher konnte »kleiner Punkt in einer
viel zu großen Wanne« 5/5 bestehen, weil kein Prüfpunkt danach fragte.

## 2026-09-12 · P33-S8 EIN FELD IST GÜLTIG, WENN SEIN ERZEUGER GELAUFEN IST

Dreimal in Folge stand in `SeatProfiles.json` eine Zahl, die nichts messen konnte — und jedes Mal
habe ich das Tor an der falschen Stelle geschlossen. **Grundursache:** `measure()` baute ZWEI fest
verdrahtete Ergebnisformen (Löser an / Löser aus). Jede Zustandskombination, die ich nicht
vorhergesehen hatte, rutschte durch. Zuletzt: `hands: 'free'` bei eingeschaltetem Löser — das Tor
hing am Löser, nicht an der Hand, und `miss: 0,465` stand wieder in der Datei.

**Eine Form, und je Feld ein Wenn.** `solverOff` (Gelenkwinkel, Sitzebene, Kopffreiheit) und
`handsOff` (Handziele) sind getrennte Fragen; jedes Feld geht durch `V(bedingung, wert)` und ist
sonst `null` mit Begründung im `notes`-Feld.

**Und `legsPosed` wird abgeleitet, nicht konstantiert.** Es stand als fixes `false` in
`seatLikeRace` — aus der Zeit, als das Rennrezept die Beinlösung absichtlich wegließ — und danach
in derselben Datei neben `kneeDelta: 11,3`. Eine Übergabedatei, die sich selbst widerspricht, ist
schlimmer als eine ohne Feld.

**Abnahme der Datei (Badewanne):** `passed 5/5` · `solver: on` · `handSolver: off` ·
`handTargets: null` · `fit.legsPosed: true` · `limits` nennt die gemessene Beindurchdringung
(0,000 / 0,000 / 0,000), den abgeschalteten Handlöser und die fehlende Decke ·
`visibility.method` benennt die fünf festen Prüfansichten statt der Nutzerkamera.

## 2026-09-12 · P33-S7 ER SITZT — MIT AUSGESTRECKTEN BEINEN (Georgs Befund: »DER STEHT IN DER WANNE«)

**Das Rennrezept war die falsche Antwort auf die richtige Frage.** Das Rennen *versteckt* die Beine
(Figur unter den Wasserspiegel, keine Beinlösung) — und weil der Clip die Beine gerade hält, liest
sich das als STEHEN in einer Wanne. Georg will ein Sitzen. Also: Beine wieder LÖSEN, aber mit dem
inzwischen richtigen Wannenmaß.

**Und derselbe Einheitenfehler zum zweiten Mal, diesmal im Beinlöser.** Die Hüfte kam aus
`root.worldToLocal` (Wurzelmaß), der Wannenboden aus `tubObj.position.y` (Weltmaß). Gemessen:
»0,309 über dem Boden«, tatsächlich 0,021. Der Löser hielt das Bein für zu kurz und ließ es fast
senkrecht hängen — **genau das Stehen, das Georg gesehen hat.** Jetzt wird der Boden erst in das
Maß geholt, in dem die Knochenlängen leben.

**Abnahme Badewanne 5/5:** Knie 11,3° von 11,3° · Hüfte 71,3° von 70,9° · Gesäß 0,000 auf der
Sitzfläche · Hände dem Clip überlassen (also nicht geprüft, statt eine Zahl zu erfinden) · **nichts
unter dem Boden, nichts durch die Wand, nichts über das Ende.** Fuß 0,323 vor der Hüfte, 0,358 hoch
— ausgestreckt auf dem Wannenboden.

**Zwei Korrekturen an der Abnahme selbst (Befunde des Prüfers):**

1. **Eine Abnahmezahl darf nicht am Kamerastand hängen.** Der Sichtbarkeitstest strahlte von der
   Nutzerkamera: dieselbe Pose, vier Kamerastände → 18/6 · 16/8 · 24/0 · 17/7. »24 von 24 verdeckt«
   war ein Befund über einen Blickwinkel. Jetzt: **fünf feste Prüfansichten** (Front · Seite · 3/4 ·
   Hinten · oben), Ausgabe als Verhältnis plus die schlechteste Ansicht mit Namen.
2. **Sichtbarkeit ist jetzt nur noch Angabe, kein Prüfpunkt.** Sie gehörte zur Versteck-Strategie.
   Sind die Beine gelöst, sagt der Wannentest schon, daß nichts draußen liegt — und »von oben sieht
   man die Beine« ist keine Rüge, sondern der Sinn einer offenen Wanne.

**Übergabedatei aufgeräumt:** bei abgeschaltetem Löser stehen Knie, Hüfte, Sitzabstand und
Handziele als `null` mit Begründung statt als Zahlen, die nichts messen (`miss: 0,441` beschrieb
einen Handlöser, der gar nicht läuft). Dafür stehen jetzt Maßstab (`fit`), Sichtbarkeit (`vis`,
samt Methode und Ansichten) und ein `limits`-Feld darin, das die Beindurchdringung benennt.

## 2026-09-12 · P33-S6 DER MASSSTABSFEHLER HATTE ZWEI TEILE (Georgs Bild: Hase steht im Fußbad)

**1. Falscher Elternknoten.** Die Wanne hing am Figurenknoten, und der ist skaliert (die Bühne
zieht jeden Bewohner auf Pet-Höhe). Rechnung sagte Breite 1,368, im Bild waren es 0,57. Die Wanne
hängt jetzt in der **Szene**, damit Welt- und Rechenmaß dieselben sind.

**2. Falscher Bezug, und gemischte Einheiten.** Das Rennen skaliert die Wanne an der HÖHE des
Fahrers (2,1 zu 1,55). Bei dieser Figur sind aber **54 % der Höhe Kopf und Ohren** — die Wanne
bekam das Maß eines Körpers, den es hier nicht gibt. Dazu kam: `pose.a` liefert Schulter 1,412 und
Hüfte 0,490 in **Wurzeleinheiten**, die Box3 dagegen 1,013 in **Weltmaßen**. Beides in eine Formel
geschrieben rechnet Äpfel gegen Birnen.

**Zwischenschritt, der auch falsch war:** Schulterbreite als Bezug. Der Abstand der Oberarmknochen
ist **0,177** — die Jacke ist doppelt so breit. Damit wurde die Wanne 0,265 innen, also zu klein.

**Jetzt:** Bezug ist die gemessene **Körperbreite im Bild** (X-Ausdehnung **0,810**) × 1,25 →
Wanne ×0,760, innen **1,013 × 1,398 × 0,205**, Wasser auf 0,305, Hüfte 0,132 darunter. Der Faktor
steht als **Regler** im Panel, damit Georg ihn am Bild statt an meiner Meinung einstellt.

**Und das Panel selbst:** Georgs zweiter Satz war »ich kann gar nichts einstellen, weil überall
Messdaten stehen«. Regler stehen jetzt oben, das Ergebnis ist **eine** Zeile, und alle Zahlen und
Begründungen liegen hinter dem Schalter **»Zahlen«**. Der Panel ist zum Bedienen da; der Beleg
gehört in die Konsole und auf Abruf.

**Offen und gemeldet:** 0,088 Bein unter dem Wannenboden · 6 von 24 Beinpunkten aus flachem
Blickwinkel über dem Nahrand sichtbar. Beides steht am Bildschirm, nicht als grüner Haken.

## 2026-09-12 · P33-S5 KORREKTUR: DAS RENNEN HATTE DAS LÄNGST GELÖST — UND MEINEN WEG VERWORFEN

**Zwei Fehler, beide meine.**

**1. Ich habe neu erfunden, was es gab.** `frankenstein-v1/race/src/driver.v2.js`, Zeile 52, wörtlich:
»seat mode: **NO leg solve**. The analytic two-bone solve bent the legs visibly (F1-S5, Georg's
picture); the module's own pose stays, the host puts the hips under the waterline.« Das Rennen
setzt die Figur nicht in die Wanne **hinein**, es **senkt** sie unter den Wasserspiegel. Die Beine
werden nicht gebeugt, sie werden **verdeckt**. Gemessene Werte aus `vehicles.v1.js` (`frizzle_bath`):
Wannenbreite **2,1** · Fahrerhöhe **1,55** · Hüfte **0,28** unter Wasser. Genau diesen analytischen
Beinlöser, den ich gebaut habe, hat das Rennen an Georgs Bild schon einmal verworfen.

**2. Ich habe nicht hingesehen.** Fünf grüne Haken, und das Bild zeigte einen Hasen, der in einem
Fußbad steht. Die Ursache war banal und sofort sichtbar gewesen: die Wanne hing am **Figurenknoten**,
und der ist skaliert (die Bühne zieht jeden Bewohner auf Pet-Höhe). Die Rechnung sagte Breite 1,368,
im Bild waren es 0,57. **Eine Zahl ohne Bild ist kein Beleg.** Die Wanne hängt jetzt in der Szene.

**Was jetzt gilt (Rezept aus dem Rennen, nicht meins):**
Figur 1,010 hoch → Maßstabsverhältnis 0,651 → Wanne ×0,684 (Breite **1,368**), Wasserspiegel 0,356,
Hüfte **0,182** darunter. Sitzlöser AUS; die Bindehaltung wird ausdrücklich wiederhergestellt
(`set({on:false})` allein ließ die Knochen in der alten Sitzhaltung stehen — Hüfte auf 17 % der
Körperhöhe, und die Wanne wurde auf eine Haltung gerechnet, die nicht mehr galt).

**Die Abnahme mißt jetzt das Richtige: Sichtbarkeit, nicht Geometrie.**
Vom Oberschenkel bis zum Fuß werden 24 Punkte je Strahl zur Kamera geprüft. **24 von 24 unter Wasser
verdeckt, 0 sichtbar.** Punkte ÜBER dem Spiegel werden ausgenommen — die gehören zur sichtbaren
Figur, kein Fehler.

**Und die unbequeme Zahl, die bleibt:** **0,154 Bein steckt unter dem Wannenboden.** Das ist der
Handel, den das Rennen eingeht, und er steht so am Bildschirm statt als grüner Haken. »Getroffen«
ist nicht »gesehen« — jetzt wird beides gezählt und beides gemeldet.

## 2026-09-11 · P33-S4 DIE WANNE IST JETZT DER PRÜFKÖRPER (Georgs Befund: geraten statt gemessen)

**Georg hatte recht, und der Fehler hat einen Namen: ein Prüfpunkt, der nicht durchfallen kann.**
Die Badewannen-Werte waren Daumenwerte (»flacher sitzen, Beine weiter ausgestreckt«), und weil
keine Wanne in der Szene lag, stand »Beindurchdringung: nicht gemessen« daneben und alles war
grün. Jetzt wird `Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf` geladen und abgetastet.

**Die Wanne, von oben abgestrahlt:** Innenboden **0,740** · Rand **1,010** · Tiefe **0,270** ·
innen **1,333 × 1,839**. Der Hahn (Spitze 1,602) fällt aus der Häufigkeitsrechnung heraus, er
bildet keinen Gipfel.

**Drei Größen kommen jetzt aus der Wanne statt aus dem Kopf:**

1. **Maßstab** aus der gemessenen Beinkette (0,542) — nicht aus der Haltung. Erster Versuch nahm
   Hüfte→Ferse in Sitzhaltung: bei 46° Kniebeugung sind das 0,237, und die Wanne schrumpfte auf
   Puppenmaß (Innenlänge 0,32 bei einer 1,6 hohen Figur). Jetzt Maßstab **0,398**, innen
   **0,732 × 0,531 × 0,107**; es bindet die Länge.
2. **Die Haltung** aus dem Innenraum: Knöchel auf den Innenboden, 0,329 vor der Hüfte, Hüft- und
   Kniewinkel per Kosinussatz → **Hüfte 70,5° · Knie 11,3°**. Die alten 68°/46° ließen die Füße
   unter der Sitzebene hängen — genau die Füße, die Georg durchstechen sah.
3. **Das Spreizen** so weit, wie die Wanne breit ist: 15° → **8,2°**, in Schritten gemessen und
   zurückgenommen, bis nichts mehr durch die Wand ragt.

**Abnahme Badewanne: 5/5.** Nichts unter dem Boden, nichts durch die Wand, nichts über das Ende
(20 Abtastpunkte entlang Oberschenkel, Schienbein und Fuß beider Beine, im EIGENEN Raum der Wanne
gerechnet, damit die Drehung nicht lügt).

**Eine Zahl, die nicht schön ist und deshalb erst recht dasteht:** das Modell ist flach — Tiefe
15 % der Länge. Auf die Beinlänge skaliert reicht der Rand der Figur nur bis etwa zur Hüfte. Das
ist die Form des Spenders, kein Fehler des Grafts, und es steht am Bildschirm.

## 2026-09-11 · P33-S3 SITZPROBE, FAHR-ACTING — UND WARUM DIE ARME HINGEN

`frizzlegraft-v1/seat-lab.v1.js` (neu) + Abschnitt **Sitzprobe** im Anim-Reiter. Fünf Profile
(Stuhl · **Badewanne** · Lastwagen · Pickup · Mech), Fahr-Acting, `SeatProfiles.json`.

**Die Arme hingen, weil der Unterarm falsch gemessen war.** `PoseRig` bildet die Unterarmlänge als
`fist.position.length()` — das ist der Abstand zum ELTERNKNOCHEN. Beim Platformer-Hasen stimmt das
(Unterarm → Faust direkt). Beim KayKit-Rig hängt ein Handgelenk dazwischen: `lowerarm → wrist →
hand`. Gemessen wurde **0,074** statt **0,334**; die Reichweite kam als 0,316 heraus, das Ziel lag
bei 0,438 — und der Löser streckte den Arm vergeblich ins Leere. Jetzt wird die Kette abgelaufen und
aufsummiert. **Handabweichung 0,206 → 0,004.**

**Drei weitere Befunde derselben Sitzung:**

1. **»procedural« war Aufschrift ohne Handlung.** Die fünf Zustände sind jetzt eine Rechnung:
   Lenken neigt den Oberkörper (±14°), Gas legt ihn zurück, Bremse nach vorn, Luft spannt an,
   Landung stößt kurz und klingt von selbst ab; der Kopf hält mit 0,45 dagegen. Die Schicht liegt
   ÜBER Mixer und Pose und multipliziert darauf — sie liest den Fahrzeugzustand und schreibt ihn nie.
2. **Ein Aufruf zu wenig.** `PoseRig.set()` legt die Werte des `preset` ZULETZT auf — in einem
   Aufruf überschrieb die Voreinstellung die Profilwerte, und »Lastwagen« war heimlich »Stuhl«
   (Knie 97° in beiden, obwohl 92 und 86 gefordert waren). Jetzt zwei Aufrufe.
3. **Ein Prüfpunkt ohne Maßstab ist kein Prüfpunkt.** »Kopffreiheit 0,6 bis 2,2« war eine
   ausgedachte Spanne, an der zwei Profile durchfielen, ohne daß irgendwo ein Dach war. Die Höhe
   wird jetzt BERICHTET, nicht benotet — prüfbar erst gegen eine Cockpit-Decke.

**Der Kniewinkel kann lügen.** Beim Platformer-FrizzleBob hängt `FootL` am **Root**, nicht am
Unterschenkel; der Winkel aus (Knöchel − Knie) bleibt dann auf dem Bindewert stehen und sieht dabei
völlig gesund aus. Die Probe prüft die Kette und gibt bei offener Kette **keine** Kniezahl aus.

**Abnahme am Graft-Driver: alle fünf Profile 4/4** — Knie und Hüfte folgen dem Regler aufs Grad,
Sitzabstand 0,000 in allen fünf (Sitzfläche wird an die gemessene Unterseite von Becken und
Oberschenkeln gezogen, nicht auf einen Daumenwert gesetzt), größte Handabweichung 0,025.

**Nicht gemessen, und das steht auch so am Bildschirm:** ob die Beine durch die Wanne stechen — es
gibt kein Wannennetz. Und die Kopffreiheit — es gibt keine Decke.

**Jump:** auf Georgs Befund von `Jump_Full_Short` (liest sich als Hüpfen) auf `Jump_Full_Long`
umgestellt, das Hüpfen bleibt Zweitbesetzung.

## 2026-09-11 · P33-S2 DIE ZUORDNUNG (24 Spielzustände auf 139 echte Namen)

`frizzlegraft-v1/anim-map.v1.js` (neu) + Abschnitt **Zuordnung** im Anim-Reiter. Die Datei hält
**Muster, keine Namen** — welcher Clip ein Muster erfüllt, entscheidet das gezählte Inventar. Ein
Zustand ohne Treffer ist FEHLT, auch wenn ich glaube, es müßte ihn geben.

**Ergebnis, gegen die Dateien gemessen:** **10 genau · 8 anpassbar · 5 gerechnet · 1 fehlt.**

- **Genau (10):** Idle→`Idle_A` · Walk→`Walking_A` · Run→`Running_A` · Jump→`Jump_Full_Short` ·
  Wave→`Waving` · Cheer→`Cheering` · Interact→`Interact` · Hit→`Hit_A` ·
  Melee→`Melee_Unarmed_Attack_Punch_A` · Work→`Working_A`
- **Anpassbar (8):** SitVehicle und DriveIdle→`Sit_Chair_Idle` · SitRelaxed→`Sit_Floor_Idle` ·
  EnterVehicle→`Sit_Chair_Down` · ExitVehicle→`Sit_Chair_StandUp` · Recover→`Lie_StandUp` ·
  ToyShoot→`Ranged_1H_Shoot` · DriveLandingReact→`Jump_Land`
- **Gerechnet (5):** die vier Lenk-/Gas-/Brems-Neigungen und das Anspannen in der Luft —
  Presentation aus dem Fahrzeugzustand, keine Physik (Briefing §13).
- **Fehlt (1): Dance.** Kein Tanzclip im ganzen Paket. Cheering ist Jubel, kein Tanz.

**Die untere Leiste tat beim Graft nichts — still.** Sie suchte `/^Idle$/` in den EIGENEN Clips der
Figur; der Driver bringt keine mit, also passierte nichts und niemand erfuhr warum. Jetzt geht sie
durch dieselbe Zuordnung. Zwei Knöpfe versprechen mehr, als der Spender hat, und **sagen das**:
»Dance« spielt Cheering, »Eat« spielt Interact.

**Ausgabe zusätzlich:** `AnimationMap.json` · `MISSING_ANIMATIONS.md`.

**Nächster Schritt (Briefing §8):** die Sitzprobe. Badewanne zuerst, das ist der Test, an dem der
alte Ansatz gescheitert ist.

## 2026-09-11 · P33-S1 DAS ZÄHLWERK (Briefing §4: erst zählen, dann entscheiden, was fehlt)

`frizzlegraft-v1/anim-audit.v1.js` (neu) + Reiter **Anim** im Studio v14. Drei Abschnitte: zählen ·
 abspielen · ausgeben. Kein Clipname stammt aus Dokumentation oder Erinnerung — alle acht
`Rig_Medium`-Dateien werden geladen und `gltf.animations[]` ausgelesen.

**Abnahme (gemessen, nicht behauptet):** **139 Clips in 8 Sätzen** — General 15 · MovementBasic 11 ·
MovementAdvanced 13 · Simulation 14 · CombatMelee 22 · CombatRanged 20 · Special 15 · Tools 29.
Davon **91 Schleifen-Kandidaten**, **79 mit Wurzelbewegung**, **13 Standbilder**. Abspielen läuft
über den vorhandenen Weg (`loadCategory` / `play`) — kein zweiter Abspieler.

**Zwei Dinge, die die Messung selbst korrigiert hat:**

1. **Ein Standbild ist keine Schleife.** Die `*_Pose`-Clips haben **Dauer 0**; erster und letzter
   Schlüssel sind derselbe, der Abstand also null — die reine Formel gab »Schleife: ja« aus.
   Jetzt ist Dauer > 0 Bedingung, und das Standbild wird als solches benannt.
2. **Kein Commit-Hash in SOURCE_PATHS.** Der Ladeweg zieht den Zweig `main`, keinen Stand. Ein
   geratener Hash wäre schlimmer als keiner — das steht so in der Datei.

**Ausgabe:** `AnimationInventory_Medium.json` · `AnimationInventory.md` · `SOURCE_PATHS.md`, alle
aus derselben Messung, Knopf im Abschnitt »Dateien«.

**Noch offen (Briefing §5–§11):** das semantische Mapping der 24 KFB-Zustände gegen diese 139
Namen, danach die Sitzprobe (Badewanne) — in dieser Reihenfolge.

## 2026-09-11 · G1-S4 DIE MANSCHETTE IST KEINE HAUT (Georgs Befund: gelbe Flecken am Ärmel)

Der Knochen allein lügt am Handgelenk. **Gemessen** in `Driver_ArmLeft`: von 164 Dreiecken, die
die Knochenregel als Haut ausgab, liegen **136 auf dem Hautton der Textur (255,190,160)** und
**28 auf Ärmel-Orange (224,96,0)** — die Manschetten-Zacken. Sie hängen am `handl`-Knochen, weil
sie sich mit der Hand mitbewegen, gehören aber zur Jacke.

**Zweite Hälfte der Frage: die Textur.** Nach der Knochenauswahl wird je Dreieck die Grundtextur
am UV-Schwerpunkt abgetastet; der häufigste Ton unter den Kandidaten ist die Haut, alles weiter
als 96 (RGB-Abstand) davon geht zurück an die Kleidung. Netze ohne Textur behalten die reine
Knochenregel.

**Abnahme:** `rejected: 50` (28 links + 22 rechts), `skinTris: 272`, `clothTris: 1950` — genau die
gemessene Zahl, keine andere.

**Merksatz, der dazu gehört:** `flipY` ist bei GLTF **false**. Mit der falschen Annahme landete die
Probe auf dem Handschuh statt auf der Hand, und die Mehrheit war grün statt hautfarben — eine
Messung, die plausibel aussah und falsch war.

## 2026-09-11 · G1-S1 DER GANZE KOPF SITZT (Georgs Wahl: Schädel + Ohren + Gesicht)

`frizzlegraft-v1/headgraft.v1.js` (neu) + Knopf **»Kopf v13«** im Lab. Georgs zwei Entscheidungen
sind der Vertrag des Moduls: **Umfang** = Schädel + Ohren + Gesichts-Rig, Wirtskopf aus dem Bild ·
**Größe** = der WIRT bestimmt, der Spenderkopf wird auf die gemessene Kopfbox gelegt.

**Abnahme am Driver:** 1500 Dreiecke aus `[Ear1L, Ear1R, Ear2L, Ear2R, Ear3L, Ear3R, Head]` ·
Spender **2,489 × 2,334 × 1,562** → Maßstab **0,455** → **1,132 × 1,062 × 0,711** · Blick über
**IK-Zielpunkte (0°)** · Wirtskopf ausgeblendet: **956 Dreiecke + 1 eigenes Netz**. Augen, Braue,
Nase und Mund hängen am NEUEN Kopf. Ab- und anschaltbar, der Zustand davor wird hergestellt.

**Drei Dinge, die dieses Modul anders macht als `ears.v2`:**

1. **Schädel und Ohren sind EIN Netz.** Wer `head` ODER `ear*` als stärksten Knochen hat, ist
   Kopf. Die Naht, an der `ears.v1` ein Loch hinterließ, existiert hier nicht mehr.
2. **Der Wirtskopf wird ausgeblendet, nicht geschnitten.** Das Netz wird in zwei Zeichengruppen
   geteilt (Körper · Kopf), die Kopfgruppe bekommt ein unsichtbares Material. Punktgenau, läuft mit
   jeder Bewegung mit, umkehrbar. Eine Klemmebene über dem Hals hätte die erhobene Hand mitgenommen.
   **Gemessen: any 956 = most 956 = all 956** — am Driver mischt KEIN Dreieck Kopf und Hals, die
   Grenze ist sauber. Das ist die Zahl, die die Regel überhaupt erst zur Wahl macht.
3. **Die Blickrichtung des Spenders wird gemessen**, nicht angenommen.

**⚠ Zwei eigene Fehler, im ersten Bild gefangen:**

- **EIN IK-Zielpunkt ist keine Blickrichtung.** `PoleTarget.L` liegt seitlich versetzt und lieferte
  **28,7° statt 0** — der Kopf stand schief auf dem Körper. Beide Zielpunkte gemittelt: **0,0°**.
  *Eine Richtung aus einem einzigen seitlichen Punkt ist eine halbe Messung.*
- **Die Sonnenbrille blieb im Bild stehen.** Sie ist ein **eigenes Netz** am Kopfknochen, kein Teil
  des Kopfnetzes; mein Filter übersprang Netze mit mehreren Materialien. Jetzt: Netze mit Häutung
  werden geteilt, Netze ohne werden ab dem Kopfknochen abwärts unsichtbar geschaltet (`noMeasure`
  schützt unser eigenes Gesicht davor). *Ein Kopf besteht aus mehr Netzen als dem Kopfnetz.*

**Nicht gebaut, Georgs Reihenfolge:** die neun Regler (Kopfgröße · Höhe · Neigung · Augen · Braue ·
Nase · Mund · Gelb · Blickziel) — erst soll die Lage abgenommen sein, sonst stehen Regler auf Zahlen,
die sich noch ändern. Danach die Cockpit-Szene (Sitz · Pult · Kamera) für KFB-Stunt-Car-Race.

**Antwort auf Georgs Frage »Studio v13 standalone exportieren?«: nein, nicht nötig.** Der Ladeweg von
v13 ist gemessen und liegt im Anhang: `studio-v12/` (frizzlebob.v4a · pet-eye-rig.v6 · brow-rig.v2 ·
pet-nose.v2 · pet-moustache.v1 · gun-look.v4a · weapon-mods.v1 · ground-plane.v2) +
`studio-v13/` (pose-rig.v1 · pad-base.v2) + `studio-v10/KloRolli.js`. Hier liegen die sechs davon,
die der Kopf braucht — der Rest kommt erst mit den Tabs.

## 2026-09-11 · G1-S5 NUR DIE HAUT NIMMT DEN KOPFTON (Georgs Befund: ganze Figur gelb war zu viel)

Georg: »den Hautton vom KOPF nehmen, bei den Händen ist es ja schon so; Jacke, Kragen, Ärmel, Hose
und die aufgemalten Logos NICHT gelb.«

**⚠ Warum die erste Fassung das nicht konnte — gemessen, nicht vermutet:** die Textur des Drivers
(1024²) hat **626 Farbgruppen**, und die größten sind Brauntöne: **#9c5a45 (4,2 %) · #b37052 (2,7 %)
· #a4634a · #7d3d2c · #ab6a4e** — das ist die **Lederjacke**. Haut ist ebenfalls ein warmes Braun.
**Farbe kann Haut und Lederjacke nicht trennen.** Eine Formel über die Sättigung färbt beide, und
genau das war im Bild zu sehen.

**Die zweite Messung gab die Trennlinie:** der Driver ist **kein einziges Netz**, sondern **sieben an
EINEM Material** (Arm links/rechts · Körper · Kopf · Bein links/rechts · Brille) — und in
`Driver_ArmLeft` stecken **Ärmel UND Hand zusammen** (103 von 278 Punkten hängen an
`handl`/`wristl`). Also entscheidet je **DREIECK**, welcher Knochen der stärkste ist: Hand und
Handgelenk sind Haut, alles andere ist Kleidung. **Zwei von drei Punkten** — ein Dreieck am
Handgelenk gehört der Hand, der Saum bleibt beim Ärmel.

**Der Ton wird GEMESSEN, nicht gewählt:** die Hautfarbe kommt aus dem Material des aufgesetzten
Kopfes (#f2c93a). Vier Schwatzfarben stehen daneben, falls Georg eine andere will.

**Abnahme am Driver:** **322 Dreiecke Haut** in **2 Netzen** · **1900 Dreiecke Kleidung unberührt** ·
0 Bildpunkte in der Textur verändert — Jacke, Hemd mit aufgedrucktem Logo, Hose und Schuhe behalten
Bild für Bild ihr Original. Drei Stände im Body-Tab: **nur Haut** (Vorgabe) · **ganze Figur**
(Georgs erste Wahl, bleibt als Rückweg) · **Original**.

### ⚠ Der Fehler, der beim Bauen entstand und im ersten Bild gefangen wurde

**Zwei Eigentümer derselben Zeichengruppen.** `headgraft` teilt das Netz `Driver_Head`, um den
Wirtskopf unsichtbar zu schalten. Die Haut-Färbung teilte danach **dasselbe Netz erneut** — und hing
den unsichtbaren Anteil aus: gemessen zeichnete `Driver_Head` mit `kfb-skin` statt unsichtbar
(`[0→m0 | 2868→m1]` wurde zu `[0→m0 | 2868→m2]`). Im Bild fiel es nicht auf, **weil FrizzleBobs
größerer Kopf davorstand** — bei kleinerem Kopf wäre der Wirtskopf herausgeragt.
**Unsichtbar aus Glück ist nicht unsichtbar.** Jetzt trägt ein geteiltes Netz die Marke
`kfbHostHeadSplit`, und jeder weitere Teiler läßt es in Ruhe. *Wer eine Zeichengruppe teilt, muß
fragen, ob sie schon jemandem gehört.*

### Offen, Georgs Frage nach den Texturen

Der Wirt ist **bemalt** (1024²-Textur mit gemalter Schattierung), FrizzleBobs Kopf ist **flach**
(Flachfarben in der Datei, keine Textur). Sie passen heute nicht zusammen, weil sie in zwei
verschiedenen Sprachen gemalt sind. Drei Wege, Georgs Entscheidung — Vorschlag im Chat.
Ebenfalls offen: die **Wortmarke** auf Hemd und Rücken (Textur-Insel, messbar, noch nicht angefaßt).

## 2026-09-11 · G1-S4 DER GRAFT IST BEWOHNER — ALLE TABS GREIFEN

`frizzlegraft-v1/graft-biped.v1.js` (neu) + zwei Einträge im Verzeichnis von v14
(**Graft · Driver**, **Graft · Mannequin M**). Das Modul **erbt von FrizzleBob** und tauscht genau
eine Sache: welcher Körper geladen wird. Clips, Mixer, Boden, Bericht, Gesichtsrahmen — alles geerbt.

**Warum das billig war, gemessen vor der ersten Zeile:** `_buildBiped` fragt sein Modul nach sechs
Dingen (`variant` · `mount` · `ready` · `figure` · `faceBox` · `faceCtx()`) und baut das Gesicht
dann SELBST (Rolli-Regel, Blatt Z. 1547–1550). Und FrizzleBobs Modul spielt ohnehin das
**KayKit-Animationsset** — dasselbe Skelett, das der Wirt mitbringt.

**Abnahme am Driver (Studio, sichtbares Fenster, selbst gerendert):** Klasse `GraftBiped` ·
`faceBox.name === 'body'` (der Vertrag) · Schädel 1,851 × 2,058 × 1,562 → Maßstab **0,516** →
**0,955 × 1,062 × 0,806** · Wirtskopf ausgeblendet 956 Dreiecke + 1 eigenes Netz · 26 Clips ·
Ruhehaltung **Idle_A (General)** · Halsregler gemessen 0 → 0,35 → 0, der Kopf folgt.

### Drei eigene Fehler, alle beim ersten Lauf gefangen

1. **»Eine Figur, eine Farbe« ging ins Leere: 0 von 1 Material umgefärbt.** Der Driver hat **EIN**
   Material, und seine Farbe ist **Weiß** — seine ganze Bemalung steckt in der **TEXTUR**. Das ist
   derselbe Befund wie bei den Augen (»der Kopf trägt ein gemaltes Gesicht«), nur für den Körper.
   Eine Grundfarbe umzufärben kann dort per Konstruktion nichts bewirken.
   **Der Kanon hatte die Antwort eine Ebene tiefer:** `pet-library.v6._recolorMap` färbt seit jeher
   COLORMAPS mit genau dieser Formel. Jetzt wird die Textur Bildpunkt für Bildpunkt umgefärbt —
   gesättigte werden gelb nach ihrer Helligkeit, neutrale (Weiß, Schwarz, Grau) bleiben, sonst
   verliert die Figur ihre Zeichnung. **Gemessen: 702.058 Bildpunkte**, Jacke und Stiefel behalten
   ihre Nähte. Original und gelbe Fassung liegen nebeneinander, Abschalten hängt zurück.
   *Wer eine Grundfarbe umfärbt, wo eine Textur malt, dreht am falschen Regler.*
2. **Die Figur stand mit waagerecht ausgestreckten Armen da — und der Bau war in Ordnung.**
   Gemessen: der gespielte Clip hieß **`Jump_Idle`**. `MovementBasic` enthält für dieses Rig KEIN
   Idle (nur Jump, Running, Walking, T-Pose); der geerbte Aufbau sucht `/idle/i` und trifft den
   Sprung. FrizzleBob fällt das nie auf — er bringt 19 EIGENE Clips mit, ein KayKit-Wirt keinen.
   Jetzt wird `General` mitgeladen, dort liegen die Idles. **`Idle_A`.**
   *Ein geerbter Griff ins richtige Paket ist beim Erben ein Griff ins falsche.*
3. **Der Kopf stand schief und die Brille blieb** — siehe G1-S1, beide behoben.

### Georgs Regler stehen im Body-Tab

Zwei Schieber, beide als **Anteile der gemessenen Wirts-Kopfbox** (eine Zahl in Einheiten wäre für
den Driver richtig und für das Mannequin falsch): **Hals** (−0,30 … 0,60) und **Kopfgröße**
(0,60 … 1,80). Die Werte gehören dem EINTRAG (`pet.graft`), nicht der Sitzung — sonst wäre es ein
Wegwerfregler. Die Waffen-Mods erscheinen beim Graft nicht: eine Faust gehört dem Spender.

### Offen

- Die restlichen Regler aus Georgs Liste (Neigung · Augen · Braue · Nase · Mund · Blickziel) —
  Augen, Braue, Nase und Mund haben ihre eigenen Reiter und greifen bereits; Neigung und Blickziel
  fehlen noch als Schieber.
- Die **Cockpit-Szene** (Sitz · Pult · Kamera) für KFB-Stunt-Car-Race. Das Sitz-Rig aus v13
  (`studio-v13/pose-rig.v1.js`) liegt im Ladeweg und gilt für Zweibeiner — der Graft ist einer.

## 2026-09-11 · G1-S3 STUDIO v14 STARTET — ALLE TABS SIND DA (Georgs Wahl: forken, nicht nachbauen)

`petstudio-v9/KFB FrizzleBob Studio v14.dc.html` — Fork von v13, **zwei Zeilen geändert** (Abzeichen
v13 → v14, Messgriff `window.__STUDIO14` zusätzlich). Body · Face · Actor · Motion · Voice ·
Bubbles · Pad stehen, Emote- und Visem-Leiste steht, FrizzleBob wird gebaut.

**Abnahme (im sichtbaren Fenster, selbst gerendert — im verborgenen stand `tri 4`):**
27 Einträge im Bewohnerverzeichnis · 24 Pets aus dem Repo v1.2.8 · FrizzleBob gebaut,
**Kopf-Host 1,851 × 2,058 × 1,562 auf Knochen `Head`** · 21.568 Dreiecke, 23 Zeichenaufrufe ·
keine Fehler in der Konsole.

**Die Bestätigung, die zählt:** die Kopfbox, die das Studio für FrizzleBob misst, ist **Zeichen für
Zeichen dieselbe**, die `headgraft` als Schädelbox misst (1,851 × 2,058 × 1,562). Zwei Wege, eine
Zahl — die Gesichtsbox des Grafts ist damit dieselbe Box, die die Tabs bedienen.

**Ladeweg gemessen und geholt** (23 Dateien): `studio-v3/` (pet-library.v6 · pet-mouth.v1 ·
pet-puppet.v1 · kfb-pets.json) · `studio-v7/` (pet-session.v1 · pet-metrics.v1 · bubble-shaper.v3 ·
edge-treatment.v1 · bubble-kiss.v1) · `studio-v8/` (ground-contract.v1 · contract-guard.v1) ·
`studio-v9/` (pad-contract.v1 · bubble-tail.v1) · `studio-v10/KloRolli.js` · `studio-v12/` (acht
Module) · `studio-v13/` (pad-base.v2 · pose-rig.v1) · `podcast-v2/` (bubbles.v4 · bubbles.v5 ·
bubble-shapes.json) · `kfb-pinball-audio.js` · `kfb-ink-canon.js`.

**Ein Loch beim ersten Start, sofort geschlossen:** `podcast-v2/bubble-shapes.json` fehlte — die
Sprechblasen-Formgebung meldete »Shaper aus«. *Ein Ladeweg besteht nicht nur aus Code; eine
Datenzeile fehlt genauso laut wie ein Modul, aber nur, wenn man die Konsole liest.*

**NICHT gebaut, die nächste Scheibe:** der Graft als **Bewohner**. Der Weg ist gemessen und billig —
`_buildBiped` fragt das Modul nach `figure` und `faceBox`, und **FrizzleBobs eigenes Modul spielt
bereits das KayKit-Animationsset** (`SPEC.anims.dir = KayKit_Character_Animations_1.1/.../Rig_Medium/`).
Ein Graft-Modul mit derselben Schnittstelle (KayKit-Körper, FrizzleBob-Kopf) reiht sich also als
`kind: 'biped'` ein, und alle Tabs greifen ohne eine Zeile neue Oberfläche. Dazu Georgs zwei
Entscheidungen: **Halsregler** (der Kopf darf höher, das Loch im Schädel nimmt den Hals auf) und
**eine Figur, eine Farbe** (Kopf und Körper beide im KFB-Gelb).

## 2026-09-11 · G1-S2 DAS GESICHT SASS FALSCH — DER SPENDER HATTE DIE ANTWORT IM KOPF

Georgs Bild 20:17: Kopf sitzt, Gesicht sitzt falsch, Kopf wirkt gedrückt. **Eine Ursache, zwei
Wirkungen** — und sie stand wörtlich im Spendermodul (`frizzlebob.v4a` Z. 60):

> `headExcludeRe: /ear/i` — »GEMESSEN: Ear1–3 L/R hängen am Head; **mit ihnen wäre die Kopf-Box
> 2,489 × 2,334 statt Kopf allein**«

FrizzleBobs eigenes Studio setzt sein Gesicht auf den **Schädel**, nicht auf Schädel plus Ohren.
G1-S1 hat die volle Box genommen: das Gesicht bekam einen Rahmen, der fast doppelt so hoch ist wie
der Schädel (Augen zu hoch, Nase auf dem Auge), und die Ohren wurden mit in die Wirtskopfbox
gequetscht (daher »zu kompakt«). **Die Box des TEILS, nie die des Ganzen — und für das Gesicht ist
ein Kopf MIT Ohren schon »das Ganze«.**

**Zwei Boxen jetzt:** der **Schädel** bekommt das Maß des Wirtskopfs, die **Ohren ragen darüber
hinaus** (wie an einem Hasen), die **Gesichtsbox ist die Schädelbox**. Dazu: liegt der Kopf auf,
gelten **FrizzleBobs eigene Augen- und Mundwerte** (Georgs Abnahme 05.09., `SPEC.eyes`/`SPEC.mouth`),
nicht die an KayKit-Köpfen abgenommenen. *Ein Anker, der für einen anderen Kopf abgenommen wurde,
ist auf diesem Kopf eine Vermutung.*

**Abnahme am Mannequin M:** Schädel **1,851 × 2,058 × 1,562** (mit Ohren 2,489 × 2,334 × 1,562) →
Maßstab **0,537** → **0,994 × 1,105 × 0,838** · Blick 0° · Wirtskopf ausgeblendet 966 Dreiecke
(any = most = all).

**Georgs Halsfrage ist gemessen: der Schädel ist unten OFFEN.** 478 Randkanten (Kanten, die zu genau
einem Dreieck gehören; ein geschlossenes Netz hat null), die unterste 0,118 über der
Schädelunterkante. **Es gibt also ein Loch, und der Hals des KayKit-Modells kann darin stecken** —
der Kopf darf höher sitzen, ohne dass eine Naht entsteht. Zumachen wäre die falsche Antwort.

## 2026-09-11 · UMZUG GEMESSEN, NICHTS AM BAU GEÄNDERT

Der Ladeweg läuft in diesem frischen Projekt **vollständig**. Am Mannequin M gemessen, im
sichtbaren Fenster, selbst gerendert:

- **139 Bewegungen** in der Leiste, Figur lädt, Idle A läuft (69 Spuren).
- **»FB-Gesicht« sitzt** — Augen, Braue, Nase auf dem gemessenen Kopf-Host, Lider blinzeln.
- **»FB-Ohren« sitzt** — 2 Stück, Ohrlänge **1,049** auf Kopfhöhe **1,105**.

Mitgebracht wurden neun Dateien (Ladeweg oben in `CLAUDE.md`), plus der Spender
`FrizzleBob_Yellow.gltf`, den die Ohren brauchen. **Keine Zeile Code geändert.**

**Georgs Befund zu `ears.v2` ist damit gemessen, nicht mehr nur berichtet:** die zwei Ohren
stehen zu eng, die Basen schieben sich zusammen und bilden eine Dreiecksform. Offen bleiben
**Abstand, Skalierung und Trennung** der beiden Ohren. Grundaufbau tragfähig.

**Warum das alte Projekt nicht mehr arbeitsfähig war (Diagnose, nicht Beweis):** seine
Instructions waren über **100.000 Zeichen** lang und werden in JEDE Unterhaltung eingespielt,
dazu 1358 Dateien und ein Dutzend paralleler Baustellen im selben Ordner. Dieses Projekt hält
**eine** Baustelle und Instructions unter 60 Zeilen.

## Stand der Baustelle (aus dem alten LIVING übernommen)

`buildFaceHost({THREE, figure})` misst an einer **beliebigen** Figur: Kopfknochen per Namen
(head · skull) · Kopfbox aus den Punkten, deren stärkste Bindung dieser Knochen ist (die Box
des TEILS, nie die des ganzen Spenders) · Blickrichtung aus den Zehen (`toes` liegt vor
`foot`) · gemessen in der **Bindepose** (`Skeleton.pose()`). Daraus entsteht eine unsichtbare
Box namens **`body`** — der Name ist Vertrag, EyeRig und PetMouth suchen genau ihn.
**Die Rigs sind unverändert.**

**Abnahme am Farmer A:** Host auf Knochen `head` · 1,682 × 1,292 × 1,429 · Blick über Zehen
(0°) · 1751 von 5246 Punkten am Kopf. Ab- und anschaltbar, Zustand davor wird hergestellt.

**`ears.v2.js` — eine Regel:** der Spender liefert die **Form**, der Wirt bestimmt **Lage und
Größe**. Ein Ohr ist **ein** Netz (kein Schnitt durch ein nahtloses Bauteil, also auch kein
Loch); Ansatz, Abstand, Neigung und Länge sind **Anteile der gemessenen Wirts-Kopfbox**,
keine Längen — eine Zahl in Einheiten wäre für einen Kopf richtig und für die 42 anderen falsch.
Rückweg: im Blatt eine Zeile auf `ears.v1.js`.

## Drei Befunde, die alle auf dasselbe zeigen

1. **Die Kopfbox ist zu groß, weil der HUT am Kopfknochen hängt** (1,68 breit gegen einen
   Schädel von etwa 0,9) — die Augen werden auf die Hutbreite skaliert und geraten zu groß.
   Hebel ist da (`shrink`); saubere Lösung: Hut/Haar als eigene Materialinsel ausnehmen.
2. **Die eigenen Augen der Figur stecken in der TEXTUR**, nicht in Geometrie — nicht
   ausblendbar, unsere Augen liegen darüber.
3. **»Gelb« multipliziert die Textur** und ergibt Oliv, nicht KFB-Gelb.

**Alle drei sind dieselbe Sache: der Kopf trägt ein gemaltes Gesicht.** Die Geometrie ist kein
Hindernis — die Textur ist es. Damit ist »Kopf tauschen oder Gesicht aufsetzen« entschieden,
aber anders als gedacht: **nicht der Kopf muß weg, sondern seine Bemalung.**

## Offen (nicht gebaut)

- **Die Ohren: Abstand, Skalierung, Trennung.** Georgs Dreiecksform.
- Haar/Hut als Insel ausnehmen und den Schädel flach einfärben (löst alle drei Befunde).
- Der Mund sitzt mit Standardmaßen; er gehört auf die gemessene Kopfhöhe gestellt.
- **Vertagte Entscheidung:** den KOMPLETTEN Kopf aus FrizzleBob Studio v13 auf die KayKit-Figur
  setzen statt nur Gesicht und Ohren. Bedingung (Georg): die Bewegungsbibliothek der Wirtsfigur
  muß mit dem neuen Kopf weiterlaufen. Eigenes, frisches Blatt — nicht in diesem Lab.
