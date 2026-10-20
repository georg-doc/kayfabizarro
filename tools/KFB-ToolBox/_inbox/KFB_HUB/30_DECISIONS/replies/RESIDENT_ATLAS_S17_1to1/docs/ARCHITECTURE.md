# ARCHITECTURE · KFB Resident Atlas S6

Eine Seite, drei Module, keine Build-Kette. Keine npm-Abhängigkeiten, kein Bundler, keine Transpilation.

```text
KFB_Resident_Atlas_S6.html      Einstiegspunkt: Import-Map (three 0.184 von unpkg), UI, Panels,
                                Resident-Auswahl, Motion-Audition, Ebenen-Schalter, Export-Knopf
  ├─ lib/atlas.js               Laden + Messen (loadAsset/measure/instance), Rig-Introspektion
  │                             (boneRig/findBone/bindReport), Vignetten-Bau (buildVignette),
  │                             Attachment-Mechaniken, prozedurale Clips (strumClip/reachChain),
  │                             Viewer + Kamera-Einpassung (makeViewer/frame), Ensemble (arrange/respace)
  ├─ lib/studio.js              Anfasser, Bone-Posing, Korrektursammlung, Enthüllungs-Zeitleiste
  └─ data/cast.js               21 Rezepte + ENSEMBLE + SOURCES. Reine Daten, keine Logik.
```

## Datenfluss

1. `data/cast.js` liefert ein Rezept: Aktor, Habitat, Signatur-Requisiten, jedes mit `a` (Repo-Pfad) und Platzierungsfeldern.
2. `buildVignette()` sortiert die Einträge nach Abhängigkeit (`on`, `hand.of`, `hold.of` zuerst auflösbar), lädt jeden Pfad über `loadAsset()`, instanziert per `SkeletonUtils.clone`, wendet Pose an, befestigt Requisiten, erdet.
3. Jeder Bau erzeugt `notes[]` (was gemessen wurde) und `open[]` (was offen bleibt). Beides landet in der Seitenleiste — die Prosa im Panel ist generiert, nicht getippt.
4. `measured` (Map: Repo-Pfad → Maße, Bones, Clips, Commit) ist der Messspeicher und wird beim Export mitgegeben.

## Asset-Auflösung — wichtig

```js
const raw = (commit, path) =>
  `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${commit}/${path.split('/').map(encodeURIComponent).join('/')}`;
```

`loadAsset()` liest **nie** den lokalen `media/`-Ordner. Ein 404 dort beweist nichts über die Verfügbarkeit eines Assets. Drei Pins in `PIN` plus ein `commit`-Feld pro Eintrag für Ausnahmen.

## Bekannte Architektur-Schulden

- `lib/atlas.js` trägt über 1200 Zeilen und fünf Aufgaben. Eine Trennung in `atlas-load` / `atlas-rig` / `atlas-build` / `atlas-motion` wäre sauber, berührt aber alle 21 Rezepte — eigene Scheibe, siehe `ATLAS_NEXT_SLICES.md`, Scheibe E.
- Die Attachment-Optionen sind über sieben Sprints gewachsen und überlappen teilweise. Vor einer Konsolidierung zählen, welche in den 21 Rezepten wirklich benutzt werden. Die Regel-Hierarchie muss erhalten bleiben: **Identität, dann Achsen-Zuordnung, dann Weltrichtung.**
- Prosa liegt in `data/cast.js`, also in einer `.js`-Datei. Ein Doku-Commit ist dort ein Code-Commit; zweimal in dieser Session hat eine eingefügte Notiz ein Array-Komma verschluckt und das Modul lahmgelegt. Eine Trennung von Rezept und Prosa wäre ein echter Gewinn.