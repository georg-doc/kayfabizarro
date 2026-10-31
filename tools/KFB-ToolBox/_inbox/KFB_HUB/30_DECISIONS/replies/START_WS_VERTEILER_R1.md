# Start WS-Verteiler · Eine Verteilungslogik für alle Umgebungs-Props · WS0 · 31.10.2026 (V-1076)
Empfänger: neue Claude-Code-Sitzung für die prozedurale Welt. Das ist ein Kern-Feature. Du entscheidest Details selbst; Rückgabe an WS0, nicht an Georg.

**Georg 31.10.:** Die Wave-Function-Collapse-Logik für alle Umgebungs-Props ist „immer noch nicht … sauber durchdacht und implementiert“, nicht einmal für Steine, Kiesel und Grashalm-Gruppen, „und flowers vermisse ich auch“. Zu den Steinen: Die Dreiergruppen stehen in Reihen, das Muster wirkt nicht natürlich, sie liegen wie Fremdkörper auf dem Boden.

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561). Du entwirfst es in der ersten Stunde selbst und schickst es WS0, WS0 bestätigt es.
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py`, Löser `kfb-place`, Licht das eine Rig. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten; was am Löser fehlt, wird dort erweitert.
3. **Abgabe:** mechanisches Gate grün, dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md` für Spielszenen (V-561). Georgs Auge geht bei Einbettung vor; Kritiker nur für Form und Muster, eine Runde. Georg sieht nur Bestandenes, über WS0 im Hub.

## Befund im Code (`origin/game/integration-r2`, lies selbst nach)
- `src/vendor/place/kfb-place-core.v1.mjs`: Echtes WFC ist nur `solveLocal`, also die Slots innerhalb einer Gruppe. Die Gruppen selbst sitzen auf Zufalls-Keimen je Zelle (`src/world/placeWorker.js`). Gruppen wissen nichts voneinander.
- Kiesel sind ein Zellraster im Boden-Shader (`src/look/biomeTerrain.js`, `kfbStones`). Ein Raster mit Zufall je Zelle kann keine Gruppen bilden, es entstehen Reihen. Die Farbe ist die Palettenrolle, nicht der Boden an der Stelle.
- Grasgruppen, Blumen-Beete, Pilze und Kleinsteine laufen nur mit `theme=1`. Ohne Schalter gibt es sie nicht, deshalb fehlen Georg die Blumen.
- `cascade/r4/street-plan.mjs` auf `design/kartengebaeude-r1` hat für Requisiten einen eigenen kleinen Löser. Das ist die zweite Logik, die mit deiner eine werden soll.

## Ziel
Ein Löser für alle Umgebungs-Props: Felsen, Steine, Kiesel, Grasgruppen, Blumen, Pilze, Büsche, Strünke, Fundstücke; später Stadt-Requisiten und Fluff-Nester über dasselbe System. Die Welt sieht aus wie aus Nachbarschaften gewachsen, nie gestreut.

## Lesen, bevor du baust (`~/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/`)
- `replies/KONZEPT_KFB_VERTEILER_R1.md`, Register V-1004, V-1005, V-1006, V-1007, V-1036, V-1076, V-565, V-570, V-749, V-797.
- `replies/MENTALES_MODELL_WELT_R3.md`, `replies/SPEC_PLACEMENT_GRAMMAR_R2.md`, `CANON_3D/CANON_3D_R1.md` (Erdung, Kontakt, Terrain-Einbindung).
- Dossier 04 im privaten Repo `main`, `_research/KFB Research Perplexity/KFB_RESEARCH_04_PROCEDURAL_CITY_BLOCKS_R1.md`: nur Vorschläge, vor Übernahme gegen unser Register prüfen (`replies/PERPLEXITY_GAP_R1.md`).
- Kanal `comms/ws0-ws1`: Q-011 (Vorschlag von WS1), `KONZEPT_STEINE_WUESTE_R1` im Spiel-Repo.
- **Katalog:** `catalog/KFB_PLACE_TILES_R2.json` auf `catalog/wsa-prop-pool-r2` im Repo kayfabizarro (Klassen und Themen sind automatische Etiketten, keine Abnahme). Kaufpacks: Branch `catalog/wsa-prop-pool-r2-private` im privaten Repo. Fußwerte und Längsachsen fehlen, der Kern nutzt Ersatzwerte.
- **Bewährtes zuerst:** Bevor du einen Löser schreibst, recherchiere, wie WFC in Blöcken für endlose Welten gelöst wird (Model Synthesis, geblockte WFC, Townscaper und Bad North als Vorbilder) und ob sich Vorhandenes übernehmen lässt.

## Auftrag
1. **Ebenen:** Zone/Thema → Formation → Gruppe → Element, gleiche Saat ergibt gleiche Welt, je Ebene eine Gewichtstabelle als Daten (V-1007).
2. **WFC über Gruppen hinweg:** Belegungs-Raster je Spielzelle mit Nachbarschaften als Daten, zum Beispiel: Kiesel laufen um Felsen aus, Gras sammelt sich am Fels, Blumen im Gras, Pilz im Schatten, viel bewusst freier Boden. Zellgrenzen nahtlos und unabhängig von der Lade-Reihenfolge. Rechnen im Worker wie heute.
3. **Kiesel und Steine als Instanzen aus dem Löser.** Gemalt bleibt nur feinstes Korn ohne erkennbare Einzelsteine.
4. **Erdung:** Elemente übernehmen die Boden-Albedo an ihrer Stelle, gleiche Bänder bzw. Sprenkel wie der Boden, plus Kontaktschatten und Einsinken nach Kanon.
5. **Dreier-Regel, Verwandtschaft, Dichte:** nach V-1005 und V-1036, also kein Teppich, keine gleichen Teile dicht beieinander. Lehre aus V-797: Massen und Formationen statt Krümel, nicht jede Fläche füllen.
6. **Blumen und Gras wieder im Bild:** Biom-Farbrollen, Beet-Charakter.
7. **Prüfung im Code:** gleiche Saat gleich, Zellgrenzen nahtlos, keine Reihen (eine Abstands- bzw. Richtungsstatistik), Häufigkeit je Art, nichts auf Wegen oder steilem Hang.

## Grenzen
- **Arbeitsort:** privates Repo `georg-doc/KFB-Stunt-Car-Race`, Zugriff `GIT_SSH_COMMAND="ssh -i ~/.ssh/kfb_private_assets_deploy -o IdentitiesOnly=yes"`. Worktree `~/kfb-ws0/verteiler-wt`, Branch `world/verteiler-r1` von `origin/game/integration-r2`. Hinter Schalter `place=r2`, ohne Schalter bitgenau wie bisher.
- **Grenze aus V-708 bleibt:** nie echte Landmarken, Gebäude oder Straßen umordnen, kein zweiter Höhen-Owner.
- **Modelle:** Nur Bestand, unverändert und einheitlich skaliert (V-574). Neue oder geänderte Modelle macht nur WSB (V-1065), Lücken melden, etwa fehlende Wüstensteine.
- **Festplatte:** rund 20 GB frei. Kein voller Fetch, kein Klon, `node_modules` per Link aus `~/kfb-ws0/kfb-mvp`, Testausgaben löschen, unter 8 GB anhalten und WS0 melden. Nie nach `~/KFB_GitHub_sync` holen.
- Zusammenführen: Nach Georgs KEEP holst du den neuesten Stand von `game/integration-r2`, lässt die feste Testliste laufen (`terrain-seams`, `hud-3d`, `fb-canon`) und pushst hinter deinem Schalter selbst dorthin. Kein Warten auf einen Termin.

## Rückgabe an WS0 (Name in `ListAgents`: „KFB Open World Visual Terrain Recovery Lab“)
Zuerst ein Bildblatt aus dem Spiel, Spiel-Look: Wüste, Moos und ein drittes Biom, je Spielkamera, Bodennähe und Draufsicht, daneben der heutige Stand. Dazu die Gewichtstabelle in einem Satz je Regel und die Prüfwerte. WS0 holt Georgs Urteil im Hub ein. Danach die übrigen Biome und die Stadt-Requisiten.
