# KFB Arsenal R1 · Zuordnung K10-Waffenkarten ↔ Gefühlsprofile

Stand 26.10.2026 · WS1 Lead für WSA und WS0 · Vorschlag, kein Bau, keine Abnahme

**Auftrag Georg (26.10.):**
- Der normale Kampf (bisher Proof of Concept in der Combat Arena) braucht differenzierte Waffen und Mechaniken.
- Heilen ist ein Meta-Gimmick und keine Standardwaffe; es steht deshalb nicht in dieser Tabelle.

**Quellen (gelesen, nichts geändert):**
- Modelle, Halterung und Clip-Marker: `combat-av/arena/combat-arena-v5/k10/` mit `weapons.json`, 12 Karten in `source-cards/` und Profilen in `profiles/`. Alle Karten tragen den Status `SOURCE_PROFILE_NOT_GAMEPLAY_ACCEPTANCE`: Modell und Halterung sind gemessen, das Gameplay ist offen.
- Gefühl und Ballistik: `combat-av/arena/modules/kfb-combat-def.js` v1.0.0 mit 8 Waffen (`WEAPONS`), Energiearten (`ENERGY`), Oberflächen (`SURFACES`) und Gegner-Roster.
- Im Spiel (`game/proc-world-ws0`, `src/modules/combatPlayer.js`): nur Pistole und HeroMan-Blaster, ein fester Schuss (26 m, Kegel 0,75, 34 m/s).

**Grundsatz:** Eine Waffe besteht aus K10-Karte (Modell, Halterung, Clip-Marker, Mündung bzw. Spitze) und Gefühlsprofil (Rhythmus, Flugbahn, Wirkung, Energie, Munitions-Silhouette, Ton). Die Clip-Marker entscheiden, welche Mechanik ohne neue Animation geht. Die Zahlen bleiben die der Arena, bis WSA sie neu tunt.

## Zuordnung

| # | K10-Karte (Figur in der Arena) | Clip-Marker | Gefühlsprofil (Arena) | Rolle | Konter gegen | Neue Mechanik | Energie |
|---|---|---|---|---|---|---|---|
| 1 | Pistole · Prototype Gun_Pistol (Hero) | aim, fire, fire-loop, reload | **Stinger**: Schnellfeuer, Leuchtspur | Allrounder, Startwaffe | Flieger, Kleine | optional Nachladen (Clip da) | kinetisch |
| 2 | HeroMan-Blaster (Hero), Kauf → privat | aim, fire, fire-loop, reload | **Kayfabeam**: Bolzenfolge, „schmilzt Panzer“ | Dauerdruck auf Harte | Panzer, Metall | Hitze statt Munition | heiß |
| 3 | Action-Figure-Gewehr, 1H an der Hüfte (Hero), Kauf → privat | aim, fire, fire-loop | **Hornet**: 3er-Salve, Dartschwarm | mittlere Distanz | Gruppen Kleiner | – | kinetisch |
| 4 | Armbrust 2H (Schurkin) | aim, fire, fire-loop, reload | **Bamboo Rail**: Einzelschuss, durchschlagend | Präzision, Reihe treffen | Reihen, Distanz | Nachladen als Takt | kinetisch (Arena: elektrisch) |
| 5 | Bogen · bow_withString (Schurkin) | draw, hold, release | – (**neu: Spannschuss**) | Geschick | Distanz, Schwachstellen | **Aufladen:** Spannzeit gibt Reichweite und Wucht, Bogenbahn | kinetisch |
| 6 | Bogen A · bow_A_withString (Schurkin) | draw, hold, release | wie 5 als Variante | Variante bzw. Gegnerwaffe | – | z. B. Brandpfeil (heiß, brennt nach) | heiß |
| 7 | Rauchbombe (Schurkin) | throw (Abwurf gemessen) | Flugbahn wie **Bog Lob** (Bogenwurf) | Taktik, kein Schaden | Zielen der Gegner | **Zone Rauch:** Gegner verlieren das Ziel, Deckung | – |
| 8 | Skelett-Klinge (Krieger) | chop, slice-h, slice-d, stab, jump-chop | – (**neu: Nahkampf**) | Nah, Risiko | Schilde (umgehen), Nahe | **Kombo** (3 Hiebe + Sprunghieb), Parieren, Ausweichrolle | kinetisch |
| 9 | Zauberstab · wand (Magier) | cast.bolt, cast.charged, cast.raise, channel | – (**neu: Kettenblitz**) | Gruppen-Kontrolle | Schilde, Gruppen | **Elektrisch springt über**, Aufladen über cast.charged, Dauerzauber über channel | elektrisch |
| 10 | Stab · staff (Magier) | cast.bolt, cast.charged, channel | **Nest Rocket**: Fläche, Rauchspur | Flächenschaden | Gruppen | Feuerball geladen über cast.charged; heiß brennt nach | heiß |
| 11 | Skelett-Stab (Magier) | cast.bolt, cast.charged, channel | **Bog Lob**: Bogenwurf, Ätzpfütze | Gebiet sperren | Bodentruppen | **Pfütze über Zeit:** nass bremst bzw. rutscht | nass |
| 12 | Mech-Minigun, seitlich, Boden und Flug (Mech), Kauf → privat | kein Schuss-Clip, je Schuss eine Aktion | Basis **Stinger**, schneller und breiter | Fahrzeug- bzw. Mech-Waffe | Massen, Flieger | **Anlaufen + Hitze**, Mech dreht beim Feuern −36° (V-582) | kinetisch |

**Ohne Modell bleiben zwei Profile:**
- **Scrap Cannon** (Streuschuss mit 6 Kugeln) und **Mortar** (Bogenschuss, Sprengwolke).
- Beide brauchen eine Karte, etwa eine Kanone bzw. einen Werfer aus einem vorhandenen Kit, oder eine Halterung am Racer als Fahrzeug-Waffe.
- Das wäre ein Job für WSB/WSA.

## Neue Mechaniken (Sammlung aus der Tabelle)

| Mechanik | Für Karten | Braucht |
|---|---|---|
| Aufladen | 5, 6, 9, 10 | Clip-Marker vorhanden (draw/hold/release bzw. cast.charged) |
| Hitze statt Munition | 2, 12 | HUD-Anzeige (HUD 3D, V-743), Ton bei Überhitzung |
| Energie als Spielregel (heiß, nass, elektrisch) | 6, 9, 10, 11 | Zustände am Gegner; heute nur Bild und Ton in `ENERGY` |
| Zone (Rauch, Pfütze) | 7, 11 | Flächen-Owner, auch für die Destruction-Slice |
| Kombo, Parieren, Ausweichen | 8 | Clips vorhanden; Treffer-Fenster aus den Clip-Markern |
| Zielhelfer, Aufschalten, Schwachstellen | alle | Trefferzonen am Gegner-Roster |
| Panzer, Schild, Taumeln am Gegner | Konter-Spalte | Roster-Felder; Oberfläche `shield` gibt es schon |

## Ausrüstung: jetzt V-866 (Georg 27.10.)
> **Nachtrag 27.10.:** Georg hat inzwischen entschieden (Register V-866, IDEA). Waffenwahl über die Aktionsleiste: ein Flyout mit bis zu **6 aktiven Waffen**. Wer mehr sammelt, wählt im Rucksack, welche 6 aktiv sind. Erst Design-Skizze (V-740), dann Bau; die Belegung für Gamepad bzw. Tasten ist offen.
> **Kommentar Lead:**
> - Das ersetzt den Vorschlag unten „Signatur- + Wechselwaffe“.
> - Die Tabelle oben bleibt der Vorrat, aus dem die 6 gewählt werden.
> - Eine sinnvolle Start-Sechs nach Rolle, damit jede Rolle einmal vertreten ist: Pistole (Allrounder), Action-Gewehr (Salve), Armbrust (Präzision), Stab (Fläche), Rauchbombe (Taktik), Skelett-Klinge (Nahkampf).
> - Die Frage „Signaturwaffe für FrizzleBob“ wird damit zu „Start-Sechs: passt das?“.

### Früherer Vorschlag (überholt durch V-866)
- In der Arena trägt jede Figur ihre Waffengruppe: Hero 1–3, Schurkin 4–7, Krieger 8, Magier 9–11, Mech 12.
- Im Spiel spielt FrizzleBob. Nach der Arena-Einteilung „Signatur“ und „Wechsel“ wäre der Vorschlag:
  - eine Signaturwaffe, die immer da ist;
  - eine Wechselwaffe aus Fundsachen bzw. Rucksack;
  - Wechsel über das HUD.
- Welche Signaturwaffe FrizzleBob trägt, entscheidet Georg.

## Nächster Schritt
1. WSA prüft die Zuordnung und das Tuning in der Arena: je Zeile ein kurzer Clip, Rolle und Konter sichtbar.
2. Daraus wird ein Waffen-Konzept R1 mit Prüfkriterien (Rolle, Rhythmus, Flugbahn, Wirkung, Konter).
3. Georg wählt im Bild bzw. Clip.
4. Erst danach der Einbau ins Spiel. Owner Combat (V-782): WS0.

Private Modelle (Kauf) bleiben in der privaten Ablage und gehen nie in öffentliche Vorschauen.
