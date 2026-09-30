# Handover WSA · Billboard Kaleidoscope H13

Stand 30.09.2026 · Auftraggeber Georg · von Claude Design an WSA.
Claude Design pusht nicht nach GitHub. Dieses Paket ist ZIP + Preview; Integration, Tests im Desktop-Kontext und Versionsverwaltung liegen bei WSA.

## Was WSA übernimmt

| # | Aufgabe | Fertig, wenn |
|---|---|---|
| W1 | **H13 an Orc Band / Resident Disco anschließen.** Takt 1 des Titels = Takt 1 der Songform; Playlist `disco-playlist-01.json` @ `a46dbdf`, Beatmessung `DISCO_BEAT_MEASURE_01.md`, Instrumentals `SUNO_DISCO_INSTRUMENTALS_01.md` | Ein Lauf in der Disco-Szene, Tempo gemessen (nicht angenommen), Kick-Versatz in ms ausgewiesen, Screenshot in Arbeitsgröße |
| W2 | **Billboards als statische Assets rendern und committen** statt Live-Rendering. Ein Renderlauf je Seed/Titel, Ausgabe PNG/WebM mit Manifest (Seed, Pins, Quellen, Rechte je Ebene) | N Assets im Repo, Manifest referenziert Quellen mit Commit-Pin, kein Live-Fetch im Betrieb |
| W3 | **3D-Tafel:** Canvas als `THREE.CanvasTexture` auf das Kenney-Billboard, `needsUpdate` im Frame-Takt | Tafel zeigt H13 bzw. statische Assets, fps auf Zielgerät gemessen |
| W4 | **img2threejs-Test** (`export_public_domain/TODO_WSA_img2threejs.md`) | Factory rendert ohne Fehler, Vergleichsblatt und NOTICE liegen bei |
| W5 | **R3-Merge prüfen**, dann R4 starten (Web-Chat-Aufträge in `export_public_domain/BRIEFING_PD_POOL_R2_R3.md`, `…R4.md`) | `manifest.jsonl` auf main mit ≥ 24 Bildern je R3-Thema, neuer Pin gemeldet |

Reihenfolge-Vorschlag: W5 (läuft im Hintergrund) → W2 → W1 → W3 → W4.

## Was WSA übernehmen muss (Übergabestand)

- **Referenz:** `KFB Billboard Kaleidoscope H13.dc.html`. Einzeldatei, DC-Format; Laufzeit `support.js`.
- **Externe Abhängigkeiten zur Laufzeit** (alle per Pin, siehe `DOKU_H5-H13.md` §Pins): raw-Manifest, jsDelivr-Module, LoC-Bilder von `tile.loc.gov`, Audio über jsDelivr.
- **Lokal im Paket:** `data/h6-card-crops.json` (Kartenausschnitte).
- **Kein Modell, keine Audiodatei, keine Schrift im ZIP.**

## Zu klären, bevor W2 startet

1. Ausgabeformat und Auflösung der statischen Billboards (Vorschlag: 2048×1024 PNG plus WebM-Loop, Seitenverhältnis 2:1 wie die Tafel).
2. Zulässige Quellen für committete Assets: nach D2 nur „No known restrictions“. LoC-Rechte je Platte sind noch nicht geprüft; ohne S1 dürfen LoC-Ebenen nicht in committete Assets.
3. Ob Kartenebenen (KFB-Karten) in committeten Assets erlaubt sind (eigenes Material, vermutlich ja; Georg bestätigt).

## Erwartete Rückgabe

Kompaktes Review-Paket: genauer PR/Head, tatsächlich gelaufene Tests, sichtbarer Beleg, offene Punkte, **ein** nächstes Gate. Bericht im Format `SOURCE | DECISION | IMPLEMENTATION | TESTED RESULT | EXPORT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN`. Nicht Gelaufenes: `NOT_TESTED`.

## Grenzen

- Keine KFB-Figuren nachbauen (FrizzleBob → `mountGraft()`, CapsuleCarl → `mountCarl()`).
- Kein neues Asset-Registry (`registry/assets/v1` ist der Besitzer).
- Veröffentlichte POCs (z. B. Free Roam Drive `fr-s04-01`) nicht überschreiben; Neues als eigener Kandidat.
- Engine v0 (`collage-engine/`) nicht anschließen.
- Ein Renderer, ein Mixer, ein Bewegungs-Besitzer je Szene. Mehrere Billboards brauchen eine Engine mit mehreren Ausgaben, nicht einen Kontext je Tafel.

## Offene Fragen an Georg

1. Sind die Reddit-Referenzen noch relevant?
2. Format der statischen Billboards (siehe oben).
