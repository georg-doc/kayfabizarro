# KFB Architektur R1 (V-228)

Stand 14.10.2026, §6 aktualisiert 16.10. **Diese Seite ist die eine Karte**: wer was baut, wo die Wahrheit liegt, in welcher Reihenfolge abgenommen wird. Ältere Strukturtexte zählen nur noch, wenn sie hier genannt sind.

## 1 · Schichten und Zuständige
| Schicht | Inhalt | Zuständig |
|---|---|---|
| **Daten** | Karten-Registry, Dialog-Pool (Opener und Beats), Figurenrezepte | **WS0** verwaltet sie und schreibt Georgs Urteile hinein. Bau-Arbeit daran vergibt WS0 als Daten-Auftrag. |
| **Laufzeit** | Host, alle Module, Szene, Kamera, Boden der Bühne | **nur WS1** (Branch `ws1/r3f-frame`) |
| **Design** | Bilder, Look-Spezifikationen, Parameterwerte, Look-Sandbox | **Claude Design**. Liefert nie Laufzeit-Code zur Übernahme. |
| **Steuerung** | Register, Verträge, Aufträge, Prüfung vor Georg | **WS0** |
| **Urteil** | PASS, TUNE oder FAIL | **Georg**, im Hub |

Eine Rolle ohne laufende Sitzung gibt es nicht. Was keinen Zuständigen hat, macht WS0 oder vergibt es mit Namen.

## 2 · Eine Quelle je Teil
| Teil | Einzige Quelle |
|---|---|
| Entscheidungen | `build_decisions.py` → DECISIONS.md. Abgelöste Einträge zeigen auf ihren Nachfolger. |
| Arbeitsregeln (Kurzfassung) | `KFB_WORKING_RULES_R1.md` |
| **3D-Gestaltung (alles: Umgebung, Farbe, Licht, Knete, Figuren, Bewegung, VFX, Abnahme)** | `CANON_3D/CANON_3D_R1.md` (V-563): Pflicht für jeden 3D-Job, mit Gate `CANON_3D/lib/kfb_env.py` und Kritiker `CANON_3D/CRITIC_3D_R1.md` |
| Struktur | diese Seite |
| Host-Vertrag | `replies/KFB_HOST_CONTRACT_R3F_R1.md` (R1.2, V-215). Kopien gelten nicht. |
| Billboard | `replies/BILLBOARD_STANDARD_R2.md` (R1 abgelöst) |
| Sprechblasen | `chatterbox-core.js` f59a8a1a; im Spiel `bubbleLayer.js` (S5a) |
| Karten | `media/kfb/index.json` + `cards.json`; Korrektur im Branch `data/kfb-registry-mapping-fix-2026-10-14` |
| Dialogtext | Pool **r6**, Branch `data/kfb-dialog-pool`, `data/dialog-pool/KFB_DIALOG_POOL_R6_2026-10-14.json` (r5 auf dem Voice-Branch eingefroren) |
| Gesicht und Figur | Darsteller-Vertrag = Code `wireface-face-driver-contract.mjs` (#355), erweitert durch WS1. V-Nummer und Code müssen übereinstimmen. |
| Status der Bauer | `WS1_STATUS.md`, Antworten in `replies/WS0_TO_WS1.md` |
| Für Georg | KFB Production Hub: Stand, Fragen, Briefings, Plan, Referenzen. Er zeigt nur an; die Wahrheit liegt in Register und Daten. |
| Wireface-SDK | nur lokal: `KFB_HUB/40_VENDOR_PRIVATE/wireface-0.3.3/`. Wird über einen lokalen Alias mit Schalter eingebunden. Build und Tests müssen ohne SDK bestehen. |

## 3 · Dialog-Inhalt: ein Weg
**Autor** (Web-Chat, Georg, Agent; beliebiges Format) → **ein Import-Skript** (`tools/dialog-pool/import-beats.mjs`, prüft mit `triplet-pool-core.mjs`) → **Pool-Kandidat** → **Georg urteilt im Hub** → **WS0 schreibt ACCEPTED in den Pool** → **WS1 liest eine fest benannte Pool-Revision**.

Ein Urteil gilt erst, wenn es in den Daten steht. Ein Eintrag nur im Register reicht nicht.

## 4 · Gesichter (ersetzt den Mischbetrieb aus V-217)
- **Je Figur steuert genau ein Treiber das ganze Gesicht.**
  - KFB-Figur: `KFB_NATIVE`, also Eye-Rig mit Augen, Lidern, Pupillen und Brauen. Der Mund kommt später aus dem KFB-Mund-Backlog.
  - Wireface-Figur oder GLB mit Wireface-Gesicht: `WIREFACE_MESH` bzw. `WIREFACE_MODEL`, exklusiv.
- **Kein Eye-Rig und Wireface an derselben Figur.** Das wirft im #355-Code ohnehin `DOUBLE_FACE_CHANNEL_OWNER`.
- **Stimme:** Es gibt keine Tonaufnahmen. Bis auf Weiteres bewegt die Figur den Mund ohne Ton („mime“).

## 5 · Abnahme-Reihenfolge (für jedes Teil)
- **G0 Verfügbarkeit:** Jedes verlangte Teil steht mit Pfad bzw. Commit im Auftrag und ist beim Empfänger nachweislich vorhanden.
- **G1 Vorlagen-Zeile:** was 1:1 übernommen wird, was neu ist und warum.
- **G2 Modultest + Bildpaar** gegen eine unabhängige Referenz.
- **G3 WS0-Prüfung**, schlank (V-312): Abnahme-Raster aus Georgs Vorgaben + feste Bildserie; WS0 prüft selbst. Blinder Prüfer nur noch einmal je Meilenstein-Ende (MVP-Abnahme), nie je Runde.
- **G4 Szene:** Das Teil läuft in der WS1-Bühne.
- **G5 Georg.**

Nichts geht an Georg, das nicht G4 bestanden hat.

## 6 · Kritischer Pfad (Stand 16.10., V-342; die Schrittliste im Hub „steps“ zeigt denselben Stand)
Erledigt und in MVP-0 aufgegangen: Host, Kartenbilder, Blasen, Pool-Leser, KFB-Augen, Billboard, Dialog. MVP-0 läuft auf `ws1-preview`.
1. **M1 TUNE** (WS1, M1-Sitzung): WoW-Steuerung, Sprünge, Flug per Doppel-Leertaste, Raster T1–T6 (V-342). Danach **M2 Fahren** (Dragster, V-315).
2. **L1 Licht** (WS1, Owner-Sitzung, V-329), dann **L2 Look-Lauf** (V-340/341): warmer Look B, Licht-Identität, ein Knet-Material, Fahrzeug-Aufstellung, Dioramen im Terrain. Bodenfarbe aus der Bühne (`edgePalette`), Story-Mode erst mit dem W6-Wurf.
3. **WS0 Blender-Lauf R1** (V-336/338/341): Alien-/Orc-Reparatur, FB-Ohren v5c, Bone-Ketten + Steifigkeit, Steine-Kit, `footprint`/`edgePalette`/`practicals` je Bühne. Liefert die Eingaben für L2 Schritt 4 und für die Aliens in der ToolBox (WSA work).
4. **Claude Design HUD R4** (V-333–335, 340): Look für HUD, Ziel-Pfeil, Radialmenü, Fluff-Pips; WS1 baut erst nach der Design-Lieferung.
Parallel: Musikvideo R1 (WSV, V-337), Suno arc2 (V-339), Karten-Kanon (Daten).

## 7 · Abgelöste Dokumente (nur noch Archiv)
- `START_HERE_STEERING.md`, `KFB_HUB/INDEX.md`, `KFB_HUB/10_SSOT/`;
- `replies/WS1_SLICE_INTEGRATIONSPLAN_R1.md` (die Slice-Liste führt WS1_STATUS);
- `replies/PASTE_FOR_GEORG.md`;
- `replies/BILLBOARD_STANDARD_R1.md`;
- Wireface-Stage-Briefs R1, Cold-Start und Donor-Fail;
- `replies/CLAUDE_DESIGN_STAGE_LIVE_R1/`: Module werden nicht übernommen. Nur `fitFace` dient als Vorlage für B1.

## 8 · Arbeitsweise der Steuerung
- **Entscheidungen gebündelt.** WS1 bestätigt vor jedem Slice, bis zu welcher V-Nummer es gelesen hat.
- **Ein Auftrag wird neu geschrieben, nicht mit Nachträgen geflickt.**
- **Neue Regeln nur, wenn eine bestehende nicht reicht.** Vorher wird geprüft, ob es ein Strukturfehler ist.
