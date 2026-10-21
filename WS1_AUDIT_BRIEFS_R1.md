# WS1 · Briefs für externe Prüfer-Sitzungen R1 · 21.10.2026

Auftrag Georg (21.10., vor dem Reset): Die volle Kapazität nach dem Reset (bis Do. 02:00) soll parallel für Prüfungen genutzt werden: Art Direction, externer Critic/QA, Game-Dev-Code-Audit inkl. Leistung, Cartoon-VFX und -SFX.
Jede Sitzung arbeitet **allein und lesend**. Sie liefert einen Bericht und keine Umbauten. Umgesetzt wird nach Georgs Auswahl durch die WS1-Owner-Sitzung („R3F Modul-Host Vertrag“).

## Gemeinsamer Kontext (für alle vier)
- **Prüflinge**
  - **Gelände-Probe:** `~/kfb-ws1/probe/gelaende-probe.html` (Quelle, three r147, eine Datei). Lokal läuft der Server „gelaende-probe“ auf Port 8751 (Ordner `~/kfb-ws1/probe/pubsrv`). Live unter https://ws1-preview.kayfabizarro.pages.dev/gelaende-probe (Zweig `ws1/preview`).
  - **Spiel:** `~/kfb-ws1/kfb-planet-t439` (Zweig `terrain/439`, three r186 / R3F). Öffnen **nur mit Hash**, z. B. `#m1,harvest,look=terrain3`. Die nackte Adresse zeigt die Hex-Insel, das gilt als FAIL. Gespiegelt nach `ws1/terrain-439`.
- **Werkzeuge:** Headless-Prüfskripte in `~/kfb-ws1/probe/tests/` (Playwright aus `kfb-planet-t439/node_modules`, GPU: `--use-angle=metal`). Der Browser-Pane zeichnet keine Frames, solange er verborgen ist.
- **Kanon und Register (öffentliches Repo `georg-doc/kayfabizarro`, nur gepinnte Commits zitieren):**
  - `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/DECISIONS.md` (Zweig `docs/kfb-decisions-register-2026-10-11`, zuletzt V-582)
  - `CANON_3D/sources/`: WS1-Recherchen zu Schatten R1, Wasser R1, Ferne R1, Wolken R1, Effekt-Bildsprache R1 und Himmel R2
- **Georgs gültige Urteile** (Kurzfassung, Details in WS1_STATUS §104–§116):
  - **Ja:** Fließfarben mit harten Bandkanten, Knet-Steine, organische Formen.
  - **Nein:**
    - Polygon-Facetten, Zacken.
    - Pixelige Schatten, Blob-, Decal- und Kapselschatten (V-564/V-568 hartes FAIL).
    - Weiche Verläufe, wo die Bildsprache harte Kanten hat.
    - Fake wirkende vorbeiziehende Wolken.
    - Nebelwände.
  - **Schatten:** KayKit-artig, eine Sonne, Ton aus der Palette des Empfängers, Kanten kontakthärtend.
  - **Wasser:** Island Kit Fluid F2, „morpht langsamer als das Gelände, das ist sehr KFB“.
- **Regeln für alle:**
  - Nichts veröffentlichen, posten oder mergen, nichts auf `main` oder `ws1/*` pushen.
  - Keine DocCheck-Interna.
  - Prüfen **mit Georgs Einstellungen**: In seinem Tab war z. B. der Sonnenstand 12° und „Erdung“ aus. Testfälle mit Standardwerten und mit seinen Werten fahren.
- **Lieferung:** ein Bericht `~/kfb-ws1/research/audits/<ROLLE>_R1.md` mit Befunden in Rangfolge. Jeder Befund nennt:
  - die Datei mit Zeile
  - was falsch ist
  - wie man es reproduziert, mit Bildern unter `~/kfb-ws1/research/audits/img/`
  - Aufwand S/M/L und Risiko
  - einen Vorschlag

  Dazu eine Zusammenfassung in 5 Zeilen für Georg. Kein Push.

---

## A · Art Director (Look, Komposition, Bildsprache)
**Frage:** Liest sich die Probe als **ein** Cartoon-Stil?
- **Kriterien:**
  - Hanna-Barbera/Lozzi-Hintergründe, Looney Tunes, TinySkies als Gefühl; harte Kanten vorne, Verläufe nur im Himmel.
  - Fließfarben, Knete, KayKit-Figuren und Island-Kit-Wasser zusammen.
- **Prüfen:**
  - Gelände nah, mittel und fern
  - Ufer und Wasser
  - Himmel, Wolken, Horizont
  - Schatten und Erdung
  - Fahrzeug mit VFX
  - HUD-Lesbarkeit
  - die Spiel-Ansicht `#m1,harvest,look=terrain3`
- **Liefern:**
  - Top-10-Brüche der Bildsprache mit Vorher-Bild und Skizze bzw. Beschreibung des Soll-Zustands.
  - Vorschlag für 3 Stimmungen (Paletten × Tageszeit) als Regler-Rezepte.
  - Liste „sofort entfernen“: Effekte, die dem Stil schaden.

## B · Externer Critic / QA (Abnahme wie ein fremder Spieler)
**Frage:** Was sieht ein Außenstehender in den ersten 60 Sekunden als kaputt, billig oder unfertig an?
- **Prüfen:**
  - Start und Spawn: Schweben, Hüpfen, Kamera.
  - Fahren: Hänge, Mulden, Steine, Wasser, Sprung hoch und weit, Landung, Boost, Driften Q/E.
  - Übersicht/Orbit; Wechsel der Regler und Biome; Fluids; Sonnenstand 4–70°.
  - Bildkanten (heller Streifen oben ist offen), dünne Linien, Flackern.
  - Leistung (fps-Anzeige).
- **Liefern:**
  - Fehlerliste P0–P3 mit Reproduktion: Seed, Regler, Position über `__probeDrive().placeCar(x,z,yaw)`.
  - Für jeden P0/P1-Befund ein Prüfskript-Entwurf im Stil von `probe/tests/*.mjs`, damit er künftig automatisch auffällt.

## C · Game-Dev Code-Audit + Leistung
**Frage:** Wo kostet es Bildrate, wo ist der Code fragil?
- **Ausgangslage:**
  - Georg sieht 9–15 fps auf seinem Mac. Headless mit GPU liefert 15–35 fps.
- **Prüfen:**
  - **Leistung:**
    - GPU-Zeit je Effekt in der Probe: Gelände-Shader (hgt im Vertex- und Fragment-Shader, Fließfarben), Schattenkarte mit PCSS-Suche, Boden-AO-Pass (1024², 4 Weichzeichner-Durchgänge), Wasserhaut, Wolkenkarten, Ringe, Speedlines, Felsgruppen.
    - Messung über Ein/Aus-Paare (Checkboxen/Regler), `EXT_disjoint_timer_query` wo verfügbar, sonst Bildzeit-Median über 300 Frames.
  - **Code:**
    - Einzeiler-Fallen: `//`-Kommentare mitten in Zeilen haben schon zweimal Code verschluckt.
    - doppelte JS/GLSL-Höhenfunktion (`hgt` / `bankMod` / `dioMod` müssen gleich sein)
    - Speicherlecks beim Wagen- oder Biomwechsel
    - Shader-Neukompilierungen
- **Spiel:**
  - `src/look/terrain3.js`, `src/modules/sky-r13.js`, `src/m1/M1World.jsx`, `src/m2/k2t.js`.
  - Die Testreihe `npm test` gibt den Rahmen vor; c2 wackelt bekannt auf der GPU.
- **Liefern:**
  - Tabelle Effekt × Kosten (ms/Frame, Anteil) × Nutzen für den Look.
  - Drei Leistungsstufen (hoch/mittel/niedrig) als konkrete Regler-Sätze.
  - Code-Befunde mit Patch-Vorschlag als Diff im Bericht, nicht angewendet.

## D · Cartoon-VFX und SFX
**Frage:** Welche Effekte und Geräusche machen KFB lebendig, im Cartoon-Stil?
- **VFX:**
  - Grundlage: Effekt-Bildsprache R1 (`CANON_3D/sources`, Entwurf).
  - Vorhanden: Düsenglühen, Speedline-Bänder, Schwebe-Atmen, Wasser/Bubblegum/Säure-Blasen.
  - Prüfen: Staub beim Fahren, Landering, Spritzer beim Eintauchen und Fahren über Wasser, Boost-Stoß, Drift-Spuren, Sprung-Puff. Alles im Stil harte Form plus weiche Füllung, kein Partikel-Rauschen.
  - Frage: Lohnt sich ein gemeinsames Modul `kfb-vfx`?
- **SFX:**
  - **Schon im Repo, erst sichten, dann vorschlagen:**
    - `assets/kfb-elevenlabs-sfx-r1-2026-10-18` (Antrieb: Jet/Turbine/Auspuff/Antigrav-Loops, Boost, Schaltknall; Blasen; UFO; Fluff)
    - `audio/kfb-racer-motor-grid-r1-v378-2026-10-17`
    - `audio/racer-gears-r1-2026-10-18`
    - `audio/flight-crash-r1-2026-10-18`
    - `audio/kfb-ambience-v1-v458-2026-10-18` (36 CC0)
    - Audio-Site (V-390)
  - **Prüfen:** Ereignisse → Klang (Fahren über das Tempo, Sprung, Landung, Boost, Drift, Wasser, Blasen, Wind über die Höhe); Mischung; Cartoon-Timing (Vorlauf, Nachhall).
  - **Liefern:**
    - Klangkarte Ereignis × Datei × Anschluss (Web Audio, Probe und Spiel), Cartoon-Timing, Mischung.
    - Top-10 zum Einbauen, mit Aufwand S/M/L.
    - VFX-Liste mit Skizzen und Kosten.
