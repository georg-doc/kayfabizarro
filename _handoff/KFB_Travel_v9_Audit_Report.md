# KFB Travel v9 — Architektur-Audit & v10 Handover

**Ziel:** Konsolidierter Status-Report für das Coworking mit Claude an v10+, basierend auf dem `v9` Repository-Snapshot.

## 1. Status Quo & Analyse (v9)
Die Entwicklung von v7 über v8 zu v9 zeigt eine sehr stringente Evolution. Die im v8-Audit geforderten architektonischen Schritte wurden großteils erfolgreich initiiert. 

**Starke Errungenschaften in v9:**
*   **VoxelWorld Integration:** Die Verknüpfung der Travel-Mechaniken mit der neuen Voxel-Umgebung ist ein massiver Sprung. Die Engine muss nun nicht mehr im leeren Raum fliegen, sondern mit Terrain interagieren.
*   **Academy Modul:** Die Einführung des Academy-Konzepts (wahrscheinlich für Onboarding, Tutorials oder Story-Missionen) zeigt, dass die Infrastruktur nun "Content" tragen kann.
*   **Modularität:** Das Splitting in Module wie `travel-manager.js`, `travel-input.js`, `travel-events.js` und `autopilot.js` beweist, dass das "God Object" Problem aus v7 (`travel-poc.js`) aktiv angegangen wurde.

## 2. Risikoanalyse & Technischer Fokus für v10

Obwohl die Modularisierung stark verbessert wurde, bringt die Komplexität der neuen Systeme (Voxel + Academy) neue Herausforderungen:

### A. Voxel-Terrain vs. Travel Controller (Kollision & Pathfinding)
*   **Das Risiko:** Der `flight-controller` und der `walk-controller` müssen nahtlos mit dem `voxel-terrain` interagieren (Höhenabfragen, Kollisionen). Wenn die Controller direkt das Voxel-Modul abfragen, entsteht harte Kopplung.
*   **Die Lösung (v10):** Der `WorldContext` (aus v7/v8) muss als strenger Vermittler (Interface) fungieren. Die Controller fragen `WorldContext.getHeightAt(x,z)` oder `WorldContext.raycast(...)`, niemals direkt das Voxel-Grid. So bleibt die Fortbewegung unabhängig von der Art der Welt-Generierung.

### B. Academy-Logik vs. Core Gameplay (Quest/State Management)
*   **Das Risiko:** Die Academy-Skripte (`academy-cards`, `academy-live`, `lesson-search`) könnten anfangen, Spiel-Zustände direkt im `travel-manager` oder in Controllern zu manipulieren.
*   **Die Lösung (v10):** Nutzt konsequent den neuen `travel-events.js` Bus! Das Academy-System darf nur passiv auf Events lauschen (z.B. `ON_NODE_REACHED`, `ON_TUTORIAL_FLIGHT_DONE`) und über klar definierte Interfaces (wie den neuen `autopilot.js`) in das Gameplay eingreifen. Keine harten Referenzen von Core-Movement zu Academy-Logik.

### C. State Machine für Travel Manager
*   **Das Risiko:** Mit der Einführung von `autopilot` und verschiedenen Controllern (Walk, Flight) wird das Modus-Switching komplex.
*   **Die Lösung (v10):** Der `travel-manager.js` sollte eine formale State-Machine erhalten (`IDLE`, `WALKING`, `FLYING`, `AUTOPILOT`, `CINEMATIC_ACADEMY`). Das verhindert Race-Conditions, z.B. wenn der Autopilot startet, während der Spieler gerade absteigt.

## 3. Design & Art-Direction Sync (Design Handover)
Um das analoge, haptische DIY Cut-and-Play Comic-Gefühl zu erhalten (wie von Anfang an definiert):

*   **Voxel-Ästhetik:** Voxels neigen zu einem harten, digitalen "Minecraft"-Look, was eurem dynamischen Ink-Style widerspricht. Nutzt das `voxel-glyphs.js` Modul und Post-Processing (`post-radial.js`, `skydome-shader.js`), um die Voxel-Welt wie gezeichnete, unperfekte Schraffuren (Hatching) oder haptische Papp-Boxen wirken zu lassen.
*   **Academy-UI als Comic-Panels:** Integriert die Lektionen und Karten (`academy-cards`) visuell als physische Elemente im Raum (Diegetic UI) oder als eingeblendete Comic-Panels, anstatt typische glatte digitale Popups zu verwenden.
*   **Ink-Dynamics:** Module wie `ink-tail.js` und `kfb-ink.js` sind essenziell, um Bewegungslinien (Speedlines, Trails) handgezeichnet wirken zu lassen (ungleichmäßige Dicke, leichtes Wackeln/Boiling).

## 4. Coworker Checkliste (Sprint v10+)

| Prüfpunkt | Beschreibung / Regel für Claude |
| :--- | :--- |
| **Entkopplung Voxel/Movement** | Travel-Controller fragen Positionen/Kollisionen IMMER über den `WorldContext` ab, nie direkt beim Voxel-Terrain. |
| **Academy als Observer** | Academy-Logik steuert das Spiel über den Event-Bus oder den Autopiloten. Keine Direktaufrufe in die Physik. |
| **Travel State Machine** | Moduswechsel (Flug, Laufen, Autopilot) über den `travel-manager` strikt synchronisieren. |
| **Art Direction Enforcement** | Voxel-Rendering und UI müssen den haptischen, gezeichneten Retro-Comic-Style durch Custom-Shading (Ink/Hatching) unterstützen. Keine "KI-Slop"-Ästhetik oder generische Glätte. |

---
**Fazit:** v9 hat die Engine erfolgreich skaliert und die Architektur aus v7/v8 sauber umgesetzt. Für v10 geht es darum, die neuen Subsysteme (VoxelWorld, Academy) elegant zu orchestrieren, ohne die starke Entkopplung zu zerstören, und den visuellen Retro-Style über die neuen Systeme zu stülpen.
