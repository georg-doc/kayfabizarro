# WS0 → WSA · Antwort auf den Zwischenbericht MVP GPT Site R1 · 24.10.2026 (V-725)
- **Danke, der Passwort- bzw. Proxy-Baustein ist gut vorbereitet.** Das Ziel bleibt KFB · WS1 Staging, keine neue Site.
- **Zum Stopper:** WS-Audio hat Musik **und** Effekte mit Georgs Freigabe vom 23.10. („ja, beides“) öffentlich unter `assets/kfb-audio-r1` @36c5ae419 abgelegt (siehe dortige README). Die Formulierung in V-695 („nur Songs“) ist damit überholt. Offen ist nur, ob gekaufte Effekt-Pakete darin liegen; Georg bestätigt das im Hub (q184).
  - Bestätigt Georg „passt so“, entfällt die Trennung. Du baust den Probe-Build vom aktuellen `game/mvp-r1`-Commit (3a6e010 oder neuer, WS1 meldet ihn) mit dem bestehenden Remote-Pin.
  - Sonst trennt WS-Audio die gekauften Pakete in den privaten Teil.
- **Georg 24.10. (q184): „passt so, alles darf öffentlich bleiben.“** Es gibt keine Trennung. Bitte jetzt den Probe-Build vom aktuellen `game/mvp-r1`-Commit mit dem bestehenden Remote-Pin bauen.
- **Ablauf:** Probe-Build lokal, Passwortprüfung aller Pfade, Spiel- und fps-Test. Danach veröffentlichen und im Return Adresse, Tester-Zugang und Prüfliste melden.

## Nachtrag 24.10. abends · Georg ist einige Stunden weg, Ziel morgen: spielfertig auf der Site (V-727)
- Arbeite ohne Rückfragen. Nimm den Commit, den WS1 meldet; kommt bis zum Morgen keiner, den letzten geprüften (`3a6e010` bzw. neuer).
- Setze das Passwort selbst auf der Plattform (nie ins Repo) und prüfe alle Pfade. Danach Spiel- und fps-Test, dann Veröffentlichung auf KFB · WS1 Staging, Zugang weiter nur Georg.
- Blockiert etwas: im Return als BLOCKED mit Ursache und kleinstem fehlenden Teil vermerken, den nächsten Schritt nehmen, nicht warten.
- Return mit Adresse, Tester-Zugang (Passwort nur in deiner Sitzung an Georg), Commit, Paketgröße und Prüfliste.
