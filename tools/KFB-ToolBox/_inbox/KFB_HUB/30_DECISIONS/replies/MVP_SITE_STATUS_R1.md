# MVP als Site · was noch fehlt · R1 · 2026-10-21 · WS0
**Ziel (Georg):** eine spielbare Version als Website. Sie umfasst:
- die M1-Welt auf dem neuen Gelände: Fahren, Laufen, Joyride-Einstieg;
- NPC-Leben, Dark Fluffer und Heilen;
- Kampf mit den K10-Waffen;
- das volle Ton- und Musikbett;
- die Dioramen Disco und Ork-Band.

| # | Baustein | Stand | Fehlt | Besitzer |
|---|---|---|---|---|
| 1 | **Ein Spiel-Branch** | Gelände (`terrain/probe-world`), NPC (`ws-npc/*`) und Ton (`ws-audio/*`) liegen getrennt. Konflikte in `package.json`, `m1-terrain.js` und `M1World.jsx`. | Zusammenführen in einen Branch, der läuft. **Größter Blocker:** Bis dahin gibt es nur Teile. | WS1-Lead |
| 2 | **Figuren im Spiel** | Besetzungsliste `cast.r1.json`. Die Dateien liegen im privaten Branch, WS1 kommt per `gh` daran. | Dioramen-Besetzung: 8 Tänzer, FrizzleBob am Pult, 4 Orks mit Leader. Fluffer auf `heightM 0.8`. | Lead + WS-NPC |
| 3 | **Leistung** | Gelände gebacken, Amphitheater als LOD. Das Spiel braucht bei dpr 2 auf 2880×1800 aber 112 ms je Bild. | dpr-Deckel bzw. Qualitätsstufe, Ziel 60 fps auf Georgs Rechner. | Lead |
| 4 | **Ton + Musik** | Alle Sätze liegen im privaten Branch als `_lufs`, die Instrumentals unter `music/`. Schritte und Gruppen-Ton sind verdrahtet (Platzhalter). | Neue Sätze einhängen (`npc_steps_r1`, `heavy_steps_r1`, `combat_av_fix_r1–r3`). Ein Musikbett je Ort. | WS-Audio |
| 5 | **Kampf** | Arena-Module mit Vertragstests (PR #24/#25/#27). Combat-AV-Prototypen mit Georgs PASS auf `ws1/combat-av-r1`. | Einbau ins Spiel nach dem Zusammenführen. | Lead (WSA liefert Module) |
| 6 | **Site + Build** | Arena und Stunt-Race laufen schon so: privates Repo → Cloudflare-Build → Site. | Cloudflare-Pages-Projekt fürs Spiel. Der Build holt `assets/private` mit einem Lese-Token, baut und veröffentlicht. Große Dateien (> 25 MB) nach R2. | WSA (hat die Arena-Pipeline gebaut) |
| 7 | **Einstieg** | — | Startseite mit Lade-Balken, Steuerungshilfe, Ton- und Qualitäts-Regler. | Lead |
| 8 | **Abnahme** | Blinde Kritiker je Slice gibt es (CRITIC_3D_R1). | Ein Design- und Gameplay-Kritiker auf dem zusammengeführten Build, erste 10 Minuten als fremder Spieler. | Prüfer, nach #1 |

**Private Assets über GitHub, geht das?**
- Ja. Der Browser kann private GitHub-Dateien nicht direkt laden.
- Der Cloudflare-Build holt sie aber beim Bauen mit einem Token und packt sie in die Site. So läuft es heute schon bei `kfb-combat-arena.pages.dev`.
- Eine Lücke gibt es: Liest eine Seite zur Laufzeit von `raw.githubusercontent.com`, bricht das bei privaten Repos. Diese Stellen stellt WSA ohnehin um (V-599).

**Offen für Georg:** Soll die Site öffentlich sein oder nur mit Login (Cloudflare Access für dich und Tester)?
