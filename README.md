# OpenDisplayHub

An open-source catalog by [weisser-dev](https://github.com/weisser-dev) for display web apps. The hub and every app have their own source directory and are built together for GitHub Pages. The interface supports English and German, with a language setting shared across the hub and apps on the same device.

## Local development

```sh
npm ci
npm run build
npx serve dist
```

Open the HTTP URL printed by the server, not a file URL. QR codes contain the current absolute app URL. For setup on glasses, open the hub through a publicly accessible HTTPS URL.

## Add an app

1. Create `apps/my-app/` with an `index.html`, an `icon.svg`, and its static assets. Icons must be local SVG files. Use relative asset paths.
2. Add an `app.json`:

```json
{
  "name": "My app",
  "description": "A short description.",
  "category": "Utility",
  "translations": { "de": { "name": "Meine App", "description": "Eine kurze Beschreibung.", "category": "Werkzeuge" } },
  "icon": "icon.svg",
  "color": "#c2f279"
}
```

3. Run `npm run build`. The app is discovered automatically and appears in the catalog and at `apps/my-app/`. Folder names may contain lowercase letters, numbers, and hyphens. Each app must provide static files and its own translations and offline behavior for any external services.

## GitHub Pages

In the repository settings, choose **Pages → Build and deployment → Source → GitHub Actions**. Each push to `main` builds and deploys the hub and apps together. The workflow can also be started manually.

## Notes and offline support

Notes are stored in the browser's local storage on the device where the app is opened. There is no synchronization; clearing browser data also removes notes. Notes have an optional title, an automatically generated short title when omitted, a creation date, and search. Older notes without titles remain compatible.

After the first complete online visit, a service worker caches the built hub and app files for offline use. Updates are fetched on a subsequent online visit. Service worker and persistent storage support on the actual glasses must be verified on the device. Apps using external services or assets need to account for those dependencies separately.

“Take a note” opens the text field, where the device's native dictation may be available. Browsers supporting the Web Speech API also show a dictation button. Speech processing depends on the device and provider, may require a network connection, and is not necessarily local. The app does not save audio recordings. Dictation, storage, and navigation on actual glasses still require device testing.
