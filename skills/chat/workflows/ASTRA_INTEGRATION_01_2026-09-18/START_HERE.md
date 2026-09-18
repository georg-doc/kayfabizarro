# Astra · KFB Integration 01 · Onboarding r3

**Stand:** 18.09.2026 · r3 · **WORLD REVIEW COMPLETED / USER WORLD–TRAVEL–WALK SCOPE RESTORED**.
**Einziger aktiver Ausführungsauftrag:** [EXECUTION_BRIEF.md](EXECUTION_BRIEF.md), r3, einschließlich §0 World/Travel→Walk; [DELIVERY_CONTRACT.md](DELIVERY_CONTRACT.md) bleibt verbindlich.
**Ausführung:** NOT STARTED. Briefingreife ist keine Runtime-, Geräte-, Deployment- oder menschliche Spielabnahme.

## Zwei gleichrangige Produktpfade — nicht Race plus ein NPC-Import

Georg hat klargestellt: World-/Travel-Slices einschließlich Movement und TinySkies-Terrain sind Kernumfang, nicht nur ein Receiving-Consumer für Lorekeeper. r2 hatte diesen Umfang zu stark auf Quellenstart und Ensembleimport verengt.

**A · Race / BOX1:** Fahrzeug wählen → Profil/Originalvergleich → Countdown → fahren mit Environment/Audio → Shortlist/Reload.

**B · KFB World / Travel → Walk:** die vorhandene organische sphärische Travel-/TinySkies-Welt mit Terrain, Wasser/Küste, Vegetation, Himmel/Licht und Landmarken erleben → Flight erkunden → an einem geeigneten Ort zu Ground wechseln → sichtbar gehen/laufen/drehen/strafe/springen/landen → bestehenden bzw. authored Ort erreichen → zurück in Flight → BUILD/PLAY/Save/Reload ohne Verlust der gemeinsamen Welt.

Librarian/Atlas/ToolBox und der Lorekeeper/Hex/ROAD-Pilot liefern einen konkreten Teilnachweis **innerhalb** von B. Sie ersetzen weder die Welt noch die Reise-/Bewegungserfahrung. Ein NPC auf einer neutralen Bühne oder nur ein Flight/Ground-Boot ist kein fertiger Pfad B.

Die ausführbare World-Arbeit umfasst drei zusammenhängende Teile, keine neue Mikro-MVP-Leiter: **Welt-/Terrain-/Lookbasis**, **Travel↔Walk samt sichtbarer Movement-Präsentation**, **Authoring/Orte und Wiederherstellung im selben World-State**. Interaktion/Combat, größere Ortsausstattung und Innenräume bleiben mit ihren bereits bestehenden Folgegates erfasst. Bath Flight/Card-Surf und weitere Reiseformen verschwinden nicht aus der Quellen-/Statuskarte; deferred bedeutet ausdrücklich nicht integriert, nicht still gestrichen.

## Verbindliche Auslieferung · Georgs Korrektur bleibt erhalten

**ChatGPT-Site UND Cloudflare über KFB. Kein githack als Liefer- oder Ersatzadresse.** Beide Fassungen stammen aus demselben GitHub-Quellstand; Hosting-/Packaging-Anpassungen erzeugen keine zweite Implementierung.

ChatGPT-Site heißt echte ausführbare Site in geeigneter ChatGPT-Zielumgebung, nicht HTML-Download, Screenshot oder externer Link. Cloudflare heißt der bestehende KFB-Pages-/Hub-Weg; für World/Travel der autorisierte Travel-Mirror mit eigenem World-/Travel-Einstieg, nicht ein unter BOX1 versteckter Link.

- BOX1: `https://kayfabizarro.pages.dev/kfb-hub/stunt-race/track-environment-lab/`
- World/Travel: `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world-builder/?wb0=1&ground=8` als aktueller Kandidateneinstieg, kein Versprechen einer neuen r3-Runtime.
- Hub: `https://kayfabizarro.pages.dev/kfb-hub/`

Fehlt ein erforderliches Site-/Publish-Werkzeug, dieses Ziel als BLOCKED ausweisen. Keine Ersatzhost-/iframe-/Download-Abnahme. Der DELIVERY_CONTRACT ersetzt frühere CDN-Fallback-Erlaubnisse, nicht WR01–WR07, World-/Travel-Owner oder menschliche Gates.

**Historischer letzter BOX1-Auslieferungsbefund aus r2.1:** wiederholter bestehender Cloudflare-Prüflauf `kayfabizarro/35297175922`, Job `105467708547`, 29/29 PASS auf der tatsächlichen KFB-Cloudflare-URL; Quelle `1d88a887fc6ff4a1fc907afe5dbdef154181b221`, Artefakt `10529969236`. Nicht in r3 erneut getestet und keine World-/Travel-Abnahme. Native ChatGPT-Site bleibt separat nachzuweisen.

## Leseweg und Quellen

1. Dieses Dokument → DELIVERY_CONTRACT → **EXECUTION_BRIEF r3, besonders §0 und §4**.
2. WORLD_REVIEW: WR01–WR07 bleiben eingearbeitet; r3 ergänzt die ausdrückliche Nutzer-Scopekorrektur, keinen zweiten World-Plan.
3. `SOURCE_BASELINES.json` bleibt historischer r1-Snapshot, kein aktueller Integrations-Lock. TinySkies-/Travel-Quellen und heutiger Prüfstand stehen in §0 des aktiven Briefs; HEADs und neue Inputs beim tatsächlichen Work-Start erneut prüfen.
4. WORKSPACE_RECOVERY: reale Capability-/Rechteprüfung beider Site-Ziele, sichere Checkpoints/Branches und zweiter sauberer Wiederanlauf.
5. Travel-SSOT: `WSA_START.md`, `MASTERPLAN.md`, `AGENTS.md`, `travel/CONTRACT.md`, WB0 REUSE_MATRIX, `site/world-builder/runtime-mode.js`, Ground/Movement/Support und tatsächliche Globe-Hostdateien. Kein vollständiger Transkript-/History-Neustart.
6. Bestehender Router/Registry/Sync/SOP/Astra-Adapter/A0 sowie die betroffenen anderen Owner-Returns. CHANGELOG führt alle Revisionen additiv.

## Nicht verwechseln

TinySkies bleibt benannter Donor/Referenz; aktueller KFB-Travel-Code ist der Receiver und Implementation-SSOT. Kein Austausch durch ein fremdes Tiny-Planet-Projekt, glatte Standardkugel, Voxel-Gesamtwelt oder neue Engine. Vorhandene World-/Terrain-/Water-/Lighting-Owner erhalten; Originalmodelle immer aus GitHub, wenn vorhanden.

Die explizite WB0-Modusbrücke besitzt bereits Ground/Flight-Übergaben. Das ist Ausgangscode, keine neue vollständige Abnahme: genau ein aktiver Bewegungs-/Kameraschreiber, Flight-FX in Ground aus, korrekte Position/Heading/Footing und Wiederherstellung testen. Der Ground=8-Gate ist ein begrenzter Bestehendes-Gate, nicht ein Grund, den gesamten Travel-Umfang als späteren Optionalpunkt zu streichen.

Der v0.10-Race-Blockout bleibt separat technisch zu korrigieren; BOX1 bleibt auf v0.8. Arena-Navigation ist kein World-Portal. Bath Flight und ganze Town-v3-/Birthday-Branches nicht blind mergen. Audio A1 bleibt klanglich akzeptiert; Originalquelle bei Work-Start erneut suchen, kein Prosa-Nachbau.

## Startprompt

> Führe KFB Integration 01 unter der bestehenden WSA-Leitung aus. Lies START_HERE r3, DELIVERY_CONTRACT und den einzigen aktiven EXECUTION_BRIEF r3. **World/Travel→Walk ist ein gleichrangiger Kernpfad zu Race/BOX1**, nicht nur Lorekeeper-Import: reale Travel-/TinySkies-Terrainwelt, Wasser/Küste, Vegetation, Himmel/Licht, Flight→Ground→Walk/Run/Jump/LAND→Flight und BUILD/PLAY/Save/Reload im selben Weltzustand sichtbar nachweisen. Vorhandene Movement-/Camera-/Surface-/Animation-Nähte verwenden und fachliche Owner erhalten. Der Atlas-Pilot ist ein Teilnachweis; ein neutraler NPC-Viewer oder ein Linkhub erfüllt diesen Auftrag nicht. Sichere früh auf GitHub, arbeite lokal auf den realen Quellen, prüfe neue Audio-/ToolBox-Eingänge und publiziere als echte ChatGPT-Site UND KFB-Cloudflare gemäß DELIVERY_CONTRACT. Keine Ersatzhosts, Universal-Engine, zweite Registry oder Assetduplikate. Bestehende menschliche Gates nicht selbst erteilen; fehlende Quelle/Freigabe und unvollständige Pfade ehrlich PARTIAL/BLOCKED. Kein neuer Gesamtplan und keine Shell-Arbeit für Georg.

## Archiv und Status

r1 bleibt unter `archive/r1/`. Die unmittelbar vorherigen START_HERE-/EXECUTION_BRIEF-/CHANGELOG-Blobs liegen unverändert unter `archive/pre-travel-scope-r2.1/`. DELIVERY_CONTRACT, WORKSPACE_RECOVERY, ausgeführter World-Review und dessen Evidenz bleiben unverändert. Genau ein aktiver Ausführungsbrief r3.

r3 ändert Dokumentation/Scopeklarheit auf Georgs Auftrag; keine Runtime, kein Asset, kein Owner-/Contractwechsel und kein gestarteter Astra-Lauf.
