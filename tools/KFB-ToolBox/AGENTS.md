# ToolBox · Arbeitsregeln

Geltungsbereich: `tools/KFB-ToolBox/`. Zuerst START_HERE und aktuellen Return lesen.

- Quellen und bestehende Funktionen übernehmen, nicht nachbauen. Zentralen `skills/session-entry-use-what-works_v1.md` am tatsächlich vorhandenen Pfad lesen; historische Canonical-Header erst verifizieren.
- Bestehenden Eingang vom 13.09. nicht überschreiben, umbenennen oder beim Aufräumen entfernen.
- Keine Runtime-Änderungen in Travel, Combat, Stunt oder Wissens-Pilli durch diesen Auftrag. Diese Projekte bleiben eigene Implementation-SSOTs.
- Original-Module sind Authoring-Quelle; reproduzierbare Bundles sind Ausgaben. Kein dauerhaft parallel gepflegter HTML-/Modul-Fork.
- Ein Actor hat einen Body-/Head-/Eye-/Mouth-Owner. Ein animierter skinned Actor höchstens einen zuständigen Mixer; CapsuleCarl benötigt nicht automatisch ein Skelett oder einen Mixer.
- WIP-Config ist keine Georg-Abnahme. Keine Farbwerte, Posen oder Default-Waffen still korrigieren.
- Bestehendes `kfb.pets/1` verlustfrei übernehmen. Ein großer Actor/Role/Fit-Schema-Umbau ist nicht Voraussetzung von T1.
- UI: Lesbarkeit zuerst; normaler Webfont mit System-Fallback. Kein Special Elite, Fonteys oder sonstiger Brandfont in Bedienelementen. Artwork/Logos bleiben getrennt.
- Messungen dürfen keine fremden Sessions/Presets speichern. Kein `localStorage.clear()`.
- Keine Font-Binaries, Tokens, privaten Reportkopien oder Zugangsdaten in Übergabe-ZIPs. Keine private Quelle ungeprüft öffentlich spiegeln.
- Keine Browser-, Audio-, Roundtrip- oder Veröffentlichungs-PASS ohne benannte Prüfung am konkreten Stand.
- Arbeitsbranch und reviewbarer PR für Umsetzung; Merge-Autorität aus dem aktuellen Projektauftrag. T1-Look/Feel braucht Georg-Abnahme, reine Doku-/Routineänderungen nicht automatisch Freeplay.
- Changelog additiv; erledigte Jobs vollständig nach `_inbox/archiv/`, ersetzte Releases nach `_archive/` erst mit verifizierter Herkunft und Rückweg. Keine aktive Referenz still brechen.
