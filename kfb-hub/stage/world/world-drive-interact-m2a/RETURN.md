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

## Prüfungen

- Browser Desktop + schmal, lokal: **34/34 PASS**
- Browser Desktop + schmal, feste öffentliche Stage: **34/34 PASS**
- Hirnwelt-H0-Knete ist sichtbarer Standard; `?look=original` und der Umschalter bleiben als reversibler Vergleich erhalten
- E → Drive, echte Radkontakte, Bewegung, E → Ground, Ground → Flight: PASS
- kompakte Bedienoberfläche ohne horizontales Überlaufen: PASS
- 0 Seiten-/Konsolenfehler
- 0 fehlgeschlagene Requests
- 0 HTTP-Fehler
- Race-Donoren lokal bytegleich zum exakten PR-#10-Checkout verifiziert

## Status

`PUBLIC_VERIFIED · PUBLIC_BROWSER_PASS_34_OF_34`

Direkter Fahrtest: <https://kayfabizarro.pages.dev/kfb-hub/stage/world/world-drive-interact-m2a/>

## Genau ein nächster Gate

Georgs freier M2A-Fahrtest: Kneteindruck, Ein-/Ausstieg, Fahrgefühl und Wechsel zum Flug. Kein Track-Proxy und kein M2B vor einer realen Track-Core-Runtime.
