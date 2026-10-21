# BRIEF · WS-NPC Phase E: Welt-Ereignisse (Men in Black, Hunky & Dory UFO) · R1 · 2026-10-21 · WS0
**Register:** V-603. Baut auf V-529–V-535 auf (Blob-Corp-Turm, Kayfabe Men in Black, Black Fluff/Goo, Kayfabrizieren, UFO-Lab), dazu V-583/V-595 (Dark Fluffer) und V-585/V-602 (WS-NPC).
**Owner:** WS-NPC, nach Phase C und D. Merge nur mit Georg.

**Tier 0**
1. **Use what works:** Alles existiert schon. Nur verbinden, nichts neu bauen.
   - Turm, Agenten und Blaster: WSB B40.
   - UFO mit Kuppel und Hunky/Dory-Plätzen: WSB B34.
   - Traktorstrahl-Event-Lab: `replies/UFO_TRACTOR_LAB_R2_REF/` (V-535).
   - Saug- und Bau-Modul (V-533).
   - Dark Fluffer (Phase C).
   - Töne `blobcorp_mib_r1`, `beam_ufo_r2`, `ufo_harvest_r1`, `fluff_suction_r1`.
2. **Ereignisse sind selten und erzählen etwas:** Höchstens ein Ereignis zugleich, nur in der Spielerblase, mit Abklingzeit. Jedes hat eine sichtbare Ursache und Folge, kein Zufallsfeuerwerk.
3. **Leistung:** ≤ 1,5 ms je Bild während eines Ereignisses, keine neuen Lichter (das Turm- bzw. Torlicht ist Materialhelligkeit), Effekte nach V-499.

## Block
**E1 · Men-in-Black-Einsatz:**
- **Ablauf:**
  1. Der Blob-Corp-Turm materialisiert an einem freien, flachen Platz (Saug- und Bau-Modul, Ton `M01_tower_materialize`).
  2. Das Tor wird hell, die Agenten ploppen ins Licht und treten heraus (`M03_door_vanish`, `M05_agent_pop`; lichte Höhe nach V-530).
  3. Die Agenten laufen in taktische Positionen und scannen die Umgebung (`M11_tower_scan_hum`).
  4. **Optional** saugt ein Agent mit Roboter-Arm und Trichter Fluff ein und braut daraus eine Goo-Pfütze (V-531, Saug-Animation `kfb-fluff-suck`).
  5. Auf den Goo-Pfützen spawnen 1–3 **Dark Fluffer** (Ghost, später Pilz) und gehen in ihre Phase-C-Routine.
  6. Die Agenten treten zurück, der Turm dematerialisiert (`M02_tower_dematerialize`).
- **Bewohner:** Wer es sieht, flieht oder warnt. Als Gerücht wird daraus „Die Men in Black waren da“ (Phase D2, mit Quelle, ein Schritt).
- **Spieler:** Agenten sind Gegner nach den K10/K13-Regeln (Blaster), aber nur bei Angriff. Heilen der Fluffer wie Phase C.

**E2 · Hunky & Dory im UFO:**
- **Ablauf:**
  1. Das UFO fliegt auf einer Bahn über das Gelände (Kuppel mit Hunky und Dory, B34).
  2. Ein Scan-Kegel streicht über den Boden.
  3. Über einem Fluff-Baum zieht der **Traktorstrahl** Fluff hoch („ernten“): Event-Lab-Logik, zerfällt in Knetkugeln, Ton `ufo_harvest_r1` bzw. `beam_ufo_r2`.
  4. Gelegentlich lässt der Strahl ein kleines Objekt verschwinden und an anderer Stelle erscheinen (Teleport; Saug- und Bau-Modul, `suck|build`).
  5. Das UFO fliegt weiter bzw. verschwindet.
- **Bewohner:** schauen hoch, zeigen, schimpfen über den gestohlenen Fluff (Gerücht).
- **Kein Kampf** mit dem UFO in E2.

**Daten:**
- `kfb.world-event/1` je Ereignis: Auslöser, Ort-Regel, Darsteller-IDs, Ablauf mit Marken, Abklingzeit, Töne.
- Figuren nur aus `cast.r1.json`. Die B40-Agenten und das B34-UFO kommen über WSB in die Besetzungsliste; bis dahin aus den B40/B34-Karten im privaten Branch.

**Reihenfolge:**
1. E2 UFO-Vorbeiflug mit Ernte, das ist am einfachsten.
2. E1 ohne Goo.
3. E1 mit Goo und Fluffer-Spawn.

Je Schritt ein Clip aus der Spielkamera (`look=terrain3`) und fps headless.

**Grenzen:**
- Keine neuen Assets; fehlende Clips bzw. Teile als Liste an WS0, WSB baut sie.
- Private Dateien nur aus `KFB-Stunt-Car-Race/assets/private`, nie ins öffentliche Repo.
- Push auf `ws-npc/*` wie bisher; kein Merge.
