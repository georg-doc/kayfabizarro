# Spätere Design-Jobs · Pit/Rampen + Clay-Billboards

Diese Jobs starten **nach** T4. Sie sind getrennt, damit ein Problem mit Boxengasse oder Medien-Embeds nicht den grundlegenden Track→City/Nature-Look blockiert.

## D1 · Boxengasse + Track-Auf-/Abfahrten

### Auftrag

Gestalte auf Basis des echten Track Core und des akzeptierten T3-Knetstrangs:

- eine Boxengassen-Einfahrt;
- eine Boxengassen-Ausfahrt;
- eine Auffahrt von City/Nature auf den Track;
- eine Abfahrt vom Track in City/Nature.

Nutze die vorhandene Track-Core-Boxengassen-Recipe als Geometriequelle. Keine freihändig neu gezogene Route.

### Regeln

- Verzweigungen sind echte Fahrflächen mit geschlossenen Kontakten.
- Fahrbahn, Markierung, Knetstrang, Rand/Bordstein, Gehweg und Biom reagieren zeitlich versetzt.
- Beschleunigungs- und Bremsraum bleibt lesbar; Props/Billboards blockieren keine Sichtlinie.
- Pit Lane erhält ruhigere, niedrigere Randformen als die Hauptstrecke.
- Auf-/Abfahrten werden nicht wie Autobahn-Standardteile verkleidet, sondern bleiben dieselbe lebendige Knetwelt.

### Output

`transition-profiles.v2.json`, aktualisierte T3/T4-Design-Spezifikation, vier reale Szenen und ein vollständiger GitHub-Return. Keine Runtime-Physikänderung.

## B5 · KFB Claymation Billboards am Trackrand

### Source-first Lesepaket

- `tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/RACER_CLAUDE_HUD_BILLBOARDS_ADDENDUM_2026-09-23.md`
- `tools/KFB-ToolBox/_handover/BILLBOARD_CURTAIN_NEXT_2026-09-24.md`
- `tools/KFB-ToolBox/_inbox/KFB Billboard Media Szene · B0 Source Proof/BILLBOARD_B0_SOURCE_PROOF_2026-09-24/`
- `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H4 - Hex Assets Worldbuilding/kfb-billboard-hypernorm-h4_2026-09-26/`
- `tools/KFB-ToolBox/_inbox/KFB Public Domain Pool - 02/`
- `media/public_domain/README.md`, `manifest.jsonl` und jeweilige `.license.json`

### Bestehende, zu erhaltende Engine-Fähigkeiten

- realer Kenney-Billboard-Körper; B0 misst die Werbefläche mit 4,20 × 2,10 m;
- route-relative Platzierung und vorhandener `renderCardQuarter()`-Pfad;
- `FIT_CARD`, `COVER_CROP`, `DETAIL_CROP`;
- Card Quarter, Card Cover und große Slogan-Typografie;
- YouTube/externes Video als ausgerichtete CSS3D-Fläche oder Poster + Klick, nicht als erfundene WebGL-Textur;
- später `COLLAGE_LOOP` aus belegten Public-Domain-Medien;
- `CITY_LIGHTS_ROTATION` und H4 `HYPERNORMALISATION` als vorhandene Inhaltsmodi;
- Rückseite bleibt echter 3D-Körper; Medienfläche erscheint nur auf der sichtbaren Front.

### Designauftrag

Entwirf eine KFB-Claymation-Hülle für die echten Billboard-Familien (`billboard`, `billboardDouble_exclusive`, `billboardLow`, `billboardLower`, `overhead`, Banner-Türme). Die Quelle wird jeweils zuerst isoliert gezeigt. Pfosten, Rahmen, Füße und optionale Dach-/Wulstformen dürfen geknetet, gebogen und farblich an Biom/T3-Palette angepasst werden; Bildschirmfläche, Orientierung, Pivot und Content-Lifecycle bleiben messbar.

Erste Trackrand-Komposition:

- 6–10 deterministisch gesetzte Billboards;
- 2–4 echte Körpervarianten;
- beide Fahrbahnseiten nur dort, wo Sicht, Auslauf und Kollision frei bleiben;
- unterschiedliche Höhe/Neigung/Größe innerhalb enger Grenzen;
- City eher Poster/City-Lights, Nature eher niedrige Tafeln/Infostelen, Race-Zonen dynamische Cover/Video/Hypernormalisation;
- Credits- und Museumsmodus für Asset-Creators/Public-Domain-Provenienz als anklickbare Tafel, ohne Lizenztext während der Fahrt ins Bild zu kippen.

### Medien- und Rechtevertrag

- Jede Public-Domain-Datei behält ihren Manifest-/Lizenzbeleg.
- Internet-Archive-Uploads werden vor öffentlicher Nutzung einzeln geprüft.
- Kein Stretching: Inhalt wird passend skaliert oder bewusst beschnitten.
- Externe Medien werden bei Moduswechsel entladen; kein unsichtbar weiterlaufendes Video/Audio.
- Ein Renderer und ein Taktgeber pro Billboard. Kein doppelter Ticker.

### Leistung

- Entfernungsgesteuerte Aktualisierung: statische Poster weit, dynamische Canvas-/Video-Modi nur in relevanter Nähe.
- Canvas/Video-Auflösung und Framerate nach Entfernung staffeln.
- H4-Pixeloperationen cachen; CORS- und Font-Ausfall als klarer Modusfehler, nicht als stiller schwarzer Screen.
- Körper instanzieren, Materialfamilien teilen, keine dynamischen Schatten für entfernte Tafeln.

### Erfolg

Ein echter T3-Trackabschnitt zeigt statisches Card-/Cover-Motiv, Slogan, Video und mindestens einen dynamischen Engine-Modus auf source-bewiesenen 3D-Körpern. Die Tafeln lesen sich als Teil der Knetwelt, behindern aber weder Fahrbahn, Sicht noch Performance.

STOP nach Design-/Embed-Proof und GitHub-Export. Keine Live-Promotion und keine neue Medienengine.

