const grid = document.querySelector('#apps-grid');
const dialog = document.querySelector('#setup-dialog');
const openApp = document.querySelector('#open-app');
const search = document.querySelector('#app-search');
const headerSearch = document.querySelector('#header-search');
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
function icon(app) { const image = document.createElement('img'); image.src = app.icon; image.alt = ''; return image; }
function selectCategory(category) { selectedCategory = category; render(); document.querySelector('#apps').scrollIntoView({ behavior: 'smooth' }); }
function render() {
  const featured = document.querySelector('#featured');
  featured.hidden = !apps.length;
  if (apps.length) {
    const item = localize(apps[0]);
    document.querySelector('#featured-title').textContent = item.name;
    document.querySelector('#featured-category').textContent = item.category;
    document.querySelector('#featured-description').textContent = item.description;
    document.querySelector('#featured-icon').src = item.icon;
    document.querySelector('#featured-open').onclick = () => setup(apps[0]);
  }
  const highlights = document.querySelector('#highlights-list'); highlights.replaceChildren();
  apps.slice(0, 6).forEach(app => {
    const item = localize(app), button = document.createElement('button'); button.className = 'highlight';
    const info = document.createElement('span'), name = document.createElement('strong'), category = document.createElement('small'), get = document.createElement('span');
    name.textContent = item.name; category.textContent = `${item.category} · weisser-dev`; get.className = 'get'; get.textContent = tr('Ansehen');
    info.append(name, category); button.append(icon(app), info, get); button.addEventListener('click', () => setup(app)); highlights.append(button);
  });
  const filters = document.querySelector('#categories'), cards = document.querySelector('#category-cards'); filters.replaceChildren(); cards.replaceChildren();
  const categories = [...new Set(apps.map(app => app.category))];
  for (const category of ['', ...categories]) {
    const button = document.createElement('button'); button.className = 'filter';
    button.setAttribute('aria-pressed', String(category === selectedCategory));
    const name = category ? localize(apps.find(app => app.category === category)).category : tr('Alle');
    button.textContent = name; button.addEventListener('click', () => { selectedCategory = category; render(); }); filters.append(button);
    if (category) {
      const card = document.createElement('button'); card.className = 'category-card';
      const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); symbol.setAttribute('viewBox', '0 0 32 32'); symbol.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d','M6 5h20v22H6z M11 11h10 M11 16h10 M11 21h7'); symbol.append(path);
      const text = document.createElement('span'), title = document.createElement('strong'), detail = document.createElement('small'); title.textContent = name; detail.textContent = tr('Apps entdecken'); text.append(title, detail); card.append(symbol, text);
      card.addEventListener('click', () => selectCategory(category)); cards.append(card);
    }
  }
  const query = search.value.trim().toLocaleLowerCase();
  const matches = apps.filter(app => { const item = localize(app); return (!selectedCategory || app.category === selectedCategory) && `${item.name} ${item.description} ${item.category}`.toLocaleLowerCase().includes(query); });
  document.querySelector('#count').textContent = `${matches.length} ${matches.length === 1 ? 'App' : 'Apps'}`;
  grid.replaceChildren();
  if (!matches.length) { grid.textContent = tr('Keine passenden Apps gefunden.'); return; }
  matches.forEach(app => {
    const item = localize(app), card = document.createElement('article'); card.className = 'card';
    const visual = document.createElement('div'); visual.className = 'card-visual'; visual.append(icon(app));
    const info = document.createElement('div'); info.className = 'card-info';
    const title = document.createElement('h3'); title.textContent = item.name;
    const category = document.createElement('span'); category.className = 'category'; category.textContent = `${item.category} · weisser-dev`;
    const desc = document.createElement('p'); desc.textContent = item.description;
    const button = document.createElement('button'); button.className = 'card-link'; button.textContent = tr('Ansehen'); button.addEventListener('click', () => setup(app));
    info.append(title, category, desc, button); card.append(visual, info); grid.append(card);
  });
}
search.addEventListener('input', () => { headerSearch.value = search.value; render(); });
headerSearch.addEventListener('input', () => { search.value = headerSearch.value; render(); });
headerSearch.addEventListener('keydown', event => { if (event.key === 'Enter') document.querySelector('#apps').scrollIntoView({ behavior: 'smooth' }); });
window.addEventListener('languagechange', render);
fetch('apps.json').then(r => { if (!r.ok) throw Error(); return r.json(); }).then(data => { apps = data; render(); }).catch(() => { document.querySelector('#count').textContent = ''; grid.textContent = tr('Die Apps konnten nicht geladen werden. Bitte lade die Seite erneut.'); });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
