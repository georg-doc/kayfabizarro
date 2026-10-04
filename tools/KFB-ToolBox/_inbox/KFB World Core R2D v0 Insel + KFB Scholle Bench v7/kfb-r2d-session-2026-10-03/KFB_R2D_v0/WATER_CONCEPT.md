# Wasser- und Flusskonzept · World Core R2D · Entwurf 2026-10-03

Status: **DECISION offen (Georg)**. Kein Code. Das Wasser auf Insel #3 ist ab heute Platzhalter, im Viewer als OPEN markiert.

## Warum der heutige Stand nicht fließt
- Die Wasserfläche liegt mit konstant +0,42 m über dem Gelände. Steigt das Gelände, steigt das Wasser mit. Eine Mulde sammelt Wasser, sie leitet es nicht weiter.
- Das Bett ist flach, mit Banden. Ein Fluss braucht ein U-Profil, das im Gelände-Mesh selbst ausgeschnitten ist.
- Die Zunge über der Kante ist eine dünne Fläche ohne Volumen. Deshalb liest man sie als Stofffahne, an der Tropfen abperlen.
- Ohne Strömung in der Oberfläche fehlt jedes Signal für Richtung und Tempo. Die Perlen und Scheiben, die das ersetzen sollten, sind entfernt.

## Regeln
1. **Gefälle zuerst.** Quelle oder Teich am Hochpunkt, eine Fließlinie, deren Höhe nur abnimmt, Mündung oder Kante am Tiefpunkt. Das Gelände wird an der Fließlinie geformt, nicht das Wasser ans Gelände gelegt. Messbar: Höhe entlang der Linie streng monoton fallend, Mindestgefälle je Meter im UI.
2. **Bett mit U-Profil.** Querschnitt als Parameterkurve (Sohle, Flanke, Uferwulst), ins Gelände-Mesh geschnitten. Die Breite folgt der Wassermenge, das Ufer läuft weich in die Übergänge (`kfbBlend`, Sand) aus. Messbar: Wasserspiegel unter der Uferkante, Freibord im UI.
3. **Oberfläche mit Strömung.** Fluid-Shader aus Card Lab v2. UV-Koordinaten entlang der Fließlinie (u = Bogenlänge, v = quer). Tempo aus dem Gefälle, schneller an Engstellen, ruhig im Teich. Keine Perlen, keine Scheiben.
4. **Wasserfall mit Volumen.** Ein Vorhang mit Dicke, der aus dem Bett über eine geformte Kante läuft, sich beim Fallen verjüngt und unten in Tropfen ausläuft. Kantenform, Vorhang und Shader gehören zusammen. Unten: Gischt oder Auflösung, kein hartes Ende.
5. **Ein Besitzer.** Ein Wasser-Modul baut Teich, Bach und Fall aus einer Fließlinie und gibt Bett-Schnitt, Masken und Meshes zurück. Die Insel fragt es nur an (Regel 5, ein Besitzer je Sache).

## Reihenfolge des Slices (wenn das Material da ist)
1. Fließlinie und Gefälle auf einer Beispielinsel, nur als Linie und Höhenprofil, Seitenansicht (Regel 7).
2. Bett-Schnitt im Gelände, Querschnitt-Screenshot.
3. Shader auf der Bachfläche, isoliert geprüft.
4. Wasserfall, isoliert, Seitenansicht.
5. Einbau auf der Insel, gleiche Kamera wie heute zum Vergleich.

## Was Georg sammelt (Vorschlag)
- Fluid-Shader Card Lab v2 mit Pin, Einstiegsdatei, Uniforms (über WSA, siehe `BRIEF_WSA_FLUID_SHADER.md`).
- Referenzbilder: Cartoon- oder Knetflüsse mit U-Bett, Wasserfälle mit Volumen, Teichufer.
- Falls vorhanden: Wasser-Assets im Registry-Shard (Wasserfall, Ufersteine, Gischt), mit Pin.
- Vorgabe zu Tempo und Stimmung: ruhiger Bach oder lebhafter Fluss.

## Bis dahin
Wasser bleibt als Platzhalter stehen, nichts wird weiter daran angepasst. Nächster Bau-Slice: die anderen Biome.
