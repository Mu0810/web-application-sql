/* ============================================================
   CINEMATIC MOTION RUNTIME
   A theme-aware full-page data lattice, source-coverage tracer,
   section telemetry, chapter progress spines, and live counters.
   This layer is ornamental: Calm mode and reduced-motion remove it
   without changing content, navigation, or learning state.
   ============================================================ */

(() => {
  const root = document.documentElement;
  const body = document.body;
  const query = (selector, scope = document) => scope.querySelector(selector);
  const queryAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 951px)');
  const isCalm = () => root.dataset.motion === 'calm' || reduced.matches;

  root.classList.add('cinematic-ready');

  /* ---------- Theme-aware full-page particle lattice -------- */

  const ambient = document.createElement('canvas');
  ambient.className = 'ambient-canvas';
  ambient.id = 'ambientCanvas';
  ambient.setAttribute('aria-hidden', 'true');
  body.append(ambient);
  const ambientContext = ambient.getContext('2d', { alpha: true });
  const coverageCanvas = query('#coverageCanvas');
  const coverageContext = coverageCanvas?.getContext('2d', { alpha: true });
  let viewportWidth = 0;
  let viewportHeight = 0;
  let particles = [];
  let palette = { accent: '#a8ff78', accent2: '#65e7ff' };
  let lastFrame = 0;
  let animationFrame = 0;
  let running = false;
  let documentVisible = !document.hidden;
  let auditVisible = false;
  let coveragePoints = [];
  let lastScrollY = scrollY;
  let scrollVelocity = 0;
  let pointer = { x: innerWidth * .5, y: innerHeight * .5, active: false };

  function readPalette() {
    const styles = getComputedStyle(root);
    palette = {
      accent: styles.getPropertyValue('--accent').trim() || '#a8ff78',
      accent2: styles.getPropertyValue('--accent2').trim() || '#65e7ff'
    };
  }

  function resizeAmbient() {
    if (!ambientContext) return;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    viewportWidth = innerWidth;
    viewportHeight = innerHeight;
    ambient.width = Math.floor(viewportWidth * ratio);
    ambient.height = Math.floor(viewportHeight * ratio);
    ambientContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.max(24, Math.min(56, Math.floor(viewportWidth / 28)));
    particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * viewportWidth,
      y: Math.random() * viewportHeight,
      vx: (Math.random() - .5) * .14,
      vy: (Math.random() - .5) * .14,
      radius: index % 7 === 0 ? 1.6 : .8 + Math.random() * .6,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function drawAmbient(time) {
    if (!ambientContext || !desktop.matches) return;
    ambientContext.clearRect(0, 0, viewportWidth, viewportHeight);
    scrollVelocity *= .92;
    const maxDistance = Math.min(150, viewportWidth * .13);

    particles.forEach((particle, index) => {
      const pointerDx = pointer.x - particle.x;
      const pointerDy = pointer.y - particle.y;
      const pointerDistance = Math.hypot(pointerDx, pointerDy);
      if (pointer.active && pointerDistance < 210 && pointerDistance > 1) {
        particle.vx += pointerDx / pointerDistance * .0015;
        particle.vy += pointerDy / pointerDistance * .0015;
      }
      particle.vx = Math.max(-.28, Math.min(.28, particle.vx * .998));
      particle.vy = Math.max(-.28, Math.min(.28, particle.vy * .998));
      particle.x += particle.vx;
      particle.y += particle.vy + scrollVelocity * .003 * (index % 3 - 1);
      if (particle.x < -10) particle.x = viewportWidth + 10;
      if (particle.x > viewportWidth + 10) particle.x = -10;
      if (particle.y < -10) particle.y = viewportHeight + 10;
      if (particle.y > viewportHeight + 10) particle.y = -10;

      for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
        const other = particles[otherIndex];
        const dx = other.x - particle.x;
        const dy = other.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance > maxDistance) continue;
        ambientContext.beginPath();
        ambientContext.moveTo(particle.x, particle.y);
        ambientContext.lineTo(other.x, other.y);
        ambientContext.strokeStyle = index % 4 ? palette.accent2 : palette.accent;
        ambientContext.globalAlpha = (1 - distance / maxDistance) * .055;
        ambientContext.lineWidth = .6;
        ambientContext.stroke();
      }

      const pulse = .45 + Math.sin(time * .0012 + particle.phase) * .2;
      ambientContext.beginPath();
      ambientContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ambientContext.fillStyle = index % 4 ? palette.accent2 : palette.accent;
      ambientContext.globalAlpha = pulse;
      ambientContext.fill();
    });
    ambientContext.globalAlpha = 1;
  }

  /* ---------- Animated 93-page source path ------------------ */

  function resizeCoverage() {
    if (!coverageCanvas || !coverageContext) return;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    const box = coverageCanvas.getBoundingClientRect();
    const width = coverageCanvas.clientWidth;
    const height = coverageCanvas.clientHeight;
    if (!width || !height) return;
    coverageCanvas.width = Math.floor(width * ratio);
    coverageCanvas.height = Math.floor(height * ratio);
    coverageContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    coveragePoints = queryAll('.page-node:not([hidden])').map(node => {
      const nodeBox = node.getBoundingClientRect();
      return {
        x: nodeBox.left + nodeBox.width / 2 - box.left,
        y: nodeBox.top + nodeBox.height / 2 - box.top,
        section: node.dataset.section
      };
    });
  }

  function drawCoverage(time) {
    if (!coverageContext || !coverageCanvas || !auditVisible || !coveragePoints.length) return;
    const width = coverageCanvas.clientWidth;
    const height = coverageCanvas.clientHeight;
    coverageContext.clearRect(0, 0, width, height);

    coverageContext.beginPath();
    coveragePoints.forEach((point, index) => {
      if (index === 0 || point.section !== coveragePoints[index - 1].section) coverageContext.moveTo(point.x, point.y);
      else coverageContext.lineTo(point.x, point.y);
    });
    coverageContext.strokeStyle = palette.accent2;
    coverageContext.globalAlpha = .16;
    coverageContext.lineWidth = .7;
    coverageContext.stroke();

    const position = (time * .006) % coveragePoints.length;
    const currentIndex = Math.floor(position);
    const nextIndex = (currentIndex + 1) % coveragePoints.length;
    const current = coveragePoints[currentIndex];
    const next = coveragePoints[nextIndex];
    const amount = position - currentIndex;
    const x = current.x + (next.x - current.x) * amount;
    const y = current.y + (next.y - current.y) * amount;
    const glow = coverageContext.createRadialGradient(x, y, 0, x, y, 22);
    glow.addColorStop(0, palette.accent);
    glow.addColorStop(.18, palette.accent2);
    glow.addColorStop(1, 'transparent');
    coverageContext.globalAlpha = .7;
    coverageContext.fillStyle = glow;
    coverageContext.fillRect(x - 22, y - 22, 44, 44);
    coverageContext.beginPath();
    coverageContext.arc(x, y, 2.3, 0, Math.PI * 2);
    coverageContext.fillStyle = palette.accent;
    coverageContext.globalAlpha = 1;
    coverageContext.fill();
  }

  function paintFrame(time) {
    animationFrame = 0;
    if (!running || !documentVisible || isCalm()) return;
    if (time - lastFrame < 32) {
      animationFrame = requestAnimationFrame(paintFrame);
      return;
    }
    lastFrame = time;
    drawAmbient(time);
    drawCoverage(time);
    animationFrame = requestAnimationFrame(paintFrame);
  }

  function clearCanvases() {
    ambientContext?.clearRect(0, 0, viewportWidth, viewportHeight);
    coverageContext?.clearRect(0, 0, coverageCanvas?.clientWidth || 0, coverageCanvas?.clientHeight || 0);
  }

  function syncRuntime() {
    readPalette();
    if (isCalm()) {
      scrollVelocity = 0;
      lastScrollY = scrollY;
      root.style.setProperty('--drift', '0');
    }
    running = documentVisible && !isCalm() && desktop.matches;
    ambient.hidden = !running;
    if (running) {
      resizeAmbient();
      requestAnimationFrame(resizeCoverage);
      if (!animationFrame) animationFrame = requestAnimationFrame(paintFrame);
    } else {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      clearCanvases();
    }
  }

  /* ---------- Section and chapter telemetry ----------------- */

  const sections = queryAll('main > section[id]');
  const sectionNames = {
    home: 'ENTRY', 'mission-control': 'MISSION', modules: 'ROUTES',
    'book-map': 'MAP', 'source-audit': 'AUDIT', module1: 'MODULE 01',
    module2: 'MODULE 02', module3: 'MODULE 03', module4: 'MODULE 04',
    lab: 'SIMULATOR', checkpoint: 'CHECKPOINT', reading: 'READING', checklist: 'CONTROLS'
  };

  sections.forEach((section, index) => {
    section.style.position ||= 'relative';
    const label = sectionNames[section.id];
    if (!label) return;
    const signal = document.createElement('span');
    signal.className = 'section-signal';
    signal.setAttribute('aria-hidden', 'true');
    signal.textContent = label;
    section.prepend(signal);
    section.dataset.cinematicIndex = String(index + 1).padStart(2, '0');
  });

  const chapterBlocks = queryAll('.module-section .content-block');
  chapterBlocks.forEach((block, index) => {
    block.style.setProperty('--chapter-progress', '0');
    block.dataset.chapterIndex = String(index + 1).padStart(2, '0');
    const spine = document.createElement('span');
    spine.className = 'chapter-spine';
    spine.setAttribute('aria-hidden', 'true');
    spine.innerHTML = '<i></i>';
    block.prepend(spine);
  });

  queryAll('.topic-index span, .module-tags span').forEach((chip, index) => chip.style.setProperty('--chip-index', String(index % 8)));
  queryAll('.page-node').forEach((node, index) => node.style.setProperty('--twinkle-delay', `${-((index * 0.137) % 4.8).toFixed(2)}s`));

  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('section-live', entry.isIntersecting);
    if (entry.isIntersecting) entry.target.classList.add('section-seen');
  }), { threshold: 0, rootMargin: '-28% 0px -55%' });
  sections.forEach(section => sectionObserver.observe(section));

  const chapterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('chapter-live', entry.isIntersecting);
  }), { threshold: 0, rootMargin: '-22% 0px -48%' });
  chapterBlocks.forEach(block => chapterObserver.observe(block));

  const auditSection = query('#source-audit');
  if (auditSection) {
    const auditObserver = new IntersectionObserver(([entry]) => {
      auditVisible = entry.isIntersecting;
      if (auditVisible) requestAnimationFrame(resizeCoverage);
    }, { rootMargin: '180px 0px' });
    auditObserver.observe(auditSection);
  }

  /* ---------- Viewport progress and velocity ---------------- */

  let scrollFrame = 0;
  function updateScrollTelemetry() {
    scrollFrame = 0;
    const currentScroll = scrollY;
    if (isCalm()) {
      scrollVelocity = 0;
      lastScrollY = currentScroll;
      root.style.setProperty('--drift', '0');
      return;
    }
    scrollVelocity = Math.max(-80, Math.min(80, currentScroll - lastScrollY));
    lastScrollY = currentScroll;
    root.style.setProperty('--drift', String(Math.max(-12, Math.min(12, scrollVelocity * .15))));

    sections.forEach(section => {
      if (!section.classList.contains('section-live')) return;
      const box = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight * .72 - box.top) / Math.max(box.height, 1)));
      section.style.setProperty('--section-progress', progress.toFixed(3));
    });

    chapterBlocks.forEach(block => {
      const box = block.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const progress = Math.max(0, Math.min(1, (innerHeight * .62 - box.top) / Math.max(box.height, 1)));
      block.style.setProperty('--chapter-progress', progress.toFixed(3));
    });
  }

  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollTelemetry);
  }, { passive: true });

  addEventListener('pointermove', event => {
    pointer = { x: event.clientX, y: event.clientY, active: true };
  }, { passive: true });
  addEventListener('pointerleave', () => { pointer.active = false; });

  /* ---------- Numeric metric entrance ----------------------- */

  const counters = queryAll('.audit-metrics strong');
  const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    counterObserver.unobserve(entry.target);
    const finalValue = Number(entry.target.textContent.replace(/[^0-9]/g, ''));
    if (!Number.isFinite(finalValue) || isCalm()) return;
    const started = performance.now();
    entry.target.classList.add('counter-live');
    function count(now) {
      if (isCalm()) {
        entry.target.textContent = String(finalValue);
        entry.target.classList.remove('counter-live');
        return;
      }
      const progress = Math.min(1, (now - started) / 820);
      const eased = 1 - Math.pow(1 - progress, 3);
      entry.target.textContent = String(Math.round(finalValue * eased));
      if (progress < 1) requestAnimationFrame(count);
      else entry.target.textContent = String(finalValue);
    }
    requestAnimationFrame(count);
  }), { threshold: .65 });
  counters.forEach(counter => counterObserver.observe(counter));

  /* Page filtering changes source-node geometry. */
  queryAll('[data-audit-filter]').forEach(button => button.addEventListener('click', () => requestAnimationFrame(resizeCoverage)));

  /* ---------- Lifecycle ------------------------------------- */

  const stateObserver = new MutationObserver(mutations => {
    if (mutations.some(mutation => mutation.attributeName === 'data-theme' || mutation.attributeName === 'data-motion')) syncRuntime();
  });
  stateObserver.observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-motion'] });

  document.addEventListener('visibilitychange', () => {
    documentVisible = !document.hidden;
    syncRuntime();
  });
  addEventListener('resize', () => {
    clearTimeout(syncRuntime.resizeTimer);
    syncRuntime.resizeTimer = setTimeout(syncRuntime, 140);
  }, { passive: true });
  reduced.addEventListener('change', syncRuntime);
  desktop.addEventListener('change', syncRuntime);

  readPalette();
  updateScrollTelemetry();
  syncRuntime();
})();
