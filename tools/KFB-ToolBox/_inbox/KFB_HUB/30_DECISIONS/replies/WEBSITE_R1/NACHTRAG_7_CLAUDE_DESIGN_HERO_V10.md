Für Claude Design (Website-Chat) · Nachtrag 7: Hero v10 · 15.11. (WS0, V-1808)

v9 ist ein klarer Sprung. Echte Sprünge, Hiebe aus Lauf und Scheitel und kein Clip mehr rückwärts, genau so.

**Deine Entscheidungsfrage – ja:** Lege die vier waagerechten Schnitte auf die Kante der 1,74-Karte, 5,6 cm nach außen in die Stege. Das eine Kartenformat ist Georgs Entscheidung (26.7.2026, `CARD_AR = 1.74` in `src/card-edge/kfb-card-format.js`). Die Karte ist ab dem Schnitt das Spielformat. Es bleibt bei acht Schnitten, vier Karten und 21 Schnipseln (V-1766). Die Rückseite mit `fitCell` einpassen, nicht mit `cover`.

**`kfb-choreo`:** Dein Vorschlag gilt. Die Choreo-Datei trägt Clipfolge, Ereignisse und Gesicht, deine Beinschicht bleibt darunter. Die Choreo-Datei bekommt dazu eine Zeitspur für Speed-Ramp und Impact-Ereignisse. Bildgenaue Sprünge in der Zeitlupe löst du in deiner Schicht über diese Zeitspur.

**Timing und Auswahl der Hiebe:** Ein Choreografie-Experte stellt gerade die Schnittliste für die acht Schnitte zusammen, aus 18 neuen Kandidaten von WSB. Du bekommst sie als `fb_katana_hero_v9.choreo.json` mit Begründung, sobald sie geprüft ist. Georgs Regeln dafür, bitte schon jetzt anwenden:
1. **Extrem-Posen:** Gezeigt und gehalten werden maximales Ausholen, maximaler Impact und Ausschwingen, keine Bilder mitten im Schwung.
2. **Speed-Ramp:** Die Zeitlupe liegt auf dem Ausholen, dort fährt die Kamera um FB. Kurz vor dem Impact geht es zurück auf volles Action-Tempo oder etwas schneller, im Kontakt folgt der Hit-Stop (48 ms), danach das Ausschwingen in normalem Tempo. Nie Zeitlupe genau im Impact.
3. **Impact-Paket:**
   - Ein kurzer, gedämpfter Kamerastoß in Schlagrichtung, 3–6 Bilder, nicht zufällig wackelnd.
   - Die getroffene Seite oder Karte federt in Schnittrichtung.
   - Ein Licht- oder Funken-Effekt an der Schnittkante kommt nur aus einem vorhandenen Treffer-Rezept oder Flipbook des Spiels, keine selbst gebaute Form (V-1508). Welches, nennt die Schnittliste.
   - Effekt nur am Kontaktpunkt und mit der Kraftrichtung. Einen Stoß an der Schneidematte gibt es nur, wenn die Klinge sie wirklich trifft; bei Hieben an der hängenden Seite nicht.

**Für v10:** Kartenkante und `fitCell`, das Mimik-Paket (`konzentration` vor dem Hieb, `triumph` danach) und die drei Regeln oben. Die Schnittliste des Choreografen kommt dazu, sobald sie da ist.
Zu deinen Lücken:
- Waagerechter Clip auf 35 % Tempo und fehlende Fluglage: Beides nimmt der Choreograf mit auf.
- Dunkle Flecken an der Leine bei 10,9 s: Bitte prüfen, ob das Schatten oder Tiefenkonflikt ist.
- Kamera über der Leine: Nur, wenn FB dort mehr als Kopf und Ohren zeigt.
