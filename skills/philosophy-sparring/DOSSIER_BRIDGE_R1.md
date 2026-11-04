# Brücke zu bestehenden KFB Author/Worldview Dossiers

Status: **SOURCE INVENTORY + ADAPTER PROPOSAL** (keine Migration, kein gemeinsamer Runtime-Owner)  
Datum: 2026-10-31  
Owner des philosophischen Skills: skills/philosophy-sparring  
Owner bestehender KFB Dossiers: unverändert, die bestehenden Forschungs-/Dokumenteigner.

## Bestehender Donor-Bestand (bestätigte Metadaten/Struktur)

Im verbundenen Google Drive sind mehrere Dokumente unter „KFB Author Dossier“ nachweisbar, darunter konsolidierte Fassungen zu Jason Reza Jorjani, Kurt Metzger, Catherine Austin Fitts, Joseph P. Farrell, Christopher Knowles, Jan Irvin und weitere. Diese Fundliste ist ein **Metadaten-Inventar**, kein öffentlich freigegebener Textbestand.

Zwei Dokumente wurden nur **strukturell** gelesen:

- „KFB Worldview Dossier: Kurt Metzger – Golden Test 01“: Perspektiven A/B, Fundamental Ontology & Cosmology, Actors & Hierarchies, Argumentation & Mechanics, Performance Guidelines.
- „KFB Author Dossier: Jason Reza Jorjani (Updated & Consolidated)“: Epistemic Core & Ontology, Core Mechanics & Vocabulary, Performance & Triplet Layer, Inter-Author Matrix.

**Wichtig:** Die vorhandenen Dossiers enthalten teilweise ausdrücklich dargestellte Weltsichten, Performance- und Satirevorgaben. Ihr Inhalt ist *Material über Positionen*, keine automatische Bestätigung ihrer Wahrheit. Kein Dossier wurde in diese öffentliche Repo-Struktur kopiert; private Dokument-IDs und Freigabelinks bleiben hier draußen. Die GitHub-Code-Suche im öffentlichen Repo lieferte keinen sicheren kanonischen Dossier-Pfad, daher keine erfundene GitHub-SSOT-Zuordnung.

## Wiederverwendbarer Forschungs-Kern (nicht die Präsentationsschicht)

Für später individuell freigegebene Dossiers einen schmalen gemeinsamen **Research Core** erzeugen:

- Identität: Autor, Name, Lebensdaten **nur sofern verifiziert**, Kontext, Perspektive, ggf. veröffentlichte Edition.
- Bibliografie: Werk, Erstpublikation, verwendete Ausgabe/Übersetzung, Standort oder dauerhaftes Quell-URL.
- Primärthesen: `claim_id`, möglichst genaue Fundstelle, Belegstatus A/B/C/D, sinngemäße Wiedergabe.
- Terminologie: Begriff im Original, Übersetzung, konkurrierende Bedeutungen.
- Argumentationskarte: Voraussetzungen, stärkstes Argument, berechtigte Einwände, mögliche Repliken, offene Widersprüche.
- Traditions- und Bezugsmatrix: Beziehungen zu anderen Denkern mit **Typisierung** (expliziter Einfluss / Analogie / Kontrast / nicht belegt).
- Offene Forschungsfragen, letzte Quellenprüfung und notwendige nächste Lektüre.

Anschluss-Adapter (später, **nicht implementiert**):

1. **Philosophy Adapter:** textnahe Interpretation, wohlwollende Gegenprüfung, Quellenstatus und argumentativer Vergleich.
2. **KFB Deck/Worldview Adapter:** kuratierte fiktionale oder satirische Performance aus freigegebenem Material mit eigener Stimme, dramaturgischem Kontext und Quellenkennung; **kein Import als Wahrheit**.
3. **KFB Game Adapter:** erst später und nur über bestehende NPC/ChatterBox/Deck-Owner; kein Dialogruntime-Eigentum in diesem Skill.

## Kandidat für ein maschinenlesbares Dossier-Feldschema (PROPOSAL, NICHT CANON)

```json
{
  "dossier_id": "author-short-id",
  "status": "RESEARCH",
  "source_owner": "to-be-resolved",
  "author_name": "Source-backed name",
  "primary_works": [],
  "claims": [
    {
      "claim_id": "C001",
      "paraphrase": "Claim only, no manufactured quote",
      "citation": {"work": "", "locator": "", "edition": ""},
      "evidence": "C",
      "interpretation": "",
      "counterarguments": [],
      "verification_date": null
    }
  ],
  "relationships": [],
  "rights": {"may_publish_text": false, "may_reuse_for_kfb": false}
}
```

Das Schema ist **Draft**, kein neuer kanonischer Registry-Eintrag.

## Forschungspriorität

Zunächst Themen/Autoren aus freiwillig bereitgestellten Essays ableiten. Erst dann punktuell geprüfte Primärquellen sammeln und auf die bestehenden KFB Dossiers verweisen; nicht blind kopieren. Durch Edition und `claim_id` können spätere Karten-/Spieladaptionen Herkunft beibehalten. Der kreative KFB-Satire-Layer bleibt ausdrücklich separat.
