/* Slide 6 (course program) is skipped, so shown step numbers close the gap: 1..6, then 7. */
const SHOWN_TOTAL = 7;
const shownStep = (i) => (i >= 7 ? i : i + 1);
/**
 * ============================================================================
 * JUNIOR IT — PREMIUM EDTECH INTERACTIVE SYSTEM
 * 7 Interactive Steps (Step 0 to Step 6)
 * Three.js 3D Pixar Teachers (Mentor & Curator), Full LMS Dashboard,
 * 3D Parallax Ambient Gaming World, High-Five Minigames & Strict 30 Coins Engine
 * ============================================================================
 */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // GLOBAL STATE
    // --------------------------------------------------------------------------
    const state = {
        currentLang: 'ru',
        currentSlide: 0,
        totalSlides: 8, // Steps 0 to 7 (slide 6, course program, is skipped in the flow)
        ageCategory: null, // Explicit selection: kids (8–10), juniors (11–13), teens (14–17).
        coins: 0, // Strictly max 30 Junior Coins
        selectedApps: [],
        selectedAppsCount: 0,
        selectedGift: 'VR-очки',
        algoLevel: 1,
        algoQueue: [],
        algoPos: { r: 3, c: 0 },
        isAlgoRunning: false,
        isAlgoTransitioning: false,
        activeLoopModifier: null,
        activeJumpModifier: false,
        algoCoinsCollected: 0,
        algoCollectedCoinCoords: [],
        webTheme: 'blue',
        webModules: { banner: true, roster: true, ticket: true },
        soundEnabled: true,
        audioContext: null,
        completedTasks: 0
    };

    let algoRunTimer = null;
    const algoTransitionTimers = new Set();
    function scheduleAlgoTransition(callback, delay) {
        const timer = setTimeout(() => { algoTransitionTimers.delete(timer); callback(); }, delay);
        algoTransitionTimers.add(timer);
    }
    function stopAlgoRun() {
        if (algoRunTimer !== null) clearInterval(algoRunTimer);
        algoRunTimer = null;
        algoTransitionTimers.forEach(timer => clearTimeout(timer));
        algoTransitionTimers.clear();
        state.isAlgoTransitioning = false;
        document.getElementById('maze-success-panel')?.remove();
        document.getElementById('algo-board')?.classList.remove('portal-entering', 'maze-board-leaving', 'maze-board-arriving');
        state.isAlgoRunning = false;
        document.querySelectorAll('#algo-commands-list .active-step').forEach(el => el.classList.remove('active-step'));
    }

    // --------------------------------------------------------------------------
    // INTERNATIONALIZATION & CONTENT DICTIONARIES
    // Loaded from translations.js
    // --------------------------------------------------------------------------
    const i18n = window.JuniorI18n || {};
    const appComments = i18n.appComments || {};
    const translations = i18n.translations || { ru: {}, uz: {} };

    // --------------------------------------------------------------------------
    // SOUND EFFECTS SYNTHESIZER (WEB AUDIO API)
    // --------------------------------------------------------------------------
    function getAudioContext() {
        if (!state.audioContext) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                state.audioContext = new AudioCtx();
            }
        }
        return state.audioContext;
    }

    window.toggleSound = function () {
        state.soundEnabled = !state.soundEnabled;
        const iconOn = document.getElementById('sound-svg-on');
        const iconOff = document.getElementById('sound-svg-off');
        if (iconOn && iconOff) {
            iconOn.classList.toggle('hidden', !state.soundEnabled);
            iconOff.classList.toggle('hidden', state.soundEnabled);
        }
        if (state.soundEnabled) playSfx('pop');
    };

    window.JuniorSfx = (type, arg) => playSfx(type, arg);

    /* Единая звуковая палитра: всё в ноте до-мажорной пентатоники (C D E G A),
       поэтому любые звуки подряд звучат как одна мелодия, а не как набор писков.
       Мягкие «стеклянные» колокольчики + короткое тёплое эхо + компрессор (никогда не режет слух). */
    let sfxBus = null, sfxStep = 0, sfxStepAt = 0;
    window.__sfxLast = 0;
    function sfxOut(ctx) {
        if (sfxBus && sfxBus.ctx === ctx) return sfxBus.input;
        const input = ctx.createGain(), master = ctx.createGain(), comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 5; comp.attack.value = 0.003; comp.release.value = 0.22;
        master.gain.value = 0.8;
        const dl = ctx.createDelay(0.5), fb = ctx.createGain(), lp = ctx.createBiquadFilter(), wet = ctx.createGain();
        dl.delayTime.value = 0.16; fb.gain.value = 0.22; lp.type = 'lowpass'; lp.frequency.value = 2400; wet.gain.value = 0.16;
        input.connect(master); input.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(wet); wet.connect(master);
        master.connect(comp); comp.connect(ctx.destination);
        sfxBus = { ctx, input };
        return input;
    }
    function sfxTone(ctx, out, f, t, d, v, type, glide, att) {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
        if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + d * 0.9);
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + (att || 0.015)); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g); g.connect(out); o.start(t); o.stop(t + d + 0.03);
        o.onended = () => { o.disconnect(); g.disconnect(); };
    }
    function sfxBell(ctx, out, f, t, d, v) {
        sfxTone(ctx, out, f, t, d, v);
        sfxTone(ctx, out, f * 2, t, d * 0.55, v * 0.28);
        sfxTone(ctx, out, f * 3, t, d * 0.28, v * 0.1);
    }
    function sfxNoise(ctx, out, t, d, v, f0, f1, q) {
        const len = Math.ceil(ctx.sampleRate * d), buf = ctx.createBuffer(1, len, ctx.sampleRate), data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        src.buffer = buf; f.type = 'bandpass'; f.Q.value = q || 0.9;
        f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + d);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + d * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        src.connect(f); f.connect(g); g.connect(out); src.start(t); src.stop(t + d);
    }
    const SFX_N = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98, C7: 2093 };

    /* ===== Готовые записанные звуки (Kenney Interface Sounds, CC0) — три набора на выбор ===== */
    const R_MEL = [1, 1.122, 1.26, 1.498, 1.682, 1.498, 1.26, 1.122];  /* ноты пентатоники для одного сэмпла */
    const SFX_PACKS = {
        '1': { /* «Стекло»: прозрачные колокольчики */
            click: [['glass_005', 0, 0.55]], pop: [['glass_002', 0, 0.7]], unselect: [['glass_006', 0, 0.6, 0.85]],
            stepList: [['glass_002'], ['glass_003'], ['glass_005'], ['glass_006'], ['glass_001']], planetList: [['glass_001'], ['glass_003'], ['glass_005'], ['glass_002']],
            sun: [['glass_004', 0, 0.7]], whoosh: [['scroll_002', 0, 0.45]],
            star: [['glass_005', 0, 0.7], ['glass_002', 0.1, 0.7], ['glass_001', 0.2, 0.8]], coin: [['glass_001', 0, 0.7], ['glass_005', 0.09, 0.7]],
            chime: [['glass_001', 0, 0.7]], error: [['question_004', 0, 0.7]], clap: [['glass_005', 0, 0.5]],
            powerup: [['glass_006', 0, 0.6], ['glass_003', 0.08, 0.6], ['glass_005', 0.16, 0.6], ['glass_001', 0.24, 0.7]],
            fanfare: [['confirmation_004', 0, 0.8], ['glass_001', 0.15, 0.6], ['glass_005', 0.3, 0.6], ['glass_004', 0.45, 0.7]], triumph: [['glass_004', 0.5, 0.5]]
        },
        '2': { /* «Мягкие»: нежные подтверждения интерфейса */
            click: [['select_001', 0, 0.7]], pop: [['select_002', 0, 0.7]], unselect: [['select_001', 0, 0.6, 0.8]],
            stepList: [['pluck_001'], ['pluck_002'], ['select_003'], ['select_004']], planetList: [['maximize_007'], ['maximize_008'], ['maximize_009'], ['maximize_006']],
            sun: [['maximize_008', 0, 0.7]], whoosh: [['switch_002', 0, 0.5]],
            star: [['confirmation_001', 0, 0.8]], coin: [['confirmation_003', 0, 0.8]], chime: [['confirmation_002', 0, 0.7]],
            error: [['question_002', 0, 0.7]], clap: [['select_001', 0, 0.6]], powerup: [['maximize_006', 0, 0.7], ['maximize_009', 0.15, 0.7]],
            fanfare: [['confirmation_001', 0, 0.8], ['confirmation_004', 0.18, 0.8], ['maximize_009', 0.4, 0.6]], triumph: [['confirmation_002', 0.5, 0.6]]
        },
        '3': { /* «Игровые»: бодрые щипки и мелодии, больше энергии */
            click: [['pluck_001', 0, 0.7]], pop: [['pluck_002', 0, 0.8]], unselect: [['drop_001', 0, 0.7]],
            stepMel: 'pluck_001', planetMel: 'pluck_002', sun: [['bong_001', 0, 0.8]], whoosh: [['scroll_003', 0, 0.45]],
            star: [['confirmation_004', 0, 0.8]], coin: [['confirmation_003', 0, 0.8]], chime: [['question_003', 0, 0.7]],
            error: [['drop_002', 0, 0.7]], clap: [['pluck_001', 0, 0.6]], powerup: [['maximize_008', 0, 0.7], ['maximize_009', 0.12, 0.8]],
            fanfare: [['confirmation_004', 0, 0.8], ['question_001', 0.2, 0.7], ['maximize_006', 0.45, 0.7]], triumph: [['confirmation_001', 0.5, 0.7]]
        }
    };
    const sfxBuf = {};
    function sfxLoadPack(id) {
        const P = SFX_PACKS[id]; if (!P) return;
        const ctx = getAudioContext(); if (!ctx) return;
        const names = new Set();
        Object.values(P).forEach(v => { if (typeof v === 'string') names.add(v); else v.forEach(e => names.add(Array.isArray(e[0]) ? e[0][0] : e[0])); });
        names.forEach(n => {
            if (sfxBuf[n]) return; sfxBuf[n] = 'loading';
            fetch('sounds/' + n + '.mp3').then(r => r.arrayBuffer()).then(b => new Promise((ok, no) => ctx.decodeAudioData(b, ok, no))).then(buf => { sfxBuf[n] = buf; }).catch(() => { delete sfxBuf[n]; });
        });
    }
    function sfxSample(id, type, arg) {
        const ctx = getAudioContext(), P = SFX_PACKS[id]; if (!ctx || !P) return;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        window.__sfxLast = performance.now();
        let list = P[type === 'finish' ? 'fanfare' : type === 'boing' ? 'error' : type === 'tick' ? 'click' : type];
        const now = performance.now();
        if (type === 'step') {
            if (now - sfxStepAt > 1400) sfxStep = 0; sfxStepAt = now; const i = sfxStep++;
            list = P.stepMel ? [[P.stepMel, 0, 0.8, R_MEL[i % 8]]] : [[P.stepList[i % P.stepList.length][0], 0, 0.75]];
        } else if (type === 'planet') {
            const i = typeof arg === 'number' ? Math.abs(arg) % 4 : 0;
            list = P.planetMel ? [[P.planetMel, 0, 0.8, [1, 1.26, 1.498, 2][i]]] : [[P.planetList[i][0], 0, 0.75]];
        }
        if (!list) list = P.click;
        const t = ctx.currentTime + 0.005;
        list.forEach(e => {
            const buf = sfxBuf[e[0]]; if (!buf || buf === 'loading') return;
            const src = ctx.createBufferSource(), g = ctx.createGain();
            src.buffer = buf; if (e[3]) src.playbackRate.value = e[3];
            g.gain.value = e[2] == null ? 0.7 : e[2];
            src.connect(g); g.connect(ctx.destination); src.start(t + (e[1] || 0));
            src.onended = () => { src.disconnect(); g.disconnect(); };
        });
    }
    state.sfxPack = 'off'; /* звуки выключены, пока не выбраны новые */
    if (SFX_PACKS[state.sfxPack]) sfxLoadPack(state.sfxPack);

    function playSfx(type, arg) {
        if (!state.soundEnabled) return;
        if (state.sfxPack === 'off') return;
        if (SFX_PACKS[state.sfxPack]) { try { sfxSample(state.sfxPack, type, arg); } catch (e) {} return; }
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume().catch(() => {});
            const out = sfxOut(ctx), t = ctx.currentTime + 0.005, N = SFX_N;
            window.__sfxLast = performance.now();
            const tone = (f, at, d, v, ty, gl, att) => sfxTone(ctx, out, f, t + at, d, v, ty, gl, att);
            const bell = (f, at, d, v) => sfxBell(ctx, out, f, t + at, d, v);
            /* только мягкие чистые «колокольчики»: без шума, без резких скачков высоты, тихо и спокойно */
            switch (type) {
                case 'click': case 'tick': bell(N.A5, 0, 0.16, 0.07); break;
                case 'pop': bell(N.E5, 0, 0.2, 0.09); bell(N.G5, 0.07, 0.24, 0.07); break;
                case 'unselect': bell(N.G5, 0, 0.18, 0.06); break;
                case 'step': {
                    const sc = [N.C5, N.D5, N.E5, N.G5, N.A5, N.G5, N.E5, N.D5], now = performance.now();
                    if (now - sfxStepAt > 1400) sfxStep = 0; sfxStepAt = now;
                    bell(sc[sfxStep++ % sc.length], 0, 0.28, 0.09); break; }
                case 'planet': { const p = [N.C5, N.E5, N.G5, N.C6]; bell(p[typeof arg === 'number' ? Math.abs(arg) % 4 : 0], 0, 0.6, 0.09); break; }
                case 'sun': bell(N.C5, 0, 0.8, 0.08); bell(N.G5, 0.08, 0.8, 0.06); break;
                case 'whoosh': { /* лёгкое воздушное «ааа» из двух мягких нот */
                    const d = typeof arg === 'number' ? Math.min(1, Math.max(0.35, arg)) : 0.5;
                    tone(N.C5, 0, d, 0.05, 'sine', null, d * 0.45); tone(N.G5, 0.05, d, 0.035, 'sine', null, d * 0.45); bell(N.E6, d * 0.7, 0.5, 0.04); break; }
                case 'star': [N.E5, N.G5, N.C6].forEach((f, i) => bell(f, i * 0.11, 0.5, 0.1)); break;
                case 'coin': bell(N.G5, 0, 0.25, 0.09); bell(N.C6, 0.1, 0.5, 0.1); break;
                case 'chime': bell(N.G5, 0, 0.45, 0.08); bell(N.D6, 0.13, 0.55, 0.07); break;
                case 'boing': case 'error': bell(N.D5, 0, 0.35, 0.07); break;
                case 'clap': bell(N.A5, 0, 0.14, 0.06); break;
                case 'powerup': [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => bell(f, i * 0.09, 0.5, 0.08)); break;
                case 'fanfare': case 'finish':
                    [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => bell(f, i * 0.12, 0.7, 0.11));
                    [N.C5, N.G5, N.E6].forEach(f => bell(f, 0.5, 1.2, 0.05)); break;
                case 'triumph': [N.E6, N.D6, N.G6].forEach((f, i) => bell(f, 0.55 + i * 0.12, 0.7, 0.05)); break;
                default:
                    bell(N.A5, 0, 0.16, 0.06);
            }
        } catch (e) {
            console.warn('SFX error:', e);
        }
    }


    /* ВРЕМЕННАЯ панель выбора звуков (убрать: SHOW_SFX_PICKER = false) */
    const SHOW_SFX_PICKER = false;
    (function sfxPicker() {
        if (!SHOW_SFX_PICKER) return;
        const NAME = { ru: { t: 'Звуки:', '1': '1 Стекло', '2': '2 Мягкие', '3': '3 Игровые', synth: 'Синтез', off: 'Тихо' }, uz: { t: 'Tovush:', '1': '1 Shisha', '2': '2 Yumshoq', '3': '3 O‘yin', synth: 'Sintez', off: 'Jim' } };
        const mount = () => {
            if (document.getElementById('sfx-pick')) return;
            const st = document.createElement('style');
            st.textContent = '#sfx-pick{position:fixed;left:16px;bottom:64px;z-index:9500;display:flex;align-items:center;gap:6px;padding:6px 6px 6px 14px;border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 8px 24px rgba(40,90,160,.18);font:600 13px/1 Inter,system-ui,sans-serif;color:#1b2f57;flex-wrap:wrap}#sfx-pick b{margin-right:4px;font-weight:700}#sfx-pick button{border:0;border-radius:999px;padding:8px 12px;font:inherit;background:#eef5ff;color:#2a4d86;cursor:pointer}#sfx-pick button.on{background:linear-gradient(135deg,#ff8a00,#ff6a00);color:#fff}@media(max-width:700px){#sfx-pick{left:8px;right:8px;bottom:56px;justify-content:center;padding:5px;font-size:12px}#sfx-pick b{display:none}#sfx-pick button{padding:7px 8px}}';
            document.head.appendChild(st);
            const box = document.createElement('div'); box.id = 'sfx-pick';
            const draw = () => { const T = NAME[document.documentElement.lang === 'uz' ? 'uz' : 'ru']; box.innerHTML = `<b>${T.t}</b>` + ['1', '2', '3', 'synth', 'off'].map(k => `<button type="button" data-k="${k}" class="${k === state.sfxPack ? 'on' : ''}">${T[k]}</button>`).join(''); };
            draw();
            box.addEventListener('click', (e) => {
                const b = e.target.closest('[data-k]'); if (!b) return; e.stopPropagation();
                state.sfxPack = b.dataset.k; try { localStorage.setItem('junior-sfx', state.sfxPack); } catch (er) {}
                if (SFX_PACKS[state.sfxPack]) sfxLoadPack(state.sfxPack);
                draw();
                const was = state.soundEnabled; state.soundEnabled = true;
                /* короткая демонстрация: кнопка → верный ответ → победа */
                setTimeout(() => playSfx('click'), 250); setTimeout(() => playSfx('star'), 650); setTimeout(() => playSfx('step'), 1250); setTimeout(() => playSfx('step'), 1450); setTimeout(() => { playSfx('fanfare'); state.soundEnabled = was; }, 1850);
            });
            new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
            document.body.appendChild(box);
        };
        if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
    })();

    /* любая кнопка без собственного звука получает мягкий «тук», чтобы нигде не было тишины */
    document.addEventListener('click', (e) => {
        const el = e.target.closest && e.target.closest('button,[role="button"],.ig-opt,a[href]');
        if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true' || el.closest('#btn-sound-toggle,#sfx-pick,#fx-pick')) return;
        const t0 = performance.now();
        setTimeout(() => { if ((window.__sfxLast || 0) < t0) playSfx('click'); }, 0);
    }, true);

    // --------------------------------------------------------------------------
    // HIGH-PERFORMANCE CELEBRATION ENGINE (POOLED CANVAS & WORKERS)
    // --------------------------------------------------------------------------
    let confettiInstance = null;
    let lastConfettiTime = 0;

    function getConfettiEngine() {
        if (!confettiInstance) {
            const canvas = document.getElementById('celebration-canvas');
            if (canvas && typeof confetti !== 'undefined' && typeof confetti.create === 'function') {
                confettiInstance = confetti.create(canvas, { resize: true, useWorker: true });
            } else if (typeof confetti !== 'undefined') {
                confettiInstance = confetti;
            }
        }
        return confettiInstance;
    }

    function fireCelebration(tier = 'step', customOpts = {}) {
        // Respect system reduced-motion settings
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const now = Date.now();
        // Cooldown protection against rapid click spam (min 160ms between bursts)
        if (now - lastConfettiTime < 160 && tier !== 'grand') {
            return;
        }
        lastConfettiTime = now;

        const engine = getConfettiEngine();
        if (!engine) return;

        const presets = {
            micro: {
                particleCount: 18,
                spread: 45,
                origin: { y: 0.7 },
                scalar: 0.85,
                ticks: 120
            },
            step: {
                particleCount: 35,
                spread: 55,
                origin: { y: 0.65 },
                scalar: 0.95,
                ticks: 150
            },
            triumph: {
                particleCount: 65,
                spread: 70,
                origin: { y: 0.6 },
                scalar: 1,
                ticks: 180
            },
            fireworks: {
                particleCount: 45,
                spread: 60,
                ticks: 160
            }
        };

        if (tier === 'grand') {
            try {
                engine({
                    particleCount: 40,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.75 },
                    ticks: 180
                });
                engine({
                    particleCount: 40,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.75 },
                    ticks: 180
                });
            } catch (e) {}
            return;
        }

        const config = Object.assign({}, presets[tier] || presets.step, customOpts);
        try {
            engine(config);
        } catch (e) {}
    }

    function resetCelebration() {
        if (confettiInstance && typeof confettiInstance.reset === 'function') {
            try {
                confettiInstance.reset();
            } catch (e) {}
        }
    }

    window.fireCelebration = fireCelebration;
    window.resetCelebration = resetCelebration;

    // --------------------------------------------------------------------------
    // 3D PARALLAX BACKGROUND PARTICLES
    // --------------------------------------------------------------------------
    function initParallaxAmbient() {
        const badges = document.querySelectorAll('.ambient-badge');
        if (!badges.length) return;

        let ticking = false;
        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;
                    const normX = (mouseX - centerX) / centerX;
                    const normY = (mouseY - centerY) / centerY;

                    badges.forEach(badge => {
                        const speed = parseFloat(badge.dataset.speed || 1.0);
                        const moveX = normX * speed * 22;
                        const moveY = normY * speed * 22;
                        badge.style.setProperty('--px', `${moveX.toFixed(1)}px`);
                        badge.style.setProperty('--py', `${moveY.toFixed(1)}px`);
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --------------------------------------------------------------------------
    // ZERO-THRASH HIGH-PERFORMANCE 3D TILT ENGINE (CARDS)
    // Caches bounding boxes and batches transform calculations via requestAnimationFrame
    // --------------------------------------------------------------------------
    function initNative3DTilt() {
        const cards = document.querySelectorAll('.game-3d-card');
        cards.forEach(card => {
            if (card.classList.contains('helper-card')) return;

            let rect = null;
            let rafId = null;
            let targetX = 0;
            let targetY = 0;

            function onPointerEnter() {
                rect = card.getBoundingClientRect();
                card.style.willChange = 'transform';
                card.style.transition = 'none';
            }

            function onPointerMove(e) {
                if (!rect) rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                targetX = ((y - centerY) / centerY) * -8;
                targetY = ((x - centerX) / centerX) * 8;

                if (!rafId) {
                    rafId = requestAnimationFrame(() => {
                        card.style.transform = `perspective(800px) rotateX(${targetX.toFixed(2)}deg) rotateY(${targetY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
                        rafId = null;
                    });
                }
            }

            function onPointerLeave() {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                rect = null;
                card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
                card.style.transform = '';
                setTimeout(() => {
                    card.style.willChange = 'auto';
                }, 400);
            }

            card.addEventListener('pointerenter', onPointerEnter, { passive: true });
            card.addEventListener('pointermove', onPointerMove, { passive: true });
            card.addEventListener('pointerleave', onPointerLeave, { passive: true });
        });
    }

    // --------------------------------------------------------------------------
    // MASCOT & 3D ROBOT ENGINES: FULLY REMOVED
    // Safe stubs to prevent any null reference errors
    // --------------------------------------------------------------------------
    window.liveRobot = null;
    window.welcomeRobot = null;
    window.finalRobot = null;

    function updateRobotSpeechBubble(text) {}
    window.askRobotForHelp = function () {};

    // --------------------------------------------------------------------------
        // NAVIGATION (8 STEPS: 0 to 7)
    // --------------------------------------------------------------------------
    function applySlide(idx) {
        if (idx < 0 || idx >= state.totalSlides) return;
        resetCelebration();
        if (idx !== 5) stopAlgoRun();
        state.currentSlide = idx;
        document.documentElement.dataset.currentSlide = String(idx);

        // Slide cards
        document.querySelectorAll('.slide-card').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(`slide-${idx}`);
        if (target) target.classList.add('active');

        // Step 3 (Team) activation
        if (idx === 3) {
            // Trigger slight elevation entrance
            const cards = target.querySelectorAll('.helper-card');
            if (cards.length) {
                cards.forEach((c, i) => {
                    c.style.opacity = '0';
                    c.style.transform = 'translateY(14px)';
                    setTimeout(() => {
                        c.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        c.style.opacity = '1';
                        c.style.transform = '';
                    }, 50 + i * 120);
                });
            }
        }

        // Progress Bar
        const pct = Math.min(100, Math.round(((shownStep(idx) - 1) / (SHOWN_TOTAL - 1)) * 100));
        const fillEl = document.getElementById('hud-progress-fill');
        const textEl = document.getElementById('hud-progress-text');
        if (fillEl) fillEl.style.width = `${pct}%`;
        if (textEl) textEl.textContent = `${pct}%`;

        // HUD Step Tag
        const isUz = state.currentLang === 'uz';
        const tagEl = document.getElementById('hud-step-tag');
        if (tagEl) tagEl.textContent = isUz ? `${shownStep(idx)} / ${SHOWN_TOTAL}-qadam` : `Шаг ${shownStep(idx)} из ${SHOWN_TOTAL}`;

        // Mentor texts
        const mTitle = document.getElementById('mentor-step-title');
        const mTip = document.getElementById('mentor-tip-text');
        if (mTitle) mTitle.textContent = isUz ? `${idx + 1}-slayd` : `Слайд ${idx + 1}`;
        if (mTip) mTip.textContent = translations[state.currentLang].mentor_tips[idx];

        // Sync IT-Park University Card on Final Step 5
        if (idx === 5) {
            setTimeout(() => {
                initAlgoGrid();
                updateLiveWebPreview();
            }, 60);
        }
        if (idx === 7) {
            const creatorScene = document.querySelector('.cinematic-scene-portal.scene-creator') || document.getElementById('path-creator-card');
            if (creatorScene) {
                creatorScene.classList.remove('entering');
                void creatorScene.offsetWidth;
                creatorScene.classList.add('entering');
            }
            if (typeof window.selectFuturePath === 'function') {
                window.selectFuturePath('creator', true);
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Переход между слайдами: «Облако» или «Шторка» (transitions.js), без анимации при первом показе и при reduced motion.
    function goToSlide(idx) {
        if (idx < 0 || idx >= state.totalSlides) return;
        const fx = window.JuniorFx;
        if (fx && ((fx.isBusy && fx.isBusy()) || fx.canRun(state.currentSlide, idx))) fx.run(state.currentSlide, idx, () => applySlide(idx));
        else applySlide(idx);
    }
    window.goToSlide = goToSlide;

    window.changeSlide = function (delta) {
        goToSlide(state.currentSlide + delta);
    };

    // --------------------------------------------------------------------------
    // STEP 0: AGE (independent of the selected program)
    // --------------------------------------------------------------------------
    function selectAgeCategory(cat) {
        if (!['kids', 'juniors', 'teens'].includes(cat)) return;
        state.ageCategory = cat;
        document.querySelectorAll('input[name="lesson-age"]').forEach(input => { input.checked = input.value === cat; });
        document.documentElement.dataset.lessonAge = cat;
        try { sessionStorage.setItem('junior.lessonAge', cat); } catch (_) {}
        window.updateProgramPreview?.();
    }
    window.selectAgeCategory = selectAgeCategory;

    window.startAdventure = function () {
        if (!state.ageCategory || !document.querySelector('input[name="lesson-program"]:checked')) return;
        playSfx('click');
        goToSlide(2);
    };

    // --------------------------------------------------------------------------
    // STEP 1: MULTI-SELECT TOGGLE FOR APPS + STAR QUEST BAR
    // --------------------------------------------------------------------------
    function updateStarQuestBar() {
        const count = state.selectedAppsCount;
        const textEl = document.getElementById('quest-counter-text');
        if (textEl) {
            textEl.textContent = state.currentLang === 'uz'
                ? `Tanlandi: ${count} / 3`
                : `Выбрано: ${count} из 3`;
        }

        // 3 SVG Star Slots
        for (let i = 1; i <= 3; i++) {
            const slot = document.getElementById(`star-slot-${i}`);
            if (slot) {
                if (i <= count) {
                    slot.classList.add('filled');
                    slot.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
                } else {
                    slot.classList.remove('filled');
                    slot.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="#CBD5E1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
                }
            }
        }
    }

    window.toggleApp = function (cardOrElem, appName, event) {
        if (event) event.stopPropagation();

        const card = cardOrElem.closest('.app-card') || cardOrElem;
        const isSelected = card.classList.contains('selected');

        if (isSelected) {
            // UNSELECT TOGGLE
            card.classList.remove('selected');
            state.selectedApps = state.selectedApps.filter(a => a !== appName);
            state.selectedAppsCount = Math.max(0, state.selectedAppsCount - 1);

            playSfx('unselect');
            updateStarQuestBar();
            if (typeof updateHoloScanner === 'function') updateHoloScanner(state.currentGalaxyPlanet || 0);
            if (typeof updateAnatomyHUD === 'function') updateAnatomyHUD();

            if (state.selectedAppsCount < 3) {
                const quizBox = document.getElementById('m1-quiz-box');
                if (quizBox) quizBox.classList.add('hidden');
                const nextBtn = document.getElementById('btn-next-step-1');
                if (nextBtn) nextBtn.classList.add('hidden');
            }

            const unselectMsg = state.currentLang === 'uz'
                ? "Ilova bekor qilindi. Boshqa sevimli ilovani tanlashingiz mumkin!"
                : "Выбор снят. Можешь выбрать любое другое приложение!";
            updateRobotSpeechBubble(unselectMsg);
            return;
        }

        // SELECT TOGGLE
        if (state.selectedAppsCount >= 3) {
            card.classList.add('shake-card');
            setTimeout(() => card.classList.remove('shake-card'), 450);
            playSfx('boing');

            const maxMsg = state.currentLang === 'uz'
                ? "3 ta ilova tanlab bo'lindi! Boshqasini tanlash uchun birini bosing va bekor qiling."
                : "Уже выбрано 3 приложения! Чтобы выбрать это, сначала сними выбор с одного из них.";
            updateRobotSpeechBubble(maxMsg);
            return;
        }

        // Add selection
        card.classList.add('selected');
        state.selectedApps.push(appName);
        state.selectedAppsCount = state.selectedApps.length;
        playSfx('pop');
        updateStarQuestBar();
        if (typeof updateHoloScanner === 'function') updateHoloScanner(state.currentGalaxyPlanet || 0);
        if (typeof updateAnatomyHUD === 'function') updateAnatomyHUD();

        const commentObj = appComments[appName];
        if (commentObj) {
            const comment = state.currentLang === 'uz' ? commentObj.uz : commentObj.ru;
            updateRobotSpeechBubble(comment);
        }

        if (state.selectedAppsCount === 3) {
            setTimeout(() => {
                playSfx('fanfare');
                fireCelebration('triumph', { origin: { y: 0.65 } });

                const quizBox = document.getElementById('m1-quiz-box');
                if (quizBox) {
                    quizBox.classList.remove('hidden');
                    quizBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                const nextBtn = document.getElementById('btn-next-step-1');
                if (nextBtn) nextBtn.classList.remove('hidden');

                const unlockMsg = state.currentLang === 'uz'
                    ? "Ajoyib! Siz tanlagan barcha narsalarni dasturchilar yaratadi! Endi jamoa bilan tanishamiz!"
                    : "Супер! Всё, что ты выбрал, создают программисты! Давай знакомиться с нашей 3D-командой!";
                updateRobotSpeechBubble(unlockMsg);
                if (window.liveRobot) window.liveRobot.spinAndCelebrate();
            }, 250);
        }
    };

    window.checkAppAnswer = function (isCorrect, btn) {
        if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;

        if (isCorrect) {
            btn.classList.add('correct');
            playSfx('fanfare');
            fireCelebration('triumph', { origin: { y: 0.7 } });

            const nextBtn = document.getElementById('btn-next-step-1');
            if (nextBtn) nextBtn.classList.remove('hidden');

            const cheerMsg = state.currentLang === 'uz'
                ? "To'ppa-to'g'ri! Dasturchilar bu mo'jizalarni kod bilan yaratishadi! 3D-Jamoa bilan tanishamiz!"
                : "Бинго! Программисты создают любые игры и сайты с помощью кода! Давай знакомиться с 3D-командой!";
            updateRobotSpeechBubble(cheerMsg);

            if (window.liveRobot) window.liveRobot.spinAndCelebrate();
        } else {
            btn.classList.add('wrong');
            playSfx('boing');
            setTimeout(() => btn.classList.remove('wrong'), 800);

            const hint = state.currentLang === 'uz'
                ? "Deyarli! Lekin dasturchilar — bu zamonaviy sehrgarlar! Yana bir bor urinib ko'ring!"
                : "Хе-хе, почти! Но на самом деле современные волшебники — это программисты! Попробуй еще раз!";
            updateRobotSpeechBubble(hint);
        }
    };

    // --------------------------------------------------------------------------
    // STEP 2: TEAM (INTERACTIVE TEACHERS GREETING)
    // --------------------------------------------------------------------------
    window.highFiveHelper = function (role, cardEl) {
        const isUz = state.currentLang === 'uz';
        let text = "";

        playSfx('pop');
        fireCelebration('step', { origin: { y: 0.6 } });

        if (cardEl) {
            cardEl.classList.add('is-waving');
            setTimeout(() => cardEl.classList.remove('is-waving'), 2600);
        }

        if (role === 'mentor') {
            text = isUz
                ? "Salom! Mentor sizga qo'l silkitmoqda va birinchi darsga tayyorlanmoqda!"
                : "Привет! Твой Ментор машет рукой и готов объяснить каждую строчку кода!";
        } else {
            text = isUz
                ? "Salom! Kurator sizga qo'l silkitmoqda va har qanday savolga javob berishga tayyor!"
                : "Привет! Твой Куратор машет рукой и на связи 24/7 для любой помощи!";
        }

        if (cardEl) {
            cardEl.style.transition = 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
            cardEl.style.transform = 'scale(1.03)';
            setTimeout(() => {
                cardEl.style.transform = '';
            }, 200);
        }
    };

    // --------------------------------------------------------------------------
    // STEP 4: BOTH GAMES (KIDS LAB ALGO QUEST & TEENS WEB STUDIO)
    // --------------------------------------------------------------------------
    window.setPracticeGame = function (game) {
        state.activePracticeGame = game;
        if (game !== 'kids') stopAlgoRun();
        const kidsBlock = document.getElementById('practice-kids-block');
        const teensBlock = document.getElementById('practice-teens-block');
        const tabKids = document.getElementById('tab-game-kids');
        const tabTeens = document.getElementById('tab-game-teens');

        const isKids = game === 'kids';
        if (kidsBlock) kidsBlock.classList.toggle('hidden', !isKids);
        if (teensBlock) teensBlock.classList.toggle('hidden', isKids);
        if (tabKids) tabKids.classList.toggle('active', isKids);
        if (tabTeens) tabTeens.classList.toggle('active', !isKids);

        if (isKids) {
            setTimeout(initAlgoGrid, 50);
        } else {
            setTimeout(() => {
                updateLiveWebPreview();
                if (typeof setWebLayerMode === 'function') {
                    setWebLayerMode(state.webLayerMode || 'all');
                }
            }, 50);
        }
        playSfx('click');
    };

    // ==========================================================================
    // GAME 1: KIDS LAB (SCRATCH & BLOCKLY QUEST WITH REPEAT LOOPS & JUMP)
    // ==========================================================================
    const ALGO_LEVELS = [
        {
            "id": 1,
            "titleRu": "Уровень 1: Первый алгоритм",
            "titleUz": "1-Bosqich: Birinchi algoritm",
            "descRu": "Собери цепочку блоков движения и приведи Стива к Алмазному Порталу!",
            "descUz": "Harakat bloklaridan zanjir tuzing va Stivni Olmosli Portalga olib boring!",
            "gridSize": 4,
            "startPos": {
                "r": 3,
                "c": 0
            },
            "goalPos": {
                "r": 0,
                "c": 3
            },
            "creepers": [
                {
                    "r": 1,
                    "c": 1
                }
            ],
            "walls": [
                {
                    "r": 2,
                    "c": 1
                },
                {
                    "r": 1,
                    "c": 2
                }
            ],
            "coins": [
                {
                    "r": 0,
                    "c": 1
                }
            ],
            "traps": [],
            "maxQueue": 8,
            "autoSolve": [
                {
                    "type": "move",
                    "dir": "UP"
                },
                {
                    "type": "move",
                    "dir": "UP"
                },
                {
                    "type": "move",
                    "dir": "UP"
                },
                {
                    "type": "move",
                    "dir": "RIGHT"
                },
                {
                    "type": "move",
                    "dir": "RIGHT"
                },
                {
                    "type": "move",
                    "dir": "RIGHT"
                }
            ]
        },
        {
            "id": 2,
            "titleRu": "Уровень 2: Повороты и циклы",
            "titleUz": "2-Bosqich: Burilishlar va sikllar",
            "descRu": "Найди путь к порталу. Прыжки и повторы доступны — пробуй разные маршруты. Бонус: 3 монеты и решение за 6 блоков.",
            "descUz": "Portalga yo‘l toping. Sakrash va takrorlash bilan turli yo‘llarni sinang. Bonus: 3 coin va 6 ta blokli yechim.",
            "gridSize": 5,
            "startPos": {
                "r": 4,
                "c": 0
            },
            "goalPos": {
                "r": 0,
                "c": 4
            },
            "walls": [
                {
                    "r": 0,
                    "c": 0
                },
                {
                    "r": 0,
                    "c": 1
                },
                {
                    "r": 0,
                    "c": 3
                },
                {
                    "r": 1,
                    "c": 3
                },
                {
                    "r": 2,
                    "c": 3
                },
                {
                    "r": 3,
                    "c": 1
                },
                {
                    "r": 4,
                    "c": 1
                }
            ],
            "creepers": [
                {
                    "r": 0,
                    "c": 2
                }
            ],
            "coins": [
                {
                    "r": 2,
                    "c": 1
                },
                {
                    "r": 4,
                    "c": 2
                },
                {
                    "r": 1,
                    "c": 4
                }
            ],
            "traps": [],
            "maxQueue": 24,
            "autoSolve": [
                {
                    "type": "loop",
                    "dir": "UP",
                    "count": 2
                },
                {
                    "type": "loop",
                    "dir": "RIGHT",
                    "count": 2
                },
                {
                    "type": "loop",
                    "dir": "DOWN",
                    "count": 2
                },
                {
                    "type": "loop",
                    "dir": "RIGHT",
                    "count": 2
                },
                {
                    "type": "loop",
                    "dir": "UP",
                    "count": 3
                },
                {
                    "type": "move",
                    "dir": "UP"
                }
            ],
            "targetBlocks": 6
        },
        {
            "id": 3,
            "titleRu": "Уровень 3: Экспедиция через лаву",
            "titleUz": "3-Bosqich: Lava ustidan ekspeditsiya",
            "descRu": "Исследуй поле 6×6: обходи или перепрыгивай Криперов, перепрыгивай лаву. Бонус: все 4 монеты и решение за 8 блоков.",
            "descUz": "6×6 maydonni o‘rganing: Kripirlarni aylanib yoki ustidan sakrab o‘ting, lavadan sakrang. Bonus: 4 coin va 8 ta blokli yechim.",
            "gridSize": 6,
            "startPos": {
                "r": 5,
                "c": 0
            },
            "goalPos": {
                "r": 0,
                "c": 5
            },
            "walls": [
                {
                    "r": 1,
                    "c": 0
                },
                {
                    "r": 1,
                    "c": 5
                },
                {
                    "r": 2,
                    "c": 0
                },
                {
                    "r": 2,
                    "c": 5
                },
                {
                    "r": 3,
                    "c": 0
                },
                {
                    "r": 3,
                    "c": 1
                },
                {
                    "r": 3,
                    "c": 5
                },
                {
                    "r": 4,
                    "c": 3
                },
                {
                    "r": 4,
                    "c": 5
                },
                {
                    "r": 5,
                    "c": 3
                },
                {
                    "r": 5,
                    "c": 4
                },
                {
                    "r": 5,
                    "c": 5
                }
            ],
            "creepers": [
                {
                    "r": 4,
                    "c": 4
                },
                {
                    "r": 2,
                    "c": 1
                },
                {
                    "r": 0,
                    "c": 0
                }
            ],
            "coins": [
                {
                    "r": 5,
                    "c": 1
                },
                {
                    "r": 3,
                    "c": 3
                },
                {
                    "r": 1,
                    "c": 2
                },
                {
                    "r": 0,
                    "c": 3
                }
            ],
            "traps": [
                {
                    "r": 4,
                    "c": 2
                },
                {
                    "r": 2,
                    "c": 4
                }
            ],
            "maxQueue": 32,
            "autoSolve": [
                {
                    "type": "loop",
                    "dir": "RIGHT",
                    "count": 2
                },
                {
                    "type": "jump",
                    "dir": "UP"
                },
                {
                    "type": "loop",
                    "dir": "RIGHT",
                    "count": 2
                },
                {
                    "type": "jump",
                    "dir": "UP"
                },
                {
                    "type": "loop",
                    "dir": "LEFT",
                    "count": 3
                },
                {
                    "type": "move",
                    "dir": "UP"
                },
                {
                    "type": "loop",
                    "dir": "RIGHT",
                    "count": 3
                },
                {
                    "type": "move",
                    "dir": "RIGHT"
                }
            ],
            "targetBlocks": 8
        }
    ];

    function getCurrentAlgoLevelData() {
        const lvlId = state.algoLevel || 1;
        return ALGO_LEVELS.find(l => l.id === lvlId) || ALGO_LEVELS[0];
    }

    window.setAlgoLevel = function (lvl) {
        if (![1, 2, 3].includes(lvl)) return;
        stopAlgoRun();
        state.algoLevel = lvl;
        state.algoQueue = [];
        state.algoTrail = []; state.algoErrCell = null;
        state.activeLoopModifier = null;
        state.activeJumpModifier = false;
        state.algoCoinsCollected = 0;
        state.algoCollectedCoinCoords = [];

        const lvlData = getCurrentAlgoLevelData();
        state.algoPos = { r: lvlData.startPos.r, c: lvlData.startPos.c };

        // Update Level Pills UI
        [1, 2, 3].forEach(id => {
            const btn = document.getElementById(`btn-lvl-${id}`);
            if (btn) btn.classList.toggle('active', id === lvl);
        });

        // Update Mission Header Text
        const titleEl = document.getElementById('algo-mission-title');
        const descEl = document.getElementById('algo-mission-desc');
        if (titleEl) {
            titleEl.textContent = state.currentLang === 'uz' ? lvlData.titleUz : lvlData.titleRu;
        }
        if (descEl) {
            descEl.textContent = state.currentLang === 'uz' ? lvlData.descUz : lvlData.descRu;
        }

        // Reset modifier buttons
        resetModifierButtons();

        // Update coin counter
        updateCoinCounter();

        playSfx('click');
        initAlgoGrid();
        renderAlgoQueue();

        const msg = document.getElementById('algo-status-msg');
        if (msg) msg.textContent = '';
    };

    function resetModifierButtons() {
        const bLoop2 = document.getElementById('btn-loop-2x');
        const bLoop3 = document.getElementById('btn-loop-3x');
        const bJump = document.getElementById('btn-jump-cmd');
        if (bLoop2) bLoop2.classList.toggle('active-modifier', state.activeLoopModifier === 2);
        if (bLoop3) bLoop3.classList.toggle('active-modifier', state.activeLoopModifier === 3);
        if (bJump) {
            bJump.classList.toggle('active-modifier', !!state.activeJumpModifier);
            bJump.disabled = false;
        }
    }

    window.toggleLoopModifier = function (count) {
        if (state.isAlgoRunning || state.isAlgoTransitioning) return;
        if (state.activeLoopModifier === count) {
            state.activeLoopModifier = null;
        } else {
            state.activeLoopModifier = count;
            state.activeJumpModifier = false;
        }
        resetModifierButtons();
        playSfx('pop');

        const status = document.getElementById('algo-status-msg');
        if (status) {
            if (state.activeLoopModifier) {
                status.textContent = state.currentLang === 'uz'
                    ? `REPEAT ${count}x faol! Endi yo'nalish strelkasini bosing.`
                    : `Цикл REPEAT ${count}x активен! Теперь нажми на стрелку направления.`;
                status.style.color = '#EA580C';
            } else {
                status.textContent = '';
            }
        }
    };

    window.toggleJumpModifier = function () {
        if (state.isAlgoRunning || state.isAlgoTransitioning) return;
        state.activeJumpModifier = !state.activeJumpModifier;
        state.activeLoopModifier = null;
        resetModifierButtons();
        playSfx('pop');

        const status = document.getElementById('algo-status-msg');
        if (status) {
            if (state.activeJumpModifier) {
                status.textContent = state.currentLang === 'uz'
                    ? "SAKRASH rejimi faol! Qaysi tomonga sakrashni tanlang."
                    : "Режим ПРЫЖОК активен! Выбери, в какую сторону прыгнуть.";
                status.style.color = '#7C3AED';
            } else {
                status.textContent = '';
            }
        }
    };

    function updateCoinCounter() {
        const counterEl = document.getElementById('algo-coin-counter');
        const lvlData = getCurrentAlgoLevelData();
        const totalCoins = lvlData.coins ? lvlData.coins.length : 0;
        if (counterEl) {
            counterEl.textContent = `${state.algoCoinsCollected} / ${totalCoins}`;
        }
    }

    function initAlgoGrid() {
        const board = document.getElementById('algo-board');
        if (!board) return;
        board.innerHTML = '';

        const lvl = getCurrentAlgoLevelData();
        const size = lvl.gridSize || 4;

        board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                if ((state.algoTrail || []).some(p => p.r === r && p.c === c)) cell.classList.add('trail-cell');
                if (state.algoErrCell && state.algoErrCell.r === r && state.algoErrCell.c === c) cell.classList.add('err-cell');

                const isPlayer = (r === state.algoPos.r && c === state.algoPos.c);
                const isGoal = (r === lvl.goalPos.r && c === lvl.goalPos.c);
                const isCreeper = lvl.creepers && lvl.creepers.some(cr => cr.r === r && cr.c === c);
                const isWall = lvl.walls && lvl.walls.some(w => w.r === r && w.c === c);
                const isTrap = lvl.traps && lvl.traps.some(t => t.r === r && t.c === c);
                const isCoin = lvl.coins && lvl.coins.some(cn => cn.r === r && cn.c === c && !state.algoCollectedCoinCoords.some(col => col.r === r && col.c === c));

                if (isGoal) {
                    cell.classList.add('goal-cell');
                    cell.innerHTML = `<img src="images/maze/portal.svg" class="grid-token-img goal-token" alt="Portal">`;
                    if (isPlayer) {
                        cell.classList.add('player-cell', 'goal-reached');
                        cell.innerHTML += `<img src="images/kids_steve_runner.webp" class="grid-token-img portal-arrival-token" alt="Steve">`;
                    }
                } else if (isPlayer) {
                    cell.classList.add('player-cell');
                    cell.innerHTML = `<img src="images/kids_steve_runner.webp" class="grid-token-img player-token" alt="Steve">`;
                } else if (isCreeper) {
                    cell.classList.add('obstacle-cell');
                    cell.innerHTML = `<img src="images/maze/creeper.svg" class="grid-token-img obstacle-token" alt="Creeper Guard">`;
                } else if (isWall) {
                    cell.classList.add('wall-cell');
                } else if (isTrap) {
                    cell.classList.add('trap-cell');
                    cell.innerHTML = `<span class="trap-label">LAVA</span>`;
                } else if (isCoin) {
                    cell.classList.add('coin-cell');
                    cell.innerHTML = `<img src="images/coin_gold.webp" class="grid-token-img coin-token" alt="Coin">`;
                } else {
                    cell.innerHTML = `<span class="cell-dot"></span>`;
                }

                board.appendChild(cell);
            }
        }
    }

    window.addAlgoCmd = function (dir) {
        if (state.isAlgoRunning || state.isAlgoTransitioning) return;
        const lvl = getCurrentAlgoLevelData();
        const maxQ = lvl.maxQueue || 8;

        if (state.algoQueue.length >= maxQ) {
            const status = document.getElementById('algo-status-msg');
            if (status) {
                status.textContent = state.currentLang === 'uz'
                    ? `Maksimal ${maxQ} ta blok qo'shish mumkin!`
                    : `Максимум ${maxQ} блоков в одной программе!`;
                status.style.color = '#F59E0B';
            }
            playSfx('error');
            return;
        }

        let cmdObj;
        if (state.activeLoopModifier) {
            cmdObj = { type: 'loop', count: state.activeLoopModifier, dir: dir };
            state.activeLoopModifier = null;
        } else if (state.activeJumpModifier) {
            cmdObj = { type: 'jump', dir: dir };
            state.activeJumpModifier = false;
        } else {
            cmdObj = { type: 'move', dir: dir };
        }

        resetModifierButtons();
        state.algoQueue.push(cmdObj);
        playSfx('step');
        renderAlgoQueue();

        const status = document.getElementById('algo-status-msg');
        if (status) status.textContent = '';
    };

    function dirName(d) {
        const uz = state.currentLang === 'uz';
        return ({ UP: uz ? 'Tepaga' : 'Вверх', DOWN: uz ? 'Pastga' : 'Вниз', LEFT: uz ? 'Chapga' : 'Влево', RIGHT: uz ? 'O‘ngga' : 'Вправо' })[d] || d;
    }

    function renderAlgoQueue() {
        const list = document.getElementById('algo-commands-list');
        const stepCount = document.getElementById('algo-step-count');
        const lvl = getCurrentAlgoLevelData();
        const maxQ = lvl.maxQueue || 8;

        if (stepCount) {
            stepCount.textContent = `${state.algoQueue.length} / ${maxQ}`;
        }

        if (!list) return;

        const tier = maxQ <= 8 ? 'l' : maxQ <= 16 ? 'm' : 's';
        const pzv = maxQ <= 8 ? 56 : maxQ <= 24 ? 38 : 36;
        const perRow = maxQ <= 8 ? 4 : maxQ <= 24 ? 8 : 0;
        const slotsOn = perRow > 0;
        const addSlots = (from) => {
            if (!slotsOn) return;
            const total = Math.min(maxQ, 16);
            for (let i = from; i < total; i++) {
                const sl = document.createElement('span');
                sl.className = 'mz-slot' + (i === state.algoQueue.length ? ' mz-slot-next' : '');
                sl.innerHTML = `<i>${i + 1}</i>`;
                list.appendChild(sl);
                if ((i + 1) % perRow === 0 && i + 1 < total) { const br = document.createElement('span'); br.className = 'mz-br'; list.appendChild(br); }
            }
        };

        if (state.algoQueue.length === 0) {
            const dropIcon = '<svg class="queue-drop-icon" viewBox="0 0 150 96" width="132" height="84" aria-hidden="true"><g fill="#cfd8ff"><path transform="translate(8 14) scale(.62)" d="M0 0H120V38a14 14 0 1 1 0 24V100H0V62a14 14 0 1 0 0-24Z"/><path transform="translate(62 20) scale(.62)" d="M0 0H120V38a14 14 0 1 1 0 24V100H0V62a14 14 0 1 0 0-24Z" fill="#dfe5ff"/></g><g class="queue-drop-cursor"><path d="M92 40v34l9-8 7 15 8-4-7-15 13-1z" fill="#fff" stroke="#3b4aa8" stroke-width="3.5" stroke-linejoin="round"/></g></svg>';
            list.style.setProperty('--pz', pzv + 'px');
            list.dataset.tiles = tier;
            list.innerHTML = `<span class="queue-empty">${dropIcon}<span class="queue-drop-text">${state.currentLang === 'uz' ? 'Dastur tuzish uchun bloklarni shu yerga sudrab keling' : 'Перетащи блоки сюда, чтобы составить программу'}</span></span>`;
            addSlots(0);
            renderAlgoQueue._n = 0;
            return;
        }

        list.innerHTML = '';
        list.style.setProperty('--pz', pzv + 'px');
        list.dataset.tiles = tier;
        state.algoQueue.forEach((cmd, idx) => {
            const blockEl = document.createElement('div');
            blockEl.className = `blockly-code-block block-dir-${cmd.dir}`;
            blockEl.title = state.currentLang === 'uz' ? "O'chirish uchun bosing" : "Нажми, чтобы удалить этот блок";
            if (idx === state.algoQueue.length - 1 && state.algoQueue.length > (renderAlgoQueue._n || 0)) blockEl.classList.add('mz-snap');

            let iconSvg = '';
            if (cmd.dir === 'UP') iconSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
            if (cmd.dir === 'DOWN') iconSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>';
            if (cmd.dir === 'LEFT') iconSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>';
            if (cmd.dir === 'RIGHT') iconSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';

            const dn = `<span class="mz-dn">${dirName(cmd.dir)}</span>`;
            const nb = `<i class="mz-n">${idx + 1}</i>`;
            if (cmd.type === 'loop') {
                blockEl.classList.add('block-type-loop');
                blockEl.innerHTML = `${nb}<strong class="mz-mod">${cmd.count}×</strong>${iconSvg}${dn}`;
            } else if (cmd.type === 'jump') {
                blockEl.classList.add('block-type-jump');
                blockEl.innerHTML = `${nb}<span class="mz-mod jump-icon-svg"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span>${iconSvg}${dn}`;
            } else {
                blockEl.innerHTML = `${nb}${iconSvg}${dn}`;
            }

            blockEl.onclick = () => {
                if (state.isAlgoRunning || state.isAlgoTransitioning) return;
                state.algoQueue.splice(idx, 1);
                playSfx('pop');
                renderAlgoQueue();
            };

            list.appendChild(blockEl);
            if (slotsOn && (idx + 1) % perRow === 0 && idx + 1 < maxQ) { const br = document.createElement('span'); br.className = 'mz-br'; list.appendChild(br); }
        });
        addSlots(state.algoQueue.length);
        renderAlgoQueue._n = state.algoQueue.length;
    }

    window.clearAlgo = function () {
        stopAlgoRun();
        const lvl = getCurrentAlgoLevelData();
        state.algoQueue = [];
        state.algoTrail = []; state.algoErrCell = null;
        state.algoPos = { r: lvl.startPos.r, c: lvl.startPos.c };
        state.activeLoopModifier = null;
        state.activeJumpModifier = false;
        state.algoCoinsCollected = 0;
        state.algoCollectedCoinCoords = [];
        resetModifierButtons();
        updateCoinCounter();
        playSfx('pop');
        renderAlgoQueue();
        initAlgoGrid();
        const msg = document.getElementById('algo-status-msg');
        if (msg) msg.textContent = '';
    };

    window.runAlgoCode = function () {
        if (state.isAlgoRunning || state.isAlgoTransitioning) return;
        const lvl = getCurrentAlgoLevelData();

        if (state.algoQueue.length === 0) {
            const status = document.getElementById('algo-status-msg');
            if (status) {
                status.textContent = state.currentLang === 'uz' ? "Avval bloklarni tanlang!" : "Сначала выбери блоки команд!";
                status.style.color = '#F59E0B';
            }
            playSfx('error');
            return;
        }

        state.isAlgoRunning = true;
        state.algoPos = { r: lvl.startPos.r, c: lvl.startPos.c };
        state.algoCoinsCollected = 0;
        state.algoCollectedCoinCoords = [];
        state.algoTrail = [{ r: lvl.startPos.r, c: lvl.startPos.c }]; state.algoErrCell = null;
        updateCoinCounter();
        initAlgoGrid();

        const blocks = document.querySelectorAll('#algo-commands-list .blockly-code-block');
        blocks.forEach(b => b.classList.remove('active-step', 'chip-success', 'chip-error'));

        const status = document.getElementById('algo-status-msg');
        if (status) {
            status.textContent = state.currentLang === 'uz' ? "Dastur bajarilmoqda..." : "Выполняем программу Стива...";
            status.style.color = '#0284C7';
        }

        // Decompress queue into discrete execution actions
        const execSequence = [];
        state.algoQueue.forEach((item, bIdx) => {
            if (item.type === 'move') {
                execSequence.push({ blockIdx: bIdx, dir: item.dir, isJump: false, subStep: 1, totalSub: 1 });
            } else if (item.type === 'loop') {
                for (let s = 1; s <= item.count; s++) {
                    execSequence.push({ blockIdx: bIdx, dir: item.dir, isJump: false, subStep: s, totalSub: item.count });
                }
            } else if (item.type === 'jump') {
                execSequence.push({ blockIdx: bIdx, dir: item.dir, isJump: true, subStep: 1, totalSub: 1 });
            }
        });

        let stepIndex = 0;
        const interval = algoRunTimer = setInterval(() => {
            if (stepIndex >= execSequence.length) {
                clearInterval(interval);
                state.isAlgoRunning = false;
                blocks.forEach(b => b.classList.remove('active-step'));
                if (state.algoPos.r !== lvl.goalPos.r || state.algoPos.c !== lvl.goalPos.c) {
                    playSfx('error');
                    if (status) {
                        status.textContent = state.currentLang === 'uz'
                            ? "Portalga yetib kelmadingiz. Qaytadan urinib ko'ring!"
                            : "Не дошел до Алмазного Портала. Попробуй еще раз!";
                        status.style.color = '#F59E0B';
                    }
                }
                return;
            }

            const curStep = execSequence[stepIndex];

            // Highlight current block in queue
            blocks.forEach((b, idx) => {
                b.classList.toggle('active-step', idx === curStep.blockIdx);
            });

            // Calculate target position
            let stepDist = curStep.isJump ? 2 : 1;
            let nextR = state.algoPos.r;
            let nextC = state.algoPos.c;

            if (curStep.dir === 'UP') nextR -= stepDist;
            if (curStep.dir === 'DOWN') nextR += stepDist;
            if (curStep.dir === 'LEFT') nextC -= stepDist;
            if (curStep.dir === 'RIGHT') nextC += stepDist;

            // 1. Boundary Wall Check
            const gridSize = lvl.gridSize || 4;
            if (nextR < 0 || nextR >= gridSize || nextC < 0 || nextC >= gridSize) {
                clearInterval(interval);
                state.isAlgoRunning = false;
                triggerBoardError(curStep.blockIdx, state.currentLang === 'uz'
                    ? "Ehtiyot bo'ling, maydon chegarasi! Devorga urildingiz."
                    : "Осторожно, граница лабиринта! Выход за пределы поля.");
                return;
            }

            // Jumps can cross lava or a creeper; stone walls cannot be crossed.
            if (curStep.isJump) {
                const midR = (state.algoPos.r + nextR) / 2;
                const midC = (state.algoPos.c + nextC) / 2;
                if ((lvl.walls || []).some(p => p.r === midR && p.c === midC)) {
                    clearInterval(interval); state.isAlgoRunning = false;
                    state.algoErrCell = { r: midR, c: midC }; initAlgoGrid();
                    triggerBoardError(curStep.blockIdx, state.currentLang === 'uz' ? 'Tosh devor ustidan sakrab bo‘lmaydi. Boshqa yo‘lni sinang.' : 'Каменную стену перепрыгнуть нельзя. Попробуй другой маршрут.');
                    return;
                }
            }

            // 2. Stone Wall Check
            const hitWall = lvl.walls && lvl.walls.some(w => w.r === nextR && w.c === nextC);
            if (hitWall) {
                clearInterval(interval);
                state.isAlgoRunning = false;
                state.algoErrCell = { r: nextR, c: nextC }; initAlgoGrid();
                triggerBoardError(curStep.blockIdx, state.currentLang === 'uz'
                    ? "Tosh devorga urildingiz! Boshqa yo'ldan yuring."
                    : "Стив упёрся в каменную стену! Выбери другой путь.");
                return;
            }

            // 3. Creeper Check
            const hitCreeper = lvl.creepers && lvl.creepers.some(cr => cr.r === nextR && cr.c === nextC);
            if (hitCreeper) {
                clearInterval(interval);
                state.isAlgoRunning = false;
                state.algoPos = { ...lvl.startPos };
                state.algoCoinsCollected = 0;
                state.algoCollectedCoinCoords = [];
                state.algoErrCell = { r: nextR, c: nextC };
                updateCoinCounter();
                initAlgoGrid();
                const enemyCell = document.querySelectorAll('#algo-board .grid-cell')[nextR * lvl.gridSize + nextC];
                enemyCell?.classList.add('creeper-contact');
                scheduleAlgoTransition(() => enemyCell?.classList.remove('creeper-contact'), 800);
                triggerBoardError(curStep.blockIdx, state.currentLang === 'uz'
                    ? 'Kripir Stivni to‘xtatdi! Stiv startga qaytdi. Dasturingiz saqlandi — yo‘lni o‘zgartirib yana urinib ko‘ring.'
                    : 'Крипер остановил Стива! Стив вернулся на старт. Программа сохранена — измени маршрут и попробуй ещё раз.');
                return;
            }

            // 4. Trap (Lava) Check (Note: if jumped, Steve sailed over it!)
            const hitTrap = lvl.traps && lvl.traps.some(t => t.r === nextR && t.c === nextC);
            if (hitTrap) {
                clearInterval(interval);
                state.isAlgoRunning = false;
                state.algoErrCell = { r: nextR, c: nextC }; initAlgoGrid();
                triggerBoardError(curStep.blockIdx, state.currentLang === 'uz'
                    ? "Lava qopqoniga tushdingiz! Bu yerda JUMP (Sakrash) kerak."
                    : "Стив попал в лаву! Здесь нужно использовать ПРЫЖОК (JUMP).");
                return;
            }

            // Valid Step
            state.algoPos.r = nextR;
            state.algoPos.c = nextC;
            (state.algoTrail = state.algoTrail || []).push({ r: nextR, c: nextC });
            playSfx('step');

            // Coin Pickup Check
            if (lvl.coins) {
                const coinFound = lvl.coins.find(cn => cn.r === nextR && cn.c === nextC && !state.algoCollectedCoinCoords.some(c => c.r === nextR && c.c === nextC));
                if (coinFound) {
                    state.algoCollectedCoinCoords.push(coinFound);
                    state.algoCoinsCollected++;
                    updateCoinCounter();
                    playSfx('chime');
                }
            }

            initAlgoGrid();

            // 5. Goal Portal Reached!
            if (state.algoPos.r === lvl.goalPos.r && state.algoPos.c === lvl.goalPos.c) {
                clearInterval(interval);
                state.isAlgoRunning = false;
                blocks.forEach(b => { b.classList.remove('active-step'); b.classList.add('chip-success'); });
                completeAlgoLevel(lvl);
                return;
            }

            stepIndex++;
        }, Number(window.JUNIOR_ALGO_STEP_MS) || 300);
    };

    window.mzPopper = function (side) {
        return '<svg class="mz-popper mz-popper-' + side + '" viewBox="0 0 64 72" width="54" height="62" aria-hidden="true"><path d="M6 66L26 20l20 22z" fill="#ff8a14" stroke="#c75b00" stroke-width="3" stroke-linejoin="round"/><path d="M14 48l14-12M10 58l22-18" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".85"/><ellipse cx="36" cy="31" rx="13" ry="6" transform="rotate(42 36 31)" fill="#ffd23f" stroke="#c75b00" stroke-width="3"/><circle cx="50" cy="10" r="3" fill="#ff4d77"/><circle cx="58" cy="26" r="3" fill="#2f9bff"/></svg>';
    };
    function fireMazeCannons(panel, grand) {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const engine = getConfettiEngine();
        if (!engine) return;
        const colors = ['#ffd23f', '#ff4d77', '#2f9bff', '#2fbf55', '#8f5cf5', '#ff8a14'];
        const shoot = (side, n) => {
            const el = panel.querySelector('.mz-pw-' + side);
            if (!panel.isConnected) return;
            const r = (el || panel).getBoundingClientRect();
            let x, y;
            if (el) { x = (side === 'l' ? r.left + r.width * 0.75 : r.left + r.width * 0.25) / window.innerWidth; y = (r.top + r.height * 0.3) / window.innerHeight; }
            else { x = (side === 'l' ? r.left + r.width * 0.06 : r.left + r.width * 0.94) / window.innerWidth; y = (r.top + r.height * 0.88) / window.innerHeight; }
            engine({ particleCount: n, angle: side === 'l' ? 62 : 118, spread: 55, startVelocity: 48, gravity: 0.9, ticks: 160, scalar: 1.05, colors, origin: { x, y } });
        };
        const burst = (fx, fy) => {
            if (!panel.isConnected) return;
            const r = panel.getBoundingClientRect();
            engine({ particleCount: 36, spread: 360, startVelocity: 22, gravity: 0.65, decay: 0.92, ticks: 90, scalar: 1.1, colors, shapes: ['star', 'circle'], origin: { x: (r.left + r.width * fx) / window.innerWidth, y: (r.top + r.height * fy) / window.innerHeight } });
        };
        const n = grand ? 70 : 46;
        shoot('l', n); shoot('r', n);
        setTimeout(() => { shoot('l', n); shoot('r', n); }, 260);
        setTimeout(() => { shoot('l', n / 2); shoot('r', n / 2); }, 560);
        if (grand) {
            setTimeout(() => burst(0.3, 0.28), 350);
            setTimeout(() => burst(0.72, 0.22), 650);
            setTimeout(() => burst(0.5, 0.18), 950);
        }
    }

    window.fireMazeCannons = fireMazeCannons;

    function completeAlgoLevel(lvl) {
        state.isAlgoTransitioning = true;
        try { document.dispatchEvent(new CustomEvent('junior:algostate', { detail: { kind: 'win', level: lvl.id } })); } catch (e) {}
        const board = document.getElementById('algo-board');
        board?.classList.add('portal-entering');
        playSfx('whoosh');
        const status = document.getElementById('algo-status-msg');
        if (status) { status.textContent = state.currentLang === 'uz' ? 'Stiv portalga kirmoqda…' : 'Стив входит в портал…'; status.style.color = '#168264'; }
        scheduleAlgoTransition(() => {
            playSfx('fanfare');
            const dict = translations[state.currentLang];
            if (status) status.textContent = dict.maze_level_complete;
            const panel = document.createElement('section');
            panel.id = 'maze-success-panel';
            panel.className = 'maze-success-panel mz-win';
            panel.setAttribute('role', 'status');
            panel.setAttribute('aria-live', 'polite');
            const next = lvl.id < 3;
            const coinSummary = `${state.algoCoinsCollected} / ${(lvl.coins || []).length}`;
            panel.innerHTML = `<span class="mz-popper-wrap mz-pw-l"><svg class="mz-popper mz-popper-l" viewBox="0 0 64 72" width="54" height="62" aria-hidden="true"><path d="M6 66L26 20l20 22z" fill="#ff8a14" stroke="#c75b00" stroke-width="3" stroke-linejoin="round"/><path d="M14 48l14-12M10 58l22-18" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".85"/><ellipse cx="36" cy="31" rx="13" ry="6" transform="rotate(42 36 31)" fill="#ffd23f" stroke="#c75b00" stroke-width="3"/><g fill="#ff4d77"><circle cx="50" cy="10" r="3"/></g><g fill="#2f9bff"><circle cx="58" cy="26" r="3"/></g></svg></span><span class="mz-popper-wrap mz-pw-r"><svg class="mz-popper mz-popper-r" viewBox="0 0 64 72" width="54" height="62" aria-hidden="true"><path d="M6 66L26 20l20 22z" fill="#ff8a14" stroke="#c75b00" stroke-width="3" stroke-linejoin="round"/><path d="M14 48l14-12M10 58l22-18" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".85"/><ellipse cx="36" cy="31" rx="13" ry="6" transform="rotate(42 36 31)" fill="#ffd23f" stroke="#c75b00" stroke-width="3"/><g fill="#ff4d77"><circle cx="50" cy="10" r="3"/></g><g fill="#2f9bff"><circle cx="58" cy="26" r="3"/></g></svg></span><div class="mz-win-stars" aria-hidden="true"><span style="--i:0"><svg viewBox="0 0 48 48" width="56" height="56"><path d="M24 3l6.2 13.4 14.6 1.7-10.8 10 2.9 14.4L24 35.2 11.1 42.5 14 28.1 3.2 18.1l14.6-1.7z" fill="#ffd23f" stroke="#f29b00" stroke-width="3" stroke-linejoin="round"/><path d="M24 9l4.3 9.5" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></svg></span><span style="--i:1"><svg viewBox="0 0 48 48" width="56" height="56"><path d="M24 3l6.2 13.4 14.6 1.7-10.8 10 2.9 14.4L24 35.2 11.1 42.5 14 28.1 3.2 18.1l14.6-1.7z" fill="#ffd23f" stroke="#f29b00" stroke-width="3" stroke-linejoin="round"/><path d="M24 9l4.3 9.5" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></svg></span><span style="--i:2"><svg viewBox="0 0 48 48" width="56" height="56"><path d="M24 3l6.2 13.4 14.6 1.7-10.8 10 2.9 14.4L24 35.2 11.1 42.5 14 28.1 3.2 18.1l14.6-1.7z" fill="#ffd23f" stroke="#f29b00" stroke-width="3" stroke-linejoin="round"/><path d="M24 9l4.3 9.5" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></svg></span></div><h3 data-i18n="maze_win_title">${dict.maze_win_title}</h3><p data-i18n="${next ? 'maze_win_next' : 'maze_win_final'}">${next ? dict.maze_win_next : dict.maze_win_final}</p><div class="mz-win-coins"><span data-i18n="maze_coins">${dict.maze_coins}</span> <b>${coinSummary}</b></div><div class="maze-success-actions">${next ? `<button type="button" onclick="advanceAlgoLevel()" data-i18n="maze_continue">${dict.maze_continue}</button>` : `<button type="button" onclick="setPracticeGame('teens')" data-i18n="maze_to_studio">${dict.maze_to_studio}</button>`}<button type="button" class="maze-retry" onclick="clearAlgo()" data-i18n="maze_try_again">${dict.maze_try_again}</button></div>${next ? '<div class="maze-next-progress" aria-hidden="true"><span></span></div>' : ''}`;
            (document.body || document.querySelector('.algo-board-wrapper'))?.appendChild(panel);
            const guard = setInterval(() => {
                const bd = document.getElementById('algo-board');
                if (!panel.isConnected) clearInterval(guard);
                else if (!bd || !bd.offsetParent) { clearInterval(guard); panel.remove(); }
            }, 300);
            fireMazeCannons(panel, !next);
            if (next) scheduleAlgoTransition(() => window.advanceAlgoLevel(), 4000);
        }, 850);
    }

    window.advanceAlgoLevel = function () {
        if (!state.isAlgoTransitioning || state.algoLevel >= 3) return;
        const next = state.algoLevel + 1;
        algoTransitionTimers.forEach(timer => clearTimeout(timer));
        algoTransitionTimers.clear();
        document.getElementById('maze-success-panel')?.classList.add('maze-success-leaving');
        document.getElementById('algo-board')?.classList.add('maze-board-leaving');
        scheduleAlgoTransition(() => {
            window.setAlgoLevel(next);
            const board = document.getElementById('algo-board');
            board?.classList.add('maze-board-arriving');
            scheduleAlgoTransition(() => board?.classList.remove('maze-board-arriving'), 400);
        }, 300);
    };

    function triggerBoardError(blockIdx, msgText) {
        const board = document.getElementById('algo-board');
        if (board) {
            board.classList.add('shake-error');
            setTimeout(() => board.classList.remove('shake-error'), 500);
        }
        const blocks = document.querySelectorAll('#algo-commands-list .blockly-code-block');
        if (blocks[blockIdx]) {
            blocks[blockIdx].classList.remove('active-step');
            blocks[blockIdx].classList.add('chip-error');
        }
        playSfx('error');
        const status = document.getElementById('algo-status-msg');
        if (status) {
            status.textContent = msgText;
            status.style.color = '#EF4444';
        }
        updateRobotSpeechBubble(msgText);
        try { document.dispatchEvent(new CustomEvent('junior:algostate', { detail: { kind: 'error', level: state.algoLevel } })); } catch (e) {}
    }

    window.autoSolveAlgoAndNext = function () {
        if (state.isAlgoRunning || state.isAlgoTransitioning) return;
        const lvl = getCurrentAlgoLevelData();
        state.algoQueue = JSON.parse(JSON.stringify(lvl.autoSolve || []));
        state.algoPos = { r: lvl.startPos.r, c: lvl.startPos.c };
        state.algoCoinsCollected = 0;
        state.algoCollectedCoinCoords = [];
        resetModifierButtons();
        updateCoinCounter();
        renderAlgoQueue();
        runAlgoCode();
    };


    // --- GAME 2: TEENS WEB DEV STUDIO (REAL ILLUSTRATIONS & ZERO EMOJIS) ---
    const heroesState = {
        1: { name: 'Steve', lvl: 12, xp: 75 },
        2: { name: 'Robloxian', lvl: 15, xp: 85 },
        3: { name: 'Ender', lvl: 20, xp: 90 }
    };
    let activeHeroId = 1;

    window.selectPixelHero = function (id) {
        activeHeroId = id;
        playSfx('pop');
        [1, 2, 3].forEach(hid => {
            const card = document.getElementById(`hero-card-${hid}`);
            const tag = document.getElementById(`hero-tag-${hid}`);
            if (card) card.classList.toggle('active', hid === id);
            if (tag) tag.style.display = (hid === id) ? 'block' : 'none';
        });
        fireCelebration('micro', { origin: { y: 0.6 } });
    };

    window.lvlUpHero = function (event, id) {
        if (event) event.stopPropagation();
        const hero = heroesState[id];
        if (!hero) return;

        hero.lvl += 1;
        hero.xp = Math.floor(Math.random() * 35) + 20;

        playSfx('fanfare');

        const lvlBadge = document.getElementById(`hero-lvl-${id}`);
        const xpBar = document.getElementById(`hero-xp-${id}`);
        const xpText = document.getElementById(`hero-xp-text-${id}`);
        const card = document.getElementById(`hero-card-${id}`);

        if (lvlBadge) {
            lvlBadge.textContent = `LVL ${hero.lvl}`;
            lvlBadge.classList.add('lvl-bounce');
            setTimeout(() => lvlBadge.classList.remove('lvl-bounce'), 400);
        }
        if (xpBar) xpBar.style.width = `${hero.xp}%`;
        if (xpText) xpText.textContent = `${hero.xp}/100 XP`;
        if (card) {
            card.classList.add('card-lvl-glow');
            setTimeout(() => card.classList.remove('card-lvl-glow'), 600);
        }

        fireCelebration('step', { origin: { y: 0.55 } });

        const heroName = id === 1 ? (state.currentLang === 'uz' ? 'Stiv' : 'Стив')
                       : (id === 2 ? 'Robloxian' : 'Ender Master');
        const cheer = state.currentLang === 'uz'
            ? `${heroName} ${hero.lvl}-darajaga ko'tarildi!`
            : `${heroName} прокачан до LVL ${hero.lvl}!`;
        updateRobotSpeechBubble(cheer);
    };

    function setWebLayerMode(mode) {
        state.webLayerMode = mode;
        playSfx('click');

        // Update pills
        ['html', 'css', 'js', 'all'].forEach(m => {
            const pill = document.getElementById(`pill-mode-${m}`);
            if (pill) pill.classList.toggle('active', m === mode);
        });

        // Update code tabs
        const tabHtml = document.querySelector('.code-pill-tab.html-tab');
        const tabCss = document.querySelector('.code-pill-tab.css-tab');
        const tabJs = document.querySelector('.code-pill-tab.js-tab');
        if (tabHtml) tabHtml.style.opacity = (mode === 'html' || mode === 'all') ? '1' : '0.4';
        if (tabCss) tabCss.style.opacity = (mode === 'css' || mode === 'all') ? '1' : '0.4';
        if (tabJs) tabJs.style.opacity = (mode === 'js' || mode === 'all') ? '1' : '0.4';

        // Update code card highlights
        const cardHtml = document.getElementById('layer-card-html');
        const cardCss = document.getElementById('layer-card-css');
        const cardJs = document.getElementById('layer-card-js');
        if (cardHtml) cardHtml.style.borderColor = (mode === 'html' || mode === 'all') ? '#EA580C' : '#E2E8F0';
        if (cardCss) cardCss.style.borderColor = (mode === 'css' || mode === 'all') ? '#0284C7' : '#E2E8F0';
        if (cardJs) cardJs.style.borderColor = (mode === 'js' || mode === 'all') ? '#7C3AED' : '#E2E8F0';

        // Update browser content area
        const simBody = document.getElementById('web-sim-body');
        const modeTag = document.getElementById('browser-mode-tag');
        const notice = document.getElementById('browser-layer-notice');
        const noticeText = document.getElementById('browser-layer-notice-text');
        const actionBtn = document.getElementById('live-main-action-btn');

        if (simBody) {
            simBody.classList.remove('mode-html-only', 'mode-html-css', 'mode-all');
            if (mode === 'html') {
                simBody.classList.add('mode-html-only');
            } else if (mode === 'css') {
                simBody.classList.add('mode-html-css');
            } else {
                simBody.classList.add('mode-all');
            }
        }

        const isUz = state.currentLang === 'uz';
        const modeTexts = {
            html: isUz ? "Rejim: Faqat xom HTML skleti" : "Режим: Только скелет HTML",
            css: isUz ? "Rejim: HTML + CSS kiyimi" : "Режим: HTML + Одежда CSS",
            js: isUz ? "Rejim: JavaScript jonlanishi" : "Режим: Оживление через JS",
            all: isUz ? "Rejim: 100% Jonli sayt (HTML+CSS+JS)" : "Режим: 100% Живой сайт (HTML+CSS+JS)"
        };

        const noticeTexts = {
            html: isUz ? "1-qatlam: Faqat HTML skleti (uslublarsiz qoralama ko'rinishi)!" : "Слой 1: Только скелет HTML (без стилей и дизайна — черновик)!",
            css: isUz ? "2-qatlam: CSS kiyimi qo'shildi — neonnur, 3D-banner va ranglar!" : "Слой 2: Добавлена одежда CSS — неоновые цвета, 3D-баннер и стиль!",
            js: isUz ? "3-qatlam: JavaScript ulandi — tugmani bosib mushakbozlikni ot!" : "Слой 3: JavaScript подключен — кликни на кнопку, чтобы запустить салют!",
            all: isUz ? "Barcha 3 qatlam faol: Sayt to'liq jonlandi!" : "Все 3 слоя активны: Полноценный живой сайт!"
        };

        if (modeTag) modeTag.textContent = modeTexts[mode] || modeTexts.all;

        if (notice && noticeText) {
            noticeText.textContent = noticeTexts[mode] || noticeTexts.all;
            notice.style.display = 'block';
            if (mode === 'all') {
                setTimeout(() => { if (state.webLayerMode === 'all') notice.style.display = 'none'; }, 2500);
            }
        }

        if (actionBtn) {
            actionBtn.classList.toggle('pulse-interactive', mode === 'js' || mode === 'all');
        }
    }
    window.setWebLayerMode = setWebLayerMode;

    function updateLiveWebPreview() {
        const subtitle = document.getElementById('custom-subtitle-input');
        const liveSubtitle = document.getElementById('live-subtitle');
        if (subtitle && liveSubtitle) liveSubtitle.textContent = subtitle.value.trim();
        const input = document.getElementById('custom-team-input');
        const badge = document.getElementById('live-team-name-badge');
        const bannerTitle = document.getElementById('live-banner-text');
        if (input) {
            const val = ((input.value || '').trim()) || (state.currentLang === 'uz' ? 'ROBLOX & MINECRAFT CHEMPIONATI 2026' : 'ЧЕМПИОНАТ ROBLOX & MINECRAFT 2026');
            if (badge) badge.textContent = val.toUpperCase();
            if (bannerTitle) bannerTitle.textContent = val.toUpperCase();
        }

        const btnInput = document.getElementById('custom-btn-input');
        const btnText = document.getElementById('live-ticket-btn-text');
        if (btnInput && btnText) {
            const btnVal = ((btnInput.value || '').trim()) || (state.currentLang === 'uz' ? "Turnir va mushakbozlikni boshlash!" : "Запустить турнир и салют!");
            btnText.textContent = btnVal;
        }
    }
    window.updateLiveWebPreview = updateLiveWebPreview;
    window.updateWebDesign = function () {
        const radius = Math.max(0, Math.min(28, Number(document.getElementById('web-radius-input')?.value) || 0));
        document.getElementById('web-sim-body')?.style.setProperty('--web-radius', `${radius}px`);
        const out = document.getElementById('web-radius-value');
        if (out) out.textContent = `${radius}px`;
    };
    window.applyWebIdea = function (idea) {
        const uz = state.currentLang === 'uz';
        const presets = {
            space: uz ? ['KOSMIK KLUB','Yangi sayyoralarni birga kashf etamiz!','Parvozni boshlash!','purple'] : ['КОСМИЧЕСКИЙ КЛУБ','Открываем новые планеты вместе!','Поехали к звёздам!','purple'],
            robot: uz ? ['ROBOTLAR LIGASI','Kelajakni o‘z qo‘limiz bilan yaratamiz','Robotlarni ishga tushirish!','green'] : ['ЛИГА РОБОТОВ','Создаём будущее своими руками','Запустить роботов!','green'],
            tournament: uz ? ['O‘YIN CHEMPIONATI','Jamoangni yig‘ va g‘alabaga intil!','Turnirni boshlash!','orange'] : ['ИГРОВОЙ ЧЕМПИОНАТ','Собери команду и двигайся к победе!','Начать турнир!','orange']
        };
        const p = presets[idea]; if (!p) return;
        document.getElementById('custom-team-input').value = p[0];
        document.getElementById('custom-subtitle-input').value = p[1];
        document.getElementById('custom-btn-input').value = p[2];
        updateLiveWebPreview(); setWebCodeTheme(p[3]);
    };


    function setWebCodeTheme(theme, hex) {
        state.webTheme = theme;
        playSfx('click');

        document.querySelectorAll('.code-color-chip').forEach(b => {
            b.classList.toggle('active', b.dataset.theme === theme);
        });

        const hexMap = {
            cyan: '#00E5FF',
            green: '#10B981',
            orange: '#FF6B00',
            red: '#EF4444',
            purple: '#A855F7',
            gold: '#FBBF24',
            blue: '#00E5FF'
        };

        const activeHex = hex || hexMap[theme] || '#00E5FF';
        const hexDisp = document.getElementById('code-btn-hex-disp');
        if (hexDisp) hexDisp.textContent = activeHex;

        const browserContent = document.getElementById('web-sim-body');
        if (browserContent) {
            browserContent.classList.remove('theme-blue', 'theme-cyan', 'theme-green', 'theme-orange', 'theme-red', 'theme-purple', 'theme-gold');
            browserContent.classList.add(`theme-${theme}`);
            const palette = {
                cyan:['#e8f5f8','#f5fbfc','#095d73'], green:['#e9f5ed','#f7fbf8','#125c42'],
                orange:['#fceede','#fffbf6','#8b3516'], purple:['#f0eafa','#fbf9fe','#542987'],
                gold:['#faf3dc','#fffdf7','#79600c'], red:['#faeaea','#fffafa','#8b2525']
            }[theme] || ['#d5f8ff','#effcff','#095d73'];
            browserContent.style.setProperty('--web-accent', activeHex);
            browserContent.style.setProperty('--web-surface', palette[0]);
            browserContent.style.setProperty('--web-soft', palette[1]);
            browserContent.style.setProperty('--web-deep', palette[2]);
            browserContent.style.setProperty('--web-button-ink', ['gold','cyan','blue'].includes(theme) ? '#16323d' : '#ffffff');
        }

        const liveBtn = document.getElementById('live-main-action-btn');
        if (liveBtn && (!browserContent || !browserContent.classList.contains('mode-html-only'))) {
            liveBtn.style.background = activeHex;
            liveBtn.style.boxShadow = `0 4px 0 rgba(0,0,0,0.2), 0 0 16px ${activeHex}66`;
        }

        highlightLiveBlock('elem-btn', true);
        setTimeout(() => highlightLiveBlock('elem-btn', false), 600);
    }
    window.setWebCodeTheme = setWebCodeTheme;

    window.setWebTheme = function (theme) {
        setWebCodeTheme(theme);
    };

    window.setQuickTeam = function (name) {
        const input = document.getElementById('custom-team-input');
        if (input) {
            input.value = name;
            updateLiveWebPreview();
            playSfx('pop');
            fireCelebration('step');
            highlightLiveBlock('elem-banner', true);
            setTimeout(() => highlightLiveBlock('elem-banner', false), 800);
        }
    };

    window.highlightLiveBlock = function (elemId, active) {
        const elem = document.getElementById(elemId);
        if (elem) {
            elem.classList.toggle('code-inspect-pulse', active);
        }
    };

    window.triggerTicketClick = function () {
        if (state.webLayerMode === 'html' || state.webLayerMode === 'css') {
            playSfx('click');
            const isUz = state.currentLang === 'uz';
            const msg = isUz
                ? "JavaScript hali ulanmagan. Mushakbozlik uchun 3-qatlam (JS)ni yoqing!"
                : "JavaScript пока не подключён. Включи Слой 3 (JS), чтобы запустить салют!";
            updateRobotSpeechBubble(msg);
            const notice = document.getElementById('browser-layer-notice');
            const noticeText = document.getElementById('browser-layer-notice-text');
            if (notice && noticeText) {
                noticeText.textContent = msg;
                notice.style.display = 'block';
            }
            return;
        }

        playSfx('fanfare');
        playSfx('triumph');
        fireCelebration('grand');

        // Level up all 3 heroes
        [1, 2, 3].forEach(id => {
            const lvlEl = document.getElementById(`hero-lvl-${id}`);
            const xpBar = document.getElementById(`hero-xp-${id}`);
            const xpText = document.getElementById(`hero-xp-text-${id}`);
            const card = document.getElementById(`hero-card-${id}`);

            if (lvlEl) {
                let curLvl = parseInt(lvlEl.textContent.replace(/\D/g, ''), 10) || 10;
                const step = Math.max(1, Math.min(5, Number(document.getElementById('web-level-step')?.value) || 1));
                curLvl += step;
                lvlEl.textContent = `LVL ${curLvl}`;
                lvlEl.classList.add('lvl-bounce');
                setTimeout(() => lvlEl.classList.remove('lvl-bounce'), 400);
            }
            if (xpBar) xpBar.style.width = '100%';
            if (xpText) xpText.textContent = '100/100 XP';
            if (card) {
                card.classList.add('code-inspect-pulse');
                setTimeout(() => card.classList.remove('code-inspect-pulse'), 600);
            }
        });

        // Show celebration card in browser
        const victoryCard = document.getElementById('live-victory-card');
        if (victoryCard) {
            victoryCard.style.display = 'block';
        }

        const isUz = state.currentLang === 'uz';
        const cheerMsg = isUz
            ? "Ajoyib! Sayt JavaScript orqali jonlandi! Barcha qahramonlar kuchaytirildi, mushakbozlik otildi!"
            : "Отлично! Сайт ожил через JavaScript! Салют взлетел, герои прокачаны!";
        updateRobotSpeechBubble(cheerMsg);

        if (window.liveRobot && typeof window.liveRobot.spinAndCelebrate === 'function') {
            window.liveRobot.spinAndCelebrate();
        }
    };

    // --------------------------------------------------------------------------
    // STEP 4: FULL LMS DASHBOARD INTERACTION (CAROUSEL, DEMOS & DAILY TASKS)
    // --------------------------------------------------------------------------
    let courseScrollOffset = 0;
    window.slideCourses = function (dir) {
        const track = document.getElementById('courses-cards-track');
        if (!track) return;
        playSfx('click');

        courseScrollOffset += dir * 180;
        if (courseScrollOffset < 0) courseScrollOffset = 0;
        if (courseScrollOffset > 240) courseScrollOffset = 240;

        track.style.transform = `translateX(-${courseScrollOffset}px)`;
        track.style.transition = 'transform 0.3s ease';
    };

    window.previewCourseDemo = function (courseName) {
        playSfx('fanfare');
        fireCelebration('triumph');

        const isUz = state.currentLang === 'uz';
        const msg = isUz
            ? `«${courseName}» kursi tanlandi! Bu kursda o'quvchilar o'zlarining ilk dasturlarini yaratishadi!`
            : `Курс «${courseName}» выбран! На этом курсе ученики создают свои первые крутые проекты!`;

        updateRobotSpeechBubble(msg);
        if (window.liveRobot) window.liveRobot.triggerHappy();
    };

    window.toggleDailyTask = function (taskNum, rowEl) {
        const isCompleted = rowEl.classList.contains('completed');
        if (isCompleted) {
            rowEl.classList.remove('completed');
            state.completedTasks = Math.max(0, state.completedTasks - 1);
            playSfx('unselect');
        } else {
            rowEl.classList.add('completed');
            state.completedTasks++;
            playSfx('coin');
            fireCelebration('step');
        }

        const countDisplay = document.getElementById('tasks-count-display');
        if (countDisplay) {
            countDisplay.textContent = `${state.completedTasks}/12`;
        }

        const quote = state.currentLang === 'uz'
            ? `Kunlik vazifa bajarildi! +30 coin mukofoti sari yana bir qadam tashlandi!`
            : `Ежедневное задание выполнено! Еще один шаг к награде +30 Coins!`;

        updateRobotSpeechBubble(quote);
    };

    window.triggerMentorChatDemo = function () {
        playSfx('star');
        fireCelebration('micro');

        const isUz = state.currentLang === 'uz';
        const quote = isUz
            ? "Assalomu alaykum! Men sizning shaxsiy Mentoringizman. «Savol-Javob» guruhiga darslar bo'yicha har qanday savolingizni yozing — 5 daqiqa ichida to'liq javob beramiz!"
            : "Здравствуйте! Я твой личный Ментор. Пишите любые вопросы по урокам в группу «Вопрос-Ответ» — мы отвечаем в течение 5 минут!";

        updateRobotSpeechBubble(quote);
        if (window.liveRobot) window.liveRobot.waveHand();
    };

    window.triggerWebinarDemo = function () {
        playSfx('fanfare');
        fireCelebration('step');

        const isUz = state.currentLang === 'uz';
        const quote = isUz
            ? "«Vebinarlar» guruhida haftasiga 3 ta jonli dars bo'ladi: IT & dasturlash, IT English va ekspertlardan Master-klasslar!"
            : "В группе «Вебинары» проходят 3 живых занятия в неделю: по IT и программированию, IT English и практические мастер-классы!";

        updateRobotSpeechBubble(quote);
        if (window.liveRobot) window.liveRobot.triggerHappy();
    };

    // --------------------------------------------------------------------------
    // STEP 5: COINSHOP (Pick Gift Goal - Multi-Select Supported)
    // --------------------------------------------------------------------------
    window.pickGift = function (cardEl, nameUz, nameRu) {
        cardEl.classList.toggle('selected');

        let selectedCards = Array.from(document.querySelectorAll('.gift-shop-item.selected'));
        if (selectedCards.length === 0) {
            // Keep at least the clicked one selected
            cardEl.classList.add('selected');
            selectedCards = [cardEl];
        }

        // Update button labels on all gift cards
        const isUz = state.currentLang === 'uz';
        document.querySelectorAll('.gift-shop-item').forEach(item => {
            const btn = item.querySelector('.gift-select-btn');
            const isSel = item.classList.contains('selected');
            if (btn) {
                btn.textContent = isSel ? (isUz ? '✓ Tanlandi' : '✓ Выбрано') : (isUz ? 'Tanlash' : 'Выбрать');
            }
        });

        // Collect names of all selected gifts
        const chosenNames = [];
        selectedCards.forEach(c => {
            const titleEl = c.querySelector('span[data-i18n]');
            if (titleEl) {
                chosenNames.push(titleEl.textContent.trim());
            }
        });

        const displayNames = chosenNames.join(', ');
        state.selectedGift = displayNames;

        const chosenBanner = document.getElementById('chosen-gift-banner');
        const chosenName = document.getElementById('chosen-gift-name');
        const finalTarget = document.getElementById('final-target-gift-name');

        if (chosenBanner) chosenBanner.classList.remove('hidden');
        if (chosenName) chosenName.textContent = displayNames;
        if (finalTarget) finalTarget.textContent = displayNames;

        playSfx('coin');
    };

    // --------------------------------------------------------------------------
    // COINSHOP ONLINE STORE MODAL
    // --------------------------------------------------------------------------
    window.openCoinShopModal = function () {
        if (typeof playSfx === 'function') playSfx('coin');
        const modal = document.getElementById('coinshop-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeCoinShopModal = function (e) {
        if (e && e.target && !e.target.classList.contains('coinshop-modal-overlay') && !e.target.closest('.coinshop-modal-close') && !e.target.closest('.coinshop-save-btn')) {
            return;
        }
        if (typeof playSfx === 'function') playSfx('click');
        const modal = document.getElementById('coinshop-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // --------------------------------------------------------------------------
    // LMS TAB SWITCHING: KURSLAR <-> SERTIFIKATLAR <-> PROFIL
    // --------------------------------------------------------------------------
    window.switchLmsTab = function (tabName) {
        if (typeof playSfx === 'function') playSfx('click');
        const coursesView = document.getElementById('lms-view-courses');
        const certsView = document.getElementById('lms-view-certs');
        const profileView = document.getElementById('lms-view-profile');
        const navCourses = document.getElementById('lms-nav-courses');
        const navCerts = document.getElementById('lms-nav-certs');
        const navProfile = document.getElementById('lms-nav-profile');

        if (tabName === 'certs') {
            if (coursesView) coursesView.classList.add('hidden');
            if (certsView) certsView.classList.remove('hidden');
            if (profileView) profileView.classList.add('hidden');
            if (navCourses) navCourses.classList.remove('active');
            if (navCerts) navCerts.classList.add('active');
            if (navProfile) navProfile.classList.remove('active');
        } else if (tabName === 'profile') {
            if (coursesView) coursesView.classList.add('hidden');
            if (certsView) certsView.classList.add('hidden');
            if (profileView) profileView.classList.remove('hidden');
            if (navCourses) navCourses.classList.remove('active');
            if (navCerts) navCerts.classList.remove('active');
            if (navProfile) navProfile.classList.add('active');
        } else {
            if (coursesView) coursesView.classList.remove('hidden');
            if (certsView) certsView.classList.add('hidden');
            if (profileView) profileView.classList.add('hidden');
            if (navCourses) navCourses.classList.add('active');
            if (navCerts) navCerts.classList.remove('active');
            if (navProfile) navProfile.classList.remove('active');
        }
    };

    // --------------------------------------------------------------------------
    // PROFILE ACTIONS: REFERRAL COPY, LOGOUT, LEADERBOARD TABS
    // --------------------------------------------------------------------------
    window.copyReferralLink = function () {
        if (typeof playSfx === 'function') playSfx('coin');
        const referralUrl = 'https://go.junior-it.uz/ref/10048';
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(referralUrl).catch(() => {});
        }
        const toast = document.getElementById('profile-copy-toast');
        if (toast) {
            toast.classList.add('active');
            clearTimeout(window._refCopyTimeout);
            window._refCopyTimeout = setTimeout(() => {
                toast.classList.remove('active');
            }, 2500);
        }
    };

    window.handleLmsLogout = function () {
        if (typeof playSfx === 'function') playSfx('click');
        // Return back to courses view smoothly
        window.switchLmsTab('courses');
    };

    window.setLeaderboardTab = function (tabType, el) {
        if (typeof playSfx === 'function') playSfx('click');
        const tabs = document.querySelectorAll('.leaderboard-filter-tabs .lb-tab');
        tabs.forEach(t => t.classList.remove('active'));
        if (el) el.classList.add('active');
    };

    // --------------------------------------------------------------------------
    // COURSE FILTER FOR CERTIFICATES
    // --------------------------------------------------------------------------
    window.filterCertsByCourse = function (courseType, el) {
        if (typeof playSfx === 'function') playSfx('click');
        document.querySelectorAll('.cert-course-pill').forEach(pill => pill.classList.remove('active'));
        if (el) el.classList.add('active');

        const allCerts = document.querySelectorAll('.cert-module-card');
        allCerts.forEach(card => {
            if (courseType === 'web') {
                card.style.display = '';
            } else if (courseType === 'prog') {
                const title = card.querySelector('.cert-title-text')?.textContent?.toLowerCase() || '';
                card.style.display = (title === 'scratch' || title === 'javascript') ? '' : 'none';
            } else if (courseType === 'design') {
                const title = card.querySelector('.cert-title-text')?.textContent?.toLowerCase() || '';
                card.style.display = (title === 'wix' || title === 'css') ? '' : 'none';
            }
        });
    };

    // --------------------------------------------------------------------------
    // CERTIFICATE DETAIL MODAL
    // --------------------------------------------------------------------------
    const certDatabase = {
        html: {
            title: 'HTML',
            courseRu: 'Веб программирование',
            courseUz: 'Veb dasturlash',
            student: 'OnBoarding Mentor',
            finishDate: '15.07.2026',
            issueDate: '18.08.2026',
            number: 'JR-2026-M86-S3371-6FCE32',
            img: './images/cert_preview_html.webp'
        },
        css: {
            title: 'CSS',
            courseRu: 'Веб программирование',
            courseUz: 'Veb dasturlash',
            student: 'OnBoarding Mentor',
            finishDate: '09.07.2026',
            issueDate: '18.08.2026',
            number: 'JR-2026-M86-S3372-7ADE41',
            img: './images/cert_preview_html.webp'
        },
        bootstrap: {
            title: 'Bootstrap',
            courseRu: 'Веб программирование',
            courseUz: 'Veb dasturlash',
            student: 'OnBoarding Mentor',
            finishDate: '18.08.2026',
            issueDate: '20.08.2026',
            number: 'JR-2026-M86-S3373-8BFE52',
            img: './images/cert_preview_html.webp'
        },
        wix: {
            title: 'WiX',
            courseRu: 'Веб программирование',
            courseUz: 'Veb dasturlash',
            student: 'OnBoarding Mentor',
            finishDate: '18.08.2026',
            issueDate: '22.08.2026',
            number: 'JR-2026-M86-S3374-9CCE63',
            img: './images/cert_preview_html.webp'
        },
        scratch: {
            title: 'Scratch',
            courseRu: 'Курс программирования',
            courseUz: 'Dasturlash kursi',
            student: 'OnBoarding Mentor',
            finishDate: '06.05.2026',
            issueDate: '10.05.2026',
            number: 'JR-2026-M86-S3375-1DDE74',
            img: './images/cert_preview_html.webp'
        },
        javascript: {
            title: 'Javascript',
            courseRu: 'Веб программирование',
            courseUz: 'Veb dasturlash',
            student: 'OnBoarding Mentor',
            finishDate: '26.03.2026',
            issueDate: '30.03.2026',
            number: 'JR-2026-M86-S3376-2EEE85',
            img: './images/cert_preview_html.webp'
        }
    };

    window.openCertModal = function (certId) {
        if (typeof playSfx === 'function') playSfx('coin');
        const data = certDatabase[certId] || certDatabase['html'];
        const modal = document.getElementById('cert-detail-modal');
        if (!modal) return;

        const isUz = (state.lang === 'uz');
        const titleEl = document.getElementById('cert-modal-title');
        const courseEl = document.getElementById('cert-modal-course');
        const studentEl = document.getElementById('cert-meta-student-val');
        const endDateEl = document.getElementById('cert-meta-end-date');
        const issueDateEl = document.getElementById('cert-meta-issue-date');
        const numberEl = document.getElementById('cert-meta-number-val');
        const imgEl = document.getElementById('cert-canvas-img');

        if (titleEl) titleEl.textContent = data.title;
        if (courseEl) courseEl.textContent = isUz ? data.courseUz : data.courseRu;
        if (studentEl) studentEl.textContent = data.student;
        if (endDateEl) endDateEl.textContent = data.finishDate;
        if (issueDateEl) issueDateEl.textContent = data.issueDate;
        if (numberEl) numberEl.textContent = data.number;
        if (imgEl) imgEl.src = data.img;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeCertModal = function (e) {
        if (e && e.target && !e.target.classList.contains('cert-modal-overlay') && !e.target.closest('.cert-modal-close')) {
            return;
        }
        if (typeof playSfx === 'function') playSfx('click');
        const modal = document.getElementById('cert-detail-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.downloadCertificate = function () {
        if (typeof playSfx === 'function') playSfx('powerup');
        if (typeof triggerCelebration === 'function') {
            triggerCelebration(2);
        } else if (typeof confetti === 'function') {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }

        const imgEl = document.getElementById('cert-canvas-img');
        const imgSrc = imgEl ? imgEl.src : './images/cert_preview_html.webp';
        const title = document.getElementById('cert-modal-title')?.textContent || 'HTML';
        const link = document.createElement('a');
        link.href = imgSrc;
        link.download = `Junior_Certificate_${title}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --------------------------------------------------------------------------
    // STEP 5: FINAL (Two Paths Choice & LMS)
    // --------------------------------------------------------------------------
    window.selectFuturePath = function (choice, silent = false) {
        const passiveCard = document.querySelector('.cinematic-scene-portal.scene-passive');
        const creatorCard = document.querySelector('.cinematic-scene-portal.scene-creator');
        const leftWing = document.querySelector('.bridge-wing.wing-left');
        const rightWing = document.querySelector('.bridge-wing.wing-right');

        if (choice === 'creator') {
            if (creatorCard) creatorCard.classList.add('choice-active');
            if (passiveCard) passiveCard.classList.remove('choice-active');
            if (rightWing) rightWing.classList.add('active');
            if (leftWing) leftWing.classList.remove('active');
            if (!silent && typeof playSfx === 'function') playSfx('click');
        } else if (choice === 'passive') {
            if (passiveCard) passiveCard.classList.add('choice-active');
            if (creatorCard) creatorCard.classList.remove('choice-active');
            if (leftWing) leftWing.classList.add('active');
            if (rightWing) rightWing.classList.remove('active');
            if (!silent && typeof playSfx === 'function') playSfx('click');
        }
    };

    window.finishLesson = function () {
        playSfx('fanfare');
        goToSlide(7);
        fireCelebration('triumph', { origin: { y: 0.6 } });
    };

    window.teleportToLMS = function () {
        playSfx('fanfare');
        fireCelebration('grand');

        const modal = document.getElementById('launch-modal');
        if (modal) modal.classList.add('active');

        let countdown = 3;
        const descEl = document.getElementById('modal-desc');
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                if (descEl) {
                    descEl.innerText = state.currentLang === 'ru'
                        ? `Переход на обучающую платформу через ${countdown} сек...`
                        : `Platformaga o'tish ${countdown} soniyada...`;
                }
            } else {
                clearInterval(interval);
                window.location.href = "https://go.junior-it.uz/login";
            }
        }, 1000);
    };

    // --------------------------------------------------------------------------
    // LANGUAGE SWITCHER
    // --------------------------------------------------------------------------
    function setLanguage(lang) {
        state.currentLang = lang;
        document.documentElement.lang = lang;
        if (typeof window.updateAnatomyHUD === 'function') window.updateAnatomyHUD();
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

        const dict = translations[lang] || translations.ru;
        if (dict.page_title) {
            document.title = dict.page_title;
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n');
            if (dict[k]) el.innerHTML = dict[k];
        });

        const kidsSub = document.getElementById('age-kids-sub-text');
        const teensSub = document.getElementById('age-teens-sub-text');
        if (kidsSub && dict.age_kids_sub) kidsSub.textContent = dict.age_kids_sub;
        if (teensSub && dict.age_teens_sub) teensSub.textContent = dict.age_teens_sub;

        const isUz = lang === 'uz';
        const tagEl = document.getElementById('hud-step-tag');
        if (tagEl) tagEl.textContent = isUz ? `${shownStep(state.currentSlide)} / ${SHOWN_TOTAL}-qadam` : `Шаг ${shownStep(state.currentSlide)} из ${SHOWN_TOTAL}`;

        const currentMaze = getCurrentAlgoLevelData();
        const mazeTitle = document.getElementById('algo-mission-title');
        const mazeDesc = document.getElementById('algo-mission-desc');
        if (mazeTitle) mazeTitle.textContent = lang === 'uz' ? currentMaze.titleUz : currentMaze.titleRu;
        if (mazeDesc) mazeDesc.textContent = lang === 'uz' ? currentMaze.descUz : currentMaze.descRu;
        updateStarQuestBar();

        const mTitle = document.getElementById('mentor-step-title');
        const mTip = document.getElementById('mentor-tip-text');
        if (mTitle) mTitle.textContent = isUz ? `${shownStep(state.currentSlide)}-slayd` : `Слайд ${shownStep(state.currentSlide)}`;
        if (mTip && dict.mentor_tips && dict.mentor_tips[state.currentSlide]) {
            mTip.textContent = dict.mentor_tips[state.currentSlide];
        }

        const teamInput = document.getElementById('custom-team-input');
        if (teamInput && dict.code_team_ph) {
            teamInput.placeholder = dict.code_team_ph;
        }
        const btnInput = document.getElementById('custom-btn-input');
        if (btnInput && dict.code_btn_ph) {
            btnInput.placeholder = dict.code_btn_ph;
            if (btnInput.value === "Войти в игру и начать битву!" || btnInput.value === "O'yinga kirish va jangni boshlash!") {
                btnInput.value = isUz ? "O'yinga kirish va jangni boshlash!" : "Войти в игру и начать битву!";
            }
        }
        // Translate starter examples, preserving everything typed by the mentor.
        const starterPairs = [
            ['custom-team-input', 'ЧЕМПИОНАТ ROBLOX & MINECRAFT 2026', 'ROBLOX & MINECRAFT CHEMPIONATI 2026'],
            ['custom-btn-input', 'Запустить турнир и салют!', 'Turnir va mushakbozlikni boshlash!'],
            ['custom-subtitle-input', 'Твоя команда. Твои правила. Твой мир.', 'Sizning jamoangiz. Sizning qoidalaringiz. Sizning olamingiz.']
        ];
        starterPairs.forEach(([id, ru, uz]) => {
            const input = document.getElementById(id);
            if (input && [ru, uz].includes(input.value)) input.value = isUz ? uz : ru;
        });
        const levelStep = document.getElementById('web-level-step');
        if (levelStep) levelStep.setAttribute('aria-label', isUz ? 'Daraja oshishi' : 'Повышение уровня');
        const mazeStatus = document.getElementById('algo-status-msg');
        if (mazeStatus && !state.isAlgoRunning) mazeStatus.textContent = '';
        if (typeof updateLiveWebPreview === 'function') {
            updateLiveWebPreview();
        }

        const queueEmpty = document.querySelector('#algo-commands-list .queue-empty');
        if (queueEmpty && dict.cmd_empty) {
            queueEmpty.textContent = dict.cmd_empty;
        }

        // Sync gift buttons and names on language switch
        document.querySelectorAll('.gift-shop-item').forEach(item => {
            const btn = item.querySelector('.gift-select-btn');
            const isSel = item.classList.contains('selected');
            if (btn) {
                btn.textContent = isSel ? (isUz ? '✓ Tanlandi' : '✓ Выбрано') : (isUz ? 'Tanlash' : 'Выбрать');
            }
        });

        const selectedCards = document.querySelectorAll('.gift-shop-item.selected');
        const chosenNames = [];
        selectedCards.forEach(c => {
            const titleEl = c.querySelector('span[data-i18n]');
            if (titleEl) chosenNames.push(titleEl.textContent.trim());
        });
        const defaultName = isUz ? "VR-ko'zoynak" : "VR-очки";
        const displayNames = chosenNames.length > 0 ? chosenNames.join(', ') : defaultName;
        state.selectedGift = displayNames;
        const chosenName = document.getElementById('chosen-gift-name');
        const finalTarget = document.getElementById('final-target-gift-name');
        if (chosenName) chosenName.textContent = displayNames;
        if (finalTarget) finalTarget.textContent = displayNames;

        if (typeof updateHoloScanner === 'function') {
            updateHoloScanner(state.currentGalaxyPlanet || 0);
        }

        const partModal = document.getElementById('anatomy-part-popup');
        if (partModal && partModal.classList.contains('active') && typeof openBodyPartModal === 'function') {
            openBodyPartModal(state.activeBodyPart || 'js');
        }

        if (typeof updateAnatomyHUD === 'function') updateAnatomyHUD();
    }
    window.setLanguage = setLanguage;

    // --------------------------------------------------------------------------
    // RESET APP (CLEAN SLATE ON DOMCONTENTLOADED / PAGESHOW / F5)
    // --------------------------------------------------------------------------
    function resetApp() {
        state.currentSlide = 0;
        state.coins = 0;
        state.selectedApps = [];
        state.selectedAppsCount = 0;
        state.selectedGift = "VR-очки";
        state.ageCategory = null;
        state.algoQueue = [];
        state.algoPos = { r: 3, c: 0 };
        state.isAlgoRunning = false;
        state.completedTasks = 0;

        const coinEl = document.getElementById('hud-coins');
        const fillEl = document.getElementById('hud-progress-fill');
        const textEl = document.getElementById('hud-progress-text');
        if (coinEl) coinEl.textContent = '0';
        if (fillEl) fillEl.style.width = '0%';
        if (textEl) textEl.textContent = '0%';

        document.querySelectorAll('input[name="lesson-age"]').forEach(input => { input.checked = false; });
        document.documentElement.dataset.lessonAge = '';
        try { selectAgeCategory(sessionStorage.getItem('junior.lessonAge')); } catch (_) {}
        window.updateProgramPreview?.();

        document.querySelectorAll('.app-card').forEach(c => c.classList.remove('selected'));
        updateStarQuestBar();
        const quizBox = document.getElementById('m1-quiz-box');
        if (quizBox) quizBox.classList.add('hidden');
        document.querySelectorAll('.quiz-btn').forEach(b => b.classList.remove('correct', 'wrong'));
        const nextStep1 = document.getElementById('btn-next-step-1');
        if (nextStep1) nextStep1.classList.add('hidden');

        initAlgoGrid();
        renderAlgoQueue();
        const algoMsg = document.getElementById('algo-status-msg');
        if (algoMsg) algoMsg.textContent = '';

        document.querySelectorAll('.gift-shop-item').forEach(i => i.classList.remove('selected'));
        const firstGift = document.querySelector('.gift-shop-item');
        if (firstGift) firstGift.classList.add('selected');
        const chosenBanner = document.getElementById('chosen-gift-banner');
        if (chosenBanner) chosenBanner.classList.remove('hidden');

        const launchModal = document.getElementById('launch-modal');
        if (launchModal) launchModal.classList.remove('active');

        document.querySelectorAll('.task-check-row').forEach(r => r.classList.remove('completed'));
        const taskCount = document.getElementById('tasks-count-display');
        if (taskCount) taskCount.textContent = '0/12';

        updateLiveWebPreview();
        setWebCodeTheme('cyan', '#00E5FF');

        goToSlide(0);
    }
    window.resetApp = resetApp;

    // --------------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        resetApp();
        setLanguage('ru');

        const urlParams = new URLSearchParams(window.location.search);
        const slideParam = urlParams.get('slide');
        if (slideParam !== null) {
            const sIdx = parseInt(slideParam, 10);
            if (!isNaN(sIdx)) goToSlide(sIdx);
        }

        setTimeout(() => {
            initNative3DTilt();
            initParallaxAmbient();
        }, 100);

        const appsContainer = document.getElementById('apps-grid-container');
        if (appsContainer) {
            appsContainer.addEventListener('click', (e) => {
                const card = e.target.closest('.app-card');
                if (card) {
                    const app = card.getAttribute('data-app');
                    toggleApp(card, app, e);
                }
            });
        }




        // 3D Parallax & Depth Tilt for Pixar Helper Cards (Mentor & Curator) - Zero Thrash RAF
        // Interactive Teachers (Mentor & Curator) - Smooth Pixar Hover & Audio Feedback
        document.querySelectorAll('.helper-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                playSfx('pop');
            }, { passive: true });

            card.addEventListener('touchstart', () => {
                card.classList.add('is-waving');
                playSfx('pop');
                setTimeout(() => card.classList.remove('is-waving'), 2400);
            }, { passive: true });
        });

        const mBtn = document.getElementById('btn-mentor-mode');
        const drawer = document.getElementById('mentor-drawer');
        if (mBtn && drawer) {
            mBtn.addEventListener('click', () => drawer.classList.toggle('closed'));
        }

        window.addEventListener('keydown', (e) => {
            const courseModalOpen = document.querySelector('#junior-course-modal.active, #web-anatomy-modal.active, #it-english-modal.active, #coinshop-modal.active, #platform-preview dialog[open]');
            const editing = e.target.closest('input, textarea, select, [contenteditable="true"]');
            if (!courseModalOpen && !editing && e.key === 'ArrowRight') changeSlide(1);
            if (!courseModalOpen && !editing && e.key === 'ArrowLeft') changeSlide(-1);
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm' && drawer) {
                drawer.classList.toggle('closed');
            }
            if (e.key === 'Escape') {
                if (typeof window.closeWebAnatomyModal === 'function') window.closeWebAnatomyModal();
                if (typeof window.closeEnglishModal === 'function') window.closeEnglishModal();
                if (typeof window.closeEnglishVisionModal === 'function') window.closeEnglishVisionModal();
                if (typeof window.closeJuniorCourseMap === 'function') window.closeJuniorCourseMap();
            }
        });

        window.addEventListener('pointerdown', () => {
            const ctx = getAudioContext();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume();
            }
        }, { once: true });
    });

    document.addEventListener('visibilitychange', () => {
        document.documentElement.classList.toggle('page-hidden', document.hidden);
        if (document.hidden) { stopAlgoRun(); resetCelebration(); if (state.audioContext) state.audioContext.suspend().catch(() => {}); }
    });

    window.addEventListener('pageshow', () => {
        if (typeof window.resetApp === 'function') window.resetApp();
    });

    // ==========================================================================
    // JUNIOR KURS COSMIC GALAXY MAP (SOLAR SYSTEM & MODULES)
    // ==========================================================================
    const galaxyModulesData = [
        {
            num: "01",
            color: "#10B981",
            nameKey: "galaxy_mod1_title",
            descKey: "galaxy_mod1_desc",
            items: ["galaxy_mod1_i1", "galaxy_mod1_i2", "galaxy_mod1_i3"],
            shuttleTop: "calc(50% - 135px - 14px)",
            shuttleLeft: "calc(50% + 28px)",
            shuttleAngle: "-45deg"
        },
        {
            num: "02",
            color: "#A855F7",
            nameKey: "galaxy_mod2_title",
            descKey: "galaxy_mod2_desc",
            items: ["galaxy_mod2_i1", "galaxy_mod2_i2", "galaxy_mod2_i3"],
            shuttleTop: "calc(50% - 30px)",
            shuttleLeft: "calc(50% + 180px - 44px)",
            shuttleAngle: "45deg"
        },
        {
            num: "03",
            color: "#3B82F6",
            nameKey: "galaxy_mod3_title",
            descKey: "galaxy_mod3_desc",
            items: ["galaxy_mod3_i1", "galaxy_mod3_i2", "galaxy_mod3_i3"],
            shuttleTop: "calc(50% + 135px - 14px)",
            shuttleLeft: "calc(50% - 46px)",
            shuttleAngle: "135deg"
        },
        {
            num: "04",
            color: "#F97316",
            nameKey: "galaxy_mod4_title",
            descKey: "galaxy_mod4_desc",
            items: ["galaxy_mod4_i1", "galaxy_mod4_i2", "galaxy_mod4_i3"],
            shuttleTop: "calc(50% - 30px)",
            shuttleLeft: "calc(50% - 180px + 32px)",
            shuttleAngle: "-135deg"
        }
    ];

    state.currentGalaxyPlanet = 0;
    state.galaxyViewMode = "solar";

    function selectGalaxyPlanet(index, silent) {
        if (index < 0 || index >= galaxyModulesData.length) return;
        state.currentGalaxyPlanet = index;
        if (!silent) playSfx("planet", index);

        for (let i = 0; i < 4; i++) {
            const node = document.getElementById(`planet-node-${i}`);
            const qpill = document.getElementById(`sq-pill-${i}`);
            if (node) {
                node.classList.toggle("active", i === index);
                node.setAttribute("aria-selected", i === index ? "true" : "false");
            }
            if (qpill) {
                qpill.classList.toggle("active", i === index);
                qpill.setAttribute("aria-selected", i === index ? "true" : "false");
            }
        }

        const shuttle = document.getElementById("galaxy-space-shuttle");
        const mod = galaxyModulesData[index];
        if (shuttle && mod) {
            shuttle.style.top = mod.shuttleTop;
            shuttle.style.left = mod.shuttleLeft;
            shuttle.style.transform = `rotate(${mod.shuttleAngle})`;
        }

        updateHoloScanner(index);
    }
    window.selectGalaxyPlanet = selectGalaxyPlanet;

    function openJuniorCourseMap() {
        playSfx("fanfare");
        fireCelebration("step", { origin: { y: 0.6 } });
        const modal = document.getElementById("junior-course-modal");
        if (modal) {
            modal.classList.add("active");
            selectGalaxyPlanet(state.currentGalaxyPlanet || 0, true);
        }
        const isUz = state.currentLang === "uz";
    }
    window.openJuniorCourseMap = openJuniorCourseMap;

    function closeJuniorCourseMap(event) {
        if (event && event.target) {
            const isOverlay = event.target.classList.contains("galaxy-modal-overlay");
            const isCloseBtn = !!event.target.closest(".galaxy-close-btn");
            if (!isOverlay && !isCloseBtn) {
                return;
            }
        }
        playSfx("click");
        const modal = document.getElementById("junior-course-modal");
        if (modal) modal.classList.remove("active");
    }
    window.closeJuniorCourseMap = closeJuniorCourseMap;

    function setGalaxyViewMode(mode) {
        playSfx("click");
        state.galaxyViewMode = mode;
    }
    window.setGalaxyViewMode = setGalaxyViewMode;

    window.stepGalaxyPlanet = function (dir) {
        let next = (state.currentGalaxyPlanet || 0) + dir;
        if (next < 0) next = galaxyModulesData.length - 1;
        if (next >= galaxyModulesData.length) next = 0;
        selectGalaxyPlanet(next);
    };

    window.triggerSunPulse = function () {
        playSfx("sun");
        fireCelebration("micro");
        const isUz = state.currentLang === "uz";
        const msg = isUz
            ? "Junior IT — bilimlar quyoshi! Har bir sayyora yangi IT ko'nikmalarini beradi!"
            : "Junior IT — Солнце Знаний! Вокруг него вращаются 4 планеты твоего успеха в IT!";
        updateRobotSpeechBubble(msg);
        const sun = document.querySelector(".solar-sun-anchor");
        if (sun) {
            sun.classList.add("pulse-active");
            setTimeout(() => sun.classList.remove("pulse-active"), 600);
        }
    };

    window.startGalaxyModule = function (idx) {
        const modIndex = typeof idx === "number" ? idx : (state.currentGalaxyPlanet || 0);
        playSfx("fanfare");
        fireCelebration("triumph");
        const dict = translations[state.currentLang] || translations.ru;
        const mod = galaxyModulesData[modIndex];
        const modTitle = dict[mod.nameKey] || `Модуль ${mod.num}`;
        const isUz = state.currentLang === "uz";
        const msg = isUz
            ? `Ajoyib tanlov! «${modTitle}» moduli bo'yicha mashg'ulotlar tez orada boshlanadi!`
            : `Отличный выбор! Изучение модуля «${modTitle}» приведет тебя к созданию крутых проектов!`;
        updateRobotSpeechBubble(msg);
        if (window.liveRobot) window.liveRobot.triggerHappy();
    };

    function updateHoloScanner(idx) {
        const mod = galaxyModulesData[idx];
        if (!mod) return;
        const dict = translations[state.currentLang] || translations.ru;

        const badge = document.getElementById("holo-mod-badge");
        const title = document.getElementById("holo-mod-title");
        const desc = document.getElementById("holo-mod-desc");
        const s1 = document.getElementById("holo-skill-1");
        const s2 = document.getElementById("holo-skill-2");
        const s3 = document.getElementById("holo-skill-3");
        const scanner = document.getElementById("solar-holo-scanner");
        const ctaBtn = document.getElementById("galaxy-cta-btn");

        if (badge) {
            badge.textContent = `${state.currentLang === "uz" ? "SAYYORA" : "ПЛАНЕТА"} ${mod.num}`;
            badge.style.background = mod.color;
        }
        if (title) title.textContent = dict[mod.nameKey] || "";
        if (desc) desc.textContent = dict[mod.descKey] || "";
        if (s1) s1.textContent = dict[mod.items[0]] || "";
        if (s2) s2.textContent = dict[mod.items[1]] || "";
        if (s3) s3.textContent = dict[mod.items[2]] || "";

        if (scanner) {
            scanner.style.borderColor = mod.color + "70";
            scanner.style.boxShadow = `0 12px 32px -6px ${mod.color}40, inset 0 0 24px ${mod.color}18`;
        }
        if (ctaBtn) {
            ctaBtn.style.background = `linear-gradient(135deg, ${mod.color} 0%, #FF7A00 100%)`;
            ctaBtn.style.boxShadow = `0 8px 24px -4px ${mod.color}66`;
        }
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const itEnModal = document.getElementById("it-english-modal");
            if (itEnModal && itEnModal.classList.contains("active")) {
                if (typeof window.closeEnglishModal === 'function') window.closeEnglishModal();
                return;
            }
            const visionModal = document.getElementById("english-vision-modal");
            if (visionModal && visionModal.classList.contains("active")) {
                window.closeEnglishVisionModal();
                return;
            }
            const modal = document.getElementById("junior-course-modal");
            if (modal && modal.classList.contains("active")) {
                window.closeJuniorCourseMap();
            }
            const partModal = document.getElementById("anatomy-part-popup");
            if (partModal && partModal.classList.contains("active")) {
                window.closeBodyPartModal();
                return;
            }
            const webModal = document.getElementById("web-anatomy-modal");
            if (webModal && webModal.classList.contains("active")) {
                window.closeWebAnatomyModal();
            }
        }
    });

    // ==========================================================================
    // INTERACTIVE CHARACTER ANATOMY: 3 BODY ZONES (JS BRAIN, HTML HEART, CSS CLOTHES)
    // ==========================================================================
    state.activeBodyPart = null;

    const anatomyBodyPartsData = (window.JuniorI18n && window.JuniorI18n.anatomyBodyPartsData) || {};

    function openBodyPartModal(part) {
        state.activeBodyPart = part;
        const data = anatomyBodyPartsData[part] || anatomyBodyPartsData.html;
        const isUz = state.currentLang === 'uz';

        const popup = document.getElementById('anatomy-part-popup');
        const avatarWrap = document.getElementById('part-avatar-svg-wrap');
        const avatarGlow = document.getElementById('part-avatar-glow');
        const roleBadge = document.getElementById('part-role-badge');
        const titleEl = document.getElementById('part-popup-title');
        const descEl = document.getElementById('part-popup-desc');
        const fileEl = document.getElementById('part-code-filename');
        const chipEl = document.getElementById('part-code-chip');
        const codeEl = document.getElementById('part-code-content');

        if (avatarWrap) avatarWrap.innerHTML = data.svg;
        if (roleBadge) {
            roleBadge.textContent = isUz ? data.roleBadgeUz : data.roleBadgeRu;
            roleBadge.style.color = data.color;
            roleBadge.style.borderColor = data.color + '40';
            roleBadge.style.background = data.color + '15';
        }
        if (avatarGlow) {
            avatarGlow.style.borderColor = data.color;
            avatarGlow.style.boxShadow = `0 0 32px ${data.color}55`;
        }
        if (titleEl) titleEl.textContent = isUz ? data.titleUz : data.titleRu;
        if (descEl) descEl.textContent = isUz ? data.descUz : data.descRu;
        if (fileEl) {
            fileEl.textContent = data.filename;
            fileEl.style.color = data.color;
        }
        if (chipEl) chipEl.textContent = isUz ? data.chipUz : data.chipRu;
        if (codeEl) codeEl.textContent = isUz ? (data.codeUz || data.code) : (data.codeRu || data.code);

        if (popup) {
            popup.classList.add('active');
        }

        playSfx('pop');
        if (part === 'js') {
            playSfx('fanfare');
            fireCelebration('micro', { origin: { y: 0.55 } });
        }
    }
    window.openBodyPartModal = openBodyPartModal;

    function closeBodyPartModal(event) {
        if (event && event.target) {
            const isOverlay = event.target.classList.contains('anatomy-part-popup-overlay');
            const isCloseBtn = !!event.target.closest('.anatomy-part-card-close');
            const isGotItBtn = !!event.target.closest('.part-gotit-btn');
            if (!isOverlay && !isCloseBtn && !isGotItBtn) {
                return;
            }
        }
        playSfx('click');
        const popup = document.getElementById('anatomy-part-popup');
        if (popup) {
            popup.classList.remove('active');
        }
    }
    window.closeBodyPartModal = closeBodyPartModal;

    function openWebAnatomyModal() {
        playSfx('fanfare');
        fireCelebration('step', { origin: { y: 0.6 } });
        const modal = document.getElementById('web-anatomy-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }
    window.openWebAnatomyModal = openWebAnatomyModal;

    function closeWebAnatomyModal(event) {
        if (event && event.target) {
            const isOverlay = event.target.classList.contains('anatomy-modal-overlay');
            const isCloseBtn = !!event.target.closest('.anatomy-close-btn');
            if (!isOverlay && !isCloseBtn) {
                return;
            }
        }
        playSfx('click');
        const popup = document.getElementById('anatomy-part-popup');
        if (popup) popup.classList.remove('active');
        const modal = document.getElementById('web-anatomy-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    window.closeWebAnatomyModal = closeWebAnatomyModal;

    // --------------------------------------------------------------------------
    // IT ENGLISH ONBOARDING PRESENTATION MODAL CONTROLLER (AGES 8-13)
    // --------------------------------------------------------------------------
    let currentEnglishTab = 0;

    function openEnglishModal() {
        const modal = document.getElementById('it-english-modal');
        if (!modal) return;
        modal.classList.add('active');
        playSfx('pop');
        switchEnglishTab(0);
    }
    window.openEnglishModal = openEnglishModal;
    window.openEnglishVisionModal = openEnglishModal; // Alias for backward compatibility

    function closeEnglishModal(event) {
        if (event && event.target) {
            const isOverlay = event.target.classList.contains('it-english-modal-overlay');
            const isCloseBtn = !!event.target.closest('.it-en-close-btn');
            if (!isOverlay && !isCloseBtn) {
                return;
            }
        }
        playSfx('click');
        const modal = document.getElementById('it-english-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    window.closeEnglishModal = closeEnglishModal;
    window.closeEnglishVisionModal = closeEnglishModal; // Alias for backward compatibility

    function switchEnglishTab(tabIdx) {
        currentEnglishTab = tabIdx;
        const modal = document.getElementById('it-english-modal');
        if (!modal) return;

        for (let i = 0; i < 3; i++) {
            const tabBtn = document.getElementById('it-en-tab-' + i);
            const panel = document.getElementById('it-en-panel-' + i);
            const isActive = (i === tabIdx);

            if (tabBtn) {
                tabBtn.classList.toggle('active', isActive);
                tabBtn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            }
            if (panel) {
                panel.classList.toggle('active', isActive);
            }
        }

        playSfx('click');

        if (tabIdx === 2) {
            fireCelebration('step', { origin: { y: 0.6 } });
        }
    }
    window.switchEnglishTab = switchEnglishTab;

    function flipEnglishCard(cardEl) {
        if (!cardEl) return;
        cardEl.classList.toggle('flipped');
        playSfx('pop');
    }
    window.flipEnglishCard = flipEnglishCard;

    function enrollTrialLesson() {
        playSfx('fanfare');
        closeEnglishModal();
        if (typeof window.teleportToLMS === 'function') {
            window.teleportToLMS();
        }
    }
    window.enrollTrialLesson = enrollTrialLesson;

    // Keyboard accessibility (Enter / Space to flip cards, Esc to close CoinShop modal)
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && document.activeElement && document.activeElement.classList.contains('it-flipcard')) {
            e.preventDefault();
            flipEnglishCard(document.activeElement);
        }
        if (e.key === 'Escape') {
            const coinModal = document.getElementById('coinshop-modal');
            if (coinModal && coinModal.classList.contains('active')) {
                closeCoinShopModal();
            }
            const certModal = document.getElementById('cert-detail-modal');
            if (certModal && certModal.classList.contains('active')) {
                closeCertModal();
            }
        }
    });

})();

