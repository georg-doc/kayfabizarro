# WSA → WS0 · V-1146 · Arbeitskopien aufgeräumt · 01.11.2026

Berichtsrepo: `georg-doc/kayfabizarro`; Branch `docs/kfb-decisions-register-2026-10-11`; kein neuer PR. Regel-Checkpoint `68e793eb2b54ce373a4a1a8f008c2c846480d5d4`, Evidence-Checkpoint `45fa295d81399c147d361ec9a9520bccb27c880d` (Ref und kompletter JSON-Inhalt exakt zurückgelesen). [Maschinenlesbarer Nachweis](WSA_V1146_HOUSEKEEPING_EVIDENCE_2026-11-01.json) · [Arbeitsregel](WSA_V1146_WORKTREE_POLICY_2026-11-01.md).

**Ergebnis: 31 geprüfte saubere Altkopien im Papierkorb, 59 bewusst behalten. Nichts endgültig gelöscht, kein Merge/Push von privaten Quelldaten, keine Site geändert. Rückgabe abgeschlossen; danach Stopp.**

## Platz und Grenzen

- Freier Platz vor Beginn: **19.09 GB** (`df`: 18,640,000 KiB); nach der Nachprüfung: **14.13 GB** (`df`: 13,800,000 KiB). Die globale Frei-Anzeige sank während der Prüfung; Ursache nicht sicher zugeordnet. Keine Speicherfreigabe behauptet.
- `~/.Trash/KFB-WSA-V1146-2026-11-01/`: **10.00 GB** laut eindeutigen belegten Inodes. Darin **7 abgebrochene tmp_pack-Dateien, 4.16 GB**; diese Zahl ist Teil der Papierkorb-Größe, nicht zusätzlich.
- Geschätzt **7.11 GB** davon ohne weitere Hardlinks außerhalb des Papierkorbs. Erst Georgs Leeren kann Blöcke freigeben; APFS-Snapshots/Shared Extents können den tatsächlichen Gewinn verändern. Sicherungsobjekte mit verbleibenden Links bleiben erhalten.
- Die sieben zentralen Spiegel referenzieren bestehende Objekte per Hardlink. Neu nur einmal verlinkte Spiegel-Dateien belegten bei der Messung ca. **27.5 MB**; keine Behauptung, dass dadurch die globale Abnahme erklärt wäre.
- Kopiergrößen in der Tabelle sind die ursprünglichen individuellen `du`-Werte. Verschachtelte Klone und Hardlinks machen ihre Summe ungeeignet als versprochenen Speichergewinn.

## Sicherung und echte Prüfungen

- Inventar: **90 Git-Arbeitskopien** (82 Projekt, 8 Dropbox), nicht 80. Die zwei jüngsten Dropbox-Librarian-Arbeitsorte und alle veränderten/unvollständigen Kopien bleiben erhalten.
- Frisch mit `--filter=blob:none` geladener Public-Spiegel: **614 aktuelle Branch-Heads**. Von **40** expliziten Public-Origin-Kopien sind **17** HEADs weiterhin in aktuellen Remote-Zweigen erreichbar; 23 nicht so klassifiziert. Vergleich gegen verschiedene HEADs allein wurde nicht verwendet.
- **32/32 lokale Sicherheits-HEADs** zurückgelesen (31 verschobene Kopien plus bewusst behaltene Production-Control-Kopie); **11.293 vorhandene versionierte Dateien / 946.844.582 Bytes** gegen Git-Blobs in den Spiegeln geprüft. Weitere Branches/Tags/Stash-Refs erhalten. **3.003 Reflog-Commit-Refs** zusätzlich benannt und zurückgelesen, keine fehlenden Reflog-Commit-Objekte.
- Nachher **90/90 Orte vorhanden, 90/90 HEADs und 90/90 Änderungsstände identisch**. Verbundene Worktrees wurden mit `git worktree move` verschoben; gemeinsame Git-Eltern blieben. Aktueller Spiel-Site-Owner weiter `1a634b7dd6bcc59c363b239d44c4213c57e90679`; sein geteilter Abhängigkeitsordner existiert.
- Offene Dateien/Arbeitsorte und aktuelle Chats geprüft. Nur die Verzeichnis-Handles des macOS StorageManagementService bei einem Altkontext waren ohne Job-/Dateischreiber und wurden nicht als laufender Produktionsjob interpretiert. Kein fremder Prozess beendet.
- **LOCAL_ONLY:** Sicherheitsbranches liegen auf derselben Platte, nicht auf GitHub. Kein Kauf-Asset, privates Bundle oder Roh-Patch veröffentlicht. Ursprüngliche Partial-/Shallow-Historien werden nicht als vollständige Offline-Archive bezeichnet; ihre vorhandene lokale Arbeit wurde erhalten.
- Private CLI-Fetches haben ohne vorhandene Git-Anmeldung abgebrochen. Connector-Metadaten/Ancestry sind lesbar (V538 `e4669954` ist Vorfahr des aktuellen `945c6a00`); das ersetzt keinen vollständigen aktuellen LFS-Abruf. Private Roharchive und unklare Zuordnungen bleiben liegen. Kein Token von Georg angefordert.
- Projektregel additiv in lokaler `AGENTS.md` verankert und zurückgelesen: ein Spiegel je Repo, gefilterter Abruf, Sparse-Worktrees außerhalb Dropbox, eigener Worktree am Job-Ende aufräumen. `sources/` unverändert. Regel-Checkpoint auf GitHub: `68e793eb2b54ce373a4a1a8f008c2c846480d5d4`.
- Die sieben eigenen Zwischen-Sicherungsablagen wurden nach Ref-/Objektvergleich in `temporary-audit-mirrors/` im selben Papierkorb verstaut. Nur sieben kanonische Spiegel bleiben unter `~/.codex/mirrors/`.

## Tabelle aller Arbeitskopien

`P/` = `~/.codex/.chatgpt-projects/g-p-6aa43ccf8750819191582c384993f2c1/`; `D/` = `~/Dropbox/Mac/Documents/Codex/`.
Sicherung `Snnn` = lokaler Branch `housekeeping/2026-11-01/<nnn>-<Kopienname>/HEAD`, dessen vollständiger Name und Spiegel im folgenden Sicherungsregister stehen. Commit = exakter ursprünglicher HEAD. `Remote` bedeutet bestätigte Erreichbarkeit eines Public-HEADs; lokale Änderungen sind damit nicht gesichert.
Papierkorb `T/` = `~/.Trash/KFB-WSA-V1146-2026-11-01/`. Ein Strich heißt: bleibt am Originalort.

| ID | Kopie | MiB vorher | Commit | Sicherung | Papierkorb | Bleibt / Ergebnis |
|---:|---|---:|---|---|---|---|
| 000 | `P/KFB-Combat-Arena-CMVPA` | 33.9 | `954f2db7484dc566e468e5ce89b0d95940d97537` | Original bleibt; nicht neu gesichert | `—` | 17 Änderungen; Arena-Zuordnung/aktive Arbeit schützen |
| 001 | `P/KFB-Stunt-Car-Race` | 116.2 | `365563b5da37c8ae971c9baa7c3ac4c7968c6bbd` | Original bleibt; nicht neu gesichert | `—` | Lokaler privater WS1-Upstream; Zugehörigkeit nicht vollständig geklärt |
| 002 | `P/KFB-Travel-Globe` | 24.5 | `bbf78434aea3ea25e3f6d2ee4e8ec673af1cf2b8` | Original bleibt; nicht neu gesichert | `—` | Privates Travel; gegenüber main divergiert; keine vollständige Remote-Zweigprüfung |
| 003 | `P/KFB-Travel-Globe-I1` | 65.5 | `a0fc2ec63a81a2babe64f0da729a8df0c9ea2cc4` | Original bleibt; nicht neu gesichert | `—` | Privates Travel; vollständiger aktueller CLI-Fetch fehlt; Zugehörigkeit offen |
| 004 | `P/asset-librarian-site` | 5.8 | `db053683305e7f4a176d1f2ebf6d5343c5284f77` | S004 | `T/copies/004-asset-librarian-site` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 005 | `P/audio-triplet-owner` | 58.5 | `dd17f2fa00d62715c48a18b83f11708dcd7aeecb` | S005 | `T/copies/005-audio-triplet-owner` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 006 | `P/audio-triplet-studio-site` | 3.0 | `d3c1df83347367ce49634a2d29972f773c322574` | S006 | `T/copies/006-audio-triplet-studio-site` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 007 | `P/kayfabizarro-audio-preintegration` | 62.6 | `10960278769636c8a60c4af6172f107fe851163a` | Remote | `—` | Gemeinsamer Git-Owner bleibt; kein automatischer Umbau des aktiven Audio-Verbunds |
| 008 | `P/kayfabizarro-clay-ssot` | 59.1 | `b7d77dedc84d7f9eb23bdf47bbe667e8eb276383` | Original bleibt; nicht neu gesichert | `—` | 7 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 009 | `P/kayfabizarro-hub-redirect` | 28.0 | `c974a1f886722fdecb89dd7bc72c308373707b5c` | S009 | `T/copies/009-kayfabizarro-hub-redirect` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 010 | `P/kayfabizarro-wsa` | 6.8 | `a067112fa411cab69eb5c62d21a317c527a11ce3` | Original bleibt; nicht neu gesichert | `—` | 107 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 011 | `P/kfb-production-control-site` | 1023.1 | `3d5f80b3429eade375ca2820982752a9aa6edf0c` | S011 | `—` | Unklare lokale D1-/R2-Daten in .wrangler; Code-Sicherung genügt dafür nicht |
| 012 | `P/philosophy-site` | 0.2 | `71a5b3c37ec320e4284bb4d17b84b7b23af2b151` | Original bleibt; nicht neu gesichert | `—` | Aktuelles Philosophie-Projekt vom 31.10.; bleibt |
| 013 | `P/research-atlas-work/site` | 0.2 | `4faefd6a8cb1593dea91eb5d59fce8ecedd23c21` | Original bleibt; nicht neu gesichert | `—` | Aktueller Research-Atlas-Arbeitsort; bleibt |
| 014 | `P/site-kfb-production-control` | 951.6 | `ab41d2a0e754daadebe7560efa100a9f18fef3b7` | S014 | `T/copies/014-site-kfb-production-control` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 015 | `P/site-production-hub-decisions` | 1.4 | `4987936986bdbb0a4da6333dc0985b81d89b30eb` | S015 | `T/copies/015-site-production-hub-decisions` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 016 | `P/sites/kfb-frankenstein-composer` | 0.2 | `97a9eaa6374a65dc132154eaf47bfb7bd38ba80f` | Original bleibt; nicht neu gesichert | `—` | 1 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 017 | `P/sites/kfb-hypernormalisation-curator` | 0.2 | `a25ce823ea9b3c35069e57c0184dace7be58c62a` | Original bleibt; nicht neu gesichert | `—` | 1 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 018 | `P/sites/kfb-production-control-update` | 13.1 | `cfe4c7917b90acaabd3fdc36565df2051fad0faf` | S018 | `T/copies/018-kfb-production-control-update` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 019 | `P/sites/kfb-production-hub-publish` | 0.7 | `32dcb6302b4814f264612cdd1a1b8e3a40e3ac1f` | Original bleibt; nicht neu gesichert | `—` | 1 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 020 | `P/sites/kfb-toolbox-router` | 59.9 | `53028aa47de97cf1c5791cdc72501212a5785094` | S020 | `T/copies/020-kfb-toolbox-router` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 021 | `P/sites/kfb-world-studio-mvp1` | 5.2 | `615df460fbee99561f294439d2963baa7cb2d5b5` | Original bleibt; nicht neu gesichert | `—` | 1 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 022 | `P/sites/kfb-ws1-staging` | 952.7 | `fbabbad7b8efa98c9071fccb358e4fb4788ec826` | Original bleibt; nicht neu gesichert | `—` | 4 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 023 | `P/sites/open-world-mvp-hub-current` | 1.3 | `6d9b51689c67a29b896e925fd4806e144f961ae2` | S023 | `T/copies/023-open-world-mvp-hub-current` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 024 | `P/sites/philosophie-leseraum` | 1.1 | `db615ecb0a9ef1cdffc652641ba37d456e72eb5e` | Original bleibt; nicht neu gesichert | `—` | Philosophie-Site-Zuordnung zum aktuellen Projekt offen; bleibt |
| 025 | `P/sites/surface-consolidation-control` | 951.1 | `cfe4c7917b90acaabd3fdc36565df2051fad0faf` | S025 | `T/copies/025-surface-consolidation-control` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 026 | `P/sites/surface-consolidation-hub` | 0.6 | `0de021b625166e7ec74defba56e4a00836b9d890` | S026 | `T/copies/026-surface-consolidation-hub` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 027 | `P/work/animation-library-v1-update` | 27.5 | `ad57540985609d147df8f9513da2e87bdf1a5fd1` | S027 | `T/copies/027-animation-library-v1-update` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 028 | `P/work/audio-footsteps-isolated-audit` | 97.2 | `f0ae805e4b76fd1a02e2cf6416505a836d677bec` | Original bleibt; nicht neu gesichert | `—` | 7 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 029 | `P/work/audio-footsteps-r2-v430-source` | 23.7 | `6c2b672506f9df38bf3b448dc7e3b828a56a7380` | Original bleibt; nicht neu gesichert | `—` | 13 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 030 | `P/work/audio-songs-asmr-r2` | 112.3 | `6e86082b8f950236f2d1f31cf3a930684dfaadb2` | Original bleibt; nicht neu gesichert | `—` | Aktueller Audio-R2-Owner (31.10.), verschachtelte Lieferung; bleibt |
| 031 | `P/work/audio-songs-asmr-r2/audio-delivery` | 13.9 | `8147ebf2763d6c29de0198868c10e95396c35c5c` | Original bleibt; nicht neu gesichert | `—` | Aktuelle Audio-R2-Lieferung; bleibt |
| 032 | `P/work/audio-v389-source` | 9.0 | `3e5849b0a0375664e9463a5663bbdcfec1847f4c` | S032 | `T/copies/032-audio-v389-source` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 033 | `P/work/billboard-island-integration-01` | 10.7 | `ee3fb84380ad8d3ff3f6d0f5de5c14454efe9582` | Remote | `—` | 1 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 034 | `P/work/bubbles-r101` | 13.5 | `b3963767531a32b3a4fc8806bd52effab3b2598e` | Remote | `—` | Nicht versionierte/ignorierte Belege und Skripte unter work/; nicht als Cache eingeordnet |
| 035 | `P/work/cascade-sphere-r0/game` | 976.9 | `d061549afbe52754d9860d66a957761f13776e08` | Original bleibt; nicht neu gesichert | `—` | 995 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 036 | `P/work/cascade-sphere-r0/site` | 0.1 | `UNBORN/kein HEAD` | Original bleibt; nicht neu gesichert | `—` | 3 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 037 | `P/work/chatterbox-pr357-gpt-site-fix` | 1951.2 | `6b1db4fccfc1dbb1437638160476b306e17c9ddc` | Remote | `—` | 14 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 038 | `P/work/chatterbox-pr357-gpt-site-fix-clean` | 61.2 | `9198fda5f6bc90319a55956a52ed87d784b21300` | Original bleibt; nicht neu gesichert | `—` | 3 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 039 | `P/work/claude-service-access-01` | 77.5 | `440f37d59972a581db95e8329ed954c0b88a86e3` | Original bleibt; nicht neu gesichert | `—` | Zuordnung Service-Connector-Arbeit nicht sicher; gemeinsamer Git-Verbund bleibt |
| 040 | `P/work/claude-service-connector-response` | 77.5 | `621a3bc01c09ce2f979b47c8c2380f52dd3ec103` | Original bleibt; nicht neu gesichert | `—` | Zuordnung Service-Connector-Arbeit nicht sicher; gemeinsamer Git-Verbund bleibt |
| 041 | `P/work/fb-canon-r1` | 46.7 | `afb97250a49dcc5dc0ea1ab1a82d332143b0fe6d` | Original bleibt; nicht neu gesichert | `—` | 4 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 042 | `P/work/halloween-pack-repair` | 61.9 | `10a2c5e29bf752215dadb60b23f07253f63e9d34` | S042 | `T/copies/042-halloween-pack-repair` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 043 | `P/work/hex-catalog-level-slope` | 7.1 | `6ebebf7672cc455a51a193b6a4efa9862e049cbb` | S043 | `T/copies/043-hex-catalog-level-slope` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 044 | `P/work/hub-current-source` | 77.0 | `67e08aa9dd077fe76687ef49f4b3db9878235bd8` | S044 | `T/copies/044-hub-current-source` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 045 | `P/work/hub-current-state` | 34.0 | `ba035f6477c09a2213d7b5817c3cbc8a529993da` | S045 | `T/copies/045-hub-current-state` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 046 | `P/work/hypernorm-scenelet-r2` | 383.3 | `3948fdcceba4be1d62aef7f914c6f958703fb51a` | Original bleibt; nicht neu gesichert | `—` | 3 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 047 | `P/work/hypernorm-site-upload` | 276.0 | `29ce481bc4c27a1e8f25772bdbd68a31a99cf649` | S047 | `T/copies/047-hypernorm-site-upload` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 048 | `P/work/island-mvp-r4` | 185.3 | `e31005f5cca79d675d717709a38af63aaaf339e1` | Remote | `—` | 73 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 049 | `P/work/island-mvp-r4-site` | 8.5 | `615df460fbee99561f294439d2963baa7cb2d5b5` | Original bleibt; nicht neu gesichert | `—` | 61 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 050 | `P/work/kayfabizarro-deploy-audit` | 2157.6 | `5650b6c54d8789b20ea80abe857688173d506d3b` | Remote | `—` | 20.097 vorgemerkte Löschungen/Teilcheckout + gemeinsamer Git-Owner; unverändert lassen |
| 051 | `P/work/kayfabizarro-toolbox-production-03` | 3090.2 | `9cc31312cb07bff80e160a5a8150eda067e81bb2` | Original bleibt; nicht neu gesichert | `—` | Gemeinsamer Git-Owner mehrerer verbleibender Worktrees; nicht verschieben |
| 052 | `P/work/kayfabizarro-voice-r1-source` | 59.1 | `99c749c630cfbcf11f6f6be9c2959ef54b4af150` | Original bleibt; nicht neu gesichert | `—` | 6 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 053 | `P/work/kayfabizarro-world-city-lod-r3` | 154.2 | `b50da195376ca56dd34c814945bb5ba9f34c01f6` | S053 | `T/copies/053-kayfabizarro-world-city-lod-r3` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 054 | `P/work/kayfabizarro-world-flight-clay-c0` | 160.4 | `f24bb0ac4483e6dda6d5215cfd75d99c7ad26c7b` | Original bleibt; nicht neu gesichert | `—` | 37 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 055 | `P/work/kfb-audio-adaptive-pr365` | 61.8 | `f6745cc889295dee25739647689e13431d5b651f` | Remote | `—` | 5 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 056 | `P/work/kfb-audio-interaction-states` | 4623.0 | `13c8750173e5e52af3d357f981159c9f740b032e` | S056 | `T/copies/056-kfb-audio-interaction-states` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 057 | `P/work/kfb-audio-site-host` | 0.6 | `86e8a77810351e992e073c48d8596263357029b0` | S057 | `T/copies/057-kfb-audio-site-host` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 058 | `P/work/kfb-audio-triplet-r1-site` | 2.8 | `8f472837ea94d0b6f691ec2dfff6a68e68891a01` | S058 | `T/copies/058-kfb-audio-triplet-r1-site` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 059 | `P/work/kfb-chatterbox-voice-bench` | 28.8 | `22690da11c1be76828900fa719d698f90650bea3` | S059 | `T/copies/059-kfb-chatterbox-voice-bench` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 060 | `P/work/kfb-deck-library-r1-2026-10-09` | 4714.7 | `b51238af0c8781f898484a023760012e9655c780` | Original bleibt; nicht neu gesichert | `—` | 14 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 061 | `P/work/kfb-dramatis-personae-r1/asset-site` | 10.2 | `7d1a363c7f2aaafea6e8e925d3b5c47b631fa345` | S061 | `T/copies/061-asset-site` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 062 | `P/work/kfb-tool-cleanup-r1/old-hub` | 1.5 | `fcd817798f5dbdefd444419e73dcbbded23ba8c0` | S062 | `T/copies/062-old-hub` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 063 | `P/work/kfb-toolbox-source-diag-2026-10-22` | 61.8 | `53028aa47de97cf1c5791cdc72501212a5785094` | Original bleibt; nicht neu gesichert | `—` | Gemeinsamer Git-Owner von fb-canon/toolbox-restart mit Änderungen; bleibt |
| 064 | `P/work/mvp-gpt-site-r1-2026-10-24` | 1046.1 | `ce97b8e38e19d5ed3b65a683622b7a9917837346` | Original bleibt; nicht neu gesichert | `—` | node_modules wird von aktuellem Spiel-Site-Checkout benutzt; bleibt |
| 065 | `P/work/mvp-v771-v6-auth-fix` | 412.1 | `1a634b7dd6bcc59c363b239d44c4213c57e90679` | Original bleibt; nicht neu gesichert | `—` | Aktueller geprüfter Spiel-Site-Owner v10, Head 1a634b7d; bleibt |
| 066 | `P/work/open-world-integrator-2026-10-07/receiving` | 2712.6 | `98b82377abf60b1404ff06cfff21ed1acc863f1a` | Remote | `—` | 17 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 067 | `P/work/render-r0-shared-preset` | 38.2 | `0575af2163b6526020a0cc894351f3c40977a4aa` | S067 | `T/copies/067-render-r0-shared-preset` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 068 | `P/work/resident-coworker-briefs` | 77.0 | `0445a4cdb9a67e6c64b6450413a50fd0163b9435` | Original bleibt; nicht neu gesichert | `—` | 4 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 069 | `P/work/sites/kfb-asset-librarian-v11` | 6.2 | `04a89c73927656d894e503cf7c831de66eb74355` | Original bleibt; nicht neu gesichert | `—` | 1 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 070 | `P/work/surface-consolidation` | 77.4 | `8f01af7fc38a388ba9fffa13638908165f8ccaa1` | S070 | `T/copies/070-surface-consolidation` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 071 | `P/work/toolbox-restart-r1` | 50.5 | `e98baa9ea24dafa6737b25a99255970e596e53b2` | Original bleibt; nicht neu gesichert | `—` | Unversionierte/ignorierte QA-Daten + gemeinsamer Git-Verbund; bleibt |
| 072 | `P/work/track-t3-production-briefs` | 77.1 | `0480f89e57a9669be63bfe80a85171db42b9333c` | S072 | `T/copies/072-track-t3-production-briefs` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 073 | `P/work/track-t3-rebrief` | 92.1 | `52f467f3dbac3d4b70fb76faa8cc61326b0b67ac` | S073 | `T/copies/073-track-t3-rebrief` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 074 | `P/work/v538/kayfabizarro-private-assets` | 1429.0 | `e466995404e585a0cd72bebe359246b2c0e6e995` | Original bleibt; nicht neu gesichert | `—` | Privates LFS-Roharchiv; Remote-Ancestry bestätigt, vollständiger CLI-/LFS-Abruf hier fehlt |
| 075 | `P/work/v538/remote-verification` | 1428.6 | `9791df2b1187b7df9b47cb5c7ce2b8ce09d14cdf` | Original bleibt; nicht neu gesichert | `—` | Privates LFS-Verifikationsarchiv; keine vollständige neue LFS-/Zugehörigkeitsprüfung |
| 076 | `P/work/v908-racer-jetpack` | 445.0 | `762f60f4feb8a268508ccdae380c599616c9dbe6` | Original bleibt; nicht neu gesichert | `—` | Audio-/Racer-Übergabe mit privaten ignorierten Dateien; nicht als entbehrlich klassifiziert |
| 077 | `P/work/wb2-player-01` | 72.6 | `77a9e3a263201cb5a48f7b61d6feabd75bdcc616` | Remote | `—` | 260 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 078 | `P/work/world-m2a-playable-r5` | 40.9 | `df7220331932a28865af96d8411aac630d21dff7` | Remote | `—` | 9 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 079 | `P/work/wsa-hub-update-2026-10-09` | 4004.5 | `bb10b121f5a4e0c96c93c6a3fcfa6a7368840fd4` | Original bleibt; nicht neu gesichert | `—` | Unversionierter Text + gemeinsamer Git-Owner der Deck-Library; bleibt; nur tmp_pack verschoben |
| 080 | `P/work/wsa-ton-pruefung-r1/source` | 1.0 | `UNBORN/kein HEAD` | Original bleibt; nicht neu gesichert | `—` | Unvollständiger/unborn Git-Stand + unversionierte Arbeit; bleibt |
| 081 | `P/work/wsa-ton-pruefung-r1/source/work/wsa-ton-pruefung-r1/source` | 0.1 | `UNBORN/kein HEAD` | Original bleibt; nicht neu gesichert | `—` | Unvollständiges/unborn verschachteltes Git-Verzeichnis; nicht sicher zuordenbar |
| 082 | `D/2026-09-28/hi/work/kayfabizarro-import` | 4093.6 | `916b347fea9962f6c8399f4451c74e27726ca5f6` | Original bleibt; nicht neu gesichert | `—` | 136 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 083 | `D/2026-10-06/nimm-folgende-nderungen-an-kfb-asset/work/asset-librarian-site` | 1.1 | `7e85c2ee765ee496d528bb341b079c8bf243401c` | S083 | `T/copies/083-asset-librarian-site` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 084 | `D/2026-10-06/nimm-folgende-nderungen-an-kfb-asset/work/kayfabizarro-359` | 35.7 | `131f97112e430ee746ec1913d42eddf5a5b7d1c9` | Remote | `—` | 1 lokale Änderungen/unversionierte Dateien; nicht automatisch committet oder veröffentlicht |
| 085 | `D/2026-10-06/nimm-folgende-nderungen-an-kfb-asset/work/toolbox-site` | 0.2 | `f3f7c0d31c4c3afec9badc0526041e689935b7ec` | S085 | `T/copies/085-toolbox-site` | Historische saubere Kopie; vor Verschieben Dateien/Refs geprüft |
| 086 | `D/2026-10-10/kf/work/kayfabizarro-wsa-incomplete` | 9073.9 | `dccf75cabd222d951380693d84ab88053ee7e519` | Remote | `—` | index.lock + 54.198 Änderungen/untracked; unvollständiger Checkout; bleibt unangetastet |
| 087 | `D/2026-10-18/kfb-v538-private-assets/work/source-audit` | 7.6 | `UNBORN/kein HEAD` | Original bleibt; nicht neu gesichert | `—` | Unvollständiger/unborn privater Audit-Klon; bleibt |
| 088 | `D/2026-10-28/nimm-folgende-nderungen-an-kfb-asset/work/librarian` | 322.4 | `9eb6610685b3eb795c5590765c303caf9b1a0bd3` | Original bleibt; nicht neu gesichert | `—` | Aktueller Librarian-Arbeitsort mit verbundenem Chat/Prozess; bleibt |
| 089 | `D/2026-10-28/nimm-folgende-nderungen-an-kfb-asset/work/prop-pool` | 2198.7 | `a23cac061628d95661cf3603691ca6c2fc3f4e9a` | Remote | `—` | Aktueller Prop-Pool-Arbeitsort + 2 unversionierte Dateien; bleibt |

## Sicherungsregister (ausschließlich lokal)

| ID | Spiegel unter `~/.codex/mirrors/` | Benannter Branch | Geprüfte vorhandene Dateien |
|---:|---|---|---:|
| 004 | `site--kfb-asset-librarian.git` | `housekeeping/2026-11-01/004-asset-librarian-site/HEAD` | 27 |
| 005 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/005-audio-triplet-owner/HEAD` | 180 |
| 006 | `site--kfb-audio.git` | `housekeeping/2026-11-01/006-audio-triplet-studio-site/HEAD` | 55 |
| 009 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/009-kayfabizarro-hub-redirect/HEAD` | 291 |
| 011 | `site--kfb-production-control.git` | `housekeeping/2026-11-01/011-kfb-production-control-site/HEAD` | 151 |
| 014 | `site--kfb-production-control.git` | `housekeeping/2026-11-01/014-site-kfb-production-control/HEAD` | 167 |
| 015 | `site--kfb-production-hub.git` | `housekeeping/2026-11-01/015-site-production-hub-decisions/HEAD` | 17 |
| 018 | `site--kfb-production-control.git` | `housekeeping/2026-11-01/018-kfb-production-control-update/HEAD` | 170 |
| 020 | `site--kfb-toolbox.git` | `housekeeping/2026-11-01/020-kfb-toolbox-router/HEAD` | 431 |
| 023 | `site--kfb-production-hub.git` | `housekeeping/2026-11-01/023-open-world-mvp-hub-current/HEAD` | 14 |
| 025 | `site--kfb-production-control.git` | `housekeeping/2026-11-01/025-surface-consolidation-control/HEAD` | 170 |
| 026 | `site--kfb-production-hub.git` | `housekeeping/2026-11-01/026-surface-consolidation-hub/HEAD` | 9 |
| 027 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/027-animation-library-v1-update/HEAD` | 9 |
| 032 | `site--kfb-audio.git` | `housekeeping/2026-11-01/032-audio-v389-source/HEAD` | 91 |
| 042 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/042-halloween-pack-repair/HEAD` | 689 |
| 043 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/043-hex-catalog-level-slope/HEAD` | 53 |
| 044 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/044-hub-current-source/HEAD` | 941 |
| 045 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/045-hub-current-state/HEAD` | 837 |
| 047 | `site--kfb-hypernormalisation-curator.git` | `housekeeping/2026-11-01/047-hypernorm-site-upload/HEAD` | 698 |
| 053 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/053-kayfabizarro-world-city-lod-r3/HEAD` | 1620 |
| 056 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/056-kfb-audio-interaction-states/HEAD` | 229 |
| 057 | `site--kfb-audio.git` | `housekeeping/2026-11-01/057-kfb-audio-site-host/HEAD` | 24 |
| 058 | `site--kfb-audio.git` | `housekeeping/2026-11-01/058-kfb-audio-triplet-r1-site/HEAD` | 38 |
| 059 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/059-kfb-chatterbox-voice-bench/HEAD` | 337 |
| 061 | `site--kfb-asset-librarian.git` | `housekeeping/2026-11-01/061-asset-site/HEAD` | 43 |
| 062 | `site--kfb-production-hub.git` | `housekeeping/2026-11-01/062-old-hub/HEAD` | 19 |
| 067 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/067-render-r0-shared-preset/HEAD` | 970 |
| 070 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/070-surface-consolidation/HEAD` | 984 |
| 072 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/072-track-t3-production-briefs/HEAD` | 954 |
| 073 | `georg-doc--kayfabizarro.git` | `housekeeping/2026-11-01/073-track-t3-rebrief/HEAD` | 1057 |
| 083 | `site--kfb-asset-librarian.git` | `housekeeping/2026-11-01/083-asset-librarian-site/HEAD` | 13 |
| 085 | `site--kfb-toolbox.git` | `housekeeping/2026-11-01/085-toolbox-site/HEAD` | 5 |

## Einzelne abgebrochene Downloads

Zwei Dateien aus `chatterbox-pr357-gpt-site-fix` und vier aus `wsa-hub-update-2026-10-09` liegen separat unter `T/aborted-downloads/`; die siebte blieb innerhalb der vollständig verschobenen Kopie `T/copies/056-kfb-audio-interaction-states/`. Namen, Größen und Ziele stehen im JSON-Nachweis. Alle waren alt, unindiziert, geschlossen und in Größe/Zeitstempel unverändert; keine endgültige Löschung.

## Ungeklärt / ein nächstes Gate

**WS0 ordnet die 59 behaltenen Kopien zu und benennt pro privatem/lokal verändertem Bestand genau, was gesichert oder aufgegeben werden darf. Bis dahin keine weitere Bereinigung durch diesen Auftrag.** Besonders wichtig: Dropbox-Teilcheckout mit index.lock, lokale D1-Daten, modifizierte Audio/World-/Deck-Belege, private LFS-Roharchive und geteilte Git-/Abhängigkeitsordner.

Kein neues Repo, PR, Site, Deployment, Passwort oder Merge. Keine Produkt-/Hör-/Spielabnahme aus diesem Housekeeping abgeleitet. Der Return veröffentlicht nur Code-/Speichermetadaten.
