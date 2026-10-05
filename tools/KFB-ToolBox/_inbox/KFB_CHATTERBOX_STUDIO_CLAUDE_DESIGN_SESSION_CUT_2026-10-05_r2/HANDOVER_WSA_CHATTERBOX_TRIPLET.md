# HANDOVER · WSA · Triplet Stage → KFB ChatterBox · Planung + Integration

Stand: ChatterBox Studio v2 (Claude Design, 2026-10-05 r2). Referenzimplementierung, kein Owner.

## 1 · Owner-Karte (nicht verschieben)
| Schicht | Owner | Quelle |
|---|---|---|
| Inhalt (Triplets) | ChatterBox content · PR #310 `resident-chat-ensemble-data.mjs` | Pool + RESIDENT_PROFILES |
| Auswahl | Kernel PR #305 `prepareResidentTurn` | `resident-chatter-adapter` |
| Darstellung | bestehender ChatterBox-Pfad (`chatter-2d.js`, `bubble-ts.js`) | liest `kfb.dialogue-presentation.v1` |
| Review | Georg | `kfb.triplet-pool-review/1` |

Nicht: zweite Blasen-Runtime, LLM-Zeilen, neue Dialog-States, Kernel-Logik im Renderer.

## 2 · Datenfluss (so läuft es im Studio)
```
event {cardRef, witnessIds, tags}
  + speakerId, residentProfile, socialOperator (BINGO|BOGGLE|BONGO|BLOEDSINN|null),
    priorSemantic, pool, recentTripletIds (letzte 4), rng (Seed), addresseeId
→ prepareResidentTurn()
→ {kind:'turn', tripletId, semantic:{subject,connector,reframe}}  |  {kind:'silence', reason}
→ Darstellung (§3)
```
Antwortender = der jeweils andere des Paars. Erste Zeile = Eröffnung ohne Operator. Seed je Zug: `(seed*7919 + turn*104729) >>> 0`.

## 3 · Formatierungsvertrag (verbindlich für den Einbau)
**Zeile (turn)**
- **Eine** Sprechblase (`bubbleKind:'speech'`), drei Blöcke untereinander: subject · connector · reframe. Kein „/“ in der Blase (nur im Log/Plaintext `a / b / c`).
- Blockabstand = 0,5 × Schriftgröße. Jeder Block bricht für sich um (28 Z/Zeile, Shantell 1,0).
- Geometrie vor Reveal: Blasenkontur einmal aus allen drei Teilen → kein Reflow, kein Zipfelwandern.
- Reveal `flip-stagger`: Block n klappt bei n × 520 ms auf (rotateX −86° → 0°, 300 ms). Kein Typewriter.
- Text unverändert aus dem Pool: Englisch, subject in Satzanfang-Großschreibung, connector/reframe klein, **keine** Schlusszeichen ergänzen, kein Fluffolekt.
- Zipfel/Anker: SPEC_COMPONENTS §2–2a (Zuordnung vor Geschichte, T1–T4).

**Schweigen (silence)**
- Gedankenblase `bubbleKind:'thought'`, Text genau „…“ (U+2026). Gültiger Zug, kein Fehler, nicht überspringen.

**Zurufe (Player)**
- `bubbleKind:'choice'`, 2 Spalten × 2, Reihenfolge und Tasten fix:
  1 `KayfaBINGO!` (BINGO, #e2b33c) · 2 `KayfaBOGGLE?` (BOGGLE, #59c3e6) · 3 `KayfaBONGO!` (BONGO, #7fc46a) · 4 `BLÖDSINN!` (BLOEDSINN, #e5563d).
- Labels exakt so (Satzzeichen gehören dazu; Operator-IDs ohne Umlaut). Ziele ≥ 44 px mobil.
- Nach Auswahl: Stempel 420 ms → Choice tritt ab → Antwort.

**Anker-Ruhe (neu, R6)**
- Kopfanker = projizierter `head`-Bone + Kopf-Offset. Idle/Nicken darf die Blase nicht bewegen: Totzone 14 px je Figur, Sichtwechsel und Kamerabewegung gehen sofort durch (Referenz `lib/chatterbox/stage3d.js`, Block „Readability“).

**Blick**
- Sprecher schaut nach dem Zug zum Partner, Partner zum Sprecher; Eröffnung zur Karte; während der Wahl zur Kamera.

## 4 · Descriptor-Patch (PROPOSAL, additiv)
```json
{ "schema":"kfb.dialogue-presentation.v1", "speaker":"clown", "bubbleKind":"speech",
  "triplet":{ "tripletId":"clown.counts.01", "parts":["You said it","out loud, on your feet","that counts"],
              "reveal":"flip-stagger", "staggerMs":520 },
  "streamMode":"instant", "anchorMode":"head", "presentationOnly":true }
```
Fehlt `triplet`, gilt v1 unverändert. Silence: `{"bubbleKind":"thought","text":"…","reason":"…"}`.

## 5 · Schritte
- **P1 Lesen:** Brief `BRIEF_CLAUDE_DESIGN_TRIPLET_STAGE_01.md` (Branch `coworker/coordination-plan-2026-10-04` @ 5d0ce091348b) gegen dieses Paket. Done-when: Owner-Karte bestätigt oder korrigiert.
- **P2 Descriptor:** §4 als PROPOSAL an den Darstellungs-Owner. Done-when: angenommen / abgelehnt mit Grund.
- **P3 Seam:** Adapter Kernel-Output → Descriptor im ChatterBox-Pfad, hinter Flag. Done-when: Paar A spielt dort mit Seed 1105 dieselbe Eröffnung wie im Studio.
- **P4 Pool:** nur Georgs Kept-Export (`kfb.semantic-triplet-pool/0.1-candidate`) als PR gegen #310-Daten; CANDIDATE bleibt draußen. Done-when: Gate-Raster im Studio grün für Paar A.
- **P5 Paare B/C:** erst nach P4. Zeilen kommen aus Authoring, nicht aus WSA.

Zeitpunkt: Planung jetzt; Einbau erst nach World-Studio-Freeplay (P0-Gate laut Active Work Map).
