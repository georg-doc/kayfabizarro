# WEBSITE_R1 · Patch read-only source access recovery · 14.11.2026

**Status:** RESEARCH / PROPOSAL. Kein Quellcode importiert, kein Patch-Fork, keine Änderung an Website, InfiniteRooms oder Runtime, kein Stage/Live-Claim. Existing owner: Claude Design Website R1 unter `docs/kfb-decisions-register-2026-10-11`; aktueller Auftrag: Bestandteile aus fünf offenen Patch-Projekten **nur lesen**. Dieses Blatt ersetzt weder den Website-SSOT `BRIEF_CLAUDE_DESIGN_WEBSITE_R1.md` noch die Material-/Stilentscheidung von Georg.

## 1. Befund – erreichbare Quellen

- `https://patch.gg/llms.txt` und `https://patch.gg/api/v1/openapi.json` sind aus dem Web-Reader hier tatsächlich abrufbar (Stand 14.11.2026). Daraus folgen die **öffentlichen** Routen `GET /repos/search`, `GET /projects/{owner}/{slug}/repo/refs`, `GET /projects/{owner}/{slug}/repo/tree` und `GET /projects/{owner}/{slug}/repo/file?path=...`. Ein persönliches Konto / `pch` wird für die offenen Lesezugriffe laut API nicht benötigt.
- **Wichtige Grenze:** Gegen die tatsächlichen projektbezogenen Patch-API-Endpunkte schlugen die Web-Zugriffe dieses Chats fehl; die isolierte Container-Shell konnte DNS für `patch.gg` und `git.patch.gg` nicht auflösen. **Keine** der fünf Patch-Repo-Dateien wurde direkt aus dem Repo gelesen oder in dieses KFB-Repo kopiert. Nicht als bewiesene Source-Integration ausgeben.
- Der Browser-Tab `https://patch.gg/patch/particle-physics` war als **README-/Projekttext** lesbar. Er nennt konkrete Tech- und Lizenzdaten, ersetzt aber keine eigene Source-Isolation.
- Ein unabhängiger Source-Audit von 13.11.2026 mit tatsächlichem Clone/Diff/Browser-Messungen ist abrufbar: `https://ai.satyajit.si/articles/painted-valley-patch` (Painted Valley, Coloured Pencil und Watercolour). Dessen Aussagen sind **Sekundärbelege**, keine eigene Quellcodeprüfung dieses Chats.
- Der spezifische Patch-Connector ist in dieser ChatGPT-Sitzung nicht installiert bzw. im Plugin-Verzeichnis nicht als passender Anbieter auffindbar. Eine globale `pch`-Installation wurde weder ausgeführt noch verlangt.

## 2. Unmittelbar durch Claude in der eigenen Umgebung ausführen – ohne Installer

Erst **einen** öffentlichen HTTPS-GET testen:

```bash
curl -fsSL --max-time 15 'https://patch.gg/llms.txt' | head -n 8
```

Dann den **offiziellen öffentlichen API-Dateileser** (exakte Route aus OpenAPI, mit URL-kodiertem Pfad) statt einen geratenen Clone:

```bash
curl -fSsL --max-time 20 \
  --get --data-urlencode 'path=README.md' \
  'https://patch.gg/api/v1/projects/blendi/painted-valley/repo/file'
```

Der Server antwortet normalerweise mit einer JSON-Dateibeschreibung, nicht zwangsläufig rohem README-Markdown. Prüfe HTTP-Status und `truncated`, dann `refs`/Tree; bei 401/403/502 weder Erfolg melden noch weiteren Installer/Proxy-Bypass versuchen.

Für die anderen Projekte dieselben offiziellen Routen mit
`blendi/patchwork-quilt`, `blendi/coloured-pencil`, `blendi/watercolour` und `patch/particle-physics`.
Die Clone-Adresse wird **nicht geraten**: sie kommt vom Feld `clone_url` eines exakten `GET /repos/search?q=<slug>`-Treffers (oder kann aus der geöffneten Patch-Projektseite kopiert und separat geprüft werden). Erst `git ls-remote <VERIFIZIERTE_CLONE_URL> HEAD`, danach ggf. `git clone --filter=blob:none --no-checkout` in einen isolierten Leseordner. Kein Checkout in die produktive KFB-Website.

**Diagnose 403:** Für Claude Code gelten Umgebungsfreigabe und vorgeschalteter Proxy getrennt. Ein Capabilities-Allowlist-Eintrag allein hebt einen organisations-/netzwerkseitigen 403 nicht auf. Bei persistentem 403 diesen klar benennen, **nicht** wiederholt Installationen oder Proxytricks probieren.

## 3. Ersatz für den Installer, falls echte Patch MCP-Funktionen gebraucht werden

Patch dokumentiert den Remote-MCP-Endpunkt `https://patch.gg/api/mcp` und OAuth/API-Key-Anmeldung. Für ein vorhandenes **Claude Code CLI** kann er **lokal nur in diesem Projekt** angebunden werden:

```bash
# Aus dem gewünschten Projektverzeichnis, keine globale oder geteilte Konfiguration:
claude mcp add --scope local --transport http patch https://patch.gg/api/mcp
claude mcp get patch
```

Danach in Claude Code `/mcp` aufrufen und die erforderliche Anmeldung selbst freigeben. Dies ist optional, **kein von diesem Chat durchgeführter Anschluss**, und behebt einen netzwerkseitigen 403 nicht. Für Claude Design im Web-UI ist nicht nachgewiesen, dass das Claude-Code-Terminalkommando verfügbar wäre.

Patch selbst bestätigt: `curl .../install.sh | sh` installiert `pch`, MCP/Skill in gefundenen Coding-Agenten und globalen Abschnitt `Game development: use Patch` in `~/.claude/CLAUDE.md` oder `~/.codex/AGENTS.md`. Daher vorerst **nicht installieren**, nicht das KFB-Owner-/Publisher-System ersetzen. Offizielle Information: `https://patch.gg/llms.txt`.

## 4. Donors: verified / secondary / unknown

| Patch donor | Belegstatus | Technisch belastbarer Teil | Offene Prüfung vor Reuse |
|---|---|---|---|
| `blendi/painted-valley` | Sekundäranalyse hat Repo geklont + Browser gemessen | Three.js r186.1, WebGL2, Rapier, große Szene mit 2-Ton-Licht, Kuwahara-Finish, teils vorausberechneten Fernkulissen. Nicht der globale KFB-Stil. | eigenes README/Lizenz/Modulstand und Source-Material zuerst isolieren; Perf in Zielgerät |
| `blendi/coloured-pencil` | Sekundäranalyse hat Repo geklont + Browser gemessen | WebGL2; Striche in Oberflächen-/Shader-Koordinaten statt schwimmender Screen-Space-Linien. Bericht: `src/shape.js`, `src/pencil.js`, `src/noise.js` als Kernpfade. | Für KFB nur verifizierbare Rendertechnik prüfen, nicht Papier-/Bleistift-Look oder fremde Branding-Art übernehmen |
| `blendi/watercolour` | Sekundäranalyse hat Reuse zu Coloured Pencil geprüft | Gemalte/mit Bewegung aufgedeckte Umgebung, gemeinsame Module mit Coloured Pencil. | tatsächliche eigene Renderpipeline, Codepfade, Shaderkompatibilität und Lizenz verifizieren |
| `blendi/patchwork-quilt` | öffentlicher Projekttext / Entwicklerpost, **kein Source-Read** | Beschrieben als prozedurale stop-motion-/patchworkartige Three.js? **Engine ungeprüft**; daher nur Gestaltungsreferenz, noch kein Modulempfänger. | README, Renderer, Materials, Lizenz und isoliertes Objekt |
| `patch/particle-physics` | originaler Projekt-README-Text aus vorhandenem Browser-Tab gelesen | MIT Code/CC0 Demoart; vendored `dgreenheck/threejs-particle-fluids` auf three r186.1, **WebGPU-only**, kein WebGL-Fallback. `Simulation({renderer,scene,camera})`; `await sim.step()` vor Render; default 5.000 Partikel. | kein direkter Einbau in vorhandene WebGL-Three.js-Site. Einzelne CPU-/WebGL-Trail-/Adhesion-Approximation als **separate, selbst zu entwickelnde Idee** möglich |

**Wichtiger Original-Source-Fallback (ohne Patch):**
`https://github.com/dgreenheck/threejs-particle-fluids` (MIT; offizielles README/GitHub hier direkt eingesehen). Dort ist die Upstream-Bibliothek mit WebGPU-only, Three r184 im npm-Release, dokumentierten Tests und Beschränkungen öffentlich lesbar. Das ist **nicht** exakt die vendorte Patch-r186-Version. Bitte keine Fremdmodelle aus den Demos blind übernehmen; `THIRD_PARTY_NOTICES.md` und Standford-Bunny-Rechte prüfen.

**Lizenzen:** Patch-Terms `https://patch.gg/terms` unterscheiden reguläre OSI/Creative-Commons-Lizenzen von der **Patch-Eigenlizenz**, bei der Arbeit anderer nicht ohne Erlaubnis außerhalb von Patch übernommen werden darf. Also NICHT pauschal behaupten, alle offenen Patch-Repos hätten MIT für Code und CC0 für Kunst. Exakte Felder `code_license`, `art_license` aus der offiziellen API prüfen, plus LICENSE/third-party-NOTICES und Quellobjekt-Provenienz.

## 5. Entscheidung und minimale nächste ausführbare Prüfung

**Reine Quellenaufnahme zuerst; kein Remix/Fork/Installer, keine zweite Runtime und kein neuer Shader-Owner.** Claude Design prüft in **seiner tatsächlichen Arbeitsumgebung** genau die zwei Proben aus Abschnitt 2; bei Erfolg `painted-valley`- und `patchwork-quilt`-README + Tree + LICENSE lesen, echtes Quellobjekt einzeln vorführen und nur dann donorabhängige Baustellen identifizieren. Bei 403: `NETWORK_ACCESS_BLOCKED`, der Website-Owner arbeitet mit bereits verifizierten KFB-Bausteinen und der GitHub-Upstream-Quelle weiter. Kein globaler Stop, kein von Georg zu installierender Systemagent.

**Ergebnis dieses Chats:** GitHub- und Web-Recherche, Browser-Text zu particle-physics, externe Source-Audit-Quelle und öffentliche API überprüft. 0 Clone, 0 Patch-Dateien importiert, 0 Build-/Browser-Implementierungstests, 0 Deployments; keine Codeänderung.

**Quelle/Belege:** `https://patch.gg/llms.txt`, `https://patch.gg/api/v1/openapi.json`, `https://patch.gg/terms`, `https://patch.gg/patch/particle-physics`, `https://ai.satyajit.si/articles/painted-valley-patch`, `https://github.com/dgreenheck/threejs-particle-fluids`.
