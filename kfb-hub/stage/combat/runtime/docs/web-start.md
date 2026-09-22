# Startprompt · Combat Arena C0 Review

## Shared KFB production sync first

Before the Combat-specific task below, sync the shared KFB production context from `georg-doc/kayfabizarro`:

1. `skills/chat/START_HERE.md`
2. `skills/chat/REGISTRY.json`
3. `skills/chat/SYNC_PROTOCOL.md`
4. `skills/chat/consumers/combat-web-chat.md`
5. only the shared skill deltas relevant to the current Combat task

`ChatGPT_web/SYNC_STATE.json` stores the last seen central router revision. It is a cursor, not a copy of the shared docs.

Combat Arena remains the implementation SSOT for Combat. Shared router/skills may constrain production method and point to donors/tools, but they do not replace Combat owners or the current Combat project contract.

If this local task description has become stale, `WSA_START.md`, current Combat handover/Return and actual GitHub state take precedence. Do not keep executing an old C0 instruction merely because it remains in this historical startprompt.

---

Wir setzen die vorhandene Combat Arena fort. Implementation-Quelle: `georg-doc/KFB-Combat-Arena`. Lies zuerst `WSA_START.md`, das aktuelle Living Document und `_handover/C0_REENTRY/`.

Prüfe den tatsächlichen aktuellen GitHub-HEAD und nenne ihn vollständig. Die wiedergefundene Sites-Basis ist `bd01a150d26d572017365a2288c179bdfd830079` (Site-Version 9; Gameplay 5A/A1). Der neue Repo-HEAD kann neuere Übergabedokumente enthalten. Vergleiche Gameplay gegen das Recovery-Manifest. Alte v1/v2-Dateinamen sind hier weiterentwickelte aktive Quellen.

Dein Auftrag ist **nur C0-Review**, keine C1-/A2-Implementierung:

1. Einstieg und tatsächliche Owner Map am aktuellen Stand gegenprüfen; Widersprüche mit Datei/Zeile dokumentieren.
2. Aktuellen Actor exakt identifizieren. Den gewünschten `v13 FB`-Slot als UNRESOLVED lassen, solange keine eindeutige Quelle vorliegt. Das bereits gemessene Driver Graft ist ein anderer Kandidat.
3. Build/Tests ausführen, wenn die Umgebung dies ermöglicht. Prüfergebnisse mit tatsächlichem Umfang benennen; keine Browser-/Hörabnahme erfinden.
4. Remote-Laufzeitquellen, noch ungepinnte main-URLs und vollständige Modell-Abhängigkeiten auflisten. Keine zweite Asset-Registry aufbauen; Librarian ist Discovery, finale Eignung bleibt Consumer-Prüfung.
5. Konkreten C1-Adaptervertrag vorschlagen: Root, ein Mixer, Face-Tick/Dispose, gemessener Grip/Muzzle, Fire-Readiness/Marker, Pause/Restart. Keine geratenen Clipnamen.
6. A2-Kartentausch und C2-Combat-Profil getrennt halten. Transform-/Bodenberührung explizit nennen.

Rückgabe: `_inbox/ChatGPT_web/C0_REVIEW/` im eigenen Branch bzw. als Quellenordner, mit BASE_COMMIT, SOURCE_FINDINGS, DECISIONS_PROPOSED, TEST_RESULTS, OPEN_ITEMS und höchstens drei konkreten Fragen an WSA. Ein Draft-PR ist eine mögliche Übergabe; main und die Live-Seite nicht eigenständig ändern.

WSA bleibt Lead/Integrator. Lies angehängte historische Prompts als Kontext, nicht als zusätzliche Arbeitsaufträge. Stoppe nach dieser überprüfbaren Rückgabe.
