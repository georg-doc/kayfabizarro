# Snap- und Editor-Vertrag 01 · S12 · CD-RES-01

Eine Seite. Gilt für den Resident Atlas ab S12 und für jede Bühne, die `lib/edit-layer.js` einbaut.

## 1 · Ein Edit-Owner

Bearbeitet wird ausschließlich über das Menü am Objekt (`#objmenu`). Es enthält alles, was eine Geste ist:

| Feld | Taste | Wirkung |
|---|---|---|
| ✥ ⟳ ⤢ | G R S | Verschieben, Drehen, Skalieren am EINEN TransformControls |
| W / L | – | Welt- oder Lokalachsen |
| ⌗ | – | Raster an/aus (unabhängig vom Snap-Modus) |
| ▦ ⊶ ⚓ | – | Snap-Modus: Raster · Anschluss · Halterung, genau einer aktiv |
| ⬓ | – | Absetzen = gemeinsamer Grounding-Schritt (`lib/grounding.js ground`) |
| ◎ | F | Fokus |
| ↶ ↷ | Strg+Z / Strg+Shift+Z | Rückgängig, Wiederholen |
| ⓘ | – | öffnet Details auf „Auswahl" |
| ✕ | Esc | Auswahl schließen |

Zahlenwerte (Rasterweite, Winkel, Toleranzen, Mount-Offset, Pfad, Maße) stehen nur im Inspektor „Details", Standard zu. Keine zweite Palette, kein Objektfenster über der Szene.

## 2 · Snap-Modi (`lib/snap.js`)

- **grid · Raster.** Schritt 0,05 (Figurenmaß, nicht Raummodul), Winkel 15°, Skalierung 0,05. Wirkt während des Ziehens.
- **connector · Anschluss.** Beim Loslassen rastet ein Anschlusspunkt der Auswahl auf den nächsten passenden Punkt eines anderen Objekts, wenn er näher als `tol` (0,35) liegt. Nur x/z, die Höhe regelt das Grounding.
  - Kachel (Höhe < 0,35 × kürzere Seite): vier Kantenmitten W/O/N/S, gepaart W↔O und N↔S.
  - Lang (eine Seite > 2,5 × die andere: Zaun, Pfeilerreihe, Weg): zwei Enden, Ende↔Ende.
  - Alles andere hat keine Anschlüsse und meldet das.
- **mount · Halterung.** Beim Loslassen hängt eine Requisite an die nächste `handslot`-Bone, wenn ihre Mitte näher als `tolMount` (0,55) liegt, mit `mountOffset` im Bone-Raum. Wegziehen über die Toleranz hinaus hängt sie an den alten Elternknoten zurück. Figuren hängen nie an Händen. Eine montierte Requisite wird vom Absetzen abgewiesen (`attachedTo`).

Der Kopf-Aufsatz (headgraft) bleibt ein eigener Mechanismus und ist nicht Teil dieses Vertrags.

## 3 · Schnittstelle

```js
const SNAP = makeSnap(EDIT, V, { getRoot, onSnap(result, node) {} });
SNAP.setMode('grid' | 'connector' | 'mount');  SNAP.setGrid(bool);
SNAP.set('step' | 'angle' | 'tol' | 'tolMount', n);  SNAP.set('mountOffset', [x, y, z]);
SNAP.state  // { mode, grid, step, angle, tol, tolMount, mountOffset, last }
SNAP.connectorsOf(node)  // [{ p, k, flat }]
```

`onSnap` bekommt `{ mode, to, edge, moved }` bzw. `{ mode, bone, dist, offset }` oder `{ refused }`. Jede Änderung läuft über dieselbe Sammelstelle wie der Anfasser (`recordNodes`), also auch über Undo.

## 4 · Offen

- Anschluss für Kachel ↔ Zaun (Zaun steht auf der Kachelkante) ist nicht definiert; heute paaren nur gleiche Klassen.
- Halterung kennt nur `handslot`. Rücken-/Gürtel-Slots (Köcher) brauchen eigene Namen im Rig.
- Die Toleranzen sind gesetzt, nicht gemessen.
