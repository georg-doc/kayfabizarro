# Figurenlicht R1 · Konzept zur Freigabe (Georg 23.10.)

**Georgs Vorgaben (23.10.):** Licht je Figur für die nächsten vier, immer an (nicht nur im Dialog), sichtbar begründet durch einen Lichtkreis.
**Anlass:** Figuren sind schwer lesbar. Nachts sind sie kaum zu erkennen, tags ist die Schattenseite zu dunkel, und FrizzleBob wirkt schwebend, weil unter den Füßen kaum Schatten liegt (gemessen: Füße exakt auf dem Boden).
**Quellen:** V-386 (Georg 17.10., „jede Figur ein eigenes Licht“, damals als je Dialog-Gruppe festgehalten), LIGHT_MODEL_R2 Regel 11, V-097 (Lichtkreis an der Spielfigur), V-392 (kein Rand- bzw. Gegenlicht), V-683 (Schattenseite). Recherche des Leads vom 23.10. zum Ist-Stand in kfb-stage-light v1.1.

## Ist-Stand
- Es gibt **einen** schattenlosen SpotLight für die ganze Dialog-Gruppe, gerichtet von der Kameraseite vorn-oben.
- Im Spiel trifft er nur den Spieler, nur nachts und nur, wenn `tod=night` in der Adresse steht. Mit dem Tageszeit-Regler der Fahrt bleibt er aus.
- Bewohner, Gegner, Band und Racer-Fahrer bekommen nie Licht.
- Stärke je Stimmung (figI): Tag 0,3 · Gold 0,7 · Nacht 1,7.

## Konzept
1. **Wer:** der Spieler immer, dazu die drei nächsten Figuren im Umkreis von 14 m × K (Bewohner, Gegner, Band, Partner). Eine Figur gilt als „näher“ erst ab 1,5 m Vorsprung, damit das Licht nicht hin und her springt.
2. **Licht:** je Figur ein weicher, warmer PointLight ohne Schatten.
   - Er sitzt vorn-oben auf der Kameraseite (etwa 1,2 × Figurhöhe über dem Boden, 0,8 m vor der Figur), damit kein heller Rand bzw. Saum entsteht (V-392).
   - Abfall physikalisch (decay 2), Reichweite begrenzt (Lichtkreis-Radius etwa 1,6 × Figurhöhe).
   - Farbe und Stärke kommen aus der Stimmung des Rigs (figColor, figI), stufenlos über die echte Tageszeit (TOD-Regler, nicht die Adresse): Tag schwach, Gold mittel, Nacht stark.
3. **Lichtkreis = sichtbare Begründung und Erdung:** Dasselbe Licht hellt den Boden um die Füße kreisförmig auf, als natürlicher Lichtfleck, kein aufgemalter Kreis und keine dunkle Kontaktscheibe (Kanon verbietet Kontaktfleck bzw. Scheibe).
   - Nachts verankert der Kreis die Figur am Boden; damit löst sich auch das Schweben.
   - Tags ist der Kreis kaum sichtbar.
4. **Technik:**
   - Vier Lichter sind immer vorhanden. Ungenutzte stehen auf Stärke 0, damit three.js die Materialien nicht neu übersetzt, wenn die Zahl der Lichter wechselt.
   - Wechselt die Zuordnung, blendet das alte Licht in 0,4 s aus und das neue ein (kein Ploppen).
   - Das bisherige Gruppen-Spot entfällt im Spiel; die Dialogbühne behält ihren.
5. **Tags zusätzlich:** Die Schattenseiten-Regel V-683 (`shade=1`, Untergrenze 0,34–0,50) wird Standard, weil Georg sie besser fand. Das Figurenlicht ersetzt sie nicht, es wirkt vor allem nachts.

## Prüfkriterien (Selbstprüfung vor dem Zeigen, gemessen)
- **F1 Lesbarkeit Nacht:** mittlere Helligkeit von Gesicht und Körper der vier Figuren ≥ 2 × die Umgebung im Umkreis von 3 m (vorher/nachher im selben Moment).
- **F2 Lichtkreis:** nachts ist der Boden unter den Füßen ≥ 1,5 × heller als 3 m daneben; tags ≤ 1,15 ×.
- **F3 Kein Saum:** Die Kontur der Figur ist nicht heller als die Fläche (Randstreifen ≤ Mitte), in allen drei Stimmungen.
- **F4 Kein Ploppen:** beim Wechsel der Zuordnung keine Helligkeitssprünge > 10 % von Bild zu Bild; keine Shader-Neukompilierung (Programmanzahl bleibt gleich).
- **F5 Tageszeit:** Der TOD-Regler und die Biom-Fahrt steuern das Licht, nicht nur die Adresse.
- **F6 Kosten:** ≤ 1,0 ms GPU in der Spielkamera bei 1600×900 und kein fps-Verlust > 3 in der Bewohner-Szene. Gemessen im eigenen Slot, an und aus im Wechsel.
- **F7 Erdung:** In der Spielkamera steht FrizzleBob nachts sichtbar auf dem Boden; Tagesfall siehe offener Punkt.
- **Nie:** heller Rand bzw. Saum, Licht von hinten, Kontaktscheibe bzw. Blob, Neon-Leuchten, mehr als vier Figurenlichter.

## Bilder für Georg (wenige, im selben Moment)
- Nacht, Spielkamera: FrizzleBob mit Bewohnern und Band, heute gegen neu, dazu 1:1-Ausschnitt der Gesichter.
- Gold, Spielkamera: heute gegen neu.
- Tag, Spielkamera: FrizzleBob, heute gegen neu (Schattenseite + schwaches Licht).

## Offen
- **Erdung am Tag:** Der Lichtkreis ist tags kaum sichtbar. Ob FrizzleBob tags trotzdem schwebend wirkt, zeigt erst das Tagesbild. Wenn ja, folgt eine eigene Frage an Georg (ohne dunkle Kontaktscheibe).
- **Kanon:** V-385 „keine privaten Lichter für Figuren“ widerspricht Georgs Entscheidung vom 23.10. WS0 bitte im Kanon nachziehen (Figurenlicht als Teil des einen Rigs, je Figur, max. vier, mit Lichtkreis).
