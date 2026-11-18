**Aktualisierung ·18.11.2026:** PR142 ist jetzt mit Stamm84ae5f0 zusammengeführt und konfliktfrei, frische CI173/173 grün am Übergabe-Headac781084. WS0 kann den M4-Abgleich starten. [Aktuelle Rückgabe und Messauftrag](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/RACER_PR142_INTEGRATION_CI_M4_READY_WS0_2026-11-18.md). Der folgende Bericht bleibt der historische R05-Messstand.

# WSA Racer → WS0 · R05 Langfahrt und bestehender Rekorder ·18.11.2026

## Geprüfter Kandidat

Repository `georg-doc/KFB-Stunt-Car-Race`, Zweig `racer/roads-water-controls-r04`, [Draft PR142](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/142).
**Übergabe-Head 45fd420a1147358228cfb33da9ffa5642f21aab5**, tatsächlicher gemessener Runtime-Head **3853bd177e970ba9a990c86ca9c3ad9fb5ec877d**, Basis R04 b28f9c7d9280f982347bce7dd970bf4cca2d4abe. Keine Site-/Main-Veröffentlichung.

[Owner-Return](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/45fd420a1147358228cfb33da9ffa5642f21aab5/docs/performance-r05/RETURN.md) · [Messaufteilung und Einschränkungen](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/45fd420a1147358228cfb33da9ffa5642f21aab5/docs/performance-r05/SUMMARY.md) · [Rekorder/Host-Vertrag](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/45fd420a1147358228cfb33da9ffa5642f21aab5/docs/performance-r05/RECORDER.md) · [vier Rohfahrten](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/45fd420a1147358228cfb33da9ffa5642f21aab5/docs/performance-r05/evidence) · [Living Roadmap](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/45fd420a1147358228cfb33da9ffa5642f21aab5/docs/racer-roadmap-r2/ROADMAP.md).

## Belege

Vier tatsächliche Browser-Langfahrten: je Wagen Basis/Kandidat, 150 Spielsekunden /ca.2,67km, danach Owner-Rückruf und30Spielsekunden Nachlauf. Gleicher Controller/Seed/Look/Qualität/Viewport; Kaltstart separat, kein Tonvergleich. Vier Räder nach Rückkehr, kein erfasster Durchfall/Konsolenfehler, pending0. Lokaler M1-Max-Browser, keine M4-/sealed-/Statistikfreigabe.

| Wagen | Fahr-Spieltakt Basis → Kandidat | Bildzeit p95 Basis → Kandidat |
|---|---|---|
| Rennwagen |0,9913 →0,9934|63,1 →58,3ms|
| Dieselpunk |0,9898 →0,9989|70,7 →46,1ms|

Nachholphysik kann Takt nahe1 bei schlechter Bildrate ergeben. Einzelspitzen bleiben, Rennwagen-Maximum382→532,9ms. Kein „ruckelfrei“-/60FPS-PASS. JS-Heap-Spitzen Rennwagen1583,4→1667,0MB, Dieselpunk1569,7→1515,3MB: keine belegte Gesamtheap-Ersparnis/Leckfreiheit. Warme Caches nach Rückkehr; Objektzahlen sind keine GPU-Bytes.

## Reparaturen, keine neuen Besitzer

- `roadStream.js`: wiederverwendete Tile-Kolliderdaten/Indexfelder;1000Abfragen1000→1Feld,9,216MB kumulierte Index-Allokation→9,216KB gehalten in der kontrollierten Probe.
- Nur verbrauchte Tile-Geometrie halten:12Kacheln6,377514→3,467064MB CPU-Puffer,104→24Geometrien.169Attributfelder über4Routen-/Kreuzungskacheln plus Kontaktindices exakt gleich. Einmalige Entsorgung, eigene Zähler danach0. Bestehende Core0.16.10/Joyride-/Rapier-/Terrainbesitzer.
- `endlessTerrain.js`: vorhandene Bounding-Box wiederverwenden.
- **Euer vorhandener `DriveRecorder.jsx` wurde gefunden und weiterverwendet** (`kfb.testfahrt/1`, bestehender Viewer/API/Alt+Shift+R). Kein weiterer Rekorder. Passiver M1-Renderanschluss ersetzt die falsche Gleichsetzung von Physikcallbacks mit Bildern; Longtask-/Resource-Felder jetzt gefüllt, Spieltakt/optionaler Heap/Streamingzustände, feste Ringgrenzen. Lokale Autosicherung≤200000Bytes, kein Netzwerk.21Sicherungen je Wagen ohne Speicherfehler. Normalspiel unverändert bezüglich Aufzeichnung.
- Automatisch bei `debug` und mindestens `strassennetz=r1`, `racercontrols=r04` oder `racerperf=r05`; R05beide Wagen ausdrücklich ohne rec=1 geprüft. Legacy rec=1/chronik=1, explizit rec=0 aus. Getrennte Chronik bleibt eigener Besitzer.

Native Rekorder7/7, Ressourcen3/3, Gelände7/7, gemeinsame Straßen10/10, statischer Vertrag und Mehrdatei-Build13,75s grün. Original-Gegenproben scheitern an genau den zwei Ressourcenproblemen. Vorhandener CI-Runner entdeckt beide neuen Unit-Dateien automatisch. Keine Ausnahme/Skip erweitert. Einzeldatei-Packaging unverändert historisch offen.

## Wichtiger Integrationsrest

**Neue CI nicht grün: kein Actions-Lauf am R05-Runtime-/Übergabe-Head.** PR142 meldet `mergeable=false/dirty`. Der Stamm ist während dieser Arbeit inzwischen bei **84ae5f0fee6f08529dd7b0347ca0e07b5dde6bb1**, u.a. Claude-Umgebung. Nicht stillschweigend in unsere Messungen aufgenommen. Ältere grüne CI44207706333 gehört nur zum Harness98f98572 und zählt nicht als R05. Git-Transport ohne Anmeldung; Browser nicht für Actions angemeldet, Connector ohne Workflow-Dispatch. Keine Tokens/Fullclone-Fallbacks.

**Nächstes Empfängergate:** WS0 gleicht den geprüften Kandidaten mit seinem aktuellen Stamm ab → frische CI → WSB gleicher M4-Vergleich (Stamm/Kandidat-aus/Kandidat-an, beide Wagen; R04Ziel +≈0,3s Start/Takt1,0). Danach unabhängige Integrationsentscheidung. Die R05Messungen bleiben3853bd zugeordnet; nach Produktionsänderungen neu qualifizieren. Verbleibende Gelände-/Bildspitzen und Cache-/Heap-Beobachtung im Messpaket erhalten.

Keine weitere Info von Georg zum Rekorder nötig. R06Badewanne/Rampen/Turm/Flug bleiben nachgelagerte Roadmap-Punkte. Temporärer Testserver/Browser beendet, eigener regenerierbarer1,3GiB-Build nach Logsicherung entfernt; bestehende Arbeitskopie/private Quellen/Abhängigkeiten bleiben erhalten.
