# BRIEF WSB · B51 · Cartoon-Brawl (Massenschlägerei in der Staubwolke) · R1 · 2026-10-19 · WS0
**Register:** V-560 (baut auf V-181 Rauferei, V-499 Cartoon-Effektformen, V-496 Fehlerklasse „Kugelstapel“, V-559 Besetzungsliste). Spec: `replies/SPEC_CARTOON_VFX_SHAPES_R1.md`, `replies/SPEC_SCENELET_R2.md`.
**Reihenfolge:** nächster Bau nach dem Clown-Hammer (Wrestling r1b). Georg kann umsortieren.

**Tier 0**
1. **Klassische Cartoon-Prügelwolke:** mehrere Figuren verschwinden in EINER wabernden Staub- bzw. Rauchwolke; aus der Wolke ragen kurz Fäuste, Füße, Köpfe, Waffen und Requisiten heraus, dazu Sterne, Zähne, Hut, Schuh, Sprechblasen-Schimpfzeichen (#@!*). Dann löst sie sich auf und alle liegen benommen herum (Augen-Spiralen bzw. Sterne).
2. **Die bisherige große Knetkugel ist FAIL** (Georg: „sah nicht gut und überzeugend aus“). Die Wolke folgt V-499: eine Masse mit Beulen, Größenhierarchie groß/mittel/klein, überlappende Lobes, Lebenszyklus, Dichtegefälle, eine Lichtquelle, keine Emission, nie Einzelkugeln.
3. **Abnahme wie immer über Prüfstand + Streifen**, dazu ein Bühnen-Scenelet, das mit wechselnder Besetzung aus der Besetzungsliste läuft (2–6 Figuren).

## Block
**Inventur zuerst (lesend):**
- den alten Brawl-Ansatz finden: RA `fight-sandbox-02.json` (Hinweis „dust-cloud brawl“, `facingYawDeg`) und `KFB_Fight_Cartoon_Contact`;
- die Melee-Kampf-Dateien in `BLENDER MCP` bzw. Combat Arena (#19, VFX-Branches 03.10.: Contact-Impact, Stern/Splat, Lehm-Fragmente).
- Was taugt, wird übernommen, kein Neubau ohne Not (V-511).

**Wolke (Herzstück):**
- **Aufbau:** eine Wolken-Masse aus 9–15 Lobes in BMS-Verteilung, abgeflachte Basis am Boden (Staub), wabernder Rand. Lobes rollen gegeneinander und pulsieren versetzt (teilerfremde Perioden, kein sichtbarer Loop unter 10 s).
- **Lebenszyklus:** Aufpuffen (Squash 0,6 → 1,1 → 1,0) → Toben → Ausdünnen und Zerfallen in kleinere Puffs → Vergehen durch Schrumpfen, kein reines Alpha-Fade.
- **Look:** Staubfarbe aus dem Boden-Biom (hell 75–90 %, nie reinweiß), Falten dunkler, Knet-Look. Lieferung als gebackener Clip (Formschlüssel bzw. Lobe-Knochen) und als Parameter-Satz für die Laufzeit (WS1b).

**Herausragende Teile („Pop-outs“):**
- **Bibliothek:** Faust, Stiefel, Kopf mit Spiralaugen, Ellbogen, Waffe bzw. Requisit, Sterne, Zahn, Hut, Schuh, Schimpf-Sprechblase.
- **Ablauf:** Jedes Teil schießt mit Squash aus der Wolkenoberfläche heraus (0,15–0,3 s) und zieht wieder hinein; zufällig, aber nie zwei an derselben Stelle direkt hintereinander.
- **Herkunft:** Teile aus den echten Darstellern der Besetzung (Faust bzw. Kopf der jeweiligen Figur) bzw. aus vorhandenen Requisiten. Die Schimpf-Blase nach Sprechblasen-Regeln (V-204).

**Darsteller:**
- **Einstieg:** Figuren laufen bzw. springen hinein (Sprung-Clip, verschwinden in der Wolke).
- **Ende:** Sie liegen benommen am Rand (Death bzw. Lie-Clip mit Bodenklemme, Augen-Spiralen oder kreisende Sterne über dem Kopf) und rappeln sich auf.
- **Besetzung r1:** Orks aus der Band (Raider, Brute), Skelette, Spielzeugsoldat. Austauschbar über cast-IDs.

**Ton:** Cue-Marken für Prügel-Geräusche (Klatschen, Bong, Pfeifen, Schimpf-Gebrabbel). Die Sounds macht WS0 (ElevenLabs).

**Abnahme / Lieferung:**
- Streifen: Hineinspringen → Wolke tobt mit Pop-outs → Auflösen → alle liegen benommen.
- Wolke einzeln im Prüfstand (Totale + nah), dazu ein Vorher/Nachher gegen die alte Knetkugel.
- Scenelet `cartoon_brawl_01` mit Besetzung als Liste, Spuren und Cues.
- QA V-520 (a)–(h), zusätzlich V-499-Checkliste aus der Spec. Lizenzen im RETURN.
