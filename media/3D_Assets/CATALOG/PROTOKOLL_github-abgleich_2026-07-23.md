# Protokoll: GitHub-Abgleich Asset-Browser — 23.07.2026

Gemessen über einen Chrome-Durchgang durch das echte Repo (`georg-doc/kayfabizarro`,
`media/3D_Assets/`). Nichts behauptet, alles im GitHub-Baum gesehen. Begleit-Datei:
`github_status.json` (jetzt aus dieser Messung neu geschrieben).

## Kurzfassung

Dein Verdacht stimmt vollständig. Das Pirate-Pack **liegt auf GitHub**, nur unter dem Namen
`GLB_pirate/` statt `kenney_pirate-kit/`. Der Browser fand es nie, weil er auf den falschen Namen
geschaut hat. Und die alte Status-Datei war weit vom echten Stand weg: viele Packs, die sie „lokal"
nannte, liegen längst im Repo.

## Was wirklich auf GitHub liegt (Top-Level `media/3D_Assets/`)

Im Repo gesehen: `GLB_block_chars`, `GLB_blocky_chars`, `GLB_cube-pets`, `GLB_graveyard`,
`GLB_hexagon_kit`, `GLB_mini_arcade`, `GLB_mini_arena`, `GLB_mini_chars`, `GLB_mini_dungeon`,
`GLB_mini_market`, **`GLB_pirate`**, `GLB_platformer`, `Ultimate Monsters Bundle-glb`,
`kenney_fantasy-town-kit_2.0`, `kenney_graveyard-kit_5.0/…`, `kenney_nature-kit/…`,
`kenney_survival-kit/…`, dazu `GLB format/`, `Textures/`, `Sounds/`, `Audio/`, `build/`, die
Pet-Verträge und viele lose `.glb` im Wurzelverzeichnis.

- **`GLB_pirate/` ist flach und komplett** (barrel, ship-pirate-large, palm-straight, tower-*, … ~70
  GLBs + `Textures/`). Funktionierende URL z. B.:
  `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/GLB_pirate/palm-straight.glb`
- Ein paar Kenney-Kits liegen **verschachtelt**: nature unter `Models/GLTF format/`, graveyard unter
  `Models/GLB format/`, survival unter `Models/`.
- **Nicht im Repo (23.07.):** `kenney_holiday-kit`, `kenney_city-kit-*` (commercial/industrial/suburban).
  Die standen früher als „unverified" — sie sind schlicht (noch) nicht hochgeladen.

## Der eigentliche Fehler (tiefer als die Status-Datei)

Der Browser holt live den echten GitHub-Baum und färbt eine Kachel nur dann grün, wenn der
**Katalog-Pfad exakt** im Baum vorkommt (`LIVE.has(a.path)`, in `asset-browser.html` um Zeile 256).
Der Katalog-Pfad ist aber der **lokale** Name (`kenney_pirate-kit/…`), auf GitHub heißt es
`GLB_pirate/…`. Die beiden matchen nie → grau, obwohl die Datei da ist. Genau dein „kein
Eins-zu-eins".

Folge: Die Status-Datei zu korrigieren macht die Kacheln **im Offline-Fallback** grün, aber sobald der
Live-Abruf klappt, überschreibt er den Fallback und es wird wieder grau. Und selbst der grüne Fallback
baut kaputte GitHub-Links, weil die Link-Funktionen denselben lokalen Pfad nehmen. Die Status-Datei
allein reicht also nicht.

## Der saubere Fix (deine Zwei-Spuren-Idee, konkret)

Jedes Asset bekommt neben `path` (lokal) einen `ghPath` (echter GitHub-Pfad). Dann:

1. Grün-Prüfung gegen `ghPath` statt `path`: `LIVE.has(a.ghPath)`.
2. GitHub-Link und raw-URL aus `ghPath` bauen, lokalen Link weiter aus `path`. Zwei Spuren, kein
   geteilter Pfad-Zwang.
3. `ghPath` entsteht aus einer **Pack-Präfix-Zuordnung** (in `github_status.json` unter `naming_map`
   angelegt, aus Messung): z. B. `kenney_pirate-kit/*` → `GLB_pirate/<basename>`, `kenney_nature-kit/*`
   → `kenney_nature-kit/Models/GLTF format/<basename>`. Präfix + Dateiname = fertiger GitHub-Pfad.

Das ist ein kleiner, klar umrissener Eingriff in `asset-browser.html` (die Funktion `gitState` plus die
Link-Bauer `ghBlobURL`/`RAW`) plus die Präfix-Tabelle. Kein Umbau des Katalogs nötig.

## Nebenbefund: doppelte Namenswelten

Der Katalog führt manche Packs doppelt (`GLB_mini_arcade` **und** `kenney_mini-arcade`, `GLB_cube-pets`
**und** `kenney_cube-pets_1.0`, `GLB_hexagon_kit` **und** `kenney_hexagon-kit`). Auf GitHub existiert
jeweils nur die `GLB_*`-Fassung. Beim Aufräumen einmal pro echtem Pack einen kanonischen Namen wählen,
sonst zählt der Browser dasselbe Pack doppelt.

## Eingebaut und verifiziert (23.07.)

Der Zwei-Spuren-Fix ist in `asset-browser.html` drin: `GH_PACKMAP` + `ghPathOf(a)`; die Grün-Prüfung
läuft jetzt über `LIVE.has(ghPathOf(a))`, der GitHub-Link über `ghBlobURL(ghPathOf(a))`. Lokale Links
bleiben am lokalen Pfad. JSON und JS geprüft (valide, sauber).

**Voller Mengen-Abgleich am Repo-Baum (nicht behauptet):**
- **Pirate exakt bestätigt:** `kenney_pirate-kit` = 72 Dateien, GitHub `GLB_pirate/` = 72, **Namen 1:1
  identisch**. Pirate wird jetzt komplett grün. Das war der eine, der ganz grau war (kein `GLB_`-Zwilling).
- Voll gemappt (Anzahl passt): cube-pets 24, hexagon 72, mini-characters 26, blocky-characters 18.
- Schon grün ohne Map (Katalog-Pfad = GitHub-Pfad): nature, graveyard-kit, survival-kit, fantasy-town
  (alle `Models/…` deckungsgleich), plus die flachen `GLB_*`-Packs und die losen GLBs.

**Wichtige Korrektur aus der Messung:** `mini-arcade/arena/dungeon/market` und `platformer-kit` habe ich
**bewusst nicht gemappt**. Auf GitHub liegt davon nur eine kleine Character-Teilmenge (2/1/2/1/5), nicht
das volle Kit (20/22/25/20/153). Diese vollen Kits bleiben korrekt lokal; die kleinen `GLB_*`-Auszüge
sind für sich grün.

## Rest-Punkt (nicht dringend)

- `GLB format/` = flaches Mittelalter-/Hex-Kit (85 GLBs), keinem Katalog-Pack sauber zugeordnet.
  Identität vs. `GLB_hexagon_kit` klären und benennen, wenn du es im Browser sehen willst.

## Verifikations-Grenze

Der Browser läuft im Sandbox-Rahmen nicht live (lokaler Katalog + Live-Tree). Bestätigt ist die Logik am
echten Repo-Baum (Dateinamen + Anzahl). Der finale Blick „ist Pirate grün" gehört dir beim Öffnen.
