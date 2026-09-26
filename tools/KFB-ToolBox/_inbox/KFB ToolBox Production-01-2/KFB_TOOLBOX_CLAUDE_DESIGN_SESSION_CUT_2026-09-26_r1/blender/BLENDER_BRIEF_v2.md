# Blender-Briefing v2 · Clay-Lider, Augenklappen, Haar-Zacken für FrizzleBob Ear Rig v5
*26.09.2026 · ersetzt v1 vom selben Tag · Auftraggeber Georg · Verbraucher: KFB ToolBox Production-02 › Rigging*

## 1 · Wofür die Teile sind
FrizzleBob (`FB_TEMPLATE_LOOK_v5.glb`, KayKit Rig_Medium, Ohrketten `ear.l/r.1–3`) bekommt in der ToolBox ein Gesichts-Rig, das pro Teil drei Quellen kennt: **Rig** (prozedural), **Painted** (aus dem Modell) und **Off**. Für die Lider gibt es jetzt zwei prozedurale Stufen:

1. **Shell (EyeRig v6):** dünne Halbkugeln. Die billige Stufe, visuell abgelehnt.
2. **Clay volume:** läuft seit heute in der ToolBox als Kandidat (`kfb-lib/clay-lids.v1.js`). Der Spender ist PR #159 Eye Actor Studio v1 (`upper-lid-volume.v1.mjs`), der Vertrag ist `EYELID_GEOMETRY_CONTRACT.v1.md`. Das Lid ist ein geschlossenes Volumen: außen weicher Ton, innen am Augapfel anliegend, harte Öffnungskante, geschlossene Seiten. Das Unterlid ist dieselbe Form gespiegelt. Beide schwingen um die Augenachse (Sweep).

**Blender liefert die dritte Stufe: modellierte Clay-Lider mit Klappen und Zacken.** Sie sollen die prozedurale Form ablösen, sobald sie besser aussehen. Die Funktion muss dabei gleich bleiben, damit Rig, Regler und Export ohne Umbau weiterlaufen. Zieldesign ist Vertrag §2 und §15: *outside soft · inside crisp · real volume · real occlusion*. Gemeint sind zwei gerundete Hälften **einer** größeren Schale, die den Augapfel umschließt.

## 2 · Liefergegenstände
Eine Datei `FB_FACEPARTS_v1.glb`. Jedes Teil ist ein eigenes, benanntes Mesh, und es gibt keine Änderung an `FB_TEMPLATE_LOOK_v5.glb`.

| Mesh | Form | Pivot und Raum | Muss |
|---|---|---|---|
| `FB_Lid_Upper` | obere Hälfte der augenumschließenden Schale, Unterkante = Öffnung, Kante verrundet, Innenfläche liegt mit 1,6 % Luft am Augapfel | Augapfel-Mitte, Blick = +Z, oben = +Y, **Augapfel-Radius = 1** | geschlossenes Volumen, Dicke 0,18–0,30 |
| `FB_Lid_Lower` | untere Hälfte derselben Schale | wie oben | wie oben, etwa 60–80 % der Höhe |
| `FB_EyeFlap` *(optional)* | Augenklappe als dickere Platte über dem Oberlid | wie oben | eigenes Mesh, darf fehlen |
| `FB_Hair_Tuft_L` · `_M` · `_R` | die drei Zacken der alten Frisur | **Fuß der Zacke** (Mitte der Unterkante), Figurenraum von v5 | Fuß mit Kappe, die nicht durch die Kopfhaut sticht |

Es genügt **ein** Lid-Paar im normierten Augenraum (Radius 1), weil das Rig es je Auge skaliert, spiegelt und dreht. So passt es auf jede Augengröße, auf ovale Augen (`eye.oval`) und auf seitlich gedrehte Augen (`eye.splay` bis 90°, Frosch).

## 3 · Wie das Rig die Teile bewegt (bitte nicht dagegen bauen)
- **Rotation um die lokale X-Achse durch die Augapfel-Mitte.** So arbeitet der EyeRig (`e._up/_lo.rotation.x`), und die Clay-Lider übernehmen denselben Winkel (Sweep). Blinzeln, Emotes, die Regler »Upper lid · down« und »Lower lid · up from below« sowie die Asymmetrie Δ links laufen damit ohne neuen Code.
- **Slant = Rotation um Z** am Lid-Gelenk. Nichts ins Mesh einbacken.
- **Keine Shape Keys** und kein Skinning an neue Knochen, weil die Lider starr am Augengelenk hängen. *Optional für später:* ein Shape Key `canthusLock`, der die Augenwinkel beim Schließen festhält (Vertrag §16.3).
- **Öffnungskurve.** Die ToolBox regelt Cover, Curve (konkav/konvex), Dicke, Rundung, Bulge, Reach und Wrap prozedural. Wenn das Blender-Lid kommt, fallen diese Regler weg, und es bleiben Sweep, Open und Farbe. Deshalb bitte zwei Kantenvarianten liefern: gerade und leicht konvex (`FB_Lid_Upper_Convex`).
- **Später vermerkt (Georg):** jedes Auge bekommt eine eigene Drehung um seine Achse, damit sich das Wandern um den Kopf ausgleichen lässt. Das braucht nur den richtigen Pivot und sonst nichts.

## 4 · Maße und Stil
- Referenz der Proportionen sind die Bilder im Paket unter `evidence/` (ToolBox: offen, skeptisch asymmetrisch, zu, Seite). Die Form soll dicker und weicher sein als die prozedurale.
- Polycount je Lid ≤ 600 Tris, je Zacke ≤ 200 Tris. Low-Poly im KayKit-Stil, geglättete Normalen, weiche Außenkanten, harte Innenkante.
- Einheiten: Lider im Augenraum mit Radius 1. Zacken in Meter wie v5 (Y oben, Blick +Z).

## 5 · Material
- `KFB_Lid`: Grundfarbe = Kopffarbe #f2c93c, umfärbbar (Vertrag §8: face > body > main).
- `KFB_EyeFlap`: eigenes Material.
- `KFB_Hair`: Vorgabe #f7cb00 (gemessene Spenderfarbe), keine Textur. Falls doch eine Textur kommt, dann mit eigener UV-Insel und nicht im KayKit-Atlas.

## 6 · Haar-Zacken, was schon läuft
`kfb-lib/hair-tufts.v1.js` schneidet die Zacken aus `FrizzleBob_Yellow.gltf` (Kopfknochen-Inseln über dem Schädel, gemessen 108 · 84 · 108 Tris) und hängt sie mit eigenem Material an den Knochen `head`. Einstellbar sind mit Haar/Glatze, alle 3/Mitte/Seiten, Größe, Höhe, vor/zurück, Spreizen, Seitenneigung, Kippen, Rauheit und Farbe. Von Blender brauchen wir die Zacken nur als **saubere Neufassung**: Kappe am Fuß, keine Durchdringung, gleiche Silhouette, Pivot am Fuß. Dann greifen dieselben Regler.

## 7 · Nicht gewünscht
Kein zusammengeführtes Mesh, keine Änderung am Skelett, keine Ohren, keine Brauen (die Brauen haben eigene Owner) und keine Nase.

## 8 · Abnahme in der ToolBox (Georg)
1. Rigging › Eyes › Lid style bekommt den dritten Wert »Blender«. Offen, halb, zu und skeptisch asymmetrisch lesen sich als Ton über dem Augapfel und nicht als Visier (Vertrag §15.9).
2. Bei `eye.splay` 1 und 2 sitzen die Lider weiter auf dem Augapfel.
3. Beim Blinzeln verschwinden Pupille und Weiß ganz, und nichts durchdringt den Augapfel.
4. Hair › Glatze blendet alle drei Zacken aus. Die Farbe ändert nur `KFB_Hair`.

**Rückgabe an:** `tools/KFB-ToolBox/ear-rig/glb/FB_FACEPARTS_v1.glb`, dazu ein Satz zu Tris je Mesh und den Pivots.
