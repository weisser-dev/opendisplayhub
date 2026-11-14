const grid = document.querySelector('#apps-grid');
const dialog = document.querySelector('#setup-dialog');
const openApp = document.querySelector('#open-app');
let appUrl = '';
function setup(app) {
  appUrl = new URL(app.url, document.baseURI).href;
  document.querySelector('#dialog-title').textContent = app.name;
  document.querySelector('#feedback').textContent = '';
  openApp.href = appUrl;
  const qr = qrcode(0, 'M'); qr.addData(appUrl); qr.make();
  document.querySelector('#qr-code').innerHTML = qr.createSvgTag({ scalable: true, margin: 4 });
  dialog.showModal();
}
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('#copy-link').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(appUrl); document.querySelector('#feedback').textContent = 'Link kopiert.'; }
  catch { document.querySelector('#feedback').textContent = `Link: ${appUrl}`; }
});
fetch('apps.json').then(r => { if (!r.ok) throw Error(); return r.json(); }).then(apps => {
  document.querySelector('#count').textContent = `${String(apps.length).padStart(2, '0')} ${apps.length === 1 ? 'APP' : 'APPS'}`;
  if (!apps.length) { grid.textContent = 'Hier erscheinen bald neue Apps.'; return; }
  apps.forEach(app => {
    const card = document.createElement('article'); card.className = 'card';
    const icon = document.createElement('div'); icon.className = 'app-icon'; icon.style.backgroundColor = app.color; icon.textContent = app.icon;
    const info = document.createElement('div'); info.className = 'card-info';
    const category = document.createElement('span'); category.className = 'category'; category.textContent = app.category;
    const title = document.createElement('h3'); title.textContent = app.name;
    const desc = document.createElement('p'); desc.textContent = app.description;
    const button = document.createElement('button'); button.className = 'card-link'; button.textContent = 'Einrichten ↗'; button.addEventListener('click', () => setup(app));
    info.append(category, title, desc, button); card.append(icon, info); grid.append(card);
  });
}).catch(() => { document.querySelector('#count').textContent = 'NICHT VERFÜGBAR'; grid.textContent = 'Die Apps konnten nicht geladen werden. Bitte lade die Seite erneut.'; });

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
