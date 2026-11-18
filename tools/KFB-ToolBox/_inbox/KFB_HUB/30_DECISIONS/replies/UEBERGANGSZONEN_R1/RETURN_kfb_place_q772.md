# kfb_place.r1 · Übergangsregeln nach Georg q772 · RETURN (WSB, 18.11.2026)

**Auftrag:** WS0 18.11., Georg q772: „Die drei übernehmen, Kranz eingeschränkt“. Eintragen in `50_BLENDER/N40/lib/kfb_place.r1.json` (vorher Sicherung), dazu die Spiel-Fassung slim, die Liste der Leser und Schalter und Belege vorher/nachher.

## Eingetragen (gleich in Voll- und slim-Fassung)
- **`embed.sop.steps` 10–12:**
  - 10 Ausreißer,
  - 11 Tore und Eingänge stärker eingebettet (Schritt 4 „Laufweg frei“ bleibt),
  - 12 Kranz nur als Option je Bauteil.
- **`embed.uebergang`** (neu, maschinenlesbar):
  - `W`: Breite des tragenden Bauteils; ohne Bauteil 4,2 % des Fußdurchmessers, begrenzt auf 0,4–1,6 m (Startwert, `tune`).
  - `ausreisser`: Klasse M, 1–4 W vor der Kante, etwa 1 je 4–6 W Umfang, Dichte nach außen fallend, nur hangabwärts, Größe 0,3–0,6 des Band-0-Ankers.
  - `tor`: Seitenhaufen an beiden Pfosten, 4,5–5 W nach vorn, 3 Stufen; Vorfeld ≈ 10 W frei.
  - `kranz`: `pflicht: false`, Option je Bauteil, L 0,5–0,8 W, Abstand 1–3 L, Gruppen zu 2–3, Büschel nur, wo das Biom Gras hat.
  - `wasserkante`: `status: offen` (nicht eingetragen, wie q772).
- **`rules.nest`:**
  - `counts` [1; 3; [1, 5]] → [1; [1, 3]; [0, 2]].
  - `size_factor` [0,3, 0,6], `stufen` 3.
  - `sizes` 0,62/0,38 → 0,6/0,36: Faktor 0,6 am oberen Rand der Spanne, damit sich das gewohnte Bild kaum ändert.
- **Sicherung:** `N40/lib/kfb_place.r1.vor_q772.json`. Die N40-Datei ist ersetzt; nur `rules`, `embed` und `note_q772` sind geändert.
- **slim:** `spiel/kfb_place.r1.slim.json`. Ausgangsdatei ist die Spiel-Fassung vom Stamm @b3da382e; nur `rules`, `embed` und `_vendor.nachtrag_q772` sind geändert, die Formatierung (kompakt) bleibt.
  - Die slim-Datei stammt laut `_vendor` aus der CANON_3D-Kopie, die in `rules`, `biomes` und `tiles` von N40 abweicht. Darum habe ich slim gezielt gepatcht statt neu erzeugt.
  - **Bitte:** Die CANON_3D-Kopie zieht WS0 nach, falls die slim-Datei je neu erzeugt wird; sonst gingen q772 dort verloren.

## Wer liest was (für den Einbau im Spiel)
- **`rules.nest.counts`:** bisher von keinem Code gelesen (weder Spiel noch Blender), das neue Format ist also gefahrlos.
- **`rules.nest.sizes`:** liest die Blender-Pipeline (`N40/lib/kfb_env.py` → `nest()`), das Spiel nicht. Die Fluff-Nester im Spiel nutzen eigene Zahlen (`grammar.js` GRAMMAR, `placeVeg.js` 0,62/0,38), unverändert.
- **`embed.uebergang`:** braucht neuen Lesecode in `src/world/dioramen/steinbaender.js`. Der Leser kennt bisher nur `PLACE.bands` und lässt die Schauseite ±0,35 rad frei.
  - Vorschlag zum Übernehmen: `spiel/steinbaender.vorschlag_q772.js`. Das ist das heutige `steinbaender.js` plus ein Block „q772: Übergang“ für Ausreißer, Tor-Seitenhaufen mit Nestern nach `rules.nest` und den Kranz.
  - Im Vorschlag stehen die neuen Werte zur Prüfung als Konstante; im Einbau `PLACE.embed.uebergang` und `PLACE.rules.nest` lesen.
- **Schalter:**
  - Kranz je Bauteil braucht ein Feld im Diorama-Katalog `src/data/worlds/kfb-dioramen.r1.json`, z. B. `"kranz": true` je Eintrag (im Vorschlag zum Prüfen über `?kranz=1` auf der Prüfseite).
  - Ausreißer und Tor gelten für alle Dioramen mit `schauseite`. Falls WS0 sie erst prüfen will, eignet sich ein Schalter wie `uebergang=q772`.
- **Andere Leser der slim-Datei** (`biomeTerrain.js`, `ImpactDebris.jsx`, `oasis.js`, `placeVeg.js`, `placeWorker.js`, `pruefe-kaskade.mjs`, `test/unit/placeField.mjs`): betroffen sind nur die geänderten Teile `rules.nest`/`embed`, und die lesen sie nicht. Kein Einfluss erwartet; geprüft habe ich das nur per Suche, nicht mit Tests.

## Beleg vorher/nachher
- **Ort:** Diorama-Prüfseite `dioramen-reference.html` mit festen Kameras front/side (V-1543). `belegMotiv` arbeitet nur in der Spielwelt; Dioramen erscheinen dort nur an seltenen Plätzen.
- **Dioramen:** `portal_ruin_a` (Portal, Schauseite +z) und `verdant_ruins`, Biom 0. Der neue Leser kommt nur per Routing dazu; keine Spieldatei ist geändert.
- **Ergebnis (`belege/daten.json`):**
  - W kommt bei beiden auf 1,6 m (Obergrenze; die Füße sind groß).
  - `portal_ruin_a`: 180 → 211 Steine (10 Ausreißer, 21 Tor-Steine).
  - `verdant_ruins`: 151 → 173 (1 Ausreißer, weil die Regel nur hangabwärts zulässt, 21 Tor-Steine).
  - Mit Kranz kommen je 34–35 Steine dazu.
- **Gesehen** (`belege/vergleich_*.jpg`): Am Portal liegen jetzt Seitenhaufen links und rechts der Treppe, das Vorfeld bleibt frei, einzelne Ausreißer liegen davor.
- **Kranz** (`belege/kranz_*.jpg`): Er versinkt bei diesen großen Dioramen weitgehend in der Einbettungs-Düne und ist kaum zu sehen.
  - Für den Einbau: Kranz an den Rand der Düne setzen (Fuß + Dünenauslauf), nicht an den Modellfuß, oder W je Diorama aus dem Katalog nehmen.

## Dateien
- `kfb_place.r1.q772.json`: neue N40-Fassung (identisch mit `N40/lib/kfb_place.r1.json`).
- `spiel/kfb_place.r1.slim.json`, `spiel/steinbaender.vorschlag_q772.js`.
- `kfb_place_q772_patch.py`: der Patch, wiederholbar für beide Fassungen.
- `scripts/_wsb-dio-beleg.mjs`, `belege/`.
