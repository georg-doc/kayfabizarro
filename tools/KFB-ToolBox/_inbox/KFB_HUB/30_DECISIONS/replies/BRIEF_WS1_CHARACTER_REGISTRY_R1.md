# WS0 → WS1-Lead, WS-NPC, WS-Audio · Charakter-Register anschließen · R1 · 2026-10-22 (V-682)
**Tier 0:** Es gibt jetzt eine Quelle je Figur, das Register CHARACTERS_R1. Spiel, Bewohner und Ton lesen Figuren-Daten nur noch von dort. Nichts erfinden, nichts am Register selbst ändern.

## Wo
GitHub, Register-Branch `docs/kfb-decisions-register-2026-10-11`, Ordner `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/CHARACTERS_R1/`:
- `index.json`: alle 133 Figuren (id, name, kind, status, Anzahl gefüllter bzw. offener Felder, Pfad);
- `characters/<id>/character.json` (Schema kfb.character/1.1): identity, story, personality, dialogue, voice, chatter, preferences (Waffen, Biom), dioramas, songs, variants, memory, appearance.figureRefs, provenance je Feld;
- `aliases.json`: jede alte ID (cast.r1, Resident Atlas, voice_casting, Figurenkarten, z. B. `kfb_disco_demon` → `demon_lord`) auf die feste ID;
- `GAPS.md`: offene Felder und lose Enden.

## Was ihr umstellt
1. **Eine feste ID im Code.** Jede Figuren-ID im Spiel über `aliases.json` auflösen und mit `index.json` abgleichen. Alte IDs bleiben als Alias lesbar, neue Stellen nutzen die feste ID.
2. **Prüfung im Test.** Ein Test schlägt fehl, wenn das Spiel eine Figur benutzt, deren ID nicht im Register steht. Vorlage ist die Logik von `tools/check_character_parity.py` im selben Ordner-Baum.
3. **Aussehen** weiter über die Figurenkarte: aus `appearance.figureRefs` die Karte mit `kind: canonical`. Hat eine Figur keine canonical-Karte oder gar keine figureRefs, bleibt die bisher genutzte Karte und die ID wird im Status gemeldet. Die bisherigen Lader-Prüfungen bleiben (Augen-Rig Pflicht, Karte ohne Rig wird sichtbar abgewiesen, keine offenen Design-Karten im Spiel, nie ein rohes GLB als Ersatz; V-391, V-395). `variants` enthält Szenen-Looks (Disco, Band) und Textur-Varianten; Textur-Duos wie Hexe A/B (V-586) bleiben eigene Looks mit eigener Karte. Wo das Register ein Duo unter einer ID führt, beide Karten weiter nutzen und im Status melden. **Infiziert/geheilt ist kein Variant**, sondern der Laufzeit-Schalter eye-goo v1.1 auf demselben Rig, eine Karte je Figur (V-664, V-666). **FrizzleBob:** Die FB_CANON-Hash-Prüfung (V-658) bleibt im neuen Pfad aktiv; ein canonical-Eintrag im Register ersetzt sie nicht. FB bleibt gesperrt, bis FB_CANON abgenommen ist.
4. **WS-NPC:** Bewohner-Daten (Name, Beziehungen, Sprechweise, Dioramen, Biom) aus dem Register. Die Begrüßungs- und Ereignis-Logik bleibt bei euch.
5. **WS-Audio:** Stimme und Chatterbox-Instrument je Figur aus `voice` und `chatter` im Register. Das ersetzt das in `replies/CHATTERBOX_SPEC_R2.md` genannte `chatter`-Feld in cast.r1.json und die eigene Stimm-Datei je Figur aus dem Fluff-o-lect-Entwurf (kfb.fluffolect.voice/1) (V-682). Die 156 Familien-Clips liegen im privaten Repo georg-doc/KFB-Stunt-Car-Race, Branch assets/private, Pfad `40_AUDIO/elevenlabs_r1/chatter_families_r1_lufs/`.
6. **Leere Felder:** Felder mit Status `todo` bleiben im Spiel leer bzw. auf dem bisherigen Platzhalter. Werte mit Herkunft PREFILL oder DESIGN gelten nur als Vorschlag und werden im Spiel wie `todo` behandelt (bisheriger Platzhalter bleibt). Was fehlt, bitte im Status melden, nicht selbst füllen.

## Was nicht
- Keine eigene Figurenliste mehr pflegen. `cast.r1.json` liefert weiter Rig und Clips, aber ihre IDs müssen sich im Register auflösen.
- Änderungen an Figuren-Daten laufen über Georg bzw. WS0 und werden im Register neu erzeugt.

## Rückmeldung
Im Status: welche Stellen umgestellt sind, Ergebnis des Prüf-Tests und Liste der IDs, die nicht auflösen.
