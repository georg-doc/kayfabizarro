# Für WS0 · Racer: Fahrgefühl, Controls, Performance und nächste Module ·17.11.2026

Georg bittet um Weiterentwicklung mit Fokus Racer und um Priorisierung nach hohem Spielgewinn und Aufwand. Die Quellprüfung ist abgeschlossen; die folgende Reihenfolge ist ein Vorschlag, keine bereits erhaltene WS0-Zusage und keine neue Runtime-Implementierung.

**Erster kleiner Baublock: Boost-R2**, danach ein gemeinsamer Fahrgefühl-/Messparcours. [Vollständige Prioritäten mit Quellen, Aufwand und Abnahmekriterien](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/3b311f04943a4e5d28bbabb383d35a23d358ad95/docs/racer-roadmap-r2/PRIORITIES.md) · [maschinenlesbarer Backlog](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/3b311f04943a4e5d28bbabb383d35a23d358ad95/docs/racer-roadmap-r2/BACKLOG.json).

Owner `georg-doc/KFB-Stunt-Car-Race`, Branch `racer/vehicle-profiles-r1`, Planungs-HEAD`3b311f04943a4e5d28bbabb383d35a23d358ad95`, Runtime-Auslieferung`0ac9bfd102f41967906a5efb77d512175bc81a21`, PR134 offen/nichtgemergt. Aktueller Stamm beim Audit`6e84cbb48fbfe38ae6d1b6021329fd2f2505af01`; in dieser Runde nur lesend geprüft. Bestehende Site bestätigt alsv11/source92603fa, private URL unverändert. Site-Hyperjump/G-Rettung/Schweben sind vorhanden; ihr Main-Patch-Anschluss ist noch nicht gleichbedeutend mit übernommenem vollständigem Elan-Flug.

## Reihenfolge

1. **Fahrgefühl und Controls R2 — sehr hoher Nutzen, klein bis mittel.** Zuerst bezahlten Boost, freien Driftboost und Feedback konsistent machen. Hauptgame verbraucht bezahlte Ladung auch oberhalb38m/s, gibt dort aber keinen zusätzlichen Boost-Impuls. Site-Core hat diese38erAbfrage nicht und verbraucht im Boost-Block auch bei freiem Driftboost Ladung. Anschließend vorhandene Lenkrate/Gegenlenkhilfe, Mauslenkung/Kamera, Fokusverlust und lokale Rettung abstimmen. Hauptgame-R setzt bisher zum festen Start zurück; Site-G-/RoadQueries wiederverwenden, bestehende Tasten nicht stillschweigend umbelegen.
2. **Messfahrt/Nachladeruckler — hoher Nutzen, Messung klein.** Drei60s-Szenen (Straße/Drift, Gelände-Schulter-Rettung, Staub+3–5Dummies), gleicheHardware/Seed/Kamera/Qualität. Vorhandenes Budget nutzen: Basis-Laptop1080p,p95≤33.3ms; Referenz60fps. Bildzeitspitzen/Kachel-/Colliderarbeit/Renderkosten/Streamout-Ressourcen erfassen. Danach gemessene Engpässe reparieren; kein neuer FPS-PASS aus Build-/Node-Zahlen.
3. **Straßen/Untergrund/Assist im Hauptgame — hoher Nutzen, mittel bis groß.** PR134-Aufnahme und vorhandenes SharedRoads-Modul mit dem einen Terrain-/Curb-/Materialbesitzer zusammenführen. Audio-CI-Basisfehler separat beim Audio-Owner.
4. **Ein Blaster-Turm und drei Würfelziele — hoher Nutzen, mittel.** Vorhandene CombatTargets/Projektil/Treffer/VFX/SFX-Besitzer; sichere Mündung, Stand/Fahrt, Selbsttreffer/Wechsel/Abbau. Dann vorhandene laufende Dummies ergänzen.
5. **Patch-Dieselpunk Flugadapter — hoher Free-Roam-Nutzen, mittel bis groß.** Elan/racerFlight sitzt amK2B-Weg; Main-Patch meldetfly:false. Derselbe Wagen/Körper/Travel-/Kameraowner muss Abheben, Geländeabstand, Landen und Weiterfahrt verantworten.
6. **Ein optionaler Fluggegner — anfangs mittlerer Nutzen, mittel bis groß.** Quelle/Combat-Owner noch nicht belegt. ufoEvent ist ein Welt-Ereignis, kein nachgewiesener fertiger Feind. Zuerst eine lesbare Begegnung, danach Verfolgung/mehrere Gegner gemäß gemessenem Budget.

## Baubereiter Vorschlag · Boost-R2

Bestehende deklarierte Geschwindigkeitsgrenzen zunächst erhalten; bezahlte Ladung und Feedback an tatsächlich angewandte Hilfe koppeln; verdienter Driftboost verbraucht keine manuelle Ladung. Fahrzeugabhängige Grenzen bleiben möglich und deklariert. Kein neuer Physikkern/Lenkcontroller; vendorPatch hat bereits Tempolenkung und Gegenlenkhilfen.

Native Gegenproben unter/an/über der Grenze, vorwärts/rückwärts/Boden/Luft, Halten/Loslassen/leereLadung/freierDriftboost/Swap; dann echter Beschleunigungs- und Driftlauf beider Wagen. Competitive/Bestzeiten getrennt halten. Dieser Block kann als isolierter Kandidat parallel zum WS0-Vertragsabgleich erprobt werden; kein automatischer Merge.

## Bitte im WS0-Abgleich beantworten

- Welcher Zweig nimmt PR134, SharedRoads und den Assist-Anschluss auf? Gegen aktuellen Stamm vergleichen; neue Planungsdateien allein integrieren keine Runtime.
- Passt der vorgeschlagene Boost-/Rettungsvertrag für Chill&Fun und Competitive, oder gibt es einen neueren gemeinsamen Vertrag?
- Wo liegt der erwähnte Fluggegner tatsächlich: Repo/Branch/Dateipfad und Combat-Owner? Bis dahin bleibt dessen Einbaureife UNVERIFIED.

**Aufteilung:** WS0 gemeinsame Systeme und Aufnahme; Racer Fahrzeugadapter/spielbarer Test; Blender Modell, KFB-Look/LOD, Pivot und Mündungsanker. Keine neue Site/Live-Veröffentlichung und keine neue Runtime-QA behauptet. Nächster technischer Abschluss: isolierter Boost-R2-Kandidat mit nativer und realer Fahrprüfung; Quellen-/Vertragsabgleich parallel.
