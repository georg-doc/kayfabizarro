# Übergabe P0 · kfb-quote-sequence R1 (V-606) · WS-Media → WS1, zur Kenntnis WS0

Stand 21.10.2026. Privat, nichts veröffentlicht. Der Branch-Commit steht in der Nachricht an WS0 im Register.

## Was geliefert ist
- **Modul** `kfb-quote-sequence.js`: zustandslos, ohne Uhr, Zufall, Netz und DOM. Grammatik, Phasen, Schrift und Malen 1:1 aus Clay Stage R2 (`sequence.js` @7d6a8496e); die R2-Quellen liegen gepinnt unter `test/fixtures/`.
- **Vertragstests** `test/contract.test.mjs` (11, alle grün): Malen Aufruf für Aufruf gleich R2; Phrasen, Zeitleiste, `pinTime`, `contextCard` und Auswahl gleich R2; nur Freigegebenes läuft; Determinismus und nahtloser Loop; nur die vier Schriften; G7 (höchstens 3 Helligkeitssprünge pro Sekunde, mit Karte als Basis); Lesbarkeit der Palette (Creme auf Frage-Hintergrund ≥ 3:1, auf Dunkel ≥ 4,5:1) für alle Inseln.
- **Pilot** `p0.pilot.json` + `data/pool.p0.verbatim.json`: drei Zitate, wörtlich am Pin @fc47e98e4.
- **Credits** `data/credits.p0.json`: vier OFL-Schriften im Schema `kfb.creator-credits/1`, zur Übernahme ins Register.
- **Remotion-Renders** (Loop 1,79:1 und 9:16), privat bei Georg. Liegen nicht im öffentlichen Repo.

## Einbau WS1 (V-228)
1. Inhaltsart `quote` in `src/modules/surfaceContent.js`, hinter einem privaten Schalter (z. B. `#…,quote`), Canvas2D in der Flächengröße 1,79:1 (V-259).
2. Rezept: `{ quotes: withApprovals(pool.quotes, approvals), pal: facePal(stopsFromEnvRoles(ENV_ROLES[id])), ctx, lod }`. `id` kommt aus `stagePaletteFor(card)` (für Glossy Horizon: `otown`), `ctx[quoteId] = { ctxLine: ctxLineOf(deck, packId, card), base }`.
3. Malen: `paint(ctx2d, W, H, nowMs, recipe)`. Die Uhr kommt vom einen Scheduler, nah gedrosselt (z. B. 15 Bilder/s). Fern zeigt die Tafel ein eingefrorenes Bild bei `pinTime(tl, 'quote')` mit `lod: 'mid'`; beim Näherkommen läuft sie wieder live. Kein Video-Loop.
4. `base`: im Pilot die Karte der Tafel. Die Glossy-Horizon-Tafel zeigt nur Thoreau und Morris (Deck `forget_utopia`, `p0.pilot.json` → `boards`). Wilde ist freigegeben, gehört aber zu 1001 Kayfabe Nights und braucht eine eigene Tafel mit einer Karte dieses Decks (`contextCard` per Card-Seed wie in R2).
5. Fonts vor dem ersten Malen laden (`FONT_LOADS`); woff2 und Lizenztexte liegen im Modul unter `fonts/`.
6. Credits aus `data/credits.p0.json` ins Register `src/data/credits/kfb-credits.r1.json` übernehmen.

## Offene Punkte für Georg / WS0
- **Pool-Status:** Georgs Freigabe steht als Überlagerung in `p0.pilot.json` (`quote.status = APPROVED_PRIVATE`, `rights` unverändert). Den Planungs-Branch des Hypernorm-Produkts habe ich nicht geändert, weil der Auftrag von WS-Media keine Commits auf fremden Branches erlaubt. Bitte trägt WS0 oder der Owner es dort ein; das Modul liest dann den Pool direkt.
- **Basis der Tafel:** R2 malt über H13/H14-Frames. Im Spiel ist H13 nicht verbunden, deshalb liegt im Pilot die Karte darunter. Georg entscheidet: Karte (dann neu aus dem Deck-PDF mit mindestens 2400 px exportieren; die jetzige Datei hat 1800 px und ist komprimiert) oder H14-Frames wie in R2.
- **Palette:** Die Zuordnung `[earth[2], accent[2], accent[0]]` ist ein Vorschlag. Getestet ist sie für alle sechs Inseln. Für die Insel `bucht` hat das Etikett „FRIZZLEBOB ASKS YOU“ (dunkel auf Glow) nur etwa 2,7:1; das ist R2-Logik und bleibt unverändert, bis Georg entscheidet.
- **Öffentlich:** erst nach Georgs Abnahme, `APPROVED_PUBLIC` im Pool und dem MVP1-Gate; dann mit Abspann-Credits.
