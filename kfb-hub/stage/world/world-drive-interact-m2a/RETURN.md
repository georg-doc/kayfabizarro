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
- GitHub-Runtime-Checkpoint: `c59cd460f57b0129157722d4ab3a0eeab22978aa`

## Prüfungen

- Browser Desktop + schmal: **34/34 PASS**
- Hirnwelt-H0-Knete ist sichtbarer Standard; `?look=original` und der Umschalter bleiben als reversibler Vergleich erhalten
- E → Drive, echte Radkontakte, Bewegung, E → Ground, Ground → Flight: PASS
- kompakte Bedienoberfläche ohne horizontales Überlaufen: PASS
- 0 Seiten-/Konsolenfehler
- 0 fehlgeschlagene Requests
- 0 HTTP-Fehler
- Race-Donoren lokal bytegleich zum exakten PR-#10-Checkout verifiziert

## Status

`LOCAL_BROWSER_PASS · SOURCE_CANDIDATE · PUBLIC_NOT_PUBLISHED`

## Genau ein nächster Gate

Den exakten Kandidaten auf die feste Stage-Route veröffentlichen, dort denselben Browserlauf wiederholen und dann Georgs freien Fahrtest öffnen. Kein Track-Proxy und kein M2B vor einer realen Track-Core-Runtime.
