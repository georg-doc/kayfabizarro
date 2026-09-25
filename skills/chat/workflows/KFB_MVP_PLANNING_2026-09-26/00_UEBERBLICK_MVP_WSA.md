# KFB · Überblick, MVP-Plan, WSA-Aufgaben · 2026-09-26

Status: **ENTWURF von Coworker zur Diskussion.** Keine finalen Briefings (siehe WSA-Regel aus #201: Coworker schreibt keine ungeprüften produktiven Briefings).

## 1 · Wo wir stehen (GitHub + lokal, gelesen am 26.09.)

| Strang | Stand | Nächstes Tor |
|---|---|---|
| **Hub** | läuft, zeigt Live-Stand; Besitzer HUB-CTRL #202. Status-Sync als Workflow-only-PR #215 (18/18 grün) wartet auf dein Merge-Ja. Hub-UX v2 (#217) ist Kandidat aus Claude Design. | #215 mergen (deine Entscheidung) · #217 rehomen |
| **Produktionsarchitektur** | #204: 13 Stränge, ~96 Jobs (44 READY / 52 HOLD) mit Executor/Modell/Budget je Job. | ENV-PREVIEW-01 (#218) |
| **ToolBox** | r2 technisch grün (#185: 31/31 + 34/34 statisch, 20/20 + 25/25 Browser). Stage-Review-Recovery #221: 33/33, Ohren (EarRig v5, #214) vollständig sichtbar. Noch nicht veröffentlicht. | Stage veröffentlichen + Hub-Link |
| **Motion Library** | v2 mit **179 Clips**, je Rig/Gruppe, Katalog, Contact-Sheets (#213). #209 ist ein älteres Duplikat (33 Clips). | #213 Review · #209 schließen |
| **WorldBuilder** | WB2 (#190) von dir abgenommen. World r2 **gescheitert** nach zwei Reparaturpässen (Ursache: veraltete Selbsttest-Labels nach ToolBox-Profilübernahme; Hürth bootet, 700 Gebäude, 0 Fehler). WB-W0 (#203) World-MVP-Kandidat. | WORLD-R2-CONTRACT-RESET-01 |
| **Hürth / Look** | R2 eingefroren (Graveyard). Architektur-Proofs A/B/C in #200 (Straßentopologie, Dach/Körper, Fassadenrhythmus). Landmarken-Farbe = KFB-Seed (#208). | Proofs abnehmen |
| **Racer** | Entscheidung: **ein Track Core**, alles andere als Daten (#219 ergänzt #216). RKIT-11 (Mülheimer Brücke inkl. Stunts, Race PR #42) = eingefrorene Abnahme-Vorlage. Lokal: RKIT-11 + Workbench v5–v9 (je ~89 MB). | TRACK-CORE-0 (Web: Bestandsaufnahme + Vertrag) |
| **Billboard / Vorhang** | B1/B2a/B2b in #198/#199/#211/#212, B3 Handover auf #211-Branch. Vorhang v2 nutzbar. | B3 |
| **Residents / Musik / Audio** | Resident Disco S40 (Kandidat), MUSIC-PERF-01 (#207), NPC-LIFE-01 (#210), Audio Baseline (#205) akzeptiert. | RES-DISCO-A |
| **Graveyard** | `tools/kfb-graveyard/`, 56 Gräber, läuft: https://kayfabizarro.pages.dev/kfb-hub/pruefen/graveyard/ | pflegen |

**Offene PRs:** über 30, fast alle Draft, mehrere auf Nebenzweigen gestapelt. Das ist inzwischen selbst ein Risiko (siehe WSA-Aufgabe 1).

### ⚠ Widerspruch, den du entscheiden solltest

PR #204 schreibt als bindende Regel: *„Travel/TinySkies remains macro-world truth.“* Am 24.09. hast du entschieden: **Travel Globe ist als Weltbasis raus, von TinySkies nur Himmel/Wetter/Licht/Stimmung/Kameraflug-Idee.** Zusätzlich plant #201/WB-W0 eine „getrennte Globus-/Lokalskala“. Bevor ein Welt-Briefing final wird, muss klar sein, welche Aussage gilt.

## 2 · MVP-Vorschlag (zur Diskussion)

Leitlinie aus #201: der erste spielbare Beweis ist **Region betreten → laufen → Fahrzeug nutzen → Korridor fahren → Landmark erreichen → zurück zum Hub.** Alle MVPs zahlen auf diese eine Schleife ein.

| MVP | Beweist | Besitzer / Werkzeug | Abhängig von |
|---|---|---|---|
| **M1 · Welt zum Laufen** | eine Region (Hürth → Köln) mit WB2-Gelände, Himmel/Wetter, Figur mit ToolBox-Laufprofil | Web (Contract-Reset) → Claude Design (Look) | Weltbasis-Entscheidung oben |
| **M2 · Strecke zum Fahren** | ein sicherer, repräsentativer Track-Abschnitt aus dem Track Core, befahrbar | Web (Core 0/1B) + Blender MCP (1A) → Claude Design (2) | TRACK-CORE-0 |
| **M3 · ToolBox als Werkstatt** | Figuren mit Augen/Ohren, Motion Library v2, Posen, Fahrzeuge – veröffentlicht und im Hub | Web (Publish) → Claude Design (UX) | #185/#221 |
| **M4 · Belebte Welt (klein)** | eine Bewohner-Szene (Disco oder Orc-Band) läuft in M1 an einem Ort | Claude Design + Web-Brücke | M1, Motion Library v2 |
| **M5 · Ein Hub** | nie leer, automatisch aktuell, Briefings lesbar, Prüfseiten verlinkt | HUB-CTRL (Web) | #215, #217 |

Empfohlene Reihenfolge: **M5 (klein) → M3 veröffentlichen → M1 und M2 parallel → M4.** Hürth-Look bleibt ein Beitrag zu M1, kein eigener MVP, bis die Architektur-Proofs (#200) bestanden sind.

## 3 · Aufgaben, die nur WSA / Work Lead sinnvoll übernehmen kann

Kriterium: braucht Zugriff auf private Repos, mehrere Repos gleichzeitig, Secrets/Actions/Cloudflare-Einstellungen oder eine echte lokale Browser-/Build-Umgebung.

1. **PR-Stau auflösen (Merge-Plan).** 30+ Draft-PRs lesen, stapeln/abhängigkeiten auflösen, Duplikate benennen (#209 vs. #213), je PR: mergen / schließen / weiterführen. Ergebnis: ein Merge-Plan zur Freigabe, keine Merges ohne dich.
2. **Private-Repo-Brücke.** Travel und Racer (privat) mit kayfabizarro (öffentlich) verbinden: Status-JSON per Action, Secret `KFB_PUBLIC_STATUS_TOKEN`; welche Racer-Module (Cologne-Palette, Route, Track) öffentlich gespiegelt werden dürfen, damit Claude/Claude Design sie lesen können.
3. **Cloudflare-Routen-Manifest.** Eine Keep-Liste für `cloudflare-live` (welche Prüf- und Stage-Seiten bleiben), damit Seiten nicht wieder verschwinden oder von Hand überschrieben werden.
4. **Widerspruchsprüfung Architektur.** #201, #204, WB-W0 und die Entscheidungen vom 24.09. gegeneinander lesen; ein kurzes Entscheidungsregister (was gilt, was ist überholt).
5. **Echte Laufzeit-Prüfung**, wo Web-Chats blockiert sind: WebGPU-Vorhang, Rapier-Kontakt (TRACK_A), große Blender-Workbench-Dateien (~89 MB, lokal) – nur wenn ein Tor das wirklich braucht.
6. **Aufräumen lokal ↔ GitHub:** Dropbox-Stände (RKIT-Workbench v5–v9, Session-Cut-ZIPs, `_to_delete`) gegen GitHub abgleichen; was fehlt, hochladen; was doppelt ist, als löschbar markieren (nicht löschen).

## 4 · Entwürfe (lösungsoffen)

- `DRAFT_WORLDBUILDER.md`
- `DRAFT_TOOLBOX.md`
- `DRAFT_RACER.md`
- `AUDIT_PAKETE_WS1.md` (Design-Critique / Audit für deine WS1-Credits)

## 5 · Entscheidungen Georg · 26.09.2026

- **Grundregel:** Wir nehmen immer, was (a) funktioniert und (b) sich am besten einfügen lässt. Das gilt pro Modul, bis es eine bessere Lösung gibt.
- **Weltbasis:** Es bleibt beim 24.09.: Travel Globe ist als Weltbasis raus, von TinySkies kommen nur Himmel, Wetter und Licht, oder bessere Methoden aus laufender Recherche. „Travel/TinySkies = macro-world truth“ in #204 ist damit überholt und muss dort korrigiert werden.
- **M1 Welt zum Laufen:** Die Basis steht (WorldBuilder, OSM-Zonen, Tracks) und muss ins Gelände integriert werden. **Zuerst Fortbewegung**, z. B. Kartenflug (auch als God Mode hilfreich), dazu eine **optimierte Orbit-Kamera**: Zoom rein/raus auf den Cursor, sauberes Schwenken und Verschieben.
- **M3 ToolBox veröffentlicht:** Rigging für den neuen Blender-MCP-FrizzleBob: komplettes Rig plus Ohren, auf beliebigem KayKit-Körper (Legacy, Medium, Large). Dazu **Surf-Posen für die Flugkarten** im Animation Lab.
- **Blender MCP** baut weiter Strecken und **Versatzstücke**.
- **Später auf demselben Track Core** (gleiche Physik und Baukasten, nur anderer 3D-Skin): Bahnstrecken, Lorenfahrt im Bergwerk, Space Race / Cosmic Highway, Slingshot Race (mit Quaternius-Schiffen).

### Coworker-Einschätzung (zur Prüfung)

- **Kamera als gemeinsames Modul.** Sie gehört wie `edit-layer.js` in die ToolBox-Bibliothek, damit WorldBuilder, ToolBox und Streckeneditor dieselbe Kamera nutzen. Vorlagen: WhackMan (Scroll/Touch-Zoom mit Cursor-Fokus) und der WB2-Orbit.
- **Kartenflug zuerst passt**, weil der Flug die Brücke zwischen Übersicht und Boden ist. Aus Travel kommen nur Bewegung und der Übergang Boden ↔ Flug (TMB-2, 400 ms, abgenommen), nicht das Gelände.
- **Die schwierige Stelle bei M1** ist, wer die Höhe besitzt, wo Gelände, OSM-Zone und Strecke aufeinandertreffen (Einschneiden von Straße und Strecke). Das braucht einen kleinen Vertrag, bevor Zonen und Tracks eingebaut werden.
- **FrizzleBob-Rig:** Es muss mit den Skeletten Rig_Medium und Rig_Large kompatibel bleiben, sonst laufen die 179 Clips der Motion Library nicht. Der Maßstab richtet sich nach dem Kopf. Den Job gibt es schon: `ACTOR-FB-BODY-FAMILY-01`.
- **Blender MCP liefert Teile, keine Generatoren.** Versatzstücke mit Andockpunkten (Tunnel, Brücken, Rampen, Stützen, Deko) können sofort entstehen. Neue Streckengeometrie erst nach dem Vertrag aus TRACK-CORE-0.
- **Bahn, Lore und Space jetzt als Anforderung in TRACK-CORE-0 aufnehmen**, später bauen:
  - Fahrmodi: frei lenken (Auto) oder an die Schiene gebunden (Bahn, Lore);
  - „oben“ muss beliebig sein: volle Rolle, Loopings, Kugelwelt (oben = Kugelnormale), Space-Band ohne Schwerkraft;
  - Schwerkraft als Parameter: Erde, Gefälle im Bergwerk, Gravitationsfelder im Weltraum;
  - Skin getrennt vom Kern: Profil, Material, Versatzstücke.
  RKIT-01 hat bereits notiert, dass `cross()` heute Welt-Y als oben nimmt. Genau das muss ein Parameter werden.
