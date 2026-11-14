const key = 'opendisplayhub.notes.v1';
const $ = selector => document.querySelector(selector);
let notes = [], editing = null, recognition = null;
const status = $('#status');
try { const saved = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(saved)) throw Error(); notes = saved; }
catch { status.textContent = 'Notizen konnten nicht geladen werden. Prüfe den lokalen Speicher.'; }
function persist(next) {
  try { localStorage.setItem(key, JSON.stringify(next)); notes = next; status.textContent = ''; return true; }
  catch { status.textContent = 'Speichern nicht möglich. Bitte prüfe den lokalen Speicher.'; return false; }
}
function makeTitle(text) { const first = text.trim().split(/\s+/).slice(0, 6).join(' '); return first.length > 48 ? first.slice(0, 47).trimEnd() + '…' : first + (text.trim().split(/\s+/).length > 6 ? '…' : ''); }
function render() {
  const container = $('#notes'); container.replaceChildren();
  $('#count').textContent = `${notes.length}`; $('#empty').hidden = notes.length > 0;
  const query = $('#search').value.trim().toLocaleLowerCase('de-DE');
  $('#search').hidden = notes.length === 0;
  const filtered = notes.filter(note => `${note.title || ''} ${note.text}`.toLocaleLowerCase('de-DE').includes(query));
  $('#no-results').hidden = !query || filtered.length > 0;
  for (const note of filtered) {
    const button = document.createElement('button'); button.className = 'note';
    const text = document.createElement('strong'); text.textContent = note.title || makeTitle(note.text);
    const date = document.createElement('small'); date.textContent = new Date(note.created || note.updated).toLocaleString('de-DE', { dateStyle:'medium', timeStyle:'short' });
    const preview = document.createElement('span'); preview.className = 'note-preview'; preview.textContent = note.text;
    button.append(text, preview, date); button.addEventListener('click', () => edit(note)); container.append(button);
  }
}
function edit(note = null) {
  editing = note?.id || null; $('#home').hidden = true; $('#editor').hidden = false;
  $('#editor-title').textContent = note ? 'Notiz bearbeiten' : 'Neue Notiz';
  $('#note-title').value = note?.title || ''; $('#note-text').value = note?.text || ''; $('#delete').hidden = !note; $('#speech-status').textContent = '';
  $('#note-text').focus();
}
function home() { if (recognition) recognition.stop(); $('#editor').hidden = true; $('#home').hidden = false; render(); $('#new').focus(); }
$('#search').addEventListener('input', render);
$('#new').addEventListener('click', () => edit()); $('#cancel').addEventListener('click', home);
$('#save').addEventListener('click', () => {
  const text = $('#note-text').value.trim(); if (!text) { $('#speech-status').textContent = 'Bitte gib zuerst eine Notiz ein.'; return; }
  const existing = notes.find(note => note.id === editing);
  const item = { id: editing || `${Date.now()}-${Math.random().toString(36).slice(2)}`, title: $('#note-title').value.trim(), text, created: existing?.created || existing?.updated || Date.now(), updated: Date.now() };
  if (persist([item, ...notes.filter(note => note.id !== editing)])) home();
});
$('#delete').addEventListener('click', () => { if (confirm('Diese Notiz löschen?') && persist(notes.filter(note => note.id !== editing))) home(); });
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  $('#dictate').hidden = false;
  $('#dictate').addEventListener('click', () => {
    if (recognition) { recognition.stop(); return; }
    recognition = new SpeechRecognition(); recognition.lang = 'de-DE'; recognition.interimResults = false;
    recognition.onstart = () => { $('#dictate').textContent = '■ Spracheingabe stoppen'; $('#speech-status').textContent = 'Ich höre zu …'; };
    recognition.onresult = event => { const field = $('#note-text'); field.value += (field.value.trim() ? ' ' : '') + event.results[0][0].transcript; };
    recognition.onerror = () => { $('#speech-status').textContent = 'Spracheingabe nicht verfügbar. Nutze die Spracheingabe deiner Tastatur oder schreibe deine Notiz.'; };
    recognition.onend = () => { recognition = null; $('#dictate').textContent = '● Spracheingabe starten'; if ($('#speech-status').textContent === 'Ich höre zu …') $('#speech-status').textContent = 'Spracheingabe beendet. Du kannst deine Notiz bearbeiten und speichern.'; };
    try { recognition.start(); } catch { recognition = null; $('#speech-status').textContent = 'Spracheingabe konnte nicht gestartet werden.'; }
  });
}
render();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('../../sw.js', { scope: '../../' }).catch(() => {});
