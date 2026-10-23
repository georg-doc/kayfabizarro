# Triplet-SSOT · Karten, Dialog, Tratsch, Songs · R1 · 2026-10-24 · WS0 (V-698)
**Tier 0:** Eine Stelle für alles rund um Triplets: was ein Triplet ist, wie es im Dialog, im Karten-Tratsch und in Songs benutzt wird und welche Datei wofür maßgeblich ist. Jede Sitzung liest hier zuerst, statt Georg zu fragen. Neue Entscheidungen werden hier eingetragen; Detailregeln stehen nur in der jeweils maßgeblichen Datei, hier nur der Verweis.

## 1 · Was wo gilt
| Thema | maßgeblich | Prüfung |
|---|---|---|
| Kartentext (Quelle aller Triplets) | **Druck-PDF führt immer** (V-242, V-696); Felder `cardName`, `power`, `lore`; Titel in normaler Schreibweise, Druckschreibweise in `cardNamePrint` (V-271); `media/kfb/cards.json` wird an den Druck angepasst | Druck-Transkription `t1.print_cards.json` (Deck-Songs, ws-song/workshop-r1) |
| Kartenzeile (Dialog und Song) | `replies/TRIPLET_SET_SPEC_R2.md` (V-266, ersetzt die Einzelregeln vom 14.10.), Verdichtung nach V-277, bleibt verbindlich auch in Songs (V-410) | `replies/triplet_set_check.py` (Pflicht) |
| Opener | Pool V-218, Bogen statt Verteilregel V-325, `replies/OPENER_ARC_R2/`, `OPENER_RESEARCH_INVENTORY_R1.md` | in triplet_set_check bzw. song_gate |
| Deck-Songs | `replies/SONG_SPEC_R3.md` (R3.3), Gewichtung V-410, Suno-Format V-277, Writer's Room V-374/V-376 | `replies/song_gate.py` |
| Suno (Style, Lyrics, Stems, Ernte) | `replies/SUNO_SSOT_R1.md` (V-689) | – |
| Stimmen für Dialog-Triplets | V-285, V-308: vorab erzeugte Einzeldateien je Figur (Kokoro lokal; FrizzleBob am_michael, GothGirl bf_emma), keine Sprachausgabe zur Laufzeit | – |
| Sprachmelodie (Chatterbox, ohne Worte) | `CHATTERBOX_SPEC_R2.md`, Familien V-678/V-693 | – |
| Fluff-o-lect (Sprechblasen-Lesart) | `replies/SPEC_FLUFF_O_LECT_R1_DRAFT.md` mit V-506, V-515 | – |
| Sprechblasen | kfb-bubbles (V-501) | – |
| Karten-Tratsch im Spiel | WS-NPC `KARTEN_TRATSCH_KONZEPT_R1.md` (Georg-Freigabe 23.10.) und §4 hier | WS-NPC Stufe 0/1 |

## 2 · Die Kartenzeile in einem Absatz
Maßgeblich ist `TRIPLET_SET_SPEC_R2.md` (V-266) mit der Korrektur V-700; hier der Kern. Die Karte spricht selbst (Show it, Spin it, Sell it). Eine Zeile je Karte, Englisch, in einem Atem (etwa 8–20 Wörter bzw. 80–95 Zeichen). **Ein ganzer Satz mit Fluss, der auch in Suno trägt:** kurz, prägnant, Comic-Stil, Weglassungen erwünscht. **Kein Etikett wie „Broken Bridge:“, keine Doppelpunkte, keine Semikolons, kein Telegramm** (V-700). Der Titel steht im Satz, die Satzform folgt der Karte und wechselt über das Deck. Nur Wörter der Karte, höchstens ein Fluff-o-lect-Wort, Mechanik nur, wenn sie ein Bild ist, Closure statt Erklärung. Ohne nachweisbare Felder gibt es keine Zeile; dann wird der Kartentext roh benutzt. Prüfung: `triplet_set_check.py` bzw. `song_gate.py` (C14) brechen bei Doppelpunkt oder Semikolon ab.

## 2b · Satzbild in Sprechblasen und Textausgabe (Georg 24.10., V-699)
- **Kartentitel immer fett**, in jedem Sprechblasen-Satz und jedem angezeigten Triplet.
- **Kursiv kontextuell:** Betonung, Umkehrung oder Pointe, **höchstens eine kursive Stelle je Sprechblase** (Georg 24.10.).
- **Rufe immer fett, genau in dieser Schreibweise und mit diesen Satzzeichen:** **Bingo!** · **Boggle...?** · **Bongo.** · **Blödsinn!** · **Humbug?!**
- Das gilt nur für Angezeigtes (Sprechblasen, Hub, Kartenoverlay). In Suno-Lyrics und in Texten für Sprachausgabe steht kein Markup.

## 3 · Zwei Formen, nicht verwechseln
- **Dialog-Set** (Gespräch, Tratsch, Kartenspiel): Kartenzeilen nach §2, Sets mit Intro „Welcome to <Deck>.“ und Outro „Stay Fluffy!“, Opener je Set einmal (V-266).
- **Deck-Song:** dieselben Kartenzeilen; die Power ist nur Seitenhieb, Motiv-Wörter aus dem Bild sind erlaubt, „Seite = Strophe“ heißt Reihenfolge über die Opener, songLine nur bei Unsingbarem (V-410). Ein Deck = ein Suno-Track unter 5000 Zeichen (V-277). Entsteht im Writer's Room: erst das Deck verstehen, nicht nach Mustern arbeiten.

## 4 · Karten-Tratsch und Konnektivität im Spiel (Georg 23.10., WS1 §153)
- **Karten wandern von Kopf zu Kopf.** Bewohner tragen Karten als Wissen und erzählen sie in Begegnungen weiter; erzählt wird mit Quelle (Gerücht D2, V-602). Ketten (told-of-told) sind freigegeben; `kfb.world-save/2` baut der Lead zu Stufe 1.
- **Kein thematisches Matching.** Der Mismatch zwischen den Karten zweier Figuren ist gewollt: kognitive Dissonanz als Resonanzraum, Satire auf Filterblasen.
- **„Conflict is king!“** Ein Dramaturg wählt Begegnungen und Karten; die Bewertung bleibt sozial.
- **Rufe:** **Bingo!**, **Boggle...?**, **Bongo.**, **Blödsinn!**, **Humbug?!** (Schreibweise §2b). Humbug = Blitzdingsen bzw. Löschen (V-530), später auch teilweise; Auslöser: zu schnelle Verbreitung. KafKaBONDO! ist ein Bug bzw. Artefakt.
- **Sprechblasen** zuerst als Klartext („decodiert“); Fluff-o-lect und Pottymouth-Glyphen später.
- **Identität:** Jede Figur hat ein Signatur-Deck (`SONGS_WORKSHOP_R1/signature/SIGNATURE_DECKS_R1.json`, 62 Figuren, Georg 20.10.) und eine Tratsch-Art (Tratschmaul, Skeptiker, Übertreiber, Schweiger, angepasst, rebellisch). Beides gehört ins Figuren-Register (`CHARACTERS_R1`), nicht in eigene Listen.
- **Später (V-697):** Bewohner spekulieren als Alltags-Aktivität über neu gefundene Karten in der Welt (Terrain, Billboards). Vorlage: NPC Card Speculation Scene (`75_REFS/npc_card_speculation_r1/` im privaten Branch). Das ist eine weitere Quelle für den Tratsch.
- **Stimme im Spiel:** Sprachmelodie über die Chatterbox-Familie der Figur. Gesprochene Triplets als Einzeldateien nur dort, wo Georg sie freigibt (V-285).

## 5 · Offen (wird hier nachgetragen, nicht neu erfragt)
- Stufe 0 des Tratschs (WS-NPC): Der Dramaturg verdreifacht den Konflikt. Nach etwa einer Woche gibt es aber fast nur noch BINGO, und die Blasen bleiben schwach. Vorschläge von WS-NPC liegen bei Georg.
- Decks für die Kayfabrick-Bots fehlen; the_uruk_rumble (Orc Brute) hat in cards.json 0 Karten.
- Triplet-Abnahme-UI (V-237): später als WSA-Site mit Figuren und Stimmen.
