# BACKLOG · Wasser-Fahrt, Tunnel als Bau-Element, Portale + Ruhestein · R1 · 2026-10-21 · WS0
**Register:** V-621, V-622, V-623. **Georg 21.10.:** nicht zwingend MVP, dann später. Je Block wird ein Brief, sobald das MVP läuft (V-618).

## A · Fahren im, unter und über Wasser (V-621)
- **Physik (KISS):**
  - Auftrieb und Wasserwiderstand als wenige Kräfte am Wagen;
  - Übergänge Land → Wasser → unter Wasser ohne zweite Physik-Engine;
  - Sprung aus dem Wasser.
- **VFX:**
  - Bugwelle und Kielwasser;
  - Spritzer beim Eintauchen;
  - unter Wasser Farbe, Nebel und Lichtflecken über das eine Rig (V-385);
  - Blasen.
  - Grundlage ist das Claude-Design-Wasser F0–F2 (V-052, „auf keinen Fall verlieren“).
- **SFX:** Eintauchen, Gleiten, Motor gedämpft unter Wasser, Auftauchen. Satz wird von WS0 erzeugt.
- **Kamera:** über Wasser etwas höher; beim Abtauchen weicher Wechsel; unter Wasser näher und ruhiger.

## B · Tunnel durch das Gelände als prozedurales Bau-Element (V-622)
- **Use what works:**
  - Tunnel-Bohrung (V-112);
  - exakter Boolean mit manifold-3d (V-114);
  - Portale und Innenausbau aus Bank A (V-130 PASS);
  - 4+ Joyride-Tunnel-Styles, je Tunnel wählbar (V-100);
  - Organ-Attraktionen als Vorbild (V-098).
- **Neu:** Tunnel als Bau-Element im Gelände. Eingang und Ausgang ergeben sich aus einem Pfad und der Gelände-Höhe; die Bohrung kommt sauber ins Grundmesh (V-113: keine Löcher, keine Hacks).
- **Kamera** in engen Räumen abgesenkt (V-170). Tunnel-Ton aus den Joyride-Sätzen (V-128).

## C · Portale + Ruhestein (V-623)
- **Portale** mit VFX und SFX nach TinySkies-Art (V-092/V-093).
- **Ruhestein-Logik:**
  - Der Spieler kann zu Orten reisen, die er schon kennt: Dioramen, POIs, Deck-Orte. Für den Anfang reicht eine Karte je Deck.
  - Gasthaus-Logik: ein Ort ist der Heimatort, zurück geht es per Ruhestein.
- **Ruhestein-Prop:** der KayKit-Kompass im Rucksack. Benutzen öffnet die Auswahl der bekannten Orte, dann folgt das Portal.
- **Daten:** bekannte Orte je Spielstand (Deck, Karte, Ort), Abklingzeit, Portal-Effekt.
