/* ============================================================
   ATELIER — creative interaction layer
   Palette engine, ambient query-stream canvas, pointer light,
   pointer-reactive card depth, heading decode, and parallax.
   Everything degrades to a fully readable static page: no feature
   here is required to consume the course.
   ============================================================ */

(() => {
  const pick = (selector, scope = document) => scope.querySelector(selector);
  const pickAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const root = document.documentElement;
  const systemCalm = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const wideViewport = matchMedia('(min-width: 951px)');

  const store = {
    read(key, fallback) {
      try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
    },
    write(key, value) {
      try { localStorage.setItem(key, value); } catch { /* private mode: session only */ }
    }
  };

  /* ---------- Palette engine -------------------------------- */

  const themes = [
    { id: 'terminal', label: 'Terminal', swatch: ['#030706', '#a8ff78', '#65e7ff'] },
    { id: 'noir', label: 'Noir', swatch: ['#05040c', '#ff5ec7', '#9a8cff'] },
    { id: 'amber', label: 'Amber CRT', swatch: ['#080603', '#ffb340', '#ff7a45'] },
    { id: 'blueprint', label: 'Blueprint', swatch: ['#030913', '#cfe4ff', '#4d9dff'] }
  ];
  const themeIds = themes.map(theme => theme.id);
  let activeTheme = themeIds.includes(store.read('sqli-theme', '')) ? store.read('sqli-theme', '') : 'terminal';
  let calmMode = store.read('sqli-motion', systemCalm.matches ? 'calm' : 'cinematic') === 'calm';

  function applyTheme(id, { announce = false } = {}) {
    activeTheme = themeIds.includes(id) ? id : 'terminal';
    root.dataset.theme = activeTheme;
    store.write('sqli-theme', activeTheme);
    const meta = pick('meta[name="theme-color"]');
    if (meta) meta.content = themes.find(theme => theme.id === activeTheme).swatch[0];
    pickAll('.theme-swatch').forEach(button => button.setAttribute('aria-checked', String(button.dataset.theme === activeTheme)));
    const name = pick('#themeName');
    if (name) name.textContent = themes.find(theme => theme.id === activeTheme).label;
    if (announce) window.showAtelierToast?.(`${themes.find(theme => theme.id === activeTheme).label} palette`);
    stream.recolor();
  }

  function applyMotion(calm, { announce = false } = {}) {
    calmMode = calm;
    root.dataset.motion = calm ? 'calm' : 'cinematic';
    store.write('sqli-motion', calm ? 'calm' : 'cinematic');
    const toggle = pick('#motionToggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(!calm));
      pick('#motionState').textContent = calm ? 'Calm' : 'Cinematic';
    }
    if (calm) stream.stop(); else stream.start();
    if (announce) window.showAtelierToast?.(calm ? 'Calm mode: ambient motion off' : 'Cinematic mode: ambient motion on');
  }

  /* ---------- Ambient query stream -------------------------- */

  const stream = (() => {
    const canvas = pick('#queryRain');
    if (!canvas) return { start() {}, stop() {}, recolor() {} };
    const context = canvas.getContext('2d', { alpha: true });
    const glyphs = ['SELECT', 'UNION', 'WHERE', '1=1', 'OR', 'AND', "'", '--', '/*', 'NULL', 'sleep(', 'CAST', 'LIMIT', 'INSERT', 'ORDER BY', '$ne', '$where', 'ldap://', '//user', 'CDATA', '&xxe;', '0x27', 'CHAR(', 'bind', '?', ':param', 'ESCAPE', 'schema'];
    let columns = [];
    let frame = 0;
    let running = false;
    let palette = ['#a8ff78', '#65e7ff'];

    let boxWidth = 0;
    let boxHeight = 0;

    function measure() {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      boxWidth = canvas.clientWidth || innerWidth;
      boxHeight = canvas.clientHeight || innerHeight;
      canvas.width = Math.floor(boxWidth * ratio);
      canvas.height = Math.floor(boxHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const spacing = 104;
      const count = Math.max(4, Math.floor(boxWidth / spacing));
      columns = Array.from({ length: count }, (_, index) => ({
        x: index * spacing + 20,
        y: Math.random() * boxHeight,
        speed: 0.3 + Math.random() * 0.6,
        text: glyphs[Math.floor(Math.random() * glyphs.length)],
        accent: Math.random() > 0.7
      }));
    }

    function draw() {
      if (!running) return;
      frame += 1;
      context.clearRect(0, 0, boxWidth, boxHeight);
      context.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      columns.forEach(column => {
        column.y += column.speed;
        if (column.y > boxHeight + 40) {
          column.y = -60 - Math.random() * 220;
          column.text = glyphs[Math.floor(Math.random() * glyphs.length)];
          column.accent = Math.random() > 0.7;
        }
        const fade = Math.max(0, 1 - column.y / boxHeight);
        context.fillStyle = column.accent ? palette[1] : palette[0];
        context.globalAlpha = 0.1 + fade * 0.3;
        context.fillText(column.text, column.x, column.y);
        context.globalAlpha = 0.05 + fade * 0.14;
        context.fillText(column.text, column.x, column.y - 24);
        context.globalAlpha = 0.03 + fade * 0.07;
        context.fillText(column.text, column.x, column.y - 48);
      });
      context.globalAlpha = 1;
      if (frame % 240 === 0) columns.forEach(column => { column.speed = 0.28 + Math.random() * 0.55; });
      requestAnimationFrame(draw);
    }

    return {
      start() {
        if (running || calmMode || systemCalm.matches || !wideViewport.matches) return;
        running = true;
        measure();
        requestAnimationFrame(draw);
      },
      stop() {
        running = false;
        context.clearRect(0, 0, boxWidth || innerWidth, boxHeight || innerHeight);
      },
      recolor() {
        const styles = getComputedStyle(root);
        palette = [styles.getPropertyValue('--accent').trim() || '#a8ff78', styles.getPropertyValue('--accent2').trim() || '#65e7ff'];
      },
      resize() { if (running) measure(); }
    };
  })();

  addEventListener('resize', () => stream.resize?.(), { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stream.stop(); else stream.start(); });

  /* ---------- Pointer light --------------------------------- */

  if (finePointer.matches) {
    const glow = pick('#pointerGlow');
    if (glow) {
      let targetX = innerWidth / 2;
      let targetY = innerHeight / 2;
      let currentX = targetX;
      let currentY = targetY;
      let gliding = false;
      addEventListener('pointermove', event => {
        targetX = event.clientX;
        targetY = event.clientY;
        document.body.classList.add('pointer-active');
        if (!gliding && !calmMode) { gliding = true; requestAnimationFrame(glide); }
      }, { passive: true });
      addEventListener('pointerleave', () => document.body.classList.remove('pointer-active'));
      function glide() {
        currentX += (targetX - currentX) * 0.09;
        currentY += (targetY - currentY) * 0.09;
        glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        if (Math.abs(targetX - currentX) < 0.6 && Math.abs(targetY - currentY) < 0.6) { gliding = false; return; }
        requestAnimationFrame(glide);
      }
    }
  }

  /* ---------- Pointer-reactive card depth ------------------- */

  const tiltTargets = pickAll('.module-card, .book-range, .tool-cards article, .encoding-grid article, .readiness-panel, .quiz-console');
  tiltTargets.forEach(card => {
    card.classList.add('tilt');
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    const glare = document.createElement('span');
    glare.className = 'tilt-glare';
    glare.setAttribute('aria-hidden', 'true');
    card.append(glare);
    if (!finePointer.matches) return;
    const strength = card.classList.contains('module-card') ? 7 : 4;
    card.addEventListener('pointermove', event => {
      if (calmMode || systemCalm.matches) return;
      const box = card.getBoundingClientRect();
      const px = (event.clientX - box.left) / box.width;
      const py = (event.clientY - box.top) / box.height;
      card.classList.add('tilt-active');
      card.classList.remove('tilt-reset');
      card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * strength}deg) rotateY(${(px - 0.5) * strength}deg) translateY(-3px)`;
      glare.style.setProperty('--gx', `${px * 100}%`);
      glare.style.setProperty('--gy', `${py * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilt-active');
      card.classList.add('tilt-reset');
      card.style.transform = '';
    });
  });

  pickAll('.module-card').forEach(card => {
    const frame = document.createElement('span');
    frame.className = 'card-frame';
    frame.setAttribute('aria-hidden', 'true');
    frame.innerHTML = '<i></i><i></i><i></i><i></i>';
    card.append(frame);
  });

  /* ---------- Heading decode -------------------------------- */

  const decodeCharacters = '01!<>=*/-\'";()$#@%&';
  function decodeHeading(node) {
    const finalText = node.dataset.decodeText;
    if (!finalText || calmMode || systemCalm.matches) return;
    const total = finalText.length;
    let step = 0;
    node.classList.add('scrambling');
    const timer = setInterval(() => {
      step += 1;
      const settled = Math.floor(step * 1.6);
      node.textContent = finalText
        .split('')
        .map((character, index) => {
          if (index < settled || character === ' ') return character;
          return decodeCharacters[Math.floor(Math.random() * decodeCharacters.length)];
        })
        .join('');
      if (settled >= total) {
        clearInterval(timer);
        node.textContent = finalText;
        node.classList.remove('scrambling');
      }
    }, 28);
  }

  if ('IntersectionObserver' in window) {
    const decodeTargets = pickAll('.section-title, .mission-heading h2, .checkpoint-intro h2, .book-map .section-heading h2')
      .filter(node => node.children.length === 0 && node.textContent.trim().length < 42);
    decodeTargets.forEach(node => { node.dataset.decodeText = node.textContent.trim(); });
    const decodeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      decodeObserver.unobserve(entry.target);
      decodeHeading(entry.target);
    }), { threshold: 0.6 });
    decodeTargets.forEach(node => decodeObserver.observe(node));
  }

  /* ---------- Staggered grid entrance ---------------------- */

  pickAll('.modules-grid, .book-map-grid, .split-cards, .concept-grid, .encoding-grid, .control-matrix, .reading-list, .visual-metrics, .mission-metrics, .module-telemetry')
    .forEach(group => [...group.children].forEach((child, index) => {
      child.classList.add('stagger');
      child.style.setProperty('--i', String(index));
    }));

  /* ---------- Scroll parallax ------------------------------ */

  const parallaxLayers = [
    { node: pick('.hero-visual'), rate: -0.045 },
    { node: pick('.hero-network'), rate: 0.09 }
  ].filter(layer => layer.node);

  let scrollScheduled = false;
  function paintParallax() {
    scrollScheduled = false;
    if (calmMode || systemCalm.matches) return;
    const offset = Math.min(scrollY, innerHeight);
    parallaxLayers.forEach(layer => { layer.node.style.translate = `0 ${offset * layer.rate}px`; });
  }
  addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(paintParallax);
  }, { passive: true });

  /* ---------- Magnetic primary actions --------------------- */

  if (finePointer.matches) {
    pickAll('.btn').forEach(button => {
      button.addEventListener('pointermove', event => {
        if (calmMode || systemCalm.matches) return;
        const box = button.getBoundingClientRect();
        const dx = (event.clientX - (box.left + box.width / 2)) / box.width;
        const dy = (event.clientY - (box.top + box.height / 2)) / box.height;
        button.style.translate = `${dx * 6}px ${dy * 4}px`;
      });
      button.addEventListener('pointerleave', () => { button.style.translate = ''; });
    });
  }

  /* ---------- Control panel wiring ------------------------- */

  const trigger = pick('#themeTrigger');
  const menu = pick('#themeMenu');

  pickAll('.theme-swatch').forEach(button => {
    button.addEventListener('click', () => applyTheme(button.dataset.theme, { announce: true }));
  });

  pick('#motionToggle')?.addEventListener('click', () => applyMotion(!calmMode, { announce: true }));

  function setMenuOpen(open) {
    if (!menu || !trigger) return;
    menu.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (open) pick('.theme-swatch', menu)?.focus();
  }

  trigger?.addEventListener('click', () => setMenuOpen(menu.hidden));
  document.addEventListener('click', event => {
    if (!menu || menu.hidden) return;
    if (!menu.contains(event.target) && event.target !== trigger && !trigger.contains(event.target)) setMenuOpen(false);
  });
  menu?.addEventListener('keydown', event => {
    if (event.key === 'Escape') { setMenuOpen(false); trigger.focus(); }
  });

  document.addEventListener('keydown', event => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '');
    if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.toLowerCase() === 't') {
      event.preventDefault();
      applyTheme(themeIds[(themeIds.indexOf(activeTheme) + 1) % themeIds.length], { announce: true });
    }
    if (event.key.toLowerCase() === 'm') {
      event.preventDefault();
      applyMotion(!calmMode, { announce: true });
    }
  });

  window.showAtelierToast = message => {
    const toast = pick('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.showAtelierToast.timer);
    window.showAtelierToast.timer = setTimeout(() => toast.classList.remove('show'), 1700);
  };

  /* ---------- Unified chapter sigils -----------------------
     The source markup mixes emoji and geometric glyphs for chapter
     icons, which renders inconsistently across platforms. Replace
     them with zero-padded field-chapter numbers in the mono face so
     the sequence reads as one designed system.                    */

  pickAll('.content-block').forEach((block, index) => {
    const icon = pick(':scope > h3 > .icon', block);
    if (!icon) return;
    icon.textContent = String(index + 1).padStart(2, '0');
    icon.classList.add('icon-sigil');
  });

  /* ---------- Platform-correct shortcut hints -------------- */

  const appleLike = /Mac|iPhone|iPad/i.test(navigator.userAgentData?.platform || navigator.platform || navigator.userAgent);
  if (!appleLike) {
    pickAll('kbd').forEach(key => {
      const label = key.textContent.trim();
      if (label === '⌘K') key.textContent = 'Ctrl K';
      if (label === '⌘ K') key.textContent = 'Ctrl K';
    });
  }

  /* ---------- Boot ----------------------------------------- */

  applyTheme(activeTheme);
  applyMotion(calmMode);
  systemCalm.addEventListener('change', event => { if (event.matches) applyMotion(true); });
  wideViewport.addEventListener('change', () => { if (wideViewport.matches) stream.start(); else stream.stop(); });
})();
