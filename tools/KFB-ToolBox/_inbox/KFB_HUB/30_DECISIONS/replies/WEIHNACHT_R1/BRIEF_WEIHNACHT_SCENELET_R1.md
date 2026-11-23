# Brief · Weihnachts-Scenelet R1 (WS0, 23.11.2026, Georg)

**ABSICHT:** Ein festliches Weihnachts-Scenelet als Begegnung in der KFB-Welt: Der Spieler stößt auf einen leuchtenden Baum, um den eine kleine Bahn mit Rauchfahne eine Acht fährt, und einen Schneemann, der zur Musik wippt. Warm, verspielt, sofort lesbar. Dasselbe Modul läuft später auch in Aqua.

**GENRE:** Cartoon-Action-Abenteuer, Claymation-Vordergrund (V-1171). Scenelet = kurze, selbstlaufende Szene ohne Spielerpflicht.

**OWNER:** ein Agent im Auftrag von WS0, Arbeitskopie `~/kfb-ws0/stangen-wt`, Zweig `ws0/weihnacht-r1` (ab Stamm @68f8fb42). Merge macht WS0.

**ZIEL (Georgs vier Punkte):**
1. **Bestand:** KayKit Holiday Bits 1.0 (FREE, liegt als `~/Downloads/KayKit_Holiday_Bits_1.0_FREE.zip`, glTF unter `Assets/gltf`). Nur benötigte Teile übernehmen (Baum, Geschenke, Gleise inkl. `tracks_crossing`, Lok + Tender/Wagen, `snowman_A` oder `_B`, ggf. Laterne, Sessel, Lebkuchenhaus), entpackt in einen neuen Ordner, Vorlage für Anordnung: Georgs Bild (Promo „Holiday Bits“, Baum links mit Gleisoval, Acht über die Kreuzung, Sessel, Schneemann, Laterne).
2. **Baum festlich beleuchtet:** `christmas_tree_decorated` mit leuchtenden Lichtern (emissive Lichterkette, sanftes Funkeln/Wechsel), Licht nur über das eine Rig plus emissive Teile, keine eigene Lampe außer einem kleinen warmen Punkt, wenn das Rig ihn als Lichtquelle-Option anbietet.
3. **Bahn fährt die „8“:** Gleise aus den Kit-Teilen als Acht über `tracks_crossing`, Lok + 2–3 Wagen folgen der Strecke (Kurve aus den Gleisstücken, Wagen mit Abstand entlang der Bahn, Räder/Neigung plausibel), endlos. **Rauchfahne** aus der Lok über den vorhandenen Rauch-Pfad im Stamm (Rauchfahne wie Jetpack/Cabrio, dosiert als zusammenhängende Wolke, V-2083) – kein neuer Rauch-Code.
4. **Schneemann tanzt/wippt zur Musik** analog zur Legacy-Ork der Ork-Band (`src/npc/bandLife` und deren Takt/Uhr): Takt-Wippen mit Stauchen/Strecken (volumenerhaltend), Arme (Äste) und Hut mit Nachschwingen, auf die Musik der Szene synchron.
5. **Einbindung:** neuer Eintrag im Szenen-Katalog `src/data/worlds/kfb-szenen.r1.json` (z. B. `weihnacht_baum`, Status pruefen) mit eigenem Lader im Muster der vorhandenen Lader (`src/world/szenen/README.md`), dazu als Sprungziel erreichbar; Schalter `weihnacht=r1` in `src/flags.js` (owner WS0, status pruefen). Ohne Schalter unverändert.
6. **Für Aqua vorbereitet:** Modul ohne harte Abhängigkeit von M1World (Optionen: Uhr/Takt, Rauch-Funktion, Licht-Host), eine kurze README mit der Schnittstelle, damit der Aqua-Chat es übernehmen kann. Größe der übernommenen Assets im RETURN nennen (Aqua-Artefakt ist knapp an 256 MB).

**FERTIG:**
1. Gate: Baum, Gleise, Wagen sitzen auf dem Boden (nichts schwebt/versinkt), Wagen bleiben auf der Strecke (Abweichung < 3 cm), Kreuzung ohne Kollision der Wagen, Schneemann-Wippen auf dem Takt (Phase gemessen).
2. Belege nur über feste `belegVideo`-Presets (totale, dreiviertel) im Spiel-Look, `KFB_SPLIT=1 --base=./`, Medien nur unter `replies/WEIHNACHT_R1/_privat/belege_r<n>/`. Ein 15-s-Video (Bahn eine ganze Acht, Schneemann im Takt, Baum leuchtet) + 2 Stills (Tag, Abend).
3. Stille Blind-Kritik (tools/CRITIC_BLIND_PROMPT.md, tools/qa_matrix.r1.json), frischer Kritiker je Runde nur mit ABSICHT, GENRE, Belegen; höchstens 5 Runden, Stopp nach 2 ohne Verbesserung, Paarvergleich gegen den besten Stand. PASS: keine Achse < 7, Mittel ≥ 8.
4. CI wie Stamm (229/231), Rauchtest grün, `npx vite build` grün; Zweig pushen, nicht mergen.
5. Rückgabe als neue Datei RETURN_R1 (Markdown) im Ordner dieses Briefs: Teile + Größe, Schalter, Gate-Werte, Kritik-Verlauf, Aqua-Schnittstelle, offene Punkte.

**GRENZEN:**
- Bestand zuerst, nichts neu modellieren; kein neuer Rauch-, Licht- oder Effekt-Code; Ork-Band-Takt wiederverwenden, nicht nachbauen.
- Keine Texte/Labels im Bild (Kit-Logos aus dem Promobild nicht übernehmen). Keine gemalten Glanzpunkte.
- `src/private/` nie committen; kein `npm ci`; GPU-Lock; Test-Server mit `srv.stop()`, Tabs schließen; `df -h ~` vor Builds, ein Build-Ordner.
- Kein Animatic, keine Referenzsuche als Zwischenschritt, keine Rückfragen-Schleifen: Unklares naheliegend lösen und im RETURN vermerken.

**DETAIL:** Ork-Band: `src/npc/bandLife` (Einbindung in `src/m1/M1World.jsx` über `BAND_OPTS`, Z. ~333–356, `createBandLife`). Szenen-Modul: `src/world/szenen/` + README. Katalog `src/data/worlds/kfb-szenen.r1.json`. Sprungziele: `src/hud/sprungziele.js`. Bewegungs-Prinzipien: Cartoon-Motion (Squash volumenerhaltend, Nachschwingen der Anhänge). SOP: `KFB_SOP_R1.md`, Äste `KFB_SOP_AESTE_R1.md`.
