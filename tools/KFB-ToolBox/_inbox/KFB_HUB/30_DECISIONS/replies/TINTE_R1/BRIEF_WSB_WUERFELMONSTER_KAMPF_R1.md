# Für WSB (Mac mini, Blender MCP) · Würfelmonster Kampf R1: Bestand sichten und zu Biss und Spucken zusammensetzen · 16.11. (Georg, V-1852, V-1854)

**Tier 0 (CANON_3D §0, wörtlich):**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

Konzept (WS0 bestätigt): keine Szene, sondern Kampf-Clips fertiger Figuren auf der Proof-Bühne. An Stelle des Konzeptblatts steht das Tinte-Konzept `replies/TINTE_R1/KONZEPT_TINTE_R1.md` mit Nachtrag §6. WS0 bestätigt: Für eine Clip-Sichtung ohne Szene verlangt V-561 kein eigenes Konzeptblatt.

**Kern (3 Zeilen):**
1. Georg will den Würfelmonster-Kampf „in einem sauberen Aufwasch statt Stückwerk“ und hat dafür ausdrücklich dich vorgeschlagen.
2. Der Kit-Clip `Bite_Front` hat kein Ausholen und kein deutliches Zuschnappen; im Spiel liest er sich als Anlehnen (Kritiker 16.11.: „Das Maul … in keinem Bild offen oder zu … liest sich als Schieben oder Umarmen“). Spucken hat gar keinen eigenen Clip.
3. **Bestand zuerst (V-956; neu gekeyte Clips mit Messen und Kritiker sind mit V-954 gescheitert):** Du sichtest die vorhandenen Clips und schlägst vor, wie sie ohne Umbau zu Biss und Spucken zusammengesetzt werden. Über neue Clips entscheidet Georg erst danach.

**Grundlage:**
- Figuren: Stamm `game/integration-r2` (Repo `georg-doc/KFB-Stunt-Car-Race`), `src/assets/fluffer/k15/KFB_*_healed.k11c.glb` (15 Arten) und `src/assets/fluffer/KFB_Ghost_healed.k11c.glb`; Cthulhu (Flieger) in `assets/private` `50_BLENDER/K15/cubes_kfb/KFB_Cthulhu_kfbeyes.k11c.glb`.
- Vermessung: Repo `georg-doc/KFB-Combat-Arena`, `modules/kfb-monster-roster.js` (Clips je Satz, vorne +Z, Kopfstoß `Bite_Front` 0,44–0,47 u nach +Z über `Head3`, Flieger `Wing5L`).
- Maul: Knochen `Mouth` (Kind von `Body`) und Anker `KFB_Mouth` (Kind von `Head`, Spuckpunkt, V-589). Ausschnitt Krabbe: `Bite_Front` 0,5 s, Maul vorn bei 0,29 s.
- FB für die Belege: Web-Kanon r1j mit dem Proof-Durchlass (V-1838, Georg q717); vor jedem Bild der FB-Kanon-Wächter (`test/lib/fbKanon.mjs`, V-1608: beide Ohren, linkes aus A11, Schwanz). Würfelmonster-Augen im Zustand infiziert (schwarzer Augapfel, rote Pupille, eye-goo, V-664/V-685), Sitz zum Anker bleibt in allen Clips gleich (V-1122).

**Was du machst (je Art, Läufer und Flieger):**
1. **Sichten:** jede Art mit ihren Kit-Clips `Bite_Front`, `Bite_InPlace`, `Yes`, `No`, `Jump`, `HitRecieve` (Flieger: `Bite_Front`, `Flying`, `HitRecieve`) nah und von der Seite, FB im Kontaktabstand davor. Wo öffnet sich das Maul sichtbar, wo schnappt es zu, welcher Clip liest sich aus Spielabstand als Biss?
2. **Zusammensetzen ohne Umbau:** je Art ein Vorschlag für den Biss (zum Beispiel Ausholen aus einem Teil von `Bite_InPlace`, dann `Bite_Front`, Reihenfolge, Tempo-Faktor, Überblendung) und für das Spucken (Ausholen und Abgang aus vorhandenen Clips, Anker `KFB_Mouth` nur als Punkt bzw. Achse markieren; die Tropfen kommen im Spiel aus dem vorhandenen spuck.v3, du baust keine eigenen Tropfen-Effekte, V-1508). Die Clips selbst bleiben unverändert (V-574); nur Auswahl, Ausschnitt, Tempo und Übergang.
3. **Daten** in die Figuren-SSOT je Art im Stamm (`src/data/characters/q_<art>.character.json`, Schema kfb.character/2, V-1611), Abschnitt `game`, jedes Feld als `{ v, src, status }`: Clip-Folge mit Ausschnitten und Tempo, Kontaktbild (Zeit), Reichweite des Mauls im Kontaktbild (in Figurenhöhen), Lage von `KFB_Mouth` im Kontaktbild relativ zur Wurzel, Abgangsbild beim Spucken. Die Kampf-Clipfolgen liegen bewusst unter `game`, nicht unter `performance`. Jeder Wert trägt `status: "DESIGN"` bis zu Georgs PASS. Du lieferst die Felder als Patch-Datei je Art im Bündel; WS0 trägt sie ein. Für Cthulhu gibt es noch keine Figuren-Datei: Du lieferst den Patch für die neue ID `q_cthulhu`; WS0 legt die Datei an.
4. **Lücken melden:** Wo kein Zusammensetzen einen lesbaren Biss bzw. ein lesbares Spucken ergibt, schreib es mit Bild in den RETURN. Ob es neue Clips gibt, auf welchem Weg und wer sie baut, entscheidet Georg danach über WS0 (V-954 offen).

**Belege:**
- Proof-Bühne, Licht der Bühne, Knete wie im Spiel (Figurenlicht, aufgehellte Farben nach V-1850). Kamera von der Seite, quer zur Linie Monster–FB, beide ganz im Bild, zwischen den Körpern frei.
- Kontaktbogen je Art: alle gesichteten Clips im Kontaktabstand, Seitenansicht.
- Je Vorschlag ein kurzes Video für vier Arten (q_crab, q_mushroom, q_pig, q_demon) mit FB davor; im Kontaktbild berührt das Maul FBs Körper, ohne einzudringen (Gate wie das Arm-Gate aus R1b: höchstens 1 % der Figurenhöhe).
- Ein Lauf des blinden Kritikers mit den Fragen: „Liest sich der Biss als Biss? Ist das Maul offen und zu zu sehen? Liest sich Spucken als Spucken?“

**Rückgabe:**
- Git-Bundle mit Zweig `assets/wsb-wuerfelmonster-kampf-r1` von `assets/private` (aktueller Stand): die Patch-Dateien für die Figuren-SSOT je Art, Belege und Skripte unter `50_BLENDER/WUERFELMONSTER_KAMPF_R1/`; die GLB-Dateien bleiben unverändert.
- RETURN `RETURN_wuerfelmonster_kampf_r1.md` in `KFB_HUB/30_DECISIONS/replies/TINTE_R1/MINI_kampf_r1/`: je Art die gewählte Clip-Folge, Zeiten, Reichweiten, gemeldete Lücken mit Bild.
- WS0 baut Clips und Daten ins Spiel (Tinte R1: Biss, Spucken, Kontakt, Effekt, Ton, FB-Reaktion) und zeigt Georg das Video aus dem Spiel.
