document.addEventListener('DOMContentLoaded', () => {

  /*  Reset warp styles when page is restored via back/forward cache  */
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      isWarpingReset();
      document.querySelectorAll('.tw-letter').forEach(el => el.classList.remove('shown'));
      setTimeout(runTypewriter, 950);
    }
  });

  function isWarpingReset(){
    const resetTargets = [
      document.querySelector('.nav'),
      document.querySelector('.hero-text'),
      document.querySelector('.bottom-left'),
      document.getElementById('exploreBtn')
    ];
    resetTargets.forEach(el => {
      if (!el) return;
      el.style.transform = '';
      el.style.opacity = '';
      el.style.filter = '';
      el.style.willChange = '';
    });

    const bg = document.querySelector('.bg-image');
    if (bg){
      bg.classList.remove('warping');
      bg.style.animation = '';
      bg.style.transform = '';
    }
    const swirl = document.querySelector('.disk-swirl');
    if (swirl){
      swirl.style.animation = '';
      swirl.style.transform = '';
      swirl.style.opacity = '';
    }
    const overlay = document.getElementById('warpOverlay');
    if (overlay) overlay.classList.remove('active');

    isWarping = false;
  }

  /*  Mobile menu toggle  */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /*  Typewriter reveal for "BLACK SECRET" title (no cursor) */
  function runTypewriter(){
    const line1Letters = Array.from(document.getElementById('line1').querySelectorAll('.tw-letter'));
    const line2Letters = Array.from(document.getElementById('line2').querySelectorAll('.tw-letter'));
    const allLetters = [...line1Letters, ...line2Letters];

    if (allLetters.length === 0) return;

    const LETTER_SPEED = 200;   
    const WORD_PAUSE = 460;   

    let i = 0;
    function typeNext(){
      if (i >= allLetters.length) return;

      allLetters[i].classList.add('shown');
      i++;
      const isWordBoundary = i === line1Letters.length; 
      setTimeout(typeNext, isWordBoundary ? LETTER_SPEED + WORD_PAUSE : LETTER_SPEED);
    }
    typeNext();
  }

  setTimeout(runTypewriter, 950);

  /*  Tagline carousel  */
  const taglines = [
    "one star's end is a black hole's beginning..",
    "gravity so strong, even light cannot escape..",
    "time slows to a crawl at the event horizon..",
    "a singularity hides at the heart of the dark.."
  ];
  let taglineIndex = 0;
  const taglineEl = document.getElementById('tagline');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function setTagline(newIndex){
    taglineEl.classList.add('fade');
    setTimeout(() => {
      taglineIndex = newIndex;
      taglineEl.textContent = taglines[taglineIndex];
      taglineEl.classList.remove('fade');
    }, 300);
  }

  const TAGLINE_INTERVAL = 6000; 
  let taglineTimer = null;

  function startTaglineAutoplay(){
    if (taglineTimer) clearInterval(taglineTimer);
    taglineTimer = setInterval(() => {
      const newIndex = (taglineIndex + 1) % taglines.length;
      setTagline(newIndex);
    }, TAGLINE_INTERVAL);
  }

  function restartTaglineAutoplay(){
    startTaglineAutoplay();
  }

  nextBtn.addEventListener('click', () => {
    const newIndex = (taglineIndex + 1) % taglines.length;
    setTagline(newIndex);
    restartTaglineAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    const newIndex = (taglineIndex - 1 + taglines.length) % taglines.length;
    setTagline(newIndex);
    restartTaglineAutoplay();
  });

  startTaglineAutoplay();

  /*  Explore button: spiral-suck into black hole, then go to next page  */
  const exploreBtn = document.getElementById('exploreBtn');
  const warpOverlay = document.getElementById('warpOverlay');
  const scenePanel = document.querySelector('.scene');
  const bgImageEl = document.querySelector('.bg-image');
  let isWarping = false;

  // approximate position of the event horizon center within the image (%)
  const HOLE_X_PERCENT = 0.63;
  const HOLE_Y_PERCENT = 0.48;

  function spiralSuck(el, holeX, holeY, delayMs, durationMs){
    const rect = el.getBoundingClientRect();
    const sceneRect = scenePanel.getBoundingClientRect();
    const startX = rect.left - sceneRect.left + rect.width / 2;
    const startY = rect.top - sceneRect.top + rect.height / 2;

    const radius0 = Math.hypot(holeX - startX, holeY - startY);
    const angle0 = Math.atan2(startY - holeY, startX - holeX);
    // how many extra radians to spin while spiraling in (varies a bit per element)
    const spinAmount = Math.PI * (2.4 + Math.random() * 1.4);
    const spinDirection = Math.random() > 0.5 ? 1 : -1;

    el.style.transition = 'none';
    el.style.willChange = 'transform, opacity, filter';

    let startTime = null;

    function frame(now){
      if (startTime === null) startTime = now;
      const elapsed = now - startTime - delayMs;
      if (elapsed < 0){
        requestAnimationFrame(frame);
        return;
      }
      let t = Math.min(elapsed / durationMs, 1);
      // ease-in: slow at first, accelerates hard toward the end (gravity pulling in)
      const eased = Math.pow(t, 2.6);

      const radius = radius0 * (1 - eased);
      const angle = angle0 + spinDirection * spinAmount * eased;

      const targetX = holeX + radius * Math.cos(angle);
      const targetY = holeY + radius * Math.sin(angle);

      const dx = targetX - startX;
      const dy = targetY - startY;
      const scale = Math.max(1 - eased * 0.98, 0.02);
      const selfRotate = spinDirection * eased * 620; // deg, extra spin of the element itself
      const opacity = t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45;
      const blur = eased * 7;

      el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale}) rotate(${selfRotate}deg)`;
      el.style.opacity = String(Math.max(opacity, 0));
      el.style.filter = `blur(${blur}px)`;

      if (t < 1){
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  }

  exploreBtn.addEventListener('click', () => {
    if (isWarping) return;
    isWarping = true;

    const sceneRect = scenePanel.getBoundingClientRect();
    const holeX = sceneRect.width * HOLE_X_PERCENT;
    const holeY = sceneRect.height * HOLE_Y_PERCENT;

    // elements that should get spiraled toward the hole
    const targets = [
      document.querySelector('.nav'),
      document.querySelector('.hero-text'),
      document.querySelector('.bottom-left'),
      exploreBtn
    ];

    const DURATION = 1500;
    targets.forEach((el, i) => {
      if (!el) return;
      spiralSuck(el, holeX, holeY, i * 60, DURATION);
    });

    // background image zooms into the hole rapidly (stop the ambient slowZoom first)
    bgImageEl.style.animation = 'none';
    bgImageEl.classList.add('warping');
    bgImageEl.style.transformOrigin = `${HOLE_X_PERCENT * 100}% ${HOLE_Y_PERCENT * 100}%`;
    void bgImageEl.offsetWidth;
    bgImageEl.style.transform = 'scale(3.4) rotate(25deg)';

    // spiral the accretion-disk swirl overlay into the hole too
    const diskSwirlEl = document.querySelector('.disk-swirl');
    if (diskSwirlEl) {
      diskSwirlEl.style.animation = 'none';
      diskSwirlEl.style.transition = 'transform 1s cubic-bezier(0.6,0,0.85,0.35), opacity 0.8s ease';
      void diskSwirlEl.offsetWidth;
      diskSwirlEl.style.transform = 'translate(-50%,-50%) scale(0.05) rotate(720deg)';
      diskSwirlEl.style.opacity = '0';
    }

    // fade the whole scene to black, starting slightly after the spiral begins
    setTimeout(() => {
      warpOverlay.classList.add('active');
    }, 300);

    // screen is fully black by ~1200ms; hold black for another ~1000ms, then navigate
    setTimeout(() => {
      window.location.href = 'next.html';
    }, 2400);
  });

  /*  Parallax on mouse move (desktop)  */
  const scene = document.querySelector('.scene');
  const bgImage = document.querySelector('.bg-image');
  const cursorGlow = document.getElementById('cursorGlow');
  const heroText = document.querySelector('.hero-text');

  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (!isTouchDevice) {
    scene.addEventListener('mousemove', (e) => {
      const rect = scene.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // background parallax
      bgImage.style.transform = `scale(1.1) translate(${x * -18}px, ${y * -18}px)`;

      // hero text subtle parallax (opposite direction, smaller)
      heroText.style.transform = `translate(${x * 10}px, ${y * 6}px)`;

      // cursor glow follows pointer
      cursorGlow.style.left = `${e.clientX - rect.left}px`;
      cursorGlow.style.top = `${e.clientY - rect.top}px`;
      cursorGlow.style.opacity = '1';
    });

    scene.addEventListener('mouseleave', () => {
      bgImage.style.transform = '';
      heroText.style.transform = '';
      cursorGlow.style.opacity = '0';
    });
  }

  /*  Keyboard accessibility for arrows  */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
  });

});

