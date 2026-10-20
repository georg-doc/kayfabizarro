# Eye-Rig als Default · Weg zum Entfernen der Original-Augen · Brief 01

**Stand:** 2026-10-01 · Atlas S16 · candidate-only · noch nicht gebaut

## Ausgangslage

- Ein Eye-Rig auf einer Figur kann man zeigen: `lib/frizzlegraft/facehost.v1.js` hängt EyeRig und PetMouth an den Kopfknochen jeder Figur.
- Es fehlt das Ausblenden der Original-Augen. Solange die sichtbar bleiben, hat jede Figur vier Augen. S38-Review: `sourceEyeCleanupVisuallyAccepted: false` bei allen vier Profilen.
- KayKit malt Augen auf zwei Arten:
  - **als eigene Mesh-Insel**: kleine Kappen, die auf dem Kopf sitzen (z. B. Mummy_A: weiße Augen auf schwarzer Fläche)
  - **direkt in die Textur**: flach gemalte Augen (z. B. Mummy_B)
- Bei Helm, Maske, Visier und Robotern gibt es kein Auge, das man ersetzen kann.

## Drei Wege im Vergleich

| Weg | Wie | Stärken | Grenzen |
|---|---|---|---|
| A · im Browser, Mesh-Insel | Zur Laufzeit die Dreiecke der Augen-Insel aus dem Index-Puffer nehmen | Kein neues Asset, jederzeit zurückschaltbar | Insel je Figur erkennen und abnehmen; geht nur bei Inseln |
| B · im Browser, Textur | Augenfläche in einer Kopie der Textur mit gemessener Hautfarbe übermalen | Geht auch bei gemalten Augen | UV-Bereich je Figur; bei Skins mit zwei Paletten doppelt |
| **C · Blender MCP** | Je Figur eine `*_NoEyes.glb`: Augen-Insel gelöscht oder Textur übermalt, dazu zwei Empties `eye_anchor.l/r` am Kopfknochen | Saubere Datei, die Anker liefern Sitz und Größe, im Atlas nur ein Dateitausch | Neue Assets; Pipeline-Lauf je Figur |

## Empfehlung

**Weg C als Standard, Weg A als Schnellprobe.**
- Blender kann die Augen einer Figur sehen, auswählen und löschen. Eine Abnahme per Blick (Georgs Regel) ist dort ein Bild je Figur.
- Die Anker-Empties ersetzen die drei offenen S38-Punkte: Lidfarbe, Paar-Sicherheit und Sitz.
- Der Atlas bekommt dann pro Rezept nur ein Feld, `eyes: { rig: 'default', source: '<Figur>_NoEyes.glb' }`, und schaltet beim Wechsel Original/Eye-Rig nur die Datei.

## Auftrag an Blender MCP (Vorschlag)

1. **Erste Charge**, je Figur ein Fall:
   - Mummy_A (Insel)
   - Mummy_B (Textur)
   - Orc Brute (Rig_Large, S38-Beleg)
   - Witch (Rig_Medium, Gesicht frei)
2. **Je Figur:**
   - Augen klassifizieren: Insel, Textur oder keine.
   - Augen entfernen bzw. übermalen. Die Hautfarbe dabei aus dem Gesicht messen, nicht raten.
   - `eye_anchor.l/r` setzen: Mitte des alten Auges, Normale nach außen, Radius als Scale.
   - Export als `<Figur>_NoEyes.glb` mit identischem Rig, gleichen 23 Bones und gleicher Bind-Pose.
3. **Rückgabe:**
   - `eye-cleanup-01.json`: Klasse, Anker, Hautfarbe und Bildbeleg je Figur
   - Vorher/Nachher-Render frontal und ¾

## Danach im Atlas (eigener Schritt)

- Eye-Rig standardmäßig an für alle Figuren mit `NoEyes`-Datei. Alle anderen behalten ihre Original-Augen und sind im Inspektor als „keine Option“ markiert.
- Schalter Original / Eye-Rig im Inspektor, exportierbar wie eine Pose (RIG_WERKSTATT §E5).
