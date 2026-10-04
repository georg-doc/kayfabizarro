# Changelog · KFB Travel Globe v13

Zweig aus v12 (FROZEN) am 3.9.2026. Ziel: TS-Delta Stufe A/B aus `docs/TS-DELTA-v12.md`.
Additiv geführt, nichts überschrieben. Jede Zeile nennt, was gemessen und was entschieden wurde.

---

## 3.9.2026 · Sitzung 1 (abends)

### Neu

| Modul | Was | Herkunft |
|---|---|---|
| `contrails.js` | **Comic-Speedlines am Fahrzeug.** 72 Stützpunkte je Band, eisblaue Tönung, additiv, Bandaufbau zeichengleich zur Quelle | `tinyskies/client/src/game/Contrails.ts` |
| `pet-traegheit.js` | **Cartoon-Verformung, die der Flugphysik träge folgt.** Antrieb aus dem Rückstand zwischen Fahrzeug und Körper; Verformung im Wurzelraum, damit die Hierarchie unangetastet bleibt | eigener Bau auf `kfb-cartoon-deform.js` |

### Geändert

| Modul | Was |
|---|---|
| `intro-flight.js` | **Standbild vor dem Anflug**: hält auf dem ersten Bild, bis das Pet-GLB angekommen ist (max 2,4 s, `dt = 0`, keine zweite Kurve) |
| `camera-rig.js` (Aufrufe in `globe-poc.js`) | **Drei Kamera-Voreinstellungen**: Ours (0,52 / 60°) · tinyskies 1:1 (1,2 / 0,7 / 60°) · tinyskies-Geometrie bei unserer Pet-Größe (1,2 / 28°). Standard unverändert |
| `karten-teppich.js` | **Tuschehaken für gesammelte Karten gestrichen** (Georg, 3.9.: „keine gute lösung, der muss weg"). Gesammelte Karten bleiben gedämpft; Färbung oder Rahmen-FX ist offen |
| `pet-lighting.js` | nichts geändert — das Bodenreflex-Licht für die untere Pet-Region existiert seit 2.9. Die Regler wurden nur im Panel benannt |
| `globe-poc.js` | Verdrahtung, Panel-Zeilen und Tore der oben genannten Module. Versionsbezeichner in HUD, Panel-Kopf und Diagnosebericht auf v13 gezogen (standen auf v9 bzw. v12) |

### Vier deklarierte Abweichungen von der Quelle (Contrails)

Weil sie nicht Geschmack sind, sondern Bauentscheidungen mit Begründung:

1. **Anker in der gezeichneten Karte.** Die Quelle hängt die Bänder an die Flügelspitzen eines
   Doppeldeckers (±0,111). Unsere Karte ist 0,075 breit, also lägen dieselben Zahlen in der Luft.
   Die Anker sind zwei `Object3D` **in** `carrier.lean`, Maße von der Karte selbst (`halfW`/`halfD`),
   Höhe pro Bild aus `surfaceAt` gelesen. **Was nicht abgeschrieben wird, kann nicht driften.**
2. **Mindestschritt.** Ein neuer Stützpunkt entsteht nur bei echtem Weg, sonst wird der Kopf
   nachgezogen. Ohne das stapeln im Stand 72 additive Vierecke auf einem Fleck — ein Punkt, der pro
   Bild heller wird. **Die Quelle braucht das nicht: ihr Doppeldecker hat keine Bremse und kein
   Schweben, sein Tempo erreicht nie null.**
3. **Tempo-Blende über die ABSOLUTE Fahrt** (Rampe 0,08 bis 0,22 u/s), nicht über `speedRatio`.
   Die Reisefahrt liegt exakt auf dem Tempoboden 0,28 und wird gegen das Maximum 0,78 gemessen, also
   ist das Verhältnis dort 0,000 — dieselbe Zahl wie im Stillstand. Eine Blende darauf hätte die
   Striche aus der ganzen normalen Fahrt gelöscht.
4. **Kein Tiefentest** (renderOrder 6). Baumkronen und Hänge schnitten die Bänder auf Flughöhe ab.

### Werte, die wir bewusst verlassen haben

| Größe | Quelle | Bei uns | Grund |
|---|---|---|---|
| Bandbreite | 0,005 | 0,0034 | Georg: ein Drittel schmaler |
| Alpha-Gain | 0,55 | 0,33 | additives Weiß über dunklem Gelände liest lauter als über hellem Himmel |

### Gemessen, nicht behauptet

- **`CameraRig.ts` gelesen und verglichen.** Unser Rig ist parameteridentisch; abgewichen sind nur
  die Argumente. `closeDamp = clamp(dist/0,95; 0,36; 1)` dämpft Positions- **und** Blickglättung mit
  dem Abstand, also lief unsere Kamera bei 0,52 dauerhaft auf 55 % (5,5/s statt 10,0/s) und 0,30
  statt 0,70 Höhe. Das ist der Grund, warum tinyskies „etwas besser" wirkte.
- **Beleuchtung gegen `Game.ts` geprüft.** Die sieben Preset-Lampen und `playerLight` waren bereits
  portiert (`sky-presets.js`, `avatar-lamp.js`), dazu ein achtes eigenes Fülllicht, das dem Fahrzeug
  folgt. In der Quelle hebt **nichts** die Schnauze: `playerLight` sitzt 0,15 über dem Spieler, und
  Fill/Back stehen in Weltkoordinaten auf 60 u, wandern also auf einer Kugel relativ zum Pet mit dem
  Ort. Kein Presetwert kann das lösen, nur ein Licht im lokalen Rahmen — genau das ist unser achtes.

### Post Mortems

| Was gebrochen war | Ursache | Regel |
|---|---|---|
| Speedlines mit Lücke zur Karte, zweimal | Maße aus `carpet-mesh.js` gerechnet, gezeichnet wird der CardCarrier (0,042 tief statt 0,09) | **Frag das Objekt nach seinen Maßen** |
| Ein Strahl statt zwei, unter dem Pet | Ein fehlerhafter Edit schrieb literale Zeilenumbrüche, die Zuweisung `ankerX` landete im Kommentar, die Anker blieben bei (0,0,0) | **Jedes Tor nennt eine Zahl, die falsch werden kann** |
| Speedlines in der ganzen normalen Fahrt unsichtbar | Blende auf `speedRatio` statt auf absolutem Tempo | **Wer Bewegung meint, muss Bewegung messen, nicht Ausnutzung des Spielraums** |
| Speedlines standen auf der anderen Seite des Planeten | Nur eine Wache am `update`, keine eigene Sichtbarkeitszeile; ohne Tiefentest von überall sichtbar | **Ein Effekt, der nicht mehr rechnet, hört damit nicht auf zu erscheinen** |
| Ein Tor meldete ⚠ für den gesunden Standardfall | Bedingung verlangte Stützpunkte, im Schweben ist ein Punkt richtig | **Ein Instrument, das den Normalfall warnt, erzieht dazu, es zu überlesen** |
| Drei eigenmächtige Änderungen an einem Abend | „Routineentscheidungen selbst treffen" auf sichtbare Änderungen angewandt | **Eine Änderung, die verändert, was der Nutzer sieht, ist niemals eine Routineentscheidung** |
| Beinahe zerstörtes Augen-Rig | `applyCartoonDeform` backt die Hierarchie ein und hängt an die Wurzel um. Für Requisiten richtig, für Figuren tödlich, und ohne Fehlermeldung | **Ein Werkzeug für Requisiten ist keins für Figuren** |
| `karten-teppich.js` beim Entkernen zerlegt | `...string.join()` spreizt einen String in Einzelzeichen; die Datei stand danach mit einem Zeichen je Zeile da. Wiederhergestellt aus `globe-v12/karten-teppich.js` (v13 war eine 1:1-Kopie, die Datei war heute unberührt) | **Ein Skript, das Zeilen ersetzt, arbeitet mit einem ARRAY von Zeilen.** Und: eine eingefrorene Vorgängerversion ist kein Ballast, sondern die Wiederherstellung |
| Der Standalone-Export war dreimal unbrauchbar, und vier Dokumente behaupteten jedes Mal das Gegenteil | Ein Bündler faltet `<script type="module" src="…">` in EINEN `blob:`-Modulblob. Eine Blob-URL ist keine hierarchische Basis, also scheitert jeder `./x.js`-Spezifizierer beim Parsen — und `globe-poc.js` beginnt mit 87 davon. Sechs Konsolenfehler, blaue Seite ohne Canvas. README, HOUSEKEEPING, Changelog und `github.md` waren geschrieben, bevor die Datei geladen worden war | **Ein Bündel ist erst fertig, wenn es geladen wurde, nicht wenn es geschrieben wurde.** Reparatur ist eine **Blob-KETTE**: jede Quelle ein eigener Blob, relative Spezifizierer vorher auf die Blob-URLs der Abhängigkeiten umgeschrieben, Kinder zuerst. Dasselbe Muster gab es im Arbeitsbereich schon (`endless/original-loader.js`) — also war es auch ein Fall von „nutzen, was läuft" |
| Die Blob-Kette war richtig und lief trotzdem nicht | Der Bündler-Durchgang schreibt camelCase-Bezeichner in Inline-Skripten auf kebab-case um (CSS-Scoping, das über die eingebettete Nutzlast lief): `maxAmplitude` → `sc-camel-max-amplitude`, **1616 Vorkommen in 79 von 87 Modulen, nur 6 parsten noch** | **Wer Quelltext einbettet, schickt ihn durch keinen Bündler mehr.** Der Export wird direkt zusammengesetzt, und die Nutzlast liegt base64: darin stehen keine Bezeichner, also kann keiner umgeschrieben werden |
| Der Prüfgriff gab zweimal grün für ein totes Bündel | Er zählte, was DALIEGT (87 Quellen), nicht was LÄUFT; die zwei Canvas waren die Hülle; das Bündel-Catch rief `console.error` direkt und ging nie durch den Boot-Error-Haken; und gefragt wurde nach `window.__GLOBE`, der Handle heißt `window.__globe` | **Ein Prüfgriff, der die falsche Frage stellt, ist ein grünes Licht ohne Leitung.** Er fragt jetzt `__KFB_BUNDLE.ok` (wahr erst nach erfolgreichem Import) und liest die laufende Welt |
| Die dritte Fassung lief und sah trotzdem kaputt aus: 1,3 kB Laufzeit-Quelltext standen sichtbar oben auf der Seite | `support.js` wurde als Inline-Skript eingelegt und nur `</script` maskiert. Es führt aber auch die **öffnende** Folge `<script` in einem String-Literal, und die schaltet den HTML-Tokenizer in einen Zustand, in dem das folgende `</script>` nicht mehr schließt — der Rest rutschte als Textknoten in den Body, dazu ein zweiter Bootversuch | **Beim Einbetten von Quelltext in HTML zählen BEIDE Tag-Sequenzen.** Alles Eingebettete liegt jetzt base64, und der Build prüft die Paarigkeit von `<script`/`</script>` außerhalb der Nutzlast, bevor er schreibt |
| Drei Abnahmen hintereinander grün gemeldet, ohne die Seite anzusehen | Zahlen wurden gelesen, das Bild nicht | **Bild UND Zahl, nicht statt.** Der Prüfgriff liest jetzt auch `document.body.innerText` — die Zahl, die Quelltext auf der Seite verrät |
| Das README verwies auf `docs/WIRT_v13.md`, die Datei existierte nicht | Der Verweis wurde geschrieben, als das Dokument geplant war; danach nie geprüft. Der Kollege hat richtig gesucht und nichts gefunden. Nachgeholt am 3.9.: der Host-Vertrag ist jetzt geschrieben, **am Code abgelesen** statt aus der Erinnerung | **Ein Verweis ist eine Zusage.** Ein Dokument, das ein anderes nennt, muss die Datei nennen können — dieselbe Prüfung, die `vertragTor()` bei Fahrzeugen macht (Zusage vs. Ist), fehlt für Dokumentverweise noch. Bis es sie gibt: **kein Dateiname in einem Dokument, den man nicht im selben Zug angelegt hat** |

---

## Offen bei Abschluss dieser Sitzung

Siehe `docs/SPRINTPLAN_v14_frischer-Chat.md`, dort mit Reihenfolge und Entscheidungen. Kurz:

- **Karten unter Wasser** (Georg, 3.9., mit Bild). Zwei Ursachen möglich, der Wasser-Zähler im Panel
  trennt sie ohne eine Zeile Code.
- **Karten im Wasser sind gespiegelt.** Als Sache der Ebene belegt und nicht der Kartentextur, denn
  der Tuschehaken war ein eigenes Mesh mit eigener Textur und war genauso gespiegelt.
- **Marke für gesammelte Karten** neu: Färbung oder Rahmen-FX statt Symbol.
- **TS-Delta Stufe A Rest:** `FireflyCluster` · `FloatingLanterns` · `BirdFlock`.
- **Mech-Slice v10** einbauen, fünf Nähte. v10 baut gerade seine SFX, der Export kommt später.
- **Wirt ablesen** (`docs/WIRT_v13.md`) vor dem ersten fremden Modul.
