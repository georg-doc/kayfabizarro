> **ARCHIV (14.10.2026, V-228):** abgelöst. Maßgeblich sind `ARCHITECTURE_R1.md` und `DECISIONS.md`.

# Onboarding für einen WSA-Web-Chat · Wireface-Bühne: Design planen und briefen (R1, 14.10.2026)

Du hilfst Georg, ein Briefing für **Claude Design** zu planen: die Gestaltung der **Wireface-Bühne**. Das ist die Bühne, auf der KFB-Figuren Karten präsentieren und sprechen. Diese Bühne soll später ein wiederverwendbares Modul werden. Du baust nichts, du planst und schreibst Briefings.

Quellen liegen im Repo `georg-doc/kayfabizarro`. Das Register ist im Branch `docs/kfb-decisions-register-2026-10-11` unter `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/`, die Wahrheit ist `DECISIONS.md`.

## 1 · Wo wir stehen (bitte zuerst lesen)
- **V-209 (Fokus):** zuerst der karten-basierte Dialog mit Triplets, Openern und Billboards im Wireface-Ansatz. Wie man die Kartenwelt bereist und wie sie aussieht, kommt danach.
- **V-211 · Host-Vertrag R3F** (`replies/KFB_HOST_CONTRACT_R3F_R1.md`): ein Spielrahmen (React Three Fiber, three 0.186.1).
  - Jedes Modul folgt `create(options) → {object3d, update(dt, ctx), dispose()}`.
  - Ein Besitzer für Licht, Nebel und Himmel.
  - Text nur aus dem KEEP-Pool.
- **`KFB_WORKING_RULES_R1.md`:** bewährte Regeln. Vor allem: Vorlage = derselbe Code-Pfad, nichts nachbauen (V-206), und nur Fertiges an Georg.
- **V-084:** Claude Design baut **keine 3D-Geometrie**. Claude Design liefert Gestaltung (Layout, Bildsprache, Farben, Rahmen, UI, Stimmungen). Umgesetzt wird von Claude Code als Modul.

## 2 · Was es schon gibt (übernehmen, nicht neu erfinden)
- **Wireface-Plan:** PR #355, Ausführungspaket R2 (`skills/chat/workflows/KFB_FRANKENSTEIN_COMPOSER_SITE_01_2026-10-04/…EXECUTION_PACKET_R2…`).
  - FrankenStein Composer: KayKit-Körper + KFB-Kopf + Wireface-Gesicht.
  - Audio Site v11 als fertiger Consumer-Vertrag (#365).
  - Triplet-Pool (#379).
- **Bausteine mit Bewertung** (`replies/MODULE_INVENTORY_R1.md`):
  - Kartenbilder `cardImage(deckId, n)`, Viertelseite, `fit`;
  - Clay-Material v10;
  - Kontaktschatten;
  - Skydome;
  - KayKit-Figuren und Clips;
  - Sprechblase plain mit Flip-Reveal (V-204, chatterbox-core);
  - Almanach-Kartenfächer;
  - Clay-VFX.
- **Look-Regeln:**
  - `STYLE_GUIDE_3D_R1.md` (v0.2): J17 als Look-Referenz, Knete, Billboards §6c;
  - `MOTION_GUIDE_R1.md` (v0.2): Emotionen, Emanata als Knet-Plättchen, Survival Kit, Augen → Kopf → Körper.
- **Seek(t)-Beweis:** `replies/NPC_PERFORMANCE_PROOF_R1/`. Eine 8-s-Performance lässt sich Bild für Bild reproduzieren, die Grundlage für Clip-Rendering.
- **Landmarks und Kulissen:**
  - Atomium als modularer Bühnenbaustein (PR #397, Claude-Design-Cut PASS, Tune later);
  - Natur-Assets: Bäume, Felsen, Terrain-Module (PR #393, Intake #392, noch nicht konvertiert).

## 3 · Ziel: eine Bühne, vier Einsätze
Die Wireface-Bühne ist **ein** Modul mit Varianten, kein Einzelstück. Sie soll funktionieren:
1. **Im Spiel auf Inseln bzw. in Kartenzonen:** Ein Figur trifft man unterwegs, sie spricht eine Karte an, die Karte steht am Billboard.
2. **Als Authoring-Werkzeug für Karten-Promo-Clips:**
   - Georg wählt Karte, Figur(en), Opener bzw. Triplet, Kulisse und Kameraeinstellungen.
   - Das Werkzeug spielt es deterministisch ab (seek(t)) und rendert einen Clip, etwa für Social Media.
3. **Für Demo-Gameplay bzw. Simulation:** kurze automatisch ablaufende Szenen, zum Beispiel ein Zug im Kartenspiel.
4. **Später im React-Spiel** als Modul nach dem Host-Vertrag.

## 4 · Was du mit Georg klären sollst
1. **Bühnenbausteine:**
   - Welche Elemente braucht jede Bühne? Zum Beispiel Boden bzw. Podest, Kulisse (Landmark, Natur, Insel-Ausschnitt), Billboard bzw. Kartenrahmen, Licht-Stimmung, Sprechblasen-Zone, Platz für 1–3 Figuren.
   - Welche davon gibt es schon (§2)?
2. **Bildsprache und Kamera:**
   - Feste Einstellungen wie Totale, Zwei-Schuss, Nah aufs Gesicht, Insert auf die Karte.
   - Wie wird zwischen ihnen geschnitten, im Takt der Triplets (0 / 520 / 1040 ms)?
3. **Karte im Bild:**
   - Billboard-Rahmen je Skin (Style Guide §6c);
   - die Karte ist Inhalt und wird nie beschnitten;
   - Opener- bzw. Triplet-Blasen ohne Tusche.
4. **Varianten:** Insel (draußen, Tageslicht), Kartenzone (Tisch bzw. Diorama), Studio (neutral, für Promo-Clips).
5. **Authoring-Oberfläche:**
   - Was muss Georg einstellen können? Karte, Figur, Text aus dem Pool, Kulisse, Kamera, Länge, Exportformat.
   - Wie sieht das aus? Das ist Claude-Design-Arbeit.
6. **Abgrenzung:**
   - Was entwirft Claude Design: Layouts, Rahmen, Stimmungen, UI, Shot-Liste.
   - Was setzt Claude Code als Modul um.
   - Was kommt aus Blender (Kulissen-Meshes).

## 5 · Ergebnis dieses Chats
1. **Briefing für Claude Design** (eine Seite):
   - Bühnen-Layouts für 3 Varianten;
   - Billboard- bzw. Kartenrahmen;
   - Kamera-Shotliste mit Beispielbildern;
   - Licht-Stimmungen;
   - Entwurf der Authoring-Oberfläche.
   Ausdrücklich ohne 3D-Geometrie (V-084), aufbauend auf Style Guide, Motion Guide und vorhandenen Bausteinen.
2. **Modul-Liste für Claude Code:** welche Module die Bühne braucht (z. B. `stage`, `shotDirector`, `billboard`, `bubbleLayer`, `clipRecorder`), jedes mit Quelle aus §2 bzw. „neu, weil …“.
3. **Offene Fragen an Georg:** höchstens 5, je mit einem Klick beantwortbar.

## 6 · Regeln
- **Nichts erfinden.** Texte nur aus Pool bzw. Karte. Figuren, Kulissen und Assets nur aus dem Bestand oder klar als „Vorschlag“ markiert.
- **Kurz und konkret,** mit Beispielen aus dem KFB-Universum.
- **Keine Lizenz- oder „kein Merge“-Floskeln (V-184).** Nur einen neuen, ungeklärten Fall in einer Zeile.
- **Ablage:** auf GitHub im Register-Branch unter `replies/`. Die Steuerung trägt Entscheidungen mit V-Nummer ein.
