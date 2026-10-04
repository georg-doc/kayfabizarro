# Editor-Schicht · Standard für alle 3D-Werkzeuge der Toolbox

Stand: 2026-09-20, erste Fassung aus S21 (Raumstudie R02). Gilt ab sofort als Vorlage für
Residents, Plattformer-Bühnen, Venue-Generatoren und jede Detailplatzierung.

## Warum überhaupt

Die letzten Zentimeter kann die Hand schneller als die Rechnung. Rezept und Messung liefern die
Struktur — Raster, Wandflächen, Bodenkontakt, Kollisionsfreiheit. Wohin ein Stuhl gehört, damit
er *bewohnt* aussieht, ist keine Messung, sondern ein Urteil. Zehn Runden Nachrechnen ersetzen
keinen Griff.

## Die vier Regeln

1. **Das Rezept bleibt die Quelle.** Der Editor schreibt keine Datei. Er liefert einen
   Rezept-Ausschnitt zum Übernehmen. Sonst gibt es zwei Wahrheiten, und die zweite gewinnt immer
   beim nächsten Reload.
2. **Handarbeit überlebt den Reload**, aber nur als Ablage (localStorage), gebunden an Raum und
   Platzierungsindex. Ändert sich das Rezept, verfällt der Eintrag — sichtbar, nicht still.
3. **Das Werkzeug gehört ans Objekt.** Ein Menü in der Kopfzeile kostet bei jeder Korrektur den
   Weg dorthin; im Stream ist das der teuerste Teil der Arbeit.
4. **Zwei Reichweiten, nie mehr:** Einzelteil und Bedeutungsgruppe. Alles dazwischen ist
   Auswahlverwaltung, und die will niemand bedienen.

## Was steht (S21)

| Funktion | Bedienung |
|---|---|
| Editor an/aus | Knopf **Editor** in der Leiste |
| Auswahl | Klick ins Objekt |
| Verschieben / Drehen | Mini-Menü am Objekt (✥ / ⟳) oder Taste `g` / `r` |
| Absetzen | ⬓ — legt die Unterkante auf den Boden |
| Reichweite | ⛓ schaltet Einzelteil ⇄ Bedeutungsgruppe (Gruppe greift am Schwerpunkt an) |
| Raster | 0,1 Einheiten / 15° |
| Ergebnis | Leiste → **Editor · geänderte Positionen**, Kopierknopf, „Alles zurück" |

## Was als Nächstes kommt (Vertrag vor Code)

### E2 · Figuren posieren
- **Sitzen**: Clip-Auswahl aus den Charakter-Packs über ein Suchfeld; die Figur rastet auf der
  gemessenen Sitzfläche ein (dieselbe Mechanik wie „Absetzen", nur gegen die Oberfläche unter
  dem Becken statt gegen den Boden).
- **Greifen**: Ziel anklicken (Münze, Teller, Fleischkeule), die Hand folgt — als IK-Ziel am
  Handknochen, nicht als neue Animation.
- **Blick**: Kopf auf ein Ziel drehen. Vorbild ist `pet-eye-rig.v6.js` aus S18 — Augen sind dort
  schon ein Adapter, kein eigenes System.
- **Gate:** kein Posen ohne echten Clip aus einem registrierten Pack. Kein handgedrehtes Skelett.

### E3 · Was der Editor NICHT werden soll
- Kein Szenengraph-Baum mit Umbenennen, Gruppieren, Parenting. Dafür gibt es das Rezept.
- Kein Undo-Stack über Sitzungen. „Alles zurück" plus Ablage reicht.
- Keine Materialbearbeitung. Farbe kommt aus dem Pack.

## Kontextmenü-Standard (verbindlich für neue 3D-Werkzeuge)

Ein Menü, das AM OBJEKT erscheint, höchstens sechs Felder, jedes eine Geste — kein Untermenü,
keine Palette, kein Modus, den man sich merken muss.

```
              ┌─────────────────────────────┐
              │  ✥    ⟳    ⬓    ⛓    ✕     │   ← erscheint über der Auswahl,
              └─────────────────────────────┘      folgt ihr beim Drehen der Kamera
   ✥  verschieben   (g)     Pfeile in der Szene, Raster 0,1
   ⟳  drehen        (r)     Ring in der Szene, Raster 15°
   ⬓  absetzen              Unterkante auf die Fläche darunter
   ⛓  Reichweite            Einzelteil ⇄ Bedeutungsgruppe
   ✕  schliessen    (Esc)
```

Erweiterungsfelder, wenn ein Werkzeug sie braucht — immer an derselben Stelle, nie mehr als sechs
gleichzeitig sichtbar:

| Feld | Für | Verhalten |
|---|---|---|
| ⧉ | duplizieren | Kopie 0,5 versetzt, sofort ausgewählt |
| 🗑 | entfernen | nur Sitzungsansicht; das Rezept entscheidet endgültig |
| ☺ | posieren (E2) | öffnet die Clip-Suche für Figuren |
| 👁 | anblicken (E2) | nächster Klick setzt das Blickziel |

Regeln: Symbol plus Tooltip, nie Text allein. Tastaturkürzel spiegeln die ersten beiden Felder.
Das Menü liegt IM Bühnenrahmen (nicht im Panel), damit „Nur Ansicht" es mit ausblendet.

## Einbau in eine andere Seite

Fünf Schritte, in dieser Reihenfolge:

1. **Voraussetzungen prüfen:** eine `makeViewer`-Instanz, ein `root`, dessen Kinder
   `userData.recipe` tragen, und eine Gruppenkennung `g` auf den Platzierungen.
2. **TransformControls** in die Importmap (gleiche three-Version wie OrbitControls).
3. **Editorblock kopieren** aus `KayKit_Room_Study_S21.html` (Abschnitt „Mini-Editor"): Gizmo,
   Auswahl, Mini-Menü, Ablage, Patch-Ausgabe. Er ist bewusst frei von Raumlogik.
4. **Zwei Haken setzen:** `V.onFrame` führt das Menü mit der Kamera mit; `V.onResize` zieht den
   Kamerafit nach.
5. **Picking auf Sichtbares filtern** — three.js raycastet auch unsichtbare Objekte. Ohne den
   Filter greift der Editor Phantome (gemessen an der geschlossenen Truhe hinter der offenen).

Beim **zweiten** Einbau wird aus dem Block `lib/edit-layer.js` — nicht vorher: eine Bibliothek aus
einem einzigen Anwendungsfall ist geraten, nicht abgeleitet.
