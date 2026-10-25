# KnuckleBob als Fahrzeug-Seele · Pilot R1 · WS0 · 25.10.2026 (V-810)

**Tier 0**
1. KnuckleBob ist die Seele jedes beseelten Fahrzeugs. Er fährt als alter Stunt- und Rennhase mit und kommentiert selten, trocken und schwarzhumorig auf Englisch, im Kayfabe-Ton. Er spricht den Spieler mit „kid“ an und verwendet keine Auto-Pseudosprache (kein „vroom“). Unbeseelte Fahrzeuge wie die 2D-Popup-Autos haben keine Seele: kein Kommentar und keine Racer-Funktion.
2. Der Pool ist groß, damit sich nichts wiederholt: Ein Spruch kommt erst wieder, wenn alle seines Anlasses gelaufen sind. Höchstens ein Spruch pro Minute, bewusste Pausen, ab und zu eine Überraschung (Monkey-Island-Logik).
3. Gezeigt wird eine Vignette mit HeyGen-Clip von 2–4 s, der Rahmen in der Grundfarbe des aktiven Fahrzeugs. Sie lässt sich in den Einstellungen abschalten. Vor dem Bau kommt ein Bildpaket für Rahmen und Lage (V-740).

Löst für Fahrzeuge die Fantasiesprache aus POC 3 (b206, V-712) ab. Die Rufe (**Bingo!** usw.) bleiben für Tratsch und Karten.

## Anlässe im Pilot (6 × 8 Sprüche)
Jeder Anlass hat eine Sperrzeit. Es gibt keine Kommentare zu Bodenwellen, Staub oder normalen Kurven.

| Anlass | Auslöser im Spiel |
|---|---|
| ruf | Auto gerufen bzw. eingestiegen (höchstens einmal in 5 min) |
| sprung | Sprung mit harter Landung |
| rolle | Fassrolle sauber gelandet |
| crash | harter Wand- oder Bandentreffer |
| drift | langer Drift |
| stille | 60–90 s ruhige Fahrt ohne Ereignis |

### ruf
1. Keep the revs low, kid. My heart's original equipment.
2. Back in the saddle. Try not to kill us.
3. You called? I was napping in a ditch.
4. Keys are in. Brains optional.
5. Ring the bell, kid. Old man's back from retirement.
6. Buckle up. My insurance ran out in fifty-eight.
7. Fresh blood. The last driver still owes me a fender.
8. Same rules as always, kid. There are none.

### sprung
1. Whoa, kid! Take it easy!
2. That landing rearranged my fillings.
3. Top rope, kid! Nobody tries that sober.
4. Hit the ground like a stunt double nobody paid.
5. My suspension just filed a complaint.
6. Air time! The crowd goes mild.
7. Ten points for height. Minus nine for the landing.
8. Next time warn me. I'll hold my breath.

### rolle
1. Yeah! This old beast was built for maximum Kayfabe speed!
2. Barrel roll! Even my hubcaps got dizzy.
3. Did we just do that on purpose?
4. Show-off. I love it.
5. I rolled a Packard like that in fifty-three. Once.
6. That's how we sold it in the old days. Spin, smile, hope.
7. Land it clean and nobody asks questions.
8. Bump of the year, kid. Bump of the year.

### crash
1. That's a ten-count. I'm getting up at nine.
2. Spit out the chrome, kid. Keep driving.
3. That wall is a heel. I can tell.
4. Check the trunk, kid. Something back there went quiet.
5. We meant to do that. Say it with me.
6. Sell it, kid! Limp a little!
7. Note to self. Walls don't move.
8. And that's why they call me Old Dents.

### drift
1. Sideways is a lifestyle, kid.
2. Look at us, ice skating on dirt.
3. Steer into it. Or don't. I'm just the passenger.
4. Work the corner, kid. Make 'em believe it.
5. Hold it, hold it... gorgeous.
6. Smoke 'em if you got 'em.
7. Fangio drifted like this. In a necktie.
8. Grandpa approves.

### stille
1. Long empty road. Promoter must've cut the budget.
2. This whole world is clay. Don't think about it.
3. Cards on the ground aren't litter, kid. They're lore.
4. Hum along if you want. I won't tell the critics.
5. Funny. I swear we passed that mushroom twice.
6. Wake me when something explodes.
7. Somewhere out there a rabbit is taking notes.
8. Back in my day the scenery stayed where you left it.

Stimm-Critic R1: FAIL → 13 Zeilen ersetzt (kein Echo der gesetzten Zeilen, Wrestling-Jargon in jedem Anlass, keine doppelten Pointen, höchstens 10 Wörter).

## Produktion in HeyGen (Georg, Web-Editor)
- **Avatar:** dein Driver-Avatar (KnuckleBob). **Sprache:** Englisch. **Stimme:** älter, rau, trocken, nicht laut. **Voice Director:** Casual, Tempo normal.
- **Hintergrund:** einfarbig Grün, damit die Vignette ihn ausschneiden kann. **Format:** quadratisch oder 16:9, Kopf mittig.
- **Skript:** jeder Spruch ein Absatz, dahinter eine Pause von 1 s (Pausen-Knopf), je Anlass eine Datei. WS0 schneidet die Clips an den Pausen, pegelt sie auf −16 LUFS und legt sie ab.
- Ablage wie bisher als Link an WS0. Nach dem Pilot folgen Hinweise auf POIs, Reichweite und Karten, Onboarding und die übrigen Avatare.

## Einbau (WS0, nach dem Pilot)
Ereignisse kommen aus M2EVENTS bzw. kfbAudio. Musik und Motor treten unter der Stimme zurück (voiceHold). Ein Clip spielt nicht, wenn gerade Dialog oder Kampf läuft. Schalter: Einstellungen → „Fahrzeug-Seele“ an oder aus.
