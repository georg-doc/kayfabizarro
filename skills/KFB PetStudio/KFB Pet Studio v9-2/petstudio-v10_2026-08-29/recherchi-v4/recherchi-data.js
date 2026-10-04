/* recherchi-data.js — einzige Datenquelle für DocCheck Recherchi v1.
   Inhalt lebt hier, nie im Modul. Demo-Daten: erfunden, aber redaktionell plausibel.
   window.RECHERCHI = { FACH, THEMEN, QUELLEN, PRESETS, FACES, GOLDEN, SCANSTEPS, BEISPIELE } */
(function () {

  /* Fachgebiete: Pastellfläche + dunkler Text (Briefing §12) */
  const FACH = {
    innere:   { l: 'Innere Medizin', bg: '#E6EDF6', ink: '#2B4A73', top: 1 },
    allgemein:{ l: 'Allgemeinmedizin', bg: '#E3F0DC', ink: '#3F6B2A', top: 2 },
    chirurgie:{ l: 'Chirurgie',     bg: '#EDE6F2', ink: '#5A3A73', top: 3 },
    anaesth:  { l: 'Anästhesiologie', bg: '#DDEDEA', ink: '#1D5C57', top: 4 },
    kardio:   { l: 'Kardiologie',   bg: '#FBE0E7', ink: '#8C2340', top: 5 },
    gyn:      { l: 'Gynäkologie',   bg: '#FCE0F0', ink: '#8E2A63' },
    paed:     { l: 'Pädiatrie',     bg: '#FDEBDA', ink: '#8A5A15' },
    radio:    { l: 'Radiologie',    bg: '#E4E7EB', ink: '#3C464F' },
    psych:    { l: 'Psychiatrie',   bg: '#E2E4F7', ink: '#3B3F8F' },
    hno:      { l: 'HNO',           bg: '#DCEFF7', ink: '#1F5A73' },
    augen:    { l: 'Augenheilkunde', bg: '#DAEEEC', ink: '#1D5C57' },
    pflege:   { l: 'Pflege',        bg: '#ECEEDA', ink: '#5E6428' },
    onko:     { l: 'Onkologie',     bg: '#F0E1F2', ink: '#6B2E74' },
    neuro:    { l: 'Neurologie',    bg: '#E9E3F8', ink: '#4C3A8C' },
    mental:   { l: 'Mental Health', bg: '#E2E4F7', ink: '#3B3F8F' },
    ortho:    { l: 'Orthopädie',    bg: '#DEEAF9', ink: '#2A568F' },
    derma:    { l: 'Dermatologie',  bg: '#DCEFF7', ink: '#1F5A73' },
    uro:      { l: 'Urologie',      bg: '#DAEEEC', ink: '#1D5C57' },
    apo:      { l: 'Apotheke',      bg: '#E3F0DC', ink: '#3F6B2A' },
    ernaeh:   { l: 'Ernährung',     bg: '#ECEEDA', ink: '#5E6428' },
    diabeto:  { l: 'Diabetologie',  bg: '#FBEBD2', ink: '#8A5A15' },
    infekt:   { l: 'Infektiologie', bg: '#FAE2DA', ink: '#8B3C22' },
    politik:  { l: 'Politik',       bg: '#E4E7EB', ink: '#3C464F' },
    vet:      { l: 'Tiermedizin',   bg: '#EDE4DA', ink: '#6A4A2C' }
  };

  const THEMEN = [
    {
      id: 'vitd',
      fach: 'ortho', angle: 'Dogma wackelt', score: 12, max: 15,
      evidenz: 3, diskussion: 2, aktuell: 'vor 6 Tagen', social: null,
      title: 'Vitamin D und Sturzprophylaxe: Empfehlung ohne Basis?',
      dreisatz: {
        p: 'Calcium und Vitamin D gelten in der Sturzprophylaxe als Standard.',
        b: 'Neue Auswertungen finden den Effekt nicht mehr.',
        f: 'Wem rät man jetzt noch wozu?'
      },
      warumJetzt: 'Die Neubewertung fällt in die Vorbereitung der geriatrischen Leitlinien-Novelle, die Empfehlung steht damit konkret zur Disposition.',
      talking: [
        'Der Effekt verschwindet, sobald Studien mit unklarer Verblindung ausgeschlossen werden.',
        'Substituiert wird trotzdem breit, oft ohne Spiegelbestimmung und ohne Endpunkt.',
        'Für die Praxis bleibt die Frage, ob Absetzen aktiv kommuniziert werden muss.'
      ],
      quellen: [
        { t: 'Fall prevention supplementation: reanalysis of pooled trials', src: 'JAMA Intern Med', id: 'doi:10.1001/xxxx.2026.0142' },
        { t: 'Vitamin D status and functional outcome in the elderly', src: 'Lancet Healthy Longev', id: 'PMID 40118822' },
        { t: 'DVO-Leitlinie Osteoporose, Kapitel Supplementierung', src: 'AWMF 183-001', id: 'Stand 2025' }
      ],
      debatte: [
        { t: 'Geriatrie-Fachgesellschaft widerspricht der Reanalyse', src: 'Ärzteblatt, Leserdebatte' },
        { t: 'Hausärzte melden Verunsicherung in der Sprechstunde', src: 'Fachforum, 240 Beiträge' }
      ],
      fehlt: 'Zahlen zur tatsächlichen Verordnungspraxis in Deutschland, und ob die Reanalyse Heimbewohner mit eingeschlossen hat.',
      gegen: 'Die Reanalyse rechnet Studien heraus, die für die betroffene Altersgruppe die einzigen belastbaren sind. Wer nur noch drei Studien übrig lässt, findet zwangsläufig keinen Effekt mehr.',
      haerte: [
        'Wie hoch war der Anteil an Teilnehmern mit echtem Mangel?',
        'Wird zwischen Sturzhäufigkeit und Fraktur als Endpunkt getrennt?',
        'Gilt die Aussage auch für institutionalisierte Patienten?'
      ],
      headlines: [
        { a: 'sachlich zugespitzt', t: 'Vitamin D: Warum die Sturzprophylaxe wackelt' },
        { a: 'Wortspiel', t: 'Die Knochen-Illusion' },
        { a: 'konträrer Winkel', t: 'Calcium und Vitamin D: Standard ohne Beleg' }
      ],
      anleser: 'Calcium und Vitamin D gehören für viele zum Standard bei sturzgefährdeten Patienten. Doch neue Auswertungen finden den Nutzen nicht mehr. Was heißt das für die nächste Verordnung?'
    },
    {
      id: 'glp1',
      fach: 'diabeto', angle: 'Praxisfrage offen', score: 14, max: 15,
      evidenz: 4, diskussion: 4, aktuell: 'vor 2 Tagen', social: 'belegt',
      title: 'Gewichtsverlauf nach Absetzen von GLP-1-Agonisten',
      dreisatz: {
        p: 'Abnehmspritzen wirken, solange sie gespritzt werden.',
        b: 'Nach dem Absetzen kehren zwei Drittel des Gewichts binnen eines Jahres zurück.',
        f: 'Wer soll das dauerhaft bezahlen, und wer soll es dauerhaft begleiten?'
      },
      warumJetzt: 'Die ersten großen Absetz-Kohorten laufen aus, gleichzeitig verhandelt der GKV-Spitzenverband über die Erstattungsfähigkeit.',
      talking: [
        'Der Rebound ist kein Therapieversagen, sondern der erwartbare Verlauf einer chronischen Erkrankung.',
        'Die Debatte über Lebensstil versus Dauermedikation wird an dieser Stelle neu geführt.',
        'Praxen brauchen eine Sprachregelung für das Absetzgespräch, nicht erst beim Rezeptende.'
      ],
      quellen: [
        { t: 'Weight regain after discontinuation of semaglutide', src: 'NEJM', id: 'doi:10.1056/NEJMoa2601188' },
        { t: 'Adherence patterns in real-world GLP-1 use', src: 'Diabetes Care', id: 'PMID 40233918' },
        { t: 'Nationale VersorgungsLeitlinie Adipositas, Konsultationsfassung', src: 'AWMF', id: 'Stand 2026' }
      ],
      debatte: [
        { t: 'Kostendebatte in der Fachpresse, mehrere Kommentare', src: 'ÄrzteZeitung' },
        { t: 'Patientenberichte über Absetzsymptome', src: 'Reddit r/Semaglutide, hohe Frequenz' }
      ],
      fehlt: 'Belastbare Daten zu abgestuftem Ausschleichen statt hartem Absetzen.',
      gegen: 'Rebound nach Absetzen ist bei jeder wirksamen Dauertherapie zu erwarten. Bei Antihypertensiva stellt niemand die Indikation infrage, wenn der Blutdruck nach Absetzen steigt.',
      haerte: [
        'Wie viele Absetzer haben strukturierte Nachsorge erhalten?',
        'Wurde zwischen Absetzen aus Nebenwirkung und aus Kostengründen getrennt?',
        'Was sagen die Daten zur Körperzusammensetzung, nicht nur zum Gewicht?'
      ],
      headlines: [
        { a: 'Frage als Aufhänger', t: 'Was passiert nach der Spritze?' },
        { a: 'Wortspiel', t: 'Abnehmen auf Abo' },
        { a: 'praxisorientiert', t: 'GLP-1 absetzen: Das Gespräch, das keiner führt' }
      ],
      anleser: 'Die Spritze wirkt, das ist unbestritten. Blöd nur, dass zwei Drittel des Gewichts zurückkommen, sobald sie abgesetzt wird. Wird Adipositas damit endgültig zur Dauermedikation?'
    },
    {
      id: 'kreatin',
      fach: 'ernaeh', angle: 'Neue Zielgruppe', score: 10, max: 15,
      evidenz: 3, diskussion: 3, aktuell: 'vor 9 Tagen', social: 'belegt',
      title: 'Kreatin bei Sarkopenie: aus dem Kraftraum in die Geriatrie',
      dreisatz: {
        p: 'Kreatin galt als Supplement für Bodybuilder.',
        b: 'Mehrere Arbeiten zeigen Effekte auf Muskelkraft und Alltagsfunktion bei über 65-Jährigen.',
        f: 'Kommt das als Empfehlung in die hausärztliche Sprechstunde?'
      },
      warumJetzt: 'Zwei Übersichtsarbeiten innerhalb weniger Wochen, dazu ein deutlich sichtbarer Trend in der Laienpresse.',
      talking: [
        'Der Effekt zeigt sich nur in Kombination mit Krafttraining, nicht als Monotherapie.',
        'Die Datenlage zu Nierenfunktion bei Älteren ist dünner als oft dargestellt.',
        'Es gibt keine geriatrische Dosierungsempfehlung, nur Übertragung aus dem Sport.'
      ],
      quellen: [
        { t: 'Creatine supplementation and muscle function in older adults', src: 'Am J Clin Nutr', id: 'PMID 40147233' },
        { t: 'Sarcopenia interventions: umbrella review', src: 'Age Ageing', id: 'doi:10.1093/ageing/afaf021' },
        { t: 'DGE-Stellungnahme Nahrungsergänzung im Alter', src: 'DGE', id: 'Stand 2025' }
      ],
      debatte: [
        { t: 'Starker Anstieg der Suchanfragen zu Kreatin über 60', src: 'Google Trends, 12 Monate' },
        { t: 'Apothekenpresse berichtet über Beratungsbedarf', src: 'DAZ' }
      ],
      fehlt: 'Langzeitdaten über zwölf Monate hinaus, und Daten zu Patienten mit eingeschränkter Nierenfunktion.',
      gegen: 'Ohne Training kein Effekt. Damit ist nicht Kreatin die Intervention, sondern das Training, und das ist keine Nachricht.',
      haerte: [
        'Wie war die Trainingsintensität in den Kontrollgruppen?',
        'Wurde Kreatinin als Verlaufsparameter überhaupt sinnvoll interpretiert?',
        'Wie hoch ist der Anteil industriefinanzierter Studien?'
      ],
      headlines: [
        { a: 'sachlich zugespitzt', t: 'Kreatin: längst kein Bodybuilder-Thema mehr' },
        { a: 'Wortspiel', t: 'Muckis für Methusalem' },
        { a: 'praxisorientiert', t: 'Was du Patienten über 65 zu Kreatin sagen solltest' }
      ],
      anleser: 'Kreatin kennt man aus dem Fitnessstudio. Trotzdem taucht es plötzlich in Arbeiten zur Sarkopenie auf, und zwar mit messbaren Effekten. Reicht das für eine Empfehlung in der Sprechstunde?'
    },
    {
      id: 'bedrot',
      fach: 'mental', angle: 'Viel Diskussion, dünne Evidenz', score: 7, max: 15,
      evidenz: 1, diskussion: 4, aktuell: 'vor 3 Tagen', social: 'belegt',
      thin: true,
      title: 'Bed Rotting: Erholungsverhalten oder Rückzugssymptom?',
      dreisatz: {
        p: 'Ganze Tage im Bett gelten in sozialen Netzwerken als legitime Selbstfürsorge.',
        b: 'Klinisch ist dasselbe Verhalten ein etabliertes Frühzeichen depressiver Episoden.',
        f: 'Wie unterscheidet man das im Gespräch, ohne zu pathologisieren?'
      },
      warumJetzt: 'Der Begriff ist in der Zielgruppe angekommen und wird in Sprechstunden aktiv genannt, ohne dass es dazu Literatur gäbe.',
      talking: [
        'Es gibt keine Studie zum Begriff, nur zum zugrundeliegenden Verhalten.',
        'Der Unterschied liegt in Dauer, Freiwilligkeit und Funktionsniveau danach.',
        'Für die Praxis ist der Begriff ein Türöffner, kein Befund.'
      ],
      quellen: [
        { t: 'Behavioural activation and withdrawal in young adults', src: 'J Affect Disord', id: 'PMID 39944210' },
        { t: 'Rest, recovery and rumination: a conceptual review', src: 'Clin Psychol Rev', id: 'doi:10.1016/j.cpr.2025.102611' }
      ],
      debatte: [
        { t: 'Sehr hohe Reichweite auf TikTok und Instagram', src: 'Plattformdaten, belegt' },
        { t: 'Psychotherapeutenkammer warnt vor Verharmlosung', src: 'Pressemitteilung' }
      ],
      fehlt: 'Alles Quantitative. Es existiert keine belastbare Prävalenzangabe, jede Zahl dazu wäre erfunden.',
      gegen: 'Ein Netzbegriff ohne Literatur ist kein medizinisches Thema, sondern Zeitgeist. Wer ihn aufgreift, adelt ihn.',
      haerte: [
        'Ab wann ist Rückzug klinisch relevant, gibt es einen Schwellenwert?',
        'Welche Screening-Frage funktioniert hier überhaupt?',
        'Wie geht man mit Patienten um, die den Begriff selbst mitbringen?'
      ],
      headlines: [
        { a: 'sachlich zugespitzt', t: 'Wenn Nichtstun krank macht' },
        { a: 'Clickbait-Parodie', t: 'Bed Rotting: Ärzte sind sich uneinig, und das aus gutem Grund' },
        { a: 'praxisorientiert', t: 'Selbstfürsorge oder Symptom: die eine Frage, die weiterhilft' }
      ],
      anleser: 'Im Netz heißt es Selbstfürsorge, im Lehrbuch sozialer Rückzug. Gemeint ist dasselbe Verhalten. Woran erkennst du im Gespräch, welches von beidem vor dir sitzt?'
    },
    {
      id: 'hwi',
      fach: 'infekt', angle: 'Leitlinie hinkt hinterher', score: 11, max: 15,
      evidenz: 4, diskussion: 2, aktuell: 'vor 12 Tagen', social: null,
      title: 'Unkomplizierter Harnwegsinfekt: drei Tage statt sieben',
      dreisatz: {
        p: 'Die deutsche Leitlinie nennt weiterhin längere Therapiedauern als Regelfall.',
        b: 'Aktuelle Vergleichsstudien zeigen für die Kurztherapie gleichwertige Heilungsraten.',
        f: 'Wie lange dauert es, bis das in der Verordnungspraxis ankommt?'
      },
      warumJetzt: 'Die Leitlinie steht zur Überarbeitung an, und Antibiotic Stewardship ist in den Praxen Thema.',
      talking: [
        'Gleichwertige Heilungsraten bei deutlich reduzierter Gesamtexposition.',
        'Der Unterschied betrifft ausschließlich unkomplizierte Verläufe bei nicht schwangeren Frauen.',
        'Rezidivraten unterscheiden sich in den vorliegenden Daten nicht signifikant.'
      ],
      quellen: [
        { t: 'Short-course versus standard therapy in uncomplicated UTI', src: 'Lancet Infect Dis', id: 'doi:10.1016/S1473-3099(26)00033-4' },
        { t: 'Antibiotic stewardship in ambulatory care', src: 'Clin Microbiol Infect', id: 'PMID 40209911' },
        { t: 'S3-Leitlinie Harnwegsinfektionen', src: 'AWMF 043-044', id: 'Stand 2024' }
      ],
      debatte: [
        { t: 'Fachgesellschaft kündigt Prüfung an', src: 'DEGAM' },
        { t: 'Diskussion über Rezidivangst in der Sprechstunde', src: 'Fachforum' }
      ],
      fehlt: 'Daten zu Patientinnen mit rezidivierenden Infekten in der Vorgeschichte.',
      gegen: 'Die Studien laufen an Zentren mit engmaschiger Nachkontrolle. In der Regelversorgung sieht die Patientin niemand wieder, und dann ist die kürzere Therapie ein Risiko.',
      haerte: [
        'Wie wurde Heilung definiert, klinisch oder mikrobiologisch?',
        'Wie war die Nachbeobachtungsdauer?',
        'Gilt das auch für Patientinnen über 65?'
      ],
      headlines: [
        { a: 'sachlich zugespitzt', t: 'Harnwegsinfekt: Drei Tage reichen' },
        { a: 'Wortspiel', t: 'Kurz und schmerzlos' },
        { a: 'konträrer Winkel', t: 'Die Leitlinie sagt sieben. Die Daten sagen drei.' }
      ],
      anleser: 'Sieben Tage Antibiotikum beim unkomplizierten Harnwegsinfekt, so steht es in der Leitlinie. Doch die aktuellen Vergleichsdaten zeigen bei drei Tagen dieselben Heilungsraten. Warum verordnen wir dann weiter länger?'
    },
    {
      id: 'kitriage',
      fach: 'politik', angle: 'Regulierung trifft Alltag', score: 9, max: 15,
      evidenz: 2, diskussion: 3, aktuell: 'vor 4 Tagen', social: null,
      title: 'KI-Triage in der Notaufnahme: Haftung bleibt ungeklärt',
      dreisatz: {
        p: 'Erste Kliniken setzen algorithmische Ersteinschätzung produktiv ein.',
        b: 'Wer haftet, wenn das System eine Sepsis niedrig priorisiert, ist juristisch offen.',
        f: 'Wer unterschreibt am Ende die Ersteinschätzung?'
      },
      warumJetzt: 'Die Übergangsfristen der europäischen KI-Verordnung greifen für Hochrisikoanwendungen im Gesundheitswesen.',
      talking: [
        'Die Systeme sind als Unterstützung zugelassen, werden aber faktisch als Entscheidung genutzt.',
        'Dokumentationspflichten sind derzeit uneinheitlich umgesetzt.',
        'Pflegekräfte tragen die Konsequenz, ohne die Modelllogik einsehen zu können.'
      ],
      quellen: [
        { t: 'Algorithmic triage in emergency departments: prospective evaluation', src: 'Ann Emerg Med', id: 'PMID 40255102' },
        { t: 'Verordnung über künstliche Intelligenz, Anhang III', src: 'EU', id: 'Stand 2026' },
        { t: 'Positionspapier Digitalisierung Notfallmedizin', src: 'DGINA', id: '2026' }
      ],
      debatte: [
        { t: 'Kontroverse Kommentare aus der Notfallmedizin', src: 'Fachpresse' },
        { t: 'Rechtsunsicherheit als Hauptkritikpunkt in Verbändeanhörung', src: 'Protokoll' }
      ],
      fehlt: 'Ein konkreter dokumentierter Schadensfall, an dem sich die Haftungsfrage zeigen ließe.',
      gegen: 'Auch die menschliche Ersteinschätzung liegt regelmäßig daneben. Der Vergleichsmaßstab ist nicht Perfektion, sondern die bisherige Fehlerquote.',
      haerte: [
        'Gegen welchen Standard wurde die Sensitivität verglichen?',
        'Wie oft wurde die Empfehlung des Systems überstimmt?',
        'Wer hat Zugriff auf die Fehlerprotokolle?'
      ],
      headlines: [
        { a: 'Frage als Aufhänger', t: 'Wer haftet, wenn die KI sich verschätzt?' },
        { a: 'sachlich zugespitzt', t: 'KI-Triage: produktiv im Einsatz, ungeklärt in der Haftung' },
        { a: 'konträrer Winkel', t: 'Der Algorithmus entscheidet. Unterschreiben musst du.' }
      ],
      anleser: 'In ersten Notaufnahmen übernimmt ein Modell die Ersteinschätzung. Trotzdem steht bis heute nicht fest, wer haftet, wenn es die Sepsis übersieht. Und die Übergangsfrist läuft.'
    },
    {
      id: 'melatonin',
      fach: 'apo', angle: 'Selbstmedikation außer Kontrolle', score: 10, max: 15,
      evidenz: 2, diskussion: 3, aktuell: 'vor 8 Tagen', social: 'belegt',
      thin: false,
      title: 'Melatonin für Kinder: Nahrungsergänzung im Dauergebrauch',
      dreisatz: {
        p: 'Melatonin ist für Kinder rezeptfrei als Nahrungsergänzung verfügbar.',
        b: 'Erhebungen zeigen wochenlangen Dauergebrauch ohne ärztliche Begleitung.',
        f: 'Braucht es eine Abgabebeschränkung, oder reicht Beratung?'
      },
      warumJetzt: 'Mehrere Apothekenverbände melden steigende Nachfrage, parallel läuft eine Bewertung auf europäischer Ebene.',
      talking: [
        'Dosierungen in frei verkäuflichen Produkten schwanken erheblich.',
        'Für die Dauereinnahme bei Kindern existieren kaum Sicherheitsdaten.',
        'Schlafhygiene wird als Erstmaßnahme in der Praxis oft übersprungen.'
      ],
      quellen: [
        { t: 'Melatonin use in children: cross-sectional survey', src: 'JAMA Pediatr', id: 'PMID 40188400' },
        { t: 'Content analysis of over-the-counter melatonin products', src: 'Sleep Med', id: 'doi:10.1016/j.sleep.2025.11.004' },
        { t: 'BfArM-Einstufung melatoninhaltiger Produkte', src: 'BfArM', id: 'Stand 2025' }
      ],
      debatte: [
        { t: 'Elternforen diskutieren Dosierung untereinander', src: 'Reichweite belegt' },
        { t: 'Apothekerkammer fordert Beratungspflicht', src: 'Pressemitteilung' }
      ],
      fehlt: 'Zahlen zur Anwendungsdauer in Deutschland, bisher nur internationale Erhebungen.',
      gegen: 'Bei sachgerechter Anwendung ist die Substanz gut verträglich. Eine Verschreibungspflicht verlagert das Problem nur in die Praxis.',
      haerte: [
        'Wie wurde die Anwendungsdauer erhoben, Selbstauskunft oder Verkaufsdaten?',
        'Sind Kinder mit ADHS oder Autismus getrennt ausgewertet?',
        'Welche Dosierungen wurden tatsächlich gefunden?'
      ],
      headlines: [
        { a: 'sachlich zugespitzt', t: 'Melatonin für Kinder: rezeptfrei, aber nicht harmlos' },
        { a: 'Wortspiel', t: 'Gute-Nacht-Gummis' },
        { a: 'praxisorientiert', t: 'Was Eltern über Melatonin nicht wissen, und du sagen solltest' }
      ],
      anleser: 'Melatonin gibt es für Kinder als Gummibärchen im Regal. Doch aus der Einschlafhilfe für ein paar Tage wird oft ein Dauergebrauch über Wochen. Und niemand schaut hin.'
    },
    {
      id: 'finerenon',
      fach: 'kardio', angle: 'Unterversorgung', score: 11, max: 15,
      evidenz: 4, diskussion: 1, aktuell: 'vor 5 Tagen', social: null,
      title: 'Kardiorenale Therapie: Leitlinie da, Verordnung fehlt',
      dreisatz: {
        p: 'Für Patienten mit chronischer Nierenerkrankung und Typ-2-Diabetes ist die Vierfachtherapie leitliniengerecht.',
        b: 'Abrechnungsdaten zeigen, dass sie bei einer Minderheit ankommt.',
        f: 'Woran scheitert die Umsetzung, an Wissen, Zeit oder Regress?'
      },
      warumJetzt: 'Eine große Auswertung von Routinedaten liegt erstmals für Deutschland vor.',
      talking: [
        'Die Lücke betrifft vor allem die hausärztliche Versorgung, nicht die Schwerpunktpraxen.',
        'Regressangst wird in Befragungen als Hauptgrund genannt.',
        'Die Kombination erfordert Monitoring, das Zeit kostet und schlecht vergütet ist.'
      ],
      quellen: [
        { t: 'Guideline-directed therapy in CKD and T2D: claims data analysis', src: 'Dtsch Arztebl Int', id: 'doi:10.3238/arztebl.m2026.0031' },
        { t: 'KDIGO Clinical Practice Guideline, Update', src: 'KDIGO', id: '2025' },
        { t: 'Nationale VersorgungsLeitlinie Typ-2-Diabetes', src: 'AWMF nvl-001', id: 'Stand 2025' }
      ],
      debatte: [
        { t: 'Diabetologen kritisieren Verordnungshürden', src: 'Fachpresse' },
        { t: 'Kassen verweisen auf bestehende Wirtschaftlichkeitsprüfung', src: 'Stellungnahme' }
      ],
      fehlt: 'Regionale Aufschlüsselung, und ob Praxen mit DMP-Teilnahme besser abschneiden.',
      gegen: 'Routinedaten bilden Kontraindikationen und Unverträglichkeiten nicht ab. Ein Teil der Lücke ist medizinisch begründet.',
      haerte: [
        'Wie wurden Kontraindikationen in den Abrechnungsdaten abgebildet?',
        'Ist zwischen Ersteinstellung und Fortführung getrennt?',
        'Welche Rolle spielt die eGFR-Grenze in der Praxis?'
      ],
      headlines: [
        { a: 'sachlich zugespitzt', t: 'Vierfachtherapie: leitliniengerecht, aber selten verordnet' },
        { a: 'konträrer Winkel', t: 'Die Leitlinie ist nicht das Problem' },
        { a: 'praxisorientiert', t: 'Kardiorenal: Was Regressangst kostet' }
      ],
      anleser: 'Für Patienten mit Diabetes und Nierenerkrankung steht die Vierfachtherapie längst in der Leitlinie. Trotzdem bekommt sie nur eine Minderheit. Liegt es am Wissen oder an der Angst vor dem Regress?'
    }
  ];

  /* Rechercheschwerpunkte, ehrlich beschriftet (Briefing §13) */
  const QUELLEN = [
    { grp: 'Wissenschaft', items: [
      { id: 'pubmed', l: 'PubMed und Preprints', s: 'PubMed', on: true },
      { id: 'cochrane', l: 'Cochrane und Übersichtsarbeiten', s: 'Cochrane', on: true },
      { id: 'trials', l: 'Studienregister', s: 'Studien', on: false }
    ]},
    { grp: 'Leitlinien', items: [
      { id: 'awmf', l: 'AWMF und Fachgesellschaften', s: 'AWMF', on: true },
      { id: 'intl', l: 'Internationale Leitlinien', s: 'Int. Leitlinien', on: false }
    ]},
    { grp: 'Fachpresse', items: [
      { id: 'dez', l: 'Deutsche Fachpresse', s: 'Fachpresse', on: true },
      { id: 'intlpress', l: 'Internationale Fachmedien', s: 'Int. Medien', on: false }
    ]},
    { grp: 'Diskussion', items: [
      { id: 'foren', l: 'Fachforen und Kommentarspalten', s: 'Fachforen', on: true },
      { id: 'social', l: 'Social Media', s: 'Social', on: false }
    ]}
  ];

  const PRESETS = [
    { id: 'breit', l: 'Breiter Scan' },
    { id: 'evidenz', l: 'Nur Evidenz' },
    { id: 'debatte', l: 'Was diskutiert wird' },
    { id: 'leitlinie', l: 'Leitlinien-Bewegung' },
    { id: 'praxis', l: 'Praxisnah' },
    { id: 'politik', l: 'Gesundheitspolitik' }
  ];

  const WINKEL = [
    { id: 'dogma', l: 'Dogma wackelt' },
    { id: 'lücke', l: 'Versorgungslücke' },
    { id: 'debatte', l: 'Viel Diskussion, dünne Evidenz' },
    { id: 'neu', l: 'Neue Zielgruppe' },
    { id: 'regel', l: 'Regulierung trifft Alltag' }
  ];

  /* Würfelflächen: Reihenfolge = Materialindex [+X,-X,+Y,-Y,+Z,-Z] wird im Modul gemappt */
  const FACES = [
    { id: 'scan',     l: 'Recherchi', sub: 'Fragen, diktieren, anhängen' },
    { id: 'quellen',  l: 'Quellen',   sub: 'Rechercheschwerpunkte' },
    { id: 'filter',   l: 'Filter',    sub: 'Fachgebiete' },
    { id: 'briefing', l: 'Upload',    sub: 'PDF, Text, Link' },
    { id: 'material', l: 'Board',     sub: 'Gemerkte Themen' },
    { id: 'anleitung',l: 'Flexa',     sub: 'Kurz erklärt', video: 'assets/flexa-cube.mp4' }
  ];

  const GOLDEN = [
    { h: 'Man lernt Knie aus', m: 'verdrehte Redewendung', on: true },
    { h: 'UV-Therapie: (K)ein Relikt', m: 'Klammer-Trick kehrt die Aussage um', on: true },
    { h: 'Ozempic, weniger Kal macht kahl', m: 'Binnenreim plus Wortkürzung', on: true },
    { h: 'Liquordiagnostik: Neurologen lieben diesen Trick', m: 'Clickbait-Parodie', on: true },
    { h: 'Spermienqualität: Auf die Nüsse kommt es an', m: 'Doppeldeutigkeit über Redewendung', on: true },
    { h: 'Die Methusalem-Klamott', m: 'Kofferwort aus Bibel und Alltagssprache', on: false }
  ];

  const SCANSTEPS = [
    'Rechercheschwerpunkte werden abgefragt',
    'Publikationen der letzten 14 Tage werden gesichtet',
    'Leitlinien-Änderungen werden abgeglichen',
    'Fachdebatten werden gelesen',
    'Widersprüche werden geprüft',
    'Themenkandidaten werden sortiert'
  ];

  const BEISPIELE = [
    'Mich interessiert, warum GLP-1-Abnehmer nach dem Absetzen wieder zunehmen.',
    'Gibt es etwas Neues zu Antibiotika-Kurzzeittherapie?',
    'Was wird gerade in der Geriatrie kontrovers diskutiert?'
  ];

  window.RECHERCHI = { FACH, THEMEN, QUELLEN, PRESETS, WINKEL, FACES, GOLDEN, SCANSTEPS, BEISPIELE };
})();
