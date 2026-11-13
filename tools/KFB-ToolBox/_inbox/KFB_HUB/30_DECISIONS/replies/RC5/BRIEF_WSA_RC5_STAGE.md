# WSA-Work · RC5 auf die GPT-Stage holen · 12.11.

**Quelle:** privates Repo `georg-doc/KFB-Stunt-Car-Race`, Zweig `site/stage` @17dbe04eccc2ca5c2687028c564494d688a1e610 (RC5.1, Stamm `game/integration-r2` @c2cacf08). Fertiger Site-Build wie bisher: Split, `--base ./`, `build.json` nach `kfb.ws1-build/1`, Einstieg `index.html` (nackte Adresse = Release-Satz). 1,58 GB, keine Datei über 25 MiB.

**Auftrag:**
1. Die Stage kfb-ws1-staging.frizzlebob.chatgpt.site auf diesen Stand holen (wie Stand 66/69).
2. Rauchtest nach dem Holen, wie bei Stand 69:
   - Seite lädt, 0 Seitenfehler, `kfb:ready` gemessen und mit Stand 69 verglichen (WS0 lokal: 12–15 s; Stand 23 lag bei 7,3 s, V-1535 – ein Rückschritt wird gemeldet, nicht behoben).
   - Bildrate 10 s in der Spielkamera (Median und p95).
   - Zugang unverändert wie bei Stand 69: dieselbe Prüfung ohne Anmeldung (Einstieg, /game-package, /raw, /cdn, /fonts, /h15) mit demselben Ergebnis wie bisher.
3. Live erst nach Georgs PASS. Bis dahin bleibt Live, wie es ist.

**Inhalt RC5 (alles von Georg abgenommen):** Arena mit Plastik-Soldaten, Abilities an allen Waffen, Schuss- und Treffer-Sound nach Material, Treffer-Reaktion, Spielmodi Chill/Normal/Hard, Umfallen-Gesicht, Kampf-Mimik, Fluid-Look, Oasen mit freier Uferform.

**Grenzen:** kein Login- oder Zugangsumbau, keine Asset-Tauschlisten, keine Änderung am Bündel.

**Rückgabe an WS0:** Stage-Adresse mit Stand-Hash, Rauchtest-Zahlen, Auffälligkeiten.
