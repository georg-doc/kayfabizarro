# Road Constructor (Pampel Games, Unity #287445) · Verhaltensnotizen für den KFB-Editor · 2026-10-08

Quelle: 13 öffentliche Store-Screenshots, die Georg nach `~/Dropbox/CLAUDE/KFB Claymation Reference/Race Track Builder/` gelegt hat. Nicht gekauft, nicht installiert, kein Code und keine Assets übernommen. Hier steht nur beobachtetes **Verhalten** und wie es in KFB-Begriffen heißt.

| Beobachtung (Screenshot) | KFB-Entsprechung | Status in R3 |
|---|---|---|
| Straßentyp = Liste von Querschnitts-Bändern („Lanes“: Typ, Material, Position X min/max, UV, Höhe) | Track-Core-Profil mit 14 Slots + Rollen je Familie | **umgesetzt** (v0.13 `PROFILE_FAMILIES`) |
| Kategorien Local_Two/Four/Six, Highway_Six/Eight | Familie × Spuranzahl (1–8) | **umgesetzt** |
| Spawn-Objekte je Straße: Abstand (Welt-Einheiten / Bounds), Position Mitte/Rand, Höhenversatz, „nur erhöht“ + Höhenbereich, Überlappung entfernen, Zufall | Möbel-/Stützen-Regeln am Stream (`anchors`), z. B. Pfeiler alle n m nur bei Höhe > x | **offen (P2)**; A1 nutzt nur Kreuzungs-Anker und Brückengeländer |
| Kreuzungen: Bordsteinradius, Zebrastreifen hinter dem Radius, Haltelinie, Gehweg läuft um die Ecke | Track-Core-Node `JUNCTION`: Eckenausrundung, Zebra, Haltelinie, Bordsteinläufe mit Familien-Querschnitt | **umgesetzt** |
| Fahrspur-Splines durch die Kreuzung (Traffic Lanes & Waypoints) | Spurgraph `node.lanes` (Abbiegeregeln rechts/geradeaus/links, Bogen konzentrisch zum Bordstein) | **umgesetzt** |
| Kreisverkehr mit Zufahrten, Zebras abgesetzt | Track-Core `ROUNDABOUT` (v0.12) | vorhanden; Familien-Bordstein im Kreisverkehr **offen (P2)** |
| Überlappungs-System: Brücken über Straßen, mehrere Ebenen | `cross_clearance` + Fahrzeughülle 7 m im Track Core | Prüfung vorhanden; Kreuzungsbauwerke **P2/P3** |
| Einstellungen: Snap-Distanz/-Winkel, min. Kreuzungswinkel 45°, max. Krümmung, max. Steigung 30, Höhenbereich, Undo-Speicher | Editor-Validierung → Track-Core-Checks (`node_fit` lehnt > 180°-Lücken ab, Radius-Checks, Grade) | Checks vorhanden; **Editor = P4** |
| Auto-Terrain-Anpassung (Böschung unter der Brücke) | Surface-Truth-Owner: Cut/Fill-Anfrage aus dem Stream | **später**, nicht Blender |
| Dynamische Auflösung (dichter in Kurven/Kreuzungen) | Stream-Abtastung `ds` + LOD je Rolle | offen |
| LOD-Stufen für Kreuzungen | LOD je Bauteil im Manifest | offen |

Ablauf, den wir unabhängig nachbauen (P4): Pfad ziehen → RouteRecipe-Diff → Track Core prüft Radius/Grade/Hülle → Kreuzung als echter Node (nie Platte) → Sockets/Anker → Blender-Teile docken an → Surface-Truth-Cut/Fill-Vorschau → nur betroffene Nachbarschaft neu bauen → Undo.
