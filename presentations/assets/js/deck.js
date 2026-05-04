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
                }).catch(err => {
                    console.error('[deck] mermaid render failed', err);
                });
            }));
        });
    }

    function renderAllMermaid() {
        return Promise.all(slides.map(s => renderMermaidIfNeeded(s) || Promise.resolve()));
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

        Promise.all([renderAllMermaid(), highlightAll()]).then(() => {
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
        highlightIfNeeded(slides[currentIndex]);

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
