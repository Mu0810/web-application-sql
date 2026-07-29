const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const memoryStorage = new Map();
const storage = {
  persistent: true,
  get(key, fallback = null) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value != null) memoryStorage.set(key, value);
      return value ?? memoryStorage.get(key) ?? fallback;
    } catch { this.persistent = false; return memoryStorage.get(key) ?? fallback; }
  },
  set(key, value) {
    memoryStorage.set(key, value);
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { this.persistent = false; }
  },
  clearPrefix(prefix) {
    [...memoryStorage.keys()].filter(key => key.startsWith(prefix)).forEach(key => memoryStorage.delete(key));
    try { Object.keys(localStorage).filter(key => key.startsWith(prefix)).forEach(key => localStorage.removeItem(key)); }
    catch { this.persistent = false; }
  }
};

// Progressive reveal: content remains visible if JavaScript or IntersectionObserver fails.
if ('IntersectionObserver' in window && !reducedMotion) {
  document.documentElement.classList.add('has-reveal');
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.08, rootMargin: '0px 0px -4%' });
  $$('.reveal').forEach(element => revealObserver.observe(element));
} else {
  $$('.reveal').forEach(element => element.classList.add('visible'));
}

// Cinematic terminal sequence.
const terminalLines = [
  'booting isolated learning environment…',
  'indexing 93 pages / 4 modules…',
  'mapping SQL · XML · XPath · LDAP · NoSQL…',
  'network: offline / database: simulated',
  'boundary controls: ready.'
];
async function runTerminal() {
  const body = $('#terminalBody');
  let target = $('#heroTyping');
  if (!body || !target) return;
  if (reducedMotion) { target.textContent = terminalLines.at(-1); return; }
  for (let lineIndex = 0; lineIndex < terminalLines.length; lineIndex += 1) {
    if (lineIndex > 0) {
      target.classList.remove('typing');
      const row = document.createElement('div');
      row.className = 'terminal-line';
      row.innerHTML = '<span class="prompt">$</span> <span class="typing"></span>';
      body.append(row);
      target = row.lastElementChild;
    }
    for (const character of terminalLines[lineIndex]) {
      target.textContent += character;
      await new Promise(resolve => setTimeout(resolve, 18));
    }
    await new Promise(resolve => setTimeout(resolve, 220));
  }
}
runTerminal();


// Deep links for every chapter heading and searchable course index.
function headingText(heading) {
  const clone = heading.cloneNode(true);
  clone.querySelectorAll('.icon, .anchor-link').forEach(node => node.remove());
  return clone.textContent.replace(/\s+/g, ' ').trim();
}
function slugify(text) {
  return text.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
const searchableHeadings = $$('main h2, main .content-block > h3');
const usedIds = new Set($$('[id]').map(element => element.id));
searchableHeadings.forEach(heading => {
  const title = headingText(heading);
  heading.dataset.searchTitle = title;
  if (!heading.id) {
    let candidate = slugify(title) || 'chapter';
    let suffix = 2;
    while (usedIds.has(candidate)) candidate = `${slugify(title)}-${suffix++}`;
    heading.id = candidate;
    usedIds.add(candidate);
  }
  if (heading.matches('.content-block > h3')) {
    const anchor = document.createElement('a');
    anchor.className = 'anchor-link';
    anchor.href = `#${heading.id}`;
    anchor.setAttribute('aria-label', `Link to ${title}`);
    anchor.textContent = '#';
    heading.append(anchor);
  }
});

// Accessible statement tabs with arrow-key navigation.
$$('.tabs').forEach((tabList, groupIndex) => {
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', 'SQL statement types');
  const buttons = $$('.tab-btn', tabList);
  buttons.forEach((button, index) => {
    const panel = $(`#${button.dataset.tab}`);
    const tabId = `statement-tab-${groupIndex}-${index}`;
    button.id = tabId;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    button.setAttribute('aria-selected', button.classList.contains('active'));
    button.tabIndex = button.classList.contains('active') ? 0 : -1;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.tabIndex = 0;
    button.addEventListener('click', () => activateTab(button, buttons));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1);
      next = (next + buttons.length) % buttons.length;
      activateTab(buttons[next], buttons);
      buttons[next].focus();
    });
  });
});
function activateTab(activeButton, buttons) {
  const parent = activeButton.closest('.content-block');
  buttons.forEach(button => {
    const active = button === activeButton;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active);
    button.tabIndex = active ? 0 : -1;
  });
  $$('.tab-content', parent).forEach(panel => panel.classList.toggle('active', panel.id === activeButton.dataset.tab));
}


// Clipboard with a legacy fallback for local-file previews.
window.copyCode = async button => {
  const text = $('code', button.closest('.code-block')).innerText;
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else {
      const textarea = Object.assign(document.createElement('textarea'), { value: text });
      document.body.append(textarea); textarea.select(); document.execCommand('copy'); textarea.remove();
    }
    button.textContent = 'Copied';
    setTimeout(() => { button.textContent = 'Copy'; }, 1400);
    showToast('Code copied to clipboard');
  } catch { showToast('Copy unavailable in this browser'); }
};
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
}

// Mobile navigation state.
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
  navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}
navToggle?.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
$$('.nav-links a').forEach(link => link.addEventListener('click', () => setMenu(false)));

// Scroll progress, section spy, visit history, and continue-learning state.
const courseSections = $$('section[id]');
const navAnchors = $$('.nav-links a');
const moduleSections = $$('.module-section');
moduleSections.forEach((section, index) => { section.dataset.section = `0${index + 1}`; });
const visitedModules = new Set(storage.get('sqli-visited', []));
const cards = $$('.module-card');
cards.forEach((card, index) => {
  const moduleId = `module${index + 1}`;
  const status = document.createElement('span');
  status.className = 'module-status';
  status.textContent = visitedModules.has(moduleId) ? 'VISITED' : `${$$('.content-block', $(`#${moduleId}`)).length} CHAPTERS`;
  card.append(status);
  card.classList.toggle('visited', visitedModules.has(moduleId));
});
function updateContinueLink() {
  const lastId = storage.get('sqli-last-module');
  const link = $('#continueLink');
  if (!link || !/^module[1-4]$/.test(lastId || '')) {
    if (link) link.hidden = true;
    return;
  }
  const moduleNumber = lastId.replace('module', 'Module ');
  link.href = `#${lastId}`;
  $('#continueLabel').textContent = `${moduleNumber} · Resume`;
  link.hidden = false;
}
updateContinueLink();

let ticking = false;
function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  const percent = scrollable > 0 ? Math.min(100, Math.max(0, scrollY / scrollable * 100)) : 0;
  $('#readingProgressBar').style.width = `${percent}%`;
  $('#railPercent').textContent = `${Math.round(percent)}%`;
  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateScrollUI); ticking = true; }
}, { passive: true });
updateScrollUI();


const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const id = entry.target.id;
  navAnchors.forEach(anchor => anchor.classList.toggle('active', anchor.hash === `#${id}`));
  $$('.course-rail a').forEach(anchor => anchor.classList.toggle('active', anchor.dataset.rail === id));
  if (/^module[1-4]$/.test(id)) {
    visitedModules.add(id);
    storage.set('sqli-visited', [...visitedModules]);
    storage.set('sqli-last-module', id);
    const card = $(`.module-card[href="#${id}"]`);
    if (card) {
      card.classList.add('visited');
      $('.module-status', card).textContent = 'VISITED';
    }
    const rail = $(`.course-rail a[data-rail="${id}"]`);
    rail?.classList.add('visited');
    updateContinueLink();
    window.updateLearningMission?.();
  }
}), { rootMargin: '-28% 0px -62%', threshold: 0 });
courseSections.forEach(section => sectionObserver.observe(section));
visitedModules.forEach(id => $(`.course-rail a[data-rail="${id}"]`)?.classList.add('visited'));

// Safe, local-only query boundary visualizer.
function analyze() {
  const input = $('#labInput');
  if (!input) return;
  const value = input.value;
  $('#unsafeQuery').textContent = `SELECT * FROM users WHERE username = '${value}'`;
  $('#boundValue').textContent = JSON.stringify(value);
  const structural = /['";]|--|\/\*|\b(or|and|union|select|drop)\b/i.test(value);
  $('#unsafeNote').innerHTML = structural
    ? '<b>Boundary changed:</b> control-like tokens entered the SQL string.'
    : '<b>Still fragile:</b> ordinary input appears valid, but concatenation remains unsafe.';
  const stream = $('#tokenStream');
  stream.replaceChildren();
  [['SELECT', ''], ['* FROM users', ''], ['WHERE username =', ''], [value || 'empty', structural ? 'token-input' : 'token-safe']]
    .forEach(([text, className]) => {
      const token = document.createElement('span');
      token.className = className;
      token.textContent = text;
      stream.append(token);
    });
}
$('#runLab')?.addEventListener('click', analyze);
$('#labInput')?.addEventListener('keydown', event => { if (event.key === 'Enter') analyze(); });
$$('.lab-presets button').forEach(button => button.addEventListener('click', () => {
  $('#labInput').value = button.dataset.value;
  analyze();
}));
analyze();

// Persistent defensive checklist.
const checklistItems = $$('.check-grid input');
const savedChecks = storage.get('sqli-checklist', []);
checklistItems.forEach((checkbox, index) => {
  checkbox.checked = Boolean(savedChecks[index]);
  checkbox.addEventListener('change', () => {
    storage.set('sqli-checklist', checklistItems.map(item => item.checked));
    updateChecklist();
  });
});
function updateChecklist() {
  const complete = checklistItems.filter(item => item.checked).length;
  $('#checkProgress').textContent = `${complete} / ${checklistItems.length} complete`;
  $('#checkBar').style.width = `${complete / checklistItems.length * 100}%`;
  window.updateLearningMission?.();
}
updateChecklist();


// Keyboard-first course search / command palette.
const searchDialog = $('#searchDialog');
const searchInput = $('#courseSearch');
const searchResults = $('#searchResults');
const searchIndex = searchableHeadings.map(heading => {
  const lesson = heading.closest('.content-block, .module-section, section');
  const aliases = /prepared statement/i.test(heading.dataset.searchTitle) ? 'parameterization parameterized query binding placeholders' : '';
  return {
    title: heading.dataset.searchTitle,
    id: heading.id,
    module: heading.closest('.module-section')?.dataset.section || (heading.closest('#book-map') ? 'MAP' : 'GUIDE'),
    searchableText: `${heading.dataset.searchTitle} ${lesson?.textContent || ''} ${aliases}`.toLowerCase()
  };
});
let selectedSearchIndex = 0;
let lastSearchTrigger = null;
let searchScrollY = 0;
function openSearch() {
  if (!searchDialog || searchDialog.open) return;
  lastSearchTrigger = document.activeElement;
  searchScrollY = scrollY;
  document.body.style.top = `-${searchScrollY}px`;
  document.body.classList.add('search-open');
  searchDialog.showModal();
  searchInput.setAttribute('aria-expanded', 'true');
  searchInput.value = '';
  renderSearch('');
  requestAnimationFrame(() => searchInput.focus());
}
function closeSearch() {
  if (!searchDialog?.open) return;
  searchDialog.close();
  searchInput.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('search-open');
  document.body.style.top = '';
  scrollTo(0, searchScrollY);
  lastSearchTrigger?.focus();
}
function renderSearch(query) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = searchIndex.filter(item => terms.every(term => item.searchableText.includes(term))).slice(0, 10);
  searchResults.replaceChildren();
  selectedSearchIndex = 0;
  if (!matches.length) {
    searchInput.setAttribute('aria-activedescendant', '');
    const empty = document.createElement('p');
    empty.className = 'search-empty';
    empty.textContent = `No chapter found for “${query}”`;
    searchResults.append(empty);
    return;
  }
  matches.forEach((item, index) => {
    const button = document.createElement('button');
    button.className = 'search-result';
    button.id = `search-option-${index}`;
    button.type = 'button';
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', index === 0);
    const module = document.createElement('span'); module.textContent = item.module;
    const copy = document.createElement('div');
    const title = document.createElement('strong'); title.textContent = item.title;
    const detail = document.createElement('small'); detail.textContent = `Jump to #${item.id}`;
    const arrow = document.createElement('b'); arrow.textContent = '↗';
    copy.append(title, detail); button.append(module, copy, arrow);
    button.addEventListener('click', () => {
      closeSearch();
      history.pushState(null, '', `#${item.id}`);
      $(`#${item.id}`).scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
    searchResults.append(button);
  });
  searchInput.setAttribute('aria-activedescendant', 'search-option-0');
}
function selectSearchResult(index) {
  const results = $$('.search-result', searchResults);
  if (!results.length) return;
  selectedSearchIndex = (index + results.length) % results.length;
  results.forEach((result, current) => result.setAttribute('aria-selected', current === selectedSearchIndex));
  searchInput.setAttribute('aria-activedescendant', results[selectedSearchIndex].id);
  results[selectedSearchIndex].scrollIntoView({ block: 'nearest' });
}
$('#searchTrigger')?.addEventListener('click', openSearch);
$('#searchClose')?.addEventListener('click', closeSearch);
searchInput?.addEventListener('input', event => renderSearch(event.target.value));
searchInput?.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') { event.preventDefault(); selectSearchResult(selectedSearchIndex + 1); }
  if (event.key === 'ArrowUp') { event.preventDefault(); selectSearchResult(selectedSearchIndex - 1); }
  if (event.key === 'Enter') { event.preventDefault(); $$('.search-result', searchResults)[selectedSearchIndex]?.click(); }
});
searchDialog?.addEventListener('click', event => { if (event.target === searchDialog) closeSearch(); });
searchDialog?.addEventListener('cancel', event => { event.preventDefault(); closeSearch(); });
document.addEventListener('keydown', event => {
  const inputFocused = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
  if (event.key === '/' && !inputFocused && !searchDialog?.open) { event.preventDefault(); openSearch(); }
});
