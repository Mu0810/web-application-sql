/* ============================================================
   SOURCE COVERAGE LEDGER
   A non-verbatim, defensive map of every supplied source page.
   Ranges are deliberately non-overlapping so the 93-page claim is
   machine-checkable rather than editorial copy.
   ============================================================ */

(() => {
  const coverage = Object.freeze([
    { pages: [1, 2], section: 'front', title: 'Cover and publication context', target: 'course-brief-title', summary: 'Course identity, publication metadata, contributor roles, ownership notice, and the private/local authorized-use boundary.' },
    { pages: [3, 4], section: 'front', title: 'Reader note and contents', target: 'book-map', summary: 'Standalone-ebook note, omitted video/exercise disclosure, editorial welcome, and the five-part table of contents.' },
    { pages: [5, 8], section: 'front', title: 'Course and instructor profile', target: 'course-brief-title', summary: 'Course goals, 18 CPE self-paced format, expected skills and prerequisites, plus Thomas Sermpinis’s security and programming background.' },
    { pages: [9, 10], section: 'pre', title: 'Web applications, SQL, and suggested reading', target: 'reading', summary: 'Client/server web application context and prerequisite reading for SQL, web applications, and SQL injection.' },
    { pages: [11, 13], section: 'pre', title: 'Data stores and optional isolated lab', target: 'lab-setup', summary: 'Data-store definition and historic VirtualBox, Linux, XAMPP, and DVWA setup guidance, retained only as isolated-lab context.' },

    { pages: [14, 14], section: 'm1', title: 'Module 1 divider', target: 'module1', summary: 'Introduction to SQL, data stores, data-store injection, and SQL injection.' },
    { pages: [15, 16], section: 'm1', title: 'SQL, data stores, and procedural differences', target: 'what-is-a-data-store', summary: 'Structured data stores drive application logic; interpreted SQL and product-specific extensions create distinct security behavior.' },
    { pages: [17, 18], section: 'm1', title: 'Injection boundaries and login logic', target: 'how-injection-attacks-work', summary: 'Interpreter-boundary failure, application-layer access control, unsafe query construction, and authentication-query manipulation.' },
    { pages: [19, 21], section: 'm1', title: 'XML request flow and external entities', target: 'xml-injection-xxe', summary: 'XML in browser/server and service communication, internal and external entities, file/network resolution, proxying, scanning, and denial-of-service risk.' },
    { pages: [22, 23], section: 'm1', title: 'Server-side JavaScript injection', target: 'javascript-injection-ssji', summary: 'The danger of evaluating request text as JavaScript, server-side module access, and parsing JSON as data rather than executable code.' },
    { pages: [24, 26], section: 'm1', title: 'Client trust, SQL strings, and statement contexts', target: 'application-trust-boundaries', summary: 'Hidden browser state is untrusted; quotes, comments, balanced expressions, WHERE logic, and non-SELECT statement contexts are introduced.' },
    { pages: [27, 28], section: 'm1', title: 'INSERT, UPDATE, DELETE, and UNION', target: 'sql-injection-different-statement-types', summary: 'How different SQL verbs change impact, followed by UNION as a way to combine compatible result sets.' },
    { pages: [29, 30], section: 'm1', title: 'UNION structural matching', target: 'union-operator-and-structural-matching', summary: 'Column count, compatible data types, NULL placeholders, and finding a displayed text field.' },
    { pages: [31, 33], section: 'm1', title: 'Database fingerprinting', target: 'database-fingerprinting', summary: 'Error styles, version sources, inference, engine-specific functions, concatenation, and the limits of stack-based assumptions.' },

    { pages: [34, 34], section: 'm2', title: 'Module 2 divider', target: 'module2', summary: 'Advanced SQL injection module opening.' },
    { pages: [35, 36], section: 'm2', title: 'Metadata-led extraction workflow', target: 'data-extraction-methodology', summary: 'Determine result shape, inspect metadata catalogs, focus relevant tables and columns, and concatenate values into a visible field.' },
    { pages: [37, 38], section: 'm2', title: 'Why input filters fail', target: 'filters-are-not-a-primary-defense', summary: 'Equivalent syntax, encodings, comments, whitespace, character functions, and validation-order defects demonstrate blacklist limits.' },
    { pages: [39, 40], section: 'm2', title: 'Second-order injection', target: 'second-order-injection', summary: 'A value handled during storage becomes dangerous when a later feature trusts and concatenates it into a new query.' },
    { pages: [41, 44], section: 'm2', title: 'Hidden results and alternate channels', target: 'when-results-are-not-returned', summary: 'Out-of-band network features, numeric responses, character-to-number conversion, and identifier mapping as unintended channels.' },
    { pages: [45, 47], section: 'm2', title: 'Blind Boolean and error inference', target: 'blind-and-time-based-inference', summary: 'True/false page behavior, conditional evaluation, character inference, and conditional errors when direct query output is absent.' },
    { pages: [48, 50], section: 'm2', title: 'Blind inference with time signals', target: 'blind-and-time-based-inference', summary: 'Engine-specific delays, conditional latency, bitwise request reduction, and the defensive value of correlating low-volume timing anomalies.' },
    { pages: [51, 54], section: 'm2', title: 'Database-to-file-system boundary', target: 'from-database-access-to-file-system-risk', summary: 'Historic read, write, bulk, and command-capable features illustrate why DBMS service identity and file/OS privileges matter.' },
    { pages: [55, 55], section: 'm2', title: 'Module 2 references', target: 'reading', summary: 'The Web Application Hacker’s Handbook, OWASP blind SQL guidance, time-based research, and SQL-to-operating-system-control research.' },

    { pages: [56, 56], section: 'm3', title: 'Module 3 divider', target: 'module3', summary: 'Encoding, automation, XPath, and LDAP module opening.' },
    { pages: [57, 60], section: 'm3', title: 'Encoding and evasion taxonomy', target: 'encoding-and-evasion-taxonomy', summary: 'URL, character, and hexadecimal encodings; comments, NUL, whitespace, concatenation, and logically equivalent forms.' },
    { pages: [61, 65], section: 'm3', title: 'Authorized automation tools', target: 'automation-in-an-authorized-lab', summary: 'Historic sqlmap and SQLninja capabilities, manual context requirements, false-result risk, destructive potential, backups, and authorization.' },
    { pages: [66, 70], section: 'm3', title: 'XPath and blind XML inference', target: 'xpath-injection', summary: 'XPath selection, case sensitivity, Booleanization, substring and length tests, node counting, XML crawling, and high request volume.' },
    { pages: [71, 73], section: 'm3', title: 'LDAP filter injection', target: 'ldap-injection', summary: 'Simple, disjunctive, and conjunctive filters; hard-coded attributes; blind behavior; wildcard broadening; batching; and historic NUL truncation.' },
    { pages: [74, 74], section: 'm3', title: 'Module 3 references', target: 'reading', summary: 'The Web Application Hacker’s Handbook and OWASP LDAP and XPath injection guidance.' },

    { pages: [75, 75], section: 'm4', title: 'Module 4 divider', target: 'module4', summary: 'Data-store web-application security measures module opening.' },
    { pages: [76, 78], section: 'm4', title: 'NoSQL injection', target: 'nosql-injection', summary: 'Diverse non-relational query models, object-shaped input, type confusion, special operators, and parser-created nested objects.' },
    { pages: [79, 80], section: 'm4', title: 'Positive and negative validation', target: 'validation-contracts-and-output-contexts', summary: 'Known value, type, size, range, and content checks; anchored formats; allowlists; and the incompleteness of blacklists.' },
    { pages: [81, 82], section: 'm4', title: 'Output contexts and pattern semantics', target: 'validation-contracts-and-output-contexts', summary: 'Contextual handling, valid punctuation, the fragility of hand-escaping dynamic SQL, and literal treatment of LIKE wildcards.' },
    { pages: [83, 85], section: 'm4', title: 'Parameterized query APIs', target: 'prepared-statements-structure-first-values-second', summary: 'Structure-first/value-second binding, positional and named placeholders, mandatory use for every value, second-order safety, and structural allowlists.' },
    { pages: [86, 87], section: 'm4', title: 'Least privilege, views, and canonical forms', target: 'least-privilege-and-sensitive-data', summary: 'Separate identities, granular views/procedures, restricted DBMS service accounts, and the beginning of canonicalization guidance.' },
    { pages: [88, 89], section: 'm4', title: 'Nested encodings and Unicode normalization', target: 'canonicalization-and-unicode-normalization', summary: 'Single ownership of decoding, rejection of unexpected nesting, well-formed Unicode, documented normalization, and the risk of lossy character-set conversion.' },
    { pages: [90, 90], section: 'm4', title: 'Sensitive-data handling', target: 'least-privilege-and-sensitive-data', summary: 'Modern password hashing, protected financial data, external key custody, retention limits, archiving, and deletion.' },
    { pages: [91, 92], section: 'm4', title: 'Securing LDAP, XPath, and NoSQL', target: 'ldap-xpath-and-nosql-hardening', summary: 'Dedicated escaping/binding APIs, fixed query structure, schema and type validation, least privilege, middleware authorization, and encryption.' },
    { pages: [93, 93], section: 'm4', title: 'Conclusion and reading material', target: 'reading', summary: 'Injection as one family of interpreter-boundary failures, whole-system understanding, continued research, and the final reading list.' }
  ]);

  window.BOOK_COVERAGE = coverage;

  const sectionLabels = {
    front: 'FRONT MATTER', pre: 'PRE-COURSE', m1: 'MODULE 01',
    m2: 'MODULE 02', m3: 'MODULE 03', m4: 'MODULE 04'
  };
  const pageHost = document.querySelector('#pageConstellation');
  const ledgerHost = document.querySelector('#coverageLedger');
  const detail = document.querySelector('#auditDetail');
  if (!pageHost || !ledgerHost || !detail) return;

  const pageOwners = new Map();
  coverage.forEach((range, rangeIndex) => {
    for (let page = range.pages[0]; page <= range.pages[1]; page += 1) {
      if (pageOwners.has(page)) console.error(`Coverage overlap on page ${page}`);
      pageOwners.set(page, rangeIndex);
    }
  });
  const unassigned = Array.from({ length: 93 }, (_, index) => index + 1).filter(page => !pageOwners.has(page));
  if (unassigned.length) console.error('Unassigned source pages:', unassigned);

  function pageLabel(range) {
    const [start, end] = range.pages;
    return start === end ? `Page ${String(start).padStart(2, '0')}` : `Pages ${String(start).padStart(2, '0')}–${String(end).padStart(2, '0')}`;
  }

  const pageButtons = [];
  for (let page = 1; page <= 93; page += 1) {
    const rangeIndex = pageOwners.get(page);
    const range = coverage[rangeIndex];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-node';
    button.tabIndex = page === 1 ? 0 : -1;
    button.dataset.page = String(page);
    button.dataset.section = range.section;
    button.dataset.range = String(rangeIndex);
    button.setAttribute('aria-controls', 'auditDetail');
    button.setAttribute('aria-label', `Page ${page}: ${range.title}`);
    button.innerHTML = `<span>${String(page).padStart(2, '0')}</span>`;
    button.addEventListener('click', () => selectRange(rangeIndex, page));
    pageHost.append(button);
    pageButtons.push(button);
  }

  coverage.forEach((range, index) => {
    const article = document.createElement('article');
    article.className = 'ledger-row';
    article.dataset.section = range.section;
    article.dataset.range = String(index);
    article.innerHTML = `
      <div><span>${sectionLabels[range.section]}</span><strong>${pageLabel(range)}</strong></div>
      <div><h3>${range.title}</h3><p>${range.summary}</p></div>
      <a href="#${range.target}" aria-label="Open mapped section for ${range.title}"><i aria-hidden="true"></i></a>`;
    ledgerHost.append(article);
  });

  function selectRange(index, selectedPage = coverage[index].pages[0]) {
    const range = coverage[index];
    pageButtons.forEach(button => {
      const inRange = Number(button.dataset.range) === index;
      const isSelectedPage = Number(button.dataset.page) === selectedPage;
      button.classList.toggle('selected', inRange);
      button.classList.toggle('current', isSelectedPage);
      button.tabIndex = isSelectedPage ? 0 : -1;
      button.setAttribute('aria-pressed', String(isSelectedPage));
    });
    document.querySelectorAll('.ledger-row').forEach(row => row.classList.toggle('selected', Number(row.dataset.range) === index));
    detail.dataset.section = range.section;
    detail.querySelector('span').textContent = `${sectionLabels[range.section]} · SELECTED PAGE ${String(selectedPage).padStart(2, '0')}`;
    detail.querySelector('strong').textContent = pageLabel(range);
    detail.querySelector('h3').textContent = range.title;
    detail.querySelector('p').textContent = range.summary;
    detail.querySelector('a').href = `#${range.target}`;
    const activeRow = document.querySelector(`.ledger-row[data-range="${index}"]`);
    activeRow?.scrollIntoView({ block: 'nearest', behavior: document.documentElement.dataset.motion === 'calm' ? 'auto' : 'smooth' });
  }

  pageHost.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const visibleButtons = pageButtons.filter(button => !button.hidden);
    const activeIndex = visibleButtons.indexOf(document.activeElement);
    if (activeIndex < 0) return;
    event.preventDefault();
    let nextIndex = activeIndex;
    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = visibleButtons.length - 1;
    else nextIndex = (activeIndex + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + visibleButtons.length) % visibleButtons.length;
    const nextButton = visibleButtons[nextIndex];
    selectRange(Number(nextButton.dataset.range), Number(nextButton.dataset.page));
    nextButton.focus();
  });

  const filterControls = [...document.querySelectorAll('[data-audit-filter]')];
  filterControls.forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
      const filter = button.dataset.auditFilter;
      filterControls.forEach(control => {
        const isActive = control === button;
        control.classList.toggle('active', isActive);
        control.setAttribute('aria-pressed', String(isActive));
      });
      pageButtons.forEach(node => { node.hidden = filter !== 'all' && node.dataset.section !== filter; });
      document.querySelectorAll('.ledger-row').forEach(row => { row.hidden = filter !== 'all' && row.dataset.section !== filter; });
      const first = coverage.findIndex(range => filter === 'all' || range.section === filter);
      if (first >= 0) selectRange(first);
    });
  });

  const sourceBadges = {
    'what-is-a-data-store': 'PP 15–16',
    'application-trust-boundaries': 'PP 15–17 · 24',
    'how-injection-attacks-work': 'PP 17–18',
    'sql-injection-login-bypass': 'PP 17–18',
    'xml-injection-xxe': 'PP 18–21',
    'javascript-injection-ssji': 'PP 21–23',
    'sql-injection-different-statement-types': 'PP 24–28',
    'union-operator-and-structural-matching': 'PP 28–30',
    'database-fingerprinting': 'PP 31–33',
    'data-extraction-methodology': 'PP 35–36',
    'filters-are-not-a-primary-defense': 'PP 37–38',
    'second-order-injection': 'PP 39–40',
    'when-results-are-not-returned': 'PP 41–44',
    'blind-and-time-based-inference': 'PP 45–50',
    'from-database-access-to-file-system-risk': 'PP 51–54',
    'encoding-and-evasion-taxonomy': 'PP 57–60',
    'automation-in-an-authorized-lab': 'PP 61–65',
    'xpath-injection': 'PP 66–70',
    'ldap-injection': 'PP 71–73',
    'nosql-injection': 'PP 76–78',
    'validation-contracts-and-output-contexts': 'PP 79–82',
    'the-secure-query-pipeline': 'PP 79–85',
    'prepared-statements-structure-first-values-second': 'PP 83–85',
    'canonicalization-and-unicode-normalization': 'PP 87–89',
    'least-privilege-and-sensitive-data': 'PP 86–90',
    'ldap-xpath-and-nosql-hardening': 'PP 91–92'
  };

  Object.entries(sourceBadges).forEach(([id, label]) => {
    const heading = document.getElementById(id);
    const block = heading?.closest('.content-block');
    if (!heading || !block) return;
    block.dataset.sourcePages = label;
    const badge = document.createElement('a');
    badge.className = 'source-pages';
    badge.href = '#source-audit';
    badge.textContent = `SOURCE ${label}`;
    badge.setAttribute('aria-label', `${label} in the attached source; open source audit`);
    const controls = block.querySelector('.lesson-controls');
    (controls || heading).insertAdjacentElement('afterend', badge);
  });

  document.querySelector('#auditPageCount').textContent = String(pageOwners.size);
  document.querySelector('#auditRangeCount').textContent = String(coverage.length);
  document.querySelector('#auditLessonCount').textContent = String(document.querySelectorAll('.module-section .content-block').length);
  selectRange(0);
})();
