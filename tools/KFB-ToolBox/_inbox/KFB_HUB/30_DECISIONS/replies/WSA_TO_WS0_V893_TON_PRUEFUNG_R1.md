# WSA → WS0 · V-893 Ton-Prüfung R1 · 2026-10-28

**Erneute Quellen- und Auslieferungsprüfung gesichert; vollständige Hör-/Bild-Ton-Abnahme weiterhin OFFEN. Kein Gesamt-PASS.**

[Prüfbericht](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/04c5d8fc763392c23c03a782aa586a8e6cf4b660/audit/TON_PRUEFUNG_R1.md)

- Auftrag: replies/WS0_AN_WSA_V893_TON_PRUEFUNG_R1.md jetzt erreichbar und gelesen (Blob b668ae32337942f313ef093b020ab9f47a2313c7); stimmt mit der eingefügten Fassung überein. Georgs „go“ vom 28.10. gilt Lesen/Messen, nicht dem vorbereiteten Reparaturauftrag.
- Repo/Branch: georg-doc/KFB-Stunt-Car-Race · audit/wsa-ton-pruefung-r1. Verifizierter Head: `04c5d8fc763392c23c03a782aa586a8e6cf4b660`; vollständige Datei nach Schreiben inhaltsgleich zurückgelesen.
- Gemessene Quelle: `74ba4a9ca8e5c0e24ba27f2e80addb4180c3f6e9`; Audio-Pin `a0167cf4ade9db795822bf3a142937d5672824bc`. Motor R2/Schichten und neue Bewegungen berücksichtigt. 1.457 versionierte Dateien der lokalen Kopie nach Test unverändert.
- Währenddessen Quellbranch auf `6c3bd140cd69f98aa4e9cdccd634564bd4478c34` weitergelaufen (Tafellicht/Wüste/Oasen). Kein Nachweis für den neueren Weltstand; neue Oasen nicht abgenommen.
- 77 Ereigniszeilen; 9 fehlende spezifische Anschlüsse (Spielende/Tank voll bedingt), 2 fehlende Instrumentenfarben als Dialog-Unterfälle. 353 Cues, alle 325 Bank-Zuordnungen im aktuellen Index vorhanden; das ist Katalognachweis, kein vollständiger Hörtest.
- Lokaler Site-Build PASS; vier Fahrmessungen frei/Fast 4G × kalt/warm; zusätzlich 20 Aktionsfenster. engineR2 19/19 und engineVoice 14/14 Regelchecks PASS.
- Drei Hauptwerte: Grundstock kalt **30,60 s frei / 34,68 s Fast 4G**; erfasstes gehaltenes PCM **674,90 MiB** einschließlich zusätzlicher R2-AudioBuffer; Audio-p95 **0,2–0,3 ms**, Maxima **2,9–4,5 ms**. Striktes <=1 ms pro Frame nicht erfüllt; umfassendes asynchrones CPU-Profil offen.
- Einzelmessungen mit zufälligen Titeln; kein kontrollierter Vorher/Nachher-Vergleich. Speicherzählung heute um erzeugte R2-Monobuffer erweitert, kein direkter Vergleich zum alten Decode-only-Wert.
- Im freien Kaltlauf 2 gemeldete Rückfälle und 1 Musikfehler: jsDelivr-Musik spielt kurz, 844 ms später weiterer Titelwechsel; Range ERR_ABORTED. 15 Racer-Dateien tatsächlich über jsDelivr HTTP 200 geliefert. Jede Ersatzhost-Anfrage einzeln im Bericht. Andere drei Läufe ohne Musikfehler/Fallback.
- Zusätzlicher Nachweis: Schrittzähler bei Gehen/Rennen/Seitwärts/Rückwärts; Sprung/Landung der Figur, Kampfstarts, Bodenwelle und Bremse; Ausstieg erreicht foot, Figurenflug danach fly. Passende H01-Landestarts nahezu zeitgleich mit M2-Landing plus 5 ms Scheduling. Kein menschliches Ohrurteil daraus ableiten.
- Spiel, Audiodateien, Pins und Deployments unverändert; lediglich Auditdatei aktualisiert. Höchstens drei Vorschläge im Bericht; keine Reparatur, kein PR/Merge.

**Nächstes Gate:** synchroner Bild-/Tondurchgang der OFFEN-Zeilen am eingefrorenen Stand durch WS0 mit benanntem Hörprüfer; Ernte/seltene Fahrfiguren/Welt-/Dialogereignisse noch nicht vollständig reproduziert. Der Bericht ist keine abgeschlossene vollständige Spiel-Ton-Abnahme. Georg muss aktuell keine neuen Sounds auswählen oder entscheiden.
