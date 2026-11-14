# Mentales Modell · Brauen und Augen im Cartoon · R1 (WS0, 14.11.2026, V-1783)

Anlass: q683 FAIL der Brauen (Georg 14.11.): „die augenbrauen sind einfach nur nach innen gedreht – das passt weder zur augen/augenbrauen-logik noch hilft es, angry zu vermitteln! die eyebrows müssen über den augen stehen, nicht extrem in sie reinstecken! → vgl. comic & cartoon expression“ und „ihr messt nur und ratet heuristisch“.
Fehler von WS0: Die alte Haltung (Braue senken + drehen um die Mitte) wurde nur hochskaliert. Dadurch rutschte die Braue in das Auge, und Drehen um die Mitte hebt das äußere Ende genauso, wie es das innere senkt.

## 1 · Was eine Cartoon-Braue ist
- Die Braue ist der **Deckel über dem Auge**, kein freies Teil. Sie liegt auf der Brauenlinie über dem Augapfel und folgt seiner oberen Rundung.
- Sie hat **zwei Enden**: das innere (zur Nase) und das äußere (zur Schläfe). Ausdruck entsteht, indem die **Enden einzeln steigen oder sinken**. Die Schräge ist die Folge davon, keine freie Drehung um die Mitte.
- **Abstand-Regel:** Die Unterkante der Braue bleibt immer über der Oberkante des Augapfels, mit einem kleinen Spalt. Die Braue steckt nie im Auge. Das gilt in jeder Stärke.
- Übertreibung (Tex Avery, Nickelodeon) geht **vom Auge weg**: Brauen springen hoch, bis über die Kopfkante, und Augen werden größer oder treten hervor. Übertreibung geht nie ins Auge hinein.

## 2 · Braue und Lid sind gekoppelt
- Das **Oberlid nimmt die Schräge der Braue auf**. Bei Wut senkt sich das Lid innen mit, und das Auge wird schräg angeschnitten. Die Wut liest man an dieser Schnittkante, nicht am Drehen der Braue.
- Bei Sorge oder Trauer hebt sich das Lid innen, außen hängt es.
- Bei Überraschung gehen die Lider ganz auf, und die Brauen steigen bogenförmig hoch. Beides öffnet das Gesicht.
- Faustregel: Das Lid folgt der Braue zu etwa zwei Dritteln. Senkt sich die Braue bis an die Abstand-Grenze, schiebt sie das Lid vor sich her.

## 3 · Ausdrücke als Enden-Höhen (relativ zur Ruhe, in Augenradien R)

| Ausdruck | inneres Ende | äußeres Ende | Oberlid | Lid-Schräge | Lesart |
|---|---|---|---|---|---|
| grimmig / Wut | runter bis an die Abstand-Grenze | bleibt oder leicht hoch | halb zu | innen tief | V-Brauen, angeschnittene Augen |
| anstrengung | runter bis an die Grenze | leicht runter | weit zu (Kneifen) | innen tief | gepresst |
| zielen | ein Auge: innen runter, Lid stark zu; anderes ruhig | – | einseitig | einseitig | Kneifen |
| besorgt / Trauer | hoch | runter | leicht zu | innen hoch | umgekehrtes V |
| treffer / Schreck / entdecken | beide weit hoch, Bogen | beide hoch | ganz auf | 0 | offenes Gesicht |
| skeptisch / Triumph | eine hoch (Bogen) | andere flach tief, Lid halb | ungleich | ungleich | schief |
| gelangweilt / warten | leicht runter | leicht runter | schwer (halb zu) | 0 | müde |

Stärken: **heute** = bisherige Werte (Georg q683: bleibt Standard). **cartoon** und **extrem** vergrößern die Wege der Enden und den Lid-Schnitt. Die Abstand-Regel wird **nach** dem Skalieren durchgesetzt: Die Braue stoppt an der Grenze, und das Lid übernimmt den Rest. Extrem lässt Brauen nach oben aus der Kopfkante wandern, nie nach unten.

## 4 · Umsetzung (Spiel und Web gleich)
- Braue je Seite über **(inneres Ende, äußeres Ende)** gesteuert. Daraus folgen Mitte und Schräge mit der echten Brauenbreite. Das Drehzentrum ist also nicht mehr die Mitte.
- **Grenze aus der Geometrie, nicht geraten:** Oberkante des Augapfels aus dem Augenrahmen (Augenmitte + R). Unterkante der Braue an beiden Enden aus ihrer Hülle im Ruhezustand. Spalt mindestens 0,08 R.
- Lid-Schräge (Rig-Kanal `slant`) und Oberlid je Pose aus der Tabelle, gekoppelt an die tatsächlich erreichte Brauenhöhe.
- Beleg: nah und mittlere Entfernung, gleiche Kamera. Ein Prüfbild mit eingezeichneter Grenze (Augen-Oberkante) zeigt, dass keine Braue darunter rutscht.

## 5 · R2 nach der Recherche (RECHERCHE_MIMIK_R1.md: Etherington, Williams, Cohen/SpongeBob, John K./Ren, FACS)
- **Kontaktlinie ist die Oberlid-Kante, nicht der Augapfel.** Die Braue steuert, das Lid trägt die Form („compress or pull open“).
  - Bei Wut senkt sich das Oberlid um 30–45 % und kippt parallel zur Braue, innen tief. Die Braue liegt auf dieser Kante, Spalt 0, nie darunter.
  - Neutral und bei Trauer schwebt sie 0,05–0,1 Augenhöhen darüber.
  - Die Pupille bleibt bei Wut ganz sichtbar.
- **Drei Regler je Braue:** Innenhöhe, Außenhöhe, Zug zur Mitte (FACS AU1/AU2/AU4).
  - Kein Drehen um die Mitte. Bei Wut liegt der Drehpunkt nahe am Außenende.
- **Durchgehende Linie:** Beide Brauen ergeben eine Geste: V (Wut), Dach (Sorge), Welle (Skepsis).
- **Takes:**
  - Ausholen mit Augen zu, Brauen auf den Lidern.
  - Akzent: Brauen schnellen hoch, das Auge streckt sich nach oben.
  - Der Akzent steht etwa 6 Frames, dann folgt die Beruhigung. Der Kopf führt.
- **Ohren:** hoch und vorn = Wachheit, Überraschung, Freude · flach zurück = Wut, Angst · hängend = Trauer · ein Ohr zuckt = Skepsis.
- **Werte je Ausdruck:** Tabelle (b) in RECHERCHE_MIMIK_R1.md. Die Richtungen sind belegt, die Zahlen sind Startwerte für das Rig.
