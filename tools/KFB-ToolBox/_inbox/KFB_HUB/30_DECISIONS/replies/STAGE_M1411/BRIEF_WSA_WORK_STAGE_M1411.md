# Für WSA Work (Stage) · Meilenstein 14.11. abends auf die GPT-Stage holen · 14.11. (Georg, V-1713, V-1775)

**Quelle:** privates Repo `georg-doc/KFB-Stunt-Car-Race`, Zweig `site/stage` @1f798e75960143668a44ba755d8ea126a5b00b58 (Stamm `game/integration-r2` @cdf2469fa). Fertiger Site-Build wie bisher: Split, `--base ./`, `build.json` nach `kfb.ws1-build/1`, Einstieg `index.html` (nackte Adresse = Release-Schalter). Dieser Stand ersetzt den Meilenstein vom Vormittag (@b9c567a3).

**Auftrag:**
1. Die Stage kfb-ws1-staging.frizzlebob.chatgpt.site auf diesen Stand holen (wie die letzten Stände).
2. Rauchtest nach dem Holen wie zuletzt: Seite lädt, 0 Seitenfehler, `kfb:ready` gemessen (WS0 lokal am selben Bündel: 12–13 s), Bildrate 10 s in der Spielkamera (Median, p95), Zugang unverändert wie beim letzten Stand.
3. Neu zu prüfen: Das Spiel lädt keine Dateien mehr direkt von raw.githubusercontent.com/georg-doc/kayfabizarro auf den üblichen Wegen (Spiegel, V-1769) – im Netzwerk-Mitschnitt zählen.
4. Live erst nach Georgs PASS. Bis dahin bleibt Live, wie es ist.

**Inhalt (alles von Georg abgenommen):** Plastik-Soldaten mit KFB-Augen in Georgs sechs Fluff-Farben, Fluff beim Fall in Soldatenfarbe; Welt-Fluff in den hellen Kugelfarben; Figuren-Kopfschatten wie die Web-Dateien; Würfelmonster heilen oder bekämpfen (Einstellungen › Character › Cube monsters); FB-Ruhe-Mund geschlossen; Dory spricht mit vollem Mundsatz; reparierte KayKit-Idles (Beten/Klatschen/Zählen wie vorher); dazu alles vom Vormittag (Haltungen, Gesichts-Leerlauf, Jetpack Twin, Lagerfeuer, Kartenrücken).

**Grenzen:** kein Login- oder Zugangsumbau, keine Asset-Tauschlisten, keine Änderung am Bündel.

**Rückgabe an WS0:** Stage-Adresse mit Stand-Hash, Rauchtest-Zahlen, Netzwerk-Zählung kayfabizarro, Auffälligkeiten (als Kommentar in PR #49).
