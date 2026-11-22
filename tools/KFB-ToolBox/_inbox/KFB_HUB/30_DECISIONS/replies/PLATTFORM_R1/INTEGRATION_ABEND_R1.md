# Integrations-Slice Abend 22.11. (nach Georgs Limit-Reset 22 Uhr) · WS0-Plan

Ziel: morgen Aqua für Markus und Kollegen, ohne Konto spielbar (q846), sauber getestet.

## Eingänge (bis dahin)
- Critic-Liste Aqua (zwei Kritiker) → replies/AQUA_CRITIC_R2/ (Aqua-Chat). Nach Impact/Aufwand sortieren, Owner zuteilen.
- WSB-Inventur (Aufträge, Handy-Aufträge, 20 Zweig-Urteile) und Waffen-Runde (Schwert einhändig, Axt-Griff, Boss-Flinte Hüfte, polearm).
- Buchmaschine R8 (Trailer-Loop) auf scenelet/buchmaschine-r1.

## WS0 baut
1. **HN-Sender-Kern** (Georg: „alles eine Engine“): Text-Ebene setText({ text, stil: echo|flexa, dauer }) mit Tippen/Einpassen, einbruch()/weg() aus der Engine, setPuls(pulse) kfb.audio-presentation-pulse/1 für Billboards (Beispiel-JSON vom Aqua-Chat). Grundlage adapter/sender.mjs + SENDER_MODUS_R1.
2. **Plattform:** Code-Wort-Feld + Spielername + Hall of Fame (src/plattform/spielstand.js) in Aqua einhängen (mit Aqua-Chat), echte Code-Wörter von Georg.
3. **Waffen:** Gate-Stand 22.11.: Einhand grün (4/4), Flinte grün bei Boss/Michelle, Gewehr rot (im Körper, ikRest Vegas/Ortiz) → zuerst Einhandwaffen + Einhandschwert anmelden (inkl. Inkwave), Langwaffen danach.
4. Hero-Shots in HUD/Flyouts (Register src/data/figures/hero-shots.r1.json).
5. Critic-Befunde mit Owner WS0.

## Aqua-Chat
Ride (src/ride), Bubble FM Mixer (src/audio/bubbleMixer.js + assets/private 40_AUDIO/BUBBLE_MIXER_R1), Critic-Befunde, Game-Over-Layout, Handy quer, Artefakt-Build.

## Vorgaben Aqua-Chat für den HN-Sender-Kern (22.11. abends)
- Puls-Beispiel: replies/DC_AQUARIUM/ANSCHLAG_PULS_BEISPIEL.json (sub 35–130 Hz, mid 250–2000, high 3000–11000 als Anschlag 0..1, kick mit Ausklang 6/s, feder, farbe). Vorschlag setPuls({ sub, mid, high, kick, beat?, phrase? }); Ride st.musik passt in dieselbe Form.
- Stile setText: Echo Bernstein (#ffb347-artig) auf #020403, Flexa #b8001d auf #d6d2c8; ohne Kopfzeile, ganzer Satz eingepasst mit 8 % / 12 % Rand, Tippen über dauer (cps = Länge / (Dauer·0,92)).
