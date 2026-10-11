'use strict';
/* ---------- Data ---------- */
const TZ = 'Asia/Kolkata';
const EVENT_START = new Date('2026-10-13T16:00:00+05:30');
const VENUE = 'IEM Research Park';
const EVENTS = [
  {id:'e1', name:'Check-in and opening', time:'2026-10-13T16:00:00+05:30', desc:'Collect your entry slip, meet the coordinators and hear the rules for both rounds.'},
  {id:'e2', name:'Round 1: The Big Quiz', time:'2026-10-13T16:30:00+05:30', desc:'Questions on movies and web series, sports, music, pop culture and tech. Quickest correct answers score the most.'},
  {id:'e3', name:'Refreshment break', time:'2026-10-13T17:30:00+05:30', desc:'Snacks and drinks for every participant while scores for Round 1 are tallied.'},
  {id:'e4', name:'Round 2: Circuit Chaos', time:'2026-10-13T18:00:00+05:30', desc:'Analyse a circuit, apply the right laws, use logic and solve. Finalists from Round 1 compete.'},
  {id:'e5', name:'Results and prize distribution', time:'2026-10-13T19:30:00+05:30', desc:'Winners are announced and share the Rs. 10,000 prize pool.'}
];
const GALLERY = [
  ['Midnight hackathon', '\u{1F4BB}', '#ff6a13', '#1a0f3a'],
  ['Quiz finals on stage', '\u{1F9E0}', '#9ad8ff', '#1b2a6b'],
  ['Soldering at the circuit lab', '\u{1F50C}', '#ffb347', '#2a1140'],
  ['Robotics build day', '\u{1F916}', '#6ee7a8', '#10305a'],
  ['Guest talk', '\u{1F3A4}', '#ff8fa3', '#2b1250'],
  ['Winners with the trophy', '\u{1F3C6}', '#ffd166', '#0f2457']
];

/* ---------- Helpers ---------- */
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');
const fmtDate = iso => new Date(iso).toLocaleDateString('en-IN', {timeZone:TZ, day:'2-digit', month:'short', year:'numeric'});
const fmtTime = iso => new Date(iso).toLocaleTimeString('en-IN', {timeZone:TZ, hour:'numeric', minute:'2-digit', hour12:true});

/* ---------- 1. Digital clock (IST, every second) ---------- */
function tick(){
  const n = new Date();
  $('clock').textContent = n.toLocaleTimeString('en-GB', {timeZone:TZ, hour12:false});
  $('dateLine').textContent = n.toLocaleDateString('en-IN', {timeZone:TZ, weekday:'short', day:'2-digit', month:'short', year:'numeric'});
}
tick(); setInterval(tick, 1000);

/* ---------- 2. Countdown ---------- */
function countdown(){
  const diff = EVENT_START - Date.now();
  if (diff <= 0){
    ['cdD','cdH','cdM','cdS'].forEach(i => $(i).textContent = '00');
    $('cdNote').textContent = 'SYNAPSE has started. Head to IEM Research Park!';
    document.querySelector('.count h2').textContent = 'It is time';
    return;
  }
  $('cdD').textContent = pad(Math.floor(diff / 86400000));
  $('cdH').textContent = pad(Math.floor(diff % 86400000 / 3600000));
  $('cdM').textContent = pad(Math.floor(diff % 3600000 / 60000));
  $('cdS').textContent = pad(Math.floor(diff % 60000 / 1000));
}
countdown(); setInterval(countdown, 1000);

/* ---------- 3. Events rendered from the array (also fills the form dropdown) ---------- */
$('eventList').innerHTML = EVENTS.map(e => `
  <li class="ev">
    <div class="ev-time"><b>${fmtTime(e.time)}</b><span>${fmtDate(e.time)}</span></div>
    <div><h3>${e.name}</h3><p class="meta">Venue: ${VENUE}</p><p>${e.desc}</p></div>
  </li>`).join('');
$('event').innerHTML = '<option value="">Select event</option><option>SYNAPSE (both rounds)</option>' +
  EVENTS.filter(e => e.name.startsWith('Round')).map(e => `<option>${e.name}</option>`).join('');

/* ---------- 4. Photo wall ----------
   Put your 6 real photos in the images/ folder named gallery1.jpg ... gallery6.jpg.
   If a photo is missing, a themed picture is shown instead so the page never looks broken. */
function fallback(emoji, c1, c2){
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="200" y="185" font-size="120" text-anchor="middle">${emoji}</text></svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}
$('gal').innerHTML = GALLERY.map((g, i) =>
  `<figure tabindex="0"><img src="images/gallery${i + 1}.jpg" data-fb="${fallback(g[1], g[2], g[3])}" alt="${g[0]}" loading="lazy"><figcaption>${g[0]}</figcaption></figure>`).join('');
$('gal').querySelectorAll('img').forEach(img =>
  img.addEventListener('error', () => { img.src = img.dataset.fb; }, {once:true}));

/* ---------- 5. Validation (shared helper) ---------- */
function setError(id, msg){
  const box = $(id), err = $(id + 'Err');
  err.textContent = msg;
  box.classList.toggle('bad', !!msg);
  return !msg;
}
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const rules = {
  name:  v => !v.trim() ? 'Name is required.' : /^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v.trim()) ? '' : 'Enter a valid name using letters only.',
  roll:  v => !v ? 'Roll number is required.' : /^\d{10}$/.test(v) ? '' : 'Roll number must be exactly 10 digits.',
  dept:  v => v ? '' : 'Select your department.',
  email: v => !v.trim() ? 'Email is required.' : EMAIL.test(v.trim()) ? '' : 'Invalid email address!',
  phone: v => !v ? 'Phone number is required.' : /^[6-9]\d{9}$/.test(v) ? '' : 'Enter a valid 10-digit mobile number starting with 6-9.',
  event: v => v ? '' : 'Select an event.',
  fbName:  v => v.trim().length >= 2 ? '' : 'Please enter your name.',
  fbEmail: v => !v.trim() ? 'Email is required.' : EMAIL.test(v.trim()) ? '' : 'Invalid email address!',
  fbMsg:   v => v.trim().length >= 15 ? '' : 'Message must be at least 15 characters.'
};
const check = id => setError(id, rules[id]($(id).value));

// Live re-check as soon as the user types or changes a field
Object.keys(rules).forEach(id => {
  $(id).addEventListener('input', () => check(id));
  $(id).addEventListener('change', () => check(id));
});
document.querySelectorAll('input[name="gender"]').forEach(r => r.addEventListener('change', checkGender));
function checkGender(){
  return setError('gender', document.querySelector('input[name="gender"]:checked') ? '' : 'Select an option.');
}
function showStatus(el, msg, ok){ el.textContent = msg; el.className = 'status ' + (ok ? 'ok' : 'no'); }

$('regForm').addEventListener('submit', e => {
  e.preventDefault();
  const results = ['name','roll','dept','email','phone','event'].map(check);
  results.push(checkGender());
  if (results.includes(false)){
    showStatus($('formStatus'), 'Please fix the highlighted fields and try again.', false);
    const first = document.querySelector('#regForm input.bad, #regForm select.bad'); if (first) first.focus();
    return;
  }
  showStatus($('formStatus'), `Thank you, ${$('name').value.trim()}! You are registered for ${$('event').value}. See you on 13 October at ${VENUE}.`, true);
  e.target.reset();
});

$('fbForm').addEventListener('submit', e => {
  e.preventDefault();
  const results = ['fbName','fbEmail','fbMsg'].map(check);
  if (results.includes(false)){ showStatus($('fbStatus'), 'Please fix the highlighted fields.', false); return; }
  showStatus($('fbStatus'), 'Thanks for your feedback. The organisers will read it.', true);
  e.target.reset();
});

/* ---------- 6. Dark / light theme (saved in localStorage) ---------- */
function applyTheme(mode){
  document.body.classList.toggle('light', mode === 'light');
  $('themeBtn').innerHTML = mode === 'light' ? '&#9728;' : '&#9790;';
  try { localStorage.setItem('synapse-theme', mode); } catch (_) {}
}
let saved = null; try { saved = localStorage.getItem('synapse-theme'); } catch (_) {}
applyTheme(saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
$('themeBtn').addEventListener('click', () => applyTheme(document.body.classList.contains('light') ? 'dark' : 'light'));

/* ---------- 7. Mobile menu + highlight of current section ---------- */
const menu = $('menu'), burger = $('burger');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));
const links = [...menu.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
  });
}, {rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('main section').forEach(s => spy.observe(s));
