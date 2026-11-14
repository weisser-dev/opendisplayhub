(() => {
  const dictionary = {
    'Deine Gedanken, immer griffbereit.':'Your thoughts, always close at hand.','Änderungen verwerfen?':'Discard your changes?','Filter zurücksetzen':'Clear filters','App-Link':'App link',
    'Entdecken':'Discover','Entdecke und installiere Apps für dein Display':'Discover and install apps for your display','So geht’s':'Get started','IM FOKUS':'FEATURED','App im Fokus':'Featured app','App ansehen':'View app','Entdecke Apps':'Discover apps','Alle ansehen':'See all','Nach Kategorie entdecken':'Browse by category','Alle Apps entdecken':'Browse all apps','Open-Source-Projekte von weisser-dev für dein Display.':'Open-source projects by weisser-dev for your display.','Ansehen':'Get','Apps auf deiner Brille nutzen':'Use apps on your glasses','Wähle eine App, scanne ihren QR-Code oder kopiere den Link und füge ihn in der Meta AI App unter Web Apps hinzu.':'Choose an app, scan its QR code or copy its link, and add it under Web Apps in the Meta AI app.','Auf GitHub ansehen':'View on GitHub','App öffnen':'Open app',
    'Alle Apps':'All apps','Sprache':'Language','OPEN SOURCE VON WEISSER-DEV':'OPEN SOURCE BY WEISSER-DEV',
    'Mehr in deinem Blick':'More in your view','Open-Source-Apps von weisser-dev für dein Display. Entdecken, einrichten und direkt loslegen.':'Open-source apps by weisser-dev for your display. Discover, set up, and get started.',
    'Apps entdecken':'Explore apps','DIE SAMMLUNG':'THE COLLECTION','Entdecke die Apps':'Discover the apps','Einfach auswählen, einrichten und loslegen.':'Choose an app, set it up, and get started.',
    'Apps suchen':'Search apps','Kategorien':'Categories','Alle':'All','Keine passenden Apps gefunden.':'No matching apps found.',
    'IN EIN PAAR SCHRITTEN':'IN A FEW STEPS','Bereit für dein Display?':'Ready for your display?',
    'Deine nächste App ist nur einen Moment entfernt.':'Your next app is just a moment away.','App auswählen':'Choose an app',
    'Finde eine App, die zu dir passt, und öffne ihre Einrichtung.':'Find an app you like and open its setup.','Link übernehmen':'Get the link',
    'Scanne den QR-Code oder kopiere die Adresse der App.':'Scan the QR code or copy the app address.','Auf der Brille öffnen':'Open on your glasses',
    'Füge die Web-App in der Meta AI App zu deiner Brille hinzu.':'Add the web app to your glasses in the Meta AI app.',
    'Alle Apps sind Open-Source-Projekte von weisser-dev.':'All apps are open-source projects by weisser-dev.',
    'APP EINRICHTEN':'SET UP APP','Scanne den QR-Code oder kopiere den Link. Füge ihn in der Meta AI App unter Web Apps hinzu.':'Scan the QR code or copy the link. Add it under Web Apps in the Meta AI app.',
    'Link kopieren':'Copy link','Link kopiert.':'Link copied.','APP-LINK SCANNEN':'SCAN APP LINK','Schließen':'Close',
    'Die Apps konnten nicht geladen werden. Bitte lade die Seite erneut.':'Apps could not be loaded. Please reload the page.',
    'Notizen':'Notes','Ein Gedanke. Ein Moment.':'A thought. A moment.','Festgehalten.':'Captured.','Notiz aufnehmen':'Take a note',
    'Deine Notizen':'Your notes','Notizen suchen':'Search notes','Keine passende Notiz gefunden.':'No matching notes found.',
    'Noch keine Notizen.':'No notes yet.','Halte deinen ersten Gedanken fest.':'Capture your first thought.',
    'Neue Notiz':'New note','Notiz bearbeiten':'Edit note','Abbrechen':'Cancel','Sprich über die Spracheingabe deiner Tastatur oder schreibe deine Notiz.':'Use your keyboard’s dictation or type your note.',
    'Titel':'Title','optional':'optional','Wird sonst automatisch erstellt':'Generated automatically if left blank','Notiz':'Note',
    'Was möchtest du festhalten?':'What would you like to remember?','Spracheingabe starten':'Start dictation','Spracheingabe stoppen':'Stop dictation',
    'Notiz speichern':'Save note','Notiz löschen':'Delete note','LOKAL GESPEICHERT':'STORED LOCALLY',
    'Notizen konnten nicht geladen werden. Prüfe den lokalen Speicher.':'Notes could not be loaded. Check local storage.',
    'Speichern nicht möglich. Bitte prüfe den lokalen Speicher.':'Unable to save. Check local storage.','Bitte gib zuerst eine Notiz ein.':'Please enter a note first.',
    'Diese Notiz löschen?':'Delete this note?','Ich höre zu …':'Listening …','Spracheingabe nicht verfügbar. Nutze die Spracheingabe deiner Tastatur oder schreibe deine Notiz.':'Dictation is unavailable. Use your keyboard’s dictation or type your note.',
    'Spracheingabe beendet. Du kannst deine Notiz bearbeiten und speichern.':'Dictation ended. You can edit and save your note.',
    'Spracheingabe konnte nicht gestartet werden.':'Could not start dictation.'
  };
  const originals = new WeakMap();
  function language() { try { return localStorage.getItem('opendisplayhub.language') || (navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en'); } catch { return 'en'; } }
  window.appLanguage = language;
  window.tr = text => language() === 'en' ? (dictionary[text] || text) : text;
  function translate() {
    document.documentElement.lang = language();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node; while ((node = walker.nextNode())) {
      if (['SCRIPT','STYLE','OPTION'].includes(node.parentElement.tagName)) continue;
      if (!originals.has(node)) originals.set(node, node.nodeValue);
      const original = originals.get(node), trimmed = original.trim();
      if (dictionary[trimmed]) node.nodeValue = original.replace(trimmed, window.tr(trimmed));
    }
    document.querySelectorAll('[placeholder],[aria-label]').forEach(element => {
      for (const attr of ['placeholder','aria-label']) if (element.hasAttribute(attr)) {
        const key = `original${attr.replace(/(^|-)(\w)/g, (_, a, b) => b.toUpperCase())}`;
        if (!element.dataset[key]) element.dataset[key] = element.getAttribute(attr);
        element.setAttribute(attr, window.tr(element.dataset[key]));
      }
    });
    document.querySelectorAll('.language-select').forEach(select => { select.value = language(); });
    document.title = window.tr(document.title === 'Notes' ? 'Notizen' : document.title);
  }
  window.translatePage = translate;
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.language-select').forEach(select => select.addEventListener('change', () => {
      try { localStorage.setItem('opendisplayhub.language', select.value); } catch {}
      translate(); window.dispatchEvent(new Event('languagechange'));
    }));
    translate();
  });
})();
