# MVP-Plan R2 · WS0 · 01.11.2026 (ersetzt MVP_SITE_STATUS_R1)

**Ziel:** Georg spielt eine Site: laufen, fahren, Pfeil, Kartenzone, Karten sammeln, Deck-Moment, Begegnung, Kampf, Tag und Nacht, mit Ton. Lizenz- und Repo-Fragen sind bis dahin außen vor.

## Block 1 · Zusammenführen (WS1, jetzt der Engpass)
Stamm `game/integration-r2`. Reihenfolge nach Bereitschaft, alles hinter Schaltern, Stufe B je Runde.
| Zweig | Stand | Schalter | Urteil |
|---|---|---|---|
| `design/kartengebaeude-r1` | @9e3de40b ohne `review/`, `src/private/` prüfen | | Georg |
| `game/cape-dangle-r1` | @2eec5975 | | PASS |
| `assets/sky-planets-r1` | fünf Blüten-Planeten @5311659 | | PASS |
| `world/verteiler-r1` | neue Runde kommt | `place=r3` | Dichte PASS, Kügelchen und Wald laufen |
| `game/waffen-fx-r1` | @659c793c Ton, Explosion @ca62e6ba | `fx=r2` | Ton PASS, Bild offen |
| `world/himmel-r1` | Übergabe kommt | `sky=r1`, `skymove`, Kuppel | Georg PASS |
| `module/card-pack-poc-r1` | Übergabe kommt | `cardart=pack` | Georg Ja |
| `zones=1` | wird Standard bei grünen Tests | | Georg PASS |

Danach Testfahrt-Adresse an Georg.

## Block 2 · Schleife schließen (WS1, Fachsitzungen)
- Tag und Wetter Teil 1 fertig: Kamera 12°, Blockmuster bei tiefer Sonne, Lichtkreis.
- Spielchronik Machbarkeitsnachweis (Q-046): Rekorder läuft ohne Zutun, Lean Memory wird daraus gegengerechnet.
- HyperNorm-Boden je Deck (`deckGround`, WS-Design) nach Kartengebäude.
- Deck-Moment beim Abschluss einer Zone, Kartenwind, Klingende Welt.
- Pistole und Blaster in Schichten (Flug-Sitzung), Hänger der ersten Explosion.
- Ladezeit vor dem Site-Paket.

## Block 3 · Site
Site-Paket (V-1123), dazu Werkzeug „Testen und Messen“ (WSA). Abnahme: Georg spielt, Kritiker erste 10 Minuten.

## Nach dem MVP, eingeplant, nicht vergessen
- **Himmel:** Augen als instanzierte 3D-Augen (WS-Himmel, erst Konzeptseite mit Vergleichsbildern), `worldPulse`, Story-Stimmung.
- **Wetter Teil 2 bis 4:** mit Nebelschwaden Option A, Windstoß über Prop, Geysir Option A (WS-Himmel Konzept, Plätze über den einen Verteiler).
- **Nacht:** Nachtebene, Lagerfeuer, Regel für lokale und temporäre Lichter, Leuchtstab, Leuchtkugel.
- **Spiel:** Kontakt-Wackeln, Postkarten-Modus, Karten-Tratsch.
- **Karten:** Stadt-Architektur, alle Decks im Paket (Rollout, parkt), Recherche-Dossier.

**Grundsätze neu:** Jede neue Fähigkeit hängt an einem Prop (V-1203). VFX in Schichten wie Ton (V-1194). Belege ohne Fahrt, je Bild ein Satz (V-1188). „Karten“ heißt nur Spielkarten.
