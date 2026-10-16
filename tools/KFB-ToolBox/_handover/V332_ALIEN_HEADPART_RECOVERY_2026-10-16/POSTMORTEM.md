# Postmortem · V-332 Headparts und Orc Face Owner · 16.10.2026

Status: **verbindliche Produktionsregel**  
Scope: Lady Dory, Lord Hunky, Orc Brute, alle künftigen Figurenintegrationen der KFB ToolBox

## Kurzfassung

Bei der Diagnose von Lady Dorys schwarzem Gesichtsoval und der Orc-Augenintegration wurden zeitweise Laufzeitmanipulationen erwogen bzw. lokal ausprobiert, die ein defektes oder ungeeignetes Quellmesh verdecken sollten. Zusätzlich wurde ein FrizzleBob-spezifischer Face-Mount zu breit wiederverwendet. Das führte zu sichtbaren Geometriefehlern, unerwünschten Haaren, einem schwebenden Mund und fehlenden Orc-Zähnen.

Alle entsprechenden Versuche sind verworfen und aus dem Lieferstand entfernt. Die Site wird mit diesen Befunden nicht publiziert.

## Was sichtbar schiefging

- Lady Dory: massives dunkles Oval bzw. gezackte Fläche um den Mund, erst nach vollständigem Modell-/Face-Aufbau sichtbar.
- Lady Dory: Auge/Sockel nicht koaxial; Ausdruck und Blickrichtung wirkten seitlich verdreht.
- Orc Brute: Decal-Mund schwebte neben der Schulter.
- Orc Brute: falsche bzw. nicht sauber ersetzte Augen.
- Orc Brute: FrizzleBob-Haar wurde durch einen gemeinsamen Mount-Pfad hinzugefügt.
- Orc Brute: Zähne fehlten nach einem generischen Mesh-Insel-Strip.

## Ursachen

1. **Assetdefekt wurde wie ein Rendererproblem behandelt.**  
   Lady Dorys große separate `LadyDory_Mund_Clay`-Fläche ist Teil des gelieferten GLB. Material- und Laufzeittricks können daraus kein sauberes Kopfoval machen.

2. **Owner-Grenzen waren zu breit.**  
   `_mountFaceOn` besitzt neben Augen auch Mund- und Haarpfade. Für den Orc wurde diese Kette verwendet, obwohl nur der EyeRig-Owner benötigt wird.

3. **Generische Geometrieheuristik ohne revisionsgleichen Messvertrag.**  
   Der Orc-Detektor war für eine andere Asset-Revision vermessen. Ein formal passendes symmetrisches Inselpaar war nicht automatisch das Auge; reale Gesichtsteile wurden gefährdet.

4. **Abnahme wurde zu spät auf das reale Bild zurückgeführt.**  
   Ein technisch erfolgreicher Loader oder fehlender Konsolenfehler beweist keine korrekte Figur. Der visuelle Front-/Dreiviertel-Gate muss unmittelbar nach jedem Owner-Schritt erfolgen.

## Verbindliches Verbot: keine Runtime-Mesh-Hacks

Für Produktionsassets sind ab sofort verboten:

- Vertexpositionen zur Laufzeit verschieben, abflachen oder selektiv überschreiben, um einen Quellfehler zu kaschieren;
- Gesichtsflächen per Material, Emissive, Alpha, Depth-Test, Polygon Offset oder Normalen-Neuberechnung „wegzudekorieren“;
- defekte Flächen ausblenden, wenn dadurch Löcher, offene Kanten oder eine falsche Silhouette entstehen;
- Dreiecke/Connected Components anhand unbestätigter Heuristiken entfernen;
- fremde Figur-Owner wie Haare, Münder, Lider oder Brauen über einen praktischen Sammel-Mount nebenbei aktivieren;
- ein sichtbares Defizit mit zusätzlicher Overlay-Geometrie verdecken;
- Runtime-Korrekturen als Ersatz für saubere Topologie, Normalen, Anker oder Restpose im Quellasset akzeptieren.

Das Verbot gilt projektweit, nicht nur für Dory und den Orc. Ein Experiment darf lokal und reversibel zur Diagnose stattfinden, darf aber weder als Lösung committed noch publiziert werden.

## Erlaubte Laufzeitarbeit

- deklarative Rezeptparameter wie Scale, Offset, Morph-Wert, Dangle-Stiffness und freigegebene FaceRig-Tunables;
- Animation, Emote- und Viseme-Steuerung über dokumentierte Owner-Verträge;
- Knotensuche über stabile Namen und `sanitizeNodeName`;
- manifestgetriebene Auswahl bereits freigegebener Mouth-Sets;
- nichtdestruktive Sichtbarkeitsumschaltung nur für ausdrücklich separate, semantisch benannte Owner-Nodes;
- Asset- und Vertragsvalidierung, die bei Abweichung sichtbar blockiert statt zu raten.

## Neue Gates

### Asset-Gate

- Headmesh geschlossen, saubere Silhouette, keine überlappenden Gesichts-Patches.
- Normalen/Tangenten sauber; keine Z-Fighting-Flächen.
- Eye-Socket und Eye-Anchor frontal/koaxial im Restzustand.
- Originalteile sind als eigene semantische Nodes/Primitives separiert, wenn die Runtime sie schalten soll.
- Rig, Skin, Restpose und Morph Targets unverändert verifiziert.

### Owner-Gate

- Jede Montage nennt explizit, welche Owner sie aktiviert.
- `eyes-only` darf weder Mund noch Haare noch Brauen erzeugen.
- Ein optionaler Mund wird pro Figur freigegeben; fehlender Decal-Mund ist kein Fehler.
- Bestehende Mesh-Münder und Zähne bleiben unangetastet, solange kein Assetauftrag ihre Änderung verlangt.

### Browser-Gate

- Front und 3/4, direkt nach Load und erneut nach zwei Sekunden.
- Augen offen/halb/geschlossen, ein Emote, ein Viseme nur bei Figuren mit Mouth-Owner.
- Bind/Idle, ein Frame nach Kopfturn, Dangle-Restprüfung.
- Vergleich gegen Referenz im selben Review-Kontext.

## Recovery

Die saubere Recovery ist kein weiterer CSS-/three.js-Fix. Sie besteht aus einem korrigierten Blender-Asset, einem präzisen Owner-Vertrag und einer kurzen erneuten Browserabnahme. Bis dahin bleibt die Promotion gesperrt.
