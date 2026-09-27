# WORLD-M2 · Playability & Performance

Executor: **Work · Sol High**

## Outcome

Die aktuelle World/Flight/Clay-Runtime ist zu Fuß und im Fahrzeug stabil, kontrollierbar und spürbar flüssiger. Keine neue Welt- oder Look-Architektur.

## Reihenfolge

1. Reproduzierbare Messansicht: Ladezeit, Frame-Zeit, Draw Calls/Polygone, aktive Lichter/Schatten, Texturspeicher und Physics-/Update-Kosten.
2. Vollständiger befahrbarer Ground-Fallback unter Straßen, Grünflächen und Wegen; keine Löcher.
3. Fahrzeug-Ground-Level und Spawn korrigieren.
4. Walk/Run/Jump-Timing gegen vorhandenes MotionProfile; Double-Jump nur, wenn der aktive Modus ihn ausdrücklich besitzt.
5. Größten Kostenblock zuerst begrenzen: Sichtweite/LOD, Schatten, Clay-Material, Props, Residents oder Update-Loop – gemessen, nicht geraten.
6. Desktop und schmale Ansicht; Original/Clay A/B bleibt schaltbar.

## Performance-Matrix

Für jeden Kostenblock: Kosten hoch/mittel/niedrig, sichtbarer/gameplay Nutzen hoch/mittel/niedrig, Entscheidung keep/reduce/replace/defer.

## Nicht Teil

- keine neuen HUDs, NPC-Systeme oder Track-Designs;
- keine weitere Clay-Politur vor spielbarer Bewegung;
- keine einzelnen Prop-/Actor-Bugs auf den kritischen Pfad ziehen.

Fertig, wenn: Fuß + Auto über Straße und Gelände funktionieren, ein vergleichbarer Vorher/Nachher-Messlauf vorliegt und kein Core-Loop durch ein quarantinierbares Detail blockiert wird.
