/* ============================================================
   PRIVATE MAIN PAGE — JS
   Matches privatemainpage.html structure exactly
   ============================================================ */

// ── TAB SWITCHING ──────────────────────────────────────────
// HTML uses: data-tab="wip" → id="tab-wip"
const tabBtns  = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.tab-section');

function showSection(tabId) {
  sections.forEach(s => {
    s.classList.toggle('active', s.id === 'tab-' + tabId);
  });
  tabBtns.forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
  localStorage.setItem('pmp-active-tab', tabId);
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.tab));
});

// Restore last active tab on load
const savedTab = localStorage.getItem('pmp-active-tab');
if (savedTab && document.getElementById('tab-' + savedTab)) {
  showSection(savedTab);
} else {
  showSection('wip');
}


// ── NOTES SYSTEM ───────────────────────────────────────────
// Matches HTML IDs: notesArea, exportBtn, importBtn, importFile, clearBtn, notesAlert, notesMeta
const STORAGE_KEY = 'pmp-notes';

const notesArea  = document.getElementById('notesArea');
const exportBtn  = document.getElementById('exportBtn');
const importBtn  = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const clearBtn   = document.getElementById('clearBtn');
const notesAlert = document.getElementById('notesAlert');
const notesMeta  = document.getElementById('notesMeta');

function updateMeta() {
  if (!notesArea || !notesMeta) return;
  const chars = notesArea.value.length;
  const words = notesArea.value.trim().split(/\s+/).filter(Boolean).length;
  notesMeta.textContent = `${chars} character${chars !== 1 ? 's' : ''} · ${words} word${words !== 1 ? 's' : ''}`;
}

function showNotesAlert(message, type = 'success') {
  if (!notesAlert) return;
  notesAlert.textContent = message;
  notesAlert.className = `alert alert-${type} show`;
  clearTimeout(notesAlert._timer);
  notesAlert._timer = setTimeout(() => notesAlert.classList.remove('show'), 3000);
}

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (notesArea) notesArea.value = data.content || '';
      updateMeta();
    }
  } catch (e) {
    console.warn('Could not load notes:', e);
  }
}

let saveTimer;
function scheduleAutoSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (!notesArea) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      content:   notesArea.value,
      savedAt:   new Date().toISOString(),
      wordCount: notesArea.value.trim().split(/\s+/).filter(Boolean).length,
    }));
  }, 800);
}

if (notesArea) {
  notesArea.addEventListener('input', () => {
    updateMeta();
    scheduleAutoSave();
  });
  loadNotes();
}

if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    const content = notesArea ? notesArea.value : '';
    if (!content.trim()) {
      showNotesAlert('Nothing to export — notes are empty.', 'error');
      return;
    }
    const payload = {
      source:     'Private Main Page — Notes',
      exportedAt: new Date().toISOString(),
      content,
      wordCount:  content.trim().split(/\s+/).filter(Boolean).length,
      charCount:  content.length,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const ts   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.href     = url;
    link.download = `notes-${ts}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotesAlert('Notes exported successfully!', 'success');
  });
}

if (importBtn) {
  importBtn.addEventListener('click', () => importFile && importFile.click());
}

if (importFile) {
  importFile.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      showNotesAlert('Please select a valid .json file.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result);
        const text = typeof data.content === 'string' ? data.content
                   : typeof data === 'string' ? data : '';
        if (notesArea) {
          notesArea.value = text;
          updateMeta();
          scheduleAutoSave();
          showNotesAlert('Notes imported successfully!', 'success');
        }
      } catch {
        showNotesAlert('Failed to parse the JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    importFile.value = '';
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (!notesArea) return;
    if (!notesArea.value.trim()) {
      showNotesAlert('Notes are already empty.', 'error');
      return;
    }
    if (confirm('Clear all notes? This cannot be undone.')) {
      notesArea.value = '';
      updateMeta();
      scheduleAutoSave();
      showNotesAlert('Notes cleared.', 'success');
    }
  });
}


// ── HAMBURGER MENU (MOBILE) ────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    })
  );
}


// ── FADE-IN CARDS ON LOAD ──────────────────────────────────
document.querySelectorAll('.card').forEach((card, i) => {
  card.style.opacity    = '0';
  card.style.transform  = 'translateY(20px)';
  card.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
  requestAnimationFrame(() => {
    card.style.opacity   = '1';
    card.style.transform = 'translateY(0)';
  });
});