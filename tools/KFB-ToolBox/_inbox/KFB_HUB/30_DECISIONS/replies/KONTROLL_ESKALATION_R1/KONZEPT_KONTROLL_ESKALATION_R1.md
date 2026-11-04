# Kontroll-Eskalation · Konzept R1 · WS-Flight → WS0 · 04.11.2026

Auftrag: Georg 04.11. via WS0. Der Teil zu UFO und Landung gehört dazu. Das hier ist nur Konzept; gebaut wird nach Georgs Ja.
Baut auf V-1237 (MiB-Druck, „Aufmerksamkeit je Region“) und SPEC_NPC_PATROL_R1 (Begegnungstabellen) auf.

**Tier 0:** Der Spieler macht sich auffällig. Daraus wächst die Wahrscheinlichkeit, dass die nächste Stufe der Kontrollinstanz auftaucht: Slops → Toy Soldiers → Men in Black → Hunky und Dory. Nichts davon ist fest verdrahtet. Es zählt die Beziehung zwischen Fraktionen, darum dreht sich alles um, wenn man als MiB spielt.

## 1 · Fraktion und Beziehung statt „Spieler gegen“
- **Kontrollinstanz:** Slops, Toy Soldiers, Men in Black, Hunky und Dory. **Widerstand:** der Spieler als Fluffer, befreite Bewohner, Fluff-Kugeln.
- Jede Figur hat eine Fraktion. Zwischen zwei Fraktionen gibt es eine Beziehung: Freund, neutral, misstrauisch oder Feind. Die Spielfigur erbt die Fraktion ihrer Rolle.
- Gezählt wird immer **die Auffälligkeit eines Akteurs bei einer Fraktion**. Als Fluffer füllt der Spieler die Zahl der Kontrollinstanz; als MiB füllen Rebellen und befreite Bewohner die Zahl des Widerstands. Dieselbe Leiter läuft dann für die Gegenseite (Fluff-Rebellen, Bewohner-Mob, Kayfabrick-Bots, „Fluff-Ufo“). Ein Modul, zwei Richtungen.

## 2 · Auffälligkeits-Zähler A
- **Je Region** (Zelle des Verteilers) plus eine **Spur**, die dem Spieler folgt. Die Spur ist ein Drittel des regionalen Werts, damit Weglaufen hilft, aber nicht alles löscht.
- **Plus (Beispiele):** Slop abgeschossen: trash 1, common 2, elite 4, Boss 8. Haus mit Karte zerstört: 3. Schuss in der Nähe von Toy Soldiers: 2. Toy Soldier getroffen: 4, ausgeschaltet: 6. Im Verhör **Bongo.**: 3, **Blödsinn!**: 6. MiB entkommen: 10.
- **Abkühlung:** Ohne neue Tat halbiert sich A in 120 s, unbeobachtet (kein Zeuge in 30 m) in 60 s. Beim Verlassen der Region bleibt dort ein Rest; die Figuren merken sich Ärger in der Spielchronik (worldSave-Quittungen gibt es schon).
- **Kooperation senkt A:** **Bingo!** gegenüber Toy Soldiers −5. Ein Verhör, das mit **Humbug?!** endet (Blitzdingsen), setzt A der Region auf ein Viertel. Dafür ist ein Teil der frisch gelernten Karten des Spielers wieder vergessen (V-530).

## 3 · Stufen (Kontroll-Stufe K)
| K | ab A | Wer | Was passiert | Stimme und Dialog |
|---|---|---|---|---|
| K0 Ruhe | 0 | Slops (meist trash) | bummeln, plaudern | Slop-Sprache in Ruhe |
| K1 Unruhe | 8 | Slops, mehr common | Gruppen schneller aufmerksam, Schreck ansteckend | Blubber-Rufe lauter und dichter je Stufe und Treffer (slopVoice: Erregung) |
| K2 Nachschub | 20 | Slops aus zerstörten Häusern, einzelne GPU-Fluff-Kugeln, je Familie ein Boss | springen aus Fenster und Tür, landen, laufen los (Bewegungs-Bibliothek: Hüpfen, Landen, Laufen) | goo-dunkel, keine Kartenfarben |
| K3 Streife | 35 | 1–3 Toy Soldiers | „sehen nach dem Rechten“, Streife zur letzten Tat | Chatterbox-Triplets; der Spieler antwortet mit den Rufen |
| K4 Verhör | 55, oder Toy Soldiers ausgeschaltet bzw. Verdacht gemeldet | Men in Black (vorhandener Turm) | stellen den Spieler, kämpfen kaum, verhören | Verhör-Triplets, Rufe des Spielers (§4) |
| K5 Abholung | 80, oder MiB gescheitert | Hunky und Dory mit UFO | landen, steigen aus, scannen; Angriff oder Rückzug (§5) | Gesten, Chatterbox der Aliens, kaum Worte |

**Wahrscheinlichkeit statt Schwelle (WFC-artig):** Alle 10 s und bei jeder Tat wird gewürfelt. Jede Stufe hat ein Gewicht, das mit A weich ansteigt (s-förmig um ihre Schwelle). Danach wirken Nachbarregeln wie beim WFC:
- **Nur eine Stufe weiter:** Es kommt höchstens die nächste Stufe über der höchsten, die in dieser Region schon da war; keine wird übersprungen.
- **Abklingzeit je Stufe:** gleiche Stufe frühestens nach 60 s (K3), 180 s (K4) bzw. 300 s (K5) wieder.
- **Ein Weltereignis zugleich:** gilt über das vorhandene worldEventGate, wie heute bei MiB und UFO.
- **Ort zählt:** Nachschub nur, wo Häuser zerstört sind; Streife nur auf Wegen und Straßen; die Landung nur auf freier, flacher Fläche.

So bleibt es Spiel und Zufall: Wer leise sammelt, sieht fast nur Slops. Wer alles zerlegt, bekommt Besuch, aber nicht nach Uhr.

## 4 · Verhör der Men in Black (K4)
Ein Verhör ist ein Gespräch im Gelände: Die Agenten stellen den Spieler, der Turm steht dahinter, und jede Runde ist ein Triplet. Jeder Zug ist eine benannte Technik:
- Guter Bulle, böser Bulle;
- falsche Wahl („Waren Sie es allein oder mit dem Bewohner?“);
- Vorannahme („Seit wann sammeln Sie Karten?“);
- Spiegeln und Pacing, dann Führen;
- Fuß in der Tür;
- Schweigen;
- Verharmlosen („Jeder zerlegt mal ein Haus“).

Die Zeilen kommen aus dem Triplet-SSOT der MiB-Decks, die Rufe sind die vorhandenen **Bingo!**, **Boggle...?**, **Bongo.** und **Blödsinn!**:
- **Bingo!** gibt nach. Drei Bingo führen zum Geständnis, die Agenten blitzdingsen (**Humbug?!**): A sinkt, ein paar Karten sind weg.
- **Boggle...?** fragt nach. Der Agent wechselt die Technik; das kostet ihn Geduld.
- **Bongo.** lehnt weich ab: A +3. Nach drei Bongo sind die MiB „gescheitert“, und K5 wird wahrscheinlich.
- **Blödsinn!** verlässt das Gespräch: A +6. Die MiB setzen den vorhandenen Strahl ein (heute gegen Bewohner, dann gegen den Spieler).

## 5 · Hunky und Dory: Landen, Aussteigen, Interaktion (K5, neben dem Traktorstrahl)
1. **Anflug** auf der vorhandenen Bahn (ARRIVE, HOVER).
2. **Landen:** vier Landefüße an den vorhandenen Ankern KFB_Foot_0..3. Aufsetzen mit kurzem Squash, Staub und einer Geländewelle (terrainRipple von WS-Design).
3. **Luke:** Die Kuppel ist die Öffnung. Sie fährt mit dem vorhandenen Clip kfb_dome_open_a auf, eine eigene Luke braucht es nicht. Bis dahin ist die Kuppel ein irisierender, milchiger Glas-Shader: Hunky und Dory sieht man erst beim Öffnen. Ein Parameter Klarheit von 0 bis 1 macht sie später für Szenen im UFO durchsichtig.
4. **Aussteigen:** Beide stehen an den Ankern KFB_Stand_Hunky und KFB_Stand_Dory. Sie hüpfen über den Rand nach außen und landen vor dem UFO. Der Sprung kommt aus vorhandenen Clips bzw. der Bewegungs-Bibliothek: Absprung, Flug, Landung, nichts Gebasteltes.
5. **Interaktion:** Sie gehen auf den Spieler zu und scannen ihn mit einem kurzen Strahl aus der Hand. Je nach Beziehung folgt Angriff oder Rückzug:
   - **Angriff** (Feind, A hoch): Traktorstrahl auf den Spieler. Er wird leicht angehoben, verliert Fluff-Kugeln und kann sich freischießen.
   - **Rückzug** (A gesunken, der Spieler kooperiert, oder Treffer an der Kuppel): beide hüpfen zurück.
6. **Wieder-Einsteigen:** Rücksprung an die Anker, die Kuppel schließt (kfb_dome_close_a), Abflug (DEPART).

Gespielt als MiB oder Alien dreht sich das um: Dann landet das UFO, um Bewohner abzuholen, und der Spieler steht auf der Seite, die scannt.

## 6 · Was trägt, was fehlt
| Baustein | da | fehlt |
|---|---|---|
| Slops (mobs2d, Roster, Verteiler-Plätze, Goo-Tod, Stimme) | Stufen und Treffer im Roster, Schreck, Aufregung | Stufe K als Eingang für die Stimm-Erregung; Nachschub aus Häusern (Spawnpunkt an zerstörten Gebäuden, Sprung aus Fenster und Tür) |
| Toy Soldiers (groupLife, groupPatrol, Begegnungstabelle m1-east) | Streife, Aufmerksamkeit, Wut, Leine | Auftauchen auf Abruf (1–3 an der letzten Tat), Dialog mit Rufen |
| Chatterbox, choiceLayer, wissenTalk | vier Rufe, eigene Worte, Gespräch mit Taste E | Gespräch auf Abruf durch eine Figur, Verhör-Züge als Triplet-Pool |
| MiB (mibEvent, mibCast, Turm) | Landung, Tür, Agenten, Strahl, Humbug | Ziel Spieler statt Bewohner, Verhör statt Abholung |
| UFO (ufoEvent, Vertrag UFO_HD_R1) | Bahn, Traktorstrahl, Figuren an Ankern, Kuppel-Clips, eigenes Kuppelmaterial (kfb_glass, kfb_glass_rim) | Landen, Kuppel-Shader mit Klarheit, Aus- und Einsteigen, Scan, Angriff auf den Spieler |
| Kampf | Treffer auf Figuren (orchard), Zähler | Schaden am Spieler gibt es nicht: Angriffe als Fluff-Verlust statt Lebenspunkte |
| Zähler und Fraktion | worldSave-Quittungen, worldEventGate | Auffälligkeit je Region und Spur, Fraktionen und Beziehungen, Würfel mit Nachbarregeln |

**Abstimmung mit WSB:** Für die Kuppel muss nichts getrennt werden. Sie ist schon ein eigenes Material im GLB; wichtig ist nur, dass meshopt die Materialnamen kfb_glass und kfb_glass_rim und die beiden Kuppel-Clips behält.

## 7 · Roster-Felder für den Verteiler
- **Stufe Boss (neu):** `stufe: "boss"`, `treffer: 4`, je Familie höchstens einer. Er kommt nur ab K2 als Anführer des Nachschubs und nimmt dafür einen Anführer-Satz (muetze/koenig) der Familie.
- **Feld `eskalation`:** `{ "punkte": <int>, "ruft": null | "streife" | "verhoer" | "abholung" }`
  - `punkte`: was ein Abschuss auf A legt. Vorgabe: trash 1, common 2, elite 4, boss 8.
  - `ruft`: Familien, die eine Stufe schneller rufen; ihr Gewicht für diese Stufe verdoppelt sich. Vorschlag:
    - Polizei- und Wach-Familien → `"streife"`;
    - cia, deepstate, sondertrupp → `"verhoer"`;
    - Alien- und Sci-Fi-Familien → `"abholung"`;
    - alle anderen `null`.

## 8 · Reihenfolge, wenn Georg Ja sagt
1. Zähler, Fraktion und Würfel als ein kleines Modul (ohne Bild), dazu Status und Prüfmodus.
2. K1–K2 mit Slops, weil Roster, Stimme und Bewegung schon da sind.
3. K3 Toy Soldiers auf Abruf mit Rufen.
4. K4 Verhör: MiB-Ziel Spieler, Verhör-Pool über das Triplet-SSOT.
5. K5 UFO: Kuppel-Shader, Landen, Aus- und Einsteigen; der Traktorstrahl bleibt die zweite Interaktion.
