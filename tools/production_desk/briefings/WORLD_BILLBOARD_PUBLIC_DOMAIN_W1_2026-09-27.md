# WORLD-BILLBOARD-PD-W1 · lebende Medienfläche in der KlayfaBizarro-Welt

## Ziel

Eine vorhandene KFB-Billboard-/Monitor-Fläche als lebenden Umweltbaustein in die World-M2-Stadtzelle einsetzen. Kein neues Billboard-Design und keine neue Medienbibliothek bauen.

## Source Lock

- akzeptierter 3D-Körper / Front-Rear-Verhalten: B2a PR `#199`, accepted head `07da4adfd1de293d03682d1af90a01df2a1eba19`, runtime head `89065825448846beb2649082fc0c1bf25df20ccb`;
- akzeptierter Kompositionsdonor: `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H4 - Hex Assets Worldbuilding/kfb-billboard-hypernorm-h4_2026-09-26/src/KFB Billboard Kaleidoscope H4.dc.html`;
- H4-Handover: `.../HANDOVER_WSA.md`;
- sicherer Medienbestand: PD-POOL-R3, main integration `b133e66c4f8cc191501da504ebeceea67c6b4317`, Registry publication `6457d0376d7577e2719cab92d482c9104157c4c8`;
- erster Pool umfasst exakt vier bewiesene Objekte: Met 86434, AIC 24645, Commons `Silent film.svg`, Internet Archive `TheGeneral1926` Item Tile.

Die 33 LoC-Platten im H4-Prototyp tragen `RIGHTS NOT_VERIFIED` und sind für diesen öffentlichen Runtime-Slice gesperrt.

## Umsetzung

1. H4-Kompositor aus der Design-Component in ein kleines Modul lösen; keine iframe-Einbettung.
2. Genau einen Taktgeber und einen Canvas verwenden. Die vorhandene 3D-Tafel konsumiert das Canvas als `CanvasTexture`.
3. Kandidaten werden aus dem bestehenden Registry-/Pool-Vertrag geliefert; das Modul besitzt keine zweite Asset-Liste.
4. Der erste World-Beweis nutzt nur die vier verifizierten Pool-Objekte und ihre bestehenden Rechtebelege.
5. Billboard in der Stadtzelle so platzieren, dass es aus Ground, Drive und Flight erkennbar ist, ohne Straße, Gehweg oder Kamera zu blockieren.
6. Rückseite bleibt der vorhandene Körper. Beim Verlassen/Entfernen werden Animation, CanvasTexture und Medien sauber freigegeben.

## Darstellung

H4 darf Rhythmus, Schnitte, Ebenen, Typografie, Palette und deterministische Unähnlichkeitsauswahl liefern. Der B2a-Körper, seine Front/Back-Orientierung und sein Face-Owner bleiben unverändert. Der Clay-World-Host darf nur Sockel/Rahmenmaterial an die Umgebung angleichen; die Medienfläche bleibt lesbar.

## Optionale Interaktion

Der erste Beweis ist eine selbstlaufende Umweltfläche. Später darf `E · Anzeige ansehen` die bestehende Medienansicht oder einen bereits registrierten Modus öffnen. Das Billboard führt dafür kein eigenes Eingabesystem ein.

Ein zusätzlicher Modus `CREATOR_KUDOS` darf KayKit/Kay Lousberg, Kenney und weitere nachweislich verwendete Quellen würdigen. Er konsumiert ausschließlich das gemeinsame Credits-Manifest. Satirische Werbeslogans stehen getrennt von der unveränderten Fakten-/Lizenzzeile; keine Namen, Lizenzbegriffe oder Links werden für einen Gag umgeschrieben.

## Prüfung

- echte World-M2-Szene: Ground, Drive und Flight;
- Front, 3/4 und Rückseite;
- nur 4/4 freigegebene Pool-Objekte, jedes mit auflösbarem Registry-/Rechtebeleg;
- deterministischer Seed und stabiler Moduswechsel;
- kein Doppelticker, kein zweiter Renderer, keine CORS-Abhängigkeit zu den gesperrten LoC-Platten;
- schmale Ansicht, Seiten-/Assetfehler 0;
- Bildrate und Speicher vor/nach Mount/Unmount dokumentieren.

## Stop / Quarantäne

Wenn Medienladen, CORS oder Leistung fehlschlagen, das Billboard-Modul isoliert auf HOLD setzen und den Travel-M2-Kernloop weiterführen. Keine weiteren Pool-Assets, kein Rechte-Raten und kein H4-Rewrite in diesem Slice.
