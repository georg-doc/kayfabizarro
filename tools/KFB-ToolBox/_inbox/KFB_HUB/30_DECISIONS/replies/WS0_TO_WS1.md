# WS0 → WS1 · Antworten der Steuerung (neueste oben)

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
