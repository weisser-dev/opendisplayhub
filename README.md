# OpenDisplayHub

Ein statischer App-Hub für Display-Web-Apps. Jede App liegt unabhängig unter `apps/`, der Hub unter `hub/`. Der Build erkennt App-Ordner automatisch und veröffentlicht alles gemeinsam auf GitHub Pages.

## Lokal starten

```sh
npm ci
npm run build
npx serve dist
```

Die Seite über den angezeigten HTTP-Link öffnen, nicht direkt als Datei. QR-Codes enthalten die aktuelle absolute App-Adresse; für die Einrichtung auf der Brille muss der Hub über eine öffentlich erreichbare HTTPS-Adresse geöffnet sein.

## Neue App hinzufügen

1. Einen Ordner `apps/meine-app/` mit einer `index.html` und allen benötigten Dateien anlegen. Asset-Pfade relativ halten.
2. Eine `app.json` hinzufügen:

```json
{"name":"Meine App","description":"Eine kurze Beschreibung.","category":"Utility","icon":"✦","color":"#c2f279"}
```

3. `npm run build` ausführen. Die App erscheint automatisch im Hub und unter `apps/meine-app/`. Ordnernamen dürfen Kleinbuchstaben, Zahlen und Bindestriche enthalten. Jede App ist für ihren eigenen Build verantwortlich und muss statische Dateien enthalten.

## GitHub Pages

In den Repository-Einstellungen unter **Pages → Build and deployment → Source** „GitHub Actions“ wählen. Jeder Push auf `main` baut und veröffentlicht Hub und Apps gemeinsam. Bei einem anderen Standardbranch den Branch in `.github/workflows/pages.yml` anpassen. Der Workflow kann auch manuell gestartet werden.

## Notizen

Die Beispiel-App speichert Notiztexte im `localStorage` des Browsers auf dem Gerät, auf dem sie geöffnet wird. Es gibt keine Synchronisierung; gelöschte Browserdaten löschen auch die Notizen. Die Schaltfläche „Notiz aufnehmen“ öffnet das Textfeld, in dem – sofern vom Gerät angeboten – die native Diktierfunktion verwendet werden kann. Wenn der Browser die Web Speech API anbietet, erscheint zusätzlich eine Spracheingabe-Schaltfläche. Die Verarbeitung der Sprache hängt vom jeweiligen Gerät und Dienst ab und ist nicht zwangsläufig lokal; eine Audioaufnahme wird nicht gespeichert. Auf der echten Brille müssen Diktat, Speicherverhalten und Bedienung noch geprüft werden.

## Offline-Nutzung

Nach dem ersten vollständigen Online-Aufruf installiert ein Service Worker die gebauten Hub- und App-Dateien für die Offline-Nutzung. Updates werden beim nächsten Online-Besuch geladen. Ob der Browser auf der Brille Service Worker und dauerhaften Speicher unterstützt, muss auf dem Gerät geprüft werden. Die Notiztexte werden separat im lokalen Speicher abgelegt. Spracheingabe kann trotz Offline-App eine Internetverbindung benötigen. Apps mit externen Diensten oder Assets müssen ihre eigene Offline-Funktionalität berücksichtigen.

Notizen erhalten automatisch einen kurzen Titel aus den ersten Worten; ein eigener Titel ist optional. Die Liste zeigt das Erstellungsdatum und lässt sich durchsuchen. Bestehende Notizen ohne eigenen Titel bleiben kompatibel.
