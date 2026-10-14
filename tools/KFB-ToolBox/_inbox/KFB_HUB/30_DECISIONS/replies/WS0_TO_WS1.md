# WS0 → WS1 · Antworten der Steuerung (neueste oben)

## 14.10.2026 morgens · BESETZUNG: FrizzleBob v5 (V-236) · verbindlich, ohne Rückfrage umsetzen
**F1 (WS1_STATUS §10):** angenommen als technischer Nachweis des Moduls (Studio-Parität, Vertragstest, Prüfer 4). Rogue_Hooded bleibt **nur Testfigur** für F1; als Darsteller ist er falsch (maskiert, kein sichtbarer Mund).

**Hauptdarsteller der ersten Dialog-Bühne: FrizzleBob v5.**
- **Modell:** `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb`, Blob `131d7c38`, Commit `19088b14`, Branch `chat/fb-ear-rig-v5-2026-09-25`. Dort liegen auch `FB_BASE_NOEARS_v5.glb`, `FB_EAR_UNIT_v5.glb`, `rigs/fb-default.ear-rig.json`, `ear-dangle.v1.js`, `blender/build_fb_v5.py` und das Ear-Rig-Studio.
- **Augen/Lider-Beleg:** 7/7 PASS vom 30.09., `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/evidence/acceptance_1-7_frizzlebob-earrig-v5.json` (Actor `frizzlebob-earrig-v5`) auf main. Gilt für diesen Spender, noch nicht für R3F.
- **Nicht v5b** (`FB_TEMPLATE_LOOK_v5b.glb`, Production-06 r2) stillschweigend einsetzen.

**Ablauf:**
1. **G0 Quell-Isolation FrizzleBob v5:** Modell allein zeigen; Gesichts-Stapel (Augen, Lider, Brauen, Ohren, Mund) mit Quelle und Werten pinnen. Keine Rogue-Werte übernehmen. Was fehlt, z. B. ein sichtbarer Mund, als `SOURCE_REQUIRED` melden, nie mit Platzhalter füllen.
2. **Darsteller-Slot** mit genau einem Gesichts-Treiber (`KFB_NATIVE` aus FrizzleBobs eigenem Stapel; keine neue Gesichts-Engine, kein Mischbetrieb).
3. **Abnahme:** Bildpaar bzw. kurzer Clip Spender | R3F, gleiche Figur und gleicher Winkel; Blinzeln vollständig geschlossen, Blick, Ohren.
4. Danach weiter wie geplant: B1 Billboard (R2) → D1 → G4-Szene im Amphitheater.

Die Fragen aus §10 beantwortet WS0 gesondert. Sie halten FrizzleBob G0 nicht auf.

## 14.10.2026 früh · F1: Eye-Rig-Studio-Quelle (Korrektur, Fehler WS0)
Die Live-Adresse `kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/` liefert nur die Startseite (SPA-Fallback, Studio dort nicht ausgeliefert). WS0 hatte sie nicht geprüft. **Nicht weiter auf Cloudflare suchen.**
- **Studio-Quelle:** Branch `work/hub-ux-v2-masterplan-2026-09-27`, Ordner `kfb-hub/stage/toolbox/eye-rig-batch/`, letzter Stand Commit `5c3334bd2` (22.09.); `index.html`, `app.js`, `lib/` (u. a. `kaykit-eye-adapter.v1.js`), `data/`. Ursprung PR #104 (Branch `toolbox/eye-rig-batch-2026-09-18`). Lokal per statischem Server ausliefern (z. B. `npx serve`), nicht über file://.
- **EyeRig v6:** dieselbe Datei wie im Lab (md5 1c194efa); im Repo z. B. `skills/KFB PetStudio/KFB Pet Studio v12 (WS0)/session-export_petstudio-v12_2026-09-10/code/petstudio-v9/studio-v12/pet-eye-rig.v6.js`.
- **Georgs Werte:**
  - Klassen-Standard `rig-medium-default.v0.json` (Resident-Atlas-Cut, Z. 38–66);
  - 33 Figurenprofile `eye-rig-medium.batch-1.json`;
  - Large `rig-large-reviewed.v1.json`.
  - Lab-Kopien: `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/public/assets/figures-b2/eye-profiles/` (mit SOURCE.md).
- **Alle Regler, Schieberwerte und die Schielursache:** Lab `docs/concepts/EYE_RESTORE_SEARCH_R1.md` §1–4. Blickachse = Host-vorn, nicht Anker-Drehung.

## 14.10.2026 früh · Registry-Korrektur fertig (Antwort auf 4.2)
- **Neuer `MEDIA_COMMIT`: `a9f5ffa1484f510d2fbfb04bf3204546ef7dc867`**, Branch `data/kfb-registry-mapping-fix-2026-10-14`, Basis main @ac9dbaed. Bericht: `media/kfb/MAPPING_FIX_R1.md`.
  - coverOffset 1→0 bei 14 Decks;
  - 1→2 bei 4 Decks (zwei Vorseiten);
  - `pages` = gemessene Seitenzahl;
  - Einzelfälle anti_rules_toolkit (Dublette entfernt, #52–57 → #51–56), big_bad_brain_wrestling #50/#51, unspoken_systems #38 „TRUST LOOP“;
  - die 2 „fehlenden“ PDFs: Apostroph im Registry-Namen korrigiert.
- **Bitte:** Audit (`python3 scripts/audit-mapping.py`) gegen `a9f5ffa1` laufen lassen und das Ergebnis in WS1_STATUS melden. Die Vorhersage aus euren Rohdaten lautet 58/78 SAFE; belegt ist das erst durch euren Lauf. Erst danach stellt ihr `MEDIA_COMMIT` um.
- **Offen** (Bericht §Offene Fälle): 4er-Reihen-Seiten in 4 Decks, Karten-JSON ≠ Druck bei ego_mania_narcissist/mission_control #37–56, ontological_hazards mit gemischtem Offset. Diese Decks bleiben bis auf Weiteres Platzhalter.

## 14.10.2026 früh · Meshy-Amphitheater (Antwort auf §9, V-230)
Gute Quell-Isolation: Bildpaar, Inventur, Messung, Befunde A/B. So soll Intake aussehen.
1. **Ablage:** wie vorgeschlagen. Das Master bleibt in der Dropbox (SHA-256 + Herkunft im Librarian). Ins Repo kommt nur eine Browser-Fassung unter eigener Kennung und Version: Geometrie ≈ 300–400 Tsd. Dreiecke, Texturen 2048² WebP (Metall/Rau 1024²), Ziel < 20 MB. **Kein KTX2/Meshopt jetzt**, damit kein neuer Laufzeit-Decoder nötig wird; erst wenn das Ziel sonst verfehlt wird, als Vorschlag. `@gltf-transform/cli` ist als gepinnte Dev-Abhängigkeit freigegeben (nur Werkzeug-Skript, `npm ci`/Build/Tests bleiben grün). Abnahme: Bildpaar Master | Browser-Fassung aus gleichen Kameras + Bildzeit wie in deiner Tabelle.
2. **Registrierung:** WS1 trägt genau eine Kennung im Asset Librarian (`registry/assets/v1`) im Intake-Slice ein; WS0 prüft.
3. **Maßstab:** Bühnenfläche ≈ 14 m bestätigt. Das Billboard gilt nach `BILLBOARD_STANDARD_R2` (responsiv, niedrig, kein 12 × 6 m mehr). Prüfung im ruhigen Two-Shot: Karte lesbar, beide Figuren davor.
4. **Unterseite:** Das Theater steht auf Clay-Gelände mit Bodenschluss (V-203); die Kamera kommt nie darunter.
5. **Reihenfolge:** Die Browser-Fassung darfst du jetzt erzeugen, wenn es F1 nicht aufhält. Einbau als Modul erst nach F1 und B1, wie vorgeschlagen.

## 14.10.2026 früh · Architektur R1 (V-228) · gebündelt, bitte quittieren
**Lesen:** `ARCHITECTURE_R1.md` (eine Seite) und `replies/BILLBOARD_STANDARD_R2.md`. Im nächsten WS1_STATUS bitte quittieren: „gelesen bis V-228“.

1. **Alle Laufzeit baut WS1**, auch Kamera (ruhiger Two-Shot als Standard, kein Auto-Schnitt) und den kompakten Clay-Boden der Bühne. V-225 ist zurückgenommen. Die Module in `replies/CLAUDE_DESIGN_STAGE_LIVE_R1/` werden **nicht** übernommen; nur `fitFace` dient als Vorlage für B1.
2. **8.1 Billboard:** gilt nach R2. Kein TV, keine feste 2:1-Fläche, responsive Fläche, Karte randlos, Innenecken höchstens im Papierrand gerundet, kurze Pfosten. Bitte neue Vorlagen-Zeile nach R2 §5.
3. **Gesicht (ersetzt den Mischbetrieb aus V-217):** Je Figur steuert genau ein Treiber das ganze Gesicht, wie im #355-Code (`DOUBLE_FACE_CHANNEL_OWNER`). KFB-Figur = `KFB_NATIVE` (F1). Wireface-Cast oder GLB = `WIREFACE_*` exklusiv. Den Darsteller-Vertrag erweitert ihr im Code für Nicht-KayKit-Figuren (bisher verlangt er `kfb.actor-recipe` mit Rig_Medium) und reicht den Diff in WS1_STATUS ein.
4. **Wireface-SDK:** lokaler Alias mit Schalter (z. B. `VITE_WIREFACE=1`). `npm ci`, Build und alle Tests müssen **ohne** SDK bestehen. Keine SDK-Datei im Repo.
5. **Text:** Pool r6 entsteht im Branch `data/kfb-dialog-pool` (`data/dialog-pool/KFB_DIALOG_POOL_R6_2026-10-14.json`), mit Georgs Opener-Urteilen und den drei 56er-Sets als Kandidaten. `POOL_PATH`/`POOL_REF` stellt ihr um, wenn WS0 die Revision meldet. Bis dahin bleibt r5.
6. **Reihenfolge:** F1 → Darsteller-Slot → B1 → D1 → Vorführung (G4). Vorher zeigt ihr Georg nichts.

## 14.10.2026 früh · Antwort auf WS1_STATUS §8 (Head ddf4e22d)
**S5a/b/c:** angenommen. Die Optik der Spielerwahl prüft WS0 mit der Vorführung (8.2), nicht einzeln.

**8.2 Reihenfolge: angenommen.** F1 Augen → Billboard → Vorführung „Karte im Billboard + Blase + Wahl, Figur mit Eye-Rig“ auf kompaktem Clay-Boden statt Hex. Die Karten-Aufsteller auf Bühne und Turm fallen weg.

**F1 jetzt starten** (Stopp aus §7 ist damit aufgehoben, Antwort auf 4.5):
- **Augen:** Vorgaben wie am 14.10. (pet-eye-rig.v6 + anchored-eyes 1:1, Studio-Werte, Anker-Drehung nicht übernehmen, Brauen). Abnahme: bewegtes Paar Studio | R3F.
- **Figuren-Slot (V-227):** eine Darsteller-Schnittstelle mit `faceDriver` je Figur (`KFB_NATIVE | WIREFACE_MESH | WIREFACE_MODEL`, Vertrag #355). Je Region genau ein Treiber. F1 liefert `KFB_NATIVE`; die Wireface-Treiber kommen als zweite Quelle in denselben Slot.
- **Wireface-SDK 0.3.3** (Peer `three ^0.186.1`, passt zum Host-Vertrag) liegt nur lokal: `~/Dropbox/CLAUDE/KFB_HUB/40_VENDOR_PRIVATE/wireface-0.3.3/` (`sdk/package/` und `browser/`). Einbinden über einen ignorierten Vendor-Ordner bzw. Alias. **Nie ins Repo**, auch nicht in Builds, die gepusht werden.
- **Stimme:** Es gibt keine Tonaufnahmen. `say()` braucht aufgenommene Clips; ohne Audio-Kontext bewegt die Figur nur den Mund („mime“). Bis auf Weiteres gilt: mime, kein TTS.

**8.1 Billboard-Vorlage: noch nicht freigegeben.** V-223/V-224 ändern sie: kein TV-Knopf, keine feste 2:1-Fläche, responsive Fläche, Karte randlos, niedrig. Die Antwort kommt nach dem Architektur-Check von WS0 (heute), zusammen mit der Frage, welches Billboard-Modul die eine Quelle ist.

**Registry (4.2):** Die Korrektur läuft jetzt im Branch `data/kfb-registry-mapping-fix-2026-10-14`. Den neuen `MEDIA_COMMIT` meldet WS0.

**Pool (S5b):** Der Pool r5 hat 0 ACCEPTED und nur einen Beat. Georgs Urteile (V-218, V-222) und die neuen Opener-Kandidaten trägt WS0 ein; neue Pool-Revision und Ref meldet WS0.

## 14.10.2026 nachts · Figuren-Slot quellen-offen (V-226/V-227)
- Claude-Design-Bühne R1 = FAIL (keine Figuren, Auto-Schnitt). Ursache WS0.
- **Neu für F1/F2:** Darsteller-Schnittstelle mit mehreren Quellen: KFB-Figur (Körper + Eye-Rig, F1 1:1 aus dem Studio), Wireface-Cast (`buildCharacter(id)` aus `@wireface/sdk/three/characters`), beliebiges GLB mit `attachFace`/`ModelFace`. Je Figur genau ein Gesichts-Treiber (`faceDriver`).
- Das SDK kommt von Georg (Konto-Download). Es bleibt lokal in einem ignorierten Vendor-Ordner und kommt nie ins Repo. WS0 meldet den Pfad, sobald es da ist.

## 14.10.2026 nachts · Wireface-Bühne als 3D-Szene (V-225)
- Claude Design baut die Bühne live in three.js (Projekt „KFB Billboard Clay Island“); jedes Teil als Modul nach Host-Vertrag R1.2. WS1 übernimmt die Module später 1:1 über den ModuleHost. Kein eigener Nachbau. WS0 meldet, wenn die Szene geprüft ist.

## 14.10.2026 nachts · Bühnen-Billboard (V-224, für B1)
- Plain-Körper ohne TV bzw. Mini-TV; niedrig gesetzt, damit die Figuren davor agieren.
- Responsive Bildfläche nach dem Seitenverhältnis der Karte (B3 `fit_face`, siehe `replies/BILLBOARD_STANDARD_R1.md` §6); die feste 2:1-Fläche mit Randfarbe entfällt.
- Karte = ganze Viertelseite, unbeschnitten, randlos.

## 14.10.2026 nachts · Opener-Regeln und Billboard-Referenz
- **V-222 (für S5b):** Opener-Varianten (z. B. die „heard of“-Formen) bleiben, aber **keine Variante zweimal in einem Set, Akt oder Dialog**. Also braucht der Pool-Leser eine Rotation bzw. einen Cooldown. Orts-Opener sind je Figur erlaubt (frei als Bühnenfiktion oder nur Kartenorte, laut Figurenprofil).
- **V-223 (für B1):** Referenzbild `replies/REFS_BILLBOARD/PLAIN_BILLBOARD_REFERENCE_GEORG_2026-10-14.webp`.
  - Knet-Rahmen, runde Innenecken, zwei Pfosten.
  - Inhalt als integrierte Collage bzw. Hypernormalisation; die Karte wird integriert, nicht aufgeklebt.
  - Kein TV-Knopf vorerst.

## 14.10.2026 spät · Billboard-Standard (V-220)
Jedes Billboard bzw. jede Karte auf einem Billboard folgt `replies/BILLBOARD_STANDARD_R1.md`:
- **Körper:** World Billboard Clay01 r2 in der Variante `plain` (Einbau-Vertrag `billboard.embed-spec.v1.json`, Branch `work/billboard-island-integration-01-2026-10-01`).
- **Karte:** **in** die 12 × 6 m-Bildfläche eingesetzt (CanvasTexture 2:1), über `cardImage`, `fit`. Nie als Rechteck davor.
- **Engine:** Hypernormalisation (START_HERE im Branch `planning/billboard-quote-hypernorm-curator-2026-10-04`, H13 als Bild-Besitzer), genau ein `BillboardScheduler`.

Für den Billboard-Slice zuerst eine Vorlagen-Zeile an WS0: welche Datei bzw. Funktion 1:1 übernommen wird.

Ablage im Register-Branch `docs/kfb-decisions-register-2026-10-11`. Verbindlich ist `DECISIONS.md`.

## 14.10.2026 · Antwort auf WS1_STATUS (Head 0fdabf87)

**Gut gemacht:** S0/S1 sauber. Blinde Prüfer, Bildpaare mit unabhängiger Referenz, das Audit der Kartenzuordnung, „gesperrt statt falsch“. So soll es laufen.

**Freigaben**
- **Host-Vertrag R1.2 = V-215.** Kopie liegt in `replies/KFB_HOST_CONTRACT_R3F_R1.md`. Besitzer ist ab jetzt WS0. Änderungen bitte als Vorschlag in WS1_STATUS; WS0 trägt sie ein.
- **S0 + S1 freigegeben**, ohne dritten Prüfer. Zu Georg geht S1 aber erst gebündelt mit S5a, also mit Karten und Blase zusammen.

**4.1 · Hex (V-216 Punkt 1, V-194):** Eure Empfehlung gilt.
- Die Hex-Insel bleibt nur eine ausdrücklich markierte Legacy-Testkulisse; nichts hängt daran.
- S2 Clay wird nicht auf Hex ausgerichtet.
- Die erste Bühne ist ein kompakter, organischer Clay-Boden mit Billboard, zwei Figuren, Blasen, Kontaktschatten und SKY3.
- Terrain und God-Mode kommen später beim Worldbuilder-Owner. Der Integrationsplan R1 ist insoweit korrigiert.

**4.2 · Registry:** Die Korrektur ist ein eigener Auftrag beim Deck-Registry-Owner: `coverOffset` der 15 verschobenen Decks, 2 fehlende PDFs, Einzelfälle in `cards.json`. WS0 vergibt ihn und meldet danach den neuen `MEDIA_COMMIT`. Bis dahin bleibt es beim Platzhalter mit wörtlichem Kartentext.

**4.3 · cardImage():** Bestätigt: Es ist ein Host-Dienst, kein Modul. Die Prüfung über `s1`/`s1-view` genügt.

**4.5 · Gesichter (V-216 Punkt 3, V-214, V-217):** Erst F1, dann F2, dann D1.
- **F1 Augen** (Modul nach create/update/dispose):
  - `pet-eye-rig.v6.js` + `anchored-eyes.v1.js` 1:1, Quellen und Fundorte in Lab `docs/concepts/EYE_RESTORE_SEARCH_R1.md`.
  - Werte aus Georgs Studio „KFB Batch EyeRig Atlas“ (live: `kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`) bzw. `eye-rig-medium.batch-1.json` (19.09.).
  - **Die Drehung der Anker nicht übernehmen.** Das war die Ursache des Schielens im Lab (V-201): Die Anker zeigen 14–55° nach außen, im Studio blicken die Augen geradeaus.
  - Blinzeln, Leben, Kinetik und Blickziele einschalten; dazu Brauen (V-179).
  - Abnahme: **bewegtes** Bildpaar bzw. kurzer Clip „Studio | R3F“, gleiche Figur, gleicher Winkel. WS0 prüft, bevor Georg es sieht.
- **F2 Mund:** Wireface nach dem Composer-Vertrag #355, je Region genau ein Treiber. Eye-Rig besitzt Augen, Lider, Pupillen und Brauen; Wireface zunächst nur Mund und Kiefer. Ablauf A → B → C → D aus V-217. Erst nach F1.
- **D1** wartet auf F1. S5a, S5b und S5c laufen weiter.

**4.6 · Referenz für V-204:** `replies/lab-donors/V204_plain_bubble_reference.jpg` (Lab, V-202-Abnahmefahrt). Die Blase gilt als Referenz. Die Figuren darin haben KayKit-Augen und sind **keine** Figuren-Referenz.

**Eure Regel gegen Drift** (Vorlage gegen `DECISIONS.md` prüfen; eine ältere Vorlage zählt nicht, wenn eine neuere Entscheidung sie ablöst) übernimmt WS0 für alle Sitzungen (V-214).

**S5b:** Richtig erkannt. Es gilt der KEEP-Pool (#365/#379, accepted-only), nicht `RUNTIME_POOL`. Georg kreuzt die 15 Kandidaten gerade an; das Ergebnis kommt hierher.
