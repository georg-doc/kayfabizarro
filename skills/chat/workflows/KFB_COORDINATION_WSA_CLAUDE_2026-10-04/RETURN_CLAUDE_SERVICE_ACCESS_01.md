# Return · CLAUDE_SERVICE_ACCESS_01

## Was ist der Stand?

Der begrenzte Service-Zugang ist **gebaut und 9/9 getestet**, aber bewusst **noch nicht veröffentlicht**.

Die bestehende private KFB Production Control bleibt dieselbe Site. Der normale ChatGPT/Codex-Weg bleibt unverändert. Zusätzlich kann genau ein fester Service-Principal `claude-cowork` über denselben `/mcp`-Endpunkt arbeiten, wenn zwei voneinander unabhängige Zugangsschichten erfolgreich sind:

1. Sites-Service-Zugang passiert die private Hosting-Grenze.
2. Ein separater Production-Control-Agent-Key autorisiert `claude-cowork` für den festen Scope `kfb-production`.

Claude erhält keine erfundene OpenAI-Nutzerkennung. Service-Aktionen können nur die bestehenden 11 Werkzeuge nutzen. Andere Nutzer/Scopes sowie Delete-, Priority-, Layout- und Order-Mutationen werden abgewiesen. Jede Service-Schreibaktion speichert Scope, Principal, Zeit und Quelle; diese Angaben erscheinen in der bestehenden Historie.

Es wurden keine Secrets erzeugt, abgefragt, gespeichert oder ausgegeben. Die beiden benötigten Site-Umgebungswerte sind noch nicht gesetzt. Deshalb wurde weder eine neue Site-Version gespeichert noch deployed.

## Wer macht jetzt was?

Georg setzt die beiden Werte sicher in der bestehenden Site. Danach führt ein günstiger Sites-fähiger Executor ausschließlich den vorbereiteten PUBLISH_ONLY-Handover aus und Claude macht den kleinen MCP-Smoke.

## Was musst du tun?

Zwei Werte in der bestehenden KFB Production Control anlegen: den separaten Claude-Agent-Key und die feste Georg-Owner-Bindung. Werte nicht in den Chat kopieren.

## Was passiert danach?

Die bestehende private Production Control wird einmal aus dem getesteten Candidate aktualisiert. Anschließend kann Claude lesen, einen Checkpoint schreiben und ein kleines Artefakt roundtrippen, ohne dass Production Control öffentlich wird.

## Technischer Nachweis — nur für die ausführenden Chats

- Repo: `georg-doc/kayfabizarro`
- Branch: `coworker/coordination-plan-2026-10-04`
- PR: keiner
- Start-Head: `5d0ce091348b2074b0ad329a2c6b8320f913e423`
- Site URL: `https://kfb-production-control.frizzlebob.chatgpt.site`
- Site project ID: `appgprj_6ab82e3950b88191a8ead3c495e21454`
- Current production version: `78` / `appgprj_6ab82e3950b88191a8ead3c495e21454~appgver_855c03b14a448191b13ab7b4c2040aba`
- Current production deployment: `appgdep_6ac2bc9f55e0819183bac00466aa3e5a`
- Current production source: `67a680820949568001553f15d83675d7f5d6a2eb`
- Candidate Site source pushed: `cfe4c7917b90acaabd3fdc36565df2051fad0faf`
- Candidate archive: 173 files / 603625 bytes / SHA-256 `d606e4358a5cbf4682251673ed44f76dd1ad9305d3d7098f22801861c1002150`
- Tests: **9/9 acceptance PASS**, **38/38 existing Control checks PASS**, production build PASS, focused changed-file lint PASS
- Publication: **NOT DEPLOYED**; latest Site version remains 78
- Access: unchanged `custom` / owner-private
- Secrets: no values in GitHub, logs or Return; environment currently unconfigured
- Exact supporting files: `SITE_SOURCE_MANIFEST_CLAUDE_SERVICE_ACCESS_01.json`, `TEST_REPORT_CLAUDE_SERVICE_ACCESS_01.md`, `PUBLISH_ONLY_HANDOVER_CLAUDE_SERVICE_ACCESS_01.md`

Exactly one next gate: **secure env entry → PUBLISH_ONLY deploy of candidate `cfe4c791…` → Claude smoke.**
