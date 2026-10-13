# Briefing für einen Web-Chat · Wie wird KFB ein wirklich unterhaltsames Spiel? (R1, 13.10.2026)

Du bist Game Designer für ein kleines, ambitioniertes Indie-Projekt. Ich (Georg, Creative Lead, kein Game-Entwickler) möchte mit dir klären, **was das Spiel im Kern unterhaltsam macht**, bevor weitergebaut wird. Dabei soll nichts weggeworfen werden, und am Ende soll kein halbgares Technik-Demo stehen.

## 1 · Worum es geht
**Kayfabizarro (KFB)** ist mein satirisch-surreales Kartenspiel-Universum mit vielen Decks, zum Beispiel Verschwörungs-, MED- und History-Decks, mit Deck-Covern und Figuren wie FrizzleBob, Hunky & Dory, King Kayfabian und dem Lorekeeper.

Das Spiel soll **innerhalb dieses Kartenspiel-Universums** eine immersive, entspannte Fun-Erfahrung sein:
- ein **„chill & fun cosmic roadtrip“**: Inseln schweben im All, verbunden durch eine Cartoon-Stunt-Rennstrecke mit Fahrhilfe;
- Claymation-Look, cozy Musik.

Auf den Inseln leben Figuren, mit denen man etwas erlebt.

## 2 · Was es schon gibt (bleibt, wird genutzt)
- **Spielbare Technik** (three.js im Browser, lädt in 7 s, flackerfrei):
  - Joyride-J17-Strecke als Goldstandard für Look, Banden, Kamera und Cartoon-Deformer;
  - abgenommene Fahrphysik, Tunnel, Ausfahrten, Platz mit Haltebucht;
  - Laufen (WoW-Steuerung), Ein- und Aussteigen.
- **Welt:**
  - 8 vorhandene, gestaltete Demo-Inseln (noch nicht in der Spielwelt);
  - Organ-Inseln als Platzhalter (später für MED-Decks);
  - viele Referenzbilder für Inseltypen: Prison, Dystopia, Protopia/Makerspace, City, Country, Cosmic Mesa, Coconino (Krazy Kat), Akashic Library.
- **Figuren:**
  - KayKit-Figuren (Medium/Large) in Knete-Optik;
  - ein abgenommenes Augen-Rig (Eye-Rig-Studio, noch nicht im Spiel);
  - Motion-Bibliothek mit rund 290 Clips;
  - Motion-Leitfaden mit Emotionen, Emanata und NPC-Choreografien.
- **Dialog:** ChatterBox-„Triplets“ (Subjekt → Konnektor → Umdeutung) als Sprechblasen, dazu Billboards mit Zitaten und Deck-Covern über der Strecke.
- **Kulturmechaniken** (Anlässe für Interaktion):
  - Geschenke, Tanz, Debatte, Rauferei;
  - **Brick-Fish-Wurf** (Krazy-Kat-Logik mit Red-Herring-Meta-Ebene: NPCs werfen sich gegenseitig oder dem Spieler Fische an den Kopf);
  - **Kayfabe/Kayfabulieren** (Quest von King Kayfabian);
  - **Fluff** ernten, formen, zerstören: Fluffbälle wachsen an Bäumen und werden geerntet;
  - Lesen (Akashic Library).
- **Klang:** eigene Suno-Songs (Roadtrip-Jukebox; cozy Tunes auf den Inseln), Joyride- und Racer-SFX.
- **Vision später:** Insel-Editor (God-Mode), Maker-Modus, in dem Spieler eigene Heimatinseln bauen, andere sie besuchen und gemeinsam gebaut wird.

## 3 · Was schiefgelaufen ist (bitte daraus lernen)
- Zwei Wochen lang wurde **System für System in die Breite** gebaut: Strecke, Banden, Licht, Motion, Editor. Ergebnis: gute Technik, aber es **fühlt sich noch nicht wie ein Spiel an**.
- Bisher kein klarer **Kern-Loop**: Was mache ich in den ersten 5 Minuten, und warum will ich weiterspielen?
- Viele Rückschritte bei Übergaben zwischen Werkzeugen und Sitzungen. Ein Wochenend-One-Shot anderer Leute ist kleiner, aber sofort spielbar.

## 4 · Was ich von dir will
1. **Kern-Loop in 3 Ebenen:** Moment zu Moment (Sekunden), eine Sitzung (10–20 Minuten), Fortschritt über Tage. Was ist dabei der „Fun“, für eine entspannte Zielgruppe ohne Leistungsdruck?
2. **Verbindung zum Kartenspiel:** Wie spielen Karten und Decks im Spiel eine echte Rolle? Zum Beispiel Karten schalten Inseln oder Quests frei, NPCs sind Kartenfiguren, Deck-Cover sind Insel-Eingänge. Bitte 2–3 Modelle mit Vor- und Nachteilen.
3. **Die Kulturmechaniken als Spielinhalt:** Welche 2–3 davon tragen am meisten Spaß bei wenig Aufwand? Wie sähe eine 2-Minuten-Begegnung mit einem NPC konkret aus?
4. **Erste „vertikale Scheibe“, die sich nach einem coolen Spiel anfühlt:** 2–3 Inseln, eine Strecke, eine Handvoll NPCs, aus den vorhandenen Bausteinen. Keine Schwundversion: Was muss drin sein, damit es Spaß macht? Was darf noch fehlen?
5. **Rolle der Rennstrecke:** Sie ist ein Fahrspaß- und Reise-Element, aber was ist der Anreiz zu fahren? Entdecken, Sammeln, Zeit, Musik, Billboards, Abkürzungen?
6. **Woran wir merken, dass es funktioniert:** 3–5 einfache Testfragen, die ich nach 10 Minuten Spielen beantworte.
7. **Was wir bewusst weglassen bzw. später machen sollten.**

## 5 · Rahmen
- **Bestand nutzen:** nichts neu erfinden, was es schon gibt. Look und Fahrgefühl wie J17, Claymation, entspannt statt kompetitiv, Fahrhilfe.
- **Browser-Spiel (three.js).** Gebaut wird später von Claude-Code-Sitzungen in kleinen Schritten mit Abnahme durch mich.
- **Antworte konkret und kurz**, mit Beispielen aus meinem Universum statt Genre-Allgemeinplätzen. Wo du etwas nicht weißt, frag nach, statt zu raten.

## 6 · Gewünschtes Ergebnis am Ende des Chats
Eine Seite **„KFB Game Design Kern R1“** mit:
- Kern-Loop;
- Kartenspiel-Verbindung (gewähltes Modell);
- den 2–3 Kern-Mechaniken;
- der ersten Scheibe (Inhalt + Muss/Darf-fehlen);
- Testfragen;
- Weglass-Liste.

Diese Seite gebe ich der Steuer-Sitzung als Vorgabe für die nächsten Bau-Schritte.
