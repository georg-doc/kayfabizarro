# Auftrag WSB · Combat-Mech-Flügel: Antrieb nach unten · WS0 · 01.11.2026 (V-1158, V-1157, V-1089)
Georg: „combat mech jetpack (aber antrieb unten, nicht auf den flügeln, wie bisher vorgeschlagen)“.

**Stand:** `50_BLENDER/JETPACK/_privat_kauf_asset/flug_ruecken/KFB_Mech_Wings.r1.glb`, Wurzel `KFB_Mech_Wings`, Anker `KFB_Thrust_L` und `KFB_Thrust_R` an den äußeren Gelenkknäufen auf halber Flügelhöhe, Strahl 35° schräg nach hinten. Die Anker sind leere Knoten ohne Düse. Ganz unten liegen nur die grünen Zinken. Vertrag `v910_jetpack.contract.r2.json`, `variants.mech_wings`. Pfade wie im Vertrag; falls sie abweichen, nimm die aus `RUCKSACK_SICHT/RETURN.md`.

**Auftrag:**
1. Zwei echte Düsenteile an die Unterseite. Prüfe zuerst `Clanker_ExhaustLeft` und `Clanker_ExhaustRight` als Spender aus dem Kit. Das ist Anbau auf Georgs Wunsch, Ausnahme zu V-574 nur für diese Düsen; Flügel und übrige Form bleiben unverändert.
2. Anker in die Düsenmündungen, Strahl gerade nach unten (Drehung [0,7071 / 0 / 0 / 0,7071], wie beim Space-Ranger).
3. Der Kopf hat in `flight_boost` und `flight_dive` nur 0,012 u Abstand zu den Flügeln. Nimm deinen Vorschlag mit dem tieferen Sitz mit, wenn er hält.
4. Neue Fassung als `r2` plus Vertrag, ohne Umbenennung der Anker, damit der Spielcode nur die Datei wechselt. Ablage auf `assets/private` über WS0.

**Beweis:** Proof-Stage mit Knete und Augen, Flügel von hinten und schräg unten, das Motiv füllt das Bild (V-1099, V-1100). Clip-Prüfung wie zuletzt mit FrizzleBob. Nur letzte Runde behalten (V-1146).

**Rückgabe an WS0, dann Stopp:** Dateien, Vertrag, Prüfwerte, was offen ist. Die Flamme stellt die Flug-Sitzung danach im Spiel ein.
