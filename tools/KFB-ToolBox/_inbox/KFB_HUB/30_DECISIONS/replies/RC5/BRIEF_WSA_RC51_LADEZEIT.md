# WSA-Work · RC5.1 holen + Ladezeit der Stage aufschlüsseln · 13.11.

Danke für die RC5-Rückgabe (PR #49 @75881b1). Zwei Schritte, Live bleibt unverändert:

**1 · RC5.2 holen:** `site/stage` @baa8a9c764d95f11f6f27381fe346dc7f39b2795 (Stamm @9c60e8ac). Gleiches Paket wie RC5 plus reparierte Steuerung und HUD-Runde 2. Gleicher Ablauf und dieselben Prüfungen wie bei RC5 (Auslieferung 10/10, Zugang unverändert wie bei Stand 69).

**2 · Ladezeit aufschlüsseln (nur messen, nichts umbauen):** WS0 hat lokal gemessen: Bis `kfb:ready` lädt das Spiel 530 Dateien mit 85 MB. Lokal sind das 12 s, mit 80 ms Wartezeit je Datei 18 s. Die Stage braucht 84–92 s, das entspricht etwa 1 MB/s. Bitte auf der Stage in einem frischen Chrome-Profil messen:
- die reine Download-Zeit von `assets/FB_R8_probe_A11-*.glb` (7,3 MB) und einer kleinen JS-Datei, mit Zeit bis zum ersten Byte;
- ob Text-Dateien (.js, .json) komprimiert ausgeliefert werden (Content-Encoding) und welches HTTP-Protokoll läuft (h2/h3);
- ob je Datei eine Weiterleitung auf signierte Links stattfindet und wie lange sie dauert;
- aus dem Netzwerk-Protokoll bis `kfb:ready`: Anzahl Anfragen, Bytes, die 10 langsamsten Dateien.

**Fehlerzähler 3:** bitte die drei Meldungen wörtlich nennen (Erweiterung, favicon oder Spiel), damit WS0 die Spiel-Fehler beheben kann.

**Grenzen:** keine Änderung am Bündel oder Spielcode, kein Zugangsumbau, kein neuer Host.

**Rückgabe an WS0 in PR #49:** Stage-Stand-Hash, die Messwerte oben, Fehlermeldungen wörtlich. WS0 kürzt danach die Startlast im Spiel; Host-Einstellungen (Kompression, Zwischenspeicher) schlägt WSA vor, falls die Messung sie als Ursache zeigt.
