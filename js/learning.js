const lessonBlocks = $$('.module-section .content-block');
const validLessonIds = new Set(lessonBlocks.map(block => $('h3', block)?.id).filter(Boolean));
const completedLessons = new Set(storage.get('sqli-completed-lessons', []).filter(id => validLessonIds.has(id)));
const bookmarkedLessons = new Set(storage.get('sqli-bookmarks', []).filter(id => validLessonIds.has(id)));

const achievement = document.createElement('div');
achievement.className = 'achievement-toast';
achievement.setAttribute('role', 'status');
achievement.setAttribute('aria-live', 'polite');
achievement.innerHTML = '<b aria-hidden="true">◇</b><div><span>FIELD ACHIEVEMENT</span><strong></strong></div>';
document.body.append(achievement);
function unlockAchievement(id, message) {
  const unlocked = new Set(storage.get('sqli-achievements', []));
  if (unlocked.has(id)) return;
  unlocked.add(id);
  storage.set('sqli-achievements', [...unlocked]);
  $('strong', achievement).textContent = message;
  achievement.classList.add('show');
  setTimeout(() => achievement.classList.remove('show'), 3200);
}

lessonBlocks.forEach((block, index) => {
  const heading = $('h3', block);
  const lessonId = heading.id;
  const controls = document.createElement('div');
  controls.className = 'lesson-controls';
  const label = document.createElement('span');
  label.textContent = `Field chapter ${String(index + 1).padStart(2, '0')} / ${lessonBlocks.length}`;
  const complete = document.createElement('button');
  complete.type = 'button';
  complete.className = 'lesson-complete-button';
  complete.dataset.lesson = lessonId;
  const bookmark = document.createElement('button');
  bookmark.type = 'button';
  bookmark.className = 'lesson-bookmark-button';
  bookmark.dataset.lesson = lessonId;
  controls.append(label, complete, bookmark);
  heading.after(controls);
  complete.addEventListener('click', () => toggleLesson(lessonId));
  bookmark.addEventListener('click', () => toggleBookmark(lessonId));
  renderLessonControls(block);
});

function renderLessonControls(block) {
  const id = $('h3', block).id;
  const complete = $('.lesson-complete-button', block);
  const bookmark = $('.lesson-bookmark-button', block);
  const done = completedLessons.has(id);
  const saved = bookmarkedLessons.has(id);
  block.classList.toggle('lesson-complete', done);
  complete.setAttribute('aria-pressed', done);
  complete.textContent = done ? '✓ Completed' : 'Mark complete';
  bookmark.setAttribute('aria-pressed', saved);
  bookmark.textContent = saved ? '◆ Bookmarked' : '◇ Bookmark';
}


function toggleLesson(id) {
  if (completedLessons.has(id)) completedLessons.delete(id); else completedLessons.add(id);
  storage.set('sqli-completed-lessons', [...completedLessons]);
  const block = $(`#${CSS.escape(id)}`).closest('.content-block');
  renderLessonControls(block);
  if (completedLessons.size === 1) unlockAchievement('first-chapter', 'First field chapter completed');
  if (completedLessons.size === Math.ceil(lessonBlocks.length / 2)) unlockAchievement('half-course', 'Half of the field chapters completed');
  if (completedLessons.size === lessonBlocks.length) unlockAchievement('all-chapters', 'Every field chapter completed');
  updateMission();
}
function toggleBookmark(id) {
  if (bookmarkedLessons.has(id)) bookmarkedLessons.delete(id); else bookmarkedLessons.add(id);
  storage.set('sqli-bookmarks', [...bookmarkedLessons]);
  renderLessonControls($(`#${CSS.escape(id)}`).closest('.content-block'));
  if (bookmarkedLessons.size === 1) unlockAchievement('first-bookmark', 'First review bookmark saved');
  updateMission();
}

function renderBookmarks() {
  const list = $('#bookmarkList');
  list.replaceChildren();
  if (!bookmarkedLessons.size) {
    const empty = document.createElement('p');
    empty.textContent = 'No bookmarks yet. Use the bookmark control on any chapter.';
    list.append(empty);
  } else {
    [...bookmarkedLessons].forEach(id => {
      const heading = $(`#${CSS.escape(id)}`);
      if (!heading) return;
      const item = document.createElement('div'); item.className = 'bookmark-item';
      const link = document.createElement('a'); link.href = `#${id}`; link.textContent = heading.dataset.searchTitle || headingText(heading);
      const remove = document.createElement('button'); remove.type = 'button'; remove.setAttribute('aria-label', `Remove bookmark for ${link.textContent}`); remove.textContent = '×';
      remove.addEventListener('click', () => toggleBookmark(id));
      item.append(link, remove); list.append(item);
    });
  }
  $('#bookmarkCount').textContent = `${bookmarkedLessons.size} saved`;
}

function renderModuleTelemetry() {
  const telemetry = $('#moduleTelemetry');
  telemetry.replaceChildren();
  moduleSections.forEach((module, index) => {
    const lessons = $$('.content-block', module);
    const done = lessons.filter(block => completedLessons.has($('h3', block).id)).length;
    const article = document.createElement('article');
    const header = document.createElement('header');
    const label = document.createElement('span'); label.textContent = `MODULE 0${index + 1}`;
    const count = document.createElement('b'); count.textContent = `${done}/${lessons.length}`;
    const track = document.createElement('i');
    const fill = document.createElement('span'); fill.style.width = `${done / lessons.length * 100}%`; track.append(fill);
    const detail = document.createElement('small'); detail.textContent = done === lessons.length ? 'Module complete' : `${lessons.length - done} chapters remain`;
    header.append(label, count); article.append(header, track, detail); telemetry.append(article);
  });
}


function updateMission() {
  const status = $('#storageStatus');
  if (status) {
    status.textContent = storage.persistent ? 'Storage: persistent on this origin' : 'Storage: temporary for this tab';
    status.classList.toggle('temporary', !storage.persistent);
  }
  const bestQuiz = Number(storage.get('sqli-quiz-best', 0)) || 0;
  const checkedControls = storage.get('sqli-checklist', []).filter(Boolean).length;
  const visited = storage.get('sqli-visited', []).filter(id => /^module[1-4]$/.test(id)).length;
  const readiness = Math.round((completedLessons.size / lessonBlocks.length * 0.6 + bestQuiz / 12 * 0.3 + checkedControls / 10 * 0.1) * 100);
  $('#chapterMetric').textContent = `${completedLessons.size} / ${lessonBlocks.length}`;
  $('#quizMetric').textContent = `${bestQuiz} / 12`;
  $('#bookmarkMetric').textContent = bookmarkedLessons.size;
  $('#moduleMetric').textContent = `${visited} / 4`;
  $('#readinessPercent').textContent = `${readiness}%`;
  $('#readinessRing').style.setProperty('--readiness', `${readiness * 3.6}deg`);
  const messages = readiness === 100 ? 'Field guide complete. Your defensive record is ready to export.' : readiness >= 70 ? 'Strong field readiness. Finish the remaining chapters and controls.' : readiness >= 35 ? 'The signal is building. Continue through the next incomplete chapter.' : 'Begin with any chapter. Your field record will update automatically.';
  $('#readinessMessage').textContent = messages;
  const next = lessonBlocks.find(block => !completedLessons.has($('h3', block).id));
  const nextLink = $('#nextChapterLink');
  if (next) {
    const heading = $('h3', next); nextLink.href = `#${heading.id}`; nextLink.firstChild.textContent = `Next: ${heading.dataset.searchTitle || headingText(heading)} `;
  } else {
    nextLink.href = '#checkpoint'; nextLink.firstChild.textContent = 'Open defensive checkpoint ';
  }
  renderBookmarks(); renderModuleTelemetry();
}
window.updateLearningMission = updateMission;

$('#exportProgress')?.addEventListener('click', () => {
  const bestQuiz = Number(storage.get('sqli-quiz-best', 0)) || 0;
  const checkedControls = storage.get('sqli-checklist', []).filter(Boolean).length;
  const visited = storage.get('sqli-visited', []).filter(id => /^module[1-4]$/.test(id)).length;
  const readiness = Math.round((completedLessons.size / lessonBlocks.length * 0.6 + bestQuiz / 12 * 0.3 + checkedControls / 10 * 0.1) * 100);
  const completedNames = [...completedLessons].map(id => $(`#${CSS.escape(id)}`)?.dataset.searchTitle).filter(Boolean);
  const bookmarkNames = [...bookmarkedLessons].map(id => $(`#${CSS.escape(id)}`)?.dataset.searchTitle).filter(Boolean);
  const report = [
    'SQLi Lab — Local Learning Record',
    `Generated: ${new Date().toLocaleString()}`,
    '', `Chapters completed: ${completedLessons.size}/${lessonBlocks.length}`,
    `Defensive checkpoint best: ${bestQuiz}/12`, `Checklist controls: ${checkedControls}/10`,
    `Modules visited: ${visited}/4`, `Overall readiness: ${readiness}%`, `Bookmarks: ${bookmarkedLessons.size}`,
    '', 'Completed chapters:', ...(completedNames.length ? completedNames.map(name => `- ${name}`) : ['- None']),
    '', 'Review queue:', ...(bookmarkNames.length ? bookmarkNames.map(name => `- ${name}`) : ['- None']),
    '', 'This record is self-reported and stored only in the browser. It is not a certification.'
  ].join('\n');
  const url = URL.createObjectURL(new Blob([report], { type: 'text/plain' }));
  const link = document.createElement('a'); link.href = url; link.download = 'sqli-lab-progress.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Progress record exported');
});
$('#resetProgress')?.addEventListener('click', () => {
  if (!confirm('Reset all SQLi Lab progress, quiz results, bookmarks, and achievements on this device?')) return;
  storage.clearPrefix('sqli-');
  location.reload();
});
updateMission();


const quizQuestions = [
  {
    area: 'Core boundary', prompt: 'What is the most reliable primary control for user-supplied values in SQL queries?',
    options: ['A blacklist of SQL keywords', 'Parameterized queries with bound values', 'Removing quote characters', 'Hiding database errors'], answer: 1,
    explanation: 'Parameterized APIs define query structure first and transmit untrusted values separately, so data cannot become SQL structure.'
  },
  {
    area: 'Second order', prompt: 'Which scenario best describes second-order SQL injection?',
    options: ['An input is encoded twice in one request', 'Two SELECT statements use UNION', 'A stored value is trusted and later concatenated into another query', 'A request is repeated after a timeout'], answer: 2,
    explanation: 'Second-order flaws separate submission from execution: data may be stored safely, then reused unsafely by another feature or process.'
  },
  {
    area: 'Blind behavior', prompt: 'When query output is hidden, what can still reveal an injection boundary?',
    options: ['A difference in content, status, error, or response time', 'Only a database stack trace', 'The page color scheme', 'A missing client-side cookie'], answer: 0,
    explanation: 'Boolean, conditional-error, and time-based behavior can expose true/false query outcomes even when no database rows are displayed.'
  },
  {
    area: 'Canonicalization', prompt: 'Why should input be canonicalized before validation?',
    options: ['To make queries execute faster', 'To encrypt input before logging', 'To add database escape characters', 'To reduce alternate encodings to one predictable representation'], answer: 3,
    explanation: 'Validation should inspect a normalized form; otherwise equivalent URL, Unicode, or repeated encodings may be interpreted differently later.'
  },
  {
    area: 'XML / XXE', prompt: 'Which parser configuration most directly reduces XML external entity risk?',
    options: ['Enable verbose XML errors', 'Allow only POST requests', 'Disable DTDs and external entity resolution', 'Convert XML to uppercase'], answer: 2,
    explanation: 'Disabling DTDs and external entity processing prevents parsers from resolving attacker-controlled file or network references.'
  },
  {
    area: 'XPath', prompt: 'What makes blind XPath assessment conceptually similar to blind SQL assessment?',
    options: ['Both always use SQL comments', 'Both can infer facts through true/false application behavior', 'Both require relational tables', 'Both share identical syntax'], answer: 1,
    explanation: 'XPath functions and predicates can produce observable Boolean differences, but XPath syntax and document structure remain distinct from SQL.'
  },

  {
    area: 'LDAP', prompt: 'Which control best preserves LDAP filter structure when values are user supplied?',
    options: ['A dedicated LDAP escaping API plus allowlisted values', 'String replacement with SQL escapes', 'Disabling TLS', 'Returning more directory attributes'], answer: 0,
    explanation: 'LDAP has its own filter metacharacters and escaping rules. Keep filter structure fixed, escape values with the proper API, and use a restricted bind account.'
  },
  {
    area: 'NoSQL', prompt: 'Why should a NoSQL handler reject object-shaped values when it expects a username string?',
    options: ['Objects consume too much memory', 'Strings cannot be indexed', 'Objects may introduce query operators or unexpected structure', 'JSON always executes JavaScript'], answer: 2,
    explanation: 'Strict schemas and primitive-type validation prevent deserialized request objects from replacing expected values with datastore operators.'
  },
  {
    area: 'Least privilege', prompt: 'Which database-account design best limits the impact of a residual injection flaw?',
    options: ['One administrator account for every feature', 'An account that can create new database users', 'A shared account with server-control permissions', 'Separate identities with only the rights each function needs'], answer: 3,
    explanation: 'Separate read, write, and administrative responsibilities. Views and reviewed procedures can further constrain accessible rows, fields, and actions.'
  },
  {
    area: 'Automation', prompt: 'What is the safest role for tools such as sqlmap in an authorized assessment?',
    options: ['A magic vulnerability finder used on any public URL', 'Automation after scope, parameter behavior, and risk are understood', 'A replacement for backups and review', 'A way to avoid explicit permission'], answer: 1,
    explanation: 'Automation can be noisy, wrong, or destructive. Use it only within explicit scope, after understanding the target parameter, with snapshots or backups.'
  },
  {
    area: 'Query structure', prompt: 'A sort direction cannot usually be represented by a bound-value placeholder. What should the application do?',
    options: ['Map a small allowlist of choices to fixed SQL tokens', 'Concatenate the raw request value', 'Double URL-encode the direction', 'Grant the query more privileges'], answer: 0,
    explanation: 'Identifiers and structural keywords should come from fixed server-side mappings. Parameter binding is for values, not arbitrary query structure.'
  },
  {
    area: 'Sensitive data', prompt: 'Which password-storage approach reflects current defensive practice?',
    options: ['Reversible encryption with the key in the database', 'A plain SHA-256 digest for every user', 'A unique salt and a slow, adaptive password-hashing function', 'Plaintext so forgotten passwords can be emailed'], answer: 2,
    explanation: 'Use a dedicated, slow password-hashing function with unique salts. Password reset replaces a credential; it should never reveal the previous password.'
  }
];


let quizAnswers = storage.get('sqli-quiz-answers', Array(quizQuestions.length).fill(null));
if (!Array.isArray(quizAnswers) || quizAnswers.length !== quizQuestions.length) quizAnswers = Array(quizQuestions.length).fill(null);
let quizCurrent = Math.min(quizQuestions.length - 1, Math.max(0, Number(storage.get('sqli-quiz-current', 0)) || 0));
function quizScore() { return quizAnswers.filter((answer, index) => answer?.checked && answer.selected === quizQuestions[index].answer).length; }
function quizRank(score, finished = storage.get('sqli-quiz-finished', false)) {
  if (!score) return finished ? 'Review required' : 'Not attempted';
  if (score >= 11) return 'Boundary architect';
  if (score >= 9) return 'Defender ready';
  if (score >= 7) return 'Security analyst';
  return 'Foundations in progress';
}
function saveQuizState() {
  storage.set('sqli-quiz-answers', quizAnswers);
  storage.set('sqli-quiz-current', quizCurrent);
}
function renderQuizTrack() {
  const track = $('#checkpointTrack'); track.replaceChildren();
  quizQuestions.forEach((question, index) => {
    const button = document.createElement('button'); button.type = 'button';
    button.classList.toggle('current', index === quizCurrent);
    button.classList.toggle('answered', Boolean(quizAnswers[index]?.checked));
    button.setAttribute('aria-label', `Go to question ${index + 1}: ${question.area}`);
    button.setAttribute('aria-current', index === quizCurrent ? 'step' : 'false');
    button.addEventListener('click', () => { quizCurrent = index; saveQuizState(); renderQuiz(); });
    track.append(button);
  });
}
function updateQuizSummary() {
  const best = Number(storage.get('sqli-quiz-best', 0)) || 0;
  $('#checkpointBest').textContent = `${best} / ${quizQuestions.length}`;
  $('#checkpointRank').textContent = quizRank(best);
  renderQuizTrack();
}
function selectQuizOption(optionIndex) {
  if (quizAnswers[quizCurrent]?.checked) return;
  quizAnswers[quizCurrent] = { selected: optionIndex, checked: false };
  saveQuizState(); renderQuiz();
}
function checkQuizAnswer() {
  const answer = quizAnswers[quizCurrent];
  if (!answer) return;
  if (!answer.checked) {
    answer.checked = true; saveQuizState(); renderQuiz();
    const feedback = $('#quizFeedback'); feedback.tabIndex = -1; feedback.focus(); return;
  }
  if (quizCurrent < quizQuestions.length - 1) {
    quizCurrent += 1; saveQuizState(); renderQuiz();
  } else if (quizAnswers.every(item => item?.checked)) finishQuiz();
  else {
    quizCurrent = quizAnswers.findIndex(item => !item?.checked);
    saveQuizState(); renderQuiz(); showToast('Answer every question before finishing');
  }
}


function renderQuiz() {
  if (!$('#quizConsole')) return;
  const question = quizQuestions[quizCurrent];
  const answer = quizAnswers[quizCurrent];
  $('#quizCounter').textContent = `QUESTION ${String(quizCurrent + 1).padStart(2, '0')} / ${quizQuestions.length}`;
  const questionBox = $('#quizQuestion'); questionBox.replaceChildren();
  const area = document.createElement('small'); area.textContent = question.area;
  const prompt = document.createElement('h3'); prompt.id = 'quizPrompt'; prompt.textContent = question.prompt;
  questionBox.append(area, prompt);
  const options = $('#quizOptions'); options.replaceChildren();
  question.options.forEach((option, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'quiz-option';
    button.setAttribute('aria-pressed', answer?.selected === index);
    button.classList.toggle('selected', answer?.selected === index);
    if (answer?.checked) {
      button.disabled = true;
      const correctness = index === question.answer ? 'Correct answer' : answer.selected === index ? 'Your answer, incorrect' : 'Not selected';
      button.setAttribute('aria-label', `${option}. ${correctness}`);
      button.classList.toggle('correct', index === question.answer);
      button.classList.toggle('incorrect', answer.selected === index && index !== question.answer);
    }
    const marker = document.createElement('b'); marker.textContent = String.fromCharCode(65 + index);
    const text = document.createElement('span'); text.textContent = option;
    button.append(marker, text); button.addEventListener('click', () => selectQuizOption(index)); options.append(button);
  });
  const feedback = $('#quizFeedback'); feedback.replaceChildren(); feedback.classList.remove('wrong');
  if (answer?.checked) {
    const title = document.createElement('strong');
    const correct = answer.selected === question.answer;
    title.textContent = correct ? 'Signal verified' : 'Boundary needs review';
    feedback.classList.toggle('wrong', !correct);
    const detail = document.createElement('span'); detail.textContent = question.explanation;
    feedback.append(title, detail);
  }
  $('#quizPrevious').disabled = quizCurrent === 0;
  const next = $('#quizNext'); next.disabled = answer == null;
  next.textContent = !answer?.checked ? 'Check answer' : quizCurrent === quizQuestions.length - 1 ? 'Finish checkpoint' : 'Next question →';
  renderQuizTrack();
}
function resetQuiz() {
  quizAnswers = Array(quizQuestions.length).fill(null); quizCurrent = 0;
  storage.set('sqli-quiz-finished', false); saveQuizState(); location.reload();
}
function finishQuiz() {
  const score = quizScore();
  const best = Math.max(Number(storage.get('sqli-quiz-best', 0)) || 0, score);
  storage.set('sqli-quiz-best', best); storage.set('sqli-quiz-finished', true);
  if (score >= 10) unlockAchievement('checkpoint-pass', 'Defensive checkpoint mastered');
  updateQuizSummary(); updateMission(); renderQuizComplete(score);
}


function renderQuizComplete(score) {
  const consoleBox = $('#quizConsole'); consoleBox.classList.add('quiz-complete'); consoleBox.replaceChildren();
  const wrapper = document.createElement('div');
  const label = document.createElement('span'); label.className = 'eyebrow'; label.textContent = 'Checkpoint complete';
  const result = document.createElement('strong'); result.textContent = `${score}/12`;
  const title = document.createElement('h3'); title.id = 'quizResultTitle'; title.tabIndex = -1; title.textContent = quizRank(score, true);
  const message = document.createElement('p');
  message.textContent = score >= 10 ? 'Excellent defensive reasoning. Review your saved chapters, then export the complete field record.' : score >= 7 ? 'Core boundaries are understood. Review incorrect explanations and try again for field mastery.' : 'Return to the defensive chapters, especially parameterization, canonicalization, and least privilege, then retry.';
  const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = 'Restart checkpoint'; retry.addEventListener('click', resetQuiz);
  wrapper.setAttribute('role', 'status'); wrapper.append(label, result, title, message, retry); consoleBox.append(wrapper); title.focus();
}
$('#quizNext')?.addEventListener('click', checkQuizAnswer);
$('#quizPrevious')?.addEventListener('click', () => {
  if (quizCurrent > 0) { quizCurrent -= 1; saveQuizState(); renderQuiz(); }
});
$('#restartQuiz')?.addEventListener('click', resetQuiz);
updateQuizSummary();
if (storage.get('sqli-quiz-finished', false) && quizAnswers.every(answer => answer?.checked)) renderQuizComplete(quizScore());
else renderQuiz();
