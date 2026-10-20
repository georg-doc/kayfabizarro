# HANDOVER · Resident Atlas S17 · Gunfight Duell 01 → Blender MCP + WSA · 2026-10-04 r2

Additiv zu `docs/HANDOVER_WSA_S16_MVP.md` (WSA-RES-SET-01 bleibt offen). Der Workspace ist die Wahrheit. Dieses Paket ist
ein lauffähiger Schnitt, kein Merge.

## A · Georgs Absicht (Sprachnachricht 2026-10-04, sinngemäß)

1. Das Duell sieht gut aus. Es wird **Grundlage für den Combat Slice**, zusammen mit den Treffer-Effekten (Knet-Puff).
2. Die **Blasterhaltung stimmt noch nicht**. Details, die später gefixt werden (Blender, §C).
3. **Ringgröße ist keine globale Entscheidung.** Das Duell ist ein **Demo-Rahmen**, der je Szene angepasst wird:
   als Showcase jetzt, für spätere Varianten ebenso.
4. Figuren werden **in der Szene** gesetzt, nicht als direkt platzierbares Objekt aus dem Atlas. Der Atlas liefert eine
   **Stage-Instanz**: Beispiel zwei Medium-Figuren, die ringen → Ring-Modul in passender Größe, Seile als **Gummibänder**,
   die die Kämpfer zurück in den Ring schicken.

`VOICE_INPUT_UNCERTAIN`: „Bücher effects" → Puff-/Treffer-Effekte · „laut Tricks" → spätere Varianten (Loot/Show?),
bitte bestätigen · „Zähne" → Szene · „Regen" → Ring · „zwei Medium Rings dir die Ringen" → zwei Medium-Rig-Figuren, die ringen.

## B · Stand

- **Entry:** `KFB_Resident_Atlas_S17.html#__duel` (S17 = S16 + Duell, alles andere unverändert).
- **Modul:** `lib/gunfight-duel-01.js` (`createGunDuel`, `FX_DEFAULTS`), **Daten:** `data/gunfight-duel-01.json`
  (Figuren, Waffen, Arena-Kanon, Skripte, Zeiten). Doku: `docs/RESIDENT_GUNFIGHT_DUEL_01.md`.
- Figuren: Hero Man rot/blau, Toy Soldier, Combat Mech weiß/oliv (alle Rig_Medium). Waffen: Blaster (Pistolenhaltung),
  Gewehr, Minigun (Feuerstoß 8, drehender Lauf), Würfelwurf.
- Skripte: Duell fünf Schüsse, Schnellziehen, ohne Treffer, Treffer gegen Treffer. Ergebnis je Beat: miss / dodge / hit / kill.
- Effekte aus dem Arena-Kanon: Mündungsfeuer, Geschoss, Knet-Puff mit Hitstop, Squash, Rückstoß. Puffs werden aus der
  Gesichtszone geschoben, nicht weggelassen.
- Regler wie Fight 02: Abstand, Geschossdauer, Puffgröße, Hitstop, Rückstoß, Urteil, JSON-Export
  `kfb-gunfight-duel-verdicts.json`.
- Gemessen: Lauf zur Bahn ≤ 3,2° (vorher 26–53°), Minigun/Gewehr 2,8°, Ausweichen 0,69 m + 0,04 m nachgeholfen.
- Kamera nach rechts versetzt, damit beide Figuren neben dem offenen Inspektor sichtbar sind.

## C · Blender MCP · Auftrag BLENDER-DUEL-01

Volltext: `docs/RESIDENT_GUNFIGHT_DUEL_01/BLENDER_MCP_BRIEF.md`. Kurz, in dieser Reihenfolge:

1. **B1 Blasterhaltung** neu (Halten + Schuss), Lauf entlang +Z von `handslot.r`, damit Roll 75° / Griff 23,3° entfallen.
2. **B2 Gewehr beidhändig** mit linker Hand am Vorderschaft im Clip (ersetzt Laufzeit-IK).
3. **B3 Minigun** Halten + Feuerstoß.
4. **B4 Sockel** `socket_grip_r/l`, `socket_muzzle` in Blaster, Gewehr, Minigun (`*_KFB.glb`, Originale bleiben).
5. **B5 Würfel-GLB**, **B6 Treffer von vorn** (klein/groß).
6. **B7 Ring-Bausatz** (Pfosten, Seilsegment mit Biegeknochen, Boden, Schürze) **erst nach WSA-STAGE-01**.

Läuft parallel zu WSA. Blender liefert Assets, die Laufzeit stellt danach nur Rollen in `data/gunfight-duel-01.json` um.

## D · WSA · Integration und Planung

**Grundsatz (Georg):** Der Atlas liefert **Stages**, keine fertig platzierten Kampfszenen. Eine Stage ist ein Modul mit
Parametern; die Szene (WB2-Szenendokument) setzt eine **Instanz** und besetzt sie.

1. **Vertrag `kfb.resident-stage/0.1` (Vorschlag).**
   `id, kind (duel | ring | …), slots[] (A, B · erlaubte Rig-Klassen), arena (Form, Größe je Rig-Klasse, Seile, Boden),
   loadout (Waffe je Slot), script (Beats) | control (später), fx (Werte aus dem Verdict-Export), sources`.
   - Größe ist ein **Parameter der Instanz**, abgeleitet aus der Besetzung (Medium-Paar → Medium-Ring). Ersetzt D4 aus
     Fight 02: keine globale Ringgröße.
   - Seile: `ropes: { kind: "rubber", k, damping, maxStretch }`. Rückprall prozedural (Feder), keine Physik, kein Ragdoll
     (S16 §F bleibt). Löst nebenbei Fight-02-Befund „Brutes fliegen durch die Seile".
   - Quelle bleibt `data/gunfight-duel-01.json` (+ `data/fight-sandbox-02.json` für Nahkampf). Der Vertrag ist Ableitung.
2. **Szenendokument.** Neben `residentSets[]` (WSA-RES-SET-01) ein Feld
   `stages[]: { stageId, preset, cast: { A, B }, loadout, transform, params }`. Besetzung über Resident-IDs aus `data/cast.js`.
3. **Lebenszyklus** wie die Scenelets (S16 §D5): `mount(host, anchor, opts) · update(dt, clock) · bounds() · snapshot() · dispose()`.
   Das Duell hat heute `init / attach / view / snapshot / verdictDoc`; die Naht wird darauf abgebildet, nicht neu gebaut.
4. **Modi.** `showcase` (abgespieltes Skript, heute) → `play` (Steuerung, Combat Slice) → Varianten später.
   Der Würfelwurf entscheidet das Ergebnis je Beat; im Spielmodus wird er Eingabe-gesteuert.
5. **Librarian.** Stages sind eine eigene Art (`resident-stage`) im bestehenden Registry-Shard, **nicht** als Einzelobjekt
   „zum Hinziehen". Karte zeigt Preset + Slots; Absetzen öffnet die Besetzung.
6. **Combat Slice (Vorschlag Reihenfolge).** S1 Stage-Vertrag + Duell als Instanz im Szenendokument (Save/Reload) ·
   S2 Ring-Stage aus Fight 02 mit Gummiseilen · S3 Steuerung für Slot A · S4 Blender-Clips einspielen (B1–B3) ·
   S5 Budget messen (fps M1, Drawcalls).

## E · Offen (priorisiert)

1. Blasterhaltung (Georg) → B1.
2. Linke Hand am Gewehr → B2. Bis dahin offen sichtbar, kein Pose-Workaround eingebaut.
3. Kamera-Änderung: Konsolenprüfung danach **NOT_RUN**; Bewegungs-Vorschau in der Prüfung eingefroren (Screenshot-Werkzeug), nicht im Browser bestätigt.
4. Eye-Rig im Duell nicht gesetzt (Originalaugen sichtbar).
5. Minigun: nur die letzte Kugel trägt das Ergebnis, Fehlschüsse des Feuerstoßes nicht in der Laufprüfung.
6. Kein KayKit-Pistolenmodell gefunden (Suche begrenzt).
7. Motion Library @ Branch `georg-doc-patch-3` ungepinnt.
8. fps auf dem M1 nicht gemessen.
9. Aus S16 offen: WSA-RES-SET-01, Medium-Augen nur ADJUSTED, ungepinnte Ladewege (HANDOVER_WSA_S16_MVP §E).

## F · Was nicht passieren soll

Kein fester Ring im Atlas, keine globale Ringgröße, keine Physik/Ragdoll, keine zweite Kampf-Rezeptwahrheit neben den
Duell-/Fight-JSONs, kein Laufzeit-IK als Dauerlösung für Griffe, die Blender backen kann, keine Stages im CONVERGENCE-01-Host.

## G · Next Gate

**WSA-STAGE-01 · Vertrag `kfb.resident-stage/0.1` festlegen und mit dem Duell beweisen: Duell (Hero rot gegen blau, Blaster,
Skript duel5) als Stage-Instanz ins WB2-Szenendokument → besetzen → abspielen → Save → Reload → gleiche Choreografie.**
