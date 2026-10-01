# START HERE · WSA · KFB Skydome + Environment · Session Cut SKY3 (2026-10-01 r1)

**Clay style SSOT:** read `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md` and `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` before editing geometry, materials, palettes, deformation, shadows or contact. Do not invent a replacement look.

Rückgabe an KFB Production Control / WSA. Claude Design hat nichts nach GitHub geschrieben, nichts promotet, keine Stage gebaut. Alles hier ist **Kandidat**.

## 1 · Was ist das

Ein Himmels-Modul für Hex-Kosmos/World: **ein** `EnvironmentHost` (Renderer, Scene, Uhr, Nebel, Licht-Rig, Tageszeit, Wetter, genau eine aktive Himmelsschale) mit
- drei Schalen: TinySkies-Verlauf · Travel-Skydome (prozedural + statisch) · **Card-Spindle** (Kartenmantel, auslaufende Trichter, End-Shader unten/oben),
- geteilten Ebenen: Tag/Abend/Nacht/Auto, Regen, Aurora, God Rays, Lens Flare, Sterne,
- **Clay-Wolkenfamilie** aus dem Jarlan-Perez-Donor (13 Varianten, 6 Archetypen, Instancing, 3 LOD),
- optionaler **Planeten-Schicht** (Quaternius Ultimate Space Kit, 11 Planeten, Original oder Knete).

## 2 · Öffnen

Einstieg: `KFB Skydome Gates SKY3.dc.html` über einen lokalen HTTP-Server aus dem Wurzelordner dieses Cuts (`npx serve .` o. ä.; `file://` geht wegen ES-Modulen nicht).
Three.js r184 kommt per Importmap von unpkg. Assets kommen von GitHub (siehe §5). Optional vorher `tools/fetch-assets.sh` — dann laufen Donor, Planeten und Fingerabdrücke lokal.

Gates: **E0** Donor | Knete · **E1** Travel · **E2** Spindel · **E3** Familie (+ Lebenszyklus, Leak, Feldmessung) · **Planeten**.
Kopfleiste rechts: Paletten (Stimmung, Wolken, Planeten, Spindel-Enden, Palette, Saat) · Messwerte · Details · Nur Ansicht (Escape). Alles standardmäßig aus.

## 3 · Stand je Teil (ehrlich)

| Teil | Status | Beleg |
|---|---|---|
| EnvironmentHost (ein Besitzer) | lauffähig, Leak ×10 Δ 0 | E3 Knöpfe, `docs/MODULE.md` §2 |
| Clay-Wolken v3 | **TUNE** — kein Wolken-Golden-Sample; Form über eigenes Abstandsfeld statt K1-Vorstufe, Material v10 ohne Nachweis gegen v8 | `evidence/sky3-e3-familie-13.jpg` |
| Card-Spindle 0.3 | Georg 01.10. »top!«; Deckungsprobe 360/0/0 | `evidence/sky3-e2-*`, `sky3-ende-*` |
| Planeten | lauffähig, Platzierung = Setzung | `evidence/sky2-planeten-gate-p.jpg` |
| E4 HX1-Integration | läuft im Projekt mit **v1**-Modulen, nicht auf v3 gehoben | `reference/e4-hx1/README.md` |
| SKY2-Polkappen | **FAIL** (Georg), nur noch als Historie | `evidence/FAIL-sky2-polkappe-oben.jpg` |

## 4 · Für die Integration (Receiving Owner)

1. Host: `lab-sky/env-host.v3.js` → `createEnvironmentHost({ renderer, scene, camera, lights?, radius, getClayU? })`. Der Wirt ruft `update(dt)` aus **seiner einen** Schleife und `after()` nach dem Hauptbild. Kein zweiter Timer, kein zweiter Fog-Schreiber.
2. Licht: eigenes Rig über `lights` übergeben (Adapter), sonst baut der Host `buildLightRig`.
3. Wolken: `lab-sky/cloud-family.v3.js` → `loadDonor` · `buildFamily` · `makeClayBase` · `makeCloudMaterial` · `createCloudField` · `scatterClouds`. Feld-Update je Bild mit der Kamera.
4. Spindel-Enden: `host.setSpindleEnds({ unten, oben, palUnten, palOben, seed })`.
5. Planeten: `host.setPlanets('off' | 'original' | 'clay', 3 | 6 | [ids])`.
6. HX1 hängt heute an `env-host.v1` / `cloud-family.v1` (`reference/e4-hx1/lab-hex/hex-island.v5.js`, Zeilen 36–37). Umstieg = zwei Importe + `setSpindleEnds`/`setPlanets` in die UI; der Host-Vertrag ist abwärtskompatibel.

## 5 · Assets — nur über GitHub, nicht im ZIP

Siehe `ASSETS.json`. Der Code lädt zuerst die Projektkopie, dann **RAW @main** von `georg-doc/kayfabizarro`, und prüft den Jarlan-Donor per Git-Blob-SHA. Ausnahme Fingerabdruck-Textur: lädt nur lokal (`ref/clay-joebinns/`), sonst laufen die Wolken ohne Abdrücke — `tools/fetch-assets.sh` holt sie.

## 6 · Offen / NOT_TESTED

- Wolken teurer als v1 (24 gemischt 7,2 ms gegen 6,3 ms; alle near 19,0 gegen 15,0 ms, Vorschau). Der 77-ms-Befund aus HX1 ist mit v3 nicht neu gemessen.
- Wolken nachts fast unsichtbar (Farbe aus `env.cloudColor`), Planeten-Knete schwach sichtbar.
- Sonne bewegt sich nicht (nur Farbe/Intensität), Day-Farben ≠ HX1-Stand, Nacht-Ambient gesetzt statt gemessen (`docs/RETURN_SKY1.md`).
- Nicht getestet: `sun-shadow`, `light-budget`, Georgs Gerät, Mobil.
- Kartenmotive kommen zur Laufzeit aus dem Deck-PDF (pdf.js CDN + `media/kfb/index.json`); offline → `SOURCE_REQUIRED`.

## 7 · Genau ein nächstes Gate

**WSA hebt HX1 Sky auf `env-host.v3` + `cloud-family.v3` und misst die 0/4/12/24-Reihe in der ganzen HX1-Szene neu (gleiche Kamera »Kosmos«).** Danach Georgs Bildabnahme der Wolken in der Szene; erst dann Golden-Antrag für die Familie »Clouds« in der Matrix.

## 8 · Lesereihenfolge in diesem Cut

`START_HERE.md` → `CHANGELOG.md` → `docs/MODULE.md` → `ASSETS.json` → `docs/RETURN_SKY1.md` (volle Messprotokolle SKY1–SKY3) → `MANIFEST.json` (Git-Blob je Datei).
