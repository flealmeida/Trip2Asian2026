const sheetId = '17Vms7DK3DCHMacpUZnR7veJsEAlYM1c1SWWXIS2M97w';
const sheetGid = '0';
const infoUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

const dateInput = document.getElementById('dateInput');
const loadBtn = document.getElementById('loadBtn');
const loadAllBtn = document.getElementById('loadAllBtn');
const status = document.getElementById('status');
const events = document.getElementById('events');
const sheetUrl = document.getElementById('sheetUrl');

sheetUrl.href = infoUrl;

async function fetchSheetCSV() {
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${sheetGid}`;
  try {
    status.textContent = 'Loading itinerary from Google Sheets…';
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    status.textContent = 'Sheet loaded successfully.';
    return parseCSV(text);
  } catch (err) {
    status.textContent = `Sheet load failed: ${err.message}. Please ensure the sheet is shared (Anyone with link can view) and published as CSV.`;
    throw err;
  }
}

function parseCSV(csv) {
  const rows = csv.trim().split('\n').map(line => line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/));
  const headers = rows[0].map(h => h.trim().replace(/^"|"$/g, ''));
  return rows.slice(1).map(row => {
    const item = {};
    headers.forEach((h, i) => { item[h] = row[i] ? row[i].replace(/^"|"$/g, '').trim() : '' });
    return item;
  });
}

function renderEntries(entries) {
  events.innerHTML = '';
  if (!entries.length) {
    events.innerHTML = '<div class="status">No events found for this date.</div>';
    return;
  }
  entries.sort((a,b)=> new Date(a.Date||a.date||'')-new Date(b.Date||b.date||''));
  for (const e of entries) {
    const card = document.createElement('article');
    card.className = 'event-card';
    card.innerHTML = `
      <h2>${e.Event || e.Description || 'No title'}</h2>
      <p><strong>When:</strong> ${e.Time || e.time || '—'} • <strong>Type:</strong> ${e.Type || e.type || '—'}</p>
      <p><strong>Place:</strong> ${e.Location || e.location || '—'}</p>
      ${renderLinkRow('Hotel', e.Hotel || e.hotel)}
      ${renderLinkRow('Flight', e.Flight || e.flight)}
      ${renderLinkRow('URL', e.URL || e.Link || e.link)}
      <p>${e.Notes || e.notes || ''}</p>
      <p class="tags">${e.Type || e.type || ''}</p>
    `;
    events.appendChild(card);
  }
}

function renderLinkRow(label, url) {
  if (!url) return '';
  const safeUrl = (url.startsWith('http://') || url.startsWith('https://')) ? url : `https://${url}`;
  return `<p><strong>${label}:</strong> <a href="${safeUrl}" target="_blank" rel="noreferrer">${url}</a></p>`;
`;
}

loadBtn.addEventListener('click', async () => {
  const date = dateInput.value;
  if (!date) {
    status.textContent = 'Pick a date first.';
    return;
  }
  try {
    const rows = await fetchSheetCSV();
    const normalizedDate = date;
    const matches = rows.filter(r => {
      const rowDate = (r.Date||r.date||'').split(' ')[0];
      return rowDate === normalizedDate;
    });
    renderEntries(matches);
    status.textContent = `${matches.length} plan(s) found for ${normalizedDate}.`;
  } catch (err) {
    console.error(err);
  }
});

loadAllBtn.addEventListener('click', async () => {
  try {
    const rows = await fetchSheetCSV();
    renderEntries(rows);
    status.textContent = `${rows.length} total rows loaded.`;
  } catch (err) {
    console.error(err);
  }
});

// Optionally prefill today
dateInput.value = new Date().toISOString().slice(0, 10);
