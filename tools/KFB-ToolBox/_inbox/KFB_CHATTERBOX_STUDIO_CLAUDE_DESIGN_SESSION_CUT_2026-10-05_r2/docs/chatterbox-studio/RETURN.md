# RETURN · KFB ChatterBox Studio v0.1 · 2026-10-04

Executor: Claude Design · Modus: BOUNDED_SLICE (Design-/ToolBox-Site) · kein Runtime-Owner.

## Was jetzt geht

- `KFB ChatterBox Studio.dc.html` läuft lokal als eine Datei (plus `lib/chatterbox/chatterbox-core.js`, `assets/chatterbox/*.png`).
- **Bühne:** vier Fixture-Figuren auf einer ruhigen Platz-Bühne, sieben Szenen (Greeting, Thought Peek, Monkey-Island Exchange, Combat Burst, Ambient Chatter, Narration/Kayfabulate, TTS Preview). Keine Messpaletten.
- **Dialog:** drei kurze Exchanges mit je vier Antworten aus sieben Tönen. Bedienbare Blase, Tasten 1–4, Bottom-Sheet unter 560 px Bühnenbreite, Mobile-Vorschau (390 px).
- **Blasen-Familie:** acht Register (speech, thought, whisper, shout, caption, kayfabulate, interactive choice, ambient) × vier Textlängen × drei simulierte Viewports, Randnähe-Schalter.
- **Comic-Wörter:** Impact, Movement, Reaction, Reward/Meta mit eigener Formfamilie, Buchstaben-Deformation, Farb-/Extrusionslogik, Platzierung, Enter/Hold/Exit, optionalem Synth-SFX.
- **Stream · TTS:** instant · typewriter · chunked · tts-follow, Zeitachse mit Chunks und Pausen, markierter gesprochener Chunk, optionale Browser-Stimme mit Wortgrenzen-Resync.
- **Spec · Export:** `kfb.dialogue-presentation.v1`, `kfb.comic-word.v1`, `kfb.emote-overlay.v1` als kopierbares JSON.
- Drei kuratierte Rand-Varianten im Header: **Clay** (Default: Lehmrand außen, Ink innen) · **Ink** (reiner Kanon) · **Slab** (dunkle Unterseite wie Combat-Karten).

## Was nicht gebaut ist

- Keine GPT-Site publiziert: Claude Design hat keine Sites-Fähigkeit → `SITES_PUBLISHER_REQUIRED`, siehe `PUBLISH_PACKET.md`.
- Kein GitHub-Write aus dieser Sitzung (nur Lesezugriff). Der Stand liegt im Claude-Design-Projekt.
- Gedankenpunkte atmen noch nicht (Donor v10-S12 hat es); Flüstern nutzt `stroke-dasharray` statt der Kanon-Feder → bewusst als Preview-Näherung markiert.
- Keine echten Figuren-Rigs: Fixtures sind freigestellte 2D-Renders; Anker sind pro Figur gesetzt, nicht gemessen.

## Wer handelt als Nächstes

1. **Georg:** Studio öffnen, Rand-Variante wählen (Clay / Ink / Slab), Bühne 03 und 04 sowie den Dialog-Tab auf dem Handy prüfen → PASS / TUNE / FAIL.
2. **Low-cost Sites-Executor (PUBLISH_ONLY):** Paket aus `PUBLISH_PACKET.md` als private Site „KFB ChatterBox Studio“ veröffentlichen.
3. Danach erst: Consumer (World Studio / ChatterBox) entscheidet, welche Deskriptoren er liest.

## Technischer Nachweis — nur für ausführende Chats

- Quelle gelesen: `georg-doc/kayfabizarro@main` (2026-10-04T19:56Z): START_HERE, ACTIVE_WORK_MAP, SITES_FIRST, PUBLISH_ONLY, FRESH_CHAT_SLICE, `overworld/overworld/chatter-2d.js`, `bubble-ts.js`, `ANTWORT_ChatterBox_v2.md`, v13 `bubble-layout.js`, `SPEC_lettering`, `ABGLEICH_bubbles`, `CHATTERBOX_TOURBUS_REUSE`, `PetStudio/bubble/bubble.v1.js`, cartoon-animation refs 75/77.
- Nicht gefunden auf main: `overworld-v13…/HANDOVER_Bubbles_Design_coworker.md` (Pfad existiert nicht; Inhalte über ABGLEICH erschlossen).
- Nicht gelesen (Budget): `MASTERPLAN_overworld.md`, `ChatGPT_Living_Concept_v23.md`, `KFB_WORLD_ONBOARDING_CHATTERBOX_V1`, `17-the-dialogue-doctor.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`.
- Geprüft: Browser-Render aller sechs Tabs, Clay/Ink/Slab, Mobile-Viewport im Lab, Mobile-Vorschau im Dialog. Timer-Verhalten im versteckten Vorschau-Frame gedrosselt (Testartefakt, nicht Produkt).
- Offene Punkte: siehe `SPEC_COMPONENTS.md` §9.
