# Für WSB (Mac mini) · Web-Kanon R2 und ML v2 R2: Georgs Antworten auf q668, q669, q670 · 14.11. (Georg, V-1751, V-1752, V-1753)

**Anlass:** Georg hat deine drei Lieferungen abgenommen bzw. korrigiert (V-1751, V-1752). Vier Teile, eine Lieferung.

**Grundlage:** Repo `georg-doc/KFB-Stunt-Car-Race`, Stamm `game/integration-r2` @9b18f5acd, Assets `assets/private` @b76ac864 (dort liegen alle unten genannten Dateien). Regeln aus FB_WEB_KANON_R1 (`replies/FB_WEB_KANON_R1/BRIEF_WSB_FB_WEB_KANON_R1.md`) und DP_WEB_KANON_R1 gelten unverändert, ebenso dein Back-Skript mit Atlas-Bake.

**1 · FB Web-Kanon r1d: Ruhe-Mund geschlossen.** Georg (q668): „offener mund ist falsch“. Die Figurendatei `src/data/characters/frizzlebob.character.json` hat jetzt `appearance.mouth` → `rest: "neutral"` (geschlossen; im Spiel geprüft, Stamm @9b18f5acd). Bitte alle drei Dateien neu backen, sonst nichts ändern:
- `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON.r1b.glb` → `FB_WEB_KANON.r1d.glb`
- `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_twin.r1c.glb` → `FB_WEB_KANON_twin.r1d.glb`
- `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_agent.r1b.glb` → `FB_WEB_KANON_agent.r1d.glb` (Entwurf bleibt Entwurf)
Ruheknoten = geschlossener Mund auf Skalierung 1; die Einschübe smile, d und oh im Gesichts-Leerlauf bleiben kurz wie bisher.

**2 · Hunky und Dory: Augen-Beleg nah.** Georg (q670): „es ist nicht zu sehen, ob die alien augen korrekt sind.“ Ein Bildblatt je Figur, Bildausschnitt nur Augen und Lider (Dory ein Auge, Hunky zwei mit Schielen), je Spiel links und Web rechts: offen von vorn, offen seitlich, halb, zu, Blick links, Blick rechts. Dateien: `50_BLENDER/DP_WEB_KANON_R1/_privat_kauf_asset/LORD_HUNKY_WEB_KANON.r1.glb` und `…/LADY_DORY_WEB_KANON.r1.glb`; Spielfiguren über den Spiel-Lader im Stamm (wie in deinem Paar-Bild).

**3 · Kopfschatten und Dorys Farben: das Spiel an die Web-Datei angleichen.** Georg: FB „rechts Web-Datei mit korrektem kopf-schatten (fehlt im spiel)“, Dory „rechts Web-Datei ist korrekt (links spiel nicht) wegen schatten & colors“ (V-1751). Du kennst beide Wege; bitte die Ursache finden (welcher Spiel-Anteil am Figuren-Material bzw. an den Schatten die Kopfunterseite aufhellt und Dorys Farben verschiebt) und als Spiel-Änderung liefern:
- im einen Licht-Rig (V-385) und auf dem vorhandenen Schattenweg (V-1729), keine neuen Lichter, nichts nur für eine Figur;
- als Diff gegen @9b18f5acd mit Begründung je Zeile, hinter einem Schalter `figurlicht=r1` (ohne Schalter bleibt alles wie heute), WS0 baut ein;
- Beleg: Bildpaar Spiel nachher gegen Web-Datei für FB, Hunky und Dory (vorn, seitlich, Gesicht), gleiche Kamera und Lichter wie dein Paar-Bild, dazu ein Bild aus dem Spiel bei Tageslicht.

**4 · ML v2 R2: alle tief gebeugten Clips reparieren, keiner fliegt raus.** Georg (q669, wörtlich): „hier wird gar nichts aus dem pool genommen! es wird im zweifel alles optimiert und gefixt.“ (V-1752).
- Quelle: deine Lieferung `KFB_Motion_idle.v2.Rig_Medium.kk.glb` und `KFB_Motion_gesture.v2.Rig_Medium.kk.glb` (`assets/private`, aus `assets/wsb-ml-v2-kk-r1` @44c1bd2e) bzw. ihre Quellen in `30_DECISIONS/replies/WSB_HALTUNG_R1/v2_quellen/`.
- Ziel wie ML v1: Unterarm und Hand höchstens 1,5 cm im Rumpf über deine sechs Messkörper, für jeden Clip, der heute darüber liegt.
- Mittel je Clip nach Bedarf: Oberarm, Ellbogen, bei vorgebeugtem Oberkörper auch Brust/Wirbel etwas aufrichten; Haltung und Ausdruck des Clips bleiben, kein drohend weites Abspreizen (Bäuerin, q665).
- KayKit-Originalclips unverändert (q665); gleiche Clipnamen und Clipzahl; Lieferung als `….v2.Rig_Medium.kk.r2.glb`.
- Beleg: Tabelle je Clip (vorher, R1, R2 in cm) und ein Bildblatt mit den sechs schlimmsten Clips vorher/nachher an zwei Körpern.

**Rückgabe** wie Reihe R1: Bundle, Bilder, RETURN.md in `replies/WEB_KANON_R2/`, Zweig je Teil (Vorschlag `assets/wsb-web-kanon-r2`, `assets/wsb-ml-v2-kk-r2`), Diff aus Teil 3 als Datei im Bundle. WS0 trägt danach die r1d-Dateien in die Figurendateien ein (`appearance.export.web`) und stellt die Hub-Fragen.
