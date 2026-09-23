# ONBOARDING · Blender-MCP-Chat · Lehren aus ORB-P1 (Orc-Band, 23.–24.09.2026)

Zusätzlich zur Startnachricht (`START_BLENDER_RACETRACK.md`) lesen. Dort steht, **was** zu tun ist. Hier steht, **wie** du arbeitest, damit die Fehler aus dem Orc-Band-Chat nicht wieder passieren. Jede Regel ist als prüfbare Bedingung formuliert.

## 0 · Vor dem ersten Befehl

- [ ] **Blender ist frisch gestartet** (File › New oder eigene Datei im Auftragsordner). Nie eine fremde Haupt-.blend speichern; `orb_band_module_v5.blend` ist tabu.
- [ ] **Arbeitsstände nur als Kopie sichern:** `bpy.ops.wm.save_as_mainfile(filepath=…, copy=True)` oder einzelne Szenen per `bpy.data.libraries.write(…)`. Versionen sind additiv (v1, v2 …), nie überschreiben.
- [ ] **Skripte als `.py`-Dateien** im Auftragsordner ablegen und per `exec(open(p).read())` laden. Kein langer Code nur im Chat, sonst ist er später nicht nachvollziehbar.

## 1 · Werkzeug-Mechanik (belegt)

| Thema | Was gilt |
|---|---|
| `execute_blender_code` | Nach 60 s kommt ein Timeout, der Code läuft aber weiter. Lange Jobs in Stücke teilen, Ergebnisse als JSON auf die Platte schreiben und im nächsten Call lesen. `result` muss ein dict sein. |
| Blender 5.x Actions | Actions haben Slots. Nach `animation_data.action = …` auch `action_slot = action.slots[0]` setzen. |
| Rendern für Reviews | Workbench, `color_type='TEXTURE'`. MP4 direkt aus Blender (FFMPEG, H264, `frame_step=1`). PNG-Kontaktblätter zur eigenen Kontrolle. |
| `device_bash` | Fällt öfter aus ("bridge sockets"). Dateien dann aus Blender-Python schreiben; Transfer per `device_stage_files` / `device_commit_files`. |
| Löschen in Dropbox | Nicht erlaubt. Stattdessen nach `_to_delete/` verschieben. |
| glTF-Import | NLA-Spuren kommen stumm an. Erst in einem **separaten** Call auswerten. |
| FBX / Mixamo | Das Armature-Objekt ist um X 90° gedreht; die Körperbewegung liegt am Objekt, nicht an `hips`. |
| GitHub schreiben | Der Connector kann nur lesen (403; bei privaten Repos auch 404). Schreibweg: Georgs Chrome, Upload-URL `github.com/<owner>/<repo>/upload/<branch>/<pfad>`, `file_upload` nur aus `/mnt/user-data/uploads/…` (≤ 10 MB pro Call), Commit per JS (`input[name=message]` setzen, "Commit changes" klicken). Danach per `list_commits` prüfen. Vorher immer `tabs_context_mcp` aufrufen. |
| PR-Titel und -Text | Die Felder auf der Compare-Seite nehmen per JS gesetzte Werte nicht zuverlässig an. PR anlegen und danach über "Edit title" / "Edit comment" in der UI korrigieren. |

## 2 · Arbeitsregeln (aus Fehlern, die Georg Stunden gekostet haben)

1. **Erst selbst anschauen, dann zeigen.** Jede Änderung prüfst du vorher als Standbild aus 2–3 Ansichten und öffnest das PNG selbst. Zahlen ersetzen den Blick nicht. *(Trommler v2 ging mit gebrochenen Armen raus, obwohl 101° Verdrehung gemessen waren.)*
2. **Grenzen sind hart, nicht nur gemessen.** Was ein Limit reißt, wird nicht gezeigt. Wo es geht: Limit-Constraints im Rig oder ein Prüf-Gate, das abbricht.
3. **Keine Parameter-Optimierer für Dinge, die Georg nach Aussehen beurteilt** (Posen, Silhouetten, Proportionen), außer jede Zwischenstufe wird visuell geprüft. Ein Optimierer erfüllt die Metrik und liefert groteske Formen.
4. **Vorlagen zuerst in Ruhe prüfen.** Assets, Anschlussstellen und Offsets in Neutralpose und Nahaufnahme kontrollieren, bevor darauf aufgebaut wird. *(Der Keulen-Griff war schon in der Vorlage falsch; eine T-Pose-Nahaufnahme hätte es sofort gezeigt.)*
5. **Keine Zusatzobjekte ohne Frage.** Georg bestimmt den Look. *(Die "Lollipop"-Toms waren eine eigenmächtige Lösung.)*
6. **Zwei Fehlversuche am selben Punkt = STOP.** Stand exportieren, Ursache in einem Satz benennen, Georg fragen. Kein dritter Anlauf mit mehr Parametern.
7. **Ehrlicher Status.** "Zur Abnahme" ist nicht "abgenommen". Bekannte Mängel stehen in der ersten Zeile, nicht im Kleingedruckten.
8. **Kommunikation:** Deutsch, kurz, konkret, keine Selbstbestätigung. Keine Aussagen über Georgs Zeit oder Energie.

## 3 · Speziell für den Racetrack-Baukasten

- **Anschlussstellen pro Modul prüfen,** in Nahaufnahme aus mindestens zwei Ansichten: Stützenfuß auf dem Boden, Stützenkopf an der Unterseite, Bogenfuß auf der Bandenkappe, Übergang zum Gelände. Das sind genau die R3d-Mängel.
- **Kollision objektiv prüfen:** BVH-Test Modul gegen Modul und Modul gegen Gelände, mit einem Mindestabstand bzw. einer Überlappungs-Toleranz. Vorlage: `mesh_bvh()` und `inside_parity()` in `drm_tools.py` (ORB-Handover `mixamo/`).
- **Maße aus den Laufzeit-Dateien messen** und in `track_profile.json` festhalten. Kein Schätzen, kein Nachbauen aus Erinnerung.
- **Review-Seite:** ein Artifact mit Bildern bzw. MP4 (Front / ¾ / Unterseite) plus Messwerten. Georg sieht erst, was du selbst angeschaut hast.

## 4 · Übergabe

`RETURN.md` mit Maßen, Tests und Grenzen. Außerdem GitHub (SSOT, eigener Branch/PR) und eine Kopie in Dropbox. Die Werkstatt-Dateien der Orc-Band (`DRUMMER_POSE_WERKSTATT.blend`) nicht anfassen; das ist Georgs offene Aufgabe.
