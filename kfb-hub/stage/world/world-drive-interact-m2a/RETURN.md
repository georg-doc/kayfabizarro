# WORLD-DRIVE-INTERACT-M2A · Return

## Ergebnis

Der erste produktive M2-Kernloop läuft in derselben Hürth-/KlayfaBizarro-Welt:

- zu Fuß zum sichtbaren Fahrzeug;
- `E` steigt ein, mit kurzer Cartoon-Squash-Reaktion;
- FrizzleBob sitzt sichtbar im Fahrzeug;
- W/S, A/D, Q/R, B, Shift und Leertaste bedienen die bewährte Race-PR-#10-Fahrphysik;
- Terrain und Gebäude bleiben World-r2-Quellen; die Fahrphysik erhält nur daraus abgeleitete Kontaktflächen;
- `E` setzt FrizzleBob an einem freien Punkt neben dem Fahrzeug ab;
- danach sind Ground und Flight weiter direkt nutzbar.

Es wurde keine Ersatz-Rennstrecke gebaut. Track Core bleibt `WAITING_SOURCE` für M2B.

## Exakte Quellen

- World M1: `40037597485436e185f129091be908786925341d`
- Race PR #10 / Free Roam: `406cd26f44f22811fe3b3a58776839be7ffb7b2c`
- Kenney `kart-oobi.glb`: `15e36b915c9bdfd7ff000d398418269e27c6ef9f`
- Vehicle Deformer v2: `f30b719a8c9da3e9ac90d4d9628c0691d676d1e9`
- Travel Modes PR #39: `e10a977501cd186fe1330e9d3fd1a7b5811beb3a`
- GitHub-Runtime-Checkpoint: `3a9375bba2acdcc448473f24838830ba92305277`
- Publication-Checkpoint: `afc5841abcb6ce057080618ab4aba36a4831bf3a`

## Automatische Prüfungen

- Browser Desktop + schmal, lokal: **34/34 PASS**
- Browser Desktop + schmal, feste öffentliche Stage: **34/34 PASS**
- 0 Seiten-/Konsolenfehler
- 0 fehlgeschlagene Requests
- 0 HTTP-Fehler

Diese Prüfungen belegen Packaging, Ladepfade und den formalen Moduswechsel. Sie belegen ausdrücklich **nicht** Spielbarkeit, flüssige Bewegung, korrekte Bodenhaftung oder akzeptable Ladezeit.

## 2026-09-27 · Georgs freier Spieltest

Aktueller Produktstatus: **`HUMAN_TUNE · NOT_PLAYABLE`**.

Kernblocker:

- Bewegung ist zu langsam, ruckelig und derzeit nicht spielbar;
- Ladezeit und Frametiming sind nicht akzeptabel;
- Bewegungs- und Zustandsanimationen sind sichtbar falsch oder falsch getaktet;
- das Fahrzeug sitzt nicht korrekt auf dem Boden;
- außerhalb der Straße fehlt eine lückenlose befahrbare Terrain-Kollision: auf Grünflächen und anderen Wegen fällt das Fahrzeug durch die Welt.

Nachrangig, aber dokumentiert:

- bekannte Schatten-/Hellkanten-Artefakte an Boulder und Props.

Die öffentliche Stage bleibt als reproduzierbarer Fehlerbeleg erhalten. Sie ist **keine** freigegebene spielbare MVP-Version.

## Status

`PUBLIC_ROUTE_PRESENT · AUTOMATED_BROWSER_PASS · HUMAN_TUNE_NOT_PLAYABLE`

Direkter Fehlerbeleg: <https://kayfabizarro.pages.dev/kfb-hub/stage/world/world-drive-interact-m2a/>

## Genau ein nächster Gate

`WORLD-M2A-R1`: begrenzter Playability-/Performance-Pass auf exakt derselben Szene. Erst messen, dann höchstens zwei kleine Kandidaten: durchgehender Terrainkontakt, brauchbares Frametiming und Ladeverhalten, korrekter Fahrzeug-Bodenkontakt sowie offensichtliche Movement-State-Fehler. Keine neuen Features, Assets, Tracks oder HUDs. Danach ein freier Zu-Fuß-/Offroad-/Fahrtest durch Georg.
