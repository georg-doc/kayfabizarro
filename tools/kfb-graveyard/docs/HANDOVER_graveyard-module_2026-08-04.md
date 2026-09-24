# HANDOVER — Graveyard-Zonen-Modul · 2026-08-04

Für den Coworker und für den nächsten Claude-Design-Chat, der diese Zone in ein anderes
Projekt hebt oder daran weiterbaut. Einstieg ist die `README.md` daneben (API, Optionen,
Datenschema). Dieses Dokument ist das, was **nicht** in die API passt.

---

## 1 Was passiert ist

`Graveyard_Slice1.html` (Slice 1–4a, ein Vollbild-Build) ist in ein **Modul** zerlegt worden:

- **`kfb-graveyard.js`** — dieselbe Zone, aber instanzierbar: rendert in ein Mount-Element,
  alle DOM-ids `kfbgy-`-namespaced, CSS einmal injiziert und über `.kfbgy-root` gescopt,
  jeder Listener registriert und in `dispose()` abgeräumt, `ResizeObserver` statt
  `window.innerWidth`, kein `window.__qa`-Leak (nur optional per `debugGlobal`).
- **`kfb-assets.js`** — jede Asset-Adresse an einer Stelle, RAW-only, mit `setRef()` zum Pinnen
  und `setCacheBust()` gegen den CDN-Cache.
- **Minigame-Oberfläche** — `onHover` / `onSelect` / `onVisit` / `onTick` raus,
  `enter` / `pause` / `resume` / `guideTo` / `focusGrave` / `progress` / `setLightMode` rein.
  Die Spielregel liegt beim Host, nicht in der Zone.
- **`Graveyard_Minigame.html`** — kleinstes ehrliches Beispiel: Auftrag „alle Lehren einsammeln",
  Fortschrittsleiste aus `onVisit`, Disco als Belohnung bei `progress().done`.
- **`KFB_Graveyard_Standalone.html`** — derselbe Host, alles inline gebündelt.

Die Zonen-Physik, die Steinsetzung, die Blasen, das Kerzenflackern, der Guide-Lauf sind
**unverändert** übernommen. Das war Absicht: der Umbau sollte tragen, nicht neu erfinden.

## 2 Re-Home in ein anderes Projekt

1. Ordner-Inhalt (6 Code-/Datendateien) in das Zielprojekt legen. Struktur ist flach,
   `docs/` bleibt Unterordner.
2. Importmap für three 0.160 im Host-Dokument (siehe README §1). **Ein** three-Build pro Seite —
   zwei Kopien geben stille Instanceof-Fehler.
3. Assets **nicht** mitkopieren. Falls ein Pfad 404 liefert: `setCacheBust('2')`, dann prüfen.
4. Clean-Run nach README §6 fahren, in **Chrome und Firefox**. Erst dann weiterbauen.

**Was nicht mitkommt:** `qa/`- und `uploads/`-Bilder, alte `export/`-Stände, der
Cube-Academy-Zweig. Das ist Session-Material, kein Modul.

## 3 Vertragslage

| Datei | Rolle | Regel |
|---|---|---|
| `pet-LIBRARY.json` | Aussehen-Contract der Pets (v0.4.x) | Kanon per RAW; die lokale Kopie ist ein **unveränderter** Spiegel |
| `pet-library.v6.js` · `pet-eye-rig.v4.js` | Character + EyeRig | geteilt mit Editoren/Studio/nie-synapse — **nie als tot flaggen** |
| `postmortems.json` | Grab-Manifest (Schema `kfb-postmortem-graveyard/v1`) | Kanon liegt im Diary-Ordner; Push ins Repo ist offen |
| `kfb-assets.js` | Pfad-SSOT | neue Assets **nur hier** eintragen, nie inline im Modul |

Contract-Hygiene bei Änderung: `version` Patch hoch, `updated` = heute, `canonical` nie
verlieren, alle Spiegel synchron.

## 4 Fallstricke, die schon Zeit gekostet haben

1. **Höhen-Fit allein bläht Props auf.** Immer Höhe *und* Grundfläche deckeln (`SIZE_MAXW`).
   Mehrteilige Bauten (Krypta + Dach) sind handgesetzte Set-Pieces, nichts zum Streuen.
2. **Tone-Mapping ist Pflicht.** Warmes Licht auf der Kenney-Dreck-Colormap ohne ACES + sRGB
   brennt zu Neon-Hügeln aus; `envMapIntensity` bei 0.25 halten.
3. **Bloom-Disziplin.** Nur die Flammen sind „heiß" (`toneMapped:false`, Farbe > 1). Wer einen
   Stein aufhellt, bekommt einen glühenden Friedhof.
4. **EyeRig nicht verpassen.** `mods:['emotes']` + echtes `EyeRig` — **nie** `googly`, und die
   GLB-Colormap stehen lassen. Sonst flache Augen und ein gelb übertöntes Pet.
5. **Pointer-Lock kann abgelehnt werden** (Sandbox-iframe). Promise abfangen, Drag-Look ist der
   Fallback. `pointerLock:false` für Embeds.
6. **Ein leeres Werkzeug-Ergebnis ist kein Befund** — `.glb` erscheint in Repo-Listings gar
   nicht. Details in `docs/ASSET_PATHS.md` §4.

Muster hinter allen sechs: erst messen, dann behaupten. Die Runden, die etwas gebracht haben,
begannen mit einer Messung.

## 5 Offene Fäden

| Sache | Wer | Warum es hängt |
|---|---|---|
| `postmortems.json` ins Repo pushen | Coworker | dann läuft die Zone ohne mitgelieferte Daten |
| Rückfrage „Shift & touch = panning" | Georg | Shift+Rad schiebt heute; Zwei-Finger-Pan ist ungeklärt, nicht geraten |
| Revive-Mechanik (Krypta, Sarg, Schaufel, `character-zombie`) | Georg | Assets reserviert, keine Funktion — bewusst zurückgestellt |
| Licht-States als kleine State-Machine | offen | candle/disco stehen; Event-Trigger (revive/dig) Konzept |
| `character-keeper` als zweite Stimme | offen | zweite Erzählerrolle neben FrizzleBob |
| Zonen-Grenze als Übergang | offen | Tor führt heute nirgendwohin; Nachbarzone fehlt |

## 6 Wenn hier weitergebaut wird

Kleinste bootbare Scheibe, Pixel-Abnahme in Firefox **und** Chrome, dann die nächste. Das
Muster trägt seit Slice 1. Neue Props kommen aus `kfb-assets.js` (Namen gegen das Repo prüfen,
nicht raten — geraten heißt: die Hälfte existiert nicht). Lehren, die Zeit gekostet haben,
gehören ins `KENNEY_ASSET_PLAYBOOK.md` im Projekt-Root, nicht in einen Chat-Verlauf.
