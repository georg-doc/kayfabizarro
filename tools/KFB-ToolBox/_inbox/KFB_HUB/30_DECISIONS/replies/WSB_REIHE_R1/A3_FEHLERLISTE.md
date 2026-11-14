# Fehlerliste · site/stage @84acfcd1 (Build 58b070e6) · Mac mini · 14.11.2026

| Lauf | Seitenfehler | Konsolenfehler | Abrufe |
|---|---|---|---|
| A · nackte Adresse (Release-Satz) | 0 | 0 | 0 (Erstlauf: 4 × abgebrochen `kfb-songs/chicha_de_maiz.m4a`) |
| B · Release-Satz + debug | 0 | 1 (404) | 1 × 404 `/raw/52adc8f1…/media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png`; dazu abgebrochene Song-Abrufe `kfb-songs/*.m4a` (`net::ERR_ABORTED`) |

- **404 Kartenrückseite (nur mit debug):** `/raw/52adc8f139a08eb0ea4735e56415ba8056948a6a/media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png` fehlt im Bündel. Er tritt in allen drei Läufen auf; das ist der einzige echte Fehler.
- **Abgebrochene Song-Abrufe** (`ERR_ABORTED`, wechselnde Titel: chicha_de_maiz, cairo_hijaz, 5_6_dark_carnival_waltz, world_african_sunset): Das Musiksystem bricht beim Titelwechsel bzw. stummen Autoplay die laufende Anfrage ab. Kein 404, vermutlich harmlos. Gemeldet, weil es in der Abrufliste steht.
