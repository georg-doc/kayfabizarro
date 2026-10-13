# KFB Slice · Integrationsplan R1 (13.10.2026)

Grundlage:
- `MODULE_INVENTORY_R1.md` aus dem Register-Branch `docs/kfb-decisions-register-2026-10-11`,
- Combat-Arena-Übergabe (Draft PR #20, `planning/open-world-combat-transfer-2026-10-13`),
- Spike R4, Quellcode-Zip, Szene „Hex-Insel + Deck-Turm“.

## 0 · Grundsatz
Wir hängen vorhandene Module mit dünnen Hüllen ein und bauen sie nicht nach. Jeder Schritt ist ein eigener kleiner Slice mit Abnahme im Browser.

**three.js: eine Instanz, 0.186.1.** Das ist dieselbe Version wie im Lab, Spike und Lab sind also deckungsgleich. Damit ist die Frage 4c der Inventur beantwortet.

## 1 · Empfehlungen zu den offenen Fragen der Inventur (Georg entscheidet)
| # | Frage | Empfehlung | Warum |
|---|---|---|---|
| 1 | Table Diorama: aufgestellte Karten? | **Neu bauen nach den Maßen aus v6** (Tisch, Matte, Slots). Karten liegen flach auf der Matte und richten sich beim Intro-Ritual auf. | v6 holt sich eine zweite three-Instanz und hat keine API. Aufrichten steht in LIVING_KFB_TOWN §13.4. |
| 2 | Lauf-Animation | **LOCO-Regel gilt.** ecctrl liefert Zustand und Tempo, `ActorAnimator` aus `anim.mjs` übernimmt die phasengleiche Mischung. Das ecctrl-Überblenden bleibt nur für Sprung und Emotes. Das kanonische LOCO-GLB nachliefern lassen, aber ohne den Slice daran zu blockieren. | `locoWeights` ist geprüft. Die KayKit-Rig_Medium-Clips sind schon da. |
| 3 | Karten-Aufsteller: Tusche? `fit` oder `cover`? | **Zuerst das Kartenbild ohne Tusche, Zuschnitt `fit`.** Kartentusche aus `kfb-card-builder` als zweite Stufe. | Die Karte ist der Inhalt, nichts darf abgeschnitten werden. So bleibt der erste Schritt klein. |
| 4 | Himmel und Weltgröße | **Skydome 4a** (¼ Tag, keine Konflikte bei Nebel und Licht). Den Environment-Host 4b erst, wenn feststeht, wem Nebel, Hintergrund und Licht gehören. **Welt: 400–600 m Durchmesser** (heute rund 200 m). | 4b besitzt Nebel, Hintergrund und Licht und kollidiert mit R3F. |
| 5 | Lügen-Stadt | **Rapier-Trimesh nur für die Chunks in Spielernähe** (zum Laufen). Schüsse und Trümmer bleiben bei der Kollision der Seed World. Den Auslöser stellt unsere Waffe: ein Zielstrahl der Kamera ruft `destruct.bullet()` bzw. `rocket()` auf. | Zwei Kollisionswelten mit klarer Grenze. `sw-mech` fällt weg. |
| 6 | Auswahl-Zeilen | NPC-Zeilen in der **V-204-Blase mit Flip-Reveal**. Spielerwahl in der **„choice“-Form 2 × 2** aus dem ChatterBox-Studio-Vertrag. Shantell Sans im Spike über Google Fonts, in der Produktion lokal. | Die Form „choice“ ist im Studio-Handover schon beschrieben. |
| – | pdf.js | **Eine Version: 4.7.76 als ESM.** Das ist die Version von `card-art-2d` und `card-builder`. Der Viewer 1a mit 3.11 wird nicht eingehängt. | Drei Versionen schreiben dieselbe globale Einstellung. |

## 2 · Reihenfolge der Slices
| Slice | Inhalt | Quelle (Inventur) | Aufwand | Abnahme |
|---|---|---|---|---|
| **S1 Kartenbilder** | `cardImage(deckId, n)` als Hülle über den Registry-Vertrag (`cardMapping`). Echte Bilder im Turm, im Fächer und auf der Bühne. | 1b bzw. 1c, `media/kfb/index.json` | ½–1 Tag | Turmkarten zeigen das echte Kartenbild im Querformat, Name stimmt mit JSON. |
| S2 Clay | `createMaterial()`-Hülle um Clay v10 für Hex-Boden, Säulen, Bühne. Dazu der Kontaktschatten. | 2, 8 | ½ Tag | Ein Material, gleicher Look wie im Lab, keine zweite three-Instanz. |
| S3 Himmel | Skydome 4a mit Follow-Kamera. Die Insel wächst auf 400–600 m. | 4a | ¼–½ Tag | Himmel ohne Netz-Laden, flüssig auf Georgs Rechner. |
| S4 Laufen | `ActorAnimator` auf ecctrl-Tempo, Rig_Medium-Clips. | 6a, 6b | ½ Tag | Füße rutschen nicht. Abnahme nach Handover §6. |
| S5 Blasen | `createBubbleLayer()` aus 7b herausgelöst. Spielerwahl als „choice“. | 7b | ½–1 Tag | Flip-Reveal 520 ms; Text nur aus Pool oder Karte. |
| S6 Karten-Kampf | Schleife **Erkunden → Karten-Kampf → Loot → weiter** auf den Kartenplateaus des Turms. Driver aus Combat PR #5, ein Warrior. | Combat-Übergabe PR #20 | nach deren Brief | Karte wird verteidigt (Schwärzen verhindert) und landet in der Sammlung, geschwärzte Karten auf dem Ablagestapel. |
| S7 Lügen-Stadt | Seed World als eigene Instanz, Zerstörung gibt Karten frei. | 5 | 1–2 Tage + Rapier | Gebäude fällt, Karte erscheint, Laufen ohne Durchfallen. |

## 3 · Was aus dem Spike bleibt
Diese Teile bleiben: Szenen-Adapter, ecctrl-Figur mit Flug und geführtem Sprung, Hex-Insel und Deck-Turm, Regel-Logik (Ritual, Züge, Quest-Würfel, Ablagestapel), Kartenbestand aus der Registry.

Ersetzt werden: Canvas-Kartenbilder (S1), Standard-Material (S2), Verlaufshimmel (S3), einfaches Animations-Umschalten (S4), Text-Dialogfenster (S5).

## 4 · Zugriff
Diese Planungs-Sitzung liest das öffentliche Repo `georg-doc/kayfabizarro`. Lab (Dropbox), Table Diorama und Combat-Arena-Repo kann sie nicht lesen. S1–S5 gehen aus Repo-Quellen:
- `card-art-2d` (v13), `card-builder`,
- Clay v10,
- Skydome (SKY3),
- `chatterbox-core`,
- `anim.mjs` (Branch `cloudflare-live`).

Für S6 braucht es den Brief aus PR #20 als Datei.
