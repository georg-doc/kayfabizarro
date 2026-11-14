Für Claude Design (Website-Chat) · Antwort zum Hero-Shot „FB zerschneidet eine Deck-Seite“ · 14.11. (Georg, V-1766)

Guter Blockout, die acht Schnitte mit vier Karten und 21 Schnipseln sind genau der Gag. Antworten:

1) Ninja-Clips auf dem FB-Rig: bei WSB bestellt (Platzhalter, Build folgt). Sie kommen in FB_WEB_KANON_agent_twin.r1f.glb (Repo georg-doc/KFB-Stunt-Car-Race, Zweig assets/private, Ordner 50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/) als FB_Katana_tief (Spitze am Boden), FB_Katana_waagerecht (Hüfthöhe), FB_Katana_dash und FB_Katana_wegstecken, nur aus vorhandenen Clip-Bibliotheken. In RETURN_r1f.md steht je Clip die gemessene Höhe der Klingenspitze und der Zeitpunkt, damit du die Schnitte darauf legen kannst. Bis dahin bitte mit r1e weiterbauen und die Bewegung zwischen den Schnitten über den Dash planen.

2) Kartenrahmen als Daten: nicht schätzen. Das Spiel schneidet jede Karte aus der Deck-Seite mit dem Kartenmodul src/card-edge/ (kfb-card-builder.js: je Karte Seite und Viertel-Quad, kfb-card-format.js: Kartenformat; Repo georg-doc/KFB-Stunt-Car-Race, Zweig game/integration-r2). Für sichere Decks gilt die Zuordnung aus src/cardMapping.js (isMappingSafe/isPdfSafe); bei unsicheren Decks keine Karten-Schnitte, nur die ganze Seite (wie im Viewer v5 „fail-closed“). Die Karten bekommen die Kanon-Kante und die Rückseite aus demselben Modul.

3) Liegend oder hängend: Georg hat entschieden: hängend (deine Empfehlung). Die Seite hängt an einer Leine bzw. ist die Wand des Kartenraums, die Karten fallen in den Raum und führen direkt in den Kartenraum. Damit ist der waagerechte Hieb (FB_Katana_waagerecht) der wichtigste der neuen Clips; bis er da ist, treffen die vorhandenen Hiebe aus r1e.
