document.addEventListener('DOMContentLoaded', () => {

    const triggerOverlay = document.getElementById('triggerOverlay');
    const startButton = document.getElementById('startButton');
    const loadingBar = document.getElementById('loadingBar');
    const statusText = document.getElementById('statusText');
    const ambientLight = document.getElementById('ambientLight');
    const roseWrapper = document.getElementById('roseWrapper');
    const roseHead = document.getElementById('roseHead');
    const calyx = document.getElementById('calyx');
    const stem = document.getElementById('stem');
    const leafLeft = document.getElementById('leafLeft');
    const leafRight = document.getElementById('leafRight');
    const endText = document.getElementById('endText');
    const fallingPetalsEl = document.getElementById('fallingPetals');
    const scene = document.querySelector('.scene');

    const notifChip = document.getElementById('notifChip');
    const letterOverlay = document.getElementById('letterOverlay');
    const letterBody = document.getElementById('letterBody');
    const letterClose = document.getElementById('letterClose');
    const letterSigner = document.getElementById('letterSigner');

    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicLabel = document.getElementById('musicLabel');

    // ---- Customize your message here ----
    const RECIPIENT_NAME = 'Nidhu';
    const SENDER_NAME = 'Nidhu ✨';
    const LETTER_TEXT =
        `Dearest Nidhu,\n\nPhilosophy often ponders what gives true meaning to our fleeting existence in this vast, quiet cosmos.\n\nI think the answer is simple: it is the rare souls who effortlessly bring grace, warmth, and wonder into ordinary days.\n\nIn a universe constantly in motion, your presence feels like calm harmony. You remind me that genuine beauty isn't merely observed—it is felt in the depth of a thought, the sincerity of a smile, and the quiet light you carry wherever you go.\n\nToday is a celebration not just of another year passing, but of the universe becoming a little more exquisite the day you arrived.\n\nMay this year bring you peace, joy, and every dream your heart secretly holds.\n\nHappy Birthday, Nidhu. Keep blooming in your own timeless rhythm. 🌹✨`;
    // --------------------------------------

    if (letterSigner) {
        letterSigner.textContent = SENDER_NAME;
    }

    const PETAL_LAYERS = [
        { count: 4, w: 24, h: 46, curl: 78, delayBase: 0, tz: 2, cls: 'petal-bud' },
        { count: 5, w: 34, h: 58, curl: 65, delayBase: 0.25, tz: 9, cls: 'petal-core' },
        { count: 6, w: 46, h: 72, curl: 48, delayBase: 0.55, tz: 18, cls: 'petal-inner' },
        { count: 7, w: 58, h: 88, curl: 22, delayBase: 0.90, tz: 30, cls: 'petal-mid-inner' },
        { count: 8, w: 72, h: 104, curl: -5, delayBase: 1.30, tz: 44, cls: 'petal-mid' },
        { count: 9, w: 86, h: 118, curl: -25, delayBase: 1.75, tz: 60, cls: 'petal-outer' },
        { count: 10, w: 98, h: 130, curl: -48, delayBase: 2.25, tz: 76, cls: 'petal-blush' },
    ];

    const SEPALS_COUNT = 5;

    const FALLING_PETAL_COLORS = [
        ['#9a001d', '#3d0008'],
        ['#850018', '#2b0005'],
        ['#ad0022', '#480008'],
        ['#bf0028', '#52000c'],
    ];

    let fallingPetalInterval = null;


    function startCardLoader() {
        const duration = 2400;
        const steps = [
            { threshold: 20, text: 'Measuring the geometry of stars...' },
            { threshold: 50, text: 'Gathering stardust & quiet wonder...' },
            { threshold: 80, text: 'Weaving admiration into digital velvet...' },
            { threshold: 95, text: 'Aligning the petals of time...' },
            { threshold: 100, text: 'Are you Ready Nidhu?!' }
        ];

        let startTimestamp = null;

        function animateLoader(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const percent = Math.floor(progress * 100);

            loadingBar.style.width = `${percent}%`;
            const activeStep = steps.find(s => percent <= s.threshold) || steps[steps.length - 1];
            statusText.textContent = activeStep.text;

            if (progress < 1) {
                requestAnimationFrame(animateLoader);
            } else {
                startButton.removeAttribute('disabled');
            }
        }

        requestAnimationFrame(animateLoader);
    }


    function createSepals() {
        const step = 360 / SEPALS_COUNT;
        for (let i = 0; i < SEPALS_COUNT; i++) {
            const sepal = document.createElement('div');
            sepal.className = 'sepal';
            const angle = i * step + (Math.random() - 0.5) * 5;
            const delay = 0.3 + i * 0.06;
            const curl = 18 + Math.random() * 8;

            sepal.style.setProperty('--sepal-angle', `${angle}deg`);
            sepal.style.setProperty('--sepal-curl', `${curl}deg`);
            sepal.style.setProperty('--sepal-delay', `${delay}s`);
            calyx.appendChild(sepal);
        }
    }

    function createPetals() {
        PETAL_LAYERS.forEach((layer, li) => {
            const angleStep = 360 / layer.count;
            const layerOffset = li * 24 + (Math.random() - 0.5) * 8;

            for (let i = 0; i < layer.count; i++) {
                const petal = document.createElement('div');
                petal.className = `petal ${layer.cls}`;

                const angle = layerOffset + i * angleStep + (Math.random() - 0.5) * 5;
                const delay = layer.delayBase + i * 0.05;
                const curlJitter = (Math.random() - 0.5) * 6;
                const scaleJitter = 0.94 + Math.random() * 0.12;
                const bloomDur = 2.1 + Math.random() * 0.4;

                petal.style.width = `${layer.w}px`;
                petal.style.height = `${layer.h}px`;
                petal.style.setProperty('--angle', `${angle}deg`);
                petal.style.setProperty('--curl', `${layer.curl + curlJitter}deg`);
                petal.style.setProperty('--scale', scaleJitter);
                petal.style.setProperty('--delay', `${delay}s`);
                petal.style.setProperty('--tz', `${layer.tz}px`);
                petal.style.setProperty('--bloom-dur', `${bloomDur}s`);

                roseHead.appendChild(petal);
            }
        });
    }

    function growStem() {
        return new Promise(resolve => {
            stem.classList.add('grow');

            setTimeout(() => {
                leafLeft.classList.add('visible');
            }, 800);

            setTimeout(() => {
                leafRight.classList.add('visible');
            }, 1100);

            setTimeout(resolve, 2200);
        });
    }

    function bloom() {
        calyx.classList.add('visible');
        ambientLight.classList.add('visible');
        roseHead.classList.add('blooming');
    }

    function spawnFallingPetal() {
        if (fallingPetalsEl.childElementCount > 10) return;

        const petal = document.createElement('div');
        petal.className = 'falling-petal';

        const w = 10 + Math.random() * 12;
        const h = w * (1.25 + Math.random() * 0.15);
        const x = 20 + Math.random() * 60;
        const y = 3 + Math.random() * 10;
        const dur = 5.5 + Math.random() * 3.5;
        const delay = Math.random() * 0.6;

        const colors = FALLING_PETAL_COLORS[Math.floor(Math.random() * FALLING_PETAL_COLORS.length)];

        const sign = () => (Math.random() > 0.5 ? 1 : -1);
        const s1 = sign() * (15 + Math.random() * 25);
        const s2 = sign() * (10 + Math.random() * 20);
        const s3 = sign() * (20 + Math.random() * 30);
        const s4 = sign() * (10 + Math.random() * 15);

        petal.style.left = `${x}vw`;
        petal.style.top = `${y}vh`;
        petal.style.setProperty('--fp-w', `${w}px`);
        petal.style.setProperty('--fp-h', `${h}px`);
        petal.style.setProperty('--fp-c1', colors[0]);
        petal.style.setProperty('--fp-c2', colors[1]);
        petal.style.setProperty('--f-dur', `${dur}s`);
        petal.style.setProperty('--f-delay', `${delay}s`);
        petal.style.setProperty('--s1', `${s1}px`);
        petal.style.setProperty('--s2', `${s2}px`);
        petal.style.setProperty('--s3', `${s3}px`);
        petal.style.setProperty('--s4', `${s4}px`);

        fallingPetalsEl.appendChild(petal);

        setTimeout(() => {
            if (petal.parentNode) petal.remove();
        }, (dur + delay) * 1000 + 300);
    }

    function startFallingPetals() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => spawnFallingPetal(), i * 300);
        }

        fallingPetalInterval = setInterval(() => {
            spawnFallingPetal();
        }, 2200);
    }


    async function startAnimationSequence() {
        // Envelope pops in exactly 8s after the bloom animation begins
        setTimeout(() => {
            showNotifChip();
        }, 8000);

        await growStem();
        await delay(100);
        bloom();

        setTimeout(() => {
            roseWrapper.classList.add('rotating');
        }, 2600);

        setTimeout(() => startFallingPetals(), 3400);

        setTimeout(() => {
            endText.classList.add('visible');
        }, 4600);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let isLetterOpen = false;
    let isLetterTyping = false;

    function showNotifChip() {
        notifChip.classList.add('show');
    }

    function openLetter() {
        if (isLetterOpen) return;
        isLetterOpen = true;
        letterOverlay.classList.add('active');

        letterBody.innerHTML = '';
        if (isLetterTyping) return;
        isLetterTyping = true;

        let charIdx = 0;
        function typeChar() {
            if (!isLetterOpen) {
                isLetterTyping = false;
                return;
            }
            if (charIdx < LETTER_TEXT.length) {
                const char = LETTER_TEXT[charIdx];
                letterBody.innerHTML += (char === '\n') ? '<br>' : char;
                charIdx++;
                setTimeout(typeChar, 28);
            } else {
                isLetterTyping = false;
            }
        }
        setTimeout(typeChar, 350);
    }

    function closeLetter() {
        isLetterOpen = false;
        letterOverlay.classList.remove('active');
    }

    // ============================
    // Background Music Controls
    // ============================
    let isMusicPlaying = false;
    let fadeInterval = null;

    function playAudio() {
        if (!bgMusic) return;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isMusicPlaying = true;
                if (musicToggle) {
                    musicToggle.classList.remove('paused');
                    musicToggle.classList.add('playing');
                }
                if (musicLabel) musicLabel.textContent = 'Music On';

                // Smooth volume fade-in
                clearInterval(fadeInterval);
                bgMusic.volume = 0.05;
                const targetVol = 0.75;
                fadeInterval = setInterval(() => {
                    if (bgMusic.volume < targetVol) {
                        bgMusic.volume = Math.min(targetVol, bgMusic.volume + 0.05);
                    } else {
                        clearInterval(fadeInterval);
                    }
                }, 100);
            }).catch(err => {
                console.log('Audio playback waiting for user interaction:', err);
            });
        }
    }

    function pauseAudio() {
        if (!bgMusic) return;
        isMusicPlaying = false;
        if (musicToggle) {
            musicToggle.classList.remove('playing');
            musicToggle.classList.add('paused');
        }
        if (musicLabel) musicLabel.textContent = 'Music Off';

        // Smooth volume fade-out
        clearInterval(fadeInterval);
        fadeInterval = setInterval(() => {
            if (bgMusic.volume > 0.08) {
                bgMusic.volume = Math.max(0, bgMusic.volume - 0.08);
            } else {
                bgMusic.pause();
                clearInterval(fadeInterval);
            }
        }, 50);
    }

    function toggleAudio() {
        if (isMusicPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', toggleAudio);
    }

    notifChip.addEventListener('click', openLetter);
    letterClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLetter();
    });
    letterOverlay.addEventListener('click', (e) => {
        if (e.target === letterOverlay) closeLetter();
    });

    startButton.addEventListener('click', () => {
        triggerOverlay.classList.add('fade-out');
        playAudio();

        setTimeout(() => {
            startAnimationSequence();
        }, 800);
    });
    createSepals();
    createPetals();

    setTimeout(() => {
        startCardLoader();
    }, 400);

});
