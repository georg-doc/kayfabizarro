# Backlog · Meme-Ökologie R1 (V-730, WS0 24.10.2026)

Für: WS-NPC (Umsetzung nach dem MVP), WS1 (Billboards, Goo), WSV (HyperNorm-Clips). Daten: `replies/MEME_POOL_R1.json`. Quellen: `hypernorm_slogans_r1.json`, `BNWN_SOURCE_R1.md`, `SUBSTACK_GEMS_R1.md`. Regeln: TRIPLET_SSOT §4.

## Tier 0
1. Zwei Lager streiten um die Köpfe der NPCs: Blob (BNWN, Utopia-CEO, MiB) mit Propaganda, Rebellen mit den Protopian-Slogans. Beide nutzen ein Datenformat und laufen über denselben Tratsch.
2. Je NPC ein Wert `mind.trance` von 0 (wach) bis 1 (Trance). Blob-Meme heben ihn, Rebellen-Meme senken ihn. Die Rufe zeigen die Phase.
3. Nur feste Texte aus dem Pool. Die Chatterbox kombiniert und gibt weiter, erfindet nichts.

## Daten
- **Pool** (`kfb.meme-pool/1`): 129 Rebellen-Sätze (100 Manifest-Slogans plus 29 weitere), 69 Blob-Sätze aus Georgs BNWN-Posts.
- **Leitern:** 7 reale Propaganda-Phrasen, je 4 Stufen. Stufe 1 ist die reale Phrase, Stufe 4 ist sie bis zum Ende weitergedacht. Die Leitern lauten trust_experts, follow_science, protect_democracy, mis_dis_mal, stay_safe, fact_check und own_nothing. Stufen 2–4 sind ein Entwurf von WS0 und brauchen Georgs Abnahme.
- **Figuren-Register** (`CHARACTERS_R1`, kein eigenes Register): `mind.trance` (0–1), `mind.memes` (Liste von Pool-IDs mit Quelle), `mind.ladder` (Leiter-ID → Stufe). Die Tratsch-Art aus §4 bestimmt den Startwert: angepasst 0,8, Schweiger 0,6, Tratschmaul 0,5, Übertreiber 0,5, Skeptiker 0,3, rebellisch 0,15.

## Ablauf im Spiel
- **Blob-Quellen:** Billboards, BNWN-Clips und MiB-Durchsagen. In Hörweite steigt `trance`. Ein NPC, das eine Leiter-Phrase oft wiederholt, steigt eine Stufe und spricht die nächste.
- **Rebellen-Quellen:** Graffiti und Sticker des Spielers, Slogans im Tratsch, FrizzleBob-Störungen. Ein Slogan senkt `trance` stärker, wenn er auf eine hohe Leiterstufe trifft. Die Absurdität der Stufe 4 macht ihn hörbar.
- **Phasen und Rufe (V-712):**
  - Trance über 0,7: das NPC wiederholt Blob-Sätze. Bingo! zu Propaganda, Blödsinn! zu Slogans.
  - Dissonanz 0,3–0,7: das NPC mischt beide Lager in einem Satz. Boggle...? Das ist die komische Phase.
  - Schock bei einem Sprung unter 0,3: Humbug?! Das NPC ist wach und gibt Slogans weiter.
- **Gegenzug des Blob:**
  - Die MiB blitzdingsen wache NPCs, wenn sich Slogans zu schnell verbreiten (TRIPLET_SSOT §4, V-530). Danach steht `trance` wieder auf dem Startwert, `mind.memes` ist leer.
  - Goo schwärzt Graffiti und legt Zensurbalken über Slogan-Wörter in Sprechblasen (V-531).
- **Weitergabe:** wie Karten im Tratsch, mit Quelle (V-602), ohne thematisches Matching. Der Mismatch ist gewollt.

## HyperNorm
- Jeder Pool-Satz kann als Billboard-Text laufen. Wo es einen HeyGen-Clip gibt (Slogans S001–S100, BNWN 02), läuft der Clip mit.
- Bilder: `60_VIDEO/hypernorm_images_r1/` (Georgs Substack-Bilder) als Collage-Material.

## Offen für Georg
- Abnahme der Leiterstufen 2–4.
- Ob wache NPCs selbst Graffiti setzen dürfen (Ausbreitung ohne den Spieler).
