# WSA → WS0 · V-893 Ton-Prüfung R1 · 2026-10-27

Status: **Quellenprüfung und vollständige lokale Site-Messläufe gesichert; Hör-/Bild-Ton-Abnahme teilweise OFFEN. Kein Gesamt-PASS.** Der vollständige Auftrag liegt inzwischen als Nutzereinfügung vor; der frühere 404 ist kein Blocker mehr.

Bericht: [audit/TON_PRUEFUNG_R1.md](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/f752c31279af2d8ff9297af15b0c36b32848b036/audit/TON_PRUEFUNG_R1.md)

- Repo/Branch: `georg-doc/KFB-Stunt-Car-Race` · `audit/wsa-ton-pruefung-r1`.
- Exakter zurückgelesener Audit-Head: `f752c31279af2d8ff9297af15b0c36b32848b036`; Bericht vollständig inhaltsgleich zurückgelesen. Vergleich zur Quelle: ausschließlich diese Audit-Datei hinzugefügt.
- Gemessene Quelle: `game/proc-world-ws0` @ `ceb1584db457171379bc914541fb84e9e0a52fb1`; Audio-Pin `c37138a97c166d0790757ec3a888f2401c7ad5d9`. 1.435 versionierte Dateien nach Prüfung unverändert.
- Abschlussabgleich: Quellbranch inzwischen `9c0289a6b90b08c4c98047acfbabc1b9a0ec9cfe`, ausschließlich Demo-Sandweg-Sichtbarkeit (V-896); kein geänderter Audioaufruf/Pin. Neuer Build nicht erneut gemessen.
- 72 Ereigniszeilen; 9 fehlende spezifische Anschlüsse (davon Spielende/Tank voll bedingt), 2 fehlende beschlossene Instrument-Klangfarben als Dialog-Unterfälle. Vorhandene Aufnahmen zuerst geprüft. NPC-/schwere Schritte bereits produziert; Interaktionssounds lokal vorhanden, teils nicht im Remote-Katalog.
- 349 Cue-Einträge inventarisiert; 321/321 Bank-Cues katalogbelegt und isoliert startfähig. Vorhandene Mixerchecks 51/51 PASS mit dokumentierten übersprungenen Cacheprüfungen.
- Vollständiger lokaler Site-Build erfolgreich, vier 60-Sekunden-Fahrmessungen (frei/Fast 4G, kalt/warm), zusätzliche 18 Aktionsfenster. Keine Browserfehler. Schalten, Fehlzündung, Boost, Schuss, Explosion und spätere Landungen durch Starts belegt; keine menschliche Hörabnahme.
- Drei Hauptwerte: Grundstock kalt **11,50 s frei / 28,84 s Fast 4G**; dekodiertes PCM **677,27 MiB** in der Fahrserie (683,59 MiB nach zusätzlichen Aktionen); Audio-Frame-p95 **0,4–0,5 ms**, Spitzen **bis 9,7 ms**. Das strikte Ziel <=1 ms in jedem Frame ist nicht bestanden; vollständiges CPU-Profil offen.
- Kalt erster Titel: firstMs 6043 / 1132 ms nach startMusic; separat Eingabe→playing 7914 / 5401 ms. Unterschiedliche zufällige Titel, keine kausale Aussage zugunsten der Drosselung.
- Erste 60 Sekunden: 490–561 Audioanfragen, 30,4–34,6 MiB vollständig gemessener Transfer. Proxycache warm ohne Upstream, aber keine nachgewiesenen Browsercache-Hits. Site-Umschreibung kann beide Fetch-Hosts auf denselben Raw-Proxy zurückführen. Bericht enthält Grenzen und höchstens drei Auslieferungsvorschläge.
- Keine Spiel-/Audioänderung, keine generierten Sounds, kein Deploy, Merge oder PR. Lokaler Site-Build ist keine veröffentlichte Site-Abnahme.

**Ein nächstes Gate:** WS0 nimmt die OFFEN-Zeilen am identischen Quellstand mit synchronem Bild/Ton ab, besonders erste Aktionen vor Ladeende sowie seltene Fahr-/Welt-/Dialogereignisse. Kein neuer Auftrag oder lauffähiger Grundstand muss dafür erst beschafft werden. Georg muss aktuell nichts entscheiden.
