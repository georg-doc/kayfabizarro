# HANDOVER — Asset-Index konsolidieren (`asset-repo.json` / `catalog.json`)

**Adressat:** ChatGPT (oder ein anderer Assistent) **ohne Zugriff auf das Repo.** Dieses Blatt ist
absichtlich vollständig: alle Zahlen, Pfade und Fallen stehen hier drin, damit die Arbeit ohne
Rückfragen beginnen kann. Georg gibt die Dateien dazu.

**Stand 2026-08-12.** Quelle der Zahlen: das Repo `georg-doc/kayfabizarro`, Unterbaum
`media/3D_Assets/`, im Browser nachgemessen (nicht behauptet) beim Bau von KFB Travel v16 / L3.

---

## 1. Warum es diese Aufgabe gibt

Es existieren **zwei Indizes über dieselben Assets**, und keiner ist allein brauchbar:

| Datei | Ort | Inhalt | Problem |
|---|---|---|---|
| `catalog.json` | `media/3D_Assets/CATALOG/` im Repo, 1,29 MB | **2538 Assets, 33 Packs** laut Selbstauskunft. Felder: `name, pack, path, category, subcategory, size [w,h,d], footprint_xz, animations[], n_meshes, skinned`, dazu `scores` (ease/kfb/med) | `path` ist der **LOKALE** Pfad auf Georgs Rechner. Beschreibt also auch Assets, die **nicht im Repo liegen** — geschätzt rund 1550 davon. Zum Laden zur Laufzeit unbrauchbar. |
| `asset-repo.json` | **Projektwurzel** des Design-Projekts, 328 kB | **986 Assets, 17 Packs.** Felder: `id, name, pack, sub, role, size, fp, anim, naturalScale, ghUrl` | Die aufgelöste Teilmenge dessen, was **wirklich auf GitHub liegt**, mit fertiger RAW-URL. Aber: unklar, wie er erzeugt wurde, ob er komplett ist, und er hat die `scores` und `category` aus dem Katalog **nicht**. |

Dazu zwei Buchhaltungs-Dateien, die den Unterschied erklären und die man **lesen muss, bevor man
irgendetwas zusammenführt**:

- `CATALOG/github_status.json` — pflegt pro Pack einen Status: `github` · `github_nested` ·
  `github_renamed` · `local` · `local_partial_on_git` · `absent`. Enthält die entscheidende
  `naming_map` (lokaler Pack-Name → echter GitHub-Präfix).
- `CATALOG/PROTOKOLL_github-abgleich_2026-07-23.md` — das Protokoll der Messung vom 23.7., inkl.
  der Erklärung, warum der Asset-Browser Kacheln fälschlich grau färbte.

**Ziel der Konsolidierung:** **EIN** Index, der beides kann — die Reichhaltigkeit des Katalogs
(Kategorien, Scores, Maße) und die Ladbarkeit von `asset-repo.json` (verifizierte `ghUrl`) — plus
eine ehrliche Liste dessen, was nur lokal existiert.

---

## 2. Die sechs Fallen (alle einzeln verifiziert)

**(1) ⚠ Ein Ordner namens „GLTF format" enthält `.glb`-Dateien.**
Im Browser gemessen:

```
.../kenney_nature-kit/Models/GLTF format/tree_default.glb   → 200, 9 428 Bytes
.../kenney_nature-kit/Models/GLB  format/tree_default.glb   → 404
.../kenney_nature-kit/Models/GLTF format/tree_default.gltf  → 404
```

Wer die Endung aus dem Ordnernamen ableitet, baut 329 kaputte URLs.

**(2) ⚠ Packs liegen im Repo unter ANDEREM Namen.** Die verifizierte Zuordnung
(`github_status.json` → `naming_map.voll_gemappt_verifiziert`):

| Katalog-Pack | GitHub-Präfix | n |
|---|---|---|
| `kenney_pirate-kit` | `GLB_pirate/` | 72 (Namen 1:1) |
| `kenney_cube-pets_1.0` | `GLB_cube-pets/` | 24 |
| `kenney_hexagon-kit` | `GLB_hexagon_kit/` | 72 |
| `kenney_mini-characters` | `GLB_mini_chars/` | 26 |
| `kenney_blocky-characters_20` | `GLB_blocky_chars/` | 18 |

**(3) ⚠ Packs liegen verschachtelt.** Katalogpfad = GitHub-Pfad, aber mit Unterordner:

| Pack | Präfix im Repo |
|---|---|
| `kenney_nature-kit` | `kenney_nature-kit/Models/GLTF format/` |
| `kenney_graveyard-kit_5.0` | `kenney_graveyard-kit_5.0/Models/GLB format/` |
| `kenney_survival-kit` | `kenney_survival-kit/Models/` |
| `kenney_fantasy-town-kit_2.0` | `kenney_fantasy-town-kit_2.0/Models/GLB format/` |

**(4) ⚠ Doppelte Namenswelten — Gefahr der Doppelzählung.** Der Katalog führt manche Packs zweimal:
`GLB_mini_arcade` **und** `kenney_mini-arcade`, `GLB_cube-pets` **und** `kenney_cube-pets_1.0`,
`GLB_hexagon_kit` **und** `kenney_hexagon-kit`, `GLB_graveyard` **und** `kenney_graveyard-kit_5.0`.
Auf GitHub existiert jeweils **nur eine** Fassung. Ohne kanonischen Namen zählt jeder Report falsch.

**(5) ⚠ Nur eine Teilmenge auf GitHub — nicht mappen.** Volles Kit lokal, im Repo nur ein
Character-Auszug: `kenney_mini-arcade` (lokal 20 / Repo 2) · `mini-arena` (22 / 1) ·
`mini-dungeon` (25 / 2) · `mini-market` (20 / 1) · `kenney_platformer-kit` (**153 / 5**).
Diese dürfen **nicht** als „im Repo" gelten.

**(6) Der Katalog widerspricht sich selbst über seine eigene Größe.**
`README_catalog.md` sagt „**1825 Assets · 22 Packs**", `PACK_SUMMARY.md` sagt „**2776 Assets ·
42 Packs**", Georgs Angabe war 2538/33. Drei Zahlen für einen Katalog. Das ist kein Detail: es
heißt, dass mindestens zwei der drei Dateien aus verschiedenen Läufen stammen.

**Nicht im Repo (Stand 23.7.):** `kenney_holiday-kit`, `kenney_city-kit-commercial`,
`kenney_city-kit-industrial`, `kenney_city-kit-suburban`.
**Ungeklärt:** ein flacher Top-Level-Ordner `GLB format/` mit ~85 GLBs (Mittelalter/Hex-Terrain),
keinem Katalog-Pack zugeordnet. Identität gegen `GLB_hexagon_kit` klären.

---

## 3. Was gebraucht wird — Zielformat

Eine Datei `asset-index.v2.json`. **Ein Datensatz pro ECHTEM Asset** (kanonisch, keine Dubletten):

```json
{
  "$schema": "kfb-asset-index/2",
  "version": "2.0.0",
  "updated": "2026-08-__",
  "rawBase": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/",
  "counts": { "assets": 0, "onGithub": 0, "localOnly": 0, "packs": 0 },
  "packs": [
    { "canonical": "kenney_nature-kit", "aliases": ["GLB_nature"], "ghPrefix": "kenney_nature-kit/Models/GLTF format/",
      "n": 329, "onGithub": 329, "category": "nature", "status": "github_nested" }
  ],
  "assets": [
    { "id": "kenney_nature-kit/tree_default",
      "name": "tree_default",
      "pack": "kenney_nature-kit",
      "category": "nature", "sub": "nature", "role": "scatter",
      "size": [0.755, 1.708, 0.654],
      "fp": [0.755, 0.654],
      "anim": false, "nMeshes": 2, "skinned": false,
      "scores": { "ease": 0, "kfb": 0, "med": 0 },
      "ghUrl": "https://raw.githubusercontent.com/.../kenney_nature-kit/Models/GLTF%20format/tree_default.glb",
      "localPath": "kenney_nature-kit/Models/GLTF format/tree_default.glb",
      "onGithub": true, "verified": "2026-08-__"
    }
  ],
  "localOnly": [ { "name": "...", "pack": "...", "why": "pack status local" } ],
  "unresolved": [ { "name": "...", "pack": "...", "why": "GLB format/ nicht zugeordnet" } ]
}
```

**Harte Regeln für die Erzeugung:**

1. **`ghUrl` nur setzen, wenn der Pack-Status ihn erlaubt** (`github`, `github_nested`,
   `github_renamed`). Bei `local`, `absent`, `local_partial_on_git` → `onGithub: false`, `ghUrl: null`,
   Eintrag zusätzlich in `localOnly`. **Niemals eine URL raten.**
2. **URL-Kodierung:** Ordner- und Dateinamen können Leerzeichen enthalten (`GLTF format`,
   `KayKit_Dungeon_Pack_1.1_FREE 2`). Jedes Pfadsegment einzeln mit `encodeURIComponent`,
   nicht der ganze Pfad mit `encodeURI` — sonst bleiben `#` und `?` in Namen stehen.
3. **Kanonischer Pack-Name = der Katalog-Name** (`kenney_pirate-kit`), der `GLB_*`-Name wird
   **Alias**. Begründung: der Katalog trägt die Metadaten, und ein Alias ist billiger als ein
   zweiter Datensatz.
4. **Endung nie aus dem Ordnernamen ableiten** (Falle 1). Sie gehört zum Dateinamen.
5. **`scores` und `category` aus `catalog.json` übernehmen**, `ghUrl`/`role`/`naturalScale` aus
   `asset-repo.json`, wenn dort vorhanden. Bei Konflikt: **Maße aus `catalog.json`**
   (dort ist die Herkunft dokumentiert: World-Space-AABB mit angewandten Node-Transforms).
6. **Zählung am Ende gegen die Wirklichkeit prüfen**, nicht gegen eine README: `counts` muss aus
   dem erzeugten Array kommen. Falle 6 ist genau dadurch entstanden.

---

## 4. Verifikation — der Schritt, ohne den es wieder auseinanderläuft

Ein Index, dessen URLs niemand abgerufen hat, ist eine Behauptung. Deshalb gehört zur Lieferung ein
kleines Prüfskript (Node oder Browser), das **jede** `ghUrl` mit `HEAD` (oder `GET` mit
`Range: bytes=0-0`) abfragt und schreibt:

- `verified` = ISO-Datum bei Status 200,
- `onGithub: false` + Eintrag in `unresolved` bei 404,
- einen Bericht `INDEX_VERIFY_<datum>.md`: **n geprüft, n × 200, n × 404**, Liste der 404 mit Pfad.

Bei ~986 URLs ist das ein Lauf von wenigen Minuten mit Drosselung (z. B. 8 gleichzeitig).
**raw.githubusercontent.com** liefert `access-control-allow-origin: *`, das läuft also auch im
Browser.

**Stichprobe, die schon geprüft ist** (muss im Bericht 200 sein, sonst ist etwas kaputt):
`kenney_nature-kit/Models/GLTF format/tree_default.glb` · `GLB_pirate/palm-straight.glb`.

---

## 5. Was der Index NICHT werden soll

- **Kein Ersatz für `catalog.json`.** Der bleibt die Quelle über Georgs lokalen Bestand, inklusive
  der Packs, die nie hochgeladen werden (Lizenz, Größe). Der neue Index ist die **Laufzeit-Wahrheit**.
- **Keine kopierten Assets.** Nichts wird in Projekte kopiert; alles läuft über RAW-URL. Der Katalog
  allein ist 1,29 MB, die GLBs sind ein Vielfaches.
- **Keine erratenen Ergänzungen.** Fehlt eine Information (Score, Kategorie), bleibt das Feld leer.
  Ein geratener Wert ist schlimmer als ein leerer, weil er nicht mehr als Lücke erkennbar ist.

---

## 6. Woran der Erfolg gemessen wird

1. `asset-index.v2.json` enthält **jedes** Asset genau einmal (keine Dublette aus Falle 4).
2. **Jede** `ghUrl` ist mit 200 verifiziert, mit Datum im Datensatz.
3. `localOnly` erklärt für jeden Eintrag, **warum** (Pack-Status), nicht nur *dass*.
4. `counts` stimmt mit `assets.length` und den Statusfeldern überein — nachrechenbar.
5. Ein Verbraucher kann `name` → `ghUrl` in einem Schritt auflösen, ohne die `naming_map` zu kennen.
6. `INDEX_VERIFY_<datum>.md` liegt daneben und nennt die 404er beim Namen.

---

## 7. Wer den Index heute benutzt (nicht brechen)

| Verbraucher | Was er liest | Anspruch |
|---|---|---|
| `KFB Cartoon-Verbieger.dc.html` | `fetch('./asset-repo.json')`, dann `assets.find(name)` → `ghUrl \|\| rawBase + pack + '/' + name + '.glb'` | braucht `assets[]`, `name`, `pack`, `ghUrl`, `rawBase` |
| `terrain-v16/prop-scatter.js` (Travel v16 / L3) | dasselbe Muster, plus `fp`/`size` für die Skalierung | dito |

**Deshalb:** `asset-index.v2.json` **zusätzlich** anlegen und `asset-repo.json` erst ersetzen, wenn
beide Verbraucher umgestellt sind — oder v2 rückwärtskompatibel halten (`assets[]` mit `name`,
`pack`, `ghUrl`, dazu `rawBase` auf oberster Ebene). Die zweite Variante ist billiger und
wahrscheinlich richtig.

---

## 8. Übergabe an Georg

Liefere: `asset-index.v2.json` · `INDEX_VERIFY_<datum>.md` · das Prüfskript ·
und **eine halbe Seite** „was überraschend war" (Dubletten, 404er, Pack-Status-Korrekturen).
Der letzte Punkt ist der wertvollste: er sagt, ob `github_status.json` noch stimmt.
