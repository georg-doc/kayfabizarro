# Brief · Feuer-Presets R1 (WS0, 23.11.2026, V-2102)

**ABSICHT:** Feuer gehört zur Welt, nicht zur Effektbühne. Die acht ungenutzten Presets des Patch-Feuers bekommen feste Orte und Zustände im Spiel, sodass jeder Ort sofort liest, was er ist: Fackeln im Labyrinth, Kohlebecken im Amphitheater, Freudenfeuer am Lager, kaltes blaues Gas bei MiB, eine brennende Kiste nach einem Treffer, eine Feuerwand als Gefahr.

**GENRE:** Cartoon-Action-Abenteuer, Claymation-Vordergrund, realistischer Hintergrund (V-1171). Feuer ist Licht- und Stimmungsquelle, kein Partikelfeuerwerk.

**OWNER:** ein Agent im Auftrag von WS0, Arbeitskopie `~/kfb-ws0/nahkampf-wt`, Zweig `ws0/feuer-presets-r1` (ab Stamm @68f8fb42). Merge macht WS0.

**ZIEL (je Preset genau ein Einsatz, alles über `src/look/feuerNaht.js` → `feuerAdd`, kein neuer Feuer-Code, Vendor unverändert):**
| Preset | Ort / Zustand |
|---|---|
| `brazier` | Amphitheater: ersetzt das heutige `campfire` dort (M1World, `AMPH_FEUER`), Schale aus dem Bestand oder vorhandene Bühnenschale |
| `torch` | Fackeln an Wänden/Toren des Gefängnis-Labyrinths bzw. am nächstliegenden vorhandenen Wandort; Halter aus dem Bestand (KayKit Dungeon/Kenney) |
| `candle`, `fireplace` | ein vorhandener Innenraum (Café/Haus/Kartengebäude, was im Spiel betretbar ist) |
| `bonfire` | Lagerplätze (NPC-Lager `fireLogs` in npcSceneProbe nutzen heute `campfire`: ein großer Lagerplatz bekommt `bonfire`) |
| `crate` | Zerstörungszustand: eine Kiste/Truhe, die getroffen wird, brennt eine feste Zeit und geht über die bestehende Ende-Kaskade aus (core/rezept.js, kein Einzelteil) |
| `line` | Feuerwand als Gefahr (Kampfbühne): Schaden über bestehendes Treffer-System, Ein/Aus über Zustand |
| `gas` | blaue Düsen an MiB- bzw. Sci-Fi-Orten (MiB-Ereignis, Turm o. ä.) |

Dazu **gebogener Flammenstrahl** (Georgs Wunsch): zuerst prüfen, ob `line` mit seinen Parametern (stretch, halfWidth, windBend über `wind`/`windDirection`, Rotation am Elternknoten) einen gebogenen Strahl ergibt. Ergebnis kurz dokumentieren (geht / geht nicht, warum). Nicht neu bauen.

**FERTIG:**
1. Schalter `feuerorte=r1` in `src/flags.js` (owner WS0, status pruefen); ohne Schalter zeichnet das Spiel exakt wie heute.
2. Jeder Ort nutzt einen Halter/Träger aus dem Bestand (Inventur zuerst: `src/vendor`, `src/private-gen`, KayKit, Kenney, Quaternius; 3D-Suche über das MCP 3d-assets selbst). Feuer sitzt auf dem Träger, nie frei in der Luft, nie im Boden.
3. Licht nur über das eine Rig plus die Feuerlichter des Presets (V-385/386); `shadow: false` wie bisher, Leistung: höchstens so viele gleichzeitig nahe Feuer, dass `feuerDraw` unter FEUER.NAH nicht mehr als heute kostet + 2 ms (messen, Readback-Methode V-GPU).
4. Belege nur über feste `belegVideo`-Presets (seite/dreiviertel/totale/kontakt) im Spiel-Look, `KFB_SPLIT=1` mit `--base=./`, ein Belegordner `replies/FEUER_PRESETS_R1/_privat/belege_r<n>/` (Medien nie außerhalb `_privat`). Je Ort ein Still bei Nacht- und bei Tageslicht, Feuerwand und Kiste als kurzes MP4.
5. Stille Blind-Kritik (tools/CRITIC_BLIND_PROMPT.md, tools/qa_matrix.r1.json): je Runde ein frischer Kritiker nur mit ABSICHT, GENRE und den Belegen; höchstens 5 Runden, Stopp nach 2 ohne Verbesserung; Paarvergleich mit dem besten Stand. PASS: keine Achse < 7, Mittel ≥ 8.
6. CI wie Stamm (229/231, die 2 bekannten Roten), Rauchtest grün, `npx vite build` grün. Commit(s) auf dem Zweig pushen (Schlüssel `kfb_private_assets_deploy`), nicht mergen.
7. Rückgabe als neue Datei RETURN_R1 (Markdown) im Ordner dieses Briefs: je Preset Ort, Träger (Quelle), Schalter, Messwerte, Kritik-Verlauf, offene Punkte; Ergebnis Flammenstrahl.

**GRENZEN:**
- Nicht anfassen: `src/vendor/fire/*`, die Feuernaht-Logik selbst (nur aufrufen), andere Schalter, `src/private/` (nie committen), HUD.
- Kein Animatic, keine Referenzsuche als Zwischenschritt, keine Rückfragen-Schleifen: bei Unklarheit die naheliegende Lösung nehmen und im RETURN vermerken.
- Kein `npm ci` in der Arbeitskopie; GPU-Lock für Playwright (`until mkdir /tmp/kfb_gpu.lock; do sleep 2; done … rmdir`); Test-Server mit `srv.stop()` beenden, Tabs schließen; Plattenplatz vor jedem Build mit `df -h ~` prüfen, ein Build-Ordner, überschreiben.
- Keine Texte/Labels im Bild. Keine eigenen Lichter, keine gemalten Glanzpunkte.

**DETAIL:** Feuer-API: `feuerAdd({ type, position, size, light, intensity, smoke, wind, windDirection, shadow:false }, parent)` → `{ fire, remove() }`. Presets und Parameter: `src/vendor/fire/index.js` (`FIRE_TYPES`, `shapeOn`), README dort. Heutige Einsätze: `src/m1/M1World.jsx` (Amphitheater, Z. ~1233), `src/npc/npcSceneProbe.js` (fireLogs, Z. ~136). Wind: `feuerwind=r1`. Modulkatalog: `KFB_HUB/30_DECISIONS/KFB_MODULE_KATALOG_R1.md` (Abschnitt Eingeplant). SOP: `KFB_SOP_R1.md`, Äste `KFB_SOP_AESTE_R1.md` (VFX, Licht).
