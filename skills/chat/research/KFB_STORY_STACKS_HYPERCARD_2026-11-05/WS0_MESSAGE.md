# AN WS0 · KFB Living Cards / Story Stacks — Konzeptaufnahme

**Datum:** 2026-11-05  
**Von:** Georg / KFB Planning Web Chat  
**Status:** Georg hat die **konzeptionelle Übernahme zur weiteren Planung und Recherche** beauftragt. Keine Runtime-Freigabe, keine Tool-Adoption, keine neue V-Nummer.  
**Zuständig:** WS0 als bestehender *Konzept-/Authoring-/Design-Empfänger*; WS1/KFB Card, ChatterBox und World Owner bleiben technische Empfänger und SSOTs.

## Die Idee in einem Satz

Die HyperCard-Idee von **interaktiven Kartenstapeln und verlinkten Story-Erlebnissen** ist ein besonders guter Kandidat für die KFB-Karten-/Almanach-Grammatik: Eine echte KFB-Karte verweist auf einen Ort oder ein Encounter, beeinflusst Kontext/Handlungswahl, stößt **bestehende** ChatterBox/World-Events an und hinterlässt eine nachvollziehbare Erinnerung im Fraktalen Almanach.

Bitte **nicht** ein eigenes Ren'Py-Spiel, ein geklontes Macintosh-System-7-UI oder eine zweite Story-/Dialog-Runtime entwerfen. Nicht jede Karte ist ein Quest-Trigger. Die Welt muss zuerst als belebter Ort funktionieren.

## WS0: Was für die Konzeption hilfreich wäre

1. **Kanon/Bestand sichten:** vorhandene Scene/Actor/Quest/Action-Card-Definitionen, echtes Deck/Kartenregister, Fractal Almanac, existierende Golden Journey, source-backed Dystopia-Encounter (Doomsday Clock → Orc Band → Demon Lord). Die KFB Four-Island Story Recovery und die A/B-Weltbild-Gate nicht überschreiben.
2. **Ein gut lesbares Beispiel visualisieren/zeichnen:** wie man eine existierende Karte öffnet, ihre Quellen/Verbindungen sieht, sich über zwei vorhandene Ereigniskanten weiterbewegt und später zur Almanac-Erinnerung zurückkehrt. **Quellkarte, visueller Donor und Actor zuerst isoliert zeigen**, erst dann eine Szene oder UI-Zusammenstellung. Kein erfundenes Ersatz-Artwork.
3. **Autorenperspektive untersuchen:** Was lässt sich im Sinne von **Twine** als verzweigtes Story-Board editieren? Was gehört in eine **HyperCard-artige Karten-/Stapelansicht**? Was wäre lediglich Inhalt/Authoring und was (strikt getrennt) spätere Runtime? ink/inkjs nur als Kandidat, nicht bereits ausgewählt.
4. **Mini-Designentscheidung dokumentieren:** Welche 1–2 konkreten Darstellungsformen passen zur etablierten KFB Ink-/Claymation-/Comic-Sprache und den vorhandenen Card/Almanac-Komponenten, ohne generische UI-Chrome, Mac-OS-Retro-Look oder zweites Branding?
5. **Handoff für WS1 vorbereiten:** vorhandene IDs und Donor-Pfade, Interaktionsabsicht, erwartete Nutzerhandlung, nötige Datenbeziehungen und offene Fragen. **Keine** eigenen Event-Schemas, DBs, proprietären Asset-Copies, automatischen GitHub-Merges oder neuen Produkt-Sites.

## Schutzgrenzen / Abgrenzung

- KFB Golden Journey und ChatterBox Triplets sind bereits konzipiert. **Keine eigenständigen Dialogtexte in den Renderer**; `prepareResidentTurn`, PR #310 Inhalt, bestehende Blasen/Audio-Owner bleiben gültig.
- Story Cards dienen als **Belege/Erinnerungen**, nicht automatisch als auswählbare Powers; Action Cards bleiben getrennt.
- Island R4 bleibt FAIL / NO MVP, Four-Island A/B visual-only Gate bleibt bindend. Kein neues R5, kein World-Authoring über diese Nachricht.
- Die Quelle des Eliot-Gardepe-Pakets unter **CC BY-NC-SA 4.0** ist **Visual/UX-Referenz, kein zu importierendes KFB-Asset**.
- WS0 DECISIONS bleibt die V-Nummern-Autorität. Dieser Intake führt keine neue V-Entscheidung ein.
- Parallel denkbar: **DocCheck medizinische Fall-Stacks**; zunächst nur eigenständige Recherche in `DOCHECK.md`, kein KFB↔DocCheck-Runtime-Sync oder gemeinsame Produkt-UI.

## Bitte aus WS0 zurückliefern, falls später konkret beauftragt

Ein **kurzes Konzeptblatt** (eine isolierte tatsächliche Kartenquelle, grafisch lesbare Entscheidungsverbindungen, 1 sinnvoller Anwendungspfad, optional zwei gestalterische Varianten, Quellen- und Owner-Zuordnung). Keine generischen Kacheln als Designprodukt; tatsächliche KFB-Sources verwenden. Bis zu einer gesonderten Autorisierung genügt diese Nachricht als **PLANUNGSEINGANG**, keine aktive Build-Aufgabe.

**Referenzen:**
- [Research / KFB](RESEARCH.md)
- [DocCheck parallel](DOCHECK.md)
- `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md`
- `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md`
- `overworld/docs/GLOSSAR_KFB.md`
- `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/HANDOVER_WSA_CHATTERBOX_TRIPLET.md`
