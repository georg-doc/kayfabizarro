# Auftrag Blender MCP · EYE-CLEANUP-01 · Original-Augen entfernen, Eye-Rig-Anker setzen

**Von:** Resident Atlas (Claude Design) · **Für:** Coworker / Blender MCP · **Stand:** 2026-10-01 · candidate-only
**Repo:** `georg-doc/kayfabizarro` · Atlas-Owner `georg-doc-patch-3 @ dbcf0e38` · Mummy-Donor `main @ 9248211a831d20f5d6cc665af90a2b38759a4609`

## Warum

Der Atlas soll das Eye-Rig standardmäßig zeigen. Die Halterung steht schon: `lib/frizzlegraft/facehost.v1.js` hängt EyeRig und Mund an den Kopfknochen jeder Figur.

Es fehlt das saubere Entfernen der Original-Augen. Solange sie da sind, hat jede Figur vier Augen. Laut S38-Review steht bei allen vier geprüften Profilen `sourceEyeCleanupVisuallyAccepted: false`. Das ist der Engpass.

## Erste Charge (vier Figuren, je ein Fall)

| Figur | Datei (Repo-Pfad) | Commit | Augen vermutlich | Rig |
|---|---|---|---|---|
| Mummy_A | `media/3D_Assets/KayKit_Mystery_Series6/KayKit Mummy/characters/Mummy_A.glb` | `9248211a` | Insel: weiße Augen auf schwarzer Gesichtsfläche | Rig_Medium |
| Mummy_B | `media/3D_Assets/KayKit_Mystery_Series6/KayKit Mummy/characters/Mummy_B.glb` | `9248211a` | gemalt (Textur) | Rig_Medium |
| Orc Brute | `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb` | `891eadf0` | Insel (S38: 3 Kandidaten, Spiegelabweichung 0) | Rig_Large |
| Witch | `media/3D_Assets/KayKit_Mystery_Series6/5 - November 2024 - Witch/characters/Witch.glb` | `891eadf0` | offen, bitte bestimmen | Rig_Medium |

„Vermutlich“ heißt nicht gemessen. Schritt 1 ist die Klassifikation.

## Je Figur

1. **Klassifizieren:** `island` (eigene Mesh-Schale), `texture` (in die Atlas-Textur gemalt), `none` (Helm, Maske, Visier) oder `mixed`. Beleg: Name der Mesh-Insel bzw. UV-Rechteck mit Bildausschnitt.
2. **Entfernen:**
   - `island`: Die Augen-Schalen löschen, sonst nichts an der Geometrie anfassen. Gesicht, Mund und Brauen bleiben, wie sie sind.
   - `texture`: In einer **Kopie** der Textur nur die Augenflächen mit der gemessenen Hautfarbe übermalen. Die Farbe stammt aus dem Gesicht direkt neben dem Auge, als Median. Keine erfundene Farbe. Die Originaltextur bleibt unverändert.
3. **Anker setzen:** zwei Empties `eye_anchor.l` und `eye_anchor.r` als Kinder des Kopfknochens (`head`).
   - Position: Mitte des alten Auges auf der Oberfläche.
   - Lokal +Z: Flächennormale nach außen.
   - Scale: der Augenradius als Einheitswert.
   - Bitte keine Spiegelung erzwingen. Wenn die Augen asymmetrisch sitzen, gehört das in den Bericht.
4. **Exportieren** als `<Figur>_NoEyes.glb` neben die Originaldatei:
   - gleicher Skin, gleiche Bones (23), gleiche Bind-Pose, gleiche Material- und Mesh-Namen
   - Prüfung: Rig_Medium-Clips aus der geteilten Bibliothek binden genauso wie beim Original (Idle_A, Track-Anzahl vergleichen)

## Rückgabe

- `eye-cleanup-01.json`:
```json
{ "schema": "kfb.eye-cleanup/0.1-candidate",
  "figures": [ { "id": "mummy_a", "source": "<pfad>@<commit>", "out": "<pfad>_NoEyes.glb",
    "class": "island|texture|none|mixed", "removed": ["<mesh-insel>"] , "uvRect": null,
    "skin": "#rrggbb", "anchors": { "l": { "pos": [], "normal": [], "r": 0 }, "r": { } },
    "bones": 23, "bindCheck": "Idle_A 69/69", "notes": "" } ] }
```
- Je Figur zwei Bilder (frontal und ¾), jeweils vorher und nachher, ohne Eye-Rig. Abgenommen wird per Blick durch Georg, nicht per Prüfsatz.
- Ein kurzer `RETURN.md`: was ging, was nicht, und welche Figuren `none` sind.

## Nicht in diesem Auftrag

- Kein Eye-Rig bauen oder animieren. Das macht der Atlas über facehost.
- Keine Lidfarbe und keine `pairConfidence`-Werte (S38-Punkte 1 und 2). Die ergeben sich nach diesem Schritt aus den Ankern.
- Keine weiteren Figuren, bis die vier abgenommen sind.

## Danach im Atlas (zur Info)

- Rezeptfeld `eyes: { rig: 'default', source: '<Figur>_NoEyes.glb', anchors: 'eye_anchor.l/r' }`.
- Schalter Original / Eye-Rig im Inspektor, standardmäßig Eye-Rig. Figuren der Klasse `none` behalten ihre Original-Augen.
