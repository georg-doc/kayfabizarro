# Brief · KayKit Creator Video Scan 01

Executor: **ChatGPT Web/Work with browser and visual video access**
Recommended model: **GPT-6 Luna · High reasoning**
Fallback: **GPT-6 Sol · Medium reasoning**
Mode: research only; no code, merge or deployment
Return language: German summary; original English UI/clip labels preserved

## Kopierbarer Startauftrag

> Untersuche die drei im Brief genannten Originalvideos des KayKit-Creators visuell, nicht nur über Transkript oder Tonspur. Lies zuerst diesen vollständigen GitHub-Ordner und führe danach `BRIEF_WEB_KAYKIT_CREATOR_SCAN_01.md` aus. Erstelle Zeitmarken, wenige entscheidende Referenzbilder, strukturierte Beobachtungen und konkrete Vergleichsmomente für Blender. Verändere keine Runtime, keine Animation und keinen GitHub-Hauptstand. Wenn ein Thema nicht gezeigt wird, schreibe `NOT_SHOWN`; wenn YouTube blockiert, sichere den Teilstand und schreibe `SOURCE_BLOCKED`.

## Ziel

Belegen, wie Kay Lousberg die nativen KayKit Character Animations tatsächlich zeigt und verbindet. Der Return wird anschließend neben Blenders Mannequin-Aufnahmen gelegt. Das Ergebnis ist Forschungsbeleg, nicht bereits die Entscheidung über unsere finale Locomotion.

## Verbindliche Quellen

1. **Using KayKit Characters In Godot (Detailed version)**
   https://www.youtube.com/watch?v=4p7QaOd8SHE
2. **How to use KayKit Character Animations in Unity and Godot**
   https://www.youtube.com/watch?v=rwst5GnUU7s
3. **KayKit – Animations – Overview Set 1**
   https://www.youtube.com/watch?v=T1KNCtAqJ7A
4. **Offizielle Pack-Seite**
   https://kaylousberg.itch.io/kaykit-character-animations

Prüfe beim dritten Video ausdrücklich, ob es den älteren 2022-Stand oder Character Animations 1.1 zeigt. Nicht vermischen.

## Zu beantwortende Fragen

### 1. Native Gangarten

- Wo sind Idle, `Walking_A/B/C` und `Running_A/B` zu sehen?
- Welche Varianten verwendet der Creator in seinen tatsächlichen Beispielen?
- Welche sichtbaren Parameter oder Abspielgeschwindigkeiten werden verwendet?
- Wie lesen sich Fußkontakt, Passing Pose, Körpervorlage und Armhaltung?

### 2. Zustandswechsel

- Wie werden Idle, Walk und Run verbunden?
- Ist ein Blend Tree, eine State Machine oder ein einzelner Wechsel zu sehen?
- Sind Blendzeiten, Speed-Parameter oder Schwellenwerte sichtbar?
- Wie werden Start, Stop und Turn gelöst, obwohl dafür möglicherweise keine nativen Übergangsclips existieren?

### 3. Sprung

- Werden `Jump_Start`, `Jump_Idle`, `Jump_Land`, `Jump_Full_Short` oder `Jump_Full_Long` gezeigt?
- Wie wird Luftzeit gehandhabt?
- Wann beginnt und endet die Bodenbewegung?

### 4. Weitere Bewegung

- Backwards, Strafe, Sneak, Crouch, Crawl und Dodge;
- Bow/Ranged einschließlich Draw, Aim, Release und `Running_HoldingBow`;
- sichtbare Unterschiede zwischen `Rig_Medium` und `Rig_Large`.

### 5. Import und Rig

- Mannequin oder anderer KayKit-Charakter;
- Skalierung und Importoptionen;
- Root Motion oder In-place;
- Retarget-/Skeleton-Einstellungen;
- Engine-spezifische Einstellungen, die das Bewegungsbild verändern.

## Arbeitsweise

1. Quellen und Versionen festhalten.
2. Transkript nur als Suchindex exportieren.
3. Jede relevante Stelle im Video tatsächlich ansehen.
4. Pro Thema drei bis sechs aussagekräftige Bilder erfassen.
5. `SEEN`, `SAID`, `INFERRED`, `NOT_SHOWN` und `SOURCE_BLOCKED` strikt trennen.
6. Pro belegtem Moment eine kleine Blender-Vergleichsaufgabe formulieren.
7. Die Rückgabe nach `VIDEO_EVIDENCE_RETURN_SCHEMA.json` prüfen.

## Rückgabe

Lege in einem neuen GitHub-Branch unter

`skills/chat/workflows/KFB_VIDEO_EVIDENCE_PROTOCOL_2026-10-03/returns/KAYKIT_CREATOR_SCAN_01/`

folgende kleinen Dateien ab:

- `SOURCE.md`;
- `VIDEO_FINDINGS.md`;
- `video-evidence.json`;
- `CONTACT_SHEET_GAITS.webp`;
- `CONTACT_SHEET_TRANSITIONS.webp`;
- `CONTACT_SHEET_JUMP_AND_OTHER.webp`, nur soweit belegt;
- `BLENDER_COMPARISON_SHOTS.md`;
- `RETURN.md`.

Kontaktbögen sind `REFERENCE_ONLY · NOT A RUNTIME ASSET`. Gesamtgröße unter 10 MB; keine ZIP-Datei und kein vollständiges Video.

Optional darf derselbe Return auf Production Control gespiegelt werden. Ein Site-/Connector-Fehler blockiert GitHub nicht und löst keinen Cloudflare- oder Wiederholungszirkel aus.

## Qualitätsgate

Der Job ist nur fertig, wenn:

- alle drei Videos als geprüft, teilweise geprüft oder blockiert klassifiziert sind;
- jede Hauptaussage eine Zeitmarke und einen Originallink besitzt;
- mindestens Gait, Transitions und Jump als `SHOWN`, `PARTIAL` oder `NOT_SHOWN` ausgewiesen sind;
- Bildbefunde und gesprochene Aussagen getrennt sind;
- der nächste Executor **Blender MCP** heißt;
- Blender ohne Rückfrage weiß, welche Mannequin-Frames es daneben rendern soll.

## Stop-Bedingungen

- Nach zwei fehlgeschlagenen Zugriffsversuchen auf dasselbe Video stoppen und `SOURCE_BLOCKED` dokumentieren.
- Keine Ersatzvideos fremder Creators verwenden.
- Keine fehlenden Werte aus allgemeinem Godot-/Unity-Wissen ergänzen.
- Keine KEEP/HOLD/REJECT-Entscheidung treffen; das folgt im visuellen Blender-Vergleich.

## Fachliche Einordnung

Die korrigierte KayKit-Priorität und das bestehende Video-Scan-Konzept stammen aus der Coworker/Blender-Korrektur auf PR #344, Stand `6d4f7043ab4ab4ac9f80fe689274db6335c8b043`. Dieses Briefing erweitert den damaligen einmaligen Dropbox-Auftrag zu einem GitHub-lesbaren, wiederverwendbaren Evidence-Prozess. Es verändert die noch nicht reconcilierten Dateien aus PR #344 nicht.
