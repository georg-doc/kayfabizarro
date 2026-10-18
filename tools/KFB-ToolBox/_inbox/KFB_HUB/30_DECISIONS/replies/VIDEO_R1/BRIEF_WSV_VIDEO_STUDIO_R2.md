# WSV · KFB Video- & Motion-Studio R2 · Gründungsbriefing (18.10.2026 · V-527)

**Für:** eine eigene Claude-Code-Sitzung „WSV“, zuerst auf Georgs Mac, später ggf. auf dem Mac mini.
**Steuerung:** WS0 (Register, Hub). Georg nimmt im Hub ab.

## 0 · Rolle
WSV ist das Video-Studio von KFB:
- Musikvideos zu den Deck-Songs;
- Comic-Motion-Slices und Performance-Clips (Mumien-Duett, Bord-Banter);
- Karten- und Billboard-Promos;
- Hypernormalisation-Inhalte.

Werkzeuge: **Remotion** (React, mit dem Three.js-Baustein für unsere 3D-Szenen), **HyperFrames** (HTML/GSAP → MP4) und die **HeyGen-Videoproduktion** (Video Agent, Seedance/Veo als Rohmaterial; keine Avatare).

**Ziel:** Werkzeuge, Workflows und Lessons Learned **additiv dauerhaft festhalten**, damit sie in den produktiven Slices von WS1/WSA/WSB nutzbar werden.

## 1 · Dauerhaft festhalten (Pflicht)
- **Projekt-Skill** `.claude/skills/kfb-video/SKILL.md`. Inhalt:
  - wie Remotion, HyperFrames und HeyGen hier eingerichtet sind;
  - die Workflows, also Pipeline-Schritte mit Befehlen;
  - die Look-Regeln;
  - die QA-Liste.
  - Jede Session ergänzt ihn, nichts wird überschrieben.
- **Lernprotokoll** `KFB_HUB/60_VIDEO/LESSONS.md`: was ging, was nicht, warum. Kurz, datiert.
- **Wiederverwendbare Bausteine:** `KFB_HUB/60_VIDEO/components/`, etwa Kartenflug, Glyphe → Fluff → Klartext, Untertitel, Beat-Schnitt, Figur-im-Diorama-Szene. Jeder Baustein mit README und Eingabeformat (JSON).

## 2 · Verbindliche Regeln
- **Look:** ein Look (V-355), Licht-Rig und Clay wie in der Abnahme-Bühne (`replies/PROOF_STAGE_R1/`, inkl. Augen-Modul v1.2.7). Figuren immer mit KFB-Augen (V-061), nie doppelt, kein Schielen. Cartoon-VFX nach V-499.
- **Daten:**
  - Performance-Format `kfb.performance/1` und eine Ereignis-Zeitleiste für Tanz, Ton, VFX und Licht (V-359, V-389).
  - Beispiel: `KFB_HUB/40_AUDIO/pharaoh_piledriver__suno_01a/performance/pharaoh_piledriver__suno_01a.performance.json`.
  - Musikvideo-Briefing R1: `replies/VIDEO_R1/BRIEF_MUSIC_VIDEO_R1.md` (V-337).
- **QA vor jeder Meldung** (V-520): Löcher, Normalen, Augen, Platzierungslogik, Georgs Wortlaut, ein Look. Standbilder selbst ansehen.
- **Rechte:**
  - Private oder gekaufte Assets (KayKit Mystery, Meshy) nie auf öffentliche Branches.
  - Kein Schlüssel in Repo, Log oder Chat (ElevenLabs aus dem Schlüsselbund).
  - HeyGen nur über den MCP-Zugang mit Georgs Plan-Credits, **kein** `HEYGEN_API_KEY` setzen.
  - Credits nur im freigegebenen Rahmen (Hub q94: P1 Hypernormalisation + P3 VFX).
- **Installation:**
  - Remotion in einem eigenen Projektordner (`KFB_HUB/60_VIDEO/remotion/`). Vorher die Lizenz prüfen (kostenlos für Einzelpersonen/kleine Teams?) und im RETURN belegen.
  - HyperFrames läuft auf dem Mac mini (WSB installiert es), lokal nur nach Rückfrage.
  - Nichts außerhalb des Projektordners global installieren.
- **Nie:** `~/Dropbox/CLAUDE/KFB Open World/` anfassen, Port 5180 benutzen, Prozesse fremder Sessions beenden, mergen ohne Georg.

## 3 · Erste Slices (in dieser Reihenfolge)
1. **S0 Einrichtung:**
   - Remotion-Projekt mit dem Three.js-Baustein, Lizenz-Beleg, ein Test-Render;
   - Skill-Datei und LESSONS anlegen;
   - prüfen, ob es offizielle Remotion-Skills für Claude Code gibt, und sie wenn ja dokumentiert einbinden.
2. **S1 Pharaoh-Mumien-Duett, 30 s:**
   - die zwei KayKit-Mumien mit KFB-Augen im Pharaoh-Diorama;
   - Tanz und Mund aus der Performance-Datei, Song-Ausschnitt mit Refrain;
   - Licht und Clay wie die Abnahme-Bühne.
   - Abnahme im Hub: Video plus 6 Standbilder.
3. **S2 Karten-Promo-Baustein:** eine Karte aus dem PDF bzw. PNG fliegt ein, Titel, Glyphe → Fluff → Klartext nach Fluff-o-lect R10.1, Ton aus `40_AUDIO/elevenlabs_r1/reward_r1b_norm/`, 6–8 s, 1:1 und 16:9.
4. **S3 HeyGen** (sobald Georg den MCP-Zugang eingerichtet hat):
   - P1 Hypernormalisation-Clip über den Video Agent, aus einem Deck;
   - P3 drei Cartoon-VFX-Clips über Seedance auf Schwarz für Explosion, Rauch und Funken, als Flipbook bzw. additiv nutzbar, geprüft gegen V-499.
5. Danach: Comic-Motion-Slices (Bord-Banter Dory/Hunky, sobald die Text-Regel steht) und Deck-Musikvideos nach V-337.

## 4 · Rückmeldung
Je Slice `KFB_HUB/60_VIDEO/RETURN.md` (neueste oben): was gebaut wurde, Befehle, Dateien, QA-Liste, offene Fragen. Ergebnisse gehen an WS0, und WS0 stellt sie in den Hub.
