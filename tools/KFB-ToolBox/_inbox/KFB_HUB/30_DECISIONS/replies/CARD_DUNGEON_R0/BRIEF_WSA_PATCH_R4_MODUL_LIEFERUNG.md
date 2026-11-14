# Für WSA Patch (Karten-Räume) · R4: Card Dungeon, Patch-Wall und Wandwechsel als einbaufertige Module · 14.11. (Georg, V-1745)

**Anlass:** Georg will die Integration zügig (14.11.: „zügig weitere integration abarbeiten … use what works“). Dein Zweig `wsa/patch-transfer-r1` steht bei R6 (@5651e032) und weicht vom Stamm in 859 Dateien ab, darunter viele bestehende Spielmodule; deine Live-Stände (Card Dungeon Version 11, Patch-Wall Version 15, Wandwechsel `wallwalk=r1`) liegen nicht als einbaufertige Lieferung vor. So kann WS0 sie nicht ohne Umbau einhängen.

**Ziel:** dieselben Funktionen als Module, die WS0 ohne Umbau einhängt (V-1706): Card Dungeon R0 (fünf Räume, Begegnungen, Truhe, schwebende Karte, Portale, Fortschritt), Patch-Wall (zerstörbare Kartenwand mit Reset, Schärfemodus) und Wandwechsel mit sicherem Rückweg.

**Regeln:**
- Alle Inhalts- und Kanonregeln aus R3 (`replies/CARD_DUNGEON_R0/BRIEF_WSA_PATCH_R3_CARD_DUNGEON_R0.md`, Tier 0, Abschnitte 1–4 und Grenzen) gelten unverändert; R4 ändert nur die Lieferform und den Stamm.
- Grundlage ist der aktuelle Stamm `georg-doc/KFB-Stunt-Car-Race`, `game/integration-r2` @a1412301ff89218ff1c25cc78b8da54c8bc8684a, Module unverändert importiert (V-1690).
- Neue Dateien nur unter `src/modules/cardDungeon/`, `src/modules/patchWall/` und `src/modules/wallWalk/`, je Modul nach Host-Vertrag R1 `create(options) → { object3d, update, dispose }` wie `src/modules/randomMaze/index.js`, plus `README.md` mit allen Optionen und Schaltern.
- Bestehende Spieldateien nicht ändern; nötige Änderungen als Vorschlag mit Diff und Begründung im README (WS0 entscheidet und baut sie ein).
- Quellen je Figur/Asset: FrizzleBob = Spiel-Lader im Stamm (v5b + graftCanonEar, Schwanz an, Release-Schalter ohne Hash, V-1731); Würfelmonster = `src/data/npc/fluffer.kinds.k15.json` über `src/npc/npcFigure.js`/`flufferSet.js`; Papp-Slops = `src/npc/mobs2d.js` mit den Katalog-Slopbildern; Karten = das eine Kartenmodul mit `cardEdge`; Truhe = `src/world/truheOeffnen.js`/`truhenBeute.js`; gebackene Web-Builds (appearance.export.web): Platzhalter, Build folgt.
- Schatten aus dem Stamm-Bestand nach V-1729 (fitShadow, applyFigureShadow, contactBlob …), unverändert importiert, nicht aus dem R3b-Zweig kopiert; Treffer- und Heil-Logik der Würfelmonster über den dünnen Adapter auf `src/npc/flufferSim.js`, keine eigene Monster-KI.
- Ein Umschalter je Modul (Vorschlag: `dungeon=r0`, `patchwall=r1`, `wallwalk=r1`), ohne Schalter ändert sich im Spiel nichts. `patchwall=r1` bleibt aus bis zum GPU-Fix (V-1706).
- Tasten nur über den einen Router `hostKeys.js` (V-1474), keine eigene Belegung; der Wandwechsel bleibt nicht auf E, ein Belegungsvorschlag mit Begründung kommt ins README, WS0 entscheidet.

**Rückgabe an WS0 als Kommentar in PR #49:** neuer Zweig von a1412301 (Vorschlag `wsa/module-r4`) mit nur diesen Ordnern, Zweig-SHA, Liste der Einhänge-Punkte (welche Host-Datei ruft was auf), Testergebnis, ein Bild je Modul aus dem Spiel-Stamm (nicht der eigenen Site).
