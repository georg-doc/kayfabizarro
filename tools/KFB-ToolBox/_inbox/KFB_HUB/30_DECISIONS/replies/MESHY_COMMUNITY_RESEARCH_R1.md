# Meshy im Game-Einsatz · Recherche R1 (15.10.2026, Agent mit Websuche)

**Quellenlage:** offizielle Doku (Meshy, Adobe/Mixamo), Adobe-Forum, unabhängiger Rigging-Vergleich (StraySpark, Mai 2026), G2-Bewertungen. Reddit und Discord waren kaum auffindbar.

## Kernpunkte
- **Rigging (Doku):**
  - Meshy riggt nur Humanoide und Vierbeiner in T- oder A-Pose. Sonder-Skelette (Gesicht, Anhängsel) riggt man laut Meshy von Hand.
  - Die Rigging-API nimmt höchstens 300.000 Faces, das Gesicht muss nach +Z zeigen.
- **Mixamo:**
  - Es scheitert an Anhängseln, schwebenden Teilen, Hilfsobjekten und gestellten Posen; das Modell soll im Ursprung stehen.
  - **Ein schon geriggtes Modell nicht noch einmal durch Mixamos Auto-Rigger schicken** (sonst „unable to map skeleton“).
  - Dateien über 50 MB scheitern oft.
  - Fix aus dem Forum: Augenstiele und Antennen vor dem Upload löschen, nur den Körper riggen, Anhängsel danach starr an Kopf- bzw. Hüftknochen hängen.
- **Mesh:**
  - Meshy empfiehlt erst Remesh, dann Rig. Richtwerte: 5–20 k Faces für Web/Mobile, 20–50 k für PC.
  - Remesh entfernt die UVs, danach muss man neu unwrappen. Gegen eingebackenes Licht gibt es „Remove Lighting“.
- **Aufräumen:**
  - Merge by Distance, Non-Manifold-Kanten, Normalen neu berechnen.
  - Danach Retopologie (Quad Remesher, QuadriFlow, Instant Meshes), Textur neu backen.
  - Risse beim Animieren kommen oft von mehr als 4 Knochen-Einflüssen pro Punkt; Abhilfe: Limit Total + Normalize.
- **Starre Teile (Helm, Anzug):** Einzelnen Knochen zuweisen (Gewicht 1,0) oder als eigenes Objekt per Bone-Parent anhängen; die automatische Gewichtung versagt dort.
- **Retargeting:**
  - Meshy-Knochennamen sind nicht ganz Mixamo-Standard, das Nachmappen dauert rund 8 Minuten je Figur.
  - Der Hüft-Pivot liegt 5–15 cm daneben, die Füße rutschen.
  - Ruhepose und Knochenausrichtung sind zwischen Meshy-Rigs nicht einheitlich.

Quellen-Links: im Agenten-Bericht vom 15.10. (CHANGELOG), u. a. docs.meshy.ai Rigging/Remesh/Unwrap, helpx.adobe.com Mixamo-FAQ, strayspark.studio Rigging-Vergleich 2026.
