# Handover — Theatre Curtain, frischer Neustart

**An:** nächster Chat / neuer Bearbeiter ("Umbohrling")
**Von:** Session 2026-09-24
**Lies zuerst:** `docs/POSTMORTEM_2026-09-24_theatre-curtain-stripe-artifact.md` (voller Kontext,
Fix-Historie, Warum-wir-hier-sind)

## TL;DR

Die CPU-Verlet-+-KFB-Textur-Architektur (`kfb-theatre-curtain.mjs`) zeigt ein Streifen-/Flicker-
Artefakt bei Bewegung, das fünf begründete Fixversuche nicht beseitigt haben. **Nicht weiter an
diesem Ansatz patchen.** Stattdessen: das offizielle, bewiesen funktionierende three.js-Beispiel
direkt als Basis nehmen.

## Startpunkt für den neuen Ansatz

Datei `Three.js Donor - webgpu_compute_cloth.html` im Projekt-Root ist der **unveränderte** Mount von
`mrdoob/three.js` `examples/webgpu_compute_cloth.html` (gepinnter Commit
`7300402f96c23bfa2174ffc0da01fb4e277d33da`, three.js `0.186.0`). Läuft sauber, streifenfrei, >130 FPS,
WebGPU-Renderer. Das ist der Beweis, dass diese Technik funktioniert.

**Neue Marschroute (Georgs eigener Vorschlag):**

1. Nimm dieses Beispiel als Basis — nicht nachbauen, sondern **forken/duplizieren**.
2. Zwei Instanzen nebeneinander (links/rechts) statt einer einzelnen Cloth.
3. Beide rot einfärben (`API.color`, aktuell `0x204080` → auf ein KFB-Rot ändern, z. B. `#8c3f37`
   oder `#a6512e` aus dem Paper-Design-System).
4. Das Ergebnis als "Theatervorhang" deklarieren — fertig ist der Grundzustand.
5. **Danach erst** sukzessive ergänzen, was fehlt (siehe unten), immer einzeln geprüft, bevor der
   nächste Schritt kommt.

## Bekannte offene Punkte auf der neuen Basis (aus Georgs Feedback dieser Session, noch nicht umgesetzt)

- **Deckungsgrad/Transparenz:** das Original hat `transparent:true, opacity:0.85` — für einen
  blickdichten Bühnenvorhang wahrscheinlich `opacity:1` nötig, plus ggf. Backdrop/zweite Lage.
- **Aufhängung/Hardware:** soll rundlicher/cartoon-hafter aussehen, nicht fotorealistisch (siehe
  Muppets-Referenz, im Chat verlinkt, nicht im Projekt gespeichert — beim Nutzer nachfragen oder aus
  dem Chatverlauf holen).
- **Klassische Theater-Bauchform / Rafflook:** siehe Referenzbilder im vorherigen Chat (Stock-Fotos
  von rotem Theatervorhang mit Kordel-Tieback, gleichmäßigen Vertikalfalten, bauchiger Wölbung über
  der Kordel). Nicht mehr per Verlet-Pin nachbauen (das war der v1-Ansatz, siehe Postmortem) — auf der
  neuen GPU-Compute-Basis muss der Ansatz neu gedacht werden (z. B. Ziel-Positionen der fixierten
  Vertices über eine analytische Kurve statt harter Pins, aber jetzt im TSL/Compute-Shader-Kontext).
- **Top-Volant/Scalloped Pelmet-Reihe** (bauchige Stoff-Halbkreise oben, wie im Muppets-Referenzbild):
  von Georg explizit als **eigenes, separates, ein-/ausschaltbares Layer für später** eingestuft —
  NICHT Teil des Grundzustands, aber im Hinterkopf behalten für die Architektur (z. B. als zweite,
  unabhängige Cloth-Instanz oben, damit sie später an/aus geschaltet werden kann).
- **HUD/Bedienleiste:** die DC-Wrapper-Idee (OPEN/CLOSE/TIE/UNTIE/RESET-Buttons, Fabric-Select,
  Wind-Slider, HIDE-UI-Toggle) aus `KFB Theatre Curtain.dc.html` war rein zur Bedienung/Review gedacht
  und kann als UI-Vorlage wiederverwendet werden — unabhängig vom Rendering-Backend darunter.

## Wichtige Fallstricke für die neue Basis

- **WebGPU-Pflicht:** das offizielle Beispiel wirft `throw new Error('No WebGPU support')`, wenn
  `WebGPU.isAvailable()` false ist. Im Design-Preview hat das funktioniert (bestätigt in dieser
  Session), aber das ist NICHT garantiert in jeder Nutzer-Umgebung/jedem Browser. Vor Auslieferung an
  Georg klären, ob ein WebGL-Fallback nötig ist (das offizielle Beispiel selbst hat dafür nur ein
  `// TODO: Fix example with WebGL backend` — es gibt noch keinen offiziellen Fallback).
- **DC-Format:** dieses Projekt verlangt normalerweise Design Components (`.dc.html` via `dc_write`).
  Der Donor-Mount wurde bewusst als **einfaches HTML** angelegt (Ausnahme-Regel: reine
  Canvas-/WebGL-Erfahrung ohne DOM-Layout). Für den produktiven Vorhang gilt dieselbe Ausnahme, SOLANGE
  die Szene reines Canvas/WebGL bleibt — sobald Bedienelemente (OPEN/CLOSE-Buttons etc.) dazukommen,
  muss der produktive Vorhang wieder als DC gebaut werden (Template + Logic-Klasse), mit der Three.js-
  Szene in `componentDidMount` gemountet — wie in `KFB Theatre Curtain.dc.html` bereits vorgemacht.
- **Asset-Pfade:** das offizielle Beispiel lädt HDR-Environment + example.css von `threejs.org` direkt
  (Netz nötig, auch im Standalone-Export). Für einen Produktions-Build ggf. eigenes, leichteres
  Environment oder Farbverlauf statt HDR-Datei erwägen.
- **NICHT den v1 CPU-Verlet-Port (`kfb-theatre-curtain.mjs`) als Startpunkt nehmen.** Das ist die
  Sackgasse dieser Session. Die Datei bleibt im Repo als Referenz/Lernmaterial (siehe Postmortem), aber
  nicht als Codebasis für den nächsten Versuch.

## Dateien in diesem Handover-Paket

- `docs/POSTMORTEM_2026-09-24_theatre-curtain-stripe-artifact.md` — volle Fix-Historie & Analyse.
- `docs/HANDOVER_THEATRE_CURTAIN_FRESH_START.md` — dieses Dokument.
- `Three.js Donor - webgpu_compute_cloth.html` — der bewiesen funktionierende Startpunkt.
- `KFB Theatre Curtain.dc.html` + `game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs` —
  der eingestellte v1-Ansatz, als Referenz belassen, nicht weiter pflegen.
- `screenshots/postmortem-*.png` — Vergleichsbelege.
- `github.md` — Repo-Anbindung (`georg-doc/kayfabizarro`, Branch
  `chat/gds-theatre-curtain-v1-2026-09-20`) und Sync-Historie.
