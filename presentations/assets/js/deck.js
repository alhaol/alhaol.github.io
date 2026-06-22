/* ==========================================================================
   deck.js — Vanilla presentation engine
   No dependencies. Lazy-loads highlight.js & mermaid only when needed.
   ========================================================================== */
(function () {
    'use strict';

    // ----- DOM bootstrap ----------------------------------------------------
    const stage = document.querySelector('.deck-stage');
    const canvas = document.querySelector('.deck-canvas');
    const slides = Array.from(canvas ? canvas.querySelectorAll('.slide') : []);

    if (!stage || !canvas || slides.length === 0) {
        console.warn('[deck] no slides found — engine inactive');
        return;
    }

    const deckMeta = {
        slug: document.body.dataset.deckSlug || 'untitled',
        title: document.title || 'Presentation'
    };

    // ----- State ------------------------------------------------------------
    let currentIndex = 0;
    let overviewMode = false;
    let inited = false;
    const channel = ('BroadcastChannel' in window)
        ? new BroadcastChannel('deck-' + deckMeta.slug)
        : null;

    // ----- Chrome (progress bar, section dots, counter, tag, tools) -------
    function buildChrome() {
        const chrome = document.createElement('div');
        chrome.className = 'deck-chrome';
        chrome.innerHTML = `
            <div class="deck-progress" aria-hidden="true"><div class="deck-progress-bar"></div></div>
            <div class="deck-sections" role="navigation" aria-label="Sections"></div>
            <a class="deck-back" href="${document.body.dataset.backHref || '../../index.html'}" title="Back to presentations hub">← // back</a>
            <div class="deck-tools">
                <button class="deck-tool-btn deck-theme-btn" type="button" aria-label="Toggle light/dark mode" title="Toggle theme (T)"></button>
                <button class="deck-tool-btn deck-export-btn" type="button" aria-label="Export PDF">↓ pdf</button>
                <button class="deck-tool-btn deck-help-toggle" type="button" aria-label="Keyboard shortcuts">?</button>
            </div>
            <div class="deck-tag">// Ibrahim AbuAlhaol</div>
            <div class="deck-counter" aria-live="polite" aria-atomic="true" aria-label="Slide"><span class="current">01</span> / <span class="total">${String(slides.length).padStart(2, '0')}</span></div>
        `;
        document.body.appendChild(chrome);

        const help = document.createElement('div');
        help.className = 'deck-help';
        help.innerHTML = `
            <div class="deck-help-content">
                <h3>// keyboard shortcuts</h3>
                <table>
                    <tr><td><kbd>→</kbd> <kbd>Space</kbd> <kbd>PgDn</kbd></td><td>Next slide / fragment</td></tr>
                    <tr><td><kbd>←</kbd> <kbd>PgUp</kbd></td><td>Previous slide / fragment</td></tr>
                    <tr><td><kbd>Home</kbd> <kbd>End</kbd></td><td>First / last</td></tr>
                    <tr><td><kbd>F</kbd></td><td>Fullscreen</td></tr>
                    <tr><td><kbd>O</kbd></td><td>Overview mode</td></tr>
                    <tr><td><kbd>N</kbd></td><td>Speaker notes window</td></tr>
                    <tr><td><kbd>T</kbd></td><td>Toggle light / dark theme</td></tr>
                    <tr><td><kbd>E</kbd></td><td>Export PDF</td></tr>
                    <tr><td><kbd>P</kbd> <kbd>Ctrl+P</kbd></td><td>Browser print</td></tr>
                    <tr><td><kbd>?</kbd> <kbd>Esc</kbd></td><td>Toggle / close this</td></tr>
                </table>
            </div>
        `;
        document.body.appendChild(help);

        chrome.querySelector('.deck-help-toggle').addEventListener('click', toggleHelp);
        chrome.querySelector('.deck-export-btn').addEventListener('click', exportPDF);
        chrome.querySelector('.deck-theme-btn').addEventListener('click', () => setTheme(currentTheme() === 'light' ? 'dark' : 'light'));
        help.addEventListener('click', e => { if (e.target === help) toggleHelp(false); });

        applyInitialTheme();
        buildSectionDots();
    }

    // ----- Theme -----------------------------------------------------------
    const SUN_SVG  = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';
    const MOON_SVG = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }
    function applyInitialTheme() {
        let saved = null;
        try { saved = localStorage.getItem('deck-theme'); } catch (_) {}
        if (saved !== 'light' && saved !== 'dark') {
            saved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
        }
        setTheme(saved, { skipPersist: true });
    }
    function setTheme(mode, opts) {
        opts = opts || {};
        if (mode === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        if (!opts.skipPersist) {
            try { localStorage.setItem('deck-theme', mode); } catch (_) {}
        }
        updateThemeButton();
        rerenderMermaid();
        rerenderCharts();
        rerenderConcept();
    }
    function updateThemeButton() {
        const btn = document.querySelector('.deck-theme-btn');
        if (!btn) return;
        // Show the icon for the OPPOSITE mode (what clicking will switch to)
        btn.innerHTML = currentTheme() === 'light' ? MOON_SVG : SUN_SVG;
    }
    function rerenderMermaid() {
        // Only act on diagrams that have already been rendered (we kept their
        // source in data-source). Unrendered diagrams will pick up the current
        // theme on their first render via mermaidThemeVars().
        const nodes = document.querySelectorAll('.mermaid[data-source]');
        if (!nodes.length) return;
        loadMermaid().then(mermaid => {
            if (!mermaid) return;
            mermaid.initialize({
                startOnLoad: false,
                theme: 'base',
                themeVariables: mermaidThemeVars()
            });
            nodes.forEach((n, i) => {
                const id = 'mermaid-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7) + '-' + i;
                mermaid.render(id, n.dataset.source).then(({ svg }) => {
                    n.innerHTML = svg;
                    n.dataset.rendered = '1';
                    normalizeMermaidSvg(n);
                }).catch(err => console.error('[deck] mermaid re-render failed', err));
            });
        });
    }
    function mermaidThemeVars() {
        if (currentTheme() === 'light') {
            return {
                primaryColor: '#f8fafc',
                primaryTextColor: '#0f172a',
                primaryBorderColor: '#15803d',
                lineColor: '#15803d',
                secondaryColor: '#e2e8f0',
                tertiaryColor: '#ffffff',
                background: '#ffffff',
                mainBkg: '#f8fafc',
                secondBkg: '#e2e8f0',
                fontFamily: 'JetBrains Mono, monospace'
            };
        }
        return {
            primaryColor: '#111111',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#00ff41',
            lineColor: '#00ff41',
            secondaryColor: '#1a1a1a',
            tertiaryColor: '#0a0a0a',
            background: '#050505',
            mainBkg: '#111111',
            secondBkg: '#1a1a1a',
            fontFamily: 'JetBrains Mono, monospace'
        };
    }

    // ----- Section progress strip -----------------------------------------
    // Renders a row of dots (upcoming / visited / active) plus an inline
    // label spelling out the current section. Sections are auto-detected:
    // slide #1 (cover) and any .slide-section divider start a new section.
    let sections = [];
    function buildSectionDots() {
        const container = document.querySelector('.deck-sections');
        if (!container) return;
        sections = [];
        slides.forEach((s, i) => {
            const isCover = i === 0;
            const isSection = s.classList.contains('slide-section');
            if (isCover || isSection) {
                const label = (s.querySelector('h1, h2')?.textContent || ('Section ' + sections.length)).trim();
                sections.push({ index: i, label });
            }
        });
        if (sections.length <= 1) {
            container.style.display = 'none';
            return;
        }

        const row = document.createElement('div');
        row.className = 'section-dot-row';
        sections.forEach((sec, i) => {
            const dot = document.createElement('button');
            dot.className = 'section-dot upcoming';
            dot.type = 'button';
            dot.dataset.sectionIndex = String(i);
            dot.setAttribute('aria-label', sec.label);
            dot.innerHTML = `<span class="section-tip">${String(i + 1).padStart(2, '0')} · ${escapeHtml(sec.label)}</span>`;
            dot.addEventListener('click', () => goTo(sec.index));
            row.appendChild(dot);
        });
        container.appendChild(row);

        const label = document.createElement('div');
        label.className = 'section-label';
        label.setAttribute('aria-live', 'polite');
        label.setAttribute('aria-atomic', 'true');
        label.innerHTML = `<span class="section-num-prefix">//</span><span class="section-name"></span>`;
        container.appendChild(label);
    }

    function updateSectionDots() {
        const dots = document.querySelectorAll('.section-dot');
        if (!dots.length) return;
        let activeIdx = 0;
        for (let i = 0; i < sections.length; i++) {
            if (currentIndex >= sections[i].index) activeIdx = i;
        }
        dots.forEach((d, i) => {
            const isActive = i === activeIdx;
            d.classList.toggle('active', isActive);
            d.classList.toggle('visited', i < activeIdx);
            d.classList.toggle('upcoming', i > activeIdx);
            if (isActive) d.setAttribute('aria-current', 'step');
            else d.removeAttribute('aria-current');
        });
        const labelEl = document.querySelector('.deck-sections .section-name');
        const numEl = document.querySelector('.deck-sections .section-num-prefix');
        if (labelEl && sections[activeIdx]) {
            labelEl.textContent = sections[activeIdx].label;
        }
        if (numEl) {
            numEl.textContent = '// ' + String(activeIdx + 1).padStart(2, '0') + ' ·';
        }
    }

    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function updateChrome() {
        const cur = document.querySelector('.deck-counter .current');
        const bar = document.querySelector('.deck-progress-bar');
        if (cur) cur.textContent = String(currentIndex + 1).padStart(2, '0');
        if (bar) bar.style.width = (((currentIndex + 1) / slides.length) * 100) + '%';
        updateSectionDots();
    }

    // ----- Fragments -------------------------------------------------------
    function fragments(slide) {
        return Array.from(slide.querySelectorAll('[data-fragment]'));
    }
    function visibleFragments(slide) {
        return fragments(slide).filter(f => f.classList.contains('fragment-visible'));
    }
    function nextFragment(slide) {
        const all = fragments(slide);
        const next = all.find(f => !f.classList.contains('fragment-visible'));
        if (next) { next.classList.add('fragment-visible'); return true; }
        return false;
    }
    function prevFragment(slide) {
        const visible = visibleFragments(slide);
        if (visible.length) {
            visible[visible.length - 1].classList.remove('fragment-visible');
            return true;
        }
        return false;
    }
    function resetFragments(slide) {
        fragments(slide).forEach(f => f.classList.remove('fragment-visible'));
    }
    function revealAllFragments(slide) {
        fragments(slide).forEach(f => f.classList.add('fragment-visible'));
    }

    // ----- Slide numbering for overview ------------------------------------
    function decorateSlides() {
        slides.forEach((s, i) => {
            const num = document.createElement('span');
            num.className = 'slide-overview-num';
            num.textContent = String(i + 1).padStart(2, '0');
            s.appendChild(num);
            s.addEventListener('click', () => {
                if (overviewMode) {
                    setOverview(false);
                    goTo(i);
                }
            });
        });
    }

    // ----- Scaling ---------------------------------------------------------
    function fitCanvas() {
        if (overviewMode) {
            canvas.style.transform = '';
            return;
        }
        const sw = canvas.clientWidth || 1280;
        const sh = canvas.clientHeight || 720;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const scale = Math.min(vw / sw, vh / sh) * 0.96;
        canvas.style.transform = `scale(${scale})`;
    }

    // ----- Navigation ------------------------------------------------------
    function goTo(i, opts) {
        opts = opts || {};
        if (i < 0 || i >= slides.length) return;
        const direction = i < currentIndex ? 'back' : 'forward';
        slides[currentIndex].classList.remove('active');
        slides[currentIndex].removeAttribute('aria-current');
        currentIndex = i;
        canvas.classList.toggle('going-back', direction === 'back');
        slides[currentIndex].classList.add('active');
        slides[currentIndex].setAttribute('aria-current', 'true');

        // Fragments policy:
        //  - opts.entryMode === 'reveal-all'  → e.g. Home/End/section dot/hash
        //  - direction back                   → reveal all (audience just saw them)
        //  - direction forward                → start hidden (will animate in)
        if (opts.entryMode === 'reveal-all' || direction === 'back') {
            revealAllFragments(slides[currentIndex]);
        } else {
            resetFragments(slides[currentIndex]);
        }

        updateChrome();
        updateHash();
        broadcast();
        renderMermaidIfNeeded(slides[currentIndex]);
        renderChartsIfNeeded(slides[currentIndex]);
        renderConceptIfNeeded(slides[currentIndex]);
        highlightIfNeeded(slides[currentIndex]);
    }

    function next() {
        if (nextFragment(slides[currentIndex])) { broadcast(); return; }
        goTo(Math.min(currentIndex + 1, slides.length - 1));
    }
    function prev() {
        if (prevFragment(slides[currentIndex])) { broadcast(); return; }
        goTo(Math.max(currentIndex - 1, 0));
    }

    function updateHash() {
        const newHash = '#/' + (currentIndex + 1);
        if (location.hash !== newHash) {
            history.replaceState(null, '', newHash);
        }
    }

    function readHash() {
        const m = (location.hash || '').match(/^#\/(\d+)/);
        if (m) {
            const n = parseInt(m[1], 10) - 1;
            if (n >= 0 && n < slides.length) return n;
        }
        return 0;
    }

    // ----- Overview --------------------------------------------------------
    function setOverview(on) {
        overviewMode = !!on;
        document.body.classList.toggle('deck-overview', overviewMode);
        if (!overviewMode) fitCanvas();
        else canvas.style.transform = '';
    }

    // ----- Help ------------------------------------------------------------
    function toggleHelp(force) {
        const help = document.querySelector('.deck-help');
        if (!help) return;
        const target = (typeof force === 'boolean') ? force : !help.classList.contains('visible');
        help.classList.toggle('visible', target);
    }

    // ----- Fullscreen ------------------------------------------------------
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }

    // ----- Broadcast (notes window) ----------------------------------------
    function broadcast() {
        if (!channel) return;
        const slide = slides[currentIndex];
        const notes = slide.querySelector('.speaker-notes');
        const next = slides[currentIndex + 1];
        const nextTitle = next ? (next.querySelector('h1, h2, h3')?.textContent?.trim() || '') : '';
        channel.postMessage({
            type: 'slide',
            index: currentIndex,
            total: slides.length,
            title: slide.querySelector('h1, h2, h3')?.textContent?.trim() || '',
            notes: notes ? notes.innerHTML : '',
            nextTitle
        });
    }

    function openNotes() {
        const url = new URL('../../assets/js/notes.html', location.href);
        url.hash = encodeURIComponent(deckMeta.slug);
        window.open(url.toString(), 'deck-notes-' + deckMeta.slug,
            'width=720,height=540,menubar=no,toolbar=no,location=no');
        // re-broadcast after a moment so the just-opened window receives state
        setTimeout(broadcast, 700);
    }

    // ----- Lazy library loaders --------------------------------------------
    let hlPromise = null;
    function loadHighlight() {
        if (hlPromise) return hlPromise;
        hlPromise = new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.10.0/build/styles/atom-one-dark.min.css';
            document.head.appendChild(link);
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.10.0/build/highlight.min.js';
            s.onload = () => resolve(window.hljs);
            s.onerror = () => resolve(null);
            document.head.appendChild(s);
        });
        return hlPromise;
    }

    function highlightIfNeeded(slide) {
        const blocks = slide.querySelectorAll('pre code');
        if (!blocks.length) return;
        loadHighlight().then(hljs => {
            if (!hljs) return;
            blocks.forEach(b => {
                if (!b.dataset.hlDone) {
                    hljs.highlightElement(b);
                    b.dataset.hlDone = '1';
                }
            });
        });
    }

    // Strip the inline style="max-width:<intrinsic>px" mermaid emits so the
    // CSS sizing rules (.slide-diagram .mermaid svg { width/height: 100% })
    // can take effect. Pin preserveAspectRatio so the viewBox scales the
    // diagram down to fit; backfill a viewBox if mermaid omitted one.
    function normalizeMermaidSvg(root) {
        const scope = root || document;
        scope.querySelectorAll('.mermaid svg').forEach(svg => {
            svg.removeAttribute('style');
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            if (!svg.getAttribute('viewBox') && typeof svg.getBBox === 'function') {
                try {
                    const b = svg.getBBox();
                    if (b.width && b.height) {
                        svg.setAttribute('viewBox',
                            `${b.x} ${b.y} ${b.width} ${b.height}`);
                    }
                } catch (_) { /* SVG not yet laid out; harmless */ }
            }
        });
    }

    let mermaidPromise = null;
    function loadMermaid() {
        if (mermaidPromise) return mermaidPromise;
        mermaidPromise = new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
            s.onload = () => {
                if (window.mermaid) {
                    window.mermaid.initialize({
                        startOnLoad: false,
                        theme: 'base',
                        themeVariables: mermaidThemeVars()
                    });
                }
                resolve(window.mermaid);
            };
            s.onerror = () => resolve(null);
            document.head.appendChild(s);
        });
        return mermaidPromise;
    }

    function renderMermaidIfNeeded(slide) {
        const nodes = slide.querySelectorAll('.mermaid:not([data-rendered])');
        if (!nodes.length) return Promise.resolve();
        return loadMermaid().then(mermaid => {
            if (!mermaid) return;
            return Promise.all(Array.from(nodes).map((n, i) => {
                const src = (n.dataset.source || n.textContent).trim();
                if (!n.dataset.source) n.dataset.source = src; // preserve for re-theme
                const id = 'mermaid-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7) + '-' + i;
                return mermaid.render(id, src).then(({ svg }) => {
                    n.innerHTML = svg;
                    n.dataset.rendered = '1';
                    normalizeMermaidSvg(n);
                }).catch(err => {
                    console.error('[deck] mermaid render failed', err);
                });
            }));
        });
    }

    function renderAllMermaid() {
        return Promise.all(slides.map(s => renderMermaidIfNeeded(s) || Promise.resolve()));
    }

    // ----- Chart.js lazy loader (mirrors loadMermaid pattern) --------------
    let chartPromise = null;
    function loadCharts() {
        if (chartPromise) return chartPromise;
        // Skip work if the deck has no chart canvases at all
        if (!document.querySelector('.slide-chart canvas[data-chart]')) {
            chartPromise = Promise.resolve(null);
            return chartPromise;
        }
        chartPromise = new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
            s.onload = () => resolve(window.Chart || null);
            s.onerror = () => resolve(null);
            document.head.appendChild(s);
        });
        return chartPromise;
    }

    function chartThemeColors() {
        const light = currentTheme() === 'light';
        return {
            text: light ? '#0f172a' : '#ffffff',
            muted: light ? '#475569' : '#b3b3b3',
            grid: light ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)',
            primary: light ? '#15803d' : '#00ff41'
        };
    }

    // Walk a chart config and overlay theme-derived colors on top of any
    // colors the deck author left to defaults. We deliberately only touch
    // tick / grid / legend / pointLabel / title colors — anything the author
    // set explicitly on dataset borderColor / backgroundColor is preserved.
    function applyChartTheme(config) {
        const c = chartThemeColors();
        config.options = config.options || {};
        config.options.responsive = true;
        config.options.maintainAspectRatio = false;

        const plugins = config.options.plugins = config.options.plugins || {};
        plugins.legend = plugins.legend || {};
        plugins.legend.labels = plugins.legend.labels || {};
        plugins.legend.labels.color = c.text;
        if (plugins.title) {
            plugins.title.color = plugins.title.color || c.text;
        }
        if (plugins.tooltip) {
            plugins.tooltip.bodyColor = plugins.tooltip.bodyColor || c.text;
            plugins.tooltip.titleColor = plugins.tooltip.titleColor || c.primary;
        }

        const scales = config.options.scales = config.options.scales || {};
        Object.keys(scales).forEach(k => {
            const ax = scales[k] = scales[k] || {};
            ax.ticks = ax.ticks || {};
            ax.ticks.color = c.muted;
            ax.ticks.backdropColor = 'transparent';
            ax.grid = ax.grid || {};
            ax.grid.color = c.grid;
            if (ax.pointLabels) {
                ax.pointLabels.color = ax.pointLabels.color || c.text;
            } else if (k === 'r') {
                ax.pointLabels = { color: c.text };
            }
            if (ax.title) ax.title.color = ax.title.color || c.muted;
        });

        return config;
    }

    function renderChartsIfNeeded(slide) {
        if (!slide || !slide.classList.contains('slide-chart')) return Promise.resolve();
        const canvases = slide.querySelectorAll('canvas[data-chart]');
        if (!canvases.length) return Promise.resolve();
        return loadCharts().then(Chart => {
            if (!Chart) return;
            canvases.forEach(canvas => {
                if (canvas._chartInstance) return;
                let cfg;
                try {
                    cfg = JSON.parse(canvas.getAttribute('data-chart'));
                } catch (err) {
                    console.error('[deck] chart JSON parse failed', err, canvas);
                    return;
                }
                applyChartTheme(cfg);
                canvas._chartInstance = new Chart(canvas, cfg);
            });
        });
    }

    function renderAllCharts() {
        return Promise.all(slides.map(s => renderChartsIfNeeded(s) || Promise.resolve()));
    }

    function rerenderCharts() {
        // Destroy + rebuild so axis / legend / tick colors pick up the new theme
        document.querySelectorAll('canvas[data-chart]').forEach(canvas => {
            if (canvas._chartInstance) {
                canvas._chartInstance.destroy();
                canvas._chartInstance = null;
            }
        });
        renderChartsIfNeeded(slides[currentIndex]);
    }

    function highlightAll() {
        return loadHighlight().then(hljs => {
            if (!hljs) return;
            slides.forEach(s => {
                s.querySelectorAll('pre code').forEach(b => {
                    if (!b.dataset.hlDone) { hljs.highlightElement(b); b.dataset.hlDone = '1'; }
                });
            });
        });
    }

    // ----- Concept viz: taxonomy tree + force-directed knowledge graph -----
    // Renders <div class="concept-map" data-concept='{...}' data-mode="tree|graph">.
    // Schema (shared with the create-html-app-card DECK; nodes≈cards, links≈cross):
    //   { "root":"NAME", "rootCount":N?, "groups":{ key:{label,color} },
    //     "nodes":[{id,group,label,name?,gist?}], "links":[[a,b,"label"]]? }
    function conceptTheme() {
        const cs = getComputedStyle(document.documentElement);
        const g = (n, d) => (cs.getPropertyValue(n).trim() || d);
        return {
            bg: g('--bg-color', '#050505'),
            line: g('--border-color', '#333333'),
            text: g('--text-main', '#ffffff'),
            muted: g('--text-muted', '#b3b3b3'),
            primary: g('--primary-color', '#00ff41'),
            card: g('--card-bg', '#111111')
        };
    }
    function parseConcept(el) {
        try { return JSON.parse(el.getAttribute('data-concept')); }
        catch (e) { console.error('[deck] concept JSON parse failed', e, el); return null; }
    }
    function conceptTooltip() {
        let tip = document.querySelector('.cm-tip');
        if (!tip) {
            tip = document.createElement('div');
            tip.className = 'cm-tip';
            tip.style.display = 'none';
            document.body.appendChild(tip);
        }
        return tip;
    }

    function buildConceptTree(el, data) {
        const groups = data.groups || {};
        const nodes = data.nodes || [];
        const t = conceptTheme();
        // In light theme, colored keyword text on the near-white card reads poorly,
        // so use the theme text color and let the border/stripe carry the group color.
        const kwColor = g => (currentTheme() === 'light' ? t.text : g.color);
        let branches = '';
        Object.keys(groups).forEach(k => {
            const g = groups[k];
            const items = nodes.filter(n => n.group === k);
            let leaves = '';
            items.forEach(n => {
                leaves += '<li><div class="cm-node cm-leaf" style="border-left:3px solid ' + g.color + '">'
                    + '<span class="cm-k" style="color:' + kwColor(g) + '">' + escapeHtml(n.label || n.name || '') + '</span>'
                    + (n.name && n.label ? '<span class="cm-n">' + escapeHtml(n.name) + '</span>' : '')
                    + (n.gist ? '<span class="cm-g">' + escapeHtml(n.gist) + '</span>' : '')
                    + '</div></li>';
            });
            branches += '<li><div class="cm-node cm-group" style="border-color:' + g.color + '66;background:' + g.color + '18">'
                + '<span class="cm-k" style="color:' + kwColor(g) + '">' + escapeHtml(g.label) + '</span>'
                + '<span class="cm-n">' + items.length + ' ' + (items.length === 1 ? 'item' : 'items') + '</span>'
                + '</div><ul>' + leaves + '</ul></li>';
        });
        el.innerHTML = '<div class="cm-scroll"><div class="cm-org"><ul><li>'
            + '<div class="cm-node cm-root"><span class="cm-k">' + escapeHtml(String(data.rootCount != null ? data.rootCount : nodes.length)) + '</span>'
            + '<span class="cm-n">' + escapeHtml(data.root || '') + '</span></div>'
            + '<ul>' + branches + '</ul></li></ul></div></div>';
    }

    function buildConceptGraph(el, data, animate) {
        const t = conceptTheme();
        const light = currentTheme() === 'light';
        const groups = data.groups || {};
        const dataNodes = data.nodes || [];
        const cross = data.links || [];
        const W = 1000, H = 560, CX = W / 2, CY = H / 2;

        const nodes = [];
        const idx = {};
        function add(n) { idx[n.id] = nodes.length; nodes.push(n); }
        add({ id: '__root', type: 'root', label: String(data.rootCount != null ? data.rootCount : dataNodes.length), name: data.root || 'Root', gist: data.root || '', color: t.primary });
        Object.keys(groups).forEach(k => {
            add({ id: k, type: 'group', group: k, label: groups[k].label, name: groups[k].label, gist: dataNodes.filter(n => n.group === k).length + ' items', color: groups[k].color });
        });
        dataNodes.forEach(n => {
            const col = (groups[n.group] && groups[n.group].color) || t.primary;
            add({ id: n.id, type: 'leaf', group: n.group, label: n.label || n.name || n.id, name: n.name || n.label || n.id, gist: n.gist || '', color: col });
        });
        nodes.forEach(n => { n.hw = n.type === 'root' ? 30 : (24 + n.label.length * 4); n.hh = n.type === 'root' ? 30 : 14; });

        const edges = [];
        Object.keys(groups).forEach(k => { if (idx[k] != null) edges.push({ a: '__root', b: k, type: 'h', len: 150 }); });
        dataNodes.forEach(n => { if (idx[n.id] != null && idx[n.group] != null) edges.push({ a: n.group, b: n.id, type: 'h', len: 100 }); });
        cross.forEach(c => { if (idx[c[0]] != null && idx[c[1]] != null) edges.push({ a: c[0], b: c[1], type: 'c', len: 150, label: c[2] }); });

        nodes.forEach(n => { if (n.type === 'root') { n.x = CX; n.y = CY; n.fx = CX; n.fy = CY; } });
        const groupNodes = nodes.filter(n => n.type === 'group');
        groupNodes.forEach((n, i) => { const a = (-90 + i * (360 / groupNodes.length)) * Math.PI / 180; n.x = CX + Math.cos(a) * 150; n.y = CY + Math.sin(a) * 150; n.seedAng = a; });
        const byG = {}; groupNodes.forEach(n => { byG[n.group] = n; });
        const cnt = {};
        nodes.filter(n => n.type === 'leaf').forEach(n => {
            const p = byG[n.group] || { x: CX, y: CY, seedAng: Math.random() * 6.28 };
            const k = (cnt[n.group] || 0); cnt[n.group] = k + 1;
            const a = (p.seedAng || 0) + (k - 1) * 0.5;
            n.x = (p.x || CX) + Math.cos(a) * 95 + (Math.random() * 8 - 4);
            n.y = (p.y || CY) + Math.sin(a) * 95 + (Math.random() * 8 - 4);
        });
        nodes.forEach(n => { n.vx = 0; n.vy = 0; if (n.x == null) { n.x = CX + (Math.random() * 40 - 20); n.y = CY + (Math.random() * 40 - 20); } });

        let linksHtml = '';
        edges.forEach((e, i) => { linksHtml += '<line id="cme' + i + '" class="' + (e.type === 'c' ? 'cm-link-cross' : 'cm-link') + '"></line>'; });
        let labelsHtml = '';
        edges.forEach((e, i) => { if (e.label) labelsHtml += '<text id="cml' + i + '" class="cm-glabel" text-anchor="middle">' + escapeHtml(e.label) + '</text>'; });
        let nodesHtml = '';
        nodes.forEach((n, i) => {
            let inner;
            if (n.type === 'root') {
                inner = '<circle class="cm-body" r="30" fill="' + n.color + '"></circle>'
                    + '<text class="cm-lbl" text-anchor="middle" dy=".1em" style="font-weight:800;font-size:17px;fill:' + t.bg + '">' + escapeHtml(n.label) + '</text>';
            } else {
                const isG = n.type === 'group';
                const fill = isG ? n.color : t.card;
                // Group nodes fill with the bright group color (dark text reads on it in
                // both themes). Leaf labels: group color on dark, theme text on light —
                // the colored stroke around the leaf carries the group identity in light.
                const txt = isG ? '#0a0a0a' : (light ? t.text : n.color);
                inner = '<rect class="cm-body" fill="' + fill + '"' + (isG ? '' : ' stroke="' + n.color + '" stroke-width="2.5"') + '></rect>'
                    + '<text class="cm-lbl" text-anchor="middle" dy=".32em" style="font-weight:800;font-size:11px;fill:' + txt + '">' + escapeHtml(n.label) + '</text>';
            }
            nodesHtml += '<g class="cm-gnode" data-i="' + i + '">' + inner + '</g>';
        });

        el.innerHTML = '<svg class="cm-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">'
            + '<g class="cm-links">' + linksHtml + '</g><g class="cm-labels">' + labelsHtml + '</g><g class="cm-nodes">' + nodesHtml + '</g></svg>';

        const svg = el.querySelector('.cm-svg');
        const nodeEls = Array.prototype.slice.call(svg.querySelectorAll('.cm-gnode'));
        const lineEls = edges.map((e, i) => svg.querySelector('#cme' + i));
        const labelEls = edges.map((e, i) => e.label ? svg.querySelector('#cml' + i) : null);
        const tip = conceptTooltip();

        nodeEls.forEach((g, i) => {
            const n = nodes[i];
            if (n.type === 'root') { n.hw = 30; n.hh = 30; return; }
            const tx = g.querySelector('.cm-lbl');
            let tw = 0; try { tw = tx.getComputedTextLength(); } catch (e) { tw = n.label.length * 7; }
            if (!tw) tw = n.label.length * 7;
            const h = 28, w = Math.max(h, tw + 26);
            const body = g.querySelector('.cm-body');
            body.setAttribute('x', -w / 2); body.setAttribute('y', -h / 2);
            body.setAttribute('width', w); body.setAttribute('height', h); body.setAttribute('rx', h / 2);
            n.hw = w / 2; n.hh = h / 2;
        });

        const REP = 38000, SPRING = 0.05, CENTER = 0.013, DAMP = 0.86, MAXV = 12;
        function stepSim() {
            for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                let dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy; if (d2 < 1) d2 = 1;
                const d = Math.sqrt(d2), f = REP / d2, fx = dx / d * f, fy = dy / d * f;
                a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
            }
            edges.forEach(e => {
                const a = nodes[idx[e.a]], b = nodes[idx[e.b]];
                let dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 0.01;
                const f = SPRING * (d - e.len), fx = dx / d * f, fy = dy / d * f;
                a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
            });
            nodes.forEach(n => {
                if (n.fx != null) { n.x = n.fx; n.y = n.fy; n.vx = 0; n.vy = 0; return; }
                n.vx += (CX - n.x) * CENTER; n.vy += (CY - n.y) * CENTER;
                n.vx *= DAMP; n.vy *= DAMP;
                const sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy); if (sp > MAXV) { n.vx *= MAXV / sp; n.vy *= MAXV / sp; }
                n.x += n.vx; n.y += n.vy;
                n.x = Math.max(n.hw + 4, Math.min(W - n.hw - 4, n.x));
                n.y = Math.max(n.hh + 4, Math.min(H - n.hh - 4, n.y));
            });
        }
        function draw() {
            edges.forEach((e, i) => {
                const a = nodes[idx[e.a]], b = nodes[idx[e.b]], ln = lineEls[i];
                ln.setAttribute('x1', a.x); ln.setAttribute('y1', a.y); ln.setAttribute('x2', b.x); ln.setAttribute('y2', b.y);
                if (labelEls[i]) { labelEls[i].setAttribute('x', (a.x + b.x) / 2); labelEls[i].setAttribute('y', (a.y + b.y) / 2 - 2); }
            });
            nodeEls.forEach((g, i) => g.setAttribute('transform', 'translate(' + nodes[i].x + ',' + nodes[i].y + ')'));
        }
        for (let s = 0; s < 280; s++) stepSim();
        draw();

        function toWorld(cx, cy) { const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; return pt.matrixTransform(svg.getScreenCTM().inverse()); }
        let drag = null;
        nodeEls.forEach((g, i) => {
            const n = nodes[i];
            g.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); drag = n; tip.style.display = 'none'; try { g.setPointerCapture(ev.pointerId); } catch (e) {} });
            g.addEventListener('pointerenter', ev => { if (!drag) { tip.innerHTML = '<h6 style="color:' + n.color + '">' + escapeHtml(n.name) + '</h6>' + (n.gist ? '<p>' + escapeHtml(n.gist) + '</p>' : ''); tip.style.display = 'block'; tip.style.left = ev.clientX + 'px'; tip.style.top = ev.clientY + 'px'; } });
            g.addEventListener('pointermove', ev => { if (drag === n) { const p = toWorld(ev.clientX, ev.clientY); n.fx = Math.max(n.hw + 4, Math.min(W - n.hw - 4, p.x)); n.fy = Math.max(n.hh + 4, Math.min(H - n.hh - 4, p.y)); } else if (!drag) { tip.style.left = ev.clientX + 'px'; tip.style.top = ev.clientY + 'px'; } });
            g.addEventListener('pointerleave', () => { if (!drag) tip.style.display = 'none'; });
            g.addEventListener('pointerup', ev => { try { g.releasePointerCapture(ev.pointerId); } catch (e) {} if (drag === n && n.type !== 'root') { n.fx = null; n.fy = null; } drag = null; });
        });

        if (animate) {
            const token = (el._cmToken = (el._cmToken || 0) + 1);
            (function frame() {
                if (token !== el._cmToken) return;
                const slide = el.closest('.slide');
                if (!el.isConnected || !slide || !slide.classList.contains('active')) return;
                stepSim(); draw();
                requestAnimationFrame(frame);
            })();
        }
    }

    function buildConcept(el, animate) {
        const data = parseConcept(el);
        if (!data) return;
        const mode = (el.getAttribute('data-mode') || 'graph').toLowerCase();
        if (mode === 'tree') buildConceptTree(el, data);
        else buildConceptGraph(el, data, animate);
        el.dataset.cmRendered = '1';
    }

    function renderConceptIfNeeded(slide) {
        if (!slide) return;
        slide.querySelectorAll('.concept-map[data-concept]').forEach(el => {
            const mode = (el.getAttribute('data-mode') || 'graph').toLowerCase();
            if (mode === 'tree') { if (!el.dataset.cmRendered) buildConcept(el, false); }
            else buildConcept(el, true); // rebuild graph each activation so the sim restarts cleanly
        });
    }
    function renderAllConcept() {
        slides.forEach(s => s.querySelectorAll('.concept-map[data-concept]').forEach(el => buildConcept(el, false)));
    }
    function rerenderConcept() {
        if (!inited) return;
        document.querySelectorAll('.concept-map[data-concept]').forEach(el => { el.dataset.cmRendered = ''; });
        renderConceptIfNeeded(slides[currentIndex]);
    }

    // ----- PDF export ------------------------------------------------------
    // Strategy: pre-render every Mermaid diagram, swap iframes for printable
    // placeholders, paint the body in is-printing mode (so the user sees the
    // print layout briefly), then call window.print(). Restore on afterprint.
    let exporting = false;
    function exportPDF() {
        if (exporting) return;
        exporting = true;
        const btn = document.querySelector('.deck-export-btn');
        if (btn) { btn.classList.add('is-busy'); btn.textContent = 'rendering'; }

        // Collapse fragments into "all visible" so PDF shows the full slide
        slides.forEach(revealAllFragments);

        // Replace iframes with printable placeholders
        const swapped = [];
        document.querySelectorAll('.slide-video iframe, .slide-embed iframe').forEach(frame => {
            const fallback = document.createElement('div');
            fallback.className = 'print-fallback';
            const url = frame.getAttribute('src') || '';
            fallback.innerHTML = `
                <div class="pf-label">// embedded media</div>
                <div class="pf-url">${escapeHtml(url || '(no source)')}</div>
                <div style="font-size: 12px;">view in the live deck for video / interactive content</div>
            `;
            frame.parentNode.insertBefore(fallback, frame);
            swapped.push({ frame, fallback });
        });

        renderAllConcept();
        Promise.all([renderAllMermaid(), renderAllCharts(), highlightAll()]).then(() => {
            // Give layout/paint a moment to settle
            return new Promise(r => setTimeout(r, 200));
        }).then(() => {
            document.body.classList.add('is-printing');
            return new Promise(r => setTimeout(r, 80));
        }).then(() => {
            const restore = () => {
                document.body.classList.remove('is-printing');
                swapped.forEach(({ fallback }) => fallback.remove());
                if (btn) { btn.classList.remove('is-busy'); btn.textContent = '↓ pdf'; }
                exporting = false;
                window.removeEventListener('afterprint', restore);
            };
            window.addEventListener('afterprint', restore);
            // Safety fallback if afterprint never fires (some browsers)
            setTimeout(() => { if (exporting) restore(); }, 30000);
            window.print();
        }).catch(err => {
            console.error('[deck] export failed', err);
            document.body.classList.remove('is-printing');
            swapped.forEach(({ fallback }) => fallback.remove());
            if (btn) { btn.classList.remove('is-busy'); btn.textContent = '↓ pdf'; }
            exporting = false;
        });
    }

    // ----- Keyboard --------------------------------------------------------
    function onKey(e) {
        if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
        const k = e.key;

        // Help is modal — Esc closes it
        const help = document.querySelector('.deck-help');
        if (help && help.classList.contains('visible')) {
            if (k === 'Escape' || k === '?') { e.preventDefault(); toggleHelp(false); }
            return;
        }

        switch (k) {
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault(); next(); break;
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault(); prev(); break;
            case 'Home':
                e.preventDefault(); goTo(0, { entryMode: 'reveal-all' }); break;
            case 'End':
                e.preventDefault(); goTo(slides.length - 1, { entryMode: 'reveal-all' }); break;
            case 'f': case 'F':
                e.preventDefault(); toggleFullscreen(); break;
            case 'o': case 'O':
                e.preventDefault(); setOverview(!overviewMode); break;
            case 'n': case 'N':
                e.preventDefault(); openNotes(); break;
            case 't': case 'T':
                e.preventDefault(); setTheme(currentTheme() === 'light' ? 'dark' : 'light'); break;
            case 'e': case 'E':
                e.preventDefault(); exportPDF(); break;
            case 'p': case 'P':
                if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); exportPDF(); }
                break;
            case '?':
                e.preventDefault(); toggleHelp(); break;
            case 'Escape':
                if (overviewMode) { e.preventDefault(); setOverview(false); }
                break;
        }
    }

    // ----- Touch swipe -----------------------------------------------------
    let touchStartX = 0, touchStartY = 0;
    function onTouchStart(e) {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
    function onTouchEnd(e) {
        if (!e.changedTouches.length) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) next(); else prev();
        }
    }

    // ----- Init ------------------------------------------------------------
    function init() {
        buildChrome();
        decorateSlides();
        currentIndex = readHash();
        slides[currentIndex].classList.add('active');
        slides[currentIndex].setAttribute('aria-current', 'true');
        if (currentIndex === 0) {
            // Cold start on slide 1: leave fragments hidden so they can build up
            resetFragments(slides[0]);
        } else {
            // Deep-link via hash: reveal everything so user sees the full slide
            revealAllFragments(slides[currentIndex]);
        }
        updateChrome();
        fitCanvas();
        renderMermaidIfNeeded(slides[currentIndex]);
        renderChartsIfNeeded(slides[currentIndex]);
        renderConceptIfNeeded(slides[currentIndex]);
        highlightIfNeeded(slides[currentIndex]);
        inited = true;

        window.addEventListener('resize', fitCanvas);
        window.addEventListener('keydown', onKey);
        window.addEventListener('hashchange', () => goTo(readHash(), { entryMode: 'reveal-all' }));
        document.addEventListener('touchstart', onTouchStart, { passive: true });
        document.addEventListener('touchend', onTouchEnd, { passive: true });

        // when notes window connects and asks for state, broadcast immediately
        if (channel) {
            channel.addEventListener('message', (ev) => {
                if (ev.data && ev.data.type === 'request-state') broadcast();
            });
        }

        broadcast();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
