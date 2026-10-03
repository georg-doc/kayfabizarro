# KFB Video Evidence Protocol

Status: **CURRENT CANDIDATE · RESEARCH ONLY**
Date: 2026-10-03
Owner: KFB research/evidence lane

## Was ist der Zweck?

KFB darf technische oder gestalterische Regeln aus Videos nicht mehr nur aus Tonspur, Transkript oder Erinnerung ableiten. Dieser Workflow erfasst gezielt, was im Bild tatsächlich zu sehen ist: Bewegungsphasen, Zustandswechsel, sichtbare Einstellungen, Bedienung und Ergebnis.

Das erste konkrete Thema ist die native KayKit-Locomotion. Der Prozess ist danach auch für Blender-, Three.js-, Unity-, Godot-, Shader-, VFX- und Tool-Tutorials wiederverwendbar.

## Wer macht was?

- Ein browserfähiger Web-/Work-Chat sichtet die Videos und erstellt Zeitmarken, wenige entscheidende Referenzbilder und strukturierte Beobachtungen.
- Blender MCP verwendet diese Belege anschließend für einen visuellen Vergleich mit den Originalclips auf `Mannequin_Medium`.
- Die Runtime-Integration beginnt erst nach diesem Vergleich. Der Recherchechat verändert keine Animation, keinen Controller und keine Runtime.

## Was muss Georg tun?

Nur den Web-Research-Job starten. Georg muss keine Videos durchsuchen, keine Screenshots sortieren und keine Dateien zwischen Dropbox und GitHub verschieben.

## Was kommt danach sichtbar heraus?

Ein kompakter Kontaktbogen pro Thema und eine verständliche Tabelle:

- was der KayKit-Creator tatsächlich zeigt;
- welche Clipnamen und Einstellungen sichtbar sind;
- wie Idle, Walk, Run, Jump und weitere Zustände verbunden werden;
- was im Video nicht gezeigt wird;
- welche Szenen Blender exakt nachstellen soll.

## Verbindliche Dateien

1. `BRIEF_WEB_KAYKIT_CREATOR_SCAN_01.md` — erster ausführbarer Rechercheauftrag.
2. `VIDEO_EVIDENCE_METHOD.md` — wiederverwendbare Sichtungs- und Auswertungsmethode.
3. `VIDEO_EVIDENCE_RETURN_SCHEMA.json` — maschinenlesbare Rückgabeform.
4. `STORAGE_AND_RIGHTS.md` — kleine, belastbare Ablage ohne Video- oder ZIP-Müll.

## Quellenrangfolge

1. Das tatsächlich sichtbare Bild und die sichtbare UI im Originalvideo.
2. Gesprochene Erklärung des Creators.
3. Offizielle Videobeschreibung, Kapitel und Pack-/Update-Seite.
4. Transkript als Suchhilfe.
5. Eigene Interpretation, immer ausdrücklich als Interpretation markiert.

Ein Transkript beweist keine Körpermechanik, keinen Fußkontakt und keinen sichtbaren Zustandswechsel.

## Harte Grenzen

- Kein Download oder Re-Upload kompletter Videos.
- Keine langen Bildsequenzen oder Frame-Dumps.
- Keine Runtime-Änderung, kein Merge, kein Cloudflare-Deployment.
- Keine neue Motion-Quelle und keine Neubewertung der Quellenrangfolge.
- KayKit Character Animations 1.1 bleibt Primärquelle; Mixamo ist nicht Teil dieses Jobs.
- Wenn ein Thema nicht sichtbar ist: `NOT_SHOWN`, nicht aus Allgemeinwissen ergänzen.
- Wenn YouTube zweimal an derselben Stelle blockiert: Teilstand sichern und `SOURCE_BLOCKED` melden.
