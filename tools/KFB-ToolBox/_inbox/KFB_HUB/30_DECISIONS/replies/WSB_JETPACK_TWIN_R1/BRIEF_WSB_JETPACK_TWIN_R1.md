# Für WSB (Mac mini, Blender MCP) · Jetpack Twin R1: kompakter Claymation-Jetpack mit Zwillingsdüsen · 14.11. (Georg, V-1734)

**Ziel (Georg 14.11., wörtlich):** „ein neues jetpack – möglichst ohne die gleichen bastel-iterationen wie bei den anderen jetpacks … vgl. andere (FB-)jetpacks, keine lücken, kein im-kopf-stecken der schläuche etc“.

**Vorlage:** Ordner `CLAUDE/MeshyModels/KFB JetpackTwin/`: `Kompakter Claymation-Jetpack mit Zwillingsdüsen.png` (Konzeptblatt: vorn, seitlich, schräg, unten, am Grundkörper von hinten und seitlich) und `Bildschirmfoto 2026-11-14 um 07.25.18.png` (das HUD-Icon „Jetpack“, an dem sich das Modell wiedererkennen lassen muss). Zwei cremefarbene Tanks mit roten Bändern und Messingnieten, Düsenglocken unten, zwei gerippte braune Schläuche in Bögen über den Tanks, Manometer oben mittig, braune Rückenplatte mit Gurt und Messingschnalle.

**Tier 0**
1. Erst das Bild, dann der Bau (V-740): das Konzeptblatt ist die Bildwahrheit; Proportionen, Farben und Teile 1:1 daraus, nichts dazuerfinden.
2. Sitz wie die anderen Jetpacks (V-1528): Lage von Rocket R7 (`50_BLENDER/JETPACK_R1/data/jetpack.contract.rocket03.r7.json`, Sitz an spine) übernehmen, kein Klapp-Gelenk, keine neue Mechanik; seitlich kein Spalt zwischen Platte und Rücken.
3. Beleg nur mit Knete und KFB-Licht auf der Proof-Stage (V-431), FB-Kanon-Wächter vor jedem FB-Bild (beide Ohren, Schwanz; V-1608); ein Kritiker je Runde auf dem Endstand, nur als Befundliste.

**Bestand (zuerst lesen):** `src/m1/jetpack.js` (Verträge, `seat_gross['fb-broad']`, Düsen-Anker), die Verträge in `50_BLENDER/JETPACK_R1/data/` (Diesel r2, gross4, rocket03.r7) und `50_BLENDER/JETPACK/data/v910_jetpack.contract.r4.json` (Kit-Rücken), deine Rocket-Runden R1–R7 (V-1506, V-1526, V-1528) als Lehre.

**Bau:**
- Tanks, Schläuche, Düsen und Manometer starr an der Wurzel `KFB_Jetpack_Twin`; die Rückenplatte wie bei Rocket R7 geskinnt (V-1528), damit seitlich in keinem Clip ein Spalt entsteht. Zwei Düsen-Anker `KFB_Thrust_L` und `KFB_Thrust_R` (lokal +Z = Schubrichtung) für Flamme und Rauch des Spiels; Materialzonen getrennt (Tank, Band, Messing, Schlauch, Platte, Manometer-Glas) für spätere Skins.
- Schläuche als Bogen vom Tank-Kopf zum Manometer bzw. zur Platte, nie über die Kopfkante: In Ruhe, Gehen, Laufen, Springen und allen Flug-Clips von FB bleibt jeder Schlauch außerhalb von Kopf und Ohren-Ansatz. Leichtes Eindringen nur in Randposen wie Schleichen ist erlaubt (V-1528).
- Platte liegt auf dem Rücken auf, Hasenschwanz bleibt sichtbar (q529).
- Wenn sich Bedingungen widersprechen (z. B. Schlauch gegen Kopf in einem Clip), keine neue Mechanik bauen, sondern über WS0 Georg zuerst die einfache Toleranz vorschlagen (V-1528).

**Prüfung vor der Rückgabe:** Eindringen Schlauch/Tank in Kopf und Ohren über alle FB-Clips, die im Spiel laufen, auch mit den neuen Haltungen (haltung=r1, 50_BLENDER/WSB_HALTUNG_R1 auf assets/private = assets/wsb-haltung-r1 @4ced9ade, V-1733) (wie bei Rocket R6: Liste mit Höchstwert je Clip); Spalt Platte–Rücken seitlich; Bildpaare von vorn und seitlich in Ruhe und im Flug; daneben das Konzeptblatt.

**Grenzen:** kein Eingriff in den Spielcode, keine Fremd-Assets ohne Georgs Ja, nichts in `src/private` committen.

**Rückgabe** wie Reihe R1: Bundle in `replies/WSB_JETPACK_TWIN_R1/MINI/`, Bilder und RETURN.md in `replies/WSB_JETPACK_TWIN_R1/`, Vertrag `jetpack.contract.twin.r1.json` im Format von rocket03.r7 (glb, root_node, thrust, seat_gross['fb-broad']); Meldung an WS0, WS0 pusht und baut es als `jetvar=twin` ein.
