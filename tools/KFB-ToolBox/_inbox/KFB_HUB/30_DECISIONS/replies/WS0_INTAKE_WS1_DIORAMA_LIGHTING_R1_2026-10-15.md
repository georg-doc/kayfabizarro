# WS0 Intake · WS1 Diorama Lighting & Color Cohesion · 15.10.2026
**Status: GEORG PRODUCTION REQUEST / PROPOSAL FOR WS0 REGISTRATION. No V-number assigned here. WS0 is sole decision/assignment owner.**
Permanent discussion/intake: https://github.com/georg-doc/kayfabizarro/issues/404

## Kurzentscheidung für WS0
Georg korrigiert den alten Webchat-Recherchepfad PR #403: keine Blockierung durch historisches R4/Four-Island-Gate. Die laufende, von WS0 koordinierte und WS1 gebaute R3F-MVP-Slice **hat bereits** echte KFB-Card/Billboard-Dialoge mit zwei Figuren, StageOrbitCam und Meshy-Diorama-Kulissen als unmittelbar geeigneten Lichtvergleichs-Host. **WS0 soll das konsistente Diorama-Licht- und Farbdesign als produktiven nächsten Integrationsschritt aufnehmen und passend sequenzieren**; WS1 baut es nach WS0-Vorlagen-Zeile, nicht diese Webchat-Recherche.

### Aktuelle Quellen vor jedem Auftrag
- `ARCHITECTURE_R1.md` V-228 und `DECISIONS.md` (kanonisch); `WS1_STATUS.md` auf `ws1/r3f-frame` §§40–42 (M1 Zwischenstand, Bühnen-Deskriptor-Vorschlag, StageOrbitCam, Cast GothGirl/FrizzleBob, aktueller Milestone).
- `replies/WS0_TO_WS1.md`, 15.10.: §38.2 **Tageslicht-Basis, einheitliches Schatten-/Farbkonzept** von WS0 zugesagt; V-305 Color Harmony PASS, V-286 Meshy-Albedo-Tint 18 %, aktuelle Stage branches/slots, V-312 diff-basierte schlanke QA.
- `replies/WSA_LIGHT_STUDY_C_R1.md` + `replies/light-presets.json`: **bereits erledigte** Quellstudie für J17-Day, echten Lab EnvironmentHost/light writer, KayKit Creator Godot-Tutorial, Quaternius, Abend-E50 als **unaccepted proposal**. Das ist **kein Recherche-Neustart**.
- `replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js` als V-305 einzige Palette (OKLCH, Rollen, Story-Mode, Seed); keine Joyride-Einzelpaletten oder zweite Palette dazuerfinden.
- `replies/BILLBOARD_STANDARD_R2.md` verbindlich: World Billboard Clay01 r2 plain, responsive echtes Card-Format, vollständige uncropped PDF-Viertelseite; kurze Pfosten, zwei Figuren davor. Statt fixer 2:1 und falscher LCD-Replacement.
- `ARCHITECTURE_R1.md`: WS1 ist einziger Host/Scene/Camera/Lighting-Writer; WS0 trifft Entscheidungen, liefert Auftrag; Claude Design kann Look-Werte vorschlagen, aber keine Runtime/zusätzlichen Canvas.
- `replies/WS0_TO_WS1.md`: Meshy-Dioramen Goblin-Bank, Prison, UFO, Library, Comic, Utopia, Atlantis, Arcade, Verdant Ruins, Alien Workshop samt separatem `kfb_screen_slot`/Rahmen und kamera-/maßstabsspezifischem Slot-JSON.

### Produktziel und Reihenfolge
**Kleines nächstes Gate:** aktuelles Zwei-Charakter-Dialog/Billboard im echten bestehenden R3F-Host als *Licht-Referenzdiorama* verwenden (2 Figuren + unveränderte Karte + Clay-Pfosten + Meshy-Bühne, sofern im aktuellen Slice verfügbar), bei gleicher Kamera/Belichtung je:
1. neutraler Tag/J17-Day nach realem schon vermessenem Light-Rig;
2. cozy-golden mit kaltem/neutralem Fill, weichem Kontakt, nicht verbrannten Clay-Helligkeiten;
3. Story-Nacht, Card/Text/Augen/Bubble noch lesbar;
4. optional ein surreales Akzentprofil (keine Pflicht für MVP-0).
**Danach** Übertragung der lichtkalibrierten Preset-Rollen auf mehrere schon genehmigte Meshy-Dioramen. Vollständiger Diorama-Katalog bleibt bisher **nach MVP-0**; WS0 entscheidet, ob das kleine Light-Kalibrierungs-Gate schon vor/vor Abschluss M2 sinnvoll eingeschoben wird. **Keine stillschweigende Neuordnung des aktiven M2.**

### Technische Guardrails
- Ein und derselbe bestehende WS1 R3F Host schreibt Sky/Fog/Sun/Hemi/Fill/Exposure/Shadows (anderer aktiver Welt-/Travel-Owner darf nicht parallel schreiben). Ein Diorama liefert *Daten/Presets/Story-Seed*, ggf. **wenige begrenzte lokale praktische Lichtquellen** aus tatsächlichem Bühneninhalt, keine zweite `EnvironmentHost`-/Render-/Kamerainstanz.
- V-305-Rollenpalette aus Karte/StoryMode/Biome (nur geprüfte Card-/Registry-Wahrheit) für Himmel/Boden/Frame/Fluff/Props und dezente Leuchtsignale; Meshy-Texturen bleiben zu **82 % original**, maximale 18 % Tint in aktueller V-286-Mischung. Gedruckte Karte bleibt exakt, unbeschnitten, ohne post-processing-Umfärbung.
- KFB Clay Golden, Schatten/Foot-contact, expressive Figurengesichter und Wireface/KFB_NATIVE exklusiver Face Owner schützen; Licht nicht auf die Kosten von Augen/Mund abwälzen.
- 16:9 und 9:16 für dieselbe Bühne mit original `StageOrbitCam` und 3–4 festem Kameramarken (Totale, Two-Shot, Karte, Gesicht). 9:16 soll keine abgeschnittene Karte erzwingen.
- Keine kostenlosen Wallpaper/HDRI pauschal übernehmen: nur wenn der integrierte Sky/Rig tatsächlichen Bedarf zeigt, konkrete Quelle/Asset isoliert prüfen. PR #403 = optionale Forschungsquelle; deren alte R4-Sperre ist für diese WS1-Slice überholt.

### Kleines Abnahme-Raster für WS0 → WS1
**G0 source contact:** echte Bühne, echte 2 Figuren, echte Karte und aktueller Light Writer isoliert sichtbar; Modell/Scene/Palette/Asset-Pins nachweisen.
**G1 Vorlagen-Zeile:** bestehendes Light-Modul 1:1, V-305-Palette 1:1, minimale Receiver-Eingriffe benennen; keine neue Nacht-Licht-Architektur.
**G2 Bildpaare:** je 3 Hauptstimmungen an identischer Kamera und Größe, und 16:9/9:16 Ansicht. Augen, Mund, Sprechblasen, Card-Kanten/Marginalien, Clay-Relief, Meshy-Materialien, Fußkontakt, lokale Lichtinseln prüfen.
**G3 technische Regression:** vorhandene Tests + gezielter Browser-Smoke/Frame-Diff (V-312); keine blinden Full-Code-Critic-Runden; echte Lichtzahl, Framekosten, Shadow-Pass und Farbwerte dokumentieren.
**G4 nur nach WS0-Zuteilung:** WS1 integriert in bestehende Szene und zeigt den tatsächlichen Revisionstand über den freigegebenen Preview-Weg; kein zweiter Host, keine separate Stage-Demo. WS0 entscheidet visuellen Prüfumfang und die Aufnahme in den laufenden Slice.

### Was WS0 entscheiden muss
1. **Milestone** für den kleinen Light-Pass (MVP-0 vorhandene Dialog-Bühne / später / nach M2), unter Wahrung aktueller Arbeit.
2. **WS1 Vorlagen-Zeile** aus `WSA_LIGHT_STUDY_C_R1` + J17 + V-305 ohne neues System, einschließlich Schatten/Exposure/Gamma und unterschiedlicher Meshy-Diorama-Lichtquellen.
3. **V-Nummer nur durch WS0**; DECISIONS und CHANGLELOG bleiben unangetastet bis WS0 tatsächlich entscheidet.

**Ein nächstes Gate:** `WS0_LIGHTING_SLICE_ASSIGNMENT`: WS0 registriert/priorisiert und sendet einen knappen, bereits quellenbasierten Integrationsauftrag an WS1. Georg muss dafür heute nichts zusätzlich abnehmen.
