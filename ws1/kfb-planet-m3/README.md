# KFB Planet-Spike R1

React Three Fiber + @react-three/rapier + ecctrl 2.x. Zwei prozedurale Kleinplaneten mit Kugelgravitation, KayKit-Figur (CC0), Flug, Gizmo-Editor mit Labyrinth.

- `npm install` · `npx vite` (Entwicklung) · `npx vite build` (eine HTML-Datei in dist/)
- Tests (Headless Chromium): `node test/smoke.mjs <out-dir>`, `test/prison.mjs`, `test/gizmo.mjs`
- Wichtig: ecctrl 2 liest die Tastatur NICHT selbst; Eingabe wird in `Player.jsx` per `setMovement()` aus drei's KeyboardControls gefüttert.
- Weltobjekte (Wände etc.) liegen als `{kind, planet, dir, yaw, size}` im Store und in localStorage; Export als JSON im Bau-Modus.

## Kayfabulation (R2)
- MED-Decks (`medkayfab_*`, 52 Decks) sind im Zufallspool ausgeschlossen (eigene Welten später); Pool: 77 Decks, 4.039 Karten.
- Karten: `scripts/build-cards.py <registry/assets/v1/decks> src/data/cards.json` (Registry @ ac9dbae, 6.789 Karten mit Name+Power+Lore, Texte wörtlich).
- Jede Karte kann Actor, Scene oder Quest sein; die Rolle entsteht beim Spielen. Actor wird zufällig zugeteilt (1× Switch).
- Pro Planet ein zufälliges Deck, 5 Karten als Wesen. `E` = ansprechen/einsammeln, auf der Bühne = Episode.
- Episode: King bietet 3 zufällige Quests, Spieler ordnet 3 Scene-Karten (◀ ▶), Story-Mode-Würfel, dann pro Beat (SHOW/SPIN/SELL/QUEST): Fragment aus Karte A · Konnektor (Liste oder eigene Fuge ≤ 8 Wörter) · Fragment aus Karte B. Fragmente sind wörtliche Ausschnitte (`fragments()` in `src/cards.js`). „…“ = Schnitt (NO_EDGE).
- Urteil solo nur nach Beobachtbarem; keine LLM-Zeilen, keine generierten Bridges.

## Regelablauf (R3, nach Freestyle Rules v18-4)
- Start: 3 Karten (Deal), Spieler wählt die Actor-Karte, die seine KayKit-Figur spielt (Intro-Ritual), 2 gehen in die Sammlung.
- Bühne: King zieht Quest (Ritual), Quest-Würfel 1. Pro Zug: Story-Mode würfeln (Bühnenlicht in Modusfarbe) → eine Karte aus der Sammlung spielen (freier Slot, Überschreiben yes-and, oder Character Switch) → Ritual SHOW/SPIN/SELL → 2 Erzählzeilen (Actor → neue Karte, neue Karte → andere Szene/Quest) → Quest-Würfel selbst setzen (+2/+1/0/−1).
- Power ausgespielt → Karte nach der Geschichte auf den Ablagestapel; überschriebene Karten und alte Actor ebenfalls. Bei 6 → Finale im nächsten Zug, danach Bühne geräumt, Quest wird Erinnerung.
- Gespielte Karten sind verbraucht (Motivation zum Sammeln). Ablagestapel für späteres Wiederbeleben vorbereitet.
- Story-Mode-Farben sind Platzhalter (`STORY_MODES` in `src/cards.js`).
- Blanko-Karten (`— Blank Card #n`, Platzhalter-Texte) sind aus dem Zufallspool ausgeschlossen.

## R4 · Hex-Insel + Deck-Turm (Standard-Szene; alte Planeten unter `#planets`)
- `src/scene.js`: Szenen-Adapter (Schwerkraft, oben, Start, Bühne, Ortsname). Player nutzt nur noch den Adapter.
- `src/hex.js`: Insel aus ~2.400 Hex-Säulen (Rauschen, Höhenstufen 0,5 m, ebene Flächen für Start/Bühne und Turmfuß), ein Mesh + Trimesh-Kollider. Deck-Turm: zufälliges Nicht-MED-Deck, 3 Seiten × 4 Karten als Plattformen (Karte Nr. 1 = Cover ausgenommen), je 2 Hex-Säulen als Plattformer-Übergang, oben Portal (noch ohne Ziel).
- Plattformer-Zone = Umkreis des Turms: Leertaste löst einen **geführten Sprung** zur besten Plattform in Eingabe-/Blickrichtung aus (ecctrl pausiert während des Bogens), Eingabe wird 350 ms gepuffert. Absturz > 7 m unter die letzte Plattform setzt weich zurück. Kamera in der Zone weiter und höher.
- Landen auf einer Karten-Plattform schaltet die Karte frei (Sammlung). Kartenbild noch Canvas-Platzhalter im Querformat → wird durch Card-Viewer-Bilder ersetzt.
- Test: `test/tower.mjs` (Headless ~3,5 fps; Physik läuft dort in Zeitlupe, daher sind manche Sprünge im Test verzögert).
