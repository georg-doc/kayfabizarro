# PLAN · WS-Design · HyperNorm-Fassade als lesbare, nicht repetitive Video-Ebenen · R1 · 04.11. · an WS0 (V-1500)

Georg (q527, FAIL): „das ist hochgradig repetitiv und hat so NICHTS mit der Hypernormalisation-Engine zu tun!? → das sollen lesbare und nicht repetitive Video-Ebenen sein!“

## Warum es heute so aussieht
- Die eine H15-Engine malt **eine** Fläche (1024 × 512), und das ist immer nur der gerade laufende Shot.
- Diese eine Fläche liegt auf jedem 7-m-Feld jedes Hauses. Darum zeigt das ganze Viertel zur selben Zeit dasselbe Bild.
- Erwischt die Engine gerade eine Muster-Basis (Wellen, Kaleidoskop, LED-Raster), wird daraus ein Tapetenmuster ums Haus.

## Lösung: Shot-Gedächtnis plus Ebenen-Wahl, mit einer einzigen Engine
1. **Nur Ebenen, keine Muster-Basen.**
   - Ein Wrapper um `drawShot` der Engine (gleiche Stelle wie die Ton-Sperre) bildet vor dem Malen ab:
     - Basen LED, KALEIDO, MIRROR, PATTERN, FIELD und HYPNO → PLATE (Collage aus Karten-, WS0- und Library-of-Congress-Pool) bzw. FILM (Video-Pool), abwechselnd je Shot;
     - unlesbare Schriftarten TEXTURE, SCATTER, CHARFLIP, GIANT_CROP und VERTICAL → lesbare Arten MIXED, ECHO, KNOCKOUT, WIDTH_MORPH und ARC;
     - REDACT bleibt, denn das ist Zensur und passt zum Metanarrativ.
   - Die Engine bleibt sonst unverändert: eigene Schnitte, Paletten, Kamera und Bewegung. Alles bleibt vollfarbig (V-1082).
2. **Shot-Gedächtnis statt einer Fläche.**
   - Zum Ende jedes Shots, also wenn die Engine den Shot wechselt, wird das letzte Bild in einen Ring aus K Ebenen kopiert. Technik: ein `DataArrayTexture` mit 1024 × 512 je Ebene und `copyTextureToTexture` in Ebene i.
   - Dazu kommt die laufende Fläche als Ebene 0.
   - Vorschlag K = 12, als Datenwert. Das sind rund 25 MB Grafikspeicher, einmalig; die Kopie kostet etwa 1 ms alle 2–4 s.
3. **Jedes Feld eine eigene Ebene.**
   - Jedes 7-m-Feld (je Haus, Reihe und Umlaufstelle) bekommt eine eigene Ebene aus dem Ring: die Folge läuft ums Haus, Nachbarfelder sind nie gleich, und jedes Haus beginnt an einer anderen Stelle.
   - Je Haus läuft mindestens ein Feld live (Ebene 0), auf der Seite zur Straße.
   - Zusätzlich je Feld ein eigener ruhiger Ausschnitt: 5 % langsames Schwenken bzw. Zoomen und ein Zeitversatz.
4. **Bewegung und Wechsel.**
   - Bei jedem Shot-Wechsel rückt die Ring-Zuordnung weiter. Je Shot wechselt **ein** Feld je Haus seinen Inhalt, mit dem einen Sprenkel-Übergang (V-403), nie alle gleichzeitig.
   - So bewegt sich die Fassade ständig, ohne zu flackern.
5. **Lesbar.**
   - Der Maßstab bleibt fest: 7 m Bildbreite. H15-Schrift ist damit etwa 1–1,5 m hoch.
   - Aufkleber nur an Feldrändern (schon so).
   - Die Felder überlappen weich um 0,4 m.

## Kosten
- Malen: Es bleibt bei einer Engine, also kein Zuwachs auf dem Hauptfaden.
- Grafikspeicher: etwa 25 MB.
- Shader: ein `sampler2DArray`-Zugriff je Bildpunkt statt eines 2D-Zugriffs.
- Ehrliche Alternative: N Engines (je Feld eine). Das kostet je Engine etwa 3–6 ms Hauptfaden und kommt nicht infrage.

## Beleg im Slot
1. Standbild aus dem Spiel: drei Häuser nebeneinander, jede Wand anders, Schrift lesbar.
2. Daneben die H15-Engine selbst aus „KFB Billboard Kaleidoscope H15 Mindscape“.
3. Ein Kritiker mit Georgs Satz als Maßstab.

Risse (Staub-Hof jetzt als 40-%-Staubschicht über dem vollfarbigen Bild), Schramme und Aufkleber laufen im selben Slot mit.

## Offen für WS0
- K = 12 Ring-Ebenen: so übernehmen?
- REDACT als Schriftart behalten (Zensur)?
