# RKIT · EXIT/ENTRY auf RACE + B6-Zone (R1) · nur Tests, keine Core-Änderung

Stand: 2026-10-11 · Freigabe Steuerung (C4c, V-134, V-139) · Track Core 0.16.1 (privat; Lab-Kopie `vendor/private/track-core-0.16.1/`)

## Ergebnis: **19/19 PASS**, Track Core unverändert
Datei: `~/Developer/rkit-r3/trackcore/test-race-exit.mjs`. Aufruf: `node test-race-exit.mjs`.

| # | Prüfung | Ergebnis |
|---|---|---|
| 1 | Core-Version ≥ 0.14 | 0.16 |
| 2 | RACE: EXIT + ENTRY kompilieren; alle Strecken-, Graph- und Modulprüfungen grün | grün |
| 3 | Hauptstrecke behält Linie und Breite 14,4 | Drift 0, Breite ±0 |
| 4 | **Gleichstand:** Hauptstrecke mit EXIT/ENTRY = dieselbe Strecke ohne Module (p, T, U, R ≤ 1 mm) | 1133 Stationen, Abweichung 0 |
| 5 | Ast übernimmt den RACE-Seitenquerschnitt (4,32 je Seite), einbahnig | 4,32 m; Astbreite 4,00 m |
| 6 | Ast beginnt und Einfahrt endet genau auf der Fahrbahnkante | 0,0000 m / 0,0000 m |
| 7 | Gore-Fläche je Aus- und Einfahrt, je eine U-Nase, Kissen nur an der Ausfahrt | gore, gore · uturn, cushion, uturn |
| 8 | **Leitwand-Nase:** RACE-Bandendicke, offener Innenradius ≥ 0,5 (wie HIGHWAY) | r 1,314 / 1,383 bei t 1,62 → innen 0,504 / 0,573 |
| 9 | Freiraum zwischen Haupt- und Ast außerhalb des gemeinsamen Decks | 1,07 · 66,9 · 13,2 |
| 10 | **Banden-Enden:** jeder Bandensprung sitzt auf einer Bruchfuge (gebautes Ende), keiner mitten im Stück | Haupt 4/4, Ast 1/1 auf brk |
| 11 | Anti-Köln auf der Hauptstrecke mit Modulen (Innenkante nie gehoben, keine Wellen) | 0 / 0 |
| 12 | J17-Schreibweise (`widthClass STANDARD`, `markings TRACK`, ohne family) | grün |
| 13 | EXIT + ENTRY links | grün |
| 14 | Rampe steigt 3 m und endet per CONNECT eben auf einem Ebenen-Rahmen (60 m voraus, 25° gedreht) | grün |
| 15 | negativ: Einfahrts-Route ohne vorhandenes ENTRY wird abgelehnt | abgelehnt |
| 16 | negativ: Körper-Familienwechsel RACE → TOWN auf der Linie bleibt abgelehnt (race ↔ world nur als Zone) | abgelehnt (B6-Meldung) |
| 17 | **B6:** RACE-Strom mit TRANSITION zur Stadt (100 m wie ZA) + STREET-Markierung kompiliert grün | grün |
| 18 | **B6:** Die Zone ändert keine Geometrie: p, T, U, R und 14 Slots gleich wie ohne Zone (≤ 1 mm) | 559 Stationen, 0 |
| 19 | **B6:** Der Strom vermerkt die Zone (track → city, s 60–160, Fenster) und danach STREET | ja |

## Ehrlich: drei Prüfungen waren im ersten Lauf rot, alle wegen **meiner Kriterien**, nicht des Core
Beleg: derselbe Vergleich auf HIGHWAY (abgenommen, test-v014).

1. **Nase:** Ich hatte r > t verlangt. Nötig ist ein offener Innenradius r − t/2 > 0. RACE hat innen 0,504 / 0,573, HIGHWAY 0,503 / 0,507. Kriterium angeglichen: ≥ 0,5 wie HIGHWAY.
2. **Banden-Enden:** Ich hatte „kein harter Sprung“ verlangt. Der Core setzt die Bande an Bruchfugen bewusst hart ab („hard break, no sinking“, v0.10/v0.14); HIGHWAY hat exakt denselben Sprung (Ast-Bande 0 → 1 bei s ≈ 141, auf brk). Kriterium jetzt: Sprünge nur auf Bruchfugen. Die Rundung des offenen Endes (ROUND_END) macht der J17-Look.
3. **Rampe + CONNECT:** Mein Zielpunkt lag 150 m in der Gegenrichtung (60° zurück) und erzeugte Knick und Falte. Mit einem Ziel 60 m voraus und 25° gedreht ist alles grün.

## Beobachtungen für C4c (keine Fehler, Entscheidungen der Steuerung bzw. des Labs)
- **Astbreite RACE: 4,00 m**, einspurig mit W0 aus dem Makro. Für J17-Fahrzeuge bitte bestätigen, ob 4,0 reicht oder der Ast breiter sein soll; das ist ein Parameter des Rezepts.
- **Banden-Enden im Look:** An den 5 Bruchfugen braucht der J17-Look gebaute Enden (Kopf bzw. ROUND_END), sonst sieht man abgeschnittene Banden.
- **Gore-Fläche und Nase im J17-Look fehlen** (C4_VORLAGE_R1 l.18). Der Core liefert sie als `deck.zones` (gore) und `deck.furniture` (uturn, cushion) mit Lage und Maßen.
- **B6 = Zone im Look:** Der Core liefert die Zone (`transitions[]` mit s0/s1 und Fenstern) und die STREET-Markierung. Bande, Bord und Gehweg macht der Lab-Atlas nach ZA bzw. Variante B. Aus dem Forschungszweig (siehe unten) zwei Hinweise für das Lab:
  - Variante B ist nur „für einen echten 3D-A/B mit gleicher Kamera bevorzugt“; Gate `TRACK_CORE_EDGE_ADAPTER_SOURCE_ISOLATION_01` = PARTIAL.
  - Die Randlinien `mark_track` sind in M1/M2 nur in Natur-Zonen (`bio === 1`) verdrahtet. Im Übergang Stadt → Rennstrecke zeichnet der Atlas sie deshalb nicht; das ist eine Look-Lücke.

## Such-Protokoll-Nachtrag (V-140): GitHub-Zweig der Übergangs-Research
- **Zweig:** `georg-doc/kayfabizarro` · `research/kfb-track-core-transition-rail-2026-10-10` (Kopf eb124448), gelesen über `git ls-remote` / `git show` im lokalen Klon `~/Developer/kayfabizarro-publish`; nichts geändert.
- **Eigene Dateien des Zweigs** (gegen den Merge-Base 3d597aad): `skills/chat/research/`
  - `KFB_TRACK_CORE_TRANSITION_RAIL_RETURN_2026-10-10.md`
  - `KFB_TRACK_EDGE_ADAPTER_SOURCE_DATA_CHECK_2026-10-10.md`
  - `KFB_CITY_TRACK_GROUND_AB_SOURCE_WIRING_AUDIT_2026-10-10.md`
  - `KFB_CITY_TRACK_GROUND_CANDIDATE_EVIDENCE_2026-10-10.md`
  - `KFB_TRACK_CORE_TRANSITION_DUNGEON_RAIL_RESEARCH_2026-10-10.md`
  - `fixtures/…CANDIDATE…json`, `fixtures/…VARIANT_B_EXTENDED_HANDOFF…json`, 2 SVG-Belege
- **Befund:**
  - Der Übergang Rennstrecke ↔ Stadt ist ein Look-Adapter über Track-Core-Slots (`track-look.v5.js` `AT.barrierT` morpht das Banden-Profil); Track Core v0.12 STANDARD-Slots sind konsistent.
  - ZA s 1470–1570 (sideLag 0,08, 10 Fenster), ZC s 560–650 (7 Fenster, ohne Gehweg).
  - Variante B: 17 m Überlappung, 16/16 Fenster-Prüfungen.
  - Offen: Rückrichtung „Stadt → Strecke am Boden“ nur als Kandidat; die Lücke `mark_track` siehe oben; Gate PARTIAL.
  - **Eine Track-Core-Lücke nennt der Zweig nicht.** Das bestätigt V-139 und B6 = vorhanden.
