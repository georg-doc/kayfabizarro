# Briefing · KFB Recherche- und Autorendossier · WS0 · 01.11.2026 (V-1183, V-1177, V-363)
**Ziel:** Eine Quellen- und Wissensebene zu jedem Deck und Autor, die jeder in der gewünschten Tiefe und im bevorzugten Format betritt: Rockabilly-Song, Essay, Spielkarte zum Ausschneiden, FrizzleBob-Tipp, NPC-Begegnung, Deep Dive im Dialog. Vom Wissen ins Handeln: Das ist die Konversion, die KFB leisten soll.

**Grenze:** Das läuft neben dem Spiel und ändert keinen Spielcode. Der Anschluss im Spiel kommt nach dem MVP.

## Erst heben, dann recherchieren
Vieles ist schon da. Inventur zuerst, in dieser Reihenfolge:
1. **Cancel This Comic:** lokal unter `CLAUDE/gvw/FrizzleBob/cancel/`. Quellenangaben, Brainfood, „Check your sources“, FrizzleBob-Tipps.
2. **YouTube-Videos und Songs** je Deck.
3. **NotebookLM-Notebooks**, die Grundlage vieler Decks waren.
4. **Deck-Paket** `decks-ssot/` auf `data/kfb-decks-ssot` und die Karten-JSONs.
5. **Vorhandene Dossier-Planung und Booklets:** `replies/DECK_DOSSIER_ARCHITECTURE_R1.md`, Substack-Archiv cancelthiscomic.substack.com/archive, MD-Booklets unter `(DB) CS 2020 Krazy Karnikl/Krazy Kayfabizarro/PACKAGES & BOOKLETS`.
6. Eigene Deep-Research-Läufe, nur wo eine Lücke bleibt.

Der Substack-Ton ist teils KI-lastig: Absicht und Fakten übernehmen, Text nicht ungeprüft. Stimme: Carny und KnuckleBob aus der FrizzleBob-Stimmvorlage.

## Fünf Ebenen je Thema
1. **Karte:** was das Deck behauptet oder überzeichnet.
2. **Quellen:** Primärquellen, Interviews, Publikationen, je mit Link und Fundstelle.
3. **Einordnung:** belegt, umstritten, Spekulation oder Satire. Wer behauptet was, wer widerspricht? Auch und gerade bei Dark Journalist, Joseph P. Farrell, Professor Xiang, Titanic und Olympic, Warburg, Astor. Wir geben Thesen als Thesen wieder.
4. **Brainfood:** kurze Takeaways zum Mitnehmen, in FrizzleBobs Stimme.
5. **Solution Watch** (Anlehnung an James Corbett): Was kann ich konkret tun? Beispiel Überwachung, Datenkraken, KI, Hypernormalisation: Doomscrolling lassen und stattdessen dieses Video, freiere Telefone wie Above Phone oder Waller Phone als geprüfte Optionen.
   - Kein Product Placement: keine Bezahlung, mehrere Optionen, Grenzen und Nachteile nennen, Datum der Prüfung, Link zur Quelle.
   - Medizin, Recht, Geld: nur allgemeine Hinweise und Verweis auf Fachleute.

## Daten
Eine Datei je Thema oder Autor auf GitHub, verknüpft über `cid:<deck>:<nr>` und Deck-Kennung, damit Spiel, Viewer und Desk sie lesen können. Felder: Aussage, Status aus Ebene 3, Quellen, Takeaway, Lösung, Formate, Prüfdatum, Prüfer. Jede Aussage ist einzeln belegbar. Neue Quellen kommen als Ergänzung, ohne alte zu überschreiben. Vorlage: Deck-Dossier V-363 mit den Stufen Quellen, Essay, Deck, Karten, Song.

## Später im Spiel, jetzt nur als Schnittstelle vorsehen
- Eine Instanz antwortet mit LLM und Dokumenten: Genius Loci, Metacomputer oder ein ruhiger Historiker neben FrizzleBob, in der Recherchetiefe, die Georg mit Gary Webb verbindet. Antworten nur aus den hinterlegten Quellen, mit Link, sonst sagt sie, dass sie es nicht weiß.
- Meta-Quest: Karte, NPC-Wissen und eigene Quellenprüfung zusammenbringen.
- Tipps kommen über FrizzleBob, Begegnungen oder Sprechblasen, kurz und nie als Pflicht.
- Anbindung über die ChatGPT-Site oder Bring Your Own Key. Schlüssel nie im Browser des Spiels fest eingebaut. Prüfe, was die Site davon wirklich kann, und melde es.

## Erster Schritt, dann Stopp
Ein Pilot-Cluster: Überwachung, KI, Roko's Basilisk und Hypernormalisation.
1. Inventur: was es aus Substack, Videos, Notebooks und Decks dazu schon gibt.
2. Datenformat und drei fertige Einträge in allen fünf Ebenen, davon ein Solution Watch.
3. Eine Seite: Wie viel Aufwand kostet ein Deck, was fehlt, welche Anschlüsse braucht das Spiel?

**Rückgabe an WS0:** Branch, Commit, Beispiele, offene Fragen an Georg in einfachen Worten. Keine neuen Decks und keine Massenläufe vor Georgs Blick auf den Piloten.
