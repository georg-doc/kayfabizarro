# BRIEF · Dark Fluffer: Zensur-Plage und Heilung · R1 · 2026-10-21 · WS0
**Register:** V-583.
**Owner:** eine neue, parallele Claude-Code-Sitzung „WS-Fluffer“. Der WS1-Lead startet sie mit diesem Brief (Georg 21.10.). Sie integriert sich in das Spiel von WS1; Merge nur mit Georg.

**Quelle (Georgs Konzept aus dem Web-Chat):** Repo `georg-doc/kayfabizarro`, Branch `recovery/kfb-minigames-fluff-source-bridge-2026-10-15` (Draft-PR #400), Ordner `skills/chat/recovery/`:
- `KFB_DARK_FLUFFER_META_PLAGUE_RESIDENT_LIFE_CONCEPT_R1_2026-10-21.md` (Konzept);
- `WS1_DARK_FLUFFER_CORRUPTION_HUNT_HEAL_FOLLOWON_R1_2026-10-21.md`: der Ausführungs-Brief mit den Stufen P1–P4, Quell-Audit und Abnahmepunkten A–F. **Der gilt.** Das hier ist WS0s ACK dazu mit den Entscheidungen.

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` und die Zeilen deines Fachgebiets. Vor dem Bau liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung über `CANON_3D/lib/kfb_env.py`; Figuren, Material und Licht über die Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün, dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`. Georg sieht nur Bestandenes.

**Kern (Georg):** Heilen statt töten. Ein geheilter Fluffer bekommt weiße Cartoon-Augen, hört auf, Zensur-Goo zu spucken, und lässt bunten Fluff fallen, und zwar nur über die vorhandenen sechs Fluff-Arten und Module (`fluff.js`). **Keine Blumen, keine Partikel, kein zweites Effekt- oder Physiksystem.**

## Block
**WS0-Entscheidungen (ACK/TUNE zum Web-Chat-Brief):**

| Punkt | Entscheid |
|---|---|
| Name | Produktion `dark_fluffer`. Im Spiel sagen die Figuren „Black Fluffer“. Keine siebte Fluff-Art; „tainted“ ist nur Darstellung + Weltzustand. |
| Figuren | Quaternius MonsterCuteCubes aus dem Arena-Roster (`modules/kfb-monster-roster.js`), nur Bodenläufer. Für R1 **ein** Cube, später 3–4. Flieger und Bosse erst in P4. |
| Herkunft | Die drei Versionen (Men in Black, Hunkys Experiment, Dorys Käsemond-Omelett) bleiben Gerüchte, die Figuren einander erzählen. Nichts davon ist Kanon, und keine Figurenkarte wird geändert. |
| Heilen | Kommt in R1 (P3 vorgezogen), aber nach P1. Auslöser: **ein vorhandenes Werkzeug oder eine vorhandene Aktion aus WS1**, keine neue Waffe. Die Inventur in Schritt 0 listet die Kandidaten; WS0 entscheidet anhand eines Bildes. Ertrag ist endlich: einmal bunten Fluff fallen lassen, danach friedlich (Abklingzeit, kein Farmen). Besiegen bzw. Vertreiben bleibt eine getrennte Option. |
| Weiße Augen | Erst als isolierter Asset-Nachweis über die Proof-Stage. Die Variante baut WSB (Blender), as-is bis auf die Augen. Fehlt sie, liefert WS-Fluffer die Heilung ohne Augenwechsel und meldet das als Lücke. |
| Goo | Spucken nach `spuck.v3.js`: sichtbares Ausholen, 3–5 Tropfen aus dem Maul, kein Zielring. Tinte `#1f1a14`. Der Fleck ist ein begrenzter Patch (Decal/Zellmaske) auf dem Gelände, kein Flood-Shader, keine Änderung an Kollision oder Bäumen. |
| Bewohner | Eine Figur bemerkt den Fluffer, weicht aus oder warnt und kehrt dann zu ihrer Tätigkeit zurück. Gibt es WS-NPC (V-580) schon, dann darüber, sonst eine einzelne Figur aus `60_CAST/cast.r1.json`. Mob-Chant und Triplets erst in P2, nur Text, keine Stimme. |
| Ton | Liefert WS0 (ElevenLabs, `40_AUDIO/elevenlabs_r1`). Bis dahin stumm bzw. Platzhalter; WS-Fluffer erzeugt selbst keinen Ton. |

**Reihenfolge:**
1. **Schritt 0, Quell-Audit (laut Web-Chat-Brief):** Arena-Dateien lesen; Cube, Spucken und +Z-Blickrichtung isoliert rendern; `fluff.js`, `interactable.js` und `save.js` aus WS1 lesen; Kandidaten für das Heilwerkzeug auflisten. Ergebnis nach `ws-fluffer/AUDIT_R1.md`. Liegt das Spender-Paket von WSA schon vor (V-584: Maul-Anker, Blickrichtung, Clips und Spuck-Timing je Cube), wird es genutzt statt neu vermessen.
2. **P1 KISS:** ein Cube, ein Patch, ein Baum mit Fluff; der Fluff wird dunkel, fällt mit der nativen Physik, bleibt liegen und versinkt; eine Figur weicht aus; Reinigen bzw. Ablauf stellt den Patch wieder her. Gleicher Seed ergibt das gleiche Ereignis.
3. **Heilen:** Auslöser nach WS0-Entscheid; der Fluffer bekommt weiße Augen, das Goo hört auf, bunter Fluff fällt einmal über die nativen Module.
4. **Abnahme:** A–F aus dem Web-Chat-Brief; gemessen ≥ 55 fps aus der Spielkamera; Clip aus dem Spiel.

**Grenzen:**
- Keine neue Figur und kein neues Asset außer der Augen-Variante von WSB.
- Kein zweites Kampf-, Spawn- oder Physik-System; die Arena ist nur Spender.
- Keine Speicher-Migration ohne den Welt-Speicher-Owner; bis dahin nur flüchtiger Zustand.
- Laufzeit-Code nur auf Branches `ws-fluffer/*`. Push nach WS0-Go; den Deploy-Key nur mit Georgs direkter Bestätigung in deiner Sitzung.

**Meldung:** eigener Abschnitt WS-Fluffer in `WS1_STATUS`; Clip aus der Spielkamera, Isolationsbilder, fps-Messung, nächster Schritt.
