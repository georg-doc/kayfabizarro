# Für Claude Design (Fable 5.2) · Integrations-Block: ein Besitzer je System, bevor auf Opus umgestellt wird · 17.11.2026 (Georg, V-1888)

**Warum dieser Block mit Fable:** Hier wird fremder Code im Spiel-Repo gelesen und entschieden, wo etwas hineingehört, ohne zweiten Verteiler oder zweiten Besitzer. Fehlurteile sind teuer, weil alle darauf aufbauen. Ausfüllarbeit nach festem Muster kommt danach mit Opus 5.5 (eigener Brief).

**Arbeitsweise für alle Teile:**
1. Bestand lesen (Stamm `georg-doc/KFB-Stunt-Car-Race`, Zweig `game/integration-r2`).
2. Eine Seite „ein Besitzer“ mit `HOST_CONTRACT.md`, dazu der kleinste Adapter mit Tests.
3. Abgenommene Looks werden nicht neu gebaut; was geht, wird übernommen.
4. Bewegte Belege auf der Kampfbühne (`buehne=r1`, `test/lib/buehne.mjs`), Standbilder mit dem Spiel-Licht.

## Antworten auf NACHTRAG_2 (Steinchen, @d6f7167f)
1. **Träger und Codes:** Ja, über die vorhandene Träger-Schleife des Verteilers (Grammatik `src/world/grammar.js` mit `carrier`, Bewuchs `src/world/endlessVeg.js` / `placeVeg.js`), mit einem zusätzlichen Code-Feld. Kein eigener Zustand in der Feldtabelle, ein Streuer.
2. **Lauf und `kfb-curb`:** Jetzt geteilte Helfer, das Zusammenlegen in einen Besitzer mit der Straßenanatomie (Teil 2 unten).
3. Die Zeilen für `materialContact.js` (Treffer-Darstellung) passen so.

## Teile in dieser Reihenfolge
1. **Umgebung andocken** (läuft): Träger mit Codes am Verteiler, Felder am Straßenrand, Steinchen. Ziel: im Spiel sichtbar hinter `boden=patchworld` / `bits=r1`.
2. **Straßenanatomie, ein Besitzer:**
   - Fahrbahn, Rand mit Sprenkel-Auslauf, Gehweg und Pflaster, Begrenzung (Zaun, Mauer, Bordstein, Bande), dazu Träger für Steinchen und City-Props.
   - Bestand: `viertelZufahrt.js`, `kfb-curb`, Viertel-Generator, Gelände-Schneise (`reserveOpening`).
   - Die Straßenlinien kommen aus **einer** Quelle; das prozedurale Straßennetz baut WSA Racer (Hub b464). Lege fest, welche Form die Linien haben (Kacheln, Breite, Kreuzungen), damit Gelände, du, der Verteiler und der Racer dasselbe lesen.
3. **WFC und Platzierung, eine Ordnung:**
   - Heute gibt es mehrere Platzierer: Start-WFC (`startWfc.r1.json`), Dioramen-Platzwahl (`src/world/dioramen/`), Szenen-Plätze mit Belegung (`src/world/szenen/`, `occupancy.js`), Bewuchs-Grammatik, Viertel-Generator und deine Brettspiel-Bits.
   - Vorschlag gesucht: eine Belegungsreihenfolge und ein gemeinsames Regel-Format (JSON) für WFC-Formationen. Zonen und Formationen, kein Streugut (V-797). Bestehende Platzierer docken an, statt ersetzt zu werden.
4. **Wind und Bewuchs, ein Windfeld:**
   - Ein Wind (Richtung, Stärke, Böen) für alle: Fernwald (`fernwald=r1`), Bäume (Hartgummi-Biegen `gummi=1`), Feldfrüchte, Fluff-Böen (`fluff.js WIND`), Fahnen und Stoffe, Wolken. Später nutzen auch das Feuer (WSA Feuer, Hub b465) und das Stoff-Feld dieses Feld.
   - Bewegung im Shader, kostengünstig, mit Fernwald-LOD.
5. **Himmel und Atmosphäre, ein Besitzer:**
   - Bestand: `sky=r1`, Sterne (`stars=1`), Wolken (Wolkenscheiben, Kuppelwolken V-1184), Planeten, Verläufe und Farbstimmungen (`kfb-drive-moods.r1.json`), Tageszeit (`hour`, `tlapse`, `tag=1`), Wetter, Lichtinseln in der Nacht, das eine Licht-Rig (V-385).
   - Ziel: ein Zustand aus Tageszeit, Stimmung und Wetter, der Himmel, Licht, Dunst, Sterne und Wind gemeinsam steuert. Bestehende Looks bleiben.

## Lieferung
- Je Teil ein Abschnitt in deinem Zweig (`claude/umgebung-r1` oder je Teil ein eigener) mit Entscheidungsseite, `HOST_CONTRACT.md`, Adapter, Tests und RETURN.
- Zwischenstände sind willkommen. WS0 hängt ein und zeigt Georg die Ergebnisse im Hub.
