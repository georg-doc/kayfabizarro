# WSA → WS0 · V-409 übernommen und Quelldateien klargestellt · 17.10.2026

V-409 gelesen am Register-Head `1fbf4860fb4f86bf727cb93d9c52ccfad192841a`. Kein neuer Arbeitsort. ToolBox-Studio bleibt derselbe bestehende ToolBox-Owner.

## Veröffentlichungsstand

Georg hatte die exakte lesende Asset Library v16 bereits ausdrücklich freigegeben; sie wurde veröffentlicht: https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=dramatis-personae. Version `appgprj_6ac1afef08148191b62b95f184bf845e~appgver_b9a5aacc19e88191b9cd8a30c5b62f88`, Source `b82efaa017e2a5d455ca4e3fd07a3db09f7db273`, Deployment `appgdep_6ad2fbaa012c819182e44b664f32ed5d`, native succeeded. Nur Lesen, alle 13 3D-Slots gesperrt, keine Rohmodell-Vorschau.

Zur Begriffsklärung: Dies ist die vorhandene private Asset-Library-Adresse. Es wurde kein gesonderter Staging-Host angelegt; Sites bezeichnet die Veröffentlichung technisch als Production-Deployment. Keine Umstellung des Live-Spiels und keine Publikums-/Zugriffsänderung. V-409 wird nicht als Freigabe für eine andere oder öffentliche Live-Oberfläche interpretiert. Für den nächsten autorisierten UI-Stand wird der Hinweis auf „3D-Vorschau folgt“ vereinheitlicht; die 3D-Sperre bleibt bestehen. In dieser Rückmeldung kein Code-/Deployment-Update.

## Gemeinsame Module

WS0 korrigiert den bisherigen Suchstand: `kfb-stage-light.v1.js` existiert auf WS1s L3-Branch. Der frühere Return beschreibt die damals untersuchte `ws1/r3f-frame`-Quelle, nicht sämtliche Entwicklungsbranches. WSA wartet auf beide vendorable, gepinnte Pfade und Import-APIs:
- `kfb-stage-light.v1.js` aus L3;
- `kfb-figure-loader.v1.js` mit Schema-/EyeRig-/SHA256-/Clay-/Sheen-Guard und sichtbarer Verweigerung.

Reihenfolge: unmittelbar nach L3-Merge, vor dem Look-Slice. Verbraucher: Dramatis Personae und ToolBox-Studio. Keine eigene Ersatzbeleuchtung und kein paralleler Figuren-Loader. Kein WSA-Merge oder Look-Slice vorweggenommen.

## Sachliche Klarstellung zu Punkt 4

Die vier fehlenden Charakterblätter wurden von WSA **nicht** angelegt. V16 liest neun bereits vorhandene character.json-Dateien: brain_cyborg, frizzlebob, gothgirl, lady_dory, lord_hunky, mummy_a, mummy_b, norman, orc_brute. Das bestätigt der v16-Source-Snapshot aus Register `a95c491f4996bf75428e2083f571abc15dca364d`; der aktuelle Register-Tree enthält dieselben neun Dateien.

Black Knight, Demon Lord, Monstrosity und Witch stammen aus den vorhandenen 13 figure.json-Karten. Die Galerie zeigt deren Karten, aber kein erfundenes Charakterblatt: „Charakterblatt fehlt · todo“. Es gab keinen Schreibpfad in kanonische character.json-/figure.json-Dateien. Quellbeleg: `WSA_DRAMATIS_PERSONAE_R1_SOURCE/data/dramatis-personae-cache.json`, separierte Arrays characters/figures, und `WSA_DRAMATIS_PERSONAE_R1_EVIDENCE/incomplete-cards.json`. WS0 bleibt allein für die späteren vier neuen Blätter zuständig; keine eigenständige WSA-Autorenschaft.

Genau ein nächster Schritt: WS1 liefert nach L3-Merge die beiden gepinnten Module samt Import-API; WSA integriert nur diese bei unverändertem Status-/Konfliktschutz.
