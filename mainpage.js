/* ============================================================
   MAIN PAGE JS
   ============================================================ */

// ── TAB SWITCHING ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));

    btn.classList.add('active');
    const section = document.getElementById('tab-' + target);
    if (section) section.classList.add('active');
  });
});

// ── CODE VALIDATION ──
const CORRECT_CODE = '27251006';

function validateCode() {
  const input = document.getElementById('accessCode');
  const errEl = document.getElementById('alertError');
  const okEl  = document.getElementById('alertSuccess');
  const code  = input.value.trim();

  errEl.classList.remove('show');
  okEl.classList.remove('show');

  if (code === CORRECT_CODE) {
    okEl.classList.add('show');
    input.style.borderColor = 'var(--success)';
    input.style.boxShadow   = '0 0 0 3px rgba(79,209,197,0.15)';
  } else {
    errEl.classList.add('show');
    input.style.borderColor = 'var(--danger)';
    input.style.boxShadow   = '0 0 0 3px rgba(255,92,122,0.15)';
    shakeInput(input);
  }
}

function shakeInput(el) {
  el.style.transform = 'translateX(-6px)';
  setTimeout(() => el.style.transform = 'translateX(6px)', 80);
  setTimeout(() => el.style.transform = 'translateX(-4px)', 160);
  setTimeout(() => el.style.transform = 'translateX(4px)',  240);
  setTimeout(() => el.style.transform = 'translateX(0)',    320);
}

// Allow Enter key
document.getElementById('accessCode').addEventListener('keydown', e => {
  if (e.key === 'Enter') validateCode();
});

// ── HAMBURGER ──
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
