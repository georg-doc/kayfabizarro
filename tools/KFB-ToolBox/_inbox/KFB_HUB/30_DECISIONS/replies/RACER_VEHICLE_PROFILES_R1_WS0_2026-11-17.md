# Für WS0 · Rennwagen und Dieselpunk am Hauptgame-Patch-Kern ·17.11.2026

Kandidat gebaut, nicht gemergt. Repository `georg-doc/KFB-Stunt-Car-Race`, Branch `racer/vehicle-profiles-r1`, Base `ccb7ac425c8aaa4a553ab498d991311272abdb25`, finaler Auslieferungs-HEAD **`85c59ebdd81cac15873e6851178841cc2c1619da`**.

[Entwurfs-PR134](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/134) · [Return](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/85c59ebdd81cac15873e6851178841cc2c1619da/docs/vehicle-profiles-r1/RETURN.md) · [HOST_CONTRACT](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/85c59ebdd81cac15873e6851178841cc2c1619da/docs/vehicle-profiles-r1/HOST_CONTRACT.md) · [Guard](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/85c59ebdd81cac15873e6851178841cc2c1619da/docs/vehicle-profiles-r1/GUARD.md).

## Profile und Anschluss

[Rennwagen-JSON](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/85c59ebdd81cac15873e6851178841cc2c1619da/src/data/vehicles/profiles/CAR_TYPE_RACE_CAR.json) · [Dieselpunk-JSON](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/85c59ebdd81cac15873e6851178841cc2c1619da/src/data/vehicles/profiles/CAR_TYPE_DIESELPUNK.json).

Prüfschalter `fahrprofil=r1`, vorhandenes `fahrphysik=patch1`; `racer=patch_vireo` oder `racer=crimson_flame_dragster`. Vireo ist das originale CC0-Modell mit vier echten beweglichen Radteilen und Originalmaps,1100kg. Crimson bleibt das vorhandene KFB-Modell im bestehenden Main-Look,1200kg. Profil liefert Unterschiede, vorhandener PatchCar/HF/ST bleibt alleiniger Fahrphysikbesitzer. Standard ohne Schalter wurde nicht umgestellt. Eine Welt, kein zusätzlicher Renderer oder Physikschritt.

`carRef.current.contacts()` liefert post-step Zustand+dt, aktuelle Collider/Hülle, Terrainabfrage, Query-Lesezugänge und unsubscribe/dispose. `toy`/`gummi` von Claude sind Requests ohne automatisch angewandten Verlust; keine vollendete Spielzeug-Bremsintegration behaupten. Native Möbel benutzen zentrale `gummiTabelle.r1.json`/GUMMI-Deduplikation. Figuren bleiben bei `autoPuppenTempo`; keine Doppelzählung. Tatsächliche gemeinsame Welt-Schwerkraft beim Bühnenlauf−9.81, nicht13.5.

## Tests und sichtbare Belege

- Vollständige unabhängige native Kalibrierung11/11PASS; nach Portierung erneut bytegleicher Report. Flag-off über600Schritte exakt gleiche Position und Geschwindigkeit wie Original-Base.
- Portable GitHub-Profiltests11/11PASS; keine privaten Modelle und keine historische Git-Verfügbarkeit erforderlich. Strenger lokaler Lauf mit gesperrten privaten Dateipfaden und ohneGit imPATH ebenfallsPASS.
- Vier echte Kampfbühnen-Anläufe: beide Wagen gegen Soldat und frisches/lebendes Würfelmonster; jeweils210Owner-Schritte, ein Wagenkörper, ModellOK, keine erfassten Laufzeitfehler. Soldat wird zur fliegenden/landenden Puppe; Monster geht aufLeben0. [Stage-Bericht und Bilder](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/85c59ebdd81cac15873e6851178841cc2c1619da/test/evidence/vehicle-profiles-r1).
- Hauptgame-Split-BuildPASS,4975Module/40.95s. Flags,Hostvertrag,vehicleRig undWhitespacePASS.
- [GitHub-CI44021852957](https://github.com/georg-doc/KFB-Stunt-Car-Race/actions/runs/44021852957) auf Quellen-/Teststand`104db1cae23fdeb643bbaca8cd248f1231fa3dfe`:153/154PASS, ProfiltestPASS. EinzigerFAIL `audioMixer:noAudioInRepo` ist identisch zur unveränderten Base ([44016704760](https://github.com/georg-doc/KFB-Stunt-Car-Race/actions/runs/44016704760)). Finaler85c-Commit ergänzt nur Return/Guard/CI-Doku und Ergebnis-JSON. Gesamt-CI bleibt rot; keine Ausnahme/Sperrenabschwächung.

## Nächstes Gate

**Vor Integration Spawn-/Terrainstream-Bereitschaft absichern.** Beim frühen Teleport/Ruf war der Terrain-Physikkörper noch nicht geladen, Vireo fiel durch. Nach Streamload und bestehendem `setKind`-Restart trugen alle4Räder, Bodenstrahl und Terrainhöhe stimmten auf1.6µm überein; anschließend bestanden die vier Anläufe. Kein Produktionsfix und keine Kaltstart-Abnahme behauptet. Die QA-Hilfe blockiert Anlauf ohne echten Bodenkontakt und setzt keine Ersatzfläche.

Den bestehenden Audio-CI-Konflikt beim Audio-Owner getrennt auflösen. Danach WS0-Review/Integrationsentscheidung. Keine automatische Übernahme, keine neue Site und keine Live-Promotion. Badewannenprofil, gemeinsame Boden-VFX und Straßenmodul-Integration bleiben Folgeslices. Für Georg ist weiter Chill & Fun/Fahrspaß maßgeblich; keine neue Handling-Schicht einführen.
