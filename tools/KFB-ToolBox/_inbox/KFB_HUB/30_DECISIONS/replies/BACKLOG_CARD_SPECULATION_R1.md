# Backlog · Karten-Spekulation (NPCs erschließen fremde Karten) · R1 · 2026-10-24 · WS0 (V-702)
**Tier 0:** Zwei oder mehr Figuren stehen vor einer Karte, die sie nicht kennen, und versuchen, sie mit ihrem Weltwissen (ihren eigenen Karten und Triplets) zu erklären. Jede bringt ihren Pitch, ihre Bedenken und ihre Deutung. Aufgelöst wird nichts. Der Spieler soll daran erkennen, wie die Figuren denken und was Karten in der KFB-Welt bedeuten. Kein Bauauftrag jetzt; Reihenfolge in §4.

## 1 · Herkunft
- Georg 24.10. (Chat), Vorstufe: NPC Card Speculation Scene (Claude Design, 25.09.), privat unter `75_REFS/npc_card_speculation_r1/` (V-697).
- Von dort gilt nur die Grundmechanik. Design, Figuren-Fassungen und Technik sind überholt (z. B. alter FrizzleBob).

## 2 · Bausteine
- **Karte in der Welt:**
  - zuerst schwebend oder auf einem Billboard, mit KFB Ink Outline wie im Deck Viewer v4 (`deckviewer/ink-frame.js`);
  - später als Option eine Karte, die exakt auf dem welligen Terrain liegt und befahrbar ist. Denkbarer Weg: die vorhandenen Terrain-Patches (`inkPatch`, WS-NPC Phase C), erst nach Messung.
- **Weltwissen je Figur:** welche Decks bzw. wie viele Karten eine Figur kennt, und ihre Weltsicht. Beispiele aus Georgs Skizze:
  - der Lorekeeper kennt zu jedem Deck mindestens eine Karte (Orientierung über alle Decks);
  - Hunky & Dory, die Hexenschwestern (Fluff-Alchemie) und der Caveman kennen viele Karten;
  - der Caveman steht für Philosophie (Platos Dungeon Raid), der Demon Lord für Dystopia, der CEO für Utopia.

  Das gehört als Felder ins Figuren-Register (`CHARACTERS_R1`), zusammen mit Signatur-Deck und Tratsch-Art (V-698). Keine eigene Liste.
- **Paarung nach Spannung:** Der Dramaturg aus dem Karten-Tratsch wählt Gegensätze nach „Conflict is king!“, z. B. Caveman gegen Demon Lord über eine Dystopia-Karte. Gesellschaftsfragen wie Macht, Herrschaft und Anarchie entstehen aus den Decks, nicht aus neu erfundenem Text.
- **Sprache:** Kartenzeilen aus der eigenen Karte der Figur nach `TRIPLET_SSOT_R1.md` (ganze Sätze, V-700), dazu die fremde Karte mit ihrem echten Titel in Fett (V-699). Rufe wie **Bingo!** oder **Humbug?!** als Reaktion. Sprechblasen zuerst im Klartext, Klang über die Chatterbox-Familie der Figur, keine Sprachausgabe.
- **Zuschauer:** Vorbeigehende Bewohner bleiben stehen und hören zu. Die Begegnung läuft nach der vorhandenen Grammatik (bemerken, annähern, ausrichten, …).
- **Spieler (später):** Er mischt sich ein und deutet die Karte mit einer eigenen Karte (Show it, Spin it, Sell it), im Stil der Interpretationsrätsel von Monkey Island. Die Figuren reagieren nach ihrer Weltsicht.
- **Kartenzone mit Wächtern (später):** Mobs, z. B. Skelettkrieger, verteidigen die Karte oder sprechen für sie. Dafür gibt es die Gruppen-, Aggro- und KO-Bausteine aus WS-NPC Phase D.

## 3 · Abhängigkeiten
- Kartendaten nach Druck (V-696), Triplet-Sets für die betroffenen Decks, Felder im Figuren-Register, Sprechblasen mit Fett und Kursiv (V-699), Chatterbox-Familien (V-693), Ink-Rahmen-Modul aus dem Deck Viewer (V-697).

## 4 · Reihenfolge (Vorschlag WS0)
1. **Jetzt (WS0, nur Daten):** Weltwissen und Weltsicht als Felder beim nächsten Bau des Figuren-Registers.
2. **Nach der MVP-Site und Tratsch Stufe 1 (WS-NPC):** Stufe A ohne Bild, wie Tratsch Stufe 0. Zwei Figuren und eine fremde Karte ergeben ein Gesprächsprotokoll als Text. Georg liest und urteilt.
3. **Stufe B im Spiel:** Billboard- bzw. Schwebe-Karte als Ort mit Ink-Rahmen, zwei Figuren kommen dazu, Sprechblasen und Sprachmelodie, Zuschauer bleiben stehen.
4. **Stufe C:** Der Spieler mischt sich ein.
5. **Stufe D:** Karten im Terrain (nach Leistungsmessung) und Wächter-Mobs.
