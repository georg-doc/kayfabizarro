# ADR · ToolBox vs. Frankensteining Studio vs. Blender MCP

Datum: 16.10.2026  
Status: **Diskussionsgrundlage für Georg + WS0**  
Kontext: V-332 Alien-/Orc-Integration

## Frage

Soll die KFB ToolBox weiterhin strukturelle Figuren- und Rigging-Experimente aufnehmen, oder gehören solche Arbeiten in ein spezialisiertes Frankensteining Studio bzw. nach Blender MCP?

## Empfehlung

**Keine weitere produktive Oberfläche eröffnen.** Die KFB ToolBox bleibt der eine kanonische Front Door und die Integrations-/Abnahmeoberfläche. Strukturelle Assetarbeit bleibt in Blender MCP. Ein bereits vorhandenes Frankensteining Studio kann als klar abgegrenzte, nicht produktive Experimentierbank dienen, falls WS0 dessen aktuellen Owner und Quellstand bestätigt.

Das ist ausdrücklich **keine Wiederbelebung des eingestellten FrankenStein Composer (V-239)** und kein neuer Head-Part-Composer.

## Zuständigkeiten

| Oberfläche | Soll besitzen | Soll nicht besitzen |
|---|---|---|
| Blender MCP | Topologie, Retopo, Normalen/Tangenten, Socket-Geometrie, Bone-/Anchor-Restpose, semantische Mesh-Trennung, Skin-/Morph-Erhalt | Emote-/Viseme-UI, Site-Publishing, Rezeptverwaltung |
| KFB ToolBox | Figur auswählen, freigegebenes GLB laden, Rezept-Tunables, EyeRig/Dangle/Mouth-Owner steuern, Pose/Clips prüfen, Save/Export, Browserabnahme | Vertex-/Index-Surgery, Retopo, Materialkaschierung, automatische Gesichtszerlegung, neue Assettopologie |
| Frankensteining Studio, falls bestätigt | reversible Experimente, Kombination vorhandener Owner, Messung, Vergleich, Prototyp-Proofs | kanonischer Assetexport ohne DCC-Gate, Live-Promotion, paralleler ToolBox-Ersatz |

## Warum diese Aufteilung

- Die ToolBox ist bereits eine komplexe UI für Actor, Face, Pose, Motion, Voice, Stage, Save und Library. Weitere strukturelle Mesh-Werkzeuge erhöhen Fehlbedienung, Owner-Überlappung und Abnahmekosten.
- Das V-332-Problem zeigt, dass Loader-, Material- und Rig-Erfolg keine saubere Topologie beweisen.
- Blender besitzt die richtige Sicht auf Mesh, Normalen, Skin, Bones und Restpose. Dort lässt sich die Ursache reparieren statt im Renderer kaschieren.
- Für schnelle Ideen ist eine isolierte Experimentierbank nützlich, solange ihre Ergebnisse erst nach einem expliziten DCC-/Asset-Gate in die ToolBox gelangen.
- Ein einziges Front Door bleibt erhalten; Spezialwerkzeuge erscheinen als klar benannte Arbeitsschritte, nicht als konkurrierende Produkte.

## Vorgeschlagener Workflow

1. ToolBox oder Referenzbild meldet ein sichtbares Problem.
2. Diagnose klassifiziert es als Rezept-/Runtime-Parameter oder Assetstruktur.
3. Rezept-/Owner-Parameter bleiben in der ToolBox.
4. Topologie, Socket, Anker, Bone-Restpose oder Mesh-Trennung gehen per Handoff an Blender MCP.
5. Optionaler Prototyp im vorhandenen Frankensteining Studio, aber nur reversibel und ohne Produktstatus.
6. Korrigiertes GLB kommt mit Commit, Pfad, Strukturbericht und Proofs zurück.
7. ToolBox führt den kurzen Browser- und Save/Reload-Gate aus.
8. Georg nimmt live ab; erst danach Promotion.

## WS0-Diskussionspunkte

- Existiert ein aktuell gepflegtes Frankensteining Studio mit eindeutigem Owner, oder wäre seine Nutzung faktisch ein neues Tool?
- Kann es strikt auf reversible Kombination/Messung begrenzt werden?
- Welche Owner dürfen dort geladen werden, ohne ToolBox-Logik zu duplizieren?
- Soll der Experiment-Return immer ein Blender-MCP-Handoff sein, oder genügt bei rein deklarativen Rezeptänderungen ein `kfb.pets/1`-Export?
- Wie wird im UI sichtbar unterschieden zwischen Experiment, Asset-Kandidat und abgenommener Figur?

## Entscheidungsvorschlag

Für den laufenden V-332-Slice: **Blender MCP für Dory/Hunky/Orc, ToolBox nur für Integration und Abnahme.** Über die dauerhafte Rolle des bestehenden Frankensteining Studio entscheidet Georg mit WS0 separat. Bis dahin keine neue Tooloberfläche und keine Composer-Reaktivierung.
