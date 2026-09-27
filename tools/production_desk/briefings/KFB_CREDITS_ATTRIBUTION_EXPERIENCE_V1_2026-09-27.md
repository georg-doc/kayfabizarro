# KFB-CREDITS-ATTRIBUTION-EXPERIENCE-V1 · Kudos, Ausstellung und Abspann

## Leitidee

Credits sind kein juristischer Restbildschirm, sondern Teil der KFB-Welt: liebevolle, satirische Würdigung kreativer Freigeister — mit einer sachlich unveränderten Quellenzeile darunter.

Humor gehört in Titel, Inszenierung und KFB-Kommentar. Creator-Name, Werk/Pack, Lizenz, Pflichttext und Quelllink bleiben korrekt, überprüfbar und nicht ironisch verfremdet.

## Eine Quelle, drei Ausgaben

Ein gemeinsames Credit-Manifest wird aus Asset Registry, vorhandenen Lizenzdateien und Public-Domain-Sidecars erzeugt. Es speist:

1. **In-World-Tafel:** kleine Museums-/Ausstellungstafel bei einem besonderen Landmark, Modell oder Kunstobjekt. `E · Herkunft ansehen` öffnet eine kompakte Ansicht.
2. **Billboard Creator Spotlight:** selbstlaufende kurze Kudos-Spots im vorhandenen Billboard-System, zwischen normalen Mediensequenzen.
3. **Showreel-Abspann:** animierte Credits mit einem repräsentativen, tatsächlich verwendeten Asset pro Pack/Familie und optionalem Link zur vollständigen Liste.

Eine vierte, nüchterne vollständige Credits-Liste bleibt über Hub/Pause/Abspann erreichbar und ist die barrierearme Referenz.

## Credit-Datensatz

Pro verwendeter Quelle mindestens:

- stabile Asset-/Pack-ID;
- Creator-/Studio-Name aus der belegten Quelle;
- Pack-/Werkname und Version, sofern belegt;
- Lizenzname und Lizenzlink;
- Quell-/Creator-Link;
- `attributionRequired` ja/nein;
- unveränderte Pflichtzeile, falls erforderlich;
- freiwillige Kudos-Zeile, falls CC0/Public Domain;
- repräsentatives, tatsächlich verwendetes Asset oder Vorschaubild;
- Einsatzorte im Spiel;
- Registry-/Sidecar-/Lizenzdatei als Beleg.

Keine Felder werden aus Ordnernamen geraten. Fehlende Fakten ergeben `SOURCE_REQUIRED`, nicht einen erfundenen Credit.

## Erste Creator-Gruppen

- **KayKit / Kay Lousberg:** vorhandene Repo-Belege führen geprüfte Packs als CC0. Freiwillige prominente Würdigung, beispielsweise mit einem verwendeten Character-, Gebäude- oder Dungeon-Modell.
- **Kenney:** vorhandene Pack-Overviews führen geprüfte Packs als CC0. Freiwillige Würdigung mit tatsächlich verwendetem Track-, Fahrzeug- oder Prop-Asset.
- **Tiny Treats und weitere Creator-Linien:** erst nach exakter Registry-/Lizenzprüfung benennen; keine Vermutung über Person, Beziehung oder Lizenz.
- **Public-Domain-Pool:** gemeinfreie/CC0-Objekte als freiwillige Kudos; CC BY mit vollständiger Pflichtnennung. Der bestehende `CREDITS.md`-/Sidecar-Vertrag bleibt Quelle.
- **Code-, Musik-, Font- und Tool-Beiträge:** nach demselben Belegprinzip, aber getrennt nach Beitragstyp statt in die 3D-Pack-Liste gemischt.

## Ton und Beispiele

Erlaubt ist eine augenzwinkernde KFB-Überschrift wie „Kay Lousberg — amtlich bestellter Weltbausteinlieferant“ oder „Kenney — in diesem Bezirk stehen mehr seiner Straßen als echte“. Direkt darunter folgt eine nüchterne Zeile wie `KayKit <Packname> · Kay Lousberg · CC0 · <Quelle>`.

Die Beispiele sind Tonvorgaben, keine finalen Texte. Finale Namen, Packtitel und Links werden aus dem Manifest gezogen.

## In-World-Verhalten

- Tafeln stehen neben ausgewählten Landmarken, nicht neben jedem Baum oder Stein.
- Fokus über das gemeinsame `E`-/`INTERACT`-System; keine eigene Eingabelogik.
- Kurze Ansicht im Sichtfeld, vollständige Details auf Wunsch; Gameplay bleibt pausierbar oder frei.
- Billboards dürfen Credits als satirische Werbung inszenieren, müssen aber Pflichtangaben lesbar und unverändert zeigen.

## Abspann

- nach einem Run, über Pause/Hub oder als frei besuchbares kleines KFB-Kino startbar;
- gruppiert nach `World & Characters`, `Vehicles & Tracks`, `Props & VFX`, `Audio & Music`, `Art & Archives`, `Code & Tools`;
- pro Hauptquelle ein repräsentatives Asset als kleine Bühne/Turntable/Animation;
- danach vollständige Textliste und Export (`CREDITS.md` oder JSON) aus demselben Manifest;
- überspringbar, fortsetzbar und ohne Netzwerkzwang.

## Prüfung

- 100 % der sichtbaren Einträge besitzen einen auflösbaren Beleg;
- alle `attributionRequired`-Einträge erscheinen vollständig in In-Game-Liste und Abspann;
- keine doppelten Creator/Pack-Zeilen trotz mehrfach verwendeter Assets;
- repräsentative Assets stammen wirklich aus dem genannten Pack und werden tatsächlich verwendet;
- schmale Ansicht, Tastatur/Touch, Offline-/Fehlerfall und Export;
- Satire und Fakten sind visuell unterscheidbar.

## MVP-Grenze

Für World M2 genügen: ein `CREATOR_KUDOS`-Billboard, eine anklickbare Landmark-Tafel und ein kurzer Abspann-Prototyp für KayKit, Kenney sowie die vier PD-POOL-R3-Objekte. Tiny Treats und weitere Quellen kommen hinzu, sobald ihre konkreten Lizenz-/Registry-Fakten bestätigt sind. Fehlende Credits blockieren ein Asset mit Pflichtnennung, aber nicht den gesamten Travel-Kernloop.
