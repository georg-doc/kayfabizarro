# Claude Design Brief · BODY-02

## Ziel

Erweitere die bestehende **KFB ToolBox Production-03** um einen klar begrenzten Body-/Surface-Bereich für Material, Farbe, Lichtstimmung und Character-Oberflächen. Die aktuelle ToolBox ist die Arbeitsfläche; baue keine neue App und kein alternatives Interface.

## Source Lock

- Empfänger: `tools/KFB-ToolBox/production-03/`
- Stage-Verpackung: `kfb-hub/stage/toolbox/production-03/`
- Basiszustand: P03-ADOPT-01
- geschützt: bestehendes Layout, Studio/Animation/Rigging-Tabs, Import/Export, 33/33-Selbsttest, EyeRig, Mouth, FrizzleBob Graft, Pose/Motion-Owner.

## Genau dieser Funktionsslice

Ergänze innerhalb des bestehenden **Studio → Body**-Bereichs:

1. **Materialfamilie**: Original / Clay / später offen für Craft-Materialien;
2. **Oberflächenmaßstab**: Character / Mittelgrund / Großobjekt – keine Einheits-Textur für alle Größen;
3. **Farbgruppe**: vorhandene Materialfarben editieren, ohne Mesh-/Rig-Identität zu verlieren;
4. **Lichtstimmung zum Prüfen**: neutral, Tag, Abend, Nacht-Arbeitslicht;
5. **Character-Zonen**: Haut/Fell, Kleidung, Haare, Ohren und optionale Accessoires getrennt adressierbar, sofern der geladene Actor diese Zonen wirklich besitzt;
6. **Import/Export**: BODY-02-Werte bleiben im bestehenden ToolBox-Profil erhalten.

Cube Pets, FrizzleBob Driver und mindestens ein KayKit-Character müssen mit denselben Controls prüfbar sein, ohne dass sie auf dieselbe Materialstruktur gezwungen werden.

## UI-Regeln

- Bühne bleibt dominant; Notes/Diagnose standardmäßig geschlossen.
- Keine riesigen Erklärungstexte, kein generisches Dashboard, kein neuer Header.
- Regler nur zeigen, wenn sie für den aktuellen Actor wirken.
- Neue Gruppen in das vorhandene Akkordeon-/Control-System einpassen.
- „Every letter/pixel has to pay rent“.

## Harte Grenzen

- keine neue ToolBox-Homepage;
- keine Kamera-, Renderer- oder Bewegungs-Engine ersetzen;
- keine Clay-Verformung des Rigs erfinden;
- keine zweite Face-/EyeRig-/Mouth-Logik;
- keine Änderung an Combat, World, Racer oder Travel;
- keine Fake-Textur und kein stiller ästhetischer Fallback;
- kein Löschen oder Umsortieren vorhandener Funktionen.

## Abgabe

Vollständiger editierbarer Session Cut mit:

- App + allen relativ referenzierten Modulen;
- `START_HERE.md`, `RETURN.md`, `TEST_REPORT.md`, `SOURCE.json`, additivem `CHANGELOG.md`;
- Liste jeder geänderten Datei;
- mindestens je ein Belegbild für FrizzleBob, KayKit und Cube Pet;
- Probleme zuerst, keine Erfolgssprache ohne Test.

## Tests

- frischer HTTP-Boot;
- bestehender Selbsttest weiterhin 33/33;
- Profil speichern → neu laden → BODY-02-Werte identisch;
- Actor-Wechsel ohne Materialübersprechen;
- Desktop und schmale Ansicht;
- 0 Page Errors, 0 fehlgeschlagene lokale Assets.

Stoppe nach BODY-02. Kein BODY-03 und keine Veröffentlichung.
