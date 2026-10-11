# KFB Lebensschicht · Plan R1 (Ergänzung zu Plan R1, Phasen I bis K)

Status: **VORSCHLAG 2026-10-12** · Fable-Review-Sitzung (Mac mini) · ersetzt nichts. Hängt sich als Phasen I, J, K an `KFB_WORLDBUILDER_PLAN_R1.md` und folgt dem Register (`DECISIONS.md`, V-001 bis V-184). Löst den Entwurf „Masterplan R3 Integrationsslices“ vom 12.10. früh ab, der noch gegen den abgelösten Masterplan R2 gedacht war (V-117).

Zweck: der Teil, den Plan R1 bisher nicht hat. Plan R1 führt zu einem Worldbuilder mit Strecke, Inseln, Editor und Figurenauswahl (A bis H). Georg will darin **prüfen, ob Modelle und Bewohner-Zuordnungen im Spiel funktionieren**, mit Bewohnern, die etwas tun (Kulturmechaniken V-181, Choreografien V-177), sprechen (ChatterBox, Triplets) und sich erinnern (Lean Memory). Dieser Plan beschreibt diese Lebensschicht als drei Phasen, jede als One-Shot-Auftrag, und nennt die Blindspots offen.

Konvention: keine Bindestriche als Satzzeichen, echte Umlaute, Kausalität über „also“ und „aber“. V-Nummern in eckigen Klammern verweisen auf das Register.

---

## 0 · Grundsätze, übernommen und nicht neu erfunden

1. **Georg gestaltet, wir bauen Werkzeuge** [V-002]. Die Lebensschicht ist ein Werkzeug: Bewohner zuordnen, Aktivitäten setzen, im Spiel ansehen. Keine Kritiker-Endlosschleifen, Abnahme durch Georg im Spiel.
2. **Vorlage zuerst** [V-001, V-140]. Jeder Baustein unten nennt seinen Bestand. „Fehlt“ steht nur mit Such-Protokoll aus `MOTION_GUIDE_R1.md` §1a.
3. **Höchstens zwei Baustellen** [V-005]. Die Lebensschicht ist eine Baustelle; sie beginnt erst, wenn Phase C (Rückgrat) und Phase F (Insel-Editor) so weit sind, dass eine Insel mit Georgs Zuordnungen steht. Bis dahin laufen nur die Zulieferungen (§4).
4. **Parity vor jeder Lieferung** (`tools/parity`), Bericht mit V-Nummern [V-003]. Jede Phase unten fügt ihre Tests hinzu.
5. **Rezept ≠ Spielstand.** Bewohner, Aktivitäten und Decks stehen im Insel-Rezept (`kfb.island-config/1`, Felder aus dem Architektur-Review R1). Erinnerung, Beziehung und Sammlung stehen nur im Spielstand (`PLAYER_SAVE`, Lean Memory §10/§11). Generierter Text vergibt nie Karten oder Rechte.
6. **Figur ist Datum, Runtime wählt** (H&D Runtime Strategy, Leitfaden §1d): `{character, emotion, pose, prop, isTalking}` als Laufzeit-Datum; Augen, Brauen, Mund und Clip wählt die Laufzeit. Animationsschicht und Textschicht lesen denselben Beat und kennen einander nicht.

## 1 · Was die Lebensschicht im Spiel leisten muss (Zielbild)

Georg stellt im God-Mode (Phase F) auf einer Insel drei Bewohner ab, gibt jedem eine Karte, eine Welt-Variante und ein Tagesprogramm aus Knoten (`nodes[]`: home, source, work, market, social, stage). Er schaltet in den Spielmodus (Plakette V-040). Die Bewohner laufen ihr Programm: der Farmer geht zur Quelle, erntet, trägt zum Lager, macht am Marktplatz einen Sozialstopp, geht heim. Am Marktplatz jongliert der Clown (J5). Eine Wache patrouilliert eine Route. An einer Bühne tanzen zwei, an einem Tisch debattieren zwei, einer liest auf einer Bank. FrizzleBob nähert sich: Beat `annähern`, der Bewohner schaut auf (Augen vor Kopf vor Körper, Survival Kit). Beat `grüßen`: Nicken, Sprechblase [V-085], eine Zeile aus dem Triplet-Pool mit Herkunft, Stimme über den Voice Layer. Georg wählt aus einer Liste, was er sagen könnte (Monkey-Island-Logik). Beim Neuladen grüßt derselbe Bewohner anders, weil im Ledger eine Begegnung steht. Keine Herzchen, keine Zahl im Bild [V-041].

Das ist der Test, den Georg will: Wenn ein Modell, eine Figurenkarte oder eine Zuordnung nicht stimmt, sieht er es hier, im Spiel, ohne Kritiker.

## 2 · Die drei Phasen

### Phase I · Bewohner leben (Aktivitäten, Beats, Kulturmechaniken)

**Ergebnis:** Bewohner auf einer Insel führen ein Tagesprogramm nach Knoten und spielen Kulturmechaniken als Choreografien. Ein Beat-Bus sendet `annähern, grüßen, anbieten, reagieren, ablehnen, weggehen`; Animationsschicht wählt darauf.

| Baustein | Vorlage (1:1) | Neu | Gate (im Spiel, von Georg) |
| --- | --- | --- | --- |
| Figuren-Karte als Laufzeit-Datum | `public/cards/farmer_a.card.json`, `SPEC_CHARACTER_INTEGRITY_R1.md`, Figuren-Auswahl B2 (67 Figuren, V-061), Augen V-090 | Felder `activities[]`, `repertoire[]`, `variant` je Welt; `approved` gesetzt | drei Karten mit Georgs PASS, Validator grün (Augen, Prop, Sitz) |
| Aktivitätsgraph über `nodes[]` | Rezeptfelder aus dem Architektur-Review R1 (`nodes: resource, water, farm, craft, stage`); Story Recovery §6.3 Farmer-Route; `src/island/composition.ts` (Landmarke, Freifläche, Wege) | Knoten-Typen `home, source, work, market, social, stage, patrol`; Wegeplanung auf dem Geh-Netz (`trail`-Skin, V-152, V-155) | ein Farmer läuft 10 Minuten seine Route ohne Stillstand, Durchdringung oder Teleport; sichtbar im Spiel |
| Beat-Bus | Card-Szene Beat-Uhr (`npc-card-spec-01`, Verben settle, card, emote, gaze, say, think, motion), ChatterBox `stage3d.js` (Nicken, Rückprall, Blick) | Beat-Typen aus dem Review-Briefing; Abstand bzw. Blick als Auslöser | Annähern löst Blick aus, Grüßen löst Nicken aus, Weggehen löst Rückkehr ins Programm aus |
| Survival Kit MVP 1 | Leitfaden §1d, Eye-Rig v6, `idle_breathe, look_at, blink, hop, turn_90` | Zustandsmaschine Ebene 1 bis 4 nach §3e/§5 | Augen vor Kopf vor Körper bei jedem Beat |
| Kulturmechaniken, erste drei | V-181; Clips: Jonglage J5 (unverändert), `Sit_Chair_Idle`, `Waving`, `Cheering` (Lab); Tanz nur im Legacy-Rig bzw. Mixamo (V-179 erlaubt Mixamo, nie öffentlich); Lesen: `Sit_*` plus Prop Buch; Debatte: zwei Figuren, Wechselrede als Pose-Beats aus `Interact`, `Throw`, `Hit_A` als Betonung | Choreografie-Daten je Mechanik nach Leitfaden §3d (fünf NPC-Vorlagen) | Blindlese bei 24 px erkennt die Tätigkeit ohne Text („der jongliert“, „die tanzen“, „der liest“) |
| Patrouille, Wache | `Walking_A`, Route als `patrol`-Knotenfolge; Dark Knight als Wache (Masterplan-Bewohner, im Register nicht abgelöst) | Routen-Typ `patrol` mit Haltepunkten und `look_at` | Wache läuft Runde, bleibt an Haltepunkten, schaut Spieler an |

**Nicht in Phase I:** Rauferei, Brick-Fish, Kayfabulieren (V-181: Details kommen von Georg, nach MVP laut CHANGELOG 11.10.), Fluff-Zonen (V-082), Kampf (Leitfaden §4).

**Zulieferung, kritischer Pfad:** WSA-Clip-Katalog (`BRIEF_WSA_CLIP_CATALOG_R1.md`, läuft) liefert die Lücken; Blender-Coworker baut nur die Clips, die der Katalog als „nicht gefunden“ ausweist, nach dem Tag-Schema (Leitfaden §1d).

### Phase J · Bewohner sprechen (ChatterBox, Triplets, Blasen)

**Ergebnis:** Zwei Bewohner sprechen; Gespräch als Liste dessen, was man sagen könnte; Zeilen aus dem Triplet-Pool mit Herkunft; Stimme über den Voice Layer; Sprechblasen als Comic-UI [V-085]; eine gehörte Entgegnung wird sammelbar.

| Baustein | Vorlage (1:1) | Neu | Gate |
| --- | --- | --- | --- |
| Pool und Adapter | ChatterBox `chatter-phrases.js`, `chatterbox-core.js`, Triplet-Pool + Resident-Chatter-Adapter (PR #305/#310), Voice Layer `real-pool-adapter.js` (PR #379, alle Stimmen KEEP) | Pool-Export je MVP-Bewohner mit Zählung; unter 20 Zeilen je Figur gilt als Platzhalter (Q7) | jede Zeile trägt `deckId + cardNumber` oder Triplet-ID |
| Gesprächsliste | Monkey-Island-Logik (Briefing §5): Auswahl, kein Verzweigen; soziale Operatoren BINGO, BOGGLE, BONGO, BLÖDSINN (ChatterBox) | Liste im HUD-R3-Stil [V-040], keine Zahl | Georg wählt drei Zeilen, Bewohner antwortet passend |
| Sprechen als Animation | Fake-Lip-Sync (drei Mundformen) nach H&D, Nicken aus `stage3d.js`; Brauen `brow-rig.v2` jetzt ins Lab [V-179]; Mund Phase H [V-086] | `isTalking` als Laufzeit-Datum | Bubble auch stumm; ein AudioContext [V-042] |
| Sammelbare Entgegnung | Lean Memory §10/§11 Karten-Sammlung mit Herkunft | Entgegnung als Eintrag im Spielstand, nicht im Rezept | nach Neuladen steht die Entgegnung zur Wahl |

### Phase K · Welt erinnert sich (Lean Memory, Reaktion, Editor im Spiel)

**Ergebnis:** `PLAYER_SAVE` plus Ereignis-Ledger als ein Modul; Beziehung durch Wiederholung, keine Anzeige; sechs Reaktionsstufen als reiner Selektor; Gerücht einen Schritt weit; God-Mode-Edit an Bewohnern wirkt sofort im Spiel.

| Baustein | Vorlage (1:1) | Neu | Gate |
| --- | --- | --- | --- |
| Spielstand und Ledger | `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` §10/§11; Autoren-Roundtrip des Lab (Export, Neuladen, Import) | Datei im Lab, Export wie das Rezept | Save, Entladen, Import, Neuladen: gleicher Stand, kein doppeltes Ereignis |
| Reaktionsstufen | Reputation sechs Stufen v1.1 (Academy-Branch), `relationshipBand` als Besitzer | Selektor über Ledger und Sammlung; Welten mit mehreren Decks addieren nicht | zweite Begrüßung verschieden, ohne Balken, ohne Zahl |
| Gerücht ein Schritt | Gatekeeper-Grammatik v1.0 (nur Gerücht-Teil) | Nachbar erwähnt den Gefallen einmal | nach Gefallen bei A sagt B einen Satz dazu |
| Editor im Spiel | Phase F God-Mode, Plakette V-040, Rezeptfelder `residents {id, card, variant}` | Zuordnung ändern, Spielmodus, Bewohner tut das Neue; Ledger bleibt | Georg tauscht Karte oder Variante und prüft im Spiel |

## 3 · Reihenfolge und Abhängigkeiten

```
Plan R1:  A ✓ → B ✓ → C (läuft) → D → E → F ──┐
Lebensschicht:                                  I → J → K
Zulieferungen (parallel ab jetzt): WSA-Clip-Katalog → Blender-Clips (nur Lücken) → ChatterBox-Pool-Export
```

- **I** braucht F (Insel mit Georgs Zuordnungen) und den Clip-Katalog. Vorher nur Zulieferungen, keine Lab-Baustelle (V-005).
- **J** braucht I (Beats) und den Pool-Export.
- **K** braucht J.
- Strecke, Tunnel, Rennstücke (C, E) laufen unabhängig weiter; die Lebensschicht nutzt sie nur als Wege.

**Was dieser Plan nicht ändert:** Reihenfolge A bis H, Joyride-Goldstandard [V-010], Besitz Track Core bei RKIT und Look im Lab [V-118, V-134], Figuren nie skalieren [V-060].

## 4 · Das One-Shot-Format je Phase

Georg will Phasen starten können, ohne dass Token in Erkundung, Rückfragen und Nachbesserungen verbrennen [V-008]. Jeder Auftrag hat denselben Aufbau; die Sitzung endet mit einem Abnahmepaket, nie mit „fertig“.

1. **Leseliste, geschlossen:** `DECISIONS.md` (nur die V-Nummern des Auftrags), `START_HERE_STEERING.md`, Plan R1 §0, dieser Plan (die eine Phase), `MOTION_GUIDE_R1.md` §2b, §3b bis §3f, §5, die genannten Vorlagen. Nichts anderes wird erkundet.
2. **Vorlage-zuerst-Zeile** je Baustein an die Steuerung, bevor Code entsteht [V-001]. Die Tabelle oben ist der Entwurf dieser Zeilen.
3. **Ergebnis in einem Satz** und die Gates der Tabelle als Parity-Tests (`tools/parity/<phase>.mjs`), die die Sitzung selbst schreibt und laufen lässt.
4. **Harte Regeln als Messung:** Q1 bis Q9 (QA-Protokoll §1b), Leitfaden §5 Clip-Vertrag mit Tag-Schema, keine Zahl im Spielbild [V-041], ein AudioContext [V-042].
5. **Stopp-Regeln:** zwei Reparaturrunden je Befund; fehlende Zulieferung heißt beschrifteter Platzhalter (Q7) und weiter; Unklares an die Steuerung mit Bildstelle, nicht ausdenken [V-148].
6. **Abnahmepaket** `docs/critic/lab-life/<datum>_<phase>/`: Parity-Bericht mit V-Nummern, Spiel-URL (`?play=game&...`), kurzes Video oder Standbild-Serie [V-008], Liste offener Fragen, Eintrag im Projektstand. Georg sieht es im Spiel [V-002].
7. **Verbote:** keine neuen Systeme, kein Nachbau vorhandener Module (Eye-Rig, Card Builder, Track Core, Ink-Kanon), keine Meter, keine Konstante ohne Messung, keine Eigenschaft aus Dateinamen.

Modellneutral: Fable 5, Astra oder Soul 6.1 bauen eine Phase; ein anderes Modell darf blind lesen (Blindlese-Test bei 24 px), nicht benoten.

## 5 · Blindspots, offen benannt

| Blindspot | Warum er zählt | Vorschlag |
| --- | --- | --- |
| **Clips für Kulturmechaniken** | Tanz nur im Legacy-Rig bzw. Mixamo, kein Sprech-Clip, kein Beifahrer-Clip (Leitfaden §1c L6); der Clip-Katalog läuft erst | Phase I erst nach Katalog; Blender baut nur Lücken; Mixamo nur retargetet [V-179] |
| **Kanon der neuen Inhalte** | Prison Island ist als Mauer-Referenz da [V-105, V-121], Toy Soldiers, Brick-Fish und Kayfabulieren sind benannt (CHANGELOG 11.10.), aber ohne Satz nach Weltlogik [V-015] | Georg liefert je ein Blatt „wer, was, warum“; bis dahin Platzhalter-Knoten, kein Inhalt |
| **Triplet-Menge je Figur** | Pool existiert, Umfang je MVP-Bewohner unbekannt | Pool-Export mit Zählung vor J; unter 20 Zeilen gilt als Platzhalter |
| **Spielstand ohne Laufzeit** | Lean-Memory-Architektur nur Text; Ablageort (Datei, localStorage, Site) offen | K legt eine Datei im Lab an, Site später |
| **Mobil** | im Register nicht vorhanden; der Review maß 74 % Panel-Abdeckung bei 375 × 812 und Schattenkarte 4096² | eigene Entscheidung von Georg: Mobil als Qualitätsboden ja oder nein; wenn ja, eine Lab-Phase mit Profil (dpr, Schatten, Touch-Orbit) |
| **Tusche** | kein Konturpass im Lab; beide Blindtests sagen „nicht dasselbe Universum wie die Karte“; im Register nur Sprechblasen [V-085] | Entscheidung von Georg; wenn ja, Ink-Kanon des Deck Viewers als Post-Pass mit Schalter, Bildpaar im Spiel |
| **Fehlende Assets unsichtbar** | Vite-Dev-Server antwortet auf fehlende Dateien mit 200 und HTML; fehlende Texturen lösen keinen Fehler aus | 404-Middleware für `/assets/*` im Lab, kleiner Patch, vor Phase I |
| **Fußpunkt** | im alten Stand vier Definitionen (Gebäude konstruktiv 0,07 über dem Pad, Autos bis 0,31 am Hang); im Schnappschuss 11.10. nicht nachgeprüft | Steuerung prüft gegen `composition.ts`, `grounding.ts`, Q1; wenn noch mehrfach, eine Fußpunkt-Funktion vor Phase I |
| **Determinismus der Zierschicht** | Animationsphase und Blinzeln aus `Math.random`; Audit V-171 Punkt 6 nennt deterministische Tests | Seed je Bewohner-ID; Lint gegen `Math.random` außerhalb des Editors |
| **Zwei Dropbox-Stände** | Mac mini sah einen Stand vom 08. bis 10.10.; die Steuerung arbeitet in der GitHub-Arbeitskopie; der Hub-Zeiger nennt Dropbox als SSOT | Register-Regel ergänzen: Dropbox-Kopie gilt nur, wenn Kopf-Datum gleich GitHub; sonst GitHub [V-117] |
| **Leistung mit Leben** | 120 Calls ohne Bewohner (alter Stand); jeder Bewohner mit Knet-Material kostet Calls; V-115 Schranke 30 fps | Budget je Phase im Parity; Bewohner-Materialien teilen |

## 6 · Erster Schritt

Kein Bau. Drei Zulieferungen anstoßen, die ohne Lab-Baustelle laufen: (1) WSA-Clip-Katalog abwarten, (2) ChatterBox-Pool-Export je MVP-Bewohner mit Zählung beauftragen, (3) Georgs Blätter zu Prison Island, Toy Soldiers, Brick-Fish, Kayfabulieren anfragen. Sobald Phase F eine Insel mit Zuordnungen hat, startet Phase I als One-Shot nach §4.

---

*Bestätigung durch Georg nötig für: Phasen I bis K als Anhang an Plan R1; Mobil und Tusche als Entscheidungen; Kanon-Blätter für die neuen Inhalte.*
