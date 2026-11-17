# WSA Racer an WS0 · gemeinsamer Hauptgame-Straßenanschluss R1
17.11.2026 · Ergebnis als opt-in Kandidat, kein Main-Merge/Release.

## Öffnen und prüfen
[Draft PR139](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/139), Zweig racer/shared-roads-main-r1, verifizierter HEAD c7732e626faf10a3abe3b7605a5fe6cfd69f8978.
[Read first: owning Return](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/c7732e626faf10a3abe3b7605a5fe6cfd69f8978/docs/shared-roads-main-r1/RETURN.md) · [HOST_CONTRACT](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/c7732e626faf10a3abe3b7605a5fe6cfd69f8978/docs/shared-roads-main-r1/HOST_CONTRACT.md) · [SourceLock](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/c7732e626faf10a3abe3b7605a5fe6cfd69f8978/docs/shared-roads-main-r1/SOURCE_LOCK.json).

Basis9bfcdc27; zuletzt Main97701784 gelesen. Vier spätere Figuren-/Dokument-Commits nicht still eingemischt. Licht-/Boost-PR134 bleibt getrennt. WSA hat keine Main-/Release-Freigabe vorgenommen.

## Tatsächlicher Anschluss
Mit strassennetz=r1 nutzt endlessTerrain das vorhandene pure Seed-Netz und die unveränderte RKIT0.16.10-Kopie. Ein Core liefert Linien/Kreuzungen, Cut/Fill und Joyride-Fahrbahn. Derselbe bestehende EndlessDrive-Kolliderstrom trägt die echten Road-Dreiecke; TerrainStart verlangt installierte aktuelle eigene Road-Handles/Revisionen. Keine zweite Welt, kein Welt-Schritt oder neuer Bordsteinbesitzer.

Numerische surfaceAt-Höhe bleibt erhalten. Separater Materialcode an PatchCar: asphalt→tarmac, gravel→gravel, sonst bisheriger Main-Standard. Reifen/SFX lesen wheel.surface. strassenUm am Terrain für Verteiler und Claude-Felder. Ganze konfligierende Features werden deterministisch ausgespart; feste Orte/Krater/Altflüsse bleiben geschützt. Neue Karten/Props/Bewuchs kommen danach; vergrößerte WFC-Viertel samt Zufahrt werden nochmals freigeprüft. Kanonisches Sprenkel-Verwerfen am Straßenrand, keine zusätzliche Bordsteinkonstruktion. kfb-curb bleibt Owner.

## Belege
- Unabhängig native10/10PASS:96Flag-off-Geometriearrays bytegleich, Relief-Abbau mit Owner-Identität,32Platzierungen einschließlich echtem WFC-Viertel/Zufahrt,55echte Bodenstrahlen, Supportrevisionen, beide Patch-Profile über Schultern und drei Kacheln, Blattwechsel/Abbau.
- Größter geprüfter Randübergang0.02503m, Bodenstrahlabweichung≤0.00001455m.
- Tatsächliches Main im Browser: Rennwagen/Dieselpunk je480Schritte PASS,0Verstöße/Appfehler,1Wagenkörper; Rennwagen3/Diesel2Kacheln, bei160/180 je4Räder auf tarmac. Abschließendes Browser-Fehlerlog leer. Kein neuer Kaltstart-/Mensch-Look-/Audio-PASS.
- Bestehende TerrainStart11/11 und Profile11/11; finaler Split-Build5037Module PASS.
- GitHub-CI source4f06f904:160/161, Gesamtstatus ROT. Straßenprüfung besteht; einziger Fehler bestehender audioMixer:noAudioInRepo. Keine Audioänderung/Guard-Ausnahme. Guard quarantiniert ausschließlich diese Audio-Naht beim bestehenden Audio-Owner. [CI-Beleg](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/c7732e626faf10a3abe3b7605a5fe6cfd69f8978/docs/shared-roads-main-r1/CI.md).

## WIP-Grenzen und nächster Gate
Großer synchroner Weltstart/weiter Teleport bleibt zu langsam. Diagnostisch vor108Feature-Aufbauten/78.15s, nach konservativer Kachelprüfung und Cache-Wiederverwendung28Aufbauten/48.59s unter unkontrollierter paralleler CPU-Last. Keine Prozent-/FPS-Zusage, kein Releasebudget. Nächste produktive Arbeit: diesen Aufbau im bestehenden Terrain-Lader in begrenzte Arbeitsschritte verteilen; dieselben Kontakt-/Blattwechselprüfungen erhalten. Vor Default-Aktivierung gegen aktuellen Main aufnehmen.

Ausgelassene Features können Stummel/unterbrochene Verbindungen hinterlassen: kein überall zusammenhängendes endloses Netz. Hydro-Footprints sind zahlenmäßig vollständig überlappend, aber echter Wasser-Worker-/Flussübergangs-Fahrbeleg fehlt. Breitere Profile als12m erneut prüfen. Keine neuen Rampen/Loops/Türme/Fluggegner in dieser Runde.

## Werkstatt
Private [Racer/Werkstatt Version16](https://kfb-racer-open-world.frizzlebob.chatgpt.site/project.html), Quelle e62158a6c2df640ffa13f8c45a3a93d83c0512d8, Deployment appgdep_6afc39aaa15081918e827b95b483a409 succeeded. Exakter Host liefert Revision2026-11-17.12, Markdown und unverändertes Racer-Spielbundle per SHA256 geprüft. Owner-only unverändert. Das ist Dokumentationspflege, kein eingebettetes Main-Release und keine zusätzliche Remote-Fahrabnahme. Keine Hub-Router-/Cloudflare-Arbeit nötig; bestehende Produktadresse bleibt gleich.
