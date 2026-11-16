# Für WSB (Mac mini, Blender MCP) · FB-Web-Kanon r1k: leichtere Teile, Anzug mit Knete · 16.11. (Georg über Claude Design, V-1743, V-1838, V-1856)

**Tier 0 (CANON_3D §0, wörtlich):**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

Konzept (WS0 bestätigt): keine Szene, sondern eine neue Fassung des fertigen Web-Builds einer Figur. Die Konzeptblatt-Pflicht (CANON_3D §0, V-563) gilt für Szenen; eine Fassung ohne Szene braucht keines (V-561, FAIL, hier nur als Geltungsbereich). An seiner Stelle stehen dein Auftrag R1 (`replies/FB_WEB_KANON_R1/BRIEF_WSB_FB_WEB_KANON_R1.md`) und die Messwerte unten.

**Kern (3 Zeilen):**
1. Auf der Website steht FB neben Stoff und Pappe. Er ist dort das schwerste Teil der Szene: Die Agent-Fassung hat 147.394 Dreiecke in 35 Netzen, der ganze Boden im Bild rund 156.000.
2. Fünf Teile tragen fast alles: Ohr links 35.108, Ohr rechts 22.720, Lidhaut rechts und links je 31.360 (mit 6 Morph-Zielen fürs Blinzeln), Kopf 12.544. Die beiden Ohren sind ohne Grund ungleich schwer.
3. Der Anzug der Agent-Fassung glänzt wie Plastik: Rauheit 0,5, kein Relief, anders als Kopf und Ohren (0,85 mit gebackener Knete-Normalkarte). Die Website legt keinen Shader über FB, deshalb muss die Knete in der Datei stecken (V-1743: gebackener Web-Build).

**Grundlage:**
- Web-Kanon r1j in `assets/private` `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/`: `FB_WEB_KANON.r1j.glb`, `FB_WEB_KANON_twin.r1j.glb`, `FB_WEB_KANON_agent.r1j.glb`, `FB_WEB_KANON_agent_twin.r1j.glb`, dazu dein Back-Skript aus R1. Eintrag in der Figuren-SSOT: Stamm `game/integration-r2`, `src/data/characters/frizzlebob.character.json`, `appearance.export`.
- Messung WS0 auf r1j (Dreiecke je Netz): Web 155.850 gesamt (dazu `KFB_Shirt_FB` 10.380), Agent 147.394 gesamt (`KFB_Anzug_Body` 918, `KFB_Anzug_Leg*` je 730, Rauheit 0,5).
- FB-Kanon-Wächter (`test/lib/fbKanon.mjs`, V-804, V-1607): beide Ohren, linkes aus A11, Schwanz, Augen mit Lidern im dunkleren Kopfton. V-1608 ist ein FAIL und gilt hier als Warnung: Ein Ohr oder der Schwanz darf nie verloren gehen.

**Was du machst (alle vier Fassungen, neue Endung r1k):**
1. **Leichtere Teile, gleiche Form:**
   - Ohren je höchstens 5.000 Dreiecke, links und rechts höchstens 10 % auseinander. Die Form des A11-Ohrs bleibt.
   - Lidhaut je höchstens 4.000 Dreiecke. Die 6 Morph-Ziele bleiben erhalten, mit gleichen Namen und gleicher Wirkung. Ein einfaches Ausdünnen zerstört Morph-Ziele, deshalb neu aufbauen und die Ziele übertragen (oder die Lidhaut mit deinem Lid-Werkzeug in geringerer Auflösung neu erzeugen).
   - Kopf höchstens 6.000 Dreiecke.
   - Die Feinform geht in die Normal-Karten (Hochpoly auf Niedrigpoly backen), wie Kopf und Ohren sie schon haben.
   - Alle anderen Teile bleiben unverändert. Ausnahme: Die alten `userData.kfbClayOrig`-Reste an Schwanz und Shirt entfernst du (V-1853).
2. **Knete auf dem Anzug (nur Agent-Fassungen):** Der Anzug bekommt dieselbe gebackene Knete wie Kopf und Ohren, mit demselben Back-Skript und denselben Werten (Rauheit wie der Kopf, Knete-Normalkarte). Keine neue Knete-Rezeptur, keine Glanzstellen.
3. **Netze zusammenlegen** nur, wo es nichts kostet: Teile mit gleichem Material und gleicher Haut dürfen ein Netz werden. Alle Knoten, die von Namen gelesen werden, bleiben einzeln und gleich benannt: `FB_Mund*`, `FB_Pupille_*`, `FB_Lederhaut_*`, `FB_Lidhaut_*` und alle Teile, die `fb_gesicht.v1.js` anspricht.
4. **Gleich bleiben:** Rig, Knochennamen, Maßstab und Clip-Verträglichkeit mit `FB_WEB_KANON_agent_twin.r1j.glb` (Katana, 17 Tänze, Erklär-Gesten). Das Gesichtspaket `fb_gesicht.v1.js` läuft ohne Änderung.
5. **Proof-Durchlass:** Die FB-Sperre kennt r1k noch nicht. WS0 gibt für die r1k-Dateien einen Proof-Durchlass wie bei r1j (V-1838), nur für Proof-Renders. Du trägst ihn in deine gültige `FB_CANON.json` ein und lieferst sie im Bündel. Kanon bleibt r1j, bis Georg r1k abnimmt.

**Belege:**
- Tabelle Dreiecke je Netz vorher (r1j) und nachher (r1k), je Fassung, dazu Netze und Materialien gesamt.
- Proof-Bühne, Licht der Bühne, Knete wie im Spiel. Vergleichsblatt je Fassung „r1j | r1k“ von vorn und von der Seite, nah und aus Spielkamera-Abstand. Im Nahbild Ohren, Lider und Anzug, beim Blinzeln ein Bild je Morph-Ziel.
- Kanon-Wächter grün vor jedem Bild. Gesichtspaket-Probe: dieselben Mundformen und Lidstellungen in r1j und r1k, Bild neben Bild.
- Ein Lauf des blinden Kritikers mit den Fragen: „Sieht r1k aus wie r1j, von nah und aus Spielabstand? Ist der Anzug matt wie Knete statt glänzend wie Plastik? Sind beide Ohren gleich gebaut?“

**Rückgabe:**
- Git-Bundle mit Zweig `assets/wsb-fb-web-kanon-r1k` von `assets/private` (aktueller Stand): vier r1k-Dateien in `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/`, Back-Skript, `FB_CANON.json` mit Durchlass, Belege unter `50_BLENDER/FB_WEB_KANON_R1/R1K/`. Die r1j-Dateien bleiben unverändert liegen.
- RETURN `RETURN_r1k.md` in `KFB_HUB/30_DECISIONS/replies/FB_WEB_KANON_R1/MINI_r1k/`: Tabelle vorher/nachher, Vorgehen bei den Morph-Zielen, Abweichungen mit Grund.
- **Lücke melden:** Ob das Spiel zur Laufzeit dieselben schweren Teile (A11-Ohr, Lidhaut) lädt, schreibst du mit Zahlen in den RETURN. Den Umbau im Spiel entscheidet WS0 danach.
- WS0 trägt r1k nach Georgs Abnahme in `frizzlebob.character.json` `appearance.export` ein und gibt der Website Bescheid.
