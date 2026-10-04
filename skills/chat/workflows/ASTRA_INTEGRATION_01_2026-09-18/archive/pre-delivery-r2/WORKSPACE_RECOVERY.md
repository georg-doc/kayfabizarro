# Lokaler Workspace, Git und Wiederaufnahme · Integration 01

**Status:** AUFTRAGSREGELN FÜR DIESEN LAUF · kein bereits eingerichteter Workspace, kein Ersatz von SYNC_PROTOCOL.

## 1 · Zentraler Arbeitsordner

Vorgeschlagene lokale Struktur, tatsächlichen Basispfad Astra bestimmen und im privaten/lokalen Laufprotokoll vermerken:

```text
KFB-Workspace/
  repos/
    kayfabizarro/
    KFB-Stunt-Car-Race/
    KFB-Travel-Globe/
    KFB-Combat-Arena/
  cache/       # abgeleitet, hashgeprüft, nicht kanonisch
  run/         # lokale Logs/PIDs/Testartefakte, keine Credentials publizieren
```

Kein neues Repository dafür anlegen. Der Koordinationsauftrag liegt unter `skills/chat/workflows/ASTRA_INTEGRATION_01_2026-09-18/`. Echte Änderungen, Tests und ausführliche Returns bleiben beim jeweiligen Implementierungsowner. Der Integrations-Lock kann im Auftragsordner geführt werden, enthält nur die Zusammenstellung dieses Releases, keine kopierten Canon-/Assetinhalte.

`KFB-Production-Inbox` ist im gelesenen Router noch PROVISIONING; der aktuelle Zugriffsversuch lieferte 404. Das unterscheidet nicht zwischen Nichtexistenz und fehlender Berechtigung. Nicht davon abhängig machen und nicht als eingerichtet ausgeben. Benannte bereits vorhandene Projekt-Inboxes verwenden; keine neue öffentliche Ablage für private Vollquellen.

## 2 · Capability-Preflight vor teurer Implementierung

Astra prüft in seiner wirklichen Session, nicht anhand dieses Chats:

- lokale Dateien lesen/schreiben, freier Speicher, Prozess-/Serversteuerung;
- Git-Lesezugriff auf die vier genannten Repos, aktuelle HEADs, Branches, relevante offene PRs;
- autorisierten Schreib-/Pushweg auf aufgabenbezogenem Branch; privates Repo lesbar bedeutet nicht automatisch Merge-/Deployment-Rechte;
- Abhängigkeitsinstallation, Netzwerk zu konkret benötigten GitHub-Assets/Sidecars und Paketquellen;
- lokalen HTTP-Start mit korrektem Base-Path/MIME, Browser/WebGL, Audio-Nutzergeste und Screenshot-/Capture-Weg;
- vorhandene Publish-Konfiguration und reale Deployment-Berechtigung, ohne Secrets auszugeben;
- Lebensdauer des lokalen Volumes: bestätigt persistent oder UNVERIFIED/EPHEMERAL.

Bei fehlendem Browser-/Netzwerk-/Git-Schreibzugriff nicht Vollintegration behaupten. Konkretes fehlendes Recht im Work-Chat anfordern, soweit die Umgebung das vorsieht. Ein Berechtigungsfehler dieser Umgebung ist kein Gameplayfehler. Lokale Dateien schützen nicht gegen den Verlust des Volumes; nur hochgeladene/committete Quellen und reproduzierbare Abhängigkeiten bilden den dauerhaften Checkpoint.

## 3 · Quellen lokal erhalten, nicht neu erfinden

Bestehende lokale Checkouts zuerst auf uncommittete und nur lokale Commits prüfen. Keine `reset --hard`, `clean -fd`, rekursiven Löschungen oder pauschalen Stashes auf fremder Arbeit. Bei Unklarheit separaten frischen Clone/Worktree benutzen und vorhandene Arbeit benennen.

Große Asset-/History-Bestände nicht blind vollständig herunterladen. Zunächst benötigte Source-/Contract-Bereiche selektiv beziehen, dann exakt referenzierte Modelle, BIN/Texturen, Audio und sonstige Sidecars ergänzen. Abgeleiteten Cache über Repo+Commit+Pfad+Hash adressieren. Browser- und Build-Abhängigkeiten pinnen; kein Anspruch auf Offline-Betrieb ohne tatsächlichen Offline-Test. Vorhandene Font-URLs/Repository-Pfade konsumieren, keine Fontdateien in Chat-Handoffs packen.

Handoff-ZIPs, sofern als Original vorhanden, dürfen lokal gelesen werden. Keine weitere neue ZIP-Kette als Standard-Lieferweg. Verzeichnisse + Git + direkte Site sind der Arbeitsweg. Original-Inbox-Dateien nicht in-place korrigieren. Relevante Quellen >2.000.000 Byte nicht verschieben/archivieren/löschen ohne die im jeweiligen Projekt vorgeschriebene Freigabe. Nicht Teil dieses Integrationsauftrags: historischer Groß-Cleanup.

## 4 · Git-Koordination ohne konkurrierende Writer

Vor Beginn pro betroffener Lane aktuelle HEAD/PR/Branch und konkret beanspruchte Pfade notieren. Bereits aktive gleichartige Arbeit nicht duplizieren. Eine einfache datierte Arbeitsnotiz im vorhandenen Handoff reicht; das ist Koordination, kein atomarer Lockservice. Bei tatsächlicher Paralleländerung nochmals lesen/diffen.

Code auf dediziertem `astra/integration-01-*`-Branch pro Owner-Repo oder bereits benanntem passenden Arbeitsbranch; eine noch nicht existierende Beispielbezeichnung hier ist kein Nachweis eines Branches. Keine Force-Pushes, keine automatische Auflösung fremder Konflikte, kein pauschaler Merge alter PRs. Kein Cross-Repo-Mega-PR, der Ownergrenzen untrennbar macht.

Normale Implementierungsentscheidungen und dokumentierende Commits sind im freigegebenen Aufgabenumfang autonom. Promotion/Merge nur nach vorhandenem Projektvertrag und den zugehörigen Gates; fehlende Produkt-/Topologie-/Contract-Entscheidungen gezielt an Georg/Owner zurückmelden. Die Hauptzweige behalten eine erreichbare letzte gültige Basis.

Multi-Repo-Release ist nicht atomar: jeden Owner-Patch separat prüfen, dann den Integrations-Lock auf eine zusammen getestete Menge von Commits setzen. Nur diese Menge veröffentlichen. Eine halbfertige Kombination nicht unter einem vollständigen Release-Label ausliefern. Rollback ist Rückkehr zur vorherigen getesteten Kombination, nicht Zurücksetzen fremder main-Commits.

## 5 · Kleinster ausreichender dauerhafter Laufzustand

Astra erzeugt erst beim tatsächlichen Lauf, mit echten Werten:

- `INTEGRATION_LOCK.json`: pro bestehender Registry-/Lane-ID Owner-Repo, Source-Pfad, Source-/Contract-Revision, aktiver Branch/Commit, benötigte Assetpins, Test-/Deploynachweise. Keine geheimen URLs/Tokens, kein Ersatz für Registry-Einträge.
- `RUN_STATE.md`: nächste konkrete Aktion, aktive Aufgabe/Dateien, letzter gepushter Checkpoint je Repo, lokaler Dirty-/Unpushed-Status, offene Blocker, benötigte menschliche Entscheidung. Kurz halten, etwa ein bis zwei Bildschirmseiten.
- `RETURN.md`: tatsächlicher Produktablauf, Status pro Lane, Nachweise, getestete URLs, Unterschiede zwischen lokal/CI/public/human, Grenzen und Rollback.
- additive Einträge in `CHANGELOG.md`; detaillierte Testergebnisse in den betreffenden Projekt-Returns verlinken statt vervielfachen.

Die Namen sind vorgeschlagene Ausgaben dieses Auftrags, heute nicht mit behaupteten Laufwerten vorbefüllt. Bevor eine neue Projektstatus-Datei erzeugt wird, vorhandene WIP-/Manifest-/Return-Struktur prüfen; ein Link reicht, wenn die Information dort bereits lebt.

## 6 · Checkpoint-Rhythmus

Nach jedem fertig getesteten Teil des zusammenhängenden Ablaufs und **vor** riskanten Refactors, Deployments oder erwartbarer Sessiongrenze: Quelle speichern, klein committen, auf autorisierten Branch pushen, Return/Run-State mit Commit/Ergebnis/Nächstem ergänzen. Nicht bis zum letzten Token warten. Fehlender Push ist als LOCAL ONLY zu melden; lokaler Commit ist kein GitHub-Checkpoint.

Beim Ende jeder aktiven Arbeitsphase: HEAD und Inbox-Deltas erneut prüfen, nur relevante neue Eingänge zuordnen. Neu eingehendes Audio nicht übersehen, aber keine implizite Hintergrundüberwachung versprechen.

Ein neuer Agent liest: zentraler Router-Delta → dieser Auftrag → World-Review/akzeptierte Ergänzungen → RUN_STATE → Integrations-Lock → aktuelle Owner-Returns → tatsächlich geänderte Dateien. Kein Transkript-Dump. Nicht alle Historien von vorne durchlesen.

## 7 · Echten Recovery-Test ausführen

Nach einem brauchbaren Integrationsstand einen zweiten sauberen Arbeitsordner/Prozess anlegen. Den laufenden guten Workspace nicht löschen. Nur gepushte Commits, Lock/Startanweisungen und autorisierte Abhängigkeiten verwenden. Zielpfade booten und die gespeicherte Testkonfiguration wiederherstellen. Befehle, konkrete Commits, Ergebnis und etwaige noch lokale Abhängigkeiten protokollieren.

Dieser Test beweist Rekonstruierbarkeit. Er verspricht weder unbegrenzten Modellkontext noch dauerhafte Chat-/Container-Prozesse. Verwaiste Server-/Audio-/Inputinstanzen beim Wiederanlauf sauber identifizieren und nur eigene Prozesse beenden.

## 8 · Veröffentlichung / Hub

Öffentlich nur ausdrücklich für Veröffentlichung vorgesehene App-Dateien und kuratierte Metadaten. Private Repo-Checkouts, interne Voll-Handoffs, lokale Rechnerpfade, Tokens, signierte Download-URLs, Credentials, vollständige Logs mit sensitiven Daten und private Inbox-Pakete sind keine Site-Assets.

Der vorhandene Hub bleibt Einstieg. Sein öffentlicher Status wird aus referenzierten Owner-Ständen beziehungsweise einer kleinen freigegebenen Release-Projektion erzeugt/aktualisiert. Nicht zwei manuell auseinanderlaufende Wahrheiten pflegen. Ein Load-OK ist nicht DATA-INTEGRATED; eine veröffentlichte Seite kann noch eine ältere Revision ausliefern.

Prüfen: lokale Tests → CI sofern verfügbar → Build-/Deploy-ID → tatsächliche URL und Source-Marker → realer Browserablauf. Scheitert Cloudflare, letzten funktionierenden Link erhalten und Fehler benennen. Ein zusätzlicher gepinnter Preview ist als Preview zu kennzeichnen; nicht zur neuen SSOT machen. LocalStorage ist Origin-gebunden: Export/Import oder ausdrückliche Migrationsentscheidung vor URL-Wechsel, nie `localStorage.clear()` als Reparatur.

Kein noch nicht eingerichteter Daueragent/Watcher und keine neue Cloud-Infrastruktur durch diesen Auftrag. Regelmäßige Wiederaufnahme funktioniert über Git-Zustand; zukünftige automatische Läufe bedürfen eines eigenen real eingerichteten Triggers.
