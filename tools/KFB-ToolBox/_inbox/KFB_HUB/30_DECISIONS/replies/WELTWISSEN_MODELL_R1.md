# Weltwissen der Figuren · Entwurf R1 · WS0 · 31.10.2026 (V-1066, V-1070) · FREIGEGEBEN Georg 31.10. (q313: so ausarbeiten, Rufe zeigen nur die Haltung)

**Ziel (Georg 31.10.):** Karten sind das Weltwissen der Figuren. Figuren tauschen es in Triplets aus. Es entsteht ein emergentes System: Mit Spieldauer, Begegnungen, Orten und Kartengebäuden wächst es, und dieselbe Figur ist in zwei Spielen verschieden. Passt zu Game Loop PR 460 (V-1047, Hauptziel Karten und Weltwissen; V-1049) und zum Global Intent (Lean Memory, keine zweite NPC-Datenbank).

## Grundsatz
Eine Figur führt eine Liste: welche Karte sie kennt, woher, und wie sie dazu steht. Keine Karte hat einen Besitzer oder Ort, der verfolgt wird. Der Spieler hat sein Journal (Almanach).

Eintrag: `Karte · Quelle (Start, Figur, Spieler, Ort) · Wissensform (gesehen, beteiligt, erzählt) · Haltung · Tag`

- Das Muster gibt es schon: `src/npc/npcMemory.js` führt gesehen, beteiligt und erzählt mit Quelle für Ereignisse, mit Sichtweite für Zeugen. Hinzu kommt nur die Karte als Inhalt.
- Datenbedarf und Kappen stehen im Konzept: `docs/ws-npc/KARTEN_TRATSCH_KONZEPT_R1.md` §3.2 und §8; die Stufe-0-Rechnung blieb klein.
- Live ist heute nur die Ereignis-Erinnerung; der Karten-Tratsch läuft bisher nur als Simulation.

## Woher Wissen kommt
1. **Start:** wenige Karten aus dem Signatur-Deck der Figur.
2. **Erzählt:** in Begegnungen von Figur zu Figur, als Triplet, mit Quelle.
3. **Zeuge (neu):** Wird im Ort eine Karte gespielt oder ein Kartengebäude freigespielt, bekommen Figuren in Sichtweite den Eintrag „gesehen“. Das ist derselbe Mechanismus wie heute bei der Fluffer-Heilung.
4. **Vom Spieler gezeigt (Stufe 4 im Konzept):** Quelle Spieler.
5. **Vom Ort (später):** Wer dort lebt, schnappt nach und nach die Karten dieses Ortes auf.

## Was es bewirkt
- **Was die Figur sagt:** Triplets nur aus Karten ihrer Liste.
- **Zwei Spiele, zwei Figuren:** Spieler A spielt andere Karten an anderen Orten, also hat dieselbe Figur eine andere Liste und redet, urteilt und bittet anders. Nichts davon muss je Spielweg geschrieben werden.
- **Haltung statt Tor (entschieden):** Wer eine Karte gehört hat, kennt sie immer; der Ruf setzt nur die Haltung (überzeugt, offen, gleichgültig, hält es für Blödsinn). So kann eine Figur später über eine Karte lästern, die sie ablehnt. Rufe bleiben als sichtbare Reaktion, sind aber nicht Pflicht in jedem Austausch.

## Warum der Spieler Karten zeigt
Dafür muss niemand den Inhalt einer Karte auswerten; Deck und Quelle sind Daten.
- **Auftrag:** Einer Figur fehlen Karten ihres Decks, sie bittet darum: suchen oder überbringen.
- **Tausch:** Zeigst du eine Karte, erzählt die Figur dir eine aus ihrer Liste, die in dein Journal geht.
- **Saat:** Wem du eine Karte zeigst, der trägt sie weiter. So verändert sich die Stadt, und zu schnelle Verbreitung ruft die Men in Black (V-530, Meme-Ökologie V-730).
- **Streit:** Du kannst Figuren gezielt aufeinander loslassen (Conflict is King). Das Motto aus PR 460: „You choose something, ride the consequences.“

## Was bleibt, wie es ist
- Kein inhaltliches Matching, keine Themen-Tags im freien Tratsch (Georg 23.10.). Der Mismatch bleibt gewollt.
- Handgeschriebene Szenen dürfen eine bestimmte Karte kennen.
- Karten-Spekulation (V-702) bleibt eine weitere Quelle.
- Aus Dossier 07 kommt nur: Wissen und Haltung trennen, spätere Rückbezüge. Nicht: Aussagen, Beweise, physische Karten.

## Erster Beweis
Ein Ort, wenige Figuren, ein Kartengebäude: Karte freispielen, Zeuge merkt es, erzählt es in der nächsten Begegnung, spricht dich darauf an, bittet um eine fehlende Karte. Zwei Läufe mit verschiedenen Karten zeigen dieselbe Figur verschieden. Abnahme im Spiel.
