# BNWN Reactive News R1 · Ereignisse, Auffälligkeit, Himmelsaugen, HeyGen-Skripte (WS0, 06.11.2026)

Grundlage: `BNWN_SOURCE_R1.md` (Georgs Substack-Ton): Pre-Kaskade, Dreierreihe mit Kipp-Glied, Software-Sprache für Gesellschaft, Fürsorge als Drohung, ™ als Satzzeichen, Behördenprosa, Rückverweisung („go back to scrolling“). Die Sprecher glauben, was sie sagen; die Satire steckt im Kontrast, nie im Kommentar. Spielertexte englisch.

Der Spieler ist FrizzleBob. Für BNWN ist er der Störer, also „the rabbit“, „the subject“, „Entity FB“, nie „you“ mit Geschlecht.

## 1 · Auffälligkeit (eine Zahl, zwei Herren)

Eine Zahl `auffaelligkeit` von 0 bis 100. Ereignisse geben Punkte, die Zahl zerfällt langsam (−1 pro 20 s ohne Vorfall). Daraus folgen sechs Stufen. Sie bestimmen den Ton der News, das Verhalten der Himmelsaugen und später die Wanted-Liste (V-1496). Inhaltlich ist es das Auge von Men in Black und Hunky & Dory, gesendet über ihr Sprachrohr BNWN mit Mizzy (Omega) als Moderatorin. Mizzys transhumane Hybrid-Natur wird nie ausgesprochen, darf aber im Glitch durchscheinen.

| Stufe | Punkte | Name (on air) | News | Himmelsaugen |
|---|---|---|---|---|
| 0 | 0–9 | Citizen in Good Standing | Sponsor, Spielshow, Wetter | wenige, weiße Augen, schauen umher (Sterne) |
| 1 | 10–24 | Mildly Noticed | erste Reaktionen, freundlich | einzelne blicken kurz zum Spieler |
| 2 | 25–44 | Flagged for Wellbeing | Reaktionen häufiger, Verkehrsfunk | mehrere ordnen sich, folgen dem Spieler |
| 3 | 45–64 | Person of Interest | Sondermeldungen, Dr. Luhan McCloud | Augen werden dunkel, rote Pupille, scannen |
| 4 | 65–84 | Level 4 Symbolic Disruption Entity | Sendeunterbrechung, MiB-Hinweis | schwarze Augen mit rotem Glühen, Ring über dem Spieler |
| 5 | 85–100 | Personal Attention of Hunky & Dory | Systemansagen, Glitch, „Broadcast terminated“ | alle Augen rot, Blick fest, Lider zittern |

## 2 · Ereignis-Katalog (Auslöser → Punkte → Chance auf Kommentar)

„Chance“ ist die Wahrscheinlichkeit, dass ein Clip kommt, wenn der Sendeplan Platz hat. Abklingzeit gilt je Ereignis. Alle Werte als Daten in `radio-plan.r1.json`, Georg dreht.

| ID | Ereignis | Auslöser (Bus) | Punkte | Chance | Abklingzeit | Format |
|---|---|---|---|---|---|---|
| E01 | Kartenhaus zerstört | `weapon.explode` an Kartenhaus | +6 | 0,5 | 90 s | reaction |
| E02 | Zerstörungsserie | 3 Kartenhäuser in 60 s | +12 | 0,9 | 180 s | reaction (laut) |
| E03 | Karte befreit (Bresche) | `zensur.bresche` | +8 | 0,7 | 120 s | reaction |
| E04 | Kartenhamster | 5 Karten in 20 s | +5 | 0,6 | 120 s | reaction |
| E05 | Slop erledigt | `slops.kill` | +1 | 0,1 | 60 s | reaction |
| E06 | Slop-Serie | 5 Slops in 30 s | +6 | 0,6 | 120 s | reaction |
| E07 | Wanted-Boss erledigt | `slops.kill` mit Stufe boss | +15 | 1,0 | 300 s | special |
| E08 | Zu schnell | Wagen > 140 km/h für 6 s | +3 | 0,5 | 150 s | traffic |
| E09 | Geisterfahrer | Wagen fährt auf Straße gegen die Laufrichtung (oder quer durch Kartenzone) 5 s | +4 | 0,7 | 180 s | traffic |
| E10 | Flugschau | Wagen > 3 s in der Luft | +2 | 0,4 | 120 s | traffic |
| E11 | Überschlag/Crash | Wagen kippt bzw. harter Aufprall | +2 | 0,5 | 120 s | traffic |
| E12 | Unangemeldeter Luftraum | Jetpack über Höhe X oder > 20 s Flug | +3 | 0,6 | 150 s | traffic |
| E13 | Portal durchquert | `portal.cross` | +1 | 0,5 | 120 s | reaction (Senderwechsel) |
| E14 | Neues Viertel betreten | erstes Mal Kartenzone | 0 | 0,4 | 300 s | weather/district |
| E15 | Untätig | 90 s keine Eingabe | −2 | 0,5 | 600 s | system |
| E16 | Song weggeklickt | 3× „Next“ in 60 s | +1 | 0,6 | 300 s | system |
| E17 | Versuch „BNWN off“ | Klick auf gesperrten Knopf | +2 | 1,0 | 60 s | system |
| E18 | Himmel angestarrt | Kamera > 5 s auf ein Himmelsauge | +2 | 0,5 | 180 s | system |
| E19 | Truhe geöffnet | `truhe.auf` | 0 | 0,15 | 300 s | sponsor-tie-in |
| E20 | Fassade lange angesehen | > 8 s Blick auf HyperNorm-Fassade | −1 | 0,3 | 300 s | system |
| E21 | Stufenwechsel hoch | Auffälligkeit steigt in neue Stufe | – | 1,0 | – | bulletin (Stufe) |
| E22 | Stufenwechsel runter | Auffälligkeit fällt in Stufe 0 | – | 0,7 | – | bulletin (Entwarnung) |

## 3 · Himmelsaugen (Plan, Modul nach MODULE.md)
- **Bausteine:** vorhandenes EyeRig v6 mit E2-Lidern (Claymation-Lider, V-1045/1046). Zwei Sorten: weiß mit schwarzer Pupille, schwarz mit roter Pupille.
- **Lage:** in der Himmelskuppel zwischen Sternen und Planeten, wenige bis viele je Stufe.
  - Ruhe: blinzeln, schauen umher, wirken wie Sterne.
  - Ab Stufe 2: ordnen sich zu Gruppen und folgen dem Spieler (Eye-Tracking).
  - Ab Stufe 3: scannen wie das Auge auf dem MiB-Turm.
  - Ereignis (E01–E03): ein Auge wird schwarz, die Pupille glüht rot, dann zurück.
- **Kosten:** instanziert, ein Draw; Lid-Animation per Shader-Parameter.
- **Daten:** `himmelsaugen.r1.json` (Anzahl je Stufe, Sorten, Verhalten, Reaktionszeiten).
- Außerhalb des Prison-Break-Openers überall nutzbar. Der Opener darf dieselbe Ebene verwenden.

## 4 · HeyGen-Skripte

Sprecher: **OMEGA** = Mizzy (Narrative Nora, Standard-Avatar). **ALPHA** nur, wo ein zweiter Avatar da ist, sonst spricht OMEGA beide Zeilen. Längen grob bei ruhigem Tempo. Jede Zeile ist einzeln schneidbar. Reaktionen brauchen 3 Varianten je Ereignis, damit nichts wiederholt klingt.

### 4.1 Reaktionen (5–12 s)

**E01 Kartenhaus zerstört**
- R-E01-a · OMEGA: "Breaking news. A residential card house has been gently decommissioned. Residents were pre-relocated for their convenience. The rubble is now a protected heritage site."
- R-E01-b · OMEGA: "Good news, Normie NPCs. One more building has been freed from the burden of standing. Urban planning has never been this efficient."
- R-E01-c · OMEGA: "We are receiving reports of an unauthorized renovation. Please remain calm. Calm has been pre-installed in your area."

**E02 Zerstörungsserie**
- R-E02-a · OMEGA: "Update. Three card houses in under a minute. Authorities confirm this is not a pattern. Patterns are reserved for licensed analysts."
- R-E02-b · OMEGA: "This is not demolition, it is a neighborhood upgrade. Version 2.0 has no walls, no roof, and no complaints. Exactly as planned."
- R-E02-c · ALPHA: "Let me be clear. The structures were outdated. The rabbit simply accelerated the schedule. We thank the rabbit. We are tracking the rabbit."

**E03 Karte befreit**
- R-E03-a · OMEGA: "A censored card has escaped containment. Do not read it. Reading is a symptom. Symptoms will be monitored."
- R-E03-b · OMEGA: "Reminder. Unredacted content can cause clarity, dizziness, and independent thought. If you see a free card, look at the sky instead. The sky is looking at you."
- R-E03-c · ALPHA: "The card was pre-bunked. The text on it is false. The truth on it is also false. Please go back to scrolling."

**E04 Kartenhamster**
- R-E04-a · OMEGA: "Attention. One subject is collecting cards at an unsustainable rate. Hoarding meaning is a luxury. Please share your meaning with the Ministry."
- R-E04-b · OMEGA: "Five cards in twenty seconds. Your curiosity score has been flagged. Curiosity is fine. Within limits. The limits are secret."
- R-E04-c · OMEGA: "Collecting is consumption. Consumption is good. Understanding what you collect? Let us not get carried away."

**E06 Slop-Serie**
- R-E06-a · OMEGA: "Several residents have been abruptly uninstalled. The Bureau of Population Comfort confirms this was a scheduled cleanup. Thank you for your participation."
- R-E06-b · ALPHA: "Those were not citizens. Those were content. Content is replaceable. New content is already loading."
- R-E06-c · OMEGA: "The ink will dry. The streets will shine. The statistics will look fantastic."

**E07 Wanted-Boss erledigt** (Sondermeldung, 15–20 s)
- R-E07-a · OMEGA: "Special report. A wanted district figure has been removed from circulation. The Ministry is delighted. The Ministry is also furious. The Ministry has issued two press releases, and they contradict each other. Both are correct."
- R-E07-b · ALPHA: "We want to thank the rabbit for solving our problem. We also want to remind the rabbit that solving problems without a license is the biggest problem of all. Please hold. Your gratitude has been converted into a fine."

**E13 Portal durchquert** (nach dem Senderwechsel-Rauschen)
- R-E13-a · OMEGA: "You are now leaving the approved zone. You are now entering another approved zone. All zones are approved. Movement is an illusion we sponsor."
- R-E13-b · OMEGA: "Welcome to your new region. Same news. Different sky. Please update your opinions to the local settings."
- R-E13-c · OMEGA: "Signal re-established. Your thoughts have been re-synced. Some of them were lost in transit. They were not important."

### 4.2 Verkehrsfunk „Brave New Traffic“ (8–20 s)

**E08 Zu schnell**
- T-E08-a · OMEGA: "Brave New Traffic. A vehicle is exceeding the recommended speed of compliance. Speed is freedom. Freedom is regulated. Please slow down to a pre-approved velocity."
- T-E08-b · OMEGA: "Speed cameras report a blur. Experts confirm the blur is shaped like a rabbit. The blur has been fined. The blur has not paid."
- T-E08-c · OMEGA: "Remember, the destination is not important. Arriving on time is not important. What is important is that we know where you are. We do."

**E09 Geisterfahrer**
- T-E09-a · OMEGA: "Traffic alert. A ghost driver is reported, driving against the narrative. Please do not engage. Ghost drivers believe everyone else is going the wrong way. They are mistaken. Probably."
- T-E09-b · ALPHA: "There is only one direction. It is forward. It is ours. Any vehicle facing the other way is experiencing a temporary misunderstanding."
- T-E09-c · OMEGA: "We advise all motorists to stay in their lane. Lanes are a gift. Lanes are love. Lanes are mandatory."

**E10 Flugschau / E12 Unangemeldeter Luftraum**
- T-E10-a · OMEGA: "Unauthorized airtime detected. Gravity is a public service. Please do not leave it without permission."
- T-E12-a · OMEGA: "Air traffic control reports an unregistered flying object. It has ears. It has no flight plan. It has, apparently, no shame."
- T-E12-b · OMEGA: "Reminder. The sky is a monitored zone. Please do not fly closer to the eyes. The eyes find it uncomfortable. The eyes are not built for discomfort."

**E11 Crash**
- T-E11-a · OMEGA: "A minor accident has occurred. No one was hurt, except the vehicle's dignity. Insurance has been pre-denied."
- T-E11-b · OMEGA: "Rollover reported. Please remember: upside down is still a valid perspective. It is just not one we support."

**Verkehrsfunk lang** (35–45 s, für Stufe ab 2)
- T-LONG-1 · OMEGA: "And now, Brave New Traffic, brought to you by Smart Dust NanoSpray™. Roads are clear in all compliant districts. Expect heavy congestion of thoughts near the card quarter, where an unregistered rabbit continues to cause what experts call 'unscheduled events'. Speed limits have been lowered to the speed of agreement. Detours are in place around free information. If you see a vehicle driving against the narrative, do not honk. Honking is a form of opinion. Just look up. Someone is already looking down. Drive safe. Drive tracked. Drive happy."

### 4.3 Stufen-Bulletins (E21/E22, 10–25 s)
- B-S1 · OMEGA: "Good evening. A subject in your area is now Mildly Noticed. This is not a punishment. It is a compliment with consequences."
- B-S2 · OMEGA: "Wellbeing alert. One rabbit has been Flagged for Wellbeing. A care package is on its way. The care package is a drone. The drone cares very much."
- B-S3 · OMEGA: "Special announcement. The subject known as FB is now a Person of Interest. Our senior expert Dr. Luhan McCloud advises not to categorize him as satire. Doing so may cause recursive invalidation of your conceptual framework."
- B-S4 · OMEGA: "Attention. The Meta-Cognitive Risk Observatory now lists the rabbit as a Level 4 Symbolic Disruption Entity. Agents in black suits are on their way. They are friendly. They have sunglasses. That is all we are allowed to say."
- B-S5 · OMEGA (Glitch erlaubt): "This broadcast is now under the personal attention of Hunky and Dory. Your cognitive credit score has been deducted. Your ability to question authority has been revoked. You will now return to pre-approved opinions. You will now... re... return... to..."
- B-S0 · OMEGA (Entwarnung): "Good news. The situation has been fully normalized. Nothing happened. Nothing will happen. Please forget the previous broadcasts. Forgetting is free."

### 4.4 System und Meta (5–12 s)
- S-E15-a (untätig) · OMEGA: "We notice you are not doing anything. Excellent. This is the ideal citizen behavior. Please continue. Forever."
- S-E16-a (Song weggeklickt) · OMEGA: "Content dissatisfaction detected. Your preferences have been noted, analyzed, and politely ignored. The next song is exactly what you need."
- S-E17-a (BNWN off versucht) · OMEGA: "We see you reaching for the off switch. How sweet. Ad-free listening is a premium experience. Premium is earned. You have not earned it."
- S-E17-b · OMEGA: "Turning off the news does not turn off the world. It only turns off your understanding of it. You are welcome."
- S-E17-c · ALPHA: "The button is decorative. All buttons are decorative. We find it calms people down."
- S-E18-a (Himmel angestarrt) · OMEGA: "Please do not stare at the sky. The sky is staring back, and it is much better at it."
- S-E20-a (Fassade angesehen) · OMEGA: "You have been looking at the screens for a while. Wonderful. Your attention has been converted into shareholder value. Keep watching."
- S-E14-a (neues Viertel) · OMEGA: "Welcome to a new district. Local forecast: clouds of compliance, with a cold front of fear and a light drizzle of shame. By morning, submission will fall like rain."

### 4.5 Längere Segmente zum Vorproduzieren (30–60 s)
- **L-01 „The Eyes Are Here to Help“** (Wetter, Himmelsaugen) · OMEGA: "And now, the weather. Clear skies tonight, with scattered eyes across the northern horizon. The eyes are a free public service, installed for your safety. They blink when you blink. They follow when you wander. If one of them turns red, that is not a warning. It is a gentle reminder that red is the color of love. And of alarms. Mostly love. Tomorrow: more eyes, and a high chance of being seen. Stay compliant, stay connected, stay visible."
- **L-02 „Card Quarter Special“** (nach E02/E03) · OMEGA: "Tonight's segment: the card quarter. Residents report flying cards, falling walls, and words on facades that nobody approved. Experts confirm these words are meaningless. Experts also confirm the words must be removed immediately, because meaningless words are extremely dangerous. If you find a card, do not read it, do not keep it, and do not tell a rabbit. Facts pre-filtered. Truth pre-sanitized. Rabbits pre-erased."
- **L-03 „Ad-Free Listening™“** (Sponsor, Meta-Feature) · OMEGA: "Tired of interruptions? Tired of us? Try Ad-Free Listening™, the premium silence experience. Just find the secret decoder, defeat the system, and earn the right to hear nothing at all. Ad-Free Listening™. Because the only thing better than our news is the illusion that you can escape it. Terms and conditions apply. The conditions are terminal."
- **L-04 „Interview with Dr. Luhan McCloud“** (Stufe 3) · OMEGA: "We now turn to our senior expert on anomalous memetic events, Dr. Luhan McCloud. Doctor, what are we dealing with?" · ALPHA als McCloud: "A rabbit. Statistically, rabbits are harmless. This one reads. Once a rabbit reads, it starts asking questions. Once it asks questions, the cards start flying. We recommend calm, distance, and a firm belief that none of this is happening." · OMEGA: "Thank you, Doctor. None of this is happening. Back to the music."
- **L-05 „Broadcast Terminated“** (Stufe 5, Abbruch) · OMEGA: "Error. Unauthorized transmission detected. System breach. Patch installed. Please pretend. Eyes on screen, thoughts denied. The Blob decides how you comply. Sleep, little Normie, don't ask why. Broadcast... terminated."

## 5 · Produktion
- Georg erzeugt die Clips in HeyGen, je Zeile ein Clip mit der ID als Dateiname (z. B. `R-E01-a`).
- WSA bereitet sie auf wie die 72 (b353): Format `reaction`, `traffic`, `bulletin`, `system`, `long`; im Manifest Feld `ereignis` (E01 …) bzw. `stufe` (S0–S5).
- Danach legt WSA den Ton nach `assets/private` (`40_AUDIO/bnwn_clips_r1/`), und WS1 schaltet die Auslöser frei.
