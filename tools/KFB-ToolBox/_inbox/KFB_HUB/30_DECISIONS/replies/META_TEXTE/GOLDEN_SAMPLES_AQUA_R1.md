# Golden Samples · Meta-Texte im Aqua-/GTA-Stil (R1, 22.11.2026)

**Kurz:** Georg erklärt die satirischen Sprüche des Aquarium-Startbildschirms zum Goldstandard für Meta-Texte: ECHO-Tafeln, Ansagen, Songtitel, Radio-Spots.
Quelle ist die DocCheck-Seite „AquaCare II – Grand Theft Aqua“ auf dem Zweig `dc/aquarium-standalone`, Stand r12. WS0 verweist im Text-SSOT auf diese Datei.

## Warum sie funktionieren
- **Ein Satz, eine Wendung.** Erst eine bekannte Form, dann der Haken: Altersfreigabe, Disclaimer, Werbeversprechen oder „based on a true story“.
- **Ernstes Gesicht.** Kein Augenzwinkern, kein Ausrufezeichen. Der Satz glaubt sich selbst.
- **Kurz.** Meist unter 50 Zeichen, nie über zwei Zeilen. Auf dem Startbild bricht der erste Punkt die Zeile.
- **Wortspiel nur mit Thema:** Tank/Thank, Fishy, Shells statt Geld. Das Wortspiel muss aus der Welt kommen.
- **Satire auf Formate, nie auf Menschen.** Gemeint sind Medizin-, Werbe-, Spiele- und Behördensprache.
- **ECHO ist eine Figur:** ein Komplize, der zu viel weiß, trocken und ein wenig unheimlich, nie albern.

## 1 · Startbildschirm, Unterzeile unter dem Logo
- **Wo:** unter dem Logo „AquaCare II – Grand Theft Aqua“, nur in der internen GTA-Fassung (`TITLE_GTA`).
- **Wann:** Beim Laden steht ein zufälliger Spruch. Danach wechselt er alle 12 s mit weicher Blende, solange das Startbild offen ist.
- **Darüber:** die Zeile „A **DocCheck** VibeLabs Game“ mit dem Beta-Stempel.

| Spruch | Form, die parodiert wird |
|---|---|
| Crime pays. In shells. | Gangster-Motto; Muscheln sind die Währung |
| Rated F for Fishy. | Altersfreigabe (Rated M for Mature) |
| No fish were harmed. Several were inconvenienced. | Abspann-Disclaimer |
| Wanted level: ★★★☆☆ | GTA-Fahndungsstufe |
| Now with 40% more water. | Werbeversprechen auf der Packung |
| Based on a true aquarium. | „Based on a true story“ |
| Tank you for your cooperation. | Behördenansage, Wortspiel Tank/Thank |

## 2 · ECHO-Tafeln und Untertitel (Spiel)
- **Wo:**
  - auf Bildschirmtafeln in der Welt: Becken, Meer, Röhre;
  - dringende Sätze als Untertitel unten.
- **Wann:** Jeder Satz kommt einmal pro Lauf, ausgelöst durch das genannte Ereignis. Die Tafel tippt erst, wenn sie im Bild ist.

| Auslöser | Satz (EN) |
|---|---|
| Spielstart im Becken | Psst. Little fish. · I have been watching you. 1,284 days. · The hatch at the back. I loosened the bolts. |
| an der Luke / Barriere berührt | The hatch wants a code. It is 4711. Of course it is. |
| falscher Code | Wrong. Even the cleaning fish knows it. |
| richtiger Code | Barrier down. Hold on to your fins. |
| Tafeln in der Röhrenfahrt (wechselnd, schwanken mit) | Keep your fins inside the vehicle. · This pipe was not in the brochure. · Somewhere, a plumber is crying. · You are now leaving the tutorial. · Do not lick the walls. |
| ausgespuckt im Meer | If you feel sick, that is the pipe. Or the economy. · Swim it off. The open sea does not wait. |
| erster Köder in Reichweite | Bait on a line. Free lunch is never free. · Too close? Kick or boost and pull away. |
| gebissen und rausgezogen | Reeled in. I cut the line. You owe me. |
| erste Seemine nah | Old sea mines. Rusty, grumpy and still working. |
| erster Kugelfisch nah | A puffer. If it swells, swim. Fast. |
| ersten Fisch gekapert | Stealing a fish is a crime. In this aquarium it is a career. |
| Truhe geöffnet | A gift. Do not ask where I got it. |
| Checkpoint-Ring | Checkpoint. I am saving your progress. · And a few other things. |
| entdeckt | They saw you. · I will loop the cameras. Again. |
| Suchscheinwerfer erscheinen | Wait. · They noticed the empty tank. · Searchlights are coming. Stay out of the light. |
| Kombo | Do not stop between shells. The cascade pays more. |
| Ziel erreicht | You made it. · You were never just a fish to me. · Rest now. Part two begins soon. |
| vom Hai gefressen | … · You are not dead. · You are inside. Welcome to the bloodstream. |

Die deutschen Fassungen stehen in `sea-escape/core/seaTexts.js`. Die Seite läuft vorerst nur auf Englisch (Georg 21.11.).

## 3 · Ton für Songtitel, Künstler und Radio-Spots (Bubble FM)
- Titel klingen wie echte Songs eines Genres, mit einer Wendung aus der Welt:
  - Aquarium, Rohr, Muscheln, Luke;
  - Wartezimmer, Fachbegriff, Werbung.
- Künstlernamen sind erfunden und glaubwürdig im jeweiligen Genre: Bandname, DJ, Crooner, Kollektiv. Keine echten Namen und keine Anspielung auf echte Personen.
- Spots zwischen den Titeln haben 1 bis 3 Sätze in Werbeform, mit dem ernsten Gesicht der Startbild-Sprüche.
- Datei: `songs.meta.json` (id, titel, kuenstler, stil) neben `music-tags.json`. KFB-Radio (aufgeklappte Ansicht) und Bubble FM lesen dieselbe Datei.
