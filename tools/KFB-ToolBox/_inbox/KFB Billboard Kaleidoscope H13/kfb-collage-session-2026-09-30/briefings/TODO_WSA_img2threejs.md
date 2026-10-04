# TODO für WSA · img2threejs-Test (3D-Requisite aus dem freien Pool)

Stand 27.09.2026 · Auftraggeber Georg · Status: offen, nicht dringend

## Worum es geht

`img2threejs` (github.com/img2threejs/img2threejs, Apache 2.0) ist ein Skill für Claude Code,
Codex oder OpenCode. Aus einem Referenzbild baut der Agent das Objekt schrittweise als
prozeduralen Three.js-Code nach (TypeScript-Factory → `THREE.Group`, mit Pivots, Sockets
und Collidern). Mesh-Dateien entstehen dabei nicht. Nach jedem Durchlauf wird das Bild mit
dem Render verglichen.

Für KFB interessant als **Requisiten aus alten Stichen**: Alchemie-Apparate, da-Vinci-Maschinen,
Astrolabien, Globen, Instrumente. Das Ergebnis ist Code, passt also zu „keine Asset-Kopien“.

## Aufgabe

1. Skill lokal einrichten (`git clone https://github.com/img2threejs/img2threejs.git ~/.claude/skills/img2threejs`).
   Nur der Kern, **kein** `plugin-img2glb` (schickt Bilder an einen gehosteten Dienst) und
   keine Domain-Plugins.
2. Ein Objekt aus `media/public_domain/` wählen, Vorschläge in dieser Reihenfolge:
   - Destillierofen / Athanor aus einem Alchemie-Stich
   - Astrolabium (Met oder AIC, Foto statt Stich, einfacher)
   - Maschine aus einem da-Vinci-Codex-Blatt
3. Lauf mit `--strict-quality`, Prompt „Driving it harder“ aus dem README, zusätzlich:
   `Runtime: expose pivots for moving parts and a userData.tick idle loop.`
4. Ablage (Vorschlag, Georg entscheidet):
   `media/public_domain/3d/<objekt-id>/create<Name>Model.ts`
   `media/public_domain/3d/<objekt-id>/spec.json`
   `media/public_domain/3d/<objekt-id>/comparison.png` (letztes Vergleichsblatt)
   `media/public_domain/3d/<objekt-id>/NOTICE` (Apache-2.0-Hinweis img2threejs, Quelle des Referenzbilds)
5. Referenzbild bleibt, wo es ist. Die `.license.json` des Bildes wird im NOTICE referenziert.

## Grenzen

- Nicht für KFB-Figuren (FrizzleBob, Carl, Residents). Deren Rigs haben feste Quellen,
  eigene Nachbauten sind ausgeschlossen (CLAUDE.md Regel 4).
- Die Rückseite wird geschätzt. Das Werkzeug markiert das als geringe Konfidenz, so übernehmen.
- Keine Gebäude oder Räume (steht erst auf der Roadmap von img2threejs).
- Abbruch statt Endlosschleife: Nach drei gescheiterten Durchläufen im selben Schritt stoppen
  und das Vergleichsblatt berichten.

## Fertig, wenn

- Die Factory rendert im Browser ohne Fehler; Maße der Bounding-Box im Bericht.
- Das Vergleichsblatt liegt bei, Konfidenz je Bereich ist genannt.
- Claude Design bekommt den Pfad und hängt das Modell als 3D-Quelle ins Effekt-Labor.

## Bericht

`SOURCE | IMPLEMENTATION | TESTED RESULT | EXPORT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN`,
Commit-SHA, Tokenverbrauch grob. Nicht Gelaufenes heißt `NOT_TESTED`.
