# Übergabe an WSA & frischen Design-Chat · FrankenStein Studio v16
*13.09.2026 · aus der Sitzung »v15 → v16«. Alles hier Genannte ist gemessen, nicht erinnert.*

## 1 · Tint ist auch beim CHARAKTER der falsche Weg — dieselbe Regel wie beim Rover

Die Übergabe vom 12.09. sagte das für den Rover. Am Charakter gilt sie genauso, und der Grund ist
derselbe: **ein Material über viele Netze.** Georgs Befund am 13.09.: »diese ganzen Färbungen
rausnehmen, die einfach nur einen Tint darüber setzen — die hat über 2000 Dreiecke einfach blau
gemacht.« Sieben Reihen (Palette · Kleidung · Akzent · Augen · Gesicht · Grundgelb · Sättigung) sind
raus und **ersetzt**, nicht versteckt.

**Was die Messung sagt** (Driver, 13.09.):

| | |
|---|---|
| Materialien am Wirt | **eines** (`driver_texture`) |
| Netze | sieben |
| Jacke, Hose, Schuh | stecken in **denselben** Netzen |

Ein Tint über Material- oder Mesh-Namen kann sie deshalb gar nicht trennen. **Was sie trennt, ist
die Textur:** `driver_texture` ist kein gemaltes Kleidungsstück, sondern ein **Farbfeld-Atlas**,
gemessen **8 × 4 Felder à 128 × 256** (Rasterkanten aus dem Bild gemessen, nicht angenommen). Jedes
Dreieck zeigt über seinen UV-Schwerpunkt in genau ein Feld:

| Feld | Zone | Dreiecke |
|---|---|---|
| r1c1 | **Jacke** | 992 (Körper 384 · Arme je 304) |
| r0c0 | Haut · Hände | 760 |
| r1c7 | **Hose** | 376 |
| r2c6 | Brille · Gestell | 364 |
| r0c1 | Wirtskopf (verdeckt) | 336 |
| r2c3 / r2c4 | **Schuh** dunkel / hell | 296 / 136 |
| r0c2 | Schwarz · Brillenglas | 158 |
| r3c5 | **Shirt** (kleines GO GO GO) | 78 |
| r3c6 + r3c7 | **Rückenfeld** (großes GO GO GO → Wortmarke) | 36 + 36 |

**Der Weg, der hier funktioniert — und der Unterschied zum Rover.** Der Rover bekam Zonen am OBJEKT
(`userData.kfbZone` + Material pro Netz **klonen**). Am Charakter geht das NICHT: die Zonen liegen
innerhalb eines Netzes. Stattdessen **drei Leinwände im Atlas-Raster** — Farbe, Rauheit, Metall —
und **kein einziger Schnitt am Netz**. Damit bleibt der Hautschnitt alleiniger Eigentümer der
Netz-Indizes; zwei Eigentümer für dieselben Indizes ist die Fehlerklasse, die dieses Projekt schon
zweimal bezahlt hat.

Farbe **ersetzt den Farbton und behält den Verlauf** (jeder Punkt behält sein Verhältnis zur
gemessenen mittleren Leuchtdichte seines Feldes) — Naht, Falte und Logo bleiben stehen. Ein flaches
Überstreichen hätte sie mitgenommen. Oberfläche ist eine **eigene Karte**: Stoff · Matt · **Leder**
(Rauheit 0,44 + deterministisches Korn + Hauch Metall) · Lack · Metall.

**Abnahme am gerenderten Bild** (`readPixels` nach eigenem `render`, nicht am Eindruck): Jacke auf
#1a1a1a + Leder → orange Bildpunkte **256 935 → 190 382**, dunkle **19 091 → 92 998**; zurück auf
Original ergibt **exakt 256 935** wieder.

**⚠ Ein Regler, der nichts bewegt, ist schlimmer als keiner.** Das Hautfeld r0c0 trägt am Wirt die
Hände — aber der Hautschnitt hat ihnen ein Material OHNE Bildtafel gegeben (`kfb-skin`); eine Farbe
in der Leinwand käme dort nie an. Dieses eine Feld geht deshalb den Weg, der wirkt (`setSkinColor`).
Und: **Rollenfarbe multipliziert die Leinwand** — steht eine, sagt es die Leiste und bietet »auf
Original« an, statt still zu gewinnen.

**Übernehmbar:** `frizzlegraft-v1/matzones.v1.js` — `buildMatZones()` (Raster messen, Felder finden,
drei Leinwände anlegen), `setColor`/`setFinish`/`apply`/`export`, `setStamp` (Aufdruck nach dem
Anstrich), `reassert` (Karten wieder anhängen, wenn jemand nach uns am Material war).

## 2 · Der Kopf hat eigene Zonen — freie Wähler statt Hauttöne

Georg: »die Idee ist nicht, dass das wie ein Kostüm wirkt, sondern dass ich das Gesicht gelb, blau,
grün färben kann.« Gemessen: Kopf = **ein** Netz `kfb-head` (1500 Dreiecke) mit **zwei** Materialien
— `Main` #f7cb00 (Schädel, Ohren, Zacken) und `Main_Light` #f6c19d (Gesicht, Schnauze). Auge = vier
Netze je Seite: Augapfel #f3ede2, Pupille #070707, zwei Lider #ceaa20. Nase, Braue und Schnurrbart
sind eigene Bauteile; **die Braue trägt ein ShaderMaterial OHNE `color`** — sie geht ausschließlich
über `brow.set({color})`.

Acht Zonen, **kein neuer Speicherort für sechs davon** (`graft.zones.bodyHex/faceHex`,
`graft.roles.eyes`, `nose.color`, `brow.color`, `moustache.color` gab es längst). Neu sind nur
`eye.sclera` und `eye.pupil` — die standen im geteilten Augen-Rig hart und hatten keinen Eigentümer.

**⚠ Ein Meßfehler von mir, benannt statt verschwiegen.** Die erste Abnahme sagte »Gesicht färbt sich
nicht«: blaue Bildpunkte vorher wie nachher. Der Bau war gesund — **die Figur stand mit dem Rücken
zur Kamera.** Am Material nachgemessen: #f6c19d → #2f6f8f → zurück. Die Hausregel »getroffen ist
nicht gesehen« gilt auch andersherum: **nicht gesehen ist nicht kaputt.**

## 3 · Die Original-Augen des Spenders — eine Regel, die für jeden Spender gilt

`headgraft` nimmt aus dem Spender ALLE Dreiecke an Kopf- und Ohrenknochen; FrizzleBobs eigene
Augenschalen hängen dort auch und nehmen die Kopffarbe an (Georgs »gelbe Augen unter dem Rig«).
**Über Material- oder Mesh-Namen sind sie nicht zu finden.**

Gefunden über **zusammenhängende Inseln** (Punkte, nicht Indizes — der Exporter gibt jedem Dreieck
eigene Ecken, über Indizes zerfiele der Schädel in 768 Inseln): acht Inseln, davon Schädel 768
mittig, Ohren 2 × 120 bei z −0,297, Zacken 2 × 108 bei z 0,241 (nicht exakt gespiegelt), mittlere
Zacke 84, **Augenschalen 2 × 96 bei x ±0,513, z 0,604**. Die Regel: unter den exakt gespiegelten
Paaren gleicher Dreieckszahl gewinnt **das vorderste**. Ohren fallen über z heraus, Zacken über die
Spiegelung. Schwellen sind **Anteile der Kopfbreite**, keine absoluten Zahlen — sonst gilt es nur für
diesen Spender.

Ausgeblendet mit **Zeichengruppen, nicht geschnitten** (192 Dreiecke weg, 1308 von 1500 bleiben);
`restore()` holt sie zurück. Modul: `frizzlegraft-v1/donoreyes.v1.js`.

## 4 · Der Zweiknochen-Löser hat eine Falle, die jedes Rig trifft

Georg: »rechter Arm ist broken und wackelt/dreht sich.« **Nicht der Löser war kaputt — die
Ellbogenebene war entartet.** Der Hinweis steht fest auf L [1,−0,6,−0,2] / R [−1,−0,6,−0,2], also
fast PARALLEL zur Armachse, sobald der Arm zur Seite zeigt. Was nach dem Herausprojizieren der Achse
übrig bleibt, ist ein Rest nahe null, dessen Richtung mit jedem Bild springt. Dazu: **der Löser faßt
den Handknochen nie an** (er hängt an keiner der zwei Ketten) — die Bildschleife dreht ihn weiter.

Drei Eingriffe in `pose-rig.v1.js`: eigener Hinweis je Haltung, Notausgang-Schwelle von **1e−6 auf
0,05** (fast entartet ist auch entartet), Hand zurück auf ihre gemessene Bindelage nach jedem Lösen.

**⚠ Und ein zweiter Fehler von mir.** Mein erstes Ziel rechnete mit `a.armLen` = **0,3157**; die
Kette misst **0,5758**. Nach der Korrektur lag das linke Ziel bei **1,037 der Reichweite** — außerhalb,
der Löser klemmt auf Strecklage, der Arm steht durchgedrückt. **Ein Ziel aus absoluten Koordinaten
kann das Verhältnis nicht garantieren.** Es wird jetzt vom Schulterpunkt aus gesetzt: Richtung ×
0,82 der Reichweite. Nachgemessen: beide Seiten **0,820**, Fehler 0,0039, Drift über 60 Bilder **0**.

## 5 · Die Travel-Abgabe — und warum Einheiten die ganze Arbeit sind

Nach Georgs Briefing »KFB Travel Globe · FrizzleBob Card Rider«. Das Studio bleibt Mess-, Aufsetz-
und Pose-Werkzeug: keine Flugphysik. Kartenmaße (§3) und Facing-Kurve (§7) sind **zitiert, nicht
nachgebaut** — eine zweite Kurve wären zwei Wahrheiten.

**Die Bühne des Studios hat ihren eigenen Maßstab** (Figur bei ×0,42). Eine Zahl daraus wäre in
Travel bedeutungslos — die Falle vom Wannen-Sitz (`RACE.lift = −0,28`). Deshalb ist **die Karte der
Maßstab**, und jede exportierte Zahl steht in **Card-Einheiten**. `actorScale` ist genau der Faktor,
mit dem Travel die Figur auf die echte Karte setzt.

Gemessen wird an den **Fußknochen**, nicht an der Bounding Box — die endet bei dieser Figur an den
Ohren.

**⚠ Drei Fallen, alle erst im Messen sichtbar geworden:**
1. **Startmaßstab über den Fußabdruck** ergab eine Figur von 3,82 Card-Einheiten Höhe auf einer 3,0
   breiten Karte. Der Maßstab hängt jetzt an der **Höhe**.
2. **`seatLift` war ein Reglerwert**, also eine Null, die im Bild falsch ist: in der Surf-Pose steht
   der tiefste Fußpunkt **unter** der Kartenoberkante, weil das Pose-Rig die Wurzel nicht mithebt.
   Der Export nimmt jetzt den **gemessenen** Lift.
3. **`basePose` war ein Literal und hat gelogen:** der Export schrieb immer »CARD_SURF_BASE«, auch
   wenn die Figur im Sessel saß — mit den Zahlen des Sessels. Travel LIEST dieses Dokument (§10).
   Jetzt kommt `basePose` aus der wirklichen Pose, plus `basePoseMatches` und eine Warnzeile.

## 6 · Was OFFEN ist

Steht vollständig in `OFFEN_nach_v16.md`, hier die Kurzfassung mit dem, was daran gefährlich ist:

1. **Kartenmotiv um 90° drehen.** Meine Drehung beruhte auf einer Annahme (»447 × 800 = hochkant«);
   die Datei ist **800 × 447**, also schon quer. Erst die Blattlage messen, dann drehen.
2. **Kippung greift im Bild nicht.** Ich habe nur Zahlen gemessen (Karte 0,384 = Figur 0,384) — das
   beweist nicht, daß im Bild etwas kippt. Verdacht: die Bildschleife schreibt `position` und
   `quaternion` der Figur jedes Bild neu, dann hält die Kippung genau ein Bild. **Zwei selbst
   gerenderte Standbilder, bevor jemand in den Code greift.**
3. **Waffenhaltung** — siehe Briefing für das Animation Lab.
