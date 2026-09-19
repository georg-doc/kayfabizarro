# Combat Arena Integration v2 · FrizzleBob Driver + KayKit Gegner

Status: **BRIEFING CURRENT · IMPLEMENTATION NOT STARTED**  
Datum: 2026-09-19  
Implementation-Owner: **georg-doc/KFB-Combat-Arena**  
Primärer Arbeitsweg: **ChatGPT Web / Coding Agent**  
Claude Design: nur für isolierte Look-/Staging-Studien, nicht für Combat-Code oder Rig-Integration.

## Ziel

Die bestehende Combat Arena wird produktiv weiterentwickelt:

1. aktueller FrizzleBob Driver Graft als spielbare Figur,
2. vorhandene KayKit-Charaktere als visuelle Gegnerfamilien,
3. vorhandene Animationsclips sauber an bestehende Combat-Zustände binden,
4. später über dieselbe Portal-/Tür-Naht aus Hub, Travel oder Race instanziierbar machen.

Die Arena bleibt Eigentümer von Bewegung, Treffer, Schaden, Gegnerzustand, Belohnung und Respawn. Es entsteht keine zweite Kampflogik.

## Verbindliche Ausgangsbasis

Im Combat-Repo zuerst vollständig lesen:

- `WSA_START.md`
- `ChatGPT_web/START_HERE.md`
- `_handover/C0_REENTRY/START_HERE.md`
- aktuelles Living Document und tatsächlichen GitHub-HEAD

Shared Donors:

- FrizzleBob Driver Graft und sein aktueller Vertrag
- bestehende Combat-Player-/Host-/Gunfight-/Mob-/Reward-Seams
- zentrales Asset-Register und KayKit-Clip-Katalog
- vorhandene Arena, Effekte und Audio nur als belegte Baseline

Chat-Erinnerung ersetzt keinen aktuellen Repo-Befund.

## Produktiver Integrations-Flow

### CA2-A · Source- und Owner-Probe

- aktuellen Arena-HEAD und die aktive 5A/A1-Linie belegen
- tatsächliche Actor-Montagestelle finden
- Player, Host, Gunfight, Mobs, Rewards, Boden-Writer, Mixer und Face-Owner benennen
- aktuellen FrizzleBob-Graft-Pfad und Vertrag pinnen
- tatsächlich vorhandene KayKit-Figuren und Clips inventarisieren

Keine Clip-Namen, Sockets oder Gegnerklassen erfinden.

### CA2-B · FrizzleBob als spielbare Figur

Nur an der vorhandenen Actor-Naht montieren:

- genau ein Animationsmixer
- genau ein Gesicht/Augen-System
- genau ein zuständiger Boden-Writer
- vorhandene Mündung, Schuss, Release, Treffer und Respawn-Verträge erhalten
- zunächst nur Idle, Laufen, Schießen, Treffer, Niederlage/Respawn
- weitere Aim-, Reload- oder Spezialclips erst nach grüner Kernprobe

Die alte Version-3-Graft-Darstellung wird nicht weitergepatcht. Der aktuelle Driver Graft ersetzt nur die sichtbare/animierte Actor-Schicht; Combat-Zustand bleibt beim Arena-Owner.

### CA2-C · KayKit-Gegneradapter

Zuerst zwei vorhandene Gegnertypen auswählen, die unterschiedliche Rollen sichtbar machen, zum Beispiel Nah- und Fernkampf.

Pro Gegner:

- exakter Modell-/Rig-/Clip-Pfad
- Größen- und Bodenanker
- Zuordnung Arena-Zustand → vorhandener Clip
- Waffe/Mündung nur, wenn tatsächlich vorhanden
- Treffer, Leben, Tod und Belohnung bleiben in der Arena
- fehlender Clip bekommt einen ehrlich benannten neutralen Fallback aus demselben Rig, keine neue Animation

Erst wenn beide Adapter stabil sind, darf die Familie erweitert werden.

### CA2-D · Kleine Spielrunde

`Einstieg → FrizzleBob bewegen → zwei Gegnerrollen bekämpfen → Ergebnis/Belohnung → Ausgang`

Die vorhandene Arena wird als Level weitergenutzt. Plattform-/Traversal-Erweiterungen kommen nur hinzu, wenn sie die bestehende Runde unterstützen und keine zweite Movement Engine erzeugen.

### CA2-E · Instanz-/Portalvertrag

Späterer neutraler Vertrag:

`sourceMode + returnAnchor + selectedActor + unlockedLevel + seed → Combat-Instanz → result + rewards → Rückkehr`

Zuerst innerhalb der Combat-Stage simulieren. Keine direkte Race-/Travel-Änderung in diesem Slice.

## Nicht Teil dieses Slices

- komplette globale Kampflogik für alle Spiele
- Dungeon-Generator-Integration
- A2-Karten, sofern der aktuelle Combat-Stand sie nicht bereits als aktiven Owner führt
- neues Rig, neue Waffe oder frei erfundene Animationen
- komplettes VFX-/Audio-Redesign
- Kopie der Combat Runtime in den KFB Hub

## Prüfungen

- vorhandene Combat-Tests bleiben grün
- FrizzleBob: Idle → Lauf → Schuss → Trefferreaktion → Respawn
- Actor, Augen, Waffe und Mündung bleiben nach Respawn verbunden
- kein zweiter Mixer, kein zweiter Boden-Writer, keine zweite Combat-Schleife
- zwei KayKit-Gegner zeigen korrekte Idle/Move/Attack/Hit/Defeat-Zustände
- Treffer, Tod und Reward funktionieren unverändert
- feste Browser-Stage auf Desktop und schmalem Format
- Performance vor/nach Actor- und Gegneradapter vergleichen
- technischer PASS ist keine visuelle Abnahme

## GitHub-Rückgabe

- Branch: `chatgpt-web/combat-arena-integration-v2-2026-09-19`
- Stage im Combat-Projekt: `/slices/combat-integration-v2/`
- `RETURN.md`
- `SOURCE.json`
- `ANIMATION_MAP.json`
- `TEST_REPORT.md`
- Screenshots/kurze Zustandsfolge
- additive Changelog-Notiz
- PR ohne Auto-Merge

## Starttext für ChatGPT Web

```text
Arbeite ausschließlich im aktuellen main von georg-doc/KFB-Combat-Arena. Lies vollständig WSA_START.md, ChatGPT_web/START_HERE.md, _handover/C0_REENTRY/START_HERE.md, das aktuelle Living Document sowie in georg-doc/kayfabizarro:
- skills/chat/START_HERE.md
- skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md
- skills/session-entry-use-what-works_v1.md
- skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/COMBAT_ARENA_INTEGRATION_V2_BRIEF.md

Beginne mit CA2-A. Belege aktuellen HEAD, aktive 5A/A1-Linie, Actor-Montagestelle, Player/Host/Gunfight/Mobs/Rewards, Boden-Writer, Mixer, Face-Owner, aktuellen FrizzleBob Driver Graft und tatsächlich vorhandene KayKit-Clips. Erfinde keine Clipnamen oder Sockets.

Setze danach den aktuellen FrizzleBob Driver Graft als spielbare sichtbare Actor-Schicht ein. Bewahre die Arena als alleinigen Owner für Combat-Zustand. Genau ein Mixer, ein Face-System und ein Boden-Writer. Beweise Idle, Lauf, Schuss, Treffer und Respawn, bevor du weitere Animationen anfasst.

Binde anschließend genau zwei belegte KayKit-Gegner als visuelle/animierte Adapter an zwei bestehende Gegnertypen. Leben, Schaden, Tod und Belohnung bleiben unverändert in der Arena. Liefere eine ehrliche ANIMATION_MAP.json mit vorhandenen Clips und benannten Fallbacks.

CA2-E simuliert den späteren Instanz-/Portalvertrag nur in der Combat-Stage. Verändere Race, Travel, Dungeon und Hub Runtime nicht. Eigener Branch, feste Stage, RETURN.md, SOURCE.json, ANIMATION_MAP.json, TEST_REPORT.md, Screenshots, Changelog und PR ohne Auto-Merge. Trenne Proposal, Implementation, Tests und Georg-Akzeptanz.
```
