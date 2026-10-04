# BACKLOG · gewollt, nicht terminiert

Stand 18.09.2026. Was hier steht, ist begründet, aber nicht eingeplant. Ein Punkt wandert erst
nach `SPRINTS.md`, wenn seine Abhängigkeit aufgelöst ist.

## Braucht ein Asset, das fehlt
- **KayKit ActionFigure / Rig_Medium.** Briefing-Fixture 3 (Skateboard + Rider) ist ohne sie nicht
  baubar. Nächstliegend im Satz: `Astronaut_*` (43 Joints, 18 Clips), `Mech_*` (13 Joints,
  17 Clips) — beides keine ActionFigure. Als offener AssetRef gemeldet, nicht ersetzt.
- **KFB-Karte im Querformat** (Georg, 18.09.): ein Pet- oder Driver-Graft steht in Surf-Pose auf
  Karte, Hoverboard oder Papierflieger — wie im Travel Globe. Braucht die ActionFigure.
- **Drehende Räder am Skateboard / Rollerskate.** Skateboard ist ein verschweißtes Einzelnetz;
  es bräuchte benannte Rollenknoten im Asset.

## Braucht eine Entscheidung
- **Türen öffnen.** Gemessen: kein Fahrzeug im Satz hat einen Türknoten (einzige Ausnahme
  `garbage-truck` mit `arm`, `body`, `trash`). Zwei Vorschläge ohne neue Geometrie:
  Klappkarosserie (schwenkt um die untere Seitenkante) oder Ducken zur Ausstiegsseite.
  Welcher Read gewollt ist, entscheidet Georg.
- **Landung im Flug** — eigenes Ereignis oder `landing()` der Bodenlinie? Solange Fahrwerk und
  Aufstandspunkt fehlen, spricht alles für ein eigenes.
- **Maßstäbe.** Faktor 100 zwischen den Quellen am Boden, Faktor 80 in der Luft. Dem Deformer
  gleichgültig, einer gemeinsamen Strecke nicht. Gehört der Strecke, nicht der Werkbank.

## Zweite Ordnung
- Ton über die zwei synthetisierten Griffe hinaus (Motor, Rollgeräusch) — Skill §15 deckelt.
- Kamera-Shake als eigener Griff, EINER pro Ereignis.
- Anfasser und Bone-Posing aus dem Resident Atlas übernehmen, falls Handkorrekturen an
  Fahrzeugen nötig werden. Bisher nicht: Fahrzeuge werden gemessen, nicht gestellt.
