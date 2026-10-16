# Fluff-Sorten, Verteilung und Welt-Ausstattung · R1 (16.10.2026)

Georg 16.10. per Sprache, von WS0 kommentiert. Register: V-368 (Fluff), V-369 (Ausstattung). Vorhandene Grundlagen: sechs Story-Mode-Farben V-292, Fluff-Konzept `CONCEPTS_FLUFF_MINIGAMES_R1/OVERVIEW.md` v0.3, Ernte-Regeln (Memory kfb-fluff-harvest), Game Loop `GAME_LOOP_R1.md`, Farbregel V-305/V-331.

## 1 · Sechs Fluff-Sorten = sechs Story-Modes
| Sorte | Farbe (satt, V-292) | Lesart |
|---|---|---|
| Tragic | #3e6a83 Stahlblau | tragisch |
| Comic | #7a8d4a Oliv | komisch |
| Absurd | #e9c14a Gold | absurd |
| Heroic | #d97c3a Orange | heroisch |
| Mystical | #6b4e7d Violett | mystisch |
| Forbidden | #a64670 Weinrot | verboten |

Damit liest man den Fluff parallel zu den Karten: Wer Fluff sammelt, sammelt Stimmungen. Die Farben sind schon kanonisch, es kommt keine neue Palette dazu.

**Rezept (Arbeitshypothese, einfach):** Je ein Kügelchen jeder Sorte (6 verschiedene) ergibt **eine beliebige Karte nach Wahl**, gefertigt bei Hexe/Alchemist (kurze Knet- bzw. Roll-Animation). Die High/Low-Varianten aus OVERVIEW v0.3 bleiben in den Daten erhalten, spielen fürs Rezept aber vorerst keine Rolle.
*WS0-Kommentar:* Einfach ist richtig für den Anfang. Später kann eine Karte ihre eigene Sorte doppelt verlangen (heroische Karte = 2× Heroic + 4 andere), das macht die Verteilung spürbar, ohne das Suchen zu verlängern. Erst nach dem ersten Spieltest entscheiden.

## 2 · Verteilung
- **Überall jede Sorte:** In jeder Zone wachsen alle sechs. Niemand muss lange suchen, fehlende Karten sind schnell „zusammengeklaubt“, neben Lootboxen, Botengängen und Zerstörung.
- **Gewichtung nach Karte/Zone:** Die Story-Mode-Farbe der Zone (aus der Karte, V-331) gibt die häufigste Sorte vor. Vorschlag: Hauptsorte etwa 40 %, die anderen fünf teilen sich 60 %, jede mindestens 8 %. Der Biom-Gedanke färbt mit: Zonen mit Schnee, Wüste, Wald haben ihre Bäume, der Fluff daran folgt der Karte.
- **Fundorte:** an Bäumen und Büschen (Windfall: fällt, springt, rollt bergab), im Boden (Sprengen/Graben legt Nester frei), in Truhen. Aufsammeln durch Drüberlaufen oder -fahren.
- **Lesbarkeit:** Fluff ist bewusst bunt und darf die Biom-Palette brechen (Georg 10.10.), damit man ihn von weitem sieht.

## 3 · Welt-Ausstattung ohne Meshy für alles
**Bäume und Büsche:** KayKit Forest Nature Pack zuerst (auf main, 211 Modelle inkl. Schnee-Varianten), dann Tiny Treats (Pretty Park, Pleasant Picnic, House Plants), Kenney zuletzt (Reihenfolge V-Asset-Priorität). Wenige Bäume, gezielt gesetzt; Fluff-Kügelchen als Clay-Instanzen an Ast-Ankern.

**Landmarks als Baukasten-Dioramen:** Neben den Meshy-Landmarks entstehen halboffene Dioramen aus KayKit/Tiny-Treats/Dungeon-Generator-Teilen: Bäckerei (Tiny Treats Bakery Interior), Wohn-Ecken (Homely House, Charming Kitchen, Bubbly Bathroom), Satire-Imbiss mit bösem Clown (KayKit Mystery Series 6 „Clown“ + City Builder Bits). Schnittkanten werden **abgerundet** (ruinenartig, Knet-Kante statt glatter Schnitt, V-011/„keine harten Schnitte“), damit Baukasten und Meshy gleich aussehen. Setzen per Gizmo: der vorhandene In-Place-Editor (V-360, `edit-layer.js`), gespeichert als Rezept; vorgerenderte Rezepte für die Standard-Welt.
Jedes Landmark braucht vorher seine Geschichte (wer, was, warum, Regel „World logic first“), z. B. Katze im Bierglas = Stammgast der Kneipe, die nie schließt.

**Truhen mit Eigenleben:** KayKit Dungeon Pack hat Truhen in common/uncommon/rare **und Mimic-Varianten mit Zähnen** (auf main). Darauf das KFB-Augen-Rig (EyeRig, Lid E2). Schlagen oder Rammen → Truhe platzt (2D-first FX, V-Destruction R4) → Kügelchen bzw. Karte springen heraus. Öffnende Truhe mit Goldschein: Spender `room-fx.js` im Dungeon Generator (KayKit Environment Atlas, Room Study S21). Georgs Meshy-Truhen-Packs kommen dazu, sobald er sie hochlädt.

## 4 · WS0-Vorschläge (neu, zum Abwägen)
| Idee | Was | Warum es passt |
|---|---|---|
| Fluff-Böe | Ab und zu fegt eine Windböe durch die Zone, alle Bäume schütteln Fluff ab: kurzer bunter Regen zum Einsammeln | Chill-Fun-Moment ohne Kampf, nutzt die vorhandene Windfall-Physik |
| Fluff färbt die Hauptstadt | Abgegebener Fluff färbt das Diorama der Zone sichtbar ein (Story-Tint, V-286) | sichtbarer Fortschritt, verbindet Ernte mit dem Deck |
| Driften durch Fluff | Wer durch ein Fluff-Feld driftet, wirbelt die Kügelchen auf und sammelt sie im Bogen ein | belohnt K2B-Fahrspaß (Q/E-Drift) |
| Flüchtende Mimic-Truhe | Manche Truhen hüpfen davon, man jagt sie mit dem Auto, Rammen lässt sie platzen | Mini-Verfolgung, nutzt Fahren + Augen-Rig |
| Karaoke-Jukebox als Landmark | In jeder Zone steht eine Jukebox; dort läuft der Deck-Song, und man singt die gesammelten Karten mit (Comic Card Karaoke) | verbindet Songs, Karten und Zonen-Soundbed (V-294) |
| Postkarten-Modus | Ein Schnappschuss eines Dioramas wird Sammel-Postkarte im Almanach | billig, macht Spaß, teilbar (Marketing, V-363) |
| Almanach-Feldnotiz | Jeder gefundene Landmark bekommt eine Almanach-Seite mit einem FrizzleBob-Satz und Link aufs Deck-Dossier | fraktaler Almanach + Deck-Seite (V-363) |
| Story-Mode-Würfel | Beim Herstellen rollt man einen sechsseitigen Story-Mode-Würfel: Bonus-Kügelchen der gewürfelten Sorte | spielerisch, schon als Kandidat notiert |

Leitplanke für alles: Chill-and-Fun, kein Scheitern, Fluff wächst nach.
