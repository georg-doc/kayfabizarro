# BRIEF · Combat-VFX & -SFX „in action“: Kritik + Optimierung · R1 · 2026-10-21 · WS0
**Register:** V-601. **Owner:** der WS1-Prüfer bzw. die VFX/SFX-Sitzung (Prüfer D), die heute den VFX-Bericht der Fahr-Runde gemacht hat. Georg 21.10.: „klingt gut soweit, müsste man mal in action hören“.

**Tier 0**
1. **Schon entschieden, nicht zur Debatte:**
   - Kit-Waffen und Clips as-is (V-574);
   - Mündung +Z (V-579);
   - eine feste Halterung je Waffe bzw. Clip-Familie (V-581/V-582);
   - Action-Figur-Gewehr 1H (V-592), Magie (V-593), Bogen mit shootCycle (V-594);
   - weaponDrop;
   - Boss-Move Wegkatapultieren mit Hammer-Space (V-600);
   - Hit-Stop pro Teilnehmer (V-567, WSA-Vertrag PR #25 wiederverwenden, keinen zweiten bauen);
   - Cartoon-VFX = eine Masse mit Ausbuchtungen, 2–3 Töne, keine Konfetti-Partikel, Emission nur am Effekt selbst (V-499);
   - ein Licht-Rig (V-385);
   - Töne geschichtet: Anschlag + Körper + Ausklang (V-461).
2. **Ziel:** Treffer, Gefahr und Waffe lesen sich in Bild und Ton auf Anhieb, cartoonig getimt (Ankündigung → Treffer → Nachfedern). Erst Kritik, dann Optimierung mit Prototypen.
3. **Abgabe:** Bericht mit Bildern und Clips mit Ton, Top-10 mit Aufwand und Prüfskripten. Umgesetzt wird erst nach Georgs Auswahl.

## Block
**Stand, der geprüft wird:**
- Repo `georg-doc/KFB-Combat-Arena` (privat), Branch **`wsa/toysoldier-r3c-playable-2026-10-20` @ `f712f0d`**: PR #24 Pistole/Blaster/Soldat r3d + PR #27 alle K10-Waffen, gemergt 21.10.
- Dazu PR #25: Module inkl. Hit-Stop-Vertrag.
- Doku: `_handover/K10_RUNTIME_2026-10-21/README.md` im Arena-Repo (Tabelle je Waffe: Marken, Effekte, Grenzen).

**Starten auf eurem Mac (ohne Dropbox):**
1. Arena-Branch klonen.
2. Private Dateien holen: `KFB-Stunt-Car-Race`, Branch `assets/private`. Das geht über den `gh`-Login (`gh repo clone georg-doc/KFB-Stunt-Car-Race priv -- --branch assets/private --single-branch --depth 1`) bzw. euren Lese-Schlüssel. Darin liegen die 34 Arena-Quellen unter `50_BLENDER/…` und die Mündungsblitze unter `kaykit/Mystery_S4_Action_Figure/gltf/`.
3. Im Arena-Ordner:
   ```
   python3 tools/build.py
   python3 tools/verify_rehome.py
   python3 tools/serve_soldier.py --b50 <priv>/50_BLENDER/B50 --flash <priv>/kaykit/Mystery_S4_Action_Figure/gltf --port 8783
   ```
4. Aufrufen: `http://127.0.0.1:8783/?actor=` + `pistol`, `blaster`, `soldier`, `crossbow`, `gatling`, `action-rifle`, `smoke`, `blade`, `wand`, `staff`, `skeleton-staff`, `bow`, `bow-a`.
5. Fehlt eine Datei: an WS0 melden (WS0 ergänzt den Branch), nicht selbst ersetzen.

**Fokus:**
- **VFX:**
  - Mündungsblitze (KayKit Action Figure, as-is);
  - Armbrust- bzw. Bogen-`release`, Magie-`cast`;
  - Treffer- und Aufprall-Puffs, Hit-Stop mit Stauchen;
  - Rauchbombe, weaponDrop;
  - später der Boss-Launch (K13).
- **SFX:**
  - der Arena-Cue-Bank;
  - dazu die neuen Sätze im privaten Branch: `40_AUDIO/elevenlabs_r1/melee_destruction_r1` (Whoosh, Körper- bzw. Rüstungstreffer, Schildblock, Boss-Bonk, Wegfliegen, Landung), `combat_r1`, `blaster_r1`, `throwables_r1`, `detonator_r1`, je mit `<set>_norm/normalize_report.json`.
- **Ton und Bild synchron** zu den nativen Marken (fire, cast, release, Kontakt).

**Zwei Durchgänge:**
1. **Design-Kritik:** die ersten 60 Sekunden als fremder Spieler, je Waffe. Lesbarkeit von Treffer und Gefahr, Cartoon-Timing, Kamera, Arena-Komposition, Ton zu Bild, Lautheit und Maskierung. Bilder und Clips mit Ton.
2. **Optimierung:** Top-10 mit Aufwand, Skizzen und Prüfskripten. Wiederverwenden, was in der Fahr-Runde schon da ist: Ereignis-Strom, Ring- und Puff-Effekte, Klangkarte.
   - Prototypen nur auf einem eigenen Zweig `ws1/combat-av-r1` (Kopie der Arena-Module).
   - Der Einbau in die Arena läuft danach über WSA, ins Spiel über WS1 bzw. WS-Audio.

**Grenzen:**
- Keine neuen Assets, keine bezahlten Töne. Fehlende Töne als Liste an WS0, WS0 erzeugt sie.
- Private Dateien nie öffentlich.
- Kein Merge ohne Georg.

**Meldung:** `ws1/audits/COMBAT_AV_R1.md` (Kritik + Top-10) mit Clips; Kurzstatus an WS0.
