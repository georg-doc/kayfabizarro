# Briefing WSA Work · Szenen-, Biom- und Licht-Studie R1 (ein großer Auftrag)

Stand: 10.10.2026 · Auftraggeber Georg · von der Steuer-Sitzung (Claude Code)
Branch: `wsa/kfb-scene-study-2026-10-10` (Basis `main`), Ordner `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/WSA_scene_study/`. PR ist nicht nötig.

## 0 · Warum

Die Claude-Sitzungen haben kein belastbares Verständnis für Szene, Raum, Licht und Komposition. Deshalb wurden Inseln, Felsen und Brücken immer wieder zu Bastelarbeiten. Bevor wieder jemand modelliert, sollen echte Creator-Beispiele **gründlich studiert und protokolliert** werden. Ergebnis sind messbare Regeln, die später der Insel-Editor (Muster-Pinsel, Biom-Regeln, Licht) direkt nutzt. Du hast Bildgenerierung und günstige Tokens: Das hier ist dein Auftrag, nicht der der Claude-Sitzungen.

## 1 · Teil A · KayKit: Creator-Videos und Mystery-of-the-Month-Inszenierung

- **Quellen:** Branch `research/kaykit-creator-tutorial-atlas-2026-10-10` (vorhandener Tutorial-Atlas, darauf aufbauen), `research/kaykit-creator-scan-01-2026-10-03`, `chatgpt-web/kaykit-creator-learning-2026-09-19`. Dazu die Vorschau-Medien in `media/3D_Assets/KayKit_Mystery_Series6/*` (große PNG bzw. GIF je Monat) und die KayKit-Pack-Previews (`contents.png`, `sample*.png`). Die animierten 360°-GIFs bzw. Pattern-Demos zu den Mystery-Figuren stehen in Kay Lousbergs **Patreon-Posts** (Mystery of the Month). Georg gibt dir die GIF-Links, z. B. `https://c10.patreonusercontent.com/4/patreon-media/p/post/142572430/…/1.gif?token-hash=…`. Die Links tragen einen Ablauf-Token, deshalb die GIFs **sofort herunterladen** und lokal bzw. im Chat-Container auswerten. Die GIFs selbst nicht auf GitHub legen (Patreon-Inhalt); nur Einzelbild-Beschreibungen, Messwerte und höchstens kleine Ausschnitte als Beleg.
- **Pro Beispiel:**
  - Einzelbilder ziehen (bei GIFs bzw. Videos 6–12 gleichmäßig verteilt).
  - Messen bzw. beschreiben: Hintergrund (einfarbig? Verlauf?), Figurengröße im Bild, Kamerahöhe und -winkel, 360°-Flugbahn (Radius, Höhe, Tempo), Licht (Richtung, Härte, Rim, Schatten), Requisiten-Komposition (Anzahl, Gruppen, Dreier-Regel, Größenstaffel), Abstände in Figurenhöhen H, Boden bzw. Sockel, Farbbeziehung Figur zu Umgebung.
- **Ergebnis:** `A_KAYKIT_STAGING.md` plus Kontaktbögen (CC0-Material darf auf GitHub).

## 2 · Teil B · Die 8 StreakByte-Demo-Inseln (gekauft, lizenziert)

- **Wichtig:** Die Modelle und Renders sind lizenziert und kommen **nie auf GitHub**. Georg gibt dir die Screenshots als **privates ZIP direkt im Chat**: 8 Inseln × Unity-Kamera, Übersicht, Seite und Draufsicht, aus dem Lab-Viewer.
- **Pro Insel:** Biom-Logik (welche Pflanzen bzw. Felsen wo, warum), Gruppenbildung (groß, mittel, klein; ungerade Zahlen), Dichte je Fläche, Wege und Blickachsen, Übergänge (Gras, Sand, Fels, Wasser), Rand- und Unterseiten-Gestaltung, Gebäude am Boden, Farbpalette (Hex-Werte schätzen), Silhouette.
- **Ergebnis:** `B_STREAKBYTE_ISLANDS.md`, **nur Text und Zahlen** auf GitHub, keine Bilder dieser Inseln.

## 3 · Teil C · Licht

- **Quellen:**
  - Joyride J17 (Goldstandard), Bilder `pictures/` aus dem J17-Paket bzw. auf GitHub unter `tools/KFB-ToolBox/_inbox/`;
  - KayKit-Previews;
  - Quaternius-MegaKit-Previews (öffentlich: quaternius.com);
  - K1-Licht-Kanon: `KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md` §4 bzw. `skills/chat`.
- **Ergebnis:** `C_LIGHT.md` mit einem empfohlenen Licht-Rig für KFB (Sonne: Farbe, Stärke, Höhe, Azimut; Hemi bzw. Ambient; Fill; Schattenweichheit; Tonemapping; Nebel bzw. Himmel), als Varianten für Tag, Abend und Story-Modes.

## 4 · Teil D · Joyride-Goldstandard-Blatt

Aus den J17-Bildern (`chase-curve`, `chase-straight`, `chase-loop`, `hop-in`, `hop-out`) die Look-Regeln der Strecke festhalten: Fahrbahnfarbe, Bandenform und -farbe, Kurvenneigung, Höhenwechsel, Looping, Stützen bzw. Pfeiler, Abstand zur Umgebung, Kamera. Die Paletten je Welt stehen in `track-look.v5` WORLDS. Ergebnis: `D_JOYRIDE_GOLD.md`. Daraus baut die Claude-Bau-Sitzung das Strecken-Rückgrat.

## 5 · Maschinenlesbare Regeln

`scene-rules.json` (Schema `kfb.scene-rules/1`):
- `composition`: Gruppen-Größen, Staffel, Abstände in H, Versenkung in % der Höhe, Bewuchs an Kontaktkanten;
- `biomes`: je Biom Asset-Klassen, Dichte, Palette;
- `light`: Rig-Parameter;
- `staging`: Kamera bzw. 360°-Flug.

Alle Zahlen mit Quelle (Datei bzw. Bild und Bildnummer).

## 6 · Optional: Bildgenerierung

Höchstens 3 Stimmungsblätter (z. B. „Archipel im Raum mit Joyride-Strecke“), **bauarm** (höchstens 5–6 große Formen je Element, Claymation, keine Logos bzw. Figuren-Erfindungen), klar als „Stimmung, nicht Vorgabe“ beschriftet. Ablage als ZIP für Georg; auf GitHub nur `PROMPT.md`.

## 7 · Regeln

- Nur Doku und Bilder aus CC0- bzw. eigenem Material auf GitHub. Keine Code-Änderungen, kein Merge.
- `RECOVERY.md` und `CHANGELOG.md` (additiv) im Ordner, nach jedem Teil aktualisiert.
- Ehrlich kennzeichnen: gemessen, geschätzt oder Vermutung.
- Reihenfolge: D → A → C → B (B, sobald Georgs ZIP da ist).

## 8 · Treppen-Test (`BRIEF_WSA_MODELLING_TEST_R1.md`)

Zurückgestellt. Treppen setzt Georg künftig selbst im Insel-Editor aus Bestand (KayKit bzw. Kenney) zusammen. Nicht starten.
