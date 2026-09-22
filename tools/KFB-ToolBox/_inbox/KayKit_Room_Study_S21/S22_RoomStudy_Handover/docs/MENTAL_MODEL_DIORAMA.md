# Mentales Modell · wie ein KayKit-Promoraum gebaut ist

Vor jedem Nachbau. Gelesen aus Bild S02, gegengeprüft an S03, S05, S08, S12.
Nicht geraten, nicht heuristisch gestreut.

## 1 · Der Raum ist eine BÜHNE, kein Grundriss

Zwei Wandzüge, die sich in einer Ecke treffen. Die Ecke zeigt **von der Kamera weg**, die offene
Seite zeigt zur Kamera. Der Blick steht auf der Winkelhalbierenden: beide Wände sind gleich weit
weg, keine verdeckt die andere. Brennweite lang (Isometrie-Anmutung), Kamera leicht über
Wandoberkante.

Folge für den Bau: **kein geschlossener Raum.** Vier Wände wären ein Grundriss, keine Bühne.

## 2 · Die Wand ist ein Modulband, die Ecke ist ein eigenes Teil

Jeder Wandzug hat **zwei volle Module**. Kein halbes Teil, keine gestückelte Länge.
Das geht nur, wenn die Ecke schmal ist: `wall_corner` hat einen Schenkel von 2,0 und frisst
eine halbe Fuge — im Promobild ist die Ecke schmal, also ist es **`wall_corner_small`**.

Regel: die Eckenwahl entscheidet die Wandlänge, nicht umgekehrt. Gemessen wird der Schenkel,
dann folgt „volles Teil" oder „wall_half".

## 3 · Jede Wandfläche hat GENAU EIN Ereignis

- Wand A, Modul 1: Durchgang (Tür).
- Wand A, Modul 2: Regal mit Beute.
- Wand B, Modul 1: Banner.
- Wand B, Modul 2: Wappen.

Vier Module, vier Ereignisse, kein Modul doppelt belegt und keines leer. Eine Fackel neben einem
Regal, ein Banner über einer Kiste — das ist die Überfüllung, die ein Promobild nie hat.

## 4 · Der Boden hat DREI Zonen, nicht zufällige Streuung

| Zone | Inhalt | Lage |
|---|---|---|
| **Ecke** = das Ziel | offene Truhe, Goldhaufen, Behälter | im Winkel der beiden Wände, hinten mittig |
| **Mitte** = das Leben | Tisch, zwei Stühle, Gedeck | vor der Ecke, zur Kamera versetzt |
| **Rand** = das Echo | Münzstapel, Kerzen, einzelne Kiste | an den Wandfüssen und im offenen Vordergrund |

Die Mitte des Raums ist **frei begehbar**. Nichts steht zufällig herum: jedes Randstück
wiederholt das Material der Ecke (Gold) oder der Mitte (Holz).

## 5 · Licht ist EIN Schlüssel von oben, keine Fackeln

Alle Schatten in den Promobildern fallen in dieselbe Richtung. Es gibt genau ein
schattenwerfendes Licht. Kerzen sind **Akzent**, nicht Beleuchtung — und sie stehen dort, wo
Schatten sonst leer wäre, nicht an Wänden mit Holzbalken.

Eine Wandfackel gehört in einen Korridor, nicht in dieses Bild. In S02 ist keine.

## 6 · Was ein Nachbau beweisen muss

1. **Deckungsprobe**: dasselbe Kamerabild wie die Vorlage, Vorlage überlagerbar.
2. Jedes Teil ein registrierter Pfad, keine Ersatzgeometrie.
3. Kein Teil in der Wand (Abstand gegen die **gemessene** Wandfläche, nicht gegen die Nenndicke).
4. Keine zwei Requisiten ineinander.
5. Jede Abweichung von der Vorlage **benannt**, nicht stillschweigend.

## 7 · Was in S02 nicht identifiziert ist

Rechts neben der offenen Truhe steht ein grauer Keil an der Wand — Strebepfeiler oder
Treppenwange. Nicht zugeordnet. Er wird **nicht** durch ein ähnliches Teil ersetzt;
er fehlt im Nachbau und steht in der Abweichungsliste.
