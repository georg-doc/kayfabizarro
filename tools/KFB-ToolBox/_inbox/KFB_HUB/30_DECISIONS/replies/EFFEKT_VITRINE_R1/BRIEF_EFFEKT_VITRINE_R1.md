# Brief · Effekt-Vitrine R1 auf der Kampfbühne (WS0, 24.11.2026, Georg V-2153)

**ABSICHT:** Auf der vorhandenen Kampfbühne kann man jeden geeigneten Katalog-Effekt sehen und selbst ausprobieren: Figur und Waffe wählen, frei herumlaufen, zuschlagen, schießen, blocken, und der gewählte Effekt erscheint so, wie sein Spender ihn gedacht hat, an Waffe, Treffer oder Boden. Daraus entstehen KFB-eigene Vorschauen für den Asset Librarian. Später wird dieselbe Bühne als eigenständige Seite gezeigt.

**GENRE:** Cartoon-Action-Abenteuer, Claymation-Vordergrund (V-1171). Spielbare Prüfbühne, kein neues Level.

**OWNER:** ein Agent im Auftrag von WS0, Arbeitskopie `~/kfb-ws0/mount-wt`, neuer Zweig `ws0/effekt-vitrine-r1` ab Stamm `game/integration-r2` @0aeb166a. Merge macht WS0.

**ZIEL:**
1. **Bühne bleibt:** Erweiterung des Bühnen-Panels `src/world/buehne/buehnePanel.js` (Kampfbühne `buehne=r1`, Free Roam, Plätze, Ziele) um einen Bereich „Vitrine“. Keine neue Arena, kein eigenes Licht, kein eigener Boden.
2. **Figur wählen:** jede spielbare Figur aus `src/data/characters/playable.r1.json` über den vorhandenen Lader (`src/characters/registry.js`). Steuerung wie im Spiel (`src/hostKeys.js`, I = Interaktion).
3. **Waffe wählen:** jede Waffe aus `src/data/combat/waffenkammer.r1.js` bzw. den Loadouts (`src/modules/loadout.r1.js`), inklusive Montage an armlosen Figuren, soweit im Stamm vorhanden. Waffenfunktionen (Hieb, Schuss, Block, Sonderangriff) gegen die vorhandenen Ziele (Würfelmonster, Plastik-Soldat, Zielscheiben).
4. **Effekt wählen:** Liste aus dem VFX-Katalog `replies/VFX_KATALOG_R1/vfx_katalog.r2.json`, gefiltert auf Effekte, die im Stamm schon einen Einbauweg haben (Patch-Abilities, Effekseer, Feuer-Presets inkl. `kiste_brand`/`feuerwand` auf der Bühne, quarks-Spuren, Elements) und `anpassung.stufe` keine/klein. Je Effekt gilt sein `gedachter_einsatz`: der Effekt wird so ausgelöst, wie der Spender es vorsieht (Waffe, Treffer, Boden, Zone), nicht in einen fremden Platz gezwungen (V-2151). Effekte ohne Einbauweg erscheinen ausgegraut mit Grund aus `warum_nicht`.
5. **Erste Neuzugänge:** aus 00GameDevs (MIT, Katalog-Top-Liste) höchstens fünf Effekte als erste Einbauwege übernehmen, so wie gedacht: Dust Shockwave, Smoke Puff, Spell Indicator, Blade Trail, Ground Mist. Herunterladen von der Spenderseite ist erlaubt; die Nutzungsmeldung an deren Schnittstelle (POST /api/agent-usage) wird nicht gesendet.
6. **Vorschauen zurück in den Katalog:** Für jeden abspielbaren Effekt ein kurzer Clip (≤ 4 s) und ein Still über feste `belegVideo`-Presets auf der Bühne im Spiel-Look, dazu Messwerte (Bildzeit-Mehrkosten, Dauer). Felder `vorschau` und `kosten` im Katalog als neue Revision `vfx_katalog.r3.json` ergänzen (gleiches Schema, keine anderen Felder ändern).
7. **Eigenständige Fassung vorbereiten:** Der Vitrinen-Zustand muss sich mit einem Hash-Einstieg (`vitrine=r1`) direkt öffnen lassen und als `KFB_SPLIT=1 --base=./`-Build über `file://` laufen. Größe des Builds im RETURN nennen (Ziel ≤ 256 MB, mit Nachladen). Veröffentlichung macht WS0.
8. Schalter `vitrine=r1` in `src/flags.js` (owner WS0, status pruefen). Ohne Schalter unverändert.

**FERTIG:**
1. Gate: Jede wählbare Figur steht auf dem Boden und lässt sich steuern; jede wählbare Waffe löst ihre Funktionen aus; jeder Effekt der Liste spielt mindestens einmal ohne Konsolenfehler; Bildzeit der Bühne mit aktivem Effekt höchstens +3 ms gegenüber ohne (Readback-Methode).
2. Belege unter `replies/EFFEKT_VITRINE_R1/_privat/belege_r<n>/`: ein 30-s-Video einer gespielten Runde (Figurwechsel, Waffenwechsel, drei Effekte), dazu die Vorschau-Clips je Effekt.
3. Stille Blind-Kritik (tools/CRITIC_BLIND_PROMPT.md, tools/qa_matrix.r1.json), frischer Kritiker je Runde nur mit ABSICHT, GENRE, Belegen; ≤ 3 Runden, Stopp nach 2 ohne Verbesserung.
4. CI wie Stamm, Rauchtest, `KFB_SPLIT=1`-Build grün; Zweig pushen, nicht mergen. Rückgabe als neue Datei RETURN_R1 (Markdown) im Ordner dieses Briefs: Figuren/Waffen/Effekte in der Vitrine, ausgegraute Effekte mit Grund, Messwerte, Build-Größe, offene Punkte.

**GRENZEN:**
- Bestand zuerst: keine neuen Effekte selbst bauen, keine Spender-Effekte umgestalten. Keine eigenen Lichter, keine Tonkurve, kein Bloom aus Spender-Code.
- Bühne, Ring, Kameras und Panel-Funktionen von WS1 nicht umbauen, nur ergänzen.
- Gekaufte Assets nur im privaten Build; keine Veröffentlichung.
- `src/private/` nie committen; kein `npm ci`; GPU-Lock (`/tmp/kfb_gpu.lock`, Ride-R5-Agent läuft parallel); eigene Server mit `srv.stop()`; `df -h ~` vor Builds, ein Build-Ordner.
- Keine Rückfragen-Schleifen: Unklares naheliegend lösen und im RETURN vermerken.

**DETAIL:** Bühne `src/world/buehne/` (Kampfbuehne.jsx, buehnePanel.js, buehneSite.js), Kameras `test/lib/buehne.mjs`, Belege `test/lib/beleg.mjs`. Feuer auf der Bühne: `src/world/feuerorte.r1.js`, Rezepte `src/data/choreo/`. Katalog und Spender-Übersichten: `replies/VFX_KATALOG_R1/` (README.md, 00GAMEDEVS_UEBERSICHT.md, REHAN_GAME_VFX.md). Register V-2150/V-2151/V-2152 (Katalog, wie gedacht), V-1876 (Kampfbühne).
