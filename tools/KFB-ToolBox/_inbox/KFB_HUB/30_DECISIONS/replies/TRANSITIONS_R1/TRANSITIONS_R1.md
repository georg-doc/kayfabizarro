# TRANSITIONS R1 · Portale, Intro-Zoom und Zustandswechsel · Recherche + Architektur · 2026-11-04

**Kurz:** "Tiny Skies" gibt es wirklich, und es ist genau das Spiel aus Georgs Erinnerung: ein three.js-Browserspiel von Danny Limanseta (Vibe Jam 2026) mit ovalen, drehenden, wabernden Portalen und einem Intro-Flug vom Globus hinunter zum Fahrzeug. Der Quellcode ist öffentlich und lässt sich lesen.
**Wichtigster Fund:** Gut ist dort der Kameraflug (eine einzige Bahn mit Übergabe ohne Sprung). Der Wechsel in eine andere Welt ist dagegen nur eine schwarze Blende von 0,5 + 0,8 s. Für KFB übernehmen wir deshalb Kameraflug und Portal-Optik, ersetzen die Blende aber durch einen Tunnel in der Welt selbst, hinter dem geladen wird.
**Vorschlag:** ein `TransitionDirector` mit genau einer Event-Uhr. Jeder Übergang ist ein Rezept (JSON) aus Phasen, Spuren und Zeitspannen-Markern und eine reine Funktion von t. Die Zielwelt wird schon vor dem Tunnelende vorgeladen, und ein Halte-Loop wartet, bis sie bereit ist.

---

## 1 · Referenzen und Techniken

### 1.1 Tiny Skies (Danny Limanseta, 2026): das gesuchte Spiel

**Identität.** Es ist ein Browserspiel aus Vite, TypeScript, three.js und Socket.io, gebaut mit Cursor. Man fliegt Doppeldecker, fliegenden Teppich oder Boot um einen kleinen Planeten und entzündet fünf Feuerschalen gegen den fallenden Mond. Eingereicht wurde es zum Vibe Jam 2026, Ende April 2026. Listing-Seiten nennen Auszeichnungen, das habe ich nicht gegengeprüft. Spielbar ist es unter tinyskies.vercel.app, der Code liegt öffentlich auf GitHub (`dannylimanseta/tinyskies`). KFB kennt das Spiel schon: V-092 (Regen, Aurora, Flare portiert) und V-093 („Portale und Tornados TBD“). Die Analyse unten stammt aus dem Lesen des Codes. Code und Assets übernehmen wir nicht, nur die Techniken.

Es gibt **zwei Portal-Arten**. Beide passen zu Georgs Erinnerung.

**A · Portal-Paar (vom Spieler gesetzt, blau/orange wie bei „Portal“)**
- **Form:** Eine dünne Ringröhre (Torus), darin eine Scheibe mit Shader (dunkle Mitte, heller Rand, weiß glühende Kante). Dazu kommen zwei weitere, dünnere Tori als „Wirbel“ und eine Glow-Fläche.
- **Oval statt rund:** Die ganze Gruppe ist ungleich skaliert (x ≈ 0,65, y ≈ 1,25). Ein Kreis wird so zu einem hohen, schmalen Oval, ohne dass es eine eigene Geometrie braucht.
- **Öffnen in 0,5 s:**
  - Skalierung mit *easeOutBack*, also mit kleinem Überschwinger.
  - Die Form bleibt in der ersten Hälfte rund und morpht erst in der zweiten Hälfte per *smoothstep* zum Oval.
  - Gleichzeitig dreht sich das Portal einmal um eine halbe Umdrehung in die Ruhelage.
  - Ein Zusatz-Wackeln mit hoher Frequenz klingt mit (1 − t) ab.
- **Ruhe-Leben (das „Wabern“):**
  - zwei Wirbel-Tori, die gegenläufig rotieren (ca. 3,5 bzw. 2,8 rad/s);
  - eine Skalierung, die in x und y mit leicht verschiedenen Frequenzen ±2 % atmet (ca. 2 Hz);
  - ein Ring-Puls von ±2 % und ein Glow-Puls von ±5 % mit langsamerer Frequenz;
  - im Shader wird der Radius über den Winkel verbogen, so wird der Rand organisch wellig. Die Amplitude ist beim Öffnen größer und sinkt danach auf einen Rest.
  - Jedes Portal hat einen eigenen Phasen-Versatz, damit zwei Portale nie synchron pulsieren.
- **Auslösen:**
  - Getestet wird die **Strecke** von der letzten zur aktuellen Spielerposition gegen die Portal-Ebene: Vorzeichenwechsel der Tiefe, dann Schnittpunkt, dann Radius-Check. Das ist kein Punkt-in-Kugel-Test, deshalb fliegt auch ein schnelles Fahrzeug nie „durch“, ohne dass es auslöst.
  - Der Treffer-Radius (0,22) ist größer als der sichtbare Ring (0,15), damit das Auslösen verzeiht.
  - **Scharfschalten:** Ein Portal löst erst aus, wenn der Spieler nach dem letzten Sprung einmal weiter als ein Mindestabstand weg war. Dazu kommen 0,3 s Abklingzeit. So gibt es kein Ping-Pong am Ausgang.
  - **Richtungs-Mapping:** Die Flugrichtung wird aus dem Rahmen des Eingangs-Portals (vorne/rechts/oben) in den Rahmen des Ausgangs übertragen. Die Geschwindigkeit bleibt erhalten.
  - Der Austritt liegt ein Stück vor dem Ausgang, mit **Mindesthöhe über Gelände**, damit niemand im Boden landet.
- **Sprung selbst:** Es ist ein harter Schnitt. Die Kamera springt sofort an die neue Position, Spuren, Kielwasser und Laub-Partikel werden zurückgesetzt, das Portal-SFX läuft, und die Interaktion ist 0,18 s gesperrt. Ein Durchblick in die Zielwelt wird nicht gerendert.

**B · „Kosmisches“ Weltportal (führt in die Void-Welt)**
- **Optik:**
  - eine Fläche mit gemaltem Riss-Bild (rift.png);
  - eine additive, blaue Halo-Sprite, etwa 4× so groß wie das Portal;
  - ca. 80 funkelnde Punkt-Sterne mit eigener Phase je Stern;
  - die Riss-Fläche ist 16×16 unterteilt, und ein Vertex-Shader schiebt die Punkte sanft per Sinus/Cosinus über UV und Zeit. Daher das langsame Wabern, ohne dass es teuer wird.
- **Ausrichtung = zylindrisches Billboard:**
  - Das Portal schaut immer zur Kamera, bleibt dabei aber **aufrecht zur Planetenoberfläche**: „oben“ ist die Oberflächennormale.
  - Ziel laut Code-Kommentar ist, dass das hohe Oval beim Kurvenflug mit gerollter Kamera nicht mitkippt.
  - Das ist genau die Regel, die wir für KFB-Sprites brauchen (siehe 2.6).
- **Platzierung:**
  - Die Portale werden aus einem Seed erzeugt, nur auf Land und mit Mindestabstand zueinander.
  - Sie schweben über Gelände plus Schwebehöhe plus Sicherheitsabstand.
  - Sie werden erst **2 s nach Ende des Intros** eingeblendet.
- **Auslösen:** reine Nähe (Abstand < 0,45), ohne Taste. „Einfach reinfliegen.“

**Intro: Globus → Fahrzeug (der Teil, den Georg als „sehr gut“ erinnert).** Der Code zeigt, warum er so wirkt:
1. **Menü-Globus:**
   - Die Kamera kreist langsam um den Planeten, mit fester Neigung von ca. 15°.
   - Beim Betreten zoomt sie in 1,35 s von 110 % auf 100 % Abstand, mit *ease-out cubic* (schnell rein, weich aus).
   - Die Kreisgeschwindigkeit wird dabei hochgefahren, statt hart zu starten.
   - Fürs Menü gibt es eine eigene Wanduhr-Delta-Zeit, weil die Spieluhr an anderer Stelle doppelt abgefragt wurde. Das zeigt, warum KFB genau **eine** Uhrquelle braucht.
2. **Start = derselbe Kamerapunkt:**
   - Der Spielflug beginnt **exakt an der letzten Menü-Kameraposition**. Es gibt keinen Schnitt zwischen Menü und Spiel; nur das DOM-Menü wird über dem laufenden 3D-Bild ausgeblendet.
3. **Flug (5,2 s), eine durchgehende Bahn:**
   - **Zeitkurve:** *smoothstep* (ease-in-out). Laut Kommentar ersetzt sie ein früheres ease-out, dessen Anfang „ruckig“ wirkte.
   - **Position:** Die Richtung vom Planetenmittelpunkt wird per **Slerp auf der Kugel** interpoliert (Großkreis, gleichmäßige Drehrate), der Abstand linear. Die Kamera „umfliegt“ so die Krümmung, statt durch den Planeten zu schneiden.
   - **Ziel einfrieren:** Das Endziel (hinter dem Fahrzeug) wird beim Start eingefroren. Erst in den **letzten 15 %** wird per smoothstep auf das *live* mitfahrende Ziel übergeblendet. Das verhindert den „Korkenzieher“, den eine Kamera macht, die einem bewegten Ziel hinterherjagt.
   - **Up-Vektor:** Er blendet von Welt-oben zur Oberflächennormale am Ziel. Damit dreht sich der Horizont ruhig ein.
   - **Roll:** Eine kleine Roll-Bewegung hat die Hüllkurve sin²(πt). Sie startet und endet mit Ableitung null; laut Kommentar „dreht sie sich nicht in den Stopp“.
   - **Blickpunkt:** Er wandert von der Planetenmitte zum Punkt vor dem Fahrzeug.
4. **Übergabe:**
   - Am Ende springt die Verfolgerkamera auf die Soll-Pose. Weil der letzte Flug-Frame genau diese Pose schon hat, sieht man keinen Sprung.
   - Erst danach erscheinen HUD und Tutorial-Spotlight.
   - Gegner sind während des Intros ausgesetzt, Portale unsichtbar.

**Void-Wechsel (ehrlich: nur eine Blende).**
- **Ablauf beim Betreten:**
  1. Das Portal-SFX startet.
  2. Ein schwarzes DOM-Overlay blendet in 0,5 s ein.
  3. Hinter Schwarz werden Dutzende Objektgruppen unsichtbar geschaltet (beide Welten liegen die ganze Zeit in derselben Szene). Das Void-Objekt wird asynchron initialisiert, die Void-Musik startet.
  4. Das Overlay blendet in 0,8 s aus.
- **Was gut daran ist:**
  - Das Fahrzeug **gleitet während der Blende weiter** (es fährt mit Trägheit, statt einzufrieren).
  - Die Welt-Ambience wird schon zu Beginn der Blende stummgeschaltet.
  - Die Kamera blendet per exponentieller Glättung in eine höhere Void-Rahmung.
- **Was fehlt:** Es gibt keinen räumlichen Übergang. KFB-Regel „ein Effekt, keine Bildschirm-Tricks“: Diese Blende ist für uns nur der **Notfall-Fallback**.

**Kamera-Rig.** Die Verfolgerkamera glättet per Lerp; die FOV steigt mit dem Tempo. In der Void gibt es bewusst „keine FOV-Änderung, kein Banking“, damit die Bahn ruhig bleibt. Die Erschütterung hat eine quadratische Abklingkurve.

### 1.2 Ratchet & Clank: Rift Apart (Insomniac, 2021): Rifts als Welt-Sprung

- **Dokumentiert:**
  - Dimensions-Sprünge mit fast keiner Ladezeit, gestützt auf SSD-Streaming. Die Technik baut auf dem Streaming von Spider-Man: Miles Morales auf.
  - Es gibt einen GDC-Vortrag „Shifts and Rifts: Dimensional Tech“ (Peter Kao). Den Inhalt konnte ich nicht einsehen (GDC Vault).
- **Gegenposition (Jon Burton, TT Games):** Dasselbe gehe auch ohne SSD mit einem **einfachen Zwischenort („Void“), der dauerhaft im Speicher liegt** und das Umschalten zwischen den Puffern verdeckt.
- **Technik für uns (abgeleitet):**
  - Der Übergang durchquert einen **eigenen Zwischenraum** (lila Riss-Tunnel), der immer geladen ist.
  - Solange man darin ist, wird die Zielwelt fertig gestreamt; die alte darf verschwinden.
  - Der Spieler behält Kontrolle oder wenigstens Bewegung. Das ist der Kern unseres Tunnel-Vorschlags.
- **Unsicher:** Wie Insomniac intern die Zeit zwischen „Riss getroffen“ und „neue Welt fertig“ streckt, weiß ich nicht. Die Halte-Schleife in 2.3 ist meine Ableitung.

### 1.3 God of War (2018): eine Einstellung, keine Schnitte

- **Dokumentiert:** Das ganze Spiel ist eine durchgehende Kamera-Einstellung, ohne Schnitte und ohne Ladebildschirme. Barlog nennt das eine „schwer verkaufbare“ Entscheidung im Team.
- **Fan-Quelle, nicht offiziell:** Geladen wird hinter Engstellen und Tunneln, Schnellreisen hinter der Reise-Sequenz am Weltenbaum.
- **Technik für uns:**
  - Laden ist Spielzeit.
  - Engstellen (Spalt, Tür, Tunnel) tragen die Ladezeit; die Kamera schneidet nie.
  - Das ist das Muster für Türen und für den Portal-Tunnel.

### 1.4 Outer Wilds (Mobius, 2019): kein Ladebildschirm, aber Stellvertreter

- **Dokumentiert (GamesRadar „Making of“):** Man darf jeden Planeten jederzeit sehen und mit der Sonde fotografieren. Deshalb gibt es **handgebaute Low-Res-Versionen**, die stehen, bis die echten Assets geladen sind.
- **Technik für uns:** Für das Ziel gibt es immer *irgendetwas* Sichtbares (Stellvertreter-LOD). Damit wird der Globus-Zoom möglich: Der Globus ist der Stellvertreter des Geländes.

### 1.5 Globus → Boden wie Google Earth: das „Fly-To“

- **Dokumentiert (van Wijk & Nuij, InfoVis 2003):**
  - Zoomen und Schwenken werden gekoppelt, sodass die **wahrgenommene** Geschwindigkeit gleich bleibt.
  - Die Bahn steigt erst hinaus (Überblick) und geht dann hinein.
  - Der Krümmungs-Parameter ρ ≈ 1,42 ist der Mittelwert aus ihrer Nutzerstudie; ρ → 0 ergibt fast lineare Bewegung.
- **Dieselbe Formel steckt in:** d3 `interpolateZoom` (ρ = √2), MapLibre/Mapbox `flyTo` (`curve` = 1,42) und deck.gl `FlyToInterpolator`.
- **Technik für uns:**
  - Die Höhe wird **logarithmisch** interpoliert, nicht linear. Linear wirkt oben quälend langsam und unten rasend schnell.
  - Tiny Skies kommt mit linearem Abstand aus, weil der Weg dort kurz ist (Faktor ~3). KFB geht vom Globus zur Fahrkamera, das ist Faktor 100+. Dort ist log-Höhe Pflicht.

### 1.6 Portal-Durchblick wie in „Portal“ (Sebastian Lague, „Coding Adventure: Portals“)

- **Dokumentiert:**
  - Eine zweite Kamera steht relativ zum Ausgang so, wie die Spielerkamera zum Eingang steht.
  - Sie rendert in eine Textur, die mit Bildschirm-UVs (perspektivische Division) aufs Portal gelegt wird.
  - Eine **schräge Near-Plane** (oblique clipping) liegt in der Portal-Ebene, damit nichts hinter dem Ausgang den Blick verdeckt.
  - **Seitenwechsel:** Erkannt wird er per Vorzeichenwechsel des Skalarprodukts. Er muss im Frame-Update geprüft werden, nicht im Fixed-Step: Der Fixed-Step läuft pro Frame 0–n-mal, und Lague bekam dadurch Mehrfach-Teleports.
  - **Flackern beim Durchgehen:** Die Near-Plane schneidet die Portal-Fläche. Abhilfe ist, die Fläche als dünne Box mit beidseitigem Rendern zu bauen.
  - Objekte, die halb durch das Portal ragen, werden per Shader geschnitten und haben für den Übergang einen Klon.
- **Technik für uns:** optional für „Fenster-Portale“. Es kostet einen zweiten Render; die günstige Variante steht in 2.5.

### 1.7 Kamera-Blends (Unity Cinemachine, als Denkmodell)

- **Dokumentiert:**
  - Ein Blend ist **eine Kamerabewegung, keine Blende, kein Wischen, kein Überblenden**: Position, Rotation und Linsen-Werte werden zwischen zwei virtuellen Kameras animiert.
  - Standard ist ein S-förmiges Ease-In-Out über 2 s.
  - Je Kamerapaar kann ein eigener Blend gelten; das spezifischere Paar gewinnt.
- **Technik für uns:** eine **Blend-Tabelle** für die Kameramodi zu Fuß, Auto, Flug, Dialog und Portal.

### 1.8 Zeitspannen-Marker (Unreal Anim Notify State, Fixed Timestep)

- **Dokumentiert:** Ein Notify *State* hat Begin, Tick und End; Begin kommt garantiert vor Tick, End danach. Bekannte Fehler: Bei Loops fehlen manchmal Begin oder End. Gaffer On Games „Fix Your Timestep“ beschreibt die feste Schrittweite mit Akkumulator.
- **Technik für uns:** Marker sind Spannen [t0, t1), keine Zeitpunkte. Geprüft wird die Überlappung mit dem Frame-Intervall (tPrev, tNow]. So geht bei Frame-Spitzen nichts verloren, und Loops schließen sauber ab.

### 1.9 Destillat: zwölf Techniken, die alle guten Beispiele teilen

1. **Eine Bahn, eine Zeitkurve.** Ease-in-out auf die Gesamtzeit. Unterbewegungen hängen an dieser Uhr und haben eigene Hüllkurven mit Ableitung null an den Enden (smoothstep, sin²).
2. **Start-Pose = aktuelle Pose.** Nie an eine „schöne“ Startposition springen.
3. **End-Pose = erste Pose des Nachfolgers.** Ziel einfrieren, live erst am Ende einblenden (Tiny Skies, letzte 15 %).
4. **Auf der Kugel slerpen, die Höhe logarithmisch führen** (van Wijk). Up-Vektor und Roll bekommen eine eigene Hüllkurve.
5. **Geschwindigkeit überträgt sich.** Das Fahrzeug fährt mit Trägheit weiter; kein Einfrieren, kein Stopp.
6. **Laden hinter Bewegung, nicht hinter Schwarz:** Tunnel, Wolken, Engstelle oder Zwischenraum, der immer geladen ist (Rift Apart, God of War).
7. **Stellvertreter für das Ziel:** Globus und Low-LOD sind sofort sichtbar (Outer Wilds).
8. **Großzügige, gerichtete Auslöser:** Streckentest statt Punkttest, Trigger größer als die Optik, scharfschalten plus Abklingzeit.
9. **Sicherer Austritt:** Bodenhöhe prüfen, Richtung übertragen, Spuren und Partikel zurücksetzen.
10. **Ton läuft vor dem Bild:** SFX beim Auslösen, Ambience der alten Welt wird schon in der ersten Phase leiser.
11. **Billboards bleiben aufrecht:** zylindrisch um die lokale Normale; die Kamera rollt nur gering.
12. **Eine Uhr, Ereignisse gesammelt, Spannen statt Treffer.**

---

## 2 · Architektur-Vorschlag

### 2.1 Bausteine (je einer, kein zweiter Besitzer)

| Baustein | Aufgabe | Besitzt |
|---|---|---|
| `GameMode`-Zustandsmaschine | Grobzustand: `Stage`, `Globe`, `OnFoot`, `Drive`, `Fly`, `Dialog`, `Transition` | Eingabe-Routing, aktives Kamera-Rig |
| `TransitionDirector` | spielt **ein** Rezept ab; während `Transition` besitzt er Kamera, Eingabe-Gewicht, Audio-Busse, Rig-Parameter und Welt-Lader | die Transition-Uhr |
| `EventClock` | eine Uhr für alles: sammelt Ereignisse, verteilt sie einmal pro Frame, prüft Spannen-Marker | Zeit, Queue |
| `WorldLoader` | Vorladen nach Priorität (Kollision/Gelände → nahe Chunks → Shader warm → Szenerie → Ton) und meldet `world.ready` | Lade-Budget |
| `CameraRigs` | ein Rig je Modus (zu Fuß, Auto, Flug, Dialog-Zweier, Globus); jedes liefert `poseAt(state)` | nur Soll-Posen |
| `Rig`-Licht/Farbe (V-385) | Nebel, Farbe, Belichtung, FOV als Parameter, die der Director interpoliert | Look |
| Portal-Modul | Optik, Auslöse-Logik, Zustände `closed / opening / idle / ask / swallow / closing` | Portal-Visual |

Der `TransitionDirector` ist selbst ein Zustand der `GameMode`-Maschine. Während er läuft, gibt es keine zweite Kamera-Logik: Die Rigs liefern nur Ziel-Posen, gemischt wird im Director.

### 2.2 Eine Event-Uhr

- **Quelle:**
  - genau ein `performance.now()`-Takt pro Frame;
  - Delta wird geklemmt (z. B. 0,05 s; Tiny Skies macht das auch), nach Tab-Wechsel nie Sprünge von Sekunden;
  - Physik läuft im Fixed-Step mit Akkumulator, Animation und Kamera im Frame-Takt;
  - niemand ruft eine zweite Uhr ab.
- **Kanäle:** `game` (Spielzeit, kann pausieren), `transition` (lokal je Rezept, startet bei 0), `ui` (läuft auch in Pause).
- **Ablauf je Frame:**
  1. **Sammeln:** Physik-Kontakte, Trigger, Eingabe, Netzwerk und Lader schreiben `{type, key, src, tGame, payload}` in die Queue. Hier wird noch nichts ausgeführt.
  2. **Verteilen**, einmal an fester Stelle nach Physik und vor Kamera:
     - nach Priorität sortieren, dann nach t;
     - **Duplikate per `key` entfernen**: Schuss und Aktionstaste auf dieselbe Truhe im selben Frame ergeben *ein* `chest.open`;
     - Abonnenten aufrufen.
  3. **Marker:** Jeder Marker hat eine Spanne `[t0, t1)`. Überlappt sie (tPrev, tNow], gibt es einmal `begin`, solange sie überlappt `tick`, und bei tNow ≥ t1 einmal `end`. Springt ein Frame über die ganze Spanne, feuern `begin` und `end` im selben Frame; nie geht etwas verloren. Punkt-Ereignisse sind Spannen mit Mindestbreite (≥ 1 Frame, z. B. 0,034 s).
- **Reine Funktion von t:**
  - Alle Spuren eines Rezepts (Kamera, FX-Parameter, Rig-Werte) werden aus `t` berechnet, nicht aufintegriert.
  - Dadurch kann man scrubben, debuggen und Belege rendern (Front- und Seitenkamera).
  - Zufall läuft nur geseedet.
  - Das passt zum vorhandenen UFO-Event-Vertrag (`UFO_TRACTOR_LAB_R2_REF/ufo-event-lab/EVENT_CONTRACT.json`: „event is a pure function of t“).
- **Ausnahme Halte-Loop:**
  - Wartet ein Rezept auf `world.ready`, läuft die Transition-Uhr in einer Loop-Spanne (z. B. Tunnel 0,6–1,4 s) im Kreis. Das bleibt eine reine Funktion von `t mod loop`.
  - Kommt das Ereignis, wird die Schleife am nächsten Loop-Ende verlassen. Es gibt nie einen Sprung mitten in der Bewegung.

### 2.3 Rezept-Format (JSON-Skizze)

```json
{
  "id": "portal.travel.v1",
  "clock": "transition",
  "from": ["Drive", "Fly", "OnFoot"],
  "to": "same-mode",
  "ease": "smoothstep",
  "phases": [
    { "id": "APPROACH", "t": [-1.5, 0.0], "trigger": "portal.near" },
    { "id": "ASK",      "t": null, "optional": true, "hold": "dialog.answer" },
    { "id": "CROSS",    "t": [0.0, 0.35], "trigger": "portal.cross" },
    { "id": "TUNNEL",   "t": [0.35, 1.6], "loop": [0.6, 1.4], "holdUntil": "world.ready", "maxHold": 6.0 },
    { "id": "EXIT",     "t": [1.6, 2.2] },
    { "id": "SETTLE",   "t": [2.2, 3.0] }
  ],
  "tracks": {
    "camera":   { "from": "rig:current", "via": "path:portalAxis", "to": "rig:target", "liveBlend": [0.85, 1.0] },
    "fov":      { "keys": [[0.0, 0], [0.35, 8], [1.6, 8], [2.2, 0]], "unit": "deg+" },
    "rig":      { "fogColor": ["world:A", "tunnel", "world:B"], "fogDensity": [0.0, 0.6, 0.0] },
    "input":    { "weight": [[0.0, 1], [0.2, 0.3], [1.9, 0.3], [2.3, 1]] },
    "vehicle":  { "mode": "rail:tunnelSpline", "keepSpeed": true },
    "audio":    { "duckBus": "ambience:A", "duck": [[-0.6, 0], [0.1, -18]], "fadeIn": "ambience:B@1.4" }
  },
  "markers": [
    { "id": "sfx.portal.suck",   "span": [-0.4, 0.0] },
    { "id": "sfx.portal.whoosh", "span": [0.0, 1.6] },
    { "id": "fx.ring.flare",     "span": [-0.05, 0.25] },
    { "id": "world.hideA",       "span": [0.5, 0.6] },
    { "id": "world.showB",       "span": [1.3, 1.4], "requires": "world.ready" },
    { "id": "portal.exit.open",  "span": [1.4, 1.9] },
    { "id": "hud.show",          "span": [2.4, 2.8] },
    { "id": "world.disposeA",    "span": [3.0, 6.0], "spread": "frames" }
  ],
  "preload": { "start": "portal.armed", "order": ["collision", "terrainNear", "shaders", "props", "audio"] },
  "fallback": { "after": "maxHold", "do": "tunnel.slowFadeToRigFog", "message": null }
}
```

- `t` ist relativ zum Hauptereignis (Durchqueren = 0). Negative Zeiten laufen vorher, angestoßen vom Annäherungs-Trigger.
- `liveBlend` ist die Tiny-Skies-Technik: bis 85 % ein eingefrorenes Ziel, danach ein weicher Wechsel aufs live mitfahrende Rig.
- `fallback` dunkelt nicht schwarz ab, sondern dickt den Tunnel-Nebel ein (ein Rig, kein DOM-Overlay).

### 2.4 Portale und Türen: derselbe Effekt in allen Reisearten

**Ein Portal, ein Ereignis `portal.cross`, drei Wege dorthin:**
- **Fahren und Fliegen:** Streckentest von der letzten zur aktuellen Position gegen die Portal-Ebene. Trigger-Ellipse ca. 1,3× so groß wie die Optik. Scharfschalten und Abklingzeit wie in Tiny Skies.
- **Zu Fuß „mit der Hand berühren“:**
  1. In der Nähe (z. B. < 1,5 m, Blick zum Portal) erscheint der Aktions-Hinweis.
  2. Taste drücken: Die Figur geht an einen Andockpunkt; die Hand-Pose ist eine vorhandene Pose oder ein vorhandener Clip, nicht keyframen.
  3. Der Kontaktpunkt ist eine Marker-Spanne. In ihr werden `portal.touch` und dann `portal.cross` erzeugt.
  4. Danach läuft dasselbe Rezept wie beim Fahren. Die Figur wird „eingesogen“ (Anlauf, dann Squash ins Oval) statt durchzufahren. Die Kamera geht in dieselbe Portal-Achse.
- **Türen** sind Portale ohne Wirbel-Optik. Rahmen = Ring, Türblatt = Fläche. Der Tunnel ist ein kurzer Flur oder Spalt, die Phasen sind identisch und kürzer.

**Annäherung als Teil des Effekts (keine zweite Animation):**
- Die Portal-Intensität ist eine Funktion des Abstands: Rotation, Wabern, Glow und ein tiefer Brumm-Ton steigen mit sinkendem Abstand.
- Das Portal ist die **Lichtquelle**: Ein Punktlicht im einen Rig, gekoppelt an den Glow, färbt Fahrzeug und Boden. Es gibt keinen Bildschirm-Flare.
- **Effektquellen sitzen plausibel:** Partikel strömen aus dem Ring, nicht aus der Kamera.

**Späterer Dialog (Ja / Nein / Vielleicht / Erzähl mehr), passt als Phase `ASK`:**
- **Auslöser:** Statt `portal.cross` gibt es in der Annäherung `portal.ask`, nur wenn das Portal das Flag `ask: true` hat.
- **Welt:**
  - Das Portal geht in Zustand `ask`: Es pulsiert langsamer und neigt sich dem Spieler zu, soweit ein Billboard das darf (nur Skalierung und Glow).
  - Ein sanfter **Sog** (eine echte Kraft in der Welt) bremst das Fahrzeug auf Schrittgeschwindigkeit oder Schweben. So bleibt keiner in der Luft stehen, und die Physik bleibt eine.
- **Kamera:** Blend ins Dialog-Zweier-Rig (Spieler + Portal), 0,6 s ease-in-out.
- **Antworten:**
  - *Ja* → `CROSS` (das Portal saugt ein, gleiche Spur wie oben).
  - *Nein* → `REPEL`: Das Portal stößt sanft zurück, das Scharfschalten wird zurückgesetzt, ein Abstand ist nötig.
  - *Vielleicht* → das Portal bleibt in `idle`; ein Marker setzt eine Erinnerung.
  - *Erzähl mehr* → ein Dialog-Zweig; das Portal bleibt in der `ask`-Loop.
- **Ohne Dialog-Flag** wird `ASK` übersprungen. Das Rezept bleibt dasselbe.

### 2.5 Durchblick in die Zielwelt (optional, später)

- **Billig (empfohlen):** Beim Scharfschalten wird **einmal** ein Schnappschuss der Zielwelt-Ankunft gerendert, als niedrig aufgelöste Cubemap oder Panorama. Die Portalfläche zeigt ihn mit Parallaxe aus der Blickrichtung. Es gibt keine zweite Live-Kamera, die Kosten fallen nur einmal an. Ein Nebeneffekt: Der Schnappschuss wärmt Shader und Texturen der Zielwelt vor.
- **Teuer:** ein Live-Durchblick nach Lague (Render-Target, schräge Near-Plane, dünne Box gegen Flackern). Nur für ein, zwei Hero-Portale, gerendert mit halber Auflösung und jedem zweiten Frame.

### 2.6 2D-Sprites in der 3D-Welt während Übergängen

- **Ausrichtung:**
  - Zylindrisches Billboard um die **lokale Normale** (Boden-Oben), wie das kosmische Portal in Tiny Skies.
  - Kamera-Roll wirkt nie auf Sprites. Darum hat die Kamera in Übergängen nur kleinen Roll (≤ 3–4°, mit sin²-Hüllkurve).
- **Drehen = Spiegeln:**
  - Wechselt die Blickseite (Kamera links oder rechts der Figurenachse), wird **gespiegelt** (`scale.x = ±1`), nie die Fläche gedreht.
  - Hysterese von ca. ±10° verhindert Flattern beim Kreisen der Kamera.
  - Eingeleitet wird das Spiegeln mit einem kurzen Squash.
  - Während eines Kameraflugs wird **höchstens einmal** gespiegelt: Den Seitenwechsel legt das Rezept selbst als Marker fest, statt ihn jeden Frame neu zu prüfen.
- **Neigung (Pitch) begrenzen:**
  - Sprites vertragen nur flache Kamerawinkel. Jedes Rezept hat eine **Pitch-Hüllkurve**: Steil (Globus, Draufsicht) ist nur erlaubt, solange Sprites kleiner als ca. 8 px sind oder ausgeblendet. Lesbare Größe erreichen sie erst, wenn der Pitch ≤ der Spielgrenze ist (Fahrkamera 12°).
  - Für die Intro-Bahn heißt das: Der Pitch wird **vor** der letzten Höhenstufe flach.
- **Ein- und Ausblenden:** Sprites erscheinen per Distanzfeld-Wachsen (≥ 0,15 s Spielzeit, gilt schon für Sprite-Sequenzen). Kein Überblenden der Deckkraft, kein Aufploppen.
- **Fahrzeuge und Portale** sind 3D oder Billboard nach ihrem Standard. Portale sind zylindrische Billboards; der Ring selbst darf 3D sein und dreht sich dann um seine eigene Achse.

### 2.7 Farbe, Nebel, FOV, Ton: als Spuren desselben Rezepts

- **Look:**
  - Nebelfarbe und -dichte, Belichtung, Himmelsfarbe und Lichtfarbe sind **Parameter des einen Rigs** (V-385). Das Rezept interpoliert sie mit derselben Zeitkurve.
  - Keine DOM-Overlays, kein Farbfilter über das Bild.
  - Wird zwischen zwei Oberflächen gemischt (Tunnelwand zu Zielwelt), läuft das über das eine Speckle-Modul (V-403), nie über einen Verlauf.
- **FOV:**
  - Höchstens ca. +8–10° beim Einsaugen; zurück bis zur Übergabe.
  - Die **FOV wird mit übergeben**: Hängt die Ziel-FOV des Folge-Rigs vom Tempo ab, wird das Tempo der Übergabe genommen, nicht der Ruhewert.
- **Ton:**
  - Pre-Roll: Der Sog-Ton beginnt 0,3–0,5 s vor dem Bild-Ereignis.
  - Ein durchgehender Whoosh über die ganze Tunnelspanne, statt drei Einzel-SFX.
  - Die Ambience der Quellwelt ist ab `CROSS` um ca. −18 dB geduckt; die Ziel-Ambience läuft ab Tunnel-Mitte von −∞ hoch.
  - Ein Ankunfts-Akzent kommt bei der Übergabe.
  - Loops der alten Welt werden beim Entladen **gestoppt**, nicht nur unhörbar gemacht.

### 2.8 Vorladen hinter der Bewegung

- **Auslöser:** Das Vorladen beginnt beim **Scharfschalten** des Portals, also bei Annäherung (Radius einstellbar, z. B. 60 m Fahrt, 120 m Flug). Es beginnt nicht erst beim Durchqueren.
- **Reihenfolge:**
  1. Kollision und Gelände am Ankunftspunkt (Landesicherheit; so steht es auch im Warp-Ride-Plan);
  2. nahe Chunks;
  3. Shader warmlaufen lassen: three.js `renderer.compileAsync(scene, camera)` an der Ankunfts-Kamera;
  4. Texturen hochladen (`renderer.initTexture`);
  5. Props und NPCs;
  6. Ton.
- **Halten statt Ruckeln:** Ist beim Tunnel-Loop-Ende `world.ready` noch nicht da, läuft der Loop weiter. Nach `maxHold` greift der Fallback (dichter Tunnelnebel, Ladekreis in der Welt).
- **Entladen erst nach `SETTLE`:** Die alte Welt wird verteilt auf mehrere Frames entsorgt, damit der GC nicht in die Ankunft fällt.
- **Globus-Intro:** Der Startbereich lädt, sobald der Startpunkt feststeht; bei festem Spawn ab t = 0 hinter dem Vorhang.

---

## 3 · Prioritätenliste der Übergänge

Format je Eintrag: Zeitachse in Sekunden, Treiber (Zustandsmaschine / Uhr), Vorladen, Artefakte → Abhilfe.

### P1 · Portal-Reise durchfahren / durchfliegen (Kern, Rezept `portal.travel.v1`)

| t (s) | Was passiert |
|---|---|
| −∞ … −1,5 | Portal scharf geschaltet (Abstand). **Vorladen startet.** Portal im Ruhe-Leben: Wirbel gegenläufig, Wabern ±2 %, Glow-Puls. |
| −1,5 … 0 | `APPROACH`: Intensität steigt mit sinkendem Abstand (Rotation ×2, Glow ×1,5, Rand-Wabern größer). Brumm-Ton steigt, Ambience beginnt zu ducken. Portal-Licht färbt Fahrzeug. |
| −0,4 … 0 | Sog-SFX (Pre-Roll). Partikel strömen aus dem Ring zum Fahrzeug. |
| 0 | `portal.cross` (Streckentest). Eingabe-Gewicht fällt auf 0,3 (Lenken bleibt spürbar). |
| 0 … 0,35 | `CROSS`: Kamera folgt durch den Ring. FOV +8°, Nebel blendet zur Tunnelfarbe. Ring-Flare als Lichtspitze am Ring, nicht auf dem Bildschirm. |
| 0,35 … 1,6 | `TUNNEL`: Das Fahrzeug fährt mit erhaltenem Tempo auf einer Tunnel-Spline (Ton-Knet-Röhre, Speckle-Wände). Alte Welt bei 0,5 ausgeblendet, Zielwelt bei 1,3 eingeblendet (nur mit `world.ready`). **Loop 0,6–1,4**, bis bereit. |
| 1,6 … 2,2 | `EXIT`: Ausgangsportal öffnet (easeOutBack, Kreis → Oval, halbe Drehung). Austritt mit übertragener Richtung, sicherer Bodenhöhe und gleichem Tempo. Live-Blend auf das Ziel-Rig ab 85 % der Kamerabahn. FOV zurück, Nebel → Zielwelt. |
| 2,2 … 3,0 | `SETTLE`: Eingabe wieder 1,0 (Rampe 1,9–2,3). Portal schließt hinter dem Spieler. HUD ab 2,4. Alte Welt wird ab 3,0 verteilt entsorgt. |

- **Treiber:** `GameMode → Transition`; `TransitionDirector` mit Transition-Uhr; Rezept als reine Funktion von t plus Halte-Loop.
- **Vorladen:** Kollision und Gelände am Ankunftspunkt, nahe Chunks, Shader-Warmup per `compileAsync` an der Ankunfts-Kamera, Ziel-Ambience, Ankunfts-Akzent. Optional der Schnappschuss für den Durchblick.
- **Artefakte → Abhilfe:**
  - *Doppel-Trigger / Ping-Pong am Ausgang* → Scharfschalten über Abstand, Abklingzeit, Sperre im Director (Zustand `Transition` nimmt keine `portal.*`-Events an).
  - *Durchschießen bei hohem Tempo* → Streckentest statt Kugeltest.
  - *Flackern beim Passieren der Ebene* → Portal-Fläche als dünne Box mit beidseitigem Rendern; Kamera-Near ≤ 0,05.
  - *Kamera-Korkenzieher am Ende* → eingefrorenes Ziel, live erst in den letzten 15 %.
  - *FOV-Sprung bei Übergabe* → FOV und Tempo mit übergeben.
  - *Spuren und Rauch ziehen quer über die Karte* → Trails und Partikel beim Weltwechsel zurücksetzen.
  - *Ruckler bei Ankunft* → Shader-Warmup, verteiltes Entladen.
  - *Landung im Boden* → Mindesthöhe über der Geländefunktion.
  - *Schwarzbild* → verboten; nur der Nebel-Fallback.

### P2 · Portal zu Fuß berühren (+ späterer Dialog)

| t (s) | Was passiert |
|---|---|
| … | Nähe < 1,5 m, Blick zum Portal → Aktions-Hinweis in der Welt (nicht im HUD). |
| 0 … 0,4 | Taste → Figur läuft oder hüpft zum Andockpunkt (vorhandener Clip). Sprite spiegelt einmal zur Portalseite, falls nötig. Kamera blendet in die Portal-Achse (0,6 s ease-in-out, beginnt bei 0). |
| 0,4 … 0,7 | Hand-Pose am Ring. **Marker `portal.touch` [0,55, 0,62)**: Ring-Welle läuft vom Kontaktpunkt aus, Licht flackert einmal auf. |
| (ASK) | Falls `ask: true`: Dialog-Zweier-Rig, Portal in `ask`-Loop, Antwort-Optionen. *Nein* → Rückstoß 0,5 s, Figur stolpert zurück. |
| 0,7 … 1,05 | Einsaugen: Anlauf-Squash, dann Stretch ins Oval (Cartoon-Prinzip; die Figur ist Sprite, also nur Skalierung und Verschiebung). → `portal.cross` bei 1,05. |
| 1,05 … | Weiter wie P1 ab `CROSS`. Im Tunnel schwebt die Figur, im Ausgang landet sie mit Squash. |

- **Treiber:** dieselbe Maschine; der Weg zu Fuß ist nur die `APPROACH`-Variante. Der Dialog läuft als `Dialog`-Unterzustand innerhalb der `Transition` (die Transition-Uhr hält in `ASK`).
- **Vorladen:** wie P1, ausgelöst bei Hinweis-Anzeige.
- **Artefakte → Abhilfe:**
  - *Hand verfehlt den Ring* → Andockpunkt plus Toleranz; der Kontakt ist eine Spanne, kein Frame.
  - *Sprite dreht sich sichtbar* → nur spiegeln, Hysterese.
  - *Dialog friert die Welt ein* → Sog-Kraft und Ruhe-Leben laufen weiter, nur die Transition-Uhr hält.

### P3 · Opening: Vorhang → Globus → Zoom ins Gelände (Rezept `intro.globe.v1`)

| t (s) | Was passiert |
|---|---|
| 0 … 2,5 | `CURTAIN`: Ein echter Knet-Vorhang **in der Szene** vor dem Globus öffnet sich (Physik oder vorhandener Clip; keine DOM-Blende). Dahinter rendert schon der Globus, der Stellvertreter, immer geladen. Musik-Akzent. **Vorladen des Startbereichs beginnt.** |
| 2,5 … ∞ | `GLOBE`: Kamera kreist langsam (Neigung ~15–25°). Menü bzw. Weltwahl als Objekte am Globus, nicht als Vollbild-Panel. Beim Eintritt 1,2–1,5 s Zoom 110 → 100 % mit ease-out (Tiny-Skies-Technik). |
| 0 … 6,0 (nach Start) | `DIVE`: **Start = aktuelle Menü-Kamera.** Richtung per Slerp auf der Kugel, **Höhe logarithmisch** (van-Wijk-Kurve, ρ ≈ 1,4; bei geringer Seitenverschiebung reicht smoothstep auf log-Höhe). |
| ~2,5 … 3,5 | Wolkenscheiben-Schicht wird durchflogen: In ihrem Schatten wechselt der Globus-Stellvertreter auf die Gelände-Chunks (LOD-Wechsel, nur mit `world.ready`, sonst Loop in der Wolkenschicht). |
| 3,5 … 5,0 | **Pitch flacht ab**, vor der letzten Höhenstufe, bis auf Fahrkamera 12°. Up-Vektor dreht von Globus-Oben zur Bodennormale. Roll sin² ≤ 3°. |
| 4,5 … 6,0 | Sprites wachsen ein (Distanzfeld, gestaffelt nach Abstand). Live-Blend auf das Fahr- oder Fuß-Rig ab 85 %. |
| 6,0 … 6,8 | Übergabe: letzter Frame = Rig-Pose. Eingabe-Rampe. HUD wächst ein. Portale und Gegner erst danach (Tiny Skies: Portale 2 s nach Intro). |

- **Treiber:** `GameMode: Stage → Globe → Transition → Drive/OnFoot`; Transition-Uhr; Halte-Loop in der Wolkenschicht.
- **Vorladen:** Globus-Stellvertreter (immer geladen), Startbereich (Kollision → Chunks → Shader-Warmup an der Ankunfts-Pose), Fahrzeug, Startfiguren, Ambience des Startortes.
- **Offene Frage (mein Vorschlag, nicht belegt):** KFB-Gelände ist flach und endlos, der Globus rund. Zwei Wege:
  - (a) **Krümmungs-Uniform:** Ein Vertex-Shader biegt die Gelände-Chunks um einen Radius R, und R wächst beim Abstieg gegen ∞. Dann gibt es *eine* Geometrie, und der Globus „entrollt“ sich zum Boden.
  - (b) Ein getrennter Globus mit LOD-Wechsel hinter der Wolkenschicht. Das ist einfacher, braucht aber eine Maske (die Wolken).
  - Empfehlung: zuerst (b), (a) als späterer Ausbau. Georg entscheidet per Bild.
- **Artefakte → Abhilfe:**
  - *Oben zu langsam, unten zu schnell* → log-Höhe.
  - *Up-Vektor kippt bei Draufsicht (lookAt-Singularität)* → Quaternionen, Up-Vektor eigens blenden.
  - *Sprites von oben sichtbar oder schief* → Pitch-Hüllkurve, Sprites erst bei flachem Pitch.
  - *Sichtbarer LOD-Sprung* → Wechsel nur im Wolkenschatten, Speckle-Modul für die Fläche.
  - *Anfang wirkt ruckig* → ease-in-out statt ease-out (Tiny-Skies-Lehre).
  - *Menü → Spiel schneidet* → Start an der Menü-Kamera.

### P4 · Kamerawechsel zu Fuß ↔ Auto ↔ Flug (Basis für alles andere)

| t (s) | Was passiert |
|---|---|
| 0 | `mode.change` (aus Einsteigen, Jetpack an, Landung). |
| 0 … 0,6–0,9 | Blend **im Parameterraum** der Rigs (Abstand, Höhe, Pitch, FOV, Nachlauf, Ziel-Offset), nicht linear zwischen Weltpositionen. Ease-in-out. Kollisions-Sonde aktiv: Die Kamera schiebt sich nicht durch Wände. |
| 0,3 … | Eingabe wechselt zur neuen Steuerung mit 0,2 s Rampe. |

- **Blend-Tabelle (Startwerte):** Fuß→Auto 0,7 s · Auto→Fuß 0,6 s · Fuß→Flug 0,8 s · Flug→Fuß (Landung) 0,9 s · Auto→Flug 0,8 s · beliebig→Dialog 0,6 s · Dialog→zurück 0,5 s. Das spezifischere Paar gewinnt.
- **Treiber:** `GameMode`; der Blend läuft im `CameraRigs`-Mischer auf der `game`-Uhr. Er ist eine Mini-Transition ohne Halte-Loop.
- **Vorladen:** nichts Großes; Flug-Rig und Jetpack-SFX liegen dauerhaft im Speicher.
- **Artefakte → Abhilfe:**
  - *Kamera taucht durch Gelände* → Blend im Parameterraum plus Sonde.
  - *Doppel-Blend bei schnellem Hin und Her* → neuer Blend startet von der **aktuellen gemischten** Pose (nicht von der alten Rig-Pose).
  - *Pitch zu steil im Flug für Sprites* → Flug-Rig-Pitch-Limit.
  - *Horizont rollt* → Roll klein und gedämpft.

### P5 · Truhe öffnen: Aktionstaste oder Schuss (Rezept `chest.open.v1`)

| t (s) | Was passiert |
|---|---|
| 0 | `chest.open` (Taste in Reichweite **oder** Treffer). Per `key = chestId` dedupliziert. |
| 0 … 0,25 | Nur bei Taste: Figur richtet sich zur Truhe aus (spiegeln, kurzer Schritt), Kamera schiebt leicht heran (±5 % Abstand). Bei Schuss: kurzes Treffer-Wackeln der Truhe statt Annäherung. |
| 0,25 … 0,55 | Vorbereitung: Deckel und Körper staucht (Squash), Licht im Inneren beginnt zu glimmen. Die Quelle ist **die Truhe innen**, nicht der Bildschirm. |
| 0,55 … 0,8 | Deckel springt auf (Überschwinger). Lichtstoß aus der Öffnung (Punktlicht im einen Rig), Staub- und Knetkrümel-Partikel aus der Fuge. |
| 0,8 … 1,8 | Beute steigt im Bogen heraus, dreht sich als Sprite nur per Spiegeln oder Schwingen. Ton-Akzent bei 0,8. |
| 1,8 … 2,3 | Beute fliegt zum Spieler bzw. HUD-Zähler: Flugbahn in der Welt, erst am Ende ins HUD. Eingabe war nie ganz weg (Taste: 0,3; Schuss: 1,0). |

- **Treiber:** kleiner `TransitionDirector`-Lauf ohne Moduswechsel oder ein Entity-Ablauf auf der `game`-Uhr. Marker als Spannen.
- **Vorladen:** Beute-Sprite oder -Modell und SFX beim **Erzeugen der Truhe** (nicht beim Öffnen).
- **Artefakte → Abhilfe:**
  - *Doppel-Öffnen (Schuss und Taste im selben Frame)* → Queue-Deduplizierung.
  - *Deckel schneidet durch Figur oder Wand* → Andockpunkt plus Kollisionscheck; bei Schuss gibt es keinen Andockpunkt.
  - *Beute erscheint aus dem Nichts* → Spawn innen in der Truhe, sichtbar durch die Öffnung.
  - *Bildschirm-Blitz* → verboten; Licht kommt aus der Truhe.

### P6 · Ein- und Aussteigen (Rezept `vehicle.enter.v1` / `vehicle.exit.v1`)

| t (s) | Einsteigen |
|---|---|
| 0 | Taste in Reichweite der Tür → `vehicle.enter`. |
| 0 … 0,3 | Figur geht oder hüpft zum Tür-Andockpunkt (Clip). Sprite spiegelt einmal zur Fahrzeugseite. |
| 0,3 … 0,7 | Tür öffnet. Figur hüpft im Bogen hinein, Squash beim Sitzen; die Tür verdeckt sie, statt dass sie ausgeblendet wird. Kamera-Blend Fuß→Auto startet bei 0,3 (0,7 s). |
| 0,5 … 0,9 | Motorstart-SFX (Spanne), Auspuff-Puff aus dem Auspuff. |
| 0,9 … 1,1 | Eingabe Auto, Rampe 0,2 s. |

| t (s) | Aussteigen |
|---|---|
| 0 | `vehicle.exit` (nur bei Tempo < Schwelle; sonst erst bremsen). |
| 0 … 0,25 | Ausstiegspunkt prüfen (Boden, Freiraum; sonst andere Seite oder Dach). |
| 0,25 … 0,6 | Tür auf, Figur hüpft heraus, Landung mit Squash. Blend Auto→Fuß 0,6 s ab 0,25. |
| 0,6 … 0,85 | Eingabe Fuß; Motor läuft im Leerlauf aus. |

- **Treiber:** `GameMode: OnFoot ↔ Drive`; kurzer Director-Lauf; der Kamera-Blend kommt aus P4.
- **Vorladen:** nichts; Fahrzeug-SFX und -Clips liegen mit dem Fahrzeug bereit.
- **Artefakte → Abhilfe:**
  - *Figur steckt im Gelände nach Ausstieg* → Freiraum-Check vor der Animation.
  - *Sprite dreht oder kippt mit dem Fahrzeug* → Figur bleibt zylindrisches Billboard, spiegelt nur.
  - *Kamera springt von Fuß- auf Auto-Pose* → Blend aus P4, Start von der gemischten Pose.
  - *Eingabe greift zu früh (Fahrzeug fährt los, während die Figur noch hüpft)* → Eingabe-Gewicht als Spur im Rezept.

**Später, nutzt P1 und P3 wieder:** Ruhestein-Reise (V-623): Kompass benutzen → Karte bzw. Globus (P3 rückwärts: Aufstieg) → Ziel wählen → Abstieg (P3) oder Portal (P1). Dafür braucht es kein neues System, nur ein Rezept.

---

## 4 · Fallstricke

1. **Schwarzblende als Krücke.** Tiny Skies wechselt Welten per DOM-Overlay. Für KFB gilt das nur als Fallback (dann als Rig-Nebel, nicht als DOM).
2. **Mehrere Effekte hintereinander geklebt.** SFX, Flash, Fade und Zoom einzeln getriggert ergibt Lücken und Doppelungen. Abhilfe: ein Rezept, eine Zeitkurve, alle Spuren hängen an t.
3. **Bewegtes Ziel verfolgen.** Ergibt den Korkenzieher und den Sprung bei der Übergabe. Abhilfe: Ziel einfrieren, live erst in den letzten 10–15 %.
4. **Up-Vektor- und Roll-Fehler.** lookAt bei Draufsicht kippt; ein Roll, der „in den Stopp dreht“, wirkt billig. Abhilfe: Quaternionen, eigene Hüllkurven mit Ableitung null an den Enden.
5. **Lineare Höhe beim Globus-Zoom.** Abhilfe: log-Höhe bzw. van-Wijk-Kurve.
6. **FOV- und Tempo-Sprung bei der Übergabe.** Die Ziel-FOV des Rigs hängt vom Tempo ab. Abhilfe: Zustand mit übergeben.
7. **Zwei Uhren.** In Tiny Skies brauchte das Menü wegen einer Doppelabfrage der Spieluhr eine eigene Wanduhr. Abhilfe: genau eine Quelle, Kanäle davon abgeleitet, Delta geklemmt.
8. **Exakte Zeit-Treffer (`t === 1.3`).** Bei Frame-Spitzen oder Loops gehen Events verloren. Abhilfe: Spannen-Überlappung, `begin` und `end` garantiert.
9. **Fixed-Step-Trigger.** Löst 0–n-mal pro Frame aus (Lague). Abhilfe: Erkennung im Frame-Takt oder Queue-Deduplizierung.
10. **Near-Plane-Flackern** beim Passieren von Portal- und Tür-Flächen. Abhilfe: dünne Box, beidseitig rendern.
11. **Shader-Kompilier-Ruckler** genau beim Enthüllen der Zielwelt. Abhilfe: `compileAsync` und `initTexture` während des Tunnels.
12. **GC-Ruckler** durch Entladen mitten im Übergang. Abhilfe: Entladen erst nach `SETTLE`, verteilt.
13. **Ton der alten Welt läuft weiter**, weil der Loop nur unsichtbar, aber nicht gestoppt ist. Abhilfe: Busse ducken, beim Entladen stoppen.
14. **Ton nach dem Bild.** Wirkt verspätet. Abhilfe: 0,3–0,5 s Pre-Roll.
15. **Trigger kleiner als die Optik.** Frustriert. Abhilfe: Trigger ≈ 1,3–1,5× Optik (Tiny Skies: 0,22 zu 0,15).
16. **Austritt im Gelände oder in der Wand.** Abhilfe: Bodenhöhe und Freiraum prüfen, sonst den Punkt verschieben.
17. **Partikel und Trails über den Sprung hinweg.** Abhilfe: zurücksetzen (Tiny Skies macht das auch).
18. **Sprites rollen oder drehen mit.** Abhilfe: zylindrisches Billboard, spiegeln mit Hysterese, Pitch-Hüllkurve.
19. **Effektquellen ohne Ort.** Bildschirm-Flashes und Vignetten. Abhilfe: Licht und Partikel kommen vom Ring, aus der Truhe, vom Auspuff, über das eine Rig.
20. **Halte-Loop ohne Deckel.** Lädt die Welt nie, loopt der Tunnel ewig. Abhilfe: `maxHold`, danach Nebel-Fallback und ein Log-Eintrag.
21. **Eingabe hart an und aus.** Wirkt wie ein Schnitt. Abhilfe: Eingabe-Gewicht als Spur mit Rampen.
22. **Belege.** Übergänge werden aus Front- oder Seitenkamera *und* aus der Spielkamera abgenommen; die Proof-Kamera kann per Scrubbing jeden Zeitpunkt zeigen (reine Funktion von t).

---

## 5 · Quellen

**Tiny Skies (Primärquelle: Code gelesen, nichts übernommen)**
- Spiel: https://tinyskies.vercel.app/
- Repository: https://github.com/dannylimanseta/tinyskies, darin vor allem `client/src/game/CarpetPortalSystem.ts` (Portal-Paar, Öffnen, Wabern, Streckentest, Scharfschalten, Richtungs-Mapping), `client/src/game/CosmicWorldPortal.ts` (Riss-Portal, zylindrisches Billboard, Halo, Sterne), `client/src/game/Game.ts` (Menü-Globus, Intro-Flug 5,2 s, Void-Wechsel), `client/src/game/CameraRig.ts`, `client/src/ui/TransitionOverlay.ts` (schwarze Blende)
- Entwickler-Post zur Einreichung: https://x.com/DannyLimanseta/status/2049130261204644208
- Listing (Tech-Stack, Spielinhalt): https://vibegameslist.com/games/tiny-skies
- PlayDrop-Eintrag: https://www.playdrop.ai/@dannylimanseta/tiny_skies
- Vibe-Jam-Portal (grüner Ring in allen Jam-Spielen): https://x.com/levelsio/status/2042608526908919898

**Ratchet & Clank: Rift Apart**
- GDC-Vortrag „Shifts and Rifts: Dimensional Tech“ (Inhalt nicht eingesehen): https://gdcvault.com/play/1027872/Shifts-and-Rifts-Dimensional-Tech
- Tech-Director zum Streaming auf Basis von Spider-Man: https://www.gamesradar.com/ratchet-and-clank-rift-apart-tech-director-explains-how-it-builds-on-ideas-from-spider-man-ps5
- Jon Burton, Void-Zwischenort: https://www.videogameschronicle.com/news/ratchet-clanks-rifts-could-easily-have-been-done-on-ps3-claims-travellers-tales-founder/
- Lade-Übergang (Push Square): https://www.pushsquare.com/news/2021/04/this_ratchet_and_clank_rift_apart_loading_transition_is_a_reminder_of_what_ps5_can_do

**God of War (2018)**
- https://en.wikipedia.org/wiki/God_of_War_(2018_video_game)
- https://www.pushsquare.com/news/2018/03/no_load_screens_no_camera_cuts_in_god_of_war_seemed_impossible_says_dev
- https://gamedeveloper.com/production/barlog-i-god-of-war-i-s-single-shot-camera-trick-was-a-tough-sell-for-devs

**Outer Wilds**
- Making of (Low-Res-Stellvertreter beim Streaming): https://www.gamesradar.com/the-making-of-outer-wilds

**Globus-Zoom / Fly-To**
- van Wijk & Nuij, „Smooth and efficient zooming and panning“ (2003): https://typeset.io/pdf/smooth-and-efficient-zooming-and-panning-339ds7zmn1.pdf
- d3 `interpolateZoom` (ρ): https://d3js.org/d3-interpolate/zoom
- MapLibre `FlyToOptions` (`curve` 1,42): https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/FlyToOptions/
- deck.gl FlyToInterpolator: https://cdn.jsdelivr.net/npm/@deck.gl/core@9.3.2/src/transitions/fly-to-interpolator.ts

**Portal-Rendering**
- Sebastian Lague, Coding Adventure: Portals (Zusammenfassung mit Kapiteln): https://rosetta.to/u/sebastianlague/coding-adventure-portals
- Unity-Portal-Demo (Near-Plane-Artefakt, Stencil vs. Render-Target): https://github.com/pr0g/unity-portal-rendering

**Kamera-Blend und Zeitspannen**
- Cinemachine Blending: https://docs.unity3d.com/Packages/com.unity.cinemachine@2.9/manual/CinemachineBlending.html
- Unreal AnimNotifyState (Begin/Tick/End): https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/AnimNotifyState?application_version=5.1
- Bekannter Fehler bei Loops: https://forums.unrealengine.com/t/anim-state-notifies-dont-consistently-fire-begin-end-events-for-looping-anim-sequences/2607779
- Gaffer On Games, „Fix Your Timestep“ (aus Vorwissen, nicht neu abgerufen): https://gafferongames.com/post/fix_your_timestep/
- three.js `WebGLRenderer.compileAsync` / `initTexture` (aus Vorwissen, Doku-Seite): https://threejs.org/docs/#api/en/renderers/WebGLRenderer

**KFB intern**
- `30_DECISIONS/replies/BACKLOG_WATER_TUNNEL_PORTAL_R1.md` (V-621–V-623, Portale + Ruhestein)
- `30_DECISIONS/replies/UFO_TRACTOR_LAB_R2_REF/ufo-event-lab/EVENT_CONTRACT.json` (Phasen und Hooks, „pure function of t“)
- `30_DECISIONS/replies/WSA_GUIDED_HYPERSPEED_WARP_RIDE_PLAN_R1_2026-10-16.md` (Lade-Priorität Kollision vor Szenerie, Tunnel als Kaschierung)
- V-092/V-093 (TinySkies-Effekte, Portale TBD), V-385 (ein Rig), V-403 (Speckle-Übergänge)

**Was abgeleitet und nicht belegt ist:**
- die genaue Mechanik der Rift-Apart-Übergänge (nur Pressestimmen und Vortragstitel);
- das God-of-War-Laden hinter der Reise-Sequenz (Fan-Quelle);
- Krümmungs-Uniform, Halte-Loop, Schnappschuss-Durchblick, alle Zeitwerte für KFB (mein Vorschlag, mit Proof zu kalibrieren).
