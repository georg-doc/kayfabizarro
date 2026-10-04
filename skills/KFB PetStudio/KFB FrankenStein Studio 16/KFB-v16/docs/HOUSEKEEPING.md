# HOUSEKEEPING · KFB FrizzleGraft / FrankenStein

*Lebende Liste. Status je Artefakt: AKTIV · FROZEN · SUPERSEDED · DEAD · ASSET.*
*Stand 2026-09-13, 05:05 · nichts gelöscht, nichts verschoben — Löschen nur nach Georgs Freigabe, einzeln.*

## Blätter

| Datei | Status | Bemerkung |
|---|---|---|
| `KFB Mech & Vehicle Rig v2.dc.html` | **AKTIV** | drei Reiter: Sockel · Rover · Wanne · Farbzonen + Texturen |
| `KFB Mech & Vehicle Rig v1.dc.html` | **AKTIV · REFERENZ** | Reiter 1 von v2 ist 1:1 dieses Blatt; Bind-Fix von heute ist auch hier drin |
| `KFB FrankenStein Studio v16.dc.html` (Wurzel) | **AKTIV** | Kopie, erzeugt aus `petstudio-v9/…` — nur eine Zeile Unterschied (`__KFB_MODBASE`) |
| `petstudio-v9/KFB FrankenStein Studio v16.dc.html` | **AKTIV · QUELLE** | hier wird bearbeitet, nicht an der Wurzelkopie |
| `export/KFB-v16/…-STANDALONE.html` | **AKTIV · ABGABE** | 1,7 MB, Code eingebettet; 3D-Modelle per RAW-URL |
| `KFB FrankenStein Studio v15.dc.html` (beide) | **SUPERSEDED** | Rückweg auf die Fassung vom 12.09. |
| `petstudio-v9/KFB FrizzleBob Studio v14.dc.html` | **SUPERSEDED** | Vorgänger von v15 · Aufräumkandidat |
| `KFB FrizzleDummy Lab v1.dc.html` | **FROZEN** | Meßbank, unverändert — liefert die geprüften Pfade |

## Module

| Datei | Status | geteilt von |
|---|---|---|
| `frizzlegraft-v1/graft-biped.v1.js` | **AKTIV · GETEILT** | Studio v15 · Rig v1 · Rig v2 |
| `frizzlegraft-v1/headgraft.v1.js` · `facehost.v1.js` | **AKTIV · GETEILT** | Studio v15 · Rig v1 · Rig v2 |
| `frizzlegraft-v1/torsobase.v1.js` | **AKTIV · GETEILT** | Rig v1 · Rig v2 (Hüftschnitt + Sockel) |
| `frizzlegraft-v1/look.v1.js` | **AKTIV · GETEILT** | Rig v1 · Rig v2 lesen damit den Studio-Eintrag |
| `frizzlegraft-v1/seat-lab.v1.js` | **AKTIV · GETEILT** | Studio v15 (Wanne) · **Rig v2 Reiter »Wanne«** (`measureTub`, `RACE`) |
| `frizzlegraft-v1/ears.v2.js` | **AKTIV** | Rückweg auf `ears.v1.js` ist eine Zeile im Blatt |
| `frizzlegraft-v1/ears.v1.js` | **SUPERSEDED** | bewußt behalten als Rückfallweg |
| `frizzlegraft-v1/anim-audit.v1.js` · `anim-map.v1.js` | **AKTIV** | Anim-Reiter im Studio |
| `petstudio-v9/studio-v12/*` | **AKTIV · GETEILT** | FrizzleBob v4a · EyeRig v6 · BrowRig v2 · NoseRig v2 · Moustache |
| `petstudio-v9/studio-v13/pose-rig.v1.js` | **AKTIV** | Sitzhaltung + **Surf** (v16: `stagger`, Griff `surf`, Ellbogen-Hinweis, Handknochen festgesetzt) |
| `frizzlegraft-v1/matzones.v1.js` | **AKTIV · NEU v16** | Materialzonen des Wirts aus dem Farbfeld-Atlas · trägt auch die Stempel |
| `frizzlegraft-v1/headzones.v1.js` | **AKTIV · NEU v16** | acht Farbzonen am Kopf, freie Wähler |
| `frizzlegraft-v1/eyeoval.v1.js` | **AKTIV · NEU v16** | ovale Augen + Neigung · hängt sich an das geteilte Rig, **ohne Fork** |
| `frizzlegraft-v1/donoreyes.v1.js` | **AKTIV · NEU v16** | Spender-Augenschalen ausblenden (umkehrbar) |
| `frizzlegraft-v1/wordmark.v1.js` | **AKTIV · NEU v16** | Wortmarke · **übernommen aus Animation Lab v2** (`composeKFB`) |
| `frizzlegraft-v1/cardrider.v1.js` | **AKTIV · NEU v16** | Travel-Abgabe · Kartenmaße **zitiert** aus dem Briefing |
| `petstudio-v9/studio-v3/pet-mouth.v1.js` | **AKTIV · GETEILT** | Mund in allen Blättern |

## Daten und Konfigurationen

| Datei | Status |
|---|---|
| `fixtures/kfb-rig-driver-cockpit-01.json` | **AKTIV** · Georgs erstes Test-Rig (Sockel + Cockpit, Arme von Hand) |
| `fixtures/kfb-rig-driver-bath-01.json` | **AKTIV** · Georgs Wannen-Stand (Rad »dark«, Düse 0,96, Rig ×1,07) |
| `WSA_UEBERGABE_ROVER_MATERIAL_ANTRIEB_2026-09-12.md` | **AKTIV** · Übergabe an WSA (Materialzonen, Antrieb) |
| `TODO_WORTMARKE_STUDIO_V15.md` | **AKTIV** · Rezept für den frischen Chat |
| `LIVING_frizzlegraft.md` · `ONBOARDING_frischer_chat.md` · `github.md` · `CLAUDE.md` | **AKTIV** |
| `WSA_BERICHT_2026-09-12.md` | **FROZEN** · Stand vom Morgen, nicht überschrieben |

## Assets

| Datei | Status |
|---|---|
| `petstudio-v9/assets/models/FrizzleBob_Yellow.gltf` | **ASSET** · 594 KB · lokaler Spender |
| `frizzlegraft-v1/kfb-card-backside.png` | **ASSET · NEU v16** · 237 KB · aus `media/kfb/…_lowrez.png` kopiert · ⚠ Drehung noch falsch (siehe `OFFEN_nach_v16.md`) |

## Aufräumkandidaten (nur benannt, NICHT ausgeführt — Freigabe einzeln)

1. `export/KFB-session-2026-09-12/` — **SUPERSEDED** durch `export/WSA_2026-09-12/`; nach dem
   Herunterladen entbehrlich (enthält eine komplette Zweitkopie aller Module).
2. `petstudio-v9/KFB FrizzleBob Studio v14.dc.html` — SUPERSEDED durch v15.
3. **44 verarbeitete Rückmeldebilder** in `uploads/Bildschirmfoto *.png` — jeder Wert daraus steht
   im Code und im LIVING. Das ist der größte Posten im Projekt.
4. Doppelte Eingangsdateien in `uploads/`: `AnimationInventory(1).md`,
   `AnimationInventory_Large(1).json`, `AnimationInventory_Medium(1).json`, `RigCompatibility(1).json`,
   `kfb-pet-graft-driver (1)-1f55048c.json`, `Bildschirmfoto … 23.06.11-4a976b68.png`.
5. `export/WSA_2026-09-12/` selbst — nach dem Herunterladen.
6. `export/KFB-v16/` — nach dem Herunterladen. Enthält eine vollständige Zweitkopie aller Module
   (das ist gewollt: der Export soll allein lauffähig sein), rund 2,8 MB.
7. **v15 in beiden Fassungen** — jetzt SUPERSEDED. Ich empfehle, sie noch eine Runde zu behalten:
   der Rückweg ist billig, und die Kippung ist noch offen.

## Clean-Run-Prüfliste

- [x] Alle drei Blätter laden ohne Konsolenfehler (12.09., v2 dreimal gegengeprüft).
- [x] Laufzeit-Pfade HTTP 200 — neu dazu: `Rover_Round.gltf` · `bath.gltf` · drei Kenney-Wheels ·
      `Space engine` · vier Textursätze unter `Textures/`.
- [x] Kein Asset über `./assets/` außer dem einen lokalen Spender — alles andere RAW-URL.
- [x] Konfiguration in v2 raus und rein, verlustfrei; v1-Konfigurationen laden ohne Feldverlust.
- [x] Materialien und Geometrien werden vor dem Stylen **geklont** (Spender im Cache bleibt sauber).
- [x] **v16 gegengeprüft am laufenden Standalone:** 27 Pets · Graft-Driver gebaut · alle sieben
      neuen Module geladen · 11 Materialzonen · Spender-Augen aus · Karte gebaut.
- [x] Wortmarke auf dem Jacken-Rücken — erledigt, aus Animation Lab v2 übernommen.
- [x] Neue Felder im Vertrag: 81 → 89 Blattfelder, Rundlauf verlustfrei.
- [ ] **Offen:** Kartenmotiv um 90° drehen (meine Drehung beruhte auf einer Annahme).
- [ ] **Offen:** Kippung greift im Bild nicht — nur die ZAHLEN sind gemessen, nicht das Bild.
- [ ] **Offen:** Waffenhaltung (Briefing liegt in `export/KFB-v16/docs/`).
