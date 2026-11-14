import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd(), out = path.join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp('hub', out, { recursive: true });
await cp('node_modules/qrcode-generator/dist/qrcode.js', path.join(out, 'qrcode.js'));
const apps = [];
for (const entry of await readdir('apps', { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
  if (!/^[a-z0-9-]+$/.test(entry.name)) throw new Error(`Ungültiger App-Ordner: ${entry.name}`);
  const dir = path.join('apps', entry.name);
  const meta = JSON.parse(await readFile(path.join(dir, 'app.json'), 'utf8'));
  for (const field of ['name', 'description', 'category']) if (typeof meta[field] !== 'string' || !meta[field].trim()) throw new Error(`${dir}: ${field} fehlt`);
  await readFile(path.join(dir, 'index.html'));
  apps.push({ name: meta.name, description: meta.description, category: meta.category, url: `apps/${entry.name}/`, icon: meta.icon || '✦', color: meta.color || '#a8b5ff' });
  await cp(dir, path.join(out, 'apps', entry.name), { recursive: true });
}
await writeFile(path.join(out, 'apps.json'), JSON.stringify(apps, null, 2));
console.log(`${apps.length} Apps gebaut.`);
// Versioned precache: an update is installed only after every local asset is available.
const { createHash } = await import('node:crypto');
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]))).flat();
}
const assetFiles = (await files(out)).sort();
const hash = createHash('sha256');
for (const file of assetFiles) { hash.update(path.relative(out, file)); hash.update(await readFile(file)); }
const assets = assetFiles.map(file => './' + path.relative(out, file).split(path.sep).join('/'));
await writeFile(path.join(out, 'sw.js'), `const CACHE = ${JSON.stringify('opendisplayhub-' + hash.digest('hex').slice(0, 16))};\nconst ASSETS = ${JSON.stringify(assets)};\n` + await readFile('scripts/sw-template.js', 'utf8'));
