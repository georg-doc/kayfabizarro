# Gespräche zwischen ChatGPT und Claude fortführen · ohne Plugin

## Sofortfunktion

Bei Ende eines Gesprächs „Sitzungsnotiz für einen anderen Chat“ schreiben. Der Assistent erstellt eine kurze, kopierbare Markdown-Notiz:

- Titel und Datum (nur falls bekannt)
- Fragestellung und eigene These (möglichst im Wortlaut des Nutzers)
- Stärkste Gründe und Einwände
- Begriffe, über die Uneinigkeit besteht
- Autor/Werk/Fundstelle mit **A/B/C/D-Verifikationsstatus**
- Offene Fragen und ein konkreter nächster Schritt
- Gewünschter Gesprächsmodus für die Fortsetzung

Beim neuen Modell zuerst den Starter-Prompt und danach diese Notiz einfügen. Das ist die **verlässliche portable Gedächtnisbrücke**, unabhängig davon, ob GitHub im Chat gelesen werden kann.

## ChatGPT Free

Optional ein ChatGPT-Projekt anlegen, Projektanweisungen aus dem Starter-Prompt übernehmen, kleine Referenztexte als Projektdateien hinzufügen. Offizielle Hilfe nennt aktuell **5 Dateien pro Free-Projekt**. Ein Projekt ist **keine automatische GitHub-Synchronisierung**. Quelle: https://help.openai.com/en/articles/10169521-projects-in-chatgpt

## Claude Free

Optional ein Claude-Projekt anlegen, Projektanweisungen und Projektwissen verwenden. Die offizielle Hilfe nennt aktuell **maximal 5 Projekte** für Free. Ein Projekt teilt nicht automatisch den vollen Kontext aller darin geführten Chats; Kerngedanken in Projektwissen oder Sitzungsnotiz übernehmen. Quelle: https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects

## GitHub lesen und schreiben

- Lesen: Öffentliche GitHub-Dateien sind im Browser zugänglich. Ein LLM kann eine URL eventuell abrufen, **falls** Webzugriff aktiv und die Seite erreichbar ist; niemals als selbstverständlich annehmen.
- Schreiben: Nicht durch Prompt erzwingbar. Dafür ist eine tatsächlich verbundene und autorisierte GitHub-Aktion oder ein manueller Upload/Editor nötig.
- Für den Nutzer im MVP: Sitzungsnotiz oder Essay zuerst **privat lokal** speichern. Nur freigegebene Texte über GitHub-Weboberfläche hochladen; alternative private Ablage oder privates Repo für persönliche Essays.
- Technische Automatisierung erst nach realem Nutzerbedarf und expliziter Zustimmung; keine Tokens/Secrets in Chat oder Repo.

## Späterer Persistenzweg

Ein einzelner „Export als Markdown“-Befehl plus optionaler Import in eine private Wissensbasis ist sinnvoller als ständiges vollautomatisches Archivieren. Bei öffentlicher Publikation klar zwischen **veröffentlichter Essayfassung** und privaten Rohnotizen trennen.
