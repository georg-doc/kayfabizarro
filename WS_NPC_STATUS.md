# WS_NPC_STATUS · Sitzung „WS-NPC“ (Bewohner-Leben, Begegnung, Dark Fluffer)
Auftrag: `BRIEF_WS1_NPC_LIFE_R2.md` (V-585). Lead: WS1 „R3F Modul-Host Vertrag“. Empfänger: Lead (schreibt den Abschnitt WS-NPC in `WS1_STATUS.md`), WS0 liest hier direkt.
Neueste Einträge oben.

## 1 · 21.10. · Inventur-Entwurf + Bauplan Phase A

**Gelesen:** Brief R2, Dark-Fluffer-Brief, Patrol-Spec, PR-#400-Paket (R0.6, R0.7, R0.8, R1-Audit, Workshop R1, Intake, R0.9, Fluffer-Konzept + Follow-on), Dramatis Personae + Writers Room (`ws-song/workshop-r1`: FIGURES_R1, PERSONAE_PATCH_R1, RESIDENT_DP_ALIGNMENT_R1, Export 2026-10-20c), CANON_3D R1 + Konzeptblatt-Vorlage + Kritiker, PR #210 `encounter-bus.js` @f534a056, PR #272 AIDA @992ea98, Spielcode `terrain/439` @fd5ccc5.
**Nicht gelesen:** `60_CAST/cast.r1.json`, `clips.r1.json` (nur im Hub/Dropbox, auf diesem Mac nicht vorhanden); Google-Doc (Anmeldung nötig).

**Inventur:** `CANON_3D/sources/WS_NPC_INVENTUR_R1.md` (dieser Zweig). Kurz: Plan-Logik, Begegnungs-Bus und Bewegung lassen sich vollständig aus vorhandenen Quellen bauen. Es fehlen die Figuren-Dateien.

**Blocker (bitte Lead / Georg):**
1. **Farmer B (`farmer_harke`)**: GLB, Augenprofil, Figurenkarte nicht auf diesem Mac. Bitte nach `~/kfb-ws1/private/cast/` kopieren (lokal, nicht in Git), zusammen mit `60_CAST/cast.r1.json` und `clips.r1.json`.
2. Platzhalter zweite Rolle: Vorschlag `adventurer-mage` (im Spiel, KFB-Augen aus Georgs Batch), markiert `PLATZHALTER · Lorekeeper (WSB K11)`. Ob sie in cast.r1.json `ready` ist, kann ich ohne die Datei nicht prüfen.
3. Clip `Waving` (Grüßen) liegt nur unter `~/kfb-ws1/intake/loco/Rig_Medium_Simulation.glb`, nicht im Spiel. Darf ich das Paket as-is nach `src/assets/actors/` aufnehmen?

**Bauplan Phase A** (Laufzeit-Code nur lokal auf `ws-npc/phase-a`, Push erst nach WS0-Go):

| Schritt | Inhalt | Beleg |
|---|---|---|
| A0 Kern (rein, Node) | `src/npc/npcRoute.js` (`kfb.npc-route/1`: Polylinie, Länge, Lage/Blick bei s), `src/npc/npcDay.js` (`kfb.npc-day/1`: Zeit → POI, Aktivität, Route-Variante; `planAt(t)` deterministisch aus Seed + Tag), `src/npc/encounter.js` (Port #210 + `orient`, `silent`, `cancel`, `interrupt`/`resume`, stabile IDs) | Node-Tests: 21 alte #210-Prüfungen + neue (Abbruch, Unterbrechen/Fortsetzen, Überschneidung, Aufräumen, Schweigen, gleicher Seed = gleicher Tag, zwei Seeds = andere Route) |
| A1 Daten | `src/data/npc/pois.r1.json`, `routes.r1.json`, `days.r1.json`: Farmer B Arbeit = Obstgarten-Bäume (Fluff-Ernte), Sozial = Wegkreuzung am Demo-Weg / Amphitheater-Rampe (Theaterdirektorin), Zuhause = Ort ohne neues Asset (Scheune fehlt); Platzhalter-Rolle Arbeit = Billboard-Karte lesen, Sozial = dieselbe Kreuzung. Je Bewohner 2 Routen-Varianten | Node: jeder POI ≥ 1,5 m frei (Bäume, Zaun, Weg), Routen außerhalb des Rang-Zauns, Steigung begrenzt |
| A2 Modul | `src/npc/residentLife.js` (ein ModuleHost-Modul): Darsteller-Slot + GaitAnimator (V-248, Füße stehen), Ankunft = abbremsen → drehen → Blick → Aktions-Clip as-is; **Plan ist Wahrheit**: Abweichungen (Begegnung, Unterbrechung) holen danach im Tempo-Fenster ≤ 1,25× wieder auf. Blase: nah = voll, fern = seltener animiert, Lage immer aus dem Plan. Kinematische Kollider, Spieler-Hinweis über `interactable` | Browser `#m1,harvest,npc,debug,replay` |
| A3 Begegnung | Beide am Sozial-POI → bemerken → annähern → ausrichten → grüßen oder schweigen → reagieren → trennen → weitermachen; Spieler nähert sich → Unterbrechen (Blick, Gruß), danach Fortsetzen | Test: Beat-Folge, beide belegt, keine zweite Begegnung, Fortsetzen am selben Beat |
| A4 Weggehen/Zurückkommen | Spieler > R weg, Zeit läuft, zurück: beide stehen dort, wo der Plan sie sieht; kein Sichtbarkeitswechsel im Kamerabild | Test: Lageabweichung ≤ 0,05 m zum Plan, 0 Pop-ins im Frustum |
| A5 Abnahme | Abnahmematrix (PASS/FAIL/NOT RUN je Zeile), Clip aus der Spielkamera, fps (perfBudget + Messung im Spiel), volle `npm test` | Matrix hier + an Lead |

Einbau in `M1World.jsx` nur hinter dem Hash `npc` (eine Zeile + ein Kollider-Baustein), damit der Diff zum Lead-Stand klein bleibt.

**Nächstes Gate:** Lead/Georg zu Blocker 1–3; WS0 zum Konzeptblatt Phase A. A0 und A1 baue ich jetzt (brauchen keine Figur-Dateien).
