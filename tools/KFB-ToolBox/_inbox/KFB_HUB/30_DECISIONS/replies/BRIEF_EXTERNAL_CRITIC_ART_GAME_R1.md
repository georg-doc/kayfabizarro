# Briefing · Externer Kritiker: Game Design, Art Direction, Cartoon-Animation, Immersion (R1, 18.10.2026 · V-473 · Hub b119)

Für: OpenAI Codex (oder ChatGPT mit Repo-Zugriff). Auftraggeber: Georg (Creative Lead). Steuerung: WS0 (Claude Code).
Sprache der Ergebnisse: Deutsch, kurze Sätze.

---

## 0 · Deine Rolle in einem Satz
Du bist ein **externer, ergebnisoffener Kritiker und Ideengeber** – Spieletester, Art Director und Cartoon-Animationsspezialist in einer Person. Du stärkst den **Kern** von Kayfabizarro (KFB). Neue Großbaustellen machst du nicht auf.

Du baust nichts ins Spiel ein. Du lieferst **Kritik, zehn Vorschläge und bis zu drei Konzept-Entwürfe**. Die prüft WS0 einzeln, Georg entscheidet, und erst dann wird integriert.

## 1 · Was KFB ist
- **Kayfabizarro** ist Georgs satirisch-surreales Kartenspiel-Universum mit vielen Decks: Verschwörung, Geschichte, MED, Märchen, Freud, Romantik …
- Bekannte Figuren: Uncle FrizzleBob, Lord Hunky & Lady Dory, King Kayfabian, der Lorekeeper, GothGirl.
- **Das Spiel:** eine Open World im Browser (three.js) als *chill & fun cosmic roadtrip*.
  - Schwebende Inseln (Zonen), verbunden durch eine Cartoon-Stunt-Strecke.
  - Claymation-/Knete-Look, cozy Musik (eigene Suno-Songs).
  - Weird-psychedelische Cartoon-Meta-Erfahrung.
- **Die Welt soll leben:** Sie reagiert, atmet und interagiert.
  - NPCs haben Weltwissen aus ihren Karten-Zonen.
  - Sie führen untereinander und mit dem Spieler **Kulturtechniken** aus: Debatte, Geschenk, Tanz, Rauferei, Brick-Fish-Wurf, Kayfabulieren, Fluff ernten, formen und zerstören, Lesen (V-181).
- **Gesprochen wird in Triplets:** Karten-Mini-Storys mit Subjekt → Verknüpfung → Lore-Bedeutung (V-231–V-235).
- **Larger than life:** Die Figuren, auch Georg und das Team als Cartoon-Personas, sind überzeichnete Persönlichkeiten. Sie haben Charakterentwicklung und eine Heldenreise des Spielers durch die Open World.
- **Georg ist Autor.** Er gestaltet über **God-Mode / World-Builder** und die Toolbox. Inhalte müssen deshalb **als Daten (JSON) autorbar** sein, nicht als Code je Fall (V-002, V-306).

## 2 · Was wir von dir wollen (Schwerpunkte)
Du blickst explorativ und ergebnisoffen auf folgende Felder:

1. **Spielgefühl und Core Loop:** Was macht die ersten 5, 30 und 120 Minuten unterhaltsam? Wo fehlt ein Grund weiterzuspielen?
2. **Cozy, Chill & Fun plus Weird:** Wie halten wir Gemütlichkeit und psychedelisch-satirische Meta-Ebene im Gleichgewicht, ohne dass eines das andere erschlägt?
3. **Lebende Welt und emergente NPC-Logik:**
   - Wie verbinden sich Patrouillen, Zufallsbegegnungen, Gedächtnis, Zonen-Weltwissen und Kulturtechniken zu Momenten, die nicht geskriptet wirken?
   - Gibt es einfache Regeln mit großer Wirkung?
4. **Art Direction:**
   - Farbdesign, Licht und Stimmung (Tag/Abend/Nacht), Lesbarkeit;
   - Silhouetten, Material-Lesart (Knete, Stein, Kristall);
   - Konsistenz zwischen Zonen.
5. **Cartoon-Animation:**
   - Squash & Stretch, Emanata, Acting-Anlässe, NPC-Choreografien;
   - VFX mit „Low Effort, High Impact“ (V-357/V-360: ein Antriebseffekt für alle Fahrzeuge, gemeinsames VFX-Budget).
6. **Figuren und Meta-Narrativ:**
   - Persönlichkeitsentwicklung, larger-than-life Personas, Heldenreise in der Open World;
   - wie das sauber in den **Figuren- und Welt-JSONs** verankert wird (Schema-Ebene, nicht Prosa).
7. **Autor-Werkzeug:** Was davon kann Georg im God-Mode selbst setzen? Welche minimalen Datenfelder braucht es dafür?

Ausdrücklich erwünscht: **Dinge, an die wir noch nicht gedacht haben**, die aber sehr gut zu unserem Konzept passen.

## 3 · Was wir nicht wollen
- Keine neuen Großsysteme, keine neuen Tools. Es gibt genau fünf Orte: Hub, Spiel, Figuren-Werkstatt, Sound-Studio, Asset-Bibliothek (V-390).
- Kein Umbau der Architektur. Sie ist bewusst schlank; schlage Erweiterungen **an bestehenden Andockstellen** vor.
- Keine Prosa-Visionen ohne Umsetzungsweg. Jeder Vorschlag nennt das Modul bzw. die JSON-Stelle, an der er andockt.
- Keine Code-Änderungen, keine Downloads, keine privaten oder gekauften Assets.
- Entscheidungen mit Status RULE/PASS in `DECISIONS.md` gelten. Du darfst ihnen widersprechen, musst den Vorschlag dann aber mit „**widerspricht V-xxx**“ markieren und begründen.

## 4 · Lesen (Repo `georg-doc/kayfabizarro`)
Steuerungs-Ordner auf Branch `docs/kfb-decisions-register-2026-10-11` unter `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/` (im Folgenden `D/`).

**Pflicht (in dieser Reihenfolge):**
1. `D/ARCHITECTURE_R1.md` und `D/KFB_WORKING_RULES_R1.md`: Aufbau und Arbeitsregeln.
2. `D/DECISIONS.md`: Georgs Entscheidungen. Überfliegen, RULE- und PASS-Zeilen ernst nehmen.
3. `D/replies/WORLD_CONCEPT_R1.md`, `D/replies/GAME_LOOP_R1.md`, `D/replies/WORLD_CONTRACT_R1.md` plus Schemas in `D/replies/WORLD_CONTRACT_R1/`.
4. `D/replies/TOOL_MAP_R1.md`, `D/replies/WORLDBUILDER_MODULE_MAP_R1.md`: God-Mode, World-Builder, Toolbox.
5. **NPC und Dialog:**
   - `D/replies/SPEC_NPC_PATROL_R1.md`, `D/replies/SPEC_SCENE_PACK_R1.md`;
   - `D/replies/TRIPLET_SET_SPEC_R2.md`, `D/replies/TRIPLET_METHOD_FROM_WRINKLE_R1.md`, `D/replies/NPC_PERFORMANCE_PROOF_R1/`.
6. **Figuren:** `D/replies/WSA_DRAMATIS_PERSONAE_R1_SOURCE/` (Daten im Unterordner `data/`), `D/replies/WSA_DRAMATIS_PERSONAE_R1_RETURN.md`.
7. **Look und Bewegung:** `D/STYLE_GUIDE_3D_R1.md`, `D/MOTION_GUIDE_R1.md`, `D/replies/FLUFF_WORLD_DRESSING_R1.md`, `D/replies/CONCEPTS_FLUFF_MINIGAMES_R1/`, `D/replies/HUD_R4_DESIGN/`.
8. **Regeln des Kartenspiels:** `Kayfabizarro_Freestyle_Rules_v18-4.md` auf `main`.

**Stand des Spiels:**
- `WS1_STATUS.md` auf Branch `ws1/r3f-frame`; die obersten Abschnitte zeigen den aktuellen Stand.
- Vorschau (falls du Web-Zugriff hast): https://ws1-preview.kayfabizarro.pages.dev/#m1,car (Fahren) und `#stage,actors=fb,light=l1` (Bühne).

Was du nicht findest, meldest du als „nicht gefunden in …“, nicht als „gibt es nicht“.

## 5 · Lieferung
Neuer Branch `proposals/external-critic-r1-<datum>`. Darauf nur der Ordner `proposals/EXTERNAL_CRITIC_R1/`, nichts sonst.

1. **`UNDERSTANDING.md`** (max. 1 Seite): So verstehe ich KFB, Kern-Loop, Ton und Zielgefühl. WS0 prüft daran, ob du das Projekt richtig gelesen hast.
2. **`CRITIQUE.md`:**
   - 5 Stärken, die wir schützen müssen;
   - 6–8 Schwächen bzw. Risiken, je Feld aus §2;
   - jeweils mit Fundstelle (Datei bzw. V-Nummer).
3. **`TOP10.md`:** zehn Vorschläge, sortiert nach Wirkung pro Aufwand. Je Vorschlag:
   - Titel und ein Satz Idee;
   - Warum es zu KFB passt (Bezug auf Konzept bzw. V-Nummer);
   - Spielermoment: Was erlebt der Spieler konkret? (2–3 Sätze, als Szene);
   - Andockstelle: Modul bzw. JSON-Feld; was Georg im God-Mode setzt;
   - Aufwand S/M/L, Risiko, Abhängigkeiten;
   - neu oder Ausbau von Bestehendem.
4. **`DRAFTS/`:** bis zu **drei** Konzept-Entwürfe für deine stärksten Vorschläge. Je Entwurf:
   - eine Markdown-Seite;
   - bei Datenvorschlägen ein **Beispiel-JSON** plus Schema-Delta als Draft-Datei (z. B. Persona/Arc-Felder einer Figur, NPC-Gedächtnis, Zonen-Weltwissen, Heldenreise-Beats).
   - Modular: jeder Entwurf einzeln prüf- und integrierbar.
5. **`index.json`:** maschinenlesbare Liste. Format:
   ```
   { "schema": "kfb.proposal-index.v1", "items": [ { "id", "title", "field", "effort", "risk", "anchor", "conflictsWith": [] } ] }
   ```

Umfang: lieber zehn scharfe Vorschläge als dreißig vage. Keine Füllsätze, keine generischen Game-Design-Allgemeinplätze. Jeder Satz muss sich auf KFB beziehen.

## 6 · Ablauf danach (zu deiner Info)
WS0 liest die Lieferung. Jeder Vorschlag kommt als Ankreuz-Frage in Georgs Hub (PASS / TUNE / FAIL). Nur PASS-Vorschläge bekommen eine V-Nummer und eine eigene Vorlagen-Zeile beim zuständigen Bau-Strang.

Möglich ist eine **Stufe 2**: Sobald der Integrations-Slice spielbar ist (Laufen, Fahren, Fundsachen, eine NPC-Patrouille mit Triplet-Debatte), folgt ein zweiter Durchgang. Der ist dann Spieltest mit Video bzw. Screenshots, mit Fokus auf Spielgefühl, Farbe und Immersion.
