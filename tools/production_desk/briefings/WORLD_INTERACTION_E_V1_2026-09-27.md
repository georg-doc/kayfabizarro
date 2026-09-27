# WORLD-INTERACTION-E-V1 · ein Kontextknopf für KFB

## Entscheidung

`E` ist auf Tastatur die einheitliche KFB-Kontextaktion. Intern heißt die Aktion semantisch `INTERACT`, damit später Touch und Controller denselben Vertrag nutzen können.

`E` übernimmt nicht Springen, Doppeldruck-Flug, Lenken oder Bremsen.

## Was die Aktion auslöst

- fokussierter Resident → vorhandene ChatterBox öffnen;
- fokussiertes freies Fahrzeug → cartooniger Einstieg, dann Übergabe an Drive;
- während Drive → sicherer cartooniger Ausstieg;
- fokussierter Prop, Portal oder In-Game-UI-Gegenstand → dessen bereits registrierte Aktion;
- kein gültiges Ziel → keine Aktion.

## Fokus statt versteckter Priorität

Der Host liefert gültige Kandidaten und Boden-/Reichweitenwahrheit. Der Router wählt nicht pauschal „Auto vor Resident“ oder „Prop vor Auto“, sondern den sichtbaren Fokus aus Blickrichtung, Entfernung und vorhandener Legalität. Die kompakte Einladung nennt das Ergebnis, beispielsweise `E · Einsteigen`, `E · Mit Bingo sprechen` oder `E · Portal öffnen`.

Die ausgeführte Aktion muss exakt der sichtbaren Einladung entsprechen. Beim Zielwechsel gilt nur der aktuell bestätigte Fokus.

## Fahrzeugübergang ohne Türen

Die Quellprüfung des Vehicle Lab zeigt keine belastbaren Tür-Nodes. Deshalb:

1. Figur bewegt sich in einen kurzen Einstiegspunkt.
2. Figur hüpft; das Fahrzeug duckt/squasht sichtbar.
3. Figurenpräsentation wird sauber an Drive übergeben, ohne eine zweite Figur zu erzeugen.
4. Beim Ausstieg duckt sich das Fahrzeug erneut und „spuckt“ die Figur seitlich auf einen vom World-Owner geprüften freien Bodenpunkt.

Zielzeit pro Übergang: ungefähr 0,5–0,8 Sekunden. Währenddessen sind erneute Interaktion und Bewegung gesperrt. Wird der Ablauf abgebrochen, werden Sichtbarkeit, Kamera und letzter gültiger Modus vollständig restauriert.

## Ownership

- World/Ground: legaler Boden, sichere Ausstiegsposition, Kollision;
- Resident/Prop/Portal: eigene Legalität und Aktion;
- Interaction Router: Fokus, Einladung, genau ein Dispatch;
- Animation/Vehicle Presentation: sichtbarer Hop, Duck, Squash und Pop;
- Race/Free Roam: Fahrzeugbewegung und Fahrphysik;
- Travel Router: aktiver Modus und Übergabe;
- ChatterBox: Gespräch, Inhalt und Memory.

Keiner dieser Bausteine übernimmt die Zuständigkeit eines anderen.

## MVP-Beweis

Zu Fuß starten → korrekt beschriftetes Fahrzeug fokussieren → `E` → fahren → Track betreten/verlassen → `E` → sicher aussteigen → Resident fokussieren → `E` → ChatterBox öffnet. Danach denselben Ein-/Ausstieg dreimal ohne Doppelobjekt, Kameraverlust oder Bodenfehler wiederholen.
