# Reproduktion und Abnahme

1. Private Site `/blaster-lab/` öffnen, Bereitschaft abwarten. „Klick aufs Motiv“ ist Standard. Zunächst Ton aus lassen.
2. Aus einem Standort links und rechts auf noch vorhandene Kartenflächen klicken. Kamera dreht höchstens ca. 0,28 s, dann native Freigabe. Prüfdaten: Auswahlpunkt, centerErrorAtFire, lastImpact, releases/accepted/duplicates. Achtung: native Windup-Zeit kommt nach der Ausrichtung hinzu.
3. Vor der Ausrichtung Reset/Moduswechsel/Bewegung auslösen: kein späterer UI-Schuss. Maus ziehen zum Umsehen; klassisches Zielen aktivieren und Mitte/Leertaste prüfen. Reduced Motion gesondert kontrollieren.
4. „Klick-Zielen aufnehmen“: vier unterschiedliche Auswahlpunkte TPS → Reset → vier FPS. Eigenen Standort nicht bewegen. Video sichert Canvas; CSS-Zielring ist darin nicht enthalten. Referenzbeleg: live-click-aim-fps-tps.webm.
5. „FPS/TPS aufnehmen“: sechs native Freigaben je Sicht auf denselben Zielbereich. Wiederholte Schüsse durch ein offenes Loch können ohne neuen Kontakt bleiben. Referenzbeleg: live-fps-tps-final.webm. Separat mit `?fracture=baseline` vergleichen; Referenz nicht als Produktstandard nutzen.
6. Nach dem Lauf Prüfdaten öffnen: Queue leer, error null, keine Duplikate, Geometrie und Collider gemeinsam aktualisiert. Kartenmotive/Bruchstücke/Nahwandblocker/Reset bei Boden-, Wand- und Deckenbruch prüfen. Automatisierte sechsseitige Tests ergänzen die begrenzte Live-Blaster-Folge.
7. Beim Game-Einbau OFFENE_SPIELANSCHLUESSE.md abarbeiten; Hörprüfung mit aktivem nativen Ton gesondert aufnehmen. Kein stilles Video als Audio-PASS werten.

Alle Zahlen sind bestehende Messbelege vom 17.11., keine neue Messung während der Paketierung. `evidence/tests-288.txt` und `build.txt` gehören zum geprüften Site-Quellstand. Das Paket verändert weder Site noch Game.
