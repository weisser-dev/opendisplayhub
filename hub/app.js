const grid = document.querySelector('#apps-grid');
const dialog = document.querySelector('#setup-dialog');
const openApp = document.querySelector('#open-app');
const search = document.querySelector('#app-search');
let appUrl = '', apps = [], selectedCategory = '';
const localize = app => ({ ...app, ...(app.translations?.[window.appLanguage()] || {}) });
function setup(app) {
  const item = localize(app);
  appUrl = new URL(app.url, document.baseURI).href;
  document.querySelector('#dialog-title').textContent = item.name;
  document.querySelector('#feedback').textContent = '';
  openApp.href = appUrl;
  const qr = qrcode(0, 'M'); qr.addData(appUrl); qr.make();
  document.querySelector('#qr-code').innerHTML = qr.createSvgTag({ scalable: true, margin: 4 });
  dialog.showModal();
}
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('#copy-link').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(appUrl); document.querySelector('#feedback').textContent = tr('Link kopiert.'); }
  catch { document.querySelector('#feedback').textContent = `Link: ${appUrl}`; }
});
function render() {
  const filters = document.querySelector('#categories'); filters.replaceChildren();
  const categories = [...new Set(apps.map(app => app.category))];
  for (const category of ['', ...categories]) {
    const button = document.createElement('button'); button.className = 'filter';
    button.setAttribute('aria-pressed', String(category === selectedCategory));
    button.textContent = category ? localize(apps.find(app => app.category === category)).category : tr('Alle');
    button.addEventListener('click', () => { selectedCategory = category; render(); }); filters.append(button);
  }
  const query = search.value.trim().toLocaleLowerCase();
  const matches = apps.filter(app => { const item = localize(app); return (!selectedCategory || app.category === selectedCategory) && `${item.name} ${item.description} ${item.category}`.toLocaleLowerCase().includes(query); });
  document.querySelector('#count').textContent = `${String(matches.length).padStart(2, '0')} ${matches.length === 1 ? 'APP' : 'APPS'}`;
  grid.replaceChildren();
  if (!matches.length) { grid.textContent = tr('Keine passenden Apps gefunden.'); return; }
  matches.forEach(app => {
    const item = localize(app), card = document.createElement('article'); card.className = 'card';
    const icon = document.createElement('div'); icon.className = 'app-icon'; icon.style.backgroundColor = app.color; icon.textContent = app.icon;
    const info = document.createElement('div'); info.className = 'card-info';
    const category = document.createElement('span'); category.className = 'category'; category.textContent = item.category;
    const title = document.createElement('h3'); title.textContent = item.name;
    const desc = document.createElement('p'); desc.textContent = item.description;
    const button = document.createElement('button'); button.className = 'card-link'; button.textContent = tr('Einrichten ↗'); button.addEventListener('click', () => setup(app));
    info.append(category, title, desc, button); card.append(icon, info); grid.append(card);
  });
}
search.addEventListener('input', render); window.addEventListener('languagechange', render);
fetch('apps.json').then(r => { if (!r.ok) throw Error(); return r.json(); }).then(data => { apps = data; render(); }).catch(() => { document.querySelector('#count').textContent = '—'; grid.textContent = tr('Die Apps konnten nicht geladen werden. Bitte lade die Seite erneut.'); });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
