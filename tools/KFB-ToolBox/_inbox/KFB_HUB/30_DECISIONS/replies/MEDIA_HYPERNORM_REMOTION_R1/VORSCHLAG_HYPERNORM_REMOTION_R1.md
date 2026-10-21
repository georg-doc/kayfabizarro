# Vorschlag WS-Media → WS0 · Hypernormalisation-Lesefolge: eine Quelle für Spiel und Remotion (R1)

Stand 21.10.2026. Von: WS-Media (media-studio). An: WS0. Nur Vorschlag; gebaut wird erst nach WS0-Zustimmung und mit den Bedingungen unten.

## Georgs Freigaben vom 21.10.2026
1. **Private Probe mit drei gemeinfreien Zitaten** aus Batch 01. Georg hat „3 bis 5 gemeinfreie Zitate aus Batch 01“ freigegeben; die Auswahl hat WS-Media in diesem Rahmen getroffen. Quelle: `QUOTE_POOL_BATCH_01.json` auf `planning/billboard-quote-hypernorm-curator-2026-10-04` @fc47e98e4 (Pool-Daten identisch zu @05d61058e, den `sequence.js` lädt).
   - `q-b01-utopia-thoreau-tools` (Thoreau, Walden, 1854; Deck `forget_utopia`)
   - `q-b01-utopia-morris-hope-work` (Morris, Useful Work versus Useless Toil, 1884; Deck `forget_utopia`)
   - `q-b01-1001-wilde-mask-truth` (Wilde, The Critic as Artist; Deck `1001_kayfabe_nights`, für den Pilot per `quoteId` gepinnt)

   Alle drei: `rights.status = PUBLIC_DOMAIN_CONFIRMED`, `DOUBLE_CHECKED`, mit Quelle und Fundstelle. **Bitte an WS0** (V-228, WS0 pflegt Georgs Urteile in den Daten): `quote.status` von `RESEARCHED` auf `APPROVED_PRIVATE` setzen. `rights` bleibt unverändert.
2. **Format 1,79:1** für alle Displays (V-259). Eine spätere Anpassung gehört nicht zu diesem Vorschlag.
3. **Dieser Vorschlag an WS0.**

## Ausgangslage (belegt)
- Produkt „Billboard Quote Hypernormalisation“ (Owner laut `START_HERE.md`: KFB ToolBox / Billboard Media Residency; PR #354 offen): deterministische Auswahl `hash(packId, cardNumber?, cardSeed, biomeId, biomeSeed, quoteCycle)`, Lesefolge in Phrasen, Autor + Werk + Quelle, genau eine FrizzleQuestion, keine Auswahl durch ein Sprachmodell zur Laufzeit. Implementierung nicht begonnen. `WORK_ONE_SHOT_BRIEF.md`: Start erst nach dem MVP1-Human-Review-Gate. Nächster Schritt des Owners laut `RETURN.md`: Quote Research Reserve 14.
- Prototyp der Lesefolge: `KFB_Billboard_Family_v1/sequence.js` in Clay Stage + Curtain R2 (main @7d6a8496e), Phasen context → quote → resolve → attribution → turn → question → brainfood, Provider-Vertrag `paint(ctx2d, W, H, now, bb)`. Georg 09.10. zu Clay Stage R2 gesamt: „passt so mit TUNE für später“. Die Lesefolge live auf der Tafel ist noch nicht getestet (BAUSTELLEN B8).
- `BILLBOARD_STANDARD_R2` §4: Lesefolge erst mit freigegebenen Zitaten, H13 als Bild-Besitzer, genau ein `BillboardScheduler`.
- Spiel (kfb-planet `terrain/439` @a701da4): `billboard-plain` zeigt nur Karten; `surfaceContent.js` sieht weitere Arten vor („video per CSS3D, später loop/quote“). Keine VideoTexture im Code. Video auf der Tafel ist mit B2a (CSS3D, Georg ACCEPTED) bewiesen.
- Register: V-173, V-224 (Vollbild-Knopf zurückgestellt), V-228 (Laufzeit baut nur WS1, Daten verwaltet WS0), V-256, V-337, V-389 (eine Ereignis-Zeitleiste, Audio Site einziger Audio-Besitzer), V-527 (WSV mit Remotion).
- Remotion-Rezepte: `planning/kfb-claude-remotion-motion-comic-rollout-r1-2026-10-15` @5a9cf92d3 (PR #402) legt zustandslose Rezepte `sample(recipe, t)` an, darunter `surface.billboard.sequence`; Richtung dort: erst interaktiv, MP4 später.
- Gescheitert: Collage-Engine v0 (30.09., FAIL). Sie wurde neben H4 statt auf H4 gebaut, und Schrift, Effekt und Palette wurden unabhängig gewürfelt.
- Offline-Renderer (pdoom-Donor) gilt im `RETURN.md` @fc47e98e4 als „CONDITIONAL TECHNICAL DONOR / RESEARCH ONLY; NOT ADOPTED“; Übernahme erst, wenn H13-, Billboard- und Audio-Besitzer sichtbar isoliert sind.

## Vorschlag
**Ein Modul, zwei Ausgaben.**
- `kfb-quote-sequence` ist nur die Text- und Lesefolge-Schicht über der H13/H14-Basis (`st.base`). H13 bleibt Bild-Besitzer, der Takt läuft über den einen `BillboardScheduler`, kein Vollbild-Knopf (V-224). Das Modul ist zustandslos: Zitat-Datensatz, Palette und Zeit `t` rein, Bild auf Canvas2D über `paint(ctx2d, W, H, now, bb)` raus; Anschluss an das Rezept `surface.billboard.sequence`.
- **Spiel:** Modul und Test baut WS1 (V-228) als Inhaltsart `quote` in `surfaceContent.js`, nur hinter einem privaten Schalter, bis Zitate `APPROVED_PUBLIC` sind.
- **Remotion:** die Ausgabe übernimmt WSV (V-527) oder WS-Media, nach WS0-Entscheid. Sie rendert eine feste Modul-Revision Bild für Bild: ein Loop 1,79:1 und Clips. Ergebnis ist inhalts- und zeitgleich zur Tafel, bildgleich bei gleichem Seed, Renderer und Fonts (G8).
- 9:16: die 1,79-Tafel im Bild (Szene oder Tafel oben), ohne neues Layout. Ein eigenes 9:16-Layout wäre ein Design-Auftrag über WS0.
- Später nutzt das Deck-Musikvideo (V-337) dieselbe Zeitleiste (V-389).

**Regeln gegen den Generator-Look**
- Nichts würfeln: Grammatik, Phasen und Schrift kommen aus `sequence.js` (OFL-Fonts Bodoni Moda, Big Shoulders Display, Archivo, IBM Plex Mono, lokal eingebunden und vor dem Render geladen; Einträge ins Credits-Register). Niemand gestaltet sie neu.
- Farben nur aus der Palette der Insel bzw. Bühne (ENV_ROLES / Bühnenpalette).
- Text nur aus dem Pool, englisch und wörtlich: Zitat, Autor, Werk, Fundstelle; FrizzleQuestion aus dem Datensatz; bei Übersetzungen der Übersetzer in der Zuschreibung. Zitat-ID pro Clip (G6); Brain-Food-Links in Clipbeschreibung und Credits, weil sie im Video nicht klickbar sind.
- Determinismus: gleicher Seed, gleiches Bild (Test: zweimal rendern, identisch).
- Höchstens 3 Helligkeitsblitze pro Sekunde (G7 aus `BRIEF_MUSIC_VIDEO_R1.md`).
- Ton: P0 stumm oder mit Soundbed aus der Audio Site; kein eigener Mixer.

## Pilot P0
- Ort: Billboard im Knet-Amphitheater, Karte 1 „The Glossy Horizon“ (Deck `forget_utopia`), kfb-planet `terrain/439` @a701da4.
- Inhalt: die drei Zitate oben.
- Lieferung: Modul + Test (WS1), Loop 1,79:1 und 9:16-Clip (Remotion-Seite). Abnahme durch Georg; nichts wird veröffentlicht.

## Bedingungen
- WS0 bestätigt, dass das MVP1-Human-Review-Gate des Produkts erfüllt ist oder für P0 nicht gilt.
- Der Owner des Hypernorm-Produkts stimmt zu; der Recherche-Lauf (Reserve 14) wird nicht gestört.

## Fragen an WS0
1. Owner: Laufzeit-Modul bei WS1 und Remotion-Ausgabe bei WSV oder WS-Media, wer genau?
2. Ferne Tafeln: vorgerenderter Loop (WebM) oder immer live Canvas? Falls Loop: welches MB-Budget pro Zone (V-370 nennt ≤ 15 MB je Zone; ein Video-Budget fehlt)?
3. Gilt der Planungs-Branch zu PR #354 als Quelle für Pool und Schema, oder zieht WS0 sie vorher nach main?
